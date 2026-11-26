#!/usr/bin/env node
'use strict';
/*
 * V174: original NBF Grade XI Unit7 end-of-unit page125 MCQs Q1-10.
 * This is source-IMAGE provenance, not original keyed-row fingerprints:
 * textbook page supplies NO publisher answer key. Private physics checked
 * offline; CI checks ledger identity, ambiguity flags and zero-score HOLD.
 */
const A=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const sha=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const FILE='quality/unit07/unit07-v174-end-exercise-mcq01-10-fig-bound-no-keys.json';
const MD='quality/grade11-v174-unit07-textbook-exercise-mcq01-10-science-slo-qc.md';
const SOURCE='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const PAGEPNG='ba14d65b02c65846566b7692b221cec336dd6cfc2f38e6e8292061f05c716ded';
const CROPJOIN='edca84169967cbe67e1efc8f9beb1821aa937bcd1a7183a6ea54a004c1c5dbde';
const CROP_SHA=[
 'a01575f9562a5a181e74fcd61ed4246233258c14f07589c081ee11bd90f49c58',
 '406665aeb086282e5bd1fa95bc0fdedfaabf867921e5a9c3ef8413fdbc8c82e4',
 '2221dad3078149c5584456e7bc7aca2b73bc4b9b737e041ecf6f800270ce53f7',
 '0dfc7e31d83bc8a1820749c2a3c4397e15ad67b7d95c5e4bfdcbd413a8e0f728',
 '89798f09008380ea7aa66caa73488dfb2b0b98f649acc2e2066a63eadda1a2a3',
 '74585109d7e81ae47f1b7bbb733b1d38a92f0090540037322c84558e99ed1064',
 '802d1fbf3f89d2ba3c259083f6d065ae125f2b6001241adfaa947b30e58fa478',
 'e68d56fe86261b9456e4511ae33a3636ad3e0ac7846b505ae953390f9cec2856',
 '7c6dace2c83cf2ac48d356f2ae7bbd5e2629656fd0309e160e13ff48c389801b',
 '2280ead4d384f65adfca3171cdec4e91d623d818088be12688a083688093b40f'
];
const BOUNDS=[[135,265,1338,340],[135,340,1338,415],
 [135,415,1338,482],[135,482,1338,666],
 [135,664,1338,800],[135,798,1338,932],
 [135,932,1338,1004],[135,1001,1338,1117],
 [135,1110,1338,1179],[135,1173,1338,1245]];
