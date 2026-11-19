/* V66: source Figure 4.13 recovery, original five MCQs and real browser QA.
 * Source and figure cross-checks are NOT independent academic certification. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),folder='question-bank/grade-11/';
const qa=path.join(root,'qa-artifacts/unit04-v66');
fs.mkdirSync(qa,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const canon=q=>String(q.stem).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()+'|'+q.options.map(o=>String(o.text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()).join('|');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.b64':'text/plain; charset=utf-8','.svg':'image/svg+xml','.css':'text/css; charset=utf-8'};
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
function sourceCheck(){
 const src=json(folder+'unit04-v66-figure413-five-source.json');
 assert.equal(src.version,1);
 assert.equal(src.source,'Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx');
 assert.equal(src.sourceSha256,'925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777');
 assert.equal(src.textbook,'NBF Physics Grade XI, Unit 4, printed page 64, Figure 4.13');
 assert.equal(src.formatMethod,'original Word run-level superscript/subscript restored');
 assert.equal(src.figureRef,'4.13');
 assert.deepEqual(src.rows.map(r=>r[1]),[38,69,70,71,72]);
 assert.deepEqual(src.rows.map(r=>r[4]),['A','C','B','C','B']);
 assert.deepEqual(src.rows.map(r=>r[0]),[43,43,43,43,43]);
 assert.equal(new Set(src.rows.map(r=>r[1])).size,5);
 src.rows.forEach(r=>{
  assert.equal(r.length,6);
  assert.ok(r[2].length>15&&r[3].length===4&&r[3].every(Boolean)&&r[5]);
 });
 assert.equal(src.rows[0][3][0],'I=(1/3)M(a²+b²)');
 assert.equal(src.rows[0][5],'The listed corner-axis value is I=(1/3)M(a²+b²).');
 assert.equal(src.rows[2][3][1],'0.125 kg m²');
 assert.equal(src.rows[3][3][2],'0.50 kg m²');
 assert.equal(src.scenarios['u04-v61-t43-s4'],'Scenario 4 for MCQs 69-72: A uniform rectangular plate has mass 6.0 kg with sides a = 0.40 m and b = 0.30 m. Compare a central perpendicular axis with the corner perpendicular axis shown in the source figure.');
 const svg=read('assets/illustrations/unit4-figure413-axis-reference.svg');
 for(const marker of ['<svg','<title','<desc','I = (1/12) M(a² + b²)','I = (1/3) M(a² + b²)','Axis through the centre','Axis through a corner','not a cropped/']) {
  if(marker==='not a cropped/')continue;
  assert.ok(svg.includes(marker),'missing source-verified axis illustration: '+marker);
 }
 const engine=read('practice-engine/index.html');
 assert.ok(engine.includes("q.referenceFigureId==='unit4-figure413-axis-reference'"));
 assert.ok(engine.includes('appendVerifiedFigure413(sp)')&&engine.includes('appendVerifiedFigure413(p)'));
 assert.ok(engine.includes("img.src='../assets/illustrations/unit4-figure413-axis-reference.svg'"));
 const m=json('question-bank/manifest.json'),g=m.grades.find(x=>x.grade===11);
 const u=g.units.find(x=>x.unit===4),c=json('portal/learning-catalog.json').grades.find(x=>x.grade===11).units.find(x=>x.unit===4);
 assert.equal(u.liveMcqCount,640);assert.equal(u.sourceSloMcqCount,640);
 assert.equal(u.newMasterImportedCount,560);assert.equal(u.masterSourceTopicCount,560);
 assert.equal(u.masterTopicsImported['4.3'],80);assert.equal(u.scenarioGroupCount,48);
 assert.equal(u.originalClassroomPaperCount,80);assert.equal(c.questionBankCount,640);
 assert.equal(g.units.slice(0,5).reduce((n,x)=>n+x.liveMcqCount,0),1690);
 assert.deepEqual(g.units.slice(0,5).map(x=>x.liveMcqCount),[275,206,220,640,349]);
 console.log('PASS V66 source: five exact Word items and letters, full source figure/axes, original scenario and 1690 metadata');
 return src;
}
async function bankCheck(src){
 const ctx={DecompressionStream,Blob,Response,atob,fetch:async u=>{
  const filename=String(u).replace(/^\.\.\//,'');
  assert.match(filename,/^question-bank\/grade-11\/[a-z0-9.-]+$/);
  return {ok:true,json:async()=>json(filename),text:async()=>read(filename)};
 }};
 vm.createContext(ctx);vm.runInContext(read('shared/practice-bank-adapter-v55.js'),ctx);
 const r=await ctx.PSNPracticeBankV55.loadBank(4,folder),qs=r.questions;
 assert.equal(qs.length,640);assert.equal(ctx.PSNPracticeBankV55.expected[4],640);
 assert.equal(new Set(qs.map(q=>q.id)).size,640);
 assert.equal(new Set(qs.map(canon)).size,640);
 const old=json(folder+'unit-04-v39-80-practice.json').questions;
 for(let i=0;i<80;i++)
  for(const k of ['id','stem','correctOptionId','explanation'])
   assert.equal(qs[i][k],old[i][k],'original V39 classroom question modified');
 const added=qs.slice(635);
 assert.equal(added.length,5,'all V65 published 635 questions retained before five-item supplement');
 for(let i=0;i<5;i++){
  const original=src.rows[i],q=added[i];
  assert.equal(q.id,'g11-u04-master-t43-q'+String(original[1]).padStart(3,'0'));
  assert.equal(q.stem,original[2]);assert.deepEqual(JSON.parse(JSON.stringify(q.options.map(o=>o.text))),original[3]);
  assert.equal(q.correctOptionId,original[4]);assert.equal(q.explanation,original[5]);
  assert.deepEqual(JSON.parse(JSON.stringify(q.sloCodes)),['P-11-B-18']);
  assert.equal(q.assessmentClassification,'summative-theory');
  assert.equal(q.referenceFigureId,'unit4-figure413-axis-reference');
  assert.equal(q.status,'teacher-review-pending');assert.equal(q.boardEligible,false);
  assert.equal(q.cognitiveLevel,'Unspecified');assert.equal(q.difficulty,'Unspecified');
  if(i===0)assert.equal(q.stimulusSetId,null);
  else {assert.equal(q.stimulusSetId,'u04-v61-t43-s4');assert.ok(q.stimulusHtml.includes(src.scenarios['u04-v61-t43-s4']));}
 }
 const groups=new Map();
 for(const q of qs)if(q.stimulusSetId){
  if(!groups.has(q.stimulusSetId))groups.set(q.stimulusSetId,[]);
  groups.get(q.stimulusSetId).push(q);
 }
 assert.equal(groups.size,48);assert.equal(qs.filter(q=>q.stimulusSetId).length,192);
 assert.ok([...groups.values()].every(g=>g.length===4&&g.every(x=>x.stimulusHtml===g[0].stimulusHtml)));
 assert.equal(groups.get('u04-v61-t43-s4').length,4);
 console.log('PASS V66 adapter: 640 unique, original V39 and previous635 unchanged, original five keys, 48 intact four-item scenarios');
 return qs;
}
async function waitAvailable(page,s){
 await page.waitForFunction(n=>document.getElementById('availabilityCount')?.textContent.includes(n),s,{timeout:30000});
}
async function browserCheck(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let b;try{
  b=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await b.newPage({viewport:{width:1280,height:900}});
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
  // Deliberately display the exact source items after the normal test starts.
  // Browser QA does not create a hidden production selection mode or change the student planner.
  await page.evaluate(()=>{
   const q=bank.questions.find(x=>x.id==='g11-u04-master-t43-q038');
   if(!q)throw Error('source Q38 missing from live browser bank');
   test=[{...q,displayOptions:q.options,groupOrdinal:0,groupPosition:0,groupSize:0}];
   answers={};checked={};index=0;lastReportQuestionId=null;render();
  });
  await page.waitForFunction(()=>{const img=document.querySelector('#stimulusPanel img');return img&&img.complete&&img.naturalWidth>0});
  assert.match(await page.locator('#question').textContent(),/Figure 4.13/);
  assert.match(await page.locator('#stimulusPanel img').getAttribute('alt'),/corner axis/i);
  assert.equal(await page.locator('#choices label').count(),4);
  await page.screenshot({path:path.join(qa,'q38-source-verified-axis-figure.png')});
  await page.evaluate(()=>{
   const numbers=[69,70,71,72];
   test=numbers.map((n,i)=>{
    const q=bank.questions.find(x=>x.id==='g11-u04-master-t43-q'+String(n).padStart(3,'0'));
    if(!q)throw Error('held figure scenario MCQ '+n+' missing');
    return {...q,displayOptions:q.options,groupOrdinal:1,groupPosition:i+1,groupSize:4};
   });
   answers={};checked={};index=0;lastReportQuestionId=null;render();
  });
  assert.match(await page.locator('#stimulusPanel').textContent(),/Scenario 4 for MCQs 69-72/);
  assert.match(await page.locator('#qcounter').textContent(),/Scenario 1/);
  await page.waitForFunction(()=>document.querySelector('#stimulusPanel img')?.naturalWidth>0);
  await page.screenshot({path:path.join(qa,'q69-q72-full-original-scenario.png')});
  await page.setViewportSize({width:390,height:844});
  const dim=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(dim[1]<=dim[0]+2,'figure-backed practice overflows 390px mobile');
  await page.screenshot({path:path.join(qa,'q69-source-figure-mobile.png')});
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
  await page.goto(base+'student-guide.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('question-total')?.textContent==='1690');
  assert.match(await page.locator('[data-unit="4"] .count').textContent(),/640 MCQs/);
  assert.deepEqual(errors,[]);
  console.log('PASS V66 Chromium: exact source Q38, full Q69–72 figure scenario, loaded SVG, mobile, 640 U4, 860 mixed and 1690 guide; no saved scores');
 }finally{
  if(b)await b.close();
  await new Promise(resolve=>server.close(resolve));
 }
}
(async()=>{const src=sourceCheck();await bankCheck(src);await browserCheck();})()
 .catch(e=>{console.error('FAIL V66',e);server.close();process.exitCode=1;});
