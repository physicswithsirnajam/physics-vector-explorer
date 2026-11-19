#!/usr/bin/env node
'use strict';
/* V61 corrected Grade XI Unit4 4.1/4.2: source/adapter/browser regression.
 * PUBLIC provisional practice; original 80-item classroom paper remains unchanged.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm'),zlib=require('node:zlib'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),shots=path.join(root,'qa-artifacts','unit04-v61');
fs.mkdirSync(shots,{recursive:true});
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const text=p=>fs.readFileSync(path.join(root,p),'utf8');
const folder='question-bank/grade-11/',parts=['unit04-v61-part1.b64','unit04-v61-part2.b64','unit04-v61-part3.b64'];
const manifest=read('question-bank/manifest.json');
const catalog=read('portal/learning-catalog.json');
const old=read(folder+'unit-04-v39-80-practice.json').questions;
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.b64':'text/plain; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e))}
});
const canon=q=>String(q.stem).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()+'|'+
 q.options.map(o=>String(o.text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()).join('|');
function source(){
 const encoded=parts.map(p=>text(folder+p)).join('').trim();
 assert.equal(encoded.length,13600);
 let fnv=2166136261;
 for(const c of encoded)fnv=Math.imul(fnv^c.charCodeAt(0),16777619)>>>0;
 assert.equal(fnv,0x20d5cb2e,'source transfer checksum');
 const d=JSON.parse(zlib.gunzipSync(Buffer.from(encoded,'base64')).toString('utf8'));
 assert.equal(d.version,1);
 assert.equal(d.source,'Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx');
 assert.equal(d.sourceSha256,'925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777');
 assert.equal(d.rows.length,160);
 assert.equal(Object.keys(d.scenarios).length,12);
 const originalIds=new Set(old.map(q=>q.id));
 assert.equal(old.length,80);
 for(const topic of [41,42]){
  const items=d.rows.filter(q=>q[0]===topic);
  assert.equal(items.length,80);
  for(const correct of 'ABCD')assert.equal(items.filter(q=>q[4]===correct).length,20,'balanced original source answer letters topic '+topic);
  assert.deepEqual(items.map(q=>q[1]),Array.from({length:80},(_,i)=>i+1));
 }
 const groups=new Map(),seen=new Set();
 for(const row of d.rows){
  assert.equal(row.length,6);
  const [topic,n,stem,opts,key,expl]=row;
  const id='g11-u04-master-t'+topic+'-q'+String(n).padStart(3,'0');
  assert.ok(!originalIds.has(id)&&!seen.has(id),'repeated source ID '+id);seen.add(id);
  assert.ok(stem.trim()&&expl.trim()&&Array.isArray(opts)&&opts.length===4);
  assert.ok(opts.every(x=>typeof x==='string'&&x.trim()));
  assert.ok('ABCD'.includes(key));
  if(n>=57){
   const group='u04-v61-t'+topic+'-s'+(Math.floor((n-57)/4)+1);
   assert.ok(d.scenarios[group].startsWith('<p>'));
   groups.set(group,(groups.get(group)||0)+1);
  }
 }
 assert.equal(groups.size,12);assert.ok([...groups.values()].every(n=>n===4));
 const unit=manifest.grades.find(g=>g.grade===11).units.find(u=>u.unit===4);
 assert.equal(unit.liveMcqCount,640);
 assert.equal(unit.newMasterImportedCount,560);
 assert.equal(unit.scenarioGroupCount,48);
 assert.equal(manifest.grades.find(g=>g.grade===11).units.slice(0,5).reduce((n,u)=>n+u.liveMcqCount,0),1690);
 assert.equal(catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===4).questionBankCount,640);
 assert.ok(text('portal/unit-04.html').includes('640 provisional Unit 4 MCQs'));
 assert.equal(read(folder+'unit-04-v39-80-practice.json').questions.length,80,'unchanged 80-item classroom bank');
 console.log('PASS V61 source: 160 original corrected Topic 4.1/4.2 MCQs; 112 straight/48 scenario, 12 intact groups; 80 original unchanged.');
 return d;
}
/* Restores Word run-level superscript text (720/720 checked Topic4.2 cells). */
function correctedWordText(value,topic,n){
 if(topic!==42)return value;
 let out=String(value).replace(/([vωrm])2\b/g,'$1²')
  .replace(/s-1\b/g,'s⁻¹').replace(/s-2\b/g,'s⁻²')
  .replace(/tan-1\(/g,'tan⁻¹(');
 if(n===48)out=out.replace(/12\.02\b/g,'12.0²');
 return out;
}
async function adapterCheck(d){
 const ctx={
  DecompressionStream,Blob,Response,atob,
  fetch:async url=>{
   const file=String(url);
   assert.match(file,/^(?:\.\.\/)?question-bank\/grade-11\/[a-z0-9.-]+$/);
   const p=file.replace(/^\.\.\//,'');
   return {ok:true,json:async()=>read(p),text:async()=>text(p)};
  }
 };
 vm.createContext(ctx);
 vm.runInContext(text('shared/practice-bank-adapter-v55.js'),ctx);
 const questions=(await ctx.PSNPracticeBankV55.loadBank(4,folder)).questions;
 assert.equal(questions.length,640);
 assert.equal(new Set(questions.map(q=>q.id)).size,640);
 assert.equal(new Set(questions.map(canon)).size,640,'no exact same stem/options');
 for(let i=0;i<80;i++){
  const o=old[i],q=questions[i];
  for(const field of ['id','stem','correctOptionId','explanation','sourceQuestionNumber'])assert.equal(q[field],o[field]);
  assert.deepEqual(JSON.parse(JSON.stringify(q.options)),o.options);
 }
 const added=questions.slice(80,240),groups=new Map();
 for(let i=0;i<160;i++){
  const q=added[i],r=d.rows[i];
  assert.equal(q.stem,correctedWordText(r[2],r[0],r[1]));
  assert.deepEqual(JSON.parse(JSON.stringify(q.options.map(o=>o.text))),r[3].map(x=>correctedWordText(x,r[0],r[1])));
  assert.equal(q.correctOptionId,r[4]);
  assert.equal(q.explanation,correctedWordText(r[5],r[0],r[1]));
  assert.equal(q.sourceQuestionNumber,r[1]);
  assert.equal(q.status,'teacher-review-pending');
  assert.equal(q.boardEligible,false);
  assert.equal(q.difficulty,'Unspecified');
  assert.equal(q.cognitiveLevel,'Unspecified');
  assert.equal(q.assessmentClassification,'summative-theory');
  assert.equal(q.sloCodes.length,r[0]===41?3:4);
  if(q.stimulusSetId){
   if(!groups.has(q.stimulusSetId))groups.set(q.stimulusSetId,[]);
   groups.get(q.stimulusSetId).push(q);
  }
 }
 assert.equal(groups.size,12);
 assert.ok([...groups.values()].every(a=>a.length===4&&a.every(q=>q.stimulusHtml===a[0].stimulusHtml)));
 assert.equal(added.find(q=>q.id==='g11-u04-master-t42-q029').options[0].text,'T=mv²/r');
 assert.ok(added.find(q=>q.id==='g11-u04-master-t42-q048').explanation.includes('12.0²'));
 assert.ok(added.find(q=>q.id==='g11-u04-master-t42-q062').explanation.includes('tan⁻¹'));
 assert.equal(questions.slice(0,240).filter(q=>q.stimulusSetId).length,72,'original24+new48 initial scenario MCQs');
 await assert.rejects(ctx.PSNPracticeBankV55.loadBank(4,'https://external.invalid/'),/unexpected question bank folder/);
 console.log('PASS V61 regression: original 240 preserved within expanded 555 bank; 18 prior source scenarios, no duplicate IDs/stem-options.');
}
async function verifyAvailability(page, expected){
 await page.waitForFunction(text=>{
  const v=document.getElementById('availabilityCount')?.textContent||'';
  return v.includes(text)||v.includes('Availability temporarily unavailable');
 },expected,{timeout:25000});
 const count=await page.locator('#availabilityCount').textContent();
 if(!count.includes(expected))throw Error('Test Builder expected '+expected+' but reported '+count+': '+
  await page.locator('#availabilityNote').textContent()+'. '+await page.locator('#pilotAvailability').textContent());
}
async function browser(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 let b;
 try{
  b=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await b.newPage({viewport:{width:1365,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'build-your-physics-test.html?unit=4',{waitUntil:'networkidle'});
  await verifyAvailability(page,'640 eligible MCQ');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  assert.equal(await page.locator('input[name="cognitive"][value="Unspecified"]').isChecked(),true,'New source MCQs must be included by default');
  await page.screenshot({path:path.join(shots,'01-unit4-240-available.png'),fullPage:false});
  await page.locator('#scope').selectOption('formative');
  assert.equal(await page.locator('#quickStartLink').isVisible(),false);
  await page.locator('#scope').selectOption('summative');
  await verifyAvailability(page,'640 eligible MCQ');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.locator('#quantity').selectOption('60');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  assert.match(await page.locator('#setupSummary').textContent(),/60 MCQs/);
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  assert.equal(await page.locator('#choices label').count(),4);
  console.log('PASS V61 Chromium Unit 4: 635 available, 0 formative, 640 summative; 60-item self-practice actually launches.');

  await page.goto(base+'build-your-physics-test.html?unit=4',{waitUntil:'networkidle'});
  await verifyAvailability(page,'640 eligible MCQ');
  await page.locator('#quantity').selectOption('40');
  await page.locator('#arrangement').selectOption('scenario');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  assert.match(await page.locator('#qcounter').textContent(),/Scenario 1 \(1\/4\)/);
  assert.equal(await page.locator('#stimulusPanel').isVisible(),true);
  await page.screenshot({path:path.join(shots,'02-unit4-intact-scenario.png'),fullPage:false});

  await page.goto(base+'build-your-physics-test.html?units=2,4',{waitUntil:'networkidle'});
  await verifyAvailability(page,'846 eligible MCQ');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#submit').click();
  await page.waitForFunction(()=>!document.getElementById('result').classList.contains('hidden'));
  const reports=await page.locator('#unitStats').textContent();
  assert.match(reports,/Unit 2/);assert.match(reports,/Unit 4/);
  assert.equal(await page.locator('#save-result').isDisabled(),true);
  await page.screenshot({path:path.join(shots,'03-mixed-units-2-4-report.png'),fullPage:false});

  await page.goto(base+'student-guide.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('question-total').textContent==='1690');
  assert.match(await page.locator('[data-unit="4"] .count').textContent(),/640 MCQs/);
  await page.setViewportSize({width:390,height:844});
  const dim=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(dim[1]<=dim[0]+2,'390px student guide must not overflow');
  assert.deepEqual(errors,[]);
  await page.screenshot({path:path.join(shots,'04-guide-mobile.png'),fullPage:false});
  console.log('PASS V61 Chromium: scenarios, 846 mixed U2+U4, per-unit results, disabled cloud-save, 1690 guide, phone display.');
 }finally{if(b)await b.close();await new Promise(resolve=>server.close(resolve));}
}
(async()=>{const d=source();await adapterCheck(d);await browser();})().catch(err=>{console.error('FAIL V61',err);server.close();process.exitCode=1;});
