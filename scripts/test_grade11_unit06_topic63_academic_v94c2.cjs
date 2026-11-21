#!/usr/bin/env node
'use strict';
/* V94-C2.3 — independent fluid-flow arithmetic and public-bank invariants.
 * Inputs come from the user's prepared private Grade XI Unit 6 Topic 6.3
 * study compilation (combined PDF pp.113–136), not a copied textbook PDF.
 * This is not an item-level FBISE or source-fidelity certification.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
let checks=0;
function near(id,actual,expected){
 assert.ok(Number.isFinite(actual),'Nonfinite '+id);
 const tolerance=Math.max(1e-11,Math.abs(expected)*1e-9);
 assert.ok(Math.abs(actual-expected)<=tolerance,id+': expected '+expected+', got '+actual);
 checks++;
}
const lit=1e-3,cm3=1e-6;
const Q=(volume,time)=>volume/time;
// Part B Q46–48: supplemental arithmetic (NOT continuity equation).
near('B46 centimetres cubed per second',600/3,200);
near('B46 SI',600*cm3/3,2e-4);
near('B47 litres per second',1.5/30,0.05);
near('B47 SI',1.5*lit/30,5e-5);
near('B48 transferred volume m3',.002*10,.020);
near('B48 transferred volume litres',.002*10/lit,20);
// Part C conversion examples A, B, C.
near('C conversion A 180L/min -> m3/s',180*lit/60,.003);
near('C conversion B 0.0025m3/s -> L/min',.0025/lit*60,150);
near('C conversion C 0.75L/s -> m3/h',.75*lit*3600,2.70);
// Part C examples C1-C7.
near('C1 0.48m3 in 2 min SI',Q(.48,2*60),.004);
near('C1 litres per second',Q(.48,2*60)/lit,4);
near('C2 720L in 6 min SI',Q(720*lit,6*60),.002);
near('C2 litres per second',Q(720,6*60),2);
near('C3 time seconds',1.8/.015,120);
near('C3 time minutes',(1.8/.015)/60,2);
near('C4 45mL/s for 4min in L',45*(4*60)/1000,10.8);
near('C5 0.75m3 in 5min SI',.75/(5*60),.0025);
near('C6 m3 volume',.008*90,.72);
near('C6 litres volume',.008*90/lit,720);
const avg=(.06+.03)/(20+30);
near('C7 unequal intervals total-average m3/s',avg,.0018);
const naive=((.06/20)+(.03/30))/2;
near('C7 deliberately incorrect unweighted average value',naive,.002);
assert.ok(Math.abs(avg-naive)>1e-5,'Unequal time intervals require volume/time, not simple mean of interval rates');
// Part C p125: independent originally authored volume-time line.
near('C graph slope from origin to endpoint',.20/50,.004);
near('C graph slope from two interior points',(.160-.040)/(40-10),.004);
// Part C eight self-checks: numeric items 1-5.
near('C selfcheck1 L/s',150/50,3);
near('C selfcheck1 m3/s',150*lit/50,.003);
near('C selfcheck2 volume m3',.012*25,.300);
near('C selfcheck3 time s',500/2.5,200);
near('C selfcheck4 conversion m3/s',96*lit/60,.0016);
near('C selfcheck5 graph average m3/s',(.15-.03)/(25-5),.006);
// Part D independent Q29–32; source graph is teacher-developed.
near('D29 Q L/s',18/6,3);
near('D29 Q m3/s',18*lit/6,.003);
near('D30 Q L/s',2.4/8,.30);
near('D30 Q m3/s',2.4*lit/8,.00030);
near('D31 t min',12/2.5,4.8);
near('D31 t s',(12/2.5)*60,288);
near('D32 slope L/s',12/4,3);
near('D32 slope SI',12*lit/4,.003);
// Preserve merged public portal bank/source boundaries, not changing student data.
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'question-bank/manifest.json'),'utf8'));
const grade=manifest.grades.find(g=>g.grade===11);
assert.ok(grade,'Grade XI manifest missing');
const u6=grade.units.find(u=>u.unit===6);
assert.ok(u6,'Unit6 absent');
assert.equal(u6.liveMcqCount,560);
assert.equal(u6.sourceFigureHeldCount,0);
assert.equal(u6.standaloneSituationQuestionCount,136);
assert.equal(grade.units.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
const cat=JSON.parse(fs.readFileSync(path.join(root,'portal/learning-catalog.json'),'utf8'));
const cup=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(cup.status,'planned');
assert.equal(cup.partialTestBuilderMcqCount,560);
assert.equal(cup.sourceFigureHeldCount,0);
console.log('V94-C2.3 PASS — '+checks+' independent Topic6.3 calculation/units/graph checks; unequal-time averaging guarded. Unit6=560 and GradeXI=2250 intact.');
console.log('SLO P-11-B-35 remains outcome-level Summative K+U; Q=V/t numericals in this topic are supplemental; continuity reserved for Topic6.4.');
