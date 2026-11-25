#!/usr/bin/env node
'use strict';
/**
 * V161 OFFLINE mutation tests for the callable design record.
 * No Firebase emulator, Cloud Function, real credentials or deployed API.
 * These checks prove contract invariants only; NOT production authorization.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {validateContract,THREATS,ITEM_IDS,GATES}=
 require('./audit_grade11_v161_staging_callable_contract.cjs');
const ROOT=path.resolve(__dirname,'..');
const file=path.join(ROOT,'quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json');
const original=fs.readFileSync(file,'utf8'),contract=JSON.parse(original);
const clone=()=>structuredClone(contract);
let mutationsRejected=0;
function reject(label,fn){
 const object=clone();
 fn(object);
 assert.throws(()=>validateContract(object),
  undefined,'Weakened contract was accepted: '+label);
 mutationsRejected++;
}
function pass(label){console.log('V161 SELFTEST PASS: '+label);}
assert.equal(validateContract(contract),true);
assert.deepEqual(THREATS,Array.from({length:16},(_,i)=>'T'+String(i+1).padStart(2,'0')));
assert.deepEqual(GATES,Array.from({length:12},(_,i)=>'G'+String(i+1).padStart(2,'0')));
assert.deepEqual(ITEM_IDS,['XI-U07-T071-Q010','XI-U07-T071-Q015',
 'XI-U07-T071-Q062','XI-U07-T071-Q076']);
pass('baseline V161 design contract accepted');

const cases=[
 ['declare live deployment',p=>p.decision='GO_STAGING'],
 ['allow owner consent by changing JSON',p=>p.ownerAuthorizedStagingDeploy=true],
 ['approve owner architecture without consent',p=>p.ownerSelectedDeploymentArchitecture=true],
 ['claim fake paid billing approval',p=>p.ownerApprovedBlazeBilling=true],
 ['pretend live production App Check enforced',p=>p.productionAppCheckEnforcementProven=true],
 ['pretend production Rules independently verified',p=>p.publishedProductionFirestoreRulesVerified=true],
 ['claim live teacher roles issued',p=>p.actualTeacherRoleProvisioningApproved=true],
 ['declare handlers created',p=>p.callableFunctionSourceCreated=true],
 ['declare staging Firebase project',p=>p.stagingFirebaseProjectId='any'],
 ['allow student scored release',p=>p.unit7ScoredReleased=1],
 ['allow teacher academic approval',p=>p.sourceTeacherApprovals=4],
 ['change owner original Word fingerprint',p=>p.sourceInputPaths.ownerPrivateWordSha256='0'.repeat(64)],
 ['include function in trusted browser',p=>p.conceptualTransport.browserCannotSupplyVerifiedContext=false],
 ['drop HTTPS',p=>p.conceptualTransport.requireHTTPS=false],
 ['trust client-provided claims',p=>p.authzRequirements.rejectCallerProvidedUidRoleEmailApprovalFlags=false],
 ['allow anonymous Auth context',p=>p.authzRequirements.requireFirebaseAuthValidatedByCallable=false],
 ['turn off App Check',p=>p.conceptualTransport.futureOptions.enforceAppCheck=false],
 ['let browser submit unsupported Origin',p=>p.conceptualTransport.originPolicy='ANY_ORIGIN'],
 ['wildcard CORS',p=>p.conceptualTransport.productionCandidateOrigins=['*']],
 ['treat GitHub repository path as Origin',p=>p.conceptualTransport.productionCandidateOrigins=['https://physicswithsirnajam.github.io/physics-vector-explorer']],
 ['fake staging origin approval',p=>p.conceptualTransport.stagingApprovedOrigins=['https://preview.fake.example']],
 ['allow wildcard callable CORS default',p=>p.conceptualTransport.callableFunctionsDefaultCORSCannotRemainUnrestricted=false],
 ['turn callable endpoint on by config',p=>p.conceptualTransport.serverApiDeploymentAllowed=true],
 ['permit source review without revision validation',p=>p.authzRequirements.requireSourceRevisionFingerprintServerLookup=false],
 ['permit stale candidate after edit',p=>p.apiOperations[1].staleOriginalOrCandidateRejected=false],
 ['add user UID to client request',p=>p.apiOperations[1].requestFields.push('uid')],
 ['add answer to returned list items',p=>p.apiOperations[0].itemResponseFields.push('correctOption')],
 ['add original keyed answer to recommendation result',p=>p.apiOperations[1].responseFields.push('originalAnswerLetter')],
 ['accept new nonapproved question',p=>p.apiOperations[1].allowedQuestionIds.push('XI-U07-T071-Q020')],
 ['mark answer approval returned on write',p=>p.apiOperations[1].successFixedValues.academicSignoff='APPROVED'],
 ['mark scoring enabled on write',p=>p.apiOperations[1].successFixedValues.scoredRelease='RELEASED'],
 ['allow answer-key read',p=>p.apiOperations[1].privateOriginalKeyRead=true],
 ['permit student answer scoring',p=>p.apiOperations[1].eligibleForScoredRelease=true],
 ['allow anonymous teacher access',p=>p.authzRequirements.requireTrustedTeacherRole=false],
 ['remove fresh user status verification',p=>p.authzRequirements.requireCurrentAuthUserRefresh=false],
 ['admin automatically treated as teacher',p=>p.authzRequirements.disallowAdminAsTeacherByDefault=false],
 ['drop reviewer allowlist',p=>p.authzRequirements.requireServerOwnedReviewerAllowlist=false],
 ['turn off server feature flag',p=>p.authzRequirements.forceServerRuntimeSwitchDefaultOff=false],
 ['enable direct Firestore browser reads',p=>p.dataIsolation.firebaseWebClientDirectRead=true],
 ['enable direct Firestore browser writes',p=>p.dataIsolation.firebaseWebClientDirectWrite=true],
 ['enable student access to private review',p=>p.dataIsolation.studentAccessToReviewRecords=true],
 ['disable atomic audit',p=>p.apiOperations[1].atomicAuditWriteRequired=false],
 ['allow overwrite of recommendation',p=>p.apiOperations[1].conflictingExistingRecommendationDenied=false],
 ['disable reviewer version bound',p=>p.apiOperations[1].immutablePerReviewerPerSourceRevision=false],
 ['swap source review for academic release',p=>p.apiOperations[1].kind='PUBLISH_SCORED_MCQ'],
 ['drop teacher key approval separation',p=>p.apiOperations[1].requiresSeparateOwnerKeyApproval=false],
 ['remove source-science denial threat',p=>p.threats=p.threats.filter(t=>t.id!=='T15')],
 ['change wrong-origin denial to success',p=>p.threats.find(t=>t.id==='T07').expected='success'],
 ['change exhausted-rate denial',p=>p.threats.find(t=>t.id==='T12').expected='ok'],
 ['unblock gate G04',p=>p.productionGateIdsStillBlocked=p.productionGateIdsStillBlocked.filter(x=>x!=='G04')],
 ['modify error schema to unknown',p=>p.failureCodeContract.push('approved')],
 ['allow missing admin-controlled directory',p=>p.authzRequirements.requireAdminManagedActiveTeacherDirectory=false],
 ['trust raw browser-provided token as verified',p=>p.conceptualTransport.verifiedAuthAndAppCheckContextFromFirebaseFramework=false],
 ['skip revocation on disabled account',p=>p.authzRequirements.requireEnabledAccount=false],
 ['send teacher audit to client',p=>p.apiOperations[0].mayReturnOtherTeacherRecords=true],
 ['accept arbitrary ID text',p=>p.apiOperations[1].sha256Pattern='.*'],
 ['weak source version failure behavior',p=>p.apiOperations[1].serverSideRevisionLookupRequired=false],
 ['allow cookie auth without CSRF',p=>p.authzRequirements.noCookieBasedAuthInCandidate=false]
];
for(const [label,mutator] of cases)reject(label,mutator);
assert.ok(mutationsRejected>=55);
pass(mutationsRejected+' weaker-contract mutations rejected');

const pathChecks=[
 'portal/firebase-config.js','portal/app.js',
 'portal/recaptcha-enterprise-v100m.mjs',
 'local-dev/topic71-teacher-review-v158.js',
 'server/local-topic71-teacher-review-pilot-v155.cjs',
 'server/local-topic71-browser-review-v158.cjs',
 'quality/unit07/topic71-v160-production-readiness-no-go.json'
];
for(const p of pathChecks)assert.ok(fs.existsSync(path.join(ROOT,p)),'Missing original scope: '+p);
assert.equal(fs.readFileSync(file,'utf8'),original);
assert.ok(!fs.existsSync(path.join(ROOT,'functions/package.json')));
assert.ok(!fs.existsSync(path.join(ROOT,'firebase.json')));
assert.ok(!fs.existsSync(path.join(ROOT,'.firebaserc')));
pass('no production handler, hosting config or deploy has been created');
console.log('V161 SELFTEST FINISHED: '+mutationsRejected+
 ' security-denial mutations checked, 0 network requests and 0 backend changes');
