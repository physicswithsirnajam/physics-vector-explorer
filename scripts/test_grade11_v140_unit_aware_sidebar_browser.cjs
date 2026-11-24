#!/usr/bin/env node
'use strict';
/* V140: actual Chromium unit-aware global drawer regression.
 * Only public navigation metadata is inspected. Auth, teacher permissions,
 * original question data, saved attempts and Firebase remain unchanged.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const nav=fs.readFileSync(path.join(root,'shared/navigation.js'),'utf8');
const css=fs.readFileSync(path.join(root,'shared/navigation.css'),'utf8');
const catalogPath=path.join(root,'portal/learning-catalog.json');
const catalog=JSON.parse(fs.readFileSync(catalogPath,'utf8'));
const output=path.join(root,'qa-artifacts/grade11-v140-unit-sidebar');
const protectedPaths=['shared/navigation.js','shared/navigation.css','portal/learning-catalog.json',
 'question-bank/manifest.json','practice-engine/index.html',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json'];
const hash=buf=>crypto.createHash('sha256').update(buf).digest('hex');
const before=Object.fromEntries(protectedPaths.map(p=>[p,hash(fs.readFileSync(path.join(root,p)))]));
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.mjs':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
 '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
 '.b64':'text/plain; charset=utf-8','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 try{
  const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('bad request')}
});
async function listen(){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
const stageKeys=['LEARN','EXPLORE','PRACTISE','PREPARE','TRACK'];
function contracts(){
 assert.ok(nav.includes('function activeUnitNumber()'));
 assert.ok(nav.includes('function syncActiveUnit()'));
 assert.ok(nav.includes('function comingSoon('));
 assert.ok(css.includes('.psn-drawer-stage-summary'));
 assert.ok(css.includes('.psn-drawer-future'));
 assert.ok(!nav.includes('google.com/sites'),'Global drawer must not link back to Google Sites');
 assert.ok(!nav.includes('firebase.firestore'),'Navigation may not read private student data');
 const units=catalog.grades.find(g=>g.grade===11).units;
 assert.deepEqual(units.map(u=>u.unit),Array.from({length:14},(_,i)=>i+1));
 assert.deepEqual(units.filter(u=>u.status==='available').map(u=>u.unit),[1,2,3,4,5]);
 assert.equal(units[5].practicePreviewStatus,'public-provisional');
 assert.ok(units.slice(6).every(u=>u.status==='planned'),'Future units must remain planned');
 assert.ok(catalog.resources.length>=64);
 const ids=new Set(catalog.resources.map(r=>r.id));
 assert.equal(ids.size,catalog.resources.length,'Resource IDs are duplicated');
 const hrefs=[];
 for(let n=1;n<=5;n++){
  const u=units[n-1],id='unit'+n+'-supplementary-videos';
  assert.ok(u.resourceIds.includes(id),'Unit '+n+' supplementary video link missing');
  const record=catalog.resources.find(r=>r.id===id);
  assert.ok(record&&record.category==='VIDEOS');
  assert.equal(record.videoPriority,'supplementary-existing');
  hrefs.push(record.href);
 }
 assert.equal(units[5].previewResources.filter(r=>r.category==='VIDEOS').length,1);
 hrefs.push(units[5].previewResources.find(r=>r.category==='VIDEOS').href);
 for(const href of hrefs){
  const url=new URL(href,'http://localhost/portal/');
  assert.equal(url.pathname,'/portal/legacy-hssc-resources.html');
  assert.ok(fs.existsSync(path.join(root,url.pathname.slice(1))),
   'Existing supplementary video directory is missing: '+href);
 }
 // Every displayed public unit link must resolve to an existing local route;
 // a missing file should be fixed or removed before making the sidebar live.
 const visibleRecords=[];
 for(const unit of units.slice(0,6)){
  for(const id of unit.resourceIds||[]){
   if(id==='protected-lesson')continue; // Internal access-test entry never shown.
   const record=catalog.resources.find(r=>r.id===id);
   assert.ok(record,'Missing catalogue resource reference '+id);
   visibleRecords.push(record);
  }
  visibleRecords.push(...(unit.previewResources||[]));
 }
 for(const record of visibleRecords){
  const url=new URL(record.href,'http://localhost/portal/');
  assert.equal(url.origin,'http://localhost','Unexpected external navigation '+record.id);
  const local=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  assert.ok(local.startsWith(root+path.sep)&&fs.existsSync(local),
   'Broken published unit resource link: '+record.id+' -> '+url.pathname);
 }
 assert.ok(!JSON.stringify(catalog).includes('youtube.com/@physicswithsirnajam'),
  'Do not invent the unpublished official YouTube channel address');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'question-bank/manifest.json'),'utf8'));
 const original=manifest.grades.find(g=>g.grade===11).units;
 assert.deepEqual(original.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
 const matrix=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(matrix.releaseApproved,false);
 assert.equal(matrix.teacherSignoff,'pending');
 assert.equal(matrix.studentCourseStatus,'planned');
}
async function openMenu(page){
 await page.locator('#psn-nav-menu-button').count().catch(()=>0);
 await page.getByRole('button',{name:'Open unit resources menu'}).click();
 await page.locator('#psn-drawer-loading').waitFor({state:'visible',timeout:12000});
 await page.waitForFunction(()=>{
  const p=document.querySelector('#psn-drawer-loading')?.textContent||'';
  return p.includes('unit menus')||p.includes('Unable to load');
 },null,{timeout:18000});
 const label=await page.locator('#psn-drawer-loading').innerText();
 assert.ok(label.includes('unit menus'),'Catalog failed to load: '+label);
 assert.equal(await page.locator('#psn-resource-drawer .psn-drawer-unit').count(),6);
 assert.equal(await page.locator('#psn-resource-drawer .psn-drawer-future').count(),2);
}
async function assertStages(page,unitNumber){
 const unit=page.locator('.psn-drawer-unit[data-psn-unit="'+unitNumber+'"]');
 assert.equal(await unit.locator('.psn-drawer-stage').count(),5);
 assert.deepEqual(await unit.locator('.psn-drawer-stage').evaluateAll(nodes=>nodes.map(x=>x.dataset.psnStage)),stageKeys);
 return unit;
}
async function assertNoDrawerOverflow(page,width){
 const overflow=await page.locator('#psn-resource-drawer').evaluate(el=>({
  scrollWidth:el.scrollWidth,clientWidth:el.clientWidth
 }));
 assert.ok(overflow.scrollWidth<=overflow.clientWidth+2,
  'Navigation drawer horizontal overflow at '+width+'px');
}
async function main(){
 contracts();fs.mkdirSync(output,{recursive:true});
 const base=await listen(),results=[],screenshots=[];
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:840},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   assert.equal((await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'})).status(),200);
   await page.getByRole('button',{name:'Open unit resources menu'}).waitFor({state:'visible',timeout:10000});
   await openMenu(page);
   const units=page.locator('.psn-drawer-unit');
   for(let n=1;n<=6;n++)await assertStages(page,n);
   const u6=units.nth(5);
   assert.ok((await u6.textContent()).includes('individual teacher signoffs'));
   const future=page.locator('.psn-drawer-future');
   assert.ok((await future.first().innerText()).includes('Units 7–10'));
   await future.first().locator('summary').click();
   assert.ok((await future.first().innerText()).includes('Unit 7'));
   assert.ok((await future.first().innerText()).includes('Unit 10'));
   assert.equal(await future.first().getByRole('link',{name:/Build an MCQ Practice Test/}).count(),0,
    'Planned unit cannot show an unpublished MCQ bank');
   assert.ok((await future.first().getByRole('link',{name:/existing simulations/}).count())>=4,
    'Existing simulations for planned units must remain accessible as enrichment');
   const u1=await assertStages(page,1);
   await u1.locator('summary.psn-drawer-unit-summary').click();
   assert.ok((await u1.textContent()).includes('Additional Existing Concept Videos'));
   assert.ok((await u1.textContent()).includes('Physics with Sir Najam original video lessons'));
   assert.equal(await page.locator('#psn-resource-drawer a[href*="sites.google.com"]').count(),0);
   assert.equal(await page.locator('#psn-resource-drawer a[href*="protected-lesson.html"]').count(),0,
    'Internal access-test page should not be in learner menu');
   await assertNoDrawerOverflow(page,width);
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#psn-resource-drawer').isVisible(),false);
   assert.deepEqual(errors.filter(e=>/navigation|drawer/i.test(e)),[]);
   results.push({width,scenario:'existing public guide',stages:5,availableUnits:6,plannedUnits:8,
    supplementalLinksPresent:true,privateSourceNotUsed:true});
   await page.close();

   const learning=await browser.newPage({viewport:{width,height:840}});
   assert.equal((await learning.goto(base+'portal/unit-03.html',{waitUntil:'domcontentloaded'})).status(),200);
   await openMenu(learning);
   assert.equal(await learning.locator('.psn-drawer-unit[open]').count(),1);
   assert.equal(await learning.locator('.psn-drawer-unit[open]').getAttribute('data-psn-unit'),'3');
   const study=learning.locator('.psn-drawer-unit[data-psn-unit="3"]');
   assert.equal(await study.locator('.psn-drawer-stage[open]').first().getAttribute('data-psn-stage'),'LEARN');
   assert.ok((await study.locator('a[aria-current="page"]').count())>=1);
   await assertNoDrawerOverflow(learning,width);
   if(width!==320){
    const png='unit3-learning-drawer-'+width+'px.png';
    await learning.screenshot({path:path.join(output,png),fullPage:false});
    screenshots.push({width,png,context:'Unit3 learning desk / Learn stage'});
   }
   await learning.close();
   results.push({width,scenario:'Unit3 study page',activeUnit:3,activeStage:'LEARN'});

   const sim=await browser.newPage({viewport:{width,height:840}});
   assert.equal((await sim.goto(base+'portal/simulations.html?unit=6',{waitUntil:'domcontentloaded'})).status(),200);
   await sim.locator('#unit option[value="3"]').waitFor({state:'attached',timeout:16000});
   await openMenu(sim);
   const six=sim.locator('.psn-drawer-unit[data-psn-unit="6"]');
   assert.equal(await six.getAttribute('open'),'');
   assert.equal(await six.locator('.psn-drawer-stage[open]').first().getAttribute('data-psn-stage'),'EXPLORE');
   assert.ok((await six.textContent()).includes('Provisional self-practice only'));
   await assertNoDrawerOverflow(sim,width);
   if(width===390){
    const png='unit6-simulation-drawer-390px.png';
    await sim.screenshot({path:path.join(output,png),fullPage:false});
    screenshots.push({width,png,context:'Unit6 provisional Explore stage'});
   }
   await sim.keyboard.press('Escape');
   await sim.locator('#unit').selectOption('3');
   await sim.waitForFunction(()=>new URL(location.href).searchParams.get('unit')==='3');
   await openMenu(sim);
   const unit3=sim.locator('.psn-drawer-unit[data-psn-unit="3"]');
   assert.equal(await unit3.getAttribute('open'),'');
   assert.equal(await unit3.locator('.psn-drawer-stage[open]').first().getAttribute('data-psn-stage'),'EXPLORE',
    'Unit selector without reload must keep simulation stage active');
   assert.equal(await sim.locator('.psn-drawer-unit[open]').count(),1);
   await assertNoDrawerOverflow(sim,width);
   await sim.close();
   results.push({width,scenario:'Simulations filter changes without reload',activeUnitAfter:3,activeStage:'EXPLORE'});
  }
  const builder=await browser.newPage({viewport:{width:390,height:840}});
  assert.equal((await builder.goto(base+'build-your-physics-test.html?unit=3',{waitUntil:'domcontentloaded'})).status(),200);
  await openMenu(builder);
  const u3=builder.locator('.psn-drawer-unit[data-psn-unit="3"]');
  assert.equal(await u3.getAttribute('open'),'');
  assert.equal(await u3.locator('.psn-drawer-stage[open]').first().getAttribute('data-psn-stage'),'PRACTISE');
  const activeLinks=await u3.locator('a[aria-current="page"]').count();
  assert.ok(activeLinks>=1,'Current Test Builder unit not identified');
  await builder.close();
  results.push({width:390,scenario:'unit-filtered Test Builder deep link',activeUnit:3,activeStage:'PRACTISE'});
 }finally{
  if(browser)await browser.close();
  await new Promise(ok=>server.close(ok));
 }
 assert.equal(results.length,10);
 assert.equal(screenshots.length,3);
 const after=Object.fromEntries(protectedPaths.map(p=>[p,hash(fs.readFileSync(path.join(root,p)))]));
 assert.deepEqual(after,before,'Read-only browser navigation QA mutated protected sources');
 fs.writeFileSync(path.join(output,'review-summary.json'),JSON.stringify({
  version:'V140',source:'existing public Grade XI resource catalog',
  stageOrder:stageKeys,verifiedContexts:results,
  screenshots,liveTeacherAuthTested:false,officialVideosPublished:false,
  grade11Unit6FormalExamReleased:false,originalPublicMCQsUnchanged:true
 },null,2)+'\n');
 console.log('V140 PASS: unit-aware 5-stage drawer, 6 public/provisional units, 8 planned units, supplementary video routes, filter changes, 1280/390/320px and 3 screenshots.');
}
main().catch(err=>{console.error('V140 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
