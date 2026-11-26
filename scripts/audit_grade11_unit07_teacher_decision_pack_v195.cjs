#!/usr/bin/env node
'use strict';
/**
 * V195 PUBLIC REGISTRY ONLY. Does not authenticate reviewers, check private
 * Word/PDF bytes, modify teacher guidance, or release scored student items.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const FILE='quality/unit07/unit07-v195-unsigned-independent-teacher-review-no-keys.json';
const MEMO='quality/grade11-v195-unit07-unsigned-teacher-review-decision-matrix.md';
const DOCX='0d207e5a02b888c942dc171438d96266b74b6f3809e0e9658d2e266e2c1b8ff5';
const PDF='03e18c10306c3936ca6804bd7303e851c07bca95caa048f88ae05b06a63a42d9';
function denyPrivate(o,where){
 if(!o||typeof o!=='object')return;
 for(const k of ['stem','options','correctOption','answerKey','studentUid','teacherUid',
  'studentEmail','teacherEmail','credential','authToken','originalPdfBytes','originalDocxBytes',
  'scoredAnswerKey','teacherSignature','teacherSignedAt'])
   A.equal(Object.hasOwn(o,k),false,'unexpected sensitive field '+where+'.'+k);
 for(const [k,v] of Object.entries(o))if(v&&typeof v==='object')denyPrivate(v,where+'.'+k);
}
function assertEq(a,b){A.equal(a,b);}
function math(){
 const pi=Math.PI,g=9.8;
 const d=.0015,delta=1.8e-6,y=.005,A0=pi*d*d/4,gamma=delta/y;
 const massG=8e10*A0*gamma/g, massY=20e10*A0*gamma/g;
 const copper=3*Math.sqrt(7/12);
 const cross=pi*(.0025/2)**2;
 const s=(10*g*1.5)/(20e10*cross),b=(6*g)/(1e10*cross);
 const extension=s+b,energy=.5*((10*g)*s+(6*g)*b);
 const rodEnergy=90e-6*3*(300e6)**2/(2*200e9);
 const stress500=500/(pi*(.5/2)**2);
 for(const [x,y] of [[massG,5.19324499879],[massY,12.98311249698],
 [copper,2.29128784748],[extension,.00134759673415],[energy,.042554110205],
 [rodEnergy,60.75],[stress500,2546.47908947]])A.ok(Math.abs(x-y)<1e-7,'arithmetic mismatch '+x+' != '+y);
 return {massG,massY,copper,extension,energy,rodEnergy,stress500};
}
function validate(d){
 assertEq(d.schemaVersion,1);assertEq(d.version,'V195');
 assertEq(d.prerequisite.prNumber,298);assertEq(d.prerequisite.merged,true);
 assertEq(d.prerequisite.mergeSha,'646cdef9fc269a1f638f5ae9a6d0b3039a80c4c3');
 assertEq(d.status,'PRIVATE_UNSIGNED_REVIEW_MATRIX_NOT_TEACHER_APPROVAL_STUDENT_SCORE_HOLD');
 const p=d.privateArtifact;
 assertEq(p.docx,'Unit7_V195_Independent_Teacher_Decision_Pack_UNAPPROVED.docx');
 assertEq(p.docxSha256,DOCX);
 assertEq(p.pdf,'Unit7_V195_Independent_Teacher_Decision_Pack_UNAPPROVED.pdf');
 assertEq(p.pdfSha256,PDF);
 assertEq(p.renderedPages,2);assertEq(p.pageSize,'A4 landscape');
 for(const k of ['visuallyReviewed','allDecisionBoxesBlank'])assertEq(p[k],true);
 for(const k of ['originalTextbookImagesIncluded','teacherFullAnswersPublishedToGithub',
  'committedToPublicRepository','realTeacherSigned'])assertEq(p[k],false);
 const s=d.sourceEvidence;
 assertEq(s.textbookUnit,'NBF Grade XI Physics Unit 7');
 A.deepEqual(s.sourcePdfHashes,['0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9',
 '08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892']);
 A.deepEqual(s.originalPrintedPages,[119,122,123,126]);
 assertEq(s.v193SourceAuditUnchanged,true);
 assertEq(s.v194DetailedTeacherGuideSha256,'216b6418afd362a95ebdb3a385bf18f61fb9e091bc44820117c4e37547a1c477');
 assertEq(d.numericalReview.length,5);
 A.deepEqual(d.numericalReview.map(x=>x.n),[1,2,3,4,5]);
 A.deepEqual(d.numericalReview.map(x=>x.disposition),
 ['COMPULSORY_REVIEW','CONSISTENT','COMPULSORY_REVIEW','COMPULSORY_REVIEW','COMPULSORY_REVIEW']);
 const expectedHints=['5.2 kg','2.29 mm','2.79e-4 m and 11.02 mJ','12.15 J','2.5e5 Pa'];
 const exactResults=['5.19 kg conditional shear G; 12.98 kg if misusing stated Young Y',
 '2.291 mm','1.3476e-3 m and 42.55 mJ','60.75 J','2.546e3 Pa for printed 50 cm diameter'];
 for(let i=0;i<5;i++){
  const r=d.numericalReview[i];
  assertEq(r.printedHint,expectedHints[i]);assertEq(r.recalculated,exactResults[i]);
  assertEq(r.teacherDecision,'PENDING');assertEq(r.scoredStatus,'HOLD');
 }
 const gr=d.graphReview;
 assertEq(gr.figure,'NBF 7.14');assertEq(gr.originalPrintedPage,122);
 assertEq(gr.originalHorizontalAxis,'FORCE');assertEq(gr.originalVerticalAxis,'EXTENSION');
 assertEq(gr.generalWorkAreaHorizontalAxis,'EXTENSION');assertEq(gr.generalWorkAreaVerticalAxis,'FORCE');
 assertEq(gr.reversedAreaIsGenerallyWork,false);
 assertEq(gr.linearOriginHookeanTriangleBothYieldHalfFx,true);
 assertEq(gr.teacherDecision,'PENDING');assertEq(gr.scoredStatus,'HOLD');
 const r=d.reviewProtocol;
 A.deepEqual(r.itemsRequiringIndependentReview,['7.1','7.2','7.3','7.4','7.5','Fig. 7.14']);
 A.deepEqual(r.perItemChoices,['ACCEPT_FOR_OWNER_CONSIDERATION','REVISE_EXPLANATION','HOLD_FOR_EVIDENCE']);
 for(const k of ['allChoicesUnselected','reviewerAndDateFieldsEmpty','paperMarkIsNotAuthenticatedDecision',
 'noMarkingPolicyApproved','sourceBasedAlternativeResultsAreNotAutoGradingKeys',
 'ownerMayConsiderOnlyAfterHumanReview'])assertEq(r[k],true);
 for(const k of ['originalSourceQuestionBankModified','existing72CandidateQueueModified',
 'firebaseAuthFirestoreOrAppCheckChanged','productionOrStagingDeploymentChanged',
 'studentTestBuilderChanged'])assertEq(d[k],false);
 assertEq(d.originalUnit7SourceCount,274);
 assertEq(d.originalPrivateDetailedCandidateCount,72);
 for(const k of ['realAuthenticatedTeacherScienceApprovals','realAuthenticatedTeacherCognitiveApprovals',
 'ownerStudentScoringApprovals','unit7StudentScoredQuestions'])assertEq(d[k],0);
 assertEq(d.productionTeacherBackendV160,'NO_GO_DEPLOYMENT_BLOCKED');
 assertEq(d.stagingTeacherBackendV161,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 A.ok(d.ciLimit.includes('cannot be independently inspected or authenticated'));
 A.ok(d.nextMilestone.startsWith('V196 obtain real independent human review'));
 denyPrivate(d,'index');
}
const d=load(FILE);validate(d);
const v194=load('quality/unit07/unit07-v194-teacher-solution-draft-provenance-no-keys.json');
const v193=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
assertEq(v194.version,'V194');
assertEq(v194.artifact.docxSha256,d.sourceEvidence.v194DetailedTeacherGuideSha256);
assertEq(v194.individualAuthenticatedTeacherScienceApprovals,0);
assertEq(v194.scoredUnit7StudentItems,0);
assertEq(v193.version,'V193');assertEq(v193.originalNumericalReview.questions.length,5);
for(let i=0;i<5;i++){
 A.equal(v194.problemDecisions[i].scoring,'HOLD');
 A.equal(v193.originalNumericalReview.questions[i].teacherPriority,
  [0,2,3,4].includes(i)?'COMPULSORY':'NONE');
}
assertEq(v185.candidateRegistry.length,72);
for(const x of v185.candidateRegistry){
 assertEq(x.candidateIndividualRevisionSha256,null);
 assertEq(x.eligibleForStudentScoredUse,false);
 assertEq(x.scoredRelease,'HOLD');
}
assertEq(v185.studentScoredUnit7Items,0);
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
assertEq(u7.status,'planned');assertEq(u7.assessmentStatus,'not-published');assertEq(u7.questionBankCount,0);
assertEq(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
assertEq(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
assertEq(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
assertEq(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
math();
const attacks=[
 x=>x.prerequisite.prNumber=297,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='APPROVED_TEACHER_MARKING',
 x=>x.privateArtifact.renderedPages=3,
 x=>x.privateArtifact.docxSha256='0'.repeat(64),
 x=>x.privateArtifact.pdfSha256='0'.repeat(64),
 x=>x.privateArtifact.allDecisionBoxesBlank=false,
 x=>x.privateArtifact.realTeacherSigned=true,
 x=>x.privateArtifact.committedToPublicRepository=true,
 x=>x.sourceEvidence.v193SourceAuditUnchanged=false,
 x=>x.numericalReview.pop(),
 x=>x.numericalReview[0].disposition='CONSISTENT',
 x=>x.numericalReview[1].disposition='COMPULSORY_REVIEW',
 x=>x.numericalReview[2].recalculated='2.79e-4 m and 11.02 mJ',
 x=>x.numericalReview[3].teacherDecision='APPROVED',
 x=>x.numericalReview[4].scoredStatus='RELEASED',
 x=>x.graphReview.originalHorizontalAxis='EXTENSION',
 x=>x.graphReview.reversedAreaIsGenerallyWork=true,
 x=>x.graphReview.teacherDecision='APPROVED',
 x=>x.reviewProtocol.allChoicesUnselected=false,
 x=>x.reviewProtocol.paperMarkIsNotAuthenticatedDecision=false,
 x=>x.reviewProtocol.noMarkingPolicyApproved=false,
 x=>x.originalSourceQuestionBankModified=true,
 x=>x.realAuthenticatedTeacherScienceApprovals=1,
 x=>x.realAuthenticatedTeacherCognitiveApprovals=1,
 x=>x.ownerStudentScoringApprovals=1,
 x=>x.unit7StudentScoredQuestions=1,
 x=>x.firebaseAuthFirestoreOrAppCheckChanged=true,
 x=>x.productionOrStagingDeploymentChanged=true,
 x=>x.studentTestBuilderChanged=true,
 x=>x.studentUid='test',
 x=>x.nextMilestone='RELEASE_QUESTIONS'
];
let rejected=0;
for(const attack of attacks){const candidate=structuredClone(d);attack(candidate);A.throws(()=>validate(candidate),undefined,'Failed safety mutation '+(rejected+1));rejected++;}
const memo=read(MEMO).toLowerCase();
for(const term of ['v195','v194','v193','teacher','pending','hold','7.1','7.2','7.3','7.4','7.5','glassy'.replace('glassy','figure'),
 'shear','brass','60.75','50 cm','graph','122','123','126','signed','firebase','v196']){
 A.ok(memo.includes(term),'V195 memo missing '+term);
}
const qa=path.join(ROOT,'qa-artifacts/grade11-v195-unit07-unsigned-teacher-matrix');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V195',privateUnsignedReviewPackPages:2,bookNumericalRows:5,
 independentHumanDecisionsRecorded:0,compulsoryReview:[1,3,4,5],
 controlConsistent:[2],graphFigure:'7.14',metadataMutationsRejected:rejected,
 studentScoredUnit7Items:0,teacherAuthenticatedApprovals:0,
 sourceBasedGuidancePublishedToStudentBank:false,
 caveat:'PUBLIC_CI_CANNOT_VALIDATE_PRIVATE_DOCX_BYTES_OR_ACTUAL_SIGNED_HUMAN_REVIEW'
},null,2)+'\n');
console.log('V195 PASS: 2-page unsigned teacher matrix, five source-grounded computations, '+rejected+' fail-closed mutations, 0 teacher signoffs, 0 scored Unit7 releases.');
