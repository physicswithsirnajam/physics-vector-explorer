#!/usr/bin/env node
'use strict';
/* V130 real local Chromium checks of SUBMITTED practice results.
 * Original questions, correct keys, images, accounts and scores are never exported.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v130-unit6-results-review/audit.json');
const html=fs.readFileSync(path.join(root,'practice-engine/index.html'),'utf8');
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
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('invalid request')}
});
async function listen(){
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
function sourceContract(){
 assert.ok(html.includes('id="unit6SloAuditNote"'),'Missing Unit6 result caution');
 assert.ok(html.includes('No certified Unit 6 SLO performance breakdown is available'));
 assert.ok(html.includes("unit6ProvisionalItems=test.filter(q=>q.assessmentClassification==='summative-topic-provisional')"));
 assert.ok(html.includes('$'+'{practiceSloTag(q)} · $'+'{practiceScopeTag(q)}'),'Result review must reuse faithful V129 badge wording');
 assert.ok(html.includes('id="sloAuditNote"'),'Original Unit4 caution must remain');
 assert.ok(html.includes('Copy issue report'));
 assert.ok(html.includes('no report has been sent automatically'));
 const matrix=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(matrix.releaseApproved,false);
 assert.equal(matrix.teacherSignoff,'pending');
 assert.equal(matrix.studentCourseStatus,'planned');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'server/review-manifests/grade11-approved-public-review-refs-v99i.json'),'utf8'));
 assert.equal(manifest.questionRefs.length,2250);
 assert.equal(manifest.unitCounts['6'],560);
}
async function browserAudit(){
 const base=await listen();
 let browser;
 const results=[];
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390]){
   const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
   for(const unit of [6,2]){
    const errors=[],listener=e=>errors.push(e.message);
    page.on('pageerror',listener);
    const url=base+'practice-engine/index.html?unit='+unit+'&scope='+
     (unit===6?'all':'summative')+
     '&count=4&arrangement=random&selection=random&unseen=false&shuffle=false';
    const response=await page.goto(url,{waitUntil:'domcontentloaded'});
    assert.equal(response.status(),200);
    await page.locator('#begin').waitFor({state:'visible',timeout:25000});
    await page.locator('#begin').click();
    await page.locator('#question').waitFor({state:'visible',timeout:10000});
    page.once('dialog',dialog=>dialog.accept());
    await page.locator('#submit').click();
    await page.locator('#result').waitFor({state:'visible',timeout:10000});
    assert.equal(await page.locator('#review .review-item').count(),4);
    // Each review card also contains a muted issue-report status paragraph; count only source metadata.
    const refs=await page.locator('#review .review-item > p.muted:not(.no-print)').allInnerTexts();
    assert.equal(refs.length,4);
    assert.ok(refs.every(s=>/Ref: \S+/.test(s)),'Original question IDs missing');
    if(unit===6){
     assert.ok(await page.locator('#unit6SloAuditNote').isVisible(),'Unit6 academic caution hidden');
     assert.ok(refs.every(s=>s.includes('Topic SLO candidates: P-11-B-')),'Unit6 result missing topic candidates');
     assert.ok(refs.every(s=>s.includes('Provisional topic practice — not item-verified')),'Unit6 falsely item-certified');
     assert.ok(refs.every(s=>!s.includes('· SLO: ')&&!s.includes('· Summative theory ·')),'Unit6 falsely claims item verification');
     assert.equal(await page.locator('#sloStats .slo-chip').count(),0,'Unit6 received individual verified SLO tally');
    }else{
     assert.ok(await page.locator('#unit6SloAuditNote').isHidden(),'Unit6 caution shown in Unit2');
     assert.ok(refs.every(s=>s.includes('SLO: P-11-')&&s.includes('Summative theory')),'Original Unit2 SLO labels lost');
     assert.ok(await page.locator('#sloStats .slo-chip').count()>0,'Unit2 mapped SLO tally lost');
    }
    assert.ok((await page.locator('#resultMeta').innerText()).includes('Self-assessment only'));
    assert.ok((await page.locator('#stats').innerText()).includes('Not answered'));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2),false,'Result page horizontally overflows');
    assert.deepEqual(errors,[],'Browser JavaScript exception in result');
    results.push({unit,width,questionsReviewed:4,originalRefsVisible:true,
     unit6AcademicNotice:unit===6,displayPolicyCorrect:true,
     questionContentExported:false,answerKeysExported:false,studentDataAccessed:false});
    page.off('pageerror',listener);
   }
   await page.close();
  }
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,JSON.stringify({
  version:'V130',scope:'four representative real-browser submitted results, not all 2250 questions',
  academicCertification:false,questionSourceChanged:false,results
 },null,2)+'\n');
 console.log('V130 PASS: four submitted-result browser journeys; Unit6 provisional and Unit2 mapped SLO labels unchanged and honest.');
}
async function main(){sourceContract();await browserAudit()}
main().catch(e=>{console.error('V130 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
