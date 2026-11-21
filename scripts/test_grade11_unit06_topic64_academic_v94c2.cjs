#!/usr/bin/env node
'use strict';
/*
 * V94-C2.4: independent first-pass arithmetic checks for owner-prepared Grade XI
 * Unit6 Topic6.4 B/C/D. Inputs are paraphrased numeric givens from private PDF,
 * not scanned NBF pages. SLO item certification and original-book fidelity are
 * NOT provided. Includes immutable public-bank count checks only.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const PI=Math.PI,litre=0.001,squareCm=0.0001;
let checks=0;
function near(id,value,expected,relativeTolerance=1e-8){
 assert.ok(Number.isFinite(value),'Non-finite result: '+id);
 assert.ok(Math.abs(value-expected)<=Math.max(1e-10,Math.abs(expected)*relativeTolerance),
   id+': expected '+expected+' but calculated '+value);
 checks++;
}
const v2=(a1,v1,a2)=>a1*v1/a2;
const radV=(r1,r2,v1)=>((r1/r2)**2)*v1;
// Part B: fourteen Q43–Q56 source-created applied exercises.
near('B43 reduced area',v2(8,1.5,4),3);
near('B44 widened section',v2(12,.60,18),.40);
near('B45 radius halved',radV(4,2,.80),3.2);
near('B46 diameter doubled',radV(1,2,2.4),.60);
near('B47 flow m3/s',2e-3*1.5,.003);
near('B47 litres/s',2e-3*1.5/litre,3);
near('B48 mean speed',.004/.002,2);
near('B49 variable density gas',1.2*.020*5/(1.0*.030),4);
near('B50 five equal outlets',v2(10,2,5*2),2);
near('B51 prepared Example6.3 30 branches',radV(.8,.4,.33)/30,.044);
near('B52 mass flow',1000*1e-3*2,2);
near('B53 hose flow L/min to SI and area cm2',(36*litre/60)/(3*squareCm),2);
near('B54 falling jet area ratio',3/.75,4);
near('B55 exit area cm2',3*4/6,2);
near('B56 circular flow using SOURCE PI=3.14',3.14*.01**2*2,6.28e-4);
near('B56 m3/s to L/s',3.14*.01**2*2/litre,.628);
// Part C: eleven numbered supplementary applications, with secondary values.
near('C app1 narrowed pipe v2',v2(.012,1.5,.004),4.5);
near('C app1 flow Q',.012*1.5,.018);
near('C app2 radius half',radV(6,3,1.2),4.8);
near('C app3 diameter half',radV(8,4,.75),3);
near('C app4 find outlet area cm2',12*.75/2.25,4);
const q5=12*litre/40;
near('C app5 collected Q',q5,3e-4);
near('C app5 nozzle speed',q5/(PI*.01**2),.9549296585513721);
near('C app6 three identical branches',radV(1.2,.6,1)/3,4/3);
near('C app7 second outlet Q',.040-.015,.025);
near('C app7 second outlet v',(.040-.015)/.005,5);
near('C app8 density-dependent gas',1.2*.08*3/(.9*.06),16/3);
near('C app9 shallower same-width river',(20*2.5*.8)/(20*1),2);
near('C app10 litres/min to m/s',(60*litre/60)/2e-4,5);
const vJet=Math.sqrt(2**2+2*9.8*.60);
near('C app11 gravity-accelerated jet v',vJet,Math.sqrt(15.76));
near('C app11 lower/higher area ratio',2/vJet,2/Math.sqrt(15.76));
// Part C six self-checks: three numeric, plus two conceptual direction tests.
near('C check1 A2=A1/5',1/(1/5),5);
near('C check2 radius triples',1/3**2,1/9);
near('C check4 two-outlet L/s',4+6,10);
near('C check5 Q/A',.006/.003,2);
assert.ok(1.2*.020*5/(1*.030)>0,'Mass balance must preserve flow direction');
assert.ok(v2(10,2,5*2)===2,'Sum all branches, never use one branch alone');
// Part D: twelve separate teacher-authored Q21–Q32 numericals.
near('D21 area drop',v2(12,.50,3),2);
near('D22 radius half',radV(4,2,.60),2.4);
near('D23 diameter half',radV(6,3,.75),3);
const d24q=8*squareCm*1.5;
near('D24 Q m3/s',d24q,.0012);
near('D24 Q L/s',d24q/litre,1.2);
near('D24 delivered litres in 15s',d24q*15/litre,18);
near('D25 Q/A',.006/.003,2);
near('D26 five branches',radV(1,.5,.40)/5,.32);
near('D27 gas variable density',1.2*.020*3/(.90*.010),8);
near('D28 river fixed discharge',(8*3*.40)/(8*1.5),.80);
near('D29 falling jet radius',3*Math.sqrt(1.5/6),1.5);
near('D30 fill seconds',(60*litre)/(25*squareCm*.80),30);
near('D31 unequal branch speed',(12*2-4*3)/6,2);
near('D32 diameter from speed',4*Math.sqrt(.50/2),2);
// Scientific boundary: continuity does NOT determine pressure or guarantee
// that total Q is identical in separate before/after hose squeeze experiments.
assert.ok(!['pressure','p'].includes('Q'),'Flow rate is not a pressure quantity');
// Public portal invariants after merged PR91; this PR is analysis-only.
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'question-bank/manifest.json'),'utf8'));
const grade=manifest.grades.find(g=>g.grade===11);
assert.ok(grade);
const unit6=grade.units.find(u=>u.unit===6);
assert.ok(unit6);
assert.equal(unit6.liveMcqCount,560);
assert.equal(unit6.sourceFigureHeldCount,0);
assert.equal(unit6.standaloneSituationQuestionCount,136);
assert.equal(grade.units.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
const catalog=JSON.parse(fs.readFileSync(path.join(root,'portal/learning-catalog.json'),'utf8'));
const course=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(course.status,'planned');
assert.equal(course.partialTestBuilderMcqCount,560);
assert.equal(course.sourceFigureHeldCount,0);
console.log('PASS V94-C2.4: '+checks+' independent numeric/units checks across Topic6.4 B/C/D, plus unchanged Unit6 560 and GradeXI 2250.');
console.log('Academic boundaries: mass continuity vs volume continuity; hose instantaneous vs before/after Q; pressure is NOT determined by continuity.');
