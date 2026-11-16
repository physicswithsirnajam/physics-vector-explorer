#!/usr/bin/env node
'use strict';
/* V62 — Grade XI Unit4 corrected Topics4.3/4.4, source and live-browser QA.
 * Provisional PUBLIC learning material. Original classroom80 preserved.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm'),zlib=require('node:zlib');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),shots=path.join(root,'qa-artifacts','unit04-v62');
fs.mkdirSync(shots,{recursive:true});
const text=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(text(p));
const folder='question-bank/grade-11/';
const files=['unit04-v62-part1.b64','unit04-v62-part2.b64','unit04-v62-part3.b64'];
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.b64':'text/plain; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end('Missing');return;}
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.statSync(file).isFile()){res.writeHead(404);res.end('Missing');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e))}
});
function auditSource(){
 const b64=files.map(f=>text(folder+f)).join('').trim();
 assert.equal(b64.length,13684,'truncated corrected original Word source');
 let checksum=2166136261;
 for(const c of b64)checksum=Math.imul(checksum^c.charCodeAt(0),16777619)>>>0;
 assert.equal(checksum,0x55b60683);
 const src=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
 assert.equal(src.source,'Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx');
 assert.equal(src.sourceSha256,'925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777');
 assert.equal(src.formatMethod,'original Word run-level superscript/subscript restored before source compression');
 assert.deepEqual(src.held,{'4.3':[38,69,70,71,72],'4.4':[]});
 assert.equal(src.rows.length,155);
 assert.equal(Object.keys(src.scenarios).length,11);
 assert.equal(src.rows.filter(r=>r[0]===43).length,75);
 assert.equal(src.rows.filter(r=>r[0]===44).length,80);
 assert.equal(src.rows.filter(r=>r[1]>=57).length,44,'11 intact four-question scenario groups');
 const ids=new Set();
 for(const r of src.rows){
  assert.equal(r.length,6);
  const [topic,n,stem,options,key,explanation]=r;
  assert.ok([43,44].includes(topic)&&Number.isInteger(n)&&n>=1&&n<=80);
  assert.ok(!(topic===43&&[38,69,70,71,72].includes(n)));
  assert.ok(typeof stem==='string'&&stem.trim()&&typeof explanation==='string'&&explanation.trim());
  assert.ok(Array.isArray(options)&&options.length===4&&options.every(o=>typeof o==='string'&&o.trim()));
  assert.ok('ABCD'.includes(key));
  const id='t'+topic+'q'+n;assert.ok(!ids.has(id));ids.add(id);
  if(n>=57){
   const group='u04-v61-t'+topic+'-s'+(1+Math.floor((n-57)/4));
   assert.ok(src.scenarios[group]?.startsWith('<p>'));
   assert.ok(!src.scenarios[group].includes('shown in the source figure'));
  }
 }
 assert.ok(!Object.hasOwn(src.scenarios,'u04-v61-t43-s4'));
 assert.equal(json('question-bank/grade-11/unit-04-v39-80-practice.json').questions.length,80);
 const manifest=json('question-bank/manifest.json');
 const u4=manifest.grades.find(g=>g.grade===11).units.find(u=>u.unit===4);
 assert.equal(u4.liveMcqCount,395);assert.equal(u4.scenarioGroupCount,29);
 assert.equal(u4.newMasterImportedCount,315);
 assert.equal(u4.masterTopicsImported['4.3'],75);
 assert.equal(u4.masterTopicsImported['4.4'],80);
 assert.equal(manifest.grades.find(g=>g.grade===11).units.reduce((n,u)=>n+u.liveMcqCount,0),1445);
 assert.equal(json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===4).questionBankCount,395);
 console.log('PASS V62 source: 155 original corrected items, 11 complete scenarios, 5 source-figure holds, exact Word equation typography and original classroom80.');
 return src;
}
function canonical(q){
 return String(q.stem).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()+'|'+
  q.options.map(o=>String(o.text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()).join('|');
}
async function checkAdapter(src){
 const ctx={
  DecompressionStream,Blob,Response,atob,
  fetch:async url=>{
   const name=String(url);
   assert.match(name,/^(?:\.\.\/)?question-bank\/grade-11\/[a-z0-9.-]+$/);
   const f=name.replace(/^\.\.\//,'');
   return {ok:true,json:async()=>json(f),text:async()=>text(f)};
  }
 };
 vm.createContext(ctx);
 vm.runInContext(text('shared/practice-bank-adapter-v55.js'),ctx);
 const bank=await ctx.PSNPracticeBankV55.loadBank(4,folder);
 const rows=bank.questions;
 assert.equal(rows.length,395);
 assert.equal(new Set(rows.map(q=>q.id)).size,395);
 assert.equal(new Set(rows.map(canonical)).size,395);
 const originals=json(folder+'unit-04-v39-80-practice.json').questions;
 for(let i=0;i<80;i++){
  for(const f of ['id','stem','correctOptionId','explanation'])
   assert.equal(rows[i][f],originals[i][f],'original Unit4 classroom question changed '+originals[i].id);
 }
 const more=rows.slice(240);assert.equal(more.length,155);
 const groups=new Map();
 for(let i=0;i<155;i++){
  const r=src.rows[i],q=more[i],id='g11-u04-master-t'+r[0]+'-q'+String(r[1]).padStart(3,'0');
  assert.equal(q.id,id);assert.equal(q.stem,r[2]);
  assert.deepEqual(JSON.parse(JSON.stringify(q.options.map(o=>o.text))),r[3]);
  assert.equal(q.correctOptionId,r[4]);assert.equal(q.explanation,r[5]);
  assert.equal(q.sourceQuestionNumber,r[1]);
  assert.equal(q.status,'teacher-review-pending');assert.equal(q.boardEligible,false);
  assert.equal(q.cognitiveLevel,'Unspecified');assert.equal(q.difficulty,'Unspecified');
  assert.equal(q.assessmentClassification,'summative-theory');
  assert.equal(q.sloCodes.length,r[0]===43?1:2);
  if(q.stimulusSetId){
   if(!groups.has(q.stimulusSetId))groups.set(q.stimulusSetId,[]);
   groups.get(q.stimulusSetId).push(q);
  }
 }
 assert.equal(groups.size,11);
 assert.ok([...groups.values()].every(g=>g.length===4&&g.every(q=>q.stimulusHtml===g[0].stimulusHtml)));
 assert.equal(rows.filter(q=>q.stimulusSetId).length,116,'72 existing scenario MCQs + 44 new');
 for(const n of [38,69,70,71,72])
  assert.ok(!rows.some(q=>q.id==='g11-u04-master-t43-q'+String(n).padStart(3,'0')),'held figure item leaked into student bank');
 assert.ok(more.some(q=>q.stem.includes('kg m²')||q.options.some(o=>o.text.includes('kg m²'))),'source Word superscripts missing');
 assert.ok(more.some(q=>q.options.some(o=>o.text.includes('s⁻¹'))),'source Word inverse second units missing');
 console.log('PASS V62 adapter: 395 unique items, untouched original80 and V61 first160, complete source-key/explanation match and 29 scenarios overall.');
}
async function waitCount(page,count){
 await page.waitForFunction(expected=>{
  const s=document.getElementById('availabilityCount')?.textContent||'';
  return s.includes(expected)||s.includes('Availability temporarily unavailable');
 },count,{timeout:30000});
 const current=await page.locator('#availabilityCount').textContent();
 assert.ok(current.includes(count),'Expected '+count+'; got '+current+'. '+await page.locator('#availabilityNote').textContent());
}
async function testBrowser(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1300,height:850}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'build-your-physics-test.html?unit=4',{waitUntil:'networkidle'});
  await waitCount(page,'395 eligible MCQ');
  assert.equal(await page.locator('input[name="cognitive"][value="Unspecified"]').isChecked(),true);
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.screenshot({path:path.join(shots,'01-unit4-395-available.png')});
  await page.locator('#quantity').selectOption('40');
  await page.locator('#arrangement').selectOption('scenario');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  assert.equal(await page.locator('#choices label').count(),4);
  assert.equal(await page.locator('#stimulusPanel').isVisible(),true);
  await page.screenshot({path:path.join(shots,'02-unit4-source-scenarios.png')});
  await page.goto(base+'build-your-physics-test.html?units=3,4',{waitUntil:'networkidle'});
  await waitCount(page,'615 eligible MCQ');
  assert.equal(await page.locator('input[name="unit"]:checked').count(),2);
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  page.once('dialog',d=>d.accept());
  await page.locator('#submit').click();
  await page.waitForFunction(()=>!document.getElementById('result').classList.contains('hidden'));
  const breakdown=await page.locator('#unitStats').textContent();
  assert.match(breakdown,/Unit 3/);assert.match(breakdown,/Unit 4/);
  assert.equal(await page.locator('#save-result').isDisabled(),true);
  await page.screenshot({path:path.join(shots,'03-mixed-unit3-4-results.png')});
  await page.goto(base+'student-guide.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('question-total').textContent==='1445');
  assert.match(await page.locator('[data-unit="4"] .count').textContent(),/395 MCQs/);
  await page.setViewportSize({width:390,height:844});
  const size=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(size[1]<=size[0]+2,'390px mobile page overflow '+JSON.stringify(size));
  assert.deepEqual(errors,[]);
  await page.screenshot({path:path.join(shots,'04-five-unit-guide-mobile.png')});
  console.log('PASS V62 browser: Unit4 395 available, complete scenario quiz, mixed Unit3+4 = 615, per-unit report, cloud-save restriction, mobile guide 1445.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
(async()=>{const src=auditSource();await checkAdapter(src);await testBrowser()})().catch(err=>{console.error('FAIL V62',err);server.close();process.exitCode=1;});
