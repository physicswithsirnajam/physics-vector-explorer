#!/usr/bin/env node
'use strict';
/* V249: consolidated source-QC adjudication of all 50 original Unit8 exercises.
 * This only tests references, issue provenance and release locks; NOT human approval.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const doc=json('quality/unit08/unit08-v249-50-item-teacher-adjudication-no-approved-keys.json');
const notes=read('quality/unit08/unit08-v249-50-item-teacher-adjudication-guide.md');
const inv=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const framework=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const catalog=json('portal/learning-catalog.json');
const banks=json('question-bank/manifest.json');

assert.equal(doc.schema,'psn-nbf-grade11-unit08-50-item-adjudication-ledger-v249');
assert.equal(doc.version,'V249');
assert.equal(doc.originalSource.sha256,framework.originalTextbook.sha256);
assert.equal(doc.originalSource.sha256,inv.source.sha256);
assert.equal(doc.originalSource.originalExerciseInventory,
 'quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
assert.equal(doc.originalSource.officialOriginalSummativeFramework,
 'quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
assert.match(doc.originalSource.researchBasis,/V235 and V237–V248/);
assert.equal(doc.accounting.total,50);
assert.deepEqual(doc.accounting.categoryCounts,{mcq:18,short:13,comprehensive:10,numerical:9});
assert.equal(doc.accounting.missingComprehensiveNumber,'8.8');
assert.equal(doc.accounting.numerical8_8IsPresent,true);
assert.equal(inv.observedTotal,50);
assert.equal(inv.discrepancy.id,'SOURCE-COMP-8.8');

const versions=['V237','V238','V239','V240','V241','V242',
 'V243','V244','V245','V246','V247','V248'];
assert.deepEqual(doc.accounting.priorReviewVersions,versions);
const expectedSources=[
 ['mcq','quality/unit08/unit08-v237-end-mcq01-06-review-no-keys.json'],
 ['mcq','quality/unit08/unit08-v238-end-mcq07-12-review-no-keys.json'],
 ['mcq','quality/unit08/unit08-v239-end-mcq13-18-review-no-keys.json'],
 ['short','quality/unit08/unit08-v240-short01-04-review-no-answers.json'],
 ['short','quality/unit08/unit08-v241-short05-08-review-no-answers.json'],
 ['short','quality/unit08/unit08-v242-short09-13-review-no-answers.json'],
 ['comprehensive','quality/unit08/unit08-v243-comprehensive01-04-review-no-answers.json'],
 ['comprehensive','quality/unit08/unit08-v244-comprehensive05-07-review-no-answers.json'],
 ['comprehensive','quality/unit08/unit08-v245-comprehensive09-11-review-no-answers.json'],
 ['numerical','quality/unit08/unit08-v246-numerical01-03-source-qc-no-approved-answers.json'],
 ['numerical','quality/unit08/unit08-v247-numerical04-06-source-qc-no-approved-answers.json'],
 ['numerical','quality/unit08/unit08-v248-numerical07-09-source-qc-no-approved-answers.json']
];
const priorRecords=expectedSources.flatMap(([category,file])=>{
 const previous=json(file);
 assert.equal(previous.originalSource.sourceSha256,framework.originalTextbook.sha256);
 return previous.items.map(item=>({category,file,item,version:previous.version}));
});
assert.equal(priorRecords.length,50);
assert.equal(doc.entries.length,50);
assert.equal(new Set(doc.entries.map(x=>x.id)).size,50);
const allPriorIds=priorRecords.map(x=>x.category+':'+x.item.sourceNumber);
assert.deepEqual(doc.entries.map(x=>x.id),allPriorIds,'Preserve same original source order and category-qualified IDs');
const sourceIds=inv.sourceSections.flatMap(s=>s.items.map(x=>s.kind+':'+x.sourceNumber));
assert.deepEqual(doc.entries.map(x=>x.id),sourceIds,'Consolidated review must match V235 exactly');
assert.deepEqual(doc.accounting.originalComprehensiveQuestionNumbers,
 inv.sourceSections.find(x=>x.kind==='comprehensive').items.map(x=>x.sourceNumber));
assert.equal(sourceIds.includes('comprehensive:8.8'),false);
assert.equal(sourceIds.includes('numerical:8.8'),true);
const originalSlo=framework.officialFramework.slos;

for(let index=0;index<50;index++){
 const e=doc.entries[index],p=priorRecords[index];
 const o=inv.sourceSections.find(x=>x.kind===e.category).items.find(x=>x.sourceNumber===e.sourceNumber);
 assert.ok(o);
 assert.equal(e.category,p.category);assert.equal(e.sourceNumber,p.item.sourceNumber);
 assert.equal(e.priorReviewVersion,p.version);
 assert.equal(e.priorReviewFile,p.file);
 assert.equal(e.topic,o.focus);
 assert.deepEqual(e.printedPages,p.item.printedPages);
 assert.deepEqual(e.printedPages,o.printedPages);
 assert.deepEqual(e.priorSourceFlags,
  inv.reviewFlags.filter(x=>x.kind===e.category&&x.sourceNumber===e.sourceNumber).map(x=>x.flagId));
 assert.equal(e.candidateOfficialPrintedSlo,p.item.candidateSummativeSlo||null);
 const originalPrintedOutcome=p.item.candidateSummativeSlo&&originalSlo.find(x=>x.printedCode===p.item.candidateSummativeSlo);
 assert.equal(e.officialPrintedCognitive,originalPrintedOutcome?originalPrintedOutcome.cognitive:null);
 assert.equal(e.observedCognitive,p.item.observedCognitive||(p.version==='V237'?p.item.candidateCognitive:null)||null);
 const originalReason=p.item.reason||p.item.reviewReason||'Reviewed in referenced QC JSON';
 assert.equal(e.sourceReasonReference,originalReason,'Reason must be traceable to unchanged earlier review');
 assert.ok(e.sourceReasonReference.length>40);
 assert.equal(e.approvedAnswerOrMarkingScheme,false);
 assert.equal(e.teacherScienceDecision,'PENDING');
 assert.equal(e.teacherFrameworkDecision,'PENDING');
 assert.equal(e.studentRelease,'HOLD');
 assert.ok(['SOURCE-LEVEL-ASSESSMENT-CONCERN','NO-NEW-STEM-DEFECT-IDENTIFIED'].includes(e.publisherStemStatus));
 if(e.publisherStemStatus==='SOURCE-LEVEL-ASSESSMENT-CONCERN'){
  assert.equal(e.compulsorySourceRepairOrExclusionBeforeSingleKey,true);
  assert.ok(e.publisherStemConcern&&e.publisherStemConcern.length>30);
  assert.match(e.sourceDisposition,/EXCLUDE-FROM-SCORED-USE/);
 }else{
  assert.equal(e.compulsorySourceRepairOrExclusionBeforeSingleKey,false);
  assert.equal(e.publisherStemConcern,null);
  assert.match(e.sourceDisposition,/RETAIN-ORIGINAL/);
 }
 if(e.candidateOfficialPrintedSlo){
  const oSlo=originalSlo.find(x=>x.printedCode===e.candidateOfficialPrintedSlo);
  assert.ok(oSlo&&oSlo.assessment==='Summative','Candidate printed outcome must be in official original manifest');
  if(e.officialPrintedCognitive)assert.equal(e.officialPrintedCognitive,oSlo.cognitive);
  assert.equal(e.directSummativeMatch,'PROVISIONAL-CANDIDATE');
 }else{
  assert.equal(e.directSummativeMatch,'NOT-ESTABLISHED');
  assert.equal(e.compulsorySloOrCognitiveAdjudication,true);
 }
 if(e.category==='numerical')assert.equal(e.originalPublisherAnswerForInternalComparison,p.item.printedAnswer);
 if(p.item.subparts)assert.deepEqual(e.originalSubparts,p.item.subparts);
}

const exactSourceHolds=['mcq:2','mcq:3','mcq:9','mcq:10','mcq:11','mcq:12',
 'mcq:14','mcq:15','numerical:8.3','numerical:8.4'];
assert.deepEqual(doc.entries.filter(x=>x.compulsorySourceRepairOrExclusionBeforeSingleKey).map(x=>x.id),exactSourceHolds);
const noDirectSlo=['mcq:12','mcq:15','mcq:17','mcq:18','short:8.8','numerical:8.5','numerical:8.8'];
assert.deepEqual(doc.entries.filter(x=>!x.candidateOfficialPrintedSlo).map(x=>x.id),noDirectSlo);
const anomaly=doc.entries.find(x=>x.id==='mcq:13');
assert.equal(anomaly.candidateOfficialPrintedSlo,'P-12-C-01');
assert.match(anomaly.frameworkPrintedCodeAnomaly,/no unverified renumbering/);
assert.equal(anomaly.compulsorySloOrCognitiveAdjudication,true);
const pageSplit=doc.entries.find(x=>x.id==='mcq:17');
assert.deepEqual(pageSplit.printedPages,[151,152]);
assert.match(pageSplit.presentationCompletenessRequirement,/fourth printed answer option/);
const num3=doc.entries.find(x=>x.id==='numerical:8.3');
assert.match(num3.publisherStemConcern,/initial numerical T/);
const num4=doc.entries.find(x=>x.id==='numerical:8.4');
assert.match(num4.publisherStemConcern,/low-reservoir heat absorption/);
const comp4=doc.entries.find(x=>x.id==='comprehensive:8.4');
assert.deepEqual(comp4.originalSubparts,['a','b','c','d']);
const short13=doc.entries.find(x=>x.id==='short:8.13');
assert.deepEqual(short13.originalSubparts,['i','ii','iii','iv']);
const num9=doc.entries.find(x=>x.id==='numerical:8.9');
assert.deepEqual(num9.originalSubparts,['a','b']);
assert.match(num9.presentationCompletenessRequirement,/P–V diagram/);

const t=doc.tallies;
assert.deepEqual(t.byCategory,doc.accounting.categoryCounts);
assert.equal(t.totalEntries,50);
assert.equal(t.sourceLevelAssessmentConcerns,10);
assert.equal(t.compulsorySolutionQualifications,doc.entries.filter(x=>x.compulsorySolutionQualification).length);
assert.equal(t.optionalTeachingNotes,doc.entries.filter(x=>x.optionalTeacherNote).length);
assert.equal(t.compulsorySloOrCognitiveAdjudications,doc.entries.filter(x=>x.compulsorySloOrCognitiveAdjudication).length);
assert.equal(t.missingDirectSummativeSlo,noDirectSlo.length);
assert.equal(t.presentationOrDiagramCompletenessChecks,doc.entries.filter(x=>x.presentationCompletenessRequirement).length);
assert.deepEqual(
 [t.compulsorySolutionQualifications,t.optionalTeachingNotes,t.compulsorySloOrCognitiveAdjudications,t.presentationOrDiagramCompletenessChecks],
 [35,8,28,6]);
const priorChapterRisks=json('quality/unit08/unit08-v245-comprehensive09-11-review-no-answers.json').sourcePassageRiskLedger;
assert.equal(t.originalSourcePassageRisks,8);
assert.equal(t.compulsoryOriginalSourcePassageRisks,7);
assert.equal(doc.chapterPassageRisks.length,priorChapterRisks.length);
assert.deepEqual(doc.chapterPassageRisks.map(x=>x.id),priorChapterRisks.map(x=>x.issueId));
for(let j=0;j<8;j++){
 assert.equal(doc.chapterPassageRisks[j].printedPage,priorChapterRisks[j].printedPage);
 assert.equal(doc.chapterPassageRisks[j].priority,priorChapterRisks[j].priority);
 assert.equal(doc.chapterPassageRisks[j].relatedOriginalQuestion,priorChapterRisks[j].relatedOriginalQuestion);
}
assert.match(doc.triageDefinitions.SOURCE_LEVEL_ASSESSMENT_CONCERN,/separately authored/);
assert.match(doc.triageDefinitions.SLO_ADJUDICATION,/not approval/);
for(const term of ['50/50','10/10','18 / 13 / 10 / 9','P-12-C-01','Numerical 8.3',
 'Numerical 8.4','COMPULSORY','2,250','NOT','8.8','P–V diagram']){
 assert.ok(notes.includes(term),'Teacher guide missing high priority item '+term);
}
for(const e of doc.entries){
 assert.ok(notes.includes(e.priorReviewVersion));
 assert.ok(notes.includes('| '+({mcq:'MCQ',short:'Short',comprehensive:'Comprehensive',numerical:'Numerical'}[e.category])+' '+e.sourceNumber+' |'),
  'Teacher guide must present original entry '+e.id);
}
assert.equal(doc.releaseGate.humanScienceCertification,'PENDING');
assert.equal(doc.releaseGate.humanOfficialItemSloCertification,'PENDING');
assert.equal(doc.releaseGate.humanTeacherKeyCertification,'PENDING');
assert.equal(doc.releaseGate.approvedStudentAnswerOrScoreCount,0);
assert.equal(doc.releaseGate.unit7And8ScoredBank,'NOT-PUBLISHED');
assert.equal(doc.releaseGate.originalQuestionStemsCopied,false);
assert.equal(doc.releaseGate.originalPublisherFiguresCopied,false);
assert.equal(doc.releaseGate.sourceAnswerKeysPublished,false);
assert.equal(doc.releaseGate.original2250PinnedUnits1to6Mcqs,'MUST-REMAIN-UNCHANGED');
assert.equal(doc.releaseGate.ownerApproval,'HOLD');
const forbidden=['correctAnswer','correctOption','answerKey','publisherStem','verbatimQuestionStem',
 'fullModelAnswer','sourcePageImage','sourceFigureFile','publishedGradedAnswer'];
const visit=x=>{if(Array.isArray(x))return x.forEach(visit);if(x&&typeof x==='object'){
 for(const f of forbidden)assert.equal(Object.hasOwn(x,f),false,'No actual source stem or approved answer key: '+f);
 Object.values(x).forEach(visit);
}};visit(doc);
const units=catalog.grades.find(g=>g.grade===11).units;
for(const n of [7,8]){
 const u=units.find(x=>x.unit===n);
 assert.equal(u.status,'planned');assert.equal(u.questionBankCount,0);
 assert.equal(u.assessmentStatus,'not-published');assert.deepEqual(u.resourceIds,[]);
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
console.log('V249 PASS: all 50 original Unit8 exercises crosslinked to 12 review ledgers, 10 source-level concerns, 7 direct-SLO gaps, 8 passage risks, full original numbering, zero approvals, legacy 2250 MCQs protected.');
