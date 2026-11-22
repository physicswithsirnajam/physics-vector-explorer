#!/usr/bin/env node
'use strict';
/**
 * V99-P: LOCAL Auth + Firestore Emulator tests for read-only admin review.
 *
 * Only server-verifiable custom Admin claims AND a trusted explicit UID
 * allowlist permit bounded sanitized report reads. Even an Admin browser is
 * blocked by the isolated, server-only client rules fixture. All accounts
 * and records are synthetic and only exist in local demo emulators.
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
const {doc,collection,query,limit,getDoc,getDocs,setDoc}=
 require('firebase/firestore');
const {createLocalAdminReviewReader,MAX_PAGE,DEFAULT_PAGE}=
 require('../server/local-admin-review-reader-v99p.cjs');
const {PROJECT,HOST:FS_HOST,REPORTS,RATES}=
 require('../server/firebase-review-emulator-v99f.cjs');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');

const AUTH_HOST='127.0.0.1:9099';
const PASSWORD='Synthetic-Local-12345!';
const auditDir=path.resolve(__dirname,'../qa-artifacts/admin-review-reader-v99p');
const cases=[];
function pass(desc){cases.push(desc);console.log('V99-P PASS:',desc);}
function denied(result,code){assert.deepEqual(result,{ok:false,code});}
function req(token,extra={}){return {authorization:'Bearer '+token,...extra};}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
 assert.ok(!process.env.GOOGLE_APPLICATION_CREDENTIALS);
 assert.equal(catalog.total,2250);
 fs.mkdirSync(auditDir,{recursive:true});
 const admin=initializeAdmin({projectId:PROJECT},'v99p-review-reader-local-only');
 const client=initializeClient({
  apiKey:'demo-v99p-only',projectId:PROJECT,
  authDomain:PROJECT+'.firebaseapp.com'
 },'v99p-client-local-only');
 let testEnv;
 try{
  const db=getFirestore(admin),serverAuth=adminAuthFor(admin);
  const clientAuth=getAuth(client);
  connectAuthEmulator(clientAuth,'http://'+AUTH_HOST,{disableWarnings:true});

  const users={};
  for(const [key,verified,claims] of [
   ['owner',true,{admin:true}],
   ['otherAdmin',true,{admin:true}],
   ['teacher',true,{role:'teacher',isTeacher:true}],
   ['student',true,{}],
   ['unverifiedAdmin',false,{admin:true}]
  ]){
   const email='v99p-'+key.toLowerCase()+'@example.test';
   const u=await serverAuth.createUser({email,password:PASSWORD,emailVerified:verified});
   if(Object.keys(claims).length)await serverAuth.setCustomUserClaims(u.uid,claims);
   const signed=await signInWithEmailAndPassword(clientAuth,email,PASSWORD);
   users[key]={uid:u.uid,token:await signed.user.getIdToken(true)};
  }
  const ownerClaims=await serverAuth.verifyIdToken(users.owner.token,true);
  assert.equal(ownerClaims.uid,users.owner.uid);
  assert.equal(ownerClaims.admin,true);
  assert.equal(ownerClaims.email_verified,true);
  const permitted=[users.owner.uid,users.unverifiedAdmin.uid];
  const list=createLocalAdminReviewReader({
   firestore:db,adminAuth:serverAuth,allowedAdminUids:permitted
  });
  const noOtherAdmin=createLocalAdminReviewReader({
   firestore:db,adminAuth:serverAuth,allowedAdminUids:[users.owner.uid]
  });
  permitted.push(users.otherAdmin.uid); // cannot mutate reader's trust list

  let result=await list(req(users.student.token));
  denied(result,'admin-access-required');
  denied(await list(req(users.teacher.token)),'admin-access-required');
  denied(await list(req(users.otherAdmin.token)),'admin-access-required');
  denied(await noOtherAdmin(req(users.otherAdmin.token)),'admin-access-required');
  denied(await list(req(users.unverifiedAdmin.token)),'verified-email-required');
  denied(await list({authorization:'Bearer '+users.owner.token+'.tampered'}),
   'authentication-required');
  denied(await list({authorization:'Basic '+users.owner.token}),
   'authentication-required');
  denied(await list({authorization:123}),'authentication-required');
  denied(await list({}),'invalid-request');
  denied(await list({authorization:'Bearer '+users.owner.token,
   admin:true}),'invalid-request');
  denied(await list({authorization:'Bearer '+users.owner.token,
   callerIdentity:{uid:users.owner.uid,admin:true}}),'invalid-request');
  pass('real local Admin Auth tokens enforce verified-email, custom Admin claim AND immutable server UID allowlist before any listing');

  for(const badLimit of [-1,0,26,999,1.5,'25',null,NaN]){
   denied(await list(req(users.owner.token,{limit:badLimit})),'invalid-request');
  }
  assert.equal(MAX_PAGE,25);
  assert.equal(DEFAULT_PAGE,10);
  pass('server bounds read-only queue to 1–25 rows and rejects arbitrary filters and invalid page limits');

  const ids={};
  for(let unit=1;unit<=6;unit++){
   ids[unit]=[];
   for(const id of catalog.ids()){
    const item=await catalog.lookup(id);
    if(item.unit===unit&&ids[unit].length<5)ids[unit].push(item);
    if(ids[unit].length===5)break;
   }
   assert.equal(ids[unit].length,5);
  }
  for(let i=0;i<30;i++){
   const unit=i%6+1;
   const source=ids[unit][Math.floor(i/6)];
   const documentId='mr_'+i.toString(16).padStart(48,'0');
   const when=new Date(Date.parse('2026-11-22T15:00:00Z')+i*60_000).toISOString();
   await db.collection(REPORTS).doc(documentId).set({
    schemaVersion:1,kind:'grade11-mcq-review',
    origin:'practice-engine',grade:11,
    ownerUid:'synthetic-learner-'+i,
    unit:source.unit,questionId:source.id,
    sourceQuestionNumber:source.sourceQuestionNumber,
    bankVersion:source.bankVersion,
    displayedBankVersion:source.bankVersion,
    category:'missing-context',
    note:'Synthetic report number '+i+'; not an actual student.',
    status:'new',createdAtIso:when,
    email:'private-for-test@example.test',
    correctOptionId:'NEVER_EXPOSE',score:999,
    extraSecret:'SERVER-PRIVATE-EXTRA-FIELD'
   });
  }
  assert.equal((await db.collection(REPORTS).get()).size,30);
  const ratesBefore=await db.collection(RATES).get();
  assert.equal(ratesBefore.size,0);

  const ten=await list(req(users.owner.token));
  assert.equal(ten.ok,true);
  assert.equal(ten.count,10);
  assert.equal(ten.reports.length,10);
  assert.equal(ten.reports[0].note,'Synthetic report number 29; not an actual student.');
  const full=await list(req(users.owner.token,{limit:MAX_PAGE}));
  assert.equal(full.ok,true);
  assert.equal(full.count,25);
  assert.equal(full.reports.length,25);
  for(const row of full.reports){
   assert.deepEqual(Object.keys(row),[
    'reportId','unit','questionId','sourceQuestionNumber',
    'bankVersion','category','note','status','createdAtIso'
   ]);
   assert.ok(/^mr_[0-9a-f]{48}$/.test(row.reportId));
   assert.equal(row.status,'new');
   assert.equal(row.category,'missing-context');
   assert.ok(row.note.length<501);
   const authoritative=await catalog.lookup(row.questionId);
   assert.equal(row.unit,authoritative.unit);
   assert.equal(row.sourceQuestionNumber,authoritative.sourceQuestionNumber);
   assert.equal(row.bankVersion,authoritative.bankVersion);
   for(const forbidden of [
    'ownerUid','email','correctOptionId','score','extraSecret','admin',
    'displayedBankVersion','password'
   ])assert.equal(row[forbidden],undefined);
  }
  assert.ok(!JSON.stringify(full).includes('private-for-test@example.test'));
  assert.ok(!JSON.stringify(full).includes('SERVER-PRIVATE-EXTRA-FIELD'));
  assert.ok(!JSON.stringify(full).includes('NEVER_EXPOSE'));
  assert.ok(!JSON.stringify(full).includes(users.owner.token));
  assert.equal((await db.collection(REPORTS).get()).size,30);
  assert.equal((await db.collection(RATES).get()).size,0);
  pass('real Firestore Admin read returns maximum 25 latest verified public source records, redacting owner UID, scores, answers and private fields');
  pass('read-only Admin review never changes reports, quotas or status');

  const wrongProject=process.env.GCLOUD_PROJECT;
  try{
   process.env.GCLOUD_PROJECT='live-production-project';
   assert.throws(()=>createLocalAdminReviewReader({
    firestore:db,adminAuth:serverAuth,allowedAdminUids:[users.owner.uid]
   }),/refuses production projects/);
  }finally{process.env.GCLOUD_PROJECT=wrongProject;}
  const oldHost=process.env.FIREBASE_AUTH_EMULATOR_HOST;
  try{
   delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
   assert.throws(()=>createLocalAdminReviewReader({
    firestore:db,adminAuth:serverAuth,allowedAdminUids:[users.owner.uid]
   }),/refuses production projects/);
  }finally{process.env.FIREBASE_AUTH_EMULATOR_HOST=oldHost;}
  assert.throws(()=>createLocalAdminReviewReader({
   firestore:db,adminAuth:serverAuth,allowedAdminUids:[]
  }),TypeError);
  assert.throws(()=>createLocalAdminReviewReader({
   firestore:db,adminAuth:serverAuth,allowedAdminUids:[users.owner.uid,users.owner.uid]
  }),TypeError);
  assert.throws(()=>createLocalAdminReviewReader({
   firestore:db,
   adminAuth:{app:{options:{projectId:'wrong-project'}},verifyIdToken:async()=>null},
   allowedAdminUids:[users.owner.uid]
  }),/matching demo-project/);
  pass('reader refuses production projects, missing local emulator, wrong Admin SDK project and empty/duplicated allowlists');

  const brokenFirestore={
   projectId:PROJECT,doc:name=>db.doc(name),runTransaction:async()=>{},
   collection:()=>({
    orderBy:()=>({limit:()=>({get:async()=>{
     throw Error('PRIVATE FIRESTORE ERROR: /students/very-sensitive');
    }})})
   })
  };
  const broken=createLocalAdminReviewReader({
   firestore:brokenFirestore,adminAuth:serverAuth,
   allowedAdminUids:[users.owner.uid]
  });
  const unavailable=await broken(req(users.owner.token));
  denied(unavailable,'temporarily-unavailable');
  assert.ok(!JSON.stringify(unavailable).includes('very-sensitive'));
  pass('Firestore failures collapse to fixed safe errors without private stack, path or account data');

  const fixture=fs.readFileSync(path.resolve(__dirname,
   '../security-proposals/v99p/server-only-admin-queue-isolated.rules'),'utf8');
  assert.match(fixture,/ISOLATED, UNDEPLOYED FIRESTORE EMULATOR FIXTURE ONLY/);
  testEnv=await initializeTestEnvironment({
   projectId:PROJECT,firestore:{host:'127.0.0.1',port:8089,rules:fixture}
  });
  for(const [key,claims] of [
   ['owner',{email_verified:true,admin:true}],
   ['otherAdmin',{email_verified:true,admin:true}],
   ['teacher',{email_verified:true,role:'teacher',isTeacher:true}],
   ['student',{email_verified:true}]
  ]){
   const browser=testEnv.authenticatedContext(users[key].uid,claims).firestore();
   await assertFails(getDocs(query(collection(browser,REPORTS),limit(10))));
   await assertFails(getDoc(doc(browser,REPORTS,
    'mr_'+(0).toString(16).padStart(48,'0'))));
   await assertFails(setDoc(doc(browser,REPORTS,'forged-'+key),{
    status:'resolved',ownerUid:users[key].uid
   }));
   await assertFails(getDocs(query(collection(browser,RATES),limit(5))));
  }
  const adminStillWorks=await list(req(users.owner.token,{limit:1}));
  assert.equal(adminStillWorks.ok,true);
  assert.equal(adminStillWorks.count,1);
  assert.equal((await db.collection(REPORTS).get()).size,30);
  pass('isolated browser rules deny report/rate access to students, forged teachers AND Admin browser; only verified server Admin SDK can list');

  assert.equal(fs.existsSync(path.resolve(__dirname,'../firebase.json')),false,
   'No production Firebase deployment manifest may be introduced');
  const summary={
   version:'V99-P',
   environment:'LOCAL FIREBASE AUTH AND FIRESTORE EMULATORS ONLY',
   publicSourceReferenceCount:2250,
   syntheticReportCount:30,
   maximumAdminPage:MAX_PAGE,defaultAdminPage:DEFAULT_PAGE,
   adminTokenVerifiedByAdminSDKAgainstLocalAuthEmulator:true,
   productionSignedTokenProof:false,
   trustedUidAllowlistRequired:true,
   serverOnlyRead:true,
   browserAdminReadDeniedInIsolatedFixture:true,
   reportWritesByReviewReader:0,realAccountData:false,
   actualPublishedRulesVerified:false,
   liveTeacherInbox:false,liveDeployment:false,
   passedCases:cases
  };
  fs.writeFileSync(path.join(auditDir,'summary.json'),
   JSON.stringify(summary,null,2)+'\n');
  console.log('V99-P FINISHED: '+cases.length+
   ' groups passed, 30 synthetic reports, bounded server-only admin review. NO LIVE FIREBASE USE.');
  await signOut(clientAuth);
 }finally{
  if(testEnv)await testEnv.cleanup();
  await deleteClient(client);
  await deleteAdmin(admin);
 }
}
main().catch(e=>{
 console.error('V99-P FAILED:',String(e.stack||e).slice(0,2200));
 process.exitCode=1;
});
