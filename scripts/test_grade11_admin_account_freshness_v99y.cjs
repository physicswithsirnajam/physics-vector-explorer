#!/usr/bin/env node
'use strict';
/**
 * V99-Y: Real LOCAL Auth and Firestore emulators; no production Auth accounts,
 * custom claims, student records, service credentials or App Check provider.
 * Shows a stale admin:true JWT is rejected after CURRENT user record changes.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {initializeApp:initializeAdmin,deleteApp:deleteAdmin}=require('firebase-admin/app');
const {getAuth:getServerAuth}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const {initializeApp:initializeBrowser,deleteApp:deleteBrowser}=require('firebase/app');
const {getAuth,connectAuthEmulator,signInWithEmailAndPassword,signOut}=
 require('firebase/auth');
const {createLocalAdminReviewReader}=
 require('../server/local-admin-review-reader-v99p.cjs');
const {createLocalAdminReviewTransitions,AUDIT}=
 require('../server/local-admin-review-transitions-v99q.cjs');
const {createLocalAdminAuditHistoryReader}=
 require('../server/local-admin-audit-history-v99r.cjs');
const {checkFreshLocalAdmin}=
 require('../server/local-admin-account-freshness-v99y.cjs');
const {PROJECT,HOST:FS_HOST,REPORTS,RATES}=
 require('../server/firebase-review-emulator-v99f.cjs');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');
const AUTH_HOST='127.0.0.1:9099';
const PASSWORD='V99Y-SYNTHETIC-ONLY-No-Prod-Accounts123!';
const ID='mr_'+String(27).padStart(48,'0');
const EVIDENCE=path.resolve(__dirname,'../qa-artifacts/admin-freshness-v99y');
const groups=[];
function pass(message){groups.push(message);console.log('V99-Y PASS:',message);}
function mustDeny(result,code){
 assert.deepEqual(result,{ok:false,code});
}
function report(q){return {
 schemaVersion:1,kind:'grade11-mcq-review',origin:'practice-engine',grade:11,
 unit:q.unit,questionId:q.id,sourceQuestionNumber:q.sourceQuestionNumber,
 bankVersion:q.bankVersion,displayedBankVersion:q.bankVersion,
 category:'incorrect-key',note:'SYNTHETIC: test report for permission revocation.',
 ownerUid:'synthetic-student',status:'new',
 createdAtIso:'2026-11-22T16:00:00.000Z'
};}
function request(token){return {authorization:'Bearer '+token};}
function historyRequest(token){return {...request(token),reportId:ID};}
function triageRequest(token,action){return {...historyRequest(token),action};}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
 assert.equal(Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS),false);
 assert.equal(catalog.total,2250);
 const app=initializeAdmin({projectId:PROJECT},'v99y-local-admin');
 const client=initializeBrowser({apiKey:'v99y-local-only',
  authDomain:PROJECT+'.firebaseapp.com',projectId:PROJECT},'v99y-local-browser');
 try{
  const db=getFirestore(app),auth=getServerAuth(app);
  const browser=getAuth(client);
  connectAuthEmulator(browser,'http://'+AUTH_HOST,{disableWarnings:true});
  const record=await auth.createUser({
   email:'v99y-admin@example.test',emailVerified:true,password:PASSWORD
  });
  await auth.setCustomUserClaims(record.uid,{admin:true});
  const signIn=await signInWithEmailAndPassword(browser,
   'v99y-admin@example.test',PASSWORD);
  const staleToken=await signIn.user.getIdToken(true);
  const originally=await auth.verifyIdToken(staleToken,true);
  assert.equal(originally.admin,true);
  assert.equal(originally.email_verified,true);
  const source=await catalog.lookup(catalog.ids()[0]);
  assert.ok(source?.publicPractice);
  await db.collection(REPORTS).doc(ID).set(report(source));
  const opts={firestore:db,adminAuth:auth,allowedAdminUids:[record.uid]};
  const reader=createLocalAdminReviewReader({...opts,isReviewReaderEnabled:()=>true});
  const triage=createLocalAdminReviewTransitions({
   ...opts,isTriageEnabled:()=>true,now:()=>Date.parse('2026-11-22T18:05:00.000Z')
  });
  const audit=createLocalAdminAuditHistoryReader({
   ...opts,isHistoryEnabled:()=>true
  });
  const listBefore=await reader(request(staleToken));
  assert.equal(listBefore.ok,true);
  const started=await triage(triageRequest(staleToken,'start-review'));
  assert.equal(started.ok,true);
  const historyBefore=await audit(historyRequest(staleToken));
  assert.equal(historyBefore.ok,true);
  assert.equal(historyBefore.events.length,1);
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('genuine local signed-in admin can read, begin triage, and inspect private audit with live verified account record');

  // JWT was issued BEFORE removing the custom claim. It still carries
  // admin:true until refreshed. Server getUser MUST reject current role loss.
  await auth.setCustomUserClaims(record.uid,{role:'teacher'});
  assert.equal((await auth.verifyIdToken(staleToken,true)).admin,true,
   'the old real JWT must retain its original claim in emulator rehearsal');
  assert.equal((await auth.getUser(record.uid)).customClaims.admin,undefined);
  mustDeny(await reader(request(staleToken)),'admin-access-required');
  mustDeny(await triage(triageRequest(staleToken,'resolve')),'admin-access-required');
  mustDeny(await audit(historyRequest(staleToken)),'admin-access-required');
  assert.equal((await db.collection(REPORTS).doc(ID).get()).data().status,
   'in-review');
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('revoked CURRENT admin claim immediately denies stale-JWT queue, write and audit; no Firestore mutation');

  await auth.setCustomUserClaims(record.uid,{admin:true});
  await auth.updateUser(record.uid,{emailVerified:false});
  assert.equal((await auth.verifyIdToken(staleToken,true)).email_verified,true,
   'previous JWT still contains old verified-email claim');
  mustDeny(await reader(request(staleToken)),'verified-email-required');
  mustDeny(await triage(triageRequest(staleToken,'resolve')),'verified-email-required');
  mustDeny(await audit(historyRequest(staleToken)),'verified-email-required');
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('CURRENT email-verification removal denies all three operations even with prior verified JWT');

  await auth.updateUser(record.uid,{emailVerified:true,disabled:true});
  for(const call of [
   ()=>reader(request(staleToken)),
   ()=>triage(triageRequest(staleToken,'resolve')),
   ()=>audit(historyRequest(staleToken))
  ]){
   const result=await call();
   assert.equal(result.ok,false,'disabled account MUST NOT access an admin operation');
   assert.ok(['authentication-required','temporarily-unavailable'].includes(result.code));
  }
  assert.equal((await db.collection(AUDIT).get()).size,1);
  pass('disabled administrator is denied all three operations, independently of existing JWT');

  // Restore, and check no permanent DoS or data corruption was introduced.
  await auth.updateUser(record.uid,{disabled:false});
  const user=await auth.getUser(record.uid);
  assert.equal(user.disabled,false);
  assert.equal(user.customClaims.admin,true);
  const refreshedToken=await signIn.user.getIdToken(true);
  assert.equal((await reader(request(refreshedToken))).ok,true);
  assert.equal((await audit(historyRequest(refreshedToken))).ok,true);
  const resolved=await triage(triageRequest(refreshedToken,'resolve'));
  assert.equal(resolved.ok,true);
  assert.equal((await db.collection(AUDIT).get()).size,2);
  pass('explicit permission and email restoration plus new token resumes exact two-audit workflow');

  const throwAuth={
   app,verifyIdToken:auth.verifyIdToken.bind(auth),
   getUser:async()=>{throw Error('PRIVATE BACKEND OUTAGE /admins/email@example.test');}
  };
  const wrongAuth={
   app,verifyIdToken:auth.verifyIdToken.bind(auth),
   getUser:async uid=>({...await auth.getUser(uid),uid:'different-admin'})
  };
  const missingMethod={app,verifyIdToken:auth.verifyIdToken.bind(auth)};
  for(const [fake,expected] of [
   [throwAuth,'temporarily-unavailable'],
   [wrongAuth,'temporarily-unavailable'],
   [missingMethod,'temporarily-unavailable']
  ]){
   const readerFake=createLocalAdminReviewReader({...opts,adminAuth:fake});
   const triageFake=createLocalAdminReviewTransitions({
    ...opts,adminAuth:fake,isTriageEnabled:()=>true,
    now:()=>Date.parse('2026-11-22T18:06:00.000Z')
   });
   const auditFake=createLocalAdminAuditHistoryReader({
    ...opts,adminAuth:fake,isHistoryEnabled:()=>true
   });
   mustDeny(await readerFake(request(refreshedToken)),expected);
   mustDeny(await triageFake(triageRequest(refreshedToken,'resolve')),expected);
   mustDeny(await auditFake(historyRequest(refreshedToken)),expected);
  }
  assert.equal((await db.collection(AUDIT).get()).size,2);
  assert.equal((await db.collection(RATES).get()).size,0);
  pass('missing/unavailable/mismatched fresh Admin account lookup fails closed without leak or new report/audit writes');

  const direct=await checkFreshLocalAdmin({
   adminAuth:auth,verified:await auth.verifyIdToken(refreshedToken,true),
   allowedAdminUids:new Set([record.uid])
  });
  assert.equal(direct,null);
  const previous=process.env.GCLOUD_PROJECT;
  try{
   process.env.GCLOUD_PROJECT='real-firebase-project';
   assert.equal(await checkFreshLocalAdmin({
    adminAuth:auth,verified:originally,allowedAdminUids:new Set([record.uid])
   }),'temporarily-unavailable');
  }finally{process.env.GCLOUD_PROJECT=previous;}
  assert.equal(await checkFreshLocalAdmin({
   adminAuth:auth,verified:originally,allowedAdminUids:new Set([])
  }),'admin-access-required');
  pass('fresh-account module refuses production project and non-allowlisted account, keeps no cache');

  fs.mkdirSync(EVIDENCE,{recursive:true});
  fs.writeFileSync(path.join(EVIDENCE,'summary.json'),JSON.stringify({
   version:'V99-Y',environment:'LOCAL Firebase Auth and Firestore emulators',
   sourceQuestionReferences:2250,syntheticReportDocuments:1,
   staleJwtRetainedOldAdminClaim:true,
   staleJwtRetainedOldVerifiedEmail:true,
   currentAccountRoleRevocationDenied:true,
   currentEmailVerificationRemovalDenied:true,
   currentAccountDisabledDenied:true,
   privateReaderTriageHistoryAllCovered:true,
   productionUserAccountsRead:false,productionFirebaseUsed:false,
   currentProductionCustomClaimsConfigured:false,
   positiveProductionAppCheckProof:false,
   deployedEndpoint:false,studentReportSendEnabled:false,
   inFlightRevocationCancellationGuaranteed:false,
   cases:groups
  },null,2)+'\n');
  console.log('V99-Y FINISHED: '+groups.length+
   ' groups passed; true Auth Emulator stale token, current role/email/disabled denials; NO DEPLOYMENT.');
  await signOut(browser);
 }finally{
  await deleteBrowser(client);
  await deleteAdmin(app);
 }
}
main().catch(e=>{
 console.error('V99-Y FAILED: safe local authorization test did not satisfy a regression assertion.');
 process.exitCode=1;
});
