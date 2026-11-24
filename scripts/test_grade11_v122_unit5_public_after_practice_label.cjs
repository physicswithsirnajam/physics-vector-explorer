#!/usr/bin/env node
'use strict';
// V122: link-label clarity only. Do not imply a hidden public key is authenticated.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const quick=read('portal/exam-quick-access.html');
const start=quick.indexOf('<details class="unit" data-unit="5"');
assert.ok(start>=0,'Unit 5 resource group must exist');
const end=quick.indexOf('</details>',start);
assert.ok(end>start,'Unit 5 resource group must close');
const unit5=quick.slice(start,end);
const newLink='<a href="./unit-05-descriptive-teacher.html">Descriptive &amp; Numerical Worked Answers — public after-practice solutions (not an official exam key) <span aria-hidden="true">↗</span></a>';
assert.ok(unit5.includes(newLink),'Exact honest, student-readable link label must appear inside Unit 5');
assert.equal((quick.match(/href="\.\/unit-05-descriptive-teacher\.html"/g)||[]).length,1,'Exactly one Unit 5 worked-key shortcut');
assert.equal((unit5.match(/href="\.\/unit-05-descriptive-student\.html"/g)||[]).length,1,'Retain original 40-mark student practice link');
assert.ok(unit5.indexOf('href="./unit-05-descriptive-student.html"')<unit5.indexOf('href="./unit-05-descriptive-teacher.html"'),'Practice shortcut must precede worked solutions');
assert.ok(unit5.includes('<section class="resource-group" data-kind="answers">'),'Keep existing resource category and filter');
assert.ok(quick.includes('These are practice and study resources, not an official examination syllabus or a certified answer key.'),'Keep global academic-status warning');
assert.ok(quick.includes('Seven-topic provisional preview — not a complete released course'),'Keep Unit 6 provisional warning');
const destination=read('portal/unit-05-descriptive-teacher.html');
assert.ok(destination.includes('Public, not access-restricted.'),'Destination itself must declare public access');
assert.ok(destination.includes('Only open after students complete or hand in the practice.'),'Destination preserves post-practice sequencing');
assert.ok(destination.includes('not FBISE-certified keys'),'Destination must not imply official exam certification');
const pack=JSON.parse(read('quality/grade11-v121-eight-public-teacher-resources-audience-review.json'));
assert.equal(pack.version,'V121');
assert.equal(pack.itemReviews.length,8);
assert.equal(pack.ownerDecision,'PENDING','Keep the historical V121 review immutable; subsequent owner choice is recorded in V122 note');
for(const item of pack.itemReviews){
 assert.equal(item.ownerDecision,'PENDING');
 assert.equal(item.routeAudience,'PUBLIC_GITHUB_PAGES_ROUTE_NOT_AUTHENTICATED');
}
const catalog=JSON.parse(read('portal/learning-catalog.json')).grades.find(g=>g.grade===11).units;
assert.deepEqual(catalog.slice(0,6).map(u=>u.unit===6?u.partialTestBuilderMcqCount:u.questionBankCount),[275,206,220,640,349,560]);
assert.equal(catalog[5].assessmentStatus,'not-published');
const reviews=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
assert.equal(reviews.releaseApproved,false);
const refs=JSON.parse(read('server/review-manifests/grade11-approved-public-review-refs-v99i.json'));
assert.equal(refs.questionRefs.length,2250);
const notes=read('quality/grade11-v122-unit5-public-after-practice-link-clarity.md');
for(const phrase of ['owner approved','December 7, 2026','public','not access-restricted','V121','2,250','560','no backend']){
 assert.ok(notes.toLowerCase().includes(phrase.toLowerCase()),'V122 decision note missing: '+phrase);
}
console.log('V122 PASS: single Unit 5 after-practice link, original practice-first flow, unchanged public key transparency, 8 historical reviews, 2,250 provisional references and nonrelease gates.');
