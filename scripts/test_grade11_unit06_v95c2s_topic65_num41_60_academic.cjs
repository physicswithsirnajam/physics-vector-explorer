#!/usr/bin/env node
'use strict';
/* V95-C2S: prepared private PDF + owner-supplied original NBF image pages
 * were visually checked OUTSIDE GitHub CI. This test preserves frozen source
 * MCQ material, 20 numerical results, pending teacher approvals and release
 * blocks; original textbook image bytes remain private and unpublished.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-65-v84-80-source.json'));
const qs=bank.questions.slice(40,60);
assert.equal(bank.bankId,'PSN-XI-U06-T65-V84');assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'DBDADBACCBBABCBBACAD');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[188,188,188,188,188,188,188,189,189,189,189,189,189,189,189,190,190,190,190,190]);
for(let i=0;i<qs.length;i++){
 const q=qs[i],n=i+41;
 assert.equal(q.id,'XI-U06-T65-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'numericals');assert.equal(q.situationBased,false);
 assert.equal(q.stimulusSetId,null);assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
}
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let h=2166136261;for(const c of snap)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;
assert.equal(h,0xd8048e94,'A reviewed source stem/choice/answer has changed; reconcile before publication');
const numeric=[
120000+500*(4-36),90000+500*(9-25),180000+500*(16-4),200000-1000*9.8*5,
500*5**2,.5*800*10**2,1000*9.8*3,Math.sqrt(4+2*20000/1000),
.5*1000*(64-16),Math.sqrt(4+2*12000/1000),
(15000+.5*1000*(1-9))/(1000*10),
(20000+.5*1000*(4-36))/(1000*10),
1000*9.8*2,.5*1000*(49-9),.5*1000*16,100000-.5*1000*100,
80000*.002,.020*3*5,.5*1000*16,Math.sqrt(2*18000/1000)
];
const selected=['104 kPa','82 kPa','186 kPa','151 kPa','12 500 Pa','40 000 Pa','29 400 Pa','6.63 m/s','24 kPa','5.29 m/s','1.1 m','0.4 m','19.6 kPa','20 000 Pa','8 kPa','50 kPa','160 J','0.30 m³','8 000 J/m³','6 m/s'];
const approx=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<=Math.max(2e-10,Math.abs(b)*1e-8);
assert.equal(numeric.length,20);assert.equal(selected.length,20);
function parseCSV(s){const out=[];let v='',quoted=false;for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'&&quoted&&s[i+1]==='"'){v+='"';i++;continue;}if(c==='"'){quoted=!quoted;continue;}if(c===','&&!quoted){out.push(v);v='';continue;}v+=c;}assert.equal(quoted,false,'CSV quote');out.push(v);return out;}
const file=read('quality/grade11-unit06-v95c2s-topic65-mcq41-60-numerical-review.csv').trimEnd().split(/\r?\n/);
assert.equal(file.length,21);const hdr=parseCSV(file[0]);assert.equal(hdr.length,20);
const rows=file.slice(1).map(s=>Object.fromEntries(parseCSV(s).map((v,i)=>[hdr[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const compulsory=new Map([
[45,'COMPULSORY_B40_SCOPE_NOTE'],[46,'COMPULSORY_B40_SCOPE_NOTE'],[47,'COMPULSORY_B40_SCOPE_NOTE'],
[55,'COMPULSORY_STAGNATION_CONDITION'],[56,'COMPULSORY_STAGNATION_CONDITION'],
[57,'COMPULSORY_B40_SCOPE_NOTE'],[58,'COMPULSORY_CROSS_SLO_NOTE'],
[59,'COMPULSORY_B40_SCOPE_NOTE'],[60,'COMPULSORY_B40_SCOPE_NOTE']
]);
for(let i=0;i<20;i++){
 const q=qs[i],n=q.sourceQuestionNumber,r=rows[i];
 assert.equal(q.options.find(o=>o.id===q.correctOptionId).text,selected[i]);
 assert.equal(r.source_question_id,q.id);assert.equal(r.topic,'6.5');
 assert.equal(r.source_number,String(n));
 assert.equal(r.teacher_compiled_question_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.teacher_compiled_key_pdf_page,'195');
 assert.equal(r.prepared_stem_match,'MATCHED_PREPARED_MASTER');
 assert.equal(r.prepared_A_to_D_option_match_count,'4');
 assert.equal(r.original_letter,q.correctOptionId);
 assert.equal(r.prepared_key_letter_match,'MATCHED');
 assert.equal(r.original_selected_text,selected[i]);
 assert.ok(r.independent_formula.trim().length>3);
 assert.ok(approx(Number(r.independent_calculated_value_SI),numeric[i]),'Result mismatch Q'+n);
 assert.equal(r.teacher_priority,compulsory.get(n)||(r.teacher_priority.startsWith('OPTIONAL')?r.teacher_priority:'OPTIONAL'));
 assert.ok(r.teacher_issue.trim().length>10);assert.ok(r.scientific_teacher_note.trim().length>45);
 assert.ok(r.candidate_slo_only_not_certified.startsWith('P-11-B-'));
 assert.equal(r.prepared_author_cognitive_label,'Application_author_tag');
 assert.equal(r.original_nbf_formula_source_status,'PRINTED_NBF_P99_P100_EQUATION_VISUALLY_VERIFIED_ITEM_MAPPING_PENDING');
 assert.equal(r.individual_fbise_item_certification,'PENDING');assert.equal(r.teacher_approval,'PENDING');
}
assert.equal(rows[14].teacher_priority,'COMPULSORY_STAGNATION_CONDITION');
assert.equal(rows[15].teacher_priority,'COMPULSORY_STAGNATION_CONDITION');
assert.equal(rows[17].candidate_slo_only_not_certified,'P-11-B-36_candidate;P-11-B-40_supporting');
assert.equal(rows[17].teacher_priority,'COMPULSORY_CROSS_SLO_NOTE');
assert.equal(0.5*1000*(4**2-0**2),8000);
assert.equal(100000-.5*1000*10**2,50000);
assert.equal(.020*3*5,.3);
const report=read('quality/grade11-unit06-v95c2s-topic65-mcq41-60-numerical-review.md');
assert.ok(report.includes('20/20 question stems, 80/80 original options and 20/20 letters matching'));
assert.ok(report.includes('380/560'));
for(const n of compulsory.keys())assert.ok(report.includes('XI-U06-T65-MCQ-'+String(n).padStart(4,'0')));
const addendum=read('quality/grade11-unit06-v95c2s-original-nbf-image-verification.md');
for(const s of ['Figure6.6','Figure6.7','Example6.3','Figure6.9','Daniel Bernoulli','p.97 appears twice','pp.107–111'])assert.ok(addendum.includes(s),'Missing source evidence: '+s);
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);const mh=parseCSV(master[0]);
for(let i=40;i<60;i++){
 const row=Object.fromEntries(parseCSV(master[321+i]).map((v,j)=>[mh[j],v]));
 assert.equal(row.source_question_id,qs[i-40].id);
 for(const field of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(row[field],'PENDING');
}
const m=JSON.parse(read('question-bank/manifest.json')),cat=JSON.parse(read('portal/learning-catalog.json')),s=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const g=m.grades.find(x=>x.grade===11),u=g.units.find(x=>x.unit===6),c=cat.grades.find(x=>x.grade===11).units.find(x=>x.unit===6);
assert.equal(u.liveMcqCount,560);
assert.equal(g.units.reduce((n,x)=>n+x.liveMcqCount,0),2250);
assert.equal(u.standaloneSituationQuestionCount,136);
assert.equal(u.independentSharedStimulusGroupCount,0);
assert.equal(u.perQuestionSloVerified,false);
assert.equal(u.exactFbiseModeReady,false);
assert.equal(c.status,'planned');assert.equal(c.assessmentStatus,'not-published');
assert.equal(s.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2S PASS: Bernoulli 20 selected values, 9 academic flags, newly verified original NBF figures/example, 380/560 inspected, approvals PENDING and release held.');
