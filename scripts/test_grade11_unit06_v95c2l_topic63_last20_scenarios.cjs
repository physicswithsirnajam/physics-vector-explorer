#!/usr/bin/env node
'use strict';
/* V95-C2L. Prepared private PDF and official framework reviewed outside CI.
 * CI freezes original public source and teacher-review gates, not original printed
 * NBF artwork fidelity or individual exam/SLO certification.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-63-v80-80-source.json'));
const qs=bank.questions.slice(60,80);
assert.equal(bank.bankId,'PSN-XI-U06-T63-V80');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'CADDAABCADABBACABBDB');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[105,106,106,106,106,106,106,106,106,107,107,107,107,107,107,107,107,108,108,108]);
for(let i=0;i<20;i++){
 const q=qs[i],n=i+61;
 assert.equal(q.id,'XI-U06-T63-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'standalone-situations');
 assert.equal(q.situationBased,true);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,n===80?'unit6-figure66':null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim() && q.explanation.trim() && q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);
 assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
}
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let fingerprint=2166136261;
for(const c of snap)fingerprint=Math.imul(fingerprint^c.charCodeAt(0),16777619)>>>0;
assert.equal(fingerprint,0x7350835e,'Original student question stem/options/answer altered');
function csvParse(line){
 const out=[];let value='',quoted=false;
 for(let i=0;i<line.length;i++){
  const char=line[i];
  if(char==='"' && quoted && line[i+1]==='"'){value+='"';i++;continue;}
  if(char==='"'){quoted=!quoted;continue;}
  if(char===','&&!quoted){out.push(value);value='';continue;}
  value+=char;
 }
 assert.equal(quoted,false,'CSV quote malformed');
 out.push(value);return out;
}
const lines=read('quality/grade11-unit06-v95c2l-topic63-mcq61-80-scenario-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21);
const h=csvParse(lines[0]);assert.equal(h.length,19);
const rows=lines.slice(1).map(line=>Object.fromEntries(csvParse(line).map((v,i)=>[h[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const mandatory=new Map([
 [63,'COMPULSORY_EDDY_CONTEXT_NOTE'],
 [64,'COMPULSORY_SLO_SCOPE_NOTE'],
 [65,'COMPULSORY_SLO_SCOPE_NOTE'],
 [72,'COMPULSORY_SLO_SCOPE_NOTE'],
 [75,'COMPULSORY_TRANSITION_MODEL_NOTE'],
 [77,'COMPULSORY_SLO_SCOPE_NOTE'],
 [78,'COMPULSORY_FLOWRATE_SCOPE_NOTE'],
 [80,'COMPULSORY_FIGURE_SOURCE_REVIEW']
]);
const alternative=new Set([64,65,72,77]);
for(let i=0;i<20;i++){
 const q=qs[i],n=q.sourceQuestionNumber,r=rows[i];
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.3');
 assert.equal(r.source_number,String(n));
 assert.equal(r.prepared_question_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.prepared_answer_pdf_page,n<=77?'111':'112');
 assert.equal(r.prepared_stems_options_keys,'MATCHED_PREPARED_PDF_PP105_TO108_KEYS_PP111_TO112');
 assert.equal(r.source_correct_letter,q.correctOptionId);
 assert.equal(r.item_type,'STANDALONE_SITUATION');
 assert.equal(r.genuine_shared_stimulus_set,'NONE');
 assert.equal(r.linked_figure_id,q.referenceFigureId??'');
 assert.equal(r.scientific_answer_review,'SOURCE_KEY_SUPPORTED_UNDER_INTENDED_MODEL_WITH_LIMITS');
 assert.equal(r.teacher_review_priority,mandatory.get(n)||'OPTIONAL');
 assert.ok(r.review_theme.length>=9);
 assert.ok(r.teacher_note.trim().length>=65,'Meaningful teacher note needed Q'+n);
 assert.notEqual(r.teacher_note.trim(),'undefined');
 const expectedSLO=alternative.has(n)?'P-11-B-35;P-11-B-42_possible':n===70?'P-11-B-35;P-11-B-41_possible':n===78?'P-11-B-35_supporting;P-11-B-36_context_only':'P-11-B-35';
 assert.equal(r.candidate_slo_only,expectedSLO);
 assert.ok(['Understanding','Application'].includes(r.candidate_cognition_not_certified));
 assert.equal(r.printed_nbf_source_fidelity,'PENDING_ORIGINAL_PRINTED_NBF_PP95_TO96');
 assert.equal(r.individual_slo_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const review=read('quality/grade11-unit06-v95c2l-topic63-mcq61-80-scenario-review.md');
assert.ok(review.includes('20/20 matching stems'));
assert.ok(review.includes('80/80 matching options'));
assert.ok(review.includes('20/20 matching answer letters'));
assert.ok(review.includes('240/560'));
assert.ok(review.includes('Figure6.6'));
for(const n of mandatory.keys())assert.ok(review.includes('XI-U06-T63-MCQ-'+String(n).padStart(4,'0')));
assert.equal(qs[17].sourceQuestionNumber,78);
assert.equal(qs[17].correctOptionId,'B');
assert.equal(18/6,3);
assert.equal(qs[19].sourceQuestionNumber,80);
assert.equal(qs[19].correctOptionId,'B');
assert.equal(qs[19].referenceFigureId,'unit6-figure66');
const full=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(full.length,561);
const mh=csvParse(full[0]);
for(let i=60;i<80;i++){
 const m=Object.fromEntries(csvParse(full[161+i]).map((v,j)=>[mh[j],v]));
 assert.equal(m.source_question_id,qs[i-60].id);
 for(const flag of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(m[flag],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const gate=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade11=manifest.grades.find(g=>g.grade===11),unit6=grade11.units.find(u=>u.unit===6);
const study=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(unit6.liveMcqCount,560);
assert.equal(grade11.units.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
assert.equal(unit6.standaloneSituationQuestionCount,136);
assert.equal(unit6.independentSharedStimulusGroupCount,0);
assert.equal(unit6.perQuestionSloVerified,false);
assert.equal(unit6.exactFbiseModeReady,false);
assert.equal(study.status,'planned');
assert.equal(study.assessmentStatus,'not-published');
assert.equal(gate.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2L PASS: Topic6.3 Q61-80 all 20 original source keys stable, 8 teacher notes, figure gate, 240/560 reviewed, 560 approvals pending; release held.');
