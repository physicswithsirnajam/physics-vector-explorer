#!/usr/bin/env node
'use strict';
/*
 * Synthetic review actors, fake candidate digests and fake evidence ONLY.
 * No real user's private Q22/Q25 content or actual V189 private digests.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {POLICY,createSyntheticDecisionHarness,verifyLocalHashChain}
 =require('./unit07_revision_bound_review_v190.cjs');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const q22='XI-U07-T071-Q022',q25='XI-U07-T071-Q025';
const fakeA='a'.repeat(64),fakeB='b'.repeat(64),fakeC='c'.repeat(64),ev1='1'.repeat(64),ev2='2'.repeat(64);
const actors={
 mock_science_1:{role:'science',active:true},
 mock_cog_1:{role:'cognitive',active:true},
 mock_owner_1:{role:'owner',active:true},
 mock_inactive_1:{role:'science',active:false}
};
A.equal(POLICY[q22].directSummative,false);
A.equal(POLICY[q25].directSummativeCandidate,true);
const newHarness=(sourceId,revisionSha256=fakeA,actorList=actors)=>createSyntheticDecisionHarness({
 sourceId,sourceSha256:POLICY[sourceId].sourceSha256,revisionSha256,actors:actorList
});
let denied=0;
function fail(fn){A.throws(fn,/V190_DENIED/);denied++;}
fail(()=>createSyntheticDecisionHarness({sourceId:q22,sourceSha256:'0'.repeat(64),revisionSha256:fakeA,actors}));
fail(()=>createSyntheticDecisionHarness({sourceId:'XI-U07-T071-Q999',sourceSha256:POLICY[q22].sourceSha256,revisionSha256:fakeA,actors}));
fail(()=>newHarness(q25,'bad'));
fail(()=>newHarness(q25,fakeA,{mock_intruder:{role:'admin',active:true}}));
const h=newHarness(q25);
const cmd=(action,more={},revision=h.snapshot().currentRevisionSha256,seq=h.snapshot().sequence)=>({
 action,sourceId:q25,sourceSha256:POLICY[q25].sourceSha256,revisionSha256:revision,expectedSequence:seq,...more
});
fail(()=>h.dispatch('mock_cog_1',cmd('verify-source',{evidenceSha256:ev1})));
fail(()=>h.dispatch('mock_inactive_1',cmd('verify-source',{evidenceSha256:ev1})));
fail(()=>h.dispatch('unknown',cmd('verify-source',{evidenceSha256:ev1})));
fail(()=>h.dispatch('mock_science_1',{...cmd('verify-source',{evidenceSha256:ev1}),callerRole:'owner'}));
fail(()=>h.dispatch('mock_science_1',cmd('verify-source',{evidenceSha256:'WRONG'})));
fail(()=>h.dispatch('mock_science_1',cmd('approve-physics',{evidenceSha256:ev1})));
fail(()=>h.dispatch('mock_owner_1',cmd('acknowledge-owner',{evidenceSha256:ev1})));
fail(()=>h.dispatch('mock_science_1',cmd('verify-source',{evidenceSha256:ev1},fakeB)));
fail(()=>h.dispatch('mock_science_1',cmd('verify-source',{evidenceSha256:ev1},fakeA,1)));
fail(()=>h.dispatch('mock_science_1',{...cmd('verify-source',{evidenceSha256:ev1}),sourceSha256:fakeB}));
A.equal(h.snapshot().eligibleForScoredTestBuilder,false);
A.equal(h.snapshot().studentScoredRelease,'HOLD');
const sourceCommand=cmd('verify-source',{evidenceSha256:ev1});
h.dispatch('mock_science_1',sourceCommand);
fail(()=>h.dispatch('mock_science_1',sourceCommand)); // replay sequence
fail(()=>h.dispatch('mock_science_1',cmd('verify-source',{evidenceSha256:ev1}))); // duplicate
fail(()=>h.dispatch('mock_cog_1',cmd('approve-slo',{evidenceSha256:ev2}))); // order
h.dispatch('mock_science_1',cmd('approve-physics',{evidenceSha256:ev1}));
fail(()=>h.dispatch('mock_science_1',cmd('approve-physics',{evidenceSha256:ev2})));
fail(()=>h.dispatch('mock_science_1',cmd('approve-slo',{evidenceSha256:ev2})));
h.dispatch('mock_cog_1',cmd('approve-slo',{evidenceSha256:ev2}));
fail(()=>h.dispatch('mock_cog_1',cmd('acknowledge-owner',{evidenceSha256:ev2})));
fail(()=>h.dispatch('mock_science_1',cmd('acknowledge-owner',{evidenceSha256:ev2})));
const beforeOwner=h.snapshot();
A.equal(beforeOwner.syntheticReviewStagesComplete,false);
const ownerStage=h.dispatch('mock_owner_1',cmd('acknowledge-owner',{evidenceSha256:ev2}));
A.equal(ownerStage.syntheticReviewStagesComplete,true);
A.equal(ownerStage.directSummativeCandidate,true);
A.equal(ownerStage.realAuthenticationVerified,false);
A.equal(ownerStage.realTeacherApprovalGranted,false);
A.equal(ownerStage.eligibleForScoredTestBuilder,false);
A.equal(ownerStage.studentScoredRelease,'HOLD');
A.equal(verifyLocalHashChain(h.audit()),true);
const tampered=h.audit();tampered[0].actor='mock_fake_1';
A.equal(verifyLocalHashChain(tampered),false);denied++;
fail(()=>h.dispatch('mock_owner_1',cmd('revoke',{reasonCode:'bad reason with spaces'})));
h.dispatch('mock_owner_1',cmd('revoke',{reasonCode:'WITHDRAWN_FOR_RECHECK'}));
A.equal(h.snapshot().revoked,true);
A.equal(h.snapshot().syntheticReviewStagesComplete,false);
fail(()=>h.dispatch('mock_science_1',cmd('verify-source',{evidenceSha256:ev1})));
fail(()=>h.dispatch('mock_owner_1',cmd('supersede',{nextRevisionSha256:fakeA}))); // identical
h.dispatch('mock_owner_1',cmd('supersede',{nextRevisionSha256:fakeB}));
A.equal(h.snapshot().revoked,false);
A.equal(h.snapshot().currentRevisionSha256,fakeB);
A.equal(h.snapshot().academicSourceCheckActive,false);
A.equal(h.snapshot().academicScienceCheckActive,false);
A.equal(h.snapshot().academicSloCheckActive,false);
A.equal(h.snapshot().syntheticOwnerAcknowledgedActive,false);
fail(()=>h.dispatch('mock_science_1',cmd('verify-source',{evidenceSha256:ev1},fakeA)));
fail(()=>h.dispatch('mock_owner_1',cmd('supersede',{nextRevisionSha256:fakeA}))); // can't replay old revision
h.dispatch('mock_science_1',cmd('verify-source',{evidenceSha256:ev1}));
h.dispatch('mock_science_1',cmd('approve-physics',{evidenceSha256:ev1}));
h.dispatch('mock_cog_1',cmd('approve-slo',{evidenceSha256:ev2}));
h.dispatch('mock_owner_1',cmd('acknowledge-owner',{evidenceSha256:ev2}));
const afterDisable=h.disableMockActor('mock_owner_1','mock_science_1');
A.equal(afterDisable.syntheticReviewStagesComplete,false);
A.equal(afterDisable.academicScienceCheckActive,false);
A.equal(afterDisable.realTeacherApprovalGranted,false);
fail(()=>h.dispatch('mock_science_1',cmd('verify-source',{evidenceSha256:ev1})));
fail(()=>h.disableMockActor('mock_owner_1','mock_science_1'));
A.equal(verifyLocalHashChain(h.audit()),true);
const tamperedDigest=h.audit();tamperedDigest.at(-1).digest='0'.repeat(64);
A.equal(verifyLocalHashChain(tamperedDigest),false);denied++;
// Q22 can be processed as supplementary-study mock, but never as direct B-22 summative:
const support=newHarness(q22,fakeC);
const supportCmd=(action,more={})=>({
 action,sourceId:q22,sourceSha256:POLICY[q22].sourceSha256,revisionSha256:fakeC,
 expectedSequence:support.snapshot().sequence,...more
});
support.dispatch('mock_science_1',supportCmd('verify-source',{evidenceSha256:ev1}));
support.dispatch('mock_science_1',supportCmd('approve-physics',{evidenceSha256:ev1}));
support.dispatch('mock_cog_1',supportCmd('approve-slo',{evidenceSha256:ev2}));
const supportDone=support.dispatch('mock_owner_1',supportCmd('acknowledge-owner',{evidenceSha256:ev2}));
A.equal(supportDone.syntheticReviewStagesComplete,true);
A.equal(supportDone.directSummativeCandidate,false);
A.equal(supportDone.provisionalSloScope,'SUPPORTING_ONLY_NOT_DIRECT_SUMMATIVE_B22');
A.equal(supportDone.eligibleForScoredTestBuilder,false);
A.equal(supportDone.studentScoredRelease,'HOLD');
// Public original rows and candidate scope must stay frozen; no private revision
// digests/keys are read by these tests.
const v189=load('quality/unit07/unit07-v189-two-candidate-slo-distractor-qc-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
A.equal(v189.version,'V189');A.equal(v189.items.length,2);
A.equal(v189.items[0].sourceId,q22);A.equal(v189.items[1].sourceId,q25);
A.equal(v189.items[0].sloDirectAlignment,'SUPPORTING_ONLY_NOT_DIRECT_SUMMATIVE_B22');
A.equal(v189.items[1].sloDirectAlignment,'PROMISING_DIRECT_STRUCTURE_DISTINCTION_TEACHER_PENDING');
A.equal(v189.items[1].v189IndividualRevisionChanged,true);
A.equal(v185.candidateRegistry.length,72);
for(const [i,id] of [q22,q25].entries()){
 const p=v185.candidateRegistry.find(r=>r.sourceId===id);
 A.ok(p);A.equal(p.originalSourceRowSha256,POLICY[id].sourceSha256);
 A.equal(v189.items[i].originalSourceRowSha256,POLICY[id].sourceSha256);
}
for(const row of v185.candidateRegistry){
 A.equal(row.candidateIndividualRevisionSha256,null);
 A.equal(row.secureAuthenticatedApprovalAvailable,false);
 A.equal(row.eligibleForStudentScoredUse,false);A.equal(row.scoredRelease,'HOLD');
}
for(const k of ['individualTeacherScienceApprovals','individualTeacherCognitiveApprovals',
 'individualTeacherScoringApprovals','studentScoredUnit7Items'])A.equal(v185[k],0);
const contract=load('quality/unit07/unit07-v190-offline-decision-contract-no-deploy.json');
A.equal(contract.version,'V190');
A.equal(contract.prerequisite.mergeSha,'b87a74e8fa7ca059ca6fcfa979c1b50c3a542df7');
A.equal(contract.realCandidateRevisionDigestsCommitted,0);
A.equal(contract.realTeacherScienceApprovals,0);
A.equal(contract.realTeacherCognitiveApprovals,0);
A.equal(contract.realOwnerScoringApprovals,0);
A.equal(contract.liveUnit7ScoredReleases,0);
A.equal(contract.syntheticOnly,true);
A.equal(contract.realAuthenticationImplemented,false);
A.equal(contract.realAppCheckEnforced,false);
A.equal(contract.productionOrStagingDeployed,false);
A.equal(contract.originalOrRevisedPrivateQuestionTextCommitted,false);
A.deepEqual(contract.sourcePolicyIds,[q22,q25]);
const oldNoGo=load('quality/unit07/topic71-v160-production-readiness-no-go.json');
const stageNoGo=load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json');
A.equal(oldNoGo.decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(stageNoGo.decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
A.equal(stageNoGo.ownerAuthorizedStagingDeploy,false);
const cat=load('portal/learning-catalog.json');
const unit=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(unit.status,'planned');A.equal(unit.assessmentStatus,'not-published');
A.equal(unit.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
const memo=read('quality/grade11-v190-unit07-offline-revision-bound-decision-qc.md').toLowerCase();
for(const term of ['v190','revision','q22','q25','pending','hold','synthetic',
 'source','role','replay','revocation','app check','firestore','no-go','v191']){
 A.ok(memo.includes(term),'Missing V190 scope/security marker '+term);
}
const out=path.join(ROOT,'qa-artifacts/grade11-v190-revision-bound-decision-synthetic');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
 version:'V190',sourcePolicyItems:2,sourceQueueItems:72,syntheticRoleReviewCases:2,
 syntheticNegativeCasesRejected:denied,actualPrivateCandidateRevisionDigestsImported:0,
 actualTeacherScienceApprovals:0,actualTeacherCognitiveApprovals:0,
 actualOwnerScoringApprovals:0,liveUnit7ScoredReleases:0,
 originalOrRevisedQuestionContentInGitHub:false,noFirebaseOrProductionChanges:true
},null,2)+'\n');
console.log('V190 PASS: 2 synthetic revision-bound decisions; '+denied+
 ' negative cases denied, Q22 supplementary only, Q25 pending, all real approvals ZERO and score HOLD.');
