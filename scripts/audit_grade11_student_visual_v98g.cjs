#!/usr/bin/env node
'use strict';
/* V98-G: diagnostic local browser and practice-start audit of all seven Unit 6 topic MCQ previews.
   No user accounts, teacher views, private Firestore data or live production are tested.
   Existing layout/runtime observations are reported as explicit alerts, not hidden. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'qa-artifacts','student-visual-v98g');
const pages=[
 {path:'portal/unit-06-topic-61-preview.html',label:'Topic 6.1 upthrust and Archimedes MCQ preview',marker:'#setup'},
 {path:'portal/unit-06-topic-62-preview.html',label:'Topic 6.2 viscous drag MCQ preview',marker:'#setup'},
 {path:'portal/unit-06-topic-63-preview.html',label:'Topic 6.3 fluid flow MCQ preview',marker:'#setup'},
 {path:'portal/unit-06-topic-64-preview.html',label:'Topic 6.4 continuity MCQ preview',marker:'#setup'},
 {path:'portal/unit-06-topic-65-preview.html',label:'Topic 6.5 Bernoulli MCQ preview',marker:'#setup'},
 {path:'portal/unit-06-topic-66-preview.html',label:'Topic 6.6 Bernoulli applications MCQ preview',marker:'#setup'},
 {path:'portal/unit-06-topic-67-preview.html',label:'Topic 6.7 superfluidity MCQ preview',marker:'#setup'}
];
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml',
 '.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.pdf':'application/pdf'};
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
const logoSelector='img[src*="physics-with-sir-najam-official-logo.png"][alt*="Physics with Sir Najam"]';
function staticAudit(){
 assert.equal(pages.length,7);
 assert.ok(fs.existsSync(path.join(root,'portal/assets/physics-with-sir-najam-official-logo.png')));
 for(const p of pages){
  assert.ok(!/teacher|mcq-key|secure-lesson|course-lesson|admin/i.test(p.path),'V98-G must never inspect teacher or enrolled/private routes: '+p.path);
  const src=fs.readFileSync(path.join(root,p.path),'utf8');
  assert.match(src,/<meta\s+name=["']viewport["']/i,'viewport meta missing in '+p.path);
  assert.ok(src.includes('physics-with-sir-najam-official-logo.png'),'official logo path missing in '+p.path);
 }
 console.log('V98-G source PASS: seven original Unit 6 MCQ preview pages reference the official original logo.');
}
async function main(){
 staticAudit();
 fs.mkdirSync(output,{recursive:true});
 await new Promise((ok,fail)=>server.listen(0,'127.0.0.1',e=>e?fail(e):ok()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const report={version:'V98-G',method:'Local browser against checked-out repository, NOT live GitHub Pages',scope:'All seven public Unit 6 topic MCQ preview pages',pages:[],alerts:[],excluded:['Real user sign-ins','Teacher-facing content and answer keys','Private data','Production authorization and academic release']};
  for(const item of pages){
   const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'});
   const jsErrors=[],badAssets=[];
   page.on('pageerror',e=>jsErrors.push(String(e.message).slice(0,200)));
   page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)badAssets.push({status:r.status(),url:r.url().slice(origin.length).slice(0,160)});});
   const response=await page.goto(origin+'/'+item.path,{waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200,item.path+' must load');
   const title=await page.title();
   assert.ok(title.includes('Physics with Sir Najam'),'correct title '+item.path);
   assert.equal(await page.locator(item.marker).count(),1,'core study/lab element must exist: '+item.path);
   const logo=page.locator(logoSelector).first();
   assert.equal(await logo.count(),1,'official image exists '+item.path);
   await logo.waitFor({state:'attached',timeout:8000});
   // Do not confuse hidden lazy placeholders (alt='') with the actual branded header.
   // Record real visibility problems and continue to capture all seven audit pages.
   const canSee=await logo.isVisible();
   if(!canSee)report.alerts.push({page:item.path,type:'official-logo-hidden',detail:'Branded source image exists but is not visible in initial state'});
   const alt=await logo.getAttribute('alt');
   assert.ok(alt&&alt.trim().length>=10,'accessible official logo text '+item.path);
   await page.waitForFunction(()=>{
    const img=document.querySelector('img[src*="physics-with-sir-najam-official-logo.png"][alt*="Physics with Sir Najam"]');
    return !!(img&&img.complete&&img.naturalWidth>0);
   },null,{timeout:15000});
   const layouts=[];
   for(const width of [1280,390]){
    await page.setViewportSize({width,height:width===1280?850:844});
    await page.waitForTimeout(120);
    const layout=await page.evaluate(()=>{
     const image=document.querySelector('img[src*="physics-with-sir-najam-official-logo.png"][alt*="Physics with Sir Najam"]');
     const box=image.getBoundingClientRect();
     return {viewportWidth:window.innerWidth,contentWidth:document.documentElement.scrollWidth,
      horizontalOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2,
      logoVisible:box.width>0&&box.height>0&&getComputedStyle(image).display!=='none'&&getComputedStyle(image).visibility!=='hidden',
      logoWidth:Math.round(box.width),logoHeight:Math.round(box.height),
      h1Count:document.querySelectorAll('h1').length,
      visibleLinks:[...document.querySelectorAll('a[href]')].filter(a=>a.getClientRects().length>0).length};
    });
    if(!layout.logoVisible)report.alerts.push({page:item.path,width,type:'official-logo-hidden',detail:'Official header logo is not visible at this viewport; inspect screenshot'});
    const screenshot=item.path.replace(/\//g,'-').replace(/\.html$/,'')+'-'+(width===1280?'desktop':'mobile')+'.png';
    await page.screenshot({path:path.join(output,screenshot),fullPage:false,animations:'disabled'});
    layouts.push({...layout,screenshot});
    if(layout.horizontalOverflow)report.alerts.push({page:item.path,width,type:'horizontal-overflow',detail:'Page extends beyond viewport; investigate in a later focused layout PR'});
    if(layout.logoWidth<28||(width===390&&layout.logoWidth>95))report.alerts.push({page:item.path,width,type:'logo-size',detail:'Brand mark display size merits visual review'});
   }
   // This is a local, unsaved practice smoke test. The public question bank must validate
   // and permit a student to begin, view four options, and navigate back to a selected answer.
   await page.waitForFunction(()=>{const btn=document.getElementById('begin');return btn&&!btn.disabled;},null,{timeout:15000});
   assert.match(await page.locator('#load-status').innerText(),/questions available/i,'question bank loaded '+item.path);
   await page.locator('#size').selectOption('10');
   await page.locator('#begin').click();
   assert.equal(await page.locator('#quiz').isVisible(),true,'practice panel opens '+item.path);
   assert.equal(await page.locator('#setup').isVisible(),false,'setup hides after start '+item.path);
   const radios=page.locator('#option-grid input[type="radio"]');
   assert.equal(await radios.count(),4,'every test question offers four options '+item.path);
   const questionText=(await page.locator('#stem').innerText()).trim();
   assert.ok(questionText.length>5,'question stem is rendered '+item.path);
   await radios.first().check();
   assert.match(await page.locator('#answered').innerText(),/^1 of 10 answered$/,'answered counter updates '+item.path);
   await page.locator('#next').click();
   assert.equal(await page.locator('#position').innerText(),'Question 2 of 10','Next navigates '+item.path);
   await page.locator('#previous').click();
   assert.equal(await page.locator('#position').innerText(),'Question 1 of 10','Previous navigates '+item.path);
   assert.equal(await page.locator('#option-grid input[type="radio"]').first().isChecked(),true,'answer survives next/back '+item.path);
   const activeWidth=await page.evaluate(()=>({screen:document.documentElement.clientWidth,content:document.documentElement.scrollWidth}));
   if(activeWidth.content>activeWidth.screen+2)report.alerts.push({page:item.path,width:390,type:'active-practice-horizontal-overflow',detail:'Question/option state extends beyond phone viewport '+activeWidth.content+'px'});
   const practiceScreenshot=item.path.replace(/\\//g,'-').replace(/\\.html$/,'')+'-active-practice-mobile.png';
   await page.screenshot({path:path.join(output,practiceScreenshot),fullPage:false,animations:'disabled'});
   // Do not click Submit: no scores/answers are published or stored during this audit.
   const practice={bankLoaded:true,questionCount:10,optionCount:4,firstAnswerPersisted:true,screenWidth:activeWidth.screen,contentWidth:activeWidth.content,screenshot:practiceScreenshot};
   const distinctErrors=[...new Set(jsErrors)];
   for(const msg of distinctErrors)report.alerts.push({page:item.path,type:'runtime-exception',detail:msg});
   for(const bad of badAssets)report.alerts.push({page:item.path,type:'missing-local-asset',detail:bad.status+' '+bad.url});
   report.pages.push({path:item.path,label:item.label,title,alt,layouts,practice,jsExceptions:distinctErrors.length,missingLocalAssets:badAssets.length});
   console.log('Checked',item.path,'desktop/mobile:',layouts.map(x=>x.contentWidth+'px'+(x.horizontalOverflow?' OVERFLOW':'')).join(', '),'errors:',distinctErrors.length,'local 404:',badAssets.length);
   await page.close();
  }
  const nav=await browser.newPage({viewport:{width:1280,height:850}});
  await nav.goto(origin+'/portal/unit-06-topic-62-preview.html',{waitUntil:'domcontentloaded'});
  await nav.locator('a[href="../viscosity-terminal-velocity.html"]').first().click();
  await nav.waitForURL(url=>url.pathname.endsWith('/viscosity-terminal-velocity.html'));
  assert.ok((await nav.title()).includes('Viscosity'),'Topic 6.2 preview must link to the existing viscosity simulation');
  report.navigation={from:'portal/unit-06-topic-62-preview.html',to:'viscosity-terminal-velocity.html',result:'pass',smoke:'Public viscosity interactive simulation opens'};
  await nav.close();
  fs.writeFileSync(path.join(output,'audit.json'),JSON.stringify(report,null,2)+'\n');
  const tick=String.fromCharCode(96);
  const rows=report.pages.map(p=>'| '+tick+p.path+tick+' | '+p.layouts.map(x=>x.logoWidth+'px').join(' / ')+' | '+p.layouts.map(x=>x.horizontalOverflow?'CHECK':'OK').join(' / ')+' | '+p.jsExceptions+' |').join('\n');
  const lines=['# Grade XI public/student visual baseline (V98-G)','',
    '**Locally served checked-out files**, not live production. No authentication or private records accessed.','',
    '| Page | Logo size desktop/mobile | Horizontal fit desktop/mobile | JS exceptions |',
    '|---|---|---|---|',rows,'',
    '## Diagnostic alerts: '+report.alerts.length,'',
    ...(report.alerts.length?report.alerts.map(a=>'- '+a.page+' / '+(a.width||'runtime')+': '+a.type+' — '+a.detail):['None detected in this seven-page sample.']),
    '', '## Boundaries','',
    'These baseline screenshots do not certify all 73 portal pages, accessibility conformance, Firebase authorization or live deployment.',''];
  fs.writeFileSync(path.join(output,'report.md'),lines.join('\n'));
  console.log('V98-G completed seven-topic preview browser and real MCQ interaction audit. Diagnostic alerts: '+report.alerts.length+'; see attached report and screenshots.');
  const critical=report.alerts.filter(a=>a.type==='official-logo-hidden');
  if(critical.length)throw new Error('Visible official logo failure(s): '+critical.map(a=>a.page+' '+(a.width||'initial')).join(', '));
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
}
main().catch(e=>{console.error('V98-G FAILED',e);server.close();process.exitCode=1;});
