#!/usr/bin/env node
'use strict';
/* V225: original NBF pp128–131 unscored study, real mobile and sidebar.
 * Source original scanned PDF is intentionally NOT copied into GitHub;
 * CI validates sourced input identities and independently derived physics,
 * not authentication of a teacher's academic approval.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),
 path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const cat=json('portal/learning-catalog.json');
const m=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const bank=json('question-bank/manifest.json');
const page=read('portal/unit-08-topic81-thermal-equilibrium-v225.html');
const nav=read('shared/navigation.js'),quick=read('portal/exam-quick-access.html');
const u8=cat.grades.find(g=>g.grade===11).units.find(x=>x.unit===8);
const u7=cat.grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
const lesson='./unit-08-topic81-thermal-equilibrium-v225.html';
const evidence=path.join(ROOT,'qa-artifacts/grade11-v225-unit8-topic81-unscored');
function sourceAndScience(){
 assert.equal(m.version,'V224');
 assert.deepEqual(m.originalTextbook.printedPages,[127,153]);
 assert.deepEqual(m.sections[0].pages,[128,131]);
 assert.deepEqual(m.examples[0].printedPages,[130,131]);
 assert.equal(m.assignments[0].printedPage,131);
 assert.equal(m.officialFramework.slos[0].printedCode,'P-12-C-01',
  'Keep the original framework oddity unnormalized');
 assert.equal(m.officialFramework.slos[1].printedCode,'P-11-C-02');
 assert.equal(m.officialFramework.slos[2].printedCode,'P-11-C-03');
 assert.equal(m.officialFramework.slos[3].printedCode,'P-11-C-04');
 assert.equal(cat.resources.length,59);
 assert.equal(u8.status,'planned');
 assert.equal(u8.questionBankCount,0);
 assert.equal(u8.assessmentStatus,'not-published');
 assert.equal(u8.simulationCount,4);
 assert.deepEqual(u8.resourceIds,[]);
 assert.equal(u8.learningPreviewHref,lesson);
 assert.equal(u8.learningPreviewStatus,'public-topic-8.1-unscored-study-teacher-review');
 assert.deepEqual(u8.learningPreviewSourcePages,[128,131]);
 assert.match(u8.studentNotice,/unscored learning preview/);
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.deepEqual(bank.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),
  [275,206,220,640,349,560],'Frozen 2250 public MCQ identities and answers remain unchanged');
 for(const id of ['lesson-status','equilibrium','internal-energy','gas-equation',
  'example81','assignment81','assignment-solution','explore','self-check','gas-p','gas-v','gas-t',
  'gas-output','calculate','assignment-result','example-result']){
  assert.ok(page.includes('id="'+id+'"'),'Missing linked educational element '+id);
 }
 assert.ok(page.includes('data-scored-release="false"'));
 assert.ok(page.includes('data-academic-review="pending"'));
 assert.ok(page.includes('Original textbook Example 8.1'));
 assert.ok(page.includes('Original textbook Assignment 8.1'));
 assert.ok(page.includes('25 °C ≈ 298 K'));
 assert.ok(page.includes('27 °C and 1 atm'));
 assert.ok(page.includes('20.0 m³'));
 assert.ok(page.includes('1.01325 × 10<sup>5</sup> Pa'));
 assert.ok(page.includes('3⁄2 k<sub>B</sub>T'));
 assert.ok(page.includes('ΔU = U<sub>final</sub> − U<sub>initial</sub>'));
 assert.ok(page.includes('pV = nRT'));
 assert.ok(page.includes('pV = Nk<sub>B</sub>T'));
 assert.ok(page.includes('6.17 × 10<sup>−21</sup> J'));
 assert.ok(page.includes('4.89 × 10<sup>26</sup> molecules'));
 assert.ok(page.includes('no <em>net</em> heat flow')||page.includes('no <strong>net heat transfer</strong>'));
 assert.ok(page.includes('heat is energy transferred because of a temperature difference'));
 assert.ok(page.includes('For an <strong>ideal gas</strong>'));
 assert.ok(page.includes('teacher academic review pending')||page.includes('Teacher academic review pending'));
 assert.ok(!page.includes('id="unit8-scored-mcq-bank"'));
 for(const t of ['firebase.firestore','getFirestore(','getAuth(','signInWithEmailAndPassword',
   'indexedDB','localStorage','sessionStorage','fetch(']){
  assert.ok(!page.includes(t),'Public learning page must have no auth/network/storage capability: '+t);
 }
 // Validate source-derived Example 8.1 using the book's k rounded to 3 significant figures.
 const mean=1.5*(1.38e-23)*(25+273);
 assert.ok(Math.abs(mean-6.1686e-21)<1e-32,'Example 8.1 source arithmetic');
 assert.ok(Math.abs(mean/1e-21-6.17)<0.005,'Example 8.1 three-significant-digit answer');
 // Validate Assignment 8.1 from exact SI constants; book permits rounding to ~4.89e26.
 const kB=1.380649e-23,NA=6.02214076e23,R=NA*kB;
 const pressure=101325,volume=20.0,T=27+273;
 const N=pressure*volume/(kB*T),n=pressure*volume/(R*T);
 assert.ok(Math.abs(N/1e26-4.892626583584965)<1e-9);
 assert.ok(Math.abs(n-812.4397583)<0.001);
 assert.ok(Math.abs(N-n*NA)/N<1e-12,'Ideal gas two source forms agree');
 assert.ok(nav.includes("unit.learningPreviewStatus==='public-topic-8.1-unscored-study-teacher-review'"));
 assert.ok(nav.includes('Unit 8 · Topic 8.1 Thermal Equilibrium, Internal Energy and Ideal Gas'));
 assert.equal(quick.split('id="unit8-unscored-study-preview"').length-1,1);
 assert.ok(quick.includes('href="'+lesson+'"'));
 assert.ok(!quick.includes('build-your-physics-test.html?unit=8'));
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
 '.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
 '.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const f=path.resolve(ROOT,'.'+p);
  if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
 }catch{res.writeHead(400);res.end('Bad request')}
});
async function start(){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function browse(browser,base,width,route){
 const page=await browser.newPage({viewport:{width,height:880}});
 const errors=[];page.on('pageerror',err=>errors.push(err.message));
 try{
  if(route==='quick'){
   assert.equal((await page.goto(base+'portal/exam-quick-access.html',{waitUntil:'domcontentloaded'})).status(),200);
   const area=page.locator('#unit8-unscored-study-preview');
   assert.equal(await area.count(),1);
   assert.equal(await area.locator('a[href="'+lesson+'"]').count(),1);
   assert.equal(await area.locator('a[href*="build-your-physics-test"]').count(),0);
   await area.locator('a[href="'+lesson+'"]').click();
  }else if(route==='sidebar'){
   assert.equal((await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'})).status(),200);
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(
    document.querySelector('.psn-drawer-loading')?.textContent||''
   ).includes('unit menus'),null,{timeout:20000});
   const unit8=page.locator('.psn-drawer-future[data-psn-future-units="7,8,9,10"]');
   assert.equal(await unit8.count(),1,'Planned group still contains Unit8');
   await unit8.locator('summary').click();
   const l=unit8.locator('a[href*="unit-08-topic81-thermal-equilibrium-v225.html"]');
   assert.equal(await l.count(),1);
   assert.ok((await unit8.innerText()).includes('no Unit 8 scored MCQs'));
   assert.equal(await unit8.locator('a[href*="build-your-physics-test.html?unit=8"]').count(),0);
   await l.click();
  }else{
   assert.equal((await page.goto(base+'portal/unit-08-topic81-thermal-equilibrium-v225.html',
    {waitUntil:'domcontentloaded'})).status(),200);
  }
  await page.waitForURL(url=>url.pathname==='/portal/unit-08-topic81-thermal-equilibrium-v225.html',
   {timeout:15000});
  assert.equal(await page.locator('#lesson-status[data-scored-release="false"][data-academic-review="pending"]').count(),1);
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('#assignment-solution').count(),1);
  assert.ok(!(await page.locator('#assignment-solution').evaluate(e=>e.open)));
  await page.locator('#assignment-solution summary').click();
  assert.ok(await page.locator('#assignment-solution').evaluate(e=>e.open));
  assert.equal(await page.locator('#assignment-result').count(),1);
  assert.match(await page.locator('#assignment-result').innerText(),/4.89 × 10/);
  assert.match(await page.locator('#example-result').innerText(),/6.17 × 10/);
  // Interactive ideal gas calculator validates the original room data, then responsive change.
  await page.locator('#calculate').click();
  let value=await page.locator('#gas-output').innerText();
  assert.match(value,/4\.893e\+26/,'Default Assignment 8.1 ideal gas calculator answer');
  await page.locator('#gas-v').fill('40.0');
  await page.locator('#calculate').click();
  value=await page.locator('#gas-output').innerText();
  assert.match(value,/9\.785e\+26/,'At same p,T doubling volume doubles molecules');
  await page.locator('#gas-t').fill('0');
  await page.locator('#calculate').click();
  assert.match(await page.locator('#gas-output').innerText(),/positive, finite absolute pressure/);
  assert.equal(await page.locator('#self-check details').count(),4);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Narrow student page should not overflow '+width+'px by '+overflow);
  assert.deepEqual(errors,[],'No runtime errors on student device');
  return {width,entry:route,topic:'8.1',sourcePages:[128,131],
   officialExample:'8.1',officialAssignment:'8.1',
   calculatorValidated:true,teacherApproved:false,gradedMcqReleased:false};
 }finally{await page.close()}
}
(async()=>{
 sourceAndScience();fs.mkdirSync(evidence,{recursive:true});
 const base=await start();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const checked=[
   await browse(browser,base,1280,'sidebar'),
   await browse(browser,base,390,'quick'),
   await browse(browser,base,320,'direct')
  ];
  fs.writeFileSync(path.join(evidence,'evidence.json'),JSON.stringify({
   version:'V225',source:'Original NBF textbook printed pp.128–131; 2026-11-27 visual source audit',
   unscoredLesson:1,sourceExample:1,sourceAssignment:1,teacherScienceApproval:'PENDING',
   teacherCognitiveApproval:'PENDING',unit8ScoredBankCount:0,existingMcqsPreserved:2250,
   results:checked
  },null,2)+'\n');
  console.log('V225 PASS: original NBF Topic8.1 formulas and numeric Example/Assignment, 1280/390/320 Chromium, planned source lesson and 0 scored Unit8 MCQs.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(e=>{console.error('V225 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
