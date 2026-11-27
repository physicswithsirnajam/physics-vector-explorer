#!/usr/bin/env node
'use strict';
const fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const audit=load('quality/unit07/unit07-v220-original-mcq7-8-placement-and-new-application-candidates-no-keys.json');
const original=load('quality/unit07/unit07-v174-end-exercise-mcq01-10-fig-bound-no-keys.json');
const prior=load('quality/unit07/unit07-v219-three-original-ambiguities-four-draft-mcqs-no-keys.json');
const totals=load('quality/unit07/unit07-v178-consolidated-274-teacher-approval-index-no-keys.json');
const catalog=load('portal/learning-catalog.json');
const manifest=load('question-bank/manifest.json');
assert.equal(audit.version,'V220');
assert.equal(audit.status,'DRAFT-TEACHER-REVIEW-ONLY-NOT-APPROVED');
assert.equal(audit.sourceProvenance.originalTextbookMcqStemsCopied,false);
assert.equal(audit.sourceProvenance.originalTextbookAnswerChoicesCopied,false);
assert.equal(audit.sourceProvenance.originalPublisherKeyCopied,false);
assert.equal(audit.candidateCount,2);
assert.equal(audit.issues.length,3);
assert.equal(audit.candidates.length,2);
assert.equal(audit.originalTextbookQuestionCountModified,0);
assert.equal(audit.originalSloPlacementReviewNotes,3);
assert.equal(audit.correctOptionKeysStored,false);
assert.equal(audit.publicUnit7ScoredMcqsAdded,0);
assert.equal(audit.publicQuestionBankImportAllowed,false);
assert.equal(audit.teacherReviewNotAuthenticated,true);
assert.deepEqual(audit.issues.map(x=>x.originalTextbookMcq),[7,8,9]);
assert.deepEqual(audit.issues.map(x=>x.reviewFlag),
 ['compulsory-teacher-slo-placement','compulsory-teacher-slo-placement','optional-teacher-slo-placement']);
for(const issue of audit.issues){
 const item=original.sourceBoundItems.find(x=>x.sourceQuestionNumber===issue.originalTextbookMcq);
 assert.ok(item,'Missing original MCQ identity '+issue.originalTextbookMcq);
 assert.equal(item.independentAnswerReviewStatus,'SINGLE_PHYSICS_INTENDED_RESULT');
 assert.equal(item.changeNeeded,issue.reviewFlag);
 assert.equal(item.issueCategory,issue.issueCategory);
 assert.equal(item.teacherScienceSignoff,'PENDING');
 assert.equal(item.teacherCognitiveSignoff,'PENDING');
 assert.equal(item.studentScoredRelease,'HOLD');
 assert.equal(issue.originalStatus,item.independentAnswerReviewStatus);
 assert.equal(issue.originalRetainedUnchanged,true);
 assert.equal(issue.teacherDecision,'PENDING');
 assert.ok(issue.reviewFinding.length>=60);
 assert.ok(issue.proposedDisposition.length>=60);
}
assert.equal(audit.issues[2].newCandidateId,null,
 'Original MCQ9 optional categorization cannot become mandatory replacement');
assert.deepEqual(audit.candidates.map(x=>x.candidateId),
 ['U07-V220-B28-ELASTIC-ENERGY-A','U07-V220-B24-YOUNG-MODULUS-A']);
const [energy,young]=audit.candidates;
for(const c of audit.candidates){
 assert.equal(c.options.length,4);
 assert.equal(new Set(c.options).size,4);
 assert.ok(c.stem.length>=100);
 assert.ok(c.options.every(x=>typeof x==='string'&&x.trim().length>=3));
 assert.equal(c.originallyAuthored,true);
 assert.equal(c.sourceOriginalReplacement,false);
 assert.equal(c.frameworkCognitiveDemand,'Application');
 assert.equal(c.provisionalItemDemand,'Application');
 assert.equal(c.scienceApproval,'PENDING');
 assert.equal(c.cognitiveApproval,'PENDING');
 assert.equal(c.ownerRelease,'HOLD');
 for(const key of ['correctOption','correctAnswer','correctIndex','answerKey','studentUid']){
  assert.ok(!(key in c),'No answer key or student identity is stored');
 }
}
assert.equal(energy.independentFromOriginalMcq,7);
assert.equal(energy.officialSummativeSlo,'P-11-B-28');
assert.equal(young.independentFromOriginalMcq,8);
assert.equal(young.officialSummativeSlo,'P-11-B-24');
const expectedEnergy=0.5*80*2e-3;
assert.ok(Math.abs(expectedEnergy-0.080)<1e-12);
const energyOptions=energy.options.map(v=>{
 const m=/^([0-9]+(?:\.[0-9]+)?) J$/.exec(v);
 assert.ok(m,'Energy options must have SI J units');
 return Number(m[1]);
});
assert.equal(energyOptions.filter(v=>Math.abs(v-expectedEnergy)<1e-12).length,1);
assert.match(energy.stem,/from zero tension/);
assert.match(energy.stem,/straight line through the origin/);
assert.match(energy.stem,/elastic potential energy/);
const expectedYoung=80*1.5/(2e-6*0.40e-3);
assert.ok(Math.abs(expectedYoung-1.5e11)<1e-3);
const youngOptions=young.options.map(v=>{
 const m=/^([0-9]+(?:\.[0-9]+)?) × 10\^(\d+) Pa$/.exec(v);
 assert.ok(m,'Young modulus options must have clear SI units and exponents');
 return Number(m[1])*10**Number(m[2]);
});
assert.equal(youngOptions.filter(v=>Math.abs(v-expectedYoung)<1e-3).length,1);
assert.match(young.stem,/original length 1.5 m/);
assert.match(young.stem,/cross-sectional area 2.0 mm²/);
assert.match(young.stem,/0.40 mm/);
assert.match(young.stem,/within its proportional limit/);
assert.match(young.stem,/Young modulus/);
assert.equal(prior.version,'V219');
assert.equal(prior.candidateCount,4);
assert.equal(prior.notForDirectQuestionBankImport,true);
assert.equal(original.sourceBoundItems.length,10);
assert.equal(totals.totalOriginalItems,274);
assert.equal(totals.teacherScienceApprovals,0);
assert.equal(totals.teacherCognitiveApprovals,0);
assert.equal(totals.teacherScoredReleaseApprovals,0);
assert.equal(totals.scoredUnit7PortalQuestions,0);
assert.equal(catalog.resources.length,59);
const u7=catalog.grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
assert.equal(u7.questionBankCount,0);
assert.equal(u7.assessmentStatus,'not-published');
assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),
 [275,206,220,640,349,560]);
console.log('V220 PASS: original MCQ7/8 SLO placement and Q9 optional category preserved, two unscored B28/B24 application candidates verified, all approval holds intact.');
