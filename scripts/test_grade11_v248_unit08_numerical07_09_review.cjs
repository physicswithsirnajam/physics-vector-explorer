#!/usr/bin/env node
'use strict';
/* V248 NBF Grade XI Unit8 original numericals 8.7–8.9 source and calculation audit.
 * No publisher stems, approved solutions, figures or assessed bank released.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const q=json('quality/unit08/unit08-v248-numerical07-09-source-qc-no-approved-answers.json');
const notes=read('quality/unit08/unit08-v248-numerical07-09-teacher-triage.md');
const v247=json('quality/unit08/unit08-v247-numerical04-06-source-qc-no-approved-answers.json');
const v246=json('quality/unit08/unit08-v246-numerical01-03-source-qc-no-approved-answers.json');
const v235=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const v224=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const cat=json('portal/learning-catalog.json');
const bank=json('question-bank/manifest.json');
const near=(actual,expected,tol=1e-10,label='number')=>
 assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=tol,
 label+': expected '+expected+', computed '+actual);

assert.equal(q.schema,'psn-nbf-grade11-unit08-numerical-source-qc-v248');
assert.equal(q.version,'V248');
assert.equal(q.originalSource.sourceSha256,v224.originalTextbook.sha256);
assert.equal(q.originalSource.sourceSha256,v235.source.sha256);
assert.equal(q.originalSource.sourceSha256,v247.originalSource.sourceSha256);
assert.deepEqual(q.originalSource.problemPrintedPages,[153]);
assert.deepEqual(q.originalSource.problemIds,['8.7','8.8','8.9']);
assert.deepEqual(q.originalSource.chapterReferencePages,[138,139,140,143,144,145,147,148,149]);

const original=v235.sourceSections.find(s=>s.kind==='numerical');
assert.ok(original,'Original numerical section must exist');
assert.equal(original.visuallyObservedCount,9);
assert.equal(original.expectedPublishedCount,9);
assert.deepEqual(original.items.map(s=>s.sourceNumber),
 ['8.1','8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9']);
assert.deepEqual([...v246.items,...v247.items,...q.items].map(s=>s.sourceNumber),
 original.items.map(s=>s.sourceNumber),
 '9/9 original source numericals must be reviewed exactly once, in printed order');
assert.deepEqual(v246.originalSource.problemIds,['8.1','8.2','8.3']);
assert.deepEqual(v247.originalSource.problemIds,['8.4','8.5','8.6']);
assert.deepEqual(q.items.map(s=>s.sourceNumber),['8.7','8.8','8.9']);
assert.deepEqual(q.items.map(s=>s.printedPages),[[153],[153],[153]]);
assert.deepEqual(q.items.map(s=>s.printedAnswer),
 ['Q/3','-64 J K^-1','1.013 × 10^5 J']);
assert.equal(v235.observedTotal,50);
const counts=['mcq','short','comprehensive','numerical'].map(kind=>
 v235.sourceSections.find(s=>s.kind===kind).items.length);
assert.deepEqual(counts,[18,13,10,9]);
assert.equal(counts.reduce((a,b)=>a+b,0),50);
assert.equal(v235.discrepancy.id,'SOURCE-COMP-8.8');

const printed=v224.officialFramework.slos;
for(const item of q.items){
 const originalItem=original.items.find(s=>s.sourceNumber===item.sourceNumber);
 assert.ok(originalItem,'Original source identifier missing '+item.sourceNumber);
 assert.equal(item.focus,originalItem.focus);
 assert.deepEqual(item.printedPages,originalItem.printedPages);
 assert.equal(item.keepOriginal,true);
 assert.equal(item.studentRelease,'HOLD');
 assert.equal(item.approvedSolutionPublished,false);
 assert.equal(item.teacherScienceApproval,'PENDING');
 assert.equal(item.teacherSloApproval,'PENDING');
 assert.ok(item.reviewReason.length>230,'Explain exact source-specific scientific issue');
 assert.equal(typeof item.independentCheck,'object');
 if(item.candidateSummativeSlo===null){
  assert.equal(item.sourceNumber,'8.8','Only entropy numerical may lack a direct printed outcome');
  assert.equal(item.candidateFrameworkCognitive,null);
  const context=printed.find(x=>x.printedCode===item.contextCandidateSlo);
  assert.ok(context&&context.assessment==='Summative');
  assert.equal(item.contextFrameworkCognitive,context.cognitive);
  assert.match(item.sloFit,/does not directly authenticate/i);
 }else{
  const o=printed.find(x=>x.printedCode===item.candidateSummativeSlo);
  assert.ok(o&&o.assessment==='Summative','Original printed summative SLO required');
  assert.equal(item.candidateFrameworkCognitive,o.cognitive);
 }
 if(item.secondaryCandidateSlo){
  const o=printed.find(x=>x.printedCode===item.secondaryCandidateSlo);
  assert.ok(o&&o.assessment==='Summative');
  assert.equal(item.secondaryFrameworkCognitive,o.cognitive);
 }
}
assert.deepEqual(q.items.map(x=>x.candidateSummativeSlo),
 ['P-11-C-23',null,'P-11-C-06']);
assert.deepEqual(q.items.map(x=>x.observedCognitive),
 ['Application','Application','Application']);
assert.equal(q.items[0].secondaryCandidateSlo,'P-11-C-16');
assert.equal(q.items[1].contextCandidateSlo,'P-11-C-22');
assert.equal(q.items[2].secondaryCandidateSlo,'P-11-C-07');

const c7=q.items[0].independentCheck;
assert.equal(c7.type,'reversible-carnot-ratio');
assert.equal(c7.hotTemperatureRatio,1);
assert.equal(c7.coldTemperatureRatio,1/3);
near(c7.coldTemperatureRatio/c7.hotTemperatureRatio,1/3,1e-12,'Carnot rejection ratio');
assert.equal(c7.rejectedHeatSymbolic,'Q/3');
assert.equal(c7.inputHeatPositive,true);
assert.equal(c7.outputHeatRejectionPositiveMagnitude,true);
assert.match(c7.sourceAnswerStatus,/matches reversible Carnot ratio/);

const c8=q.items[1].independentCheck;
assert.equal(c8.type,'source-specific-freezing-entropy');
const d8=c8.unitsSI;
assert.equal(q.items[1].printedGiven.energyToMeltJoules,500);
assert.equal(q.items[1].printedGiven.referenceIceMassGrams,2);
assert.equal(q.items[1].printedGiven.waterToFreezeGrams,70);
assert.equal(q.items[1].printedGiven.initialAndFinalCelsius,0);
near(500/0.002,d8.sourceHeatOfFusionJPerKg,1e-8,'original source specific latent heat');
near(d8.referenceMassKg,0.002,1e-15,'reference ice mass in kg');
near(d8.freezingMassKg,0.07,1e-15,'freezing mass in kg');
near(-(500/2)*70,c8.heatReleasedByWaterJoules,1e-11,'negative heat out of freezing water');
near(c8.heatReleasedByWaterJoules/d8.temperatureKelvin,
 c8.waterEntropyChangeJPerKelvin,1e-11,'freezing water entropy change');
assert.ok(c8.waterEntropyChangeJPerKelvin<0);
assert.equal(Math.round(c8.waterEntropyChangeJPerKelvin),-64);
assert.equal(c8.roundedTextbookValue,'-64 J K^-1');
assert.match(c8.usualIceLatentHeatCaveat,/differs from usual tabulated/);
assert.match(c8.scopeOfEntropy,/not to the refrigerator plus surroundings/);

const c9=q.items[2].independentCheck;
assert.equal(c9.type,'isobaric-pv-work');
assert.deepEqual(q.items[2].subparts,['a','b']);
assert.deepEqual(original.items.find(s=>s.sourceNumber==='8.9').subparts,['a','b']);
const d9=c9.quantitiesSI;
assert.equal(d9.standardAtmospherePascalsRounded,101300);
assert.equal(d9.initialVolumeCubicMetres,1);
assert.equal(d9.finalVolumeCubicMetres,2);
near(d9.finalVolumeCubicMetres-d9.initialVolumeCubicMetres,d9.deltaVolumeCubicMetres,1e-12,'volume expansion');
near(d9.standardAtmospherePascalsRounded*d9.deltaVolumeCubicMetres,
 c9.calculatedWorkByGasJoules,1e-12,'isobaric work');
near(c9.usingExactStandardAtmospherePascals*d9.deltaVolumeCubicMetres,
 c9.usingExactAtmWorkJoules,1e-12,'exact standard atmosphere alternate');
assert.equal(c9.calculatedWorkByGasJoules,101300);
assert.equal(c9.roundedTextbookValue,'1.013 × 10^5 J');
assert.match(c9.signConvention,/positive/);
const diagram=c9.diagramSpec;
assert.equal(diagram.graphicalCompletenessRequired,true);
assert.match(diagram.status,/teacher-review specification only/);
assert.equal(diagram.horizontalAxis,'V (m³)');
assert.equal(diagram.verticalAxis,'P (Pa)');
assert.equal(diagram.constantPressureLinePa,d9.standardAtmospherePascalsRounded);
assert.equal(diagram.startVolumeM3,1);
assert.equal(diagram.endVolumeM3,2);
assert.equal(diagram.processArrowDirection,'rightward');
assert.match(diagram.areaRepresentation,/rectangle below horizontal isobar/);
assert.equal(diagram.labels.length,4);
assert.ok(v235.reviewFlags.some(x=>x.flagId==='NUM-8.8'));
assert.ok(v235.reviewFlags.some(x=>x.flagId==='NUM-8.9'));

const a=q.audit;
assert.equal(a.sourceQuestionCount,3);
assert.equal(a.sourceVisibleNumericalCount,9);
assert.equal(a.coverageAcrossV246V248,'9/9 visibly numbered original Unit8 numericals preliminarily reviewed');
assert.equal(a.sourceExerciseTotal,'50 visually indexed original exercise items = 18 MCQs + 13 short + 10 visible comprehensives + 9 numericals');
assert.deepEqual(a.originalPrintedAnswers,['Q/3','-64 J K^-1','1.013 × 10^5 J']);
assert.deepEqual(a.printedAnswerConsistencyUnderExplicitModels,['8.7','8.8','8.9']);
assert.deepEqual(a.compulsorySloOrCognitiveReview,['8.7','8.8']);
assert.deepEqual(a.sourceSpecificLatentEnergyAndSubsystemSign,['8.8']);
assert.deepEqual(a.twoPartDiagramCompleteness,['8.9']);
assert.deepEqual(a.alreadyFlaggedInV235,['NUM-8.8','NUM-8.9']);
assert.deepEqual(a.newScientificallyProvenPublisherAnswerDefects,[]);
assert.equal(a.sourceStemsAndPrintedAnswersUnchanged,true);
assert.equal(a.teacherIndependentScienceApproval,'PENDING');
assert.equal(a.teacherCognitiveSloApproval,'PENDING');
assert.equal(a.teacherSolvedNumericalEdition,'NOT-PUBLISHED');

for(const n of ['8.7','8.8','8.9'])
 assert.ok(notes.includes('**'+n+' —'),'Teacher triage must name original '+n);
for(const token of ['Q/3','−64 J K⁻¹','1.013 × 10⁵ J','70 g','500 J',
 'P–V diagram','P-11-C-06','P-11-C-23','P-11-C-22','9/9','2,250'])
 assert.ok(notes.includes(token),'Teacher review missing '+token);
assert.match(notes,/18\/18/);
assert.match(notes,/13\/13/);
assert.match(notes,/10\/10/);

const gate=q.releaseGate;
assert.equal(gate.unit8ScoredQuestionCount,0);
assert.equal(gate.unit8TestBuilderBankEnabled,false);
assert.equal(gate.teacherAnswerEditionApproved,false);
assert.equal(gate.originalStemsCopied,false);
assert.equal(gate.sourcePageImagesCopied,false);
assert.equal(gate.originalFigureFilesCopied,false);
assert.equal(gate.ownerApproval,'HOLD');
const forbidden=['answerKey','correctAnswer','correctOption','verbatimQuestionStem','fullModelAnswer',
 'printedQuestionText','sourcePageImage','publisherFigureFile','approvedMarkingScheme','publishedGradedAnswer'];
const visit=v=>{if(Array.isArray(v))return v.forEach(visit);if(v&&typeof v==='object'){
 for(const field of forbidden)assert.equal(Object.hasOwn(v,field),false,'Do not publish publisher content or certified answers: '+field);
 Object.values(v).forEach(visit);
}};visit(q);

const units=cat.grades.find(g=>g.grade===11).units;
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
assert.equal(cat.resources.length,59);
const pinned=banks.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount);
assert.deepEqual(pinned,[275,206,220,640,349,560]);
assert.equal(pinned.reduce((a,b)=>a+b,0),2250);
assert.equal(v224.releaseGate.studentScoredUnit8Mcqs,0);
console.log('V248 PASS: all 9/9 NBF original Unit8 numerical QC records; Carnot Q/3, negative source-data water freezing entropy, isobaric 1.013e5 J plus required PV diagram spec; 50/50 original exercise inventory preliminarily reviewed; student release unchanged.');
