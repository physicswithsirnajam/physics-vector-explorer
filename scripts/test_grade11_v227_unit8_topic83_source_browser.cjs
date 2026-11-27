#!/usr/bin/env node
'use strict';
/* V227: original NBF Grade XI Unit8 printed pp.134–135, unscored Topic8.3.
 * Checks physical/mathematical correctness, route integration, 1280/390/320
 * browser use, publisher-source isolation and prior bank/release holds.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const catalog=json('portal/learning-catalog.json');
const manifest=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const bank=json('question-bank/manifest.json');
const grade=catalog.grades.find(g=>g.grade===11);
const u8=grade.units.find(u=>u.unit===8),u7=grade.units.find(u=>u.unit===7);
const html=read('portal/unit-08-topic83-gas-laws-v227.html');
const prev=read('portal/unit-08-topic82-kinetic-gases-work-v226.html');
const nav=read('shared/navigation.js'),quick=read('portal/exam-quick-access.html');
const href='./unit-08-topic83-gas-laws-v227.html';
const evidenceDir=path.join(ROOT,'qa-artifacts/grade11-v227-unit08-topic83-gas-laws-browser');
function checkSource(){
 assert.equal(manifest.version,'V224');
 const topic=manifest.sections.find(x=>x.code==='8.3');
 assert.equal(topic.title,'The Gas Laws');
 assert.deepEqual(topic.pages,[134,135]);
 assert.deepEqual(topic.subtopics.map(x=>x.code),['8.3.1','8.3.2','8.3.3']);
 assert.deepEqual(topic.slo,['P-11-C-09','P-11-C-10']);
 assert.deepEqual(manifest.officialFramework.slos.filter(x=>topic.slo.includes(x.printedCode)).map(x=>[x.printedCode,x.assessment,x.cognitive]),[
   ['P-11-C-09','Summative','Understanding'],['P-11-C-10','Summative','Application']]);
 assert.deepEqual(manifest.figures.filter(x=>['8.7','8.8','8.9'].includes(x.figure)).map(x=>[x.figure,x.printedPage,x.sourceImageNotPublished]),[
  ['8.7',134,true],['8.8',134,true],['8.9',135,true]]);
 assert.equal(u8.status,'planned');
 assert.equal(u8.assessmentStatus,'not-published');
 assert.equal(u8.questionBankCount,0);
 assert.deepEqual(u8.resourceIds,[]);
 assert.equal(u8.simulationCount,4);
 assert.equal(u8.learningPreviewStatus,'public-topic-8.1-unscored-study-teacher-review');
 assert.equal(u8.additionalLearningPreviews.length,5);
 assert.equal(u8.additionalLearningPreviews[0].topic,'8.2');
 assert.deepEqual(u8.additionalLearningPreviews[1],{
  topic:'8.3',title:'The Gas Laws: Boyle, Charles and Gay-Lussac',
  href,sourcePages:[134,135],access:'public-unscored-study-teacher-review'
 });
 assert.deepEqual(u8.additionalLearningPreviews[2],{
  topic:'8.4',title:'First Law of Thermodynamics and Four Processes',
  href:'./unit-08-topic84-first-law-v228.html',sourcePages:[135,140],
  access:'public-unscored-study-teacher-review'
 });
 assert.deepEqual(u8.additionalLearningPreviews[3],{
  topic:'8.5',title:'Heat Engine and Petrol Four-Stroke Cycle',
  href:'./unit-08-topic85-heat-engine-v229.html',sourcePages:[140,141],
  access:'public-unscored-study-teacher-review'
 });
 assert.deepEqual(u8.additionalLearningPreviews[4],{
  topic:'8.6',title:'Reversible and Irreversible Processes; Cyclic Processes',
  href:'./unit-08-topic86-reversible-processes-v230.html',sourcePages:[141,142],
  access:'public-unscored-study-teacher-review'
 });
 assert.match(u8.summary,/Six source-based, unscored study lessons/);
 assert.match(u8.studentNotice,/no Unit8 scored bank/i);
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(catalog.resources.length,59);
 assert.deepEqual(bank.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
 assert.equal(manifest.releaseGate.studentScoredUnit8Mcqs,0);
 assert.equal(quick.split('id="unit8-unscored-study-preview"').length-1,1);
 assert.equal(quick.split('href="'+href+'"').length-1,1);
 assert.ok(quick.includes('Study Topic 8.1'));
 assert.ok(quick.includes('Study Topic 8.2'));
 assert.ok(quick.includes('Topic 8.7 onward remain planned.'));
 assert.ok(!quick.includes('build-your-physics-test.html?unit=8'));
 assert.ok(nav.includes("['8.2','8.3','8.4','8.5','8.6'].includes(study.topic)"));
 assert.ok(nav.includes('Unit 8 · Topic 8.2 Kinetic Theory and Work by/on Gas'));
 assert.ok(nav.includes('Unit 8 · Topic 8.3 The Gas Laws'));
 assert.ok(nav.includes('Unit 8 · Topic 8.4 First Law'));
 assert.ok(nav.includes('Unit 8 · Topic 8.5 Heat Engine and Petrol Four-Stroke Cycle'));
 assert.ok(nav.includes('Unit 8 · Topic 8.6 Reversible, Irreversible and Cyclic Processes'));
 assert.ok(prev.includes('href="'+href+'"'));
 for(const id of ['lesson-status','three-laws','boyle','charles','gay-lussac','graphs','investigations',
 'boyle-tool','charles-tool','gay-tool','calc-boyle','calc-charles','calc-gay',
 'boyle-result','charles-result','gay-result','kelvin-note','self-check','continue']) {
  assert.ok(html.includes('id="'+id+'"'),'Missing lesson element '+id);
 }
 assert.ok(html.includes('data-academic-review="pending" data-scored-release="false"'));
 assert.match(html,/printed pages 134–135/);
 assert.match(html,/p ∝ 1\/V/);
 assert.match(html,/V ∝ T/);
 assert.match(html,/p ∝ T/);
 assert.match(html,/p<sub>1<\/sub>V<sub>1<\/sub> = p<sub>2<\/sub>V<sub>2<\/sub>/);
 assert.match(html,/273\.15/);
 assert.match(html,/not<\/strong> a physical claim/);
 assert.match(html,/zero scored|no graded questions/);
 assert.ok(!html.includes('grade11-answers.json'));
 assert.ok(!html.includes('build-your-physics-test.html?unit=8'));
 for(const banned of ['getAuth(','getFirestore(','initializeAppCheck','indexedDB','localStorage','sessionStorage','navigator.sendBeacon']) {
  assert.ok(!html.includes(banned),'Do not introduce tracking/grading/secret state: '+banned);
 }
 // Independent calculations, separate from UI evaluation.
 const boyle=200*10/25,charles=18*360/270,gay=100*450/300;
 assert.equal(boyle,80);assert.equal(charles,24);assert.equal(gay,150);
 assert.equal(100*6/3,200);assert.equal(30+273.15,303.15);
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname),file=path.resolve(ROOT,'.'+pathname);
 if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
}catch{res.writeHead(400);res.end('Bad request')}});
async function serve(){await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});return 'http://127.0.0.1:'+server.address().port+'/'}
async function browserCase(browser,base,width,route){
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  if(route==='sidebar'){
   assert.equal((await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'})).status(),200);
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(document.querySelector('.psn-drawer-loading')?.textContent||'').includes('unit menus'),null,{timeout:20000});
   const future=page.locator('.psn-drawer-future[data-psn-future-units="7,8,9,10"]');
   assert.equal(await future.count(),1);
   await future.locator('summary').click();
   const link=future.locator('a[href*="unit-08-topic83-gas-laws-v227.html"]');
   assert.equal(await link.count(),1);
   assert.equal(await future.locator('a[href*="unit-08-topic82-kinetic-gases-work-v226.html"]').count(),1);
   assert.equal(await future.locator('a[href*="build-your-physics-test.html?unit=8"]').count(),0);
   await link.click();
  }else if(route==='quick'){
   assert.equal((await page.goto(base+'portal/exam-quick-access.html',{waitUntil:'domcontentloaded'})).status(),200);
   const block=page.locator('#unit8-unscored-study-preview');
   assert.equal(await block.count(),1);
   assert.equal(await block.locator('a[href="'+href+'"]').count(),1);
   await block.locator('a[href="'+href+'"]').click();
  }else{
   assert.equal((await page.goto(base+'portal/unit-08-topic83-gas-laws-v227.html',{waitUntil:'domcontentloaded'})).status(),200);
  }
  await page.waitForURL(u=>u.pathname==='/portal/unit-08-topic83-gas-laws-v227.html',{timeout:15000});
  assert.equal(await page.locator('#lesson-status[data-academic-review="pending"][data-scored-release="false"]').count(),1);
  assert.equal(await page.locator('h1').count(),1);
  await page.locator('#calc-boyle').click();
  assert.match(await page.locator('#boyle-result').innerText(),/80 kPa/);
  await page.locator('#calc-charles').click();
  assert.match(await page.locator('#charles-result').innerText(),/24 L/);
  await page.locator('#calc-gay').click();
  assert.match(await page.locator('#gay-result').innerText(),/150 kPa/);
  await page.locator('#b-v2').fill('5');
  await page.locator('#calc-boyle').click();
  assert.match(await page.locator('#boyle-result').innerText(),/400 kPa/);
  await page.locator('#c-t2').fill('0');
  await page.locator('#calc-charles').click();
  assert.match(await page.locator('#charles-result').innerText(),/strictly positive/);
  await page.locator('#g-t2').fill('-1');
  await page.locator('#calc-gay').click();
  assert.match(await page.locator('#gay-result').innerText(),/strictly positive/);
  assert.equal(await page.locator('#self-check details').count(),4);
  await page.locator('#self-check details').first().locator('summary').click();
  assert.match(await page.locator('#self-check details').first().innerText(),/200 kPa/);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Unexpected horizontal overflow at '+width+': '+overflow);
  assert.deepEqual(errors,[],'No browser errors');
  return {viewport:width,route,topic:'8.3',originalPages:[134,135],boyleKpa:80,charlesLitres:24,gayKpa:150,studentScoredQuestionCount:0,academicApproval:'PENDING',overflow};
 }finally{await page.close()}
}
(async()=>{checkSource();fs.mkdirSync(evidenceDir,{recursive:true});const base=await serve();let browser;
 try{browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const cases=[await browserCase(browser,base,1280,'sidebar'),await browserCase(browser,base,390,'quick'),await browserCase(browser,base,320,'direct')];
 fs.writeFileSync(path.join(evidenceDir,'evidence.json'),JSON.stringify({version:'V227',source:'Owner original NBF XI printed pp134-135 visually checked',framework:'P-11-C-09 and P-11-C-10 summative',originalFiguresCopied:false,grade11PinnedMcqsUnchanged:2250,unit8ScoredMcqs:0,teacherScienceApproval:'PENDING',cases},null,2)+'\n');
 console.log('V227 PASS: Unit8 8.3 source, calculations, three real browser routes 1280/390/320, no scored release.')}
 finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(err=>{console.error('V227 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
