#!/usr/bin/env node
'use strict';
/**
 * V99-R end-to-end audit history via real LOCAL Auth + Firestore emulators.
 *
 * All users and reports are synthetic. No App Check token, public endpoint,
 * production credentials, actual accounts, UI or published rules involved.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {initializeApp:adminApp,deleteApp:deleteAdmin}=
 require('firebase-admin/app');
const {getAuth:adminAuthFor}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const {initializeApp:clientApp,deleteApp:deleteClient}=
 require('firebase/app');
const {getAuth,connectAuthEmulator,signInWithEmailAndPassword,signOut}=
 require('firebase/auth');
const {initializeTestEnvironment,assertFails}=
 require('@firebase/rules-unit-testing');
const {getDoc,getDocs,doc,collection,query,limit,setDoc}=
 require('firebase/firestore');
const {createLocalAdminAuditHistoryReader}=
 require('../server/local-admin-audit-history-v99r.cjs');
const {createLocalAdminReviewTransitions,AUDIT}=
 require('../server/local-admin-review-transitions-v99q.cjs');
const {PROJECT,HOST:FS_HOST,REPORTS,RATES}=
 require('../server/firebase-review-emulator-v99f.cjs');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');

const AUTH_HOST='127.0.0.1:9099',PASSWORD='SyntheticOnly-AdminHistory-123!';
const evidence=path.resolve(__dirname,'../qa-artifacts/admin-audit-history-v99r');
const passed=[];
function pass(label){passed.push(label);console.log('V99-R PASS:',label);}
function denial(result,code){assert.deepEqual(result,{ok:false,code});}
function reportId(n){return 'mr_'+n.toString(16).padStart(48,'0');}
function command(t,id,action){return {authorization:'Bearer '+t,reportId:id,action};}
function request(t,id){return {authorization:'Bearer '+t,reportId:id};}
function report(q){
 return {
  schemaVersion:1,kind:'grade11-mcq-review',grade:11,
  origin:'practice-engine',unit:q.unit,questionId:q.id,
  sourceQuestionNumber:q.sourceQuestionNumber,bankVersion:q.bankVersion,
  displayedBankVersion:q.bankVersion,category:'incorrect-key',
  note:'Synthetic source review. No actual student data.',
  ownerUid:'synthetic-student-report-owner',
  status:'new',createdAtIso:'2026-11-22T16:00:00.000Z',
  email:'never-expose-this@example.test',score:97,
  correctOptionId:'PRIVATE-ANSWER'
 };
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
 assert.ok(!process.env.GOOGLE_APPLICATION_CREDENTIALS);
 assert.equal(catalog.total,2250);
 assert.equal(catalog.ids().length,2250);
 fs.mkdirSync(evidence,{recursive:true});
 const admin=adminApp({projectId:PROJECT},'v99r-admin-local-only');
 const client=clientApp({
  apiKey:'demo-v99r-only',projectId:PROJECT,
  authDomain:PROJECT+'.firebaseapp.com'
 },'v99r-client-local-only');
 let rulesEnv;
 try{
  const db=getFirestore(admin),auth=adminAuthFor(admin);
  const clientAuth=getAuth(client);
  connectAuthEmulator(clientAuth,'http://'+AUTH_HOST,{disableWarnings:true});
  const users={};
  for(const [name,verified,claims] of [
   ['owner',true,{admin:true}],
   ['notAllowedAdmin',true,{admin:true}],
   ['teacher',true,{role:'teacher',isTeacher:true}],
   ['student',true,{}],
   ['unverifiedAdmin',false,{admin:true}]
  ]){
   const email='v99r-'+name.toLowerCase()+'@example.test';
   const created=await auth.createUser({email,password:PASSWORD,emailVerified:verified});
   if(Object.keys(claims).length)
    await auth.setCustomUserClaims(created.uid,claims);
   const signed=await signInWithEmailAndPassword(clientAuth,email,PASSWORD);
   users[name]={uid:created.uid,token:await signed.user.getIdToken(true)};
  }
  const adminClaim=await auth.verifyIdToken(users.owner.token,true);
  assert.equal(adminClaim.admin,true);
  assert.equal(adminClaim.email_verified,true);
  const q1=await catalog.lookup(catalog.ids()[0]);
  const q3=await catalog.lookup(catalog.ids().find(id=>id.startsWith('g11-u03-master-')));
  const q5=await catalog.lookup(catalog.ids().find(id=>id.startsWith('g11-u05-master-')));
  assert.ok(q1&&q3&&q5);
  const ids={first:reportId(1),second:reportId(2),third:reportId(3)};
  await db.collection(REPORTS).doc(ids.first).set(report(q1));
  await db.collection(REPORTS).doc(ids.second).set(report(q3));
  await db.collection(REPORTS).doc(ids.third).set(report(q5));
  const clock={ms:Date.parse('2026-11-22T18:00:00.000Z')};
  const allowed=[users.owner.uid,users.unverifiedAdmin.uid];
  let historyEnabled=false,triageEnabled=false;
  const mkHistory=(overrides={})=>createLocalAdminAuditHistoryReader({
   firestore:db,adminAuth:auth,allowedAdminUids:allowed,
   isHistoryEnabled:()=>historyEnabled,...overrides
  });
  const history=mkHistory();
  const update=createLocalAdminReviewTransitions({
   firestore:db,adminAuth:auth,allowedAdminUids:[users.owner.uid],
   isTriageEnabled:()=>triageEnabled,now:()=>clock.ms
  });
  allowed.push(users.notAllowedAdmin.uid);
  // Constructor snapshots allowlist and can never be extended by caller mutation.

  denial(await history(request(users.owner.token,ids.first)),'temporarily-unavailable');
  denial(await mkHistory({isHistoryEnabled:()=>false})(
   request(users.owner.token,ids.first)),'temporarily-unavailable');
  assert.equal((await db.collection(AUDIT).get()).size,0);
  pass('server-only audit viewer is OFF by default; no report/audit writes or exposed events');

  historyEnabled=true;
  for(const [who,code] of [
   ['student','admin-access-required'],
   ['teacher','admin-access-required'],
   ['notAllowedAdmin','admin-access-required'],
   ['unverifiedAdmin','verified-email-required']
  ])denial(await history(request(users[who].token,ids.first)),code);
  denial(await history(request(users.owner.token+'.corrupted',ids.first)),
   'authentication-required');
  denial(await history({authorization:'Basic '+users.owner.token,
   reportId:ids.first}),'authentication-required');
  denial(await history({authorization:123,reportId:ids.first}),
   'authentication-required');
  denial(await history({authorization:'Bearer '+users.owner.token,
   reportId:ids.first,admin:true}),'invalid-request');
  denial(await history({authorization:'Bearer '+users.owner.token,
   reportId:ids.first,reviewerUid:users.owner.uid}),'invalid-request');
  denial(await history({authorization:'Bearer '+users.owner.token,
   reportId:'../../mcqReviewAdminAudit'}),'invalid-request');
  denial(await history({reportId:ids.first}),'invalid-request');
  pass('actual local Auth Emulator tokens require verified email, Admin claim AND independent immutable UID allowlist');

  denial(await history(request(users.owner.token,reportId(555))),'not-found');
  const fresh=await history(request(users.owner.token,ids.first));
  assert.deepEqual(fresh,{ok:true,reportId:ids.first,questionId:q1.id,
   status:'new',events:[]});
  assert.equal((await db.collection(AUDIT).get()).size,0);
  pass('new approved source question returns empty immutable audit history without fabricating review events');

  triageEnabled=true;
  const started=await update(command(users.owner.token,ids.first,'start-review'));
  assert.equal(started.ok,true);
  assert.equal(started.alreadyApplied,false);
  assert.equal((await db.collection(AUDIT).get()).size,1);
  const inReview=await history(request(users.owner.token,ids.first));
  assert.deepEqual(inReview,{
   ok:true,reportId:ids.first,questionId:q1.id,status:'in-review',
   events:[{
    action:'start-review',fromStatus:'new',toStatus:'in-review',
    reviewedAtIso:'2026-11-22T18:00:00.000Z'
   }]
  });
  assert.ok(!JSON.stringify(inReview).includes(users.owner.uid));
  assert.ok(!JSON.stringify(inReview).includes('never-expose-this'));
  assert.ok(!JSON.stringify(inReview).includes('PRIVATE-ANSWER'));
  assert.ok(!JSON.stringify(inReview).includes('synthetic-student-report-owner'));
  pass('real local Firestore transition immediately produces one source-validated, private-field-redacted audit event');

  clock.ms+=60_000;
  const resolved=await update(command(users.owner.token,ids.first,'resolve'));
  assert.equal(resolved.ok,true);
  assert.equal((await db.collection(AUDIT).get()).size,2);
  const done=await history(request(users.owner.token,ids.first));
  assert.deepEqual(done,{
   ok:true,reportId:ids.first,questionId:q1.id,status:'resolved',
   events:[
    {action:'start-review',fromStatus:'new',toStatus:'in-review',
     reviewedAtIso:'2026-11-22T18:00:00.000Z'},
    {action:'resolve',fromStatus:'in-review',toStatus:'resolved',
     reviewedAtIso:'2026-11-22T18:01:00.000Z'}
   ]
  });
  const dupe=await update(command(users.owner.token,ids.first,'resolve'));
  assert.equal(dupe.alreadyApplied,true);
  assert.deepEqual(await history(request(users.owner.token,ids.first)),done);
  assert.equal((await db.collection(AUDIT).get()).size,2);
  pass('resolved history matches BOTH real Admin SDK audit writes in timestamp order; duplicate actions do not add events');

  const firstAuditSnapshot=(await db.collection(AUDIT).get()).docs.find(x=>
   x.data().toStatus==='in-review');
  const secondAuditSnapshot=(await db.collection(AUDIT).get()).docs.find(x=>
   x.data().toStatus==='resolved');
  assert.ok(firstAuditSnapshot&&secondAuditSnapshot);
  const aRef=db.collection(AUDIT).doc(firstAuditSnapshot.id);
  const bRef=db.collection(AUDIT).doc(secondAuditSnapshot.id);
  const origA=firstAuditSnapshot.data(),origB=secondAuditSnapshot.data();
  assert.equal(origA.reviewerUid,users.owner.uid);
  assert.equal(origB.reviewerUid,users.owner.uid);
  await aRef.update({action:'forged-review'});
  denial(await history(request(users.owner.token,ids.first)),
   'temporarily-unavailable');
  await aRef.set(origA);
  await bRef.delete();
  denial(await history(request(users.owner.token,ids.first)),
   'temporarily-unavailable');
  await bRef.set(origB);
  await bRef.update({reviewedAtIso:'2026-11-22T17:59:00.000Z'});
  await db.collection(REPORTS).doc(ids.first).update({
   reviewUpdatedAtIso:'2026-11-22T17:59:00.000Z'
  });
  denial(await history(request(users.owner.token,ids.first)),
   'temporarily-unavailable');
  await bRef.set(origB);
  await db.collection(REPORTS).doc(ids.first).update({
   reviewUpdatedAtIso:'2026-11-22T18:01:00.000Z'
  });
  await aRef.update({extraLeak:'secret-from-private-event'});
  denial(await history(request(users.owner.token,ids.first)),
   'temporarily-unavailable');
  await aRef.set(origA);
  assert.deepEqual(await history(request(users.owner.token,ids.first)),done);
  pass('forged, missing, out-of-order or unexpectedly expanded audit records fail closed; restored history remains consistent');

  await db.collection(REPORTS).doc(ids.second).update({status:'in-review'});
  denial(await history(request(users.owner.token,ids.second)),
   'temporarily-unavailable');
  await db.collection(REPORTS).doc(ids.second).update({status:'new'});
  await db.collection(REPORTS).doc(ids.third).update({
   bankVersion:'unapproved-source-version'
  });
  denial(await history(request(users.owner.token,ids.third)),
   'temporarily-unavailable');
  await db.collection(REPORTS).doc(ids.third).update({bankVersion:q5.bankVersion});
  pass('report status without matching audit and corrupted pinned MCQ metadata are rejected instead of inventing history');

  const beforeReports=(await db.collection(REPORTS).get()).size;
  const beforeAudit=(await db.collection(AUDIT).get()).size;
  const beforeRate=(await db.collection(RATES).get()).size;
  historyEnabled=false;
  denial(await history(request(users.owner.token,ids.first)),
   'temporarily-unavailable');
  const failing=mkHistory({isHistoryEnabled:()=>{throw Error('PRIVATE SETTINGS ERROR');}});
  denial(await failing(request(users.owner.token,ids.first)),
   'temporarily-unavailable');
  const unknown=mkHistory({isHistoryEnabled:async()=>undefined});
  denial(await unknown(request(users.owner.token,ids.first)),
   'temporarily-unavailable');
  assert.equal((await db.collection(REPORTS).get()).size,beforeReports);
  assert.equal((await db.collection(AUDIT).get()).size,beforeAudit);
  assert.equal((await db.collection(RATES).get()).size,beforeRate);
  pass('emergency OFF, throwing switch and unknown switch result deny audit history without modifying Firestore');

  historyEnabled=true;
  const originalProject=process.env.GCLOUD_PROJECT;
  try{
   process.env.GCLOUD_PROJECT='real-firebase-project';
   assert.throws(()=>mkHistory(),/refuses production/);
  }finally{process.env.GCLOUD_PROJECT=originalProject;}
  const originalAuthHost=process.env.FIREBASE_AUTH_EMULATOR_HOST;
  try{
   delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
   assert.throws(()=>mkHistory(),/refuses production/);
  }finally{process.env.FIREBASE_AUTH_EMULATOR_HOST=originalAuthHost;}
  assert.throws(()=>mkHistory({allowedAdminUids:[]}),TypeError);
  assert.throws(()=>mkHistory({allowedAdminUids:[users.owner.uid,users.owner.uid]}),TypeError);
  assert.throws(()=>mkHistory({isHistoryEnabled:true}),TypeError);
  assert.throws(()=>mkHistory({
   adminAuth:{app:{options:{projectId:'wrong-project'}},
    verifyIdToken:async()=>({})}
  }),/Matching local/);
  pass('reader rejects non-demo project, missing local emulator, missing/duplicate allowlist and untrusted switch types');

  const failingDb={
   projectId:PROJECT,doc:k=>db.doc(k),collection:k=>db.collection(k),
   runTransaction:async()=>{throw Error('PRIVATE DATABASE /students/secret@example.test');}
  };
  const failed=mkHistory({firestore:failingDb,isHistoryEnabled:()=>true});
  const error=await failed(request(users.owner.token,ids.first));
  denial(error,'temporarily-unavailable');
  assert.ok(!JSON.stringify(error).includes('secret@example.test'));
  pass('backend Firestore errors are redacted to fixed safe codes, never revealing paths or account data');

  const rules=fs.readFileSync(path.resolve(__dirname,
   '../security-proposals/v99q/triage-server-only-isolated.rules'),'utf8');
  assert.match(rules,/ISOLATED AND UNDEPLOYED/);
  rulesEnv=await initializeTestEnvironment({
   projectId:PROJECT,firestore:{host:'127.0.0.1',port:8089,rules}
  });
  for(const [who,claims] of [
   ['owner',{admin:true,email_verified:true}],
   ['notAllowedAdmin',{admin:true,email_verified:true}],
   ['teacher',{role:'teacher',email_verified:true}],
   ['student',{email_verified:true}]
  ]){
   const browser=rulesEnv.authenticatedContext(users[who].uid,claims).firestore();
   await assertFails(getDocs(query(collection(browser,AUDIT),limit(5))));
   await assertFails(getDoc(doc(browser,AUDIT,firstAuditSnapshot.id)));
   await assertFails(setDoc(doc(browser,AUDIT,'fake-'+who),{
    reviewerUid:users[who].uid,action:'resolve'
   }));
   await assertFails(getDoc(doc(browser,REPORTS,ids.first)));
   await assertFails(getDocs(query(collection(browser,RATES),limit(5))));
  }
  assert.equal((await db.collection(AUDIT).get()).size,2);
  pass('existing undeployed browser rules deny private audit/report/rate access even with admin claims');

  assert.equal(fs.existsSync(path.resolve(__dirname,'../firebase.json')),false);
  fs.writeFileSync(path.join(evidence,'summary.json'),
   JSON.stringify({
    version:'V99-R',mode:'LOCAL AUTH AND FIRESTORE EMULATORS ONLY',
    pinnedOriginalGrade11SourceReferences:2250,
    syntheticReportCount:3,realPrivateAuditEvents:2,
    realLocalAuthTokenVerification:true,productionSignedTokenProof:false,
    authorizedReadOnlyAdminHistory:true,defaultOff:true,
    boundedFixedAuditDocumentsPerCall:2,
    browserAuditAccessDeniedInIsolatedFixture:true,
    realProductionRulesInspected:false,productionDeployed:false,
    liveStudentReporting:false,teacherInboxDeployed:false,
    positiveFirebaseAppCheckVerified:false,
    passedCases:passed
   },null,2)+'\n');
  console.log('V99-R FINISHED: '+passed.length+
   ' quality groups, server-only read consistency and privacy checked. NO LIVE FIREBASE.');
  await signOut(clientAuth);
 }finally{
  if(rulesEnv)await rulesEnv.cleanup();
  await deleteClient(client);
  await deleteAdmin(admin);
 }
}
main().catch(e=>{
 console.error('V99-R FAILED:',String(e.stack||e).slice(0,2300));
 process.exitCode=1;
});
