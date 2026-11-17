#!/usr/bin/env node
'use strict';
/* V59: exact imported master inventory and live browser check.
 * Provisional public self-practice, not examiner approval.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),shots=path.join(root,'qa-artifacts','u05-master-v59');
fs.mkdirSync(shots,{recursive:true});
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const manifest=read('question-bank/manifest.json');
const master=read('question-bank/grade-11/unit-05-master-topic-v59-317.json');
const unit5=manifest.grades.find(g=>g.grade===11).units.find(u=>u.unit===5);
function sourceCheck(){
 assert.equal(master.grade,11);assert.equal(master.unit,5);assert.equal(master.status,'practice-pilot');
 assert.equal(master.publicSelfPractice,true);assert.equal(master.secureExam,false);
 assert.equal(master.sourceQuestionCount,320);assert.equal(master.questionCount,317);
 assert.equal(master.straightQuestions,221);assert.equal(master.scenarioQuestions,96);
 assert.equal(master.questions.length,317);assert.equal(master.scenarioGroups,24);
 assert.deepEqual(master.importedTopicCounts,{'5.1':79,'5.2':78,'5.3':80,'5.4':80});
 assert.equal(master.excludedPendingFigureReview.length,3);
 const held=new Set(master.excludedPendingFigureReview.map(q=>q.id));
 assert.deepEqual([...held].sort(),[
  'g11-u05-master-t51-q004','g11-u05-master-t52-q028','g11-u05-master-t52-q029'
 ].sort());
 assert.equal(master.questions.filter(q=>q.stimulusSetId).length,96);
 const groups=new Map(),unique=new Set();
 const expectedSlo={'5.1':'P-11-B-30','5.2':'P-11-B-31','5.3':'P-11-B-29','5.4':'P-11-B-32'};
 for(const q of master.questions){
  assert.ok(!unique.has(q.id));unique.add(q.id);
  assert.ok(!held.has(q.id));
  assert.equal(q.status,'teacher-review-pending');
  assert.equal(q.boardEligible,false);
  assert.equal(q.difficulty,'Unspecified');
  assert.equal(q.options.length,4);
  assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation&&q.explanation.trim());
  assert.equal(q.sloCodes.length,1);
  assert.equal(q.sloCodes[0],expectedSlo[q.source.topic]);
  assert.equal(q.source.itemNumber,q.sourceQuestionNumber);
  assert.equal(q.source.document,master.sourceDocument);
  if(q.stimulusSetId){
   if(!groups.has(q.stimulusSetId))groups.set(q.stimulusSetId,[]);
   groups.get(q.stimulusSetId).push(q);
  }
 }
 assert.equal(groups.size,24);
 for(const group of groups.values()){
  assert.equal(group.length,4);
  assert.ok(group.every(q=>q.stimulusHtml===group[0].stimulusHtml));
  assert.ok(group[0].stimulusHtml.length>20);
 }
 assert.equal(unit5.liveMcqCount,349);
 assert.equal(unit5.scenarioGroupCount,26);
 assert.equal(unit5.newMasterImportedCount,317);
 assert.equal(manifest.grades.find(g=>g.grade===11).units.reduce((s,u)=>s+u.liveMcqCount,0),1690);
 assert.equal(read('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===5).questionBankCount,349);
 console.log('PASS V59 static: 317 validated imported MCQs (221 straight + 96 scenario), 24 source scenario groups, 3 diagram questions held.');
}
async function checkAdapter(){
 const ctx={fetch:async url=>{
  const file=String(url);
  assert.match(file,/^(?:\.\.\/)?question-bank\/grade-11\/[a-z0-9.-]+\.json$/);
  return {ok:true,json:async()=>read(file.replace(/^\.\.\//,''))};
 }};
 vm.createContext(ctx);
 vm.runInContext(fs.readFileSync(path.join(root,'shared/practice-bank-adapter-v55.js'),'utf8'),ctx);
 const result=await ctx.PSNPracticeBankV55.loadBank(5,'question-bank/grade-11/');
 assert.equal(result.questions.length,349);
 assert.equal(new Set(result.questions.map(q=>q.id)).size,349);
 assert.equal(result.questions.filter(q=>q.stimulusSetId).length,104); // 8 from Sets A/B + 96 new
 assert.equal(new Set(result.questions.filter(q=>q.stimulusSetId).map(q=>q.stimulusSetId)).size,26);
 for(const old of result.questions.slice(0,32))assert.ok(/^U05B?-MCQ-/.test(old.id));
 for(const [i,q] of result.questions.slice(32).entries()){
  const original=master.questions[i];
  assert.equal(q.stem,original.stem);
  assert.equal(q.explanation,original.explanation);
  assert.equal(q.correctOptionId,original.correctOptionId);
  assert.deepEqual(JSON.parse(JSON.stringify(q.options)),original.options);
 }
 console.log('PASS V59 adapter: 349 total original and imported MCQs, 26 intact groups, no question/key/option modifications.');
}
const contentType={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=path.resolve(root,'.'+p);
  if(!file.startsWith(root+path.sep))throw Error('Outside');
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':contentType[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(404);res.end('Missing')}
});
async function browserTest(){
 await new Promise((ok,fail)=>server.listen(0,'127.0.0.1',err=>err?fail(err):ok()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1360,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'build-your-physics-test.html?unit=5',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount')?.textContent.includes('349 eligible MCQ'));
  for(const count of ['20','40','60']){
   await page.locator('#quantity').selectOption(count);
   assert.equal(await page.locator('#quickStartLink').isVisible(),true,'Unit 5 '+count+' MCQs should be runnable');
  }
  await page.screenshot({path:path.join(shots,'01-unit5-349-mcq-builder.png'),fullPage:false});
  await page.locator('#quantity').selectOption('40');
  await page.locator('#arrangement').selectOption('scenario');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true,'40 questions from 10 full scenario sets should be runnable');
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  assert.match(await page.locator('#setupSummary').textContent(),/40 MCQs/);
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  assert.match(await page.locator('#qcounter').textContent(),/Scenario 1 \(1\/4\)/);
  assert.equal(await page.locator('#stimulusPanel').isVisible(),true);
  await page.screenshot({path:path.join(shots,'02-u05-complete-scenario.png'),fullPage:false});
  for(let i=2;i<=4;i++){
   await page.locator('#next').click();
   assert.match(await page.locator('#qcounter').textContent(),new RegExp('Scenario 1 \\('+i+'/4\\)'));
  }
  page.once('dialog',d=>d.accept());
  await page.locator('#submit').click();
  await page.waitForFunction(()=>!document.getElementById('result').classList.contains('hidden'));
  assert.equal(await page.locator('#save-result').isDisabled(),true,'Unit 5 cloud save must remain restricted');
  assert.match(await page.locator('#resultMeta').textContent(),/Self-assessment only/);
  await page.screenshot({path:path.join(shots,'03-u05-provisional-report.png'),fullPage:false});
  await page.goto(base+'build-your-physics-test.html?units=1,3,5',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount')?.textContent.includes('844 eligible MCQ'));
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.goto(base+'student-guide.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('question-total')?.textContent==='1690');
  await page.setViewportSize({width:390,height:844});
  const dim=await page.evaluate(()=>({view:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dim.scroll<=dim.view+2,'390px horizontal overflow '+JSON.stringify(dim));
  assert.deepEqual(errors,[]);
  console.log('PASS V59/V60 Chromium: 349 Unit 5 MCQs, 20/40/60-size availability, 40-question intact scenarios, printable ungraded result, 704 three-unit selection and 390px guide.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
}
(async()=>{sourceCheck();await checkAdapter();await browserTest()})().catch(e=>{console.error('FAIL V59',e);server.close();process.exitCode=1;});
