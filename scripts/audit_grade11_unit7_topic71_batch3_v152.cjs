#!/usr/bin/env node
'use strict';
/* V152 — source-bound review of Q41–60; no answer letters, no academic approval, no scored release.
 * Important: CI cannot reopen the original owner's Word, so green != certified correctness.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const txt=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(txt(p));
function main(){
 const r=json('quality/unit07/topic71-v152-batch3-41-60-keyless-science-review.json');
 const v146=json('quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json');
 const v148=json('quality/unit07/topic71-v148-80-source-answer-and-framework-review-register.json');
 const v150=json('quality/unit07/topic71-v150-batch1-20-teacher-review-no-keys.json');
 const v151=json('quality/unit07/topic71-v151-batch2-21-40-keyless-science-review.json');
 const candidate=txt('quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv').trimEnd().split('\n').map(s=>s.split('\t'));
 const review=txt('quality/grade11-v152-batch3-41-60-academic-teacher-review.md');
 assert.equal(r.version,'V152');assert.equal(r.schemaVersion,1);
 assert.deepEqual(r.batch,[41,60]);assert.equal(r.batchCount,20);assert.equal(r.originalStudyBankCount,80);
 assert.equal(r.originalOwnerDocxSha256,v146.sourceDocxSha256);
 assert.equal(r.originalOwnerDocxSha256,'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58');
 assert.equal(r.originalWordKeyPositionsVerified,20);assert.equal(r.originalWordOneLineExplanationsChecked,20);
 assert.equal(r.scientificAuditStatus,'AI_ASSISTED_FIRST_PASS_NOT_TEACHER_ACADEMIC_APPROVAL');
 assert.equal(r.compulsoryWrongAnswerOrStemCorrectionsFound,0);
 assert.deepEqual(r.effectiveAtomTeachingCautions,[41,43,45,56,57]);
 assert.deepEqual(r.crystalSystemScopeCaution,[52]);
 assert.deepEqual(r.proposedCognitiveReclassifications,[50,54]);
 assert.deepEqual(r.originalV148CognitiveSplit,{recall:13,understandingCandidates:7});
 assert.deepEqual(r.originalV148CoreVsSupport,{core:1,support:19});
 assert.equal(r.teacherScientificSignoffs,0);assert.equal(r.teacherCognitiveSignoffs,0);
 assert.equal(r.publicCorrectAnswerLettersIncluded,false);assert.equal(r.publicExplanationTextIncluded,false);
 assert.equal(r.unit7ScoredItemCount,0);assert.equal(r.allItemsStudentReleaseHold,true);
 assert.equal(r.officialFrameworkSlo,'P-11-B-22');
 assert.equal(r.officialFrameworkForm,'SUMMATIVE_THEORY');assert.equal(r.officialFrameworkTarget,'Understanding');
 assert.deepEqual(v150.batchRange,[1,20]);assert.deepEqual(v151.batch,[21,40]);
 assert.equal(v150.pendingIndividualTeacherSignoffs,20);
 assert.equal(v151.teacherScientificApprovals,0);
 assert.equal(candidate.length,80);assert.equal(v146.items.length,80);assert.equal(v148.records.length,80);
 assert.equal(r.items.length,20);
 const expectedKeys=['id','sourceNumber','originalV146FullRowSha256','printedNbfPages','topic',
  'scientificFirstPass','originalWordCorrectOptionExists','originalWordOneLineExplanationPresent',
  'candidateChoiceAndOriginalWordKeyAlignment','firstPassScientificOptionReview',
  'v148CognitiveFirstPass','v148SloFitFirstPass','officialSlo','officialAssessment',
  'officialCognitiveTarget','teachingOrReviewDecision','nearDuplicateGroup',
  'cognitiveReclassificationProposed','effectiveAtomCountDistinctionNeeded',
  'teacherScientificSignoff','teacherCognitiveSignoff','releasedToStudentScoredPractice',
  'answerOrExplanationTextInPublicRecord'];
 let recall=0,understand=0,core=0,support=0;
 const cautions=[],mods=[],seen=new Set();
 for(let i=0;i<20;i++){
  const n=i+41,x=r.items[i],source=v146.items[n-1],pre=v148.records[n-1],row=candidate[n-1];
  assert.deepEqual(Object.keys(x),expectedKeys);
  assert.equal(x.sourceNumber,n);assert.equal(x.id,'XI-U07-T071-Q'+String(n).padStart(3,'0'));
  assert.equal(x.id,source.id);assert.equal(x.id,pre.id);
  assert.equal(x.originalV146FullRowSha256,source.sourceFullRowSha256);
  assert.ok(!seen.has(x.id));seen.add(x.id);
  assert.equal(source.teacherAcademicSignoff,'PENDING');assert.equal(source.studentPracticeRelease,'HOLD');
  assert.equal(pre.teacherScientificSignoff,'PENDING');assert.equal(pre.publicScoredPracticeApproved,false);
  assert.ok(x.printedNbfPages.length>0&&x.printedNbfPages.every(p=>Number.isInteger(p)&&p>=113&&p<=116));
  assert.ok(x.topic.length>=8&&x.scientificFirstPass.length>80);
  assert.equal(row.length,5);assert.ok(row.every(y=>y.trim().length>0));assert.equal(new Set(row.slice(1)).size,4);
  assert.equal(x.originalWordCorrectOptionExists,true);assert.equal(x.originalWordOneLineExplanationPresent,true);
  assert.equal(x.candidateChoiceAndOriginalWordKeyAlignment,'MATCHED_ORIGINAL_TEXT_Q41_TO_Q60');
  assert.equal(x.firstPassScientificOptionReview,'NO_SPECIFIC_WRONG_SOURCE_KEY_IDENTIFIED');
  assert.equal(x.v148CognitiveFirstPass,pre.itemCognitiveFirstPass);
  assert.equal(x.v148SloFitFirstPass,pre.fullSloFitFirstPass);
  assert.equal(x.officialSlo,'P-11-B-22');assert.equal(x.officialAssessment,'SUMMATIVE_THEORY');
  assert.equal(x.officialCognitiveTarget,'Understanding');
  assert.equal(x.teacherScientificSignoff,'PENDING');assert.equal(x.teacherCognitiveSignoff,'PENDING');
  assert.equal(x.releasedToStudentScoredPractice,false);assert.equal(x.answerOrExplanationTextInPublicRecord,false);
  if(x.v148CognitiveFirstPass==='Recall/Knowledge') recall++;
  else{assert.equal(x.v148CognitiveFirstPass,'Understanding_candidate');understand++;}
  if(x.v148SloFitFirstPass==='CORE_STRUCTURE_DISTINCTION')core++;
  else{assert.equal(x.v148SloFitFirstPass,'SUPPORTING_CHAPTER_DETAIL_REVIEW_FOR_BOARD');support++;}
  if(x.effectiveAtomCountDistinctionNeeded)cautions.push(n);
  if(x.cognitiveReclassificationProposed!==null){
   assert.equal(x.cognitiveReclassificationProposed,'Recall/Knowledge_candidate');mods.push(n);
  }
  for(const forbidden of ['correctOption','correctOptionId','correctOptionLetter','answerKey','answerLetter',
    'originalExplanationText','sourceKeyText','studentUid','studentEmail'])
   assert.equal(Object.hasOwn(x,forbidden),false,'Forbidden sensitive field '+forbidden);
 }
 assert.deepEqual([recall,understand,core,support],[13,7,1,19]);
 assert.deepEqual(cautions,[41,43,45,56,57]);
 assert.deepEqual(mods,[50,54]);
 assert.equal(r.items.find(x=>x.sourceNumber===55).v148SloFitFirstPass,'CORE_STRUCTURE_DISTINCTION');
 for(const needle of ['Q41','Q43','Q45','Q50','Q52','Q54','Q55','Q56','Q57',
  'SC = 1','BCC = 2','FCC = 4','13 Recall','7 Understanding','19 are supporting',
  'PENDING','no answer letters','2,250','560','near-duplicate']){
  assert.ok(review.toLowerCase().includes(needle.toLowerCase()),'Missing review evidence: '+needle);
 }
 const man=json('question-bank/manifest.json');
 assert.deepEqual(man.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
 const catalog=json('portal/learning-catalog.json');
 const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(fs.existsSync(path.join(root,'question-bank/grade-11/unit-07.json')),false);
 assert.equal(fs.existsSync(path.join(root,'question-bank/grade-11/unit-07-topic71.json')),false);
 const u6=json('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(u6.releaseApproved,false);assert.equal(u6.teacherSignoff,'pending');
 const dir=path.join(root,'qa-artifacts/grade11-v152-unit07-batch3-41-60-keyless-review');
 fs.mkdirSync(dir,{recursive:true});
 const summary={version:'V152',batch:[41,60],sourceKeySelectionsAndExplanationsReported:20,
  provisionalRecall:13,provisionalUnderstandingCandidates:7,
  coreB22:1,supportingChapterDetail:19,atomCountTeachingCautions:[41,43,45,56,57],
  proposedCognitiveReclassifications:[50,54],wrongKeyCorrectionFound:0,
  teacherSignoffs:0,unit7ScoredItemCount:0,ownerWordReopenedByGithubCI:false,
  actualSourceKeysReleased:0,sourceExplanationsReleased:0};
 fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify(summary,null,2)+'\n');
 console.log('V152 PASS: 20 source-bound Q41–60 review records, 5 lattice-count cautions, 2 provisional cognitive rechecks, 0 keys or scored release');
}
try{main()}catch(e){console.error('V152 FAIL:',e.stack||e);process.exitCode=1}
