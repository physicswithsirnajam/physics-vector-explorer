#!/usr/bin/env node
'use strict';
/**
 * V100-M: REAL source wiring + SYNTHETIC in-process App Check SDK mock tests.
 * Neither a mock SDK nor source review proves genuine browser App Check
 * attestation, token acceptance or Firebase Console service enforcement.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/appcheck-monitoring-v100m');
const version='13.1.0';
const siteKey='6Lfx8SwuAAAAAIESGwxZpU5R6qNfK3tHb2sFvHNf';
const helperPath=path.join(root,'portal/recaptcha-enterprise-v100m.mjs');
const bootPaths=[
 'portal/app.js','portal/attempt-sync.js',
 'portal/course-lesson.js','portal/secure-lesson.js'
];
const groups=[];
function pass(name){groups.push(name);console.log('V100-M PASS:',name);}
function read(file){return fs.readFileSync(path.join(root,file),'utf8');}
function firstService(s,name){
 const i=s.indexOf('await initializeAppCheckBeforeServices(');
 assert.ok(i>=0,'Missing approved await App Check startup in '+name);
 const auth=s.indexOf('getAuth(',i),firestore=s.indexOf('getFirestore(',i);
 assert.ok(auth>i&&firestore>i,'Auth/Firestore service started before App Check '+name);
 return i;
}
async function run(){
 const helper=read('portal/recaptcha-enterprise-v100m.mjs');
 assert.ok(helper.includes("const SITE_KEY='"+siteKey+"'"));
 assert.ok(helper.includes("const APPROVED_HOST='physicswithsirnajam.github.io'"));
 assert.ok(helper.includes("const SDK_URL='https://www.gstatic.com/firebasejs/"+version+"/firebase-app-check.js'"));
 assert.ok(helper.includes('isTokenAutoRefreshEnabled:true'));
 assert.ok(helper.includes('new sdk.ReCaptchaEnterpriseProvider(SITE_KEY)'));
 assert.ok(!/FIREBASE_APPCHECK_DEBUG_TOKEN|DebugAppCheckProvider|ReCaptchaV3Provider/.test(helper));
 pass('approved public Enterprise site key is host-scoped, SDK version-pinned, auto-refreshed; no debug provider');

 const {initializeAppCheckBeforeServices:start}=
  await import(pathToFileURL(helperPath).href);
 const app=Object.freeze({name:'synthetic-mock-app'});
 const authorized=Object.freeze({protocol:'https:',hostname:'physicswithsirnajam.github.io'});
 const seen=[];
 class MockProvider{
  constructor(key){this.key=key;}
 }
 const loadSdk=async()=>({
  ReCaptchaEnterpriseProvider:MockProvider,
  initializeAppCheck(f,options){seen.push({app:f,options});}
 });
 assert.equal(await start(app,{locationLike:authorized,loadSdk}),true);
 assert.equal(seen.length,1);
 assert.equal(seen[0].app,app);
 assert.ok(seen[0].options.provider instanceof MockProvider);
 assert.equal(seen[0].options.provider.key,siteKey);
 assert.equal(seen[0].options.isTokenAutoRefreshEnabled,true);
 pass('injected MOCK SDK receives the exact same Firebase app and approved public site key; this is not a real token');

 for(const origin of [
  {protocol:'http:',hostname:'physicswithsirnajam.github.io'},
  {protocol:'https:',hostname:'localhost'},
  {protocol:'https:',hostname:'127.0.0.1'},
  {protocol:'https:',hostname:'unapproved.example.test'},
  {protocol:'file:',hostname:''},
  null
 ]){
  let imported=false;
  assert.equal(await start(app,{locationLike:origin,loadSdk:async()=>{
   imported=true;return {};
  }}),false);
  assert.equal(imported,false);
 }
 assert.equal(await start(null,{locationLike:authorized,loadSdk}),false);
 pass('non-HTTPS, localhost, file, unknown origin and missing app skip SDK import entirely');

 assert.equal(await start(app,{locationLike:authorized,
  loadSdk:async()=>{throw Error('simulated unavailable CDN');}}),false);
 assert.equal(await start(app,{locationLike:authorized,
  loadSdk:async()=>({ReCaptchaEnterpriseProvider:MockProvider,
   initializeAppCheck(){throw Error('synthetic provider failed');}})}),false);
 pass('offline mocked CDN/provider failure returns false, without blocking the caller’s Auth/Firestore startup');

 for(const file of bootPaths){
  const s=read(file);
  assert.ok(s.includes("from './recaptcha-enterprise-v100m.mjs'"),
   'Missing approved monitoring module import '+file);
  firstService(s,file);
  assert.ok(s.includes('initializeApp(firebaseConfig)'),'Missing original Firebase app '+file);
  assert.ok(s.includes("firebasejs/"+version+"/firebase-auth.js"));
  assert.ok(s.includes("firebasejs/"+version+"/firebase-firestore.js"));
  assert.ok(!/FIREBASE_APPCHECK_DEBUG_TOKEN|DebugAppCheckProvider/.test(s));
 }
 assert.ok(read('portal/course-lesson.js').includes('void boot();'));
 assert.ok(read('portal/secure-lesson.js').includes('void boot();'));
 pass('all four independent browser entrypoints await early App Check setup before Auth/Firestore');

 const main=read('portal/app.js');
 const practice=read('portal/attempt-sync.js');
 assert.ok(main.includes("auth=getAuth(firebase);")&&
  main.includes("db=getFirestore(firebase);")&&
  main.includes('onAuthStateChanged(auth,user=>{refreshView(user);'));
 assert.ok(practice.includes("const app=getApps().length?getApp():initializeApp(firebaseConfig);"));
 assert.ok(practice.includes("auth=getAuth(app);db=getFirestore(app);"));
 assert.ok(practice.includes("window.addEventListener('psn:practice-finished'"));
 assert.ok(practice.includes("await addDoc(collection(db,'users',user.uid,'attempts'),payload);"));
 pass('existing sign-in, saved practice listeners and Firestore owner-owned records remain in source');

 const issue=read('practice-engine/index.html');
 assert.ok(issue.includes('no report has been sent automatically.'));
 assert.ok(issue.includes('navigator.clipboard.writeText'));
 assert.ok(!/FIREBASE_APPCHECK_DEBUG_TOKEN|DebugAppCheckProvider/.test(issue));
 for(const f of ['portal/firebase-config.js','portal/index.html',
  'portal/course-lesson.html','portal/secure-lesson.html']){
  assert.ok(!read(f).includes(siteKey),
   'Public site key must be centralized to approved module '+f);
 }
 pass('student MCQ issue reports remain Copy only; key is centralized and original HTML/config unmodified');

 const v99w=require('./audit_grade11_appcheck_origin_registration_v99w.cjs');
 const v100k=require('./audit_grade11_owner_appcheck_baseline_v100k.cjs');
 const v100l=require('./audit_grade11_appcheck_browser_entrypoints_v100l.cjs');
 const v99u=require('./audit_grade11_reporting_launch_lock_v99u.cjs');
 const source=v99w.inspect(v99w.readSourceSnapshot());
 const owner=v100k.inspect({
  originSnapshot:v99w.readSourceSnapshot(),
  launchSnapshot:v99u.repositorySnapshot()
 });
 const inventory=v100l.inspect(v100l.sourceSnapshot());
 const locked=v99u.auditLaunchLock(v99u.repositorySnapshot());
 assert.equal(source.sourceAppCheckInitializerObserved,true);
 assert.equal(owner.firebase.ownerReportedAppCheckRegistration,'registered');
 assert.equal(owner.firebase.ownerReportedAppCheckProvider,'recaptcha-enterprise');
 assert.equal(owner.firebase.ownerReportedFirestoreAppCheckEnforcement,'not-enforced');
 assert.equal(owner.firebase.ownerReportedAuthenticationAppCheckEnforcement,'not-enforced');
 assert.equal(inventory.browserEntrypointCount,4);
 assert.ok(inventory.browserEntrypoints.every(x=>x.appCheckEarlyStartupWiredInSource));
 assert.equal(inventory.realProviderProofReceived,false);
 assert.equal(inventory.safeToEnforceAppCheck,false);
 assert.equal(locked.studentReportInterface,'COPY_ONLY');
 assert.equal(locked.safeToEnableStudentReporting,false);
 pass('historical source/owner/inventory audits reconcile registered provider and refuse enforcement or Send');

 const result={
  version:'V100-M',status:'PASS — SOURCE AND MOCK ONLY; GENUINE TOKEN UNVERIFIED',
  passedGroups:groups,
  browserEntrypoints:bootPaths,
  currentProvider:'Enterprise registered (owner screenshot), browser SDK code now wired',
  autoRefreshConfigured:true,
  allowedWebsiteHostname:'physicswithsirnajam.github.io',
  firebaseAPIs:'Monitoring (owner screenshot before merge); NOT changed by code',
  genuineProviderPositiveTokenVerified:false,
  liveBrowserSmokeTestPerformed:false,
  enforcementEnabledByThisPR:false,
  studentReportAction:'COPY ONLY',
  noSecretsUsed:true,
  noDeploymentPerformedByThisTest:true
 };
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'preflight.json'),JSON.stringify(result,null,2)+'\n');
 console.log('V100-M FINISHED: '+groups.length+
  ' source/mock groups passed; App Check LIVE ATTESTATION NOT TESTED, enforcement OFF.');
}
run().catch(e=>{console.error('V100-M FAILED:',String(e.message||e).slice(0,350));process.exitCode=1;});
