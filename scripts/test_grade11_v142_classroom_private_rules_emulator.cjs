#!/usr/bin/env node
'use strict';
/* V142 — prototype-only, locally emulated teacher/class boundary test.
 *
 * The public isolated fixture must NEVER replace the user's actual Firestore
 * rules. A separate 227-line private owner-supplied baseline arrives from the
 * encrypted Actions secret, is SHA-checked, and receives ONLY the scoped deny
 * proposal before its existing deny-all match. NO FIREBASE DEPLOYMENT.
 *
 * Results contain only synthetic actor names and operation/count metadata,
 * never the private rules, any user identity, credentials or question keys.
 */
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs'),path=require('node:path');
const {initializeTestEnvironment,assertSucceeds,assertFails}=
 require('@firebase/rules-unit-testing');
const {doc,collection,query,limit,getDoc,getDocs,setDoc,updateDoc,deleteDoc,
 serverTimestamp}=require('firebase/firestore');

const ROOT=path.resolve(__dirname,'..');
const PROJECT='demo-psn-v142-classroom';
const HOST='127.0.0.1:8089';
const EXPECTED_BASELINE_SHA='c3d5ee6286b006510fd793cd18467493f2e7eccf3f17437182bcb0fd9d43ec39';
const FIXTURE=path.join(ROOT,'security-proposals/v142/teacher-classroom-isolated.rules');
const OUT=path.join(ROOT,'qa-artifacts/grade11-v142-classroom-security');
const START='    // BEGIN V142 scoped classroom block';
const END='    // END V142 scoped classroom block.';
const BASE_DENY_ANCHOR='    match /{document=**} {';
const paths=Object.freeze([
 {key:'teacherDirectory',path:'teacherDirectory/teacherT1',parent:'teacherDirectory'},
 {key:'classes',path:'classes/C1',parent:'classes'},
 {key:'members',path:'classes/C1/members/studentA',parent:'classes/C1/members'},
 {key:'assignments',path:'classes/C1/assignments/assignment1',parent:'classes/C1/assignments'},
 {key:'submissions',path:'classes/C1/submissions/submission1',parent:'classes/C1/submissions'},
 {key:'teacherClassAudit',path:'teacherClassAudit/audit1',parent:'teacherClassAudit'}
]);
const counts={isolated:0,fullOwnerPolicy:0,positiveOwnerControls:0};
function normalize(input){
 assert.ok(typeof input==='string'&&input.length>1000&&input.length<50000,
  'Missing or invalid owner-provided baseline: HALT; do not substitute fixture');
 return input.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').trimEnd()+'\n';
}
function scopedRules(){
 const fixture=fs.readFileSync(FIXTURE,'utf8');
 assert.ok(fixture.includes('ISOLATED FIRESTORE EMULATOR FIXTURE ONLY; NEVER DEPLOY'));
 assert.ok(fixture.includes("rules_version = '2';"));
 const first=fixture.indexOf(START),last=fixture.indexOf(END,first);
 assert.ok(first>0&&last>first,'Scoped teacher policies must be uniquely marked');
 assert.equal(fixture.indexOf(START,first+1),-1);
 assert.equal(fixture.indexOf(END,last+1),-1);
 const block=fixture.slice(first,last+END.length)+'\n';
 assert.equal((block.match(/allow read, write: if false;/g)||[]).length,6,
  'All six teacher/class paths must be client deny-by-default');
 for(const token of ['/teacherDirectory/{teacherUid}','/classes/{classId}',
  '/members/{studentUid}','/assignments/{assignmentId}',
  '/submissions/{submissionId}','/teacherClassAudit/{entryId}']){
  assert.ok(block.includes('match '+token),'Missing explicitly gated classroom scope: '+token);
 }
 assert.ok(!/\ballow\s+(get|list|read|create|update|delete|write)\s*:\s*if\s+(true|verified|request\.auth)/.test(block),
  'Class prototype may not grant browser access');
 assert.ok(fixture.includes('match /{document=**} {\n      allow read, write: if false;'));
 return {fixture,block};
}
function fullRules(block){
 const source=process.env.PSN_FIRESTORE_BASELINE_RULES;
 if(typeof source!=='string'||source.length<1000)
  throw Error('Private owner full rules baseline secret missing: fail closed, no public substitute');
 delete process.env.PSN_FIRESTORE_BASELINE_RULES;
 const baseline=normalize(source);
 assert.equal(crypto.createHash('sha256').update(baseline).digest('hex'),EXPECTED_BASELINE_SHA,
  'Private owner baseline fingerprint changed: reconcile before security testing');
 assert.equal(baseline.split('\n').length-1,227,
  'Original private owner baseline must contain exactly 227 normalized lines');
 assert.equal(baseline.split(BASE_DENY_ANCHOR).length,2,
  'Expected exactly one original deny-all insertion anchor');
 assert.equal((baseline.match(/function verifiedAdmin\(\)/g)||[]).length,1,
  'Do not reimplement the existing administrator claim function');
 for(const t of ['/classes/','/teacherDirectory/','/teacherClassAudit/'])
  assert.ok(!baseline.includes('match '+t),'New class paths already present; review migration');
 assert.ok(baseline.includes('allow read, write: if false;'),'Original catch-all deny missing');
 const combined=baseline.replace(BASE_DENY_ANCHOR,block+BASE_DENY_ANCHOR);
 assert.equal(combined.replace(block,''),baseline,'Original private rules MUST remain byte-for-byte preserved');
 assert.equal((combined.match(/allow read, write: if false;/g)||[]).length,
  (baseline.match(/allow read, write: if false;/g)||[]).length+6,
  'Only six scoped deny rules may be added');
 return combined;
}
const seed={
 teacherDirectory:{role:'teacher',teacherUid:'teacherT1',status:'pilot-disabled'},
 classes:{ownerUid:'teacherT1',grade:11,status:'unpublished-pilot'},
 members:{uid:'studentA',status:'invited',classId:'C1'},
 assignments:{ownerUid:'teacherT1',status:'draft',grade:11},
 submissions:{ownerUid:'studentA',status:'synthetic-only'},
 teacherClassAudit:{byUid:'server-only',reason:'synthetic test'}
};
function contextActors(env){
 return [
  ['signed-out',env.unauthenticatedContext().firestore()],
  ['verified-student-A',env.authenticatedContext('studentA',{email_verified:true}).firestore()],
  ['verified-student-B',env.authenticatedContext('studentB',{email_verified:true}).firestore()],
  ['unverified-student',env.authenticatedContext('studentA',{email_verified:false}).firestore()],
  ['forged-client-role',env.authenticatedContext('pretender',{email_verified:true,role:'teacher',isTeacher:true}).firestore()],
  ['claim-bearing-teacher',env.authenticatedContext('teacherT1',{email_verified:true,teacher:true,role:'teacher'}).firestore()],
  ['verified-admin-browser',env.authenticatedContext('adminPilot',{email_verified:true,admin:true}).firestore()],
  ['unverified-admin-browser',env.authenticatedContext('adminPilot',{email_verified:false,admin:true}).firestore()]
 ];
}
async function denied(actor,operation,promise,kind){
 try{
  await assertFails(promise);
  counts[kind]++;
 }catch{
  throw Error('V142 ISOLATION FAILED: '+kind+' / '+actor+' / '+operation+
    ' unexpectedly granted or could not verify deny');
 }
}
async function allowed(operation,promise){
 try{await assertSucceeds(promise);counts.positiveOwnerControls++}
 catch{throw Error('V142 EXISTING PROFILE REGRESSION: '+operation+' failed');}
}
function profile(name){
 return {displayName:name,createdAt:serverTimestamp(),updatedAt:serverTimestamp()};
}
function enrollment(uid){
 return {uid,grade:11,board:'fbise',institution:'Synthetic test',
  status:'active',type:'independent',enrolledAt:serverTimestamp()};
}
function attempt(){
 return {schemaVersion:1,kind:'self-practice',grade:11,unit:2,
  bankVersion:'synthetic-v142',createdAt:serverTimestamp(),
  questionCount:1,correctCount:0,skippedCount:1,
  arrangement:'random',selection:'random',scope:'all',
  questionResults:[{questionId:'XI-U02-TEXT-0001',selected:null}]};
}
async function exercise(rules,kind){
 let env=null;
 try{
  env=await initializeTestEnvironment({projectId:PROJECT,
   firestore:{host:'127.0.0.1',port:8089,rules}});
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async ctx=>{
   const db=ctx.firestore();
   for(const x of paths)await setDoc(doc(db,...x.path.split('/')),seed[x.key]);
   if(kind==='fullOwnerPolicy'){
    for(const uid of ['studentA','studentB']){
     await setDoc(doc(db,'users',uid),profile('Synthetic '+uid));
     await setDoc(doc(db,'academicEnrollments',uid),enrollment(uid));
    }
    await setDoc(doc(db,'users','studentA','attempts','oldAttempt'),attempt());
   }
  });
  for(const [actor,db] of contextActors(env)){
   for(const x of paths){
    const ref=doc(db,...x.path.split('/'));
    await denied(actor,x.key+' get',getDoc(ref),kind);
    await denied(actor,x.key+' limited list',
      getDocs(query(collection(db,...x.parent.split('/')),limit(10))),kind);
    await denied(actor,x.key+' create',
      setDoc(doc(db,...(x.parent+'/new-'+actor.replace(/[^A-Za-z0-9]/g,'')).split('/')),
       {ownerUid:'studentB',role:'admin',status:'approved'}),kind);
    await denied(actor,x.key+' update',updateDoc(ref,{status:'approved'}),kind);
    await denied(actor,x.key+' delete',deleteDoc(ref),kind);
   }
  }
  if(kind==='fullOwnerPolicy'){
   const own=env.authenticatedContext('studentA',{email_verified:true}).firestore();
   const other=env.authenticatedContext('studentB',{email_verified:true}).firestore();
   await allowed('student A own profile',getDoc(doc(own,'users','studentA')));
   await allowed('student A own historical self-practice',
     getDoc(doc(own,'users','studentA','attempts','oldAttempt')));
   await denied('student B','cannot read independent student A attempt',
     getDoc(doc(other,'users','studentA','attempts','oldAttempt')),kind);
   await denied('student A','cannot read student B profile',
     getDoc(doc(own,'users','studentB')),kind);
   const anon=env.unauthenticatedContext().firestore();
   await denied('signed-out','cannot read student A profile',
     getDoc(doc(anon,'users','studentA')),kind);
   const forgedTeacher=env.authenticatedContext('pretender',{
    email_verified:true,teacher:true,role:'teacher'}).firestore();
   await denied('forged-teacher','cannot read another student private profile',
     getDoc(doc(forgedTeacher,'users','studentA')),kind);
  }
 }finally{if(env)await env.cleanup()}
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT,
  'Refuse to connect to any project except the synthetic V142 demo');
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,HOST,
  'Refuse to connect to anything except local Firestore emulator');
 assert.ok(!process.env.GOOGLE_APPLICATION_CREDENTIALS,
  'No service-account credentials allowed in classroom rules test');
 assert.ok(!process.env.FIREBASE_CONFIG,
  'No real Firebase configuration allowed in local classroom rules test');
 const {fixture,block}=scopedRules();
 const full=fullRules(block);
 await exercise(fixture,'isolated');
 await exercise(full,'fullOwnerPolicy');
 assert.equal(counts.isolated,8*6*5,'All isolated-browser denial cases must run');
 assert.equal(counts.fullOwnerPolicy,8*6*5+4,'All full-policy denial cases must run');
 assert.equal(counts.positiveOwnerControls,2,'Existing student-owned reads must continue');
 fs.mkdirSync(OUT,{recursive:true});
 fs.writeFileSync(path.join(OUT,'summary.json'),JSON.stringify({
  version:'V142',mode:'OFFLINE EMULATOR ONLY',
  isolatedBrowserDenials:counts.isolated,
  ownerPrivateBaselineBrowserDenials:counts.fullOwnerPolicy,
  originalOwnerPositiveReadControls:counts.positiveOwnerControls,
  actorContextCount:8,scopedPathCount:6,
  originalOwnerBaselineSha256:EXPECTED_BASELINE_SHA,originalRuleLineCount:227,
  originalOwnerRulesSourcePreserved:true,
  publishedFirebaseRulesIndependentlyVerified:false,
  actualTeacherClaimsProvisioned:false,liveClassMembershipCreated:false,
  administratorBackendDeployed:false,teacherPortalEnabled:false,
  originalQuestionBankChanged:false,privateStudentDataUsed:false
 },null,2)+'\n');
 console.log('V142 PASS: '+counts.isolated+' isolated + '+counts.fullOwnerPolicy+
  ' full-private-rule browser denials, '+counts.positiveOwnerControls+
  ' original owner-read controls. NO DEPLOYMENT or real teacher/student data.');
}
main().catch(e=>{
 // Never print the private rules text, provided secret, original data, or stack.
 console.error('V142 FAILED:',String(e.message||'policy regression').slice(0,260));
 process.exitCode=1;
});
