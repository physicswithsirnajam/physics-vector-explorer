#!/usr/bin/env node
'use strict';
/* V147: Source-bound, question-only staging audit.
 * No keys, correct-option letters, explanations, scored bank, Firebase,
 * account records, teacher permissions or new live Unit7 route published.
 *
 * The expected SHA256 was calculated independently from the OWNER's exact
 * 80-row Word study edition by taking each original stem + four options,
 * changing Q15/Q62 stems only as transparently proposed, and joining
 * lines with TAB fields and LF line endings. The Word source is not in CI;
 * this checks captured source identity, not external textbook correctness.
 */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const dataPath='quality/unit07/topic71-v147-80-question-only-candidate.tsv';
const ledgerPath='quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json';
const txt=p=>fs.readFileSync(path.join(root,p),'utf8');
const h=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const INPUT_EXPECTED_SHA='03659cb562a666477882c830d3c7c407bc9e90f41db5077ac75435cf14a80f2a';
const ORIG_SOURCE_STEMS_OPTIONS_SHA='47e7b2e2c4fd3885ac40ad4492fe5b0c19e5703cece6afac8cd9f1913ffe8ddb';
const SOURCE_DOCX_SHA='930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58';
const ITEMS=80;
const out=path.join(root,'qa-artifacts/grade11-v147-unit7-topic71-unscored-candidate');
function main(){
 const tsv=txt(dataPath);
 assert.equal(h(tsv),INPUT_EXPECTED_SHA,
  'Candidate diverges from original 80 source stems/options with the two proposed edits');
 assert.ok(tsv.endsWith('\n')&&!tsv.endsWith('\n\n'),'Expected one LF at end');
 assert.ok(!tsv.includes('\r'),'Do not add CRLF or hidden carriage returns');
 const lines=tsv.trimEnd().split('\n');
 assert.equal(lines.length,ITEMS);
 const source=JSON.parse(txt(ledgerPath));
 assert.equal(source.sourceDocxSha256,SOURCE_DOCX_SHA);
 assert.equal(source.items.length,80);
 assert.equal(source.itemsFullyAnswerCertified,0);
 assert.equal(source.academicReleaseAllowed,false);
 assert.deepEqual(source.targetedReviewQuestionNumbers,[15,62]);
 const seenStems=new Set(),ids=new Set();
 const questions=[];
 for(let i=0;i<ITEMS;i++){
  const n=i+1;
  const fields=lines[i].split('\t');
  assert.equal(fields.length,5,'MCQ '+n+' missing or extra options');
  assert.ok(fields.every(x=>x.trim()===x&&x.length>0&&x.length<460),
   'Blank/extra whitespace/oversized field at '+n);
  const [stem,...opts]=fields;
  assert.equal(new Set(opts).size,4,'Repeated choices at '+n);
  assert.ok(!seenStems.has(stem),'Duplicate question at '+n);seenStems.add(stem);
  assert.ok(!/[<>\u0000-\u0008]/.test(stem+opts.join('')),
   'Question contains unexpected markup or control code');
  assert.equal(source.items[i].sourceNumber,n);
  assert.equal(source.items[i].studentPracticeRelease,'HOLD');
  assert.equal(source.items[i].teacherAcademicSignoff,'PENDING');
  assert.match(source.items[i].sourceFullRowSha256,/^[a-f0-9]{64}$/);
  const id=source.items[i].id;
  assert.equal(id,'XI-U07-T071-Q'+String(n).padStart(3,'0'));
  assert.ok(!ids.has(id));ids.add(id);
  const auditStatus=n===15?'PROPOSED_Q15_SOURCE_SCOPING':
   n===62?'PROPOSED_Q62_SCIENTIFIC_PRECISION':'SOURCE_TEXT_UNCHANGED';
  if(n===15){
   assert.equal(stem,'Which of the following nonmetal crystalline materials is listed in the NBF textbook?');
   assert.deepEqual(opts,['Glass','Sulphur','Rubber','PVC']);
  }
  if(n===62){
   assert.equal(stem,'A glass pane has no regular long-range repeating arrangement of constituent particles. The best description is:');
   assert.deepEqual(opts,['Body-centred cubic metal','Molecular gas','Amorphous solid','Single crystal']);
  }
  questions.push(Object.freeze({
   id,number:n,stem,optionIds:['A','B','C','D'],
   options:Object.freeze([...opts]),proposedSourceChange:auditStatus,
   sourceRowFingerprint:source.items[i].sourceFullRowSha256,
   teacherSignoff:'PENDING',scoredRelease:false
  }));
 }
 // No answer-letter identifiers or explanations in our candidate TSV.
 // "A/B/C/D" are COLUMN LABELS only, NOT the keyed correct letters.
 assert.equal(questions.length,80);
 assert.equal(questions.filter(q=>q.proposedSourceChange!=='SOURCE_TEXT_UNCHANGED').length,2);
 assert.deepEqual(questions.filter(q=>q.proposedSourceChange!=='SOURCE_TEXT_UNCHANGED')
  .map(q=>q.number),[15,62]);
 assert.equal(questions.filter(q=>q.scoredRelease===true).length,0);
 const m=JSON.parse(txt('question-bank/manifest.json'));
 const units=m.grades.find(g=>g.grade===11).units;
 assert.deepEqual(units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
 assert.equal(units.some(u=>u.unit===7),false);
 const c=JSON.parse(txt('portal/learning-catalog.json'));
 const u7=c.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.deepEqual(u7.resourceIds,[]);
 const hold=JSON.parse(txt('quality/grade11-unit06-v94d-signoff-matrix.json'));
 assert.equal(hold.releaseApproved,false);
 assert.equal(hold.teacherSignoff,'pending');
 assert.equal(fs.existsSync(path.join(root,'question-bank/grade-11/unit-07.json')),false);
 assert.equal(fs.existsSync(path.join(root,'question-bank/grade-11/unit-07-topic71.json')),false);
 const note=txt('quality/grade11-v147-topic71-question-only-staging-teacher-review.md');
 for(const required of ['Q15','Q62','80','Compulsory','source-exact',
  'pending','not student-released','Word','03','20','answer letters']){
  assert.ok(note.toLowerCase().includes(required.toLowerCase()),
   'Missing teacher release caveat: '+required);
 }
 fs.mkdirSync(out,{recursive:true});
 const summary={
  version:'V147',scope:'NON-SCORED TOPIC 7.1 QUESTIONS-ONLY CANDIDATE',
  candidateSha256:INPUT_EXPECTED_SHA,
  originalSourceQuestionsAndOptionsSha256:ORIG_SOURCE_STEMS_OPTIONS_SHA,
  originalOwnerWordSha256:SOURCE_DOCX_SHA,
  sourceRows:80,completeOptionSets:80,distinctQuestionStems:80,
  originalStemsPreserved:78,proposedStemRevisions:[15,62],
  directConceptual:60,standaloneSituations:20,sharedStimulusGroupsVerified:0,
  answerKeysExported:0,teacherExplanationsExported:0,
  scientificTeacherItemApprovals:0,teacherItemSignoffsPending:80,
  unit7LiveScoredQuestions:0,originalGrade11ProvisionalTotal:2250,
  completedUnit6TeacherItemApprovals:0,
  studentBuildTestUnit7Enabled:false,gradedExaminationReleased:false,
  sourceFilesStoredInRepo:false,firebaseChanged:false,studentRecordsAccessed:false
 };
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
 console.log('V147 PASS: 80 original-source question-only candidates, 78 original stems, Q15/Q62 proposed stem changes, all 4 options intact, 0 answers/keys/student release.');
}
try{main()}catch(e){console.error('V147 FAILED:',e.stack||e);process.exitCode=1}
