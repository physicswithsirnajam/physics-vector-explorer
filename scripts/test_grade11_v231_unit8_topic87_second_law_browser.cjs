#!/usr/bin/env node
'use strict';
/* V231: original NBF Grade XI Unit8 printed pp142–143, Kelvin/Clausius.
 * Independent SLO and release-state assertions plus real Chromium user routes.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8'),json=p=>JSON.parse(read(p));
const catalog=json('portal/learning-catalog.json'),source=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const bank=json('question-bank/manifest.json');
const units=catalog.grades.find(g=>g.grade===11).units,u8=units.find(u=>u.unit===8),u7=units.find(u=>u.unit===7);
const html=read('portal/unit-08-topic87-second-law-v231.html');
const prior=read('portal/unit-08-topic86-reversible-processes-v230.html'),quick=read('portal/exam-quick-access.html'),nav=read('shared/navigation.js');
const target='./unit-08-topic87-second-law-v231.html';
const outDir=path.join(ROOT,'qa-artifacts/grade11-v231-unit08-topic87-second-law-browser');
function sourceAndScience(){
 assert.equal(source.version,'V224');
 const s=source.sections.find(x=>x.code==='8.7');
 assert.equal(s.title,'Second Law of Thermodynamics');
 assert.deepEqual(s.pages,[142,143]);assert.deepEqual(s.subtopics,[]);assert.deepEqual(s.slo,['P-11-C-15']);
 const slo=source.officialFramework.slos.find(x=>x.printedCode==='P-11-C-15');
 assert.deepEqual([slo.displayShortDescription,slo.assessment,slo.cognitive,slo.frameworkPdfPage],
 ['Second law of thermodynamics','Summative','Understanding',13]);
 const next=source.sections.find(x=>x.code==='8.8');
 assert.equal(next.title,"Carnot's Engine");assert.deepEqual(next.pages,[143,145]);
 assert.deepEqual(next.slo,['P-11-C-16','P-11-C-23']);
 assert.equal(u8.status,'planned');assert.equal(u8.questionBankCount,0);
 assert.equal(u8.assessmentStatus,'not-published');assert.deepEqual(u8.resourceIds,[]);
 assert.equal(u8.simulationCount,4);
 assert.equal(u8.learningPreviewStatus,'public-topic-8.1-unscored-study-teacher-review');
 assert.deepEqual(u8.additionalLearningPreviews.map(x=>x.topic),['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9']);
 assert.deepEqual(u8.additionalLearningPreviews[5],{
  topic:'8.7',title:'Second Law of Thermodynamics: Kelvin and Clausius',
  href:target,sourcePages:[142,143],access:'public-unscored-study-teacher-review'
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
 assert.match(u8.summary,/Nine source-based, unscored study lessons/);
 assert.match(u8.studentNotice,/unscored learning preview/);
 assert.match(u8.studentNotice,/No Unit8 scored bank/);
 assert.equal(u7.questionBankCount,0);assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(catalog.resources.length,59);
 assert.deepEqual(bank.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
 assert.equal(source.releaseGate.studentScoredUnit8Mcqs,0);
 assert.equal(quick.split('id="unit8-unscored-study-preview"').length-1,1);
 assert.equal(quick.split('href="'+target+'"').length-1,1);
 for(const topic of ['8.1','8.2','8.3','8.4','8.5','8.6'])assert.ok(quick.includes('Study Topic '+topic));
 assert.ok(quick.includes('Topic 8.10 onward remain planned.'));
 assert.ok(!quick.includes('build-your-physics-test.html?unit=8'));
 assert.ok(nav.includes("['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9'].includes(study.topic)"));
 assert.ok(nav.includes('Unit 8 · Topic 8.7 Second Law (Kelvin and Clausius)'));
 assert.ok(nav.includes('Unit 8 · Topic 8.8 Carnot Engine and Efficiency'));
 assert.ok(nav.includes('Unit 8 · Topic 8.9 Refrigerator and Cooling/Heating COP'));
 assert.ok(prior.includes('href="'+target+'"'));
 for(const id of ['lesson-status','first-versus-second','limitation-note','kelvin','engine-relation',
  'clausius','fridge-note','flow','scenarios','case-output','case-answer','case-explanation','self-check','continue']){
  assert.ok(html.includes('id="'+id+'"'),'Missing lesson component '+id);
 }
 assert.ok(html.includes('data-academic-review="pending" data-scored-release="false"'));
 assert.match(html,/Original printed pages 142–143/);assert.match(html,/P-11-C-15/);
 assert.match(html,/Kelvin–Planck/);assert.match(html,/Clausius/);
 assert.match(html,/sole effect/);assert.match(html,/external work/);
 assert.match(html,/cannot produce net work/);
 assert.match(html,/ΔU<sub>cycle<\/sub> = 0/);
 assert.match(html,/W<sub>net,out<\/sub> = Q<sub>H<\/sub> − Q<sub>C<\/sub>/);
 assert.match(html,/900 J − 500 J = <strong>400 J<\/strong>/);
 assert.equal((html.match(/data-case="[0-5]"/g)||[]).length,6);
 assert.equal((html.match(/<details><summary>/g)||[]).length,5);
 assert.ok(!html.includes('grade11-answers.json'));
 assert.ok(!html.includes('build-your-physics-test.html?unit=8'));
 for(const banned of ['getAuth(','getFirestore(','initializeAppCheck','indexedDB','localStorage','sessionStorage','navigator.sendBeacon']){
  assert.ok(!html.includes(banned),'Source lesson must not save score, access user identity or backend: '+banned);
 }
 assert.equal(900-500,400);assert.equal(600-600,0);
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{try{
 const p=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname),file=path.resolve(ROOT,'.'+p);
 if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
  res.writeHead(404);res.end('Not found');return;
 }
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
}catch{res.writeHead(400);res.end('Bad request')}});
async function serve(){await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});return 'http://127.0.0.1:'+server.address().port+'/'}
async function browserCheck(browser,base,width,entry){
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  if(entry==='sidebar'){
   assert.equal((await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'})).status(),200);
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(document.querySelector('.psn-drawer-loading')?.textContent||'').includes('unit menus'),null,{timeout:20000});
   const group=page.locator('.psn-drawer-future[data-psn-future-units="7,8,9,10"]');
   assert.equal(await group.count(),1);await group.locator('summary').click();
   const link=group.locator('a[href*="unit-08-topic87-second-law-v231.html"]');
   assert.equal(await link.count(),1);
   assert.equal(await group.locator('a[href*="unit-08-topic86-reversible-processes-v230.html"]').count(),1);
   assert.equal(await group.locator('a[href*="build-your-physics-test.html?unit=8"]').count(),0);
   await link.click();
  }else if(entry==='quick'){
   assert.equal((await page.goto(base+'portal/exam-quick-access.html',{waitUntil:'domcontentloaded'})).status(),200);
   const block=page.locator('#unit8-unscored-study-preview');
   assert.equal(await block.count(),1);assert.equal(await block.locator('a[href="'+target+'"]').count(),1);
   assert.equal(await block.locator('a[href*="build-your-physics-test"]').count(),0);
   await block.locator('a[href="'+target+'"]').click();
  }else{
   assert.equal((await page.goto(base+'portal/unit-08-topic87-second-law-v231.html',{waitUntil:'domcontentloaded'})).status(),200);
  }
  await page.waitForURL(u=>u.pathname==='/portal/unit-08-topic87-second-law-v231.html',{timeout:15000});
  assert.equal(await page.locator('#lesson-status[data-academic-review="pending"][data-scored-release="false"]').count(),1);
  assert.equal(await page.locator('h1').count(),1);
  const buttons=page.locator('#scenarios [data-case]');
  assert.equal(await buttons.count(),6);
  const expect=[
   'Consistent with the Second Law',
   'Not possible as stated · Kelvin–Planck',
   'Possible with external work · Clausius',
   'Not possible as stated · Clausius',
   'Consistent in principle · Kelvin–Planck',
   'Possible: this is not a single-reservoir cyclic engine'
  ];
  for(let i=0;i<6;i++){
   await buttons.nth(i).click();
   assert.equal(await page.locator('#case-answer').innerText(),expect[i]);
   assert.equal(await buttons.nth(i).getAttribute('aria-pressed'),'true');
   for(let j=0;j<6;j++)if(j!==i)assert.equal(await buttons.nth(j).getAttribute('aria-pressed'),'false');
  }
  assert.equal(await page.locator('#self-check details').count(),5);
  await page.locator('#self-check details').nth(3).locator('summary').click();
  assert.match(await page.locator('#self-check details').nth(3).innerText(),/400 J/);
  assert.match(await page.locator('#fridge-note').innerText(),/does not violate/);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Horizontal overflow at '+width+': '+overflow);
  assert.deepEqual(errors,[],'No JS exceptions in student lesson');
  return {viewport:width,entry,topic:'8.7',sourcePages:[142,143],caseCount:6,conceptChecks:5,
    originalScoredMcqs:0,teacherApproval:'PENDING',overflow};
 }finally{await page.close()}
}
(async()=>{sourceAndScience();fs.mkdirSync(outDir,{recursive:true});const base=await serve();let browser;
 try{browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const cases=[await browserCheck(browser,base,1280,'sidebar'),await browserCheck(browser,base,390,'quick'),await browserCheck(browser,base,320,'direct')];
 fs.writeFileSync(path.join(outDir,'evidence.json'),JSON.stringify({
  version:'V231',source:'Owner original NBF XI printed pp142–143 visually reviewed',
  summativeTheoryOutcome:'P-11-C-15',originalPublisherFiguresCopied:false,
  studentScoredMcqs:0,originalUnit1to6PinnedMcqsPreserved:2250,
  teacherAcademicApproval:'PENDING',cases
 },null,2)+'\n');
 console.log('V231 PASS: Second Law original source, Kelvin/Clausius, unscored routes and 1280/390/320 Chromium scenarios.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(err=>{console.error('V231 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
