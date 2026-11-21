#!/usr/bin/env node
'use strict';
/* V95-C2N — private prepared-PDF text compared outside GitHub CI.
 * CI asserts current GitHub snapshot provenance, ONE KNOWN Q28 OPTION B
 * truncation, teacher decision records and release hold. It is NOT a claim
 * that all 80 public choices match the prepared PDF or are exam-approved.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-64-v82-80-source.json'));
const qs=bank.questions.slice(20,40);
assert.equal(bank.bankId,'PSN-XI-U06-T64-V82');
assert.equal(bank.questions.length,80);
assert.equal(qs.length,20);
assert.equal(qs.map(q=>q.correctOptionId).join(''),'DCADDBBBDDDBCCDBBDBA');
assert.deepEqual(qs.map(q=>q.sourcePdfPage),[139,140,140,140,140,140,140,140,141,141,141,141,141,141,141,141,142,142,142,142]);
for(let i=0;i<20;i++){
 const q=qs[i],n=i+21;
 assert.equal(q.id,'XI-U06-T64-MCQ-'+String(n).padStart(4,'0'));
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
let digest=2166136261;
for(const char of snap)digest=Math.imul(digest^char.charCodeAt(0),16777619)>>>0;
assert.equal(digest,0x162869ac,'Original public source changed: reconcile Q28 or other option with reviewed teacher master');
function parseCSV(line){
 const out=[];let value='',quoted=false;
 for(let i=0;i<line.length;i++){
  const ch=line[i];
  if(ch==='"'&&quoted&&line[i+1]==='"'){value+='"';i++;continue;}
  if(ch==='"'){quoted=!quoted;continue;}
  if(ch===','&&!quoted){out.push(value);value='';continue;}
  value+=ch;
 }
 assert.equal(quoted,false,'Unmatched CSV quote');
 out.push(value);return out;
}
const input=read('quality/grade11-unit06-v95c2n-topic64-mcq21-40-conceptual-review.csv').trimEnd().split(/\r?\n/);
assert.equal(input.length,21,'20 source rows and header');
const fields=parseCSV(input[0]);assert.equal(fields.length,21);
const rows=input.slice(1).map(line=>Object.fromEntries(parseCSV(line).map((v,i)=>[fields[i],v])));
assert.equal(new Set(rows.map(x=>x.source_question_id)).size,20);
const mandatory=new Map([[27,'COMPULSORY_HOSE_MODEL_NOTE'],[28,'COMPULSORY_SOURCE_OPTION_FIX'],[30,'COMPULSORY_BRANCH_GEOMETRY_NOTE'],[31,'COMPULSORY_COMPRESSIBLE_MODEL_NOTE'],[37,'COMPULSORY_BRANCH_SLO_NOTE'],[39,'COMPULSORY_CONTRADICTION_NOTE'],[40,'COMPULSORY_TRIBUTARY_SOURCE_NOTE']]);
const candidateB38=new Set([31,32,33,34,37,40]);
for(let i=0;i<20;i++){
 const n=i+21,q=qs[i],r=rows[i];
 assert.equal(r.source_question_id,q.id);
 assert.equal(r.topic,'6.4');
 assert.equal(r.source_number,String(n));
 assert.equal(r.prepared_question_pdf_page,String(q.sourcePdfPage));
 assert.equal(r.prepared_answer_pdf_page,n===21?'148':'149');
 assert.equal(r.prepared_stem_match,'MATCHED_PREPARED_PDF_PP139_TO142');
 assert.equal(r.prepared_option_match_count,n===28?'3':'4');
 assert.equal(r.prepared_key_match,'MATCHED_PREPARED_KEY_P148_TO149');
 assert.equal(r.source_correct_letter,q.correctOptionId);
 assert.equal(r.source_section,'reasoning');
 assert.equal(r.scientific_key_result,n===28?'KEY_SUPPORTED_OPTION_TRUNCATED':'SOURCE_KEY_SCIENTIFICALLY_SUPPORTED');
 assert.equal(r.amendment_priority,mandatory.get(n)||(['OPTIONAL_GEOMETRY_NOTE','OPTIONAL_COGNITION_NOTE'].includes(r.amendment_priority)?r.amendment_priority:'OPTIONAL'));
 assert.ok(r.amendment_type.length>10);
 assert.ok(r.teacher_review_note.trim().length>=20,'Teacher note must contain a substantive scientific explanation for Q'+n);
 assert.notEqual(r.teacher_review_note.trim(),'undefined');
 const slo=n===27?'P-11-B-37':candidateB38.has(n)?'P-11-B-38':'P-11-B-36';
 assert.equal(r.candidate_topic_slo_only,slo);
 assert.ok(['Understanding','Application'].includes(r.candidate_cognition_not_certified));
 assert.equal(r.original_nbf_print_fidelity,'PENDING_ORIGINAL_NBF_PP96_TO99');
 assert.equal(r.individual_exam_certification,'PENDING');
 assert.equal(r.teacher_approval,'PENDING');
 if(n===28){
  assert.equal(q.options.find(o=>o.id==='B').text,'Its speed increases while approximately the same water volume passes each level per');
  assert.equal(r.source_option_B_text,q.options.find(o=>o.id==='B').text);
  assert.equal(r.prepared_option_B_text,r.source_option_B_text+' second');
  assert.equal(q.correctOptionId,'B');
 }else{
  assert.equal(r.source_option_B_text,'');
  assert.equal(r.prepared_option_B_text,'');
 }
}
assert.equal(20*4-1,79,'Current public options exact-match prepared PDF count');
const report=read('quality/grade11-unit06-v95c2n-topic64-mcq21-40-conceptual-review.md');
assert.ok(report.includes('20/20 matching stems'));
assert.ok(report.includes('79/80 matching options'));
assert.ok(report.includes('20/20 matching answer letters'));
assert.ok(report.includes('280/560'));
assert.ok(report.includes('COMPULSORY SOURCE CORRECTION'));
for(const n of mandatory.keys())assert.ok(report.includes('XI-U06-T64-MCQ-'+String(n).padStart(4,'0')));
assert.equal(qs.find(x=>x.sourceQuestionNumber===27).correctOptionId,'B');
assert.equal(qs.find(x=>x.sourceQuestionNumber===30).correctOptionId,'D');
assert.equal(qs.find(x=>x.sourceQuestionNumber===31).correctOptionId,'D');
assert.equal(qs.find(x=>x.sourceQuestionNumber===37).correctOptionId,'B');
assert.equal(qs.find(x=>x.sourceQuestionNumber===39).correctOptionId,'B');
assert.equal(qs.find(x=>x.sourceQuestionNumber===40).correctOptionId,'A');
assert.equal(2*(1/2),1,'Inverse area-speed ratio');
assert.equal((1/2)**2,0.25,'Circular diameter halving gives quarter area');
assert.equal(1/(1/2)**2,4,'Quarter-area gives fourfold speed');
assert.equal(3*2,6,'Q39 incompatibility must be recognized');
assert.equal(3+2,5,'Branch continuity example');
const master=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(master.length,561);
const mh=parseCSV(master[0]);
for(let i=20;i<40;i++){
 const row=Object.fromEntries(parseCSV(master[241+i]).map((v,j)=>[mh[j],v]));
 assert.equal(row.source_question_id,qs[i-20].id);
 for(const status of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(row[status],'PENDING');
}
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade11=manifest.grades.find(g=>g.grade===11);
const unit6=grade11.units.find(u=>u.unit===6);
const cat=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(unit6.liveMcqCount,560);
assert.equal(grade11.units.reduce((s,u)=>s+u.liveMcqCount,0),2250);
assert.equal(unit6.standaloneSituationQuestionCount,136);
assert.equal(unit6.independentSharedStimulusGroupCount,0);
assert.equal(unit6.perQuestionSloVerified,false);
assert.equal(unit6.exactFbiseModeReady,false);
assert.equal(cat.status,'planned');
assert.equal(cat.assessmentStatus,'not-published');
assert.equal(signoff.releaseApproved,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
console.log('V95-C2N PASS: Topic6.4 20 stems/20 letters, 79/80 option fidelity, Q28(B) incomplete flagged; 7 teacher notes; 280/560 inspected, approvals pending.');
