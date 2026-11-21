#!/usr/bin/env node
'use strict';
/* V95-C2Z: teacher's master PDF and NBF printed p106 and official FBISE B43
 * framework read outside CI. This test freezes source content, teacher notes,
 * original 560-row pending approvals, and original nonrelease controls.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-67-v88-80-source.json'));
const qs=bank.questions.slice(20,40);
assert.equal(bank.bankId,'PSN-XI-U06-T67-V88');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'AAABCDAACCCCCDACDABB');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[277,277,277,277,277,277,278,278,278,278,278,278,278,279,279,279,279,279,279,279]);
const snapshot=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let hash=2166136261;for(const ch of snapshot)hash=Math.imul(hash^ch.charCodeAt(0),16777619)>>>0;
assert.equal(hash,0x2fa97dcf,'Reviewed source stems/options/correct letters unexpectedly changed');
function csvParse(s){const a=[];let v='',quoted=false;for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'&&quoted&&s[i+1]==='"'){v+='"';i++;continue;}if(c==='"'){quoted=!quoted;continue;}if(c===','&&!quoted){a.push(v);v='';continue;}v+=c;}assert.equal(quoted,false,'Bad CSV quotation');a.push(v);return a;}
const lines=read('quality/grade11-unit06-v95c2z-topic67-mcq21-40-conceptual-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21);const hdr=csvParse(lines[0]);assert.equal(hdr.length,20);
const rows=lines.slice(1).map(l=>Object.fromEntries(csvParse(l).map((v,i)=>[hdr[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const mandatory=new Map([
[24,'COMPULSORY_CIRCULAR_CAUSE_STEM'],
[28,'COMPULSORY_FIGURE_617_LINK_AND_SCOPE'],
[30,'COMPULSORY_ISOTOPE_ENRICHMENT_SLO'],
[31,'COMPULSORY_VORTEX_THRESHOLD_COGNITIVE_SCOPE'],
[32,'COMPULSORY_ROTATING_CONTAINER_MODEL'],
[34,'COMPULSORY_QUANTIZATION_OUTSIDE_EXPLICIT_B43'],
[36,'COMPULSORY_SUPERCONDUCTIVITY_SCOPE'],
[37,'COMPULSORY_PHASE_DIAGRAM_SCOPE'],
[38,'COMPULSORY_HELIUM_COOLING_PHYSICS_SCOPE']
]);
for(let i=0;i<20;i++){
 const q=qs[i],n=i+21,r=rows[i];
 assert.equal(q.id,'XI-U06-T67-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'reasoning');
 assert.equal(q.situationBased,false);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(x=>x.text.trim()));
 assert.equal(q.active,true);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(r.source_question_id,q.id);assert.equal(r.topic,'6.7');
 assert.equal(r.source_number,String(n));
 assert.equal(r.prepared_pdf_question_page,String(q.sourcePdfPage));
 assert.equal(r.prepared_pdf_key_page,n<=24?'286':'287');
 assert.equal(r.prepared_stem_match,'MATCHED_PREPARED_MASTER_PP277_TO279');
 assert.equal(r.prepared_options_match_count,'4');
 assert.equal(r.prepared_answer_letter_match,'MATCHED_PREPARED_KEY_PP286_TO287');
 assert.equal(r.original_correct_option,q.correctOptionId);
 assert.equal(r.source_author_individual_cognitive_tag,'NONE_IN_MASTER_KEY_ROWS');
 assert.equal(r.scientific_letter_review,'SOURCE_KEY_SUPPORTED_WITH_TEXTBOOK_MODEL_SCOPE');
 if(mandatory.has(n)) assert.equal(r.teacher_priority,mandatory.get(n));
 else assert.ok(r.teacher_priority.startsWith('OPTIONAL'),'Expected optional note Q'+n);
 assert.ok(r.teacher_issue.trim().length>8);
 assert.ok(r.scientific_teacher_note.trim().length>=65);
 assert.ok(r.candidate_official_slo_scope_not_certified.length>8);
 assert.equal(r.actual_original_NBF_source_page,'PRINTED_NBF_P106_VISUALLY_VERIFIED');
 assert.equal(r.figure_link_in_public_bank,'');
 assert.equal(r.student_figure_delivery_verified,'PENDING');
 assert.equal(r.individual_fbise_exam_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const by=n=>qs.find(q=>q.sourceQuestionNumber===n);
assert.equal(by(24).correctOptionId,'B');
assert.equal(by(28).correctOptionId,'A');
assert.ok(by(27).stem.includes('loss of kinetic energy'));
assert.ok(by(28).stem.includes('Figure 6.17'));
assert.equal(by(28).referenceFigureId??null,null);
assert.ok(!by(37).stem.includes('Figure 6.17'),'Q37 is self-contained, not figure-link dependent');
assert.equal(by(31).correctOptionId,'C');
assert.equal(by(32).correctOptionId,'C');
assert.equal(by(34).correctOptionId,'D');
assert.equal(by(36).correctOptionId,'C');
assert.equal(by(38).correctOptionId,'A');
assert.equal(by(39).correctOptionId,'B');
assert.equal(by(40).correctOptionId,'B');
const report=read('quality/grade11-unit06-v95c2z-topic67-mcq21-40-conceptual-review.md');
for(const term of ['20/20 matching stems, 80/80 A–D choice texts, and 20/20 original key letters','520/560','P-11-B-43','Figure6.17','compression'])assert.ok(report.includes(term),'Report is missing '+term);
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T67-MCQ-'+String(n).padStart(4,'0')));
const original=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(original.length,561);const fields=csvParse(original[0]);
for(let i=20;i<40;i++){
 const row=Object.fromEntries(csvParse(original[481+i]).map((v,j)=>[fields[j],v]));
 assert.equal(row.source_question_id,qs[i-20].id);
 for(const field of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(row[field],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json')),catalog=JSON.parse(read('portal/learning-catalog.json')),gate=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=manifest.grades.find(x=>x.grade===11),unit=grade.units.find(x=>x.unit===6),course=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===6);
assert.equal(unit.liveMcqCount,560);
assert.equal(grade.units.reduce((s,u)=>s+u.liveMcqCount,0),2250);
assert.equal(unit.standaloneSituationQuestionCount,136);
assert.equal(unit.independentSharedStimulusGroupCount,0);
assert.equal(unit.perQuestionSloVerified,false);
assert.equal(unit.exactFbiseModeReady,false);
assert.equal(course.status,'planned');
assert.equal(course.assessmentStatus,'not-published');
assert.equal(gate.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2Z PASS: Topic6.7 Q21–40 20 source keys, nine teacher flags, original NBF p106 and B43 scope, 520/560 inspected, 560 approvals pending and formal assessment held.');
