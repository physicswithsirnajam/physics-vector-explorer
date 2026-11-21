#!/usr/bin/env node
'use strict';
/* V95-C3C: Consolidate the 28 already-merged academic source-review CSVs.
 * This is NOT a teacher approval operation and does not update the source bank,
 * the authoritative central 560-row signoff queue, or exam release flags.
 * Usage: node scripts/build_grade11_unit06_v95c3c_review_register.cjs
 *        node scripts/build_grade11_unit06_v95c3c_review_register.cjs --output quality/generated/...
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const academicDir=path.join(root,'quality');
function parseCsv(line){
 const a=[];let v='',quoted=false;
 for(let i=0;i<line.length;i++){
  const c=line[i];
  if(c==='"'&&quoted&&line[i+1]==='"'){v+='"';i++;continue;}
  if(c==='"'){quoted=!quoted;continue;}
  if(c===','&&!quoted){a.push(v);v='';continue;}
  v+=c;
 }
 assert.equal(quoted,false,'Unclosed quoted CSV field');a.push(v);return a;
}
function linesToObjects(file){
 const lines=read(file).trimEnd().split(/\r?\n/);
 const head=parseCsv(lines[0]);
 return {head,rows:lines.slice(1).map((line,n)=>{
  const fields=parseCsv(line);
  assert.equal(fields.length,head.length,file+': row '+(n+2)+' wrong CSV width');
  return Object.fromEntries(fields.map((v,i)=>[head[i],v]));
 })};
}
const sources=fs.readdirSync(academicDir).filter(n=>
 /^grade11-unit06-v95c(?:2[a-z]|3[ab])-[^.]+\.csv$/.test(n)
).sort();
assert.equal(sources.length,28,'Expected exactly 28 audited 20-ish-question tranche CSV files');
const priorityFields=['amendment_priority','review_priority','teacher_precision_priority','teacher_priority','teacher_review_priority'];
const noteFields=['scientific_teacher_note','teacher_scientific_note','individual_teacher_note',
 'teacher_explanatory_note_or_risk','teacher_review_note','teacher_note','review_issue',
 'teacher_issue','amendment_type','scientific_theme','review_theme'];
const rowIndex=new Map();
const breakdown=new Map();
let compulsory=0,optional=0;
for(const file of sources){
 const rel='quality/'+file,{head,rows}=linesToObjects(rel);
 const field=priorityFields.find(f=>head.includes(f));
 assert.ok(field,'No priority field in '+rel);
 for(const row of rows){
  const id=row.source_question_id,topic=row.topic,n=Number(row.source_number),raw=row[field]||'';
  assert.ok(/^XI-U06-T6[1-7]-MCQ-\d{4}$/.test(id),'Unexpected ID '+id);
  assert.ok(/^6\.[1-7]$/.test(topic),'Invalid topic '+topic);
  assert.ok(Number.isInteger(n)&&n>=1&&n<=80,'Invalid source number '+n);
  assert.equal(id,'XI-U06-T'+topic.replace('.','')+'-MCQ-'+String(n).padStart(4,'0'),'Topic/question ID mismatch');
  assert.ok(!rowIndex.has(id),'Duplicate review source item '+id);
  const status=raw.startsWith('COMPULSORY')?'COMPULSORY':
   raw.startsWith('OPTIONAL')?'OPTIONAL':null;
  assert.ok(status,'Unknown teacher priority '+id+': '+raw);
  if(status==='COMPULSORY')compulsory++;else optional++;
  const note=noteFields.map(f=>row[f]).find(x=>x&&x.trim())||'See source academic review';
  assert.ok(note.trim().length>4,'Missing note '+id);
  rowIndex.set(id,{id,topic,n,priority_status:status,original_priority_code:raw,review_note:note,
   original_evidence_file:rel,teacher_decision:'PENDING',individual_exam_certification:'PENDING',
   source_edit_authorized:'NO',first_pass_inspection:'COMPLETE',
   note_interpretation:'TEACHER_DECISION_NOT_AUTOMATIC_CORRECTION'});
  const s=breakdown.get(topic)||{total:0,compulsory:0,optional:0};
  s.total++;s[status.toLowerCase()]++;breakdown.set(topic,s);
 }
}
assert.equal(rowIndex.size,560);
assert.equal(compulsory,216);
assert.equal(optional,344);
assert.equal(compulsory+optional,560);
const expected={ '6.1':[80,22,58],'6.2':[80,19,61],'6.3':[80,20,60],
 '6.4':[80,30,50],'6.5':[80,35,45],'6.6':[80,38,42],'6.7':[80,52,28] };
for(const [topic,tuple] of Object.entries(expected)){
 const s=breakdown.get(topic);
 assert.ok(s,'Topic missing '+topic);
 assert.deepEqual([s.total,s.compulsory,s.optional],tuple,'Review count drift '+topic);
}
const queue=linesToObjects('quality/grade11-unit06-v95c1-560-item-review-queue.csv').rows;
assert.equal(queue.length,560);
const pendingColumns=['scientific_key_review','original_print_fidelity_review',
 'individual_fbise_slo_review','individual_cognitive_review','teacher_approval'];
const queueIds=new Set();
for(const entry of queue){
 assert.ok(!queueIds.has(entry.source_question_id),'Duplicate central queue item');
 queueIds.add(entry.source_question_id);
 assert.ok(rowIndex.has(entry.source_question_id),'Missing academic source review '+entry.source_question_id);
 for(const field of pendingColumns)assert.equal(entry[field],'PENDING',
  'Central review approval unexpectedly changed for '+entry.source_question_id+':'+field);
}
assert.equal(queueIds.size,rowIndex.size);
const manifest=JSON.parse(read('question-bank/manifest.json'));
const grade=manifest.grades.find(g=>g.grade===11);
assert.ok(grade);
const unit=grade.units.find(u=>u.unit===6);
assert.equal(unit.liveMcqCount,560);
assert.equal(grade.units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.equal(unit.standaloneSituationQuestionCount,136);
assert.equal(unit.independentSharedStimulusGroupCount,0);
assert.equal(unit.perQuestionSloVerified,false);
assert.equal(unit.exactFbiseModeReady,false);
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const course=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(course.status,'planned');
assert.equal(course.assessmentStatus,'not-published');
assert.equal(JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json')).releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
const list=[...rowIndex.values()].sort((a,b)=>Number(a.topic.slice(2))-Number(b.topic.slice(2))||a.n-b.n);
const keys=['source_question_id','topic','source_number','priority_status',
 'original_priority_code','review_note','original_evidence_file','teacher_decision',
 'individual_exam_certification','source_edit_authorized','first_pass_inspection','note_interpretation'];
function csvCell(s){const v=String(s);return /[,"\r\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}
const csv=[keys.join(','),...list.map(row=>keys.map(k=>csvCell(row[k])).join(','))].join('\n')+'\n';
const cli=process.argv.slice(2);
if(cli.length){
 assert.equal(cli[0],'--output','Unexpected CLI arguments');
 assert.equal(cli.length,2,'Expected --output <relative CSV path>');
 const dest=path.resolve(root,cli[1]);
 assert.ok(dest.startsWith(path.join(root,'quality','generated')+path.sep),'Output must be under quality/generated');
 fs.mkdirSync(path.dirname(dest),{recursive:true});
 fs.writeFileSync(dest,csv,'utf8');
 console.log('Generated '+path.relative(root,dest)+': '+list.length+' PENDING teacher decision rows');
}
console.log('V95-C3C PASS: 28 review files; 560 unique MCQs (216 compulsory teacher decisions / 344 optional notes); 7 topic count checks; 560/560 central PENDING; all official release gates closed.');
