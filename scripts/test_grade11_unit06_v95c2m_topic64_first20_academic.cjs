#!/usr/bin/env node
'use strict';
/* V95-C2M academic-source check: teacher-prepared PDF and official framework
 * directly reopened OUTSIDE CI; this test protects GitHub original record
 * integrity and release holds, not printed NBF fidelity or FBISE certification.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-64-v82-80-source.json'));
const qs=bank.questions.slice(0,20);
assert.equal(bank.bankId,'PSN-XI-U06-T64-V82');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'BBCCACCCBCACBADDCBCC');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[137,137,137,137,137,137,138,138,138,138,138,138,138,138,139,139,139,139,139,139]);
for(let i=0;i<qs.length;i++){
 const q=qs[i],n=i+1;
 assert.equal(q.id,'XI-U06-T64-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'fundamentals');
 assert.equal(q.situationBased,false);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);
 assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
}
const snapshot=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let fp=2166136261;
for(const c of snapshot)fp=Math.imul(fp^c.charCodeAt(0),16777619)>>>0;
assert.equal(fp,0xd6df1ce5,'Original source stem, options or letter changed since prepared-PDF audit');
function csvParse(line){
 const out=[];let value='',quoted=false;
 for(let i=0;i<line.length;i++){
  const c=line[i];
  if(c==='"'&&quoted&&line[i+1]==='"'){value+='"';i++;continue;}
  if(c==='"'){quoted=!quoted;continue;}
  if(c===','&&!quoted){out.push(value);value='';continue;}
  value+=c;
 }
 assert.equal(quoted,false,'CSV quotation malformed');
 out.push(value);return out;
}
const rowsFile=read('quality/grade11-unit06-v95c2m-topic64-mcq01-20-academic-review.csv').trimEnd().split(/\r?\n/);
assert.equal(rowsFile.length,21,'20 question rows plus header');
const hdr=csvParse(rowsFile[0]);assert.equal(hdr.length,18);
const records=rowsFile.slice(1).map(line=>Object.fromEntries(csvParse(line).map((v,i)=>[hdr[i],v])));
assert.equal(new Set(records.map(r=>r.source_question_id)).size,20);
const compulsory=new Map([
[2,'COMPULSORY_MODEL_SCOPE_NOTE'],[5,'COMPULSORY_MEAN_VELOCITY_NOTE'],
[6,'COMPULSORY_COGNITIVE_SCOPE_NOTE'],[8,'COMPULSORY_COGNITIVE_SCOPE_NOTE'],
[9,'COMPULSORY_SLO_SCOPE_NOTE'],[14,'COMPULSORY_FIGURE_FIDELITY_NOTE'],
[18,'COMPULSORY_COGNITIVE_SCOPE_NOTE'],[20,'COMPULSORY_BRANCH_DIRECTIONS_NOTE']]);
const sloB38=new Set([1,2,7,8,11,12,14,17,18,20]);
for(let i=0;i<20;i++){
 const q=qs[i],n=q.sourceQuestionNumber,r=records[i];
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.4');
 assert.equal(r.source_number,String(n));
 assert.equal(r.source_prepared_pdf_question_page,String(q.sourcePdfPage));
 assert.equal(r.source_prepared_pdf_answer_page,'148');
 assert.equal(r.prepared_pdf_stem_options_key_match,'MATCHED_PREPARED_PDF_PP137_TO139_AND_KEY_P148');
 assert.equal(r.original_correct_letter,q.correctOptionId);
 assert.equal(r.source_section,'fundamentals');
 assert.equal(r.source_figure_link_id,'');
 assert.equal(r.scientific_key_review,'SOURCE_ANSWER_SCIENTIFICALLY_SUPPORTED');
 assert.equal(r.teacher_review_priority,compulsory.get(n)||'OPTIONAL');
 assert.ok(r.teacher_review_theme.trim().length>10);
 assert.ok(r.scientific_scope_teacher_note.trim().length>=55);
 assert.notEqual(r.scientific_scope_teacher_note.trim(),'undefined');
 assert.equal(r.candidate_topic_slo_only,sloB38.has(n)?'P-11-B-38':'P-11-B-36');
 assert.ok(['Knowledge','Understanding'].includes(r.tentative_cognitive_level_not_certified));
 assert.equal(r.original_printed_nbf_fidelity,'PENDING_PRINTED_NBF_PP96_TO99');
 assert.equal(r.individual_fbise_slo_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const report=read('quality/grade11-unit06-v95c2m-topic64-mcq01-20-academic-review.md');
assert.ok(report.includes('20/20 matching stems'));
assert.ok(report.includes('80/80 matching options'));
assert.ok(report.includes('20/20 matching answer letters'));
assert.ok(report.includes('260/560'));
assert.ok(report.includes('P-11-B-37'));
for(const n of compulsory.keys())assert.ok(report.includes('XI-U06-T64-MCQ-'+String(n).padStart(4,'0')));
assert.equal(qs[13].correctOptionId,'A');
assert.ok(qs[13].stem.includes('Fig. 6.7'));
assert.equal(qs[13].referenceFigureId??null,null,'No independently certified Figure 6.7 link');
assert.equal(qs[19].correctOptionId,'C');
assert.equal(qs[19].options.find(o=>o.id==='C').text,'Q_main = Q_branch1 + Q_branch2');
const A1=2,v1=3,A2=6,v2=1,rho1=1000,rho2=1000;
assert.equal(A1*v1,A2*v2);
assert.equal(rho1*A1*v1,rho2*A2*v2);
assert.equal(0.002*3,0.006);
assert.equal(5,2+3);
const all=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(all.length,561);
const queueHead=csvParse(all[0]);
for(let i=0;i<20;i++){
 const row=Object.fromEntries(csvParse(all[241+i]).map((v,j)=>[queueHead[j],v]));
 assert.equal(row.source_question_id,qs[i].id);
 for(const status of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(row[status],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const g11=manifest.grades.find(g=>g.grade===11),u6=g11.units.find(u=>u.unit===6);
const cat=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(u6.liveMcqCount,560);
assert.equal(g11.units.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
assert.equal(u6.standaloneSituationQuestionCount,136);
assert.equal(u6.independentSharedStimulusGroupCount,0);
assert.equal(u6.perQuestionSloVerified,false);
assert.equal(u6.exactFbiseModeReady,false);
assert.equal(cat.status,'planned');
assert.equal(cat.assessmentStatus,'not-published');
assert.equal(signoff.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2M PASS: 20 original continuity MCQs, 8 teacher review flags, 260/560 inspected, all 560 teacher approvals pending and assessment release held.');
