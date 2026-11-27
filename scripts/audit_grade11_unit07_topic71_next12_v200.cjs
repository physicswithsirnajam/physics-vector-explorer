#!/usr/bin/env node
'use strict';
/** V200 public source-metadata QC; no keyed MCQ text or human approvals. */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const REG='quality/unit07/unit07-v200-topic71-next12-structure-source-slo-no-keys.json';
const MEMO='quality/grade11-v200-unit07-topic71-next12-structure-source-slo-qc.md';
const nums=[17,18,23,28,29,32,35,36,38,39,55,67];
const sha=["1f6622060c147f45435c064f64781f9fc51e1425bb8f6797935519af6080f0a0","1ed3dcd8884363e932047b4f5ab0bf55d175fa8b4639e912e300b40b136bc1ab","2623a99a3a3c969f83e82638912f1364a295d180604a74f3128ff87d8fb99700","de40ab0ceead2ea2e901b23cdd5d84e5057492a96899825c7301757c6aa2d555","dea7ba4b5ffd70f0a3504f72f3ae493d978c68d42bfec99ee37ea1e640aff10d","f4e97e949bf5ce87bd0159d38a1c28ca768225740836c75104d01775ba246103","3b69633ad4a24c69e4ca1a264ff64c40cace0ef3861ee98180345884c1df9ca6","b664ef0cc39fc75cccaee30fbab18b61617725e2f32302d1074f9e2f391e5ce1","9506f4c785c2545a6b88d66698730121136e358b0643093eae2f48120d84f979","3e9021bc13f7eaf908776130f4c6646b176c75d20984b9f4661e2e53073f6ba5","70853aa53d2fa713c6f617a74fff730233001cc75a0d9f457c508807680b306d","91d6a9a8abeecb4670614ede96b1f7bc54f1a1ab05cdb182bc342367e3b79e05"];
const cognitive=["Recall/Knowledge","Recall/Knowledge","Understanding_candidate","Understanding_candidate","Understanding_candidate","Understanding_candidate","Understanding_candidate","Understanding_candidate","Understanding_candidate","Understanding_candidate","Understanding_candidate","Understanding_candidate"];
const scopes=["CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","SUPPORTING_CHAPTER_DETAIL_REVIEW_FOR_BOARD","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION"];
const priorities=["STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW"];
const modelCategories=["SUPPORTING_TERM_ANISOTROPY_RECALL","SUPPORTING_TERM_ISOTROPY_RECALL","PROMISING_DIRECT_SINGLE_CRYSTAL_VS_POLYCRYSTAL_COMPARISON","SUPPORTING_GENERAL_CRYSTAL_STRUCTURE_DIVERSITY","PROMISING_DIRECT_POLYCRYSTAL_VS_AMORPHOUS_GRAIN_ORDER","SUPPORTING_NATURAL_VS_SYNTHETIC_POLYMER_ORIGIN","SUPPORTING_CRYSTAL_DIFFRACTION_PROPERTY_METHOD","PROMISING_DIRECT_IONIC_CRYSTAL_SCENARIO_WITH_WORDING_OPTION","PROMISING_DIRECT_GLASS_SOLID_WITHOUT_LONG_RANGE_ORDER","PROMISING_DIRECT_CRYSTALLINE_NACL_VS_AMORPHOUS_GLASS","SUPPORTING_CUBIC_LATTICE_IDENTIFICATION_WEAK_DISTRACTORS","PROMISING_DIRECT_RANDOM_GRAINS_APPROXIMATE_BULK_ISOTROPY"];
const actions=["OPTIONAL_APPLIED_DIRECTIONAL_PROPERTY_SCENARIO","OPTIONAL_MICROSTRUCTURAL_CAUSE_COMPARISON","NO_COMPULSORY_KEY_CHANGE_TEACHER_COGNITIVE_REVIEW","OPTIONAL_COMPARE_CRYSTAL_STRUCTURE_VARIANTS","NO_COMPULSORY_KEY_CHANGE_TEACHER_PENDING","OPTIONAL_POLYMER_CRYSTALLINITY_COMPARISON","OPTIONAL_DIFFRACTION_STRUCTURE_COMPARISON","OPTIONAL_SPECIFY_OPPOSITELY_CHARGED_IONS_IN_REGULAR_ARRAY","NO_COMPULSORY_KEY_CHANGE_TEACHER_PENDING","NO_COMPULSORY_KEY_CHANGE_TEACHER_PENDING","OPTIONAL_MORE_PLAUSIBLE_SOLID_STRUCTURE_DISTRACTORS","COMPULSORY_CLARIFY_APPROXIMATE_ISOTROPY_RANDOM_GRAIN_ASSUMPTIONS_BEFORE_DIRECT_SCORING"];
const pages=[113,113,113,113,113,114,113,113,114,114,115,113];
const forbidden=['question','questionText','stem','options','optionA','optionB','optionC','optionD',
 'correctOption','answerKey','answer','correctLetter','keyedExplanation','originalExplanation',
 'privateRevisedItemSha256','teacherEmail','studentEmail','teacherUid','studentUid',
 'studentScore','teacherAuthToken','signedDecision','originalWordBytes'];
