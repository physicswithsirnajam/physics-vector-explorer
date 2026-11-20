#!/usr/bin/env node
'use strict';
/* V77 — original Unit6 partial topic in the Grade XI central Test Builder.
 * No Firebase account, remote traffic, server-side auth, or student record used.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts','builder-v77');
fs.mkdirSync(out,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const totals=[275,206,220,640,349,560];
async function sourceIntegrity(){
 const original=json('question-bank/grade-11/unit-06-topic-61-v76-80-source.json');
 assert.equal(original.questions.length,80);
 assert.deepEqual(original.questions.filter(q=>!q.active).map(q=>q.sourceQuestionNumber),[]);
 const ctx={DecompressionStream,Blob,Response,atob,fetch:async url=>{
   assert.ok(String(url).startsWith('question-bank/grade-11/'),'Reject external question bank');
   const s=String(url);return {ok:true,json:async()=>json(s),text:async()=>read(s)};
 }};
 vm.createContext(ctx);
 vm.runInContext(read('shared/practice-bank-adapter-v55.js'),ctx);
 vm.runInContext(read('shared/multi-unit-planner-v56.js'),ctx);
 const a=ctx.PSNPracticeBankV55,p=ctx.PSNMultiUnitV56;
 assert.ok(a&&p);assert.equal(p.isValidUnits([1,2,3,4,5,6]),true);
 assert.equal(p.isValidUnits([1,7]),false);assert.equal(p.isValidUnits([1,1]),false);
 assert.equal(p.isValidUnits([6]),true);
 const banks=await Promise.all([1,2,3,4,5,6].map(u=>a.loadBank(u,'question-bank/grade-11/')));
 assert.deepEqual(banks.map(b=>b.questions.length),totals);
 const all=banks.flatMap(b=>b.questions);
 assert.equal(all.length,2250);assert.equal(new Set(all.map(q=>q.id)).size,2250);
 const six=banks[5].questions;
 assert.equal(six.length,560);
 assert.equal(six.filter(q=>q.id.startsWith('XI-U06-T61-')).length,79);
 assert.equal(six.filter(q=>q.id.startsWith('XI-U06-T62-')).length,77);
 assert.equal(six.filter(q=>q.id.startsWith('XI-U06-T63-')).length,78);
 assert.equal(six.filter(q=>q.id.startsWith('XI-U06-T64-')).length,80);
 assert.equal(six.filter(q=>q.id.startsWith('XI-U06-T65-')).length,80);
 assert.equal(six.filter(q=>q.id.startsWith('XI-U06-T66-')).length,80);
 assert.equal(six.filter(q=>q.id.startsWith('XI-U06-T67-')).length,80);
 assert.ok(['XI-U06-T61-MCQ-0011','XI-U06-T62-MCQ-0026','XI-U06-T62-MCQ-0064','XI-U06-T62-MCQ-0072','XI-U06-T63-MCQ-0024','XI-U06-T63-MCQ-0080'].every(id=>six.some(q=>q.id===id&&q.referenceFigureId)),'Six verified figure questions must remain accessible');
 assert.ok(six.every(q=>q.assessmentClassification==='summative-topic-provisional'&&
   q.cognitiveLevel==='Unspecified'&&q.difficulty==='Unspecified'&&
   q.sloCodes.length===0&&q.boardEligible===false&&!q.stimulusSetId&&q.active));
 assert.deepEqual(Array.from(six.filter(q=>q.situationBased&&q.id.includes('-T61-')),q=>q.sourceQuestionNumber),Array.from({length:16},(_,i)=>65+i));
 assert.deepEqual(Array.from(six.filter(q=>q.situationBased&&q.id.includes('-T62-')),q=>q.sourceQuestionNumber),Array.from({length:20},(_,i)=>61+i));
 assert.deepEqual(Array.from(six.filter(q=>q.situationBased&&q.id.includes('-T63-')),q=>q.sourceQuestionNumber),Array.from({length:20},(_,i)=>61+i));
 for(let u=1;u<=5;u++)assert.equal(banks[u-1].questions.length,totals[u-1]);
 const pSix=p.plan(all,six,[6],'random',20);
 assert.equal(pSix.possible,true);assert.equal(pSix.unitCounts['6'],20);
 assert.equal(p.plan(all,all,[1,2,3,4,5,6],'random',30).possible,true);
 assert.deepEqual(Object.values(JSON.parse(JSON.stringify(p.plan(all,all,[1,2,3,4,5,6],'random',30).unitCounts))),[5,5,5,5,5,5]);
 assert.equal(p.plan(all,all,[1,6],'grouped',20).possible,true,'One existing Unit1 scenario and U6 singles can coexist');
 const noScenario=p.plan(all,all,[1,6],'scenario',20);
 assert.equal(noScenario.possible,false);
 assert.match(noScenario.reason,/Unit 6 has no complete eligible scenario group/);
 assert.equal(p.plan(all,six,[6],'scenario',20).possible,false);
 assert.equal(p.plan(all,all.filter(q=>q.unit!==6),[1,2,3,4,5],'scenario',20).possible,true);
 const manifest=json('question-bank/manifest.json');
 const xi=manifest.grades.find(g=>g.grade===11).units;
 assert.deepEqual(xi.map(u=>u.liveMcqCount),totals);
 assert.equal(xi.slice(0,5).reduce((sum,u)=>sum+u.liveMcqCount,0),1690);
 assert.equal(xi[5].status,'partial-public-topic-preview');
 assert.equal(xi[5].exactFbiseModeReady,false);
 const course=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(course.status,'planned','Not a full Unit6 course release');
 assert.equal(course.questionBankCount,0,'Full-unit bank remains unreleased');
 assert.equal(course.partialTestBuilderMcqCount,560);
 assert.equal(course.sourceFigureHeldCount,0);
 assert.equal(course.partialTestBuilderHref,'../build-your-physics-test.html?unit=6');
 assert.ok(read('portal/index.html').includes('href="../build-your-physics-test.html?unit=6"'));
 assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')),'No full Unit 6 desk prematurely published');
 console.log('V77 source pass: original first 1690 + 79 Topic6.1 + 77 Topic6.2 held-figure-safe Unit6 items; six-unit allocation and no fake shared scenarios.');
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.css':'text/css'};
const server=http.createServer((req,res)=>{
 try{
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+name);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Missing');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'text/plain','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
async function browserCheck(){
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1340,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'build-your-physics-test.html?unit=6',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('560 eligible MCQ'));
  assert.equal(await page.locator('input[name="unit"][value="6"]').isChecked(),true);
  assert.equal(await page.locator('input[name="unit"]:checked').count(),1);
  assert.equal(await page.locator('#quickStartLink').isVisible(),true,'U6 individual 20-MCQ mode unavailable');
  await page.screenshot({path:path.join(out,'01-u6-builder.png')});
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  assert.match(await page.locator('#unitTitle').textContent(),/Fluid Mechanics/);
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  assert.equal(await page.locator('#choices label').count(),4);
  assert.match(await page.locator('#tags').textContent(),/Unit 6/);
  await page.locator('#choices input[type="radio"]').first().check();
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#submit').click();
  await page.waitForFunction(()=>!document.getElementById('result').classList.contains('hidden'));
  assert.equal(await page.locator('#save-result').isDisabled(),true,'U6 must not save cloud scores');
  assert.match(await page.locator('#review').textContent(),/Correct answer:/);
  await page.screenshot({path:path.join(out,'02-u6-reviewed.png')});
  await page.goto(base+'build-your-physics-test.html?units=1,6',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('829 eligible MCQ'));
  await page.locator('#arrangement').selectOption('grouped');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true,'U1 scenario+U6 singles should build');
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  assert.match(await page.locator('#setupSummary').textContent(),/Unit 1.*Unit 6/);
  await page.locator('#begin').click();
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#submit').click();
  await page.waitForFunction(()=>!document.getElementById('result').classList.contains('hidden'));
  const summaries=await page.locator('#unitStats .slo-chip').allTextContents();
  assert.ok(summaries.some(s=>s.startsWith('Unit 1:')),'Mixed results miss U1');
  assert.ok(summaries.some(s=>s.startsWith('Unit 6:')),'Mixed results miss U6');
  assert.equal(await page.locator('#save-result').isDisabled(),true);
  await page.goto(base+'build-your-physics-test.html?unit=6',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('560 eligible MCQ'));
  await page.locator('#arrangement').selectOption('scenario');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false,'U6 has zero shared-stimulus groups');
  await page.locator('#arrangement').selectOption('random');
  await page.locator('#scope').selectOption('summative');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false,'Do not invent certified Unit6 summative item mapping');
  await page.locator('#scope').selectOption('all');
  await page.locator('#slo').fill('P-11-B-33');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false,'Do not invent individual B33 tags');
  await page.locator('#slo').fill('');
  await page.locator('#allUnits').click();
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('2250 eligible MCQ'));
  assert.equal(await page.locator('input[name="unit"]:checked').count(),6);
  await page.locator('#quantity').selectOption('30');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true,'six-unit 30-MCQ plan not feasible');
  await page.locator('#arrangement').selectOption('scenario');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false,'six-unit scenario-only must reject U6');
  await page.locator('#arrangement').selectOption('random');
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#submit').click();
  await page.waitForFunction(()=>!document.getElementById('result').classList.contains('hidden'));
  assert.equal(await page.locator('#unitStats .slo-chip').count(),6,'Six-unit results need all six breakdowns');
  await page.goto(base+'build-your-physics-test.html?unit=6',{waitUntil:'networkidle'});
  await page.setViewportSize({width:390,height:844});
  const dims=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dims.scroll<=dims.width+2,'390px mobile overflow: '+JSON.stringify(dims));
  await page.screenshot({path:path.join(out,'03-mobile-sixth-bank.png'),fullPage:false});
  await page.goto(base+'practice-engine/index.html?unit=7&count=20',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('loading').textContent.includes('Unable to load'));
  assert.equal(await page.locator('#start').isVisible(),false,'Unit7 direct URL must fail closed');
  assert.deepEqual(errors,[],'Browser JS errors');
  console.log('V77 browser pass: U6 solo, grouped mixed, six-unit random, scenario fail-closed, SLO caution, score privacy and mobile 390px.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
(async()=>{await sourceIntegrity();await browserCheck()})().catch(e=>{console.error('FAIL V77',e);server.close();process.exitCode=1;});
