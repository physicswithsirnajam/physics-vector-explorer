#!/usr/bin/env node
'use strict';
/* V133: original Unit 1 rich-math question-only browser visual QA.
 * Source questions are read-only. Screenshot artifacts are PUBLIC practice
 * before checking answers; no original answer keys, accounts or reports exported.
 * DOM and CSS assertions do NOT certify glyph appearance; inspect screenshots.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const bankPath=path.join(root,'question-bank/grade-11/unit-01.json');
const bankBytes=fs.readFileSync(bankPath);
const hash=crypto.createHash('sha256').update(bankBytes).digest('hex');
const bank=JSON.parse(bankBytes.toString('utf8'));
const out=path.join(root,'qa-artifacts/grade11-v133-unit1-mathml-visual');
const SAMPLE=[
 {id:'XI-U01-MCQ-0003',number:3,kind:'stem-inline-mathml-greek',classification:'formative',area:'stem',selector:'#question math',minMathRoots:2,requiresSup:false},
 {id:'XI-U01-MCQ-0005',number:5,kind:'option-block-mathml-superscript',classification:'formative',area:'option-D',selector:'#choices .option-txt:nth-child(1)',minMathRoots:1,requiresSup:true},
 {id:'XI-U01-MCQ-0019',number:19,kind:'stem-inline-mathml-negative-powers',classification:'summative-theory',area:'stem',selector:'#question math',minMathRoots:1,requiresSup:true},
 {id:'XI-U01-MCQ-0024',number:24,kind:'option-block-mathml-dimensions',classification:'summative-theory',area:'option-B',selector:'#choices .option-txt',minMathRoots:1,requiresSup:true}
];
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.png':'image/png','.svg':'image/svg+xml','.b64':'text/plain; charset=utf-8',
 '.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('not found');return;
  }
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('invalid request')}
});
async function listen(){
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
function sourceContract(){
 assert.equal(bank.questions.length,275);
 for(const t of SAMPLE){
  const q=bank.questions.find(x=>x.id===t.id);
  assert.ok(q,'Missing original Unit 1 source ID '+t.id);
  assert.equal(q.sourceQuestionNumber,t.number);
  assert.equal(q.active,true);
  assert.equal(q.assessmentClassification,t.classification,'Original formative/summative category must not change');
  assert.equal(q.options.length,4);
  assert.ok(q.options.every(x=>typeof x.text==='string'&&x.text.trim()));
  const source=t.area==='stem'?q.stemHtml:q.options.find(o=>o.id===t.area.slice(-1)).html;
  assert.ok(source&&source.includes('<math'),'Selected sample is not source-backed MathML');
  if(t.requiresSup)assert.ok(source.includes('<msup>'),'Original source does not contain superscript MathML');
 }
 const release=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(release.releaseApproved,false);
 assert.equal(release.teacherSignoff,'pending');
 assert.equal(release.studentCourseStatus,'planned');
}
function targetSelector(t){
 if(t.area==='stem')return '#question';
 return '#choices .option-txt >> nth='+('ABCD'.indexOf(t.area.slice(-1)));
}
async function main(){
 sourceContract();
 fs.mkdirSync(out,{recursive:true});
 const base=await listen();
 let browser;
 const observations=[];
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'practice-engine/index.html?unit=1&scope=all&count=24&arrangement=random&selection=random&unseen=false&shuffle=false',{waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200);
   await page.locator('#begin').waitFor({state:'visible',timeout:25000});
   await page.locator('#begin').click();
   await page.locator('#question').waitFor({state:'visible',timeout:10000});
   let examined=0;
   for(const t of SAMPLE){
    let current=await page.locator('#question-reference').innerText();
    while(!current.includes(t.id)&&examined<23){
     await page.locator('#next').click();examined++;
     current=await page.locator('#question-reference').innerText();
    }
    assert.ok(current.includes(t.id),'Source ID '+t.id+' not reached through original student navigation: '+current);
    const node=page.locator(targetSelector(t));
    assert.ok(await node.isVisible(),'Original MathML display location hidden: '+t.id);
    const mathCount=await node.locator('math').count();
    assert.ok(mathCount>=t.minMathRoots,'Original MathML root not present for '+t.id);
    const superscripts=await node.locator('math msup').count();
    if(t.requiresSup)assert.ok(superscripts>0,'Original mSup not in rendered DOM for '+t.id);
    const inspected=await node.locator('math').first().evaluate(el=>{
     const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
     return {hasBox:r.width>0&&r.height>0,fontFamily:cs.fontFamily,
      display:cs.display,visibility:cs.visibility};
    });
    assert.ok(inspected.hasBox&&inspected.display!=='none'&&inspected.visibility!=='hidden',
     'MathML root has no visible CSS box for '+t.id);
    const full=await page.locator('#question').innerText();
    const options=await page.locator('#choices .option-txt').allInnerTexts();
    assert.ok(full.trim()&&options.length===4&&options.every(x=>x.trim()),
     'Original question or four options not browser-visible: '+t.id);
    assert.equal(await page.locator('#feedbackBox').isVisible(),false,
     'Question-only screenshot would expose revealed answer');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2),false,
     'Horizontal overflow at '+width+'px / '+t.id);
    assert.ok(!/[\uFFFD\u25A1]/u.test(full+' '+options.join(' ')),
     'Original visible stem/options contain obvious replacement/box glyph');
    const screenshot=t.kind+'-'+width+'px.png';
    await page.screenshot({path:path.join(out,screenshot),fullPage:true});
    observations.push({sourceId:t.id,originalQuestionNumber:t.number,kind:t.kind,
     viewportPx:width,mathRoots:mathCount,superscriptRoots:superscripts,
     renderedCssMathBox:true,fontFamily:inspected.fontFamily,
     screenshot,questionContentExported:false,answerKeyExported:false,
     teacherScreenshotVisualReview:'PENDING'});
   }
   assert.deepEqual(errors,[],'Browser JavaScript exception in Unit 1 original public practice');
   await page.close();
  }
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 assert.equal(observations.length,12);
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(bankPath)).digest('hex'),hash,
  'Unexpected original Unit 1 source mutation');
 fs.writeFileSync(path.join(out,'review-summary.json'),JSON.stringify({
  version:'V133',sourceUnit:1,originalSourceQuestionCount:275,
  checkedSampleCount:4,viewports:[1280,390,320],
  screenshotCount:12,observations,
  note:'DOM and CSS checks cannot certify MathML glyph visual quality; a teacher must inspect screenshots.',
  originalScienceAndAnswerQcCompleted:false,all275VisuallyVerified:false,
  unit6FormalAssessmentReleased:false,originalSourceModified:false
 },null,2)+'\n');
 console.log('V133 PASS: 12 original Unit1 MathML question-only screenshots, 4 stable IDs, 3 real Chromium widths; teacher visual review PENDING.');
}
main().catch(e=>{console.error('V133 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
