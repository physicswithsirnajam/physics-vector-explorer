#!/usr/bin/env node
'use strict';
/* V234 owner NBF Grade XI Unit 8 p147–149: Entropy, Example 8.6,
 * Assignment 8.6 and original summative SLOs. No scored release.
 * Test source independently, browser actual calculations and all routes.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8'),json=p=>JSON.parse(read(p));
const cat=json('portal/learning-catalog.json');
const src=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const bank=json('question-bank/manifest.json');
const units=cat.grades.find(g=>g.grade===11).units,u8=units.find(u=>u.unit===8),u7=units.find(u=>u.unit===7);
const html=read('portal/unit-08-topic810-entropy-v234.html');
const prev=read('portal/unit-08-topic89-refrigerator-v233.html');
const quick=read('portal/exam-quick-access.html'),nav=read('shared/navigation.js');
const target='./unit-08-topic810-entropy-v234.html',artifactDir=path.join(ROOT,'qa-artifacts/grade11-v234-unit08-topic810-entropy-browser');
function sourceAndScience(){
 assert.equal(src.version,'V224');
 const section=src.sections.find(s=>s.code==='8.10');
 assert.deepEqual([section.title,...section.pages],['Entropy',147,149]);
 assert.deepEqual(section.subtopics.map(x=>[x.code,...x.pages]),[['8.10.1',148,148],['8.10.2',149,149]]);
 assert.deepEqual(section.slo,['P-11-C-18','P-11-C-19','P-11-C-20','P-11-C-21','P-11-C-22']);
 const matched=src.officialFramework.slos.filter(s=>section.slo.includes(s.printedCode));
 assert.deepEqual(matched.map(s=>[s.printedCode,s.assessment,s.cognitive,s.frameworkPdfPage]),[
  ['P-11-C-18','Summative','Understanding',14],['P-11-C-19','Summative','Understanding',14],
  ['P-11-C-20','Summative','Understanding',14],['P-11-C-21','Summative','Understanding',14],
  ['P-11-C-22','Summative','Understanding',14]]);
 assert.deepEqual(src.figures.filter(f=>['8.19','8.20'].includes(f.figure)).map(f=>[f.figure,f.printedPage,f.topic,f.sourceImageNotPublished]),[
  ['8.19',148,'8.10',true],['8.20',148,'8.10',true]]);
 assert.deepEqual(src.examples.find(e=>e.id==='Example 8.6').printedPages,[149,149]);
 assert.equal(src.assignments.find(e=>e.id==='Assignment 8.6').printedPage,149);
 assert.equal(src.sections.find(s=>s.code==='8.11'),undefined);
 assert.equal(u8.status,'planned');
 assert.equal(u8.assessmentStatus,'not-published');
 assert.equal(u8.questionBankCount,0);assert.deepEqual(u8.resourceIds,[]);
 assert.equal(u8.simulationCount,4);
 assert.equal(u8.learningPreviewStatus,'public-topic-8.1-unscored-study-teacher-review');
 assert.deepEqual(u8.additionalLearningPreviews.map(x=>x.topic),['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10']);
 assert.deepEqual(u8.additionalLearningPreviews[8],{
  topic:'8.10',title:'Entropy: Heat-Flow Signs, Energy and Example/Assignment 8.6',
  href:target,sourcePages:[147,149],access:'public-unscored-study-teacher-review'
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
 for(const topic of ['8.1','8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9'])
  assert.ok(quick.includes('Study Topic '+topic));
 assert.ok(quick.includes('Chapter exercises starting on p.150 remain planned'));
 assert.ok(!quick.includes('build-your-physics-test.html?unit=8'));
 assert.ok(nav.includes("['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10'].includes(study.topic)"));
 assert.ok(nav.includes('Unit 8 · Topic 8.10 Entropy, Sign Convention and Energy'));
 assert.ok(prev.includes('href="'+target+'"'));
 for(const id of ['lesson-status','meaning','entropy-caution','signs','entropy-equation','energy',
  'total-entropy','example86','example86-solution','example86-result','assignment86',
  'assignment86-solution','assignment86-result','calculators','melting-calculator','melt-mass',
  'melt-latent','melt-temp','melt-calculate','melt-result','heat-calculator','signed-heat',
  'heat-temp','heat-calculate','heat-result','scenarios','case-title','case-explanation',
  'self-check','continue'])assert.ok(html.includes('id="'+id+'"'),'Missing entropy source section '+id);
 assert.ok(html.includes('data-academic-review="pending" data-scored-release="false"'));
 assert.match(html,/Original printed pages 147–149/);
 assert.match(html,/P-11-C-18 through P-11-C-22/);
 assert.match(html,/3.36 × 10<sup>5<\/sup> J\/kg/);
 assert.match(html,/700 g/);assert.match(html,/235,200 J/);assert.match(html,/861.5 J\/K/);
 assert.match(html,/7,373 J/);assert.match(html,/150 °C/);
 assert.match(html,/−7,373 J/);assert.match(html,/423 K/);assert.match(html,/−17.4 J\/K/);
 assert.match(html,/ΔS = Q<sub>rev<\/sub> \/ T/);
 assert.match(html,/isolated system/);
 assert.match(html,/combined.*entropy.*zero|combined.*entropy.*increases|system plus surroundings.*zero/s);
 assert.ok(!html.includes('grade11-answers.json')&&!html.includes('build-your-physics-test.html?unit=8'));
 assert.equal((html.match(/data-case="[0-3]"/g)||[]).length,4);
 assert.equal((html.match(/<details><summary>/g)||[]).length,5);
 for(const bad of ['getAuth(','getFirestore(','initializeAppCheck','indexedDB','localStorage','sessionStorage','navigator.sendBeacon'])
  assert.ok(!html.includes(bad),'Unscored resource must not access accounts or storage '+bad);
 // Independent exact original-source arithmetic, separate from lesson implementation.
 const meltMass=.7,meltLatent=336000,sourceKelvin=273,sourceHeat=meltMass*meltLatent;
 // IEEE-754 binary floating point gives 0.7 * 336000 = 235199.99999999997.
 // Preserve the source's 235200 J result with a tight absolute tolerance.
 assert.ok(Math.abs(sourceHeat-235200)<1e-8,'Melting latent heat must equal 235200 J within floating-point tolerance');
 assert.ok(Math.abs(sourceHeat/sourceKelvin-861.5384615)<.001);
 assert.ok(Math.abs(sourceHeat/273.15-861.066)<.01);
 const heatOut=-7373,bookT=150+273;
 assert.equal(bookT,423);
 assert.ok(Math.abs(heatOut/bookT-(-17.43026))<.001);
 assert.ok(Math.abs(heatOut/423.15-(-17.424))<.002);
 assert.equal(-7373<0,true);
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{try{
 const p=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname),file=path.resolve(ROOT,'.'+p);
 if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
  res.writeHead(404);res.end('Not found');return;
 }
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
}catch{res.writeHead(400);res.end('Bad request')}});
async function serve(){await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});return 'http://127.0.0.1:'+server.address().port+'/'}
async function browserCase(browser,base,width,entry){
 const page=await browser.newPage({viewport:{width,height:920},deviceScaleFactor:1}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  if(entry==='sidebar'){
   assert.equal((await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'})).status(),200);
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(document.querySelector('.psn-drawer-loading')?.textContent||'').includes('unit menus'),null,{timeout:20000});
   const future=page.locator('.psn-drawer-future[data-psn-future-units="7,8,9,10"]');
   assert.equal(await future.count(),1);await future.locator('summary').click();
   const link=future.locator('a[href*="unit-08-topic810-entropy-v234.html"]');
   assert.equal(await link.count(),1);
   assert.equal(await future.locator('a[href*="unit-08-topic89-refrigerator-v233.html"]').count(),1);
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
   assert.equal((await page.goto(base+'portal/unit-08-topic810-entropy-v234.html',{waitUntil:'domcontentloaded'})).status(),200);
  }
  await page.waitForURL(u=>u.pathname==='/portal/unit-08-topic810-entropy-v234.html',{timeout:15000});
  assert.equal(await page.locator('#lesson-status[data-academic-review="pending"][data-scored-release="false"]').count(),1);
  assert.equal(await page.locator('h1').count(),1);
  await page.locator('#example86-solution summary').click();
  assert.match(await page.locator('#example86-result').innerText(),/861.5 J\/K/);
  await page.locator('#assignment86-solution summary').click();
  assert.match(await page.locator('#assignment86-result').innerText(),/−17.4 J\/K/);
  await page.locator('#melt-calculate').click();
  let value=await page.locator('#melt-result').innerText();
  assert.match(value,/235200 J/);
  assert.match(value,/\+861\.0/);
  await page.locator('#melt-mass').fill('350');
  await page.locator('#melt-calculate').click();
  value=await page.locator('#melt-result').innerText();
  assert.match(value,/117600 J/);assert.match(value,/\+430\.5/);
  await page.locator('#melt-mass').fill('-5');
  await page.locator('#melt-calculate').click();
  assert.match(await page.locator('#melt-result').innerText(),/finite positive mass/);
  await page.locator('#melt-mass').fill('700');
  await page.locator('#melt-temp').fill('-273.15');
  await page.locator('#melt-calculate').click();
  assert.match(await page.locator('#melt-result').innerText(),/above absolute zero/);
  await page.locator('#heat-calculate').click();
  value=await page.locator('#heat-result').innerText();
  assert.match(value,/entropy change ΔS = −17\.42/);
  await page.locator('#signed-heat').fill('7373');
  await page.locator('#heat-calculate').click();
  assert.match(await page.locator('#heat-result').innerText(),/entropy change ΔS = \+17\.42/);
  await page.locator('#heat-temp').fill('');
  await page.locator('#heat-calculate').click();
  assert.match(await page.locator('#heat-result').innerText(),/finite signed heat/);
  const buttons=page.locator('#scenarios [data-case]');
  assert.equal(await buttons.count(),4);
  const labels=['The system\'s entropy increases','The system\'s entropy decreases','Total entropy increases','Total entropy increases'];
  for(let i=0;i<4;i++){
   await buttons.nth(i).click();
   assert.equal(await page.locator('#case-title').innerText(),labels[i]);
   assert.equal(await buttons.nth(i).getAttribute('aria-pressed'),'true');
   for(let j=0;j<4;j++)if(j!==i)assert.equal(await buttons.nth(j).getAttribute('aria-pressed'),'false');
  }
  assert.equal(await page.locator('#self-check details').count(),5);
  await page.locator('#self-check details').nth(4).locator('summary').click();
  assert.match(await page.locator('#self-check details').nth(4).innerText(),/combined/);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Horizontal page overflow at '+width+'px: '+overflow);
  assert.deepEqual(errors,[],'No browser JS exceptions');
  return{viewport:width,entry,topic:'8.10',printedPages:[147,149],example86BookJPerK:861.5,
   assignment86BookJPerK:-17.4,scenarios:4,conceptChecks:5,studentScoredMcqs:0,teacherApproval:'PENDING',overflow};
 }finally{await page.close()}
}
(async()=>{sourceAndScience();fs.mkdirSync(artifactDir,{recursive:true});const base=await serve();let browser;
 try{browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const cases=[await browserCase(browser,base,1280,'sidebar'),await browserCase(browser,base,390,'quick'),await browserCase(browser,base,320,'direct')];
 fs.writeFileSync(path.join(artifactDir,'evidence.json'),JSON.stringify({
  version:'V234',source:'Original owner NBF Grade XI Unit8 printed pp147–149 visually verified',
  summativeTheorySLOs:['P-11-C-18','P-11-C-19','P-11-C-20','P-11-C-21','P-11-C-22'],
  publisherFiguresCopied:false,sourceExample:'8.6',sourceAssignment:'8.6',
  unit8ScoredMcqs:0,pinnedUnit1to6Mcqs:2250,humanAcademicReview:'PENDING',cases
 },null,2)+'\n');
 console.log('V234 PASS: source entropy signs, ice melting and negative heat, 1280/390/320 actual Chromium, assessment holds');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(e=>{console.error('V234 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
