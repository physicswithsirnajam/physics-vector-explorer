#!/usr/bin/env node
'use strict';
/* V128 read-only audit regression with synthetic corrupt text (no real answer edits). */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const {out,scanQuestion,buildReport}=require('./audit_grade11_mcq_triage_v128.cjs');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const protectedFiles=[
 'shared/practice-bank-adapter-v55.js',
 'server/approved-practice-catalog-v99g.cjs',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json',
 'question-bank/manifest.json',
 'portal/exam-quick-access.html',
 'practice-engine/index.html'
];
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');

async function main(){
 const before=Object.fromEntries(protectedFiles.map(p=>[p,hash(read(p))]));
 const fake={
  stem:'A replacement '+String.fromCharCode(0xfffd)+' and vector '+String.fromCharCode(0x25a1),
  options:[
   {id:'A',text:'7 m/s'},{id:'B',text:' 7 m/s '},
   {id:'C',text:'8 m/s'},{id:'D',text:'9 m/s'}
  ],
  explanation:'Check the visible expression '+('$'+'{sourceToken}')
 };
 const codes=scanQuestion(fake).map(s=>s.code);
 for(const code of ['DUPLICATE_OPTION_TEXT','REPLACEMENT_CHARACTER',
  'LITERAL_SQUARE_GLYPH','UNRESOLVED_TEMPLATE_TOKEN'])
  assert.ok(codes.includes(code),'Synthetic signal not detected: '+code);
 assert.deepEqual(scanQuestion({
  stem:'A stable original source',options:[
   {id:'A',text:'1'},{id:'B',text:'2'},{id:'C',text:'3'},{id:'D',text:'4'}
  ],explanation:'Pure, clear answer explanation',stimulusHtml:''
 }),[],'Valid synthetic options must not be flagged');
 const report=await buildReport();
 assert.equal(report.version,'V128');
 assert.equal(report.checkedQuestionCount,2250);
 assert.equal(report.sourceBankStructuralValidationPassed,true);
 assert.equal(report.individualAnswerScientificQCComplete,false);
 assert.equal(report.individualFBISESLOCognitiveQCComplete,false);
 assert.equal(report.automatedCorrectionsMade,0);
 assert.equal(report.reportIntake,'Copy-only: no live teacher inbox');
 assert.equal(report.unit6ItemSignoff,'PENDING');
 assert.equal(report.unit6TeacherIssueRegisterCount,65);
 assert.equal(report.unit6FormalAssessmentReleased,false);
 assert.deepEqual(report.checkedUnits,[1,2,3,4,5,6]);
 assert.deepEqual(Object.values(report.byUnit).map(x=>x.total),[275,206,220,640,349,560]);
 assert.equal(report.byUnit[3].formative,60);
 assert.equal(report.byUnit[6].topicProvisional,560);
 assert.equal(report.findings.length,Object.values(report.signalCounts).reduce((a,b)=>a+b,0));
 for(const f of report.findings){
  assert.equal(typeof f.id,'string');
  assert.ok(Number.isInteger(f.unit)&&f.unit>=1&&f.unit<=6);
  assert.ok(Number.isInteger(f.sourceQuestionNumber));
  assert.ok(['DUPLICATE_OPTION_TEXT','REPLACEMENT_CHARACTER','LITERAL_SQUARE_GLYPH','UNRESOLVED_TEMPLATE_TOKEN'].includes(f.code));
  assert.ok(!Object.hasOwn(f,'stem')&&!Object.hasOwn(f,'answer')&&!Object.hasOwn(f,'correctOptionId'));
 }
 fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
 const artifact=fs.readFileSync(out,'utf8');
 assert.ok(!/"correctOptionId"|"stem"|"explanation"|"options"\s*:/.test(artifact),
  'CI artifact must not expose questions, options or correct answers');
 const after=Object.fromEntries(protectedFiles.map(p=>[p,hash(read(p))]));
 assert.deepEqual(after,before,'V128 changed protected sources or student content');
 console.log('V128 PASS: all 2250 public source MCQs structurally validated, '+report.findings.length+' source-ID-only advisory signals, original practice/source/academic-gate files unchanged.');
}
main().catch(e=>{console.error('V128 REGRESSION FAILED:',e.stack||e);process.exitCode=1;});
