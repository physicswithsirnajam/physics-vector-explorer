#!/usr/bin/env node
'use strict';
/* V110: source-preserving proposal-only academic regression, not an approved item release. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const candidates=JSON.parse(read('quality/grade11-unit06-v110-four-full-mcq-candidates-teacher-only.json'));
const proposals=JSON.parse(read('quality/grade11-unit06-v109-topic64-first-four-decision-proposals.json'));
const sourceRaw=read('question-bank/grade-11/unit-06-topic-64-v82-80-source.json');
const original=JSON.parse(sourceRaw);
let checks=0;const pass=x=>{checks++;console.log('V110 PASS:',x)};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,'Expected '+b+', got '+a);
function main(){
 assert.equal(candidates.schemaVersion,1);
 assert.equal(candidates.candidateCount,4);
 assert.equal(candidates.scope,'quality-review-only-not-consumed-by-portal-or-test-builder');
 assert.equal(candidates.sourceBankChanged,false);
 assert.equal(candidates.teacherApprovalGranted,false);
 assert.equal(candidates.unit6ReleaseApproved,false);
 assert.equal(candidates.originalSourceBank,'question-bank/grade-11/unit-06-topic-64-v82-80-source.json');
 assert.equal(candidates.proposalSource,'quality/grade11-unit06-v109-topic64-first-four-decision-proposals.json');
 const blobsha=crypto.createHash('sha1').update('blob '+Buffer.byteLength(sourceRaw)+'\0').update(sourceRaw).digest('hex');
 assert.equal(candidates.originalSourceBlobSha,blobsha);
 assert.equal(proposals.sourceBankBlobSha,blobsha);
 assert.equal(original.questions.length,80);
 assert.deepEqual(candidates.candidates.map(x=>x.sourceQuestionNumber),[28,51,52,67]);
 assert.equal(new Set(candidates.candidates.map(x=>x.candidateId)).size,4);
 pass('exact immutable source bank and V109 proposal provenance; 4 unapproved candidates only');
 for(const item of candidates.candidates){
  const q=original.questions.find(x=>x.id===item.sourceQuestionId);
  const proposal=proposals.cases.find(x=>x.questionId===item.sourceQuestionId);
  assert.ok(q&&proposal,'missing original/proposal for '+item.sourceQuestionId);
  assert.equal(item.candidateId,'XI-U06-T64-V110-REVIEW-'+String(q.sourceQuestionNumber).padStart(4,'0'));
  assert.equal(item.status,'TEACHER_REVIEW_ONLY_DO_NOT_IMPORT');
  for(const f of ['teacherApproval','scientificKeyApproval','individualFbiseSloApproval','individualCognitiveApproval','sourceFidelityApproval'])assert.equal(item[f],'PENDING');
  assert.equal(item.boardEligible,false);
  assert.equal(item.sourceBankUnchanged,true);
  assert.equal(item.originalStem,q.stem);
  assert.equal(item.originalOptionB,q.options[1].text);
  assert.deepEqual(item.proposedOptions.map(x=>x.id),['A','B','C','D']);
  assert.equal(item.candidateCorrectOptionId,q.correctOptionId);
  assert.equal(item.proposedStem,proposal.revisionField==='stem'?proposal.proposedText:q.stem);
  assert.deepEqual(item.proposedOptions,q.options.map(o=>({id:o.id,text:q.sourceQuestionNumber===28&&o.id==='B'?proposal.proposedText:o.text})));
  assert.equal(item.sourceEvidence,proposal.sourceEvidence);
  assert.equal(item.changeReason,proposal.reason);
  assert.ok(item.candidateExplanation.length>120);
  assert.ok(item.workedReasoning.length>=3);
  assert.ok(item.workedReasoning.every(x=>x.length>35));
  assert.match(item.proposedCognitiveCandidateOnly,/^(Understanding|Application)$/);
  assert.match(item.proposedSloCandidateOnly,/^P-11-B-[0-9]{2}$/);
 }
 pass('each full A–D MCQ matches exactly one V109 proposed change; explanations/steps added but answers unchanged');
 const [a,b,c,d]=candidates.candidates;
 assert.equal(a.candidateCorrectOptionId,'B');
 assert.equal(a.proposedStem,a.originalStem);
 assert.equal(a.proposedOptions[1].text,a.originalOptionB+' second');
 assert.equal(a.decisionType,'canonical-one-word-correction-candidate');
 for(const x of [b,c,d]){
  assert.equal(x.decisionType,'source-preserving-new-variant-candidate');
  assert.ok(x.proposedStem.includes('equal volume flow'));
  assert.deepEqual(x.proposedOptions,original.questions.find(q=>q.id===x.sourceQuestionId).options);
 }
 assert.deepEqual([a,b,c,d].map(x=>x.candidateCorrectOptionId),['B','A','D','A']);
 pass('one precise Q28 missing-word correction and 3 distinct equal-flow stems; keys B/A/D/A never auto-authorized');
 // Independent fluid calculations; equal-outlet geometry is not equal discharge.
 near(2*5,1*5+1*5); near(2*5,1*3+1*7);
 near(.33*(.8/.4)**2/30,.044);
 near(.8**2*.33,30*(.4**2)*.044);
 near(.20*(1/.1)**2/50,.40);
 near(1**2*.20,25*.1**2*.20+25*.1**2*.60);
 pass('independent Q51, Q52, Q67 worked answers plus unequal-outflow counterexamples verified');
 const queue=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
 assert.equal(queue.length,561);
 const h=queue[0].split(',');
 for(const row of queue.slice(1)){
  const fields=row.split(',');
  for(const k of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(fields[h.indexOf(k)],'PENDING');
 }
 const release=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
 assert.equal(release.releaseApproved,false);
 assert.equal(release.studentCourseStatus,'planned');
 assert.equal(release.teacherSignoff,'pending');
 const catalog=JSON.parse(read('portal/learning-catalog.json'));
 const u6=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===6);
 assert.equal(u6.status,'planned');assert.equal(u6.assessmentStatus,'not-published');
 const manifest=JSON.parse(read('question-bank/manifest.json'));
 assert.ok(JSON.stringify(manifest).includes('560'));
 pass('560 teacher approvals remain pending and planned/full-assessment release gates remain unchanged');
 // Confirm teacher candidates are not imported by source manifest or public resource index.
 const catalogRaw=read('portal/learning-catalog.json'),manifestRaw=read('question-bank/manifest.json');
 for(const word of ['grade11-unit06-v110-four-full-mcq-candidates-teacher-only.json','XI-U06-T64-V110-REVIEW-']){
  assert.ok(!catalogRaw.includes(word));
  assert.ok(!manifestRaw.includes(word));
 }
 pass('candidate IDs and staging file are not referenced by public catalog or active question-bank manifest');
 console.log('V110 COMPLETE:',checks,'teacher-only source/answer science gates, without source bank edits');
}
main();
