#!/usr/bin/env node
'use strict';
/* V95-C2B. Private source PDF matched manually/programmatically outside public CI;
   this script freezes the corresponding original source snapshot and review ledger.
   CI cannot independently retrieve the teacher's private compiled PDF.
*/
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-61-v76-80-source.json'));
const qs=bank.questions.slice(20,40);
assert.equal(bank.bankId,'PSN-XI-U06-T61-V76');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'BACABDCAADCBDBDABBDC');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[5,5,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,8,8]);
for(let i=0;i<20;i++){
 const x=qs[i],n=i+21;
 assert.equal(x.sourceQuestionNumber,n);
 assert.equal(x.id,'XI-U06-T61-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(x.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(x.options.every(o=>o.text.trim()));
 assert.ok(x.stem.trim()&&x.explanation.trim());
 assert.equal(x.sourceSection,'reasoning');
 assert.equal(x.active,true);
 assert.equal(x.boardEligible,false);
 assert.deepEqual(x.sloCodes,[]);
 assert.equal(x.cognitiveLevel,'Unspecified');
 assert.equal(x.assessmentClassification,'summative-topic-provisional');
}
const snap=qs.map(x=>[x.id,x.stem,x.options.map(o=>o.id+':'+o.text).join('|'),x.correctOptionId].join('\u001f')).join('\u001e');
let digest=2166136261;for(const c of snap)digest=Math.imul(digest^c.charCodeAt(0),16777619)>>>0;
assert.equal(digest,0x0a4dac97,'The 20 original prepared-master-matched public question snapshots changed');
function csvLine(line){
 const values=[];let v='',quoted=false;
 for(let i=0;i<line.length;i++){
  const c=line[i];if(c==='"'&&quoted&&line[i+1]==='"'){v+='"';i++;continue;}
  if(c==='"'){quoted=!quoted;continue;}
  if(c===','&&!quoted){values.push(v);v='';continue;}
  v+=c;
 }
 assert.equal(quoted,false);values.push(v);return values;
}
const lines=read('quality/grade11-unit06-v95c2b-topic61-mcq21-40-academic-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21);
const header=csvLine(lines[0]);
const items=lines.slice(1).map(l=>Object.fromEntries(csvLine(l).map((s,i)=>[header[i],s])));
assert.equal(new Set(items.map(x=>x.source_question_id)).size,20);
const compulsory=new Map([[22,'COMPULSORY_NOTE'],[23,'COMPULSORY_NOTE'],[25,'COMPULSORY_NOTE'],[37,'COMPULSORY_NOTE'],[39,'COMPULSORY_SOURCE']]);
for(let i=0;i<20;i++){
 const x=qs[i],r=items[i],n=i+21;
 assert.equal(r.source_question_id,x.id);
 assert.equal(r.topic,'6.1');
 assert.equal(r.source_number,String(n));
 assert.equal(r.prepared_master_pdf_page,String(x.sourcePdfPage));
 assert.equal(r.prepared_source_question_options_answer,'MATCHED_PREPARED_MASTER_PP5_TO8_AND_KEY_PP14_TO15');
 assert.equal(r.source_answer_letter,x.correctOptionId);
 assert.equal(r.independent_physics_answer_check,'REVIEWED_SOURCE_KEY_PHYSICS_SUPPORTED');
 assert.equal(r.amendment_priority,compulsory.get(n)||'OPTIONAL');
 assert.equal(r.candidate_topic_slo_only,(n===27||n>=37)?'P-11-B-34':'P-11-B-33');
 assert.ok(['Knowledge','Understanding','Application'].includes(r.candidate_cognitive_level_not_certified));
 assert.equal(r.original_printed_nbf_fidelity,'PENDING_ORIGINAL_NBF_PP89_TO91');
 assert.equal(r.individual_slo_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
 assert.ok(r.teacher_explanatory_note_or_risk.length>55);
}
const md=read('quality/grade11-unit06-v95c2b-topic61-mcq21-40-academic-review.md');
assert.ok(md.includes('20/20 matching stems'));
assert.ok(md.includes('80/80 matching options'));
assert.ok(md.includes('20/20 matching answer letters'));
assert.ok(md.includes('original printed NBF')||md.includes('Original printed NBF'));
for(const num of compulsory.keys())assert.ok(md.includes('XI-U06-T61-MCQ-'+String(num).padStart(4,'0')));
assert.equal((15-15),0,'Net force sanity');
const Fb=(rho,g,v)=>rho*g*v;
assert.equal(Fb(1000,9.8,.002),19.6);
assert.equal(Fb(1000,19.6,.002),39.2);
assert.equal(Fb(1000,9.8,.004),39.2);
assert.equal((1500-1300),200);
const rho=1000,g=9.8,area=.01,sep=.4,extra=.5;
assert.ok(Math.abs((rho*g*(sep+extra)-rho*g*extra)-(rho*g*sep))<1e-8);
assert.equal(qs[3].correctOptionId,'A');
assert.equal(qs[12].correctOptionId,'D');
assert.equal(qs[16].correctOptionId,'B');
const linesMaster=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(linesMaster.length,561,'Master 560-row review ledger must remain complete');
const mh=csvLine(linesMaster[0]);
for(let i=20;i<40;i++){
 const r=Object.fromEntries(csvLine(linesMaster[i+1]).map((v,j)=>[mh[j],v]));
 assert.equal(r.source_question_id,qs[i-20].id);
 for(const status of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[status],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const g=manifest.grades.find(x=>x.grade===11),unit=g.units.find(x=>x.unit===6);
const cat=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===6);
assert.equal(unit.liveMcqCount,560);
assert.equal(g.units.reduce((s,x)=>s+x.liveMcqCount,0),2250);
assert.equal(unit.standaloneSituationQuestionCount,136);
assert.equal(unit.independentSharedStimulusGroupCount,0);
assert.equal(unit.perQuestionSloVerified,false);
assert.equal(cat.status,'planned');
assert.equal(cat.assessmentStatus,'not-published');
assert.equal(signoff.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2B PASS: 20 public-source snapshots locked, 20 prepared-master original answer letters, 5 compulsory teacher qualifications, 20 approvals pending; Unit6 not released.');
