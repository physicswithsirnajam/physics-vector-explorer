#!/usr/bin/env node
'use strict';
/* Grade XI V239 — original NBF Unit8 end MCQs13–18 academic QC metadata.
   NO publisher stems, answer letters or students' graded results. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const review=json('quality/unit08/unit08-v239-end-mcq13-18-review-no-keys.json');
const notes=read('quality/unit08/unit08-v239-end-mcq13-18-academic-triage.md');
const v238=json('quality/unit08/unit08-v238-end-mcq07-12-review-no-keys.json');
const v237=json('quality/unit08/unit08-v237-end-mcq01-06-review-no-keys.json');
const inventory=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const framework=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const catalog=json('portal/learning-catalog.json'),banks=json('question-bank/manifest.json');
assert.equal(review.schema,'psn-nbf-grade11-unit08-end-exercise-mcq-qc-v239');
assert.equal(review.version,'V239');
assert.equal(review.originalSource.sourceSha256,inventory.source.sha256);
assert.equal(review.originalSource.sourceSha256,framework.originalTextbook.sha256);
assert.equal(review.originalSource.sourceSha256,v238.originalSource.sourceSha256);
assert.deepEqual(review.originalSource.printedPages,[151,152]);
assert.deepEqual(review.originalSource.batchNumbers,[13,14,15,16,17,18]);
assert.equal(review.items.length,6);
assert.deepEqual(review.items.map(x=>x.sourceNumber),['13','14','15','16','17','18']);
assert.deepEqual(review.items.map(x=>x.printedPages),[[151],[151],[151],[151],[151,152],[152]]);
assert.deepEqual(v237.items.map(x=>x.sourceNumber),['1','2','3','4','5','6']);
assert.deepEqual(v238.items.map(x=>x.sourceNumber),['7','8','9','10','11','12']);
const sourceItems=inventory.sourceSections.find(x=>x.kind==='mcq').items;
assert.equal(sourceItems.length,18);
assert.equal(inventory.observedTotal,50);
assert.deepEqual([...v237.items,...v238.items,...review.items].map(x=>x.sourceNumber),sourceItems.map(x=>x.sourceNumber));
const outcomes=framework.officialFramework.slos;
assert.equal(outcomes.find(x=>x.codeIndex===1).printedCode,'P-12-C-01');
assert.ok(framework.officialFramework.issues.some(x=>x.issue==='P12_C01_MISCODE'&&x.resolution.includes('PENDING')));
assert.equal(outcomes.find(x=>x.printedCode==='P-11-C-04').displayShortDescription,'Boltzmann constant as R/NA');
for(const item of review.items){
 const original=sourceItems.find(x=>x.sourceNumber===item.sourceNumber);
 assert.ok(original,'Missing original exercise source record '+item.sourceNumber);
 assert.equal(item.focus,original.focus,'Must preserve prior V235 independent focus label');
 assert.deepEqual(item.printedPages,original.printedPages);
 assert.ok(item.reason.length>=105);
 assert.equal(item.keepOriginal,true);
 assert.equal(item.candidateOptionPublished,false);
 assert.equal(item.studentRelease,'HOLD');
 assert.equal(item.teacherScienceApproval,'PENDING');
 assert.equal(item.teacherSloApproval,'PENDING');
 assert.ok(['Knowledge','Understanding','Application'].includes(item.observedCognitive));
 if(item.candidateSummativeSlo!==null){
  const slo=outcomes.find(x=>x.printedCode===item.candidateSummativeSlo);
  assert.ok(slo,'Unknown/non-original official source SLO for '+item.sourceNumber);
  assert.equal(slo.assessment,'Summative');
  assert.equal(item.candidateFrameworkCognitive,slo.cognitive);
 }else{
  assert.ok(['15','17','18'].includes(item.sourceNumber),'Do not invent thermal-expansion or state-analogy outcome');
  assert.equal(item.candidateFrameworkCognitive,null);
 }
}
assert.deepEqual(review.items.map(x=>x.candidateSummativeSlo),['P-12-C-01','P-11-C-12',null,'P-11-C-04',null,null]);
assert.equal(review.items.find(x=>x.sourceNumber==='14').additionalCandidateSlo,'P-11-C-10');
assert.ok(outcomes.some(x=>x.printedCode==='P-11-C-10'&&x.assessment==='Summative'));
assert.equal(review.items.find(x=>x.sourceNumber==='15').mayAddIndependentItem,true);
assert.match(review.items.find(x=>x.sourceNumber==='15').reason,/kinetic energy and gravitational potential energy/);
assert.match(review.items.find(x=>x.sourceNumber==='14').reason,/ideal gas/);
assert.match(review.items.find(x=>x.sourceNumber==='17').reason,/p\.152/);
assert.match(review.items.find(x=>x.sourceNumber==='18').sloFit,/no directly matched summative/i);
assert.match(review.items.find(x=>x.sourceNumber==='16').reason,/N_A/);
const a=review.batchAudit;
assert.equal(a.observedCount,6);
assert.deepEqual(a.compulsoryContentClarificationBeforeGradedUse,['14','15']);
assert.deepEqual(a.optionalContentTeachingNotes,['16','17']);
assert.deepEqual(a.scientificContentNoAmendment,['13','18']);
assert.deepEqual(a.compulsorySummativeFrameworkOrPrintedCodeResolution,['13','17','18']);
assert.deepEqual(a.figureOrSplitPageCompleteness,['14','17']);
assert.deepEqual(a.newV239ReviewFlagsBeyondV235,['15']);
assert.deepEqual(a.earlierV235ReviewFlagsExpanded,['14','17']);
assert.ok(inventory.reviewFlags.some(f=>f.flagId==='MCQ-14'));
assert.ok(inventory.reviewFlags.some(f=>f.flagId==='MCQ-17'));
assert.ok(!inventory.reviewFlags.some(f=>f.flagId==='MCQ-15'));
assert.equal(a.sourceSloCodeAnomaly,'P-12-C-01 retained as printed; P-11-C-01 not authenticated');
assert.equal(a.humanScienceApproval,'PENDING');
assert.equal(a.humanSloCognitiveApproval,'PENDING');
assert.equal(a.studentBank,'NOT-PUBLISHED');
assert.equal(a.approvedAnswerKeys,false);
const release=review.releaseGate;
assert.equal(release.unit8ScoredQuestionCount,0);
assert.equal(release.unit8TestBuilderBankEnabled,false);
assert.equal(release.approvedAnswerEdition,false);
assert.equal(release.sourceImagesCopied,false);
assert.equal(release.sourceStemsCopied,false);
assert.equal(release.optionLettersPublished,false);
assert.equal(release.ownerApproval,'HOLD');
for(const forbidden of ['answerKey','correctAnswer','correctOption','answerLetter','selectedOption','sourceQuestionStem',
 'sourceOptionTexts','publishedSolution','sourcePageImage']){
 const visit=o=>{if(Array.isArray(o))return o.forEach(visit);
  if(o&&typeof o==='object'){
   assert.equal(Object.hasOwn(o,forbidden),false,'Forbidden original source/answer field '+forbidden);
   Object.values(o).forEach(visit);
 }};visit(review);
}
for(const flag of ['14','15','16','17','18','13'])assert.match(notes,new RegExp('MCQ '+flag));
assert.match(notes,/p\.130/);
assert.match(notes,/P-12-C-01/);
assert.match(notes,/18\/18/);
const units=catalog.grades.find(g=>g.grade===11).units;
const u7=units.find(x=>x.unit===7),u8=units.find(x=>x.unit===8);
for(const u of [u7,u8]){
 assert.equal(u.status,'planned');assert.equal(u.questionBankCount,0);
 assert.equal(u.assessmentStatus,'not-published');assert.deepEqual(u.resourceIds,[]);
}
assert.equal(u7.additionalLearningPreviews.length,2);
assert.equal(u8.additionalLearningPreviews.length,9);
assert.equal(u7.simulationCount,2);assert.equal(u8.simulationCount,4);
assert.equal(catalog.resources.length,59);
const counts=banks.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount);
assert.deepEqual(counts,[275,206,220,640,349,560]);
assert.equal(counts.reduce((x,y)=>x+y,0),2250);
assert.equal(framework.releaseGate.studentScoredUnit8Mcqs,0);
console.log('V239 PASS: original 18/18 end MCQs now covered in three source-QC batches; 14/15 compulsory clarification, 17/18 framework hold, printed P-12 code preserved; zero keys; 2250 legacy MCQs protected.');
