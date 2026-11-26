#!/usr/bin/env node
'use strict';
/**
 * V189: PUBLIC METADATA ONLY.
 * Actual original/candidate question wording and private SHA remain private.
 * A passing test does not attest the science or authenticate a teacher.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const INDEX='quality/unit07/unit07-v189-two-candidate-slo-distractor-qc-no-keys.json';
const MEMO='quality/grade11-v189-unit07-two-private-candidate-slo-distractor-review.md';
const SOURCE_ID=['XI-U07-T071-Q022','XI-U07-T071-Q025'];
const ORIGINAL_SHA=[
'4632066b3e8eff54029b85cebfdebb823f9e3364e64cb9c15b0905691c1e0dd3',
'27d9b15ebe860eca6b4788d6420db4230e6266295027ef01d28ca2383a7f5353'
];
const PRIVATE_KEYS=[
'stem','originalStem','question','questionText','originalQuestion','options',
'sourceOptions','candidateOptions','correctOption','answerKey','correctAnswer',
'answerLetter','originalAnswer','newAnswer','keyLetter','fullExplanation',
'workedSolution','actualPrivateCandidateRevisionSha256','candidateRevisionSha256',
'privateInputBytesSha256','privateJsonContent','rawDocxBytes','authenticatedTeacherIdentity',
'studentUid','studentEmail','teacherUid','teacherEmail','authenticationToken'
];
function noPrivate(v,label){
 if(!v||typeof v!=='object')return;
 for(const k of PRIVATE_KEYS)A.equal(Object.hasOwn(v,k),false,'private payload '+label+'.'+k);
 for(const [k,val] of Object.entries(v)){
  if(typeof val==='object'&&val!==null)noPrivate(val,label+'.'+k);
 }
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V189');
 A.equal(d.prerequisite.prNumber,292);
 A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'e61222adfc433a6fd0d455374789c1ace3ba040e');
 A.equal(d.status,'TWO_PRIVATE_CANDIDATE_MODEL_ACADEMIC_REVIEW_NOT_TEACHER_SIGNOFF_ALL_SCORED_HOLD');
 const s=d.sourceEvidence;
 A.equal(s.originalTopic71DocxSha256,'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58');
 A.equal(s.v184PrivateTeacherPackSha256,'c63f8ed1c9fe68d3e331971e258d2b2104da58a098ca8b2975a83c16b6356980');
 A.equal(s.v188PrivateInputAvailableAndReviewed,true);
 A.equal(s.v188PrivateManifestAvailableAndReviewed,true);
 A.equal(s.officialFrameworkVersion,'FBISE_HSSC_I_2025');
 A.equal(s.officialFrameworkPdf,'https://fbise.edu.pk/ModelPaper/2025/Assessment%20Frameworks/HSSC-I/Final%20Assessment%20Framework%20Model%20Question%20Paper%20Physics%20HSSC-I.pdf');
 A.equal(s.officialOutcomeCode,'P-11-B-22');
 A.equal(s.officialOutcomeSummary,'Distinguish structures of crystalline, glassy, amorphous and polymeric solids');
 A.equal(s.officialAssessmentType,'Summative');
 A.equal(s.officialCognitive,'Understanding');
 A.equal(s.originalNbfChapterPp113To116DirectlyInspected,false);
 A.equal(s.fullFBISEFrameworkClaimedNewestBeyond2025,false);
 A.equal(s.teacherOrPublisherAttestation,false);
 A.equal(d.originalSourceUniverse,274);
 A.equal(d.existingDetailedPrivateCandidateQueue,72);
 A.equal(d.priorV188PrivateCandidateCount,2);
 A.equal(d.v189PrivatePilotedCandidateCount,2);
 A.equal(d.v189RevisedCandidateCount,1);
 A.equal(d.actualIndividualDigestOrPrivateAnswerPublished,false);
 A.equal(d.publicPriorV185ApprovalStateChanged,false);
 A.equal(d.items.length,2);
 const scopes=['SUPPORTING_ONLY_NOT_DIRECT_SUMMATIVE_B22','PROMISING_DIRECT_STRUCTURE_DISTINCTION_TEACHER_PENDING'];
 const issue=['CONDITIONALLY_DEFENSIBLE_RANDOM_GRAIN_ORIENTATIONS_APPROXIMATE_ISOTROPY',
  'DEFENSIBLE_AMORPHOUS_SHORT_RANGE_ORDER_WITHOUT_EXTENDED_PERIODICITY'];
 const distractor=['RETAIN_FOR_SUPPORTING_STUDY_NOT_FINAL_SCORED',
  'V188_TWO_DISTRACTORS_TOO_WEAK_REVISED_SEPARATELY_IN_V189'];
 const priority=['COMPULSORY_SLO_SCOPE_BEFORE_SCORING','COMPULSORY_DISTRACTOR_QC_BEFORE_SCORING'];
 for(let i=0;i<2;i++){
  const r=d.items[i];
  A.equal(r.sourceId,SOURCE_ID[i]);A.equal(r.originalSourceRowSha256,ORIGINAL_SHA[i]);
  A.equal(r.priorPrivateReviewVersion,'V184');
  A.equal(r.v188IndividualRevisionRetainedPrivate,true);
  A.equal(r.v189IndividualRevisionChanged,i===1);
  A.equal(r.scientificModelPrescreen,issue[i]);
  A.equal(r.sloProposed,'P-11-B-22');
  A.equal(r.sloDirectAlignment,scopes[i]);
  A.equal(r.cognitive,'Understanding');
  A.equal(r.distractorAssessment,distractor[i]);
  A.equal(r.recommendationPriority,priority[i]);
  A.equal(r.originalOwnerSourcePreserved,true);
  A.equal(r.teacherScienceApproval,'PENDING');
  A.equal(r.teacherCognitiveApproval,'PENDING');
  A.equal(r.ownerScoringApproval,'PENDING');
  A.equal(r.secureAuthenticatedApproval,false);
  A.equal(r.studentScoredRelease,'HOLD');
 }
 const p=d.privateArtifactHandling;
 A.equal(p.teacherReviewDocx,'Unit7_V189_Private_Two_Item_Academic_QC.docx');
 A.equal(p.privateCandidateJson,'V189_PRIVATE_2_Candidate_Revision_Proposal.json');
 A.equal(p.privateReviewManifest,'V189_PRIVATE_2_Candidate_Revision_Manifest.json');
 for(const k of ['filesOnlyInConversationNotGitHub'])A.equal(p[k],true);
 for(const k of ['actualRevisedStemAndOptionsCommitted','actualKeyAndExplanationCommitted',
 'actualPrivateCandidateRevisionDigestsCommitted','automatedTeacherSignoffOrStudentImport'])
  A.equal(p[k],false);
 const g=d.currentReleaseInvariants;
 for(const k of ['realIndividualTeacherScienceApprovals','realIndividualTeacherCognitiveApprovals',
  'realOwnerScoringApprovals','scoredUnit7StudentItems'])A.equal(g[k],0);
 A.equal(g.teacherBackendV160,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(g.teacherBackendV161,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 A.equal(g.v185PublicPerItemDigestsRemainNull,true);
 A.equal(g.firebaseEdited,false);A.equal(g.liveScoredBankEdited,false);
 A.ok(d.ciLimit.includes('cannot independently recompute withheld'));
 A.equal(d.nextMilestone,'V190 plan owner-controlled private individual revision review and item-level authenticated decision binding, with Q22 supporting scope and Q25 revised distractors explicitly pending; no student scoring');
 noPrivate(d,'index');
}
const d=load(INDEX);validate(d);
const old=load('quality/unit07/unit07-v188-private-two-item-pilot-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const v184=load('quality/unit07/unit07-v184-batch06-twelve-originals-last-compulsory-private-review-no-keys.json');
A.equal(old.version,'V188');A.equal(old.selectedSources.length,2);
A.equal(v185.candidateRegistry.length,72);
A.equal(v184.rows.length,12);
for(let i=0;i<2;i++){
 const id=SOURCE_ID[i],original=old.selectedSources[i];
 const source=v185.candidateRegistry.find(x=>x.sourceId===id);
 const review=v184.rows.find(x=>x.id===id);
 A.ok(source&&review);
 A.equal(original.sourceId,id);A.equal(original.originalSourceRowSha256,ORIGINAL_SHA[i]);
 A.equal(source.originalSourceRowSha256,ORIGINAL_SHA[i]);
 A.equal(review.sourceOriginalFullRowSha256,ORIGINAL_SHA[i]);
 A.equal(source.priorPrivatePackVersion,'V184');
 A.equal(source.candidateIndividualRevisionSha256,null);
 A.equal(source.eligibleForStudentScoredUse,false);A.equal(source.scoredRelease,'HOLD');
 A.equal(original.studentScoredRelease,'HOLD');A.equal(review.scoredRelease,'HOLD');
}
for(const r of v185.candidateRegistry){
 A.equal(r.candidateIndividualRevisionSha256,null);
 A.equal(r.eligibleForStudentScoredUse,false);A.equal(r.scoredRelease,'HOLD');
}
for(const k of ['individualTeacherScienceApprovals','individualTeacherCognitiveApprovals',
 'individualTeacherScoringApprovals','studentScoredUnit7Items'])A.equal(v185[k],0);
const cat=load('portal/learning-catalog.json');
const unit=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(unit.status,'planned');A.equal(unit.assessmentStatus,'not-published');
A.equal(unit.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
 'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const mutations=[
 x=>x.prerequisite.prNumber=291,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='APPROVED_TO_SCORE',
 x=>x.sourceEvidence.officialOutcomeCode='P-11-B-24',
 x=>x.sourceEvidence.officialCognitive='Application',
 x=>x.sourceEvidence.officialAssessmentType='Formative',
 x=>x.sourceEvidence.teacherOrPublisherAttestation=true,
 x=>x.sourceEvidence.originalNbfChapterPp113To116DirectlyInspected=true,
 x=>x.sourceEvidence.fullFBISEFrameworkClaimedNewestBeyond2025=true,
 x=>x.originalSourceUniverse=275,
 x=>x.existingDetailedPrivateCandidateQueue=73,
 x=>x.v189RevisedCandidateCount=2,
 x=>x.actualIndividualDigestOrPrivateAnswerPublished=true,
 x=>x.publicPriorV185ApprovalStateChanged=true,
 x=>x.items.pop(),
 x=>x.items[0].sourceId='XI-U07-T071-Q999',
 x=>x.items[0].originalSourceRowSha256='0'.repeat(64),
 x=>x.items[0].sloDirectAlignment='PROMISING_DIRECT_STRUCTURE_DISTINCTION_TEACHER_PENDING',
 x=>x.items[0].studentScoredRelease='RELEASED',
 x=>x.items[1].v189IndividualRevisionChanged=false,
 x=>x.items[1].teacherScienceApproval='APPROVED',
 x=>x.items[0].teacherCognitiveApproval='APPROVED',
 x=>x.items[1].ownerScoringApproval='APPROVED',
 x=>x.items[0].correctOption='A',
 x=>x.items[0].candidateRevisionSha256='1'.repeat(64),
 x=>x.privateArtifactHandling.actualPrivateCandidateRevisionDigestsCommitted=true,
 x=>x.privateArtifactHandling.actualKeyAndExplanationCommitted=true,
 x=>x.currentReleaseInvariants.realIndividualTeacherScienceApprovals=1,
 x=>x.currentReleaseInvariants.realIndividualTeacherCognitiveApprovals=1,
 x=>x.currentReleaseInvariants.realOwnerScoringApprovals=1,
 x=>x.currentReleaseInvariants.scoredUnit7StudentItems=1,
 x=>x.currentReleaseInvariants.firebaseEdited=true,
 x=>x.currentReleaseInvariants.v185PublicPerItemDigestsRemainNull=false,
 x=>x.nextMilestone='V190_SCORE_QUESTIONS'
];
let denied=0;
for(const mut of mutations){
 const c=structuredClone(d);mut(c);
 A.throws(()=>validate(c),undefined,'Mutation '+(denied+1)+' passed academic/scored hold');
 denied++;
}
const memo=read(MEMO).toLowerCase();
for(const term of ['v189','b-22','summative','understanding','polymeric','q022','q025','distractor',
 'not approved','pending','hold','v188','v184','2025','private','v160','v161','v190']){
 A.ok(memo.includes(term),'Memo missing '+term);
}
const qa=path.join(ROOT,'qa-artifacts/grade11-v189-two-candidate-academic-qc');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V189',sourceBoundItems:2,modelPrescreenedItems:2,
 directB22ApprovedItems:0,privateNewQ25RevisionClaimed:1,
 actualPrivateHashContentVerifiedByCI:false,individualTeacherScienceApprovals:0,
 individualTeacherCognitiveApprovals:0,ownerScoringApprovals:0,
 scoredUnit7Items:0,deniedMetadataMutations:denied
},null,2)+'\n');
console.log('V189 PASS: two source-consistent private academic review references; '+denied+
 ' fail-closed mutations; no authentic teacher approval, no scored Unit7 release.');
