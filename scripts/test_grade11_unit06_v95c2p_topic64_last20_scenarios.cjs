#!/usr/bin/env node
'use strict';
/* V95-C2P: private prepared PDF compared and Q68 exponent visually reviewed
 * outside GitHub CI. This CI freezes source and teacher release holds; it does
 * NOT prove printed NBF originality or item-level board certification.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-64-v82-80-source.json'));
const qs=bank.questions.slice(60,80);
assert.equal(bank.bankId,'PSN-XI-U06-T64-V82');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'ACAAADABDAADCAABCDCD');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[145,145,145,145,145,145,145,146,146,146,146,146,146,146,147,147,147,147,147,147]);
for(let i=0;i<20;i++){
 const q=qs[i],n=i+61;
 assert.equal(q.id,'XI-U06-T64-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'standalone-situations');
 assert.equal(q.situationBased,true);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
}
const snapshot=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let digest=2166136261;
for(const char of snapshot)digest=Math.imul(digest^char.charCodeAt(0),16777619)>>>0;
assert.equal(digest,0x57ded990,'Original scenario stem, options or key unexpectedly changed');
function csvParse(s){
 const arr=[];let v='',quoted=false;
 for(let i=0;i<s.length;i++){
  const c=s[i];if(c==='"'&&quoted&&s[i+1]==='"'){v+='"';i++;continue;}
  if(c==='"'){quoted=!quoted;continue;}
  if(c===','&&!quoted){arr.push(v);v='';continue;}v+=c;
 }
 assert.equal(quoted,false);arr.push(v);return arr;
}
const lines=read('quality/grade11-unit06-v95c2p-topic64-mcq61-80-scenario-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21);
const head=csvParse(lines[0]);assert.equal(head.length,21);
const rows=lines.slice(1).map(line=>Object.fromEntries(csvParse(line).map((v,i)=>[head[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const mandatory=new Map([
 [66,'COMPULSORY_EXAMPLE_AND_SPLIT_REVIEW'],
 [67,'COMPULSORY_UNDERDETERMINED_BRANCH_SPLIT'],
 [73,'COMPULSORY_BRANCH_AREA_NUANCE'],
 [74,'COMPULSORY_LEAK_UNIT_CLARITY'],
 [77,'COMPULSORY_STEADY_LOCATION_WORDING'],
 [78,'COMPULSORY_SLO_SCOPE_NOTE'],
 [79,'COMPULSORY_SLO_COGNITIVE_NOTE']
]);
const slo={
61:'P-11-B-37',62:'P-11-B-37',63:'P-11-B-36',64:'P-11-B-36',65:'P-11-B-38',
66:'P-11-B-36;P-11-B-38_possible',67:'P-11-B-38',68:'P-11-B-38',69:'P-11-B-38',
70:'P-11-B-38',71:'P-11-B-38',72:'P-11-B-38',73:'P-11-B-36;P-11-B-38_possible',
74:'P-11-B-38',75:'P-11-B-36',76:'P-11-B-36',77:'P-11-B-36',
78:'P-11-B-36_supporting',79:'P-11-B-36_supporting',80:'P-11-B-36'
};
for(let i=0;i<20;i++){
 const q=qs[i],n=q.sourceQuestionNumber,r=rows[i];
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.4');
 assert.equal(r.source_number,String(n));
 assert.equal(r.compiled_pdf_question_page,String(q.sourcePdfPage));
 assert.equal(r.compiled_pdf_answer_page,'150');
 assert.equal(r.prepared_master_stem_match,n===68?'VISUALLY_MATCHED_SUPERSCRIPT':'DIRECT_TEXT_MATCH');
 assert.equal(r.prepared_master_option_matches,'4');
 assert.equal(r.prepared_master_answer_match,'MATCHED_PREPARED_MASTER_KEY_P150');
 assert.equal(r.source_original_correct_letter,q.correctOptionId);
 assert.equal(r.standalone_situation,'YES');
 assert.equal(r.genuine_common_stimulus_id,'NONE');
 assert.equal(r.linked_source_figure_id,'');
 assert.equal(r.scientific_key_review,'SOURCE_BEST_CHOICE_SUPPORTED_CONDITIONS_NOTED');
 assert.equal(r.teacher_review_priority,mandatory.get(n)||'OPTIONAL');
 assert.ok(r.teacher_review_theme.length>=8);
 assert.ok(r.teacher_scientific_note.trim().length>=40);
 assert.notEqual(r.teacher_scientific_note.trim(),'undefined');
 assert.equal(r.candidate_topic_slo_only,slo[n]);
 assert.ok(['Application','Understanding','Knowledge'].includes(r.candidate_cognition_unapproved));
 assert.equal(r.original_printed_nbf_fidelity,'PENDING_PRINTED_NBF_PP96_TO99');
 assert.equal(r.individual_fbise_item_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const report=read('quality/grade11-unit06-v95c2p-topic64-mcq61-80-scenario-review.md');
assert.ok(report.includes('19/20 stems directly matching'));
assert.ok(report.includes('80/80 options matched'));
assert.ok(report.includes('20/20 original answer letters matched'));
assert.ok(report.includes('320/560'));
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T64-MCQ-'+String(n).padStart(4,'0')));
assert.equal(1.2*4/1,4.8);
assert.equal(12-5,7);
assert.equal(6-2-2,2);
assert.equal(9/3,3);
assert.ok(Math.abs(1/.7**2-2.0408163265306123)<1e-12);
assert.equal(.4/.1*.5,2);
assert.equal(2*.5,1);
assert.equal(20/1,20);
assert.equal(5-4,1);
assert.ok(Math.abs((1/.1)**2*.20/50-.4)<1e-12);
assert.equal(1*.2,50*.01*.4,'Equal-split branch speeds conserve original inlet flow');
assert.equal(1*.2,25*.01*.2+25*.01*.6,'A half-and-half unequal-speed distribution also conserves the inlet flow');
assert.equal(qs[6].correctOptionId,'A');
assert.equal(qs[13].options.find(o=>o.id==='A').text,'1 L');
assert.equal(qs[16].correctOptionId,'C');
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);
const mh=csvParse(master[0]);
for(let i=60;i<80;i++){
 const r=Object.fromEntries(csvParse(master[241+i]).map((v,j)=>[mh[j],v]));
 assert.equal(r.source_question_id,qs[i-60].id);
 for(const flag of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[flag],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const gate=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const g=manifest.grades.find(g=>g.grade===11),u=g.units.find(u=>u.unit===6);
const cat=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(u.liveMcqCount,560);
assert.equal(g.units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.equal(u.standaloneSituationQuestionCount,136);
assert.equal(u.independentSharedStimulusGroupCount,0);
assert.equal(u.perQuestionSloVerified,false);
assert.equal(u.exactFbiseModeReady,false);
assert.equal(cat.status,'planned');
assert.equal(cat.assessmentStatus,'not-published');
assert.equal(gate.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2P PASS: 20 scenario source keys, seven teacher flags, Q67 unequal-split example, 320/560 inspected, all approvals pending, assessment held.');
