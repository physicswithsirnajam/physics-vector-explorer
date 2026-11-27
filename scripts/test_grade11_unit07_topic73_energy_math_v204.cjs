#!/usr/bin/env node
'use strict';
/* V204 SI math regression with SYNTHETIC test values.
 * No owner original MCQ keys, student scoring or human teacher approval. */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const near=(a,b)=>A.ok(Number.isFinite(a)&&Math.abs(a-b)<=1e-10*Math.max(1,Math.abs(b)),a+' != '+b);
const UfromFinal=(F,x)=>.5*F*x;
const UfromStiffness=(k,x)=>.5*k*x*x;
const UfromYoung=(Y,area,L,x)=>{A.ok(Y>0&&area>0&&L>0);return Y*area*x*x/(2*L);};
const xfromFandK=(F,k)=>{A.ok(k>0);return F/k;};
// Hookean proportionality U scales as x squared for fixed positive stiffness.
const k=240,x=.05;
near(UfromStiffness(k,2*x),4*UfromStiffness(k,x));
near(UfromStiffness(k,2*x)-UfromStiffness(k,x),3*UfromStiffness(k,x));
near(UfromFinal(k*x,x),UfromStiffness(k,x));
// A dimensional example, not private answer key.
near(UfromStiffness(200,.10),1);
near(xfromFandK(20,1000),.020);
// Source-style multistep Y, A, L and x in SI, not private letter/answer data.
near(UfromYoung(2e11,2e-6,4,2e-3),.2);
near(UfromYoung(2e11,2e-6,4,4e-3),.8);
near(UfromYoung(2e11,4e-6,4,2e-3),.4);
near(UfromYoung(2e11,2e-6,8,2e-3),.1);
// Distinct final force, linearly increased from origin: larger x stores more work.
const UA=UfromFinal(50,.002),UB=UfromFinal(50,.004);
near(UA,.05);near(UB,.10);near(UB/UA,2);
// The general work is integral F dx; reversed axis undercurve ∫x dF differs
// for non-linear law. Hookean linear-origin triangles happen to agree.
const coeff=9,end=.2;
const linearWork=coeff*end**2/2;
const linearReversedArea=linearWork;
near(linearWork,linearReversedArea);
const nonlinearWork=coeff*end**3/3;
const nonlinearReversedArea=2*coeff*end**3/3;
near(nonlinearReversedArea,2*nonlinearWork);
A.notEqual(nonlinearWork,nonlinearReversedArea);
// B25 gauge length required to evaluate strain.
const delta=.0008,L=1.5;
near(delta/L,.0005333333333333334);
near(delta/(2*L),delta/L/2);
const d=load('quality/unit07/unit07-v204-topic73-twelve-original-work-energy-slo-hold-no-keys.json');
A.deepEqual(d.selectedOriginalNumbers,[9,20,22,26,28,30,33,43,48,53,63,74]);
A.deepEqual(d.promisingDirectOriginalNumbers,[22,30,43,53,63,74]);
A.equal(d.sourceSpecificQualifications.nonlinearReversedAxisAreaNotGeneralWork,true);
A.equal(d.sourceSpecificQualifications.q53MillimetresConvertedBeforeSquare,true);
A.equal(d.originalAnswerLetterErrorsDetected,0);
A.equal(d.authenticatedTeacherScienceApprovals,0);
A.equal(d.ownerStudentScoringApprovals,0);
A.equal(d.scoredUnit7StudentQuestions,0);
for(const item of d.items){A.equal(item.authenticatedTeacherScience,'PENDING');A.equal(item.studentScoredRelease,'HOLD');}
const u7=load('portal/learning-catalog.json').grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
console.log('V204 MATH PASS: SI energy, x-squared scaling, extra-v-total 3U, work-axis nonlinearity, gauge strain and scored HOLD.');
