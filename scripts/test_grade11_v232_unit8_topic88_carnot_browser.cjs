#!/usr/bin/env node
'use strict';
/* V232: source-checked NBF XI Unit 8 original pp143–145 and FBISE outcomes.
 * Test Carnot's exact cycle + worked examples with real desktop/mobile Chromium.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8'),json=p=>JSON.parse(read(p));
const cat=json('portal/learning-catalog.json');
const src=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const bank=json('question-bank/manifest.json');
const units=cat.grades.find(g=>g.grade===11).units,u8=units.find(u=>u.unit===8),u7=units.find(u=>u.unit===7);
const html=read('portal/unit-08-topic88-carnot-engine-v232.html');
const prev=read('portal/unit-08-topic87-second-law-v231.html');
const quick=read('portal/exam-quick-access.html'),nav=read('shared/navigation.js');
const target='./unit-08-topic88-carnot-engine-v232.html';
const evidenceDir=path.join(ROOT,'qa-artifacts/grade11-v232-unit08-topic88-carnot-browser');
function sourceScience(){
 assert.equal(src.version,'V224');
 const topic=src.sections.find(x=>x.code==='8.8');
 assert.deepEqual([topic.title,...topic.pages],["Carnot's Engine",143,145]);
 assert.deepEqual(topic.subtopics.map(x=>[x.code,...x.pages]),[['8.8.1',144,145],['8.8.2',145,145]]);
 assert.deepEqual(topic.slo,['P-11-C-16','P-11-C-23']);
 const found=src.officialFramework.slos.filter(x=>topic.slo.includes(x.printedCode));
 assert.deepEqual(found.map(x=>[x.printedCode,x.assessment,x.cognitive,x.frameworkPdfPage]),[
  ['P-11-C-16','Summative','Knowledge + Understanding',13],
  ['P-11-C-23','Summative','Knowledge',14]]);
 assert.deepEqual(src.figures.filter(x=>['8.16','8.17'].includes(x.figure)).map(x=>[x.figure,x.printedPage,x.sourceImageNotPublished]),[
  ['8.16',143,true],['8.17',143,true]]);
 assert.deepEqual(src.examples.find(x=>x.id==='Example 8.4').printedPages,[145,145]);
 assert.equal(src.assignments.find(x=>x.id==='Assignment 8.4').printedPage,145);
 assert.equal(src.sections.find(x=>x.code==='8.9').pages[0],145);
 assert.equal(u8.status,'planned');
 assert.equal(u8.assessmentStatus,'not-published');
 assert.equal(u8.questionBankCount,0);assert.deepEqual(u8.resourceIds,[]);
 assert.equal(u8.simulationCount,4);
 assert.equal(u8.learningPreviewStatus,'public-topic-8.1-unscored-study-teacher-review');
 assert.deepEqual(u8.additionalLearningPreviews.map(x=>x.topic),['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10']);
 assert.deepEqual(u8.additionalLearningPreviews[6],{
  topic:'8.8',title:"Carnot's Engine: Cycle, Efficiency and Theorem",
  href:target,sourcePages:[143,145],access:'public-unscored-study-teacher-review'
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
 assert.match(u8.studentNotice,/unscored learning preview/);
 assert.match(u8.studentNotice,/No Unit8 scored bank/);
 assert.equal(u7.questionBankCount,0);assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(cat.resources.length,59);
 assert.deepEqual(bank.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
 assert.equal(src.releaseGate.studentScoredUnit8Mcqs,0);
 assert.equal(quick.split('id="unit8-unscored-study-preview"').length-1,1);
 assert.equal(quick.split('href="'+target+'"').length-1,1);
 for(const topic of ['8.1','8.2','8.3','8.4','8.5','8.6','8.7'])assert.ok(quick.includes('Study Topic '+topic));
 assert.ok(quick.includes('Chapter exercises starting on p.150 remain planned'));
 assert.ok(!quick.includes('build-your-physics-test.html?unit=8'));
 assert.ok(nav.includes("['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10'].includes(study.topic)"));
 assert.ok(nav.includes('Unit 8 · Topic 8.8 Carnot Engine and Efficiency'));
 assert.ok(nav.includes('Unit 8 · Topic 8.9 Refrigerator and Cooling/Heating COP'));
 assert.ok(nav.includes('Unit 8 · Topic 8.10 Entropy, Sign Convention and Energy'));
 assert.ok(prev.includes('href="'+target+'"'));
 for(const id of ['lesson-status','principle','stages','cycle-explorer','stage-title','stage-description',
  'efficiency','work-equation','heat-efficiency-equation','carnot-equation','theorem','example84',
  'example84-solution','example84-result','assignment84','assignment84-solution','assignment84-result',
  'calculator','temperature-calculator','temperature-calculate','temp-hot','temp-cold','temperature-result',
  'heat-calculator','heat-calculate','heat-input','heat-percent','heat-result','absolute-zero-caution',
  'self-check','continue'])assert.ok(html.includes('id="'+id+'"'),'Missing lesson section '+id);
 assert.ok(html.includes('data-academic-review="pending" data-scored-release="false"'));
 assert.match(html,/Original printed pages 143–145/);
 assert.match(html,/P-11-C-16 and P-11-C-23/);
 assert.match(html,/Carnot's theorem/);
 assert.match(html,/Q<sub>H<\/sub> − Q<sub>C<\/sub>/);
 assert.match(html,/η<sub>Carnot<\/sub> = 1 − T<sub>C<\/sub> \/ T<sub>H<\/sub>/);
 assert.match(html,/two isothermal/);assert.match(html,/two adiabatic/);
 assert.match(html,/673 K/);assert.match(html,/303 K/);
 assert.match(html,/approximately 55%/);assert.match(html,/1.6 kJ/);assert.match(html,/2.4 kJ/);
 assert.match(html,/not a measured real-engine result/);
 assert.equal((html.match(/data-stage="[0-3]"/g)||[]).length,4);
 assert.equal((html.match(/<details><summary>/g)||[]).length,5);
 assert.ok(!html.includes('grade11-answers.json')&&!html.includes('build-your-physics-test.html?unit=8'));
 for(const banned of ['getAuth(','getFirestore(','initializeAppCheck','indexedDB','localStorage','sessionStorage','navigator.sendBeacon']){
  assert.ok(!html.includes(banned),'No student-account/storage/scored side effect: '+banned);
 }
 // Independent derivations; do not use calculator's implementation to assert itself.
 const bookKelvinEfficiency=100*(1-303/673);
 const preciseKelvinEfficiency=100*(1-(30+273.15)/(400+273.15));
 assert.ok(Math.abs(bookKelvinEfficiency-54.97771174)<0.0001);
 assert.ok(Math.abs(preciseKelvinEfficiency-54.96546)<0.001);
 assert.equal(4*.4,1.6);assert.equal(4-4*.4,2.4);
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
 const file=path.resolve(ROOT,'.'+pathname);
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
   const link=future.locator('a[href*="unit-08-topic88-carnot-engine-v232.html"]');
   assert.equal(await link.count(),1);
   assert.equal(await future.locator('a[href*="unit-08-topic87-second-law-v231.html"]').count(),1);
   assert.equal(await future.locator('a[href*="build-your-physics-test.html?unit=8"]').count(),0);
   await link.click();
  }else if(entry==='quick'){
   assert.equal((await page.goto(base+'portal/exam-quick-access.html',{waitUntil:'domcontentloaded'})).status(),200);
   const section=page.locator('#unit8-unscored-study-preview');
   assert.equal(await section.count(),1);
   assert.equal(await section.locator('a[href="'+target+'"]').count(),1);
   assert.equal(await section.locator('a[href*="build-your-physics-test"]').count(),0);
   await section.locator('a[href="'+target+'"]').click();
  }else{
   assert.equal((await page.goto(base+'portal/unit-08-topic88-carnot-engine-v232.html',{waitUntil:'domcontentloaded'})).status(),200);
  }
  await page.waitForURL(u=>u.pathname==='/portal/unit-08-topic88-carnot-engine-v232.html',{timeout:15000});
  assert.equal(await page.locator('#lesson-status[data-academic-review="pending"][data-scored-release="false"]').count(),1);
  assert.equal(await page.locator('h1').count(),1);
  const stages=page.locator('#cycle-explorer [data-stage]');
  assert.equal(await stages.count(),4);
  const words=['Isothermal expansion','Adiabatic expansion','Isothermal compression','Adiabatic compression'];
  for(let i=0;i<4;i++){
   await stages.nth(i).click();
   assert.match(await page.locator('#stage-title').innerText(),new RegExp(words[i]));
   assert.equal(await stages.nth(i).getAttribute('aria-pressed'),'true');
   for(let j=0;j<4;j++)if(j!==i)assert.equal(await stages.nth(j).getAttribute('aria-pressed'),'false');
  }
  await page.locator('#example84-solution summary').click();
  assert.match(await page.locator('#example84-result').innerText(),/55%/);
  await page.locator('#assignment84-solution summary').click();
  assert.match(await page.locator('#assignment84-result').innerText(),/2.4 kJ/);
  await page.locator('#temperature-calculate').click();
  let value=await page.locator('#temperature-result').innerText();
  assert.match(value,/673.15 K/);assert.match(value,/303.15 K/);
  assert.match(value,/maximum Carnot efficiency = 54\.9/);
  await page.locator('#temp-cold').fill('500');
  await page.locator('#temperature-calculate').click();
  assert.match(await page.locator('#temperature-result').innerText(),/hot temperature strictly greater/);
  await page.locator('#temp-hot').fill('400');
  await page.locator('#temp-cold').fill('-273.15');
  await page.locator('#temperature-calculate').click();
  assert.match(await page.locator('#temperature-result').innerText(),/above absolute zero/);
  await page.locator('#heat-calculate').click();
  value=await page.locator('#heat-result').innerText();
  assert.match(value,/1.6 kJ/);assert.match(value,/2.4 kJ/);
  await page.locator('#heat-percent').fill('100');
  await page.locator('#heat-calculate').click();
  assert.match(await page.locator('#heat-result').innerText(),/strictly between 0% and 100%/);
  await page.locator('#heat-input').fill('');
  await page.locator('#heat-calculate').click();
  assert.match(await page.locator('#heat-result').innerText(),/positive heat input/);
  assert.equal(await page.locator('#self-check details').count(),5);
  await page.locator('#self-check details').nth(3).locator('summary').click();
  assert.match(await page.locator('#self-check details').nth(3).innerText(),/2.4 kJ/);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Horizontal overflow on Carnot lesson at '+width+': '+overflow);
  assert.deepEqual(errors,[],'No client JS errors for the public unscored Carnot lesson');
  return {viewport:width,entry,sourcePages:[143,145],topic:'8.8',
   fourCycleStages:4,example84MaximumEfficiencyPercent:55,assignment84RejectedHeatKj:2.4,
   scoredMcqs:0,academicReview:'PENDING',overflow};
 }finally{await page.close()}
}
(async()=>{sourceScience();fs.mkdirSync(evidenceDir,{recursive:true});const base=await serve();let browser;
 try{browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const cases=[await browserCase(browser,base,1280,'sidebar'),await browserCase(browser,base,390,'quick'),await browserCase(browser,base,320,'direct')];
 fs.writeFileSync(path.join(evidenceDir,'evidence.json'),JSON.stringify({
   version:'V232',source:'Owner original NBF XI Unit 8 printed pp143–145 visually checked',
   originalTheorySLOs:['P-11-C-16','P-11-C-23'],textbookFiguresCopied:false,
   sourceExample:'8.4',sourceAssignment:'8.4',studentScoredUnit8Mcqs:0,
   pinnedOriginalUnit1to6Mcqs:2250,independentHumanAcademicApproval:'PENDING',cases
 },null,2)+'\n');
 console.log('V232 PASS: Carnot original source, cycle four stages, book example and assignment, 1280/390/320 real browsers, all release holds.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(err=>{console.error('V232 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
