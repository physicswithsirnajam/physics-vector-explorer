#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const bank=json('question-bank/grade-11/unit-06-topic-61-v76-80-source.json');
assert.equal(bank.schemaVersion,1);
assert.equal(bank.bankId,'PSN-XI-U06-T61-V76');
assert.equal(bank.sourceQuestionCount,80);
assert.equal(bank.importedQuestionCount,80);
assert.equal(bank.publicPreviewCount,80);
assert.equal(bank.secureExam,false);
assert.equal(bank.publicSelfPractice,true);
assert.equal(bank.questions.length,80);
assert.equal(bank.unitReleaseStatus,'planned-partial-topic-preview');
assert.deepEqual(bank.verifiedFrameworkTopicSloCodes,['P-11-B-33','P-11-B-34']);
assert.equal(bank.frameworkClassification,'Summative');
assert.equal(bank.officialFrameworkCognitiveLevel,'Application');
const key='CDBDBDCDBBCCDCABABDCBACABDCAADCBDBDABBDCCDCDCBACAABABCAAACDDDDADDBBCAAADBBCCAABC';
assert.equal(key.length,80,'Static exact source answer key must be complete');
assert.equal(bank.questions.map(q=>q.correctOptionId).join(''),key,'Source answer-letter mismatch');
assert.equal(new Set(bank.questions.map(q=>q.id)).size,80);
assert.equal(new Set(bank.questions.map(q=>q.stem+'|'+q.options.map(x=>x.text).join('|'))).size,80);
for(let i=0;i<80;i++){
 const q=bank.questions[i];
 assert.equal(q.sourceQuestionNumber,i+1);
 assert.equal(q.id,'XI-U06-T61-MCQ-'+String(i+1).padStart(4,'0'));
 assert.equal(q.unit,6);
 assert.equal(q.grade,11);
 assert.equal(q.boardEligible,false);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.deepEqual(q.sloCodes,[],'Never invent per-item SLO certification');
 assert.deepEqual(q.topicSloCodes,['P-11-B-33','P-11-B-34']);
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.length>15&&q.explanation.length>=12);
 assert.ok(q.options.every(o=>o.text&&o.text.trim()));
 assert.ok(q.sourcePdfPage>=3&&q.sourcePdfPage<=13);
 assert.ok(q.stimulusSetId===null,'These individual scenarios are not grouped source stimuli');
 assert.equal(q.situationBased,i>=64);
 assert.ok(!/SLO alignment|Source: National Book|FBISE Physics HSSC-I Assessment Framework|NBF pp\./i.test(q.explanation),'PDF footer/explanation contamination '+q.id);
}
assert.equal(bank.questions.filter(q=>q.active).length,80);
assert.deepEqual(bank.questions.filter(q=>!q.active).map(q=>q.sourceQuestionNumber),[]);
assert.match(bank.questions[10].stem,/Fig\. 6\.2/);
assert.equal(bank.questions[10].holdReason,null);assert.equal(bank.questions[10].referenceFigureId,'unit6-figure62');
for(const [section,n] of [['fundamentals',20],['reasoning',20],['numericals',24],['standalone-situations',16]]){
 assert.equal(bank.questions.filter(q=>q.sourceSection===section).length,n);
}
assert.equal(bank.questions.filter(q=>q.situationBased&&q.active).length,16);
assert.equal(bank.sections.sharedStimulusGroups,0);
const independentNumeric={
 41:1000*9.8*.002,42:1000*9.8*.005,43:3*9.8,44:1000*9.8*.010,
 45:800*9.8*.004,46:1200*10*.002,47:39.2/(1000*9.8),
 48:1000*10*.015,49:78.4/(1000*9.8),50:1000*9.8*.20**3,
 51:1000*9.8*.05**3,52:1000*9.8*.02*.30,53:1000*9.8*.010*(.9-.4),
 54:1000*10*.2,55:1000*10*.6,56:(6000-2000)*.020,
 57:50-19.6,58:120-25,59:60-60,60:200/(1000*9.8),
 61:200*(7800/1000),62:1000*10*.2*.01,63:1000*10*.5*.01,64:1025*10*.02
};
for(const [n,computed] of Object.entries(independentNumeric)){
 const q=bank.questions[Number(n)-1];
 const opt=q.options.find(o=>o.id===q.correctOptionId);
 const found=Number.parseFloat(opt.text);
 const error=Math.abs(found-computed);
 assert.ok(error<Math.max(0.0001,Math.abs(computed)*0.0002),'Numeric answer mismatch Q'+n+' computed='+computed+' source='+opt.text);
}
const catalog=json('portal/learning-catalog.json'),grade=catalog.grades.find(g=>g.grade===11);
const u6=grade.units.find(u=>u.unit===6);
assert.equal(u6.status,'planned','The whole Unit 6 must not be marked released');
assert.equal(u6.questionBankCount,0,'Central builder Unit 6 is not yet enabled');
assert.equal(grade.units.filter(u=>u.status==='available').reduce((n,u)=>n+u.questionBankCount,0),1690);
assert.equal(bank.questions.length,80);
const index=read('portal/index.html');
assert.ok(index.includes('unit-06-topic-61-preview.html'),'Signed-in Learning Hub preview link missing');
assert.ok(index.includes('PUBLIC SELF-PRACTICE'));
const html=read('portal/unit-06-topic-61-preview.html');
assert.ok(html.includes('unit-06-topic-61-preview.js?v=76'));
assert.ok(html.includes('class="option-grid"'));
assert.ok(html.includes('id="score"'));
assert.ok(html.includes('Public provisional learning preview.'));
assert.ok(read('portal/unit-06-topic-61-preview.js').includes("fetch('../question-bank/grade-11/unit-06-topic-61-v76-80-source.json'"));
assert.ok(!fs.existsSync(path.join(root,'portal','unit-06.html')),'Full-unit page remains unreleased');
console.log('V76 source QA passed: all 80 keys, 24 numerical calculations, 79 selectable and no phantom scenario groups.');
async function browserCheck(){
 const {chromium}=require('playwright');
 const server=http.createServer((req,res)=>{
   try{
     const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
     const file=path.resolve(root,'.'+pathname);
     if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
     const ext=path.extname(file),mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png'};
     res.writeHead(200,{'Content-Type':mime[ext]||'text/plain','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
   }catch(e){res.writeHead(500);res.end(String(e));}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const port=server.address().port;
 let browser;
 try{
   browser=await chromium.launch({headless:true,args:['--no-sandbox']});
   const page=await browser.newPage({viewport:{width:1280,height:900}});
   const errors=[],offsite=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:'+port+'/'))offsite.push(r.url());});
   page.on('dialog',d=>d.accept());
   await page.goto('http://127.0.0.1:'+port+'/portal/unit-06-topic-61-preview.html',{waitUntil:'load'});
   await page.waitForFunction(()=>!document.getElementById('begin').disabled,null,{timeout:12000});
   assert.equal(await page.locator('#question-count').textContent(),'80');
   await page.locator('#category').selectOption('standalone-situations');
   await page.locator('#size').selectOption('all');
   await page.locator('#begin').click();
   assert.ok((await page.locator('#position').textContent()).includes('of 16'));
   assert.equal(await page.locator('#option-grid input[type="radio"]').count(),4);
   await page.locator('#option-grid input[type="radio"]').first().check();
   assert.ok((await page.locator('#answered').textContent()).includes('1 of 16'));
   await page.locator('#next').click();
   await page.locator('#previous').click();
   await page.locator('#finish').click();
   await page.waitForFunction(()=>!document.getElementById('results').hidden);
   assert.equal(await page.locator('#review article').count(),16);
   assert.match(await page.locator('#score').textContent(),/\/ 16/);
   assert.equal(errors.length,0,'Browser errors: '+errors.join('; '));
   assert.equal(offsite.length,0,'Unexpected offsite requests');
   await page.locator('#try-again').click();
   await page.locator('#category').selectOption('fundamentals');
   await page.locator('#size').selectOption('all');
   await page.locator('#begin').click();
   assert.ok((await page.locator('#position').textContent()).includes('of 20'),'Q11 is source-verified and active');
   await page.setViewportSize({width:390,height:844});
   const width=await page.evaluate(()=>({inner:window.innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(width.scroll<=width.inner+4,'Mobile horizontal overflow: '+JSON.stringify(width));
   const out=path.join(root,'qa-artifacts','unit06-v76');fs.mkdirSync(out,{recursive:true});
   await page.screenshot({path:path.join(out,'mobile-topic-preview.png'),fullPage:true});
   console.log('V76 browser QA passed: standalone situations, source figure hold, feedback, mobile 390px and zero offsite requests.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
browserCheck().catch(e=>{console.error(e);process.exitCode=1;});
