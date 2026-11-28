#!/usr/bin/env node
'use strict';
/* V241: source-anchored Grade XI NBF Unit8 short questions 8.5–8.8.
 * Review metadata only; no approved student solution or assessment bank.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const rev=json('quality/unit08/unit08-v241-short05-08-review-no-answers.json');
const notes=read('quality/unit08/unit08-v241-short05-08-academic-triage.md');
const v240=json('quality/unit08/unit08-v240-short01-04-review-no-answers.json');
const v235=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const v224=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const cat=json('portal/learning-catalog.json'),bank=json('question-bank/manifest.json');
assert.equal(rev.schema,'psn-nbf-grade11-unit08-short-response-qc-v241');
assert.equal(rev.version,'V241');
assert.equal(rev.originalSource.sourceSha256,v224.originalTextbook.sha256);
assert.equal(rev.originalSource.sourceSha256,v235.source.sha256);
assert.deepEqual(rev.originalSource.printedPages,[152]);
assert.deepEqual(rev.originalSource.questionIds,['8.5','8.6','8.7','8.8']);
assert.deepEqual(v240.originalSource.questionIds,['8.1','8.2','8.3','8.4']);
const source=v235.sourceSections.find(g=>g.kind==='short');
assert.equal(source.visuallyObservedCount,13);
assert.equal(v235.observedTotal,50);
assert.equal(rev.items.length,4);
assert.deepEqual(rev.items.map(x=>x.sourceNumber),['8.5','8.6','8.7','8.8']);
assert.deepEqual(rev.items.map(x=>x.printedPages),[[152],[152],[152],[152]]);
const outcomes=v224.officialFramework.slos;
for(const item of rev.items){
 const original=source.items.find(x=>x.sourceNumber===item.sourceNumber);
 assert.ok(original,'Original source question missing: '+item.sourceNumber);
 assert.equal(item.focus,original.focus,'Preserve V235 source focus label');
 assert.deepEqual(item.printedPages,original.printedPages);
 assert.equal(item.keepOriginal,true);
 assert.equal(item.compulsoryExplanationBeforeAssessedUse,true);
 assert.equal(item.studentRelease,'HOLD');
 assert.equal(item.answersPublished,false);
 assert.equal(item.approvedTeacherMarkingScheme,false);
 assert.equal(item.teacherScienceApproval,'PENDING');
 assert.equal(item.teacherSloApproval,'PENDING');
 assert.ok(item.reason.length>=170,'Document nuanced original-source physics reasoning');
 assert.ok(item.scienceReview.length>=130,'Independent physics justification required');
 if(item.candidateSummativeSlo===null){
  assert.equal(item.sourceNumber,'8.8');
  assert.equal(item.candidateFrameworkCognitive,null);
  assert.equal(item.compulsoryMappingReview,true);
  assert.match(item.sloFit,/no direct|no.*direct/i);
 }else{
  const slo=outcomes.find(s=>s.printedCode===item.candidateSummativeSlo);
  assert.ok(slo,'Candidate SLO must appear in V224 official inventory');
  assert.equal(slo.assessment,'Summative');
  assert.equal(slo.cognitive,item.candidateFrameworkCognitive);
  if(item.additionalCandidateSlo){
   const second=outcomes.find(s=>s.printedCode===item.additionalCandidateSlo);
   assert.ok(second&&second.assessment==='Summative');
  }
 }
}
assert.deepEqual(rev.items.map(x=>x.candidateSummativeSlo),
 ['P-11-C-09','P-11-C-08','P-11-C-10',null]);
assert.equal(rev.items.find(x=>x.sourceNumber==='8.7').additionalCandidateSlo,'P-11-C-08');
assert.deepEqual(rev.items.map(x=>x.observedCognitive),
 ['Application','Understanding','Understanding','Understanding']);
assert.deepEqual(rev.items.filter(x=>x.compulsoryMappingReview).map(x=>x.sourceNumber),
 ['8.5','8.7','8.8']);
assert.match(rev.items.find(x=>x.sourceNumber==='8.5').scienceReview,/kelvin temperature/);
assert.match(rev.items.find(x=>x.sourceNumber==='8.5').reason,/Celsius/);
assert.match(rev.items.find(x=>x.sourceNumber==='8.6').scienceReview,/ΔU=Q−W_by/);
assert.match(rev.items.find(x=>x.sourceNumber==='8.7').scienceReview,/γ=Cp\/Cv>1/);
assert.match(rev.items.find(x=>x.sourceNumber==='8.7').scienceReview,/same positive P,V/);
assert.match(rev.items.find(x=>x.sourceNumber==='8.8').scienceReview,/speed/);
const audit=rev.audit;
assert.equal(audit.sourceQuestionCount,4);
assert.equal(audit.sourceTotalShortResponseQuestions,13);
assert.deepEqual(audit.requiresCompulsoryExplanationQualification,['8.5','8.6','8.7','8.8']);
assert.deepEqual(audit.requiresCognitiveOrDirectSloReview,['8.5','8.7','8.8']);
assert.deepEqual(audit.existingV235FlagExpanded,['8.8']);
assert.deepEqual(audit.newSourceTextDefectsEstablished,[]);
assert.ok(v235.reviewFlags.some(f=>f.flagId==='SHORT-8.8'));
assert.equal(audit.noSourceStemRewrites,true);
assert.equal(audit.printedSourceNumberingPreserved,true);
assert.equal(audit.humanScienceReview,'PENDING');
assert.equal(audit.humanSloCognitiveReview,'PENDING');
assert.equal(audit.studentAnswerEdition,'NOT-PUBLISHED');
for(const n of ['8.5','8.6','8.7','8.8'])
 assert.ok(notes.includes('**'+n+' —'),'Teacher triage row missing '+n);
assert.match(notes,/COMPULSORY/);
assert.match(notes,/P-11-C-09/);
assert.match(notes,/No authenticated direct printed SLO/);
assert.match(notes,/2,250/);
const gate=rev.releaseGate;
assert.equal(gate.unit8ScoredQuestionCount,0);
assert.equal(gate.unit8TestBuilderBankEnabled,false);
assert.equal(gate.teacherAnswerEditionApproved,false);
assert.equal(gate.originalStemsCopied,false);
assert.equal(gate.sourcePageImagesCopied,false);
assert.equal(gate.ownerApproval,'HOLD');
const forbidden=['answerKey','correctAnswer','correctOption','verbatimQuestionStem',
 'fullModelAnswer','printedQuestionText','sourcePageImage','approvedMarkingScheme'];
const inspect=v=>{if(Array.isArray(v))return v.forEach(inspect);
 if(v&&typeof v==='object'){
  for(const key of forbidden)assert.ok(!Object.hasOwn(v,key),'Answer-only or original publisher field forbidden: '+key);
  Object.values(v).forEach(inspect);
 }
};inspect(rev);
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
const mcqs=bank.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount);
assert.deepEqual(mcqs,[275,206,220,640,349,560]);
assert.equal(mcqs.reduce((a,b)=>a+b,0),2250);
assert.equal(v224.releaseGate.studentScoredUnit8Mcqs,0);
console.log('V241 PASS: original short Q8.5–8.8 pages, Kelvin/First Law/slope/rate cautions, candidate FBISE SLOs, no answers or Unit7–8 scored release, 2250 pinned MCQs untouched.');
