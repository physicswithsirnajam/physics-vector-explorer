#!/usr/bin/env node
'use strict';
/* V131 — teacher-facing, read-only notation candidate triage from the current
 * ORIGINAL public Grade XI banks. Possible display risks, not confirmed defects.
 * Trusted checked-in adapter ONLY, via a local allowlisted filesystem fetch.
 * vm is not a security boundary: never evaluate user-supplied JavaScript.
 * Output is SOURCE ID + location + code only, never the original question text,
 * answer options, solution, student data, private textbook or answer key.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'qa-artifacts/grade11-v131-math-notation-triage/review-queue.json');
const EXPECTED=Object.freeze({1:275,2:206,3:220,4:640,5:349,6:560});
const TOTAL=2250;
const sourceFolder=path.join(root,'question-bank/grade-11');
const sourcePath=/^(?:\.\.\/)?question-bank\/grade-11\/([A-Za-z0-9_.-]+\.(?:json|b64))$/;
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

/** Interpret flags as review requests, never automatic evidence of bad science. */
function notationSignals(value,location){
 if(typeof value!=='string'||!value)return [];
 const rules=[
  ['RAW_TEX_COMMAND', /\\(?:vec|overrightarrow|overleftarrow|hat|bar|frac|dfrac|tfrac|sqrt|times|cdot|theta|alpha|beta|gamma|Delta|nabla|sum|int)\b/u],
  ['RAW_TEX_MATH_DELIMITER', /\\\(|\\\[|(?<!\\)\$[^\r\n$]{1,120}(?<!\\)\$/u],
  ['COMBINING_VECTOR_ARROW', /\u20D7/u],
  ['COMBINING_OVERLINE', /\u0305/u],
  ['ENTITY_IN_LITERAL_TEXT', /&(?:rarr|larr|harr|rightarrow|leftarrow|times|divide|deg|alpha|beta|gamma|theta|pi|minus|radic|sup[23]|#[xX]?[a-fA-F0-9]+);/u],
  ['RAW_HTML_MATH_TAG_IN_PLAIN_TEXT', /<\/?(?:math|mfrac|sup|sub|span|mi|mo|mn)\b[^>]*>/iu],
  ['ASCII_POWER_NOTATION', /(?:[A-Za-z0-9])\^(?:\{?-?\d{1,4}\}?|[xyz])/u],
  ['UNICODE_VECTOR_ARROW', /[\u20D6\u20D7\u20E1]/u]
 ];
 return rules.filter(([,pattern])=>pattern.test(value)).map(([code])=>({code,location}));
}

function parts(question){
 const list=[['stem',question.stem],['explanation',question.explanation],
  ['stimulusText',question.stimulusText],['stemHtml',question.stemHtml],
  ['explanationHtml',question.explanationHtml],['stimulusHtml',question.stimulusHtml]];
 if(Array.isArray(question.options))for(const o of question.options){
  if(o&&'ABCD'.includes(o.id)&&typeof o.id==='string'){
   list.push(['option-'+o.id,o.text],['optionHtml-'+o.id,o.html]);
  }
 }
 return list;
}

async function localFetch(url){
 const match=sourcePath.exec(url);
 if(!match)throw Error('V131 rejected unapproved source URL');
 const location=path.resolve(sourceFolder,match[1]);
 if(!location.startsWith(sourceFolder+path.sep))throw Error('V131 rejected source traversal');
 const content=fs.readFileSync(location,'utf8');
 return Object.freeze({ok:true,status:200,json:async()=>JSON.parse(content),text:async()=>content});
}

async function buildReport(){
 const signed=JSON.parse(read('server/review-manifests/grade11-approved-public-review-refs-v99i.json'));
 assert.equal(signed.publicPracticeOnly,true);
 assert.deepEqual(signed.unitCounts,EXPECTED);
 assert.equal(signed.questionRefs.length,TOTAL);
 const reference=new Map(signed.questionRefs.map(row=>[row[0],row]));
 assert.equal(reference.size,TOTAL);
 const matrix=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
 assert.equal(matrix.releaseApproved,false);
 assert.equal(matrix.teacherSignoff,'pending');
 assert.equal(matrix.studentCourseStatus,'planned');
 const sandbox=vm.createContext({
  fetch:localFetch,Blob,Response,DecompressionStream,Uint8Array,
  atob,TextDecoder,TextEncoder
 });
 vm.runInContext(read('shared/practice-bank-adapter-v55.js'),sandbox,
  {filename:'checked-in-public-v55-source-adapter.js',timeout:4000});
 const adapter=sandbox.PSNPracticeBankV55;
 assert.ok(adapter&&typeof adapter.loadBank==='function');
 const findings=[],unitSummary={};
 for(let unit=1;unit<=6;unit++){
  const bank=await adapter.loadBank(unit,'../question-bank/grade-11/');
  assert.equal(bank.grade,11);
  assert.equal(bank.unit,unit);
  assert.equal(bank.publicSelfPractice,true);
  assert.equal(bank.secureExam,false);
  assert.equal(bank.questions.length,EXPECTED[unit]);
  assert.equal(bank.bankVersion,signed.bankVersions[String(unit)]);
  let questionCandidates=0,signals=0;
  for(const q of bank.questions){
   const row=reference.get(q.id);
   assert.ok(row,'Missing source public question ID');
   assert.equal(row[1],unit);
   assert.equal(row[2],q.sourceQuestionNumber);
   let hasFlag=false;
   for(const [location,value] of parts(q)){
    for(const f of notationSignals(value,location)){
     findings.push({unit,id:q.id,sourceQuestionNumber:q.sourceQuestionNumber,...f});
     hasFlag=true;
     signals++;
    }
   }
   if(hasFlag)questionCandidates++;
  }
  unitSummary[unit]={sourceMCQs:EXPECTED[unit],candidateQuestions:questionCandidates,signals};
 }
 const kindCounts={};
 for(const finding of findings)kindCounts[finding.code]=(kindCounts[finding.code]||0)+1;
 const report={
  version:'V131',kind:'read-only-teacher-review-candidates',scope:'all-current-public-grade11-source-mcqs',
  sourceCount:TOTAL,unitSummary,candidateCount:Object.values(unitSummary).reduce((n,x)=>n+x.candidateQuestions,0),
  signalCount:findings.length,signalKinds:Object.fromEntries(Object.entries(kindCounts).sort()),
  findings,
  caveats:[
   'A notation signal is a candidate for visual inspection, not proof of a defect.',
   'Unicode combining arrows, raw powers, and encoded math may render correctly in their intended viewer.',
   'Absence of signals is not proof of correct vector/MathML appearance or a scientifically correct answer.',
   'Independent NBF/source comparison and real browser checks are still required.',
   'Original item-level Unit 6 SLO, cognitive and teaching signoffs remain pending.'
  ],
  sourceQuestionsModified:0,sourceAnswersModified:0,
  scientificAnswerSignoff:false,unit6FormalRelease:false,
  containsStemsOptionsAnswersExplanations:false
 };
 return report;
}

async function main(){
 const report=await buildReport();
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
 console.log('V131 PASS: '+report.sourceCount+' source MCQs matched their signed question IDs and original counts.');
 console.log('V131 ADVISORY: '+report.candidateCount+' question IDs, '+report.signalCount+' notation signals; inspect artifact before deciding any correction.');
 console.log('V131 GATES: No keys, answers, question texts, academic approvals or student data changed or exported.');
}
if(require.main===module)main().catch(e=>{console.error('V131 FAILED:',e.stack||e);process.exitCode=1;});
module.exports=Object.freeze({output,notationSignals,parts,buildReport});
