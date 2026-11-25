#!/usr/bin/env node
'use strict';
// V154 preserves the complete *editorial* review queue, not authentic teacher approval.
// GitHub and its checks may NEVER mark these 80 items academically approved or scored.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const load=p=>JSON.parse(read(p));
const BATCH_PATHS=[
 'quality/unit07/topic71-v150-batch1-20-teacher-review-no-keys.json',
 'quality/unit07/topic71-v151-batch2-21-40-keyless-science-review.json',
 'quality/unit07/topic71-v152-batch3-41-60-keyless-science-review.json',
 'quality/unit07/topic71-v153-batch4-61-80-keyless-scenario-review.json'
];
const QPATH='quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv';
const QUEUE='quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json';
function main(){
 const v154=load(QUEUE),batch=BATCH_PATHS.map(load),source=load('quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json');
 const v148=load('quality/unit07/topic71-v148-80-source-answer-and-framework-review-register.json');
 const questions=read(QPATH).trimEnd().split('\n').map(s=>s.split('\t'));
 const note=read('quality/grade11-v154-unit7-topic71-consolidated-teacher-review-worklist.md');
 const rawRows=batch.flatMap(v=>v.items);
 assert.equal(v154.schemaVersion,1);assert.equal(v154.version,'V154');
 assert.equal(v154.sourceOriginalOwnerDocxSha256,source.sourceDocxSha256);
 assert.equal(v154.sourceOriginalOwnerDocxSha256,'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58');
 assert.equal(v154.candidateQuestionPath,QPATH);assert.deepEqual(v154.inputFirstPassRegisters,BATCH_PATHS);
 assert.equal(v154.frameworkSlo,'P-11-B-22');assert.equal(v154.frameworkClassification,'SUMMATIVE_THEORY');
 assert.equal(v154.frameworkTarget,'Understanding');
 assert.equal(v154.advisoryOnly,true);assert.equal(v154.publicRepoIsNotAuthenticatedTeacherApprovalService,true);
 assert.equal(v154.originalOwnerAnswerLettersAndExplanationsIncluded,false);
 assert.equal(v154.reviewDecisionStorage,'PENDING_ONLY_IN_PUBLIC_GITHUB; FUTURE_APPROVAL_REQUIRES_SECURE_AUTHENTICATED_TEACHER_WORKFLOW');
 assert.equal(v154.candidateQuestionsCount,80);assert.equal(v154.entries.length,80);
 assert.equal(v154.teacherScienceSignoffs,0);assert.equal(v154.teacherCognitiveSignoffs,0);
 assert.equal(v154.ownerKeyValidatedIndividuallyByTeacher,0);
 assert.equal(v154.teacherExplanationRepairsApproved,0);assert.equal(v154.unit7ScoredReleaseCount,0);
 assert.deepEqual(v154.mandatorySourceEditsOrApprovals,[10,15,62,76]);
 assert.deepEqual(v154.hardBlockedAnswerKeyImportUntilExplanationRepaired,[76]);
 assert.deepEqual(v154.optionalSourceTextPrecision,[8,9,26,31,33,68]);
 assert.deepEqual(v154.proposedCognitiveReclassifications,[34,37,50,54,64,65,73,77]);
 assert.deepEqual(v154.provisionalCognitiveCounts,{recallOrKnowledge:32,understandingCandidates:48});
 assert.deepEqual(v154.provisionalSloFitCounts,{directCore:44,supportingDetail:36});
 assert.deepEqual(v154.questionStyles,{directOrConceptual:60,standaloneSituation:20,verifiedSharedStimulusSets:0});
 assert.deepEqual(batch.map(x=>x.items.length),[20,20,20,20]);
 assert.equal(questions.length,80);assert.equal(source.items.length,80);assert.equal(v148.records.length,80);
 assert.equal(rawRows.length,80);
 const allowed=['id','sourceNumber','originalFullRowSha256','questionOnlyCandidate','firstPassBatch',
 'nbfPrintedPages','originalTopicCluster','originalQuestionStyle','officialSlo','officialSloStatus',
 'officialSloCognitiveTarget','provisionalV148Cognitive','provisionalV148Scope','firstPassScienceFinding',
 'firstPassTeacherAction','candidateRevisionOrigin','sourceExplanationCorrectionRequired',
 'correctionOrDecisionRequired','compulsoryTeachingClarification','optionalQualitySuggestion',
 'proposedCognitiveReclassification','duplicateConceptGroups','reviewQueuePriority',
 'academicScienceDecision','academicCognitiveDecision','sourceExplanationRepairDecision',
 'originalWordAnswerKeyIndependentlyApproved','teacherAuthEvidenceRef','teacherDecisionTimestamp',
 'eligibleForScoredStudentRelease'];
 const seen=new Set(),summary={recall:0,understanding:0,core:0,support:0,direct:0,situation:0};
 const mandatory=[],reclass=[];
 for(let i=0;i<80;i++){
  const n=i+1,x=v154.entries[i],s=source.items[i],p=v148.records[i],original=rawRows[i],row=questions[i];
  assert.deepEqual(Object.keys(x),allowed);
  assert.equal(x.sourceNumber,n);assert.equal(x.id,'XI-U07-T071-Q'+String(n).padStart(3,'0'));
  assert.equal(x.id,s.id);assert.equal(x.id,p.id);assert.equal(x.id,original.id);
  assert.equal(x.originalFullRowSha256,s.sourceFullRowSha256);
  const priorSha=original.v146OriginalFullRowFingerprint??original.v146OriginalRowSha256??original.originalV146FullRowSha256??original.v146OriginalSourceFullRowSha256;
  assert.equal(x.originalFullRowSha256,priorSha);
  assert.equal(x.questionOnlyCandidate,'V149_80_QUESTIONS_ONLY');
  assert.equal(x.firstPassBatch,['V150','V151','V152','V153'][Math.floor(i/20)]);
  const oldPages=original.sourceAnchorPrintedPages??original.sourceNbfPrintedPages??original.printedNbfPages;
  assert.deepEqual(x.nbfPrintedPages,oldPages);
  assert.equal(x.originalTopicCluster,p.originalTopicCluster);
  assert.equal(x.originalQuestionStyle,n<=60?'DIRECT_OR_CONCEPTUAL':'STANDALONE_SITUATION_NOT_SHARED_STIMULUS');
  assert.equal(x.officialSlo,'P-11-B-22');assert.equal(x.officialSloStatus,'SUMMATIVE_THEORY');
  assert.equal(x.officialSloCognitiveTarget,'Understanding');
  assert.equal(x.provisionalV148Cognitive,p.itemCognitiveFirstPass);
  assert.equal(x.provisionalV148Scope,p.fullSloFitFirstPass);
  const priorNote=original.firstPassScientificNote??original.firstPassScientificFinding??original.scientificFirstPass??original.scientificEditorialFirstPass;
  const priorAction=original.teacherActionRequested??original.teacherReviewAction??original.teachingOrReviewDecision;
  assert.equal(x.firstPassScienceFinding,priorNote);assert.equal(x.firstPassTeacherAction,priorAction);
  assert.ok(x.firstPassScienceFinding.length>65);
  assert.equal(x.academicScienceDecision,'PENDING');assert.equal(x.academicCognitiveDecision,'PENDING');
  assert.equal(x.sourceExplanationRepairDecision,'PENDING');
  assert.equal(x.originalWordAnswerKeyIndependentlyApproved,false);
  assert.equal(x.teacherAuthEvidenceRef,null);assert.equal(x.teacherDecisionTimestamp,null);
  assert.equal(x.eligibleForScoredStudentRelease,false);
  assert.equal(s.teacherAcademicSignoff,'PENDING');assert.equal(s.studentPracticeRelease,'HOLD');
  assert.equal(p.teacherScientificSignoff,'PENDING');assert.equal(p.publicScoredPracticeApproved,false);
  assert.equal(row.length,5);assert.ok(row.every(c=>c.length>0));
  assert.equal(new Set(row.slice(1)).size,4);
  assert.ok(!seen.has(x.id));seen.add(x.id);
  assert.ok(x.duplicateConceptGroups.every(t=>typeof t==='string'&&t.length>3));
  if(x.provisionalV148Cognitive==='Recall/Knowledge')summary.recall++;
  else{assert.equal(x.provisionalV148Cognitive,'Understanding_candidate');summary.understanding++;}
  if(x.provisionalV148Scope==='CORE_STRUCTURE_DISTINCTION')summary.core++;
  else{assert.equal(x.provisionalV148Scope,'SUPPORTING_CHAPTER_DETAIL_REVIEW_FOR_BOARD');summary.support++;}
  if(n<=60)summary.direct++;else summary.situation++;
  if(x.correctionOrDecisionRequired!==null)mandatory.push(n);
  if(x.proposedCognitiveReclassification!==null){
   assert.equal(x.proposedCognitiveReclassification,'Recall/Knowledge_candidate');reclass.push(n);
  }
  assert.equal(x.sourceExplanationCorrectionRequired,[10,76].includes(n));
  assert.equal(x.candidateRevisionOrigin,[10,15,62,76].includes(n)?
   n===10?'V149_DISTRACTOR_PROPOSAL':n===76?'V149_STEM_AND_FOUR_CHOICES_PROPOSAL':'V147_STEM_PROPOSAL':
   'ORIGINAL_CANDIDATE_QUESTIONS_RETAINED');
  for(const key of ['correctOption','correctOptionId','correctOptionLetter','answerLetter','answerKey',
   'originalExplanationText','sourceKeyText','studentEmail','studentUid','approvalToken'])assert.equal(Object.hasOwn(x,key),false);
  assert.match(note,new RegExp('^\\| '+n+' \\|','m'));
 }
 assert.deepEqual(summary,{recall:32,understanding:48,core:44,support:36,direct:60,situation:20});
 assert.deepEqual(mandatory,[10,15,62,76]);
 assert.deepEqual(reclass,[34,37,50,54,64,65,73,77]);
 assert.ok(v154.entries[75].correctionOrDecisionRequired.includes('BLOCKING'));
 assert.ok(v154.entries[75].firstPassScienceFinding.includes('nylon'));
 assert.equal(v154.entries[9].sourceExplanationCorrectionRequired,true);
 for(const x of ['Q10','Q15','Q62','Q76','BLOCKED','80/80','0/80','teacher',
  'Summative','Understanding','32','48','44','36','60','20 standalone','no answer letters',
  '2,250','560','PENDING','Firebase','secure']){
  assert.ok(note.toLowerCase().includes(x.toLowerCase()),'Missing teacher-gate note: '+x);
 }
 const manifest=load('question-bank/manifest.json');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
 const catalog=load('portal/learning-catalog.json');
 const unit7=catalog.grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
 assert.equal(unit7.status,'planned');assert.equal(unit7.assessmentStatus,'not-published');
 assert.equal(unit7.questionBankCount,0);
 assert.equal(fs.existsSync(path.join(root,'question-bank/grade-11/unit-07.json')),false);
 assert.equal(fs.existsSync(path.join(root,'question-bank/grade-11/unit-07-topic71.json')),false);
 const u6=load('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(u6.releaseApproved,false);assert.equal(u6.teacherSignoff,'pending');
 const out=path.join(root,'qa-artifacts/grade11-v154-unit7-topic71-decision-queue');
 fs.mkdirSync(out,{recursive:true});
 const qa={version:'V154',questionCount:80,firstPassMergedBatches:4,
  originalSourceIndividualReviewNotes:80,teacherScienceApprovals:0,teacherCognitiveApprovals:0,
  originalKeyTeacherApprovals:0,studentScoredReleased:0,
  mandatoryTeacherSourceDecisions:mandatory,blockingOriginalExplanationRepair:[76],
  suggestedCognitiveReclassification:reclass,provisional:summary,
  originalOwnerWordReopenedByCI:false,answerKeysCopiedToPublicRepository:0};
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(qa,null,2)+'\n');
 console.log('V154 PASS: all 80 reviewed items consolidated; four required source decisions, eight cognitive rechecks; 0 approvals / 0 scored releases');
}
try{main()}catch(err){console.error('V154 FAIL:',err.stack||err);process.exitCode=1}
