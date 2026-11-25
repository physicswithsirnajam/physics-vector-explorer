#!/usr/bin/env node
'use strict';
/**
 * V167: final original Grade XI Unit7.2 MCQ batch Q61–Q80,
 * source-provenance/fingerprints and student scoring HOLD.
 *
 * Original owner questions, answer letters and explanations were inspected
 * PRIVATELY; they are not in public GitHub CI. These source-only tests verify
 * consistency and NO RELEASE, not independent live scientific certification.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const INPUTS=[
 'quality/unit07/topic72-v164-first20-source-bound-teacher-review-no-keys.json',
 'quality/unit07/topic72-v165-q21-q40-source-bound-review-no-keys.json',
 'quality/unit07/topic72-v166-q41-q60-source-bound-numerical-review-no-keys.json',
 'quality/unit07/topic72-v167-q61-q80-source-bound-scenario-review-no-keys.json'
];
const MEMO='quality/grade11-v167-topic72-q61-q80-scenario-answer-slo-qc.md';
const DOCX='Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx';
const SHA='a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada';
const NBF='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const REQUIRED_SLO={
 'P-11-B-23':[61,62,66,76],
 'P-11-B-24':[63,68,70,71,72,77,78],
 'P-11-B-26':[64,65,67,69,73,74,75,79,80]
};
const CORE=[61,64,65,66,67,68,69,70,71,73,77,78,79];
const SUPPORT=[62,63,72,74,75,76,80];
const COMPULSORY=[62,63,72,76,80],OPTIONAL=[74,75];
const APPLICATION=[68,70,71,77,78];
const PAGES={
 61:117,62:117,63:118,64:121,65:121,66:117,67:121,
 68:120,69:120,70:118,71:117,72:119,73:121,74:121,
 75:121,76:117,77:121,78:118,79:121,80:121
};
const TYPES={
 62:'summative-slo-scope',63:'summative-slo-scope',
 72:'summative-slo-scope',74:'supplementary-concept-and-overlap',
 75:'supplementary-concept-and-overlap',76:'summative-slo-scope',
 80:'summative-slo-scope-and-near-duplicate'
};
const PRIVATE_FIELDS=[
 'stem','questionText','question','prompt','options',
 'optionA','optionB','optionC','optionD','correctOption',
 'correctOptionText','correctLetter','keyLetter','answerLetter',
 'oneLineExplanation','sourceExplanation','originalExplanation',
 'originalAnswer','answerKey','key','studentUid','studentEmail',
 'teacherUid','teacherEmail'
];
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
function check(){
 const [v164,v165,v166,d]=INPUTS.map(load);
 const memo=read(MEMO);
 assert.deepEqual([v164.version,v165.version,v166.version,d.version],
  ['V164','V165','V166','V167']);
 assert.equal(d.schemaVersion,1);
 assert.equal(d.unit,'Grade XI Unit 7.2 Deformation in Solids');
 assert.equal(d.batch,'Q61-Q80 of original 80');
 assert.deepEqual(d.priorBatches,['V164 Q1-Q20','V165 Q21-Q40','V166 Q41-Q60']);
 for(const audit of [v164,v165,v166,d]){
  assert.equal(audit.sourceOriginalPrivateDocxName,DOCX);
  assert.equal(audit.sourceOriginalPrivateDocxSha256,SHA);
  assert.equal(audit.sourceNbfTextbookSha256,NBF);
  assert.equal(audit.fullBankOriginalRows,80);
  assert.equal(audit.firstPassReviewed,20);
  assert.equal(audit.keyLetterErrorsDetected,0);
  assert.equal(audit.sourceBoundItems.length,20);
  assert.equal(audit.heldAllBankItems,80);
  assert.equal(audit.unit7StudentScoredQuestionCount,0);
  assert.equal(audit.changedOriginalDocs,false);
  assert.equal(audit.privateAnswerLettersCommitted,false);
  assert.equal(audit.privateAnswerExplanationsCommitted,false);
  assert.equal(audit.candidateQuestionWordingCommitted,false);
  assert.equal(audit.noExternalBackendOrLiveFirebaseChanges,true);
  assert.deepEqual(audit.officialSummativeSloLevels,
   {'P-11-B-23':'Understanding','P-11-B-24':'Application',
    'P-11-B-26':'Understanding'});
 }
 assert.equal(d.fileProvenanceMethod,
  'PRIVATE_DOCX_Q61_TO_Q80_EXTRACTED_AND_MANUALLY_COMPARED_WITH_NBF_PAGE_IMAGES');
 assert.equal(d.officialFramework,v165.officialFramework);
 assert.equal(d.rowDigestRecipeId,'V165_EXPLICIT_JSON_SOURCE_ROW_V1');
 assert.equal(d.rowDigestRecipeId,v166.rowDigestRecipeId);
 assert.equal(d.rowDigestMethod,v166.rowDigestMethod);
 assert.ok(d.directPrivateDocxRecipeSpotCheck.includes('Q21 and Q41'));
 assert.deepEqual(d.sourceNbfPrintedPages,[117,118,119,120,121]);
 assert.equal(d.firstPassReviewed,20);
 assert.equal(d.cumulativeOriginalRowsReviewed,80);
 assert.equal(v165.cumulativeOriginalRowsReviewed,40);
 assert.equal(v166.cumulativeOriginalRowsReviewed,60);
 assert.deepEqual(d.originalItemCognitionCounts,{K:0,U:15,A:5});
 assert.deepEqual(d.cumulativeOriginalItemCognitionCounts,{K:20,U:32,A:28});
 assert.deepEqual(v165.cumulativeOriginalItemCognitionCounts,{K:20,U:17,A:3});
 assert.deepEqual(v166.cumulativeOriginalItemCognitionCounts,{K:20,U:17,A:23});
 assert.equal(d.coreSummativeScopeDirectCount,13);
 assert.equal(d.supplementaryScopeCount,7);
 assert.equal(d.itemFlagsCount,7);
 assert.equal(d.compulsoryItemFlagsCount,5);
 assert.equal(d.optionalItemFlagsCount,2);
 assert.deepEqual(d.questionNumbersFlagged,[62,63,72,74,75,76,80]);
 assert.deepEqual(d.inScopeApplicationCandidates,APPLICATION);
 assert.deepEqual(d.existingDocumentIssuesCarriedForward,['HEADER-01','BLUEPRINT-01']);
 assert.deepEqual(d.existingDocumentIssuesCarriedForward,
  v166.existingDocumentIssuesCarriedForward);
 assert.equal(d.nearDuplicateCandidatesRequiringWholeBankReview.length,3);
 assert.deepEqual(d.nearDuplicateCandidatesRequiringWholeBankReview
  .map(x=>[x.question,x.earlierQuestion]),[[80,33],[74,37],[75,36]]);
 assert.ok(d.nearDuplicateCandidatesRequiringWholeBankReview
  .every(x=>x.status==='PENDING_TEACHER_DECISION'));
 assert.equal(d.releaseNextStep.startsWith('V168'),true);
 assert.equal(d.releasePolicy,
  'QUESTION BANK AND ANSWER KEYS PRIVATE; TEACHER SCIENCE SIGNOFF PENDING; NO SCORED USE');
 assert.equal(d.privateNumericalKeyValuesCommitted,false);
 const allItems=[v164,v165,v166,d].flatMap(x=>x.sourceBoundItems);
 assert.deepEqual(allItems.map(x=>x.sourceNumber),
  Array.from({length:80},(_,i)=>i+1));
 assert.equal(new Set(allItems.map(x=>x.fullSourceRowSha256)).size,80);
 for(const row of allItems){
  assert.match(row.fullSourceRowSha256,/^[a-f0-9]{64}$/);
  assert.equal(row.disposition,'TEACHER_PENDING');
  assert.equal(row.teacherAcademicSignoff,'PENDING');
  assert.equal(row.studentScoredRelease,'HOLD');
  assert.equal(row.originalKeyOfflineCheckedAgainstNbf,true);
  assert.equal(row.keyLetterErrorDetected,false);
  for(const privateField of PRIVATE_FIELDS){
   assert.equal(Object.hasOwn(row,privateField),false,
    'Public audit must not include keyed question, answer or student record: '+privateField);
  }
 }
 assert.deepEqual(d.sourceBoundItems.map(x=>x.sourceNumber),
  Array.from({length:20},(_,i)=>i+61));
 assert.deepEqual(new Set([...CORE,...SUPPORT]),
  new Set(Array.from({length:20},(_,i)=>i+61)));
 assert.deepEqual(new Set([...COMPULSORY,...OPTIONAL]),
  new Set(d.questionNumbersFlagged));
 for(const row of d.sourceBoundItems){
  const n=row.sourceNumber;
  const found=Object.entries(REQUIRED_SLO).find(([,nums])=>nums.includes(n));
  assert.ok(found,'Missing SLO mapping '+n);
  assert.equal(row.sourceMappedSlo,found[0]);
  assert.equal(row.originalItemCognitiveCode,APPLICATION.includes(n)?'A':'U');
  assert.equal(row.sourceNbfContextPage,PAGES[n]);
  assert.equal(row.answerLetterMatchesSelectedOptionText,true);
  assert.equal(row.frameworkScope,
   SUPPORT.includes(n)?'supplementary-textbook-support':'direct-topic-core');
  const kind=COMPULSORY.includes(n)?'compulsory-before-summative-use':
   OPTIONAL.includes(n)?'optional':'none';
  assert.equal(row.changeNeeded,kind);
  if(kind==='none'){
   assert.equal(row.issueCategory,null);
   assert.equal(row.issue,null);
   assert.equal(row.proposedAction,null);
   assert.equal(row.originalCanBeKept,null);
  }else{
   assert.equal(row.issueCategory,TYPES[n]);
   assert.ok(typeof row.issue==='string'&&row.issue.length>50);
   assert.ok(typeof row.proposedAction==='string'&&row.proposedAction.length>40);
   assert.ok(typeof row.originalCanBeKept==='string'&&row.originalCanBeKept.length>20);
   assert.ok(memo.includes('**'+n+'**'),'Missing detailed flagged item '+n);
  }
 }
 const cognition={K:0,U:0,A:0};
 let core=0,support=0,comp=0,opt=0;
 for(const ledger of [v164,v165,v166,d]){
  for(const [level,number] of Object.entries(ledger.originalItemCognitionCounts))
   cognition[level]+=number;
  core+=ledger.coreSummativeScopeDirectCount;
  support+=ledger.supplementaryScopeCount;
  comp+=ledger.compulsoryItemFlagsCount??7; // V164 has seven compulsory.
  opt+=ledger.optionalItemFlagsCount??2; // V164 has two optional.
 }
 assert.deepEqual(cognition,{K:20,U:32,A:28});
 assert.equal(core,52);assert.equal(support,28);
 assert.equal(comp,25);assert.equal(opt,8);
 for(const phrase of ['Q61–Q80','80 of 80','Q80','Q33','5','2',
  '20','32','28','compulsory','optional',
  'P-11-B-23','P-11-B-24','P-11-B-26',
  'teacher','PENDING','scored','HOLD','duplicate']){
   assert.ok(memo.toLowerCase().includes(phrase.toLowerCase()),
    'Final batch memo missing source-supported finding: '+phrase);
 }
 const catalogue=load('portal/learning-catalog.json');
 const unit7=catalogue.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(unit7.status,'planned');
 assert.equal(unit7.assessmentStatus,'not-published');
 assert.equal(unit7.questionBankCount,0);
 assert.deepEqual(load('question-bank/manifest.json').grades.find(g=>g.grade===11)
  .units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
 const priorTopic=load('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
 assert.equal(priorTopic.teacherScienceSignoffs,0);
 assert.equal(priorTopic.teacherCognitiveSignoffs,0);
 assert.equal(priorTopic.unit7ScoredReleaseCount,0);
 assert.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
 assert.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,
  'NO_GO_DEPLOYMENT_BLOCKED');
 assert.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
  'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 assert.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
 assert.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07-topic72.json')),false);
 const out=path.join(ROOT,'qa-artifacts/grade11-v167-unit7-topic72-q61-q80');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
  version:'V167',originalPrivateDocxSha256:SHA,
  lastBatchReviewed:20,cumulativeFirstPassReviewed:80,
  wrongKeyLettersDetectedFirstPass:0,
  privateKeyedRowsInRepo:false,
  lastBatchOriginalItemDemand:{K:0,U:15,A:5},
  all80OriginalItemDemand:{K:20,U:32,A:28},
  all80DirectScopeCandidates:52,all80SupplementaryCandidates:28,
  lastBatchCompulsory:5,lastBatchOptional:2,
  cumulativeCompulsory:25,cumulativeOptional:8,
  crossBatchDuplicateWatchPairs:[[80,33],[74,37],[75,36]],
  sourceFirstPassDone:true,
  academicTeacherSignoffs:0,unit7ScoredQuestionCount:0,
  ownerProductionDeploymentApproved:false,
  nextStep:'V168 whole-bank original 80-item QC; not scored release'
 },null,2)+'\n');
 console.log('V167 PASS: source-bound Q61-80 and contiguous 80/80 first-pass; K20/U32/A28, 25 compulsory scope/wording + 8 optional flags; teacher PENDING and 0 scored Unit7');
}
try{check()}catch(e){console.error('V167 FAIL:',e.stack||e);process.exitCode=1;}
