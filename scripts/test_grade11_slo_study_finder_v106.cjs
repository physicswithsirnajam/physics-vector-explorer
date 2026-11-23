#!/usr/bin/env node
'use strict';
/** V106: verify only existing static study anchors and truthful source/classification.
 * Browser smoke tests use synthetic public pages only. No Firebase/auth data,
 * server-side mutations, student tracking, MCQ/answer changes or third-party assets.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/slo-study-finder-v106');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('portal/verified-slo-study-index-v106.json'));
const pageSrc=read('portal/slo-study-finder.html'),quick=read('portal/exam-quick-access.html');
let groups=0;
const pass=t=>{groups++;console.log('V106 PASS:',t)};
function sourceAudit(){
 assert.equal(data.schemaVersion,1);assert.equal(data.grade,11);assert.equal(data.entries.length,48);
 assert.deepEqual(data.units,[8,5,7,13,5,10]);
 assert.deepEqual(['derivation','formulas','slo-notes'].map(k=>data.entries.filter(e=>e.kind===k).length),[7,22,19]);
 assert.equal(new Set(data.entries.map(e=>e.id)).size,48,'Duplicate shortcut identity');
 assert.ok(/not a.*certification/.test(data.status)||data.status.includes('not-academic-certification'));
 pass('48 known source links across Units 1–6: 7 derivation, 22 formula, 19 SLO notes; no duplicate identities');
 for(const e of data.entries){
  assert.ok(Number.isInteger(e.unit)&&e.unit>=1&&e.unit<=6);
  assert.ok(['derivation','formulas','slo-notes'].includes(e.kind));
  assert.ok(e.title?.length>=12&&e.slo?.length>=8&&e.assessmentStatus?.length>=12&&e.sourceNote?.length>=15,'Missing provenance '+e.id);
  assert.match(e.href,/^\.\/[a-z0-9-]+\.html#[a-z0-9-]+$/i,'Unsafe/missing internal anchor '+e.id);
  const [p,anchor]=e.href.slice(2).split('#'),src=read('portal/'+p);
  assert.match(src,new RegExp('\\bid=["\\x27]'+anchor+'["\\x27]'),'Missing exact source anchor for '+e.id+': '+e.href);
  assert.ok(!e.href.startsWith('http'),'Only local existing pages');
 }
 pass('every entry target exists at the exact original public HTML id; no placeholder or external download destination');
 const formative=data.entries.filter(e=>e.slo==='P-11-B-03');
 assert.equal(formative.length,1);
 assert.equal(formative[0].kind,'derivation');
 assert.ok(formative[0].assessmentStatus.startsWith('Formative'),'Motion derivation wrongly marked summative');
 assert.ok(data.entries.find(e=>e.slo==='P-11-A-01').assessmentStatus.startsWith('Formative'));
 assert.ok(data.entries.find(e=>e.slo==='P-11-B-11').assessmentStatus.startsWith('Formative'));
 const u6=data.entries.filter(e=>e.unit===6);
 assert.equal(u6.length,10);
 assert.ok(u6.every(e=>e.assessmentStatus.includes('Provisional')));
 assert.ok(u6.some(e=>e.slo.includes('P-11-B-39')&&e.slo.includes('formative')));
 assert.ok(data.notice.includes('school'));
 pass('formative motion, estimating and momentum outcomes stay formative; Unit 6 previews and Bernoulli B-39 context labelled honestly');
 assert.ok(quick.includes('href="./slo-study-finder.html"'));
 assert.ok(quick.includes('href="./textbook-resource-finder.html"'));
 assert.ok(quick.includes('href="./descriptive-answer-finder.html"'));
 assert.ok(pageSrc.includes('verified-slo-study-index-v106.json'));
 assert.ok(pageSrc.includes('aria-live="polite"'));
 assert.ok(pageSrc.includes('official-logo.png'));
 assert.ok(pageSrc.includes('shared/navigation.js'));
 for(const bad of ['firebaseConfig','initializeAppCheck','localStorage','sessionStorage','indexedDB','sendReport','sendBeacon','FIREBASE_APPCHECK_DEBUG_TOKEN'])assert.ok(!pageSrc.includes(bad),'Unauthorized backend/data addition '+bad);
 pass('Exam Quick Access preserves previous answer/numerical finders; new page carries branding, accessible controls and no user-data writes');
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{
 try{
  const u=new URL(req.url,'http://localhost');let file=path.resolve(root,'.'+decodeURIComponent(u.pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end('Not Found');return}
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not Found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(404);res.end('Not Found')}
});
async function browserAudit(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const url='http://127.0.0.1:'+server.address().port+'/portal/';
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:850}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   try{
    const r=await page.goto(url+'slo-study-finder.html?unit=6&kind=derivation',{waitUntil:'load'});
    assert.equal(r.status(),200);
    await page.waitForFunction(()=>document.getElementById('status').textContent.includes('3 source-checked'));
    assert.equal(await page.locator('#unit').inputValue(),'6');
    assert.equal(await page.locator('#kind').inputValue(),'derivation');
    assert.equal(await page.locator('.item').count(),3);
    assert.equal(await page.locator('.unit h2').count(),1);
    assert.ok(await page.locator('.item a[href*="unit-06-topic-65-study-v95b5.html#derive"]').count());
    assert.ok((await page.locator('.item').first().innerText()).includes('Provisional'));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'Horizontal overflow '+width);
    assert.deepEqual(errors,[],'Page errors at width '+width);
    await page.screenshot({path:path.join(out,'unit6-provisional-derivations-'+width+'.png'),fullPage:true});
   }finally{await page.close()}
  }
  pass('real Chromium desktop 1280px and mobile 390/320px show three provisional Unit 6 derivations without overflow or errors');
  const page=await browser.newPage({viewport:{width:390,height:820}});
  try{
   await page.goto(url+'slo-study-finder.html',{waitUntil:'load'});
   await page.waitForFunction(()=>document.querySelectorAll('.item').length===48);
   await page.locator('#kind').selectOption('formulas');
   assert.equal(await page.locator('.item').count(),22);
   await page.locator('#unit').selectOption('2');
   assert.equal(await page.locator('.item').count(),4);
   await page.locator('#kind').selectOption('derivation');
   assert.equal(await page.locator('.item').count(),0);
   assert.ok(await page.locator('.empty').isVisible());
   await page.locator('#unit').selectOption('3');
   assert.equal(await page.locator('.item').count(),1);
   assert.ok((await page.locator('.item').first().innerText()).includes('Formative'));
   await page.locator('#kind').selectOption('slo-notes');
   await page.locator('#query').fill('P-11-B-11');
   assert.equal(await page.locator('.item').count(),1);
   assert.ok((await page.locator('.item').innerText()).includes('Formative'));
   await page.locator('#query').fill('');
   await page.locator('#unit').selectOption('5');
   await page.locator('#kind').selectOption('derivation');
   assert.equal(await page.locator('.item').count(),1);
   assert.ok((await page.locator('.item').first().innerText()).includes('kinetic-energy'));
   pass('48 records load; Unit 2 formula sections, honest missing derivation state, formative Unit 3 and kinetic-energy Unit 5 search pass');
  }finally{await page.close()}
  const tests=[
   {query:'unit=1&kind=derivation',fragment:'derivation',target:'unit-01-study-guide.html',text:/derive|dimensions/i},
   {query:'unit=3&kind=derivation',fragment:'equations',target:'unit-03-study-guide.html',text:/Uniform acceleration/i},
   {query:'unit=5&kind=derivation',fragment:'kinetic',target:'unit-05-work-study.html',text:/Deriving kinetic energy/i},
   {query:'unit=6&kind=derivation',fragment:'derive',target:'unit-06-topic-65-study-v95b5.html',text:/DERIVATION|pressure work|work.energy/i},
  ];
  for(const t of tests){
   const page=await browser.newPage({viewport:{width:1180,height:900}});
   try{
    await page.goto(url+'slo-study-finder.html?'+t.query,{waitUntil:'load'});
    await page.waitForFunction(()=>document.querySelectorAll('.item').length>0);
    const a=page.locator('.item a[href$="#'+t.fragment+'"]').first();assert.ok(await a.count());
    await a.click();
    await page.waitForURL('**/'+t.target+'#'+t.fragment);
    const target=page.locator('[id="'+t.fragment+'"]').first();await target.waitFor();
    assert.match(await target.innerText(),t.text,'Source page content mismatch '+t.target+'#'+t.fragment);
    assert.ok((await page.title()).length>5);
   }finally{await page.close()}
  }
  pass('actual clicks land on correct Unit 1, 3, 5 derivations and Unit 6 provisional Bernoulli derivation');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
}
async function main(){
 fs.mkdirSync(out,{recursive:true});
 sourceAudit();
 await browserAudit();
 fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({version:'V106',groupsPassed:groups,links:48,units:data.units,derivations:7,formulaGroups:22,sloNotes:19,formativeSourcesPreserved:true,unit6Provisional:true,sourceAnswersChanged:false,mcqBanksChanged:false,firestoreWrites:false,appCheckEnforced:false,reportingEnabled:false},null,2)+'\n');
 console.log('V106 COMPLETE:',groups,'source and live-browser evidence groups passed; no academic or Firebase writes.');
}
main().catch(e=>{console.error('V106 FAILED:',e?.stack||String(e));process.exitCode=1;try{server.close()}catch{}});
