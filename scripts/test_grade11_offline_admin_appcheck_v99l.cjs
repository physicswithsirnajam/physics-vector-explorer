#!/usr/bin/env node
'use strict';
/**
 * V99-L: test real firebase-admin App Check service's negative verification
 * with a malformed token; test request-gate-positive wiring ONLY via an
 * explicitly synthetic verifier. No signed App Check JWT can be minted by
 * the standard Firebase Local Emulator Suite.
 */
const assert=require('node:assert/strict');
const {initializeApp,deleteApp}=require('firebase-admin/app');
const {getAppCheck}=require('firebase-admin/app-check');
const {createOfflineAdminAppCheckGate,DEMO_PROJECT}=
 require('../server/offline-admin-appcheck-v99l.cjs');
const {PATH}=require('../server/offline-review-request-gate-v99k.cjs');
const {buildDraft}=require('../shared/mcq-review-contract-v99a.js');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');

const APP_ID='1:1234567890:web:offline-demo';
const APP_TOKEN='synthetic.appcheck.jwt.for.positive.stub';
const BAD_JWT='not-a-valid-appcheck-jwt.mock.payload';
const AUTH='Bearer aaaaaabbbbbbbb.ccccccdddddddd.eeeeeeffffffff';
const RECEIPT='MR-20261122-ABCDEF123456';
const results=[];
function pass(label){results.push(label);console.log('V99-L PASS:',label);}
function envelope(draft,token=APP_TOKEN){
 return {
  method:'POST',path:PATH,contentType:'application/json',
  authorization:AUTH,appCheckToken:token,
  bodyText:JSON.stringify(draft)
 };
}
function rejected(response){
 assert.deepEqual(response,{statusCode:403,body:{ok:false,code:'app-check-required'}});
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,DEMO_PROJECT);
 assert.ok(!process.env.GOOGLE_APPLICATION_CREDENTIALS,
  'No real service credentials may be available in this test');
 const admin=initializeApp({projectId:DEMO_PROJECT},'v99l-no-creds-demo');
 try{
  const realSdk=getAppCheck(admin);
  assert.equal(realSdk.app.options.projectId,DEMO_PROJECT);
  assert.equal(typeof realSdk.verifyToken,'function');
  let downstreamCalls=0;
  const realGate=createOfflineAdminAppCheckGate({
   adminAppCheck:realSdk,allowedAppIds:[APP_ID],
   receiveVerified:async()=>{downstreamCalls++;throw Error('Must never reach intake');}
  });
  const original=await catalog.lookup(catalog.ids()[0]);
  const draft=buildDraft({
   unit:original.unit,questionId:original.id,
   sourceQuestionNumber:original.sourceQuestionNumber,
   bankVersion:original.bankVersion,category:'other',
   note:'Synthetic original source review'
  });
  // A deliberately malformed JWT is rejected by the genuine installed
  // Firebase Admin SDK without credentials or a valid Google-signed token.
  // This does NOT verify that a genuine token can be accepted.
  rejected(await realGate(envelope(draft,BAD_JWT)));
  assert.equal(downstreamCalls,0);
  pass('installed REAL Firebase Admin App Check SDK rejects malformed token; no receiver call or production credential');

  let sdkCalls=0,received=0,observed=null;
  const syntheticAppCheck={
   app:admin,
   verifyToken:async (value,options)=>{
    sdkCalls++;
    assert.deepEqual(options,{consume:false},
     'no claim of replay protection or consumption without deployment approval');
    if(value!==APP_TOKEN)throw Error('private mock SDK verification failed');
    return {appId:APP_ID};
   }
  };
  const stubGate=createOfflineAdminAppCheckGate({
   adminAppCheck:syntheticAppCheck,allowedAppIds:[APP_ID],
   receiveVerified:async request=>{
    received++;observed=request;
    return {status:'received',receiptId:RECEIPT,alreadyReceived:false};
   }
  });
  const accepted=await stubGate(envelope(draft));
  assert.deepEqual(accepted,{statusCode:200,
   body:{ok:true,status:'received',receiptId:RECEIPT,alreadyReceived:false}});
  assert.equal(sdkCalls,1);assert.equal(received,1);
  assert.deepEqual(observed,{authorization:AUTH,draft});
  assert.equal(Object.keys(observed).includes('appCheckToken'),false);
  pass('SYNTHETIC success stub exercises V99-K forwarding only approved fields, not App Check cryptographic authenticity');

  const badToken=await stubGate(envelope(draft,'unknown.untrusted.appcheck.token'));
  rejected(badToken);
  assert.equal(received,1);
  pass('injected verifier failure blocks downstream identity/report callbacks');

  const cases=[
   {name:'missing SDK proof',reply:null},
   {name:'missing app ID',reply:{}},
   {name:'unapproved app ID',reply:{appId:'1:9999999:web:foreign'}},
   {name:'previously consumed token',reply:{appId:APP_ID,alreadyConsumed:true}},
   {name:'malformed app ID',reply:{appId:123}},
   {name:'spoofed app ID field',reply:{token:{appId:APP_ID}}}
  ];
  for(const test of cases){
   let forwarded=0;
   const gate=createOfflineAdminAppCheckGate({
    adminAppCheck:{app:admin,verifyToken:async(_,options)=>{
     assert.deepEqual(options,{consume:false});return test.reply;
    }},
    allowedAppIds:[APP_ID],
    receiveVerified:async()=>{forwarded++;throw Error('Denied proof must not forward');}
   });
   rejected(await gate(envelope(draft)));
   assert.equal(forwarded,0,test.name);
  }
  pass('six malformed, foreign, absent or already-consumed synthetic proof results fail closed');

  const leakedGate=createOfflineAdminAppCheckGate({
   adminAppCheck:{app:admin,verifyToken:async()=>{
    throw Error('Sensitive mock URL /secrets/teacher-admin-token');
   }},
   allowedAppIds:[APP_ID],
   receiveVerified:async()=>{throw Error('Never called');}
  });
  const redacted=await leakedGate(envelope(draft));
  rejected(redacted);
  assert.ok(!JSON.stringify(redacted).includes('teacher-admin-token'));
  pass('raw SDK errors and token details never escape into browser response');

  const otherApp=initializeApp({projectId:'another-demo-project'},'v99l-wrong-project');
  try{
   assert.throws(()=>createOfflineAdminAppCheckGate({
    adminAppCheck:getAppCheck(otherApp),allowedAppIds:[APP_ID],
    receiveVerified:async()=>{}
   }),/Matching demo-project/);
  }finally{await deleteApp(otherApp);}
  const oldProject=process.env.GCLOUD_PROJECT;
  try{
   process.env.GCLOUD_PROJECT='physics-real-production';
   assert.throws(()=>createOfflineAdminAppCheckGate({
    adminAppCheck:realSdk,allowedAppIds:[APP_ID],receiveVerified:async()=>{}
   }),/credential-free demo project/);
  }finally{process.env.GCLOUD_PROJECT=oldProject;}
  const oldCredentials=process.env.GOOGLE_APPLICATION_CREDENTIALS;
  try{
   process.env.GOOGLE_APPLICATION_CREDENTIALS='/synthetic/never-existing-service-key.json';
   assert.throws(()=>createOfflineAdminAppCheckGate({
    adminAppCheck:realSdk,allowedAppIds:[APP_ID],receiveVerified:async()=>{}
   }),/credential-free demo project/);
  }finally{
   if(oldCredentials===undefined)delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
   else process.env.GOOGLE_APPLICATION_CREDENTIALS=oldCredentials;
  }
  pass('refuses wrong Firebase App Check project, production ID, and service-account credentials');

  console.log('V99-L FINISHED: '+results.length+' quality groups. Genuine App Check positive verification NOT demonstrated; no endpoint, production access or student send.');
 }finally{await deleteApp(admin);}
}
main().catch(e=>{
 console.error('V99-L TEST FAILED:',String(e.stack||e).slice(0,1600));
 process.exitCode=1;
});
