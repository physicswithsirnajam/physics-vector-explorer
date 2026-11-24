#!/usr/bin/env node
'use strict';
/* V129: real Chromium smoke on unchanged original Grade XI public self-practice.
 * No science/answer signoff. A browser sample is NOT a full 2250-item rendering audit.
 * Run only against local checked-in sources, never actual student accounts.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v129-quiz-display/browser-audit.json');
const quiz=fs.readFileSync(path.join(root,'practice-engine/index.html'),'utf8');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.png':'image/png','.svg':'image/svg+xml','.b64':'text/plain; charset=utf-8',
 '.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream',
   'Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('invalid request')}
});
async function listen(){
 await new Promise((resolve,reject)=>{
  server.once('error',reject);
  server.listen(0,'127.0.0.1',resolve);
 });
 return 'http://127.0.0.1:'+server.address().port+'/';
}
function sourceContract(){
 assert.ok(quiz.includes('function practiceScopeTag(q)'),'V129 classification helper missing');
 assert.ok(quiz.includes("q.assessmentClassification==='summative-topic-provisional'"),
  'V129 must recognize the real provisional Topic 6 classification');
 assert.ok(quiz.includes('q.topicSloCodes.join('),'Must use existing provisional topic candidates');
 assert.ok(quiz.includes('Item-level SLO not independently verified'),'Missing Unit 6 teacher-review disclosure');
 assert.ok(quiz.includes("if(q.assessmentClassification==='formative')return 'Formative'"));
 assert.ok(quiz.includes("if(q.assessmentClassification==='summative-theory')return 'Summative theory'"));
 assert.ok(quiz.includes("Copy issue report"));
 assert.ok(quiz.includes('no report has been sent automatically'));
 const matrix=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(matrix.releaseApproved,false);
 assert.equal(matrix.teacherSignoff,'pending');
 assert.equal(matrix.studentCourseStatus,'planned');
 const m=JSON.parse(fs.readFileSync(path.join(root,'question-bank/manifest.json'),'utf8'));
 const unit6=m.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(unit6.liveMcqCount,560);
 assert.equal(unit6.perQuestionSloVerified,false);
 assert.equal(unit6.cognitiveLevelVerified,false);
}

async function browserAudit(){
 const url=await listen();
 let browser;
 const samples=[];
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
   for(const u of [
    {unit:6,scope:'all',expected:'Provisional topic practice — not item-verified'},
    {unit:2,scope:'summative',expected:'Summative theory'},
    {unit:3,scope:'summative',expected:'Summative theory'}
   ]){
    const pageErrors=[];
    const capture=err=>pageErrors.push(err.message);
    page.on('pageerror',capture);
    const target=url+'practice-engine/index.html?unit='+u.unit+
     '&scope='+u.scope+'&count=4&arrangement=random&selection=random&unseen=false&shuffle=false';
    const response=await page.goto(target,{waitUntil:'domcontentloaded'});
    assert.equal(response.status(),200);
    await page.locator('#begin').waitFor({state:'visible',timeout:25000});
    await page.locator('#begin').click();
    await page.locator('#question').waitFor({state:'visible',timeout:10000});
    const labels=await page.locator('#tags').innerText();
    const question=await page.locator('#question').innerText();
    const ref=await page.locator('#question-reference').innerText();
    const options=await page.locator('#choices .option-txt').allInnerTexts();
    assert.ok(ref.includes('Question reference:'),'Real source ID not shown');
    assert.equal(options.length,4,'Missing browser-rendered option');
    assert.ok(question.trim(),'Blank browser-rendered question');
    assert.ok(options.every(x=>x.trim()),'Blank browser-rendered option text');
    assert.ok(labels.includes(u.expected),'Practice scope label does not match actual source classification for Unit '+u.unit);
    if(u.unit===6){
     assert.ok(labels.includes('Topic SLO candidates:'),'Unit 6 topic SLO candidates not shown');
     assert.ok(/P-11-B-\d\d/.test(labels),'Unit 6 topic candidates not displayed');
     assert.ok(labels.includes('Item-level SLO not independently verified'),'Unit 6 item verification warning hidden');
     assert.ok(!labels.includes('Summative theory'),'Unit 6 falsely certified as summative theory item');
     assert.ok(!labels.includes('SLO: '),'Unit 6 still shows empty item-level SLO field');
    }else{
     assert.ok(labels.includes('SLO: P-11-'),'Existing Unit 2/3 summative item SLO tag regressed');
     assert.ok(!labels.includes('Provisional topic practice'),'Existing summative item was falsely reclassified');
    }
    const visible=[question,...options].join(' ');
    assert.ok(!/[\uFFFD\u25A1]/u.test(visible),'Visible question has damaged glyph or square placeholder');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
    assert.equal(overflow,false,'Horizontal overflow in Unit '+u.unit+' at '+width+'px');
    assert.deepEqual(pageErrors,[],'Page JS error in Unit '+u.unit+' at '+width+'px');
    samples.push({unit:u.unit,width,sourceReferenceShown:true,optionsDisplayed:4,
     displayedCategory:u.expected,topicWarningVerified:u.unit===6,
     sampleQuestionTextRecorded:false,sampleAnswersRecorded:false,overflow:false});
    page.off('pageerror',capture);
   }
   await page.close();
  }
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,JSON.stringify({
  version:'V129',scope:'nine real local Chromium practice UI samples (not 2250-item audit)',
  sampleCount:samples.length,samples,
  academicCertification:false,studentRecordsTouched:false,answerKeysExported:false
 },null,2)+'\n');
 console.log('V129 BROWSER PASS: '+samples.length+' live real-source quiz previews at 1280, 390 and 320px; Unit6 provisional SLO labels, Unit2/3 summative labels, four options and no visual placeholders.');
}
async function main(){sourceContract();await browserAudit()}
main().catch(err=>{console.error('V129 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
