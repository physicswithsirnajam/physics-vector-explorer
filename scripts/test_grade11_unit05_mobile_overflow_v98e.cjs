#!/usr/bin/env node
'use strict';
/* V98-E — targeted Unit 5 responsive source/browser regression.
 * Reproduces and diagnoses existing mobile overflow without touching any
 * other learning page, physics computations, teacher materials or private data. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts','unit05-mobile-v98e');
const originalFingerprint=770261505;
const allowedCssPatch='@media(max-width:700px){.source em{overflow-wrap:anywhere}}';
function fnv(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h;}
function staticAudit(){
 const source=fs.readFileSync(path.join(root,'portal/unit-05.html'),'utf8');
 /* V214 adds only a clearly delimited source-bound find-by-section
  * navigation block. Strip that exact new block before rechecking the
  * original V98-E page-source fingerprint. No new baseline fingerprint,
  * weakened science assertion or broad HTML normalization is permitted. */
 const begin='<h2>Find worked examples and descriptive practice by section</h2>';
 const end='<div class="grid">\\n<article class="card"><span class="tag">V48 · Source-Mapped Notes</span>';
 const start=source.indexOf(begin), stop=source.indexOf(end,start+begin.length);
 assert.ok(start>0&&stop>start,'V214 navigation boundaries must be present and uniquely ordered');
 assert.equal(source.indexOf(begin,start+begin.length),-1,'V214 navigation block must not be duplicated');
 const added=source.slice(start,stop);
 for(const destination of [
  './unit-05-work-study.html#example51',
  './unit-05-work-study.html#resistance',
  './unit-05-descriptive-student.html#shortTitle',
  './unit-05-descriptive-student.html#longTitle'
 ]){
  assert.equal(added.split('href="'+destination+'"').length-1,1,
   'V214 must contain one correct public study/practice destination '+destination);
 }
 assert.ok(added.includes('id="unit5-source-practice-finders"'));
 assert.ok(added.includes('id="unit5-exercise-mapping-status"'));
 assert.ok(added.includes('Original NBF exercise mapping:'));
 assert.ok(added.includes('349 central Unit 5 practice MCQs remain provisional'));
 assert.ok(!/<script\\b|<form\\b|<input\\b|onclick=|data-user-id=/i.test(added),
  'V214 source map must not introduce scripts, forms or user-data collection');
 const restored=(
  source.slice(0,start)+source.slice(stop)
 ).replace('\\n'+allowedCssPatch,'');
 assert.equal(fnv(restored),originalFingerprint,
  'Unit 5 science, instructions, assessment and original markup must match exactly after removing only the approved V214 finder block and V98-E CSS patch');
 const logo=path.join(root,'portal/assets/physics-with-sir-najam-official-logo.png');
 assert.ok(fs.existsSync(logo),'the original logo asset must exist');
 assert.ok(source.includes('physics-with-sir-najam-official-logo.png'),'the official image stays on Unit 5 desk');
 assert.ok(source.includes('unit-05-work-energy-lab.html'),'original interactive lab link remains');
 console.log('V98-E source PASS: Unit 5 remains exactly identical except any approved scoped mobile CSS rule.');
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.png':'image/png','.json':'application/json; charset=utf-8',
 '.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const full=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!full.startsWith(root+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile())throw Error('not found');
  res.writeHead(200,{'Content-Type':mime[path.extname(full)]||'application/octet-stream'});
  fs.createReadStream(full).pipe(res);
 }catch{res.writeHead(404);res.end('not found');}
});
async function browserAudit(){
 fs.mkdirSync(out,{recursive:true});
 await new Promise((ok,fail)=>server.listen(0,'127.0.0.1',err=>err?fail(err):ok()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.goto(origin+'/portal/unit-05.html',{waitUntil:'domcontentloaded'});
  const logo=page.locator('header .brand img[src="./assets/physics-with-sir-najam-official-logo.png"]');
  await logo.waitFor({state:'visible'});
  assert.equal(await logo.evaluate(img=>img.complete&&img.naturalWidth>0),true,'exact original logo loaded');
  const results=[];
  for(const width of [390,320,768,1280]){
   await page.setViewportSize({width,height:844});
   await page.waitForTimeout(80);
   const state=await page.evaluate(()=>{
    const viewport=document.documentElement.clientWidth;
    const offenders=[...document.querySelectorAll('body *')].map(el=>{
     const rect=el.getBoundingClientRect();
     const computed=getComputedStyle(el);
     return {tag:el.tagName.toLowerCase(),className:typeof el.className==='string'?el.className:'',text:(el.textContent||'').trim().replace(/\s+/g,' ').slice(0,90),left:Math.round(rect.left),right:Math.round(rect.right),width:Math.round(rect.width),scrollWidth:el.scrollWidth,display:computed.display};
    }).filter(x=>x.width>0&&x.display!=='none'&&x.right>viewport+2).sort((a,b)=>b.right-a.right).slice(0,14);
    return {viewport,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,offenders};
   });
   results.push({width,...state});
   console.log('V98-E WIDTH DIAGNOSTIC',JSON.stringify({width,viewport:state.viewport,documentWidth:state.documentWidth,overflow:state.documentWidth>state.viewport+2,offenders:state.offenders}));
   await page.screenshot({path:path.join(out,'unit05-'+width+'px.png'),fullPage:false,animations:'disabled'});
  }
  fs.writeFileSync(path.join(out,'diagnostic.json'),JSON.stringify(results,null,2)+'\n');
  assert.deepEqual(errors,[],'Unit 5 page has no browser runtime errors');
  for(const result of results)assert.ok(result.documentWidth<=result.viewport+2,'Unit 5 overflow at '+result.width+'px; see the logged offending elements and diagnostic JSON');
  await page.locator('a[href="./unit-05-work-energy-lab.html"]').first().click();
  await page.waitForURL(url=>url.pathname.endsWith('/portal/unit-05-work-energy-lab.html'));
  assert.equal(await page.locator('#workTab').count(),1,'unit 5 interactive Work–Energy lab remains reachable');
  await page.locator('#kineticTab').click();
  assert.equal(await page.locator('#kineticTab').getAttribute('aria-selected'),'true','kinetic energy tab remains functional');
  console.log('V98-E PASS: Unit 5 at phone/tablet/projector widths has no horizontal scrolling and lab navigation remains functional.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
}
(async()=>{staticAudit();await browserAudit();})().catch(err=>{console.error('V98-E FAILED:',err);server.close();process.exitCode=1;});
