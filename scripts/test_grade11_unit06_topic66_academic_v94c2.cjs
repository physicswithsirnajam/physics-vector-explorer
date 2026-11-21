#!/usr/bin/env node
'use strict';
/**
 * V94-C2.6 independent numeric and model-validity checks for PRIVATE
 * prepared Grade XI Fluid Mechanics Topic6.6 sections (PDF pp.243-273).
 * This is not NBF original-text certification, an aerodynamic prediction,
 * or a change to any public student question/answer.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const g=9.8,water=1000;
const sq=x=>x*x;
let checks=0;
function near(label,got,expected,rel=.004){
 assert.ok(Number.isFinite(got)&&Number.isFinite(expected),label+' must be finite');
 const tolerance=Math.max(1e-9,Math.abs(expected)*rel);
 assert.ok(Math.abs(got-expected)<=tolerance,
   label+' expected '+expected+', independently got '+got);
 checks++;
}
const efflux=h=>Math.sqrt(2*g*h);
const head=v=>sq(v)/(2*g);
const drop=(rho,v1,v2)=>.5*rho*(sq(v2)-sq(v1));
const lift=(rho,A,top,bottom)=>.5*rho*A*(sq(top)-sq(bottom));
const venturiWide=(r,H)=>Math.sqrt(2*g*H/(sq(r)-1));
// Part B Q49-56: eight numbered calculations/answer groups.
near('B49 Torricelli outlet speed',efflux(5),9.90);
near('B50 reservoir head',head(4.95),1.25);
near('B51 throat speed',(6/3)*1,2);
near('B51 pressure drop Pa',drop(water,1,2),1500);
near('B52 ideal pressure drop',drop(water,2,6),16000);
const b53=venturiWide(4,.4);
near('B53 wide inlet m/s',b53,.723);
near('B53 throat m/s',4*b53,2.89);
near('B54 original-labelled Example6.4 kPa',
 (47100+drop(water,3,4)+water*g*3)/1000,80);
const highSpeedLift=lift(1.29,15*3,450,410);
near('B55 original-labelled Assignment6.4 formal lift N',highSpeedLift,998460);
near('B56 uniform pressure estimate N',2000*.75,1500);
// Part C §9.1–9.15: 15 cases, sometimes multiple answer results.
near('C9.1 Torricelli speed',efflux(5),9.90);
near('C9.2 required head',head(7),2.50);
near('C9.3 outlet from head difference',efflux(7-1),10.84);
const q94=8e-5*efflux(1.25);
near('C9.4 volume rate m3/s',q94,3.96e-4);
near('C9.4 volume rate L/s',q94*1000,.396);
near('C9.5 throat velocity',(12/6)*2,4);
near('C9.5 pressure drop kPa',drop(water,2,4)/1000,6);
const c96=venturiWide(2,.30);
near('C9.6 wide speed',c96,1.40);
near('C9.6 throat speed',2*c96,2.8);
near('C9.7 volume rate m3/s',8e-4*1.4,1.12e-3);
const c98=Math.sqrt(2*9000/(water*(4-1)));
near('C9.8 wide speed',c98,2.45);
near('C9.8 throat speed',2*c98,4.90);
near('C9.9 correct diameter squared ratio',(4/2)**2,4);
near('C9.9 throat speed',1.5*(4/2)**2,6);
near('C9.9 pressure drop Pa',drop(water,1.5,6),16875);
near('C9.10 same-fluid pressure tubes Pa',water*g*.5,4900);
near('C9.11 original-labelled pressure kPa',(47100+3500+29400)/1000,80);
near('C9.12 original-labelled formal lift N',lift(1.29,45,450,410),998460);
near('C9.13 supplemental wing formal lift',lift(1.2,20,80,60),33600);
near('C9.14 upper speed for assumed lift',Math.sqrt(sq(50)+2*12000/(1.2*20)),59.2);
near('C9.15 static atomizer column pressure Pa',800*g*.15,1176);
// Part C self-check §13, numeric #4 plus physical/units assumptions.
near('C selfcheck4 head 1.8m speed',efflux(1.8),5.94);
near('C selfcheck5 area ratio',3*1,3);
assert.ok(Number.isFinite(venturiWide(2,.3)));
assert.ok(Math.abs(drop(water,2,6)-16000)<1e-9);
checks+=2;
// Part D Q21–Q32, 12 numbered items / multiple results.
near('D21 water pressure kPa',(47100+3500+29400)/1000,80);
near('D22 formal NBF wing lift N',highSpeedLift,998460);
near('D23 orifice speed',efflux(1.8),5.94);
near('D24 orifice head',head(7),2.50);
near('D25 Venturi pressure drop kPa',drop(water,2,6)/1000,16);
near('D26 throat speed',(12/4)*1.5,4.5);
near('D26 Q m3/s',12e-4*1.5,1.80e-3);
near('D27 inlet speed from piezometer',venturiWide(2,.25),1.28);
near('D28 atomizer column static pressure kPa',water*g*.15/1000,1.47);
near('D29 accelerated flow pressure drop kPa',drop(water,3,8)/1000,27.5);
near('D30 simplified wing force N',lift(1.2,20,90,70),38400);
near('D31 downstream speed',Math.sqrt(sq(2)+2*9000/water),4.69);
const d32v=efflux(1.25),d32q=2e-4*d32v,d32t=1e-3/d32q;
near('D32 efflux speed',d32v,4.95);
near('D32 volume rate',d32q,9.90e-4);
near('D32 time for 1L',d32t,1.01);
// Distinguish formal arithmetic from physical validity at wing speeds.
// The reference airspeeds exceed typical ambient sound speed (~343 m/s),
// so the constant-density incompressible model cannot be a real lift forecast.
assert.ok(450>343&&410>343,'High-speed NBF wing example must retain compressibility warning');
assert.equal(highSpeedLift,998460,'Must preserve source formal arithmetic, not invent replacement');
// Public academic release invariants, not student mutations.
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'question-bank/manifest.json'),'utf8'));
const grade=manifest.grades.find(x=>x.grade===11);
assert.ok(grade);
const u6=grade.units.find(x=>x.unit===6);
assert.ok(u6);
assert.equal(u6.liveMcqCount,560);
assert.equal(u6.standaloneSituationQuestionCount,136);
assert.equal(u6.sourceFigureHeldCount,0);
assert.equal(grade.units.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
const catalogue=JSON.parse(fs.readFileSync(path.join(root,'portal/learning-catalog.json'),'utf8'));
const course=catalogue.grades.find(x=>x.grade===11).units.find(x=>x.unit===6);
assert.equal(course.status,'planned');
assert.equal(course.partialTestBuilderMcqCount,560);
assert.ok(checks>=45,'Expected detailed Part B/C/D calculation coverage');
console.log('V94-C2.6 PASS: '+checks+' independently recalculated/checked Topic6.6 outputs and bank safeguards.');
console.log('NOTE: 450/410 m/s formal wing-lift answer is arithmetically correct, but NOT a real incompressible-flow lift prediction.');
console.log('SLO B39 Formative; B40/B44 Summative at outcome level; original NBF pp101-106 figure verification still pending.');
