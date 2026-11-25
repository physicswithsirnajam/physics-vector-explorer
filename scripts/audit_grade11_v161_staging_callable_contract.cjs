#!/usr/bin/env node
'use strict';
/**
 * V161 source-only callable staging CONTRACT auditor.
 * NO onCall handler, no Firebase Admin/Functions import, no credentials,
 * no network, no deployment, and NO teacher academic signoff.
 * Validate source invariants and keep V160's twelve owner gates BLOCKED.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const CONTRACT='quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json';
const V160='quality/unit07/topic71-v160-production-readiness-no-go.json';
const V154='quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json';
const V149='quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv';
const DOC='quality/grade11-v161-teacher-staging-callable-architecture.md';
const SRC='930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58';
const QUESTIONS=[10,15,62,76];
const ITEM_IDS=QUESTIONS.map(n=>'XI-U07-T071-Q'+String(n).padStart(3,'0'));
const GATES=Array.from({length:12},(_,i)=>'G'+String(i+1).padStart(2,'0'));
const THREATS=Array.from({length:16},(_,i)=>'T'+String(i+1).padStart(2,'0'));
const THREAT_CODES=[
 'unauthenticated','unauthenticated','permission-denied','permission-denied',
 'permission-denied','permission-denied','permission-denied','invalid-argument',
 'invalid-argument','failed-precondition','already-exists','resource-exhausted',
 'unavailable','permission-denied','invalid-argument','unavailable'
];
const ERRORS=['unauthenticated','permission-denied','failed-precondition',
 'already-exists','invalid-argument','resource-exhausted','unavailable','internal'];
const PATHS={
 original:'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv',
 queue:'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json',
 blocked:'quality/unit07/topic71-v160-production-readiness-no-go.json'
};
function yes(o,name){assert.equal(o[name],true,'V161 require '+name+' true');}
function no(o,name){assert.equal(o[name],false,'V161 require '+name+' false');}
function eq(actual,expected,label){assert.deepEqual(actual,expected,label);}
function validateContract(c){
 assert.equal(c.schemaVersion,1);
 assert.equal(c.version,'V161');
 assert.equal(c.dateAsOf,'2026-11-25');
 assert.equal(c.decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 assert.equal(c.deploymentState,'SOURCE_ONLY_UNDEPLOYABLE');
 eq(c.preferredEvaluationOption,'A_KEEP_GITHUB_PAGES_WITH_PROTECTED_CALLABLE');
 assert.equal(c.firebaseProductionProjectId,'physics-with-sir-najam-portal');
 assert.equal(c.stagingFirebaseProjectId,null);
 for(const p of ['callableFunctionSourceCreated','firebaseConfigCreatedOrChanged',
  'ownerAuthorizedStagingDeploy','ownerSelectedDeploymentArchitecture',
  'ownerApprovedBlazeBilling','productionAppCheckEnforcementProven',
  'publishedProductionFirestoreRulesVerified',
  'actualTeacherRoleProvisioningApproved']){
  no(c,p);
 }
 for(const p of ['sourceTeacherApprovals','unit7ScoredReleased'])assert.equal(c[p],0);
 eq(c.sourceInputPaths,{
  ownerPrivateWordSha256:SRC,
  questionOnlyCandidate:PATHS.original,
  pendingTeacherQueue:PATHS.queue,
  previouslyVerifiedNoGo:PATHS.blocked
 });
 const t=c.conceptualTransport;
 eq(t.mechanism,'Firebase Functions v2 https.onCall (DESIGN CANDIDATE NOT IMPLEMENTED)');
 eq(t.appFacingSdk,'Firebase client httpsCallable');
 for(const p of ['requireHTTPS','nativeRequestDataOnly',
  'verifiedAuthAndAppCheckContextFromFirebaseFramework',
  'browserCannotSupplyVerifiedContext','originDoesNotContainRepositoryPath',
  'callableFunctionsDefaultCORSCannotRemainUnrestricted',
  'validateRolesServerSideBeyondSDKClaims'])
  yes(t,p);
 for(const p of ['corsProductionNotEnabledBeforeOwnerApproval',
  'serverApiDeploymentAllowed'])no(t,p);
 eq(t.originPolicy,'FIXED_EXACT_ALLOWLIST_NOT_WILDCARD');
 eq(t.productionCandidateOrigins,['https://physicswithsirnajam.github.io']);
 eq(t.stagingApprovedOrigins,[]);
 yes(t.futureOptions,'enforceAppCheck');
 eq(t.futureOptions.consumeAppCheckToken,'EVALUATE_FOR_SENSITIVE_WRITES');
 assert.equal(t.requiredRuntimeBeforeActivation.length,7);
 for(const x of t.requiredRuntimeBeforeActivation)
  assert.ok(typeof x==='string'&&x.length>20);
 const ops=c.apiOperations;
 assert.equal(ops.length,2);
 assert.equal(ops[0].id,'listTopic71ReviewCandidatesV1');
 assert.equal(ops[1].id,'recordTopic71WordingRecommendationV1');
 const list=ops[0],write=ops[1];
 eq(list.kind,'READ_ONLY_TEACHER_PREVIEW');
 eq(list.requestFields,[]);
 eq(list.responseEnvelope,'FIREBASE_CALLABLE_RESULT_DATA');
 eq(list.responseFields,['ok','count','items']);
 assert.equal(list.fixedItemCount,4);
 eq(list.fixedSourceNumbers,QUESTIONS);
 eq(list.itemResponseFields,['questionId','sourceNumber','stem','options',
  'originalSha256','candidateSha256','issue',
  'explanationRepairStillRequired','recommendation',
  'teacherAcademicSignoff','studentScoredRelease']);
 assert.equal(list.maxResponseBytes,16384);
 for(const flag of ['mayReturnAnswerKey','mayReturnOtherTeacherRecords',
  'ownerAllowsScoredPractice'])no(list,flag);
 eq(write.kind,'IMMUTABLE_ADVISORY_WRITE');
 eq(write.requestFields,['questionId','originalSha256','candidateSha256','recommendation']);
 eq(write.allowedQuestionIds,ITEM_IDS);
 eq(write.sha256Fields,['originalSha256','candidateSha256']);
 eq(write.sha256Pattern,'^[a-f0-9]{64}$');
 eq(write.recommendationValues,['supports-candidate-wording','needs-revision']);
 assert.equal(write.maxEncodedRequestBytes,512);
 eq(write.responseEnvelope,'FIREBASE_CALLABLE_RESULT_DATA');
 eq(write.responseFields,['ok','questionId','status','alreadyRecorded','academicSignoff','scoredRelease']);
 eq(write.successFixedValues,{ok:true,status:'advisory-only',
  academicSignoff:'PENDING',scoredRelease:'HOLD'});
 for(const p of ['immutablePerReviewerPerSourceRevision','atomicAuditWriteRequired',
  'retryIdenticalIdempotent','conflictingExistingRecommendationDenied',
  'staleOriginalOrCandidateRejected','serverSideRevisionLookupRequired',
  'requiresSeparateOwnerKeyApproval'])yes(write,p);
 for(const p of ['privateOriginalKeyRead','eligibleForScoredRelease'])no(write,p);
 const auth=c.authzRequirements;
 eq(auth.verificationLayer,'TRUSTED_FUTURE_BACKEND_ONLY_NOT_BROWSER_JSON');
 for(const p of ['requireFirebaseAuthValidatedByCallable',
  'requireAppCheckContextValidatedByCallable','requireCurrentAuthUserRefresh',
  'requireVerifiedEmail','requireEnabledAccount',
  'requireTrustedTeacherRole','disallowAdminAsTeacherByDefault',
  'requireAdminManagedActiveTeacherDirectory','requireServerOwnedReviewerAllowlist',
  'requireIndependentTenantClassMembershipForFutureGeneralReview',
  'requireSourceRevisionFingerprintServerLookup','forceServerRuntimeSwitchDefaultOff',
  'failClosedOnCurrentAccountDirectoryOrAppCheckErrors',
  'noCookieBasedAuthInCandidate','rejectCallerProvidedUidRoleEmailApprovalFlags',
  'doNotExposePrivateKeyedContent'])yes(auth,p);
 const data=c.dataIsolation;
 eq(data.writer,'TRUSTED_SERVER_ONLY');
 eq(data.reviewCollection,'unit07Topic71TeacherReviewPilot');
 eq(data.auditCollection,'unit07Topic71TeacherReviewPilotAudit');
 for(const p of ['firebaseWebClientDirectRead','firebaseWebClientDirectWrite',
  'privateAnswerKeyNeverInThisContract','studentAccessToReviewRecords',
  'studentEnrollmentAndAttemptsUntouched','auditAppendOnly','fullRevisionHashBound',
  'keyCorrectionAndAcademicApprovalSeparate']){
  if(['privateAnswerKeyNeverInThisContract','studentEnrollmentAndAttemptsUntouched',
   'auditAppendOnly','fullRevisionHashBound','keyCorrectionAndAcademicApprovalSeparate'].includes(p))yes(data,p);
  else no(data,p);
 }
 eq(data.immutableAuditIdempotencyKey,'sha256(questionId+sourceHash+candidateHash+reviewerUid)');
 eq(data.auditRetentionPeriod,'OWNER_APPROVAL_REQUIRED');
 eq(c.failureCodeContract,ERRORS);
 eq(c.threats.map(x=>x.id),THREATS);
 eq(c.threats.map(x=>x.expected),THREAT_CODES);
 for(const x of c.threats)
  assert.ok(typeof x.case==='string'&&x.case.length>15);
 eq(c.productionGateIdsStillBlocked,GATES);
 assert.equal(c.confirmationNotes.length,6);
 for(const s of c.confirmationNotes)assert.ok(s.length>22);
 return true;
}
function main(){
 const c=JSON.parse(fs.readFileSync(path.join(ROOT,CONTRACT),'utf8'));
 assert.ok(validateContract(c));
 const v160=JSON.parse(fs.readFileSync(path.join(ROOT,V160),'utf8'));
 const v154=JSON.parse(fs.readFileSync(path.join(ROOT,V154),'utf8'));
 const catalog=JSON.parse(fs.readFileSync(path.join(ROOT,'portal/learning-catalog.json'),'utf8'));
 const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'question-bank/manifest.json'),'utf8'));
 const doc=fs.readFileSync(path.join(ROOT,DOC),'utf8');
 eq(v160.decision,'NO_GO_DEPLOYMENT_BLOCKED');
 eq(v160.blockingGates.map(g=>g.id),GATES);
 assert.ok(v160.blockingGates.every(g=>g.status==='BLOCKED'));
 no(v160,'goLiveApproved');
 eq(v160.unit7StudentScoredMcqCount,0);
 eq(v160.sourceWordSha256,SRC);
 eq(v154.version,'V154');eq(v154.entries.length,80);
 eq(v154.teacherScienceSignoffs,0);
 eq(v154.teacherCognitiveSignoffs,0);
 eq(v154.unit7ScoredReleaseCount,0);
 const ids=v154.entries.map(r=>r.id);
 for(const id of ITEM_IDS)assert.ok(ids.includes(id));
 assert.equal(fs.readFileSync(path.join(ROOT,V149),'utf8').trimEnd().split('\n').length,80);
 eq(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 const u6=JSON.parse(fs.readFileSync(path.join(ROOT,
  'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 no(u6,'releaseApproved');eq(u6.teacherSignoff,'pending');
 const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 eq(u7.status,'planned');eq(u7.assessmentStatus,'not-published');
 eq(u7.questionBankCount,0);
 assert.ok(!fs.existsSync(path.join(ROOT,'functions/package.json')));
 assert.ok(!fs.existsSync(path.join(ROOT,'firebase.json')));
 assert.ok(!fs.existsSync(path.join(ROOT,'.firebaserc')));
 const localClient=fs.readFileSync(path.join(ROOT,'local-dev/topic71-teacher-review-v158.js'),'utf8');
 assert.ok(localClient.includes("'demo-psn-v143-classrooms'"));
 assert.ok(localClient.includes('connectAuthEmulator('));
 assert.ok(!fs.existsSync(path.join(ROOT,'portal/teacher-review-v161.js')));
 const localServer=fs.readFileSync(path.join(ROOT,
  'server/local-topic71-browser-review-v158.cjs'),'utf8');
 assert.ok(localServer.includes("const HOST='127.0.0.1'"));
 assert.ok(localServer.includes("const SWITCH='PSN_LOCAL_TOPIC71_BROWSER_REVIEW'"));
 assert.ok(localServer.includes("if(!localOnly())throw Error"));
 for(const x of ['NO-GO','not deployed','GitHub Pages','Callable',
  'onCall','App Check','CORS','Blaze','Q10','Q15','Q62','Q76',
  'G01','G12','source-only','answer key','owner','teacher','academic','Firestore']){
  assert.ok(doc.toLowerCase().includes(x.toLowerCase()),'Missing V161 documentation note: '+x);
 }
 assert.ok(!doc.includes('firebase deploy '),'Docs must not present a deploy command');
 const out=path.join(ROOT,'qa-artifacts/grade11-v161-staging-callable-contract');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
  version:'V161',contractValidated:true,
  noGoStillInEffect:true,approvedStagingDeployed:false,
  callableHandlersCreated:0,ownerDeployConsent:false,
  threatsEnumerated:16,stagingApiOperationsDesigned:2,
  ownerProductionGatesPassed:0,
  pendingAcademicReviewItems:80,unit7ScoredItems:0,
  sourceKeyPayloadsPublished:0,productionFirestoreRulesRead:false
 },null,2)+'\n');
 console.log('V161 PASS: 2 future callable contracts, 16 threat cases; staging NO-GO, 80 teacher PENDING and 0 scored Unit7 MCQs');
}
if(require.main===module){
 try{main()}catch(err){console.error('V161 FAILED:',err.stack||err);process.exitCode=1;}
}
module.exports=Object.freeze({validateContract,ITEM_IDS,THREATS,GATES});
