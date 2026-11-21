#!/usr/bin/env node
'use strict';
/* V99-D — complete owner-provided Firestore policy + proposed review queue.
 * The original 227-line policy is supplied ONLY through a GitHub Actions
 * encrypted repository secret. It is never checked in, printed, uploaded,
 * sent to Firebase production or included in artifacts.
 *
 * The added match block is a staged proposal, not a live deployment.
 * Emulator-only with an exact demo project ID and 127.0.0.1 endpoint.
 */
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const {initializeTestEnvironment,assertSucceeds,assertFails}=require('@firebase/rules-unit-testing');
const {doc,collection,query,limit,getDoc,getDocs,setDoc,updateDoc,deleteDoc,serverTimestamp}=require('firebase/firestore');

const root=path.resolve(__dirname,'..');
const output=path.join(root,'qa-artifacts/full-firestore-rules-v99d');
const PROJECT='demo-psn-v99d-full-rules',HOST='127.0.0.1:8089';
const EXPECTED_SHA='c3d5ee6286b006510fd793cd18467493f2e7eccf3f17437182bcb0fd9d43ec39';
const ADDITION=[
 '    // V99-D — PROPOSED report queue; not yet published or connected to students.',
 '    // Reports may later be created/updated only through a trusted backend.',
 '    match /mcqReviewReports/{reportId} {',
 '      allow get: if verifiedAdmin();',
 '      allow list: if verifiedAdmin()',
 '        && request.query.limit != null',
 '        && request.query.limit <= 25;',
 '      allow create, update, delete: if false;',
 '    }',
 '',
].join('\n');
const outcomes=[];
function ruleSource(){
 const provided=process.env.PSN_FIRESTORE_BASELINE_RULES;
 if(!provided)throw Error('Missing encrypted PSN_FIRESTORE_BASELINE_RULES secret. Do not use a public repository file or skip complete-policy tests.');
 delete process.env.PSN_FIRESTORE_BASELINE_RULES;
 const baseline=provided.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').trimEnd()+'\n';
 const digest=crypto.createHash('sha256').update(baseline,'utf8').digest('hex');
 assert.equal(digest,EXPECTED_SHA,'Private baseline differs from the 227-line owner-supplied rules. Halt: reconcile published version before testing.');
 assert.equal(baseline.split('\n').length-1,227,'owner-supplied baseline has 227 complete lines');
 assert.equal((baseline.match(/match \/\{document=\*\*\}/g)||[]).length,1,'one existing catch-all deny');
 assert.equal((baseline.match(/function verifiedAdmin\(\)/g)||[]).length,1,'reuse original admin function');
 assert.ok(!baseline.includes('match /mcqReviewReports/{reportId}'),'report queue must not already exist in supplied base');
 const anchor='    match /{document=**} {';
 assert.equal(baseline.split(anchor).length,2,'unique catch-all insertion point');
 const proposal=baseline.replace(anchor,ADDITION+anchor);
 assert.equal(proposal.replace(ADDITION,''),baseline,'all existing rule bytes remain in original order');
 assert.ok(proposal.includes("allow read, write: if false;"),'final catch-all default-deny preserved');
 console.log('V99-D BASELINE PASS: private owner-supplied 227-line policy digest verified; proposed block is strictly additive.');
 return proposal;
}
async function check(mode,actor,action,promise){
 try{
  if(mode==='ALLOW')await assertSucceeds(promise);
  else await assertFails(promise);
  outcomes.push({actor,action,expected:mode,result:'PASS'});
 }catch(error){
  outcomes.push({actor,action,expected:mode,result:'FAIL'});
  throw Error(actor+' / '+action+' expected '+mode+': '+String(error.message||error).slice(0,280));
 }
}
const enrollment=uid=>({
 uid,grade:11,board:'fbise',institution:'Demo class',status:'active',
 type:'independent',enrolledAt:serverTimestamp()
});
const profile=()=>({displayName:'Demo learner',createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
const attempt=()=>({
 schemaVersion:1,kind:'self-practice',grade:11,unit:2,bankVersion:'demo-source-v99d',
 createdAt:serverTimestamp(),questionCount:1,correctCount:0,skippedCount:1,
 arrangement:'random',selection:'random',scope:'all',
 questionResults:[{questionId:'XI-U02-TEXT-0001',selected:null}]
});
const privacy=uid=>({uid,type:'account-deletion',status:'requested',requestedAt:serverTimestamp()});
const lessons=[
 {id:'g11-u01-uncertainty-workshop-01',unit:1,slo:'P-11-A-06'},
 {id:'g11-u02-vector-components-01',unit:2,slo:'P-11-B-01'},
 {id:'g11-u02-vector-products-02',unit:2,slo:'P-11-B-02'}
];
const lesson=({unit,slo})=>({
 title:'Demo learning topic',summary:'Demo summary',body:'Synthetic testing body.',
 grade:11,unit,board:'fbise',slo,status:'published',type:'lesson',accessTier:'enrolled'
});
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT,'DEMO project ID required; refuse other projects');
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,HOST,'Local emulator required; refuse live Firestore fallback');
 const rules=ruleSource();
 fs.mkdirSync(output,{recursive:true});
 let env;
 try{
  env=await initializeTestEnvironment({
   projectId:PROJECT,firestore:{host:'127.0.0.1',port:8089,rules}
  });
  await env.withSecurityRulesDisabled(async ctx=>{
   const db=ctx.firestore();
   for(const uid of ['studentA','studentB']){
    await setDoc(doc(db,'academicEnrollments',uid),enrollment(uid));
    await setDoc(doc(db,'users',uid),profile());
   }
   await setDoc(doc(db,'users','studentA','attempts','existingAttempt'),attempt());
   await setDoc(doc(db,'privacyRequests','studentA'),privacy('studentA'));
   await setDoc(doc(db,'protectedLessons','unit-01-access-pilot'),{status:'pilot'});
   await setDoc(doc(db,'protectedLessons','another-pilot'),{status:'pilot'});
   for(const item of lessons)await setDoc(doc(db,'courseLessons',item.id),lesson(item));
   await setDoc(doc(db,'courseLessons','unreviewed-demo-lesson'),lesson(lessons[0]));
   await setDoc(doc(db,'mcqReviewReports','report001'),{
    schemaVersion:1,kind:'grade11-mcq-review',grade:11,unit:2,
    questionId:'XI-U02-TEXT-0001',sourceQuestionNumber:1,
    bankVersion:'demo-v99d',category:'missing-context',note:'Synthetic report',
    origin:'practice-engine',status:'new'
   });
  });
  const contexts={
   anonymous:env.unauthenticatedContext().firestore(),
   a:env.authenticatedContext('studentA',{email_verified:true}).firestore(),
   b:env.authenticatedContext('studentB',{email_verified:true}).firestore(),
   c:env.authenticatedContext('studentC',{email_verified:true}).firestore(),
   d:env.authenticatedContext('studentD',{email_verified:true}).firestore(),
   unverified:env.authenticatedContext('studentA',{email_verified:false}).firestore(),
   fakeTeacher:env.authenticatedContext('fakeTeacher',{email_verified:true,role:'teacher',isTeacher:true}).firestore(),
   unverifiedAdmin:env.authenticatedContext('admin-unverified',{email_verified:false,admin:true}).firestore(),
   admin:env.authenticatedContext('verifiedAdmin',{email_verified:true,admin:true}).firestore()
  };
  const {anonymous,a,b,c,d,unverified,fakeTeacher,unverifiedAdmin,admin}=contexts;
  const at=(db,p)=>doc(db,...p.split('/'));
  const list=(db,p,n)=>getDocs(query(collection(db,p),limit(n)));

  // Profiles: only verified owner creates/updates, trusted admin reads/lists.
  await check('DENY','anonymous','read student profile',getDoc(at(anonymous,'users/studentA')));
  await check('ALLOW','student A','get own profile',getDoc(at(a,'users/studentA')));
  await check('DENY','student A','get student B profile',getDoc(at(a,'users/studentB')));
  await check('DENY','unverified student','get own profile',getDoc(at(unverified,'users/studentA')));
  await check('ALLOW','admin','get profile',getDoc(at(admin,'users/studentA')));
  await check('ALLOW','admin','list profiles 25',list(admin,'users',25));
  await check('DENY','admin','list profiles without bound',getDocs(collection(admin,'users')));
  await check('DENY','admin','list profiles 26',list(admin,'users',26));
  await check('DENY','student B','list user profiles',list(b,'users',25));
  await check('ALLOW','student C','create own minimal profile',setDoc(at(c,'users/studentC'),profile()));
  await check('DENY','student D','create forged role in profile',
   setDoc(at(d,'users/studentD'),{...profile(),role:'admin'}));
  await check('ALLOW','student A','update own display name',updateDoc(at(a,'users/studentA'),
   {displayName:'Demo student updated',updatedAt:serverTimestamp()}));
  await check('DENY','student A','update own admin claim field',updateDoc(at(a,'users/studentA'),
   {admin:true,updatedAt:serverTimestamp()}));
  await check('DENY','admin','write other learner profile',updateDoc(at(admin,'users/studentA'),
   {displayName:'Admin browser rewrite',updatedAt:serverTimestamp()}));
  await check('DENY','student A','delete own profile',deleteDoc(at(a,'users/studentA')));

  // Enrollments: verified owner creates Grade XI/FBISE once; no browser edits.
  await check('ALLOW','student A','get own enrollment',getDoc(at(a,'academicEnrollments/studentA')));
  await check('DENY','student A','read student B enrollment',getDoc(at(a,'academicEnrollments/studentB')));
  await check('ALLOW','admin','get enrollment',getDoc(at(admin,'academicEnrollments/studentA')));
  await check('DENY','admin','list enrollments',list(admin,'academicEnrollments',25));
  await check('DENY','student A','list enrollments',list(a,'academicEnrollments',25));
  await check('DENY','unverified student','get own enrollment',getDoc(at(unverified,'academicEnrollments/studentA')));
  await check('ALLOW','student C','create own pilot enrollment',setDoc(at(c,'academicEnrollments/studentC'),enrollment('studentC')));
  await check('DENY','student D','create forged paid entitlement',
   setDoc(at(d,'academicEnrollments/studentD'),{...enrollment('studentD'),type:'paid'}));
  await check('DENY','student A','update enrolled status',updateDoc(at(a,'academicEnrollments/studentA'),{status:'premium'}));
  await check('DENY','student A','delete own enrollment',deleteDoc(at(a,'academicEnrollments/studentA')));

  // Attempts: exact supported unit range and verified owner, enrolled grade 11.
  await check('ALLOW','student A','read own saved attempt',getDoc(at(a,'users/studentA/attempts/existingAttempt')));
  await check('DENY','student B','read student A attempt',getDoc(at(b,'users/studentA/attempts/existingAttempt')));
  await check('DENY','admin','read student A attempt',getDoc(at(admin,'users/studentA/attempts/existingAttempt')));
  await check('ALLOW','student A','list own 25 attempts',list(a,'users/studentA/attempts',25));
  await check('DENY','student A','list attempts without limit',getDocs(collection(a,'users/studentA/attempts')));
  await check('DENY','student A','list attempts over 25',list(a,'users/studentA/attempts',26));
  await check('ALLOW','student A','create valid Unit 2 practice',setDoc(at(a,'users/studentA/attempts/newU2'),attempt()));
  await check('DENY','student A','create unsupported Unit 3 practice',
   setDoc(at(a,'users/studentA/attempts/newU3'),{...attempt(),unit:3}));
  await check('DENY','student A','create forged graded result',
   setDoc(at(a,'users/studentA/attempts/newMarked'),{...attempt(),secureExamScore:100}));
  await check('DENY','student D','save attempt without enrollment',
   setDoc(at(d,'users/studentD/attempts/new1'),attempt()));
  await check('DENY','unverified student','save attempt',setDoc(at(unverified,'users/studentA/attempts/newUnverified'),attempt()));
  await check('DENY','student A','modify saved attempt',updateDoc(at(a,'users/studentA/attempts/existingAttempt'),{correctCount:1}));
  await check('DENY','student A','delete saved attempt',deleteDoc(at(a,'users/studentA/attempts/existingAttempt')));

  // Deletion request: one request per UID, owner/admin reads, never browser updates.
  await check('ALLOW','student A','get own privacy request',getDoc(at(a,'privacyRequests/studentA')));
  await check('DENY','student B','get other student request',getDoc(at(b,'privacyRequests/studentA')));
  await check('ALLOW','admin','get privacy request',getDoc(at(admin,'privacyRequests/studentA')));
  await check('ALLOW','admin','list 25 privacy requests',list(admin,'privacyRequests',25));
  await check('DENY','admin','list privacy requests with no bound',getDocs(collection(admin,'privacyRequests')));
  await check('DENY','student A','list privacy requests',list(a,'privacyRequests',25));
  await check('ALLOW','student B','create own deletion request',setDoc(at(b,'privacyRequests/studentB'),privacy('studentB')));
  await check('DENY','student D','create request with forged status',
   setDoc(at(d,'privacyRequests/studentD'),{...privacy('studentD'),status:'approved'}));
  await check('DENY','admin','create browser deletion request',
   setDoc(at(admin,'privacyRequests/verifiedAdmin'),privacy('verifiedAdmin')));
  await check('DENY','student A','change deletion request status',
   updateDoc(at(a,'privacyRequests/studentA'),{status:'cancelled'}));
  await check('DENY','admin','change request status from browser',
   updateDoc(at(admin,'privacyRequests/studentA'),{status:'completed'}));
  await check('DENY','student A','delete own request',deleteDoc(at(a,'privacyRequests/studentA')));

  // Protected lesson access: enrolled verified Grade XI/FBISE only, no listing.
  await check('ALLOW','student A','read specific pilot lesson',getDoc(at(a,'protectedLessons/unit-01-access-pilot')));
  await check('DENY','student D','read pilot without enrollment',getDoc(at(d,'protectedLessons/unit-01-access-pilot')));
  await check('DENY','unverified student','read pilot before email verification',
   getDoc(at(unverified,'protectedLessons/unit-01-access-pilot')));
  await check('DENY','student A','read unapproved pilot ID',getDoc(at(a,'protectedLessons/another-pilot')));
  await check('DENY','student A','list pilot lessons',list(a,'protectedLessons',10));
  await check('DENY','student A','write pilot lessons',setDoc(at(a,'protectedLessons/newOne'),{status:'pilot'}));

  // Three exact course lessons are allowed; unapproved course IDs remain private.
  for(const {id} of lessons)await check('ALLOW','student A','read approved course '+id,getDoc(at(a,'courseLessons/'+id)));
  await check('DENY','student D','read course without enrollment',
   getDoc(at(d,'courseLessons/'+lessons[0].id)));
  await check('DENY','unverified student','read course before verification',
   getDoc(at(unverified,'courseLessons/'+lessons[0].id)));
  await check('DENY','student A','read unapproved course ID',
   getDoc(at(a,'courseLessons/unreviewed-demo-lesson')));
  await check('DENY','student A','list course lessons',list(a,'courseLessons',10));
  await check('DENY','admin','browser write course lesson',
   setDoc(at(admin,'courseLessons/newCourse'),lesson(lessons[0])));

  // Proposed report queue: private admin-only reads, zero direct browser writes.
  for(const [actor,db] of [
   ['anonymous',anonymous],['student A',a],['student B',b],
   ['unverified student',unverified],['fake browser teacher role',fakeTeacher],
   ['unverified admin claim',unverifiedAdmin]
  ]){
   await check('DENY',actor,'read MCQ report',getDoc(at(db,'mcqReviewReports/report001')));
   await check('DENY',actor,'list MCQ reports',list(db,'mcqReviewReports',25));
   await check('DENY',actor,'create MCQ report through browser',
    setDoc(at(db,'mcqReviewReports/new-'+actor.replace(/[^a-z0-9]/gi,'-')),{kind:'grade11-mcq-review'}));
  }
  await check('ALLOW','verified admin','read MCQ report',getDoc(at(admin,'mcqReviewReports/report001')));
  await check('ALLOW','verified admin','list reports (limit 25)',list(admin,'mcqReviewReports',25));
  await check('DENY','verified admin','list reports (unbounded)',getDocs(collection(admin,'mcqReviewReports')));
  await check('DENY','verified admin','list reports (>25)',list(admin,'mcqReviewReports',26));
  await check('DENY','verified admin','create report through browser',
   setDoc(at(admin,'mcqReviewReports/newAdmin'),{kind:'grade11-mcq-review'}));
  await check('DENY','verified admin','change status from browser',
   updateDoc(at(admin,'mcqReviewReports/report001'),{status:'resolved'}));
  await check('DENY','verified admin','delete report from browser',deleteDoc(at(admin,'mcqReviewReports/report001')));

  await check('DENY','verified admin','read unknown path',getDoc(at(admin,'adminSettings/private')));
  await check('DENY','student A','write unknown path',setDoc(at(a,'adminSettings/new'),{role:'admin'}));

  const report={version:'V99-D',projectId:PROJECT,environment:'LOCAL FIRESTORE EMULATOR ONLY',
   completeOwnerProvidedRulesTested:true,liveDeployedRulesVerified:false,
   baselineDigest:EXPECTED_SHA,addedMatchOnly:'mcqReviewReports/{reportId}',
   productionRulesChanged:false,productionDataAccessed:false,
   studentReportSenderActive:false,teacherInboxActive:false,
   cases:outcomes,passing:outcomes.filter(x=>x.result==='PASS').length};
  fs.writeFileSync(path.join(output,'audit.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(output,'report.md'),[
   '# V99-D — Full owner-provided policy plus proposed MCQ review queue',
   '',
   '**All tests executed in a local demo Firestore emulator. The 227-line owner-provided policy is NEVER printed or uploaded.**',
   '',
   'Baseline normalized SHA-256: '+EXPECTED_SHA,
   '',
   'Original rules have been preserved byte-for-byte; only an isolated proposed MCQ report match was inserted ahead of the existing deny-all.','',
   'Test cases: '+outcomes.length+'; passed '+outcomes.filter(x=>x.result==='PASS').length+'.','',
   '| Actor | Operation | Expected | Result |',
   '|---|---|---|---|',
   ...outcomes.map(x=>'| '+x.actor+' | '+x.action+' | '+x.expected+' | '+x.result+' |'),
   '',
   '**Not validated:** whether this supplied baseline is exactly the currently published live rules, real claims provisioning, actual student data, production Cloud Functions/Storage, or spam prevention. No report receiving endpoint exists yet.',''
  ].join('\n'));
  console.log('V99-D PASS: '+outcomes.length+' full-owner-policy emulator allow/deny cases; existing student access preserved and proposed reports admin-read/client-write-deny. No live access.');
 }finally{if(env)await env.cleanup();}
}
main().catch(err=>{console.error('V99-D FAILED:',String(err.message||err).slice(0,450));process.exitCode=1;});
