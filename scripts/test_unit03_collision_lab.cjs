#!/usr/bin/env node
"use strict";
/* Technical QA for source-based Unit 3 Part 2, not a formal answer-key certification. */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=name=>fs.readFileSync(path.join(root,"portal",name),"utf8");
const c=require(path.join(root,"portal/unit-03-collision-engine.js"));
const doc=read("unit-03-collision-lab.html"),guide=read("unit-03-collision-study.html"),
      desk=read("unit-03.html"),ui=read("unit-03-collision-ui.js"),
      engine=read("unit-03-collision-engine.js"),catalog=JSON.parse(read("learning-catalog.json"));
const close=(actual,expected,eps=1e-8)=>
  assert.ok(Math.abs(actual-expected)<=eps,String(actual)+" differs from "+expected+" beyond "+eps);
assert.deepEqual(c.presets.map(x=>x.id),["textbook-3.7","equal-masses","opposing","stick"]);
const e=c.collision(5,10,10,5,"elastic");
close(e.v1,10/3);close(e.v2,25/3);
close(e.momentumBefore,100);close(e.momentumAfter,100);
close(e.kineticBefore,375);close(e.kineticAfter,375);close(e.kineticLoss,0);
close(e.approachSpeed,5);close(e.separationSpeed,5);
assert.equal(c.checkConservation(e).momentumConserved,true);
assert.equal(c.checkConservation(e).energyConserved,true);
assert.equal(c.checkConservation(e).relativeSpeedRuleHolds,true);
const s=c.collision(5,10,10,5,"stick");
close(s.v1,20/3);close(s.v2,20/3);
close(s.kineticBefore,375);close(s.kineticAfter,1000/3);close(s.kineticLoss,125/3);
assert.equal(c.checkConservation(s).momentumConserved,true);
assert.equal(c.checkConservation(s).energyConserved,false);
assert.equal(c.checkConservation(s).relativeSpeedRuleHolds,false);
const eq=c.collision(2,2,8,0,"elastic");close(eq.v1,0);close(eq.v2,8);
const opposite=c.collision(2,3,4,-2,"elastic");
close(opposite.v1,-3.2);close(opposite.v2,2.8);
assert.throws(()=>c.collision(5,10,5,5,"elastic"),/approach/i);
assert.throws(()=>c.collision(5,10,3,7,"elastic"),/approach/i);
assert.throws(()=>c.collision(0,10,10,5,"elastic"),/m1/);
assert.throws(()=>c.collision(5,10,10,5,"unknown"),/Unknown/);
assert.throws(()=>c.collision(5,10,Infinity,5,"elastic"),/u1/);
assert.throws(()=>c.topic("unrecognized"),/Unknown/);
assert.equal(c.fmt(-0.0000001),"0");
let cases=0;
for(const m1 of [1,2,4,9,16])for(const m2 of [1,3,5,12])
for(const u1 of [-3,0,5,12])for(const u2 of [-8,-1,3,10]){
 if(u1<=u2)continue;
 for(const type of ["elastic","stick"]){
  const r=c.collision(m1,m2,u1,u2,type),verified=c.checkConservation(r);
  assert.equal(verified.momentumConserved,true);
  assert.equal(verified.energyConserved,type==="elastic");
  assert.equal(verified.relativeSpeedRuleHolds,type==="elastic");
  assert.ok(r.kineticLoss>=-1e-10);
  if(type==="stick")close(r.v1,r.v2);
  cases++;
 }
}
assert.ok(cases>300);
assert.deepEqual(c.topics,["range","horizontal","vertical","peak"]);
for(const name of c.topics){
 const x=c.topic(name);
 for(const field of ["title","noDrag","withDrag","caution"])assert.ok(x[field] && x[field].length>(field==="title"?5:35),name+" missing "+field);
}
assert.match(c.topic("horizontal").withDrag,/decreases/i);
assert.match(c.topic("vertical").withDrag,/opposes velocity/i);
assert.match(c.topic("range").withDrag,/shorter/i);
const ids=page=>[...page.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
for(const [name,page] of [["lab",doc],["guide",guide],["desk",desk]]){
 const values=ids(page);
 assert.equal(values.length,new Set(values).size,name+" has duplicate IDs");
 assert.ok(page.includes('src="./assets/physics-with-sir-najam-official-logo.png"'));
}
for(const id of ["dragPlot","idealPath","dragPath","dragTitle","idealExplanation",
 "dragExplanation","dragCaution","collisionType","m1","m2","u1","u2","m1Label",
 "m2Label","u1Label","u2Label","collisionStatus","collisionPlot","v1Value",
 "v2Value","momentumValue","kineticValue","lossValue","relativeValue","conclusion"])
 assert.ok(ids(doc).includes(id),"Missing control "+id);
for(const name of c.topics)assert.ok(doc.includes('data-focus="'+name+'"'));
for(const item of c.presets)assert.ok(doc.includes('data-preset="'+item.id+'"'));
assert.ok(doc.includes('src="./unit-03-collision-ui.js"'));
assert.ok(doc.includes('src="./unit-03-collision-engine.js"'));
assert.ok(doc.includes("qualitative schematic")&&doc.includes("not a calculated drag trajectory"));
assert.ok(doc.includes("u₁ &gt; u₂"),"Approach must be explained");
assert.ok(guide.includes("Textbook Example 3.7")&&guide.includes("3.33 m/s")&&guide.includes("8.33 m/s"));
assert.ok(guide.includes("41.67 J"));
assert.ok(guide.includes("the textbook's original elastic Example 3.7"));
for(const pair of [["P-11-B-06","Summative"],["P-11-B-11","Formative"],
 ["P-11-B-12","Summative"],["P-11-B-13","Summative"]]){
 const i=guide.indexOf(pair[0]);
 assert.ok(i>=0 && guide.slice(i,i+470).includes(pair[1]),"Wrong framework label for "+pair[0]);
}
for(const url of ["./unit-03-collision-study.html","./unit-03-collision-lab.html",
 "./unit-03-study-guide.html","./unit-03-motion-lab.html"]){
 assert.ok(desk.includes('href="'+url+'"'),"Desk missing "+url);
}
assert.ok(desk.includes("not yet published"));
const unit3=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===3);
assert.equal(unit3.questionBankCount,0);assert.equal(unit3.assessmentStatus,"no-mcq-bank-published");
assert.equal(unit3.resourceIds.length,5);
for(const [id,href] of [["unit3-collision-study","./unit-03-collision-study.html"],
 ["unit3-collision-lab","./unit-03-collision-lab.html"]]){
 assert.ok(unit3.resourceIds.includes(id));
 const match=catalog.resources.filter(x=>x.id===id);
 assert.equal(match.length,1);assert.equal(match[0].href,href);assert.equal(match[0].public,true);
}
for(const source of [doc,ui,engine]){
 for(const forbidden of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,
 /\bFirebase\b/i,/\bFirestore\b/i,/\bfetch\s*\(/i,/\bWebSocket\b/i,/\bsendBeacon\b/i]){
  assert.ok(!forbidden.test(source),"Unexpected data persistence/network marker");
 }
}
assert.ok(!ui.includes("innerHTML"));
console.log("PASS — Textbook elastic example, sticking extension, "+cases+" 1D collision cases, approach and conservation safeguards.");
console.log("PASS — Qualitative drag explanation, correct official formative/summative SLOs, links, intact zero-MCQ status and local-only activity.");
console.log("NOTE — Technical mathematical tests cannot replace live browser visual checks or full source-based academic verification.");
