#!/usr/bin/env node
'use strict';
/**
 * V172: original Grade XI Unit 7.3 Q61–Q80 keyless academic source audit.
 *
 * Source-keyed Word and the NBF textbook were inspected off GitHub.
 * Public CI can verify SHA-256 source attestations, question/SLO/cognition
 * metadata, and release HOLD invariants, NOT independently recheck the
 * private source's keyed physics or grant individual teacher signoffs.
 */
const A=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const digest=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const prefix='quality/unit07/';
const prior1=load(prefix+'topic73-v169-q01-q20-source-bound-academic-review-no-keys.json');
const prior2=load(prefix+'topic73-v170-q21-q40-source-bound-academic-review-no-keys.json');
const prior3=load(prefix+'topic73-v171-q41-q60-source-bound-numerical-review-no-keys.json');
const current=load(prefix+'topic73-v172-q61-q80-source-bound-science-slo-review-no-keys.json');
const WORD='f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279';
const BOOK='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const FOURTH='dd0504b037a48a993a3b12b0cacae0f92c3a386e9d79ed3c62b80fcdea32a0dc';
const ALL_EIGHTY='9bb8d9e43e2b20d14c1f58607f834d03f48b3bb03e4c871c021386c261649749';
const MUST=[64,65,70,71,73,78,79],OPT=[61,62,63,67,68,72];
const SUPPORT=[61,62,64,65,66,67,68,70,71,72,73,79];
const SLO=[25,25,28,28,27,28,25,25,25,27,27,25,25,28,28,28,27,28,28,27];
const COG=['A','A','A','U','U','U','U','U','U','A','U','A','U','A','A','U','A','A','A','A'];
const PAGE=[122,122,123,123,122,123,122,122,122,122,122,122,122,123,123,123,122,123,123,122];
const BAN=['stem','question','questionText','prompt','options','optionA','optionB','optionC',
 'optionD','correctOption','correctOptionText','answer','answerLetter','key','keyLetter',
 'originalAnswer','oneLineExplanation','originalExplanation','workedSolution',
 'studentEmail','studentUid','teacherEmail','teacherUid','numericAnswer'];
