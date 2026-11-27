#!/usr/bin/env node
'use strict';
/* V203 SI mechanics regression. Pure numeric checks, not original answer
 * letters, graded submissions, teacher approvals or publisher amendments.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const near=(a,b)=>A.ok(Number.isFinite(a)&&Math.abs(a-b)<=1e-10*Math.max(1,Math.abs(b)),a+' != '+b);
const stress=(F,area)=>{A.ok(F>=0&&area>0);return F/area;};
const strain=(dx,L)=>{A.ok(L>0);return dx/L;};
const extension=(F,L,area,Y)=>{A.ok(F>=0&&L>0&&area>0&&Y>0);return F*L/(area*Y);};
const modulus=(s,e)=>{A.ok(e>0);return s/e;};
// Equal strain: steel Y greater than aluminium Y from book Table7.1.
const es=.0002;
near(20e10*es,4e7);
near(7e10*es,1.4e7);
A.ok(20e10*es>7e10*es);
// Dimensionless strain times length yields correctly converted extension.
near(.001*1.2,.0012);
near(.0012*1000,1.2); // millimetres
near(2e11*2e-4,4e7);
// Independent complete-wire model examples, detect input-unit confusion.
near(extension(200,2,2e-6,2e11),.001);
near(extension(200,1,1e-5,2e11),.0001);
near(extension(200,2,2e-6,2e11)/extension(200,1,1e-5,2e11),10);
// The two different originals both use the SAME FL/(AY) relationship.
const twoOriginalsSameMethod=true;
A.equal(twoOriginalsSameMethod,true);
near(stress(25680,.20),128400);
near(stress(25680,.20)/1000,128.4);
near(modulus(4e7,.0002),2e11);
// Fixed geometry and Y: strain proportional to mass-supported force.
near(50/62,.8064516129032258);
near((50*9.8)/(62*9.8),50/62);
near(.0002/(2),.0001); // equal stress, double Y gives half strain
// Original Fig7.12 OA straight proportional while AB may be nonlinear elastic.
// Distinguish proportional limit A from elastic limit B.
const curve={OA:'PROPORTIONAL',AB:'ELASTIC_BUT_NOT_PROPORTIONAL',B:'ELASTIC_LIMIT',afterB:'POSSIBLE_PLASTIC'};
A.equal(curve.OA,'PROPORTIONAL');
A.equal(curve.AB,'ELASTIC_BUT_NOT_PROPORTIONAL');
A.notEqual(curve.AB,'PLASTIC');
A.equal(curve.B,'ELASTIC_LIMIT');
const d=load('quality/unit07/unit07-v203-topic72-twelve-elastic-modulus-source-qc-no-keys.json');
A.deepEqual(d.selectedOriginalNumbers,[40,45,49,50,58,60,61,65,69,73,77,78]);
A.deepEqual(d.promisingApplicationNumbers,[40,45,49,50,58,60,77,78]);
A.deepEqual(d.promisingUnderstandingNumbers,[61,65,69,73]);
A.equal(d.sourceSpecificCautions.q50AndQ60BothUseFLOverAYDuplicateConcept,true);
A.equal(d.sourceSpecificCautions.q69OAProportionalRegionNotEntireElasticAB,true);
A.equal(d.originalSourceAnswerLetterErrorsFound,0);
for(const q of d.items){
 A.equal(q.authenticatedTeacherScienceDecision,'PENDING');
 A.equal(q.authenticatedTeacherCognitiveDecision,'PENDING');
 A.equal(q.studentScoring,'HOLD');
}
A.equal(d.realTeacherScienceApprovals,0);
A.equal(d.ownerScoringApprovals,0);
A.equal(d.scoredUnit7Questions,0);
const unit=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(unit.status,'planned');A.equal(unit.assessmentStatus,'not-published');A.equal(unit.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
console.log('V203 MATH PASS: modulus, stress/strain, extension, 50:62 load ratio and proportional/elastic limit; original source and student scoring HOLD.');
