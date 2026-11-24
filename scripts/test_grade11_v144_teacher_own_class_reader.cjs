#!/usr/bin/env node
'use strict';
/* V144 true local Auth+Firestore Emulators.
 * Synthetic identities ONLY; no network endpoint, production rules changes
 * or real user records. Tests V143 admin-owned writes and V144 teacher READ
 * service, while V142 Firestore clients are still denied on class paths.
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
const {doc,getDoc,getDocs,query,limit,collection,setDoc}=require('firebase/firestore');
const {PROJECT,FS_HOST,AUTH_HOST,createLocalClassroomProvisioner}=
 require('../server/local-classroom-provisioner-v143.cjs');
const {createLocalTeacherClassroomReader,MAX_CLASSES,MAX_MEMBERSHIPS}=
 require('../server/local-teacher-classroom-reader-v144.cjs');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v144-read-only-teacher-classroom/summary.json');
const password='V144-Synthetic_LocalAuth_Only#2026';
const email=uid=>uid+'@example.test';
const paths=[
 'question-bank/manifest.json',
 'security-proposals/v142/teacher-classroom-isolated.rules',
 'quality/grade11-unit06-v94d-signoff-matrix.json',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'server/local-classroom-provisioner-v143.cjs'
];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const before=Object.fromEntries(paths.map(p=>[p,hash(p)]));
const counts={teacherReadSuccess:0,teacherServerDenials:0,
 browserRulesDenials:0,revocationChecks:0,privacyChecks:0};
function good(x){
 assert.equal(x.ok,true,'Expected authorized teacher read');
 counts.teacherReadSuccess++;
 return x;
}
function denied(x,code){
 assert.deepEqual(x,{ok:false,code});
 counts.teacherServerDenials++;
}
function adminOk(x){
 assert.equal(x.ok,true,'Admin fixture setup failed: '+JSON.stringify(x));
}
async function browserDeny(promise){
 await assertFails(promise);counts.browserRulesDenials++;
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,FS_HOST);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,AUTH_HOST);
 assert.equal(!!process.env.GOOGLE_APPLICATION_CREDENTIALS,false);
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'question-bank/manifest.json'),'utf8'));
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 const hold=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(hold.releaseApproved,false);
 assert.equal(hold.teacherSignoff,'pending');
 const rules=fs.readFileSync(path.join(root,'security-proposals/v142/teacher-classroom-isolated.rules'),'utf8');
 assert.ok(rules.includes('NEVER DEPLOY'));
 const app=adminInit({projectId:PROJECT},'v144-admin');
 const browserApps=[];
 let env=null;
 try{
  const auth=adminAuthFor(app),db=getFirestore(app);
  env=await initializeTestEnvironment({projectId:PROJECT,
   firestore:{host:'127.0.0.1',port:8089,rules}});
  const actors=['rootAdmin','otherAdmin','teacherOne','teacherTwo',
   'studentA','studentB','independent','unverified'];
  for(const uid of actors){
   await auth.createUser({uid,email:email(uid),password,
    emailVerified:uid!=='unverified'});
  }
  await auth.setCustomUserClaims('rootAdmin',{admin:true});
  await auth.setCustomUserClaims('otherAdmin',{admin:true});
  for(const uid of ['studentA','studentB','independent']){
   await db.doc('academicEnrollments/'+uid).set({
    uid,grade:11,status:'active',board:'fbise',type:'independent'
   });
  }
  // Synthetic private data is seeded to PROVE no teacher response includes it.
  await db.doc('users/studentA').set({
   displayName:'PRIVATE_TEST_NAME_DO_NOT_EXPOSE',email:'hidden@example.test',
   guardianPhone:'PRIVATE_GUARDIAN_DO_NOT_EXPOSE'
  });
  await db.doc('users/studentA/attempts/secretAttempt').set({
   correctAnswer:'PRIVATE_ANSWER_KEY_DO_NOT_EXPOSE',score:99
  });
  const clientAuth=new Map();
  async function login(uid){
   const client=browserInit({projectId:PROJECT,
    authDomain:PROJECT+'.firebaseapp.com',apiKey:'synthetic-emulator-only'},
    'v144-client-'+uid);
   browserApps.push(client);
   const a=browserAuthFor(client);
   connectAuthEmulator(a,'http://'+AUTH_HOST,{disableWarnings:true});
   const signed=await signInWithEmailAndPassword(a,email(uid),password);
   clientAuth.set(uid,signed.user);
   return signed.user.getIdToken(true);
  }
  const tokens={};
  for(const uid of actors)tokens[uid]=await login(uid);
  const req=(who,extras={})=>({authorization:'Bearer '+tokens[who],...extras});
  let adminEnabled=true;
  const adminService=createLocalClassroomProvisioner({
   firestore:db,adminAuth:auth,allowedAdminUids:['rootAdmin'],
   isProvisioningEnabled:()=>adminEnabled
  });
  for(const teacherUid of ['teacherOne','teacherTwo'])
   adminOk(await adminService.provisionTeacher(req('rootAdmin',{teacherUid})));
  // Refresh old teacher tokens so the TEACHER claim is cryptographically present.
  for(const teacher of ['teacherOne','teacherTwo'])
   tokens[teacher]=await clientAuth.get(teacher).getIdToken(true);
  adminOk(await adminService.createClass(req('rootAdmin',{
   teacherUid:'teacherOne',classId:'ClassC1',
   title:'Synthetic Physics Group One',grade:11
  })));
  adminOk(await adminService.createClass(req('rootAdmin',{
   teacherUid:'teacherTwo',classId:'ClassC2',
   title:'Synthetic Physics Group Two',grade:11
  })));
  adminOk(await adminService.attachStudent(req('rootAdmin',{
   classId:'ClassC1',studentUid:'studentA'
  })));
  adminOk(await adminService.attachStudent(req('rootAdmin',{
   classId:'ClassC2',studentUid:'studentB'
  })));
  assert.equal((await db.doc('classes/ClassC1/members/independent').get()).exists,false);
  let enabled=false;
  const teacherService=createLocalTeacherClassroomReader({
   firestore:db,adminAuth:auth,isTeacherReaderEnabled:()=>enabled
  });
  denied(await teacherService.listOwnClasses(req('teacherOne')),
   'temporarily-unavailable');
  enabled=true;
  denied(await teacherService.listOwnClasses({}),
   'invalid-request');
  denied(await teacherService.listOwnClasses({
   authorization:'Bearer invalid'}),
   'authentication-required');
  denied(await teacherService.listOwnClasses(req('studentA')),
   'teacher-access-required');
  denied(await teacherService.listOwnClasses(req('rootAdmin')),
   'teacher-access-required');
  denied(await teacherService.listOwnClasses(req('otherAdmin')),
   'teacher-access-required');
  denied(await teacherService.listOwnClasses(req('unverified')),
   'verified-email-required');
  denied(await teacherService.listOwnClasses({
   ...req('teacherOne'),role:'teacher',teacherUid:'teacherTwo'
  }),'invalid-request');
  denied(await teacherService.getClassRoster(req('studentA',{
   classId:'ClassC1'})),'teacher-access-required');
  denied(await teacherService.getClassRoster(req('teacherOne',{
   classId:'../../users/studentA'})),'invalid-request');
  denied(await teacherService.getClassRoster(req('teacherOne',{
   classId:'ClassC1',viewerUid:'teacherTwo'})),'invalid-request');

  const one=good(await teacherService.listOwnClasses(req('teacherOne')));
  const two=good(await teacherService.listOwnClasses(req('teacherTwo')));
  assert.deepEqual(one.classes,[{
   classId:'ClassC1',title:'Synthetic Physics Group One',grade:11,status:'draft'
  }]);
  assert.deepEqual(two.classes,[{
   classId:'ClassC2',title:'Synthetic Physics Group Two',grade:11,status:'draft'
  }]);
  const c1=good(await teacherService.getClassRoster(req('teacherOne',{
   classId:'ClassC1'})));
  const c2=good(await teacherService.getClassRoster(req('teacherTwo',{
   classId:'ClassC2'})));
  assert.deepEqual(c1,{
   ok:true,classId:'ClassC1',title:'Synthetic Physics Group One',
   grade:11,status:'draft',assignedStudentUids:['studentA'],assignedCount:1
  });
  assert.deepEqual(c2,{
   ok:true,classId:'ClassC2',title:'Synthetic Physics Group Two',
   grade:11,status:'draft',assignedStudentUids:['studentB'],assignedCount:1
  });
  const privateMarkers=[
   'PRIVATE_TEST_NAME_DO_NOT_EXPOSE','PRIVATE_GUARDIAN_DO_NOT_EXPOSE',
   'PRIVATE_ANSWER_KEY_DO_NOT_EXPOSE','hidden@example.test',
   'secretAttempt','score','email','guardianPhone'
  ];
  for(const result of [one,two,c1,c2]){
   const text=JSON.stringify(result);
   for(const marker of privateMarkers)assert.ok(!text.includes(marker),
    'Teacher-facing field leaked from private independent history');
  }
  counts.privacyChecks++;
  denied(await teacherService.getClassRoster(req('teacherOne',{
   classId:'ClassC2'})),'class-access-required');
  denied(await teacherService.getClassRoster(req('teacherTwo',{
   classId:'ClassC1'})),'class-access-required');
  denied(await teacherService.getClassRoster(req('teacherOne',{
   classId:'MissingClass'})),'class-access-required');
  const rowsBefore=(await db.collection('teacherClassAudit').get()).size;
  // Teacher reads are side-effect-free: no audit or class/member writes.
  assert.equal(rowsBefore,8);
  assert.equal((await db.doc('classes/ClassC1/members/studentA').get()).data().status,
   'assigned');
  // Only administrator can revoke, then teacher's previously valid roster
  // must immediately show no assigned student.
  adminOk(await adminService.revokeStudent(req('rootAdmin',{
   classId:'ClassC1',studentUid:'studentA'
  })));
  const afterRevoke=good(await teacherService.getClassRoster(req('teacherOne',{
   classId:'ClassC1'})));
  assert.deepEqual(afterRevoke.assignedStudentUids,[]);
  assert.equal(afterRevoke.assignedCount,0);
  assert.deepEqual(good(await teacherService.getClassRoster(req('teacherTwo',{
   classId:'ClassC2'}))).assignedStudentUids,['studentB']);
  counts.revocationChecks++;

  // A teacher revoked in live CURRENT Auth state cannot continue reading even
  // with a previously issued unexpired Firebase ID token.
  await auth.setCustomUserClaims('teacherOne',{teacher:false});
  denied(await teacherService.listOwnClasses(req('teacherOne')),
   'teacher-access-required');
  counts.revocationChecks++;
  await auth.setCustomUserClaims('teacherOne',{teacher:true});
  await auth.updateUser('teacherOne',{disabled:true});
  denied(await teacherService.getClassRoster(req('teacherOne',{
   classId:'ClassC1'})),'authentication-required');
  counts.revocationChecks++;
  await auth.updateUser('teacherOne',{disabled:false});
  // Previously minted claim can also be revoked by the server-owned directory.
  await db.doc('teacherDirectory/teacherOne').update({status:'revoked'});
  denied(await teacherService.listOwnClasses(req('teacherOne')),
   'teacher-access-required');
  counts.revocationChecks++;
  await db.doc('teacherDirectory/teacherOne').update({status:'active'});
  // If a trusted admin reassigns C1 ownership, original teacher loses it.
  await db.doc('classes/ClassC1').update({teacherUid:'teacherTwo'});
  denied(await teacherService.getClassRoster(req('teacherOne',{
   classId:'ClassC1'})),'class-access-required');
  const freshTwo=good(await teacherService.listOwnClasses(req('teacherTwo')));
  assert.deepEqual(freshTwo.classes.map(x=>x.classId),['ClassC1','ClassC2']);
  counts.revocationChecks++;
  // Existing class can never be listed after a membership reassignment failure.
  await db.doc('classes/ClassC1').update({teacherUid:'teacherOne'});

  // Reconstructing overbroad or malformed server data must FAIL CLOSED.
  await db.doc('classes/ClassC1/members/studentA').update({
   studentUid:'studentB',status:'assigned'
  });
  denied(await teacherService.getClassRoster(req('teacherOne',{
   classId:'ClassC1'})),'temporarily-unavailable');
  counts.privacyChecks++;
  // Fix synthetic member only to check roster visibility remains revoked.
  await db.doc('classes/ClassC1/members/studentA').update({
   studentUid:'studentA',status:'revoked'
  });

  // Even admin/teacher FIRESTORE CLIENT SDK calls remain denied under
  // V142's no-client-access classroom policy; teacher reads are only through
  // the trusted, field-restricted, local backend above.
  const actorsInBrowser=[
   ['anonymous',env.unauthenticatedContext().firestore()],
   ['studentA',env.authenticatedContext('studentA',{email_verified:true}).firestore()],
   ['studentB',env.authenticatedContext('studentB',{email_verified:true}).firestore()],
   ['teacherOne',env.authenticatedContext('teacherOne',{
     teacher:true,email_verified:true}).firestore()],
   ['teacherTwo',env.authenticatedContext('teacherTwo',{
     teacher:true,email_verified:true}).firestore()],
   ['adminRoot',env.authenticatedContext('rootAdmin',{
     admin:true,email_verified:true}).firestore()]
  ];
  for(const [label,browserDb] of actorsInBrowser){
   for(const classId of ['ClassC1','ClassC2']){
    await browserDeny(getDoc(doc(browserDb,'classes',classId)));
    await browserDeny(getDocs(query(
     collection(browserDb,'classes',classId,'members'),limit(5))));
    await browserDeny(setDoc(doc(browserDb,'classes',classId,'members','studentB'),
     {status:'assigned',studentUid:'studentB',classId,role:'student'}));
   }
  }
  assert.equal(counts.browserRulesDenials,actorsInBrowser.length*2*3);
  const auditAfter=(await db.collection('teacherClassAudit').get()).size;
  assert.equal(auditAfter,rowsBefore+1,
   'Trusted teacher reads must not produce writes or mutations');
  assert.deepEqual(Object.fromEntries(paths.map(p=>[p,hash(p)])),before);
  assert.ok(MAX_CLASSES<=10);
  assert.ok(MAX_MEMBERSHIPS<=50);
  fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify({
   version:'V144',environment:'local Firebase Auth+Firestore emulators ONLY',
   teacherReadSuccess:counts.teacherReadSuccess,
   serverAuthorizationDenials:counts.teacherServerDenials,
   browserFirestoreRuleDenials:counts.browserRulesDenials,
   revokedClaimsAndOwnershipChecks:counts.revocationChecks,
   fieldMinimizationChecks:counts.privacyChecks,
   authorizedTeacherCount:2,syntheticClassCount:2,
   teacherCanEditMembership:false,
   teacherSeesPrivateIndependentAttempts:false,
   exactTeacherEmailOrStudentPrivateFieldsExported:false,
   backendHttpEndpointPublished:false,
   teacherPortalEnabled:false,liveClassRecordsChanged:false,
   originalPhysicsSourceChanged:false,unit6AcademicApproved:false
  },null,2)+'\n');
  console.log('V144 PASS: '+counts.teacherReadSuccess+
   ' own-class/roster reads, '+counts.teacherServerDenials+
   ' authorization denials, '+counts.browserRulesDenials+
   ' browser Firestore denials. Only synthetic local data; no teacher portal launch.');
 }finally{
  if(env)await env.cleanup();
  for(const app of browserApps)await browserDelete(app);
  await adminDelete(app);
 }
}
main().catch(e=>{
 // Never expose private account fields, JWT, Firebase exceptions in logs.
 console.error('V144 FAILED:',e?.name==='AssertionError'?
  String(e.message).slice(0,240):'local teacher class viewer regression');
 process.exitCode=1;
});
