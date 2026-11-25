#!/usr/bin/env node
'use strict';
/* V145 — original-source-anchored Unit7 first-topic public learning page.
 * Real Chromium navigation, 3 viewports, catalogue & MCQ release safety.
 * Does NOT regrade original NBF text, import private library PDFs, publish
 * any Unit7 keyed question, classify new SLOs or modify Firebase.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'qa-artifacts/grade11-v145-unit7-first-topic-preview');
const file=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const manifest=JSON.parse(file('question-bank/manifest.json'));
const catalog=JSON.parse(file('portal/learning-catalog.json'));
const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
const protectedPaths=[
 'question-bank/manifest.json','portal/learning-catalog.json',
 'shared/navigation.js','portal/unit-07-learning-intro-v145.html',
 'quality/grade11-unit06-v94d-signoff-matrix.json',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json'
];
const digest=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,p))).digest('hex');
const hashes=Object.fromEntries(protectedPaths.map(p=>[p,digest(p)]));
const MIMES={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 try{
  let p=path.resolve(ROOT,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
  if(!p.startsWith(ROOT+path.sep))throw Error('Invalid path');
  if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');
  if(!fs.existsSync(p)||!fs.statSync(p).isFile()){
   res.writeHead(404);res.end('not found');return;
  }
  res.writeHead(200,{'Content-Type':MIMES[path.extname(p)]||'application/octet-stream',
   'Cache-Control':'no-store'});
  fs.createReadStream(p).pipe(res);
 }catch{res.writeHead(400);res.end('bad path')}
});
async function listen(){
 await new Promise((resolve,reject)=>{
  server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
 });
 return 'http://127.0.0.1:'+server.address().port+'/';
}
function staticSafety(){
 const units=catalog.grades.find(g=>g.grade===11).units;
 assert.deepEqual(units.map(x=>x.unit),Array.from({length:14},(_,i)=>i+1));
 assert.equal(catalog.resources.length,59,'Preserve V140 frozen original catalog resource count');
 assert.equal(u7.unit,7);
 assert.equal(u7.status,'planned');
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.resourceIds.length,0);
 assert.equal(u7.learningPreviewStatus,'public-topic-7.1-introduction-only');
 assert.equal(u7.learningPreviewHref,'./unit-07-learning-intro-v145.html');
 assert.equal(u7.simulationCount,2);
 assert.equal(u7.directYouTubeCount,2);
 assert.ok(file('shared/navigation.js').includes('function comingSoon('));
 assert.ok(file('shared/navigation.js').includes(
  "unit.learningPreviewStatus==='public-topic-7.1-introduction-only'"));
 const counts=manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount);
 assert.deepEqual(counts,[275,206,220,640,349,560],
  'Do not activate Unit7 MCQs or alter original source');
 const unit6=JSON.parse(file('quality/grade11-unit06-v94d-signoff-matrix.json'));
 assert.equal(unit6.releaseApproved,false);
 assert.equal(unit6.studentCourseStatus,'planned');
 assert.equal(unit6.teacherSignoff,'pending');
 const html=file('portal/unit-07-learning-intro-v145.html');
 for(const token of ['P-11-B-22','113–116',
  'Classification of Solids','Polycrystalline solids',
  'Amorphous solids','Body-centred cubic',
  'Face-centred cubic','X-ray diffraction','Anisotropy',
  '7.2 · Deformation in Solids','7.3 · Elastic Potential Energy',
  '11 short responses, 8 comprehensive questions and 5 numerical problems',
  'No Unit 7 MCQ bank or official graded assessment is released here']){
  assert.ok(html.includes(token),'Missing original source-bounded student guidance: '+token);
 }
 assert.equal((html.match(/<details class="q">/g)||[]).length,4);
 assert.ok(!html.includes('build-your-physics-test.html?unit=7'),
  'No unverified test or saved attempt exposed');
 assert.ok(!html.includes('sites.google.com'));
 assert.ok(!html.includes('firebase.firestore'));
 assert.ok(!html.includes('Get an official score'));
 assert.ok(html.includes('physics-with-sir-najam-official-logo.png'));
 assert.ok(fs.existsSync(path.join(ROOT,'portal/assets/physics-with-sir-najam-official-logo.png')));
}
async function menu(page){
 await page.getByRole('button',{name:'Open unit resources menu'}).click();
 await page.waitForFunction(()=>{
  const t=document.querySelector('.psn-drawer-loading')?.textContent||'';
  return t.includes('unit menus')||t.includes('Unable to load');
 },null,{timeout:18000});
 const status=await page.locator('.psn-drawer-loading').innerText();
 assert.ok(status.includes('unit menus'),'Global unit drawer failed: '+status);
}
async function main(){
 staticSafety();
 fs.mkdirSync(OUT,{recursive:true});
 const root=await listen(),checks=[],images=[];
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const ctx=await browser.newContext({viewport:{width,height:870},deviceScaleFactor:1});
   const page=await ctx.newPage();
   const exceptions=[];page.on('pageerror',e=>exceptions.push(e.message));
   const response=await page.goto(root+'portal/unit-07-learning-intro-v145.html',
    {waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200);
   assert.match(await page.locator('h1').innerText(),/Physics of Solids/);
   assert.equal(await page.locator('details.q').count(),4);
   assert.equal(await page.locator('details.q[open]').count(),0,
    'Intro prompts should not reveal answers before student opens them');
   const first=page.locator('details.q').first();
   await first.locator('summary').click();
   assert.equal(await first.getAttribute('open'),'');
   assert.ok((await first.innerText()).includes('regular repeating long-range lattice'));
   await first.locator('summary').click();
   assert.equal(await first.getAttribute('open'),null);
   for(const label of ['Explore Unit 7 Simulations','Browse Additional Videos']){
    const link=page.getByRole('link',{name:label});
    assert.equal(await link.count(),1);
    const target=new URL(await link.getAttribute('href'),page.url());
    assert.equal(target.origin,new URL(root).origin);
    const destination=path.join(ROOT,target.pathname.slice(1));
    assert.ok(fs.existsSync(destination),'Destination missing for '+label);
   }
   // The global portal navigation has a generic Build My Test link.
   // Check only the newly published Unit7 learning article for premature tests.
   assert.equal(await page.locator('main#content').getByRole('link',
    {name:/Unit 7 MCQ|Build.*Test/}).count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2),
    false,'Unit7 learning intro overflow at '+width);
   const img='unit7-introduction-'+width+'px.png';
   await page.screenshot({path:path.join(OUT,img),fullPage:false});
   images.push({width,image:img,publicMaterialOnly:true});
   await menu(page);
   const future=page.locator('.psn-drawer-future').first();
   assert.equal(await future.getAttribute('open'),'',
    'Current Unit7 must automatically open Next units group');
   const link=future.getByRole('link',{name:/Unit 7 · Topic 7.1 Learning Introduction/});
   assert.equal(await link.count(),1);
   assert.ok((await link.getAttribute('href')).includes('unit-07-learning-intro-v145.html'));
   assert.equal(await link.getAttribute('aria-current'),'page');
   assert.ok((await future.innerText()).includes('Full course still planned'));
   assert.equal(await future.getByRole('link',{name:/Build.*Test|Unit 7.*MCQ/}).count(),0);
   assert.equal(await page.locator('.psn-drawer-unit').count(),6,
    'Unit7 preview must not claim full course is available');
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#psn-resource-drawer').isVisible(),false);
   assert.deepEqual(exceptions,[],'JS runtime exceptions at '+width);
   checks.push({width,plannedUnit7RemainsUnreleased:true,
    introReadable:true,fourOptionalStudyPrompts:true,
    existingSimulationAndVideoLinksValid:true,
    sourceSafeUnit7SidebarLink:true,noUnit7BankPublished:true});
   await ctx.close();
  }
  // Existing student-guide drawer remains consistent with V140 future menu.
  const guide=await browser.newPage({viewport:{width:390,height:800}});
  assert.equal((await guide.goto(root+'student-guide.html',
   {waitUntil:'domcontentloaded'})).status(),200);
  await menu(guide);
  const future=guide.locator('.psn-drawer-future').first();
  // On a general guide the planned-units accordion starts collapsed by
  // design; expand it before asserting an accessible learner link.
  await future.locator('summary').click();
  assert.equal(await future.getByRole('link',{name:/Unit 7 · Topic 7.1 Learning Introduction/}).count(),1);
  assert.equal(await guide.locator('.psn-drawer-unit').count(),6);
  await guide.close();
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 assert.equal(checks.length,3);assert.equal(images.length,3);
 assert.deepEqual(Object.fromEntries(protectedPaths.map(p=>[p,digest(p)])),hashes,
  'Read-only browser QA mutated original source or portal metadata');
 fs.writeFileSync(path.join(OUT,'review-summary.json'),JSON.stringify({
  version:'V145',topic:'Unit 7 first source-anchored introduction only',
  sourceReference:'teacher-prepared NBF Grade XI Topic7.1 pp.113–116; P-11-B-22',
  viewports:checks,screenshots:images,
  sourcePdfUploadedToRepository:false,fullOriginalTextbookVerifiedLineByLine:false,
  originalItemAnswerSignoffsComplete:false,
  unit7LiveBankCount:0,unit7CourseStatus:'planned',unit7GradedAssessment:'not-published',
  grade11ExistingPublicProvisionalMcqs:2250,unit6AcademicRelease:'PENDING',
  teacherPortalProductionEnabled:false,studentRecordsAccessed:false
 },null,2)+'\n');
 console.log('V145 PASS: source-anchored Unit7 Topic7.1 introduction and optional self-check, existing links and planned-course drawer on 1280/390/320px; 0 Unit7 scored MCQs or graded release.');
}
main().catch(e=>{console.error('V145 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
