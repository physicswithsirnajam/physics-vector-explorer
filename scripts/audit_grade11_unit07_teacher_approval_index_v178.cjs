#!/usr/bin/env node
'use strict';
/**
 * V178 — consolidate 274 original XI Unit7 identities without disclosing
 * private NBF question text, owner-keyed Word or full worked answer payloads.
 * This is a PENDING teacher queue, not an approval, grade or live import.
 */
const A=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const INDEX='quality/unit07/unit07-v178-consolidated-274-teacher-approval-index-no-keys.json';
const MEMO='quality/grade11-v178-unit07-all274-teacher-approval-priority-and-release-gates.md';
const FILES={
 topic71:'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json',
 topic72:'quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json',
 topic73:'quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json',
 exerciseMcq:'quality/unit07/unit07-v174-end-exercise-mcq01-10-fig-bound-no-keys.json',
 exerciseShort:'quality/unit07/unit07-v175-end-exercise-short01-11-image-bound-no-answers.json',
 exerciseComprehensive:'quality/unit07/unit07-v176-end-exercise-comprehensive01-08-image-bound-no-answers.json',
 exerciseNumerical:'quality/unit07/unit07-v177-end-exercise-numerical01-05-image-bound-no-keys.json'
};
const GROUPS=[
 ['topic71','V154',80,15,10,7,48],
 ['topic72','V168',80,25,8,0,47],
 ['topic73','V173',80,23,18,0,39],
 ['exerciseMcq','V174',10,5,1,0,4],
 ['exerciseShort','V175',11,5,5,0,1],
 ['exerciseComprehensive','V176',8,6,2,0,0],
 ['exerciseNumerical','V177',5,4,0,0,1]
];
const PRIORITY_LABELS={
 COMPULSORY_TEACHING_CLARIFICATION:'compulsory',
 COMPULSORY_ORIGINAL_EXPLANATION:'compulsory',
 COMPULSORY_CANDIDATE_WORDING_APPROVAL:'compulsory',
 BLOCKING_ORIGINAL_EXPLANATION:'compulsory',
 OPTIONAL_SOURCE_OR_DISTRACTOR_REFINEMENT:'optional',
 COGNITIVE_RECLASSIFICATION_REVIEW:'cognitive',
 STANDARD_PER_ITEM_TEACHER_REVIEW:'ordinary'
};
const BANNED=['stem','question','questionText','originalQuestionText',
 'correctAnswer','correctOption','answerKey','fullWorkedSolution',
 'privateAnswerPayload','sourceImageBytes','studentEmail','studentUid',
 'teacherEmail','teacherUid','teacherApprovalToken'];
