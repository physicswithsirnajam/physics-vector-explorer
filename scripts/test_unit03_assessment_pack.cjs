#!/usr/bin/env node
"use strict";
/* Read-only Unit 3 assessment-pack validation.
 * Tests consistency and maths from existing source banks, not an official
 * school/FBISE academic endorsement or live-browser visual certification.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const objective=JSON.parse(read("question-bank/grade-11/unit-03-stage2-80-practice.json"));
const descriptive=JSON.parse(read("question-bank/grade-11/unit-03-descriptive-practice.json"));
const page=read("portal/unit-03-assessment-pack.html");
const client=read("portal/unit-03-assessment-pack.js");
const desk=read("portal/unit-03.html");
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const SLO=["P-11-B-04","P-11-B-05","P-11-B-06","P-11-B-12","P-11-B-13"];
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
const tally={A:0,B:0,C:0,D:0};
const sCounts=Object.fromEntries(SLO.map(s=>[s,{mcq:0,m:0,a:0,b:0}]));
const scenarioGroups=new Map(),seenIDs=new Set();
for(const [i,q] of objective.questions.entries()){
 assert.equal(q.sourceQuestionNumber,i+1);
 assert.equal(q.grade,11);assert.equal(q.unit,3);
 assert.ok(q.id&&!seenIDs.has(q.id),"Duplicate question ID");
 seenIDs.add(q.id);
 assert.equal(q.assessmentClassification,"summative-theory");
 assert.equal(q.boardEligible,false);
 assert.ok(SLO.includes(q.sloCodes[0]));
 assert.equal(q.sloCodes.length,1);
 assert.deepEqual(q.options.map(o=>o.id),["A","B","C","D"]);
 assert.ok(q.options.some(o=>o.id===q.correctOptionId));
 assert.ok(q.explanation.length>=15);
 tally[q.correctOptionId]++;
 sCounts[q.sloCodes[0]].mcq++;
 sCounts[q.sloCodes[0]].m+=.5;
 if(i<56){assert.ok(!q.scenarioSetId,"Straight MCQ unexpectedly has scenario");}
 else{
  assert.ok(q.scenarioSetId&&q.stimulusText&&q.scenarioTitle);
  if(!scenarioGroups.has(q.scenarioSetId))scenarioGroups.set(q.scenarioSetId,[]);
  scenarioGroups.get(q.scenarioSetId).push(q);
 }
}
assert.deepEqual(tally,{A:20,B:20,C:20,D:20});
assert.equal(scenarioGroups.size,6);
for(const [id,questions] of scenarioGroups.entries()){
 assert.equal(questions.length,4,id+" should contain 4 questions");
 assert.deepEqual(questions.map(x=>x.scenarioIndex),[1,2,3,4]);
 assert.equal(new Set(questions.map(x=>x.stimulusText)).size,1);
}
assert.deepEqual(Object.fromEntries(SLO.map(s=>[s,sCounts[s].mcq])),{
 "P-11-B-04":21,"P-11-B-05":24,"P-11-B-06":8,
 "P-11-B-12":15,"P-11-B-13":12
});
for(const [i,q] of [...descriptive.sectionB,...descriptive.sectionC].entries()){
 const marks=i<7?4:6;
 assert.equal(q.number,i+1);
 assert.equal(q.marks,marks);
 assert.equal(q.choices.length,2);
 for(const [index,choice] of q.choices.entries()){
  assert.ok(SLO.includes(choice.slo));
  assert.equal(choice.assessment,"summative-theory");
  assert.equal(choice.marking.reduce((n,m)=>n+m.marks,0),marks);
  sCounts[choice.slo][index===0?"a":"b"]+=marks;
 }
}
const total=SLO.reduce((o,s)=>{const t=sCounts[s];o.mcq+=t.mcq;o.m+=t.m;o.a+=t.a;o.b+=t.b;return o;},
 {mcq:0,m:0,a:0,b:0});
assert.deepEqual(total,{mcq:80,m:40,a:40,b:40});
assert.equal(total.m+total.a,80);
assert.equal(total.m+total.b,80);
// The two reference descriptive paths differ because the final OR alternatives target different SLOs.
assert.equal(sCounts["P-11-B-12"].a,sCounts["P-11-B-12"].b+6);
assert.equal(sCounts["P-11-B-13"].b,sCounts["P-11-B-13"].a+6);
assert.equal(sCounts["P-11-B-04"].m,10.5);
assert.equal(sCounts["P-11-B-05"].m,12);
assert.equal(sCounts["P-11-B-06"].m,4);
assert.equal(sCounts["P-11-B-12"].m,7.5);
assert.equal(sCounts["P-11-B-13"].m,6);
const domIds=[...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(domIds.length,new Set(domIds).size,"Duplicate HTML ID");
for(const id of ["printOMR","printKey","printTos","printTosInline","showTeacher","loadStatus",
 "blankStraight","blankScenarios","keyStraight","keyScenarios","explanationRows",
 "descriptiveKey","tosRows","tosTotal","tosDetails","omrSection","teacherSection","tosSection"]){
 assert.ok(domIds.includes(id),"Missing pack control or view "+id);
}
assert.ok(page.includes('src="./assets/physics-with-sir-najam-official-logo.png"'),
 "The unchanged Physics with Sir Najam brand asset must be reused");
assert.ok(page.includes('src="./unit-03-assessment-pack.js"'));
for(const cls of ["print-omr","print-key","print-tos"]){
 assert.ok(page.includes("body."+cls),"Missing isolated print mode "+cls);
 assert.ok(client.includes('"'+cls+'"'),"Client does not set print mode "+cls);
}
assert.ok(page.includes("not an official FBISE full-syllabus paper"));
assert.ok(page.includes("not an official scanner")||page.includes("not an official FBISE scanner"));
assert.ok(page.includes("manual practice"));
assert.ok(page.includes('href="./unit-03-mcq-full80.html"'));
assert.ok(page.includes('href="./unit-03-descriptive-practice.html"'));
assert.ok(!client.includes("innerHTML"),"No dynamic source HTML injection");
assert.ok(client.includes("document.createElement(tag)"));
assert.ok(client.includes('const links=['));
assert.ok(client.includes('unit-03-stage2-80-practice.json'));
assert.ok(client.includes('unit-03-descriptive-practice.json'));
assert.ok(client.includes("questionRow(mcq.questions[j],mark)"));
assert.ok(client.includes("col<4;col++"));
assert.ok(client.includes("end=start+14"));
assert.ok(client.includes("return groups"));
assert.ok(client.includes('straightGrid("blankStraight",false)'));
assert.ok(client.includes('straightGrid("keyStraight",true)'));
assert.ok(client.includes('scenarioGrid("blankScenarios",groups,false)'));
assert.ok(client.includes('scenarioGrid("keyScenarios",groups,true)'));
assert.ok(client.includes("all.a!==40||all.b!==40"));
assert.ok(client.includes("window.print()"));
assert.ok(client.includes('afterprint'));
for(const source of [page,client]){
 for(const forbidden of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,
  /\bFirestore\b/i,/\bFirebase\b/i,/\bWebSocket\b/i,/\bsendBeacon\b/i]){
  assert.ok(!forbidden.test(source),"A public self-practice pack must not persist student data: "+forbidden);
 }
}
assert.ok(desk.includes('href="./unit-03-assessment-pack.html"'));
for(const link of ["unit-03-mcq-full80.html","unit-03-mcq-practice.html",
 "unit-03-descriptive-practice.html","unit-03-numericals.html"]){
 assert.ok(desk.includes('href="./'+link+'"'),"Existing resource link removed "+link);
}
const u=catalog.grades.find(g=>g.grade===11)?.units.find(x=>x.unit===3);
assert.equal(u.questionBankCount,220);
assert.equal(u.resourceIds.length,10);
assert.ok(u.resourceIds.includes("unit3-assessment-pack"));
const resources=catalog.resources.filter(x=>x.id==="unit3-assessment-pack");
assert.equal(resources.length,1);
assert.equal(resources[0].public,true);
assert.equal(resources[0].href,"./unit-03-assessment-pack.html");
console.log("PASS — 80-MCQ bank and 40-mark descriptive source independently reconcile to 80 total practice marks.");
console.log("PASS — Exact 56/24, six complete scenarios, 20 correct options per letter; all SLO source totals and OR-sensitive marks computed.");
console.log("PASS — Separate blank vs teacher-marked OMR output, full teacher key and explanations, 3 isolated print modes.");
console.log("PASS — Existing unit links, public scope notes, 10 resource IDs, logo reuse and no account/persistent student data.");
console.log("NOTE — Classroom-only Unit 3 teaching practice; not official full-syllabus exam, scanner-readable OMR or examiner marking scheme.");
