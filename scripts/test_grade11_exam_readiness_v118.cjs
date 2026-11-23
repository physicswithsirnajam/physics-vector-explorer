#!/usr/bin/env node
'use strict';
/* V118 audit contract: only reads student sites and source metadata.
 * Refuses to interpret a green audit as private backend, textbook or FBISE signoff.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),artifact=path.join(root,'qa-artifacts/grade11-v118-exam-readiness/readiness-audit.json');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const protectedPaths=[
 'portal/exam-quick-access.html','portal/learning-catalog.json','shared/navigation.js',
 'portal/learning-hub.js','practice-engine/index.html','portal/attempt-sync.js',
 'portal/app.js','portal/recaptcha-enterprise-v100m.mjs',
 'question-bank/grade-11/unit-06-topic-65-v84-80-source.json',
 'question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json',
 'question-bank/grade-11/unit-06-topic65-v116-approved-stagnation-practice-overlay.json',
 'question-bank/manifest.json','server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const before=Object.fromEntries(protectedPaths.map(p=>[p,hash(read(p))]));
const test=cp.spawnSync(process.execPath,['scripts/audit_grade11_exam_readiness_v118.cjs'],
 {cwd:root,encoding:'utf8',timeout:90000,maxBuffer:4*1024*1024});
assert.equal(test.status,0,'Source-only V118 audit failed:\n'+test.stdout+'\n'+test.stderr);
assert.ok(fs.existsSync(artifact),'Read-only QA audit did not generate the expected CI-only JSON');
const doc=JSON.parse(fs.readFileSync(artifact,'utf8'));
assert.equal(doc.version,'V118');
assert.equal(doc.scope,'read-only-source-and-local-route-audit');
assert.equal(doc.studentPagesChanged,false);
assert.equal(doc.boardExamReleaseChanged,false);
assert.equal(doc.teacherClassificationCertified,false);
assert.equal(doc.gatesPassed,7);
assert.deepEqual(doc.unitCounts.map(x=>x.unit),[1,2,3,4,5,6]);
assert.deepEqual(doc.unitCounts.map(x=>x.mcqs),[275,206,220,640,349,560]);
assert.equal(doc.unitCounts.reduce((s,x)=>s+x.mcqs,0),2250);
assert.equal(doc.unitCounts[5].courseStatus,'planned');
assert.equal(doc.unitCounts[5].assessmentStatus,'not-published');
assert.equal(doc.examQuick.unitCount,6);
assert.equal(doc.examQuick.missingResourceMessages,6);
assert.ok(doc.examQuick.localAndExternalHrefCount>=41);
assert.deepEqual(doc.examQuick.missingLinks,[]);
assert.deepEqual(doc.examQuick.unsafeLinks,[]);
assert.deepEqual(doc.hygiene.legacySiteNavigationHits,[]);
assert.ok(doc.catalog.resolvedUnitResources>=50,'Catalog unit links should be inventoried');
assert.ok(Array.isArray(doc.catalog.brokenLocalHref),'Catalog local links must be reported honestly, not silently discarded');
assert.equal(doc.catalog.historicalArchive.videoPages,15);
assert.equal(doc.catalog.historicalArchive.generalVideoPages,2);
assert.equal(doc.catalog.historicalArchive.pdfHandouts,17);
assert.equal(doc.catalog.historicalArchive.directYouTubeEntries,27);
assert.equal(doc.catalog.historicalArchive.uniqueYouTubeIds,26);
assert.equal(doc.exposure.reviewRequired,true);
assert.ok(doc.exposure.candidatePublicRoutes.every(x=>x.exists===true));
assert.ok(doc.exposure.linkedFromExamQuickAccess.includes('portal/unit-05-descriptive-teacher.html'));
assert.equal(doc.backend.issueReporting,'student-copy-only; no live inbox');
assert.equal(doc.backend.teacherAssignments,'not live');
assert.equal(doc.backend.appCheck,'monitoring-only');
assert.equal(doc.backend.cloudSaving,'only individual Unit 1/2 self-practice');
assert.ok(doc.priorities.some(x=>x.topic.includes('teacher-labelled')));
assert.ok(doc.priorities.some(x=>x.topic.includes('Unit6 exact textbook')));
assert.ok(doc.confidenceLimitations.some(x=>x.includes('not a live DNS/CDN')));
assert.ok(doc.confidenceLimitations.some(x=>x.includes('original NBF PDF')));
assert.ok(doc.confidenceLimitations.some(x=>x.includes('No live Firebase')));
const after=Object.fromEntries(protectedPaths.map(p=>[p,hash(read(p))]));
assert.deepEqual(after,before,'Read-only V118 audit modified a protected source, live student interface or historical exam bank');
const report=read('quality/grade11-v118-exam-readiness-six-unit-source-audit.md');
for(const token of ['December 7, 2026','Q45','Q58','Unit 6','Q55','Copy only',
 'public GitHub Pages','teacher','exam-readiness','PR #218']){
 assert.ok(report.includes(token),'Teacher-readable report missing required qualified subject '+token);
}
assert.ok(!/boardEligible:\s*true|releaseApproved:\s*true/.test(report));
console.log('V118 TEST PASSED: audit source unchanged, 7 source gates, all 6 units/2,250 MCQs, '+doc.examQuick.localAndExternalHrefCount+
 ' existing exam-page links, '+doc.catalog.brokenLocalHref.length+' independently recorded catalog findings, review-only public teacher surface and all backend/official-exam nonrelease locks');
