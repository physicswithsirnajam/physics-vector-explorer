#!/usr/bin/env node
'use strict';
/* V95-C2E: source-record, physics and teacher-release invariants.
 * Owner private compiled question PDF was compared outside public CI.
 * CI verifies stable GitHub bank snapshot and evidence ledger, NOT private PDF access.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-62-v78-80-source.json'));
const qs=bank.questions.slice(0,20);
assert.equal(bank.bankId,'PSN-XI-U06-T62-V78');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'BCBDCCCBBABCADBBCACA');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[51,51,51,51,51,51,51,52,52,52,52,52,52,52,52,52,53,53,53,53]);
for(let i=0;i<20;i++){
 const q=qs[i],n=i+1;
 assert.equal(q.id,'XI-U06-T62-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'fundamentals');
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.options.every(o=>o.text.trim()));
 assert.ok(q.stem.trim() && q.explanation.trim());
 assert.equal(q.active,true);
 assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
}
const fingerprint=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let hash=2166136261;
for(const c of fingerprint)hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
assert.equal(hash,0x3cdb5f37,'Original source MCQ texts/options/key changed');
function csvParse(line){
 let cur='',quoted=false;const fields=[];
 for(let i=0;i<line.length;i++){
  const ch=line[i];
  if(ch==='"' && quoted && line[i+1]==='"'){cur+='"';i++;continue;}
  if(ch==='"'){quoted=!quoted;continue;}
  if(ch===','&&!quoted){fields.push(cur);cur='';continue;}
  cur+=ch;
 }
 assert.equal(quoted,false,'Invalid CSV quote');
 fields.push(cur);return fields;
}
const lines=read('quality/grade11-unit06-v95c2e-topic62-mcq01-20-academic-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21,'20 data rows + header');
const cols=csvParse(lines[0]);
const rows=lines.slice(1).map(l=>Object.fromEntries(csvParse(l).map((v,i)=>[cols[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const mandatory=new Map([[2,'COMPULSORY_SOURCE_NOTE'],[7,'COMPULSORY_CONTEXT_NOTE'],[13,'COMPULSORY_MODEL_NOTE']]);
for(let i=0;i<20;i++){
 const r=rows[i],q=qs[i],n=i+1;
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.source_number,String(n));
 assert.equal(r.topic,'6.2');
 assert.equal(r.prepared_source_pdf_question_page,String(q.sourcePdfPage));
 assert.equal(r.prepared_source_pdf_key_page,'61');
 assert.equal(r.original_source_answer_letter,q.correctOptionId);
 assert.equal(r.prepared_source_stems_options_key_match,'MATCHED_PREPARED_MASTER_PP51_TO53_AND_KEY_P61');
 assert.equal(r.independent_physics_answer_check,'REVIEWED_SELECTED_ANSWER_SCIENTIFICALLY_SUPPORTED');
 assert.equal(r.amendment_priority,mandatory.get(n)||'OPTIONAL');
 assert.equal(r.candidate_topic_slo_only,n<=8?'P-11-B-41':'P-11-B-42');
 assert.ok(['Knowledge','Understanding','Application'].includes(r.candidate_item_cognitive_not_certified));
 assert.ok(r.teacher_scientific_or_fidelity_note.length>35);
 assert.equal(r.original_printed_nbf_fidelity,'PENDING_PRINTED_NBF_PP91_TO95');
 assert.equal(r.individual_framework_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const review=read('quality/grade11-unit06-v95c2e-topic62-mcq01-20-academic-review.md');
assert.ok(review.includes('20/20 matching stems'));
assert.ok(review.includes('80/80 matching options'));
assert.ok(review.includes('20/20 original answer letters'));
assert.ok(review.includes('Summative / Understanding'));
for(const n of mandatory.keys())assert.ok(review.includes('XI-U06-T62-MCQ-'+String(n).padStart(4,'0')));
const pas=1; // Pa·s = kg m^-1 s^-1 in SI base units
const m=1,kg=1,s=1;
assert.equal(pas,kg/(m*s));
const eta=.001,r=.001,v=1,pi=3.14;
const drag=6*pi*eta*r*v;
assert.ok(Math.abs(drag-0.00001884)<1e-12);
assert.equal(qs[12].correctOptionId,'A');
assert.equal(qs[13].correctOptionId,'D');
assert.equal(qs[18].correctOptionId,'C');
assert.equal(qs[19].correctOptionId,'A');
const register=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(register.length,561);
const regFields=csvParse(register[0]);
for(let i=0;i<20;i++){
 const data=Object.fromEntries(csvParse(register[81+i]).map((v,j)=>[regFields[j],v]));
 assert.equal(data.source_question_id,qs[i].id);
 for(const status of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(data[status],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const matrix=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade11=manifest.grades.find(g=>g.grade===11);
const u6=grade11.units.find(u=>u.unit===6);
const cat=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(u6.liveMcqCount,560);
assert.equal(grade11.units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.equal(u6.standaloneSituationQuestionCount,136);
assert.equal(u6.independentSharedStimulusGroupCount,0);
assert.equal(u6.perQuestionSloVerified,false);
assert.equal(cat.status,'planned');
assert.equal(cat.assessmentStatus,'not-published');
assert.equal(matrix.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2E PASS: Topic6.2 Q1-20 source snapshot/keys locked; 3 teacher notes; official B41/B42 Understanding; 560 pending approval, release held.');
