#!/usr/bin/env node
'use strict';
/* V205 independent SI mechanics checks with no original answer LETTERS.
 * No teacher authentication or live student scoring behavior.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const near=(a,b)=>A.ok(Number.isFinite(a)&&Math.abs(a-b)<1e-10*Math.max(1,Math.abs(b)),a+' != '+b);
function extension(F,L,Y,area){A.ok(F>=0&&L>0&&Y>0&&area>0);return F*L/(Y*area);}
function energy(k,x){A.ok(k>=0);return .5*k*x*x;}
function work(F,x){A.ok(F>=0&&x>=0);return .5*F*x;}
const mass=3.2,g=9.8;
near(mass*g,31.36);  // hanging weight mg under stationary loading
near(energy(500,.02),.1);
near(energy(500,.04),.4);
near(energy(500,.04)/energy(500,.02),4);
const x=extension(100,2,1e11,2e-6);
near(x,.001);near(x*1000,1);  // 1 mm
near(extension(100,4,1e11,2e-6),2*x); // double length -> double extension
near(extension(100,2,1e11,4e-6),x/2); // double area -> half extension
// Diameter doubling, if it occurred, quadruples area; distinct from area doubling.
const area=Math.PI*(.001)**2/4,areaDoubledDiameter=Math.PI*(.002)**2/4;
near(areaDoubledDiameter/area,4);
// Same source method work equals 1/2 F x for origin-start LINEAR loading.
near(work(30,.06),.9);
near(work(60,.06),1.8);
// On conventional force-vertical/extension-horizontal axes, integrate F dx.
// Original printed Fig 7.14 has reversed axes, which cannot generally
// be integrated as the same physical work for a nonlinear loading law.
const coeff=10,xEnd=.25;
const linearWork=coeff*xEnd*xEnd/2;
const linearReversedArea=linearWork;
near(linearWork,linearReversedArea);
const nonlinearWork=coeff*xEnd**3/3;
const nonlinearReverse=2*coeff*xEnd**3/3;
near(nonlinearReverse,2*nonlinearWork);
A.notEqual(nonlinearWork,nonlinearReverse);
// Required experimental reference length: delta L / L.
const initial=1.2,after=1.2006;
near((after-initial)/initial,.0005);
const d=load('quality/unit07/unit07-v205-topic73-original12-experiment-source-slo-hold-no-keys.json');
A.deepEqual(d.originalSourceNumbers,[5,11,13,17,36,44,54,61,62,66,69,77]);
A.deepEqual(d.promisingDirectApplicationNumbers,[44,77]);
A.deepEqual(d.experimentalCognitiveBorderlineNumbers,[69]);
A.deepEqual(d.crossSloExperimentNumbers,[54,61,62]);
A.deepEqual(d.supportingRecallOrConceptNumbers,[5,11,13,17,36,66]);
A.equal(d.sourceCautions.q62AreaNotDiameterDoubled,true);
A.equal(d.sourceCautions.nonlinearReversedGraphAreaNotPhysicalWork,true);
A.equal(d.incorrectOriginalAnswerLettersFound,0);
for(const q of d.items){
 A.equal(q.authenticatedTeacherScience,'PENDING');
 A.equal(q.authenticatedTeacherCognitive,'PENDING');
 A.equal(q.scoredStudentUse,'HOLD');
}
A.equal(d.authenticatedTeacherScienceApprovals,0);
A.equal(d.ownerScoredReleasePermissions,0);
A.equal(d.scoredUnit7StudentItems,0);
const u=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
A.equal(u.status,'planned');A.equal(u.assessmentStatus,'not-published');A.equal(u.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
console.log('V205 MATH PASS: SI strain energy, wire extension, experimental gauge length, area-v-diameter and graph-axis tests; scored HOLD.');
