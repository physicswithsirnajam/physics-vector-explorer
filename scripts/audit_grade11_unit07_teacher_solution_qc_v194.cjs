#!/usr/bin/env node
'use strict';
/*
 * V194 PUBLIC ONLY. Do not import private Word/PDF into GitHub CI.
 * Mathematics recomputed directly from NBF printed source parameters.
 * Green checks = consistency of draft metadata, NOT teacher signoff.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const FILE='quality/unit07/unit07-v194-teacher-solution-draft-provenance-no-keys.json';
const MEMO='quality/grade11-v194-unit07-private-teacher-solutions-qc.md';
const SRC_SHA=['0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9',
 '08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892'];
const SHA=/^[a-f0-9]{64}$/;
const DENY_KEYS=['question','stem','options','correctOption','answerKey','privateWorkedSolution',
 'rawPdfText','sourceScanBytes','privateCandidateDigest','teacherEmail','teacherUid',
 'studentUid','studentEmail','authToken','signedReview'];
function noLeaks(o,tag){
 if(o===null||typeof o!=='object')return;
 for(const key of DENY_KEYS)A.equal(Object.hasOwn(o,key),false,'Private payload '+tag+'.'+key);
 for(const [key,v] of Object.entries(o))if(v&&typeof v==='object')noLeaks(v,tag+'.'+key);
}
function near(a,b,abs=1e-9){A.ok(Math.abs(a-b)<=abs,Math.abs(a-b)+' > '+abs);}
function independentArithmetic(){
 const pi=Math.PI,g=9.8;
 const shearArea=pi*(.0015/2)**2, gamma=1.8e-6/.005;
 const nailShear=8e10*shearArea*gamma/g, nailWithYoung=20e10*shearArea*gamma/g;
 const copper=3*Math.sqrt(7/12);
 const wireArea=pi*(.0025/2)**2;
 const steel=10*g*1.5/(20e10*wireArea);
 const brass=6*g*1/(1e10*wireArea);
 const brassHyp=6*g*1/(1e11*wireArea);
 const extension=steel+brass;
 const energy=.5*((10*g)*steel+(6*g)*brass);
 const hypotheticalExtension=steel+brassHyp;
 const hypotheticalEnergy=.5*((10*g)*steel+(6*g)*brassHyp);
 const rodEnergy=(90e-6*3*(300e6)**2)/(2*200e9);
 const stress50cm=500/(pi*(.50/2)**2);
 const stress5cm=500/(pi*(.05/2)**2);
 near(nailShear,5.19324499879129);near(nailWithYoung,12.983112496978225);
 near(copper,2.29128784747792);
 near(extension,.0013475967341476964);
 near(energy,.042554110204975036);
 near(hypotheticalExtension,.0002695193468295393);
 near(hypotheticalEnergy,.010858635017821215);
 near(rodEnergy,60.75);near(stress50cm,2546.4790894703256);
 near(stress5cm,254647.90894703253);
 return {nailShear,copper,extension,energy,rodEnergy,stress50cm};
}
function check(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V194');
 A.equal(d.prerequisite.prNumber,297);
 A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'5adb13dece9e9ce5e4a5cacc631397f6b10aafc1');
 A.equal(d.status,'SIX_PAGE_PRIVATE_TEACHER_SOLUTIONS_DRAFT_VISUALLY_QC_HUMAN_SIGNOFF_PENDING_NO_SCORES');
 A.deepEqual(d.sourcePdfNames,['Unit 7.pdf','unit 7 - Physics 11.pdf']);
 A.deepEqual(d.sourcePdfSha256,SRC_SHA);
 A.equal(d.sourcePdfPageCountPerCopy,15);
 A.deepEqual(d.sourcePrintedPagesUsed,[119,121,122,123,126]);
 const x=d.artifact;
 A.equal(x.privateDocx,'Unit7_V194_Teacher_Solutions_Source_Audit_DRAFT.docx');
 A.equal(x.docxSha256,'216b6418afd362a95ebdb3a385bf18f61fb9e091bc44820117c4e37547a1c477');
 A.equal(x.privatePdf,'Unit7_V194_Teacher_Solutions_Source_Audit_DRAFT.pdf');
 A.equal(x.pdfSha256,'6571c53dc33d20d4e9ff39ad15d30cc8e0a03eac1e4dc508b633f1d41bd1cb14');
 A.equal(x.renderedPages,6);A.equal(x.paperSize,'A4');
 A.equal(x.everyRenderedPageVisuallyInspected,true);
 A.equal(x.equationsTypesetAsFractionsSuperscriptsAndSubscripts,true);
 A.equal(x.originalPrintedHintsAndCalculatedResultsSeparatelyLabeled,true);
 A.equal(x.originalNbfPagesCopiedIntoRepository,false);
 A.equal(x.authorNameOrSourceImagesPublishedInRepository,false);
 A.equal(x.answerKeyOrFullWorkedSolutionPublishedInRepository,false);
 A.equal(x.independentTeacherFieldsPreFilled,false);
 A.equal(x.includesSourceSpecificGraphComparison,true);
 A.equal(d.problemDecisions.length,5);
 A.deepEqual(d.problemDecisions.map(i=>i.problem),['7.1','7.2','7.3','7.4','7.5']);
 A.deepEqual(d.problemDecisions.map(i=>i.disposition),
 ['COMPULSORY_REVIEW','NO_COMPULSORY_AMENDMENT','COMPULSORY_REVIEW','COMPULSORY_REVIEW','COMPULSORY_REVIEW']);
 A.deepEqual(d.problemDecisions.map(i=>i.printedHintStatus),
 ['conditional-only','consistent','inconsistent','inconsistent','inconsistent']);
 for(const row of d.problemDecisions){A.ok(row.cause.length>40);A.equal(row.scoring,'HOLD');}
 A.ok(d.problemDecisions[0].cause.includes('shear'));
 A.ok(d.problemDecisions[1].cause.includes('2.291'));
 A.ok(d.problemDecisions[2].cause.includes('42.55'));
 A.ok(d.problemDecisions[3].cause.includes('60.75'));
 A.ok(d.problemDecisions[4].cause.includes('50 cm'));
 const g=d.graphTeaching;
 A.equal(g.printedPage,122);A.equal(g.graphName,'Figure 7.14');
 A.equal(g.originalAxisHorizontal,'WEIGHT_OR_FORCE');A.equal(g.originalAxisVertical,'EXTENSION');
 A.equal(g.standardWorkAreaGraphHorizontal,'EXTENSION');A.equal(g.standardWorkAreaGraphVertical,'FORCE');
 A.equal(g.reversedAxesAreaEqualsWorkGenerally,false);
 A.equal(g.hookeanLinearZeroStartTriangleException,true);
 A.equal(g.requireExplicitTeacherAxesExplanation,true);
 A.equal(g.scoredRelease,'HOLD');
 for(const k of ['previousV177NumericalDispositionsRetained','originalBookUnmodified',
 'originalOwnerQuestionBanksUnmodified','priorV193SourceEvidenceUnmodified',
 'existing72ItemDetailedCandidateQueueUnmodified'])A.equal(d[k],true);
 for(const k of ['individualAuthenticatedTeacherScienceApprovals','individualAuthenticatedCognitiveApprovals',
 'ownerScoringPermissions','scoredUnit7StudentItems'])A.equal(d[k],0);
 for(const k of ['firebaseAuthRulesOrAppCheckChanged','productionOrStagingDeployed',
 'liveStudentTestBuilderChanged'])A.equal(d[k],false);
 A.equal(d.existingUnit7OriginalItemUniverse,274);
 A.equal(d.publicTeacherBackendGateV160,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(d.publicTeacherBackendGateV161,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 A.equal(d.ciAssuranceLimit.includes('cannot inspect private Word/PDF files'),true);
 A.ok(d.nextMilestone.startsWith('V195'));
 noLeaks(d,'ledger');
}
const d=load(FILE);check(d);
const old=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
const legacy=load('quality/unit07/unit07-v177-end-exercise-numerical01-05-image-bound-no-keys.json');
const queue=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
A.equal(old.version,'V193');
A.deepEqual(old.sourcePdfNames??old.uploadedOriginalSources.map(x=>x.filename),d.sourcePdfNames);
A.equal(old.originalNumericalReview.questions.length,5);
A.deepEqual(legacy.compulsoryTeacherReviewNumbers,[1,3,4,5]);
A.deepEqual(legacy.printedHintsFullyConsistentNumbers,[2]);
for(let i=0;i<5;i++){
 A.equal(old.originalNumericalReview.questions[i].printedHintClass,d.problemDecisions[i].printedHintStatus);
 A.equal(legacy.items[i].studentScoredRelease,'HOLD');
 A.equal(legacy.items[i].teacherScienceSignoff,'PENDING');
}
A.equal(queue.candidateRegistry.length,72);
for(const r of queue.candidateRegistry){
 A.equal(r.eligibleForStudentScoredUse,false);A.equal(r.scoredRelease,'HOLD');
 A.equal(r.candidateIndividualRevisionSha256,null);
}
A.equal(queue.studentScoredUnit7Items,0);
const unit=load('portal/learning-catalog.json').grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(unit.status,'planned');A.equal(unit.assessmentStatus,'not-published');A.equal(unit.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
independentArithmetic();
const mutations=[
 x=>x.version='V195',
 x=>x.prerequisite.prNumber=296,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='TEACHER_APPROVED_RELEASE',
 x=>x.sourcePdfSha256[0]='0'.repeat(64),
 x=>x.sourcePdfPageCountPerCopy=14,
 x=>x.sourcePrintedPagesUsed.pop(),
 x=>x.artifact.docxSha256='0'.repeat(64),
 x=>x.artifact.pdfSha256='0'.repeat(64),
 x=>x.artifact.renderedPages=5,
 x=>x.artifact.everyRenderedPageVisuallyInspected=false,
 x=>x.artifact.independentTeacherFieldsPreFilled=true,
 x=>x.artifact.originalNbfPagesCopiedIntoRepository=true,
 x=>x.artifact.answerKeyOrFullWorkedSolutionPublishedInRepository=true,
 x=>x.problemDecisions.pop(),
 x=>x.problemDecisions[0].disposition='NO_COMPULSORY_AMENDMENT',
 x=>x.problemDecisions[2].printedHintStatus='consistent',
 x=>x.problemDecisions[3].cause='text',
 x=>x.problemDecisions[3].scoring='RELEASED',
 x=>x.problemDecisions[4].answerKey='A',
 x=>x.graphTeaching.originalAxisHorizontal='EXTENSION',
 x=>x.graphTeaching.reversedAxesAreaEqualsWorkGenerally=true,
 x=>x.graphTeaching.hookeanLinearZeroStartTriangleException=false,
 x=>x.graphTeaching.scoredRelease='RELEASED',
 x=>x.previousV177NumericalDispositionsRetained=false,
 x=>x.originalBookUnmodified=false,
 x=>x.existing72ItemDetailedCandidateQueueUnmodified=false,
 x=>x.individualAuthenticatedTeacherScienceApprovals=1,
 x=>x.individualAuthenticatedCognitiveApprovals=1,
 x=>x.ownerScoringPermissions=1,
 x=>x.scoredUnit7StudentItems=1,
 x=>x.liveStudentTestBuilderChanged=true,
 x=>x.productionOrStagingDeployed=true,
 x=>x.publicTeacherBackendGateV160='GO',
 x=>x.nextMilestone='SCORE_NOW'
];
let rejected=0;
for(const change of mutations){const m=structuredClone(d);change(m);A.throws(()=>check(m),undefined,'mutation '+(rejected+1));rejected++;}
const memo=read(MEMO).toLowerCase();
for(const term of ['v194','word','pdf','six-page','teacher','pending','hold','7.1','7.2',
 '7.3','7.4','7.5','shear','brass','60.75','50 cm','figure','7.14','axis','hookean',
 'no-go','firebase','v195'])A.ok(memo.includes(term),'missing teacher memo term '+term);
const qa=path.join(ROOT,'qa-artifacts/grade11-v194-unit07-private-teacher-guide');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V194',sourceBookCopies:2,sourcePagesEach:15,privateTeacherGuidePages:6,
 originalNumericalItemsVerified:5,compulsoryReviewProblems:[1,3,4,5],
 publishedHintConsistentProblems:[2],graphAxesWarning:true,
 publicMetadataTamperingDenied:rejected,authenticatedTeacherApprovals:0,
 ownerScoringPermissions:0,unit7ScoredItems:0,
 privateFullSolutionsInPublicRepo:false,liveBankOrBackendChanged:false,
 note:'PRIVATE_DOCX_AND_PDF_HASHES_NOT_RECOMPUTED_IN_CI'
},null,2)+'\n');
console.log('V194 PASS: independent arithmetic and '+rejected+' denied metadata mutations, 6-page private teacher draft, ZERO scored Unit7 releases.');
