#!/usr/bin/env node
"use strict";
/* Unit 3 first-release smoke/integrity tests. Requires only Node's built-ins. */
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const root = path.resolve(__dirname, "..");
const physics = require(path.join(root,"portal/unit-03-motion-engine.js"));
const html = name => fs.readFileSync(path.join(root,"portal",name),"utf8");
const desk = html("unit-03.html");
const study = html("unit-03-study-guide.html");
const lab = html("unit-03-motion-lab.html");
const ui = html("unit-03-motion-ui.js");
const engineJs = html("unit-03-motion-engine.js");
const catalog = JSON.parse(html("learning-catalog.json"));
const close = (n,expected,tol=.02) => assert.ok(Math.abs(n-expected)<=tol, String(n)+" differs from "+expected+" beyond "+tol);

assert.equal(physics.GRAVITY,9.8);
const bus = physics.motion(10,2,5);close(bus.v,20);close(bus.s,75);close(bus.velocitySquared,bus.rhsThirdEquation,.0001);
const car = physics.motion(4,1,10);close(car.s,90);close(car.v,14);close(car.distance,90);
const reversing = physics.motion(4,-2,4);close(reversing.s,0);close(reversing.v,-4);close(reversing.distance,8);close(reversing.turnTime,2);
const braking = physics.motion(20,-2,5);close(braking.v,10);close(braking.s,75);close(braking.distance,75);
const stationary = physics.motion(0,0,5);close(stationary.distance,0);
const frozen = physics.motion(-8,0,2);close(frozen.s,-16);close(frozen.distance,16);
assert.throws(()=>physics.motion(10,2,-1));
assert.throws(()=>physics.motion(Infinity,2,3));
for(const u of [-12,-5,0,4,15])for(const a of [-6,-2,0,1,5])for(const t of [0,1,4,11]){
 const m=physics.motion(u,a,t);close(m.v*m.v, m.u*m.u+2*m.a*m.s,.000001);
 assert.ok(m.distance+1e-9>=Math.abs(m.s));
}
assert.equal(physics.sampleMotion(4,-2,4,10).length,11);
const original=physics.examples.motion;
assert.deepEqual(original.map(x=>x.id),["textbook-3.1","textbook-3.2","deceleration","reversal"]);
for(const x of original){const m=physics.motion(x.u,x.a,x.t);assert.ok(Number.isFinite(m.s));}
assert.equal(physics.format(-0.000001), "0");

const p45=physics.projectile(20,45), p30=physics.projectile(20,30),p60=physics.projectile(20,60);
close(p45.flightTime,2.886,.004);close(p45.range,40.816,.004);close(p45.maxHeight,10.204,.004);
close(p30.range,p60.range,.00001);
assert.ok(p60.flightTime>p30.flightTime);assert.ok(p60.maxHeight>p30.maxHeight);
assert.ok(p45.range>p30.range);
const pText=physics.projectile(200,30);
close(pText.flightTime,20.408,.01);close(pText.maxHeight,510.204,.01);close(pText.range,3534.8,.1);
const start=physics.projectileAt(p45,0);
const apex=physics.projectileAt(p45,p45.apexTime);
const end=physics.projectileAt(p45,p45.flightTime);
close(start.x,0);close(start.y,0);
close(apex.y,p45.maxHeight,.0001);close(apex.vy,0,.000001);
close(end.x,p45.range,.0001);close(end.y,0,.000001);
close(start.vx,end.vx,.000001);
assert.ok(start.vy>0 && end.vy<0);
const route=physics.sampleProjectile(p45,80);
assert.equal(route.length,81);
for(const t of route){assert.ok(t.y>=-1e-7);close(t.vx,p45.ux,.000001);}
assert.throws(()=>physics.projectile(0,45));
assert.throws(()=>physics.projectile(20,90));
assert.throws(()=>physics.projectile(20,45,0));
assert.throws(()=>physics.projectileAt(p45,-1));

const exactIds=(page)=>[...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
for(const [name,page] of [["desk",desk],["study",study],["lab",lab]]){
 const ids=exactIds(page);
 assert.equal(ids.length,new Set(ids).size,name+" contains duplicate DOM IDs");
 assert.ok(page.includes('src="./assets/physics-with-sir-najam-official-logo.png"'),name+" must use existing official logo");
 assert.ok(page.includes('href="./unit-03.html"')||name==="desk",name+" must link back to Unit 3");
}
for(const id of [
 "uRange","aRange","tRange","motionTime","motionV","motionS","motionD","motionA",
 "velocityGraph","positionGraph","speedRange","angleRange","projectileTime",
 "projectilePlay","projectileReset","projectilePlot","projectileT","projectileH",
 "projectileR","projectileXY","projectileVX","projectileVY"])assert.ok(exactIds(lab).includes(id),id+" must exist");
assert.ok(lab.includes('src="./unit-03-motion-ui.js"'));
assert.ok(lab.includes('src="./unit-03-motion-engine.js"'));
for(const word of ["P-11-B-03","P-11-B-04","P-11-B-05","formative","summative"]){
 assert.ok(new RegExp(word,"i").test(study),"Study guide missing SLO/status: "+word);
}
assert.ok(study.includes("P-11-B-06"));
assert.ok(study.includes("90 m") && study.includes("20 m/s"));
assert.ok(study.includes("3534.8"));
assert.ok(desk.includes('href="./unit-03-motion-lab.html"'));
assert.ok(desk.includes('href="./unit-03-study-guide.html"'));
assert.ok(desk.includes("no Unit 3")||desk.includes("not yet published"));
const u3=catalog.grades.find(g=>g.grade===11)?.units.find(u=>u.unit===3);
assert.equal(u3.status,"available");
assert.equal(u3.questionBankCount,0,"No Unit 3 MCQ bank was created");
assert.equal(u3.assessmentStatus,"no-mcq-bank-published");
for(const [id,target] of [["unit3-desk","./unit-03.html"],["unit3-study-guide","./unit-03-study-guide.html"],["unit3-motion-lab","./unit-03-motion-lab.html"]]){
 assert.ok(u3.resourceIds.includes(id));
 const r=catalog.resources.filter(r=>r.id===id);assert.equal(r.length,1);
 assert.equal(r[0].href,target);assert.equal(r[0].public,true);
}
for(const r of catalog.resources.filter(r=>r.id.startsWith("unit2-"))){
 assert.ok(r.href,"Previously published Unit 2 links preserved");
}
for(const [name,client] of [["lab",lab],["UI",ui],["engine",engineJs]]){
 for(const forbidden of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,/\bFirestore\b/i,/\bFirebase\b/i,/\bfetch\s*\(/i,/\bWebSocket\b/i,/\bsendBeacon\b/i]){
  assert.ok(!forbidden.test(client),name+" unexpectedly uses remote or persistent data: "+forbidden);
 }
}
assert.ok(!ui.includes("innerHTML"),"SVG and HTML UI should use text nodes rather than HTML injection");
console.log("PASS — NBF example 3.1, 3.2 and 3.5 maths, v² relation, reversal/distance distinction, projectile range/height/time, complementary angles.");
console.log("PASS — Unit 3 catalogue, partial coverage language, source-aligned SLO mapping, 3 public learning pages, stable Unit 2 resources, no account writing.");
console.log("NOTE — Technical mathematical checks do not replace live-browser visual QC, source page inspection or FBISE paper compliance.");
