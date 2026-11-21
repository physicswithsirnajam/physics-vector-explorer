#!/usr/bin/env node
'use strict';
/* V99-E: offline contract tests of UNDEPLOYED report intake CORE.
 * Uses real public Grade XI question IDs, mock trusted identity and a
 * SERIALIZABLE in-memory transaction adapter. Absolutely no Firebase access.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createIntakeService,IntakeError,DAILY_LIMIT,COOLDOWN_MS}=
 require('../server/mcq-review-intake-v99e.cjs');
const contract=require('../shared/mcq-review-contract-v99a.js');

const root=path.resolve(__dirname,'..');
const bankPaths=[
 'question-bank/grade-11/unit-01.json',
 'question-bank/grade-11/unit-02.json',
 'question-bank/grade-11/unit-03-stage2-80-practice.json',
 'question-bank/grade-11/unit-04-v39-80-practice.json',
 'question-bank/grade-11/unit-05-v50-16-student.json',
 'question-bank/grade-11/unit-06-topic-61-v76-80-source.json'
];
const samples=bankPaths.map((name,i)=>{
 const bank=JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
 const q=bank.questions?.[0];
 assert.ok(q?.id&&Number.isInteger(q?.sourceQuestionNumber),'real source item '+name);
 return {
  unit:i+1,id:q.id,sourceQuestionNumber:q.sourceQuestionNumber,
  bankVersion:bank.bankVersion||bank.version||'unit-05-public-v50',
  publicPractice:true
 };
});
function enrollment(uid){return {uid,grade:11,board:'fbise',type:'independent',status:'active'};}
function draft(q,category='missing-context',note='A scenario diagram may not be displayed.'){
 return contract.buildDraft({
  unit:q.unit,questionId:q.id,sourceQuestionNumber:q.sourceQuestionNumber,
  bankVersion:q.bankVersion,category,note
 });
}
function identity(uid,verified=true){return {uid,emailVerified:verified};}
function fakeDatabase(){
 const reports=new Map(),rates=new Map();
 let tail=Promise.resolve();
 let failNext=false;
 let commits=0;
 async function runTransaction(action){
  // Serialize calls and simulate all-or-nothing Firestore transaction semantics.
  let release;
  const mine=new Promise(resolve=>release=resolve);
  const preceding=tail;tail=tail.then(()=>mine);
  await preceding;
  const changes={report:[],rate:[]};
  const tx={
   getReport:async id=>reports.get(id)||null,
   getRate:async key=>rates.get(key)||null,
   createReport(id,record){
    if(reports.has(id))throw Error('Duplicate document');
    changes.report.push([id,structuredClone(record)]);
   },
   setRate(key,record){changes.rate.push([key,structuredClone(record)]);}
  };
  try{
   const result=await action(tx);
   if(failNext){failNext=false;throw Error('simulated storage commit failure');}
   for(const [key,record] of changes.report)reports.set(key,record);
   for(const [key,record] of changes.rate)rates.set(key,record);
   commits++;
   return result;
  }finally{release();}
 }
 return {reports,rates,runTransaction,get commits(){return commits;},failOnce(){failNext=true}};
}
function setup({db=fakeDatabase(),registry=new Map(samples.map(q=>[q.id,q])),
 enrolled=true,nowMs=Date.parse('2026-11-22T10:00:00Z')}={}){
 let timestamp=nowMs, lookupCount=0;
 const service=createIntakeService({
  enrollmentLookup:async uid=>enrolled?enrollment(uid):null,
  questionLookup:async id=>{lookupCount++;return registry.get(id)||null;},
  runTransaction:db.runTransaction,
  now:()=>timestamp
 });
 return {service,db,registry,setNow:x=>timestamp=x,get now(){return timestamp;},
  get lookupCount(){return lookupCount}};
}
async function rejected(service,request,code){
 await assert.rejects(service(request),e=>e instanceof IntakeError&&e.code===code,
  'must reject with stable '+code+' error');
}
async function run(){
 assert.equal(samples.length,6,'six real Grade XI source banks');
 assert.equal(DAILY_LIMIT,5);
 assert.equal(COOLDOWN_MS,60000);

 // Each of six original units is eligible only after trusted lookup;
 // returned payload never contains student email, source answer or score.
 const allUnits=setup();
 for(const sample of samples){
  const uid='learner-'+sample.unit;
  const receipt=await allUnits.service({callerIdentity:identity(uid),draft:draft(sample)});
  assert.equal(receipt.status,'received');
  assert.equal(receipt.alreadyReceived,false);
  assert.match(receipt.receiptId,/^MR-20261122-[A-F0-9]{12}$/);
 }
 assert.equal(allUnits.db.reports.size,6,'one authoritative report per source item');
 assert.equal(allUnits.db.rates.size,6,'independent per-learner counters');
 for(const report of allUnits.db.reports.values()){
  assert.equal(report.status,'new','never accept student-chosen status');
  assert.equal(report.grade,11);
  assert.ok(samples.some(s=>s.id===report.questionId),'trusted source ID');
  assert.equal(report.bankVersion,samples.find(s=>s.id===report.questionId).bankVersion);
  assert.match(report.ownerUid,/^learner-[1-6]$/);
  assert.equal(report.createdAtIso,'2026-11-22T10:00:00.000Z');
  assert.equal(report.correctOptionId,undefined,'no private correct letter stored');
  assert.equal(report.answers,undefined,'no student answers stored');
  assert.equal(report.score,undefined,'no student score stored');
  assert.equal(report.email,undefined,'no unnecessary email stored');
 }
 for(const [key] of allUnits.db.rates)assert.ok(!key.includes('learner-'),'private rate key hashed');

 // Exact same reporter + question + category + UTC day is idempotent,
 // even inside cooldown; no duplicate document or quota consumption.
 const first=setup();
 const initial=await first.service({callerIdentity:identity('learner-same'),draft:draft(samples[0])});
 const repeat=await first.service({callerIdentity:identity('learner-same'),draft:draft(samples[0])});
 assert.equal(repeat.receiptId,initial.receiptId);
 assert.equal(repeat.alreadyReceived,true);
 assert.equal(first.db.reports.size,1);
 assert.equal([...first.db.rates.values()][0].count,1);

 // No forged or extra client fields; no anonymous, wrong unit or unverified
 // user ever reaches the transaction adapter.
 const base=draft(samples[1]);
 const forged=[
  {...base,ownerUid:'other-student'}, {...base,score:100},
  {...base,correctOptionId:'A'}, {...base,status:'resolved'},
  {...base,createdAtIso:'2000-01-01T00:00:00Z'},
  {...base,email:'someone@example.org'}, {...base,admin:true},
  {...base,sourceQuestionNumber:9999}, {...base,questionId:samples[0].id},
  {...base,note:'x'.repeat(501)}, {...base,category:'approved-by-admin'}
 ];
 const invalid=setup();
 for(const item of forged)
  await rejected(invalid.service,{callerIdentity:identity('badactor'),draft:item},'invalid-report');
 await rejected(invalid.service,{callerIdentity:null,draft:base},'authentication-required');
 await rejected(invalid.service,{callerIdentity:identity('unverified',false),draft:base},'verified-email-required');
 await rejected(invalid.service,{callerIdentity:{uid:'invalid with spaces',emailVerified:true},draft:base},
  'authentication-required');
 assert.equal(invalid.db.reports.size,0);

 // Enrollment must be exactly the trusted current Grade XI/FBISE independent
 // active enrolment; absence denies report creation.
 const none=setup({enrolled:false});
 await rejected(none.service,{callerIdentity:identity('learner-no-enrollment'),draft:base},'enrollment-required');
 assert.equal(none.db.reports.size,0);

 // Source is looked up SERVER-SIDE: never trust forged/obsolete/unknown IDs.
 const removed=setup({registry:new Map()});
 await rejected(removed.service,{callerIdentity:identity('learner-missing'),draft:base},'unavailable-question');
 const hidden=setup({registry:new Map([[samples[1].id,{...samples[1],publicPractice:false}]])});
 await rejected(hidden.service,{callerIdentity:identity('learner-hidden'),draft:base},'unavailable-question');
 const mismatch=setup({registry:new Map([[samples[1].id,{...samples[1],sourceQuestionNumber:999}]])});
 await rejected(mismatch.service,{callerIdentity:identity('learner-mismatch'),draft:base},'unavailable-question');
 // Browser-displayed version is informational, authoritative version from catalog.
 const oldVersion=setup();
 const altered=draft(samples[1]);altered.bankVersion='older-client-version';
 await oldVersion.service({callerIdentity:identity('learner-version'),draft:altered});
 const stored=[...oldVersion.db.reports.values()][0];
 assert.equal(stored.bankVersion,samples[1].bankVersion);
 assert.equal(stored.displayedBankVersion,'older-client-version');

 // Strict cooldown and daily cap. Exact 60-second boundary is allowed.
 const quota=setup();
 const caller=identity('learner-quota');
 await quota.service({callerIdentity:caller,draft:draft(samples[0])});
 await rejected(quota.service,{callerIdentity:caller,draft:draft(samples[1])},'please-try-later');
 assert.equal(quota.db.reports.size,1,'cooldown cannot leak a write');
 for(let i=1;i<DAILY_LIMIT;i++){
  quota.setNow(quota.now+60000);
  await quota.service({callerIdentity:caller,draft:draft(samples[i])});
 }
 assert.equal(quota.db.reports.size,DAILY_LIMIT);
 quota.setNow(quota.now+60000);
 await rejected(quota.service,{callerIdentity:caller,draft:draft(samples[5])},'daily-limit-reached');
 assert.equal(quota.db.reports.size,DAILY_LIMIT);
 quota.setNow(Date.parse('2026-11-23T10:00:00Z'));
 const nextDay=await quota.service({callerIdentity:caller,draft:draft(samples[5])});
 assert.equal(nextDay.status,'received');
 assert.equal(quota.db.reports.size,DAILY_LIMIT+1);

 // Same-time concurrency cannot create two reports or spend quota twice
 // when real adapter gives serializable transaction semantics.
 const concurrent=setup();
 const [one,two]=await Promise.all([
  concurrent.service({callerIdentity:identity('learner-parallel'),draft:draft(samples[4])}),
  concurrent.service({callerIdentity:identity('learner-parallel'),draft:draft(samples[4])})
 ]);
 assert.equal(concurrent.db.reports.size,1);
 assert.equal(concurrent.db.rates.size,1);
 assert.equal([...concurrent.db.rates.values()][0].count,1);
 assert.equal(one.receiptId,two.receiptId);
 assert.equal([one.alreadyReceived,two.alreadyReceived].filter(Boolean).length,1);

 // If the transaction rolls back, no report and NO success receipt is returned.
 const outage=setup();
 outage.db.failOnce();
 await assert.rejects(outage.service({
  callerIdentity:identity('learner-outage'),draft:draft(samples[3])
 }),/simulated storage commit failure/);
 assert.equal(outage.db.reports.size,0);
 assert.equal(outage.db.rates.size,0);
 const recovered=await outage.service({callerIdentity:identity('learner-outage'),draft:draft(samples[3])});
 assert.equal(recovered.status,'received');
 assert.equal(outage.db.reports.size,1);

 // No endpoint, Firebase Admin app, Firebase Functions deployment config,
 // browser form integration, or privileged admin API is introduced in V99-E.
 const core=fs.readFileSync(path.join(root,'server/mcq-review-intake-v99e.cjs'),'utf8');
 assert.ok(core.includes('NOT a deployed endpoint'));
 assert.ok(!/initializeApp\s*\(|https\.onRequest|onCall\s*\(|https?:\/\//.test(core),
  'core remains a non-network module with explicitly injected adapters');
 const engine=fs.readFileSync(path.join(root,'practice-engine/index.html'),'utf8');
 assert.ok(engine.includes('no report has been sent automatically'),'student copy-only wording unchanged');
 assert.ok(engine.includes('navigator.clipboard.writeText'));
 console.log('V99-E PASS: six genuine question-bank IDs; server-trusted identity/enrollment/catalog; exact idempotency, atomic cooldown and daily quota; parallel duplicate and storage failure safety; no deployment.');
 console.log('Current state: only core code and tests exist. No Firebase receiving endpoint, report delivery, student UI change or admin inbox.');
}
run().catch(e=>{console.error('V99-E FAILED:',e);process.exitCode=1;});
