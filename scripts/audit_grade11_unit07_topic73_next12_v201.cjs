#!/usr/bin/env node
'use strict';
/**
 * V201: Public non-keyed original-source SHA and SLO QC. No original stems,
 * options, answer letters, private candidate hashes or real teacher approvals.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const REG='quality/unit07/unit07-v201-topic73-next12-energy-source-slo-no-keys.json';
const MEMO='quality/grade11-v201-unit07-topic73-second12-energy-source-slo-qc.md';
const numbers=[4,15,23,29,32,34,37,39,41,52,57,75];
const hashes=["7c23c91191ce1313e20ddc55665f455018cbd9fa160a491c8ea9d242c177d857","b165eca633fd229fa64e47d9b5a4d9818c16733894fe1769c8b989404dab1a55","d43280151c9dbdd521b80d4ee4c52d0fdffc3cce125089d4043205dcc6330f0f","cbfc248c51151b9294be327dc824f669a2a0d569953bfc4eb737a9c08ebcd337","5380aeb829c1742677f6dc518ea64cb5edebba17d112ddf9acc627d764ab9be5","43aa98cfbcafde0bea5e6540db7f9f700142c6fbc6851a6283f05aa491ab6058","770f5b962e706f41de843bfd131d84bfb70c964682c986e5fb46bb491b798c12","78f50ab42af34aa80dcfe97cce40bab638c40f7d2c03f4b03ffc56737a792fbd","60d6a76502d172db0c9601e364d5db8ef1b4f694ee28ffb8d4e72439df183b3f","7a8130a7d89e4c596c263a35fbe4e9c0c1d37731e5b063fb303772772649bae7","c54448ad257fcfc76c74a243acedf37c1e9712783455fc5eca07d7c62b4e25ed","f6439a100b1ad153add467eb4dde090996d3c48f765e94aba4f7f7ddef051b64"];
const originalSlo=["P-11-B-25","P-11-B-25","P-11-B-28","P-11-B-25","P-11-B-25","P-11-B-25","P-11-B-28","P-11-B-27","P-11-B-28","P-11-B-28","P-11-B-27","P-11-B-28"];
const originalCog=["U","U","A","U","A","U","U","A","A","A","A","A"];
const originalScope=["direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","teacher-cross-slo-review","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate","direct-topic-candidate"];
const originalPriority=["none","none","optional","none","optional","optional","none","none","none","optional","none","none"];
const classifications=["SUPPORTING_B25_GAUGE_LENGTH_RECOGNITION","SUPPORTING_B25_DIAMETER_FOR_AREA_RECOGNITION","PROMISING_DIRECT_B28_TWO_FACTOR_ENERGY_SCALING","SUPPORTING_B25_RELIABILITY_METHOD_NOT_EXPLICIT_TEXTBOOK_PRESCRIPTION","BORDERLINE_B25_CROSS_SLO_EXTENSION_PROPORTIONALITY","PROMISING_DIRECT_B25_STIFFNESS_VERSUS_YOUNG_MODULUS_GRAPH_AXIS_CAVEAT","SUPPORTING_B28_ELASTIC_LIMIT_CONCEPT_BELOW_APPLICATION","BORDERLINE_B27_QUALITATIVE_TRIANGLE_AREA_COMPARISON","PROMISING_DIRECT_B28_LINEAR_FORCE_EXTENSION_NUMERICAL","PROMISING_DIRECT_B28_YOUNG_GEOMETRY_ENERGY_NUMERICAL","PROMISING_DIRECT_B27_GRAPH_COORDINATE_TRIANGLE_AREA","PROMISING_DIRECT_B28_STIFFNESS_COMPARISON"];
const expectedPages=[122,122,123,122,122,122,123,122,123,123,122,123];
const blockedKeys=['stem','question','originalQuestion','questionText','options',
 'optionA','optionB','optionC','optionD','originalExplanation','answerKey','answer',
 'correctOption','correctAnswer','correctLetter','keyedExplanation','studentUid',
 'teacherUid','teacherEmail','studentEmail','authToken','privateCandidateRevisionSha256',
 'originalSourceDocxBytes','privateTeacherSignature'];
function noPrivate(o,label){
 if(!o||typeof o!=='object')return;
 for(const k of blockedKeys)A.equal(Object.hasOwn(o,k),false,'private field in public metadata: '+label+'.'+k);
 for(const [k,v] of Object.entries(o))if(v&&typeof v==='object')noPrivate(v,label+'.'+k);
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V201');
 A.equal(d.prerequisite.mergedPr,304);A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'630df488968d162197ecaacaf139be0b839d74d4');
 A.equal(d.status,'SECOND_TWELVE_ORIGINAL_TOPIC73_MODEL_QC_NO_HUMAN_APPROVAL_NO_STUDENT_SCORE');
 A.equal(d.sourceOwnerWord,'Grade11_Unit7_Topic7.3_PartA_80MCQs_Study_With_Answers.docx');
 A.equal(d.sourceOwnerWordSha256,'f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279');
 A.equal(d.canonicalOriginal80Register,'quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
 A.deepEqual(d.originalNbfPdfScanSha256,
  ['0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9',
   '08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892']);
 A.deepEqual(d.originalNbfPrintedPagesChecked,[122,123]);
 A.equal(d.officialFramework,'FBISE HSSC-I Physics 2025');
 A.deepEqual(d.officialSloCognition,{'P-11-B-25':'Understanding','P-11-B-27':'Application','P-11-B-28':'Application'});
 A.deepEqual(d.selectedNumbers,numbers);A.equal(d.selectedCount,12);
 A.equal(d.overlapsEarlierV18572,0);A.equal(d.overlapsV197Topic73Batch,0);A.equal(d.overlapsV198V199V200,0);
 A.deepEqual(d.promisingDirectNumbers,[23,34,41,52,57,75]);
 A.deepEqual(d.cognitiveOrSloBorderlineNumbers,[32,39]);
 A.deepEqual(d.supportingOrScopeSensitiveNumbers,[4,15,29,37]);
 A.equal(d.originalAnswerLetterErrorsDetected,0);
 A.equal(d.originalOwnerBankChanged,false);A.equal(d.newCandidateRevisionHashesIssued,0);
 const c=d.sourceCautions;
 for(const k of ['q29RepeatAverageSoundPracticeButNotExplicitBookInstruction',
 'q32ScalingMechanicsMayFitB24BetterThanExperimentB25',
 'q34ForceExtensionGraphSlopeRequiresAxesAndWireGeometry',
 'q37RecoverableEnergyMayDifferPastElasticLimit',
 'q39SimpleQualitativeAreaIncreaseCognitiveLevelTeacherPending',
 'q57SourceFig714ReversedAxesButQuestionOrderedPairsStandard',
 'q23PotentialConceptualOverlapWithPriorV197Q50',
 'q52MillimetresConvertedToMetres',
 'q75TwoSpringsSameExtensionEnergyScalesWithStiffness'])A.equal(c[k],true);
 const p=d.privateArtifact;
 A.equal(p.docx,'Unit7_V201_PRIVATE_Topic73_Twelve_Original_Source_SLO_QC.docx');
 A.equal(p.docxSha256,'029ddaecae740f9be83d541ba641dca128b7cdbebc3db5a564d5409aef3f20be');
 A.equal(p.pdf,'Unit7_V201_PRIVATE_Topic73_Twelve_Original_Source_SLO_QC.pdf');
 A.equal(p.pdfSha256,'70afb769e504b5511317ec5b058da4d03b6e51fb7af6cc26ea45bd546bfdb5d8');
 A.equal(p.privateJsonSha256,'395d5cc38005df085ed6275d03b027ef074bd5c626f4f3e696a3473d349880d3');
 A.equal(p.renderedPages,7);A.equal(p.visuallyChecked,true);A.equal(p.teacherDecisionFieldsBlank,true);
 A.equal(p.originalKeysOrSourceImagesPublishedToGitHub,false);
 A.equal(d.items.length,12);
 for(let i=0;i<numbers.length;i++){
  const x=d.items[i],n=numbers[i];
  A.equal(x.sourceNumber,n);
  A.equal(x.sourceId,'XI-U07-T073-Q'+String(n).padStart(3,'0'));
  A.equal(x.originalFullRowSha256,hashes[i]);
  A.equal(x.originalSlo,originalSlo[i]);
  A.equal(x.originalAuthorCognitive,originalCog[i]);
  A.equal(x.priorV173SourceScope,originalScope[i]);
  A.equal(x.priorV173Priority,originalPriority[i]);
  A.equal(x.officialCognitiveDemand,d.officialSloCognition[x.originalSlo]);
  A.equal(x.textbookPrintedPage,expectedPages[i]);
  A.equal(x.modelDisposition,classifications[i]);
  A.ok(x.teacherFollowup.length>20);
  A.equal(x.originalKeyOrOptionsEdited,false);
  A.equal(x.newPrivateItemRevisionIssued,false);
  A.equal(x.independentHumanScienceDecision,'PENDING');
  A.equal(x.independentHumanCognitiveDecision,'PENDING');
  A.equal(x.studentScoredRelease,'HOLD');
 }
 A.equal(d.unit7OriginalQuestionUniverse,274);
 A.equal(d.priorDetailedPrivateCandidateCount,72);
 for(const k of ['previousV197SourceOnlyReviewed','previousV198SourceOnlyReviewed',
 'previousV199SourceOnlyReviewed','previousV200SourceOnlyReviewed'])A.equal(d[k],12);
 for(const k of ['authenticatedTeacherScienceApprovals','authenticatedTeacherCognitiveApprovals',
 'ownerScoredReleaseApprovals','scoredUnit7StudentItems'])A.equal(d[k],0);
 A.equal(d.teacherBackendV160,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(d.teacherBackendV161,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 for(const k of ['firebaseAuthRulesAppCheckChanged','originalSourceBankOrTextbookChanged',
 'scoredStudentBankChanged','productionOrStagingDeployed'])A.equal(d[k],false);
 A.ok(d.ciLimitation.includes('cannot read private original keyed'));
 A.ok(d.nextMilestone.startsWith('V202'));
 noPrivate(d,'V201');
}
const d=load(REG);validate(d);
const v173=load('quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const v197=load('quality/unit07/unit07-v197-topic73-twelve-originals-source-slo-secondpass-no-keys.json');
const v200=load('quality/unit07/unit07-v200-topic71-next12-structure-source-slo-no-keys.json');
const v193=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
A.equal(v173.version,'V173');A.equal(v173.originalSourceFirstPassRowCount,80);
A.equal(v173.originalPrivateWordSha256,d.sourceOwnerWordSha256);
A.equal(v173.originalRowSourceRegistry.length,80);
A.equal(v185.candidateRegistry.length,72);
A.equal(v197.items.length,12);A.equal(v200.items.length,12);
A.deepEqual(v193.uploadedOriginalSources.map(x=>x.sha256),d.originalNbfPdfScanSha256);
const older=new Set(v185.candidateRegistry.map(x=>x.sourceId));
const oldQcs=new Set(v197.items.map(x=>x.sourceId));
for(let i=0;i<numbers.length;i++){
 const r=d.items[i],v=v173.originalRowSourceRegistry[r.sourceNumber-1];
 A.equal(v.number,r.sourceNumber);
 A.equal(v.originalPrivateFullRowSha256,r.originalFullRowSha256);
 A.equal(v.sourceMappedSlo,r.originalSlo);
 A.equal(v.sourceAuthorDemand,r.originalAuthorCognitive);
 A.equal(v.previousReviewScope,r.priorV173SourceScope);
 A.equal(v.previousReviewPriority,r.priorV173Priority);
 A.equal(v.teacherScienceSignoff,'PENDING');A.equal(v.studentScoredRelease,'HOLD');
 A.equal(older.has(r.sourceId),false,'V201 source already in V185 72-item review');
 A.equal(oldQcs.has(r.sourceId),false,'V201 source overlaps V197 Topic7.3');
}
for(const x of v185.candidateRegistry){
 A.equal(x.candidateIndividualRevisionSha256,null);
 A.equal(x.eligibleForStudentScoredUse,false);
 A.equal(x.scoredRelease,'HOLD');
}
const cat=load('portal/learning-catalog.json');
const unit=cat.grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
A.equal(unit.status,'planned');A.equal(unit.assessmentStatus,'not-published');
A.equal(unit.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const mutations=[
 x=>x.prerequisite.mergedPr=303,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='TEACHER_APPROVED_SCORE',
 x=>x.sourceOwnerWordSha256='0'.repeat(64),
 x=>x.originalNbfPdfScanSha256[0]='0'.repeat(64),
 x=>x.officialSloCognition['P-11-B-28']='Understanding',
 x=>x.selectedNumbers.pop(),
 x=>x.selectedCount=13,
 x=>x.overlapsEarlierV18572=1,
 x=>x.overlapsV197Topic73Batch=1,
 x=>x.promisingDirectNumbers.push(32),
 x=>x.cognitiveOrSloBorderlineNumbers.pop(),
 x=>x.supportingOrScopeSensitiveNumbers.pop(),
 x=>x.originalAnswerLetterErrorsDetected=1,
 x=>x.newCandidateRevisionHashesIssued=12,
 x=>x.sourceCautions.q34ForceExtensionGraphSlopeRequiresAxesAndWireGeometry=false,
 x=>x.sourceCautions.q57SourceFig714ReversedAxesButQuestionOrderedPairsStandard=false,
 x=>x.privateArtifact.docxSha256='0'.repeat(64),
 x=>x.privateArtifact.pdfSha256='0'.repeat(64),
 x=>x.privateArtifact.renderedPages=6,
 x=>x.privateArtifact.teacherDecisionFieldsBlank=false,
 x=>x.privateArtifact.originalKeysOrSourceImagesPublishedToGitHub=true,
 x=>x.items.pop(),
 x=>x.items[0].sourceNumber=5,
 x=>x.items[1].originalFullRowSha256='0'.repeat(64),
 x=>x.items[2].originalAuthorCognitive='U',
 x=>x.items[3].modelDisposition='APPROVED',
 x=>x.items[4].teacherFollowup='OK',
 x=>x.items[5].originalKeyOrOptionsEdited=true,
 x=>x.items[6].newPrivateItemRevisionIssued=true,
 x=>x.items[7].independentHumanScienceDecision='APPROVED',
 x=>x.items[8].independentHumanCognitiveDecision='APPROVED',
 x=>x.items[9].studentScoredRelease='RELEASED',
 x=>x.items[10].answerKey='C',
 x=>x.unit7OriginalQuestionUniverse=275,
 x=>x.authenticatedTeacherScienceApprovals=1,
 x=>x.authenticatedTeacherCognitiveApprovals=1,
 x=>x.ownerScoredReleaseApprovals=1,
 x=>x.scoredUnit7StudentItems=1,
 x=>x.teacherBackendV160='GO',
 x=>x.firebaseAuthRulesAppCheckChanged=true,
 x=>x.scoredStudentBankChanged=true,
 x=>x.productionOrStagingDeployed=true,
 x=>x.nextMilestone='RELEASE_ALL'
];
let rejected=0;
for(const fn of mutations){
 const edited=structuredClone(d);fn(edited);
 A.throws(()=>validate(edited),undefined,'fail-closed metadata change '+(rejected+1));rejected++;
}
const memo=read(MEMO).toLowerCase();
for(const word of ['v201','v173','v185','v197','v200','topic 7.3',
 'p-11-b-25','p-11-b-27','p-11-b-28','application','understanding','q32',
 'q34','q39','q57','figure 7.14','axes','teacher','pending','hold','no-go','v202'])
 A.ok(memo.includes(word),'missing academic source memo word '+word);
const qa=path.join(ROOT,'qa-artifacts/grade11-v201-topic73-next12-original-qc');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V201',selectedOriginalSourceItems:12,matchedAgainstV173:12,
 overlapsWithV185:0,overlapsWithV197:0,promisingDirect:6,borderline:2,
 supporting:4,originalAnswerKeyChanges:0,privateItemRevisionsIssued:0,
 authenticatedHumanAcademicDecisions:0,scoredUnit7Questions:0,
 adversarialMutationsDenied:rejected,
 limitation:'PUBLIC_CI_DOES_NOT_ACCESS_PRIVATE_KEYED_WORD_OR_AUTHENTICATE_HUMAN_TEACHERS'
},null,2)+'\n');
console.log('V201 PASS: twelve source-verified original Topic7.3 rows, '+rejected+' denied alterations, 0 approvals, 0 scored releases.');