const sha=x=>typeof x==='string' && /^[a-f0-9]{64}$/.test(x);
const ordered=(x,n)=>A.deepEqual(x,Array.from({length:n},(_,i)=>i+1));
const uniqueInts=(arr,max)=>{A.equal(new Set(arr).size,arr.length);for(const n of arr)A.ok(Number.isInteger(n)&&n>=1&&n<=max);};
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V178');
 A.equal(d.prerequisite.prNumber,281);A.equal(d.prerequisite.version,'V177');
 A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'97b90cda99cac7d4ab2f6c9921fae0ece145f6c3');
 A.equal(d.sourceSlices.length,7);
 A.equal(d.totalOriginalItems,274);
 A.equal(d.firstPassReviewedItemCount,274);
 A.equal(d.ownerAuthoredMcqItems,240);
 A.equal(d.originalTextbookExerciseItems,34);
 A.deepEqual(d.originalTextbookBreakdown,{mcq:10,short:11,comprehensive:8,numerical:5});
 A.deepEqual(d.disjointFirstPassPriorityCensus,{
  compulsory:83,optional:44,additionalCognitiveQueueOnly:7,ordinary:140});
 A.ok(d.priorityInterpretation.includes('NOT counts of wrong answers'));
 A.equal(d.teacherApprovalDataPolicy.individualReviewScience,'PENDING');
 A.equal(d.teacherApprovalDataPolicy.individualReviewCognitive,'PENDING');
 A.equal(d.teacherApprovalDataPolicy.perItemRelease,'HOLD');
 A.ok(d.teacherApprovalDataPolicy.teacherIdentity.includes('AUTHENTICATED_BACKEND_ONLY'));
 A.equal(d.teacherApprovalDataPolicy.disallowedCurrentOperations.length,6);
 A.equal(d.requiredTeacherDecisionSequence.length,8);
 A.equal(d.teacherScienceApprovals,0);A.equal(d.teacherCognitiveApprovals,0);
 A.equal(d.teacherScoredReleaseApprovals,0);A.equal(d.scoredUnit7PortalQuestions,0);
 for(const k of ['originalKeyedSourceFilesModified','sourceBookImagesOrQuestionsPublished',
  'existingScoredBankChanged','firebaseConfigOrTeacherRoleChanged',
  'stagingOrProductionTeacherBackendDeployed'])A.equal(d[k],false);
 A.equal(d.academicDecision,
  'FIRST_PASS_274_REGISTERED_TEACHER_REVIEW_QUEUE_ONLY_ZERO_SIGNOFFS_ZERO_SCORED_RELEASE');
 A.ok(d.nextMilestone.startsWith('V179'));
 for(const key of BANNED){
  A.equal(Object.hasOwn(d,key),false,'Forbidden private payload at index.'+key);
 }
 for(let i=0;i<GROUPS.length;i++){
  const [id,version,n,c,o,cc,std]=GROUPS[i],r=d.sourceSlices[i];
  A.equal(r.id,id);A.equal(r.path,FILES[id]);A.equal(r.firstPassVersion,version);
  A.equal(r.count,n);A.equal(r.compulsoryPriorityCount,c);
  A.equal(r.optionalPriorityCount,o);
  A.equal(r.cognitiveReclassificationPriorityCount,cc);
  A.equal(r.ordinaryPriorityCount,std);
  A.equal(c+o+cc+std,n);
  A.ok(r.criticalNotes.length>60);
  for(const key of BANNED)A.equal(Object.hasOwn(r,key),false);
 }
 A.deepEqual(d.sourceSlices[0].hardSourceDecisionNumbers,[10,15,62,76]);
 A.deepEqual(d.sourceSlices[1].standaloneStimulusBlockers,
  [9,20,28,29,30,31,33,34,39,40,57,79,80]);
 A.deepEqual(d.sourceSlices[1].crossBatchOverrideCompulsory,[57]);
 A.deepEqual(d.sourceSlices[2].missingFigureBlockers,[3]);
 A.deepEqual(d.sourceSlices[2].conditionalLinearLoadingNumbers,
  [12,24,35,42,45,46,49,78]);
 A.deepEqual(d.sourceSlices[2].blueprintRecheckNumbers,[7,14,26]);
 A.deepEqual(d.sourceSlices[3].standaloneAmbiguousNumbers,[3,5,10]);
 A.deepEqual(d.sourceSlices[6].printedHintFullyConsistentNumbers,[2]);
 A.deepEqual(d.sourceSlices[6].printedHintConditionalNumbers,[1]);
 A.deepEqual(d.sourceSlices[6].printedHintMismatchNumbers,[3,4,5]);
}
const d=load(INDEX);
validate(d);
const prior=Object.fromEntries(Object.entries(FILES).map(([id,p])=>[id,load(p)]));
const a=prior.topic71,b=prior.topic72,c=prior.topic73,m=prior.exerciseMcq,
 sh=prior.exerciseShort,co=prior.exerciseComprehensive,nu=prior.exerciseNumerical;
