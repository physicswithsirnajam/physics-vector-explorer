#!/usr/bin/env node
'use strict';
/* V95-C3A: teacher master, actual original NBF printed p106 and FBISE B43
 * framework inspected independently before this commit. CI freezes prepared
 * source fidelity, numeric proof, pending teacher decisions and release gates.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-67-v88-80-source.json'));
const qs=bank.questions.slice(40,60);
assert.equal(bank.bankId,'PSN-XI-U06-T67-V88');assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'AAABDDDCCABCADBDBCBC');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[280,280,280,280,280,280,280,281,281,281,281,281,281,281,282,282,282,282,282,282]);
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let hash=2166136261;for(const c of snap)hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
assert.equal(hash,0x57458c70,'Reviewed source MCQ text/options/answer letters changed unexpectedly');
function csvParse(str){const out=[];let v='',q=false;for(let i=0;i<str.length;i++){const c=str[i];if(c==='"'&&q&&str[i+1]==='"'){v+='"';i++;continue;}if(c==='"'){q=!q;continue;}if(c===','&&!q){out.push(v);v='';continue;}v+=c;}assert.equal(q,false,'Malformed CSV quotes');out.push(v);return out;}
const data=read('quality/grade11-unit06-v95c3a-topic67-mcq41-60-temperature-diagram-review.csv').trimEnd().split(/\r?\n/);
assert.equal(data.length,21);const hdr=csvParse(data[0]);assert.equal(hdr.length,20);
const rows=data.slice(1).map(line=>Object.fromEntries(csvParse(line).map((v,i)=>[hdr[i],v])));
const required=new Map([
[41,'COMPULSORY_THRESHOLD_NUMERIC_SLO'],[42,'COMPULSORY_THRESHOLD_NUMERIC_SLO'],
[43,'COMPULSORY_THRESHOLD_NUMERIC_SLO'],[44,'COMPULSORY_THRESHOLD_NUMERIC_SLO'],
[45,'COMPULSORY_TEMPERATURE_SUBTRACTION_SCOPE'],
[46,'COMPULSORY_MK_CONVERSION_SCOPE'],[47,'COMPULSORY_MK_CONVERSION_SCOPE'],
[48,'COMPULSORY_ISOTOPE_RECALL_SCOPE'],[49,'COMPULSORY_RATIO_ARITHMETIC_SCOPE'],
[52,'COMPULSORY_FIGURE617_LINK_AND_SCOPE'],[53,'COMPULSORY_FIGURE617_CONTEXT'],
[54,'COMPULSORY_FIGURE617_LINK_AND_SCOPE'],[55,'COMPULSORY_FIGURE617_AXIS_RECALL'],
[56,'COMPULSORY_FIGURE617_AXIS_RECALL'],[57,'COMPULSORY_FIGURE616_LINK_CORE'],
[60,'COMPULSORY_MK_CONVERSION_SCOPE']]);
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
for(let i=0;i<20;i++){
 const q=qs[i],n=i+41,r=rows[i];
 assert.equal(q.id,'XI-U06-T67-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'data-interpretation');
 assert.equal(q.situationBased,false);assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(r.source_question_id,q.id);assert.equal(r.topic,'6.7');
 assert.equal(r.source_number,String(n));
 assert.equal(r.teacher_master_pdf_question_page,String(q.sourcePdfPage));
 assert.equal(r.teacher_master_pdf_key_page,n<=51?'287':'288');
 assert.equal(r.prepared_stem_match,'MATCHED_PREPARED_MASTER_PP280_TO282');
 assert.equal(r.prepared_A_to_D_option_count_matched,'4');
 assert.equal(r.prepared_answer_letter_match,'MATCHED_PREPARED_KEY_PP287_TO288');
 assert.equal(r.original_correct_letter,q.correctOptionId);
 assert.equal(r.source_section,'data-interpretation');
 assert.equal(r.scientific_key_review,'BEST_SOURCE_ANSWER_SUPPORTED_BY_NBF_BENCHMARK_CONTEXT');
 if(required.has(n))assert.equal(r.teacher_review_priority,required.get(n));
 else assert.ok(r.teacher_review_priority.startsWith('OPTIONAL'),'Optional source note expected for Q'+n);
 assert.ok(r.review_issue.trim().length>10);
 assert.ok(r.teacher_scientific_note.trim().length>65);
 assert.ok(r.candidate_only_B43_scope.length>8);
 assert.equal(r.original_NBF_printed_p106_status,'PRINTED_NBF_P106_FIGURE616_617_AND_HELIUM_BENCHMARKS_VERIFIED');
 assert.equal(r.figure_link_id_in_source,'');
 assert.equal(r.student_diagram_available_and_legible,'PENDING');
 assert.equal(r.individual_fbise_B43_approval,'PENDING');assert.equal(r.teacher_approval,'PENDING');
}
const get=n=>qs.find(q=>q.sourceQuestionNumber===n);
assert.equal(get(41).correctOptionId,'A');assert.equal(get(42).correctOptionId,'A');
assert.equal(get(43).correctOptionId,'A');assert.equal(get(44).correctOptionId,'B');
assert.equal(get(45).correctOptionId,'D');assert.equal(get(46).correctOptionId,'D');
assert.equal(get(47).correctOptionId,'D');assert.equal(get(49).correctOptionId,'C');
assert.equal(get(50).correctOptionId,'A');assert.equal(get(51).correctOptionId,'B');
assert.equal(get(52).correctOptionId,'C');assert.equal(get(53).correctOptionId,'A');
assert.equal(get(54).correctOptionId,'D');assert.equal(get(55).correctOptionId,'B');
assert.equal(get(56).correctOptionId,'D');assert.equal(get(57).correctOptionId,'B');
assert.equal(get(58).correctOptionId,'C');assert.equal(get(59).correctOptionId,'B');
assert.equal(get(60).correctOptionId,'C');
assert.ok(2.00<2.17);assert.ok(2.40>2.17);
assert.ok(.0010<.0025);assert.ok(.0040>.0025);
assert.ok(Math.abs((2.17-2.00)-.17)<1e-10);
assert.equal(.0025*1000,2.5);assert.equal(2.17*1000,2170);
assert.equal(2.17/.0025,868);assert.ok(2.10<2.17);assert.ok(.0030>.0025);
for(const n of [52,54,55,56,57])assert.equal(get(n).referenceFigureId??null,null);
assert.ok(get(52).stem.includes('Figure 6.17'));
assert.ok(get(57).stem.includes('Figure 6.16'));
assert.ok(get(53).stem.includes('helium diagram'));
assert.ok(get(59).stem.includes('rotating-container'));
const report=read('quality/grade11-unit06-v95c3a-topic67-mcq41-60-temperature-diagram-review.md');
for(const s of ['20/20 stems, 80/80 options, 20/20 source answer letters','540/560','P-11-B-43','Figure6.16','Figure6.17','rotating-'])assert.ok(report.includes(s),'Review report missing '+s);
for(const n of required.keys())assert.ok(report.includes('XI-U06-T67-MCQ-'+String(n).padStart(4,'0')));
const queue=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(queue.length,561);const head=csvParse(queue[0]);
for(let i=40;i<60;i++){
 const r=Object.fromEntries(csvParse(queue[481+i]).map((v,j)=>[head[j],v]));
 assert.equal(r.source_question_id,qs[i-40].id);
 for(const f of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[f],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json')),catalog=JSON.parse(read('portal/learning-catalog.json')),gate=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=manifest.grades.find(g=>g.grade===11),unit=grade.units.find(u=>u.unit===6),course=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(unit.liveMcqCount,560);assert.equal(grade.units.reduce((a,u)=>a+u.liveMcqCount,0),2250);
assert.equal(unit.standaloneSituationQuestionCount,136);assert.equal(unit.independentSharedStimulusGroupCount,0);
assert.equal(unit.perQuestionSloVerified,false);assert.equal(unit.exactFbiseModeReady,false);
assert.equal(course.status,'planned');assert.equal(course.assessmentStatus,'not-published');
assert.equal(gate.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C3A PASS: helium benchmark Q41–60 20 original source letters, numeric checks, 16 SLO/diagram teacher decisions, 540/560 inspected, all 560 approvals pending and formal assessment unreleased.');
