#!/usr/bin/env node
'use strict';
/* V99-B — fail-closed, zero-network Firebase security-readiness inventory.
 * Reads existing public source files only. DOES NOT read the live rules, access
 * Firebase, log in, enumerate users, mutate database state or deploy anything.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'qa-artifacts','firestore-readiness-v99b');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const files={
 portal:'portal/app.js',
 enrollment:'portal/academic-enrollment.js',
 attempt:'portal/attempt-sync.js',
 practice:'practice-engine/index.html',
 contract:'shared/mcq-review-contract-v99a.js',
 webConfig:'portal/firebase-config.js'
};
const src=Object.fromEntries(Object.entries(files).map(([key,value])=>[key,read(value)]));
function must(condition,what){assert.ok(condition,'V99-B expected pre-existing contract violated: '+what);}
function includes(key,needle,what){must(src[key].includes(needle),what);}
function noActiveSubmission(){
  // Check the existing known student-facing Grade XI source tree, not an
  // exhaustive security certification of all deployed Firebase resources.
  for(const key of ['practice','attempt','portal','enrollment']){
    const value=src[key];
    must(!/\b(?:addDoc|setDoc|updateDoc|deleteDoc)\s*\(\s*(?:collection|doc)\s*\([^)]*?(?:mcqReviewReports|mcqReports|reviewInbox|questionIssues)\b/i.test(value),
      'unexpected new report receiving write in '+files[key]+' without deployed policy review');
  }
  must(!/\b(?:fetch|XMLHttpRequest|sendBeacon)\s*\(/.test(src.contract),
    'report intake contract remains pure/offline');
  includes('practice','no report has been sent automatically',
    'copy-only MCQ report clearly does not claim server receipt');
  includes('practice','navigator.clipboard.writeText',
    'existing report is generated for user copy instead of silent backend send');
}
function inventory(){
  includes('portal',"getIdTokenResult(true)",'browser admin screen uses refreshed signed claims');
  includes('portal',"token.claims.admin===true",'admin UI uses trusted ID token claim');
  includes('portal',"collection(db,'users')",'administrator profile directory reads collection');
  includes('portal',"doc(db,'users',user.uid)",'student reads/writes own profile document');
  includes('portal',"collection(db,'users',user.uid,'attempts')",'student attempt history read path');
  includes('portal',"doc(db,'privacyRequests',user.uid)",'owner privacy request document');
  includes('portal',"collection(db,'privacyRequests')",'administrator privacy request directory');
  includes('enrollment',"academicEnrollments",'existing grade/board pilot enrollment path');
  includes('attempt',"collection(db,'users',user.uid,'attempts')",'owner attempt save path');
  includes('attempt',"user.emailVerified",'client requires verified email for save action');
  includes('attempt',"[1,2].includes(payload.unit)",'current saved attempt coverage is limited to units 1–2');
  includes('contract','validateDraft','future MCQ report module strictly validates data');
  noActiveSubmission();
  const layoutChecks=[
    'firestore.rules','storage.rules','firebase.json',
    'functions/src/index.ts','functions/index.js'
  ];
  const deployableFiles=layoutChecks.filter(p=>fs.existsSync(path.join(root,p)));
  // A local file is not proof that these are the LIVE deployed rules, but no
  // matching files means a safe repo-only rules review is impossible.
  const paths=[
    {path:'users/{uid}',client:'profile owner read/create',required:'profile owner only; field allowlist; deny self-assigned role/admin or entitlements'},
    {path:'users/{uid}/attempts/{id}',client:'owner reads and creates Unit 1–2 practice history',required:'owner only; email verified for writes; validate shape/count/size; no forged grades'},
    {path:'academicEnrollments/{uid}',client:'pilot Grade XI / FBISE self-enrollment',required:'preserve existing one-time owner flow; deny arbitrary approvals or paid entitlement elevation'},
    {path:'privacyRequests/{uid}',client:'verified owner creates deletion review request',required:'owner-only creates, admin-claim-only listing and processing; no client deletion/approval'},
    {path:'users (collection query)',client:'admin profile listing of first 25',required:'only trusted admin custom claim can list other learners'},
    {path:'mcqReviewReports/{id} (FUTURE)',client:'not currently created',required:'server-validated report; authenticated verified student; owner cannot spoof role/status; teacher/admin read only with trusted claim'}
  ];
  const roles=[
    {identity:'anonymous',scope:'private profiles, attempts, enrollment, privacy requests, future reports',expected:'DENY all'},
    {identity:'student A with verified email',scope:'student A own profile/attempts and allowed request creation',expected:'ALLOW only validated owner operations'},
    {identity:'student A with verified email',scope:'student B profile, attempts, requests, any submitted reports',expected:'DENY all'},
    {identity:'unverified-email student',scope:'report creation and private saved-attempt creation',expected:'DENY'},
    {identity:'ordinary student',scope:'create forged admin role or report status, list other reports',expected:'DENY'},
    {identity:'trusted admin custom claim',scope:'read and triage future reports (not yet present)',expected:'ALLOW only after server-side rule tests and claim verification'}
  ];
  const warnings=[
    'The deployed Firestore/Storage security rules were NOT read, verified, tested or changed.',
    'Client-side verified-email checks and token claims do not prove database access restrictions; only actual deployed Security Rules enforce them.',
    'A public Firebase web configuration is not an administrator secret and cannot grant rule-read access.',
    'No MCQ issue-report inbox, server receiving endpoint, teacher role, status workflow or notification is currently deployed by this GitHub PR.',
    'Do not paste service-account credentials or private Firebase tokens into GitHub or this public source.',
    'Review the current live rules before proposing a merged rule patch. Test existing user data operations and denied cross-user cases in a separate Firebase Emulator environment.'
  ];
  return {version:'V99-B',scope:'Public repository-only Firebase Security Rules readiness (NOT a live rules audit)',
    scanned:Object.values(files),possibleRuleFiles:deployableFiles,
    liveRulesVerified:false,liveRulesChanged:false,reportBackendActive:false,
    existingClientAccess:paths,proposedEmulatorMatrix:roles,warnings};
}
function main(){
  fs.mkdirSync(output,{recursive:true});
  const result=inventory();
  const report=['# V99-B — Firestore Security Rules: repository-only preflight','',
    '**Status: LIVE RULES NOT YET INSPECTED. No report submission may be enabled as a result of this audit.**','',
    '## Existing browser access paths and tests required','',
    '| Path / future path | Existing browser behavior | Rules checks required before receiving MCQ reports |',
    '|---|---|---|',
    ...result.existingClientAccess.map(x=>'| '+x.path+' | '+x.client+' | '+x.required+' |'),'',
    '## Required Firebase emulator access checks (PLANNED, not executed)','',
    '| Identity | Attempted access | Expected |',
    '|---|---|---|',
    ...result.proposedEmulatorMatrix.map(x=>'| '+x.identity+' | '+x.scope+' | '+x.expected+' |'),'',
    '## Deployment and trust caveats','',
    ...result.warnings.map(x=>'- '+x),'',
    'Files found resembling local rules/deployment configuration: '+(result.possibleRuleFiles.join(', ')||'none in audited checkout')+'.',
    'No owner-specific user data was read. All findings come from static source inspection.',''];
  fs.writeFileSync(path.join(output,'audit.json'),JSON.stringify(result,null,2)+'\n');
  fs.writeFileSync(path.join(output,'report.md'),report.join('\n'));
  console.log('V99-B SOURCE-ONLY PASS — access paths inventoried: '+result.existingClientAccess.length+
    '; proposed offline emulator cases: '+result.proposedEmulatorMatrix.length+
    '; deployable rule/config files present: '+result.possibleRuleFiles.length+
    '; live rules verified: false; report inbox active: false.');
  for(const row of result.existingClientAccess)console.log('CLIENT ACCESS:',row.path,'—',row.client);
}
try{main()}catch(err){console.error('V99-B FAILED',err);process.exitCode=1;}
