#!/usr/bin/env node
'use strict';
/* V228: owner original NBF XI Unit8 printed pp135-140, four first-law processes,
 * Example 8.3 and Assignment 8.3, real browser and hold-preserving QA.
 * No source textbook PDF, publisher figures or original question text in repo.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const catalog=json('portal/learning-catalog.json');
const source=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const bank=json('question-bank/manifest.json');
const grade=catalog.grades.find(g=>g.grade===11);
const u8=grade.units.find(u=>u.unit===8),u7=grade.units.find(u=>u.unit===7);
const html=read('portal/unit-08-topic84-first-law-v228.html');
const prev=read('portal/unit-08-topic83-gas-laws-v227.html');
const nav=read('shared/navigation.js'),quick=read('portal/exam-quick-access.html');
const href='./unit-08-topic84-first-law-v228.html';
const resultDir=path.join(ROOT,'qa-artifacts/grade11-v228-unit08-topic84-first-law-browser');
function checkSourceScience(){
 assert.equal(source.version,'V224');
 const section=source.sections.find(x=>x.code==='8.4');
 assert.equal(section.title,'First Law of Thermodynamics');
 assert.deepEqual(section.pages,[135,140]);
 assert.deepEqual(section.subtopics.map(x=>[x.code,...x.pages]),[
  ['8.4.1',136,137],['8.4.2',137,138],['8.4.3',138,138],['8.4.4',138,140]]);
 assert.deepEqual(section.slo,['P-11-C-08','P-11-C-11']);
 assert.deepEqual(source.officialFramework.slos.filter(x=>section.slo.includes(x.printedCode)).map(x=>[x.printedCode,x.assessment,x.cognitive]),[
  ['P-11-C-08','Summative','Knowledge + Understanding + Application'],
  ['P-11-C-11','Summative','Application']]);
 assert.deepEqual(source.figures.filter(x=>['8.10','8.11','8.12','8.13'].includes(x.figure)).map(x=>[x.figure,x.printedPage,x.sourceImageNotPublished]),[
  ['8.10',136,true],['8.11',137,true],['8.12',138,true],['8.13',139,true]]);
 assert.deepEqual(source.examples.find(x=>x.id==='Example 8.3').printedPages,[139,140]);
 assert.equal(source.assignments.find(x=>x.id==='Assignment 8.3').printedPage,140);
 assert.equal(u8.status,'planned');
 assert.equal(u8.assessmentStatus,'not-published');
 assert.equal(u8.questionBankCount,0);
 assert.deepEqual(u8.resourceIds,[]);
 assert.equal(u8.simulationCount,4);
 assert.equal(u8.learningPreviewStatus,'public-topic-8.1-unscored-study-teacher-review');
 assert.equal(u8.additionalLearningPreviews.length,3);
 assert.deepEqual(u8.additionalLearningPreviews.map(x=>x.topic),['8.2','8.3','8.4']);
 assert.deepEqual(u8.additionalLearningPreviews[2],{
  topic:'8.4',title:'First Law of Thermodynamics and Four Processes',
  href,sourcePages:[135,140],access:'public-unscored-study-teacher-review'
 });
 assert.match(u8.summary,/Four source-based, unscored study lessons/);
 assert.match(u8.studentNotice,/No Unit8 scored bank/);
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(catalog.resources.length,59);
 assert.deepEqual(bank.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
 assert.equal(source.releaseGate.studentScoredUnit8Mcqs,0);
 assert.equal(quick.split('id="unit8-unscored-study-preview"').length-1,1);
 assert.equal(quick.split('href="'+href+'"').length-1,1);
 assert.ok(quick.includes('Study Topic 8.1'));
 assert.ok(quick.includes('Study Topic 8.2'));
 assert.ok(quick.includes('Study Topic 8.3'));
 assert.ok(quick.includes('Topic 8.5 onward remain planned.'));
 assert.ok(!quick.includes('build-your-physics-test.html?unit=8'));
 assert.ok(nav.includes("['8.2','8.3','8.4'].includes(study.topic)"));
 assert.ok(nav.includes('Unit 8 · Topic 8.2 Kinetic Theory and Work by/on Gas'));
 assert.ok(nav.includes('Unit 8 · Topic 8.3 The Gas Laws'));
 assert.ok(nav.includes('Unit 8 · Topic 8.4 First Law and Four Thermodynamic Processes'));
 assert.ok(prev.includes('href="'+href+'"'));
 for(const id of ['lesson-status','first-law','first-law-equation','sign-warning','processes',
  'isothermal','adiabatic','isochoric','isobaric','example83','example83-solution','example83-result',
  'assignment83','assignment83-solution','assignment83-result','calculator','ledger-unit','ledger-q',
  'ledger-w','ledger-ui','ledger-calculate','preset-example83','preset-assignment83','ledger-result',
  'isobaric-lab','iso-p','iso-vi','iso-vf','iso-q','iso-calculate','iso-result','self-check','continue']){
  assert.ok(html.includes('id="'+id+'"'),'Missing required first-law student section '+id);
 }
 assert.ok(html.includes('data-academic-review="pending" data-scored-release="false"'));
 assert.match(html,/Original printed pages 135–140/);
 assert.match(html,/Q = ΔU \+ W<sub>by<\/sub>/);
 assert.match(html,/ΔU = Q − W<sub>by<\/sub>/);
 assert.match(html,/Q = 0/);
 assert.match(html,/ΔU = 0/);
 assert.match(html,/Q = ΔU/);
 assert.match(html,/200 J/);
 assert.match(html,/−150 J/);
 assert.match(html,/−125 kJ/);
 assert.match(html,/75 kJ/);
 assert.match(html,/1 kPa × 1 L = 1 J/);
 assert.match(html,/not publisher-approved marking keys/);
 assert.ok(!html.includes('grade11-answers.json'));
 assert.ok(!html.includes('build-your-physics-test.html?unit=8'));
 for(const banned of ['getAuth(','getFirestore(','initializeAppCheck','indexedDB','localStorage','sessionStorage','navigator.sendBeacon']){
  assert.ok(!html.includes(banned),'No login, tracking, saved answers, remote student data: '+banned);
 }
 // Independently derive signed first law (source Example 8.3).
 const deltaExample=-200,workByExample=50,heatExample=deltaExample+workByExample;
 assert.equal(heatExample,-150);
 // Independently derive tea assignment: spoon does +25kJ ON tea.
 const uInitial=200,heatTea=-150,workOnTea=25,workByTea=-workOnTea;
 const deltaTea=heatTea-workByTea,uFinal=uInitial+deltaTea;
 assert.equal(deltaTea,-125);assert.equal(uFinal,75);
 // Independent isobaric p-V work and the resulting internal-energy change.
 const pressureKPa=200,viL=2,vfL=5,heatJ=1000;
 assert.equal(pressureKPa*(vfL-viL),600);
 assert.equal(heatJ-pressureKPa*(vfL-viL),400);
 assert.equal(pressureKPa*(viL-vfL),-600);
 assert.equal(heatJ-pressureKPa*(viL-vfL),1600);
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
 const file=path.resolve(ROOT,'.'+pathname);
 if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
  res.writeHead(404);res.end('Not found');return;
 }
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
 fs.createReadStream(file).pipe(res);
}catch{res.writeHead(400);res.end('Bad request')}});
async function serve(){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function checkBrowser(browser,base,width,entry){
 const page=await browser.newPage({viewport:{width,height:920},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  if(entry==='sidebar'){
   assert.equal((await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'})).status(),200);
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(document.querySelector('.psn-drawer-loading')?.textContent||'').includes('unit menus'),null,{timeout:20000});
   const future=page.locator('.psn-drawer-future[data-psn-future-units="7,8,9,10"]');
   assert.equal(await future.count(),1);
   await future.locator('summary').click();
   const link=future.locator('a[href*="unit-08-topic84-first-law-v228.html"]');
   assert.equal(await link.count(),1);
   assert.equal(await future.locator('a[href*="unit-08-topic83-gas-laws-v227.html"]').count(),1);
   assert.equal(await future.locator('a[href*="build-your-physics-test.html?unit=8"]').count(),0);
   await link.click();
  }else if(entry==='quick'){
   assert.equal((await page.goto(base+'portal/exam-quick-access.html',{waitUntil:'domcontentloaded'})).status(),200);
   const block=page.locator('#unit8-unscored-study-preview');
   assert.equal(await block.count(),1);
   assert.equal(await block.locator('a[href="'+href+'"]').count(),1);
   assert.equal(await block.locator('a[href*="build-your-physics-test"]').count(),0);
   await block.locator('a[href="'+href+'"]').click();
  }else{
   assert.equal((await page.goto(base+'portal/unit-08-topic84-first-law-v228.html',{waitUntil:'domcontentloaded'})).status(),200);
  }
  await page.waitForURL(u=>u.pathname==='/portal/unit-08-topic84-first-law-v228.html',{timeout:15000});
  assert.equal(await page.locator('#lesson-status[data-academic-review="pending"][data-scored-release="false"]').count(),1);
  assert.equal(await page.locator('h1').count(),1);
  await page.locator('#example83-solution summary').click();
  assert.ok(await page.locator('#example83-solution').evaluate(e=>e.open));
  assert.match(await page.locator('#example83-result').innerText(),/150 J of heat leaves/);
  await page.locator('#assignment83-solution summary').click();
  assert.ok(await page.locator('#assignment83-solution').evaluate(e=>e.open));
  assert.match(await page.locator('#assignment83-result').innerText(),/75 kJ/);
  await page.locator('#preset-example83').click();
  assert.match(await page.locator('#ledger-result').innerText(),/ΔU = −200 J/);
  assert.match(await page.locator('#ledger-result').innerText(),/Initial U unspecified/);
  await page.locator('#preset-assignment83').click();
  let value=await page.locator('#ledger-result').innerText();
  assert.match(value,/ΔU = −125 kJ/);
  assert.match(value,/U final = \+75 kJ/);
  await page.locator('#ledger-q').fill('abc').catch(async()=>{await page.locator('#ledger-q').fill('')});
  await page.locator('#ledger-calculate').click();
  assert.match(await page.locator('#ledger-result').innerText(),/finite numeric/);
  await page.locator('#iso-calculate').click();
  value=await page.locator('#iso-result').innerText();
  assert.match(value,/Expansion/);
  assert.match(value,/W by gas = \+600 J/);
  assert.match(value,/ΔU = \+400 J/);
  await page.locator('#iso-vi').fill('5');
  await page.locator('#iso-vf').fill('2');
  await page.locator('#iso-calculate').click();
  value=await page.locator('#iso-result').innerText();
  assert.match(value,/Compression/);
  assert.match(value,/W by gas = −600 J/);
  assert.match(value,/ΔU = \+1600 J/);
  await page.locator('#iso-p').fill('0');
  await page.locator('#iso-calculate').click();
  assert.match(await page.locator('#iso-result').innerText(),/strictly positive pressure/);
  assert.equal(await page.locator('#self-check details').count(),4);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Page horizontal overflow at '+width+': '+overflow);
  assert.deepEqual(errors,[],'No JS runtime errors for unscored source lesson');
  return {viewport:width,entry,topic:'8.4',sourcePages:[135,140],example83HeatJ:-150,
   assignment83ChangeKJ:-125,assignment83FinalKJ:75,isobaricExpansionWByJ:600,
   isobaricCompressionWByJ:-600,teacherApproval:'PENDING',scoredMcqs:0,overflow};
 }finally{await page.close()}
}
(async()=>{checkSourceScience();fs.mkdirSync(resultDir,{recursive:true});
 const base=await serve();let browser;
 try{browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const cases=[await checkBrowser(browser,base,1280,'sidebar'),await checkBrowser(browser,base,390,'quick'),await checkBrowser(browser,base,320,'direct')];
 fs.writeFileSync(path.join(resultDir,'evidence.json'),JSON.stringify({
  version:'V228',source:'Owner original NBF XI Unit8 pp135–140 visually reviewed',
  officialSummativeOutcomes:['P-11-C-08','P-11-C-11'],
  originalPublisherFiguresCopied:false,sourceExample:'8.3',sourceAssignment:'8.3',
  scoredMcqsReleased:0,teacherAcademicApproval:'PENDING',
  pinnedUnits1to6McqsUnchanged:2250,cases
 },null,2)+'\n');
 console.log('V228 PASS: First Law source, signs, tea assignment, isobaric work, 1280/390/320 real browser, prior bank unchanged');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(err=>{console.error('V228 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
