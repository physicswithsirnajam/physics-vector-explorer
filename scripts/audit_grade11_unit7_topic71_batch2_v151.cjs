#!/usr/bin/env node
'use strict';
/* V151: Source-bound, keyless academic first-pass for Unit 7 Q21–40.
   Tests immutable source ancestry, not scientific correctness or teacher signoff. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),txt=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(txt(p));
function main(){
 const reg=json('quality/unit07/topic71-v151-batch2-21-40-keyless-science-review.json');
 const src=json('quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json');
 const v148=json('quality/unit07/topic71-v148-80-source-answer-and-framework-review-register.json');
 const v150=json('quality/unit07/topic71-v150-batch1-20-teacher-review-no-keys.json');
 const candidate=txt('quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv').trimEnd().split('\n').map(x=>x.split('\t'));
 const note=txt('quality/grade11-v151-batch2-21-40-academic-teacher-review.md');
 assert.equal(reg.schemaVersion,1);assert.equal(reg.version,'V151');
 assert.deepEqual(reg.batch,[21,40]);assert.equal(reg.batchCount,20);assert.equal(reg.totalSourceItems,80);
 assert.equal(reg.originalSourceDocxSha256,'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58');
 assert.equal(reg.originalSourceDocxSha256,src.sourceDocxSha256);
 assert.equal(reg.firstPassReviewType,'AI_ASSISTED_EDITORIAL_NOT_TEACHER_SIGNOFF');
 assert.equal(reg.originalKeyRowsWithValidOption,20);assert.equal(reg.originalExplanationsPresent,20);
 assert.equal(reg.compulsoryAnswerOrStemCorrectionsFound,0);
 assert.deepEqual(reg.compulsoryTeachingClarification,[30]);
 assert.deepEqual(reg.optionalWordOrExplanationPrecision,[26,31,33]);
 assert.deepEqual(reg.suggestedCognitiveReclassifications,[34,37]);
 assert.equal(reg.reviewAllKeysExplanationsIndividually,'PENDING_TEACHER');
 assert.equal(reg.teacherScientificApprovals,0);assert.equal(reg.teacherCognitiveApprovals,0);
 assert.equal(reg.unit7PublishedScoredQuestions,0);
 assert.equal(reg.publicAnswerLettersIncluded,false);assert.equal(reg.publicExplanationsIncluded,false);
 assert.equal(reg.officialFrameworkSlo,'P-11-B-22');assert.equal(reg.officialFrameworkStatus,'SUMMATIVE_THEORY');
 assert.equal(reg.officialFrameworkCognitiveTarget,'Understanding');
 assert.deepEqual(v150.batchRange,[1,20]);assert.equal(v150.pendingIndividualTeacherSignoffs,20);
 assert.equal(reg.items.length,20);assert.equal(src.items.length,80);assert.equal(v148.records.length,80);
 assert.equal(candidate.length,80);
 const keys=['id','number','v146OriginalRowSha256','sourceNbfPrintedPages','sourceTopic','firstPassScientificFinding',
  'originalWordKeySelectable','originalWordExplanationNonempty','firstPassKeyExplanationTextbookConsistency',
  'v148CognitiveClassification','v148SloFitClassification','officialSlo','officialSloStatus','officialCognitiveTarget',
  'teacherReviewAction','reviewActionCategory','provisionalCognitiveReclassification','nearDuplicateSelectionGroup',
  'teacherScientificSignoff','teacherCognitiveSignoff','practiceScoredReleaseApproved','answerLetterOrExplanationInPublicRecord'];
 let olderUnderstanding=0,olderRecall=0;const teach=[],optional=[],reclass=[],seen=new Set();
 for(let i=0;i<20;i++){
  const n=i+21,x=reg.items[i],source=src.items[n-1],prev=v148.records[n-1],row=candidate[n-1];
  assert.deepEqual(Object.keys(x),keys);
  assert.equal(x.number,n);assert.equal(x.id,'XI-U07-T071-Q'+String(n).padStart(3,'0'));
  assert.equal(x.id,source.id);assert.equal(x.id,prev.id);
  assert.equal(x.v146OriginalRowSha256,source.sourceFullRowSha256);
  assert.equal(source.teacherAcademicSignoff,'PENDING');assert.equal(source.studentPracticeRelease,'HOLD');
  assert.equal(prev.teacherScientificSignoff,'PENDING');assert.equal(prev.publicScoredPracticeApproved,false);
  assert.ok(x.sourceNbfPrintedPages.length&&x.sourceNbfPrintedPages.every(y=>Number.isInteger(y)&&y>=113&&y<=116));
  assert.ok(x.sourceTopic.length>10&&x.firstPassScientificFinding.length>70);
  assert.equal(x.originalWordKeySelectable,true);assert.equal(x.originalWordExplanationNonempty,true);
  assert.equal(x.firstPassKeyExplanationTextbookConsistency,'NO_SPECIFIC_SCIENTIFIC_CONTRADICTION_IDENTIFIED');
  assert.equal(x.v148CognitiveClassification,prev.itemCognitiveFirstPass);
  assert.equal(x.v148SloFitClassification,prev.fullSloFitFirstPass);
  assert.equal(x.officialSlo,'P-11-B-22');assert.equal(x.officialSloStatus,'SUMMATIVE_THEORY');
  assert.equal(x.officialCognitiveTarget,'Understanding');
  assert.equal(x.teacherScientificSignoff,'PENDING');assert.equal(x.teacherCognitiveSignoff,'PENDING');
  assert.equal(x.practiceScoredReleaseApproved,false);assert.equal(x.answerLetterOrExplanationInPublicRecord,false);
  assert.equal(row.length,5);assert.ok(row.every(v=>v.trim().length>0));assert.equal(new Set(row.slice(1)).size,4);
  assert.ok(!seen.has(x.id));seen.add(x.id);
  if(x.v148CognitiveClassification==='Understanding_candidate')olderUnderstanding++;
  else{assert.equal(x.v148CognitiveClassification,'Recall/Knowledge');olderRecall++;}
  if(x.reviewActionCategory==='COMPULSORY_TEACHING_CLARIFICATION')teach.push(n);
  if(x.reviewActionCategory==='OPTIONAL_WORDING_OR_EXPLANATION')optional.push(n);
  if(x.reviewActionCategory==='PROPOSED_COGNITIVE_RECLASSIFICATION')reclass.push(n);
  if([34,37].includes(n))assert.equal(x.provisionalCognitiveReclassification,'Recall/Knowledge_candidate');
  else assert.equal(x.provisionalCognitiveReclassification,null);
  assert.ok(!Object.keys(x).some(k=>/correctOption|answerLetter|answerKey|originalExplanation|studentUid|email/i.test(k)));
 }
 assert.equal(olderUnderstanding,19);assert.equal(olderRecall,1);
 assert.deepEqual(teach,[30]);assert.deepEqual(optional,[26,31,33]);assert.deepEqual(reclass,[34,37]);
 for(const term of ['Q26','Q30','Q31','Q33','Q34','Q37','19','17','polycrystalline','polymeric',
  'monomer','Summative','Understanding','PENDING','2,250','560','near-duplicate','no answer letters']){
  assert.ok(note.toLowerCase().includes(term.toLowerCase()),'Missing teacher caution '+term);
 }
 const man=json('question-bank/manifest.json');
 assert.deepEqual(man.grades.find(g=>g.grade===11).units.map(y=>y.liveMcqCount),[275,206,220,640,349,560]);
 const catalog=json('portal/learning-catalog.json');
 const u7=catalog.grades.find(g=>g.grade===11).units.find(y=>y.unit===7);
 assert.equal(u7.status,'planned');assert.equal(u7.assessmentStatus,'not-published');assert.equal(u7.questionBankCount,0);
 assert.ok(!fs.existsSync(path.join(root,'question-bank/grade-11/unit-07.json')));
 assert.ok(!fs.existsSync(path.join(root,'question-bank/grade-11/unit-07-topic71.json')));
 const u6=json('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(u6.releaseApproved,false);assert.equal(u6.teacherSignoff,'pending');
 const out=path.join(root,'qa-artifacts/grade11-v151-unit07-batch2-21-40-keyless-review');
 fs.mkdirSync(out,{recursive:true});
 const summary={version:'V151',batch:[21,40],keysComparedToPrivateWordReported:20,sourceExplanationsCheckedReported:20,
  firstPassScienceCorrections:0,teacherTeachingClarification:[30],optionalPrecision:[26,31,33],
  proposedCognitiveReclassifications:[34,37],priorUnderstandingCandidates:19,priorRecall:1,
  teacherSignoffs:0,unit7ScoredItems:0,ownerWordReopenedInsideCI:false,answerLettersInRepo:0};
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
 console.log('V151 PASS: 20 Q21-40 source-linked keyless review items, 0 scored releases, 0 teacher signoffs, 2 cognitive rechecks');
}
try{main()}catch(e){console.error('V151 FAIL:',e.stack||e);process.exitCode=1}
