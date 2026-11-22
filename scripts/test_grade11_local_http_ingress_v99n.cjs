#!/usr/bin/env node
'use strict';
/**
 * V99-N — real Node HTTP socket tests against 127.0.0.1 ephemeral port.
 * NO Firebase connection, deployed endpoint, real App Check token or student.
 * Positive report acknowledgment is an explicitly SYNTHETIC gate stub.
 */
const assert=require('node:assert/strict');
const http=require('node:http');
const {startLocalReviewHttpRehearsal,DEMO_PROJECT,MAX_READ_MS}=
 require('../server/local-http-review-ingress-v99n.cjs');
const {createOfflineRequestGate,MAX_BODY_BYTES,PATH,publicError,RequestGateError}=
 require('../server/offline-review-request-gate-v99k.cjs');
const {buildDraft}=require('../shared/mcq-review-contract-v99a.js');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');

const APP_ID='1:1234567890:web:offline-rehearsal';
const APP_TOKEN='synthetic.appcheck.for.http.rehearsal';
const ID_TOKEN='aaaaaaaaabbbbbbbbb.cccccccccddddddddd.eeeeeeeeefffffffff';
const AUTHORIZATION='Bearer '+ID_TOKEN;
const RECEIPT='MR-20261122-ABCDEF123456';
const outcomes=[];
function pass(label){outcomes.push(label);console.log('V99-N PASS:',label);}
function check(response,status,code){
 assert.equal(response.statusCode,status);
 assert.deepEqual(response.body,{ok:false,code});
 assert.equal(response.headers['cache-control'],'no-store');
 assert.equal(response.headers['x-content-type-options'],'nosniff');
 assert.equal(response.headers['access-control-allow-origin'],undefined,
  'test-only server must not announce broad CORS permissions');
}
function send(target,{method='POST',path=PATH,body='',headers={},chunks=null}={}){
 return new Promise((resolve,reject)=>{
  const url=new URL(target.origin+path);
  const config={
   hostname:url.hostname,port:Number(url.port),path:url.pathname+url.search,
   method,agent:false,
   headers:{
    Host:url.host,Origin:target.origin,'Content-Type':'application/json',
    Authorization:AUTHORIZATION,'X-Firebase-AppCheck':APP_TOKEN,...headers
   }
  };
  const req=http.request(config,res=>{
   const parts=[];
   res.on('data',c=>parts.push(c));
   res.on('error',reject);
   res.on('end',()=>{
    const raw=Buffer.concat(parts).toString('utf8');
    try{
     resolve({statusCode:res.statusCode,headers:res.headers,body:JSON.parse(raw),
      raw});
    }catch(e){reject(new Error('Non-JSON or broken response: '+e.message));}
   });
  });
  req.on('error',reject);
  if(chunks){
   for(const c of chunks)req.write(c);
   req.end();
  }else req.end(body);
 });
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,DEMO_PROJECT);
 assert.equal(process.env.PSN_LOCAL_HTTP_REHEARSAL,'enabled-local-test-only');
 assert.ok(!process.env.GOOGLE_APPLICATION_CREDENTIALS);
 assert.equal(catalog.total,2250);
 const q=await catalog.lookup(catalog.ids()[0]);
 const valid=buildDraft({
  unit:q.unit,questionId:q.id,
  sourceQuestionNumber:q.sourceQuestionNumber,
  bankVersion:q.bankVersion,category:'other',note:'Synthetic HTTP request test only'
 });
 let enabled=false,handlerCalls=0,appChecks=0,received=0;
 const gate=createOfflineRequestGate({
  verifyAppCheckToken:async token=>{
   appChecks++;
   if(token!==APP_TOKEN)throw Error('invalid synthetic proof');
   return {appId:APP_ID};
  },
  allowedAppIds:[APP_ID],
  receiveVerified:async()=>{
   received++;
   return {status:'received',receiptId:RECEIPT,alreadyReceived:false};
  }
 });
 const listener=await startLocalReviewHttpRehearsal({
  handle:async value=>{
   handlerCalls++;
   // Explicit test-only OFF gate. In production a trusted backend must use
   // V99-M default-OFF server switch, not this synthetic fixture callback.
   if(!enabled)return publicError(new RequestGateError('temporarily-unavailable'));
   return gate(value);
  }
 });
 try{
  const validBody=JSON.stringify(valid);
  assert.ok(Buffer.byteLength(validBody,'utf8')<MAX_BODY_BYTES);
  check(await send(listener,{body:validBody}),503,'temporarily-unavailable');
  assert.equal(appChecks,0);assert.equal(received,0);
  pass('real loopback HTTP listener is guarded by an OFF-by-default synthetic downstream gate');

  const beforeHeaders=handlerCalls;
  const invalidRequests=[
   [{method:'GET',body:validBody},405,'unsupported-method'],
   [{method:'OPTIONS',body:validBody},405,'unsupported-method'],
   [{path:'/not-the-report-path',body:validBody},400,'invalid-request'],
   [{path:PATH+'?uid=spoof',body:validBody},400,'invalid-request'],
   [{body:validBody,headers:{Origin:'http://evil.example'}},400,'invalid-request'],
   [{body:validBody,headers:{Host:'evil.example'}},400,'invalid-request'],
   [{body:validBody,headers:{Cookie:'fake_session=token'}},400,'invalid-request'],
   [{body:validBody,headers:{'X-Forwarded-For':'203.0.113.88'}},400,'invalid-request'],
   [{body:'x'.repeat(MAX_BODY_BYTES+1),
      headers:{'Content-Length':String(MAX_BODY_BYTES+1)}},413,'payload-too-large']
  ];
  for(const [args,status,code] of invalidRequests)
   check(await send(listener,args),status,code);
  assert.equal(handlerCalls,beforeHeaders,
   'malformed method/host/origin/route and declared-oversize body must never reach handler');
  pass('9 unsafe methods, paths, origin/host/cookie/proxy headers and declared oversize inputs denied before handler');

  const beforeChunk=handlerCalls;
  const chunked=await send(listener,{
   chunks:['x'.repeat(2010),'z'.repeat(2100)],headers:{'Transfer-Encoding':'chunked'}
  });
  check(chunked,413,'payload-too-large');
  assert.equal(handlerCalls,beforeChunk,
   'chunked body exceeding limit must be rejected before business logic');
  pass('streaming chunked HTTP input exceeding 4096 bytes is stopped at ingress before full buffering');

  const emoji=await send(listener,{body:'🌊'.repeat(1025)});
  check(emoji,413,'payload-too-large');
  assert.equal(handlerCalls,beforeChunk,
   'UTF-8 body size must use bytes, not JS string length');
  pass('UTF-8 multibyte body bytes, not character count, enforce the 4 KiB upload cap');

  const exactly=await send(listener,{body:'x'.repeat(MAX_BODY_BYTES)});
  check(exactly,503,'temporarily-unavailable');
  assert.equal(handlerCalls,beforeChunk+1,
   'an exactly 4096-byte body may pass to downstream test handler');
  pass('exact 4096-byte boundary is accepted at ingress; downstream remains OFF');

  enabled=true;
  const accepted=await send(listener,{body:validBody});
  assert.equal(accepted.statusCode,200);
  assert.deepEqual(accepted.body,{
   ok:true,status:'received',receiptId:RECEIPT,alreadyReceived:false
  });
  assert.equal(appChecks,1);assert.equal(received,1);
  assert.equal(accepted.headers['access-control-allow-origin'],undefined);
  pass('enabled synthetic verifier can exercise a successful HTTP response without a live Firebase submission');

  const badContent=await send(listener,{body:validBody,
   headers:{'Content-Type':'text/plain'}});
  check(badContent,415,'unsupported-content-type');
  const badAuth=await send(listener,{body:validBody,headers:{Authorization:'Bearer invalid'}});
  check(badAuth,401,'authentication-required');
  const badApp=await send(listener,{body:validBody,
   headers:{'X-Firebase-AppCheck':'invalid.synthetic.proof.value'}});
  check(badApp,403,'app-check-required');
  const forgedBody=await send(listener,{body:JSON.stringify({...valid,ownerUid:'admin'})});
  check(forgedBody,400,'invalid-report');
  assert.equal(received,1);
  pass('Content-Type, malformed bearer, invalid synthetic App Check and forged report owner denied downstream');

  enabled=false;
  check(await send(listener,{body:validBody}),503,'temporarily-unavailable');
  assert.equal(received,1);
  pass('re-enabled test path can be switched OFF again with no subsequent processing');

  // The HTTP writer must redact misbehaving downstream results, not print
  // arbitrary private fields or exception text back to a browser.
  const malformed=await startLocalReviewHttpRehearsal({
   handle:async()=>({statusCode:200,body:{
    ok:true,status:'received',receiptId:RECEIPT,alreadyReceived:false,
    ownerUid:'private-student-uid'}})
  });
  try{
   const response=await send(malformed,{body:validBody});
   check(response,503,'temporarily-unavailable');
   assert.ok(!response.raw.includes('private-student-uid'));
  }finally{await malformed.close();}
  const throwing=await startLocalReviewHttpRehearsal({
   handle:async()=>{throw Error('secret record path /academicEnrollments/private');}
  });
  try{
   const response=await send(throwing,{body:validBody});
   check(response,503,'temporarily-unavailable');
   assert.ok(!response.raw.includes('academicEnrollments'));
  }finally{await throwing.close();}
  pass('real HTTP error responses redact unexpected downstream owner fields and internal exception text');

  const savedProject=process.env.GCLOUD_PROJECT;
  try{
   process.env.GCLOUD_PROJECT='live-firebase-project';
   await assert.rejects(startLocalReviewHttpRehearsal({handle:gate}),
    /credential-free demo localhost/);
  }finally{process.env.GCLOUD_PROJECT=savedProject;}
  const savedFlag=process.env.PSN_LOCAL_HTTP_REHEARSAL;
  try{
   delete process.env.PSN_LOCAL_HTTP_REHEARSAL;
   await assert.rejects(startLocalReviewHttpRehearsal({handle:gate}),
    /credential-free demo localhost/);
  }finally{process.env.PSN_LOCAL_HTTP_REHEARSAL=savedFlag;}
  const savedCredentials=process.env.GOOGLE_APPLICATION_CREDENTIALS;
  try{
   process.env.GOOGLE_APPLICATION_CREDENTIALS='/fake/private-admin-credentials.json';
   await assert.rejects(startLocalReviewHttpRehearsal({handle:gate}),
    /credential-free demo localhost/);
  }finally{
   if(savedCredentials===undefined)delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
   else process.env.GOOGLE_APPLICATION_CREDENTIALS=savedCredentials;
  }
  pass('local listener constructor refuses any non-demo project, missing explicit test flag or credentials');

  // Static quality assertions: no Firebase app, cloud function or dev server
  // startup is imported or registered as a production component.
  const source=require('node:fs').readFileSync(
   require('node:path').resolve(__dirname,'../server/local-http-review-ingress-v99n.cjs'),'utf8');
  assert.ok(!/firebase-admin|firebase\/functions|onRequest\s*\(/.test(source));
  assert.ok(MAX_READ_MS<=5000);
  console.log('V99-N FINISHED: '+outcomes.length+
   ' quality groups. REAL loopback HTTP only, synthetically accepted requests, no Firebase deployment.');
 }finally{await listener.close();}
}
main().catch(e=>{console.error('V99-N FAILED:',String(e.stack||e).slice(0,2400));process.exitCode=1;});
