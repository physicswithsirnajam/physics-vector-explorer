#!/usr/bin/env node
'use strict';
/* V96-B compact Learning Hub: verify REAL shipped markup/module and live browser
 * selection, filtering, search, all-resources opt-in, unit preview, responsiveness.
 * No Firebase credentials, student data, or production write operations involved.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('portal/index.html'),hub=read('portal/learning-hub.js'),styles=read('portal/styles.css');
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const grade=catalog.grades.find(g=>g.grade===11),unit6=grade.units.find(u=>u.unit===6);
const manifest=JSON.parse(read('question-bank/manifest.json'));
const src=manifest.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
const release=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const expectedTopics=[61,62,63,64,65,66,67];
function staticChecks(){
 assert.ok(/<select id="hub-unit-filter"/.test(html),'Unit chooser missing');
 assert.equal((html.match(/id="hub-unit-filter"/g)||[]).length,1,'Unit chooser must be unique');
 assert.ok(html.includes('id="hub-selection-status"'));
 assert.ok(html.includes('id="hub-browse-all"'));
 assert.ok(html.includes('class="hub-optional-guide"'));
 assert.ok(html.includes('id="hub-unit6-topic-shortcuts"'));
 assert.ok(html.includes('class="hub-topic-link-grid"'));
 assert.ok(html.includes('href="./unit-06-figure-study-v90.html"'));
 assert.ok(html.includes('href="./unit-06-figure-verification-v91.html"'));
 assert.equal((html.match(/href="\.\/unit-06-learning-desk-v95a\.html"/g)||[]).length,2);
 for(const n of expectedTopics){
  assert.equal((html.match(new RegExp('href="./unit-06-topic-'+n+'-preview.html"','g'))||[]).length,1,'Missing or duplicate individual topic '+n);
 }
 assert.ok(hub.includes("list.dataset.view=selectedUnit==='all'?'overview':'focused'"));
 assert.ok(hub.includes("if(selectedUnit!=='all'&&String(u.unit)!==selectedUnit)continue"));
 assert.ok(hub.includes("if(selectedUnit==='all'&&!showAllResources&&filter==='all'&&!term)"));
 assert.ok(hub.includes('unit6Topics.hidden='));
 assert.ok(styles.includes('.hub-unit-chooser'));
 assert.ok(styles.includes('@media(max-width:700px)'));
 assert.equal(catalog.resources.length,59);
 assert.equal(grade.units.filter(u=>u.status==='available').length,5);
 assert.equal(grade.units.filter(u=>u.practicePreviewStatus==='public-provisional').length,1);
 assert.equal(unit6.status,'planned');
 assert.equal(unit6.questionBankCount,0);
 assert.deepEqual(unit6.resourceIds,[]);
 assert.equal(unit6.previewResources.length,3);
 assert.equal(unit6.partialTestBuilderMcqCount,560);
 assert.equal(unit6.assessmentStatus,'not-published');
 assert.equal(src.liveMcqCount,560);
 assert.equal(src.perQuestionSloVerified,false);
 assert.equal(src.exactFbiseModeReady,false);
 assert.equal(release.releaseApproved,false);
 assert.equal(release.teacherSignoff,'pending');
 const queue=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
 assert.equal(queue.length,561);
 console.log('V96-B static PASS: 7 original topic links, 59+3 resources, separate preview, 560 MCQs, academic release closed.');
}
const from=html.indexOf('<section class="learning-hub"');
const close=html.indexOf('</section>',from);
assert.ok(from>0&&close>from,'Cannot extract source Learning Hub markup');
const markup=html.slice(from,close+'</section>'.length);
const fixture='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/portal/styles.css"></head><body>'+markup+
 '<script type="module">import {initLearningHub} from "/portal/learning-hub.js"; initLearningHub();</script></body></html>';
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
const server=http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/portal/__v96b_test__.html'){
   res.writeHead(200,{'Content-Type':MIME['.html'],'Cache-Control':'no-store'});res.end(fixture);return;
  }
  const loc=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!loc.startsWith(root+path.sep)||!fs.existsSync(loc)||!fs.statSync(loc).isFile())throw Error('Missing');
  res.writeHead(200,{'Content-Type':MIME[path.extname(loc)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(loc).pipe(res);
 }catch{res.writeHead(404);res.end('Not found')}
});
async function browserChecks(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1240,height:860}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/portal/__v96b_test__.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('hub-linked-units')?.textContent==='6');
  assert.equal(await page.locator('#hub-unit-filter option').count(),7,'All plus six units');
  assert.equal(await page.locator('#hub-units article').count(),6);
  assert.equal(await page.locator('#hub-resources .hub-resource').count(),0,'Do not eagerly list 62 links');
  assert.equal(await page.locator('#hub-unit6-topic-shortcuts').getAttribute('open'),null,'Advanced links collapsed initially');
  assert.equal(await page.locator('.hub-optional-guide').getAttribute('open'),null,'Learning path collapsed initially');
  await page.locator('#hub-unit-filter').selectOption('6');
  assert.equal(await page.locator('#hub-units article').count(),1);
  assert.equal(await page.locator('#hub-resources .hub-resource').count(),3);
  assert.equal(await page.locator('#hub-unit6-topic-shortcuts').isHidden(),false);
  assert.match(await page.locator('#hub-selection-status').textContent(),/Unit 6.*provisional practice/i);
  const unit6Hrefs=await page.locator('#hub-resources .hub-resource').evaluateAll(as=>as.map(a=>a.getAttribute('href')));
  assert.ok(unit6Hrefs.some(x=>x.includes('unit-06-learning-desk-v95a.html')));
  assert.ok(unit6Hrefs.some(x=>x.includes('build-your-physics-test.html?unit=6')));
  assert.ok(unit6Hrefs.some(x=>x.includes('simulations.html?unit=6')));
  await page.locator('#hub-unit6-topic-shortcuts summary').first().click();
  assert.equal(await page.locator('.hub-topic-link-grid a').count(),7);
  await page.locator('#hub-unit-filter').selectOption('2');
  assert.equal(await page.locator('#hub-units article').count(),1);
  assert.equal(await page.locator('#hub-resources .hub-resource').count(),8);
  assert.equal(await page.locator('#hub-unit6-topic-shortcuts').isHidden(),true,'Unit6 extras hidden for other unit');
  await page.locator('#hub-unit-filter').selectOption('all');
  assert.equal(await page.locator('#hub-units article').count(),6);
  assert.equal(await page.locator('#hub-resources .hub-resource').count(),0);
  await page.locator('#hub-browse-all').click();
  assert.equal(await page.locator('#hub-resources .hub-resource').count(),62);
  assert.equal(await page.locator('#hub-browse-all').getAttribute('aria-expanded'),'true');
  await page.locator('#hub-browse-all').click();
  assert.equal(await page.locator('#hub-resources .hub-resource').count(),0);
  await page.locator('#hub-resource-search').fill('Fluid Mechanics');
  assert.ok(await page.locator('#hub-resources .hub-resource').count()>=1,'Cross-unit search works even with all list collapsed');
  await page.locator('#hub-resource-search').fill('');
  await page.setViewportSize({width:390,height:844});
  const rect=await page.evaluate(()=>({vw:document.documentElement.clientWidth,sw:document.documentElement.scrollWidth}));
  assert.ok(rect.sw<=rect.vw+2,'390px mobile horizontal overflow '+JSON.stringify(rect));
  assert.deepEqual(errors,[],'No browser JavaScript exceptions');
  console.log('V96-B browser PASS: 6 compact units; Unit6 3 links, Unit2 8 links; 7 topic shortcuts; all 62 resources opt-in; search and mobile 390px.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
}
async function main(){staticChecks();await browserChecks()}
main().catch(e=>{console.error('V96-B FAIL',e);server.close();process.exitCode=1});
