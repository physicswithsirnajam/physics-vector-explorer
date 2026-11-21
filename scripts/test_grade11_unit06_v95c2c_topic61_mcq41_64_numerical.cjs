#!/usr/bin/env node
'use strict';
/* V95-C2C: math and immutable source-record regression, NOT textbook-fidelity certification.
 * Owner-private prepared PDF was directly read outside CI, which cannot access it.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const source=JSON.parse(read('question-bank/grade-11/unit-06-topic-61-v76-80-source.json'));
const qs=source.questions.slice(40,64);
assert.equal(source.bankId,'PSN-XI-U06-T61-V76');
assert.equal(source.questions.length,80);
assert.equal(qs.length,24);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'CDCDCBACAABABCAAACDDDDAD','Prepared master PDF pp.15-16 key sequence');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[8,8,8,8,8,9,9,9,9,9,9,9,10,10,10,10,10,10,10,11,11,11,11,11]);
for(let i=0;i<24;i++){
 const question=qs[i],n=i+41;
 assert.equal(question.id,'XI-U06-T61-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(question.sourceQuestionNumber,n);
 assert.equal(question.sourceSection,'numericals');
 assert.equal(question.active,true);
 assert.equal(question.boardEligible,false);
 assert.deepEqual(question.sloCodes,[]);
 assert.equal(question.cognitiveLevel,'Unspecified');
 assert.equal(question.options.map(option=>option.id).join(''),'ABCD');
 assert.ok(question.options.every(option=>option.text.trim()));
 assert.ok(question.stem.trim()&&question.explanation.trim());
}
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let checksum=2166136261;
for(const c of snap)checksum=Math.imul(checksum^c.charCodeAt(0),16777619)>>>0;
assert.equal(checksum,0x2ea4e9a3,'Original 24 MCQ stem, option or answer bytes altered');
const approx=(a,b,tol=1e-8)=>Math.abs(a-b)<=Math.max(tol,Math.abs(a)*1e-9);
const physics=[
1000*9.8*.002,1000*9.8*.005,3*9.8,1000*9.8*.010,
800*9.8*.004,1200*10*.002,39.2/(1000*9.8),1000*10*.015,
78.4/(1000*9.8),1000*9.8*.20**3,1000*9.8*.05**3,1000*9.8*.020*.30,
1000*9.8*.010*(.90-.40),1000*10*.20,1000*10*.60,(6000-2000)*.020,
50-19.6,120-25,60-60,200/(1000*9.8),(7800/1000)*200,
1000*10*.20*.010,1000*10*.50*.010,1025*10*.020
];
assert.equal(physics.length,24);
for(let i=0;i<qs.length;i++){
 const n=i+41,q=qs[i],correct=q.options.find(o=>o.id===q.correctOptionId);
 const optNumber=Number(correct.text.match(/^[0-9.]+/)?.[0]);
 assert.ok(Number.isFinite(optNumber),'Missing numeric selected option '+n);
 assert.ok(approx(physics[i],optNumber,n===60?5e-5:1e-8),'Wrong answer letter or arithmetic '+n);
 const unit=(n===47||n===49||n===60)?'m3':(n===54||n===55)?'Pa':'N';
 assert.ok(correct.text.includes(unit),'Wrong option units '+n);
 if(n===57)assert.ok(correct.text.includes('downward'),'Force must point downward in two-force model');
}
assert.ok(approx(200/(1000*9.8),0.02040816326530612,1e-12));
assert.ok(approx((7800/1000)*200,1560));
assert.ok(Math.abs(7800*9.8*.0204-1560)>0.5,'Premature rounding should be recognized');
function parseCSV(line){
 const cells=[];let buf='',quoted=false;
 for(let i=0;i<line.length;i++){
  const c=line[i];
  if(c==='"'&&quoted&&line[i+1]==='"'){buf+='"';i++;continue;}
  if(c==='"'){quoted=!quoted;continue;}
  if(c===','&&!quoted){cells.push(buf);buf='';continue;}
  buf+=c;
 }
 assert.equal(quoted,false,'Unterminated CSV quote');
 cells.push(buf);return cells;
}
const csv=read('quality/grade11-unit06-v95c2c-topic61-mcq41-64-numerical-review.csv').trimEnd().split(/\r?\n/);
assert.equal(csv.length,25,'24 unique teacher review rows + header required');
const fields=parseCSV(csv[0]);
const rows=csv.slice(1).map(l=>Object.fromEntries(parseCSV(l).map((v,i)=>[fields[i],v])));
assert.equal(new Set(rows.map(x=>x.source_question_id)).size,24);
const mandatory=new Set([54,55,60,61,62,63]);
for(let i=0;i<24;i++){
 const x=rows[i],q=qs[i],n=i+41;
 assert.equal(x.source_question_id,q.id);
 assert.equal(x.source_number,String(n));
 assert.equal(x.compiled_pdf_page_question,String(q.sourcePdfPage));
 assert.equal(x.compiled_pdf_answer_pages,'15–16');
 assert.equal(x.stem_option_answer_source_comparison,'MATCHED_PREPARED_PDF_P8_TO11_AND_KEYS_P15_TO16');
 assert.equal(x.source_key,q.correctOptionId);
 assert.equal(x.source_selected_option_text,q.options.find(o=>o.id===q.correctOptionId).text);
 assert.equal(x.physics_result,'CALCULATED_SOURCE_KEY_SUPPORTED');
 assert.equal(x.amendment_priority,mandatory.has(n)?'COMPULSORY_NOTE_OR_SOURCE':'OPTIONAL');
 assert.equal(x.candidate_topic_slo_only,'P-11-B-33');
 assert.equal(x.candidate_cognitive_level_not_certified,'Application_candidate_numerical_not_certified');
 assert.equal(x.original_nbf_printed_source_review,'PENDING_PRINTED_NBF_PP89_TO91');
 assert.equal(x.individual_slo_approval,'PENDING');
 assert.equal(x.teacher_approval,'PENDING');
 assert.ok(x.teacher_note.length>=35);
}
const doc=read('quality/grade11-unit06-v95c2c-topic61-mcq41-64-numerical-review.md');
assert.ok(doc.includes('24/24 matching MCQ stems'));
assert.ok(doc.includes('96/96 matching A–D options'));
assert.ok(doc.includes('24/24 answer letters'));
for(const n of mandatory)assert.ok(doc.includes('XI-U06-T61-MCQ-'+String(n).padStart(4,'0')));
const all=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(all.length,561);
const head=parseCSV(all[0]);
for(let i=40;i<64;i++){
 const r=Object.fromEntries(parseCSV(all[i+1]).map((v,j)=>[head[j],v]));
 assert.equal(r.source_question_id,qs[i-40].id);
 for(const status of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[status],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade11=manifest.grades.find(x=>x.grade===11),unit6=grade11.units.find(x=>x.unit===6);
const catalog6=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===6);
assert.equal(unit6.liveMcqCount,560);
assert.equal(grade11.units.reduce((s,x)=>s+x.liveMcqCount,0),2250);
assert.equal(unit6.standaloneSituationQuestionCount,136);
assert.equal(unit6.independentSharedStimulusGroupCount,0);
assert.equal(unit6.perQuestionSloVerified,false);
assert.equal(catalog6.status,'planned');
assert.equal(catalog6.assessmentStatus,'not-published');
assert.equal(signoff.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2C PASS: 24/24 numericals source-key arithmetic, Q54/55/60/61/62/63 qualifiers, 24 teacher approvals pending; release held.');
