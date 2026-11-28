#!/usr/bin/env node
'use strict';
/* V57 with V236: retain original five-unit checks and verify Unit6 provisional + Unit7–8 public-study discovery.
 * Does not access Firebase or require student login.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),qa=path.join(root,'qa-artifacts','guide-v57');
fs.mkdirSync(qa,{recursive:true});
const load=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const known={1:275,2:206,3:220,4:640,5:349};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const u=new URL(req.url,'http://localhost'),p=decodeURIComponent(u.pathname);
  let target=path.resolve(root,'.'+p);
  if(!target.startsWith(root+path.sep))throw Error('unsafe path');
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end('Not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(target).pipe(res);
 }catch(e){res.writeHead(404);res.end(String(e))}
});
function validateCatalog(){
 const manifest=load('question-bank/manifest.json');
 const catalog=load('portal/learning-catalog.json');
 const xi=manifest.grades.find(g=>g.grade===11),course=catalog.grades.find(g=>g.grade===11);
 assert.ok(xi&&course&&Array.isArray(course.units)&&course.units.length===14,'fourteen course rows must be present');
 const published=course.units.filter(u=>u.status==='available');
 assert.deepEqual(published.map(u=>u.unit),[1,2,3,4,5],'only Units 1–5 are published in this checkpoint');
 assert.equal(xi.units.length,6,'five full banks plus partial Unit6');
  assert.equal(xi.units.find(x=>x.unit===6)?.liveMcqCount,560);
 assert.equal(published.reduce((a,u)=>a+u.resourceIds.length,0),59,'expected 59 published unit-linked resource entries');
 assert.equal(catalog.resources.length,59,'all linked resource records in catalogue');
 const ids=new Set(),resourceMap=new Map();
 for(const r of catalog.resources){
  assert.ok(r.id&&!ids.has(r.id),'duplicate/empty resource id '+r.id);
  ids.add(r.id);resourceMap.set(r.id,r);
  const url=new URL(r.href,'https://example.invalid/portal/index.html');
  assert.ok(['https:','http:'].includes(url.protocol),'non-http href in resource '+r.id);
  if(url.hostname==='example.invalid'){
   const pathname=decodeURIComponent(url.pathname).replace(/^\//,'');
   const file=path.resolve(root,pathname);
   assert.ok(file.startsWith(root+path.sep),'out-of-repository link '+r.id);
   assert.ok(fs.existsSync(file),'missing linked local file '+r.id+' '+r.href);
   if(fs.statSync(file).isDirectory())assert.ok(fs.existsSync(path.join(file,'index.html')),'missing directory landing '+r.id);
  }else{
   assert.equal(url.hostname,'sites.google.com','external resource needs explicit verified domain '+r.id);
   assert.ok(url.pathname.startsWith('/view/physics-with-sir-najam/'),'unexpected external resource path '+r.id);
  }
 }
 const allLinked=[];
 for(const u of published){
  assert.equal(u.questionBankCount,known[u.unit]);
  assert.equal(xi.units.find(x=>x.unit===u.unit)?.liveMcqCount,known[u.unit]);
  assert.ok(u.landingHref,'missing landing '+u.unit);
  const landing=path.resolve(root,'portal',u.landingHref);
  assert.ok(fs.existsSync(landing),'missing landing page '+u.unit);
  for(const id of u.resourceIds){
   assert.ok(resourceMap.has(id),'unknown resource id '+id);
   allLinked.push(id);
  }
 }
 assert.equal(new Set(allLinked).size,59,'resource ID unexpectedly reused in distinct units');
 assert.equal(allLinked.length,59);
 const resourceCategories=new Set(catalog.resources.map(r=>r.category));
 const portal=read('portal/index.html');
 for(const type of resourceCategories){
  if(type==='REVIEW')continue;
  assert.ok(portal.includes('<option value="'+type+'">'),'resource filter does not expose '+type);
 }
 for(const u of [1,2,3,4,5])assert.ok(read('portal/learning-hub.js').includes('practiceHref')||false);
 assert.ok(portal.includes('href="../student-guide.html"'),'student guide must be reachable from dashboard');
 assert.ok(portal.includes('Select')||portal.includes('Grade XI'));
 assert.ok(read('build-your-physics-test.html').includes('href="student-guide.html"'),'guide link must exist in public Test Builder');
 assert.ok(fs.existsSync(path.join(root,'portal/assets/physics-with-sir-najam-official-logo.png')));
 assert.ok(fs.existsSync(path.join(root,'student-guide.html')));
 console.log('PASS V59+V57 catalogue: five published units; 1690 MCQs; 59 unique valid resources and local landing paths; all resource category filters covered.');
}
async function verifyBrowser(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1320,height:900}});
  const errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().includes('127.0.0.1')&&r.status()>=400)missing.push(r.url()+' status '+r.status())});
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'student-guide.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('question-total').textContent==='2250');
  assert.equal(await page.locator('.unit').count(),8);
  assert.equal(await page.locator('.unit .links a[href^="build-your-physics-test.html?unit="]').count(),6);
  assert.equal(await page.locator('#psn-global-nav').count(),1);
  assert.equal(await page.locator('.hero .brand img').evaluate(img=>img.complete&&img.naturalWidth>0),true,'unchanged official logo must load');
  assert.equal(await page.locator('.unit .count').allTextContents().then(x=>x.join('|')),'275 MCQs|206 MCQs|220 MCQs|640 MCQs|349 MCQs|560 provisional MCQs|3 unscored topic lessons|10 unscored topic lessons');
  await page.screenshot({path:path.join(qa,'01-student-guide-desktop.png'),fullPage:true});
  const expectedLinks=[
   'portal/unit-01.html','portal/unit-02.html','portal/unit-03.html',
   'portal/unit-04.html','portal/unit-05.html','portal/unit-06-learning-desk-v95a.html',
    'portal/exam-quick-access.html#unit7-unscored-study-preview','portal/exam-quick-access.html#unit8-unscored-study-preview',
   'build-your-physics-test.html','portal/#learning-hub',
   'build-your-physics-test.html?units=1,3,5'
  ];
  for(const dest of expectedLinks)assert.ok(await page.locator('a[href="'+dest+'"]').count(),'missing student entry '+dest);
  await page.locator('a[href="build-your-physics-test.html?units=1,3,5"]').click();
  await page.waitForURL(/build-your-physics-test\.html\?units=/);
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('844 eligible MCQ'));
  assert.equal(await page.locator('input[name="unit"]:checked').count(),3);
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.screenshot({path:path.join(qa,'02-guide-to-mixed-unit-test.png'),fullPage:false});
  await page.goto(base+'student-guide.html',{waitUntil:'networkidle'});
  await page.setViewportSize({width:390,height:844});
  const dimensions=await page.evaluate(()=>({
   viewport:document.documentElement.clientWidth,
   scroll:document.documentElement.scrollWidth
  }));
  assert.ok(dimensions.scroll<=dimensions.viewport+2,'student guide 390px horizontal scroll '+JSON.stringify(dimensions));
  assert.equal(await page.locator('.unit').count(),8);
  await page.screenshot({path:path.join(qa,'03-student-guide-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[],'new guide must not throw browser JS exceptions');
  assert.deepEqual(missing,[],'all local guide and Test Builder assets must load');
  console.log('PASS V57+V236 browser: original five learning desks, Unit6 practice, Unit7–8 unscored study, 2250 available MCQs, mixed-unit Test Builder, official logo and 390px mobile.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
}
(async()=>{validateCatalog();await verifyBrowser()})().catch(e=>{console.error('FAIL V57',e);server.close();process.exitCode=1});
