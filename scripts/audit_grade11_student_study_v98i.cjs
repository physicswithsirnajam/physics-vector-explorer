#!/usr/bin/env node
'use strict';
/* V98-I: local, read-only browser QA for Grade XI public study/numerical pages.
 * No logins, teacher-only pages, answer grading, cloud writes, or physics edits.
 * Screen overflow/runtime anomalies are recorded as diagnostics, not concealed.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts','student-study-v98i');
const cases=[
 {path:'portal/unit-01-study-guide.html',label:'Unit 1 study guide',marker:'#uncertainty',kind:'guide'},
 {path:'portal/unit-01-numericals.html',label:'Unit 1 worked numericals',marker:'#problem-01',kind:'guide'},
 {path:'portal/unit-02-formula-sheet.html',label:'Unit 2 formula sheet',marker:'#g1',kind:'formula'},
 {path:'portal/unit-02-numericals.html',label:'Unit 2 worked numericals',marker:'#n01',kind:'unit2'},
 {path:'portal/unit-03-study-guide.html',label:'Unit 3 motion study guide',marker:'#equations',kind:'guide'},
 {path:'portal/unit-03-numericals.html',label:'Unit 3 source-backed numericals',marker:'#summativeExercises',kind:'unit3'},
 {path:'portal/unit-05-work-study.html',label:'Unit 5 work and energy study guide',marker:'#work',kind:'guide'}
];
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg',
 '.svg':'image/svg+xml','.woff2':'font/woff2','.pdf':'application/pdf'};
const logoSelector='header img[src*="physics-with-sir-najam-official-logo.png"]';
const server=http.createServer((req,res)=>{
 try{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname.startsWith('/physics-vector-explorer/'))pathname=pathname.slice('/physics-vector-explorer'.length);
  if(pathname==='/')pathname='/index.html';
  const full=path.resolve(root,'.'+pathname);
  if(!full.startsWith(root+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile())throw Error('not found');
  res.writeHead(200,{'Content-Type':mime[path.extname(full).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(full).pipe(res);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('not found');}
});
function staticGate(){
 assert.equal(cases.length,7,'seven auditable public study routes');
 assert.ok(fs.statSync(path.join(root,'portal/assets/physics-with-sir-najam-official-logo.png')).size>1000);
 for(const entry of cases){
  assert.ok(!/teacher|key|admin|course-lesson|secure-lesson|private/i.test(entry.path),'disallow private or teacher-only resources');
  const source=fs.readFileSync(path.join(root,entry.path),'utf8');
  assert.match(source,/<meta\s+name=["']viewport["']/i,'viewport meta '+entry.path);
  assert.ok(source.includes('physics-with-sir-najam-official-logo.png'),'canonical official logo '+entry.path);
  assert.ok(source.includes('Physics with Sir Najam'),'brand identity '+entry.path);
  assert.ok(source.includes(entry.marker.slice(1)),'meaningful content anchor '+entry.path);
 }
 console.log('V98-I source PASS: seven scoped public study/numerical pages, unchanged official image.');
}
async function smoke(page,entry){
 if(entry.kind==='unit2'){
  const details=page.locator('details.solution');
  assert.equal(await details.count(),30,'Unit 2 has 30 original worked numerical sections');
  const first=details.first();
  await page.locator('#open-all').click();
  assert.equal(await first.evaluate(el=>el.open),true,'show all solutions expands details');
  assert.equal(await details.last().evaluate(el=>el.open),true,'last numerical opens too');
  await page.locator('#close-all').click();
  assert.equal(await first.evaluate(el=>el.open),false,'hide all solutions closes details');
  return '30 solution panels; Show All / Hide All';
 }
 if(entry.kind==='unit3'){
  await page.waitForFunction(()=>document.querySelector('#revealAll')&&!document.querySelector('#revealAll').disabled,null,{timeout:16000});
  assert.match(await page.locator('#loadStatus').innerText(),/8 numericals ready/i,'Unit 3 source data validated');
  const details=page.locator('#summativeExercises details, #formativeExercises details');
  assert.equal(await details.count(),8,'all eight original numerical exercises rendered');
  assert.equal(await page.locator('#summativeExercises details').count(),6,'six summative-aligned exercises');
  assert.equal(await page.locator('#formativeExercises details').count(),2,'two formative/supplementary exercises');
  await page.locator('#revealAll').click();
  assert.equal(await details.last().evaluate(el=>el.open),true,'reveal all numerical solutions');
  await page.locator('#hideAll').click();
  assert.equal(await details.first().evaluate(el=>el.open),false,'hide all numerical solutions');
  return '8 rendered exercises (6 summative, 2 formative); Reveal / Hide';
 }
 if(entry.kind==='formula'){
  assert.equal(await page.locator('#print-sheet').isEnabled(),true,'formula sheet print button remains ready');
  assert.equal(await page.locator('#quadrants').count(),1,'quadrant reference present');
  return 'formula groups, quadrant guide and print control present; no print triggered';
 }
 assert.ok((await page.locator('main').innerText()).length>400,'actual study explanation is present');
 return 'study lesson content and anchor present';
}
async function main(){
 staticGate();
 fs.mkdirSync(out,{recursive:true});
 await new Promise((ok,fail)=>server.listen(0,'127.0.0.1',e=>e?fail(e):ok()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const results={version:'V98-I',scope:'Seven Grade XI public student study/numerical pages',method:'Chromium against checked-out local source, not deployed production',pages:[],alerts:[],excluded:['Private enrolled lessons','Teacher-only keys','Student accounts','Printing or cloud submissions','Academic correctness certification']};
  for(const entry of cases){
   const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'});
   const errors=[],missing=[];
   page.on('pageerror',e=>errors.push(String(e.message).slice(0,250)));
   page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)missing.push({status:r.status(),uri:r.url().slice(origin.length).slice(0,180)});});
   const response=await page.goto(origin+'/'+entry.path,{waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200,'public page loads '+entry.path);
   assert.ok((await page.title()).includes('Physics with Sir Najam'),'branded title '+entry.path);
   assert.equal(await page.locator(entry.marker).count(),1,'named source content anchor '+entry.path);
   assert.equal(await page.locator('main').count(),1,'main student content landmark '+entry.path);
   const logo=page.locator(logoSelector).first();
   assert.equal(await logo.count(),1,'canonical official logo in header '+entry.path);
   await logo.waitFor({state:'visible',timeout:15000});
   const alt=await logo.getAttribute('alt');
   assert.ok(alt&&alt.trim().length>=10,'meaningful image alternative '+entry.path);
   await page.waitForFunction(()=>{
    const logo=document.querySelector('header img[src*="physics-with-sir-najam-official-logo.png"]');
    return !!(logo&&logo.complete&&logo.naturalWidth>0);
   },null,{timeout:15000});
   const layouts=[];
   for(const width of [1280,390,320]){
    await page.setViewportSize({width,height:width===1280?850:844});
    await page.waitForTimeout(90);
    const snapshot=await page.evaluate(()=>{
     const logo=document.querySelector('header img[src*="physics-with-sir-najam-official-logo.png"]');
     const b=logo.getBoundingClientRect();
     return {viewport:document.documentElement.clientWidth,
       contentWidth:document.documentElement.scrollWidth,
       overflows:document.documentElement.scrollWidth>document.documentElement.clientWidth+2,
       logoVisible:b.width>0&&b.height>0&&getComputedStyle(logo).display!=='none',
       logoWidth:Math.round(b.width),
       visibleLinks:[...document.querySelectorAll('a[href]')].filter(el=>el.getClientRects().length>0).length};
    });
    assert.ok(snapshot.logoVisible,'exact official header logo displayed at '+width+'px: '+entry.path);
    const screenshot=entry.path.split('/').join('-').replace('.html','')+'-'+width+'px.png';
    await page.screenshot({path:path.join(out,screenshot),fullPage:false,animations:'disabled'});
    layouts.push({...snapshot,screenshot});
    if(snapshot.overflows)results.alerts.push({page:entry.path,type:'document-horizontal-overflow',viewport:width,documentWidth:snapshot.contentWidth});
    if(snapshot.logoWidth<28||(width<=390&&snapshot.logoWidth>95))results.alerts.push({page:entry.path,type:'unexpected-logo-size',viewport:width,logoWidth:snapshot.logoWidth});
   }
   const functional=await smoke(page,entry);
   const unique=[...new Set(errors)];
   for(const msg of unique)results.alerts.push({page:entry.path,type:'javascript-exception',message:msg});
   for(const file of missing)results.alerts.push({page:entry.path,type:'missing-source-asset',...file});
   results.pages.push({path:entry.path,label:entry.label,logoAlt:alt,layouts,functional,jsExceptions:unique.length,missingLocalAssets:missing.length});
   console.log('Checked',entry.path,layouts.map(x=>x.viewport+':'+x.contentWidth+(x.overflows?' OVERFLOW':'')).join(' '),'smoke:',functional,'JS:',unique.length,'404s:',missing.length);
   await page.close();
  }
  const nav=await browser.newPage({viewport:{width:390,height:844}});
  await nav.goto(origin+'/portal/unit-02-formula-sheet.html',{waitUntil:'domcontentloaded'});
  await nav.locator('a[href="./unit-02-numericals.html"]').first().click();
  await nav.waitForURL(url=>url.pathname.endsWith('/portal/unit-02-numericals.html'));
  assert.ok((await nav.title()).includes('Worked Numericals'),'formula → numerical resource navigation');
  results.navigation={source:'Unit 2 formula sheet',destination:'Unit 2 numericals',result:'pass'};
  await nav.close();
  fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(results,null,2)+'\n');
  const rows=results.pages.map(p=>'| '+p.path+' | '+p.layouts.map(l=>l.overflows?'CHECK':'OK').join(' / ')+' | '+p.jsExceptions+' | '+p.missingLocalAssets+' |').join('\n');
  const lines=['# V98-I — Grade XI study and numerical page visual/browser audit','',
   '**Locally served checked-out source; not a live-production or protected-account audit.**','',
   'Tested viewport widths: 1280px desktop, 390px phone, 320px small phone.','',
   '| Public page | 1280 / 390 / 320 horizontal fit | JS exceptions | Missing local assets |',
   '|---|---|---|---|',rows,'',
   '## Recorded diagnostics ('+results.alerts.length+')','',
   ...(results.alerts.length?results.alerts.map(a=>'- '+a.page+': '+a.type+' at '+(a.viewport||'runtime')+(a.documentWidth?' (content '+a.documentWidth+'px)':'')):['No diagnostic alerts in this scoped sample.']),
   '', '## Safe functional checks','',
   ...results.pages.map(p=>'- '+p.path+': '+p.functional),
   '', '## Scope boundary','',
   'No accounts, private lessons, teacher-only routes, source calculations, assessment/answer correctness or print behavior were verified.',''];
  fs.writeFileSync(path.join(out,'report.md'),lines.join('\n'));
  console.log('V98-I completed seven-page local desktop and two-phone study/numerical audit. Diagnostic alerts: '+results.alerts.length+'.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
}
main().catch(e=>{console.error('V98-I FAILED',e);server.close();process.exitCode=1;});
