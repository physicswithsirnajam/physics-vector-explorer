#!/usr/bin/env node
'use strict';
/* V119 — two source-verified student revision shortcuts only.
 * No MCQ bank, approval state, Firebase, official exam or PDF stamp changes.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const load=p=>JSON.parse(read(p));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const protectedFiles=[
 'question-bank/grade-11/unit-06-topic-65-v84-80-source.json',
 'question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json',
 'question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json',
 'question-bank/grade-11/unit-06-topic65-v116-approved-stagnation-practice-overlay.json',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'portal/learning-catalog.json','portal/learning-hub.js',
 'shared/practice-bank-adapter-v55.js','shared/sitewide-science-print-v112.js',
 'portal/unit-06-balanced-mcq-v95c1.html','portal/unit-06-learning-desk-v95a.html',
 'portal/attempt-sync.js','quality/grade11-unit06-v94d-signoff-matrix.json'
];
const before=Object.fromEntries(protectedFiles.map(p=>[p,sha(read(p))]));
const html=read('portal/exam-quick-access.html');
const start=html.indexOf('<details class="unit" data-unit="6"');
const end=html.indexOf('</details>',start);
assert.ok(start!==-1&&end>start);
const unit6=html.slice(start,end);
const mcq=unit6.match(/<section class="resource-group" data-kind="mcq">([\s\S]*?)<\/section>/);
assert.ok(mcq,'Provisional Unit6 MCQ section missing');
const links=[...mcq[1].matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(x=>({href:x[1],label:x[2].replace(/<[^>]+>/g,'').trim()}));
const exact=[
 '../build-your-physics-test.html?unit=6',
 './unit-06-balanced-mcq-v95c1.html',
 './unit-06-learning-desk-v95a.html#choose-topic'
];
assert.deepEqual(links.map(x=>x.href),exact);
assert.equal(new Set(links.map(x=>x.href)).size,3);
assert.ok(links[0].label.includes('560 provisional Unit 6 MCQs'));
assert.match(links[1].label,/Seven-topic balanced practice.*28.*35.*42.*56 MCQs/);
assert.match(links[2].label,/Choose Topic 6.1.*6.7.*80 provisional MCQs per topic/);
for(const x of links){
 const target=new URL(x.href,'https://physicswithsirnajam.github.io/physics-vector-explorer/portal/exam-quick-access.html');
 assert.equal(target.origin,'https://physicswithsirnajam.github.io');
 assert.ok(target.pathname.startsWith('/physics-vector-explorer/'));
 const file=path.join(root,target.pathname.slice('/physics-vector-explorer/'.length));
 assert.ok(fs.existsSync(file)&&fs.statSync(file).isFile(),'Broken source-backed revision target: '+x.href);
 if(target.hash)assert.ok(read(path.relative(root,file)).includes('id="'+target.hash.slice(1)+'"'),'Missing topic anchor '+x.href);
}
console.log('V119 PASS: all three MCQ links uniquely source-backed and correctly labelled provisional; 2 existing paths added');
const desk=read('portal/unit-06-learning-desk-v95a.html');
const balanced=read('portal/unit-06-balanced-mcq-v95c1.html');
assert.ok(desk.includes('<option value="topic-61"')&&desk.includes('<option value="topic-67"'));
assert.ok(desk.includes('id="choose-topic"'));
assert.ok(desk.includes('not yet the completed Unit 6 course'));
assert.ok(balanced.includes('all seven Fluid Mechanics topics equally'));
assert.ok(balanced.includes('28, 35, 42 or 56'));
assert.ok(balanced.includes('Public, ungraded self-practice'));
assert.ok(balanced.includes('practice-bank-adapter-v55.js?v=116'));
assert.ok(balanced.includes('sitewide-science-print-v112.js'));
assert.ok(unit6.includes('Seven-topic provisional preview — not a complete released course'));
assert.ok(html.includes('not an official examination syllabus'));
assert.ok(html.includes('scores remain local/printable'));
assert.ok(!/initializeApp|firebaseConfig|serviceAccount|sendReport|appCheckDebug|FIREBASE_APPCHECK_DEBUG_TOKEN/.test(html));
console.log('V119 PASS: truthful 7-topic preview, balanced 28/35/42/56 quiz, existing five-stage practice protections and no exam grade claim');
const ids=load('server/review-manifests/grade11-approved-public-review-refs-v99i.json');
assert.equal(ids.questionRefs.length,2250);
assert.equal(ids.bankVersions['6'],'v116-topic64-v111-and-topic65-five-clarified-560-provisional');
const source=load('question-bank/grade-11/unit-06-topic-65-v84-80-source.json');
assert.equal(source.questions.length,80);
const overlayPaths=[
 ['question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json','V111',4],
 ['question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json','V114',3],
 ['question-bank/grade-11/unit-06-topic65-v116-approved-stagnation-practice-overlay.json','V116',2]
];
for(const [p,v,n] of overlayPaths){const q=load(p);assert.equal(q.version,v);assert.equal(q.overlayQuestionCount,n)}
const catalog=load('portal/learning-catalog.json').grades.find(g=>g.grade===11);
assert.deepEqual(catalog.units.slice(0,6).map(q=>q.unit===6?q.partialTestBuilderMcqCount:q.questionBankCount),[275,206,220,640,349,560]);
const release=load('quality/grade11-unit06-v94d-signoff-matrix.json');
assert.equal(release.releaseApproved,false);
assert.equal(catalog.units[5].status,'planned');
assert.equal(catalog.units[5].assessmentStatus,'not-published');
const rows=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(rows.length,561);
const h=rows[0].split(',');
for(const row of rows.slice(1)){
 const c=row.split(',');
 for(const k of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(c[h.indexOf(k)],'PENDING');
}
console.log('V119 PASS: 560 Unit6 academic hold rows, untouched 80-question source, V111/V114/V116 corrections and 2,250 pinned references');
const after=Object.fromEntries(protectedFiles.map(p=>[p,sha(read(p))]));
assert.deepEqual(after,before,'V119 source test changed a protected bank, PDF watermark or backend file');
const report=read('quality/grade11-v119-exam-quick-unit6-mcq-pathways.md');
for(const word of ['December 7','PR #218','Q55','Q56','V111','V114','V116','43','provisional','PENDING','Unit 1']){
 assert.ok(report.includes(word),'Missing teacher-readable decision boundary '+word);
}
assert.ok(!report.includes('boardEligible:true'));
console.log('V119 COMPLETE: source-based pre-exam navigation patch, zero source/answer/backend changes');
