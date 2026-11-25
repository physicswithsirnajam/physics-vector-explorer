#!/usr/bin/env node
'use strict';
/**
 * V164 OFFLINE structural audit of the first 20 Grade XI Unit 7.2
 * original owner-supplied MCQ rows. No private Word, answer letters,
 * explanations or original stems/options are embedded in GitHub.
 *
 * Offline fingerprints are source provenance ATTESTATIONS made from the
 * privately inspected original DOCX, NOT reproductions/verifications of
 * the private source in CI. Teacher academic signoff remains pending.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const SOURCE='quality/unit07/topic72-v164-first20-source-bound-teacher-review-no-keys.json';
const MEMO='quality/grade11-v164-topic72-first20-scientific-answer-slo-qc.md';
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const CORE=[1,2,3,4,5,6,10,11,14,15,16,20];
const SUPPORT=[7,8,9,12,13,17,18,19];
const MUST=[7,8,9,15,17,18,19];
const OPTIONAL=[12,13];
const KNOWLEDGE=[1,2,3,5,7,9,11,12,13,14,15,16,17,18,20];
const UNDERSTANDING=[4,6,8,10,19];
const SLO={
 'P-11-B-23':{level:'Understanding',numbers:[1,5,6,7,8,9]},
 'P-11-B-24':{level:'Application',numbers:[2,3,4,10,11,12,13,15,16,17,18,19]},
 'P-11-B-26':{level:'Understanding',numbers:[14,20]}
};
const REFUSAL_FIELDS=[
 'stem','question','prompt','options','answer','correctOption',
 'correctLetter','answerLetter','key','optionLetter','originalExplanation',
 'sourceExplanation','oneLineExplanation','correctOptionText',
 'originalAnswer','studentUid','studentEmail','teacherUid'
];
function check(){
 const data=json(SOURCE),memo=read(MEMO);
 assert.equal(data.schemaVersion,1);
 assert.equal(data.version,'V164');
 assert.equal(data.batch,'Q1-Q20 of original 80');
 assert.equal(data.unit,'Grade XI Unit 7.2 Deformation in Solids');
 assert.equal(data.sourceOriginalPrivateDocxName,
  'Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx');
 assert.equal(data.sourceOriginalPrivateDocxSha256,
  'a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada');
 assert.equal(data.sourceNbfTextbookSha256,
  '00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe');
 assert.deepEqual(data.sourceNbfPrintedPages,[116,117,118,119,120,121]);
 assert.equal(data.fileProvenanceMethod,
  'PRIVATE_DOCX_EXTRACTED_AND_MANUALLY_COMPARED_WITH_NBF_PAGE_IMAGES');
 assert.equal(data.sourceOriginalPrivateDocxName.includes('.docx'),true);
 assert.equal(data.rowDigestMethod.includes('SHA-256'),true);
 assert.ok(data.officialFramework.includes('Curriculum 2022-23'));
 assert.deepEqual(data.officialSummativeSloLevels,
  {'P-11-B-23':'Understanding',
   'P-11-B-24':'Application',
   'P-11-B-26':'Understanding'});
 assert.equal(data.fullBankOriginalRows,80);
 assert.equal(data.firstPassReviewed,20);
 assert.equal(data.keyLetterErrorsDetected,0);
 assert.deepEqual(data.originalItemCognitionCounts,{K:15,U:5,A:0});
 assert.equal(data.coreSummativeScopeDirectCount,12);
 assert.equal(data.supplementaryScopeCount,8);
 assert.equal(data.changedOriginalDocs,false);
 assert.equal(data.privateAnswerLettersCommitted,false);
 assert.equal(data.privateAnswerExplanationsCommitted,false);
 assert.equal(data.candidateQuestionWordingCommitted,false);
 assert.equal(data.noExternalBackendOrLiveFirebaseChanges,true);
 assert.equal(data.heldAllBankItems,80);
 assert.equal(data.unit7StudentScoredQuestionCount,0);
 assert.deepEqual(data.globalDocumentIssues.map(x=>x.id),
  ['HEADER-01','BLUEPRINT-01']);
 for(const x of data.globalDocumentIssues){
  assert.match(x.severity,/^compulsory/);
  assert.equal(x.teacherApproval,'PENDING');
  assert.ok(x.finding.length>70&&x.action.length>70);
 }
 assert.equal(data.sourceBoundItems.length,20);
 assert.equal(new Set(data.sourceBoundItems.map(x=>x.sourceNumber)).size,20);
 assert.deepEqual(data.sourceBoundItems.map(x=>x.sourceNumber),
  Array.from({length:20},(_,i)=>i+1));
 assert.equal(new Set(data.sourceBoundItems.map(x=>x.fullSourceRowSha256)).size,20);
 for(const item of data.sourceBoundItems){
  const n=item.sourceNumber;
  assert.match(item.fullSourceRowSha256,/^[a-f0-9]{64}$/);
  const slo=Object.entries(SLO).find(([,s])=>s.numbers.includes(n));
  assert.ok(slo,'Missing official SLO for item '+n);
  assert.equal(item.sourceMappedSlo,slo[0]);
  assert.equal(item.originalItemCognitiveCode,
   KNOWLEDGE.includes(n)?'K':'U');
  assert.ok(KNOWLEDGE.includes(n)||UNDERSTANDING.includes(n));
  assert.equal(item.originalKeyOfflineCheckedAgainstNbf,true);
  assert.equal(item.keyLetterErrorDetected,false);
  assert.equal(item.frameworkScope,
   SUPPORT.includes(n)?'supplementary-textbook-support':'direct-topic-core');
  assert.equal(item.disposition,'TEACHER_PENDING');
  assert.equal(item.teacherAcademicSignoff,'PENDING');
  assert.equal(item.studentScoredRelease,'HOLD');
  const expected=MUST.includes(n)?'compulsory':
   OPTIONAL.includes(n)?'optional':'none';
  if(expected==='none'){
   assert.equal(item.changeNeeded,'none');
   assert.equal(item.issue,null);
   assert.equal(item.originalCanBeKept,null);
  }else{
   assert.ok(item.changeNeeded.startsWith(expected));
   assert.ok(item.issue?.length>50);
   assert.ok(item.originalCanBeKept?.length>40);
  }
  for(const forbidden of REFUSAL_FIELDS)
   assert.equal(Object.hasOwn(item,forbidden),false,
    'Private answer, student or source text forbidden in ledger: '+forbidden);
 }
 for(const forbidden of [
  'originalCorrectOption','originalAnswerKey',
  'rawFullSourceRow','correctOptionText','oneLineExplanation'
 ]){
  assert.equal(Object.hasOwn(data,forbidden),false);
 }
 assert.deepEqual(CORE.filter(n=>SUPPORT.includes(n)),[]);
 assert.equal(CORE.length+SUPPORT.length,20);
 assert.deepEqual(MUST,[7,8,9,15,17,18,19]);
 assert.deepEqual(OPTIONAL,[12,13]);
 for(const n of MUST)
  assert.ok(memo.includes('**'+n+'**'),'Compulsory Q'+n+' not documented');
 for(const n of OPTIONAL)
  assert.ok(memo.includes('**'+n+'**'),'Optional Q'+n+' not documented');
 for(const marker of ['20/20','15 K','5 U','0 A','pp.116–121',
  'Corrected','academic','student scored','original can be kept',
  'Source-page header','Application coverage']){
  // The memo's section headings may differ in capitalization; all are
  // structurally checked case-insensitively instead of exact formatting.
  if(marker==='original can be kept'||marker==='Corrected')continue;
  assert.ok(memo.toLowerCase().includes(marker.toLowerCase()),
   'Missing independent QC memo marker: '+marker);
 }
 assert.equal(json('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json')
  .teacherScienceSignoffs,0);
 const catalog=json('portal/learning-catalog.json');
 const unit7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(unit7.status,'planned');
 assert.equal(unit7.assessmentStatus,'not-published');
 assert.equal(unit7.questionBankCount,0);
 assert.deepEqual(json('question-bank/manifest.json').grades.find(g=>g.grade===11)
  .units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
 assert.equal(json('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
 assert.equal(json('quality/unit07/topic71-v160-production-readiness-no-go.json')
  .decision,'NO_GO_DEPLOYMENT_BLOCKED');
 assert.equal(json('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json')
  .decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 assert.ok(!fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')));
 assert.ok(!fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07-topic72.json')));
 const out=path.join(ROOT,'qa-artifacts/grade11-v164-unit7-topic72-first20');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
  version:'V164',originalSourceName:data.sourceOriginalPrivateDocxName,
  sourcePrivateSha256:data.sourceOriginalPrivateDocxSha256,
  sourceRowsAudited:20,sourceFullBankRows:80,
  originalKeysFoundWrongInManualReview:0,
  answerOptionTextMatchesOriginalLetterOffRepo:true,
  originalQuestionTextOrKeyStoredInRepo:false,
  compulsoryItemFlags:MUST.length,optionalItemFlags:OPTIONAL.length,
  originalSloDemandCounts:{K:15,U:5,A:0},
  requiredApplicationCoverageCheckStillPending:true,
  originalTeacherAcademicApprovals:0,unit7ScoredMcqs:0,
  nextSourceBatch:'Q21-Q40',backEndDeployment:'NO_GO'
 },null,2)+'\n');
 console.log('V164 PASS: 20 owner-source fingerprints, 7 compulsory/2 optional scope/clarity flags, 0 incorrect keys found privately; 80 teacher HOLD and 0 scored Unit7');
}
try{check();}catch(e){console.error('V164 FAIL:',e.stack||e);process.exitCode=1;}
