#!/usr/bin/env node
'use strict';
/**
 * V185 — Source-safe 72-private-candidate teacher-approval READINESS only.
 * This audit NEVER authenticates a teacher, approves an answer, deploys an
 * endpoint or releases a scored student question. Full keys/source private.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const INDEX='quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json';
const MEMO='quality/grade11-v185-unit07-72-private-candidates-teacher-approval-readiness.md';
const FILES={
 V179:'quality/unit07/unit07-v179-batch01-twelve-source-authenticated-keyless-candidates.json',
 V180:'quality/unit07/unit07-v180-batch02-twelve-high-priority-source-bound-no-keys.json',
 V181:'quality/unit07/unit07-v181-batch03-twelve-originals-private-candidates-keyless.json',
 V182:'quality/unit07/unit07-v182-batch04-twelve-originals-private-candidates-keyless.json',
 V183:'quality/unit07/unit07-v183-batch05-twelve-owner-source-private-candidates-keyless.json',
 V184:'quality/unit07/unit07-v184-batch06-twelve-originals-last-compulsory-private-review-no-keys.json'
};
const MAPPING={
 V179:{row:'itemRows',sha:'originalKeylessFullRowFingerprint',num:'originalNumber',
  topic:'originalTopic',slo:'proposedCandidateSlo',demand:'proposedActualCognitive',issue:'scienceFindingCategory',scope:null},
 V180:{row:'itemRows',sha:'originalSourceRowFingerprint',num:'originalNumber',
  topic:'topic',slo:'proposedCandidateSlo',demand:'proposedCandidateActualCognitive',issue:'scienceFindingCategory',scope:'provisionalSummativePlacement'},
 V181:{row:'itemRows',sha:'priorOriginalRowSha256',num:'originalNumber',
  topic:'topic',slo:'proposedSlo',demand:'proposedActualCognitive',issue:'scienceIssueCategory',scope:'proposedSloScope'},
 V182:{row:'reviewerQueueDistinctSourceItems',sha:'originalFullRowSha256',num:'sourceNumber',
  topic:'topic',slo:'candidateSlo',demand:'candidateActualCognitiveProvisional',issue:'scienceIssueCategory',scope:'provisionalSummativeScope'},
 V183:{row:'rows',sha:'originalRowSha256',num:'sourceNumber',
  topic:'topic',slo:'provisionalCandidateSlo',demand:'provisionalCandidateCognitive',issue:'scienceReviewCategory',scope:'provisionalSummativeScope'},
 V184:{row:'rows',sha:'sourceOriginalFullRowSha256',num:'sourceNumber',
  topic:'topic',slo:'proposedSlo',demand:'proposedActualCognitive',issue:'scientificIssueCategory',scope:'proposedSummativeScope'}
};
const SHA_PACKS={
 V179:'a62d795451e9ddc7e93be2e9080c9874ef25f0fbc5882f748f39d236201360c9',
 V180:'cd1a464c56538dee3caf78fe908c9658338170a9e8c4d0a58db00a61969aedfa',
 V181:'ad3a235234554a021c92a6427ad59a6725bf4059e0f91aa4804d9b3b4acc130c',
 V182:'3bfc8eefe09e2167423e3cc8c6482a471380e5e5c7ac7107f67b48655800bfeb',
 V183:'23e1a21636e42e6510faa35d1da8196656d7ee03f87cc9f799131bfa417431ee',
 V184:'c63f8ed1c9fe68d3e331971e258d2b2104da58a098ca8b2975a83c16b6356980'
};
const SHA_WORKSHEET='3f163418817efe30ee7e6493e030ea1b49cef0668faf9c3e389f9ab69ab6c949';
const EXCEPTIONS={
 'XI-U07-T071-Q010':'P114_POLYMER_EXAMPLES',
 'XI-U07-T071-Q076':'P114_POLYMER_EXAMPLES',
 'XI-U07-T071-Q069':'P114_POLYMER_EXAMPLES',
 'XI-U07-T071-Q070':'P114_POLYMER_EXAMPLES',
 'XI-U07-T071-Q041':'P115_CUBIC_CELL_FIGURE',
 'XI-U07-T071-Q043':'P115_CUBIC_CELL_FIGURE',
 'XI-U07-T071-Q045':'P115_CUBIC_CELL_FIGURE',
 'XI-U07-T071-Q056':'P115_CUBIC_CELL_FIGURE',
 'XI-U07-T071-Q057':'P115_CUBIC_CELL_FIGURE',
 'XI-U07-T072-Q057':'EXAMPLE_7_2_BONE',
 'XI-U07-T073-Q003':'ORIGINAL_FIG_7_13_WIRE'
};
const BANNED=['stem','originalStem','originalQuestion','originalQuestionText',
 'questionText','options','originalOptions','revisedStem','candidateQuestion',
 'candidateOptions','answer','answerKey','correctOption','correctOptionText',
 'keyLetter','answerLetter','fullSolution','workedSolution','explanationText',
 'privateWordBytes','rawSourceImageBytes','teacherEmail','teacherUid',
 'studentEmail','studentUid','authToken','teacherApprovalToken','authenticatedTeacherApproval'];
const isSha=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
const safe=(o,label)=>{for(const k of BANNED)A.equal(Object.hasOwn(o,k),false,'Private field forbidden at '+label+'.'+k);};
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V185');
 A.equal(d.predecessor.pr,288);
 A.equal(d.predecessor.merged,true);
 A.equal(d.predecessor.mergeSha,'cef60e7ae19d781f2e7f86f5de25603fd2d5d29d');
 A.equal(d.status,'OFFLINE_TEACHER_READINESS_ONLY_DO_NOT_DEPLOY_OR_SCORE');
 A.equal(d.userOriginalUnit7InventoryCount,274);
 A.deepEqual(d.priorFivePlusOneCandidateBatchVersions,Object.keys(FILES));
 A.equal(d.originalSourceCandidatesPrepared,72);
 A.equal(d.sourceCandidatesRemainingWithoutSeparateDraft,202);
 const worksheet=d.privatePaperWorksheet;
 A.equal(worksheet.filename,'Unit7_V185_Teacher_Approval_Readiness_Workbook_PRIVATE.docx');
 A.equal(worksheet.sha256,SHA_WORKSHEET);
 A.equal(worksheet.renderedPages,7);
 A.equal(worksheet.keyedQuestionTextIncluded,false);
 A.equal(worksheet.containsOfflineNonbindingCheckFields,true);
 A.equal(worksheet.committedToPublicRepo,false);
 A.equal(d.sourceExceptionMappedItemCount,11);
 A.deepEqual(Object.keys(d.sourceExceptionCodes),
  ['P114_POLYMER_EXAMPLES','P115_CUBIC_CELL_FIGURE','EXAMPLE_7_2_BONE','ORIGINAL_FIG_7_13_WIRE']);
 A.equal(d.sourceExceptionCodes.P114_POLYMER_EXAMPLES.printedPage,114);
 A.equal(d.sourceExceptionCodes.P115_CUBIC_CELL_FIGURE.printedPage,115);
 A.equal(d.sourceExceptionCodes.EXAMPLE_7_2_BONE.status,'NOT_UPLOADED_THIS_STAGE');
 A.equal(d.sourceExceptionCodes.ORIGINAL_FIG_7_13_WIRE.status,'PRIVATE_ACCESSIBLE_STIMULUS_NOT_APPROVED');
 A.equal(d.individualCandidateImmutableRevisionDigestsVerified,0);
 A.equal(d.individualTeacherScienceApprovals,0);
 A.equal(d.individualTeacherCognitiveApprovals,0);
 A.equal(d.individualTeacherScoringApprovals,0);
 A.equal(d.studentScoredUnit7Items,0);
 A.equal(d.approvalStages.length,8);
 const statuses=['PUBLIC_REGISTER_FINGERPRINT_ONLY','NOT_FINGERPRINTED_PER_ITEM',
  'TEACHER_PENDING','TEACHER_PENDING','NOT_AVAILABLE_NOT_GRANTED','NOT_AVAILABLE_NOT_GRANTED',
  'NOT_AVAILABLE_NOT_GRANTED','BLOCKED_V160_V161'];
 const stageNames=['SOURCE_IDENTITY','PRIVATE_CANDIDATE_ITEM_REVISION',
  'INDEPENDENT_PHYSICS_KEY_DISTRACTOR_AND_FIGURE','SUMMATIVE_SLO_AND_COGNITION',
  'INDIVIDUAL_AUTHENTICATED_TEACHER_SCIENCE_DECISION',
  'INDIVIDUAL_AUTHENTICATED_TEACHER_COGNITIVE_DECISION',
  'INDIVIDUAL_AUTHENTICATED_OWNER_SCORING_PERMISSION','LIVE_RULES_APP_CHECK_AUDITED_DEPLOYMENT_GATES'];
 for(let i=0;i<8;i++){
  const s=d.approvalStages[i];
  A.equal(s.id,stageNames[i]);A.equal(s.status,statuses[i]);
  A.equal(s.requiredForRelease,true);
 }
 A.equal(d.pendingBackendOperations.length,6);
 for(const k of ['noCurrentServerApprovalActionsImplemented','noProductionOrStagingTeacherBackendDeployed',
  'noFirebaseRulesOrRolesChanged','noQuestionBankPublished','noSensitivePrivateQuestionsOrAnswerKeysInPublicRepo'])
   A.equal(d[k],true);
 A.ok(d.nextMilestone.startsWith('V186'));
 A.equal(d.candidateRegistry.length,72);
 safe(d,'index');
 const observed=new Set(),expectedIds=new Set();
 let ix=0,exceptionCount=0;
 for(const [version,file] of Object.entries(FILES)){
  const prior=load(file),m=MAPPING[version];
  A.equal(prior.version,version);
  const sourceRows=prior[m.row];A.equal(sourceRows.length,12);
  const p=prior.privateTeacherReviewArtifact??prior.privateTeacherPack;
  A.equal(p.sha256,SHA_PACKS[version]);
  const packFilename=p.filename??p.file??p.fileName;
  A.ok(packFilename.startsWith('Unit7_'+version+'_Teacher_Review_'));
  for(const s of sourceRows){
   const r=d.candidateRegistry[ix++];
   A.equal(r.sourceId,s.id);
   A.equal(observed.has(r.sourceId),false,'Duplicated source identity '+r.sourceId);
   observed.add(r.sourceId);expectedIds.add(s.id);
   A.equal(r.topic,s[m.topic]);A.equal(r.originalQuestionNumber,s[m.num]);
   A.ok(isSha(r.originalSourceRowSha256));
   A.equal(r.originalSourceRowSha256,s[m.sha]);
   A.equal(r.priorPrivatePackVersion,version);
   A.equal(r.priorPrivatePackFile,packFilename);
   A.equal(r.priorPrivatePackSha256,SHA_PACKS[version]);
   A.equal(r.reviewIssueCategory,s[m.issue]);
   A.equal(r.provisionalSlo,s[m.slo]);
   A.equal(r.provisionalCognitive,s[m.demand]);
   A.equal(r.provisionalSloScope,m.scope?s[m.scope]:'SOURCE_REVIEW_ONLY_NOT_FINAL');
   A.equal(r.priorCandidateDocumentHasIndividualImmutableStemRevisionDigest,false);
   A.equal(r.candidateIndividualRevisionSha256,null);
   for(const f of ['existingTeacherSourceScienceApproval','existingTeacherCandidateScienceApproval',
    'existingTeacherCandidateCognitiveApproval','existingTeacherCandidateScoringApproval'])
     A.equal(r[f],'PENDING');
   const ex=EXCEPTIONS[r.sourceId]??'NO_SPECIFIC_OPEN_BOOK_PAGE_ATTESTED_IN_INDEX';
   A.equal(r.sourceException,ex);
   if(Object.hasOwn(EXCEPTIONS,r.sourceId))exceptionCount++;
   A.equal(r.secureAuthenticatedApprovalAvailable,false);
   A.equal(r.eligibleForStudentScoredUse,false);
   A.equal(r.scoredRelease,'HOLD');
   safe(r,r.sourceId);
  }
 }
 A.equal(ix,72);A.equal(observed.size,72);A.equal(exceptionCount,11);
 A.equal(d.candidateRegistry.filter(x=>x.candidateIndividualRevisionSha256===null).length,72);
}
const d=load(INDEX);validate(d);
const attack=[
 x=>x.predecessor.pr=287,
 x=>x.predecessor.mergeSha='0'.repeat(40),
 x=>x.status='PRODUCTION_READY',
 x=>x.userOriginalUnit7InventoryCount=273,
 x=>x.originalSourceCandidatesPrepared=73,
 x=>x.sourceCandidatesRemainingWithoutSeparateDraft=201,
 x=>x.priorFivePlusOneCandidateBatchVersions.pop(),
 x=>x.privatePaperWorksheet.sha256='0'.repeat(64),
 x=>x.privatePaperWorksheet.keyedQuestionTextIncluded=true,
 x=>x.privatePaperWorksheet.committedToPublicRepo=true,
 x=>x.sourceExceptionMappedItemCount=10,
 x=>x.sourceExceptionCodes.P114_POLYMER_EXAMPLES.printedPage=115,
 x=>x.sourceExceptionCodes.ORIGINAL_FIG_7_13_WIRE.status='CLEARED',
 x=>x.individualCandidateImmutableRevisionDigestsVerified=1,
 x=>x.individualTeacherScienceApprovals=1,
 x=>x.individualTeacherCognitiveApprovals=1,
 x=>x.individualTeacherScoringApprovals=1,
 x=>x.studentScoredUnit7Items=1,
 x=>x.approvalStages[1].status='SIGNED',
 x=>x.approvalStages[7].status='DEPLOYED',
 x=>x.pendingBackendOperations.pop(),
 x=>x.noCurrentServerApprovalActionsImplemented=false,
 x=>x.noProductionOrStagingTeacherBackendDeployed=false,
 x=>x.noFirebaseRulesOrRolesChanged=false,
 x=>x.noQuestionBankPublished=false,
 x=>x.noSensitivePrivateQuestionsOrAnswerKeysInPublicRepo=false,
 x=>x.candidateRegistry.pop(),
 x=>x.candidateRegistry[0].sourceId='XI-U07-T071-Q999',
 x=>x.candidateRegistry[0].originalSourceRowSha256='0'.repeat(64),
 x=>x.candidateRegistry[0].priorPrivatePackSha256='0'.repeat(64),
 x=>x.candidateRegistry[0].candidateIndividualRevisionSha256='0'.repeat(64),
 x=>x.candidateRegistry[0].priorCandidateDocumentHasIndividualImmutableStemRevisionDigest=true,
 x=>x.candidateRegistry[0].existingTeacherCandidateScienceApproval='APPROVED',
 x=>x.candidateRegistry[0].existingTeacherCandidateCognitiveApproval='APPROVED',
 x=>x.candidateRegistry[0].existingTeacherCandidateScoringApproval='APPROVED',
 x=>x.candidateRegistry[0].sourceException='SOURCE_VERIFIED',
 x=>x.candidateRegistry[0].secureAuthenticatedApprovalAvailable=true,
 x=>x.candidateRegistry[0].eligibleForStudentScoredUse=true,
 x=>x.candidateRegistry[0].scoredRelease='RELEASED',
 x=>x.candidateRegistry[0].correctOption='A',
 x=>x.nextMilestone='IMMEDIATE_SCORE_RELEASE'
];
for(const [i,m] of attack.entries()){
 const c=structuredClone(d);m(c);
 A.throws(()=>validate(c),undefined,'Release/source mutation '+(i+1)+' not rejected');
}
const memo=read(MEMO).toLowerCase().replace(/\s/g,'');
for(const k of ['V185','72','274','202','p114','p115','Example7.2',
 'teacher','pending','hold','revision','authenticated','candidate',
 'Unit7','B-24','B-27','V160','V161','V186']){
 A.ok(memo.includes(k.toLowerCase().replace(/\s/g,'')),'Missing teacher memo guard '+k);
}
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.deepEqual(load('question-bank/manifest.json').grades.find(x=>x.grade===11).units.map(x=>x.liveMcqCount),
 [275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
 'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const qa=path.join(ROOT,'qa-artifacts/grade11-v185-unit7-teacher-readiness-72');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V185',sourcesIndexed:72,sourceUniverse:274,
 offlinePrivateWorkSheetPages:7,knownSourceExceptionItems:11,
 privatePerItemRevisionDigestsVerified:0,
 teacherScienceApprovals:0,teacherCognitiveApprovals:0,
 teacherScoringApprovals:0,scoredUnit7Releases:0,
 noScoreMutationDenials:attack.length,next:'V186 isolated per-item revision protocol proof'
},null,2)+'\n');
console.log('V185 PASS: 72 source-consistent private candidates, 72 missing per-item immutable revisions, '+attack.length+' blocked mutations, ZERO authenticated approvals and ZERO scored release.');
