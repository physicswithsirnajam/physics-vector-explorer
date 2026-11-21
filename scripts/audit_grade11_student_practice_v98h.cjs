#!/usr/bin/env node
'use strict';
/* V98-H: locally served browser QA for seven PUBLIC student practice pages.
 * Never visits teacher-key routes, shows keys, submits grades or logs in. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts','student-practice-v98h');
const pages=[
 {path:'portal/unit-03-mcq-practice.html',kind:'boxed',expected:40,label:'Unit 3 Stage 1 — 40 MCQs'},
 {path:'portal/unit-03-mcq-full80.html',kind:'boxed',expected:80,label:'Unit 3 — 80 MCQs'},
 {path:'portal/unit-04-mcq-full80.html',kind:'boxed',expected:80,label:'Unit 4 — 80 MCQs'},
 {path:'portal/unit-04-combined-student-paper.html',kind:'combined',expected:80,label:'Unit 4 — combined student paper'},
 {path:'portal/unit-05-mcq-practice.html',kind:'bubbles',expected:16,label:'Unit 5 — 16 MCQs Set A'},
 {path:'portal/unit-05-mcq-set-b.html',kind:'bubbles',expected:16,label:'Unit 5 — 16 MCQs Set B'},
 {path:'portal/unit-05-descriptive-student.html',kind:'descriptive',expected:9,label:'Unit 5 — descriptive student questions'}
];
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml',
 '.woff2':'font/woff2','.pdf':'application/pdf'};
function sourceAudit(){
 assert.equal(pages.length,7);
 assert.ok(fs.existsSync(path.join(root,'portal/assets/physics-with-sir-najam-official-logo.png')));
 for(const item of pages){
  assert.ok(!/teacher|key|admin|secure|course-lesson/.test(item.path),'must not browse teacher/private content: '+item.path);
  const html=fs.readFileSync(path.join(root,item.path),'utf8');
  assert.match(html,/<meta\s+name=["']viewport["']/i,'viewport tag missing '+item.path);
  assert.ok(html.includes('physics-with-sir-najam-official-logo.png'),'canonical brand image path missing '+item.path);
  assert.ok(html.includes('Physics with Sir Najam'),'brand wordmark missing '+item.path);
 }
 console.log('V98-H source PASS: seven scoped student practice pages use the original official logo.');
}
function localPath(request){
 let pathname=decodeURIComponent(new URL(request,'http://localhost').pathname);
 if(pathname.startsWith('/physics-vector-explorer/'))pathname=pathname.slice('/physics-vector-explorer'.length);
 if(pathname==='/')pathname='/index.html';
 const full=path.resolve(root,'.'+pathname);
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
async function functional(page,item){
 switch(item.kind){
 case 'boxed':{
  await page.locator('#check').waitFor({state:'visible'});
  await page.waitForFunction(()=>!document.querySelector('#check').disabled,null,{timeout:15000});
  const rows=page.locator('#questionArea tr[data-question-id]');
  assert.equal(await rows.count(),item.expected,'expected original boxed rows: '+item.path);
  assert.equal(await page.locator('#answerKey').evaluate(x=>x.classList.contains('hidden')),true,
   'public practice must not automatically reveal the answer/explanation key');
  const radio=rows.first().locator('input[type="radio"]').first();
  await radio.check();
  assert.equal(await radio.isChecked(),true,'answer bubble can be marked');
  await page.locator('#reset').click();
  assert.equal(await radio.isChecked(),false,'Reset clears unsaved response');
  return {rows:item.expected,interaction:'local bubble + Reset',teacherKeyClicked:false};
 }
 case 'bubbles':{
  await page.waitForFunction(()=>document.querySelector('#clearBtn')&&!document.querySelector('#clearBtn').disabled,null,{timeout:15000});
  assert.equal(await page.locator('#questionRows tr.question-row').count(),16,'all student MCQs must render');
  const bubble=page.locator('#questionRows button.choice').first();
  assert.equal(await page.locator('#questionRows button.choice').count(),64,'four answer bubbles each');
  await bubble.click();
  assert.equal(await page.locator('#markedCount').innerText(),'1 / 16 bubbles marked','local marked count');
  await page.locator('#clearBtn').click();
  assert.equal(await page.locator('#markedCount').innerText(),'0 / 16 bubbles marked','Clear removes local answers');
  return {rows:16,interaction:'local bubble + Clear',teacherKeyFetched:false};
 }
 case 'combined':{
  await page.waitForFunction(()=>document.querySelector('#printPaper')&&!document.querySelector('#printPaper').disabled,null,{timeout:15000});
  assert.match(await page.locator('#loadStatus').innerText(),/Ready/i,'combined source is ready');
  assert.equal(await page.locator('#mcqQuestions').locator('tbody tr').count()>0,true,'combined original MCQs present');
  assert.ok(await page.locator('#shortQuestions').locator('article').count()>0,'Section B is populated');
  assert.ok(await page.locator('#longQuestions').locator('article').count()>0,'Section C is populated');
  return {loaded:true,interaction:'student paper renders; no printing/answer keys'};
 }
 case 'descriptive':{
  await page.waitForFunction(()=>document.querySelector('#printPaper')&&!document.querySelector('#printPaper').disabled,null,{timeout:15000});
  assert.match(await page.locator('#loadStatus').innerText(),/Ready/i,'descriptive source is ready');
  assert.equal(await page.locator('#shortQuestions article').count(),7,'seven 4-mark short OR pairs');
  assert.equal(await page.locator('#extendedQuestions article').count(),2,'two 6-mark extended OR pairs');
  return {sections:'7 short + 2 extended',interaction:'student-only practice renders, no answer key'};
 }
 default:throw Error('Unexpected page kind: '+item.kind);
 }
}
async function main(){
 sourceAudit();
 fs.mkdirSync(out,{recursive:true});
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const report={version:'V98-H',scope:'Seven public student practice pages outside Unit 6',method:'local checked-out source in headless Chromium; not live production',pages:[],alerts:[],excluded:['Teacher key or solution interactions','Student sign-in','Account data, Firebase and private content','Submission, scoring and cloud save']};
  for(const item of pages){
   const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'});
   const errors=[],badAssets=[];
   page.on('pageerror',e=>errors.push(String(e.message).slice(0,250)));
   page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)badAssets.push({status:r.status(),url:r.url().slice(origin.length).slice(0,180)});});
   const res=await page.goto(origin+'/'+item.path,{waitUntil:'domcontentloaded'});
   assert.equal(res.status(),200,'HTML loads: '+item.path);
   const title=await page.title();
   assert.ok(title.includes('Physics with Sir Najam'),'page title branded: '+item.path);
   const logo=page.locator('header img[src*="physics-with-sir-najam-official-logo.png"]').first();
   assert.equal(await logo.count(),1,'header official logo exists: '+item.path);
   await logo.waitFor({state:'visible',timeout:15000});
   const alt=await logo.getAttribute('alt');
   assert.ok(alt&&alt.trim().length>10,'official image meaningful alt: '+item.path);
   await page.waitForFunction(()=>{
    const img=document.querySelector('header img[src*="physics-with-sir-najam-official-logo.png"]');
    return img&&img.complete&&img.naturalWidth>0;
   },null,{timeout:15000});
   const layouts=[];
   for(const width of [1280,390]){
    await page.setViewportSize({width,height:width===1280?850:844});
    await page.waitForTimeout(120);
    const metrics=await page.evaluate(()=>{
     const img=document.querySelector('header img[src*="physics-with-sir-najam-official-logo.png"]');
     const rect=img.getBoundingClientRect();
     const w=document.documentElement.clientWidth,scroll=document.documentElement.scrollWidth;
     return {viewport:w,documentWidth:scroll,horizontalOverflow:scroll>w+2,logoWidth:Math.round(rect.width),
      logoVisible:rect.width>0&&rect.height>0&&getComputedStyle(img).display!=='none',mainCount:document.querySelectorAll('main').length};
    });
    assert.equal(metrics.logoVisible,true,'original header logo visible '+item.path);
    const screenshot=item.path.split('/').join('-').replace('.html','')+'-'+width+'.png';
    await page.screenshot({path:path.join(out,screenshot),fullPage:false,animations:'disabled'});
    layouts.push({...metrics,screenshot});
    if(metrics.horizontalOverflow)report.alerts.push({page:item.path,type:'page-overflow',viewport:width,documentWidth:metrics.documentWidth,detail:'Document overflows phone/desktop; tables with internal horizontal scrolling are permitted'});
   }
   // All functional checks are performed on a phone-sized view, never grading or revealing keys.
   const smoke=await functional(page,item);
   const after=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,documentWidth:document.documentElement.scrollWidth}));
   if(after.documentWidth>after.viewport+2)report.alerts.push({page:item.path,type:'active-practice-overflow',viewport:after.viewport,documentWidth:after.documentWidth});
   for(const error of [...new Set(errors)])report.alerts.push({page:item.path,type:'javascript-exception',detail:error});
   for(const missing of badAssets)report.alerts.push({page:item.path,type:'missing-local-file',detail:missing});
   report.pages.push({path:item.path,title,alt,layouts,smoke,javascriptExceptions:[...new Set(errors)].length,missingLocalAssets:badAssets.length});
   console.log('Checked',item.path,layouts.map(x=>x.viewport+':'+x.documentWidth+(x.horizontalOverflow?' OVERFLOW':'')).join(' '),'interaction:',smoke.interaction,'errors:',[...new Set(errors)].length,'local 404:',badAssets.length);
   await page.close();
  }
  fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(report,null,2)+'\n');
  const rows=report.pages.map(p=>'| '+p.path+' | '+p.layouts.map(x=>x.horizontalOverflow?'CHECK':'OK').join(' / ')+' | '+p.smoke.interaction+' | '+p.javascriptExceptions+' |').join('\n');
  const lines=['# V98-H Grade XI student practice visual and interaction baseline','',
   'Browser QA from local checkout, not from the live deployed website. No teacher keys, grading or private records used.','',
   '| Public student page | Document fit (1280px / 390px) | Interaction | JS exceptions |',
   '|---|---|---|---|',rows,'','## Diagnostic alerts ('+report.alerts.length+')','',
   ...(report.alerts.length?report.alerts.map(a=>'- '+a.page+' '+(a.viewport||'')+': '+a.type+' — '+(a.documentWidth||'')+' '+(typeof a.detail==='string'?a.detail:JSON.stringify(a.detail||''))):['No diagnostic alerts in the scoped audit.']),
   '', '## Limits','','No live-deployment, login, answer-key authorization, academic answer correctness or all-site accessibility verification.',''];
  fs.writeFileSync(path.join(out,'report.md'),lines.join('\n'));
  console.log('V98-H completed seven student practice page audits. Diagnostic alerts: '+report.alerts.length+'. Evidence saved.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(e=>{console.error('V98-H FAILED',e);server.close();process.exitCode=1;});
