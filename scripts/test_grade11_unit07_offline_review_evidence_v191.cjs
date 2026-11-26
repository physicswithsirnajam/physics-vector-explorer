#!/usr/bin/env node
'use strict';
/* Invented evidence SHA and candidate digests only; no actual Q25 private key. */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {POLICY}=require('./unit07_revision_bound_review_v190.cjs');
const {CHECKS,generateOfflineReceipt}=require('./unit07_offline_review_evidence_v191.cjs');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const Q22='XI-U07-T071-Q022',Q25='XI-U07-T071-Q025';
const MOCK_REV='a'.repeat(64),MOCK_EVIDENCE='b'.repeat(64);
const status=(s,e=null)=>({status:s,evidenceSha256:e});
const checklist=Object.fromEntries(CHECKS.map(x=>[x,status('NOT_ASSESSED')]));
const base={sourceId:Q25,sourceSha256:POLICY[Q25].sourceSha256,candidateRevisionSha256:MOCK_REV,checklist,claimedApproval:false};
const receipt=generateOfflineReceipt(base);
A.equal(receipt.type,'UNTRUSTED_OFFLINE_REVIEW_NOTES_ONLY');
A.equal(receipt.proposedSlo,'P-11-B-22');
A.equal(receipt.summary.notAssessed,6);
A.equal(receipt.summary.issueIdentified,0);
A.equal(receipt.summary.notesCapturedOffline,0);
A.equal(receipt.directlyEligibleForSummative,false);
A.equal(receipt.authenticatedTeacherIdentityVerified,false);
A.equal(receipt.signedAuditVerified,false);
A.equal(receipt.scienceApproved,false);
A.equal(receipt.cognitiveApproved,false);
A.equal(receipt.ownerScoringAuthorized,false);
A.equal(receipt.realBackendAndAppCheckVerified,false);
A.equal(receipt.scoredTestBuilderEligible,false);
A.equal(receipt.studentScoredRelease,'HOLD');
A.equal(receipt.evidenceReferencesNotVerified,true);
A.equal(receipt.privateOriginalAndCandidateContentNotReviewedByThisFunction,true);
A.match(receipt.localReceiptSha256,/^[0-9a-f]{64}$/);
A.deepEqual(generateOfflineReceipt(base),receipt,'deterministic receipt output');
const allNotes={...base,checklist:Object.fromEntries(CHECKS.map(x=>[x,status('NOTES_CAPTURED_OFFLINE',MOCK_EVIDENCE)]))};
const all=generateOfflineReceipt(allNotes);
A.equal(all.summary.notesCapturedOffline,6);
A.equal(all.scienceApproved,false);
A.equal(all.cognitiveApproved,false);
A.equal(all.scoredTestBuilderEligible,false);
A.equal(all.studentScoredRelease,'HOLD');
const changed={...allNotes,checklist:{...allNotes.checklist,rights:status('ISSUE_IDENTIFIED',MOCK_EVIDENCE)}};
const issue=generateOfflineReceipt(changed);
A.equal(issue.summary.issueIdentified,1);
A.notEqual(issue.localReceiptSha256,all.localReceiptSha256);
A.equal(issue.studentScoredRelease,'HOLD');
const supporting=generateOfflineReceipt({...base,sourceId:Q22,sourceSha256:POLICY[Q22].sourceSha256});
A.equal(supporting.sourceScope,'SUPPORTING_ONLY_NOT_DIRECT_SUMMATIVE_B22');
A.equal(supporting.directlyEligibleForSummative,false);
A.equal(supporting.studentScoredRelease,'HOLD');
let denied=0;
const fail=x=>{A.throws(()=>generateOfflineReceipt(x),/V191_DENIED/);denied++;};
fail({...base,sourceId:'XI-U07-T071-Q999'});
fail({...base,sourceSha256:'0'.repeat(64)});
fail({...base,candidateRevisionSha256:'BAD'});
fail({...base,claimedApproval:true});
fail({...base,claimedApproval:'APPROVED'});
fail({...base,ownerScoringAuthorization:true});
fail({...base,teacherUid:'unverified'});
fail({...base,studentScoreRelease:'RELEASED'});
fail({...base,checklist:{}});
fail({...base,checklist:{...base.checklist,extra:status('NOT_ASSESSED')}});
fail({...base,checklist:{...base.checklist,science:{status:'APPROVED',evidenceSha256:MOCK_EVIDENCE}}});
fail({...base,checklist:{...base.checklist,science:{status:'NOT_ASSESSED',evidenceSha256:MOCK_EVIDENCE}}});
fail({...base,checklist:{...base.checklist,science:{status:'NOTES_CAPTURED_OFFLINE',evidenceSha256:null}}});
fail({...base,checklist:{...base.checklist,science:{status:'ISSUE_IDENTIFIED',evidenceSha256:'short'}}});
fail({...base,checklist:{...base.checklist,science:{status:'SIGNED_OFF',evidenceSha256:MOCK_EVIDENCE}}});
fail({...base,checklist:{...base.checklist,science:{status:'NOTES_CAPTURED_OFFLINE',evidenceSha256:MOCK_EVIDENCE,approved:true}}});
fail({...base,checklist:{...base.checklist,sourceFidelity:null}});
fail({...base,checklist:{...base.checklist,rights:{status:'CLEARED',evidenceSha256:MOCK_EVIDENCE}}});
fail({...base,checklist:{...base.checklist,rights:status('NOTES_CAPTURED_OFFLINE',MOCK_EVIDENCE.toUpperCase())}});
fail({...base,checklist:{...base.checklist,sourceFidelity:status('ISSUE_IDENTIFIED',null)}});
const v189=load('quality/unit07/unit07-v189-two-candidate-slo-distractor-qc-no-keys.json');
const v190=load('quality/unit07/unit07-v190-offline-decision-contract-no-deploy.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const contract=load('quality/unit07/unit07-v191-q25-private-review-readiness-no-keys.json');
A.equal(v189.status,'TWO_PRIVATE_CANDIDATE_MODEL_ACADEMIC_REVIEW_NOT_TEACHER_SIGNOFF_ALL_SCORED_HOLD');
A.equal(v190.status,'SYNTHETIC_REVISION_BOUND_DECISION_CONTRACT_NO_REAL_AUTHENTICATED_APPROVAL_OR_SCORING');
A.equal(contract.version,'V191');
A.equal(contract.prerequisite.mergeSha,'53712aa0e269a73de4597be9884cdfc872c28773');
A.equal(contract.sourceId,Q25);
A.equal(contract.originalRowSha256,POLICY[Q25].sourceSha256);
A.equal(contract.privateV189RevisionDigestPublished,false);
A.equal(contract.actualPrivateQuestionOrKeyCommitted,false);
A.equal(contract.privateWorksheet.existsInConversation,true);
A.equal(contract.privateWorksheet.pageCount,3);
A.equal(contract.privateWorksheet.sha256,'eabfeb97e1fe702922abadd3fd4301f85c7a6ede512fedda8d640750a9a7a7f9');
A.equal(contract.privateWorksheet.teacherDecisionFieldsPreFilled,false);
A.equal(contract.offlineEvidenceProtocol.actualTeacherIdentityNotAuthenticated,true);
A.equal(contract.offlineEvidenceProtocol.academicReleaseHardBlocked,true);
A.equal(contract.realTeacherScienceApprovals,0);
A.equal(contract.realTeacherCognitiveApprovals,0);
A.equal(contract.ownerScoringPermissions,0);
A.equal(contract.liveUnit7ScoredReleases,0);
for(const k of ['firebaseChanged','firestoreRulesChanged','realTeacherRolesCreated',
 'productionOrStagingBackendDeployed','studentScoredBankChanged'])
 A.equal(contract[k],false);
A.equal(v185.candidateRegistry.length,72);
for(const row of v185.candidateRegistry){
 A.equal(row.candidateIndividualRevisionSha256,null);
 A.equal(row.secureAuthenticatedApprovalAvailable,false);
 A.equal(row.eligibleForStudentScoredUse,false);
 A.equal(row.scoredRelease,'HOLD');
}
const cat=load('portal/learning-catalog.json');
const unit=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(unit.status,'planned');A.equal(unit.assessmentStatus,'not-published');A.equal(unit.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const memo=read('quality/grade11-v191-unit07-q25-owner-teacher-offline-review-qc.md').toLowerCase();
for(const term of ['v191','q25','private','summative','b-22','distractor','glassy',
 'source','pending','hold','teacher','revision','no-go','firestore','app check','v192'])
 A.ok(memo.includes(term),'V191 memo missing '+term);
const out=path.join(ROOT,'qa-artifacts/grade11-v191-q25-offline-teacher-review');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
 version:'V191',syntheticReviewReceiptOnly:true,sourceItemsExamined:2,
 privateTeacherWorksheetPages:3,realPrivateRevisionDigestsInPublicRepo:0,
 offlineEvidenceNegativeTests:denied,authenticatedScienceApprovals:0,
 authenticatedCognitiveApprovals:0,ownerScorePermissions:0,unit7ScoredReleases:0,
 noFirebaseOrProductionChanges:true
},null,2)+'\n');
console.log('V191 PASS: '+denied+' offline evidence forgery tests denied; Q25 private review fields blank, Q22 supporting-only, 0 real academic approvals, 0 scored releases.');
