#!/usr/bin/env node
'use strict';
/* V109: teacher-decision PROPOSALS only. Never mutate original banks or approvals. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const evidence=JSON.parse(read('quality/grade11-unit06-v109-topic64-first-four-decision-proposals.json'));
const bankRaw=read('question-bank/grade-11/unit-06-topic-64-v82-80-source.json');
const bank=JSON.parse(bankRaw);
const queueRaw=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv');
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
let checks=0;
function pass(label){checks++;console.log('V109 PASS:',label)}
function approx(actual,expected,description){assert.ok(Math.abs(actual-expected)<1e-9,description+': expected '+expected+', got '+actual)}
function main(){
 assert.equal(evidence.schemaVersion,1);assert.equal(evidence.grade,11);
 assert.equal(evidence.unit,6);assert.equal(evidence.topic,'6.4');
 assert.equal(evidence.status,'proposal-only-teacher-approval-pending');
 assert.equal(evidence.cases.length,4);
 assert.deepEqual(evidence.cases.map(x=>x.sourceQuestionNumber),[28,51,52,67]);
 assert.equal(evidence.sourceQuestionCount,80);
 const sha=crypto.createHash('sha1').update('blob '+Buffer.byteLength(bankRaw)+'\0').update(bankRaw).digest('hex');
 assert.equal(evidence.sourceBankBlobSha,sha,'Source bank changed from exact original reviewed state');
 assert.equal(bank.questions.length,80);
 assert.equal(bank.unitReleaseStatus,'planned-partial-topic-preview');
 assert.equal(bank.perQuestionFrameworkMappingStatus,'not individually verified');
 for(const c of evidence.cases){
  const q=bank.questions.find(x=>x.id===c.questionId);
  assert.ok(q,'Missing source question '+c.questionId);
  assert.equal(q.sourceQuestionNumber,c.sourceQuestionNumber);
  assert.equal(q.correctOptionId,c.sourceCorrectOptionId);
  assert.deepEqual(q.options.map(o=>o.id),['A','B','C','D']);
  assert.equal(q.options.length,4);
  const original=c.revisionField==='stem'?q.stem:q.options.find(o=>o.id==='B').text;
  assert.equal(c.originalFieldText,original,'Proposal no longer matches exact public source content');
  assert.ok(c.proposedText!==original);
  assert.ok(c.teacherDecision==='PENDING'&&!c.bankChangeAuthorized);
  assert.equal(c.individualFbiseExamCertification,'PENDING');
  assert.equal(c.originalCanRemainForCertifiedExam,false);
  assert.equal(q.boardEligible,false);
  assert.deepEqual(q.sloCodes,[]);
  assert.equal(q.cognitiveLevel,'Unspecified');
  assert.equal(q.status,'provisional-public-self-practice');
  assert.ok(c.reason.length>60&&c.sourceEvidence.length>80);
 }
 pass('four exact source IDs, answer letters and existing bank digest preserved; every candidate remains pending and non-certified');

 const [q28,q51,q52,q67]=evidence.cases;
 assert.equal(q28.sourceCorrectOptionId,'B');
 assert.equal(q28.revisionField,'options.B.text');
 assert.equal(q28.proposedText,q28.originalFieldText+' second');
 assert.ok(q28.proposedAction==='amend_one_option_after_teacher_approval');
 assert.equal(q28.keepOriginalAsProvisionalAndAddVariantInstead,false);
 for(const c of [q51,q52,q67]){
  assert.equal(c.revisionField,'stem');
  assert.ok(c.proposedText.includes('equal volume flow'));
  assert.ok(c.keepOriginalAsProvisionalAndAddVariantInstead);
  assert.equal(c.proposedAction,'keep_original_provisional_add_clarified_variant_after_teacher_approval');
 }
 assert.equal(q51.sourceCorrectOptionId,'A');
 assert.equal(q52.sourceCorrectOptionId,'D');
 assert.equal(q67.sourceCorrectOptionId,'A');
 assert.ok(q52.sourceEvidence.includes('pp.98–99'),'Printed-source Q52 addendum omitted');
 assert.ok(q28.sourceEvidence.includes('p.140'),'Master-source omission provenance missing');
 pass('Q28 one-word exact correction differs from three separately proposed equal-flow variant stems');

 // Recalculate independent physics and show the inadequacy of original equal-radius-only stems.
 // Q51 inlet 2 cm² at 5 m/s, two 1 cm² branches.
 approx(2*5,1*5+1*5,'Q51 equal distribution');
 approx(2*5,1*3+1*7,'Q51 unequal distribution is also possible');
 // Q52 30 identical-radius outlets, printed 0.8 and 0.4 cm, inlet speed 0.33 m/s.
 const v52=(0.8/0.4)**2*.33/30;
 approx(v52,0.044,'Q52 equal-branch speed');
 approx(0.8**2*.33,30*.4**2*v52,'Q52 total area-weighted flow');
 // Q67 50 identical-radius outlets, initial speed 0.20 m/s.
 const v67=(1/.1)**2*.20/50;
 approx(v67,.4,'Q67 equal-flow branch speed');
 approx(1**2*.20,25*.1**2*.20+25*.1**2*.60,'Q67 unequal distribution also conserves flow');
 pass('Q51/Q52/Q67 calculations and counterexamples prove equal branch geometry alone cannot determine individual speed');

 // No grade release, fictional certification or approval changing from merging a proposals-only PR.
 assert.equal(signoff.releaseApproved,false);
 assert.equal(signoff.teacherSignoff,'pending');
 assert.equal(signoff.studentCourseStatus,'planned');
 assert.equal(signoff.currentPublicBank.unit6,560);
 assert.equal(signoff.currentPublicBank.grade11,2250);
 assert.equal(signoff.currentPublicBank.authenticSharedStimulusGroups,0);
 const grade11=catalog.grades.find(g=>g.grade===11||g.gradeId==='11'||g.gradeId==='XI'||g.grade==='XI');
 assert.ok(grade11,'Missing Grade XI catalog');
 const u6=grade11.units.find(u=>u.unit===6);
 assert.ok(u6,'Missing Unit 6 catalog');
 assert.equal(u6.status,'planned');assert.equal(u6.assessmentStatus,'not-published');
 const queueLines=queueRaw.trimEnd().split(/\r?\n/);
 assert.equal(queueLines.length,561,'560-row authoritative teacher queue changed');
 const header=queueLines[0].split(',');
 for(const h of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.ok(header.includes(h));
 for(const line of queueLines.slice(1)){
  const fields=line.split(',');
  for(const h of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(fields[header.indexOf(h)],'PENDING');
 }
 pass('all 560 authoritative teacher approvals PENDING; official course, SLO and graded launch locks remain closed');

 for(const p of [
 'quality/grade11-unit06-v95c2n-topic64-mcq21-40-conceptual-review.csv',
 'quality/grade11-unit06-v95c2o-topic64-mcq41-60-numerical-review.csv',
 'quality/grade11-unit06-v95c2p-topic64-mcq61-80-scenario-review.csv',
 'quality/grade11-unit06-v95c2s-original-nbf-image-verification.md',
 'quality/grade11-unit06-v95c3c-consolidated-teacher-review-roadmap.md'
 ])assert.ok(read(p).length>100,'Source review evidence missing '+p);
 for(const [q,p] of [[28,'quality/grade11-unit06-v95c2n-topic64-mcq21-40-conceptual-review.csv'],[51,'quality/grade11-unit06-v95c2o-topic64-mcq41-60-numerical-review.csv'],[52,'quality/grade11-unit06-v95c2o-topic64-mcq41-60-numerical-review.csv'],[67,'quality/grade11-unit06-v95c2p-topic64-mcq61-80-scenario-review.csv']]){
  const id='XI-U06-T64-MCQ-'+String(q).padStart(4,'0');
  assert.ok(read(p).includes(id),'Missing existing specific source review '+id);
 }
 pass('each of the four proposals cross-references already merged scientific review evidence');
 console.log('V109 COMPLETE:',checks,'proposal-only gates passed; no bank edits, grade release or teacher approvals');
}
main();
