#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {EXPECTED,USED_SOURCES,inspect,readSourceSnapshot}=
 require('./audit_grade11_appcheck_origin_registration_v99w.cjs');
const original=readSourceSnapshot();
const results=[];
function pass(label){results.push(label);console.log('V99-W PASS:',label);}
function copy(){
 return {
  trackedPaths:original.trackedPaths.slice(),
  files:{...original.files}
 };
}
function denied(label,mutate){
 const x=copy();
 mutate(x);
 assert.throws(()=>inspect(x));
 pass(label);
}
function alter(x,p,a,b){
 assert.ok(x.files[p].includes(a),'Missing source anchor '+p);
 x.files[p]=x.files[p].replace(a,b);
}
const baseline=inspect(original);
assert.equal(baseline.publicFirebaseProjectId,EXPECTED.projectId);
assert.equal(baseline.publicFirebaseWebAppId,EXPECTED.webAppId);
assert.equal(baseline.firebaseAuthenticationDomain,EXPECTED.authDomain);
assert.deepEqual(baseline.browserFirebasePaths,[
 'portal/app.js','portal/attempt-sync.js','portal/course-lesson.js','portal/secure-lesson.js'
]);
assert.equal(baseline.safeToEnableProductionEnforcement,false);
assert.equal(baseline.safeToEnableStudentReportSending,false);
pass('source-only inventory pins Firebase project, web app and four approved browser SDK entrypoints');

assert.equal(baseline.githubPagesDefaultHostCandidate,EXPECTED.candidateHost);
assert.equal(baseline.candidateOriginVerifiedFromActualBrowser,false);
assert.equal(baseline.realAppCheckRegistrationFetchedFromFirebase,false);
assert.equal(baseline.googleSitesTopLevelOrIframeConfigurationChecked,false);
assert.equal(baseline.sourceAppCheckInitializerObserved,true);
pass('GitHub Pages browser origin is not independently proven; approved monitor-mode initializer is source-only, not real positive attestation');

denied('wrong Firebase project must invalidate inventory',x=>{
 alter(x,'portal/firebase-config.js',
  'physics-with-sir-najam-portal.firebaseapp.com',
  'unknown-other-firebase.firebaseapp.com');
});
denied('wrong Firebase web app ID must invalidate inventory',x=>{
 alter(x,'portal/firebase-config.js',
  EXPECTED.webAppId,'1:OTHER:web:WRONG');
});
denied('wrong Firebase projectId must invalidate inventory',x=>{
 alter(x,'portal/firebase-config.js',
  'projectId: "physics-with-sir-najam-portal"',
  'projectId: "other-public-project"');
});
denied('private credential field in public config must invalidate inventory',x=>{
 x.files['portal/firebase-config.js']+=
  '\nconst serviceAccount = {private_key: "NEVER-COMMIT"};';
});
denied('removed sign-in SDK initialization must invalidate inventory',x=>{
 alter(x,'portal/app.js',
  'initializeApp(firebaseConfig)','initializeApp(otherFirebaseConfig)');
});
denied('removed practice-sync initialization must invalidate inventory',x=>{
 alter(x,'portal/attempt-sync.js',
  'initializeApp(firebaseConfig)','initializeApp(untrusted)');
});
denied('removed protected-lesson initialization must invalidate inventory',x=>{
 alter(x,'portal/course-lesson.js',
  'initializeApp(firebaseConfig)','initializeApp(untrusted)');
});
denied('unexpected SECOND active App Check initializer requires a separate change review',x=>{
 x.files['portal/app.js']+="\ninitializeAppCheck(app,{});";
});
denied('replacing approved App Check bootstrap in a browser route is forbidden',x=>{
 alter(x,'portal/secure-lesson.js',
  "await initializeAppCheckBeforeServices(app);",
  "/* omitted App Check entirely */");
});
denied('removing approved dynamic provider SDK is forbidden',x=>{
 alter(x,'portal/recaptcha-enterprise-v100m.mjs',
  'new sdk.ReCaptchaEnterpriseProvider(SITE_KEY)',
  'new sdk.ReCaptchaV3Provider(SITE_KEY)');
});
denied('App Check hostname must remain allowlisted',x=>{
 alter(x,'portal/recaptcha-enterprise-v100m.mjs',
  "const APPROVED_HOST='physicswithsirnajam.github.io';",
  "const APPROVED_HOST='example.invalid';");
});
denied('debug App Check token in browser module is forbidden',x=>{
 x.files['portal/attempt-sync.js']+=
  '\nself.FIREBASE_APPCHECK_DEBUG_TOKEN=true;';
});
denied('unapproved custom-domain CNAME requires re-verification',x=>{
 x.trackedPaths.push('CNAME');
});
denied('new client App Check source requires updated owner registration review',x=>{
 x.trackedPaths.push('portal/app-check-init.js');
});
denied('report submission being described as automatic breaks copy-only baseline',x=>{
 alter(x,'practice-engine/index.html',
  'no report has been sent automatically.',
  'the report has been sent automatically.');
});
denied('live browser report copy removal breaks baseline',x=>{
 alter(x,'practice-engine/index.html',
  'navigator.clipboard.writeText','navigator.clipboardCopy.writeText');
});
denied('untracked critical file must be rejected',x=>{
 x.trackedPaths=x.trackedPaths.filter(p=>p!==USED_SOURCES[0]);
});
console.log('V99-W FINISHED: '+results.length+
 ' checks passed. Four-page monitor-mode source initialization does not prove signed provider tokens or production enforcement.');
