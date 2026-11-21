#!/usr/bin/env node
'use strict';
/* V95-B3: audit student Fluid Flow preview without certifying a complete Unit6 course.
 * Static checks + optional --browser with Chromium to validate mobile and form interaction.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pagePath='portal/unit-06-topic-63-study-v95b3.html';
const html=read(pagePath),js=read('portal/unit-06-topic-63-study-v95b3.js');
const css=read('portal/unit-06-study-v95b1.css'),desk=read('portal/unit-06-learning-desk-v95a.html');
const report=read('quality/grade11-unit06-v95b3-topic63-student-lesson-source-and-signoff.md');
const svgPatterns=read('assets/illustrations/unit6-v95b3-flow-patterns-original.svg');
const svgGraph=read('assets/illustrations/unit6-v95b3-flow-rate-graph-original.svg');
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalogue=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=manifest.grades.find(g=>g.grade===11);
const bank=grade.units.find(u=>u.unit===6);
const unit=catalogue.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(bank.liveMcqCount,560);
assert.equal(bank.standaloneSituationQuestionCount,136);
assert.equal(bank.sourceFigureHeldCount,0);
assert.equal(bank.perQuestionSloVerified,false);
assert.equal(bank.exactFbiseModeReady,false);
assert.equal(grade.units.reduce((sum,u)=>sum+u.liveMcqCount,0),2250);
assert.equal(unit.status,'planned');
assert.equal(unit.assessmentStatus,'not-published');
assert.equal(unit.questionBankCount,0);
assert.equal(unit.partialTestBuilderMcqCount,560);
assert.equal(unit.simulationCount,5);
assert.equal(signoff.releaseApproved,false);
assert.equal(signoff.topics[2].topicTeacherApproved,false);
assert.equal(signoff.topics[2].studentLessonReady,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')),'Complete Unit6 route remains reserved');
assert.equal((desk.match(/class="topic" id="topic-/g)||[]).length,7);
assert.equal((desk.match(/class="stage" role="listitem"/g)||[]).length,28);
assert.equal((desk.match(/<details>/g)||[]).length,7);
for(const n of ['61','62','63'])assert.ok(desk.includes('href="./unit-06-topic-'+n+'-study-v95b'+(Number(n)-60)+'.html"'),'Detailed topic '+n+' lesson missing');
for(const n of ['61','62','63','64','65','66','67'])assert.ok(desk.includes('href="./unit-06-topic-'+n+'-preview.html"'),'MCQ preview missing '+n);
assert.ok(desk.includes('href="../continuity-fluid-flow.html"'),'Existing simulation link removed');
assert.equal((html.match(/class="lesson" id=/g)||[]).length,8);
assert.equal((html.match(/class="problem"/g)||[]).length,7);
assert.equal((html.match(/<details>/g)||[]).length,6);
for(const id of ['meanings','patterns','ideals','applications','rate','worked','try-it','review'])assert.ok(html.includes('id="'+id+'"'),'Missing educational section '+id);
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate IDs can break labels and keyboard navigation');
for(const term of ['P-11-B-35','Summative','Knowledge + Understanding','not a completed or officially approved Unit 6 course','steady','laminar','incompressible','non-viscous','irrotational','m³/s','0.0040 m³/s','0.0018 m³/s','0.002 m³/s','continuity equation','teacher-developed']){
 assert.ok(html.includes(term),'Required source/model concept missing: '+term);
}
assert.ok(html.includes('not a separate prescribed summative calculation in FBISE B35'));
assert.ok(html.includes('not a scanned NBF graph'));
assert.ok(html.includes('not NBF Figure 6.6'));
assert.ok(html.includes('Original educational schematic'));
for(let i=1;i<=9;i++)assert.ok(report.includes('T63-'+String(i).padStart(2,'0')),'Missing teacher issue T63-'+i);
assert.ok(!html.includes('Grade11_Unit6_COMPLETE_MASTER_ALL.pdf'),'Private source filename must not be a student link');
assert.ok(!html.includes('<iframe'),'Private book scans must never be embedded');
assert.ok(svgPatterns.includes('aria-labelledby="title desc"'));
assert.ok(svgGraph.includes('aria-labelledby="title desc"'));
assert.ok(svgGraph.includes('0.004 m³/s'));
assert.match(css,/@media\(max-width:550px\)/);
assert.match(css,/@media print/);
assert.match(css,/prefers-reduced-motion/);
assert.ok(js.includes("event.preventDefault()"));
assert.ok(!/\b(?:fetch|localStorage|sessionStorage|firebase)\b/.test(js));
for(const link of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1])){
 if(link.startsWith('#'))continue;
 const local=link.split('?')[0].split('#')[0];
 if(!local)continue;
 assert.ok(!/^[a-z]+:/i.test(local),'Unreviewed external link '+link);
 assert.ok(fs.existsSync(path.resolve(root,'portal',local)),'Broken local link '+link);
}
const close=(name,actual,want,tol=1e-9)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-want)<=Math.max(1e-12,Math.abs(want)*tol),name+': '+actual+' !== '+want);
close('C1 rate m³/s',.48/120,.004);
close('C1 rate L/s',.48/120*1000,4);
close('C2 rate m³/s',.72/360,.002);
close('C3 transfer time',1.8/.015,120);
close('C4 mL→L',45*240/1000,10.8);
close('C5 rate',.75/300,.0025);
close('C6 volume m³',.008*90,.72);
close('C6 volume L',.008*90*1000,720);
close('C7 weighted mean (.09m³/50s)',(.06+.03)/(20+30),.0018);
close('C7 simple mean wrong',(.06/20+.03/30)/2,.002);
assert.notEqual((.06+.03)/(20+30),(.06/20+.03/30)/2);
close('Graph slope',(.160-.040)/(40-10),.004);
close('180L/min conversion',180/1000/60,.003);
close('0.0025m³/s conversion to L/min',.0025*1000*60,150);
close('0.75 L/s to m³/h',.75/1000*3600,2.7);
close('D30',2.4/8/1000,.0003);
close('D31',(12/2.5)*60,288);
console.log('V95-B3 STATIC PASS: 7-topic desk/3 detailed reads, 8 sections, 7 worked supplementary cases, 6 revision cards, 2 original accessible figures, 9 teacher amendments; Unit6 remains planned.');

async function browser(){
 const {chromium}=require('playwright');
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
 const server=http.createServer((req,res)=>{
  let relative;
  try{relative=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\/+/, '');}catch{res.writeHead(400);res.end();return;}
  const target=path.resolve(root,relative||'index.html');
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(target).pipe(res);
 });
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));let instance;
 try{
  instance=await chromium.launch({headless:true});
  const base='http://127.0.0.1:'+server.address().port;
  for(const width of [390,768,1440]){
   const page=await instance.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/'+pagePath,{waitUntil:'load'});assert.equal(response.status(),200);
   assert.equal(await page.locator('.lesson').count(),8);
   const measured=await page.evaluate(()=>({vw:document.documentElement.clientWidth,sw:document.documentElement.scrollWidth}));
   assert.ok(measured.sw<=measured.vw+2,'Horizontal overflow '+width+': '+JSON.stringify(measured));
   for(const im of await page.locator('.teaching-figure img').all()){
    await im.scrollIntoViewIfNeeded();
    const result=await im.evaluate(async x=>{try{await x.decode();return x.complete&&x.naturalWidth>0;}catch{return false;}});
    assert.equal(result,true,'An original diagram did not load at '+width);
   }
   const detail=page.locator('#review details');assert.equal(await detail.count(),6);
   await detail.first().locator('summary').click();
   assert.equal(await detail.first().evaluate(e=>e.open),true);
   await page.locator('#flow-rate-form button[type="submit"]').click();
   let output=await page.locator('#rate-output').innerText();
   assert.ok(output.includes('3 L/s')&&output.includes('0.003 m³/s'),'Initial calculator incorrect '+width+': '+output);
   await page.locator('#transfer-litres').fill('720');
   await page.locator('#transfer-seconds').fill('360');
   await page.locator('#flow-rate-form button[type="submit"]').click();
   output=await page.locator('#rate-output').innerText();
   assert.ok(output.includes('2 L/s')&&output.includes('0.002 m³/s'),'Changed calculator incorrect '+width+': '+output);
   await page.locator('#two-interval-form button[type="submit"]').click();
   output=await page.locator('#interval-output').innerText();
   assert.ok(output.includes('1.8 L/s')&&output.includes('0.0018 m³/s')&&output.includes('2 L/s')&&output.includes('incorrect'),'Weighted average error '+width+': '+output);
   await page.locator('#first-seconds').fill('30');
   await page.locator('#two-interval-form button[type="submit"]').click();
   output=await page.locator('#interval-output').innerText();
   assert.ok(output.includes('1.5 L/s')&&output.includes('same arithmetic and time-weighted average'),'Equal time note missing '+width+': '+output);
   await page.locator('#first-seconds').fill('0');
   await page.locator('#two-interval-form button[type="submit"]').click();
   assert.equal(await page.locator('#interval-error').isVisible(),true,'Invalid input not rejected');
   assert.deepEqual(errors,[],'Page JS errors at '+width);
   await page.close();
  }
  console.log('V95-B3 BROWSER PASS: 390/768/1440 responsive, 2 original diagrams, six revision answers, flow rate and weighted intervals, invalid data.');
 }finally{if(instance)await instance.close();await new Promise(ok=>server.close(ok));}
}
if(process.argv.includes('--browser'))browser().catch(e=>{console.error(e);process.exitCode=1;});