function noSecrets(o,at){
 if(!o||typeof o!=='object')return;
 for(const f of forbidden)A.equal(Object.hasOwn(o,f),false,'forbidden key '+at+'.'+f);
 for(const [k,v] of Object.entries(o))if(v&&typeof v==='object')noSecrets(v,at+'.'+k);
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V200');
 A.equal(d.prerequisite.mergedPr,303);A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'b41a762bae894e7f4eb09dd44fa9278c1d2ab2db');
 A.equal(d.status,'ORIGINAL_12_SOURCE_MODEL_QC_TEACHER_UNAPPROVED_ZERO_PRIVATE_REVISIONS_ZERO_SCORED_RELEASE');
 A.equal(d.originalOwnerWord,'Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.docx');
 A.equal(d.originalWordSha256,'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58');
 A.equal(d.original80SourceLedger,'quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json');
 A.equal(d.existing80TeacherQueue,'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
 A.deepEqual(d.sourceNbfUnit7OriginalPdfSha256,
 ['0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9',
  '08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892']);
 A.deepEqual(d.verifiedNbfPrintedPages,[113,114,115]);
 A.equal(d.officialFramework,'FBISE HSSC-I Physics 2025');
 A.equal(d.officialSummativeSlo,'P-11-B-22');
 A.equal(d.officialCognitiveLevel,'Understanding');
 A.deepEqual(d.selectedOriginalIDs,nums);A.equal(d.selectedCount,12);
 A.equal(d.overlapsV185Queue,0);A.equal(d.overlapsV199Topic71PriorBatch,0);
 A.equal(d.overlapsV197OrV198,0);
 A.deepEqual(d.promisingDirectUnderstandingNumbers,[23,29,36,38,39,67]);
 A.deepEqual(d.supportingOrScopeSensitiveNumbers,[17,18,28,32,35,55]);
 A.equal(d.originalAnswerLetterErrorsIdentified,0);
 A.equal(d.sourceOriginalQuestionsOptionsExplanationsModified,false);
 A.equal(d.newPrivateRevisedCandidateItemsCreated,0);
 const c=d.sourceNuances;
 for(const k of ['polycrystallineIsNotSameAsPolymeric','crystallineGrainsRetainOrderEvenIfBulkIsotropic',
  'randomGrainsAreAConditionForApproximateIsotropy',
  'q36MentionOfMetalIonsIsNotCompleteIonicCompoundDefinition',
  'glassDoesNotRequireCrystallineLongRangeOrder','naturalSyntheticPolymerOriginNotCrystalOrder',
  'q55EasyNonSolidDistractorsOptionalEnhancement',
  'q35DiffractionMethodSupportingNotAutomaticallyDirectSlo'])A.equal(c[k],true);
 const p=d.privateArtifact;
 A.equal(p.docx,'Unit7_V200_PRIVATE_Topic71_Twelve_Original_Source_SLO_QC.docx');
 A.equal(p.docxSha256,'7a0a187b75682b02d3d5cf975a55cc0de4eb0e54e6edc9df943f365a95b1a881');
 A.equal(p.pdf,'Unit7_V200_PRIVATE_Topic71_Twelve_Original_Source_SLO_QC.pdf');
 A.equal(p.pdfSha256,'3abf1edd05e480cb731bdf0f7655d71e4b9fb88cacf0e066ca3a78c7905d22cf');
 A.equal(p.privateJsonSha256,'cb66a874dba4e45afec2e419f54beff3f2a1cf687a707f0700951c6c63597fad');
 A.equal(p.renderedPages,7);
 A.equal(p.visuallyChecked,true);
 A.equal(p.allHumanDecisionFieldsBlank,true);
 A.equal(p.privateKeysOrOriginalBookPageImagesInPublicRepo,false);
 A.equal(d.items.length,12);
 for(let i=0;i<nums.length;i++){
  const n=nums[i],r=d.items[i];
  A.equal(r.number,n);A.equal(r.sourceId,'XI-U07-T071-Q'+String(n).padStart(3,'0'));
  A.equal(r.originalFullRowSha256,sha[i]);
  A.equal(r.priorV154Cognitive,cognitive[i]);
  A.equal(r.priorV154Scope,scopes[i]);
  A.equal(r.priorV154FirstPassPriority,priorities[i]);
  A.equal(r.originalMappedSlo,'P-11-B-22');
  A.equal(r.officialSloCognition,'Understanding');
  A.equal(r.originalNbfPrintedPage,pages[i]);
  A.equal(r.modelDisposition,modelCategories[i]);
  A.equal(r.teacherAmendmentReview,actions[i]);
  A.equal(r.originalKeyOrOptionsModified,false);
  A.equal(r.privateRevisionIssued,false);
  A.equal(r.realHumanScienceDecision,'PENDING');
  A.equal(r.realHumanCognitiveDecision,'PENDING');
  A.equal(r.studentScoredRelease,'HOLD');
 }
 A.equal(d.originalUnit7QuestionInventory,274);
 A.equal(d.priorPrivatelyRevisedCandidateQueueCount,72);
 for(const v of ['v197PreviousOriginalOnlyQcCount','v198PreviousOriginalOnlyQcCount','v199PreviousOriginalOnlyQcCount'])A.equal(d[v],12);
 for(const k of ['authenticatedTeacherScienceDecisions','authenticatedTeacherCognitiveDecisions',
  'ownerScoredReleaseApprovals','scoredUnit7StudentQuestions'])A.equal(d[k],0);
 A.equal(d.existingV160BackendGate,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(d.existingV161BackendGate,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 for(const k of ['firebaseAuthOrFirestoreOrAppCheckChanged','originalQuestionBankOrSourceTextChanged',
  'studentTestBuilderChanged','stagingOrProductionDeployed'])A.equal(d[k],false);
 A.ok(d.ciLimit.includes('cannot independently read private keyed'));
 A.ok(d.nextMilestone.startsWith('V201'));
 noSecrets(d,'V200');
}
const d=load(REG);validate(d);
const v146=load('quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json');
const v154=load('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const v199=load('quality/unit07/unit07-v199-topic71-twelve-original-structure-slo-no-keys.json');
const v197=load('quality/unit07/unit07-v197-topic73-twelve-originals-source-slo-secondpass-no-keys.json');
const v198=load('quality/unit07/unit07-v198-topic72-twelve-unreviewed-source-slo-no-keys.json');
const v193=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
A.equal(v146.items.length,80);A.equal(v154.entries.length,80);
A.equal(v146.sourceDocxSha256,d.originalWordSha256);
A.equal(v154.sourceOriginalOwnerDocxSha256,d.originalWordSha256);
A.equal(v154.frameworkSlo,d.officialSummativeSlo);
A.equal(v154.frameworkTarget,d.officialCognitiveLevel);
A.equal(v185.candidateRegistry.length,72);A.equal(v185.studentScoredUnit7Items,0);
A.equal(v199.items.length,12);A.equal(v197.items.length,12);A.equal(v198.items.length,12);
A.deepEqual(v193.uploadedOriginalSources.map(x=>x.sha256),d.sourceNbfUnit7OriginalPdfSha256);
const older=new Set(v185.candidateRegistry.map(x=>x.sourceId));
const last=new Set([...v199.items,...v197.items,...v198.items].map(x=>x.sourceId));
for(let i=0;i<12;i++){
 const n=nums[i],x=d.items[i],a=v146.items[n-1],b=v154.entries[n-1];
 A.equal(a.sourceFullRowSha256,sha[i]);A.equal(b.originalFullRowSha256,sha[i]);
 A.equal(a.id,x.sourceId);A.equal(b.id,x.sourceId);
 A.equal(b.provisionalV148Cognitive,x.priorV154Cognitive);
 A.equal(b.provisionalV148Scope,x.priorV154Scope);
 A.equal(b.reviewQueuePriority,x.priorV154FirstPassPriority);
 A.equal(b.academicScienceDecision,'PENDING');
 A.equal(b.academicCognitiveDecision,'PENDING');
 A.equal(b.eligibleForScoredStudentRelease,false);
 A.equal(older.has(x.sourceId),false,'V200 duplicated V185 detailed candidate');
 A.equal(last.has(x.sourceId),false,'V200 duplicated V197/V198/V199 prior source batch');
}
for(const old of v185.candidateRegistry){
 A.equal(old.candidateIndividualRevisionSha256,null);
 A.equal(old.eligibleForStudentScoredUse,false);
 A.equal(old.scoredRelease,'HOLD');
}
const cat=load('portal/learning-catalog.json');
const unit=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(unit.status,'planned');A.equal(unit.questionBankCount,0);
A.equal(unit.assessmentStatus,'not-published');
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const changes=[
 x=>x.prerequisite.mergedPr=302,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='APPROVED',
 x=>x.originalWordSha256='0'.repeat(64),
 x=>x.sourceNbfUnit7OriginalPdfSha256[0]='0'.repeat(64),
 x=>x.officialCognitiveLevel='Knowledge',
 x=>x.selectedCount=13,
 x=>x.selectedOriginalIDs.pop(),
 x=>x.overlapsV185Queue=1,
 x=>x.promisingDirectUnderstandingNumbers.push(55),
 x=>x.supportingOrScopeSensitiveNumbers.pop(),
 x=>x.originalAnswerLetterErrorsIdentified=1,
 x=>x.newPrivateRevisedCandidateItemsCreated=12,
 x=>x.sourceNuances.randomGrainsAreAConditionForApproximateIsotropy=false,
 x=>x.sourceNuances.polycrystallineIsNotSameAsPolymeric=false,
 x=>x.privateArtifact.docxSha256='0'.repeat(64),
 x=>x.privateArtifact.pdfSha256='0'.repeat(64),
 x=>x.privateArtifact.allHumanDecisionFieldsBlank=false,
 x=>x.privateArtifact.privateKeysOrOriginalBookPageImagesInPublicRepo=true,
 x=>x.items.pop(),
 x=>x.items[0].number=16,
 x=>x.items[1].originalFullRowSha256='0'.repeat(64),
 x=>x.items[2].priorV154Cognitive='Unknown',
 x=>x.items[3].modelDisposition='DIRECT_APPROVED',
 x=>x.items[4].teacherAmendmentReview='APPROVED',
 x=>x.items[5].originalKeyOrOptionsModified=true,
 x=>x.items[6].privateRevisionIssued=true,
 x=>x.items[7].realHumanScienceDecision='APPROVED',
 x=>x.items[8].realHumanCognitiveDecision='APPROVED',
 x=>x.items[9].studentScoredRelease='RELEASED',
 x=>x.items[10].answerKey='A',
 x=>x.priorPrivatelyRevisedCandidateQueueCount=84,
 x=>x.authenticatedTeacherScienceDecisions=1,
 x=>x.authenticatedTeacherCognitiveDecisions=1,
 x=>x.ownerScoredReleaseApprovals=1,
 x=>x.scoredUnit7StudentQuestions=1,
 x=>x.existingV160BackendGate='GO',
 x=>x.firebaseAuthOrFirestoreOrAppCheckChanged=true,
 x=>x.studentTestBuilderChanged=true,
 x=>x.stagingOrProductionDeployed=true,
 x=>x.nextMilestone='RELEASE_TO_STUDENTS'
];
let blocked=0;
for(const change of changes){
 const m=structuredClone(d);change(m);
 A.throws(()=>validate(m),undefined,'Fail-closed source/score mutation '+(blocked+1));blocked++;
}
const memo=read(MEMO).toLowerCase();
for(const term of ['v200','v199','v154','v146','v185','polycrystalline','polymeric','isotropy',
 'anisotropy','q23','q29','q36','q38','q39','q67','crystalline','amorphous',
 'teacher','pending','hold','no-go','v201'])
 A.ok(memo.includes(term),'V200 memo missing '+term);
const qa=path.join(ROOT,'qa-artifacts/grade11-v200-topic71-next12-original-qc');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V200',originalTopic71SecondPassSourceIds:12,
 originalShaMatchedV146V154:12,overlapsV185:0,overlapsV197V198V199:0,
 promisingDirectUnderstanding:6,supportingOrScopeSensitive:6,
 incorrectlyKeyedOriginalsDetected:0,teacherAuthenticatedDecisions:0,
 ownerScoredPermissions:0,scoredUnit7Questions:0,
 adversarialChangesDenied:blocked,
 note:'PUBLIC_CI_PRESERVES_PRIVATE_ANSWER_KEYS_AND_CANNOT_AUTHENTICATE_TEACHER'
},null,2)+'\n');
console.log('V200 PASS: 12 new original source identities, '+blocked+' denied mutations, correct microstructure scope, 0 approvals/releases.');
