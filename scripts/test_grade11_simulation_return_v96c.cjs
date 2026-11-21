#!/usr/bin/env node
'use strict';
/* V96-C: original five Unit 6 simulation model code is untouched. Tests the
 * runtime return bar using the actual public HTML with a local static server.
 * No student accounts, cookies, Firebase writes, or private data are involved. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const labs=[
 ['archimedes-flotation.html',0x4893744c],
 ['viscosity-terminal-velocity.html',0xc5ffcc6a],
 ['continuity-fluid-flow.html',0x14dbded1],
 ['bernoulli-venturi.html',0xce364515],
 ['superfluidity-explorer.html',0x1d1fb3e7]
];
const cssTag='<link rel="stylesheet" href="shared/simulation-return-v96c.css?v=96c">';
const jsTag='<script src="shared/simulation-return-v96c.js?v=96c"></script>';
const targets=[
 ['Unit 6 Learning Desk','/portal/unit-06-learning-desk-v95a.html'],
 ['Unit 6 Simulations','/portal/simulations.html?unit=6'],
 ['Learning Hub','/portal/#learning-hub'],
 ['Dashboard','/portal/#student-top']
];
function fnv(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h;}
function staticAudit(){
 const css=read('shared/simulation-return-v96c.css');
 const js=read('shared/simulation-return-v96c.js');
 assert.ok(css.includes('@media(max-width:690px)'), 'narrow-screen rules required');
 assert.ok(css.includes('@media print'), 'hide navigation in prints');
 assert.ok(css.includes(':focus-visible'), 'keyboard focus must be visible');
 assert.ok(js.includes("new URL('../',script.src)"),'project-path-safe relative links required');
 assert.ok(js.includes("aria-label','Return to Unit 6 and learning portal'"));
 assert.ok(!/localStorage|sessionStorage|fetch\s*\(|auth\.|database|firestore/i.test(js),'navigation must not read or write accounts');
 assert.ok(read('portal/simulations.html').includes('id="unit"'));
 assert.ok(read('portal/index.html').includes('id="learning-hub"'));
 assert.ok(read('portal/index.html').includes('id="student-top"'));
 assert.ok(read('portal/unit-06-learning-desk-v95a.html').includes('Unit 6'));
 const manifest=JSON.parse(read('question-bank/manifest.json'));
 const u=manifest.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 const course=JSON.parse(read('portal/learning-catalog.json')).grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(u.liveMcqCount,560);
 assert.equal(u.perQuestionSloVerified,false);
 assert.equal(u.exactFbiseModeReady,false);
 assert.equal(course.status,'planned');
 assert.equal(course.assessmentStatus,'not-published');
 assert.equal(course.practicePreviewStatus,'public-provisional');
 assert.equal(JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json')).releaseApproved,false);
 for(const [name,fingerprint] of labs){
  const html=read(name);
  assert.equal(html.split(cssTag).length,2,'one stylesheet tag in '+name);
  assert.equal(html.split(jsTag).length,2,'one script tag in '+name);
  assert.ok(html.indexOf(cssTag)<html.indexOf('</head>'),'CSS must load in head '+name);
  assert.ok(html.indexOf(jsTag)<html.indexOf('</body>'),'Script must load at end '+name);
  assert.equal(fnv(html.replace(cssTag,'').replace(jsTag,'')),fingerprint,'Original lab HTML/science changed '+name);
 }
 const catalog=JSON.parse(read('portal/simulation-catalog.json'));
 const unit6= catalog.simulations.filter(x=>x.unit===6).map(x=>x.file).sort();
 assert.deepEqual(unit6,labs.map(x=>x[0]).sort(),'All five catalog Unit6 models should have bar');
 console.log('V96-C static PASS: five original lab fingerprints unchanged; exact targets; safe relative navigation and formal release gates closed.');
}
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const dest=path.resolve(root,'.'+pathname);
  if(!dest.startsWith(root+path.sep)||!fs.existsSync(dest)||!fs.statSync(dest).isFile())throw Error('Not found');
  res.writeHead(200,{'Content-Type':MIME[path.extname(dest)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(dest).pipe(res);
 }catch{res.writeHead(404);res.end('Not found')}
});
async function browserAudit(){
 await new Promise((ok,fail)=>server.listen(0,'127.0.0.1',err=>err?fail(err):ok()));
 let browser;
 const screenshots=path.join(root,'qa-artifacts','unit06-sim-return-v96c');
 fs.mkdirSync(screenshots,{recursive:true});
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const page=await browser.newPage({viewport:{width:1280,height:820}});
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  const nav='#psn-simulation-return-nav';
  for(let i=0;i<labs.length;i++){
   const [file]=labs[i];
   const response=await page.goto(origin+'/'+file,{waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200,'Simulation source should resolve '+file);
   await page.locator(nav).waitFor({state:'visible'});
   assert.equal(await page.locator(nav).count(),1,'Only one return bar');
   assert.equal(await page.locator(nav+' a').count(),4,'All four links');
   assert.equal(await page.locator(nav).getAttribute('aria-label'),'Return to Unit 6 and learning portal');
   const items=await page.locator(nav+' a').evaluateAll(as=>as.map(a=>({text:a.textContent,href:a.href,target:a.getAttribute('target')})));
   for(let k=0;k<targets.length;k++){
    assert.equal(items[k].text,targets[k][0]);
    assert.equal(items[k].href,origin+targets[k][1]);
    assert.equal(items[k].target,null,'Links should navigate in current tab');
   }
   assert.equal(await page.locator('h1').count()>0,true,'Original simulation heading remains');
   if(i===0)await page.screenshot({path:path.join(screenshots,'unit6-navigation-desktop.png'),fullPage:false});
   await page.setViewportSize({width:390,height:844});
   const size=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.client+2,file+' causes mobile horizontal overflow '+JSON.stringify(size));
   for(const a of await page.locator(nav+' a').all())assert.equal(await a.isVisible(),true,'All 4 links visible on mobile');
   if(i===0)await page.screenshot({path:path.join(screenshots,'unit6-navigation-mobile.png'),fullPage:false});
   await page.setViewportSize({width:1280,height:820});
  }
  await page.goto(origin+'/archimedes-flotation.html',{waitUntil:'domcontentloaded'});
  await page.getByRole('link',{name:'Unit 6 Learning Desk'}).click();
  await page.waitForURL(url=>url.pathname.endsWith('/portal/unit-06-learning-desk-v95a.html'));
  assert.ok((await page.locator('body').innerText()).includes('Unit 6'),'Learning Desk should load in same tab');
  await page.goto(origin+'/archimedes-flotation.html',{waitUntil:'domcontentloaded'});
  await page.getByRole('link',{name:'Unit 6 Simulations'}).click();
  await page.waitForURL(url=>url.pathname==='/portal/simulations.html'&&url.searchParams.get('unit')==='6');
  await page.locator('main').waitFor();
  await page.waitForFunction(()=>document.getElementById('unit')?.value==='6');
  assert.equal(await page.locator('#unit').inputValue(),'6','Simulation library should open prefiltered to Unit6');
  // This is a PUBLIC library. Hub/Dashboard targets intentionally go to the
  // existing portal sign-in shell; we do not bypass authentication in tests.
  assert.deepEqual(pageErrors,[],'Lab navigation must not introduce JavaScript exceptions');
  console.log('V96-C browser PASS: 5/5 originals, four accessible same-tab links, 390px mobile no overflow, real Unit6 desk/library routes and unchanged lab UIs.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
}
async function main(){staticAudit();await browserAudit()}
main().catch(err=>{console.error('V96-C FAILED',err);server.close();process.exitCode=1});
