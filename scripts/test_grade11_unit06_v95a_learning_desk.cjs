#!/usr/bin/env node
'use strict';
/*
 * V95-A Unit6 integrated learning scaffold.
 * Static gate runs without browser deps. Run --browser for mobile/desktop Playwright.
 * Never grants access, writes grades or upgrades complete-course academic status.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('portal/unit-06-learning-desk-v95a.html'),css=read('portal/unit-06-desk-v95a.css');
const js=read('portal/unit-06-desk-v95a.js'),dashboard=read('portal/index.html');
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const manifest=JSON.parse(read('question-bank/manifest.json'));
const sims=JSON.parse(read('portal/simulation-catalog.json')).simulations.filter(s=>s.unit===6);
const unit=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
const bank=manifest.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
const originalSimFiles=sims.map(s=>s.file).sort();
assert.deepEqual(originalSimFiles,[
 'archimedes-flotation.html','bernoulli-venturi.html','continuity-fluid-flow.html',
 'superfluidity-explorer.html','viscosity-terminal-velocity.html'].sort());
assert.equal(unit.status,'planned','V95-A must not mark full Unit 6 as available');
assert.equal(unit.questionBankCount,0,'V95-A cannot certify a full-unit question bank');
assert.equal(unit.assessmentStatus,'not-published');
assert.equal(unit.simulationCount,5);
assert.equal(unit.partialTestBuilderMcqCount,560);
assert.equal(bank.liveMcqCount,560);assert.equal(bank.sourceFigureHeldCount,0);
assert.equal(bank.standaloneSituationQuestionCount,136);
assert.equal(bank.independentSharedStimulusGroupCount,0);
assert.equal(bank.perQuestionSloVerified,false);
assert.equal(bank.exactFbiseModeReady,false);
assert.equal(manifest.grades.find(g=>g.grade===11).units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.match(html,/<h1>Fluid Mechanics/);
assert.match(html,/not yet the completed Unit 6 course/i);
assert.match(html,/P-11-B-39 is formative/i);
assert.match(html,/136 real-life situation questions are independent/i);
assert.match(html,/No textbook scans/i);
assert.ok(!html.includes('Figure6.17.svg'),'Do not include original NBF phase-diagram artwork');
assert.match(dashboard,/href="\.\/unit-06-learning-desk-v95a\.html"/);
assert.equal((dashboard.match(/href="\.\/unit-06-learning-desk-v95a\.html"/g)||[]).length,2,'Public and signed-in hub both need a discoverable link');
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')),'Reserved full Unit 6 route cannot be published by V95-A');
assert.match(css,/@media\(max-width:490px\)/);
assert.match(css,/@media print/);
assert.match(css,/prefers-reduced-motion/);
assert.match(js,/addEventListener\('hashchange',sync\)/);
const allHrefs=[...html.matchAll(/\bhref="([^"]+)"/g)].map(m=>m[1]);
assert.ok(allHrefs.every(h=>!h.startsWith('javascript:')));
const topics=['61','62','63','64','65','66','67'];
assert.equal((html.match(/class="topic" id="topic-/g)||[]).length,7);
assert.equal((html.match(/class="stage" role="listitem"/g)||[]).length,28,'Seven 4-stage panels expected');
assert.equal((html.match(/<details>/g)||[]).length,7,'One independent revealable revision check per topic');
for(const n of topics){
 assert.ok(html.includes('id="topic-'+n+'"'),'Missing topic '+n);
 assert.ok(html.includes('id="read-'+n+'"'),'Missing Read '+n);
 assert.ok(html.includes('id="simulate-'+n+'"'),'Missing Simulate '+n);
 assert.ok(html.includes('id="practice-'+n+'"'),'Missing Practice '+n);
 assert.ok(html.includes('id="revise-'+n+'"'),'Missing Revise '+n);
 assert.ok(html.includes('href="./unit-06-topic-'+n+'-preview.html"'),'Missing original 80 MCQ preview '+n);
 assert.ok(fs.existsSync(path.join(root,'portal/unit-06-topic-'+n+'-preview.html')),'Topic preview absent '+n);
}
for(const simulation of originalSimFiles){
 assert.ok(html.includes('href="../'+simulation+'"'),'Mapped original sim unused: '+simulation);
 assert.ok(fs.existsSync(path.join(root,simulation)),'Linked simulation does not exist: '+simulation);
}
for(const href of allHrefs){
 if(href.startsWith('#'))continue;
 if(!href.startsWith('./')&&!href.startsWith('../'))continue;
 const file=href.split('#')[0].split('?')[0];
 if(!file)continue;
 assert.ok(fs.existsSync(path.resolve(root,'portal',file)),'Broken local Unit6 desk resource: '+href);
}
assert.equal((html.match(/class="stage-action"/g)||[]).length>=14,true);
console.log('V95-A STATIC PASS: 7 topics, 28 stages, 7 revealable revisions, 7/7 live 80-MCQ practice links, 5 mapped live sims, two portal links, source/board/privacy and 560/2250 gates.');

async function browser(){
 const {chromium}=require('playwright');
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.css':'text/css; charset=utf-8','.png':'image/png'};
 const srv=http.createServer((req,res)=>{
  let relative;
  try{relative=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\/+/,'' );}catch{res.writeHead(400);res.end();return;}
  const target=path.resolve(root,relative||'index.html');
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(target).pipe(res);
 });
 await new Promise(ok=>srv.listen(0,'127.0.0.1',ok));
 let browserInstance;
 try{
  browserInstance=await chromium.launch({headless:true});
  const host='http://127.0.0.1:'+srv.address().port;
  for(const width of [390,768,1440]){
   const page=await browserInstance.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(host+'/portal/unit-06-learning-desk-v95a.html',{waitUntil:'load'});
   assert.equal(response.status(),200);
   await page.locator('#topic-61').waitFor({state:'visible'});
   assert.equal(await page.locator('.topic').count(),7);
   assert.equal(await page.locator('.stage').count(),28);
   const size=await page.evaluate(()=>({available:document.documentElement.clientWidth,full:document.documentElement.scrollWidth}));
   if(size.full>size.available+2){
    const culprits=await page.evaluate(()=>[...document.querySelectorAll('body *')]
      .filter(el=>el.getClientRects().length && getComputedStyle(el).visibility!=='hidden')
      .map(el=>({tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,75):'',id:el.id,
        text:(el.textContent||'').trim().slice(0,35),right:Math.round(el.getBoundingClientRect().right),
        width:Math.round(el.getBoundingClientRect().width)}))
      .filter(el=>el.right>document.documentElement.clientWidth+2)
      .sort((a,b)=>b.right-a.right).slice(0,18));
    assert.fail('Horizontal overflow at width='+width+': '+JSON.stringify(size)+' offenders='+JSON.stringify(culprits));
   }
   await page.selectOption('#topic-select','topic-64');
   await page.waitForFunction(()=>location.hash==='#topic-64');
   assert.equal(await page.locator('[data-topic-nav="topic-64"]').getAttribute('aria-current'),'location');
   const reveal=page.locator('#revise-64 details');
   assert.equal(await reveal.evaluate(el=>el.open),false);
   await reveal.locator('summary').click();
   assert.equal(await reveal.evaluate(el=>el.open),true);
   assert.equal(await reveal.locator('p').isVisible(),true);
   const localLinks=await page.locator('.stage-action').evaluateAll(els=>els.map(a=>a.getAttribute('href')));
   assert.equal(localLinks.filter(x=>x&&x.includes('unit-06-topic-')).length,7);
   assert.deepEqual(errors,[],'Browser script errors width '+width);
   await page.close();
  }
  console.log('V95-A BROWSER PASS: 390px, 768px, 1440px; no horizontal overflow, native revision disclosure works, seven topic navigation and 80-MCQ links functional.');
 } finally {
  if(browserInstance)await browserInstance.close();
  await new Promise(ok=>srv.close(ok));
 }
}
if(process.argv.includes('--browser'))browser().catch(err=>{console.error(err);process.exitCode=1;});
