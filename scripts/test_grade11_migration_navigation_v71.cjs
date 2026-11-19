#!/usr/bin/env node
'use strict';
/* V71: genuine Chromium check of new local study and simulation navigation
 * and classic Times New Roman-family PDF watermark typography.
 * Tests public navigation and synthetic print style only — no account
 * login, private Google Drive download or Firebase authorization claims.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),qa=path.join(root,'qa-artifacts/unit-intake-v71');
fs.mkdirSync(qa,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  let f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end('Missing');return;}
  if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.statSync(f).isFile()){res.writeHead(404);res.end('Missing');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch{res.writeHead(500);res.end('Request error');}
});
function audit(){
 const catalog=JSON.parse(read('portal/learning-catalog.json'));
 const units=catalog.grades.find(g=>g.grade===11).units;
 assert.equal(catalog.resources.length,59);
 assert.equal(units.length,14);
 assert.deepEqual(units.slice(0,5).map(u=>u.status),Array(5).fill('available'));
 assert.deepEqual(units.slice(5,10).map(u=>u.status),Array(5).fill('planned'));
 assert.ok(units.slice(5,10).every(u=>u.resourceIds.length===0),'Units 6-10 must not be published prematurely');
 const study=catalog.resources.find(r=>r.id==='study'),explore=catalog.resources.find(r=>r.id==='explore');
 assert.deepEqual([study.href,explore.href],['./unit-01.html','./simulations.html']);
 assert.ok(!study.external&&!explore.external,'generic links must be native portal pages');
 assert.ok(study.description.includes('Unit 1')&&explore.description.includes('interactive'));
 assert.ok(!catalog.resources.some(r=>r.href.includes('sites.google.com')),
  'legacy links must not be disguised as Study or Explore resources');
 assert.equal(JSON.parse(read('portal/simulation-catalog.json')).simulations.length,31);
 const counts=JSON.parse(read('question-bank/manifest.json')).grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount);
 assert.deepEqual(counts.slice(0,5),[275,206,220,640,349],'preserve the five original MCQ bank counts');
  assert.equal(counts.length,6,'five released banks plus partial Unit 6 Topic 6.1 bank');
 assert.equal(counts.slice(0,5).reduce((a,b)=>a+b,0),1690);
  assert.equal(counts[5],234,'Unit6 partial 234-item bank does not release full unit');
 const css=read('shared/print-watermark-v70.css');
 assert.ok(css.includes('font-family:"Times New Roman",Times,"Liberation Serif",Georgia,serif!important'));
 assert.ok(css.includes('position:fixed!important')&&css.includes('transform:rotate'));
 assert.ok(read('portal/pdf-report.js').includes("href+'?v=71'"));
 assert.ok(read('practice-engine/index.html').includes('print-watermark-v70.css?v=71'));
 // The three dependent imports must stay on the SAME current version.
 // The V71 regression must not pin V72 after intentionally published releases.
 const hubVersion=Number(read('portal/learning-hub.js').match(/learning-catalog[.]json[?]v=([0-9]+)/)?.[1]||0);
 const appVersion=Number(read('portal/app.js').match(/learning-hub[.]js[?]v=([0-9]+)/)?.[1]||0);
 const shellVersion=Number(read('portal/index.html').match(/app[.]js[?]v=([0-9]+)/)?.[1]||0);
 assert.ok(hubVersion>=72,'linked Learning Hub catalog must not revert to stale pre-V72 cache');
 assert.equal(appVersion,hubVersion,'app imports current learning-hub version');
 assert.equal(shellVersion,appVersion,'portal shell imports current app version');
 assert.ok(read('quality/grade11-v71-google-sites-migration-unit06-10-intake.md')
  .includes('Grade11_Unit6_COMPLETE_MASTER_ALL.pdf'));
 console.log('PASS V71 catalog: 59 unchanged entries, Study/Explore native, 31 simulations, 1,690 MCQs, Units6–10 unpublished and Times watermarks');
}
async function main(){
 audit();
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1320,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'student-guide.html',{waitUntil:'networkidle'});
  await page.locator('#psn-global-nav .psn-nav-menu-button').click();
  await page.waitForFunction(()=>document.querySelectorAll('#psn-resource-drawer .psn-drawer-unit').length===5);
  const unit=page.locator('[data-psn-unit="1"]');
  await unit.locator(':scope > summary').click();
  const study=unit.locator('[data-psn-category="STUDY"]');
  await study.locator('summary').click();
  const link=study.locator('a').filter({hasText:'Start Studying'});
  assert.equal(await link.count(),1);
  assert.equal(await link.getAttribute('href'),base+'portal/unit-01.html');
  const explore=unit.locator('[data-psn-category="EXPLORE"]');
  await explore.locator('summary').click();
  const simulation=explore.locator('a').filter({hasText:'Simulation Library'});
  assert.equal(await simulation.count(),1);
  assert.equal(await simulation.getAttribute('href'),base+'portal/simulations.html');
  await page.screenshot({path:path.join(qa,'unit1-native-study-explore-drawer.png'),fullPage:false});
  await page.keyboard.press('Escape');
  await page.goto(base+'portal/unit-01.html',{waitUntil:'domcontentloaded'});
  assert.match(await page.title(),/Unit 1|Physics/);
  await page.goto(base+'portal/simulations.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelectorAll('#cards .card').length===31);
  assert.equal(await page.locator('#cards .card').count(),31);
  await page.setViewportSize({width:390,height:844});
  const dims=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(dims[1]<=dims[0]+2,'390px mobile simulation library must not overflow');
  // Confirm actual print-media font choice used on the review watermark,
  // without requiring a copyrighted font to be installed in Linux CI.
  await page.goto(base+'practice-engine/index.html?unit=1',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.psn-print-watermark',{state:'attached'});
  assert.equal(await page.locator('.psn-print-watermark').isHidden(),true,'screen hides print-only watermark');
  await page.emulateMedia({media:'print'});
  const style=await page.locator('.psn-print-watermark').evaluate(el=>{
   const c=getComputedStyle(el);return {family:c.fontFamily,visible:c.display,position:c.position};
  });
  assert.match(style.family,/Times New Roman/);
  assert.equal(style.visible,'flex');assert.equal(style.position,'fixed');
  assert.deepEqual(errors,[]);
  console.log('PASS V71 Chromium: actual Unit1 native Study/Explore drawer URLs, 31 models, 390px mobile, print-only Times serif watermark');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(err=>{console.error('FAIL V71 navigation/type QA',err);server.close();process.exitCode=1;});
