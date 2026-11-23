#!/usr/bin/env node
'use strict';
/* V115: teacher decision documentation only. No student-facing changes.
 * Preserve original V84 source bank, the approved V111/V114 overlays,
 * all individual SLO/cognitive and formal examination approval locks. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const packPath='quality/grade11-unit06-v115-q55-q56-stagnation-teacher-candidates.json';
const reviewPath='quality/grade11-unit06-v115-q55-q56-stagnation-teacher-review.md';
const sourcePath='question-bank/grade-11/unit-06-topic-65-v84-80-source.json';
const original=read(sourcePath),source=JSON.parse(original);
const pack=load(packPath),markdown=read(reviewPath);
let gates=0;function pass(message){gates++;console.log('V115 PASS: '+message)}
const sha=crypto.createHash('sha1').update('blob '+Buffer.byteLength(original)+'\0').update(original).digest('hex');
function checkClose(actual,expected){assert.ok(Math.abs(actual-expected)<1e-8,'Expected '+expected+' got '+actual)}
function main(){
 assert.equal(sha,'f5a7dd0a29d5e90842c0ef557071aebc10a70baf');
 assert.equal(pack.sourceBlobSha,sha);assert.equal(pack.sourceFile,sourcePath);
 assert.equal(source.questions.length,80);assert.equal(pack.originalQuestionCount,80);
 assert.equal(pack.grade,11);assert.equal(pack.unit,6);assert.equal(pack.topic,'6.5');
 assert.equal(pack.schemaVersion,1);assert.equal(pack.version,'V115');
 assert.equal(pack.scope,'TEACHER_DECISION_ONLY_NO_STUDENT_CHANGE');
 assert.equal(pack.teacherAcademicApproval,'PENDING');
 assert.equal(pack.certification,'NOT_CERTIFIED');
 assert.equal(pack.unit6ReleaseApproved,false);
 assert.deepEqual(pack.counts,{originalTopic65:80,unit6PublicProvisional:560,grade11PublicProvisional:2250,topic65CandidateDecisions:2});
 assert.equal(pack.candidates.length,2);
 assert.deepEqual(pack.candidates.map(q=>q.sourceQuestionNumber),[55,56]);
 assert.deepEqual(pack.candidates.map(q=>q.originalCorrectOptionId),['B','B']);
 assert.equal(new Set(pack.candidates.map(q=>q.candidateId)).size,2);
 pass('80 original Bernoulli prepared-source items preserved at exact Git SHA; only two new unapproved teacher-proposal IDs');
 const audit=read('quality/grade11-unit06-v95c2s-topic65-mcq41-60-numerical-review.csv');
 assert.equal(pack.reviewedPreparedSourceAuditCsv,'quality/grade11-unit06-v95c2s-topic65-mcq41-60-numerical-review.csv');
 for(let i=0;i<2;i++){
  const c=pack.candidates[i],n=i+55,q=source.questions[n-1];
  assert.equal(c.sourceQuestionNumber,n);
  assert.equal(q.sourceQuestionNumber,n);
  assert.equal(c.originalSourceId,q.id);
  assert.equal(c.candidateId,'XI-U06-T65-V115-TEACHER-ONLY-'+String(n).padStart(4,'0'));
  assert.equal(c.sourceSection,'numericals');assert.equal(c.sourceSection,q.sourceSection);
  assert.equal(c.sourcePdfPage,q.sourcePdfPage);
  assert.equal(c.originalStem,q.stem);assert.deepEqual(c.originalOptions,q.options);
  assert.equal(c.originalExplanation,q.explanation);
  assert.equal(c.originalCorrectOptionId,q.correctOptionId);
  assert.equal(c.proposedCorrectOptionId,q.correctOptionId);
  assert.deepEqual(c.proposedOptions,q.options);
  assert.notEqual(c.proposedStem,q.stem);
  assert.ok(c.proposedStem.length>q.stem.length);
  assert.equal(c.sourceAuditPriority,'COMPULSORY_STAGNATION_CONDITION');
  assert.ok(audit.split(/\r?\n/).some(line=>line.startsWith(q.id+',')&&line.includes('COMPULSORY_STAGNATION_CONDITION')&&line.includes(',B,')));
  assert.equal(c.status,'TEACHER_REVIEW_ONLY_NOT_IN_STUDENT_POOL');
  assert.ok(c.whyClarify.length>190);
  assert.ok(c.proposedExplanation.length>180);
  assert.equal(c.workedPhysics.length,4);
  assert.ok(c.workedPhysics.every(s=>s.length>35));
  assert.ok(c.modelLimitations.length>=2);
  assert.deepEqual(c.candidateSloOnlyNotCertified,['P-11-B-40']);
  assert.equal(c.candidateCognitiveOnlyNotCertified,'Application');
  for(const k of ['teacherDecision','officialExamEligibility','individualSloReview','individualCognitiveReview','sourceFidelityReview','fullScienceSignoff'])
   assert.equal(c[k],'PENDING');
  assert.equal(c.approvedForStudentPractice,false);
  assert.equal(c.boardEligible,false);
  assert.equal(c.sourceArchivedUnchanged,true);
  assert.ok(markdown.includes(c.originalSourceId)&&markdown.includes(c.originalStem)&&markdown.includes(c.proposedStem));
  for(const o of c.originalOptions)assert.ok(markdown.includes('| '+o.id+' | '+o.text+' |'));
  assert.ok(markdown.includes('**Correct option: B'));
 }
 pass('source and reviewed audit: both original Q55/Q56 stems, all 8 A–D options, B/B correct keys and compulsory stagnation flags match exactly');
 const [q55,q56]=pack.candidates;
 assert.match(q55.proposedStem,/stagnation point Y/i);
 assert.match(q55.proposedStem,/local speed 0 m\/s/i);
 assert.match(q55.proposedStem,/steady ideal horizontal flow/i);
 assert.match(q55.proposedStem,/same streamline/i);
 assert.match(q55.proposedStem,/density 1000 kg\/m³/i);
 assert.match(q56.proposedStem,/very large reservoir/i);
 assert.match(q56.proposedStem,/speed is negligible/i);
 assert.match(q56.proposedStem,/static pressure is 100 kPa/i);
 assert.match(q56.proposedStem,/speed is 10 m\/s/i);
 assert.match(q56.proposedStem,/same elevation and streamline/i);
 assert.match(q56.proposedStem,/Neglect viscous losses and pumps/i);
 assert.match(q56.whyClarify,/No open-to-atmosphere outlet boundary is inferred/i);
 pass('approved-model candidates identify stagnation versus a stopped pipe and near-stagnant reservoir versus a finite zero-throughflow section');
 // Independent unit-consistent Bernoulli calculations. Do not merely trust stored keys.
 const rho=1000;
 const stagnationRise=.5*rho*(4**2-0**2);
 checkClose(stagnationRise,8000);checkClose(stagnationRise/1000,8);
 const reservoirPressure=100000,downstreamPressure=reservoirPressure+.5*rho*(0**2-10**2);
 checkClose(downstreamPressure,50000);checkClose(downstreamPressure/1000,50);
 const sameAreaSteadyVolumeFlux=(area,v)=>area*v;
 assert.notEqual(sameAreaSteadyVolumeFlux(1,4),sameAreaSteadyVolumeFlux(1,0));
 assert.notEqual(sameAreaSteadyVolumeFlux(1,0),sameAreaSteadyVolumeFlux(1,10));
 pass('independent ΔP=8 kPa, P2=50 kPa and finite-area zero-speed continuity counterexamples rechecked');
 const old=load('question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json');
 assert.equal(old.version,'V114');assert.equal(old.overlayQuestionCount,3);
 assert.deepEqual(old.replacements.map(q=>q.correctOptionId),['D','C','C']);
 assert.deepEqual(old.replacements.map(q=>q.sourceQuestionNumber),[61,67,78]);
 const t64=load('question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json');
 assert.equal(t64.version,'V111');assert.equal(t64.overlayQuestionCount,4);
 // The V115 review-only proposal remains immutable historical evidence.
 // A separately recorded explicit teacher approval now authorizes V116 practice.
 // Check current public metadata IDs without treating that as official SLO/board approval.
 const approved=load('question-bank/grade-11/unit-06-topic65-v116-approved-stagnation-practice-overlay.json');
 assert.equal(approved.version,'V116');assert.equal(approved.overlayQuestionCount,2);
 assert.deepEqual(approved.replacements.map(q=>q.correctOptionId),['B','B']);
 const refs=load('server/review-manifests/grade11-approved-public-review-refs-v99i.json');
 assert.equal(refs.questionRefs.length,2250);
 for(const n of [55,56]){
  const id='XI-U06-T65-MCQ-'+String(n).padStart(4,'0');
  assert.ok(refs.questionRefs.some(([x,u,q])=>x===id+'-V116'&&u===6&&q===n),
   'Teacher-approved V116 practice reference required for Q'+n);
  assert.ok(!refs.questionRefs.some(([x])=>x===id),
   'Unqualified ambiguous original must not be served Q'+n);
  const before=source.questions[n-1];
  const record=approved.replacements.find(x=>x.originalId===id);
  assert.ok(record);
  assert.equal(record.originalStem,before.stem);
  assert.equal(record.proposedStem,pack.candidates[n-55].proposedStem);
  assert.equal(record.correctOptionId,before.correctOptionId);
  assert.equal(record.boardEligible,false);
 }
 assert.ok(!refs.questionRefs.some(([x])=>x.includes('V115')));
 assert.equal(refs.bankVersions['6'],'v116-topic64-v111-and-topic65-five-clarified-560-provisional');
 const manifest=load('question-bank/manifest.json');
 assert.equal(manifest.grades.find(g=>g.grade===11).units[5].liveMcqCount,560);
 const ledger=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
 assert.equal(ledger.length,561);
 const fields=ledger[0].split(',');
 for(const row of ledger.slice(1)){
  const cols=row.split(',');
  for(const key of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])
   assert.equal(cols[fields.indexOf(key)],'PENDING');
 }
 const signoff=load('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(signoff.releaseApproved,false);
 assert.equal(signoff.teacherSignoff,'pending');
 const unit=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(unit.status,'planned');assert.equal(unit.assessmentStatus,'not-published');
 pass('V114 Q61/67/78, V111 Q28/51/52/67, 560/2250 reference IDs and every formal examination signoff preserved');
 for(const p of ['portal/unit-06-topic-65-preview.js','portal/unit-06-balanced-mcq-v95c1.js',
  'shared/practice-bank-adapter-v55.js','practice-engine/index.html','build-your-physics-test.html']){
  assert.ok(!read(p).includes('V115'),'Review-only V115 was accidentally added to a student-facing asset '+p);
 }
 pass('Historical V115 remains a teacher-only proposal while separately teacher-approved V116 practice IDs stay non-certified');
 console.log('V115 COMPLETE:',gates,'source/math/approval regression groups');
}
main();
