#!/usr/bin/env node
'use strict';
/*
 * V94-B3: independently calculated checks for 11 end-of-unit Fluid Mechanics
 * numerical exercise solutions; user's PRIVATE derivative master PDF pp.330–337.
 * These constants reproduce cited input numbers only, not protected source text.
 * NOT evidence of NBF textbook transcription fidelity or teacher sign-off.
 */
const assert = require('node:assert/strict');
const PI=Math.PI;
let passes=0;
function close(label,actual,expected,rel=2e-8) {
 assert.ok(Number.isFinite(actual) && Number.isFinite(expected),label+' nonfinite');
 assert.ok(Math.abs(actual-expected)<=rel*Math.max(Math.abs(expected),1e-15),label+' expected '+expected+' got '+actual);
 passes++;
}
const g=9.8;
// 6.1: density of droplet is not in the quoted question, so explicitly assume water.
close('6.1 radius metres',Math.sqrt(9*1.9e-5*2.98e-3/(2*1000*g)),5.098919453358401e-6);
// 6.2: diameter to area, cubic metres to litres.
close('6.2 Q litres per second',1000*PI*(0.016/2)**2*2,.4021238596594935);
close('6.2 nozzle centimetres',100*0.016*Math.sqrt(2/15),.5842373946721772);
// 6.3: litre/minute → cubic-metre/second; average aorta speed.
close('6.3 mean blood speed cm/s',100*(5e-3/60)/(PI*0.010**2),26.525823848649225);
// 6.4: area ratio is the SQUARE of diameter ratio.
close('6.4 nozzle diameter cm',4*Math.sqrt(2/4),2.8284271247461903);
// 6.5: same ideal effective head; ignore changing real pump discharge/viscous losses.
const radicand=5.4**2-2*g*1.3;
assert.ok(radicand>0,'6.5 real outflow speed under stated ideal assumptions');
close('6.5 speed m/s',Math.sqrt(radicand),1.9183326093250876);
// 6.6: cm² to m², horizontal ideal Bernoulli with no losses.
const v1=5e-3/(25e-4),v2=5e-3/(4e-4);
close('6.6 speed section 1',v1,2);
close('6.6 speed section 2',v2,12.5);
close('6.6 delta pressure Pa',.5*1000*(v2**2-v1**2),76125);
// 6.7: quote requests ABSOLUTE pressure; water density assumed.
close('6.7 absolute hose pressure Pa',1.01e5+.5*1000*(25.5**2-1.96**2),424204.2);
// 6.8: source's solution is symbolic: v=√(2gh). Check representative numerical and dimensions.
close('6.8 Torricelli representative h=1.25m (not a textbook numerical given)',Math.sqrt(2*g*1.25),Math.sqrt(24.5));
// 6.9: 4.12e5 Pa interpreted as GAUGE pressure difference, not necessarily absolute.
const densityGauge=2*4.12e5/33.8**2;
close('6.9 density SI with gauge pressure kg/m3',densityGauge,721.2632610902981);
close('6.9 convert SI to g/cm3',densityGauge/1000,.7212632610902981);
assert.ok(Math.abs(densityGauge-.72)>700,'0.72 kg/m3 cannot be the same as 721 kg/m3');
// If the question meant absolute upstream pressure to atmospheric outlet, answer changes.
close('6.9 conditional absolute upstream interpretation kg/m3',2*(4.12e5-1.01e5)/33.8**2,544.4487237841813);
// 6.10: idealized equal-total-pressure Bernoulli wing comparison.
close('6.10 simplified wing delta pressure Pa',.5*1.29*(30**2-20**2),322.5);
// 6.11: payload WEIGHT, not mass; maximum lift force minus H2 and balloon weights.
close('6.11 maximum payload force N',(1.3-.09)*g*10-80,38.58);
console.log('V94-B3 PASS: '+passes+' independent numerical/conditional checks for the 11 prepared Unit6 exercises.');
console.log('Source exactness / missing givens / real-flow assumptions still require teacher review; Q6.9 pressure and printed-unit ambiguity explicitly retained.');
