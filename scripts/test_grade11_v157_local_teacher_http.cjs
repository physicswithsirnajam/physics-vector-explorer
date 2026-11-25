#!/usr/bin/env node
'use strict';
/**
 * V157 local Firestore/Auth emulator and ephemeral loopback HTTP integration.
 * Synthetic users and credentials ONLY. No production project or live data.
 * This HTTP action is a narrow local transport over V155 server-owned policy.
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
const {createLocalTopic71TeacherReviewPilot,COLLECTION,AUDIT}=
 require('../server/local-topic71-teacher-review-pilot-v155.cjs');
const {startLocalTopic71TeacherActionHttp,MAX_BODY_BYTES,parseAction}=
 require('../server/local-topic71-teacher-action-http-v157.cjs');
const {startLocalTopic71TeacherPreview}=
 require('../server/local-topic71-teacher-preview-v156.cjs');

const ROOT=path.resolve(__dirname,'..');
const PASSWORD='V157-SYNTHETIC-LOCAL-ONLY-NOT-LIVE_2026!';
const email=uid=>uid+'@example.test';
const tracked=[
 'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json',
 'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv',
 'question-bank/manifest.json','portal/learning-catalog.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const originals=Object.fromEntries(tracked.map(p=>
 [p,fs.readFileSync(path.join(ROOT,p),'utf8')]));
const counts={httpAuthorized:0,httpRejected:0,idempotent:0,conflicts:0,
 teacherRevocations:0,previewReads:0,atomicAuditEntries:0};
const req=(url,{method='POST',headers={},body}={})=>
 new Promise((resolve,reject)=>{
  const out=http.request(url,{method,headers,agent:false,timeout:5500},res=>{
   const chunks=[];let bytes=0;
   res.on('data',part=>{
    bytes+=part.length;
    if(bytes>30000)out.destroy(Error('response-size-cap'));
    else chunks.push(part);
   });
   res.on('end',()=>{
    const raw=Buffer.concat(chunks).toString('utf8');
    let parsed=null;try{parsed=JSON.parse(raw);}catch{}
    resolve({status:res.statusCode,headers:res.headers,body:parsed,raw});
   });
  });
  out.on('timeout',()=>out.destroy(Error('local-http-timeout')));
  out.on('error',reject);
  if(body!==undefined)out.write(body);
  out.end();
 });
function head(token,json){return {
 Authorization:'Bearer '+token,
 'Content-Type':'application/json',
 'Content-Length':String(Buffer.byteLength(json))
};}
function assertProtected(r){
 assert.equal(r.headers['content-type'],'application/json; charset=utf-8');
 assert.equal(r.headers['cache-control'],'no-store, max-age=0');
 assert.equal(r.headers['access-control-allow-origin'],undefined);
 assert.equal(r.headers['set-cookie'],undefined);
 assert.equal(r.headers['x-frame-options'],'DENY');
 assert.match(r.headers['content-security-policy'],/default-src 'none'/);
 for(const marker of ['correctOption','sourceExplanation','answerKey','reviewerUid',
   'studentEmail','PRIVATE_STUDENT','FirebaseToken'])
  assert.ok(!r.raw.includes(marker),'private response leak: '+marker);
}
function denied(r,code,status){
 assert.equal(r.status,status,r.raw);
 assert.deepEqual(r.body,{ok:false,code});
 assertProtected(r);counts.httpRejected++;
}
function accepted(r,questionId,alreadyRecorded=false){
 assert.equal(r.status,200,r.raw);
 assert.deepEqual(r.body,{
  ok:true,questionId,status:'advisory-only',
  alreadyRecorded,academicSignoff:'PENDING',scoredRelease:'HOLD'
 });
 assertProtected(r);
 counts.httpAuthorized++;
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,'127.0.0.1:8089');
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,'127.0.0.1:9099');
 assert.equal(process.env.PSN_LOCAL_TOPIC71_TEACHER_ACTION_HTTP,'enabled-local-test-only');
 assert.equal(process.env.PSN_LOCAL_TOPIC71_TEACHER_PREVIEW,'enabled-local-test-only');
 assert.equal(Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS),false);
 assert.ok(MAX_BODY_BYTES<=512&&MAX_BODY_BYTES>=200);
 const grade11=JSON.parse(originals['portal/learning-catalog.json']);
 const u7=grade11.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');assert.equal(u7.questionBankCount,0);
 const ledger=JSON.parse(originals[tracked[0]]);
 assert.equal(ledger.teacherScienceSignoffs,0);
 assert.equal(ledger.unit7ScoredReleaseCount,0);
 const app=adminInit({projectId:PROJECT},'v157-local-admin');
 const browserApps=[],listeners=[];
 try{
  const auth=adminAuthFor(app),db=getFirestore(app);
  const actors=[
   ['teacherOne',true,{teacher:true}],
   ['teacherOther',true,{teacher:true}],
   ['studentOne',true,{}],
   ['rootAdmin',true,{admin:true}],
   ['unverified',false,{teacher:true}]
  ];
  for(const [uid,verified,claims] of actors){
   await auth.createUser({uid,email:email(uid),emailVerified:verified,password:PASSWORD});
   if(Object.keys(claims).length)await auth.setCustomUserClaims(uid,claims);
  }
  for(const uid of ['teacherOne','teacherOther','unverified']){
   await db.doc('teacherDirectory/'+uid).set({
    schemaVersion:1,teacherUid:uid,status:'active'
   });
  }
  const tokens={};
  for(const [uid] of actors){
   const client=clientInit({
    projectId:PROJECT,authDomain:PROJECT+'.firebaseapp.com',
    apiKey:'local-synthetic-emulator-v157'},'v157-client-'+uid);
   browserApps.push(client);
   const ca=clientAuthFor(client);
   connectAuthEmulator(ca,'http://127.0.0.1:9099',{disableWarnings:true});
   const signed=await signInWithEmailAndPassword(ca,email(uid),PASSWORD);
   tokens[uid]=await signed.user.getIdToken(true);
  }
  const make=(user,params)=>({authorization:'Bearer '+tokens[user],...params});
  let enabled=false;
  const config={firestore:db,adminAuth:auth,
   allowedReviewerUids:['teacherOne'],isPilotEnabled:()=>enabled,
   now:()=>Date.parse('2026-11-25T03:20:00.000Z')};
  const pilot=createLocalTopic71TeacherReviewPilot(config);
  const local=await startLocalTopic71TeacherActionHttp(config);
  listeners.push(local);
  const summary=await pilot.listPilotItems(make('teacherOne'));
  assert.deepEqual(summary,{ok:false,code:'temporarily-unavailable'});
  enabled=true;
  const items=(await pilot.listPilotItems(make('teacherOne'))).items;
  assert.deepEqual(items.map(x=>x.sourceNumber),[10,15,62,76]);
  function action(item,recommendation='supports-candidate-wording'){
   return {
    questionId:item.questionId,originalSha256:item.originalSha256,
    candidateSha256:item.candidateSha256,recommendation
   };
  }
  async function send(who,item,change={},extra={}){
   const data=JSON.stringify({...action(item),...change});
   return req(local.url,{headers:{...head(tokens[who],data),...extra},body:data});
  }
  const q10=items[0],q76=items[3];
  // Server disabled by default and no writes.
  enabled=false;
  denied(await send('teacherOne',q10),'temporarily-unavailable',503);
  assert.equal((await db.collection(COLLECTION).get()).size,0);
  enabled=true;
  denied(await send('studentOne',q10),'teacher-access-required',403);
  denied(await send('teacherOther',q10),'teacher-access-required',403);
  denied(await send('rootAdmin',q10),'teacher-access-required',403);
  denied(await send('unverified',q10),'verified-email-required',403);
  denied(await req(local.url,{method:'POST',headers:{
   'Content-Type':'application/json','Content-Length':'2',
   Authorization:'Bearer broken-token'},body:'{}'}),
   'invalid-request',400); // Empty action rejected before identity lookup
  denied(await send('teacherOne',q10,{candidateSha256:'0'.repeat(64)}),
   'source-revision-mismatch',409);
  denied(await send('teacherOne',q10,{originalSha256:'0'.repeat(64)}),
   'source-revision-mismatch',409);
  denied(await send('teacherOne',q10,{questionId:'XI-U07-T071-Q011'}),
   'invalid-request',400);
  denied(await send('teacherOne',q10,{recommendation:'approve-and-release'}),
   'invalid-request',400);
  denied(await send('teacherOne',q10,{studentUid:'hijack'}),
   'invalid-request',400);
  denied(await send('teacherOne',q10,{correctOption:'B'}),
   'invalid-request',400);
  denied(await send('teacherOne',q10,{teacherApproved:true}),
   'invalid-request',400);
  const json=JSON.stringify(action(q10));
  denied(await req(local.url,{method:'GET',headers:{Authorization:'Bearer '+tokens.teacherOne}}),
   'unsupported-method',405);
  denied(await req(local.url+'?q=10',{headers:head(tokens.teacherOne,json),body:json}),
   'invalid-request',400);
  denied(await req(local.origin+'/other',{headers:head(tokens.teacherOne,json),body:json}),
   'invalid-request',400);
  denied(await req(local.url,{headers:{...head(tokens.teacherOne,json),
   'Content-Type':'text/plain'},body:json}),'invalid-request',400);
  denied(await req(local.url,{headers:{...head(tokens.teacherOne,json),
   Origin:'https://evil.example.invalid'},body:json}),'invalid-request',400);
  denied(await req(local.url,{headers:{...head(tokens.teacherOne,json),
   Cookie:'token=fake'},body:json}),'invalid-request',400);
  denied(await req(local.url,{headers:{...head(tokens.teacherOne,json),
   'X-Forwarded-For':'127.0.0.1'},body:json}),'invalid-request',400);
  denied(await req(local.url,{headers:{...head(tokens.teacherOne,json),
   Host:'localhost:9999'},body:json}),'invalid-request',400);
  denied(await req(local.url,{headers:{Authorization:'Bearer '+tokens.teacherOne,
   'Content-Type':'application/json'},body:json}),'invalid-request',400);
  const alternative=' { '+json.slice(1);
  denied(await req(local.url,{headers:head(tokens.teacherOne,alternative),
   body:alternative}),'invalid-request',400);
  const duplicate='{"questionId":"XI-U07-T071-Q999",'+json.slice(1);
  denied(await req(local.url,{headers:head(tokens.teacherOne,duplicate),
   body:duplicate}),'invalid-request',400);
  const long='x'.repeat(MAX_BODY_BYTES+10);
  denied(await req(local.url,{headers:head(tokens.teacherOne,long),
   body:long}),'invalid-request',400);
  assert.equal(parseAction(json)?.questionId,q10.questionId);
  assert.equal(parseAction(json+' '),null);
  assert.equal((await db.collection(COLLECTION).get()).size,0);
  assert.equal((await db.collection(AUDIT).get()).size,0);
  for(let i=0;i<4;i++){
   const item=items[i];
   const recommendation=i===3?'needs-revision':'supports-candidate-wording';
   const result=await send('teacherOne',item,{recommendation});
   accepted(result,item.questionId,false);
   const again=await send('teacherOne',item,{recommendation});
   accepted(again,item.questionId,true);counts.idempotent++;
   const altered=recommendation==='needs-revision'?
    'supports-candidate-wording':'needs-revision';
   denied(await send('teacherOne',item,{recommendation:altered}),
    'conflict',409);counts.conflicts++;
  }
  const saved=await db.collection(COLLECTION).get();
  const audits=await db.collection(AUDIT).get();
  assert.equal(saved.size,4);assert.equal(audits.size,4);
  counts.atomicAuditEntries=audits.size;
  for(const record of saved.docs){
   const r=record.data();
   assert.equal(r.status,'advisory-only');
   assert.equal(r.teacherScientificSignoff,'PENDING');
   assert.equal(r.teacherCognitiveSignoff,'PENDING');
   assert.equal(r.sourceAnswerKeyCertified,false);
   assert.equal(r.scoredReleaseApproved,false);
   assert.ok(!Object.keys(r).some(k=>/correctOption|answerLetter|answerKey|explanationText/i.test(k)));
  }
  const v156=await startLocalTopic71TeacherPreview(config);
  listeners.push(v156);
  const preview=await req(v156.url,{method:'GET',
   headers:{Authorization:'Bearer '+tokens.teacherOne}});
  assert.equal(preview.status,200);
  assert.equal(preview.headers['content-type'],'text/html; charset=utf-8');
  assert.ok(preview.raw.includes('needs-revision'));
  assert.ok(preview.raw.includes('supports-candidate-wording'));
  assert.ok(preview.raw.includes('HOLD — 0 published'));
  assert.equal((preview.raw.match(/<article data-question-id=/g)||[]).length,4);
  counts.previewReads++;
  // Fail-closed on current teacher status despite an existing valid token.
  await auth.setCustomUserClaims('teacherOne',{teacher:false});
  denied(await send('teacherOne',q10),'teacher-access-required',403);counts.teacherRevocations++;
  await auth.setCustomUserClaims('teacherOne',{teacher:true});
  await auth.updateUser('teacherOne',{disabled:true});
  denied(await send('teacherOne',q10),'authentication-required',401);counts.teacherRevocations++;
  await auth.updateUser('teacherOne',{disabled:false});
  await db.doc('teacherDirectory/teacherOne').update({status:'revoked'});
  denied(await send('teacherOne',q76),'teacher-access-required',403);counts.teacherRevocations++;
  for(const path of tracked){
   assert.equal(fs.readFileSync(pathJoin(path),'utf8'),originals[path]);
  }
  const cat=JSON.parse(originals['portal/learning-catalog.json']);
  assert.equal(cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===7).questionBankCount,0);
  assert.equal((await db.collection(COLLECTION).get()).size,4);
  assert.equal((await db.collection(AUDIT).get()).size,4);
  const result={version:'V157',mode:'LOCAL_ONLY_LOOPBACK_AUTH_EMULATOR_HTTP',
   sourceQuestionNumbers:[10,15,62,76],teacherScientificApprovals:0,
   teacherCognitiveApprovals:0,correctKeysImported:0,unit7ScoredRelease:0,
   browserProductionEndpointCreated:false,...counts};
  const out=path.join(ROOT,'qa-artifacts/grade11-v157-unit7-local-teacher-http/summary.json');
  fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
  console.log('V157 PASS: four local signed teacher POST recommendations, read-only preview projection, safe denials, immutable audits; ZERO student releases.');
 }finally{
  for(const server of listeners)await server.close().catch(()=>{});
  for(const app of browserApps)await clientDelete(app).catch(()=>{});
  await adminDelete(app).catch(()=>{});
 }
}
function pathJoin(rel){return path.join(ROOT,rel);}
main().catch(e=>{console.error('V157 FAIL:',e.stack||e);process.exitCode=1;});
