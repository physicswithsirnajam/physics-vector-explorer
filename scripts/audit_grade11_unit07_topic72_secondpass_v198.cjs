#!/usr/bin/env node
'use strict';
/* V198: KEYLESS source identity, source-level cognition and no-scoring audit.
 * CI cannot inspect private Word/PDF keyed source or authenticate teachers.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const REG='quality/unit07/unit07-v198-topic72-twelve-unreviewed-source-slo-no-keys.json';
const MEMO='quality/grade11-v198-unit07-topic72-twelve-original-mcq-science-slo-qc.md';
const nums=[1,2,4,10,16,21,22,23,24,28,41,68];
const shas=["460bedc1eb3ba160fdef565bb693185d0f6ea5c60e28254ed786e612a616e36e","12d3e675979f8ad3483b3bcab15612b4d25ec4ab9c5dc69e794ffed9192dca68","1f74eee514c7bc11d266e119ce177d92f50ff0199c5e89177c3edbf5efd19728","aa90000d69d7bdda6aa17179cda6abd7a70b45d2f839d6cd15e432317266d54c","aa3e0c677dba50c83f4fedbdccd846fe98fcfeb0dc867e2223e32e27bebd09a8","7067d10a693d175bcfd45505e468657f47b49d977eeb5ceb82884acabc1ffd7f","19fd96649ff522ad4c48bf4459e761f8dba9c2f64f6f27db290470208a93330d","0d16759ea98dd8f484b2e7f9b77e12783f7b0c5e722bda330b2aea5a891f8eba","9fdafdc681cd90ec54481186c9c948622631ffb3692984e42ee180a9914fe09b","b397fc1da745e9745ff3a9b408f216351f24445ab786aac21110c84d179d4d38","abd9edcd994be251082a56c758cecdcdcb57f4fbd2d068461416285cf81687e6","e72d86c78e925782e75703f0e16fcf61889b49e08a0c1d5547e6443ae001fc4b"];
const originalSlo=["P-11-B-23","P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-26","P-11-B-24","P-11-B-24"];
const originalCog=["K","K","U","U","K","U","A","U","A","U","A","A"];
const originalScope=["direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core"];
const originalFlag=["none","none","none","none","none","none","none","none","none","none","none","none"];
const classes=["SUPPORTING_RECALL_BELOW_B23_UNDERSTANDING","SUPPORTING_STRESS_DEFINITION_BELOW_B24_APPLICATION","CROSS_SLO_DIMENSIONAL_ANALYSIS_DEMAND_REVIEW","SUPPORTING_STRAIN_UNIT_RATIO_BELOW_B24_APPLICATION","SUPPORTING_YOUNG_MODULUS_RECALL_BELOW_B24_APPLICATION","BORDERLINE_QUALITATIVE_STRESS_AREA_APPLICATION","PROMISING_DIRECT_B24_STRAIN_SCALING_APPLICATION","BORDERLINE_QUALITATIVE_STRESS_MODULUS_APPLICATION","PROMISING_DIRECT_B24_ELASTIC_EXTENSION_SCALING","PROMISING_DIRECT_B26_HOOKE_UNDERSTANDING_FIGURE_DEPENDENCY","PROMISING_DIRECT_B24_STRESS_CALCULATION","PROMISING_DIRECT_B24_YOUNG_SLOPE_AXIS_QUALIFICATION"];
const privateKeys=['question','questionText','stem','originalStem','optionA','optionB','optionC','optionD','options','correctOption','answerKey','answerLetter','correctAnswer','keyedExplanation','rawSourceWord','teacherUid','studentUid','email','credential','privateRevisedCandidateHash'];
function noLeaks(o,where){
 if(!o||typeof o!=='object')return;
 for(const k of privateKeys)A.equal(Object.hasOwn(o,k),false,'Private keyed/identity data forbidden '+where+'.'+k);
 for(const [k,v] of Object.entries(o))if(v&&typeof v==='object')noLeaks(v,where+'.'+k);
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V198');
 A.equal(d.prerequisite.mergedPr,301);A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'debe8497fccef465673ff6ac9aeace4769d94a92');
 A.equal(d.status,'ORIGINAL_12_SOURCE_MODEL_QC_NO_HUMAN_SIGNOFF_NO_REVISED_CANDIDATES_NO_SCORING');
 A.equal(d.originalWordFile,'Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx');
 A.equal(d.originalWordSha256,'a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada');
 A.equal(d.originalLedger,'quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
 A.deepEqual(d.primaryNbfUnit7PdfSha256,['0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9','08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892']);
 A.deepEqual(d.verifiedNbfPrintedPageWindow,[116,117,118,119,120,121,122]);
 A.equal(d.frameworkReference,'FBISE HSSC-I Physics 2025; Inclusive Scheme of Studies 2024');
 A.deepEqual(d.officialSloLevels,{'P-11-B-23':'Understanding','P-11-B-24':'Application','P-11-B-26':'Understanding'});
 A.equal(d.sourceSelectedCount,12);
 A.equal(d.sourceIDsPreviouslyInV18572,0);A.equal(d.sourceIDsInPreviousV197Batch,0);
 A.deepEqual(d.promisingDirectCandidateNumbers,[22,24,28,41,68]);
 A.deepEqual(d.borderlineActualCognitiveNumbers,[21,23]);
 A.deepEqual(d.supportingOrCrossSloNumbers,[1,2,4,10,16]);
 A.equal(d.sourceAnswerLetterErrorsDetected,0);
 A.equal(d.sourceQuestionOptionsOrExplanationsEdited,false);
 A.equal(d.newPrivateRevisedCandidateItemsCreated,0);
 const p=d.privateReview;
 A.equal(p.docx,'Unit7_V198_PRIVATE_Topic72_Twelve_Source_SLO_QC.docx');
 A.equal(p.docxSha256,'71edfd4763c90b04d9d12befc0938d84191e3007e144c7ad7499ee992a9a3260');
 A.equal(p.pdf,'Unit7_V198_PRIVATE_Topic72_Twelve_Source_SLO_QC.pdf');
 A.equal(p.pdfSha256,'f589bab1509586039f454cae1d150b827aba47e46c8f2e3acfc19c2ece092bd4');
 A.equal(p.privateJsonSha256,'0dc584ed0c1c23dd1d212b212f82e4982a776c982ec1c0f3428b726bd852f58b');
 A.equal(p.renderedPages,7);A.equal(p.visuallyChecked,true);
 A.equal(p.actualTeacherDecisionFieldsBlank,true);A.equal(p.keyedQuestionsUploadedToPublicGitHub,false);
 const s=d.sourceLimitations;
 for(const k of ['originalFig712ReferencedBy28','requiresAccessibleStandaloneFig712BeforeStudentUse',
 'question68GraphAxesShouldBeExplicit','question4DimensionalAnalysisCrossSloNeedsScopeReview',
 'qualitativeApplicationJudgmentNotSettledFor21And23','bookWorkedExample72SourceClearedV193AndUnchanged'])A.equal(s[k],true);
 A.equal(d.items.length,12);
 for(let i=0;i<nums.length;i++){
  const r=d.items[i],n=nums[i];
  A.equal(r.sourceNumber,n);
  A.equal(r.sourceId,'XI-U07-T072-Q'+String(n).padStart(3,'0'));
  A.equal(r.originalCanonicalRowSha256,shas[i]);
  A.equal(r.originalMappedSlo,originalSlo[i]);
  A.equal(r.originalAuthorCognitive,originalCog[i]);
  A.equal(r.priorV168SourceScope,originalScope[i]);
  A.equal(r.priorV168Issue,originalFlag[i]);
  A.equal(r.officialDemand,d.officialSloLevels[r.originalMappedSlo]);
  A.equal(r.modelClassification,classes[i]);
  A.ok(r.teacherAction.length>15);
  A.equal(r.originalQuestionOrKeyEdited,false);
  A.equal(r.teacherScience,'PENDING');A.equal(r.teacherCognitive,'PENDING');A.equal(r.studentScoredRelease,'HOLD');
 }
 A.equal(d.originalUnit7SourceUniverseCount,274);
 A.equal(d.priorDetailedPrivateCandidateQueueCount,72);
 A.equal(d.v197DifferentSourceOnlyBatchCount,12);
 for(const k of ['authenticatedScienceApprovals','authenticatedCognitiveApprovals','ownerStudentScoringApprovals','scoredUnit7StudentQuestions'])A.equal(d[k],0);
 A.equal(d.v160ProductionDecision,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(d.v161StagingProductionDecision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 for(const k of ['noFirebaseAuthFirestoreAppCheckChanges','noStagingOrProductionDeploy',
 'noLiveStudentBankChanges','originalPublisherAndOwnerFilesUnmodified'])A.equal(d[k],true);
 A.ok(d.ciLimit.includes('cannot independently inspect private keyed'));
 A.ok(d.nextMilestone.startsWith('V199'));
 noLeaks(d,'V198');
}
const doc=load(REG);validate(doc);
const v168=load('quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const v197=load('quality/unit07/unit07-v197-topic73-twelve-originals-source-slo-secondpass-no-keys.json');
const v193=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
A.equal(v168.version,'V168');A.equal(v168.canonicalSourceRows.length,80);
A.equal(v168.sourceOriginalPrivateDocxSha256,doc.originalWordSha256);
A.deepEqual(v168.officialSummativeSloLevels,doc.officialSloLevels);
A.equal(v185.version,'V185');A.equal(v185.candidateRegistry.length,72);
A.equal(v197.version,'V197');A.equal(v197.items.length,12);
A.equal(v193.version,'V193');
A.deepEqual(v193.uploadedOriginalSources.map(x=>x.sha256),doc.primaryNbfUnit7PdfSha256);
const oldIds=new Set(v185.candidateRegistry.map(x=>x.sourceId));
const v197Ids=new Set(v197.items.map(x=>x.sourceId));
for(let i=0;i<nums.length;i++){
 const row=v168.canonicalSourceRows[nums[i]-1],chosen=doc.items[i];
 A.equal(row.sourceNumber,chosen.sourceNumber);
 A.equal(row.sha256,chosen.originalCanonicalRowSha256);
 A.equal(row.originalMappedSlo,chosen.originalMappedSlo);
 A.equal(row.originalCognitiveCode,chosen.originalAuthorCognitive);
 A.equal(row.firstPassIssue,chosen.priorV168Issue);
 A.equal(row.academicTeacherReview,'PENDING');A.equal(row.scoredRelease,'HOLD');
 A.equal(oldIds.has(chosen.sourceId),false,'V198 selected an already reviewed V185 item');
 A.equal(v197Ids.has(chosen.sourceId),false,'V198 selected V197 item');
}
for(const old of v185.candidateRegistry){
 A.equal(old.candidateIndividualRevisionSha256,null);
 A.equal(old.eligibleForStudentScoredUse,false);
 A.equal(old.scoredRelease,'HOLD');
}
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const mutations=[
 x=>x.prerequisite.mergedPr=300,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='TEACHER_APPROVED',
 x=>x.originalWordSha256='0'.repeat(64),
 x=>x.primaryNbfUnit7PdfSha256[0]='0'.repeat(64),
 x=>x.officialSloLevels['P-11-B-24']='Understanding',
 x=>x.sourceSelectedCount=13,
 x=>x.sourceIDsPreviouslyInV18572=1,
 x=>x.promisingDirectCandidateNumbers.push(21),
 x=>x.borderlineActualCognitiveNumbers.pop(),
 x=>x.supportingOrCrossSloNumbers.pop(),
 x=>x.sourceAnswerLetterErrorsDetected=1,
 x=>x.privateReview.docxSha256='0'.repeat(64),
 x=>x.privateReview.actualTeacherDecisionFieldsBlank=false,
 x=>x.privateReview.keyedQuestionsUploadedToPublicGitHub=true,
 x=>x.sourceLimitations.question68GraphAxesShouldBeExplicit=false,
 x=>x.items.pop(),
 x=>x.items[0].sourceNumber=9,
 x=>x.items[1].originalCanonicalRowSha256='0'.repeat(64),
 x=>x.items[2].originalMappedSlo='P-11-B-23',
 x=>x.items[3].originalAuthorCognitive='A',
 x=>x.items[4].modelClassification='DIRECT',
 x=>x.items[5].teacherScience='APPROVED',
 x=>x.items[6].teacherCognitive='APPROVED',
 x=>x.items[7].studentScoredRelease='RELEASED',
 x=>x.items[8].originalQuestionOrKeyEdited=true,
 x=>x.items[9].answerKey='A',
 x=>x.priorDetailedPrivateCandidateQueueCount=84,
 x=>x.authenticatedScienceApprovals=1,
 x=>x.authenticatedCognitiveApprovals=1,
 x=>x.ownerStudentScoringApprovals=1,
 x=>x.scoredUnit7StudentQuestions=1,
 x=>x.noFirebaseAuthFirestoreAppCheckChanges=false,
 x=>x.noLiveStudentBankChanges=false,
 x=>x.nextMilestone='SCORE_NOW'
];
let blocked=0;
for(const fn of mutations){const m=structuredClone(doc);fn(m);A.throws(()=>validate(m),undefined,'tamper '+(blocked+1));blocked++;}
const memo=read(MEMO).toLowerCase();
for(const word of ['v198','v168','v185','v197','source','deformation','strain','stress',
 'young','fig 7.12','q21','q23','q28','q68','application','understanding',
 'teacher','pending','hold','no-go','v199'])A.ok(memo.includes(word),'missing V198 memo term '+word);
const target=path.join(ROOT,'qa-artifacts/grade11-v198-topic72-12-unqueued');
fs.mkdirSync(target,{recursive:true});
fs.writeFileSync(path.join(target,'summary.json'),JSON.stringify({version:'V198',
 originalSourceIds:12,priorV185QueueOverlaps:0,priorV197BatchOverlaps:0,
 provisionalDirect:5,borderlineCognition:2,supporting:5,
 originalAnswerLettersChanged:0,newPrivateRevisions:0,
 sourceIdentityAndPrivacyMutationsBlocked:blocked,
 authenticatedTeacherApprovals:0,ownerScoringApprovals:0,scoredUnit7Questions:0,
 warning:'PUBLIC_CI_CANNOT_INSPECT_PRIVATE_KEYED_WORD_OR_AUTHENTICATE_TEACHER'
},null,2)+'\n');
console.log('V198 PASS: 12 source-pinned, disjoint original Topic7.2 MCQs, '+blocked+' fail-closed mutations; teacher/scored HOLD.');
