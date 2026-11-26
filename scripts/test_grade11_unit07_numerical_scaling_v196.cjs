#!/usr/bin/env node
'use strict';
/**
 * V196: verify SOURCE-BASED mathematics and dimensional/scaling relationships
 * without trusting the publisher's inconsistent answer hints. No live grading,
 * private MCQ keys, Firebase connection or human review is implemented.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const P=require('./unit07_numerical_scaling_v196.cjs');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const close=(got,expected,rel=1e-9)=>{
 A.ok(Number.isFinite(got)&&Math.abs(got-expected)<=rel*Math.max(1e-15,Math.abs(expected)),
  'physics calculation mismatch '+got+' expected '+expected);
};
const g=9.8;
const nail={shearModulusPa:8e10,diameterM:.0015,displacementM:1.8e-6,
 shearDepthM:.005,gravityMS2:g};
const nailRes=P.uniformShearProxyMass(nail);
close(nailRes.apparentMassKg,5.19324499879129);
close(nailRes.shearStrain,3.6e-4);
A.equal(nailRes.model,'IDEALIZED_UNIFORM_SHEAR_NOT_CANTILEVER');
close(P.uniformShearProxyMass({...nail,shearModulusPa:nail.shearModulusPa*2}).apparentMassKg,
 nailRes.apparentMassKg*2);
close(P.uniformShearProxyMass({...nail,diameterM:nail.diameterM*2}).apparentMassKg,
 nailRes.apparentMassKg*4);
close(P.uniformShearProxyMass({...nail,displacementM:nail.displacementM*2}).apparentMassKg,
 nailRes.apparentMassKg*2);
close(P.uniformShearProxyMass({...nail,shearDepthM:nail.shearDepthM*2}).apparentMassKg,
 nailRes.apparentMassKg/2);
// A Young-modulus number cannot be silently passed under an ambiguous Y key.
let denied=0;
const fail=fn=>{A.throws(fn,/V196_DENIED/);denied++;};
fail(()=>P.uniformShearProxyMass({...nail,youngModulusPa:20e10}));
fail(()=>P.uniformShearProxyMass({youngModulusPa:20e10,diameterM:.0015,
 displacementM:1.8e-6,shearDepthM:.005,gravityMS2:g}));
fail(()=>P.uniformShearProxyMass({...nail,diameterM:0}));
fail(()=>P.uniformShearProxyMass({...nail,shearDepthM:-1}));
fail(()=>P.uniformShearProxyMass({...nail,shearModulusPa:NaN}));
fail(()=>P.uniformShearProxyMass({...nail,displacementM:Infinity}));
const same={firstDiameterM:.003,firstYoungPa:7e10,secondYoungPa:12e10};
const copper=P.diameterForEqualExtension(same);
close(copper,.00229128784747792);
close(P.diameterForEqualExtension({...same,secondYoungPa:same.secondYoungPa*4}),copper/2);
close(P.diameterForEqualExtension({...same,firstYoungPa:same.firstYoungPa*4}),copper*2);
fail(()=>P.diameterForEqualExtension({...same,firstDiameterMM:3}));
fail(()=>P.diameterForEqualExtension({...same,secondYoungPa:0}));
const wires={upperMassKg:4,lowerMassKg:6,upperLengthM:1.5,lowerLengthM:1,
 upperYoungPa:20e10,lowerYoungPa:1e10,commonDiameterM:.0025,gravityMS2:g};
const wr=P.serialWireStretchAndEnergy(wires);
close(wr.upperForceN,98);close(wr.lowerForceN,58.8);
close(wr.totalExtensionM,.0013475967341476964);
close(wr.totalEnergyJ,.042554110204975036);
close(wr.totalEnergyJ,wr.upperEnergyJ+wr.lowerEnergyJ);
close(wr.totalExtensionM,wr.upperExtensionM+wr.lowerExtensionM);
const brassModTen=P.serialWireStretchAndEnergy({...wires,lowerYoungPa:wires.lowerYoungPa*10});
close(brassModTen.lowerExtensionM,wr.lowerExtensionM/10);
close(brassModTen.upperExtensionM,wr.upperExtensionM);
close(brassModTen.totalExtensionM,.0002695193468295393);
close(brassModTen.totalEnergyJ,.010858635017821215);
const upperMassPlus=P.serialWireStretchAndEnergy({...wires,upperMassKg:wires.upperMassKg+3});
close(upperMassPlus.lowerForceN,wr.lowerForceN);
close(upperMassPlus.lowerExtensionM,wr.lowerExtensionM);
close(upperMassPlus.upperForceN,wr.upperForceN+3*g);
const diameterDouble=P.serialWireStretchAndEnergy({...wires,commonDiameterM:2*wires.commonDiameterM});
close(diameterDouble.totalExtensionM,wr.totalExtensionM/4);
close(diameterDouble.totalEnergyJ,wr.totalEnergyJ/4);
fail(()=>P.serialWireStretchAndEnergy({...wires,upperForceN:98}));
fail(()=>P.serialWireStretchAndEnergy({...wires,lowerMassKg:0}));
fail(()=>P.serialWireStretchAndEnergy({...wires,commonDiameterM:.0}));
fail(()=>P.serialWireStretchAndEnergy({...wires,upperYoungPa:-1}));
const rod={crossSectionM2:90e-6,lengthM:3,stressPa:300e6,youngPa:200e9};
const energy=P.strainEnergyFromStress(rod);
close(energy,60.75);
close(P.strainEnergyFromStress({...rod,crossSectionM2:rod.crossSectionM2*2}),energy*2);
close(P.strainEnergyFromStress({...rod,lengthM:rod.lengthM*2}),energy*2);
close(P.strainEnergyFromStress({...rod,stressPa:rod.stressPa*2}),energy*4);
close(P.strainEnergyFromStress({...rod,youngPa:rod.youngPa*2}),energy/2);
fail(()=>P.strainEnergyFromStress({...rod,crossSectionMm2:90}));
fail(()=>P.strainEnergyFromStress({...rod,stressPa:'300 MPa'}));
fail(()=>P.strainEnergyFromStress({...rod,youngPa:0}));
const rod50={forceN:500,diameterM:.50},stress=P.tensileStress(rod50);
close(stress,2546.4790894703256);
close(P.tensileStress({forceN:500,diameterM:.05}),stress*100);
close(P.tensileStress({...rod50,forceN:1000}),stress*2);
close(P.tensileStress({...rod50,diameterM:1}),stress/4);
fail(()=>P.tensileStress({forceN:500,diameterCm:50}));
fail(()=>P.tensileStress({...rod50,diameterM:0}));
fail(()=>P.tensileStress({...rod50,forceN:-500}));
// A source-grounded counterexample shows the "area under reversed graph"
// is NOT work in general, although the linear origin-start triangle agrees.
const linear=P.forceExtensionPowerLawAreas({coefficientSI:4,extensionM:3,power:1});
close(linear.workJ,18);
close(linear.reversedAxesNumericalArea,18);
A.equal(linear.identicalOnlyForLinearOriginCase,true);
const quadratic=P.forceExtensionPowerLawAreas({coefficientSI:2,extensionM:3,power:2});
close(quadratic.workJ,18);
close(quadratic.reversedAxesNumericalArea,36);
A.equal(quadratic.identicalOnlyForLinearOriginCase,false);
A.equal(quadratic.forceVerticalExtensionHorizontalIsWorkGraph,true);
fail(()=>P.forceExtensionPowerLawAreas({coefficientSI:2,extensionM:3,power:0}));
fail(()=>P.forceExtensionPowerLawAreas({coefficientSI:2,extensionM:3,power:2,studentScore:true}));
fail(()=>P.forceExtensionPowerLawAreas({coefficientSI:2,extensionM:-3,power:2}));
const contract=load('quality/unit07/unit07-v196-numerical-scaling-regression-hold.json');
A.equal(contract.schemaVersion,1);A.equal(contract.version,'V196');
A.equal(contract.prerequisite.prNumber,299);
A.equal(contract.prerequisite.mergeSha,'aed5f150a5dc5287e1da18769cebbbffdd200339');
A.equal(contract.status,'SOURCE_BASED_SCALING_AND_GRAPH_INVARIANT_TESTS_ONLY_NO_TEACHER_SIGNOFF_NO_SCORE');
A.equal(contract.sourceUniverseCount,274);
A.equal(contract.privateCandidateReviewQueueCount,72);
A.equal(contract.originalPrintedProblemsChecked,5);
A.deepEqual(contract.compulsoryTeacherDecisionsOutstanding,[1,3,4,5]);
A.deepEqual(contract.consistentTextbookHints,[2]);
A.equal(contract.originalNbfSourceScanRepublished,false);
A.equal(contract.conditionalShearProxyIsTrueNailBendingModel,false);
A.equal(contract.reversedAxesGraphIsGeneralWorkArea,false);
A.equal(contract.linearOriginHookeanGraphIsValidTriangleException,true);
A.equal(contract.realTeacherScienceApprovals,0);
A.equal(contract.realTeacherCognitiveApprovals,0);
A.equal(contract.realOwnerScoringApprovals,0);
A.equal(contract.unit7StudentScoredReleases,0);
A.equal(contract.noFirebaseOrStagingOrProductionChanges,true);
A.equal(contract.noLiveQuestionBankChanges,true);
A.equal(contract.noRealPrivateCandidateKeysInThisPR,true);
A.equal(contract.noAuthenticationOrGradingCapabilityInHelper,true);
const pending=load('quality/unit07/unit07-v195-unsigned-independent-teacher-review-no-keys.json');
A.equal(pending.version,'V195');
A.equal(pending.privateArtifact.realTeacherSigned,false);
A.equal(pending.privateArtifact.allDecisionBoxesBlank,true);
for(const x of pending.numericalReview){A.equal(x.teacherDecision,'PENDING');A.equal(x.scoredStatus,'HOLD');}
A.equal(pending.graphReview.teacherDecision,'PENDING');
A.equal(pending.unit7StudentScoredQuestions,0);
const old=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
A.equal(old.version,'V193');
A.deepEqual(old.originalNumericalReview.questions.map(x=>x.printedHintClass),
 ['conditional-only','consistent','inconsistent','inconsistent','inconsistent']);
const q=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
A.equal(q.candidateRegistry.length,72);
for(const x of q.candidateRegistry){
 A.equal(x.candidateIndividualRevisionSha256,null);
 A.equal(x.eligibleForStudentScoredUse,false);
 A.equal(x.scoredRelease,'HOLD');
}
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(u7.status,'planned');
A.equal(u7.questionBankCount,0);
A.equal(u7.assessmentStatus,'not-published');
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
const memo=read('quality/grade11-v196-unit07-numerical-invariants-teacher-hold.md').toLowerCase();
for(const word of ['v196','7.1','7.2','7.3','7.4','7.5','young','shear','unit',
 'diameter','stress','energy','graph','nonlinear','hookean','pending','hold','teacher',
 'app check','no-go','v197'])A.ok(memo.includes(word),'missing memo marker '+word);
const dir=path.join(ROOT,'qa-artifacts/grade11-v196-numerical-invariants');
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({
 version:'V196',sourceCases:5,graphCounterexampleVerified:true,
 mathAndUnitScalingAssertions:'PASS',negativeInputChecks:denied,
 sourceQuestionTextOrAnswerKeysImported:false,
 authenticTeacherApprovals:0,ownerScoringApprovals:0,
 unit7ScoredQuestions:0,originalTextbookEdited:false,
 firebaseOrStudentBankChanges:false
},null,2)+'\n');
console.log('V196 PASS: source math+SI scaling, quadratic reversed-axis counterexample; '+denied+
 ' malformed input cases denied; 0 real approvals and 0 scored Unit7 releases.');
