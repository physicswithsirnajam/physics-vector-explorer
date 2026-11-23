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
 assert.equal(first.questions.filter(q=>q.active).length,80);
 assert.equal(second.questions.filter(q=>q.active).length,80);
 assert.equal(third.questions.filter(q=>q.active).length,80);
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
 assert.equal(a.expected[6],560);
 assert.equal(p.isValidUnits([1,2,3,4,5,6]),true);
 assert.equal(p.isValidUnits([1,7]),false);
 const banks=await Promise.all([1,2,3,4,5,6].map(u=>a.loadBank(u,'question-bank/grade-11/')));
 const totals=Array.from(banks,b=>b.questions.length);
 assert.deepEqual(totals,[...originalCounts,560]);
 assert.equal(sum(totals),2250);
 const all=banks.flatMap(b=>b.questions);
 assert.equal(new Set(all.map(q=>q.id)).size,2250);
 const six=banks[5].questions,t61=six.filter(q=>q.id.includes('-T61-')),t62=six.filter(q=>q.id.includes('-T62-')),t63=six.filter(q=>q.id.includes('-T63-')),t64=six.filter(q=>q.id.includes('-T64-')),t65=six.filter(q=>q.id.includes('-T65-')),t66=six.filter(q=>q.id.includes('-T66-')),t67=six.filter(q=>q.id.includes('-T67-'));
 assert.equal(t61.length,80);assert.equal(t62.length,80);assert.equal(t63.length,80);assert.equal(t64.length,80);assert.equal(t65.length,80);assert.equal(t66.length,80);assert.equal(t67.length,80);
 for(const id of holds)assert.ok(six.some(q=>q.id===id&&q.referenceFigureId),'Verified figure question missing: '+id);
 assert.equal(new Set(six.map(q=>q.id)).size,560);
 assert.ok(six.every(q=>q.active&&q.grade===11&&q.unit===6&&q.boardEligible===false&&
   q.assessmentClassification==='summative-topic-provisional'&&q.sloCodes.length===0&&
   q.cognitiveLevel==='Unspecified'&&q.difficulty==='Unspecified'&&!q.stimulusSetId));
 assert.equal(t61.filter(q=>q.situationBased).length,16);
 assert.equal(t62.filter(q=>q.situationBased).length,20);
 assert.equal(t63.filter(q=>q.situationBased).length,20);
 assert.equal(t64.filter(q=>q.situationBased).length,20);
 assert.equal(t65.filter(q=>q.situationBased).length,20);
 assert.equal(t66.filter(q=>q.situationBased).length,20);
 assert.equal(t67.filter(q=>q.situationBased).length,20);
 assert.equal(six.filter(q=>q.situationBased).length,136);
 assert.ok(t61.every(q=>q.topicSloCodes.join(',')==='P-11-B-33,P-11-B-34'));
 assert.ok(t62.every(q=>q.topicSloCodes.join(',')==='P-11-B-41,P-11-B-42'));
 assert.ok(t63.every(q=>q.topicSloCodes.join(',')==='P-11-B-35'));
 assert.ok(t64.every(q=>q.topicSloCodes.join(',')==='P-11-B-36,P-11-B-37,P-11-B-38'));
 assert.ok(t65.every(q=>q.topicSloCodes.join(',')==='P-11-B-40'));
 assert.ok(t65.every(q=>q.formativeContextSloCodes.join(',')==='P-11-B-39'));
 assert.ok(t65.every(q=>q.cognitiveLevel==='Unspecified'&&q.sloCodes.length===0));
 assert.ok(t67.every(q=>q.topicSloCodes.join(',')==='P-11-B-43'&&q.topicOfficialCognitiveLevel==='Understanding'&&q.sourceKeyCognitiveTag===null));
 assert.ok(t66.every(q=>q.topicSloCodes.join(',')==='P-11-B-40,P-11-B-44'));
 assert.ok(t66.every(q=>q.formativeContextSloCodes.join(',')==='P-11-B-39'));
 assert.ok(t66.every(q=>q.cognitiveLevel==='Unspecified'&&q.sloCodes.length===0));
 assert.equal(t63.some(q=>q.id==='XI-U06-T63-MCQ-0024'||q.id==='XI-U06-T63-MCQ-0080'),true);
 for(const [original,live] of [[first,t61],[second,t62],[third,t63],[json('question-bank/grade-11/unit-06-topic-64-v82-80-source.json'),t64],[json('question-bank/grade-11/unit-06-topic-65-v84-80-source.json'),t65],[json('question-bank/grade-11/unit-06-topic-66-v86-80-source.json'),t66],[json('question-bank/grade-11/unit-06-topic-67-v88-80-source.json'),t67]]){
  for(const q of live){
   const o=original.questions[q.sourceQuestionNumber-1];
   if(o.id.startsWith('XI-U06-T64-MCQ-')&&[28,51,52,67].includes(o.sourceQuestionNumber)){
     const x=json('question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json').replacements.find(c=>c.originalId===o.id);
     assert.ok(x,'Missing teacher-approved safe variant for '+o.id);
     assert.equal(q.id,x.practiceId);assert.equal(q.stem,x.proposedStem);
     assert.equal(q.sourceOriginalId,o.id);
     assert.equal(q.correctOptionId,o.correctOptionId);
     assert.equal(q.explanation,x.explanation);
     assert.equal(JSON.stringify(q.options),JSON.stringify(x.proposedOptions));
     assert.equal(q.practiceOverlayVersion,'V111');
     assert.equal(q.boardEligible,false);assert.deepEqual(Array.from(q.sloCodes),[]);
    }else if(o.id.startsWith('XI-U06-T65-MCQ-')&&[61,67,78].includes(o.sourceQuestionNumber)){
     const x=json('question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json').replacements.find(c=>c.originalId===o.id);
     assert.ok(x,'Missing teacher-approved Bernoulli safety variant for '+o.id);
     assert.equal(q.id,x.practiceId);assert.equal(q.stem,x.proposedStem);
     assert.equal(q.sourceOriginalId,o.id);
     assert.equal(q.correctOptionId,o.correctOptionId);
     assert.equal(q.explanation,x.explanation);
     assert.equal(JSON.stringify(q.options),JSON.stringify(x.proposedOptions));
     assert.equal(q.practiceOverlayVersion,'V114');
     assert.equal(q.boardEligible,false);assert.deepEqual(Array.from(q.sloCodes),[]);
     assert.equal(q.cognitiveLevel,'Unspecified');
    }else{
     assert.equal(q.id,o.id);assert.equal(q.stem,o.stem);
     assert.equal(q.correctOptionId,o.correctOptionId);
     assert.equal(q.explanation,o.explanation);
     assert.equal(JSON.stringify(q.options),JSON.stringify(o.options),'Unexpected original source change: '+q.id);
    }
  }
 }
 assert.equal(p.plan(all,six,[6],'random',20).possible,true);
 assert.equal(p.plan(all,all,[1,2,3,4,5,6],'random',30).possible,true);
 assert.equal(p.plan(all,all,[6],'scenario',20).possible,false);
 assert.equal(p.plan(all,all,[1,6],'scenario',20).possible,false);
 assert.equal(p.plan(all,all,[1,6],'grouped',20).possible,true);
 assert.equal(p.plan(all,all.filter(q=>q.unit!==6),[1,2,3,4,5],'scenario',20).possible,true);
 const manifest=json('question-bank/manifest.json'),xi=manifest.grades.find(g=>g.grade===11).units;
 assert.deepEqual(xi.map(x=>x.liveMcqCount),[...originalCounts,560]);
 assert.equal(sum(xi.slice(0,5).map(x=>x.liveMcqCount)),1690);
 assert.equal(sum(xi.map(x=>x.liveMcqCount)),2250);
 assert.equal(xi[5].sourceTopicMcqCount,560);
 assert.equal(xi[5].sourceFigureHeldCount,0);
 assert.equal(xi[5].independentSharedStimulusGroupCount,0);
 assert.equal(xi[5].standaloneSituationQuestionCount,136);
 assert.equal(xi[5].exactFbiseModeReady,false);
 const course=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(course.status,'planned');
 assert.equal(course.questionBankCount,0);
 assert.equal(course.partialTestBuilderMcqCount,560);
 assert.equal(course.sourceTopicMcqCount,560);
 assert.equal(course.sourceFigureHeldCount,0);
 assert.ok(read('portal/index.html').includes('unit-06-topic-63-preview.html'));
 assert.ok(read('portal/index.html').includes('build-your-physics-test.html?unit=6'));
 assert.ok(!fs.existsSync(path.join(root,'portal','unit-06.html')),'Full Unit6 course not yet released');
 assert.ok(!fs.existsSync(path.join(root,'portal','Grade11_Unit6_COMPLETE_MASTER_ALL.pdf')),'Source PDF leaked');
 assert.ok(read('build-your-physics-test.html').includes('Topics 6.1–6.7'));
 console.log('V79 REGRESSION PASS: original 1,690 preserved; current seven-topic Unit6 = 560; six verified figure questions; no fake group/SLO tags.');
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
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('560 eligible MCQ'));
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
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('835 eligible MCQ'));
  await page.locator('#arrangement').selectOption('grouped');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.goto(base+'build-your-physics-test.html?unit=6',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('560 eligible MCQ'));
  await page.locator('#arrangement').selectOption('scenario');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false);
  await page.locator('#arrangement').selectOption('random');
  await page.locator('#scope').selectOption('summative');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false,'No falsely certified item-level SLOs');
  await page.locator('#scope').selectOption('all');
  await page.locator('#allUnits').click();
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('2250 eligible MCQ'));
  await page.locator('#quantity').selectOption('30');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.setViewportSize({width:390,height:844});
  const dim=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dim.scroll<=dim.width+2,'Mobile builder overflow: '+JSON.stringify(dim));
  const out=path.join(root,'qa-artifacts','unit06-v79');fs.mkdirSync(out,{recursive:true});
  await page.screenshot({path:path.join(out,'v79-390px-builder.png')});
  assert.deepEqual(errors,[]);
  console.log('V79 BROWSER PASS: 560 U6 available, U1+U6 grouped, six-unit 2250, scenario/summative safe, local grading and 390px view.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
(async()=>{await verifySource();await verifyBrowser();})().catch(err=>{console.error('FAIL V79',err);process.exitCode=1;});
