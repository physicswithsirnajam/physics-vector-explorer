#!/usr/bin/env node
'use strict';
/*
 * V168: offline, keyed-free consolidated academic/blueprint integrity audit.
 *
 * Original NBF book and owner source Word must remain PRIVATE; CI cannot
 * recompute full-row hashes from their unseen keyed contents. This script
 * validates an owner-source provenance attestation, its canonical encoding,
 * original SCIENCE FIRST-PASS holds and *zero* student scored question releases.
 */
const assert=require('node:assert/strict');
const crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const FILES=[
 'quality/unit07/topic72-v164-first20-source-bound-teacher-review-no-keys.json',
 'quality/unit07/topic72-v165-q21-q40-source-bound-review-no-keys.json',
 'quality/unit07/topic72-v166-q41-q60-source-bound-numerical-review-no-keys.json',
 'quality/unit07/topic72-v167-q61-q80-source-bound-scenario-review-no-keys.json'
];
const BANK='quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json';
const MEMO='quality/grade11-v168-topic72-all80-consolidated-academic-qc.md';
const ORIGINAL_WORD_SHA='a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada';
const ORIGINAL_NBF_SHA='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const LIST_SHA='bfcba8b53f22093f481ce9c5ba6ca5c62512d4ebb5a697bcc3609f7563a069cf';
const FIRST_SHA='5a2feb48d5c6a8dc7b7236c45dfd1cc38641a994b59ba66b59846127106e7a4f';
const COMPULSORY=[
 7,8,9,15,17,18,19,26,33,34,38,39,46,47,51,52,53,54,55,56,62,63,72,76,80
];
const OPTIONAL=[12,13,25,27,36,57,74,75];
const CONTEXT_REFERENCES=[9,20,28,29,30,31,33,34,39,40,57,59,76,79,80];
const CONTEXT_BLOCKED=[9,20,28,29,30,31,33,34,39,40,57,79,80];
const CONTEXT_SELF_CONTAINED=[59,76];
const DUPLICATES=[
 [33,80],[37,74],[36,75],[5,66],[6,61],[14,64,67],[50,60]
];
const MATRIX={
 'P-11-B-23':{count:11,core:6,supporting:5,K:4,U:7,A:0,coreApplication:0},
 'P-11-B-24':{count:48,core:31,supporting:17,K:9,U:11,A:28,coreApplication:20},
 'P-11-B-26':{count:21,core:15,supporting:6,K:7,U:14,A:0,coreApplication:0}
};
const BAN=[
 'stem','question','questionText','prompt','options','optionA','optionB',
 'optionC','optionD','correctOption','correctOptionText','correctLetter',
 'keyLetter','answerLetter','oneLineExplanation','sourceExplanation',
 'originalExplanation','answer','answerKey','key','numericalAnswer',
 'workedSolution','candidateStem','candidateOptions','studentUid',
 'studentEmail','teacherUid','teacherEmail'
];
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const jload=p=>JSON.parse(read(p));
const sha256=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const rng=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const sorted=(a)=>[...a].sort((x,y)=>x-y);
function checkContract(d,prev){
 assert.equal(d.schemaVersion,1);
 assert.equal(d.version,'V168');
 assert.equal(d.reviewType,'FULL_ORIGINAL_80_FIRST_PASS_CONSOLIDATED_BLUEPRINT_AND_CROSS_BANK_QC');
 assert.equal(d.decision,'ACADEMIC_TEACHER_APPROVAL_PENDING_NO_STUDENT_SCORED_RELEASE');
 assert.equal(d.sourceOriginalPrivateDocxSha256,ORIGINAL_WORD_SHA);
 assert.equal(d.sourceNbfTextbookSha256,ORIGINAL_NBF_SHA);
 assert.deepEqual(d.verifiedNbfPrintedPages,rng(116,121));
 assert.equal(d.sourceOriginalPrivateDocxName,
  'Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx');
 assert.equal(d.officialFramework,prev[0].officialFramework);
 assert.deepEqual(d.officialSummativeSloLevels,prev[0].officialSummativeSloLevels);
 assert.deepEqual(d.priorBatchPaths,FILES);
 assert.equal(d.canonicalHashRecipeId,'V165_EXPLICIT_JSON_SOURCE_ROW_V1');
 assert.equal(d.canonicalHashRecipeText,prev[1].rowDigestMethod);
 assert.equal(d.canonicalHashRecipeText,prev[2].rowDigestMethod);
 assert.equal(d.canonicalHashRecipeText,prev[3].rowDigestMethod);
 assert.equal(d.priorV164RowFingerprintRecipeCompatible,false);
 assert.ok(d.sourceProvenanceCorrection.includes('V164'));
 assert.ok(d.sourceProvenanceCorrection.includes('V165'));
 assert.equal(d.fullOriginalQuestionRows,80);
 assert.equal(d.firstPassSourceRowsReviewed,80);
 assert.equal(d.sourceAnswerLettersMatchSelectedOptionText,80);
 assert.equal(d.sourceWrongKeyLettersDetectedFirstPass,0);
 assert.deepEqual(d.correctAnswerLetterAggregateCounts,{A:20,B:20,C:20,D:20});
 assert.equal(d.questionRowsWithDuplicateFourOptionTexts,0);
 assert.deepEqual(d.sourceOriginalCognitiveCounts,{K:20,U:32,A:28});
 assert.deepEqual(d.sourceSloCounts,MATRIX);
 assert.deepEqual(d.firstPassCompulsoryQuestionNumbers,COMPULSORY);
 assert.deepEqual(d.firstPassOptionalQuestionNumbers,OPTIONAL);
 assert.equal(d.firstPassCompulsoryFlagCount,25);
 assert.equal(d.firstPassOptionalFlagCount,8);
 assert.equal(d.strictSourceTopicDirectCandidates,52);
 assert.equal(d.supplementaryTextbookCandidates,28);
 assert.deepEqual(d.sourceStandaloneContextReferenceNumbers,CONTEXT_REFERENCES);
 assert.deepEqual(d.hardStandAloneStimulusOrRewriteBeforeScoredNumbers,CONTEXT_BLOCKED);
 assert.deepEqual(d.sourceContextReferenceIsSelfContainedNumbers,CONTEXT_SELF_CONTAINED);
 const critical=d.newCrossBatchCriticalIssue;
 assert.equal(critical.id,'CROSS-01');
 assert.equal(critical.questionNumber,57);
 assert.equal(critical.priority,'COMPULSORY_BEFORE_STANDALONE_SCORED_USE');
 assert.equal(critical.teacherDecision,'PENDING');
 assert.equal(critical.separateFromV166OptionalRounding,true);
 assert.ok(critical.reason.includes('NBF Example 7.2'));
 assert.ok(critical.remedy.includes('self-contained'));
 assert.equal(d.visualReferenceRequirement.id,'CROSS-02');
 assert.equal(d.visualReferenceRequirement.mustAttachAccessibleStimulusOrRewrite,13);
 assert.equal(d.visualReferenceRequirement.sourceReferencesIncludingSelfContained,15);
 assert.equal(d.visualReferenceRequirement.scoringHold,true);
 assert.equal(d.visualReferenceRequirement.teacherDecision,'PENDING');
 assert.ok(d.visualReferenceRequirement.imageAccessibilityRequirement.length>100);
 assert.deepEqual(d.duplicateReviewCandidates.map(x=>x.ids),DUPLICATES);
 assert.ok(d.duplicateReviewCandidates.every(x=>x.teacherDecision==='PENDING'));
 assert.deepEqual(d.distinctTextbookFigurePointQuestions,
  [9,20,28,29,30,31,33,34,79,80]);
 assert.deepEqual(d.distractorAudit.followupQualityCandidates,[31,39,40,68]);
 assert.equal(d.distractorAudit.exactOptionDuplicationCount,0);
 assert.equal(d.distractorAudit.firstPassCorrectOptionTextMismatchCount,0);
 assert.equal(d.distractorAudit.teacherReview,'PENDING');
 assert.equal(d.wholeBankIssueStatus.studentScoredRelease,'HOLD');
 assert.equal(d.wholeBankIssueStatus.standaloneStimulusReadiness,
  'BLOCKED_FOR_13_SOURCE_REFERENCES');
 assert.equal(d.wholeBankIssueStatus.sourceProvenanceV164Normalization,
  'CANONICAL_SHA_RECOMPUTED_WITH_V165_RECIPE');
 assert.equal(d.wholeBankIssueStatus.sloBlueprintTeacherCertification,'PENDING');
 assert.equal(d.wholeBankIssueStatus.keyAndDistractorIndependentTeacherSignoff,'PENDING');
 assert.equal(d.individualTeacherScienceSignoffs,0);
 assert.equal(d.individualTeacherCognitiveSignoffs,0);
 assert.equal(d.unit7ScoredQuestionCount,0);
 assert.equal(d.existingLegacyGradeXIProvisionalItems,2250);
 assert.equal(d.existingUnit6TeacherPending,560);
 for(const k of ['ownerPrivateWordEdited','privateKeyedQuestionsAddedToGitHub',
  'firebaseConsoleChanged','scoredTestBuilderChanged']){
  assert.equal(d[k],false,'Forbidden release/mutation flag: '+k);
 }
 assert.equal(d.nextMilestone,
  'V169_BEGIN_TOPIC73_PRIVATE_ORIGINAL_80_MCQ_BANK_Q1_TO_Q20_QC_WHILE_TOPIC72_SIGNOFF_QUEUE_REMAINS_HELD');
 assert.equal(d.canonicalSourceRows.length,80);
 assert.deepEqual(d.canonicalSourceRows.map(x=>x.sourceNumber),rng(1,80));
 const hashes=d.canonicalSourceRows.map(x=>x.sha256);
 assert.equal(new Set(hashes).size,80);
 for(const h of hashes)assert.match(h,/^[a-f0-9]{64}$/);
 assert.equal(sha256(hashes.slice(0,20).join('\n')),FIRST_SHA);
 assert.equal(sha256(hashes.join('\n')),LIST_SHA);
 assert.equal(d.q1To20CanonicalRowHashesJoinNewlineSha256,FIRST_SHA);
 assert.equal(d.all80CanonicalRowHashesJoinNewlineSha256,LIST_SHA);
 const originals=prev.flatMap(x=>x.sourceBoundItems);
 assert.deepEqual(originals.map(x=>x.sourceNumber),rng(1,80));
 let mapped={};
 for(let i=0;i<80;i++){
  const item=d.canonicalSourceRows[i],source=originals[i];
  assert.equal(item.sourceNumber,source.sourceNumber);
  if(i>=20)assert.equal(item.sha256,source.fullSourceRowSha256);
  if(i<20)assert.notEqual(item.sha256,source.fullSourceRowSha256);
  assert.equal(item.originalMappedSlo,source.sourceMappedSlo);
  assert.equal(item.originalCognitiveCode,source.originalItemCognitiveCode);
  assert.equal(item.sourceSummativeScope,source.frameworkScope);
  assert.equal(item.firstPassIssue,source.changeNeeded);
  assert.equal(item.academicTeacherReview,'PENDING');
  assert.equal(item.scoredRelease,'HOLD');
  const slot=mapped[item.originalMappedSlo]??={count:0,core:0,supporting:0,
   K:0,U:0,A:0,coreApplication:0};
  slot.count++;
  slot[item.sourceSummativeScope==='direct-topic-core'?'core':'supporting']++;
  slot[item.originalCognitiveCode]++;
  if(item.sourceSummativeScope==='direct-topic-core'&&
   item.originalCognitiveCode==='A')slot.coreApplication++;
  for(const field of BAN)assert.equal(Object.hasOwn(item,field),false,
   'Original keyed option or student data may not appear in source audit: '+field);
 }
 assert.deepEqual(mapped,MATRIX);
 assert.deepEqual(d.firstPassCompulsoryQuestionNumbers,
  originals.filter(x=>x.changeNeeded.startsWith('compulsory')).map(x=>x.sourceNumber));
 assert.deepEqual(d.firstPassOptionalQuestionNumbers,
  originals.filter(x=>x.changeNeeded.startsWith('optional')).map(x=>x.sourceNumber));
 return true;
}
function mutationChecks(d,prev){
 const clone=()=>structuredClone(d);
 const tests=[
  ['release one scored question',x=>x.unit7ScoredQuestionCount=1],
  ['claim academic teacher signoff',x=>x.individualTeacherScienceSignoffs=1],
  ['permit private source question payload',x=>x.canonicalSourceRows[0].stem='secret'],
  ['alter original source Word provenance',x=>x.sourceOriginalPrivateDocxSha256='0'.repeat(64)],
  ['weaken source hash canonical digest',x=>x.canonicalSourceRows[0].sha256='0'.repeat(64)],
  ['modify legacy source rows without provenance',x=>x.canonicalSourceRows[65].sha256='0'.repeat(64)],
  ['drop missing Q57 input context',x=>x.hardStandAloneStimulusOrRewriteBeforeScoredNumbers=x.hardStandAloneStimulusOrRewriteBeforeScoredNumbers.filter(n=>n!==57)],
  ['pretend less than 13 standalone blockers',x=>x.visualReferenceRequirement.mustAttachAccessibleStimulusOrRewrite=12],
  ['approve teacher duplicate decision in ledger',x=>x.duplicateReviewCandidates[0].teacherDecision='APPROVED'],
  ['claim correct answer mismatch',x=>x.distractorAudit.firstPassCorrectOptionTextMismatchCount=2],
  ['alter official SLO demand',x=>x.sourceSloCounts['P-11-B-24'].A=27],
  ['false score eligibility',x=>x.canonicalSourceRows[0].scoredRelease='RELEASED'],
  ['remove first-pass amendments',x=>x.firstPassCompulsoryQuestionNumbers=[]],
  ['treat old inconsistent V164 source hash as canonical',x=>x.priorV164RowFingerprintRecipeCompatible=true],
  ['fake more than 80 keyed rows',x=>x.sourceAnswerLettersMatchSelectedOptionText=81],
  ['turn standalone stimulus hold to unblocked',x=>x.wholeBankIssueStatus.standaloneStimulusReadiness='APPROVED'],
  ['modify original doc edit flag',x=>x.ownerPrivateWordEdited=true],
  ['shift from pending to approved teacher',x=>x.canonicalSourceRows[60].academicTeacherReview='APPROVED']
 ];
 for(const [label,fn] of tests){
  const altered=clone();fn(altered);
  assert.throws(()=>checkContract(altered,prev),
   undefined,'Weakened V168 source academic gate was accepted: '+label);
 }
 return tests.length;
}
function main(){
 const d=jload(BANK),prev=FILES.map(jload),memo=read(MEMO);
 for(const p of prev){
  assert.equal(p.sourceOriginalPrivateDocxSha256,ORIGINAL_WORD_SHA);
  assert.equal(p.sourceNbfTextbookSha256,ORIGINAL_NBF_SHA);
  assert.equal(p.fullBankOriginalRows,80);
  assert.equal(p.firstPassReviewed,20);
  assert.equal(p.keyLetterErrorsDetected,0);
  assert.equal(p.unit7StudentScoredQuestionCount,0);
 }
 checkContract(d,prev);
 const mutationCount=mutationChecks(d,prev);
 for(const phrase of [
  'Q57','Q33','Q80','Q37','Q74','Q36','Q75',
  '80/80','25 compulsory','8 optional',
  '20','32','28','52','28',
  'P-11-B-23','P-11-B-24','P-11-B-26',
  'Figure 7.12','Table 7.1','13 items','Teacher',
  'HOLD','canonical','App Check','Firebase',
  '0 incorrect','supplementary'
 ]){
  assert.ok(memo.toLowerCase().includes(phrase.toLowerCase()),
   'Missing source-informed whole-bank memo topic: '+phrase);
 }
 const c=jload('portal/learning-catalog.json');
 const unit7=c.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(unit7.status,'planned');
 assert.equal(unit7.assessmentStatus,'not-published');
 assert.equal(unit7.questionBankCount,0);
 const manifest=jload('question-bank/manifest.json');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 const ledger71=jload('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
 assert.equal(ledger71.teacherScienceSignoffs,0);
 assert.equal(ledger71.teacherCognitiveSignoffs,0);
 assert.equal(ledger71.unit7ScoredReleaseCount,0);
 assert.equal(jload('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
 assert.equal(jload('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,
  'NO_GO_DEPLOYMENT_BLOCKED');
 assert.equal(jload('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
  'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 assert.ok(!fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')));
 assert.ok(!fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07-topic72.json')));
 const report={version:'V168',sourceRows:80,firstPassChecked:80,wrongKeyLettersDetected:0,
  sourceOriginalWordSha:ORIGINAL_WORD_SHA,
  aggregateAnswerOptionBalance:{A:20,B:20,C:20,D:20},
  cognitiveDemand:{K:20,U:32,A:28},
  directSummativeCandidates:52,supplementaryCandidates:28,
  previouslyFlaggedCompulsory:25,previouslyFlaggedOptional:8,
  additionalCriticalStandaloneMissingInputs:[57],
  externalFigureTableExampleBlockers:13,
  severeDuplicateWatchPairs:[[33,80],[37,74],[36,75]],
  canonicalSourceHashRepairedForFirst20:true,
  immutable80HashListSha:LIST_SHA,
  weakenedAcademicHoldMutationCasesRejected:mutationCount,
  privateOriginalAnswersReleased:false,teacherApprovals:0,
  scoredUnit7Items:0,productionTeacherBackendDeployed:false};
 const out=path.join(ROOT,'qa-artifacts/grade11-v168-topic72-80item-blueprint');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(report,null,2)+'\n');
 console.log('V168 PASS: original 80 canonical row SHA provenance, 25+8 flags, 13 external context blockers incl Q57, 18 security mutations; 0 teacher approvals/0 scored Unit7');
}
try{main()}catch(e){console.error('V168 FAIL:',e.stack||e);process.exitCode=1;}
