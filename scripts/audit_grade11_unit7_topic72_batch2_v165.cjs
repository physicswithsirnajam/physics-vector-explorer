#!/usr/bin/env node
'use strict';
/**
 * V165: offline guardrail for the owner's private original 80-item
 * Grade XI Unit7.2 bank, specifically source positions Q21–Q40.
 * This CI checks *provenance metadata and release holds*, NOT the
 * correctness of answer letters hidden in the privately-held DOCX.
 *
 * Original stems, options, keyed texts, explanations and any teacher/
 * student identifying data MUST NEVER be committed to these ledgers.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const LEDGER='quality/unit07/topic72-v165-q21-q40-source-bound-review-no-keys.json';
const PREV='quality/unit07/topic72-v164-first20-source-bound-teacher-review-no-keys.json';
const MEMO='quality/grade11-v165-topic72-q21-q40-answer-science-slo-qc.md';
const wordSha='a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada';
const nbfSha='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const SOURCE_NAME='Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx';
const CORE=[21,22,23,24,25,28,29,30,31,32,35,37,38,39,40];
const SUPPORT=[26,27,33,34,36];
const MUST=[26,33,34,38,39];
const OPTIONAL=[25,27,36];
const KNOWLEDGE=[29,31,33,34,36];
const APPLICATION=[22,24,40];
const UNDERSTANDING=[21,23,25,26,27,28,30,32,35,37,38,39];
const SLO={
 'P-11-B-23':[38],
 'P-11-B-24':[21,22,23,24,25,26,27,39,40],
 'P-11-B-26':[28,29,30,31,32,33,34,35,36,37]
};
const SOURCE_PAGES={
 21:117,22:118,23:118,24:118,25:118,26:119,27:119,
 28:120,29:121,30:121,31:121,32:121,33:121,34:121,
 35:121,36:121,37:121,38:118,39:119,40:119
};
const ISSUE_CATS={
 25:'physics-assumption',
 26:'summative-slo-scope',
 27:'summative-slo-scope',
 33:'summative-slo-scope',
 34:'summative-slo-scope',
 36:'summative-slo-scope',
 38:'source-attribution-wording',
 39:'option-construction-clarity'
};
const FORBIDDEN_ITEM_FIELDS=[
 'stem','question','questionText','prompt','options','optionA','optionB','optionC',
 'optionD','answer','correctAnswer','correctOption','correctLetter','answerLetter',
 'key','optionLetter','originalExplanation','sourceExplanation','oneLineExplanation',
 'correctOptionText','originalAnswer','candidateStem','candidateOptions','studentUid',
 'studentEmail','teacherUid','teacherEmail'
];
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const orderedTwenty=Array.from({length:20},(_,i)=>21+i);
function verify(){
 const data=load(LEDGER),prev=load(PREV),memo=read(MEMO);
 assert.equal(data.schemaVersion,1);
 assert.equal(data.version,'V165');
 assert.equal(data.unit,'Grade XI Unit 7.2 Deformation in Solids');
 assert.equal(data.batch,'Q21-Q40 of original 80');
 assert.equal(data.priorBatch,'V164 Q1-Q20');
 assert.equal(data.sourceOriginalPrivateDocxName,SOURCE_NAME);
 assert.equal(data.sourceOriginalPrivateDocxSha256,wordSha);
 assert.equal(prev.sourceOriginalPrivateDocxSha256,wordSha);
 assert.equal(data.sourceNbfTextbookSha256,nbfSha);
 assert.equal(prev.sourceNbfTextbookSha256,nbfSha);
 assert.deepEqual(data.sourceNbfPrintedPages,[117,118,119,120,121]);
 assert.equal(data.officialFramework,prev.officialFramework);
 assert.deepEqual(data.officialSummativeSloLevels,prev.officialSummativeSloLevels);
 assert.equal(data.fileProvenanceMethod,
  'PRIVATE_DOCX_Q21_TO_Q40_EXTRACTED_AND_MANUALLY_COMPARED_WITH_NBF_PAGE_IMAGES');
 assert.equal(data.rowDigestRecipeId,'V165_EXPLICIT_JSON_SOURCE_ROW_V1');
 assert.ok(data.rowDigestMethod.includes('SHA-256 of UTF-8 Python json.dumps('));
 assert.ok(data.rowDigestMethod.includes('ensure_ascii=False,sort_keys=True'));
 assert.ok(data.rowDigestMethod.includes("'correctOptionText'"));
 assert.ok(data.note.includes('not be compared across V164/V165'));
 assert.equal(data.firstPassReviewed,20);
 assert.equal(data.cumulativeOriginalRowsReviewed,40);
 assert.equal(data.fullBankOriginalRows,80);
 assert.equal(prev.firstPassReviewed,20);
 assert.equal(prev.fullBankOriginalRows,80);
 assert.equal(data.keyLetterErrorsDetected,0);
 assert.equal(prev.keyLetterErrorsDetected,0);
 assert.deepEqual(data.originalItemCognitionCounts,{K:5,U:12,A:3});
 assert.deepEqual(data.cumulativeOriginalItemCognitionCounts,{K:20,U:17,A:3});
 assert.deepEqual(prev.originalItemCognitionCounts,{K:15,U:5,A:0});
 assert.equal(data.coreSummativeScopeDirectCount,15);
 assert.equal(data.supplementaryScopeCount,5);
 assert.equal(data.itemFlagsCount,8);
 assert.equal(data.compulsoryItemFlagsCount,5);
 assert.equal(data.optionalItemFlagsCount,3);
 assert.deepEqual(data.questionNumbersFlagged,[25,26,27,33,34,36,38,39]);
 assert.deepEqual(data.inScopeApplicationCandidates,APPLICATION);
 assert.deepEqual(data.carryForwardDocumentIssueIds,['HEADER-01','BLUEPRINT-01']);
 assert.deepEqual(prev.globalDocumentIssues.map(x=>x.id),data.carryForwardDocumentIssueIds);
 for(const f of [
  'changedOriginalDocs','privateAnswerLettersCommitted',
  'privateAnswerExplanationsCommitted','candidateQuestionWordingCommitted'])
  assert.equal(data[f],false,'Owner private source changed or keyed payload published: '+f);
 assert.equal(data.heldAllBankItems,80);
 assert.equal(data.unit7StudentScoredQuestionCount,0);
 assert.equal(data.noExternalBackendOrLiveFirebaseChanges,true);
 assert.equal(data.sourceBoundItems.length,20);
 assert.deepEqual(data.sourceBoundItems.map(x=>x.sourceNumber),orderedTwenty);
 assert.equal(new Set(data.sourceBoundItems.map(x=>x.fullSourceRowSha256)).size,20);
 for(const row of data.sourceBoundItems){
  const n=row.sourceNumber;
  assert.match(row.fullSourceRowSha256,/^[a-f0-9]{64}$/);
  const match=Object.entries(SLO).find(([,nums])=>nums.includes(n));
  assert.ok(match,'Missing official source SLO for Q'+n);
  assert.equal(row.sourceMappedSlo,match[0]);
  const expectedLevel=KNOWLEDGE.includes(n)?'K':
   APPLICATION.includes(n)?'A':'U';
  assert.equal(row.originalItemCognitiveCode,expectedLevel);
  assert.equal(row.sourceNbfPrintedPage,SOURCE_PAGES[n]);
  assert.equal(row.originalKeyOfflineCheckedAgainstNbf,true);
  assert.equal(row.answerLetterMatchesSelectedOptionText,true);
  assert.equal(row.keyLetterErrorDetected,false);
  assert.equal(row.frameworkScope,
   SUPPORT.includes(n)?'supplementary-textbook-support':'direct-topic-core');
  assert.equal(row.disposition,'TEACHER_PENDING');
  assert.equal(row.teacherAcademicSignoff,'PENDING');
  assert.equal(row.studentScoredRelease,'HOLD');
  const must=MUST.includes(n),opt=OPTIONAL.includes(n);
  if(must||opt){
   assert.equal(row.changeNeeded,must?'compulsory-before-summative-use':'optional');
   assert.equal(row.issueCategory,ISSUE_CATS[n]);
   assert.ok(typeof row.issue==='string'&&row.issue.length>75,'Q'+n);
   assert.ok(typeof row.proposedAction==='string'&&row.proposedAction.length>75,'Q'+n);
   assert.ok(typeof row.originalCanBeKept==='string'&&row.originalCanBeKept.length>75,'Q'+n);
   assert.ok(memo.includes('**'+n+'**'),'QC report missing Q'+n);
  }else{
   assert.equal(row.changeNeeded,'none');
   assert.equal(row.issueCategory,null);
   assert.equal(row.issue,null);
   assert.equal(row.proposedAction,null);
   assert.equal(row.originalCanBeKept,null);
  }
  for(const forbidden of FORBIDDEN_ITEM_FIELDS)
   assert.equal(Object.hasOwn(row,forbidden),false,
    'Private source/answer/student field forbidden in public review: '+forbidden);
 }
 assert.deepEqual(new Set([...CORE,...SUPPORT]),new Set(orderedTwenty));
 assert.deepEqual(new Set([...MUST,...OPTIONAL]),new Set(data.questionNumbersFlagged));
 assert.deepEqual(new Set([...KNOWLEDGE,...UNDERSTANDING,...APPLICATION]),
  new Set(orderedTwenty));
 assert.equal(MUST.length+OPTIONAL.length,8);
 for(const marker of [
  'Q21–Q40','20/20','5 compulsory','3 optional','40 / 80',
  'pp.116–121','P-11-B-23','P-11-B-24','P-11-B-26',
  'elastic','supplementary','original','loaded-shelf','steel',
  'Application','PENDING','HOLD']){
  assert.ok(memo.toLowerCase().includes(marker.toLowerCase()),
   'V165 QC report missing '+marker);
 }
 const catalog=load('portal/learning-catalog.json');
 const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(u7.questionBankCount,0);
 assert.deepEqual(load('question-bank/manifest.json').grades
  .find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 const pending=load('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
 assert.equal(pending.teacherScienceSignoffs,0);
 assert.equal(pending.teacherCognitiveSignoffs,0);
 assert.equal(pending.unit7ScoredReleaseCount,0);
 assert.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
 assert.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,
  'NO_GO_DEPLOYMENT_BLOCKED');
 assert.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
  'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 assert.ok(!fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')));
 assert.ok(!fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07-topic72.json')));
 const summary={
  version:'V165',privateSourceName:SOURCE_NAME,privateDocxSha256:wordSha,
  originalOwnerMcqCount:80,thisBatchReviewed:20,
  cumulativelyReviewed:40,sourceRowsWrongKeyedInFirstPass:0,
  sourcePayloadInRepo:false,candidateWordingInRepo:false,
  compulsoryFlags:5,optionalFlags:3,supplementaryTopicItems:5,
  originalKUA:{K:5,U:12,A:3},cumulativeKUA:{K:20,U:17,A:3},
  inScopeApplicationCandidates:[22,24,40],
  previousHeaderAndApplicationBlueprintStillPending:true,
  teacherScientificApprovals:0,unit7ScoredQuestions:0,
  productionTeacherBackendAllowed:false,nextBatch:'Q41-Q60'
 };
 const out=path.join(ROOT,'qa-artifacts/grade11-v165-unit7-topic72-q21-q40');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
 console.log('V165 PASS: 20 source-bound Q21–40, 5 compulsory+3 optional review flags, 3 Application items, 0 keyed payloads, 0 Unit7 scored releases');
}
try{verify()}catch(err){console.error('V165 FAIL:',err.stack||err);process.exitCode=1;}
