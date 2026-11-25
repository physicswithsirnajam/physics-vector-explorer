#!/usr/bin/env node
'use strict';
/**
 * V162 Grade XI NBF Unit7.2 original study lesson.
 * Real Chromium on static local server; no Firebase, credentials, private Word
 * or keyed bank data in the browser. Academic source manually cross-checked
 * with owner NBF book printed pp116-121 and chapter SLO p112.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),
 http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'qa-artifacts/grade11-v162-unit7-topic72-study');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,p))).digest('hex');
const tracked=[
 'question-bank/manifest.json','portal/learning-catalog.json',
 'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json',
 'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const before=Object.fromEntries(tracked.map(p=>[p,hash(p)]));
const MIMES={'.html':'text/html; charset=utf-8',
 '.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  let p=path.resolve(ROOT,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
  if(!p.startsWith(ROOT+path.sep))throw Error('Unsafe static path');
  if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');
  if(!fs.existsSync(p)||!fs.statSync(p).isFile()){
   res.writeHead(404);res.end('not found');return;
  }
  res.writeHead(200,{'Content-Type':MIMES[path.extname(p)]||'application/octet-stream',
   'Cache-Control':'no-store'});
  fs.createReadStream(p).pipe(res);
 }catch{res.writeHead(400);res.end('bad path');}
});
async function listen(){
 await new Promise((resolve,reject)=>{
  server.once('error',reject);
  server.listen(0,'127.0.0.1',resolve);
 });
 return 'http://127.0.0.1:'+server.address().port+'/';
}
function checkSourceIntegrity(){
 const html=read('portal/unit-07-topic72-deformation-v162.html');
 const intro=read('portal/unit-07-learning-intro-v145.html');
 const manifest=JSON.parse(read('question-bank/manifest.json'));
 const catalog=JSON.parse(read('portal/learning-catalog.json'));
 const ledger=JSON.parse(read(tracked[2]));
 const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(u7.learningPreviewStatus,'public-topic-7.1-introduction-only',
  'Unit7 full-course readiness must not change when adding an unscored study page');
 assert.equal(u7.learningPreviewHref,'./unit-07-learning-intro-v145.html');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 assert.equal(ledger.version,'V154');
 assert.equal(ledger.entries.length,80);
 assert.equal(ledger.teacherScienceSignoffs,0);
 assert.equal(ledger.teacherCognitiveSignoffs,0);
 assert.equal(ledger.unit7ScoredReleaseCount,0);
 assert.equal(JSON.parse(read(tracked[4])).releaseApproved,false);
 for(const phrase of [
  '7.2.1 · Printed pp. 117–118','7.2.2 · Printed pp. 118–119',
  '7.2.3 · Printed pp. 120–121',
  'σ = F / A','ε = ΔL / L','Y = (F/A) / (ΔL/L)',
  'B = −Δp / (ΔV/V)','G = (F/A) / (Δx/h)',
  'Proportional limit','Ultimate tensile strength',
  'Fracture','NBF equation 7.1','NBF equations 7.3–7.4',
  'No Unit 7 MCQs, correct-option keys or grades are released or saved here.',
  'no SI unit','linear elastic range','Figure 7.12',
  'P-11-B-23 · Summative / Understanding',
  'P-11-B-24 · Summative / Application',
  'P-11-B-26 · Summative / Understanding',
  'P-11-B-25 · Summative / Understanding',
  'FBISE scope:']){
  assert.ok(html.includes(phrase),'Missing source-relevant teaching element: '+phrase);
 }
 assert.ok(html.includes('physics-with-sir-najam-official-logo.png'));
 assert.ok(intro.includes('./unit-07-topic72-deformation-v162.html'));
 assert.ok(!html.includes('build-your-physics-test.html?unit=7'));
 assert.ok(!html.includes('firebase-config.js'));
 assert.ok(!html.includes('firebase.firestore'));
 assert.ok(!html.includes('correctOptionId'));
 assert.equal((html.match(/<details class="quiz">/g)||[]).length,5);
 assert.equal((html.match(/<svg /g)||[]).length,1);
 const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(ids).size,ids.length,'All HTML ids must be unique');
 assert.equal((html.match(/<script/g)||[]).length,2,
  'Only shared nav script and in-page unscored calculator');
 assert.ok(fs.existsSync(path.join(ROOT,'portal/assets/physics-with-sir-najam-official-logo.png')));
}
async function run(){
 checkSourceIntegrity();
 fs.mkdirSync(OUT,{recursive:true});
 const origin=await listen();
 const result={version:'V162',topic:'NBF Unit7.2 Deformation in Solids',
  basis:'NBF owner source printed pp116-121; local manual source review',
  publicStudyOnly:true,teacherAcademicSignoffPending:true,
  officialFrameworkMappingVerified:true,
  sourceFramework:"FBISE HSSC-I Physics Framework Curriculum 2022–23, Scheme of Studies 2024, PDF p.10",
  summativeSloTags:[
   {code:"P-11-B-23",cognition:"Understanding"},
   {code:"P-11-B-24",cognition:"Application"},
   {code:"P-11-B-26",cognition:"Understanding"}
  ],
  unit7ScoredReleased:0,
  calculatorDefault:{stressMPa:2,strain:0.00001,youngGPa:200},
  viewports:[],quizPrompts:5,
  sourceSections:['7.2.1','7.2.2','7.2.3'],
  exceptions:0};
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const ctx=await browser.newContext({
    viewport:{width,height:850},deviceScaleFactor:1,
    serviceWorkers:'block'
   });
   const page=await ctx.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const p=await page.goto(origin+'portal/unit-07-topic72-deformation-v162.html',
    {waitUntil:'domcontentloaded'});
   assert.equal(p.status(),200);
   assert.match(await page.locator('h1').innerText(),/Deformation in Solids/);
   assert.equal(await page.locator('figure svg').count(),1);
   assert.equal(await page.locator('figure svg title').count(),1);
   assert.equal(await page.locator('figure svg desc').count(),1);
   assert.equal(await page.locator('.formula').count(),5);
   assert.equal(await page.locator('details.quiz').count(),5);
   assert.equal(await page.locator('details.quiz[open]').count(),0,
    'Study answers should be hidden until requested');
   const check=page.locator('details.quiz').first();
   await check.locator('summary').click();
   assert.equal(await check.getAttribute('open'),'');
   assert.ok((await check.innerText()).includes('units cancel'));
   await check.locator('summary').click();
   assert.equal(await check.getAttribute('open'),null);
   const actual=await page.evaluate(()=>({
    width:document.documentElement.clientWidth,
    scroll:document.documentElement.scrollWidth
   }));
   assert.ok(actual.scroll<=actual.width+1,
    'Unexpected horizontal overflow at '+width+'px: '+JSON.stringify(actual));
   assert.equal(await page.locator('#calc-results').isHidden(),true);
   const calc=page.getByRole('button',{name:'Calculate stress, strain and Y'});
   await calc.click();
   assert.equal(await page.locator('#calc-results').isVisible(),true);
   assert.equal(await page.locator('#result-stress').innerText(),'2.000 MPa');
   assert.equal(await page.locator('#result-strain').innerText(),'1.000e-5');
   assert.equal(await page.locator('#result-young').innerText(),'200.000 GPa');
   assert.ok((await page.locator('#calc-status').innerText()).includes('No result is stored'));
   await page.locator('#extension').fill('1500');
   await calc.click();
   assert.equal(await page.locator('#calc-results').isHidden(),true,
    '100% extension must not be presented as a linear-elastic modulus');
   assert.ok((await page.locator('#calc-status').innerText()).includes(
    'outside the useful range'));
   await page.locator('#extension').fill('0.03');
   await calc.click();
   assert.equal(await page.locator('#result-strain').innerText(),'2.000e-5');
   assert.equal(await page.locator('#result-young').innerText(),'100.000 GPa');
   const home=page.getByRole('link',{name:'Back to the classification lesson'});
   assert.ok((await home.getAttribute('href')).includes('unit-07-learning-intro-v145.html'));
   const name='topic72-deformation-'+width+'px.png';
   await page.screenshot({path:path.join(OUT,name),fullPage:false});
   result.viewports.push({width,layoutNoOverflow:true,calculatorVerified:true,
    accessibleGraphDescription:true,unscoredSelfCheck:true,screenshot:name});
   assert.deepEqual(errors,[],'Browser errors at '+width);
   await ctx.close();
  }
  const start=await browser.newPage({viewport:{width:390,height:820}});
  const intro=await start.goto(origin+'portal/unit-07-learning-intro-v145.html',
   {waitUntil:'domcontentloaded'});
  assert.equal(intro.status(),200);
  const link=start.getByRole('link',{name:'Open 7.2 Deformation Study Lesson'});
  assert.equal(await link.count(),1);
  await link.click();
  await start.waitForURL(/unit-07-topic72-deformation-v162\.html$/);
  assert.match(await start.locator('h1').innerText(),/Deformation in Solids/);
  await start.close();
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 assert.deepEqual(Object.fromEntries(tracked.map(p=>[p,hash(p)])),before);
 fs.writeFileSync(path.join(OUT,'summary.json'),JSON.stringify(result,null,2)+'\n');
 console.log('V162 PASS: NBF Unit7.2 pp116-121 original student lesson, SI-safe stress/strain/calculator, 3 responsive Chromium viewports, 0 Unit7 scored MCQs');
}
run().catch(err=>{console.error('V162 FAILED:',err.stack||err);process.exitCode=1;});
