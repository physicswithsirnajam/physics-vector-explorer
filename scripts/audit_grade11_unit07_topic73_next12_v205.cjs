#!/usr/bin/env node
'use strict';
/* V205 PUBLIC QC metadata verifier, never load owner original keyed Word or PDF.
 * Source SHA metadata and human PENDING / scored HOLD are independently pinned.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const INDEX='quality/unit07/unit07-v205-topic73-original12-experiment-source-slo-hold-no-keys.json';
const MEMO='quality/grade11-v205-unit07-topic73-original12-experiment-science-slo-qc.md';
const numbers=[5,11,13,17,36,44,54,61,62,66,69,77];
const pinnedShas=["1bab9a499db49850eafa2a33a38a1f3e9ab691a3faed4288f3a2b5fd499e8089","453fe7915172778ea76b3e4301efe3a49d802073621194ce422305ae78261445","de853f3f18bd21a7c8ebc90ffaf2f3df156eb71d63462a7bbef7f5407a6359d2","2a173b52ae56ae3df309701688d1560a019a856ac06a0517bc9bfaf278bb4d2d","510fae2e80cdfb137c9dcb02b76485fd6b7db9a68d399868a414b272eedc366d","042d0db7b2936313c9ca3698691e8e0c1359cd4c26b756958b771b97483d65a9","2f7ccf452425606cc9ab389a7e9637a8069c0257614dc0d77769a9d3c9e5d679","d993cfbf677595d6ad9ab357a2593e167e54d6fd1b2662befb376f03898d4c91","cc717b37554e4790304f0001d539db0f17c01facf8da4a512b3757348193e01d","5c8bc6de123352ab40abff02155250c99bc1ec7cc2c92d0497cb9bd01d4aa311","39d9fd41d78f1b72003e27a003228941ab192526cd581ebb36c344c830a1ff95","4ea7895e46fe3dc1cac4092a3b044d44ff8c9000ff8f59a1864ca34a8e176531"];
const pinnedSlo=["P-11-B-25","P-11-B-28","P-11-B-28","P-11-B-28","P-11-B-27","P-11-B-28","P-11-B-25","P-11-B-25","P-11-B-25","P-11-B-28","P-11-B-25","P-11-B-27"];
const pinnedCognition=["K","K","K","K","U","A","A","A","A","U","U","A"];
const pinnedScope=["direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","supporting-or-cross-slo-teacher-decision","supplementary-or-teacher-remap","supplementary-or-teacher-remap","supplementary-or-teacher-remap","direct-topic-candidate","direct-topic-candidate"];
const pinnedPriority=["optional","none","optional","none","optional","none","optional","optional","optional","none","none","none"];
const pinnedCategories=["SUPPORTING_EXPERIMENT_LOAD_WEIGHT_RECALL_BELOW_B25_U","SUPPORTING_JOULE_UNIT_RECALL_BELOW_B28_A","SUPPORTING_STRAIN_ENERGY_TERMINOLOGY_BELOW_B28_A","SUPPORTING_ELASTIC_ENERGY_EQUATION_RECALL_BELOW_B28_A","SUPPORTING_LINEAR_LOADING_EXPLANATION_BELOW_B27_A","PROMISING_DIRECT_B28_STIFFNESS_EXTENSION_ENERGY","CROSS_SLO_B25_VS_B24_WIRE_EXTENSION_NUMERICAL","CROSS_SLO_B25_VS_B24_LENGTH_SCALING_APPLICATION","CROSS_SLO_B25_VS_B24_AREA_SCALING_APPLICATION","SUPPORTING_CONCEPTUAL_ENERGY_TRANSFER_BELOW_B28_A","BORDERLINE_B25_GAUGE_LENGTH_RECALL_VS_U","PROMISING_DIRECT_B27_TRIANGULAR_WORK_CALCULATION"];
const pinnedActions=["COMPULSORY_B25_COGNITIVE_DEMAND_REVIEW_FOR_DIRECT_SCORE","COMPULSORY_B28_APPLICATION_DEMAND_REVIEW","COMPULSORY_B28_APPLICATION_DEMAND_REVIEW","COMPULSORY_B28_APPLICATION_DEMAND_REVIEW","COMPULSORY_B27_APPLICATION_DEMAND_REVIEW","NO_KEY_CORRECTION_INDEPENDENT_TEACHER_REVIEW_PENDING","COMPULSORY_EXPERIMENT_B25_VS_MODULUS_B24_SCOPE_REVIEW","COMPULSORY_EXPERIMENT_B25_VS_MODULUS_B24_SCOPE_REVIEW","COMPULSORY_EXPERIMENT_B25_VS_MODULUS_B24_SCOPE_REVIEW","COMPULSORY_B28_DIRECT_APPLICATION_SCOPE_REVIEW","COMPULSORY_B25_ACTUAL_UNDERSTANDING_VS_RECALL_DECISION","NO_KEY_CORRECTION_INDEPENDENT_TEACHER_REVIEW_PENDING"];
const printedPages=[122,123,123,123,122,123,122,122,122,123,122,122];
const hidden=['stem','question','questionText','options','optionA','optionB','optionC','optionD',
 'answerKey','answer','correctOption','correctLetter','originalAnswerLetter',
 'keyedExplanation','ownerExplanation','fullOwnerWord','originalOptions',
 'studentUid','teacherUid','studentEmail','teacherEmail','authToken',
 'teacherSignature','privateCandidateRevisionSha256','originalPdfPageImage'];
function denyPrivate(x,where) {
 if(x===null||typeof x!=='object')return;
 for(const field of hidden)A.equal(Object.hasOwn(x,field),false,'PRIVATE content at '+where+'.'+field);
 for(const [k,v] of Object.entries(x))if(v&&typeof v==='object')denyPrivate(v,where+'.'+k);
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V205');
 A.deepEqual(d.prerequisite,{mergedPr:308,merged:true,mergeSha:'2d31fbf6ffc8556ab1b71edbd6972732d01ce6a2'});
 A.equal(d.status,'ORIGINAL_SOURCE_MODEL_QC_ONLY_ZERO_TEACHER_APPROVAL_ZERO_SCORED_RELEASE');
 A.equal(d.originalOwnerWord,'Grade11_Unit7_Topic7.3_PartA_80MCQs_Study_With_Answers.docx');
 A.equal(d.originalOwnerWordSha256,'f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279');
 A.equal(d.originalSourceRegister,'quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
 A.deepEqual(d.originalNbfScansSha256,['0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9',
 '08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892']);
 A.deepEqual(d.reopenedNbfPrintedPages,[122,123]);
 A.equal(d.framework,'FBISE HSSC-I Physics 2025 / Inclusive Scheme of Studies 2024');
 A.deepEqual(d.officialSummativeSloCognition,{'P-11-B-25':'Understanding','P-11-B-27':'Application','P-11-B-28':'Application'});
 A.deepEqual(d.originalSourceNumbers,numbers);A.equal(d.originalSourceSelectedCount,12);
 A.equal(d.alreadyInV185Private72Count,0);A.equal(d.alreadyInV197OrV201OrV204SourceQCCount,0);
 A.deepEqual(d.promisingDirectApplicationNumbers,[44,77]);
 A.deepEqual(d.experimentalCognitiveBorderlineNumbers,[69]);
 A.deepEqual(d.crossSloExperimentNumbers,[54,61,62]);
 A.deepEqual(d.supportingRecallOrConceptNumbers,[5,11,13,17,36,66]);
 A.equal(d.incorrectOriginalAnswerLettersFound,0);
 A.equal(d.sourceOwnerQuestionBankChanged,false);A.equal(d.newPrivateRevisedCandidatesCreated,0);
 for(const key of [
  'q5SourceDescribesHangingLoadWeightButNotExplicitMgFormula',
  'q11AndQ13AreRecallNotDirectB28Application',
  'q17CorrectEquationButDemandKNotB28Application',
  'q36LinearLoadingFromZeroAverageForceCaveat',
  'q44SquaredExtensionSIConversionChecked',
  'q54WireExtensionUsesMeasuredAreaLengthAndYoungModulus',
  'q61AndQ62ProportionalReasoningCrossB25ExperimentalScope',
  'q62AreaNotDiameterDoubled',
  'q66ElasticToKineticExampleIsGeneralPhysicsBeyondOriginalPage',
  'q69OriginalUnloadedGaugeLengthSourceVerified',
  'q77TriangularForceExtensionAreaCalculationVerified',
  'sourceFig714ForceHorizontalExtensionVertical',
  'nonlinearReversedGraphAreaNotPhysicalWork',
  'allOriginalCorrectLettersCrosscheckedWithOwnerWord'
 ]) A.equal(d.sourceCautions[key],true);
 const p=d.privateAcademicPack;
 A.equal(p.docx,'Unit7_V205_PRIVATE_Topic73_Twelve_Original_Source_SLO_QC.docx');
 A.equal(p.docxSha256,'aee766033c0b61c49281c3eb18ba281db6ed3647aefaa55275d11a0a69bd7dd1');
 A.equal(p.pdf,'Unit7_V205_PRIVATE_Topic73_Twelve_Original_Source_SLO_QC.pdf');
 A.equal(p.pdfSha256,'3b9456bdd8ae105e384033056007faf33bcc91d0086ab91b227219dd95bde002');
 A.equal(p.privateKeyedWorkingJsonSha256,'0527d0945ebecf8bb1db81b33da169d793ef0746ddda5767e14a0de91d862f05');
 A.equal(p.renderedPages,7);A.equal(p.visuallyInspected,true);
 A.equal(p.independentTeacherDecisionsBlank,true);A.equal(p.privateKeyedOriginalsCommittedToPublicRepo,false);
 A.equal(d.items.length,12);
 for(let i=0;i<numbers.length;i++){
  const x=d.items[i],n=numbers[i];
  A.equal(x.sourceNumber,n);A.equal(x.sourceId,'XI-U07-T073-Q'+String(n).padStart(3,'0'));
  A.equal(x.originalPrivateFullRowSha256,pinnedShas[i]);
  A.equal(x.originalSlo,pinnedSlo[i]);A.equal(x.originalAuthorCognitive,pinnedCognition[i]);
  A.equal(x.priorV173Scope,pinnedScope[i]);A.equal(x.priorV173Priority,pinnedPriority[i]);
  A.equal(x.officialSummativeCognitive,d.officialSummativeSloCognition[x.originalSlo]);
  A.equal(x.textbookPrintedPage,printedPages[i]);
  A.equal(x.modelAcademicDisposition,pinnedCategories[i]);
  A.equal(x.teacherAction,pinnedActions[i]);
  A.equal(x.originalQuestionOptionsKeyChanged,false);A.equal(x.privateRevisedItemIssued,false);
  A.equal(x.authenticatedTeacherScience,'PENDING');A.equal(x.authenticatedTeacherCognitive,'PENDING');
  A.equal(x.scoredStudentUse,'HOLD');
 }
 A.equal(d.originalUnit7SourceInventoryCount,274);
 A.equal(d.priorV185PrivateDetailedCandidateCount,72);
 A.equal(d.previousTopic73SourceOnlyQCCount,36);
 A.equal(d.remainingTopic73NotInV185OrFourSourceQCBatches,6);
 for(const key of ['authenticatedTeacherScienceApprovals','authenticatedTeacherCognitiveApprovals',
 'ownerScoredReleasePermissions','scoredUnit7StudentItems'])A.equal(d[key],0);
 A.equal(d.teacherBackendV160,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(d.teacherBackendV161,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 for(const key of ['firebaseAuthRulesAppCheckEdited','studentBankOrTestBuilderEdited',
 'stagingOrProductionDeployment'])A.equal(d[key],false);
 A.ok(d.ciLimitation.includes('cannot inspect the private original'));
 A.ok(d.nextMilestone.startsWith('V206'));denyPrivate(d,'V205');
}
const d=load(INDEX);validate(d);
const v173=load('quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const v197=load('quality/unit07/unit07-v197-topic73-twelve-originals-source-slo-secondpass-no-keys.json');
const v201=load('quality/unit07/unit07-v201-topic73-next12-energy-source-slo-no-keys.json');
const v204=load('quality/unit07/unit07-v204-topic73-twelve-original-work-energy-slo-hold-no-keys.json');
const v193=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
A.equal(v173.version,'V173');A.equal(v173.originalSourceFirstPassRowCount,80);
A.equal(v173.originalPrivateWordSha256,d.originalOwnerWordSha256);
A.equal(v173.originalRowSourceRegistry.length,80);
A.equal(v185.candidateRegistry.length,72);
A.equal(v197.items.length,12);A.equal(v201.items.length,12);A.equal(v204.items.length,12);
A.deepEqual(v193.uploadedOriginalSources.map(x=>x.sha256),d.originalNbfScansSha256);
const previous=new Set([
 ...v185.candidateRegistry.map(x=>x.sourceId),
 ...v197.items.map(x=>x.sourceId),
 ...v201.items.map(x=>x.sourceId),
 ...v204.items.map(x=>x.sourceId)
]);
A.equal(previous.size,108,'V185 72 + three disjoint previous twelve-item Topic7.3 batches must total 108 source identities');
for(const x of d.items){
 const prev=v173.originalRowSourceRegistry[x.sourceNumber-1];
 A.equal(prev.number,x.sourceNumber);
 A.equal(prev.originalPrivateFullRowSha256,x.originalPrivateFullRowSha256);
 A.equal(prev.sourceMappedSlo,x.originalSlo);
 A.equal(prev.sourceAuthorDemand,x.originalAuthorCognitive);
 A.equal(prev.previousReviewScope,x.priorV173Scope);
 A.equal(prev.previousReviewPriority,x.priorV173Priority);
 A.equal(prev.teacherScienceSignoff,'PENDING');A.equal(prev.studentScoredRelease,'HOLD');
 A.equal(previous.has(x.sourceId),false,'V205 source ID already in V185, V197, V201, V204');
}
for(const x of v185.candidateRegistry){
 A.equal(x.candidateIndividualRevisionSha256,null);
 A.equal(x.eligibleForStudentScoredUse,false);
 A.equal(x.scoredRelease,'HOLD');
}
const remaining=v173.originalRowSourceRegistry.filter(x=>!previous.has('XI-U07-T073-Q'+String(x.number).padStart(3,'0'))&&!d.items.some(z=>z.sourceNumber===x.number));
A.equal(remaining.length,6);
const u7=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const attacks=[
 x=>x.prerequisite.mergedPr=307,x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='ACADEMICALLY_APPROVED',x=>x.originalOwnerWordSha256='0'.repeat(64),
 x=>x.originalNbfScansSha256[0]='0'.repeat(64),
 x=>x.officialSummativeSloCognition['P-11-B-28']='Knowledge',
 x=>x.originalSourceNumbers.pop(),x=>x.originalSourceSelectedCount=13,
 x=>x.alreadyInV185Private72Count=1,x=>x.alreadyInV197OrV201OrV204SourceQCCount=1,
 x=>x.promisingDirectApplicationNumbers.push(54),
 x=>x.experimentalCognitiveBorderlineNumbers.pop(),
 x=>x.crossSloExperimentNumbers.push(69),
 x=>x.supportingRecallOrConceptNumbers.pop(),
 x=>x.incorrectOriginalAnswerLettersFound=1,x=>x.newPrivateRevisedCandidatesCreated=12,
 x=>x.sourceCautions.q62AreaNotDiameterDoubled=false,
 x=>x.sourceCautions.nonlinearReversedGraphAreaNotPhysicalWork=false,
 x=>x.privateAcademicPack.docxSha256='0'.repeat(64),
 x=>x.privateAcademicPack.independentTeacherDecisionsBlank=false,
 x=>x.privateAcademicPack.privateKeyedOriginalsCommittedToPublicRepo=true,
 x=>x.items.pop(),x=>x.items[0].sourceNumber=6,
 x=>x.items[1].originalPrivateFullRowSha256='0'.repeat(64),
 x=>x.items[2].originalAuthorCognitive='A',
 x=>x.items[3].modelAcademicDisposition='APPROVED',
 x=>x.items[4].teacherAction='GO',
 x=>x.items[5].originalQuestionOptionsKeyChanged=true,
 x=>x.items[6].privateRevisedItemIssued=true,
 x=>x.items[7].authenticatedTeacherScience='APPROVED',
 x=>x.items[8].authenticatedTeacherCognitive='APPROVED',
 x=>x.items[9].scoredStudentUse='RELEASED',
 x=>x.items[10].answerKey='C',
 x=>x.originalUnit7SourceInventoryCount=275,
 x=>x.remainingTopic73NotInV185OrFourSourceQCBatches=5,
 x=>x.authenticatedTeacherScienceApprovals=1,
 x=>x.authenticatedTeacherCognitiveApprovals=1,
 x=>x.ownerScoredReleasePermissions=1,
 x=>x.scoredUnit7StudentItems=1,
 x=>x.teacherBackendV160='GO',
 x=>x.firebaseAuthRulesAppCheckEdited=true,
 x=>x.studentBankOrTestBuilderEdited=true,
 x=>x.stagingOrProductionDeployment=true,
 x=>x.nextMilestone='RELEASE_NOW'
];
let denied=0;
for(const f of attacks){const x=structuredClone(d);f(x);A.throws(()=>validate(x),undefined,'hostile source/release modification '+(denied+1));denied++;}
const memo=read(MEMO).toLowerCase();
for(const w of ['v205','v173','v185','v197','v201','v204','q44','q54',
 'q61','q62','q69','q77','p-11-b-25','p-11-b-27','p-11-b-28',
 'understanding','application','fig7.14','teacher','pending','hold','no-go','v206'])
 A.ok(memo.includes(w),'missing required source memo term '+w);
const out=path.join(ROOT,'qa-artifacts/grade11-v205-topic73-fourth12-original-qc');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
 version:'V205',newSourcePinnedItems:12,previouslyReviewedSourceIDs:0,
 promisingDirect:2,borderlineExperimentalUnderstanding:1,crossSloExperiment:3,supportingPractice:6,
 sourceAnswerLetterCorrections:0,newPrivateRevisions:0,remainingTopic73Originals:6,
 attackedApprovalSourceOrPrivacyMutationsDenied:denied,
 authenticatedTeacherApprovals:0,scoredUnit7StudentQuestions:0,
 limitation:'PUBLIC_CI_NEVER_READS_PRIVATE_OWNER_QUESTION_KEY_OR_AUTHENTICATES_SUBJECT_TEACHER'
},null,2)+'\n');
console.log('V205 PASS: exact 12 original source SHAs, '+denied+' denied source/approval changes, 6 remaining Topic7.3, 0 scored releases.');
