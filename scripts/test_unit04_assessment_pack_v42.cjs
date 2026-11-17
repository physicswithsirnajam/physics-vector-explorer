#!/usr/bin/env node
"use strict";
/* Grade XI Unit 4 V42 integrated classroom pack; source-derived regression.
 * Does not certify a board key, scanner OMR or live-browser/print review.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const objective=JSON.parse(read("question-bank/grade-11/unit-04-v39-80-practice.json"));
const descriptive=JSON.parse(read("question-bank/grade-11/unit-04-descriptive-practice.json"));
const audit=JSON.parse(read("portal/unit-04-slo-audit.json"));
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const html=read("portal/unit-04-assessment-pack.html");
const js=read("portal/unit-04-assessment-pack.js");
const desk=read("portal/unit-04.html");
const auditPage=read("portal/unit-04-slo-audit.html");
const SLO=["P-11-B-07","P-11-B-08","P-11-B-09","P-11-B-10",
 "P-11-B-14","P-11-B-15","P-11-B-16","P-11-B-17","P-11-B-18",
 "P-11-B-19","P-11-B-20","P-11-B-21"];
const countsExpected=[6,8,8,5,8,8,5,6,8,6,8,4];
assert.equal(objective.status,"practice-pilot");
assert.equal(objective.questions.length,80);
assert.equal(objective.structure.straight,56);
assert.equal(objective.structure.scenario,24);
assert.equal(objective.structure.scenarioSets,6);
assert.equal(objective.structure.scenarioQuestionsPerSet,4);
assert.equal(objective.structure.marksPerQuestion,.5);
assert.equal(objective.structure.totalPracticeMarks,40);
assert.equal(descriptive.status,"teacher-review-pending");
assert.equal(descriptive.pattern.sectionB.total,28);
assert.equal(descriptive.pattern.sectionC.total,12);
assert.equal(descriptive.pattern.totalMarks,40);
assert.equal(descriptive.sectionB.length,7);
assert.equal(descriptive.sectionC.length,2);
const sCounts=Object.fromEntries(SLO.map(s=>[s,{n:0,m:0,a:0,b:0}]));
const keyBalance={A:0,B:0,C:0,D:0},seenIds=new Set(),groups=new Map(),seenStems=new Set();
for(const [i,q] of objective.questions.entries()){
 assert.equal(q.sourceQuestionNumber,i+1);
 assert.equal(q.grade,11);assert.equal(q.unit,4);
 assert.equal(q.status,"teacher-review-pending");
 assert.equal(q.boardEligible,false);
 assert.equal(q.assessmentClassification,"summative-theory");
 assert.ok(q.id&&!seenIds.has(q.id));seenIds.add(q.id);
 assert.ok(q.stem&&!seenStems.has(q.stem));seenStems.add(q.stem);
 assert.equal(q.sloCodes.length,1);
 assert.ok(SLO.includes(q.sloCodes[0]));
 assert.deepEqual(q.options.map(o=>o.id),["A","B","C","D"]);
 assert.ok(q.options.some(o=>o.id===q.correctOptionId));
 assert.ok(q.explanation.length>=18);
 keyBalance[q.correctOptionId]++;
 const t=sCounts[q.sloCodes[0]];t.n++;t.m+=.5;
 if(i<56){assert.ok(!q.scenarioSetId&&!q.stimulusText);}
 else {
  assert.ok(q.scenarioSetId&&q.scenarioTitle&&q.stimulusText&&q.stimulusText.length>140);
  if(!groups.has(q.scenarioSetId))groups.set(q.scenarioSetId,[]);
  groups.get(q.scenarioSetId).push(q);
 }
}
assert.deepEqual(keyBalance,{A:20,B:20,C:20,D:20});
assert.equal(groups.size,6);
for(const [id,qs] of groups){
 assert.equal(qs.length,4,id);
 assert.deepEqual(qs.map(q=>q.scenarioIndex),[1,2,3,4]);
 assert.equal(new Set(qs.map(q=>q.stimulusText)).size,1);
}
for(const [i,slo] of SLO.entries())assert.equal(sCounts[slo].n,countsExpected[i]);
const all=[...descriptive.sectionB,...descriptive.sectionC],represented=new Set();
for(const [i,q] of all.entries()){
 const marks=i<7?4:6;assert.equal(q.number,i+1);assert.equal(q.marks,marks);
 assert.equal(q.choices.length,2);
 for(const [c,x] of q.choices.entries()){
  assert.ok(SLO.includes(x.slo));
  assert.equal(x.assessment,"summative-theory");
  assert.ok(x.sourcePage>=53&&x.sourcePage<=76);
  assert.equal(x.marking.reduce((a,y)=>a+y.marks,0),marks);
  assert.ok(x.prompt.length>60);assert.ok(x.marking.length>=4);
  represented.add(x.slo);
  sCounts[x.slo][c===0?"a":"b"]+=marks;
 }
}
assert.deepEqual([...represented].sort(),[...SLO].sort());
const total=Object.values(sCounts).reduce((t,x)=>{
 t.n+=x.n;t.m+=x.m;t.a+=x.a;t.b+=x.b;return t;
},{n:0,m:0,a:0,b:0});
assert.deepEqual(total,{n:80,m:40,a:40,b:40});
assert.equal(total.m+total.a,80);
assert.equal(total.m+total.b,80);
assert.ok(SLO.some(s=>sCounts[s].a!==sCounts[s].b),
 "OR-sensitive table should show source-dependent alternative allocations");
for(const forbidden of ["P-11-B-11","P-11-B-12","P-11-B-13"]){
 assert.ok(!objective.questions.some(q=>q.sloCodes.includes(forbidden)));
 assert.ok(!all.some(q=>q.choices.some(o=>o.slo===forbidden)));
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(ids.length,new Set(ids).size,"Duplicate DOM id");
for(const id of ["printOMR","printKey","printTos","printTosInline","showTeacher","loadStatus",
 "blankStraight","blankScenarios","keyStraight","keyScenarios",
 "explanationRows","descriptiveKey","tosRows","tosTotal","tosDetails",
 "omrSection","teacherSection","tosSection"])assert.ok(ids.includes(id),"Missing "+id);
for(const ref of ['src="./assets/physics-with-sir-najam-official-logo.png"',
 'src="./unit-04-assessment-pack.js"',
 'href="./unit-04-mcq-full80.html"','href="./unit-04-descriptive-practice.html"'])
 assert.ok(html.includes(ref),"Missing original brand or live question link "+ref);
assert.ok(html.includes("@page{size:A4 portrait"));
for(const cls of ["print-omr","print-key","print-tos"]){
 assert.ok(html.includes("body."+cls));
 assert.ok(js.includes('"'+cls+'"'));
}
assert.ok(html.includes("manual practice"));
assert.ok(html.includes("not an official FBISE full-syllabus paper"));
assert.ok(html.includes("not machine scanning")||html.includes("not scanning"));
assert.ok(js.includes('const links=['));
assert.ok(js.includes('unit-04-v39-80-practice.json'));
assert.ok(js.includes('unit-04-descriptive-practice.json'));
assert.ok(js.includes('q.unit!==4'));
assert.ok(js.includes('straightGrid("blankStraight",false)'));
assert.ok(js.includes('straightGrid("keyStraight",true)'));
assert.ok(js.includes('scenarioGrid("blankScenarios",groups,false)'));
assert.ok(js.includes('scenarioGrid("keyScenarios",groups,true)'));
assert.ok(js.includes('const seenScenarios=new Set()'));
assert.ok(js.includes('q.stimulusText+" | "'),"Scenario context missing from key");
assert.ok(js.includes('context+"Q: "+q.stem'));
assert.ok(js.includes("questionRow(mcq.questions[j],mark)"));
assert.ok(js.includes('col<4;col++')&&js.includes('end=start+14'));
assert.ok(js.includes("all.a!==40||all.b!==40"));
assert.ok(js.includes("window.print()")&&js.includes("afterprint"));
assert.ok(js.includes("document.createElement(tag)"));
assert.ok(!js.includes("innerHTML"),"Untrusted source text must never be injected as HTML");
for(const source of [html,js]){
 for(const pattern of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,
   /\bFirebase\b/i,/\bFirestore\b/i,/\bWebSocket\b/i,/\bsendBeacon\b/i,/\bsetDoc\b/i]){
  assert.ok(!pattern.test(source),"Public pack must not access student storage: "+pattern);
 }
}
assert.ok(!/unit-03|Translatory Motion/.test(html+js),"Unit 3 artifacts must not be copied into Unit 4");
assert.ok(desk.includes('href="./unit-04-assessment-pack.html"'));
assert.ok(auditPage.includes('href="./unit-04-assessment-pack.html"'));
assert.equal(audit.integratedClassroomAssessmentPackPublished,true);
assert.equal(audit.integratedPracticePackPage,"./unit-04-assessment-pack.html");
assert.equal(audit.protectedOrGradedAssessmentPublished,false);
assert.equal(audit.studentGradesRecorded,false);
const u4=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===4);
assert.equal(u4.questionBankCount,635);
assert.equal(u4.resourceIds.length,18);
assert.equal(new Set(u4.resourceIds).size,18);
assert.ok(u4.resourceIds.includes("unit4-assessment-pack"));
assert.equal(u4.assessmentStatus,"provisional-unit4-integrated-80-mark-classroom-practice");
const items=catalog.resources.filter(x=>x.id==="unit4-assessment-pack");
assert.equal(items.length,1);
assert.equal(items[0].href,"./unit-04-assessment-pack.html");
assert.equal(items[0].public,true);
const u3=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===3);
assert.equal(u3.questionBankCount,220);
assert.equal(u3.resourceIds.length,10);
assert.ok(u3.resourceIds.includes("unit3-assessment-pack"));
console.log("PASS V42: 56+24 MCQs, six complete scenarios, A/B/C/D 20 each, 12 SLO source counts.");
console.log("PASS V42: 7x4+2x6=40 OR marks; 80 overall; all-A/all-B alternatives separately total 80.");
console.log("PASS V42: A4 blank/marked OMR, 80 explanations with original scenario context, 18 descriptive solutions.");
console.log("PASS V42: 15 Unit 4 public resources; no grades/login/storage changed; Unit 1-3 preserved.");
console.log("NOTE: This is provisional manual classroom practice, NOT certified FBISE paper or machine-readable OMR.");
