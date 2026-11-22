#!/usr/bin/env node
'use strict';
/** V99-K offline-only request envelope / safe response regression tests.
 * App Check and Firebase ID token verifiers here are SYNTHETIC injected
 * functions, NOT cryptographic validation. Real SDK integration is separately
 * tested for Firebase ID tokens by V99-J, not for App Check yet.
 */
const assert=require('node:assert/strict');
const {PATH,MAX_BODY_BYTES,createOfflineRequestGate,parseRequest}=
 require('../server/offline-review-request-gate-v99k.cjs');
const {createVerifiedReviewBoundary,ReviewAuthenticationError}=
 require('../server/verified-report-boundary-v99g.cjs');
const {IntakeError}=require('../server/mcq-review-intake-v99e.cjs');
const {buildDraft}=require('../shared/mcq-review-contract-v99a.js');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');

const APP_ID='1:1234567890:web:demo123';
const APP_TOKEN='synthetic.appcheck.token.for.offline.tests';
const ID_TOKEN='aaaaabbbbbccccc.dddddeeeeefffff.ggggghhhhhiiiii';
const AUTHORIZATION='Bearer '+ID_TOKEN;
const PROJECT='demo-psn-v99f-firestore';
const RECEIPT='MR-20261122-ABCDEF123456';
const outcomes=[];
function pass(label){outcomes.push(label);console.log('V99-K PASS:',label);}
function envelope(draft){
 return {
  method:'POST',path:PATH,contentType:'application/json; charset=utf-8',
  authorization:AUTHORIZATION,appCheckToken:APP_TOKEN,
  bodyText:JSON.stringify(draft)
 };
}
function expectFailure(value,statusCode,code){
 assert.equal(value.statusCode,statusCode);
 assert.deepEqual(value.body,{ok:false,code});
 assert.deepEqual(Object.keys(value),['statusCode','body']);
}

