#!/usr/bin/env node
"use strict";
/* Source-based QC: NBF XI Unit 4 §§4.3–4.5, pp.64–71, Example 4.3 p.70.
 * FBISE summative B-18, B-19, B-20. No live browser or board certification.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const get=x=>fs.readFileSync(path.join(root,x),"utf8");
const m=require(path.join(root,"portal/unit-04-angular-momentum-engine.js"));
const engine=get("portal/unit-04-angular-momentum-engine.js");
const ui=get("portal/unit-04-angular-momentum-ui.js");
const lab=get("portal/unit-04-angular-momentum-lab.html");
const guide=get("portal/unit-04-angular-momentum-study.html");
const desk=get("portal/unit-04.html");
const catalog=JSON.parse(get("portal/learning-catalog.json"));
const part3=get("portal/unit-04-artificial-gravity-study.html");
const part3lab=get("portal/unit-04-artificial-gravity-lab.html");
const part2=get("portal/unit-04-centripetal-study.html");
function close(a,b,t=1e-8){
 assert.ok(Number.isFinite(a)&&Math.abs(a-b)<=t,"Expected "+b+" ±"+t+", got "+a);
}
const examples=m.example43();
assert.equal(examples.mass,3.6);
assert.equal(examples.radius,.31);
assert.equal(examples.initialRPM,1150);
assert.equal(examples.stoppingTime,7.8);
close(examples.initialMoment,.5*3.6*.31**2);
close(examples.initialMoment,.17298);
close(examples.initialAngularSpeed,1150*2*Math.PI/60);
close(examples.initialAngularSpeed,120.4,.04);
close(examples.initialAngularMomentum,20.83,.01);
close(examples.stoppingTorque,-2.67,.01);
close(examples.stopped.finalOmega,0);
close(examples.stopped.finalL,0);
close(examples.stopped.torqueImpulse,-examples.initialAngularMomentum);
close(examples.stopped.alpha,examples.stoppingTorque/examples.initialMoment);
assert.equal(examples.sourceRounded.angularMomentum,"20.83 kg m²/s");
assert.equal(examples.sourceRounded.torque,"−2.67 N m");
const known=[
 ["point",1],["hoop",1],["disk",.5],["sphere",2/5],["shell",2/3]
];
for(const [shape,factor] of known){
 close(m.moment(shape,3,2).value,12*factor);
 close(m.moment(shape,1,.3).value,.09*factor);
 assert.ok(m.factors[shape].expression.includes("MR²"));
}
assert.throws(()=>m.moment("unknown",1,1));
for(const invalid of [
 ()=>m.moment("disk",0,1),()=>m.moment("disk",1,0),
 ()=>m.moment("disk",Infinity,1),()=>m.moment("disk",1,NaN),
 ()=>m.rpmToRadPerSec(NaN),()=>m.radPerSecToRPM(Infinity),
 ()=>m.rotor("disk",1,.5,1,NaN,0),()=>m.rotor("disk",1,.5,1,2,-1),
 ()=>m.skater(0,.5,.25,3,30),()=>m.skater(1,0,.25,3,30),
 ()=>m.skater(1,.5,0,3,30),()=>m.skater(1,.5,.25,0,30),
 ()=>m.skater(1,.5,.25,3,NaN),()=>m.format(Infinity),()=>m.format(1,7)
])assert.throws(invalid);
for(const rpm of [-1500,-300,0,15,1150])close(m.radPerSecToRPM(m.rpmToRadPerSec(rpm)),rpm);
const fixed=m.rotor("disk",3,.4,200,0,15);
close(fixed.finalOmega,fixed.initialOmega);
close(fixed.initialL,fixed.finalL);
close(fixed.torqueImpulse,0);
close(fixed.initialKE,fixed.finalKE);
close(fixed.alpha,0);
assert.equal(fixed.reverses,false);
const brake=m.rotor("disk",3,.4,60,-1,3);
close(brake.deltaL,-3);
close(brake.finalL,brake.initialL-3);
close(brake.finalOmega,brake.initialOmega-3/brake.moment.value);
const reverses=m.rotor("disk",3,.4,60,-2,3);
assert.equal(reverses.reverses,true);
assert.ok(reverses.angularDistance>Math.abs(reverses.angularDisplacement));
assert.ok(reverses.finalOmega<0);
let rotorCases=0;
for(const shape of Object.keys(m.factors))
 for(const mass of [1,3.6,8])
 for(const radius of [.3,.6,1.2])
 for(const rpm of [0,100,1150])
 for(const torque of [-10,0,10])
 for(const time of [0,2,7.8]){
  const a=m.rotor(shape,mass,radius,rpm,torque,time);
  close(a.finalOmega,a.initialOmega+torque*time/a.moment.value,1e-8);
  close(a.finalL-a.initialL,torque*time,1e-7);
  close(a.angularDisplacement,a.initialOmega*time+.5*a.alpha*time*time,1e-7);
  close(a.initialKE,.5*a.moment.value*a.initialOmega**2,1e-7);
  close(a.finalKE,.5*a.moment.value*a.finalOmega**2,1e-7);
  assert.ok(a.angularDistance>=Math.abs(a.angularDisplacement)-1e-7);
  rotorCases++;
 }
assert.equal(rotorCases,1215);
const sk=m.skater(2,1.2,.3,3,30);
close(sk.initialMoment,3+4*1.2**2);
close(sk.finalMoment,3+4*.3**2);
close(sk.finalMoment*sk.finalOmega,sk.initialMoment*sk.initialOmega);
close(sk.rotationRateRatio,sk.initialMoment/sk.finalMoment);
assert.ok(sk.finalOmega>sk.initialOmega);
assert.ok(sk.finalKE>sk.initialKE);
const outward=m.skater(2,.3,1.2,3,30);
assert.ok(outward.finalOmega<outward.initialOmega);
assert.ok(outward.finalKE<outward.initialKE);
const atRest=m.skater(2,1.2,.3,3,0);
close(atRest.finalOmega,0);
close(atRest.angularMomentum,0);
const identical=m.skater(2,.5,.5,3,20);
close(identical.initialMoment,identical.finalMoment);
close(identical.initialKE,identical.finalKE);
let skaterCases=0;
for(const mass of [1,2,4])for(const core of [1,3,8])
 for(const ri of [.3,1.2])for(const rf of [.3,1.2])
 for(const rpm of [0,30,80]){
  const a=m.skater(mass,ri,rf,core,rpm);
  close(a.initialMoment*a.initialOmega,a.finalMoment*a.finalOmega,1e-8);
  close(a.rotationRateRatio*a.inertiaRatio,1);
  close(a.initialKE,.5*a.initialMoment*a.initialOmega**2,1e-8);
  close(a.finalKE,.5*a.finalMoment*a.finalOmega**2,1e-8);
  skaterCases++;
 }
assert.equal(skaterCases,108);
assert.equal(m.format(-.000001,2),"0");
// Source/assessment boundaries and browser controls.
for(const [name,html] of [["Desk",desk],["Guide",guide],["Lab",lab]]){
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(z=>z[1]);
 assert.equal(ids.length,new Set(ids).size,name+" has duplicate DOM IDs");
 assert.ok(html.includes('src="./assets/physics-with-sir-najam-official-logo.png"'),
   name+" must reuse exact original logo image file");
 for(const slo of ["P-11-B-18","P-11-B-19","P-11-B-20"])
  assert.ok(html.includes(slo),name+" missing summative "+slo);
}
assert.ok(guide.includes("NBF EXAMPLE 4.3"));
assert.ok(guide.includes("3.6 kg"));
assert.ok(guide.includes("0.31 m"));
assert.ok(guide.includes("1150 rpm"));
assert.ok(guide.includes("20.83"));
assert.ok(guide.includes("−2.67"));
assert.ok(guide.includes("7.8 s"));
assert.ok(guide.includes("P-11-B-21"));
assert.ok(guide.includes("printed p.63"));
assert.ok(guide.includes("skater"));
assert.ok(guide.includes("Gyroscope"));
assert.ok(guide.includes("Flywheel")||guide.includes("flywheel"));
assert.ok(guide.includes("rotational kinetic energy"));
assert.ok(guide.includes("constant I")||guide.includes("fixed moment of inertia"));
assert.ok(guide.includes("Στ<sub>ext</sub> = Iα"));
assert.ok(guide.includes("I = Σmᵢrᵢ²"));
assert.ok(lab.includes('src="./unit-04-angular-momentum-engine.js"'));
assert.ok(lab.includes('src="./unit-04-angular-momentum-ui.js"'));
for(const id of [
 "rotorLab","skaterLab","grinderPreset","compareHoop","compareSphere","zeroTorque",
 "shape","rotorMass","rotorRadius","rotorRPM","rotorTorque","rotorTime",
 "rotorPlay","rotorReset","rotorStatus","rotorPlot","rotorGroup","rotorOuter",
 "rotorDirection","rotorShapeLabel","moment","omega0","alpha","omegaFinal",
 "initialL","finalL","torqueImpulse","torqueCheck","omegaChart",
 "skaterIn","skaterOut","skaterReset","handMass","coreMoment","initialArmRadius",
 "finalArmRadius","initialSkaterRPM","skaterPlay","skaterResetAngle","skaterStatus",
 "skaterGroup","skaterArm","skaterHandLeft","skaterHandRight","skaterPlot",
 "skaterDirection","skaterI0","skaterIf","skaterOmega0","skaterOmegaf",
 "skaterL","skaterK0","skaterKf","skaterCheck","inertiaBar","speedBar"]
)assert.ok(lab.includes('id="'+id+'"'),"Missing lab control "+id);
for(const sentinel of [
 'model.example43()','model.rotor(',
 'model.skater(','requestAnimationFrame(','cancelAnimationFrame(',
 'document.addEventListener("visibilitychange"','updateRotor()','updateSkater()'
])assert.ok(ui.includes(sentinel),"Missing browser behavior "+sentinel);
assert.ok(ui.includes("Math.abs(p.deltaL-p.torqueImpulse)<1e-7"));
assert.ok(ui.includes("p.finalMoment*p.finalOmega-p.angularMomentum"));
assert.ok(!ui.includes("innerHTML"),"Students should see safe text node values, not injected HTML");
for(const source of [engine,lab,ui]){
 for(const bad of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,
  /\bFirebase\b/i,/\bFirestore\b/i,/\bWebSocket\b/i,/\bsendBeacon\b/i,/\bfetch\s*\(/i])
   assert.ok(!bad.test(source),"Unexpected external data/student storage marker");
}
assert.ok(lab.includes("computed values use unscaled physics inputs")||
 lab.includes("computed values use unscaled physics"));
for(const link of ["./unit-04-angular-momentum-study.html","./unit-04-angular-momentum-lab.html"])
 assert.ok(desk.includes('href="'+link+'"'),"Missing new link from Unit 4 desk");
assert.ok(part3.includes('href="./unit-04-angular-momentum-study.html"'));
assert.ok(part3lab.includes('href="./unit-04-angular-momentum-lab.html"'));
assert.ok(part2.includes('href="./unit-04-angular-momentum-study.html"'));
const unit4=catalog.grades.find(g=>g.grade===11)?.units.find(u=>u.unit===4);
assert.equal(unit4.status,"available");
assert.equal(unit4.questionBankCount,80);
assert.equal(unit4.assessmentStatus,"provisional-unit4-public-mcq-self-practice");
assert.equal(unit4.resourceIds.length,13);
assert.equal(new Set(unit4.resourceIds).size,13);
assert.ok(unit4.studentNotice.includes("80 provisional public self-practice MCQs"));
assert.ok(unit4.studentNotice.includes("P-11-B-21"));
for(const [id,href] of [
 ["unit4-angular-momentum-study","./unit-04-angular-momentum-study.html"],
 ["unit4-angular-momentum-lab","./unit-04-angular-momentum-lab.html"]]){
 assert.ok(unit4.resourceIds.includes(id));
 const records=catalog.resources.filter(x=>x.id===id);
 assert.equal(records.length,1);
 assert.equal(records[0].href,href);
 assert.equal(records[0].public,true);
}
const u3=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===3);
assert.equal(u3.questionBankCount,80);
assert.equal(u3.resourceIds.length,10);
assert.ok(u3.resourceIds.includes("unit3-assessment-pack"));
console.log("PASS — NBF Example 4.3: I=0.17298 kg m², ω≈120.4rad/s, L≈20.83 kg m²/s, stopping τ≈−2.67 N m.");
console.log("PASS — "+rotorCases+" rotor combinations with L impulse/torque identity, + "+skaterCases+" L-conserving skater combinations.");
console.log("PASS — B-18/B-19/B-20 source coverage, gyroscope/skater/flywheel notes, B-21 centrifuge audit kept separate and mapped.");
console.log("PASS — Classroom controls, book presets, original logo, previous Unit 4 labs, unchanged Unit 3 catalogue and no student storage.");
console.log("NOTE — Source-aligned practice model, not an official board exam; live browser/projector checks still required.");
