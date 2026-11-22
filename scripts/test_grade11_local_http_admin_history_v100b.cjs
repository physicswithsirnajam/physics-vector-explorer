#!/usr/bin/env node
'use strict';
/**
 * V100-B: REAL local loopback HTTP GET + Firebase Auth/Firestore EMULATORS.
 * All administrator identities, reports and audit records are synthetic.
 * There is no live Firebase, App Check registration, student Send, DNS or deploy.
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
const {AUDIT,createLocalAdminReviewTransitions}=
 require('../server/local-admin-review-transitions-v99q.cjs');
const {startLocalAdminHistoryHttpRehearsal}=
 require('../server/local-http-admin-history-v100b.cjs');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');
const AUTH_HOST='127.0.0.1:9099';
const PASSWORD='V100B-SYNTHETIC-ONLY-12345678!';
const REPORT_ID='mr_'+String(5).padStart(48,'0');
const MISSING_ID='mr_'+String(6).padStart(48,'0');
const OUT=path.resolve(__dirname,'../qa-artifacts/local-admin-history-v100b');
const cases=[];
function pass(message){cases.push(message);console.log('V100-B PASS:',message);}
function request(url,{method='GET',headers={},body}={}){
 return new Promise((resolve,reject)=>{
  const req=http.request(url,{method,headers,agent:false,timeout:4500},res=>{
   let raw='';
   res.on('data',chunk=>{
    raw+=chunk.toString('utf8');
    if(raw.length>10000)req.destroy(Error('Unexpected oversized response'));
   });
   res.on('end',()=>{
    try{resolve({
     status:res.statusCode,headers:res.headers,raw,body:JSON.parse(raw)
    });}catch{reject(Error('Invalid JSON response'));}
   });
  });
  req.on('timeout',()=>req.destroy(Error('Loopback rehearsal timeout')));
  req.on('error',reject);
  if(body!==undefined)req.write(body);
  req.end();
 });
}
function authorization(token){return {Authorization:'Bearer '+token};}
function deny(response,code,status){
 assert.equal(response.status,status);
 assert.deepEqual(response.body,{ok:false,code});
 assert.equal(response.headers['access-control-allow-origin'],undefined);
 assert.equal(response.headers['cache-control'],'no-store, max-age=0');
 assert.ok(!response.raw.includes('PRIVATE_STUDENT'));
 assert.ok(!response.raw.includes('PRIVATE_CORRECT_ANSWER'));
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
 assert.equal(process.env.PSN_LOCAL_ADMIN_HISTORY_HTTP,'enabled-local-test-only');
 assert.equal(Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS),false);
 assert.equal(catalog.total,2250);
 const admin=adminApp({projectId:PROJECT},'v100b-local-admin');
 const client=clientApp({
  apiKey:'v100b-demo-only',projectId:PROJECT,
  authDomain:PROJECT+'.firebaseapp.com'
 },'v100b-local-browser');
 const listeners=[];
 try{
  const db=getFirestore(admin),adminAuth=adminAuthFor(admin);
  const browserAuth=getAuth(client);
  connectAuthEmulator(browserAuth,'http://'+AUTH_HOST,{disableWarnings:true});
  const users={};
  for(const [role,emailVerified,claims] of [
   ['owner',true,{admin:true}],['other',true,{admin:true}],
   ['student',true,{}],['teacher',true,{role:'teacher'}],
   ['unverified',false,{admin:true}]
  ]){
   const email='v100b-'+role+'@example.test';
   const created=await adminAuth.createUser({
    email,password:PASSWORD,emailVerified
   });
   if(Object.keys(claims).length)
    await adminAuth.setCustomUserClaims(created.uid,claims);
   const signed=await signInWithEmailAndPassword(browserAuth,email,PASSWORD);
   users[role]={uid:created.uid,token:await signed.user.getIdToken(true)};
  }
  const q=await catalog.lookup(catalog.ids()[0]);
  assert.ok(q&&q.publicPractice);
  await db.collection(REPORTS).doc(REPORT_ID).set({
   schemaVersion:1,kind:'grade11-mcq-review',origin:'practice-engine',
   grade:11,unit:q.unit,questionId:q.id,
   sourceQuestionNumber:q.sourceQuestionNumber,
   bankVersion:q.bankVersion,displayedBankVersion:q.bankVersion,
   category:'incorrect-key',note:'PRIVATE_STUDENT_NOTE',
   ownerUid:'synthetic-owner',email:'PRIVATE_STUDENT@example.test',
   correctOptionId:'PRIVATE_CORRECT_ANSWER',score:777,
   status:'new',createdAtIso:'2026-11-22T17:00:00.000Z'
  });
  const base={
   firestore:db,adminAuth,
   allowedAdminUids:[users.owner.uid]
  };
  const off=await startLocalAdminHistoryHttpRehearsal(base);
  listeners.push(off);
  assert.match(off.origin,/^http:\/\/127\.0\.0\.1:\d+$/);
  assert.match(off.urlFor(REPORT_ID),/^http:\/\/127\.0\.0\.1:\d+\/__local\/grade11\/admin\/reviews\/mr_[a-f0-9]{48}\/history$/);
  deny(await request(off.urlFor(REPORT_ID),{
   headers:authorization(users.owner.token)
  }),'temporarily-unavailable',503);
  assert.equal((await db.collection(AUDIT).get()).size,0);
  pass('explicit localhost-only audit HTTP listener starts OFF and exposes no private history');

  let enabled=true;
  const on=await startLocalAdminHistoryHttpRehearsal({
   ...base,isHistoryEnabled:()=>enabled
  });
  listeners.push(on);
  const url=on.urlFor(REPORT_ID);
  const fresh=await request(url,{headers:authorization(users.owner.token)});
  assert.equal(fresh.status,200);
  assert.deepEqual(fresh.body,{
   ok:true,reportId:REPORT_ID,questionId:q.id,status:'new',events:[]
  });
  assert.equal(fresh.headers['content-type'],'application/json; charset=utf-8');
  assert.equal(fresh.headers['x-content-type-options'],'nosniff');
  assert.equal(fresh.headers['referrer-policy'],'no-referrer');
  assert.equal(fresh.headers['access-control-allow-origin'],undefined);
  assert.ok(!fresh.raw.includes(users.owner.uid));
  assert.ok(!fresh.raw.includes('PRIVATE_STUDENT'));
  pass('genuine emulator signed owner GET sees exact four-field new-report empty history, never student note/UID/answers');

  const clock={millis:Date.parse('2026-11-22T18:00:00.000Z')};
  const transition=createLocalAdminReviewTransitions({
   ...base,isTriageEnabled:()=>true,now:()=>clock.millis
  });
  const invokeTransition=action=>transition({
   authorization:'Bearer '+users.owner.token,reportId:REPORT_ID,action
  });
  const started=await invokeTransition('start-review');
  assert.equal(started.ok,true);
  const inReview=await request(url,{headers:authorization(users.owner.token)});
  assert.equal(inReview.status,200);
  assert.deepEqual(inReview.body,{
   ok:true,reportId:REPORT_ID,questionId:q.id,status:'in-review',
   events:[{
    action:'start-review',fromStatus:'new',toStatus:'in-review',
    reviewedAtIso:'2026-11-22T18:00:00.000Z'
   }]
  });
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('one real local Firestore triage action becomes exactly one audited HTTP event without reviewer UID');

  clock.millis+=60000;
  assert.equal((await invokeTransition('resolve')).ok,true);
  const resolved=await request(url,{headers:authorization(users.owner.token)});
  assert.equal(resolved.status,200);
  assert.deepEqual(resolved.body,{
   ok:true,reportId:REPORT_ID,questionId:q.id,status:'resolved',
   events:[
    {action:'start-review',fromStatus:'new',toStatus:'in-review',
     reviewedAtIso:'2026-11-22T18:00:00.000Z'},
    {action:'resolve',fromStatus:'in-review',toStatus:'resolved',
     reviewedAtIso:'2026-11-22T18:01:00.000Z'}
   ]
  });
  const repeat=await invokeTransition('resolve');
  assert.equal(repeat.ok,true);
  assert.equal(repeat.alreadyApplied,true);
  assert.deepEqual((await request(url,{
   headers:authorization(users.owner.token)
  })).body,resolved.body);
  assert.equal((await db.collection(AUDIT).get()).size,2);
  pass('resolved HTTP history has two ordered, validated events; duplicate status action does not duplicate audit');

  for(const [role,code,status] of [
   ['student','admin-access-required',403],
   ['teacher','admin-access-required',403],
   ['other','admin-access-required',403],
   ['unverified','verified-email-required',403]
  ]){
   deny(await request(url,{
    headers:authorization(users[role].token)
   }),code,status);
  }
  deny(await request(url,{headers:{Authorization:'Bearer invalid'}}),
   'authentication-required',401);
  deny(await request(url),'invalid-request',400);
  deny(await request(on.urlFor(MISSING_ID),{
   headers:authorization(users.owner.token)
  }),'not-found',404);
  pass('students, teachers, nonallowlisted admins, unverified email, forged token, missing auth and nonexistent report denied');

  for(const [target,method] of [
   [url+'?limit=1000','GET'],
   [url.replace(/\/history$/,'/history/other'),'GET'],
   [url.replace(REPORT_ID,'../../private'),'GET'],
   [url,'POST'],[url,'OPTIONS']
  ]){
   const attempt=await request(target,{
    method,headers:authorization(users.owner.token)
   });
   assert.equal(attempt.body.ok,false);
   assert.ok([400,405].includes(attempt.status));
  }
  for(const extra of [
   {Origin:'https://untrusted.example'},
   {Referer:'https://untrusted.example/private'},
   {Cookie:'session=forged'},
   {'X-Forwarded-For':'127.0.0.1'},
   {Forwarded:'for=127.0.0.1'},
   {'Content-Length':'0'}
  ]){
   deny(await request(url,{
    headers:{...authorization(users.owner.token),...extra}
   }),'invalid-request',400);
  }
  deny(await request(url,{headers:{
   ...authorization(users.owner.token),Host:'localhost:9999'
  }}),'invalid-request',400);
  pass('wrong path/query/method, browser Origin/Referer, cookies, forwarded headers, GET body indicator and wrong Host denied');

  const auditSnapshots=await db.collection(AUDIT).get();
  const first=auditSnapshots.docs.find(doc=>doc.data().action==='start-review');
  assert.ok(first);
  const original=first.data();
  await first.ref.update({action:'forged'});
  deny(await request(url,{headers:authorization(users.owner.token)}),
   'temporarily-unavailable',503);
  await first.ref.set(original);
  assert.deepEqual((await request(url,{
   headers:authorization(users.owner.token)
  })).body,resolved.body);
  pass('corrupt private audit record fails closed; original validated history remains consistent after restoration');

  await adminAuth.setCustomUserClaims(users.owner.uid,{role:'teacher'});
  assert.equal((await adminAuth.verifyIdToken(users.owner.token,true)).admin,
   true,'old genuine JWT should retain stale admin=true claim');
  deny(await request(url,{headers:authorization(users.owner.token)}),
   'admin-access-required',403);
  await adminAuth.setCustomUserClaims(users.owner.uid,{admin:true});
  await adminAuth.updateUser(users.owner.uid,{emailVerified:false});
  deny(await request(url,{headers:authorization(users.owner.token)}),
   'verified-email-required',403);
  await adminAuth.updateUser(users.owner.uid,{emailVerified:true,disabled:true});
  const disabled=await request(url,{headers:authorization(users.owner.token)});
  assert.equal(disabled.body.ok,false);
  assert.ok([401,503].includes(disabled.status));
  pass('stale Admin JWT cannot bypass fresh role, removed email verification or disabled account over HTTP');

  enabled=false;
  deny(await request(url,{headers:authorization(users.owner.token)}),
   'temporarily-unavailable',503);
  enabled=undefined;
  deny(await request(url,{headers:authorization(users.owner.token)}),
   'temporarily-unavailable',503);
  await adminAuth.updateUser(users.owner.uid,{disabled:false});
  enabled=true;
  const signed=await signInWithEmailAndPassword(
   browserAuth,'v100b-owner@example.test',PASSWORD
  );
  const refreshed=await signed.user.getIdToken(true);
  const recovery=await request(url,{headers:authorization(refreshed)});
  assert.equal(recovery.status,200);
  assert.deepEqual(recovery.body,resolved.body);
  assert.equal((await db.collection(REPORTS).get()).size,1);
  assert.equal((await db.collection(AUDIT).get()).size,2);
  assert.equal((await db.collection(RATES).get()).size,0);
  pass('trusted history switch OFF/unknown deny; recovery requires current authorized account; HTTP history itself never writes');

  const initialFlag=process.env.PSN_LOCAL_ADMIN_HISTORY_HTTP;
  const oldProject=process.env.GCLOUD_PROJECT;
  try{
   delete process.env.PSN_LOCAL_ADMIN_HISTORY_HTTP;
   await assert.rejects(()=>startLocalAdminHistoryHttpRehearsal(base),
    /explicit credential-free localhost emulators/);
   process.env.PSN_LOCAL_ADMIN_HISTORY_HTTP=initialFlag;
   process.env.GCLOUD_PROJECT='not-the-local-demo-project';
   await assert.rejects(()=>startLocalAdminHistoryHttpRehearsal(base),
    /explicit credential-free localhost emulators/);
  }finally{
   process.env.PSN_LOCAL_ADMIN_HISTORY_HTTP=initialFlag;
   process.env.GCLOUD_PROJECT=oldProject;
  }
  pass('listener refuses startup without explicit local-only opt-in or matching demo project');

  fs.mkdirSync(OUT,{recursive:true});
  fs.writeFileSync(path.join(OUT,'summary.json'),JSON.stringify({
   version:'V100-B',environment:'real LOCAL Node HTTP + Firebase Auth/Firestore emulators',
   originalApprovedPublicQuestionRefs:2250,syntheticReports:1,
   genuineEmulatorJwt:true,defaultOff:true,
   newInReviewResolvedEvents:2,realAuthAccountFreshnessRequired:true,
   securityAndPrivacyTestGroups:cases,
   reportAuditQuotaWritesFromHttpReader:0,
   productionFirebaseAccess:false,realAccountsUsed:false,
   deployedEndpoint:false,publicStudentSendEnabled:false,
   providerVerifiedProductionAppCheckToken:false,domainChanged:false
  },null,2)+'\n');
  console.log('V100-B FINISHED: '+cases.length+
   ' groups passed; genuine local HTTP and SDK audit; NO LIVE FIREBASE.');
  await signOut(browserAuth);
 }finally{
  for(const listener of listeners.reverse())await listener.close();
  await deleteClientApp(client);
  await deleteAdminApp(admin);
 }
}
main().catch(e=>{
 console.error('V100-B FAILED: a local-only safety or regression assertion failed.');
 process.exitCode=1;
});
