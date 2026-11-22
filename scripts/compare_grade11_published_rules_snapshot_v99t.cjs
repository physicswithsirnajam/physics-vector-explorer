#!/usr/bin/env node
'use strict';
/**
 * V99-T — PRIVATE READ-ONLY fingerprint comparison of the owner-supplied
 * baseline vs a separate owner-copied Firestore Console PUBLISHED snapshot.
 *
 * Both inputs come ONLY from encrypted GitHub Actions repository secrets.
 * Neither rule body is printed, committed, uploaded, sent over the network
 * or deployed. We cannot independently verify where the second secret came
 * from; the owner must confirm it was copied from the published Rules tab.
 *
 * A matching snapshot is a provenance-dependent COPY COMPARISON, NOT a
 * direct Firebase Admin API read, and not authorization to deploy.
 */
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');

const BASELINE_SHA='c3d5ee6286b006510fd793cd18467493f2e7eccf3f17437182bcb0fd9d43ec39';
const REQUIRED_LINES=227,MAX_CHARS=160_000;
const ARTIFACT=path.resolve(__dirname,'../qa-artifacts/published-rules-snapshot-v99t/summary.json');
const BASE_SECRET='PSN_FIRESTORE_BASELINE_RULES';
const SNAP_SECRET='PSN_FIRESTORE_PUBLISHED_RULES_SNAPSHOT';

function normalizeRules(value){
 if(typeof value!=='string'||!value.trim()||value.length>MAX_CHARS)
  throw new TypeError('Invalid private rules snapshot input');
 return value.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').trimEnd()+'\n';
}
function digest(value){
 return crypto.createHash('sha256').update(value,'utf8').digest('hex');
}
function fingerprintsEqual(a,b){
 return crypto.timingSafeEqual(Buffer.from(a,'hex'),Buffer.from(b,'hex'));
}
function compareSnapshots(baseline,published,{requirePinnedBaseline=true}={}){
 const original=normalizeRules(baseline),observed=normalizeRules(published);
 const a=digest(original),b=digest(observed);
 if(requirePinnedBaseline){
  assert.equal(a,BASELINE_SHA,'Owner baseline no longer matches the pinned source');
  assert.equal(original.split('\n').length-1,REQUIRED_LINES,
   'Pinned owner rules baseline has the wrong line count');
 }
 return Object.freeze({
  exactNormalizedMatch:fingerprintsEqual(a,b),
  baselineMatchesPinned:fingerprintsEqual(a,BASELINE_SHA),
  pinnedBaselineLines:original.split('\n').length-1,
  observedSnapshotLines:observed.split('\n').length-1
 });
}
function run(){
 // Remove secret values from this process environment as early as possible.
 const baseline=process.env[BASE_SECRET];
 const snapshot=process.env[SNAP_SECRET];
 delete process.env[BASE_SECRET];
 delete process.env[SNAP_SECRET];
 if(!baseline||!snapshot){
  console.error('V99-T BLOCKED: both private Rules secrets are required. Do not substitute repository rules or synthetic fixtures.');
  process.exitCode=1;return;
 }
 let result;
 try{result=compareSnapshots(baseline,snapshot);}
 catch{
  console.error('V99-T BLOCKED: a private snapshot is invalid or the owner baseline changed. No source printed.');
  process.exitCode=1;return;
 }
 const summary=Object.freeze({
  version:'V99-T',
  scope:'Two GitHub-encrypted owner-supplied Firestore Rules copies compared OFFLINE',
  baselinePinnedSha256:BASELINE_SHA,
  baselinePinnedLineCount:REQUIRED_LINES,
  observedSnapshotLineCount:result.observedSnapshotLines,
  exactNormalizedMatch:result.exactNormalizedMatch,
  originOfPublishedSnapshotIndependentlyVerified:false,
  needsOwnerConfirmationOfFirestoreConsolePublishedSource:true,
  verifiedCurrentPublishedRulesViaFirebaseApi:false,
  productionRulesReadByTool:false,
  productionRulesChanged:false,
  reportEndpointEnabled:false,
  originalRulesTextStoredInArtifact:false,
  privateStudentDataAccessed:false
 });
 try{
  fs.mkdirSync(path.dirname(ARTIFACT),{recursive:true});
  fs.writeFileSync(ARTIFACT,JSON.stringify(summary,null,2)+'\n',{mode:0o600});
 }catch{
  console.error('V99-T BLOCKED: could not safely write counts-only comparison result.');
  process.exitCode=1;return;
 }
 if(!result.exactNormalizedMatch){
  console.error('V99-T BLOCKED: supplied published snapshot DOES NOT MATCH the pinned owner baseline. Stop; inspect drift privately before any production change.');
  process.exitCode=1;return;
 }
 console.log('V99-T PASS: two private Rules text copies match after BOM/newline normalization; pinned 227-line owner baseline verified.');
 console.log('V99-T LIMIT: snapshot source is OWNER-ATTESTED only, NOT independently retrieved from Firebase; NO PRODUCTION DEPLOYMENT.');
}
module.exports=Object.freeze({BASELINE_SHA,REQUIRED_LINES,normalizeRules,
 digest,compareSnapshots});
if(require.main===module)run();
