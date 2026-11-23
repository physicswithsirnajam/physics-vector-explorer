#!/usr/bin/env node
'use strict';
/* V117: teacher-only assessment-SLO scope decisions, NOT a student bank edit.
 * Original source answers correct; B36 and B40 are candidate mappings only.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const sourcePath='question-bank/grade-11/unit-06-topic-65-v84-80-source.json';
const packPath='quality/grade11-unit06-v117-topic65-four-slo-scope-teacher-decisions.json';
const docPath='quality/grade11-unit06-v117-topic65-four-slo-scope-teacher-review.md';
const auditPath='quality/grade11-unit06-v95c2s-topic65-mcq41-60-numerical-review.csv';
const sourceText=read(sourcePath),source=JSON.parse(sourceText),pack=json(packPath),doc=read(docPath);
const gitHash=crypto.createHash('sha1').update('blob '+Buffer.byteLength(sourceText)+'\0').update(sourceText).digest('hex');
const numbers=[45,46,47,58],letters=['D','B','A','C'],expectedResults=[12500,40000,29400,0.3];
let tests=0;function pass(s){tests++;console.log('V117 PASS: '+s)}
function close(a,b){assert.ok(Math.abs(a-b)<1e-10,'Numerical output changed: '+a+' != '+b)}
function main(){
 assert.equal(gitHash,'f5a7dd0a29d5e90842c0ef557071aebc10a70baf');
 assert.equal(pack.sourceBankBlobSha,gitHash);assert.equal(pack.sourceBank,sourcePath);
 assert.equal(source.questions.length,80);assert.equal(pack.originalSourceCount,80);
 assert.equal(pack.schemaVersion,1);assert.equal(pack.version,'V117');
 assert.equal(pack.scope,'TEACHER_REVIEW_ONLY_SOURCE_AND_STUDENT_PRACTICE_UNCHANGED');
 assert.equal(pack.ownerDecision,'PENDING');assert.equal(pack.releaseApproved,false);
 assert.equal(pack.grade,11);assert.equal(pack.unit,6);assert.equal(pack.topic,'6.5');
 assert.equal(pack.decisionCount,4);assert.equal(pack.unit6ProvisionalCount,560);
 assert.equal(pack.grade11ReferenceCount,2250);assert.equal(pack.candidates.length,4);
 assert.deepEqual(pack.candidates.map(c=>c.sourceQuestionNumber),numbers);
 assert.equal(new Set(pack.candidates.map(c=>c.decisionId)).size,4);
 pass('V84 all-80 source-bank Git SHA and four unapproved, teacher-only original-preserving decision IDs');
 const audit=read(auditPath).split(/\r?\n/);
 const unique=new Set();
 for(let i=0;i<4;i++){
  const n=numbers[i],q=source.questions[n-1],c=pack.candidates[i];
  assert.equal(q.id,'XI-U06-T65-MCQ-'+String(n).padStart(4,'0'));
  assert.equal(c.decisionId,'XI-U06-T65-V117-TEACHER-SCOPE-'+String(n).padStart(4,'0'));
  assert.ok(!unique.has(c.originalSourceId));unique.add(c.originalSourceId);
  assert.equal(c.originalSourceId,q.id);assert.equal(c.sourceSection,'numericals');
  assert.equal(c.sourceSection,q.sourceSection);assert.equal(c.sourcePdfPage,q.sourcePdfPage);
  assert.equal(c.originalStem,q.stem);assert.deepEqual(c.originalOptions,q.options);
  assert.equal(c.originalCorrectOptionId,letters[i]);assert.equal(q.correctOptionId,letters[i]);
  assert.equal(c.originalExplanation,q.explanation);
  assert.equal(c.scientificFinding,'CORRECT_NUMERICAL_ANSWER_WITH_SCOPE_DECISION_PENDING');
  assert.equal(c.teacherProposedTreatment,'RETAIN_UNALTERED_PROVISIONAL_PRACTICE_AND_WITHHOLD_FORMAL_EXAM_ELIGIBILITY');
  assert.equal(c.sourceAuditPriority,n===58?'COMPULSORY_CROSS_SLO_NOTE':'COMPULSORY_B40_SCOPE_NOTE');
  assert.ok(audit.includes(c.reviewedPreparedSourceRow),'Original prepared-master audit row not preserved '+q.id);
  assert.ok(c.reviewedPreparedSourceRow.startsWith(q.id+','));
  assert.ok(c.reviewedPreparedSourceRow.includes(',4,'+letters[i]+',MATCHED,'));
  assert.ok(c.reviewedPreparedSourceRow.includes(c.sourceAuditPriority));
  assert.ok(c.independentMath.length>35);
  close(c.independentNumericResultSI,expectedResults[i]);
  assert.ok(c.exactConcern.length>60);assert.ok(c.suggestedPracticeRole.length>45);
  assert.equal(c.sourceFidelity,'HISTORICALLY_VERIFIED_PREPARED_MASTER_NOT_RECHECKED_IN_THIS_PR');
  assert.deepEqual(c.candidateItemSloNotCertified,n===58?['P-11-B-36']:['P-11-B-40']);
  assert.equal(c.topicContextSlo,'P-11-B-40');
  assert.equal(c.authorCognitiveTagNotBoardCertified,'Application_author_tag');
  for(const key of ['individualCognitiveClassification','teacherDecision','individualFBISEMapping','scientificKeyTeacherSignoff','examCertification'])assert.equal(c[key],'PENDING');
  assert.equal(c.boardEligible,false);assert.equal(c.replacementNeededForScientificCorrectness,false);
  assert.equal(c.currentlyAvailableAsProvisionalSelfPractice,true);
  assert.equal(c.newStudentVariantAuthorized,false);assert.equal(c.existingSourceUnchanged,true);
  assert.ok(doc.includes(c.originalStem)&&doc.includes(c.independentMath)&&doc.includes(c.originalSourceId));
  for(const opt of c.originalOptions)assert.ok(doc.includes('| '+opt.id+' | '+opt.text+' |'),'Teacher document missing source option '+q.id+':'+opt.id);
 }
 assert.deepEqual(source.questions.filter(q=>numbers.includes(q.sourceQuestionNumber)).map(q=>q.correctOptionId),letters);
 pass('exact original four stems, all 16 A-D options, keys D/B/A/C, original V95-C2S audit rows and PENDING individual SLO/cognitive reviews');
 // Independent physics: dynamic energy density is Pa; ρgh also Pa; throughput is m³.
 close(.5*1000*5**2,12500);
 close(.5*800*10**2,40000);
 close(1000*9.8*3,29400);
 close(.02*3*5,.3);
 assert.match(pack.candidates[3].exactConcern,/continuity|volume/i);
 assert.match(pack.candidates[3].suggestedPracticeRole,/B36/i);
 assert.match(doc,/B-39 as formative/i);
 assert.match(doc,/No student ban\/exclusion is proposed/i);
 pass('independent SI-dimension numeric verification: 12,500 Pa, 40,000 Pa, 29,400 Pa, 0.30 m³; B36 versus B40 remains an unapproved scope decision');
 // No student-facing or reporting change, original live IDs are STILL correct.
 const refs=json('server/review-manifests/grade11-approved-public-review-refs-v99i.json');
 assert.equal(refs.questionRefs.length,2250);
 assert.equal(refs.bankVersions['6'],'v116-topic64-v111-and-topic65-five-clarified-560-provisional');
 for(const n of numbers){
  const id='XI-U06-T65-MCQ-'+String(n).padStart(4,'0');
  assert.ok(refs.questionRefs.some(([key,unit,sourceNumber])=>key===id&&unit===6&&sourceNumber===n));
  assert.ok(!refs.questionRefs.some(([key])=>key===id+'-V117'));
 }
 const v111=json('question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json');
 const v114=json('question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json');
 const v116=json('question-bank/grade-11/unit-06-topic65-v116-approved-stagnation-practice-overlay.json');
 assert.equal(v111.overlayQuestionCount,4);assert.equal(v114.overlayQuestionCount,3);assert.equal(v116.overlayQuestionCount,2);
 assert.deepEqual(v114.replacements.map(q=>q.correctOptionId),['D','C','C']);
 assert.deepEqual(v116.replacements.map(q=>q.correctOptionId),['B','B']);
 const counts=json('question-bank/manifest.json').grades.find(g=>g.grade===11).units;
 assert.equal(counts[5].liveMcqCount,560);
 assert.equal(counts.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
 assert.equal(counts[5].standaloneSituationQuestionCount,136);
 assert.equal(counts[5].independentSharedStimulusGroupCount,0);
 pass('all 4 original self-practice IDs and 2,250 signed metadata refs retained; existing V111/V114/V116 approved safe variants untouched');
 const queue=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
 assert.equal(queue.length,561);
 const header=queue[0].split(',');
 for(const row of queue.slice(1)){
  const cols=row.split(',');
  for(const field of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])
   assert.equal(cols[header.indexOf(field)],'PENDING');
 }
 const signoff=json('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(signoff.releaseApproved,false);assert.equal(signoff.teacherSignoff,'pending');
 assert.equal(signoff.framework.itemLevelSloVerified,false);
 assert.equal(signoff.framework.cognitiveLevelVerified,false);
 assert.ok(signoff.framework.officialSummative.includes('P-11-B-36'));
 assert.ok(signoff.framework.officialSummative.includes('P-11-B-40'));
 assert.ok(signoff.framework.officialFormative.includes('P-11-B-39'));
 const unit=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(unit.status,'planned');assert.equal(unit.assessmentStatus,'not-published');
 pass('560 individual scientific/SLO/cognitive/teacher fields still PENDING and exact B36/B40 summative vs B39 formative course holds unchanged');
 for(const p of ['shared/practice-bank-adapter-v55.js','portal/unit-06-topic-65-preview.js',
   'portal/unit-06-balanced-mcq-v95c1.js','build-your-physics-test.html','practice-engine/index.html',
   'server/approved-practice-catalog-v99g.cjs','server/review-manifests/grade11-approved-public-review-refs-v99i.json'])
  assert.ok(!read(p).includes('V117'),'V117 teacher-only decisions leaked into student or reporting asset: '+p);
 assert.ok(read('portal/unit-06-topic-65-preview.html').includes('sitewide-science-print-v112.js'));
 assert.ok(read('portal/unit-06-balanced-mcq-v95c1.html').includes('sitewide-science-print-v112.js'));
 pass('teacher-only V117 never affects student quiz/central builders, protected report endpoints or V112 watermark/scientific notation');
 console.log('V117 COMPLETE:',tests,'review-only source/math/assessment safety gates passed');
}
main();
