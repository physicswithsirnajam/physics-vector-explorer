#!/usr/bin/env node
'use strict';
/**
 * V180: 12 distinct original source-owner Grade XI U7 MCQs, private teacher
 * candidate draft Batch02. Public code only checks keyless source identity,
 * quality flags, independent past-register consistency and scored RELEASE HOLD.
 */
const A=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const INDEX='quality/unit07/unit07-v180-batch02-twelve-high-priority-source-bound-no-keys.json';
const MEMO='quality/grade11-v180-unit07-batch02-12-originals-private-candidate-teacher-qc.md';
const SRC={
 topic71:{topic:'7.1',sha:'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58',path:'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json',version:'V154',numbers:[1,30,41,43]},
 topic72:{topic:'7.2',sha:'a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada',path:'quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json',version:'V168',numbers:[7,8,15,19]},
 topic73:{topic:'7.3',sha:'f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279',path:'quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json',version:'V173',numbers:[12,24,31,42]}
};
const PACK='cd1a464c56538dee3caf78fe908c9658338170a9e8c4d0a58db00a61969aedfa';
const SLOS={
 '7.1':{1:[22,'K'],30:[22,'U'],41:[22,'U'],43:[22,'U']},
 '7.2':{7:[23,'U'],8:[23,'U'],15:[24,'A'],19:[24,'A']},
 '7.3':{12:[27,'A'],24:[28,'A'],31:[24,'A'],42:[28,'A']}
};
const TAGS={
 '7.1':['structural-classes-polycrystal-versus-polymer','multiple-grains-versus-polymer-molecules','simple-cubic-visible-corners-versus-effective-lattice-sites','face-centred-visible-points-versus-effective-lattice-sites'],
 '7.2':['shear-stress-recognition-b23-cognitive-fit','hydrostatic-volumetric-stress-slo-scope','constant-modulus-needs-linear-matching-stress-strain','shear-angle-specimen-height-symbol-Y-confusion'],
 '7.3':['linear-force-ramp-assumption-not-implied-by-elasticity','constant-stiffness-energy-scaling-requires-hooke','wire-area-comparison-b24-not-b25','energy-calculation-force-path-local-assumption']
};
const BANNED=['stem','originalStem','question','questionText','originalQuestionText',
 'candidateQuestion','revisedStem','options','originalOptions','candidateOptions',
 'keyLetter','correctOption','correctOptionText','answerLetter','answer',
 'answerKey','workedSolution','fullExplanation','originalExplanation',
 'privateSourceWord','sourceWordBytes','studentUid','studentEmail','teacherUid','teacherEmail',
 'approvalToken','authenticatedTeacherSignoff'];
