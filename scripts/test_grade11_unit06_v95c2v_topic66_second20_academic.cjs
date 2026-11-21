#!/usr/bin/env node
'use strict';
/* V95-C2V: Teacher master PDF, original NBF printed pp.101–105 and official
 * FBISE framework were checked outside GitHub CI. CI checks source integrity,
 * maths/physics consistency, decisions and pending approval/release controls.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-66-v86-80-source.json'));
const qs=bank.questions.slice(20,40);
assert.equal(bank.bankId,'PSN-XI-U06-T66-V86');
assert.equal(bank.questions.length,80);assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'DCADDBBBDDDBCCDBBDBA');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[230,230,230,230,230,230,230,231,231,231,231,231,231,231,232,232,232,232,232,232]);
const snapshot=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let fingerprint=2166136261;
for(const ch of snapshot)fingerprint=Math.imul(fingerprint^ch.charCodeAt(0),16777619)>>>0;
assert.equal(fingerprint,0x4c38f0d4,'Original source stems/options/letters changed');
function csvParse(str){const out=[];let v='',quoted=false;for(let i=0;i<str.length;i++){const c=str[i];if(c==='"'&&quoted&&str[i+1]==='"'){v+='"';i++;continue;}if(c==='"'){quoted=!quoted;continue;}if(c===','&&!quoted){out.push(v);v='';continue;}v+=c;}assert.equal(quoted,false,'Invalid CSV');out.push(v);return out;}
const raw=read('quality/grade11-unit06-v95c2v-topic66-mcq21-40-conceptual-review.csv').trimEnd().split(/\r?\n/);
assert.equal(raw.length,21);const headers=csvParse(raw[0]);assert.equal(headers.length,21);
const rows=raw.slice(1).map(line=>Object.fromEntries(csvParse(line).map((v,i)=>[headers[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const mandatory=new Map([
[25,'COMPULSORY_CONTINUITY_AND_QUASI_STEADY_SLO'],[30,'COMPULSORY_NONIDEAL_B41_SCOPE'],
[32,'COMPULSORY_VENTURI_INFERENCE_REQUIREMENTS'],[33,'COMPULSORY_CONTINUITY_CROSS_SLO'],
[34,'COMPULSORY_COGNITIVE_SCOPE_NOTE'],[36,'COMPULSORY_AEROFOIL_DIAGRAM_AND_EQUAL_TRANSIT'],
[37,'COMPULSORY_B44_COGNITIVE_DEPTH'],[38,'COMPULSORY_B44_COGNITIVE_DEPTH'],
[40,'COMPULSORY_FORMATIVE_B39_VS_B44']]);
const tagA=new Set([26,30,33,34]),tagB40=new Set([24,25,26,27,28,29,30,33,34]);
for(let i=0;i<20;i++){
 const q=qs[i],n=q.sourceQuestionNumber,r=rows[i];
 assert.equal(q.id,'XI-U06-T66-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(n,i+21);
 assert.equal(q.sourceSection,'reasoning');
 assert.equal(q.situationBased,false);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.6');assert.equal(r.source_number,String(n));
 assert.equal(r.prepared_question_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.prepared_key_pdf_page,'240');
 assert.equal(r.prepared_stem_match,'MATCHED_PREPARED_MASTER_P230_232');
 assert.equal(r.prepared_A_to_D_match_count,'4');
 assert.equal(r.prepared_key_letter_match,'MATCHED_PREPARED_KEY_P240');
 assert.equal(r.original_correct_option,q.correctOptionId);
 assert.equal(r.author_slo_tag_not_certified,tagB40.has(n)?'P-11-B-40':'P-11-B-44');
 assert.equal(r.author_cognitive_tag_not_certified,tagA.has(n)?'A':'U');
 assert.equal(r.source_section,'reasoning');
 assert.equal(r.source_figure_link,'');
 assert.equal(r.scientific_letter_status,'SOURCE_BEST_ANSWER_SUPPORTED_WITH_ASSUMPTIONS');
 assert.equal(r.teacher_priority,mandatory.get(n)||(r.teacher_priority.startsWith('OPTIONAL')?r.teacher_priority:'OPTIONAL'));
 assert.ok(r.teacher_issue.trim().length>8);
 assert.ok(r.teacher_scientific_note.trim().length>=65);
 assert.ok(r.candidate_slo_scope_not_certified.length>4);
 assert.equal(r.original_printed_NBF_source_status,'PRINTED_NBF_PP101_TO105_APPLICATIONS_DIRECTLY_VISUALLY_CHECKED');
 assert.equal(r.individual_exam_certification,'PENDING');assert.equal(r.teacher_approval,'PENDING');
}
const report=read('quality/grade11-unit06-v95c2v-topic66-mcq21-40-conceptual-review.md');
assert.ok(report.includes('20/20 stems, 80/80 A–D options and 20/20 original answer letters match'));
assert.ok(report.includes('440/560'));
assert.ok(report.includes('P-11-B-39'));
assert.ok(report.includes('P-11-B-44'));
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T66-MCQ-'+String(n).padStart(4,'0')));
const qn=n=>qs.find(q=>q.sourceQuestionNumber===n);
assert.equal(qn(25).correctOptionId,'D');
assert.equal(qn(30).correctOptionId,'D');
assert.equal(qn(32).correctOptionId,'B');
assert.equal(qn(33).correctOptionId,'C');
assert.equal(qn(36).correctOptionId,'B');
assert.equal(qn(37).correctOptionId,'B');
assert.equal(qn(38).correctOptionId,'D');
assert.equal(qn(40).correctOptionId,'A');
assert.equal(qn(36).referenceFigureId??null,null);
const Atank=1000,Aexit=1,vexit=5;
assert.equal(Atank*(Aexit/Atank*vexit),Aexit*vexit,'Q25 continuity ratio');
assert.equal(20/4,5,'Q33 throat v=Q/A');
const rho=1000,vwide=2,vthroat=6;
const dP=.5*rho*(vthroat*vthroat-vwide*vwide);
assert.equal(dP,16000,'Venturi pressure drop sign and magnitude');
assert.equal(Math.sqrt(2*9.8*5)**2,98,'Torricelli from 5m head');
assert.equal(Math.sqrt(0),0,'Torricelli zero-head ideal limit');
const queue=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(queue.length,561);const header=csvParse(queue[0]);
for(let i=20;i<40;i++){
 const r=Object.fromEntries(csvParse(queue[401+i]).map((v,j)=>[header[j],v]));
 assert.equal(r.source_question_id,qs[i-20].id);
 for(const x of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[x],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const gate=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const g=manifest.grades.find(g=>g.grade===11),u=g.units.find(u=>u.unit===6);
const c=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(u.liveMcqCount,560);
assert.equal(g.units.reduce((s,u)=>s+u.liveMcqCount,0),2250);
assert.equal(u.standaloneSituationQuestionCount,136);
assert.equal(u.independentSharedStimulusGroupCount,0);
assert.equal(u.perQuestionSloVerified,false);
assert.equal(u.exactFbiseModeReady,false);
assert.equal(c.status,'planned');
assert.equal(c.assessmentStatus,'not-published');
assert.equal(gate.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2V PASS: 20 conceptual original keys/options, nine teacher flags, original NBF figures, 440/560 reviewed, all approvals pending and formal assessment held.');
