#!/usr/bin/env node
'use strict';
/**
 * V99-O: TRACE the complete MCQ report pathway over genuine LOCAL TCP/HTTP,
 * through V99-N ingress + V99-M fail-closed switch + V99-L App Check interface
 * + V99-J real Firebase Auth Emulator and Firestore Admin transactions.
 *
 * Positive App Check attestation is a SYNTHETIC verifier. The Firebase Local
 * Emulator Suite does not issue genuinely signed App Check tokens. The actual
 * Admin App Check SDK is used only for its invalid-token denial path.
 *
 * No deployed endpoint, no real Firebase project, no student/teacher accounts.
 */
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {initializeApp:initializeAdmin,deleteApp:deleteAdmin}=require('firebase-admin/app');
const {getAuth:adminAuthFor}=require('firebase-admin/auth');
const {getAppCheck}=require('firebase-admin/app-check');
const {getFirestore}=require('firebase-admin/firestore');
const {initializeApp:initializeClient,deleteApp:deleteClient}=require('firebase/app');
const {getAuth,connectAuthEmulator,createUserWithEmailAndPassword,reload,signOut}=
 require('firebase/auth');
const {createLocalSwitchableReviewGate}=
 require('../server/local-report-switch-v99m.cjs');
const {startLocalReviewHttpRehearsal}=
 require('../server/local-http-review-ingress-v99n.cjs');
const {PATH,MAX_BODY_BYTES}=require('../server/offline-review-request-gate-v99k.cjs');
const {PROJECT,AUTH_HOST,FS_HOST}=
 require('../server/local-review-pipeline-v99j.cjs');
const {buildDraft}=require('../shared/mcq-review-contract-v99a.js');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');

