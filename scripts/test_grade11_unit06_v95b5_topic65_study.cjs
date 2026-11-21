#!/usr/bin/env node
'use strict';
/* V95-B5: Bernoulli lesson science, source-boundary and interactive tests.
 * Does not certify original printed textbook wording or individual FBISE MCQ SLOs.
 * --browser: Chromium 390px mobile, 768px tablet, 1440px projector/desktop.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pagePath='portal/unit-06-topic-65-study-v95b5.html';
const html=read(pagePath),js=read('portal/unit-06-topic-65-study-v95b5.js');
const css=read('portal/unit-06-study-v95b1.css');
const desk=read('portal/unit-06-learning-desk-v95a.html');
const report=read('quality/grade11-unit06-v95b5-topic65-student-lesson-source-and-signoff.md');
const svg=read('assets/illustrations/unit6-v95b5-bernoulli-pressure-work-original.svg');
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalogue=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=manifest.grades.find(x=>x.grade===11);
const bank=grade.units.find(x=>x.unit===6);
const unit=catalogue.grades.find(x=>x.grade===11).units.find(x=>x.unit===6);
assert.equal(bank.liveMcqCount,560);
assert.equal(bank.sourceFigureHeldCount,0);
assert.equal(bank.standaloneSituationQuestionCount,136);
assert.equal(bank.independentSharedStimulusGroupCount,0);
assert.equal(bank.perQuestionSloVerified,false);
assert.equal(bank.exactFbiseModeReady,false);
assert.equal(grade.units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.equal(unit.status,'planned');
assert.equal(unit.assessmentStatus,'not-published');
assert.equal(unit.questionBankCount,0);
assert.equal(unit.partialTestBuilderMcqCount,560);
assert.equal(unit.simulationCount,5);
assert.equal(signoff.releaseApproved,false);
assert.equal(signoff.topics[4].topicTeacherApproved,false);
assert.equal(signoff.topics[4].studentLessonReady,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')),'Keep complete-course URL reserved until final signoff');
assert.equal((desk.match(/class="topic" id="topic-/g)||[]).length,7);
assert.equal((desk.match(/class="stage" role="listitem"/g)||[]).length,28);
assert.equal((desk.match(/<details>/g)||[]).length,7);
for(const n of ['61','62','63','64','65']){
 assert.ok(desk.includes('href="./unit-06-topic-'+n+'-study-v95b'+(Number(n)-60)+'.html"'),'Missing detailed lesson '+n);
}
for(const n of ['61','62','63','64','65','66','67'])assert.ok(desk.includes('href="./unit-06-topic-'+n+'-preview.html"'),'Missing original MCQ practice '+n);
assert.ok(desk.includes('href="../bernoulli-venturi.html"'));
assert.equal((html.match(/class="lesson" id=/g)||[]).length,8);
assert.equal((html.match(/class="problem"/g)||[]).length,8);
assert.equal((html.match(/<details>/g)||[]).length,8);
for(const name of ['assumptions','derive','terms','special','limits','worked','try-it','review'])assert.ok(html.includes('id="'+name+'"'),'Missing student section '+name);
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate form or section identifiers are inaccessible');
for(const term of [
'P-11-B-39','P-11-B-40','Formative','Summative','horizontal and vertical',
'not a completed or teacher-approved Unit 6 course','P + ½ρv² + ρgh = constant',
'−P₂A₂Δx₂','W = (P₁ − P₂)V','same streamline',
'169.5 kPa','157.7 kPa','3.50 m/s','169 kPa','22.18 m','183.1 kPa',
'600 J','136.4 kPa','Pa = 1 J/m³','not an NBF Figure 6.9 reproduction',
'negative gauge pressure','supplementary','pascals'
])assert.ok(html.toLowerCase().includes(term.toLowerCase()),'Missing academic/figure/numeric boundary: '+term);
for(let n=1;n<=9;n++)assert.ok(report.includes('T65-'+String(n).padStart(2,'0')),'Missing teacher-review issue T65-'+n);
assert.ok(report.includes('printed pp.99–101'));
assert.ok(!html.includes('Grade11_Unit6_COMPLETE_MASTER_ALL.pdf'),'Private PDF cannot be a student resource');
assert.ok(!html.includes('<iframe'),'Do not embed textbook pages in portal');
assert.ok(svg.includes('role="img"')&&svg.includes('aria-labelledby="t d"'));
assert.ok(svg.includes('negative work')||svg.includes('negative outlet'));
assert.match(css,/@media\(max-width:550px\)/);
assert.match(css,/@media print/);
assert.match(css,/prefers-reduced-motion/);
assert.ok(js.includes('event.preventDefault()'));
assert.ok(!/\b(?:fetch|localStorage|sessionStorage|firebase)\b/.test(js),'Calculators must remain browser-local');
for(const relative of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1])){
 if(relative.startsWith('#'))continue;
 const resource=relative.split('?')[0].split('#')[0];
 if(!resource)continue;
 assert.ok(!/^[a-z]+:/i.test(resource),'Unexpected external resource: '+relative);
 assert.ok(fs.existsSync(path.resolve(root,'portal',resource)),'Broken lesson resource '+relative);
}
const close=(name,actual,expected,tol=1e-9)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=Math.max(1e-12,Math.abs(expected)*tol),name+': got '+actual+' instead of '+expected);
const rho=1000,g=9.8;
const outlet=(p1,v1,v2,h1,h2,density=rho,gravity=g)=>p1+.5*density*(v1*v1-v2*v2)+density*gravity*(h1-h2);
close('Horizontal p2',outlet(180000,2,5,0,0),169500);
close('Vertical rising p2',outlet(220000,3,4,2,8),157700);
close('Pressure difference unknown speed',Math.sqrt(1.2**2+2*5400/rho),Math.sqrt(12.24));
close('Same speed descending',outlet(120000,3,3,12,7),169000);
close('Head pressure',180000/(rho*g),18.367346938775512);
close('Head velocity',4**2/(2*g),.8163265306122449);
close('Head total',180000/(rho*g)+4**2/(2*g)+3,22.183673469387756);
const v2=(8/4)**2*1.5;
close('Continuity diameter squared',v2,6);
close('Continuity+Bernoulli p2',outlet(200000,1.5,v2,0,0),183125);
close('Net pressure work',(180000-150000)*.02,600);
close('Mixed rising and slowing p2',outlet(150000,4,2,5,7),136400);
close('Mixed speed pressure contribution',.5*rho*(16-4),6000);
close('Mixed height contribution',rho*g*(5-7),-19600);
close('Ideal air supplementary',outlet(101325,5,25,0,0,1.2),100965);
close('Oil supplementary pressure drop',.5*850*(6**2-2**2),13600);
close('Velocity radicand negative example',4+2*(100000-200000)/rho+2*g*(0-0),-196);
console.log('V95-B5 STATIC PASS: all 5 detailed reads, 8 lesson sections/8 worked calculations/8 self-checks, original diagram and B39/B40/teacher-release gates.');

async function browser(){
 const {chromium}=require('playwright');
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
 const server=http.createServer((req,res)=>{
  let relative;
  try{relative=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\/+/, '');}
  catch{res.writeHead(400);res.end();return;}
  const target=path.resolve(root,relative||'index.html');
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(target).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let instance;
 try{
  instance=await chromium.launch({headless:true});
  const base='http://127.0.0.1:'+server.address().port;
  for(const width of [390,768,1440]){
   const page=await instance.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/'+pagePath,{waitUntil:'load'});
   assert.equal(response.status(),200);
   assert.equal(await page.locator('.lesson').count(),8);
   const dimensions=await page.evaluate(()=>({vw:document.documentElement.clientWidth,full:document.documentElement.scrollWidth}));
   assert.ok(dimensions.full<=dimensions.vw+2,'Horizontal overflow '+width+': '+JSON.stringify(dimensions));
   const figure=page.locator('.teaching-figure img');
   await figure.scrollIntoViewIfNeeded();
   const loaded=await figure.evaluate(async img=>{try{await img.decode();return img.complete&&img.naturalWidth>0;}catch{return false;}});
   assert.equal(loaded,true,'Original pressure-work diagram failed at '+width);
   const cards=page.locator('#review details');assert.equal(await cards.count(),8);
   await cards.first().locator('summary').click();
   assert.equal(await cards.first().evaluate(x=>x.open),true);
   await page.locator('#bernoulli-pressure-form button[type="submit"]').click();
   let result=await page.locator('#bern-pressure-output').innerText();
   assert.ok(result.includes('169.5 kPa')&&result.includes('-10.5 kPa'),'Horizontal pressure calculation failed @'+width+': '+result);
   await page.locator('#preset-rising').click();
   result=await page.locator('#bern-pressure-output').innerText();
   assert.ok(result.includes('157.7 kPa')&&result.includes('-3.5 kPa')&&result.includes('-58.8 kPa'),'Vertical accelerating case failed @'+width+': '+result);
   await page.locator('#preset-slowing').click();
   result=await page.locator('#bern-pressure-output').innerText();
   assert.ok(result.includes('136.4 kPa')&&result.includes('6 kPa')&&result.includes('-19.6 kPa'),'Rising but slowing mixed case failed @'+width+': '+result);
   await page.locator('#bern-density').fill('0');
   await page.locator('#bernoulli-pressure-form button[type="submit"]').click();
   assert.equal(await page.locator('#bern-pressure-error').isVisible(),true,'Zero density not rejected @'+width);
   await page.locator('#bernoulli-head-form button[type="submit"]').click();
   result=await page.locator('#bern-head-output').innerText();
   assert.ok(result.includes('18.36735 m')&&result.includes('0.8163265 m')&&result.includes('22.18367 m'),'Head units or values incorrect @'+width+': '+result);
   await page.locator('#head-gravity').fill('-1');
   await page.locator('#bernoulli-head-form button[type="submit"]').click();
   assert.equal(await page.locator('#bern-head-error').isVisible(),true,'Negative gravity not rejected @'+width);
   assert.deepEqual(errors,[],'Unexpected JavaScript error @'+width);
   await page.close();
  }
  console.log('V95-B5 BROWSER PASS: 390/768/1440 screens, original image, eight revision disclosures, horizontal/vertical/mixed pressure and head calculators, input validity.');
 }finally{if(instance)await instance.close();await new Promise(resolve=>server.close(resolve));}
}
if(process.argv.includes('--browser'))browser().catch(err=>{console.error(err);process.exitCode=1;});
