#!/usr/bin/env node
'use strict';
/*
 * V170 original Topic7.3 Q21-40 source-bound and score-HOLD audit.
 * Public CI has no private original keyed Word; verifies metadata and
 * security/academic release invariants, NOT keyed science independently.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const R=path.resolve(__dirname,'..');
const V170='quality/unit07/topic73-v170-q21-q40-source-bound-academic-review-no-keys.json';
const V169='quality/unit07/topic73-v169-q01-q20-source-bound-academic-review-no-keys.json';
const MEMO='quality/grade11-v170-topic73-q21-q40-science-answer-slo-qc.md';
const SOURCE='f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279';
const BOOK='00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe';
const BATCH_SHA='e07ff80e4218fd8f1f439836985cda7bfbaa81b74cb42adc1e1ac45e0beb151c';
const FORTY_SHA='c0b3483ceaadc3578c89b3bf2d87cd7fdecb1e55ce9561354a4fa034b42f3c4b';
const SLO=[27,28,28,28,28,27,27,27,25,25,25,25,25,25,27,27,28,27,27,27];
const LEVEL=['U','A','A','A','U','U','U','U','U','U','A','A','U','U','A','U','U','U','A','U'];
const PAGES=[122,123,123,123,123,122,122,122,122,122,122,122,122,122,122,122,123,122,122,123];
const MUST=[24,31,35],OPTIONAL=[23,32,33,34,36],CROSS_SLO=[31,32,33];
const BAN=['stem','question','questionText','prompt','options','optionA','optionB',
 'optionC','optionD','answer','answerLetter','correctLetter','correctOption',
 'correctOptionText','key','keyLetter','oneLineExplanation','sourceExplanation',
 'originalExplanation','workedSolution','candidateStem','candidateOptions',
 'studentUid','studentEmail','teacherUid','teacherEmail'];
const read=p=>fs.readFileSync(path.join(R,p),'utf8');
const load=p=>JSON.parse(read(p));
const sha=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
function validate(d,p){
 assert.equal(d.schemaVersion,1);assert.equal(d.version,'V170');
 assert.equal(d.topic,'Grade XI Physics Unit7.3 Elastic Potential Energy');
 assert.equal(d.batch,'original Q21-Q40 of 80');
 assert.equal(d.prior,'V169 Q1-Q20');
 assert.equal(d.originalWordFile,p.sourceOriginalPrivateDocxName);
 assert.equal(d.originalWordSha256,SOURCE);
 assert.equal(d.originalWordSha256,p.sourceOriginalPrivateDocxSha256);
 assert.equal(d.nbfPdfSha256,BOOK);
 assert.equal(d.nbfPdfSha256,p.sourceNbfBookSha256);
 assert.deepEqual(d.officialSummativeLevels,p.officialSummativeSloCognitive);
 assert.equal(d.fingerprintRecipe,p.rowFingerprintRecipeId);
 assert.equal(d.originalWholeBankRows,80);
 assert.equal(d.firstPassReviewed,20);
 assert.equal(d.cumulativeReviewed,40);
 assert.equal(d.incorrectKeysFirstPass,0);
 assert.equal(d.sourceKeyLettersMatchOptions,true);
 assert.deepEqual(d.originalKeyLetterCounts,{A:6,B:7,C:3,D:4});
 assert.deepEqual(d.originalCognitive,{K:0,U:13,A:7});
 assert.deepEqual(d.cumulativeCognitive,{K:11,U:20,A:9});
 assert.deepEqual(d.originalSloCounts,{
  'P-11-B-25':{U:4,A:2,total:6},
  'P-11-B-27':{U:7,A:2,total:9},
  'P-11-B-28':{U:2,A:3,total:5}
 });
 assert.equal(d.strictFirstPassDirectTopicCandidates,17);
 assert.equal(d.crossSloTeacherDecisions,3);
 assert.deepEqual(d.compulsory,MUST);
 assert.deepEqual(d.optional,OPTIONAL);
 assert.deepEqual(d.duplicateWatch,[[22,23],[28,36],[21,28,36]]);
 assert.ok(d.physicsDecision.includes('Elastic reversibility alone'));
 assert.equal(d.rowFingerprintOrigin,
  'PRIVATE_ORIGINAL_WORD_SOURCE_RECALCULATED_OFF_REPO_WITH_V169_JSON_RECIPE');
 assert.equal(d.sourceDataAttestedOffline,true);
 assert.equal(d.privateKeyOrQuestionTextPublished,false);
 assert.equal(d.ownerWordChanged,false);
 assert.equal(d.teacherApprovals,0);
 assert.equal(d.unit7ScoredItems,0);
 assert.equal(d.firebaseBackendChanged,false);
 assert.equal(d.topic72TeacherHoldPreserved,true);
 assert.equal(d.next,'V171 original Q41-Q60 science and SLO audit');
 assert.equal(d.items.length,20);
 assert.deepEqual(d.items.map(x=>x.sourceNumber),
  Array.from({length:20},(_,i)=>21+i));
 assert.deepEqual(p.sourceBoundItems.map(x=>x.sourceNumber),
  Array.from({length:20},(_,i)=>i+1));
 const hashes=d.items.map(x=>x.fullSourceRowSha256);
 assert.equal(new Set(hashes).size,20);
 for(const h of hashes)assert.match(h,/^[a-f0-9]{64}$/);
 const first=p.sourceBoundItems.map(x=>x.originalFullKeyedRowSha256);
 assert.equal(sha(first.join('\n')),p.canonicalFirst20RowHashesJoinNewlineSha256);
 assert.equal(sha(hashes.join('\n')),BATCH_SHA);
 assert.equal(sha(first.concat(hashes).join('\n')),FORTY_SHA);
 assert.equal(d.batchJoinedSha256,BATCH_SHA);
 assert.equal(d.first40JoinedSha256,FORTY_SHA);
 let cognitive={K:0,U:0,A:0},by={};
 for(let i=0;i<20;i++){
  const row=d.items[i],n=i+21,s='P-11-B-'+SLO[i];
  assert.equal(row.sourceMappedSlo,s);
  assert.equal(row.authorItemLevel,LEVEL[i]);
  assert.equal(row.sourcePrintedPage,PAGES[i]);
  assert.equal(row.scienceSignoff,'PENDING');
  assert.equal(row.cognitiveSignoff,'PENDING');
  assert.equal(row.studentScore,'HOLD');
  assert.equal(row.scope,CROSS_SLO.includes(n)?
   'teacher-cross-slo-review':'direct-topic-candidate');
  assert.equal(row.issuePriority,MUST.includes(n)?'compulsory':
   OPTIONAL.includes(n)?'optional':'none');
  assert.equal(row.issueSummary===null,!MUST.includes(n)&&!OPTIONAL.includes(n));
  if(MUST.includes(n)||OPTIONAL.includes(n)){
   assert.ok(row.issueSummary.length>15,'Missing real Q'+n+' issue summary');
  }
  for(const name of BAN)assert.equal(Object.hasOwn(row,name),false,
   'Private keyed source/student field exposed: '+name);
  cognitive[LEVEL[i]]++;
  if(!by[s])by[s]={K:0,U:0,A:0,total:0};
  by[s][LEVEL[i]]++;by[s].total++;
 }
 assert.deepEqual(cognitive,d.originalCognitive);
 for(const [name,stats] of Object.entries(d.originalSloCounts)){
  const actual=by[name];
  assert.equal(actual.total,stats.total);
  assert.equal(actual.U,stats.U);
  assert.equal(actual.A,stats.A);
  assert.equal(actual.K||0,0);
 }
 return true;
}
function mutations(d,p){
 const changes=[
  a=>a.originalWordSha256='0'.repeat(64),
  a=>a.items[0].fullSourceRowSha256='0'.repeat(64),
  a=>a.items[11].sourceMappedSlo='P-11-B-28',
  a=>a.items[14].authorItemLevel='K',
  a=>a.items[14].studentScore='APPROVED',
  a=>a.items[0].scienceSignoff='APPROVED',
  a=>a.items[0].cognitiveSignoff='APPROVED',
  a=>a.items[7].correctOptionText='owner private answer',
  a=>a.compulsory=[24,31],
  a=>a.optional=[23,32],
  a=>a.teacherApprovals=1,
  a=>a.unit7ScoredItems=1,
  a=>a.firebaseBackendChanged=true,
  a=>a.topic72TeacherHoldPreserved=false,
  a=>a.batchJoinedSha256='0'.repeat(64),
  a=>a.originalCognitive.A=8
 ];
 for(const [i,change] of changes.entries()){
  const x=structuredClone(d);change(x);
  assert.throws(()=>validate(x,p),undefined,'Mutation '+i+' failed open');
 }
 return changes.length;
}
function main(){
 const d=load(V170),p=load(V169),memo=read(MEMO);
 validate(d,p);
 const mutationsRejected=mutations(d,p);
 for(const n of [...MUST,...OPTIONAL]){
  assert.ok(memo.includes('**'+n+'**'),'Memo missing review Q'+n);
 }
 for(const phrase of ['Q21–40','40 / 80','P-11-B-25',
  'P-11-B-27','P-11-B-28','Figure 7.14',
  'nonlinear','Hooke','original','HOLD','PENDING']){
  assert.ok(memo.toLowerCase().includes(phrase.toLowerCase()),
   'Memo missing source/QC explanation '+phrase);
 }
 const previous72=load('quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json');
 assert.equal(previous72.fullOriginalQuestionRows,80);
 assert.equal(previous72.individualTeacherScienceSignoffs,0);
 assert.equal(previous72.unit7ScoredQuestionCount,0);
 const catalog=load('portal/learning-catalog.json');
 const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(u7.questionBankCount,0);
 const manifest=load('question-bank/manifest.json');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 const t71=load('quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json');
 assert.equal(t71.teacherScienceSignoffs,0);
 assert.equal(t71.unit7ScoredReleaseCount,0);
 assert.equal(load('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
 assert.equal(load('quality/unit07/topic71-v160-production-readiness-no-go.json').decision,
  'NO_GO_DEPLOYMENT_BLOCKED');
 assert.equal(load('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json').decision,
  'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 assert.ok(!fs.existsSync(path.join(R,'question-bank/grade-11/unit-07.json')));
 assert.ok(!fs.existsSync(path.join(R,'question-bank/grade-11/unit-07-topic73.json')));
 const out=path.join(R,'qa-artifacts/grade11-v170-topic73-q21-q40-keyless-qc');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({
  version:'V170',originalQ21to40Checked:20,cumulativeTopic73Checked:40,
  wrongKeyLettersFirstPass:0,sourceOriginalWordSHA:SOURCE,
  itemDemand:{K:0,U:13,A:7},cumulative:{K:11,U:20,A:9},
  compulsory:[24,31,35],optional:[23,32,33,34,36],
  linkedPrivateKeysReleased:false,teacherApprovals:0,
  scoredUnit7Questions:0,academicHoldMutationsRejected:mutationsRejected,
  pendingNext:'V171 Q41–60'
 },null,2)+'\n');
 console.log('V170 PASS: original Q21–40 source-safe, 3 compulsory/5 optional, 16 mutation denials, 40/80 reviewed, 0 approved/0 Unit7 scored');
}
try{main()}catch(e){console.error('V170 FAILED:',e.stack||e);process.exitCode=1;}