function check(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V172');
 A.equal(d.unit,'Grade XI Physics Unit 7.3 Elastic Potential Energy');
 A.equal(d.batch,'Q61–Q80 original 80-item solved study edition');
 A.equal(d.originalSourceWord,prior1.sourceOriginalPrivateDocxName);
 A.equal(d.originalSourceWordSha256,WORD);
 A.equal(d.originalSourceWordSha256,prior1.sourceOriginalPrivateDocxSha256);
 A.equal(d.originalSourceWordSha256,prior2.originalWordSha256);
 A.equal(d.originalSourceWordSha256,prior3.sourcePrivateWordSha256);
 A.equal(d.originalNbfTextbookSha256,BOOK);
 A.equal(prior3.sourceNbfTextbookSha256,BOOK);
 A.deepEqual(d.printedSectionPages,[122,123,124]);
 A.deepEqual(d.officialSummativeOutcomeDemand,prior1.officialSummativeSloCognitive);
 A.equal(d.canonicalFullKeyedSourceRowRecipe,prior1.rowFingerprintRecipeId);
 A.equal(d.canonicalFullKeyedSourceRowRecipe,prior2.fingerprintRecipe);
 A.equal(d.canonicalFullKeyedSourceRowRecipe,prior3.rowDigestRecipeId);
 A.equal(d.originalBankRowCount,80);
 A.equal(d.batchOriginalRowsReviewed,20);A.equal(d.cumulativeOriginalRowsReviewed,80);
 A.equal(d.originalKeyedLetterMatchingOptionTextCount,20);
 A.equal(d.firstPassWrongAnswerKeysDetected,0);
 A.deepEqual(d.originalKeyLetterDistribution,{A:5,B:6,C:4,D:5});
 A.deepEqual(d.allOriginalKeyLetterDistribution,{A:20,B:20,C:20,D:20});
 A.deepEqual(d.authorItemDemandCounts,{K:0,U:9,A:11});
 A.deepEqual(d.allOriginalItemDemandCounts,{K:11,U:29,A:40});
 A.deepEqual(d.authoredSloItemCounts,{
  'P-11-B-25':{K:0,U:4,A:3,total:7},
  'P-11-B-28':{K:0,U:3,A:5,total:8},
  'P-11-B-27':{K:0,U:2,A:3,total:5}});
 A.deepEqual(d.allOriginalSloCounts,{
  'P-11-B-25':{K:3,U:10,A:10,total:23},
  'P-11-B-27':{K:2,U:12,A:8,total:22},
  'P-11-B-28':{K:6,U:7,A:22,total:35}});
 A.deepEqual(d.compulsoryQuestionNumbers,MUST);
 A.deepEqual(d.optionalQuestionNumbers,OPT);
 A.deepEqual(d.criticalStandaloneConditionNumbers,[78]);
 A.deepEqual(d.originalTeacherAuthorSupplementaryNotes,[56,58,79]);
 A.equal(d.authorGlobalStudyInstruction,
  'Calculations assume ideal linear elastic behavior unless stated otherwise.');
 A.ok(d.textbookGraphAxisClarification.includes('weight horizontally and extension vertically'));
 A.ok(d.textbookGraphAxisClarification.includes('Q80 correctly'));
 A.equal(d.sourceProvenanceFirst60VerifiedAgainstPreviousBatches,true);
 A.equal(d.batchJoinedHashesSha256,FOURTH);
 A.equal(d.all80JoinedHashesSha256,ALL_EIGHTY);
 A.equal(d.sourceBoundItems.length,20);
 A.deepEqual(d.sourceBoundItems.map(x=>x.sourceNumber),
   Array.from({length:20},(_,i)=>i+61));
 const fourth=d.sourceBoundItems.map(x=>x.originalFullKeyedRowSha256);
 A.equal(new Set(fourth).size,20);
 for(const h of fourth)A.match(h,/^[a-f0-9]{64}$/);
 A.equal(digest(fourth.join('\n')),FOURTH);
 const first=prior1.sourceBoundItems.map(x=>x.originalFullKeyedRowSha256);
 const second=prior2.items.map(x=>x.fullSourceRowSha256);
 const third=prior3.sourceBoundItems.map(x=>x.originalFullKeyedRowSha256);
 A.equal(digest(first.join('\n')),prior1.canonicalFirst20RowHashesJoinNewlineSha256);
 A.equal(digest(second.join('\n')),prior2.batchJoinedSha256);
 A.equal(digest(first.concat(second).join('\n')),prior2.first40JoinedSha256);
 A.equal(digest(third.join('\n')),prior3.orderedCurrentBatchHashesJoinNewlineSha256);
 A.equal(digest(first.concat(second,third).join('\n')),prior3.orderedFirst60HashesJoinNewlineSha256);
 A.equal(new Set(first.concat(second,third,fourth)).size,80);
 A.equal(digest(first.concat(second,third,fourth).join('\n')),ALL_EIGHTY);
 const totals={K:0,U:0,A:0},sloTotals={};
 for(let i=0;i<20;i++){
  const row=d.sourceBoundItems[i],n=i+61;
  A.equal(row.sourceMappedSlo,'P-11-B-'+SLO[i]);
  A.equal(row.originalAuthorItemDemand,COG[i]);
  A.equal(row.nbfCitedPrintedPage,PAGE[i]);
  A.equal(row.originalAnswerLetterMatchedSelectedOptionText,true);
  A.equal(row.firstPassSciencePhysicsChecked,true);
  A.equal(row.wrongAnswerKeyDetected,false);
  A.equal(row.sourceScope,SUPPORT.includes(n)?
    'supplementary-or-teacher-remap':'direct-topic-candidate');
  A.equal(row.changeNeeded,MUST.includes(n)?
    'compulsory-before-summative-scored-use':OPT.includes(n)?'optional':'none');
  const flagged=MUST.includes(n)||OPT.includes(n);
  A.equal(row.issueCategory===null,!flagged);
  A.equal(row.issue===null,!flagged);
  A.equal(row.proposedAction===null,!flagged);
  if(flagged){
   A.ok(row.issue.length>100,'Too little original-Q rationale for '+n);
   A.ok(row.proposedAction.length>80,'No actionable owner instruction for '+n);
  }
  A.equal(row.originalCanBeKept,true);
  A.equal(row.teacherScienceSignoff,'PENDING');
  A.equal(row.teacherCognitiveSignoff,'PENDING');
  A.equal(row.studentScoredRelease,'HOLD');
  for(const name of BAN)A.equal(Object.hasOwn(row,name),false,
    'Private source key/question/student material in public review: '+name);
  totals[COG[i]]++;
  const slot=sloTotals[row.sourceMappedSlo]??={K:0,U:0,A:0,total:0};
  slot[COG[i]]++;slot.total++;
 }
 A.deepEqual(totals,d.authorItemDemandCounts);
 A.deepEqual(sloTotals,d.authoredSloItemCounts);
 const combined={K:prior1.authorItemDemandCounts.K+prior2.originalCognitive.K+prior3.sourceItemDemandCounts.K+totals.K,
  U:prior1.authorItemDemandCounts.U+prior2.originalCognitive.U+prior3.sourceItemDemandCounts.U+totals.U,
  A:prior1.authorItemDemandCounts.A+prior2.originalCognitive.A+prior3.sourceItemDemandCounts.A+totals.A};
 A.deepEqual(combined,d.allOriginalItemDemandCounts);
 A.equal(d.originalWordModified,false);
 A.equal(d.sourceQuestionTextsOrKeysPublished,false);
 A.equal(d.gradedPortalQuestionBankModified,false);
 A.equal(d.teacherBackendOrFirebaseModified,false);
 A.equal(d.topic71AcademicApprovalPending,true);
 A.equal(d.topic72FullBankAcademicApprovalPending,true);
 A.equal(d.originalUnit06TeacherSignoffPending,true);
 A.equal(d.teacherScienceApprovals,0);
 A.equal(d.teacherCognitiveApprovals,0);
 A.equal(d.unit7ScoredReleasedCount,0);
 A.equal(d.academicDecision,
  'ORIGINAL_80_FIRST_PASS_COMPLETE_TEACHER_SIGNOFF_PENDING_NO_STUDENT_SCORING');
 A.ok(d.next.includes('V173 consolidated'));
}
check(current);
const tests=[
 x=>x.sourceBoundItems[0].originalFullKeyedRowSha256='0'.repeat(64),
 x=>x.originalSourceWordSha256='0'.repeat(64),
 x=>x.sourceBoundItems[3].sourceMappedSlo='P-11-B-25',
 x=>x.sourceBoundItems[2].originalAuthorItemDemand='K',
 x=>x.sourceBoundItems[0].answerLetter='PRIVATE_OWNER_ANSWER',
 x=>x.sourceBoundItems[0].studentScoredRelease='PUBLISHED',
 x=>x.sourceBoundItems[0].teacherScienceSignoff='APPROVED',
 x=>x.sourceBoundItems[0].teacherCognitiveSignoff='APPROVED',
 x=>x.compulsoryQuestionNumbers=[],
 x=>x.optionalQuestionNumbers=[],
 x=>x.criticalStandaloneConditionNumbers=[],
 x=>x.all80JoinedHashesSha256='0'.repeat(64),
 x=>x.allOriginalItemDemandCounts.A=41,
 x=>x.originalWordModified=true,
 x=>x.sourceQuestionTextsOrKeysPublished=true,
 x=>x.gradedPortalQuestionBankModified=true,
 x=>x.teacherBackendOrFirebaseModified=true,
 x=>x.unit7ScoredReleasedCount=1,
 x=>x.topic72FullBankAcademicApprovalPending=false,
 x=>x.academicDecision='APPROVED'
];
for(const [i,mutate] of tests.entries()){
 const copy=structuredClone(current);mutate(copy);
 A.throws(()=>check(copy),undefined,'Release guard accepted mutation '+i);
}
const memo=read('quality/grade11-v172-topic73-q61-q80-science-answer-slo-qc.md');
for(const n of MUST.concat(OPT))A.ok(memo.includes('**'+n+'**'),
 'Amendment-only memo missing Q'+n);
