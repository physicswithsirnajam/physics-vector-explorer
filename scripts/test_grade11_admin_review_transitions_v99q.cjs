#!/usr/bin/env node
'use strict';
/**
 * V99-Q: local demo-only Firebase Auth + Firestore Admin transactions.
 * Auth tokens are issued by the LOCAL Firebase Emulator; no production
 * credentials, real accounts, published rules or live report changes.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {initializeApp:initializeAdmin,deleteApp:deleteAdmin}=
 require('firebase-admin/app');
const {getAuth:adminAuthFor}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const {initializeApp:initializeClient,deleteApp:deleteClient}=
 require('firebase/app');
const {getAuth,connectAuthEmulator,signInWithEmailAndPassword,signOut}=
 require('firebase/auth');
const {initializeTestEnvironment,assertFails}=
 require('@firebase/rules-unit-testing');
const {doc,collection,query,limit,getDoc,getDocs,setDoc,updateDoc}=
 require('firebase/firestore');
const {createLocalAdminReviewTransitions,AUDIT}=
 require('../server/local-admin-review-transitions-v99q.cjs');
const {createLocalAdminReviewReader}=
 require('../server/local-admin-review-reader-v99p.cjs');
const {PROJECT,HOST:FS_HOST,REPORTS,RATES}=
 require('../server/firebase-review-emulator-v99f.cjs');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');

const AUTH_HOST='127.0.0.1:9099',PASSWORD='V99Q-Synthetic-Only-Password123!';
const artifact=path.resolve(__dirname,'../qa-artifacts/admin-review-transitions-v99q');
const cases=[];
function pass(label){cases.push(label);console.log('V99-Q PASS:',label);}
function denied(value,code){assert.deepEqual(value,{ok:false,code});}
function reportId(n){return 'mr_'+n.toString(16).padStart(48,'0');}
function req(token,id,action,more={}){return {authorization:'Bearer '+token,reportId:id,action,...more};}
function sourceRecord(q,who='synthetic-learner'){
 return {
  schemaVersion:1,kind:'grade11-mcq-review',origin:'practice-engine',
  grade:11,unit:q.unit,questionId:q.id,
  sourceQuestionNumber:q.sourceQuestionNumber,bankVersion:q.bankVersion,
  displayedBankVersion:q.bankVersion,
  category:'incorrect-key',
  note:'Synthetic source key concern; actual correct answer not included.',
  ownerUid:who,status:'new',createdAtIso:'2026-11-22T16:00:00.000Z'
 };
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
 assert.ok(!process.env.GOOGLE_APPLICATION_CREDENTIALS);
 assert.equal(catalog.total,2250);
 fs.mkdirSync(artifact,{recursive:true});
 const app=initializeAdmin({projectId:PROJECT},'v99q-local-admin');
 const client=initializeClient({
  apiKey:'v99q-demo-only',projectId:PROJECT,
  authDomain:PROJECT+'.firebaseapp.com'
 },'v99q-local-browser');
 let env;
 try{
  const db=getFirestore(app),adminAuth=adminAuthFor(app);
  const browserAuth=getAuth(client);
  connectAuthEmulator(browserAuth,'http://'+AUTH_HOST,{disableWarnings:true});
  const users={};
  for(const [key,emailVerified,claims] of [
   ['owner',true,{admin:true}],['otherAdmin',true,{admin:true}],
   ['teacher',true,{role:'teacher',isTeacher:true}],
   ['student',true,{}],['unverifiedAdmin',false,{admin:true}]
  ]){
   const email='v99q-'+key.toLowerCase()+'@example.test';
   const account=await adminAuth.createUser({email,password:PASSWORD,emailVerified});
   if(Object.keys(claims).length)
    await adminAuth.setCustomUserClaims(account.uid,claims);
   const signed=await signInWithEmailAndPassword(browserAuth,email,PASSWORD);
   users[key]={uid:account.uid,token:await signed.user.getIdToken(true)};
  }
  const q1=await catalog.lookup(catalog.ids()[0]);
  const q3=await catalog.lookup(catalog.ids().find(id=>id.startsWith('g11-u03-master-')));
  const q5=await catalog.lookup(catalog.ids().find(id=>id.startsWith('g11-u05-master-')));
  assert.ok(q1&&q3&&q5);
  const ids={first:reportId(1),second:reportId(2),concurrent:reportId(3),corrupt:reportId(4)};
  await db.collection(REPORTS).doc(ids.first).set(sourceRecord(q1));
  await db.collection(REPORTS).doc(ids.second).set(sourceRecord(q5));
  await db.collection(REPORTS).doc(ids.concurrent).set(sourceRecord(q3));
  await db.collection(REPORTS).doc(ids.corrupt).set({
   ...sourceRecord(q1),bankVersion:'untrusted-bank-version'
  });
  const clock={time:Date.parse('2026-11-22T18:00:00.000Z')};
  const allowed=[users.owner.uid,users.unverifiedAdmin.uid];
  let enabled=false;
  const create=(overrides={})=>createLocalAdminReviewTransitions({
   firestore:db,adminAuth,allowedAdminUids:allowed,
   isTriageEnabled:()=>enabled,now:()=>clock.time,...overrides
  });
  const update=create(),originalAllowlistCount=allowed.length;
  allowed.push(users.otherAdmin.uid);
  assert.equal(originalAllowlistCount,2);

  denied(await update(req(users.owner.token,ids.first,'start-review')),
   'temporarily-unavailable');
  denied(await create({isTriageEnabled:()=>false})(
   req(users.owner.token,ids.first,'start-review')),'temporarily-unavailable');
  assert.equal((await db.collection(AUDIT).get()).size,0);
  assert.equal((await db.collection(REPORTS).doc(ids.first).get()).data().status,'new');
  pass('review transitions default OFF and make no report/audit writes');

  enabled=true;
  for(const [who,code] of [
   ['student','admin-access-required'],
   ['teacher','admin-access-required'],
   ['otherAdmin','admin-access-required'],
   ['unverifiedAdmin','verified-email-required']
  ])denied(await update(req(users[who].token,ids.first,'start-review')),code);
  denied(await update(req(users.owner.token+'.forged',ids.first,'start-review')),
   'authentication-required');
  denied(await update({authorization:'Basic '+users.owner.token,
   reportId:ids.first,action:'start-review'}),'authentication-required');
  denied(await update({authorization:'Bearer '+users.owner.token,
   reportId:ids.first,action:'start-review',admin:true}),'invalid-request');
  denied(await update(req(users.owner.token,ids.first,'start-review',{
   reviewerUid:users.owner.uid
  })),'invalid-request');
  denied(await update(req(users.owner.token,ids.first,'resolved')),
   'invalid-request');
  denied(await update(req(users.owner.token,'not-a-report','start-review')),
   'invalid-request');
  pass('real local Auth token, verified email, Admin custom claim AND immutable UID allowlist block unauthorized triage');

  denied(await update(req(users.owner.token,ids.first,'resolve')),
   'invalid-transition');
  denied(await update(req(users.owner.token,reportId(555),'start-review')),
   'not-found');
  denied(await update(req(users.owner.token,ids.corrupt,'start-review')),
   'temporarily-unavailable');
  assert.equal((await db.collection(AUDIT).get()).size,0);
  pass('illegal new-to-resolved jump, missing report and corrupted source metadata fail without audit writes');
  // The earlier V99-P reader intentionally rejects an entire page if ANY
  // selected report is corrupted. Remove this negative-only emulator fixture
  // before verifying that healthy status updates remain visible to that reader.
  // This is synthetic test cleanup, NOT a production data deletion workflow.
  await db.collection(REPORTS).doc(ids.corrupt).delete();

  const started=await update(req(users.owner.token,ids.first,'start-review'));
  assert.deepEqual(started,{
   ok:true,reportId:ids.first,status:'in-review',alreadyApplied:false
  });
  const stored=(await db.collection(REPORTS).doc(ids.first).get()).data();
  assert.equal(stored.status,'in-review');
  assert.equal(stored.reviewUpdatedAtIso,'2026-11-22T18:00:00.000Z');
  assert.equal(stored.questionId,q1.id);
  assert.equal(stored.bankVersion,q1.bankVersion);
  assert.equal(stored.ownerUid,'synthetic-learner');
  assert.equal(stored.note,sourceRecord(q1).note);
  assert.equal((await db.collection(AUDIT).get()).size,1);
  const firstAudit=(await db.collection(AUDIT).get()).docs[0].data();
  assert.equal(firstAudit.reviewerUid,users.owner.uid);
  assert.equal(firstAudit.action,'start-review');
  assert.equal(firstAudit.fromStatus,'new');
  assert.equal(firstAudit.toStatus,'in-review');
  for(const forbidden of ['ownerUid','note','email','score','correctOptionId'])
   assert.equal(firstAudit[forbidden],undefined);
  assert.ok(!JSON.stringify(started).includes(users.owner.uid));
  pass('real Firestore transaction atomically moves new to in-review and creates one server-private audit event');

  const repeat=await update(req(users.owner.token,ids.first,'start-review'));
  assert.deepEqual(repeat,{
   ok:true,reportId:ids.first,status:'in-review',alreadyApplied:true
  });
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('identical repeated triage command remains idempotent and does not duplicate audit records');

  const reader=createLocalAdminReviewReader({
   firestore:db,adminAuth,allowedAdminUids:[users.owner.uid],
   isReviewReaderEnabled:()=>true
  });
  const listing=await reader({authorization:'Bearer '+users.owner.token,limit:10});
  assert.equal(listing.ok,true);
  const entry=listing.reports.find(row=>row.reportId===ids.first);
  assert.ok(entry);assert.equal(entry.status,'in-review');
  assert.equal(entry.questionId,q1.id);
  assert.equal(entry.bankVersion,q1.bankVersion);
  assert.ok(!Object.hasOwn(entry,'reviewerUid'));
  pass('existing V99-P read-only administrator queue still displays updated status without private audit fields');

  clock.time+=60_000;
  const resolved=await update(req(users.owner.token,ids.first,'resolve'));
  assert.deepEqual(resolved,{
   ok:true,reportId:ids.first,status:'resolved',alreadyApplied:false
  });
  assert.equal((await db.collection(REPORTS).doc(ids.first).get()).data().status,'resolved');
  assert.equal((await db.collection(AUDIT).get()).size,2);
  const doneAgain=await update(req(users.owner.token,ids.first,'resolve'));
  assert.equal(doneAgain.alreadyApplied,true);
  assert.equal((await db.collection(AUDIT).get()).size,2);
  denied(await update(req(users.owner.token,ids.first,'start-review')),
   'invalid-transition');
  pass('in-review-to-resolved committed with private audit; repeat is safe and reopen is forbidden');

  // Concurrent same command must converge on exactly one status change/audit.
  clock.time+=60_000;
  const concurrent=await Promise.all(Array.from({length:3},()=>
   update(req(users.owner.token,ids.concurrent,'start-review'))));
  assert.equal(concurrent.length,3);
  assert.equal(concurrent.filter(x=>x.ok&&x.alreadyApplied===false).length,1);
  assert.equal(concurrent.filter(x=>x.ok&&x.alreadyApplied===true).length,2);
  assert.equal((await db.collection(REPORTS).doc(ids.concurrent).get()).data().status,'in-review');
  assert.equal((await db.collection(AUDIT).get()).size,3);
  pass('three concurrent real Firestore transitions settle on one write and one audit event');

  const auditBefore=(await db.collection(AUDIT).get()).size;
  const reportBefore=(await db.collection(REPORTS).doc(ids.second).get()).data().status;
  enabled=false;
  denied(await update(req(users.owner.token,ids.second,'start-review')),
   'temporarily-unavailable');
  const failing=create({isTriageEnabled:()=>{throw Error('PRIVATE FEATURE FLAG ERROR');}});
  denied(await failing(req(users.owner.token,ids.second,'start-review')),
   'temporarily-unavailable');
  const invalidFlag=create({isTriageEnabled:()=>undefined});
  denied(await invalidFlag(req(users.owner.token,ids.second,'start-review')),
   'temporarily-unavailable');
  assert.equal((await db.collection(AUDIT).get()).size,auditBefore);
  assert.equal((await db.collection(REPORTS).doc(ids.second).get()).data().status,reportBefore);
  pass('switch OFF, throwing switch and unavailable flags safely stop new transitions');

  enabled=true;
  const changeDuringVerify=create({
   adminAuth:{
    app,verifyIdToken:async(token,revoked)=>{
     const identity=await adminAuth.verifyIdToken(token,revoked);
     enabled=false;return identity;
    }
   }
  });
  denied(await changeDuringVerify(req(users.owner.token,ids.second,'start-review')),
   'temporarily-unavailable');
  assert.equal((await db.collection(AUDIT).get()).size,auditBefore);
  pass('mid-auth shutdown stops triage before any Firestore transaction begins');

  enabled=true;
  const brokenDb={
   projectId:PROJECT,collection:name=>db.collection(name),doc:name=>db.doc(name),
   runTransaction:async()=>{throw Error('PRIVATE DATABASE PATH /secret-owner-record');}
  };
  denied(await create({firestore:brokenDb})(
   req(users.owner.token,ids.second,'start-review')),'temporarily-unavailable');
  assert.equal((await db.collection(AUDIT).get()).size,auditBefore);
  pass('database failures produce only fixed safe codes and never forge success or audit writes');

  const oldProject=process.env.GCLOUD_PROJECT;
  try{
   process.env.GCLOUD_PROJECT='real-production-firebase';
   assert.throws(()=>create(),/refuses non-demo/);
  }finally{process.env.GCLOUD_PROJECT=oldProject;}
  const oldHost=process.env.FIREBASE_AUTH_EMULATOR_HOST;
  try{
   delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
   assert.throws(()=>create(),/refuses non-demo/);
  }finally{process.env.FIREBASE_AUTH_EMULATOR_HOST=oldHost;}
  assert.throws(()=>create({allowedAdminUids:[]}),TypeError);
  assert.throws(()=>create({isTriageEnabled:true}),TypeError);
  assert.throws(()=>create({adminAuth:{app:{options:{projectId:'wrong'}},
   verifyIdToken:async()=>null}}),/Matching local/);
  pass('cannot construct triage with production Firebase, missing emulator, empty allowlist or client-like switch');

  const rules=fs.readFileSync(path.resolve(__dirname,
   '../security-proposals/v99q/triage-server-only-isolated.rules'),'utf8');
  assert.match(rules,/ISOLATED AND UNDEPLOYED/);
  env=await initializeTestEnvironment({
   projectId:PROJECT,firestore:{host:'127.0.0.1',port:8089,rules}
  });
  for(const [who,claims] of [
   ['owner',{admin:true,email_verified:true}],
   ['otherAdmin',{admin:true,email_verified:true}],
   ['teacher',{role:'teacher',isTeacher:true,email_verified:true}],
   ['student',{email_verified:true}]
  ]){
   const browser=env.authenticatedContext(users[who].uid,claims).firestore();
   for(const collectionName of [REPORTS,AUDIT,RATES]){
    await assertFails(getDocs(query(collection(browser,collectionName),limit(10))));
    await assertFails(getDoc(doc(browser,collectionName,
     collectionName===REPORTS?ids.first:'synthetic-audit-id')));
    await assertFails(setDoc(doc(browser,collectionName,'forged-'+who),{
     ownerUid:users[who].uid,status:'resolved'
    }));
   }
   await assertFails(updateDoc(doc(browser,REPORTS,ids.first),{status:'resolved'}));
  }
  assert.equal((await db.collection(AUDIT).get()).size,3);
  assert.equal((await db.collection(RATES).get()).size,0);
  pass('isolated Firestore rules deny all browser report/audit/rate access, even to admin-claimed browser sessions');

  assert.equal(fs.existsSync(path.resolve(__dirname,'../firebase.json')),false,
   'No production Firebase mapping must be added');
  const summary={
   version:'V99-Q',environment:'LOCAL FIREBASE AUTH AND FIRESTORE EMULATORS',
   originalPublicQuestionReferences:2250,
   seededSyntheticReportDocuments:4,remainingSyntheticReports:3,
   privateAuditEvents:3,
   realLocalAuthVerification:true,productionSignedTokenProof:false,
   realAtomicFirestoreReportAndAuditTransitions:true,
   trustedAdminUidAllowlistRequired:true,triageDefaultOff:true,
   clientReportAndAuditAccessDenied:true,
   existingMCQBankModified:false,liveFirebaseUsed:false,
   realTeacherInbox:false,publicEndpoint:false,
   passedCases:cases
  };
  fs.writeFileSync(path.join(artifact,'summary.json'),
   JSON.stringify(summary,null,2)+'\n');
  console.log('V99-Q FINISHED: '+cases.length+
   ' quality groups passed; atomic local-only admin triage and private audit; NO DEPLOYMENT.');
  await signOut(browserAuth);
 }finally{
  if(env)await env.cleanup();
  await deleteClient(client);
  await deleteAdmin(app);
 }
}
main().catch(e=>{
 console.error('V99-Q FAILED:',String(e.stack||e).slice(0,2600));
 process.exitCode=1;
});
