#!/usr/bin/env node
'use strict';
/* V146 — NONSTUDENT source-fingerprint and release-lock audit ONLY.
 * The private prior owner-supplied Word/PDF are NOT in this repository.
 * GitHub CI validates the checked-in record of source checks, not an
 * independent re-extraction or academic certification of the external file.
 * Zero question stems, source answer letters, teacher keys or real learners
 * are exported from this metadata-only workflow.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const ledger=JSON.parse(read('quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const manifest=JSON.parse(read('question-bank/manifest.json'));
const hold=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const output=path.join(ROOT,'qa-artifacts/grade11-v146-unit7-topic71-source-qc');
const REQUIRED_HASHES=Object.freeze({
 docx:'930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58',
 pdf:'1b440b31bf2127fc4d62edbc223e3a23cf556d56aa5e8a5a46a4a9212960f5b5',
 rows:'8a808246e68a97c904ee39255925e4c0312879cb61802f07f557ce2acd22121f'
});
function hash(s){return crypto.createHash('sha256').update(s).digest('hex')}
function main(){
 assert.equal(ledger.schemaVersion,1);
 assert.equal(ledger.version,'V146');
 assert.equal(ledger.grade,11);
 assert.equal(ledger.unit,7);
 assert.equal(ledger.topic,'7.1 Classification of Solids');
 assert.equal(ledger.contentType,'PRIVATE_TEACHER_SOURCE_INVENTORY_METADATA_ONLY');
 assert.equal(ledger.sourceNbfPrintedPages,'113–116');
 assert.equal(ledger.originalTextbookPagesVisuallyInspected,true);
 assert.equal(ledger.sourceDocxSha256,REQUIRED_HASHES.docx);
 assert.equal(ledger.sourcePdfSha256,REQUIRED_HASHES.pdf);
 assert.ok(ledger.sourceDocx.endsWith('.docx')&&ledger.sourcePdf.endsWith('.pdf'));
 assert.equal(ledger.sourceDocxQuestionAndKeyRows,80);
 assert.equal(ledger.originalSourceOptionCountPerItem,4);
 assert.deepEqual(ledger.sourceAnswerDistributionTotalsOnly,{A:20,B:20,C:20,D:20});
 assert.deepEqual(ledger.sourceFingerprintObjectKeys,
  ['n','stem','options','key','explanation','slo']);
 assert.equal(ledger.originalSloTagInTeacherDocx,'B-22');
 assert.equal(ledger.officialTheorySloCandidate,'P-11-B-22');
 assert.equal(ledger.academicReleaseAllowed,false);
 assert.equal(ledger.itemsFullyAnswerCertified,0);
 assert.deepEqual(ledger.targetedReviewQuestionNumbers,[15,62]);
 assert.match(ledger.scenarioTypeNotice,/not six grouped shared-stimulus blocks/);
 const expectCoverage={
  classification:28,polymers:10,crystal_lattice:7,anisotropy:6,
  xray_diffraction:3,cubic_unit_cells:20,crystal_systems:4,engineering_uses:2
 };
 assert.deepEqual(ledger.coverageTotals,expectCoverage);
 assert.equal(ledger.items.length,80);
 const ids=new Set(),rows=new Set(),groupCounts={};
 for(let n=1;n<=80;n++){
  const x=ledger.items[n-1];
  assert.deepEqual(Object.keys(x),[
   'id','sourceNumber','sourceFullRowSha256','topicGroup','questionStyle',
   'sourceSlo','sourceStructuralStatus','scientificDisposition',
   'cognitiveMapping','teacherAcademicSignoff','studentPracticeRelease'
  ]);
  assert.equal(x.id,'XI-U07-T071-Q'+String(n).padStart(3,'0'));
  assert.equal(x.sourceNumber,n);
  assert.match(x.sourceFullRowSha256,/^[a-f0-9]{64}$/);
  assert.equal(x.sourceSlo,'P-11-B-22');
  assert.equal(x.sourceStructuralStatus,'PASS');
  assert.equal(x.cognitiveMapping,'NOT_INDIVIDUALLY_CERTIFIED');
  assert.equal(x.teacherAcademicSignoff,'PENDING');
  assert.equal(x.studentPracticeRelease,'HOLD');
  assert.equal(x.questionStyle,n<=60?'direct_or_conceptual':'standalone_context_application');
  const disposition=n===15?'REQUIRES_SOURCE_SCOPE_CLARIFICATION':
   n===62?'REQUIRES_WORDING_CORRECTION':'PROVISIONAL_NO_SPECIFIC_DEFECT_IDENTIFIED';
  assert.equal(x.scientificDisposition,disposition);
  assert.ok(Object.hasOwn(expectCoverage,x.topicGroup));
  groupCounts[x.topicGroup]=(groupCounts[x.topicGroup]||0)+1;
  assert.ok(!ids.has(x.id),'Duplicate ID at '+n);ids.add(x.id);
  assert.ok(!rows.has(x.sourceFullRowSha256),'Duplicate full-source row at '+n);
  rows.add(x.sourceFullRowSha256);
 }
 assert.deepEqual(Object.fromEntries(Object.entries(expectCoverage).map(([k])=>[k,groupCounts[k]])),
  expectCoverage);
 const combined=hash(ledger.items.map(x=>x.sourceFullRowSha256).join(','));
 assert.equal(combined,REQUIRED_HASHES.rows,
  'Source 80-row digest changed; re-review original privately held study edition');
 // Important: this source-fingerprint verification confirms the manifest has
 // not changed, not the correctness of the private original student question.
 const u7=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
 assert.equal(u7.status,'planned');
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(u7.learningPreviewStatus,'public-topic-7.1-introduction-only');
 assert.deepEqual(u7.resourceIds,[]);
 const counts=manifest.grades.find(x=>x.grade===11).units.map(x=>x.liveMcqCount);
 assert.deepEqual(counts,[275,206,220,640,349,560]);
 assert.equal(hold.releaseApproved,false);
 assert.equal(hold.teacherSignoff,'pending');
 const current=JSON.stringify(ledger);
 for(const banned of ['correctOption','answerLetter','questionText',
  'privateEmail','studentUid','selectedOption','teacherPassword','answerKey']){
  assert.ok(!Object.hasOwn(ledger,banned), 'Top-level source must not expose keyed content');
  assert.ok(ledger.items.every(x=>!Object.hasOwn(x,banned)),
   'Item ledger must not expose keyed content: '+banned);
 }
 const note=read('quality/grade11-v146-topic71-mcq-source-review-and-teacher-decision.md');
 for(const x of ['Q15','Q62','Compulsory','Optional',
   'source-faithful','stand-alone','PENDING','80','20','113–116']){
  assert.ok(note.includes(x),'Missing teacher review explanation: '+x);
 }
 assert.ok(!fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),
  'V146 must not publish an unscreened keyed Unit7 bank');
 fs.mkdirSync(output,{recursive:true});
 fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify({
  version:'V146',scope:'TOPIC 7.1 STRUCTURAL SOURCE AND REVIEW DISPOSITION ONLY',
  exactSourceDocumentSha256:REQUIRED_HASHES.docx,
  sourcePdfSha256:REQUIRED_HASHES.pdf,
  itemRowFingerprintAggregate:REQUIRED_HASHES.rows,
  sourceRowsCount:80,optionsPerItem:4,
  distinctOptionSetsFromLocalSourceInspection:80,
  sourceAnswerCountsOnly:{A:20,B:20,C:20,D:20},
  originalQuestionStemsCopiedIntoPublicRepo:0,
  originalCorrectLettersCopiedIntoPublicRepo:0,
  itemSourceFingerprintsChecked:80,
  topicDistribution:expectCoverage,
  directOrConceptual:60,standaloneContext:20,
  fullStimulusGroupsConfirmed:0,
  flaggedItemNumbers:[15,62],
  academicallyApprovedItems:0,
  teacherSignoffsPending:80,
  unit7LiveMcqCount:0,
  existingGrade11LiveProvisionalCount:counts.reduce((a,b)=>a+b,0),
  approvedGradedAssessmentsReleased:false,
  firebaseChanges:false,privateStudentDataRead:false
 },null,2)+'\n');
 console.log('V146 PASS: 80 original teacher-source item fingerprints and topic maps preserved, 2 flagged for source/wording review, 80 academic signoffs pending; 0 Unit7 scored questions released.');
}
try{main()}catch(e){console.error('V146 FAILED:',e.stack||e);process.exitCode=1;}
