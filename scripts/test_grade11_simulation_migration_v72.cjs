#!/usr/bin/env node
'use strict';
/* V72: full REPOSITORY simulation inventory, not a certified Google Sites audit.
 * 31 existing original simulation pages + 9 existing advanced lesson labs.
 * No real login, student data, new lesson content or Google Sites scraping.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/portal-v72');
fs.mkdirSync(out,{recursive:true});
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml',
 '.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 try{
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end('Missing');return;}
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.statSync(file).isFile()){res.writeHead(404);res.end('Missing');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
const totals={1:0,2:2,3:4,4:4,5:1,6:5,7:2,8:4,9:7,10:2};
const extended={1:0,2:1,3:2,4:5,5:1,6:0,7:0,8:0,9:0,10:0};
function audit(){
 const base=JSON.parse(read('portal/simulation-catalog.json'));
 const labs=JSON.parse(read('portal/learning-labs-v72.json'));
 const course=JSON.parse(read('portal/learning-catalog.json'));
 const grade=course.grades.find(g=>g.grade===11);
 const main=JSON.parse(read('question-bank/manifest.json')).grades.find(g=>g.grade===11).units;
 assert.equal(base.simulations.length,31);
 assert.equal(labs.labs.length,9);
 assert.equal(base.legacyVideoInventoryStatus,'not-inspected-google-sites-unavailable');
 assert.equal(base.simulations.filter(s=>s.additional).length,1);
 const filenames=new Set();
 for(const s of base.simulations){
  assert.ok(/^[a-z0-9-]+\.html$/.test(s.file),'unsafe original lab path');
  assert.ok(!filenames.has(s.file),'duplicated original sim filename '+s.file);
  filenames.add(s.file);assert.ok(fs.existsSync(path.join(root,s.file)),'missing original simulation file '+s.file);
  assert.equal(s.unitMappingBasis,'topic-match-provisional');
 }
 for(const l of labs.labs){
  assert.match(l.file,/^unit-0[2-5]-[a-z0-9-]+-lab\.html$/);
  assert.ok(!filenames.has(l.file),'lab improperly mixed into original 31 list');
  filenames.add(l.file);assert.ok(fs.existsSync(path.join(root,'portal',l.file)),'missing specialized lab '+l.file);
  assert.equal(l.source,'existing-published-portal-lab');
 }
 for(let n=1;n<=10;n++){
  assert.ok(base.unitLabels[n], 'missing NBF unit label '+n);
  assert.equal(base.simulations.filter(s=>s.unit===n).length,totals[n],'original count mismatch unit '+n);
  assert.equal(labs.labs.filter(l=>l.unit===n).length,extended[n],'advanced count mismatch unit '+n);
  const c=grade.units.find(u=>u.unit===n);
  assert.equal(c.simulationCount,totals[n],'catalog original count unit '+n);
  assert.equal(c.simulationHref,'./simulations.html?unit='+n);
  if(n>=6){assert.equal(c.status,'planned','do not release bank with simulations-only '+n);
   assert.deepEqual(c.resourceIds,[],'do not invent published lessons/notes unit '+n);}
 }
 assert.equal(grade.units.filter(u=>u.status==='available').length,5);
 assert.deepEqual(main.slice(0,5).map(u=>u.liveMcqCount),[275,206,220,640,349]);
  assert.equal(main[5]?.liveMcqCount,79);
 assert.equal(main.slice(0,5).reduce((a,u)=>a+u.liveMcqCount,0),1690);
  assert.equal(main.reduce((a,u)=>a+u.liveMcqCount,0),1769);
 const s=read('portal/simulations.html'),hub=read('portal/learning-hub.js');
 assert.ok(s.includes('id="specialized-labs"')&&s.includes('id="unit"'));
 assert.ok(s.includes('learning-labs-v72.json'));
 assert.ok(hub.includes('u.simulationHref')&&hub.includes('u.simulationCount'));
 assert.ok(!s.includes('youtube.com/embed'),'no invented third-party videos may be inserted');
 assert.ok(!s.includes('paid-only'),'no unverified paywall claim');
 console.log('PASS V72 repository inventory: 31 original + 9 enhanced pages exist, unit counts verified, Units6–10 remain unpublished, MCQs unchanged, legacy Google Sites videos expressly unresolved');
}
async function main(){
 audit();
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1320,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  const wait=async()=>page.waitForFunction(()=>document.querySelectorAll('#cards .card').length+document.querySelectorAll('#specialized-labs .card').length===40);
  await page.goto(base+'portal/simulations.html',{waitUntil:'networkidle'});
  await wait();
  assert.equal(await page.locator('#cards .card').count(),31);
  assert.equal(await page.locator('#specialized-labs .card').count(),9);
  assert.match(await page.locator('#results').textContent(),/31 of 31 simulations shown/);
  assert.match(await page.locator('#lab-results').textContent(),/9 of 9/);
  await page.screenshot({path:path.join(out,'all-original-plus-enhanced-desktop.png'),fullPage:false});
  for(const [n,first,second] of [[2,2,1],[3,4,2],[4,4,5],[5,1,1],[6,5,0],[7,2,0],[8,4,0],[9,7,0],[10,2,0],[1,0,0]]){
   await page.locator('#unit').selectOption(String(n));
   assert.equal(await page.locator('#cards .card').count(),first,'original sim filter unit '+n);
   assert.equal(await page.locator('#specialized-labs .card').count(),second,'enhanced lab filter unit '+n);
   assert.equal(new URL(page.url()).searchParams.get('unit'),String(n),'unit URL bookmark '+n);
  }
  assert.match(await page.locator('#results').textContent(),/No original simulation is currently mapped to Unit 1/);
  await page.locator('#unit').selectOption('6');
  await page.screenshot({path:path.join(out,'unit06-existing-fluid-models.png'),fullPage:false});
  let unit6=await page.locator('#cards .card h2').allTextContents();
  assert.ok(unit6.some(x=>x.includes('Archimedes')));
  assert.ok(unit6.some(x=>x.includes('Bernoulli')));
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('unit')?.value==='6');
  assert.equal(await page.locator('#cards .card').count(),5);
  await page.locator('#unit').selectOption('4');
  await page.screenshot({path:path.join(out,'unit04-enhanced-labs.png'),fullPage:false});
  for(const link of await page.locator('#cards .card a, #specialized-labs .card a').all()){
   const href=await link.getAttribute('href');
   assert.ok(href.startsWith(base),'non-local activity link in curated library: '+href);
   assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
  }
  await page.setViewportSize({width:390,height:844});
  const dims=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(dims[1]<=dims[0]+2,'mobile horizontal overflow in unified gallery');
  assert.ok(await page.locator('#unit').isVisible());
  await page.screenshot({path:path.join(out,'unit04-mobile.png'),fullPage:false});
  await page.locator('#unit').selectOption('additional');
  assert.equal(await page.locator('#cards .card').count(),1,'additional enrichment filter');
  assert.equal(await page.locator('#specialized-labs .card').count(),0);
  assert.deepEqual(errors,[],'browser errors in directory');
  console.log('PASS V72 Chromium: 40 existing linked activities; all unit1–10 counts, deep links, supplemental filter, desktop+390px mobile, no errors');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(e=>{console.error('FAIL V72 simulation and migration QA',e);server.close();process.exitCode=1;});
