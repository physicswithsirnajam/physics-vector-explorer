#!/usr/bin/env node
'use strict';
/* V244 — original NBF Grade XI Unit8 comprehensive 8.5–8.7 academic-QC metadata.
 * No publisher question wording/graphics, no solutions and no graded bank unlock.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const review=json('quality/unit08/unit08-v244-comprehensive05-07-review-no-answers.json');
const notes=read('quality/unit08/unit08-v244-comprehensive05-07-academic-triage.md');
const v243=json('quality/unit08/unit08-v243-comprehensive01-04-review-no-answers.json');
const v242=json('quality/unit08/unit08-v242-short09-13-review-no-answers.json');
const inventory=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const framework=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const catalog=json('portal/learning-catalog.json');
const bank=json('question-bank/manifest.json');

assert.equal(review.schema,'psn-nbf-grade11-unit08-comprehensive-qc-v244');
assert.equal(review.version,'V244');
assert.equal(review.originalSource.sourceSha256,framework.originalTextbook.sha256);
assert.equal(review.originalSource.sourceSha256,inventory.source.sha256);
assert.equal(review.originalSource.sourceSha256,v243.originalSource.sourceSha256);
assert.deepEqual(review.originalSource.questionPrintedPages,[152]);
assert.deepEqual(review.originalSource.chapterReferencePages,[140,141,142,143,144,145]);
assert.deepEqual(review.originalSource.questionIds,['8.5','8.6','8.7']);
assert.equal(review.originalSource.figureReferences.length,3);
for(const figure of ['Figure 8.14','Figure 8.16','Figure 8.17'])
 assert.ok(review.originalSource.figureReferences.some(x=>x.includes(figure)),'Missing original source figure reference '+figure);

const original=inventory.sourceSections.find(g=>g.kind==='comprehensive');
assert.ok(original);
assert.equal(original.visuallyObservedCount,10);
assert.equal(original.v224BaselineClaimedCount,11);
assert.equal(original.items.length,10);
assert.equal(inventory.discrepancy.id,'SOURCE-COMP-8.8');
assert.deepEqual(original.items.map(x=>x.sourceNumber),
 ['8.1','8.2','8.3','8.4','8.5','8.6','8.7','8.9','8.10','8.11']);
assert.deepEqual(v243.items.map(x=>x.sourceNumber),['8.1','8.2','8.3','8.4']);
assert.deepEqual(review.items.map(x=>x.sourceNumber),['8.5','8.6','8.7']);
assert.deepEqual(review.items.map(x=>x.printedPages),[[152],[152],[152]]);
assert.equal(review.items.length,3);
assert.deepEqual([...v243.items,...review.items].map(x=>x.sourceNumber),
 original.items.slice(0,7).map(x=>x.sourceNumber),'Only original, visibly printed items 8.1–8.7 may be reviewed at this stage');

const outcomes=framework.officialFramework.slos;
for(const item of review.items){
 const sourceItem=original.items.find(x=>x.sourceNumber===item.sourceNumber);
 assert.ok(sourceItem,'Original comprehensive question must exist in V235');
 assert.equal(item.focus,sourceItem.focus,'Retain V235 topic indexing');
 assert.deepEqual(item.printedPages,sourceItem.printedPages);
 assert.ok(item.sourceCoveragePages.every(x=>x>=140&&x<=145));
 assert.equal(item.keepOriginal,true);
 assert.equal(item.studentRelease,'HOLD');
 assert.equal(item.answersPublished,false);
 assert.equal(item.approvedTeacherMarkingScheme,false);
 assert.equal(item.teacherScienceApproval,'PENDING');
 assert.equal(item.teacherSloApproval,'PENDING');
 assert.equal(item.compulsoryExplanationBeforeAssessedUse,true);
 assert.ok(item.reason.length>=200,'Independent source-linked academic concern must be explicit');
 assert.ok(item.scienceReview.length>=200,'Scientific model qualification must be explicit');
 const o=outcomes.find(x=>x.printedCode===item.candidateSummativeSlo);
 assert.ok(o&&o.assessment==='Summative','Primary outcome must occur in original official inventory');
 assert.equal(item.candidateFrameworkCognitive,o.cognitive);
 if(item.additionalCandidateSlo){
  const second=outcomes.find(x=>x.printedCode===item.additionalCandidateSlo);
  assert.ok(second&&second.assessment==='Summative','Secondary candidate outcome must be authenticated');
  assert.equal(item.secondaryFrameworkCognitive,second.cognitive);
 }
}
assert.deepEqual(review.items.map(x=>x.candidateSummativeSlo),
 ['P-11-C-13','P-11-C-15','P-11-C-16']);
assert.equal(review.items[2].additionalCandidateSlo,'P-11-C-23');
assert.deepEqual(review.items.map(x=>x.candidateFrameworkCognitive),
 ['Knowledge','Understanding','Knowledge + Understanding']);
assert.deepEqual(review.items.map(x=>x.observedCognitive),
 ['Understanding','Understanding','Understanding + Application']);
assert.deepEqual(review.items.filter(x=>x.compulsoryMappingReview).map(x=>x.sourceNumber),['8.5','8.7']);
assert.match(review.items[0].scienceReview,/Q_H=W_by\+Q_C/);
assert.match(review.items[0].scienceReview,/ΔU_cycle=0/);
assert.match(review.items[1].scienceReview,/Kelvin–Planck/);
assert.match(review.items[1].scienceReview,/Clausius/);
assert.match(review.items[1].reason,/sole/i);
assert.match(review.items[2].scienceReview,/T_H>T_C>0/);
assert.match(review.items[2].scienceReview,/Q_C\/Q_H=T_C\/T_H/);
assert.match(review.items[2].reason,/not as universal Q∝T/);
assert.match(review.items[2].scienceReview,/Carnot's theorem/);
const audit=review.audit;
assert.equal(audit.sourceQuestionCount,3);
assert.equal(audit.sourceVisibleComprehensiveCount,10);
assert.equal(audit.coverageAcrossV243V244,'7/10 visibly numbered original comprehensive questions preliminarily reviewed');
assert.deepEqual(audit.sourceNumberingSeen,original.items.map(x=>x.sourceNumber));
assert.equal(audit.missingComprehensiveSourceNumber,'8.8');
assert.deepEqual(audit.compulsoryExplanationQualification,['8.5','8.6','8.7']);
assert.deepEqual(audit.cognitiveOrDirectSloReview,['8.5','8.7']);
assert.deepEqual(audit.figureReferenceCompleteness,['8.5','8.7']);
assert.deepEqual(audit.reversibleCarnotTemperatureRatioHold,['8.7']);
assert.deepEqual(audit.heatEngineCycleBalanceHold,['8.5','8.7']);
assert.deepEqual(audit.secondLawCyclicSoleEffectHold,['8.6']);
assert.equal(audit.noNewPublisherQuestionStemDefectsEstablished,true);
assert.equal(audit.sourceQuestionsRetainedUnchanged,true);
assert.equal(audit.teacherIndependentScienceApproval,'PENDING');
assert.equal(audit.teacherCognitiveSloApproval,'PENDING');
assert.equal(audit.teacherAnswerEdition,'NOT-PUBLISHED');
for(const q of ['8.5','8.6','8.7'])
 assert.ok(notes.includes('**'+q+' —'),'Original question '+q+' must have a teacher-facing decision row');
for(const phrase of ['Kelvin–Planck','Clausius','Fig. 8.14','Fig. 8.16','8.8 is absent','2,250'])
 assert.ok(notes.includes(phrase),'Source/QC note missing: '+phrase);
assert.equal(v242.audit.allOriginalShortQuestionsCovered,'13/13 across V240–V242');
const hold=review.releaseGate;
assert.equal(hold.unit8ScoredQuestionCount,0);
assert.equal(hold.unit8TestBuilderBankEnabled,false);
assert.equal(hold.teacherAnswerEditionApproved,false);
assert.equal(hold.originalStemsCopied,false);
assert.equal(hold.sourcePageImagesCopied,false);
assert.equal(hold.originalFigureFilesCopied,false);
assert.equal(hold.ownerApproval,'HOLD');
const blocked=['answerKey','correctAnswer','correctOption','sourceQuestionStem','verbatimQuestionStem',
 'fullModelAnswer','printedQuestionText','sourcePageImage','publisherFigureFile','approvedMarkingScheme'];
const inspect=v=>{if(Array.isArray(v))return v.forEach(inspect);
 if(v&&typeof v==='object'){
  for(const key of blocked)assert.equal(Object.hasOwn(v,key),false,'No original answers/figures: '+key);
  Object.values(v).forEach(inspect);
 }};inspect(review);
const units=catalog.grades.find(g=>g.grade===11).units;
for(const n of [7,8]){
 const u=units.find(x=>x.unit===n);
 assert.equal(u.status,'planned');assert.equal(u.questionBankCount,0);
 assert.equal(u.assessmentStatus,'not-published');assert.deepEqual(u.resourceIds,[]);
}
assert.equal(units.find(u=>u.unit===7).additionalLearningPreviews.length,2);
assert.equal(units.find(u=>u.unit===8).additionalLearningPreviews.length,9);
assert.equal(units.find(u=>u.unit===7).simulationCount,2);
assert.equal(units.find(u=>u.unit===8).simulationCount,4);
assert.equal(catalog.resources.length,59);
const counts=bank.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount);
assert.deepEqual(counts,[275,206,220,640,349,560]);
assert.equal(counts.reduce((a,b)=>a+b,0),2250);
assert.equal(framework.releaseGate.studentScoredUnit8Mcqs,0);
console.log('V244 PASS: original comprehensive 8.5–8.7 with genuine p.152 and pp.140–145, heat balance/Second Law/Carnot qualification, preserved missing 8.8, zero solutions, 2250 original MCQs protected.');
