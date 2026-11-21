#!/usr/bin/env node
'use strict';
/* V95-C2Y: prepared private master PDF, owner's original NBF printed p106
 * and the original FBISE framework p12 were directly opened outside CI.
 * CI freezes public original questions/choices/letters and teacher release
 * holds, not individual item board certification or portal figure delivery.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-67-v88-80-source.json'));
const qs=bank.questions.slice(0,20);
assert.equal(bank.bankId,'PSN-XI-U06-T67-V88');
assert.equal(bank.questions.length,80);assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'ABABBCDABCCDDDDBACDC');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[274,274,274,274,274,275,275,275,275,275,275,275,276,276,276,276,276,276,276,277]);
const snapshot=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let fp=2166136261;for(const c of snapshot)fp=Math.imul(fp^c.charCodeAt(0),16777619)>>>0;
assert.equal(fp,0xe21f2607,'Original first20 source stems/options/answer letters unexpectedly changed');
function csvParse(s){const out=[];let v='',q=false;for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'&&q&&s[i+1]==='"'){v+='"';i++;continue;}if(c==='"'){q=!q;continue;}if(c===','&&!q){out.push(v);v='';continue;}v+=c;}assert.equal(q,false,'Unbalanced CSV quotes');out.push(v);return out;}
const data=read('quality/grade11-unit06-v95c2y-topic67-mcq01-20-academic-review.csv').trimEnd().split(/\r?\n/);
assert.equal(data.length,21);const hdr=csvParse(data[0]);assert.equal(hdr.length,20);
const rows=data.slice(1).map(s=>Object.fromEntries(csvParse(s).map((v,i)=>[hdr[i],v])));
assert.equal(new Set(rows.map(x=>x.source_question_id)).size,20);
const mandatory=new Map([
[1,'COMPULSORY_B43_UNDERSTANDING_DEPTH'],[2,'COMPULSORY_B43_UNDERSTANDING_DEPTH'],
[5,'COMPULSORY_FIGURE_616_LINK'],[8,'COMPULSORY_BENCHMARK_AND_COGNITION'],
[9,'COMPULSORY_BENCHMARK_AND_COGNITION'],[10,'COMPULSORY_FIGURE_617_AND_COGNITION'],
[11,'COMPULSORY_FIGURE_617_AND_COGNITION'],[12,'COMPULSORY_FIGURE_617_AND_COGNITION'],
[17,'COMPULSORY_ENRICHMENT_APPLICATION_SCOPE'],[18,'COMPULSORY_ENRICHMENT_APPLICATION_SCOPE'],
[19,'COMPULSORY_ENRICHMENT_CLAIM_SCOPE'],[20,'COMPULSORY_ENRICHMENT_AND_QUALIFICATION']
]);
for(let i=0;i<20;i++){
 const q=qs[i],n=i+1,r=rows[i];
 assert.equal(q.id,'XI-U06-T67-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'fundamentals');
 assert.equal(q.situationBased,false);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.7');assert.equal(r.source_number,String(n));
 assert.equal(r.teacher_master_question_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.teacher_master_key_pdf_page,'286');
 assert.equal(r.source_stem_match,'MATCHED_PREPARED_MASTER_PP274_TO277');
 assert.equal(r.source_A_to_D_match_count,'4');
 assert.equal(r.source_key_letter_match,'MATCHED_PREPARED_MASTER_KEY_P286');
 assert.equal(r.original_answer_letter,q.correctOptionId);
 assert.equal(r.individual_author_cognitive_tag_present,'NO_ITEM_TAG_IN_SOURCE_KEY');
 assert.equal(r.scientific_key_status,'SOURCE_BEST_LETTER_SUPPORTED_WITH_SOURCE_CONTEXT');
 if(mandatory.has(n))assert.equal(r.teacher_review_priority,mandatory.get(n));
 else assert.ok(r.teacher_review_priority.startsWith('OPTIONAL'),'Unexpected priority for Q'+n);
 assert.ok(r.teacher_issue.trim().length>8);
 assert.ok(r.teacher_scientific_note.trim().length>=60);
 assert.ok(r.candidate_SLO_depth_not_certified.length>=10);
 assert.equal(r.printed_original_NBF_topic_page,'PRINTED_NBF_P106_VISUALLY_CONFIRMED');
 assert.equal(r.source_reference_figure_link_id,'');
 assert.equal(r.figures_616_617_student_render_verified,'PENDING');
 assert.equal(r.individual_board_exam_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
for(const n of [5,10,11,12])assert.equal(qs[n-1].referenceFigureId??null,null);
assert.equal(qs[4].correctOptionId,'B');
assert.ok(qs[4].stem.includes('Figure 6.16'));
assert.ok(qs[9].stem.includes('Figure 6.17'));
assert.equal(qs[7].options.find(o=>o.id==='A').text,'2.17 K.');
assert.equal(qs[8].options.find(o=>o.id==='B').text,'0.0025 K.');
assert.equal(qs[9].options.find(o=>o.id==='C').text,'Kelvin (K).');
assert.equal(qs[10].options.find(o=>o.id==='C').text,'Pressure in MPa.');
assert.equal(qs[11].correctOptionId,'D');
assert.equal(qs[13].correctOptionId,'D');
assert.equal(qs[14].correctOptionId,'D');
assert.equal(qs[17].correctOptionId,'C');
assert.equal(qs[18].correctOptionId,'D');
assert.equal(qs[19].correctOptionId,'C');
assert.equal(0.0025*1000,2.5,'He3 critical benchmark conversion: K to mK');
assert.ok(2.17>0.0025,'He4 and He3 reported thresholds are distinct');
const report=read('quality/grade11-unit06-v95c2y-topic67-mcq01-20-academic-review.md');
for(const s of ['20/20 stems, 80/80 A–D option texts, 20/20 correct source letter matches','500/560','P-11-B-43','Figure6.16','Figure6.17','MPa'])assert.ok(report.includes(s),'Teacher report missing '+s);
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T67-MCQ-'+String(n).padStart(4,'0')));
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);const qh=csvParse(master[0]);
for(let i=0;i<20;i++){
 const r=Object.fromEntries(csvParse(master[481+i]).map((v,j)=>[qh[j],v]));
 assert.equal(r.source_question_id,qs[i].id);
 for(const key of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[key],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const gate=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=manifest.grades.find(g=>g.grade===11),unit=grade.units.find(u=>u.unit===6),course=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(unit.liveMcqCount,560);
assert.equal(grade.units.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
assert.equal(unit.standaloneSituationQuestionCount,136);
assert.equal(unit.independentSharedStimulusGroupCount,0);
assert.equal(unit.perQuestionSloVerified,false);
assert.equal(unit.exactFbiseModeReady,false);
assert.equal(course.status,'planned');
assert.equal(course.assessmentStatus,'not-published');
assert.equal(gate.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2Y PASS: superfluidity first20 source letters/options, 12 teacher priorities, actual original NBF p106, B43 Understanding, 500/560 reviewed, release remains held.');
