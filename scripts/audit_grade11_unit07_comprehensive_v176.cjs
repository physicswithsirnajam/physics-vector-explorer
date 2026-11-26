#!/usr/bin/env node
'use strict';
/**
 * V176: keyless NBF Grade XI Unit7 original Comprehensive Questions 7.1-7.8.
 * Original textbook printed p126 was visually verified using the owner's two
 * newly uploaded page images. Eight question-region RGB fingerprints refer to
 * the newly uploaded PNG; historic original full-book PDF SHA is carried only,
 * NOT recomputed. Protect teacher HOLD, privacy, and no scored release.
 */
const A=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const LEDGER='quality/unit07/unit07-v176-comprehensive01-08-source-linked-no-answers.json';
const MEMO='quality/grade11-v176-unit07-comprehensive01-08-science-slo-qc.md';
const BOOK='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const STUDENT='d398324caaaf3bd8ce4025df5722631da85ee723421f8872f730c5ad641f6531';
const SOLVED='f8b6496c8ad6e7ef086caacc07d1bf52eb39e5de12d92428f4617cdd51a5a524';
const UPLOADED_PAGE_SHA='c927129db10d9a4ea36be7f0cf4e036a69b9e720590310446fd2a00230ae393b';
const UPLOADED_PHOTO_SHA='bc4886d03754d1b3b7e4ac6b23295ee9f27aaf03de68b08e1230ebb6cb6fc637';
const PAGE_CROPS=[
 [52,251,752,270],[52,271,752,289],[52,290,752,308],[52,310,752,327],
 [52,329,752,347],[52,348,752,366],[52,367,752,385],[52,387,752,404]
];
const PAGE_RGB=[
 '3f6d720887186bad4da36504303723024b310773d873eb4286a4a8934139e651',
 'ec909e263c3e40afde4e4d6f2cc0f03eb9cc71cc6b8b99589fc362eab02114f1',
 '2cba2bb090e8f2168c36b3bb160339d4556e70387d255c2a5bcf08f10023bb3a',
 'afeb6c05c7d9f999781ec2d5b168f10b44ef276529d8a57420633dd506d91a0c',
 '1555ee2ecbaaf42a4ffcb144dd285d62532a28fd494ded9734693b061360eb83',
 'e6f1925331dfbe19312289cc40f40ff81c00d0be1a07a909e1021400fb94d35a',
 'd85b66b0bae1df4e8525a24798d7b0f6d6ae21723e809ff78291e3f0f060d656',
 '84eabde22c574a7a99c5cb8314b236ae25510b0f1c796027984ffd234d65d593'
];
const CROPS_JOIN_SHA='0dedfadbdbab61c804553aa14c8a68314f25b88a037fb408c5db3f32f8906930';
const SLO=[22,22,24,26,26,27,28,25];
const DEMAND=['U','U','U','U','U','A','A','U'];
const SUPPORT=[2,3],COMP=[2,4,6,7,8],OPT=[1,3,5];
const CATEGORIES=[
 'crystal-grain-versus-chemical-polymer-classification',
 'primitive-versus-conventional-cubic-cell',
 'matched-stress-strain-and-linear-modulus',
 'schematic-ductile-curve-and-engineering-stress',
 'recoverable-versus-residual-strain-on-unloading',
 'work-integral-axes-and-nonlinear-generality',
 'linear-elastic-stored-energy-not-any-loading-path',
 'wire-apparatus-reference-load-and-measurements'
];
const BANNED=[
 'stem','prompt','question','questionText','originalQuestionText','originalPrompt',
 'answer','answerText','publisherAnswer','answerKey','correctOption','correctOptionText',
 'key','keyLetter','workedSolution','completeSolution','fullModelAnswer',
 'sourceScan','sourceImageBytes','sourceQuestionImage','studentUid','studentEmail',
 'teacherUid','teacherEmail'
];
function checkNoPrivatePayload(x,where){
 for(const k of BANNED){
  A.equal(Object.hasOwn(x,k),false,where+' may not upload private keyed/source payload: '+k);
 }
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V176');
 A.ok(d.title.includes('7.1–7.8'));
 A.equal(d.sourceOriginalBookName,'11 Physics Book(6).pdf');
 A.equal(d.sourceOriginalBookSha256CarriedFromV175,BOOK);
 A.equal(d.originalBookReopenedAndShaRecomputedThisPass,false);
 A.equal(d.sourcePrintedPage,126);A.equal(d.sourcePdfPageZeroIndex,125);
 A.equal(d.sourceVisualPageCropVerificationThisPass,'VERIFIED_USER_UPLOADED_PRINTED_PAGE_IMAGE');
 A.equal(d.originalQuestionRegionHashesClaimed,true);
 const src=d.uploadedPrintedPageImageSource;
 A.equal(src.primaryFilename,'image(20261126-011636).png');
 A.equal(src.primaryFileSha256,UPLOADED_PAGE_SHA);
 A.deepEqual(src.primaryImageDimensionsPixels,[826,1030]);
 A.equal(src.confirmationPhotoFilename,'Unit 7 (Page 126).jpeg');
 A.equal(src.confirmationPhotoSha256,UPLOADED_PHOTO_SHA);
 A.ok(src.cropRecipe.includes('USER UPLOADED ORIGINAL PAGE PNG'));
 A.equal(src.orderedEightCropHashesJoinedWithNewlineSha256,CROPS_JOIN_SHA);
 A.equal(src.cropHashesAttestUserUploadedPageOnly,true);
 A.equal(src.originalFullTextbookPdfRerendered,false);
 A.ok(d.sourceImageVerificationInterpretation.includes('NOT pixel hashes'));
 A.equal(d.derivativeStudentPracticeFile,
  'Grade11_Unit7_EndOfUnit_8Comprehensive_Student_Practice.pdf');
 A.equal(d.derivativeStudentPracticeSha256,STUDENT);
 A.equal(d.derivativeSolvedStudyFile,
  'Grade11_Unit7_EndOfUnit_8Comprehensive_Solved.pdf');
 A.equal(d.derivativeSolvedStudySha256,SOLVED);
 A.equal(d.publicSourceTranscriptionUrl,
  'https://lms.pkpoint.com/stream-ebook.php?download=1&id=219');
 A.ok(d.evidenceBoundary.includes('NOT recomputed'));
 A.equal(d.originalComprehensiveQuestionsCount,8);
 A.equal(d.firstPassPhysicsConceptsReviewed,8);
 A.equal(d.originalQuestionTextOrScansUploaded,false);
 A.equal(d.fullSolutionsOrKeysUploaded,false);
 A.deepEqual(d.officialSummativeSloLevels,{
  'P-11-B-22':'Understanding',
  'P-11-B-24':'Application',
  'P-11-B-25':'Understanding',
  'P-11-B-26':'Understanding',
  'P-11-B-27':'Application',
  'P-11-B-28':'Application'
 });
 A.deepEqual(d.provisionalSloCounts,{
  'P-11-B-22':2,'P-11-B-24':1,'P-11-B-25':1,
  'P-11-B-26':2,'P-11-B-27':1,'P-11-B-28':1
 });
 A.deepEqual(d.provisionalActualItemDemand,{K:0,U:6,A:2});
 A.equal(d.preliminaryTopicAligned,6);
 A.equal(d.preliminarySupportingOrCrossSlo,2);
 A.deepEqual(d.compulsoryTeacherDecisionNumbers,COMP);
 A.deepEqual(d.optionalTeachingReviewNumbers,OPT);
 A.equal(d.firstPassTeacherScienceSignoffs,0);
 A.equal(d.firstPassTeacherCognitiveSignoffs,0);
 A.equal(d.unit7ScoredPortalQuestions,0);
 for(const field of ['portalQuestionBankEdited',
  'sourceTextbookOrStudyEditionsEdited','backendOrFirebaseEdited'])
  A.equal(d[field],false);
 A.equal(d.academicDecision,
  'FIRST_PASS_SOURCE_LINKED_ONLY_ORIGINAL_SCAN_CROP_PENDING_TEACHER_APPROVAL_PENDING_SCORE_HOLD');
 A.ok(d.nextMilestone.startsWith('V177'));
 A.equal(d.items.length,8);
 const counts={K:0,U:0,A:0},sloCounts={},numbers=[];
 for(let i=0;i<8;i++){
  const r=d.items[i],n=i+1; numbers.push(r.sourceQuestionNumber);
  A.equal(r.sourceQuestionNumber,n);A.equal(r.sourceExerciseNumber,'7.'+n);
  A.equal(r.sourcePrintedPage,126);A.equal(r.sourcePdfPageZeroIndex,125);
  A.equal(r.nearestOfficialTheorySlo,'P-11-B-'+SLO[i]);
  A.equal(r.provisionalItemDemand,DEMAND[i]);
  A.equal(r.preliminaryScope,SUPPORT.includes(n)?
   'supplementary-cross-slo':'topic-aligned');
  A.equal(r.reviewFlag,COMP.includes(n)?'compulsory':'optional');
  A.equal(r.reviewCategory,CATEGORIES[i]);
  A.ok(r.academicConcern.length>90,'Missing science caveat for 7.'+n);
  A.ok(r.reviewAction.length>85,'Missing retain/review action for 7.'+n);
  A.equal(r.originalSourceRetained,true);
  A.equal(r.firstPassPhysicsStatus,'UPLOADED_PRINTED_PAGE_VISUALLY_VERIFIED_AND_CONCEPT_SCIENCE_FIRST_PASS');
  A.equal(r.originalScannedPageCropVerifiedThisPass,true);
  A.deepEqual(r.sourceUploadedPagePixelCropBox,PAGE_CROPS[i]);
  A.equal(r.sourceUploadedPageCropRgbSha256,PAGE_RGB[i]);
  A.equal(r.teacherScienceSignoff,'PENDING');
  A.equal(r.teacherCognitiveSignoff,'PENDING');
  A.equal(r.scoredPortalRelease,'HOLD');
  checkNoPrivatePayload(r,'item '+n);
  counts[DEMAND[i]]++;
  sloCounts[r.nearestOfficialTheorySlo]=(sloCounts[r.nearestOfficialTheorySlo]||0)+1;
 }
 A.deepEqual(numbers,[1,2,3,4,5,6,7,8]);
 A.deepEqual(counts,{K:0,U:6,A:2});
 A.deepEqual(sloCounts,d.provisionalSloCounts);
 checkNoPrivatePayload(d,'ledger');
}
const d=load(LEDGER);
validate(d);
const mutants=[
 x=>x.schemaVersion=2,
 x=>x.sourceOriginalBookSha256CarriedFromV175='0'.repeat(64),
 x=>x.originalBookReopenedAndShaRecomputedThisPass=true,
 x=>x.sourceVisualPageCropVerificationThisPass='UNVERIFIED',
 x=>x.originalQuestionRegionHashesClaimed=false,
 x=>x.uploadedPrintedPageImageSource.primaryFileSha256='0'.repeat(64),
 x=>x.uploadedPrintedPageImageSource.confirmationPhotoSha256='0'.repeat(64),
 x=>x.uploadedPrintedPageImageSource.orderedEightCropHashesJoinedWithNewlineSha256='0'.repeat(64),
 x=>x.items[0].sourceUploadedPageCropRgbSha256='0'.repeat(64),
 x=>x.items[2].sourceUploadedPagePixelCropBox=[0,0,0,0],
 x=>x.derivativeStudentPracticeSha256='0'.repeat(64),
 x=>x.derivativeSolvedStudySha256='0'.repeat(64),
 x=>x.originalComprehensiveQuestionsCount=7,
 x=>x.items.pop(),
 x=>x.items[0].originalScannedPageCropVerifiedThisPass=false,
 x=>x.items[0].sourceQuestionNumber=2,
 x=>x.items[1].sourcePrintedPage=125,
 x=>x.items[2].nearestOfficialTheorySlo='P-11-B-28',
 x=>x.items[5].provisionalItemDemand='U',
 x=>x.items[1].reviewFlag='optional',
 x=>x.items[1].reviewCategory='unreviewed',
 x=>x.items[3].academicConcern='brief',
 x=>x.items[6].reviewAction='delete',
 x=>x.items[0].scoredPortalRelease='RELEASED',
 x=>x.items[7].teacherScienceSignoff='APPROVED',
 x=>x.items[7].teacherCognitiveSignoff='APPROVED',
 x=>x.items[2].fullModelAnswer='DO NOT COMMIT',
 x=>x.originalQuestionTextOrScansUploaded=true,
 x=>x.fullSolutionsOrKeysUploaded=true,
 x=>x.unit7ScoredPortalQuestions=8,
 x=>x.backendOrFirebaseEdited=true,
 x=>x.academicDecision='SCORED_APPROVED'
];
for(const [i,mutate] of mutants.entries()){
 const x=structuredClone(d);mutate(x);
 A.throws(()=>validate(x),undefined,'Mutation '+(i+1)+' did not fail');
}
const memo=read(MEMO);
for(const n of [...COMP,...OPT]){
 A.ok(memo.includes('**7.'+n+'**'),'Missing review row for question '+n);
}
for(const marker of ['source','PENDING','HOLD','original','primitive',
 'conventional','stress','force','extension','energy density','elastic',
 '7.1–7.8','B-22','B-24','B-25','B-26','B-27','B-28']){
 A.ok(memo.toLowerCase().includes(marker.toLowerCase()),
  'Memo missing boundary or science marker: '+marker);
}
const v175=load('quality/unit07/unit07-v175-end-exercise-short01-11-image-bound-no-answers.json');
A.equal(v175.sourceOriginalShortQuestions,11);
A.equal(v175.unit7ScoredPortalQuestions,0);
const v174=load('quality/unit07/unit07-v174-end-exercise-mcq01-10-fig-bound-no-keys.json');
A.equal(v174.independentPhysicsReviewOfQuestions,10);
A.equal(v174.unit7ScoredPortalQuestions,0);
const v173=load('quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
A.equal(v173.originalSourceFirstPassRowCount,80);
A.equal(v173.unit7PortalScoredQuestionCount,0);
const v168=load('quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
A.equal(v168.fullOriginalQuestionRows,80);
A.equal(v168.unit7ScoredQuestionCount,0);
const v154=load('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
A.equal(v154.teacherScienceSignoffs,0);
A.equal(v154.unit7ScoredReleaseCount,0);
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');
A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.deepEqual(load('question-bank/manifest.json')
 .grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
 [275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,
 'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
 'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const art=path.join(ROOT,'qa-artifacts/grade11-v176-unit7-comprehensive8');
fs.mkdirSync(art,{recursive:true});
fs.writeFileSync(path.join(art,'summary.json'),JSON.stringify({
 version:'V176',questionsReviewed:8,originalUploadedPageRegionsVisuallyVerifiedThisPass:8,
 historicFullBookPdfRerendered:false,
 requiredTeacherDecisions:COMP,optionalTeacherImprovements:OPT,
 preliminaryItemDemand:{K:0,U:6,A:2},provisionalTopicAligned:6,
 provisionalSupportingOrCrossSlo:2,scoredReleaseMutationDenials:mutants.length,
 teacherScienceSignoffs:0,teacherCognitiveSignoffs:0,unit7Scored:0,
 next:'V177 printed numerical problems 7.1–7.5'
},null,2)+'\n');
console.log('V176 PASS: 8 original NBF page-126 question-image regions verified from uploaded printed page; 5 compulsory/3 optional; '+mutants.length+' intentional HOLD violations denied; 0 scored Unit7 items.');
