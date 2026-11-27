#!/usr/bin/env node
'use strict';
/* V198: independent physics sanity/scaling checks using SYNTHETIC inputs.
 * Not a keyed original-item renderer, grading library, or teacher approval.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const close=(a,b)=>A.ok(Math.abs(a-b)<=1e-10*Math.max(1,Math.abs(b)),a+' != '+b);
function stress(forceN,areaM2){
 A.ok(Number.isFinite(forceN)&&forceN>=0&&areaM2>0&&Number.isFinite(areaM2));
 return forceN/areaM2;
}
function strain(extensionM,originalLengthM){
 A.ok(Number.isFinite(extensionM)&&Number.isFinite(originalLengthM)&&originalLengthM>0);
 return extensionM/originalLengthM;
}
function extension(forceN,lengthM,areaM2,youngPa){
 A.ok(forceN>=0&&lengthM>0&&areaM2>0&&youngPa>0);
 return forceN*lengthM/(areaM2*youngPa);
}
function youngFromSlope(stressPa,strainUnitless){
 A.ok(Number.isFinite(stressPa)&&strainUnitless>0);
 return stressPa/strainUnitless;
}
// Self-generated synthetic cases, not original owner MCQ keyed answers:
const F=90,A1=.003;
close(stress(F,A1),30000);
close(stress(F,A1*3),10000);
close(stress(F*2,A1),60000);
const dx=.004,L=2;
close(strain(dx,L),.002);
close(strain(dx,L*2),.001);
const young=2e11,force=240,area=3e-6,length=1.5;
const ext=extension(force,length,area,young);
close(ext,.0006);
close(extension(force,length/2,area,young),ext/2);
close(extension(force,length,2*area,young),ext/2);
close(extension(force,length,area,young*2),ext/2);
// At equal stress a higher Young modulus yields lower elastic strain.
const s=4e7;
close(s/2e11,2e-4);
close(s/4e11,1e-4);
// STRESS VERTICAL versus STRAIN HORIZONTAL: slope equals Y.
close(youngFromSlope(6e7,3e-4),2e11);
// Reversing axes would yield 1/Y rather than Y; explicit axis needed.
close((3e-4)/(6e7),5e-12);
A.notEqual(youngFromSlope(6e7,3e-4),(3e-4)/(6e7));
// Straight initial stress-strain graph through origin is Hooke proportionality.
const graphPoint1=[2e-4,4e7],graphPoint2=[4e-4,8e7];
close(graphPoint1[1]/graphPoint1[0],graphPoint2[1]/graphPoint2[0]);
const d=load('quality/unit07/unit07-v198-topic72-twelve-unreviewed-source-slo-no-keys.json');
A.equal(d.sourceAnswerLetterErrorsDetected,0);
A.deepEqual(d.promisingDirectCandidateNumbers,[22,24,28,41,68]);
A.deepEqual(d.borderlineActualCognitiveNumbers,[21,23]);
A.equal(d.sourceLimitations.originalFig712ReferencedBy28,true);
A.equal(d.sourceLimitations.question68GraphAxesShouldBeExplicit,true);
A.equal(d.scoredUnit7StudentQuestions,0);
A.equal(d.authenticatedScienceApprovals,0);
A.equal(d.noLiveStudentBankChanges,true);
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(u7.assessmentStatus,'not-published');
A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
console.log('V198 MATH PASS: synthetic stress/strain/modulus scaling, qualitative limits and axes; zero original keyed options or scored releases.');
