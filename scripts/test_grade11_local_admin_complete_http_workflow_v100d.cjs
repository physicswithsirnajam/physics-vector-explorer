#!/usr/bin/env node
'use strict';
/**
 * V100-D — Complete private administrator review HTTP workflow in one
 * disposable 127.0.0.1 Firebase Auth + Firestore EMULATOR session.
 *
 * Reuses unmodified V100-A (queue), V100-C (triage) and V100-B (history).
 * There is NO public endpoint, real user, production Firebase, real App Check
 * provider, student Send functionality or domain migration.
 */
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {initializeApp:adminApp,deleteApp:deleteAdminApp}=require('firebase-admin/app');
const {getAuth:serverAuthFor}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const {initializeApp:browserApp,deleteApp:deleteBrowserApp}=require('firebase/app');
const {getAuth,connectAuthEmulator,signInWithEmailAndPassword,signOut}=
 require('firebase/auth');
const {PROJECT,HOST:FS_HOST,REPORTS,RATES}=
 require('../server/firebase-review-emulator-v99f.cjs');
const {AUDIT}=require('../server/local-admin-review-transitions-v99q.cjs');
const {startLocalAdminReviewHttpRehearsal}=
 require('../server/local-http-admin-review-v100a.cjs');
const {startLocalAdminHistoryHttpRehearsal}=
 require('../server/local-http-admin-history-v100b.cjs');
const {startLocalAdminTriageHttpRehearsal}=
 require('../server/local-http-admin-triage-v100c.cjs');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');

