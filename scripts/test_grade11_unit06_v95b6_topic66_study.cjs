#!/usr/bin/env node
'use strict';
/* V95-B6 verifies source boundaries, teacher problem arithmetic, privacy,
 * responsible high-speed wing warning, and optional mobile browser models.
 * It does NOT certify the original printed NBF pages or individual board MCQs.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pagePath='portal/unit-06-topic-66-study-v95b6.html';
const html=read(pagePath),js=read('portal/unit-06-topic-66-study-v95b6.js');
const css=read('portal/unit-06-study-v95b1.css'),desk=read('portal/unit-06-learning-desk-v95a.html');
const report=read('quality/grade11-unit06-v95b6-topic66-student-lesson-source-and-signoff.md');
const svg=read('assets/illustrations/unit6-v95b6-torricelli-venturi-original.svg');
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=manifest.grades.find(g=>g.grade===11);
const bank=grade.units.find(u=>u.unit===6);
const unit=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(bank.liveMcqCount,560);
assert.equal(bank.standaloneSituationQuestionCount,136);
assert.equal(bank.independentSharedStimulusGroupCount,0);
assert.equal(bank.sourceFigureHeldCount,0);
assert.equal(bank.perQuestionSloVerified,false);
assert.equal(bank.exactFbiseModeReady,false);
assert.equal(grade.units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.equal(unit.status,'planned');
assert.equal(unit.assessmentStatus,'not-published');
assert.equal(unit.questionBankCount,0);
assert.equal(unit.partialTestBuilderMcqCount,560);
assert.equal(unit.simulationCount,5);
assert.equal(signoff.releaseApproved,false);
assert.equal(signoff.topics[5].topicTeacherApproved,false);
assert.equal(signoff.topics[5].studentLessonReady,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')),'Full course route remains reserved');
assert.equal((desk.match(/class="topic" id="topic-/g)||[]).length,7);
assert.equal((desk.match(/class="stage" role="listitem"/g)||[]).length,28);
assert.equal((desk.match(/<details>/g)||[]).length,7);
for(const n of ['61','62','63','64','65','66']){
 const expected='href="./unit-06-topic-'+n+'-study-v95b'+(Number(n)-60)+'.html"';
 assert.ok(desk.includes(expected),'Detailed lesson missing '+n);
}
for(const n of ['61','62','63','64','65','66','67']){
 assert.ok(desk.includes('href="./unit-06-topic-'+n+'-preview.html"'),'Original MCQ preview missing '+n);
}
assert.ok(desk.includes('href="../bernoulli-venturi.html"'));
assert.equal((html.match(/class="lesson" id=/g)||[]).length,8);
assert.equal((html.match(/class="problem"/g)||[]).length,8);
assert.equal((html.match(/<details>/g)||[]).length,10);
for(const section of ['principle','applications','torricelli','venturi','aerofoil','worked','try-it','review']){
 assert.ok(html.includes('id="'+section+'"'),'Missing section '+section);
}
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate IDs harm accessible form labels');
for(const term of [
'P-11-B-39','P-11-B-40','P-11-B-44','Summative','Formative',
'not a completed or teacher-approved Unit 6 course','v = √(2gH)',
'v₁ = √{2gH/[(A₁/A₂)² − 1]}','ΔP = ρgH','same-liquid',
'air-jet','mechanical','partial vacuum','Magnus','equal-transit-time',
'9.90 m/s','2.50 m','6.0 kPa','1.40 m/s','2.80 m/s',
'80.0 kPa','450 m/s','410 m/s','998,460 N','22,188 Pa',
'33,600 N','1176 Pa','1.18 kPa','not a copy of original NBF Figures 6.10–6.15'
]){
 assert.ok(html.toLowerCase().includes(term.toLowerCase()),'Missing educational/source/physical-boundary content '+term);
}
for(let n=1;n<=10;n++)assert.ok(report.includes('T66-'+String(n).padStart(2,'0')),'Missing academic amendment T66-'+n);
assert.ok(report.includes('pp.101–106'));
assert.ok(html.includes('never interpret this as a credible measured flight-lift force'));
assert.ok(!html.includes('Grade11_Unit6_COMPLETE_MASTER_ALL.pdf'),'Do not disclose private source on student page');
assert.ok(!html.includes('<iframe'),'Do not embed NBF scans');
assert.ok(svg.includes('role="img"')&&svg.includes('aria-labelledby="t d"'));
assert.ok(svg.includes('A1 larger than A2')&&svg.includes('not NBF textbook figures'),'Original SVG must state wide/throat geometry and source-art distinction');
assert.match(css,/@media\(max-width:550px\)/);
assert.match(css,/@media print/);
assert.ok(js.includes('e.preventDefault()'));
assert.ok(js.includes('HIGH-SPEED MODEL WARNING'));
assert.ok(!/\b(?:fetch|localStorage|sessionStorage|firebase)\b/.test(js),'No network or stored personal results');
for(const resource of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1])){
 if(resource.startsWith('#'))continue;
 const local=resource.split('?')[0].split('#')[0];
 if(!local)continue;
 assert.ok(!/^[a-z]+:/i.test(local),'Unexpected external route '+resource);
 assert.ok(fs.existsSync(path.resolve(root,'portal',local)),'Broken resource '+resource);
}
const near=(name,actual,expected,tol=1e-8)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=Math.max(1e-12,Math.abs(expected)*tol),name+': '+actual+' != '+expected);
const g=9.8,rho=1000;
near('Torricelli at 5m',Math.sqrt(2*g*5),Math.sqrt(98));
near('Torricelli height for speed7',7**2/(2*g),2.5);
near('Torricelli at 1.8m',Math.sqrt(2*g*1.8),5.939696961967);
near('Torricelli 0.8cm² outlet 1.25m discharge',(.8e-4)*Math.sqrt(2*g*1.25),.0003959797974644666);
const venturi=(a1,a2,v1,density)=>{const v2=(a1/a2)*v1;return {v2,pressure:.5*density*(v2*v2-v1*v1)};};
near('Venturi 12/6 speed',venturi(12,6,2,1000).v2,4);
near('Venturi 12/6 drop',venturi(12,6,2,1000).pressure,6000);
near('Venturi same-liquid head inlet',Math.sqrt(2*g*.3/(2**2-1)),1.4);
near('Venturi same-liquid head throat',2*Math.sqrt(2*g*.3/(2**2-1)),2.8);
near('Venturi diameter ratio speed',venturi(16,4,1.5,1000).v2,6);
near('Venturi diameter ratio pressure drop',venturi(16,4,1.5,1000).pressure,16875);
near('Prepared Example6.4 vertical P2',47100+.5*rho*(4**2-3**2)+rho*g*3,80000);
const lift=(vupper,vlower,density,area)=>{const dP=.5*density*(vupper**2-vlower**2);return {dP,force:dP*area};};
near('Prepared high-speed wing formal deltaP',lift(450,410,1.29,45).dP,22188);
near('Prepared high-speed wing formal F',lift(450,410,1.29,45).force,998460);
near('Moderate wing supplemental deltaP',lift(80,60,1.2,20).dP,1680);
near('Moderate wing supplemental force',lift(80,60,1.2,20).force,33600);
near('Atomizer ideal static lifting head',800*g*.15,1176);
console.log('V95-B6 STATIC PASS: 6 detailed lessons, 7 MCQ routes, 8 sections, 8 worked examples, 10 revision disclosures, original art, independent model answers and 10 QC items; release remains planned.');

async function browser(){
 const {chromium}=require('playwright');
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
 const server=http.createServer((req,res)=>{
  let rel;try{rel=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\/+/, '');}catch{res.writeHead(400);res.end();return;}
  const target=path.resolve(root,rel||'index.html');
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(target).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browserInstance;
 try{
  browserInstance=await chromium.launch({headless:true});
  const base='http://127.0.0.1:'+server.address().port;
  for(const width of [390,768,1440]){
   const page=await browserInstance.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/'+pagePath,{waitUntil:'load'});
   assert.equal(response.status(),200);
   assert.equal(await page.locator('.lesson').count(),8);
   const dims=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(dims.scroll<=dims.width+2,'Overflow @ '+width+': '+JSON.stringify(dims));
   const image=page.locator('.teaching-figure img');await image.scrollIntoViewIfNeeded();
   assert.equal(await image.evaluate(async img=>{try{await img.decode();return img.complete&&img.naturalWidth>0;}catch{return false;}}),true,'Original SVG failed @ '+width);
   const answers=page.locator('#review details');
   assert.equal(await answers.count(),10);await answers.first().locator('summary').click();
   assert.equal(await answers.first().evaluate(x=>x.open),true);
   await page.locator('#torricelli-form button[type="submit"]').click();
   let result=await page.locator('#torricelli-output').innerText();
   assert.ok(result.includes('9.899495 m/s')&&result.includes('0.7919596 L/s'),'Torricelli default @'+width+': '+result);
   await page.locator('#tank-head').fill('1.25');
   await page.locator('#torricelli-form button[type="submit"]').click();
   result=await page.locator('#torricelli-output').innerText();
   assert.ok(result.includes('4.949747 m/s')&&result.includes('0.3959798 L/s'),'Torricelli changed @'+width+': '+result);
   await page.locator('#venturi-form button[type="submit"]').click();
   result=await page.locator('#venturi-output').innerText();
   assert.ok(result.includes('4 m/s')&&result.includes('6 kPa'),'Venturi default @'+width+': '+result);
   await page.locator('#preset-venturi-diameters').click();
   result=await page.locator('#venturi-output').innerText();
   assert.ok(result.includes('6 m/s')&&result.includes('16.875 kPa'),'Venturi 16/4 areas @'+width+': '+result);
   await page.locator('#venturi-area-out').fill('16');
   await page.locator('#venturi-form button[type="submit"]').click();
   assert.equal(await page.locator('#venturi-error').isVisible(),true,'Venturi no-narrowing input not rejected @'+width);
   await page.locator('#wing-form button[type="submit"]').click();
   result=await page.locator('#wing-output').innerText();
   assert.ok(result.includes('1,680 Pa')&&result.includes('33,600 N')&&result.includes('NOT measured'),'Moderate toy wing @'+width+': '+result);
   await page.locator('#preset-wing-textbook').click();
   result=await page.locator('#wing-output').innerText();
   assert.ok(result.includes('22,188 Pa')&&result.includes('998,460 N')&&result.includes('HIGH-SPEED MODEL WARNING'),'High-speed warning compulsory @'+width+': '+result);
   await page.locator('#wing-air-density').fill('0');
   await page.locator('#wing-form button[type="submit"]').click();
   assert.equal(await page.locator('#wing-error').isVisible(),true,'Invalid air density not rejected @'+width);
   assert.deepEqual(errors,[],'JS browser errors @'+width);
   await page.close();
  }
  console.log('V95-B6 BROWSER PASS: 390/768/1440, original SVG, 10 revision items, Torricelli/Venturi/wing presets and high-speed physical warning.');
 }finally{if(browserInstance)await browserInstance.close();await new Promise(resolve=>server.close(resolve));}
}
if(process.argv.includes('--browser'))browser().catch(err=>{console.error(err);process.exitCode=1;});
