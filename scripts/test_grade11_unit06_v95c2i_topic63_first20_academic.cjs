#!/usr/bin/env node
'use strict';
/* V95-C2I: academic-source evidence checked outside public GitHub CI.
 * CI checks original source snapshots, review register and safeguards, NOT private
 * user PDF or original printed NBF fidelity / exam item approval.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-63-v80-80-source.json'));
const qs=bank.questions.slice(0,20);
assert.equal(bank.bankId,'PSN-XI-U06-T63-V80');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'AADBDCBADCCDBBACCDBC','Original teacher-prepared p109 key sequence');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[99,99,99,99,99,99,99,100,100,100,100,100,100,100,100,100,101,101,101,101]);
for(let i=0;i<20;i++){
 const question=qs[i],n=i+1;
 assert.equal(question.id,'XI-U06-T63-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(question.sourceQuestionNumber,n);
 assert.equal(question.sourceSection,'fundamentals');
 assert.equal(question.situationBased,false);
 assert.equal(question.stimulusSetId,null);
 assert.equal(question.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(question.stem.trim()&&question.explanation.trim());
 assert.ok(question.options.every(o=>o.text.trim()));
 assert.equal(question.active,true);
 assert.equal(question.boardEligible,false);
 assert.deepEqual(question.sloCodes,[]);
 assert.equal(question.cognitiveLevel,'Unspecified');
 assert.equal(question.assessmentClassification,'summative-topic-provisional');
}
const snapshot=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let hash=2166136261;
for(const char of snapshot)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
assert.equal(hash,0xc50d5b3e,'Original teacher-prepared stem/option/key unexpectedly altered');
function csvParse(line){
 let cur='',quoted=false;const values=[];
 for(let i=0;i<line.length;i++){
  const ch=line[i];
  if(ch==='"'&&quoted&&line[i+1]==='"'){cur+='"';i++;continue;}
  if(ch==='"'){quoted=!quoted;continue;}
  if(ch===','&&!quoted){values.push(cur);cur='';continue;}
  cur+=ch;
 }
 assert.equal(quoted,false,'CSV quote not closed');
 values.push(cur);return values;
}
const lines=read('quality/grade11-unit06-v95c2i-topic63-mcq01-20-academic-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21,'Original 20 MCQ rows + header');
const headers=csvParse(lines[0]);
assert.equal(headers.length,16);
const rows=lines.slice(1).map(l=>Object.fromEntries(csvParse(l).map((x,i)=>[headers[i],x])));
assert.equal(new Set(rows.map(x=>x.source_question_id)).size,20);
const mandatory=new Map([
 [2,'COMPULSORY_SLO_SCOPE_NOTE'],[5,'COMPULSORY_CONCEPT_NOTE'],
 [7,'COMPULSORY_TERMINOLOGY_NOTE'],[8,'COMPULSORY_FLOW_PROFILE_NOTE'],
 [12,'COMPULSORY_CRITICAL_SPEED_NOTE'],[20,'COMPULSORY_SLO_SCOPE_NOTE']
]);
for(let i=0;i<20;i++){
 const n=i+1,q=qs[i],r=rows[i];
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.source_number,String(n));
 assert.equal(r.topic,'6.3');
 assert.equal(r.prepared_pdf_question_page,String(q.sourcePdfPage));
 assert.equal(r.prepared_pdf_answer_page,'109');
 assert.equal(r.prepared_source_stem_options_key_match,'MATCHED_PREPARED_MASTER_PP99_TO101_AND_KEY_P109');
 assert.equal(r.original_answer_letter,q.correctOptionId);
 assert.equal(r.independent_scientific_key_check,'SOURCE_KEY_SCIENTIFICALLY_SUPPORTED_WITH_MODEL_NOTES');
 assert.equal(r.review_priority,mandatory.get(n)||'OPTIONAL');
 assert.ok(r.scientific_theme.length>=8);
 assert.ok(r.individual_teacher_note.length>=65);
 assert.ok(!r.individual_teacher_note.includes('undefined'));
 assert.equal(r.candidate_topic_slo_only,'P-11-B-35');
 assert.ok(['Knowledge','Understanding'].includes(r.candidate_cognitive_not_certified));
 assert.equal(r.original_printed_nbf_fidelity,'PENDING_ORIGINAL_NBF_PP95_TO96');
 assert.equal(r.individual_fbise_item_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const report=read('quality/grade11-unit06-v95c2i-topic63-mcq01-20-academic-review.md');
assert.ok(report.includes('20/20 matching stems'));
assert.ok(report.includes('80/80 matching A–D options'));
assert.ok(report.includes('20/20 matching answer letters'));
assert.ok(report.includes('Knowledge + Understanding'));
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T63-MCQ-'+String(n).padStart(4,'0')));
const flowRate=3/2,litresPerSecond=flowRate*1000;
assert.equal(flowRate,1.5);
assert.equal(litresPerSecond,1500);
assert.equal(qs.find(x=>x.sourceQuestionNumber===2).correctOptionId,'A');
assert.equal(qs.find(x=>x.sourceQuestionNumber===7).correctOptionId,'B');
assert.equal(qs.find(x=>x.sourceQuestionNumber===8).correctOptionId,'A');
assert.equal(qs.find(x=>x.sourceQuestionNumber===20).correctOptionId,'C');
const register=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(register.length,561);
const regKeys=csvParse(register[0]);
for(let i=0;i<20;i++){
 const row=Object.fromEntries(csvParse(register[161+i]).map((v,j)=>[regKeys[j],v]));
 assert.equal(row.source_question_id,qs[i].id);
 for(const k of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(row[k],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade11=manifest.grades.find(g=>g.grade===11),u6=grade11.units.find(u=>u.unit===6);
const catalog6=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(u6.liveMcqCount,560);
assert.equal(grade11.units.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
assert.equal(u6.standaloneSituationQuestionCount,136);
assert.equal(u6.independentSharedStimulusGroupCount,0);
assert.equal(u6.perQuestionSloVerified,false);
assert.equal(u6.exactFbiseModeReady,false);
assert.equal(catalog6.status,'planned');
assert.equal(catalog6.assessmentStatus,'not-published');
assert.equal(signoff.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2I PASS: Topic6.3 original MCQs 1-20, six teacher notes, framework K+U, all master approvals PENDING, release held.');
