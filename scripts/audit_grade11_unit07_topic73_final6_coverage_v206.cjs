#!/usr/bin/env node
'use strict';
/**
 * V206: public, keyless original-source coverage and Q25 cross-topic
 * correction audit. Does not claim human academic approval or scored release.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const INDEX='quality/unit07/unit07-v206-topic73-final-six-source-coverage-no-keys.json';
const MEMO='quality/grade11-v206-unit07-topic73-final-six-coverage-and-q25-correction-qc.md';
const PREV_JSON='quality/unit07/unit07-v205-topic73-original12-experiment-source-slo-hold-no-keys.json';
const PREV_MEMO='quality/grade11-v205-unit07-topic73-original12-experiment-science-slo-qc.md';
const ns=[1,10,16,25,67,76];
const hashes=["07e6f32425360c22021c07dd26c0dccde21d93ccb090ccdb894885c6db16cacb","6d17744e9771e4e008e6701a4116dc2ee32519dfef88b669f060eeb9ebf25841","574bac585ea6c7f0ad8dee6b4741cc5d108d0789063220920fd6e8314838b44d","4d33237618966e918851139084b9159f9d1017b46108e370ead47ac62af399d4","fb484edd61c650d114a2edeec51b1a043711cb44eb05b5e27e6b513d376420dc","f0511fe2ed576aa60059ee5a2242b15a5bfed3fc47f864e526a90e04bd94a60f"];
const slos=["P-11-B-28","P-11-B-28","P-11-B-28","P-11-B-28","P-11-B-25","P-11-B-28"];
const authorDemand=["K","K","K","U","U","U"];
const scopes=["direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","supplementary-or-teacher-remap","direct-topic-candidate"];
const priorities=["none","none","none","none","optional","none"];
const classes=["SUPPORTING_B28_KNOWLEDGE_ELASTIC_ENERGY_TERM","SUPPORTING_B28_KNOWLEDGE_STIFFNESS_SYMBOL","SUPPORTING_B28_KNOWLEDGE_EXTENSION_SYMBOL","BORDERLINE_B28_IDEAL_ELASTIC_UNLOADING_VS_APPLICATION_DEMAND","SUPPORTING_B25_EXPERIMENT_REPEATS_GENERAL_METHOD_SOURCE_CAVEAT","PROMISING_CONDITIONAL_B28_APPLICATION_FORMULA_FAILURE_BEYOND_YIELD"];
const actions=["COMPULSORY_DIRECT_B28_APPLICATION_DEMAND_REVIEW","COMPULSORY_DIRECT_B28_APPLICATION_DEMAND_REVIEW","COMPULSORY_DIRECT_B28_APPLICATION_DEMAND_REVIEW","COMPULSORY_B28_APPLICATION_VS_UNDERSTANDING_REVIEW_NO_V192_CROSS_TOPIC_CREDIT","COMPULSORY_B25_SOURCE_SCOPE_AND_MEASUREMENT_UNCERTAINTY_REVIEW","COMPULSORY_TEACHER_CONFIRM_B28_APPLICATION_COGNITION_AND_YIELD_ASSUMPTIONS"];
const pages=['123','123','123','123','122','120-123'];
const hidden=['stem','question','questionText','originalQuestion','options',
 'optionA','optionB','optionC','optionD','answerKey','correctLetter',
 'originalCorrectAnswer','correctOption','ownerExplanation','originalExplanation',
 'teacherUid','studentUid','teacherEmail','studentEmail','authToken',
 'privateCandidateRevisionSha256','privateOriginalQuestionText'];
function noKeys(o,context){
 if(o===null||typeof o!=='object')return;
 for(const f of hidden)A.equal(Object.hasOwn(o,f),false,'public metadata keyed leak '+context+'.'+f);
 for(const [k,v] of Object.entries(o))if(v&&typeof v==='object')noKeys(v,context+'.'+k);
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V206');
 A.deepEqual(d.prerequisite,{mergedPr:309,merged:true,mergeSha:'db653254e895d79c630f7000287a93a1c4a8b70b'});
 A.equal(d.status,'COMPLETE_80_ORIGINAL_SOURCE_SELECTION_NOT_AUTHENTICATED_ACADEMIC_APPROVAL_NO_STUDENT_SCORING');
 A.equal(d.originalOwnerWord,'Grade11_Unit7_Topic7.3_PartA_80MCQs_Study_With_Answers.docx');
 A.equal(d.originalOwnerWordSha256,'f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279');
 A.equal(d.originalSourceLedger,'quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
 A.deepEqual(d.primaryNbfScansSha256,
 ['0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9',
  '08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892']);
 A.deepEqual(d.bookPrintedPagesActuallyChecked,[120,121,122,123]);
 A.equal(d.framework,'FBISE HSSC-I Physics 2025');
 A.deepEqual(d.officialSummativeCognition,{'P-11-B-25':'Understanding','P-11-B-28':'Application'});
 A.deepEqual(d.finalPreviouslyUnreviewedSourceNumbers,ns);A.equal(d.finalSourceCount,6);
 A.equal(d.alreadySelectedInV185DetailedQueue,0);
 A.equal(d.alreadySelectedInV197V201V204V205SourceQC,0);
 A.deepEqual(d.promisingConditionalApplicationNumbers,[76]);
 A.deepEqual(d.borderlineApplicationDemandNumbers,[25]);
 A.deepEqual(d.experimentSourceScopeSensitiveNumbers,[67]);
 A.deepEqual(d.supportingKnowledgeRecallNumbers,[1,10,16]);
 A.equal(d.originalSourceAnswerLetterErrorsFoundInSix,0);
 A.equal(d.originalQuestionOrKeyEdited,false);A.equal(d.newPrivateRevisedCandidatesCreated,0);
 const q=d.sourceIdentityCorrection;
 A.equal(q.v192ActuallyReviewed,'XI-U07-T071-Q025');
 A.equal(q.v206GenuinelyNewTopic73,'XI-U07-T073-Q025');
 for(const k of ['sourceIdentifiersDistinct','topic71V192CandidateNotEquivalentToTopic73Q25',
 'v205PublicJsonAndMemoCorrectedInThisPr','v205SourceQCOriginalTotalsUnchanged',
 'topic73Q25HadNoEarlierDetailedReview'])A.equal(q[k],true);
 for(const k of ['q1EnergyStoredByElasticDeformationDefinitionCorrect','q10KStiffnessNPerMetreForLinearHooke',
 'q16XExtensionNotOriginalLength','q25IdealElasticUnloadingRecoversStoredWork',
 'q25RealWorldHysteresisNotIdenticalToIdealRecovery',
 'q67AveragingScatterValidGeneralMethodButNotExplicitOnNbfP122',
 'q67AveragingDoesNotRemoveSystematicMeasurementError',
 'q76PastYieldSimpleTriangularWorkFormulaNotGeneral',
 'q76ActualWorkIntegralFdxAndPlasticWorkNotFullyRecoverable',
 'q76YieldDoesNotNecessarilyMeanFracture','sourceFig714ReversedAxesNotUniversalWorkArea'])
  A.equal(d.specificScientificCautions[k],true);
 const p=d.privateReview;
 A.equal(p.docx,'Unit7_V206_PRIVATE_Topic73_FinalSix_Source_SLO_QC.docx');
 A.equal(p.docxSha256,'c3f320a2059ebe7464d705de92d0237ddb1df9c1f66d878695bbcc4ebfc906d9');
 A.equal(p.pdf,'Unit7_V206_PRIVATE_Topic73_FinalSix_Source_SLO_QC.pdf');
 A.equal(p.pdfSha256,'48b868b2930f147f51f8cff3f52a7ae4a85cb95dea234680221f244b4cde81a1');
 A.equal(p.privateOriginalKeyedJsonSha256,'0819bf4e9b3b7eb9c76b37ec84ea64cfdcf49dfb1f5238978a69cb33ca4520b8');
 A.equal(p.renderedPages,4);A.equal(p.visuallyChecked,true);
 A.equal(p.humanTeacherVerdictsBlank,true);A.equal(p.originalStemOptionsAndAnswerKeysExcludedFromGitHub,true);
 A.equal(d.items.length,6);
 for(let i=0;i<ns.length;i++){
  const r=d.items[i],n=ns[i];
  A.equal(r.sourceNumber,n);
  A.equal(r.sourceId,'XI-U07-T073-Q'+String(n).padStart(3,'0'));
  A.equal(r.originalFullRowSha256,hashes[i]);A.equal(r.originalSlo,slos[i]);
  A.equal(r.originalAuthorDemand,authorDemand[i]);
  A.equal(r.priorV173Scope,scopes[i]);A.equal(r.priorV173Priority,priorities[i]);
  A.equal(r.officialCognitiveDemand,d.officialSummativeCognition[r.originalSlo]);
  A.equal(r.sourcePrintedPages,pages[i]);
  A.equal(r.modelAcademicCategory,classes[i]);A.equal(r.teacherFollowup,actions[i]);
  A.equal(r.sourceStemOptionsAnswerExplanationEdited,false);
  A.equal(r.newPrivateCandidateRevisionIssued,false);
  A.equal(r.independentTeacherScienceDecision,'PENDING');
  A.equal(r.independentTeacherCognitiveDecision,'PENDING');
  A.equal(r.studentScoring,'HOLD');
 }
 const c=d.topic73Coverage;
 A.equal(c.originalSourceCount,80);A.equal(c.priorV185DetailedCandidateSourceCount,26);
 for(const k of ['sourceOnlyV197Count','sourceOnlyV201Count','sourceOnlyV204Count','sourceOnlyV205Count'])A.equal(c[k],12);
 A.equal(c.sourceOnlyV206NewCount,6);
 A.equal(c.sourceIdentityOverlapCount,0);
 A.equal(c.sourceIdentitiesAccountedFor,80);A.equal(c.sourceIdentitiesUnaccountedFor,0);
 A.equal(c.authenticatedHumanSourceSignoffs,0);A.equal(c.scoredItemsReleased,0);
 const rem=d.remainingTopicalReview;
 A.deepEqual(rem.topic71,{originalSourceCount:80,v185DetailedCandidateCount:17,sourceOnlySecondPassCount:24,unselectedSourceCount:39});
 A.deepEqual(rem.topic72,{originalSourceCount:80,v185DetailedCandidateCount:29,sourceOnlySecondPassCount:36,unselectedSourceCount:15});
 A.deepEqual(rem.topic73,{originalSourceCount:80,v185DetailedCandidateCount:26,sourceOnlySecondPassCount:54,unselectedSourceCount:0});
 A.equal(rem.endOfUnitExercisesNotIncludedInThree80ItemBanks,34);
 A.equal(rem.unit7TotalOriginalSourceInventory,274);
 for(const k of ['authenticatedTeacherScienceApprovals','authenticatedTeacherCognitiveApprovals',
 'ownerStudentScoringAuthorizations','scoredUnit7StudentQuestionCount'])A.equal(d[k],0);
 A.equal(d.teacherBackendV160,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(d.teacherBackendV161,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 for(const k of ['firebaseAuthFirestoreRulesAppCheckChanged',
 'studentScoredBankTestBuilderOrUserDataChanged','productionOrStagingDeployment'])A.equal(d[k],false);
 A.ok(d.ciLimit.includes('cannot inspect original keyed'));
 A.ok(d.nextMilestone.startsWith('V207'));
 noKeys(d,'V206');
}
const d=load(INDEX);validate(d);
const v173=load('quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const v197=load('quality/unit07/unit07-v197-topic73-twelve-originals-source-slo-secondpass-no-keys.json');
const v201=load('quality/unit07/unit07-v201-topic73-next12-energy-source-slo-no-keys.json');
const v204=load('quality/unit07/unit07-v204-topic73-twelve-original-work-energy-slo-hold-no-keys.json');
const v205=load(PREV_JSON);
const v192=load('quality/unit07/unit07-v192-q25-science-disposition-private-hold-no-keys.json');
const v193=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
A.equal(v173.originalSourceFirstPassRowCount,80);
A.equal(v173.originalPrivateWordSha256,d.originalOwnerWordSha256);
A.equal(v173.originalRowSourceRegistry.length,80);
A.equal(v185.candidateRegistry.length,72);
for(const q of [v197,v201,v204,v205])A.equal(q.items.length,12);
A.deepEqual(v193.uploadedOriginalSources.map(x=>x.sha256),d.primaryNbfScansSha256);
A.equal(v192.sourceId,'XI-U07-T071-Q025');
A.notEqual(v192.sourceId,d.sourceIdentityCorrection.v206GenuinelyNewTopic73);
A.equal(v205.crossTopicQ25Correction.v192ActualReviewedSourceId,'XI-U07-T071-Q025');
A.equal(v205.crossTopicQ25Correction.remainingTopic73OriginalSourceId,'XI-U07-T073-Q025');
A.equal(v205.crossTopicQ25Correction.distinctOriginalQuestions,true);
A.ok(v205.nextMilestone.includes('XI-U07-T073-Q025'));
const oldMemo=read(PREV_MEMO);
A.ok(oldMemo.includes('XI-U07-T071-Q025'));
A.ok(oldMemo.includes('XI-U07-T073-Q025'));
A.ok(oldMemo.includes('cross-topic identity error'));
const before=new Set(v185.candidateRegistry.filter(x=>x.sourceId.includes('-T073-')).map(x=>x.sourceId));
A.equal(before.size,26);
for(const prior of [v197,v201,v204,v205]){
 for(const r of prior.items){
  A.ok(!before.has(r.sourceId),'Topic7.3 prior set is not disjoint at '+r.sourceId);
  before.add(r.sourceId);
 }
}
A.equal(before.size,74);
for(const current of d.items){
 A.ok(!before.has(current.sourceId),'V206 newly selected source duplicates prior review');
 before.add(current.sourceId);
 const row=v173.originalRowSourceRegistry[current.sourceNumber-1];
 A.equal(row.number,current.sourceNumber);
 A.equal(row.originalPrivateFullRowSha256,current.originalFullRowSha256);
 A.equal(row.sourceMappedSlo,current.originalSlo);
 A.equal(row.sourceAuthorDemand,current.originalAuthorDemand);
 A.equal(row.teacherScienceSignoff,'PENDING');
 A.equal(row.teacherCognitiveSignoff,'PENDING');
 A.equal(row.studentScoredRelease,'HOLD');
}
A.equal(before.size,80);
for(const source of v173.originalRowSourceRegistry)A.ok(before.has('XI-U07-T073-Q'+String(source.number).padStart(3,'0')),'missing Topic7.3 original Q'+source.number);
const counts={T071:0,T072:0,T073:0};
for(const c of v185.candidateRegistry)counts[c.sourceId.split('-')[2]]++;
A.deepEqual(counts,{T071:17,T072:29,T073:26});
const t71=[load('quality/unit07/unit07-v199-topic71-twelve-original-structure-slo-no-keys.json'),
 load('quality/unit07/unit07-v200-topic71-next12-structure-source-slo-no-keys.json')];
const t72=[load('quality/unit07/unit07-v198-topic72-twelve-unreviewed-source-slo-no-keys.json'),
 load('quality/unit07/unit07-v202-topic72-next12-stress-strain-slo-no-keys.json'),
 load('quality/unit07/unit07-v203-topic72-twelve-elastic-modulus-source-qc-no-keys.json')];
for(const arr of [t71,t72])for(const q of arr)A.equal(q.items.length,12);
const counted=(topic,prior)=>{const set=new Set(v185.candidateRegistry.filter(x=>x.sourceId.includes(topic)).map(x=>x.sourceId));for(const b of prior){for(const x of b.items){A.ok(!set.has(x.sourceId),'cross-topic overlap '+x.sourceId);set.add(x.sourceId);}}return set.size;};
A.equal(counted('-T071-',t71),41);
A.equal(counted('-T072-',t72),65);
for(const c of v185.candidateRegistry){
 A.equal(c.candidateIndividualRevisionSha256,null);
 A.equal(c.eligibleForStudentScoredUse,false);
 A.equal(c.scoredRelease,'HOLD');
}
const u7=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const changes=[
 x=>x.prerequisite.mergedPr=308,x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='TEACHER_APPROVED',x=>x.originalOwnerWordSha256='0'.repeat(64),
 x=>x.primaryNbfScansSha256[0]='0'.repeat(64),
 x=>x.officialSummativeCognition['P-11-B-28']='Knowledge',
 x=>x.finalPreviouslyUnreviewedSourceNumbers.pop(),x=>x.finalSourceCount=7,
 x=>x.alreadySelectedInV185DetailedQueue=1,
 x=>x.promisingConditionalApplicationNumbers.push(25),
 x=>x.supportingKnowledgeRecallNumbers.pop(),
 x=>x.originalSourceAnswerLetterErrorsFoundInSix=1,
 x=>x.newPrivateRevisedCandidatesCreated=1,
 x=>x.sourceIdentityCorrection.v192ActuallyReviewed='XI-U07-T073-Q025',
 x=>x.sourceIdentityCorrection.sourceIdentifiersDistinct=false,
 x=>x.sourceIdentityCorrection.v205PublicJsonAndMemoCorrectedInThisPr=false,
 x=>x.specificScientificCautions.q76PastYieldSimpleTriangularWorkFormulaNotGeneral=false,
 x=>x.specificScientificCautions.q67AveragingDoesNotRemoveSystematicMeasurementError=false,
 x=>x.privateReview.docxSha256='0'.repeat(64),
 x=>x.privateReview.humanTeacherVerdictsBlank=false,
 x=>x.privateReview.originalStemOptionsAndAnswerKeysExcludedFromGitHub=false,
 x=>x.items.pop(),x=>x.items[0].sourceNumber=2,
 x=>x.items[1].originalFullRowSha256='0'.repeat(64),
 x=>x.items[2].originalAuthorDemand='Application',
 x=>x.items[3].teacherFollowup='APPROVED',
 x=>x.items[4].independentTeacherScienceDecision='APPROVED',
 x=>x.items[5].studentScoring='RELEASED',
 x=>x.items[5].answerKey='A',
 x=>x.topic73Coverage.sourceIdentitiesAccountedFor=79,
 x=>x.topic73Coverage.sourceIdentityOverlapCount=1,
 x=>x.topic73Coverage.sourceOnlyV206NewCount=5,
 x=>x.remainingTopicalReview.topic73.unselectedSourceCount=1,
 x=>x.remainingTopicalReview.topic72.unselectedSourceCount=0,
 x=>x.authenticatedTeacherScienceApprovals=1,
 x=>x.authenticatedTeacherCognitiveApprovals=1,
 x=>x.ownerStudentScoringAuthorizations=1,
 x=>x.scoredUnit7StudentQuestionCount=1,
 x=>x.teacherBackendV160='GO',
 x=>x.firebaseAuthFirestoreRulesAppCheckChanged=true,
 x=>x.studentScoredBankTestBuilderOrUserDataChanged=true,
 x=>x.productionOrStagingDeployment=true,
 x=>x.nextMilestone='RELEASE'
];
let denied=0;
for(const mutate of changes){const bad=structuredClone(d);mutate(bad);A.throws(()=>validate(bad),undefined,'reject forged source/approval state '+(denied+1));denied++;}
const memo=read(MEMO).toLowerCase();
for(const word of ['v206','v205','v192','topic 7.1','topic 7.3','q25','q76','q67',
 '80 / 80','26','48','6','15','39','application','understanding','pending','hold','no-go','v207'])
 A.ok(memo.includes(word),'missing V206 QC memo evidence '+word);
const out=path.join(ROOT,'qa-artifacts/grade11-v206-topic73-final-six-coverage');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
 version:'V206',topic73OriginalSourceTotal:80,priorV185Topic73:26,
 priorFourSourceOnlyBatches:48,finalSixDistinct:6,
 completeSourceCoverage:true,remainingTopic73Unselected:0,
 correction:'V192_Q25_IS_T071_NOT_T073',
 pendingTopic71Unselected:39,pendingTopic72Unselected:15,
 originalAnswerKeysChanged:0,newPrivateRevisions:0,
 forgedSourceIdentityApprovalsDenied:denied,
 authenticatedHumanScienceApprovals:0,ownerScoringAuthorizations:0,scoredUnit7StudentQuestions:0,
 limitation:'PUBLIC_CI_HAS_NO_PRIVATE_KEYED_WORD_OR_REAL_HUMAN_SIGNOFF'
},null,2)+'\n');
console.log('V206 PASS: Topic7.3 80/80 distinct original sources; T071/T073 Q25 separated; '+denied+' forged changes denied, student scored HOLD.');