async function main(){
 assert.equal(catalog.total,2250);
 const original=await catalog.lookup(catalog.ids()[0]);
 assert.ok(original&&original.publicPractice);
 const draft=buildDraft({
  unit:original.unit,questionId:original.id,
  sourceQuestionNumber:original.sourceQuestionNumber,
  bankVersion:original.bankVersion,category:'missing-context',
  note:'Synthetic diagram concern, no personally identifying information.'
 });
 const request=envelope(draft);
 assert.ok(Buffer.byteLength(request.bodyText,'utf8')<MAX_BODY_BYTES);
 assert.deepEqual(parseRequest(request).draft,draft);

 let appChecks=0,authChecks=0,received=0,lastOwner=null;
 const verified=createVerifiedReviewBoundary({
  projectId:PROJECT,
  verifyIdToken:async (_token,checkRevoked)=>{
   authChecks++;
   assert.equal(checkRevoked,true);
   return {aud:PROJECT,iss:'https://securetoken.google.com/'+PROJECT,
    uid:'synthetic-learner-1',sub:'synthetic-learner-1',email_verified:true};
  },
  receive:async input=>{
   received++;lastOwner=input.callerIdentity;
   assert.deepEqual(input.draft,draft);
   return {status:'received',receiptId:RECEIPT,alreadyReceived:false};
  }
 });
 const gate=createOfflineRequestGate({
  verifyAppCheckToken:async token=>{
   appChecks++;
   if(token!==APP_TOKEN)throw Error('raw synthetic verifier secret must not appear in response');
   return {appId:APP_ID};
  },
  allowedAppIds:[APP_ID],
  receiveVerified:verified
 });
 const accepted=await gate(request);
 assert.deepEqual(accepted,{
  statusCode:200,body:{ok:true,status:'received',receiptId:RECEIPT,
   alreadyReceived:false}
 });
 assert.deepEqual(lastOwner,{uid:'synthetic-learner-1',emailVerified:true});
 assert.equal(appChecks,1);assert.equal(authChecks,1);assert.equal(received,1);
 pass('valid source-backed JSON envelope passes synthetic App Check contract, verified identity and safe receipt projection');

 const preflightCases=[
  [{...request,method:'GET'},405,'unsupported-method'],
  [{...request,path:'/other'},400,'invalid-request'],
  [{...request,contentType:'text/plain'},415,'unsupported-content-type'],
  [{...request,bodyText:'a'.repeat(MAX_BODY_BYTES+1)},413,'payload-too-large'],
  [{...request,authorization:'Bearer BAD'},401,'authentication-required'],
  [{...request,authorization:123},401,'authentication-required'],
  [{...request,appCheckToken:''},403,'app-check-required'],
  [{...request,appCheckToken:'x'.repeat(8193)},403,'app-check-required'],
  [{...request,appCheckToken:APP_TOKEN+'+'},403,'app-check-required'],
  [{...request,bodyText:'not-json'},400,'invalid-report'],
  [{...request,bodyText:'[]'},400,'invalid-report'],
  [{...request,bodyText:'{"__proto__":1}'},400,'invalid-report'],
  [{...request,bodyText:JSON.stringify({...draft,admin:true})},400,'invalid-report'],
  [{...request,bodyText:JSON.stringify({...draft,ownerUid:'attacker'})},400,'invalid-report'],
  [{...request,bodyText:JSON.stringify({...draft,category:'not-real'})},400,'invalid-report'],
  [{...request,bodyText:JSON.stringify({...draft,note:'x'.repeat(501)})},400,'invalid-report'],
  [{...request,callerIdentity:{uid:'admin'}},400,'invalid-request'],
  [null,400,'invalid-request'],
  [[],400,'invalid-request'],
  [Object.assign(Object.create(null),{...request,unknown:1}),400,'invalid-request'],
  [{...request,bodyText:null},400,'invalid-request']
 ];
 for(const [raw,status,code] of preflightCases){
  const before=[appChecks,authChecks,received];
  const response=await gate(raw);
  expectFailure(response,status,code);
  assert.deepEqual([appChecks,authChecks,received],before,
   'invalid request must never invoke App Check/Auth/Firestore receive');
 }
 pass(preflightCases.length+' malformed, oversized, spoofed, unsupported or invalid-draft envelopes denied before any trusted callback');

 const deniedProof=await gate({...request,appCheckToken:'synthetic.invalid.appcheck.token'});
 expectFailure(deniedProof,403,'app-check-required');
 assert.equal(authChecks,1);assert.equal(received,1);
 const wrongApp=createOfflineRequestGate({
  verifyAppCheckToken:async()=>({appId:'1:foreign:web:app'}),
  allowedAppIds:[APP_ID],receiveVerified:async()=>{throw Error('must not reach receiver');}
 });
 expectFailure(await wrongApp(request),403,'app-check-required');
 const noProof=createOfflineRequestGate({
  verifyAppCheckToken:async()=>null,allowedAppIds:[APP_ID],
  receiveVerified:async()=>{throw Error('must not reach receiver');}
 });
 expectFailure(await noProof(request),403,'app-check-required');
 pass('synthetic App Check verifier failures, unknown app IDs and empty proof fail closed before identity processing');

 assert.throws(()=>createOfflineRequestGate({
  verifyAppCheckToken:()=>({appId:APP_ID}),allowedAppIds:[],receiveVerified:async()=>{}
 }),TypeError);
 assert.throws(()=>createOfflineRequestGate({
  verifyAppCheckToken:()=>({appId:APP_ID}),allowedAppIds:[APP_ID,APP_ID],receiveVerified:async()=>{}
 }),TypeError);
 const allowedIds=[APP_ID],captured=createOfflineRequestGate({
  verifyAppCheckToken:async()=>({appId:'newly-added-invalid-app'}),
  allowedAppIds:allowedIds,receiveVerified:async()=>{throw Error('not called');}
 });
 allowedIds.push('newly-added-invalid-app');
 expectFailure(await captured(request),403,'app-check-required');
 pass('verifier and app allowlist configuration required; future mutations cannot enlarge the trusted app list');

 const failures=[
  [new ReviewAuthenticationError('authentication-required'),401,'authentication-required'],
  [new ReviewAuthenticationError('verified-email-required'),403,'verified-email-required'],
  [new IntakeError('enrollment-required'),403,'enrollment-required'],
  [new IntakeError('invalid-report'),400,'invalid-report'],
  [new IntakeError('unavailable-question'),404,'unavailable-question'],
  [new IntakeError('please-try-later'),429,'please-try-later'],
  [new IntakeError('daily-limit-reached'),429,'daily-limit-reached'],
  [new Error('Sensitive Firestore path /students/private@example.com'),503,'temporarily-unavailable'],
  [{code:'daily-limit-reached'},503,'temporarily-unavailable']
 ];
 for(const [failure,status,code] of failures){
  const failingGate=createOfflineRequestGate({
   allowedAppIds:[APP_ID],verifyAppCheckToken:async()=>({appId:APP_ID}),
   receiveVerified:async()=>{throw failure;}
  });
  const response=await failingGate(request);
  expectFailure(response,status,code);
  const printed=JSON.stringify(response);
  assert.ok(!printed.includes('private@example.com')&&!printed.includes(ID_TOKEN)&&
   !printed.includes(APP_TOKEN)&&!printed.includes(draft.note),
   'never leak raw tokens, private paths or report note');
 }
 pass('known auth, enrollment, source and quota errors map to fixed codes; unknown/internal errors are redacted');

 const bogus=createOfflineRequestGate({
  verifyAppCheckToken:async()=>({appId:APP_ID}),
  allowedAppIds:[APP_ID],
  receiveVerified:async()=>({
   status:'received',receiptId:RECEIPT,alreadyReceived:false,ownerUid:'private-uid'
  })
 });
 expectFailure(await bogus(request),503,'temporarily-unavailable');
 const goodDuplicate=createOfflineRequestGate({
  verifyAppCheckToken:async()=>({appId:APP_ID}),allowedAppIds:[APP_ID],
  receiveVerified:async()=>({status:'received',receiptId:RECEIPT,alreadyReceived:true})
 });
 const dupe=await goodDuplicate(request);
 assert.deepEqual(dupe.body,{ok:true,status:'received',
  receiptId:RECEIPT,alreadyReceived:true});
 pass('success receipts expose only fixed fields; unexpected owner/secret fields trigger safe failure; duplicate receipt preserved');
 console.log('V99-K FINISHED: '+outcomes.length+' groups passed, '+preflightCases.length+
  ' blocked preflight shapes and '+failures.length+' safe failure mappings. OFFLINE ONLY; no live App Check SDK or Firebase endpoint.');
}
main().catch(e=>{console.error('V99-K TEST FAILED:',e);process.exitCode=1;});
