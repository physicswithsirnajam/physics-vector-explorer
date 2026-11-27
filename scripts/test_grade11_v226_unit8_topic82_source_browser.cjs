#!/usr/bin/env node
'use strict';
/* V226: NBF pp.131–134 Topic8.2 source-grounded unscored student lesson.
 * Browser QA confirms actual signs, numeric results, mobile routing and
 * preservation of Grade XI student course / teacher approval holds.
 * The original textbook PDF/images are intentionally not in GitHub.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const catalog=json('portal/learning-catalog.json');
const source=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const bank=json('question-bank/manifest.json');
const u8=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===8);
const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
const html=read('portal/unit-08-topic82-kinetic-gases-work-v226.html');
const nav=read('shared/navigation.js'),quick=read('portal/exam-quick-access.html');
const target='./unit-08-topic82-kinetic-gases-work-v226.html';
const resultDir=path.join(ROOT,'qa-artifacts/grade11-v226-unit08-topic82-source-browser');
function sourceAndScience(){
 assert.equal(source.version,'V224');
 assert.equal(source.sections[1].code,'8.2');
 assert.equal(source.sections[1].title,'Kinetic Theory of Gases');
 assert.deepEqual(source.sections[1].pages,[131,134]);
 assert.deepEqual(source.sections[1].subtopics.map(s=>s.code),['8.2.1','8.2.2']);
 assert.deepEqual(source.sections[1].slo,['P-11-C-05','P-11-C-06','P-11-C-07']);
 assert.deepEqual(source.officialFramework.slos.slice(4,7).map(x=>[x.printedCode,x.assessment,x.cognitive]),[
  ['P-11-C-05','Summative','Understanding'],['P-11-C-06','Summative','Application'],
  ['P-11-C-07','Summative','Understanding']]);
 assert.equal(source.examples[1].id,'Example 8.2');
 assert.deepEqual(source.examples[1].printedPages,[133,133]);
 assert.equal(source.assignments[1].id,'Assignment 8.2');
 assert.equal(source.assignments[1].printedPage,133);
 assert.equal(catalog.resources.length,59);
 assert.equal(u8.status,'planned');
 assert.equal(u8.assessmentStatus,'not-published');
 assert.equal(u8.questionBankCount,0);
 assert.deepEqual(u8.resourceIds,[]);
 assert.equal(u8.simulationCount,4);
 assert.equal(u8.learningPreviewStatus,'public-topic-8.1-unscored-study-teacher-review');
 assert.equal(u8.learningPreviewHref,'./unit-08-topic81-thermal-equilibrium-v225.html');
 assert.equal(u8.additionalLearningPreviews.length,9);
 assert.deepEqual(u8.additionalLearningPreviews[0],{
  topic:'8.2',title:'Kinetic Theory of Gases and Thermodynamic Work',
  href:target,sourcePages:[131,134],access:'public-unscored-study-teacher-review'
 });
 assert.deepEqual(u8.additionalLearningPreviews[1],{
  topic:'8.3',title:'The Gas Laws: Boyle, Charles and Gay-Lussac',
  href:'./unit-08-topic83-gas-laws-v227.html',sourcePages:[134,135],
  access:'public-unscored-study-teacher-review'
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
 assert.match(u8.studentNotice,/no Unit8 scored bank/i);
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.deepEqual(bank.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),
  [275,206,220,640,349,560]);
 for(const id of ['lesson-status','kinetic','density','work','work-equation','work-on-equation',
  'example82','example82-result','assignment82','assignment82-solution',
  'assignment82-result','calculator','calculate-work','p-kpa','vi-litres','vf-litres',
  'work-result','self-check']){
  assert.ok(html.includes('id="'+id+'"'),'Missing educational section '+id);
 }
 assert.ok(html.includes('data-academic-review="pending" data-scored-release="false"'));
 assert.match(html,/Original printed p\.133/);
 assert.match(html,/radius r = 1 m and height h = 2 m/);
 assert.match(html,/argon molar mass M ≈ 0\.040 kg/);
 assert.match(html,/2 kg/);
 assert.match(html,/30 °C ≈ 303 K/);
 assert.match(html,/20,047 Pa/);
 assert.match(html,/2\.25 × 10<sup>5<\/sup> Pa/);
 assert.match(html,/200 J work done <strong>on<\/strong> the gas/);
 assert.match(html,/V<sub>f<\/sub> ≈ 4\.44 × 10<sup>−4<\/sup> m³ = 0\.444 L/);
 assert.match(html,/W<sub>by<\/sub> = pΔV/);
 assert.match(html,/W<sub>on<\/sub> = −pΔV/);
 assert.match(html,/1 kPa × 1 L = 1 J/);
 assert.match(html,/for a constant-pressure process/);
 assert.match(html,/area of a rectangle under the pressure–volume graph/);
 assert.match(html,/zero isochoric work|Constant volume/);
 assert.match(html,/Except during collisions/);
 assert.match(html,/source figures remain in the original textbook/);
 assert.match(html,/No marks, sign-in or saved student data/);
 assert.ok(!html.includes('grade11-answers.json'));
 assert.ok(!html.includes('build-your-physics-test.html?unit=8'));
 for(const banned of ['firebase.firestore','getAuth(','getFirestore(','initializeAppCheck',
   'indexedDB','localStorage','sessionStorage','fetch(','navigator.sendBeacon']){
  assert.ok(!html.includes(banned),'No authentication, storage or remote submissions: '+banned);
 }
 assert.equal(quick.split('id="unit8-unscored-study-preview"').length-1,1);
 assert.equal(quick.split('href="'+target+'"').length-1,1);
 assert.ok(quick.includes('Study Topic 8.1'));
 assert.ok(quick.includes('Study Topic 8.3 · The Gas Laws'));
 assert.ok(quick.includes('No graded Unit 8 test or original end-of-unit exercise answer edition'));
 assert.ok(!quick.includes('build-your-physics-test.html?unit=8'));
 assert.ok(nav.includes("['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10'].includes(study.topic)"));
 assert.ok(nav.includes("study.access!=='public-unscored-study-teacher-review'"));
 assert.ok(nav.includes('Unit 8 · Topic 8.2 Kinetic Theory and Work by/on Gas'));
 assert.ok(nav.includes('Unit 8 · Topic 8.3 The Gas Laws'));
 assert.ok(nav.includes('Unit 8 · Topic 8.4 First Law'));
 assert.ok(nav.includes('Unit 8 · Topic 8.5 Heat Engine and Petrol Four-Stroke Cycle'));
 assert.ok(nav.includes('Unit 8 · Topic 8.6 Reversible, Irreversible and Cyclic Processes'));
 assert.ok(nav.includes('Unit 8 · Topic 8.7 Second Law (Kelvin and Clausius)'));
 assert.ok(nav.includes('Unit 8 · Topic 8.8 Carnot Engine and Efficiency'));
 assert.ok(nav.includes('Unit 8 · Topic 8.9 Refrigerator and Cooling/Heating COP'));
 assert.ok(nav.includes('Unit 8 · Topic 8.10 Entropy, Sign Convention and Energy'));
 assert.ok(nav.includes('Unit 7 · Topic'));
 // Independent algebra: Example 8.2, 2 kg argon, 0.040 kg/mol,
 // r=1 m h=2 m, T=303 K, R=8.314 SI.
 const n=2/0.040,volume=Math.PI*1**2*2;
 const pressure=n*8.314*303/volume;
 assert.equal(n,50);
 assert.ok(Math.abs(volume-6.283185307179586)<1e-12);
 assert.ok(Math.abs(pressure-20046.69508252)<0.0001);
 assert.ok(Math.abs(pressure/1000-20.0)<0.05);
 // Assignment 8.2: compression to one-third, W_on=+200J, P=225000Pa.
 // W_on = p(V_i-V_f)=p(2 V_f), thus V_f = W_on/(2p).
 const p=2.25e5,W_on=200;
 const Vf=W_on/(2*p),Vi=3*Vf,delta=Vf-Vi;
 const W_by=p*delta;
 assert.ok(Math.abs(Vf-4.4444444444444444e-4)<1e-16);
 assert.ok(Math.abs(Vi-1.3333333333333333e-3)<1e-16);
 assert.ok(Math.abs(W_by+200)<1e-10);
 assert.ok(Math.abs((-W_by)-W_on)<1e-10);
 assert.equal(source.releaseGate.studentScoredUnit8Mcqs,0);
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const file=path.resolve(ROOT,'.'+pathname);
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('Bad request')}
});
async function serve(){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function studentBrowser(browser,base,width,entry){
 const page=await browser.newPage({viewport:{width,height:890},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',err=>errors.push(err.message));
 try{
  if(entry==='sidebar'){
   assert.equal((await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'})).status(),200);
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(
    document.querySelector('.psn-drawer-loading')?.textContent||''
   ).includes('unit menus'),null,{timeout:20000});
   const future=page.locator('.psn-drawer-future[data-psn-future-units="7,8,9,10"]');
   assert.equal(await future.count(),1);
   await future.locator('summary').click();
   const links=future.locator('a[href*="unit-08-topic82-kinetic-gases-work-v226.html"]');
   assert.equal(await links.count(),1);
   assert.equal(await future.locator('a[href*="unit-08-topic81-thermal-equilibrium-v225.html"]').count(),1);
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
   assert.equal((await page.goto(base+'portal/unit-08-topic82-kinetic-gases-work-v226.html',
    {waitUntil:'domcontentloaded'})).status(),200);
  }
  await page.waitForURL(url=>url.pathname==='/portal/unit-08-topic82-kinetic-gases-work-v226.html',
   {timeout:15000});
  assert.equal(await page.locator('#lesson-status[data-scored-release="false"][data-academic-review="pending"]').count(),1);
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('#assignment82-solution').count(),1);
  assert.ok(!(await page.locator('#assignment82-solution').evaluate(e=>e.open)));
  await page.locator('#assignment82-solution summary').click();
  assert.ok(await page.locator('#assignment82-solution').evaluate(e=>e.open));
  assert.match(await page.locator('#assignment82-result').innerText(),/4\.44 × 10/);
  assert.match(await page.locator('#example82-result').innerText(),/2\.00 × 10/);
  const button=page.locator('#calculate-work');
  await button.click();
  let value=await page.locator('#work-result').innerText();
  assert.match(value,/Compression/);
  assert.match(value,/W by gas = −200\.00 J/);
  assert.match(value,/W on gas = \+200\.00 J/);
  await page.locator('#vf-litres').fill('2.333333333');
  await button.click();
  value=await page.locator('#work-result').innerText();
  assert.match(value,/Expansion/);
  assert.match(value,/W by gas = \+225\.00 J/);
  assert.match(value,/W on gas = −225\.00 J/);
  await page.locator('#vf-litres').fill('1.333333333');
  await button.click();
  value=await page.locator('#work-result').innerText();
  assert.match(value,/Constant volume/);
  assert.match(value,/W by gas = \+0\.0000 J/);
  await page.locator('#p-kpa').fill('0');
  await button.click();
  assert.match(await page.locator('#work-result').innerText(),/finite, positive pressure/);
  assert.equal(await page.locator('#self-check details').count(),4);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Page horizontal overflow at '+width+'px: '+overflow);
  assert.deepEqual(errors,[],'Unscored learning page must have no JS runtime errors');
  return {viewport:width,entry,topic:'8.2',printedPages:[131,134],
   workedExample:'8.2',assignment:'8.2',
   pressurePa:20046.7,assignmentFinalVolumeM3:4.4444e-4,
   calculatorSignsVerified:true,independentTeacherApproval:false,scoredMcqsReleased:0};
 }finally{await page.close()}
}
(async()=>{
 sourceAndScience();fs.mkdirSync(resultDir,{recursive:true});
 const base=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const cases=[
   await studentBrowser(browser,base,1280,'sidebar'),
   await studentBrowser(browser,base,390,'quick'),
   await studentBrowser(browser,base,320,'direct')
  ];
  fs.writeFileSync(path.join(resultDir,'evidence.json'),JSON.stringify({
   version:'V226',source:'Owner original NBF Grade XI Unit8 printed pp131-134 visually checked',
   framework:'FBISE P-11-C-05/06/07 exact printed outcomes',
   pageUnscored:true,originalFiguresCopied:false,teacherScienceSignoff:'PENDING',
   ownerScoreRelease:'HOLD',unit8ScoredMcqCount:0,unchangedPublished2250Mcqs:true,cases
  },null,2)+'\n');
  console.log('V226 PASS: Unit8 8.2 source/pressure/compression and work signs, sidebar/quick and 1280/390/320 real Chromium, no graded bank.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(err=>{console.error('V226 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
