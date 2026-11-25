#!/usr/bin/env node
'use strict';
/**
 * V160: offline deployment-readiness NO-GO source audit.
 * Requires all 12 gates BLOCKED until independent production evidence exists.
 * No external network, Firebase SDK, credential lookup or deploy command.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const planPath='quality/unit07/topic71-v160-production-readiness-no-go.json';
const notePath='quality/grade11-v160-teacher-deployment-security-architecture.md';
const sourcePath='quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json';
const candidatePath='quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv';
const SRC_HASH='930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58';
const requiredSlugs=[
 'owner-deployment-consent','production-backend-runtime','auth-role-provisioning',
 'private-firestore-rules-compatibility','app-check-real-browser-attestation',
 'cross-origin-auth-csrf','source-content-provenance','teacher-academic-signoff',
 'publication-scored-release','staging-browser-abuse-qa',
 'operations-cost-data-governance','teacher-student-scope'
];
function check(){
 const p=load(planPath),note=read(notePath),source=load(sourcePath);
 const manifest=load('question-bank/manifest.json');
 const catalog=load('portal/learning-catalog.json');
 const web=read('portal/firebase-config.js');
 const service=read('server/local-topic71-teacher-review-pilot-v155.cjs');
 const server=read('server/local-topic71-browser-review-v158.cjs');
 const client=read('local-dev/topic71-teacher-review-v158.js');
 const fixture=read('security-proposals/v142/teacher-classroom-isolated.rules');
 const localBrowser=read('scripts/test_grade11_v159_local_chromium_teacher_review.cjs');
 const originalRulesCheck=read('scripts/compare_grade11_published_rules_snapshot_v99t.cjs');
 assert.equal(p.schemaVersion,1);
 assert.equal(p.version,'V160');assert.equal(p.dateAsOf,'2026-11-25');
 assert.equal(p.reviewType,'REPOSITORY_SOURCE_ONLY_NO_CONSOLE_CREDENTIALS');
 assert.equal(p.environment,'PRODUCTION_DEPLOYMENT_NOT_AUTHORIZED');
 assert.equal(p.decision,'NO_GO_DEPLOYMENT_BLOCKED');
 for(const key of [
   'ownerDeploymentConsent','goLiveApproved','productionBackendPresentInRepo',
   'productionBackendDeployedEvidence','firebaseProductionRulesIndependentlyVerified',
   'productionAppCheckCurrentEnforcementConfirmed',
   'productionTeacherRoleIssuanceEnabled','changesLiveConfiguration',
   'changesStudentScoring','changesFirebaseConsole','changesSecurityRules',
   'containsCredentials','containsPrivateKeyedAnswers',
   'originalPrivateKeysInPublicRepo'])
  assert.equal(p[key],false,key+' may not be set true by source-only evidence');
 assert.equal(p.teacherScientificApprovals,0);assert.equal(p.teacherCognitiveApprovals,0);
 assert.equal(p.unit7StudentScoredMcqCount,0);
 assert.equal(p.lastVerifiedLocalMilestone,'V159');assert.equal(p.lastVerifiedLocalPr,260);
 assert.equal(p.originalPilotMode,'LOCAL_EMULATOR_ONLY');
 assert.equal(p.sourceWordSha256,SRC_HASH);
 assert.equal(p.sourceWordSha256,source.sourceOriginalOwnerDocxSha256);
 assert.equal(p.teacherDecisionQueue,sourcePath);
 assert.equal(p.currentWorkingCandidates,candidatePath);
 assert.equal(source.version,'V154');assert.equal(source.entries.length,80);
 assert.equal(source.teacherScienceSignoffs,0);assert.equal(source.teacherCognitiveSignoffs,0);
 assert.equal(source.unit7ScoredReleaseCount,0);
 assert.deepEqual(p.sensitiveSourceReleaseBlockers,[10,15,62,76]);
 assert.deepEqual(p.candidateKeyExplanationBlockingCorrections,[10,76]);
 assert.deepEqual(p.previewQuestions,[10,15,62,76]);
 assert.equal(read(candidatePath).trimEnd().split('\n').length,80);
 assert.deepEqual(p.originalStudentBankCounts,[275,206,220,640,349,560]);
 assert.deepEqual(manifest.grades.find(x=>x.grade===11).units.map(x=>x.liveMcqCount),
  p.originalStudentBankCounts);
 assert.equal(p.unit6PendingTeacherDecisions,560);
 const u6=load('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(u6.teacherSignoff,'pending');assert.equal(u6.releaseApproved,false);
 const u7=catalog.grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
 assert.equal(u7.status,'planned');assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.ok(!fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')));
 assert.ok(!fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07-topic71.json')));
 assert.equal(p.architectureOptions.length,2);
 assert.deepEqual(p.architectureOptions.map(x=>x.id),['A','B']);
 for(const item of p.architectureOptions){
  assert.equal(item.decision,'CANDIDATE_NOT_SELECTED');
  assert.equal(item.exposesFirebaseAdminToBrowser,false);
 }
 assert.deepEqual(p.blockingGates.map(g=>g.id),
  Array.from({length:12},(_,i)=>'G'+String(i+1).padStart(2,'0')));
 assert.deepEqual(p.blockingGates.map(g=>g.slug),requiredSlugs);
 assert.equal(new Set(p.blockingGates.map(g=>g.id)).size,12);
 for(const gate of p.blockingGates){
  assert.equal(gate.status,'BLOCKED');
  assert.equal(gate.ownerDecision,'PENDING');
  assert.equal(gate.evidence,'NOT_ESTABLISHED_FOR_PRODUCTION');
  assert.equal(gate.deploymentAllowed,false);
  assert.ok(gate.requirement.length>58);
 }
 assert.deepEqual(p.verifiedLocalEvidence.map(x=>x.id),[
  'LOCAL-155','LOCAL-156','LOCAL-157','LOCAL-158','LOCAL-159'
 ]);
 assert.ok(p.verifiedLocalEvidence.every(x=>x.status==='PASSED_IN_CI'));
 assert.deepEqual(p.doNotDeploy,[
  'security-proposals/v142/teacher-classroom-isolated.rules',
  'server/local-topic71-teacher-review-pilot-v155.cjs',
  'server/local-topic71-browser-review-v158.cjs',
  'local-dev/topic71-teacher-review-v158.js'
 ]);
 assert.ok(p.knownPublicWebsiteContext.includes(
  'physicswithsirnajam.github.io/physics-vector-explorer/'));
 assert.ok(p.knownFirebasePublicProjectContext.includes('physics-with-sir-najam-portal'));
 assert.ok(web.includes('physics-with-sir-najam-portal'));
 // Source-only fixed blocks; these checks intentionally cannot prove real
 // Firebase Console state, live DNS, account roles or production Rules.
 assert.ok(fixture.includes('NEVER DEPLOY'));
 assert.ok(fixture.includes('allow read, write: if false;'));
 assert.ok(service.includes('process.env.GOOGLE_APPLICATION_CREDENTIALS'));
 assert.ok(service.includes('FIRESTORE_EMULATOR_HOST'));
 assert.ok(service.includes('FIREBASE_AUTH_EMULATOR_HOST'));
 assert.ok(service.includes('verifyIdToken(token,true)'));
 assert.ok(service.includes("!reviewers.has(claims.uid)"));
 assert.ok(server.includes("const HOST='127.0.0.1'"));
 assert.ok(server.includes("const SWITCH='PSN_LOCAL_TOPIC71_BROWSER_REVIEW'"));
 assert.ok(server.includes("if(!localOnly())throw Error"));
 assert.ok(client.includes("'demo-psn-v143-classrooms'"));
 assert.ok(client.includes('connectAuthEmulator'));
 assert.ok(client.includes('inMemoryPersistence'));
 assert.ok(localBrowser.includes("const {chromium}=require('playwright')"));
 assert.ok(localBrowser.includes('accessibility(page'));
 assert.ok(localBrowser.includes('scoredReleaseApproved,false'));
 assert.ok(originalRulesCheck.includes('BASELINE_SHA'));
 assert.ok(originalRulesCheck.includes('REQUIRED_LINES'));
 assert.ok(!fs.existsSync(path.join(ROOT,'firebase.json')));
 assert.ok(!fs.existsSync(path.join(ROOT,'.firebaserc')));
 assert.ok(!fs.existsSync(path.join(ROOT,'functions/package.json')));
 for(let i=1;i<=12;i++){
  const id='G'+String(i).padStart(2,'0');
  assert.ok(note.includes(id+' —'),notePath+' lacks gate '+id);
 }
 for(const phrase of [
  'NO-GO','GitHub Pages','Hosting','Cloud Functions',
  'App Check','Admin SDK','CSRF','NEVER','teacher',
  'Q10','Q15','Q62','Q76','80/80','Unit7 MCQs',
  'not academic signoff','No Firebase Console action']){
  assert.ok(note.toLowerCase().includes(phrase.toLowerCase()),
   notePath+' lacks '+phrase);
 }
 assert.equal(p.nextMilestone,'V161_STAGING_TEACHER_AUTH_AND_BACKEND_CONTRACT_DESIGN_WITHOUT_RELEASE');
 const count={
  version:'V160',result:'NO_GO_DEPLOYMENT_BLOCKED',
  productionGoLiveAuthorized:false,productionTeacherFunctionDeployed:false,
  currentLiveRulesVerified:false,sourceVerifiedLocalMilestones:5,
  deploymentGatesPassed:0,blockedProductionGates:12,
  academicTeacherSignoffs:0,unit7ScoredQuestions:0,
  currentGrade11ProvisionalItems:2250,
  originalUnit6TeacherPending:560,
  originalWordOrAnswerKeyIncluded:false
 };
 const out=path.join(ROOT,'qa-artifacts/grade11-v160-teacher-production-readiness');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(count,null,2)+'\n');
 console.log('V160 PASS: honest NO-GO, 12 blocked live gates, V155–V159 local-only; 0 academic signoffs / 0 Unit7 scored items');
}
try{check()}catch(e){console.error('V160 AUDIT FAILED:',e.stack||e);process.exitCode=1;}
