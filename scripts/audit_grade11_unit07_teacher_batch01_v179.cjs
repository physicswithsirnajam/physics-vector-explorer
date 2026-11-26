#!/usr/bin/env node
'use strict';
/**
 * Grade XI Unit7 V179: keyless 12-item owner-original source-bound teacher
 * candidate drafts. Public GitHub does NOT receive original or revised MCQ
 * stems, keyed answers, full private Word document or authenticated signoffs.
 */
const A=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const INDEX='quality/unit07/unit07-v179-batch01-twelve-source-authenticated-keyless-candidates.json';
const MEMO='quality/grade11-v179-unit07-batch01-12-originals-private-candidate-teacher-qc.md';
const DOCS={
 '7.1':'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58',
 '7.2':'a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada',
 '7.3':'f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279'
};
const PACK='a62d795451e9ddc7e93be2e9080c9874ef25f0fbc5882f748f39d236201360c9';
const SELECTED={'7.1':[10,15,62,76],'7.2':[9,33,39,57,80],'7.3':[3,35,64]};
const ROWS={
 '7.1':[
  '0c327a12d6d0e70a73cc37e83674ef22a23e94b9c4ec2e04a305af57522d4fa3',
  'cb495239a8fa53da403d43e5b72baae7270e05eb1f3fb43753a7969dc41a0249',
  '2b7639796e64f33879d55d03e2f5039a9ffa6f2662374f088eb6a706ff3136e5',
  '623b1d40e694a64ef25560f4daafb0dcb172f12371483074ca8caa981dbcc373'
 ],
 '7.2':[
  '117b30a1ae56b8df419cf6cb30723dc43f5965c339f151aa97cc53877235aa39',
  'a88957c9f7c2d008ef3765148ff40ab8c17d84699bb2b4d333fc35c90bc4c0ca',
  'fd7367fddb80a8de86b4935981e1f5e021b8a7ab79144c4d621ab32314d5fdf8',
  '6c287704fb883ddce1f842672138cd60f536fc0e295367a76596b95ebd011596',
  'e78975f06be972ba6cdce36e7d539998d9f5e551b9e01f0acc6c342e74f78bec'
 ],
 '7.3':[
  'd5c8619efec2a001877f8e66a25b2f6472ecb1b6807d0699b7d1454b985d6138',
  'b581f04efcc3815f8ad1a34145c62c9af20bb6460f74c021a54ecc24b49d1b34',
  'e7b9d7d54b3ef4cfbf786797db7dfb7c68d4b3bdb58a5045139fb22c7395d690'
 ]
};
const CATEGORIES={
 '7.1':['polymer-source-example-attribution','narrower-molecular-crystal-attribution-unverified','random-long-range-language-not-scientifically-precise','original-nylon-example-attribution-false-in-source-passage'],
 '7.2':['external-NBF-figure-reference-and-recognition-demand','named-D-graph-point-without-graph-and-duplicate','external-material-table-and-comparison-distractor-quality','missing-NBF-example7.2-numerical-inputs','graph-label-context-and-same-UTS-concept-as-Q33'],
 '7.3':['missing-source-apparatus-figure7.13','original-global-linear-model-assumption-not-local','permanent-plastic-strain-is-B26-not-B28']
};
const SOURCE_SLO={'7.1':[22,22,22,22],'7.2':[23,26,24,24,26],'7.3':[25,27,28]};
const TARGET_SLO={'7.1':[22,22,22,22],'7.2':[23,26,24,24,26],'7.3':[25,27,26]};
const TARGET_DEMAND={'7.1':['K','K','U','U'],'7.2':['U','U','A','A','U'],'7.3':['U','A','U']};
const BANNED=[
 'stem','question','originalQuestion','questionText','originalQuestionText',
 'revisedQuestion','candidateQuestion','options','revisedOptions','answer',
 'answerLetter','correctOption','correctOptionText','fullExplanation',
 'modelAnswer','workedSolution','fullTeacherPackText','privateWordBytes',
 'teacherUid','teacherEmail','studentUid','studentEmail','teacherApprovalToken'
];
const hash=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
function noPayload(x,label){
 for(const k of BANNED)A.equal(Object.hasOwn(x,k),false,'Forbidden private source/key/PII field '+label+': '+k);
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V179');
 A.equal(d.prerequisitePR,282);
 A.equal(d.pr282MergedSha,'d2bf9cc8b0583cca1d3a60bd194bd2d2707e026d');
 A.equal(d.firstBatchOriginalQuestionCount,12);
 A.equal(d.proposedCandidateDraftCount,12);A.equal(d.sourceIdentityReviewCount,12);
 A.equal(d.sourceOriginalAuthorAnswerLettersConditionallyDefensibleCount,12);
 A.equal(d.scoredReadyQuestionCount,0);A.equal(d.teacherScienceSignoffs,0);
 A.equal(d.teacherCognitiveSignoffs,0);A.equal(d.teacherScoringSignoffs,0);
 A.equal(d.noAnswerLettersPublished,true);
 A.equal(d.noOriginalOrRevisedStemsOrOptionsPublished,true);
 const s=d.sourceFullOriginalVerified;
 for(const [topic,meta] of Object.entries({topic71:['7.1','V154'],topic72:['7.2','V168'],topic73:['7.3','V173']})){
  const x=s[topic], [key,version]=meta;
  A.equal(x.priorRegisterVersion,version);
  A.equal(x.actualSourceDocxSha256,DOCS[key]);
  A.deepEqual(x.originalRowsSelected,SELECTED[key]);
 }
 A.equal(s.topic71.sourceMatchesV154Exactly,true);
 A.equal(s.topic71.questionOnlyCandidatePath,
  'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv');
 const p=d.privateTeacherReviewArtifact;
 A.equal(p.fileName,'Unit7_V179_Teacher_Review_Batch01_PRIVATE.docx');
 A.equal(p.sha256,PACK);
 A.equal(p.containsOriginalRowsAndSeparateCandidateDrafts,true);
 A.equal(p.committedToPublicGitHub,false);
 A.equal(p.scoredQuestionBankImport,false);
 A.equal(d.topic71Exception.status,'RESOLVED_SOURCE_IDENTITY_ONLY');
 A.equal(d.topic71Exception.originalV154Sha256,DOCS['7.1']);
 A.equal(d.topic71Exception.sourceMatchesV154Exactly,true);
 A.deepEqual(d.topic71Exception.sourceExplanationBlockerStillUnresolved,[10,76]);
 A.deepEqual(d.topic71Exception.teacherApprovalPending,[10,15,62,76]);
 A.ok(d.pendingSourceTasks.some(s=>s.includes('page 114')));
 A.ok(d.pendingSourceTasks.some(s=>s.includes('Example 7.2')));
 A.equal(d.itemRows.length,12);
 let order=[], seen=new Set();
 for(const [topic,nums] of Object.entries(SELECTED)){
  const r=d.itemRows.filter(x=>x.originalTopic===topic);
  A.deepEqual(r.map(x=>x.originalNumber),nums);
  for(let i=0;i<r.length;i++){
   const x=r[i],n=nums[i],id='XI-U07-T0'+topic.slice(-1)+'-Q'+String(n).padStart(3,'0');
   A.equal(x.id,id);A.equal(seen.has(id),false);seen.add(id);order.push(id);
   A.equal(x.originalKeylessFullRowFingerprint,ROWS[topic][i]);
   A.equal(x.sourceOriginalSlo,'P-11-B-'+SOURCE_SLO[topic][i]);
   A.equal(x.proposedCandidateSlo,'P-11-B-'+TARGET_SLO[topic][i]);
   A.equal(x.proposedActualCognitive,TARGET_DEMAND[topic][i]);
   A.equal(x.priority,'compulsory');
   A.equal(x.scienceFindingCategory,CATEGORIES[topic][i]);
   A.ok(x.privateCandidateDesignTag.length>20);
   A.ok(x.teacherDecisionRequired.length>20);
   A.equal(x.sourceOriginalQuestionAndKeyRemainPrivate,true);
   A.equal(x.candidateQuestionAndOptionsRemainPrivate,true);
   A.equal(x.privateTeacherPackCandidateNotImported,true);
   A.equal(x.verifiedSourceFileShaMatchedPriorV168OrV173,topic!=='7.1');
   if(topic==='7.1')A.equal(x.verifiedSourceFileShaMatchedPriorV154,true);
   A.equal(x.independentlyVerifiedProposedCandidateAnswer,true);
   A.equal(x.teacherScienceApproval,'PENDING');
   A.equal(x.teacherCognitiveApproval,'PENDING');
   A.equal(x.teacherScoredReleaseApproval,'PENDING');
   A.equal(x.scoredRelease,'HOLD');
   noPayload(x,id);
  }
 }
 A.equal(seen.size,12);A.equal(order.length,12);
 A.equal(d.topic71SourceVerification.includes('V154'),true);
 const g=d.sharedSafetyAndAcademicHolds;
 for(const k of ['originalOwnerWordSourcesEdited','anyOriginalNbfTextOrImageCopiedToGithub',
  'privateQuestionOrAnswerContentInPublicGitHub','productionQuestionBankChanged',
  'teacherRolesOrFirebaseChanged','stagingOrProductionDeploymentPerformed',
  'existingUnit6ScienceApprovalsChanged'])A.equal(g[k],false);
 A.equal(g.unit7ScoredQuestionCount,0);
 A.equal(g.previousUnit7OriginalSourceReviewPreserved,true);
 A.equal(d.decision,'TWELVE_AUTHENTICATED_PRIVATE_CANDIDATE_DRAFTS_TEACHER_SIGNATURES_ZERO_STUDENT_SCORE_HOLD');
 A.ok(d.next.startsWith('V180'));
 noPayload(d,'root');noPayload(d.privateTeacherReviewArtifact,'pack');
}
const d=load(INDEX);validate(d);
const v154=load('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
const v168=load('quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
const v173=load('quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json');
A.equal(v154.sourceOriginalOwnerDocxSha256,DOCS['7.1']);
A.equal(v168.sourceOriginalPrivateDocxSha256,DOCS['7.2']);
A.equal(v173.originalPrivateWordSha256,DOCS['7.3']);
for(const x of d.itemRows){
 const n=x.originalNumber,t=x.originalTopic;
 const r=t==='7.1'?v154.entries[n-1]:t==='7.2'?v168.canonicalSourceRows[n-1]:v173.originalRowSourceRegistry[n-1];
 A.ok(r,'Missing owner source row '+t+'-'+n);
 A.equal(r.sourceNumber??r.number,n);
 A.equal(t==='7.1'?r.originalFullRowSha256:t==='7.2'?r.sha256:r.originalPrivateFullRowSha256,
  x.originalKeylessFullRowFingerprint);
 if(t==='7.1'){
  A.equal(r.academicScienceDecision,'PENDING');A.equal(r.academicCognitiveDecision,'PENDING');
  A.equal(r.eligibleForScoredStudentRelease,false);
 }else if(t==='7.2'){
  A.equal(r.academicTeacherReview,'PENDING');A.equal(r.scoredRelease,'HOLD');
 }else{
  A.equal(r.teacherScienceSignoff,'PENDING');A.equal(r.teacherCognitiveSignoff,'PENDING');
  A.equal(r.studentScoredRelease,'HOLD');
 }
}
A.deepEqual(v154.hardBlockedAnswerKeyImportUntilExplanationRepaired,[76]);
A.equal(v168.newCrossBatchCriticalIssue.questionNumber,57);
A.deepEqual(v173.sourceMissingIndependentStimulus,[3]);
const v178=load('quality/unit07/unit07-v178-consolidated-274-teacher-approval-index-no-keys.json');
A.equal(v178.totalOriginalItems,274);A.equal(v178.scoredUnit7PortalQuestions,0);
A.equal(v178.teacherScienceApprovals,0);A.equal(v178.teacherCognitiveApprovals,0);
const mutations=[
 x=>x.prerequisitePR=281,
 x=>x.pr282MergedSha='0'.repeat(40),
 x=>x.firstBatchOriginalQuestionCount=11,
 x=>x.proposedCandidateDraftCount=8,
 x=>x.sourceIdentityReviewCount=11,
 x=>x.scoredReadyQuestionCount=1,
 x=>x.privateTeacherReviewArtifact.sha256='0'.repeat(64),
 x=>x.privateTeacherReviewArtifact.committedToPublicGitHub=true,
 x=>x.privateTeacherReviewArtifact.scoredQuestionBankImport=true,
 x=>x.sourceFullOriginalVerified.topic71.actualSourceDocxSha256='0'.repeat(64),
 x=>x.sourceFullOriginalVerified.topic71.sourceMatchesV154Exactly=false,
 x=>x.sourceFullOriginalVerified.topic72.originalRowsSelected=[9,33],
 x=>x.topic71Exception.sourceExplanationBlockerStillUnresolved=[],
 x=>x.topic71Exception.teacherApprovalPending=[],
 x=>x.itemRows.pop(),
 x=>x.itemRows[0].originalKeylessFullRowFingerprint='0'.repeat(64),
 x=>x.itemRows[0].originalNumber=76,
 x=>x.itemRows[0].sourceOriginalSlo='P-11-B-28',
 x=>x.itemRows[4].proposedCandidateSlo='P-11-B-28',
 x=>x.itemRows[9].proposedActualCognitive='K',
 x=>x.itemRows[3].teacherDecisionRequired='RELEASED',
 x=>x.itemRows[3].teacherScienceApproval='APPROVED',
 x=>x.itemRows[3].teacherCognitiveApproval='APPROVED',
 x=>x.itemRows[3].teacherScoredReleaseApproval='APPROVED',
 x=>x.itemRows[3].scoredRelease='RELEASED',
 x=>x.itemRows[3].answerLetter='C',
 x=>x.itemRows[3].candidateQuestion='private stem',
 x=>x.noAnswerLettersPublished=false,
 x=>x.noOriginalOrRevisedStemsOrOptionsPublished=false,
 x=>x.sharedSafetyAndAcademicHolds.productionQuestionBankChanged=true,
 x=>x.sharedSafetyAndAcademicHolds.teacherRolesOrFirebaseChanged=true,
 x=>x.sharedSafetyAndAcademicHolds.unit7ScoredQuestionCount=12,
 x=>x.teacherScienceSignoffs=12,
 x=>x.teacherCognitiveSignoffs=12,
 x=>x.teacherScoringSignoffs=12,
 x=>x.decision='APPROVED'
];
for(const [i,fn] of mutations.entries()){
 const copy=structuredClone(d);fn(copy);
 A.throws(()=>validate(copy),undefined,'V179 dangerous mutation passed: '+(i+1));
}
const memo=read(MEMO);
for(const x of ['12','V154','V149','V168','V173','Q76','Q57','Figure7.13',
 'Q35','Q64','P-11-B-26','PENDING','HOLD','authenticat','Example7.2']){
 A.ok(memo.toLowerCase().includes(x.toLowerCase()),'Missing teacher-review memo marker '+x);
}
const cat=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(cat.status,'planned');A.equal(cat.assessmentStatus,'not-published');A.equal(cat.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.deepEqual(load('question-bank/manifest.json').grades.find(g=>g.grade===11)
 .units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const qa=path.join(ROOT,'qa-artifacts/grade11-v179-unit7-private-candidates-batch01');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V179',firstBatchOriginalSourceMatched:12,
 ownerWordDocHashesMatchedWithPreviousRegistries:3,privateCandidateDrafts:12,
 sourceExplanationBlockingFlags:[{topic:'7.1',number:76}],
 externalSourceChecksNeeded:['NBF p114 polymer examples','NBF Example7.2 original bone data'],
 privateCandidatePackCommitted:false,teacherScienceApprovals:0,teacherCognitiveApprovals:0,
 studentScoredReleases:0,failClosedMutations:mutations.length,
 next:'V180 further original-page checks and small teacher review tranches'
},null,2)+'\n');
console.log('V179 PASS: 12 verified source-keyless original rows, 3 exact Word hashes, 12 private candidate drafts, '+mutations.length+' fail-closed mutations, 0 teacher approvals and 0 scored Unit7.');
