#!/usr/bin/env node
"use strict";
/* NBF Grade XI Physics Unit 4 Part 3 source, numerical, interface and privacy QC.
 * Deterministic maths and DOM checks do not substitute for manual browser or
 * projector checks and independent teacher SLO review.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const core=require(path.join(root,"portal/unit-04-artificial-gravity-engine.js"));
const guide=read("portal/unit-04-artificial-gravity-study.html");
const lab=read("portal/unit-04-artificial-gravity-lab.html");
const ui=read("portal/unit-04-artificial-gravity-ui.js");
const engine=read("portal/unit-04-artificial-gravity-engine.js");
const desk=read("portal/unit-04.html");
const part1=read("portal/unit-04-rotation-study.html");
const part1lab=read("portal/unit-04-rotation-lab.html");
const part2=read("portal/unit-04-centripetal-study.html");
const catalog=JSON.parse(read("portal/learning-catalog.json"));
function near(a,b,tol=1e-9){
 assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=tol,"Expected "+b+" ± "+tol+", observed "+a);
}
near(core.TWO_PI,2*Math.PI);
near(core.STANDARD_G,9.8);
const stationary=core.calculate(1500,0,70);
near(stationary.omegaRadPerSec,0);
near(stationary.centripetalAcceleration,0);
near(stationary.floorNormalNewtons,0);
near(stationary.frequencyHz,0);
assert.equal(stationary.periodSeconds,null);
const ex=core.textbook44();
assert.equal(ex.radiusMetres,1500);
assert.equal(ex.calculated.radiusMetres,1500);
assert.equal(ex.requestedAcceleration,9.8);
near(ex.calculated.centripetalAcceleration,9.8,1e-9);
near(ex.calculated.omegaRadPerSec,Math.sqrt(9.8/1500));
near(ex.calculated.omegaRadPerSec,.080829,.000002);
near(ex.calculated.periodSeconds,77.73,.005);
near(ex.calculated.frequencyHz,.013,.0002);
near(ex.calculated.rpm,.77186,.00001);
near(ex.calculated.rimSpeedMetresPerSec,Math.sqrt(1500*9.8));
near(ex.calculated.floorNormalNewtons,70*9.8,1e-8);
near(ex.calculated.effectiveGravityRatio,1);
assert.equal(ex.textbookValues.omega,"0.08 rad/s");
assert.equal(ex.textbookValues.period,"77.73 s");
assert.equal(ex.textbookValues.frequency,"0.013 Hz");
const asn=core.assignment44();
assert.equal(asn.diameterMetres,8);
assert.equal(asn.radiusMetres,4);
near(asn.rpm,20);
near(asn.calculated.omegaRadPerSec,2*Math.PI/3);
near(asn.calculated.periodSeconds,3);
near(asn.calculated.frequencyHz,1/3);
near(asn.calculated.centripetalAcceleration,17.54596337971441,1e-8);
near(asn.calculated.effectiveGravityRatio,1.7904044265,1e-8);
near(asn.calculated.floorNormalNewtons,70*17.54596337971441,1e-8);
const small=core.designForGravity(4);
near(small.rpm,14.94701341176,.00001);
near(small.centripetalAcceleration,9.8,1e-9);
near(core.designForGravity(4,0).rpm,0);
assert.equal(core.designForGravity(4,0).periodSeconds,null);
for(const bad of [
 ()=>core.calculate(0,1,70),()=>core.calculate(-2,1,70),
 ()=>core.calculate(1,NaN,70),()=>core.calculate(1,-1,70),
 ()=>core.calculate(1,121,70),()=>core.calculate(1,20,0),
 ()=>core.calculate(Infinity,20,70),()=>core.calculate(1,20,Infinity),
 ()=>core.designForGravity(0,9.8),()=>core.designForGravity(1,-1),
 ()=>core.designForGravity(.1,100),()=>core.format(NaN,2),
 ()=>core.format(1,7)
])assert.throws(bad);
let cases=0;
for(const radius of [1,4,20,1500]){
 for(const rpm of [0,.77,5,20,30]){
  for(const mass of [50,70,100]){
   const x=core.calculate(radius,rpm,mass),omega=rpm*2*Math.PI/60;
   near(x.omegaRadPerSec,omega);
   near(x.centripetalAcceleration,omega**2*radius,1e-8);
   near(x.rimSpeedMetresPerSec,omega*radius,1e-8);
   near(x.floorNormalNewtons,mass*omega**2*radius,1e-6);
   near(x.frequencyHz,rpm/60,1e-10);
   if(rpm>0)near(x.periodSeconds,60/rpm,1e-9);
   else assert.equal(x.periodSeconds,null);
   cases++;
  }
 }
}
assert.equal(cases,60);
// At equal RPM doubling radius doubles artificial acceleration;
// at equal radius doubling RPM quadruples artificial acceleration;
// occupant mass affects normal force, but not acceleration.
const base=core.calculate(40,2,70);
near(core.calculate(80,2,70).centripetalAcceleration,2*base.centripetalAcceleration);
near(core.calculate(40,4,70).centripetalAcceleration,4*base.centripetalAcceleration);
near(core.calculate(40,2,140).centripetalAcceleration,base.centripetalAcceleration);
near(core.calculate(40,2,140).floorNormalNewtons,2*base.floorNormalNewtons);
assert.equal(core.format(-.00000001,2),"0");
const weightless=core.conceptualWeightlessness();
assert.equal(weightless.gravityPresent,true);
assert.ok(weightless.gravityDirection.includes("Earth"));
assert.ok(weightless.supportForce.includes("zero"));
assert.ok(weightless.apparentWeight.includes("zero"));
assert.ok(weightless.caveat.toLowerCase().includes("does not mean gravity vanishes"));
// Source and SLO boundaries, mark references and unit-preserving links.
for(const [name,html] of [["Learning Desk",desk],["Study Guide",guide],["Interactive Lab",lab]]){
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,name+" duplicate HTML IDs");
 assert.ok(html.includes('src="./assets/physics-with-sir-najam-official-logo.png"'),"Missing unchanged official logo in "+name);
 for(const slo of ["P-11-B-16","P-11-B-17"])
  assert.ok(html.includes(slo),name+" missing summative "+slo);
}
assert.ok(guide.includes("Weightlessness in Satellites"));
assert.ok(guide.includes("Artificial Gravity"));
assert.ok(guide.includes("gravity is not zero")||guide.includes("Gravity is not zero"));
assert.ok(guide.includes("normal support force"));
assert.ok(guide.includes("frame-dependent"));
assert.ok(guide.includes("NBF EXAMPLE 4.4"));
assert.ok(guide.includes("R = 1500 m"));
assert.ok(guide.includes("77.73 s"));
assert.ok(guide.includes("0.013 Hz"));
assert.ok(guide.includes("NBF ASSIGNMENT 4.4"));
assert.ok(guide.includes("17.55 m/s²"));
assert.ok(guide.includes("1.79"));
assert.ok(guide.includes("P-11-B-18"));
assert.ok(guide.includes('href="./unit-04-mcq-full80.html"'),"Part3 study links to provisional MCQ practice");
for(const href of ["./unit-04-artificial-gravity-study.html","./unit-04-artificial-gravity-lab.html"]){
 assert.ok(desk.includes('href="'+href+'"'),"Missing Unit4 desk link "+href);
}
assert.ok(part1.includes('href="./unit-04-artificial-gravity-study.html"'));
assert.ok(part1lab.includes('href="./unit-04-artificial-gravity-lab.html"'));
assert.ok(part2.includes('href="./unit-04-artificial-gravity-study.html"'));
assert.ok(lab.includes('src="./unit-04-artificial-gravity-engine.js"'));
assert.ok(lab.includes('src="./unit-04-artificial-gravity-ui.js"'));
assert.ok(lab.includes("time-scaled"));
assert.ok(lab.includes("not to spatial scale")||lab.includes("not</strong> to spatial scale"));
for(const id of ["stationRadius","stationRPM","personMass","stationRadiusValue","stationRPMValue",
 "personMassValue","earthTarget","spin","resetSpin","stationStatus","ringPlot","rotatingGroup",
 "floorNormalArrow","normalLabel","artificialAcceleration","gRatio","omega","rimSpeed",
 "period","frequency","normalForce","gravityBar","gravityFill","gravityExplanation"])
 assert.ok(lab.includes('id="'+id+'"'),"Missing lab widget "+id);
for(const p of ["example44","assignment44","small"]){
 assert.ok(lab.includes('data-preset="'+p+'"'),"Missing UI preset "+p);
 assert.ok(ui.includes('which==="'+p+'"'),"Missing JS preset "+p);
}
assert.ok(ui.includes("model.textbook44()"));
assert.ok(ui.includes("model.assignment44()"));
assert.ok(ui.includes("model.designForGravity(radius"));
assert.ok(ui.includes('model.designForGravity(4)'));
assert.ok(ui.includes("Math.min(1.6,10*omega)"),"Animation cap must match described time-scaled display");
assert.ok(ui.includes("model.calculate(radius,rpm,mass)"));
assert.ok(ui.includes("requestAnimationFrame(animate)"));
assert.ok(ui.includes("cancelAnimationFrame(frame)"));
assert.ok(ui.includes('visibilitychange'));
assert.ok(!ui.includes("innerHTML"));
for(const source of [engine,ui,lab]){
 for(const re of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,
  /\bFirebase\b/i,/\bFirestore\b/i,/\bWebSocket\b/i,/\bsendBeacon\b/i,/\bfetch\s*\(/i]){
  assert.ok(!re.test(source),"New lesson must not access student data: "+re);
 }
}
const u4=catalog.grades.find(g=>g.grade===11)?.units.find(x=>x.unit===4);
assert.equal(u4.status,"available");
assert.equal(u4.questionBankCount,640);
assert.equal(u4.assessmentStatus,"provisional-unit4-integrated-80-mark-classroom-practice");
assert.deepEqual(u4.resourceIds,["unit4-desk","unit4-rotation-study","unit4-rotation-lab",
 "unit4-centripetal-study","unit4-centripetal-lab",
 "unit4-artificial-gravity-study","unit4-artificial-gravity-lab","unit4-angular-momentum-study","unit4-angular-momentum-lab","unit4-centrifuge-study","unit4-centrifuge-lab","unit4-slo-audit","unit4-mcq-full80","unit4-descriptive-practice","unit4-assessment-pack","unit4-projector-practice","unit4-discussion-slides","unit4-slo-focus"]);
assert.ok(u4.studentNotice.includes("80 provisional public self-practice MCQs"));
for(const [id,href] of [
 ["unit4-desk","./unit-04.html"],["unit4-rotation-study","./unit-04-rotation-study.html"],
 ["unit4-rotation-lab","./unit-04-rotation-lab.html"],
 ["unit4-centripetal-study","./unit-04-centripetal-study.html"],
 ["unit4-centripetal-lab","./unit-04-centripetal-lab.html"],
 ["unit4-artificial-gravity-study","./unit-04-artificial-gravity-study.html"],
 ["unit4-artificial-gravity-lab","./unit-04-artificial-gravity-lab.html"]]){
 const results=catalog.resources.filter(x=>x.id===id);
 assert.equal(results.length,1,"Duplicate/missing catalog entry "+id);
 assert.equal(results[0].href,href);
 assert.equal(results[0].public,true);
}
const u3=catalog.grades.find(g=>g.grade===11).units.find(x=>x.unit===3);
assert.equal(u3.questionBankCount,220);
assert.equal(u3.resourceIds.length,10);
assert.ok(u3.resourceIds.includes("unit3-assessment-pack"));
console.log("PASS — NBF Example 4.4 radius 1500m, g=9.8, ω≈0.08083, T≈77.73s, f≈0.013 Hz.");
console.log("PASS — NBF Assignment 4.4 radius 4m, 20rpm, a≈17.55m/s²; 60 cases and acceleration/normal-force scaling verified.");
console.log("PASS — Summative B-16/B-17, proper gravity/apparent-weight distinction, safe local time-scaled SVG, prior unit data and source-based Unit 4 practices.");
console.log("NOTE — Provisional education software; no official FBISE marking certification or human-rated station design; live browser inspection required.");
