#!/usr/bin/env node
'use strict';
/* V134: real Chromium check of the PRODUCTION setRich renderer, using only the
 * two source-verified Unit 5 summative stimulus groups flagged by V131.
 * These are browser-rendering previews of exact source stimulus strings, not
 * simulated student submissions or teacher-answer displays.
 * All source banks, keys, scores, pages and Firebase settings remain untouched.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const sourceFile=path.join(root,'question-bank/grade-11/unit-05-master-topic-v59-317.json');
const original=fs.readFileSync(sourceFile);
const sha=crypto.createHash('sha256').update(original).digest('hex');
const data=JSON.parse(original.toString('utf8'));
const out=path.join(root,'qa-artifacts/grade11-v134-unit5-entity-rendering');
const groups=[
 {group:'u05-t54-s2',numbers:[61,62,63,64],token:'object',label:'Motor/work-energy passage'},
 {group:'u05-t54-s6',numbers:[77,78,79,80],token:'unit',label:'Crane/energy conversion passage'}
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
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream',
   'Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('invalid request')}
});
async function listen(){
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
function sourceContract(){
 assert.equal(data.questions.length,317,'Original master bank must remain 317 questions');
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'server/review-manifests/grade11-approved-public-review-refs-v99i.json'),'utf8'));
 assert.equal(catalog.questionRefs.length,2250);
 assert.equal(catalog.unitCounts['5'],349);
 const report=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(report.releaseApproved,false);
 assert.equal(report.teacherSignoff,'pending');
 assert.equal(report.studentCourseStatus,'planned');
 for(const g of groups){
  const items=data.questions.filter(q=>q.stimulusSetId===g.group);
  assert.equal(items.length,4,'Original complete stimulus group '+g.group+' changed');
  assert.deepEqual(items.map(q=>q.sourceQuestionNumber),g.numbers);
  assert.ok(items.every(q=>q.assessmentClassification==='summative-theory'&&q.sloCodes.includes('P-11-B-32')));
  assert.ok(items.every(q=>q.stimulusHtml===items[0].stimulusHtml),'Original four-item stimulus must be identical');
  assert.ok(items[0].stimulusHtml.includes('&#x27;'),'V131 original encoded-apostrophe signal disappeared');
  assert.ok(!items[0].stimulusHtml.includes('Correct answer'),'Stimulus preview may not contain revealed key');
  g.sourceHtml=items[0].stimulusHtml;
  g.ids=items.map(q=>q.id);
 }
}
async function main(){
 sourceContract();
 fs.mkdirSync(out,{recursive:true});
 const base=await listen();
 let browser;
 const results=[];
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',err=>errors.push(err.message));
   const response=await page.goto(base+'practice-engine/index.html?unit=5&scope=summative&count=4&arrangement=random&selection=random&unseen=false&shuffle=false',
    {waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200);
   await page.locator('#begin').waitFor({state:'visible',timeout:25000});
   await page.locator('#begin').click();
   await page.locator('#question').waitFor({state:'visible',timeout:10000});
   assert.equal(await page.locator('#choices .option-txt').count(),4,'Original public quiz must remain usable');
   assert.ok(!(await page.locator('#feedbackBox').isVisible()),'Question-only preview cannot expose worked answer');
   for(const g of groups){
    // Use the very same setRich(html, fallback) function as live student
    // stimulusPanel in the checked-in classic script, with original source text.
    // This test-only visual aid is deliberately NOT a changed student page.
    const rendered=await page.evaluate(({sourceHtml,label})=>{
     if(typeof setRich!=='function')throw Error('Production rich-stimulus renderer unavailable');
     document.querySelector('#v134-preview')?.remove();
     const section=document.createElement('section');
     section.id='v134-preview';
     section.style.cssText='width:min(720px,calc(100vw - 24px));margin:20px auto;padding:18px;border:2px solid #29436c;border-radius:10px;background:white;color:#16223d;box-sizing:border-box;font:16px/1.7 system-ui,sans-serif';
     const title=document.createElement('h3');title.textContent='Original Unit 5 scenario text — rendering QA only';title.style.margin='0 0 12px';
     const sub=document.createElement('p');sub.textContent=label;sub.style.cssText='font-weight:bold;margin:0 0 8px';
     const content=document.createElement('div');content.id='v134-content';
     setRich(content,sourceHtml,'');
     section.append(title,sub,content);
     document.body.append(section);
     const bounds=content.getBoundingClientRect();
     return {text:content.textContent,htmlTag:content.firstElementChild?.tagName,
      visible:bounds.width>0&&bounds.height>0};
    },{sourceHtml:g.sourceHtml,label:g.label});
    assert.equal(rendered.htmlTag,'P','Original encoded stimulus must render through allowed paragraph element');
    assert.equal(rendered.visible,true,'Stimulus preview is not visible at '+width+'px');
    assert.ok(rendered.text.includes(g.token+"'s"),'Encoded apostrophe was not decoded by original browser renderer');
    assert.ok(!rendered.text.includes('&#x27;'),'Literal HTML entity leaked into student-visible stimulus');
    assert.ok(!/[\uFFFD\u25A1]/u.test(rendered.text),'Obvious missing-glyph placeholder in stimulus preview');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,
     'Page has horizontal overflow at '+width+'px');
    const screenshot=g.group.replace(/[^a-z0-9-]/gi,'-')+'-'+width+'px.png';
    await page.locator('#v134-preview').screenshot({path:path.join(out,screenshot)});
    results.push({group:g.group,questionIDs:g.ids,width,screenshot,
     originalEntity:'HTML encoded apostrophe',productionRenderer:'setRich',
     decodedApostropheVisible:true,rawEntityVisible:false,
     manualVisualQC:'PENDING',originalAnswersExported:false});
   }
   assert.deepEqual(errors,[],'Page JS error while rendering original stimulus');
   await page.close();
  }
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 assert.equal(results.length,6);
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(sourceFile)).digest('hex'),sha,
  'Read-only preview altered original source bank');
 fs.writeFileSync(path.join(out,'review-summary.json'),JSON.stringify({
  version:'V134',samples:results,sourceIDsInspected:8,sourceScenarioGroups:2,
  screenWidths:[1280,390,320],screenshots:6,
  interpretation:'Source-encoded apostrophes were decoded by the original safe rich renderer; V131 entity flags in these source fields are false-positive display risks in Chromium.',
  caveat:'This is a production-renderer preview of original stimulus, not a full eight-question student session or full original-source Physics accuracy review.',
  scienceOrSLOCertification:false,originalSourceModified:false,
  totalProvisionalGrade11MCQs:2250,unit6IndividualSignoff:'PENDING'
 },null,2)+'\n');
 console.log('V134 PASS: two original Unit5 summative scenario stimulus groups, eight source IDs, six Chromium renderer screenshots; HTML apostrophes decoded rather than shown literally.');
}
main().catch(e=>{console.error('V134 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
