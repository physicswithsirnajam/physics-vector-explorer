#!/usr/bin/env node
'use strict';
/* V95-C2R: private teacher-prepared PDF and official framework reopened outside
 * CI; this test locks original public question metadata, answer key, academic
 * review and non-release controls, not printed NBF or board certification.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-65-v84-80-source.json'));
const qs=bank.questions.slice(20,40);
assert.equal(bank.bankId,'PSN-XI-U06-T65-V84');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'CDDABCDACCADBDDAABDA');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[185,185,185,186,186,186,186,186,186,186,186,187,187,187,187,187,187,187,187,188]);
for(let i=0;i<20;i++){
 const q=qs[i],n=i+21;
 assert.equal(q.id,'XI-U06-T65-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'reasoning');
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
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let fp=2166136261;for(const ch of snap)fp=Math.imul(fp^ch.charCodeAt(0),16777619)>>>0;
assert.equal(fp,0x64b42689,'Existing source stem/option/answer unexpectedly altered');
function csvParse(s){
 const a=[];let v='',quoted=false;
 for(let i=0;i<s.length;i++){
  const c=s[i];if(c==='"'&&quoted&&s[i+1]==='"'){v+='"';i++;continue;}
  if(c==='"'){quoted=!quoted;continue;}if(c===','&&!quoted){a.push(v);v='';continue;}v+=c;
 }
 assert.equal(quoted,false,'Unbalanced CSV quotation');a.push(v);return a;
}
const lines=read('quality/grade11-unit06-v95c2r-topic65-mcq21-40-conceptual-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21);
const hdr=csvParse(lines[0]);assert.equal(hdr.length,22);
const rows=lines.slice(1).map(l=>Object.fromEntries(csvParse(l).map((v,i)=>[hdr[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const mandatory=new Map([
 [21,'COMPULSORY_B39_B40_SCOPE_NOTE'],
 [25,'COMPULSORY_IDEAL_ASSUMPTION_NOTE'],
 [26,'COMPULSORY_MODEL_AND_CONTINUITY_NOTE'],
 [31,'COMPULSORY_NONIDEAL_SCOPE_NOTE'],
 [32,'COMPULSORY_EXTERNAL_WORK_SCOPE_NOTE'],
 [34,'COMPULSORY_COGNITIVE_SCOPE_NOTE'],
 [35,'COMPULSORY_COGNITIVE_SCOPE_NOTE'],
 [39,'COMPULSORY_COGNITIVE_SCOPE_NOTE'],
 [40,'COMPULSORY_COGNITIVE_SCOPE_NOTE']
]);
const authors='UUUUAAUAUAUAUAAUAAUU';
for(let i=0;i<20;i++){
 const q=qs[i],n=q.sourceQuestionNumber,r=rows[i];
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.5');
 assert.equal(r.source_number,String(n));
 assert.equal(r.prepared_pdf_question_page,String(q.sourcePdfPage));
 assert.equal(r.prepared_pdf_answer_page,n<=33?'194':'195');
 assert.equal(r.prepared_stem_match,'MATCHED_PREPARED_PDF_PP185_TO188');
 assert.equal(r.prepared_option_match_count,'4');
 assert.equal(r.prepared_letter_match,'MATCHED_PREPARED_KEY_PP194_TO195');
 assert.equal(r.source_answer_letter,q.correctOptionId);
 assert.equal(r.prepared_author_KUA_tag_not_certified,authors[i]);
 assert.equal(r.source_section,'reasoning');
 assert.equal(r.scientific_answer_evaluation,'SOURCE_KEY_SCIENTIFICALLY_SUPPORTED_INTENDED_MODEL');
 assert.equal(r.teacher_priority,mandatory.get(n)||'OPTIONAL');
 assert.ok(r.teacher_issue.trim().length>10);
 assert.ok(r.teacher_scientific_note.trim().length>45);
 assert.notEqual(r.teacher_scientific_note.trim(),'undefined');
 const cand=([25,26].includes(n))?'P-11-B-40_candidate;P-11-B-36_context':
 ([31].includes(n))?'P-11-B-40_candidate;P-11-B-41_context':
 ([34,35,36,39,40].includes(n))?'P-11-B-40_supporting':'P-11-B-40_candidate';
 assert.equal(r.candidate_outcome_not_certified,cand);
 assert.equal(r.cognitive_review_note,n===34||n===35?'Application_author_tag':authors[i]==='A'?'Application':authors[i]==='U'?'Understanding':'Knowledge');
 assert.equal(r.official_B39_status,'FORMATIVE_EXCLUDED_FROM_FINAL');
 assert.equal(r.official_B40_status,'SUMMATIVE_APPLICATION_TOPIC_ONLY');
 assert.equal(r.original_printed_nbf_fidelity,'PENDING_NBF_PP99_TO101');
 assert.equal(r.individual_item_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const report=read('quality/grade11-unit06-v95c2r-topic65-mcq21-40-conceptual-review.md');
assert.ok(report.includes('20/20 stems, 80/80 options and 20/20 original answer letters match'));
assert.ok(report.includes('360/560'));
assert.ok(report.includes('P-11-B-39'));
assert.ok(report.includes('P-11-B-40'));
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T65-MCQ-'+String(n).padStart(4,'0')));
const at=n=>qs.find(q=>q.sourceQuestionNumber===n);
assert.equal(at(21).correctOptionId,'C');
assert.equal(at(25).correctOptionId,'B');
assert.equal(at(26).correctOptionId,'C');
assert.equal(at(37).correctOptionId,'A');
assert.equal(at(37).options.find(o=>o.id==='A').text,'½ρ(v₂² − v₁²)');
assert.equal(at(39).correctOptionId,'D');
assert.equal(at(40).correctOptionId,'A');
const rho=1000,v1=2,v2=6;
const p1=120000,p2=p1+.5*rho*(v1*v1-v2*v2);
assert.equal(p2,104000);
assert.equal(p1-p2,.5*rho*(v2*v2-v1*v1),'Correct horizontal Bernoulli pressure-sign convention');
assert.equal(at(23).correctOptionId,'D');
assert.equal(at(24).correctOptionId,'A');
const g=9.8,dh=3;
assert.ok(Math.abs((-rho*g*dh)+29400)<1e-8,'At fixed speed, rising 3 m reduces pressure by 29.4 kPa');
assert.ok(Math.abs((rho*g*dh)-29400)<1e-8,'At fixed speed, descending 3 m increases pressure by 29.4 kPa');
assert.equal((2*2)**2/(2**2),4,'Energy density changes quadratically with speed');
assert.equal(.5*(2*rho)*v1*v1,2*(.5*rho*v1*v1),'Density scaling at fixed speed');
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);const mh=csvParse(master[0]);
for(let i=20;i<40;i++){
 const r=Object.fromEntries(csvParse(master[321+i]).map((v,j)=>[mh[j],v]));
 assert.equal(r.source_question_id,qs[i-20].id);
 for(const flag of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[flag],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const gate=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=manifest.grades.find(g=>g.grade===11),unit=grade.units.find(u=>u.unit===6);
const course=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
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
console.log('V95-C2R PASS: Topic6.5 Q21-40 original choices and keys, 9 teacher review notes, formative B39 and summative B40 split, 360/560 academically inspected and exam release held.');
