#!/usr/bin/env node
'use strict';
/* V243 NBF XI Unit8 source comprehension Q8.1–8.4: review metadata ONLY.
 * Source stems, textbook figures, answer editions and scored banks remain out of scope.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const review=json('quality/unit08/unit08-v243-comprehensive01-04-review-no-answers.json');
const notes=read('quality/unit08/unit08-v243-comprehensive01-04-academic-triage.md');
const v242=json('quality/unit08/unit08-v242-short09-13-review-no-answers.json');
const v241=json('quality/unit08/unit08-v241-short05-08-review-no-answers.json');
const v240=json('quality/unit08/unit08-v240-short01-04-review-no-answers.json');
const v235=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const v224=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const cat=json('portal/learning-catalog.json'),bank=json('question-bank/manifest.json');

assert.equal(review.schema,'psn-nbf-grade11-unit08-comprehensive-qc-v243');
assert.equal(review.version,'V243');
assert.equal(review.originalSource.sourceSha256,v224.originalTextbook.sha256);
assert.equal(review.originalSource.sourceSha256,v235.source.sha256);
assert.deepEqual(review.originalSource.questionPrintedPages,[152]);
assert.deepEqual(review.originalSource.questionIds,['8.1','8.2','8.3','8.4']);
assert.deepEqual(review.originalSource.chapterReferencePages,[129,130,134,135,136,137,138,139,140]);
const source=v235.sourceSections.find(x=>x.kind==='comprehensive');
assert.ok(source,'Original comprehensive inventory required');
assert.equal(source.visuallyObservedCount,10);
assert.equal(source.v224BaselineClaimedCount,11);
assert.equal(source.items.length,10);
assert.deepEqual(source.items.map(x=>x.sourceNumber),['8.1','8.2','8.3','8.4','8.5','8.6','8.7','8.9','8.10','8.11']);
assert.equal(source.items.some(x=>x.sourceNumber==='8.8'),false);
assert.equal(review.audit.originalMissingNumber,'8.8');
assert.equal(v235.discrepancy.id,'SOURCE-COMP-8.8');
assert.deepEqual(review.audit.originalPrintedComprehensiveNumbering,source.items.map(x=>x.sourceNumber));
assert.equal(review.items.length,4);
assert.deepEqual(review.items.map(x=>x.sourceNumber),['8.1','8.2','8.3','8.4']);
assert.deepEqual(review.items.map(x=>x.printedPages),[[152],[152],[152],[152]]);
const fourth=review.items.find(x=>x.sourceNumber==='8.4');
assert.deepEqual(fourth.subparts,['a','b','c','d']);
assert.deepEqual(fourth.partLabels,['Isothermal process','Isobaric process','Adiabatic process','Isochoric process']);
assert.deepEqual(source.items.find(x=>x.sourceNumber==='8.4').subparts,['a','b','c','d']);
const originalOutcomes=v224.officialFramework.slos;
for(const item of review.items){
 const original=source.items.find(x=>x.sourceNumber===item.sourceNumber);
 assert.ok(original,'Source question missing: '+item.sourceNumber);
 assert.equal(item.focus,original.focus);
 assert.deepEqual(item.printedPages,original.printedPages);
 assert.ok(item.sourceCoveragePages.every(n=>n>=129&&n<=140));
 assert.equal(item.keepOriginal,true);
 assert.equal(item.studentRelease,'HOLD');
 assert.equal(item.answersPublished,false);
 assert.equal(item.approvedTeacherMarkingScheme,false);
 assert.equal(item.teacherScienceApproval,'PENDING');
 assert.equal(item.teacherSloApproval,'PENDING');
 assert.ok(item.reason.length>=175,'Academic rationale too brief');
 assert.ok(item.scienceReview.length>=200,'Require material assumptions/scientific distinctions');
 const outcome=originalOutcomes.find(x=>x.printedCode===item.candidateSummativeSlo);
 assert.ok(outcome&&outcome.assessment==='Summative','Use only original framework candidate outcomes');
 assert.equal(item.candidateFrameworkCognitive,outcome.cognitive);
 assert.ok(outcome.cognitive.includes(item.observedCognitive));
 const secondary=originalOutcomes.find(x=>x.printedCode===item.additionalCandidateSlo);
 assert.ok(secondary&&secondary.assessment==='Summative','Keep authentic second outcome mapping');
}
assert.deepEqual(review.items.map(x=>x.candidateSummativeSlo),
 ['P-11-C-02','P-11-C-09','P-11-C-08','P-11-C-08']);
assert.deepEqual(review.items.map(x=>x.additionalCandidateSlo),
 ['P-11-C-12','P-11-C-10','P-11-C-11','P-11-C-10']);
assert.deepEqual(review.items.filter(x=>x.compulsoryExplanationBeforeAssessedUse).map(x=>x.sourceNumber),
 ['8.1','8.3','8.4']);
assert.deepEqual(review.items.filter(x=>!x.compulsoryExplanationBeforeAssessedUse).map(x=>x.sourceNumber),['8.2']);
assert.deepEqual(review.items.filter(x=>x.compulsoryMappingReview).map(x=>x.sourceNumber),['8.2','8.4']);
assert.match(review.items[0].scienceReview,/monatomic ideal gas/);
assert.match(review.items[0].reason,/constant-T/);
assert.match(review.items[1].scienceReview,/Boyle's law/);
assert.match(review.items[1].scienceReview,/Charles's law/);
assert.match(review.items[1].scienceReview,/Gay-Lussac's law/);
assert.match(review.items[2].scienceReview,/ΔU=Q−W_by/);
assert.match(review.items[3].scienceReview,/Isochoric/i);
assert.match(review.items[3].reason,/source's chapter teaching sequence/);
assert.equal(review.audit.reviewedCount,4);
assert.equal(review.audit.sourceVisibleComprehensiveCount,10);
assert.deepEqual(review.audit.compulsoryExplanationQualification,['8.1','8.3','8.4']);
assert.deepEqual(review.audit.optionalTeachingNote,['8.2']);
assert.deepEqual(review.audit.compulsoryCognitiveOrDirectSloReview,['8.2','8.4']);
assert.deepEqual(review.audit.fourPartSourceCompleteness,['8.4']);
assert.deepEqual(review.audit.newEstablishedPublisherQuestionStemDefects,[]);
assert.equal(review.audit.scienceTeacherApproval,'PENDING');
assert.equal(review.audit.cognitiveSloTeacherApproval,'PENDING');
assert.equal(review.audit.studentSolutionEdition,'NOT-PUBLISHED');
assert.equal(review.audit.sourceStemsRemainUnchanged,true);
for(const n of ['8.1','8.2','8.3','8.4'])assert.ok(notes.includes('**'+n+' —'),'Teacher review row missing '+n);
assert.match(notes,/8\.8 is absent/);
assert.match(notes,/\*\*\(a\) isothermal\*\*/);
assert.match(notes,/P-11-C-02/);
assert.match(notes,/2,250/);
assert.deepEqual([...v240.items,...v241.items,...v242.items].map(x=>x.sourceNumber),
 v235.sourceSections.find(x=>x.kind==='short').items.map(x=>x.sourceNumber));
