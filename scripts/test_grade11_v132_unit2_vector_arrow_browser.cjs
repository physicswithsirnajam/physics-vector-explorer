#!/usr/bin/env node
'use strict';
/* V132: VISUAL QA of public Unit 2 combining-arrow Unicode in real student practice.
 * Screenshots deliberately show PUBLIC question-only states, never answer reveals,
 * teacher keys, personal accounts, scores or privately uploaded textbook pages.
 * Unicode-in-DOM is NOT a guarantee of glyph/font rendering: visual signoff required.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v132-unit2-vector-arrow-browser');
const gradeTwo=JSON.parse(fs.readFileSync(path.join(root,'question-bank/grade-11/unit-02.json'),'utf8'));
const rows=gradeTwo.questions;
const VECTOR='\u20d7';
const targets=[
 {id:'XI-U02-TEXT-0006',location:'stem',sourceIndex:5,slug:'textbook-q6-stem'},
 {id:'XI-U02-MCQ-0035',location:'option-D',sourceIndex:40,slug:'bank-q35-option-d'}
];
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
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
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('invalid request')}
});
function sourceContract(){
 assert.equal(rows.length,206,'Unit2 original source count must stay 206');
 assert.deepEqual(targets.map(t=>rows[t.sourceIndex].id),targets.map(t=>t.id),
  'Question sample identity/order changed; choose a new reviewed sample, not a fabricated source.');
 for(const t of targets){
  const q=rows[t.sourceIndex];
  const text=t.location==='stem'?q.stem:q.options.find(o=>o.id==='D').text;
  assert.ok(text.includes(VECTOR),'Original Unit2 sample must actually include U+20D7');
  assert.equal(q.sourceQuestionNumber,t.id==='XI-U02-TEXT-0006'?6:35);
 }
 const other=rows.find(q=>q.id==='XI-U02-MCQ-0019');
 assert.ok(other&&other.explanation.includes(VECTOR),'Original position-vector review sample missing');
 assert.ok(fs.readFileSync(path.join(root,'practice-engine/index.html'),'utf8').includes('Copy issue report'));
 const matrix=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(matrix.releaseApproved,false);assert.equal(matrix.teacherSignoff,'pending');
}
async function listen(){
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function main(){
 sourceContract();
 fs.mkdirSync(out,{recursive:true}); // Save question-only public screenshots before submission.
 const base=await listen();
 let browser;
 const results=[];
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   const response=await page.goto(base+'practice-engine/index.html?unit=2&scope=all&count=41&arrangement=random&selection=random&unseen=false&shuffle=false',{waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200);
   await page.locator('#begin').waitFor({state:'visible',timeout:25000});
   await page.locator('#begin').click();
   await page.locator('#question').waitFor({state:'visible',timeout:10000});
   let position=0;
   for(const target of targets){
    // Follow the *actual* student navigation by immutable ID rather than assuming
    // the displayed index equals the JSON row index (or relying on tie-order).
    let ref=await page.locator('#question-reference').innerText();
    while(!ref.includes(target.id)&&position<40){
     await page.locator('#next').click();
     position++;
     ref=await page.locator('#question-reference').innerText();
    }
    assert.ok(ref.includes(target.id),'Original public question '+target.id+' not found in the first 41 rendered questions; last observed '+ref);
    const targetNode=target.location==='stem'?page.locator('#question'):page.locator('#choices .option-txt').nth(3);
    const visibleText=await targetNode.innerText();
    assert.ok(visibleText.includes(VECTOR),'Original combining arrow lost before reaching browser DOM');
    assert.ok(!/[\uFFFD\u25A1]/u.test(visibleText),'Observed obvious replacement/square placeholder in chosen UI text');
    const options=await page.locator('#choices .option-txt').allInnerTexts();
    assert.equal(options.length,4,'Must retain four original source options');
    assert.ok(options.every(o=>o.trim()),'Blank option in browser');
    const metrics=await targetNode.evaluate(node=>{
     const r=node.getBoundingClientRect(),cs=getComputedStyle(node);
     return {hasVisibleBox:r.width>0&&r.height>0,fonts:cs.fontFamily,fontSize:cs.fontSize,
      zeroWidth:r.width===0,hidden:cs.visibility==='hidden'||cs.display==='none'};
    });
    assert.ok(metrics.hasVisibleBox&&!metrics.hidden,'Chosen notation location is invisible');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,
      'Question page horizontally overflows at '+width+'px');
    const screenshot=target.slug+'-'+width+'px.png';
    await page.screenshot({path:path.join(out,screenshot),fullPage:true});
    results.push({width,sourceId:target.id,sourceLocation:target.location,
     combiningArrowPresentInDOM:true,visibleElementBox:true,obviousReplacementGlyphDetected:false,
     fontFamily:metrics.fonts,fontSize:metrics.fontSize,sourceAnswerKeyInspected:false,
     screenshot,manualVisualSignoff:'PENDING'});
   }
   // Check another original-arrow occurrence in a solved explanation WITHOUT
   // retaining question/answer text or taking a screenshot of revealed solutions.
   page.once('dialog',dialog=>dialog.accept());
   await page.locator('#submit').click();
   await page.locator('#result').waitFor({state:'visible',timeout:10000});
   const review=page.locator('#review .review-item').filter({hasText:'XI-U02-MCQ-0019'});
   assert.equal(await review.count(),1,'Original Unit2 #19 not uniquely found in completed-test review');
   assert.ok((await review.textContent()).includes(VECTOR),'Combining arrow missing in original position-vector explanation');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,
     'Solved result page overflows at '+width+'px');
   assert.deepEqual(errors,[],'Browser JS error in Unit2 practice/review');
   await page.close();
  }
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 assert.equal(results.length,6);
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'review-summary.json'),JSON.stringify({
  version:'V132',source:'original public NBF Grade XI Unit2 MCQ bank',
  sourceAudit:'V131 flagged 67 Unit2 MCQs as potential combining-arrow review candidates',
  browserScope:'2 original questions x 3 viewports, plus one original explanation after submission',
  visualRenderingScientificallyCertified:false,manualVisualSignoff:'PENDING',
  description:'The codepoint survives the real DOM; screenshots require independent visual examination to detect fallback boxes/placement errors.',
  sourceKeysOrOriginalTextExported:false,samples:results
 },null,2)+'\n');
 console.log('V132 PASS: six public question-only screenshots + checked original Unit2 explanation in Chromium at 1280, 390, 320px; visible U+20D7 survived DOM; actual glyph shape still requires teacher visual inspection.');
}
main().catch(err=>{console.error('V132 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
