#!/usr/bin/env node
'use strict';
/* V233 independent original NBF XI Unit8 pp145–147, refrigerator COP,
 * Example 8.5 and SYMBOLIC Assignment 8.5, three real Chromium viewports.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const cat=json('portal/learning-catalog.json'),src=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const bank=json('question-bank/manifest.json');
const units=cat.grades.find(g=>g.grade===11).units,u8=units.find(u=>u.unit===8),u7=units.find(u=>u.unit===7);
const html=read('portal/unit-08-topic89-refrigerator-v233.html');
const prev=read('portal/unit-08-topic88-carnot-engine-v232.html');
const nav=read('shared/navigation.js'),quick=read('portal/exam-quick-access.html');
const target='./unit-08-topic89-refrigerator-v233.html',dir=path.join(ROOT,'qa-artifacts/grade11-v233-unit08-topic89-refrigerator-browser');
function sourceScience(){
 assert.equal(src.version,'V224');
 const section=src.sections.find(s=>s.code==='8.9');
 assert.deepEqual([section.title,...section.pages],['Refrigerator',145,147]);
 assert.deepEqual(section.subtopics,[]);
 assert.deepEqual(section.slo,['P-11-C-17']);
 const slo=src.officialFramework.slos.find(s=>s.printedCode==='P-11-C-17');
 assert.deepEqual([slo.displayShortDescription,slo.assessment,slo.cognitive,slo.frameworkPdfPage],
  ['Refrigerator as reverse heat engine','Summative','Understanding',13]);
 const figure=src.figures.find(x=>x.figure==='8.18');
 assert.deepEqual([figure.printedPage,figure.topic,figure.sourceImageNotPublished],[145,'8.9',true]);
 assert.deepEqual(src.examples.find(x=>x.id==='Example 8.5').printedPages,[146,147]);
 assert.equal(src.assignments.find(x=>x.id==='Assignment 8.5').printedPage,147);
 assert.equal(src.sections.find(x=>x.code==='8.10').pages[0],147);
 assert.equal(u8.status,'planned');assert.equal(u8.assessmentStatus,'not-published');
 assert.equal(u8.questionBankCount,0);assert.deepEqual(u8.resourceIds,[]);
 assert.equal(u8.simulationCount,4);
 assert.equal(u8.learningPreviewStatus,'public-topic-8.1-unscored-study-teacher-review');
 assert.deepEqual(u8.additionalLearningPreviews.map(x=>x.topic),['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9']);
 assert.deepEqual(u8.additionalLearningPreviews[7],{
  topic:'8.9',title:'Refrigerator: Heat Transfer and Cooling/Heating COP',
  href:target,sourcePages:[145,147],access:'public-unscored-study-teacher-review'
 });
 assert.match(u8.summary,/Nine source-based, unscored study lessons/);
 assert.match(u8.studentNotice,/unscored learning preview/);
 assert.match(u8.studentNotice,/No Unit8 scored bank/);
 assert.equal(u7.questionBankCount,0);assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(cat.resources.length,59);
 assert.deepEqual(bank.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
 assert.equal(src.releaseGate.studentScoredUnit8Mcqs,0);
 assert.equal(quick.split('id="unit8-unscored-study-preview"').length-1,1);
 assert.equal(quick.split('href="'+target+'"').length-1,1);
 for(const t of ['8.1','8.2','8.3','8.4','8.5','8.6','8.7','8.8']) assert.ok(quick.includes('Study Topic '+t));
 assert.ok(quick.includes('Topic 8.10 onward remain planned.'));
 assert.ok(!quick.includes('build-your-physics-test.html?unit=8'));
 assert.ok(nav.includes("['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9'].includes(study.topic)"));
 assert.ok(nav.includes('Unit 8 · Topic 8.9 Refrigerator and Cooling/Heating COP'));
 assert.ok(prev.includes('href="'+target+'"'));
 for(const id of ['lesson-status','principle','energy','energy-equation','cop','cop-relationship',
  'cop-caution','example85','example85-solution','example85-result','assignment85',
  'assignment85-solution','assignment85-result','calculator','temperatures-tool','hot-c','cold-c',
  'work-j','calculate-ideal','ideal-result','energy-tool','cold-heat','work-heat',
  'calculate-energy','energy-result','self-check','continue'])assert.ok(html.includes('id="'+id+'"'),'Missing lesson '+id);
 assert.ok(html.includes('data-academic-review="pending" data-scored-release="false"'));
 assert.match(html,/Original printed pages 145–147/);
 assert.match(html,/P-11-C-17/);
 assert.match(html,/6 °C/);assert.match(html,/37 °C/);
 assert.match(html,/279 K/);assert.match(html,/310 K/);
 assert.match(html,/heat removed.*9 J|Q<sub>C<\/sub> = 9 × 1 J = <strong>9 J<\/strong>/s);
 assert.match(html,/10 J of heat reaches the room/);
 assert.match(html,/symbolic/i);
 assert.match(html,/t<sub>1<\/sub>/);assert.match(html,/t<sub>2<\/sub>/);
 assert.match(html,/t<sub>1<\/sub> \+ 273\.15/);
 assert.match(html,/t<sub>1<\/sub> − t<sub>2<\/sub>/);
 assert.match(html,/Q<sub>H<\/sub> = Q<sub>C<\/sub> \+ W<sub>in<\/sub>/);
 assert.match(html,/COP<sub>heat<\/sub> = COP<sub>cool<\/sub> \+ 1/);
 assert.equal((html.match(/<details><summary>/g)||[]).length,5);
 assert.ok(!html.includes('grade11-answers.json')&&!html.includes('build-your-physics-test.html?unit=8'));
 for(const banned of ['getAuth(','getFirestore(','initializeAppCheck','indexedDB','localStorage','sessionStorage','navigator.sendBeacon']){
  assert.ok(!html.includes(banned),'No grading or student data in unscored page '+banned);
 }
 // Independent science checks separate from page's own JS expressions.
 const coldK=6+273,hotK=37+273;
 assert.equal(coldK,279);assert.equal(hotK,310);
 assert.equal(coldK/(hotK-coldK),9);
 assert.equal(hotK/(hotK-coldK),10);
 assert.equal(1+9,10);
 const coldPrecise=6+273.15,hotPrecise=37+273.15;
 assert.ok(Math.abs(coldPrecise/(hotPrecise-coldPrecise)-9.00483870967742)<1e-8);
 assert.equal(9+1,10);
 // Symbolic assignment: choose temporary independent numbers only to test its algebraic identity.
 const t1=32,t2=7;
 const symbolicHeating=(t1+273.15)/(t1-t2),independentCooling=(t2+273.15)/(t1-t2);
 assert.ok(Math.abs(symbolicHeating-(independentCooling+1))<1e-12);
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname),file=path.resolve(ROOT,'.'+pathname);
 if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
  res.writeHead(404);res.end('Not found');return;
 }
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
}catch{res.writeHead(400);res.end('Bad request')}});
async function serve(){await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});return 'http://127.0.0.1:'+server.address().port+'/'}
async function browserCase(browser,base,width,entry){
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1}),errors=[];
 page.on('pageerror',err=>errors.push(err.message));
 try{
  if(entry==='sidebar'){
   assert.equal((await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'})).status(),200);
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(document.querySelector('.psn-drawer-loading')?.textContent||'').includes('unit menus'),null,{timeout:20000});
   const future=page.locator('.psn-drawer-future[data-psn-future-units="7,8,9,10"]');
   assert.equal(await future.count(),1);await future.locator('summary').click();
   const link=future.locator('a[href*="unit-08-topic89-refrigerator-v233.html"]');
   assert.equal(await link.count(),1);
   assert.equal(await future.locator('a[href*="unit-08-topic88-carnot-engine-v232.html"]').count(),1);
   assert.equal(await future.locator('a[href*="build-your-physics-test.html?unit=8"]').count(),0);
   await link.click();
  }else if(entry==='quick'){
   assert.equal((await page.goto(base+'portal/exam-quick-access.html',{waitUntil:'domcontentloaded'})).status(),200);
   const block=page.locator('#unit8-unscored-study-preview');
   assert.equal(await block.count(),1);assert.equal(await block.locator('a[href="'+target+'"]').count(),1);
   assert.equal(await block.locator('a[href*="build-your-physics-test"]').count(),0);
   await block.locator('a[href="'+target+'"]').click();
  }else{
   assert.equal((await page.goto(base+'portal/unit-08-topic89-refrigerator-v233.html',{waitUntil:'domcontentloaded'})).status(),200);
  }
  await page.waitForURL(u=>u.pathname==='/portal/unit-08-topic89-refrigerator-v233.html',{timeout:15000});
  assert.equal(await page.locator('#lesson-status[data-academic-review="pending"][data-scored-release="false"]').count(),1);
  assert.equal(await page.locator('h1').count(),1);
  await page.locator('#example85-solution summary').click();
  assert.match(await page.locator('#example85-result').innerText(),/10 J of heat/);
  await page.locator('#assignment85-solution summary').click();
  assert.match(await page.locator('#assignment85-result').innerText(),/t1.*273\.15|t₁.*273\.15/);
  assert.match(await page.locator('#assignment85-result').innerText(),/t1.*t2|t₁.*t₂/);
  await page.locator('#calculate-ideal').click();
  let result=await page.locator('#ideal-result').innerText();
  assert.match(result,/cooling COP = 9\.0048/);
  assert.match(result,/heating COP = 10\.0048/);
  assert.match(result,/Q cold = 9\.0048/);
  assert.match(result,/Q hot = 10\.0048/);
  await page.locator('#cold-c').fill('38');
  await page.locator('#calculate-ideal').click();
  assert.match(await page.locator('#ideal-result').innerText(),/room hotter/);
  await page.locator('#cold-c').fill('-273.15');
  await page.locator('#calculate-ideal').click();
  assert.match(await page.locator('#ideal-result').innerText(),/above absolute zero/);
  await page.locator('#cold-c').fill('6');
  await page.locator('#work-j').fill('');
  await page.locator('#calculate-ideal').click();
  assert.match(await page.locator('#ideal-result').innerText(),/positive work/);
  await page.locator('#calculate-energy').click();
  result=await page.locator('#energy-result').innerText();
  assert.match(result,/room = 10 J/);
  assert.match(result,/cooling COP = 9/);
  assert.match(result,/heating COP = 10/);
  await page.locator('#work-heat').fill('2');
  await page.locator('#calculate-energy').click();
  result=await page.locator('#energy-result').innerText();
  assert.match(result,/room = 11 J/);
  assert.match(result,/cooling COP = 4\.5/);
  assert.match(result,/heating COP = 5\.5/);
  await page.locator('#cold-heat').fill('-1');
  await page.locator('#calculate-energy').click();
  assert.match(await page.locator('#energy-result').innerText(),/nonnegative heat removed/);
  assert.equal(await page.locator('#self-check details').count(),5);
  await page.locator('#self-check details').nth(2).locator('summary').click();
  assert.match(await page.locator('#self-check details').nth(2).innerText(),/10 J/);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Unexpected page overflow at '+width+'px: '+overflow);
  assert.deepEqual(errors,[],'No JS exceptions on the actual student page');
  return {viewport:width,entry,topic:'8.9',originalPages:[145,147],example85HeatRemovedJ:9,
    example85RoomHeatJ:10,assignment85:'symbolic-t1-t2',
    conceptChecks:5,scoredQuestionCount:0,academicApproval:'PENDING',overflow};
 }finally{await page.close()}
}
(async()=>{sourceScience();fs.mkdirSync(dir,{recursive:true});const base=await serve();let browser;
 try{browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const cases=[await browserCase(browser,base,1280,'sidebar'),await browserCase(browser,base,390,'quick'),await browserCase(browser,base,320,'direct')];
 fs.writeFileSync(path.join(dir,'evidence.json'),JSON.stringify({
  version:'V233',source:'Original NBF XI Unit8 pp145–147 visually checked; Assignment8.5 symbolic original',
  officialSummativeSLO:'P-11-C-17',originalPublisherFigureCopied:false,originalAssignmentNumericValuesInvented:false,
  originalUnit1To6PinnedMcqCount:2250,unit8ScoredMcqCount:0,humanAcademicApproval:'PENDING',cases
 },null,2)+'\n');
 console.log('V233 PASS: original fridge source/symbolic assignment, live COP, 1280/390/320 Chromium, hold intact');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(e=>{console.error('V233 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
