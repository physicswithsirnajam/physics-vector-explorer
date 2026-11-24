#!/usr/bin/env node
'use strict';
/* V143 — ACTUAL Firebase Admin SDK + Auth and Firestore emulators.
 * All identities, emails/passwords and records are SYNTHETIC local fixtures.
 * No production Firebase configuration, credential, HTTP endpoint, public
 * teacher UI, current-user tokens or class data ever leaves the emulator.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {initializeApp:adminInit,deleteApp:adminDelete}=require('firebase-admin/app');
const {getAuth:getAdminAuth}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const {initializeApp:clientInit,deleteApp:clientDelete}=require('firebase/app');
const {getAuth,connectAuthEmulator,signInWithEmailAndPassword}=require('firebase/auth');
const {getDoc,doc,setDoc,updateDoc,collection,getDocs,query,limit}=
 require('firebase/firestore');
const {initializeTestEnvironment,assertFails}=require('@firebase/rules-unit-testing');
const {PROJECT,FS_HOST,AUTH_HOST,createLocalClassroomProvisioner}=
 require('../server/local-classroom-provisioner-v143.cjs');
const root=path.resolve(__dirname,'..');
const artifact=path.join(root,'qa-artifacts/grade11-v143-admin-classroom-provisioning/summary.json');
const password='Synthetic_V143_Local_Only_#NeverUseElsewhere99';
const fixture=path.join(root,'security-proposals/v142/teacher-classroom-isolated.rules');
const counts={authenticatedDenials:0,browserRuleDenials:0,successfulAdminWrites:0,
 revocationChecks:0,regressionChecks:0};
const sourcePaths=['question-bank/manifest.json',
 'security-proposals/v142/teacher-classroom-isolated.rules',
 'quality/grade11-unit06-v94d-signoff-matrix.json',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json'];
const hash=x=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,x))).digest('hex');
const baseline=Object.fromEntries(sourcePaths.map(x=>[x,hash(x)]));
const email=u=>u+'@example.test';
const req=(token,params={})=>({authorization:'Bearer '+token,...params});
function expectFailure(result,code){
 assert.deepEqual(result,{ok:false,code});counts.authenticatedDenials++;
}
function expectSuccess(result){
 assert.equal(result.ok,true,JSON.stringify(result));
 counts.successfulAdminWrites++;
}
async function checkDenied(promise,why){
 try{await assertFails(promise);counts.browserRuleDenials++}
 catch{throw Error('V143 CLIENT RULES UNEXPECTEDLY GRANTED '+why)}
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
 assert.equal(Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS),false);
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'question-bank/manifest.json'),'utf8'));
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 const matrix=JSON.parse(fs.readFileSync(path.join(root,sourcePaths[2]),'utf8'));
 assert.equal(matrix.releaseApproved,false);
 assert.equal(matrix.teacherSignoff,'pending');
 const adminApp=adminInit({projectId:PROJECT},'v143-admin-app');
 const browserApps=[];
 let testEnv=null;
 try{
  const auth=getAdminAuth(adminApp),db=getFirestore(adminApp);
  testEnv=await initializeTestEnvironment({
   projectId:PROJECT,firestore:{
    host:'127.0.0.1',port:8089,rules:fs.readFileSync(fixture,'utf8')
   }
  });
  const identities=[
   'adminRoot','otherAdmin','teacherOne','teacherTwo',
   'studentA','studentB','independentLearner','unverifiedLearner'
  ];
  for(const uid of identities){
   await auth.createUser({
    uid,email:email(uid),password,
    emailVerified:uid!=='unverifiedLearner',displayName:'Synthetic '+uid
   });
  }
  await auth.setCustomUserClaims('adminRoot',{admin:true});
  await auth.setCustomUserClaims('otherAdmin',{admin:true});
  for(const uid of ['studentA','studentB','independentLearner']){
   await db.doc('academicEnrollments/'+uid).set({
    uid,grade:11,board:'fbise',status:'active',type:'independent',
    institution:'Synthetic Local Course',createdAtIso:'2026-11-24T00:00:00.000Z'
   });
  }
  async function tokenFor(uid){
   const app=clientInit({
    apiKey:'local-emulator-only',authDomain:PROJECT+'.firebaseapp.com',
    projectId:PROJECT},'v143-browser-'+uid);
   browserApps.push(app);
   const clientAuth=getAuth(app);
   connectAuthEmulator(clientAuth,'http://'+AUTH_HOST,{disableWarnings:true});
   const signed=await signInWithEmailAndPassword(clientAuth,email(uid),password);
   return signed.user.getIdToken(true);
  }
  const adminToken=await tokenFor('adminRoot');
  const otherAdminToken=await tokenFor('otherAdmin');
  const teacherToken=await tokenFor('teacherOne');
  const studentToken=await tokenFor('studentA');
  const badEmailToken=await tokenFor('unverifiedLearner');
  let allowed=false;
  const settings={firestore:db,adminAuth:auth,allowedAdminUids:['adminRoot'],
   isProvisioningEnabled:async()=>allowed};
  const provision=createLocalClassroomProvisioner(settings);
  // Zero browser/API permissions until the explicitly trusted server enables.
  expectFailure(await provision.provisionTeacher(
   req(adminToken,{teacherUid:'teacherOne'})),'temporarily-unavailable');
  assert.equal((await db.collection('teacherDirectory').get()).size,0);
  allowed=true;
  expectFailure(await provision.provisionTeacher({teacherUid:'teacherOne'}),
   'invalid-request');
  expectFailure(await provision.provisionTeacher(
   req(studentToken,{teacherUid:'teacherOne'})),'admin-access-required');
  expectFailure(await provision.provisionTeacher(
   req(teacherToken,{teacherUid:'teacherOne'})),'admin-access-required');
  expectFailure(await provision.provisionTeacher(
   req(otherAdminToken,{teacherUid:'teacherOne'})),'admin-access-required');
  expectFailure(await provision.provisionTeacher(
   req(badEmailToken,{teacherUid:'teacherOne'})),'verified-email-required');
  expectFailure(await provision.provisionTeacher(
   req(adminToken,{teacherUid:'adminRoot'})),'invalid-target');
  expectFailure(await provision.provisionTeacher(
   req(adminToken,{teacherUid:'teacherOne',role:'admin'})),'invalid-request');
  expectFailure(await provision.provisionTeacher(
   req(adminToken,{teacherUid:'unverifiedLearner'})),'invalid-target');

  const teacher1=await provision.provisionTeacher(
   req(adminToken,{teacherUid:'teacherOne'}));
  expectSuccess(teacher1);
  assert.deepEqual(teacher1,{ok:true,teacherUid:'teacherOne',status:'active'});
  assert.equal((await auth.getUser('teacherOne')).customClaims.teacher,true);
  assert.equal((await db.doc('teacherDirectory/teacherOne').get()).data().status,'active');
  expectFailure(await provision.provisionTeacher(
   req(adminToken,{teacherUid:'teacherOne'})),'invalid-target');
  const teacher2=await provision.provisionTeacher(
   req(adminToken,{teacherUid:'teacherTwo'}));expectSuccess(teacher2);

  expectFailure(await provision.createClass(req(teacherToken,{
   teacherUid:'teacherOne',classId:'ClassC1',title:'Class One',grade:11
  })),'admin-access-required');
  expectFailure(await provision.createClass(req(adminToken,{
   teacherUid:'teacherOne',classId:'ClassC1',title:'Class One',grade:10
  })),'invalid-request');
  expectFailure(await provision.createClass(req(adminToken,{
   teacherUid:'teacherOne',classId:'C!',title:'Class One',grade:11
  })),'invalid-request');
  expectSuccess(await provision.createClass(req(adminToken,{
   teacherUid:'teacherOne',classId:'ClassC1',title:'Class One',grade:11
  })));
  expectSuccess(await provision.createClass(req(adminToken,{
   teacherUid:'teacherTwo',classId:'ClassC2',title:'Class Two',grade:11
  })));
  assert.equal((await db.doc('classes/ClassC1').get()).data().teacherUid,
   'teacherOne');
  assert.equal((await db.doc('classes/ClassC2').get()).data().teacherUid,
   'teacherTwo');
  expectFailure(await provision.createClass(req(adminToken,{
   teacherUid:'teacherTwo',classId:'ClassC1',title:'Overwrite Existing',grade:11
  })),'conflict');

  expectFailure(await provision.attachStudent(req(teacherToken,{
   classId:'ClassC1',studentUid:'studentA'
  })),'admin-access-required');
  expectFailure(await provision.attachStudent(req(studentToken,{
   classId:'ClassC1',studentUid:'studentA'
  })),'admin-access-required');
  expectFailure(await provision.attachStudent(req(adminToken,{
   classId:'ClassC1',studentUid:'teacherTwo'
  })),'invalid-target');
  expectFailure(await provision.attachStudent(req(adminToken,{
   classId:'ClassC1',studentUid:'unverifiedLearner'
  })),'invalid-target');
  expectFailure(await provision.attachStudent(req(adminToken,{
   classId:'MissingClass',studentUid:'studentA'
  })),'invalid-target');
  expectSuccess(await provision.attachStudent(req(adminToken,{
   classId:'ClassC1',studentUid:'studentA'
  })));
  expectSuccess(await provision.attachStudent(req(adminToken,{
   classId:'ClassC2',studentUid:'studentB'
  })));
  assert.equal((await db.doc('classes/ClassC1/members/studentA').get()).data().status,'assigned');
  assert.equal((await db.doc('classes/ClassC2/members/studentB').get()).data().status,'assigned');
  assert.equal((await db.doc('classes/ClassC1/members/studentB').get()).exists,false);
  assert.equal((await db.doc('classes/ClassC2/members/studentA').get()).exists,false);
  assert.equal((await db.doc('classes/ClassC1/members/independentLearner').get()).exists,false);
  expectFailure(await provision.attachStudent(req(adminToken,{
   classId:'ClassC1',studentUid:'studentA'
  })),'conflict');
  expectFailure(await provision.revokeStudent(req(teacherToken,{
   classId:'ClassC1',studentUid:'studentA'
  })),'admin-access-required');
  expectSuccess(await provision.revokeStudent(req(adminToken,{
   classId:'ClassC1',studentUid:'studentA'
  })));
  assert.equal((await db.doc('classes/ClassC1/members/studentA').get()).data().status,'revoked');
  assert.equal((await db.doc('classes/ClassC2/members/studentB').get()).data().status,'assigned');
  expectFailure(await provision.attachStudent(req(adminToken,{
   classId:'ClassC1',studentUid:'studentA'
  })),'conflict');
  expectFailure(await provision.revokeStudent(req(adminToken,{
   classId:'ClassC1',studentUid:'studentA'
  })),'invalid-target');

  // Admin tokens minted before current-claim revocation MUST NOT authorize.
  await auth.setCustomUserClaims('adminRoot',{admin:false});
  expectFailure(await provision.createClass(req(adminToken,{
   teacherUid:'teacherTwo',classId:'ClassC3',title:'Forbidden Class',grade:11
  })),'admin-access-required');
  counts.revocationChecks++;
  assert.equal((await db.doc('classes/ClassC3').get()).exists,false);
  await auth.setCustomUserClaims('adminRoot',{admin:true});
  await auth.updateUser('adminRoot',{disabled:true});
  expectFailure(await provision.createClass(req(adminToken,{
   teacherUid:'teacherTwo',classId:'ClassC3',title:'Forbidden Class',grade:11
  })),'authentication-required');
  counts.revocationChecks++;
  await auth.updateUser('adminRoot',{disabled:false});
  // Teacher's *current* Auth role removal blocks future class assignment
  // even when a previously active directory still exists.
  await auth.setCustomUserClaims('teacherTwo',{teacher:false});
  expectFailure(await provision.createClass(req(adminToken,{
   teacherUid:'teacherTwo',classId:'ClassC3',title:'Former Teacher',grade:11
  })),'invalid-target');
  counts.revocationChecks++;

  // Firestore client SDK must not bypass the V142 strict browser DENY rules,
  // including a teacher token with role:true and an admin-claim browser.
  const fixtureClients=[
   ['anonymous',testEnv.unauthenticatedContext().firestore()],
   ['student-A',testEnv.authenticatedContext('studentA',{email_verified:true}).firestore()],
   ['student-B',testEnv.authenticatedContext('studentB',{email_verified:true}).firestore()],
   ['teacher-one',testEnv.authenticatedContext('teacherOne',{
    email_verified:true,teacher:true,role:'teacher'}).firestore()],
   ['teacher-two',testEnv.authenticatedContext('teacherTwo',{
    email_verified:true,teacher:true,role:'teacher'}).firestore()],
   ['admin-claim-browser',testEnv.authenticatedContext('adminRoot',{
    email_verified:true,admin:true}).firestore()]
  ];
  const restricted=[
   'teacherDirectory/teacherOne',
   'classes/ClassC1',
   'classes/ClassC1/members/studentA',
   'classes/ClassC2/members/studentB',
   'classes/ClassC1/assignments/syntheticTest',
   'classes/ClassC1/submissions/syntheticTest',
   'teacherClassAudit/syntheticAudit'
  ];
  for(const [actor,clientDb] of fixtureClients){
   for(const p of restricted){
    await checkDenied(getDoc(doc(clientDb,...p.split('/'))),actor+' read '+p);
    const parts=p.split('/'), parent=parts.slice(0,-1).join('/');
    await checkDenied(getDocs(query(collection(clientDb,...parent.split('/')),limit(5))),
     actor+' list '+parent);
    await checkDenied(setDoc(doc(clientDb,...p.split('/')),{status:'active'}),
     actor+' write '+p);
   }
  }
  assert.equal(counts.browserRuleDenials,fixtureClients.length*restricted.length*3);
  const audit=await db.collection('teacherClassAudit').get();
  assert.equal(audit.size,9); // 2 teacher pending + 2 activated, 2 class, 2 assign, 1 revoke
  counts.regressionChecks++;
  for(const s of audit.docs){
   const a=s.data();
   assert.equal(a.schemaVersion,1);
   assert.equal(typeof a.createdAtIso,'string');
   assert.ok(!JSON.stringify(a).includes('@example.test'));
   assert.ok(!JSON.stringify(a).includes(password));
  }
  const teachers=await db.collection('teacherDirectory').get();
  assert.equal(teachers.size,2);
  for(const docSnap of teachers.docs){
   const value=JSON.stringify(docSnap.data());
   assert.ok(!value.includes(password));
   assert.ok(!value.includes('@example.test'));
   assert.ok(!value.includes('Bearer '));
  }
  const attempts=await db.collection('users').get();
  assert.equal(attempts.size,0,'Existing real student history must not be constructed');
  assert.deepEqual(Object.fromEntries(sourcePaths.map(x=>[x,hash(x)])),baseline);
  fs.mkdirSync(path.dirname(artifact),{recursive:true});
  fs.writeFileSync(artifact,JSON.stringify({
   version:'V143',environment:'emulators-only',localDemoProject:PROJECT,
   syntheticRoleAndFieldDenials:counts.authenticatedDenials,
   FirestoreBrowserRuleDenials:counts.browserRuleDenials,
   adminProvisioningWrites:counts.successfulAdminWrites,
   currentClaimAndDisabledAccountRevocation:counts.revocationChecks,
   privateAuditWithoutEmailsOrPasswords:true,
   demoTeacherAccounts:2,demoClasses:2,demoStudentAssignments:2,
   oneMembershipRevoked:true,independentLearnerNeverAssigned:true,
   existingPublicQuestionIdsUnaffected:true,
   currentPublishedRulesIndependentlyVerified:false,
   productionBackendDeployed:false,teacherPortalEnabled:false,
   actualTeacherCredentialsCreated:false,liveStudentDataUsed:false
  },null,2)+'\n');
  console.log('V143 PASS: trusted Admin SDK locally provisioned 2 synthetic teachers, 2 draft classes, 2 synthetic memberships and 1 revocation; '+
   counts.authenticatedDenials+' server authorization denials and '+
   counts.browserRuleDenials+' browser DENY checks. No production backend or real accounts.');
 }finally{
  if(testEnv)await testEnv.cleanup();
  for(const client of browserApps)await clientDelete(client);
  await adminDelete(adminApp);
 }
}
main().catch(e=>{
 // Generic failure only: may be Auth or database error containing private values.
 console.error('V143 FAILED:',e?.name==='AssertionError'?String(e.message).slice(0,180):
  'local teacher provisioning/security regression; inspect safe test stage');
 process.exitCode=1;
});
