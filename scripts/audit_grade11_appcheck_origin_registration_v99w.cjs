#!/usr/bin/env node
'use strict';
/**
 * V99-W: READ-ONLY repository source inventory for Firebase App Check
 * registration preflight. No Firebase API calls, tokens, user data, live
 * website requests, new client initializer, enforcement or deployment.
 *
 * A default GitHub Pages hostname inferred from the repo owner is only a
 * CANDIDATE, not independently observed browser location or approval to
 * register/allow it in reCAPTCHA Enterprise.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const child=require('node:child_process');

const ROOT=path.resolve(__dirname,'..');
const EXPECTED=Object.freeze({
 projectId:'physics-with-sir-najam-portal',
 webAppId:'1:158078442603:web:b4738a9875a1d5b1c8a52e',
 authDomain:'physics-with-sir-najam-portal.firebaseapp.com',
 githubRepo:'physicswithsirnajam/physics-vector-explorer',
 candidateHost:'physicswithsirnajam.github.io',
 candidatePortalPath:'/physics-vector-explorer/portal/index.html'
});
const USED_SOURCES=Object.freeze([
 'portal/firebase-config.js',
 'portal/app.js',
 'portal/attempt-sync.js',
 'portal/course-lesson.js',
 'portal/index.html',
 'practice-engine/index.html'
]);
const OWNER_CONFIRMATIONS=Object.freeze([
 'actual browser address used for student portal, including any custom domain',
 'whether the portal is loaded directly or inside an external iframe',
 'Firebase Console project and Web App ID selected',
 'App Check Apps tab: registered/unregistered web app and provider name',
 'App Check APIs tab: monitoring/enforcement state for EACH relevant service',
 'reCAPTCHA Enterprise web key allowed hostnames, if configured'
]);
function isPlain(o){return o!==null&&typeof o==='object'&&!Array.isArray(o);}
function readSourceSnapshot(){
 const raw=child.execFileSync('git',['ls-files','-z'],{
  cwd:ROOT,encoding:'utf8',maxBuffer:20*1024*1024
 });
 const trackedPaths=raw.split('\0').filter(Boolean);
 const files={};
 for(const p of USED_SOURCES)
  files[p]=fs.readFileSync(path.join(ROOT,p),'utf8');
 return {trackedPaths,files};
}
function inspect(snapshot){
 assert.ok(isPlain(snapshot)&&isPlain(snapshot.files)&&
  Array.isArray(snapshot.trackedPaths),'read-only source inventory required');
 const {files,trackedPaths}=snapshot;
 const tracked=new Set(trackedPaths);
 for(const p of USED_SOURCES)
  assert.ok(tracked.has(p)&&typeof files[p]==='string'&&files[p].length>100,
   'Missing source-bound portal entry '+p);
 const config=files['portal/firebase-config.js'];
 for(const [key,val] of [
  ['projectId',EXPECTED.projectId],
  ['authDomain',EXPECTED.authDomain],
  ['appId',EXPECTED.webAppId]
 ])assert.ok(config.includes(key+': "'+val+'"'),
  'Pinned public Firebase '+key+' must match');
 assert.ok(!/\b(?:private_key|serviceAccount|client_email)\b/i.test(config),
  'Firebase public config must not contain service account fields');

 const modulePaths=['portal/app.js','portal/attempt-sync.js','portal/course-lesson.js'];
 for(const file of modulePaths){
  const s=files[file];
  assert.ok(s.includes("from './firebase-config.js'")&&
   s.includes('initializeApp(firebaseConfig)'),
   'Verified Firebase web-app initialization path missing: '+file);
  assert.ok(/firebase-auth\.js/.test(s)&&/firebase-firestore\.js/.test(s),
   'Protected student app Firebase service path missing: '+file);
  assert.ok(!/firebase-app-check\.js|initializeAppCheck\s*\(|ReCaptchaEnterpriseProvider\s*\(/.test(s),
   'Unexpected production App Check initializer requires owner rollout review: '+file);
  assert.ok(!/FIREBASE_APPCHECK_DEBUG_TOKEN|DebugAppCheckProvider/.test(s),
   'Browser debug provider or token forbidden: '+file);
 }
 const page=files['portal/index.html'];
 assert.ok(page.includes('Firebase')&&page.includes('student')&&
  /app\.js/.test(page),'Existing signed-in portal entrypoint must remain intact');
 const practice=files['practice-engine/index.html'];
 assert.ok(practice.includes('no report has been sent automatically.')&&
  practice.includes('navigator.clipboard.writeText'),
  'Student report must remain copy-only without claims of delivery');

 // A CNAME or deployment URL rewrite can change the actual host.
 // The Firebase authDomain is NOT the reCAPTCHA key's website-domain list.
 const cname=trackedPaths.filter(p=>(/(^|\/)CNAME$/i).test(p));
 assert.equal(cname.length,0,'CNAME found — recheck actual hosting hostname');
 const appCheckFiles=trackedPaths.filter(p=>
  /(^|\/)(?:app-check|appcheck)(?:[-.\/]|$)/i.test(p)&&
  /^(?:portal|practice-engine|shared)\//.test(p));
 assert.equal(appCheckFiles.length,0,
  'New client App Check file requires revised owner configuration review');
 return Object.freeze({
  version:'V99-W',
  mode:'PUBLIC REPOSITORY SOURCE OBSERVATIONS ONLY',
  publicFirebaseProjectId:EXPECTED.projectId,
  publicFirebaseWebAppId:EXPECTED.webAppId,
  firebaseAuthenticationDomain:EXPECTED.authDomain,
  browserFirebasePaths:Object.freeze(modulePaths),
  observedPublicStudentReportState:'COPY_ONLY',
  sourceAppCheckInitializerObserved:false,
  sourceBrowserDebugProviderObserved:false,
  githubPagesDefaultHostCandidate:EXPECTED.candidateHost,
  githubPagesPortalPathCandidate:EXPECTED.candidatePortalPath,
  candidateOriginVerifiedFromActualBrowser:false,
  actualCustomDomainChecked:false,
  googleSitesTopLevelOrIframeConfigurationChecked:false,
  realAppCheckRegistrationFetchedFromFirebase:false,
  recaptchaEnterpriseKeyRegisteredVerified:false,
  realAppCheckTokenPositivelyVerified:false,
  firebaseServiceEnforcementChanged:false,
  nextOwnerReviewItems:OWNER_CONFIRMATIONS,
  safeToEnableProductionEnforcement:false,
  safeToEnableStudentReportSending:false
 });
}
function main(){
 try{
  const report=inspect(readSourceSnapshot());
  const dir=path.resolve(ROOT,'qa-artifacts/appcheck-domain-preflight-v99w');
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'summary.json'),
   JSON.stringify(report,null,2)+'\n');
  console.log('V99-W PASS: pinned Firebase project/web app, 3 browser SDK entrypoints, copy-only reporting and no App Check initializer in inspected source.');
  console.log('V99-W HOLD: inferred GitHub Pages hostname is a CANDIDATE; live browser origin, Console registration and enforcement remain unverified.');
  console.log('V99-W NO LIVE FIREBASE CALLS, NO CONFIG OR ENFORCEMENT CHANGES.');
 }catch(e){
  console.error('V99-W FAILED: '+String(e.message||'source drift').slice(0,300));
  process.exitCode=1;
 }
}
module.exports=Object.freeze({EXPECTED,USED_SOURCES,inspect,readSourceSnapshot});
if(require.main===module)main();
