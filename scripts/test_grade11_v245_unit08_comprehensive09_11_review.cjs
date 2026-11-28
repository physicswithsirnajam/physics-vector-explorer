#!/usr/bin/env node
'use strict';
/* Grade XI V245 — original NBF Unit8 comprehensive 8.9–8.11 source/academic QC.
 * Metadata only; no original publisher stems/figures or certified solutions.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));

const review=json('quality/unit08/unit08-v245-comprehensive09-11-review-no-answers.json');
const notes=read('quality/unit08/unit08-v245-comprehensive09-11-academic-triage.md');
const v244=json('quality/unit08/unit08-v244-comprehensive05-07-review-no-answers.json');
const v243=json('quality/unit08/unit08-v243-comprehensive01-04-review-no-answers.json');
const inventory=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const framework=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const catalog=json('portal/learning-catalog.json');
const bank=json('question-bank/manifest.json');

assert.equal(review.schema,'psn-nbf-grade11-unit08-comprehensive-qc-v245');
assert.equal(review.version,'V245');
assert.equal(review.originalSource.sourceSha256,framework.originalTextbook.sha256);
assert.equal(review.originalSource.sourceSha256,inventory.source.sha256);
assert.equal(review.originalSource.sourceSha256,v244.originalSource.sourceSha256);
assert.deepEqual(review.originalSource.questionPrintedPages,[153]);
assert.deepEqual(review.originalSource.chapterReferencePages,[145,146,147,148,149]);
assert.deepEqual(review.originalSource.questionIds,['8.9','8.10','8.11']);
const original=inventory.sourceSections.find(x=>x.kind==='comprehensive');
assert.equal(original.visuallyObservedCount,10);
assert.equal(original.v224BaselineClaimedCount,11);
assert.deepEqual(original.items.map(x=>x.sourceNumber),
 ['8.1','8.2','8.3','8.4','8.5','8.6','8.7','8.9','8.10','8.11']);
assert.equal(inventory.discrepancy.id,'SOURCE-COMP-8.8');
assert.equal(original.items.some(x=>x.sourceNumber==='8.8'),false);
assert.deepEqual(v243.items.map(x=>x.sourceNumber),['8.1','8.2','8.3','8.4']);
assert.deepEqual(v244.items.map(x=>x.sourceNumber),['8.5','8.6','8.7']);
assert.equal(review.items.length,3);
assert.deepEqual(review.items.map(x=>x.sourceNumber),['8.9','8.10','8.11']);
assert.deepEqual(review.items.map(x=>x.printedPages),[[153],[153],[153]]);
assert.deepEqual([...v243.items,...v244.items,...review.items].map(x=>x.sourceNumber),
 original.items.map(x=>x.sourceNumber),'All 10 visible original comprehensive questions must be accounted for');

const outcomes=framework.officialFramework.slos;
for(const item of review.items){
 const old=original.items.find(x=>x.sourceNumber===item.sourceNumber);
 assert.ok(old,'Original V235 source identifier missing: '+item.sourceNumber);
 assert.equal(item.focus,old.focus,'Retain original independently recorded topic label');
 assert.deepEqual(item.printedPages,old.printedPages);
 assert.ok(item.sourceCoveragePages.every(p=>p>=145&&p<=149));
 assert.equal(item.keepOriginal,true);
 assert.equal(item.studentRelease,'HOLD');
 assert.equal(item.answersPublished,false);
 assert.equal(item.approvedTeacherMarkingScheme,false);
 assert.equal(item.teacherScienceApproval,'PENDING');
 assert.equal(item.teacherSloApproval,'PENDING');
 assert.equal(item.compulsoryExplanationBeforeAssessedUse,true);
 assert.ok(item.reason.length>250,'Require source-specific academic reasoning');
 assert.ok(item.scienceReview.length>250,'Require independently verified physics interpretation');
 const primary=outcomes.find(x=>x.printedCode===item.candidateSummativeSlo);
 assert.ok(primary&&primary.assessment==='Summative','Use original official candidate SLO');
 assert.equal(item.candidateFrameworkCognitive,primary.cognitive);
 if(item.additionalCandidateSlo){
  const secondary=outcomes.find(x=>x.printedCode===item.additionalCandidateSlo);
  assert.ok(secondary&&secondary.assessment==='Summative','Secondary candidate must be original summative SLO');
  assert.equal(item.secondaryFrameworkCognitive,secondary.cognitive);
 }
}
assert.deepEqual(review.items.map(x=>x.candidateSummativeSlo),
 ['P-11-C-17','P-11-C-22','P-11-C-19']);
assert.deepEqual(review.items.map(x=>x.additionalCandidateSlo||null),
 [null,'P-11-C-21','P-11-C-20']);
assert.deepEqual(review.items.map(x=>x.candidateFrameworkCognitive),
 ['Understanding','Understanding','Understanding']);
assert.deepEqual(review.items.map(x=>x.observedCognitive),
 ['Understanding','Understanding','Understanding']);
assert.deepEqual(review.items.filter(x=>x.compulsoryMappingReview).map(x=>x.sourceNumber),['8.10']);
assert.match(review.items[0].scienceReview,/COP_C=Q_C\/W_in/);
assert.match(review.items[0].scienceReview,/ideal reversible/);
assert.match(review.items[1].scienceReview,/δQ_rev\/T/);
assert.match(review.items[1].scienceReview,/melting/);
assert.match(review.items[2].scienceReview,/exergy/);
assert.match(review.items[2].scienceReview,/First Law conserves energy/);

assert.deepEqual(review.originalSource.figureReferences.map(x=>x.slice(0,11)),
 ['Figure 8.18','Figure 8.19','Figure 8.20']);
const ledger=review.sourcePassageRiskLedger;
assert.equal(ledger.length,8);
const expectedIds=[
 'P146-REVERSIBLE-COP','P147-ENTROPY-DELTAQ-OVER-T',
 'P148-MELTING-HEAT-SIGN','P148-MELTING-ENTROPY-SIGN',
 'P149-REVERSIBLE-SYSTEM-ENTROPY','P149-NATURAL-SYSTEM-ENTROPY',
 'P149-ENERGY-AVAILABILITY','P148-FIGURE820-ORDER'
];
assert.deepEqual(ledger.map(x=>x.issueId),expectedIds);
assert.equal(new Set(ledger.map(x=>x.issueId)).size,8);
assert.equal(ledger.filter(x=>x.priority==='compulsory').length,7);
assert.equal(ledger.filter(x=>x.priority==='optional').length,1);
for(const finding of ledger){
 assert.ok([146,147,148,149].includes(finding.printedPage));
 assert.ok(['8.9','8.10','8.11'].includes(finding.relatedOriginalQuestion));
 assert.ok(finding.sourceIssue.length>75 && finding.independentScience.length>75);
}
assert.equal(ledger.find(x=>x.issueId==='P148-MELTING-HEAT-SIGN').printedPage,148);
assert.equal(ledger.find(x=>x.issueId==='P148-MELTING-ENTROPY-SIGN').printedPage,148);
assert.equal(ledger.find(x=>x.issueId==='P149-REVERSIBLE-SYSTEM-ENTROPY').printedPage,149);

const audit=review.audit;
assert.equal(audit.reviewedCount,3);
assert.equal(audit.sourceVisibleComprehensiveCount,10);
assert.equal(audit.coverageAcrossV243V245,'10/10 visibly numbered original comprehensive questions preliminarily reviewed');
assert.deepEqual(audit.originalPrintedSourceNumbers,original.items.map(x=>x.sourceNumber));
assert.equal(audit.missingOriginalNumber,'8.8');
assert.deepEqual(audit.compulsoryExplanationQualification,['8.9','8.10','8.11']);
assert.deepEqual(audit.cognitiveOrDirectSloReview,['8.10']);
assert.equal(audit.publisherSourcePassageConcernsCount,8);
assert.equal(audit.compulsoryPublisherPassageConcernsCount,7);
assert.deepEqual(audit.diagramReferenceReview,['8.9','8.10','8.11']);
assert.equal(audit.sourceQuestionsRetainedUnchanged,true);
assert.equal(audit.teacherIndependentScienceApproval,'PENDING');
assert.equal(audit.teacherCognitiveSloApproval,'PENDING');
assert.equal(audit.teacherAnswerEdition,'NOT-PUBLISHED');

for(const n of ['8.9','8.10','8.11'])
 assert.ok(notes.includes('**'+n+' —'),'Teacher triage must identify source '+n);
for(const key of expectedIds)
 assert.ok(notes.includes(key),'Source passage concern absent from academic triage '+key);
assert.ok(notes.includes('10/10'));
assert.ok(notes.includes('8.8'));
assert.ok(notes.includes('2,250'));
assert.ok(notes.includes('ΔS_melt=mL_f/T>0'));
assert.ok(notes.includes('P-11-C-22'));

const gate=review.releaseGate;
assert.equal(gate.unit8ScoredQuestionCount,0);
assert.equal(gate.unit8TestBuilderBankEnabled,false);
assert.equal(gate.teacherAnswerEditionApproved,false);
assert.equal(gate.originalStemsCopied,false);
assert.equal(gate.sourcePageImagesCopied,false);
assert.equal(gate.originalFigureFilesCopied,false);
assert.equal(gate.ownerApproval,'HOLD');
const blocked=['answerKey','correctAnswer','correctOption','sourceQuestionStem','verbatimQuestionStem',
 'fullModelAnswer','printedQuestionText','sourcePageImage','publisherFigureFile','approvedMarkingScheme'];
const inspect=v=>{if(Array.isArray(v))return v.forEach(inspect);
 if(v&&typeof v==='object'){
  for(const field of blocked)assert.equal(Object.hasOwn(v,field),false,'No original stem, figure or key: '+field);
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

console.log('V245 PASS: 10/10 visibly printed Unit8 comprehensives preliminary QC, original p153 refrigerator/entropy/degradation and 7 compulsory passage issues, no answer/student release, 2250 pinned MCQs preserved.');
