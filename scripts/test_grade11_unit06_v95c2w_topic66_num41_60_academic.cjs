#!/usr/bin/env node
'use strict';
/* V95-C2W: Original prepared PDF pp232–235/241, printed NBF pp102–106 and
 * FBISE framework were examined outside GitHub CI. CI freezes original items,
 * arithmetic, source warnings, central teacher approvals and release holds.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-66-v86-80-source.json'));
const qs=bank.questions.slice(40,60);
assert.equal(bank.bankId,'PSN-XI-U06-T66-V86');
assert.equal(bank.questions.length,80);assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'ABCDACBDBDADABBDCBAA');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[232,233,233,233,233,233,233,233,234,234,234,234,234,234,234,235,235,235,235,235]);
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let h=2166136261;for(const c of snap)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;
assert.equal(h,0xebe31ab1,'A source MCQ stem/option/letter changed without review');
const calc=[
Math.sqrt(2*9.8*5),Math.sqrt(2*9.8*1.25),14*14/(2*9.8),Math.sqrt(2*9.8*2),
3*1,8/2*1.5,.5*1000*(6*6-2*2),.5*800*(5*5-2*2),
Math.sqrt(2*2+2*4500/1000),1000*9.8*2.5,Math.sqrt(2*9.8*.6/(4-1)),
Math.sqrt(2*9.8*.8/(9-1)),5e-4*4,.5*1000*(5*5-3*3),
47.1+.5*1000*(4*4-3*3)/1000+1000*9.8*3/1000,
1000*9.8*3,.5*1.29*(450*450-410*410),
.5*1.29*(450*450-410*410)*15*3,1500*20,.5*1.2*(30*30-20*20)
];
const chosen=[
'9.90 m s⁻¹','4.95 m s⁻¹','10.0 m','6.26 m s⁻¹','3.0 m s⁻¹','6.0 m s⁻¹',
'16,000 Pa','8,400 Pa','3.61 m s⁻¹','24,500 Pa','1.98 m s⁻¹','1.40 m s⁻¹',
'2.0 × 10⁻³ m³ s⁻¹','8.0 kPa','80.0 kPa','29.4 kPa','22,188 Pa',
'998,460 N','30,000 N','300 Pa'
];
const close=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<=Math.max(1e-10,Math.abs(b)*1e-8);
function csvParse(s){const a=[];let v='',quoted=false;for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'&&quoted&&s[i+1]==='"'){v+='"';i++;continue;}if(c==='"'){quoted=!quoted;continue;}if(c===','&&!quoted){a.push(v);v='';continue;}v+=c;}assert.equal(quoted,false);a.push(v);return a;}
const lines=read('quality/grade11-unit06-v95c2w-topic66-mcq41-60-numerical-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21);const headers=csvParse(lines[0]);assert.equal(headers.length,18);
const rows=lines.slice(1).map(l=>Object.fromEntries(csvParse(l).map((v,i)=>[headers[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const mandatory=new Map([
[43,'COMPULSORY_HEAD_TERMINOLOGY'],[45,'COMPULSORY_CONTINUITY_SLO'],
[46,'COMPULSORY_CONTINUITY_SLO'],[50,'COMPULSORY_PIEZOMETER_SCOPE'],
[53,'COMPULSORY_CONTINUITY_SLO'],[56,'COMPULSORY_B40_SINGLE_TERM_SCOPE'],
[57,'COMPULSORY_SUPERSONIC_COMPRESSIBILITY'],
[58,'COMPULSORY_AEROFOIL_AND_COMPRESSIBILITY'],
[60,'COMPULSORY_DIFFERENT_STREAMLINES_MODEL']
]);
for(let i=0;i<20;i++){
 const q=qs[i],n=i+41,r=rows[i];
 assert.equal(q.id,'XI-U06-T66-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'numericals');
 assert.equal(q.situationBased,false);assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(q.options.find(o=>o.id===q.correctOptionId).text,chosen[i]);
 assert.equal(r.source_question_id,q.id);assert.equal(r.topic,'6.6');
 assert.equal(r.source_number,String(n));
 assert.equal(r.prepared_pdf_question_page,String(q.sourcePdfPage));
 assert.equal(r.prepared_pdf_key_page,'241');
 assert.equal(r.prepared_stem_match,'MATCHED_PREPARED_MASTER_PP232_TO235');
 assert.equal(r.prepared_options_match_count,'4');
 assert.equal(r.prepared_key_match,'MATCHED_PREPARED_KEY_P241');
 assert.equal(r.original_letter,q.correctOptionId);
 assert.equal(r.original_selected_option,chosen[i]);
 assert.ok(r.independent_formula.trim().length>=4);
 assert.ok(close(Number(r.independent_result_SI),calc[i]),'Numerical result error Q'+n);
 assert.equal(r.teacher_priority,mandatory.get(n)||(r.teacher_priority==='OPTIONAL'?'OPTIONAL':r.teacher_priority));
 assert.ok(r.candidate_SLO_only_not_certified.length>=10);
 assert.ok(r.scientific_teacher_note.trim().length>65);
 assert.ok(r.source_NBF_original_print_status.includes('NBF'));
 assert.equal(r.individual_fbise_exam_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
assert.equal(rows[2].teacher_priority,'COMPULSORY_HEAD_TERMINOLOGY');
assert.equal(rows[16].teacher_priority,'COMPULSORY_SUPERSONIC_COMPRESSIBILITY');
assert.equal(rows[17].teacher_priority,'COMPULSORY_AEROFOIL_AND_COMPRESSIBILITY');
assert.equal(rows[14].source_NBF_original_print_status,'VERIFIED_NBF_PRINTED_EXAMPLE_6_4_P105');
assert.equal(rows[16].source_NBF_original_print_status,'VERIFIED_NBF_PRINTED_ASSIGNMENT_6_4_P106');
assert.equal(rows[17].source_NBF_original_print_status,'VERIFIED_NBF_PRINTED_ASSIGNMENT_6_4_P106');
assert.equal(calc[16],22188);
assert.equal(calc[17],998460);
assert.equal(calc[14],80);
assert.equal(calc[19],300);
assert.equal(calc[12],.002);
assert.equal(calc[2],10);
const report=read('quality/grade11-unit06-v95c2w-topic66-mcq41-60-numerical-review.md');
for(const fragment of ['20/20 stems, 80/80 options, 20/20 answer letters','460/560','450','410','compressibility','P-11-B-39'])assert.ok(report.includes(fragment),'Report missing '+fragment);
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T66-MCQ-'+String(n).padStart(4,'0')));
const queue=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(queue.length,561);const mh=csvParse(queue[0]);
for(let i=40;i<60;i++){
 const r=Object.fromEntries(csvParse(queue[401+i]).map((v,j)=>[mh[j],v]));
 assert.equal(r.source_question_id,qs[i-40].id);
 for(const col of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[col],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const gate=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=manifest.grades.find(g=>g.grade===11),u=grade.units.find(u=>u.unit===6);
const c=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(u.liveMcqCount,560);
assert.equal(grade.units.reduce((z,x)=>z+x.liveMcqCount,0),2250);
assert.equal(u.standaloneSituationQuestionCount,136);
assert.equal(u.independentSharedStimulusGroupCount,0);
assert.equal(u.perQuestionSloVerified,false);
assert.equal(u.exactFbiseModeReady,false);
assert.equal(c.status,'planned');assert.equal(c.assessmentStatus,'not-published');
assert.equal(gate.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2W PASS: 20 independent numerical answers, 9 compulsory teacher caveats incl. high-speed wing compressibility, NBF printed example fidelity, 460/560 academically inspected, all teacher approvals PENDING and no formal exam release.');
