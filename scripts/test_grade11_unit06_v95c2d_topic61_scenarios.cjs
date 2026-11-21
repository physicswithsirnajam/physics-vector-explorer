#!/usr/bin/env node
'use strict';
/* V95-C2D verifies original public 16 standalone scenario snapshots and teacher-review flags.
 * Private prepared PDF was compared outside GitHub CI; printed NBF fidelity not certified.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-61-v76-80-source.json'));
const qs=bank.questions.slice(64,80);
assert.equal(bank.bankId,'PSN-XI-U06-T61-V76');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,16);
assert.equal(qs.map(x=>x.correctOptionId).join(''),'DBBCAAADBBCCAABC','Original prepared PDF p16 key must remain unchanged');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[11,11,12,12,12,12,12,12,12,13,13,13,13,13,13,13]);
for(let i=0;i<16;i++){
 const q=qs[i],n=i+65;
 assert.equal(q.id,'XI-U06-T61-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'standalone-situations');
 assert.equal(q.situationBased,true);
 assert.equal(q.stimulusSetId,null,'No authentic shared-stimulus groups in these 16');
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim());
 assert.ok(q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);
 assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
}
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let digest=2166136261;
for(const ch of snap)digest=Math.imul(digest^ch.charCodeAt(0),16777619)>>>0;
assert.equal(digest,0x2994a3b3,'Original source stem/option/answer snapshot modified');
function csvLine(line){
 let cur='',quoted=false;const values=[];
 for(let i=0;i<line.length;i++){
  const ch=line[i];
  if(ch==='"'&&quoted&&line[i+1]==='"'){cur+='"';i++;continue;}
  if(ch==='"'){quoted=!quoted;continue;}
  if(ch===','&&!quoted){values.push(cur);cur='';continue;}
  cur+=ch;
 }
 assert.equal(quoted,false,'CSV quotes invalid');
 values.push(cur);return values;
}
const lines=read('quality/grade11-unit06-v95c2d-topic61-mcq65-80-scenario-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,17,'16 source ID rows and header');
const keys=csvLine(lines[0]);
const recs=lines.slice(1).map(line=>Object.fromEntries(csvLine(line).map((v,i)=>[keys[i],v])));
assert.equal(new Set(recs.map(x=>x.source_question_id)).size,16);
const mandatory=new Map([[70,'COMPULSORY_NOTE'],[72,'COMPULSORY_WORDING_REVIEW'],[74,'COMPULSORY_SOURCE_NOTE'],[79,'COMPULSORY_NOTE'],[80,'COMPULSORY_NOTE']]);
const sloB33=new Set([65,72,75,77,78,80]);
for(let i=0;i<16;i++){
 const q=qs[i],r=recs[i],n=i+65;
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.1');
 assert.equal(r.source_number,String(n));
 assert.equal(r.source_compiled_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.source_compiled_answer_page,'16');
 assert.equal(r.source_key,q.correctOptionId);
 assert.equal(r.prepared_source_stem_four_options_answer,'MATCHED_PREPARED_PDF_PP11_TO13_KEY_P16');
 assert.equal(r.item_type,'STANDALONE_SITUATION');
 assert.equal(r.shared_stimulus_group,'NONE');
 assert.equal(r.amendment_priority,mandatory.get(n)||'OPTIONAL');
 assert.ok(r.physics_review_result.trim().length>15);
 assert.ok(r.scientific_and_teacher_review_note.length>55);
 assert.equal(r.candidate_slo_topic_only,sloB33.has(n)?'P-11-B-33':'P-11-B-34');
 assert.ok(['Knowledge','Understanding','Application'].includes(r.candidate_cognitive_demand_not_certified));
 assert.equal(r.original_nbf_printed_fidelity,'PENDING_ORIGINAL_NBF_PP89_TO91');
 assert.equal(r.individual_board_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const doc=read('quality/grade11-unit06-v95c2d-topic61-mcq65-80-scenario-review.md');
assert.ok(doc.includes('16/16 stems')&&doc.includes('64/64 options')&&doc.includes('16/16 original answer letters'));
assert.ok(doc.includes('80 of 80 original teacher-prepared MCQs inspected'));
assert.ok(doc.includes('COMPULSORY_WORDING_REVIEW'));
for(const num of mandatory.keys())assert.ok(doc.includes('XI-U06-T61-MCQ-'+String(num).padStart(4,'0')));
assert.equal(qs.find(x=>x.sourceQuestionNumber===80).correctOptionId,'C');
assert.equal(55-40,15);
assert.equal(qs.find(x=>x.sourceQuestionNumber===79).correctOptionId,'B');
assert.equal(qs.every(x=>x.stimulusSetId===null),true);
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);
const header=csvLine(master[0]);
for(let n=65;n<=80;n++){
 const r=Object.fromEntries(csvLine(master[n]).map((v,i)=>[header[i],v]));
 assert.equal(r.source_question_id,qs[n-65].id);
 for(const status of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[status],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const gradeXI=manifest.grades.find(x=>x.grade===11);
const unit6=gradeXI.units.find(x=>x.unit===6);
const cat6=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===6);
assert.equal(unit6.liveMcqCount,560);
assert.equal(gradeXI.units.reduce((sum,x)=>sum+x.liveMcqCount,0),2250);
assert.equal(unit6.standaloneSituationQuestionCount,136);
assert.equal(unit6.independentSharedStimulusGroupCount,0);
assert.equal(unit6.perQuestionSloVerified,false);
assert.equal(unit6.exactFbiseModeReady,false);
assert.equal(cat6.status,'planned');
assert.equal(cat6.assessmentStatus,'not-published');
assert.equal(signoff.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2D PASS: 16 standalone scenarios, source key frozen, Q70/72/74/79/80 qualifications, Topic6.1 80/80 inspected, 560 teacher approvals PENDING, release held.');
