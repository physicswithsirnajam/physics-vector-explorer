#!/usr/bin/env node
'use strict';
/*
 * V181 Unit7: Public ledger checks 12 ORIGINAL owner authored MCQ identities,
 * registered prior row hashes, proposed outcome scope and academic HOLD.
 * Never load or publish private source Word question text, answer letters,
 * revised full answer pack, student records, or teacher credentials in CI.
 */
const A=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const INDEX='quality/unit07/unit07-v181-batch03-twelve-originals-private-candidates-keyless.json';
const MEMO='quality/grade11-v181-unit07-batch03-12-private-teacher-review-qc.md';
const V168='quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json';
const V173='quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json';
const DOCS={
 '7.2':'a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada',
 '7.3':'f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279'
};
const PACK='ad3a235234554a021c92a6427ad59a6725bf4059e0f91aa4804d9b3b4acc130c';
const SRC={
 '7.2':{nums:[17,18,26,34,46,47],registry:'V168',file:V168,fullShaField:'sourceOriginalPrivateDocxSha256',rows:'canonicalSourceRows',n:'sourceNumber',sha:'sha256',slo:'originalMappedSlo',level:'originalCognitiveCode',priority:'firstPassIssue'},
 '7.3':{nums:[45,46,47,49,55,56],registry:'V173',file:V173,fullShaField:'originalPrivateWordSha256',rows:'originalRowSourceRegistry',n:'number',sha:'originalPrivateFullRowSha256',slo:'sourceMappedSlo',level:'sourceAuthorDemand',priority:'previousReviewPriority'}
};
const PRECISE={
 '7.2':[
 ['bulk-volume-change-vs-named-young-modulus-outcome','P-11-B-24','U','supporting-scope-not-direct-b24'],
 ['shear-shape-change-vs-named-young-modulus-outcome','P-11-B-24','U','supporting-scope-not-direct-b24'],
 ['negative-sign-bulk-modulus-pressure-volume-convention','P-11-B-24','U','supporting-scope-not-direct-b24'],
 ['fracture-point-letter-E-requires-absent-figure','P-11-B-26','U','direct-summative-candidate-provisional'],
 ['shear-strain-number-is-supporting-not-young-modulus','P-11-B-24','A','supporting-scope-not-direct-b24'],
 ['volumetric-strain-number-is-supporting-not-young-modulus','P-11-B-24','A','supporting-scope-not-direct-b24']
 ],
 '7.3':[
 ['elastic-energy-needs-zero-start-linear-loading','P-11-B-28','A','direct-summative-candidate-provisional'],
 ['elastic-energy-needs-zero-start-linear-loading','P-11-B-28','A','direct-summative-candidate-provisional'],
 ['stiffness-slope-is-not-work-area','P-11-B-27','A','direct-summative-candidate-provisional'],
 ['force-extension-energy-needs-hooke-path','P-11-B-28','A','direct-summative-candidate-provisional'],
 ['wire-circular-area-calculation-not-experiment-description','P-11-B-25','U','direct-summative-candidate-provisional'],
 ['stress-strain-area-is-density-not-total-energy','P-11-B-28','A','direct-summative-candidate-provisional']
 ]
};
const BANNED=['stem','originalStem','question','questionText','originalQuestionText','options','originalOptions',
 'revisedStem','candidateQuestion','candidateOptions','correctOption','correctOptionText',
 'answerLetter','sourceAnswerLetter','answerKey','workedSolution','fullExplanation',
 'fullTeacherPackText','sourcePageImage','privateSourceWordBytes',
 'teacherUid','teacherEmail','teacherAuthToken','studentUid','studentEmail'];
