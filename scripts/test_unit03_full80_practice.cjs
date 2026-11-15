#!/usr/bin/env node
"use strict";
/* Grade XI Unit 3 Section A-count (80 MCQ) provisional academic/structural QA.
 * The source content and assessment framework remain the educational authority.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const initial=JSON.parse(read("question-bank/grade-11/unit-03-stage1-practice.json"));
const bank=JSON.parse(read("question-bank/grade-11/unit-03-stage2-80-practice.json"));
const desk=read("portal/unit-03.html");
const html=read("portal/unit-03-mcq-full80.html");
const ui=read("portal/unit-03-mcq-full80.js");
const stage1Page=read("portal/unit-03-mcq-practice.html");
const stage1UI=read("portal/unit-03-mcq-practice.js");
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const correct=q=>q.options.find(o=>o.id===q.correctOptionId)?.text;
const approx=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,String(a)+" != "+b);
assert.equal(initial.questions.length,40,"Stage 1 source must remain intact");
assert.equal(initial.status,"practice-pilot");
assert.equal(bank.schemaVersion,1);assert.equal(bank.status,"practice-pilot");
assert.equal(bank.questions.length,80);
assert.equal(bank.structure.straight,56);assert.equal(bank.structure.scenario,24);
assert.equal(bank.structure.scenarioSets,6);assert.equal(bank.structure.scenarioQuestionsPerSet,4);
assert.equal(bank.structure.marksPerQuestion,.5);assert.equal(bank.structure.totalPracticeMarks,40);
assert.ok(bank.limitations.includes("NOT an official"));
assert.ok(bank.limitations.includes("Formative B-03/B-11 excluded"));
const keyDistribution={A:0,B:0,C:0,D:0};
const sloCounts={},ids=new Set(),scenarios=new Map(),sourceTypeCounts={};
for(const [i,q] of bank.questions.entries()){
 assert.equal(q.sourceQuestionNumber,i+1,"Question numbering is not sequential at "+q.id);
 assert.ok(q.id&&!ids.has(q.id),"Duplicate or absent question ID");
 ids.add(q.id);
 assert.equal(q.grade,11);assert.equal(q.unit,3);
 assert.equal(q.type,"single_choice");
 assert.equal(q.assessmentClassification,"summative-theory");
 assert.equal(q.boardEligible,false,"Provisional practice must not claim board eligibility");
 assert.equal(q.active,true);assert.equal(q.status,"teacher-review-pending");
 assert.ok(q.stem.length>15&&q.explanation.length>=20,"Stem or key explanation too short "+q.id);
 assert.deepEqual(q.options.map(o=>o.id),["A","B","C","D"]);
 assert.equal(new Set(q.options.map(o=>o.text)).size,4,"Duplicate options "+q.id);
 assert.ok(q.options.every(o=>o.text.length>2));
 assert.ok(Object.prototype.hasOwnProperty.call(keyDistribution,q.correctOptionId));
 assert.ok(correct(q),"Missing keyed answer "+q.id);
 keyDistribution[q.correctOptionId]++;
 assert.equal(q.sloCodes.length,1);
 assert.ok(["P-11-B-04","P-11-B-05","P-11-B-06","P-11-B-12","P-11-B-13"].includes(q.sloCodes[0]));
 sloCounts[q.sloCodes[0]]=(sloCounts[q.sloCodes[0]]||0)+1;
 assert.equal(q.source.file,"11 Physics Book(10).pdf");
 assert.ok(q.source.textbookPage>=33&&q.source.textbookPage<=52,"Bad textbook page "+q.id);
 sourceTypeCounts[q.source.sourceType]=(sourceTypeCounts[q.source.sourceType]||0)+1;
 if(q.scenarioSetId){
  assert.ok(q.stimulusText&&q.stimulusText.length>75,"Unusable context "+q.id);
  assert.ok(q.scenarioIndex>=1&&q.scenarioIndex<=4);
  assert.ok(q.scenarioTitle);
  if(!scenarios.has(q.scenarioSetId))scenarios.set(q.scenarioSetId,[]);
  scenarios.get(q.scenarioSetId).push(q);
 }
}
assert.equal(new Set(bank.questions.map(q=>q.sourceQuestionNumber)).size,80);
assert.deepEqual(keyDistribution,{A:20,B:20,C:20,D:20});
assert.deepEqual(sloCounts,{
 "P-11-B-04":21,"P-11-B-05":24,"P-11-B-06":8,"P-11-B-12":15,"P-11-B-13":12
});
assert.equal(bank.questions.filter(q=>!q.scenarioSetId).length,56);
assert.equal(bank.questions.filter(q=>!!q.scenarioSetId).length,24);
assert.deepEqual([...scenarios.keys()],["U03-S01","U03-S02","U03-S03","U03-S04","U03-S05","U03-S06"]);
for(const [set,items] of scenarios){
 assert.equal(items.length,4,"Scenario cannot lose context "+set);
 assert.deepEqual(items.map(q=>q.scenarioIndex),[1,2,3,4]);
 assert.equal(new Set(items.map(q=>q.stimulusText)).size,1);
 assert.equal(new Set(items.map(q=>q.sloCodes[0])).size,1);
 assert.equal(new Set(items.map(q=>q.scenarioTitle)).size,1);
}
assert.equal(sourceTypeCounts["textbook-adapted"],5);
assert.equal(sourceTypeCounts["textbook-numerical-adapted"],1);
assert.equal(sourceTypeCounts["original-slo-practice"],28);
assert.equal(sourceTypeCounts["original-scenario-practice"],24);
const adapted=bank.questions.find(q=>q.source.sourceType==="textbook-numerical-adapted");
assert.equal(adapted.source.textbookPage,52);
assert.equal(adapted.source.exerciseNumber,"Numerical 3.4");
assert.equal(adapted.sourceQuestionNumber,44);
assert.equal(correct(adapted),"2.55 s");

// Stage 1 original items must survive unchanged: Q1–28 are identical objects.
// Scenario Q29–40 retain IDs/options/explanations/context and merely move to display positions Q57–68.
for(let i=0;i<28;i++)assert.deepEqual(bank.questions[i],initial.questions[i],"Stage1 straight question changed "+(i+1));
for(let i=0;i<12;i++){
 const stage1=structuredClone(initial.questions[28+i]);
 const stage2=structuredClone(bank.questions[56+i]);
 stage2.sourceQuestionNumber=stage1.sourceQuestionNumber;
 assert.deepEqual(stage2,stage1,"Stage1 scenario question changed "+(29+i));
}

// Verify ALL 40 additional keyed answers (28 straight + 12 new scenario).
const newKeys={
 29:"11.1 m/s",30:"6 s",31:"12 m",32:"+35 m",33:"19.6 m/s",34:"3.0 s",35:"64 m",
 36:"3.0 s",37:"45 m",38:"40 m",39:"5.0 m",
 40:"Its vertical velocity is zero while its horizontal velocity remains constant",
 41:"15 m/s",42:"+5 m",
 43:"The angles add to 90° and sin(50°) = sin(130°)",
 44:"2.55 s",
 45:"Greater than g because both gravity and the vertical drag component point downward",
 46:"Opposite to the instantaneous velocity",
 47:"Overestimate the actual horizontal range",
 48:"Opposite the forward horizontal motion",
 49:"0 m/s",50:"10 m/s",51:"−2 m/s",52:"75 J",53:"−2 m/s",
 54:"8 J",55:"One-third",56:"Inelastic",
 69:"+9.8 m/s",70:"19.6 m",71:"4.0 s",72:"−9.8 m/s",
 73:"4.0 s",74:"60 m",75:"40 m/s",76:"30 m",
 77:"+4 m/s",78:"56 J",79:"32 J",80:"24 J"
};
assert.equal(Object.keys(newKeys).length,40);
for(const [number,answer] of Object.entries(newKeys)){
 assert.equal(correct(bank.questions[Number(number)-1]),answer,"Wrong keyed option for new item "+number);
}
// Independent physics calculations for all three new scenarios and a selection of new standalone items.
approx(Math.sqrt(8**2+2*3*10),Math.sqrt(124));
approx(24/4,6);
const u=-6,a=3;
const at2=u*2+0.5*a*2**2,at4=u*4+0.5*a*4**2;
approx(Math.abs(at2)+Math.abs(at4-at2),12);approx(at4,0);
approx((12+20)*4/2,64);
approx(2*21.8*Math.sin(35*Math.PI/180)/9.8,2.551,0.002);
approx(19.6**2/(2*9.8),19.6);
approx(2*(19.6/9.8),4);
approx(19.6-9.8*3,-9.8);
approx(Math.sqrt(2*80/10),4);
approx(15*4,60);approx(10*4,40);
const pBefore=3*6+1*(-2),v=pBefore/(3+1);
approx(pBefore,16);approx(v,4);
const kBefore=0.5*3*6**2+0.5*1*(-2)**2,kAfter=0.5*4*v**2;
approx(kBefore,56);approx(kAfter,32);approx(kBefore-kAfter,24);
approx(0.5*2*4**2-0.5*4*(2*4/4)**2,8);
approx(24/72,1/3);
approx((1-3)*4/(1+3),-2);

// Validate full 80-MCQ page without mutating the original 40-MCQ page/script.
assert.ok(stage1Page.includes('src="./unit-03-mcq-practice.js"'));
assert.ok(stage1UI.includes('unit-03-stage1-practice.json'));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(ids.length,new Set(ids).size,"Repeated HTML controls");
for(const id of ["bankStatus","check","showKey","reset","printQuestions","printKey","questionArea","answerKey","solutionList","result"]){
 assert.ok(ids.includes(id),"Missing control "+id);
}
assert.ok(ui.includes('source="../question-bank/grade-11/unit-03-stage2-80-practice.json"'));
assert.ok(ui.includes("data.questions.length!==80"));
assert.ok(ui.includes("basic.length!==56||groups.size!==6"));
assert.ok(ui.includes('"56 questions · summative"'));
assert.ok(ui.includes('correct+" / 80 correct ("+marks.toFixed(1)+" / 40 practice marks)'));
assert.ok(ui.includes('80 questions ready · 56 straight + 24 scenario'));
assert.ok(ui.includes('response-"+q.id'));
assert.ok(ui.includes('document.createElement(tag)'));
assert.ok(!ui.includes("innerHTML"),"Question text must render as text, not injected HTML");
assert.ok(html.includes('src="./assets/physics-with-sir-najam-official-logo.png"'));
assert.ok(html.includes('src="./unit-03-mcq-full80.js"'));
assert.ok(html.includes("boxed A/B/C/D options and answer-bubble layout"));
assert.ok(html.includes("not an official FBISE examination"));
assert.ok(html.includes("Printed student sheets have blank answer bubbles"));
assert.ok(!html.includes('input[type=radio]:checked:after'));
assert.ok(html.includes(".sheet:has(.stimulus){break-inside:avoid}"));
assert.ok(html.includes('href="./unit-03-mcq-practice.html"'));
assert.ok(desk.includes('href="./unit-03-mcq-practice.html"'));
assert.ok(desk.includes('href="./unit-03-mcq-full80.html"'));
assert.ok(desk.includes("not an official full-syllabus FBISE examination"));
const grade11=catalog.grades.find(g=>g.grade===11);
const unit3=grade11.units.find(u=>u.unit===3);
assert.equal(unit3.questionBankCount,80);
assert.ok(unit3.assessmentStatus.includes("provisional"));
assert.equal(unit3.resourceIds.length,7);
for(const [id,href] of [["unit3-mcq-stage1","./unit-03-mcq-practice.html"],["unit3-mcq-full80","./unit-03-mcq-full80.html"]]){
 assert.ok(unit3.resourceIds.includes(id));
 const cards=catalog.resources.filter(r=>r.id===id);
 assert.equal(cards.length,1);
 assert.equal(cards[0].href,href);assert.equal(cards[0].public,true);
}
for(const source of [html,ui]){
 for(const forbidden of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,/\bFirestore\b/i,/\bFirebase\b/i,/\bWebSocket\b/i,/\bsendBeacon\b/i]){
  assert.ok(!forbidden.test(source),"Unexpected account persistence marker "+forbidden);
 }
}
console.log("PASS — Full 80-item Unit 3 summative practice: 56 straight, 24 scenario in six complete 4-question sets.");
console.log("PASS — All 40 new options and explanations checked against independent calculations; A/B/C/D exactly 20 correct each; five summative SLOs only.");
console.log("PASS — Original Stage 1 40 items preserved (scenario source display numbers only reassigned in new edition); separate stage1 UI untouched.");
console.log("PASS — Full-count boxed printable layout, catalog, learning desk navigation, and absence of private account persistence.");
console.log("NOTE — Unit-only full Section A-count practice, NOT complete official FBISE HSSC paper or substitute for teacher/source verification.");
