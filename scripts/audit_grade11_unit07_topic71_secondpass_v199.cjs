#!/usr/bin/env node
'use strict';
/*
 * V199 PUBLIC review-metadata test. We deliberately DO NOT load owner-keyed
 * original Word/question/options. CI does not authenticate a human teacher
 * or authorize student scoring. All source hashes pinned independently below.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const FILE='quality/unit07/unit07-v199-topic71-twelve-original-structure-slo-no-keys.json';
const MEMO='quality/grade11-v199-unit7-topic71-twelve-original-structure-science-qc.md';
const nums=[2,3,8,9,13,21,24,26,33,34,50,61];
const pinnedSha=["d170bef1d0d4f5797a6fa7c052e74a7c72ac2ff9437aa80ce94b9aed9e9abc8a","ebc8a5ddab1d9286b445794d1d76e0bb9a8d3a1625661eb70f284458da80a701","7ca05d64f06bfc485b3d3877dc1b14ad870ec7595088996ae306c5adddeb382e","152045357ae0274860396c77fd042379df7544c816843e53210ef4f3f9fb2cf2","c7b84c79893a669ccb9a49fe8344b8d0995a8c37a1c21519fd996dddc299946c","484c774c5e14afbbe3e759bcf033ad5fccbaeb01465fea8b01dd54435d3c6ff4","fa8ae0ed737b3358e7f7ae7762a213e370e6b34f755f3f8750a365218acb9a8a","3cce7dc8ea48d7e8aa5d4411790165c07a1e0c30f295d1ecca568e3d4774fc27","ef4cac3d4d61b7b6f9412f1d084254c6358ed3da0f41f0e84fbcd3d0cd012fdb","2046e7314007a1f51a307149f820eccfef68f0678d8b6457bec8ec4ddc41a40a","a57e9890c791849f328ddb8a54525eaa973f63ccbdc0da99116d314220dce0a4","a34dd2708de319ce6ec3d9869f621a8b05611ce64d0e816bc2974f642dd5dec3"];
const pinnedCog=["Understanding_candidate","Understanding_candidate","Recall/Knowledge","Recall/Knowledge","Understanding_candidate","Understanding_candidate","Understanding_candidate","Understanding_candidate","Understanding_candidate","Understanding_candidate","Understanding_candidate","Understanding_candidate"];
const pinnedScope=["CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","SUPPORTING_CHAPTER_DETAIL_REVIEW_FOR_BOARD","CORE_STRUCTURE_DISTINCTION","CORE_STRUCTURE_DISTINCTION","SUPPORTING_CHAPTER_DETAIL_REVIEW_FOR_BOARD","CORE_STRUCTURE_DISTINCTION"];
const pinnedPriority=["STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","OPTIONAL_SOURCE_OR_DISTRACTOR_REFINEMENT","OPTIONAL_SOURCE_OR_DISTRACTOR_REFINEMENT","STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","STANDARD_PER_ITEM_TEACHER_REVIEW","OPTIONAL_SOURCE_OR_DISTRACTOR_REFINEMENT","OPTIONAL_SOURCE_OR_DISTRACTOR_REFINEMENT","COGNITIVE_RECLASSIFICATION_REVIEW","COGNITIVE_RECLASSIFICATION_REVIEW","OPTIONAL_SOURCE_OR_DISTRACTOR_REFINEMENT"];
const categories=[
 'SUPPORTING_DEFINITION_RECALL_BELOW_DIRECT_B22_UNDERSTANDING',
 'PROMISING_DIRECT_POLYCRYSTAL_STRUCTURE_DISTINCTION_COGNITIVE_REVIEW',
 'SUPPLEMENTARY_MONOMER_WORD_NOT_PRINTED_ON_NBF_P114',
 'SUPPORTING_POLYMERIZATION_VOCABULARY_RECALL',
 'SUPPORTING_CRYSTAL_CONSTITUENT_RECALL',
 'SUPPORTING_ANISOTROPY_PROPERTY_REASONING',
 'PROMISING_DIRECT_GLASSY_AMORPHOUS_STRUCTURE_DISTINCTION',
 'SUPPORTING_UNIT_CELL_CRYSTAL_LATTICE_ADVANCED_PRECISION',
 'PROMISING_DIRECT_LONG_RANGE_ORDER_INFERENCE_OPTIONAL_WORDING',
 'SUPPORTING_CRYSTALLITE_GRAIN_SYNONYM_RECALL',
 'SUPPORTING_SEVEN_CRYSTAL_SYSTEMS_KNOWLEDGE_RECLASSIFICATION',
 'PROMISING_DIRECT_NACL_STRUCTURE_SCENARIO_DISTRACTOR_REFINEMENT'
];
const actions=[
 'OPTIONAL_REWORK_AS_STRUCTURE_COMPARISON_FOR_DIRECT_SUMMATIVE',
 'COMPULSORY_TEACHER_REAL_COGNITIVE_AND_TERMINOLOGY_CHECK',
 'OPTIONAL_NBF_SMALL_MOLECULES_VOCABULARY_ALIGNMENT',
 'OPTIONAL_APPLIED_POLYMER_STRUCTURE_VARIANT',
 'OPTIONAL_PLAUSIBLE_DISTRACTORS_AND_CATEGORY_COMPARISON',
 'COMPULSORY_DIRECT_SLO_SCOPE_JUDGMENT_BEFORE_SCORING',
 'NO_COMPULSORY_SCIENCE_CORRECTION_TEACHER_PENDING',
 'OPTIONAL_LATTICE_BASIS_UNIT_CELL_PRECISION',
 'OPTIONAL_LONG_RANGE_ATOMIC_PERIODICITY_WORDING',
 'COMPULSORY_COGNITIVE_RECALL_SCOPE_REVIEW_BEFORE_DIRECT_SCORING',
 'COMPULSORY_V154_U_TO_RECALL_DEMAND_REVIEW_BEFORE_DIRECT_SCORING',
 'OPTIONAL_STRENGTHEN_DISTRACTORS_TEACHER_PENDING'
];
const pages=[113,113,114,114,113,113,114,115,114,113,116,113];
const privateFields=['question','questionText','originalStem','stem','optionA','optionB','optionC',
 'optionD','options','correctLetter','correctOption','answerKey','answer','originalExplanation',
 'keyedExplanation','privateCandidateRevisionSha256','studentUid','teacherUid','authToken',
 'teacherEmail','studentEmail','signedTeacherVerdict','individualPrivateAnswerKey'];
function noSecrets(o,where){
 if(!o||typeof o!=='object')return;
 for(const f of privateFields)A.equal(Object.hasOwn(o,f),false,'Forbidden public keyed field '+where+'.'+f);
 for(const [k,v] of Object.entries(o))if(v&&typeof v==='object')noSecrets(v,where+'.'+k);
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V199');
 A.equal(d.prerequisite.mergedPr,302);A.equal(d.prerequisite.confirmedMerged,true);
 A.equal(d.prerequisite.mergeSha,'0601a1fe3236bc6956dab76e14de716f1a66a5a2');
 A.equal(d.status,'EXACT_ORIGINAL_12_SOURCE_MODEL_QC_NO_HUMAN_SIGNOFF_NO_PRIVATE_REVISIONS_NO_SCORES');
 A.equal(d.originalOwnerWord,'Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.docx');
 A.equal(d.originalOwnerWordSha256,'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58');
 A.equal(d.existingOriginalSourceLedger,'quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json');
 A.equal(d.existingOriginal80ReviewQueue,'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
 A.deepEqual(d.originalNbfFullUnitScanSha256,['0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9',
  '08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892']);
 A.deepEqual(d.primarySourceOriginalPrintedPages,[113,114,115,116]);
 A.equal(d.officialFramework,'FBISE HSSC-I Physics 2025');
 A.equal(d.officialSlo,'P-11-B-22');
 A.equal(d.officialSloAssessment,'Summative theory');
 A.equal(d.officialSloCognitive,'Understanding');
 A.equal(d.originalSelectedCount,12);
 A.equal(d.selectedPreviouslyInV18572,0);
 A.equal(d.selectedPreviouslyInV197OrV198,0);
 A.deepEqual(d.promisingDirectSourceNumbers,[3,24,33,61]);
 A.deepEqual(d.supportingOrScopeSensitiveNumbers,[2,8,9,13,21,26,34,50]);
 A.equal(d.sourceIncorrectOriginalAnswerLettersFound,0);
 A.equal(d.sourceOriginalQuestionsKeysAndExplanationsChanged,false);
 A.equal(d.newRevisedPrivateCandidatesCreated,0);
 const c=d.nuancedSourceCautions;
 for(const f of ['p113ErroneousPolycrystallinePolymericSynonymRequiresTeachingCorrection',
 'p114SeparatelyDefinesPolymerChainFormation','p114AmorphousGlassyOverlapSourceVerified',
 'p115LatticeUnitCellBasisAdvancedDistinction','p116SevenCrystalSystemsEdgeAnglesSourceVerified',
 'q3PotentialDefinitionRecallDespiteStructuralAlternatives',
 'q8MonomerTermScientificallyValidButNotDirectNbfWord','q33LongRangeLatticePhraseOptionalPrecision',
 'q50PriorV154CognitiveReclassificationWatch','q61WeakUnrelatedDistractorsOptionalImprovement'])A.equal(c[f],true);
 const p=d.privateReviewArtifact;
 A.equal(p.docx,'Unit7_V199_PRIVATE_Topic71_Twelve_Original_Source_SLO_QC.docx');
 A.equal(p.docxSha256,'5ed0378eec4d41dfc5cae51803b34e97a273450ba86218ad92ef929b3dd3a09a');
 A.equal(p.pdf,'Unit7_V199_PRIVATE_Topic71_Twelve_Original_Source_SLO_QC.pdf');
 A.equal(p.pdfSha256,'ec23428a892186b8c4fb57af265f07d0815c5c6adc89aea028cacb24594edec2');
 A.equal(p.privateJsonSha256,'ed880009154a5d1a1d10c63c325263362ef700a31dec3d29d68c2a6cc3d9a0b7');
 A.equal(p.pageCount,7);A.equal(p.renderedAndVisuallyChecked,true);
 A.equal(p.allTeacherDecisionFieldsBlank,true);A.equal(p.privateKeysNotCommittedToPublicGithub,true);
 A.equal(d.items.length,12);
 for(let i=0;i<12;i++){
  const x=d.items[i],n=nums[i];
  A.equal(x.sourceNumber,n);
  A.equal(x.sourceId,'XI-U07-T071-Q'+String(n).padStart(3,'0'));
  A.equal(x.originalFullRowSha256,pinnedSha[i]);
  A.equal(x.priorV154Cognitive,pinnedCog[i]);
  A.equal(x.priorV154Scope,pinnedScope[i]);
  A.equal(x.priorV154Priority,pinnedPriority[i]);
  A.equal(x.originalSlo,'P-11-B-22');
  A.equal(x.officialCognitiveTarget,'Understanding');
  A.equal(x.primaryTextbookPrintedPage,pages[i]);
  A.equal(x.modelReviewClassification,categories[i]);
  A.equal(x.teacherFollowup,actions[i]);
  A.equal(x.originalCorrectLetterChanged,false);
  A.equal(x.originalOptionsOrExplanationChanged,false);
  A.equal(x.independentHumanScienceDecision,'PENDING');
  A.equal(x.independentHumanCognitiveDecision,'PENDING');
  A.equal(x.scoredRelease,'HOLD');
 }
 A.equal(d.unit7OriginalSourceUniverse,274);
 A.equal(d.prior72DetailedPrivateCandidateQueue,72);
 A.equal(d.previousV197SourceOnlySecondPass,12);
 A.equal(d.previousV198SourceOnlySecondPass,12);
 for(const k of ['realAuthenticatedScienceApprovals','realAuthenticatedCognitiveApprovals',
 'ownerScoringPermissions','scoredUnit7StudentItems'])A.equal(d[k],0);
 A.equal(d.teacherBackendV160,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(d.teacherBackendV161,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 for(const k of ['firebaseAuthFirestoreOrAppCheckChanged','studentScoredQuestionBankChanged',
 'stagingOrProductionDeployed'])A.equal(d[k],false);
 A.ok(d.ciAssuranceBoundary.includes('cannot inspect confidential'));
 A.ok(d.nextMilestone.startsWith('V200'));
 noSecrets(d,'V199');
}
const data=load(FILE);validate(data);
const v146=load('quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json');
const v154=load('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const v197=load('quality/unit07/unit07-v197-topic73-twelve-originals-source-slo-secondpass-no-keys.json');
const v198=load('quality/unit07/unit07-v198-topic72-twelve-unreviewed-source-slo-no-keys.json');
const v193=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
A.equal(v146.items.length,80);
A.equal(v146.sourceDocxSha256,data.originalOwnerWordSha256);
A.equal(v154.entries.length,80);
A.equal(v154.sourceOriginalOwnerDocxSha256,data.originalOwnerWordSha256);
A.equal(v154.frameworkSlo,data.officialSlo);
A.equal(v154.frameworkTarget,data.officialSloCognitive);
A.equal(v185.candidateRegistry.length,72);A.equal(v185.studentScoredUnit7Items,0);
A.equal(v197.items.length,12);A.equal(v198.items.length,12);
A.deepEqual(v193.uploadedOriginalSources.map(x=>x.sha256),data.originalNbfFullUnitScanSha256);
const alreadyReviewed=new Set(v185.candidateRegistry.map(x=>x.sourceId));
const pastBatch=new Set([...v197.items,...v198.items].map(x=>x.sourceId));
for(let i=0;i<12;i++){
 const item=data.items[i],n=nums[i],source=v146.items[n-1],old=v154.entries[n-1];
 A.equal(source.id,item.sourceId);
 A.equal(source.sourceFullRowSha256,item.originalFullRowSha256);
 A.equal(old.id,item.sourceId);
 A.equal(old.originalFullRowSha256,item.originalFullRowSha256);
 A.equal(old.provisionalV148Cognitive,item.priorV154Cognitive);
 A.equal(old.provisionalV148Scope,item.priorV154Scope);
 A.equal(old.academicScienceDecision,'PENDING');
 A.equal(old.academicCognitiveDecision,'PENDING');
 A.equal(old.eligibleForScoredStudentRelease,false);
 A.equal(alreadyReviewed.has(item.sourceId),false,'Selected source is already in V185 review queue');
 A.equal(pastBatch.has(item.sourceId),false,'Selected source was part of V197/V198');
}
for(const x of v185.candidateRegistry){
 A.equal(x.candidateIndividualRevisionSha256,null);
 A.equal(x.eligibleForStudentScoredUse,false);
 A.equal(x.scoredRelease,'HOLD');
}
const portal=load('portal/learning-catalog.json');
const unit=portal.grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
A.equal(unit.status,'planned');A.equal(unit.assessmentStatus,'not-published');A.equal(unit.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const attacks=[
 x=>x.prerequisite.mergedPr=301,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='ACADEMICALLY_APPROVED',
 x=>x.originalOwnerWordSha256='0'.repeat(64),
 x=>x.originalNbfFullUnitScanSha256[0]='0'.repeat(64),
 x=>x.officialSloCognitive='Knowledge',
 x=>x.originalSelectedCount=13,
 x=>x.selectedPreviouslyInV18572=1,
 x=>x.promisingDirectSourceNumbers.push(21),
 x=>x.supportingOrScopeSensitiveNumbers.pop(),
 x=>x.sourceIncorrectOriginalAnswerLettersFound=1,
 x=>x.newRevisedPrivateCandidatesCreated=12,
 x=>x.nuancedSourceCautions.p113ErroneousPolycrystallinePolymericSynonymRequiresTeachingCorrection=false,
 x=>x.nuancedSourceCautions.q61WeakUnrelatedDistractorsOptionalImprovement=false,
 x=>x.privateReviewArtifact.docxSha256='0'.repeat(64),
 x=>x.privateReviewArtifact.pageCount=8,
 x=>x.privateReviewArtifact.allTeacherDecisionFieldsBlank=false,
 x=>x.privateReviewArtifact.privateKeysNotCommittedToPublicGithub=false,
 x=>x.items.pop(),
 x=>x.items[0].sourceNumber=1,
 x=>x.items[1].originalFullRowSha256='0'.repeat(64),
 x=>x.items[2].priorV154Cognitive='Understanding_candidate',
 x=>x.items[3].modelReviewClassification='DIRECT',
 x=>x.items[4].teacherFollowup='APPROVED',
 x=>x.items[5].originalCorrectLetterChanged=true,
 x=>x.items[6].originalOptionsOrExplanationChanged=true,
 x=>x.items[7].independentHumanScienceDecision='APPROVED',
 x=>x.items[8].independentHumanCognitiveDecision='APPROVED',
 x=>x.items[9].scoredRelease='RELEASED',
 x=>x.items[10].answerKey='B',
 x=>x.unit7OriginalSourceUniverse=275,
 x=>x.prior72DetailedPrivateCandidateQueue=84,
 x=>x.realAuthenticatedScienceApprovals=1,
 x=>x.realAuthenticatedCognitiveApprovals=1,
 x=>x.ownerScoringPermissions=1,
 x=>x.scoredUnit7StudentItems=1,
 x=>x.firebaseAuthFirestoreOrAppCheckChanged=true,
 x=>x.studentScoredQuestionBankChanged=true,
 x=>x.stagingOrProductionDeployed=true,
 x=>x.teacherBackendV160='GO',
 x=>x.nextMilestone='DEPLOY_NOW'
];
let denied=0;
for(const f of attacks){const bad=structuredClone(data);f(bad);A.throws(()=>validate(bad),undefined,'Adversarial source/score change '+(denied+1));denied++;}
const memo=read(MEMO).toLowerCase();
for(const w of ['v199','v154','v146','v185','v197','v198','polycrystalline','polymeric',
 'monomer','polymerization','amorphous','glassy','lattice','unit cell','anisotropy',
 'q3','q24','q33','q61','summative','understanding','teacher','pending','hold','no-go','v200'])
 A.ok(memo.includes(w),'missing V199 academic memo term '+w);
const out=path.join(ROOT,'qa-artifacts/grade11-v199-topic71-twelve-source-qc');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
 version:'V199',originalTopic71SourceRowsSelected:12,
 originalSourceFingerprintsVerifiedAgainstV146V154:12,
 overlapWithEarlier72PrivateCandidates:0,overlapWithV197V198:0,
 promisingDirectUnderstandingCandidates:4,supportingOrScopeSensitive:8,
 incorrectOriginalAnswerLettersFoundInModelReview:0,
 sourceQuestionsOrKeysEdited:false,authenticatedAcademicApprovals:0,
 scoredUnit7QuestionReleases:0,metadataTamperingAttacksDenied:denied,
 note:'PUBLIC_CI_DOES_NOT_INSPECT_PRIVATE_KEYED_WORD_OR_AUTHENTICATE_REAL_TEACHERS'
},null,2)+'\n');
console.log('V199 PASS: 12 exact new Topic7.1 original sources, '+denied+' fail-closed source/approval mutations, science caution preserved and zero scored Unit7 items.');
