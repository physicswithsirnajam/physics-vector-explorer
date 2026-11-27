#!/usr/bin/env node
'use strict';
/* V202 PUBLIC source-identity and academic-HOLD test.
 * Keyed original questions, private DOCX/PDF and real authenticated teacher
 * decisions are NOT available inside GitHub Actions. Green CI != teacher approval.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const REG='quality/unit07/unit07-v202-topic72-next12-stress-strain-slo-no-keys.json';
const MEMO='quality/grade11-v202-unit07-topic72-next12-stress-strain-science-qc.md';
const numbers=[6,12,27,30,32,35,42,43,44,48,59,79];
const hashes=["bcdd5fe5bb86d5229cb53f271fc644645c7afab41fc55123f373d907b4ff7caa","d65649cd0dae7de60235ae38817c8d740bb1db8bd02b795c7e6da7d64bbc4b2f","ea36ccf5ab2d672c7ee466ffbdafb526d8c2c5aadd54e434c65a2b429152e136","a862ecbfdfa48284682af43fb203dabd2be61342f8a0dfbcf4afe5e461b4f791","19da75566a89912c0375b5d8fa7cad1d6004a3a2630f59dc3d57b36f5528ad74","7eb82f36190b6f5be51697571fc3d3c9b315738d74c1db8131b858384f9dadb1","ec4c036486504df51afda33bd3292a7c696092fa49745856133ce050d4a25f14","40fda3b1b72ed775f885a30d7f4569781e42c31b86fc9d4a28746d046f70fd29","bfb93279db266636c64a6380f9155852d0b28b5258a16f5da21d20154e4f28ff","3d5308d59aa4ff1f4493a87ff4ec89ba79e266332903e98110a5a4d1873f3ed3","61a1c3501921d90849b1348863224372b63faa34591245d0eb9f3e4b93c31eee","5e7662819e72d38d0a5b0c99304545a67c085177c8e83bc672c6732c0b27ef7a"];
const mappedSlo=["P-11-B-23","P-11-B-24","P-11-B-24","P-11-B-26","P-11-B-26","P-11-B-26","P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-26"];
const originalCog=["U","K","U","U","U","U","A","A","A","A","A","U"];
const originalScope=["direct-topic-core","supplementary-textbook-support","supplementary-textbook-support","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core"];
const originalIssue=["none","optional-slo-scope","optional","none","none","none","none","none","none","none","none","none"];
const classifications=["PROMISING_DIRECT_B23_COMPRESSION_SCENARIO","SUPPORTING_SHEAR_STRAIN_FORMULA_RECALL_BELOW_B24_APPLICATION","SUPPLEMENTARY_SMALL_ANGLE_RADIANS_B24_SCOPE_REVIEW","BORDERLINE_FIG712_AB_ELASTIC_NONLINEAR_FIGURE_DEPENDENCY","PROMISING_DIRECT_B26_BEYOND_ELASTIC_LIMIT_RESIDUAL_STRAIN","PROMISING_DIRECT_B26_DUCTILE_PLASTIC_DEFORMATION","PROMISING_DIRECT_B24_STRESS_FORCE_PRODUCT","PROMISING_DIRECT_B24_CM2_TO_M2_STRESS","PROMISING_DIRECT_B24_MM_TO_M_TENSILE_STRAIN","PROMISING_DIRECT_B24_YOUNG_MODULUS_FROM_STRESS_STRAIN","PROMISING_DIRECT_B24_ALUMINIUM_TABLE_MODULUS","BORDERLINE_FIG712_AB_ELASTIC_RECOVERY_DUPLICATE_Q30"];
const actions=["NO_COMPULSORY_SCIENCE_CHANGE_TEACHER_COGNITIVE_REVIEW","OPTIONAL_MEASURED_SHEAR_STRAIN_APPLICATION_VARIANT","COMPULSORY_ACTUAL_SLO_SCOPE_AND_COGNITIVE_DEMAND_REVIEW","COMPULSORY_STANDALONE_ACCESSIBLE_FIG712_OR_EQUIVALENT_CONTEXT_AND_DUPLICATE_SELECTION","NO_COMPULSORY_ANSWER_CHANGE_HUMAN_REVIEW_PENDING","NO_COMPULSORY_SCIENCE_CHANGE_OPTIONAL_PLAUSIBLE_DISTRACTORS","NO_COMPULSORY_SCIENCE_CHANGE_SOURCE_NUMERICAL_RECOMPUTED","NO_COMPULSORY_SCIENCE_CHANGE_EMPHASIZE_SQUARED_AREA_CONVERSION","NO_COMPULSORY_SCIENCE_CHANGE_EMPHASIZE_DIMENSIONLESS_STRAIN","NO_COMPULSORY_SCIENCE_CHANGE_RETAIN_PROPER_POWER_OF_TEN","NO_COMPULSORY_ANSWER_CHANGE_OPTIONAL_LINEAR_ELASTIC_ASSUMPTION","COMPULSORY_ACCESSIBLE_SOURCE_FIG712_OR_SELF_CONTAINED_WORDING_AND_Q30_DUPLICATE_WATCH"];
const pages=[117,119,119,120,121,121,117,117,117,118,119,121];
const privateNames=['question','stem','questionText','options','optionA','optionB','optionC','optionD',
 'correctOption','answerKey','correctLetter','originalAnswerLetter','correctAnswer',
 'ownerExplanation','privateOriginalText','privateRevisedCandidateSha256','teacherSignature',
 'teacherUid','studentUid','studentEmail','teacherEmail','authToken','rawOriginalPdfBytes'];
function noPrivate(x,where){
 if(!x||typeof x!=='object')return;
 for(const k of privateNames)A.equal(Object.hasOwn(x,k),false,'Sensitive payload '+where+'.'+k);
 for(const [k,v] of Object.entries(x))if(v&&typeof v==='object')noPrivate(v,where+'.'+k);
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V202');
 A.equal(d.prerequisite.mergedPr,305);A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'cc2bc525fdfec4211d28962f09397d18c0f0ae04');
 A.equal(d.status,'ORIGINAL_12_SOURCE_MODEL_QC_NO_INDEPENDENT_TEACHER_APPROVAL_ZERO_STUDENT_SCORES');
 A.equal(d.originalOwnerWordFilename,'Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx');
 A.equal(d.originalOwnerWordSha256,'a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada');
 A.equal(d.original80SourceRegister,'quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
 A.deepEqual(d.primaryOriginalNbfScanSha256,
 ['0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9',
  '08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892']);
 A.deepEqual(d.originalTextbookPrintedPagesChecked,[117,118,119,120,121]);
 A.equal(d.officialFramework,'FBISE HSSC-I Physics 2025, Inclusive Scheme of Studies 2024');
 A.deepEqual(d.officialSummativeSloLevels,{'P-11-B-23':'Understanding','P-11-B-24':'Application','P-11-B-26':'Understanding'});
 A.deepEqual(d.selectedNumbers,numbers);A.equal(d.selectedCount,12);
 A.equal(d.overlapWithExistingV18572,0);A.equal(d.overlapWithPriorV198Topic72Twelve,0);
 A.equal(d.overlapWithOtherV197V199V200V201ByTopic,0);
 A.deepEqual(d.promisingDirectCandidateNumbers,[6,32,35,42,43,44,48,59]);
 A.deepEqual(d.borderlineFigureOrDuplicateNumbers,[30,79]);
 A.deepEqual(d.supportingOrSloScopeSensitiveNumbers,[12,27]);
 A.equal(d.originalAnswerLetterErrorsFound,0);
 A.equal(d.originalSourceQuestionBankChanged,false);
 A.equal(d.privateRevisedCandidateItemsCreated,0);
 const c=d.sourceCautions;
 for(const k of ['q12ShearStrainDefinitionRecallIsNotB24Application',
 'q27RadianSmallAngleApproximationPrimarilyMathSupplement',
 'q30Q79SameABNonlinearElasticRegionOverlap',
 'q30AndQ79RequireSourceFigureOrSelfContainedWording',
 'bookP120StressVerticalStrainHorizontalGraphVerified',
 'bookP121ProportionalLimitAElasticLimitBExplanationVerified',
 'q43SquareCentimetreToSquareMetreConversionChecked',
 'q44MillimetreToMetreConversionChecked',
 'q59AluminiumTable71YoungModulusChecked',
 'noOriginalAnswerKeyCorrectionRequired'])A.equal(c[k],true);
 const p=d.privateAcademicPack;
 A.equal(p.docx,'Unit7_V202_PRIVATE_Topic72_12_Original_Source_SLO_QC.docx');
 A.equal(p.docxSha256,'cb8c52557af0ff21e06395bb869c52fe70009f10c524f1d585bbb48db49e72a1');
 A.equal(p.pdf,'Unit7_V202_PRIVATE_Topic72_12_Original_Source_SLO_QC.pdf');
 A.equal(p.pdfSha256,'42a4f5167c6af6cb84202718a5eeeeadba1cceab24418a1696d455625c3957bb');
 A.equal(p.privateWorkingJsonSha256,'93de3000ce902c0911dee344063e359586ef986bfb2af6234a86fbab78027f33');
 A.equal(p.pageCount,7);A.equal(p.allRenderedPagesVisuallyChecked,true);
 A.equal(p.humanDecisionFieldsBlank,true);A.equal(p.fullOriginalKeysOptionsInPublicRepository,false);
 A.equal(d.items.length,12);
 for(let i=0;i<12;i++){
  const x=d.items[i],n=numbers[i];
  A.equal(x.sourceNumber,n);A.equal(x.sourceId,'XI-U07-T072-Q'+String(n).padStart(3,'0'));
  A.equal(x.originalCanonicalRowSha256,hashes[i]);
  A.equal(x.originalMappedSlo,mappedSlo[i]);
  A.equal(x.originalAuthorCognitive,originalCog[i]);
  A.equal(x.priorV168SourceScope,originalScope[i]);
  A.equal(x.priorV168Issue,originalIssue[i]);
  A.equal(x.officialCognitiveDemand,d.officialSummativeSloLevels[x.originalMappedSlo]);
  A.equal(x.textbookPrintedPage,pages[i]);
  A.equal(x.modelClassification,classifications[i]);
  A.equal(x.teacherFollowup,actions[i]);
  A.equal(x.originalStemOptionsKeyExplanationChanged,false);
  A.equal(x.newPrivateCandidateRevisionIssued,false);
  A.equal(x.realTeacherScienceDecision,'PENDING');
  A.equal(x.realTeacherCognitiveDecision,'PENDING');
  A.equal(x.studentScoredRelease,'HOLD');
 }
 A.equal(d.unit7OriginalSourceUniverse,274);A.equal(d.existingDetailedPrivateCandidateQueue,72);
 A.equal(d.previousSourceOnlyBatchesV197V198V199V200V201,5);
 for(const k of ['realAuthenticatedTeacherScienceApprovals','realAuthenticatedTeacherCognitiveApprovals',
  'ownerScoredReleasePermissions','scoredUnit7StudentQuestions'])A.equal(d[k],0);
 A.equal(d.teacherBackendV160,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(d.teacherBackendV161,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 for(const k of ['firebaseAuthFirestoreAppCheckChanged','studentTestBuilderChanged',
  'liveOriginalQuestionBankEdited','stagingOrProductionDeployed'])A.equal(d[k],false);
 A.ok(d.ciBoundary.includes('cannot independently inspect private keyed'));
 A.ok(d.nextMilestone.startsWith('V203'));
 noPrivate(d,'V202');
}
const d=load(REG);validate(d);
const v168=load('quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const v198=load('quality/unit07/unit07-v198-topic72-twelve-unreviewed-source-slo-no-keys.json');
const v201=load('quality/unit07/unit07-v201-topic73-next12-energy-source-slo-no-keys.json');
const v193=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
A.equal(v168.version,'V168');A.equal(v168.canonicalSourceRows.length,80);
A.equal(v168.sourceOriginalPrivateDocxSha256,d.originalOwnerWordSha256);
A.deepEqual(v168.officialSummativeSloLevels,d.officialSummativeSloLevels);
A.equal(v185.version,'V185');A.equal(v185.candidateRegistry.length,72);
A.equal(v198.version,'V198');A.equal(v198.items.length,12);
A.equal(v201.version,'V201');A.equal(v201.items.length,12);
A.deepEqual(v193.uploadedOriginalSources.map(x=>x.sha256),d.primaryOriginalNbfScanSha256);
const reviewed=new Set(v185.candidateRegistry.map(x=>x.sourceId));
const prior=new Set([...v198.items,...v201.items].map(x=>x.sourceId));
for(let i=0;i<numbers.length;i++){
 const x=d.items[i],old=v168.canonicalSourceRows[numbers[i]-1];
 A.equal(old.sourceNumber,numbers[i]);
 A.equal(old.sha256,x.originalCanonicalRowSha256);
 A.equal(old.originalMappedSlo,x.originalMappedSlo);
 A.equal(old.originalCognitiveCode,x.originalAuthorCognitive);
 A.equal(old.sourceSummativeScope,x.priorV168SourceScope);
 A.equal(old.firstPassIssue,x.priorV168Issue);
 A.equal(old.academicTeacherReview,'PENDING');
 A.equal(old.scoredRelease,'HOLD');
 A.equal(reviewed.has(x.sourceId),false,'V202 overlaps previously reviewed V185 private queue');
 A.equal(prior.has(x.sourceId),false,'V202 overlaps prior source-only V198/V201');
}
for(const x of v185.candidateRegistry){
 A.equal(x.candidateIndividualRevisionSha256,null);
 A.equal(x.eligibleForStudentScoredUse,false);
 A.equal(x.scoredRelease,'HOLD');
}
const u=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u.status,'planned');A.equal(u.assessmentStatus,'not-published');A.equal(u.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const mutations=[
 x=>x.prerequisite.mergedPr=304,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='APPROVED_FOR_STUDENTS',
 x=>x.originalOwnerWordSha256='0'.repeat(64),
 x=>x.primaryOriginalNbfScanSha256[1]='0'.repeat(64),
 x=>x.officialSummativeSloLevels['P-11-B-24']='Understanding',
 x=>x.selectedNumbers.pop(),
 x=>x.selectedCount=13,
 x=>x.overlapWithExistingV18572=1,
 x=>x.overlapWithPriorV198Topic72Twelve=1,
 x=>x.promisingDirectCandidateNumbers.push(30),
 x=>x.borderlineFigureOrDuplicateNumbers.pop(),
 x=>x.supportingOrSloScopeSensitiveNumbers.pop(),
 x=>x.originalAnswerLetterErrorsFound=1,
 x=>x.privateRevisedCandidateItemsCreated=12,
 x=>x.sourceCautions.q30Q79SameABNonlinearElasticRegionOverlap=false,
 x=>x.sourceCautions.q43SquareCentimetreToSquareMetreConversionChecked=false,
 x=>x.privateAcademicPack.docxSha256='0'.repeat(64),
 x=>x.privateAcademicPack.pageCount=6,
 x=>x.privateAcademicPack.humanDecisionFieldsBlank=false,
 x=>x.privateAcademicPack.fullOriginalKeysOptionsInPublicRepository=true,
 x=>x.items.pop(),
 x=>x.items[0].sourceNumber=7,
 x=>x.items[1].originalCanonicalRowSha256='0'.repeat(64),
 x=>x.items[2].originalAuthorCognitive='A',
 x=>x.items[3].modelClassification='SCORED',
 x=>x.items[4].teacherFollowup='APPROVED',
 x=>x.items[5].originalStemOptionsKeyExplanationChanged=true,
 x=>x.items[6].newPrivateCandidateRevisionIssued=true,
 x=>x.items[7].realTeacherScienceDecision='APPROVED',
 x=>x.items[8].realTeacherCognitiveDecision='APPROVED',
 x=>x.items[9].studentScoredRelease='RELEASED',
 x=>x.items[10].answerKey='B',
 x=>x.existingDetailedPrivateCandidateQueue=84,
 x=>x.realAuthenticatedTeacherScienceApprovals=1,
 x=>x.realAuthenticatedTeacherCognitiveApprovals=1,
 x=>x.ownerScoredReleasePermissions=1,
 x=>x.scoredUnit7StudentQuestions=1,
 x=>x.teacherBackendV160='GO',
 x=>x.firebaseAuthFirestoreAppCheckChanged=true,
 x=>x.studentTestBuilderChanged=true,
 x=>x.stagingOrProductionDeployed=true,
 x=>x.nextMilestone='SCORE_NOW'
];
let denied=0;
for(const fn of mutations){
 const m=structuredClone(d);fn(m);
 A.throws(()=>validate(m),undefined,'should deny mutation '+(denied+1));denied++;
}
const memo=read(MEMO).toLowerCase();
for(const t of ['v202','v168','v185','v198','v201','stress','strain','young',
 'shear','radian','fig 7.12','q30','q79','q43','q44','q59','elastic',
 'understanding','application','teacher','pending','hold','no-go','v203'])
 A.ok(memo.includes(t),'V202 memo missing term '+t);
const qa=path.join(ROOT,'qa-artifacts/grade11-v202-topic72-next12-original-qc');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V202',sourceOriginalItems:12,
 originalSourceFingerprintsConfirmed:12,overlapsV185:0,overlapsV198:0,
 promisingDirect:8,graphFigureOrDuplicateBorderline:2,supporting:2,
 originalQuestionOrKeyChanges:0,privateRevisionsIssued:0,
 fakeSourceOrApprovalMutationsDenied:denied,authenticatedTeacherDecisions:0,
 scoredUnit7StudentItems:0,
 limitation:'PUBLIC_CI_CANNOT_VERIFY_PRIVATE_KEYED_WORD_OR_ACTUAL_HUMAN_SIGNOFF'
},null,2)+'\n');
console.log('V202 PASS: 12 new source-bound Topic7.2 originals, '+denied+' mutation denials, zero authenticated approvals or scored releases.');