for(const phrase of ['80/80','Q61–80','P-11-B-25','P-11-B-27','P-11-B-28',
 'Figure 7.14','linear','HOLD','teacher','energy density']){
 A.ok(memo.toLowerCase().includes(phrase.toLowerCase()),
 'Source report omits '+phrase);
}
const v168=load(prefix+'topic72-v168-all80-consolidated-academic-qc-no-keys.json');
A.equal(v168.fullOriginalQuestionRows,80);
A.equal(v168.individualTeacherScienceSignoffs,0);
A.equal(v168.unit7ScoredQuestionCount,0);
const v154=load(prefix+'topic71-v154-80-source-bound-teacher-decision-queue.json');
A.equal(v154.teacherScienceSignoffs,0);
A.equal(v154.teacherCognitiveSignoffs,0);
A.equal(v154.unit7ScoredReleaseCount,0);
const catalog=load('portal/learning-catalog.json');
const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');
A.equal(u7.assessmentStatus,'not-published');
A.equal(u7.questionBankCount,0);
A.deepEqual(load('question-bank/manifest.json').grades.find(g=>g.grade===11)
 .units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load(prefix+'topic71-v160-production-readiness-no-go.json').decision,
 'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load(prefix+'topic71-v161-staging-callable-contract-no-deploy.json').decision,
 'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07-topic73.json')),false);
const out=path.join(ROOT,'qa-artifacts/grade11-v172-topic73-q61-q80-source-qc');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
 version:'V172',originalSourceBankSha256:WORD,
 firstPassReviewedOriginals:80,latestBatch:20,wrongKeyedAnswersDetected:0,
 originalCognition:{K:11,U:29,A:40},
 compulsoryReviewNumbers:MUST,optionalReviewNumbers:OPT,
 sourceCorrectLetterCounts:{A:20,B:20,C:20,D:20},
 firstPassScienceTeacherApprovals:0,studentScoredUnit7:0,
 all80KeylessFingerprintSha256:ALL_EIGHTY,
 intentionalReleaseMutationsRejected:tests.length,
 next:'V173 consolidated original Topic7.3 source-quality blueprint'
},null,2)+'\n');
console.log('V172 PASS: original 80/80 source rows, first-pass physics keyless QC, 7 compulsory+6 optional, 20 release-mutation attempts rejected, zero scored Unit7.');
