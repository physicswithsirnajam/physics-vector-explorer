#!/usr/bin/env node
'use strict';
/* V99-A: real Grade XI source IDs, strict report allowlist and no-side-effect
 * intake contract. Node only, entirely offline; no Firebase deployment. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const c=require('../shared/mcq-review-contract-v99a.js');
const source=fs.readFileSync(path.join(root,'shared/mcq-review-contract-v99a.js'),'utf8');
assert.ok(!/\b(fetch|XMLHttpRequest|sendBeacon)\s*\(/.test(source),'pure draft module may never transmit data');
assert.ok(!/\b(import\s+[^;]*firebase|https?:\/\/)/.test(source),'no external import or network address in contract');
const names=['missing-context','incorrect-key','unclear-wording','formula-display','other'];
assert.deepEqual([...c.CATEGORIES],names);
const exactFields=['schemaVersion','kind','grade','unit','questionId','sourceQuestionNumber','bankVersion','category','note','origin'];
assert.deepEqual([...c.ALLOWED_KEYS],exactFields);
const sources=[
 'question-bank/grade-11/unit-01.json',
 'question-bank/grade-11/unit-02.json',
 'question-bank/grade-11/unit-03-stage2-80-practice.json',
 'question-bank/grade-11/unit-04-v39-80-practice.json',
 'question-bank/grade-11/unit-05-v50-16-student.json',
 'question-bank/grade-11/unit-06-topic-61-v76-80-source.json'
];
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const tested=[];
for(let u=1;u<=6;u++){
 const bank=load(sources[u-1]),q=bank.questions[0];
 const original={
  unit:u,questionId:q.id,sourceQuestionNumber:q.sourceQuestionNumber,
  bankVersion:String(bank.bankVersion||bank.version||'unit05-adapter-version'),
  category:names[(u-1)%names.length],note:'  Problem noticed in the source image or wording.  ',
  uid:'user-secret',email:'private@example.com',displayName:'Student',answers:['B'],correctOptionId:q.correctOptionId,
  score:0,password:'never-copy',teacherAccess:true,teacherNotes:'injected-note',status:'approved'
 };
 const report=c.buildDraft(original);
 assert.deepEqual(Object.keys(report),exactFields,'exact allowlisted fields for source Unit '+u);
 assert.deepEqual(c.validateDraft(report),{ok:true,issues:[]});
 assert.equal(report.unit,u);
 assert.equal(report.questionId,q.id);
 assert.equal(report.sourceQuestionNumber,q.sourceQuestionNumber);
 assert.equal(report.note,'Problem noticed in the source image or wording.');
 assert.equal(report.kind,'grade11-mcq-review');
 assert.equal(report.grade,11);
 assert.equal(report.origin,'practice-engine');
 assert.equal(report.schemaVersion,1);
 assert.ok(c.toTeacherLabel(report).includes(q.id));
 const encoded=JSON.stringify(report);
 for(const forbidden of ['user-secret','private@example.com','Student','never-copy','approved','teacherNotes','correctOptionId','answers','score','password','uid','email','displayName','teacherAccess']){
  assert.equal(encoded.includes(forbidden),false,'source Unit '+u+' report leaked prohibited metadata: '+forbidden);
 }
 tested.push({unit:u,id:q.id,sourceQuestionNumber:q.sourceQuestionNumber,category:report.category});
}
const valid=c.buildDraft({
 unit:6,questionId:'XI-U06-T61-MCQ-0001',sourceQuestionNumber:1,
 bankVersion:'verified-source-ref',category:'other',note:'Review this question.'
});
for(const forged of [
 {...valid,uid:'someone-else'},
 {...valid,status:'resolved'},
 {...valid,correctOptionId:'A'},
 {...valid,correctCount:40},
 {...valid,createdAt:Date.now()},
 {...valid,ownerUid:'admin'},
 {...valid,kind:'secure-exam'},
 {...valid,grade:12},
 {...valid,origin:'teacher-admin'},
 {...valid,category:'mark-me-correct'},
 {...valid,sourceQuestionNumber:1.5},
 {...valid,unit:7},
 {...valid,questionId:'a b<script>alert(1)</script>'}
]){
 assert.equal(c.validateDraft(forged).ok,false,'client cannot forge report metadata or extra fields');
}
for(const bad of [
 {unit:0,questionId:'XI-U01-MCQ-0001',sourceQuestionNumber:1,bankVersion:'v1',category:'other',note:''},
 {unit:7,questionId:'XI-U07-MCQ-0001',sourceQuestionNumber:1,bankVersion:'v1',category:'other',note:''},
 {unit:2,questionId:'XI-U01-MCQ-0001',sourceQuestionNumber:1,bankVersion:'v1',category:'other',note:''},
 {unit:2,questionId:'bad id',sourceQuestionNumber:1,bankVersion:'v1',category:'other',note:''},
 {unit:2,questionId:'XI-U02-MCQ-0001',sourceQuestionNumber:0,bankVersion:'v1',category:'other',note:''},
 {unit:2,questionId:'XI-U02-MCQ-0001',sourceQuestionNumber:1,bankVersion:'',category:'other',note:''},
 {unit:2,questionId:'XI-U02-MCQ-0001',sourceQuestionNumber:1,bankVersion:'v1',category:'not-allowed',note:''},
 {unit:2,questionId:'XI-U02-MCQ-0001',sourceQuestionNumber:1,bankVersion:'v1',category:'other',note:'x'.repeat(501)},
 {unit:2,questionId:'XI-U02-MCQ-0001',sourceQuestionNumber:1,bankVersion:'v'.repeat(121),category:'other',note:''}
]){
 assert.throws(()=>c.buildDraft(bad),'invalid input should fail before any eventual server send');
}
assert.equal(c.validateDraft(null).ok,false);
assert.equal(c.validateDraft({}).ok,false);
assert.equal(c.validateDraft({...valid,note:valid.note+'\u0000'}).ok,false,'control chars not accepted as canonical inbound values');
assert.deepEqual(c.buildDraft({...valid,note:'  ok\nnext \u0000line  '}).note,'ok\nnext line','safe text cleanup');
assert.equal(c.buildDraft({...valid,note:''}).note,'','issue report note may be optional');
const originalEngine=fs.readFileSync(path.join(root,'practice-engine/index.html'),'utf8');
assert.ok(originalEngine.includes('Copy issue report'),'existing button remains copy-only and clearly labelled');
assert.ok(originalEngine.includes('no report has been sent automatically'),'no deceptive submission success message');
assert.ok(originalEngine.includes('makeMcqIssueReport'),'existing user-visible report generator remains');
console.log('PASS V99-A: strict report allowlist, six genuine Grade XI source question IDs, five supported issue kinds, 500-char note cap, no PII/answers/scores/teacher permissions copied, forged fields fail, module is offline.');
console.log('Source sample IDs:',tested.map(r=>'Unit '+r.unit+': '+r.id).join('; '));
console.log('Important: no report receiving endpoint, teacher inbox or Firestore rules were deployed by this PR.');
