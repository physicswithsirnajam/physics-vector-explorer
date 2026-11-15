#!/usr/bin/env node
"use strict";
/* Source-based academic and structural QA; not an official paper certification. */
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const numerical=JSON.parse(read("question-bank/grade-11/unit-03-textbook-numericals.json"));
const paper=JSON.parse(read("question-bank/grade-11/unit-03-descriptive-practice.json"));
const desk=read("portal/unit-03.html");
const np=read("portal/unit-03-numericals.html"),nj=read("portal/unit-03-numericals.js");
const dp=read("portal/unit-03-descriptive-practice.html"),dj=read("portal/unit-03-descriptive-practice.js");
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const near=(a,b,t=.01)=>assert.ok(Math.abs(a-b)<=t,"Expected "+b+" ±"+t+"; got "+a);
const allowed=["P-11-B-04","P-11-B-05","P-11-B-06","P-11-B-12","P-11-B-13"];
assert.equal(numerical.schemaVersion,1);assert.equal(numerical.status,"teacher-review-pending");
assert.equal(numerical.numericals.length,8);
assert.equal(numerical.numericals.filter(n=>n.assessment==="summative").length,6);
assert.equal(numerical.numericals.filter(n=>n.assessment!=="summative").length,2);
for(const [i,n] of numerical.numericals.entries()){
 assert.equal(n.id,"XI-U03-N-3."+(i+1));
 assert.equal(n.sourceExercise,"Numerical 3."+(i+1));
 assert.ok([51,52].includes(n.sourcePage));
 assert.ok(n.question.length>40&&n.given.length>25);
 assert.ok(n.answer&&n.sourceAnswer&&n.note);
 assert.ok(n.steps.length>=3&&n.steps.every(step=>step.marks>0&&step.text.length>=24));
 assert.equal(n.steps.reduce((s,step)=>s+step.marks,0),n.practiceMarks);
 if(n.assessment==="summative")assert.ok(allowed.includes(n.slo),"Wrong summative mapping "+n.id);
 else assert.ok(["formative","supplementary-formative"].includes(n.assessment));
}
assert.equal(numerical.numericals[5].slo,"P-11-B-11");
assert.equal(numerical.numericals[5].assessment,"formative");
assert.equal(numerical.numericals[7].slo,null);
assert.equal(numerical.numericals[7].assessment,"supplementary-formative");
assert.ok(numerical.policy.includes("NOT official"));
// Independently calculate all eight textbook numerical cases.
near(900/14,64.285714,.00001);near(900/10,90);
near(Math.atan(4)*180/Math.PI,76,.05);
near(100/5,20);near(10000/(2*5),1000);
const v=21.8,theta=35*Math.PI/180,g=9.8;
near(2*v*Math.sin(theta)/g,2.55,.01);
near(v*v*Math.sin(theta)**2/(2*g),7.98,.01);
near(v*v*Math.sin(2*theta)/g,45.6,.06);
const flight=Math.sqrt(2*45.2/g);
near(17.6/flight,5.79,.01);
near((2-1)/2,.5);
const v1=(.5-3.5)*4/(.5+3.5),v2=2*.5*4/(.5+3.5);
near(v1,-3);near(v2,1);
near(.5*.5*4**2,.5*.5*v1**2+.5*3.5*v2**2);
const accel=582**2/(2*.75);
near(582/accel,.00258,.00001);
near(.0175*accel,3950,5);
near(.0175*582,10.2,.03);
for(const x of ["64.3","76°","20 s","2.55 s","5.79","0.5 m/s","−3.0 m/s","0.00258 s"])
 assert.ok(numerical.numericals.some(n=>n.sourceAnswer.includes(x)),"Missing source answer "+x);
