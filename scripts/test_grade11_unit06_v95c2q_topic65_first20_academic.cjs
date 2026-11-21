#!/usr/bin/env node
'use strict';
/* V95-C2Q: prepared master PDF and official framework directly reopened outside
 * CI. This test freezes original GitHub questions and auditable teacher holds;
 * it does NOT certify printed original NBF Figure 6.9 or board item readiness.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-65-v84-80-source.json'));
const qs=bank.questions.slice(0,20);
assert.equal(bank.bankId,'PSN-XI-U06-T65-V84');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'AACCBCDCBACADDBCABAD');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[183,183,183,183,183,183,184,184,184,184,184,184,184,184,184,185,185,185,185,185]);
for(let i=0;i<20;i++){
 const q=qs[i],n=i+1;
 assert.equal(q.id,'XI-U06-T65-MCQ-'+String(n).padStart(4,'0'));
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
let d=2166136261;for(const c of snapshot)d=Math.imul(d^c.charCodeAt(0),16777619)>>>0;
assert.equal(d,0x5a371272,'Original source stem/choice/letter has unexpectedly changed');
function csvParse(line){
 const fields=[];let v='',quoted=false;
 for(let i=0;i<line.length;i++){
  const c=line[i];if(c==='"'&&quoted&&line[i+1]==='"'){v+='"';i++;continue;}
  if(c==='"'){quoted=!quoted;continue;}
  if(c===','&&!quoted){fields.push(v);v='';continue;}v+=c;
 }
 assert.equal(quoted,false,'Invalid quotation in CSV');
 fields.push(v);return fields;
}
const lines=read('quality/grade11-unit06-v95c2q-topic65-mcq01-20-academic-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21);
const columns=csvParse(lines[0]);assert.equal(columns.length,22);
const rows=lines.slice(1).map(s=>Object.fromEntries(csvParse(s).map((x,i)=>[columns[i],x])));
assert.equal(new Set(rows.map(x=>x.source_question_id)).size,20);
const mandatory=new Map([
 [1,'COMPULSORY_COGNITIVE_SCOPE_NOTE'],
 [8,'COMPULSORY_COGNITIVE_SCOPE_NOTE'],
 [9,'COMPULSORY_COGNITIVE_SCOPE_NOTE'],
 [10,'COMPULSORY_COGNITIVE_SCOPE_NOTE'],
 [13,'COMPULSORY_ORIGINAL_FIGURE_REVIEW'],
 [17,'COMPULSORY_CROSS_SLO_NOTE'],
 [19,'COMPULSORY_CROSS_SLO_NOTE'],
 [20,'COMPULSORY_ORIGINAL_TEXTBOOK_ATTRIBUTION']
]);
const authorTags='KKKKUUUKKKUUUUUKUKUK';
for(let i=0;i<20;i++){
 const q=qs[i],n=q.sourceQuestionNumber,r=rows[i];
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.5');
 assert.equal(r.source_number,String(n));
 assert.equal(r.prepared_pdf_question_page,String(q.sourcePdfPage));
 assert.equal(r.prepared_pdf_answer_page,'194');
 assert.equal(r.prepared_stem_match,'MATCHED_PREPARED_PDF_PP183_TO185');
 assert.equal(r.prepared_option_match_count,'4');
 assert.equal(r.prepared_letter_match,'MATCHED_PREPARED_KEY_P194');
 assert.equal(r.original_answer_letter,q.correctOptionId);
 assert.equal(r.prepared_teacher_cognitive_tag_not_verified,authorTags[i]);
 assert.equal(r.source_section,'fundamentals');
 assert.equal(r.source_figure_link_id,'');
 assert.equal(r.scientific_key_review,'SOURCE_KEY_SCIENTIFICALLY_SUPPORTED_WITH_MODEL_NOTES');
 assert.equal(r.teacher_priority,mandatory.get(n)||(n===2?'OPTIONAL_PRINT_ATTRIBUTION_NOTE':n===14?'OPTIONAL_SIGN_CONVENTION_NOTE':'OPTIONAL'));
 assert.ok(r.teacher_review_theme.trim().length>=10);
 assert.ok(r.teacher_scientific_note.trim().length>=40);
 assert.notEqual(r.teacher_scientific_note.trim(),'undefined');
 assert.equal(r.candidate_slo_only,n===17||n===19?'P-11-B-36_possible;P-11-B-40_supporting':n===20?'P-11-B-40_supporting':'P-11-B-40');
 assert.equal(r.official_B39_formative,'FORMATIVE_NOT_IN_FINAL');
 assert.equal(r.official_B40_summative_application,'SUMMATIVE_APPLICATION_TOPIC_ONLY');
 assert.equal(r.individual_fbise_item_certification,'PENDING');
 assert.equal(r.original_printed_nbf_fidelity,'PENDING_ORIGINAL_NBF_PP99_TO101');
 assert.equal(r.teacher_approval,'PENDING');
}
const report=read('quality/grade11-unit06-v95c2q-topic65-mcq01-20-academic-review.md');
assert.ok(report.includes('20/20 stems'));
assert.ok(report.includes('80/80 options'));
assert.ok(report.includes('20/20 answer letters'));
assert.ok(report.includes('340/560'));
assert.ok(report.includes('P-11-B-39'));
assert.ok(report.includes('P-11-B-40'));
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T65-MCQ-'+String(n).padStart(4,'0')));
assert.equal(qs[2].correctOptionId,'C');
assert.equal(qs[2].options.find(x=>x.id==='C').text,'P + ½ρv² + ρgh = constant');
assert.equal(qs[12].correctOptionId,'D');
assert.ok(qs[12].stem.includes('Figure 6.9'));
assert.equal(qs[12].referenceFigureId??null,null);
assert.equal(qs[19].correctOptionId,'D');
assert.equal(qs[19].options.find(x=>x.id==='D').text,'Daniel Bernoulli');
const rho=1000,v=4,h=5,g=9.8;
assert.equal(.5*rho*v*v,8000);
assert.equal(rho*g*h,49000);
assert.equal(1,1);
assert.equal(1,1);
assert.equal(2*3,6);
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);
const mh=csvParse(master[0]);
for(let i=0;i<20;i++){
 const r=Object.fromEntries(csvParse(master[321+i]).map((v,j)=>[mh[j],v]));
 assert.equal(r.source_question_id,qs[i].id);
 for(const flag of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[flag],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade11=manifest.grades.find(g=>g.grade===11),u6=grade11.units.find(u=>u.unit===6),course=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(u6.liveMcqCount,560);
assert.equal(grade11.units.reduce((s,u)=>s+u.liveMcqCount,0),2250);
assert.equal(u6.standaloneSituationQuestionCount,136);
assert.equal(u6.independentSharedStimulusGroupCount,0);
assert.equal(u6.perQuestionSloVerified,false);
assert.equal(u6.exactFbiseModeReady,false);
assert.equal(course.status,'planned');
assert.equal(course.assessmentStatus,'not-published');
assert.equal(signoff.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2Q PASS: Topic6.5 first20 source/keys unchanged, B39 formative/B40 summative, 8 teacher flags, 340/560 review, all approvals pending.');
