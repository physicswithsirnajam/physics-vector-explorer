#!/usr/bin/env node
'use strict';
/* V95-C2H. Prepared PDF and official framework were reopened outside GitHub CI.
 * This CI locks the original GitHub source and teacher evidence; it cannot
 * directly certify private PDF or original printed NBF figure/table fidelity.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-62-v78-80-source.json'));
const qs=bank.questions.slice(60,80);
assert.equal(bank.bankId,'PSN-XI-U06-T62-V78');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'DDAADDADAAADDBDCABBD');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[58,58,58,58,58,58,59,59,59,59,59,59,59,59,60,60,60,60,60,60]);
for(let i=0;i<qs.length;i++){
 const q=qs[i],n=i+61;
 assert.equal(q.id,'XI-U06-T62-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'standalone-situations');
 assert.equal(q.situationBased,true);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);
 assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 const figure=n===64?'unit6-figure65c':n===72?'unit6-figure63':null;
 assert.equal(q.referenceFigureId??null,figure,'Original figure linking must remain immutable');
}
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let digest=2166136261;
for(const c of snap)digest=Math.imul(digest^c.charCodeAt(0),16777619)>>>0;
assert.equal(digest,0xe417c728,'Q61-80 original source stems, choices or key changed');
function parseCSV(line){
 const arr=[];let field='',quoted=false;
 for(let i=0;i<line.length;i++){
  const c=line[i];
  if(c==='"'&&quoted&&line[i+1]==='"'){field+='"';i++;continue;}
  if(c==='"'){quoted=!quoted;continue;}
  if(c===','&&!quoted){arr.push(field);field='';continue;}
  field+=c;
 }
 assert.equal(quoted,false,'CSV quotations malformed');
 arr.push(field);return arr;
}
const csv=read('quality/grade11-unit06-v95c2h-topic62-mcq61-80-scenario-review.csv').trimEnd().split(/\r?\n/);
assert.equal(csv.length,21);
const head=parseCSV(csv[0]);
assert.equal(head.length,19);
const rows=csv.slice(1).map(line=>Object.fromEntries(parseCSV(line).map((v,i)=>[head[i],v])));
assert.equal(new Set(rows.map(x=>x.source_question_id)).size,20);
const mandatory=new Map([[64,'COMPULSORY_FIGURE_REVIEW'],[65,'COMPULSORY_SOURCE_NOTE'],[72,'COMPULSORY_FIGURE_AND_AERO_NOTE'],[75,'COMPULSORY_WORDING_REVIEW'],[78,'COMPULSORY_MOTION_NOTE'],[80,'COMPULSORY_TABLE_SOURCE_NOTE']]);
const sloB41=new Set([67,68,69,80]);
for(let i=0;i<20;i++){
 const q=qs[i],n=q.sourceQuestionNumber,r=rows[i];
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.source_number,String(n));
 assert.equal(r.topic,'6.2');
 assert.equal(r.source_compiled_pdf_question_page,String(q.sourcePdfPage));
 assert.equal(r.source_compiled_pdf_answer_page,n<=67?'63':'64');
 assert.equal(r.prepared_stem_option_key_comparison,'MATCHED_PREPARED_MASTER_PP58_TO60_KEY_PP63_TO64');
 assert.equal(r.original_source_letter,q.correctOptionId);
 assert.equal(r.question_type,'STANDALONE_SITUATION');
 assert.equal(r.grouped_stimulus_id,'NONE');
 assert.equal(r.linked_figure_id,q.referenceFigureId||'');
 assert.equal(r.independent_answer_review,'SOURCE_KEY_SCIENTIFICALLY_SUPPORTED_UNDER_EXPLICIT_MODEL_LIMITS');
 assert.equal(r.amendment_priority,mandatory.get(n)||'OPTIONAL');
 assert.ok(r.review_theme.length>=8);
 assert.ok(r.individual_physics_teacher_note.length>=65);
 assert.ok(!r.individual_physics_teacher_note.includes('undefined'));
 assert.equal(r.candidate_topic_slo_only,sloB41.has(n)?'P-11-B-41':'P-11-B-42');
 assert.ok(['Knowledge','Understanding','Application'].includes(r.tentative_item_cognitive_not_certified));
 assert.equal(r.original_nbf_printed_source,'PENDING_PRINTED_NBF_PP91_TO95');
 assert.equal(r.individual_fbise_item_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const review=read('quality/grade11-unit06-v95c2h-topic62-mcq61-80-scenario-review.md');
assert.ok(review.includes('20/20 matching stems'));
assert.ok(review.includes('80/80 matching options'));
assert.ok(review.includes('20/20 matching answer letters'));
assert.ok(review.includes('160/560'));
assert.ok(review.includes('COMPULSORY_WORDING_REVIEW'));
for(const n of mandatory.keys())assert.ok(review.includes('XI-U06-T62-MCQ-'+String(n).padStart(4,'0')));
assert.equal(qs.find(x=>x.sourceQuestionNumber===64).correctOptionId,'A');
assert.equal(qs.find(x=>x.sourceQuestionNumber===65).correctOptionId,'D');
assert.equal(qs.find(x=>x.sourceQuestionNumber===66).correctOptionId,'D');
assert.equal(qs.find(x=>x.sourceQuestionNumber===75).correctOptionId,'D');
assert.equal(qs.find(x=>x.sourceQuestionNumber===77).correctOptionId,'A');
assert.equal(qs.find(x=>x.sourceQuestionNumber===78).correctOptionId,'B');
assert.equal(qs.find(x=>x.sourceQuestionNumber===80).correctOptionId,'D');
assert.equal(42+5,47);
assert.equal(50/8,6.25);
assert.equal(20-12,8);
assert.equal(900-700,200);
assert.ok(Math.abs(2.12/1.144-1.853146853146853)<1e-10);
assert.ok(Math.abs(2.12/1.144-1.85)<.01);
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);
const mh=parseCSV(master[0]);
for(let i=60;i<80;i++){
 const row=Object.fromEntries(parseCSV(master[i+81]).map((x,j)=>[mh[j],x]));
 assert.equal(row.source_question_id,qs[i-60].id);
 for(const k of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(row[k],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const g11=manifest.grades.find(g=>g.grade===11),unit6=g11.units.find(u=>u.unit===6);
const cat=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(unit6.liveMcqCount,560);
assert.equal(g11.units.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
assert.equal(unit6.standaloneSituationQuestionCount,136);
assert.equal(unit6.independentSharedStimulusGroupCount,0);
assert.equal(unit6.perQuestionSloVerified,false);
assert.equal(unit6.exactFbiseModeReady,false);
assert.equal(cat.status,'planned');
assert.equal(cat.assessmentStatus,'not-published');
assert.equal(signoff.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2H PASS: Topic6.2 all 80 scenarios & original bank stable, 6 teacher gates, 160/560 inspected, master queue approvals PENDING, release held.');