const gate=review.releaseGate;
assert.equal(gate.unit8ScoredQuestionCount,0);
assert.equal(gate.unit8TestBuilderBankEnabled,false);
assert.equal(gate.teacherAnswerEditionApproved,false);
assert.equal(gate.originalStemsCopied,false);
assert.equal(gate.sourcePageImagesCopied,false);
assert.equal(gate.ownerApproval,'HOLD');
const blocked=['answerKey','correctAnswer','correctOption','sourceQuestionStem','verbatimQuestionStem',
 'fullModelAnswer','printedQuestionText','sourcePageImage','approvedMarkingScheme'];
function inspect(v){if(Array.isArray(v))return v.forEach(inspect);if(v&&typeof v==='object'){
 for(const key of blocked)assert.equal(Object.hasOwn(v,key),false,'No publisher-stem or answer release: '+key);
 Object.values(v).forEach(inspect);
}}inspect(review);
const grade=cat.grades.find(g=>g.grade===11);
for(const n of [7,8]){
 const u=grade.units.find(x=>x.unit===n);
 assert.equal(u.status,'planned');
 assert.equal(u.questionBankCount,0);
 assert.equal(u.assessmentStatus,'not-published');
 assert.deepEqual(u.resourceIds,[]);
}
assert.equal(grade.units.find(x=>x.unit===7).additionalLearningPreviews.length,2);
assert.equal(grade.units.find(x=>x.unit===8).additionalLearningPreviews.length,9);
assert.equal(grade.units.find(x=>x.unit===7).simulationCount,2);
assert.equal(grade.units.find(x=>x.unit===8).simulationCount,4);
assert.equal(cat.resources.length,59);
const counts=bank.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount);
assert.deepEqual(counts,[275,206,220,640,349,560]);
assert.equal(counts.reduce((a,b)=>a+b,0),2250);
assert.equal(v224.releaseGate.studentScoredUnit8Mcqs,0);
console.log('V243 PASS: source comprehensive Q8.1–8.4, 4 exact parts, ideal-vs-real U, original 3 gas laws, First Law signs, SLO holds and historical missing 8.8; 2250 pinned MCQs intact, no student release.');
