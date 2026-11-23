#!/usr/bin/env node
'use strict';
/* V97-C: official branding integration on five more original Grade XI simulations.
 * Source fingerprints guarantee physics, tests, graphs, scripts and calculations remain byte-for-byte identical
 * after removing the two new stylesheet/script reference lines.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const cssTag='<link rel="stylesheet" href="shared/standalone-brand-v97a.css?v=97a">';
const jsTag='<script src="shared/standalone-brand-v97a.js?v=97a"></script>';
const labs=[
 ['gravitational-waves-interferometer.html',1627750608,'#binaryCanvas'],
 ['heat-engine-carnot.html',3986182666,'#engineCanvas'],
 ['ideal-gas-kinetic-theory.html',2158428700,'#chamber'],
 ['motion-graphs.html',2716588060,'#roadCanvas'],
 ['polarization-malus-law.html',525909954,'#mainCanvas']
];
const links=[
 ['All Simulations','/portal/simulations.html'],
 ['Learning Hub','/portal/#learning-hub'],
 ['Student Guide','/student-guide.html']
];
function fnv(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h;}
function staticAudit(){
 const js=read('shared/standalone-brand-v97a.js');
 const css=read('shared/standalone-brand-v97a.css');
 assert.ok(js.includes("new URL('../',script.src)"),'branding must support project-path and custom-domain GitHub Pages');
 assert.ok(js.includes("new URL('portal/assets/physics-with-sir-najam-official-logo.png',root)"),'exact original official image required');
 assert.ok(!/localStorage|sessionStorage|fetch\s*\(|firestore|firebase|indexedDB/i.test(js),'display-only branding must not access accounts or records');
 assert.ok(css.includes(':focus-visible') && css.includes('@media print') && css.includes('max-width:690px'),'keyboard, print and mobile styling required');
 assert.ok(fs.statSync(path.join(root,'portal/assets/physics-with-sir-najam-official-logo.png')).size>1000,'official logo must exist');
 for(const [file,fingerprint] of labs){
  const html=read(file);
  assert.equal(html.split(cssTag).length,2,'one style reference '+file);
  assert.equal(html.split(jsTag).length,2,'one script reference '+file);
  assert.ok(html.indexOf(cssTag)<html.indexOf('</head>'),'style in head '+file);
  assert.ok(html.indexOf(jsTag)<html.lastIndexOf('</body>'),'script before end body '+file);
  const v112Tag='<script src="shared/sitewide-science-print-v112.js?v=112" defer></script>';
  assert.equal(html.split(v112Tag).length,2,'one V112 print/math integration on '+file);
  const original=html.replace(v112Tag+'\n','').replace(' '+cssTag+'\n','').replace(' '+jsTag+'\n','');
  assert.equal(fnv(original),fingerprint,'Original lab science changed beyond additive V97/V112 tags '+file);
 }
 assert.ok(read('portal/simulations.html').includes('id="unit"'));
 assert.ok(read('portal/index.html').includes('id="learning-hub"'));
 console.log('V97-C static PASS: five untouched original laboratory source fingerprints, official logo, shared path-safe assets and correct navigation targets.');
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())throw Error('Not found');
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(404);res.end('Not found');}
});
async function browserAudit(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 let browser;
 const out=path.join(root,'qa-artifacts','standalone-brand-v97c');
 fs.mkdirSync(out,{recursive:true});
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const page=await browser.newPage({viewport:{width:1280,height:820},reducedMotion:'reduce'});
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(e.message));
  const nav='#psn-standalone-brand-v97a';
  for(let i=0;i<labs.length;i++){
   const [file,,control]=labs[i];
   const response=await page.goto(origin+'/'+file,{waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200,'source page loads '+file);
   await page.locator(nav).waitFor({state:'visible'});
   assert.equal(await page.locator(nav).count(),1,'exactly one official brand bar '+file);
   const img=page.locator(nav+' img.psn-standalone-brand-logo');
   assert.equal(await img.count(),1,'one actual official logo '+file);
   assert.equal(await img.getAttribute('src'),origin+'/portal/assets/physics-with-sir-najam-official-logo.png');
   assert.equal(await img.getAttribute('alt'),'Physics with Sir Najam official logo');
   await page.waitForFunction(()=>{const image=document.querySelector('#psn-standalone-brand-v97a img.psn-standalone-brand-logo');return !!(image&&image.complete&&image.naturalWidth>0);});
   assert.equal(await page.locator(nav+' .psn-standalone-brand-title').innerText(),'PHYSICS WITH SIR NAJAM');
   assert.equal(await page.locator(nav).getAttribute('aria-label'),'Physics with Sir Najam laboratory navigation');
   const actual=await page.locator(nav+' a').evaluateAll(as=>as.map(a=>({name:a.textContent,url:a.href,target:a.getAttribute('target')})));
   assert.equal(actual.length,3,'three same-tab portal links '+file);
   for(let k=0;k<links.length;k++){
    assert.equal(actual[k].name,links[k][0]);
    assert.equal(actual[k].url,origin+links[k][1]);
    assert.equal(actual[k].target,null);
   }
   assert.ok(await page.locator('h1').count()>0,'original experiment title preserved '+file);
   assert.ok(await page.locator(control).count()>0,'original science control/stage exists '+file);
   if(i===0)await page.screenshot({path:path.join(out,'batch3-desktop.png'),fullPage:false});
   await page.setViewportSize({width:390,height:844});
   assert.equal(await img.isVisible(),true,'real original logo visible on phone '+file);
   assert.ok((await img.boundingBox()).width<=40,'compact logo on phone '+file);
   for(const a of await page.locator(nav+' a').all())assert.equal(await a.isVisible(),true,'link accessible on mobile '+file);
   const width=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
   assert.ok(width[1]<=width[0]+2,'phone overflow '+file+' '+width.join('/'));
   if(i===0||i===labs.length-1)await page.screenshot({path:path.join(out,i===0?'batch3-gravitational-mobile.png':'batch3-polarization-mobile.png'),fullPage:false});
   await page.setViewportSize({width:1280,height:820});
  }
  await page.goto(origin+'/motion-graphs.html',{waitUntil:'domcontentloaded'});
  await page.locator(nav).getByRole('link',{name:'All Simulations'}).click();
  await page.waitForURL(url=>url.pathname.endsWith('/portal/simulations.html'));
  await page.locator('main').waitFor();
  assert.deepEqual(pageErrors,[],'no new runtime exceptions on branded lab pages');
  console.log('V97-C browser PASS: original official logo displays on five gravitational, thermodynamic, gas, motion and light labs; original stages remain, links operate, mobile is usable, screenshots archived.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
async function main(){staticAudit();await browserAudit();}
main().catch(err=>{console.error('V97-C FAILED',err);server.close();process.exitCode=1;});
