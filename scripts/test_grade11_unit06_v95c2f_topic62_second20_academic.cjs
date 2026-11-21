#!/usr/bin/env node
'use strict';
/* V95-C2F: Prepared PDF compared outside public CI; this test locks the GitHub
 * master source snapshot, teacher-decision addendum and safe-release status.
 * It does not certify printed NBF fidelity or official per-item exam use.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-62-v78-80-source.json'));
const qs=bank.questions.slice(20,40);
assert.equal(bank.bankId,'PSN-XI-U06-T62-V78');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'DACBDDDBDBCCCCDADAAB','Prepared master p62 answer letters');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[53,53,53,53,54,54,54,54,54,54,54,54,54,55,55,55,55,55,55,55]);
for(let i=0;i<20;i++){
 const q=qs[i],n=i+21;
 assert.equal(q.id,'XI-U06-T62-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'reasoning');
 assert.equal(q.options.map(x=>x.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim());
 assert.ok(q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);
 assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
}
const snapshot=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let digest=2166136261;
for(const c of snapshot)digest=Math.imul(digest^c.charCodeAt(0),16777619)>>>0;
assert.equal(digest,0x18db33e7,'An original stem/option/letter has changed since teacher source comparison');
function parseCSV(line){
 let field='',quoted=false; const arr=[];
 for(let i=0;i<line.length;i++){
  const c=line[i];
  if(c==='"'&&quoted&&line[i+1]==='"'){field+='"';i++;continue;}
  if(c==='"'){quoted=!quoted;continue;}
  if(c===','&&!quoted){arr.push(field);field='';continue;}
  field+=c;
 }
 assert.equal(quoted,false,'Invalid CSV quote');
 arr.push(field);return arr;
}
const csv=read('quality/grade11-unit06-v95c2f-topic62-mcq21-40-academic-review.csv').trimEnd().split(/\r?\n/);
assert.equal(csv.length,21,'20 review rows plus header');
const header=parseCSV(csv[0]);
const items=csv.slice(1).map(l=>Object.fromEntries(parseCSV(l).map((v,i)=>[header[i],v])));
assert.equal(new Set(items.map(x=>x.source_question_id)).size,20);
const mandatory=new Map([[21,'COMPULSORY_CONTEXT_NOTE'],[26,'COMPULSORY_FIGURE_SOURCE_NOTE'],[31,'COMPULSORY_MOTION_NOTE'],[35,'COMPULSORY_MODEL_NOTE'],[40,'COMPULSORY_FORCE_NOTE']]);
for(let i=0;i<20;i++){
 const n=i+21,q=qs[i],r=items[i];
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.2');
 assert.equal(r.source_number,String(n));
 assert.equal(r.compiled_source_question_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.compiled_source_answer_key_pdf_page,'62');
 assert.equal(r.prepared_source_stem_options_key_comparison,'MATCHED_PREPARED_MASTER_PP53_TO55_AND_KEY_P62');
 assert.equal(r.original_answer_letter,q.correctOptionId);
 assert.equal(r.scientific_key_check,'SUPPORTED_UNDER_STATED_OR_EXPLICITLY_LIMITED_MODEL');
 assert.equal(r.amendment_priority,mandatory.get(n)||'OPTIONAL');
 assert.equal(r.candidate_topic_slo_only,n<=22?'P-11-B-41':'P-11-B-42');
 assert.ok(['Knowledge','Understanding','Application'].includes(r.candidate_cognitive_not_certified));
 assert.equal(r.source_figure_id,n===26?'unit6-figure63':'');
 assert.ok(r.individual_teacher_note.length>55);
 assert.equal(r.original_printed_nbf_review,'PENDING_ORIGINAL_PRINTED_NBF_PP91_TO95');
 assert.equal(r.per_item_official_cognition_and_slo_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const report=read('quality/grade11-unit06-v95c2f-topic62-mcq21-40-academic-review.md');
assert.ok(report.includes('20/20 matching stems'));
assert.ok(report.includes('80/80 matching options'));
assert.ok(report.includes('20/20 matching source answer letters'));
assert.ok(report.includes('Summative / Understanding'));
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T62-MCQ-'+String(n).padStart(4,'0')));
assert.equal(qs.find(q=>q.sourceQuestionNumber===26).referenceFigureId,'unit6-figure63');
const pi=3.14,eta=.002,r=.001,velocity=.1;
const drag=6*pi*eta*r*velocity;
assert.ok(Math.abs(drag-0.000003768)<1e-15);
assert.equal((2*r)**2/(r**2),4);
assert.equal((2*r)**3/(r**3),8);
assert.equal((2*eta)/(eta),2);
const rhoSphere=1000,rhoFluid=100;
const actualDensityDouble=(2*rhoSphere-rhoFluid)/(rhoSphere-rhoFluid);
assert.notEqual(actualDensityDouble,2,'Buoyancy-corrected density doubling is not exactly two');
assert.equal(qs.find(q=>q.sourceQuestionNumber===35).correctOptionId,'D');
assert.equal(qs.find(q=>q.sourceQuestionNumber===31).correctOptionId,'C');
assert.equal(qs.find(q=>q.sourceQuestionNumber===40).correctOptionId,'B');
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);
const masterHeader=parseCSV(master[0]);
for(let i=20;i<40;i++){
 const m=Object.fromEntries(parseCSV(master[i+81]).map((v,j)=>[masterHeader[j],v]));
 assert.equal(m.source_question_id,qs[i-20].id);
 for(const status of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(m[status],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const g11=manifest.grades.find(g=>g.grade===11);
const u6=g11.units.find(u=>u.unit===6);
const cat=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(u6.liveMcqCount,560);
assert.equal(g11.units.reduce((s,u)=>s+u.liveMcqCount,0),2250);
assert.equal(u6.standaloneSituationQuestionCount,136);
assert.equal(u6.independentSharedStimulusGroupCount,0);
assert.equal(u6.perQuestionSloVerified,false);
assert.equal(u6.exactFbiseModeReady,false);
assert.equal(cat.status,'planned');
assert.equal(cat.assessmentStatus,'not-published');
assert.equal(signoff.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2F PASS: Q21-40 original MCQs, 20 keys unchanged, 5 teacher notes, 560 approvals pending, course release held.');
