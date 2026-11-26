#!/usr/bin/env node
'use strict';
/*
 * V176: source-IMAGE-bound academic review of NBF Grade XI Unit7 original
 * Comprehensive Questions 7.1–7.8 on printed p126. The source PDF and
 * teacher model answers are private. CI verifies reviewer metadata and
 * nonrelease guarantees, NOT private source-physics independently.
 */
const A=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const hash=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const LEDGER='quality/unit07/unit07-v176-end-exercise-comprehensive01-08-image-bound-no-answers.json';
const MEMO='quality/grade11-v176-unit07-textbook-comprehensive01-08-science-slo-qc.md';
const BOOK='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const PNG='ce52c45baa2cc02c46a4d8e7d809093ecfab6024b12f49a38ec094f784950929';
const JOIN='7b2bbe719750385f55ad9c2d5ad77044581a2495caf2478018a32efc5c176485';
const CROPS=[
 'd54471dea9cacefc46125fab095976a20abec7b015dc465016b526bf1ced2e33',
 '12c9d9d660254f9261eeca59df956d20cf1d9d9ccd238fce9a57fe1930be76b4',
 '6f637eef00bcbb76a4d610c6e440aac20acb5463dbb5b5a1439db58f9c63f5c9',
 '870f2798f5728bb03a4046fb338f8e59b6863dfe73efa83c2cbae9f9fb30fe71',
 '947b645a80ce2e7081fa791b6aba2b57dd005c8c213fa441e4d54634800d6380',
 'b62d1a5b7003b48a5de9dee78e8dbc064262e8e13c2032c50973aa3a341e9843',
 '9bbc1b94f3e2738724bb1f7951893fe44bfc4096211e31d753a5faeea4a83ba1',
 '93154e3bc68a1de4cd4ba0b48cadd453732b8ae585722859463a992047bc2b83'
];
const BOX=[
 [88,416,1310,450],[88,449,1310,483],[88,483,1310,517],
 [88,517,1310,551],[88,550,1310,584],[88,583,1310,617],
 [88,617,1310,648],[88,648,1310,673]
];
const SLO=[22,22,24,26,26,27,28,25];
const COG=['U','U','U','U','U','A','A','U'];
const PAGES=[[113,116],[115,116],[117,119],[120,121],
 [120,121],[122,122],[123,124],[122,122]];
