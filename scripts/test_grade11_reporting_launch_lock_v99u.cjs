#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {
 CRITICAL,auditLaunchLock,repositorySnapshot
}=require('./audit_grade11_reporting_launch_lock_v99u.cjs');

const fixture=repositorySnapshot();
const cases=[];
function pass(label){cases.push(label);console.log('V99-U PASS:',label);}
function clone(){return{
 trackedPaths:[...fixture.trackedPaths],
 sources:{...fixture.sources}
};}
function mutateFile(f,path,oldText,newText){
 assert.ok(typeof f.sources[path]==='string');
 assert.ok(f.sources[path].includes(oldText),
  'Baseline fixture anchor unavailable: '+path);
 f.sources[path]=f.sources[path].replace(oldText,newText);
}
function denied(label,transform){
 const value=clone();
 transform(value);
 assert.throws(()=>auditLaunchLock(value),/V99-U LAUNCH LOCK:/);
 pass(label);
}
const initial=auditLaunchLock(fixture);
assert.equal(initial.studentReportInterface,'COPY_ONLY');
assert.equal(initial.genuineSignedAppCheckPositiveVerified,false);
assert.equal(initial.safeToEnableStudentReporting,false);
assert.equal(initial.productionReportingEndpointDeployed,false);
assert.equal(initial.checkedCriticalFiles,CRITICAL.length);
pass('original live website and undeployed local Firebase gates pass the copy-only/disabled guard');

denied('removing student-facing copy-only delivery truth is blocked',f=>{
 mutateFile(f,'practice-engine/index.html',
  'no report has been sent automatically.',
  'Your report has now been sent to the teacher.');
});
denied('a student-side live POST added to issue handler is blocked',f=>{
 mutateFile(f,'practice-engine/index.html',
  'await navigator.clipboard.writeText(text);',
  "await fetch('/api/grade11/mcq-review',{method:'POST',body:text});"+
   '\n   await navigator.clipboard.writeText(text);');
});
denied('removing the report clipboard control is blocked',f=>{
 mutateFile(f,'practice-engine/index.html',
  "async function copyMcqIssue(){",
  "async function submitMcqIssue(){");
});
denied('inserting live reporting route into practice page is blocked',f=>{
 f.sources['practice-engine/index.html']+=
  "\n<!-- new live /api/grade11/mcq-review route -->";
});
denied('removing genuine Admin App Check SDK verifyToken call is blocked',f=>{
 mutateFile(f,'server/offline-admin-appcheck-v99l.cjs',
  'adminAppCheck.verifyToken(token,{consume:false})',
  'JSON.parse(Buffer.from(token.split(".")[1],"base64").toString("utf8"))');
});
denied('changing the App Check adapter into a non-demo environment is blocked',f=>{
 mutateFile(f,'server/offline-admin-appcheck-v99l.cjs',
  "DEMO_PROJECT='demo-psn-v99f-firestore'",
  "DEMO_PROJECT='physics-with-sir-najam-portal'");
});
denied('turning on report intake by default is blocked',f=>{
 mutateFile(f,'server/local-report-switch-v99m.cjs',
  'isEnabled=()=>false','isEnabled=()=>true');
});
denied('turning on administrator triage by default is blocked',f=>{
 mutateFile(f,'server/local-admin-review-transitions-v99q.cjs',
  'isTriageEnabled=()=>false','isTriageEnabled=()=>true');
});
denied('turning on private admin audit history by default is blocked',f=>{
 mutateFile(f,'server/local-admin-audit-history-v99r.cjs',
  'isHistoryEnabled=()=>false','isHistoryEnabled=()=>true');
});
denied('removing explicit localhost test flag is blocked',f=>{
 mutateFile(f,'server/local-http-review-ingress-v99n.cjs',
  "PSN_LOCAL_HTTP_REHEARSAL!=='enabled-local-test-only'",
  "PSN_LOCAL_HTTP_REHEARSAL!=='enabled-production'");
});
denied('adding deployable Firebase manifests is blocked',f=>{
 f.trackedPaths.push('firebase.json');
});
denied('adding serverless function implementation requires a deliberate security review',f=>{
 f.trackedPaths.push('functions/index.js');
});
denied('adding a Firebase deployment workflow is blocked',f=>{
 f.trackedPaths.push('.github/workflows/ship-report.yml');
 f.sources['.github/workflows/ship-report.yml']=
  'name: accidental Firebase deployment\njobs:\n  deploy:\n    steps:\n      - run: firebase deploy --only functions\n';
});
denied('shipping a Firebase App Check debug provider in public JS is blocked',f=>{
 f.trackedPaths.push('portal/test-debug.js');
 f.sources['portal/test-debug.js']='self.FIREBASE_APPCHECK_DEBUG_TOKEN=true;';
});
denied('a launch approval artifact without explicit lock migration is blocked',f=>{
 f.trackedPaths.push('release/grade11-mcq-report-production-approval.json');
});
denied('removing the trusted request App Check check is blocked',f=>{
 mutateFile(f,'server/offline-review-request-gate-v99k.cjs',
  'verifyAppCheckToken(parsed.appCheckToken)',
  'verifyAppCheckToken("accept-anything")');
});
denied('changing original public Firebase web project silently is blocked',f=>{
 mutateFile(f,'portal/firebase-config.js',
  'physics-with-sir-najam-portal','different-firebase-project');
});
console.log('V99-U FINISHED: '+cases.length+
 ' test groups. Static guard is NOT a genuine signed Firebase App Check acceptance test.');
