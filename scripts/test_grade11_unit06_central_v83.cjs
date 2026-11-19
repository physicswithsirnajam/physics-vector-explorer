#!/usr/bin/env node
'use strict';
// V83 tests source-preserving central intake of partial Unit 6 Topic6.5.
// This is PUBLIC provisional self-practice, never a recorded/certified exam.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const fullOriginalCounts=[275,206,220,640,349],total=a=>a.reduce((n,x)=>n+x,0);
const idsHeld=[
 'XI-U06-T61-MCQ-0011',
 'XI-U06-T62-MCQ-0026','XI-U06-T62-MCQ-0064','XI-U06-T62-MCQ-0072',
 'XI-U06-T63-MCQ-0024','XI-U06-T63-MCQ-0080'
];
async function verifySource(){
 const first=json('question-bank/grade-11/unit-06-topic-61-v76-80-source.json');
 const second=json('question-bank/grade-11/unit-06-topic-62-v78-80-source.json');
 const third=json('question-bank/grade-11/unit-06-topic-63-v80-80-source.json');
 const fourth=json('question-bank/grade-11/unit-06-topic-64-v82-80-source.json');
  const fifth=json('question-bank/grade-11/unit-06-topic-65-v84-80-source.json');
  const originals=[first,second,third,fourth,fifth];
 assert.deepEqual(originals.map(x=>x.questions.length),[80,80,80,80,80]);
 assert.deepEqual(originals.map(x=>x.questions.filter(q=>q.active).length),[79,77,78,80,80]);
 assert.deepEqual(originals.flatMap(o=>o.questions.filter(q=>!q.active).map(q=>q.id)),idsHeld);
 const fourthKey='BBCCACCCBCACBADDCBCCDCADDBBBDDDBCCDBBDBAABCDACBDBDADABBDCBAAACAAADABDAADCAABCDCD';
 assert.equal(fourthKey.length,80);
 assert.equal(fourth.originalSourceAnswerKey,fourthKey);
 assert.equal(fourth.questions.map(q=>q.correctOptionId).join(''),fourthKey);
 assert.deepEqual(fourth.sections,{fundamentals:20,reasoning:20,numericals:20,'standalone-situations':20,sharedStimulusGroups:0});
 assert.equal(fourth.holds.length,0);
 assert.equal(fourth.perQuestionFrameworkMappingStatus,'not individually verified');
 assert.deepEqual(fourth.verifiedFrameworkTopicSloCodes,['P-11-B-36','P-11-B-37','P-11-B-38']);
 assert.deepEqual(fifth.verifiedFrameworkTopicSloCodes,['P-11-B-40']);
 assert.deepEqual(fifth.formativeContextSloCodes,['P-11-B-39']);
 for(const q of fourth.questions){
  assert.equal(q.boardEligible,false);assert.deepEqual(q.sloCodes,[]);
  assert.equal(q.cognitiveLevel,'Unspecified');assert.equal(q.difficulty,'Unspecified');
  assert.equal(q.stimulusSetId,null);
  assert.ok(['P-11-B-36','P-11-B-37','P-11-B-38'].includes(q.sourceKeySloReference));
 }
 const expectedThirdKey='AADBDCBADCCDBBACCDBCADDBCBBADDABACCBDDCDCDCBDACBCDABBACCDAACCADDAABCADABBACABBDB';
 assert.equal(third.originalSourceAnswerKey,expectedThirdKey);
 assert.equal(third.questions.map(q=>q.correctOptionId).join(''),expectedThirdKey);
 assert.deepEqual(third.verifiedFrameworkTopicSloCodes,['P-11-B-35']);
 assert.equal(third.frameworkClassification,'Summative');
 assert.equal(third.officialFrameworkCognitiveLevel,'Knowledge + Understanding');
 assert.equal(third.perQuestionFrameworkMappingStatus,'not individually verified');
 const ctx={
  DecompressionStream,Blob,Response,atob,
  fetch:async url=>{
    const s=String(url);
    assert.ok(s.startsWith('question-bank/grade-11/'),'Question bank loaded outside expected path: '+s);
    assert.ok(!s.includes('..'),'Unsafe relative source path');
    return {ok:true,json:async()=>json(s),text:async()=>read(s)};
  }
 };
 vm.createContext(ctx);
 vm.runInContext(read('shared/practice-bank-adapter-v55.js'),ctx);
 vm.runInContext(read('shared/multi-unit-planner-v56.js'),ctx);
 const adapter=ctx.PSNPracticeBankV55,planner=ctx.PSNMultiUnitV56;
 assert.equal(adapter.expected[6],394);
 assert.equal(planner.isValidUnits([1,2,3,4,5,6]),true);
 assert.equal(planner.isValidUnits([1,7]),false);
 const banks=await Promise.all([1,2,3,4,5,6].map(u=>adapter.loadBank(u,'question-bank/grade-11/')));
 const counts=Array.from(banks,b=>b.questions.length);
 assert.deepEqual(counts,[...fullOriginalCounts,394]);
 assert.equal(total(counts),2084);
 assert.equal(total(counts.slice(0,5)),1690);
 const all=banks.flatMap(b=>b.questions);
 assert.equal(new Set(all.map(q=>q.id)).size,2084);
 const partial=banks[5].questions;
 const topicCodes=['T61','T62','T63','T64','T65'];
 const byTopic=topicCodes.map(code=>partial.filter(q=>q.id.includes('-'+code+'-')));
 assert.deepEqual(byTopic.map(x=>x.length),[79,77,78,80,80]);
 assert.deepEqual(byTopic.map(x=>x.filter(q=>q.situationBased).length),[16,18,19,20,20]);
 assert.equal(partial.filter(q=>q.situationBased).length,93);
 assert.equal(partial.length,394);
 assert.ok(partial.every(q=>q.unit===6&&q.grade===11&&q.active===true&&
  q.assessmentClassification==='summative-topic-provisional'&&q.boardEligible===false&&
  Array.isArray(q.sloCodes)&&q.sloCodes.length===0&&
  q.cognitiveLevel==='Unspecified'&&q.difficulty==='Unspecified'&&
  q.stimulusSetId===null&&q.stimulusHtml===''));
 for(const id of idsHeld)assert.ok(!partial.some(q=>q.id===id),'Held original figure MCQ accidentally enabled: '+id);
 for(let i=0;i<5;i++){
  const original=originals[i];
  for(const q of byTopic[i]){
    const source=original.questions[q.sourceQuestionNumber-1];
    assert.equal(q.id,source.id);
    assert.equal(q.stem,source.stem);
    assert.equal(q.correctOptionId,source.correctOptionId);
    assert.equal(q.explanation,source.explanation);
    assert.equal(JSON.stringify(q.options),JSON.stringify(source.options),'Original options changed: '+q.id);
  }
 }
 assert.equal(byTopic[0][0].topicSloCodes.join(','),'P-11-B-33,P-11-B-34');
 assert.equal(byTopic[1][0].topicSloCodes.join(','),'P-11-B-41,P-11-B-42');
 assert.equal(byTopic[2][0].topicSloCodes.join(','),'P-11-B-35');
  assert.equal(byTopic[3][0].topicSloCodes.join(','),'P-11-B-36,P-11-B-37,P-11-B-38');
 assert.equal(byTopic[4][0].topicSloCodes.join(','),'P-11-B-40');
 assert.deepEqual(Array.from(byTopic[4].map(q=>q.sourceKeyCognitiveTag)).reduce((a,x)=>(a[x]=(a[x]||0)+1,a),{}),{K:10,U:26,A:44});
 // Protect against inadvertent changes to original Topic6.4 source key and metadata.
 const originalFetch=ctx.fetch,topic64Path='question-bank/grade-11/unit-06-topic-64-v82-80-source.json';
 async function ensureReject(mutate,expectedError){
   ctx.fetch=async url=>{
     const name=String(url),source=json(name);
     if(name===topic64Path)mutate(source);
     return {ok:true,json:async()=>source,text:async()=>read(name)};
   };
   try{await assert.rejects(adapter.loadBank(6,'question-bank/grade-11/'),expectedError);}
   finally{ctx.fetch=originalFetch;}
 }
 await ensureReject(s=>{s.questions[0].boardEligible=true},/Topic6\.4/);
 await ensureReject(s=>{s.questions[0].correctOptionId='A'},/answer key/);
 await ensureReject(s=>{s.questions[65].stimulusSetId='invented-group'},/Topic6\.4/);
 assert.equal(planner.plan(all,partial,[6],'random',20).possible,true);
 const sixPlan=planner.plan(all,all,[1,2,3,4,5,6],'random',30);
 assert.equal(sixPlan.possible,true);
 assert.deepEqual(Object.values(JSON.parse(JSON.stringify(sixPlan.unitCounts))),[5,5,5,5,5,5]);
 assert.equal(planner.plan(all,all,[6],'scenario',20).possible,false);
 assert.equal(planner.plan(all,all,[1,6],'scenario',20).possible,false);
 assert.equal(planner.plan(all,all,[1,6],'grouped',20).possible,true);
 assert.equal(planner.plan(all,all.filter(q=>q.unit!==6),[1,2,3,4,5],'scenario',20).possible,true);
 const manifest=json('question-bank/manifest.json').grades.find(g=>g.grade===11).units;
 assert.deepEqual(manifest.map(u=>u.liveMcqCount),[...fullOriginalCounts,394]);
 assert.equal(manifest[5].sourceTopicMcqCount,400);
 assert.equal(manifest[5].sourceFigureHeldCount,6);
 assert.equal(manifest[5].sourceFiles.at(-1),'grade-11/unit-06-topic-65-v84-80-source.json');
 assert.equal(manifest[5].standaloneSituationQuestionCount,93);
 assert.equal(manifest[5].independentSharedStimulusGroupCount,0);
 assert.equal(manifest[5].exactFbiseModeReady,false);
 const course=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(course.status,'planned');
 assert.equal(course.questionBankCount,0);
 assert.equal(course.partialTestBuilderMcqCount,394);
 assert.equal(course.sourceTopicMcqCount,400);
 assert.equal(course.sourceFigureHeldCount,6);
 assert.equal(course.partialTestBuilderStatus,'public-topics61-65-provisional');
 assert.ok(read('portal/index.html').includes('unit-06-topic-63-preview.html'));
  assert.ok(read('portal/index.html').includes('unit-06-topic-64-preview.html'));
 assert.ok(read('portal/index.html').includes('unit-06-topic-65-preview.html'));
 assert.ok(read('portal/index.html').includes('build-your-physics-test.html?unit=6'));
 assert.ok(!fs.existsSync(path.join(root,'portal','unit-06.html')),'Unreviewed complete Unit6 course incorrectly released');
 assert.ok(!fs.existsSync(path.join(root,'portal','Grade11_Unit6_COMPLETE_MASTER_ALL.pdf')),'Protected source PDF leaked');
 assert.ok(read('build-your-physics-test.html').includes('Topics 6.1–6.5'));
 console.log('V83 STATIC PASS — 1,690 original + 79+77+78+80+80 = 2,084 unique public MCQs; 6 held figure records; 93 independent real-life MCQs; no fabricated SLO or scenario groups.');
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.css':'text/css'};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const f=path.resolve(root,'.'+p);
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'text/plain','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
async function verifyBrowser(){
 const {chromium}=require('playwright');
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('dialog',d=>d.accept());
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'build-your-physics-test.html?unit=6',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('394 eligible MCQ'));
  assert.equal(await page.locator('input[name="unit"][value="6"]').isChecked(),true);
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  assert.equal(await page.locator('#choices label').count(),4);
  await page.locator('#choices input[type="radio"]').first().check();
  await page.locator('#submit').click();
  await page.waitForFunction(()=>!document.getElementById('result').classList.contains('hidden'));
  assert.equal(await page.locator('#save-result').isDisabled(),true,'Unit6 must not save school/cloud grade');
  assert.match(await page.locator('#review').textContent(),/Correct answer:/);
  await page.goto(base+'build-your-physics-test.html?units=1,6',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('589 eligible MCQ'));
  await page.locator('#arrangement').selectOption('grouped');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true,'Mixed grouped Unit1 + Unit6 should remain possible');
  await page.goto(base+'build-your-physics-test.html?unit=6',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('394 eligible MCQ'));
  await page.locator('#arrangement').selectOption('scenario');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false,'No fabricated Unit6 common-stimulus group');
  await page.locator('#arrangement').selectOption('random');
  await page.locator('#scope').selectOption('summative');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false,'Unreviewed source items cannot be promoted as certified summative');
  await page.locator('#scope').selectOption('all');
  await page.locator('#allUnits').click();
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('2084 eligible MCQ'));
  assert.equal(await page.locator('input[name="unit"]:checked').count(),6);
  await page.locator('#quantity').selectOption('30');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.setViewportSize({width:390,height:844});
  const dims=await page.evaluate(()=>({inner:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dims.scroll<=dims.inner+2,'390px horizontal overflow: '+JSON.stringify(dims));
  const out=path.join(root,'qa-artifacts','unit06-v83');
  fs.mkdirSync(out,{recursive:true});
  await page.screenshot({path:path.join(out,'partial-unit06-five-topic-mobile.png'),fullPage:false});
  assert.deepEqual(errors,[]);
  console.log('V83 BROWSER PASS — Unit6-only, grouped Unit1+6, all six units, strict filter/scenario gates, no cloud grade, 390px mobile.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
(async()=>{await verifySource();await verifyBrowser()})().catch(e=>{console.error('V83 FAILURE',e);process.exitCode=1;});
