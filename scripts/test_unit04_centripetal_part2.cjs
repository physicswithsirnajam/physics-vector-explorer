#!/usr/bin/env node
"use strict";
/* Grade XI NBF Physics Unit 4 Part 2 centripetal force mathematics,
 * source scope, interface and integration regression tests.
 * Numerical correctness and structural checks do not certify live rendering.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=name=>fs.readFileSync(path.join(root,"portal",name),"utf8");
const m=require(path.join(root,"portal/unit-04-centripetal-engine.js"));
const engine=read("unit-04-centripetal-engine.js");
const lab=read("unit-04-centripetal-lab.html");
const ui=read("unit-04-centripetal-ui.js");
const study=read("unit-04-centripetal-study.html");
const desk=read("unit-04.html");
const part1=read("unit-04-rotation-study.html");
const part1Lab=read("unit-04-rotation-lab.html");
const catalog=JSON.parse(read("learning-catalog.json"));
const near=(a,b,t=1e-9)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=t,
 "Expected "+b+" ±"+t+" but got "+a);
const test=m.circle(2,6,3);
near(test.centripetalAcceleration,12);
near(test.centripetalNetForce,24);
near(test.angularSpeed,2);
near(test.tangentialAcceleration,0);
const car=m.circle(1000,15,45);
near(car.centripetalAcceleration,5);
near(car.centripetalNetForce,5000);
near(car.angularSpeed,1/3);
near(m.circle(856,12,17).centripetalNetForce,856*144/17);
const stopped=m.circle(850,0,40);
near(stopped.centripetalAcceleration,0);
near(stopped.centripetalNetForce,0);
near(stopped.angularSpeed,0);
for(const bad of [
 ()=>m.circle(0,12,17),()=>m.circle(1,-1,10),()=>m.circle(1,4,0),
 ()=>m.circle(Infinity,3,6),()=>m.circle(1,NaN,10),
 ()=>m.frictionlessBank(10,0),()=>m.frictionlessBank(10,17,0),
 ()=>m.vectors(0,"bad"),()=>m.vectors(Infinity,"cw")
])assert.throws(bad);
const bank=m.frictionlessBank(12,50);
near(bank.tanTheta,144/(50*9.8));
near(bank.angleRadians,Math.atan(144/490));
near(bank.angleDegrees,Math.atan(144/490)*180/Math.PI);
near(m.frictionlessBank(0,50).angleDegrees,0);
for(const mass of [2,50,856,1000]){
 const normal=mass*m.G/Math.cos(bank.angleRadians);
 near(normal*Math.cos(bank.angleRadians),mass*m.G,1e-9);
 near(normal*Math.sin(bank.angleRadians),mass*12**2/50,1e-9);
}
const ex=m.example42();
assert.equal(ex.id,"NBF-4.2");
assert.equal(ex.sourcePage,63);
assert.equal(ex.sourceContinuationPage,64);
assert.equal(ex.mass,856);assert.equal(ex.speed,12);assert.equal(ex.force,7250);
near(ex.radius,856*144/7250);
near(ex.radius,17,.01);
near(ex.calculated.centripetalNetForce,7250,1e-7);
assert.equal(ex.textbookRoundedRadius,17);
const sx=m.scaling(1000,10,50);
near(sx.base,2000);
near(sx.doubleSpeed,8000);
near(sx.doubleRadius,1000);
near(sx.doubleMass,4000);
near(sx.ratioDoubleSpeed,4);
near(sx.ratioDoubleRadius,.5);
near(sx.ratioDoubleMass,2);
for(const mass of [1,2,50,856,1500]){
 for(const speed of [0,1,4,10,12,30]){
  for(const radius of [5,17,50,120]){
   const x=m.circle(mass,speed,radius);
   near(x.centripetalAcceleration,speed**2/radius);
   near(x.centripetalNetForce,mass*x.centripetalAcceleration,1e-7);
   near(x.centripetalAcceleration,radius*x.angularSpeed**2,1e-7);
   const rates=m.scaling(mass,speed,radius);
   near(rates.doubleSpeed,4*rates.base,1e-7);
   near(rates.doubleRadius,.5*rates.base,1e-7);
   near(rates.doubleMass,2*rates.base,1e-7);
  }
 }
}
const ccw=m.vectors(0,"ccw"),cw=m.vectors(0,"cw");
assert.deepEqual(ccw.position,[1,0]);
assert.deepEqual(ccw.inward,[-1,-0]);
assert.deepEqual(ccw.velocity,[-0,1]);
assert.deepEqual(cw.velocity,[0,-1]);
for(const direction of ["cw","ccw"]){
 for(const angle of [0,Math.PI/4,Math.PI/2,Math.PI,3*Math.PI/2,7*Math.PI/3]){
  const v=m.vectors(angle,direction);
  near(v.position[0]**2+v.position[1]**2,1);
  near(v.inward[0]**2+v.inward[1]**2,1);
  near(v.velocity[0]**2+v.velocity[1]**2,1);
  near(v.position[0]*v.inward[0]+v.position[1]*v.inward[1],-1);
  near(v.velocity[0]*v.inward[0]+v.velocity[1]*v.inward[1],0);
 }
}
assert.equal(m.format(7250,0),"7250");
assert.equal(m.format(16.379,1),"16.4");
assert.throws(()=>m.format(NaN));
assert.throws(()=>m.format(1,7));
// Exact source scope: Unit 4 Part 2 printed pp.59-64 and B10/B14/B15 only.
for(const [name,html] of [["Learning Desk",desk],["Guide",study],["Lab",lab]]){
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(s=>s[1]);
 assert.equal(ids.length,new Set(ids).size,name+" has duplicated HTML ids");
 assert.ok(html.includes('src="./assets/physics-with-sir-najam-official-logo.png"'),
  name+" must embed original logo unchanged");
 for(const slo of ["P-11-B-10","P-11-B-14","P-11-B-15"])
  assert.ok(html.includes(slo),name+" missing summative "+slo);
}
for(const page of [study,desk]){
 assert.ok(page.includes("P-11-B-16"),"Satellite weightlessness must remain a later-stage topic");
}
assert.ok(study.includes("printed pp.59–60"));
assert.ok(study.includes("NBF Example 4.2"));
assert.ok(study.includes("856 kg")&&study.includes("7250 N")&&study.includes("17.0 m"));
assert.ok(study.includes("tanθ = v²/(rg)"));
assert.ok(study.includes("Static friction"));
assert.ok(study.includes("normal reaction"));
assert.ok(study.includes("string"));
assert.ok(study.toLowerCase().includes("gravitational"),"Source must include gravity as a centripetal mechanism");
assert.ok(study.includes("not</em> a new or additional")||study.includes("not</em> a new"));
assert.ok(study.includes("tangential acceleration is zero"));
assert.ok(study.includes("not</strong> published a Unit 4 MCQ bank"));
assert.ok(lab.includes('src="./unit-04-centripetal-engine.js"'));
assert.ok(lab.includes('src="./unit-04-centripetal-ui.js"'));
assert.ok(lab.includes("slow motion (30% real-time angular rate)"));
assert.ok(lab.includes("not</strong> a separate extra force"));
assert.ok(lab.includes("not realistic orbital dimensions")||ui.includes("not realistic orbital dimensions"));
for(const id of ["mass","massValue","speed","speedValue","radius","radiusValue","mechanism",
 "mechanismText","play","resetPosition","circlePlot","bodyPoint","radiusRay","velocityArrow",
 "forceArrow","forceLabel","velocityLabel","ac","fc","omega","at","doubleSpeed",
 "doubleRadius","forceGraph","scalingText","bankAngle","bankTangent","normal",
 "bankExplanation"])assert.ok(lab.includes('id="'+id+'"'),"Missing lab control "+id);
for(const preset of ["example-4.2","flat-road","string","banked"]){
 assert.ok(lab.includes('data-preset="'+preset+'"'),"Missing preset "+preset);
 assert.ok(ui.includes('name==="'+preset+'"')||preset==="example-4.2"&&ui.includes("example-4.2"));
}
assert.ok(ui.includes("const dt=Math.min(.07"));
assert.ok(ui.includes("dt*.3"),"Motion display must retain documented 30% time factor");
assert.ok(ui.includes("requestAnimationFrame(animate)"));
assert.ok(ui.includes("cancelAnimationFrame(frame)"));
assert.ok(ui.includes('visibilitychange'));
assert.ok(ui.includes('model.example42()'));
assert.ok(ui.includes('model.frictionlessBank(speed,radius)'));
assert.ok(ui.includes('model.circle(mass,speed,radius)'));
assert.ok(ui.includes('model.scaling(mass,speed,radius)'));
assert.ok(!ui.includes("innerHTML"));
for(const source of [lab,ui,engine]){
 for(const forbid of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,
   /\bFirebase\b/i,/\bFirestore\b/i,/\bWebSocket\b/i,/\bsendBeacon\b/i,/\bfetch\s*\(/i]){
  assert.ok(!forbid.test(source),"Unexpected network/persistent data in force simulator "+forbid);
 }
}
for(const link of ["./unit-04-rotation-study.html","./unit-04-rotation-lab.html",
 "./unit-04-centripetal-study.html","./unit-04-centripetal-lab.html"]){
 assert.ok(desk.includes('href="'+link+'"'),"Desk missing "+link);
}
assert.ok(part1.includes('href="./unit-04-centripetal-study.html"'));
assert.ok(part1Lab.includes('href="./unit-04-centripetal-lab.html"'));
const u4=catalog.grades.find(g=>g.grade===11)?.units.find(x=>x.unit===4);
assert.equal(u4.status,"available");
assert.equal(u4.questionBankCount,0);
assert.equal(u4.assessmentStatus,"no-unit4-mcq-or-descriptive-bank-published");
assert.deepEqual(u4.resourceIds,
 ["unit4-desk","unit4-rotation-study","unit4-rotation-lab","unit4-centripetal-study","unit4-centripetal-lab"]);
assert.ok(u4.studentNotice.includes("No saved scores"));
for(const [id,href] of [
 ["unit4-desk","./unit-04.html"],["unit4-rotation-study","./unit-04-rotation-study.html"],
 ["unit4-rotation-lab","./unit-04-rotation-lab.html"],
 ["unit4-centripetal-study","./unit-04-centripetal-study.html"],
 ["unit4-centripetal-lab","./unit-04-centripetal-lab.html"]]){
 const resources=catalog.resources.filter(x=>x.id===id);
 assert.equal(resources.length,1);
 assert.equal(resources[0].href,href);
 assert.equal(resources[0].public,true);
}
const u3=catalog.grades.find(g=>g.grade===11).units.find(x=>x.unit===3);
assert.equal(u3.questionBankCount,80);assert.equal(u3.resourceIds.length,10);
assert.ok(u3.resourceIds.includes("unit3-assessment-pack"));
console.log("PASS — Unit 4 centripetal a=v²/r, net F=mv²/r, exact NBF Example 4.2 (17 m), mass-independent frictionless bank angle.");
console.log("PASS — 120 speed/mass/radius combinations and speed-squared/force-scaling checks; inward/tangent orthogonal vectors.");
console.log("PASS — Correct B-10/B-14/B-15 source scope; public guide and full interactive control/preset links; existing Unit 4 Part 1 and Unit 3 preserved.");
console.log("PASS — No live student grade, account, remote data, local storage or unpublished Unit 4 MCQ claim.");
console.log("NOTE — Source-based mathematics and DOM checks do not replace live browser or academic teacher-review checks.");
