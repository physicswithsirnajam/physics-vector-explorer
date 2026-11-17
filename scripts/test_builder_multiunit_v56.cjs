#!/usr/bin/env node
'use strict';
/* V56: actual student mixed-unit Test Builder, exact unit coverage and scenario QA. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts','builder-v56');
fs.mkdirSync(out,{recursive:true});
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(err){res.writeHead(500);res.end(String(err))}
});
async function sourceIntegrity(){
 const ctx={
  DecompressionStream,Blob,Response,atob,
  fetch:async url=>{
   assert.ok(String(url).startsWith('question-bank/grade-11/'));
   return {ok:true,json:async()=>read(String(url)),text:async()=>fs.readFileSync(path.join(root,String(url)),"utf8")};
  }
 };
 vm.createContext(ctx);
 vm.runInContext(fs.readFileSync(path.join(root,'shared/practice-bank-adapter-v55.js'),'utf8'),ctx);
 vm.runInContext(fs.readFileSync(path.join(root,'shared/multi-unit-planner-v56.js'),'utf8'),ctx);
 const a=ctx.PSNPracticeBankV55,p=ctx.PSNMultiUnitV56;
 assert.equal(p.isValidUnits([1,2,3,4,5]),true);
 assert.equal(p.isValidUnits([1,1]),false);
 assert.equal(p.isValidUnits([1,6]),false);
 assert.equal(p.isValidUnits([]),false);
 const banks=await Promise.all([1,2,3,4,5].map(u=>a.loadBank(u,'question-bank/grade-11/')));
 const all=banks.flatMap(b=>b.questions);
 assert.equal(all.length,1525);
 assert.equal(new Set(all.map(q=>q.id)).size,1525);
 const standard=p.plan(all,all,[5,3,1,2,4],'random',20);
 assert.equal(standard.possible,true);assert.equal(standard.allocations.length,5);
 assert.equal(standard.allocations.reduce((n,a)=>n+a.count,0),20);
 assert.deepEqual(Object.values(JSON.parse(JSON.stringify(standard.unitCounts))).sort((a,b)=>a-b),[4,4,4,4,4]);
 const allScenarios=p.plan(all,all,[1,2,3,4,5],'scenario',20);
 assert.equal(allScenarios.possible,true,'five units must each have complete four-MCQ scenarios');
 assert.equal(allScenarios.groupCount,5);
 assert.equal(allScenarios.groupQuestions,20);
 for(const a of allScenarios.allocations){
  assert.ok(a.groups.length>0);
  assert.equal(a.groups.reduce((n,g)=>n+g.length,0),a.count);
  for(const g of a.groups)assert.ok(g.every(q=>q.unit===a.unit));
 }
 assert.equal(p.plan(all,all,[1,2,3,4,5],'random',4).possible,false);
 const grouped=p.plan(all,all,[1,3,5],'grouped',20);
 assert.equal(grouped.possible,true);
 assert.ok(grouped.groupCount>0);
 assert.equal(grouped.allocations.reduce((n,x)=>n+x.count,0),20);
 const noneU5=p.plan(all,all.filter(q=>q.unit!==5),[1,5],'random',20);
 assert.equal(noneU5.possible,false);assert.match(noneU5.reason,/Unit 5 has no eligible/);
 const restricted=all.filter(q=>q.unit!==5||q.sloCodes.includes('P-11-B-29'));
 assert.equal(p.plan(all,restricted,[5],'random',20).possible,true,'Unit 5 now has 88 source-backed P-11-B-29 MCQs');
 assert.equal(restricted.filter(q=>q.unit===5).length,88);
 console.log('PASS V62+V56 planner: 1525 unique records, five-unit 4+4+4+4+4, mixed groups, exact scenario coverage and fail-closed filtering.');
}
async function actualBrowser(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1350,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'build-your-physics-test.html?units=1,3,5',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('844 eligible MCQ'));
  for(const u of [1,3,5])assert.equal(await page.locator('input[name="unit"][value="'+u+'"]').isChecked(),true);
  for(const u of [2,4])assert.equal(await page.locator('input[name="unit"][value="'+u+'"]').isChecked(),false);
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  assert.match(await page.locator('#pilotAvailability').textContent(),/U1:.*U3:.*U5:/);
  await page.screenshot({path:path.join(out,'01-mixed-builder-selected.png')});
  await page.locator('#quickStartLink').click();
  await page.waitForURL(/practice-engine\/index\.html\?/);
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  assert.match(await page.locator('#setupSummary').textContent(),/Unit 1.*Unit 3.*Unit 5/);
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  assert.match(await page.locator('#qcounter').textContent(),/Question 1 of 20/);
  assert.equal(await page.locator('#choices label').count(),4);
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#submit').click();
  await page.waitForFunction(()=>!document.getElementById('result').classList.contains('hidden'));
  const summaries=await page.locator('#unitStats .slo-chip').allTextContents();
  assert.equal(summaries.length,3);
  for(const u of [1,3,5])assert.ok(summaries.some(line=>line.startsWith('Unit '+u+':')),'no result for Unit '+u);
  const counts=summaries.map(line=>Number(line.match(/\/(\d+) correct/)[1]));
  assert.equal(counts.reduce((a,b)=>a+b,0),20);
  assert.equal(await page.locator('#save-result').isDisabled(),true,'mixed-unit tests must not bypass existing single-unit Firestore allowlist');
  await page.screenshot({path:path.join(out,'02-mixed-report.png')});
  console.log('PASS V56 browser: Units 1, 3, 5 share 20 questions and provide three distinct unit result breakdowns.');

  await page.goto(base+'build-your-physics-test.html',{waitUntil:'networkidle'});
  await page.locator('#allUnits').click();
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('1525 eligible MCQ'));
  assert.equal(await page.locator('input[name="unit"]:checked').count(),5);
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.locator('#quantity').selectOption('4');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false,'four questions cannot represent five selected units');
  assert.match(await page.locator('#availabilityNote').textContent(),/at least 5 questions/);
  await page.locator('#quantity').selectOption('20');
  await page.locator('#arrangement').selectOption('scenario');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true,'five four-question groups should fit 20 questions');
  await page.screenshot({path:path.join(out,'03-all-units-scenario-mode.png')});
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  const seen=new Set(),groups=new Map();
  for(let i=0;i<20;i++){
   const counter=await page.locator('#qcounter').textContent();
   const unitsText=await page.locator('#tags').textContent();
   const match=counter.match(/Scenario (\d+) \((\d+)\/(\d+)\)/);
   assert.ok(match,'not a grouped scenario item at question '+i);
   const unitMatch=unitsText.match(/Unit ([1-5])/);assert.ok(unitMatch,'missing unit tag '+i);
   const u=Number(unitMatch[1]),id=Number(match[1]),position=Number(match[2]),size=Number(match[3]);
   assert.equal(size,4);
   seen.add(u);
   if(!groups.has(id))groups.set(id,{unit:u,positions:[]});
   assert.equal(groups.get(id).unit,u,'scenario crosses unit boundary');
   groups.get(id).positions.push(position);
   assert.equal(await page.locator('#stimulusPanel').isVisible(),true);
   assert.ok((await page.locator('#stimulusPanel').textContent()).length>35);
   if(i<19)await page.locator('#next').click();
  }
  assert.deepEqual([...seen].sort((a,b)=>a-b),[1,2,3,4,5]);
  assert.equal(groups.size,5);
  for(const [id,g] of groups)assert.deepEqual(g.positions,[1,2,3,4],'broken or reordered group '+id);
  console.log('PASS V56 browser: five-unit scenario-only 20-question test includes five complete, consecutively ordered 4-item scenarios.');

  await page.goto(base+'build-your-physics-test.html?units=2,4',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('681 eligible MCQ'));
  await page.locator('#arrangement').selectOption('grouped');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  assert.match(await page.locator('#qcounter').textContent(),/Question 1 of 20/);

  await page.goto(base+'build-your-physics-test.html?units=1,5',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('624 eligible MCQ'));
  await page.locator('#scope').selectOption('formative');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false);
  assert.match(await page.locator('#availabilityNote').textContent(),/Unit 5 has no eligible/);
  await page.locator('#scope').selectOption('all');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);

  await page.goto(base+'practice-engine/index.html?units=1%2C1&count=20',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('loading').textContent.includes('Unable to load'));
  assert.equal(await page.locator('#start').isVisible(),false,'duplicate unit requests fail closed');
  await page.goto(base+'practice-engine/index.html?units=1%2C6&count=20',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('loading').textContent.includes('Unable to load'));
  assert.equal(await page.locator('#start').isVisible(),false,'unavailable unit requests fail closed');

  await page.goto(base+'build-your-physics-test.html?units=1,3,5',{waitUntil:'networkidle'});
  await page.setViewportSize({width:390,height:844});
  const dim=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(dim[1]<=dim[0]+2,'mobile 390px overflow: '+dim);
  await page.screenshot({path:path.join(out,'04-mixed-builder-mobile.png')});
  assert.deepEqual(errors,[], 'uncaught browser errors');
  console.log('PASS V56 browser: mixed grouped, filters, invalid-unit failures, mobile and no runtime exceptions.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
(async()=>{await sourceIntegrity();await actualBrowser();})().catch(err=>{console.error('FAIL V56',err);server.close();process.exitCode=1;});
