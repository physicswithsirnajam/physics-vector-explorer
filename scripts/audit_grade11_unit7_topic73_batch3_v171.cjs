#!/usr/bin/env node
'use strict';
/**
 * V171: only keyless academic/source metadata is public. Original 20
 * numerical answers were verified against the owner's private Word.
 * CI checks hashes, SLO review and all score/teacher holds; it cannot
 * independently read the privately keyed source or NBF scans.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),
 path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const sha=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const P='quality/unit07/';
const v169=load(P+'topic73-v169-q01-q20-source-bound-academic-review-no-keys.json');
const v170=load(P+'topic73-v170-q21-q40-source-bound-academic-review-no-keys.json');
const d=load(P+'topic73-v171-q41-q60-source-bound-numerical-review-no-keys.json');
const WORD='f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279';
const BOOK='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const BATCH='1e765ae590be2ec35055b11e6eb2ebe5335cccc082871311799949f3da1c63fc';
const ALL60='434e72b203fdb872db7b499bb6a67b12ebe50b3e284a6aba0101481287c2ca85';
const MUST=[42,45,46,47,49,55,56],OPT=[48,52,54,58],SUP=[47,48,54,55,56],NONSELF=[42,45,46,49];
const SLO=[28,28,28,28,28,28,27,25,28,28,28,28,28,25,25,28,27,27,28,28];
const PAGES=[123,123,123,123,123,123,122,122,123,123,123,123,123,122,124,124,122,122,124,124];
const BAN=['stem','question','questionText','options','answer','answerLetter',
 'key','keyLetter','correctOption','correctOptionText','oneLineExplanation',
 'originalExplanation','workedSolution','studentEmail','studentUid','teacherUid'];
function verify(x){
 A.equal(x.schemaVersion,1);A.equal(x.version,'V171');
 A.equal(x.sourcePrivateWordName,v169.sourceOriginalPrivateDocxName);
 A.equal(x.sourcePrivateWordSha256,WORD);
 A.equal(x.sourcePrivateWordSha256,v169.sourceOriginalPrivateDocxSha256);
 A.equal(x.sourcePrivateWordSha256,v170.originalWordSha256);
 A.equal(x.sourceNbfTextbookSha256,BOOK);
 A.deepEqual(x.summativeSloLevels,v169.officialSummativeSloCognitive);
 A.equal(x.rowDigestRecipeId,v169.rowFingerprintRecipeId);
 A.equal(x.rowDigestRecipeId,v170.fingerprintRecipe);
 A.deepEqual(x.sourcePrintedPages,[122,123,124]);
 A.equal(x.fullOriginalRows,80);
 A.equal(x.firstPassReviewedThisBatch,20);
 A.equal(x.cumulativeFirstPassReviewed,60);
 A.equal(x.independentlyRecomputedNumericalAnswers,20);
 A.equal(x.originalKeyLetterMatchesOriginalCorrectOptionText,20);
 A.equal(x.firstPassWrongKeyLettersDetected,0);
 A.deepEqual(x.originalKeyLetterTotals,{A:6,B:3,C:7,D:4});
 A.deepEqual(x.sourceItemDemandCounts,{K:0,U:0,A:20});
 A.deepEqual(x.cumulativeSourceItemDemand,{K:11,U:20,A:29});
 A.deepEqual(x.originalSourceSloCounts,{
  'P-11-B-25':{K:0,U:0,A:3,total:3},
  'P-11-B-27':{K:0,U:0,A:3,total:3},
  'P-11-B-28':{K:0,U:0,A:14,total:14}});
 A.deepEqual(x.compulsoryIssueNumbers,MUST);A.deepEqual(x.optionalIssueNumbers,OPT);
 A.deepEqual(x.standaloneContextConditionNumbers,NONSELF);
 A.deepEqual(x.referenceDataSelfContainedNumbers,[59,60]);
 A.deepEqual(x.sourceTeacherNotesEnrichmentNumbers,[56,58,79]);
 A.equal(x.sourceDocumentGeneralCondition,'Calculations assume ideal linear elastic behavior unless stated otherwise.');
 A.equal(x.strictDirectTopicCandidates,15);A.equal(x.supportingOrCrossSloCandidates,5);
 A.equal(x.academicDecision,'REVIEWED_OFFLINE_TEACHER_PENDING_NOT_RELEASED');
 for(const f of ['sourceOriginalWordChanged','sourceKeyLettersPublished',
  'sourceCorrectOptionTextPublished','livePortalQuestionBankChanged',
  'liveFirebaseOrBackendChanged'])A.equal(x[f],false);
 A.equal(x.topic72Full80OnHold,true);A.equal(x.teacherApprovedItems,0);
 A.equal(x.unit7ScoredItems,0);
 A.equal(x.sourceBoundItems.length,20);
 const hashes=x.sourceBoundItems.map(r=>r.originalFullKeyedRowSha256);
 A.equal(new Set(hashes).size,20);
 for(const h of hashes)A.match(h,/^[0-9a-f]{64}$/);
 A.equal(sha(hashes.join('\n')),BATCH);
 A.equal(x.orderedCurrentBatchHashesJoinNewlineSha256,BATCH);
 const first=v169.sourceBoundItems.map(r=>r.originalFullKeyedRowSha256);
 const second=v170.items.map(r=>r.fullSourceRowSha256);
 A.equal(sha(first.join('\n')),v169.canonicalFirst20RowHashesJoinNewlineSha256);
 A.equal(sha(first.concat(second).join('\n')),v170.first40JoinedSha256);
 A.equal(sha(first.concat(second,hashes).join('\n')),ALL60);
 A.equal(x.orderedFirst60HashesJoinNewlineSha256,ALL60);
 for(let i=0;i<20;i++){
  const r=x.sourceBoundItems[i],n=41+i;
  A.equal(r.sourceNumber,n);A.equal(r.originalMappedSlo,'P-11-B-'+SLO[i]);
  A.equal(r.sourceNbfPrintedPage,PAGES[i]);A.equal(r.originalAuthorItemDemand,'A');
  A.equal(r.originalKeyMatchesSelectedOptionText,true);
  A.equal(r.independentNumericalCalculationChecked,true);
  A.equal(r.wrongKeyLetterDetected,false);
  A.equal(r.frameworkScope,SUP.includes(n)?'supporting-or-cross-slo-teacher-decision':'direct-topic-candidate');
  A.equal(r.changeNeeded,MUST.includes(n)?'compulsory-before-independent-scoring':
    OPT.includes(n)?'optional':'none');
  A.equal(r.issue===null,!MUST.includes(n)&&!OPT.includes(n));
  A.equal(r.individualStandaloneLinearAssumptionExplicit,!NONSELF.includes(n));
  A.equal(r.sourceWideLinearAssumptionApplies,true);A.equal(r.retainOriginal,true);
  A.equal(r.teacherScienceSignoff,'PENDING');
  A.equal(r.teacherCognitiveSignoff,'PENDING');
  A.equal(r.studentScoredRelease,'HOLD');
  for(const field of BAN)A.equal(Object.hasOwn(r,field),false,'Private field '+field);
 }
}
verify(d);
const mutate=[
 x=>x.sourcePrivateWordSha256='0'.repeat(64),
 x=>x.sourceBoundItems[0].originalFullKeyedRowSha256='0'.repeat(64),
 x=>x.sourceBoundItems[0].originalMappedSlo='P-11-B-25',
 x=>x.sourceBoundItems[0].originalAuthorItemDemand='U',
 x=>x.sourceBoundItems[0].studentScoredRelease='RELEASED',
 x=>x.sourceBoundItems[0].teacherScienceSignoff='APPROVED',
 x=>x.sourceBoundItems[0].teacherCognitiveSignoff='APPROVED',
 x=>x.sourceBoundItems[0].correctOptionText='KEY_LEAK',
 x=>x.compulsoryIssueNumbers=[],
 x=>x.optionalIssueNumbers=[],
 x=>x.standaloneContextConditionNumbers=[],
 x=>x.sourceBoundItems[1].individualStandaloneLinearAssumptionExplicit=true,
 x=>x.livePortalQuestionBankChanged=true,
 x=>x.liveFirebaseOrBackendChanged=true,
 x=>x.unit7ScoredItems=1,
 x=>x.topic72Full80OnHold=false,
 x=>x.orderedFirst60HashesJoinNewlineSha256='0'.repeat(64),
 x=>x.cumulativeSourceItemDemand.A=28
];
for(const edit of mutate){const m=structuredClone(d);edit(m);A.throws(()=>verify(m));}
const memo=fs.readFileSync(path.join(ROOT,'quality/grade11-v171-topic73-q41-q60-numerical-answer-slo-qc.md'),'utf8');
for(const q of MUST.concat(OPT))A.ok(memo.includes('**'+q+'**'));
const v168=load(P+'topic72-v168-all80-consolidated-academic-qc-no-keys.json');
A.equal(v168.fullOriginalQuestionRows,80);
A.equal(v168.individualTeacherScienceSignoffs,0);
A.equal(v168.unit7ScoredQuestionCount,0);
const u7=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');
A.equal(u7.questionBankCount,0);
A.deepEqual(load('question-bank/manifest.json').grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
const v154=load(P+'topic71-v154-80-source-bound-teacher-decision-queue.json');
A.equal(v154.teacherScienceSignoffs,0);A.equal(v154.unit7ScoredReleaseCount,0);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load(P+'topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load(P+'topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
const out=path.join(ROOT,'qa-artifacts/grade11-v171-topic73-q41-q60-source-qc');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
 version:'V171',originalNumericalSourcesReviewed:60,thisBatch:20,
 independentlyRecalculated:20,wrongKeyLettersDetected:0,
 originalItemDemand:{K:11,U:20,A:29},compulsory:MUST,optional:OPT,
 rejectedMutations:mutate.length,originalAnswersInGitHub:false,
 teacherApprovedItems:0,unit7ScoredQuestions:0
},null,2)+'\n');
console.log('V171 PASS: source-provenance, 20 original numeric keys first-pass verified, 7 compulsory/4 optional; all 18 tampering attempts rejected.');
