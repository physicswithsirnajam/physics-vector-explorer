#!/usr/bin/env node
'use strict';
/* V131 synthetic notation test + complete source integrity review.
 * No student-visible corrections, original answers, or student records accessed.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {output,notationSignals,parts,buildReport}=require('./audit_grade11_math_notation_v131.cjs');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const hash=p=>crypto.createHash('sha256').update(read(p)).digest('hex');
const protectedSource=[
 'shared/practice-bank-adapter-v55.js',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json',
 'question-bank/manifest.json','practice-engine/index.html','portal/exam-quick-access.html'
];
function syntheticChecks(){
 const slash=String.fromCharCode(92);
 const cases=[
  [slash+'vec{v}',['RAW_TEX_COMMAND']],
  [slash+'frac{1}{2}',['RAW_TEX_COMMAND']],
  [slash+'(F=ma'+slash+')',['RAW_TEX_MATH_DELIMITER']],
  ['v\u20D7',['COMBINING_VECTOR_ARROW','UNICODE_VECTOR_ARROW']],
  ['x\u0305',['COMBINING_OVERLINE']],
  ['m^2',['ASCII_POWER_NOTATION']],
  ['&rarr;',['ENTITY_IN_LITERAL_TEXT']],
  ['<sup>2</sup>',['RAW_HTML_MATH_TAG_IN_PLAIN_TEXT']]
 ];
 for(const [value,expected] of cases){
  const codes=notationSignals(value,'synthetic').map(x=>x.code);
  for(const code of expected)assert.ok(codes.includes(code),'Missed synthetic notation '+code);
 }
 assert.deepEqual(notationSignals('4.5 m/s with no markup','stem'),[]);
 assert.equal(parts({
  stem:'question',explanation:'details',stimulusText:'scene',
  options:[{id:'A',text:'a'},{id:'B',text:'b'},{id:'C',text:'c'},{id:'D',text:'d'}]
 }).filter(x=>x[0].startsWith('option-')).length,4);
}
async function main(){
 const before=Object.fromEntries(protectedSource.map(p=>[p,hash(p)]));
 syntheticChecks();
 const report=await buildReport();
 assert.equal(report.version,'V131');
 assert.equal(report.sourceCount,2250);
 assert.equal(report.sourceQuestionsModified,0);
 assert.equal(report.sourceAnswersModified,0);
 assert.equal(report.scientificAnswerSignoff,false);
 assert.equal(report.unit6FormalRelease,false);
 assert.equal(report.containsStemsOptionsAnswersExplanations,false);
 assert.deepEqual(Object.values(report.unitSummary).map(u=>u.sourceMCQs),[275,206,220,640,349,560]);
 assert.equal(Object.values(report.unitSummary).reduce((n,u)=>n+u.signals,0),report.signalCount);
 assert.equal(Object.values(report.unitSummary).reduce((n,u)=>n+u.candidateQuestions,0),report.candidateCount);
 assert.equal(report.findings.length,report.signalCount);
 for(const f of report.findings){
  assert.ok(/^\S+$/.test(f.id));
  assert.ok(Number.isInteger(f.unit)&&f.unit>=1&&f.unit<=6);
  assert.ok(Number.isInteger(f.sourceQuestionNumber));
  assert.ok(typeof f.code==='string'&&typeof f.location==='string');
  assert.deepEqual(Object.keys(f).sort(),['code','id','location','sourceQuestionNumber','unit'].sort());
 }
 const json=JSON.stringify(report);
 // Only property keys containing source content are disallowed; a location *value*
 // such as "stem" or "explanation" is safe and required for targeted teacher review.
 assert.ok(!/"(?:correctOptionId|stem|explanation|options|answer)"\s*:/.test(json),
  'Review artifact must never export source stems, keys, options, explanations or answers');
 const after=Object.fromEntries(protectedSource.map(p=>[p,hash(p)]));
 assert.deepEqual(after,before,'Read-only V131 audit changed protected scientific sources');
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
 console.log('V131 PASS: 2250 original source refs, '+report.candidateCount+
  ' notation candidates, '+report.signalCount+' advisory signals; source integrity and no-answer-export verified.');
}
main().catch(e=>{console.error('V131 TEST FAILED:',e.stack||e);process.exitCode=1;});
