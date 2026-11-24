#!/usr/bin/env node
'use strict';
/* V128: local, read-only, source-based Grade XI MCQ integrity and suspicious-rendering triage.
 * The original checked-in V55 adapter is executed ONLY as trusted CI code,
 * using a local allowlisted source path. Node vm is NOT a sandbox for untrusted input.
 * No answers, stems, explanations, private records or Firebase calls enter the artifact.
 * Passing does NOT verify the scientific correctness of answers or teacher SLO signoff.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v128-mcq-triage/triage.json');
const counts=Object.freeze({1:275,2:206,3:220,4:640,5:349,6:560});
const total=2250;
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bankRoot=path.resolve(root,'question-bank/grade-11');
const allowed=/^(?:\.\.\/)?question-bank\/grade-11\/([A-Za-z0-9_.-]+\.(?:json|b64))$/;

function scanQuestion(q){
 const signals=[];
 const add=(code,location)=>signals.push({code,location});
 const options=Array.isArray(q.options)?q.options:[];
 const normalized=v=>String(v||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLowerCase();
 const seen=new Map();
 for(const o of options){
  const canonical=normalized(o.text);
  if(seen.has(canonical))add('DUPLICATE_OPTION_TEXT',seen.get(canonical)+'/'+o.id);
  else seen.set(canonical,o.id);
 }
 const parts=[
  ['stem',q.stem],...options.map(o=>['option-'+o.id,o.text]),
  ['explanation',q.explanation],['stimulus',q.stimulusHtml]
 ];
 for(const [location,value] of parts){
  if(typeof value!=='string')continue;
  if(value.includes(String.fromCharCode(0xfffd)))add('REPLACEMENT_CHARACTER',location);
  // A literal square often represents a lost scientific/vector glyph in pasted sources.
  // It might be intentional; this is only a teacher-review signal.
  if(value.includes(String.fromCharCode(0x25a1)))add('LITERAL_SQUARE_GLYPH',location);
  if(/\$\{[A-Za-z_][^}]{0,100}\}/.test(value))add('UNRESOLVED_TEMPLATE_TOKEN',location);
 }
 return signals;
}

function localFetch(url){
 const match=allowed.exec(url);
 if(!match)throw Error('V128 rejected unapproved source path');
 const file=path.resolve(bankRoot,match[1]);
 if(!file.startsWith(bankRoot+path.sep))throw Error('V128 unsafe source path');
 const raw=fs.readFileSync(file,'utf8');
 return Promise.resolve(Object.freeze({
  ok:true,status:200,json:async()=>JSON.parse(raw),text:async()=>raw
 }));
}

async function buildReport(){
 const manifest=JSON.parse(read('server/review-manifests/grade11-approved-public-review-refs-v99i.json'));
 const matrix=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
 const engine=read('practice-engine/index.html');
 assert.equal(manifest.publicPracticeOnly,true);
 assert.deepEqual(manifest.unitCounts,counts);
 assert.equal(manifest.questionRefs.length,total);
 assert.equal(new Set(manifest.questionRefs.map(q=>q[0])).size,total);
 assert.equal(matrix.releaseApproved,false);
 assert.equal(matrix.teacherSignoff,'pending');
 assert.equal(matrix.studentCourseStatus,'planned');
 assert.equal(matrix.topics.length,7);
 assert.equal(matrix.topics.reduce((n,t)=>n+t.teacherIssueIDs.length,0),65);
 assert.ok(engine.includes('Copy issue report'));
 assert.ok(engine.includes('no report has been sent automatically'));
 assert.ok(!engine.includes('Send issue report'));
 const idIndex=new Map(manifest.questionRefs.map(row=>[row[0],row]));
 const ctx=vm.createContext({
  fetch:localFetch,Blob,Response,DecompressionStream,Uint8Array,atob,
  TextDecoder,TextEncoder
 });
 vm.runInContext(read('shared/practice-bank-adapter-v55.js'),ctx,
  {filename:'trusted-checked-in-practice-bank-adapter-v55.js',timeout:4000});
 const adapter=ctx.PSNPracticeBankV55;
 assert.ok(adapter&&typeof adapter.loadBank==='function');
 const findings=[],classification={};
 for(let unit=1;unit<=6;unit++){
  const bank=await adapter.loadBank(unit,'../question-bank/grade-11/');
  assert.equal(bank.unit,unit);
  assert.equal(bank.grade,11);
  assert.equal(bank.publicSelfPractice,true);
  assert.equal(bank.secureExam,false);
  assert.equal(bank.questions.length,counts[unit]);
  assert.equal(bank.bankVersion,manifest.bankVersions[String(unit)]);
  classification[unit]={total:counts[unit],formative:0,summativeTheory:0,topicProvisional:0,advisorySignals:0};
  for(const q of bank.questions){
   const ref=idIndex.get(q.id);
   assert.ok(ref,'Missing signed public question reference '+q.id);
   assert.equal(ref[1],unit);
   assert.equal(ref[2],q.sourceQuestionNumber);
   assert.equal(q.options.length,4);
   assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
   assert.ok(q.options.every(o=>typeof o.text==='string'&&o.text.trim()));
   assert.ok(q.options.some(o=>o.id===q.correctOptionId));
   assert.ok(typeof q.stem==='string'&&q.stem.trim());
   assert.ok(typeof q.explanation==='string'&&q.explanation.trim());
   const key=q.assessmentClassification==='formative'?'formative':
    q.assessmentClassification==='summative-theory'?'summativeTheory':'topicProvisional';
   classification[unit][key]++;
   for(const s of scanQuestion(q)){
    // Only stable source IDs and signal locations are exported. Never export correct answers,
    // options, questions, stimulus, explanations, student reports or protected source pages.
    findings.push({unit,id:q.id,sourceQuestionNumber:q.sourceQuestionNumber,...s});
    classification[unit].advisorySignals++;
   }
  }
 }
 assert.equal(Object.values(classification).reduce((s,x)=>s+x.total,0),total);
 assert.equal(classification[6].topicProvisional,560);
 assert.equal(classification[3].formative,60);
 const summary=Object.fromEntries([...new Set(findings.map(f=>f.code))].sort().map(code=>[
  code,findings.filter(f=>f.code===code).length
 ]));
 return {
  version:'V128',scope:'offline-checked-in-grade11-public-self-practice',
  checkedUnits:[1,2,3,4,5,6],checkedQuestionCount:total,
  sourceBankStructuralValidationPassed:true,individualAnswerScientificQCComplete:false,
  individualFBISESLOCognitiveQCComplete:false,automatedCorrectionsMade:0,
  studentPagesChanged:false,studentRecordsAccessed:false,
  reportIntake:'Copy-only: no live teacher inbox',
  unit6TeacherIssueRegisterCount:65,unit6ItemSignoff:'PENDING',
  unit6StudentCourseStatus:'planned',unit6FormalAssessmentReleased:false,
  signalsAreAdvisory:true,signalCounts:summary,byUnit:classification,
  findings
 };
}

async function main(){
 const report=await buildReport();
 fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
 console.log('V128 PASS: 2250 original public MCQs passed source and A-D structural validation.');
 console.log('V128 TRIAGE: '+report.findings.length+' advisory visual/duplicate-option signals. Review artifact IDs; do not auto-correct.');
 console.log('V128 GATES: 65 Unit6 teacher issues; 560 item signoffs PENDING; report intake Copy-only; no official exam release.');
}
if(require.main===module)main().catch(e=>{console.error('V128 FAILED:',e.stack||e);process.exitCode=1;});
module.exports=Object.freeze({out,scanQuestion,buildReport});
