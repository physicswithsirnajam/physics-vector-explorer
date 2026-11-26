#!/usr/bin/env node
'use strict';
/* V192 — PUBLIC METADATA ONLY. Cannot read confidential Q25 text/digest,
 * attest human academic approval or release a scored student question.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const INDEX='quality/unit07/unit07-v192-q25-science-disposition-private-hold-no-keys.json';
const MEMO='quality/grade11-v192-unit07-q25-model-science-adjudication-qc.md';
const ID='XI-U07-T071-Q025';
const ORIG='27d9b15ebe860eca6b4788d6420db4230e6266295027ef01d28ca2383a7f5353';
const SRC='930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58';
const DOC='9381867e239fd71ed090948461f1b5dfe487a9c51858f4165970bbd75bec7296';
const PRIVATE_KEYS=['stem','question','questionText','originalQuestion','originalOptions',
 'options','candidateOptions','correctOption','answerKey','correctAnswer',
 'answerLetter','solution','fullExplanation','privateCandidateRevisionSha256',
 'candidateRevisionSha256','actualCandidateDigest','realTeacherUid',
 'teacherEmail','studentUid','studentEmail','authToken','privateOriginalQuestion'];
function noSecrets(o,where){
 if(o===null||typeof o!=='object')return;
 for(const k of PRIVATE_KEYS)A.equal(Object.hasOwn(o,k),false,'Private payload forbidden at '+where+'.'+k);
 for(const [k,v] of Object.entries(o))if(typeof v==='object')noSecrets(v,where+'.'+k);
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V192');
 A.equal(d.prerequisite.prNumber,295);A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'4cbf7165b38a2a4d305280ff530d1c33b0824b94');
 A.equal(d.status,'MODEL_QC_ONLY_Q25_EXISTING_V189_CANDIDATE_RETAINED_REAL_TEACHER_PENDING_NO_SCORE');
 A.equal(d.sourceId,ID);A.equal(d.originalSourceRowSha256,ORIG);
 A.equal(d.originalOwnerSourceDocumentSha256,SRC);
 A.equal(d.privateCandidateVersion,'V189');
 A.equal(d.priorV189ActualPrivateDigestWithheld,true);
 A.equal(d.existingPrivateCandidateRevisionPreserved,true);
 A.equal(d.v192NewQuestionRevisionIssued,false);
 const p=d.privateReviewArtifact;
 A.equal(p.filename,'Unit7_V192_Q25_Academic_Adjudication_Dossier_PRIVATE.docx');
 A.equal(p.sha256,DOC);A.equal(p.renderedPages,3);A.equal(p.visuallyChecked,true);
 A.equal(p.originalAndRevisedKeyedItemsIncluded,true);
 A.equal(p.includesExactPrivateCandidateDigest,true);
 A.equal(p.realReviewerFieldsAllBlank,true);
 A.equal(p.committedToPublicGithub,false);
 const s=d.scientificModelPrescreen;
 A.equal(s.provisionalSlo,'P-11-B-22');
 A.equal(s.provisionalOfficialAssessment,'Summative');
 A.equal(s.provisionalActualDemand,'Understanding');
 A.equal(s.scientificProposition,'SHORT_RANGE_ORDER_COMPATIBLE_WITH_AMORPHOUS_SOLID_NO_LONG_RANGE_PERIODIC_LATTICE');
 A.equal(s.independentOneBestAnswerModelAssessment,'DEFENSIBLE_PENDING_HUMAN');
 A.equal(s.priorDistractorRevisionIssue,'V188_WEAK_DISTRACTORS_REVISED_IN_V189');
 A.equal(s.v189CurrentDistractorsModelReviewed,true);
 A.equal(s.presentV189RevisionRequiresCompulsoryNewEdit,false);
 A.deepEqual(s.optionalDistractorWordingReview,
 ['SINGLE_CRYSTAL_ABSOLUTE_WORD_NECESSARILY','POLYMERIC_INFERENCE_WORD_PROVES']);
 A.equal(s.glassyVsAmorphousOverlapAcknowledged,true);
 A.equal(s.glassyNotExplicitInOptionsIsAutomaticDisqualification,false);
 A.equal(s.fullFourCategoryCoverageBelongsToBankLevelPlan,true);
 for(const k of ['independentHumanScienceApproval','independentHumanDistractorApproval',
 'independentHumanSloCognitiveApproval'])A.equal(s[k],'PENDING');
 A.equal(s.officialCurriculumSource,'FBISE 2025 HSSC-I Physics framework P-11-B-22');
 A.equal(s.publisherNbfUnit7TeachingPages113To116IndependentlyCheckedThisStage,false);
 A.equal(d.priorQ22ScopeGuard,'SUPPORTING_ONLY_NOT_DIRECT_SUMMATIVE_B22');
 A.equal(d.unit7OriginalSourceItems,274);A.equal(d.distinctPrivateCandidatesReviewedPreviously,72);
 for(const k of ['authenticatedTeacherScienceApprovals','authenticatedTeacherCognitiveApprovals',
 'actualOwnerScoringApprovals','liveUnit7ScoredItems'])A.equal(d[k],0);
 A.equal(d.sourceEvidenceOutstanding.length,5);
 A.ok(d.sourceEvidenceOutstanding[0].includes('113'));
 for(const k of ['publicCandidateRevisionDigestStored','publicCorrectAnswerOrOptionTextIncluded',
 'v185ExistingCandidateDigestsModified','firebaseModified','teacherAuthOrRolesModified',
 'productionOrStagingDeployed','scoredStudentBankModified'])A.equal(d[k],false);
 A.equal(d.stagingBackendGate,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 A.equal(d.productionBackendGate,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(d.releaseStatus,'HOLD');
 A.ok(d.ciEvidenceLimit.includes('cannot authenticate a human teacher'));
 A.equal(d.nextMilestone,
 'V193 require the owner\'s independently completed private teacher science/SLO decision or original NBF source pages before any claim of approval; other Unit7 private candidate QC can continue without publishing scored items');
 noSecrets(d,'index');
}
const d=load(INDEX);validate(d);
const v191=load('quality/unit07/unit07-v191-q25-private-review-readiness-no-keys.json');
const v190=load('quality/unit07/unit07-v190-offline-decision-contract-no-deploy.json');
const v189=load('quality/unit07/unit07-v189-two-candidate-slo-distractor-qc-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
A.equal(v191.version,'V191');A.equal(v191.sourceId,ID);
A.equal(v191.originalRowSha256,ORIG);
A.equal(v191.privateWorksheet.teacherDecisionFieldsPreFilled,false);
A.equal(v191.realTeacherScienceApprovals,0);
A.equal(v191.liveUnit7ScoredReleases,0);
A.equal(v190.version,'V190');A.equal(v190.realOwnerScoringApprovals,0);
A.equal(v189.version,'V189');
const old25=v189.items.find(x=>x.sourceId===ID),old22=v189.items.find(x=>x.sourceId==='XI-U07-T071-Q022');
A.ok(old25&&old22);
A.equal(old25.originalSourceRowSha256,ORIG);
A.equal(old25.v189IndividualRevisionChanged,true);
A.equal(old25.sloDirectAlignment,'PROMISING_DIRECT_STRUCTURE_DISTINCTION_TEACHER_PENDING');
A.equal(old25.studentScoredRelease,'HOLD');
A.equal(old22.sloDirectAlignment,'SUPPORTING_ONLY_NOT_DIRECT_SUMMATIVE_B22');
A.equal(v185.candidateRegistry.length,72);
const source=v185.candidateRegistry.find(x=>x.sourceId===ID);
A.ok(source);A.equal(source.originalSourceRowSha256,ORIG);
for(const x of v185.candidateRegistry){
 A.equal(x.candidateIndividualRevisionSha256,null);
 A.equal(x.eligibleForStudentScoredUse,false);
 A.equal(x.secureAuthenticatedApprovalAvailable,false);
 A.equal(x.scoredRelease,'HOLD');
}
const cat=load('portal/learning-catalog.json');
const unit7=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(unit7.status,'planned');A.equal(unit7.questionBankCount,0);
A.equal(unit7.assessmentStatus,'not-published');
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
const mutations=[
 x=>x.prerequisite.prNumber=294,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='ACADEMICALLY_APPROVED',
 x=>x.originalSourceRowSha256='0'.repeat(64),
 x=>x.originalOwnerSourceDocumentSha256='0'.repeat(64),
 x=>x.v192NewQuestionRevisionIssued=true,
 x=>x.existingPrivateCandidateRevisionPreserved=false,
 x=>x.privateReviewArtifact.sha256='0'.repeat(64),
 x=>x.privateReviewArtifact.renderedPages=2,
 x=>x.privateReviewArtifact.realReviewerFieldsAllBlank=false,
 x=>x.privateReviewArtifact.committedToPublicGithub=true,
 x=>x.privateReviewArtifact.correctOption='A',
 x=>x.scientificModelPrescreen.provisionalSlo='P-11-B-24',
 x=>x.scientificModelPrescreen.provisionalActualDemand='Application',
 x=>x.scientificModelPrescreen.independentOneBestAnswerModelAssessment='APPROVED',
 x=>x.scientificModelPrescreen.presentV189RevisionRequiresCompulsoryNewEdit=true,
 x=>x.scientificModelPrescreen.glassyNotExplicitInOptionsIsAutomaticDisqualification=true,
 x=>x.scientificModelPrescreen.independentHumanScienceApproval='APPROVED',
 x=>x.scientificModelPrescreen.independentHumanSloCognitiveApproval='APPROVED',
 x=>x.scientificModelPrescreen.publisherNbfUnit7TeachingPages113To116IndependentlyCheckedThisStage=true,
 x=>x.priorQ22ScopeGuard='DIRECT_SUMMATIVE',
 x=>x.unit7OriginalSourceItems=275,
 x=>x.distinctPrivateCandidatesReviewedPreviously=73,
 x=>x.authenticatedTeacherScienceApprovals=1,
 x=>x.authenticatedTeacherCognitiveApprovals=1,
 x=>x.actualOwnerScoringApprovals=1,
 x=>x.liveUnit7ScoredItems=1,
 x=>x.publicCandidateRevisionDigestStored=true,
 x=>x.publicCorrectAnswerOrOptionTextIncluded=true,
 x=>x.firebaseModified=true,
 x=>x.productionOrStagingDeployed=true,
 x=>x.scoredStudentBankModified=true,
 x=>x.releaseStatus='RELEASED',
 x=>x.answerKey='A',
 x=>x.nextMilestone='V193_RELEASE_TO_STUDENTS'
];
let blocked=0;
for(const mutate of mutations){
 const candidate=structuredClone(d);mutate(candidate);
 A.throws(()=>validate(candidate),undefined,'Fail-closed metadata test '+(blocked+1));
 blocked++;
}
const memo=read(MEMO).toLowerCase();
for(const marker of ['v192','q25','v189','short-range','glassy','amorphous',
 'p-11-b-22','summative','distractor','optional','teacher','pending',
 'hold','source','v160','v161','app check','v193']){
 A.ok(memo.includes(marker),'QC memo missing '+marker);
}
A.equal(memo.includes('6b6e6755015254b22f0b946f330df689dee34575ec9d5b102b2fd632718c60ae'),false);
const qa=path.join(ROOT,'qa-artifacts/grade11-v192-unit7-q25-adjudication');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V192',itemSourceId:ID,existingPrivateRevisionRetained:true,
 compulsoryNewRevisionRecommended:false,optionalDistractorWordings:2,
 privateDossierPages:3,authenticatedScienceApprovals:0,
 authenticatedCognitiveApprovals:0,ownerScoringApprovals:0,
 scoredUnit7Items:0,deniedPublicMetadataMutations:blocked,
 limitation:'PUBLIC_SOURCE_METADATA_ONLY_NO_PRIVATE_Q25_ANSWER_OR_TEACHER_SIGNOFF'
},null,2)+'\n');
console.log('V192 PASS: model source-bound Q25 disposition, '+blocked+
 ' adversarial metadata mutations denied, no private keys, no authenticated approvals or scored Unit7 releases.');
