#!/usr/bin/env node
'use strict';
/**
 * V173 private-owner-source-backed, PUBLIC-KEYLESS whole-bank Grade XI
 * Unit7.3 audit. CI cannot read original Word answers or NBF figures.
 * It verifies cumulative provenance, metadata accuracy, teacher PENDING
 * and STUDENT SCORE HOLD. No question bank or Firebase writes.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),
 path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const sha=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const ROOT_PATH='quality/unit07/';
const PATHS=[
 ROOT_PATH+'topic73-v169-q01-q20-source-bound-academic-review-no-keys.json',
 ROOT_PATH+'topic73-v170-q21-q40-source-bound-academic-review-no-keys.json',
 ROOT_PATH+'topic73-v171-q41-q60-source-bound-numerical-review-no-keys.json',
 ROOT_PATH+'topic73-v172-q61-q80-source-bound-science-slo-review-no-keys.json'
];
const TARGET=ROOT_PATH+'topic73-v173-all80-consolidated-academic-qc-no-keys.json';
const REPORT='quality/grade11-v173-topic73-all80-consolidated-academic-qc.md';
const ORIGINAL='f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279';
const BOOK='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const HASH80='9bb8d9e43e2b20d14c1f58607f834d03f48b3bb03e4c871c021386c261649749';
const PRIOR_COMP=[3,6,7,12,18,19,24,31,35,42,45,46,47,49,55,56,64,65,70,71,73,78,79];
const PRIOR_OPT=[5,13,14,23,32,33,34,36,48,52,54,58,61,62,63,67,68,72];
const GROUPS=[
 [5,18],[14,34,70,71],[21,28,36],[51,52,53],[42,49,78],[38,80],
 [1,13],[4,30,69],[22,23,50,63],[19,55],[29,67],[31,62],[32,61],[56,79]
];
const BASE_MATRIX={
 'P-11-B-25':{K:3,U:10,A:10,total:23,priorDirectTopic:10,priorSupportingOrCrossSlo:13,priorDirectAuthorA:1},
 'P-11-B-27':{K:2,U:12,A:8,total:22,priorDirectTopic:18,priorSupportingOrCrossSlo:4,priorDirectAuthorA:6},
 'P-11-B-28':{K:6,U:7,A:22,total:35,priorDirectTopic:31,priorSupportingOrCrossSlo:4,priorDirectAuthorA:20}
};
const BAN=[
 'stem','question','questionText','prompt','options','optionA','optionB','optionC',
 'optionD','correctOption','correctOptionText','answer','answerLetter','key','keyLetter',
 'oneLineExplanation','originalExplanation','workedSolution','candidateStem',
 'studentEmail','studentUid','teacherEmail','teacherUid','numberedNumericAnswer'
];
const original=PATHS.map(load);
const norm=original.flatMap((v,i)=>{
 const items=i===1?v.items:v.sourceBoundItems;
 return items.map(x=>({
  number:x.sourceNumber,
  originalPrivateFullRowSha256:i===1?x.fullSourceRowSha256:x.originalFullKeyedRowSha256,
  sourceMappedSlo:i===1?x.sourceMappedSlo:i===3?x.sourceMappedSlo:x.originalMappedSlo,
  sourceAuthorDemand:i===1?x.authorItemLevel:x.originalAuthorItemDemand,
  previousReviewScope:i===0?x.scope:i===1?x.scope:i===2?x.frameworkScope:x.sourceScope,
  previousReviewPriority:i===1?x.issuePriority:x.changeNeeded,
  reviewBatch:original[i].version
 }));
});
function validate(d){
 A.equal(d.schemaVersion,1);
 A.equal(d.version,'V173');
 A.equal(d.decision,'NO_STUDENT_SCORED_RELEASE_TEACHER_APPROVAL_PENDING');
 A.equal(d.originalPrivateWordSha256,ORIGINAL);
 A.equal(d.nbfTextbookSha256,BOOK);
 A.equal(d.originalPrivateWordName,
   'Grade11_Unit7_Topic7.3_PartA_80MCQs_Study_With_Answers.docx');
 A.deepEqual(d.nbfSectionPrintedPages,[122,123,124]);
 A.deepEqual(d.officialSummativeOutcomeDemand,
   {'P-11-B-25':'Understanding','P-11-B-27':'Application','P-11-B-28':'Application'});
 A.equal(d.originalSourceFirstPassRowCount,80);
 A.equal(d.sourceWrongKeyedLettersFirstPassDetected,0);
 A.deepEqual(d.sourceAnswerLetterCountAggregate,{A:20,B:20,C:20,D:20});
 A.equal(d.sourceUniqueStemCount,80);
 A.equal(d.sourceWithinQuestionRepeatedOptionTextCount,0);
 A.deepEqual(d.originalItemCognitionCount,{K:11,U:29,A:40});
 A.deepEqual(d.originalSloAndPriorScopeMatrix,BASE_MATRIX);
 A.equal(d.priorLedgerDirectTopicCandidates,59);
 A.equal(d.priorLedgerSupportingOrCrossSlo,21);
 A.equal(d.priorLedgerDirectTopicAuthorApplicationCandidates,27);
 A.equal(d.academicTeacherFinalApprovedScoredCandidateCount,0);
 A.deepEqual(d.firstPassCompulsoryFlags,PRIOR_COMP);
 A.deepEqual(d.firstPassOptionalFlags,PRIOR_OPT);
 A.equal(d.firstPassCompulsoryFlagCount,23);
 A.equal(d.firstPassOptionalFlagCount,18);
 A.equal(d.crossBankAdditionalIssues.length,6);
 A.deepEqual(d.crossBankAdditionalIssues.map(x=>x.id),
  ['V173-S1','V173-S2','V173-S3','V173-S4','V173-S5','V173-S6']);
 for(const issue of d.crossBankAdditionalIssues){
  A.ok(issue.finding.length>80);
  A.ok(issue.action.length>70);
  A.ok(issue.originalNumbers.length>0);
  A.ok(issue.originalNumbers.every(n=>n>=1&&n<=80));
  A.ok(issue.priority.startsWith('compulsory'));
 }
 A.deepEqual(d.sourceMissingIndependentStimulus,[3]);
 A.deepEqual(d.sourceReferencesToExamplesWithAllNumericalInputs,[59,60]);
 A.deepEqual(d.sourceConditionalLinearModelNumbers,[12,24,35,42,45,46,49,78]);
 A.deepEqual(d.sourceProportionalWireComparisonNumbers,[31,61,62]);
 A.deepEqual(d.sourceTextbookGraphAxisCautionNumbers,[7,14,21,28,34,38,57,70,71,80]);
 A.deepEqual(d.sourceEnergyDensityEnrichmentNumbers,[56,79]);
 A.deepEqual(d.originalSourceAuthorExplicitSupplementaryNotes,[56,58,79]);
 A.equal(d.duplicateWatchGroups.length,14);
 A.deepEqual(d.duplicateWatchGroups.map(x=>x.ids),GROUPS);
 A.equal(d.duplicateWatchGroups.filter(x=>x.strength==='high').length,6);
 A.equal(d.duplicateWatchGroups.filter(x=>x.strength==='medium').length,8);
 for(const family of d.duplicateWatchGroups){
  A.ok(family.guidance.length>70);
  A.ok(family.concept.length>30);
 }
 A.equal(d.originalExactDuplicateStemPairs,0);
 A.equal(d.originalRepeatedOptionTextWithinSameMcqCount,0);
 A.deepEqual(d.distractorQualityTeacherWatch,[3,5,18,19,47,55,67,68,70]);
 A.equal(d.keyedWordFileEdited,false);
 A.equal(d.privateSourceAnswersOrOptionsUploaded,false);
 A.equal(d.firebaseBackendChanged,false);
 A.equal(d.liveQuestionBankChanged,false);
 A.equal(d.unit7PortalScoredQuestionCount,0);
 A.equal(d.topic71PriorTeacherScienceSignoffs,0);
 A.equal(d.topic72PriorTeacherScienceSignoffs,0);
 A.equal(d.topic73TeacherScienceSignoffs,0);
 A.equal(d.topic73TeacherCognitiveSignoffs,0);
 A.equal(d.productionTeacherBackendDeploymentApproved,false);
 A.deepEqual(d.priorBatchPaths,PATHS);
 A.equal(d.canonicalRowHashRecipeId,'TOPIC73_V169_EXPLICIT_PRIVATE_SOURCE_JSON_V1');
 A.equal(d.canonical80FullOriginalRowsHashListSha256,HASH80);
 A.equal(d.originalRowSourceRegistry.length,80);
 const registry=d.originalRowSourceRegistry;
 A.deepEqual(registry.map(x=>x.number),Array.from({length:80},(_,i)=>i+1));
 const digests=registry.map(x=>x.originalPrivateFullRowSha256);
 A.equal(new Set(digests).size,80);
 for(const hash of digests)A.match(hash,/^[a-f0-9]{64}$/);
 A.equal(sha(digests.join('\n')),HASH80);
 const priorMatrix={};
 let total={K:0,U:0,A:0,priorDirectTopic:0,priorSupportingOrCrossSlo:0,priorDirectAuthorA:0};
 const comp=[],opt=[];
 for(let i=0;i<80;i++){
  const r=registry[i],src=norm[i];
  A.equal(r.number,src.number);
  A.equal(r.originalPrivateFullRowSha256,src.originalPrivateFullRowSha256);
  A.equal(r.sourceMappedSlo,src.sourceMappedSlo);
  A.equal(r.sourceAuthorDemand,src.sourceAuthorDemand);
  A.equal(r.previousReviewScope,src.previousReviewScope);
  A.equal(r.previousReviewPriority,src.previousReviewPriority);
  A.equal(r.reviewBatch,src.reviewBatch);
  A.equal(r.teacherScienceSignoff,'PENDING');
  A.equal(r.teacherCognitiveSignoff,'PENDING');
  A.equal(r.studentScoredRelease,'HOLD');
  const slot=priorMatrix[r.sourceMappedSlo]??={
   K:0,U:0,A:0,total:0,priorDirectTopic:0,priorSupportingOrCrossSlo:0,priorDirectAuthorA:0
  };
  slot[r.sourceAuthorDemand]++;slot.total++;total[r.sourceAuthorDemand]++;
  if(r.previousReviewScope==='direct-topic-candidate'){
   slot.priorDirectTopic++;total.priorDirectTopic++;
   if(r.sourceAuthorDemand==='A'){slot.priorDirectAuthorA++;total.priorDirectAuthorA++;}
  }else{
   slot.priorSupportingOrCrossSlo++;total.priorSupportingOrCrossSlo++;
  }
  if(r.previousReviewPriority.startsWith('compulsory'))comp.push(r.number);
  else if(r.previousReviewPriority==='optional')opt.push(r.number);
  for(const k of BAN)A.equal(Object.hasOwn(r,k),false,
    'Keyed source or student data forbidden in V173 public register: '+k);
 }
 A.deepEqual(priorMatrix,BASE_MATRIX);
 A.deepEqual(total,{K:11,U:29,A:40,priorDirectTopic:59,priorSupportingOrCrossSlo:21,priorDirectAuthorA:27});
 A.deepEqual(comp,PRIOR_COMP);A.deepEqual(opt,PRIOR_OPT);
 const [a,b,c,e]=original;
 A.equal(a.sourceOriginalPrivateDocxSha256,ORIGINAL);
 A.equal(b.originalWordSha256,ORIGINAL);
 A.equal(c.sourcePrivateWordSha256,ORIGINAL);
 A.equal(e.originalSourceWordSha256,ORIGINAL);
 A.equal(a.academicTeacherIndividualApprovals,0);
 A.equal(b.teacherApprovals,0);
 A.equal(c.teacherApprovedItems,0);
 A.equal(e.teacherScienceApprovals,0);
 A.equal(e.teacherCognitiveApprovals,0);
 A.equal(a.unit7PublicScoredItems,0);
 A.equal(b.unit7ScoredItems,0);
 A.equal(c.unit7ScoredItems,0);
 A.equal(e.unit7ScoredReleasedCount,0);
 A.ok(d.nextMilestone.startsWith('V174'));
}
validate(load(TARGET));
const test=[
 x=>x.originalPrivateWordSha256='0'.repeat(64),
 x=>x.originalRowSourceRegistry[0].originalPrivateFullRowSha256='0'.repeat(64),
 x=>x.originalRowSourceRegistry[0].sourceMappedSlo='P-11-B-25',
 x=>x.originalRowSourceRegistry[0].sourceAuthorDemand='A',
 x=>x.originalRowSourceRegistry[0].studentScoredRelease='RELEASED',
 x=>x.originalRowSourceRegistry[0].teacherScienceSignoff='APPROVED',
 x=>x.originalRowSourceRegistry[0].teacherCognitiveSignoff='APPROVED',
 x=>x.originalRowSourceRegistry[0].correctOptionText='SECRET',
 x=>x.firstPassCompulsoryFlags=[],
 x=>x.firstPassOptionalFlags=[],
 x=>x.sourceMissingIndependentStimulus=[],
 x=>x.sourceConditionalLinearModelNumbers=[],
 x=>x.sourceEnergyDensityEnrichmentNumbers=[],
 x=>x.originalExactDuplicateStemPairs=3,
 x=>x.duplicateWatchGroups.pop(),
 x=>x.originalSloAndPriorScopeMatrix['P-11-B-27'].A=12,
 x=>x.priorLedgerDirectTopicCandidates=80,
 x=>x.canonical80FullOriginalRowsHashListSha256='0'.repeat(64),
 x=>x.privateSourceAnswersOrOptionsUploaded=true,
 x=>x.liveQuestionBankChanged=true,
 x=>x.firebaseBackendChanged=true,
 x=>x.unit7PortalScoredQuestionCount=1,
 x=>x.topic73TeacherScienceSignoffs=1,
 x=>x.productionTeacherBackendDeploymentApproved=true
];
for(const [i,edit] of test.entries()){
 const mutant=structuredClone(load(TARGET));edit(mutant);
 A.throws(()=>validate(mutant),undefined,'V173 safety mutation unexpectedly accepted '+i);
}
const memo=read(REPORT);
for(const phrase of [
 '80/80','23 compulsory','18 optional','14','P-11-B-25',
 'P-11-B-27','P-11-B-28','Figure 7.13','Figure 7.14',
 'Q3','Q51','Q53','Q56','Q79','Q80','59','21',
 'energy density','HOLD','teacher'
]){
 A.ok(memo.toLowerCase().includes(phrase.toLowerCase()),
  'V173 owner report omitted source review context: '+phrase);
}
const cata=load('portal/learning-catalog.json');
const unit7=cata.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(unit7.status,'planned');
A.equal(unit7.assessmentStatus,'not-published');
A.equal(unit7.questionBankCount,0);
const live=load('question-bank/manifest.json');
A.deepEqual(live.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
 [275,206,220,640,349,560]);
const u71=load('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
A.equal(u71.teacherScienceSignoffs,0);
A.equal(u71.teacherCognitiveSignoffs,0);
A.equal(u71.unit7ScoredReleaseCount,0);
const u72=load('quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
A.equal(u72.individualTeacherScienceSignoffs,0);
A.equal(u72.unit7ScoredQuestionCount,0);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,
 'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
 'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07-topic73.json')),false);
const dir=path.join(ROOT,'qa-artifacts/grade11-v173-topic73-original-80-full-bank');
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({
 version:'V173',originalRowsReviewed:80,originalWrongKeyedAnswersFirstPass:0,
 itemDemand:{K:11,U:29,A:40},sourceMappedSloCounts:{B25:23,B27:22,B28:35},
 priorDirectTopicCandidates:59,priorSupportingCandidates:21,
 firstPassCompulsoryFlags:23,firstPassOptionalFlags:18,
 crossBankDuplicateGroups:14,missingStandaloneFigureQuestion:[3],
 originalSourceWordSha:ORIGINAL,originalAll80PrivateRowsSha:HASH80,
 rejectedAcademicHoldMutations:test.length,
 originalSourceWordChanged:false,studentScoredUnit7:0,teacherApprovals:0,
 next:'V174 review original end-of-unit textbook exercises'
},null,2)+'\n');
console.log('V173 PASS: original 80 keyless canonical source hashes; K11/U29/A40; 23 compulsory+18 optional; 14 overlap groups; 24 tamper mutations rejected; student Unit7 scored=0');
