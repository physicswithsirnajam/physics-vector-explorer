#!/usr/bin/env node
'use strict';
/*
 * V95-B2 — Reproducible student preview content + model-validity checks.
 * Run --browser after installing Playwright Chromium for 390/768/1440 responsive checks.
 * Not a full original NBF transcription audit or official item-level FBISE certificate.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pagePath='portal/unit-06-topic-62-study-v95b2.html';
const html=read(pagePath),js=read('portal/unit-06-topic-62-study-v95b2.js');
const css=read('portal/unit-06-study-v95b1.css'),desk=read('portal/unit-06-learning-desk-v95a.html');
const report=read('quality/grade11-unit06-v95b2-topic62-student-lesson-source-and-signoff.md');
const svg=read('assets/illustrations/unit6-v95b2-terminal-force-original.svg');
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalogue=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=manifest.grades.find(g=>g.grade===11),bank=grade.units.find(u=>u.unit===6);
const unit=catalogue.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(bank.liveMcqCount,560);
assert.equal(bank.standaloneSituationQuestionCount,136);
assert.equal(bank.sourceFigureHeldCount,0);
assert.equal(bank.perQuestionSloVerified,false);
assert.equal(bank.exactFbiseModeReady,false);
assert.equal(grade.units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.equal(unit.status,'planned');
assert.equal(unit.assessmentStatus,'not-published');
assert.equal(unit.questionBankCount,0);
assert.equal(unit.simulationCount,5);
assert.equal(unit.partialTestBuilderMcqCount,560);
assert.equal(signoff.releaseApproved,false);
assert.equal(signoff.topics[1].topicTeacherApproved,false);
assert.equal(signoff.topics[1].studentLessonReady,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')),'Complete Unit6 route reserved until V95 final signoff');
assert.equal((desk.match(/class="topic" id="topic-/g)||[]).length,7);
assert.equal((desk.match(/class="stage" role="listitem"/g)||[]).length,28);
assert.equal((desk.match(/<details>/g)||[]).length,7);
assert.ok(desk.includes('href="./unit-06-topic-61-study-v95b1.html"'));
assert.ok(desk.includes('href="./unit-06-topic-62-study-v95b2.html"'));
assert.ok(desk.includes('href="./unit-06-topic-62-preview.html"'));
assert.ok(desk.includes('href="../viscosity-terminal-velocity.html"'));
for(const n of ['61','62','63','64','65','66','67'])assert.ok(desk.includes('href="./unit-06-topic-'+n+'-preview.html"'));
assert.equal((html.match(/class="lesson" id=/g)||[]).length,8);
assert.equal((html.match(/class="problem"/g)||[]).length,5);
assert.equal((html.match(/<details>/g)||[]).length,6);
for(const id of ['viscosity','stokes','terminal','buoyancy','parachute','worked','try-it','review'])assert.ok(html.includes('id="'+id+'"'),'Missing educational section '+id);
for(const term of ['P-11-B-41','P-11-B-42','Summative','Understanding','not a completed or officially approved Unit 6 course','1.43 × 10⁻⁶ N','10.9 m/s','0.015915','1.09 × 10⁻⁵','−8.4 m/s²','505','436','6π','buoyancy neglected']){
 assert.ok(html.includes(term),'Required source/model concept absent '+term);
}
for(let i=1;i<=9;i++)assert.ok(report.includes('T62-'+String(i).padStart(2,'0')),'Missing teacher register T62-'+i);
assert.ok(report.includes('Original NBF printed')||report.includes('Exact NBF printed'));
assert.ok(html.includes('original printed wording has'));
assert.ok(html.includes('not a validated real-world')||html.includes('not a reliable physical prediction'));
assert.ok(svg.includes('aria-labelledby="title desc"')&&svg.includes('Weight W')||svg.includes('weight W')||svg.includes('weight'));
assert.ok(svg.includes('terminal')&&svg.includes('not to scale'));
assert.ok(html.includes('unit6-v95b2-terminal-force-original.svg'));
assert.ok(!html.includes('Grade11_Unit6_COMPLETE_MASTER_ALL.pdf'));
assert.ok(!html.includes('<iframe'));
assert.match(css,/@media\(max-width:550px\)/);
assert.match(css,/@media print/);
assert.match(css,/prefers-reduced-motion/);
assert.ok(js.includes('event.preventDefault()'));
assert.ok(!/\b(?:fetch|localStorage|sessionStorage|firebase)\b/.test(js),'Public calculator must not access network or account storage');
for(const ref of [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(x=>x[1])){
 if(ref.startsWith('#'))continue;
 const filepath=ref.split('?')[0].split('#')[0];
 if(!filepath)continue;
 assert.ok(!/^[a-z]+:/i.test(filepath),'Unexpected external link '+filepath);
 assert.ok(fs.existsSync(path.resolve(root,'portal',filepath)),'Broken link '+ref);
}
// Recalculate independently from given dimensions; test both mathematical and physical model validity.
function near(id,actual,want,tol=1e-8){assert.ok(Number.isFinite(actual));assert.ok(Math.abs(actual-want)<=Math.max(1e-12,Math.abs(want)*tol),id+': got '+actual+' expected '+want);}
const g=9.8,stokes=(eta,r,v)=>6*Math.PI*eta*r*v;
near('Formal NBF Example6.2 pi3.14',6*3.14*1.9e-5*.002*2,1.43184e-6);
near('Example6.2 air Reynolds supplement',1.2*2*(2*.002)/1.9e-5,505.2631578947368);
const drop=.0003,raindropV=2*1000*g*drop*drop/(9*1.8e-5);
near('Formal NBF Assignment6.2 v',raindropV,10.888888888888888);
near('Raindrop air Reynolds supplement',1.2*raindropV*2*drop/1.8e-5,435.55555555555554);
assert.ok(1.2*2*(2*.002)/1.9e-5>1);
assert.ok(1.2*raindropV*2*drop/1.8e-5>1);
near('Supplementary viscosity inversion',3e-6/(6*Math.PI*.0005*.02),.015915494309189534);
near('Supplementary buoyancy-inclusive settling',2*(1200-1000)*g*(50e-6)**2/(9*.1),1.088888888888889e-5);
near('Parachutist average downward acceleration',(8-50)/5,-8.4);
near('Parachutist speed ratio',50/8,6.25);
near('Stokes checker default drag',stokes(.1,.00005,.001),9.42477796076938e-8);
near('Stokes checker default Reynolds',2*1000*.001*.00005/.1,.001);
console.log('V95-B2 STATIC PASS: 8 source-grounded sections, 5 worked examples, 6 revision disclosures, 9 amendment decisions, 2 live lesson paths, and no course-release/bank changes.');

// Headless Chromium validates student-facing calculator and responsive graphics.
async function browser(){
 const {chromium}=require('playwright');
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
 const server=http.createServer((req,res)=>{
  let f;try{f=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\/+/, '');}catch{res.writeHead(400);res.end();return;}
  const target=path.resolve(root,f||'index.html');
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(target).pipe(res);
 });
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));let browserInstance;
 try{
  browserInstance=await chromium.launch({headless:true});
  const base='http://127.0.0.1:'+server.address().port;
  for(const width of [390,768,1440]){
   const tab=await browserInstance.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
   const errors=[];tab.on('pageerror',err=>errors.push(err.message));
   const resp=await tab.goto(base+'/'+pagePath,{waitUntil:'load'});assert.equal(resp.status(),200);
   assert.equal(await tab.locator('.lesson').count(),8);
   const dims=await tab.evaluate(()=>({clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth}));
   assert.ok(dims.scrollWidth<=dims.clientWidth+2,'Overflow at '+width+': '+JSON.stringify(dims));
   const img=tab.locator('.teaching-figure img');await img.scrollIntoViewIfNeeded();
   const imageResult=await img.evaluate(async i=>{try{await i.decode();}catch(e){return {loaded:false,reason:String(e),src:i.currentSrc};}return {loaded:i.complete&&i.naturalWidth>0,naturalWidth:i.naturalWidth,src:i.currentSrc};});
   assert.equal(imageResult.loaded,true,'Original SVG must load at '+width+': '+JSON.stringify(imageResult));
   const details=tab.locator('#review details');assert.equal(await details.count(),6);
   await details.first().locator('summary').click();
   assert.equal(await details.first().evaluate(d=>d.open),true);
   await tab.locator('#preset-slow').click();
   let output=await tab.locator('#calc-output').innerText();
   assert.ok(output.includes('9.4248e-8')&&output.includes('0.001')&&output.includes('well below 1'),'Slow-model output mismatch at '+width+': '+output);
   await tab.locator('#preset-textbook').click();
   output=await tab.locator('#calc-output').innerText();
   assert.ok(output.includes('1.4326e-6')&&output.includes('505.263')&&output.includes('NOT a trustworthy real drag prediction'),'High-Re warning missing at '+width+': '+output);
   await tab.locator('#fluid-viscosity').fill('-1');
   await tab.locator('#stokes-form button[type="submit"]').click();
   assert.equal(await tab.locator('#calc-error').isVisible(),true,'Invalid viscosity not rejected');
   assert.deepEqual(errors,[],'Page JS errors at '+width);
   await tab.close();
  }
  console.log('V95-B2 BROWSER PASS: responsive 390/768/1440, diagram and six revisions, valid and invalid input paths, high-Re warnings.');
 }finally{if(browserInstance)await browserInstance.close();await new Promise(ok=>server.close(ok));}
}
if(process.argv.includes('--browser'))browser().catch(e=>{console.error(e);process.exitCode=1;});
