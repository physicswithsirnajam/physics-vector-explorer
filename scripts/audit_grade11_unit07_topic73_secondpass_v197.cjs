#!/usr/bin/env node
'use strict';
/*
 * V197 source-safe public audit. No original stem/options/answer/key is present.
 * Source verification and human science conclusions occurred in PRIVATE file.
 * Public CI only checks pinned identities, official outcome scope and release HOLD.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const REG='quality/unit07/unit07-v197-topic73-twelve-originals-source-slo-secondpass-no-keys.json';
const DOC='quality/grade11-v197-topic73-12-original-mcq-source-slo-secondpass-qc.md';
const selected=[2,8,21,27,38,40,50,51,59,60,72,80];
const supporting=[2,8,21,27,38,40,72],direct=[50,51,59,60,80];
const scopes=[
 'SUPPORTING_ONLY_COGNITIVE_U_B28_A','SUPPORTING_ONLY_COGNITIVE_K_B27_A',
 'SUPPORTING_ONLY_COGNITIVE_U_B27_A','SUPPORTING_ONLY_NONLINEAR_WORK_CONCEPT',
 'SUPPORTING_ONLY_REVERSED_GRAPH_AXIS_CONCEPT','SUPPORTING_ONLY_ELASTIC_STRAIN_ENERGY_EXPLANATION',
 'PROMISING_DIRECT_APPLICATION_SCALING_OVERLAP','PROMISING_DIRECT_APPLICATION_CANDIDATE',
 'PROMISING_DIRECT_NBF_EXAMPLE_7_3','PROMISING_DIRECT_NBF_ASSIGNMENT_7_3',
 'SUPPLEMENTARY_GRAPH_LOAD_MASS_TO_FORCE_CONVERSION',
 'PROMISING_DIRECT_GRAPH_AXES_WITH_DUPLICATE_WATCH'
];
const actions=[
 'COMPULSORY_SCOPE_BEFORE_DIRECT_SCORING','COMPULSORY_SCOPE_BEFORE_DIRECT_SCORING',
 'COMPULSORY_SCOPE_BEFORE_DIRECT_SCORING','COMPULSORY_DEMAND_REVIEW_BEFORE_DIRECT_SCORING',
 'COMPULSORY_AXIS_QUALIFICATION_AND_DEMAND_REVIEW',
 'COMPULSORY_DEMAND_REVIEW_OPTIONAL_QUALIFIER',
 'NO_COMPULSORY_ANSWER_CORRECTION_SELECT_OVERLAP',
 'NO_COMPULSORY_ANSWER_CORRECTION_TEACHER_PENDING',
 'NO_COMPULSORY_ANSWER_CORRECTION_TEACHER_PENDING',
 'NO_COMPULSORY_ANSWER_CORRECTION_TEACHER_PENDING',
 'COMPULSORY_SLO_SUITABILITY_BEFORE_SCORING_OPTIONAL_REMAP',
 'NO_COMPULSORY_SCIENCE_CORRECTION_DUPLICATE_SELECTION'
];
const expectedOriginalShas=["30a24efef37382194ffa35ce4fcb275c00ea39cb41822ab36f4a1651656deaba","fa9ebb1b011ccf0cc4c17290c3d52fb92dc78d461a9876f104a9ec75eda59974","c2a7b2d600b3284bb5d227cf48e203172d9b092604659885d8eb81cc02dbc694","663d2597c860e2d8844ef030c23170e6a2307ea979aad83f73568ca1c9d955f1","d20aa361debd95548e17cd910caa9494661408a165fd04ec1853e8daf1a91d67","1650c86de6ab0a2823b00f7cf6757ef09b6d571e5b8b92e0273e1ff4a9b2cfac","90764b232fdf5c2dc8a141a9f0769597b2b7d79ece76b94286c8fee4e1643763","7f4289edd5e64ba359527980be9b503e811fd6f5d5abd46b1a70267c7c35e2d3","b9c59419d0c8b6b16e2f44f2942b854fb4ac82d376ee1cdc73e10c5e0c9cd9a1","28ad6fed4259b954e983ee836e1a59945ac665cea71bd86cf80095492fa443b2","17b9b776cce3daa5c2ed11325a50d45719379be2e721aa2e87b4a75198927822","fcb3d04a2417ed70f7265b6927cb6878d8540913e285cef324d9a38b12e00fea"];
const expectedAuthorCognition=["U","K","U","U","U","U","A","A","A","A","A","A"];
const expectedMappedSlo=["P-11-B-28","P-11-B-27","P-11-B-27","P-11-B-27","P-11-B-27","P-11-B-27","P-11-B-28","P-11-B-28","P-11-B-28","P-11-B-28","P-11-B-25","P-11-B-27"];
const blockedKeys=[
 'stem','question','questionText','options','optionA','optionB','optionC','optionD',
 'correctOption','answer','answerKey','keyedExplanation','originalExplanation',
 'correctAnswer','privateRevisionSha256','candidateRevisionSha256','studentUid',
 'teacherUid','studentEmail','teacherEmail','authenticationToken'
];
function noLeaks(x,where){
 if(x===null||typeof x!=='object')return;
 for(const k of blockedKeys)A.equal(Object.hasOwn(x,k),false,'keyed secret forbidden at '+where+'.'+k);
 for(const [k,v] of Object.entries(x))if(v&&typeof v==='object')noLeaks(v,where+'.'+k);
}
function check(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V197');
 A.equal(d.prerequisite.prNumber,300);A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'a1c91193f1a21b194d48ad80aa834fac5a277c54');
 A.equal(d.status,'TWELVE_REAL_ORIGINAL_SOURCE_ITEMS_MODEL_QC_TEACHER_PENDING_NO_NEW_REVISIONS_NO_SCORED_RELEASE');
 A.equal(d.originalSourceWordFilename,'Grade11_Unit7_Topic7.3_PartA_80MCQs_Study_With_Answers.docx');
 A.equal(d.originalSourceWordSha256,'f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279');
 A.equal(d.originalTopic73V173PublicRegister,'quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
 A.deepEqual(d.originalNbfUnit7PrimaryScansSha256,['0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9','08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892']);
 A.deepEqual(d.directlyReopenedBookPrintedPages,[122,123,124]);
 A.equal(d.officialFramework,'FBISE Physics HSSC-I 2025 / Inclusive Scheme 2024');
 A.equal(d.officialFrameworkUrl,'https://fbise.edu.pk/ModelPaper/2025/Assessment%20Frameworks/HSSC-I/Final%20Assessment%20Framework%20Model%20Question%20Paper%20Physics%20HSSC-I.pdf');
 A.deepEqual(d.officialSummativeSloCognition,{
  'P-11-B-25':'Understanding','P-11-B-27':'Application','P-11-B-28':'Application'});
 A.equal(d.sourceSelectedOriginalItemCount,12);
 A.equal(d.sourceSelectedPreviouslyInV18572CandidateQueue,0);
 A.equal(d.sourceSelectedNewPrivateCandidateRevisionsIssued,0);
 A.equal(d.sourceOriginalAnswerLetterErrorsIdentified,0);
 A.deepEqual(d.promisingDirectApplicationNumbers,direct);
 A.deepEqual(d.supportingOrScopeSensitiveNumbers,supporting);
 A.equal(d.originalUnit7InventoryCount,274);
 A.equal(d.previouslyDetailedPrivateCandidateQueueCount,72);
 A.equal(d.unreviewedForDetailedPrivateCandidatesRemaining,202);
 A.equal(d.v197SecondPassSourceAuditCount,12);
 for(const k of ['topic73OriginalWordModified','v173OriginalSourceRegistryModified','v185PreviouslyReviewedQueueModified'])A.equal(d[k],false);
 const p=d.privateArtifacts;
 A.equal(p.privateDocxFilename,'Unit7_V197_PRIVATE_Topic73_Twelve_Item_Source_SLO_QC.docx');
 A.equal(p.privateDocxSha256,'f485bde41fb6074d2bcf4b6084bb8fe89b26ed5c613004b54d3d8e510039af1a');
 A.equal(p.privatePdfFilename,'Unit7_V197_PRIVATE_Topic73_Twelve_Item_Source_SLO_QC.pdf');
 A.equal(p.privatePdfSha256,'ae6e46048291a8e3bab445b7fbe000badaf057455d5d4661a5651aaf243730e0');
 A.equal(p.privateOriginalItemJsonFilename,'Unit7_V197_PRIVATE_12_Original_Items_Source_Review.json');
 A.equal(p.privateOriginalItemJsonSha256,'92078c483ab925536c95456d8f649d76257859b6c85b65ffc7f6a3522ffed981');
 A.equal(p.renderedPages,8);A.equal(p.visuallyChecked,true);
 A.equal(p.privateFilesPublishedToGitHub,false);
 A.equal(p.originalQuestionOptionsAndKeysPublic,false);
 const src=d.sourceSpecificChecks;
 A.deepEqual(src.figure714ReversedAxesWarningApplies,[38,80]);
 A.equal(src.question38And80PreviousDuplicateWatch,true);
 A.equal(src.question50EnergyScalingFollowsSquareLaw,true);
 A.equal(src.priorQ56AlreadyInV185QueueExcludedFromFreshSelection,true);
 A.equal(src.question59Example73FromTextbookPp123To124,true);
 A.equal(src.question60Assignment73FromTextbookP124,true);
 A.equal(src.question72SourceScopeOriginallyOptionalRemap,true);
 A.equal(src.sourceExactKeyedTextReopenedPrivately,true);
 A.equal(src.allTwelveOptionsAndExistingCorrectLettersCrossCheckedAgainstOwnerWord,true);
 A.equal(src.allMathematicalKeysModelChecked,true);
 A.equal(src.officialCognitiveMismatchIsNotProofOfWrongPhysicsAnswer,true);
 A.equal(d.items.length,12);
 A.deepEqual(d.items.map(x=>x.sourceNumber),selected);
 A.deepEqual(d.items.map(x=>x.v197ReviewDisposition),scopes);
 A.deepEqual(d.items.map(x=>x.v197TeacherAction),actions);
 for(let i=0;i<12;i++){
  const r=d.items[i],n=selected[i];
  A.equal(r.sourceId,'XI-U07-T073-Q'+String(n).padStart(3,'0'));
  A.match(r.originalPrivateFullRowSha256,/^[0-9a-f]{64}$/);
  A.equal(r.originalPrivateFullRowSha256,expectedOriginalShas[i]);
  A.equal(r.originalAuthorCognitive,expectedAuthorCognition[i]);
  A.equal(r.originalMappedSlo,expectedMappedSlo[i]);
  A.equal(r.originalQuestionKeyOrExplanationEdited,false);
  A.equal(r.originalKeyFoundWrong,false);
  A.equal(r.studentScoredRelease,'HOLD');
  A.equal(r.authenticatedTeacherScienceApproval,'PENDING');
  A.equal(r.authenticatedTeacherCognitiveApproval,'PENDING');
  A.equal(r.officialSummativeCognitive,d.officialSummativeSloCognition[r.originalMappedSlo]);
  A.equal(r.textbookPrintedPage,(n===2||n===40||n===50||n===51)?123:(n===59||n===60?124:122));
  if(direct.includes(n)){A.equal(r.originalAuthorCognitive,'A');}
 }
 for(const k of ['realTeacherScienceApprovals','realTeacherCognitiveApprovals',
 'realOwnerStudentScoringApprovals','liveUnit7ScoredQuestionCount'])A.equal(d[k],0);
 A.equal(d.v160BackendDecision,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(d.v161BackendDecision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 A.equal(d.noFirebaseAuthOrAppCheckChanges,true);
 A.equal(d.noStudentPortalOrLiveBankChanges,true);
 A.ok(d.ciLimit.includes('does not include privately keyed'));
 A.ok(d.nextMilestone.startsWith('V198'));
 noLeaks(d,'index');
}
const d=load(REG);check(d);
const v173=load('quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const v196=load('quality/unit07/unit07-v196-numerical-scaling-regression-hold.json');
const v193=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
A.equal(v173.version,'V173');A.equal(v173.originalSourceFirstPassRowCount,80);
A.equal(v173.originalPrivateWordSha256,d.originalSourceWordSha256);
A.equal(v185.version,'V185');A.equal(v185.candidateRegistry.length,72);
A.equal(v196.version,'V196');A.equal(v196.unit7StudentScoredReleases,0);
A.equal(v193.version,'V193');A.deepEqual(v193.uploadedOriginalSources.map(x=>x.sha256),d.originalNbfUnit7PrimaryScansSha256);
const reviewed=new Set(v185.candidateRegistry.map(x=>x.sourceId));
A.equal(reviewed.size,72);
for(const item of d.items){
 const x=v173.originalRowSourceRegistry[item.sourceNumber-1];
 A.ok(x,'source row missing');
 A.equal(x.number,item.sourceNumber);
 A.equal(x.originalPrivateFullRowSha256,item.originalPrivateFullRowSha256);
 A.equal(x.sourceMappedSlo,item.originalMappedSlo);
 A.equal(x.sourceAuthorDemand,item.originalAuthorCognitive);
 A.equal(x.previousReviewPriority,item.priorV173Priority);
 A.equal(x.teacherScienceSignoff,'PENDING');
 A.equal(x.studentScoredRelease,'HOLD');
 A.equal(reviewed.has(item.sourceId),false,'V197 must select only previously unqueued original IDs');
}
A.equal(v173.sourceReferencesToExamplesWithAllNumericalInputs.includes(59),true);
A.equal(v173.sourceReferencesToExamplesWithAllNumericalInputs.includes(60),true);
A.equal(v173.sourceEnergyDensityEnrichmentNumbers.includes(56),true);
A.equal(reviewed.has('XI-U07-T073-Q056'),true);
A.equal(d.items.some(x=>x.sourceNumber===56),false);
A.equal(v173.duplicateWatchGroups.some(x=>x.ids.includes(38)&&x.ids.includes(80)),true);
for(const r of v185.candidateRegistry){
 A.equal(r.candidateIndividualRevisionSha256,null);
 A.equal(r.eligibleForStudentScoredUse,false);
 A.equal(r.scoredRelease,'HOLD');
}
const unit=load('portal/learning-catalog.json').grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(unit.status,'planned');A.equal(unit.assessmentStatus,'not-published');A.equal(unit.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const bad=[
 x=>x.prerequisite.prNumber=299,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='SCORED',
 x=>x.originalSourceWordSha256='0'.repeat(64),
 x=>x.sourceSelectedOriginalItemCount=13,
 x=>x.sourceSelectedPreviouslyInV18572CandidateQueue=1,
 x=>x.sourceSelectedNewPrivateCandidateRevisionsIssued=12,
 x=>x.sourceOriginalAnswerLetterErrorsIdentified=1,
 x=>x.promisingDirectApplicationNumbers.push(56),
 x=>x.supportingOrScopeSensitiveNumbers.pop(),
 x=>x.previouslyDetailedPrivateCandidateQueueCount=84,
 x=>x.items.pop(),
 x=>x.items[0].sourceNumber=3,
 x=>x.items[1].originalPrivateFullRowSha256='0'.repeat(64),
 x=>x.items[2].originalAuthorCognitive='A',
 x=>x.items[3].v197ReviewDisposition='PROMISING_DIRECT_APPLICATION_CANDIDATE',
 x=>x.items[4].v197TeacherAction='TEACHER_APPROVED',
 x=>x.items[5].studentScoredRelease='RELEASED',
 x=>x.items[6].originalQuestionKeyOrExplanationEdited=true,
 x=>x.items[7].originalKeyFoundWrong=true,
 x=>x.items[8].correctOption='A',
 x=>x.items[9].authenticatedTeacherScienceApproval='APPROVED',
 x=>x.items[10].authenticatedTeacherCognitiveApproval='APPROVED',
 x=>x.privateArtifacts.privateFilesPublishedToGitHub=true,
 x=>x.privateArtifacts.privateDocxSha256='0'.repeat(64),
 x=>x.privateArtifacts.renderedPages=7,
 x=>x.sourceSpecificChecks.question38And80PreviousDuplicateWatch=false,
 x=>x.sourceSpecificChecks.priorQ56AlreadyInV185QueueExcludedFromFreshSelection=false,
 x=>x.topic73OriginalWordModified=true,
 x=>x.realTeacherScienceApprovals=1,
 x=>x.realTeacherCognitiveApprovals=1,
 x=>x.realOwnerStudentScoringApprovals=1,
 x=>x.liveUnit7ScoredQuestionCount=1,
 x=>x.noFirebaseAuthOrAppCheckChanges=false,
 x=>x.noStudentPortalOrLiveBankChanges=false,
 x=>x.nextMilestone='RELEASE_TO_STUDENT'
];
let denied=0;
for(const fn of bad){const m=structuredClone(d);fn(m);A.throws(()=>check(m),undefined,'tampered academic record '+(denied+1));denied++;}
const memo=read(DOC).toLowerCase();
for(const word of ['v197','v173','v185','twelve','12','p-11-b-25','p-11-b-27',
'p-11-b-28','summative','application','understanding','q38','q80','q56','q72',
'0.050','0.191','0.020','glassy'.replace('glassy','force'),'graph',
'private','pending','hold','no-go','v198'])
 A.ok(memo.includes(word),'memo missing expected academic term '+word);
const qa=path.join(ROOT,'qa-artifacts/grade11-v197-topic73-twelve-source-secondpass');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V197',selectedPreviouslyUnqueuedOriginalItems:12,
 sourceOriginalWordHashVerifiedLocallyClaimed:true,
 publicIdentitiesComparedAgainstV173:12,previouslyInV185PrivateCandidateQueue:0,
 directApplicationCandidates:4,supportingOrScopeSensitive:8,
 sourceAnswerLettersRevised:0,newCandidateRevisions:0,scoredUnit7Releases:0,
 academicTeacherApprovals:0,privacyOrReleaseMutationsDenied:denied,
 limitation:'PUBLIC_CI_DOES_NOT_READ_PRIVATE_WORD_KEYS_OR_AUTHENTICATE_TEACHER'
},null,2)+'\n');
console.log('V197 PASS: 12 NEW unqueued original source rows, 4 promising direct A / 8 supporting-scope-sensitive; '+denied+' denied tampering mutations; 0 teacher signoffs or scored releases.');
