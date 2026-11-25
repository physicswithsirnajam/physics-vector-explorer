#!/usr/bin/env node
'use strict';
/**
 * V155 REAL LOCAL FIREBASE AUTH + FIRESTORE emulator tests.
 * Synthetic identities and data ONLY. No live endpoint, production project,
 * email sending, browser teacher write permission, exam keys or student release.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {initializeApp:adminInit,deleteApp:adminDelete}=require('firebase-admin/app');
const {getAuth:adminAuthFor}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const {initializeApp:browserInit,deleteApp:browserDelete}=require('firebase/app');
const {getAuth:browserAuthFor,connectAuthEmulator,signInWithEmailAndPassword}=
 require('firebase/auth');
const {initializeTestEnvironment,assertFails}=require('@firebase/rules-unit-testing');
const {doc,getDoc,setDoc}=require('firebase/firestore');
const {createLocalTopic71TeacherReviewPilot,COLLECTION,AUDIT,PROJECT}=
 require('../server/local-topic71-teacher-review-pilot-v155.cjs');
const ROOT=path.resolve(__dirname,'..');
const rulesPath='security-proposals/v142/teacher-classroom-isolated.rules';
const watched=[
 'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json',
 'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv',
 'question-bank/manifest.json','portal/learning-catalog.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json',
 rulesPath
];
const digest=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,p))).digest('hex');
const before=Object.fromEntries(watched.map(p=>[p,digest(p)]));
const email=uid=>uid+'@example.test';
const PASSWORD='V155-LOCAL-SYNTHETIC-NEVER-USE-PRODUCTION_2026!';
const counts={serverDenials:0,teacherReadReceipts:0,teacherWriteReceipts:0,
 idempotentReceipts:0,firestoreBrowserDenials:0,revocationDenials:0};
function denied(result,code){
 assert.deepEqual(result,{ok:false,code});
 counts.serverDenials++;
}
function ok(result){
 assert.equal(result.ok,true,JSON.stringify(result));
 return result;
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,'127.0.0.1:8089');
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,'127.0.0.1:9099');
 assert.equal(!!process.env.GOOGLE_APPLICATION_CREDENTIALS,false);
 const ledger=JSON.parse(fs.readFileSync(path.join(ROOT,watched[0]),'utf8'));
 assert.equal(ledger.teacherScienceSignoffs,0);
 assert.equal(ledger.unit7ScoredReleaseCount,0);
 const source=JSON.parse(fs.readFileSync(path.join(ROOT,watched[3]),'utf8'));
 assert.equal(source.grades.find(g=>g.grade===11).units.find(u=>u.unit===7).questionBankCount,0);
 const rules=fs.readFileSync(path.join(ROOT,rulesPath),'utf8');
 assert.ok(rules.includes('NEVER DEPLOY'));
 const admin=adminInit({projectId:PROJECT},'v155-local-admin');
 const browserApps=[];let rulesEnv=null;
 try{
  const auth=adminAuthFor(admin),db=getFirestore(admin);
  rulesEnv=await initializeTestEnvironment({projectId:PROJECT,
   firestore:{host:'127.0.0.1',port:8089,rules}});
  const identities=['rootAdmin','teacherOne','teacherTwo','studentA','unverified'];
  for(const uid of identities)
   await auth.createUser({uid,email:email(uid),password:PASSWORD,
    emailVerified:uid!=='unverified'});
  await auth.setCustomUserClaims('rootAdmin',{admin:true});
  await auth.setCustomUserClaims('teacherOne',{teacher:true});
  await auth.setCustomUserClaims('teacherTwo',{teacher:true});
  await auth.setCustomUserClaims('unverified',{teacher:true});
  for(const uid of ['teacherOne','teacherTwo','unverified']){
   await db.doc('teacherDirectory/'+uid).set({
    schemaVersion:1,teacherUid:uid,status:'active'
   });
  }
  const tokens={};
  for(const uid of identities){
   const app=browserInit({apiKey:'V155-local-emulator-only',
    authDomain:PROJECT+'.firebaseapp.com',projectId:PROJECT},'v155-client-'+uid);
   browserApps.push(app);
   const ca=browserAuthFor(app);
   connectAuthEmulator(ca,'http://127.0.0.1:9099',{disableWarnings:true});
   const signed=await signInWithEmailAndPassword(ca,email(uid),PASSWORD);
   tokens[uid]=await signed.user.getIdToken(true);
  }
  const req=(uid,extra={})=>({authorization:'Bearer '+tokens[uid],...extra});
  let enabled=false;
  const pilot=createLocalTopic71TeacherReviewPilot({
   firestore:db,adminAuth:auth,allowedReviewerUids:['teacherOne'],
   isPilotEnabled:()=>enabled,now:()=>Date.parse('2026-11-25T03:00:00.000Z')
  });
  denied(await pilot.listPilotItems(req('teacherOne')),'temporarily-unavailable');
  assert.equal((await db.collection(COLLECTION).get()).size,0);
  enabled=true;
  denied(await pilot.listPilotItems({}),'invalid-request');
  denied(await pilot.listPilotItems({authorization:'Bearer BAD'}),'authentication-required');
  denied(await pilot.listPilotItems(req('studentA')),'teacher-access-required');
  denied(await pilot.listPilotItems(req('rootAdmin')),'teacher-access-required');
  denied(await pilot.listPilotItems(req('teacherTwo')),'teacher-access-required');
  denied(await pilot.listPilotItems(req('unverified')),'verified-email-required');
  denied(await pilot.listPilotItems(req('teacherOne',{role:'teacher'})),'invalid-request');
  denied(await pilot.recordPilotRecommendation(req('studentA',{
   questionId:'XI-U07-T071-Q010',originalSha256:'0'.repeat(64),
   candidateSha256:'0'.repeat(64),recommendation:'supports-candidate-wording'
  })),'teacher-access-required');
  const listed=ok(await pilot.listPilotItems(req('teacherOne')));counts.teacherReadReceipts++;
  assert.equal(listed.count,4);
  assert.deepEqual(listed.items.map(x=>x.sourceNumber),[10,15,62,76]);
  assert.deepEqual(listed.items.map(x=>x.explanationRepairStillRequired),[true,false,false,true]);
  assert.ok(listed.items.every(x=>x.teacherAcademicSignoff==='PENDING'&&x.studentScoredRelease==='HOLD'));
  const safeText=JSON.stringify(listed);
  for(const secret of ['correctOption','answerKey','sourceExplanationText','studentEmail','PRIVATE_TEST_NAME'])
   assert.ok(!safeText.includes(secret),'Leaked private source field');
  for(const item of listed.items){
   denied(await pilot.recordPilotRecommendation(req('teacherOne',{
    questionId:item.questionId,originalSha256:item.originalSha256,
    candidateSha256:'0'.repeat(64),
    recommendation:'supports-candidate-wording'
   })),'source-revision-mismatch');
  }
  denied(await pilot.recordPilotRecommendation(req('teacherOne',{
    questionId:'XI-U07-T071-Q011',originalSha256:listed.items[0].originalSha256,
    candidateSha256:listed.items[0].candidateSha256,
    recommendation:'supports-candidate-wording'
  })),'invalid-request');
  denied(await pilot.recordPilotRecommendation(req('teacherOne',{
    questionId:listed.items[0].questionId,originalSha256:listed.items[0].originalSha256,
    candidateSha256:listed.items[0].candidateSha256,
    recommendation:'approve-and-release'
  })),'invalid-request');
  denied(await pilot.recordPilotRecommendation(req('teacherOne',{
    questionId:listed.items[0].questionId,originalSha256:listed.items[0].originalSha256,
    candidateSha256:listed.items[0].candidateSha256,
    recommendation:'supports-candidate-wording',
    answerKey:'DO_NOT_STORE_KEYS'
  })),'invalid-request');
  for(let i=0;i<4;i++){
   const item=listed.items[i],decision=i===3?'needs-revision':'supports-candidate-wording';
   const params={questionId:item.questionId,
    originalSha256:item.originalSha256,candidateSha256:item.candidateSha256,
    recommendation:decision};
   const wrote=ok(await pilot.recordPilotRecommendation(req('teacherOne',params)));
   assert.deepEqual(wrote,{ok:true,questionId:item.questionId,
    status:'advisory-only',alreadyRecorded:false,
    academicSignoff:'PENDING',scoredRelease:'HOLD'});
   counts.teacherWriteReceipts++;
   const repeat=ok(await pilot.recordPilotRecommendation(req('teacherOne',params)));
   assert.equal(repeat.alreadyRecorded,true);counts.idempotentReceipts++;
   denied(await pilot.recordPilotRecommendation(req('teacherOne',{
    ...params,recommendation:decision==='needs-revision'?
      'supports-candidate-wording':'needs-revision'
   })),'conflict');
  }
  assert.equal((await db.collection(COLLECTION).get()).size,4);
  assert.equal((await db.collection(AUDIT).get()).size,4);
  for(const snap of (await db.collection(COLLECTION).get()).docs){
   const row=snap.data();
   assert.equal(row.status,'advisory-only');
   assert.equal(row.teacherScientificSignoff,'PENDING');
   assert.equal(row.teacherCognitiveSignoff,'PENDING');
   assert.equal(row.sourceAnswerKeyCertified,false);
   assert.equal(row.scoredReleaseApproved,false);
   assert.equal(row.reviewerUid,'teacherOne');
   assert.equal(typeof row.originalSha256,'string');
   assert.equal(typeof row.candidateSha256,'string');
   assert.equal(row.createdAtIso,'2026-11-25T03:00:00.000Z');
   assert.ok(!Object.keys(row).some(k=>/answerLetter|correctOption|keyText|explanationText/i.test(k)));
  }
  const after=ok(await pilot.listPilotItems(req('teacherOne')));
  counts.teacherReadReceipts++;
  assert.deepEqual(after.items.map(x=>x.recommendation),
   ['supports-candidate-wording','supports-candidate-wording',
    'supports-candidate-wording','needs-revision']);
  // Revocation takes effect despite an already-issued Auth ID token.
  await auth.setCustomUserClaims('teacherOne',{teacher:false});
  denied(await pilot.listPilotItems(req('teacherOne')),'teacher-access-required');counts.revocationDenials++;
  await auth.setCustomUserClaims('teacherOne',{teacher:true});
  await auth.updateUser('teacherOne',{disabled:true});
  denied(await pilot.listPilotItems(req('teacherOne')),'authentication-required');counts.revocationDenials++;
  await auth.updateUser('teacherOne',{disabled:false});
  await db.doc('teacherDirectory/teacherOne').update({status:'revoked'});
  denied(await pilot.listPilotItems(req('teacherOne')),'teacher-access-required');counts.revocationDenials++;
  assert.equal((await db.collection(COLLECTION).get()).size,4);
  // Browser rules deny client direct reads/writes, including teacher and admin.
  for(const [name,clientDb] of [
   ['anonymous',rulesEnv.unauthenticatedContext().firestore()],
   ['teacherOne',rulesEnv.authenticatedContext('teacherOne',{teacher:true,email_verified:true}).firestore()],
   ['studentA',rulesEnv.authenticatedContext('studentA',{email_verified:true}).firestore()],
   ['rootAdmin',rulesEnv.authenticatedContext('rootAdmin',{admin:true,email_verified:true}).firestore()]
  ]){
   for(const p of [COLLECTION,AUDIT]){
    const ref=doc(clientDb,p,'fakeSyntheticDoc');
    await assertFails(getDoc(ref));counts.firestoreBrowserDenials++;
    await assertFails(setDoc(ref,{teacherApproved:true,answerKey:'INJECTED'}));
    counts.firestoreBrowserDenials++;
   }
  }
  assert.equal((await db.collection(AUDIT).get()).size,4);
  assert.deepEqual(Object.fromEntries(watched.map(p=>[p,digest(p)])),before);
  const summary={version:'V155',mode:'LOCAL_EMULATOR_ONLY_NO_ENDPOINT',
   syntheticReviewItems:4,originalQuestions:[10,15,62,76],
   recommendationsInEmulator:4,realTeacherAcademicSignoffs:0,
   realUnit7ScoredReleaseCount:0,...counts};
  const dir=path.join(ROOT,'qa-artifacts/grade11-v155-unit7-local-teacher-review');
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify(summary,null,2)+'\n');
  console.log('V155 PASS: four local teacher advisory recommendations; Auth/Firestore role revocation, audit/idempotency, client deny-all, no scored release');
 }finally{
  if(rulesEnv)await rulesEnv.cleanup();
  for(const app of browserApps)await browserDelete(app).catch(()=>{});
  await adminDelete(admin).catch(()=>{});
 }
}
main().catch(e=>{console.error('V155 TEST FAILED',e.stack||e);process.exitCode=1});
