#!/usr/bin/env node
'use strict';
/* V98-L — read-only local Chromium audit for public Grade XI Unit 3/4
 * concept studies and the Unit 4 SLO navigator.
 * Never submit grades, open an explanation/teacher deck, or change sources. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'qa-artifacts','concept-study-v98l');
const pages=[
 {path:'portal/unit-04-rotation-study.html',label:'Unit 4 rotational kinematics guide',marker:'#radian',kind:'study'},
 {path:'portal/unit-04-centripetal-study.html',label:'Unit 4 centripetal motion guide',marker:'#net-force',kind:'study'},
 {path:'portal/unit-04-angular-momentum-study.html',label:'Unit 4 inertia torque angular momentum',marker:'#conservation',kind:'study'},
 {path:'portal/unit-04-artificial-gravity-study.html',label:'Unit 4 weightlessness artificial gravity',marker:'#artificial',kind:'study'},
 {path:'portal/unit-04-centrifuge-study.html',label:'Unit 4 centrifugation study guide',marker:'#applications',kind:'study'},
 {path:'portal/unit-03-collision-study.html',label:'Unit 3 air resistance and collisions',marker:'#momentum',kind:'study'},
 {path:'portal/unit-04-slo-focus.html',label:'Unit 4 summative SLO classroom navigator',marker:'#sloGrid',kind:'navigator'}
];
const logoSelector='header img[src*="physics-with-sir-najam-official-logo.png"]';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon',
 '.woff2':'font/woff2','.woff':'font/woff','.pdf':'application/pdf'};
function localPath(url){
 let pathname=decodeURIComponent(new URL(url,'http://localhost').pathname);
 if(pathname.startsWith('/physics-vector-explorer/'))pathname=pathname.slice('/physics-vector-explorer'.length);
 if(pathname==='/')pathname='/index.html';
 const full=path.resolve(root,'.'+pathname);
 return full.startsWith(root+path.sep)?full:null;
}
const server=http.createServer((req,res)=>{
 const file=localPath(req.url);
 if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){
  res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');return;
 }
 res.writeHead(200,{'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});
 fs.createReadStream(file).pipe(res);
});
function staticGate(){
 assert.equal(pages.length,7,'exactly seven public learning resources');
 assert.ok(fs.statSync(path.join(root,'portal/assets/physics-with-sir-najam-official-logo.png')).size>1000);
 for(const entry of pages){
  assert.ok(!/teacher|mcq-key|secure-lesson|course-lesson|admin|private/i.test(entry.path),'never audit private content');
  const html=fs.readFileSync(path.join(root,entry.path),'utf8');
  assert.match(html,/<meta\s+name=["']viewport["']/i,'viewport meta '+entry.path);
  assert.ok(html.includes('physics-with-sir-najam-official-logo.png'),'canonical official logo '+entry.path);
  assert.ok(html.includes('Physics with Sir Najam'),'official brand text '+entry.path);
  assert.ok(html.includes('id="'+entry.marker.slice(1)+'"'),'lesson anchor '+entry.path);
 }
 console.log('V98-L source PASS: seven checked public learning pages reference the unchanged official logo.');
}
async function functional(page,entry){
 if(entry.kind!=='navigator'){
  const text=await page.locator('main').innerText();
  assert.ok(text.length>450,'real concept/teaching content available '+entry.path);
  return {result:'study text and source anchor visible',characters:text.length};
 }
 await page.waitForFunction(()=>{
  const status=document.getElementById('status'),grid=document.getElementById('sloGrid');
  return status&&status.textContent.includes('Ready')&&grid&&grid.querySelectorAll('article.card').length===12;
 },null,{timeout:15000});
 const cards=page.locator('#sloGrid article.card');
 assert.equal(await cards.count(),12,'all twelve original summative theory SLOs are rendered');
 const timed=page.locator('#sloGrid a[href*="unit-04-projector-practice.html?slo="]');
 const discussions=page.locator('#sloGrid a[href*="unit-04-discussion-slides.html?slo="]');
 assert.equal(await timed.count(),12,'twelve SLO filtered student projector links');
 assert.equal(await discussions.count(),12,'separate teacher discussion links exist without opening');
 const sloIds=await cards.locator('.slo').allInnerTexts();
 assert.equal(new Set(sloIds).size,12,'SLO labels must be distinct');
 assert.ok(sloIds.every(x=>/^P-11-B-(0[7-9]|10|1[4-9]|2[01])$/.test(x)),'all SLO codes in the Unit 4 summative list');
 const first=new URL(await timed.first().getAttribute('href'),'http://localhost/portal/');
 assert.equal(first.searchParams.get('slo'),sloIds[0],'first timed link filters by the same SLO as its source card');
 return {result:'12 mapped SLO cards and 12 timed links; 12 discussion links not opened',sloCount:sloIds.length};
}
async function main(){
 staticGate();
 fs.mkdirSync(output,{recursive:true});
 await new Promise((ok,fail)=>server.listen(0,'127.0.0.1',e=>e?fail(e):ok()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const report={version:'V98-L',scope:'Six public Unit 3/4 concept studies plus Unit 4 SLO navigator',
   method:'Checked-out local sources, not live deployment; unauthenticated public content only',
   pages:[],alerts:[],excluded:['Private routes','Teacher deck opening','Answer checking','Grades','Cloud writes','Academic correctness certification']};
  for(const entry of pages){
   const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'});
   const errors=[],missing=[];
   page.on('pageerror',e=>errors.push(String(e.message).slice(0,260)));
   page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)missing.push({status:r.status(),uri:r.url().slice(origin.length).slice(0,160)});});
   const response=await page.goto(origin+'/'+entry.path,{waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200,'public page is served '+entry.path);
   assert.ok((await page.title()).includes('Physics with Sir Najam'),'branded title '+entry.path);
   assert.equal(await page.locator('main').count(),1,'study main landmark '+entry.path);
   assert.equal(await page.locator(entry.marker).count(),1,'main study anchor '+entry.path);
   const logo=page.locator(logoSelector).first();
   assert.equal(await logo.count(),1,'original official logo in header '+entry.path);
   await logo.waitFor({state:'visible',timeout:12000});
   const alt=await logo.getAttribute('alt');
   assert.ok(alt&&alt.trim().length>=10,'meaningful logo alternative '+entry.path);
   assert.equal(await logo.evaluate(el=>el.complete&&el.naturalWidth>0),true,'actual canonical official logo bytes loaded');
   const functionalResult=await functional(page,entry);
   const layouts=[];
   for(const width of [1280,390,320]){
    await page.setViewportSize({width,height:width===1280?850:844});
    await page.waitForTimeout(100);
    const layout=await page.evaluate(()=>{
     const img=document.querySelector('header img[src*="physics-with-sir-najam-official-logo.png"]');
     const box=img.getBoundingClientRect();
     const view=document.documentElement.clientWidth,scroll=document.documentElement.scrollWidth;
     return {viewport:view,documentWidth:scroll,horizontalOverflow:scroll>view+2,
      logoVisible:box.width>0&&box.height>0&&getComputedStyle(img).display!=='none',
      logoWidth:Math.round(box.width),logoHeight:Math.round(box.height),
      availableLinks:[...document.querySelectorAll('a[href]')].filter(x=>x.getClientRects().length>0).length};
    });
    assert.ok(layout.logoVisible,'canonical original logo stays visible at '+width+' '+entry.path);
    const name=entry.path.split('/').join('-').replace('.html','')+'-'+width+'px.png';
    await page.screenshot({path:path.join(output,name),fullPage:false,animations:'disabled'});
    layouts.push({...layout,screenshot:name});
    if(layout.horizontalOverflow)report.alerts.push({page:entry.path,type:'horizontal-overflow',viewport:width,documentWidth:layout.documentWidth});
    if(layout.logoWidth<28||(width<=390&&layout.logoWidth>95))report.alerts.push({page:entry.path,type:'logo-size',viewport:width,pixelWidth:layout.logoWidth});
   }
   const uniqueErrors=[...new Set(errors)];
   uniqueErrors.forEach(e=>report.alerts.push({page:entry.path,type:'browser-runtime-exception',message:e}));
   missing.forEach(asset=>report.alerts.push({page:entry.path,type:'missing-local-resource',...asset}));
   report.pages.push({path:entry.path,label:entry.label,alt,layouts,functional:functionalResult,jsErrors:uniqueErrors,missingLocalResources:missing});
   console.log('Checked',entry.path,'responsive widths:',layouts.map(x=>x.viewport+':'+x.documentWidth+(x.horizontalOverflow?' OVERFLOW':'')).join(', '),'JS errors:',uniqueErrors.length,'local 404:',missing.length,'smoke:',functionalResult.result);
   await page.close();
  }
  const nav=await browser.newPage({viewport:{width:390,height:844}});
  await nav.goto(origin+'/portal/unit-04-rotation-study.html',{waitUntil:'domcontentloaded'});
  await nav.locator('a[href="./unit-04-rotation-lab.html"]').first().click();
  await nav.waitForURL(url=>url.pathname.endsWith('/portal/unit-04-rotation-lab.html'));
  assert.ok((await nav.title()).includes('Physics with Sir Najam'),'study guide opens the original interactive lab');
  report.navigation={from:'portal/unit-04-rotation-study.html',to:'portal/unit-04-rotation-lab.html',result:'pass'};
  await nav.close();
  fs.writeFileSync(path.join(output,'audit.json'),JSON.stringify(report,null,2)+'\n');
  const rows=report.pages.map(p=>'| '+p.path+' | '+p.layouts.map(v=>v.horizontalOverflow?'CHECK':'OK').join(' / ')+' | '+p.jsErrors.length+' | '+p.missingLocalResources.length+' |').join('\n');
  const lines=['# V98-L — Grade XI concept study and SLO navigator browser audit','',
   'Read-only Chromium test of checked-out repository public student pages; **not live production**.','',
   'Screen widths: 1280 desktop, 390 phone, 320 narrow phone.','',
   '| Public page | 1280px / 390px / 320px document fit | JS exceptions | Missing local resources |',
   '|---|---|---|---|',rows,'','## Functional checks','',
   ...report.pages.map(p=>'- '+p.path+': '+p.functional.result),
   '', '## Diagnostic alerts ('+report.alerts.length+')','',
   ...(report.alerts.length?report.alerts.map(a=>'- '+a.page+' '+(a.viewport||'runtime')+' '+a.type+' '+(a.documentWidth||'')+' '+(a.message||'')):['None reported in this seven-page sample.']),
   '', '## Boundaries','',
   'The study/teacher explanation content is not academically re-certified; no private user, grade storage or answer key access is tested. Alerts are *diagnostic* unless the official logo or functional smoke test fails.',''];
  fs.writeFileSync(path.join(output,'report.md'),lines.join('\n'));
  console.log('V98-L completed seven-page Unit 3/4 source-local study audit. Diagnostic alerts: '+report.alerts.length+'.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
}
main().catch(err=>{console.error('V98-L FAILED:',err);server.close();process.exitCode=1;});
