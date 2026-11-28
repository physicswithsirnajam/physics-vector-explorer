#!/usr/bin/env node
'use strict';
/* V237 — review-only NBF XI Unit8 end MCQs 1–6. No student answers/option keys. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const review=json('quality/unit08/unit08-v237-end-mcq01-06-review-no-keys.json');
const audit=read('quality/unit08/unit08-v237-end-mcq01-06-academic-triage.md');
const source=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const inventory=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const catalog=json('portal/learning-catalog.json');
const banks=json('question-bank/manifest.json');
assert.equal(review.schema,'psn-nbf-grade11-unit08-end-exercise-mcq-qc-v237');
assert.equal(review.version,'V237');
assert.equal(review.originalSource.sourceSha256,source.originalTextbook.sha256);
assert.equal(review.originalSource.sourceSha256,inventory.source.sha256);
assert.deepEqual(review.originalSource.printedPages,[150,151]);
assert.deepEqual(review.originalSource.batchNumbers,[1,2,3,4,5,6]);
assert.equal(review.items.length,6);
assert.deepEqual(review.items.map(x=>x.sourceNumber),['1','2','3','4','5','6']);
assert.deepEqual(review.items.map(x=>x.printedPages),[[150],[150],[150],[150],[151],[151]]);
assert.equal(inventory.sourceSections.find(x=>x.kind==='mcq').items.length,18);
assert.equal(inventory.observedTotal,50);
const sourceItems=inventory.sourceSections.find(x=>x.kind==='mcq').items;
const official=source.officialFramework.slos;
for(const item of review.items){
 const src=sourceItems.find(x=>x.sourceNumber===item.sourceNumber);
 assert.ok(src,'Missing original source-number in V235: '+item.sourceNumber);
 assert.deepEqual(item.printedPages,src.printedPages,'V237 page does not match original visual inventory');
 assert.ok(item.focus.length>=30&&item.reason.length>=65);
 assert.equal(item.studentRelease,'HOLD');
 assert.equal(item.candidateOptionPublished,false);
 assert.equal(item.teacherReview,'PENDING');
 assert.equal(item.keepOriginal,true);
 assert.ok(['not required','optional teaching note','compulsory for single-best-answer assessment'].includes(item.amendment));
 const slo=official.find(x=>x.printedCode===item.candidateSummativeSlo);
 assert.ok(slo,'Candidate SLO must use printed original FBISE identifier');
 assert.equal(slo.assessment,'Summative');
 assert.ok(slo.cognitive.includes(item.candidateCognitive),'Candidate cognitive category must exist in framework outcome');
 assert.ok(['direct','indirect; original official outcome primarily addresses First Law heat/work and process sign','weak / indirect; framework does not explicitly require classifying human metabolism as a simple ideal thermodynamic path'].includes(item.sloFit));
}
assert.deepEqual(review.items.filter(x=>x.amendment==='compulsory for single-best-answer assessment').map(x=>x.sourceNumber),['2','3']);
assert.deepEqual(review.items.filter(x=>x.amendment==='optional teaching note').map(x=>x.sourceNumber),['1']);
assert.deepEqual(review.items.filter(x=>x.amendment==='not required').map(x=>x.sourceNumber),['4','5','6']);
assert.deepEqual(review.batchAudit.compulsoryReviewBeforeGradedUse,['2','3']);
assert.deepEqual(review.batchAudit.noAmendmentNeeded,['4','5','6']);
assert.deepEqual(review.batchAudit.optionalTeacherNote,['1']);
assert.deepEqual(review.batchAudit.existingV235RiskFlag,['3']);
assert.deepEqual(review.batchAudit.newlyFlaggedComparedWithV235,['2']);
assert.ok(inventory.reviewFlags.some(x=>x.flagId==='MCQ-3'));
assert.ok(!inventory.reviewFlags.some(x=>x.flagId==='MCQ-2'));
assert.equal(review.batchAudit.observedCount,6);
assert.equal(review.batchAudit.teacherIndependentApproval,'PENDING');
assert.equal(review.batchAudit.cognitiveAudit,'PENDING');
assert.equal(review.batchAudit.studentMcqBank,'NOT-PUBLISHED');
const h=review.releaseGate;
assert.equal(h.unit8ScoredQuestionCount,0);assert.equal(h.unit8TestBuilderBankEnabled,false);
assert.equal(h.approvedAnswerEdition,false);assert.equal(h.optionLettersPublished,false);
assert.equal(h.sourceImagesCopied,false);assert.equal(h.sourceStemsCopied,false);
assert.equal(h.ownerApproval,'HOLD');
for(const forbidden of ['answerKey','correctAnswer','correctOption','answerLetter','selectedOption',
                         'sourceQuestionStem','sourceOptionTexts','publishedSolution','sourcePageImage']){
 const traverse=v=>{if(Array.isArray(v))return v.forEach(traverse);if(v&&typeof v==='object'){
  assert.equal(Object.prototype.hasOwnProperty.call(v,forbidden),false,'Forbidden keyed answer/source payload '+forbidden);
  Object.values(v).forEach(traverse);
 }};traverse(review);
}
assert.match(audit,/COMPULSORY before graded use/);
assert.match(audit,/OPTIONAL teaching note/);
assert.match(audit,/No amendment recommended at this stage for MCQs 4, 5 or 6/);
assert.match(audit,/2,250/);
const grade=catalog.grades.find(g=>g.grade===11),u7=grade.units.find(u=>u.unit===7),u8=grade.units.find(u=>u.unit===8);
for(const u of [u7,u8]){
 assert.equal(u.status,'planned');assert.equal(u.questionBankCount,0);
 assert.equal(u.assessmentStatus,'not-published');assert.deepEqual(u.resourceIds,[]);
}
assert.equal(u7.additionalLearningPreviews.length,2);
assert.equal(u8.additionalLearningPreviews.length,9);
assert.equal(u7.simulationCount,2);assert.equal(u8.simulationCount,4);
assert.equal(catalog.resources.length,59);
const counts=banks.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount);
assert.deepEqual(counts,[275,206,220,640,349,560]);
assert.equal(counts.reduce((x,y)=>x+y,0),2250);
assert.equal(source.releaseGate.studentScoredUnit8Mcqs,0);
console.log('V237 PASS: original MCQs1–6 source page and summative outcome candidates cross-checked, items2–3 held, no keys, 2250 pinned Unit1–6 MCQs, Unit7/8 scored release unchanged.');
