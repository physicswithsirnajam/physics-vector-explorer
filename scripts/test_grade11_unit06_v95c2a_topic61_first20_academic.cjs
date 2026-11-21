#!/usr/bin/env node
'use strict';
/* V95-C2A: 20-row teacher evidence register for Topic6.1 Q1–20.
 * The private prepared PDF was directly compared OUTSIDE this public CI.
 * Fingerprint locks the GitHub public source snapshot; it does NOT enable
 * the workflow to read the private PDF or certify original NBF p89–91.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const src=JSON.parse(read('question-bank/grade-11/unit-06-topic-61-v76-80-source.json'));
const rows=src.questions.slice(0,20);
assert.equal(src.bankId,'PSN-XI-U06-T61-V76');
assert.equal(src.questions.length,80);
assert.equal(rows.length,20);
assert.equal(rows.map(q=>q.correctOptionId).join(''),'CDBDBDCDBBCCDCABABDC','Prepared master PDF p14 source letters');
assert.deepEqual(rows.map(q=>q.sourcePdfPage),[3,3,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5]);
for(let i=0;i<20;i++){
 const q=rows[i];assert.equal(q.sourceQuestionNumber,i+1);
 assert.equal(q.id,'XI-U06-T61-MCQ-'+String(i+1).padStart(4,'0'));
 assert.equal(q.options.map(x=>x.id).join(''),'ABCD');
 assert.equal(q.active,true);
 assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.ok(q.explanation.trim());
}
const snap=rows.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let digest=2166136261;
for(const c of snap)digest=Math.imul(digest^c.charCodeAt(0),16777619)>>>0;
assert.equal(digest,0xb463cd73,'Prepared master-matched 20-question source snapshot unexpectedly changed');
function csvLine(line){
 const values=[];let v='',inQuotes=false;
 for(let i=0;i<line.length;i++){
  const ch=line[i];
  if(ch==='"'&&inQuotes&&line[i+1]==='"'){v+='"';i++;continue;}
  if(ch==='"'){inQuotes=!inQuotes;continue;}
  if(ch===','&&!inQuotes){values.push(v);v='';continue;}
  v+=ch;
 }
 assert.equal(inQuotes,false,'CSV quote imbalance');
 values.push(v);return values;
}
const csv=read('quality/grade11-unit06-v95c2a-topic61-mcq01-20-academic-review.csv').trimEnd().split(/\r?\n/);
assert.equal(csv.length,21,'20 reviewed rows plus header');
const header=csvLine(csv[0]);
const values=csv.slice(1).map(line=>Object.fromEntries(csvLine(line).map((v,i)=>[header[i],v])));
assert.equal(new Set(values.map(r=>r.source_question_id)).size,20);
const mandatory=new Set([9,11,13,16,17,20]);
let mandatorySeen=0;
for(let i=0;i<20;i++){
 const row=values[i],q=rows[i],n=i+1;
 assert.equal(row.source_question_id,q.id);
 assert.equal(row.topic,'6.1');
 assert.equal(row.source_number,String(n));
 assert.equal(row.prepared_master_pdf_page,String(q.sourcePdfPage));
 assert.equal(row.source_answer_letter,q.correctOptionId);
 assert.equal(row.prepared_source_question_options_answer,'MATCHED_PREPARED_MASTER_PP3_TO5_AND_KEY_P14');
 assert.equal(row.independent_physics_answer_check,'REVIEWED_SOURCE_KEY_PHYSICS_SUPPORTED');
 assert.equal(row.amendment_priority,mandatory.has(n)?'COMPULSORY_NOTE':'OPTIONAL');
 assert.equal(row.original_printed_nbf_fidelity,'PENDING_ORIGINAL_NBF_PP89_TO91');
 assert.equal(row.individual_slo_certification,'PENDING');
 assert.equal(row.teacher_approval,'PENDING');
 assert.equal(row.candidate_topic_slo_only,n<=16?'P-11-B-33':'P-11-B-34');
 assert.ok(['Knowledge','Understanding'].includes(row.candidate_cognitive_level_not_certified));
 assert.ok(row.teacher_explanatory_note_or_risk.length>45);
 if(mandatory.has(n))mandatorySeen++;
}
assert.equal(mandatorySeen,6);
assert.equal(rows[10].referenceFigureId,'unit6-figure62');
const mark=read('quality/grade11-unit06-v95c2a-topic61-mcq01-20-academic-review.md');
for(const num of mandatory){
 const id='XI-U06-T61-MCQ-'+String(num).padStart(4,'0');
 assert.ok(mark.includes(id),'Missing teacher compulsory explanatory issue for '+id);
}
assert.ok(mark.includes('20/20 matching stems'));
assert.ok(mark.includes('80/80 matching options'));
assert.ok(mark.includes('original printed NBF')||mark.includes('Original printed NBF'));
assert.ok(mark.includes('not automatically certified')||mark.includes('not certified')||mark.includes('not the same as certifying'));
assert.ok(mark.includes('zero')||mark.includes('0'));
// Independent sanity checks of governing physics used in Q6/9–16 and ship/buoyancy context.
const rho=1000,g=9.8,area=.012,h1=.20,h2=.65;
const p1=rho*g*h1,p2=rho*g*h2;
const F1=p1*area,F2=p2*area,FB=F2-F1;
assert.ok(F2>F1);
assert.ok(Math.abs(FB-rho*g*area*(h2-h1))<1e-9);
assert.equal(rows[5].options.find(o=>o.id===rows[5].correctOptionId).text,'FB = ρgV');
assert.equal(rows[8].options.find(o=>o.id==='B').text,'P1 = ρgh1');
assert.equal(rows[10].options.find(o=>o.id==='C').text,'F2 = P2A');
assert.equal(rows[11].options.find(o=>o.id==='C').text,'h2 − h1');
assert.equal(rows[12].options.find(o=>o.id==='D').text,'F2 − F1');
assert.equal(rows[13].options.find(o=>o.id==='C').text,'Ah');
assert.ok(rows[15].options.find(o=>o.id==='B').text.includes('equals its weight'));
const register=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(register.length,561,'Master 560 pending queue must remain complete');
const regHead=csvLine(register[0]);
for(let i=0;i<20;i++){
 const r=Object.fromEntries(csvLine(register[i+1]).map((v,k)=>[regHead[k],v]));
 assert.equal(r.source_question_id,rows[i].id);
 for(const status of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[status],'PENDING','Master teacher approval cannot be silently changed');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalogue=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const g11=manifest.grades.find(g=>g.grade===11),u6=g11.units.find(u=>u.unit===6);
const catalog6=catalogue.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(u6.liveMcqCount,560);
assert.equal(g11.units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.equal(u6.standaloneSituationQuestionCount,136);
assert.equal(u6.independentSharedStimulusGroupCount,0);
assert.equal(u6.perQuestionSloVerified,false);
assert.equal(u6.exactFbiseModeReady,false);
assert.equal(catalog6.status,'planned');
assert.equal(catalog6.assessmentStatus,'not-published');
assert.equal(signoff.releaseApproved,false);
assert.ok(signoff.topics.every(t=>!t.topicTeacherApproved&&!t.studentLessonReady));
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2A PASS: 20 exact prepared-source snapshots, all 20 source answers supported, 6 mandatory model/rights notes, 20 teacher approvals pending, 540 MCQs not assessed in this batch; Unit6 release remains planned.');
