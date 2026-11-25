#!/usr/bin/env node
'use strict';
/*
 * V148: NON-STUDENT academic-review evidence QA.
 * No original keys/explanations are stored here. CI cannot open the
 * privately held owner's Word file or certify human scientific judgment.
 * Immutable previous original-row SHA256 binds this metadata to V146.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const file=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(file(p));
const reg=json('quality/unit07/topic71-v148-80-source-answer-and-framework-review-register.json');
const source=json('quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json');
const stage=file('quality/unit07/topic71-v147-80-question-only-candidate.tsv');
const catalog=json('portal/learning-catalog.json');
const manifest=json('question-bank/manifest.json');
const unit6=json('quality/grade11-unit06-v94d-signoff-matrix.json');
const review=file('quality/grade11-v148-topic71-answer-key-and-understanding-level-audit.md');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const originalRows=stage.trimEnd().split('\n');
function main(){
 assert.equal(reg.schemaVersion,1);
 assert.equal(reg.version,'V148');
 assert.equal(reg.grade,11);assert.equal(reg.unit,7);
 assert.equal(reg.topic,'7.1 Classification of Solids');
 assert.equal(reg.sourceParentLedgerVersion,'V146');
 assert.equal(reg.candidateStagingVersion,'V147');
 assert.equal(reg.sourceOwnerDocxSha256,source.sourceDocxSha256);
 assert.equal(reg.sourceOwnerDocxSha256,'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58');
 assert.equal(sha(stage),'03659cb562a666477882c830d3c7c407bc9e90f41db5077ac75435cf14a80f2a');
 assert.equal(reg.sourceOfficialFramework,'11_Physics_HSSC_I_model_paper_50_percent(7).pdf');
 assert.equal(reg.frameworkReferencePage,10);
 assert.equal(reg.officialSloCode,'P-11-B-22');
 assert.equal(reg.officialSloWording,'Distinguish between the structures of crystalline, glassy, amorphous, and polymeric solids.');
 assert.equal(reg.officialSloClassification,'Summative');
 assert.equal(reg.officialSloCognitiveLevel,'Understanding');
 assert.equal(reg.finalAcademicSignoffsCompleted,0);
 assert.equal(reg.publicUnit7ScoredReleaseApproved,false);
 assert.equal(reg.records.length,80);
 assert.equal(source.items.length,80);
 assert.equal(originalRows.length,80);
 assert.equal(reg.firstPassCounts.directChapterDistinction,44);
 assert.equal(reg.firstPassCounts.supportingChapterDetail,36);
 assert.equal(reg.firstPassCounts.provisionalRecall,32);
 assert.equal(reg.firstPassCounts.provisionalUnderstanding,48);
 assert.deepEqual(reg.firstPassCounts.flagged,[8,9,10,15,31,62,76]);
 assert.deepEqual(reg.firstPassCounts.compulsory,[10,15,62,76]);
 assert.deepEqual(reg.firstPassCounts.optional,[8,9,31]);
 assert.deepEqual(reg.firstPassCounts.blocked,[76]);
 assert.equal(reg.firstPassCounts.provisionalChoiceSourceConsistent,79);
 const n={core:0,support:0,recall:0,understand:0,flagged:[],approved:0};
 const knownPages=new Set(['113–115','114, 116','115','113','115–116','116','113, 116']);
 const permissibleFields=[
  'id','sourceNumber','sourceOriginalFullRowSha256',
  'sourceAnswerOptionPresentAndSelectable','sourceExplanationNonblank',
  'sourceKeyExplanationFirstPass','plannedCandidateStemChange',
  'evidenceChapterPages','originalTopicCluster','officialSloCode',
  'officialSloStatus','officialSloCognitiveTarget','itemCognitiveFirstPass',
  'fullSloFitFirstPass','teacherScientificSignoff','publicScoredPracticeApproved',
  'secureGradedExamApproved'
 ];
 const seen=new Set();
 for(let i=0;i<80;i++){
  const x=reg.records[i],y=source.items[i],options=originalRows[i].split('\t');
  assert.deepEqual(Object.keys(x),permissibleFields);
  assert.equal(x.id,y.id);
  assert.equal(x.id,'XI-U07-T071-Q'+String(i+1).padStart(3,'0'));
  assert.ok(!seen.has(x.id));seen.add(x.id);
  assert.equal(x.sourceNumber,i+1);
  assert.equal(x.sourceOriginalFullRowSha256,y.sourceFullRowSha256);
  assert.equal(options.length,5);
  assert.ok(options.every(z=>z.length>0));
  assert.equal(new Set(options.slice(1)).size,4);
  assert.equal(x.sourceAnswerOptionPresentAndSelectable,true);
  assert.equal(x.sourceExplanationNonblank,true);
  assert.ok(knownPages.has(x.evidenceChapterPages));
  assert.equal(x.originalTopicCluster,y.topicGroup);
  assert.equal(x.officialSloCode,'P-11-B-22');
  assert.equal(x.officialSloStatus,'SUMMATIVE_THEORY');
  assert.equal(x.officialSloCognitiveTarget,'Understanding');
  assert.equal(x.teacherScientificSignoff,'PENDING');
  assert.equal(x.publicScoredPracticeApproved,false);
  assert.equal(x.secureGradedExamApproved,false);
  assert.equal(y.studentPracticeRelease,'HOLD');
  assert.equal(x.plannedCandidateStemChange,[15,62].includes(i+1));
  const reviewStatuses={
   8:'OPTIONAL_TEXTBOOK_TERMINOLOGY_REVIEW_Q8',
   9:'OPTIONAL_TEXTBOOK_TERMINOLOGY_REVIEW_Q9',
   10:'SOURCE_EXPLANATION_ATTRIBUTION_ERROR_Q10',
   15:'TEXTBOOK_SCOPE_REVIEW_Q15',
   31:'OPTIONAL_TEXTBOOK_TERMINOLOGY_REVIEW_Q31',
   62:'ORIGINAL_STEM_PRECISION_REVIEW_Q62',
   76:'BLOCKING_SOURCE_LISTING_ERROR_Q76'
  };
  const reviewStatus=reviewStatuses[i+1]||'NO_SPECIFIC_CONTRADICTION_IDENTIFIED_PROVISIONAL';
  assert.equal(x.sourceKeyExplanationFirstPass,reviewStatus);
  if(x.sourceKeyExplanationFirstPass!=='NO_SPECIFIC_CONTRADICTION_IDENTIFIED_PROVISIONAL')
   n.flagged.push(i+1);
  if(x.fullSloFitFirstPass==='CORE_STRUCTURE_DISTINCTION')n.core++;
  else{assert.equal(x.fullSloFitFirstPass,'SUPPORTING_CHAPTER_DETAIL_REVIEW_FOR_BOARD');n.support++}
  if(x.itemCognitiveFirstPass==='Recall/Knowledge')n.recall++;
  else{assert.equal(x.itemCognitiveFirstPass,'Understanding_candidate');n.understand++}
  if(x.teacherScientificSignoff!=='PENDING')n.approved++;
 }
 assert.deepEqual(n,{core:44,support:36,recall:32,understand:48,flagged:[8,9,10,15,31,62,76],approved:0});
 for(const marker of [
  'Q8','Q9','Q10','Q15','Q31','Q62','Q76','Nylon','Polythene','Understanding','Summative','32','48','80',
  'Compulsory','Optional','not automatically',
  'not teacher-approved','textbook','113–116','seven crystal systems'
 ]){
  assert.ok(review.toLowerCase().includes(marker.toLowerCase()),
   'Missing required source/teacher decision discussion: '+marker);
 }
 const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(u7.questionBankCount,0);
 assert.deepEqual(u7.resourceIds,[]);
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 assert.equal(unit6.releaseApproved,false);assert.equal(unit6.teacherSignoff,'pending');
 assert.ok(!fs.existsSync(path.join(root,'question-bank/grade-11/unit-07.json')));
 assert.ok(!fs.existsSync(path.join(root,'question-bank/grade-11/unit-07-topic71.json')));
 // Do not leak the student's keyed answer choices or the teacher explanations.
 for(const x of reg.records){
  for(const banned of ['correctOptionId','correctOption','key',
   'sourceAnswerLetter','explanation','teacherExplanation','studentUid','email']){
   assert.equal(Object.hasOwn(x,banned),false,'Forbidden field '+banned);
  }
 }
 const output=path.join(root,'qa-artifacts/grade11-v148-unit7-topic71-framework-review');
 fs.mkdirSync(output,{recursive:true});
 fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify({
  version:'V148',sourceOwnerWordSha256:reg.sourceOwnerDocxSha256,
  sourceRefPages:'NBF pp. 113–116',frameworkRef:'P-11-B-22 / Summative / Understanding',
  externalSourceKeyOptionChecksReported:80,sourceExplanationsPresentReported:80,
  firstPassScientificReviewFlags:[8,9,10,15,31,62,76],
  compulsoryTeacherDecisionItems:[10,15,62,76],
  optionalTermPrecisionItems:[8,9,31],
  provisionalChoiceSourceConsistent:79,
  blockingFalseTextbookListingItem:76,
  officialLevelUnderstanding:true,provisionalRecallCount:32,
  provisionalUnderstandingCandidateCount:48,
  directStructureConceptRows:44,supportingChapterDetailRows:36,
  actualAnswerLettersReleased:0,originalAnswerExplanationsReleased:0,
  individualTeacherAcademicApprovals:0,
  originalGrade11PublicProvisionalCount:2250,
  unit7LiveScoredCount:0,unit6FormalExamReleased:false,
  academicFindingCertification:'PRELIMINARY_NOT_TEACHER_APPROVED',
  originalOwnerDocumentReopenedInsideGithubCI:false,
  FirebaseOrUserDataChanged:false
 },null,2)+'\n');
 console.log('V148 PASS: 80 source-answer/explanation observations reconciled to original V146 fingerprints; B-22 summative Understanding, 32 provisional recall cases, 4 compulsory teacher decisions (Q10/15/62/76), 3 optional terminology flags; all 80 teacher approvals pending, 0 live Unit7 scored items.');
}
try{main()}catch(e){console.error('V148 FAILED:',e.stack||e);process.exitCode=1}
