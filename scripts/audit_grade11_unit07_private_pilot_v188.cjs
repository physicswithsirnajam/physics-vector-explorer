#!/usr/bin/env node
'use strict';
/**
 * V188 — Public metadata ONLY; no private owner question text or keyed
 * candidate digest is readable here. A green result does NOT verify the
 * withheld two actual revisions; it verifies source-register references and
 * remaining teacher/student-scoring HOLD safeguards.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const IDX='quality/unit07/unit07-v188-private-two-item-pilot-no-keys.json';
const MEMO='quality/grade11-v188-unit07-two-real-private-candidate-pilot-review.md';
const ids=['XI-U07-T071-Q022','XI-U07-T071-Q025'];
const rowSha=[
 '4632066b3e8eff54029b85cebfdebb823f9e3364e64cb9c15b0905691c1e0dd3',
 '27d9b15ebe860eca6b4788d6420db4230e6266295027ef01d28ca2383a7f5353'
];
const issues=[
 'approximate-isotropy-randomly-oriented-grains',
 'short-range-order-without-long-range-periodicity'
];
const BANNED=[
 'stem','question','questionText','originalQuestion','originalStem',
 'sourceOptions','options','candidateOptions','revisedStem','candidateQuestion',
 'correctOption','answerKey','answerLetter','correctAnswer','correctOptionText',
 'workedExplanation','explanation','fullSolution','sourcePrivateWordBytes',
 'privateInputBytesSha256','actualCandidateRevisionSha256','candidateRevisionSha256',
 'privateManifestBody','privateQuestionText','studentUid','studentEmail',
 'teacherUid','teacherEmail','authenticationToken','approvalToken'
];
function noSecrets(o,label){
 if(o===null||typeof o!=='object')return;
 for(const key of BANNED)A.equal(Object.hasOwn(o,key),false,'private field '+label+'.'+key);
 for(const [k,v] of Object.entries(o)){
  if(v&&typeof v==='object')noSecrets(v,label+'.'+k);
 }
}
function check(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V188');
 A.equal(d.prerequisite.prNumber,291);
 A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'8844e9ab1f8d00e4af70b78eed18ebbea6ad3f98');
 A.equal(d.status,'PRIVATE_PILOT_TWO_REAL_CANDIDATE_IDENTITIES_CONFIRMED_NO_ACADEMIC_SIGNOFF_NO_DEPLOY');
 A.equal(d.protocolSourceVersion,'V187');
 A.equal(d.canonicalRevisionSchema,'PWSN-U07-CANDIDATE-V1');
 A.equal(d.sourceInventoryCount,274);
 A.equal(d.candidateQueueCount,72);
 A.equal(d.actualPrivateCandidateRevisionsLocallyPrepared,2);
 A.equal(d.actualPrivateCandidateRevisionHashesStoredInPublicRepo,0);
 A.equal(d.existingV185PerItemRevisionHashesChanged,0);
 A.equal(d.existingV185TeacherApprovalsChanged,0);
 const prov=d.privatePilotProvenance;
 A.equal(prov.originalSourceDocument,'Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.docx');
 A.equal(prov.originalSourceDocumentSha256,'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58');
 A.equal(prov.candidateReviewDocument,'Unit7_V184_Teacher_Review_Batch06_PRIVATE.docx');
 A.equal(prov.candidateReviewDocumentSha256,'c63f8ed1c9fe68d3e331971e258d2b2104da58a098ca8b2975a83c16b6356980');
 for(const key of ['originalQuestionOptionsKeyAndExplanationReopenedAndMatched',
  'proposedCandidateParsedFromExactPrivateReviewTables',
  'canonicalHashIndependentlyRecalculatedWithNode',
  'sourceRowsComparedToV185OriginalRowFingerprints'])A.equal(prov[key],true);
 for(const key of ['entireV185SourceIndexFileShaClaimed','entireV187ProgramRunOnRealInputs',
  'completeNbfSourceTextbookReopened'])A.equal(prov[key],false);
 A.equal(d.selectedSources.length,2);
 for(let i=0;i<2;i++){
  const r=d.selectedSources[i];
  A.equal(r.sourceId,ids[i]);
  A.equal(r.originalSourceRowSha256,rowSha[i]);
  A.equal(r.priorPrivateBatch,'V184');
  A.equal(r.topic,'7.1');
  A.equal(r.reviewIssueCategory,issues[i]);
  A.equal(r.provisionalSlo,'P-11-B-22');
  A.equal(r.provisionalCognitive,'U');
  A.equal(r.candidateRevisionDigest,'WITHHELD_PRIVATE');
  A.equal(r.ownerOriginalMatched,true);
  A.equal(r.privateCandidateHashCreated,true);
  A.equal(r.sciencePreScreen,'MODEL_CHECK_ONLY_NOT_AUTHENTICATED_TEACHER');
  A.equal(r.sourceEvidenceClearance,'NOT_ATTESTED');
  A.equal(r.individualTeacherScienceApproval,'PENDING');
  A.equal(r.individualTeacherCognitiveApproval,'PENDING');
  A.equal(r.individualOwnerScoringApproval,'PENDING');
  A.equal(r.studentScoredRelease,'HOLD');
 }
 const privateFiles=d.privateArtifacts;
 A.equal(privateFiles.input,'V188_PRIVATE_Exact_Candidate_Input_2_Items.json');
 A.equal(privateFiles.output,'V188_PRIVATE_2_Item_Keyless_Revision_Manifest.json');
 A.equal(privateFiles.readme,'V188_PRIVATE_README.txt');
 A.equal(privateFiles.privateContentAndDerivedDigestsCommittedToGitHub,false);
 A.equal(privateFiles.madeAvailableOnlyAsPrivateConversationArtifacts,true);
 A.equal(privateFiles.notPublishedToActionLogs,true);
 A.equal(privateFiles.notImportedToLiveQuestionBank,true);
 A.equal(d.missingEvidence.officialNbfSourceBookPageSpecificVerification,'NOT_ATTESTED_FOR_THIS_PILOT');
 for(const k of ['p114','p115','originalExample72'])A.equal(d.missingEvidence[k],'UNRESOLVED_FROM_PREVIOUS_BATCHES');
 A.equal(d.missingEvidence.teacherAcademicApproval,'UNRESOLVED');
 A.equal(d.missingEvidence.teacherBackendLiveRulesAndAppCheck,'V160_V161_DEPLOYMENT_NO_GO');
 for(const key of ['authenticatedTeacherScienceApprovals','authenticatedTeacherCognitiveApprovals',
  'ownerScoredReleaseAuthorizations','scoredUnit7Items'])A.equal(d[key],0);
 for(const key of ['firebaseChanged','stagingOrProductionBackendChanged','publicKeyedContentChanged',
  'publicStudentQuestionBankChanged','actualTeacherDirectoryChanged'])A.equal(d[key],false);
 A.ok(d.ciAssuranceLimit.includes('cannot independently rederive withheld private candidate hashes'));
 A.ok(d.nextMilestone.startsWith('V189'));
 noSecrets(d,'index');
}
const d=load(IDX);check(d);
const prior=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const v184=load('quality/unit07/unit07-v184-batch06-twelve-originals-last-compulsory-private-review-no-keys.json');
const v187=load('quality/unit07/unit07-v187-local-private-manifest-contract-no-deploy.json');
const v186=load('quality/unit07/unit07-v186-offline-protocol-design-no-deploy.json');
A.equal(prior.version,'V185');
A.equal(prior.candidateRegistry.length,72);
A.equal(v184.rows.length,12);
A.equal(v187.version,'V187');A.equal(v187.realState.actualPrivateCandidateManifestsProcessed,0);
A.equal(v187.realState.individualActualPrivateRevisionDigestsPersisted,0);
A.equal(v187.realState.actualTeacherScienceApprovals,0);
A.equal(v187.realState.actualTeacherCognitiveApprovals,0);
A.equal(v187.realState.actualOwnerScoringApprovals,0);
A.equal(v187.realState.studentScoredUnit7Releases,0);
A.equal(v186.status,'LOCAL_SYNTHETIC_TEST_PROTOCOL_ONLY');
A.equal(v186.scoredUnit7Releases,0);
const all=new Set(prior.candidateRegistry.map(x=>x.sourceId));
A.equal(all.size,72);
for(let i=0;i<2;i++){
 const id=ids[i];
 const p=prior.candidateRegistry.find(x=>x.sourceId===id);
 const old=v184.rows.find(x=>x.id===id);
 A.ok(p&&old,'source must exist in both V185 and V184');
 A.equal(p.originalSourceRowSha256,rowSha[i]);
 A.equal(old.sourceOriginalFullRowSha256,rowSha[i]);
 A.equal(old.sourceRegistry,'V154');
 A.equal(p.priorPrivatePackVersion,'V184');
 A.equal(p.candidateIndividualRevisionSha256,null);
 A.equal(p.secureAuthenticatedApprovalAvailable,false);
 A.equal(p.eligibleForStudentScoredUse,false);
 A.equal(p.scoredRelease,'HOLD');
 A.equal(old.scoredRelease,'HOLD');
}
for(const row of prior.candidateRegistry){
 A.equal(row.candidateIndividualRevisionSha256,null);
 A.equal(row.eligibleForStudentScoredUse,false);
 A.equal(row.secureAuthenticatedApprovalAvailable,false);
 A.equal(row.scoredRelease,'HOLD');
}
for(const f of ['individualCandidateImmutableRevisionDigestsVerified','individualTeacherScienceApprovals',
 'individualTeacherCognitiveApprovals','individualTeacherScoringApprovals','studentScoredUnit7Items'])
 A.equal(prior[f],0);
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.deepEqual(load('question-bank/manifest.json').grades.find(x=>x.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const mutants=[
 x=>x.prerequisite.prNumber=290,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='PRODUCTION_READY',
 x=>x.actualPrivateCandidateRevisionsLocallyPrepared=72,
 x=>x.actualPrivateCandidateRevisionHashesStoredInPublicRepo=2,
 x=>x.existingV185PerItemRevisionHashesChanged=2,
 x=>x.privatePilotProvenance.originalSourceDocumentSha256='0'.repeat(64),
 x=>x.privatePilotProvenance.candidateReviewDocumentSha256='0'.repeat(64),
 x=>x.privatePilotProvenance.entireV187ProgramRunOnRealInputs=true,
 x=>x.privatePilotProvenance.completeNbfSourceTextbookReopened=true,
 x=>x.selectedSources.pop(),
 x=>x.selectedSources[0].sourceId='XI-U07-T071-Q999',
 x=>x.selectedSources[0].originalSourceRowSha256='0'.repeat(64),
 x=>x.selectedSources[0].candidateRevisionDigest='1'.repeat(64),
 x=>x.selectedSources[0].sourceEvidenceClearance='VERIFIED',
 x=>x.selectedSources[0].individualTeacherScienceApproval='APPROVED',
 x=>x.selectedSources[1].individualTeacherCognitiveApproval='APPROVED',
 x=>x.selectedSources[1].individualOwnerScoringApproval='APPROVED',
 x=>x.selectedSources[0].studentScoredRelease='RELEASED',
 x=>x.selectedSources[0].correctOption='B',
 x=>x.privateArtifacts.privateContentAndDerivedDigestsCommittedToGitHub=true,
 x=>x.privateArtifacts.madeAvailableOnlyAsPrivateConversationArtifacts=false,
 x=>x.privateArtifacts.notPublishedToActionLogs=false,
 x=>x.privateArtifacts.notImportedToLiveQuestionBank=false,
 x=>x.missingEvidence.officialNbfSourceBookPageSpecificVerification='CLEARED',
 x=>x.authenticatedTeacherScienceApprovals=1,
 x=>x.authenticatedTeacherCognitiveApprovals=1,
 x=>x.ownerScoredReleaseAuthorizations=1,
 x=>x.scoredUnit7Items=2,
 x=>x.firebaseChanged=true,
 x=>x.stagingOrProductionBackendChanged=true,
 x=>x.publicKeyedContentChanged=true,
 x=>x.publicStudentQuestionBankChanged=true,
 x=>x.actualTeacherDirectoryChanged=true,
 x=>x.actualCandidateRevisionSha256='0'.repeat(64),
 x=>x.nextMilestone='V189_RELEASE_TO_STUDENTS'
];
let denied=0;
for(const fn of mutants){
 const mutated=structuredClone(d);fn(mutated);
 A.throws(()=>check(mutated),undefined,'V188 mutation '+(denied+1)+' escaped');
 denied++;
}
const memo=read(MEMO).toLowerCase().replace(/\s/g,'');
for(const term of ['v188','two','2','72','274','v184','v185','q22','q25','not approved',
 'pending','hold','source','private','teacher','no-go','firebase','app check','v189']){
 A.ok(memo.includes(term.toLowerCase().replace(/\s/g,'')),'Missing public review memo marker: '+term);
}
const qa=path.join(ROOT,'qa-artifacts/grade11-v188-two-private-candidate-source-safe');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V188',pilotPrivateCandidateItemsClaimed:2,publicSourceReferencesVerified:2,
 privateRevisionDigestsExposedInPublicGitHub:0,
 v185ExistingUnapprovedCandidateQueueCount:72,unit7OriginalSourceUniverseCount:274,
 authenticatedTeacherScienceApprovals:0,authenticatedTeacherCognitiveApprovals:0,
 ownerScoringApprovals:0,studentScoredUnit7Releases:0,
 publicMetadataFailClosedMutationDenials:denied,
 limitation:'PRIVATE_DIGESTS_NOT_RECOMPUTABLE_IN_PUBLIC_CI_NO_TEACHER_SIGNOFF'
},null,2)+'\n');
console.log('V188 PASS: 2 public source-bound references to privately prepared candidates, '+denied+
 ' denied public mutations; 72 source review holds, ZERO authenticated approvals or scoring.');
