#!/usr/bin/env node
'use strict';
/* V150 20-item academic first-pass, not teacher signoff or keyed release */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const js=p=>JSON.parse(read(p));
function main(){
 const p=js('quality/unit07/topic71-v150-batch1-20-teacher-review-no-keys.json');
 const source=js('quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json');
 const previous=js('quality/unit07/topic71-v148-80-source-answer-and-framework-review-register.json');
 const candidate=read('quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv').trimEnd().split('\n').map(x=>x.split('\t'));
 const text=read('quality/grade11-v150-batch1-20-academic-teacher-review.md');
 assert.equal(p.version,'V150');assert.equal(p.schemaVersion,1);
 assert.equal(p.originalDocumentSha256,source.sourceDocxSha256);
 assert.equal(p.originalOwnerWordKeyExplanationRowsInspected,20);
 assert.equal(p.firstPassType,'INDEPENDENT_TEXTBOOK_EDITORIAL_NOT_TEACHER_APPROVAL');
 assert.equal(p.officialSlo,'P-11-B-22');assert.equal(p.officialSloStatus,'SUMMATIVE_THEORY');
 assert.equal(p.officialSloTarget,'Understanding');
 assert.deepEqual(p.batchRange,[1,20]);assert.equal(p.batchCount,20);assert.equal(p.totalSourceItems,80);
 assert.deepEqual(p.mandatoryTeacherDecisions,[1,10,15]);
 assert.deepEqual(p.optionalTextbookScopeReviews,[8,9]);
 assert.equal(p.pendingIndividualTeacherSignoffs,20);assert.equal(p.publishedUnit7ScoredCount,0);
 assert.equal(p.correctOptionLetterFieldsIncluded,false);assert.equal(p.sourceExplanationTextIncluded,false);
 assert.equal(p.items.length,20);assert.equal(candidate.length,80);
 assert.equal(source.items.length,80);assert.equal(previous.records.length,80);
 const seen=new Set(),mandatory=[],optional=[];let valid=0,signoffs=0,keys=0;
 const authorizedFields=['id','sourceNumber','v146OriginalFullRowFingerprint','sourceAnchorPrintedPages',
 'originalKeyLocatedInOwnerWord','originalKeyPointsToNonblankOption','originalExplanationLocatedInOwnerWord',
 'firstPassScientificNote','topicFocus','originalExplanationFirstPass','candidateWordingStatus',
 'officialSlo','officialSloAssessment','officialSloTarget','v148CognitiveFirstPass','v148ScopeFirstPass',
 'independentBoardUseCaution','teacherActionRequested','reviewPriority','teacherScientificSignoff',
 'teacherCognitiveSignoff','publishedForScoredStudentPractice','sourceKeyOrExplanationStored'];
 for(let i=0;i<20;i++){
  const o=p.items[i],n=i+1,ledger=source.items[i],pre=previous.records[i];
  assert.deepEqual(Object.keys(o),authorizedFields);
  assert.equal(o.sourceNumber,n);assert.equal(o.id,'XI-U07-T071-Q'+String(n).padStart(3,'0'));
  assert.equal(o.id,ledger.id);assert.equal(o.id,pre.id);
  assert.equal(o.v146OriginalFullRowFingerprint,ledger.sourceFullRowSha256);
  assert.equal(o.officialSlo,'P-11-B-22');assert.equal(o.officialSloAssessment,'SUMMATIVE_THEORY');
  assert.equal(o.officialSloTarget,'Understanding');
  assert.equal(o.v148CognitiveFirstPass,pre.itemCognitiveFirstPass);
  assert.equal(o.v148ScopeFirstPass,pre.fullSloFitFirstPass);
  assert.equal(o.originalKeyLocatedInOwnerWord,true);
  assert.equal(o.originalKeyPointsToNonblankOption,true);
  assert.equal(o.originalExplanationLocatedInOwnerWord,true);
  assert.ok(o.firstPassScientificNote.length>65&&o.topicFocus.length>4);
  assert.ok(o.sourceAnchorPrintedPages.length>0&&o.sourceAnchorPrintedPages.every(v=>[113,114,115,116].includes(v)));
  assert.equal(o.teacherScientificSignoff,'PENDING');assert.equal(o.teacherCognitiveSignoff,'PENDING');
  assert.equal(o.publishedForScoredStudentPractice,false);assert.equal(o.sourceKeyOrExplanationStored,false);
  assert.equal(ledger.studentPracticeRelease,'HOLD');assert.equal(pre.publicScoredPracticeApproved,false);
  assert.equal(candidate[i].length,5);assert.equal(new Set(candidate[i].slice(1)).size,4);
  assert.ok(!seen.has(o.id));seen.add(o.id);valid++;
  if(o.reviewPriority.startsWith('COMPULSORY')) mandatory.push(n);
  if(o.reviewPriority==='OPTIONAL_SCOPE_PRECISION') optional.push(n);
  if(o.teacherScientificSignoff!=='PENDING'||o.teacherCognitiveSignoff!=='PENDING')signoffs++;
  for(const key of Object.keys(o)){assert.ok(!/correctAnswer|correctOption|sourceAnswerLetter|teacherExplanation|keyText|userUid|studentEmail/i.test(key),'key/private field leaked '+key);}
 }
 assert.deepEqual(mandatory,[1,10,15]);assert.deepEqual(optional,[8,9]);
 assert.equal(signoffs,0);assert.equal(keys,0);assert.equal(valid,20);
 for(const s of ['Q1','Q8','Q9','Q10','Q15','polycrystalline','polymeric','113','114','Summative','Understanding','PENDING','20','2,250','560']){assert.ok(text.toLowerCase().includes(s.toLowerCase()),'Missing source note '+s);}
 const manifest=js('question-bank/manifest.json');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
 const cat=js('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
 assert.equal(cat.status,'planned');assert.equal(cat.questionBankCount,0);assert.equal(cat.assessmentStatus,'not-published');
 assert.ok(!fs.existsSync(path.join(root,'question-bank/grade-11/unit-07.json')));
 assert.ok(!fs.existsSync(path.join(root,'question-bank/grade-11/unit-07-topic71.json')));
 const u6=js('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(u6.releaseApproved,false);assert.equal(u6.teacherSignoff,'pending');
 const target=path.join(root,'qa-artifacts/grade11-v150-unit07-first20-teacher-hold');fs.mkdirSync(target,{recursive:true});
 fs.writeFileSync(path.join(target,'summary.json'),JSON.stringify({version:'V150',sourceRows:80,academicFirstPassRows:20,mandatoryTeacherDecisions:[1,10,15],optionalPrecisionReviews:[8,9],teacherSignoffs:0,studentScoredReleased:0,originalOwnerWordInsideCI:false,secretAnswerLettersStored:0,originalUnit1To6ProvisionalItems:2250},null,2)+'\n');
 console.log('V150 PASS: first 20 independent per-item review notes, original evidence and pending teacher actions; no source keys or student release.');
}
try{main()}catch(e){console.error('V150 FAILED',e.stack||e);process.exitCode=1}
