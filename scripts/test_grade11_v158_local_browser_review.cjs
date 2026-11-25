#!/usr/bin/env node
'use strict';
/**
 * V158: Real localhost Firebase Auth+Firestore emulator HTTP-contract tests.
 * Synthetically signed-in users only. Not a production browser deployment.
 * Tests server-rendered shell, authentic session token boundaries and POST
 * adapter. Full native browser DOM automation is intentionally future work.
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
const {startLocalTopic71BrowserReview,ROUTES}=
 require('../server/local-topic71-browser-review-v158.cjs');
const {COLLECTION,AUDIT}=
 require('../server/local-topic71-teacher-review-pilot-v155.cjs');
const ROOT=path.resolve(__dirname,'..');
const PASSWORD='V158-local-synthetic-only-never-production_2026!';
const email=uid=>uid+'@example.test';
const SENSITIVE=['correctOption','answerKey','originalExplanationText','studentUid',
 'studentEmail','firebaseToken','privateKey','PRIVATE_TEST'];
const tracked=[
 'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json',
 'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv',
 'portal/learning-catalog.json','question-bank/manifest.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const backups=Object.fromEntries(tracked.map(p=>
 [p,fs.readFileSync(path.join(ROOT,p),'utf8')]));
const counts={authorizedItems:0,authorizedAdvisoryPosts:0,
 unauthorizedDenied:0,crossOriginDenied:0,conflicts:0,
 immutableAudit:0,currentAuthRevocation:0,siteShellChecks:0};

function request(url,{method='GET',headers={},body}={}){
 return new Promise((resolve,reject)=>{
  const req=http.request(url,{method,headers,agent:false,timeout:6000},res=>{
   let size=0;const parts=[];
   res.on('data',chunk=>{
    size+=chunk.length;
    if(size>40000)req.destroy(Error('oversize-response'));
    else parts.push(chunk);
   });
   res.on('end',()=>{
    const text=Buffer.concat(parts).toString('utf8');
    let json=null;try{json=JSON.parse(text);}catch{}
    resolve({status:res.statusCode,headers:res.headers,text,json});
   });
  });
  req.on('timeout',()=>req.destroy(Error('loopback-timeout')));
  req.on('error',reject);
  if(body!==undefined)req.write(body);
  req.end();
 });
}
function common(r){
 assert.equal(r.headers['cache-control'],'no-store, max-age=0');
 assert.equal(r.headers['access-control-allow-origin'],undefined);
 assert.equal(r.headers['set-cookie'],undefined);
 assert.equal(r.headers['x-frame-options'],'DENY');
 assert.match(r.headers['content-security-policy'],/frame-ancestors 'none'/);
}
function deny(r,code,status){
 assert.equal(r.status,status,r.text);
 assert.deepEqual(r.json,{ok:false,code});
 common(r);
 assert.ok(SENSITIVE.every(x=>!r.text.includes(x)));
 counts.unauthorizedDenied++;
}
function action(item,recommendation='supports-candidate-wording'){
 return {questionId:item.questionId,originalSha256:item.originalSha256,
  candidateSha256:item.candidateSha256,recommendation};
}
function headers(token,origin,body){
 return {Authorization:'Bearer '+token,
  'Content-Type':'application/json',
  'Content-Length':String(Buffer.byteLength(body)),
  Origin:origin};
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,'127.0.0.1:8089');
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,'127.0.0.1:9099');
 assert.equal(process.env.PSN_LOCAL_TOPIC71_BROWSER_REVIEW,'enabled-local-test-only');
 assert.equal(!!process.env.GOOGLE_APPLICATION_CREDENTIALS,false);
 const catalog=JSON.parse(backups['portal/learning-catalog.json']);
 const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');assert.equal(u7.questionBankCount,0);
 const ledger=JSON.parse(backups['quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json']);
 assert.equal(ledger.teacherScienceSignoffs,0);
 assert.equal(ledger.teacherCognitiveSignoffs,0);
 assert.equal(ledger.unit7ScoredReleaseCount,0);

 const app=adminInit({projectId:PROJECT},'v158-admin');
 const clients=[],servers=[];
 try{
  const auth=adminAuthFor(app),db=getFirestore(app);
  const identities=[
   ['teacherOne',true,{teacher:true}],
   ['teacherTwo',true,{teacher:true}],
   ['studentOne',true,{}],
   ['rootAdmin',true,{admin:true}],
   ['unverifiedTeacher',false,{teacher:true}]
  ];
  for(const [uid,verified,claims] of identities){
   await auth.createUser({uid,email:email(uid),password:PASSWORD,
    emailVerified:verified});
   if(Object.keys(claims).length)await auth.setCustomUserClaims(uid,claims);
  }
  for(const uid of ['teacherOne','teacherTwo','unverifiedTeacher'])
   await db.doc('teacherDirectory/'+uid).set({
    schemaVersion:1,teacherUid:uid,status:'active'
   });
  const tokens={};
  for(const [uid] of identities){
   const c=clientInit({
    projectId:PROJECT,authDomain:PROJECT+'.firebaseapp.com',
    apiKey:'v158-synthetic-local-emulator-only'},'v158-'+uid);
   clients.push(c);
   const ca=clientAuthFor(c);
   connectAuthEmulator(ca,'http://127.0.0.1:9099',{disableWarnings:true});
   const session=await signInWithEmailAndPassword(ca,email(uid),PASSWORD);
   tokens[uid]=await session.user.getIdToken(true);
  }
  let enabled=false;
  const config={firestore:db,adminAuth:auth,
   allowedReviewerUids:['teacherOne'],
   isPilotEnabled:()=>enabled,
   now:()=>Date.parse('2026-11-25T04:00:00.000Z')};
  const appServer=await startLocalTopic71BrowserReview(config);
  servers.push(appServer);
  const origin=appServer.origin;
  const authHeader=who=>({Authorization:'Bearer '+tokens[who]});
  const shell=await request(appServer.url);
  common(shell);assert.equal(shell.status,200);
  assert.equal(shell.headers['content-type'],'text/html; charset=utf-8');
  assert.ok(shell.text.includes('Synthetic local teacher sign-in'));
  assert.ok(shell.text.includes('id="review-panel"'));
  assert.ok(shell.text.includes('id="questions"'));
  assert.ok(shell.text.includes('local-topic71'));
  assert.ok(!shell.text.includes('A glass pane has no regular'));
  assert.ok(!shell.text.includes('XI-U07-T071-Q010'));
  assert.ok(!shell.text.includes('correctOption'));
  counts.siteShellChecks++;
  const js=await request(origin+ROUTES.client);
  common(js);assert.equal(js.status,200);
  assert.equal(js.headers['content-type'],'text/javascript; charset=utf-8');
  for(const term of ['signInWithEmailAndPassword','inMemoryPersistence',
    'getIdToken(true)','credentials:\'omit\'','mode:\'same-origin\'',
    'supports-candidate-wording','needs-revision','textContent',
    'replaceChildren','academicSignoff','scoredRelease']){
   assert.ok(js.text.includes(term),'Client module lacks '+term);
  }
  for(const bad of ['localStorage.setItem','sessionStorage.setItem',
    'document.cookie','innerHTML =','answerKey','correctOptionId']){
   assert.equal(js.text.includes(bad),false,'Unsafe client marker '+bad);
  }
  counts.siteShellChecks++;
  // No teacher data exposed to an anonymous page or disabled server.
  deny(await request(origin+ROUTES.items),'invalid-request',400);
  deny(await request(origin+ROUTES.items,{headers:authHeader('teacherOne')}),
   'temporarily-unavailable',503);
  enabled=true;
  deny(await request(origin+ROUTES.items,{headers:authHeader('studentOne')}),
   'teacher-access-required',403);
  deny(await request(origin+ROUTES.items,{headers:authHeader('teacherTwo')}),
   'teacher-access-required',403);
  deny(await request(origin+ROUTES.items,{headers:authHeader('rootAdmin')}),
   'teacher-access-required',403);
  deny(await request(origin+ROUTES.items,{headers:authHeader('unverifiedTeacher')}),
   'verified-email-required',403);
  deny(await request(origin+ROUTES.items,{headers:{Authorization:'Bearer forged'}}),
   'authentication-required',401);
  const read=await request(origin+ROUTES.items,{headers:authHeader('teacherOne')});
  common(read);assert.equal(read.status,200);
  assert.deepEqual(Object.keys(read.json),['ok','count','items']);
  assert.equal(read.json.count,4);
  assert.deepEqual(read.json.items.map(x=>x.sourceNumber),[10,15,62,76]);
  assert.ok(read.json.items.every(x=>x.options.length===4&&
   x.teacherAcademicSignoff==='PENDING'&&x.studentScoredRelease==='HOLD'));
  assert.ok(!SENSITIVE.some(x=>read.text.includes(x)),'Key/PII disclosed');
  assert.ok(read.text.includes('polythene')||read.text.includes('Polythene'));
  counts.authorizedItems++;
  assert.equal((await db.collection(COLLECTION).get()).size,0);
  assert.equal((await db.collection(AUDIT).get()).size,0);
  const submit=async(who,item,changes={},extras={})=>{
   const body=JSON.stringify({...action(item),...changes});
   const h={...headers(tokens[who],origin,body),...extras};
   return request(origin+ROUTES.submit,{method:'POST',headers:h,body});
  };
  const first=read.json.items[0];
  deny(await submit('studentOne',first),'teacher-access-required',403);
  deny(await submit('teacherTwo',first),'teacher-access-required',403);
  deny(await submit('rootAdmin',first),'teacher-access-required',403);
  deny(await submit('unverifiedTeacher',first),'verified-email-required',403);
  deny(await submit('teacherOne',first,{candidateSha256:'0'.repeat(64)}),
   'source-revision-mismatch',409);
  deny(await submit('teacherOne',first,{originalSha256:'0'.repeat(64)}),
   'source-revision-mismatch',409);
  deny(await submit('teacherOne',first,{recommendation:'publish'}),
   'invalid-request',400);
  deny(await submit('teacherOne',first,{teacherApproved:true}),
   'invalid-request',400);
  deny(await submit('teacherOne',first,{correctOption:'B'}),
   'invalid-request',400);
  deny(await submit('teacherOne',first,{}, {Origin:'http://malicious.invalid'}),
   'invalid-request',400);counts.crossOriginDenied++;
  deny(await submit('teacherOne',first,{}, {'Content-Type':'text/plain'}),
   'invalid-request',400);
  deny(await submit('teacherOne',first,{}, {Cookie:'session=forged'}),
   'invalid-request',400);
  deny(await submit('teacherOne',first,{}, {'X-Forwarded-For':'127.0.0.1'}),
   'invalid-request',400);
  const payload=JSON.stringify(action(first));
  deny(await request(origin+ROUTES.submit,{method:'POST',headers:{
   Authorization:'Bearer '+tokens.teacherOne,'Content-Type':'application/json',
   'Content-Length':String(Buffer.byteLength(payload))},body:payload}),
   'invalid-request',400); // Browser POST Origin must match own loopback origin.
  counts.crossOriginDenied++;
  deny(await request(origin+ROUTES.submit,{method:'GET',headers:authHeader('teacherOne')}),
   'unsupported-method',405);
  deny(await request(origin+ROUTES.submit+'?preview=true',{method:'POST',
   headers:headers(tokens.teacherOne,origin,payload),body:payload}),
   'invalid-request',400);
  const extra=' '+payload;
  deny(await request(origin+ROUTES.submit,{method:'POST',
   headers:headers(tokens.teacherOne,origin,extra),body:extra}),
   'invalid-request',400);
  for(let i=0;i<4;i++){
   const item=read.json.items[i],recommendation=i===3?
    'needs-revision':'supports-candidate-wording';
   const stored=await submit('teacherOne',item,{recommendation});
   assert.equal(stored.status,200,stored.text);
   assert.deepEqual(stored.json,{
    ok:true,questionId:item.questionId,status:'advisory-only',
    alreadyRecorded:false,academicSignoff:'PENDING',scoredRelease:'HOLD'
   });
   counts.authorizedAdvisoryPosts++;
   const repeated=await submit('teacherOne',item,{recommendation});
   assert.equal(repeated.status,200);
   assert.equal(repeated.json.alreadyRecorded,true);
   const contradictory=await submit('teacherOne',item,{
    recommendation:recommendation==='needs-revision'?
     'supports-candidate-wording':'needs-revision'});
   deny(contradictory,'conflict',409);counts.conflicts++;
  }
  const suggestions=await db.collection(COLLECTION).get();
  const audit=await db.collection(AUDIT).get();
  assert.equal(suggestions.size,4);assert.equal(audit.size,4);
  counts.immutableAudit=audit.size;
  for(const s of suggestions.docs){
   const row=s.data();
   assert.equal(row.teacherScientificSignoff,'PENDING');
   assert.equal(row.teacherCognitiveSignoff,'PENDING');
   assert.equal(row.sourceAnswerKeyCertified,false);
   assert.equal(row.scoredReleaseApproved,false);
   assert.ok(!Object.hasOwn(row,'correctOption'));
  }
  const again=await request(origin+ROUTES.items,{headers:authHeader('teacherOne')});
  assert.equal(again.status,200);
  assert.deepEqual(again.json.items.map(x=>x.recommendation),[
   'supports-candidate-wording','supports-candidate-wording',
   'supports-candidate-wording','needs-revision'
  ]);
  counts.authorizedItems++;
  await auth.setCustomUserClaims('teacherOne',{teacher:false});
  deny(await request(origin+ROUTES.items,{headers:authHeader('teacherOne')}),
   'teacher-access-required',403);counts.currentAuthRevocation++;
  await auth.setCustomUserClaims('teacherOne',{teacher:true});
  await auth.updateUser('teacherOne',{disabled:true});
  deny(await submit('teacherOne',first),'authentication-required',401);
  counts.currentAuthRevocation++;
  await auth.updateUser('teacherOne',{disabled:false});
  await db.doc('teacherDirectory/teacherOne').update({status:'revoked'});
  deny(await request(origin+ROUTES.items,{headers:authHeader('teacherOne')}),
   'teacher-access-required',403);counts.currentAuthRevocation++;
  for(const p of tracked)assert.equal(
   fs.readFileSync(path.join(ROOT,p),'utf8'),backups[p]);
  assert.equal((await db.collection(COLLECTION).get()).size,4);
  assert.equal((await db.collection(AUDIT).get()).size,4);
  const dir=path.join(ROOT,'qa-artifacts/grade11-v158-local-browser-review');
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({
   version:'V158',testing:'REAL_LOCAL_FIREBASE_EMULATORS_AND_HTTP_CONTRACTS',
   nativeBrowserAutomationDone:false,liveTeacherLoginDeployed:false,
   fourSourceItems:[10,15,62,76],realAcademicApprovals:0,
   originalKeysPublished:0,unit7ScoredRelease:0,...counts
  },null,2)+'\n');
  console.log('V158 PASS: local browser shell, Auth-protected four-item reads, same-origin advisory POST, revision conflict, audit and 0 scored release.');
 }finally{
  for(const x of servers)await x.close().catch(()=>{});
  for(const c of clients)await clientDelete(c).catch(()=>{});
  await adminDelete(app).catch(()=>{});
 }
}
main().catch(err=>{console.error('V158 FAIL',err.stack||err);process.exitCode=1;});