const APP_ID='1:1234567890:web:v99o-demo';
const SYNTHETIC_APP_TOKEN='synthetic.appcheck.token.v99o.local';
const INVALID_APP_JWT='not-a-real-appcheck-jwt.mock.payload';
const evidence=path.resolve(__dirname,'../qa-artifacts/http-to-firestore-v99o');
const passed=[];
function pass(label){passed.push(label);console.log('V99-O PASS:',label);}
function draft(q,category='missing-context'){
 return buildDraft({
  unit:q.unit,questionId:q.id,sourceQuestionNumber:q.sourceQuestionNumber,
  bankVersion:q.bankVersion,category,
  note:'Synthetic Grade XI source question review, no private information.'
 });
}
function expectError(response,statusCode,code){
 assert.equal(response.statusCode,statusCode);
 assert.deepEqual(response.body,{ok:false,code});
 assert.equal(response.headers['cache-control'],'no-store');
 assert.equal(response.headers['x-content-type-options'],'nosniff');
 assert.equal(response.headers['access-control-allow-origin'],undefined);
}
function httpSend(listener,{
 method='POST',route=PATH,body='',token='',appToken=SYNTHETIC_APP_TOKEN,
 headers={},chunks=null
}={}){
 return new Promise((resolve,reject)=>{
  const target=new URL(listener.origin+route);
  const req=http.request({
   hostname:target.hostname,port:Number(target.port),path:target.pathname+target.search,
   method,agent:false,
   headers:{
    Host:target.host,Origin:listener.origin,
    'Content-Type':'application/json',
    Authorization:'Bearer '+token,
    'X-Firebase-AppCheck':appToken,
    ...headers
   }
  },res=>{
   const parts=[];
   res.on('data',c=>parts.push(c));
   res.on('error',reject);
   res.on('end',()=>{
    try{
     const raw=Buffer.concat(parts).toString('utf8');
     resolve({statusCode:res.statusCode,body:JSON.parse(raw),headers:res.headers,raw});
    }catch(e){reject(e);}
   });
  });
  req.on('error',reject);
  if(chunks){for(const part of chunks)req.write(part);req.end();}
  else req.end(body);
 });
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
 assert.equal(process.env.PSN_LOCAL_HTTP_REHEARSAL,'enabled-local-test-only');
 assert.ok(!process.env.GOOGLE_APPLICATION_CREDENTIALS);
 assert.equal(catalog.total,2250);
 assert.equal(catalog.ids().length,2250);
 assert.ok(!Object.keys(require.cache).some(p=>
  p.includes('approved-practice-catalog-v99g')||
  p.includes('practice-bank-adapter-v55')),
  'HTTP request-time catalog must never run a browser bank adapter or vm');
 const q5=await catalog.lookup(catalog.ids().find(id=>id.startsWith('g11-u05-master-')));
 const q3=await catalog.lookup(catalog.ids().find(id=>id.startsWith('g11-u03-master-')));
 assert.ok(q5&&q3);
 const d5=draft(q5),d3=draft(q3);
 fs.mkdirSync(evidence,{recursive:true});
 const admin=initializeAdmin({projectId:PROJECT},'v99o-http-admin-demo');
 const browser=initializeClient({
  apiKey:'demo-v99o-local-only',projectId:PROJECT,
  authDomain:PROJECT+'.firebaseapp.com'
 },'v99o-http-browser-demo');
 let server=null;
 try{
  const db=getFirestore(admin),adminAuth=adminAuthFor(admin);
  const clientAuth=getAuth(browser);
  connectAuthEmulator(clientAuth,'http://'+AUTH_HOST,{disableWarnings:true});
  const clock={value:Date.parse('2026-11-22T15:45:00.000Z')};
  let enabled=false,appCalls=0,realSdkCalls=0;
  const fakeAppCheck={
   app:admin,
   verifyToken:async(input,options)=>{
    appCalls++;
    assert.deepEqual(options,{consume:false});
    if(input!==SYNTHETIC_APP_TOKEN)throw Error('Synthetic only, no attestation');
    return {appId:APP_ID};
   }
  };
  const gate=createLocalSwitchableReviewGate({
   firestore:db,adminAuth,adminAppCheck:fakeAppCheck,
   allowedAppIds:[APP_ID],now:()=>clock.value,isEnabled:()=>enabled
  });
  server=await startLocalReviewHttpRehearsal({handle:gate});
  const account=await createUserWithEmailAndPassword(
   clientAuth,'v99o-test-account@example.test','Synthetic-Only-Password123!'
  );
  const uid=account.user.uid;
  let token=await account.user.getIdToken();
  const send=(report=d5,opts={})=>httpSend(server,{
   token,body:JSON.stringify(report),...opts
  });

  expectError(await send(),503,'temporarily-unavailable');
  assert.equal(appCalls,0);
  assert.equal((await db.collection('mcqReviewReports').get()).size,0);
  pass('real localhost HTTP request refused by default-OFF backend before any App Check or Firestore activity');

  enabled=true;
  expectError(await send(),403,'verified-email-required');
  assert.equal((await db.collection('mcqReviewReports').get()).size,0);
  pass('unverified real Auth Emulator account denied through entire HTTP stack');

  await adminAuth.updateUser(uid,{emailVerified:true});
  await reload(account.user);
  token=await account.user.getIdToken(true);
  expectError(await send(),403,'enrollment-required');
  assert.equal((await db.collection('mcqReviewReports').get()).size,0);
  pass('verified real Auth token still requires trusted Grade XI enrollment via HTTP request');

  await db.doc('academicEnrollments/'+uid).set({
   uid,grade:11,board:'fbise',status:'active',type:'independent'
  });
  const first=await send();
  assert.equal(first.statusCode,200);
  assert.equal(first.body.ok,true);
  assert.equal(first.body.status,'received');
  assert.equal(first.body.alreadyReceived,false);
  assert.match(first.body.receiptId,/^MR-\d{8}-[A-F0-9]{12}$/);
  assert.deepEqual(Object.keys(first.body),['ok','status','receiptId','alreadyReceived']);
  const stored=await db.collection('mcqReviewReports').get();
  assert.equal(stored.size,1);
  const row=stored.docs[0].data();
  assert.equal(row.questionId,q5.id);
  assert.equal(row.bankVersion,q5.bankVersion);
  assert.equal(row.ownerUid,uid);
  assert.equal(row.status,'new');
  for(const forbidden of ['email','score','correctOptionId','selectedAnswer','password','admin'])
   assert.equal(row[forbidden],undefined);
  assert.equal((await db.collection('mcqReviewRate').get()).size,1);
  assert.equal(first.headers['cache-control'],'no-store');
  assert.equal(first.headers['access-control-allow-origin'],undefined);
  pass('HTTP-to-Firestore: synthetic App Check positive, real verified Firebase Auth token and atomic Admin report/rate write; public receipt sanitized');

  const repeat=await send();
  assert.equal(repeat.statusCode,200);
  assert.equal(repeat.body.alreadyReceived,true);
  assert.equal(repeat.body.receiptId,first.body.receiptId);
  assert.equal((await db.collection('mcqReviewReports').get()).size,1);
  assert.equal((await db.collection('mcqReviewRate').get()).docs[0].data().count,1);
  pass('same real HTTP report is idempotent and does not consume a second per-student quota');

  expectError(await send(d3),429,'please-try-later');
  assert.equal((await db.collection('mcqReviewReports').get()).size,1);
  clock.value+=60_000;
  const second=await send(d3);
  assert.equal(second.statusCode,200);
  assert.equal(second.body.alreadyReceived,false);
  assert.equal((await db.collection('mcqReviewReports').get()).size,2);
  pass('new original Unit 3 MCQ honors 60-second cooldown through HTTP and transactional Firestore');

  const beforeApp=appCalls;
  const beforeReports=(await db.collection('mcqReviewReports').get()).size;
  expectError(await send(d3,{
   chunks:['z'.repeat(2030),'x'.repeat(2070)],
   body:undefined,headers:{'Transfer-Encoding':'chunked'}
  }),413,'payload-too-large');
  assert.equal(appCalls,beforeApp);
  assert.equal((await db.collection('mcqReviewReports').get()).size,beforeReports);
  pass('oversized streamed chunked HTTP body returns 413 before App Check, Auth or Firestore');

  const big='🌊'.repeat(Math.ceil(MAX_BODY_BYTES/4)+1);
  expectError(await send(d3,{body:big}),413,'payload-too-large');
  expectError(await send(d3,{method:'GET'}),405,'unsupported-method');
  expectError(await send(d3,{headers:{Origin:'http://invalid.example'}}),400,'invalid-request');
  pass('multibyte UTF-8 overflow, unsafe method and external Origin rejected at HTTP ingress');

  expectError(await send(d3,{appToken:'synthetic.invalid.appcheck.token'}),403,'app-check-required');
  expectError(await send(d3,{token:token+'.tamper'}),401,'authentication-required');
  expectError(await send({...d3,ownerUid:'forged-owner'}),400,'invalid-report');
  const fake=buildDraft({
   unit:5,questionId:'XI-U05-MCQ-9999',sourceQuestionNumber:4999,
   bankVersion:'unapproved',category:'other',note:'Synthetic unknown'
  });
  expectError(await send(fake),404,'unavailable-question');
  assert.equal((await db.collection('mcqReviewReports').get()).size,2);
  pass('forged App Check, tampered Firebase token, client-supplied owner and unapproved MCQ denied before storage');

  enabled=false;
  const callsBeforeOff=appCalls;
  expectError(await send(d3),503,'temporarily-unavailable');
  expectError(await send(d3,{headers:{'X-Firebase-AppCheck':'browser-set-admin-claim'}}),
   503,'temporarily-unavailable');
  assert.equal(appCalls,callsBeforeOff);
  assert.equal((await db.collection('mcqReviewReports').get()).size,2);
  pass('server-owned OFF switch blocks subsequent HTTP requests, cannot be overridden by client headers');

  enabled=true;
  const realAppCheckGate=createLocalSwitchableReviewGate({
   firestore:db,adminAuth,adminAppCheck:{
    app:admin,
    verifyToken:async(value,opts)=>{
     realSdkCalls++;
     return getAppCheck(admin).verifyToken(value,opts);
    }
   },
   allowedAppIds:[APP_ID],now:()=>clock.value,isEnabled:()=>enabled
  });
  const realAppServer=await startLocalReviewHttpRehearsal({handle:realAppCheckGate});
  try{
   expectError(await httpSend(realAppServer,{
    body:JSON.stringify(d5),token,appToken:'not-a-valid-appcheck-jwt.mock.payload'
   }),403,'app-check-required');
   assert.equal(realSdkCalls,1);
   assert.equal((await db.collection('mcqReviewReports').get()).size,2);
  }finally{await realAppServer.close();}
  pass('actual Firebase Admin App Check SDK rejects malformed JWT over local HTTP without a database write');

  const record={
   version:'V99-O',mode:'loopback HTTP + Auth/Firestore emulators',
   approvedPublicMCQReferences:2250,
   signedAppCheckPositiveProofVerified:false,
   positiveAppCheckMockOnly:true,
   realAdminSdkMalformedAppCheckDenied:true,
   emulatorFirebaseAuthVerified:true,
   emulatorFirestoreAdminTransactionVerified:true,
   localhostHttpStreamingCap:MAX_BODY_BYTES,
   offByDefault:true,
   publicEndpointDeployed:false,
   productionDatabaseTouched:false,
   latestReportCount:(await db.collection('mcqReviewReports').get()).size,
   cases:passed
  };
  fs.writeFileSync(path.join(evidence,'summary.json'),JSON.stringify(record,null,2)+'\n');
  console.log('V99-O FINISHED: '+passed.length+' groups passed; NO PUBLIC REPORT ENDPOINT OR LIVE FIREBASE USE');
  await signOut(clientAuth);
 }finally{
  if(server)await server.close();
  await deleteClient(browser);
  await deleteAdmin(admin);
 }
}
main().catch(e=>{
 console.error('V99-O FAILED:',String(e.stack||e).slice(0,2200));
 process.exitCode=1;
});
