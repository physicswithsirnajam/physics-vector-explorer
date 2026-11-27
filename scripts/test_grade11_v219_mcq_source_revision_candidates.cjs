#!/usr/bin/env node
'use strict';
// V219: QC of UNPUBLISHED teacher-review-only author-created candidates.
// Original NBF questions, private answer keys, student banks, Firebase unchanged.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const source=load('quality/unit07/unit07-v174-end-exercise-mcq01-10-fig-bound-no-keys.json');
const draft=load('quality/unit07/unit07-v219-three-original-ambiguities-four-draft-mcqs-no-keys.json');
const summary=load('quality/unit07/unit07-v178-consolidated-274-teacher-approval-index-no-keys.json');
const catalog=load('portal/learning-catalog.json');
const manifest=load('question-bank/manifest.json');
assert.equal(draft.version,'V219');
assert.equal(draft.academicStatus,'DRAFT-TEACHER-CANDIDATES-NOT-APPROVED-NOT-LIVE');
assert.equal(draft.notForDirectQuestionBankImport,true);
assert.equal(draft.sourceOriginalStemsOrOptionsCopied,false);
assert.equal(draft.correctOptionKeysExcluded,true);
assert.equal(draft.candidateCount,4);
assert.equal(draft.candidates.length,4);
assert.deepEqual(draft.sourceBasis.originalQuestionNumbersFlagged,[3,5,10]);
assert.equal(draft.sourceBasis.originalPublisherAnswerKeyProvided,false);
assert.equal(draft.approval.science,'PENDING');
assert.equal(draft.approval.cognitive,'PENDING');
assert.equal(draft.approval.itemUniqueness,'PENDING-INDEPENDENT');
assert.equal(draft.approval.ownerScoredRelease,'HOLD');
assert.equal(draft.approval.publicGradedItemsAdded,0);
const flagged=source.sourceBoundItems.filter(x=>[3,5,10].includes(x.sourceQuestionNumber));
assert.equal(flagged.length,3);
for(const x of flagged){
 assert.equal(x.independentAnswerReviewStatus,'AMBIGUOUS_WITHOUT_EXTRA_CONDITION');
 assert.equal(x.changeNeeded,'compulsory-before-scored-use');
 assert.equal(x.teacherScienceSignoff,'PENDING');
 assert.equal(x.teacherCognitiveSignoff,'PENDING');
 assert.equal(x.studentScoredRelease,'HOLD');
}
assert.deepEqual(draft.candidates.map(x=>x.candidateId),
 ['U07-REVIEW-MCQ03-BONDING-A','U07-REVIEW-MCQ05-NOMINAL-STRESS-A',
  'U07-REVIEW-MCQ10-GRADIENT-A','U07-REVIEW-B27-AREA-WORK-A']);
for(const [i,c] of draft.candidates.entries()){
 assert.equal(c.options.length,4);
 assert.equal(new Set(c.options).size,4);
 assert.ok(c.stem.length>=65);
 assert.ok(c.options.every(x=>x.length>=5));
 assert.equal(c.studentScoredRelease,'HOLD');
 assert.equal(c.teacherScience,'PENDING');
 assert.equal(c.teacherCognitive,'PENDING');
 assert.equal(c.verifiedSourceItem,false);
 assert.ok(['P-11-B-22','P-11-B-24','P-11-B-27'].includes(c.intendedFrameworkSlo));
 assert.equal(c.reviewOfOriginalMCQ,[3,5,10,null][i]);
 assert.ok(!('correctOption' in c)&&!('correctAnswer' in c)&&!('answerKey' in c)&&!('answerIndex' in c),
   'No public teacher candidate answer key is allowed');
}
assert.equal(draft.candidates[0].intendedFrameworkSlo,flagged[0].nearestFBISETheorySlo);
assert.equal(draft.candidates[1].intendedFrameworkSlo,flagged[1].nearestFBISETheorySlo);
assert.equal(draft.candidates[2].intendedFrameworkSlo,flagged[2].nearestFBISETheorySlo);
// Independent numerical physics checks. These are formula sanity checks,
// not scored keys or authenticated teacher approvals.
const paFromSource=30/(2e-6);
const stressChoices=draft.candidates[1].options.map(s=>{
 const m=/^([0-9]+(?:\.[0-9]+)?) MPa$/.exec(s);
 assert.ok(m,'Candidate stress option must specify MPa units');
 return Number(m[1])*1e6;
});
assert.equal(paFromSource,15e6);
assert.equal(stressChoices.filter(v=>Math.abs(v-paFromSource)<1e-6).length,1,
 'Unique nominal engineering stress must appear among 4 nonduplicate options');
assert.match(draft.candidates[1].stem,/initial cross-sectional area/);
assert.match(draft.candidates[1].stem,/engineering stress/);
assert.ok(!draft.candidates[1].stem.includes('doubles'));
const areaWork=0.5*200*(0.10**2);
const energyChoices=draft.candidates[3].options.map(s=>{
 const m=/^([0-9]+(?:\.[0-9]+)?) J$/.exec(s);
 assert.ok(m,'Area-work option must specify J units');
 return Number(m[1]);
});
assert.ok(Math.abs(areaWork-1)<1e-12);
assert.equal(energyChoices.filter(v=>Math.abs(v-areaWork)<1e-12).length,1,
 'Correct triangular-area work must be a unique option');
assert.match(draft.candidates[3].stem,/area under the force–extension graph/);
assert.equal(draft.candidates[3].provisionalCognitive,'Application');
assert.match(draft.candidates[2].stem,/proportional elastic range/);
assert.match(draft.candidates[2].stem,/force F on the vertical axis and extension x on the horizontal axis/);
assert.match(draft.candidates[2].sourceExerciseClassification,/NOT-direct-B27/);
assert.match(draft.candidates[0].stem,/classified by their dominant bonding arrangement/);
assert.match(draft.candidates[0].sourceExerciseClassification,/supporting/);
assert.ok(draft.candidates[3].sourceExerciseClassification.includes('ADDITIONAL'));
// No original p125 wording copied wholesale.
const sourceOriginalStems=['Silicon is found in nature in the forms of',
 'On suspending a weight', 'Gradient of the force-extension graph has'];
assert.ok(draft.candidates.every(c=>sourceOriginalStems.every(x=>!c.stem.includes(x))));
assert.equal(summary.totalOriginalItems,274);
assert.equal(summary.teacherScienceApprovals,0);
assert.equal(summary.teacherCognitiveApprovals,0);
assert.equal(summary.scoredUnit7PortalQuestions,0);
assert.equal(catalog.resources.length,59);
const unit7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
assert.equal(unit7.questionBankCount,0);
assert.equal(unit7.assessmentStatus,'not-published');
assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
 [275,206,220,640,349,560]);
console.log('V219 PASS: 3 flagged originals remain immutable; 4 separate unkeyed author-created candidates pass source, scope, numerical-uniqueness and zero-scored-release invariants.');
