#!/usr/bin/env node
'use strict';
/**
 * V100-C authentic local Auth + Firestore Emulator / HTTP POST integration.
 * One-time synthetic users and reports only. No live Firebase, deployment,
 * App Check provider, domains or student reporting changes.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {initializeApp:adminApp,deleteApp:deleteAdminApp}=
 require('firebase-admin/app');
const {getAuth:serverAuthFor}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const {initializeApp:clientApp,deleteApp:deleteClientApp}=
 require('firebase/app');
const {getAuth,connectAuthEmulator,signInWithEmailAndPassword,signOut}=
 require('firebase/auth');
const {PROJECT,HOST:FS_HOST,REPORTS,RATES}=
 require('../server/firebase-review-emulator-v99f.cjs');
const {AUDIT}=require('../server/local-admin-review-transitions-v99q.cjs');
const {startLocalAdminTriageHttpRehearsal,MAX_BODY_BYTES}=
 require('../server/local-http-admin-triage-v100c.cjs');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');

const AUTH_HOST='127.0.0.1:9099';
const PASSWORD='V100C-SYNTHETIC-ONLY-12345678!';
const ID='mr_'+String(31).padStart(48,'0');
const SECOND='mr_'+String(32).padStart(48,'0');
const MISSING='mr_'+String(33).padStart(48,'0');
const OUT=path.resolve(__dirname,'../qa-artifacts/local-admin-triage-v100c');
const cases=[];
function pass(name){cases.push(name);console.log('V100-C PASS:',name);}
function send(url,{
 method='POST',headers={},payload,raw
}={}){
 const body=raw===undefined?
  (payload===undefined?JSON.stringify({action:'start-review'}):
   JSON.stringify(payload)):raw;
 const bytes=Buffer.byteLength(body);
 const h={...headers};
 if(method==='POST'&&!Object.keys(h).some(k=>k.toLowerCase()==='content-type'))
  h['Content-Type']='application/json';
 if(method==='POST'&&!Object.keys(h).some(k=>k.toLowerCase()==='content-length'))
  h['Content-Length']=String(bytes);
 return new Promise((resolve,reject)=>{
  const req=http.request(url,{method,headers:h,timeout:5000,agent:false},res=>{
   let rawText='';
   res.on('data',chunk=>{
    rawText+=chunk.toString('utf8');
    if(rawText.length>6000)req.destroy(Error('oversized private response'));
   });
   res.on('end',()=>{
    try{resolve({
     status:res.statusCode,headers:res.headers,
     body:JSON.parse(rawText),raw:rawText
    });}catch{reject(Error('invalid JSON response'));}
   });
  });
  req.on('timeout',()=>req.destroy(Error('local-only timeout')));
  req.on('error',reject);
  if(method==='POST')req.write(body);
  req.end();
 });
}
function bearer(token){return {Authorization:'Bearer '+token};}
function deny(response,code,status){
 assert.equal(response.status,status);
 assert.deepEqual(response.body,{ok:false,code});
 assert.equal(response.headers['access-control-allow-origin'],undefined);
 assert.equal(response.headers['cache-control'],'no-store, max-age=0');
 assert.ok(!response.raw.includes('PRIVATE_STUDENT'));
 assert.ok(!response.raw.includes('NEVER_EXPOSE'));
}
function data(q){
 return {
  schemaVersion:1,kind:'grade11-mcq-review',grade:11,
  origin:'practice-engine',unit:q.unit,questionId:q.id,
  sourceQuestionNumber:q.sourceQuestionNumber,bankVersion:q.bankVersion,
  displayedBankVersion:q.bankVersion,
  category:'incorrect-key',note:'PRIVATE_STUDENT_NOTE',
  ownerUid:'synthetic-owner',email:'PRIVATE_STUDENT@example.test',
  correctOptionId:'NEVER_EXPOSE',score:999,
  status:'new',createdAtIso:'2026-11-22T16:00:00.000Z'
 };
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
 assert.equal(process.env.PSN_LOCAL_ADMIN_TRIAGE_HTTP,'enabled-local-test-only');
 assert.equal(Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS),false);
 assert.equal(catalog.total,2250);
 assert.equal(MAX_BODY_BYTES,80);
 const app=adminApp({projectId:PROJECT},'v100c-local-server');
 const client=clientApp({
  apiKey:'v100c-demo-only',projectId:PROJECT,
  authDomain:PROJECT+'.firebaseapp.com'
 },'v100c-local-client');
 const listeners=[];
 try{
  const db=getFirestore(app),auth=serverAuthFor(app);
  const clientAuth=getAuth(client);
  connectAuthEmulator(clientAuth,'http://'+AUTH_HOST,{disableWarnings:true});
  const users={};
  for(const [name,verified,claims] of [
   ['owner',true,{admin:true}],
   ['otherAdmin',true,{admin:true}],
   ['teacher',true,{role:'teacher'}],
   ['student',true,{}],
   ['unverified',false,{admin:true}]
  ]){
   const email='v100c-'+name.toLowerCase()+'@example.test';
   const record=await auth.createUser({
    email,password:PASSWORD,emailVerified:verified
   });
   if(Object.keys(claims).length)
    await auth.setCustomUserClaims(record.uid,claims);
   const signed=await signInWithEmailAndPassword(clientAuth,email,PASSWORD);
   users[name]={uid:record.uid,token:await signed.user.getIdToken(true)};
  }
  const q=await catalog.lookup(catalog.ids()[0]);
  assert.ok(q&&q.publicPractice);
  await db.collection(REPORTS).doc(ID).set(data(q));
  await db.collection(REPORTS).doc(SECOND).set(data(q));
  const options={
   firestore:db,adminAuth:auth,allowedAdminUids:[users.owner.uid]
  };

  const off=await startLocalAdminTriageHttpRehearsal(options);
  listeners.push(off);
  assert.match(off.origin,/^http:\/\/127\.0\.0\.1:\d+$/);
  assert.match(off.urlFor(ID),/^http:\/\/127\.0\.0\.1:\d+\/__local\/grade11\/admin\/reviews\/mr_[a-f0-9]{48}\/transition$/);
  deny(await send(off.urlFor(ID),{headers:bearer(users.owner.token)}),
   'temporarily-unavailable',503);
  assert.equal((await db.collection(AUDIT).get()).size,0);
  assert.equal((await db.collection(REPORTS).doc(ID).get()).data().status,'new');
  pass('local POST route defaults OFF and produces no report or audit mutation');

  let enabled=true;
  const clock={ms:Date.parse('2026-11-22T18:00:00.000Z')};
  const on=await startLocalAdminTriageHttpRehearsal({
   ...options,isTriageEnabled:()=>enabled,now:()=>clock.ms
  });
  listeners.push(on);
  const url=on.urlFor(ID);
  const started=await send(url,{headers:bearer(users.owner.token)});
  assert.equal(started.status,200);
  assert.deepEqual(started.body,{
   ok:true,reportId:ID,status:'in-review',alreadyApplied:false
  });
  assert.equal(started.headers['cache-control'],'no-store, max-age=0');
  assert.equal(started.headers['content-type'],'application/json; charset=utf-8');
  assert.equal(started.headers['access-control-allow-origin'],undefined);
  assert.ok(!started.raw.includes('PRIVATE_STUDENT'));
  assert.ok(!started.raw.includes('NEVER_EXPOSE'));
  assert.ok(!started.raw.includes(users.owner.uid));
  assert.ok(!started.raw.includes(users.owner.token));
  assert.equal((await db.collection(REPORTS).doc(ID).get()).data().status,'in-review');
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('verified synthetic local admin POST commits an audited new-to-in-review transition with redacted receipt');

  const repeated=await send(url,{headers:bearer(users.owner.token)});
  assert.deepEqual(repeated.body,{
   ok:true,reportId:ID,status:'in-review',alreadyApplied:true
  });
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('duplicate start-review HTTP request is idempotent, no duplicate audit writes');

  for(const [who,code,status] of [
   ['student','admin-access-required',403],
   ['teacher','admin-access-required',403],
   ['otherAdmin','admin-access-required',403],
   ['unverified','verified-email-required',403]
  ]){
   deny(await send(url,{headers:bearer(users[who].token),
    payload:{action:'resolve'}}),code,status);
  }
  deny(await send(url,{headers:{Authorization:'Bearer forged'},
   payload:{action:'resolve'}}),'authentication-required',401);
  deny(await send(url,{payload:{action:'resolve'}}),'invalid-request',400);
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('students, teachers, unlisted administrators, unverified accounts and forged or missing tokens cannot write');

  for(const input of [
   {action:'resolved'},
   {action:'start-review',admin:true},
   {action:'resolve',reviewerUid:users.owner.uid},
   {action:1},['resolve'],{},null
  ]){
   deny(await send(url,{headers:bearer(users.owner.token),payload:input}),
    'invalid-request',400);
  }
  deny(await send(url,{headers:bearer(users.owner.token),raw:'{bad-json'}),
   'invalid-request',400);
  deny(await send(url,{headers:bearer(users.owner.token),
   raw:' '.repeat(81)}),'invalid-request',400);
  deny(await send(on.urlFor(SECOND),{headers:bearer(users.owner.token),
   payload:{action:'resolve'}}),'invalid-transition',409);
  deny(await send(on.urlFor(MISSING),{headers:bearer(users.owner.token)}),
   'not-found',404);
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('invalid action, extra client role fields, invalid JSON, oversized body, missing report and illegal transition are rejected');

  for(const {url:badUrl,method,headers} of [
   {url:url+'?debug=1'},
   {url:on.origin+'/__local/grade11/admin/reviews/'+ID+'/history'},
   {url:url.replace(ID,'../../private')},
   {url,method:'GET'},
   {url,method:'PUT'},
   {url,method:'OPTIONS'},
   {url,headers:{Origin:'https://untrusted.example'}},
   {url,headers:{Referer:'https://untrusted.example/path'}},
   {url,headers:{Cookie:'session=forged'}},
   {url,headers:{'X-Forwarded-For':'127.0.0.1'}},
   {url,headers:{Forwarded:'for=127.0.0.1'}},
   {url,headers:{Host:'localhost:9999'}},
   {url,headers:{'Content-Type':'text/plain'}}
  ]){
   const outcome=await send(badUrl||url,{
    method:method||'POST',headers:{...bearer(users.owner.token),...headers},
    payload:{action:'resolve'}
   });
   assert.equal(outcome.body.ok,false);
   assert.ok([400,405].includes(outcome.status));
  }
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('unsafe URL, method, hostile Origin/Referer, cookies, proxy/Host and content type cannot update the queue');

  await auth.setCustomUserClaims(users.owner.uid,{role:'teacher'});
  assert.equal((await auth.verifyIdToken(users.owner.token,true)).admin,true);
  deny(await send(url,{headers:bearer(users.owner.token),
   payload:{action:'resolve'}}),'admin-access-required',403);
  await auth.setCustomUserClaims(users.owner.uid,{admin:true});
  await auth.updateUser(users.owner.uid,{emailVerified:false});
  deny(await send(url,{headers:bearer(users.owner.token),
   payload:{action:'resolve'}}),'verified-email-required',403);
  await auth.updateUser(users.owner.uid,{emailVerified:true,disabled:true});
  const disabled=await send(url,{headers:bearer(users.owner.token),
   payload:{action:'resolve'}});
  assert.equal(disabled.body.ok,false);
  assert.ok([401,503].includes(disabled.status));
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('old emulator admin JWT cannot bypass revoked current role, removed email verification or disabled user');

  await auth.updateUser(users.owner.uid,{disabled:false});
  enabled=false;
  deny(await send(url,{headers:bearer(users.owner.token),
   payload:{action:'resolve'}}),'temporarily-unavailable',503);
  enabled=undefined;
  deny(await send(url,{headers:bearer(users.owner.token),
   payload:{action:'resolve'}}),'temporarily-unavailable',503);
  enabled=true;
  clock.ms+=60000;
  const renewed=await signInWithEmailAndPassword(
   clientAuth,'v100c-owner@example.test',PASSWORD
  );
  const token=await renewed.user.getIdToken(true);
  const resolved=await send(url,{headers:bearer(token),
   payload:{action:'resolve'}});
  assert.equal(resolved.status,200);
  assert.deepEqual(resolved.body,{
   ok:true,reportId:ID,status:'resolved',alreadyApplied:false
  });
  assert.equal((await db.collection(AUDIT).get()).size,2);
  assert.equal((await db.collection(REPORTS).doc(ID).get()).data().status,'resolved');
  const finalRetry=await send(url,{headers:bearer(token),payload:{action:'resolve'}});
  assert.equal(finalRetry.body.alreadyApplied,true);
  assert.equal((await db.collection(AUDIT).get()).size,2);
  assert.equal((await db.collection(RATES).get()).size,0);
  assert.equal((await db.collection(REPORTS).get()).size,2);
  pass('emergency OFF and unknown deny; restored authorization completes resolved transition with exactly two audit events');

  const originalFlag=process.env.PSN_LOCAL_ADMIN_TRIAGE_HTTP;
  const originalProject=process.env.GCLOUD_PROJECT;
  try{
   delete process.env.PSN_LOCAL_ADMIN_TRIAGE_HTTP;
   await assert.rejects(
    ()=>startLocalAdminTriageHttpRehearsal(options),
    /explicit credential-free local emulators/);
   process.env.PSN_LOCAL_ADMIN_TRIAGE_HTTP=originalFlag;
   process.env.GCLOUD_PROJECT='live-firebase-project';
   await assert.rejects(
    ()=>startLocalAdminTriageHttpRehearsal(options),
    /explicit credential-free local emulators/);
  }finally{
   process.env.GCLOUD_PROJECT=originalProject;
   process.env.PSN_LOCAL_ADMIN_TRIAGE_HTTP=originalFlag;
  }
  pass('local endpoint startup refuses missing deliberate local flag and non-demo production project');

  fs.mkdirSync(OUT,{recursive:true});
  fs.writeFileSync(path.join(OUT,'summary.json'),JSON.stringify({
   version:'V100-C',scope:'127.0.0.1 synthetic HTTP POST + actual local Auth/Firestore emulators',
   originalPinnedPublicMcqRefs:2250,syntheticReports:2,
   defaultOff:true,realEmulatorSignedJwt:true,
   atomicReportAuditStatuses:true,zeroExternalEndpoints:true,
   studentSendRemainsCopyOnly:true,liveFirebaseTouched:false,
   genuineProductionAppCheckProof:false,customDomainMigration:false,
   passedCaseLabels:cases
  },null,2)+'\n');
  console.log('V100-C FINISHED: '+cases.length+
   ' groups passed; real LOCAL Auth/Firestore, no public deployment.');
  await signOut(clientAuth);
 }finally{
  for(const listener of listeners.reverse())await listener.close();
  await deleteClientApp(client);
  await deleteAdminApp(app);
 }
}
main().catch(()=>{
 console.error('V100-C FAILED: local admin HTTP transition safety regression.');
 process.exitCode=1;
});
