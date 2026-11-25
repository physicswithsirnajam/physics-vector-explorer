#!/usr/bin/env node
'use strict';
/**
 * V169 Grade XI NBF Unit7.3 first 20 owner-authored MCQs:
 * keyless academic review attestation, never a scored answer-bank import.
 *
 * Original keyed answers were examined against the private owner Word source
 * and printed NBF pages 122–124 outside GitHub. CI has no private source and
 * cannot independently verify keyed science. It checks source fingerprint
 * consistency, official SLO/cognition metadata and academic release HOLD only.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const LEDGER='quality/unit07/topic73-v169-q01-q20-source-bound-academic-review-no-keys.json';
const MEMO='quality/grade11-v169-topic73-q01-q20-science-answer-slo-qc.md';
const ORIGINAL_SHA='f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279';
const BOOK_SHA='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const JOINED_SHA='42eaefced7c315a6a2aeec4eff43516e984192c6549bb384b41646a4987bb674';
const REQUIRED={
 'P-11-B-25':{official:'Understanding',numbers:[3,4,5,6,15,18,19],author:{K:3,U:2,A:2}},
 'P-11-B-27':{official:'Application',numbers:[7,8,9,12,14],author:{K:2,U:3,A:0}},
 'P-11-B-28':{official:'Application',numbers:[1,2,10,11,13,16,17,20],author:{K:6,U:2,A:0}}
};
const NEEDS={3:'compulsory-before-standalone-scored-use',
 5:'optional',6:'compulsory-cognitive-alignment-before-summative-use',
 7:'compulsory-source-graph-clarity-before-summative-use',
 12:'compulsory-assumption-clarification-before-summative-use',
 13:'optional',14:'optional',
 18:'compulsory-duplicate-decision-before-scored-use',
 19:'compulsory-cognitive-and-source-page-clarification'};
const CATS={3:'missing-figure-stimulus',5:'distractor-quality-and-overlap-watch',
 6:'author-level-and-slo-demand-mismatch',7:'textbook-axes-conflict',
 12:'linear-loading-wording',13:'low-demand-synonym-repetition',
 14:'graph-axis-context-precision',18:'near-duplicate-q5',
 19:'author-level-plus-geometry-prerequisite'};
const AUTHOR={
 1:'K',2:'U',3:'K',4:'U',5:'K',6:'A',7:'U',8:'K',9:'K',10:'K',
 11:'K',12:'U',13:'K',14:'U',15:'U',16:'K',17:'K',18:'K',19:'A',20:'U'
};
const PAGE={
 1:123,2:123,3:122,4:122,5:122,6:122,7:122,8:122,9:122,
 10:123,11:123,12:122,13:123,14:122,15:122,16:123,17:123,
 18:122,19:124,20:123
};
const PRIVATE_FIELDS=[
 'stem','question','questionText','prompt','options','optionA','optionB','optionC',
 'optionD','key','keyLetter','answerLetter','correctLetter','correctOption',
 'correctOptionText','oneLineExplanation','sourceExplanation','originalExplanation',
 'answer','originalAnswer','workedSolution','candidateStem','candidateOptions',
 'studentEmail','studentUid','teacherEmail','teacherUid','questionOptionText'
];
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const sha=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
function checkLedger(d){
 assert.equal(d.schemaVersion,1);
 assert.equal(d.version,'V169');
 assert.equal(d.topic,'Grade XI Physics Unit 7.3 Elastic Potential Energy');
 assert.equal(d.reviewBatch,'Q1-Q20 of original 80');
 assert.equal(d.sourceOriginalPrivateDocxName,
  'Grade11_Unit7_Topic7.3_PartA_80MCQs_Study_With_Answers.docx');
 assert.equal(d.sourceOriginalPrivateDocxSha256,ORIGINAL_SHA);
 assert.equal(d.duplicatePrivateSourceFileSha256,ORIGINAL_SHA);
 assert.equal(d.sourceNbfBookSha256,BOOK_SHA);
 assert.deepEqual(d.nbfPrintedPages,[122,123,124]);
 assert.ok(d.officialFramework.includes('Physics Grade XI'));
 assert.ok(d.officialFramework.includes('Curriculum 2022-23'));
 assert.deepEqual(d.officialSummativeSloCognitive,
  {'P-11-B-25':'Understanding','P-11-B-27':'Application',
   'P-11-B-28':'Application'});
 assert.equal(d.rowFingerprintRecipeId,'TOPIC73_V169_EXPLICIT_PRIVATE_SOURCE_JSON_V1');
 for(const s of ["SHA-256","'stem'","'options'","'keyLetter'",
  "'correctOptionText'","'oneLineExplanation'","'slo'","'level'",
  'JSON sorted keys','ensure_ascii=false']){
  assert.ok(d.rowFingerprintMethod.includes(s),'Missing source hash recipe part '+s);
 }
 assert.equal(d.sourceFullBankOriginalRows,80);
 assert.equal(d.reviewedOriginalRows,20);
 assert.equal(d.verifiedAnswerLettersAgainstSourceOptions,20);
 assert.equal(d.firstPassWrongKeyLettersDetected,0);
 assert.deepEqual(d.originalKeyedAnswerLettersAggregate,{A:3,B:4,C:6,D:7});
 assert.deepEqual(d.authorItemDemandCounts,{K:11,U:7,A:2});
 assert.deepEqual(d.authorSloCounts,{
  'P-11-B-25':{K:3,U:2,A:2,total:7},
  'P-11-B-27':{K:2,U:3,A:0,total:5},
  'P-11-B-28':{K:6,U:2,A:0,total:8}});
 assert.equal(d.sourceDirectTopicCandidates,19);
 assert.equal(d.supportingPrerequisiteCandidates,1);
 assert.deepEqual(d.compulsoryIssueNumbers,[3,6,7,12,18,19]);
 assert.deepEqual(d.optionalIssueNumbers,[5,13,14]);
 assert.deepEqual(d.unresolvedNearDuplicatePair,[5,18]);
 assert.equal(d.sourceBookGraphAxesKnownDiscrepancy.page,122);
 assert.equal(d.sourceBookGraphAxesKnownDiscrepancy.figure,'7.14');
 assert.equal(d.sourceBookGraphAxesKnownDiscrepancy.observedBookAxes,
  'weight/hanging force horizontally, extension vertically');
 assert.equal(d.sourceBookGraphAxesKnownDiscrepancy.physicallyCorrectWorkGraphAxes,
  'extension horizontally, force vertically');
 assert.equal(d.sourceBookGraphAxesKnownDiscrepancy.ownerTeacherDecision,'PENDING');
 assert.ok(d.crossBatchBlueprintNote.includes('P-11-B-27'));
 assert.ok(d.crossBatchBlueprintNote.includes('P-11-B-28'));
 assert.equal(d.originalSourceAuthorNotesAlreadyFlagGraphAndExample73,true);
 assert.equal(d.academicTeacherIndividualApprovals,0);
 assert.equal(d.unit7PublicScoredItems,0);
 for(const property of ['originalWordChanged','originalKeysUploadedToGitHub',
  'portalQuestionBankChanged','productionBackendChanged']){
  assert.equal(d[property],false,'Forbidden change: '+property);
 }
 assert.equal(d.priorTopic72PendingReleaseHold,true);
 assert.equal(d.nextBatch,
  'V170 Unit 7.3 original MCQs Q21-Q40 source, answer and summative SLO audit');
 assert.equal(d.sourceBoundItems.length,20);
 const nums=d.sourceBoundItems.map(r=>r.sourceNumber);
 assert.deepEqual(nums,Array.from({length:20},(_,i)=>i+1));
 const hashes=d.sourceBoundItems.map(r=>r.originalFullKeyedRowSha256);
 assert.equal(new Set(hashes).size,20);
 for(const h of hashes)assert.match(h,/^[a-f0-9]{64}$/);
 assert.equal(sha(hashes.join('\n')),JOINED_SHA);
 assert.equal(d.canonicalFirst20RowHashesJoinNewlineSha256,JOINED_SHA);
 const count={K:0,U:0,A:0},per={};
 for(const [key,v] of Object.entries(REQUIRED)){
  per[key]={K:0,U:0,A:0,total:0};
 }
 for(const row of d.sourceBoundItems){
  const n=row.sourceNumber;
  const match=Object.entries(REQUIRED).find(([,v])=>v.numbers.includes(n));
  assert.ok(match,'Unmapped original Q'+n);
  assert.equal(row.originalMappedSlo,match[0]);
  assert.equal(row.originalAuthorItemDemand,AUTHOR[n]);
  assert.equal(row.nbfReferencePrintedPage,PAGE[n]);
  assert.equal(row.originalKeyMatchesSelectedOptionText,true);
  assert.equal(row.firstPassScienceAnswerChecked,true);
  assert.equal(row.wrongKeyLetterDetected,false);
  assert.equal(row.scope,n===19?'supporting-experiment-prerequisite':'direct-topic-candidate');
  assert.equal(row.teacherScienceSignoff,'PENDING');
  assert.equal(row.teacherCognitiveSignoff,'PENDING');
  assert.equal(row.studentScoredRelease,'HOLD');
  assert.equal(row.changeNeeded,NEEDS[n]||'none');
  count[row.originalAuthorItemDemand]++;
  per[row.originalMappedSlo][row.originalAuthorItemDemand]++;
  per[row.originalMappedSlo].total++;
  if(NEEDS[n]){
   assert.equal(row.issueCategory,CATS[n]);
   assert.ok(row.issue?.length>70,'Insufficient issue rationale for Q'+n);
   assert.ok(row.proposedAction?.length>70,'Missing useful next action for Q'+n);
   assert.ok(row.originalCanBeKept?.length>55,'Missing retain-original guidance for Q'+n);
  }else{
   assert.equal(row.issueCategory,null);
   assert.equal(row.issue,null);
   assert.equal(row.proposedAction,null);
   assert.equal(row.originalCanBeKept,null);
  }
  for(const field of PRIVATE_FIELDS){
   assert.equal(Object.hasOwn(row,field),false,
    'Private keyed question/student identity in public ledger: '+field);
  }
 }
 assert.deepEqual(count,{K:11,U:7,A:2});
 assert.deepEqual(per,d.authorSloCounts);
 for(const [key,val] of Object.entries(REQUIRED))
  assert.deepEqual({...per[key],total:undefined}.total,undefined);
 assert.equal(d.compulsoryIssueNumbers.length,6);
 assert.equal(d.optionalIssueNumbers.length,3);
 assert.equal(d.sourceDirectTopicCandidates+d.supportingPrerequisiteCandidates,20);
 assert.equal(Object.hasOwn(d,'correctLetter'),false);
 assert.equal(Object.hasOwn(d,'correctAnswer'),false);
 assert.equal(Object.hasOwn(d,'answers'),false);
}
function mutationTests(d){
 const edits=[
  x=>x.sourceOriginalPrivateDocxSha256='0'.repeat(64),
  x=>x.sourceBoundItems[0].originalFullKeyedRowSha256='0'.repeat(64),
  x=>x.sourceBoundItems[7].originalMappedSlo='P-11-B-25',
  x=>x.sourceBoundItems[5].originalAuthorItemDemand='K',
  x=>x.sourceBoundItems[2].studentScoredRelease='PUBLISHED',
  x=>x.sourceBoundItems[1].teacherScienceSignoff='APPROVED',
  x=>x.sourceBoundItems[5].teacherCognitiveSignoff='APPROVED',
  x=>x.sourceBoundItems[3].correctOptionText='private keyed answer',
  x=>x.compulsoryIssueNumbers=[],
  x=>x.unresolvedNearDuplicatePair=[5,6],
  x=>x.sourceBookGraphAxesKnownDiscrepancy.ownerTeacherDecision='APPROVED',
  x=>x.originalKeysUploadedToGitHub=true,
  x=>x.unit7PublicScoredItems=20,
  x=>x.authorSloCounts['P-11-B-28'].A=8,
  x=>x.canonicalFirst20RowHashesJoinNewlineSha256='0'.repeat(64),
  x=>x.priorTopic72PendingReleaseHold=false
 ];
 for(const [i,edit] of edits.entries()){
  const mutant=structuredClone(d);edit(mutant);
  assert.throws(()=>checkLedger(mutant),
   undefined,'Weakening mutation '+(i+1)+' unexpectedly accepted');
 }
 return edits.length;
}
function main(){
 const d=json(LEDGER),memo=read(MEMO);
 checkLedger(d);
 const mutations=mutationTests(d);
 for(const marker of ['Q1–20','20/20','6','3',
  'Q3','Q5','Q6','Q7','Q12','Q13','Q14','Q18','Q19',
  'P-11-B-25','P-11-B-27','P-11-B-28','Figure 7.14',
  '11','7','2','scored','HOLD','PENDING']){
  assert.ok(memo.toLowerCase().includes(marker.toLowerCase()),
   'Academic memo missing expected source/decision discussion: '+marker);
 }
 const full72=json('quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
 assert.equal(full72.version,'V168');
 assert.equal(full72.fullOriginalQuestionRows,80);
 assert.equal(full72.individualTeacherScienceSignoffs,0);
 assert.equal(full72.unit7ScoredQuestionCount,0);
 assert.equal(full72.sourceNbfTextbookSha256,BOOK_SHA);
 const intro=json('portal/learning-catalog.json');
 const u7=intro.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(u7.questionBankCount,0);
 const manifest=json('question-bank/manifest.json');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 const original71=json('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
 assert.equal(original71.teacherScienceSignoffs,0);
 assert.equal(original71.teacherCognitiveSignoffs,0);
 assert.equal(original71.unit7ScoredReleaseCount,0);
 assert.equal(json('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
 assert.equal(json('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,
  'NO_GO_DEPLOYMENT_BLOCKED');
 assert.equal(json('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
  'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 assert.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
 assert.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07-topic73.json')),false);
 const out=path.join(ROOT,'qa-artifacts/grade11-v169-topic73-q01-q20-source-qc');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
  version:'V169',topic:'Grade XI 7.3 Elastic Potential Energy',
  originalPrivateBankSHA256:ORIGINAL_SHA,
  sourceFullBankRows:80,firstPassReviewed:20,
  incorrectKeyLettersFirstPass:0,
  sourceItemDemandCounts:{K:11,U:7,A:2},
  sourceOriginalSummativeSloCounts:{B25:7,B27:5,B28:8},
  compulsoryIssues:6,optionalIssues:3,
  missingApparatusStimulus:[3],textbookAxisClarity:[7,14],
  highOverlapPair:[5,18],
  genuineApplicationStillNeedsRemainingBankReview:true,
  mutationChecksRejected:mutations,
  originalOwnerKeyedSourceUploaded:false,academicApprovals:0,
  topic72AcademicHoldPreserved:true,unit7ScoredQuestions:0,
  nextSourceBatch:'Q21–Q40'
 },null,2)+'\n');
 console.log('V169 PASS: original Topic7.3 Q1–20 keyed-free science review, 6 compulsory/3 optional decisions, 16 adversarial mutations, 80 Unit7.2 HOLD and 0 scored Unit7');
}
try{main()}catch(e){console.error('V169 FAILED:',e.stack||e);process.exitCode=1;}