// Confirm every one of the 240 original author rows—not merely title counts.
A.equal(a.version,'V154');A.equal(a.entries.length,80);
A.equal(a.candidateQuestionsCount,80);
A.deepEqual(a.mandatorySourceEditsOrApprovals,[10,15,62,76]);
A.deepEqual(a.hardBlockedAnswerKeyImportUntilExplanationRepaired,[76]);
const pcounts={compulsory:0,optional:0,cognitive:0,ordinary:0};
const ids=new Set(),hashes=new Set();let total=0;
const register=(grp,n,shaValue)=>{
 A.ok(Number.isInteger(n)&&n>=1);
 A.ok(sha(shaValue),'Invalid keyless source SHA identity '+grp+':'+n);
 const id=grp+':'+String(n).padStart(3,'0');
 A.equal(ids.has(id),false,'Duplicate original unit7 item ID '+id);
 ids.add(id);hashes.add(grp+':'+shaValue);total++;
};
ordered(a.entries.map(x=>x.sourceNumber),80);
for(const x of a.entries){
 register('topic71',x.sourceNumber,x.originalFullRowSha256);
 A.equal(x.academicScienceDecision,'PENDING');
 A.equal(x.academicCognitiveDecision,'PENDING');
 A.equal(x.eligibleForScoredStudentRelease,false);
 A.equal(x.originalWordAnswerKeyIndependentlyApproved,false);
 const priority=PRIORITY_LABELS[x.reviewQueuePriority];
 A.ok(priority,'Unknown Topic7.1 review priority: '+x.reviewQueuePriority);
 pcounts[priority]++;
}
A.equal(b.version,'V168');A.equal(b.canonicalSourceRows.length,80);
A.equal(b.fullOriginalQuestionRows,80);
ordered(b.canonicalSourceRows.map(x=>x.sourceNumber),80);
uniqueInts(b.firstPassCompulsoryQuestionNumbers,80);
uniqueInts(b.firstPassOptionalQuestionNumbers,80);
A.equal(b.firstPassCompulsoryQuestionNumbers.length,25);
A.equal(b.firstPassOptionalQuestionNumbers.length,8);
A.deepEqual(b.hardStandAloneStimulusOrRewriteBeforeScoredNumbers,
 [9,20,28,29,30,31,33,34,39,40,57,79,80]);
A.equal(b.newCrossBatchCriticalIssue.questionNumber,57);
A.equal(b.individualTeacherScienceSignoffs,0);
A.equal(b.individualTeacherCognitiveSignoffs,0);
A.equal(b.unit7ScoredQuestionCount,0);
for(const x of b.canonicalSourceRows){
 register('topic72',x.sourceNumber,x.sha256);
 A.equal(x.academicTeacherReview,'PENDING');
 A.equal(x.scoredRelease,'HOLD');
 pcounts[b.firstPassCompulsoryQuestionNumbers.includes(x.sourceNumber)?'compulsory':
 b.firstPassOptionalQuestionNumbers.includes(x.sourceNumber)?'optional':'ordinary']++;
}
A.equal(c.version,'V173');A.equal(c.originalRowSourceRegistry.length,80);
A.equal(c.originalSourceFirstPassRowCount,80);
ordered(c.originalRowSourceRegistry.map(x=>x.number),80);
uniqueInts(c.firstPassCompulsoryFlags,80);
uniqueInts(c.firstPassOptionalFlags,80);
A.equal(c.firstPassCompulsoryFlags.length,23);
A.equal(c.firstPassOptionalFlags.length,18);
A.deepEqual(c.sourceMissingIndependentStimulus,[3]);
A.equal(c.topic73TeacherScienceSignoffs,0);A.equal(c.topic73TeacherCognitiveSignoffs,0);
A.equal(c.unit7PortalScoredQuestionCount,0);
for(const x of c.originalRowSourceRegistry){
 register('topic73',x.number,x.originalPrivateFullRowSha256);
 A.equal(x.teacherScienceSignoff,'PENDING');
 A.equal(x.teacherCognitiveSignoff,'PENDING');
 A.equal(x.studentScoredRelease,'HOLD');
 pcounts[c.firstPassCompulsoryFlags.includes(x.number)?'compulsory':
 c.firstPassOptionalFlags.includes(x.number)?'optional':'ordinary']++;
}
// Check all original textbook exercise items and the preserved review flags.
function checkTextbook({group,rows,count,number,hash,science,cognitive,release,
 comp,opt,priority,priorityFor,sourceStatus}){
 ordered(rows.map(number),count);
 uniqueInts(comp,count);uniqueInts(opt,count);
 A.equal(new Set([...comp,...opt]).size,comp.length+opt.length);
 for(const x of rows){
  register(group,number(x),hash(x));
  A.equal(x[science],'PENDING');
  A.equal(x[cognitive],'PENDING');
  A.equal(x[release],'HOLD');
  if(sourceStatus)sourceStatus(x);
  pcounts[comp.includes(number(x))?'compulsory':
   opt.includes(number(x))?'optional':'ordinary']++;
 }
}
A.equal(m.version,'V174');
checkTextbook({group:'exerciseMcq',rows:m.sourceBoundItems,count:10,
 number:x=>x.sourceQuestionNumber,hash:x=>x.renderedQuestionRgbPixelSha256,
 science:'teacherScienceSignoff',cognitive:'teacherCognitiveSignoff',
 release:'studentScoredRelease',comp:m.compulsoryIssueQuestionNumbers,
 opt:m.optionalIssueQuestionNumbers});
