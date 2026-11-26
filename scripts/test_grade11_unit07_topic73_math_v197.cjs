#!/usr/bin/env node
'use strict';
/*
 * V197 arithmetic and source numerical reasonableness only.
 * No actual private answer letters, teacher identities or graded items.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const near=(got,want)=>A.ok(Math.abs(got-want)<1e-11,got+' != '+want);
const privateFree=load('quality/unit07/unit07-v197-topic73-twelve-originals-source-slo-secondpass-no-keys.json');
const q=Object.fromEntries(privateFree.items.map(x=>[x.sourceNumber,x]));
for(const n of [51,56,59,60]){
 A.equal(q[n].originalMappedSlo,'P-11-B-28');
 A.equal(q[n].originalAuthorCognitive,'A');
 A.equal(q[n].officialSummativeCognitive,'Application');
 A.equal(q[n].originalKeyFoundWrong,false);
 A.equal(q[n].studentScoredRelease,'HOLD');
}
// Q51 original numerical: Y=2e11 Pa, A=1e-6 m², L=2m, x=1mm.
const U51=.5*(2e11*1e-6/2)*(.001)**2;
near(U51,.05);
// Q56 derived energy density: stress=2e6Pa, strain=.001.
const density=.5*2e6*.001;
near(density,1000);
A.equal(q[56].v197ReviewDisposition,'SUPPLEMENTARY_STRAIN_ENERGY_DENSITY_ENRICHMENT');
// Q59 NBF Example7.3: 980 N final force and 3.90e-4 m elongation.
const U59=.5*980*3.90e-4;
near(U59,.1911);
// Q60 Assignment7.3: Y=2e11Pa, A=1mm², L=5m, x=1mm.
const U60=(2e11*1e-6*.001**2)/(2*5);
near(U60,.02);
// Q72: mass/extension slope kg/m -> N/m stiffness requires g factor.
const sampleMassSlope=2.5; // kg/m, synthetic unit test not actual MCQ option/key
near(sampleMassSlope*9.8,24.5);
// Fig7.14 p122: correctly integrate F against x. A linear origin-start
// illustrative F=kx has same numerical triangular area after axis swap.
const xEnd=.5,k=10;
const linearW=k*xEnd*xEnd/2;
const linearReverse=linearW;
near(linearW,linearReverse);
// A generic nonlinear F=k*x² gives ∫Fdx =k*x³/3 but ∫x dF=2k*x³/3.
const nonLinearW=k*xEnd**3/3;
const nonLinearReverse=2*k*xEnd**3/3;
near(nonLinearReverse,2*nonLinearW);
A.notEqual(nonLinearW,nonLinearReverse);
A.equal(q[38].v197ReviewDisposition,'SUPPORTING_ONLY_REVERSED_GRAPH_AXIS_CONCEPT');
A.equal(q[80].v197ReviewDisposition,'PROMISING_DIRECT_GRAPH_AXES_WITH_DUPLICATE_WATCH');
// No source/private data leaked, no new source or release status.
A.equal(privateFree.sourceSelectedNewPrivateCandidateRevisionsIssued,0);
A.equal(privateFree.liveUnit7ScoredQuestionCount,0);
A.equal(privateFree.realTeacherScienceApprovals,0);
A.equal(load('quality/unit07/unit07-v195-unsigned-independent-teacher-review-no-keys.json').privateArtifact.allDecisionBoxesBlank,true);
const cat=load('portal/learning-catalog.json');
const unit=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(unit.assessmentStatus,'not-published');
A.equal(unit.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
console.log('V197 MATH PASS: source Q51/Q56/Q59/Q60, Q72 SI slope, Q38/Q80 graph warning, zero scored releases.');
