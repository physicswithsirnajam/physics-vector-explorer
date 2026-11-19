/* V65 — Grade XI Unit4 corrected Topic 4.7 source, adapter and live-browser checks.
 * Source hashes/answer keys prove transfer fidelity, NOT independent physics approval. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const zlib=require('node:zlib');
const http=require('node:http');
const vm=require('node:vm');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const folder='question-bank/grade-11/';
const qa=path.join(root,'qa-artifacts/unit04-v65');
fs.mkdirSync(qa,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const canonical=q=>String(q.stem).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()+'|'+
  q.options.map(o=>String(o.text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()).join('|');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.b64':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return;}
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(err){res.writeHead(500);res.end(String(err));}
});
function checkSource(){
 const encoded=read(folder+'unit04-v65-topic47.b64').trim();
 assert.equal(encoded.length,7544,'V65 source archive length');
 let hash=2166136261;
 for(const c of encoded)hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
 assert.equal(hash,0x47cc9caf,'V65 source transfer checksum');
 const src=JSON.parse(zlib.gunzipSync(Buffer.from(encoded,'base64')).toString('utf8'));
 assert.equal(src.source,'Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx');
 assert.equal(src.sourceSha256,'925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777');
 assert.equal(src.formatMethod,'original Word run-level superscript/subscript restored before source compression');
 assert.deepEqual(src.topics,['4.7']);
 assert.equal(src.rows.length,80);
 assert.equal(Object.keys(src.scenarios).length,6);
 const letters={A:0,B:0,C:0,D:0};
 for(let i=0;i<80;i++){
  const r=src.rows[i];
  assert.equal(r.length,6);
  assert.equal(r[0],47);assert.equal(r[1],i+1);
  assert.ok(r[2]&&Array.isArray(r[3])&&r[3].length===4&&r[3].every(Boolean)&&r[5]);
  assert.ok('ABCD'.includes(r[4]));letters[r[4]]++;
  if(i>=56){
   const id='u04-v61-t47-s'+(1+Math.floor((i-56)/4));
   assert.ok(src.scenarios[id]?.startsWith('<p>'),'missing complete original scenario '+id);
  }
 }
 assert.deepEqual(letters,{A:20,B:20,C:20,D:20});
 assert.ok(src.rows.some(r=>r[3].some(x=>x.includes('v²/R'))),'Original scenario wording lost');
 assert.ok(Object.values(src.scenarios).some(s=>s.includes('1.5 km')),'Word superscript lost');
 const m=json('question-bank/manifest.json'),g=m.grades.find(x=>x.grade===11);
 const u=g.units.find(x=>x.unit===4);
 assert.equal(u.liveMcqCount,640);assert.equal(u.scenarioGroupCount,48);
 assert.equal(u.newMasterImportedCount,560);assert.equal(u.masterTopicsImported['4.7'],80);
 assert.equal(g.units.slice(0,5).reduce((n,x)=>n+x.liveMcqCount,0),1690);
 assert.equal(json('portal/learning-catalog.json').grades.find(x=>x.grade===11).units.find(x=>x.unit===4).questionBankCount,640);
 console.log('PASS V65 source: original corrected Topic4.7 80 keys/options/steps, 56 straight + six intact four-question scenarios, Word math, expected metadata');
 return src;
}
async function checkAdapter(src){
 const ctx={DecompressionStream,Blob,Response,atob,
  fetch:async u=>{
   const filename=String(u).replace(/^\.\.\//,'');
   assert.match(filename,/^question-bank\/grade-11\/[a-z0-9.-]+$/);
   return {ok:true,json:async()=>json(filename),text:async()=>read(filename)};
  }
 };
 vm.createContext(ctx);vm.runInContext(read('shared/practice-bank-adapter-v55.js'),ctx);
 const res=await ctx.PSNPracticeBankV55.loadBank(4,folder),qs=res.questions;
 assert.equal(qs.length,640);
 assert.equal(ctx.PSNPracticeBankV55.expected[4],640);
 assert.equal(new Set(qs.map(q=>q.id)).size,640);
 assert.equal(new Set(qs.map(canonical)).size,640);
 const originals=json(folder+'unit-04-v39-80-practice.json').questions;
 for(let i=0;i<80;i++){
  for(const k of ['id','stem','correctOptionId','explanation'])
   assert.equal(qs[i][k],originals[i][k],'original classroom80 altered');
 }
 assert.equal(qs.slice(80,555).length,475,'all earlier V61–V64 topic imports retained');
 const added=qs.slice(555,635),scenes=new Map();
 assert.equal(added.length,80);
 for(let i=0;i<80;i++){
  const q=added[i],r=src.rows[i],id='g11-u04-master-t47-q'+String(i+1).padStart(3,'0');
  assert.equal(q.id,id);assert.equal(q.stem,r[2]);assert.deepEqual(JSON.parse(JSON.stringify(q.options.map(o=>o.text))),r[3]);
  assert.equal(q.correctOptionId,r[4]);assert.equal(q.explanation,r[5]);
  assert.deepEqual(JSON.parse(JSON.stringify(q.sloCodes)),['P-11-B-17']);
  assert.equal(q.status,'teacher-review-pending');assert.equal(q.boardEligible,false);
  assert.equal(q.cognitiveLevel,'Unspecified');assert.equal(q.difficulty,'Unspecified');
  assert.equal(q.assessmentClassification,'summative-theory');
  if(q.stimulusSetId){
   if(!scenes.has(q.stimulusSetId))scenes.set(q.stimulusSetId,[]);
   scenes.get(q.stimulusSetId).push(q);
  }
 }
 assert.equal(scenes.size,6);
 assert.ok([...scenes.values()].every(qs=>qs.length===4&&qs.every(q=>q.stimulusHtml===qs[0].stimulusHtml)));
 const all=new Map();
 for(const q of qs)if(q.stimulusSetId){if(!all.has(q.stimulusSetId))all.set(q.stimulusSetId,[]);all.get(q.stimulusSetId).push(q);}
 assert.equal(all.size,48);
 assert.ok([...all.values()].every(v=>v.length===4&&v.every(q=>q.stimulusHtml===v[0].stimulusHtml)));
 assert.equal(qs.filter(q=>q.stimulusSetId).length,192);
 for(const n of [38,69,70,71,72])
  assert.ok(qs.some(q=>q.id==='g11-u04-master-t43-q'+String(n).padStart(3,'0')));
 console.log('PASS V65 adapter: all 640 unique, original80 + previous475 unchanged, source-key exact new80, 47 full groups, five figure source references completed');
}
async function waitAvailable(page,s){
 await page.waitForFunction(n=>document.getElementById('availabilityCount')?.textContent.includes(n),s,{timeout:30000});
}
async function browserTests(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'build-your-physics-test.html?unit=4',{waitUntil:'networkidle'});
  await waitAvailable(page,'640 eligible MCQ');
  await page.locator('#quantity').selectOption('40');
  await page.locator('#arrangement').selectOption('scenario');
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  assert.equal(await page.locator('#stimulusPanel').isVisible(),true);
  assert.equal(await page.locator('#choices label').count(),4);
  await page.screenshot({path:path.join(qa,'unit4-40-scenario-only.png')});
  await page.goto(base+'build-your-physics-test.html?units=3,4',{waitUntil:'networkidle'});
  await waitAvailable(page,'860 eligible MCQ');
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#submit').click();
  await page.waitForFunction(()=>!document.getElementById('result').classList.contains('hidden'));
  assert.match(await page.locator('#unitStats').textContent(),/Unit 3/);
  assert.match(await page.locator('#unitStats').textContent(),/Unit 4/);
  assert.equal(await page.locator('#save-result').isDisabled(),true);
  await page.screenshot({path:path.join(qa,'unit3-unit4-v65-855-pool.png')});
  await page.goto(base+'student-guide.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('question-total')?.textContent==='1690');
  assert.match(await page.locator('[data-unit="4"] .count').textContent(),/640 MCQs/);
  await page.setViewportSize({width:390,height:844});
  const width=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(width[1]<=width[0]+2,'390px guide horizontal overflow');
  assert.deepEqual(errors,[]);
  await page.screenshot({path:path.join(qa,'five-unit-guide-1690-mobile.png')});
  console.log('PASS V65 browser: Unit4=640, 40 scenario-only, mixed U3+U4=860, per-unit report, no cloud save, 1690 guide, mobile');
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
}
(async()=>{const src=checkSource();await checkAdapter(src);await browserTests()})()
 .catch(err=>{console.error('FAIL V65',err);server.close();process.exitCode=1;});
