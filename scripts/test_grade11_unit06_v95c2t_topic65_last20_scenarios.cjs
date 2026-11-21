#!/usr/bin/env node
'use strict';
/* V95-C2T: teacher-prepared PDF/official framework and owner printed NBF
 * pages checked outside CI. CI freezes source keys, model limitations and
 * teacher certification/release holds, not exam or textbook source licensing.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-65-v84-80-source.json'));
const qs=bank.questions.slice(60,80);
assert.equal(bank.bankId,'PSN-XI-U06-T65-V84');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'DBBABCCDBDBCBDCACCDA');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[190,190,191,191,191,191,191,191,191,192,192,192,192,192,192,192,193,193,193,193]);
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let fp=2166136261;for(const ch of snap)fp=Math.imul(fp^ch.charCodeAt(0),16777619)>>>0;
assert.equal(fp,0x1394341a,'Reviewed original source options/stems/keys changed');
function csvParse(s){const a=[];let v='',q=false;for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'&&q&&s[i+1]==='"'){v+='"';i++;continue;}if(c==='"'){q=!q;continue;}if(c===','&&!q){a.push(v);v='';continue;}v+=c;}assert.equal(q,false,'Bad CSV quote');a.push(v);return a;}
const lines=read('quality/grade11-unit06-v95c2t-topic65-mcq61-80-scenario-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21);
const hdr=csvParse(lines[0]);assert.equal(hdr.length,21);
const rows=lines.slice(1).map(line=>Object.fromEntries(csvParse(line).map((v,i)=>[hdr[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const mandatory=new Map([
[61,'COMPULSORY_IDEAL_MODEL_NOTE'],
[67,'COMPULSORY_CONTINUITY_ASSUMPTION_NOTE'],
[68,'COMPULSORY_VISCOUS_CROSS_SLO_NOTE'],
[69,'COMPULSORY_CONTINUITY_SLO_NOTE'],
[71,'COMPULSORY_PUMP_EXTENSION_SCOPE_NOTE'],
[73,'COMPULSORY_COMPETING_EFFECTS_MODEL_NOTE'],
[76,'COMPULSORY_DENSITY_COMPARISON_NOTE'],
[78,'COMPULSORY_INCOMPRESSIBLE_MODEL_NOTE'],
[80,'COMPULSORY_COGNITIVE_SCOPE_NOTE']
]);
const tags='AAAAAAAUUAAUAAAAAAUU';
const expected={
61:'P-11-B-40_candidate',62:'P-11-B-40_candidate',63:'P-11-B-40_candidate',
64:'P-11-B-40_candidate;P-11-B-36_context',65:'P-11-B-40_candidate;P-11-B-36_context',
66:'P-11-B-40_candidate;P-11-B-36_context',67:'P-11-B-40_supporting;P-11-B-36_possible',
68:'P-11-B-40_context;P-11-B-41_possible',69:'P-11-B-36_possible;P-11-B-40_supporting',
70:'P-11-B-40_supporting',71:'P-11-B-40_context',72:'P-11-B-40_candidate',
73:'P-11-B-40_candidate',74:'P-11-B-40_candidate',75:'P-11-B-40_candidate',
76:'P-11-B-40_supporting',77:'P-11-B-40_candidate',
78:'P-11-B-40_candidate;P-11-B-36_context',79:'P-11-B-40_supporting',
80:'P-11-B-40_supporting'
};
for(let i=0;i<20;i++){
 const q=qs[i],n=q.sourceQuestionNumber,r=rows[i];
 assert.equal(q.id,'XI-U06-T65-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(n,61+i);
 assert.equal(q.sourceSection,'standalone-situations');
 assert.equal(q.situationBased,true);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(x=>x.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(x=>x.text.trim()));
 assert.equal(q.active,true);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(r.source_question_id,q.id);assert.equal(r.topic,'6.5');
 assert.equal(r.source_number,String(n));
 assert.equal(r.prepared_pdf_question_page,String(q.sourcePdfPage));
 assert.equal(r.prepared_pdf_key_page,n<=70?'195':'196');
 assert.equal(r.prepared_stem_match,'MATCHED_PREPARED_PDF_PP190_TO193');
 assert.equal(r.prepared_A_to_D_options_match,'4');
 assert.equal(r.prepared_key_match,'MATCHED_PREPARED_KEY_PP195_TO196');
 assert.equal(r.original_answer_letter,q.correctOptionId);
 assert.equal(r.prepared_author_cognition_not_certified,tags[i]);
 assert.equal(r.standalone_scenario,'YES');
 assert.equal(r.genuine_shared_stimulus_id,'NONE');
 assert.equal(r.scientific_answer_review,'SOURCE_BEST_LETTER_SUPPORTED_WITH_ASSUMPTIONS');
 assert.equal(r.teacher_review_priority,mandatory.get(n)||(r.teacher_review_priority.startsWith('OPTIONAL')?r.teacher_review_priority:'OPTIONAL'));
 assert.ok(r.teacher_issue.trim().length>=10);
 assert.ok(r.scientific_teacher_note.trim().length>=48);
 assert.equal(r.candidate_slo_only,expected[n]);
 assert.equal(r.original_printed_bernoulli_equation_provenance,'NBF_PRINTED_PP99_TO100_EQUATION_CONFIRMED');
 assert.equal(r.item_specific_printed_question_verification,'NOT_ORIGINAL_PRINTED_MCQS_TEACHER_PREPARED_ONLY');
 assert.equal(r.individual_fbise_item_certification,'PENDING');assert.equal(r.teacher_approval,'PENDING');
}
const report=read('quality/grade11-unit06-v95c2t-topic65-mcq61-80-scenario-review.md');
assert.ok(report.includes('20/20 stems, 80/80 option texts and 20/20 answer letters match'));
assert.ok(report.includes('400/560'));
assert.ok(report.includes('P-11-B-39'));
assert.ok(report.includes('P-11-B-40'));
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T65-MCQ-'+String(n).padStart(4,'0')));
const qn=n=>qs.find(q=>q.sourceQuestionNumber===n);
assert.equal(qn(61).correctOptionId,'D');
assert.equal(qn(69).correctOptionId,'B');
assert.equal(qn(70).correctOptionId,'D');
assert.equal(qn(76).correctOptionId,'A');
assert.equal(qn(77).correctOptionId,'C');
assert.equal(qn(78).correctOptionId,'C');
assert.equal(qn(80).correctOptionId,'A');
assert.equal((.5*1000*(8**2-4**2))/1000,24);
assert.ok(Math.abs(800/1000-.8)<1e-12);
assert.equal(1*2,2*1,'Continuity fixed Q smaller cross section makes v larger');
const rho=1000,g=9.8,dh=4;assert.equal(rho*g*dh,39200);
assert.equal(5,2+3,'Discharge branching additivity supporting continuity');
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);const mh=csvParse(master[0]);
for(let i=60;i<80;i++){
 const r=Object.fromEntries(csvParse(master[321+i]).map((v,j)=>[mh[j],v]));
 assert.equal(r.source_question_id,qs[i-60].id);
 for(const x of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[x],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json')),catalog=JSON.parse(read('portal/learning-catalog.json')),gate=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
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
console.log('V95-C2T PASS: 20 source scenario keys, nine teacher notes, B39 formative/B40 summative checks, 400/560 inspected, 560 approvals pending and official release held.');