// Verify 7x4, 2x6, OR alternatives and teacher mark breakdowns.
assert.equal(paper.schemaVersion,1);
assert.equal(paper.status,"teacher-review-pending");
assert.equal(paper.pattern.sectionB.questions,7);
assert.equal(paper.pattern.sectionB.marksEach,4);
assert.equal(paper.pattern.sectionB.total,28);
assert.equal(paper.pattern.sectionC.questions,2);
assert.equal(paper.pattern.sectionC.marksEach,6);
assert.equal(paper.pattern.sectionC.total,12);
assert.equal(paper.pattern.totalMarks,40);
assert.equal(paper.sectionB.length,7);assert.equal(paper.sectionC.length,2);
const items=[...paper.sectionB,...paper.sectionC],sloPresent=new Set();
let count=0;
for(const [i,q] of items.entries()){
 const expected=i<7?4:6;
 assert.equal(q.number,i+1);assert.equal(q.marks,expected);
 assert.equal(q.choices.length,2);
 for(const c of q.choices){
  count++;
  assert.ok(allowed.includes(c.slo),"Formative SLO appears in summative paper: "+c.slo);
  sloPresent.add(c.slo);
  assert.equal(c.assessment,"summative-theory");
  assert.ok(c.sourcePage>=33&&c.sourcePage<=52);
  assert.ok(c.sourceRef.length>=18&&c.prompt.length>=45);
  assert.ok(c.marking.length>=3);
  assert.equal(c.marking.reduce((sum,m)=>sum+m.marks,0),expected);
  assert.ok(c.marking.every(m=>Number.isInteger(m.marks)&&m.marks>=1&&m.text.length>=14),"Empty or unmarked solution step");
 }
}
assert.equal(count,18);
assert.deepEqual([...sloPresent].sort(),allowed.slice().sort());
assert.ok(paper.assessmentPolicy.includes("B-03")&&paper.assessmentPolicy.includes("B-11"));
assert.ok(paper.sectionB[6].choices[1].marking.some(m=>m.text.includes("6 J")));
assert.ok(paper.sectionC[0].choices[0].marking.some(m=>m.text.includes("sin(2θ)")));
assert.ok(paper.sectionC[1].choices[0].marking.some(m=>m.text.includes("u₁−u₂=v₂−v₁")));
near(.5*4*3**2-.5*6*2**2,6);
near(375-.5*15*(100/15)**2,125/3,.00001);
// No attached account services; safe text rendering and printed question/key distinction.
for(const [html,script,file] of [
 [np,nj,"unit-03-numericals.js"],[dp,dj,"unit-03-descriptive-practice.js"]]){
 assert.ok(html.includes('src="./assets/physics-with-sir-najam-official-logo.png"'));
 assert.ok(html.includes('src="./'+file+'"'));
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicate HTML IDs");
 assert.ok(html.includes("Print")&&html.includes("body.print-teacher"));
 assert.ok(html.includes(".answer-space{display:block"));
 assert.ok(script.includes("window.print()")&&script.includes("afterprint"));
 assert.ok(script.includes('cache:"no-store"'));
 assert.ok(!script.includes("innerHTML"));
 for(const forbidden of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,
    /\bFirestore\b/i,/\bFirebase\b/i,/\bWebSocket\b/i,/\bsendBeacon\b/i])
  assert.ok(!forbidden.test(html+script),"Unexpected account/persistence API marker");
}
for(const link of ["./unit-03-numericals.html","./unit-03-descriptive-practice.html",
 "./unit-03-mcq-full80.html","./unit-03-mcq-practice.html",
 "./unit-03-motion-lab.html","./unit-03-collision-lab.html"])
 assert.ok(desk.includes('href="'+link+'"'),"Missing Unit 3 desk link "+link);
assert.equal(catalog.catalogVersion,"pilot-v32-unit3-descriptive-and-textbook-numericals-2026-11-15");
const unit=catalog.grades.find(g=>g.grade===11)?.units.find(u=>u.unit===3);
assert.equal(unit.questionBankCount,80);
assert.equal(unit.resourceIds.length,9);
for(const [id,href] of [["unit3-textbook-numericals","./unit-03-numericals.html"],
 ["unit3-descriptive-practice","./unit-03-descriptive-practice.html"]]){
 assert.ok(unit.resourceIds.includes(id));
 const matches=catalog.resources.filter(r=>r.id===id);
 assert.equal(matches.length,1);
 assert.equal(matches[0].href,href);assert.equal(matches[0].public,true);
}
console.log("PASS — All eight Unit 3 textbook numericals, answer values, six summative-aligned and two formative/supplementary classifications.");
console.log("PASS — 40-mark descriptive pattern (B: seven 4-mark OR pairs; C: two 6-mark OR pairs), 18 model answers and complete step mark splits.");
console.log("PASS — Formative B-03/B-11 excluded from summative paper, source pages, independent calculations and student/teacher printable pages.");
console.log("NOTE — Provisional educational adaptation; teacher scientific review and live browser print check still required.");
