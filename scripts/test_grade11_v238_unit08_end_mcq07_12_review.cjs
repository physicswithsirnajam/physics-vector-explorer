#!/usr/bin/env node
'use strict';
/* V238 original NBF XI Unit 8 end MCQs 7–12: source-anchored QC only.
 * No original option letters, publisher answer keys or student score release.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const review=json('quality/unit08/unit08-v238-end-mcq07-12-review-no-keys.json');
const notes=read('quality/unit08/unit08-v238-end-mcq07-12-academic-triage.md');
const old=json('quality/unit08/unit08-v237-end-mcq01-06-review-no-keys.json');
const inventory=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const framework=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const catalog=json('portal/learning-catalog.json');
const banks=json('question-bank/manifest.json');
assert.equal(review.schema,'psn-nbf-grade11-unit08-end-exercise-mcq-qc-v238');
assert.equal(review.version,'V238');
assert.equal(review.originalSource.sourceSha256,framework.originalTextbook.sha256);
assert.equal(review.originalSource.sourceSha256,inventory.source.sha256);
assert.equal(review.originalSource.sourceSha256,old.originalSource.sourceSha256);
assert.deepEqual(review.originalSource.printedPages,[151]);
assert.deepEqual(review.originalSource.batchNumbers,[7,8,9,10,11,12]);
assert.equal(review.items.length,6);
assert.deepEqual(review.items.map(x=>x.sourceNumber),['7','8','9','10','11','12']);
assert.deepEqual(review.items.map(x=>x.printedPages),[[151],[151],[151],[151],[151],[151]]);
assert.deepEqual(old.items.map(x=>x.sourceNumber),['1','2','3','4','5','6']);
assert.equal(inventory.sourceSections.find(g=>g.kind==='mcq').items.length,18);
assert.equal(inventory.observedTotal,50);
const srcItems=inventory.sourceSections.find(g=>g.kind==='mcq').items;
const outcomes=framework.officialFramework.slos;
for(const x of review.items){
 const sourceItem=srcItems.find(s=>s.sourceNumber===x.sourceNumber);
 assert.ok(sourceItem,'Missing original item in V235: '+x.sourceNumber);
 assert.deepEqual(x.printedPages,sourceItem.printedPages);
 assert.equal(x.focus,sourceItem.focus,'Use exactly source-indexed topic description');
 assert.ok(x.reason.length>=100,'Document independent issue/physics reasoning');
 assert.equal(x.keepOriginal,true);
 assert.equal(x.studentRelease,'HOLD');assert.equal(x.teacherReview,'PENDING');
 assert.equal(x.candidateOptionPublished,false);
 assert.ok(['Application','Understanding','Knowledge'].includes(x.observedCognitive));
 if(x.candidateSummativeSlo===null){
  assert.equal(x.sourceNumber,'12','Only no-direct-outcome source item may be unmapped in this batch');
  assert.equal(x.officialOutcomeCognitive,null);
  assert.match(x.mappingStatus,/no authenticated direct printed summative outcome/);
 }else{
  const o=outcomes.find(s=>s.printedCode===x.candidateSummativeSlo);
  assert.ok(o,'Candidate must be an original printed official SLO');
  assert.equal(o.assessment,'Summative');
  assert.equal(x.officialOutcomeCognitive,o.cognitive);
 }
}
assert.deepEqual(review.items.map(x=>x.candidateSummativeSlo),
 ['P-11-C-23','P-11-C-23','P-11-C-06','P-11-C-17','P-11-C-23',null]);
assert.deepEqual(review.items.filter(x=>x.amendment.startsWith('compulsory')).map(x=>x.sourceNumber),
 ['9','10','11','12']);
assert.deepEqual(review.items.filter(x=>x.amendment==='no scientific amendment proposed').map(x=>x.sourceNumber),['7','8']);
assert.deepEqual(review.batchAudit.scientificallyWellDefinedWithSloLevelReview,['7','8']);
assert.deepEqual(review.batchAudit.compulsoryClarificationOrExclusionBeforeGradedUse,['9','10','11','12']);
assert.deepEqual(review.batchAudit.cognitiveMappingReviewRequired,['7','8','9','10','11']);
assert.deepEqual(review.batchAudit.v235FlagsAlreadyRecorded,['9','10','11','12']);
assert.deepEqual(review.batchAudit.newV238ContentFlawsNotPreviouslyFlagged,[]);
for(const id of ['9','10','11','12'])assert.ok(inventory.reviewFlags.some(f=>f.kind==='mcq'&&f.sourceNumber===id));
assert.equal(review.batchAudit.observedCount,6);
assert.equal(review.batchAudit.teacherIndependentScienceApproval,'PENDING');
assert.equal(review.batchAudit.teacherCognitiveSloApproval,'PENDING');
assert.equal(review.batchAudit.studentMcqBank,'NOT-PUBLISHED');
assert.equal(review.batchAudit.noAcademicAnswerKeyApproved,true);
const hold=review.releaseGate;
assert.equal(hold.unit8ScoredQuestionCount,0);assert.equal(hold.unit8TestBuilderBankEnabled,false);
assert.equal(hold.approvedAnswerEdition,false);assert.equal(hold.sourceImagesCopied,false);
assert.equal(hold.sourceStemsCopied,false);assert.equal(hold.optionLettersPublished,false);
assert.equal(hold.ownerApproval,'HOLD');
for(const forbidden of ['answerKey','correctAnswer','correctOption','answerLetter','selectedOption',
                         'sourceQuestionStem','sourceOptionTexts','publishedSolution','sourcePageImage']){
 const visit=v=>{if(Array.isArray(v))return v.forEach(visit);
  if(v&&typeof v==='object'){
   assert.equal(Object.prototype.hasOwnProperty.call(v,forbidden),false,'Do not publish keys or source stems: '+forbidden);
   Object.values(v).forEach(visit);
 }};visit(review);
}
assert.match(notes,/COMPULSORY clarification/);
assert.match(notes,/COMPULSORY missing inputs\/model/);
assert.match(notes,/COMPULSORY underdetermination/);
assert.match(notes,/COMPULSORY exclusion or replacement/);
assert.match(notes,/No content amendment recommended for original MCQs 7 or 8/);
assert.match(notes,/P-11-C-23/);
assert.match(notes,/No direct printed summative SLO is asserted/);
const units=catalog.grades.find(g=>g.grade===11).units;
for(const n of [7,8]){
 const u=units.find(x=>x.unit===n);
 assert.equal(u.status,'planned');
 assert.equal(u.assessmentStatus,'not-published');
 assert.equal(u.questionBankCount,0);
 assert.deepEqual(u.resourceIds,[]);
}
assert.equal(units.find(x=>x.unit===7).additionalLearningPreviews.length,2);
assert.equal(units.find(x=>x.unit===8).additionalLearningPreviews.length,9);
assert.equal(units.find(x=>x.unit===7).simulationCount,2);
assert.equal(units.find(x=>x.unit===8).simulationCount,4);
assert.equal(catalog.resources.length,59);
const counts=banks.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount);
assert.deepEqual(counts,[275,206,220,640,349,560]);
assert.equal(counts.reduce((a,b)=>a+b,0),2250);
assert.equal(framework.releaseGate.studentScoredUnit8Mcqs,0);
console.log('V238 PASS: original end MCQs7–12 source page confirmed; four compulsory holds and two cognitive checks; no source options/keys; 2250 protected MCQs; Unit7/8 scored banks remain closed.');
