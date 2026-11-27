#!/usr/bin/env node
'use strict';
/* V216: source-bounded Units 1–7 exercise/assignment status guide.
 * Tests navigation and source-labelled availability, NOT teacher signoff
 * or permission to reproduce original NBF end-of-unit question sets.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const pageSource=read('portal/textbook-exercise-status-v216.html');
const nav=read('shared/navigation.js');
const cat=json('portal/learning-catalog.json');
const manifest=json('question-bank/manifest.json');
const v103=json('portal/verified-textbook-index-v103.json');
const v104=json('portal/verified-descriptive-index-v104.json');
const v108=json('portal/verified-unit6-worked-topic-index-v108.json');
const out=path.join(ROOT,'qa-artifacts/grade11-v216-exercise-availability-directory');
const kinds=['worked','assignments','end-mcq','end-short','end-extended','end-numericals','descriptive-practice','mcq-practice'];
function sourceIntegrity(){
 const units=cat.grades.find(g=>g.grade===11).units;
 assert.equal(cat.resources.length,59,'Immutable 59-resource public catalog');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),
  [275,206,220,640,349,560],'Unchanged 2250 currently pinned MCQ source identities');
 assert.deepEqual(units.slice(0,7).map(x=>x.unit),[1,2,3,4,5,6,7]);
 assert.equal(units[5].status,'planned');
 assert.equal(units[5].assessmentStatus,'not-published');
 assert.equal(units[5].partialTestBuilderMcqCount,560);
 assert.equal(units[6].status,'planned');
 assert.equal(units[6].questionBankCount,0);
 assert.equal(units[6].assessmentStatus,'not-published');
 assert.equal(v103.entries.length,28);
 assert.equal(v103.entries.filter(x=>x.unit===5||x.unit===6||x.unit===7).length,0);
 assert.equal(v104.records.filter(x=>x.unit>=3).length,0);
 assert.equal(v108.entries.length,7);
 for(let u=1;u<=7;u++){
  assert.equal(pageSource.split('id="unit-'+u+'" data-unit="'+u+'"').length-1,1,
   'Every unit 1-7 must have exactly one source-status panel');
  assert.equal(pageSource.split('value="'+u+'">Unit '+u+' —').length-1,1,
   'Every unit has an explicit selector option');
  assert.ok(nav.includes('textbook-exercise-status-v216.html'));
  assert.ok(pageSource.includes('grade-11')===false||pageSource.includes('GRADE XI'));
 }
 assert.equal((pageSource.match(/data-kind="end-mcq"/g)||[]).length,7);
 for(const kind of kinds){
  assert.equal((pageSource.match(new RegExp('data-kind="'+kind+'"','g'))||[]).length,7,
   kind+' must be separately visible for each unit');
 }
 for(const kind of ['end-mcq','end-short','end-extended','end-numericals']){
  assert.equal((pageSource.match(new RegExp('data-kind="'+kind+'" data-state="pending"','g'))||[]).length,7,
   'Original NBF end-of-unit section cannot be marked published before academic approval');
 }
 assert.equal((pageSource.match(/data-kind="lesson-preview"/g)||[]).length,1);
 for(const text of ['Three public topic studies','11-question set held','eight-question set held',
  'five-problem set held','No public scored or provisional Unit 7 MCQ bank is released',
  'not a complete independently certified','Teacher material','Source check pending',
  'Unit 6 remains a preview','560 provisional self-practice MCQs']){
  assert.ok(pageSource.includes(text),'Missing essential academic-status text '+text);
 }
 for(let unit=1;unit<=6;unit++){
  assert.ok(nav.includes("id:'v216-u'+unit.unit+'-exercise-status'"));
 }
 assert.ok(nav.includes('Unit 7 · Original textbook exercise and assignment status · No scored release'));
 assert.ok(nav.includes("unit.unit>=1 && unit.unit<=6"));
 assert.ok(!pageSource.includes('FIREBASE_APPCHECK_DEBUG_TOKEN'));
 assert.ok(!pageSource.includes('initializeAppCheck'));
 assert.ok(!pageSource.includes('getFirestore'));
 assert.ok(!pageSource.includes('localStorage'));
 assert.ok(!pageSource.includes('sessionStorage'));
 // All authored local student-facing links resolve to existing source files.
 const urls=[...pageSource.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replace(/&amp;/g,'&'));
 for(const href of urls){
  if(href.startsWith('#'))continue;
  assert.ok(!/^https?:|^javascript:|^data:/i.test(href),'Unexpected third-party/unsafe resource '+href);
  const url=new URL(href,'http://localhost/portal/textbook-exercise-status-v216.html');
  const local=path.resolve(ROOT,'.'+url.pathname);
  assert.ok(local.startsWith(ROOT+path.sep),'Route escapes repo '+href);
  assert.ok(fs.existsSync(local),'Broken source-backed resource link '+href);
  if(url.hash&&url.pathname.endsWith('.html')){
   const body=fs.readFileSync(local,'utf8'),anchor=decodeURIComponent(url.hash.slice(1));
   assert.ok(body.includes('id="'+anchor+'"'),
    'Broken source question/example anchor '+href);
  }
 }
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png'};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const file=path.resolve(ROOT,'.'+p);
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('Missing');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('Invalid path')}
});
async function serve(){
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function testView(browser,base,width,unitValue){
 const page=await browser.newPage({viewport:{width,height:880}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const query=unitValue==='all'?'':'?unit='+unitValue;
  const result=await page.goto(base+'portal/textbook-exercise-status-v216.html'+query,
   {waitUntil:'domcontentloaded'});
  assert.equal(result.status(),200);
  assert.equal(await page.locator('#unit-filter').inputValue(),unitValue);
  const visible=await page.locator('.unit-panel:visible').count();
  assert.equal(visible,unitValue==='all'?7:1,'Unit filter selected correctly');
  const section=page.locator('#unit-'+(unitValue==='all'?1:unitValue));
  assert.equal(await section.locator('.resource-row').count(),
   unitValue==='7'?9:8);
  assert.equal(await section.locator('[data-kind^="end-"][data-state="pending"]').count(),4);
  assert.ok((await section.textContent()).includes('Original end-of-unit MCQs'));
  assert.ok((await section.textContent()).includes('Original end-of-unit numerical problems'));
  if(unitValue==='7'){
   assert.equal(await section.locator('[data-kind="mcq-practice"] a').count(),0);
   assert.equal(await section.locator('[data-kind="lesson-preview"] a').count(),3);
   assert.ok((await section.textContent()).includes('not yet approved for release'));
  }
  await page.getByRole('button',{name:'Open unit resources menu'}).click();
  await page.waitForFunction(()=>(
   document.querySelector('.psn-drawer-loading')?.textContent||''
  ).includes('unit menus'),null,{timeout:18000});
  if(unitValue!=='all'&&unitValue!=='7'){
   const u=page.locator('.psn-drawer-unit[data-psn-unit="'+unitValue+'"]');
   assert.equal(await u.count(),1);
   const prepare=u.locator('.psn-drawer-stage[data-psn-stage="PREPARE"]');
   assert.equal(await prepare.locator('a[href*="textbook-exercise-status-v216.html?unit='+unitValue+'"]').count(),1);
  }
  if(unitValue==='7'){
   const future=page.locator('.psn-drawer-future[data-psn-future-units]');
   const a=future.locator('a[href*="textbook-exercise-status-v216.html?unit=7"]');
   assert.equal(await a.count(),1,'Unit7 future-menu status link only');
   assert.equal(await future.locator('a[href*="build-your-physics-test.html?unit=7"]').count(),0);
  }
  assert.equal(await page.locator('.psn-drawer-quick a[href*="textbook-exercise-status-v216.html"]').count(),1);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-
   document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Horizontal overflow at '+width+': '+overflow);
  assert.deepEqual(errors,[],'No JS runtime errors at '+width);
  return {width,unit:unitValue,visiblePanels:visible,sourceOriginalExerciseRowsPending:4,
   noScoredReleaseForUnit7:true,originalBankChanged:false};
 }finally{await page.close()}
}
(async()=>{
 sourceIntegrity();fs.mkdirSync(out,{recursive:true});
 const base=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const results=[
   await testView(browser,base,1280,'all'),
   await testView(browser,base,390,'1'),
   await testView(browser,base,320,'7'),
   await testView(browser,base,390,'6')
  ];
  fs.writeFileSync(path.join(out,'evidence.json'),JSON.stringify({
   version:'V216',results,publicUnits:7,originalEndExerciseCategories:4,
   originalEndExerciseSectionsCertifiedComplete:0,
   adaptedPracticeAndTeacherResourcesSeparate:true,
   unit7ScoredQuestionBanksPublished:0,unchangedPublicMcqCount:2250
  },null,2)+'\n');
  console.log('V216 PASS: seven clear unit exercise-status panels, 28 original end-of-unit source holds, per-unit menu links and unscored Unit7 preview on desktop/mobiles.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error('V216 FAILED:',error.stack||error);
 process.exitCode=1;try{server.close()}catch{}});
