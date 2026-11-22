#!/usr/bin/env node
'use strict';
/**
 * V100-J: repository-evidence ledger for Grade XI MCQ reporting rollout.
 * SOURCE ONLY. Never query real Firebase, mint App Check proofs, deploy code,
 * activate student Send, or infer a current Console state from GitHub.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const launch=require('./audit_grade11_reporting_launch_lock_v99u.cjs');
const origin=require('./audit_grade11_appcheck_origin_registration_v99w.cjs');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');
const ROOT=path.resolve(__dirname,'..');
const CHECKED=Object.freeze([
 'server/local-http-admin-review-v100a.cjs',
 'server/local-http-admin-history-v100b.cjs',
 'server/local-http-admin-triage-v100c.cjs',
 'scripts/test_grade11_local_admin_complete_http_workflow_v100d.cjs',
 'scripts/fixtures/grade11-admin-review-preview-v100e.template.html',
 'scripts/test_grade11_admin_preview_http_contract_v100f.cjs',
 'scripts/test_grade11_admin_review_preview_v100e.cjs'
]);
const BLOCKERS=Object.freeze([
 Object.freeze({id:'live-origin',status:'owner-verification-required',next:'Observe actual portal browser hostname/iframe and Firebase web app settings; do not guess from authDomain'}),
 Object.freeze({id:'appcheck-provider',status:'positive-proof-not-established',next:'Observe registration/provider, real allowlisted host, genuine non-debug provider and accepted App Check attestation; enforcement stays OFF'}),
 Object.freeze({id:'published-rules-current-revision',status:'live-api-provenance-not-established',next:'Confirm CURRENT published Firestore rules revision privately; prior V99-T owner-copied 227-line match is not a live API read'}),
 Object.freeze({id:'production-server-and-roles',status:'not-evidenced-by-source-tests',next:'Approve trusted HTTPS service, verified administrator provisioning and server-side current-account checks before a real admin dashboard'}),
 Object.freeze({id:'security-and-abuse-controls',status:'not-evidenced-by-source-tests',next:'Test real Auth/App Check/authorization and per-account quotas, transport, failure handling and operational shutoff on a controlled service'}),
 Object.freeze({id:'privacy-and-operations',status:'owner-approval-required',next:'Approve retention, student privacy notice, secure logging, incident response, spending limits, monitoring and rollback'}),
 Object.freeze({id:'controlled-student-release',status:'blocked',next:'Keep Copy only; a separate owner-approved, security-reviewed PR and production proof are required for any Send enablement'})
]);
function contains(s,fragment,label){
 assert.ok(typeof s==='string'&&s.includes(fragment),'V100-J source changed: '+label);
}
function inspect(snapshot){
 assert.ok(snapshot&&snapshot.launchSnapshot&&snapshot.originSnapshot&&snapshot.files,
  'V100-J needs actual checked-out source snapshots');
 const lock=launch.auditLaunchLock(snapshot.launchSnapshot);
 const browser=origin.inspect(snapshot.originSnapshot);
 assert.equal(lock.studentReportInterface,'COPY_ONLY');
 assert.equal(lock.safeToEnableStudentReporting,false);
 assert.equal(browser.observedPublicStudentReportState,'COPY_ONLY');
 assert.equal(browser.realAppCheckRegistrationFetchedFromFirebase,false);
 assert.equal(browser.realAppCheckTokenPositivelyVerified,false);
 assert.equal(catalog.total,2250);
 for(const p of CHECKED)
  assert.ok(typeof snapshot.files[p]==='string'&&snapshot.files[p].length>150,
   'V100-J missing evidence source: '+p);
 const q=snapshot.files[CHECKED[0]];
 const h=snapshot.files[CHECKED[1]];
 const t=snapshot.files[CHECKED[2]];
 for(const [name,s,flag] of [
  ['queue',q,'isReviewReaderEnabled=()=>false'],
  ['history',h,'isHistoryEnabled=()=>false'],
  ['transition',t,'isTriageEnabled=()=>false']
 ]){
  contains(s,"const HOST='127.0.0.1';",name+' loopback only');
  contains(s,flag,name+' default OFF');
  contains(s,'FIRESTORE_EMULATOR_HOST',name+' emulator guard');
  contains(s,'FIREBASE_AUTH_EMULATOR_HOST',name+' Auth emulator guard');
 }
 contains(snapshot.files[CHECKED[3]],'startLocalAdminReviewHttpRehearsal','shared local HTTP test');
 contains(snapshot.files[CHECKED[3]],'startLocalAdminHistoryHttpRehearsal','shared history HTTP test');
 contains(snapshot.files[CHECKED[3]],'startLocalAdminTriageHttpRehearsal','shared transition HTTP test');
 const ux=snapshot.files[CHECKED[4]];
 for(const label of ['SYNTHETIC DEMO · NOT CONNECTED',
  'Sample reports','Copy only','id="resolve-dialog"','Confirm resolved (demo)'])
  contains(ux,label,'fictional UX '+label);
 assert.ok(!/\bfetch\s*\(|\bXMLHttpRequest\b|\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b/.test(ux),
  'offline template must not connect to backend/storage');
 contains(snapshot.files[CHECKED[5]],'source-defined private queue fields','V100-F crosswalk');
 contains(snapshot.files[CHECKED[6]],'cancelable native confirmation','V100-I browser regression');
 const sourceEvidence=Object.freeze({
  studentReportCopyOnly:true,
  adminQueueHistoryTransitionAreLocalEmulatorOnlyAndDefaultOff:true,
  sharedLocalAdminHttpTestSourcePresent:true,
  syntheticUnconnectedReviewDeskSourcePresent:true,
  originalPublicMcqReferences:2250,
  sourceDerivedContractAndBrowserTestsPresent:true,
  officialLogoAndActualBrowserAppearanceIndependentlyCertified:false
 });
 return Object.freeze({
  version:'V100-J',
  finding:'BLOCKED — DO NOT ENABLE LIVE GRADE XI MCQ REPORT SENDING',
  evidenceLevel:'GIT CHECKOUT SOURCE ONLY; no live Firebase Console/API, browser or deployed backend inspection',
  sourceEvidence,
  productionReadiness:Object.freeze({
   independentlyVerifiedLiveOrigin:false,
   currentPublishedRulesFetchedByTrustedFirebaseApi:false,
   genuineProviderAppCheckPositiveProof:false,
   productionAdminRolesVerified:false,
   deployedAdminServiceVerified:false,
   privacyAndOperationalApprovalsVerified:false,
   safeToEnableStudentReportSending:false
  }),
  historicalRuleContext:'V99-T compared owner-copied published-rules snapshot with a 227-line owner baseline; current live revision NOT checked by this script',
  unresolvedGates:BLOCKERS,
  currentStudentAction:'COPY ONLY',
  noProductionChangesMade:true
 });
}
function readSnapshot(){
 const files={};
 for(const p of CHECKED)files[p]=fs.readFileSync(path.join(ROOT,p),'utf8');
 return {launchSnapshot:launch.repositorySnapshot(),
  originSnapshot:origin.readSourceSnapshot(),files};
}
function main(){
 try{
  const result=inspect(readSnapshot());
  const out=path.join(ROOT,'qa-artifacts/grade11-review-readiness-v100j');
  fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'readiness.json'),JSON.stringify(result,null,2)+'\n');
  console.log('V100-J PASS: copy-only launch lock, source origin inventory, local admin and fictional UX source crosswalk.');
  console.log('V100-J HOLD: '+result.unresolvedGates.length+' explicit release gates unresolved; NO production-readiness assertion.');
 }catch(e){
  console.error('V100-J FAILED: '+String(e.message||e).slice(0,340));
  process.exitCode=1;
 }
}
module.exports=Object.freeze({CHECKED,BLOCKERS,inspect,readSnapshot});
if(require.main===module)main();
