#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const get=p=>fs.readFileSync(path.join(root,p),'utf8');
const j=p=>JSON.parse(get(p));
function main(){
 const reg=j('quality/unit07/topic71-v148-science-first-pass-keyless-register.json');
 const old=j('quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json');
 assert.equal(reg.schemaVersion,'1.0');assert.equal(reg.version,'V148');
 assert.equal(reg.basis.sourceSha256,old.sourceDocxSha256);
 assert.equal(reg.reviewScope.includes('NOT teacher certification'),true);
 assert.equal(reg.items.length,80);assert.equal(reg.counts.answerTableRowsInspected,80);
 assert.equal(reg.counts.completeAnswerTableEntries,80);
 assert.equal(reg.counts.structuralKeyAlignmentErrors,0);
 assert.equal(reg.counts.sourceConsistentChoiceFirstPass,79);
 assert.equal(reg.counts.blockedForTextbookFalseAssertion,1);
 assert.equal(reg.counts.teacherAcademicSignoffs,0);
 assert.equal(reg.counts.studentPublishedScoredQuestions,0);
 assert.deepEqual(reg.compulsoryItems,[10,15,62,76]);
 assert.deepEqual(reg.optionalItems,[8,9,31]);
 assert.equal(reg.answerLettersIncluded,false);
 assert.equal(reg.explanationsIncluded,false);
 assert.equal(reg.studentScoringEnabled,false);
 const inspected=new Set(),blocking=[],required=[],optional=[];
 for(const [i,row] of reg.items.entries()){
  const n=i+1;assert.equal(row.number,n);
  assert.equal(row.id,'XI-U07-T071-Q'+String(n).padStart(3,'0'));
  assert.equal(old.items[i].id,row.id);assert.equal(old.items[i].teacherAcademicSignoff,'PENDING');
  assert.equal(row.teacherAcademicSignoff,'PENDING');
  assert.equal(row.studentPracticeRelease,'HOLD');
  assert.ok(row.primaryNbfPrintedPages.length>0);
  assert.ok(row.primaryNbfPrintedPages.every(p=>Number.isInteger(p)&&p>=113&&p<=116));
  assert.ok(!inspected.has(row.id));inspected.add(row.id);
  if(row.provisionalFirstPass==='BLOCKED_SOURCE_ASSERTION')blocking.push(n);
  else assert.equal(row.provisionalFirstPass,'SOURCE_CONSISTENT_OPTION_IDENTIFIED');
  if(row.academicDisposition==='REQUIRES_COMPULSORY_TEACHER_DECISION')required.push(n);
  if(row.academicDisposition==='OPTIONAL_TEXTBOOK_PRECISION_REVIEW')optional.push(n);
 }
 assert.deepEqual(blocking,[76]);assert.deepEqual(required,[10,15,62,76]);
 assert.deepEqual(optional,[8,9,31]);
 const note=get('quality/grade11-v148-topic71-answer-qc-teacher-review.md');
 for(const term of ['Q76','Nylon','Polythene','Q10','Q15','Q62','Q8','Q9','Q31',
   '80/80','113–116','teacher','HOLD','no answer letters','no answer']) {
  assert.ok(note.toLowerCase().includes(term.toLowerCase()),'missing review guard '+term);
 }
 // Review register must contain no actual answer-key fields, keyed options or explanations.
 for(const item of reg.items){
  assert.equal(Object.keys(item).some(k=>/correctOption|answerLetter|explanation|keyText|optionText/i.test(k)),false);
 }
 const man=j('question-bank/manifest.json');
 assert.deepEqual(man.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
 const cat=j('portal/learning-catalog.json');
 const u7=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(fs.existsSync(path.join(root,'question-bank/grade-11/unit-07.json')),false);
 assert.equal(fs.existsSync(path.join(root,'question-bank/grade-11/unit-07-topic71.json')),false);
 const hold=j('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(hold.releaseApproved,false);assert.equal(hold.teacherSignoff,'pending');
 const dir=path.join(root,'qa-artifacts/grade11-v148-unit7-topic71-science-first-pass');
 fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({version:'V148',items:80,firstPassSourceConsistent:79,blocked:[76],compulsory:[10,15,62,76],optional:[8,9,31],teacherSigned:0,studentReleased:0,keysInRepo:0},null,2)+'\n');
 console.log('V148 PASS: 80 per-item source/page review decisions; Q76 BLOCKED; 4 compulsory decisions; 3 optional; 0 teacher signoffs; 0 scored Unit7 released.');
}
try{main()}catch(e){console.error('V148 FAIL:',e.stack||e);process.exitCode=1}
