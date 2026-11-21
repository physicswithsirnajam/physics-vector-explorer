#!/usr/bin/env node
'use strict';
// V94-C2.1 — independently recalculate 28 selected arithmetic outputs from
// private owner-prepared Unit6 Topic6.1 Part B/C/D. No protected source content
// is copied here; no claim of independent NBF text transcription or board tagging.
const assert = require('node:assert/strict');
const g=9.8, water=1000, sea=1025, iron=7800;
let checks=0;
function same(id,got,expected) {
  assert.ok(Number.isFinite(got)&&Number.isFinite(expected),id+' must be finite');
  const tol=Math.max(1e-9,Math.abs(expected)*1e-10);
  assert.ok(Math.abs(got-expected)<=tol,id+': '+got+' vs '+expected);
  checks++;
}
// Part B: source questions Q27–Q39 (Q38 has two outputs).
same('B-Q27 full immersed cube',water*g*(.10**3),9.8);
same('B-Q28 cube side 0.2m',water*g*(.20**3),78.4);
same('B-Q29 displaced .0025m3',water*g*.0025,24.5);
same('B-Q30 other fluid',800*g*.004,31.36);
same('B-Q31 volume from upthrust',49/(water*g),.005);
same('B-Q32 density from upthrust',39.2/(g*.004),1000);
same('B-Q33 cylinder area and height',water*g*.020*.50,98);
same('B-Q34 face-pressure difference',water*g*(.80-.30)*.020,98);
same('B-Q35 rectangular volume',water*g*.20*.10*.10,19.6);
same('B-Q36 3 litre floating body',water*g*.003,29.4);
same('B-Q37 immersed apparent weight',100-water*g*.006,41.2);
same('B-Q38a original assignment volume',200/(water*g),200/9800);
same('B-Q38b original assignment true weight',iron/water*200,1560);
same('B-Q39 floating displacement',98000/(water*g),10);
// Part C: seven source-derived supplementary quantities (12.3–12.9).
same('C-12.3 floating fraction',600/water,.60);
same('C-12.4 seawater displacement',2.05e6/sea,2000);
same('C-12.5 fresh minus seawater displacement',2.05e6/water-2.05e6/sea,50);
same('C-12.6 max additional cargo kg',sea*1000-6e5,425000);
same('C-12.7 submarine added ballast kg',sea*500-5e5,12500);
same('C-12.8 pressure-force difference',water*g*(.70-.50)*.015,29.4);
same('C-12.9 spring scale reading',50-water*g*.002,30.4);
// Part D: seven quantities from six TEACHER-ADDED numerical questions.
same('D-N01 fully immersed cube N',water*g*(.2**3),78.4);
same('D-N02 apparent weight N',5*g-water*g*.002,29.4);
same('D-N03 displaced water m3',2.4/water,.0024);
same('D-N04 apparent iron weight N',(iron-water)*g*5e-4,33.32);
same('D-N05 ship displacement m3',2050e3/sea,2000);
same('D-N05 upthrust N',2050e3*g,20090000);
same('D-N06 required displaced m3',900/water,.90);
assert.equal(checks,28,'Expected exactly 28 independent quantity checks');
console.log('V94-C2.1 PASS: 28 Topic6.1 Part B/C/D numerical outputs checked');
console.log('Review boundaries: fluid density, equilibrium, original NBF pp89–91 fidelity, and per-item SLO approval still required.');
