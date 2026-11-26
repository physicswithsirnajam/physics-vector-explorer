#!/usr/bin/env node
'use strict';
/**
 * V182 — 12 exact-owner-source Unit7 original MCQs, separate PRIVATE candidate
 * pack, public keyless record only. This source-science review is NOT teacher
 * authentication or student scoring authorization.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const load=p=>JSON.parse(read(p));
const INDEX='quality/unit07/unit07-v182-batch04-twelve-originals-private-candidates-keyless.json';
const MEMO='quality/grade11-v182-unit07-batch04-12-private-teacher-review-qc.md';
const SRC={
 '7.2':{
   path:'quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json',
   version:'V168',fileSha:'a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada',
   nums:[38,51,52,53,54,76],slo:[23,24,24,24,24,23],dem:['U','A','A','A','A','U'],
   scope:['direct-candidate-pending','direct-candidate-pending','direct-candidate-pending',
          'direct-candidate-pending','supporting-cross-slo-not-direct-b24','direct-candidate-pending'],
   issues:['external-shelf-figure-and-sagging-stress',
     'circular-area-only-does-not-demonstrate-young-modulus',
     'area-unit-conversion-only-supporting',
     'shear-modulus-computation-is-not-named-young-modulus',
     'bulk-modulus-hydrostatic-not-direct-b24',
     'external-torsion-figure-not-available-in-standalone-test']},
 '7.3':{
   path:'quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json',
   version:'V173',fileSha:'f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279',
   nums:[6,7,18,19,65,70],slo:[25,27,25,25,27,27],dem:['U','A','U','U','A','A'],
   scope:['experiment-method-candidate-provisional','direct-candidate-pending',
          'experiment-method-candidate-provisional','experiment-error-candidate-cognitive-review',
          'direct-candidate-pending','direct-candidate-pending'],
   issues:['formula-recognition-not-experiment-method-demonstration',
     'vertical-axis-recognition-not-work-area-application',
     'stationary-mass-weight-recall-and-duplicate',
     'circular-area-formula-only-not-full-experimental-description',
     'proportional-range-recognition-not-work-integration',
     'stiffness-gradient-not-work-area']}
};
const PACK_SHA='3bfc8eefe09e2167423e3cc8c6482a471380e5e5c7ac7107f67b48655800bfeb';
const BANNED=['stem','originalStem','originalQuestion','questionText','originalQuestionText',
 'options','sourceOptions','candidateQuestion','candidateOptions','revisedStem',
 'answer','answerLetter','keyLetter','correctOption','correctOptionText',
 'workedSolution','fullExplanation','originalExplanation','privateSourceWordBytes',
 'sourceImageBytes','teacherEmail','teacherUid','studentEmail','studentUid','approvalToken'];
const id=(t,n)=>'XI-U07-T0'+t.replace('.','')+'-Q'+String(n).padStart(3,'0');
const isHash=x=>typeof x==='string' && /^[a-f0-9]{64}$/.test(x);
function noPrivate(o,label){
 for(const field of BANNED)A.equal(Object.hasOwn(o,field),false,label+' cannot include '+field);
}
function verify(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V182');
 A.equal(d.prerequisite.prNumber,285);
 A.equal(d.prerequisite.mergedSha,'2951c7e671722e1e1419bd9d010e22d2487a81f9');
 A.deepEqual(d.previousCandidateCounts,{v179:12,v180:12,v181:12,totalDistinct:36});
 A.equal(d.sourceOriginalUnit7ItemCount,274);
 A.equal(d.thisBatchDistinctOriginalCount,12);A.equal(d.cumulativeDistinctPrivateCandidateCount,48);
 A.equal(d.sourceOriginalNbfFullPdfReopenedThisPass,false);
 A.equal(d.unresolvedOriginalBookSourceChecks.length,3);
 A.ok(d.unresolvedOriginalBookSourceChecks[0].includes('p114'));
 A.ok(d.unresolvedOriginalBookSourceChecks[1].includes('p115'));
 A.ok(d.unresolvedOriginalBookSourceChecks[2].includes('Example 7.2'));
 const p=d.privateTeacherReviewArtifact;
 A.equal(p.filename,'Unit7_V182_Teacher_Review_Batch04_PRIVATE.docx');
 A.equal(p.sha256,PACK_SHA);A.equal(p.renderedPageCount,13);
 A.equal(p.originalAndProposedCandidateWithSeparateKeys,true);
 A.equal(p.uploadedToPublicGitHub,false);
 A.equal(p.automaticallyApprovedOrImported,false);
 A.equal(d.academicDecision,'PRIVATE_REVIEW_CANDIDATES_READY_NO_AUTHENTICATED_TEACHER_SIGNOFF_HOLD_SCORED_RELEASE');
 for(const k of ['originalPrivateSourceWordEdited','copyrightedSourceTextInGithub','revisedStemsOptionsKeysInGithub',
                  'firebaseOrTeacherBackendEdited','liveGrade11QuestionBankChanged'])
   A.equal(d[k],false);
 for(const k of ['teacherScienceSignoffs','teacherCognitiveSignoffs','teacherScoringSignoffs',
                  'unit7ScoredQuestionCount'])A.equal(d[k],0);
 A.ok(d.nextMilestone.startsWith('V183'));
 A.equal(d.reviewerQueueDistinctSourceItems.length,12);
 noPrivate(d,'index');
 let j=0;
 for(const topic of ['7.2','7.3']){
  const s=SRC[topic],info=d.sourceFullOriginalVerified[topic==='7.2'?'topic72':'topic73'];
  A.equal(info.actualSourceFileSha256,s.fileSha);A.equal(info.previousRegister,s.version);
  A.deepEqual(info.selectedNumbers,s.nums);
  A.ok(info.sourceDocx.endsWith('.docx'));
  const prior=load(s.path);
  A.equal(prior.version,s.version);
  A.equal(topic==='7.2'?prior.sourceOriginalPrivateDocxSha256:prior.originalPrivateWordSha256,s.fileSha);
  const rows=topic==='7.2'?prior.canonicalSourceRows:prior.originalRowSourceRegistry;
  A.equal(rows.length,80);
  for(let k=0;k<6;k++){
   const n=s.nums[k],r=d.reviewerQueueDistinctSourceItems[j++];
   const source=rows.find(x=>(x.sourceNumber??x.number)===n);
   A.ok(source,'Missing original row '+topic+':'+n);
   const sourceSha=source.sha256??source.originalPrivateFullRowSha256;
   A.equal(r.id,id(topic,n));A.equal(r.topic,topic);A.equal(r.sourceNumber,n);
   A.equal(r.originalPublicRegister,s.version);
   A.ok(isHash(r.originalFullRowSha256));
   A.equal(r.originalFullRowSha256,sourceSha);
   A.equal(r.originalSlo,source.originalMappedSlo??source.sourceMappedSlo);
   A.equal(r.originalAuthorCognitive,source.originalCognitiveCode??source.sourceAuthorDemand);
   A.equal(r.candidateSlo,'P-11-B-'+s.slo[k]);
   A.equal(r.candidateActualCognitiveProvisional,s.dem[k]);
   A.equal(r.provisionalSummativeScope,s.scope[k]);
   A.equal(r.scienceIssueCategory,s.issues[k]);
   A.ok(r.privateCandidateDesignTag.length>16);
   A.ok(r.teacherDecisionRequired.length>55);
   A.equal(r.originalSourceAndKeyPreserved,true);
   A.equal(r.candidateQuestionAndAnswerPrivate,true);
   A.equal(r.teacherScienceSignoff,'PENDING');
   A.equal(r.teacherCognitiveSignoff,'PENDING');
   A.equal(r.teacherScoringSignoff,'PENDING');
   A.equal(r.scoredRelease,'HOLD');
   if(topic==='7.2'){
    A.ok(prior.firstPassCompulsoryQuestionNumbers.includes(n));
    A.equal(source.academicTeacherReview,'PENDING');
    A.equal(source.scoredRelease,'HOLD');
   }else{
    A.ok(prior.firstPassCompulsoryFlags.includes(n));
    A.equal(source.teacherScienceSignoff,'PENDING');
    A.equal(source.teacherCognitiveSignoff,'PENDING');
    A.equal(source.studentScoredRelease,'HOLD');
   }
   noPrivate(r,r.id);
  }
 }
 A.equal(new Set(d.reviewerQueueDistinctSourceItems.map(x=>x.id)).size,12);
}
const d=load(INDEX);verify(d);
const v179=load('quality/unit07/unit07-v179-batch01-twelve-source-authenticated-keyless-candidates.json');
const v180=load('quality/unit07/unit07-v180-batch02-twelve-high-priority-source-bound-no-keys.json');
const v181=load('quality/unit07/unit07-v181-batch03-twelve-originals-private-candidates-keyless.json');
const previous=[...v179.itemRows,...v180.itemRows,...v181.itemRows].map(x=>x.id);
A.equal(previous.length,36);A.equal(new Set(previous).size,36);
const previousSet=new Set(previous);
for(const r of d.reviewerQueueDistinctSourceItems)A.equal(previousSet.has(r.id),false,'Original repeated from V179-V181 '+r.id);
const v178=load('quality/unit07/unit07-v178-consolidated-274-teacher-approval-index-no-keys.json');
A.equal(v178.totalOriginalItems,274);A.equal(v178.scoredUnit7PortalQuestions,0);
A.equal(v179.teacherScienceSignoffs,0);A.equal(v180.teacherScienceSignoffs,0);
A.equal(v181.teacherScienceSignoffs,0);A.equal(v181.scoredUnit7Count,0);
const catalog=load('portal/learning-catalog.json');
const unit7=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(unit7.status,'planned');A.equal(unit7.assessmentStatus,'not-published');
A.equal(unit7.questionBankCount,0);
A.equal(fs.existsSync(path.join(root,'question-bank/grade-11/unit-07.json')),false);
A.deepEqual(load('question-bank/manifest.json').grades.find(x=>x.grade===11).units.map(u=>u.liveMcqCount),
 [275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
 'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const mutants=[
 x=>x.prerequisite.prNumber=284,
 x=>x.prerequisite.mergedSha='0'.repeat(40),
 x=>x.thisBatchDistinctOriginalCount=13,
 x=>x.cumulativeDistinctPrivateCandidateCount=49,
 x=>x.previousCandidateCounts.totalDistinct=35,
 x=>x.sourceFullOriginalVerified.topic72.actualSourceFileSha256='0'.repeat(64),
 x=>x.sourceFullOriginalVerified.topic73.selectedNumbers=[6,7,18,19,65,71],
 x=>x.privateTeacherReviewArtifact.sha256='0'.repeat(64),
 x=>x.privateTeacherReviewArtifact.uploadedToPublicGitHub=true,
 x=>x.privateTeacherReviewArtifact.automaticallyApprovedOrImported=true,
 x=>x.unresolvedOriginalBookSourceChecks=[],
 x=>x.sourceOriginalNbfFullPdfReopenedThisPass=true,
 x=>x.reviewerQueueDistinctSourceItems.pop(),
 x=>x.reviewerQueueDistinctSourceItems[0].id='XI-U07-T072-Q009',
 x=>x.reviewerQueueDistinctSourceItems[0].originalFullRowSha256='0'.repeat(64),
 x=>x.reviewerQueueDistinctSourceItems[0].originalSlo='P-11-B-28',
 x=>x.reviewerQueueDistinctSourceItems[0].originalAuthorCognitive='A',
 x=>x.reviewerQueueDistinctSourceItems[1].candidateSlo='P-11-B-28',
 x=>x.reviewerQueueDistinctSourceItems[2].candidateActualCognitiveProvisional='K',
 x=>x.reviewerQueueDistinctSourceItems[4].provisionalSummativeScope='direct-candidate-pending',
 x=>x.reviewerQueueDistinctSourceItems[5].scienceIssueCategory='unreviewed',
 x=>x.reviewerQueueDistinctSourceItems[7].teacherDecisionRequired='short',
 x=>x.reviewerQueueDistinctSourceItems[0].stem='PRIVATE SOURCE',
 x=>x.reviewerQueueDistinctSourceItems[0].originalSourceAndKeyPreserved=false,
 x=>x.reviewerQueueDistinctSourceItems[0].candidateQuestionAndAnswerPrivate=false,
 x=>x.reviewerQueueDistinctSourceItems[0].teacherScienceSignoff='APPROVED',
 x=>x.reviewerQueueDistinctSourceItems[1].teacherCognitiveSignoff='APPROVED',
 x=>x.reviewerQueueDistinctSourceItems[2].teacherScoringSignoff='APPROVED',
 x=>x.reviewerQueueDistinctSourceItems[3].scoredRelease='RELEASED',
 x=>x.originalPrivateSourceWordEdited=true,
 x=>x.copyrightedSourceTextInGithub=true,
 x=>x.revisedStemsOptionsKeysInGithub=true,
 x=>x.firebaseOrTeacherBackendEdited=true,
 x=>x.liveGrade11QuestionBankChanged=true,
 x=>x.teacherScienceSignoffs=12,
 x=>x.teacherCognitiveSignoffs=12,
 x=>x.teacherScoringSignoffs=12,
 x=>x.unit7ScoredQuestionCount=12,
 x=>x.academicDecision='PUBLIC_SCORED_APPROVED'
];
for(const [i,mutate] of mutants.entries()){
 const v=structuredClone(d);mutate(v);
 A.throws(()=>verify(v),undefined,'Mutation '+(i+1)+' bypassed source/score HOLD');
}
const memo=read(MEMO);
for(const term of ['V182','48','274','Q38','Q51','Q52','Q53','Q54','Q76',
 'Q6','Q7','Q18','Q19','Q65','Q70','B-23','B-24','B-25','B-27',
 'p114','p115','Example7.2','PENDING','HOLD','teacher','private']){
 A.ok(memo.toLowerCase().replace(/\s/g,'').includes(term.toLowerCase().replace(/\s/g,'')),
  'Memo missing review/topic/guard term '+term);
}
const qa=path.join(root,'qa-artifacts/grade11-v182-unit7-private-teacher-batch04');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V182',sourceOriginalsInBatch:12,sourceUniqueEarlierBatches:36,
 cumulativeDistinctPrivateCandidateOriginals:48,originalUnit7Total:274,
 teacherScienceSignoffs:0,teacherCognitiveSignoffs:0,teacherScoringSignoffs:0,
 unit7ScoredRelease:0,negativeControlMutations:mutants.length,
 next:'V183 source-bound private teacher candidate review or source-page closure'
},null,2)+'\n');
console.log('V182 PASS: 12 original-source verified private candidates, 48 cumulative identities, '+mutants.length+' negative mutation tests, ZERO academic teacher signoffs and ZERO scored Unit7.');
