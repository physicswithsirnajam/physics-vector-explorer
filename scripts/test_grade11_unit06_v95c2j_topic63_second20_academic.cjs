#!/usr/bin/env node
'use strict';
/* V95-C2J: compares the GitHub source 20-item snapshot to educator-reviewed
 * prepared-PDF evidence (PDF not available inside CI). Does not independently
 * verify the printed NBF textbook or certify official item-level FBISE eligibility.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-63-v80-80-source.json'));
const qs=bank.questions.slice(20,40);
assert.equal(bank.bankId,'PSN-XI-U06-T63-V80');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'ADDBCBBADDABACCBDDCD','Original teacher-prepared p109-110 source keys');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[101,101,101,101,101,102,102,102,102,102,102,102,102,102,103,103,103,103,103,103]);
for(let i=0;i<qs.length;i++){
 const q=qs[i],n=21+i;
 assert.equal(q.id,'XI-U06-T63-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'reasoning');
 assert.equal(q.situationBased,false);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,n===24?'unit6-figure66':null);
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
for(const ch of snapshot)fp=Math.imul(fp^ch.charCodeAt(0),16777619)>>>0;
assert.equal(fp,0xe39ff090,'Student source stem, A–D option or original key changed since source comparison');
function csvParse(line){
 let cur='',quoted=false;const fields=[];
 for(let i=0;i<line.length;i++){
  const c=line[i];
  if(c==='"'&&quoted&&line[i+1]==='"'){cur+='"';i++;continue;}
  if(c==='"'){quoted=!quoted;continue;}
  if(c===','&&!quoted){fields.push(cur);cur='';continue;}
  cur+=c;
 }
 assert.equal(quoted,false,'CSV quote malformed');
 fields.push(cur);return fields;
}
const lines=read('quality/grade11-unit06-v95c2j-topic63-mcq21-40-academic-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21,'20 individual MCQ rows and header');
const head=csvParse(lines[0]);assert.equal(head.length,18);
const rows=lines.slice(1).map(l=>Object.fromEntries(csvParse(l).map((v,i)=>[head[i],v])));
assert.equal(new Set(rows.map(x=>x.source_question_id)).size,20);
const mandatory=new Map([
 [24,'COMPULSORY_FIGURE_SOURCE_REVIEW'],
 [25,'COMPULSORY_FLOW_PROFILE_NOTE'],
 [31,'COMPULSORY_SLO_SCOPE_NOTE'],
 [32,'COMPULSORY_SLO_SCOPE_NOTE'],
 [33,'COMPULSORY_PRINT_AND_SLO_NOTE'],
 [36,'COMPULSORY_SLO_SCOPE_AND_CONTEXT_NOTE']
]);
for(let i=0;i<20;i++){
 const n=i+21,r=rows[i],q=qs[i];
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.source_number,String(n));
 assert.equal(r.topic,'6.3');
 assert.equal(r.prepared_question_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.prepared_answer_pdf_page,n===21?'109':'110');
 assert.equal(r.source_stem_four_options_letter_match,'MATCHED_PREPARED_PDF_PP101_TO103_AND_KEY_PP109_TO110');
 assert.equal(r.original_correct_letter,q.correctOptionId);
 assert.equal(r.source_question_section,'reasoning');
 assert.equal(r.linked_figure_id,q.referenceFigureId??'');
 assert.equal(r.scientific_source_key_assessment,'SOURCE_KEY_SUPPORTED_WITH_EXPLICIT_ASSUMPTIONS');
 assert.equal(r.amendment_priority,mandatory.get(n)||'OPTIONAL');
 assert.ok(r.scientific_review_theme.length>10);
 assert.ok(r.teacher_note.length>75);
 assert.notEqual(r.teacher_note.trim(),'undefined','Teacher note must not be an undefined placeholder');
 const candidate=n===36?'P-11-B-41;P-11-B-35':n>=31&&n<=33?'P-11-B-35;P-11-B-42':'P-11-B-35';
 assert.equal(r.candidate_topic_slo_only,candidate);
 assert.ok(['Knowledge','Understanding'].includes(r.candidate_cognitive_not_certified));
 assert.equal(r.original_printed_nbf_fidelity,'PENDING_ORIGINAL_NBF_PP95_TO96');
 assert.equal(r.individual_slo_cognitive_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const report=read('quality/grade11-unit06-v95c2j-topic63-mcq21-40-academic-review.md');
assert.ok(report.includes('20/20 matching stems'));
assert.ok(report.includes('80/80 matching options'));
assert.ok(report.includes('20/20 matching answer letters'));
assert.ok(report.includes('Summative / Knowledge + Understanding'));
assert.ok(report.includes('200/560'));
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T63-MCQ-'+String(n).padStart(4,'0')));
assert.equal(qs.find(q=>q.sourceQuestionNumber===24).referenceFigureId,'unit6-figure66');
assert.equal(qs.find(q=>q.sourceQuestionNumber===24).correctOptionId,'B');
assert.equal(qs.find(q=>q.sourceQuestionNumber===25).correctOptionId,'C');
assert.equal(qs.find(q=>q.sourceQuestionNumber===32).correctOptionId,'B');
assert.equal(qs.find(q=>q.sourceQuestionNumber===36).correctOptionId,'B');
assert.equal(qs.find(q=>q.sourceQuestionNumber===40).correctOptionId,'D');
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);
const mh=csvParse(master[0]);
for(let i=20;i<40;i++){
 const m=Object.fromEntries(csvParse(master[161+i]).map((v,j)=>[mh[j],v]));
 assert.equal(m.source_question_id,qs[i-20].id);
 for(const status of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(m[status],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade11=manifest.grades.find(x=>x.grade===11);
const unit6=grade11.units.find(x=>x.unit===6);
const course=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===6);
assert.equal(unit6.liveMcqCount,560);
assert.equal(grade11.units.reduce((s,x)=>s+x.liveMcqCount,0),2250);
assert.equal(unit6.standaloneSituationQuestionCount,136);
assert.equal(unit6.independentSharedStimulusGroupCount,0);
assert.equal(unit6.perQuestionSloVerified,false);
assert.equal(unit6.exactFbiseModeReady,false);
assert.equal(course.status,'planned');
assert.equal(course.assessmentStatus,'not-published');
assert.equal(signoff.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2J PASS: Topic6.3 MCQs 21-40 source keys and Figure66 locked, six teacher notes, 200/560 inspected, master approvals pending and course release held.');
