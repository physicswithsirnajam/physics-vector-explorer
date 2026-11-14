#!/usr/bin/env node
"use strict";
/* Unit 3 first provisional summative MCQ release: source, key, layout, and safety QC.
 * It does not certify the questions as an official board examination bank.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const load=file=>fs.readFileSync(path.join(root,file),"utf8");
const bank=JSON.parse(load("question-bank/grade-11/unit-03-stage1-practice.json"));
const html=load("portal/unit-03-mcq-practice.html");
const ui=load("portal/unit-03-mcq-practice.js");
const desk=load("portal/unit-03.html");
const catalogue=JSON.parse(load("portal/learning-catalog.json"));
const QUESTIONS=40;
const SLO_LIST=["P-11-B-04","P-11-B-05","P-11-B-06","P-11-B-12","P-11-B-13"];
assert.equal(bank.schemaVersion,1);
assert.equal(bank.status,"practice-pilot");
assert.equal(bank.questions.length,QUESTIONS);
assert.equal(bank.structure.straight,28);
assert.equal(bank.structure.scenario,12);
assert.equal(bank.structure.scenarioSets,3);
assert.equal(bank.structure.scenarioQuestionsPerSet,4);
assert.ok(bank.limitations.includes("not an official"));
assert.ok(bank.limitations.includes("B-03")&&bank.limitations.includes("B-11"));
const tally={A:0,B:0,C:0,D:0},sloMap={},ids=new Set(),scenarioMap=new Map();
let textbook=0;
for(const [index,q] of bank.questions.entries()){
 assert.ok(!ids.has(q.id),"Duplicate ID "+q.id);
 ids.add(q.id);
 assert.equal(q.sourceQuestionNumber,index+1);
 assert.equal(q.grade,11);
 assert.equal(q.unit,3);
 assert.equal(q.type,"single_choice");
 assert.equal(q.assessmentClassification,"summative-theory");
 assert.equal(q.boardEligible,false);
 assert.equal(q.active,true);
 assert.equal(q.status,"teacher-review-pending");
 assert.ok(q.explanation.length>=15&&q.stem.length>=15,"Incomplete item "+q.id);
 assert.ok(Array.isArray(q.options)&&q.options.length===4);
 assert.deepEqual(q.options.map(x=>x.id),["A","B","C","D"]);
 assert.equal(new Set(q.options.map(x=>x.text)).size,4);
 assert.ok(q.options.every(x=>x.text.trim().length>=3));
 assert.ok(q.correctOptionId in tally);
 tally[q.correctOptionId]++;
 assert.ok(SLO_LIST.includes(q.sloCodes[0]));
 assert.equal(q.sloCodes.length,1);
 sloMap[q.sloCodes[0]]=(sloMap[q.sloCodes[0]]||0)+1;
 assert.equal(q.source.file,"11 Physics Book(10).pdf");
 assert.ok(q.source.textbookPage>=33&&q.source.textbookPage<=52);
 assert.ok(["original-slo-practice","original-scenario-practice","textbook-adapted"].includes(q.source.sourceType));
 if(q.source.sourceType==="textbook-adapted"){
  textbook++;
  assert.ok(!q.scenarioSetId);
  assert.ok([1,4,5,8,9].includes(q.source.exerciseQuestionNumber));
  assert.ok([49,50].includes(q.source.textbookPage));
 }
 if(q.scenarioSetId){
  assert.ok(q.stimulusText&&q.stimulusText.length>75);
  assert.ok(q.scenarioTitle&&Number.isInteger(q.scenarioIndex));
  if(!scenarioMap.has(q.scenarioSetId))scenarioMap.set(q.scenarioSetId,[]);
  scenarioMap.get(q.scenarioSetId).push(q);
 }
}
assert.deepEqual(tally,{A:10,B:10,C:10,D:10});
assert.equal(textbook,5);
assert.equal(bank.questions.filter(q=>!q.scenarioSetId).length,28);
assert.equal(bank.questions.filter(q=>!!q.scenarioSetId).length,12);
assert.equal(scenarioMap.size,3);
assert.deepEqual([...scenarioMap.keys()],["U03-S01","U03-S02","U03-S03"]);
for(const [id,qs] of scenarioMap){
 assert.equal(qs.length,4);
 assert.deepEqual(qs.map(x=>x.scenarioIndex),[1,2,3,4]);
 assert.equal(new Set(qs.map(x=>x.stimulusText)).size,1);
 assert.equal(new Set(qs.map(x=>x.sloCodes[0])).size,1);
 assert.ok(qs.every(q=>q.source.sourceType==="original-scenario-practice"));
}
assert.deepEqual(sloMap,{"P-11-B-04":10,"P-11-B-05":11,"P-11-B-06":4,"P-11-B-12":10,"P-11-B-13":5});
const correct=index=>{
 const q=bank.questions[index-1];
 return q.options.find(x=>x.id===q.correctOptionId).text;
};
const assertCorrect=(n,text)=>assert.equal(correct(n),text,"Wrong answer key for MCQ "+n);
for(const [n,answer] of [
 [1,"44.1 m"],[2,"17 m/s"],[3,"4 m/s²"],[4,"50 m"],[5,"+9.8 m/s"],[6,"+2 m/s"],
 [7,"The highest point"],[8,"An object moving under gravity after being projected into the air"],
 [9,"At the highest point"],[10,"Its weight due to gravity"],[11,"45°"],[12,"2.04 s"],[13,"10 m/s"],
 [14,"Decreases"],[15,"Downward"],[16,"Shorter"],[17,"Is not generally guaranteed"],
 [18,"Momentum and kinetic energy"],[19,"Are exchanged"],[20,"3.33 m/s"],[21,"8.33 m/s"],
 [22,"6 m/s"],[23,"80 J"],[24,"Total momentum is conserved even though total kinetic energy may decrease"],
 [25,"Sound, thermal energy and deformation"],[26,"Lower because some kinetic energy is converted into other forms"],[27,"6 J"],
 [28,"Some kinetic energy has changed form, although total momentum is conserved"],
 [29,"16 m/s"],[30,"60 m"],[31,"10 m/s"],[32,"12 m"],
 [33,"17.3 m/s"],[34,"2 s"],[35,"5 m"],[36,"34.6 m"],
 [37,"−1.2 m/s"],[38,"+4.8 m/s"],[39,"+12 kg·m/s"],[40,"36 J"]
])assertCorrect(n,answer);
// Independent numerical sanity checks for three complete stimulus sets.
const bus={u:4,a:2,t:6};
assert.equal(bus.u+bus.a*bus.t,16);
assert.equal(bus.u*bus.t+bus.a*bus.t**2/2,60);
assert.equal((bus.u+16)/2,10);
assert.equal(bus.u*2+bus.a*2**2/2,12);
const g=10,theta=Math.PI/6,u=20;
const ux=u*Math.cos(theta),uy=u*Math.sin(theta),flight=2*uy/g;
assert.ok(Math.abs(ux-17.32)<0.01);
assert.ok(Math.abs(flight-2)<1e-10);
assert.ok(Math.abs(uy**2/(2*g)-5)<1e-10);
assert.ok(Math.abs(ux*flight-34.64)<0.02);
// B-13 requires explicit kinetic-energy comparison, not B-11 momentum alone.
const stickVelocity=(4*3+2*0)/(4+2);
const initialK=0.5*4*3**2;
const finalK=0.5*(4+2)*stickVelocity**2;
assert.equal(stickVelocity,2);
assert.equal(initialK,18);
assert.equal(finalK,12);
assert.equal(initialK-finalK,6);
const m1=2,m2=3,initial1=6,initial2=0;
const final1=((m1-m2)*initial1+2*m2*initial2)/(m1+m2);
const final2=(2*m1*initial1+(m2-m1)*initial2)/(m1+m2);
assert.ok(Math.abs(final1+1.2)<1e-10);
assert.ok(Math.abs(final2-4.8)<1e-10);
assert.equal(m1*initial1+m2*initial2,m1*final1+m2*final2);
assert.equal(0.5*m1*initial1**2,0.5*m1*final1**2+0.5*m2*final2**2);
const htmlIds=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(htmlIds).size,htmlIds.length);
for(const id of ["bankStatus","check","showKey","reset","printQuestions","printKey","questionArea","answerKey","solutionList","result"]){
 assert.ok(htmlIds.includes(id),"Missing student control "+id);
}
for(const title of ["Sr #","Question","(A)","(B)","(C)","(D)","A","B","C","D"]){
 assert.ok(ui.includes('"'+title+'"'),"Missing FBISE boxed MCQ column "+title);
}
assert.ok(html.includes("boxed A/B/C/D options and answer-bubble layout"));
assert.ok(html.includes("not an official FBISE exam"));
assert.ok(html.includes('src="./assets/physics-with-sir-najam-official-logo.png"'));
assert.ok(html.includes('src="./unit-03-mcq-practice.js"'));
assert.ok(ui.includes('fetch(source,{cache:"no-store"})'));
assert.ok(ui.includes('source="../question-bank/grade-11/unit-03-stage1-practice.json"'));
assert.ok(ui.includes('const labels=["')===false);
assert.ok(ui.includes('document.createElement("') || ui.includes('document.createElement(tag)'));
assert.ok(ui.includes('type="radio"')||ui.includes('radio.type="radio"'));
assert.ok(ui.includes('window.print()'));
assert.ok(html.includes("Printed student sheets have blank answer bubbles"));
assert.ok(!html.includes('input[type=radio]:checked:after'));
assert.ok(desk.includes('href="./unit-03-mcq-practice.html"'));
for(const link of ["./unit-03-study-guide.html","./unit-03-motion-lab.html",
 "./unit-03-collision-study.html","./unit-03-collision-lab.html"]){
 assert.ok(desk.includes('href="'+link+'"'));
}
const u3=catalogue.grades.find(x=>x.grade===11).units.find(x=>x.unit===3);
assert.equal(u3.questionBankCount,40);
assert.ok(u3.resourceIds.includes("unit3-mcq-stage1"));
assert.ok(u3.assessmentStatus.includes("provisional"));
const resource=catalogue.resources.filter(x=>x.id==="unit3-mcq-stage1");
assert.equal(resource.length,1);
assert.equal(resource[0].href,"./unit-03-mcq-practice.html");
assert.equal(resource[0].public,true);
for(const text of [html,ui]){
 for(const forbidden of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,
  /\bFirebase\b/i,/\bFirestore\b/i,/\bWebSocket\b/i,/\bsendBeacon\b/i]){
  assert.ok(!forbidden.test(text),"Unexpected account/write marker "+forbidden);
 }
}
assert.ok(!ui.includes("innerHTML"),"Untrusted question text must use text-only rendering");
console.log("PASS — 40 summative-only Unit 3 MCQs (28 straight, 12 in 3 complete 4-item stimulus groups); 5 source-adapted, 35 original.");
console.log("PASS — A/B/C/D exactly balanced, unique keyed answers, all 40 explanation records, numerical scenarios and no formative B-03/B-11 leakage.");
console.log("PASS — FBISE-like boxed layout, print/student-answer separation, existing Unit 3 resource links and no student account persistence.");
console.log("NOTE — This is a source-based provisional unit-only practice selection, not independent textbook-page certification or a full official FBISE exam.");
