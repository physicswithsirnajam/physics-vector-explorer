#!/usr/bin/env node
'use strict';
/* V97-A official-brand integration regression for five original Grade XI labs.
 * Preserves complete original lab files excluding ONLY the two shared asset tags.
 * No login, Firebase access, student data, or course releases involved. */
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
 ['centrifuge-applications.html',3448834472,'#rpm'],
 ['circular-motion.html',2713157109,'#orbit'],
 ['collisions-lab.html',4108118143,'#playBtn'],
 ['coulomb-vector-lab.html',3377425984,'#chargeControls'],
 ['crystal-structure-explorer.html',1855522681,'#structureCanvas']
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
 assert.ok(js.includes("new URL('../',script.src)"),'must work at project and custom-domain roots');
 assert.ok(js.includes("new URL('portal/assets/physics-with-sir-najam-official-logo.png',root)"),'use unchanged original logo');
 assert.ok(js.includes("aria-label','Physics with Sir Najam laboratory navigation'"));
 assert.ok(!/localStorage|sessionStorage|fetch\s*\(|firestore|firebase|indexedDB/i.test(js),'brand component must not access records or data');
 assert.ok(css.includes(':focus-visible'),'keyboard visible focus required');
 assert.ok(css.includes('@media print'),'bar should not appear in print');
 assert.ok(css.includes('max-width:690px'),'phone styling required');
 assert.ok(fs.statSync(path.join(root,'portal/assets/physics-with-sir-najam-official-logo.png')).size>1000,'official original logo asset required');
 for(const [file,fingerprint] of labs){
  const html=read(file);
  assert.equal(html.split(cssTag).length,2,'exactly one stylesheet on '+file);
  assert.equal(html.split(jsTag).length,2,'exactly one script on '+file);
  assert.ok(html.indexOf(cssTag)<html.indexOf('</head>'),'stylesheet in head '+file);
  assert.ok(html.indexOf(jsTag)<html.lastIndexOf('</body>'),'script at end '+file);
  const v112Tag='<script src="shared/sitewide-science-print-v112.js?v=112" defer></script>';
  assert.equal(html.split(v112Tag).length,2,'one V112 presentation-only print/notation reference '+file);
  const original=html.replace(v112Tag+'\n','').replace(' '+cssTag+'\n','').replace(' '+jsTag+'\n','');
  assert.equal(fnv(original),fingerprint,'Original physics HTML changed beyond additive V97/V112 presentation references '+file);
 }
 assert.ok(read('portal/index.html').includes('id="learning-hub"'));
 assert.ok(read('portal/simulations.html').includes('id="unit"'));
 console.log('V97-A static PASS: exact official logo, 5 source-science fingerprints unchanged, three real portal destinations, print/mobile/keyboard safeguards.');
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
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
 const out=path.join(root,'qa-artifacts','standalone-brand-v97a');
 fs.mkdirSync(out,{recursive:true});
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const page=await browser.newPage({viewport:{width:1280,height:820}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const nav='#psn-standalone-brand-v97a';
  for(let i=0;i<labs.length;i++){
   const [file,,control]=labs[i];
   const response=await page.goto(origin+'/'+file,{waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200,'page loads '+file);
   await page.locator(nav).waitFor({state:'visible'});
   assert.equal(await page.locator(nav).count(),1,'one shared branded bar on '+file);
   const img=page.locator(nav+' img.psn-standalone-brand-logo');
   assert.equal(await img.count(),1,'exactly one official logo in bar '+file);
   assert.equal(await img.getAttribute('src'),origin+'/portal/assets/physics-with-sir-najam-official-logo.png');
   assert.equal(await img.getAttribute('alt'),'Physics with Sir Najam official logo');
   await page.waitForFunction(()=>{const img=document.querySelector('#psn-standalone-brand-v97a img.psn-standalone-brand-logo');return !!(img&&img.complete&&img.naturalWidth>0);});
   assert.equal(await page.locator(nav+' .psn-standalone-brand-title').innerText(),'PHYSICS WITH SIR NAJAM');
   assert.equal(await page.locator(nav).getAttribute('aria-label'),'Physics with Sir Najam laboratory navigation');
   const actual=await page.locator(nav+' a').evaluateAll(as=>as.map(a=>({name:a.textContent,url:a.href,target:a.getAttribute('target')})));
   assert.equal(actual.length,3,'three same-tab links '+file);
   for(let k=0;k<links.length;k++){
    assert.equal(actual[k].name,links[k][0]);
    assert.equal(actual[k].url,origin+links[k][1]);
    assert.equal(actual[k].target,null,'link must not open extra tab');
   }
   assert.ok(await page.locator('h1').count()>0,'original lab title '+file);
   assert.ok(await page.locator(control).count()>0,'original active lab control '+file);
   if(i===0)await page.screenshot({path:path.join(out,'brand-batch1-desktop.png'),fullPage:false});
   await page.setViewportSize({width:390,height:844});
   assert.equal(await img.isVisible(),true,'official logo visible on mobile '+file);
   assert.ok((await img.boundingBox()).width<=40,'logo must remain compact on mobile '+file);
   for(const a of await page.locator(nav+' a').all())assert.equal(await a.isVisible(),true,'navigation visible on phone '+file);
   const width=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
   assert.ok(width[1]<=width[0]+2,'mobile overflow '+file+' '+width);
   if(i===0||i===labs.length-1)await page.screenshot({path:path.join(out,'brand-'+(i===0?'unit4':'unit7')+'-mobile.png'),fullPage:false});
   await page.setViewportSize({width:1280,height:820});
  }
  await page.goto(origin+'/circular-motion.html',{waitUntil:'domcontentloaded'});
  await page.locator(nav).getByRole('link',{name:'All Simulations'}).click();
  await page.waitForURL(url=>url.pathname.endsWith('/portal/simulations.html'));
  await page.locator('main').waitFor();
  assert.deepEqual(errors,[],'brand integration must not introduce page exceptions');
  console.log('V97-A browser PASS: five original lab pages, exact logo loaded, all 3 links, real library route, original controls, desktop and 390px phone layout.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
async function main(){staticAudit();await browserAudit();}
main().catch(err=>{console.error('V97-A FAILED',err);server.close();process.exitCode=1;});
