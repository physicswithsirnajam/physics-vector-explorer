#!/usr/bin/env node
'use strict';
/* V247 original NBF Grade XI Unit8 Numericals 8.4–8.6:
 * Independent conditional science/arithmetic QC; NOT an approved student key.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const review=json('quality/unit08/unit08-v247-numerical04-06-source-qc-no-approved-answers.json');
const notes=read('quality/unit08/unit08-v247-numerical04-06-teacher-triage.md');
const v246=json('quality/unit08/unit08-v246-numerical01-03-source-qc-no-approved-answers.json');
const inv=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const framework=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const catalog=json('portal/learning-catalog.json');
const banks=json('question-bank/manifest.json');
const near=(value,expected,epsilon=1e-9,reason='value')=>
 assert.ok(Number.isFinite(value)&&Math.abs(value-expected)<=epsilon,
 reason+': expected '+expected+' got '+value);

assert.equal(review.schema,'psn-nbf-grade11-unit08-numerical-source-qc-v247');
assert.equal(review.version,'V247');
assert.equal(review.originalSource.sourceSha256,framework.originalTextbook.sha256);
assert.equal(review.originalSource.sourceSha256,inv.source.sha256);
assert.equal(review.originalSource.sourceSha256,v246.originalSource.sourceSha256);
assert.deepEqual(review.originalSource.problemPrintedPages,[153]);
assert.deepEqual(review.originalSource.problemIds,['8.4','8.5','8.6']);
assert.deepEqual(v246.originalSource.problemIds,['8.1','8.2','8.3']);
const original=inv.sourceSections.find(x=>x.kind==='numerical');
assert.equal(original.items.length,9);
assert.equal(original.visuallyObservedCount,9);
assert.equal(inv.observedTotal,50);
assert.deepEqual(original.items.map(x=>x.sourceNumber),
 ['8.1','8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9']);
assert.deepEqual(review.items.map(x=>x.sourceNumber),['8.4','8.5','8.6']);
assert.deepEqual(review.items.map(x=>x.printedPages),[[153],[153],[153]]);
assert.deepEqual(review.items.map(x=>x.printedAnswer),['200 J','198 s','397 K']);

const originalSlo=framework.officialFramework.slos;
for(const item of review.items){
 const sourceItem=original.items.find(x=>x.sourceNumber===item.sourceNumber);
 assert.ok(sourceItem,'Missing V235 source numerical '+item.sourceNumber);
 assert.equal(item.focus,sourceItem.focus);
 assert.deepEqual(item.printedPages,sourceItem.printedPages);
 assert.equal(item.studentRelease,'HOLD');
 assert.equal(item.approvedSolutionPublished,false);
 assert.equal(item.teacherScienceApproval,'PENDING');
 assert.equal(item.teacherSloApproval,'PENDING');
 assert.equal(item.keepOriginal,true);
 assert.ok(item.reviewReason.length>=170,'Independent source-specific analysis required');
 const primary=item.candidateSummativeSlo&&originalSlo.find(x=>x.printedCode===item.candidateSummativeSlo);
 if(item.sourceNumber==='8.5'){
  assert.equal(item.candidateSummativeSlo,null,
   'No direct specific-heat/time assessment outcome established in V224');
  assert.equal(item.candidateFrameworkCognitive,null);
 }else{
  assert.ok(primary&&primary.assessment==='Summative');
  assert.equal(primary.cognitive,item.candidateFrameworkCognitive);
 }
 if(item.secondaryCandidateSlo){
  const secondary=originalSlo.find(x=>x.printedCode===item.secondaryCandidateSlo);
  assert.ok(secondary&&secondary.assessment==='Summative');
  assert.equal(secondary.cognitive,item.secondaryFrameworkCognitive);
 }
}
assert.deepEqual(review.items.map(x=>x.candidateSummativeSlo),
 ['P-11-C-23',null,'P-11-C-23']);
assert.deepEqual(review.items.map(x=>x.secondaryCandidateSlo),
 ['P-11-C-16','P-11-C-11','P-11-C-16']);
assert.deepEqual(review.items.map(x=>x.observedCognitive),
 ['Application','Application','Application']);

const n4=review.items[0].independentCheck;
assert.equal(n4.type,'source-contradiction');
const hi=review.items[0].printedGiven.hotTemperatureKelvin;
const lo=review.items[0].printedGiven.coldTemperatureKelvin;
const heat=review.items[0].printedGiven.heatAbsorbedJoules;
assert.equal(hi,600);assert.equal(lo,400);assert.equal(heat,600);
assert.equal(review.items[0].printedGiven.printedHeatAbsorptionReservoir,'low temperature of 400 K');
near(heat*(1-lo/hi),n4.hotHeatInputInterpretation.computedWorkByJoules,1e-12,'ideal-engine hot input');
near(heat*(hi/lo-1),n4.coldHeatRejectedInterpretation.computedWorkByJoules,1e-12,'engine cold rejection');
near(heat*(hi/lo-1),n4.coldHeatAbsorbedInterpretation.reversibleRefrigeratorWorkInputJoules,1e-12,'refrigerator cold absorption');
assert.deepEqual([n4.hotHeatInputInterpretation.computedWorkByJoules,
 n4.coldHeatRejectedInterpretation.computedWorkByJoules,
 n4.coldHeatAbsorbedInterpretation.reversibleRefrigeratorWorkInputJoules],[200,300,300]);
assert.match(n4.printedAnswerStatus,/reinterpretation/);
assert.equal(review.items[0].classification,'compulsory source contradiction; block unique assessed answer');
assert.ok(inv.reviewFlags.some(x=>x.flagId==='NUM-8.4'));

const n5=review.items[1].independentCheck;
assert.equal(n5.type,'calculation-with-constant-choice');
const data=n5.quantitiesSI;
assert.equal(data.massKilograms,0.136);assert.equal(data.heaterPowerWatts,220);
assert.equal(data.temperatureChangeKelvin,76.5);
const waterTime=c=>data.massKilograms*c*data.temperatureChangeKelvin/data.heaterPowerWatts;
near(waterTime(4186),n5.withSpecificHeat4186.computedTimeSeconds,1e-10,'c4186 heater time');
near(waterTime(4200),n5.withSpecificHeat4200.computedTimeSeconds,1e-10,'c4200 heater time');
assert.equal(Math.round(waterTime(4186)),198);
assert.equal(Math.round(waterTime(4200)),199);
assert.equal(n5.withSpecificHeat4186.roundedSeconds,198);
assert.equal(n5.withSpecificHeat4200.nearestWholeSecond,199);
assert.match(n5.printedAnswerStatus,/minor constant\/rounding difference/);
assert.equal(review.items[1].classification,
 'optional numerical constant/boiling-pressure assumptions; compulsory direct SLO eligibility check before scored use');

const n6=review.items[2].independentCheck;
assert.equal(n6.type,'conditional-carnot-temperatures');
assert.equal(n6.initialEfficiency,0.5);assert.equal(n6.targetEfficiency,0.7);
const delta=tc=>tc*(1/(1-n6.targetEfficiency)-1/(1-n6.initialEfficiency));
near(n6.roomTemperatureAssumedKelvin/(1-n6.initialEfficiency),n6.initialHotTemperatureKelvin,1e-10,'initial hot source');
near(n6.roomTemperatureAssumedKelvin/(1-n6.targetEfficiency),n6.finalHotTemperatureKelvin,1e-10,'final hot source');
near(delta(298),n6.computedSourceTemperatureIncreaseKelvin,1e-10,'source delta at 298 K');
near(delta(300),n6.alternativeSourceTemperatureIncreaseKelvin,1e-10,'source delta at 300 K');
assert.equal(Math.round(delta(298)),397);
assert.equal(Math.round(delta(300)),400);
assert.match(n6.printedAnswerStatus,/room temperature 298 K/);
assert.equal(review.items[2].classification,
 'compulsory Carnot/fixed sink/room temperature assumptions; compulsory SLO cognitive review');
assert.ok(inv.reviewFlags.some(x=>x.flagId==='NUM-8.6'));

const audit=review.audit;
assert.equal(audit.sourceQuestionCount,3);assert.equal(audit.sourceVisibleNumericalCount,9);
assert.equal(audit.coverageAcrossV246V247,'6/9 original numericals preliminarily reviewed');
assert.deepEqual(audit.printedAnswers,['200 J','198 s','397 K']);
assert.deepEqual(audit.compulsorySourceContradiction,['8.4']);
assert.deepEqual(audit.constantAndRoundingQualification,['8.5']);
assert.deepEqual(audit.compulsoryModelAssumptions,['8.4','8.6']);
assert.deepEqual(audit.compulsoryDirectSloOrCognitiveMapping,['8.4','8.5','8.6']);
assert.deepEqual(audit.previousV235FlagsExpanded,['NUM-8.4','NUM-8.6']);
assert.deepEqual(audit.newScientificallyProvenSourceStemDefect,['8.4']);
assert.equal(audit.publisherStemsAndPrintedAnswersUnchanged,true);
assert.equal(audit.humanScienceApproval,'PENDING');
assert.equal(audit.humanSloCognitiveApproval,'PENDING');
assert.equal(audit.studentSolvedNumericalEdition,'NOT-PUBLISHED');
for(const n of ['8.4','8.5','8.6'])assert.ok(notes.includes('**'+n+' —'),'Teacher explanation missing original '+n);
for(const term of ['200 J','300 J','198 s','199 s','397 K','400 K',
 'P-11-C-23','P-11-C-11','Do not','COMPULSORY'])
 assert.ok(notes.includes(term),'Review explanation missing '+term);

const gate=review.releaseGate;
assert.equal(gate.unit8ScoredQuestionCount,0);
assert.equal(gate.unit8TestBuilderBankEnabled,false);
assert.equal(gate.teacherAnswerEditionApproved,false);
assert.equal(gate.originalStemsCopied,false);
assert.equal(gate.sourcePageImagesCopied,false);
assert.equal(gate.ownerApproval,'HOLD');
const forbidden=['correctOption','answerKey','verbatimQuestionStem','fullModelAnswer',
 'printedQuestionText','sourcePageImage','approvedMarkingScheme','publishedGradedAnswer'];
const scan=v=>{if(Array.isArray(v))return v.forEach(scan);if(v&&typeof v==='object'){
 for(const k of forbidden)assert.equal(Object.hasOwn(v,k),false,'No source or teacher-certified key release: '+k);
 Object.values(v).forEach(scan);
}};scan(review);
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
console.log('V247 PASS: original numericals 8.4–8.6 source contradiction and two alternative interpretations, water-heating 198 vs199 constant/rounding, Carnot 397 vs400 room-temp conditional, unapproved Unit7/8 banks stay held, 2250 pinned original MCQs intact.');
