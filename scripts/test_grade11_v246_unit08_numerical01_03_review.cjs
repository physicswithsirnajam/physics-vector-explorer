#!/usr/bin/env node
'use strict';
/* V246: original NBF Grade XI Unit8 numerical 8.1–8.3 source/calculation QC.
 * Printed answer labels are for review, not approved student solved editions.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8'),json=p=>JSON.parse(read(p));
const review=json('quality/unit08/unit08-v246-numerical01-03-source-qc-no-approved-answers.json');
const notes=read('quality/unit08/unit08-v246-numerical01-03-teacher-triage.md');
const v245=json('quality/unit08/unit08-v245-comprehensive09-11-review-no-answers.json');
const v235=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const v224=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const catalog=json('portal/learning-catalog.json'),banks=json('question-bank/manifest.json');

const near=(actual,expected,tol=1e-9,label='number')=>assert.ok(
 Number.isFinite(actual)&&Math.abs(actual-expected)<=tol,
 label+': expected '+expected+', got '+actual);
assert.equal(review.schema,'psn-nbf-grade11-unit08-numerical-source-qc-v246');
assert.equal(review.version,'V246');
assert.equal(review.originalSource.sourceSha256,v224.originalTextbook.sha256);
assert.equal(review.originalSource.sourceSha256,v235.source.sha256);
assert.deepEqual(review.originalSource.problemPrintedPages,[153]);
assert.deepEqual(review.originalSource.problemIds,['8.1','8.2','8.3']);
assert.deepEqual(review.originalSource.supportingPrintedPages,[130,131,134,135,144,145]);
const original=v235.sourceSections.find(x=>x.kind==='numerical');
assert.ok(original,'Original V235 numerical source inventory missing');
assert.equal(original.expectedPublishedCount,9);
assert.equal(original.visuallyObservedCount,9);
assert.deepEqual(original.printedPages,[153,153]);
assert.deepEqual(original.items.map(x=>x.sourceNumber),
 ['8.1','8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9']);
assert.equal(v235.observedTotal,50);
assert.deepEqual(review.items.map(x=>x.sourceNumber),['8.1','8.2','8.3']);
assert.equal(review.items.length,3);
assert.deepEqual(review.items.map(x=>x.printedPages),[[153],[153],[153]]);
assert.deepEqual(review.items.map(x=>x.printedAnswer),
 ['0.3 moles','27%','0.37 m³']);
assert.deepEqual(review.audit.sourcePrintedAnswers,review.items.map(x=>x.printedAnswer));
assert.equal(v245.audit.coverageAcrossV243V245,
 '10/10 visibly numbered original comprehensive questions preliminarily reviewed');

const outcomes=v224.officialFramework.slos;
for(const it of review.items){
 const fromSource=original.items.find(x=>x.sourceNumber===it.sourceNumber);
 assert.ok(fromSource,'Numerical not in original source numbering '+it.sourceNumber);
 assert.equal(it.focus,fromSource.focus);
 assert.deepEqual(it.printedPages,fromSource.printedPages);
 assert.equal(it.keepOriginal,true);
 assert.equal(it.studentRelease,'HOLD');
 assert.equal(it.approvedSolutionPublished,false);
 assert.equal(it.teacherScienceApproval,'PENDING');
 assert.equal(it.teacherSloApproval,'PENDING');
 assert.equal(it.compulsoryAssumptionsBeforeApprovedSolution,true);
 assert.ok(it.independentScience.length>240,'Require complete independent scientific check');
 assert.ok(it.reviewReason.length>240,'Record source-specific assumptions and ambiguity');
 const official=outcomes.find(x=>x.printedCode===it.candidateSummativeSlo);
 assert.ok(official&&official.assessment==='Summative','Use only original summative SLO candidates');
 assert.equal(it.candidateFrameworkCognitive,official.cognitive);
 if(it.secondaryCandidateSlo){
  const second=outcomes.find(x=>x.printedCode===it.secondaryCandidateSlo);
  assert.ok(second&&second.assessment==='Summative','Secondary outcome must be original summative record');
  assert.equal(it.secondaryFrameworkCognitive,second.cognitive);
 }
 assert.ok(v235.reviewFlags.some(x=>x.kind==='numerical'&&x.sourceNumber===it.sourceNumber),
  'Original V235 problem caution must remain linked: '+it.sourceNumber);
}
assert.deepEqual(review.items.map(x=>x.candidateSummativeSlo),
 ['P-11-C-03','P-11-C-23','P-11-C-09']);
assert.deepEqual(review.items.map(x=>x.observedCognitive),
 ['Application','Application','Application']);
assert.deepEqual(review.items.filter(x=>x.compulsorySloCognitiveReview).map(x=>x.sourceNumber),
 ['8.2','8.3']);
assert.equal(review.items[1].secondaryCandidateSlo,'P-11-C-16');
assert.equal(review.items[2].secondaryCandidateSlo,'P-11-C-03');

const q1=review.items[0].independentCheck;
assert.equal(q1.type,'conditional-numerical');
assert.equal(q1.quantitiesSI.radiusMetres,0.1);
assert.equal(q1.quantitiesSI.pressurePascals,180000);
assert.equal(q1.quantitiesSI.assumedTemperatureKelvin,300);
const sphere=(4/3)*Math.PI*Math.pow(q1.quantitiesSI.radiusMetres,3);
near(sphere,q1.quantitiesSI.volumeCubicMetres,1e-14,'balloon sphere volume');
const nCalc=q1.quantitiesSI.pressurePascals*sphere/
 (q1.quantitiesSI.gasConstantJPerMolKelvin*q1.quantitiesSI.assumedTemperatureKelvin);
near(nCalc,q1.resultMoles,1e-11,'balloon ideal-gas moles at 300 K');
near(q1.quantitiesSI.pressurePascals*sphere/
 (q1.quantitiesSI.gasConstantJPerMolKelvin*q1.alternateTemperatureKelvin),
 q1.alternateMoles,1e-11,'balloon alternate room temperature');
assert.equal(q1.roundedResult,'0.3 mol');
assert.match(q1.printedAnswerConsistency,/ABSOLUTE 180 kPa/);
assert.match(q1.gaugePressureCaveat,/gauge/i);

const q2=review.items[1].independentCheck;
assert.equal(q2.type,'conditional-maximum-efficiency');
near(1-q2.quantitiesSI.coldKelvin/q2.quantitiesSI.hotKelvin,
 q2.resultFraction,1e-12,'Carnot efficiency fraction');
near(q2.resultPercent,100*q2.resultFraction,1e-10,'Carnot efficiency percent');
assert.equal(q2.roundedResult,'27%');
assert.ok(q2.resultFraction>0 && q2.resultFraction<1);
assert.equal(review.items[1].printedGiven.engineType,
 'heat engine; Carnot/reversible NOT explicitly stated');
assert.match(q2.printedAnswerConsistency,/reversible\/Carnot maximum/);

const q3=review.items[2].independentCheck;
assert.equal(q3.type,'underdetermined');
assert.equal(q3.givenSI.amountMoles,1);
assert.equal(q3.givenSI.initialVolumeCubicMetres,100);
assert.equal(q3.givenSI.temperatureRiseKelvin,1);
assert.deepEqual(q3.missingIndependentlyRequired,
 ['initial numerical temperature T_i','constraint on pressure/process, e.g. P constant']);
near(100/273.15,q3.conditionalResultAt273_15K,1e-11,
 'conditional Charles law at 273.15 K');
near(100/300,q3.conditionalResultAt300K,1e-11,
 'conditional Charles law at 300 K');
near(100/0.37,q3.impliedTemperatureIf0_37ExactKelvin,1e-10,
 'implied initial temperature if printed delta V exact');
assert.equal(q3.roundedConditionalResult,'0.37 m³');
assert.ok(Math.abs(q3.conditionalResultAt273_15K-q3.conditionalResultAt300K)>0.03,
 'Two valid T choices must demonstrate underdetermination');
assert.match(review.items[2].reviewReason,/two distinct missing inputs\/assumptions/i);
assert.match(q3.printedAnswerConsistency,/not uniquely implied/);

const audit=review.audit;
assert.equal(audit.reviewedCount,3);
assert.equal(audit.originalVisibleNumericalCount,9);
assert.deepEqual(audit.independentlyConsistentOnlyWithStatedAssumptions,['8.1','8.2']);
assert.deepEqual(audit.cannotDeriveUniquePrintedAnswer,['8.3']);
assert.deepEqual(audit.compulsoryAssumptionOrAnswerQualifications,['8.1','8.2','8.3']);
assert.deepEqual(audit.compulsorySloOrCognitiveReview,['8.2','8.3']);
assert.deepEqual(audit.missingInputsNumerical8_3,
 ['initial numerical temperature','constant-pressure process or equivalent constraint']);
assert.deepEqual(audit.originalV235IssueFlags,['NUM-8.1','NUM-8.2','NUM-8.3']);
assert.equal(audit.originalQuestionsAndPrintedAnswersRetained,true);
assert.equal(audit.humanIndependentScienceApproval,'PENDING');
assert.equal(audit.humanSloCognitiveApproval,'PENDING');
assert.equal(audit.studentSolvedNumericalEdition,'NOT-PUBLISHED');
for(const n of ['8.1','8.2','8.3'])
 assert.ok(notes.includes('**'+n+' —'),'Teacher triage must identify original item '+n);
for(const token of ['0.3 moles','27%','0.37 m³','100 m³','0.33333','P-11-C-23','gauge pressure','273.15 K'])
 assert.ok(notes.includes(token),'Teacher audit misses grounded condition: '+token);
assert.match(notes,/COMPULSORY underdetermination/i);
assert.match(notes,/not uniquely solvable/i);

const gate=review.releaseGate;
assert.equal(gate.unit8ScoredQuestionCount,0);
assert.equal(gate.unit8TestBuilderBankEnabled,false);
assert.equal(gate.teacherAnswerEditionApproved,false);
assert.equal(gate.originalStemsCopied,false);
assert.equal(gate.sourcePageImagesCopied,false);
assert.equal(gate.ownerApproval,'HOLD');
const forbidden=['correctOption','answerKey','sourceQuestionStem','verbatimQuestionStem','fullModelAnswer',
 'printedQuestionText','sourcePageImage','approvedMarkingScheme','publishedGradedAnswer'];
const visit=v=>{if(Array.isArray(v))return v.forEach(visit);if(v&&typeof v==='object'){
 for(const key of forbidden)assert.equal(Object.hasOwn(v,key),false,'No source stem or approved answer release: '+key);
 Object.values(v).forEach(visit);
}};visit(review);
const grade=catalog.grades.find(g=>g.grade===11);
for(const n of [7,8]){
 const u=grade.units.find(x=>x.unit===n);
 assert.equal(u.status,'planned');assert.equal(u.questionBankCount,0);
 assert.equal(u.assessmentStatus,'not-published');assert.deepEqual(u.resourceIds,[]);
}
assert.equal(grade.units.find(u=>u.unit===7).additionalLearningPreviews.length,2);
assert.equal(grade.units.find(u=>u.unit===8).additionalLearningPreviews.length,9);
assert.equal(grade.units.find(u=>u.unit===7).simulationCount,2);
assert.equal(grade.units.find(u=>u.unit===8).simulationCount,4);
assert.equal(catalog.resources.length,59);
const counts=banks.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount);
assert.deepEqual(counts,[275,206,220,640,349,560]);
assert.equal(counts.reduce((a,b)=>a+b,0),2250);
assert.equal(v224.releaseGate.studentScoredUnit8Mcqs,0);

console.log('V246 PASS: original NBF Unit8 numeric 8.1–8.3 and printed answers verified conditionally, original 8.3 doubly underdetermined, authentic summative SLO candidates, no student keys, 2250 pinned MCQs unchanged.');
