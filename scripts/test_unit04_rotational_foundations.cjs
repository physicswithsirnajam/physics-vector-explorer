#!/usr/bin/env node
"use strict";
/* Grade XI Physics Unit 4 Part 1 rotational kinematics source, math and privacy QC.
 * These deterministic checks are not a substitute for live projector/browser
 * testing, source-page review or independent FBISE academic certification.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=name=>fs.readFileSync(path.join(root,"portal",name),"utf8");
const m=require(path.join(root,"portal/unit-04-rotational-engine.js"));
const guide=read("unit-04-rotation-study.html");
const desk=read("unit-04.html");
const lab=read("unit-04-rotation-lab.html");
const ui=read("unit-04-rotation-ui.js");
const engine=read("unit-04-rotational-engine.js");
const catalog=JSON.parse(read("learning-catalog.json"));
const close=(actual,expected,tol=1e-8)=>assert.ok(
  Math.abs(actual-expected)<=tol,actual+" differs from "+expected+" by more than "+tol
);
close(m.TAU,2*Math.PI);
close(m.radiansFromDegrees(90),Math.PI/2);
close(m.radiansFromDegrees(360),2*Math.PI);
close(m.radiansFromDegrees(-180),-Math.PI);
close(m.degreesFromRadians(Math.PI/4),45);
assert.throws(()=>m.radiansFromDegrees(Infinity));
assert.throws(()=>m.radiansFromDegrees(1500));
assert.throws(()=>m.circleArc(0,90));
assert.throws(()=>m.rotating(0,2,3,4));
assert.throws(()=>m.rotating(.3,Infinity,1,2));
assert.throws(()=>m.rotating(.3,3,2,-1));
assert.throws(()=>m.sampleRotation(.3,2,1,5,1));
assert.equal(m.tidy(-0.000001),"0");
const a=m.circleArc(.4,90);
close(a.radians,Math.PI/2);
close(a.arcLength,.2*Math.PI);
close(a.revolutions,.25);
const clockwise=m.circleArc(.4,-90);
close(clockwise.arcLength,-.2*Math.PI);
close(clockwise.arcDistance,.2*Math.PI);
close(m.circleArc(2,360).arcLength,4*Math.PI);
close(m.circleArc(2,-360).arcLength,-4*Math.PI);
const steady=m.rotating(.25,8,0,5);
close(steady.theta,40);
close(steady.omega,8);
close(steady.revolutions,40/(2*Math.PI));
close(steady.linearArcDisplacement,10);
close(steady.rimDistance,10);
close(steady.signedTangentialVelocity,2);
close(steady.signedTangentialAcceleration,0);
assert.equal(steady.reverses,false);
const speeding=m.rotating(.5,2,1,4);
close(speeding.omega,6);
close(speeding.theta,16);
close(speeding.signedTangentialVelocity,3);
close(speeding.signedTangentialAcceleration,.5);
close(speeding.omega**2,speeding.omega0**2+2*speeding.alpha*speeding.theta);
const reversing=m.rotating(.4,6,-2,4);
close(reversing.omega,-2);
close(reversing.theta,8);
assert.equal(reversing.reverses,true);
close(reversing.reversalTime,3);
close(reversing.angularDistance,10);
close(reversing.linearArcDisplacement,3.2);
close(reversing.rimDistance,4);
close(reversing.signedTangentialVelocity,-.8);
close(reversing.signedTangentialAcceleration,-.8);
const atStop=m.rotating(.4,6,-2,3);
close(atStop.omega,0);
assert.equal(atStop.reverses,false);
close(atStop.angularDistance,9);
const reverseBefore=m.rotating(.4,6,-2,2);
assert.equal(reverseBefore.reverses,false);
close(reverseBefore.rimDistance,3.2);
const back=m.rotating(.6,-4,1,5);
assert.equal(back.reverses,true);
close(back.reversalTime,4);
close(back.theta,-7.5);
close(back.angularDistance,8.5);
const stationary=m.rotating(.4,0,0,5);
close(stationary.theta,0);
close(stationary.angularDistance,0);
assert.equal(stationary.reverses,false);
for(const r of [.1,.331,1])for(const omega0 of [-10,-4,0,3,14])for(const alpha of [-3,-1,0,2,4])for(const t of [0,.75,3,10,25]){
 const p=m.rotating(r,omega0,alpha,t);
 close(p.identityLeft,p.identityRight,1e-8);
 assert.ok(p.angularDistance+1e-9>=Math.abs(p.theta));
 assert.ok(p.rimDistance+1e-9>=Math.abs(p.linearArcDisplacement));
 close(p.signedTangentialVelocity,r*p.omega);
 close(p.signedTangentialAcceleration,r*alpha);
}
const series=m.sampleRotation(.4,6,-2,4,80);
assert.equal(series.length,81);
close(series[0].time,0);
close(series[80].time,4);
const ex=m.bicycleTyreExercise();
close(ex.radius,.331);close(ex.initialLinearSpeed,6.8);
close(ex.stoppingDistance,74.8);
close(ex.initialOmega,6.8/.331);
close(ex.theta,74.8/.331);
close(ex.numberOfRevolutions,74.8/(2*Math.PI*.331));
close(ex.initialOmega,20.54,.01);
close(ex.numberOfRevolutions,35.96,.02);
close(ex.alpha,-.934,.002);
close(ex.stoppingTime,22,.02);
const stop=m.rotating(ex.radius,ex.initialOmega,ex.alpha,ex.stoppingTime);
close(stop.omega,0,1e-8);
close(stop.linearArcDisplacement,74.8,.00001);
close(stop.rimDistance,74.8,.00001);
assert.ok(ex.textbookPublishedValues.time.includes("21.9"));
assert.ok(ex.roundingNote.toLowerCase().includes("round"));
// Verify source/status language and original, unchanged logo reference.
for(const [name,html] of [["desk",desk],["study",guide],["lab",lab]]){
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(ids.length,new Set(ids).size,name+" page has duplicate IDs");
 assert.ok(html.includes('src="./assets/physics-with-sir-najam-official-logo.png"'),name+" must reuse master logo");
 assert.ok(html.includes("Unit 4")||html.includes("Unit 04"),name+" missing unit title");
}
for(const slo of ["P-11-B-07","P-11-B-08","P-11-B-09"]){
 assert.ok(guide.includes(slo),slo+" missing from textbook guide");
 assert.ok(desk.includes(slo),slo+" missing from Learning Desk");
}
assert.ok(guide.includes("P-11-B-10")&&desk.includes("P-11-B-10"));
assert.ok(guide.includes("SUMMATIVE")&&desk.includes("Summative"));
assert.ok(guide.includes("Example 4.1"));
assert.ok(guide.includes("35.9")&&guide.includes("21.9"));
assert.ok(guide.includes("0.331")&&guide.includes("74.8"));
assert.ok(guide.includes("not</strong> automatically the entire acceleration"));
for(const link of ["./unit-04-rotation-study.html","./unit-04-rotation-lab.html"])
 assert.ok(desk.includes('href="'+link+'"'),"Desk missing "+link);
for(const id of ["arcRadius","arcDegrees","arcRadians","arcLength","arcRevolutions",
 "arcPath","arcRay","arcPoint","arcPlot","arcLabel",
 "wheelRadius","wheelOmega","wheelAlpha","wheelTime",
 "wheelTheta","wheelFinalOmega","wheelRevs","wheelArc","wheelDistance",
 "wheelRimSpeed","wheelTangential","wheelIdentity","wheelStatus","wheelPlay",
 "wheelReset","wheelPlot","wheelGroup","wheelDirection","omegaGraph","thetaGraph"])
 assert.ok(lab.includes('id="'+id+'"'),"Interactive lab missing "+id);
for(const p of ["textbook-4.1","constant","speedup","reversal"])
 assert.ok(lab.includes('data-preset="'+p+'"'),"Missing "+p+" preset");
assert.ok(lab.includes('src="./unit-04-rotational-engine.js"'));
assert.ok(lab.includes('src="./unit-04-rotation-ui.js"'));
assert.ok(ui.includes('requestAnimationFrame(animate)'));
assert.ok(ui.includes('cancelAnimationFrame(frame)'));
assert.ok(ui.includes('visibilitychange'));
assert.ok(ui.includes('const sweep=deg>=0?0:1'));
assert.ok(ui.includes('if(Math.abs(deg)===360)'));
assert.ok(ui.includes('lib.bicycleTyreExercise()'));
assert.ok(ui.includes('p.rimDistance'));
assert.ok(!ui.includes("innerHTML"),"User-facing source values must be rendered as text/SVG nodes");
for(const source of [lab,ui,engine]){
 for(const forbidden of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,
  /\bFirestore\b/i,/\bFirebase\b/i,/\bWebSocket\b/i,/\bsendBeacon\b/i,/\bfetch\s*\(/i])
  assert.ok(!forbidden.test(source),"Simulation unexpectedly uses remote or persistent data: "+forbidden);
}
const unit4=catalog.grades.find(g=>g.grade===11)?.units.find(u=>u.unit===4);
assert.equal(unit4.status,"available");
assert.equal(unit4.questionBankCount,395,"Central Test Builder has original80 plus 315 corrected topic MCQs while original classroom80 is unchanged");
assert.equal(unit4.assessmentStatus,"provisional-unit4-integrated-80-mark-classroom-practice");
assert.deepEqual(unit4.resourceIds,["unit4-desk","unit4-rotation-study","unit4-rotation-lab","unit4-centripetal-study","unit4-centripetal-lab","unit4-artificial-gravity-study","unit4-artificial-gravity-lab","unit4-angular-momentum-study","unit4-angular-momentum-lab","unit4-centrifuge-study","unit4-centrifuge-lab","unit4-slo-audit","unit4-mcq-full80","unit4-descriptive-practice","unit4-assessment-pack","unit4-projector-practice","unit4-discussion-slides","unit4-slo-focus"]);
assert.ok(desk.includes('href="./unit-04-centripetal-study.html"'));
assert.ok(desk.includes('href="./unit-04-centripetal-lab.html"'));
assert.ok(unit4.studentNotice.includes("80 provisional public self-practice MCQs"),"Original classroom bank and expanded central Test Builder must be identified separately");
for(const [id,url] of [["unit4-desk","./unit-04.html"],
 ["unit4-rotation-study","./unit-04-rotation-study.html"],
 ["unit4-rotation-lab","./unit-04-rotation-lab.html"]]){
 const rs=catalog.resources.filter(x=>x.id===id);
 assert.equal(rs.length,1);
 assert.equal(rs[0].href,url);
 assert.equal(rs[0].public,true);
}
const unit3=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===3);
assert.equal(unit3.questionBankCount,220);
assert.equal(unit3.resourceIds.length,10);
assert.ok(unit3.resourceIds.includes("unit3-assessment-pack"));
console.log("PASS — Radians and signed arc length, angle/velocity/acceleration, 375 independently checked rotation combinations, reversal vs distance.");
console.log("PASS — NBF Example 4.1 bicycle wheel: ω₀≈20.54rad/s, N≈35.96, α≈−0.934rad/s², t≈22s (published intermediate rounding disclosed).");
console.log("PASS — Source SLO B-07/B-08/B-09, lab controls, fixed axis/direction convention, no login/storage, and all Unit 3 resources unchanged.");
console.log("NOTE — Automated physics and structure checks are not a live projector/mobile browser test or full textbook academic certification.");
