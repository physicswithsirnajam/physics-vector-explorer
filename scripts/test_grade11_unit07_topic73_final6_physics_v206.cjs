#!/usr/bin/env node
'use strict';
/** V206 synthetic physics and scope verification, not a keyed MCQ answer engine. */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const close=(a,b)=>A.ok(Number.isFinite(a)&&Math.abs(a-b)<1e-12*Math.max(1,Math.abs(b)),a+' != '+b);
// The source p123 stored energy for a Hookean extension from zero.
const k=400,x=.03,force=k*x;
close(force,12);
close(k,force/x); // stiffness has unit newton per metre.
close(.5*k*x*x,.5*force*x);
close(.5*k*x*x,.18);
// An ideally recoverable elastic unloading returns the same energy as work.
// This assumption does not claim that real hysteretic loading is lossless.
const idealLoadEnergy=.5*k*x*x,idealUnloadWork=.5*k*x*x;
close(idealLoadEnergy-idealUnloadWork,0);
// Physical work requires integration of force with respect to extension.
// Nonlinear F(x)=c*x*x: integral is c*X^3/3, not triangular .5*Ffinal*X.
const c=12,X=.2,finalF=c*X*X;
const trueNonlinearWork=c*X**3/3;
const naiveHalfFx=.5*finalF*X;
A.notEqual(trueNonlinearWork,naiveHalfFx);
close(naiveHalfFx/trueNonlinearWork,1.5);
// On the publisher's reversed axes, the undercurve integral x*dF differs
// from the true work (general) although they coincide for linear origin-start.
const reversedArea=2*c*X**3/3;
close(reversedArea/trueNonlinearWork,2);
const linearReversed=linearWork=>linearWork;
close(linearReversed(idealLoadEnergy),idealLoadEnergy);
// Experimental repeats reduce fluctuations in the estimated mean;
// constant systematic offsets survive repeating and averaging.
const repeat=[.00101,.00099,.00100],avg=repeat.reduce((a,b)=>a+b,0)/repeat.length;
close(avg,.001);
const systematic=repeat.map(x=>x+.0001);
close(systematic.reduce((a,b)=>a+b,0)/systematic.length,.0011);
A.notEqual(avg,systematic.reduce((a,b)=>a+b,0)/systematic.length);
// Correct Topic ID is part of science/provenance integrity.
const d=load('quality/unit07/unit07-v206-topic73-final-six-source-coverage-no-keys.json');
A.deepEqual(d.finalPreviouslyUnreviewedSourceNumbers,[1,10,16,25,67,76]);
A.equal(d.topic73Coverage.sourceIdentitiesAccountedFor,80);
A.equal(d.topic73Coverage.sourceIdentitiesUnaccountedFor,0);
A.equal(d.sourceIdentityCorrection.v192ActuallyReviewed,'XI-U07-T071-Q025');
A.equal(d.sourceIdentityCorrection.v206GenuinelyNewTopic73,'XI-U07-T073-Q025');
A.deepEqual(d.promisingConditionalApplicationNumbers,[76]);
A.deepEqual(d.supportingKnowledgeRecallNumbers,[1,10,16]);
A.equal(d.specificScientificCautions.q67AveragingDoesNotRemoveSystematicMeasurementError,true);
A.equal(d.specificScientificCautions.q76YieldDoesNotNecessarilyMeanFracture,true);
A.equal(d.originalSourceAnswerLetterErrorsFoundInSix,0);
for(const q of d.items){
 A.equal(q.independentTeacherScienceDecision,'PENDING');
 A.equal(q.independentTeacherCognitiveDecision,'PENDING');
 A.equal(q.studentScoring,'HOLD');
}
A.equal(d.authenticatedTeacherScienceApprovals,0);
A.equal(d.ownerStudentScoringAuthorizations,0);
A.equal(d.scoredUnit7StudentQuestionCount,0);
const u=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
A.equal(u.status,'planned');A.equal(u.assessmentStatus,'not-published');
A.equal(u.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
console.log('V206 SCIENCE PASS: ideal elastic recovery vs nonlinear/plastic loading, measurement error and distinct source Q25; no scored Unit7 questions.');