const SLO=[22,22,22,24,24,24,28,24,28,27];
const LEVEL=['U','U','U','A','U','A','U','A','K','U'];
const SUPPORT=[3,7,8,9,10],COMP=[3,5,7,8,10],OPT=[9];
const AMBIGUOUS=[3,5,10];
const CATEGORIES={
 3:'two-descriptions-potentially-correct',
 5:'stress-definition-and-large-strain-ambiguity',
 7:'beam-bending-enrichment-not-direct-b28',
 8:'bulk-modulus-not-named-young-modulus-outcome',
 9:'resilience-vocabulary-not-energy-application',
 10:'unqualified-gradient-and-incorrect-slo-placement'
};
const PRIVATE_FIELDS=[
 'stem','question','questionText','options','optionA','optionB','optionC','optionD',
 'answer','answerLetter','correctLetter','correctOptionText','key','keyLetter',
 'publisherAnswer','teacherAnswer','workedAnswer','workedSolution',
 'studentUid','studentEmail','teacherUid','teacherEmail','scannedPageBytes'
];
function verify(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V174');
 A.equal(d.originalNbfTextbookSha256,SOURCE);
 A.equal(d.originalPrintedPage,125);
 A.equal(d.sourcePdfPageZeroIndexed,124);
 A.equal(d.sourcePageRenderWidthPixels,1370);
 A.equal(d.sourcePageRenderHeightPixels,1725);
 A.equal(d.sourcePageRenderPngSha256,PAGEPNG);
 A.ok(d.sourceFingerprintMethod.includes('PyMuPDF'));
 A.ok(d.sourceFingerprintMethod.includes('RGB raw pixel bytes'));
 A.equal(d.sourceIsScannedPdf,true);
 A.equal(d.sourceOriginalBookPageUploadedToGithub,false);
 A.equal(d.publisherAnswerKeyAvailableOnPage,false);
 A.equal(d.independentPhysicsReviewOfQuestions,10);
 A.equal(d.preliminarilyUnambiguousQuestionsCount,7);
 A.deepEqual(d.conditionalOrAmbiguousOriginalQuestions,AMBIGUOUS);
 A.deepEqual(d.numericalAndPhysicalQuantitiesIndependentlyVerified,[4,6,8]);
 A.equal(d.correctedOrChangedTextbookContent,false);
 A.deepEqual(d.candidateCognitiveCounts,{K:1,U:6,A:3});
 A.deepEqual(d.nearestSloCount,
  {'P-11-B-22':3,'P-11-B-24':4,'P-11-B-27':1,'P-11-B-28':2});
 A.deepEqual(d.officialFBISESummativeSloLevels,
  {'P-11-B-22':'Understanding','P-11-B-24':'Application',
   'P-11-B-27':'Application','P-11-B-28':'Application'});
 A.equal(d.preliminaryDirectOutcomeCandidates,5);
 A.equal(d.preliminarySupportingCandidates,5);
 A.deepEqual(d.compulsoryIssueQuestionNumbers,COMP);
 A.deepEqual(d.optionalIssueQuestionNumbers,OPT);
 A.equal(d.supplementaryContentIsNotAutomaticallyUnexamined,true);
 A.ok(d.sourceBookNumericalChecks.q4.includes('wire'));
 A.ok(d.sourceBookNumericalChecks.q6.includes('Young modulus'));
 A.ok(d.sourceBookNumericalChecks.q8.includes('Bulk modulus'));
 A.ok(d.externalPhysicsCrosscheck.siliconDiamondCubicLattice.includes('FCC'));
 A.ok(d.externalPhysicsCrosscheck.rubberBulkModulusNote.includes('rubber'));
 A.equal(d.priorOriginalTopic71Status,'80 author questions reviewed; teacher signoffs PENDING');
 A.equal(d.priorOriginalTopic72Status,'80 author questions reviewed; teacher signoffs PENDING');
 A.equal(d.priorOriginalTopic73Status,'80 author questions reviewed; teacher signoffs PENDING');
 A.equal(d.unit7ScoredPortalQuestions,0);
 A.equal(d.unit7TeacherApprovals,0);
 A.equal(d.liveGithubQuestionBankChanged,false);
 A.equal(d.productionFirebaseChanged,false);
 A.equal(d.privateAnswerLettersCommitted,false);
 A.equal(d.sourceBookTextOrScansCommitted,false);
 A.ok(d.nextMilestone.startsWith('V175'));
 A.equal(d.sourceBoundItems.length,10);
 A.deepEqual(d.sourceBoundItems.map(x=>x.sourceQuestionNumber),
   Array.from({length:10},(_,i)=>i+1));
 const hashes=d.sourceBoundItems.map(x=>x.renderedQuestionRgbPixelSha256);
 A.deepEqual(hashes,CROP_SHA);
 A.equal(sha(hashes.join('\n')),CROPJOIN);
 A.equal(new Set(hashes).size,10);
 let counts={K:0,U:0,A:0},slo={},direct=0,support=0,unambiguous=0;
 for(let i=0;i<10;i++){
  const row=d.sourceBoundItems[i],n=i+1;
  A.deepEqual(row.sourcePagePixelCropBox,BOUNDS[i]);
  A.equal(row.nearestFBISETheorySlo,'P-11-B-'+SLO[i]);
  A.equal(row.candidateItemDemand,LEVEL[i]);
  A.equal(row.preliminarySummativeScope,SUPPORT.includes(n)?
   'supporting-or-outcome-crosscheck':'direct-outcome-candidate');
  A.equal(row.independentAnswerReviewStatus,AMBIGUOUS.includes(n)?
    'AMBIGUOUS_WITHOUT_EXTRA_CONDITION':'SINGLE_PHYSICS_INTENDED_RESULT');
  A.equal(row.sourceExerciseHasProvidedPublisherKey,false);
  A.equal(row.changeNeeded,COMP.includes(n)?
   'compulsory-before-scored-use':
   OPT.includes(n)?'optional-teacher-slo-placement':'none');
  const flagged=COMP.includes(n)||OPT.includes(n);
  A.equal(row.issue===null,!flagged);
  A.equal(row.issueCategory===null,!flagged);
  A.equal(row.proposedAction===null,!flagged);
  if(flagged){
   A.equal(row.issueCategory,CATEGORIES[n]);
   A.ok(row.issue.length>70,'Missing meaningful original Q'+n+' issue analysis');
   A.ok(row.proposedAction.length>60,'Missing owner action for original Q'+n);
  }
  A.equal(row.preserveTextbookOriginal,true);
  A.equal(row.teacherScienceSignoff,'PENDING');
  A.equal(row.teacherCognitiveSignoff,'PENDING');
  A.equal(row.studentScoredRelease,'HOLD');
  for(const forbidden of PRIVATE_FIELDS)A.equal(Object.hasOwn(row,forbidden),false,
    'Publisher/text/answer/student content must remain private: '+forbidden);
  if(!AMBIGUOUS.includes(n))unambiguous++;
  if(SUPPORT.includes(n))support++;else direct++;
  counts[LEVEL[i]]++;const code=row.nearestFBISETheorySlo;
  slo[code]=(slo[code]||0)+1;
 }
 A.equal(unambiguous,7);A.equal(direct,5);A.equal(support,5);
 A.deepEqual(counts,{K:1,U:6,A:3});
 A.deepEqual(slo,d.nearestSloCount);
 for(const forbidden of PRIVATE_FIELDS)A.equal(Object.hasOwn(d,forbidden),false);
}
const d=load(FILE);verify(d);
const mutations=[
 x=>x.originalNbfTextbookSha256='0'.repeat(64),
 x=>x.sourcePageRenderPngSha256='0'.repeat(64),
 x=>x.sourceBoundItems[0].renderedQuestionRgbPixelSha256='0'.repeat(64),
 x=>x.sourceBoundItems[0].sourcePagePixelCropBox=[0,0,0,0],
 x=>x.sourceBoundItems[1].candidateItemDemand='A',
 x=>x.sourceBoundItems[1].nearestFBISETheorySlo='P-11-B-27',
 x=>x.sourceBoundItems[2].independentAnswerReviewStatus='SINGLE_PHYSICS_INTENDED_RESULT',
 x=>x.sourceBoundItems[4].studentScoredRelease='RELEASED',
 x=>x.sourceBoundItems[4].teacherScienceSignoff='APPROVED',
 x=>x.sourceBoundItems[4].teacherCognitiveSignoff='APPROVED',
 x=>x.sourceBoundItems[3].keyLetter='PRIVATE_ANSWER',
 x=>x.sourceBookTextOrScansCommitted=true,
 x=>x.publisherAnswerKeyAvailableOnPage=true,
 x=>x.compulsoryIssueQuestionNumbers=[],
 x=>x.optionalIssueQuestionNumbers=[],
 x=>x.conditionalOrAmbiguousOriginalQuestions=[],
 x=>x.preliminaryDirectOutcomeCandidates=10,
 x=>x.unit7ScoredPortalQuestions=1,
 x=>x.unit7TeacherApprovals=1,
 x=>x.liveGithubQuestionBankChanged=true,
 x=>x.productionFirebaseChanged=true
];
for(let i=0;i<mutations.length;i++){
 const mutant=structuredClone(d);mutations[i](mutant);
 A.throws(()=>verify(mutant),undefined,'Fail-open review mutation '+i);
}
const memo=read(MD);
for(const q of [...COMP,...OPT])A.ok(memo.includes('**'+q+'**'),
 'Amendments-only report missing flagged source Q'+q);
