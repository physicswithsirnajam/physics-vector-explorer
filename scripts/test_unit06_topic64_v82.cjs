#!/usr/bin/env node
'use strict';
/* V82 Topic6.4 original bank, 20 independent numericals, 80-MCQ browser and 1,924 central boundary */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-64-v82-80-source.json'));
const sourceKey='BBCCACCCBCACBADDCBCCDCADDBBBDDDBCCDBBDBAABCDACBDBDADABBDCBAAACAAADABDAADCAABCDCD';
assert.equal(sourceKey.length,80);assert.equal(bank.bankId,'PSN-XI-U06-T64-V82');
assert.equal(bank.schemaVersion,1);assert.equal(bank.topicNumber,'6.4');assert.equal(bank.unit,6);
assert.equal(bank.sourceQuestionCount,80);assert.equal(bank.publicPreviewCount,80);
assert.equal(bank.questions.length,80);assert.equal(bank.originalSourceAnswerKey,sourceKey);
assert.equal(bank.questions.map(x=>x.correctOptionId).join(''),sourceKey);
assert.deepEqual(bank.verifiedFrameworkTopicSloCodes,['P-11-B-36','P-11-B-37','P-11-B-38']);
assert.equal(bank.perQuestionFrameworkMappingStatus,'not individually verified');
assert.equal(bank.secureExam,false);assert.equal(bank.publicSelfPractice,true);
assert.equal(bank.unitReleaseStatus,'planned-partial-topic-preview');
assert.deepEqual(bank.holds,[]);
assert.deepEqual(bank.sections,{fundamentals:20,reasoning:20,numericals:20,'standalone-situations':20,sharedStimulusGroups:0});
assert.equal(new Set(bank.questions.map(q=>q.id)).size,80);
for(let i=0;i<80;i++){
 const q=bank.questions[i],n=i+1;
 assert.equal(q.id,'XI-U06-T64-MCQ-'+String(n).padStart(4,'0'));assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.grade,11);assert.equal(q.unit,6);assert.equal(q.topic,'Equation of Continuity');
 assert.equal(q.type,'single_choice');assert.equal(q.options.map(x=>x.id).join(''),'ABCD');
 assert.ok(q.stem.length>15&&q.explanation.length>=12);assert.ok(q.options.every(x=>x.text.length>0));
 assert.equal(q.sourceSection,n<=20?'fundamentals':n<=40?'reasoning':n<=60?'numericals':'standalone-situations');
 assert.equal(q.situationBased,n>=61);assert.equal(q.stimulusSetId,null);
 assert.equal(q.active,true);assert.equal(q.holdReason,null);assert.equal(q.status,'provisional-public-self-practice');
 assert.equal(q.boardEligible,false);assert.deepEqual(q.sloCodes,[]);
 assert.deepEqual(q.topicSloCodes,['P-11-B-36','P-11-B-37','P-11-B-38']);
 assert.match(q.sourceKeySloReference,/^P-11-B-3[678]$/);
 assert.equal(q.cognitiveLevel,'Unspecified');assert.equal(q.difficulty,'Unspecified');
 assert.ok(q.sourcePdfPage>=137&&q.sourcePdfPage<=147);
 assert.doesNotMatch(q.stem+' '+q.explanation,/Topic 6.4 • Complete Study|PHYSICS XI \| UNIT 6|TEACHER CHECK/);
}
assert.match(bank.questions[44].stem,/3 × 10-3 m3 s-1/);
assert.match(bank.questions[52].stem,/0\.40 m s-1/);
assert.match(bank.questions[67].stem,/6 L s-1/);
function numeric(q){
 const s=q.options.find(o=>o.id===q.correctOptionId).text.replace(/\s+/g,'');
 const scientific=s.match(/^([+-]?\d+(?:\.\d+)?)×10-(\d+)/);
 if(scientific)return Number(scientific[1])*10**-Number(scientific[2]);
 const plain=s.match(/^[+-]?\d+(?:\.\d+)?/);assert.ok(plain,'Bad source numeric Q'+q.sourceQuestionNumber);return Number(plain[0]);
}
const expected={41:4,42:0.0012,43:4,44:0.0002,45:0.12,46:4,47:2,48:1.6,49:0.002,50:0.0009,51:5,52:0.044,53:0.4,54:3,55:0.003,56:0.002,57:4,58:6,59:2,60:10};
for(const [n,v] of Object.entries(expected))assert.ok(Math.abs(numeric(bank.questions[n-1])-v)<Math.max(1e-10,v*0.0001),'Numerical key Q'+n);
const manifest=JSON.parse(read('question-bank/manifest.json')).grades.find(g=>g.grade===11).units;
assert.equal(manifest.slice(0,5).reduce((s,x)=>s+x.liveMcqCount,0),1690);
assert.equal(manifest[5].liveMcqCount,234);
assert.equal(manifest.reduce((s,x)=>s+x.liveMcqCount,0),1924);
const client=read('portal/unit-06-topic-64-preview.js'),html=read('portal/unit-06-topic-64-preview.html');
assert.match(read('portal/index.html'),/unit-06-topic-64-preview\.html/);
assert.match(client,/unit-06-topic-64-v82-80-source\.json/);
assert.match(html,/question-count.*80|80.*question-count/);
assert.doesNotMatch(client,/firebase|firestore|localStorage\.setItem/i);
async function browser(){
 const {chromium}=require('playwright');
 const server=http.createServer((req,res)=>{
  const clean=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\/+/,''),p=path.resolve(root,clean);
  if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||fs.statSync(p).isDirectory()){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'content-type':p.endsWith('.html')?'text/html':p.endsWith('.js')?'text/javascript':p.endsWith('.json')?'application/json':'application/octet-stream'});res.end(fs.readFileSync(p));
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));let b;
 try{
  b=await chromium.launch({headless:true});
  const p=await b.newPage({viewport:{width:1280,height:820}}),errors=[],missing=[];
  p.on('pageerror',e=>errors.push(e.message));
  p.on('response',r=>{if(r.status()>=400)missing.push(r.status()+':'+r.url())});
  p.on('dialog',d=>d.accept());
  await p.goto('http://127.0.0.1:'+server.address().port+'/portal/unit-06-topic-64-preview.html',{waitUntil:'networkidle'});
  await p.waitForFunction(()=>document.querySelector('#load-status')?.textContent.includes('80 questions available'));
  await p.selectOption('#category','numericals');assert.match(await p.locator('#load-status').textContent(),/20 questions available/);
  await p.selectOption('#size','10');await p.locator('#begin').click();
  assert.match(await p.locator('#position').textContent(),/1 of 10/);
  assert.equal(await p.locator('#option-grid label').count(),4);
  await p.locator('#option-grid input').first().check();await p.locator('#finish').click();
  await p.locator('#results').waitFor({state:'visible'});
  assert.equal(await p.locator('#review article').count(),10);
  assert.match(await p.locator('#score-note').textContent(),/No cloud record/);
  await p.locator('#try-again').click();await p.selectOption('#category','all');
  await p.selectOption('#size','all');await p.locator('#begin').click();await p.locator('#finish').click();
  assert.equal(await p.locator('#review article').count(),80);
  await p.locator('#try-again').click();await p.setViewportSize({width:390,height:844});
  const d=await p.evaluate(()=>({w:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(d.scroll<=d.w+2,'390px overflow '+JSON.stringify(d));
  const out=path.join(root,'qa-artifacts','unit06-topic64-v82');fs.mkdirSync(out,{recursive:true});
  await p.screenshot({path:path.join(out,'unit06-topic64-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  console.log('V82 PASS — 80 source-faithful keyed MCQs, 20 numericals, full review, local-only score, mobile and 1,924 central unchanged.');
 }finally{if(b)await b.close();await new Promise(done=>server.close(done));}
}
browser().catch(e=>{console.error('FAIL V82',e);process.exitCode=1;});