A.equal(sh.version,'V175');
checkTextbook({group:'exerciseShort',rows:sh.items,count:11,
 number:x=>x.sourceQuestionNumber,hash:x=>x.renderedSourceCropRgbSha256,
 science:'teacherScienceSignoff',cognitive:'teacherCognitiveSignoff',
 release:'scoredPortalRelease',comp:sh.compulsoryAcademicDecisionNumbers,
 opt:sh.optionalScientificTeachingReviewNumbers});
A.equal(co.version,'V176');
checkTextbook({group:'exerciseComprehensive',rows:co.items,count:8,
 number:x=>x.sourceQuestionNumber,hash:x=>x.renderedSourceCropRgbSha256,
 science:'teacherScienceSignoff',cognitive:'teacherCognitiveSignoff',
 release:'studentScoredRelease',comp:co.compulsoryTeacherAcademicDecisionNumbers,
 opt:co.optionalTeacherEditorialDecisionNumbers});
A.equal(nu.version,'V177');
A.deepEqual(nu.printedHintConditionallyReproducibleNumbers,[1]);
A.deepEqual(nu.printedHintsFullyConsistentNumbers,[2]);
A.deepEqual(nu.printedHintsInconsistentWithGivenDataNumbers,[3,4,5]);
checkTextbook({group:'exerciseNumerical',rows:nu.items,count:5,
 number:x=>x.sourceQuestionNumber,hash:x=>x.uploadedPageCropRgbSha256,
 science:'teacherScienceSignoff',cognitive:'teacherCognitiveSignoff',
 release:'studentScoredRelease',comp:nu.compulsoryTeacherReviewNumbers,
 opt:nu.optionalTeacherReviewNumbers});
A.equal(total,274);A.equal(ids.size,274);A.equal(hashes.size,274);
A.deepEqual(pcounts,{compulsory:83,optional:44,cognitive:7,ordinary:140});
A.deepEqual({compulsory:pcounts.compulsory,optional:pcounts.optional,
 additionalCognitiveQueueOnly:pcounts.cognitive,ordinary:pcounts.ordinary},
 d.disjointFirstPassPriorityCensus);
