#!/usr/bin/env node
'use strict';
/* V221 — compare four new, independent numerical candidate prompts with
 * the unchanged five original NBF Unit 7 source-review identities.
 * This is NOT a publisher erratum, teacher science signoff, or scored release.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const candidate=load('quality/unit07/unit07-v221-numerical-source-issues-four-independent-candidates-no-keys.json');
const source=load('quality/unit07/unit07-v177-end-exercise-numerical01-05-image-bound-no-keys.json');
const review=load('quality/unit07/unit07-v195-unsigned-independent-teacher-review-no-keys.json');
const approval=load('quality/unit07/unit07-v178-consolidated-274-teacher-approval-index-no-keys.json');
const previous=load('quality/unit07/unit07-v220-original-mcq7-8-placement-and-new-application-candidates-no-keys.json');
const catalog=load('portal/learning-catalog.json');
const manifest=load('question-bank/manifest.json');
assert.equal(candidate.version,'V221');
assert.equal(candidate.status,'UNSIGNED_TEACHER_CANDIDATES_ONLY_NO_SCORE_RELEASE');
assert.equal(candidate.sourceBasis.publisherScansOrWordingCopied,false);
assert.equal(candidate.separateFromSource,true);
assert.equal(candidate.originalTextbookValuesModified,false);
assert.equal(candidate.originalFive.identityCount,5);
assert.equal(candidate.originalFive.compulsoryReviewCount,4);
assert.equal(candidate.originalFive.ordinaryReviewCount,1);
assert.equal(candidate.originalFive.allTeacherDecisionsPending,true);
assert.equal(candidate.originalFive.allStudentScoringOnHold,true);
assert.equal(candidate.newIndependentExercises.count,4);
assert.equal(candidate.newIndependentExercises.allOriginalAuthorCreated,true);
assert.equal(candidate.newIndependentExercises.allUnapproved,true);
assert.equal(candidate.newIndependentExercises.solutionsOrGradingKeysIncluded,false);
assert.equal(candidate.newIndependentExercises.studentTestBuilderImportAllowed,false);
assert.equal(candidate.originalFive.issues.length,5);
assert.equal(candidate.newIndependentExercises.candidates.length,4);
assert.deepEqual(candidate.originalFive.issues.map(x=>x.originalNumerical),[1,2,3,4,5]);
assert.deepEqual(candidate.originalFive.issues.map(x=>x.severity),
 ['COMPULSORY','ORDINARY','COMPULSORY','COMPULSORY','COMPULSORY']);
assert.deepEqual(candidate.newIndependentExercises.candidates.map(x=>x.relatedOriginalNumerical),
 [1,3,4,5]);
assert.deepEqual(source.items.map(x=>x.sourceQuestionNumber),[1,2,3,4,5]);
assert.equal(source.sourcePrintedPage,126);
assert.deepEqual(source.compulsoryTeacherReviewNumbers,[1,3,4,5]);
assert.deepEqual(source.firstPassNoAmendmentNumbers,[2]);
assert.deepEqual(source.printedHintsInconsistentWithGivenDataNumbers,[3,4,5]);
assert.deepEqual(source.printedHintsFullyConsistentNumbers,[2]);
assert.deepEqual(source.printedHintConditionallyReproducibleNumbers,[1]);
assert.equal(source.teacherIndividualScienceSignoffs,0);
assert.equal(source.teacherIndividualCognitiveSignoffs,0);
assert.equal(source.unit7ScoredPortalQuestionCount,0);
assert.equal(review.numericalReview.length,5);
for(const issue of candidate.originalFive.issues){
 const orig=source.items.find(x=>x.sourceQuestionNumber===issue.originalNumerical);
 const decision=review.numericalReview.find(x=>x.n===issue.originalNumerical);
 assert.ok(orig&&decision,'Exact original numerical identity must exist');
 assert.equal(issue.issueCode,orig.issueCategory||'none');
 assert.equal(issue.originalHintStatus,orig.originalPrintedAnswerHintStatus);
 assert.equal(issue.teacherDecision,'PENDING');
 assert.equal(orig.teacherScienceSignoff,'PENDING');
 assert.equal(orig.teacherCognitiveSignoff,'PENDING');
 assert.equal(orig.studentScoredRelease,'HOLD');
 assert.equal(decision.teacherDecision,'PENDING');
 assert.equal(decision.scoredStatus,'HOLD');
 assert.equal(issue.originalPreserved,true);
 assert.equal(issue.severity,orig.teacherReviewPriority==='compulsory'?'COMPULSORY':'ORDINARY');
 assert.equal(issue.alternativeId,issue.originalNumerical===2?null:
  candidate.newIndependentExercises.candidates.find(c=>c.relatedOriginalNumerical===issue.originalNumerical)?.candidateId);
 assert.ok(issue.independentAction.length>=60);
}
assert.equal(review.graphReview.originalHorizontalAxis,'FORCE');
assert.equal(review.graphReview.originalVerticalAxis,'EXTENSION');
assert.equal(review.graphReview.teacherDecision,'PENDING');
assert.equal(review.graphReview.scoredStatus,'HOLD');
const prompts=candidate.newIndependentExercises.candidates;
const ids=new Set(prompts.map(c=>c.candidateId));
assert.equal(ids.size,4);
for(const p of prompts){
 assert.ok(p.stem.length>=125);
 assert.equal(p.originalPublisherQuestionCopied,false);
 assert.equal(p.scienceApproval,'PENDING');
 assert.equal(p.cognitiveApproval,'PENDING');
 assert.equal(p.studentRelease,'HOLD');
 assert.equal(p.provisionalCognitive,'Application');
 assert.ok(p.teacherQC.length>=45);
 assert.ok(p.sourceCare.length>=55);
 assert.ok(p.officialOutcome==='P-11-B-24'||p.officialOutcome==='P-11-B-28');
 for(const forbidden of ['correctAnswer','correctOption','correctIndex','answerKey','modelSolution','reviewerUid','teacherUid']){
  assert.ok(!(forbidden in p),'No private key, solution or identity in public candidate metadata');
 }
}
const [shear,twoWires,energy,stress]=prompts;
assert.equal(shear.outcomeScope,'SUPPLEMENTARY_ONLY_NOT_DIRECT_YOUNG_MODULUS_APPLICATION');
assert.match(shear.stem,/simple shear without bending/);
assert.match(shear.stem,/shear modulus is G/);
assert.ok(!Object.hasOwn(shear.givens,'young_Pa'));
const g1=shear.givens;
const lateralDisplacement_m=g1.shearForce_N*g1.thickness_m/(g1.shearArea_m2*g1.shearModulus_Pa);
assert.ok(Math.abs(lateralDisplacement_m-5e-7)<1e-18,'Shear-only candidate SI calculation');
assert.ok(Math.abs(lateralDisplacement_m*1e6-0.5)<1e-12,'Micrometres conversion');
const v=twoWires.givens;
const steelForce_N=(v.junctionMass_kg+v.lowerMass_kg)*v.g_m_s2;
const brassForce_N=v.lowerMass_kg*v.g_m_s2;
assert.equal(steelForce_N,50);
assert.equal(brassForce_N,20);
const steelExtension_m=steelForce_N*v.upperLength_m/(v.area_m2*v.steelYoung_Pa);
const brassExtension_m=brassForce_N*v.lowerLength_m/(v.area_m2*v.brassYoung_Pa);
const totalExtension_m=steelExtension_m+brassExtension_m;
const totalEnergy_J=0.5*steelForce_N*steelExtension_m+0.5*brassForce_N*brassExtension_m;
assert.ok(Math.abs(totalExtension_m-4.5e-4)<1e-15,'Distinct tensions / serial extension');
assert.ok(Math.abs(totalEnergy_J-8.25e-3)<1e-15,'Distinct wire energies (not one average tension)');
assert.equal(twoWires.officialOutcome,'P-11-B-28');
assert.match(twoWires.stem,/3.0 kg mass hangs at the junction/);
assert.match(twoWires.stem,/2.0 kg mass hangs at the bottom/);
assert.match(twoWires.stem,/neglecting wire masses/);
const en=energy.givens;
const sourceIndependentEnergy_J=en.area_m2*en.length_m*en.stress_Pa**2/(2*en.young_Pa);
const strain=en.stress_Pa/en.young_Pa;
const elongation_m=strain*en.length_m;
const force_N=en.stress_Pa*en.area_m2;
const halfForceEnergy_J=0.5*force_N*elongation_m;
assert.ok(Math.abs(sourceIndependentEnergy_J-5)<1e-12);
assert.ok(Math.abs(halfForceEnergy_J-5)<1e-12);
assert.ok(Math.abs(sourceIndependentEnergy_J-halfForceEnergy_J)<1e-12);
assert.equal(energy.officialOutcome,'P-11-B-28');
assert.match(energy.stem,/within the proportional elastic limit/);
const st=stress.givens;
const circularArea_m2=Math.PI*st.diameter_m**2/4;
const engineeringStress_Pa=st.force_N/circularArea_m2;
assert.ok(Math.abs(engineeringStress_Pa-1.9098593171e6)<0.001);
assert.ok(Math.abs(engineeringStress_Pa/1e6-1.9098593171)<1e-8);
assert.equal(stress.officialOutcome,'P-11-B-24');
assert.match(stress.stem,/engineering tensile stress/);
assert.match(stress.stem,/diameter 2.0 cm/);
assert.ok(!stress.stem.includes('50 cm'));
assert.equal(previous.version,'V220');
assert.equal(previous.candidateCount,2);
assert.equal(previous.publicUnit7ScoredMcqsAdded,0);
assert.equal(approval.totalOriginalItems,274);
assert.equal(approval.teacherScienceApprovals,0);
assert.equal(approval.teacherCognitiveApprovals,0);
assert.equal(approval.teacherScoredReleaseApprovals,0);
assert.equal(approval.scoredUnit7PortalQuestions,0);
assert.equal(review.realAuthenticatedTeacherScienceApprovals,0);
assert.equal(review.realAuthenticatedTeacherCognitiveApprovals,0);
assert.equal(review.ownerStudentScoringApprovals,0);
assert.equal(review.unit7StudentScoredQuestions,0);
assert.equal(candidate.decisionBoundary.independentTeacherScienceApprovals,0);
assert.equal(candidate.decisionBoundary.independentTeacherCognitiveApprovals,0);
assert.equal(candidate.decisionBoundary.ownerReleasePermissions,0);
assert.equal(candidate.decisionBoundary.scoredUnit7Questions,0);
assert.equal(candidate.decisionBoundary.teacherBackendDeployment,'NO_GO');
assert.equal(catalog.resources.length,59);
const unit7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
assert.equal(unit7.questionBankCount,0);
assert.equal(unit7.assessmentStatus,'not-published');
assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
 [275,206,220,640,349,560]);
console.log('V221 PASS: source 7.1-7.5 original numerical IDs/hints unchanged; 4 independent, original-author-created alternatives have SI math verified and teacher/student scoring hold.');
