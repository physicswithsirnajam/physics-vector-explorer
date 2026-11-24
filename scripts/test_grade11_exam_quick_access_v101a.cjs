#!/usr/bin/env node
'use strict';
/** V101-A: public exam revision navigation QA, no Firebase auth/data or real user credentials. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'portal/exam-quick-access.html'),'utf8');
const nav=fs.readFileSync(path.join(root,'shared/navigation.js'),'utf8');
const out=path.join(root,'qa-artifacts','grade11-exam-quick-access-v101a');
const base=new URL('https://physicswithsirnajam.github.io/physics-vector-explorer/portal/exam-quick-access.html');
const sourceDoc=JSON.parse(fs.readFileSync(path.join(root,'portal/learning-catalog.json'),'utf8'));
const units=sourceDoc.grades.find(g=>g.grade===11).units;
let checks=0;
function pass(name){checks++;console.log('V101-A PASS:',name)}
function local(link){const u=new URL(link,base);assert.equal(u.origin,base.origin);assert.ok(u.pathname.startsWith('/physics-vector-explorer/'),'Link escaped project path '+link);return u.pathname.slice('/physics-vector-explorer/'.length)}
function audit(){
 const categories=['study','numericals','answers','mcq','labs','original'];
 assert.equal((html.match(/<details class="unit"/g)||[]).length,6);
 for(let n=1;n<=6;n++){assert.ok(html.includes('data-unit="'+n+'"'));assert.ok(units.some(u=>u.unit===n));}
 assert.ok(html.includes('Seven-topic provisional preview'));
 assert.ok(html.includes('not an official examination syllabus'));
 assert.ok(html.includes('exact textbook end-of-unit and derivation indexes are still being prepared'));
 pass('all six source-grounded unit cards and honest provisional/unfinished notices');
 for(const kind of categories)assert.ok(html.includes('data-kind="'+kind+'"'));
 assert.ok(html.includes('id="unit-filter"')&&html.includes('id="kind-filter"'));
 assert.ok(html.includes('aria-live="polite"')&&html.includes('aria-label="Filter Grade XI examination resources"'));
 pass('unit and study-type dropdowns are labelled and announce filtered results');
 const groups=[...html.matchAll(/<section class="resource-group" data-kind="([^"]+)">([\s\S]*?)<\/section>/g)];
 const resourceLinks=groups.flatMap(g=>[...g[2].matchAll(/<a href="([^"]+)">([^<]+)</g)].map(m=>({category:g[1],href:m[1],label:m[2]})));
 assert.equal(resourceLinks.length,47,'Source-grounded revision link inventory unexpectedly changed');
 for(const link of resourceLinks){
  const target=local(link.href).split('?')[0];
  let file=path.resolve(root,target);
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  assert.ok(file.startsWith(root+path.sep),'Link path escaping root');
  assert.ok(fs.existsSync(file),'Missing existing resource: '+link.href);
  assert.ok(!/^https?:\/\/(?!physicswithsirnajam\.github\.io)/i.test(link.href));
 }
 assert.ok(resourceLinks.some(x=>x.href==='./unit-03-numericals.html'));
 assert.ok(resourceLinks.some(x=>x.href==='./unit-05-descriptive-student.html'));
 for(const target of ['./unit-05-mcq-practice.html','./unit-05-mcq-set-b.html','./unit-05-mcq-key.html','./unit-05-mcq-set-b-key.html'])
  assert.ok(resourceLinks.some(x=>x.href===target&&x.category==='mcq'),'Missing source-backed Unit 5 MCQ revision shortcut '+target);
 assert.ok(resourceLinks.some(x=>x.href==='./unit-06-learning-desk-v95a.html'));
 assert.ok(resourceLinks.some(x=>x.href==='../build-your-physics-test.html?unit=6'));
 assert.ok(resourceLinks.some(x=>x.href==='./unit-06-balanced-mcq-v95c1.html'&&x.category==='mcq'));
 assert.ok(resourceLinks.some(x=>x.href==='./unit-06-learning-desk-v95a.html#choose-topic'&&x.category==='mcq'));
 assert.ok(fs.readFileSync(path.join(root,'portal/unit-06-learning-desk-v95a.html'),'utf8').includes('id="choose-topic"'),
  'Existing topic chooser anchor must not be invented');
 assert.ok(fs.readFileSync(path.join(root,'portal/unit-06-balanced-mcq-v95c1.html'),'utf8').includes('Seven-Topic Balanced MCQ Practice'),
  'Balanced destination must remain honest provisional self-practice');
 pass('all 47 existing public learning links resolve locally, including Unit 3 numericals and both focused Unit 6 revision routes');
 assert.ok(nav.includes("link('portal/exam-quick-access.html','Exam Quick Access','revision')"));
 assert.ok(nav.includes('permitNavigation(event)')||nav.includes('permitNavigation'));
 assert.ok(html.includes('shared/navigation.js?v=68')&&html.includes('shared/navigation.css?v=58'));
 assert.ok(html.includes('physics-with-sir-najam-official-logo.png'));
 pass('shared navigation links revision hub; existing unfinished-quiz protection and original logo preserved');
 assert.ok(!/initializeApp|firebaseConfig|serviceAccount|sendReport|appCheckDebug|FIREBASE_APPCHECK_DEBUG_TOKEN/.test(html));
 assert.ok(!/localStorage|sessionStorage|indexedDB|navigator\.clipboard|fetch\(|XMLHttpRequest|sendBeacon|postMessage/.test(html));
 assert.ok(!/<form\b/i.test(html),'No personal student data form in public revision index');
 assert.ok(html.includes('Unit 1 or Unit 2 practice results')&&html.includes('scores remain local/printable'));
 pass('static public revision hub introduces no Firebase, tracking, reporting or saved-result promises');
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  let file=path.resolve(root,'.'+p);
  if(!file.startsWith(root+path.sep))throw Error('Outside project');
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404);res.end();return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(404);res.end()}
});
async function browserAudit(){
 const {chromium}=require('playwright');
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const url='http://127.0.0.1:'+server.address().port+'/portal/exam-quick-access.html?unit=3&kind=numericals';
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:900}});
   const errors=[];page.on('pageerror',err=>errors.push(err.message));
   const response=await page.goto(url,{waitUntil:'load'});assert.equal(response.status(),200);
   assert.equal(await page.locator('#unit-filter').inputValue(),'3');
   assert.equal(await page.locator('#kind-filter').inputValue(),'numericals');
   assert.equal(await page.locator('.unit:visible').count(),1);
   const focused=page.locator('.unit[data-unit="3"]');
   assert.equal(await focused.locator('.resource-group:visible').count(),1);
   assert.ok((await focused.innerText()).includes('Textbook Numericals 3.1–3.8'));
   assert.ok((await page.locator('#filter-status').innerText()).includes('1 available links'));
   assert.ok(await page.locator('.brand img').isVisible());
   assert.ok(await page.locator('#psn-global-nav .psn-nav-menu-button').isVisible());
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
   assert.equal(overflow,false,'Document overflow at width '+width);
   assert.deepEqual(errors,[],'Page errors at '+width);
   fs.mkdirSync(out,{recursive:true});
   await page.screenshot({path:path.join(out,'unit3-numericals-'+width+'.png'),fullPage:true});
   if(width===390){
    await page.locator('#unit-filter').selectOption('6');
    assert.ok((await page.locator('.unit[data-unit="6"] .empty').innerText()).includes('No separately verified page'));
    assert.equal(await page.locator('.unit[data-unit="6"] .empty').isVisible(),true);
    await page.locator('#kind-filter').selectOption('mcq');
    assert.ok(await page.locator('.unit[data-unit="6"] a[href="../build-your-physics-test.html?unit=6"]').isVisible());
    const link=await page.locator('.unit[data-unit="6"] a[href="../build-your-physics-test.html?unit=6"]').getAttribute('href');
    assert.equal(link,'../build-your-physics-test.html?unit=6');
    const unit6MCQ=page.locator('.unit[data-unit="6"] .resource-group[data-kind="mcq"]');
    assert.equal(await unit6MCQ.locator('a').count(),3);
    assert.ok(await unit6MCQ.locator('a[href="./unit-06-balanced-mcq-v95c1.html"]').isVisible());
    assert.ok(await unit6MCQ.locator('a[href="./unit-06-learning-desk-v95a.html#choose-topic"]').isVisible());
    assert.ok((await page.locator('#filter-status').innerText()).includes('3 available links'));
    await page.screenshot({path:path.join(out,'unit6-provisional-mcq-phone.png'),fullPage:true});
   }
   await page.close();
  }
  pass('Chromium confirms desktop, phone and narrow-phone filters, Unit 3 textbook numerical link and honest missing Unit 6 state');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
}
async function main(){
 audit();
 await browserAudit();
 console.log('V101-A COMPLETE:',checks,'groups passed; independent academic answer-key signoff not claimed; all data remains unmodified.');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({version:'V101-A',checks,units:6,resourceLinks:47,approvedSource:'existing portal catalogue/public pages',firebaseWrites:false,firestoreRulesModified:false,appCheckEnforcementModified:false,studentReportSendEnabled:false,academicCertification:false},null,2)+'\n');
}
main().catch(e=>{console.error('V101-A FAILED:',e?.stack||String(e));process.exitCode=1;try{server.close()}catch{}});
