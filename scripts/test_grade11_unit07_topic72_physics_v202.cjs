#!/usr/bin/env node
'use strict';
/* V202 pure SI stress/strain/modulus + Fig7.12 structural test.
 * These are deterministic physics computations, not scored MCQ keys.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const near=(actual,expected)=>A.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<1e-10*Math.max(1,Math.abs(expected)),actual+' != '+expected);
function stress(forceN,areaM2){A.ok(forceN>=0&&areaM2>0);return forceN/areaM2;}
function strain(extensionM,lengthM){A.ok(lengthM>0);return extensionM/lengthM;}
function young(stressPa,strainVal){A.ok(strainVal>0);return stressPa/strainVal;}
function shear(deltaX,depth){A.ok(depth>0);return deltaX/depth;}
// Source-consistent numeric and dimensional check without original option letters.
near(2e6*3e-4,600);
near(stress(100,5e-4),2e5); // 5 cm^2 = 5e-4 m^2
near(stress(100,5e-4*2),1e5);
near(strain(0.8e-3,2),4e-4);
near(young(1e7,5e-4),2e10);
near(strain(1.4e7,7e10),2e-4); // aluminium p119 modulus
near(shear(1.8e-6,.005),3.6e-4);
near(Math.atan(0.01),.009999666686665238);
A.ok(Math.abs(Math.tan(0.01)-.01)<1e-6);
near(strain(0.8e-3,4),2e-4); // strain halves if original length doubles
near(stress(200,5e-4),4e5); // stress doubles if force doubles
// Source Fig7.12 p120/p121: A is proportional limit; B later elastic limit.
// Q30 and Q79 are about the SAME AB portion, never infer AB is plastic.
const curve={
 pointA:'PROPORTIONAL_LIMIT',
 regionAB:'NONLINEAR_BUT_ELASTIC',
 pointB:'ELASTIC_LIMIT',
 afterB:'POSSIBLE_PLASTIC_DEFORMATION'
};
A.equal(curve.regionAB,'NONLINEAR_BUT_ELASTIC');
A.notEqual(curve.regionAB,'PLASTIC_REGION');
A.equal(curve.pointB,'ELASTIC_LIMIT');
const doc=load('quality/unit07/unit07-v202-topic72-next12-stress-strain-slo-no-keys.json');
A.deepEqual(doc.selectedNumbers,[6,12,27,30,32,35,42,43,44,48,59,79]);
A.deepEqual(doc.promisingDirectCandidateNumbers,[6,32,35,42,43,44,48,59]);
A.deepEqual(doc.borderlineFigureOrDuplicateNumbers,[30,79]);
A.deepEqual(doc.supportingOrSloScopeSensitiveNumbers,[12,27]);
A.equal(doc.sourceCautions.q30Q79SameABNonlinearElasticRegionOverlap,true);
A.equal(doc.sourceCautions.bookP121ProportionalLimitAElasticLimitBExplanationVerified,true);
A.equal(doc.originalAnswerLetterErrorsFound,0);
A.equal(doc.scoredUnit7StudentQuestions,0);
A.equal(doc.realAuthenticatedTeacherScienceApprovals,0);
for(const x of doc.items){A.equal(x.realTeacherScienceDecision,'PENDING');A.equal(x.studentScoredRelease,'HOLD');}
const u7=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
console.log('V202 MATH PASS: stress/strain/Young units, shear approximation and elastic A–B distinction; 0 scored MCQs.');
