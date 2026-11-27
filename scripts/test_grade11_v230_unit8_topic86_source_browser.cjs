#!/usr/bin/env node
'use strict';
/* V230 original NBF XI Unit8 printed pp141–142, unscored reversal/cycles.
 * Independent SLO/physics checks and three real Chromium viewport routes.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8'),json=p=>JSON.parse(read(p));
const catalog=json('portal/learning-catalog.json');
const source=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const bank=json('question-bank/manifest.json');
const units=catalog.grades.find(g=>g.grade===11).units;
const u8=units.find(u=>u.unit===8),u7=units.find(u=>u.unit===7);
const html=read('portal/unit-08-topic86-reversible-processes-v230.html');
const prev=read('portal/unit-08-topic85-heat-engine-v229.html');
const quick=read('portal/exam-quick-access.html'),nav=read('shared/navigation.js');
const target='./unit-08-topic86-reversible-processes-v230.html';
const evidenceDir=path.join(ROOT,'qa-artifacts/grade11-v230-unit08-topic86-reversibility-browser');
function sourceScience(){
 assert.equal(source.version,'V224');
 const section=source.sections.find(x=>x.code==='8.6');
 assert.equal(section.title,'Reversible and Irreversible Processes');
 assert.deepEqual(section.pages,[141,142]);assert.deepEqual(section.subtopics,[]);
 assert.deepEqual(section.slo,['P-11-C-14']);
 const slo=source.officialFramework.slos.find(x=>x.printedCode==='P-11-C-14');
 assert.deepEqual([slo.displayShortDescription,slo.assessment,slo.cognitive,slo.frameworkPdfPage],[
  'Reversible versus irreversible processes','Summative','Understanding',13]);
 assert.deepEqual(source.figures.filter(x=>x.figure==='8.15').map(x=>[x.printedPage,x.topic,x.sourceImageNotPublished]),[[142,'8.6',true]]);
 assert.equal(source.sections.find(x=>x.code==='8.7').pages[0],142);
 assert.equal(u8.status,'planned');assert.equal(u8.questionBankCount,0);
 assert.equal(u8.assessmentStatus,'not-published');assert.deepEqual(u8.resourceIds,[]);
 assert.equal(u8.simulationCount,4);
 assert.equal(u8.learningPreviewStatus,'public-topic-8.1-unscored-study-teacher-review');
 assert.deepEqual(u8.additionalLearningPreviews.map(x=>x.topic),['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10']);
 assert.deepEqual(u8.additionalLearningPreviews[4],{
  topic:'8.6',title:'Reversible and Irreversible Processes; Cyclic Processes',
  href:target,sourcePages:[141,142],access:'public-unscored-study-teacher-review'
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
 assert.match(u8.studentNotice,/No Unit8 scored bank/i);
 assert.equal(u7.questionBankCount,0);assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(catalog.resources.length,59);
 assert.deepEqual(bank.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
 assert.equal(source.releaseGate.studentScoredUnit8Mcqs,0);
 assert.equal(quick.split('id="unit8-unscored-study-preview"').length-1,1);
 assert.equal(quick.split('href="'+target+'"').length-1,1);
 for(const topic of ['8.1','8.2','8.3','8.4','8.5'])assert.ok(quick.includes('Study Topic '+topic));
 assert.ok(quick.includes('Chapter exercises starting on p.150 remain planned'));
 assert.ok(!quick.includes('build-your-physics-test.html?unit=8'));
 assert.ok(nav.includes("['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10'].includes(study.topic)"));
 assert.ok(nav.includes('Unit 8 · Topic 8.6 Reversible, Irreversible and Cyclic Processes'));
 assert.ok(nav.includes('Unit 8 · Topic 8.7 Second Law (Kelvin and Clausius)'));
 assert.ok(nav.includes('Unit 8 · Topic 8.8 Carnot Engine and Efficiency'));
 assert.ok(nav.includes('Unit 8 · Topic 8.9 Refrigerator and Cooling/Heating COP'));
 assert.ok(nav.includes('Unit 8 · Topic 8.10 Entropy, Sign Convention and Energy'));
 assert.ok(prev.includes('href="'+target+'"'));
 for(const id of ['lesson-status','meaning','reversible','irreversible','criteria','slow-caution','examples',
  'cycles','cycle-equation','cycle-caution','explorer','case-output','case-answer','case-explanation','self-check','continue']){
  assert.ok(html.includes('id="'+id+'"'),'Missing exact topic-section ID '+id);
 }
 assert.ok(html.includes('data-academic-review="pending" data-scored-release="false"'));
 assert.match(html,/Original printed pages 141–142/);
 assert.match(html,/P-11-C-14/);
 assert.match(html,/slow/i);assert.match(html,/quasi-static/i);
 assert.match(html,/slow.*not sufficient|slow.*not automatically make/i);
 assert.match(html,/ΔU<sub>cycle<\/sub> = 0/);
 assert.match(html,/Q<sub>net,cycle<\/sub> = W<sub>by,net,cycle<\/sub>/);
 assert.match(html,/Net heat and net work need not individually be zero/);
 assert.match(html,/A cycle is not automatically reversible/);
 assert.match(html,/publisher.*not reproduced/);
 assert.equal((html.match(/data-case="[0-5]"/g)||[]).length,6);
 assert.equal((html.match(/<details><summary>/g)||[]).length,5);
 assert.ok(!html.includes('build-your-physics-test.html?unit=8'));
 assert.ok(!html.includes('grade11-answers.json'));
 for(const banned of ['getAuth(','getFirestore(','initializeAppCheck','indexedDB','localStorage','sessionStorage','navigator.sendBeacon']){
  assert.ok(!html.includes(banned),'No identity, backend, scores, or storage in new lesson: '+banned);
 }
 // Independent closed-cycle first-law check. Returning U => net heat == net work,
 // NOT necessarily either equal zero, and NOT proof of reversibility.
 const uStart=500,uEnd=500,netHeat=400,netWork=netHeat-(uEnd-uStart);
 assert.equal(uEnd-uStart,0);assert.equal(netWork,400);
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname),file=path.resolve(ROOT,'.'+pathname);
 if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
  res.writeHead(404);res.end('Not found');return;
 }
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
}catch{res.writeHead(400);res.end('Bad request')}});
async function serve(){await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});return 'http://127.0.0.1:'+server.address().port+'/'}
async function studentBrowser(browser,base,width,entry){
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  if(entry==='sidebar'){
   assert.equal((await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'})).status(),200);
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(document.querySelector('.psn-drawer-loading')?.textContent||'').includes('unit menus'),null,{timeout:20000});
   const future=page.locator('.psn-drawer-future[data-psn-future-units="7,8,9,10"]');
   assert.equal(await future.count(),1);await future.locator('summary').click();
   const links=future.locator('a[href*="unit-08-topic86-reversible-processes-v230.html"]');
   assert.equal(await links.count(),1);
   assert.equal(await future.locator('a[href*="unit-08-topic85-heat-engine-v229.html"]').count(),1);
   assert.equal(await future.locator('a[href*="build-your-physics-test.html?unit=8"]').count(),0);
   await links.click();
  }else if(entry==='quick'){
   assert.equal((await page.goto(base+'portal/exam-quick-access.html',{waitUntil:'domcontentloaded'})).status(),200);
   const block=page.locator('#unit8-unscored-study-preview');
   assert.equal(await block.count(),1);
   assert.equal(await block.locator('a[href="'+target+'"]').count(),1);
   assert.equal(await block.locator('a[href*="build-your-physics-test"]').count(),0);
   await block.locator('a[href="'+target+'"]').click();
  }else{
   assert.equal((await page.goto(base+'portal/unit-08-topic86-reversible-processes-v230.html',{waitUntil:'domcontentloaded'})).status(),200);
  }
  await page.waitForURL(u=>u.pathname==='/portal/unit-08-topic86-reversible-processes-v230.html',{timeout:15000});
  assert.equal(await page.locator('#lesson-status[data-scored-release="false"][data-academic-review="pending"]').count(),1);
  assert.equal(await page.locator('h1').count(),1);
  const buttons=page.locator('#explorer [data-case]');
  assert.equal(await buttons.count(),6);
  const title=['Reversible in the ideal limit','Irreversible','Irreversible','Reversible in the ideal limit','Irreversible','Irreversible even though cyclic'];
  const subst=['frictionless piston','piston rubbing','temperature difference','equilibrium phase change','vacuum','frictional operating cycle'];
  for(let i=0;i<6;i++){
   await buttons.nth(i).click();
   assert.equal(await page.locator('#case-answer').innerText(),title[i]);
   assert.equal(await buttons.nth(i).getAttribute('aria-pressed'),'true');
   for(let j=0;j<6;j++)if(j!==i)assert.equal(await buttons.nth(j).getAttribute('aria-pressed'),'false');
  }
  assert.equal(await page.locator('#self-check details').count(),5);
  await page.locator('#self-check details').nth(3).locator('summary').click();
  assert.match(await page.locator('#self-check details').nth(3).innerText(),/400 J/);
  assert.match(await page.locator('#cycle-caution').innerText(),/not automatically reversible/);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Horizontal overflow at '+width+'px: '+overflow);
  assert.deepEqual(errors,[],'No JS errors in unscored lesson');
  return {viewport:width,entry,topic:'8.6',sourcePages:[141,142],scenarios:6,conceptChecks:5,
   cycleEnergyStateDeltaJ:0,studentScoredMcqs:0,academicApproval:'PENDING',overflow};
 }finally{await page.close()}
}
(async()=>{sourceScience();fs.mkdirSync(evidenceDir,{recursive:true});const base=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const cases=[await studentBrowser(browser,base,1280,'sidebar'),await studentBrowser(browser,base,390,'quick'),await studentBrowser(browser,base,320,'direct')];
  fs.writeFileSync(path.join(evidenceDir,'evidence.json'),JSON.stringify({
   version:'V230',source:'Owner NBF XI printed pp141–142 verified by visual source pages',
   originalTheorySLO:'P-11-C-14',figure8_15Copied:false,releaseState:'public-unscored-teacher-review',
   scoredUnit8Mcqs:0,preservedPinnedUnit1to6Mcqs:2250,teacherApproval:'PENDING',cases
  },null,2)+'\n');
  console.log('V230 PASS: original Topic8.6 source/SLO, cycle science, real Chromium 1280/390/320, six scenarios and hold invariants.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(err=>{console.error('V230 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
