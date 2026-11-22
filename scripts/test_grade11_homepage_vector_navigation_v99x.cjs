#!/usr/bin/env node
'use strict';
/*
 * V99-X: real Chromium checks of the *static* homepage-to-portal navigation,
 * dedicated original Vector Explorer and its return links at both a
 * local domain root and a GitHub Pages-style repository subpath.
 *
 * No actual Firebase Auth, student record, internet request, domain change,
 * App Check, server deployment or credential is used.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'qa-artifacts/homepage-vector-v99x');
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const mime={
 '.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.png':'image/png','.svg':'image/svg+xml'
};
const server=http.createServer((req,res)=>{
 try{
  const requestPath=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  let p=requestPath;
  if(p==='/physics-vector-explorer')p='/';
  else if(p.startsWith('/physics-vector-explorer/'))
   p=p.slice('/physics-vector-explorer'.length);
  const target=path.resolve(ROOT,'.'+p);
  if(target!==ROOT&&!target.startsWith(ROOT+path.sep))throw Error('unsafe path');
  const full=fs.existsSync(target)&&fs.statSync(target).isDirectory()?
   path.join(target,'index.html'):target;
  if(!full.startsWith(ROOT+path.sep)||!fs.existsSync(full)||
     !fs.statSync(full).isFile())throw Error('not a file');
  res.writeHead(200,{
   'Content-Type':mime[path.extname(full)]||'application/octet-stream',
   'Cache-Control':'no-store'
  });
  fs.createReadStream(full).pipe(res);
 }catch{
  res.writeHead(404);res.end('not found');
 }
});
function auditSource(){
 const landing=read('index.html');
 assert.match(landing,/<title>Physics with Sir Najam — Learning Portal<\/title>/);
 assert.match(landing,/http-equiv="refresh" content="0; url=\.\/portal\/"/);
 assert.match(landing,/location\.replace\(new URL\('\.\/portal\/',document\.baseURI\)\.href\)/);
 assert.match(landing,/<a href="\.\/portal\/">Continue to the Learning Portal<\/a>/);
 assert.match(landing,/<a href="\.\/vector-explorer\.html">Open Vector Explorer<\/a>/);
 assert.ok(!landing.includes('id="tab-components"')&&!landing.includes('id="graph"'),
  'root page must no longer expose Vector Explorer as homepage');
 assert.ok(!/firebase-|appCheck|app-check|fetch\s*\(/i.test(landing),
  'public homepage redirect must not contact Firebase or remote services');

 const original=read('vector-explorer.html');
 for(const required of [
  'Vector Explorer 1.0','id="tab-components"','id="tab-dot"',
  'id="tab-cross"','id="mag-a"','id="graph"',
  'function pointerAngle(','function setTab(','window.print()',
  'shared/navigation.css?v=69','shared/navigation.js?v=69',
  'aria-label="Return to the Physics learning portal"',
  'portal/assets/physics-with-sir-najam-official-logo.png'
 ])assert.ok(original.includes(required),'Relocated original lab lost '+required);
 const catalog=JSON.parse(read('portal/simulation-catalog.json'));
 assert.equal(catalog.simulations.length,31,'preserve the original 31 simulations');
 const originals=catalog.simulations.filter(s=>s.title==='Vector Explorer');
 assert.equal(originals.length,1,'exactly one original Vector Explorer card');
 assert.equal(originals[0].file,'vector-explorer.html','update the catalog direct link');
 assert.ok(!catalog.simulations.some(s=>s.file==='index.html'),
  'the original lab library must never link to the landing redirect');
 const crosswalk=JSON.parse(read('quality/hssc-v73-31-simulation-link-crosswalk.json'));
 const raw=JSON.stringify(crosswalk);
 assert.ok(raw.includes('"repositoryFile":"vector-explorer.html"')||
  raw.includes('"repositoryFile": "vector-explorer.html"'),
  'historical source-to-repository crosswalk must point to the preserved lab');
 assert.ok(!raw.includes('"repositoryFile":"index.html"')&&
  !raw.includes('"repositoryFile": "index.html"'),
  'crosswalk must no longer send users to the site homepage');
 assert.ok(read('portal/index.html').includes('id="login-form"')&&
  read('portal/index.html').includes('id="learning-hub"'));
 assert.ok(read('practice-engine/index.html').includes('no report has been sent automatically.'));
 console.log('V99-X SOURCE PASS: root redirects to portal, original lab and 31 gallery entries preserved, historical mapping repaired; no Firebase changes.');
}
async function auditBrowser(){
 await new Promise((resolve,reject)=>
  server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  fs.mkdirSync(OUT,{recursive:true});
  for(const [label,prefix] of [
   ['domain-root',''],['github-pages-project','/physics-vector-explorer']
  ]){
   const context=await browser.newContext({
    viewport:{width:1280,height:850},
    reducedMotion:'reduce'
   });
   const page=await context.newPage();
   const portalPath=prefix+'/portal/';
   // Both a typed base URL and the explicit index.html must land in portal.
   for(const leaf of ['/', '/index.html']){
    await page.goto(origin+prefix+leaf,{waitUntil:'commit'});
    await page.waitForURL(url=>url.pathname===portalPath,{timeout:12000});
    assert.equal(new URL(page.url()).pathname,portalPath,
     label+' '+leaf+' must arrive at the actual portal path');
    await page.locator('#panel-login').waitFor({state:'attached'});
    assert.equal(await page.locator('h2').filter({hasText:'Sign in to your portal'}).count(),
     1,'portal login appears, no login bypass');
   }
   const sim=await context.newPage();
   const res=await sim.goto(origin+prefix+'/vector-explorer.html',{
    waitUntil:'domcontentloaded'
   });
   assert.equal(res.status(),200,'original vector lab must return 200 at new address');
   assert.equal(await sim.locator('#graph').count(),1,'original interactive graph exists');
   assert.equal(await sim.locator('#tab-dot').count(),1,'original dot-product tab exists');
   await sim.locator('#psn-global-nav').waitFor({state:'visible'});
   assert.equal(await sim.locator('#psn-global-nav').count(),1,
    'exactly one common portal navigation bar');
   const portalReturn=sim.locator('a[aria-label="Return to the Physics learning portal"]');
   assert.equal(await portalReturn.count(),1,'direct return link exists');
   assert.equal(new URL(await portalReturn.getAttribute('href'),sim.url()).pathname,
    portalPath,'return link stays inside the correct project base');
   const menu=sim.locator('#psn-global-nav .psn-nav-menu-button');
   await menu.click();
   assert.equal(await menu.getAttribute('aria-expanded'),'true',
    'global unit resource drawer opens');
   const drawer=sim.locator('#psn-resource-drawer');
   assert.equal(await drawer.isVisible(),true,'resource drawer visible');
   await sim.keyboard.press('Escape');
   assert.equal(await drawer.isHidden(),true,'resource drawer closes with Escape');
   const portalNav=sim.locator('#psn-global-nav .psn-nav-title');
   assert.equal(new URL(await portalNav.getAttribute('href'),sim.url()).pathname,
    portalPath,'official shared navigation brand returns to the dashboard');
   await sim.setViewportSize({width:390,height:844});
   const dims=await sim.evaluate(()=>[
    document.documentElement.clientWidth,document.documentElement.scrollWidth
   ]);
   assert.ok(dims[1]<=dims[0]+2,
    'no 390px mobile horizontal overflow: '+label+' '+JSON.stringify(dims));
   assert.equal(await portalReturn.isVisible(),true,'direct portal return is visible on mobile');
   assert.equal(await sim.locator('#graph').getAttribute('viewBox'),
    '95 8 530 492','the original vector mobile graph remains responsive');
   if(label==='github-pages-project')
    await sim.screenshot({path:path.join(OUT,'vector-with-portal-return-mobile.png'),
     fullPage:false});
   await portalReturn.click();
   await sim.waitForURL(url=>url.pathname===portalPath);
   await sim.locator('#panel-login').waitFor({state:'attached'});
   assert.equal(new URL(sim.url()).pathname,portalPath,
    'real navigation via direct portal return succeeds');

   // The gallery must keep 31 cards and point to the real Vector lab, never
   // the public landing redirect.
   const library=await context.newPage();
   await library.goto(origin+prefix+'/portal/simulations.html',{
    waitUntil:'domcontentloaded'
   });
   await library.locator('#cards .card').first().waitFor({timeout:12000});
   assert.equal(await library.locator('#cards .card').count(),31,
    'all original simulation cards remain available');
   const card=library.locator('#cards .card').filter({hasText:'Vector Explorer'});
   assert.equal(await card.count(),1,'one vector card in the curated library');
   const href=await card.locator('a').first().getAttribute('href');
   assert.equal(new URL(href,library.url()).pathname,prefix+'/vector-explorer.html',
    'Vector Explorer card opens preserved model, not portal redirect');
   await context.close();
   console.log('V99-X BROWSER PASS: '+label+
    ' root redirect, explicit index redirect, original lab/drawer, mobile and 31-card gallery');
  }
  const noJs=await browser.newContext({javaScriptEnabled:false});
  const page=await noJs.newPage();
  await page.goto(origin+'/physics-vector-explorer/index.html',{waitUntil:'commit'});
  await page.waitForURL(url=>url.pathname==='/physics-vector-explorer/portal/',
   {timeout:12000});
  assert.equal(new URL(page.url()).pathname,
   '/physics-vector-explorer/portal/','meta-refresh fallback without JavaScript');
  await noJs.close();
  console.log('V99-X FINISHED: real Chromium redirect works with/without JS; vector model navigation preserved at project path.');
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
}
(async()=>{auditSource();await auditBrowser();})().catch(e=>{
 console.error('V99-X FAILED:',e);
 if(server.listening)server.close();
 process.exitCode=1;
});