const AUTH_HOST='127.0.0.1:9099';
const PASSWORD='V100D-SYNTHETIC-LOCAL-ONLY-1234567890!';
const FIRST='mr_'+(41).toString(16).padStart(48,'0');
const SECOND='mr_'+(42).toString(16).padStart(48,'0');
const OUT=path.resolve(__dirname,'../qa-artifacts/local-admin-workflow-v100d');
const cases=[];
function pass(label){cases.push(label);console.log('V100-D PASS:',label);}
function header(token){return {Authorization:'Bearer '+token};}
function send(url,{method='GET',headers={},action}={}){
 const body=action===undefined?undefined:JSON.stringify({action});
 const requestHeaders={...headers};
 if(body!==undefined){
  requestHeaders['Content-Type']='application/json';
  requestHeaders['Content-Length']=String(Buffer.byteLength(body));
 }
 return new Promise((resolve,reject)=>{
  const req=http.request(url,{method,headers:requestHeaders,timeout:5000,agent:false},res=>{
   let raw='';
   res.on('data',chunk=>{
    raw+=chunk.toString('utf8');
    if(raw.length>16000)req.destroy(Error('unexpected oversized JSON response'));
   });
   res.on('end',()=>{
    try{resolve({status:res.statusCode,headers:res.headers,
     body:JSON.parse(raw),raw});}
    catch{reject(Error('invalid JSON response')); }
   });
  });
  req.on('timeout',()=>req.destroy(Error('local HTTP timeout')));
  req.on('error',reject);
  if(body!==undefined)req.write(body);
  req.end();
 });
}
function deny(response,code,status){
 assert.equal(response.status,status);
 assert.deepEqual(response.body,{ok:false,code});
 assert.equal(response.headers['cache-control'],'no-store, max-age=0');
 assert.equal(response.headers['access-control-allow-origin'],undefined);
}
function assertPrivacy(response,users,{authorizedQueue=false}={}){
 assert.equal(response.status,200);
 assert.equal(response.headers['access-control-allow-origin'],undefined);
 assert.equal(response.headers['cache-control'],'no-store, max-age=0');
 assert.equal(response.headers['x-content-type-options'],'nosniff');
 // An authorized queue deliberately includes the learner's issue *note*.
 // That note is NOT allowed in transition receipts or audit history.
 // Account identities, secrets, answers and private audit document IDs
 // are never allowed in ANY HTTP response, including the admin queue.
 const excluded=[
  'SYNTHETIC_CORRECT_ANSWER','ar_',
  'synthetic-owner@example.test',users.owner.uid,users.owner.token,
  users.student.uid,users.student.token
 ];
 if(!authorizedQueue)excluded.push('PRIVATE_STUDENT');
 for(const bad of excluded)
  assert.ok(!response.raw.includes(bad),'no forbidden private field in HTTP JSON');
}
function seed(q,i){
 return {
  schemaVersion:1,kind:'grade11-mcq-review',origin:'practice-engine',
  grade:11,unit:q.unit,questionId:q.id,
  sourceQuestionNumber:q.sourceQuestionNumber,bankVersion:q.bankVersion,
  displayedBankVersion:q.bankVersion,category:'incorrect-key',
  note:'PRIVATE_STUDENT_SYNTHETIC_NOTE_'+i,
  ownerUid:'synthetic-student',email:'synthetic-owner@example.test',
  correctOptionId:'SYNTHETIC_CORRECT_ANSWER',score:912,
  status:'new',
  createdAtIso:new Date(Date.parse('2026-11-22T16:00:00.000Z')+i*60_000).toISOString()
 };
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
 assert.equal(process.env.PSN_LOCAL_ADMIN_HTTP_REHEARSAL,'enabled-local-test-only');
 assert.equal(process.env.PSN_LOCAL_ADMIN_HISTORY_HTTP,'enabled-local-test-only');
 assert.equal(process.env.PSN_LOCAL_ADMIN_TRIAGE_HTTP,'enabled-local-test-only');
 assert.equal(Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS),false);
 assert.equal(catalog.total,2250);

 const admin=adminApp({projectId:PROJECT},'v100d-admin-local-only');
 const browser=browserApp({
  apiKey:'v100d-credential-free-demo-key',projectId:PROJECT,
  authDomain:PROJECT+'.firebaseapp.com'
 },'v100d-browser-local-only');
 const listeners=[];
 try{
  const db=getFirestore(admin),auth=serverAuthFor(admin);
  const browserAuth=getAuth(browser);
  connectAuthEmulator(browserAuth,'http://'+AUTH_HOST,{disableWarnings:true});
  const users={};
  for(const [role,emailVerified,claims] of [
   ['owner',true,{admin:true}],
   ['student',true,{}],
   ['teacher',true,{role:'teacher'}],
   ['otherAdmin',true,{admin:true}]
  ]){
   const email='v100d-'+role.toLowerCase()+'@example.test';
   const record=await auth.createUser({email,password:PASSWORD,emailVerified});
   if(Object.keys(claims).length)await auth.setCustomUserClaims(record.uid,claims);
   const login=await signInWithEmailAndPassword(browserAuth,email,PASSWORD);
   users[role]={uid:record.uid,token:await login.user.getIdToken(true)};
  }
  const q1=await catalog.lookup(catalog.ids()[0]);
  const q2=await catalog.lookup(catalog.ids()[1]);
  assert.ok(q1?.publicPractice&&q2?.publicPractice&&q1.id!==q2.id);
  await db.collection(REPORTS).doc(FIRST).set(seed(q1,0));
  await db.collection(REPORTS).doc(SECOND).set(seed(q2,1));
  const base={firestore:db,adminAuth:auth,allowedAdminUids:[users.owner.uid]};
  let queueEnabled=false,historyEnabled=false,triageEnabled=false;
  const time={ms:Date.parse('2026-11-22T18:00:00.000Z')};
  const queue=await startLocalAdminReviewHttpRehearsal({
   ...base,isReviewReaderEnabled:()=>queueEnabled
  });
  listeners.push(queue);
  const history=await startLocalAdminHistoryHttpRehearsal({
   ...base,isHistoryEnabled:()=>historyEnabled
  });
  listeners.push(history);
  const triage=await startLocalAdminTriageHttpRehearsal({
   ...base,isTriageEnabled:()=>triageEnabled,now:()=>time.ms
  });
  listeners.push(triage);
  const urls=[queue.url,history.urlFor(FIRST),triage.urlFor(FIRST)];
  assert.equal(new Set([queue.origin,history.origin,triage.origin]).size,3,
   'three separate ephemeral loopback listeners');
  assert.ok(urls.every(u=>/^http:\/\/127\.0\.0\.1:\d+\//.test(u)));
  deny(await send(queue.url,{headers:header(users.owner.token)}),
   'temporarily-unavailable',503);
  deny(await send(history.urlFor(FIRST),{headers:header(users.owner.token)}),
   'temporarily-unavailable',503);
  deny(await send(triage.urlFor(FIRST),{
   method:'POST',headers:header(users.owner.token),action:'start-review'
  }),'temporarily-unavailable',503);
  assert.equal((await db.collection(AUDIT).get()).size,0);
  assert.equal((await db.collection(REPORTS).get()).size,2);
  pass('all three real local HTTP routes default OFF independently; zero private audit writes');

  queueEnabled=historyEnabled=triageEnabled=true;
  const qInitial=await send(queue.url,{headers:header(users.owner.token)});
  assertPrivacy(qInitial,users,{authorizedQueue:true});
  assert.equal(qInitial.body.count,2);
  assert.deepEqual(qInitial.body.reports.map(r=>r.reportId),[SECOND,FIRST],
   'newest first, same shared synthetic database');
  assert.deepEqual(qInitial.body.reports.map(r=>r.status),['new','new']);
  assert.deepEqual(qInitial.body.reports.map(r=>r.questionId),[q2.id,q1.id]);
  const hInitial=await send(history.urlFor(FIRST),{
   headers:header(users.owner.token)
  });
  assertPrivacy(hInitial,users);
  assert.deepEqual(hInitial.body,{
   ok:true,reportId:FIRST,questionId:q1.id,status:'new',events:[]
  });
  assert.equal((await db.collection(AUDIT).get()).size,0);
  pass('authorized owner sees source-pinned, redacted two-item HTTP queue and zero-event history');

  const premature=await send(triage.urlFor(FIRST),{
   method:'POST',headers:header(users.owner.token),action:'resolve'
  });
  deny(premature,'invalid-transition',409);
  assert.equal((await db.collection(AUDIT).get()).size,0);
  const started=await send(triage.urlFor(FIRST),{
   method:'POST',headers:header(users.owner.token),action:'start-review'
  });
  assertPrivacy(started,users);
  assert.deepEqual(started.body,{
   ok:true,reportId:FIRST,status:'in-review',alreadyApplied:false
  });
  const qReview=await send(queue.url,{headers:header(users.owner.token)});
  assert.equal(qReview.status,200);
  assert.equal(qReview.body.reports.find(r=>r.reportId===FIRST).status,'in-review');
  const hReview=await send(history.urlFor(FIRST),{
   headers:header(users.owner.token)
  });
  assertPrivacy(hReview,users);
  assert.deepEqual(hReview.body,{
   ok:true,reportId:FIRST,questionId:q1.id,status:'in-review',
   events:[{action:'start-review',fromStatus:'new',toStatus:'in-review',
    reviewedAtIso:'2026-11-22T18:00:00.000Z'}]
  });
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('local POST changes new to in-review, immediately consistent in separate HTTP queue and audit history');

  const retry=await send(triage.urlFor(FIRST),{
   method:'POST',headers:header(users.owner.token),action:'start-review'
  });
  assert.equal(retry.status,200);
  assert.equal(retry.body.alreadyApplied,true);
  assert.equal((await db.collection(AUDIT).get()).size,1);
  time.ms+=60_000;
  const complete=await send(triage.urlFor(FIRST),{
   method:'POST',headers:header(users.owner.token),action:'resolve'
  });
  assertPrivacy(complete,users);
  assert.deepEqual(complete.body,{
   ok:true,reportId:FIRST,status:'resolved',alreadyApplied:false
  });
  const qResolved=await send(queue.url,{headers:header(users.owner.token)});
  assertPrivacy(qResolved,users,{authorizedQueue:true});
  assert.equal(qResolved.body.reports.find(r=>r.reportId===FIRST).status,'resolved');
  assert.equal(qResolved.body.reports.find(r=>r.reportId===SECOND).status,'new');
  const hResolved=await send(history.urlFor(FIRST),{
   headers:header(users.owner.token)
  });
  assertPrivacy(hResolved,users);
  assert.deepEqual(hResolved.body,{
   ok:true,reportId:FIRST,questionId:q1.id,status:'resolved',
   events:[
    {action:'start-review',fromStatus:'new',toStatus:'in-review',
     reviewedAtIso:'2026-11-22T18:00:00.000Z'},
    {action:'resolve',fromStatus:'in-review',toStatus:'resolved',
     reviewedAtIso:'2026-11-22T18:01:00.000Z'}
   ]
  });
  assert.equal((await db.collection(AUDIT).get()).size,2);
  const secondHistory=await send(history.urlFor(SECOND),{
   headers:header(users.owner.token)
  });
  assert.deepEqual(secondHistory.body,{
   ok:true,reportId:SECOND,questionId:q2.id,status:'new',events:[]
  });
  pass('complete local workflow new→in-review→resolved, with exactly two private audit events and untouched second report');

  const retryResolve=await send(triage.urlFor(FIRST),{
   method:'POST',headers:header(users.owner.token),action:'resolve'
  });
  assert.equal(retryResolve.body.alreadyApplied,true);
  assert.equal((await db.collection(AUDIT).get()).size,2);
  assert.deepEqual((await send(history.urlFor(FIRST),{
   headers:header(users.owner.token)
  })).body,hResolved.body);
  const audit=await db.collection(AUDIT).get();
  assert.equal(audit.docs.length,2);
  assert.ok(audit.docs.every(d=>d.data().reviewerUid===users.owner.uid));
  assert.equal((await db.collection(RATES).get()).size,0);
  assert.equal((await db.collection(REPORTS).get()).size,2);
  pass('retry remains idempotent; one trusted reviewer recorded privately; no rate, answer or unrelated report writes');

  for(const who of ['student','teacher','otherAdmin']){
   const expected='admin-access-required';
   deny(await send(queue.url,{headers:header(users[who].token)}),expected,403);
   deny(await send(history.urlFor(FIRST),{
    headers:header(users[who].token)
   }),expected,403);
   deny(await send(triage.urlFor(SECOND),{
    method:'POST',headers:header(users[who].token),action:'start-review'
   }),expected,403);
  }
  for(const test of [
   [queue.url,'GET'],
   [history.urlFor(FIRST),'GET'],
   [triage.urlFor(SECOND),'POST']
  ]){
   const resp=await send(test[0],{
    method:test[1],headers:header('forged-jwt'),
    action:test[1]==='POST'?'start-review':undefined
   });
   deny(resp,'authentication-required',401);
  }
  assert.equal((await db.collection(AUDIT).get()).size,2);
  pass('student, teacher, nonallowlisted Admin and forged JWT denied consistently on ALL three routes');

  // Independently switch off only one resource at a time; other routes
  // must remain operational and must not permit unauthorized writes.
  queueEnabled=false;
  deny(await send(queue.url,{headers:header(users.owner.token)}),
   'temporarily-unavailable',503);
  assert.equal((await send(history.urlFor(FIRST),{
   headers:header(users.owner.token)
  })).status,200);
  queueEnabled=true;
  historyEnabled=false;
  deny(await send(history.urlFor(FIRST),{
   headers:header(users.owner.token)
  }),'temporarily-unavailable',503);
  assert.equal((await send(queue.url,{
   headers:header(users.owner.token)
  })).status,200);
  historyEnabled=true;
  triageEnabled=false;
  deny(await send(triage.urlFor(SECOND),{
   method:'POST',headers:header(users.owner.token),action:'start-review'
  }),'temporarily-unavailable',503);
  assert.equal((await db.collection(REPORTS).doc(SECOND).get()).data().status,'new');
  triageEnabled=true;
  pass('independent server-owned emergency OFF controls block only their own private HTTP route');

  // A genuine previously signed JWT retains admin:true after role removal.
  await auth.setCustomUserClaims(users.owner.uid,{role:'teacher'});
  assert.equal((await auth.verifyIdToken(users.owner.token,true)).admin,true);
  deny(await send(queue.url,{headers:header(users.owner.token)}),
   'admin-access-required',403);
  deny(await send(history.urlFor(FIRST),{
   headers:header(users.owner.token)
  }),'admin-access-required',403);
  deny(await send(triage.urlFor(SECOND),{
   method:'POST',headers:header(users.owner.token),action:'start-review'
  }),'admin-access-required',403);
  assert.equal((await db.collection(AUDIT).get()).size,2);
  pass('current role revocation stops stale admin:true token across queue, triage and history together');

  assert.ok(!fs.existsSync(path.resolve(__dirname,'../firebase.json')),
   'no deployment manifest introduced');
  fs.mkdirSync(OUT,{recursive:true});
  fs.writeFileSync(path.join(OUT,'summary.json'),JSON.stringify({
   version:'V100-D',
   scope:'one disposable LOCAL Auth+Firestore emulator with three ephemeral loopback HTTP routes',
   sourcePinnedPublicMcqReferences:2250,syntheticReports:2,
   administratorQueueHttp:true,reviewTransitionHttp:true,auditHistoryHttp:true,
   independentEmergencyOFF:true,roleRevocationDenialAllRoutes:true,
   completeWorkflowAndOrderedAuditProof:true,privateFieldProjection:true,
   productionFirebaseAccess:false,realStudentData:false,
   publicEndpoint:false,studentSendEnabled:false,
   genuineProductionAppCheckProviderVerified:false,domainChanged:false,
   passedCases:cases
  },null,2)+'\n');
  console.log('V100-D FINISHED: '+cases.length+
   ' integrated HTTP workflow groups passed; LOCAL EMULATORS ONLY; NO LIVE DEPLOYMENT.');
  await signOut(browserAuth);
 }finally{
  for(const listener of listeners.reverse())await listener.close();
  await deleteBrowserApp(browser);
  await deleteAdminApp(admin);
 }
}
main().catch(()=>{
 console.error('V100-D FAILED: safe local integration assertion did not pass.');
 process.exitCode=1;
});
