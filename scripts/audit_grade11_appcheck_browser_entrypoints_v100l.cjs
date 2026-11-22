#!/usr/bin/env node
'use strict';
/**
 * V100-L: read-only inventory of browser entrypoints that initialize
 * the existing Firebase Web SDK. No App Check provider, token, key, Firebase
 * network request, live configuration mutation or service enforcement.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const child=require('node:child_process');
const v100k=require('./audit_grade11_owner_appcheck_baseline_v100k.cjs');
const v99w=require('./audit_grade11_appcheck_origin_registration_v99w.cjs');
const v99u=require('./audit_grade11_reporting_launch_lock_v99u.cjs');
const ROOT=path.resolve(__dirname,'..');
const VERSION='13.1.0';
const ENTRIES=Object.freeze([
 Object.freeze({
  page:'portal/index.html',
  module:'portal/app.js',
  script:'./app.js?v=74',
  initializer:'const firebase=initializeApp(firebaseConfig);',
  use:'student sign-in, profiles, enrollment and progress'
 }),
 Object.freeze({
  page:'practice-engine/index.html',
  module:'portal/attempt-sync.js',
  script:'../portal/attempt-sync.js',
  initializer:'getApps().length?getApp():initializeApp(firebaseConfig)',
  use:'opt-in saved practice attempts'
 }),
 Object.freeze({
  page:'portal/course-lesson.html',
  module:'portal/course-lesson.js',
  script:'./course-lesson.js?v=16',
  initializer:'const app=initializeApp(firebaseConfig);',
  use:'courseLessons server-backed protected study content'
 }),
 Object.freeze({
  page:'portal/secure-lesson.html',
  module:'portal/secure-lesson.js',
  script:'./secure-lesson.js?v=10',
  initializer:'const app=initializeApp(firebaseConfig);',
  use:'protectedLessons pilot access'
 })
]);
const EXTRA_CONSUMERS=Object.freeze([
 Object.freeze({
  module:'portal/academic-enrollment.js',
  importedBy:'portal/app.js',
  purpose:'Firestore enrollment reads/writes through the caller-provided db'
 })
]);
function sourceSnapshot(){
 const trackedPaths=child.execFileSync('git',['ls-files','-z'],{
  cwd:ROOT,encoding:'utf8',maxBuffer:20*1024*1024
 }).split('\0').filter(Boolean);
 const paths=new Set(ENTRIES.flatMap(x=>[x.page,x.module]));
 paths.add('portal/firebase-config.js');
 paths.add('portal/recaptcha-enterprise-v100m.mjs');
 for(const c of EXTRA_CONSUMERS)paths.add(c.module);
 const checkedFiles={};
 for(const p of paths)checkedFiles[p]=fs.readFileSync(path.join(ROOT,p),'utf8');
 const javascriptFiles={};
 for(const p of trackedPaths){
  if(/^(?:portal|practice-engine|shared)\/.*\.(?:js|mjs)$/.test(p)){
   javascriptFiles[p]=fs.readFileSync(path.join(ROOT,p),'utf8');
  }
 }
 return {trackedPaths,checkedFiles,javascriptFiles};
}
function inspect(snapshot){
 assert.ok(snapshot&&Array.isArray(snapshot.trackedPaths)&&
  snapshot.checkedFiles&&snapshot.javascriptFiles,
  'V100-L requires a read-only checked-out source snapshot');
 const tracked=new Set(snapshot.trackedPaths);
 const expected=new Set(ENTRIES.map(x=>x.module));
 const discovered=Object.entries(snapshot.javascriptFiles)
  .filter(([,s])=>/https:\/\/www\.gstatic\.com\/firebasejs\/[^'"]+\/firebase-app\.js/.test(s)&&
   /\binitializeApp\s*\(/.test(s))
  .map(([p])=>p).sort();
 assert.deepEqual(discovered,[...expected].sort(),
  'V100-L new/removed Firebase initializer requires separate entrypoint and App Check review');
 const config=snapshot.checkedFiles['portal/firebase-config.js'];
 assert.ok(config.includes('projectId: "physics-with-sir-najam-portal"')&&
  config.includes('appId: "1:158078442603:web:b4738a9875a1d5b1c8a52e"')&&
  config.includes('authDomain: "physics-with-sir-najam-portal.firebaseapp.com"'),
  'Existing public Firebase project, Web App ID or Auth domain changed');
 const findings=[];
 for(const e of ENTRIES){
  assert.ok(tracked.has(e.page)&&tracked.has(e.module),'missing existing page/module '+e.module);
  const html=snapshot.checkedFiles[e.page],js=snapshot.checkedFiles[e.module];
  assert.ok(html.includes('<script type="module" src="'+e.script+'"></script>'),
   'Missing actual page/module link: '+e.page);
  assert.ok(js.includes("from './firebase-config.js'"),
   'App initializer must import existing shared public Firebase config: '+e.module);
  for(const component of ['firebase-app','firebase-auth','firebase-firestore']){
   assert.ok(js.includes('https://www.gstatic.com/firebasejs/'+VERSION+'/'+component+'.js'),
    'Firebase JS SDK mismatch: '+component+' in '+e.module);
  }
  assert.ok(js.includes(e.initializer),'Unknown Firebase initialisation order in '+e.module);
  assert.ok(/\bgetAuth\s*\(/.test(js)&&/\bgetFirestore\s*\(/.test(js),
   'Existing Firebase Auth/Firestore services changed in '+e.module);
  assert.ok(js.includes("from './recaptcha-enterprise-v100m.mjs'"),
   'Missing approved early App Check helper in '+e.module);
  const initPosition=js.indexOf('await initializeAppCheckBeforeServices(');
  assert.ok(initPosition>=0&&
   js.indexOf('getAuth(',initPosition)>initPosition&&
   js.indexOf('getFirestore(',initPosition)>initPosition,
   'App Check must initialize before Auth/Firestore services in '+e.module);
  assert.ok(!/firebase-app-check\\.js|initializeAppCheck\\s*\\(|ReCaptchaEnterpriseProvider\\s*\\(/.test(js),
   'ReCaptchaEnterpriseProvider is owned only by approved helper: '+e.module);
  findings.push(Object.freeze({
   html:e.page,module:e.module,use:e.use,
   pinnedFirebaseWebSdk:VERSION,
   appCheckEarlyStartupWiredInSource:true,
   realBrowserProviderProof:false,
   earlyInitializationRequiredBeforeFirebaseServices:true
  }));
 }
 const helper=snapshot.checkedFiles['portal/recaptcha-enterprise-v100m.mjs'];
 assert.ok(helper.includes("const APPROVED_HOST='physicswithsirnajam.github.io';")&&
  helper.includes("https://www.gstatic.com/firebasejs/13.1.0/firebase-app-check.js")&&
  helper.includes('new sdk.ReCaptchaEnterpriseProvider(SITE_KEY)')&&
  helper.includes('isTokenAutoRefreshEnabled:true')&&
  helper.includes('return false;'),
  'Approved Enterprise App Check SDK origin, provider and fail-open monitor-mode helper changed');
 assert.ok(!/FIREBASE_APPCHECK_DEBUG_TOKEN|DebugAppCheckProvider/.test(helper),
  'Debug App Check provider must never ship on public site');
 const enrollment=snapshot.checkedFiles['portal/academic-enrollment.js'];
 assert.ok(enrollment.includes('firebase-firestore.js')&&
  enrollment.includes('export async function readEnrollment(db,user)')&&
  enrollment.includes('export async function createPilotEnrollment(db,user,'),
  'Enrollment consumer requires separate validation');
 assert.ok(snapshot.checkedFiles['portal/app.js'].includes("from './academic-enrollment.js?v=10'"),
  'Existing account portal import to academic enrollment changed');
 assert.ok(!/\binitializeApp\s*\(/.test(enrollment),
  'An extra Firebase initializer needs explicit inventory');
 assert.ok(!snapshot.trackedPaths.some(p=>/(^|\/)CNAME$/i.test(p)),
  'Custom-domain change requires separate owner origin/provider verification');
 const owner=v100k.inspect({
  originSnapshot:v99w.readSourceSnapshot(),launchSnapshot:v99u.repositorySnapshot()
 });
 assert.equal(owner.studentReportAction,'COPY_ONLY');
 assert.equal(owner.firebase.ownerReportedAppCheckRegistration,'registered');
 assert.equal(owner.firebase.ownerReportedFirestoreAppCheckEnforcement,'not-enforced');
 assert.equal(owner.firebase.ownerReportedAuthenticationAppCheckEnforcement,'not-enforced');
 return Object.freeze({
  version:'V100-L',
  scope:'READ-ONLY GIT SOURCE + DATED OWNER-REPORTED BASELINE, not live Firebase provider proof',
  browserEntrypointCount:ENTRIES.length,
  browserEntrypoints:Object.freeze(findings),
  sharedFirebaseServiceConsumer:Object.freeze(EXTRA_CONSUMERS.map(x=>({...x}))),
  originalBrowserAppCheckSetupPresent:true,
  browserAuthAndFirestorePathsAllMappedForFutureRollout:true,
  ownerReportedWebsiteHostname:owner.website.ownerReportedBrowserHostname,
  providerRegistrationStatus:'REGISTERED ENTERPRISE — OWNER SCREENSHOT',
  serviceEnforcementStatus:'NOT ENFORCED — OWNER REPORTED',
  sourceBrowserInitializationAttemptWired:true,
  shouldMonitorAllFourEntrypointsBeforeEnforcement:true,
  futureCustomDomainRequiresHostnameReview:true,
  realProviderProofReceived:false,
  firebaseConsoleIndependentlyQueried:false,
  studentReportAction:'COPY ONLY',
  liveReportSendingEnabled:false,
  safeToEnforceAppCheck:false,
  status:'HOLD — CLIENT INITIALIZER WIRED; ENFORCEMENT OFF, GENUINE POSITIVE TOKEN NOT VERIFIED, SEND COPY ONLY'
 });
}
function main(){
 try{
  const report=inspect(sourceSnapshot());
  const dir=path.resolve(ROOT,'qa-artifacts/grade11-appcheck-entrypoints-v100l');
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'source-inventory.json'),JSON.stringify(report,null,2)+'\n');
  console.log('V100-L PASS: four Firebase-init entrypoints all call approved early App Check starter; enrollment consumer mapped.');
  console.log('V100-L HOLD: owner screenshot shows registered provider, no verified positive token; Copy only, NO enforcement.');
 }catch(e){
  console.error('V100-L FAILED: '+String(e.message||e).slice(0,330));process.exitCode=1;
 }
}
module.exports=Object.freeze({VERSION,ENTRIES,EXTRA_CONSUMERS,sourceSnapshot,inspect});
if(require.main===module)main();
