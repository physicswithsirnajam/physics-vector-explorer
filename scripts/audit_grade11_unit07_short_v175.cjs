#!/usr/bin/env node
'use strict';
/**
 * V175: source-bound FIRST-PASS academic review for NBF Grade XI Unit7
 * original end-exercise short responses 7.1–7.11.
 *
 * Public CI does not possess the original scanned book (or answer key).
 * It checks image-derived provenance metadata, SLO/topic/level estimates,
 * review flags, and zero live scored releases; NOT an official teacher key.
 */
const A=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const sha=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const TARGET='quality/unit07/unit07-v175-end-exercise-short01-11-image-bound-no-answers.json';
const REPORT='quality/grade11-v175-unit07-textbook-short01-11-science-slo-qc.md';
const BOOK='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const IMAGE_PAGE={
 '124':'ba14d65b02c65846566b7692b221cec336dd6cfc2f38e6e8292061f05c716ded',
 '125':'ce52c45baa2cc02c46a4d8e7d809093ecfab6024b12f49a38ec094f784950929'
};
const CROPS=[
 '75549db9b7989cdfb308a5c02f317685908591336099dc1e05307f77eca86fa6',
 'b1c7a9709b8c0813862a7216776d8633f0c39178d8cf9849b49d33589db88ae6',
 'db347f86342cdd05f6dc553ba6aff7760e6d84c9f3a00c4526107fbf35e42c74',
 '890826bcfcc906bd63cb6e9ea2552759fb39f74195b231b1849ebf4bcc5295ae',
 'd7bafa9b8c7d1faba053d9215616bc59251bdad3cf6f47c3cfff155c4c378a8c',
 '7aae910248e76ba3f8cb452f4f423da4280bfad276994612f721ea54f1c8c843',
 'dc47da1f7bc4dd8f090875a3ff5e9682ca81cac6f673096e6155be556145419e',
 '1361c85df33b5a5f1010b6476297659bfe21e44f4002ac179aa3734164423212',
 '89eae962f452fc0396773a7679007fc968e13ecf8b6aa5e163df08e8cac5991a',
 '22fadf27ca2811dc275cd5e909b2b94848749d16eb3bf6d8a580f4898350b1b5',
 '42ab39d0d496c92f80df5495d322fe1bf60c98e7e24587eee786a0af239fdb34'
];
const CROP_JOIN='3ca48a04fbc38b72d2f067552e2330ed1a8d5af813b1ba5f51a8c2aff21bc681';
const BOX=[
 [165,1342,1295,1400],[165,1403,1295,1436],[165,1436,1295,1465],
 [165,1468,1295,1496],[165,1498,1295,1530],[165,1531,1295,1565],
 [90,122,1295,153],[90,156,1295,211],[90,216,1295,244],
 [90,248,1295,275],[90,280,1295,308]
];
const SLO=[22,22,24,24,27,28,28,26,26,24,22];
const LEVEL=['U','U','U','U','U','U','U','U','U','U','K'];
const SUPPORT=[2,4,5,7,8,9],COMP=[2,3,5,6,8],OPT=[1,4,7,9,10];
const CATEGORY={
 1:'thermodynamic-and-glass-transition-qualifiers',
 2:'historical-glass-cloudiness-cause',
 3:'causality-not-absolute-fundamental-order',
 4:'lateral-strain-and-volume-change-qualifier',
 5:'force-extension-axis-and-region-dependence',
 6:'stored-energy-versus-signed-work',
 7:'loading-mode-and-material-dependence',
 8:'bridge-design-life-versus-automatic-danger',
 9:'metal-fatigue-and-safe-explanation',
 10:'stiffness-versus-strength'
};
const BANNED=['stem','question','questionText','originalQuestionText',
 'answer','answerText','officialKey','key','keyLetter','correctOptionText',
 'workedSolution','fullModelAnswer','publisherModelAnswer','sourceImageBytes',
 'studentUid','studentEmail','teacherUid','teacherEmail'];
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V175');
 A.ok(d.title.includes('7.1–7.11'));
 A.equal(d.sourceOriginalBookName,'11 Physics Book(6).pdf');
 A.equal(d.sourceOriginalBookSha256,BOOK);
 A.deepEqual(d.sourcePrintedPages,[125,126]);
 A.deepEqual(d.sourcePdfPageZeroIndices,[124,125]);
 A.deepEqual(d.sourceRenderedPagePngSha256,IMAGE_PAGE);
 A.deepEqual(d.sourceRenderPixelSize,{'124':[1370,1725],'125':[1370,1707]});
 A.ok(d.imageFingerprintRecipe.includes('fitz.Matrix(2.3,2.3)'));
 A.ok(d.imageFingerprintRecipe.includes('crop.tobytes()'));
 A.equal(d.all11CropHashesJoinNewlineSha256,CROP_JOIN);
 A.equal(d.sourceOriginalShortQuestions,11);
 A.equal(d.firstPassScientificAnswerConceptsReviewed,11);
 A.equal(d.printedPublisherShortAnswerKeyPresent,false);
 A.equal(d.sourceQuestionTextAndImagesUploaded,false);
 A.equal(d.modelAnswersUploaded,false);
 A.deepEqual(d.officialSummativeSloLevels,{
  'P-11-B-22':'Understanding','P-11-B-24':'Application',
  'P-11-B-26':'Understanding','P-11-B-27':'Application',
  'P-11-B-28':'Application'
 });
 A.deepEqual(d.provisionalSloCounts,{
  'P-11-B-22':3,'P-11-B-24':3,'P-11-B-26':2,
  'P-11-B-27':1,'P-11-B-28':2
 });
 A.deepEqual(d.provisionalActualItemDemand,{K:1,U:10,A:0});
 A.equal(d.preliminaryTopicAligned,5);
 A.equal(d.preliminarySupportingOrCrossSlo,6);
 A.deepEqual(d.compulsoryAcademicDecisionNumbers,COMP);
 A.deepEqual(d.optionalScientificTeachingReviewNumbers,OPT);
 A.deepEqual(d.sourceOnlyNoAmendmentNumbers,[11]);
 A.ok(d.threeImportantSafetyClarifications['Q7.2'].includes('flow'));
 A.ok(/slope/i.test(d.threeImportantSafetyClarifications['Q7.5']));
 A.ok(d.threeImportantSafetyClarifications['Q7.8'].includes('service life'));
 A.equal(d.sourceSpecificExternalChecks.length,3);
 A.deepEqual(d.sourceSpecificExternalChecks.map(x=>x.publisher),[
  'Corning Museum of Glass','Corning Museum of Glass',
  'US Federal bridge inspection rules (as engineering example, not local Pakistan law)'
 ]);
 for(const x of d.sourceSpecificExternalChecks){
  A.ok(x.url.startsWith('https://'));
 }
 A.ok(d.previousOriginalTextbookMCQReview.includes('V174'));
 for(const field of ['previousTopic71Review','previousTopic72Review','previousTopic73Review'])
  A.ok(d[field].includes('80 original'));
 A.equal(d.teacherIndividualScienceApprovals,0);
 A.equal(d.teacherIndividualCognitiveApprovals,0);
 A.equal(d.unit7ScoredPortalQuestions,0);
 for(const field of ['existingPortalQuestionBankEdited',
  'productionFirebaseOrBackendEdited','sourceTextbookChanged',
  'sourceScansOrQuestionWordingInPublicGitHub'])
  A.equal(d[field],false);
 A.equal(d.academicDecision,
  'ORIGINAL_11_FIRST_PASS_SCIENCE_REVIEW_COMPLETE_TEACHER_SIGNOFF_PENDING_STUDENT_SCORE_HOLD');
 A.ok(d.nextMilestone.startsWith('V176'));
 A.equal(d.items.length,11);
 const hashes=d.items.map(x=>x.renderedSourceCropRgbSha256);
 A.deepEqual(hashes,CROPS);
 A.equal(new Set(hashes).size,11);
 A.equal(sha(hashes.join('\n')),CROP_JOIN);
 let cognitive={K:0,U:0,A:0},slo={},support=0,core=0;
 for(let i=0;i<11;i++){
  const n=i+1,r=d.items[i],pg=n<=6?125:126,pdf=pg-1;
  A.equal(r.sourceQuestionNumber,n);
  A.equal(r.sourceExerciseNumber,'7.'+n);
  A.equal(r.sourcePrintedPage,pg);
  A.equal(r.sourcePdfPageZeroIndex,pdf);
  A.deepEqual(r.sourcePixelCropBox,BOX[i]);
  A.equal(r.nearestOfficialTheorySlo,'P-11-B-'+SLO[i]);
  A.equal(r.provisionalItemDemand,LEVEL[i]);
  A.equal(r.preliminaryScope,SUPPORT.includes(n)?
   'supplementary-cross-slo':'topic-aligned');
  A.equal(r.reviewFlag,COMP.includes(n)?'compulsory':
   OPT.includes(n)?'optional':'none');
  const flagged=COMP.includes(n)||OPT.includes(n);
  A.equal(r.reviewCategory===null,!flagged);
  A.equal(r.academicConcern===null,!flagged);
  A.equal(r.reviewAction===null,!flagged);
  if(flagged){
   A.equal(r.reviewCategory,CATEGORY[n]);
   A.ok(r.academicConcern.length>95,'Short science issue missing for original Q7.'+n);
   A.ok(r.reviewAction.length>65,'Owner retain-or-revise decision missing for Q7.'+n);
  }
  A.equal(r.originalSourceRetained,true);
  A.equal(r.independentAnswerScienceStatus,'FIRST_PASS_CHECKED_CONDITIONALLY');
  A.equal(r.teacherScienceSignoff,'PENDING');
  A.equal(r.teacherCognitiveSignoff,'PENDING');
  A.equal(r.scoredPortalRelease,'HOLD');
  for(const name of BANNED)A.equal(Object.hasOwn(r,name),false,
    'Private book or keyed-answer content forbidden in public V175: '+name);
  cognitive[LEVEL[i]]++;
  slo[r.nearestOfficialTheorySlo]=(slo[r.nearestOfficialTheorySlo]||0)+1;
  if(SUPPORT.includes(n))support++;else core++;
 }
 A.deepEqual(cognitive,{K:1,U:10,A:0});
 A.deepEqual(slo,d.provisionalSloCounts);
 A.equal(core,5);A.equal(support,6);
 for(const name of BANNED)A.equal(Object.hasOwn(d,name),false);
}
const original=load(TARGET);
validate(original);
const mutants=[
 x=>x.sourceOriginalBookSha256='0'.repeat(64),
 x=>x.sourceRenderedPagePngSha256['124']='0'.repeat(64),
 x=>x.items[0].renderedSourceCropRgbSha256='0'.repeat(64),
 x=>x.items[0].sourcePixelCropBox=[0,0,0,0],
 x=>x.items[0].sourcePrintedPage=126,
 x=>x.items[0].nearestOfficialTheorySlo='P-11-B-28',
 x=>x.items[10].provisionalItemDemand='A',
 x=>x.items[2].reviewFlag='none',
 x=>x.items[2].reviewCategory=null,
 x=>x.items[1].academicConcern='uncertain',
 x=>x.items[1].reviewAction='delete',
 x=>x.items[6].scoredPortalRelease='RELEASED',
 x=>x.items[6].teacherScienceSignoff='APPROVED',
 x=>x.items[6].teacherCognitiveSignoff='APPROVED',
 x=>x.items[1].fullModelAnswer='private answer content',
 x=>x.compulsoryAcademicDecisionNumbers=[],
 x=>x.optionalScientificTeachingReviewNumbers=[],
 x=>x.modelAnswersUploaded=true,
 x=>x.sourceScansOrQuestionWordingInPublicGitHub=true,
 x=>x.existingPortalQuestionBankEdited=true,
 x=>x.productionFirebaseOrBackendEdited=true,
 x=>x.unit7ScoredPortalQuestions=11,
 x=>x.academicDecision='SCORED_APPROVED'
];
for(const [i,mutate] of mutants.entries()){
 const x=structuredClone(original);mutate(x);
 A.throws(()=>validate(x),undefined,'Mutation '+(i+1)+' weakened academic HOLD');
}
const memo=read(REPORT);
for(const n of COMP.concat(OPT)){
 A.ok(memo.includes('**7.'+n+'**'),'Original flagged short Q7.'+n+' missing in teacher memo');
}
for(const marker of ['7.1–7.11','Q7.2','Q7.5','Q7.8',
 'P-11-B-22','P-11-B-24','P-11-B-26','P-11-B-27','P-11-B-28',
 '5 / 6','HOLD','PENDING','Corning','teacher']){
 A.ok(memo.toLowerCase().includes(marker.toLowerCase()),
  'Academic report omits expected qualification: '+marker);
}
const v174=load('quality/unit07/unit07-v174-end-exercise-mcq01-10-fig-bound-no-keys.json');
A.equal(v174.version,'V174');A.equal(v174.independentPhysicsReviewOfQuestions,10);
A.equal(v174.sourceBookTextOrScansCommitted,false);
A.equal(v174.unit7ScoredPortalQuestions,0);
const v173=load('quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
A.equal(v173.originalSourceFirstPassRowCount,80);
A.equal(v173.topic73TeacherScienceSignoffs,0);
A.equal(v173.unit7PortalScoredQuestionCount,0);
const v168=load('quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
A.equal(v168.fullOriginalQuestionRows,80);
A.equal(v168.individualTeacherScienceSignoffs,0);
A.equal(v168.unit7ScoredQuestionCount,0);
const v154=load('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
A.equal(v154.teacherScienceSignoffs,0);
A.equal(v154.teacherCognitiveSignoffs,0);
A.equal(v154.unit7ScoredReleaseCount,0);
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');
A.equal(u7.assessmentStatus,'not-published');
A.equal(u7.questionBankCount,0);
A.deepEqual(load('question-bank/manifest.json')
 .grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
 [275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,
 'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
 'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
const dir=path.join(ROOT,'qa-artifacts/grade11-v175-unit7-textbook-short11');
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({
 version:'V175',originalBookPrintedPages:[125,126],
 originalEndExerciseShortQuestions:11,originalPublisherShortAnswerKeyOnPages:false,
 independentAnswerScienceReviewCount:11,
 originalSourceImageRegions:11,originalBookPageOrTextUploaded:false,
 teacherCompulsoryScienceDecisions:COMP,teacherOptionalTeachingDecisions:OPT,
 provisionalTopicAligned:5,provisionalSupporting:6,
 actualItemDemand:{K:1,U:10,A:0},
 academicHOLDMutationsRejected:mutants.length,
 teacherScienceApprovals:0,unit7ScoredMCQs:0,
 next:'V176 original NBF Unit7 Comprehensive Q7.1–7.8'
},null,2)+'\n');
console.log('V175 PASS: original NBF Unit7 Short Questions 7.1–7.11 across two source pages; 5 compulsory/5 optional; 23 mutation denials, zero scored Unit7.');
