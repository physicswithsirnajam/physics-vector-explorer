#!/usr/bin/env node
'use strict';
/* V113: teacher REVIEW ONLY. The original Bernoulli bank and active public
 * practice may not change before independent explicit teacher approval.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const load=p=>JSON.parse(read(p));
const proposalFile='quality/grade11-unit06-v113-topic65-three-bernoulli-teacher-candidates.json';
const originalFile='question-bank/grade-11/unit-06-topic-65-v84-80-source.json';
const teacherReviewFile='quality/grade11-unit06-v113-topic65-three-bernoulli-teacher-review.md';
const originalText=read(originalFile);
const bank=JSON.parse(originalText),pack=load(proposalFile),report=read(teacherReviewFile);
let checks=0;
function pass(text){checks++;console.log('V113 PASS:',text);}
const close=(actual,want)=>assert.ok(Math.abs(actual-want)<1e-10,'Expected '+want+' got '+actual);
function main(){
 const actualSha=crypto.createHash('sha1')
   .update('blob '+Buffer.byteLength(originalText)+'\0').update(originalText).digest('hex');
 assert.equal(actualSha,'f5a7dd0a29d5e90842c0ef557071aebc10a70baf');
 assert.equal(pack.sourceBlobSha,actualSha);
 assert.equal(pack.sourceFile,originalFile);
 assert.equal(bank.questions.length,80);assert.equal(pack.sourceQuestionCount,80);
 assert.equal(pack.schemaVersion,1);assert.equal(pack.version,'V113');
 assert.equal(pack.scope,'teacher-facing original-preserving proposal-only');
 assert.equal(pack.ownerAcademicDecision,'PENDING');assert.equal(pack.teacherSignoff,'PENDING');
 assert.equal(pack.releaseApproved,false);assert.equal(pack.officialExamStatus,'not-certified');
 assert.equal(pack.candidateCount,3);assert.equal(pack.candidates.length,3);
 assert.deepEqual(pack.candidates.map(x=>x.sourceQuestionNumber),[61,67,78]);
 assert.equal(new Set(pack.candidates.map(x=>x.candidateId)).size,3);
 pass('original bank 80-item exact Git SHA1 and 3 separate UNAPPROVED source-preserving teacher candidates');
 const decisions=read('quality/grade11-unit06-v95c2t-topic65-mcq61-80-scenario-review.csv');
 for(const c of pack.candidates){
  const original=bank.questions.find(x=>x.id===c.originalSourceId);
  assert.ok(original,'No original source for '+c.originalSourceId);
  assert.equal(original.sourceQuestionNumber,c.sourceQuestionNumber);
  assert.equal(original.sourcePdfPage,c.originalSourcePdfPage);
  assert.equal(c.candidateId,'XI-U06-T65-V113-TEACHER-ONLY-'+String(original.sourceQuestionNumber).padStart(4,'0'));
  assert.equal(c.status,'REVIEW_ONLY_NOT_AVAILABLE_FOR_STUDENT_PRACTICE');
  assert.equal(c.sourceAuditCsv,pack.initialReviewEvidence);
  assert.ok(decisions.split(/\r?\n/).some(l=>l.startsWith(original.id+',')&&l.includes(c.sourceAuditPriority)));
  assert.ok(c.sourceAuditPriority.startsWith('COMPULSORY_'));
  assert.equal(c.originalStem,original.stem);
  assert.deepEqual(c.originalOptions,original.options);
  assert.equal(c.originalCorrectOptionId,original.correctOptionId);
  assert.deepEqual(c.proposedOptions,original.options);
  assert.equal(c.proposedCorrectOptionId,original.correctOptionId);
  assert.match(c.proposedStem,/incompressibl/i);
  assert.ok(c.proposedStem.length>c.originalStem.length);
  assert.ok(c.independentExplanation.length>220);
  assert.ok(c.whyClarify.length>150);
  assert.ok(c.workedPhysics.length>=3);
  assert.ok(c.workedPhysics.every(x=>x.length>=18));
  assert.ok(c.limitations.length>=2);
  assert.equal(c.recommendedTreatment,'source-preserving-clarified-practice-variant-proposal');
  assert.equal(c.sourceArchivedUnchanged,true);
  assert.equal(c.approvedPublicPractice,false);
  assert.equal(c.boardEligible,false);
  assert.equal(c.studentSourceStillProvisional,true);
  assert.equal(c.teacherReviewDecision,'PENDING');
  for(const field of ['wording','sourceFidelity','scientificKey','individualFbiseSlo','individualCognitiveLevel','examCertification'])
   assert.equal(c.approval[field],'PENDING');
  assert.equal(c.candidateCognitiveOnly,'Application');
  assert.ok(c.candidateSloOnly.length>=1);
  for(const code of c.candidateSloOnly)assert.match(code,/^P-11-B-(?:36|40)$/);
  assert.ok(report.includes(c.originalSourceId)&&report.includes(c.originalStem)&&report.includes(c.proposedStem));
  assert.ok(report.includes('**'+c.proposedCorrectOptionId+'**'));
 }
 assert.deepEqual(pack.candidates.map(q=>q.proposedCorrectOptionId),['D','C','C']);
 pass('all exact source stems, four A-D choices, keys D/C/C, original audit priority and six explicit pending-approval locks retained');
 const [q61,q67,q78]=pack.candidates;
 assert.match(q61.proposedStem,/horizontal, unbranched/i);
 assert.match(q61.proposedStem,/steadily and incompressibly/i);
 assert.match(q61.proposedStem,/negligible viscous losses/i);
 assert.match(q61.proposedStem,/same streamline/i);
 assert.match(q61.proposedStem,/no pumps or turbines/i);
 assert.match(q67.proposedStem,/steadily and incompressibly without leaks/i);
 assert.match(q67.proposedStem,/constant cross-sectional area/i);
 assert.match(q67.proposedStem,/lower section to a higher one/i);
 assert.match(q78.proposedStem,/incompressible fluid flows steadily/i);
 assert.match(q78.proposedStem,/same streamline/i);
 assert.match(q78.proposedStem,/negligible viscous losses/i);
 assert.match(q78.proposedStem,/no pumps or turbines/i);
 pass('Q61 ideal-flow/no-pump streamline, Q67 constant discharge and Q78 compressibility gap are all explicitly qualified');
 // Independent ideal Bernoulli / continuity examples. No original key changes.
 const areaX=2,areaY=1,velocityX=3,rho=1000;
 const velocityY=areaX/areaY*velocityX;
 close(velocityY,6);
 const deltaP=.5*rho*(velocityX*velocityX-velocityY*velocityY);
 close(deltaP,-13500);
 assert.ok(deltaP<0,'narrower ideal horizontal section must have lower static pressure');
 const A1=4,A2=4,Q=12,h1=1,h2=4,g=9.8;
 close(Q/A1,Q/A2);
 close(.5*rho*(Q/A1)**2,.5*rho*(Q/A2)**2);
 close(rho*g*(h2-h1),29400);
 close(A1*(Q/A1),Q);
 close(A2*(Q/A2),Q);
 // Compressible mass-flow counterexample: same A, different densities and speeds.
 const Ac=2,rho1=2,rho2=1,v1=3,v2=6;
 close(rho1*Ac*v1,rho2*Ac*v2);
 assert.notEqual(v1,v2,'equal area does not imply equal velocity in compressible mass flow');
 // Equal-height ideal incompressible stream has equal kinetic terms and pressure.
 const v3=5;close(.5*rho*v3*v3,.5*rho*v3*v3);
 pass('independently rechecked Bernoulli ΔP<0, constant-A continuity, gravitational term and compressible equal-area counterexample');
 const ledger=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
 assert.equal(ledger.length,561);
 const header=ledger[0].split(',');
 for(const line of ledger.slice(1)){
  const cols=line.split(',');
  for(const field of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])
   assert.equal(cols[header.indexOf(field)],'PENDING','Original 560-row review queue must stay PENDING');
 }
 const release=load('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(release.releaseApproved,false);
 assert.equal(release.teacherSignoff,'pending');
 const unit=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(unit.status,'planned');assert.equal(unit.assessmentStatus,'not-published');
 const manifest=load('question-bank/manifest.json').grades.find(g=>g.grade===11).units;
 assert.equal(manifest[5].liveMcqCount,560);
 assert.equal(manifest.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
 assert.ok(!read('question-bank/manifest.json').includes('V113-TEACHER-ONLY'));
 assert.ok(!read('portal/learning-catalog.json').includes('V113-TEACHER-ONLY'));
 pass('560 teacher entries pending, 560/2250 provisional inventory intact, full Unit 6 and exams not released');
 console.log('V113 COMPLETE:',checks,'teacher-only proposal regression groups; no student/practice source edits');
}
main();
