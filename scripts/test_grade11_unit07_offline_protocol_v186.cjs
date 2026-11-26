#!/usr/bin/env node
'use strict';
/**
 * All candidate text, reviewers, permissions and evidence in this file are
 * INVENTED SYNTHETIC fixtures. No source owner MCQs or private answer keys.
 * No Firebase connection, no real authentication, no production approvals.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const crypto=require('node:crypto');
const {VERSION,canonicalCandidate,revisionSha256,createSyntheticReviewHarness,verifySyntheticAudit}
 =require('./unit07_offline_revision_protocol_v186.cjs');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const SRC='1'.repeat(64),EVID='2'.repeat(64),EVID2='3'.repeat(64),IMAGE='4'.repeat(64),LICENSE='5'.repeat(64);
const fake={
 sourceId:'XI-U07-T071-Q001',sourceSha256:SRC,
 stem:'SYNTHETIC EXAMPLE ONLY: Which option is marked as the test choice?',
 options:{A:'Synthetic choice one',B:'Synthetic choice two',C:'Synthetic choice three',D:'Synthetic choice four'},
 correctOption:'A',explanation:'Synthetic explanation for testing revision integrity only.',
 slo:'P-11-B-22',cognitive:'K',diagram:null
};
const directory={sam_teacher:{role:'science',active:true},cora_teacher:{role:'cognitive',active:true},
 owen_owner:{role:'owner',active:true},inactive_teacher:{role:'science',active:false}};
const revision=revisionSha256(fake);
A.equal(VERSION,'PWSN-U07-CANDIDATE-V1');
A.match(revision,/^[a-f0-9]{64}$/);
const reordered={diagram:null,cognitive:'K',slo:fake.slo,explanation:fake.explanation,
 correctOption:'A',options:{D:fake.options.D,C:fake.options.C,B:fake.options.B,A:fake.options.A},
 stem:fake.stem,sourceSha256:SRC,sourceId:fake.sourceId};
A.equal(revisionSha256(reordered),revision,'serialization key ordering must be canonical');
A.equal(JSON.stringify(canonicalCandidate(reordered)),JSON.stringify(canonicalCandidate(fake)));
const changedStem={...fake,stem:fake.stem+' Changed.'};
const changedOption={...fake,options:{...fake.options,B:'Changed choice'}};
const changedKey={...fake,correctOption:'B'};
const changedExplanation={...fake,explanation:fake.explanation+' Rechecked.'};
const changedCognition={...fake,cognitive:'U'};
const changedSlo={...fake,slo:'P-11-B-23'};
const changedImage={...fake,diagram:{contentSha256:IMAGE,altText:'Synthetic diagram description',permissionEvidenceSha256:LICENSE}};
for(const c of [changedStem,changedOption,changedKey,changedExplanation,changedCognition,changedSlo,changedImage])
 A.notEqual(revisionSha256(c),revision,'substantive revision must change SHA');
A.equal(revisionSha256({...fake,stem:fake.stem.replace('EXAMPLE','EXAMPLE').replace(/\n/g,'\r\n')}),revision);
const nfc={...fake,stem:'SYNTHETIC TEST: caf\u00e9 is normalized before hashing.'};
const nfd={...nfc,stem:'SYNTHETIC TEST: cafe\u0301 is normalized before hashing.'};
A.equal(revisionSha256(nfc),revisionSha256(nfd));
const corrupted=[
 {...fake,sourceId:'XI-U07-T071-Q999'},
 {...fake,sourceSha256:'0'},
 {...fake,stem:fake.stem+' '},
 {...fake,options:{...fake.options,D:fake.options.A}},
 {...fake,options:{A:'Only one option'}},
 {...fake,correctOption:'E'},
 {...fake,explanation:'short'},
 {...fake,slo:'P-11-B-39'},
 {...fake,cognitive:'X'},
 {...fake,diagram:{contentSha256:IMAGE,altText:'unapproved',permissionEvidenceSha256:'0'}},
 {...fake,diagram:{contentSha256:IMAGE,altText:'Synthetic description',permissionEvidenceSha256:LICENSE,secret:'leak'}},
 {...fake,teacherApproved:true},
 {...fake,sourceId:'XI-U07-T071-Q000'},
 {...fake,stem:null}
];
let denied=0;
for(const x of corrupted){A.throws(()=>revisionSha256(x),/V186_DENIED/);denied++;}
A.throws(()=>createSyntheticReviewHarness(fake,{self:{role:'admin',active:true}}),/V186_DENIED/);denied++;
const h=createSyntheticReviewHarness(fake,directory);
const cmd=(action,revisionSha256=revision,more={})=>({action,sourceId:fake.sourceId,revisionSha256,...more});
function reject(actor,c){A.throws(()=>h.dispatch(actor,c),/V186_DENIED/);denied++;}
reject('unknown_teacher',cmd('source-check',revision,{evidenceSha256:EVID}));
reject('inactive_teacher',cmd('source-check',revision,{evidenceSha256:EVID}));
reject('cora_teacher',cmd('source-check',revision,{evidenceSha256:EVID}));
reject('sam_teacher',cmd('science-approve',revision,{evidenceSha256:EVID}));
reject('owen_owner',cmd('owner-authorize',revision,{evidenceSha256:EVID}));
reject('sam_teacher',{...cmd('source-check',revision,{evidenceSha256:EVID}),role:'owner'});
reject('sam_teacher',cmd('source-check','0'.repeat(64),{evidenceSha256:EVID}));
reject('sam_teacher',cmd('source-check',revision,{evidenceSha256:'not-sha'}));
reject('sam_teacher',cmd('unrecognized-action',revision,{evidenceSha256:EVID}));
A.equal(h.snapshot().studentScoringEligible,false);
h.dispatch('sam_teacher',cmd('source-check',revision,{evidenceSha256:EVID}));
reject('sam_teacher',cmd('source-check',revision,{evidenceSha256:EVID}));
reject('cora_teacher',cmd('cognitive-approve',revision,{evidenceSha256:EVID2}));
h.dispatch('sam_teacher',cmd('science-approve',revision,{evidenceSha256:EVID2}));
reject('sam_teacher',cmd('science-approve',revision,{evidenceSha256:EVID2}));
reject('sam_teacher',cmd('cognitive-approve',revision,{evidenceSha256:EVID2}));
reject('sam_teacher',cmd('owner-authorize',revision,{evidenceSha256:EVID2}));
h.dispatch('cora_teacher',cmd('cognitive-approve',revision,{evidenceSha256:EVID2}));
reject('cora_teacher',cmd('owner-authorize',revision,{evidenceSha256:EVID}));
h.dispatch('owen_owner',cmd('owner-authorize',revision,{evidenceSha256:EVID}));
A.equal(h.snapshot().ownerRecorded,true);
A.equal(h.snapshot().studentScoringEligible,false,'even all synthetic stages cannot score');
A.deepEqual(h.eligibility(),{eligible:false,reason:'LOCAL_SYNTHETIC_ONLY_NO_AUTH_APP_CHECK_OR_DEPLOYMENT'});
A.equal(verifySyntheticAudit(h.audit()),true);
const adulterated=h.audit();adulterated[0].action='fake';A.equal(verifySyntheticAudit(adulterated),false);denied++;
reject('owen_owner',cmd('revoke',revision,{reasonCode:'x'}));
h.dispatch('owen_owner',cmd('revoke',revision,{reasonCode:'Synthetic science decision withdrawn'}));
A.equal(h.snapshot().revoked,true);
A.equal(h.snapshot().scienceRecorded,false);
reject('sam_teacher',cmd('source-check',revision,{evidenceSha256:EVID}));
A.equal(verifySyntheticAudit(h.audit()),true);
reject('owen_owner',cmd('supersede',revision,{newCandidate:fake}));
reject('owen_owner',cmd('supersede',revision,{newCandidate:{...changedStem,sourceSha256:'2'.repeat(64)}}));
h.dispatch('owen_owner',cmd('supersede',revision,{newCandidate:changedStem}));
const newRevision=revisionSha256(changedStem);
A.equal(h.snapshot().revisionSha256,newRevision);
A.equal(h.snapshot().revoked,false);
A.equal(h.snapshot().sourceCheckRecorded,false);
A.equal(h.snapshot().scienceRecorded,false);
A.equal(h.snapshot().cognitiveRecorded,false);
A.equal(h.snapshot().ownerRecorded,false);
reject('sam_teacher',cmd('source-check',revision,{evidenceSha256:EVID}));
h.disableSyntheticActor('sam_teacher');
reject('sam_teacher',cmd('source-check',newRevision,{evidenceSha256:EVID}));
A.equal(h.snapshot().scoredRelease,'HOLD');
A.equal(verifySyntheticAudit(h.audit()),true);
const tamperDigest=h.audit();tamperDigest.at(-1).digest='0'.repeat(64);
A.equal(verifySyntheticAudit(tamperDigest),false);denied++;
// Also verify the REAL published source metadata stays keyless, pending and
// free of any per-item candidate revision hashes; no private text read.
const v185=load('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
A.equal(v185.version,'V185');
A.equal(v185.candidateRegistry.length,72);
A.equal(new Set(v185.candidateRegistry.map(x=>x.sourceId)).size,72);
A.equal(v185.individualCandidateImmutableRevisionDigestsVerified,0);
A.equal(v185.individualTeacherScienceApprovals,0);
A.equal(v185.individualTeacherCognitiveApprovals,0);
A.equal(v185.individualTeacherScoringApprovals,0);
A.equal(v185.studentScoredUnit7Items,0);
for(const r of v185.candidateRegistry){
 A.equal(r.candidateIndividualRevisionSha256,null);
 A.equal(r.secureAuthenticatedApprovalAvailable,false);
 A.equal(r.eligibleForStudentScoredUse,false);
 A.equal(r.scoredRelease,'HOLD');
}
const v160=load('quality/unit07/topic71-v160-production-readiness-no-go.json');
const v161=load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json');
A.equal(v160.decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(v161.decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
A.equal(v160.ownerDeploymentConsent,false);
A.equal(v161.ownerAuthorizedStagingDeploy,false);
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');
A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.deepEqual(load('question-bank/manifest.json').grades.find(x=>x.grade===11).units.map(x=>x.liveMcqCount),
 [275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
const spec=load('quality/unit07/unit07-v186-offline-protocol-design-no-deploy.json');
A.equal(spec.version,'V186');A.equal(spec.status,'LOCAL_SYNTHETIC_TEST_PROTOCOL_ONLY');
A.equal(spec.originalUnit7Items,274);A.equal(spec.privateCandidateSourceItems,72);
A.equal(spec.actualIndividualCandidateDigestsStored,0);
A.equal(spec.realTeacherScienceApprovals,0);A.equal(spec.realTeacherCognitiveApprovals,0);
A.equal(spec.realOwnerScoringPermissions,0);A.equal(spec.scoredUnit7Releases,0);
for(const x of ['firebaseEdited','productionOrStagingRuntimeAdded','liveScoredBankEdited',
 'realTeacherAccountsProvisioned','originalQuestionsOrKeysIncludedInPublicRepo'])
 A.equal(spec[x],false);
A.equal(spec.syntheticExperiment.studentScoreFunctionAlwaysHold,true);
A.equal(spec.syntheticExperiment.validatedAuthOrAppCheck,false);
A.equal(spec.syntheticExperiment.auditChainIsServerSigned,false);
const memo=read('quality/grade11-v186-unit07-offline-immutable-revision-review-qc.md').toLowerCase();
for(const word of ['v186','72','274','synthetic','no-go','revocation','source',
 'app check','source revision','sha-256','pending','hold','firestore','teacher']){
 A.ok(memo.includes(word),'V186 memo missing '+word);
}
const qa=path.join(ROOT,'qa-artifacts/grade11-v186-offline-teacher-protocol');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V186',testedWithSyntheticOnly:true,
 sourcePrivateCandidateCount:72,individualActualPrivateRevisionDigests:0,
 syntheticNegativeCases:denied,
 realTeacherScienceApprovals:0,realTeacherCognitiveApprovals:0,
 realOwnerScoringApprovals:0,studentScoredUnit7Items:0,
 isolation:'NO_FIREBASE_NO_PRODUCTION_NO_STAGING'
},null,2)+'\n');
console.log('V186 PASS: synthetic-only immutable revision canonicalization/revocation; '+denied+' denied cases; 72 actual source candidates still PENDING, ZERO scored.');
