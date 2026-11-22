#!/usr/bin/env node
'use strict';
/**
 * V99-J: real LOCAL Firebase Auth token + Firebase Admin Firestore transaction
 * + frozen 2250 MCQ source index. No live service, endpoint or student records.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {initializeApp:initializeAdmin,deleteApp:deleteAdmin}=require('firebase-admin/app');
const {getAuth:adminAuthFor}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const {initializeApp:initializeClient,deleteApp:deleteClient}=require('firebase/app');
const {getAuth,connectAuthEmulator,createUserWithEmailAndPassword,reload,signOut}=
 require('firebase/auth');
const {initializeTestEnvironment,assertFails}=require('@firebase/rules-unit-testing');
const {doc,getDoc,setDoc}=require('firebase/firestore');

const {PROJECT,AUTH_HOST,FS_HOST,createLocalReviewPipeline}=
 require('../server/local-review-pipeline-v99j.cjs');
const {ReviewAuthenticationError}=require('../server/verified-report-boundary-v99g.cjs');
const {IntakeError}=require('../server/mcq-review-intake-v99e.cjs');
const {buildDraft}=require('../shared/mcq-review-contract-v99a.js');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');

const qa=path.resolve(__dirname,'../qa-artifacts/combined-local-review-v99j');
const cases=[];
function pass(description){cases.push(description);console.log('V99-J PASS:',description);}
async function denied(request,handler,code,type){
 await assert.rejects(handler(request),e=>e instanceof type&&e.code===code);
}
function makeDraft(question,category='missing-context'){
 return buildDraft({
  unit:question.unit,questionId:question.id,sourceQuestionNumber:question.sourceQuestionNumber,
  bankVersion:question.bankVersion,category,
  note:'Synthetic practice reference concern; no personal information.'
 });
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT,'Only the designated demo project is allowed');
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST,'Exact localhost Firestore required');
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST,'Exact localhost Auth required');
 assert.ok(!process.env.GOOGLE_APPLICATION_CREDENTIALS,'Refuse real service credentials');
 assert.equal(catalog.total,2250);
 assert.equal(catalog.ids().length,2250);
 assert.ok(!Object.keys(require.cache).some(p=>
  p.includes('approved-practice-catalog-v99g')||p.includes('practice-bank-adapter-v55')),
  'runtime must never execute the browser question bank or V99-G VM source loader');
 const byUnit={};
 for(const id of catalog.ids()){
  const q=await catalog.lookup(id);
  (byUnit[q.unit]??=[]).push(q);
 }
 for(let u=1;u<=6;u++)assert.ok(byUnit[u].length>0);
 pass('pinned reference lookup has 2250 unchanged sources, no answer keys, browser script or VM');

 fs.mkdirSync(qa,{recursive:true});
 const admin=initializeAdmin({projectId:PROJECT},'v99j-admin-local-only');
 const client=initializeClient({
  apiKey:'demo-v99j-test-only-key',projectId:PROJECT,
  authDomain:PROJECT+'.firebaseapp.com'
 },'v99j-client-local-only');
 let testEnv;
 try{
  const db=getFirestore(admin),serverAuth=adminAuthFor(admin);
  const auth=getAuth(client);
  connectAuthEmulator(auth,'http://'+AUTH_HOST,{disableWarnings:true});
  const clock={value:Date.parse('2026-11-22T14:00:00.000Z')};
  const handler=createLocalReviewPipeline({
   firestore:db,adminAuth:serverAuth,now:()=>clock.value
  });
  const student=await createUserWithEmailAndPassword(
   auth,'local-v99j-student@example.test','LocalDemo12345!'
  );
  const uid=student.user.uid;
  let token=await student.user.getIdToken();
  const chosen=byUnit[5].find(q=>q.id.startsWith('g11-u05-master-'));
  const next=byUnit[3].find(q=>q.id.startsWith('g11-u03-master-'));
  const other=byUnit[6][0];
  assert.ok(chosen&&next&&other);
  const request=(draft,t=token)=>({authorization:'Bearer '+t,draft});
  const first=makeDraft(chosen);
  await denied(request(first),handler,'verified-email-required',ReviewAuthenticationError);
  assert.equal((await db.collection('mcqReviewReports').get()).size,0);
  pass('real emulator-issued but unverified Firebase ID token is rejected before Firestore writes');

  await serverAuth.updateUser(uid,{emailVerified:true});
  await reload(student.user);
  token=await student.user.getIdToken(true);
  const verified=await serverAuth.verifyIdToken(token,true);
  assert.equal(verified.uid,uid);
  assert.equal(verified.email_verified,true);
  await denied(request(first),handler,'enrollment-required',IntakeError);
  assert.equal((await db.collection('mcqReviewReports').get()).size,0);
  pass('verified token alone cannot submit without trusted Firestore Grade XI enrollment');

  await db.doc('academicEnrollments/'+uid).set({
   uid,grade:11,board:'fbise',status:'active',type:'independent'
  });
  const receipt=await handler(request(first));
  assert.equal(receipt.status,'received');
  assert.equal(receipt.alreadyReceived,false);
  assert.match(receipt.receiptId,/^MR-\d{8}-[A-F0-9]{12}$/);
  const stored=await db.collection('mcqReviewReports').get();
  assert.equal(stored.size,1);
  const record=stored.docs[0].data();
  assert.equal(record.ownerUid,uid);
  assert.equal(record.questionId,chosen.id);
  assert.equal(record.bankVersion,chosen.bankVersion);
  assert.equal(record.status,'new');
  assert.equal(record.note,first.note);
  assert.equal((await db.collection('mcqReviewRate').get()).size,1);
  for(const banned of ['email','password','correctOptionId','selectedAnswer','score','isTeacher','admin'])
   assert.equal(record[banned],undefined,'sensitive field is never stored: '+banned);
  assert.deepEqual(Object.keys(receipt),['status','receiptId','alreadyReceived']);
  pass('verified real Auth token + enrolled UID + original Unit 5 MCQ commits real atomic Firestore report/rate; sanitized receipt');

  const dup=await handler(request(first));
  assert.equal(dup.receiptId,receipt.receiptId);
  assert.equal(dup.alreadyReceived,true);
  assert.equal((await db.collection('mcqReviewReports').get()).size,1);
  assert.equal((await db.collection('mcqReviewRate').get()).docs[0].data().count,1);
  pass('repeat same original report is idempotent and charges quota only once');

  await denied(request(makeDraft(next)),handler,'please-try-later',IntakeError);
  assert.equal((await db.collection('mcqReviewReports').get()).size,1);
  clock.value+=60_000;
  const accepted3=await handler(request(makeDraft(next)));
  assert.equal(accepted3.alreadyReceived,false);
  assert.equal((await db.collection('mcqReviewReports').get()).size,2);
  pass('60-second cooldown blocks new report until trusted clock advances; original Unit 3 master ID works');

  const spoofed=[
   {...request(makeDraft(other)),uid:'fake-teacher'},
   {...request(makeDraft(other)),callerIdentity:{uid:'admin',emailVerified:true}},
   {...request(makeDraft(other)),admin:true}
  ];
  for(const forged of spoofed)
   await denied(forged,handler,'invalid-request',ReviewAuthenticationError);
  await denied({authorization:'Bearer '+token+'.tamper',draft:makeDraft(other)},
   handler,'authentication-required',ReviewAuthenticationError);
  await denied({authorization:'Basic '+token,draft:makeDraft(other)},
   handler,'authentication-required',ReviewAuthenticationError);
  pass('forged UID/admin/body identity, tampered JWT and non-Bearer Auth rejected before storage');

  const fakeSource=buildDraft({unit:5,questionId:'XI-U05-MCQ-9999',
   sourceQuestionNumber:4999,bankVersion:'fake',category:'other',note:'synthetic'});
  await denied(request(fakeSource),handler,'unavailable-question',IntakeError);
  await denied(request({...makeDraft(other),ownerUid:'spoof'}),
   handler,'invalid-report',IntakeError);
  assert.equal((await db.collection('mcqReviewReports').get()).size,2);
  pass('unpublished IDs and attempts to set report owner/status are rejected by pinned source policy');

  const badDb={
   projectId:PROJECT,collection:name=>db.collection(name),doc:name=>db.doc(name),
   runTransaction:async()=>{throw Error('synthetic-local-transaction-failed');}
  };
  const unavailable=createLocalReviewPipeline({
   firestore:badDb,adminAuth:serverAuth,now:()=>clock.value+60_000
  });
  await assert.rejects(unavailable(request(makeDraft(other))),
   /synthetic-local-transaction-failed/);
  assert.equal((await db.collection('mcqReviewReports').get()).size,2);
  pass('transaction outage never returns a false success or writes a partial report');

  const former=process.env.FIREBASE_AUTH_EMULATOR_HOST;
  try{
   delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
   assert.throws(()=>createLocalReviewPipeline({firestore:db,adminAuth:serverAuth}),
    /refuses real projects/);
  }finally{process.env.FIREBASE_AUTH_EMULATOR_HOST=former;}
  const oldProject=process.env.GCLOUD_PROJECT;
  try{
   process.env.GCLOUD_PROJECT='real-production-project';
   assert.throws(()=>createLocalReviewPipeline({firestore:db,adminAuth:serverAuth}),
    /refuses real projects/);
  }finally{process.env.GCLOUD_PROJECT=oldProject;}
  assert.throws(()=>createLocalReviewPipeline({
   firestore:db,adminAuth:{verifyIdToken:async()=>({}),app:{options:{projectId:'wrong-project'}}}
  }),/matching demo project/);
  pass('production project, missing local Auth emulator, and mismatched Admin Auth project are refused');

  const rules=fs.readFileSync(path.resolve(__dirname,
   '../security-proposals/v99c/mcq-review-isolated.rules'),'utf8');
  assert.match(rules,/ISOLATED FIRESTORE EMULATOR FIXTURE ONLY/);
  testEnv=await initializeTestEnvironment({
   projectId:PROJECT,firestore:{host:'127.0.0.1',port:8089,rules}
  });
  const browserStudent=testEnv.authenticatedContext(uid,{
   email_verified:true
  }).firestore();
  const fakeTeacher=testEnv.authenticatedContext('forged-teacher',{
   email_verified:true,isTeacher:true,role:'teacher'
  }).firestore();
  await assertFails(getDoc(doc(browserStudent,'mcqReviewReports',stored.docs[0].id)));
  await assertFails(setDoc(doc(browserStudent,'mcqReviewReports','forged'),{status:'new'}));
  await assertFails(getDoc(doc(fakeTeacher,'mcqReviewReports',stored.docs[0].id)));
  pass('isolated client rules deny direct report read/write by student and forged teacher');

  assert.ok(!fs.existsSync(path.resolve(__dirname,'../firebase.json')),
   'do not introduce a production deploy manifest');
  const summary={
   version:'V99-J',mode:'LOCAL COMBINED FIREBASE EMULATORS ONLY',
   demoProjectId:PROJECT,authHost:AUTH_HOST,firestoreHost:FS_HOST,
   fullPinnedPublicMCQCatalogCount:2250,
   verifiedIdTokenWithRevocationCheck:true,realFirestoreAdminTransactions:true,
   isolatedClientRulesFixtureOnly:true,productionRulesVerifiedHere:false,
   liveFirebaseTouched:false,deployedEndpoint:false,studentSendingLive:false,
   syntheticReportCount:(await db.collection('mcqReviewReports').get()).size,
   outcomes:cases
  };
  fs.writeFileSync(path.join(qa,'audit.json'),JSON.stringify(summary,null,2)+'\n');
  console.log('V99-J FINISHED: '+cases.length+
   ' end-to-end assertions; no production account, project or deployment.');
  await signOut(auth);
 }finally{
  if(testEnv)await testEnv.cleanup();
  await deleteClient(client);
  await deleteAdmin(admin);
 }
}
main().catch(e=>{console.error('V99-J FAILED:',String(e.stack||e).slice(0,2200));process.exitCode=1;});
