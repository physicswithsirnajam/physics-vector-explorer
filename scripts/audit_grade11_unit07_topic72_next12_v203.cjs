#!/usr/bin/env node
'use strict';
/* V203 academic source-hash, SLO and release-HOLD audit.
 * Public CI MUST NOT contain owner original keyed questions or authenticate
 * an independent subject-teacher decision from blank paper review fields.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..'),load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const FILE='quality/unit07/unit07-v203-topic72-twelve-elastic-modulus-source-qc-no-keys.json';
const MEMO='quality/grade11-v203-unit07-topic72-twelve-elastic-modulus-source-slo-qc.md';
const numbers=[40,45,49,50,58,60,61,65,69,73,77,78];
const originalSha=["37d26f0c65ad75e94d203e9640d802ab6f1f01193c706442683348e450e93176","e2a1179813367f52669727c0b747c079006c7d9ea570cfed4b1c68d3301b886a","8e4ecdcd0b02edfbea6053402d05d4b1800e04a07b4b438deba3f561648439a8","4fe4c3c2dfb194d863bf9df36fb0aedf63ad5728be201510c25a28a62cd130fd","87d4b017a704bdd70445cd6d4ab53818603b31f64824728f6ae9291550eeee48","9a3724b52866bd15a948ea681e99633076dc3b1df731b0e730987f51a57c899b","80dc119b795da00a3f0ee99bf0c5e34a5d74e4c2bbcf8c45d1b6836d9716f87a","b870f79dc4b301813d8e34c18e4c54139db74628fdc951c78c2bc2f23389b416","b6c3e70f0c39cd03a83751c14f77f98de75a078ec59f8d0d908e2c795ac1de07","7b2b938af669944793b36f3d78bdbcac0f9e751dc8303a6acbcdd17389ff9b55","267d9df6b8db207caa4f7cc7335ca0a7ff0df215cbd82a67b5e0732d8bcee3ac","ded660f5695db84b016568215787931fda990b4e46efe833fe107db9d8b7f210"];
const originalSlo=["P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-24","P-11-B-23","P-11-B-26","P-11-B-26","P-11-B-26","P-11-B-24","P-11-B-24"];
const originalCognition=["A","A","A","A","A","A","U","U","U","U","A","A"];
const originalScope=["direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core","direct-topic-core"];
const originalIssue=["none","none","none","none","none","none","none","none","none","none","none","none"];
const expectedClassification=["DIRECT_B24_MODULUS_TABLE_COMPARISON","DIRECT_B24_DIMENSIONLESS_STRAIN_TO_EXTENSION","DIRECT_B24_STRESS_FROM_YOUNG_AND_STRAIN","DIRECT_B24_FULL_WIRE_EXTENSION_DUPLICATE_WATCH_Q60","DIRECT_B24_COMPRESSION_KPA_CONVERSION","DIRECT_B24_FULL_WIRE_EXTENSION_DUPLICATE_WATCH_Q50","DIRECT_B23_COMPRESSIVE_LOADING_SCENARIO_OVERLAP_WATCH","DIRECT_B26_PLASTIC_RESIDUAL_BEND_SCENARIO","DIRECT_B26_HOOKE_PROPORTIONAL_LIMIT_CONDITION","DIRECT_B26_RESIDUAL_STRAIN_PLASTICITY_OVERLAP_WATCH","DIRECT_B24_EQUAL_GEOMETRY_BONE_LOAD_RATIO","DIRECT_B24_EQUAL_STRESS_YOUNG_MODULUS_SCALING"];
const expectedAction=["OPTIONAL_ELASTIC_RANGE_CAVEAT_AND_TABLE_OVERLAP_REVIEW","NO_ANSWER_CHANGE_ENSURE_MM_TO_M_RENDERING","NO_ANSWER_CHANGE_EXPLICIT_PROPORTIONAL_REGION","COMPULSORY_Q50_Q60_DUPLICATE_SELECTION_CHECK_BEFORE_SHORT_TEST","NO_ANSWER_CHANGE_EXPLICIT_COMPRESSION_STRESS_MAGNITUDE","COMPULSORY_Q50_Q60_DUPLICATE_SELECTION_CHECK_BEFORE_SHORT_TEST","OPTIONAL_V202_Q06_CONCEPTUAL_DUPLICATE_SELECTION_WATCH","OPTIONAL_PLASTICITY_OVERLAP_WATCH_WITH_Q73","NO_ANSWER_CHANGE_KEEP_OA_PROPORTIONAL_REGION_QUALIFIER","OPTIONAL_CONCEPTUAL_OVERLAP_WATCH_WITH_V202_Q32_AND_Q65","NO_ANSWER_CHANGE_EXPLICIT_EQUAL_BONE_GEOMETRY_AND_MODULUS","OPTIONAL_V198_Q23_CONCEPTUAL_OVERLAP_WATCH"];
const bookPages=[119,117,118,118,117,118,117,121,120,121,121,118];
const privateProps=['question','stem','questionText','options','optionA','optionB','optionC','optionD',
 'correctOption','correctLetter','answerKey','answer','originalAnswerText','ownerExplanation',
 'privateAnswerKey','privateSourceOriginal','studentUid','teacherUid','studentEmail',
 'teacherEmail','authToken','teacherSignature','privateRevisedCandidateSha256',
 'completeOriginalTextbookPageImage'];
function denyPrivate(o,pathKey){
 if(!o||typeof o!=='object')return;
 for(const k of privateProps)A.equal(Object.hasOwn(o,k),false,'private answer/key in public metadata '+pathKey+'.'+k);
 for(const [k,v] of Object.entries(o))if(v&&typeof v==='object')denyPrivate(v,pathKey+'.'+k);
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V203');
 A.equal(d.prerequisite.mergedPr,306);A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'6b76a5311cb9e5d07721323b9c750a4e0549a8a7');
 A.equal(d.status,'SOURCE_BOUNDED_MODEL_ACADEMIC_QC_ONLY_ZERO_TEACHER_APPROVAL_ZERO_SCORES');
 A.equal(d.ownerOriginalWord,'Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx');
 A.equal(d.ownerOriginalWordSha256,'a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada');
 A.equal(d.originalSourceLedger,'quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
 A.deepEqual(d.originalNbfScanSha256,[
 '0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9',
 '08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892']);
 A.deepEqual(d.nBFPrintedPagesChecked,[117,118,119,120,121]);
 A.equal(d.framework,'FBISE HSSC-I Physics 2025');
 A.deepEqual(d.officialSummativeLevels,{'P-11-B-23':'Understanding',
  'P-11-B-24':'Application','P-11-B-26':'Understanding'});
 A.deepEqual(d.selectedOriginalNumbers,numbers);A.equal(d.selectedCount,12);
 A.equal(d.previouslyInV18572DetailedQueue,0);
 A.equal(d.previouslyInV198Topic72QC,0);A.equal(d.previouslyInV202Topic72QC,0);
 A.deepEqual(d.promisingApplicationNumbers,[40,45,49,50,58,60,77,78]);
 A.deepEqual(d.promisingUnderstandingNumbers,[61,65,69,73]);
 A.equal(d.originalSourceAnswerLetterErrorsFound,0);
 A.equal(d.sourceOriginalWordModified,false);A.equal(d.newPrivateRevisionFingerprintsCreated,0);
 const src=d.sourceSpecificCautions;
 for(const x of ['q50AndQ60BothUseFLOverAYDuplicateConcept','q61SimilarToV202Q6Compression',
 'q65AndQ73BothInvolvePermanentDeformation','q73OverlapsV202Q32',
 'q78ComparableToV198Q23ModulusEffect','q69OAProportionalRegionNotEntireElasticAB',
 'q77OriginalBoneExampleOnlyContextNotLiteralSourceQuestion','q58AppliedForceAlreadySpecifiedNotMass',
 'q40SteelAluminiumTable71FromP119','sourceAlgebraAndUnitConversionsIndependentlyChecked'])A.equal(src[x],true);
 const p=d.privateReview;
 A.equal(p.docx,'Unit7_V203_PRIVATE_Topic72_Twelve_Original_Source_SLO_QC.docx');
 A.equal(p.docxSha256,'5cd68ccb0cbca7c7236a994c2582902b690f0000293d5f2936f95ab49cad98cb');
 A.equal(p.pdf,'Unit7_V203_PRIVATE_Topic72_Twelve_Original_Source_SLO_QC.pdf');
 A.equal(p.pdfSha256,'3f78bac11eae1e9c5a1c2ccad6aeb0da0a6d158668b7408416be83e394e92068');
 A.equal(p.privateOriginalKeyedJsonSha256,'fbb108339ab6fa52848599292a4613dd49850ca43b16fc45422c07d67a66ce91');
 A.equal(p.pageCount,7);A.equal(p.renderedAndVisuallyReviewed,true);
 A.equal(p.teacherVerdictFieldsBlank,true);A.equal(p.privateKeyedQuestionsCommittedToPublicRepo,false);
 A.equal(d.items.length,12);
 for(let i=0;i<numbers.length;i++){
  const x=d.items[i],n=numbers[i];
  A.equal(x.sourceId,'XI-U07-T072-Q'+String(n).padStart(3,'0'));
  A.equal(x.sourceNumber,n);
  A.equal(x.originalRowSha256,originalSha[i]);
  A.equal(x.originalSlo,originalSlo[i]);
  A.equal(x.originalAuthorCognitive,originalCognition[i]);
  A.equal(x.priorSourceScope,originalScope[i]);A.equal(x.priorV168FirstPassIssue,originalIssue[i]);
  A.equal(x.officialCognitiveTarget,d.officialSummativeLevels[x.originalSlo]);
  A.equal(x.bookPrintedPage,bookPages[i]);
  A.equal(x.provisionalModelDisposition,expectedClassification[i]);
  A.equal(x.teacherAction,expectedAction[i]);
  A.equal(x.sourceQuestionOrKeyAltered,false);
  A.equal(x.newPrivateCandidateRevisionCreated,false);
  A.equal(x.authenticatedTeacherScienceDecision,'PENDING');
  A.equal(x.authenticatedTeacherCognitiveDecision,'PENDING');
  A.equal(x.studentScoring,'HOLD');
 }
 A.equal(d.unit7OriginalInventory,274);A.equal(d.originalPrivateDetailedCandidateQueue,72);
 A.equal(d.priorSourceOnlyAuditsV197ThroughV202Count,6);
 for(const k of ['realTeacherScienceApprovals','realTeacherCognitiveApprovals',
  'ownerScoringApprovals','scoredUnit7Questions'])A.equal(d[k],0);
 A.equal(d.backendV160,'NO_GO_DEPLOYMENT_BLOCKED');
 A.equal(d.backendV161,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 for(const k of ['firebaseAuthRulesAppCheckChanged','studentTestBuilderChanged',
  'liveUnit7QuestionBankChanged','stagingProductionDeployed'])A.equal(d[k],false);
 A.ok(d.ciLimitation.includes('cannot inspect private'));
 A.ok(d.nextMilestone.startsWith('V204'));
 denyPrivate(d,'V203');
}
const d=load(FILE);validate(d);
const v168=load('quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const v198=load('quality/unit07/unit07-v198-topic72-twelve-unreviewed-source-slo-no-keys.json');
const v202=load('quality/unit07/unit07-v202-topic72-next12-stress-strain-slo-no-keys.json');
const v193=load('quality/unit07/unit07-v193-two-uploaded-original-pdfs-source-audit-no-keys.json');
A.equal(v168.version,'V168');A.equal(v168.canonicalSourceRows.length,80);
A.equal(v168.sourceOriginalPrivateDocxSha256,d.ownerOriginalWordSha256);
A.deepEqual(v168.officialSummativeSloLevels,d.officialSummativeLevels);
A.equal(v185.version,'V185');A.equal(v185.candidateRegistry.length,72);
A.equal(v198.version,'V198');A.equal(v202.version,'V202');
A.equal(v198.items.length,12);A.equal(v202.items.length,12);
A.deepEqual(v193.uploadedOriginalSources.map(x=>x.sha256),d.originalNbfScanSha256);
const prev=new Set([...v185.candidateRegistry.map(x=>x.sourceId),
 ...v198.items.map(x=>x.sourceId),...v202.items.map(x=>x.sourceId)]);
for(let i=0;i<numbers.length;i++){
 const x=d.items[i],s=v168.canonicalSourceRows[numbers[i]-1];
 A.equal(s.sourceNumber,x.sourceNumber);
 A.equal(s.sha256,x.originalRowSha256);
 A.equal(s.originalMappedSlo,x.originalSlo);
 A.equal(s.originalCognitiveCode,x.originalAuthorCognitive);
 A.equal(s.sourceSummativeScope,x.priorSourceScope);
 A.equal(s.firstPassIssue,x.priorV168FirstPassIssue);
 A.equal(s.academicTeacherReview,'PENDING');
 A.equal(s.scoredRelease,'HOLD');
 A.equal(prev.has(x.sourceId),false,'V203 source already reviewed in V185/V198/V202');
}
for(const c of v185.candidateRegistry){
 A.equal(c.candidateIndividualRevisionSha256,null);
 A.equal(c.eligibleForStudentScoredUse,false);
 A.equal(c.scoredRelease,'HOLD');
}
const u7=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const attacks=[
 x=>x.prerequisite.mergedPr=305,x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.status='TEACHER_APPROVED',x=>x.ownerOriginalWordSha256='0'.repeat(64),
 x=>x.originalNbfScanSha256[0]='0'.repeat(64),
 x=>x.officialSummativeLevels['P-11-B-24']='Understanding',
 x=>x.selectedOriginalNumbers.pop(),x=>x.selectedCount=13,
 x=>x.previouslyInV18572DetailedQueue=1,x=>x.previouslyInV198Topic72QC=1,
 x=>x.previouslyInV202Topic72QC=1,
 x=>x.promisingApplicationNumbers.push(61),x=>x.promisingUnderstandingNumbers.pop(),
 x=>x.originalSourceAnswerLetterErrorsFound=1,x=>x.sourceOriginalWordModified=true,
 x=>x.newPrivateRevisionFingerprintsCreated=12,
 x=>x.sourceSpecificCautions.q50AndQ60BothUseFLOverAYDuplicateConcept=false,
 x=>x.sourceSpecificCautions.q69OAProportionalRegionNotEntireElasticAB=false,
 x=>x.privateReview.docxSha256='0'.repeat(64),
 x=>x.privateReview.pdfSha256='0'.repeat(64),
 x=>x.privateReview.teacherVerdictFieldsBlank=false,
 x=>x.privateReview.privateKeyedQuestionsCommittedToPublicRepo=true,
 x=>x.items.pop(),x=>x.items[0].sourceNumber=39,
 x=>x.items[1].originalRowSha256='0'.repeat(64),
 x=>x.items[2].originalAuthorCognitive='U',
 x=>x.items[3].provisionalModelDisposition='STUDENT_APPROVED',
 x=>x.items[4].teacherAction='APPROVED',
 x=>x.items[5].sourceQuestionOrKeyAltered=true,
 x=>x.items[6].newPrivateCandidateRevisionCreated=true,
 x=>x.items[7].authenticatedTeacherScienceDecision='APPROVED',
 x=>x.items[8].authenticatedTeacherCognitiveDecision='APPROVED',
 x=>x.items[9].studentScoring='RELEASED',
 x=>x.items[10].correctOption='B',
 x=>x.originalPrivateDetailedCandidateQueue=84,
 x=>x.realTeacherScienceApprovals=1,x=>x.realTeacherCognitiveApprovals=1,
 x=>x.ownerScoringApprovals=1,x=>x.scoredUnit7Questions=1,
 x=>x.backendV160='GO',x=>x.firebaseAuthRulesAppCheckChanged=true,
 x=>x.studentTestBuilderChanged=true,x=>x.stagingProductionDeployed=true,
 x=>x.nextMilestone='RELEASE_TO_STUDENTS'
];
let denied=0;
for(const attack of attacks){
 const invalid=structuredClone(d);attack(invalid);
 A.throws(()=>validate(invalid),undefined,'tampered academic source or scoring metadata '+(denied+1));denied++;
}
const memo=read(MEMO).toLowerCase();
for(const word of ['v203','v168','v185','v198','v202',
 'q50','q60','q61','q65','q69','q73','q77','q78',
 'modulus','bone','proportional','application','understanding','teacher',
 'pending','hold','no-go','app check','v204'])A.ok(memo.includes(word),'missing source QC memo term '+word);
const output=path.join(ROOT,'qa-artifacts/grade11-v203-topic72-next12-original-qc');
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify({
 version:'V203',originalSourceItems:12,matchedExactV168SourceShas:12,
 previouslyInV185V198V202:0,applicationCandidateCount:8,understandingCandidateCount:4,
 originalAnswerLetterCorrections:0,unapprovedPrivateRevisedCandidates:0,
 fakeSourceOrApprovalMutationsDenied:denied,
 authenticatedHumanTeacherDecisions:0,ownerScoredPermissions:0,scoredUnit7Questions:0,
 limitation:'PUBLIC_CI_CANNOT_INSPECT_PRIVATE_KEYED_WORD_OR_AUTHENTICATE_HUMAN_TEACHER'
},null,2)+'\n');
console.log('V203 PASS: 12 source-pinned disjoint original Topic7.2 items; '+denied+' hostile status/source changes denied; teacher and scoring HOLD.');
