#!/usr/bin/env node
'use strict';
/* V95-C2X: private teacher-prepared original PDF and NBF printed pp101–106
 * plus official FBISE framework inspected outside GitHub Actions. CI freezes
 * source options/keys and teacher release holds; it does NOT certify questions.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-66-v86-80-source.json'));
const qs=bank.questions.slice(60,80);
assert.equal(bank.bankId,'PSN-XI-U06-T66-V86');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'ACAAADABDAADCAABCDCD');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[235,235,236,236,236,236,236,236,236,237,237,237,237,237,237,237,238,238,238,238]);
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let fp=2166136261;for(const ch of snap)fp=Math.imul(fp^ch.charCodeAt(0),16777619)>>>0;
assert.equal(fp,0x3d55a697,'Original reviewed stem/choice/key changed');
function csvParse(s){const a=[];let v='',quoted=false;for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'&&quoted&&s[i+1]==='"'){v+='"';i++;continue;}if(c==='"'){quoted=!quoted;continue;}if(c===','&&!quoted){a.push(v);v='';continue;}v+=c;}assert.equal(quoted,false);a.push(v);return a;}
const raw=read('quality/grade11-unit06-v95c2x-topic66-mcq61-80-scenario-review.csv').trimEnd().split(/\r?\n/);
assert.equal(raw.length,21);const cols=csvParse(raw[0]);assert.equal(cols.length,21);
const rows=raw.slice(1).map(x=>Object.fromEntries(csvParse(x).map((v,i)=>[cols[i],v])));
assert.equal(new Set(rows.map(x=>x.source_question_id)).size,20);
const mandatory=new Map([
[61,'COMPULSORY_B44_COGNITIVE_DEPTH'],[63,'COMPULSORY_DEVICE_IDENTIFICATION_SCOPE'],
[70,'COMPULSORY_PIEZOMETER_AND_COGNITION'],[73,'COMPULSORY_CONTINUITY_SLO_MISLABEL'],
[75,'COMPULSORY_EQUAL_TRANSIT_MYTH'],[76,'COMPULSORY_MAGNUS_COGNITIVE_DEPTH'],
[77,'COMPULSORY_MAGNUS_COGNITIVE_DEPTH'],[78,'COMPULSORY_B39_FORMATIVE_SCOPE'],
[80,'COMPULSORY_SUPERSONIC_AND_STREAMLINE_ASSUMPTIONS']
]);
const authorB40=new Set([65,66,67,68,71,73,79]);
const authorApp=new Set([65,66,67,68,69,71,73,74,79,80]);
for(let i=0;i<20;i++){
 const q=qs[i],n=61+i,r=rows[i];
 assert.equal(q.id,'XI-U06-T66-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'standalone-situations');
 assert.equal(q.situationBased,true);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(x=>x.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(r.source_question_id,q.id);assert.equal(r.topic,'6.6');
 assert.equal(r.source_number,String(n));
 assert.equal(r.teacher_master_question_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.teacher_master_key_pdf_page,n<=66?'241':'242');
 assert.equal(r.source_stem_match,'MATCHED_PREPARED_MASTER_PP235_TO238');
 assert.equal(r.source_A_to_D_match_count,'4');
 assert.equal(r.source_answer_letter_match,'MATCHED_PREPARED_KEY_PP241_TO242');
 assert.equal(r.original_correct_letter,q.correctOptionId);
 assert.equal(r.author_slo_tag_not_certified,authorB40.has(n)?'P-11-B-40':'P-11-B-44');
 assert.equal(r.author_cognitive_tag_not_certified,authorApp.has(n)?'A':'U');
 assert.equal(r.standalone_situation,'YES');
 assert.equal(r.genuine_shared_stimulus_group,'NONE');
 assert.equal(r.scientific_source_key_status,'SOURCE_BEST_ANSWER_SUPPORTED_UNDER_STATED_OR_INTENDED_ASSUMPTIONS');
 if(mandatory.has(n))assert.equal(r.teacher_review_priority,mandatory.get(n));
 else assert.ok(r.teacher_review_priority.startsWith('OPTIONAL'),'Expected optional review classification for Q'+n);
 assert.ok(r.teacher_review_theme.length>9);
 assert.ok(r.scientific_teacher_note.length>75);
 assert.ok(r.candidate_official_slo_only.length>=5);
 assert.equal(r.original_nbf_topic_figures_reference,'PRINTED_NBF_PP101_TO106_APPLICATIONS_VISUALLY_CHECKED');
 assert.equal(r.individual_board_exam_approval,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
const report=read('quality/grade11-unit06-v95c2x-topic66-mcq61-80-scenario-review.md');
for(const term of ['20/20 stems, 80/80 choices and 20/20 key letters','480/560','P-11-B-39','P-11-B-44','compressibility'])assert.ok(report.includes(term),'Missing teacher report evidence: '+term);
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T66-MCQ-'+String(n).padStart(4,'0')));
const at=n=>qs.find(q=>q.sourceQuestionNumber===n);
assert.equal(at(61).correctOptionId,'A');
assert.equal(at(63).correctOptionId,'A');
assert.equal(at(65).correctOptionId,'A');
assert.equal(at(66).correctOptionId,'D');
assert.equal(at(69).correctOptionId,'D');
assert.equal(at(73).correctOptionId,'C');
assert.equal(at(74).correctOptionId,'A');
assert.equal(at(75).correctOptionId,'A');
assert.equal(at(76).correctOptionId,'B');
assert.equal(at(77).correctOptionId,'C');
assert.equal(at(78).correctOptionId,'D');
assert.equal(at(79).correctOptionId,'C');
assert.equal(at(80).correctOptionId,'D');
const close=(a,b)=>Math.abs(a-b)<Math.max(1e-10,Math.abs(b)*1e-9);
assert.ok(close(Math.sqrt(2),Math.sqrt(2*9.8*10)/Math.sqrt(2*9.8*5)));
assert.equal((100-97)*1000*12,36000);
assert.equal(1*4,2*2,'Constant Q means inverse A-v');
assert.ok(close(Math.sqrt(1000/800),Math.sqrt(1.25)),'At fixed pressure difference ideal speed scales with inverse sqrt density');
const qx=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(qx.length,561);const head=csvParse(qx[0]);
for(let i=60;i<80;i++){
 const r=Object.fromEntries(csvParse(qx[401+i]).map((v,j)=>[head[j],v]));
 assert.equal(r.source_question_id,qs[i-60].id);
 for(const x of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[x],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json')),catalog=JSON.parse(read('portal/learning-catalog.json')),signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const g=manifest.grades.find(x=>x.grade===11),u=g.units.find(x=>x.unit===6),course=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===6);
assert.equal(u.liveMcqCount,560);
assert.equal(g.units.reduce((s,x)=>s+x.liveMcqCount,0),2250);
assert.equal(u.standaloneSituationQuestionCount,136);
assert.equal(u.independentSharedStimulusGroupCount,0);
assert.equal(u.perQuestionSloVerified,false);
assert.equal(u.exactFbiseModeReady,false);
assert.equal(course.status,'planned');assert.equal(course.assessmentStatus,'not-published');
assert.equal(signoff.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2X PASS: original Bernoulli scenarios Q61-80 unchanged, 9 compulsory teacher decisions, 480/560 inspected, 560 approvals pending and formal assessment held.');
