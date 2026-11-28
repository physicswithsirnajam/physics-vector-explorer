#!/usr/bin/env node
'use strict';
/* V236: deliberately expose existing unscored Units7-8 study, NOT their unavailable MCQ banks. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const catalog=json('portal/learning-catalog.json');
const manifest=json('question-bank/manifest.json');
const units=catalog.grades.find(g=>g.grade===11).units;
const u7=units.find(u=>u.unit===7),u8=units.find(u=>u.unit===8);
const guide=read('student-guide.html'),builder=read('build-your-physics-test.html'),nav=read('shared/navigation.js'),quick=read('portal/exam-quick-access.html');
const outDir=path.join(root,'qa-artifacts/grade11-v236-units78-student-navigation');
function staticReview(){
 const bank=manifest.grades.find(g=>g.grade===11).units;
 assert.deepEqual(bank.slice(0,6).map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
 assert.equal(bank.slice(0,6).reduce((n,x)=>n+x.liveMcqCount,0),2250);
 assert.equal(catalog.resources.length,59);
 for(const u of [u7,u8]){
  assert.equal(u.status,'planned');assert.equal(u.assessmentStatus,'not-published');
  assert.equal(u.questionBankCount,0);assert.deepEqual(u.resourceIds,[]);
 }
 assert.equal(u7.additionalLearningPreviews.length,2);
 assert.equal(u8.additionalLearningPreviews.length,9);
 assert.equal(u7.simulationCount,2);assert.equal(u8.simulationCount,4);
 assert.deepEqual(u8.additionalLearningPreviews.map(x=>x.topic),['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10']);
 assert.match(nav,/Unit 7 · Study lessons \(unscored\)/);
 assert.match(nav,/Unit 8 · 10 study lessons \(unscored\)/);
 assert.match(nav,/data\.psnFutureUnits=units\.map\(unit=>unit\.unit\)\.join\(','\)/);
 assert.match(nav,/Units 7–8 · public study previews; Units 9–10 planned/);
 assert.match(nav,/Ten unscored topic lessons \(8\.1–8\.10\)/);
 assert.match(guide,/Explore Grade XI Units 1–8/);
 assert.match(guide,/for\(let n=1;n<=6;n\+\+\)/);
 assert.match(guide,/question-total">2250/);
 assert.match(builder,/id="unit7-8-study-access"/);
 assert.match(builder,/id="unit7-8-bank-hold"/);
 assert.match(builder,/studyOnly\?\[\]:/);
 assert.match(builder,/liveBanks=Object\.fromEntries\(\[1,2,3,4,5,6\]/);
 assert.match(builder,/p\.units\.every\(u=>u>=1&&u<=6\)/);
 assert.match(builder,/el\.disabled=full\|\|Number\(el\.value\)>6/);
 assert.ok(!/loadBank\((7|8),/.test(builder));
 for(const anchor of ['unit7-unscored-study-preview','unit8-unscored-study-preview']){
  assert.ok(builder.includes('#'+anchor));
  assert.ok(guide.includes('#'+anchor));
  assert.ok(nav.includes('#'+anchor));
  assert.ok(quick.includes('id="'+anchor+'"'));
 }
 assert.equal((quick.match(/href="\.\/unit-08-topic8/g)||[]).length,10);
 assert.ok(quick.includes('Original NBF end-of-unit MCQs'));
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{try{
 const p=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname),file=path.resolve(root,'.'+p);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
}catch{res.writeHead(400);res.end('Bad request')}});
async function serve(){await new Promise((ok,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',ok)});return 'http://127.0.0.1:'+server.address().port+'/'}
async function runPage(browser,base,width,kind){
 const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  if(kind==='sidebar'){
   assert.equal((await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'})).status(),200);
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(document.querySelector('.psn-drawer-loading')?.textContent||'').includes('unit menus'),null,{timeout:20000});
   const quick=page.locator('#psn-resource-drawer .psn-drawer-quick');
   assert.equal(await quick.locator('a[href*="#unit7-unscored-study-preview"]').count(),1);
   assert.equal(await quick.locator('a[href*="#unit8-unscored-study-preview"]').count(),1);
   const future=page.locator('.psn-drawer-future[data-psn-future-units="7,8,9,10"]');
   assert.equal(await future.count(),1);
   await future.locator('summary').click();
   assert.equal(await future.locator('a[href*="unit-07-learning-intro-v145.html"]').count(),1);
   assert.equal(await future.locator('a[href*="unit-07-topic72-deformation-v162.html"]').count(),1);
   assert.equal(await future.locator('a[href*="unit-07-topic73-elastic-energy-v163.html"]').count(),1);
   assert.equal(await future.locator('a[href*="unit-08-topic8"]').count(),10);
   assert.equal(await future.locator('a[href*="build-your-physics-test.html?unit=8"]').count(),0);
   assert.equal(await future.locator('a[href*="build-your-physics-test.html?unit=7"]').count(),0);
   assert.match(await future.innerText(),/10 unscored lessons available/);
   // The previously hidden lessons can be reached from a prominent link.
   await quick.locator('a[href*="#unit8-unscored-study-preview"]').click();
   await page.waitForURL(u=>u.pathname==='/portal/exam-quick-access.html'&&u.hash==='#unit8-unscored-study-preview');
   assert.equal(await page.locator('#unit8-unscored-study-preview a[href*="unit-08-topic8"]').count(),10);
  }else if(kind==='guide'){
   assert.equal((await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'})).status(),200);
   for(const n of [6,7,8])assert.equal(await page.locator('[data-unit="'+n+'"]').count(),1);
   assert.equal(await page.locator('[data-unit="6"] .count').innerText(),'560 provisional MCQs');
   assert.match(await page.locator('[data-unit="7"]').innerText(),/3 unscored topic lessons/);
   assert.match(await page.locator('[data-unit="8"]').innerText(),/10 unscored topic lessons/);
   assert.equal(await page.locator('[data-unit="7"] a[href*="build-your-physics-test"]').count(),0);
   assert.equal(await page.locator('[data-unit="8"] a[href*="build-your-physics-test"]').count(),0);
   assert.equal(await page.locator('#question-total').innerText(),'2250');
  }else{
   const unit=kind==='builder7'?7:8;
   assert.equal((await page.goto(base+'build-your-physics-test.html?unit='+unit,{waitUntil:'domcontentloaded'})).status(),200);
   const study=page.locator('#unit7-8-study-access');
   assert.equal(await study.count(),1);
   for(const n of [7,8]){
    assert.equal(await study.locator('a[href*="#unit'+n+'-unscored-study-preview"]').count(),1);
    const checkbox=page.locator('#units input[name="unit"][value="'+n+'"]');
    assert.equal(await checkbox.count(),1);
    assert.equal(await checkbox.isDisabled(),true);
    assert.equal(await checkbox.isChecked(),false);
   }
   assert.equal(await page.locator('#units input[name="unit"]:checked').count(),0,'Do not silently select Unit 1 for study-only deep link');
   assert.match(await page.locator('#unit7-8-bank-hold').innerText(),new RegExp('requested Unit '+unit));
   assert.equal(await page.locator('#quickStartLink').isVisible(),false,'No MCQ test launch for unapproved Unit7/8');
   assert.equal(await page.locator('#pilotStartLink').isVisible(),false,'No alternate test launch');
   assert.equal(await study.locator('a[href*="simulations.html?unit=8"]').count(),1);
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Unexpected horizontal overflow on '+kind+' at '+width+'px: '+overflow);
  assert.deepEqual(errors,[],'No JS errors for '+kind+' at '+width+'px');
  return {width,entry:kind,studentLinksAvailable:true,scoredUnit7And8Mcqs:0,overflow};
 }finally{await page.close()}
}
(async()=>{staticReview();fs.mkdirSync(outDir,{recursive:true});const base=await serve();let browser;
 try{browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const results=[];
  for(const [width,entry] of [[1280,'sidebar'],[390,'sidebar'],[390,'guide'],[1280,'builder7'],[390,'builder8']])
   results.push(await runPage(browser,base,width,entry));
  fs.writeFileSync(path.join(outDir,'evidence.json'),JSON.stringify({version:'V236',unit7PublicUnscoredLessons:3,unit8PublicUnscoredLessons:10,liveMcqUnits:[1,2,3,4,5,6],liveMcqs:2250,unit7And8BankStatus:'NOT-PUBLISHED',teacherApproval:'PENDING',results},null,2)+'\n');
  console.log('V236 PASS: Unit7/8 discoverable from left nav, Student Guide and Test Builder; no question bank unlock.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(e=>{console.error('V236 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}});
