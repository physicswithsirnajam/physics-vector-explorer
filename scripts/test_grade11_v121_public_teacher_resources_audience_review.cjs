#!/usr/bin/env node
'use strict';
// V121: audience review only. Never confuse a Reveal control with private access.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const gitBlob=v=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(v)+'\0').update(v).digest('hex');
const pack=json('quality/grade11-v121-eight-public-teacher-resources-audience-review.json');
const report=read('quality/grade11-v121-eight-public-teacher-resources-audience-review.md');
let gates=0;function pass(s){gates++;console.log('V121 PASS:',s)}
function main(){
 assert.equal(pack.schemaVersion,1);
 assert.equal(pack.version,'V121');
 assert.equal(pack.scope,'TEACHER_REVIEW_ONLY_NO_PUBLIC_VISIBILITY_CHANGES');
 assert.equal(pack.ownerDecision,'PENDING');
 assert.equal(pack.examDate,'2026-12-07');
 assert.equal(pack.examinedPublicRoutes,8);
 assert.equal(pack.keyAndWorkedAnswerRoutes,3);
 assert.equal(pack.projectorDiscussionRoutes,2);
 assert.equal(pack.academicMappingRoutes,2);
 assert.equal(pack.figureReviewRoutes,1);
 assert.ok(pack.recommendation.includes('backend authorization'));
 assert.equal(pack.itemReviews.length,8);
 const expected=[
  'portal/unit-05-descriptive-teacher.html',
  'portal/unit-05-mcq-key.html',
  'portal/unit-05-mcq-set-b-key.html',
  'portal/unit-04-discussion-slides.html',
  'portal/unit-05-projector-discussion.html',
  'portal/unit-04-slo-audit.html',
  'portal/unit-05-fbise-audit.html',
  'portal/unit-06-figure-verification-v91.html'
 ];
 assert.deepEqual(pack.itemReviews.map(x=>x.publicRoute),expected);
 assert.deepEqual(pack.itemReviews.map(x=>x.priority),['P1','P1','P1','P2','P2','P2','P2','P2']);
 assert.equal(new Set(pack.itemReviews.map(x=>x.reviewId)).size,8);
 pass('eight exact public worked-key, discussion, mapping and figure-review pages each retain owner decision PENDING');
 const companions=new Set();
 for(const [i,row] of pack.itemReviews.entries()){
  assert.equal(row.reviewId,'V121-'+String(i+1).padStart(2,'0'));
  assert.equal(row.originalBlobSha,gitBlob(read(row.publicRoute)),
   'Original public HTML page changed: '+row.publicRoute);
  assert.equal(row.routeAudience,'PUBLIC_GITHUB_PAGES_ROUTE_NOT_AUTHENTICATED');
  assert.equal(row.ownerDecision,'PENDING');
  assert.equal(row.keepExistingPublicPageUnchanged,true);
  assert.equal(row.perItemFBISECertificationApproved,false);
  assert.equal(row.requiresAuthenticatedBackendIfRestricted,true);
  assert.ok(row.sourceSupportedDescription.length>=40);
  assert.ok(row.ownerDecisionRequested.length>=40);
  assert.equal(row.verbatimPageEvidence.length,2);
  for(const quote of row.verbatimPageEvidence)
   assert.ok(read(row.publicRoute).includes(quote),'Original page does not support evidence '+row.publicRoute);
  assert.ok(report.includes(row.publicRoute),'Teacher report omits inspected route '+row.publicRoute);
  for(const c of row.companionPublicFiles){
   assert.ok(c.path.startsWith('portal/')||c.path.startsWith('question-bank/grade-11/'));
   assert.equal(gitBlob(read(c.path)),c.originalBlobSha,'Companion JS/JSON blob changed '+c.path);
   companions.add(c.path);
   if(c.path.endsWith('.js'))
    assert.ok(read(row.publicRoute).includes(path.basename(c.path)),'Expected existing script tag '+c.path);
  }
 }
 assert.equal(companions.size,10);
 pass('original eight HTML and ten distinct public JS/answer files protected by exact Git blob fingerprints and verbatim evidence');
 const descriptive=read('portal/unit-05-descriptive-teacher.js');
 const a=read('portal/unit-05-mcq-key.js');
 const b=read('portal/unit-05-mcq-set-b-key.js');
 const slides=read('portal/unit-04-discussion-slides.js');
 const projector=read('portal/unit-05-projector-discussion-v53.js');
 assert.ok(descriptive.includes('Public, unprotected, AFTER-PRACTICE teacher discussion'));
 assert.ok(descriptive.includes('unit-05-v52-descriptive-teacher-key.json'));
 assert.ok(a.includes('This is not access control'));
 assert.ok(b.includes('This is not access control'));
 assert.ok(a.includes('unit-05-v50-16-teacher-key.json'));
 assert.ok(b.includes('unit-05-v51-16-teacher-key-b.json'));
 assert.ok(slides.includes('No clock, no answer collection, no authentication'));
 assert.ok(projector.includes('teacher key is requested only'));
 assert.ok(projector.includes('unit-05-v52-descriptive-teacher-key.json'));
 assert.ok(read('portal/unit-06-figure-verification-v91.html').includes('ephemeral local browser worksheet'));
 assert.ok(report.includes('Reveal solutions')&&report.includes('presentation'));
 pass('public key files and deliberate reveals documented as presentation behavior, never server-side authorization');
 const quick=read('portal/exam-quick-access.html');
 assert.ok(quick.includes('<a href="./unit-05-descriptive-teacher.html">Descriptive &amp; Numerical Worked Answers'));
 assert.ok(quick.includes('not an official examination syllabus'));
 assert.ok(read('portal/unit-05-fbise-audit.html').includes('Official SLO classification verified'));
 assert.ok(read('portal/unit-04-slo-audit.html').includes('STUDY COVERAGE DOES NOT EQUAL ASSESSMENT APPROVAL'));
 assert.ok(!read('portal/learning-hub.js').includes('V121'));
 pass('the existing student revision navigation and public curriculum warnings are unchanged');
 const units=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units;
 assert.deepEqual(units.slice(0,6).map(u=>u.unit===6?u.partialTestBuilderMcqCount:u.questionBankCount),[275,206,220,640,349,560]);
 assert.equal(units[5].status,'planned');
 assert.equal(units[5].assessmentStatus,'not-published');
 const refs=json('server/review-manifests/grade11-approved-public-review-refs-v99i.json');
 assert.equal(refs.questionRefs.length,2250);
 assert.equal(refs.bankVersions['6'],'v116-topic64-v111-and-topic65-five-clarified-560-provisional');
 for(const [file,version,count] of [
  ['question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json','V111',4],
  ['question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json','V114',3],
  ['question-bank/grade-11/unit-06-topic65-v116-approved-stagnation-practice-overlay.json','V116',2]
 ]){
  const x=json(file);assert.equal(x.version,version);assert.equal(x.overlayQuestionCount,count);
 }
 const release=json('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(release.releaseApproved,false);
 assert.equal(release.teacherSignoff,'pending');
 const queue=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
 assert.equal(queue.length,561);
 const header=queue[0].split(',');
 for(const row of queue.slice(1)){
  const cells=row.split(',');
  for(const key of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])
   assert.equal(cells[header.indexOf(key)],'PENDING');
 }
 pass('all 560 pending Unit6 academic holds, 2250 answer-free public report IDs and V111/V114/V116 corrections remain protected');
 assert.ok(report.includes('December 7, 2026'));
 assert.ok(report.includes('teacher review only'));
 assert.ok(report.includes('authenticated backend'));
 assert.ok(report.includes('not an official examination key'));
 assert.ok(report.includes('GitHub Pages'));
 assert.ok(report.includes('No audience reclassification is authorized'));
 assert.ok(pack.limitations.some(x=>x.includes('No NBF scans')));
 assert.ok(pack.limitations.some(x=>x.includes('student submissions')));
 for(const p of ['portal/exam-quick-access.html','portal/simulations.html','shared/navigation.js',
  'shared/sitewide-science-print-v112.js','portal/attempt-sync.js',
  'server/review-manifests/grade11-approved-public-review-refs-v99i.json'])
  assert.ok(!read(p).includes('V121'),'Review-only notes leaked into runtime '+p);
 pass('explicit nonapproval, public/static security boundary and no student-facing V121 modifications');
 console.log('V121 COMPLETE:',gates,'source science, audience and academic nonrelease checks');
}
main();
