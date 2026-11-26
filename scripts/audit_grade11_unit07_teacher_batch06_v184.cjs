#!/usr/bin/env node
'use strict';
/** V184: owner-original Unit7 fifth-to-sixth teacher tranche boundary.
 * Original keyed Word text and separate private candidate pack are never
 * published. This program checks the public source-registry SHA identities,
 * teacher-approval HOLD, and no scored item-bank or backend changes.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const load=p=>JSON.parse(read(p));
const INDEX='quality/unit07/unit07-v184-batch06-twelve-originals-last-compulsory-private-review-no-keys.json';
const MEMO='quality/grade11-v184-unit07-batch06-12-private-teacher-source-qc.md';
const BOOK={
 '7.1':{filename:'Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.docx',
 registry:'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json',
 version:'V154',sha:'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58',
 sourceShaField:'sourceOriginalOwnerDocxSha256',rows:'entries',num:'sourceNumber',
 rowSha:'originalFullRowSha256',slo:'officialSlo',priority:'reviewQueuePriority',
 cognitive:null,nums:[22,25,57,70,74],
 priorities:['standard','standard','compulsory','compulsory','compulsory'],
 issues:['approximate-isotropy-randomly-oriented-grains',
 'short-range-order-without-long-range-periodicity',
 'fcc-drawn-six-face-centres-versus-three-effective-face-sites',
 'natural-rubber-polymer-origin-versus-crystal-order',
 'polycrystalline-grain-boundary-versus-polymeric-chemistry'],
 levels:['U','U','U','U','U'],scope:[
 'direct-structural-understanding-candidate','direct-structural-understanding-candidate',
 'supporting-crystallography-detail','supporting-classification-source-p114-pending',
 'direct-structural-understanding-candidate']},
 '7.2':{filename:'Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx',
 registry:'quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json',
 version:'V168',sha:'a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada',
 sourceShaField:'sourceOriginalPrivateDocxSha256',rows:'canonicalSourceRows',num:'sourceNumber',
 rowSha:'sha256',slo:'originalMappedSlo',priority:'firstPassIssue',
 cognitive:'originalCognitiveCode',nums:[25,36,72,74],
 priorities:['optional','optional','compulsory','optional'],
 issues:['thin-wire-extension-inverse-area-under-linear-elastic-range',
 'brittle-glass-small-plastic-strain-versus-word-recall',
 'bulk-modulus-negative-volume-strain-not-direct-young-modulus',
 'ductility-permanent-drawing-before-fracture'],
 levels:['A','U','A','U'],scope:[
 'direct-young-modulus-application-candidate',
 'direct-elastic-plastic-understanding-candidate','supporting-bulk-modulus-only',
 'direct-elastic-plastic-understanding-candidate']},
 '7.3':{filename:'Grade11_Unit7_Topic7.3_PartA_80MCQs_Study_With_Answers.docx',
 registry:'quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json',
 version:'V173',sha:'f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279',
 sourceShaField:'originalPrivateWordSha256',rows:'originalRowSourceRegistry',num:'number',
 rowSha:'originalPrivateFullRowSha256',slo:'sourceMappedSlo',priority:'previousReviewPriority',
 cognitive:'sourceAuthorDemand',nums:[14,58,68],
 priorities:['optional','optional','optional'],
 issues:['stiffness-force-extension-slope-versus-area-work',
 'trapezoid-area-incremental-work-not-necessarily-recoverable-energy',
 'eye-level-reading-reduces-parallax-experiment'],
 levels:['A','A','U'],scope:[
 'direct-work-from-area-application-candidate',
 'direct-force-extension-work-application-candidate',
 'supporting-experimental-method-understanding']}
};
const PRIV_SHA='c63f8ed1c9fe68d3e331971e258d2b2104da58a098ca8b2975a83c16b6356980';
const NO_PRIVATE=['stem','originalStem','questionText','question','options','sourceOptions',
 'originalQuestion','originalOptions','correctOption','correctAnswer','answer','answerKey',
 'answerLetter','correctOptionText','originalExplanation','fullExplanation',
 'candidateQuestion','revisedStem','candidateOptions','candidateKey',
 'workedSolution','teacherEmail','studentEmail','teacherUid','studentUid',
 'authenticationToken','approvalToken','sourceDocxBytes','privateSourceWordBytes'];
function noLeaks(o,where){for(const k of NO_PRIVATE)A.equal(Object.hasOwn(o,k),false,'Private payload at '+where+'.'+k);}
const id=(t,n)=>'XI-U07-T0'+t.replace('.','')+'-Q'+String(n).padStart(3,'0');
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V184');
 A.equal(d.prerequisite.prNumber,287);A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'647e7d5ea6b228829a786de2822569afa0d17782');
 A.deepEqual(d.priorCandidateBatches,{v179:12,v180:12,v181:12,v182:12,v183:12,totalDistinct:60});
 A.equal(d.sourceOriginalUnit7Identities,274);
 A.equal(d.selectedNewOriginalCount,12);
 A.equal(d.cumulativeDistinctPrivateCandidateCount,72);
 A.deepEqual(d.batchPriorityDistribution,{compulsory:4,optional:6,standard:2});
 A.equal(d.remainingUnselectedCompulsoryTopic71To73AfterBatch,0);
 A.equal(d.sourceFullNbfTextbookPdfReopened,false);
 A.equal(d.unresolvedTextbookSourceDependencies.length,3);
 A.ok(d.unresolvedTextbookSourceDependencies[0].includes('p114'));
 A.ok(d.unresolvedTextbookSourceDependencies[1].includes('p115'));
 A.ok(d.unresolvedTextbookSourceDependencies[2].includes('Example 7.2'));
 A.equal(d.privateTeacherPack.filename,'Unit7_V184_Teacher_Review_Batch06_PRIVATE.docx');
 A.equal(d.privateTeacherPack.sha256,PRIV_SHA);
 A.equal(d.privateTeacherPack.renderedPages,13);
 A.equal(d.privateTeacherPack.originalSourceAndSeparateCandidateIncluded,true);
 A.equal(d.privateTeacherPack.committedToPublicRepository,false);
 A.equal(d.privateTeacherPack.teacherApprovalImplied,false);
 A.equal(d.privateTeacherPack.scoredBankImported,false);
 for(const k of ['studentQuestionBankEdited','ownerOriginalWordEdited',
  'originalStemOptionsAnswersPublished','candidateStemOptionsAnswersPublished',
  'firebaseOrTeacherBackendEdited'])A.equal(d[k],false);
 for(const k of ['individualTeacherScienceApprovals','individualTeacherCognitiveApprovals',
  'individualTeacherScoringApprovals','scoredUnit7QuestionCount'])A.equal(d[k],0);
 A.equal(d.academicStatus,'KEYLESS_SOURCE_BOUND_PRIVATE_CANDIDATES_ONLY_TEACHER_APPROVAL_PENDING_SCORE_HOLD');
 A.ok(d.nextMilestone.startsWith('V185'));
 A.equal(d.rows.length,12);noLeaks(d,'batch index');
 let j=0,priority={compulsory:0,optional:0,standard:0};
 for(const topic of ['7.1','7.2','7.3']){
  const spec=BOOK[topic],reg=load(spec.registry);
  A.equal(reg.version,spec.version);
  A.equal(reg[spec.sourceShaField],spec.sha);
  A.equal(reg[spec.rows].length,80);
  const metadata=d.originalSourceFiles['topic'+topic.replace('.','')];
  A.equal(metadata.filename,spec.filename);
  A.equal(metadata.sha256,spec.sha);
  A.equal(metadata.previousRegistry,spec.version);
  A.deepEqual(metadata.selectedOriginalNumbers,spec.nums);
  for(let k=0;k<spec.nums.length;k++){
   const n=spec.nums[k],r=d.rows[j++];
   const original=reg[spec.rows].find(x=>x[spec.num]===n);
   A.ok(original,'source original missing: '+topic+':'+n);
   A.equal(r.id,id(topic,n));
   A.equal(r.topic,topic);A.equal(r.sourceNumber,n);
   A.equal(r.sourceRegistry,spec.version);
   A.equal(r.sourceOriginalFullRowSha256,original[spec.rowSha]);
   A.ok(typeof r.sourceOriginalFullRowSha256==='string'&&/^[a-f0-9]{64}$/.test(r.sourceOriginalFullRowSha256));
   A.equal(r.originalSlo,original[spec.slo]);
   A.equal(r.originalCognitiveLabel,spec.cognitive?original[spec.cognitive]:'NOT_MARKED_IN_ORIGINAL_7_1');
   A.equal(r.originalReviewPriority,original[spec.priority]);
   A.equal(r.reviewBatchPriority,spec.priorities[k]);
   priority[r.reviewBatchPriority]++;
   A.equal(r.scientificIssueCategory,spec.issues[k]);
   A.equal(r.proposedSlo,r.originalSlo);
   A.equal(r.proposedActualCognitive,spec.levels[k]);
   A.equal(r.proposedSummativeScope,spec.scope[k]);
   A.equal(r.exactSourceOriginalPreserved,true);
   A.equal(r.privateCandidateQuestionAndAnswerStoredOutsideGithub,true);
   A.equal(r.teacherScienceSignoff,'PENDING');
   A.equal(r.teacherCognitiveSignoff,'PENDING');
   A.equal(r.teacherScoringSignoff,'PENDING');
   A.equal(r.scoredRelease,'HOLD');
   if(topic==='7.1'){
    A.equal(original.academicScienceDecision,'PENDING');
    A.equal(original.academicCognitiveDecision,'PENDING');
    A.equal(original.eligibleForScoredStudentRelease,false);
   }else if(topic==='7.2'){
    A.equal(original.academicTeacherReview,'PENDING');
    A.equal(original.scoredRelease,'HOLD');
   }else{
    A.equal(original.teacherScienceSignoff,'PENDING');
    A.equal(original.teacherCognitiveSignoff,'PENDING');
    A.equal(original.studentScoredRelease,'HOLD');
   }
   noLeaks(r,r.id);
  }
 }
 A.deepEqual(priority,{compulsory:4,optional:6,standard:2});
 A.equal(new Set(d.rows.map(r=>r.id)).size,12);
}
const d=load(INDEX);validate(d);
const prev=[
 ...load('quality/unit07/unit07-v179-batch01-twelve-source-authenticated-keyless-candidates.json').itemRows,
 ...load('quality/unit07/unit07-v180-batch02-twelve-high-priority-source-bound-no-keys.json').itemRows,
 ...load('quality/unit07/unit07-v181-batch03-twelve-originals-private-candidates-keyless.json').itemRows,
 ...load('quality/unit07/unit07-v182-batch04-twelve-originals-private-candidates-keyless.json').reviewerQueueDistinctSourceItems,
 ...load('quality/unit07/unit07-v183-batch05-twelve-owner-source-private-candidates-keyless.json').rows
];
const prevIds=new Set(prev.map(x=>x.id));
A.equal(prevIds.size,60);A.equal(prev.length,60);
for(const r of d.rows)A.equal(prevIds.has(r.id),false,'V184 repeated original '+r.id);
const allNewIds=new Set([...prevIds,...d.rows.map(r=>r.id)]);
A.equal(allNewIds.size,72);
for(const topic of ['7.1','7.2','7.3']){
 const source=load(BOOK[topic].registry);
 const compulsory=topic==='7.1'?source.entries.filter(x=>x.reviewQueuePriority.includes('COMPULSORY')||x.reviewQueuePriority.includes('BLOCKING')).map(x=>x.sourceNumber):
 topic==='7.2'?source.firstPassCompulsoryQuestionNumbers:source.firstPassCompulsoryFlags;
 const uncovered=compulsory.filter(n=>!allNewIds.has(id(topic,n)));
 A.deepEqual(uncovered,[],'Compulsory-priority source original not selected for private candidate yet: '+topic);
}
A.equal(load('quality/unit07/unit07-v178-consolidated-274-teacher-approval-index-no-keys.json').scoredUnit7PortalQuestions,0);
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(x=>x.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(root,'question-bank/grade-11/unit-07.json')),false);
A.deepEqual(load('question-bank/manifest.json').grades.find(x=>x.grade===11).units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const mutations=[
 x=>x.prerequisite.prNumber=286,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.priorCandidateBatches.totalDistinct=59,
 x=>x.selectedNewOriginalCount=13,
 x=>x.cumulativeDistinctPrivateCandidateCount=73,
 x=>x.batchPriorityDistribution.compulsory=3,
 x=>x.remainingUnselectedCompulsoryTopic71To73AfterBatch=1,
 x=>x.sourceFullNbfTextbookPdfReopened=true,
 x=>x.unresolvedTextbookSourceDependencies=[],
 x=>x.privateTeacherPack.sha256='0'.repeat(64),
 x=>x.privateTeacherPack.committedToPublicRepository=true,
 x=>x.originalSourceFiles.topic71.sha256='0'.repeat(64),
 x=>x.originalSourceFiles.topic72.selectedOriginalNumbers=[25,36,72,75],
 x=>x.rows.pop(),
 x=>x.rows[0].id='XI-U07-T071-Q010',
 x=>x.rows[0].sourceOriginalFullRowSha256='0'.repeat(64),
 x=>x.rows[0].originalSlo='P-11-B-28',
 x=>x.rows[0].originalCognitiveLabel='A',
 x=>x.rows[0].originalReviewPriority='compulsory',
 x=>x.rows[0].reviewBatchPriority='compulsory',
 x=>x.rows[0].scientificIssueCategory='wrong',
 x=>x.rows[0].proposedSlo='P-11-B-25',
 x=>x.rows[0].proposedActualCognitive='K',
 x=>x.rows[0].proposedSummativeScope='direct-unknown',
 x=>x.rows[0].exactSourceOriginalPreserved=false,
 x=>x.rows[0].originalQuestion='PRIVATE',
 x=>x.rows[0].privateCandidateQuestionAndAnswerStoredOutsideGithub=false,
 x=>x.rows[0].teacherScienceSignoff='APPROVED',
 x=>x.rows[1].teacherCognitiveSignoff='APPROVED',
 x=>x.rows[2].teacherScoringSignoff='APPROVED',
 x=>x.rows[3].scoredRelease='RELEASED',
 x=>x.studentQuestionBankEdited=true,
 x=>x.ownerOriginalWordEdited=true,
 x=>x.originalStemOptionsAnswersPublished=true,
 x=>x.candidateStemOptionsAnswersPublished=true,
 x=>x.firebaseOrTeacherBackendEdited=true,
 x=>x.individualTeacherScienceApprovals=12,
 x=>x.individualTeacherCognitiveApprovals=12,
 x=>x.individualTeacherScoringApprovals=12,
 x=>x.scoredUnit7QuestionCount=12,
 x=>x.academicStatus='SCORED_RELEASE_APPROVED'
];
for(const [i,f] of mutations.entries()){
 const mutant=structuredClone(d);f(mutant);
 A.throws(()=>validate(mutant),undefined,'Fail-closed mutation '+(i+1)+' did not fail');
}
const memo=read(MEMO).toLowerCase().replace(/\s/g,'');
for(const text of ['V184','12','72','274','Q22','Q25','Q57','Q70','Q74',
 'Q36','Q72','Q14','Q58','Q68','B-22','B-24','B-25','B-26','B-27',
 'p114','p115','Example7.2','PENDING','HOLD','teacher','private']){
 A.ok(memo.includes(text.toLowerCase().replace(/\s/g,'')),'Missing memo term '+text);
}
const qa=path.join(root,'qa-artifacts/grade11-v184-unit7-private-teacher-batch06');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V184',originalSourceRowsThisBatch:12,previousDistinctOriginalCandidateRows:60,
 cumulativeDistinctPrivateCandidateRows:72,totalOriginalUnit7Items:274,
 lastUnselectedCompulsorySourceRowsAddressed:4,
 remainingUnselectedCompulsoryPriorityRows:0,
 firstPassOptionalInBatch:6,firstPassStandardInBatch:2,
 teacherScienceApprovals:0,teacherCognitiveApprovals:0,teacherScoredReleaseApprovals:0,
 scoredUnit7Releases:0,negativeFailClosedTests:mutations.length
},null,2)+'\n');
console.log('V184 PASS: 12 original source identities, 72 distinct private candidate drafts, 4 last compulsory-priority selected; '+mutations.length+' fail-closed tests; ZERO teacher approvals or scored Unit7 release.');
