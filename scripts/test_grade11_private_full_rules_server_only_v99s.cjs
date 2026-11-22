#!/usr/bin/env node
'use strict';
/**
 * V99-S: owner-supplied, PRIVATE baseline Firestore rules + strictly additive
 * server-only report/rate/audit proposal. LOCAL EMULATOR ONLY.
 *
 * The 227-line original rules are passed by a GitHub Actions secret, never
 * committed, printed, returned in errors, uploaded or deployed. Source-
 * provided != independently retrieved CURRENTLY PUBLISHED rules.
 *
 * Admin SDK use bypasses these browser rules and must independently enforce
 * authentication, enrollment, privilege and rate limits (V99-J through R).
 */
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const {initializeTestEnvironment,assertSucceeds,assertFails}=
 require('@firebase/rules-unit-testing');
const {doc,collection,query,limit,getDoc,getDocs,setDoc,updateDoc,
 deleteDoc,serverTimestamp}=require('firebase/firestore');

const PROJECT='demo-psn-v99s-private-full-rules';
const HOST='127.0.0.1:8089';
const EXPECTED_SHA='c3d5ee6286b006510fd793cd18467493f2e7eccf3f17437182bcb0fd9d43ec39';
const OUTPUT=path.resolve(__dirname,'../qa-artifacts/private-full-rules-v99s');
const CONTROLLED=[
 'mcqReviewReports','mcqReviewRate','mcqReviewAdminAudit'
];
const ADDED_MATCH=[
 '    // V99-S: UNDEPLOYED server-only review/rate/audit proposal.',
 '    // Firebase Admin SDK trusted-server checks are independent of rules.',
 ...CONTROLLED.flatMap(name=>[
  '    match /'+name+'/{documentId} {',
  '      allow read, write: if false;',
  '    }'
 ]),
 ''
].join('\n');
const checks=[];
function pass(label){
 checks.push(label);
 console.log('V99-S PASS:',label);
}
function privateRules(){
 const supplied=process.env.PSN_FIRESTORE_BASELINE_RULES;
 if(typeof supplied!=='string'||supplied.length<1000)
  throw Error('Private owner rules baseline secret is missing; HALT, no public fixture substitution');
 delete process.env.PSN_FIRESTORE_BASELINE_RULES;
 const baseline=supplied.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').trimEnd()+'\n';
 const sha=crypto.createHash('sha256').update(baseline,'utf8').digest('hex');
 assert.equal(sha,EXPECTED_SHA,
  'Owner-supplied private rules baseline mismatch; HALT and reconcile source');
 assert.equal(baseline.split('\n').length-1,227,
  'Original owner-supplied baseline should have exactly 227 lines');
 assert.equal((baseline.match(/function verifiedAdmin\(\)/g)||[]).length,1,
  'Expected exactly one original verified-admin rule function');
 const anchor='    match /{document=**} {';
 assert.equal(baseline.split(anchor).length,2,'Expected unique existing deny-all anchor');
 for(const name of CONTROLLED){
  assert.ok(!baseline.includes('match /'+name+'/'),
   'Original private owner rule baseline unexpectedly already covers a proposed collection');
 }
 assert.ok(baseline.includes('allow read, write: if false;'),
  'Original final catch-all must remain fail closed');
 const proposed=baseline.replace(anchor,ADDED_MATCH+anchor);
 assert.equal(proposed.replace(ADDED_MATCH,''),baseline,
  'No original rule byte may change');
 assert.equal((proposed.match(/allow read, write: if false;/g)||[]).length,
  (baseline.match(/allow read, write: if false;/g)||[]).length+CONTROLLED.length);
 return proposed;
}
function userProfile(){return{
 displayName:'Synthetic student',createdAt:serverTimestamp(),
 updatedAt:serverTimestamp()
};}
function studentEnrollment(uid){return{
 uid,grade:11,board:'fbise',institution:'Demo class',status:'active',
 type:'independent',enrolledAt:serverTimestamp()
};}
function attempt(){return{
 schemaVersion:1,kind:'self-practice',grade:11,unit:2,
 bankVersion:'demo-source-v99s',createdAt:serverTimestamp(),
 questionCount:1,correctCount:0,skippedCount:1,
 arrangement:'random',selection:'random',scope:'all',
 questionResults:[{questionId:'XI-U02-TEXT-0001',selected:null}]
};}
function privacy(uid){return{
 uid,type:'account-deletion',status:'requested',requestedAt:serverTimestamp()
};}
function lesson(unit,slo){return{
 title:'Synthetic lesson',summary:'Synthetic summary',
 body:'Synthetic test lesson',grade:11,unit,board:'fbise',
 slo,status:'published',type:'lesson',accessTier:'enrolled'
};}
async function expect(which,actor,operation,promise){
 try{
  if(which==='ALLOW')await assertSucceeds(promise);
  else await assertFails(promise);
  checks.push(actor+' / '+operation+' / '+which);
 }catch{
  // Never echo private Firebase rules bytes, tokens or source diagnostics.
  throw Error('V99-S REGRESSION: '+actor+' / '+operation+' did not '+which);
 }
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT,
  'Reject non-demo Firebase project');
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,HOST,
  'Reject any Firestore endpoint other than the localhost emulator');
 assert.ok(!process.env.GOOGLE_APPLICATION_CREDENTIALS,
  'No Firebase service account allowed in security policy test');
 const source=privateRules();
 pass('exact SHA-256 verified 227-line private owner-supplied baseline; original bytes preserved, only 3 server-only deny blocks added');
 let env;
 try{
  env=await initializeTestEnvironment({
   projectId:PROJECT,firestore:{host:'127.0.0.1',port:8089,rules:source}
  });
  await env.withSecurityRulesDisabled(async ctx=>{
   const db=ctx.firestore();
   for(const uid of ['studentA','studentB']){
    await setDoc(doc(db,'users',uid),userProfile());
    await setDoc(doc(db,'academicEnrollments',uid),studentEnrollment(uid));
   }
   await setDoc(doc(db,'users','studentA','attempts','oldAttempt'),attempt());
   await setDoc(doc(db,'privacyRequests','studentA'),privacy('studentA'));
   await setDoc(doc(db,'protectedLessons','unit-01-access-pilot'),{status:'pilot'});
   await setDoc(doc(db,'protectedLessons','other-pilot'),{status:'pilot'});
   const lessons=[
    ['g11-u01-uncertainty-workshop-01',1,'P-11-A-06'],
    ['g11-u02-vector-components-01',2,'P-11-B-01'],
    ['g11-u02-vector-products-02',2,'P-11-B-02']
   ];
   for(const [id,unit,slo] of lessons)
    await setDoc(doc(db,'courseLessons',id),lesson(unit,slo));
   await setDoc(doc(db,'courseLessons','unapproved-lesson'),lesson(1,'P-11-A-06'));
   for(const name of CONTROLLED)
    await setDoc(doc(db,name,'syntheticExisting'),{
     status:'new',ownerUid:'synthetic-student',
     privateValue:'must-not-escape'
    });
  });
  const contexts={
   anon:env.unauthenticatedContext().firestore(),
   a:env.authenticatedContext('studentA',{email_verified:true}).firestore(),
   b:env.authenticatedContext('studentB',{email_verified:true}).firestore(),
   c:env.authenticatedContext('studentC',{email_verified:true}).firestore(),
   d:env.authenticatedContext('studentD',{email_verified:true}).firestore(),
   unverified:env.authenticatedContext('studentA',{email_verified:false}).firestore(),
   teacher:env.authenticatedContext('fakeTeacher',{
    email_verified:true,role:'teacher',isTeacher:true
   }).firestore(),
   admin:env.authenticatedContext('trustedAdmin',{
    email_verified:true,admin:true
   }).firestore(),
   unverifiedAdmin:env.authenticatedContext('unverifiedAdmin',{
    email_verified:false,admin:true
   }).firestore()
  };
  const {anon,a,b,c,d,unverified,teacher,admin,unverifiedAdmin}=contexts;
  const get=(db,location)=>getDoc(doc(db,...location.split('/')));
  const ls=(db,location,n)=>getDocs(query(collection(db,location),limit(n)));

  // Existing portal profiles: student owner and signed Admin only.
  await expect('ALLOW','student A','own profile',get(a,'users/studentA'));
  await expect('DENY','student A','other student profile',get(a,'users/studentB'));
  await expect('DENY','anonymous','profile read',get(anon,'users/studentA'));
  await expect('DENY','unverified','profile read',get(unverified,'users/studentA'));
  await expect('ALLOW','trusted Admin','get profile',get(admin,'users/studentA'));
  await expect('ALLOW','trusted Admin','bounded profiles',ls(admin,'users',25));
  await expect('DENY','trusted Admin','unbounded profiles',getDocs(collection(admin,'users')));
  await expect('DENY','student B','list profiles',ls(b,'users',25));
  await expect('ALLOW','student C','own profile create',
   setDoc(doc(c,'users','studentC'),userProfile()));
  await expect('DENY','student D','self-assign role',
   setDoc(doc(d,'users','studentD'),{...userProfile(),admin:true}));
  await expect('ALLOW','student A','update own display name',
   updateDoc(doc(a,'users','studentA'),{
    displayName:'Synthetic new name',updatedAt:serverTimestamp()
   }));
  await expect('DENY','student A','update own admin field',
   updateDoc(doc(a,'users','studentA'),{admin:true,updatedAt:serverTimestamp()}));
  pass('existing verified profile owner/admin isolation and no student role escalation preserved');

  // Academic enrollment / existing protected learning resources unchanged.
  await expect('ALLOW','student A','own enrollment',get(a,'academicEnrollments/studentA'));
  await expect('DENY','student A','other enrollment',get(a,'academicEnrollments/studentB'));
  await expect('ALLOW','trusted Admin','enrollment get',get(admin,'academicEnrollments/studentA'));
  await expect('DENY','trusted Admin','enrollment list',ls(admin,'academicEnrollments',25));
  await expect('ALLOW','student C','create one pilot enrollment',
   setDoc(doc(c,'academicEnrollments','studentC'),studentEnrollment('studentC')));
  await expect('DENY','student D','forge paid enrollment',
   setDoc(doc(d,'academicEnrollments','studentD'),{
    ...studentEnrollment('studentD'),type:'paid'
   }));
  await expect('DENY','student A','change enrollment status',
   updateDoc(doc(a,'academicEnrollments','studentA'),{status:'premium'}));
  await expect('ALLOW','student A','approved pilot',
   get(a,'protectedLessons/unit-01-access-pilot'));
  await expect('DENY','student D','pilot without enrollment',
   get(d,'protectedLessons/unit-01-access-pilot'));
  await expect('DENY','student A','unapproved pilot',get(a,'protectedLessons/other-pilot'));
  await expect('DENY','student A','pilot list',ls(a,'protectedLessons',10));
  for(const id of [
   'g11-u01-uncertainty-workshop-01',
   'g11-u02-vector-components-01',
   'g11-u02-vector-products-02'
  ])await expect('ALLOW','student A','approved course '+id,get(a,'courseLessons/'+id));
  await expect('DENY','student A','unapproved course',
   get(a,'courseLessons/unapproved-lesson'));
  await expect('DENY','student A','course list',ls(a,'courseLessons',10));
  pass('existing Grade XI enrollment, pilot and approved-course read boundaries preserved');

  // Existing owner-only Unit 1–2 practice and privacy-request workflows.
  await expect('ALLOW','student A','own Unit 2 attempt',
   get(a,'users/studentA/attempts/oldAttempt'));
  await expect('DENY','student B','other saved attempt',
   get(b,'users/studentA/attempts/oldAttempt'));
  await expect('DENY','trusted Admin','other student attempt',
   get(admin,'users/studentA/attempts/oldAttempt'));
  await expect('ALLOW','student A','bounded attempts',
   ls(a,'users/studentA/attempts',25));
  await expect('DENY','student A','unbounded attempt list',
   getDocs(collection(a,'users/studentA/attempts')));
  await expect('ALLOW','student A','new Unit 2 practice',
   setDoc(doc(a,'users','studentA','attempts','newUnit2'),attempt()));
  await expect('DENY','student A','unsupported Unit 3 practice',
   setDoc(doc(a,'users','studentA','attempts','newUnit3'),{...attempt(),unit:3}));
  await expect('DENY','student A','fake graded result',
   setDoc(doc(a,'users','studentA','attempts','forgedScore'),{
    ...attempt(),secureExamScore:100
   }));
  await expect('DENY','student A','edit saved attempt',
   updateDoc(doc(a,'users','studentA','attempts','oldAttempt'),{correctCount:1}));
  await expect('ALLOW','student A','own privacy request',
   get(a,'privacyRequests/studentA'));
  await expect('DENY','student B','other privacy request',
   get(b,'privacyRequests/studentA'));
  await expect('ALLOW','trusted Admin','bounded privacy queue',
   ls(admin,'privacyRequests',25));
  await expect('DENY','student A','privacy queue list',
   ls(a,'privacyRequests',25));
  await expect('ALLOW','student B','new own privacy request',
   setDoc(doc(b,'privacyRequests','studentB'),privacy('studentB')));
  await expect('DENY','student A','change deletion status',
   updateDoc(doc(a,'privacyRequests','studentA'),{status:'approved'}));
  pass('existing student practice history and account privacy-request access preserved');

  // Full proposed review model: server-only for EVERY browser actor.
  const actors=Object.entries(contexts);
  for(const [actor,db] of actors){
   for(const name of CONTROLLED){
    await expect('DENY',actor,name+' get',
     get(db,name+'/syntheticExisting'));
    await expect('DENY',actor,name+' bounded list',ls(db,name,25));
    await expect('DENY',actor,name+' unbounded list',
     getDocs(collection(db,name)));
    await expect('DENY',actor,name+' create',
     setDoc(doc(db,name,'attemptedCreate-'+actor),{
      kind:'grade11-mcq-review',status:'resolved',admin:true
     }));
    await expect('DENY',actor,name+' update',
     updateDoc(doc(db,name,'syntheticExisting'),{status:'resolved'}));
    await expect('DENY',actor,name+' delete',
     deleteDoc(doc(db,name,'syntheticExisting')));
   }
  }
  pass('all nine anonymous/student/teacher/admin browser actors denied get/list/create/update/delete on all THREE sensitive collections');

  await expect('DENY','trusted Admin','unknown private path',
   get(admin,'adminSettings/sensitive'));
  await expect('DENY','student A','unknown path write',
   setDoc(doc(a,'adminSettings','forged'),{role:'admin'}));
  const practice=fs.readFileSync(path.resolve(__dirname,'../practice-engine/index.html'),'utf8');
  assert.ok(practice.includes('no report has been sent automatically'));
  assert.ok(practice.includes('navigator.clipboard.writeText'));
  pass('existing Practice Engine remains explicitly copy-only; unrelated catch-all deny preserved');

  fs.mkdirSync(OUTPUT,{recursive:true});
  const results={
   version:'V99-S',
   testedOn:'owner-supplied private baseline (NOT verified live published rules)',
   originalRulesLineCount:227,
   originalBaselineSha256:EXPECTED_SHA,
   strictlyAdditiveRules:CONTROLLED.map(s=>s+'/{documentId}: browser read/write DENY'),
   sourceBaselinePreserved:true,
   currentPublishedRulesIndependentlyRetrieved:false,
   liveFirebaseCredentialsUsed:false,
   liveRulesDeployed:false,
   productionFunctionDeployed:false,
   actualAdminProvisioningVerified:false,
   realPositiveAppCheckTokenVerified:false,
   studentSendStillCopyOnly:true,
   browserRoleContexts:actors.map(([name])=>name),
   fullPrivateAccessCaseCount:checks.length,
   groupedChecks:checks.filter(x=>x.startsWith('existing')||
    x.startsWith('all nine')||x.startsWith('exact')||
    x.startsWith('Practice Engine'))
  };
  fs.writeFileSync(path.join(OUTPUT,'summary.json'),
   JSON.stringify(results,null,2)+'\n');
  console.log('V99-S FINISHED: '+checks.length+
   ' private full-policy checks; all proposed report/rate/audit browser operations denied; current LIVE published rules NOT independently verified; NO DEPLOYMENT.');
 }finally{
  if(env)await env.cleanup();
 }
}
main().catch(e=>{
 // No private rules source, tokens, Firestore stack, or access IDs in failures.
 console.error('V99-S FAILED:',String(e.message||'private policy check failed').slice(0,280));
 process.exitCode=1;
});
