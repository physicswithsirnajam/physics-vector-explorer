#!/usr/bin/env node
'use strict';
/**
 * V99-M — real local Auth emulator, genuine Admin Firestore transactions and
 * 2250 pinned MCQ source references behind an OFF-by-default request switch.
 *
 * App Check SUCCESS must be synthetic here: standard Firebase emulators have
 * no App Check emulator. We additionally test genuine Admin SDK rejection.
 * All data/accounts and report writes are SYNTHETIC and emulator-only.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {initializeApp:initializeAdmin,deleteApp:deleteAdmin}=require('firebase-admin/app');
const {getAuth:adminAuthFor}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const {getAppCheck}=require('firebase-admin/app-check');
const {initializeApp:initializeClient,deleteApp:deleteClient}=require('firebase/app');
const {getAuth,connectAuthEmulator,createUserWithEmailAndPassword,reload,signOut}=
 require('firebase/auth');
const {PROJECT,AUTH_HOST,FS_HOST}=
 require('../server/local-review-pipeline-v99j.cjs');
const {createLocalSwitchableReviewGate}=
 require('../server/local-report-switch-v99m.cjs');
const {PATH}=require('../server/offline-review-request-gate-v99k.cjs');
const {buildDraft}=require('../shared/mcq-review-contract-v99a.js');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');

const APP_ID='1:1234567890:web:synthetic-demo';
const APP_TOKEN='synthetic.appcheck.token.offline.v99m';
const BAD_JWT='not-a-valid-appcheck-jwt.mock.payload';
const evidence=path.resolve(__dirname,'../qa-artifacts/switchable-local-review-v99m');
const cases=[];
function pass(msg){cases.push(msg);console.log('V99-M PASS:',msg);}
function checkError(result,statusCode,code){
 assert.deepEqual(result,{statusCode,body:{ok:false,code}});
}
function draft(q){
 return buildDraft({unit:q.unit,questionId:q.id,
  sourceQuestionNumber:q.sourceQuestionNumber,bankVersion:q.bankVersion,
  category:'missing-context',note:'Synthetic issue report, no private student data.'});
}
function envelope(token,report,appToken=APP_TOKEN){
 return Object.freeze({
  method:'POST',path:PATH,contentType:'application/json',
  authorization:'Bearer '+token,appCheckToken:appToken,
  bodyText:JSON.stringify(report)
 });
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
 assert.ok(!process.env.GOOGLE_APPLICATION_CREDENTIALS);
 assert.equal(catalog.total,2250);
 assert.ok(!Object.keys(require.cache).some(p=>p.includes('approved-practice-catalog-v99g')),
  'never invoke dynamic V55 source loader at request time');
 const bank5=await catalog.lookup(catalog.ids().find(id=>id.startsWith('g11-u05-master-')));
 const bank3=await catalog.lookup(catalog.ids().find(id=>id.startsWith('g11-u03-master-')));
 assert.ok(bank5&&bank3);
 fs.mkdirSync(evidence,{recursive:true});
 const app=initializeAdmin({projectId:PROJECT},'v99m-admin-emulator-only');
 const client=initializeClient({
  apiKey:'demo-v99m-offline-only',projectId:PROJECT,
  authDomain:PROJECT+'.firebaseapp.com'
 },'v99m-local-client');
 try{
  const firestore=getFirestore(app),adminAuth=adminAuthFor(app);
  const browserAuth=getAuth(client);
  connectAuthEmulator(browserAuth,'http://'+AUTH_HOST,{disableWarnings:true});
  const clock={at:Date.parse('2026-11-22T15:00:00.000Z')};
  const input=()=>({firestore,adminAuth,now:()=>clock.at,allowedAppIds:[APP_ID]});
  let appProofCalls=0,enabled=false;
  const mockAppCheck={
   app,verifyToken:async(token,options)=>{
    appProofCalls++;
    assert.deepEqual(options,{consume:false},
     'local test does not claim App Check replay protection');
    if(token!==APP_TOKEN)throw Error('Synthetic token is not allowlisted');
    return {appId:APP_ID};
   }
  };
  const gate=createLocalSwitchableReviewGate({
   ...input(),adminAppCheck:mockAppCheck,isEnabled:()=>enabled
  });
  const initiallyBlocked=createLocalSwitchableReviewGate({
   ...input(),adminAppCheck:mockAppCheck
  });
  const student=await createUserWithEmailAndPassword(
   browserAuth,'v99m-synthetic-student@example.test','Synthetic-Only-Password-123!'
  );
  const uid=student.user.uid;
  let token=await student.user.getIdToken();
  const report5=draft(bank5),report3=draft(bank3);
  checkError(await gate(envelope(token,report5)),503,'temporarily-unavailable');
  checkError(await initiallyBlocked(envelope(token,report5)),503,'temporarily-unavailable');
  checkError(await gate({foo:'malformed'}),503,'temporarily-unavailable');
  assert.equal(appProofCalls,0);
  assert.equal((await firestore.collection('mcqReviewReports').get()).size,0);
  pass('OFF by default: all requests refuse before App Check, Auth and Firestore, even malformed requests');

  enabled=true;
  checkError(await gate(envelope(token,report5)),403,'verified-email-required');
  assert.equal((await firestore.collection('mcqReviewReports').get()).size,0);
  pass('enabled local demo still denies real emulator-issued unverified Firebase Auth token');

  await adminAuth.updateUser(uid,{emailVerified:true});
  await reload(student.user);
  token=await student.user.getIdToken(true);
  checkError(await gate(envelope(token,report5)),403,'enrollment-required');
  assert.equal((await firestore.collection('mcqReviewReports').get()).size,0);
  pass('verified Firebase Auth token requires trusted active Grade XI enrollment');

  await firestore.doc('academicEnrollments/'+uid).set({
   uid,grade:11,board:'fbise',status:'active',type:'independent'
  });
  const original=await gate(envelope(token,report5));
  assert.equal(original.statusCode,200);
  assert.deepEqual(Object.keys(original.body),['ok','status','receiptId','alreadyReceived']);
  assert.equal(original.body.ok,true);
  assert.equal(original.body.alreadyReceived,false);
  assert.match(original.body.receiptId,/^MR-\d{8}-[A-F0-9]{12}$/);
  const records=await firestore.collection('mcqReviewReports').get();
  assert.equal(records.size,1);
  const record=records.docs[0].data();
  assert.equal(record.ownerUid,uid);
  assert.equal(record.questionId,bank5.id);
  assert.equal(record.bankVersion,bank5.bankVersion);
  assert.equal(record.status,'new');
  for(const key of ['email','password','score','correctOptionId','selectedAnswer','admin'])
   assert.equal(record[key],undefined,'no sensitive field: '+key);
  assert.equal((await firestore.collection('mcqReviewRate').get()).size,1);
  pass('synthetic App Check success + REAL local Auth token + pinned MCQ commits atomic Firestore report/rate and safe receipt');

  const duplicate=await gate(envelope(token,report5));
  assert.equal(duplicate.statusCode,200);
  assert.equal(duplicate.body.alreadyReceived,true);
  assert.equal(duplicate.body.receiptId,original.body.receiptId);
  assert.equal((await firestore.collection('mcqReviewRate').get()).docs[0].data().count,1);
  checkError(await gate(envelope(token,report3)),429,'please-try-later');
  assert.equal((await firestore.collection('mcqReviewReports').get()).size,1);
  pass('duplicates remain idempotent; 60-second cooldown denies new reports without a second write');

  const beforeShutdownCalls=appProofCalls;
  enabled=false;
  checkError(await gate(envelope(token,report3)),503,'temporarily-unavailable');
  checkError(await gate({...envelope(token,report3),enable:true}),503,'temporarily-unavailable');
  assert.equal(appProofCalls,beforeShutdownCalls);
  assert.equal((await firestore.collection('mcqReviewReports').get()).size,1);
  pass('trusted OFF switch immediately refuses subsequent requests, cannot be browser-overridden and does not invoke App Check');

  const throwing=createLocalSwitchableReviewGate({
   ...input(),adminAppCheck:mockAppCheck,isEnabled:()=>{throw Error('internal flag load error');}
  });
  checkError(await throwing(envelope(token,report3)),503,'temporarily-unavailable');
  const pending=createLocalSwitchableReviewGate({
   ...input(),adminAppCheck:mockAppCheck,isEnabled:async()=>undefined
  });
  checkError(await pending(envelope(token,report3)),503,'temporarily-unavailable');
  pass('unavailable, throwing or non-true trusted switch configurations fail closed');

  enabled=true;
  // Flip the server-owned switch during an asynchronous App Check callback,
  // BEFORE Firebase Auth and the Firestore receiving handler begin.
  const flap={
   app,verifyToken:async (_token,options)=>{
    assert.deepEqual(options,{consume:false});
    enabled=false;
    return {appId:APP_ID};
   }
  };
  const flapGate=createLocalSwitchableReviewGate({
   ...input(),adminAppCheck:flap,isEnabled:()=>enabled
  });
  checkError(await flapGate(envelope(token,report3)),503,'temporarily-unavailable');
  assert.equal((await firestore.collection('mcqReviewReports').get()).size,1);
  pass('switch rechecked after App Check; disabling during verification stops before Auth and Firestore intake');

  enabled=true;
  checkError(await gate(envelope(token,report3,'unknown.appcheck.token.invalid')),
   403,'app-check-required');
  checkError(await gate({...envelope(token,report3),admin:true}),
   400,'invalid-request');
  assert.equal((await firestore.collection('mcqReviewReports').get()).size,1);
  pass('synthetic App Check errors and forged client identity fields are rejected while enabled');

  // Genuine SDK negative verification. No real App Check positive token or
  // Firebase App Check emulator exists; do not call this "real App Check E2E".
  const realGate=createLocalSwitchableReviewGate({
   ...input(),adminAppCheck:getAppCheck(app),isEnabled:()=>true
  });
  checkError(await realGate(envelope(token,report3,BAD_JWT)),
   403,'app-check-required');
  assert.equal((await firestore.collection('mcqReviewReports').get()).size,1);
  pass('genuine Firebase Admin App Check SDK rejects malformed JWT in full local request envelope');

  const oldProject=process.env.GCLOUD_PROJECT;
  try{
   process.env.GCLOUD_PROJECT='real-production-firebase';
   assert.throws(()=>createLocalSwitchableReviewGate({
    ...input(),adminAppCheck:mockAppCheck,isEnabled:()=>true
   }),/refuses real projects|credential-free demo project/);
  }finally{process.env.GCLOUD_PROJECT=oldProject;}
  assert.throws(()=>createLocalSwitchableReviewGate({
   ...input(),adminAppCheck:mockAppCheck,isEnabled:true
  }),TypeError);
  pass('construction refuses non-demo Firebase project and non-server-owned switch configuration');

  const evidenceRecord={
   version:'V99-M',environment:'Firebase Auth and Firestore local emulators only',
   approvedPublicGrade11QuestionReferences:2250,
   demoProjectId:PROJECT,liveServiceDeployed:false,
   trueAppCheckPositiveVerification:false,syntheticAppCheckSuccessOnly:true,
   realAdminAppCheckMalformedTokenDenied:true,
   realLocalFirebaseAuthentication:true,realLocalFirestoreTransactions:true,
   killSwitchDefaultOff:true,
   limitations:['no genuine positive App Check token','no replay protection',
    'no cancellation of in-flight transaction','no live HTTP or callable endpoint'],
   syntheticFirestoreReportCount:(await firestore.collection('mcqReviewReports').get()).size,
   passedCases:cases
  };
  fs.writeFileSync(path.join(evidence,'summary.json'),
   JSON.stringify(evidenceRecord,null,2)+'\n');
  console.log('V99-M FINISHED: '+cases.length+
   ' local-only test groups, '+evidenceRecord.syntheticFirestoreReportCount+
   ' emulator report. NO PRODUCTION DEPLOYMENT.');
  await signOut(browserAuth);
 }finally{
  await deleteClient(client);
  await deleteAdmin(app);
 }
}
main().catch(e=>{
 console.error('V99-M FAILED:',String(e.stack||e).slice(0,1800));
 process.exitCode=1;
});
