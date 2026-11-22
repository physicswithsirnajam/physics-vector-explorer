#!/usr/bin/env node
'use strict';
/**
 * V99-U — CI launch lock for the public Grade XI MCQ issue-report feature.
 *
 * Repository SOURCE inventory only. No Firebase SDK, credentials, network,
 * production data, current App Check attestation or deployment.
 *
 * This is a deliberately narrow regression gate: it detects known accidental
 * enablement changes to the pre-existing copy-only student path, the
 * explicit emulator-only report backend and common deployment entrypoints.
 * It is NOT a complete security audit or proof that every unseen sender is
 * absent. A real release requires an independently reviewed PR changing
 * this lock along with owner-approved production proofs.
 */
const fs=require('node:fs');
const path=require('node:path');
const child=require('node:child_process');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/appcheck-launch-lock-v99u');
const CRITICAL=Object.freeze([
 'practice-engine/index.html',
 'portal/firebase-config.js',
 'server/offline-review-request-gate-v99k.cjs',
 'server/offline-admin-appcheck-v99l.cjs',
 'server/local-report-switch-v99m.cjs',
 'server/local-http-review-ingress-v99n.cjs',
 'server/local-admin-review-transitions-v99q.cjs',
 'server/local-admin-audit-history-v99r.cjs'
]);
const MANUAL_RELEASE_PROOF='release/grade11-mcq-report-production-approval.json';
function assertTruth(condition,label){
 if(!condition)throw Error('V99-U LAUNCH LOCK: '+label);
}
function hasAll(s,fragments,label){
 for(const fragment of fragments)
  assertTruth(s.includes(fragment),label+' — missing expected code anchor');
}
function auditLaunchLock({sources,trackedPaths}){
 assertTruth(sources&&typeof sources==='object'&&!Array.isArray(sources),
  'critical source inventory required');
 assertTruth(Array.isArray(trackedPaths)&&trackedPaths.length>0,
  'tracked repository paths required');
 const paths=new Set(trackedPaths);
 for(const p of CRITICAL)
  assertTruth(paths.has(p)&&typeof sources[p]==='string'&&sources[p].length>200,
   'missing critical source path '+p);

 const practice=sources['practice-engine/index.html'];
 hasAll(practice,[
  'id="copy-mcq-report"',
  "async function writeIssueReport(text,status,input){",
  'navigator.clipboard.writeText(text)',
  'no report has been sent automatically.',
  'async function copyMcqIssue(){',
  "$('copy-mcq-report').addEventListener('click',copyMcqIssue)",
  "issueBtn.addEventListener('click',()=>writeIssueReport("
 ],'copy-only student MCQ issue handoff');
 const from=practice.indexOf('function makeMcqIssueReport(q,issue,notes){');
 const to=practice.indexOf('function setClock(){',from);
 assertTruth(from>=0&&to>from&&to-from<7500,
  'the scoped copy-only issue handoff must remain recognizable');
 const handoff=practice.slice(from,to);
 assertTruth(!/\b(?:fetch|sendBeacon|XMLHttpRequest|httpsCallable|addDoc|setDoc|updateDoc|deleteDoc)\s*\(/.test(handoff),
  'student issue-handoff block must not transmit reports');
 assertTruth(!/\/api\/grade11\/mcq-review/.test(practice),
  'student practice page must not contain the design-only live report URL');
 assertTruth(!/Submit to Teacher|Report received successfully|Send issue report/i.test(handoff),
  'copy-only feedback must not claim server delivery');

 const publicConfig=sources['portal/firebase-config.js'];
 hasAll(publicConfig,[
  'physics-with-sir-najam-portal','firebaseConfig'
 ],'expected existing public web-project identity');

 const transport=sources['server/offline-review-request-gate-v99k.cjs'];
 hasAll(transport,[
  "const PATH='/api/grade11/mcq-review';",
  'const MAX_BODY_BYTES=4096;',
  'verifyAppCheckToken(parsed.appCheckToken)',
  'await receiveVerified('
 ],'offline request gate still requires App Check and bounded body');

 const check=sources['server/offline-admin-appcheck-v99l.cjs'];
 hasAll(check,[
  "DEMO_PROJECT='demo-psn-v99f-firestore'",
  'adminAppCheck.verifyToken(token,{consume:false})',
  'new TypeError('
 ],'App Check SDK adapter must remain explicit-demo and SDK-verified');
 assertTruth(!/createToken\s*\(/.test(check),
  'offline App Check adapter must never mint fake attestation tokens');

 const switcher=sources['server/local-report-switch-v99m.cjs'];
 hasAll(switcher,[
  'isEnabled=()=>false','await isEnabled()===true',
  'createOfflineAdminAppCheckGate('
 ],'reporting intake must remain OFF unless trusted server callback opts in');
 const http=sources['server/local-http-review-ingress-v99n.cjs'];
 hasAll(http,[
  "const HOST='127.0.0.1'",
  "PSN_LOCAL_HTTP_REHEARSAL!=='enabled-local-test-only'",
  'server.listen(0,HOST,',
  'MAX_BODY_BYTES'
 ],'HTTP ingress must remain explicit localhost test only');
 for(const p of [
  'server/local-admin-review-transitions-v99q.cjs',
  'server/local-admin-audit-history-v99r.cjs'
 ])hasAll(sources[p],[
  '()=>false','===true'
 ],'private admin action/history must default OFF');

 // All these paths would indicate a new deployable backend or production
 // policy surface. A conscious release PR must amend this launch-lock first.
 const forbiddenFiles=[
  'firebase.json','firestore.rules','.firebaserc',
  'cloudbuild.yaml','app.yaml'
 ];
 for(const p of forbiddenFiles)
  assertTruth(!paths.has(p),'new deployable manifest requires deliberate security review: '+p);
 for(const p of trackedPaths)
  assertTruth(!/^(?:functions|cloud-functions|cloud-run)\/(?!README\.md$)/i.test(p),
   'new cloud backend path requires explicit release review');
 assertTruth(!paths.has(MANUAL_RELEASE_PROOF),
  'production launch approval is not issued in this test-only phase');

 const publicFiles=trackedPaths.filter(p=>
  /^(?:practice-engine|portal|shared)\//.test(p)&&/\.(?:js|html|mjs)$/.test(p));
 for(const p of publicFiles){
  const s=sources[p];
  if(typeof s!=='string')continue;
  assertTruth(!/\bFIREBASE_APPCHECK_DEBUG_TOKEN\b|\bDebugAppCheckProvider\b/.test(s),
   'App Check debug providers/tokens must never ship in browser pages');
 }
 const workflows=trackedPaths.filter(p=>
  /^\.github\/workflows\/.*\.ya?ml$/.test(p));
 for(const p of workflows){
  const s=sources[p];
  if(typeof s!=='string')continue;
  assertTruth(!/\b(?:firebase\s+deploy|gcloud\s+(?:functions|run)\s+deploy)\b/i.test(s),
   'deployment of Firebase/Cloud Run backend requires intentional owner-approved change');
 }
 return Object.freeze({
  version:'V99-U',
  scope:'Known code-path launch lock; SOURCE ONLY, not Firebase runtime verification',
  status:'BLOCK LIVE GRADE XI MCQ REPORTING',
  checkedCriticalFiles:CRITICAL.length,
  checkedBrowserFiles:publicFiles.length,
  checkedWorkflowFiles:workflows.length,
  studentReportInterface:'COPY_ONLY',
  genuineSignedAppCheckPositiveVerified:false,
  realProductionFirebaseAuthVerified:false,
  productionAdminAllowlistConfigured:false,
  productionReportingEndpointDeployed:false,
  liveStudentSendEnabled:false,
  firebaseProductionRulesChanged:false,
  privatePublishedRulesSnapshotComparedInV99T:true,
  publishedRulesIndependentlyFetchedViaFirebaseApi:false,
  appCheckReplayProtectionProven:false,
  safeToEnableStudentReporting:false
 });
}
function repositorySnapshot(){
 const result=child.execFileSync('git',['ls-files','-z'],{
  cwd:root,encoding:'utf8',maxBuffer:20*1024*1024
 });
 const trackedPaths=result.split('\0').filter(Boolean);
 const sources={};
 for(const p of trackedPaths){
  if(CRITICAL.includes(p)||
     /^\.github\/workflows\/.*\.ya?ml$/.test(p)||
     (/^(?:practice-engine|portal|shared)\//.test(p)&&
      /\.(?:js|html|mjs)$/.test(p))){
   sources[p]=fs.readFileSync(path.join(root,p),'utf8');
  }
 }
 return {sources,trackedPaths};
}
function main(){
 try{
  const result=auditLaunchLock(repositorySnapshot());
  fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'summary.json'),
   JSON.stringify(result,null,2)+'\n');
  console.log('V99-U PASS: '+result.checkedCriticalFiles+' critical surfaces, '+
   result.checkedBrowserFiles+' browser source files and '+
   result.checkedWorkflowFiles+' workflows checked.');
  console.log('V99-U LAUNCH LOCK ACTIVE: MCQ issue reporting remains COPY ONLY and App Check positive proof NOT VERIFIED; no production deployment.');
 }catch(err){
  console.error('V99-U FAILED: '+String(err.message||'regression').slice(0,320));
  process.exitCode=1;
 }
}
module.exports=Object.freeze({CRITICAL,auditLaunchLock,repositorySnapshot});
if(require.main===module)main();
