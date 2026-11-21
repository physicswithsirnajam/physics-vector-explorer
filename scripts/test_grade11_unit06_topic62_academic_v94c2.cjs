#!/usr/bin/env node
'use strict';
/* V94-C2.2: deterministic independent arithmetic for prepared Topic6.2
   Part B/C/D; private PDF content is not copied into GitHub.
   These checks verify stated algebra under assumptions, NOT the validity of
   applying Stokes drag to high-Re real raindrops/parachutes. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const pi=Math.PI,piSource=3.14,g=9.8;
let count=0;
function near(label,actual,expected,rel=3e-5){
  assert.ok(Number.isFinite(actual),'Nonfinite '+label);
  assert.ok(Math.abs(actual-expected)<=Math.max(1e-12,rel*Math.abs(expected)),label+': got '+actual+' expected '+expected);
  count++;
}
const drag=(eta,r,v,p=pi)=>6*p*eta*r*v;
const terminal=(rho,r,eta)=>2*rho*g*r*r/(9*eta);
const terminalWithBuoyancy=(rhoSphere,rhoFluid,r,eta)=>2*(rhoSphere-rhoFluid)*g*r*r/(9*eta);
// Part B Q30 and formal quantitative Q43–56
near('B30: resulting force downward',.020-.008,.012);
near('B43 original Example6.2 formal drag',drag(1.9e-5,.002,2,piSource),1.43184e-6);
near('B44 model drag',drag(1.9e-5,.001,1,piSource),3.5796e-7);
near('B45 doubling radius at fixed viscosity/speed',2/1,2);
near('B46 doubling speed at fixed radius',2/1,2);
near('B47 doubling viscosity',.20/.10,2);
near('B48 model drag',drag(2e-5,.001,.5,piSource),1.884e-7);
near('B49 radius from drag',1.884e-6/drag(1e-3,1,.1,piSource),.001);
near('B50 viscosity from drag',1.884e-6/drag(1,.001,.1,piSource),.001);
near('B51 speed from mass force balance',1e-6*g/drag(.10,.001,1,piSource),.0052016985);
near('B52 density form vt',terminal(1000,.0001,.10),.0002177777778);
near('B53 threefold radius ratio',3**2,9);
near('B54 triple viscosity ratio',1/3,.3333333333);
near('B55 speed graph ratio',50/8,6.25);
near('B56 Assignment6.2 formal vt',terminal(1000,.0003,1.8e-5),10.8888888889);
// Part C 8 supplementary practices (two outputs for Practice 1)
near('C Practice1 original drag',drag(.80,.001,.10),.00150796447);
near('C Practice1 doubled speed',drag(.80,.001,.20),.00301592895);
near('C Practice2 viscosity inversion',3e-6/drag(1,.0005,.020),.0159154943);
near('C Practice3 buoyancy-corrected slow settlement',terminalWithBuoyancy(1200,1000,50e-6,.10),.00001088888889);
near('C Practice4 inverse radius',Math.sqrt(9*.50*.004/(2*2500*g)),.0006060915267);
near('C Practice5 triple radius',3**2,9);
near('C Practice6 mPa to Pa',1.41e3*1e-3,1.41);
near('C Practice7 terminal drag effective weight',(1200-1000)*(4/3)*pi*(.0005**3)*g,1.026253600e-6);
near('C Practice8 diagnostic Reynolds (SUPPLEMENTARY air density)',2*1.2*10.89*.0003/(1.8e-5),435.6);
// Part D Q18–32 authored extras, no claim of original NBF numbered exercises
near('D18 water mPa to Pa',1.0016e-3,.0010016);
near('D19 glycerin mPa to Pa',1410e-3,1.410);
near('D20 drag',drag(.12,.0005,.080),9.04778684e-5);
near('D23 fourfold speed, half radius',(.5)*4,2);
near('D24 inversion for speed',1.885e-3/drag(.5,.002,1),.1000023559);
near('D25 inversion for eta',9.425e-4/drag(1,.001,.050),1.000023559);
near('D26 simplified terminal speed',terminal(2500,.0001,1),5.444444444e-5);
near('D30 buoyancy-corrected terminal speed',terminalWithBuoyancy(2500,1000,.0005,1),.0008166666667);
near('D31 graph acceleration (downward positive)',(8-50)/5,-8.4);
near('D32 kinetic energy ratio same mass',(50/8)**2,39.0625);
// Scientific-plausibility tests. These numbers use a new SUPPLEMENTARY air density.
const reExample=2*1.2*2*.002/(1.9e-5);
const reAssignment=2*1.2*terminal(1000,.0003,1.8e-5)*.0003/(1.8e-5);
assert.ok(reExample>500,'Example6.2 typical-air Reynolds estimate should fail creeping-flow condition');
assert.ok(reAssignment>400,'Assignment6.2 terminal speed is not a self-consistent low-Re physical prediction');
assert.ok(reExample>1&&reAssignment>1,'Do not release Stokes results as real rain/parachute predictions');
// Release boundary invariant: no change to existing public bank counts
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../question-bank/manifest.json'),'utf8'));
const units=manifest.grades.find(x=>x.grade===11).units;
const unit6=units.find(x=>x.unit===6);
assert.equal(unit6.liveMcqCount,560);
assert.equal(unit6.sourceFigureHeldCount,0);
assert.equal(unit6.standaloneSituationQuestionCount,136);
assert.equal(units.reduce((sum,x)=>sum+x.liveMcqCount,0),2250);
console.log('PASS V94-C2.2: '+count+' formula/numerical checks; typical-air Reynolds tests show both NBF formal Stokes examples are beyond creeping flow. Public 560/2250 count unchanged.');
