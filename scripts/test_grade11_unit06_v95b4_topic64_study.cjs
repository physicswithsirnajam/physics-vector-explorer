#!/usr/bin/env node
'use strict';
/* V95-B4 — Topic 6.4 continuity student lesson static and browser checks.
 * Audits arithmetic, source provenance, course-state safety and real UI.
 * Does NOT certify original printed NBF text nor individual MCQ SLOs.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pagePath='portal/unit-06-topic-64-study-v95b4.html';
const html=read(pagePath),js=read('portal/unit-06-topic-64-study-v95b4.js');
const css=read('portal/unit-06-study-v95b1.css'),desk=read('portal/unit-06-learning-desk-v95a.html');
const report=read('quality/grade11-unit06-v95b4-topic64-student-lesson-source-and-signoff.md');
const svgPipe=read('assets/illustrations/unit6-v95b4-continuity-pipe-original.svg');
const svgBranch=read('assets/illustrations/unit6-v95b4-branching-original.svg');
const bank=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const g=bank.grades.find(x=>x.grade===11);
const u=g.units.find(x=>x.unit===6);
const cu=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===6);
assert.equal(u.liveMcqCount,560);
assert.equal(u.sourceFigureHeldCount,0);
assert.equal(u.standaloneSituationQuestionCount,136);
assert.equal(u.independentSharedStimulusGroupCount,0);
assert.equal(u.perQuestionSloVerified,false);
assert.equal(u.exactFbiseModeReady,false);
assert.equal(g.units.reduce((total,x)=>total+x.liveMcqCount,0),2250);
assert.equal(cu.status,'planned');
assert.equal(cu.assessmentStatus,'not-published');
assert.equal(cu.questionBankCount,0);
assert.equal(cu.partialTestBuilderMcqCount,560);
assert.equal(cu.simulationCount,5);
assert.equal(signoff.releaseApproved,false);
assert.equal(signoff.topics[3].topicTeacherApproved,false);
assert.equal(signoff.topics[3].studentLessonReady,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')),'Full course route is reserved for signed-off Unit 6');
assert.equal((desk.match(/class="topic" id="topic-/g)||[]).length,7);
assert.equal((desk.match(/class="stage" role="listitem"/g)||[]).length,28);
assert.equal((desk.match(/<details>/g)||[]).length,7);
for(const n of ['61','62','63','64']){
 assert.ok(desk.includes('href="./unit-06-topic-'+n+'-study-v95b'+(Number(n)-60)+'.html"'),'Missing detailed topic '+n+' lesson link');
}
for(const n of ['61','62','63','64','65','66','67']){
 assert.ok(desk.includes('href="./unit-06-topic-'+n+'-preview.html"'),'Missing original MCQ practice '+n);
}
assert.ok(desk.includes('href="../continuity-fluid-flow.html"'));
assert.equal((html.match(/class="lesson" id=/g)||[]).length,8,'Expected 8 substantive lesson sections');
assert.equal((html.match(/class="problem"/g)||[]).length,8,'One prepared NBF-labelled + seven supplementary worked problems');
assert.equal((html.match(/<details>/g)||[]).length,6,'Six accessible revision disclosures expected');
for(const section of ['meaning','derivation','incompressible','branches','applications','worked','try-it','review']){
 assert.ok(html.includes('id="'+section+'"'),'Missing educational section '+section);
}
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'HTML section/form IDs must remain unique');
for(const term of [
'P-11-B-36','P-11-B-37','P-11-B-38','Summative','Understanding','Application',
'not a completed or officially approved Unit 6 course','ρ₁A₁v₁ = ρ₂A₂v₂',
'A₁v₁ = A₂v₂ = Q','Conserved mass','0.044 m/s','30','4.5 m/s','4.8 m/s',
'0.955 m/s','1.33 m/s','0.025 m³/s','0.288 kg/s','5.33 m/s','2.0 m/s',
'between two different','one steady','1 cm² = 10⁻⁴ m²'
]){
 assert.ok(html.includes(term),'Required source/model or numeric topic missing: '+term);
}
for(let i=1;i<=9;i++)assert.ok(report.includes('T64-'+String(i).padStart(2,'0')),'Teacher issue absent T64-'+i);
assert.ok(html.includes('not</strong> a reproduction of original NBF Figure 6.7'),'The source-art disclaimer must survive HTML formatting');
assert.ok(html.includes('not a measurement or copy of printed NBF Figure 6.7/6.8'));
assert.ok(!html.includes('Grade11_Unit6_COMPLETE_MASTER_ALL.pdf'),'Private teacher PDF should not be linked on student page');
assert.ok(!html.includes('<iframe'),'Do not embed private textbook pages');
assert.ok(svgPipe.includes('role="img"')&&svgPipe.includes('aria-labelledby="t d"'));
assert.ok(svgBranch.includes('role="img"')&&svgBranch.includes('aria-labelledby="t d"'));
assert.match(css,/@media\(max-width:550px\)/);
assert.match(css,/@media print/);
assert.match(css,/prefers-reduced-motion/);
assert.ok(js.includes('e.preventDefault()'));
assert.ok(!/\b(?:fetch|localStorage|sessionStorage|firebase)\b/.test(js),'Calculator must not request network/account data');
for(const ref of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(x=>x[1])){
 if(ref.startsWith('#'))continue;
 const target=ref.split('#')[0].split('?')[0];if(!target)continue;
 assert.ok(!/^[a-z]+:/i.test(target),'External resource not part of approved syllabus: '+ref);
 assert.ok(fs.existsSync(path.resolve(root,'portal',target)),'Broken local resource '+ref);
}
// Recalculate from explicit prepared givens, including branch and density boundaries.
const near=(name,v,w,rel=1e-9)=>assert.ok(Number.isFinite(v)&&Math.abs(v-w)<=Math.max(1e-12,Math.abs(w)*rel),name+': '+v+' != '+w);
const sq=x=>x*x;
near('Source prepared NBF Example6.3, 30 branches',sq(.8/.4)*.33/30,.044);
near('Combined 30-area / aorta',30*sq(.4/.8),7.5);
near('Supplemental area constriction outlet',(.012/.004)*1.5,4.5);
near('Supplemental constriction Q',.012*1.5,.018);
near('Supplemental radius-squared speed',sq(6/3)*1.2,4.8);
near('Supplemental collection Q',.012/40,.0003);
near('Supplemental collection v',(.012/40)/(Math.PI*sq(.01)),.954929658551372);
near('Supplemental 3-equal branches',sq(1.2/.6)*1/3,4/3);
near('Supplemental unequal Q2',.040-.015,.025);
near('Supplemental unequal second speed',(.040-.015)/.005,5);
near('Supplemental variable-density mass',1.2*.08*3,.288);
near('Supplemental variable-density speed',(1.2*.08*3)/(.9*.06),5.333333333333333);
near('Supplemental variable-density Q1',.08*3,.24);
near('Supplemental variable-density Q2',.06*((1.2*.08*3)/(.9*.06)),.32);
near('Supplemental conditional river',(20*2.5)/(20*1)*.8,2);
near('D Q26 five branches',sq(1/.5)*.4/5,.32);
near('D Q27 density general',1.2*.02*3/(.9*.01),8);
near('D Q28 river',8*3*.4/(8*1.5),.8);
near('D Q30 25cm² and .8m/s',25e-4*.8,.002);
near('D Q31 unequal branches',(12*2-4*3)/6,2);
console.log('V95-B4 STATIC PASS: 8 lesson sections, 8 worked problems, 6 reviews, 2 original accessible diagrams, T64-01…09, 4 linked detailed topic lessons and immutable 560/2250 course status.');

async function browser(){
 const {chromium}=require('playwright');
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
 const server=http.createServer((req,res)=>{
  let url;try{url=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\/+/, '');}
  catch{res.writeHead(400);res.end();return;}
  const target=path.resolve(root,url||'index.html');
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
  const address='http://127.0.0.1:'+server.address().port;
  for(const width of [390,768,1440]){
   const page=await instance.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(address+'/'+pagePath,{waitUntil:'load'});
   assert.equal(response.status(),200,'Study page should load');
   assert.equal(await page.locator('.lesson').count(),8);
   const dims=await page.evaluate(()=>({vw:document.documentElement.clientWidth,full:document.documentElement.scrollWidth}));
   assert.ok(dims.full<=dims.vw+2,'Horizontal overflow at '+width+': '+JSON.stringify(dims));
   for(const img of await page.locator('.teaching-figure img').all()){
    await img.scrollIntoViewIfNeeded();
    const result=await img.evaluate(async x=>{try{await x.decode();return x.complete&&x.naturalWidth>0;}catch{return false;}});
    assert.equal(result,true,'Original SVG failed to load at '+width);
   }
   const checks=page.locator('#review details');assert.equal(await checks.count(),6);
   await checks.first().locator('summary').click();
   assert.equal(await checks.first().evaluate(x=>x.open),true);
   await page.locator('#mass-continuity-form button[type="submit"]').click();
   let result=await page.locator('#continuity-output').innerText();
   assert.ok(result.includes('4.5 m/s')&&result.includes('18 kg/s')&&result.includes('0.018 m³/s'),'Water preset calculation wrong at '+width+': '+result);
   await page.locator('#preset-gas').click();
   result=await page.locator('#continuity-output').innerText();
   assert.ok(result.includes('5.333333 m/s')&&result.includes('0.288 kg/s')&&result.includes('0.24 m³/s')&&result.includes('0.32 m³/s'),'Variable gas calculation wrong at '+width+': '+result);
   await page.locator('#rho-out').fill('0');
   await page.locator('#mass-continuity-form button[type="submit"]').click();
   assert.equal(await page.locator('#continuity-error').isVisible(),true,'Invalid density not rejected '+width);
   await page.locator('#branch-continuity-form button[type="submit"]').click();
   result=await page.locator('#branch-output').innerText();
   assert.ok(result.includes('0.044 m/s')&&result.includes('30 equal outlets'),'30-branch speed wrong at '+width+': '+result);
   await page.locator('#preset-three').click();
   result=await page.locator('#branch-output').innerText();
   assert.ok(result.includes('1.333333 m/s')&&result.includes('3 equal outlets'),'Three-branch speed wrong at '+width+': '+result);
   await page.locator('#branch-count').fill('2.5');
   await page.locator('#branch-continuity-form button[type="submit"]').click();
   assert.equal(await page.locator('#branch-error').isVisible(),true,'Fractional branch count not rejected '+width);
   assert.deepEqual(errors,[],'No JavaScript errors at '+width);
   await page.close();
  }
  console.log('V95-B4 BROWSER PASS: 390/768/1440px, diagrams, six disclosures, water/gas and 30/3-branch presets, invalid input.');
 }finally{if(instance)await instance.close();await new Promise(resolve=>server.close(resolve));}
}
if(process.argv.includes('--browser'))browser().catch(e=>{console.error(e);process.exitCode=1;});
