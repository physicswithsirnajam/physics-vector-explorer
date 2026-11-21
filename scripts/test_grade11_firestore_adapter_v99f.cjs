#!/usr/bin/env node
'use strict';
/* V99-F: emulator-only integration of V99-E core with real Firestore Admin
 * SDK transactions plus client SDK Security Rules denial. No live credentials,
 * no real Firebase user, no Cloud Function, no production deployment.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {initializeApp,deleteApp}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');
const {initializeTestEnvironment,assertSucceeds,assertFails}=
 require('@firebase/rules-unit-testing');
const {doc,collection,query,limit,getDoc,getDocs,setDoc,updateDoc}=
 require('firebase/firestore');
const {createEmulatorReviewService,PROJECT,HOST,REPORTS,RATES}=
 require('../server/firebase-review-emulator-v99f.cjs');
const {IntakeError,DAILY_LIMIT}=require('../server/mcq-review-intake-v99e.cjs');
const {buildDraft}=require('../shared/mcq-review-contract-v99a.js');

const root=path.resolve(__dirname,'..');
const evidence=path.join(root,'qa-artifacts/firestore-review-adapter-v99f');
const fixture=path.join(root,'security-proposals/v99c/mcq-review-isolated.rules');
const sources=[
 'question-bank/grade-11/unit-01.json',
 'question-bank/grade-11/unit-02.json',
 'question-bank/grade-11/unit-03-stage2-80-practice.json',
 'question-bank/grade-11/unit-04-v39-80-practice.json',
 'question-bank/grade-11/unit-05-v50-16-student.json',
 'question-bank/grade-11/unit-06-topic-61-v76-80-source.json'
];
const sample=sources.map((file,i)=>{
 const bank=JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
 const q=bank.questions?.[0];
 assert.ok(q&&q.id&&Number.isInteger(q.sourceQuestionNumber),
  'existing original source reference '+file);
 return Object.freeze({id:q.id,unit:i+1,sourceQuestionNumber:q.sourceQuestionNumber,
  publicPractice:true,bankVersion:bank.bankVersion||bank.version||'unit05-public-v50'});
});
const catalog=new Map(sample.map(q=>[q.id,q]));
const draft=q=>buildDraft({unit:q.unit,questionId:q.id,
 sourceQuestionNumber:q.sourceQuestionNumber,bankVersion:q.bankVersion,
 category:'missing-context',note:'Synthetic test: please review the diagram.'});
const caller=(uid,verified=true)=>({uid,emailVerified:verified});
const cases=[];
function ok(desc){cases.push({description:desc,result:'PASS'});console.log('V99-F PASS:',desc);}
async function rejects(promise,code,description){
 await assert.rejects(promise,e=>e instanceof IntakeError&&e.code===code);
 ok(description);
}
async function run(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT,
  'Refusing to access any project except designated local demo project');
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,HOST,
  'Refusing to run without exact localhost emulator configuration');
 fs.mkdirSync(evidence,{recursive:true});
 const rules=fs.readFileSync(fixture,'utf8');
 assert.match(rules,/ISOLATED FIRESTORE EMULATOR FIXTURE ONLY/);
 let env=null,app=null;
 try{
  env=await initializeTestEnvironment({projectId:PROJECT,
   firestore:{host:'127.0.0.1',port:8089,rules}});
  app=initializeApp({projectId:PROJECT},'v99f-local-only');
  const db=getFirestore(app);
  // Real Firebase Admin SDK connection, but local endpoint + demo project.
  assert.equal(db.projectId,PROJECT,'Firestore SDK tied to demo project');
  const clock={now:Date.parse('2026-11-22T12:00:00.000Z')};
  const create=({firestore=db,approvedQuestionLookup=async id=>catalog.get(id)||null,
    now=()=>clock.now}={})=>createEmulatorReviewService({firestore,approvedQuestionLookup,now});

  // Owner enrollment is looked up by the Admin SDK from the emulator database,
  // not accepted from browser input.
  for(const uid of ['learner1','learner2','quota-user','concurrent-user',
    'unverified-user','failure-user','missing-catalog']){
   await db.doc('academicEnrollments/'+uid).set({
    uid,grade:11,board:'fbise',status:'active',type:'independent',institution:'Demo only'
   });
  }
  await db.doc('academicEnrollments/wrong-enrollment').set({
   uid:'wrong-enrollment',grade:10,board:'fbise',status:'active',type:'independent'
  });
  const receive=create();
  const first=await receive({callerIdentity:caller('learner1'),draft:draft(sample[0])});
  assert.equal(first.status,'received');
  assert.equal(first.alreadyReceived,false);
  assert.match(first.receiptId,/^MR-\d{8}-[A-F0-9]{12}$/);
  const reports=await db.collection(REPORTS).get();
  assert.equal(reports.size,1,'Admin SDK wrote one real local report');
  const data=reports.docs[0].data();
  assert.equal(data.ownerUid,'learner1');
  assert.equal(data.questionId,sample[0].id);
  assert.equal(data.bankVersion,sample[0].bankVersion);
  assert.equal(data.status,'new');
  for(const key of ['email','score','correctOptionId','selectedAnswer','password','teacherRole'])
   assert.equal(data[key],undefined,'no sensitive '+key+' stored');
  assert.equal((await db.collection(RATES).get()).size,1,'rate record was committed atomically');
  ok('real Admin SDK writes allowlisted synthetic report and owner rate in local emulator');

  const repeat=await receive({callerIdentity:caller('learner1'),draft:draft(sample[0])});
  assert.equal(repeat.status,'received');
  assert.equal(repeat.receiptId,first.receiptId);
  assert.equal(repeat.alreadyReceived,true);
  assert.equal((await db.collection(REPORTS).get()).size,1);
  assert.equal((await db.collection(RATES).get()).docs[0].data().count,1);
  ok('real Firestore transaction returns idempotent duplicate receipt without extra report or quota');

  await rejects(receive({callerIdentity:caller('learner1'),draft:draft(sample[1])}),
   'please-try-later','60-second cooldown prevents a new report and storage write');
  await rejects(receive({callerIdentity:caller('unverified-user',false),draft:draft(sample[0])}),
   'verified-email-required','unverified identity rejected before database write');
  await rejects(receive({callerIdentity:caller('nonexistent'),draft:draft(sample[0])}),
   'enrollment-required','absent owner enrollment rejected');
  await rejects(receive({callerIdentity:caller('wrong-enrollment'),draft:draft(sample[0])}),
   'enrollment-required','incorrect Grade X enrollment rejected');
  const unknown=buildDraft({unit:1,questionId:'XI-U01-MCQ-9999',
   sourceQuestionNumber:9999,bankVersion:'unknown',category:'other',note:''});
  await rejects(receive({callerIdentity:caller('learner2'),draft:unknown}),
   'unavailable-question','unpublished source reference rejected by trusted catalog lookup');

  // Test six-unit lookup and live Admin SDK transaction writes under independent users.
  for(let i=0;i<sample.length;i++){
   const uid='unit-'+(i+1);
   await db.doc('academicEnrollments/'+uid).set({
    uid,grade:11,board:'fbise',status:'active',type:'independent'
   });
   const result=await receive({callerIdentity:caller(uid),draft:draft(sample[i])});
   assert.equal(result.status,'received');
  }
  ok('real original Grade XI source IDs from Units 1–6 pass authoritative server catalog');

  // Same ID submitted concurrently: Firestore retries transaction and keeps
  // exactly one report and exactly one quota charge.
  const dupCalls=Array.from({length:4},()=>receive({
   callerIdentity:caller('concurrent-user'),draft:draft(sample[4])
  }));
  const concurrent=await Promise.all(dupCalls);
  assert.equal(new Set(concurrent.map(x=>x.receiptId)).size,1);
  assert.equal(concurrent.filter(x=>x.alreadyReceived===false).length,1);
  assert.equal(concurrent.filter(x=>x.alreadyReceived===true).length,3);
  const concurrentReports=await db.collection(REPORTS).where('ownerUid','==','concurrent-user').get();
  assert.equal(concurrentReports.size,1);
  const quotaDocs=(await db.collection(RATES).get()).docs;
  // Do not require query of a raw uid-based rate key: it is hashed.
  const concurrentRate=quotaDocs.find(x=>x.data().day==='2026-11-22'&&x.data().count===1);
  assert.ok(concurrentRate);
  ok('four parallel real Firestore transactions produce one receipt and one report');

  // Five distinct submissions and 60s cooldown, a sixth on the same UTC day denied.
  for(let i=0;i<DAILY_LIMIT;i++){
   const result=await receive({callerIdentity:caller('quota-user'),draft:draft(sample[i])});
   assert.equal(result.status,'received');
   clock.now+=60_000;
  }
  await rejects(receive({callerIdentity:caller('quota-user'),draft:draft(sample[5])}),
   'daily-limit-reached','real rate transaction enforces daily maximum of five new reports');
  const quotaReports=await db.collection(REPORTS).where('ownerUid','==','quota-user').get();
  assert.equal(quotaReports.size,5);
  const beforeNewDay=clock.now;clock.now=Date.parse('2026-11-23T12:00:00Z');
  const newDay=await receive({callerIdentity:caller('quota-user'),draft:draft(sample[5])});
  assert.equal(newDay.status,'received');
  assert.equal((await db.collection(REPORTS).where('ownerUid','==','quota-user').get()).size,6);
  clock.now=beforeNewDay;
  ok('UTC day reset allows one new report with a new hashed receipt');

  // Simulated persistence error from the transaction boundary. Server never
  // issues a fabricated successful receipt.
  const failing={
   projectId:PROJECT,collection:x=>db.collection(x),doc:x=>db.doc(x),
   runTransaction:async()=>{throw Error('synthetic transaction unavailable');}
  };
  const offline=create({firestore:failing});
  const countBefore=(await db.collection(REPORTS).get()).size;
  await assert.rejects(offline({callerIdentity:caller('failure-user'),draft:draft(sample[2])}),
   /synthetic transaction unavailable/);
  assert.equal((await db.collection(REPORTS).get()).size,countBefore);
  ok('failed transaction never produces receipt or report');

  // Browser SDK rules protect the new queue, even when server writes via
  // Admin SDK. The existing V99-C fixture was already tested independently.
  const learner=env.authenticatedContext('learner1',{email_verified:true}).firestore();
  const fakeTeacher=env.authenticatedContext('fake-teacher',{email_verified:true,
   isTeacher:true,role:'teacher'}).firestore();
  const admin=env.authenticatedContext('verified-admin',{email_verified:true,admin:true}).firestore();
  const reportId=reports.docs[0].id;
  await assertFails(getDoc(doc(learner,REPORTS,reportId)));
  await assertFails(setDoc(doc(learner,REPORTS,'forged-student'),{status:'new'}));
  await assertFails(getDocs(query(collection(fakeTeacher,REPORTS),limit(25))));
  await assertSucceeds(getDoc(doc(admin,REPORTS,reportId)));
  await assertSucceeds(getDocs(query(collection(admin,REPORTS),limit(25))));
  await assertFails(getDocs(collection(admin,REPORTS)));
  await assertFails(updateDoc(doc(admin,REPORTS,reportId),{status:'resolved'}));
  ok('actual Admin-created records remain unreadable/unwritable to students and fake teacher claims');
  ok('verified admin claim can read limited report list but cannot update from browser');

  // Refuse any production config even if the Firestore SDK object looks valid.
  const realProject=process.env.GCLOUD_PROJECT;
  try{
   process.env.GCLOUD_PROJECT='physics-with-sir-najam-portal';
   assert.throws(()=>create(),/refuses non-demo/);
  }finally{process.env.GCLOUD_PROJECT=realProject;}
  const originalHost=process.env.FIRESTORE_EMULATOR_HOST;
  try{
   delete process.env.FIRESTORE_EMULATOR_HOST;
   assert.throws(()=>create(),/refuses non-demo/);
  }finally{process.env.FIRESTORE_EMULATOR_HOST=originalHost;}
  assert.throws(()=>create({firestore:{...db,projectId:'production'}}),/refuses non-demo|trusted/);
  ok('module refuses non-demo project, missing localhost emulator and mismatched Firestore connection');

  // This PR exposes NO callable/HTTP function; callerIdentity in this test is
  // synthetic and MUST NOT be accepted from client JSON by a future endpoint.
  const originalCore=fs.readFileSync(path.join(root,'server/firebase-review-emulator-v99f.cjs'),'utf8');
  assert.ok(!/onCall\s*\(|onRequest\s*\(|https\.onRequest|express\s*\(/.test(originalCore),
   'no deployed or web-callable submission endpoint');
  assert.equal(fs.existsSync(path.join(root,'firebase.json')),false,
   'do not add production deployment mapping');
  const summary={version:'V99-F',projectId:PROJECT,emulatorHost:HOST,
   realFirestoreAdminTransactions:true,
   firebaseIdTokenCryptographicallyVerified:false,
   approvedQuestionLookupSource:'server-owned local source bank samples (Unit 1–6)',
   existingOwnerRulePolicyLoaded:false,
   isolatedFixture:'security-proposals/v99c/mcq-review-isolated.rules',
   actualPublishedRulesChecked:false,
   studentSubmissionActive:false,teacherInboxActive:false,liveDeployment:false,
   syntheticReportsStored:(await db.collection(REPORTS).get()).size,
   cases};
  fs.writeFileSync(path.join(evidence,'audit.json'),JSON.stringify(summary,null,2)+'\n');
  fs.writeFileSync(path.join(evidence,'report.md'),[
   '# V99-F — Real Firebase Admin SDK / Firestore Emulator integration','',
   '**DEMO-ONLY, NO PRODUCTION DEPLOYMENT; trusted Firebase Auth token verifier NOT implemented.**','',
   'Admin SDK successfully committed atomic MCQ-report and per-owner limit documents against the local Firestore emulator, using original six-unit source examples.','',
   'Browser Security Rules continue blocking student/fake-teacher reads/writes and permitting only bounded, verified-admin reads in the isolated V99-C fixture.','',
   'The complete 227-line owner ruleset and currently published Firebase version were **not** loaded by V99-F; the prior V99-D full-baseline regression is separate.','',
   '| Tested behavior | Outcome |','|---|---|',
   ...cases.map(x=>'| '+x.description+' | '+x.result+' |'),'', 
   'No student form change, deployed function, Firebase production credentials, email/WhatsApp, or live teacher report inbox exists.',''
  ].join('\n'));
  console.log('V99-F FINISHED: '+cases.length+' passing integration scenarios; '+summary.syntheticReportsStored+
   ' synthetic reports on LOCAL Firestore emulator, never live Firebase.');
 }finally{
  if(app)await deleteApp(app);
  if(env)await env.cleanup();
 }
}
run().catch(err=>{console.error('V99-F FAILED:',String(err.message||err).slice(0,500));process.exitCode=1;});
