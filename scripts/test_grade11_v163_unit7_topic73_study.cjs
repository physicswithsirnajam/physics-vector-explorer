#!/usr/bin/env node
'use strict';
/**
 * V163 real Chromium physics/QC for source-audited NBF Grade XI Unit7.3.
 * No Firebase, user login, original private answers or grade storage.
 * Owner NBF textbook printed pp122-124 and verified official FBISE
 * Grade XI SLOs P-11-B-25/27/28 were inspected before publication.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'qa-artifacts/grade11-v163-unit7-topic73-study');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const digest=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,p))).digest('hex');
const originalPaths=[
 'question-bank/manifest.json','portal/learning-catalog.json',
 'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json',
 'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv',
 'quality/grade11-unit06-v94d-signoff-matrix.json',
 'quality/unit07/topic71-v160-production-readiness-no-go.json',
 'quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json',
 'portal/unit-07-learning-intro-v145.html',
 'portal/unit-07-topic72-deformation-v162.html'
];
const hashes=Object.fromEntries(originalPaths.map(p=>[p,digest(p)]));
const MIMES={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml',
 '.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  let f=path.resolve(ROOT,'.'+decodeURIComponent(url.pathname));
  if(!f.startsWith(ROOT+path.sep))throw Error('unsafe-path');
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.existsSync(f)||!fs.statSync(f).isFile()){
   res.writeHead(404);res.end('missing');return;
  }
  res.writeHead(200,{'Content-Type':MIMES[path.extname(f)]||'application/octet-stream',
   'Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch{res.writeHead(400);res.end('bad path');}
});
async function listen(){
 await new Promise((resolve,reject)=>{
  server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
 });
 return 'http://127.0.0.1:'+server.address().port+'/';
}
function staticScienceAudit(){
 const html=read('portal/unit-07-topic73-elastic-energy-v163.html');
 const a=read('portal/unit-07-learning-intro-v145.html');
 const b=read('portal/unit-07-topic72-deformation-v162.html');
 assert.equal(a.includes('Open 7.3 Elastic Energy Study Lesson'),true);
 assert.equal(b.includes('Open 7.3 Elastic Energy Study Lesson'),true);
 for(const phrase of [
  '7.3.1 · NBF printed p. 122',
  '7.3.2 · NBF printed pp. 122–123',
  '7.3.3 · NBF printed pp. 123–124',
  'P-11-B-25 — Summative / Understanding',
  'P-11-B-27 — Summative / Application',
  'P-11-B-28 — Summative / Application',
  'Y = FL / (Ax)','W = ∫ F(x) dx',
  'U = ½Fx','U = ½kx²','U = YA x² / (2L)',
  'extension on the horizontal axis','force on the vertical axis',
  'energy per unit volume (J/m³)',
  'radius is','0.002 m','0.191 J',
  'The average F/2 is used to calculate the work',
  'Unit 7 exam questions and official scoring remain on HOLD'
 ]){
  assert.ok(html.includes(phrase),'Missing verified physics source: '+phrase);
 }
 assert.equal((html.match(/<details class="quiz">/g)||[]).length,6);
 assert.equal((html.match(/<svg /g)||[]).length,2);
 assert.ok(html.includes('<title id="graphTitle">'));
 assert.ok(html.includes('<desc id="graphDesc">'));
 assert.ok(html.includes('<title id="apparatusTitle">'));
 assert.ok(html.includes('<desc id="apparatusDesc">'));
 assert.ok(html.includes('physics-with-sir-najam-official-logo.png'));
 assert.ok(!html.includes('firebase-config.js'));
 assert.ok(!html.includes('correctOptionId'));
 assert.ok(!html.includes('build-your-physics-test.html?unit=7'));
 assert.ok(!html.includes('recordTestAttempt'));
 assert.ok(!html.includes('localStorage.setItem'));
 assert.ok(!html.includes('document.cookie'));
 assert.ok(!html.includes('innerHTML'));
 const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(ids).size,ids.length,'Duplicate HTML IDs');
 const catalog=JSON.parse(read('portal/learning-catalog.json'));
 const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(u7.learningPreviewStatus,'public-topic-7.1-introduction-only');
 assert.deepEqual(JSON.parse(read('question-bank/manifest.json'))
  .grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
   [275,206,220,640,349,560]);
 const ledger=JSON.parse(read(originalPaths[2]));
 assert.equal(ledger.entries.length,80);
 assert.equal(ledger.teacherScienceSignoffs,0);
 assert.equal(ledger.teacherCognitiveSignoffs,0);
 assert.equal(ledger.unit7ScoredReleaseCount,0);
 assert.equal(JSON.parse(read(originalPaths[5])).decision,'NO_GO_DEPLOYMENT_BLOCKED');
 assert.equal(JSON.parse(read(originalPaths[6])).decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
 assert.equal(JSON.parse(read(originalPaths[4])).releaseApproved,false);
}
function closeTo(actual,expected,tol=1e-8){
 assert.ok(Math.abs(actual-expected)<=tol,
  'numerical result '+actual+' differs from '+expected);
}
function physicsMath(){
 const F=200,x=0.001,L=2,A=2e-6;
 const k=F/x,Y=F*L/(A*x),U=.5*F*x;
 assert.equal(k,200000);
 assert.equal(Y,2e11);
 closeTo(U,0.1);
 closeTo((.5*F)*(.5*x)/2,0.025);
 const bookF=980,bookL=1,bookD=0.004,bookY=2e11;
 const bookA=Math.PI*(bookD/2)**2;
 const bookX=bookF*bookL/(bookY*bookA);
 const bookEnergy=bookF*bookX/2;
 closeTo(bookX,3.8993e-4,1e-7);
 closeTo(bookEnergy,.1911,1e-3);
 const areaWrong=Math.PI*(bookD)**2;
 assert.ok(Math.abs(bookA-areaWrong)/bookA===3,
  'Using diameter as radius changes area by factor four');
 return {bookAreaM2:bookA,bookExtensionM:bookX,bookEnergyJ:bookEnergy};
}
async function main(){
 staticScienceAudit();
 const book=physicsMath();
 fs.mkdirSync(OUT,{recursive:true});
 const origin=await listen();
 const summary={
  version:'V163',unit:'Grade XI Unit7 Section7.3',
  source:'NBF pp122-124 and FBISE SLOs P-11-B-25/27/28',
  graphAxes:'extension-horizontal-force-vertical',
  fixedModel:{F:200,x:0.001,L:2,A:0.000002,k:200000,Y:2e11,U:0.1},
  bookExampleIndependentCheck:book,
  studentScoredMCQs:0,academicReviewStatus:'PENDING',
  browser:[],conceptPrompts:6,printedSourceScanPublished:false
 };
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
   const response=await page.goto(origin+'portal/unit-07-topic73-elastic-energy-v163.html',
    {waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200);
   assert.match(await page.locator('h1').innerText(),/Elastic Potential Energy/);
   assert.equal(await page.locator('figure svg').count(),2);
   assert.equal(await page.locator('figure svg title').count(),2);
   assert.equal(await page.locator('figure svg desc').count(),2);
   assert.equal(await page.locator('.formula').count(),5);
   assert.equal(await page.locator('details.quiz').count(),6);
   assert.equal(await page.locator('details.quiz[open]').count(),0);
   const q=page.locator('details.quiz').first();
   await q.locator('summary').click();
   assert.equal(await q.getAttribute('open'),'');
   assert.ok((await q.innerText()).includes('integral ∫F dx'));
   await q.locator('summary').click();
   assert.equal(await q.getAttribute('open'),null);
   const dimensions=await page.evaluate(()=>({
     client:document.documentElement.clientWidth,
     scroll:document.documentElement.scrollWidth
   }));
   assert.ok(dimensions.scroll<=dimensions.client+1,
    'Horizontal page overflow at '+width+' px '+JSON.stringify(dimensions));
   assert.equal(await page.locator('#result-energy').innerText(),'0.100 J');
   assert.equal(await page.locator('#result-current-extension').innerText(),'1.000 mm');
   assert.equal(await page.locator('#result-current-force').innerText(),'200.000 N');
   assert.equal(await page.locator('#result-stiffness').innerText(),'200000 N/m');
   assert.equal(await page.locator('#result-young').innerText(),'200.000 GPa');
   assert.equal(await page.locator('#energy-triangle').getAttribute('points'),
    '90,320 665,320 665,70');
   const slider=page.locator('#fraction');
   await slider.focus();await page.keyboard.press('Home');
   for(let i=0;i<10;i++)await page.keyboard.press('ArrowRight');
   assert.equal(await page.locator('#fraction-value').innerText(),'50%');
   assert.equal(await page.locator('#result-current-force').innerText(),'100.000 N');
   assert.equal(await page.locator('#result-current-extension').innerText(),'0.500 mm');
   assert.equal(await page.locator('#result-energy').innerText(),'0.025 J',
    'Halving extension in Hooke region must quarter energy');
   assert.equal(await page.locator('#energy-triangle').getAttribute('points'),
    '90,320 377.5,320 377.5,195');
   await page.keyboard.press('End');
   assert.equal(await page.locator('#fraction-value').innerText(),'100%');
   await page.locator('#load').fill('300');
   await page.locator('#end-extension').fill('2');
   await page.locator('#wire-length').fill('2');
   await page.locator('#wire-area').fill('2');
   await page.getByRole('button',{name:'Update force–extension model'}).click();
   assert.equal(await page.locator('#result-current-force').innerText(),'300.000 N');
   assert.equal(await page.locator('#result-current-extension').innerText(),'2.000 mm');
   assert.equal(await page.locator('#result-stiffness').innerText(),'150000 N/m');
   assert.equal(await page.locator('#result-young').innerText(),'150.000 GPa');
   assert.equal(await page.locator('#result-energy').innerText(),'0.300 J');
   assert.ok((await page.locator('#energy-status').innerText()).includes('no answer or grade is stored'));
   await page.locator('#end-extension').fill('2000');
   await page.getByRole('button',{name:'Update force–extension model'}).click();
   assert.equal(await page.locator('#energy-results').isHidden(),true,
    'Extension equal to original length is outside this small-strain model');
   assert.ok((await page.locator('#energy-status').innerText()).includes('outside the safe numerical range'));
   await page.locator('#end-extension').fill('2');
   await page.getByRole('button',{name:'Update force–extension model'}).click();
   assert.equal(await page.locator('#energy-results').isVisible(),true);
   assert.deepEqual(errors,[],'Client-side errors at '+width+'px');
   const name='unit7-topic73-energy-'+width+'px.png';
   await page.screenshot({path:path.join(OUT,name),fullPage:false});
   summary.browser.push({width,sourceGraphicsAccessible:true,
    defaultEnergyVerified:true,quarterEnergyVerified:true,invalidInputFailClosed:true,
    noHorizontalOverflow:true,screenshot:name});
   await ctx.close();
  }
  const entry=await browser.newPage({viewport:{width:390,height:800}});
  const intro=await entry.goto(origin+'portal/unit-07-learning-intro-v145.html',
   {waitUntil:'domcontentloaded'});
  assert.equal(intro.status(),200);
  const introLink=entry.getByRole('link',{name:'Open 7.3 Elastic Energy Study Lesson'});
  assert.equal(await introLink.count(),1);
  await introLink.click();
  await entry.waitForURL(/unit-07-topic73-elastic-energy-v163\.html$/);
  assert.match(await entry.locator('h1').innerText(),/Elastic Potential Energy/);
  const back=entry.getByRole('link',{name:'7.2 Deformation'});
  await back.click();
  await entry.waitForURL(/unit-07-topic72-deformation-v162\.html$/);
  const next=entry.getByRole('link',{name:'Open 7.3 Elastic Energy Study Lesson'});
  assert.equal(await next.count(),1);
  await next.click();
  await entry.waitForURL(/unit-07-topic73-elastic-energy-v163\.html$/);
  await entry.close();
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 assert.deepEqual(Object.fromEntries(originalPaths.map(p=>[p,digest(p)])),hashes,
  'Browser QA changed protected academic or navigation data');
 fs.writeFileSync(path.join(OUT,'summary.json'),JSON.stringify(summary,null,2)+'\n');
 console.log('V163 PASS: NBF 7.3 real Chromium 1280/390/320, source-corrected graph, wire/Y/energy derivations, keyboard half-extension quarter-energy, 0 scored Unit7 items');
}
main().catch(err=>{console.error('V163 FAILED:',err.stack||err);process.exitCode=1;});
