#!/usr/bin/env node
'use strict';
/* V153: metadata-only review of Q61-80, including Q62/76 staged source corrections.
 * IMPORTANT: CI cannot reopen the owner's original keyed Word. Teacher signatures stay PENDING.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..'),text=p=>fs.readFileSync(path.join(base,p),'utf8'),j=p=>JSON.parse(text(p));
function main(){
 const reg=j('quality/unit07/topic71-v153-batch4-61-80-keyless-scenario-review.json');
 const old=j('quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json');
 const before=j('quality/unit07/topic71-v148-80-source-answer-and-framework-review-register.json');
 const first=j('quality/unit07/topic71-v150-batch1-20-teacher-review-no-keys.json');
 const second=j('quality/unit07/topic71-v151-batch2-21-40-keyless-science-review.json');
 const third=j('quality/unit07/topic71-v152-batch3-41-60-keyless-science-review.json');
 const questionText=text('quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv');
 const rows=questionText.trimEnd().split('\n').map(x=>x.split('\t'));
 const note=text('quality/grade11-v153-batch4-61-80-scenario-academic-teacher-review.md');
 assert.equal(reg.schemaVersion,1);assert.equal(reg.version,'V153');assert.equal(reg.unit,7);assert.equal(reg.topic,'7.1');
 assert.deepEqual(reg.batch,[61,80]);assert.equal(reg.totalSourceQuestions,80);assert.equal(reg.batchCount,20);
 assert.equal(reg.originalWordSha256,old.sourceDocxSha256);
 assert.equal(reg.originalWordSha256,'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58');
 assert.equal(reg.reviewType,'AI_ASSISTED_FIRST_PASS_NOT_TEACHER_SIGNOFF');
 assert.equal(reg.originalKeyOptionReferenceValidCount,20);
 assert.equal(reg.originalExplanationNonblankCount,20);
 assert.equal(reg.currentCandidateOptionPositionsComparedToOriginalKeyCount,20);
 assert.equal(reg.scenarioQuestionFormat,'20_STANDALONE_SITUATION_STEMS_NOT_GROUPED_FBISE_STIMULUS');
 assert.deepEqual(reg.compulsoryTeacherDecisions,[62,76]);
 assert.deepEqual(reg.compulsoryTeacherExplanationRewriteBeforeScoring,[76]);
 assert.deepEqual(reg.optionalDistractorQuality,[61,66,77,80]);
 assert.deepEqual(reg.optionalTextbookMonomerPrecision,[68]);
 assert.deepEqual(reg.teachingClassificationsOverlap,[63,69,70,74,76]);
 assert.deepEqual(reg.proposedCognitiveReclassifications,[64,65,73,77]);
 assert.deepEqual(reg.provisionalOriginalCognitiveCounts,{recall:3,understandingCandidates:17});
 assert.deepEqual(reg.provisionalB22ScopeCounts,{directCore:13,supporting:7});
 assert.equal(reg.teacherScientificSignoffs,0);assert.equal(reg.teacherCognitiveSignoffs,0);
 assert.equal(reg.allUnit7TeacherApprovalsPending,true);assert.equal(reg.unit7ScoredQuestions,0);
 assert.equal(reg.publicSourceAnswerLettersIncluded,false);
 assert.equal(reg.publicOwnerExplanationTextsIncluded,false);
 assert.equal(reg.officialSlo,'P-11-B-22');assert.equal(reg.officialSloStatus,'SUMMATIVE_THEORY');
 assert.equal(reg.officialSloCognitive,'Understanding');
 assert.deepEqual(first.batchRange,[1,20]);assert.deepEqual(second.batch,[21,40]);
 assert.deepEqual(third.batch,[41,60]);assert.equal(first.pendingIndividualTeacherSignoffs,20);
 assert.equal(second.teacherScientificApprovals,0);assert.equal(third.teacherScientificSignoffs,0);
 assert.equal(old.items.length,80);assert.equal(before.records.length,80);assert.equal(rows.length,80);assert.equal(reg.items.length,20);
 assert.ok(questionText.endsWith('\n')&&!questionText.endsWith('\n\n'));
 const allowed=['id','sourceNumber','v146OriginalSourceFullRowSha256','sourceNbfPrintedPages','focus',
 'scientificEditorialFirstPass','originalOwnerWordKeyOptionExists','originalOwnerWordExplanationExists',
 'candidateCorrectOptionPositionPreserved','officialSlo','officialSloForm','officialSloTarget',
 'v148CognitiveFirstPass','v148SloFitFirstPass','teacherReviewAction','nearDuplicateTopic',
 'changeOrigin','explanationChangeRequiredBeforeKeyedRelease','proposedCognitiveReclassification',
 'originalSloCoverageCaution','teacherScientificSignoff','teacherCognitiveSignoff',
 'publishedForScoredStudentPractice','sourceAnswerLetterOrExplanationTextCommitted'];
 const seen=new Set(),original={Recall:0,Understanding:0,Core:0,Supporting:0};
 const changes=[],explanations=[],moderation=[];
 for(let i=0;i<20;i++){
  const n=i+61,x=reg.items[i],source=old.items[n-1],prev=before.records[n-1],q=rows[n-1];
  assert.deepEqual(Object.keys(x),allowed);
  assert.equal(x.sourceNumber,n);assert.equal(x.id,'XI-U07-T071-Q'+String(n).padStart(3,'0'));
  assert.equal(x.id,source.id);assert.equal(x.id,prev.id);
  assert.equal(x.v146OriginalSourceFullRowSha256,source.sourceFullRowSha256);
  assert.ok(!seen.has(x.id));seen.add(x.id);
  assert.ok(x.focus.length>7&&x.scientificEditorialFirstPass.length>76);
  assert.ok(x.sourceNbfPrintedPages.length>0&&x.sourceNbfPrintedPages.every(p=>Number.isInteger(p)&&p>=113&&p<=116));
  assert.equal(source.teacherAcademicSignoff,'PENDING');assert.equal(source.studentPracticeRelease,'HOLD');
  assert.equal(prev.teacherScientificSignoff,'PENDING');assert.equal(prev.publicScoredPracticeApproved,false);
  assert.equal(x.originalOwnerWordKeyOptionExists,true);assert.equal(x.originalOwnerWordExplanationExists,true);
  assert.equal(x.candidateCorrectOptionPositionPreserved,'YES_SOURCE_KEY_POSITION_UNCHANGED');
  assert.equal(x.officialSlo,'P-11-B-22');assert.equal(x.officialSloForm,'SUMMATIVE_THEORY');
  assert.equal(x.officialSloTarget,'Understanding');
  assert.equal(x.v148CognitiveFirstPass,prev.itemCognitiveFirstPass);
  assert.equal(x.v148SloFitFirstPass,prev.fullSloFitFirstPass);
  assert.equal(x.teacherScientificSignoff,'PENDING');assert.equal(x.teacherCognitiveSignoff,'PENDING');
  assert.equal(x.publishedForScoredStudentPractice,false);
  assert.equal(x.sourceAnswerLetterOrExplanationTextCommitted,false);
  assert.equal(q.length,5);assert.ok(q.every(s=>s.length>0&&s.trim()===s));
  assert.equal(new Set(q.slice(1)).size,4);
  if(x.v148CognitiveFirstPass==='Recall/Knowledge')original.Recall++;
  else {assert.equal(x.v148CognitiveFirstPass,'Understanding_candidate');original.Understanding++;}
  if(x.v148SloFitFirstPass==='CORE_STRUCTURE_DISTINCTION')original.Core++;
  else {assert.equal(x.v148SloFitFirstPass,'SUPPORTING_CHAPTER_DETAIL_REVIEW_FOR_BOARD');original.Supporting++;}
  if(x.changeOrigin!=='NO_NEW_CANDIDATE_CHANGE')changes.push(n);
  if(x.explanationChangeRequiredBeforeKeyedRelease)explanations.push(n);
  if(x.proposedCognitiveReclassification!==null){
   assert.equal(x.proposedCognitiveReclassification,'Recall/Knowledge_candidate');moderation.push(n);
  }
  for(const forbidden of ['correctOption','correctOptionId','correctOptionLetter','answerLetter','answerKey',
    'originalExplanationText','sourceKeyText','studentEmail','studentUid'])
   assert.equal(Object.hasOwn(x,forbidden),false,'Private or keyed content forbidden: '+forbidden);
 }
 assert.deepEqual(original,{Recall:3,Understanding:17,Core:13,Supporting:7});
 assert.deepEqual(changes,[62,76]);assert.deepEqual(explanations,[76]);
 assert.deepEqual(moderation,[64,65,73,77]);
 assert.equal(reg.items.find(x=>x.sourceNumber===62).changeOrigin,'V147_STEM_AMENDMENT_PENDING_TEACHER');
 assert.equal(reg.items.find(x=>x.sourceNumber===76).changeOrigin,'V149_FULL_QUESTION_AMENDMENT_PENDING_TEACHER');
 assert.ok(rows[61][0].includes('no regular long-range repeating arrangement'));
 assert.ok(rows[75][0].includes('polythene'));
 assert.ok(rows[75][3].includes('Polythene is listed as a synthetic polymer'));
 assert.ok(rows[75].every(s=>!/nylon/i.test(s)));
 for(const term of ['Q62','Q76','original Q76 source explanation','compulsory',
  'polycrystalline','polymeric','rubber','amorphous','17 Understanding','3 Recall',
  '13 core','7 supporting','20 MCQs','standalone','no answer letters',
  'teacher approval','80/80','0/80','2,250','560','PENDING','SC=1','BCC=2','FCC=4']){
  assert.ok(note.toLowerCase().includes(term.toLowerCase()),'Review note omits '+term);
 }
 const m=j('question-bank/manifest.json');
 assert.deepEqual(m.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
 const catalog=j('portal/learning-catalog.json');
 const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(fs.existsSync(path.join(base,'question-bank/grade-11/unit-07.json')),false);
 assert.equal(fs.existsSync(path.join(base,'question-bank/grade-11/unit-07-topic71.json')),false);
 const u6=j('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(u6.releaseApproved,false);assert.equal(u6.teacherSignoff,'pending');
 const out=path.join(base,'qa-artifacts/grade11-v153-unit7-q61-80-keyless-scenario');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
  version:'V153',firstPassSourceItemsAcrossFourBatches:80,thisBatch:[61,80],thisBatchOriginalSourceChoicesChecked:20,
  thisBatchExplanationCellsReportedChecked:20,originalV148Cognitive:original,
  teacherCriticalDecisions:[62,76],explanationBlocked:[76],cognitiveRechecks:[64,65,73,77],
  allTeacherSignoffs:0,unit7ScoredItems:0,
  privateWordReopenedByGithubCI:false,answerLettersCopiedToRepository:0},null,2)+'\n');
 console.log('V153 PASS: original 80/80 first-pass review completed; Q61–80 keyless QC, Q76 explanation HOLD, no teacher approvals, no scored release');
}
try{main()}catch(e){console.error('V153 FAIL',e.stack||e);process.exitCode=1}