for(const fragment of ['10','Q3','Q5','Q10','P-11-B-22','P-11-B-24',
 'P-11-B-27','P-11-B-28','publisher','two','HOLD','teacher']){
 A.ok(memo.toLowerCase().includes(fragment.toLowerCase()),
  'Owner academic memo omitted '+fragment);
}
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');
A.equal(u7.assessmentStatus,'not-published');
A.equal(u7.questionBankCount,0);
A.deepEqual(load('question-bank/manifest.json')
 .grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
 [275,206,220,640,349,560]);
const t71=load('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
A.equal(t71.teacherScienceSignoffs,0);
A.equal(t71.unit7ScoredReleaseCount,0);
const t72=load('quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
A.equal(t72.individualTeacherScienceSignoffs,0);
A.equal(t72.unit7ScoredQuestionCount,0);
const t73=load('quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
A.equal(t73.topic73TeacherScienceSignoffs,0);
A.equal(t73.topic73TeacherCognitiveSignoffs,0);
A.equal(t73.unit7PortalScoredQuestionCount,0);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,
 'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
 'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
const out=path.join(ROOT,'qa-artifacts/grade11-v174-unit7-book-exercise-mcq');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
 version:'V174',sourceBookPrintedPage:125,originalBookExerciseMcqs:10,
 originalPublisherAnswerKeyOnPage:false,
 independentPhysicsReviewCount:10,
 ambiguousUntilQualified:[3,5,10],
 compulsoryReviewDecisions:COMP,optionalReviewDecisions:OPT,
 directOutcomeCandidates:5,supportingCandidates:5,
 proposedOriginalItemDemand:{K:1,U:6,A:3},
 keylessSourceRegionFingerprintHashes:CROP_SHA.length,
 tamperingMutationsRejected:mutations.length,
 privateSourcePageOrKeysInRepo:false,teacherApprovals:0,unit7ScoredItems:0,
 next:'V175 NBF Unit7 printed pp125–126 short questions 7.1–7.11'
},null,2)+'\n');
console.log('V174 PASS: NBF Unit7 page125 original 10 MCQs, 3 ambiguous, 5 compulsory + 1 optional, 21 academic release tampering mutations rejected; zero scored Unit7');
