#!/usr/bin/env node
'use strict';
/* V99-C: isolated, DEMO-PROJECT-ONLY Firestore Emulator Security Rules tests.
 * Never reads real student data, contacts a real Firebase project or deploys.
 * This tests ONLY a proposed new mcqReviewReports path in isolation, and
 * DOES NOT certify the existing live Firestore rules.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {
 initializeTestEnvironment,assertSucceeds,assertFails
}=require('@firebase/rules-unit-testing');
const {
 doc,collection,query,limit,getDoc,getDocs,setDoc,updateDoc,deleteDoc
}=require('firebase/firestore');

const root=path.resolve(__dirname,'..');
const fixture=path.join(root,'security-proposals/v99c/mcq-review-isolated.rules');
const evidenceDir=path.join(root,'qa-artifacts/mcq-review-rules-v99c');
const projectId='demo-psn-v99c-review';
const emulatorAddress='127.0.0.1:8089';
const fixtures={
 report:{
  schemaVersion:1,kind:'grade11-mcq-review',grade:11,unit:1,
  questionId:'XI-U01-MCQ-0001',sourceQuestionNumber:1,
  bankVersion:'test-source-v99c',category:'missing-context',
  note:'Unit test only, no real student content',
  origin:'practice-engine',ownerUid:'student-a',status:'new'
 }
};
const cases=[];
async function expectPermission(kind,actor,operation,promise){
 if(kind==='DENY')await assertFails(promise);
 else await assertSucceeds(promise);
 cases.push({actor,operation,expected:kind,result:'PASS'});
}
async function main(){
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,emulatorAddress,
  'Refusing to run without exact local Firestore emulator; no production fallback');
 assert.equal(process.env.GCLOUD_PROJECT,projectId,
  'Refusing to run without the isolated demo project ID');
 const source=fs.readFileSync(fixture,'utf8');
 assert.match(source,/ISOLATED FIRESTORE EMULATOR FIXTURE ONLY/);
 assert.match(source,/allow create, update, delete: if false;/);
 assert.ok(!source.includes('allow create: if true')&&!source.includes('allow read: if true'));
 fs.mkdirSync(evidenceDir,{recursive:true});
 let testEnv=null;
 try{
  testEnv=await initializeTestEnvironment({
   projectId,firestore:{host:'127.0.0.1',port:8089,rules:source}
  });
  await testEnv.withSecurityRulesDisabled(async context=>{
   await setDoc(doc(context.firestore(),'mcqReviewReports','test-report-001'),fixtures.report);
  });
  const anon=testEnv.unauthenticatedContext().firestore();
  const verifiedA=testEnv.authenticatedContext('student-a',{email_verified:true}).firestore();
  const verifiedB=testEnv.authenticatedContext('student-b',{email_verified:true}).firestore();
  const unverified=testEnv.authenticatedContext('student-a',{email_verified:false}).firestore();
  const forgedTeacher=testEnv.authenticatedContext('student-c',{email_verified:true,isTeacher:true,role:'teacher'}).firestore();
  const fakeAdminUnverified=testEnv.authenticatedContext('bad-admin',{email_verified:false,admin:true}).firestore();
  // A simulated server-issued admin custom claim, not a browser-granted role.
  const admin=testEnv.authenticatedContext('official-admin',{email_verified:true,admin:true}).firestore();
  const ref=db=>doc(db,'mcqReviewReports','test-report-001');
  const coll=db=>collection(db,'mcqReviewReports');

  for(const [label,db] of [
   ['anonymous',anon],['verified student A (owner)',verifiedA],
   ['verified student B',verifiedB],['unverified student',unverified],
   ['browser role spoof (no admin custom claim)',forgedTeacher],
   ['unverified admin claim',fakeAdminUnverified]
  ]){
   await expectPermission('DENY',label,'get existing report',getDoc(ref(db)));
   await expectPermission('DENY',label,'list with limit=25',getDocs(query(coll(db),limit(25))));
   await expectPermission('DENY',label,'create student report directly',setDoc(doc(coll(db),'new-'+label.replace(/[^a-z0-9]/gi,'-')),fixtures.report));
   await expectPermission('DENY',label,'change status',updateDoc(ref(db),{status:'resolved'}));
  }
  await expectPermission('ALLOW','verified trusted admin claim','get single report',getDoc(ref(admin)));
  await expectPermission('ALLOW','verified trusted admin claim','list with limit=25',getDocs(query(coll(admin),limit(25))));
  await expectPermission('ALLOW','verified trusted admin claim','list with limit=1',getDocs(query(coll(admin),limit(1))));
  await expectPermission('DENY','verified trusted admin claim','list unbounded',getDocs(coll(admin)));
  await expectPermission('DENY','verified trusted admin claim','list with limit=26',getDocs(query(coll(admin),limit(26))));
  await expectPermission('DENY','verified trusted admin claim','create direct browser report',setDoc(doc(coll(admin),'admin-created'),fixtures.report));
  await expectPermission('DENY','verified trusted admin claim','update review status directly',updateDoc(ref(admin),{status:'resolved'}));
  await expectPermission('DENY','verified trusted admin claim','delete report directly',deleteDoc(ref(admin)));
  // Isolated fixture denies unrelated paths by default. This does NOT
  // establish the existing live policies are preserved: no live rules loaded.
  await expectPermission('DENY','verified trusted admin claim','read unrelated fixture path',getDoc(doc(admin,'users','student-a')));
  await expectPermission('DENY','verified student A (owner)','read unrelated fixture path',getDoc(doc(verifiedA,'users','student-a')));

  const report={version:'V99-C',environment:'LOCAL FIRESTORE EMULATOR ONLY',
   projectId,fixture:'security-proposals/v99c/mcq-review-isolated.rules',
   liveProjectAccessed:false,liveRulesChanged:false,fullExistingRulesReproduced:false,
   submittedReportBackendActive:false,teacherInboxActive:false,
   seededRecords:'one synthetic report with no student personal information',
   cases,passCount:cases.length,
   boundary:'Proposed admin-only review reads and all-client-write-deny are verified only in an ISOLATED fixture. The complete supplied policy was NOT committed, deployed or regression tested here.'};
  fs.writeFileSync(path.join(evidenceDir,'audit.json'),JSON.stringify(report,null,2)+'\n');
  const lines=[
   '# V99-C — Isolated Firestore Rules Emulator Evidence','',
   '**LOCAL DEMO ONLY — not a published rules audit, real submissions service, or teacher inbox.**','',
   'Fixture: security-proposals/v99c/mcq-review-isolated.rules','',
   'The original complete deployed rules were NOT inserted into this fixture. Existing student data access is not covered by these tests.','',
   '| Actor | Operation | Expected | Result |','|---|---|---|---|',
   ...cases.map(x=>'| '+x.actor+' | '+x.operation+' | '+x.expected+' | '+x.result+' |'),
   '',cases.length+' total simulated allow/deny cases passed.','',
   'Review access is granted only to a **verified admin custom claim**, with bounded list queries up to 25. All client-side creates, edits and deletes are denied, including trusted-admin browser writes. Trusted server Admin SDK operations are deliberately not tested here.','',
   'Next required task: run the same decision matrix alongside the FULL copied current rules in a PRIVATE isolated emulator run, preserving existing users/attempts/enrollments/privacy/courseLesson protections before any live rule change.',''
  ];
  fs.writeFileSync(path.join(evidenceDir,'report.md'),lines.join('\n'));
  console.log('V99-C PASS: '+cases.length+' source-local Firestore emulator allow/deny cases; no browser report write, no live project, no full-policy claim.');
 }finally{if(testEnv)await testEnv.cleanup();}
}
main().catch(err=>{console.error('V99-C FAILED:',err.message||err);process.exitCode=1;});