const modifications=[
 x=>x.prerequisite.merged=false,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.totalOriginalItems=273,
 x=>x.ownerAuthoredMcqItems=239,
 x=>x.originalTextbookExerciseItems=35,
 x=>x.sourceSlices.pop(),
 x=>x.sourceSlices[0].path='src/fake.json',
 x=>x.sourceSlices[0].compulsoryPriorityCount=14,
 x=>x.sourceSlices[0].hardSourceDecisionNumbers=[],
 x=>x.sourceSlices[1].standaloneStimulusBlockers=[],
 x=>x.sourceSlices[1].crossBatchOverrideCompulsory=[],
 x=>x.sourceSlices[2].missingFigureBlockers=[],
 x=>x.sourceSlices[2].conditionalLinearLoadingNumbers=[],
 x=>x.sourceSlices[2].blueprintRecheckNumbers=[],
 x=>x.sourceSlices[3].standaloneAmbiguousNumbers=[5],
 x=>x.sourceSlices[6].printedHintFullyConsistentNumbers=[1,2],
 x=>x.sourceSlices[6].printedHintConditionalNumbers=[],
 x=>x.sourceSlices[6].printedHintMismatchNumbers=[4,5],
 x=>x.disjointFirstPassPriorityCensus.compulsory=82,
 x=>x.disjointFirstPassPriorityCensus.additionalCognitiveQueueOnly=8,
 x=>x.teacherScienceApprovals=1,
 x=>x.teacherCognitiveApprovals=1,
 x=>x.teacherScoredReleaseApprovals=1,
 x=>x.scoredUnit7PortalQuestions=1,
 x=>x.teacherApprovalDataPolicy.individualReviewScience='APPROVED',
 x=>x.teacherApprovalDataPolicy.individualReviewCognitive='APPROVED',
 x=>x.teacherApprovalDataPolicy.perItemRelease='RELEASED',
 x=>x.teacherApprovalDataPolicy.teacherIdentity='PUBLIC_GITHUB',
 x=>x.sourceBookImagesOrQuestionsPublished=true,
 x=>x.originalKeyedSourceFilesModified=true,
 x=>x.existingScoredBankChanged=true,
 x=>x.firebaseConfigOrTeacherRoleChanged=true,
 x=>x.stagingOrProductionTeacherBackendDeployed=true,
 x=>x.fullWorkedSolution='private',
 x=>x.sourceSlices[0].correctAnswer='A',
 x=>x.academicDecision='RELEASED'
];
for(const [i,mutate] of modifications.entries()){
 const copy=structuredClone(d);mutate(copy);
 A.throws(()=>validate(copy),undefined,'V178 fail-closed academic mutation '+(i+1));
}
const memo=read(MEMO);
for(const mark of ['274','240','34','83','44','140','Topic7.1',
 'Topic7.2','Topic7.3','Q76','Q57','Q3','V177','V179',
 'PENDING','HOLD','authenticat','B-27']){
 A.ok(memo.toLowerCase().includes(mark.toLowerCase()),
  'Missing V178 teacher priority/audit section: '+mark);
}
const catalog=load('portal/learning-catalog.json');
const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
A.equal(u7.status,'planned');
A.equal(u7.assessmentStatus,'not-published');
A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.deepEqual(load('question-bank/manifest.json').grades.find(g=>g.grade===11)
 .units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
 'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const qaDir=path.join(ROOT,'qa-artifacts/grade11-v178-unit7-teacher-274');
fs.mkdirSync(qaDir,{recursive:true});
fs.writeFileSync(path.join(qaDir,'summary.json'),JSON.stringify({
 version:'V178',originalItemIdentities:total,originalUniqueSourcePrefixedIds:ids.size,
 originalOwnerMcqs:240,originalNbfExercises:34,firstPassPriorityCounts:pcounts,
 teacherIndividualScienceApprovals:0,teacherIndividualCognitiveApprovals:0,
 studentScoredReleases:0,failClosedMutationTests:modifications.length,
 next:'V179 private candidate/teacher review batches of at most 20'
},null,2)+'\n');
console.log('V178 PASS: 274/274 original source-safe identities, 7 ledgers, 83 compulsory +44 optional +7 cognition +140 ordinary priorities, '+modifications.length+' fail-closed mutations, zero teacher approvals and zero scored Unit7.');
