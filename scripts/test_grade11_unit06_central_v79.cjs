#!/usr/bin/env node
'use strict';
// V79: Unit6 is still a PARTIAL public bank. Verify both original sources,
// four held figures, zero false SLO certifications, no changed older 1690.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),http=require('node:http');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const originalCounts=[275,206,220,640,349],sum=a=>a.reduce((n,x)=>n+x,0);
async function verifySource(){
 const first=json('question-bank/grade-11/unit-06-topic-61-v76-80-source.json');
 const second=json('question-bank/grade-11/unit-06-topic-62-v78-80-source.json');
 const third=json('question-bank/grade-11/unit-06-topic-63-v80-80-source.json');
 assert.equal(first.questions.length,80);assert.equal(second.questions.length,80);assert.equal(third.questions.length,80);
 assert.equal(first.questions.filter(q=>q.active).length,79);
 assert.equal(second.questions.filter(q=>q.active).length,77);
 assert.equal(third.questions.filter(q=>q.active).length,78);
 const holds=['XI-U06-T61-MCQ-0011','XI-U06-T62-MCQ-0026','XI-U06-T62-MCQ-0064','XI-U06-T62-MCQ-0072','XI-U06-T63-MCQ-0024','XI-U06-T63-MCQ-0080'];
 const ctx={DecompressionStream,Blob,Response,atob,fetch:async url=>{
  const s=String(url);
  assert.match(s,/^question-bank\/grade-11\//,'Only repository question banks may be fetched');
  const rel=s.replace(/^question-bank\/grade-11\//,'');
  assert.ok(!rel.includes('/')&&!rel.includes('..'),'Invalid bank path');
  return {ok:true,json:async()=>json(s),text:async()=>read(s)};
 }};
 vm.createContext(ctx);
 vm.runInContext(read('shared/practice-bank-adapter-v55.js'),ctx);
 vm.runInContext(read('shared/multi-unit-planner-v56.js'),ctx);
 const a=ctx.PSNPracticeBankV55,p=ctx.PSNMultiUnitV56;
 assert.equal(a.expected[6],234);
 assert.equal(p.isValidUnits([1,2,3,4,5,6]),true);
 assert.equal(p.isValidUnits([1,7]),false);
 const banks=await Promise.all([1,2,3,4,5,6].map(u=>a.loadBank(u,'question-bank/grade-11/')));
 const totals=Array.from(banks,b=>b.questions.length);
 assert.deepEqual(totals,[...originalCounts,234]);
 assert.equal(sum(totals),1924);
 const all=banks.flatMap(b=>b.questions);
 assert.equal(new Set(all.map(q=>q.id)).size,1924);
 const six=banks[5].questions,t61=six.filter(q=>q.id.includes('-T61-')),t62=six.filter(q=>q.id.includes('-T62-')),t63=six.filter(q=>q.id.includes('-T63-'));
 assert.equal(t61.length,79);assert.equal(t62.length,77);assert.equal(t63.length,78);
 for(const id of holds)assert.ok(!six.some(q=>q.id===id),'Figure question wrongly selectable: '+id);
 assert.equal(new Set(six.map(q=>q.id)).size,234);
 assert.ok(six.every(q=>q.active&&q.grade===11&&q.unit===6&&q.boardEligible===false&&
   q.assessmentClassification==='summative-topic-provisional'&&q.sloCodes.length===0&&
   q.cognitiveLevel==='Unspecified'&&q.difficulty==='Unspecified'&&!q.stimulusSetId));
 assert.equal(t61.filter(q=>q.situationBased).length,16);
 assert.equal(t62.filter(q=>q.situationBased).length,18);
 assert.equal(t63.filter(q=>q.situationBased).length,19);
 assert.equal(six.filter(q=>q.situationBased).length,53);
 assert.ok(t61.every(q=>q.topicSloCodes.join(',')==='P-11-B-33,P-11-B-34'));
 assert.ok(t62.every(q=>q.topicSloCodes.join(',')==='P-11-B-41,P-11-B-42'));
 assert.ok(t63.every(q=>q.topicSloCodes.join(',')==='P-11-B-35'));
 assert.equal(t63.some(q=>q.id==='XI-U06-T63-MCQ-0024'||q.id==='XI-U06-T63-MCQ-0080'),false);
 for(const [original,live] of [[first,t61],[second,t62],[third,t63]]){
  for(const q of live){
   const o=original.questions[q.sourceQuestionNumber-1];
   assert.equal(q.id,o.id);assert.equal(q.stem,o.stem);
   assert.equal(q.correctOptionId,o.correctOptionId);
   assert.equal(q.explanation,o.explanation);
   assert.equal(JSON.stringify(q.options),JSON.stringify(o.options),'Option text or ordering changed for '+q.id);
  }
 }
 assert.equal(p.plan(all,six,[6],'random',20).possible,true);
 assert.equal(p.plan(all,all,[1,2,3,4,5,6],'random',30).possible,true);
 assert.equal(p.plan(all,all,[6],'scenario',20).possible,false);
 assert.equal(p.plan(all,all,[1,6],'scenario',20).possible,false);
 assert.equal(p.plan(all,all,[1,6],'grouped',20).possible,true);
 assert.equal(p.plan(all,all.filter(q=>q.unit!==6),[1,2,3,4,5],'scenario',20).possible,true);
 const manifest=json('question-bank/manifest.json'),xi=manifest.grades.find(g=>g.grade===11).units;
 assert.deepEqual(xi.map(x=>x.liveMcqCount),[...originalCounts,234]);
 assert.equal(sum(xi.slice(0,5).map(x=>x.liveMcqCount)),1690);
 assert.equal(sum(xi.map(x=>x.liveMcqCount)),1924);
 assert.equal(xi[5].sourceTopicMcqCount,240);
 assert.equal(xi[5].sourceFigureHeldCount,6);
 assert.equal(xi[5].independentSharedStimulusGroupCount,0);
 assert.equal(xi[5].standaloneSituationQuestionCount,53);
 assert.equal(xi[5].exactFbiseModeReady,false);
 const course=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(course.status,'planned');
 assert.equal(course.questionBankCount,0);
 assert.equal(course.partialTestBuilderMcqCount,234);
 assert.equal(course.sourceTopicMcqCount,240);
 assert.equal(course.sourceFigureHeldCount,6);
 assert.ok(read('portal/index.html').includes('unit-06-topic-63-preview.html'));
 assert.ok(read('portal/index.html').includes('build-your-physics-test.html?unit=6'));
 assert.ok(!fs.existsSync(path.join(root,'portal','unit-06.html')),'Full Unit6 course not yet released');
 assert.ok(!fs.existsSync(path.join(root,'portal','Grade11_Unit6_COMPLETE_MASTER_ALL.pdf')),'Source PDF leaked');
 assert.ok(read('build-your-physics-test.html').includes('Topics 6.1–6.3'));
 console.log('V79 STATIC PASS: original 1,690 preserved; 79 + 77 = 234 Unit6; 1,846 total, four held diagrams, zero fake scenario/SLO tags.');
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.css':'text/css'};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+p);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'text/plain','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
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
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('234 eligible MCQ'));
  assert.equal(await page.locator('input[name="unit"][value="6"]').isChecked(),true);
  assert.equal(await page.locator('input[name="unit"]:checked').count(),1);
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  assert.equal(await page.locator('#choices label').count(),4);
  await page.locator('#choices input[type="radio"]').first().check();
  await page.locator('#submit').click();
  await page.waitForFunction(()=>!document.getElementById('result').classList.contains('hidden'));
  assert.equal(await page.locator('#save-result').isDisabled(),true,'No server-authoritative school grade for Unit6');
  assert.match(await page.locator('#review').textContent(),/Correct answer:/);
  await page.goto(base+'build-your-physics-test.html?units=1,6',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('509 eligible MCQ'));
  await page.locator('#arrangement').selectOption('grouped');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.goto(base+'build-your-physics-test.html?unit=6',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('234 eligible MCQ'));
  await page.locator('#arrangement').selectOption('scenario');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false);
  await page.locator('#arrangement').selectOption('random');
  await page.locator('#scope').selectOption('summative');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false,'No falsely certified item-level SLOs');
  await page.locator('#scope').selectOption('all');
  await page.locator('#allUnits').click();
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('1924 eligible MCQ'));
  await page.locator('#quantity').selectOption('30');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.setViewportSize({width:390,height:844});
  const dim=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dim.scroll<=dim.width+2,'Mobile builder overflow: '+JSON.stringify(dim));
  const out=path.join(root,'qa-artifacts','unit06-v79');fs.mkdirSync(out,{recursive:true});
  await page.screenshot({path:path.join(out,'v79-390px-builder.png')});
  assert.deepEqual(errors,[]);
  console.log('V79 BROWSER PASS: 234 U6 available, U1+U6 grouped, six-unit 1924, scenario/summative safe, local grading and 390px view.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
(async()=>{await verifySource();await verifyBrowser();})().catch(err=>{console.error('FAIL V79',err);process.exitCode=1;});
