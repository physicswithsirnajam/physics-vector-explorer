#!/usr/bin/env node
'use strict';
/* V95-C2G: Teacher-prepared PDF was compared outside public GitHub CI.
 * This regression locks the original GitHub source and 20-row teacher addendum,
 * not direct original-printed-NBF verification or individual board certification.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-62-v78-80-source.json'));
const qs=bank.questions.slice(40,60);
assert.equal(bank.bankId,'PSN-XI-U06-T62-V78');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(x=>x.correctOptionId).join(''),'CADCCCBBBAAABCBDACCB');
assert.deepEqual(qs.map(x=>x.sourcePdfPage),[55,56,56,56,56,56,56,56,56,57,57,57,57,57,57,57,57,57,58,58]);
for(let i=0;i<20;i++){
 const x=qs[i],n=41+i;
 assert.equal(x.id,'XI-U06-T62-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(x.sourceQuestionNumber,n);
 assert.equal(x.sourceSection,'numericals');
 assert.equal(x.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(x.stem.trim()&&x.explanation.trim()&&x.options.every(o=>o.text.trim()));
 assert.equal(x.active,true);
 assert.equal(x.boardEligible,false);
 assert.deepEqual(x.sloCodes,[]);
 assert.equal(x.cognitiveLevel,'Unspecified');
 assert.equal(x.assessmentClassification,'summative-topic-provisional');
}
const snapshot=qs.map(x=>[x.id,x.stem,x.options.map(o=>o.id+':'+o.text).join('|'),x.correctOptionId].join('\u001f')).join('\u001e');
let digest=2166136261;
for(const c of snapshot)digest=Math.imul(digest^c.charCodeAt(0),16777619)>>>0;
assert.equal(digest,0x3761c80c,'Original student MCQ stem, options or answer letter changed since comparison');
const pi=3.14;
const calc=new Map([
 [41,[6*pi*.001*.001*1,'1.88 × 10⁻⁵ N']],
 [42,[4e-6*2,'8.0 × 10⁻⁶ N']],
 [43,[6*pi*1.9e-5*.002*2,'1.43 × 10⁻⁶ N']],
 [44,[2,'2Fᵈ']],
 [45,[12*(2/4),'6 μN']],
 [46,[2*3,'6']],
 [47,[1.884e-5/(6*pi*.001*1),'1.0 × 10⁻³ Pa s']],
 [48,[1000*1.884e-5/(6*pi*.001*.5),'2.0 mm']],
 [49,[1.884e-5/(6*pi*.002*.001),'0.5 m s⁻¹']],
 [50,[null,'[ML⁻¹T⁻¹]']],
 [51,[1e-3,'10⁻³ Pa s']],
 [52,[1.0016e-3,'0.0010016 Pa s']],
 [53,[2000e-3,'2 Pa s']],
 [54,[2*1000*10*(1e-4)**2/(9e-3),'0.0222 m s⁻¹']],
 [55,[.03*4,'0.12 m s⁻¹']],
 [56,[.16/4,'0.04 m s⁻¹']],
 [57,[.10/2,'0.05 m s⁻¹']],
 [58,[.02*9,'0.18 m s⁻¹']],
 [59,[null,'Droplet density ρ']],
 [60,[1000*(4/3)*pi*(.001)**3,'4.19 × 10⁻⁶ kg']]
]);
assert.equal(calc.size,20);
for(const q of qs){
 const n=q.sourceQuestionNumber,entry=calc.get(n);
 assert.ok(entry,'Missing independent check '+n);
 const selected=q.options.find(x=>x.id===q.correctOptionId);
 assert.equal(selected.text,entry[1],'Original source key does not select independently verified result for Q'+n);
 if(entry[0]!==null)assert.ok(Number.isFinite(entry[0]),'Computation not finite '+n);
}
const close=(a,b,tol=1e-10)=>Math.abs(a-b)<=Math.max(tol,Math.abs(b)*1e-6);
assert.ok(close(calc.get(41)[0],1.884e-5));
assert.ok(close(calc.get(43)[0],1.43184e-6));
assert.ok(close(calc.get(47)[0],1e-3));
assert.ok(close(calc.get(48)[0],2));
assert.ok(close(calc.get(49)[0],.5));
assert.ok(close(calc.get(54)[0],2/90,1e-12));
assert.ok(close(calc.get(60)[0],4.186666666666667e-6));
assert.equal(calc.get(50)[1],'[ML⁻¹T⁻¹]');
assert.equal(calc.get(51)[1],'10⁻³ Pa s');
assert.equal(calc.get(59)[1],'Droplet density ρ');
assert.equal(Math.pow(2,2),4);
assert.equal(Math.pow(3,2),9);
function parseCSV(line){
 let field='',quoted=false;const arr=[];
 for(let i=0;i<line.length;i++){
  const c=line[i];
  if(c==='"'&&quoted&&line[i+1]==='"'){field+='"';i++;continue;}
  if(c==='"'){quoted=!quoted;continue;}
  if(c===','&&!quoted){arr.push(field);field='';continue;}
  field+=c;
 }
 assert.equal(quoted,false,'Invalid CSV quotes');
 arr.push(field);return arr;
}
const pathCSV='quality/grade11-unit06-v95c2g-topic62-mcq41-60-numerical-review.csv';
const lines=read(pathCSV).trimEnd().split(/\r?\n/);
assert.equal(lines.length,21,'20 per-question rows plus header');
const header=parseCSV(lines[0]);
const rows=lines.slice(1).map(line=>Object.fromEntries(parseCSV(line).map((v,i)=>[header[i],v])));
assert.equal(new Set(rows.map(x=>x.source_question_id)).size,20);
const compulsory=new Map([[41,'COMPULSORY_MODEL_NOTE'],[43,'COMPULSORY_PRINT_AND_MODEL_NOTE'],[52,'COMPULSORY_TABLE_SOURCE_NOTE'],[54,'COMPULSORY_BUOYANCY_MODEL_NOTE'],[59,'COMPULSORY_ASSIGNMENT_SOURCE_NOTE']]);
for(let i=0;i<20;i++){
 const q=qs[i],r=rows[i],n=i+41;
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.source_number,String(n));
 assert.equal(r.topic,'6.2');
 assert.equal(r.compiled_question_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.compiled_answer_pdf_page,n<=42?'62':'63');
 assert.equal(r.prepared_stems_options_and_letters_comparison,'MATCHED_PREPARED_MASTER_Q_PP55_58_AND_KEYS_PP62_63');
 assert.equal(r.original_answer_letter,q.correctOptionId);
 assert.equal(r.original_correct_option_text,q.options.find(x=>x.id===q.correctOptionId).text);
 assert.equal(r.key_result,'SOURCE_KEY_SUPPORTED_WITH_EXPLICIT_MODEL_LIMITS');
 assert.equal(r.amendment_priority,compulsory.get(n)||'OPTIONAL');
 assert.ok(r.teacher_note.length>=60 && r.teacher_note!=='undefined','Teacher note must be meaningful, not a placeholder');
 assert.equal(r.candidate_topic_slo_only,n===50||n===51||n===52||n===53?'P-11-B-41':'P-11-B-42');
 assert.ok(['Knowledge','Understanding','Application'].includes(r.candidate_item_cognitive_not_certified));
 assert.equal(r.original_printed_nbf_fidelity,'PENDING_PRINTED_NBF_PP91_TO95');
 assert.equal(r.individual_framework_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
 assert.ok(r.independent_check_kind.length>6);
 const expected=calc.get(n)[0];
 if(expected===null)assert.equal(r.independent_result,'QUALITATIVE_OR_DIMENSIONAL');
 else assert.ok(close(Number(r.independent_result),expected,1e-9),'CSV numeric result mismatch '+n);
}
const report=read('quality/grade11-unit06-v95c2g-topic62-mcq41-60-numerical-review.md');
assert.ok(report.includes('20/20 matching stems'));
assert.ok(report.includes('80/80 matching options'));
assert.ok(report.includes('20/20 matching answer letters'));
assert.ok(report.includes('Summative / Understanding'));
for(const n of compulsory.keys())assert.ok(report.includes('XI-U06-T62-MCQ-'+String(n).padStart(4,'0')));
const register=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(register.length,561);
const regFields=parseCSV(register[0]);
for(let i=40;i<60;i++){
 const data=Object.fromEntries(parseCSV(register[81+i]).map((v,j)=>[regFields[j],v]));
 assert.equal(data.source_question_id,qs[i-40].id);
 for(const status of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(data[status],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const matrix=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade11=manifest.grades.find(g=>g.grade===11);
const u6=grade11.units.find(u=>u.unit===6);
const cat=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(u6.liveMcqCount,560);
assert.equal(grade11.units.reduce((s,u)=>s+u.liveMcqCount,0),2250);
assert.equal(u6.standaloneSituationQuestionCount,136);
assert.equal(u6.independentSharedStimulusGroupCount,0);
assert.equal(u6.perQuestionSloVerified,false);
assert.equal(u6.exactFbiseModeReady,false);
assert.equal(cat.status,'planned');
assert.equal(cat.assessmentStatus,'not-published');
assert.equal(matrix.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2G PASS: Q41-60, 20 source answers, 17 numerics, 3 symbolic/dimensional/reasoning, 5 compulsory teacher notes, 560 approvals pending.');
