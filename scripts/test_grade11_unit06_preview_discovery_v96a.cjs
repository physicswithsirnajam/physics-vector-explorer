#!/usr/bin/env node
'use strict';
/* V96-A: Unit6 is discoverable only as a provisional public practice preview.
 * Do not change the course's planned status, turn on assessment release,
 * imply approved SLOs/keys, or mutate student banks or teacher approvals.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const cat=JSON.parse(read('portal/learning-catalog.json'));
const units=cat.grades.find(g=>g.grade===11).units;
const source=JSON.parse(read('question-bank/manifest.json'));
const grade=source.grades.find(g=>g.grade===11);
const sourceUnit=grade.units.find(u=>u.unit===6);
const unit=units.find(u=>u.unit===6);
assert.equal(units.length,14);
assert.equal(units.filter(u=>u.status==='available').length,5);
assert.equal(units.filter(u=>u.practicePreviewStatus==='public-provisional').length,1);
assert.equal(units.filter(u=>u.status==='planned'&&!u.practicePreviewStatus).length,8);
assert.equal(unit.status,'planned','Unit6 full course must remain unreleased');
assert.equal(unit.assessmentStatus,'not-published');
assert.equal(unit.practicePreviewStatus,'public-provisional');
assert.equal(unit.questionBankCount,0,'Full course bank must remain unreleased');
assert.equal(unit.partialTestBuilderMcqCount,560);
assert.equal(unit.sourceTopicMcqCount,560);
assert.equal(unit.sourceFigureHeldCount,0);
assert.equal(unit.simulationCount,5);
assert.equal(unit.landingHref,'./unit-06-learning-desk-v95a.html');
assert.match(unit.studentNotice,/Individual SLO\/cognitive classification remains provisional/);
assert.match(unit.qualityStatus,/teacher-approval-pending/);
assert.equal(sourceUnit.liveMcqCount,560);
assert.equal(sourceUnit.perQuestionSloVerified,false);
assert.equal(sourceUnit.exactFbiseModeReady,false);
assert.equal(grade.units.reduce((sum,u)=>sum+(u.liveMcqCount||0),0),2250);
assert.equal(sourceUnit.standaloneSituationQuestionCount,136);
assert.equal(sourceUnit.independentSharedStimulusGroupCount,0);
const expected=[
 ['unit6-preview-learning-desk','STUDY','./unit-06-learning-desk-v95a.html'],
 ['unit6-preview-central-mcqs','PRACTISE','../build-your-physics-test.html?unit=6'],
 ['unit6-preview-simulations','SIMULATIONS','./simulations.html?unit=6']
];
assert.deepEqual(unit.resourceIds,[],'Full course resource IDs remain unpublished');
assert.deepEqual(unit.previewResources.map(r=>r.id),expected.map(e=>e[0]));
assert.equal(cat.resources.length,59,'Original public resource registry unchanged');
assert.equal(new Set(cat.resources.map(r=>r.id)).size,cat.resources.length);
for(const [id,category,href] of expected){
 const r=unit.previewResources.find(x=>x.id===id);
 assert.ok(r,'Missing resource '+id);
 assert.equal(r.category,category);
 assert.equal(r.href,href);
 assert.equal(r.access,'public-link');
 assert.equal(r.public,true);
 assert.equal(r.external,false);
 assert.ok(/provisional|teacher|uncertified|not/i.test(r.accessDescription||''));
 assert.ok(!/sites\.google\.com/.test(r.href));
 const local=path.resolve(root,'portal',href.split('?')[0]);
 assert.ok(fs.existsSync(local),'Broken Unit6 resource link '+href);
}
const hub=read('portal/learning-hub.js');
assert.ok(hub.includes("u.practicePreviewStatus==='public-provisional'"));
assert.ok(hub.includes("const active=[...published,...previews]"));
assert.ok(hub.includes('visibleUnits.filter(u=>u.practicePreviewStatus'), 'preview resources must be rendered in Hub');
assert.ok(hub.includes('u.unit<=6'),'Unit6 should be included in MCQ practice action');
assert.ok(hub.includes("practice preview"));
const nav=read('shared/navigation.js');
assert.ok(nav.includes("u.practicePreviewStatus==='public-provisional'"));
assert.ok(nav.includes("'Fluid Mechanics (practice preview)'"),'Fallback includes Unit6 desk');
assert.ok(nav.includes('index===5?'), 'Unit6 fallback must target existing preview page');
assert.ok(nav.includes('unit.previewResources'), 'preview resource links must render in drawer');
assert.ok(nav.includes('Unit 6 is a provisional practice preview'));
const html=read('portal/index.html');
assert.ok(html.includes('<strong id="hub-linked-units">6</strong>'));
assert.ok(html.includes('<strong id="hub-awaiting-units">8</strong>'));
assert.ok(html.includes('provisional Unit 6 practice preview'));
assert.ok(read('.github/workflows/validate-grade11-navigation-v58.yml').includes('u.length!==6||c.resources.length!==59'));
const queue=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(queue.length,561);
const head=queue[0].split(',');
for(const field of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval']){
 const pos=head.indexOf(field);assert.ok(pos>=0);
 assert.equal(queue.slice(1).filter(row=>row.split(',')[pos]==='PENDING').length,560);
}
const release=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
assert.equal(release.releaseApproved,false);
assert.equal(release.studentCourseStatus,'planned');
assert.equal(release.teacherSignoff,'pending');
console.log('V96-A PASS: Grade XI menu has 5 existing available units and 1 public provisional Unit6 preview; 3 valid preview resources, 560 original MCQs, 560 pending approvals and no formal assessment release.');
