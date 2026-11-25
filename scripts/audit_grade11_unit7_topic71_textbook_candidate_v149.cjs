#!/usr/bin/env node
'use strict';
/* V149: compares every row with the ORIGINAL V147 questions-only candidate.
 * Explicitly permits ONLY two source-backed, not-yet-teacher-approved edits Q10/Q76.
 * No keys, explanations, scores, Firebase or student release.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const js=p=>JSON.parse(read(p));
const hash=x=>crypto.createHash('sha256').update(x,'utf8').digest('hex');
const oldPath='quality/unit07/topic71-v147-80-question-only-candidate.tsv';
const newPath='quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv';
function main(){
 const old=read(oldPath),now=read(newPath);
 assert.equal(hash(old),'03659cb562a666477882c830d3c7c407bc9e90f41db5077ac75435cf14a80f2a');
 assert.ok(old.endsWith('\n')&&!old.includes('\r'));
 assert.ok(now.endsWith('\n')&&!now.includes('\r')&&!now.endsWith('\n\n'));
 const a=old.trimEnd().split('\n').map(l=>l.split('\t'));
 const b=now.trimEnd().split('\n').map(l=>l.split('\t'));
 assert.equal(a.length,80);assert.equal(b.length,80);
 const ledger=js('quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json');
 const review=js('quality/unit07/topic71-v148-80-source-answer-and-framework-review-register.json');
 assert.equal(ledger.items.length,80);assert.equal(review.records.length,80);
 assert.deepEqual(review.firstPassCounts.compulsory,[10,15,62,76]);
 assert.deepEqual(review.firstPassCounts.optional,[8,9,31]);
 assert.deepEqual(review.firstPassCounts.blocked,[76]);
 let touched=[];
 for(let i=0;i<80;i++){
  const n=i+1,row=b[i],previous=a[i];
  assert.equal(previous.length,5);assert.equal(row.length,5);
  assert.ok(row.every(s=>s.length>0&&s.trim()===s&&s.length<460));
  assert.equal(new Set(row.slice(1)).size,4);
  assert.ok(row.every(s=>!/[<>\u0000-\u0008]/.test(s)));
  assert.equal(ledger.items[i].id,'XI-U07-T071-Q'+String(n).padStart(3,'0'));
  assert.equal(ledger.items[i].teacherAcademicSignoff,'PENDING');
  assert.equal(ledger.items[i].studentPracticeRelease,'HOLD');
  assert.equal(review.records[i].teacherScientificSignoff,'PENDING');
  assert.equal(review.records[i].publicScoredPracticeApproved,false);
  if(JSON.stringify(row)!==JSON.stringify(previous)) touched.push(n);
  if(n===10){
   assert.equal(row[0],previous[0]);
   assert.deepEqual(row.slice(2),previous.slice(2));
   assert.equal(previous[1],'Nylon');
   assert.equal(row[1],'Polythene');
  }
  if(n===76){
   assert.ok(previous[0].includes('nylon'));
   assert.ok(!row.some(s=>/nylon/i.test(s)));
   assert.equal(row[0],'A student labels polythene as a natural polymer because it is used in everyday products. Which correction is supported by the textbook?');
   assert.deepEqual(row.slice(1),[
    'Polythene is a natural polymer like rubber',
    'Polythene is an ionic crystal like sodium chloride',
    'Polythene is listed as a synthetic polymer',
    'Polythene contains no repeating molecular units'
   ]);
  }
 }
 assert.deepEqual(touched,[10,76]);
 assert.equal(b[14][0],a[14][0]);
 assert.equal(b[61][0],a[61][0]);
 const note=read('quality/grade11-v149-topic71-textbook-proposed-corrections-teacher-hold.md');
 for(const required of ['Q10','Q15','Q62','Q76','Q8','Q9','Q31','PENDING','Nylon','Polythene','not a Test Builder scored import','no answer letter','2,250','560']) {
  assert.ok(note.toLowerCase().includes(required.toLowerCase()),'Missing approval guard '+required);
 }
 const manifest=js('question-bank/manifest.json');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
 const cat=js('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(cat.status,'planned');assert.equal(cat.questionBankCount,0);
 assert.equal(cat.assessmentStatus,'not-published');
 assert.ok(!fs.existsSync(path.join(root,'question-bank/grade-11/unit-07.json')));
 assert.ok(!fs.existsSync(path.join(root,'question-bank/grade-11/unit-07-topic71.json')));
 const hold=js('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(hold.releaseApproved,false);assert.equal(hold.teacherSignoff,'pending');
 const folder=path.join(root,'qa-artifacts/grade11-v149-unit7-topic71-source-correction');
 fs.mkdirSync(folder,{recursive:true});
 const summary={version:'V149',source:'V147',sourceCandidateSha256:hash(old),newQuestionOnlyCandidateSha256:hash(now),totalItems:80,modifiedComparedToV147:touched,unchangedComparedToV147:78,priorProposedChangesRetained:[15,62],compulsoryTeacherDecisionItems:[10,15,62,76],optionalTerminologyItems:[8,9,31],teacherAcademicSignoffs:0,unit7ScoredItems:0,answerKeysExported:0,explanationsExported:0,officialSloCandidate:'P-11-B-22 / Summative / Understanding',sourceOnly:true};
 fs.writeFileSync(path.join(folder,'summary.json'),JSON.stringify(summary,null,2)+'\n');
 console.log('V149 PASS: original 80 stable; only Q10/Q76 source-backed candidate corrections; Q15/Q62 retained; 0 keys, 0 teacher approvals, Unit7 scoring HOLD');
}
try{main()}catch(e){console.error('V149 FAIL:',e.stack||e);process.exitCode=1}