const isSHA=x=>typeof x==='string'&&/^[0-9a-f]{64}$/.test(x);
const mkId=(t,n)=>'XI-U07-T0'+t.replace('.','')+'-Q'+String(n).padStart(3,'0');
const assertNoLeak=(o,label)=>{for(const k of BANNED)A.equal(Object.hasOwn(o,k),false,label+' must not have '+k)};
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V181');
 A.equal(d.prerequisite.prNumber,284);
 A.equal(d.prerequisite.mergedSha,'70990c1595ccd58cc3591c58911123a617876421');
 A.deepEqual(d.previousPrivateCandidateBatches,{v179:12,v180:12,totalPreviouslySelectedDistinct:24});
 A.equal(d.totalOriginalUnit7SourceItems,274);
 A.equal(d.thisBatchOriginalCount,12);A.equal(d.cumulativeDistinctCandidateReviewed,36);
 A.equal(d.itemRows.length,12);
 const p=d.privateTeacherReviewArtifact;
 A.equal(p.file,'Unit7_V181_Teacher_Review_Batch03_PRIVATE.docx');
 A.equal(p.sha256,PACK);A.equal(p.renderedPages,13);
 A.equal(p.containsOriginalAndSeparateProposedCandidates,true);
 A.equal(p.inPublicGithub,false);A.equal(p.automaticImport,false);
 A.equal(d.sourceOriginalBookImagesReopenedThisPass,false);
 A.equal(d.unclosedEarlierSourceDependencies.length,3);
 A.ok(d.unclosedEarlierSourceDependencies[0].includes('p114'));
 A.ok(d.unclosedEarlierSourceDependencies[1].includes('p115'));
 A.ok(d.unclosedEarlierSourceDependencies[2].includes('Example7.2'));
 A.equal(d.academicReviewStatus,'FIRST_PASS_CANDIDATES_PREPARED_TEACHER_PENDING');
 A.equal(d.candidateSloAndDemandAreProvisional,true);
 for(const x of ['originalQuestionFilesModified','privateOriginalQuestionTextOrKeysCommitted',
 'teacherAuthOrFirebaseChanged','scoredBankImported'])A.equal(d[x],false);
 for(const x of ['scoredUnit7Count','teacherScienceSignoffs','teacherCognitiveSignoffs','teacherScoringSignoffs'])A.equal(d[x],0);
 A.ok(d.nextMilestone.startsWith('V182'));
 assertNoLeak(d,'batch index');
 let i=0;
 for(const t of ['7.2','7.3']){
  const meta=d.sourceVerified[t==='7.2'?'topic72':'topic73'];
  A.equal(meta.sha256,DOCS[t]);A.equal(meta.registerVersion,SRC[t].registry);
  A.deepEqual(meta.numbers,SRC[t].nums);
  A.ok(meta.file.endsWith('.docx'));
  for(let j=0;j<6;j++){
   const r=d.itemRows[i++],n=SRC[t].nums[j],p=PRECISE[t][j];
   A.equal(r.id,mkId(t,n));A.equal(r.topic,t);A.equal(r.originalNumber,n);
   A.equal(r.priorOriginalRegistryVersion,SRC[t].registry);
   A.ok(isSHA(r.priorOriginalRowSha256));
   A.ok(/^P-11-B-\d+$/.test(r.originalMappedSlo));
   A.ok(['K','U','A'].includes(r.originalCognitiveTag));
   A.ok(r.originalFirstPassPriority.startsWith('compulsory'));
   A.equal(r.scienceIssueCategory,p[0]);A.equal(r.proposedSlo,p[1]);
   A.equal(r.proposedActualCognitive,p[2]);A.equal(r.proposedSloScope,p[3]);
   A.ok(r.privateCandidateDesignTag.length>15);
   A.ok(r.originalAnswerScienceReview.length>15);
   A.ok(r.teacherAction.length>60);
   A.equal(r.originalSourceQuestionAnswerRetainedPrivately,true);
   A.equal(r.teacherScienceApproval,'PENDING');
   A.equal(r.teacherCognitiveApproval,'PENDING');
   A.equal(r.teacherScoredReleaseApproval,'PENDING');
   A.equal(r.publicOriginalQuestionOrOptionsIncluded,false);
   A.equal(r.publicRevisedQuestionOrKeyIncluded,false);
   A.equal(r.scoredRelease,'HOLD');
   assertNoLeak(r,r.id);
  }
 }
 A.equal(new Set(d.itemRows.map(x=>x.id)).size,12);
}
const d=load(INDEX);validate(d);
const v179=load('quality/unit07/unit07-v179-batch01-twelve-source-authenticated-keyless-candidates.json');
const v180=load('quality/unit07/unit07-v180-batch02-twelve-high-priority-source-bound-no-keys.json');
A.equal(v179.itemRows.length,12);A.equal(v180.itemRows.length,12);
const prevIds=new Set([...v179.itemRows,...v180.itemRows].map(x=>x.id));
A.equal(prevIds.size,24);
for(const x of d.itemRows)A.equal(prevIds.has(x.id),false,'Previously reviewed candidate '+x.id);
const regs={ '7.2':load(V168),'7.3':load(V173) };
for(const t of ['7.2','7.3']){
 const meta=SRC[t],source=regs[t];A.equal(source.version,meta.registry);
 A.equal(source[meta.fullShaField],DOCS[t]);
 A.equal(source[meta.rows].length,80);
 for(const r of d.itemRows.filter(x=>x.topic===t)){
  const orig=source[meta.rows].find(x=>x[meta.n]===r.originalNumber);
  A.ok(orig,'Missing original source-row for '+r.id);
  A.equal(r.priorOriginalRowSha256,orig[meta.sha]);
  A.equal(r.originalMappedSlo,orig[meta.slo]);
  A.equal(r.originalCognitiveTag,orig[meta.level]);
  A.equal(r.originalFirstPassPriority,orig[meta.priority]);
  if(t==='7.2'){A.equal(orig.academicTeacherReview,'PENDING');A.equal(orig.scoredRelease,'HOLD');
   A.ok(source.firstPassCompulsoryQuestionNumbers.includes(r.originalNumber));
  }else{A.equal(orig.teacherScienceSignoff,'PENDING');A.equal(orig.teacherCognitiveSignoff,'PENDING');
   A.equal(orig.studentScoredRelease,'HOLD');
   A.ok(source.firstPassCompulsoryFlags.includes(r.originalNumber));
  }
 }
}
const v178=load('quality/unit07/unit07-v178-consolidated-274-teacher-approval-index-no-keys.json');
A.equal(v178.totalOriginalItems,274);A.equal(v178.scoredUnit7PortalQuestions,0);
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.deepEqual(load('question-bank/manifest.json').grades.find(x=>x.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const mutants=[
 x=>x.prerequisite.prNumber=283,
 x=>x.prerequisite.mergedSha='0'.repeat(40),
 x=>x.totalOriginalUnit7SourceItems=275,
 x=>x.thisBatchOriginalCount=11,
 x=>x.cumulativeDistinctCandidateReviewed=35,
 x=>x.sourceVerified.topic72.sha256='0'.repeat(64),
 x=>x.sourceVerified.topic73.numbers=[45,46,47,49,55,57],
 x=>x.privateTeacherReviewArtifact.sha256='0'.repeat(64),
 x=>x.privateTeacherReviewArtifact.inPublicGithub=true,
 x=>x.sourceOriginalBookImagesReopenedThisPass=true,
 x=>x.unclosedEarlierSourceDependencies=[],
 x=>x.itemRows.pop(),
 x=>x.itemRows[0].id='XI-U07-T072-Q009',
 x=>x.itemRows[0].priorOriginalRowSha256='0'.repeat(64),
 x=>x.itemRows[0].originalMappedSlo='P-11-B-28',
 x=>x.itemRows[0].originalCognitiveTag='A',
 x=>x.itemRows[0].originalFirstPassPriority='none',
 x=>x.itemRows[0].scienceIssueCategory='ignored',
 x=>x.itemRows[3].proposedSlo='P-11-B-24',
 x=>x.itemRows[6].proposedActualCognitive='U',
 x=>x.itemRows[8].proposedSloScope='direct-no-proof',
 x=>x.itemRows[10].teacherAction='missing',
 x=>x.itemRows[0].stem='PRIVATE SOURCE',
 x=>x.itemRows[0].correctOption='A',
 x=>x.itemRows[0].teacherScienceApproval='APPROVED',
 x=>x.itemRows[1].teacherCognitiveApproval='APPROVED',
 x=>x.itemRows[2].teacherScoredReleaseApproval='APPROVED',
 x=>x.itemRows[3].scoredRelease='RELEASED',
 x=>x.itemRows[4].publicOriginalQuestionOrOptionsIncluded=true,
 x=>x.itemRows[5].publicRevisedQuestionOrKeyIncluded=true,
 x=>x.originalQuestionFilesModified=true,
 x=>x.privateOriginalQuestionTextOrKeysCommitted=true,
 x=>x.teacherAuthOrFirebaseChanged=true,
 x=>x.scoredBankImported=true,
 x=>x.scoredUnit7Count=12,
 x=>x.teacherScienceSignoffs=12,
 x=>x.teacherCognitiveSignoffs=12,
 x=>x.teacherScoringSignoffs=12
];
for(const [i,f] of mutants.entries()){
 const c=structuredClone(d);f(c);
 A.throws(()=>validate(c),undefined,'Mutation '+(i+1)+' slipped through');
}
const memo=read(MEMO);
for(const x of ['V181','V179','V180','12','36','274','Q17','Q18','Q26','Q34','Q46','Q47','Q45','Q49','Q55','Q56','B-24','B-25','B-26','B-27','B-28','PENDING','HOLD','p114','p115','Example 7.2']){
 A.ok(memo.toLowerCase().includes(x.toLowerCase()),'Memo missing required element '+x);
}
const dir=path.join(ROOT,'qa-artifacts/grade11-v181-unit7-private-teacher-batch03');
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({
 version:'V181',uniqueOriginalsThisBatch:12,uniquePreviousOriginals:24,
 cumulativeDistinctOriginalPrivateReviewCandidates:36,unit7OriginalItemTotal:274,
 sourceTopic72:6,sourceTopic73:6,teacherScienceSignoffs:0,
 teacherCognitiveSignoffs:0,scoredReleaseSignoffs:0,
 studentScoredUnit7Releases:0,failClosedMutationCount:mutants.length
},null,2)+'\n');
console.log('V181 PASS: 12 new source fingerprinted original MCQs, 36 cumulative candidates, '+mutants.length+' fail-closed mutations; ZERO teacher approvals, ZERO scored Unit7 release.');
