#!/usr/bin/env node
'use strict';
/*
 * V193 — Reconcile newly supplied actual 15-page Unit7 PDFs with previous
 * original-page-only V177 metadata, verify printed page facts/arithmetic.
 * Does NOT commit textbook pages, teacher answers or real student items.
 * CI cannot reopen owner PDFs that remain outside public GitHub.
 */
const A=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const INDEX='quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json';
const MEMO='quality/grade11-v193-unit07-original-two-pdf-source-verification-and-numerical-qc.md';
const sourceShas=[
 '0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9',
 '08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892'
];
const modStatus=[
 'CONDITIONAL_SHEAR_MODULUS_NOT_PRINTED_YOUNG_MODULUS',
 'CONSISTENT',
 'PRINTED_BRASS_MODULUS_VERSUS_HINT_MISMATCH',
 'PRINTED_ENERGY_HINT_FACTOR_FIVE_MISMATCH',
 'PRINTED_DIAMETER_AND_STRESS_HINT_MISMATCH'
];
const hints=['conditional-only','consistent','inconsistent','inconsistent','inconsistent'];
const evidenceCodes=['P114_POLYMER_EXAMPLES','P114_AMORPHOUS_SHORT_RANGE','P115_CUBIC_CELL_FIGURE','EXAMPLE_7_2_BONE','FIG7_13_WIRE'];
function near(x,y,rel=1e-7){A.ok(Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x-y)<=rel*Math.max(1,Math.abs(x),Math.abs(y)),x+' does not match '+y);}
const pi=Math.PI,g=9.8;
function numeric(){
 const nailA=pi*(.0015/2)**2,nailDelta=1.8e-6/.005;
 const nailShearMass=(8e10*nailA*nailDelta)/g;
 const nailYoungMass=(20e10*nailA*nailDelta)/g;
 const copperDiameter=3*Math.sqrt(7/12);
 const section=pi*(.0025/2)**2;
 const steelExtension=((4+6)*g*1.5)/(20e10*section);
 const brassExtension=(6*g*1)/(1e10*section);
 const brassHypExtension=(6*g*1)/(1e11*section);
 const extension=steelExtension+brassExtension;
 const energy=.5*((10*g)*steelExtension+(6*g)*brassExtension);
 const hypotheticalExtension=steelExtension+brassHypExtension;
 const hypotheticalEnergy=.5*((10*g)*steelExtension+(6*g)*brassHypExtension);
 const rodEnergy=(90e-6*3*(300e6)**2)/(2*200e9);
 const stress50cm=500/(pi*(.50/2)**2);
 const stress5cm=500/(pi*(.05/2)**2);
 const boneForce=62*g;
 const boneDelta=(boneForce*.4)/(9e9*pi*.02**2);
 return {nailShearMass,nailYoungMass,copperDiameter,extension,energy,hypotheticalExtension,hypotheticalEnergy,rodEnergy,stress50cm,stress5cm,boneForce,boneDelta};
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V193');
 A.equal(d.prerequisite.prNumber,296);A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'8e6c300199753ba56cd925d83aa082754867913b');
 A.equal(d.status,'DIRECT_ORIGINAL_TEXTBOOK_PAGES_NOW_VERIFIED_FOUR_NUMERICAL_TEACHER_HOLDS_NO_RELEASE');
 A.equal(d.uploadedOriginalSources.length,2);
 for(let i=0;i<2;i++){
  const s=d.uploadedOriginalSources[i];
  A.equal(s.filename,i===0?'Unit 7.pdf':'unit 7 - Physics 11.pdf');
  A.equal(s.sha256,sourceShas[i]);
  A.equal(s.pageCount,15);
  A.equal(s.originalPagesCommittedToPublicRepo,false);
 }
 A.equal(d.mapping.pdfPage1,'Unit7 opening and SLO list');
 A.equal(d.mapping.pdfPage2,'printed NBF page 113');
 A.equal(d.mapping.pdfPage3,'printed NBF page 114');
 A.equal(d.mapping.pdfPage4,'printed NBF page 115');
 A.equal(d.mapping.pdfPage5,'printed NBF page 116');
 A.equal(d.mapping.pdfPage10,'printed NBF page 121');
 A.equal(d.mapping.pdfPage11,'printed NBF page 122');
 A.equal(d.mapping.pdfPage12,'printed NBF page 123');
 A.equal(d.mapping.pdfPage15,'printed NBF page 126');
 A.equal(d.visuallyInspectedCorrespondingPageOrder,true);
 A.equal(d.sourceResolved.length,5);
 for(let i=0;i<5;i++){
  const item=d.sourceResolved[i];
  A.equal(item.code,evidenceCodes[i]);
  A.equal(item.printedPage,[114,114,115,121,122][i]);
  A.equal(item.sourceEvidence,i===4?'ORIGINAL_DIAGRAM_VERIFIED_ONLY':'ORIGINAL_PAGE_VERIFIED');
  A.equal(item.scoredRelease,'HOLD');
 }
 A.ok(d.sourceResolved[0].academicDecision.includes('not proof'));
 A.ok(d.sourceResolved[1].academicDecision.includes('source-grounded'));
 A.ok(d.sourceResolved[2].academicDecision.includes('1,2,4'));
 A.ok(d.sourceResolved[3].academicDecision.includes('70 kg'));
 A.ok(d.sourceResolved[3].academicDecision.includes('62 kg'));
 A.ok(d.sourceResolved[3].academicDecision.includes('2.15e-5m'));
 A.ok(d.sourceResolved[4].academicDecision.includes('permissions'));
 A.equal(d.sourceCautions.length,2);
 A.equal(d.sourceCautions[0].code,'P113_POLYCRYSTALLINE_ISOTROPY');
 A.equal(d.sourceCautions[1].code,'P122_P123_FORCE_EXTENSION_AXES');
 A.ok(d.sourceCautions[1].note.includes('x-axis'));
 A.ok(d.sourceCautions[1].note.includes('y-axis'));
 A.ok(d.sourceCautions[1].note.includes('linear zero-start'));
 const nr=d.originalNumericalReview;
 A.equal(nr.sourcePrintedPage,126);
 A.equal(nr.provisionalStatus,'ORIGINAL_QUESTION_TEXT_PRESERVED_TEACHER_REVIEW_REQUIRED');
 A.ok(nr.mathAssumptions.includes('g=9.8'));
 A.equal(nr.questions.length,5);
 const math=numeric();
 const answers=[
  [math.nailShearMass,math.nailYoungMass],
  math.copperDiameter,
  [math.extension,math.energy],
  math.rodEnergy,
  math.stress50cm
 ];
 for(let i=0;i<5;i++){
  const r=nr.questions[i];
  A.equal(r.n,i+1);
  A.equal(r.sourceStatus,modStatus[i]);
  A.equal(r.printedHintClass,hints[i]);
  A.equal(r.teacherPriority,[0,2,3,4].includes(i)?'COMPULSORY':'NONE');
  A.ok(r.scienceBasis.length>35);
  if(i===0){near(r.publishedHintNumeric,5.2);near(r.computedFromBookTableShear,math.nailShearMass);near(r.computedFromStatedYoung,math.nailYoungMass);}
  if(i===1){near(r.publishedHintNumeric,2.29);near(r.computedFromGiven,math.copperDiameter);}
  if(i===2){
   near(r.publishedHintNumeric[0],.000279);near(r.publishedHintNumeric[1],.01102);
   near(r.computedFromGiven[0],math.extension);near(r.computedFromGiven[1],math.energy);
  }
  if(i===3){near(r.publishedHintNumeric,12.15);near(r.computedFromGiven,math.rodEnergy);}
  if(i===4){near(r.publishedHintNumeric,250000);near(r.computedFromGiven,math.stress50cm);}
 }
 near(math.boneForce,607.6);near(math.boneDelta,2.148e-5,1e-3);
 near(math.hypotheticalExtension,.0002695193468295393);
 near(math.hypotheticalEnergy,.010858635017821215);
 near(math.stress5cm,254647.90894703253);
 for(const k of ['existingV177NumericalClassificationRetained'])A.equal(d[k],true);
 for(const k of ['existingV18572CandidateSourceRowsMutated','existingV192Q25RevisionMutated',
  'questionOnlyStudentPortalChanged','sourceImagesOrFullTextCommitted','ownerOriginalBooksEdited',
  'firebaseAuthOrRulesChanged','teacherRoleOrAppCheckChanged','productionOrStagingDeployed'])
  A.equal(d[k],false);
 for(const k of ['individualTeacherScienceApprovals','individualTeacherCognitiveApprovals',
  'ownerScoringApprovals','unit7ScoredStudentReleases'])A.equal(d[k],0);
 A.equal(d.publicTeacherBackendStatus,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 A.ok(d.ciLimit.includes('does not include the copyrighted scans'));
 A.ok(d.nextMilestone.startsWith('V194'));
 for(const x of nr.questions)for(const k of ['stem','question','originalQuestion','fullOriginalText',
   'workedSolution','answerKey','privateTeacherUid','studentUid','userProvidedPdfBytes'])
  A.equal(Object.hasOwn(x,k),false);
}
const d=load(INDEX);validate(d);
const old=load('quality/unit07/unit07-v177-end-exercise-numerical01-05-image-bound-no-keys.json');
A.equal(old.version,'V177');
A.deepEqual(old.printedHintsFullyConsistentNumbers,[2]);
A.deepEqual(old.printedHintConditionallyReproducibleNumbers,[1]);
A.deepEqual(old.printedHintsInconsistentWithGivenDataNumbers,[3,4,5]);
A.deepEqual(old.compulsoryTeacherReviewNumbers,[1,3,4,5]);
for(let i=0;i<5;i++){
 A.equal(old.items[i].sourceQuestionNumber,i+1);
 A.equal(old.items[i].originalPrintedAnswerHintStatus,d.originalNumericalReview.questions[i].printedHintClass);
 A.equal(old.items[i].teacherScienceSignoff,'PENDING');
 A.equal(old.items[i].studentScoredRelease,'HOLD');
}
const v192=load('quality/unit07/unit07-v192-q25-science-disposition-private-hold-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
A.equal(v192.version,'V192');
A.equal(v192.scientificModelPrescreen.independentHumanScienceApproval,'PENDING');
A.equal(v192.releaseStatus,'HOLD');
A.equal(v185.candidateRegistry.length,72);
for(const x of v185.candidateRegistry){A.equal(x.scoredRelease,'HOLD');A.equal(x.candidateIndividualRevisionSha256,null);}
A.equal(v185.studentScoredUnit7Items,0);
const catalog=load('portal/learning-catalog.json');
const unit=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(unit.status,'planned');A.equal(unit.assessmentStatus,'not-published');A.equal(unit.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const attacks=[
 x=>x.prerequisite.prNumber=295,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='SCORED',
 x=>x.uploadedOriginalSources.pop(),
 x=>x.uploadedOriginalSources[0].sha256='0'.repeat(64),
 x=>x.uploadedOriginalSources[0].pageCount=14,
 x=>x.uploadedOriginalSources[0].originalPagesCommittedToPublicRepo=true,
 x=>x.visuallyInspectedCorrespondingPageOrder=false,
 x=>x.mapping.pdfPage3='printed NBF page 115',
 x=>x.sourceResolved[1].sourceEvidence='UNVERIFIED',
 x=>x.sourceResolved[3].academicDecision='unverified',
 x=>x.sourceResolved[3].scoredRelease='RELEASED',
 x=>x.sourceCautions[1].note='no issue',
 x=>x.originalNumericalReview.questions.pop(),
 x=>x.originalNumericalReview.questions[0].teacherPriority='NONE',
 x=>x.originalNumericalReview.questions[1].printedHintClass='inconsistent',
 x=>x.originalNumericalReview.questions[2].computedFromGiven[0]=.000279,
 x=>x.originalNumericalReview.questions[3].computedFromGiven=12.15,
 x=>x.originalNumericalReview.questions[4].computedFromGiven=250000,
 x=>x.originalNumericalReview.questions[0].computedFromBookTableShear=12.9,
 x=>x.originalNumericalReview.questions[0].question='source leak',
 x=>x.existingV177NumericalClassificationRetained=false,
 x=>x.existingV192Q25RevisionMutated=true,
 x=>x.questionOnlyStudentPortalChanged=true,
 x=>x.sourceImagesOrFullTextCommitted=true,
 x=>x.individualTeacherScienceApprovals=1,
 x=>x.individualTeacherCognitiveApprovals=1,
 x=>x.ownerScoringApprovals=1,
 x=>x.unit7ScoredStudentReleases=1,
 x=>x.firebaseAuthOrRulesChanged=true,
 x=>x.teacherRoleOrAppCheckChanged=true,
 x=>x.productionOrStagingDeployed=true,
 x=>x.publicTeacherBackendStatus='GO',
 x=>x.nextMilestone='RELEASE'
];
let rejected=0;
for(const m of attacks){const clone=structuredClone(d);m(clone);A.throws(()=>validate(clone),undefined,'Attack '+(rejected+1));rejected++;}
const memo=read(MEMO).toLowerCase();
for(const k of ['v193','unit 7.pdf','unit 7 - physics 11.pdf','p-11-b-22',
 '113','114','115','121','122','123','126','short-range','glassy',
 'polymer','fcc','example 7.2','graph','axis','shear','brass','60.75',
 '2.55e3','teacher','pending','hold','v160','v161','v194'])
 A.ok(memo.includes(k),'Missing V193 teaching note '+k);
const qa=path.join(ROOT,'qa-artifacts/grade11-v193-original-unit07-source-math');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V193',newlyUploadedOriginalPdfCount:2,
 scannedBookPagesPerFile:15,
 resolvedPrimarySourceEvidencePages:[114,115,121,122],
 originalExerciseProblemsChecked:5,consistent:[2],conditional:[1],inconsistent:[3,4,5],
 teacherReviewRequired:[1,3,4,5],conceptualGraphAxisWarning:true,
 publicMetadataTamperDenials:rejected,
 authenticatedTeacherApprovals:0,scoredUnit7Items:0,
 productionOrStagingChanged:false,originalScansCommitted:false
},null,2)+'\n');
console.log('V193 PASS: two 15-page original scans source-pinned, p114/p115/Example7.2 directly verified, all five arithmetic problems recomputed, '+rejected+' tampering denials, ZERO teacher score releases.');
