#!/usr/bin/env node
'use strict';
/* V235: original NBF XI printed pp150–153 exercise metadata only.
 * Source stems/options and answer keys deliberately do not enter GitHub.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const inv=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const baseline=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const catalogue=json('portal/learning-catalog.json');
const bank=json('question-bank/manifest.json');
const audit=read('quality/unit08/unit08-v235-exercise-inventory-qc.md');
assert.equal(inv.schema,'psn-unit8-exercise-original-source-index-v235');
assert.equal(inv.version,'V235');
assert.equal(inv.source.sha256,baseline.originalTextbook.sha256);
assert.deepEqual(inv.source.printedPages,[150,153]);
assert.deepEqual(baseline.originalTextbook.exercisePrintedPages,[150,153]);
assert.equal(inv.scope.includes('no answers/solutions'),true);
assert.equal(inv.sourceSections.length,4);
const groups=Object.fromEntries(inv.sourceSections.map(g=>[g.kind,g]));
assert.deepEqual(Object.keys(groups).sort(),['comprehensive','mcq','numerical','short']);
for(const [kind,count] of [['mcq',18],['short',13],['comprehensive',10],['numerical',9]]){
 const group=groups[kind];
 assert.equal(group.visuallyObservedCount,count);
 assert.equal(group.items.length,count);
 assert.equal(new Set(group.items.map(x=>x.sourceNumber)).size,count);
 for(const item of group.items){
   assert.ok(item.focus && item.focus.length>=5,'Missing descriptive non-verbatim topic label');
   assert.ok(Array.isArray(item.printedPages) && item.printedPages.length>=1);
   for(const page of item.printedPages)assert.ok(page>=150&&page<=153);
 }
}
assert.deepEqual(groups.mcq.items.map(i=>i.sourceNumber),Array.from({length:18},(_,i)=>String(i+1)));
assert.deepEqual(groups.mcq.items[16].printedPages,[151,152]);
assert.deepEqual(groups.short.items.map(i=>i.sourceNumber),Array.from({length:13},(_,i)=>'8.'+(i+1)));
assert.deepEqual(groups.comprehensive.items.map(i=>i.sourceNumber),['8.1','8.2','8.3','8.4','8.5','8.6','8.7','8.9','8.10','8.11']);
assert.equal(groups.comprehensive.items.some(i=>i.sourceNumber==='8.8'),false,'Do not invent missing original 8.8');
assert.deepEqual(groups.numerical.items.map(i=>i.sourceNumber),Array.from({length:9},(_,i)=>'8.'+(i+1)));
assert.deepEqual(groups.short.items.find(i=>i.sourceNumber==='8.13').subparts,['i','ii','iii','iv']);
// Original multi-part responses stay one top-level exercise each.
assert.deepEqual(groups.comprehensive.items.find(i=>i.sourceNumber==='8.4').subparts,['a','b','c','d']);
assert.deepEqual(groups.numerical.items.find(i=>i.sourceNumber==='8.9').subparts,['a','b']);
assert.equal(groups.comprehensive.v224BaselineClaimedCount,11);
assert.equal(baseline.exercise.comprehensiveResponses.count,11);
assert.equal(baseline.exercise.mcqs.count,18);
assert.equal(baseline.exercise.shortResponses.count,13);
assert.equal(baseline.exercise.numericalProblems.count,9);
assert.equal(inv.discrepancy.id,'SOURCE-COMP-8.8');
assert.match(inv.discrepancy.verified,/10 visible numbered questions/);
assert.match(inv.discrepancy.handling,/keep V224 historical baseline unchanged/);
assert.equal(inv.sourceSections.reduce((n,g)=>n+g.items.length,0),50);
assert.equal(inv.observedTotal,50);
assert.equal(inv.reviewFlags.length,17);
assert.equal(new Set(inv.reviewFlags.map(f=>f.flagId)).size,17);
const ids=new Set(inv.reviewFlags.map(f=>f.flagId));
for(const must of ['SOURCE-COMP-8.8','MCQ-11','MCQ-12','NUM-8.3','NUM-8.4'])assert.ok(ids.has(must));
assert.equal(inv.reviewFlags.filter(x=>x.priority==='blocking').length,5);
assert.equal(inv.reviewFlags.filter(x=>x.priority==='high').length,4);
assert.equal(inv.reviewFlags.filter(x=>x.priority==='moderate').length,8);
for(const flag of inv.reviewFlags){
 assert.ok(['blocking','high','moderate'].includes(flag.priority));
 assert.ok(flag.reason.length>=45 && flag.reviewInstruction.length>=30);
 assert.equal(flag.sourceRetained,true);
 assert.equal(flag.studentRelease,'HOLD');
 assert.equal(flag.teacherApproval,'PENDING');
 assert.ok(flag.kind==='comprehensive'&&flag.sourceNumber==='8.8'&&flag.flagId==='SOURCE-COMP-8.8'
   || groups[flag.kind].items.some(i=>i.sourceNumber===flag.sourceNumber),
   'All review flags must reference real, seen original items or documented absent 8.8');
}
for(const bannedKey of ['answerKey','correctOption','correctAnswer','finalAnswer','publishedSolution',
 'verbatimQuestionStem','verbatimOptions','printedQuestionText','textbookPageImage']){
 const crawl=o=>{
  if(Array.isArray(o))return o.forEach(crawl);
  if(o!==null&&typeof o==='object'){assert.ok(!(bannedKey in o),'No source stems, selected options or keys: '+bannedKey);
  Object.values(o).forEach(crawl)}
 };
 crawl(inv);
}
assert.equal(inv.releaseGate.scoredMcqsUnit8,0);
assert.equal(inv.releaseGate.humanScienceQc,'PENDING');
assert.equal(inv.releaseGate.ownerApproval,'HOLD');
assert.equal(inv.releaseGate.studentAnswerEdition,'NOT-PUBLISHED');
assert.equal(inv.releaseGate.originalStemsReproduced,false);
assert.equal(inv.releaseGate.sourceFigureReproduction,false);
assert.match(audit,/10 printed numbered questions/);
assert.match(audit,/8\.7.*8\.9/); // source numbering discrepancy is described with page references
assert.match(audit,/MCQ 11/);
assert.match(audit,/Numerical 8\.4/);
assert.match(audit,/NOT solved-answer certification/);
const unit8=catalogue.grades.find(g=>g.grade===11).units.find(u=>u.unit===8);
const unit7=catalogue.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
assert.equal(unit8.status,'planned');assert.equal(unit8.assessmentStatus,'not-published');
assert.equal(unit8.questionBankCount,0);assert.deepEqual(unit8.resourceIds,[]);
assert.equal(unit8.simulationCount,4);
assert.deepEqual(unit8.additionalLearningPreviews.map(x=>x.topic),['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10']);
assert.equal(unit7.questionBankCount,0);assert.equal(unit7.assessmentStatus,'not-published');
assert.equal(catalogue.resources.length,59);
assert.deepEqual(bank.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
assert.equal(baseline.releaseGate.studentScoredUnit8Mcqs,0);
console.log('V235 PASS: 50 visually indexed exercise items, missing comprehensive 8.8 reconciled, 17 triage flags, no keys/answers, all release holds and 2250 pinned MCQs protected.');
