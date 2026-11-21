#!/usr/bin/env node
'use strict';
/* V95-C2K: prepared private PDF compared OUTSIDE CI; this script freezes
 * public original source bank and mathematics, not private-PDF byte equivalence
 * or official per-item FBISE summative eligibility.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-63-v80-80-source.json'));
const qs=bank.questions.slice(40,60);
assert.equal(bank.bankId,'PSN-XI-U06-T63-V80');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'CDCBDACBCDABBACCDAAC','Source prepared master PDF pp.110-111');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[103,103,103,104,104,104,104,104,104,104,104,104,105,105,105,105,105,105,105,105]);
for(let i=0;i<qs.length;i++){
 const q=qs[i],n=i+41;
 assert.equal(q.id,'XI-U06-T63-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.sourceSection,'numericals');
 assert.equal(q.situationBased,false);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.trim()&&q.explanation.trim()&&q.options.every(o=>o.text.trim()));
 assert.equal(q.active,true);
 assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
}
const snap=qs.map(q=>[q.id,q.stem,q.options.map(o=>o.id+':'+o.text).join('|'),q.correctOptionId].join('\u001f')).join('\u001e');
let hash=2166136261;
for(const c of snap)hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
assert.equal(hash,0xf9b454d4,'Original source stems/options/letters changed after teacher comparison');
const expected=[
 [41,1.2/4,'0.30 m³/s'],[42,9/3,'3.0 L/s'],[43,600/2,'300 cm³/s'],
 [44,2*1e-3,'2.0 × 10⁻³ m³/s'],[45,.015*1000,'15 L/s'],[46,.25*8,'2.0 m³'],
 [47,1.8/.3,'6.0 s'],[48,12/60,'0.20 L/s'],[49,360/(3*60),'2.0 L/s'],
 [50,.8/20,'0.040 m³/s'],[51,90/3*1e-6,'3.0 × 10⁻⁵ m³/s'],
 [52,(2500/1000)/5,'0.50 L/s'],[53,5e-3*2*1000,'10 L'],
 [54,15/30,'0.50 L/s'],[55,[60/20,45/10],'B, because 4.5 L/s > 3.0 L/s'],
 [56,[2/5,1.2/3],'Equal at 0.40 m³/s'],[57,5/.5,'10 s'],[58,.060*10,'0.60 m³'],
 [59,null,'Elapsed time'],[60,null,'Volume crossing a location in each second']
];
assert.equal(expected.length,20);
const approx=(a,b)=>Math.abs(a-b)<Math.max(1e-12,Math.abs(b)*1e-9);
for(let i=0;i<expected.length;i++){
 const [n,result,selectedText]=expected[i],q=qs[i],selected=q.options.find(o=>o.id===q.correctOptionId);
 assert.equal(n,q.sourceQuestionNumber);
 assert.equal(selected.text,selectedText,'Answer choice changed or incorrect for Q'+n);
 if(Array.isArray(result)){
  assert.equal(result.length,2);
  if(n===55){assert.ok(approx(result[0],3)&&approx(result[1],4.5)&&result[1]>result[0]);}
  if(n===56){assert.ok(result.every(v=>approx(v,.4)));}
 }else if(result!==null){assert.ok(Number.isFinite(result),'Non-finite independent calculation Q'+n);}
}
assert.ok(approx(90/3*1e-6,3e-5),'Cubic centimetre conversion Q51');
assert.ok(approx(2e-3,2/1000),'L/s to m³/s conversion Q44');
assert.ok(approx(2500/1000/5,.5));
function parseCSV(line){
 const out=[];let field='',quoted=false;
 for(let i=0;i<line.length;i++){
  const ch=line[i];
  if(ch==='"'&&quoted&&line[i+1]==='"'){field+='"';i++;continue;}
  if(ch==='"'){quoted=!quoted;continue;}
  if(ch===','&&!quoted){out.push(field);field='';continue;}
  field+=ch;
 }
 assert.equal(quoted,false,'Invalid CSV quotes');out.push(field);return out;
}
const csv=read('quality/grade11-unit06-v95c2k-topic63-mcq41-60-numerical-review.csv').trimEnd().split(/\r?\n/);
assert.equal(csv.length,21);
const col=parseCSV(csv[0]);assert.equal(col.length,18);
const rows=csv.slice(1).map(line=>Object.fromEntries(parseCSV(line).map((v,i)=>[col[i],v])));
assert.equal(new Set(rows.map(r=>r.source_question_id)).size,20);
const special=new Map([[44,'OPTIONAL_CONVERSION_TEACHING'],[51,'OPTIONAL_CUBIC_CONVERSION_TEACHING'],[55,'OPTIONAL_RATE_COMPARISON_TEACHING'],[56,'OPTIONAL_EQUAL_RATE_TEACHING']]);
for(let i=0;i<20;i++){
 const q=qs[i],n=q.sourceQuestionNumber,r=rows[i];
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.3');
 assert.equal(r.source_number,String(n));
 assert.equal(r.compiled_question_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.compiled_answer_pdf_page,n<=49?'110':'111');
 assert.equal(r.prepared_master_stem_options_answer_match,'MATCHED_PREPARED_PDF_Q_PP103_TO105_AND_KEY_PP110_TO111');
 assert.equal(r.original_source_letter,q.correctOptionId);
 assert.equal(r.original_correct_option_text,q.options.find(o=>o.id===q.correctOptionId).text);
 assert.equal(r.review_result,'SOURCE_KEY_SUPPORTED_RECALCULATED');
 assert.equal(r.teacher_precision_priority,special.get(n)||'OPTIONAL');
 assert.ok(r.individual_teacher_note.trim().length>=15,'A substantive concise calculation note is required');
 assert.notEqual(r.individual_teacher_note.trim(),'undefined');
 assert.equal(r.topic_candidate_slo_only,'P-11-B-35_supporting;P-11-B-36_context_only');
 assert.equal(r.tentative_cognitive_level_not_certified,n>=59?'Knowledge_candidate':'Application_candidate');
 assert.equal(r.individual_exam_slo_scope_status,'PENDING_FLOW_RATE_NOT_DIRECT_B35_CERTIFICATION');
 assert.equal(r.original_printed_nbf_fidelity,'PENDING_ORIGINAL_PRINTED_NBF_PP95_TO96');
 assert.equal(r.teacher_approval,'PENDING');
 const r0=expected[i][1];
 if(r0===null)assert.equal(r.recalculated_numeric_value_or_pair,'CONCEPTUAL');
 else if(Array.isArray(r0)){
  const vals=r.recalculated_numeric_value_or_pair.split(';').map(Number);
  assert.equal(vals.length,r0.length,'Pair value count Q'+n);
  for(let j=0;j<vals.length;j++)assert.ok(approx(vals[j],r0[j]),'Numeric comparison pair mismatch Q'+n);
 }else assert.ok(approx(Number(r.recalculated_numeric_value_or_pair),r0),'Numeric rounding/precision mismatch Q'+n);
}
const doc=read('quality/grade11-unit06-v95c2k-topic63-mcq41-60-numerical-review.md');
assert.ok(doc.includes('20/20 matching stems'));
assert.ok(doc.includes('80/80 matching options'));
assert.ok(doc.includes('20/20 matching answer letters'));
assert.ok(doc.includes('220/560'));
assert.ok(doc.includes('P-11-B-36'));
for(const n of special.keys())assert.ok(doc.includes('Q'+n));
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);
const mCols=parseCSV(master[0]);
for(let i=40;i<60;i++){
 const m=Object.fromEntries(parseCSV(master[161+i]).map((v,j)=>[mCols[j],v]));
 assert.equal(m.source_question_id,qs[i-40].id);
 for(const k of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(m[k],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const approvals=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade11=manifest.grades.find(g=>g.grade===11),unit6=grade11.units.find(u=>u.unit===6),cat=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(unit6.liveMcqCount,560);
assert.equal(grade11.units.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
assert.equal(unit6.standaloneSituationQuestionCount,136);
assert.equal(unit6.independentSharedStimulusGroupCount,0);
assert.equal(unit6.perQuestionSloVerified,false);
assert.equal(unit6.exactFbiseModeReady,false);
assert.equal(cat.status,'planned');
assert.equal(cat.assessmentStatus,'not-published');
assert.equal(approvals.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2K PASS: 18 quantitative / 2 conceptual, 20 original keys retained, 20 FBISE-scope approvals PENDING, Unit6 release held.');