const hasSHA=x=>typeof x==='string' && /^[a-f0-9]{64}$/.test(x);
function noSecrets(x,where){for(const k of BANNED)A.equal(Object.hasOwn(x,k),false,'Private payload '+where+'.'+k);}
function id(topic,n){return 'XI-U07-T0'+topic.replace('.','')+'-Q'+String(n).padStart(3,'0');}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V180');
 A.equal(d.prerequisitePR,283);
 A.equal(d.pr283MergedSha,'e7f1f0f5646d7efc78257c20ae1d7c9ff3c5565a');
 A.equal(d.selectedOriginalCount,12);
 A.equal(d.uniqueNewAgainstV179Count,12);
 A.equal(d.proposedCandidateDraftCount,12);
 A.equal(d.prevV179SelectedCount,12);
 A.equal(d.totalOriginalsReviewedInPrivateBatchCandidateProcess,24);
 A.equal(d.totalOriginalItemsInUnit7,274);
 A.equal(d.compulsoryReviewCount,12);
 A.equal(d.candidateOriginalKeyChemistryPhysicsWrongBlanketClaim,false);
 A.equal(d.sourceFullBookPagesDirectlyReopenedInThisPass,false);
 A.equal(d.pendingSourceChecks.length,3);
 A.ok(d.pendingSourceChecks[0].includes('p115'));
 A.ok(d.pendingSourceChecks[1].includes('p114'));
 A.ok(d.pendingSourceChecks[2].includes('Example 7.2'));
 const p=d.privateTeacherReviewArtifact;
 A.equal(p.filename,'Unit7_V180_Teacher_Review_Batch02_PRIVATE.docx');
 A.equal(p.sha256,PACK);A.equal(p.renderedPages,13);
 A.equal(p.originalAndSeparateCandidateIncluded,true);
 A.equal(p.committedToPublicGithub,false);
 A.equal(p.scoredBankImport,false);
 for(const k of ['originalQuestionAndKeyBytesCommitted','revisedStemOptionsOrKeyBytesCommitted',
 'sourceOwnerWordModified','teacherApprovalStoredInGithub','teacherBackendOrFirebaseEdited'])
  A.equal(d[k],false);
 A.equal(d.testBuilderScoredReleaseCount,0);
 A.equal(d.teacherScienceSignoffs,0);
 A.equal(d.teacherCognitiveSignoffs,0);
 A.equal(d.teacherScoringSignoffs,0);
 A.equal(d.decision,'PRIVATE_CANDIDATE_DRAFTS_ONLY_ORIGINALS_RETAINED_TEACHER_PENDING_NO_SCORED_RELEASE');
 A.ok(d.nextMilestone.startsWith('V181'));
 A.equal(d.itemRows.length,12);
 for(const [key,v] of Object.entries(SRC)){
  const s=d.sourceFullOriginalVerified[key];
  A.equal(s.sha256,v.sha);
  A.equal(s.referenceVersion,v.version);
  A.deepEqual(s.originalNumbers,v.numbers);
  A.ok(s.docx.endsWith('.docx'));
 }
 const expected=[];
 for(const {topic,numbers} of Object.values(SRC))
  for(const n of numbers)expected.push(id(topic,n));
 A.deepEqual(d.itemRows.map(x=>x.id),expected);
 A.equal(new Set(expected).size,12);
 const nByTopic={'7.1':0,'7.2':0,'7.3':0};
 for(let i=0;i<12;i++){
  const r=d.itemRows[i],t=r.topic,n=r.originalNumber;
  A.equal(r.id,id(t,n));
  A.ok(Object.hasOwn(SLOS,t));A.ok(Object.hasOwn(SLOS[t],n));
  A.equal(r.originalPublicRegistryVersion,t==='7.1'?'V154':t==='7.2'?'V168':'V173');
  A.ok(hasSHA(r.originalSourceRowFingerprint));
  A.equal(r.teacherQueuePriority,'COMPULSORY_SOURCE_PRECISION_OR_SLO_REVIEW');
  A.equal(r.scienceFindingCategory,TAGS[t][nByTopic[t]++]);
  A.ok(r.privateCandidateDesignTag.length>15);
  A.ok(/^P-11-B-\d+$/.test(r.originalSourceSlo));
  A.equal(r.proposedCandidateSlo,'P-11-B-'+SLOS[t][n][0]);
  A.equal(r.proposedCandidateActualCognitive,SLOS[t][n][1]);
  A.ok(r.provisionalSummativePlacement.length>12);
  A.ok(r.teacherDecisionRequired.length>40);
  A.equal(r.sourceFullOriginalDocxShaMatchedPriorLedger,true);
  A.equal(r.originalQuestionAndKeyRetainedPrivate,true);
  A.equal(r.proposedCandidateAndFullExplanationRetainedPrivate,true);
  A.equal(r.privateTeacherCandidateApproved,false);
  A.equal(r.teacherScienceApproval,'PENDING');
  A.equal(r.teacherCognitiveApproval,'PENDING');
  A.equal(r.teacherScoredReleaseApproval,'PENDING');
  A.equal(r.scoredTestBuilderRelease,'HOLD');
  noSecrets(r,r.id);
 }
 noSecrets(d,'index');
}
const d=load(INDEX);
validate(d);
const v179=load('quality/unit07/unit07-v179-batch01-twelve-source-authenticated-keyless-candidates.json');
A.equal(v179.version,'V179');A.equal(v179.itemRows.length,12);
A.equal(v179.scoredReadyQuestionCount,0);A.equal(v179.teacherScienceSignoffs,0);
const prevIds=new Set(v179.itemRows.map(x=>x.id));
A.equal(prevIds.size,12);
for(const x of d.itemRows)A.equal(prevIds.has(x.id),false,'V180 duplicate with V179 '+x.id);
// Cross-check each prior source-row SHA against *actual pre-existing public* original ledger.
for(const {topic,sha:sourceSha,path:registryPath,version,numbers} of Object.values(SRC)){
 const src=load(registryPath);
 A.equal(src.version,version);
 const originalRows=topic==='7.1'?src.entries:topic==='7.2'?src.canonicalSourceRows:src.originalRowSourceRegistry;
 A.equal(originalRows.length,80);
 const originalSourceHash=topic==='7.1'?src.sourceOriginalOwnerDocxSha256:
  topic==='7.2'?src.sourceOriginalPrivateDocxSha256:src.originalPrivateWordSha256;
 A.equal(originalSourceHash,sourceSha);
 for(const n of numbers){
  const original=originalRows.find(x=>(x.sourceNumber??x.number)===n);
  A.ok(original,'Missing original source '+topic+':'+n);
  const fp=original.originalFullRowSha256??original.sha256??original.originalPrivateFullRowSha256;
  const row=d.itemRows.find(x=>x.topic===topic&&x.originalNumber===n);
  A.equal(row.originalSourceRowFingerprint,fp);
  const originalSlo=original.officialSlo??original.originalMappedSlo??original.sourceMappedSlo;
  A.equal(row.originalSourceSlo,originalSlo);
  if(topic==='7.1'){
   A.ok(original.reviewQueuePriority.startsWith('COMPULSORY'),'Topic71 priority not compulsory');
   A.equal(original.academicScienceDecision,'PENDING');
   A.equal(original.academicCognitiveDecision,'PENDING');
   A.equal(original.eligibleForScoredStudentRelease,false);
  }else if(topic==='7.2'){
   A.ok(src.firstPassCompulsoryQuestionNumbers.includes(n));
   A.equal(original.academicTeacherReview,'PENDING');
   A.equal(original.scoredRelease,'HOLD');
  }else{
   A.ok(src.firstPassCompulsoryFlags.includes(n));
   A.equal(original.teacherScienceSignoff,'PENDING');
   A.equal(original.teacherCognitiveSignoff,'PENDING');
   A.equal(original.studentScoredRelease,'HOLD');
  }
 }
}
const v178=load('quality/unit07/unit07-v178-consolidated-274-teacher-approval-index-no-keys.json');
A.equal(v178.totalOriginalItems,274);
A.equal(v178.scoredUnit7PortalQuestions,0);
A.equal(v178.teacherScienceApprovals,0);
const v177=load('quality/unit07/unit07-v177-end-exercise-numerical01-05-image-bound-no-keys.json');
A.equal(v177.originalNumericalQuestionCount,5);
A.equal(v177.unit7ScoredPortalQuestionCount,0);
const catalog=load('portal/learning-catalog.json');
const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.deepEqual(load('question-bank/manifest.json').grades.find(g=>g.grade===11)
 .units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
 'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const modifications=[
 x=>x.prerequisitePR=282,
 x=>x.pr283MergedSha='0'.repeat(40),
 x=>x.sourceFullOriginalVerified.topic71.sha256='0'.repeat(64),
 x=>x.sourceFullOriginalVerified.topic72.originalNumbers=[7,8,15,20],
 x=>x.privateTeacherReviewArtifact.sha256='0'.repeat(64),
 x=>x.privateTeacherReviewArtifact.committedToPublicGithub=true,
 x=>x.selectedOriginalCount=13,
 x=>x.uniqueNewAgainstV179Count=11,
 x=>x.totalOriginalsReviewedInPrivateBatchCandidateProcess=25,
 x=>x.compulsoryReviewCount=11,
 x=>x.itemRows.pop(),
 x=>x.itemRows[0].id='XI-U07-T071-Q010',
 x=>x.itemRows[1].originalSourceRowFingerprint='0'.repeat(64),
 x=>x.itemRows[2].scienceFindingCategory='ignored',
 x=>x.itemRows[3].proposedCandidateActualCognitive='A',
 x=>x.itemRows[8].proposedCandidateSlo='P-11-B-28',
 x=>x.itemRows[10].originalSourceSlo='P-11-B-28',
 x=>x.itemRows[7].teacherDecisionRequired='unclear',
 x=>x.itemRows[5].originalQuestionAndKeyRetainedPrivate=false,
 x=>x.itemRows[0].candidateQuestion='private original',
 x=>x.itemRows[0].privateTeacherCandidateApproved=true,
 x=>x.itemRows[0].teacherScienceApproval='APPROVED',
 x=>x.itemRows[0].teacherCognitiveApproval='APPROVED',
 x=>x.itemRows[0].teacherScoredReleaseApproval='APPROVED',
 x=>x.itemRows[0].scoredTestBuilderRelease='RELEASED',
 x=>x.originalQuestionAndKeyBytesCommitted=true,
 x=>x.revisedStemOptionsOrKeyBytesCommitted=true,
 x=>x.teacherApprovalStoredInGithub=true,
 x=>x.teacherBackendOrFirebaseEdited=true,
 x=>x.testBuilderScoredReleaseCount=12,
 x=>x.teacherScienceSignoffs=12,
 x=>x.teacherCognitiveSignoffs=12,
 x=>x.teacherScoringSignoffs=12,
 x=>x.decision='SCORED_APPROVED'
];
for(const [i,mutate] of modifications.entries()){
 const v=structuredClone(d);mutate(v);
 A.throws(()=>validate(v),undefined,'Mutation '+(i+1)+' weakened academic/source restriction');
}
const memo=read(MEMO);
for(const phrase of ['V180','12','V179','Q1','Q30','Q41','Q43','Q7','Q8','Q15','Q19','Q12','Q24','Q31','Q42','B-22','B-23','B-24','B-27','B-28',
 'p115','p114','Example 7.2','PRIVATE','PENDING','HOLD','teacher']){
 A.ok(memo.toLowerCase().includes(phrase.toLowerCase()),'Missing memo content '+phrase);
}
const dir=path.join(ROOT,'qa-artifacts/grade11-v180-unit7-teacher-batch02');
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({
 version:'V180',firstPassOriginalSourceRows:12,privateCandidateDrafts:12,
 V179SourceRows:12,V180UniqueRows:12,distinctPrivateCandidateRowsCumulative:24,
 disputedSourceIdentityRows:0,compulsoryReviewPriorityRows:12,
 teacherScienceApprovals:0,teacherCognitiveApprovals:0,teacherScoringApprovals:0,
 portalScoredReleases:0,failClosedMutationDenials:modifications.length,
 next:'V181 a further 20-or-fewer item teacher review tranche'
},null,2)+'\n');
console.log('V180 PASS: 12 new exact-registered private original owner rows, distinct from 12 V179; '+modifications.length+' negative academic release mutations rejected; ZERO scored Unit7.');
