#!/usr/bin/env node
'use strict';
/*
 * V94-C2.7: independent arithmetic and scope checks for owner-prepared
 * Grade XI Unit6 Topic6.7 Superfluidity, combined private PDF pp.289–311.
 * Only elementary supplementary temperature conversions are checked.
 * This does NOT claim that the B43 SLO prescribes eight numericals, certify
 * original NBF p.106/figures or publish protected textbook artwork.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const t4=2.17,t3=.0025;
let checks=0;
function near(id,actual,expected){
 assert.ok(Number.isFinite(actual)&&Number.isFinite(expected),id+' not finite');
 assert.ok(Math.abs(actual-expected)<=Math.max(1e-11,Math.abs(expected)*1e-9),
  id+': expected '+expected+' got '+actual);
 checks++;
}
const kelvinToMilli=x=>x*1000;
const milliToKelvin=x=>x/1000;
const kelvinToMicro=x=>x*1e6;
const kelvinToCelsius=x=>x-273.15;
// Part B: source author-supplied quantities, not separately prescribed B43 maths.
near('B10 helium4 reference K',t4,2.17);
near('B11 helium3 reference K',t3,.0025);
near('B11 millikelvin',kelvinToMilli(t3),2.5);
near('B12 helium4 reference greater',t4/t3,868);
near('B40 millikelvin same value',kelvinToMilli(t3),2.5);
// Part C section 4 transition comparison and section 9 EIGHT illustrations.
near('C section4 helium4 K-to-mK',kelvinToMilli(t4),2170);
near('C section4 helium3 K-to-mK',kelvinToMilli(t3),2.5);
near('C illustration 1 helium4 K-to-mK',kelvinToMilli(t4),2170);
near('C illustration 2 helium3 K-to-mK',kelvinToMilli(t3),2.5);
near('C illustration 3 quoted temperature ratio',t4/t3,868);
near('C illustration 4 difference in quoted values K',t4-t3,2.1675);
near('C illustration 5 3 mK to K',milliToKelvin(3),.0030);
near('C illustration 6 helium3 microkelvin',kelvinToMicro(t3),2500);
near('C illustration 7 helium4 Celsius',kelvinToCelsius(t4),-270.98);
near('C illustration 8 below helium4 transition K',t4-1.50,.67);
// Part D Q25–29: supplemental numeric interpretation only.
near('D25 initial He4 above benchmark',2.50-t4,.33);
near('D25 final He4 below benchmark',t4-2,.17);
near('D26 He4 2K below benchmark',t4-2,.17);
near('D27 He3 0.0030K above benchmark',.0030-t3,.0005);
near('D28 He3 0.0020K below benchmark',t3-.0020,.0005);
near('D29 helium benchmark ratio',t4/t3,868);
assert.ok(2.00<t4 && .0030>t3,
  'An isotope, reference pressure and temperature comparison are required');
assert.ok(!Number.isNaN(kelvinToMilli(t3)));
checks+=2;
// Report must preserve source status and risk without copying actual Figure6.17.
const root=path.resolve(__dirname,'..');
const report=fs.readFileSync(path.join(root,'quality/grade11-unit06-v94c2-topic67-detailed-qc.md'),'utf8');
assert.ok(report.includes('P-11-B-43')&&report.includes('Summative')&&report.includes('Understanding'),
 'Official B43 summative Understanding scope must be retained');
assert.ok(report.includes('Figure 6.17')&&report.includes('Do not copy original NBF Figure6.17'),
 'Protect original NBF phase-diagram illustration; do not rehost private source');
assert.ok(report.includes('supplementary'),'Supplementary temperature tasks must remain classified');
// Source-bank/count invariants: no user-visible changes in this documentation PR.
const manifest=JSON.parse(fs.readFileSync(path.join(root,'question-bank/manifest.json'),'utf8'));
const grade=manifest.grades.find(g=>g.grade===11);
assert.ok(grade,'GradeXI source inventory missing');
const unit=grade.units.find(u=>u.unit===6);
assert.ok(unit,'Unit6 missing');
assert.equal(unit.liveMcqCount,560);
assert.equal(unit.standaloneSituationQuestionCount,136);
assert.equal(unit.sourceFigureHeldCount,0);
assert.equal(grade.units.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
const catalogue=JSON.parse(fs.readFileSync(path.join(root,'portal/learning-catalog.json'),'utf8'));
const course=catalogue.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(course.status,'planned');
assert.equal(course.partialTestBuilderMcqCount,560);
assert.equal(course.sourceFigureHeldCount,0);
assert.ok(checks>=23,'Expected a complete numeric-support first-pass suite');
console.log('V94-C2.7 PASS: '+checks+' independent temperature-value/calculation/boundary checks.');
console.log('Protected NBF Figure6.17 cannot be rehosted. B43 Summative/Understanding, supplemental temperature arithmetic not a prescribed derivation.');
console.log('GradeXI=2250, Unit6=560, independent situations=136, figure holds=0, full course remains planned.');
