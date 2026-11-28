#!/usr/bin/env node
'use strict';
/* V240: original NBF Grade XI Unit8 short-response Q8.1–8.4 source/QC review only.
 * Never import original stems, solutions or future scored bank on this branch.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const review=json('quality/unit08/unit08-v240-short01-04-review-no-answers.json');
const notes=read('quality/unit08/unit08-v240-short01-04-academic-triage.md');
const source=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const inventory=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const v239=json('quality/unit08/unit08-v239-end-mcq13-18-review-no-keys.json');
const catalog=json('portal/learning-catalog.json');
const banks=json('question-bank/manifest.json');
assert.equal(review.schema,'psn-nbf-grade11-unit08-short-response-qc-v240');
assert.equal(review.version,'V240');
assert.equal(review.originalSource.sourceSha256,source.originalTextbook.sha256);
assert.equal(review.originalSource.sourceSha256,inventory.source.sha256);
assert.deepEqual(review.originalSource.printedPages,[152]);
assert.deepEqual(review.originalSource.questionIds,['8.1','8.2','8.3','8.4']);
const short=inventory.sourceSections.find(s=>s.kind==='short');
assert.ok(short,'V235 source must include short-response section');
assert.equal(short.items.length,13);
assert.equal(inventory.observedTotal,50);
assert.deepEqual(short.printedPages,[152,152]);
assert.equal(review.items.length,4);
assert.deepEqual(review.items.map(x=>x.sourceNumber),['8.1','8.2','8.3','8.4']);
assert.deepEqual(review.items.map(x=>x.printedPages),[[152],[152],[152],[152]]);
const allowedNotes=['optional explanatory condition','no original stem amendment; optional ideal-gas contrast'];
const compulsory=['compulsory answer/model qualification before graded use',
 'compulsory precision in worked explanation; original question retained'];
const official=source.officialFramework.slos;
for(const item of review.items){
 const original=short.items.find(s=>s.sourceNumber===item.sourceNumber);
 assert.ok(original,'Original NBF short question must exist in V235');
 assert.equal(item.focus,original.focus,'Match the historical source index label');
 assert.deepEqual(item.printedPages,original.printedPages);
 const o=official.find(s=>s.printedCode===item.candidateSummativeSlo);
 assert.ok(o,'Candidate must be original printed SLO '+item.sourceNumber);
 assert.equal(o.assessment,'Summative');
 assert.equal(o.cognitive,item.candidateFrameworkCognitive);
 assert.ok(o.cognitive.includes(item.observedCognitive),
  'Reviewer cognitive level must be contained in printed outcome categories');
 if(item.additionalCandidateSlo){
  const additional=official.find(s=>s.printedCode===item.additionalCandidateSlo);
  assert.ok(additional&&additional.assessment==='Summative','Secondary outcome must be in official framework');
 }
 assert.equal(item.keepOriginal,true);
 assert.equal(item.studentRelease,'HOLD');
 assert.equal(item.answersPublished,false);
 assert.equal(item.approvedTeacherMarkingScheme,false);
 assert.equal(item.teacherScienceApproval,'PENDING');
 assert.equal(item.teacherSloApproval,'PENDING');
 assert.ok(item.reason.length>=160,'Explain original issue in scientific detail');
 if(item.amendmentMandatoryBeforeGradedUse)
  assert.ok(compulsory.includes(item.amendment),'Compulsory academic explanation retained');
 else
  assert.ok(allowedNotes.includes(item.amendment),'Only optional teacher explanatory note');
}
assert.deepEqual(review.items.map(x=>x.candidateSummativeSlo),
 ['P-11-C-09','P-11-C-12','P-11-C-12','P-11-C-08']);
assert.equal(review.items.find(x=>x.sourceNumber==='8.3').additionalCandidateSlo,'P-11-C-11');
assert.deepEqual(review.items.filter(x=>x.amendmentMandatoryBeforeGradedUse).map(x=>x.sourceNumber),['8.3','8.4']);
assert.deepEqual(review.items.filter(x=>!x.amendmentMandatoryBeforeGradedUse).map(x=>x.sourceNumber),['8.1','8.2']);
const audit=review.audit;
assert.equal(audit.sourceQuestionCount,4);
assert.equal(audit.sourceTotalShortResponseQuestions,13);
assert.deepEqual(audit.requiresCompulsoryExplanationQualification,['8.3','8.4']);
assert.deepEqual(audit.optionalTeachingNotes,['8.1','8.2']);
assert.equal(audit.noSourceStemRewrites,true);
assert.equal(audit.printedSourceNumberingPreserved,true);
assert.equal(audit.humanScienceReview,'PENDING');
assert.equal(audit.humanSloCognitiveReview,'PENDING');
assert.equal(audit.studentAnswerEdition,'NOT-PUBLISHED');
assert.ok(inventory.reviewFlags.some(f=>f.kind==='short'&&f.sourceNumber==='8.3'&&f.flagId==='SHORT-8.3'));
assert.equal(v239.items.length,6);
assert.deepEqual(v239.items.map(x=>x.sourceNumber),['13','14','15','16','17','18']);
for(const expected of ['8.1','8.2','8.3','8.4'])assert.ok(notes.includes('**'+expected+'**'),'Retain explicit teacher triage for '+expected);
assert.match(notes,/COMPULSORY nuanced answer/);
assert.match(notes,/COMPULSORY precise transfer\/path explanation/);
assert.match(notes,/OPTIONAL explanatory qualification/);
assert.match(notes,/2250|2,250/);
assert.match(notes,/P-11-C-08/);
const gate=review.releaseGate;
assert.equal(gate.unit8ScoredQuestionCount,0);
assert.equal(gate.unit8TestBuilderBankEnabled,false);
assert.equal(gate.teacherAnswerEditionApproved,false);
assert.equal(gate.originalStemsCopied,false);
assert.equal(gate.sourcePageImagesCopied,false);
assert.equal(gate.ownerApproval,'HOLD');
for(const forbidden of ['answerKey','correctAnswer','correctOption','markedAnswer',
 'verbatimQuestionStem','printedQuestionText','fullModelAnswer','approvedMarkingScheme','sourcePageImage']){
 const visit=v=>{if(Array.isArray(v))return v.forEach(visit);
  if(v&&typeof v==='object'){
   assert.equal(Object.prototype.hasOwnProperty.call(v,forbidden),false,'Review is not an answer edition: '+forbidden);
   Object.values(v).forEach(visit);
  }
 };visit(review);
}
const units=catalog.grades.find(g=>g.grade===11).units;
for(const n of [7,8]){
 const u=units.find(x=>x.unit===n);
 assert.equal(u.status,'planned');
 assert.equal(u.questionBankCount,0);
 assert.equal(u.assessmentStatus,'not-published');
 assert.deepEqual(u.resourceIds,[]);
}
assert.equal(units.find(x=>x.unit===7).additionalLearningPreviews.length,2);
assert.equal(units.find(x=>x.unit===8).additionalLearningPreviews.length,9);
assert.equal(units.find(x=>x.unit===7).simulationCount,2);
assert.equal(units.find(x=>x.unit===8).simulationCount,4);
assert.equal(catalog.resources.length,59);
const live=banks.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount);
assert.deepEqual(live,[275,206,220,640,349,560]);
assert.equal(live.reduce((a,b)=>a+b,0),2250);
assert.equal(source.releaseGate.studentScoredUnit8Mcqs,0);
console.log('V240 PASS: original NBF short Q8.1–8.4, source page and FBISE candidate SLOs; compulsory nuanced Q8.3/8.4 review; no student answers, 2250 pinned MCQs protected.');
