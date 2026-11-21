#!/usr/bin/env node
'use strict';
/* V98-C: diagnostic LOCAL browser audit of 7 public/student-facing HTML pages.
   No user accounts, teacher views, private Firestore data or live production are tested.
   Existing layout/runtime observations are reported as explicit alerts, not hidden. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'qa-artifacts','student-visual-v98c');
const pages=[
 {path:'portal/index.html',label:'Student portal / sign-in first'},
 {path:'portal/simulations.html',label:'Simulation library'},
 {path:'portal/unit-01.html',label:'Unit 1 desk'},
 {path:'portal/unit-03.html',label:'Unit 3 desk'},
 {path:'portal/unit-06-learning-desk-v95a.html',label:'Unit 6 public preview'},
 {path:'student-guide.html',label:'Student start guide'},
 {path:'index.html',label:'Original vector explorer'}
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
  const src=fs.readFileSync(path.join(root,p.path),'utf8');
  assert.match(src,/<meta\s+name=["']viewport["']/i,'viewport meta missing in '+p.path);
  assert.ok(src.includes('physics-with-sir-najam-official-logo.png'),'official logo path missing in '+p.path);
 }
 console.log('V98-C source PASS: seven representative pages have the original logo path.');
}
async function main(){
 staticAudit();
 fs.mkdirSync(output,{recursive:true});
 await new Promise((ok,fail)=>server.listen(0,'127.0.0.1',e=>e?fail(e):ok()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const report={version:'V98-C',method:'Local browser against checked-out repository, NOT live GitHub Pages',scope:'Seven representative student-facing routes',pages:[],alerts:[],excluded:['Real user sign-ins','Teacher-facing content and answer keys','Private data','Production authorization and academic release']};
  for(const item of pages){
   const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'});
   const jsErrors=[],badAssets=[];
   page.on('pageerror',e=>jsErrors.push(String(e.message).slice(0,200)));
   page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)badAssets.push({status:r.status(),url:r.url().slice(origin.length).slice(0,160)});});
   const response=await page.goto(origin+'/'+item.path,{waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200,item.path+' must load');
   const title=await page.title();
   assert.ok(title.includes('Physics with Sir Najam'),'correct title '+item.path);
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
   const distinctErrors=[...new Set(jsErrors)];
   for(const msg of distinctErrors)report.alerts.push({page:item.path,type:'runtime-exception',detail:msg});
   for(const bad of badAssets)report.alerts.push({page:item.path,type:'missing-local-asset',detail:bad.status+' '+bad.url});
   report.pages.push({path:item.path,label:item.label,title,alt,layouts,jsExceptions:distinctErrors.length,missingLocalAssets:badAssets.length});
   console.log('Checked',item.path,'desktop/mobile:',layouts.map(x=>x.contentWidth+'px'+(x.horizontalOverflow?' OVERFLOW':'')).join(', '),'errors:',distinctErrors.length,'local 404:',badAssets.length);
   await page.close();
  }
  const nav=await browser.newPage({viewport:{width:1280,height:850}});
  await nav.goto(origin+'/portal/simulations.html',{waitUntil:'domcontentloaded'});
  await nav.locator('a[href="./unit-01.html"]').first().click();
  await nav.waitForURL(url=>url.pathname.endsWith('/portal/unit-01.html'));
  assert.ok((await nav.title()).includes('Unit 1'),'public library must navigate to Unit 1');
  report.navigation={from:'portal/simulations.html',to:'portal/unit-01.html',result:'pass'};
  await nav.close();
  fs.writeFileSync(path.join(output,'audit.json'),JSON.stringify(report,null,2)+'\n');
  const tick=String.fromCharCode(96);
  const rows=report.pages.map(p=>'| '+tick+p.path+tick+' | '+p.layouts.map(x=>x.logoWidth+'px').join(' / ')+' | '+p.layouts.map(x=>x.horizontalOverflow?'CHECK':'OK').join(' / ')+' | '+p.jsExceptions+' |').join('\n');
  const lines=['# Grade XI public/student visual baseline (V98-C)','',
    '**Locally served checked-out files**, not live production. No authentication or private records accessed.','',
    '| Page | Logo size desktop/mobile | Horizontal fit desktop/mobile | JS exceptions |',
    '|---|---|---|---|',rows,'',
    '## Diagnostic alerts: '+report.alerts.length,'',
    ...(report.alerts.length?report.alerts.map(a=>'- '+a.page+' / '+(a.width||'runtime')+': '+a.type+' — '+a.detail):['None detected in this seven-page sample.']),
    '', '## Boundaries','',
    'These baseline screenshots do not certify all 73 portal pages, accessibility conformance, Firebase authorization or live deployment.',''];
  fs.writeFileSync(path.join(output,'report.md'),lines.join('\n'));
  console.log('V98-C completed seven-page browser source audit. Diagnostic alerts: '+report.alerts.length+'; see attached report and screenshots.');
  const critical=report.alerts.filter(a=>a.type==='official-logo-hidden');
  if(critical.length)throw new Error('Visible official logo failure(s): '+critical.map(a=>a.page+' '+(a.width||'initial')).join(', '));
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
}
main().catch(e=>{console.error('V98-C FAILED',e);server.close();process.exitCode=1;});
