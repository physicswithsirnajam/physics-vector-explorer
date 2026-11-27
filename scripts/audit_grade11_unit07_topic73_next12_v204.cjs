#!/usr/bin/env node
'use strict';
/* V204 source-only academic metadata check: public CI has NO keyed original stems,
 * answer letters, teacher credentials, real teacher approval or scoring ability. */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const REG='quality/unit07/unit07-v204-topic73-twelve-original-work-energy-slo-hold-no-keys.json';
const MEMO='quality/grade11-v204-unit07-topic73-original12-elastic-work-source-slo-qc.md';
const nums=[9,20,22,26,28,30,33,43,48,53,63,74];
const sourceShas=["bf7d1f2e737959800ef997858acbf1dfb9372ddf93143447d11048c1bed31bbd","f06fe5a30d3d53048ae16c81b0c45af31d8f69a8b7221ae819b64ef03d4c8936","b645a28c160a1a5bb42421bc38c2e8ddd246e641220eef524f6a2d347ac4d243","a188f6e2984bd16e02ca76a254f85c6d014231d4c3358f7f4da7c4c04b226353","67e609f5133485ddd7b7e2f13770dafe6fbc0fcfdd958708420d6221dd8ec259","471bb886e1765941b3afc0c9aeff527616071d108bba5f1082c5ba4a2f5a710c","f62ac984e5ca2c7d862395866cc7ab2687d679d462646fc0a60c458c9a69bb2e","da32005216382608ae5093c66e25f23961f259a5ebef92c2bf56c19c033b1a88","50cfb76b3d65635639075f26c79b85c7525cf7e89332a4b383878044b8e429b2","dfab3c5def616e859f393cb6c80d64c3dbd8a23af5f3cff1db5e3abe4d23a61a","36f6ac5c51211e6ef452859a56c6ba180640cf60a6aafbfddcc0b6b977260fb4","d4c2947316dc82e75c66c82c5ea2c8839f47783ca3e2f852cf7b9e2810c76a00"];
const sourceSlo=["P-11-B-27","P-11-B-28","P-11-B-28","P-11-B-27","P-11-B-27","P-11-B-25","P-11-B-25","P-11-B-28","P-11-B-25","P-11-B-28","P-11-B-28","P-11-B-28"];
const sourceCog=["K","U","A","U","U","U","U","A","A","A","A","A"];
const sourceScope=["direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","teacher-cross-slo-review","direct-topic-candidate","supporting-or-cross-slo-teacher-decision","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate"];
const sourcePriority=["none","none","none","none","none","none","optional","none","optional","none","optional","none"];
const categories=["SUPPORTING_B27_FORMULA_RECALL_BELOW_APPLICATION","SUPPORTING_B28_DERIVATION_START_BELOW_APPLICATION","PROMISING_DIRECT_B28_EXTENSION_QUADRATIC_SCALING","SUPPORTING_B27_LINEAR_GRAPH_CONCEPT_BELOW_APPLICATION","SUPPORTING_B27_AVERAGE_FORCE_RATIONALE_BELOW_APPLICATION","PROMISING_DIRECT_B25_EXPERIMENT_GAUGE_LENGTH_UNDERSTANDING","CROSS_SLO_B25_VS_B24_YOUNG_COMPARISON_REVIEW","PROMISING_DIRECT_B28_KX2_NUMERIC_ENERGY","CROSS_SLO_B25_VS_B24_STIFFNESS_EXTENSION_APPLICATION","PROMISING_DIRECT_B28_YOUNG_AREA_LENGTH_ENERGY_NUMERIC","PROMISING_DIRECT_B28_EXTRA_ENERGY_AFTER_DOUBLING_EXTENSION","PROMISING_DIRECT_B28_EQUAL_FORCE_DIFFERENT_EXTENSION_ENERGY"];
const sourcePages=[122,123,123,122,122,122,122,123,122,123,123,123];
const forbidden=['question','questionText','originalQuestion','stem','options','optionA',
 'optionB','optionC','optionD','answer','answerKey','originalAnswerLetter','correctOption',
 'correctLetter','ownerExplanation','privateOriginalWordContent','studentUid','teacherUid',
 'teacherEmail','studentEmail','authToken','teacherSignature','privateRevisionSha256'];
