#!/usr/bin/env node
'use strict';
/* V95-B1 source-backed Topic6.1 student lesson regressions.
 * Run with --browser for Chromium 390/768/1440 layout, calculator and navigation.
 * These tests DO NOT certify original textbook exact text or permit full Unit6 release.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const file=p=>path.join(root,p),read=p=>fs.readFileSync(file(p),'utf8');
const pagePath='portal/unit-06-topic-61-study-v95b1.html';
const html=read(pagePath);
const css=read('portal/unit-06-study-v95b1.css');
const js=read('portal/unit-06-topic-61-study-v95b1.js');
const desk=read('portal/unit-06-learning-desk-v95a.html');
const audit=read('quality/grade11-unit06-v95b1-topic61-student-lesson-source-and-signoff.md');
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const xi=manifest.grades.find(x=>x.grade===11);
const topic=xi.units.find(x=>x.unit===6);
const unit=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===6);
assert.equal(topic.liveMcqCount,560);
assert.equal(topic.standaloneSituationQuestionCount,136);
assert.equal(topic.sourceFigureHeldCount,0);
assert.equal(xi.units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.equal(unit.status,'planned');
assert.equal(unit.questionBankCount,0);
assert.equal(unit.assessmentStatus,'not-published');
assert.equal(unit.simulationCount,5);
assert.equal(unit.partialTestBuilderMcqCount,560);
assert.equal(topic.perQuestionSloVerified,false);
assert.equal(topic.exactFbiseModeReady,false);
assert.equal(signoff.releaseApproved,false);
assert.equal(signoff.topics[0].topicTeacherApproved,false);
assert.equal(signoff.topics[0].studentLessonReady,false);
assert.ok(!fs.existsSync(file('portal/unit-06.html')),'Do not publish the full-course route');
assert.equal((desk.match(/class="topic" id="topic-/g)||[]).length,7);
assert.equal((desk.match(/class="stage" role="listitem"/g)||[]).length,28);
assert.ok(desk.includes('href="./unit-06-topic-61-study-v95b1.html"'),'Topic6.1 Read link not wired');
for(const n of ['62','63','64','65','66','67']){
 assert.ok(desk.includes('href="./unit-06-topic-'+n+'-preview.html"'),'Existing practice link missing '+n);
}
assert.equal((html.match(/class="lesson" id=/g)||[]).length,8,'Expected eight educational content sections');
assert.equal((html.match(/class="problem"/g)||[]).length,4,'Expected two source-data and two added worked problems');
assert.equal((html.match(/<details>/g)||[]).length,6,'Expected six native revision check disclosures');
for(const id of ['why','derivation','floating','ships','apparent','worked','try-it','review']){
 assert.ok(html.includes('id="'+id+'"'),'Missing content section '+id);
}
for(const item of ['P-11-B-33','P-11-B-34','Summative','Application','teacher','9.8 N','1560 N','0.020408','29.4 N','0.90 m³','0.80 m³']){
 assert.ok(html.includes(item),'Missing mandatory lesson source/scientific element '+item);
}
for(const id of ['T61-01','T61-02','T61-03','T61-04','T61-05','T61-06','T61-07','T61-08']){
 assert.ok(audit.includes(id),'Source amendment not tracked: '+id);
}
assert.ok(audit.includes('original printed NBF')||audit.includes('Original NBF printed'));
assert.ok(html.includes('not reproduced as verbatim textbook questions'));
assert.ok(html.includes('not a completed or officially approved Unit 6 course'));
assert.ok(html.includes('not an original textbook scan'));
assert.ok(!html.includes('Grade11_Unit6_COMPLETE_MASTER_ALL.pdf'),'Private document path must not become a student download');
assert.ok(!html.includes('<iframe'),'Protected PDF must not be embedded');
assert.ok(!html.includes('unit6-figure617-reference.svg'),'Source-original figure 6.17 must not be reused');
assert.ok(html.includes('../assets/illustrations/unit6-figure62-reference.svg'));
assert.match(css,/@media\(max-width:550px\)/);
assert.match(css,/@media print/);
assert.match(css,/prefers-reduced-motion/);
assert.ok(js.includes('event.preventDefault()'));
assert.ok(!js.includes('localStorage')&&!js.includes('fetch(')&&!js.includes('firebase'));
const urls=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(x=>x[1]);
for(const relative of urls){
 if(relative.startsWith('#'))continue;
 if(/^[a-z]+:/i.test(relative))throw Error('Unexpected external/student-private route '+relative);
 const target=relative.split('#')[0].split('?')[0];
 if(!target)continue;
 assert.ok(fs.existsSync(path.resolve(root,'portal',target)),'Broken local resource: '+relative);
}
// Independent arithmetic checks from reopened teacher master; not source-text transcription.
function approx(id,actual,expected,tol=1e-9){
 assert.ok(Math.abs(actual-expected)<=tol*Math.max(1,Math.abs(expected)),id+': '+actual+' vs '+expected);
}
const rho=1000,g=9.8;
approx('Hydrostatic upthrust 10cm cube',rho*g*.1**3,9.8);
const ironVolume=200/(rho*g);
approx('Displaced iron volume',ironVolume,.02040816326530612);
approx('Iron true weight',7800*ironVolume*g,1560);
approx('Iron submerged balance tension',1560-200,1360);
approx('600-density block fraction',600/rho,.6);
approx('5kg true weight',5*g,49);
approx('5kg/2L upthrust',rho*g*.002,19.6);
approx('5kg/2L apparent weight',5*g-rho*g*.002,29.4);
approx('900kg displacement',900/rho,.9);
assert.ok(.9>.8);
console.log('PASS V95-B1 static: detailed lesson 8 sections, 4 worked problems, 6 native checks, original V93 illustration, source/rights gates and 560/2250 inventory.');

// Browser mode tests calculator, links, 390px/768px/1440px screen without changing account state.
async function browser(){
 const {chromium}=require('playwright');
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
 const server=http.createServer((req,res)=>{
  let url;
  try{url=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\/+/, '');}catch{res.writeHead(400);res.end();return;}
  const name=path.resolve(root,url||'index.html');
  if(!name.startsWith(root+path.sep)||!fs.existsSync(name)||!fs.statSync(name).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(name)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(name).pipe(res);
 });
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 let instance;
 try{
  instance=await chromium.launch({headless:true});
  const base='http://127.0.0.1:'+server.address().port;
  for(const width of [390,768,1440]){
   const tab=await instance.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
   const errors=[];tab.on('pageerror',e=>errors.push(e.message));
   const response=await tab.goto(base+'/'+pagePath,{waitUntil:'load'});
   assert.equal(response.status(),200,'Study page HTTP status');
   await tab.locator('#why').waitFor({state:'visible'});
   assert.equal(await tab.locator('.lesson').count(),8);
   const sizing=await tab.evaluate(()=>({viewport:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth}));
   assert.ok(sizing.scrollWidth<=sizing.viewport+2,'Lesson horizontal overflow @ '+width+': '+JSON.stringify(sizing));
   const figure=tab.locator('.teaching-figure img');
   assert.ok(await figure.getAttribute('alt'));
   await figure.scrollIntoViewIfNeeded();
   const imageLoaded=await figure.evaluate(im=>im.complete&&im.naturalWidth>0);
   assert.equal(imageLoaded,true,'Original illustration must load @ '+width);
   const details=tab.locator('#review details');
   assert.equal(await details.count(),6);
   await details.first().locator('summary').click();
   assert.equal(await details.first().evaluate(el=>el.open),true);
   await tab.locator('#fluid-density').fill('1000');
   await tab.locator('#displaced-litres').fill('2');
   await tab.locator('#body-weight').fill('25');
   await tab.locator('#buoyancy-form button').click();
   const initial=await tab.locator('#calc-output').innerText();
   assert.ok(initial.includes('19.6 N upward')&&initial.includes('5.4 N less'), 'Expected correct first calculation @ '+width+': '+initial);
   await tab.locator('#fluid-density').fill('800');
   await tab.locator('#displaced-litres').fill('4');
   await tab.locator('#body-weight').fill('10');
   await tab.locator('#buoyancy-form button').click();
   const changed=await tab.locator('#calc-output').innerText();
   assert.ok(changed.includes('31.36 N upward')&&changed.includes('21.36 N greater'), 'Expected second calculation @ '+width+': '+changed);
   await tab.locator('#fluid-density').fill('-5');
   await tab.locator('#buoyancy-form button').click();
   assert.equal(await tab.locator('#calc-error').isVisible(),true,'Invalid physical density should be rejected');
   assert.deepEqual(errors,[],'No JS errors @ '+width);
   await tab.close();
  }
  console.log('PASS V95-B1 Chromium: 390, 768, 1440 layouts, diagram load, revision disclosure and local calculator normal/changed/invalid values.');
 } finally {
  if(instance)await instance.close();
  await new Promise(ok=>server.close(ok));
 }
}
if(process.argv.includes('--browser'))browser().catch(err=>{console.error(err);process.exitCode=1;});
