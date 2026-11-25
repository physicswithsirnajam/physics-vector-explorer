#!/usr/bin/env node
'use strict';
/**
 * V166 OFFLINE academic review ledger and scored-release gate.
 *
 * All 20 original numerical answers/letters were checked against the private
 * owner DOCX and NBF printed book outside public CI. This auditor checks only
 * metadata provenance, the SLO/level review, and continued score HOLD.
 * It does NOT pretend to recompute unseen owner keys in GitHub.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const THIS='quality/unit07/topic72-v166-q41-q60-source-bound-numerical-review-no-keys.json';
const PRIOR1='quality/unit07/topic72-v164-first20-source-bound-teacher-review-no-keys.json';
const PRIOR2='quality/unit07/topic72-v165-q21-q40-source-bound-review-no-keys.json';
const MEMO='quality/grade11-v166-topic72-q41-q60-numerical-answer-slo-qc.md';
const DOCX='Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx';
const WORD_SHA='a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada';
const NBF_SHA='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const COMPULSORY=[46,47,51,52,53,54,55,56];
const OPTIONAL=[57];
const DIRECT=[41,42,43,44,45,48,49,50,57,58,59,60];
const SUPPLEMENTARY=[46,47,51,52,53,54,55,56];
const CONTEXT_PAGES={
 41:117,42:117,43:117,44:118,45:118,46:118,47:118,
 48:118,49:118,50:118,51:121,52:117,53:119,54:119,55:119,
 56:119,57:121,58:120,59:119,60:118
};
const CATEGORY={
 46:'summative-scope',47:'summative-scope',
 51:'prerequisite-skill-scope',52:'prerequisite-skill-scope',
 53:'summative-scope',54:'summative-scope',55:'summative-scope',
 56:'summative-scope-and-symbol-clarity',57:'textbook-precision-comparison'
};
const FORBIDDEN=[
 'stem','question','questionText','prompt','options','optionA','optionB',
 'optionC','optionD','correctAnswer','answer','answerLetter','correctOption',
 'correctOptionText','key','keyLetter','optionLetter',
 'oneLineExplanation','originalExplanation','sourceExplanation','numericAnswer',
 'numericalKey','workedSolution','candidateStem','candidateOptions',
 'studentUid','studentEmail','teacherUid','teacherEmail'
];
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const ordered=Array.from({length:20},(_,i)=>41+i);
function verify(){
 const d=load(THIS),p1=load(PRIOR1),p2=load(PRIOR2),memo=read(MEMO);
 assert.equal(d.schemaVersion,1);
 assert.equal(d.version,'V166');
 assert.equal(d.unit,'Grade XI Unit 7.2 Deformation in Solids');
 assert.equal(d.batch,'Q41-Q60 of original 80');
 assert.deepEqual(d.priorBatches,['V164 Q1-Q20','V165 Q21-Q40']);
 assert.equal(d.sourceOriginalPrivateDocxName,DOCX);
 assert.equal(d.sourceOriginalPrivateDocxSha256,WORD_SHA);
 assert.equal(p1.sourceOriginalPrivateDocxSha256,WORD_SHA);
 assert.equal(p2.sourceOriginalPrivateDocxSha256,WORD_SHA);
 assert.equal(d.sourceNbfTextbookSha256,NBF_SHA);
 assert.equal(p1.sourceNbfTextbookSha256,NBF_SHA);
 assert.equal(p2.sourceNbfTextbookSha256,NBF_SHA);
 assert.deepEqual(d.sourceNbfPrintedPages,[117,118,119,120,121]);
 assert.deepEqual(d.officialSummativeSloLevels,p2.officialSummativeSloLevels);
 assert.equal(d.officialFramework,p1.officialFramework);
 assert.equal(d.fileProvenanceMethod,
  'PRIVATE_DOCX_Q41_TO_Q60_EXTRACTED_AND_MANUALLY_COMPARED_WITH_NBF_PAGE_IMAGES');
 assert.equal(d.rowDigestRecipeId,'V165_EXPLICIT_JSON_SOURCE_ROW_V1');
 assert.equal(d.rowDigestRecipeId,p2.rowDigestRecipeId);
 assert.equal(d.rowDigestMethod,p2.rowDigestMethod);
 assert.ok(d.directPrivateDocxRecipeSpotCheck.includes('V165 Q21'));
 assert.equal(d.firstPassReviewed,20);
 assert.equal(d.cumulativeOriginalRowsReviewed,60);
 assert.equal(d.fullBankOriginalRows,80);
 assert.equal(p1.firstPassReviewed,20);
 assert.equal(p2.cumulativeOriginalRowsReviewed,40);
 assert.equal(p2.fullBankOriginalRows,80);
 assert.equal(d.keyLetterErrorsDetected,0);
 assert.equal(p1.keyLetterErrorsDetected,0);
 assert.equal(p2.keyLetterErrorsDetected,0);
 assert.equal(d.independentlyCheckedNumericalResults,20);
 assert.deepEqual(d.originalItemCognitionCounts,{K:0,U:0,A:20});
 assert.deepEqual(d.cumulativeOriginalItemCognitionCounts,{K:20,U:17,A:23});
 assert.deepEqual(p1.originalItemCognitionCounts,{K:15,U:5,A:0});
 assert.deepEqual(p2.originalItemCognitionCounts,{K:5,U:12,A:3});
 assert.deepEqual(p2.cumulativeOriginalItemCognitionCounts,{K:20,U:17,A:3});
 assert.equal(d.coreSummativeScopeDirectCount,12);
 assert.equal(d.supplementaryScopeCount,8);
 assert.equal(d.itemFlagsCount,9);
 assert.equal(d.compulsoryItemFlagsCount,8);
 assert.equal(d.optionalItemFlagsCount,1);
 assert.deepEqual(d.questionNumbersFlagged,[46,47,51,52,53,54,55,56,57]);
 assert.deepEqual(d.inScopeApplicationCandidates,DIRECT);
 assert.deepEqual(d.existingDocumentIssuesCarriedForward,['HEADER-01','BLUEPRINT-01']);
 assert.deepEqual(d.existingDocumentIssuesCarriedForward,
  p2.carryForwardDocumentIssueIds);
 assert.ok(d.documentedTextbookRoundoff.includes('NBF Example 7.2'));
 assert.ok(d.documentedTextbookRoundoff.includes('Q57'));
 assert.ok(d.numericalWorkValidation.includes('20 explicit independent'));
 for(const field of [
  'changedOriginalDocs','privateAnswerLettersCommitted',
  'privateAnswerExplanationsCommitted','privateNumericalKeyValuesCommitted',
  'candidateQuestionWordingCommitted'
 ])assert.equal(d[field],false,'Keyed private source or original mutated: '+field);
 assert.equal(d.heldAllBankItems,80);
 assert.equal(d.unit7StudentScoredQuestionCount,0);
 assert.equal(d.noExternalBackendOrLiveFirebaseChanges,true);
 assert.equal(d.releasePolicy,
  'QUESTION BANK AND ANSWER KEYS PRIVATE; TEACHER SIGNOFF PENDING; NO SCORED USE');
 assert.equal(d.sourceBoundItems.length,20);
 assert.deepEqual(d.sourceBoundItems.map(x=>x.sourceNumber),ordered);
 const hashes=d.sourceBoundItems.map(x=>x.fullSourceRowSha256);
 assert.equal(new Set(hashes).size,20);
 for(const item of d.sourceBoundItems){
  const n=item.sourceNumber;
  assert.match(item.fullSourceRowSha256,/^[a-f0-9]{64}$/);
  assert.equal(item.sourceMappedSlo,'P-11-B-24');
  assert.equal(item.originalItemCognitiveCode,'A');
  assert.equal(item.sourceNbfContextPage,CONTEXT_PAGES[n]);
  assert.equal(item.originalKeyOfflineCheckedAgainstNbf,true);
  assert.equal(item.answerLetterMatchesSelectedOptionText,true);
  assert.equal(item.independentArithmeticVerified,true);
  assert.equal(item.keyLetterErrorDetected,false);
  assert.equal(item.frameworkScope,
   SUPPLEMENTARY.includes(n)?'supplementary-textbook-support':'direct-topic-core');
  assert.equal(item.disposition,'TEACHER_PENDING');
  assert.equal(item.teacherAcademicSignoff,'PENDING');
  assert.equal(item.studentScoredRelease,'HOLD');
  if(COMPULSORY.includes(n)||OPTIONAL.includes(n)){
   assert.equal(item.changeNeeded,
    COMPULSORY.includes(n)?'compulsory-before-summative-use':'optional');
   assert.equal(item.issueCategory,CATEGORY[n]);
   assert.ok(typeof item.issue==='string'&&item.issue.length>50);
   assert.ok(typeof item.proposedAction==='string'&&item.proposedAction.length>40);
   assert.ok(typeof item.originalCanBeKept==='string'&&item.originalCanBeKept.length>25);
   assert.ok(memo.includes('**'+n+'**'),'Missing academic discussion for Q'+n);
  }else{
   assert.equal(item.changeNeeded,'none');
   assert.equal(item.issueCategory,null);
   assert.equal(item.issue,null);
   assert.equal(item.proposedAction,null);
   assert.equal(item.originalCanBeKept,null);
  }
  for(const field of FORBIDDEN)
   assert.equal(Object.hasOwn(item,field),false,
    'Keyed option/student data forbidden in public source review: '+field);
 }
 assert.deepEqual(new Set([...DIRECT,...SUPPLEMENTARY]),new Set(ordered));
 assert.deepEqual(new Set([...COMPULSORY,...OPTIONAL]),
  new Set(d.questionNumbersFlagged));
 const correctTotal=
  p1.originalItemCognitionCounts.K+p1.originalItemCognitionCounts.U+
  p1.originalItemCognitionCounts.A+
  p2.originalItemCognitionCounts.K+p2.originalItemCognitionCounts.U+
  p2.originalItemCognitionCounts.A+
  d.originalItemCognitionCounts.K+d.originalItemCognitionCounts.U+
  d.originalItemCognitionCounts.A;
 assert.equal(correctTotal,60);
 assert.equal(p1.coreSummativeScopeDirectCount+
  p2.coreSummativeScopeDirectCount+d.coreSummativeScopeDirectCount,39);
 assert.equal(p1.supplementaryScopeCount+
  p2.supplementaryScopeCount+d.supplementaryScopeCount,21);
 for(const marker of [
  'Q41–Q60','20/20','8','Optional','60 of 80',
  'P-11-B-24','Young','shear','bulk',
  'No','NBF','Q57','mathematically',
  'teacher','PENDING','HOLD'
 ]){
  assert.ok(memo.toLowerCase().includes(marker.toLowerCase()),
   'V166 source/QC memo missing '+marker);
 }
 const catalog=load('portal/learning-catalog.json');
 const unit7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(unit7.status,'planned');
 assert.equal(unit7.assessmentStatus,'not-published');
 assert.equal(unit7.questionBankCount,0);
 const manifest=load('question-bank/manifest.json');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 const topic71=load('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
 assert.equal(topic71.teacherScienceSignoffs,0);
 assert.equal(topic71.teacherCognitiveSignoffs,0);
 assert.equal(topic71.unit7ScoredReleaseCount,0);
 assert.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
 assert.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,
  'NO_GO_DEPLOYMENT_BLOCKED');
 assert.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
  'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 assert.ok(!fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')));
 assert.ok(!fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07-topic72.json')));
 const summary={
  version:'V166',sourcePrivateDocxSha256:WORD_SHA,
  ownedOriginalQuestions:80,sourceRowsAuditedThisBatch:20,
  cumulativeSourceRowsAudited:60,
  wrongKeyLettersFoundDuringPrivateFirstPass:0,
  independentlyRecomputedNumericalAnswers:20,
  sourceAnswersOrQuestionsIncludedInPublicRepo:false,
  compulsoryScopeOrNotationItems:8,optionalRoundingNotes:1,
  cumulativeOriginalItemDemand:{K:20,U:17,A:23},
  directB24SourceItemsThisBatch:12,
  supplementaryB24ContentThisBatch:8,
  originalTeacherAcademicApprovals:0,unit7ScoredQuestions:0,
  ownerProductionTeacherDeploymentApproved:false,
  nextBatch:'Q61-Q80'
 };
 const out=path.join(ROOT,'qa-artifacts/grade11-v166-unit7-topic72-q41-q60');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
 console.log('V166 PASS: 20 source-fingerprinted calculations Q41-60, 8 compulsory/1 optional source flags, cumulative K20/U17/A23; 0 answer keys/0 scored Unit7');
}
try{verify()}catch(e){console.error('V166 FAIL:',e.stack||e);process.exitCode=1;}
