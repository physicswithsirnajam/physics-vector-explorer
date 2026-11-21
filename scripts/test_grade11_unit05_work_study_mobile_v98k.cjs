#!/usr/bin/env node
'use strict';
/* V98-K: diagnose and regress the source-local Unit 5 Work Study Guide phone overflow.
   Only one approved responsive CSS rule may differ from the original page.
   No content, marks, formulas, answer keys, logos or personal data are edited.
*/
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts','unit05-mobile-v98k');
const originalFNV=2185159722;
const approvedCss='@media screen and (max-width:560px){.action{max-width:100%;overflow-wrap:anywhere}}';
function fnv(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h;}
function checkSource(){
 const source=fs.readFileSync(path.join(root,'portal/unit-05-work-study.html'),'utf8');
 const withoutApprovedCss=source.replace('\n'+approvedCss,'');
 assert.equal(fnv(withoutApprovedCss),originalFNV,
  'The original study-guide content and source markup must be unchanged (apart from the single approved mobile CSS rule)');
 assert.ok(source.includes('./assets/physics-with-sir-najam-official-logo.png'),'original official logo reference retained');
 assert.ok(source.includes('Work and Energy — Source-Mapped Study Guide')&&source.includes('P-11-B-32'),'original student physics explanation and SLO mapping retained');
 console.log('V98-K SOURCE PASS: every original byte preserved apart from an optional scoped CSS rule.');
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.png':'image/png','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname.startsWith('/physics-vector-explorer/'))pathname=pathname.slice('/physics-vector-explorer'.length);
  if(pathname==='/')pathname='/index.html';
  const full=path.resolve(root,'.'+pathname);
  if(!full.startsWith(root+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile())throw Error('not found');
  res.writeHead(200,{'Content-Type':mime[path.extname(full).toLowerCase()]||'application/octet-stream'});
  fs.createReadStream(full).pipe(res);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
});
async function main(){
 checkSource();
 fs.mkdirSync(out,{recursive:true});
 await new Promise((ok,fail)=>server.listen(0,'127.0.0.1',e=>e?fail(e):ok()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const pageErrors=[],missing=[];
  page.on('pageerror',e=>pageErrors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)missing.push(r.status()+' '+r.url().slice(origin.length));});
  const response=await page.goto(origin+'/portal/unit-05-work-study.html',{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200,'Unit 5 Work Study Guide loads');
  assert.match(await page.title(),/Unit 5.*Work.*Energy.*Physics with Sir Najam/);
  const logo=page.locator('header img[src="./assets/physics-with-sir-najam-official-logo.png"]');
  await logo.waitFor({state:'visible',timeout:12000});
  assert.equal(await logo.evaluate(img=>img.complete&&img.naturalWidth>0),true,'exact original official logo is loaded');
  assert.match(await logo.getAttribute('alt'),/Physics with Sir Najam/,'meaningful original branding alt');
  const states=[];
  for(const width of [320,375,390,540,768,1280]){
   await page.setViewportSize({width,height:width===1280?850:844});
   await page.waitForTimeout(100);
   const state=await page.evaluate(()=>{
    const vw=document.documentElement.clientWidth,doc=document.documentElement.scrollWidth;
    const descendants=[...document.querySelectorAll('body *')].map(el=>{
     const box=el.getBoundingClientRect(),cs=getComputedStyle(el);
     return {tag:el.tagName.toLowerCase(),id:el.id||'',className:typeof el.className==='string'?el.className:'',
      sample:(el.tagName==='TABLE'?'table':(el.textContent||'')).trim().replace(/\s+/g,' ').slice(0,105),
      left:Math.round(box.left),right:Math.round(box.right),width:Math.round(box.width),
      clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,display:cs.display,overflowX:cs.overflowX};
    }).filter(el=>el.width>0&&el.right>vw+2).sort((a,b)=>b.right-a.right).slice(0,12);
    const tables=[...document.querySelectorAll('table')].map((table,index)=>{
     const b=table.getBoundingClientRect(),cs=getComputedStyle(table);
     return {index,left:Math.round(b.left),right:Math.round(b.right),width:Math.round(b.width),scrollWidth:table.scrollWidth,
      clientWidth:table.clientWidth,display:cs.display,overflowX:cs.overflowX};
    }).filter(t=>t.right>vw+2||t.scrollWidth>t.clientWidth+2).slice(0,12);
    return {viewport:vw,documentWidth:doc,overflows:doc>vw+2,offenders:descendants,tables};
   });
   states.push({requestedWidth:width,...state});
   const unclipped=await page.evaluate(()=>[...document.querySelectorAll('body *')]
    .filter(el=>!el.closest('.tbl')&&!el.closest('#psn-global-nav')&&el.getBoundingClientRect().right>document.documentElement.clientWidth+2)
    .map(el=>{const r=el.getBoundingClientRect(),cs=getComputedStyle(el);return {tag:el.tagName.toLowerCase(),className:typeof el.className==='string'?el.className:'',
      text:(el.textContent||'').trim().replace(/\\s+/g,' ').slice(0,85),left:Math.round(r.left),right:Math.round(r.right),
      width:Math.round(r.width),clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,overflowX:cs.overflowX};})
    .sort((a,b)=>b.right-a.right).slice(0,30));
   const scrolling=await page.evaluate(()=>[...document.querySelectorAll('body *')]
      .filter(el=>!el.closest('.tbl')&&!el.closest('#psn-global-nav')&&el.scrollWidth>el.clientWidth+2)
      .map(el=>{const b=el.getBoundingClientRect(),c=getComputedStyle(el);return {tag:el.tagName.toLowerCase(),
        className:typeof el.className==='string'?el.className:'',text:(el.textContent||'').trim().replace(/\\s+/g,' ').slice(0,105),
        left:Math.round(b.left),right:Math.round(b.right),client:el.clientWidth,scroll:el.scrollWidth,
        scrollRight:Math.round(b.left)+el.scrollWidth,overflowX:c.overflowX};})
      .sort((a,b)=>b.scrollRight-a.scrollRight).slice(0,30));
   console.log('V98-K SCROLL CHILDREN',JSON.stringify({width,scrolling}));
   console.log('V98-K WIDTH DIAG',JSON.stringify({width,viewport:state.viewport,documentWidth:state.documentWidth,overflow:state.overflows,
      unclipped,offenders:state.offenders.slice(0,8),tables:state.tables.slice(0,7)}));
   await page.screenshot({path:path.join(out,'unit05-'+width+'px.png'),fullPage:false,animations:'disabled'});
  }
  fs.writeFileSync(path.join(out,'diagnostic.json'),JSON.stringify({states,pageErrors,missing},null,2)+'\n');
  assert.deepEqual(pageErrors,[],'No JavaScript runtime errors in the original lesson');
  assert.deepEqual(missing,[],'No missing local source assets in the original lesson');
  for(const state of states)assert.equal(state.overflows,false,'Unexpected horizontal page scroll at '+state.viewport+'px; inspect logged offender and archived screenshots');
  await page.locator('header nav a[href="./unit-05.html"]').first().click();
  await page.waitForURL(url=>url.pathname.endsWith('/portal/unit-05.html'));
  assert.ok((await page.title()).includes('Unit 5'),'student can return to Unit 5 learning desk');
  console.log('V98-K PASS: exact study source preserved, all six widths fit, original logo loads and Unit 5 return navigation works.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
}
main().catch(e=>{console.error('V98-K FAILED:',e);server.close();process.exitCode=1;});
