#!/usr/bin/env node
'use strict';
/**
 * V100-A real ephemeral 127.0.0.1 HTTP + REAL Firebase local Auth/Firestore
 * emulators, synthetic admin/student identities and seeded fake reports only.
 * The public GitHub Pages portal and real Firebase remain untouched.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {initializeApp:adminApp,deleteApp:deleteAdminApp}=
 require('firebase-admin/app');
const {getAuth:adminAuthFor}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const {initializeApp:clientApp,deleteApp:deleteClientApp}=
 require('firebase/app');
const {getAuth,connectAuthEmulator,signInWithEmailAndPassword,signOut}=
 require('firebase/auth');
const {PROJECT,HOST:FS_HOST,REPORTS,RATES}=
 require('../server/firebase-review-emulator-v99f.cjs');
const {PATH,PAGE_SIZE,startLocalAdminReviewHttpRehearsal}=
 require('../server/local-http-admin-review-v100a.cjs');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');
const AUTH_HOST='127.0.0.1:9099';
const PASSWORD='V100A-SYNTHETIC-ONLY-12345678!';
const OUT=path.resolve(__dirname,'../qa-artifacts/local-admin-http-v100a');
const cases=[];
function pass(label){cases.push(label);console.log('V100-A PASS:',label);}
function sent(url,{method='GET',headers={},body}={}){
 return new Promise((resolve,reject)=>{
  const request=http.request(url,{
   method,headers,agent:false,timeout:4000
  },response=>{
   let out='';
   response.on('data',x=>{
    out+=x.toString('utf8');
    if(out.length>12000)request.destroy(Error('oversize response'));
   });
   response.on('end',()=>{
    try{resolve({
     status:response.statusCode,headers:response.headers,
     body:JSON.parse(out),raw:out
    });}catch{reject(Error('invalid or excessive JSON response'));}
   });
  });
  request.on('timeout',()=>request.destroy(Error('loopback test timeout')));
  request.on('error',reject);
  if(body!==undefined)request.write(body);
  request.end();
 });
}
function denial(result,code,status){
 assert.equal(result.status,status);
 assert.deepEqual(result.body,{ok:false,code});
 assert.equal(result.headers['access-control-allow-origin'],undefined);
 assert.ok(!result.raw.includes('synthetic-private-email'));
 assert.ok(!result.raw.includes('NEVER_LEAK_PRIVATE'));
}
function authHeader(token){
 return {Authorization:'Bearer '+token};
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
 assert.equal(process.env.PSN_LOCAL_ADMIN_HTTP_REHEARSAL,'enabled-local-test-only');
 assert.equal(Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS),false);
 assert.equal(catalog.total,2250);
 const admin=adminApp({projectId:PROJECT},'v100a-admin-local');
 const client=clientApp({
  apiKey:'v100a-demo-key-not-prod',projectId:PROJECT,
  authDomain:PROJECT+'.firebaseapp.com'
 },'v100a-client-local');
 const listeners=[];
 try{
  const firestore=getFirestore(admin);
  const auth=adminAuthFor(admin);
  const browserAuth=getAuth(client);
  connectAuthEmulator(browserAuth,'http://'+AUTH_HOST,{disableWarnings:true});
  const users={};
  for(const [type,verified,claims] of [
   ['owner',true,{admin:true}],
   ['other',true,{admin:true}],
   ['student',true,{}],
   ['teacher',true,{role:'teacher'}],
   ['unverified',false,{admin:true}]
  ]){
   const email='v100a-'+type+'@example.test';
   const account=await auth.createUser({
    email,password:PASSWORD,emailVerified:verified
   });
   if(Object.keys(claims).length)
    await auth.setCustomUserClaims(account.uid,claims);
   const signed=await signInWithEmailAndPassword(browserAuth,email,PASSWORD);
   users[type]={uid:account.uid,token:await signed.user.getIdToken(true)};
  }
  const source=await catalog.lookup(catalog.ids()[0]);
  assert.ok(source&&Number.isInteger(source.unit)&&source.bankVersion);
  const reportId='mr_'+String(2).padStart(48,'0');
  const extraId='mr_'+String(3).padStart(48,'0');
  for(const [id,index] of [[reportId,0],[extraId,1]]){
   await firestore.collection(REPORTS).doc(id).set({
    schemaVersion:1,kind:'grade11-mcq-review',
    grade:11,origin:'practice-engine',
    unit:source.unit,questionId:source.id,
    sourceQuestionNumber:source.sourceQuestionNumber,
    bankVersion:source.bankVersion,displayedBankVersion:source.bankVersion,
    category:'unclear-wording',note:'Synthetic question note '+index,
    status:index?'in-review':'new',
    createdAtIso:new Date(Date.parse('2026-11-22T17:00:00Z')+index*60000).toISOString(),
    ownerUid:'hidden-student-'+index,email:'synthetic-private-email@example.test',
    correctOptionId:'NEVER_LEAK_PRIVATE',score:100
   });
  }
  const opts={
   firestore,adminAuth:auth,allowedAdminUids:[users.owner.uid]
  };
  const defaultOff=await startLocalAdminReviewHttpRehearsal(opts);
  listeners.push(defaultOff);
  assert.match(defaultOff.url,/^http:\/\/127\.0\.0\.1:\d+\/__local\/grade11\/admin\/reviews$/);
  const off=await sent(defaultOff.url,{headers:authHeader(users.owner.token)});
  denial(off,'temporarily-unavailable',503);
  assert.equal((await firestore.collection(REPORTS).get()).size,2);
  pass('server binds loopback ephemeral URL, private administrator GET is OFF by default');

  let enabled=true;
  const on=await startLocalAdminReviewHttpRehearsal({
   ...opts,isReviewReaderEnabled:()=>enabled
  });
  listeners.push(on);
  const url=on.url;
  const owner=await sent(url,{headers:authHeader(users.owner.token)});
  assert.equal(owner.status,200);
  assert.equal(owner.body.ok,true);
  assert.equal(owner.body.count,2);
  assert.equal(owner.body.reports.length,2);
  assert.equal(owner.body.reports[0].status,'in-review');
  assert.deepEqual(Object.keys(owner.body.reports[0]),[
   'reportId','unit','questionId','sourceQuestionNumber',
   'bankVersion','category','note','status','createdAtIso'
  ]);
  for(const blocked of ['ownerUid','email','correctOptionId','score',
   'displayedBankVersion','password','private_key','admin']){
   assert.equal(owner.body.reports[0][blocked],undefined);
  }
  assert.equal(owner.headers['cache-control'],'no-store, max-age=0');
  assert.equal(owner.headers['x-content-type-options'],'nosniff');
  assert.equal(owner.headers['referrer-policy'],'no-referrer');
  assert.equal(owner.headers['access-control-allow-origin'],undefined);
  assert.equal(owner.headers['content-type'],'application/json; charset=utf-8');
  assert.ok(!owner.raw.includes('synthetic-private-email'));
  assert.ok(!owner.raw.includes('NEVER_LEAK_PRIVATE'));
  assert.ok(!owner.raw.includes(users.owner.token));
  pass('genuine signed-in admin HTTP GET returns exactly two bounded, sanitized synthetic reports with no CORS/cache/private fields');

  for(const [u,code,status] of [
   ['student','admin-access-required',403],
   ['teacher','admin-access-required',403],
   ['other','admin-access-required',403],
   ['unverified','verified-email-required',403]
  ]){
   denial(await sent(url,{headers:authHeader(users[u].token)}),code,status);
  }
  denial(await sent(url,{headers:{Authorization:'Bearer invalid'}}),
   'authentication-required',401);
  denial(await sent(url),'invalid-request',400);
  pass('browser/student/teacher/non-allowlisted admin, unverified email and invalid tokens cannot read private reports');

  for(const test of [
   {url:url+'?limit=200',headers:authHeader(users.owner.token)},
   {url:on.origin+'/__local/grade11/admin/other',headers:authHeader(users.owner.token)},
   {url,method:'POST',headers:authHeader(users.owner.token)},
   {url,method:'OPTIONS',headers:authHeader(users.owner.token)}
  ]){
   const outcome=await sent(test.url,{headers:test.headers,method:test.method});
   assert.equal(outcome.body.ok,false);
   assert.ok([400,405].includes(outcome.status));
  }
  for(const extraHeaders of [
   {Origin:'https://malicious.example'},
   {Referer:'https://malicious.example/page'},
   {Cookie:'session=untrusted'},
   {'X-Forwarded-For':'127.0.0.1'},
   {Forwarded:'for=127.0.0.1'},
   {'X-Forwarded-Host':'other.example'},
   {'Content-Length':'0'}
  ]){
   denial(await sent(url,{headers:{
    ...authHeader(users.owner.token),...extraHeaders
   }}),'invalid-request',400);
  }
  denial(await sent(url,{headers:{
   ...authHeader(users.owner.token),Host:'localhost:9000'
  }}),'invalid-request',400);
  pass('wrong URL/query/method, foreign Origin/Referer, cookies, forwarding, bodies and wrong Host cannot access private queue');

  await auth.setCustomUserClaims(users.owner.uid,{role:'teacher'});
  assert.equal((await auth.verifyIdToken(users.owner.token,true)).admin,true,
   'test must retain stale pre-revocation admin JWT claim');
  denial(await sent(url,{headers:authHeader(users.owner.token)}),
   'admin-access-required',403);
  await auth.setCustomUserClaims(users.owner.uid,{admin:true});
  await auth.updateUser(users.owner.uid,{emailVerified:false});
  denial(await sent(url,{headers:authHeader(users.owner.token)}),
   'verified-email-required',403);
  await auth.updateUser(users.owner.uid,{emailVerified:true,disabled:true});
  const disabled=await sent(url,{headers:authHeader(users.owner.token)});
  assert.equal(disabled.body.ok,false);
  assert.ok([401,503].includes(disabled.status));
  pass('fresh backend account validation denies stale JWT after role revocation, email unverification and disabled account');

  await auth.updateUser(users.owner.uid,{disabled:false});
  enabled=false;
  denial(await sent(url,{headers:authHeader(users.owner.token)}),
   'temporarily-unavailable',503);
  enabled=undefined;
  denial(await sent(url,{headers:authHeader(users.owner.token)}),
   'temporarily-unavailable',503);
  enabled=true;
  const restored=await sent(url,{headers:authHeader(users.owner.token)});
  assert.equal(restored.status,200);
  assert.equal(restored.body.count,2);
  assert.equal((await firestore.collection(REPORTS).get()).size,2);
  assert.equal((await firestore.collection(RATES).get()).size,0);
  pass('trusted emergency OFF/unknown fail closed and explicit restoration allows safe read without report/quota mutation');

  let errorMessage='';
  const original=process.env.PSN_LOCAL_ADMIN_HTTP_REHEARSAL;
  try{
   delete process.env.PSN_LOCAL_ADMIN_HTTP_REHEARSAL;
   await assert.rejects(
    ()=>startLocalAdminReviewHttpRehearsal({
     ...opts,isReviewReaderEnabled:()=>true
    }),
    /only permits explicit credential-free local emulator testing/
   );
   process.env.PSN_LOCAL_ADMIN_HTTP_REHEARSAL=original;
   const prev=process.env.GCLOUD_PROJECT;
   try{
    process.env.GCLOUD_PROJECT='real-firebase-project';
    await assert.rejects(
     ()=>startLocalAdminReviewHttpRehearsal(opts),
     /only permits explicit credential-free local emulator testing/
    );
   }finally{process.env.GCLOUD_PROJECT=prev;}
  }finally{process.env.PSN_LOCAL_ADMIN_HTTP_REHEARSAL=original;}
  assert.equal(errorMessage,'');
  pass('listener startup explicitly rejects absent local flag or production project and cannot be deployed accidentally');

  fs.mkdirSync(OUT,{recursive:true});
  fs.writeFileSync(path.join(OUT,'summary.json'),JSON.stringify({
   version:'V100-A',
   environment:'LOCAL loopback HTTP + real Auth/Firestore Emulators',
   syntheticReports:2,sourceReferences:2250,
   defaultOff:true,localPeerOnly:true,publicHttpEndpointDeployed:false,
   successfulSanitizedAdminGet:true,
   unauthorizedReadDenied:true,staleAdminJwtDenied:true,
   currentEmailAndDisabledDenials:true,
   noCORS:true,noCache:true,unknownOffSwitchDenied:true,
   studentSendEnabled:false,productionFirebaseRead:false,
   positiveRealProviderAppCheckProof:false,domainMigration:false,
   tests:cases
  },null,2)+'\n');
  console.log('V100-A FINISHED: '+cases.length+' groups passed; LOCAL HTTP only, zero production access.');
  await signOut(browserAuth);
 }finally{
  for(const server of listeners.reverse())await server.close();
  await deleteClientApp(client);
  await deleteAdminApp(admin);
 }
}
main().catch(()=>{
 console.error('V100-A FAILED: local admin HTTP regression assertion failed (details intentionally redacted).');
 process.exitCode=1;
});
