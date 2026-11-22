#!/usr/bin/env node
'use strict';
/** V100-J offline mutation safety tests; no Firebase calls, users or secrets. */
const assert=require('node:assert/strict');
const gate=require('./audit_grade11_review_launch_readiness_v100j.cjs');
const snapshot=gate.readSnapshot();
const groups=[];
function pass(label){groups.push(label);console.log('V100-J PASS:',label);}
function mutateFile(path,transform){
 const modified={...snapshot.files,[path]:transform(snapshot.files[path])};
 return {...snapshot,files:modified};
}
function mutateLaunch(path,transform){
 const input=snapshot.launchSnapshot;
 return {...snapshot,launchSnapshot:{...input,sources:{
  ...input.sources,[path]:transform(input.sources[path])
 }}};
}
function mutateOrigin(path,transform){
 const input=snapshot.originSnapshot;
 return {...snapshot,originSnapshot:{...input,files:{
  ...input.files,[path]:transform(input.files[path])
 }}};
}
function main(){
 const result=gate.inspect(snapshot);
 assert.equal(result.version,'V100-J');
 assert.equal(result.currentStudentAction,'COPY ONLY');
 assert.equal(result.noProductionChangesMade,true);
 assert.match(result.finding,/BLOCKED/);
 assert.equal(result.sourceEvidence.originalPublicMcqReferences,2250);
 assert.equal(result.sourceEvidence.studentReportCopyOnly,true);
 assert.equal(result.sourceEvidence.syntheticUnconnectedReviewDeskSourcePresent,true);
 pass('real checkout distinguishes local source proofs from real-world production verification');

 assert.equal(result.unresolvedGates.length,7);
 assert.equal(new Set(result.unresolvedGates.map(x=>x.id)).size,7);
 for(const block of result.unresolvedGates){
  assert.ok(block.id&&block.next&&block.status);
  assert.ok(!/^(approved|enabled|verified|ready)$/i.test(block.status));
 }
 for(const [field,value] of Object.entries(result.productionReadiness)){
  assert.equal(value,false,'unverified production assurance accidentally marked true: '+field);
 }
 pass('all seven independent future release gates remain explicitly blocked or require owner proof');

 assert.throws(()=>gate.inspect(mutateLaunch('practice-engine/index.html',s=>
  s.replace('navigator.clipboard.writeText(text)','fetch("https://example.invalid")'))));
 pass('student Copy-only source drift cannot be described as production-safe');

 assert.throws(()=>gate.inspect(mutateOrigin('portal/firebase-config.js',s=>
  s.replace('physics-with-sir-najam-portal.firebaseapp.com','unauthorized.example.test'))));
 pass('wrong Firebase web identity or site origin inventory fails closed');

 assert.throws(()=>gate.inspect(mutateFile('server/local-http-admin-review-v100a.cjs',s=>
  s.replace("const HOST='127.0.0.1';","const HOST='0.0.0.0';"))));
 assert.throws(()=>gate.inspect(mutateFile('server/local-http-admin-history-v100b.cjs',s=>
  s.replace('isHistoryEnabled=()=>false','isHistoryEnabled=()=>true'))));
 assert.throws(()=>gate.inspect(mutateFile('server/local-http-admin-triage-v100c.cjs',s=>
  s.replace('isTriageEnabled=()=>false','isTriageEnabled=()=>true'))));
 pass('admin queue/history/transition must remain loopback-only and OFF by default');

 assert.throws(()=>gate.inspect(mutateFile(
  'scripts/fixtures/grade11-admin-review-preview-v100e.template.html',s=>
  s+"<script>fetch('/api/grade11/mcq-review')</script>")));
 assert.throws(()=>gate.inspect(mutateFile(
  'scripts/fixtures/grade11-admin-review-preview-v100e.template.html',s=>
  s.replace('SYNTHETIC DEMO · NOT CONNECTED','LIVE ADMIN LOGIN'))));
 pass('fictional preview cannot quietly gain a sender or misleading live-connection claim');

 const missing={...snapshot.files};
 delete missing['scripts/test_grade11_admin_review_preview_v100e.cjs'];
 assert.throws(()=>gate.inspect({...snapshot,files:missing}));
 pass('missing original browser regression evidence blocks readiness inventory');

 assert.ok(!Object.values(result.productionReadiness).some(Boolean));
 assert.ok(result.historicalRuleContext.includes('current live revision NOT checked'));
 assert.ok(!JSON.stringify(result).includes('service-account-private-key'));
 pass('historical owner-copy rules match is not mislabeled an independently fetched live rule revision');
 console.log('V100-J FINISHED: '+groups.length+' offline safety groups PASS; production reporting BLOCKED.');
}
try{main();}catch(e){console.error('V100-J FAILED:',e.message);process.exitCode=1;}
