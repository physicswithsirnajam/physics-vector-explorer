/* V67: actual browser checks for transparent Unit4 candidate SLO UI,
 * no change to scientific answers, authenticated grades or old classroom paper. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const qa=path.join(root,'qa-artifacts/unit04-v67');
fs.mkdirSync(qa,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.b64':'text/plain; charset=utf-8',
 '.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return;}
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
(async()=>{
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'build-your-physics-test.html?unit=4',{waitUntil:'networkidle'});
  assert.match(await page.locator('label[for="slo"]').locator('..').textContent(),/topic-level SLO candidates/i);
  await page.waitForFunction(()=>document.getElementById('availabilityCount')?.textContent.includes('640 eligible MCQ'),null,{timeout:30000});
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'),null,{timeout:30000});
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'),null,{timeout:30000});
  // Browser-only forced source sample. No production selector/backdoor added.
  await page.evaluate(()=>{
   const q=bank.questions.find(x=>x.id==='g11-u04-master-t42-q001');
   if(!q)throw Error('corrected Topic4.2 sample missing');
   test=[{...q,displayOptions:q.options.slice(),groupOrdinal:0,groupPosition:0,groupSize:0}];
   answers={};checked={};index=0;lastReportQuestionId=null;render();
  });
  assert.match(await page.locator('#tags').textContent(),/Topic SLO candidates:/);
  assert.match(await page.locator('#tags').textContent(),/Item-level SLO not independently verified/);
  assert.equal(await page.locator('#choices label').count(),4);
  await page.screenshot({path:path.join(qa,'v67-topic-level-slo-question.png')});
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#submit').click();
  await page.waitForFunction(()=>!document.getElementById('result').classList.contains('hidden'));
  assert.equal(await page.locator('#sloAuditNote').isVisible(),true);
  assert.match(await page.locator('#sloAuditNote').textContent(),/not certified FBISE SLO mastery/);
  assert.equal(await page.locator('#save-result').isDisabled(),true);
  await page.screenshot({path:path.join(qa,'v67-topic-level-slo-results.png')});
  await page.setViewportSize({width:390,height:844});
  const d=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(d[1]<=d[0]+2,'390px candidate SLO report overflow');
  await page.screenshot({path:path.join(qa,'v67-topic-level-slo-mobile.png')});
  assert.deepEqual(errors,[]);
  console.log('PASS V67 Chromium: Unit4 candidate-SLO warning visible in builder/question/report; save disabled; mobile readable');
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(e=>{console.error('FAIL V67 candidate SLO browser',e);server.close();process.exitCode=1;});
