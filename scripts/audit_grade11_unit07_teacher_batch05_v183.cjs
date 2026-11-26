#!/usr/bin/env node
'use strict';
/* V183: 12 original owner-source Unit7 MCQ identities; private Word candidate
 * pack is NOT in GitHub. Checks original fingerprints, science/SLO review
 * metadata, previous-batch disjointness and all scored/student/backend HOLDs.
 * A green audit is NEVER a signed academic or publisher decision.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const INDEX='quality/unit07/unit07-v183-batch05-twelve-owner-source-private-candidates-keyless.json';
const MEMO='quality/grade11-v183-unit07-batch05-12-private-teacher-review-qc.md';
const SRC={
 '7.1':{
  ledger:'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json',
  version:'V154',sourceSha:'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58',
  sourceShaField:'sourceOriginalOwnerDocxSha256',rows:'entries',n:'sourceNumber',sha:'originalFullRowSha256',
  slo:'officialSlo',priority:'reviewQueuePriority',cognitive:null,numbers:[45,56,63,69],
  targetSlo:[22,22,22,22],targetDemand:['U','U','U','U'],
  scope:['supporting-crystal-cell-detail','supporting-crystal-cell-detail',
         'direct-structural-understanding-candidate','supporting-cross-classification'],
  issues:['fcc-face-centres-vs-effective-contributions','bcc-one-drawn-centre-vs-two-effective-sites',
   'grain-boundaries-polycrystal-not-polymer','synthetic-polymer-does-not-determine-crystal-order']
 },
 '7.2':{
  ledger:'quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json',
  version:'V168',sourceSha:'a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada',
  sourceShaField:'sourceOriginalPrivateDocxSha256',rows:'canonicalSourceRows',n:'sourceNumber',sha:'sha256',
  slo:'originalMappedSlo',priority:'firstPassIssue',cognitive:'originalCognitiveCode',numbers:[55,56,62,63],
  targetSlo:[24,24,23,24],targetDemand:['A','A','U','U'],
  scope:['supporting-bulk-modulus-only','supporting-shear-geometry-only',
         'direct-load-mode-candidate-pending','supporting-bulk-modulus-only'],
  issues:['bulk-modulus-sign-and-b24-summative-scope','shear-strain-vs-small-angle-units-and-symbol',
   'sideways-force-relative-face-motion','hydrostatic-bulk-not-young-modulus']
 },
 '7.3':{
  ledger:'quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json',
  version:'V173',sourceSha:'f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279',
  sourceShaField:'originalPrivateWordSha256',rows:'originalRowSourceRegistry',n:'number',
  sha:'originalPrivateFullRowSha256',slo:'sourceMappedSlo',priority:'previousReviewPriority',
  cognitive:'sourceAuthorDemand',numbers:[71,73,78,79],
  targetSlo:[27,24,28,28],targetDemand:['A','A','A','A'],
  scope:['direct-work-area-candidate-pending','direct-young-modulus-candidate-pending',
         'direct-energy-candidate-pending','supplementary-energy-density-scope-review'],
  issues:['force-extension-slope-not-work-area','modulus-comparison-b24-not-experiment-b25',
   'half-force-extension-assumes-zero-start-hooke','fixed-stress-modulus-energy-density-conditional']
 }
};
const PACK='23e1a21636e42e6510faa35d1da8196656d7ee03f87cc9f799131bfa417431ee';
const SOURCE_NAMES={
 '7.1':'Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.docx',
 '7.2':'Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx',
 '7.3':'Grade11_Unit7_Topic7.3_PartA_80MCQs_Study_With_Answers.docx'
};
const BANNED=['stem','originalStem','question','originalQuestion','questionText',
 'originalQuestionText','options','answer','answerLetter','answerKey','correctOption',
 'keyLetter','correctOptionText','revisedStem','candidateQuestion','candidateOptions',
 'originalExplanation','candidateExplanation','fullWorkedSolution','fullExplanation',
 'privateWordBytes','privateSourceImageBytes','teacherUid','teacherEmail','studentUid','studentEmail',
 'authenticationToken','authenticatedApproval'];
const hash=x=>typeof x==='string'&&/^[0-9a-f]{64}$/.test(x);
const makeId=(t,n)=>'XI-U07-T0'+t.replace('.','')+'-Q'+String(n).padStart(3,'0');
function noSecrets(x,where){
 for(const name of BANNED)A.equal(Object.hasOwn(x,name),false,'Private payload forbidden: '+where+'.'+name);
}
function validate(d){
 A.equal(d.schemaVersion,1);A.equal(d.version,'V183');
 A.equal(d.prerequisite.pr,286);A.equal(d.prerequisite.merged,true);
 A.equal(d.prerequisite.mergeSha,'11fa91cbf7632849729b74690edf7840f5caa6b7');
 A.deepEqual(d.priorCandidateBatchCounts,{v179:12,v180:12,v181:12,v182:12,totalDistinct:48});
 A.equal(d.totalOriginalUnit7Identities,274);
 A.equal(d.originalsSelectedThisBatch,12);
 A.equal(d.cumulativeDistinctPrivateCandidateOriginals,60);
 A.equal(d.sourceOriginalFullNbfBookReopened,false);
 A.equal(d.unresolvedNbfPrintedPageChecks.length,3);
 A.ok(d.unresolvedNbfPrintedPageChecks[0].includes('p114'));
 A.ok(d.unresolvedNbfPrintedPageChecks[1].includes('p115'));
 A.ok(d.unresolvedNbfPrintedPageChecks[2].includes('Example 7.2'));
 const p=d.privateTeacherPack;
 A.equal(p.filename,'Unit7_V183_Teacher_Review_Batch05_PRIVATE.docx');
 A.equal(p.sha256,PACK);A.equal(p.renderedPages,13);
 A.equal(p.containsOriginalOptionsKeysAndSeparateCandidates,true);
 A.equal(p.committedPublic,false);A.equal(p.automaticImport,false);
 for(const flag of ['originalPrivateWordFilesEdited','fullOriginalRowsOrAnswerKeysPublished',
  'fullCandidateStemsOrKeysPublished','firebaseTeacherBackendChanged',
  'liveScoredQuestionBankChanged'])A.equal(d[flag],false);
 for(const field of ['individualScienceApprovals','individualCognitiveApprovals',
  'individualScoringApprovals','unit7ScoredQuestionCount'])A.equal(d[field],0);
 A.equal(d.academicStatus,'V183_PRIVATE_CANDIDATES_ONLY_TEACHER_ALL_PENDING_NO_SCORED_RELEASE');
 A.ok(d.next.startsWith('V184'));
 A.equal(d.rows.length,12);
 noSecrets(d,'batch index');
 let cursor=0;
 for(const topic of ['7.1','7.2','7.3']){
  const spec=SRC[topic],original=load(spec.ledger);
  A.equal(original.version,spec.version);
  A.equal(original[spec.sourceShaField],spec.sourceSha);
  A.equal(original[spec.rows].length,80);
  const sourceMeta=d.originalSourceFilesVerified['topic'+topic.replace('.','')];
  A.equal(sourceMeta.sha256,spec.sourceSha);A.equal(sourceMeta.name,SOURCE_NAMES[topic]);
  A.equal(sourceMeta.previousRegister,spec.version);
  A.deepEqual(sourceMeta.numbers,spec.numbers);
  for(let i=0;i<4;i++){
   const n=spec.numbers[i],r=d.rows[cursor++];
   const source=original[spec.rows].find(x=>x[spec.n]===n);
   A.ok(source,'missing original row '+topic+':'+n);
   A.equal(r.id,makeId(topic,n));A.equal(r.topic,topic);
   A.equal(r.sourceNumber,n);A.equal(r.sourceRegisterVersion,spec.version);
   A.ok(hash(r.originalRowSha256));
   A.equal(r.originalRowSha256,source[spec.sha]);
   A.equal(r.originalSlo,source[spec.slo]);
   A.equal(r.sourceCognitiveLabel,spec.cognitive?source[spec.cognitive]:'NOT_STATED_IN_7_1_SOURCE');
   A.equal(r.originalSourcePriority,source[spec.priority]);
   A.equal(r.scienceReviewCategory,spec.issues[i]);
   A.ok(r.privateCandidateDesignTag.length>14);
   A.equal(r.provisionalCandidateSlo,'P-11-B-'+spec.targetSlo[i]);
   A.equal(r.provisionalCandidateCognitive,spec.targetDemand[i]);
   A.equal(r.provisionalSummativeScope,spec.scope[i]);
   A.ok(r.sourceAnswerScienceAssessment.length>22);
   A.ok(r.teacherDecisionRequired.length>65);
   A.equal(r.sourceOriginalRetained,true);
   A.equal(r.sourceFullRowAndAnswerPrivate,true);
   A.equal(r.candidateStemOptionsKeyPrivate,true);
   A.equal(r.teacherScienceSignoff,'PENDING');
   A.equal(r.teacherCognitiveSignoff,'PENDING');
   A.equal(r.teacherScoringSignoff,'PENDING');
   A.equal(r.studentScoredRelease,'HOLD');
   if(topic==='7.1'){
    A.equal(source.academicScienceDecision,'PENDING');
    A.equal(source.academicCognitiveDecision,'PENDING');
    A.equal(source.eligibleForScoredStudentRelease,false);
    A.ok(source.reviewQueuePriority.startsWith('COMPULSORY'));
   }else if(topic==='7.2'){
    A.equal(source.academicTeacherReview,'PENDING');
    A.equal(source.scoredRelease,'HOLD');
    A.ok(original.firstPassCompulsoryQuestionNumbers.includes(n));
   }else{
    A.equal(source.teacherScienceSignoff,'PENDING');
    A.equal(source.teacherCognitiveSignoff,'PENDING');
    A.equal(source.studentScoredRelease,'HOLD');
    A.ok(original.firstPassCompulsoryFlags.includes(n));
   }
   noSecrets(r,r.id);
  }
 }
 A.equal(new Set(d.rows.map(x=>x.id)).size,12);
}
const d=load(INDEX);validate(d);
const prev=[
 ...load('quality/unit07/unit07-v179-batch01-twelve-source-authenticated-keyless-candidates.json').itemRows,
 ...load('quality/unit07/unit07-v180-batch02-twelve-high-priority-source-bound-no-keys.json').itemRows,
 ...load('quality/unit07/unit07-v181-batch03-twelve-originals-private-candidates-keyless.json').itemRows,
 ...load('quality/unit07/unit07-v182-batch04-twelve-originals-private-candidates-keyless.json').reviewerQueueDistinctSourceItems
];
A.equal(prev.length,48);
const previousIds=new Set(prev.map(x=>x.id));A.equal(previousIds.size,48);
for(const item of d.rows)A.equal(previousIds.has(item.id),false,'Previously selected original '+item.id);
const index=load('quality/unit07/unit07-v178-consolidated-274-teacher-approval-index-no-keys.json');
A.equal(index.totalOriginalItems,274);A.equal(index.scoredUnit7PortalQuestions,0);
const cat=load('portal/learning-catalog.json');
const u7=cat.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
A.equal(u7.status,'planned');A.equal(u7.assessmentStatus,'not-published');
A.equal(u7.questionBankCount,0);
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
A.deepEqual(load('question-bank/manifest.json').grades.find(x=>x.grade===11).units.map(u=>u.liveMcqCount),
 [275,206,220,640,349,560]);
A.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
A.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
 'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const mutations=[
 x=>x.prerequisite.pr=285,
 x=>x.prerequisite.mergeSha='0'.repeat(40),
 x=>x.priorCandidateBatchCounts.totalDistinct=47,
 x=>x.totalOriginalUnit7Identities=275,
 x=>x.originalsSelectedThisBatch=13,
 x=>x.cumulativeDistinctPrivateCandidateOriginals=61,
 x=>x.originalSourceFilesVerified.topic71.sha256='0'.repeat(64),
 x=>x.originalSourceFilesVerified.topic72.numbers=[55,56,62,64],
 x=>x.originalSourceFilesVerified.topic73.previousRegister='V172',
 x=>x.privateTeacherPack.sha256='0'.repeat(64),
 x=>x.privateTeacherPack.committedPublic=true,
 x=>x.privateTeacherPack.automaticImport=true,
 x=>x.unresolvedNbfPrintedPageChecks=[],
 x=>x.sourceOriginalFullNbfBookReopened=true,
 x=>x.rows.pop(),
 x=>x.rows[0].id='XI-U07-T071-Q010',
 x=>x.rows[0].originalRowSha256='0'.repeat(64),
 x=>x.rows[0].originalSlo='P-11-B-28',
 x=>x.rows[0].sourceCognitiveLabel='A',
 x=>x.rows[0].originalSourcePriority='ordinary',
 x=>x.rows[0].scienceReviewCategory='unreviewed',
 x=>x.rows[0].provisionalCandidateSlo='P-11-B-24',
 x=>x.rows[0].provisionalCandidateCognitive='K',
 x=>x.rows[0].provisionalSummativeScope='direct-instead-of-supporting',
 x=>x.rows[0].teacherDecisionRequired='missing',
 x=>x.rows[0].sourceOriginalRetained=false,
 x=>x.rows[0].questionText='PRIVATE',
 x=>x.rows[0].sourceFullRowAndAnswerPrivate=false,
 x=>x.rows[0].candidateStemOptionsKeyPrivate=false,
 x=>x.rows[0].teacherScienceSignoff='APPROVED',
 x=>x.rows[1].teacherCognitiveSignoff='APPROVED',
 x=>x.rows[2].teacherScoringSignoff='APPROVED',
 x=>x.rows[3].studentScoredRelease='RELEASED',
 x=>x.originalPrivateWordFilesEdited=true,
 x=>x.fullOriginalRowsOrAnswerKeysPublished=true,
 x=>x.fullCandidateStemsOrKeysPublished=true,
 x=>x.firebaseTeacherBackendChanged=true,
 x=>x.liveScoredQuestionBankChanged=true,
 x=>x.individualScienceApprovals=12,
 x=>x.individualCognitiveApprovals=12,
 x=>x.individualScoringApprovals=12,
 x=>x.unit7ScoredQuestionCount=12,
 x=>x.academicStatus='APPROVED_AND_SCORED'
];
for(const [i,mutation] of mutations.entries()){
 const copy=structuredClone(d);mutation(copy);
 A.throws(()=>validate(copy),undefined,'negative mutation '+(i+1)+' did not fail closed');
}
const memo=read(MEMO);
for(const marker of ['V183','12','60','274','Q45','Q56','Q63','Q69',
 'Q55','Q62','Q71','Q73','Q78','Q79','B-22','B-23','B-24','B-27','B-28',
 'p114','p115','Example7.2','PENDING','HOLD','private','teacher']){
 A.ok(memo.toLowerCase().replace(/\s/g,'').includes(marker.toLowerCase().replace(/\s/g,'')),
  'Missing required teacher memo content '+marker);
}
const qa=path.join(ROOT,'qa-artifacts/grade11-v183-unit7-private-teacher-batch05');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V183',originalRowsThisBatch:12,previousDistinctOriginals:48,
 cumulativeDistinctPrivateCandidates:60,allUnit7Originals:274,
 originalTopic71:4,originalTopic72:4,originalTopic73:4,
 teacherScienceSignoffs:0,teacherCognitiveSignoffs:0,teacherScoringSignoffs:0,
 unit7ScoredRelease:0,failClosedNegativeTests:mutations.length,
 next:'V184 another small private candidate review tranche or printed source-page verification'
},null,2)+'\n');
console.log('V183 PASS: 12 source-bound original MCQs, cumulative 60 distinct private candidates; '+mutations.length+' negative tests denied; ZERO academic approvals and ZERO Unit7 scored release.');
