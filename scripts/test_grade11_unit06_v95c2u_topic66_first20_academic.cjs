#!/usr/bin/env node
'use strict';
/* V95-C2U: prepared PDF, official FBISE framework and owner original NBF
 * printed pp101-106 were directly reopened outside GitHub Actions.
 * CI freezes source metadata/teacher approval and release controls, not
 * a certification of original book image presence in public practice.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-66-v86-80-source.json'));
const qs=bank.questions.slice(0,20);
assert.equal(bank.bankId,'PSN-XI-U06-T66-V86');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'BBCCACCCBCACBADDCBCC');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[227,227,227,227,227,228,228,228,228,228,228,228,228,229,229,229,229,229,229,229]);
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let fp=2166136261;for(const ch of snap)fp=Math.imul(fp^ch.charCodeAt(0),16777619)>>>0;
assert.equal(fp,0x6592ce3f,'Source question stem, option or original key changed without review');
function csvParse(line){const out=[];let value='',quoted=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'&&quoted&&line[i+1]==='"'){value+='"';i++;continue;}if(c==='"'){quoted=!quoted;continue;}if(c===','&&!quoted){out.push(value);value='';continue;}value+=c;}assert.equal(quoted,false);out.push(value);return out;}
const lines=read('quality/grade11-unit06-v95c2u-topic66-mcq01-20-academic-review.csv').trimEnd().split(/\r?\n/);
assert.equal(lines.length,21);const header=csvParse(lines[0]);assert.equal(header.length,20);
const rows=lines.slice(1).map(line=>Object.fromEntries(csvParse(line).map((v,i)=>[header[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const flags=new Map([
[1,'COMPULSORY_B44_COGNITIVE_SCOPE'],[2,'COMPULSORY_PRINTED_FIGURE_LINK'],
[4,'COMPULSORY_B44_COGNITIVE_SCOPE'],[6,'COMPULSORY_B40_COGNITIVE_SCOPE'],
[9,'COMPULSORY_B40_COGNITIVE_SCOPE'],[12,'COMPULSORY_CONTINUITY_CROSS_SLO'],
[13,'COMPULSORY_PRINTED_FIGURE_LINK'],[16,'COMPULSORY_AEROFOIL_FIGURE_AND_MODEL'],
[17,'COMPULSORY_B44_COGNITIVE_SCOPE'],[19,'COMPULSORY_FORMATIVE_B39_CROSS_SCOPE'],
[20,'COMPULSORY_EXAMPLE_AND_B40_COGNITIVE_SCOPE']
]);
const authorCognition='UUUUUKKUKUUUUAUUUUUK';
const authorSlo={1:'P-11-B-44',2:'P-11-B-44',3:'P-11-B-44',4:'P-11-B-44',5:'P-11-B-44',6:'P-11-B-40',7:'P-11-B-40',8:'P-11-B-40',9:'P-11-B-40',10:'P-11-B-44',11:'P-11-B-44',12:'P-11-B-40',13:'P-11-B-44',14:'P-11-B-40',15:'P-11-B-44',16:'P-11-B-44',17:'P-11-B-44',18:'P-11-B-44',19:'P-11-B-44',20:'P-11-B-40'};
for(let i=0;i<20;i++){
 const q=qs[i],n=i+1,r=rows[i];
 assert.equal(q.id,'XI-U06-T66-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'fundamentals');
 assert.equal(q.situationBased,false);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.referenceFigureId??null,null);
 assert.equal(q.options.map(x=>x.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(x=>x.text.trim()));
 assert.equal(q.active,true);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.6');assert.equal(r.source_number,String(n));
 assert.equal(r.prepared_question_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.prepared_key_pdf_page,n<=19?'239':'240');
 assert.equal(r.prepared_stem_match,'MATCHED_PREPARED_PDF_PP227_TO229');
 assert.equal(r.prepared_A_to_D_match_count,'4');
 assert.equal(r.prepared_source_key_match,'MATCHED_PREPARED_KEY_PP239_TO240');
 assert.equal(r.source_answer_letter,q.correctOptionId);
 assert.equal(r.source_author_slo_tag,authorSlo[n]);
 assert.equal(r.source_author_cognitive_tag,authorCognition[i]);
 assert.equal(r.scientific_letter_review,'SOURCE_SELECTED_LETTER_SCIENTIFICALLY_SUPPORTED_IN_STATED_MODEL');
 assert.equal(r.teacher_priority,flags.get(n)||(r.teacher_priority.startsWith('OPTIONAL')?r.teacher_priority:'OPTIONAL'));
 assert.ok(r.teacher_issue.trim().length>10);
 assert.ok(r.scientific_teacher_note.trim().length>55);
 assert.ok(r.candidate_item_scope_not_certified.length>5);
 assert.equal(r.printed_nbf_source_check,'PRINTED_NBF_PP101_TO105_SOURCE_FIGURES_CHECKED');
 assert.equal(r.source_figure_link_id,'');
 assert.equal(r.individual_exam_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
}
for(const n of [2,13,16])assert.equal(qs[n-1].referenceFigureId??null,null);
assert.ok(qs[1].stem.includes('Fig. 6.10'));
assert.ok(qs[12].stem.includes('Fig. 6.13'));
assert.ok(qs[15].stem.includes('aerofoil diagram'));
assert.equal(qs[5].options.find(o=>o.id==='C').text,'v = √(2gh)');
assert.equal(qs[11].options.find(o=>o.id==='C').text,'A₁v₁ = A₂v₂');
assert.equal(qs[13].options.find(o=>o.id==='A').text,'½ρ(v₂² − v₁²)');
assert.equal(qs[19].correctOptionId,'C');
assert.ok(qs[19].stem.includes('3 m lower'));
assert.equal(3,Math.sqrt(2*9.8*(9/(2*9.8))));
assert.equal(.5*1000*(6**2-2**2),16000);
const report=read('quality/grade11-unit06-v95c2u-topic66-mcq01-20-academic-review.md');
assert.ok(report.includes('20/20 matching stems, 80/80 matching options and 20/20 original key letters'));
assert.ok(report.includes('420/560'));
assert.ok(report.includes('P-11-B-39'));
assert.ok(report.includes('P-11-B-44'));
for(const n of flags.keys())assert.ok(report.includes('XI-U06-T66-MCQ-'+String(n).padStart(4,'0')));
const queue=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(queue.length,561);const mh=csvParse(queue[0]);
for(let i=0;i<20;i++){
 const r=Object.fromEntries(csvParse(queue[401+i]).map((v,j)=>[mh[j],v]));
 assert.equal(r.source_question_id,qs[i].id);
 for(const k of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(r[k],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const sign=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=manifest.grades.find(g=>g.grade===11),u=grade.units.find(x=>x.unit===6),course=catalog.grades.find(g=>g.grade===11).units.find(x=>x.unit===6);
assert.equal(u.liveMcqCount,560);
assert.equal(grade.units.reduce((n,x)=>n+x.liveMcqCount,0),2250);
assert.equal(u.standaloneSituationQuestionCount,136);
assert.equal(u.independentSharedStimulusGroupCount,0);
assert.equal(u.perQuestionSloVerified,false);
assert.equal(u.exactFbiseModeReady,false);
assert.equal(course.status,'planned');
assert.equal(course.assessmentStatus,'not-published');
assert.equal(sign.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2U PASS: 20 source Bernoulli applications, 11 academic flags, 420/560 inspected, printed source verified, all 560 item approvals pending and official assessment held.');
