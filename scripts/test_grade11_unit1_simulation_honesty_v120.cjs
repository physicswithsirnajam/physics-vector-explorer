#!/usr/bin/env node
'use strict';
/* V120: Exam Quick Access truthfulness for Grade XI Unit 1 simulations.
 * Only a source-verified note and a link to the general 31-model library.
 * No new Unit 1 model, no original MCQ or academic/exam certification edits.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/grade11-v120-unit1-simulation-honesty');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),data=p=>JSON.parse(read(p));
let checks=0;const pass=s=>{checks++;console.log('V120 PASS:',s)};
const dig=s=>crypto.createHash('sha256').update(s).digest('hex');
const protectedFiles=[
 'question-bank/grade-11/unit-06-topic-65-v84-80-source.json',
 'question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json',
 'question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json',
 'question-bank/grade-11/unit-06-topic65-v116-approved-stagnation-practice-overlay.json',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'portal/learning-catalog.json','portal/simulation-catalog.json','portal/learning-labs-v72.json',
 'portal/simulations.html','shared/navigation.js','shared/sitewide-science-print-v112.js',
 'portal/attempt-sync.js','portal/recaptcha-enterprise-v100m.mjs',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const before=Object.fromEntries(protectedFiles.map(p=>[p,dig(read(p))]));
function staticCheck(){
 const original=data('portal/simulation-catalog.json'),labs=data('portal/learning-labs-v72.json');
 assert.equal(original.simulations.length,31,'Original model count changed; revise availability truthfully');
 assert.ok(original.simulations.every(m=>m.unit!==1),'Cannot claim no original Unit1 models after catalog changed');
 assert.ok(Array.isArray(labs.labs));
 assert.ok(labs.labs.every(l=>l.unit!==1),'Cannot claim no Unit1 enhanced labs after catalog changed');
 const c=data('portal/learning-catalog.json');
 const unit1=c.grades.find(g=>g.grade===11).units.find(u=>u.unit===1);
 assert.equal(unit1.simulationCount,0);
 assert.equal(unit1.simulationHref,'./simulations.html?unit=1');
 assert.equal(unit1.questionBankCount,275);
 const h=read('portal/exam-quick-access.html');
 const a=h.indexOf('<details class="unit" data-unit="1"');
 const b=h.indexOf('</details>',a);
 assert.ok(a>=0&&b>a);
 const first=h.slice(a,b);
 const section=first.match(/<section class="resource-group" data-kind="labs">([\s\S]*?)<\/section>/);
 assert.ok(section,'Missing Unit1 simulation category');
 assert.match(section[1],/No Unit 1-specific simulation or enhanced learning lab is currently mapped/);
 assert.match(section[1],/This is not a missing or broken activity/);
 assert.match(section[1],/class="availability-note"/);
 assert.equal((section[1].match(/<a href=/g)||[]).length,1);
 assert.match(section[1],/<a href="\.\/simulations\.html">Explore the general simulation library \(other units\)/);
 assert.ok(!section[1].includes('simulations.html?unit=1'),'No link should direct a learner to a known-empty Unit1 filter');
 assert.ok(read('portal/simulations.html').includes("No original simulation is currently mapped to Unit 1"));
 assert.ok(read('portal/simulations.html').includes('id="results" role="status"'));
 assert.ok(read('portal/exam-quick-access.html').includes('sitewide-science-print-v112')||
  read('shared/navigation.js').includes('sitewide-science-print-v112'));
 pass('catalog-backed zero Unit1 models/labs; accessible honest in-page note and one working general-library link');
 const groups=[...h.matchAll(/<section class="resource-group" data-kind="([^"]+)">([\s\S]*?)<\/section>/g)];
 const hrefs=groups.flatMap(x=>[...x[2].matchAll(/<a href="([^"]+)">/g)].map(m=>m[1]));
 assert.equal(hrefs.length,43);
 assert.ok(hrefs.includes('./simulations.html'));
 assert.ok(hrefs.includes('./unit-06-balanced-mcq-v95c1.html'));
 assert.ok(hrefs.includes('./unit-06-learning-desk-v95a.html#choose-topic'));
 assert.ok(hrefs.includes('../build-your-physics-test.html?unit=1'));
 for(const href of hrefs){
  const u=new URL(href,'https://physicswithsirnajam.github.io/physics-vector-explorer/portal/exam-quick-access.html');
  assert.equal(u.origin,'https://physicswithsirnajam.github.io');
  assert.ok(u.pathname.startsWith('/physics-vector-explorer/'));
  let file=path.join(root,u.pathname.slice('/physics-vector-explorer/'.length));
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  assert.ok(fs.existsSync(file),'Broken local link: '+href);
 }
 pass('all existing 43 study links resolve; V119 balanced/topic and Units1–6 study routes stay available');
 const pin=data('server/review-manifests/grade11-approved-public-review-refs-v99i.json');
 assert.equal(pin.questionRefs.length,2250);
 assert.equal(pin.bankVersions['6'],'v116-topic64-v111-and-topic65-five-clarified-560-provisional');
 const source=data('question-bank/grade-11/unit-06-topic-65-v84-80-source.json');
 assert.equal(source.questions.length,80);
 for(const [p,v,n] of [
  ['question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json','V111',4],
  ['question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json','V114',3],
  ['question-bank/grade-11/unit-06-topic65-v116-approved-stagnation-practice-overlay.json','V116',2]
 ]){const x=data(p);assert.equal(x.version,v);assert.equal(x.overlayQuestionCount,n)}
 const release=data('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(release.releaseApproved,false);
 assert.equal(c.grades.find(g=>g.grade===11).units.find(u=>u.unit===6).status,'planned');
 assert.equal(c.grades.find(g=>g.grade===11).units.find(u=>u.unit===6).assessmentStatus,'not-published');
 assert.ok(h.includes('not an official examination syllabus'));
 assert.ok(h.includes('Unit 1 or Unit 2 practice results'));
 assert.ok(!/initializeApp|firebaseConfig|sendReport|FIREBASE_APPCHECK_DEBUG_TOKEN/.test(h));
 pass('560 provisional Unit6 source, 2250 GradeXI metadata IDs, V111/V114/V116, and official nonrelease locks unchanged');
 const report=read('quality/grade11-v120-unit1-simulation-honest-exam-shortcut.md');
 for(const word of ['PR #219','PR #220','December 7','Unit 1','31','zero','43','public','provisional']){
  assert.ok(report.includes(word),'Missing source-audit conclusion '+word);
 }
 const after=Object.fromEntries(protectedFiles.map(p=>[p,dig(read(p))]));
 assert.deepEqual(after,before);
 pass('source metadata, original banks, Firebase policies, login status and V112 PDF-watermark implementation untouched');
}
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
 '.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 try{
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
  if(!file.startsWith(root+path.sep))throw Error('Disallowed local path');
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return}
  res.writeHead(200,{'Content-Type':MIME[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(404);res.end()}
});
async function browserCheck(){
 const {chromium}=require('playwright');
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const base='http://127.0.0.1:'+server.address().port;
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:840},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   try{
    await page.goto(base+'/portal/exam-quick-access.html?unit=1&kind=labs',{waitUntil:'load'});
    assert.equal(await page.locator('#unit-filter').inputValue(),'1');
    assert.equal(await page.locator('#kind-filter').inputValue(),'labs');
    assert.equal(await page.locator('.unit:visible').count(),1);
    const section=page.locator('.unit[data-unit="1"] .resource-group[data-kind="labs"]');
    assert.equal(await section.isVisible(),true);
    assert.equal(await section.locator('a').count(),1);
    const note=section.locator('.availability-note');
    assert.equal(await note.isVisible(),true);
    assert.match(await note.innerText(),/No Unit 1-specific simulation or enhanced learning lab/);
    const link=section.locator('a');
    assert.equal(await link.getAttribute('href'),'./simulations.html');
    assert.match(await link.innerText(),/other units/);
    assert.match(await page.locator('#filter-status').innerText(),/1 available links across 1 selected unit/);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,
      'Mobile horizontal scroll at '+width);
    if(width===390){
     await link.click();
     await page.waitForURL('**/portal/simulations.html',{timeout:15000});
     await page.waitForFunction(()=>document.getElementById('results')?.textContent.includes('31 simulations shown'),null,{timeout:15000});
     assert.equal(await page.locator('#unit').inputValue(),'');
     assert.ok((await page.locator('#results').innerText()).includes('31 of 31 simulations shown'));
     assert.ok((await page.locator('#unit option[value="1"]').innerText()).includes('(0 activities)'));
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
     assert.ok(await page.locator('nav a[href="./unit-01.html"]').isVisible());
    }
    assert.deepEqual(errors,[],'Real browser errors at '+width);
    fs.mkdirSync(out,{recursive:true});
    await page.screenshot({path:path.join(out,'unit1-zero-models-'+width+'.png'),fullPage:true});
   }finally{await page.close()}
  }
  pass('Chromium 1280/390/320 honest Unit1 empty-resource note, live 31-model general library and no mobile overflow');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
}
(async()=>{
 staticCheck();
 await browserCheck();
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({version:'V120',checks,
  originalUnit1Simulations:0,unit1EnhancedLabs:0,generalLibraryOriginalModels:31,
  originalExamLinks:43,currentExamLinks:43,noNewQuestionOrExamRelease:true,studentDataCollected:false},null,2)+'\n');
 console.log('V120 COMPLETE:',checks,'source and browser groups passed');
})().catch(err=>{console.error('V120 FAILED:',err?.stack||err);process.exitCode=1;try{server.close()}catch{}});
