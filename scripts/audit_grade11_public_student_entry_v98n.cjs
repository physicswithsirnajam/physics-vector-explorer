#!/usr/bin/env node
'use strict';
/* V98-N: browse only the public/student-entry surfaces, never authenticate,
 * submit an MCQ, access a private dashboard, or alter user records.
 * All data served from checked-out local repository files, not production.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts','student-entry-v98n');
const pages=[
 {path:'portal/index.html',label:'Portal public sign-in and resource entry',kind:'portal',logo:'header img.brand-logo'},
 {path:'portal/simulations.html?unit=6',label:'Simulation directory, prefiltered to Unit 6',kind:'simulations',logo:'header img[src*="official-logo"]'},
 {path:'student-guide.html',label:'Grade XI Student Start Guide',kind:'guide',logo:'header img[src*="official-logo"]'},
 {path:'build-your-physics-test.html?unit=6',label:'Unit 6 preselected Test Builder',kind:'builder',logo:'header img.brand-logo'},
 {path:'portal/unit-01.html',label:'Unit 1 Learning Desk',kind:'unit01',logo:'header img[src*="official-logo"]'},
 {path:'portal/unit-03.html',label:'Unit 3 Learning Desk',kind:'unit03',logo:'header img[src*="official-logo"]'},
 {path:'portal/unit-06-learning-desk-v95a.html',label:'Unit 6 seven-topic Learning Desk',kind:'unit06',logo:'header img[src*="official-logo"]'}
];
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon',
 '.woff2':'font/woff2','.woff':'font/woff','.pdf':'application/pdf'};
function localPath(raw){
 let pathname=decodeURIComponent(new URL(raw,'http://localhost').pathname);
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
function sourceGate(){
 assert.equal(pages.length,7,'seven scoped entry points');
 const canonical=fs.readFileSync(path.join(root,'portal/assets/physics-with-sir-najam-official-logo.png'));
 const second=fs.readFileSync(path.join(root,'assets/branding/physics-with-sir-najam-logo.png'));
 assert.equal(Buffer.compare(canonical,second),0,'Test Builder branding is byte-identical to the canonical logo');
 assert.ok(fs.statSync(path.join(root,'portal/assets/physics-with-sir-najam-official-banner.png')).size>1000,'canonical public portal banner exists');
 for(const entry of pages){
  const html=fs.readFileSync(path.join(root,entry.path.split('?')[0]),'utf8');
  assert.match(html,/<meta\s+name=["']viewport["']/i,'mobile viewport '+entry.path);
  assert.ok(html.includes('Physics with Sir Najam'),'official portal name '+entry.path);
  assert.ok(/<img\b[^>]+(official-logo|physics-with-sir-najam-logo)/i.test(html),'brand image '+entry.path);
 }
 console.log('V98-N SOURCE PASS: 7 public entry points; Test Builder uses exact same original official logo bytes; original banner exists.');
}
async function functionality(page,item,origin){
 switch(item.kind){
 case 'portal':{
  assert.equal(await page.locator('header img.brand-logo').count(),1,'public portal logo');
  assert.equal(await page.locator('img.official-banner').count(),1,'original portal banner');
  const banner=page.locator('img.official-banner');
  assert.equal(await banner.evaluate(e=>e.complete&&e.naturalWidth>0),true,'official portal banner loads');
  assert.equal(await page.locator('#auth-screen').count(),1,'public sign-in entry exists');
  // No auth form is submitted, no account is created and no authenticated hub is opened.
  const link=page.locator('header a.header-link[href="./simulations.html"]').first();
  await link.click();
  await page.waitForURL(u=>u.pathname.endsWith('/portal/simulations.html'));
  assert.match(await page.title(),/Interactive Physics Simulations/);
  return {result:'unauthenticated public portal → simulation directory; original banner and logo load'};
 }
 case 'simulations':{
  await page.waitForFunction(()=>{
   const status=document.querySelector('#results'),unit=document.querySelector('#unit');
   return status&&unit&&unit.value==='6'&&/^\d+ of \d+ simulations shown/.test(status.textContent)&&document.querySelectorAll('#cards article.card').length>0;
  },null,{timeout:15000});
  assert.equal(await page.locator('#unit').inputValue(),'6','Unit 6 query parameter selects Unit 6');
  const cards=page.locator('#cards article.card');
  const n=await cards.count();
  assert.equal(n,5,'five actual public Unit 6 standalone simulations are shown');
  const tags=await cards.evaluateAll(els=>els.map(x=>x.dataset.unit));
  assert.ok(tags.every(x=>x==='6'),'Unit 6 filter excludes unrelated unit cards');
  await page.locator('#search').fill('unmatched-v98n-physics-token');
  assert.equal(await cards.count(),0,'search narrows the currently selected unit');
  assert.match(await page.locator('#results').innerText(),/^0 of /);
  await page.locator('#search').fill('');
  assert.equal(await cards.count(),n,'clearing search restores Unit 6 results');
  const firstHref=await cards.first().locator('a.go').getAttribute('href');
  assert.ok(firstHref,'public simulation cards offer functioning links');
  const linked=await page.request.get(firstHref);
  assert.equal(linked.status(),200,'first filtered public simulation route is accessible');
  return {result:'Unit 6 URL filter lists five original simulations, search narrows/restores results, first simulation link resolves',cards:n};
 }
 case 'guide':{
  await page.waitForFunction(()=>{const x=document.querySelector('#question-total');return x&&Number(x.textContent)>0;},null,{timeout:10000});
  assert.ok(await page.locator('a[href="build-your-physics-test.html"]').count()>0,'test builder link from student start');
  assert.ok(await page.locator('a[href="portal/unit-01.html"]').count()>0,'Unit 1 Learning Desk in start guide');
  await page.locator('a[href="portal/unit-01.html"]').first().click();
  await page.waitForURL(u=>u.pathname.endsWith('/portal/unit-01.html'));
  assert.match(await page.title(),/Unit 1 Learning Desk/);
  return {result:'public Student Start Guide links to the real Unit 1 Learning Desk and Test Builder'};
 }
 case 'builder':{
  await page.waitForFunction(()=>document.querySelectorAll('#units input[name="unit"]').length>=6,null,{timeout:12000});
  const checked=page.locator('#units input[name="unit"]:checked');
  assert.deepEqual(await checked.evaluateAll(els=>els.map(el=>el.value)),['6'],'unit=6 deep link preselects only Unit 6');
  await page.locator('#clearUnits').click();
  assert.equal(await checked.count(),0,'Clear removes all unit selections without submitting');
  await page.locator('#allUnits').click();
  assert.deepEqual(await checked.evaluateAll(els=>els.map(el=>el.value)),['1','2','3','4','5','6'],'Select all chooses the six released/provisional units');
  await page.locator('#resetButton').click();
  assert.deepEqual(await checked.evaluateAll(els=>els.map(el=>el.value)),['6'],'Reset restores Unit 6 deep-link defaults');
  // No question attempt, test execution or grade submission is performed here.
  return {result:'Unit 6 Test Builder deep link, Clear, Select All and Reset all function without starting a test'};
 }
 case 'unit01':{
  assert.ok(await page.locator('a[href="./unit-01-study-guide.html"]').count()>0,'Unit 1 study guide discoverable');
  await page.locator('a[href="./unit-01-study-guide.html"]').first().click();
  await page.waitForURL(u=>u.pathname.endsWith('/portal/unit-01-study-guide.html'));
  assert.match(await page.title(),/Unit 1 Study Guide/);
  return {result:'Unit 1 Learning Desk → official public study guide'};
 }
 case 'unit03':{
  assert.ok(await page.locator('a[href="./unit-03-collision-lab.html"]').count()>0,'Unit 3 collision simulation discoverable');
  await page.locator('a[href="./unit-03-collision-lab.html"]').first().click();
  await page.waitForURL(u=>u.pathname.endsWith('/portal/unit-03-collision-lab.html'));
  assert.match(await page.title(),/Collision Lab/);
  return {result:'Unit 3 Learning Desk → original collision learning lab'};
 }
 case 'unit06':{
  const chooser=page.locator('#topic-select');
  assert.equal(await chooser.locator('option').count(),8,'all seven topics plus placeholder selectable');
  await chooser.selectOption('topic-63');
  await page.waitForURL(u=>u.hash==='#topic-63');
  assert.equal(await chooser.inputValue(),'topic-63','topic dropdown syncs with hash');
  assert.equal(await page.locator('[data-topic-nav="topic-63"]').getAttribute('aria-current'),'location','selected topic indicated to students');
  assert.ok(await page.locator('#topic-63 a[href="./unit-06-topic-63-study-v95b3.html"]').count()>0,'study lesson linked from Topic 6.3');
  return {result:'seven-topic chooser jumps to Topic 6.3 and exposes its real study lesson'};
 }
 default:throw Error('Unknown entry kind '+item.kind);
 }
}
async function main(){
 sourceGate();
 fs.mkdirSync(out,{recursive:true});
 await new Promise((ok,fail)=>server.listen(0,'127.0.0.1',e=>e?fail(e):ok()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const audit={version:'V98-N',scope:'Seven public student discovery/navigation entry points',
   method:'Local checked-out repository source, not live production',pages:[],alerts:[],
   excluded:['Signing in','Password or account forms','Personalized Learning Hub','Admin dashboard','Private enrollment','Teacher answer keys','Grade submission','Live production authorization']};
  for(const item of pages){
   const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'});
   const errors=[],missing=[];
   page.on('pageerror',e=>errors.push(String(e.message).slice(0,260)));
   page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)missing.push({status:r.status(),url:r.url().slice(origin.length).slice(0,180)});});
   const res=await page.goto(origin+'/'+item.path,{waitUntil:'domcontentloaded'});
   assert.equal(res.status(),200,'public entry point available '+item.path);
   const title=await page.title();
   assert.ok(title.includes('Physics with Sir Najam'),'branded title '+item.path);
   const logo=page.locator(item.logo).first();
   assert.equal(await logo.count(),1,'original official logo present '+item.path);
   await logo.waitFor({state:'visible',timeout:12000});
   const alt=await logo.getAttribute('alt');
   assert.ok(alt&&alt.trim().length>=10,'original official logo has meaningful alt text');
   await page.waitForFunction(sel=>{const img=document.querySelector(sel);return !!(img&&img.complete&&img.naturalWidth>0);},item.logo,{timeout:15000});
   const views=[];
   for(const width of [1280,390,320]){
    await page.setViewportSize({width,height:width===1280?850:844});
    await page.waitForTimeout(100);
    const metrics=await page.evaluate(sel=>{
     const img=document.querySelector(sel),rect=img.getBoundingClientRect(),
       viewport=document.documentElement.clientWidth,doc=document.documentElement.scrollWidth;
     return {viewport,documentWidth:doc,horizontalOverflow:doc>viewport+2,
       logoVisible:rect.width>0&&rect.height>0&&getComputedStyle(img).display!=='none',
       logoWidth:Math.round(rect.width),links:[...document.querySelectorAll('a[href]')].filter(x=>x.getClientRects().length>0).length};
    },item.logo);
    assert.ok(metrics.logoVisible,'exact official brand image visible at '+width+' '+item.path);
    const name=item.path.split('?')[0].split('/').join('-').replace('.html','')+'-'+width+'px.png';
    await page.screenshot({path:path.join(out,name),fullPage:false,animations:'disabled'});
    views.push({...metrics,screenshot:name});
    if(metrics.horizontalOverflow)audit.alerts.push({page:item.path,viewport:width,type:'page-wide-horizontal-overflow',documentWidth:metrics.documentWidth});
    if(metrics.logoWidth<28||(width<=390&&metrics.logoWidth>95))audit.alerts.push({page:item.path,viewport:width,type:'unexpected-logo-size',logoWidth:metrics.logoWidth});
   }
   const interaction=await functionality(page,item,origin);
   const jsErrors=[...new Set(errors)];
   for(const error of jsErrors)audit.alerts.push({page:item.path,type:'browser-js-error',message:error});
   for(const bad of missing)audit.alerts.push({page:item.path,type:'missing-local-resource',...bad});
   audit.pages.push({path:item.path,label:item.label,title,logoAlt:alt,views,interaction,jsErrors,missing});
   console.log('Checked',item.path,views.map(v=>v.viewport+':'+v.documentWidth+(v.horizontalOverflow?' OVERFLOW':'')).join(' '),
     'student path:',interaction.result,'JS errors:',jsErrors.length,'local 404:',missing.length);
   await page.close();
  }
  fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(audit,null,2)+'\n');
  const rows=audit.pages.map(p=>'| '+p.path+' | '+p.views.map(v=>v.horizontalOverflow?'CHECK':'OK').join(' / ')+' | '+p.jsErrors.length+' | '+p.missing.length+' |').join('\n');
  const summary=['# V98-N — Grade XI public entry and navigation audit','',
   'Checked local public resources only. **Not an authenticated Learning Hub or live-production audit.**','',
   'Three widths: 1280px desktop, 390px phone, 320px small phone.','',
   '| Student entry page | Page fit 1280 / 390 / 320 | JS errors | Local missing files |',
   '|---|---|---|---|',rows,'','## Actual student-path smoke tests','',
   ...audit.pages.map(p=>'- '+p.path+': '+p.interaction.result),
   '','## Diagnostic alerts ('+audit.alerts.length+')','',
   ...(audit.alerts.length?audit.alerts.map(a=>'- '+a.page+' / '+(a.viewport||'runtime')+': '+a.type+' '+(a.documentWidth||a.message||'')):['No diagnostic alerts detected in this scoped browser audit.']),
   '','## Boundaries','',
   'No login attempts, personal data, protected content, test submissions, grade saving, backend authorization, official FBISE answer certification or live production infrastructure checks. A green workflow can contain nonblocking diagnostic alerts.',''];
  fs.writeFileSync(path.join(out,'report.md'),summary.join('\n'));
  console.log('V98-N completed seven public student entry and navigation audits. Diagnostic alerts: '+audit.alerts.length+'. Evidence saved.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
}
main().catch(e=>{console.error('V98-N FAILED:',e);server.close();process.exitCode=1;});
