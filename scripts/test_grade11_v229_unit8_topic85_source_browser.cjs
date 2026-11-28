#!/usr/bin/env node
'use strict';
/* V229 source-grounded NBF XI Unit 8 pp.140–141, public unscored Heat Engine.
 * Independently test science + browser routing, cycle calculator and stage UI.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(ROOT,p),'utf8'),json=p=>JSON.parse(read(p));
const catalog=json('portal/learning-catalog.json'),source=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json'),bank=json('question-bank/manifest.json');
const units=catalog.grades.find(g=>g.grade===11).units,u8=units.find(u=>u.unit===8),u7=units.find(u=>u.unit===7);
const html=read('portal/unit-08-topic85-heat-engine-v229.html'),prev=read('portal/unit-08-topic84-first-law-v228.html'),quick=read('portal/exam-quick-access.html'),nav=read('shared/navigation.js');
const target='./unit-08-topic85-heat-engine-v229.html',outDir=path.join(ROOT,'qa-artifacts/grade11-v229-unit08-topic85-heat-engine-browser');
function sourceAndScience(){
 assert.equal(source.version,'V224');
 const section=source.sections.find(x=>x.code==='8.5');
 assert.equal(section.title,'Heat Engine');assert.deepEqual(section.pages,[140,141]);
 assert.deepEqual(section.subtopics,[]);assert.deepEqual(section.slo,['P-11-C-13']);
 const slo=source.officialFramework.slos.find(x=>x.printedCode==='P-11-C-13');
 assert.equal(slo.displayShortDescription,'Operating principle of heat engine');
 assert.equal(slo.assessment,'Summative');assert.equal(slo.cognitive,'Knowledge');
 assert.equal(slo.frameworkPdfPage,13);
 const figure=source.figures.find(x=>x.figure==='8.14');
 assert.equal(figure.printedPage,140);assert.equal(figure.topic,'8.5');
 assert.equal(figure.sourceImageNotPublished,true);
 assert.equal(source.sections.find(x=>x.code==='8.6').pages[0],141);
 assert.equal(u8.status,'planned');assert.equal(u8.assessmentStatus,'not-published');
 assert.equal(u8.questionBankCount,0);assert.deepEqual(u8.resourceIds,[]);
 assert.equal(u8.simulationCount,4);assert.equal(u8.learningPreviewStatus,'public-topic-8.1-unscored-study-teacher-review');
 assert.deepEqual(u8.additionalLearningPreviews.map(x=>x.topic),['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10']);
 assert.deepEqual(u8.additionalLearningPreviews[3],{
  topic:'8.5',title:'Heat Engine and Petrol Four-Stroke Cycle',href:target,
  sourcePages:[140,141],access:'public-unscored-study-teacher-review'
 });
 assert.deepEqual(u8.additionalLearningPreviews[4],{
  topic:'8.6',title:'Reversible and Irreversible Processes; Cyclic Processes',
  href:'./unit-08-topic86-reversible-processes-v230.html',sourcePages:[141,142],
  access:'public-unscored-study-teacher-review'
 });
 assert.deepEqual(u8.additionalLearningPreviews[5],{
  topic:'8.7',title:'Second Law of Thermodynamics: Kelvin and Clausius',
  href:'./unit-08-topic87-second-law-v231.html',sourcePages:[142,143],
  access:'public-unscored-study-teacher-review'
 });
 assert.deepEqual(u8.additionalLearningPreviews[6],{
  topic:'8.8',title:"Carnot's Engine: Cycle, Efficiency and Theorem",
  href:'./unit-08-topic88-carnot-engine-v232.html',sourcePages:[143,145],
  access:'public-unscored-study-teacher-review'
 });
 assert.deepEqual(u8.additionalLearningPreviews[7],{
  topic:'8.9',title:'Refrigerator: Heat Transfer and Cooling/Heating COP',
  href:'./unit-08-topic89-refrigerator-v233.html',sourcePages:[145,147],
  access:'public-unscored-study-teacher-review'
 });
 assert.deepEqual(u8.additionalLearningPreviews[8],{
  topic:'8.10',title:'Entropy: Heat-Flow Signs, Energy and Example/Assignment 8.6',
  href:'./unit-08-topic810-entropy-v234.html',sourcePages:[147,149],
  access:'public-unscored-study-teacher-review'
 });
 assert.match(u8.summary,/Ten source-based, unscored study lessons/);
 assert.match(u8.studentNotice,/No Unit8 scored bank/);
 assert.equal(u7.questionBankCount,0);assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(catalog.resources.length,59);
 assert.deepEqual(bank.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
 assert.equal(source.releaseGate.studentScoredUnit8Mcqs,0);
 assert.equal(quick.split('id="unit8-unscored-study-preview"').length-1,1);
 assert.equal(quick.split('href="'+target+'"').length-1,1);
 assert.ok(quick.includes('Study Topic 8.1')&&quick.includes('Study Topic 8.2')&&quick.includes('Study Topic 8.3')&&quick.includes('Study Topic 8.4'));
 assert.ok(quick.includes('Chapter exercises starting on p.150 remain planned'));
 assert.ok(!quick.includes('build-your-physics-test.html?unit=8'));
 assert.ok(nav.includes("['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10'].includes(study.topic)"));
 assert.ok(nav.includes('Unit 8 · Topic 8.5 Heat Engine and Petrol Four-Stroke Cycle'));
 assert.ok(nav.includes('Unit 8 · Topic 8.6 Reversible, Irreversible and Cyclic Processes'));
 assert.ok(nav.includes('Unit 8 · Topic 8.7 Second Law (Kelvin and Clausius)'));
 assert.ok(nav.includes('Unit 8 · Topic 8.8 Carnot Engine and Efficiency'));
 assert.ok(nav.includes('Unit 8 · Topic 8.9 Refrigerator and Cooling/Heating COP'));
 assert.ok(nav.includes('Unit 8 · Topic 8.10 Entropy, Sign Convention and Energy'));
 assert.ok(prev.includes('href="'+target+'"'));
 for(const id of ['lesson-status','principle','engine-energy-equation','flow','parts','hot-source','cold-sink',
  'working-substance','petrol','calculator','heat-in','heat-out','calculate-engine',
  'engine-result','strokes','stage-panel','stage-panel-title','stage-panel-text','self-check','continue']){
  assert.ok(html.includes('id="'+id+'"'),'Missing source lesson element '+id);
 }
 assert.ok(html.includes('data-academic-review="pending" data-scored-release="false"'));
 assert.match(html,/Original printed pages 140–141/);
 assert.match(html,/W<sub>net,out<\/sub> = Q<sub>H<\/sub> − Q<sub>C<\/sub>/);
 assert.match(html,/ΔU<sub>cycle<\/sub> = 0/);
 assert.match(html,/net work output = \+350 J/);
 assert.match(html,/physically realizable cyclic engine/);
 assert.match(html,/four-stroke/i);assert.match(html,/hot\/cold reservoir/i);
 assert.ok(!html.includes('grade11-answers.json')&&!html.includes('build-your-physics-test.html?unit=8'));
 for(const banned of ['getAuth(','getFirestore(','initializeAppCheck','indexedDB','localStorage','sessionStorage','navigator.sendBeacon']){
  assert.ok(!html.includes(banned),'No tracking, grade or privileged backend '+banned);
 }
 assert.equal(1000-650,350);assert.equal(900-500,400);
 assert.equal(-650+1000,350);
 assert.ok(650<1000);assert.ok(!(1000<900));
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname),file=path.resolve(ROOT,'.'+pathname);
 if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
  res.writeHead(404);res.end('Not found');return;
 }
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
 fs.createReadStream(file).pipe(res);
}catch{res.writeHead(400);res.end('Bad request')}});
async function serve(){await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});return 'http://127.0.0.1:'+server.address().port+'/'}
async function browserCase(browser,base,width,entry){
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  if(entry==='sidebar'){
   assert.equal((await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'})).status(),200);
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(document.querySelector('.psn-drawer-loading')?.textContent||'').includes('unit menus'),null,{timeout:20000});
   const future=page.locator('.psn-drawer-future[data-psn-future-units="7,8,9,10"]');
   assert.equal(await future.count(),1);await future.locator('summary').click();
   const links=future.locator('a[href*="unit-08-topic85-heat-engine-v229.html"]');
   assert.equal(await links.count(),1);
   assert.equal(await future.locator('a[href*="unit-08-topic84-first-law-v228.html"]').count(),1);
   assert.equal(await future.locator('a[href*="build-your-physics-test.html?unit=8"]').count(),0);
   await links.click();
  }else if(entry==='quick'){
   assert.equal((await page.goto(base+'portal/exam-quick-access.html',{waitUntil:'domcontentloaded'})).status(),200);
   const block=page.locator('#unit8-unscored-study-preview');
   assert.equal(await block.count(),1);assert.equal(await block.locator('a[href="'+target+'"]').count(),1);
   assert.equal(await block.locator('a[href*="build-your-physics-test"]').count(),0);
   await block.locator('a[href="'+target+'"]').click();
  }else{
   assert.equal((await page.goto(base+'portal/unit-08-topic85-heat-engine-v229.html',{waitUntil:'domcontentloaded'})).status(),200);
  }
  await page.waitForURL(u=>u.pathname==='/portal/unit-08-topic85-heat-engine-v229.html',{timeout:15000});
  assert.equal(await page.locator('#lesson-status[data-academic-review="pending"][data-scored-release="false"]').count(),1);
  assert.equal(await page.locator('h1').count(),1);
  await page.locator('#calculate-engine').click();
  assert.match(await page.locator('#engine-result').innerText(),/net work output = \+350 J/);
  await page.locator('#heat-in').fill('900');
  await page.locator('#heat-out').fill('500');
  await page.locator('#calculate-engine').click();
  assert.match(await page.locator('#engine-result').innerText(),/net work output = \+400 J/);
  await page.locator('#heat-out').fill('1000');
  await page.locator('#calculate-engine').click();
  assert.match(await page.locator('#engine-result').innerText(),/do not describe a positive-work heat engine/);
  await page.locator('#heat-out').fill('-10');
  await page.locator('#calculate-engine').click();
  assert.match(await page.locator('#engine-result').innerText(),/cannot be negative/);
  await page.locator('#heat-out').fill('0');
  await page.locator('#heat-in').fill('');
  await page.locator('#calculate-engine').click();
  assert.match(await page.locator('#engine-result').innerText(),/must be positive/);
  const buttons=page.locator('#strokes [data-stage]');
  assert.equal(await buttons.count(),4);
  const labels=['Intake (suction) stroke','Compression stroke','Power stroke','Exhaust stroke'];
  for(let i=0;i<4;i++){
   await buttons.nth(i).click();
   assert.equal(await page.locator('#stage-panel-title').innerText(),labels[i]);
   assert.equal(await buttons.nth(i).getAttribute('aria-pressed'),'true');
   for(let j=0;j<4;j++)if(j!==i)assert.equal(await buttons.nth(j).getAttribute('aria-pressed'),'false');
  }
  assert.equal(await page.locator('#self-check details').count(),4);
  await page.locator('#self-check details').nth(1).locator('summary').click();
  assert.match(await page.locator('#self-check details').nth(1).innerText(),/400 J/);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Horizontal overflow at '+width+'px: '+overflow);
  assert.deepEqual(errors,[],'No JS runtime errors on public page');
  return {viewport:width,entry,sourcePages:[140,141],unit:8,topic:'8.5',netWorkDefaultJ:350,netWorkEditedJ:400,
   cycleStageCount:4,scoredMcqs:0,teacherApproval:'PENDING',overflow};
 }finally{await page.close()}
}
(async()=>{sourceAndScience();fs.mkdirSync(outDir,{recursive:true});const base=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const cases=[await browserCase(browser,base,1280,'sidebar'),await browserCase(browser,base,390,'quick'),await browserCase(browser,base,320,'direct')];
  fs.writeFileSync(path.join(outDir,'evidence.json'),JSON.stringify({
   version:'V229',source:'Owner original NBF XI Unit8 pp140–141 visually checked',
   originalSummativeSlo:'P-11-C-13',originalPublisherFigureCopied:false,studentScoredUnit8Mcqs:0,
   originalNumberedTextbookExamplePublished:false,independentTeacherApproval:'PENDING',
   originalUnits1To6PinnedMcqsUnchanged:2250,cases
  },null,2)+'\n');
  console.log('V229 PASS: Heat Engine original source, cyclic energy, four strokes, 1280/390/320 Chromium, no scored release.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(err=>{console.error('V229 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
