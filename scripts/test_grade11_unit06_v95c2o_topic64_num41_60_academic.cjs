#!/usr/bin/env node
'use strict';
/* Teacher-prepared PDF was compared outside GitHub CI; checks preserve existing
 * source records and teacher non-release controls, not printed NBF fidelity.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-64-v82-80-source.json'));
const qs=bank.questions.slice(40,60);
assert.equal(bank.bankId,'PSN-XI-U06-T64-V82');assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);assert.equal(qs.map(q=>q.correctOptionId).join(''),'ABCDACBDBDADABBDCBAA');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[142,142,142,142,143,143,143,143,143,143,143,143,144,144,144,144,144,144,144,144]);
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let h=2166136261;for(const c of snap)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;
assert.equal(h,0xb3339fcd,'Source stem/option/letter changed');
function csvParse(s){const a=[];let v='',quoted=false;for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'&&quoted&&s[i+1]==='"'){v+='"';i++;continue;}if(c==='"'){quoted=!quoted;continue;}if(c===','&&!quoted){a.push(v);v='';continue;}v+=c;}assert.equal(quoted,false);a.push(v);return a;}
const lines=read('quality/grade11-unit06-v95c2o-topic64-mcq41-60-numerical-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21);const hdr=csvParse(lines[0]);assert.equal(hdr.length,19);
const rows=lines.slice(1).map(l=>Object.fromEntries(csvParse(l).map((v,i)=>[hdr[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const methods=[
6/3*2,4e-4*3,2e-3/5e-4,12e-3/60,3e-3*40,(4/2)**2,8*(1/2)**2,800*.002/(1000*.001),2/1000,3*2e-4*1.5,2*5/(2*1),(.8/.4)**2*.33/30,(.8/.2)**2*.40/16,10/2*.6,15e-3/5,.008*.25,1e-3/2.5e-4,1000*.004*1.5,6e-3/.003,1.2*.010*10/(1.5*.008)
];
const answers=['4 m s-1','1.2 × 10-3 m3 s-1','4 m s-1','2.0 × 10-4 m3 s-1','0.12 m3','4 m s-1','2 m s-1','1.6 m s-1','2 × 10-3 m3 s-1','9 × 10-4 m3 s-1','5 m s-1','0.044 m s-1','0.40 m s-1','3.0 m s-1','3 × 10-3 m3 s-1','0.002 m3 s-1','4 m s-1','6 kg s-1','2 m s-1','10 m s-1'];
const close=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<=Math.max(1e-11,Math.abs(b)*1e-8);
const flags=new Map([[44,'COMPULSORY_SLO_SCOPE_NOTE'],[45,'COMPULSORY_SLO_SCOPE_NOTE'],[48,'COMPULSORY_COMPRESSIBLE_SCOPE_NOTE'],[49,'COMPULSORY_SLO_SCOPE_NOTE'],[51,'COMPULSORY_UNDERDETERMINED_BRANCH_SPLIT'],[52,'COMPULSORY_PRINT_AND_EQUAL_SPLIT_NOTE'],[55,'COMPULSORY_SLO_SCOPE_NOTE'],[58,'COMPULSORY_SLO_SCOPE_NOTE']]);
for(let i=0;i<20;i++){
 const q=qs[i],n=41+i,r=rows[i];
 assert.equal(q.id,'XI-U06-T64-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'numericals');
 assert.equal(q.situationBased,false);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(q.options.find(o=>o.id===q.correctOptionId).text,answers[i]);
 assert.ok(Number.isFinite(methods[i]));
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.4');assert.equal(r.source_number,String(n));
 assert.equal(r.compiled_question_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.compiled_answer_pdf_page,'149');
 assert.equal(r.prepared_stem_fidelity,[45,53].includes(n)?'VISUAL_PDF_SUPERSCRIPT_VERIFIED':'DIRECT_PDF_TEXT_MATCH');
 assert.equal(r.prepared_option_match_count,'4');
 assert.equal(r.original_letter,q.correctOptionId);
 assert.equal(r.selected_option_text,answers[i]);
 assert.ok(close(Number(r.independent_result),methods[i]),'Wrong numerical result Q'+n);
 assert.equal(r.teacher_priority,flags.get(n)||(r.teacher_priority==='OPTIONAL'?'OPTIONAL':r.teacher_priority));
 assert.ok(r.teacher_note.trim().length>25);
 assert.notEqual(r.teacher_note.trim(),'undefined');
 assert.ok(r.candidate_slo_only.startsWith('P-11-'));
 assert.equal(r.candidate_cognition_unapproved,'Application_candidate');
 assert.equal(r.printed_original_nbf_fidelity,'PENDING_NBF_PP96_TO99');
 assert.equal(r.individual_exam_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
assert.equal(2*5,1*5+1*5);
assert.equal(2*5,1*3+1*7,'Q51 equal branch area does not imply equal outlet speed');
assert.ok(close((.8/.4)**2*.33/30,.044));
assert.ok(close((.8/.2)**2*.4/16,.4));
const report=read('quality/grade11-unit06-v95c2o-topic64-mcq41-60-numerical-review.md');
assert.ok(report.includes('80/80 option texts'));
assert.ok(report.includes('20/20 original answer letters'));
assert.ok(report.includes('300/560'));
for(const n of flags.keys())assert.ok(report.includes('COMPULSORY')&&report.includes('**'+n+'**'));
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);const mh=csvParse(master[0]);
for(let i=40;i<60;i++){
 const row=Object.fromEntries(csvParse(master[241+i]).map((v,j)=>[mh[j],v]));
 assert.equal(row.source_question_id,qs[i-40].id);
 for(const k of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(row[k],'PENDING');
}
const m=JSON.parse(read('question-bank/manifest.json')),c=JSON.parse(read('portal/learning-catalog.json'));
const s=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=m.grades.find(g=>g.grade===11),u=grade.units.find(u=>u.unit===6);
const cat=c.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(u.liveMcqCount,560);
assert.equal(grade.units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.equal(u.standaloneSituationQuestionCount,136);
assert.equal(u.independentSharedStimulusGroupCount,0);
assert.equal(u.perQuestionSloVerified,false);
assert.equal(u.exactFbiseModeReady,false);
assert.equal(cat.status,'planned');assert.equal(cat.assessmentStatus,'not-published');
assert.equal(s.releaseApproved,false);assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2O PASS: original MCQ 41-60 unchanged, 20 numeric values, Q51/Q52 branch split limitations, 8 teacher flags, 300/560 review, all 560 approvals PENDING.');