const MUST=[2,4,5,6,7,8],OPT=[1,3];
const SUPPORT=[1,2,3],FIGURES=[4,5,6,8];
const ISSUE_TYPES={
 1:'three-categories-not-an-exhaustive-classification',
 2:'two-distinct-unit-cell-classifications',
 3:'modulus-of-elasticity-versus-youngs-modulus-and-level',
 4:'ductile-curve-regions-and-graph-labels',
 5:'plastic-elastic-boundaries-and-overlap',
 6:'work-graph-reversed-source-axes',
 7:'hooke-law-energy-derivation-and-dimensional-scope',
 8:'two-wire-apparatus-measurement-and-uncertainty'
};
const OFFICIAL={
 'P-11-B-22':'Understanding','P-11-B-24':'Application',
 'P-11-B-25':'Understanding','P-11-B-26':'Understanding',
 'P-11-B-27':'Application','P-11-B-28':'Application'
};
const FORBIDDEN=[
 'stem','originalStem','question','originalQuestionText','options','optionText',
 'answer','answerLetter','key','keyLetter','correctOptionText','fullModelAnswer',
 'workedSolution','sourcePageImage','textbookPageBytes','teacherAnswer',
 'studentEmail','studentUid','teacherEmail','teacherUid'
];
function check(d){
 A.equal(d.schemaVersion,1);
 A.equal(d.version,'V176');
 A.ok(d.title.includes('Comprehensive Questions 7.1–7.8'));
 A.equal(d.sourceNbfBookName,'11 Physics Book(6).pdf');
 A.equal(d.sourceNbfBookSha256,BOOK);
 A.equal(d.sourcePrintedPage,126);
 A.equal(d.sourcePdfIndexZeroBased,125);
 A.deepEqual(d.sourceRenderedPagePixelDimensions,[1370,1707]);
 A.equal(d.sourceRenderedPngSha256,PNG);
 A.ok(d.sourceFingerprintRecipe.includes('fitz.Matrix(2.3,2.3)'));
 A.ok(d.sourceFingerprintRecipe.includes('crop.tobytes()'));
 A.equal(d.orderedEightSourceCropHashesJoinNewlineSha256,JOIN);
 A.equal(d.originalPrintedComprehensiveQuestionCount,8);
 A.equal(d.sourcePublisherAnswerKeyOnPage,false);
 A.equal(d.sourceOriginalQuestionTextsPublished,false);
 A.equal(d.sourceOriginalPageImagePublished,false);
 A.equal(d.modelAnswerPayloadPublished,false);
 A.equal(d.scientificExpectedAnswerConceptsFirstPassReviewed,8);
 A.ok(d.officialFBISEFramework.includes('Summative')||d.officialFBISEFramework.includes('summative'));
 A.deepEqual(d.officialSummativeSloCognitive,OFFICIAL);
 A.deepEqual(d.originalNearestSloCounts,{
  'P-11-B-22':2,'P-11-B-24':1,'P-11-B-25':1,
  'P-11-B-26':2,'P-11-B-27':1,'P-11-B-28':1});
 A.deepEqual(d.preliminaryActualCognitiveCounts,{K:0,U:6,A:2});
 A.equal(d.preliminaryStrictDirectOutcomeCandidates,5);
 A.equal(d.preliminarySupportingOrPartialOutcomeCandidates,3);
 A.deepEqual(d.compulsoryTeacherAcademicDecisionNumbers,MUST);
 A.deepEqual(d.optionalTeacherEditorialDecisionNumbers,OPT);
 A.deepEqual(d.sourceQuestionMissingProvidedStimulusNumbers,[]);
 A.deepEqual(d.teacherAnswerFigureRequirements,FIGURES);
 A.ok(d.sourceBookFig712StressStrainAxes.includes('stress vertically'));
 A.ok(d.sourceBookFig712StressStrainAxes.includes('Proportional limit'));
 A.ok(d.sourceBookFig714WorkAxesDiscrepancy.includes('extension vertically'));
 A.ok(d.sourceBookFig714WorkAxesDiscrepancy.includes('integral F dx'));
 A.equal(d.sourceExperimentReferencePage,122);
 A.deepEqual(d.sourceEnergyDerivationPages,[123,124]);
 A.equal(d.potentialOverlapGroups.length,2);
 A.deepEqual(d.potentialOverlapGroups.map(x=>x.sourceQuestionNumbers),[[4,5],[6,7]]);
 for(const x of d.potentialOverlapGroups)A.ok(x.treatment.length>55);
 A.equal(d.currentSourceHasNoOfficialPrintedComprehensiveAnswerKey,true);
 for(const k of ['priorUnit07OriginalTextbookMcqsReview','priorUnit07OriginalTextbookShortsReview',
 'priorOwnerTopic71OriginalMcqsReview','priorOwnerTopic72OriginalMcqsReview','priorOwnerTopic73OriginalMcqsReview'])
  A.ok(d[k].length>25,'Prior review missing '+k);
 A.equal(d.teacherIndividualScienceApprovals,0);
 A.equal(d.teacherIndividualCognitiveApprovals,0);
 A.equal(d.unit7ScoredPortalQuestionCount,0);
 for(const k of ['existingGithubQuestionBankChanged','originalScannedTextbookModified',
  'firebaseTeacherBackendChanged','privateBookContentOrAnswerKeysCommitted'])
  A.equal(d[k],false,'Forbidden live/keyed change '+k);
 A.equal(d.academicReleaseVerdict,
  'FIRST_PASS_SOURCE_AND_SCIENCE_REVIEW_COMPLETE_TEACHER_APPROVAL_PENDING_NO_SCORED_RELEASE');
 A.ok(d.next.startsWith('V177'));
 A.equal(d.items.length,8);
 A.deepEqual(d.items.map(x=>x.sourceQuestionNumber),[1,2,3,4,5,6,7,8]);
 A.deepEqual(d.items.map(x=>x.renderedSourceCropRgbSha256),CROPS);
 A.equal(new Set(CROPS).size,8);
 A.equal(hash(CROPS.join('\n')),JOIN);
 let counts={K:0,U:0,A:0},byslo={},direct=0,support=0;
 for(let i=0;i<8;i++){
  const r=d.items[i],n=i+1,s='P-11-B-'+SLO[i];
  A.equal(r.sourceExerciseNumber,'7.'+n);
  A.equal(r.sourcePrintedPage,126);
  A.equal(r.sourcePdfPageZeroIndex,125);
  A.deepEqual(r.sourcePixelCropBox,BOX[i]);
  A.equal(r.closestSummativeTheorySlo,s);
  A.equal(r.officialParentOutcomeCognitive,OFFICIAL[s]);
  A.equal(r.preliminaryActualItemCognitive,COG[i]);
  A.deepEqual(r.relevantTextbookPrintedPages,PAGES[i]);
  A.equal(r.preliminaryScoredSloCoverage,SUPPORT.includes(n)?
    'partial-or-supporting-slo-coverage':'direct-outcome-candidate');
  A.equal(r.changeNeeded,MUST.includes(n)?
    'compulsory-before-teacher-approved-scoring':'optional');
  A.equal(r.issueCategory,ISSUE_TYPES[n]);
  A.ok(r.academicConcern.length>110,'Insufficient original Q7.'+n+' issue detail');
  A.ok(r.proposedTeacherTreatment.length>100,
    'Missing actionable answer rubric Q7.'+n);
  A.equal(r.originalPrintedQuestionRetained,true);
  A.equal(r.referenceFigureRequiredInTeacherAnswer,FIGURES.includes(n));
  A.equal(r.studentStandaloneStimulusMissing,false);
  A.equal(r.fullPublisherOfficialAnswerKeyProvided,false);
  A.equal(r.firstPassScienceContentReviewed,true);
  A.equal(r.teacherScienceSignoff,'PENDING');
  A.equal(r.teacherCognitiveSignoff,'PENDING');
  A.equal(r.studentScoredRelease,'HOLD');
  for(const k of FORBIDDEN)
   A.equal(Object.hasOwn(r,k),false,'Private source/answer field in public review: '+k);
  counts[COG[i]]++;
  byslo[s]=(byslo[s]||0)+1;
  if(SUPPORT.includes(n))support++;else direct++;
 }
 A.deepEqual(counts,{K:0,U:6,A:2});
 A.deepEqual(byslo,d.originalNearestSloCounts);
 A.equal(direct,5);A.equal(support,3);
 for(const k of FORBIDDEN)A.equal(Object.hasOwn(d,k),false);
}
const d=load(LEDGER);
check(d);
const mutations=[
 x=>x.sourceNbfBookSha256='0'.repeat(64),
 x=>x.sourceRenderedPngSha256='0'.repeat(64),
 x=>x.orderedEightSourceCropHashesJoinNewlineSha256='0'.repeat(64),
 x=>x.items[0].renderedSourceCropRgbSha256='0'.repeat(64),
 x=>x.items[0].sourcePixelCropBox=[0,0,0,0],
 x=>x.items[0].sourcePrintedPage=125,
 x=>x.items[0].closestSummativeTheorySlo='P-11-B-24',
 x=>x.items[2].preliminaryActualItemCognitive='A',
 x=>x.items[1].changeNeeded='none',
 x=>x.items[1].issueCategory='misc',
 x=>x.items[5].academicConcern='short',
 x=>x.items[7].proposedTeacherTreatment='none',
 x=>x.items[3].referenceFigureRequiredInTeacherAnswer=false,
 x=>x.items[5].studentScoredRelease='RELEASED',
 x=>x.items[5].teacherScienceSignoff='APPROVED',
 x=>x.items[5].teacherCognitiveSignoff='APPROVED',
 x=>x.items[0].fullModelAnswer='PRIVATE_SOURCE_ANSWER',
 x=>x.compulsoryTeacherAcademicDecisionNumbers=[],
 x=>x.optionalTeacherEditorialDecisionNumbers=[],
 x=>x.originalNearestSloCounts['P-11-B-27']=0,
 x=>x.preliminaryStrictDirectOutcomeCandidates=8,
 x=>x.sourceQuestionMissingProvidedStimulusNumbers=[1],
 x=>x.modelAnswerPayloadPublished=true,
 x=>x.sourceOriginalPageImagePublished=true,
 x=>x.existingGithubQuestionBankChanged=true,
 x=>x.firebaseTeacherBackendChanged=true,
 x=>x.unit7ScoredPortalQuestionCount=8,
 x=>x.academicReleaseVerdict='APPROVED'
];
for(const [i,fn] of mutations.entries()){
 const v=structuredClone(d);fn(v);
 A.throws(()=>check(v),undefined,'Fail-open V176 academic mutation '+(i+1));
}
const report=read(MEMO);
for(const n of MUST.concat(OPT)){
 A.ok(report.includes('**7.'+n+'**'),
   'Owner amendments-only memo omits Q7.'+n);
}
for(const phrase of ['7.1–7.8','B-22','B-24','B-25','B-26',
 'B-27','B-28','Fig.7.12','Fig.7.14','Fig.7.13',
 'Proportional','elastic','energy density','teacher','PENDING','HOLD']){
 A.ok(report.toLowerCase().includes(phrase.toLowerCase()),
   'Missing required academic report discussion: '+phrase);
}
const v175=load('quality/unit07/unit07-v175-end-exercise-short01-11-image-bound-no-answers.json');
A.equal(v175.version,'V175');
A.equal(v175.sourceOriginalShortQuestions,11);
A.equal(v175.unit7ScoredPortalQuestions,0);
const v174=load('quality/unit07/unit07-v174-end-exercise-mcq01-10-fig-bound-no-keys.json');
A.equal(v174.version,'V174');
A.equal(v174.independentPhysicsReviewOfQuestions,10);
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
const catalog=load('portal/learning-catalog.json');
const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
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
const dir=path.join(ROOT,'qa-artifacts/grade11-v176-unit7-original-comprehensive8');
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({
 version:'V176',sourcePrintedPage:126,
 originalComprehensiveQuestions:8,
 publisherOriginalModelAnswerKeyOnPage:false,
 scienceResponseConceptsReviewed:8,
 directTheoryOutcomeCandidates:5,supportingPartialCandidates:3,
 sourceCognitiveDemand:{K:0,U:6,A:2},
 requiredTeacherRubricDecisions:MUST,
 optionalEditorialDecisions:OPT,
 tamperingMutationsRejected:mutations.length,
 originalScannedBookOrAnswersUploaded:false,
 teacherScienceApprovals:0,studentScoredUnit7Questions:0,
 next:'V177 original Unit7 numerical problems 7.1–7.5 on printed p126'
},null,2)+'\n');
console.log('V176 PASS: NBF Unit7 original 8 comprehensive source fingerprints, 6 compulsory/2 optional, 28 academic release-mutation denials, 0 teacher approvals and 0 scored Unit7');