function noKeys(o,where){
 if(!o||typeof o!=='object')return;
 for(const k of forbidden)A.equal(Object.hasOwn(o,k),false,'PRIVATE KEY in public metadata: '+where+'.'+k);
 for(const [k,v] of Object.entries(o))if(v&&typeof v==='object')noKeys(v,where+'.'+k);
}
function check(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V204');
 A.deepEqual(d.prerequisite,{mergedPr:307,merged:true,mergeSha:'04a8ee44a9383d9ea73601b73672f802a62a5233'});
 A.equal(d.status,'SOURCE_PINNED_MODEL_QC_ONLY_NO_AUTHENTICATED_TEACHER_APPROVAL_NO_SCORE');
 A.equal(d.originalWordFilename,'Grade11_Unit7_Topic7.3_PartA_80MCQs_Study_With_Answers.docx');
 A.equal(d.originalWordSha256,'f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279');
 A.equal(d.originalEightySourceLedger,'quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
 A.deepEqual(d.originalNbfScanSha256,['0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9','08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892']);
 A.deepEqual(d.originalNbfPrintedPagesActuallyChecked,[122,123]);
 A.equal(d.officialFramework,'FBISE HSSC-I Physics 2025 / Inclusive Scheme 2024');
 A.deepEqual(d.officialSummativeSloCognition,{'P-11-B-25':'Understanding','P-11-B-27':'Application','P-11-B-28':'Application'});
 A.deepEqual(d.selectedOriginalNumbers,nums);A.equal(d.selectedCount,12);
 A.equal(d.overlapWithV18572DetailedReview,0);A.equal(d.overlapWithV197Topic73SourceQC,0);A.equal(d.overlapWithV201Topic73SourceQC,0);
 A.deepEqual(d.promisingDirectOriginalNumbers,[22,30,43,53,63,74]);
 A.deepEqual(d.supportingOrCrossSloNumbers,[9,20,26,28,33,48]);
 A.equal(d.originalAnswerLetterErrorsDetected,0);A.equal(d.originalWordOrKeyModified,false);
 A.equal(d.newPrivateRevisedCandidatesIssued,0);
 const c=d.sourceSpecificQualifications;
 for(const k of ['originalFigure714HasForceHorizontalExtensionVertical','generalWorkIsForceIntegratedOverExtension',
  'linearOriginStartTriangleExceptionCorrect','nonlinearReversedAxisAreaNotGeneralWork',
  'q9AndQ20FormulaRecognitionNotDirectApplication','q26AndQ28ConceptualRatherThanDirectApplication',
  'q30NeedsOriginalGaugeLengthForTensileStrain','q33YoungComparisonExperimentMappingNeedsHumanDecision',
  'q48StiffnessCalculationExperimentMappingNeedsHumanDecision',
  'q22AndQ63OverlapButExtraEnergyVsTotalDistinction','q53MillimetresConvertedBeforeSquare',
  'q74TwoWireFinalForceSameButExtensionsDifferent'])A.equal(c[k],true);
 const p=d.privateReviewArtifact;
 A.equal(p.docx,'Unit7_V204_PRIVATE_Topic73_Twelve_Original_Source_SLO_QC.docx');
 A.equal(p.docxSha256,'65a49983579a97d2c67e70496d16e6faf8ceaec5ed449ffe31b5a357db3eff5c');
 A.equal(p.pdf,'Unit7_V204_PRIVATE_Topic73_Twelve_Original_Source_SLO_QC.pdf');
 A.equal(p.pdfSha256,'1febc0584eeb7cc8dac8e9922dfa557996def58786283de989ae3159a04fd0ed');
 A.equal(p.privateOriginalKeyedJsonSha256,'07dfe82e261defd10f741d3a19512498878936a3ffc2224a28bb29114dd8a6f5');
 A.equal(p.renderedPages,7);A.equal(p.visuallyChecked,true);
 A.equal(p.independentTeacherDecisionFieldsBlank,true);
 A.equal(p.originalQuestionsAndKeysInPublicGitHub,false);
 A.equal(d.items.length,12);
 for(let i=0;i<12;i++){
  const x=d.items[i],n=nums[i];
  A.equal(x.sourceId,'XI-U07-T073-Q'+String(n).padStart(3,'0'));
  A.equal(x.sourceNumber,n);
  A.equal(x.originalPrivateFullRowSha256,sourceShas[i]);
  A.equal(x.originalMappedSlo,sourceSlo[i]);A.equal(x.originalAuthorDemand,sourceCog[i]);
  A.equal(x.priorV173Scope,sourceScope[i]);A.equal(x.priorV173Priority,sourcePriority[i]);
  A.equal(x.officialSloCognitive,d.officialSummativeSloCognition[x.originalMappedSlo]);
  A.equal(x.primaryNbfPrintedPage,sourcePages[i]);
  A.equal(x.modelQcCategory,categories[i]);
  A.ok(x.teacherFollowUp.length>20);
  A.equal(x.originalAnswerOrOptionEdited,false);A.equal(x.newPrivateCandidateRevisionIssued,false);
  A.equal(x.authenticatedTeacherScience,'PENDING');A.equal(x.authenticatedTeacherCognition,'PENDING');
  A.equal(x.studentScoredRelease,'HOLD');
 }
 A.equal(d.unit7SourceUniverseCount,274);A.equal(d.priorV185DetailedCandidateReviewCount,72);
 A.equal(d.v197ThroughV203PreviousSourceOnlyBatchCount,7);
 for(const k of ['authenticatedTeacherScienceApprovals','authenticatedTeacherCognitiveApprovals',
 'ownerStudentScoringApprovals','scoredUnit7StudentQuestions'])A.equal(d[k],0);
 A.equal(d.teacherBackendV160,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(d.teacherBackendV161,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 for(const k of ['noFirebaseAuthFirestoreOrAppCheckChanges','noStudentQuestionBankOrTestBuilderChanges',
 'noStagingOrProductionChanges'])A.equal(d[k],true);
 A.ok(d.ciBoundary.includes('cannot independently read private keyed'));
 A.ok(d.nextMilestone.startsWith('V205'));noKeys(d,'V204');
}
const d=load(REG);check(d);
const v173=load('quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const v197=load('quality/unit07/unit07-v197-topic73-twelve-originals-source-slo-secondpass-no-keys.json');
const v201=load('quality/unit07/unit07-v201-topic73-next12-energy-source-slo-no-keys.json');
const v193=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
A.equal(v173.originalSourceFirstPassRowCount,80);
A.equal(v173.originalPrivateWordSha256,d.originalWordSha256);
A.equal(v173.originalRowSourceRegistry.length,80);
A.equal(v185.candidateRegistry.length,72);A.equal(v197.items.length,12);A.equal(v201.items.length,12);
A.deepEqual(v193.uploadedOriginalSources.map(x=>x.sha256),d.originalNbfScanSha256);
const older=new Set([...v185.candidateRegistry.map(x=>x.sourceId),
 ...v197.items.map(x=>x.sourceId),...v201.items.map(x=>x.sourceId)]);
for(const x of d.items){
 const old=v173.originalRowSourceRegistry[x.sourceNumber-1];
 A.equal(old.number,x.sourceNumber);A.equal(old.originalPrivateFullRowSha256,x.originalPrivateFullRowSha256);
 A.equal(old.sourceMappedSlo,x.originalMappedSlo);A.equal(old.sourceAuthorDemand,x.originalAuthorDemand);
 A.equal(old.previousReviewScope,x.priorV173Scope);A.equal(old.previousReviewPriority,x.priorV173Priority);
 A.equal(old.teacherScienceSignoff,'PENDING');A.equal(old.studentScoredRelease,'HOLD');
 A.equal(older.has(x.sourceId),false,'V204 duplicates V185/V197/V201 previously reviewed source');
}
for(const x of v185.candidateRegistry){
 A.equal(x.candidateIndividualRevisionSha256,null);A.equal(x.eligibleForStudentScoredUse,false);A.equal(x.scoredRelease,'HOLD');
}
const u7=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const mutations=[
 x=>x.prerequisite.mergedPr=306,x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='SCORED',x=>x.originalWordSha256='0'.repeat(64),
 x=>x.originalNbfScanSha256[0]='0'.repeat(64),
 x=>x.officialSummativeSloCognition['P-11-B-28']='Understanding',
 x=>x.selectedOriginalNumbers.pop(),x=>x.selectedCount=13,
 x=>x.overlapWithV18572DetailedReview=1,
 x=>x.overlapWithV197Topic73SourceQC=1,
 x=>x.promisingDirectOriginalNumbers.push(48),
 x=>x.supportingOrCrossSloNumbers.pop(),
 x=>x.originalAnswerLetterErrorsDetected=1,
 x=>x.newPrivateRevisedCandidatesIssued=12,
 x=>x.sourceSpecificQualifications.nonlinearReversedAxisAreaNotGeneralWork=false,
 x=>x.sourceSpecificQualifications.q53MillimetresConvertedBeforeSquare=false,
 x=>x.privateReviewArtifact.docxSha256='0'.repeat(64),
 x=>x.privateReviewArtifact.independentTeacherDecisionFieldsBlank=false,
 x=>x.privateReviewArtifact.originalQuestionsAndKeysInPublicGitHub=true,
 x=>x.items.pop(),x=>x.items[0].sourceNumber=8,
 x=>x.items[1].originalPrivateFullRowSha256='0'.repeat(64),
 x=>x.items[2].originalAuthorDemand='U',
 x=>x.items[3].modelQcCategory='TEACHER_APPROVED',
 x=>x.items[4].teacherFollowUp='GO',
 x=>x.items[5].originalAnswerOrOptionEdited=true,
 x=>x.items[6].newPrivateCandidateRevisionIssued=true,
 x=>x.items[7].authenticatedTeacherScience='APPROVED',
 x=>x.items[8].authenticatedTeacherCognition='APPROVED',
 x=>x.items[9].studentScoredRelease='RELEASED',
 x=>x.items[10].answerKey='A',
 x=>x.unit7SourceUniverseCount=275,
 x=>x.authenticatedTeacherScienceApprovals=1,
 x=>x.authenticatedTeacherCognitiveApprovals=1,
 x=>x.ownerStudentScoringApprovals=1,
 x=>x.scoredUnit7StudentQuestions=1,
 x=>x.noFirebaseAuthFirestoreOrAppCheckChanges=false,
 x=>x.noStudentQuestionBankOrTestBuilderChanges=false,
 x=>x.noStagingOrProductionChanges=false,
 x=>x.teacherBackendV160='GO',
 x=>x.nextMilestone='SCORE_NOW'
];
let denied=0;for(const change of mutations){const bad=structuredClone(d);change(bad);A.throws(()=>check(bad),undefined,'tampering '+(denied+1));denied++;}
const memo=read(MEMO).toLowerCase();
for(const term of ['v204','v173','v185','v197','v201','fig.7.14','q22','q33','q48','q53',
 'q63','q74','application','understanding','pending','hold','no-go','v205'])A.ok(memo.includes(term),'missing source memo marker '+term);
const out=path.join(ROOT,'qa-artifacts/grade11-v204-topic73-third12-original-qc');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
 version:'V204',previouslyUnqueuedOriginalSourceItems:12,originalRowShasVerified:12,
 v185V197V201Overlap:0,promisingDirect:6,supportingOrCrossSlo:6,
 sourceAnswerLetterCorrections:0,privateCandidateRevisionsIssued:0,
 forgedMetadataSourceOrApprovalMutationsDenied:denied,
 realTeacherScienceApprovals:0,ownerScoredPermissions:0,scoredUnit7Questions:0,
 scope:'PUBLIC_CI_CANNOT_READ_PRIVATE_KEYED_WORD_OR_AUTHENTICATE_HUMAN_TEACHER'
},null,2)+'\n');
console.log('V204 PASS: twelve genuine original source rows, '+denied+' hostile metadata changes denied; zero teacher approvals or scored releases.');
