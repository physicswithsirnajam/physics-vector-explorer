#!/usr/bin/env node
'use strict';
/* V60 source-to-online Grade XI Unit 3 quality gate.
 * Source: original 115-page Oct10 student master Topics 3.3/3.4;
 * Oct11 teacher key + explicit Oct11 numeric-QC corrections.
 * Earlier-revision Topics 3.1/3.2 are deliberately NOT included.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm'),zlib=require('node:zlib');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts','u03-master-v60');
fs.mkdirSync(out,{recursive:true});
const fileAt='question-bank/grade-11/';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const raw=p=>fs.readFileSync(path.join(root,p),'utf8');
const sources=[
 'question-bank/grade-11/unit03-v60-part1.b64',
 'question-bank/grade-11/unit03-v60-part2.b64'
];
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.b64':'text/plain; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const u=new URL(req.url,'http://localhost'),file=path.resolve(root,'.'+decodeURIComponent(u.pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(err){res.writeHead(500);res.end(String(err))}
});
function loadSource(){
 const b64=sources.map(raw).join('').trim();assert.equal(b64.length,13820);
 let fnv=2166136261;
 for(let i=0;i<b64.length;i++)fnv=Math.imul(fnv^b64.charCodeAt(i),16777619)>>>0;
 assert.equal(fnv,0xd73d09df,'source parts changed in transit');
 return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
async function staticAudit(){
 const m=read('question-bank/manifest.json'),c=read('portal/learning-catalog.json');
 const unit3=m.grades.find(g=>g.grade===11).units.find(u=>u.unit===3);
 assert.equal(unit3.liveMcqCount,220);
 assert.equal(unit3.summativePilotCount,160);
 assert.equal(unit3.formativePilotCount,60);
 assert.equal(unit3.scenarioGroupCount,17);
 assert.equal(m.grades.find(g=>g.grade===11).units.reduce((n,u)=>n+u.liveMcqCount,0),1690);
 assert.equal(c.grades.find(g=>g.grade===11).units.find(u=>u.unit===3).questionBankCount,220);
 const original=read(fileAt+'unit-03-stage2-80-practice.json').questions;
 assert.equal(original.length,80);
 const source=loadSource();
 assert.equal(source.version,1);assert.equal(source.rows.length,140);
 assert.equal(Object.keys(source.scenarios).length,11);
 assert.equal(source.sourceSha256,'e9dc7e4ec9081cd881f8becb2408f503f48eb72ecaa99d195c83461f774f8df9');
 assert.equal(source.teacherKeySha256,'635f510251b78639f3bf2d22a9be71d3c226596e202f72cd11c7242966bed330');
 const ids=new Set(),groups=new Map();
 for(const row of source.rows){
  assert.equal(row.length,9);
  const [topic,n,stem,opts,key,explain,slo,level,pageno]=row;
  const id='g11-u03-master-t'+topic+'-q'+String(n).padStart(3,'0');
  assert.ok(!ids.has(id),'duplicate '+id);ids.add(id);
  assert.ok([33,34].includes(topic));
  assert.equal(opts.length,4);assert.ok(opts.every(x=>typeof x==='string'&&x.trim()));
  assert.ok('ABCD'.includes(key));assert.ok(explain.length>0);
  assert.ok(Number.isInteger(pageno)&&pageno>=49&&pageno<=69);
  assert.equal(slo,topic===33?'P-11-B-11':slo);
  if(topic===34)assert.ok(['P-11-B-12','P-11-B-13'].includes(slo));
  const start=topic===33?41:57;
  if(n>=start){
   const group='u03-master-t'+topic+'-s'+(1+Math.floor((n-start)/4));
   assert.ok(source.scenarios[group]);
   if(!groups.has(group))groups.set(group,[]);
   groups.get(group).push(id);
  }
  if(topic===33&&[34,44].includes(n)){
   assert.ok(opts['ABCD'.indexOf(key)].includes('61.6'),'QC correction must remain 61.6 m/s');
   assert.ok(explain.includes('61.6'));
  }
 }
 assert.equal(source.rows.filter(r=>r[0]===33).length,60);
 assert.equal(source.rows.filter(r=>r[0]===34).length,80);
 assert.equal(groups.size,11);
 assert.ok([...groups.values()].every(g=>g.length===4));
 const ctx={DecompressionStream,Blob,Response,atob,
  fetch:async url=>{
   const name=String(url);
   assert.ok(name.startsWith(fileAt));
   assert.ok(fs.existsSync(path.join(root,name)));
   return {ok:true,json:async()=>read(name),text:async()=>raw(name)};
  }};
 vm.createContext(ctx);
 vm.runInContext(raw('shared/practice-bank-adapter-v55.js'),ctx);
 const result=await ctx.PSNPracticeBankV55.loadBank(3,fileAt);
 assert.equal(result.questions.length,220);
 for(let i=0;i<80;i++){
  const a=result.questions[i],b=original[i];
  for(const field of ['id','stem','correctOptionId','explanation','sourceQuestionNumber'])assert.equal(a[field],b[field]);
  assert.deepEqual(JSON.parse(JSON.stringify(a.options)),b.options);
 }
 const added=result.questions.slice(80);
 assert.equal(added.length,140);
 assert.equal(new Set(result.questions.map(q=>q.id)).size,220);
 assert.equal(added.filter(q=>q.assessmentClassification==='formative').length,60);
 assert.equal(added.filter(q=>q.assessmentClassification==='summative-theory').length,80);
 assert.equal(added.filter(q=>q.stimulusSetId).length,44);
 assert.equal(new Set(added.filter(q=>q.stimulusSetId).map(q=>q.stimulusSetId)).size,11);
 const normalize=q=>q.stem.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()+'|'+q.options.map(o=>o.text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()).join('|');
 assert.equal(new Set(result.questions.map(normalize)).size,220,'no exact duplicate MCQ stems and options across old and new sources');
 await assert.rejects(ctx.PSNPracticeBankV55.loadBank(3,'https://example.com/'),/unexpected question bank folder/);
 console.log('PASS V60 source: old 80 unchanged; new 140 = 60 formative + 80 summative, 11 complete new scenarios, source hashes and two explicit numeric corrections.');
}
async function browserAudit(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1365,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'build-your-physics-test.html?unit=3',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('220 eligible MCQ'));
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.screenshot({path:path.join(out,'01-unit3-220-source-mcqs.png')});
  await page.locator('#scope').selectOption('formative');
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('60 eligible MCQ'));
  assert.equal(await page.locator('#quickStartLink').isVisible(),true);
  await page.locator('#scope').selectOption('summative');
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('160 eligible MCQ'));
  await page.locator('#scope').selectOption('all');
  await page.locator('#quantity').selectOption('40');
  await page.locator('#arrangement').selectOption('scenario');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true,'at least 10 full scenario groups');
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  assert.match(await page.locator('#qcounter').textContent(),/Scenario 1 \(1\/4\)/);
  assert.ok((await page.locator('#stimulusPanel').textContent()).length>25);
  assert.equal(await page.locator('#save-result').isDisabled(),true);
  await page.screenshot({path:path.join(out,'02-unit3-complete-scenario.png')});
  await page.goto(base+'build-your-physics-test.html?units=1,3,5',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('844 eligible MCQ'));
  assert.equal(await page.locator('input[name="unit"]:checked').count(),3);
  await page.goto(base+'student-guide.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('question-total').textContent==='1690');
  assert.match(await page.locator('[data-unit="3"] .count').textContent(),/220 MCQs/);
  await page.setViewportSize({width:390,height:844});
  const width=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(width[1]<=width[0]+2,'student guide horizontal overflow '+width);
  assert.deepEqual(errors,[]);
  console.log('PASS V60 Chromium: Unit 3 220 all / 60 formative / 160 summative; complete scenario-only 40-MCQ quiz; mixed 844; student guide 1690 and 390px.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
(async()=>{await staticAudit();await browserAudit()})().catch(e=>{console.error('FAIL V60',e);server.close();process.exitCode=1;});
