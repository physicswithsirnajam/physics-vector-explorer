#!/usr/bin/env node
'use strict';
/* V201 synthetic SI physics regression. Does not contain original MCQ
 * stems/choices, keyed letters, teacher identity, scoring or backend logic. */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const close=(got,want)=>A.ok(Math.abs(got-want)<1e-10*Math.max(1,Math.abs(want)),got+' != '+want);
const energyFromLinearFinal=(F,x)=>.5*F*x;
const energyFromStiffness=(k,x)=>.5*k*x*x;
const energyFromYoung=(Y,A,L,x)=>(Y*A*x*x)/(2*L);
const extension=(F,L,A,Y)=>(F*L)/(A*Y);
// Derivation and law: ideal linear loading from zero starts at zero energy.
close(energyFromLinearFinal(36,.05),.9);
close(energyFromLinearFinal(72,.10),3.6);
close(energyFromLinearFinal(72,.10)/energyFromLinearFinal(36,.05),4);
// Stress/strain and geometry in a measured wire
const F=240,Y=2e11,area=2.5e-6,length=2;
const x=extension(F,length,area,Y);
close(x,.00096);
close(extension(F,length*2,area,Y),x*2);
const k=Y*area/length;
close(k,250000);
close(energyFromLinearFinal(F,x),energyFromStiffness(k,x));
close(energyFromYoung(Y,area,length,x),energyFromStiffness(k,x));
// Graph-axes rule: F-vertical, x-horizontal => W = ∫ F dx; slope = dF/dx = k.
// Source Fig7.14 force-horizontal extension-vertical gives reciprocal slope.
const dx=.004,dF=120;
close(dF/dx,30000);
close(dx/dF,1/30000);
A.notEqual(dF/dx,dx/dF);
// A nonlinearly increasing F=k*x^2 falsifies universal reversed area statement.
const X=.4,K=20;
const actualWork=K*X**3/3;
const reversedArea=2*K*X**3/3;
close(reversedArea,2*actualWork);
A.notEqual(actualWork,reversedArea);
// Area for a line from (x=0,F=0) to (x=0.05 m,F=30 N)
close(.5*.05*30,.75);
// Same extension: U directly proportional to stiffness
const Xa=.03;
close(energyFromStiffness(600,Xa),2*energyFromStiffness(300,Xa));
// Cross-check 12 metadata and no scoring, without original keyed choices.
const d=load('quality/unit07/unit07-v201-topic73-next12-energy-source-slo-no-keys.json');
A.deepEqual(d.selectedNumbers,[4,15,23,29,32,34,37,39,41,52,57,75]);
A.deepEqual(d.promisingDirectNumbers,[23,34,41,52,57,75]);
A.deepEqual(d.cognitiveOrSloBorderlineNumbers,[32,39]);
A.equal(d.sourceCautions.q34ForceExtensionGraphSlopeRequiresAxesAndWireGeometry,true);
A.equal(d.sourceCautions.q57SourceFig714ReversedAxesButQuestionOrderedPairsStandard,true);
for(const x of d.items){A.equal(x.studentScoredRelease,'HOLD');A.equal(x.independentHumanScienceDecision,'PENDING');}
A.equal(d.authenticatedTeacherScienceApprovals,0);
A.equal(d.ownerScoredReleaseApprovals,0);
A.equal(d.scoredUnit7StudentItems,0);
const u7=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');
A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
console.log('V201 MATH PASS: elastic-energy/Young geometry/scaling and reversed graph axes tested without private MCQ answers or student scoring.');
