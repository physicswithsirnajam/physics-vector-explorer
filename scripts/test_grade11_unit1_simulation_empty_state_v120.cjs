#!/usr/bin/env node
'use strict';
// V120: verify honest zero-Unit1 simulation state, no changed academic assets.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v120-unit1-simulation-availability');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const unchanged=[
 'portal/simulation-catalog.json','portal/learning-labs-v72.json',
 'portal/learning-catalog.json','question-bank/grade-11/unit-06-topic-65-v84-80-source.json',
 'question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json',
 'question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json',
 'question-bank/grade-11/unit-06-topic65-v116-approved-stagnation-practice-overlay.json',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json','shared/sitewide-science-print-v112.js'
];
const fingerprints=Object.fromEntries(unchanged.map(p=>[p,sha(read(p))]));
let passed=0;
const pass=s=>{passed++;console.log('V120 PASS:',s)};
function staticAudit(){
 const simulations=json('portal/simulation-catalog.json').simulations;
 const labs=json('portal/learning-labs-v72.json').labs;
 const units=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units;
 assert.equal(simulations.length,31);
 assert.equal(labs.length,9);
 assert.equal(simulations.filter(s=>s.unit===1).length,0);
 assert.equal(labs.filter(s=>s.unit===1).length,0);
 assert.equal(simulations.filter(s=>s.unit===6).length,5);
 assert.equal(units[0].simulationCount,0);
 assert.equal(units[0].simulationHref,'./simulations.html?unit=1');
 assert.deepEqual(units.slice(0,6).map(u=>u.unit===6?u.partialTestBuilderMcqCount:u.questionBankCount),[275,206,220,640,349,560]);
 assert.equal(json('server/review-manifests/grade11-approved-public-review-refs-v99i.json').questionRefs.length,2250);
 assert.equal(units[5].status,'planned');
 assert.equal(units[5].assessmentStatus,'not-published');
 assert.equal(json('quality/grade11-unit06-v94d-signoff-matrix.json').releaseApproved,false);
 const html=read('portal/simulations.html');
 assert.ok(html.includes('id="unit1-next-steps"'));
 assert.ok(html.includes('No original interactive simulation or enhanced learning lab is currently mapped to Unit 1'));
 assert.ok(html.includes('href="./unit-01.html"'));
 assert.ok(html.includes('href="./simulations.html"'));
 assert.ok(html.includes("unit1NextSteps.hidden=!(u==='1'&&!filtered.length&&!matchingLabs.length)"));
 assert.ok(html.includes("No original simulation is currently mapped to Unit 1"));
 const quick=read('portal/exam-quick-access.html');
 assert.ok(quick.includes('<a href="./simulations.html?unit=1">Unit 1 simulation availability — no models mapped; see study alternatives'));
 assert.ok(!quick.includes('Browse Unit 1 simulations'));
 assert.ok(quick.includes('not an official examination syllabus'));
 assert.equal((quick.match(/<section class="resource-group" data-kind="labs">/g)||[]).length,6);
 const records=[
 ['V111','question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json',4],
 ['V114','question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json',3],
 ['V116','question-bank/grade-11/unit-06-topic65-v116-approved-stagnation-practice-overlay.json',2]];
 for(const [version,file,count] of records){
  const data=json(file);assert.equal(data.version,version);assert.equal(data.overlayQuestionCount,count);
 }
 const notes=read('quality/grade11-v120-unit1-zero-simulation-student-navigation.md');
 for(const phrase of ['December 7','PR #219','Unit 1','31','9','560','V111','V114','V116','PENDING','public GitHub Pages']){
  assert.ok(notes.toLowerCase().includes(phrase.toLowerCase()),'Missing truthful audit context '+phrase);
 }
 pass('unchanged 31 original / 9 enhanced models, zero Unit1 models, five Unit6 models, 560/2250 provisional inventory and academic holds');
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  let full=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(url.pathname.endsWith('/'))full=path.join(full,'index.html');
  if(!full.startsWith(root+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(full)]||'application/octet-stream'});
  fs.createReadStream(full).pipe(res);
 }catch{res.writeHead(404);res.end('Not found')}
});
async function browserAudit(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 const origin='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:840},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   try{
    const response=await page.goto(origin+'/portal/simulations.html?unit=1',{waitUntil:'networkidle'});
    assert.equal(response.status(),200);
    await page.waitForFunction(()=>document.querySelector('#unit')?.value==='1' &&
      document.querySelector('#results')?.textContent.includes('No original simulation'),null,{timeout:15000});
    assert.equal(await page.locator('#cards .card').count(),0);
    assert.equal(await page.locator('#specialized-labs .card').count(),0);
    const empty=page.locator('#unit1-next-steps');
    assert.equal(await empty.isVisible(),true);
    assert.match(await empty.innerText(),/No original interactive simulation or enhanced learning lab is currently mapped to Unit 1/);
    assert.equal(await empty.locator('a[href="./unit-01.html"]').isVisible(),true);
    assert.equal(await empty.locator('a[href="./simulations.html"]').isVisible(),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'Empty-state horizontal overflow');
    await page.screenshot({path:path.join(out,'unit1-zero-simulations-'+width+'.png'),fullPage:true});
    await page.locator('#unit').selectOption('6');
    assert.equal(await page.locator('#cards .card').count(),5);
    assert.equal(await empty.isHidden(),true);
    await page.locator('#unit').selectOption('');
    assert.equal(await page.locator('#cards .card').count(),31);
    assert.equal(await page.locator('#specialized-labs .card').count(),9);
    assert.equal(await empty.isHidden(),true);
    await page.goto(origin+'/portal/exam-quick-access.html?unit=1&kind=labs',{waitUntil:'load'});
    await page.waitForFunction(()=>document.querySelector('#unit-filter')?.value==='1' &&
      document.querySelector('#kind-filter')?.value==='labs');
    const section=page.locator('.unit[data-unit="1"] .resource-group[data-kind="labs"]');
    assert.equal(await section.isVisible(),true);
    assert.match(await section.innerText(),/no models mapped/i);
    await section.locator('a[href="./simulations.html?unit=1"]').click();
    await page.waitForURL(url=>url.pathname==='/portal/simulations.html'&&url.searchParams.get('unit')==='1');
    await page.waitForFunction(()=>document.getElementById('unit1-next-steps')?.hidden===false);
    if(width===390){
     await page.locator('#unit1-next-steps a[href="./unit-01.html"]').click();
     await page.waitForURL(url=>url.pathname==='/portal/unit-01.html');
     assert.equal(await page.locator('h1').count()>0,true);
     pass('390px end-to-end revision link → honest empty simulations → real Unit1 Learning Desk');
    }
    assert.deepEqual(errors,[],'Browser JS error at '+width);
   }finally{await page.close()}
  }
  pass('Chromium 1280/390/320px Unit1 honest empty state, zero horizontal overflow, Unit6 five, All 31+9');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 staticAudit();await browserAudit();
 assert.deepEqual(Object.fromEntries(unchanged.map(p=>[p,sha(read(p))])),fingerprints);
 fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({
  version:'V120',testGroups:passed,unit1OriginalSimulations:0,unit1EnhancedLabs:0,
  originalModels:31,enhancedLabs:9,unit6Models:5,unit6ProvisionalMCQs:560,
  grade11PublicReferences:2250,formalExamCertificationGranted:false,
  sourceQuestionBankModified:false,studentAccountOrFirebaseModified:false
 },null,2)+'\n');
 console.log('V120 COMPLETE:',passed,'read-only academic and real-browser audit groups');
})().catch(e=>{console.error('V120 FAILED:',e?.stack||e);process.exitCode=1;try{server.close()}catch{}});
