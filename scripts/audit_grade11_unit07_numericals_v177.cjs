#!/usr/bin/env node
'use strict';
/*
 * V177 — NBF XI Unit7 original five end-of-unit numerical problems, p126.
 * Original textbook page images, problem statements and worked answers remain
 * private. Hashes cover USER-UPLOADED PNG pixels, not a historical PDF render.
 * CI validates keyless review provenance, answer-hint classifications,
 * teacher PENDING and score HOLD, NOT independent publisher-key correctness.
 */
const A=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const digest=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const LEDGER='quality/unit07/unit07-v177-end-exercise-numerical01-05-image-bound-no-keys.json';
const MEMO='quality/grade11-v177-unit07-textbook-numerical01-05-science-slo-qc.md';
const BOOK='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const UPLOADED='c927129db10d9a4ea36be7f0cf4e036a69b9e720590310446fd2a00230ae393b';
const PHOTO='bc4886d03754d1b3b7e4ac6b23295ee9f27aaf03de68b08e1230ebb6cb6fc637';
const ORDERED='8d7029b13367e13c018b5001a856ce2a7adffa22b174e5104aff5fb40a4f4238';
const QSHA=[
 'b2e0b870507e28dfd15447b9500a92a66c61c2a109cc3f0080696284e61aea74',
 '5ffdb68cbc7e3245b1a4a7fc41f2625ec8326cefd6a867af9b497a223b09e6ef',
 '669a5c4ebef6b3cb86ace6988f80c2de609f2c2ceb1b7eb3ccf5e0858585e562',
 'cb5a22d87e70840b02140713126ee5ec97699c0c7c7875a125ebfeb97b66d18f',
 '9d2eb0c8bcae933551729733994f73f4d1dfa7f1d68e15b78be35ed5364a93e0'
];
const BOX=[
 [56,436,782,590],[56,570,782,698],[56,690,782,802],
 [56,795,782,858],[56,854,782,910]
];
const DIAGRAM='31bd4508d5e405b1a53c2b163d33622002b4e294f13ceaf365cf723173b6f381';
const SLO=[24,24,24,28,24],HINT=['conditional-only','consistent','inconsistent','inconsistent','inconsistent'];
const MUST=[1,3,4,5],CLEAN=[2],SUPPORT=[1];
const CAT=[
 'young-vs-shear-modulus-and-cantilever-model',
 null,
 'serial-wires-modulus-and-answer-hints',
 'stress-energy-area-length-hint-factor',
 'rod-diameter-tenfold-stress-hint'
];
const FORBIDDEN=[
 'stem','question','questionText','originalQuestionText','textbookQuestion',
 'answer','answerText','answerHint','printedAnswer','publishedKey','modelAnswer',
 'workedSolution','key','keyLetter','correctOption','correctOptionText',
 'sourceImage','imageBytes','teacherUid','studentUid','teacherEmail','studentEmail'
];
function noLeaks(x,scope){
 for(const name of FORBIDDEN)A.equal(Object.hasOwn(x,name),false,
  'Unapproved keyed/source/PII field '+scope+'.'+name);
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V177');
 A.ok(d.title.includes('Numericals 7.1–7.5'));
 A.equal(d.prerequisites.previousPR,280);
 A.equal(d.prerequisites.previousVersion,'V176');
 A.equal(d.prerequisites.previousVersionMerged,true);
 A.equal(d.historicFullNbfBookName,'11 Physics Book(6).pdf');
 A.equal(d.historicFullNbfBookSha256,BOOK);
 A.equal(d.historicFullBookReopenedOrRehashedThisPass,false);
 A.equal(d.sourcePrintedPage,126);
 A.equal(d.sourcePdfZeroIndex,125);
 const s=d.sourceEvidence;
 A.equal(s.primaryOriginalPageFilename,'image(20261126-011636).png');
 A.equal(s.primaryOriginalPageSha256,UPLOADED);
 A.deepEqual(s.primarySizePixels,[826,1030]);
 A.equal(s.confirmingOriginalPagePhotoFilename,'Unit 7 (Page 126).jpeg');
 A.equal(s.confirmingOriginalPagePhotoSha256,PHOTO);
 A.deepEqual(s.confirmingSizePixels,[900,1266]);
 A.ok(s.fingerprintMethod.includes('USER-UPLOADED')||s.fingerprintMethod.includes('user-uploaded'));
 A.ok(s.fingerprintMethod.includes("crop.tobytes()"));
 A.ok(s.fingerprintMethod.includes('NOT image hashes'));
 A.equal(s.fiveSourceQuestionCropSha256JoinNewlineSha256,ORDERED);
 A.deepEqual(s.diagramSourceCropBox,[594,438,784,660]);
 A.equal(s.diagramSourceCropRgbSha256,DIAGRAM);
 A.equal(d.originalNumericalQuestionCount,5);
 A.equal(d.questionsImageBoundAndVisuallyReviewed,5);
 A.equal(d.originalQuestionTextAndFigurePublished,false);
 A.equal(d.printedAnswerHintsPresent,true);
 A.equal(d.publisherWorkedSolutionsOnPagePresent,false);
 A.equal(d.privateTeacherWorkedResultsPublished,false);
 A.equal(d.independentlyCalculatedAllFive,true);
 A.deepEqual(d.printedHintsFullyConsistentNumbers,[2]);
 A.deepEqual(d.printedHintConditionallyReproducibleNumbers,[1]);
 A.deepEqual(d.printedHintsInconsistentWithGivenDataNumbers,[3,4,5]);
 A.deepEqual(d.compulsoryTeacherReviewNumbers,MUST);
 A.deepEqual(d.optionalTeacherReviewNumbers,[]);
 A.deepEqual(d.firstPassNoAmendmentNumbers,CLEAN);
 A.deepEqual(d.provisionalPrimarySloCounts,{'P-11-B-24':4,'P-11-B-28':1});
 A.deepEqual(d.officialSummativeSloLevels,
  {'P-11-B-24':'Application','P-11-B-28':'Application'});
 A.deepEqual(d.provisionalActualItemDemand,{K:0,U:0,A:5});
 A.equal(d.provisionalDirectOutcomeCandidates,4);
 A.equal(d.provisionalSupportingOrCrossSloCandidates,1);
 A.deepEqual(d.priorOriginalExerciseReviews,{mcq:'V174',short:'V175',comprehensive:'V176'});
 for(const k of ['originalUserStudyEditionPreserved','existingStudentPortalQuestionBankEdited',
  'sourceTextbookRewritten','firebaseTeacherBackendEdited','sourceScansOrCompleteAnswersCommitted']){
  A.equal(d[k],k==='originalUserStudyEditionPreserved');
 }
 A.equal(d.teacherIndividualScienceSignoffs,0);
 A.equal(d.teacherIndividualCognitiveSignoffs,0);
 A.equal(d.unit7ScoredPortalQuestionCount,0);
 A.equal(d.academicDecision,
  'FIRST_PASS_IMAGE_BOUND_NUMERICAL_REVIEW_DONE_FOUR_TEACHER_DECISIONS_PENDING_NO_SCORED_RELEASE');
 A.ok(d.nextMilestone.startsWith('V178'));
 A.equal(d.items.length,5);
 A.deepEqual(d.items.map(x=>x.sourceQuestionNumber),[1,2,3,4,5]);
 A.deepEqual(d.items.map(x=>x.uploadedPageCropRgbSha256),QSHA);
 A.equal(new Set(QSHA).size,5);
 A.equal(digest(QSHA.join('\n')),ORDERED);
 let counts={K:0,U:0,A:0},slo={},direct=0,supporting=0;
 for(let i=0;i<5;i++){
  const r=d.items[i],n=i+1,p='P-11-B-'+SLO[i];
  A.equal(r.sourceExerciseNumber,'7.'+n);
  A.equal(r.sourcePrintedPage,126);A.equal(r.sourcePdfZeroIndex,125);
  A.deepEqual(r.uploadedPagePixelCropBox,BOX[i]);
  A.equal(r.uploadedPageCropRgbSha256,QSHA[i]);
  A.equal(r.nearestOfficialSummativeSlo,p);
  A.deepEqual(r.secondaryRelatedSummativeSlos,n===3?['P-11-B-28']:n===4?['P-11-B-24']:[]);
  A.equal(r.provisionalActualCognitive,'A');
  A.equal(r.provisionalSloCoverage,SUPPORT.includes(n)?
   'supporting-cross-slo':'direct-outcome-candidate');
  A.equal(r.teacherReviewPriority,MUST.includes(n)?'compulsory':'none');
  A.equal(r.originalPrintedAnswerHintStatus,HINT[i]);
  A.equal(r.issueCategory,CAT[i]);
  if(MUST.includes(n)){
   A.ok(r.academicConcern.length>140);
   A.ok(r.teacherAction.length>125);
  }else{
   A.equal(r.academicConcern,null);
   A.equal(r.teacherAction,null);
  }
  A.equal(r.sourceOriginalQuestionAndHintRetained,true);
  A.equal(r.rawSourceQuestionAndAnswersInGithub,false);
  A.equal(r.independentlySolvedFromSourceNumbers,true);
  A.equal(r.teacherScienceSignoff,'PENDING');
  A.equal(r.teacherCognitiveSignoff,'PENDING');
  A.equal(r.studentScoredRelease,'HOLD');
  noLeaks(r,'item'+n);
  counts[r.provisionalActualCognitive]++;
  slo[p]=(slo[p]||0)+1;
  if(SUPPORT.includes(n))supporting++;else direct++;
 }
 A.deepEqual(counts,{K:0,U:0,A:5});
 A.deepEqual(slo,d.provisionalPrimarySloCounts);
 A.equal(direct,4);A.equal(supporting,1);
 noLeaks(d,'ledger');
}
const d=load(LEDGER);
validate(d);
const mutations=[
 x=>x.historicFullNbfBookSha256='0'.repeat(64),
 x=>x.historicFullBookReopenedOrRehashedThisPass=true,
 x=>x.sourcePrintedPage=125,
 x=>x.sourceEvidence.primaryOriginalPageSha256='0'.repeat(64),
 x=>x.sourceEvidence.primarySizePixels=[0,0],
 x=>x.sourceEvidence.confirmingOriginalPagePhotoSha256='0'.repeat(64),
 x=>x.sourceEvidence.diagramSourceCropRgbSha256='0'.repeat(64),
 x=>x.sourceEvidence.diagramSourceCropBox=[0,0,0,0],
 x=>x.sourceEvidence.fiveSourceQuestionCropSha256JoinNewlineSha256='0'.repeat(64),
 x=>x.items[0].uploadedPageCropRgbSha256='0'.repeat(64),
 x=>x.items[3].uploadedPagePixelCropBox=[0,0,0,0],
 x=>x.items[0].sourceQuestionNumber=2,
 x=>x.items[1].sourcePdfZeroIndex=124,
 x=>x.items.pop(),
 x=>x.originalNumericalQuestionCount=4,
 x=>x.questionsImageBoundAndVisuallyReviewed=4,
 x=>x.printedHintsFullyConsistentNumbers=[1,2],
 x=>x.printedHintConditionallyReproducibleNumbers=[],
 x=>x.printedHintsInconsistentWithGivenDataNumbers=[5],
 x=>x.compulsoryTeacherReviewNumbers=[],
 x=>x.optionalTeacherReviewNumbers=[1],
 x=>x.items[1].teacherReviewPriority='optional',
 x=>x.items[0].originalPrintedAnswerHintStatus='consistent',
 x=>x.items[2].issueCategory='none',
 x=>x.items[2].academicConcern='too vague',
 x=>x.items[3].teacherAction='delete',
 x=>x.items[0].nearestOfficialSummativeSlo='P-11-B-28',
 x=>x.items[3].provisionalActualCognitive='K',
 x=>x.items[0].studentScoredRelease='RELEASED',
 x=>x.items[2].teacherScienceSignoff='APPROVED',
 x=>x.items[3].teacherCognitiveSignoff='APPROVED',
 x=>x.items[1].workedSolution='PRIVATE FULL ANSWER',
 x=>x.originalQuestionTextAndFigurePublished=true,
 x=>x.privateTeacherWorkedResultsPublished=true,
 x=>x.existingStudentPortalQuestionBankEdited=true,
 x=>x.firebaseTeacherBackendEdited=true,
 x=>x.unit7ScoredPortalQuestionCount=5,
 x=>x.academicDecision='PUBLIC_SCORING_APPROVED'
];
for(const [i,mutate] of mutations.entries()){
 const t=structuredClone(d);mutate(t);
 A.throws(()=>validate(t),undefined,'Failed to reject academic leak #'+(i+1));
}
const m=read(MEMO);
for(const n of MUST){
 A.ok(m.includes('**7.'+n+'**'),'Source numerical Q7.'+n+' missing from memo');
}
for(const phrase of ['7.1–7.5','Young modulus','shear modulus',
 'Poisson','two-wire','factor','P-11-B-24','P-11-B-28',
 'PENDING','HOLD','Source','source','V178']){
 A.ok(m.toLowerCase().includes(phrase.toLowerCase()),
   'Teacher memo missing mandatory discussion: '+phrase);
}
const v176=load('quality/unit07/unit07-v176-end-exercise-comprehensive01-08-image-bound-no-answers.json');
A.equal(v176.version,'V176');A.equal(v176.originalPrintedComprehensiveQuestionCount,8);
A.equal(v176.unit7ScoredPortalQuestionCount,0);
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
const catalog=load('portal/learning-catalog.json');
const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.deepEqual(load('question-bank/manifest.json').grades.find(g=>g.grade===11)
 .units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
 'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const artifact=path.join(ROOT,'qa-artifacts/grade11-v177-unit7-nbf-numericals');
fs.mkdirSync(artifact,{recursive:true});
fs.writeFileSync(path.join(artifact,'summary.json'),JSON.stringify({
 version:'V177',sourcePrintedPage:126,originalNumericalProblems:5,
 originalUploadedPageSourceRegions:5,originalDiagramRegions:1,
 originalPrintedHintsMatched:1,originalPrintedHintsConditional:1,
 originalPrintedHintsInconsistent:3,compulsoryTeacherDecisions:MUST,
 noAmendment:[2],provisionalSloCounts:d.provisionalPrimarySloCounts,
 actualItemDemand:d.provisionalActualItemDemand,
 academicMutationsDenied:mutations.length,teacherScienceApprovals:0,
 unit7ScoredReleases:0,next:'V178 Unit7 consolidated teacher decision queue'
},null,2)+'\n');
console.log('V177 PASS: 5 source-image-bound textbook numericals; 1 matched/1 conditional/3 disputed hints; '+mutations.length+' fail-closed mutations; ZERO Unit7 scored.');
