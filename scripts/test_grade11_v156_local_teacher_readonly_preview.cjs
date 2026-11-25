#!/usr/bin/env node
'use strict';
/* V156: genuine local Firebase Auth+Firestore emulators and ephemeral
 * loopback-only HTTP; all test accounts are synthetic. No live UI or keys.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {initializeApp:adminInit,deleteApp:adminDelete}=require('firebase-admin/app');
const {getAuth:adminAuthFor}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const {initializeApp:clientInit,deleteApp:clientDelete}=require('firebase/app');
const {getAuth:clientAuthFor,connectAuthEmulator,signInWithEmailAndPassword}=
 require('firebase/auth');
const {PROJECT}=require('../server/local-classroom-provisioner-v143.cjs');
const {createLocalTopic71TeacherReviewPilot}=require('../server/local-topic71-teacher-review-pilot-v155.cjs');
const {startLocalTopic71TeacherPreview,renderTeacherPreview,HOST,ROUTE}=
 require('../server/local-topic71-teacher-preview-v156.cjs');

const ROOT=path.resolve(__dirname,'..'),PASSWORD='V156-SYNTHETIC-LOCAL-REVIEW-ONLY_2026!';
const email=u=>u+'@example.test';
const counts={goodRead:0,rejected:0,revisionChecks:0,renderEncoding:0,revocations:0,
  readOnlyProofs:0};
const qa=path.join(ROOT,'qa-artifacts/grade11-v156-topic71-authenticated-readonly-preview/summary.json');
function request(url,{method='GET',headers={},body}={}){
 return new Promise((resolve,reject)=>{
  const req=http.request(url,{method,headers,agent:false,timeout:5500},res=>{
   const chunks=[];let size=0;
   res.on('data',p=>{size+=p.length;if(size>30000)req.destroy(Error('response too large'));else chunks.push(p);});
   res.on('end',()=>{
    const data=Buffer.concat(chunks).toString('utf8');
    let json=null;try{json=JSON.parse(data);}catch{}
    resolve({status:res.statusCode,headers:res.headers,text:data,json});
   });
  });
  req.on('timeout',()=>req.destroy(Error('request timeout')));
  req.on('error',reject);
  if(body!==undefined)req.write(body);
  req.end();
 });
}
function denied(r,code,status){
 assert.equal(r.status,status);
 assert.deepEqual(r.json,{ok:false,code});
 assert.equal(r.headers['cache-control'],'no-store, max-age=0');
 assert.equal(r.headers['access-control-allow-origin'],undefined);
 assert.equal(r.headers['set-cookie'],undefined);
 assert.equal(r.text.includes('Q76'),false);
 counts.rejected++;
}
function validPage(r){
 assert.equal(r.status,200);
 assert.equal(r.headers['content-type'],'text/html; charset=utf-8');
 assert.equal(r.headers['x-frame-options'],'DENY');
 assert.equal(r.headers['cache-control'],'no-store, max-age=0');
 assert.equal(r.headers['access-control-allow-origin'],undefined);
 assert.equal(r.headers['set-cookie'],undefined);
 assert.match(r.headers['content-security-policy'],/form-action 'none'/);
 assert.ok(r.text.includes('<title>Physics with Sir Najam'));
 assert.equal((r.text.match(/<article data-question-id=/g)||[]).length,4);
 for(const n of [10,15,62,76]){
  assert.ok(r.text.includes('Question '+n));
  assert.ok(r.text.includes('XI-U07-T071-Q'+String(n).padStart(3,'0')));
 }
 assert.ok(r.text.includes('Teacher review preview'));
 assert.ok(r.text.includes('NO ANSWER KEYS'));
 assert.ok(r.text.includes('HOLD — 0 published'));
 assert.ok(r.text.includes('Original owner explanation needs separate verified correction'));
 for(const sensitive of ['<script','correctOptionId','answerKey','sourceExplanationText',
  'PRIVATE_TEST_NAME','studentUid','firebaseApiKey','<form'])
  assert.ok(!r.text.includes(sensitive),'sensitive/interactive marker in preview: '+sensitive);
 counts.goodRead++;
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,'127.0.0.1:8089');
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,'127.0.0.1:9099');
 assert.equal(process.env.PSN_LOCAL_TOPIC71_TEACHER_PREVIEW,'enabled-local-test-only');
 assert.equal(!!process.env.GOOGLE_APPLICATION_CREDENTIALS,false);
 const original=fs.readFileSync(path.join(ROOT,'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv'),'utf8');
 const beforeManifest=fs.readFileSync(path.join(ROOT,'question-bank/manifest.json'),'utf8');
 const beforeCatalog=fs.readFileSync(path.join(ROOT,'portal/learning-catalog.json'),'utf8');
 const admin=adminInit({projectId:PROJECT},'v156-demo-admin');
 const clients=[];const listeners=[];
 try{
  const auth=adminAuthFor(admin),db=getFirestore(admin);
  const identities=[
   ['teacherOne',true,{teacher:true}],
   ['teacherTwo',true,{teacher:true}],
   ['studentA',true,{}],
   ['rootAdmin',true,{admin:true}],
   ['unverified',false,{teacher:true}]
  ];
  for(const [uid,verified,claims] of identities){
   await auth.createUser({uid,email:email(uid),emailVerified:verified,password:PASSWORD});
   if(Object.keys(claims).length)await auth.setCustomUserClaims(uid,claims);
  }
  for(const uid of ['teacherOne','teacherTwo','unverified'])
   await db.doc('teacherDirectory/'+uid).set({
    schemaVersion:1,teacherUid:uid,status:'active'
   });
  const tokens={};
  for(const [uid] of identities){
   const app=clientInit({projectId:PROJECT,authDomain:PROJECT+'.firebaseapp.com',
    apiKey:'v156-local-emulator-synthetic'},'v156-client-'+uid);
   clients.push(app);
   const clientAuth=clientAuthFor(app);
   connectAuthEmulator(clientAuth,'http://127.0.0.1:9099',{disableWarnings:true});
   const session=await signInWithEmailAndPassword(clientAuth,email(uid),PASSWORD);
   tokens[uid]=await session.user.getIdToken(true);
  }
  const allowed=['teacherOne'], authHeaders=uid=>({Authorization:'Bearer '+tokens[uid]});
  const config={firestore:db,adminAuth:auth,allowedReviewerUids:allowed};
  // Fail closed by default even with a trusted teacher token.
  const off=await startLocalTopic71TeacherPreview(config);
  listeners.push(off);
  assert.match(off.url,/^http:\/\/127\.0\.0\.1:\d+\/__local\/grade11\/teacher\/unit7\/topic71\/preview$/);
  denied(await request(off.url,{headers:authHeaders('teacherOne')}),
   'temporarily-unavailable',503);
  let active=true;
  const preview=await startLocalTopic71TeacherPreview({
   ...config,isPilotEnabled:()=>active
  });
  listeners.push(preview);
  assert.equal(preview.url.startsWith('http://'+HOST+':'),true);
  const home=await request(preview.url,{headers:authHeaders('teacherOne')});
  validPage(home);
  assert.ok(home.text.includes('Which material is identified in the textbook as a natural polymer?'));
  assert.ok(home.text.includes('Polythene'));
  assert.ok(home.text.includes('Sulphur'));
  assert.ok(home.text.includes('no regular long-range repeating arrangement'));
  assert.ok(home.text.includes('Polythene is listed as a synthetic polymer'));
  assert.equal((await db.collection('unit07Topic71TeacherReviewPilot').get()).size,0);
  assert.equal((await db.collection('unit07Topic71TeacherReviewPilotAudit').get()).size,0);
  counts.readOnlyProofs++;
  // Local bearer token is the security boundary, not hidden dashboard buttons.
  denied(await request(preview.url,{headers:authHeaders('studentA')}),
   'teacher-access-required',403);
  denied(await request(preview.url,{headers:authHeaders('teacherTwo')}),
   'teacher-access-required',403);
  denied(await request(preview.url,{headers:authHeaders('rootAdmin')}),
   'teacher-access-required',403);
  denied(await request(preview.url,{headers:authHeaders('unverified')}),
   'verified-email-required',403);
  denied(await request(preview.url,{headers:{Authorization:'Bearer invalid'}}),
   'authentication-required',401);
  denied(await request(preview.url,{headers:{}}),
   'invalid-request',400);
  denied(await request(preview.url+'?unit=7',{headers:authHeaders('teacherOne')}),
   'invalid-request',400);
  denied(await request(preview.origin+'/other',{headers:authHeaders('teacherOne')}),
   'invalid-request',400);
  denied(await request(preview.url,{method:'POST',headers:authHeaders('teacherOne')}),
   'unsupported-method',405);
  denied(await request(preview.url,{headers:{...authHeaders('teacherOne'),Origin:'http://evil.invalid'}}),
   'invalid-request',400);
  denied(await request(preview.url,{headers:{...authHeaders('teacherOne'),Cookie:'session=forged'}}),
   'invalid-request',400);
  denied(await request(preview.url,{headers:{...authHeaders('teacherOne'),'X-Forwarded-For':'127.0.0.1'}}),
   'invalid-request',400);
  denied(await request(preview.url,{headers:{...authHeaders('teacherOne'),'Content-Type':'application/json'}}),
   'invalid-request',400);
  denied(await request(preview.url,{headers:{...authHeaders('teacherOne'),Host:'localhost:9999'}}),
   'invalid-request',400);
  // The page reflects only the logged-in teacher's existing recorded advice;
  // it cannot submit a decision itself.
  const pilot=createLocalTopic71TeacherReviewPilot({
   ...config,isPilotEnabled:()=>active
  });
  const source=await pilot.listPilotItems({authorization:'Bearer '+tokens.teacherOne});
  assert.equal(source.ok,true);
  const one=source.items.find(x=>x.sourceNumber===10);
  const saved=await pilot.recordPilotRecommendation({
   authorization:'Bearer '+tokens.teacherOne,
   questionId:one.questionId,
   originalSha256:one.originalSha256,candidateSha256:one.candidateSha256,
   recommendation:'needs-revision'
  });
  assert.equal(saved.ok,true);
  const refreshed=await request(preview.url,{headers:authHeaders('teacherOne')});
  validPage(refreshed);
  assert.ok(refreshed.text.includes('needs-revision'));
  assert.equal((await db.collection('unit07Topic71TeacherReviewPilot').get()).size,1);
  assert.equal((await db.collection('unit07Topic71TeacherReviewPilotAudit').get()).size,1);
  counts.readOnlyProofs++;
  // No caller-controlled markup survives HTML escaping.
  const altered=new Map();
  const originalSources=fs.readFileSync(path.join(ROOT,
   'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv'),'utf8')
   .trimEnd().split('\n');
  for(const item of source.items){
   const parts=originalSources[item.sourceNumber-1].split('\t');
   altered.set(item.questionId,{id:item.questionId,number:item.sourceNumber,
    originalSha256:item.originalSha256,candidateSha256:item.candidateSha256,
    words:item.sourceNumber===10?['<img src=x onerror=alert(1)>',...parts.slice(1)]:parts
   });
  }
  const escaped=renderTeacherPreview(source,altered);
  assert.ok(escaped.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.equal(escaped.includes('<img'),false);
  counts.renderEncoding++;
  // Revocation immediately denies valid already-minted token.
  await auth.setCustomUserClaims('teacherOne',{teacher:false});
  denied(await request(preview.url,{headers:authHeaders('teacherOne')}),
   'teacher-access-required',403);counts.revocations++;
  await auth.setCustomUserClaims('teacherOne',{teacher:true});
  await auth.updateUser('teacherOne',{disabled:true});
  denied(await request(preview.url,{headers:authHeaders('teacherOne')}),
   'authentication-required',401);counts.revocations++;
  await auth.updateUser('teacherOne',{disabled:false});
  await db.doc('teacherDirectory/teacherOne').update({status:'revoked'});
  denied(await request(preview.url,{headers:authHeaders('teacherOne')}),
   'teacher-access-required',403);counts.revocations++;
  active=false;
  // No extra records, release flags or unauthorized data after these reads.
  assert.equal((await db.collection('unit07Topic71TeacherReviewPilot').get()).size,1);
  assert.equal((await db.collection('unit07Topic71TeacherReviewPilotAudit').get()).size,1);
  assert.equal(fs.readFileSync(path.join(ROOT,'question-bank/manifest.json'),'utf8'),beforeManifest);
  assert.equal(fs.readFileSync(path.join(ROOT,'portal/learning-catalog.json'),'utf8'),beforeCatalog);
  assert.equal(fs.readFileSync(path.join(ROOT,
   'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv'),'utf8'),original);
  const pub=JSON.parse(beforeCatalog).grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
  assert.equal(pub.status,'planned');assert.equal(pub.questionBankCount,0);
  const report={version:'V156',mode:'LOCAL_EMULATOR_ONLY_AUTHENTICATED_READ_ONLY_HTML',
   itemsRendered:4,realTeacherApprovals:0,unit7ScoredQuestions:0,...counts};
  fs.mkdirSync(path.dirname(qa),{recursive:true});
  fs.writeFileSync(qa,JSON.stringify(report,null,2)+'\n');
  console.log('V156 PASS: trusted teacher read-only HTML, XSS escaping, bearer auth, no CORS, revocation checks, 0 scored release');
 }finally{
  for(const listener of listeners)await listener.close().catch(()=>{});
  for(const app of clients)await clientDelete(app).catch(()=>{});
  await adminDelete(admin).catch(()=>{});
 }
}
main().catch(e=>{console.error('V156 TEST FAIL',e.stack||e);process.exitCode=1;});
