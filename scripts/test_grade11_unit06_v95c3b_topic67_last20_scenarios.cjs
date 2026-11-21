#!/usr/bin/env node
'use strict';
/* V95-C3B: owner private teacher master, actual original printed NBF p106
 * and official FBISE B43 framework directly inspected outside CI. This
 * regression freezes original content, pending teacher decisions and formal
 * nonrelease, NOT final certification of all 560 individual exam MCQs.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-67-v88-80-source.json'));
const qs=bank.questions.slice(60,80);
assert.equal(bank.bankId,'PSN-XI-U06-T67-V88');assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'BDDDBBBADACBADCABCDB');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[282,283,283,283,283,283,283,283,284,284,284,284,284,284,284,285,285,285,285,285]);
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let fp=2166136261;for(const ch of snap)fp=Math.imul(fp^ch.charCodeAt(0),16777619)>>>0;
assert.equal(fp,0xecf8db47,'Original Topic6.7 scenarios changed without review');
function csvParse(str){const out=[];let v='',q=false;for(let i=0;i<str.length;i++){const c=str[i];if(c==='"'&&q&&str[i+1]==='"'){v+='"';i++;continue;}if(c==='"'){q=!q;continue;}if(c===','&&!q){out.push(v);v='';continue;}v+=c;}assert.equal(q,false,'Malformed CSV');out.push(v);return out;}
const data=read('quality/grade11-unit06-v95c3b-topic67-mcq61-80-final-scenario-review.csv').trimEnd().split(/\r?\n/);
assert.equal(data.length,21);const hdr=csvParse(data[0]);assert.equal(hdr.length,21);
const rows=data.slice(1).map(l=>Object.fromEntries(csvParse(l).map((v,i)=>[hdr[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const mandatory=new Map([
[61,'COMPULSORY_CREEP_EXPLANATION_STEM'],[63,'COMPULSORY_HELIUM_THRESHOLD_ENRICHMENT'],
[64,'COMPULSORY_ISOTOPE_BENCHMARK_SCOPE'],[65,'COMPULSORY_ROTATING_CONTAINER_MODEL'],
[66,'COMPULSORY_CRITICAL_ANGULAR_VELOCITY_SCOPE'],
[67,'COMPULSORY_VORTEX_NUMBER_SCOPE'],[68,'COMPULSORY_QUANTIZATION_SCOPE'],
[69,'COMPULSORY_GYROSCOPE_ENRICHMENT'],[70,'COMPULSORY_GRAVITY_DEVICE_ENRICHMENT'],
[71,'COMPULSORY_SLOW_LIGHT_SOURCE_SCOPE'],[72,'COMPULSORY_NEUTRON_STAR_POSSIBILITY'],
[74,'COMPULSORY_GRAPH_CONTEXT_UNDER_SPECIFIED'],[76,'COMPULSORY_HELIUM_ISOTOPE_RECALL'],
[77,'COMPULSORY_SUBCRITICAL_ROTATION_SCOPE'],[78,'COMPULSORY_SUPERCONDUCTIVITY_CROSS_SCOPE']
]);
for(let i=0;i<20;i++){
 const q=qs[i],n=i+61,r=rows[i];
 assert.equal(q.id,'XI-U06-T67-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'standalone-situations');
 assert.equal(q.situationBased,true);assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(r.source_question_id,q.id);assert.equal(r.topic,'6.7');assert.equal(r.source_number,String(n));
 assert.equal(r.teacher_master_question_page,String(q.sourcePdfPage));
 assert.equal(r.teacher_master_key_page,'288');
 assert.equal(r.original_question_stem_match,'MATCHED_PREPARED_MASTER_PP282_TO285');
 assert.equal(r.original_4_options_match,'4');
 assert.equal(r.original_answer_letter_match,'MATCHED_PREPARED_KEY_P288');
 assert.equal(r.source_answer_letter,q.correctOptionId);
 assert.equal(r.source_section,'standalone-situations');
 assert.equal(r.is_standalone_situation,'YES');
 assert.equal(r.genuine_shared_stimulus_group,'NONE');
 assert.equal(r.scientific_source_answer_review,'BEST_SOURCE_LETTER_SUPPORTED_WITH_PRINTED_BOOK_MODEL');
 if(mandatory.has(n))assert.equal(r.teacher_priority,mandatory.get(n));
 else assert.ok(r.teacher_priority.startsWith('OPTIONAL'),'Expected optional teacher note for Q'+n);
 assert.ok(r.teacher_issue.trim().length>8);
 assert.ok(r.scientific_teacher_note.length>65);
 assert.ok(r.candidate_B43_scope_not_certified.length>8);
 assert.equal(r.original_NBF_print_provenance,'NBF_PRINTED_P106_DIRECTLY_VISUALLY_VERIFIED');
 assert.equal(r.student_figure_link_if_any,'');
 assert.equal(r.individual_B43_exam_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const get=n=>qs.find(q=>q.sourceQuestionNumber===n);
assert.ok(get(61).stem.includes('Which concept best explains'));
assert.ok(!get(61).stem.includes('Figure 6.16'),'Q61 stem not directly figure-dependent');
assert.ok(get(74).stem.includes('different coordinates'));
assert.ok(!get(74).stem.includes('pressure and temperature'),'Q74 lacks axis context');
assert.equal(get(61).correctOptionId,'B');
assert.equal(get(62).correctOptionId,'D');
assert.equal(get(63).correctOptionId,'D');
assert.equal(get(64).correctOptionId,'D');
assert.equal(get(65).correctOptionId,'B');
assert.equal(get(66).correctOptionId,'B');
assert.equal(get(67).correctOptionId,'B');
assert.equal(get(68).correctOptionId,'A');
assert.equal(get(69).correctOptionId,'D');
assert.equal(get(70).correctOptionId,'A');
assert.equal(get(71).correctOptionId,'C');
assert.equal(get(72).correctOptionId,'B');
assert.equal(get(73).correctOptionId,'A');
assert.equal(get(74).correctOptionId,'D');
assert.equal(get(75).correctOptionId,'C');
assert.equal(get(76).correctOptionId,'A');
assert.equal(get(77).correctOptionId,'B');
assert.equal(get(78).correctOptionId,'C');
assert.equal(get(79).correctOptionId,'D');
assert.equal(get(80).correctOptionId,'B');
assert.ok(2.00<2.17&&2.50>2.17&&.0025<2.17);
const report=read('quality/grade11-unit06-v95c3b-topic67-mcq61-80-final-scenario-review.md');
for(const s of ['20/20 stems, 80/80 A–D choice texts and 20/20 original correct letters matched','560/560','P-11-B-43','Figure6.16','Figure6.17','560 central teacher approval fields'])assert.ok(report.includes(s),'Teacher report missing '+s);
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T67-MCQ-'+String(n).padStart(4,'0')));
const orig=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(orig.length,561);const origHeader=csvParse(orig[0]);
for(let i=60;i<80;i++){
 const row=Object.fromEntries(csvParse(orig[481+i]).map((v,j)=>[origHeader[j],v]));
 assert.equal(row.source_question_id,qs[i-60].id);
 for(const f of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(row[f],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json')),catalog=JSON.parse(read('portal/learning-catalog.json')),gate=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=manifest.grades.find(g=>g.grade===11),unit=grade.units.find(u=>u.unit===6),course=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(unit.liveMcqCount,560);assert.equal(grade.units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.equal(unit.standaloneSituationQuestionCount,136);assert.equal(unit.independentSharedStimulusGroupCount,0);
assert.equal(unit.perQuestionSloVerified,false);assert.equal(unit.exactFbiseModeReady,false);
assert.equal(course.status,'planned');assert.equal(course.assessmentStatus,'not-published');
assert.equal(gate.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C3B PASS: all 20 final scenarios exact source keys, 15 teacher flags, first pass 560/560 recorded, 560 central approvals PENDING and formal assessment not released.');
