#!/usr/bin/env node
'use strict';
/* V98-P: diagnose and correct original Notes & Concept Videos directory
 * document overflow at 320px and 390px, without changing original PDFs,
 * YouTube references, learning material, branding or page print behavior.
 * Local repository HTTP server only; do not navigate to external hosts.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'qa-artifacts','original-resources-mobile-v98p');
const originalSourceFNV=3496041848;
const approvedCss='@media screen and (max-width:620px){#pdf-cards .card h3{overflow-wrap:anywhere}}';
function fnv(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h;}
function sourceGate(){
 const html=fs.readFileSync(path.join(root,'portal/legacy-hssc-resources.html'),'utf8');
 const baseline=html.replace('\n'+approvedCss,'');
 assert.equal(fnv(baseline),originalSourceFNV,'All original Notes/Video directory HTML and JS must remain byte-for-byte intact except one approved mobile screen CSS rule');
 assert.ok(html.includes('physics-with-sir-najam-official-logo.png'),'original logo preserved');
 assert.ok(html.includes('hssc-concept-videos-v74.json')&&html.includes('legacy-hssc-resources-v73.json'),'both original resource catalogs retained');
 console.log('V98-P SOURCE PASS: original HTML, catalog URLs, notes/video content and logo unchanged apart from a permitted mobile rule.');
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
 '.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
function localPath(raw){
 let p=decodeURIComponent(new URL(raw,'http://localhost').pathname);
 if(p.startsWith('/physics-vector-explorer/'))p=p.slice('/physics-vector-explorer'.length);
 if(p.endsWith('/'))p+='index.html';
 const full=path.resolve(root,'.'+p);
 return full.startsWith(root+path.sep)?full:null;
}
const server=http.createServer((req,res)=>{
 const file=localPath(req.url);
 if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){
  res.writeHead(404,{'Content-Type':'text/plain'});res.end('not found');return;
 }
 res.writeHead(200,{'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});
 fs.createReadStream(file).pipe(res);
});
async function main(){
 sourceGate();fs.mkdirSync(output,{recursive:true});
 await new Promise((ok,fail)=>server.listen(0,'127.0.0.1',e=>e?fail(e):ok()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'});
  const errors=[],missing=[];
  page.on('pageerror',e=>errors.push(String(e.message)));
  page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)missing.push(r.status()+' '+r.url().slice(origin.length));});
  const res=await page.goto(origin+'/portal/legacy-hssc-resources.html',{waitUntil:'domcontentloaded'});
  assert.equal(res.status(),200,'source-local directory loads');
  assert.match(await page.title(),/Original Notes & Concept Videos.*Physics with Sir Najam/);
  const img=page.locator('header .brand img[src*="physics-with-sir-najam-official-logo.png"]');
  await img.waitFor({state:'visible'});
  assert.equal(await img.evaluate(e=>e.complete&&e.naturalWidth>0),true,'exact official logo loads');
  assert.ok((await img.getAttribute('alt')).includes('Physics with Sir Najam'),'original official logo alternative text');
  await page.waitForFunction(()=>/source entries shown/.test(document.querySelector('#loading')?.textContent||''),null,{timeout:16000});
  assert.ok(Number(await page.locator('#youtube-count').innerText())>0,'original teacher-supplied YouTube catalog populated');
  const originalCounts=await page.evaluate(()=>Object.fromEntries(['pdf-count','youtube-count','video-count','extra-count'].map(id=>[id,document.getElementById(id).textContent])));
  const widths=[320,375,390,540,620,768,1280],results=[];
  for(const width of widths){
   await page.setViewportSize({width,height:width===1280?850:844});
   await page.waitForTimeout(100);
   const state=await page.evaluate(()=>{
    const vw=document.documentElement.clientWidth,doc=document.documentElement.scrollWidth;
    const primary=['header','.inner','main','.controls','.controls>div','.controls select','.controls input','.cards','.card','#youtube-cards','.legacy-details','footer'];
    const key=primary.map(selector=>{
     const e=document.querySelector(selector);
     if(!e)return null;
     const b=e.getBoundingClientRect(),c=getComputedStyle(e);
     return {selector,tag:e.tagName,left:Math.round(b.left),right:Math.round(b.right),width:Math.round(b.width),
      client:e.clientWidth,scroll:e.scrollWidth,overflowX:c.overflowX,gridColumns:c.gridTemplateColumns};
    }).filter(Boolean);
    const offending=[...document.querySelectorAll('body *')].map(e=>{
     const b=e.getBoundingClientRect(),c=getComputedStyle(e);
     return {tag:e.tagName.toLowerCase(),id:e.id,className:typeof e.className==='string'?e.className:'',
      text:(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,105),
      left:Math.round(b.left),right:Math.round(b.right),client:e.clientWidth,scroll:e.scrollWidth,overflowX:c.overflowX};
    }).filter(x=>(x.right>vw+2&&x.left<vw)||x.scroll>x.client+2)
       .sort((a,b)=>Math.max(b.right,b.left+b.scroll)-Math.max(a.right,a.left+a.scroll)).slice(0,28);
    return {viewport:vw,documentWidth:doc,overflow:doc>vw+2,key,offending};
   });
   results.push({requestedWidth:width,...state});
   console.log('V98-P LAYOUT',JSON.stringify({width,viewport:state.viewport,documentWidth:state.documentWidth,overflow:state.overflow,
     key:state.key,offending:state.offending.slice(0,12)}));
   await page.screenshot({path:path.join(output,'original-notes-videos-'+width+'px.png'),fullPage:false,animations:'disabled'});
  }
  const cards=page.locator('#pdf-cards .card, #youtube-cards .card, #video-cards .card, #extra-cards .card');
  await page.locator('#unit').selectOption('2');
  const unitCount=await cards.count();
  assert.ok(unitCount>0,'Unit 2 resources remain discoverable');
  assert.ok((await cards.evaluateAll(es=>es.map(e=>e.dataset.unit))).every(x=>x==='2'),'filter shows only selected unit');
  await page.locator('#search').fill('never-exists-v98p-phrase');
  assert.equal(await cards.count(),0,'filter can display zero results');
  await page.locator('#search').fill('');
  assert.equal(await cards.count(),unitCount,'clear query restores original unit entries');
  assert.deepEqual(errors,[],'no JavaScript browser exceptions on directory page');
  assert.deepEqual(missing,[],'no missing local resources');
  fs.writeFileSync(path.join(output,'diagnostic.json'),JSON.stringify({originalCounts,results,unit2Resources:unitCount,errors,missing},null,2)+'\n');
  for(const result of results)assert.equal(result.overflow,false,
   'document overflow at '+result.requestedWidth+'px (document '+result.documentWidth+'px); examine diagnostic JSON, GitHub logs and screenshots');
  console.log('V98-P PASS: original resource URLs and branding preserved, source catalog filters work, seven desktop/phone widths fit.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
}
main().catch(e=>{console.error('V98-P FAILED:',e);server.close();process.exitCode=1;});
