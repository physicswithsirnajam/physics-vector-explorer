#!/usr/bin/env node
'use strict';
/* V98-M: source-local browser audit for six public interactive concept labs
 * and the original Unit 6 four-figure companion page.
 * No sign-in, account data, secure content, grading, answer-key access or writes. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'qa-artifacts','interactive-labs-v98m');
const pages=[
 {path:'portal/unit-03-motion-lab.html',label:'Unit 3 translatory and projectile motion lab',marker:'#straight-motion',kind:'motion'},
 {path:'portal/unit-03-collision-lab.html',label:'Unit 3 collision and air-resistance lab',marker:'#collisions',kind:'collision'},
 {path:'portal/unit-04-rotation-lab.html',label:'Unit 4 rotational kinematics lab',marker:'#arcRadius',kind:'rotation'},
 {path:'portal/unit-04-angular-momentum-lab.html',label:'Unit 4 torque and skater angular momentum lab',marker:'#rotorLab',kind:'angular'},
 {path:'portal/unit-04-artificial-gravity-lab.html',label:'Unit 4 artificial gravity lab',marker:'#stationRadius',kind:'gravity'},
 {path:'portal/unit-04-centrifuge-lab.html',label:'Unit 4 centrifugation concept lab',marker:'#diagramState',kind:'centrifuge'},
 {path:'portal/unit-06-figure-study-v90.html',label:'Unit 6 four-figure study companion',marker:'#figure62',kind:'figures'}
];
const logoSelector='header img[src*="physics-with-sir-najam-official-logo.png"]';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg',
 '.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff',
 '.ico':'image/x-icon','.pdf':'application/pdf'};
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
function staticGate(){
 assert.equal(pages.length,7);
 assert.ok(fs.statSync(path.join(root,'portal/assets/physics-with-sir-najam-official-logo.png')).size>1000);
 for(const item of pages){
  assert.ok(!/teacher|course-lesson|secure-lesson|admin|key|private/i.test(item.path),'only public learning routes');
  const html=fs.readFileSync(path.join(root,item.path),'utf8');
  assert.match(html,/<meta\s+name=["']viewport["']/i,'responsive meta on '+item.path);
  assert.ok(html.includes('physics-with-sir-najam-official-logo.png'),'canonical image on '+item.path);
  assert.ok(html.includes('Physics with Sir Najam'),'visible official branding on '+item.path);
  assert.ok(html.includes('id="'+item.marker.slice(1)+'"'),'core content on '+item.path);
 }
 console.log('V98-M source PASS: seven pre-existing public interactive/figure pages use the original official logo.');
}
async function rangeTo(page,id,value){
 await page.locator('#'+id).evaluate((el,val)=>{
  el.value=String(val);
  el.dispatchEvent(new Event('input',{bubbles:true}));
 },value);
}
async function smoke(page,item){
 switch(item.kind){
 case 'motion':{
  const start=(await page.locator('#motionV').innerText()).trim();
  assert.ok(start,'initial motion velocity appears');
  await rangeTo(page,'uRange',15);
  const updated=(await page.locator('#motionV').innerText()).trim();
  assert.ok(updated&&updated!==start,'speed and displacement respond to motion initial velocity input');
  const rangeStart=(await page.locator('#projectileR').innerText()).trim();
  await rangeTo(page,'speedRange',36);
  const rangeEnd=(await page.locator('#projectileR').innerText()).trim();
  assert.ok(rangeEnd&&rangeStart!==rangeEnd,'projectile flight range responds to launch-speed input');
  return {result:'kinematics initial velocity changes the displayed final velocity; projectile speed changes range',changed:true};
 }
 case 'collision':{
  assert.ok((await page.locator('#momentumValue').innerText()).trim(),'initial momentum result rendered');
  await page.locator('#collisionType').selectOption('stick');
  assert.equal(await page.locator('#collisionType').inputValue(),'stick');
  assert.match(await page.locator('#conclusion').innerText(),/Momentum remains conserved/,'inelastic collision shows the correct conservation explanation');
  await page.locator('button[data-focus="vertical"]').click();
  assert.equal(await page.locator('button[data-focus="vertical"]').getAttribute('aria-pressed'),'true','drag topic tab changes');
  return {result:'stick-together collision recalculates and air-resistance focus tab switches',changed:true};
 }
 case 'rotation':{
  const before=(await page.locator('#arcRadians').innerText()).trim();
  await rangeTo(page,'arcDegrees',180);
  const after=(await page.locator('#arcRadians').innerText()).trim();
  assert.ok(before&&after&&before!==after,'radian output updates from angle slider');
  await page.locator('button[data-preset="constant"]').click();
  assert.equal(Number(await page.locator('#wheelAlpha').inputValue()),0,'constant-rotation preset has zero angular acceleration');
  assert.ok((await page.locator('#wheelFinalOmega').innerText()).trim(),'wheel angular-velocity result rendered');
  return {result:'arc angle updates radians and constant-rotation preset sets zero angular acceleration',changed:true};
 }
 case 'angular':{
  assert.ok((await page.locator('#moment').innerText()).trim(),'moment of inertia result rendered');
  await page.locator('#zeroTorque').click();
  assert.equal(Number(await page.locator('#rotorTorque').inputValue()),0,'zero torque button changes physical input');
  await page.locator('#skaterOut').click();
  assert.equal(Number(await page.locator('#finalArmRadius').inputValue()),1.4,'skater extends arms');
  await page.locator('#skaterIn').click();
  assert.equal(Number(await page.locator('#finalArmRadius').inputValue()),0.3,'skater draws arms inward');
  return {result:'torque-zero and skater arms-out/in controls update actual inputs',changed:true};
 }
 case 'gravity':{
  assert.ok((await page.locator('#gRatio').innerText()).trim(),'effective-gravity ratio rendered');
  await rangeTo(page,'stationRPM',0);
  assert.equal(Number(await page.locator('#stationRPM').inputValue()),0,'station stopped');
  await page.locator('#earthTarget').click();
  assert.ok(Number(await page.locator('#stationRPM').inputValue())>0,'Earth-target setting computes positive rotation');
  assert.ok((await page.locator('#normalForce').innerText()).trim(),'normal-force result rendered');
  return {result:'zero-rotation input and Earth-gravity target update the station and force output',changed:true};
 }
 case 'centrifuge':{
  assert.ok((await page.locator('#ac').innerText()).trim(),'centripetal acceleration displayed');
  await page.locator('#separate').click();
  assert.match(await page.locator('#diagramState').textContent(),/Conceptual outcome/,'separation control updates schematic');
  await page.locator('#mix').click();
  assert.match(await page.locator('#diagramState').textContent(),/Mixed sample/,'mix control restores original schematic');
  const first=(await page.locator('#ac').innerText()).trim();
  await rangeTo(page,'rpm',900);
  const second=(await page.locator('#ac').innerText()).trim();
  assert.ok(first&&second&&first!==second,'accelerations respond to rpm slider');
  return {result:'conceptual separation/mix works and rpm changes computed centripetal acceleration',changed:true};
 }
 case 'figures':{
  for(const id of ['figure62','figure63','figure65c','figure66']){
   assert.equal(await page.locator('#'+id).count(),1,'four textbook reference sections '+id);
  }
  assert.ok(await page.locator('main svg').count()>=4,'all four original physics schematics rendered');
  await page.locator('nav.toc a[href="#figure63"]').click();
  assert.equal(new URL(page.url()).hash,'#figure63','figure jump navigation works');
  return {result:'four original figure schematics and figure 6.3 jump link available',changed:false};
 }
 default:throw Error('Unexpected public lab kind '+item.kind);
 }
}
async function main(){
 staticGate();
 fs.mkdirSync(output,{recursive:true});
 await new Promise((ok,fail)=>server.listen(0,'127.0.0.1',e=>e?fail(e):ok()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const report={version:'V98-M',scope:'Six public interactive labs and one Unit 6 figure companion',
   method:'Checked-out local source in headless Chromium; not live production',pages:[],alerts:[],
   excluded:['Private accounts','Secure lessons','Answer keys','Teacher-only grading','Saved progress','Production live authorization','Scientific content certification']};
  for(const item of pages){
   const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'});
   const errors=[],missing=[];
   page.on('pageerror',e=>errors.push(String(e.message).slice(0,250)));
   page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)missing.push({status:r.status(),uri:r.url().slice(origin.length).slice(0,170)});});
   const response=await page.goto(origin+'/'+item.path,{waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200,'public lab available '+item.path);
   const title=await page.title();
   assert.ok(title.includes('Physics with Sir Najam'),'branded title '+item.path);
   assert.equal(await page.locator('main').count(),1,'main learning landmark '+item.path);
   assert.equal(await page.locator(item.marker).count(),1,'main learning control '+item.path);
   const logo=page.locator(logoSelector).first();
   assert.equal(await logo.count(),1,'canonical official header logo '+item.path);
   await logo.waitFor({state:'visible',timeout:12000});
   const alt=await logo.getAttribute('alt');
   assert.ok(alt&&alt.trim().length>=10,'logo accessible alt '+item.path);
   assert.equal(await logo.evaluate(img=>img.complete&&img.naturalWidth>0),true,'canonical original logo image actually loads '+item.path);
   const smokeTest=await smoke(page,item);
   const views=[];
   for(const width of [1280,390,320]){
    await page.setViewportSize({width,height:width===1280?850:844});
    await page.waitForTimeout(110);
    const metrics=await page.evaluate(()=>{
     const img=document.querySelector('header img[src*="physics-with-sir-najam-official-logo.png"]');
     const rect=img.getBoundingClientRect(),screen=document.documentElement.clientWidth,doc=document.documentElement.scrollWidth;
     return {viewport:screen,documentWidth:doc,horizontalOverflow:doc>screen+2,
      logoVisible:rect.width>0&&rect.height>0&&getComputedStyle(img).display!=='none',
      logoWidth:Math.round(rect.width),logoHeight:Math.round(rect.height),
      svgCount:document.querySelectorAll('main svg').length};
    });
    assert.ok(metrics.logoVisible,'official logo visible '+item.path+' '+width);
    const screenshot=item.path.split('/').join('-').replace('.html','')+'-'+width+'px.png';
    await page.screenshot({path:path.join(output,screenshot),fullPage:false,animations:'disabled'});
    views.push({...metrics,screenshot});
    if(metrics.horizontalOverflow)report.alerts.push({page:item.path,type:'document-overflow',viewport:width,documentWidth:metrics.documentWidth});
    if(metrics.logoWidth<28||(width<=390&&metrics.logoWidth>95))report.alerts.push({page:item.path,type:'logo-size',viewport:width,actual:metrics.logoWidth});
   }
   for(const error of [...new Set(errors)])report.alerts.push({page:item.path,type:'javascript-exception',message:error});
   for(const bad of missing)report.alerts.push({page:item.path,type:'missing-local-source',...bad});
   report.pages.push({path:item.path,label:item.label,title,logoAlt:alt,views,smokeTest,jsExceptions:[...new Set(errors)],missingLocalAssets:missing});
   console.log('Checked',item.path,'desktop/phone/narrow:',views.map(v=>v.viewport+':'+v.documentWidth+(v.horizontalOverflow?' OVERFLOW':'')).join(','),'interaction:',smokeTest.result,'JS:',errors.length,'missing local assets:',missing.length);
   await page.close();
  }
  const nav=await browser.newPage({viewport:{width:390,height:844}});
  await nav.goto(origin+'/portal/unit-04-rotation-lab.html',{waitUntil:'domcontentloaded'});
  await nav.locator('header a[href="./unit-04-rotation-study.html"]').first().click();
  await nav.waitForURL(url=>url.pathname.endsWith('/portal/unit-04-rotation-study.html'));
  assert.match(await nav.title(),/Rotational Kinematics Study Guide/,'student can return to the matching rotation concept study guide');
  report.navigation={from:'portal/unit-04-rotation-lab.html',to:'portal/unit-04-rotation-study.html',result:'pass'};
  await nav.close();
  fs.writeFileSync(path.join(output,'audit.json'),JSON.stringify(report,null,2)+'\n');
  const rows=report.pages.map(x=>'| '+x.path+' | '+x.views.map(v=>v.horizontalOverflow?'CHECK':'OK').join(' / ')+' | '+x.jsExceptions.length+' | '+x.missingLocalAssets.length+' |').join('\n');
  const lines=['# V98-M — Six public interactive labs and Unit 6 figure companion browser QA','',
   'Local checked-out source tested without a student account. **Not a live deployed site audit.**','',
   'Viewport widths: desktop 1280px, phone 390px, narrow phone 320px.','',
   '| Public lab or companion | Page fit 1280 / 390 / 320 | JS errors | Local missing files |',
   '|---|---|---|---|',rows,'',
   '## Safe, unsaved functional checks','',
   ...report.pages.map(x=>'- '+x.path+': '+x.smokeTest.result),
   '', '## Diagnostics ('+report.alerts.length+')','',
   ...(report.alerts.length?report.alerts.map(a=>'- '+a.page+' / '+(a.viewport||'runtime')+': '+a.type+' '+(a.documentWidth||'')+' '+(a.message||'')):['No diagnostic alerts in this sample.']),
   '', '## Audit boundaries','',
   'No teacher keys, student accounts, saved submissions, grading, production authorization, or textbook/scientific correctness certification. The visual alerts do not automatically fail the job, but must be read before merge.',''];
  fs.writeFileSync(path.join(output,'report.md'),lines.join('\n'));
  console.log('V98-M completed seven-page interactive student-resource audit. Diagnostic alerts: '+report.alerts.length+'.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
}
main().catch(e=>{console.error('V98-M FAILED',e);server.close();process.exitCode=1;});
