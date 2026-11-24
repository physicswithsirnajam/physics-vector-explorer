#!/usr/bin/env node
'use strict';
/* V138 — real, local-only student issue export regression.
 * Test the original Unit6 figure-bearing public question in the unchanged
 * source bank. Capture browser downloads in CI memory/temp paths only.
 * Never export question stems, four options, answer keys, scores, accounts,
 * notes or credentials in the CI artifact. No report is submitted to backend.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v138-mcq-report-download/audit.json');
const originalFigureId='XI-U06-T61-MCQ-0011';
const sourcePaths=[
 'question-bank/grade-11/unit-06-topic-61-v76-80-source.json',
 'question-bank/manifest.json','shared/practice-bank-adapter-v55.js',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const before=Object.fromEntries(sourcePaths.map(p=>[p,digest(fs.readFileSync(path.join(root,p)))]));
const html=fs.readFileSync(path.join(root,'practice-engine/index.html'),'utf8');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.b64':'text/plain; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('bad request')}
});
async function listen(){
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
function contracts(){
 assert.ok(html.includes('id="download-mcq-report"'));
 assert.ok(html.includes('Download this MCQ issue (.txt)'));
 assert.ok(html.includes("Figure reference ID: '+String(q.referenceFigureId)"));
 assert.ok(html.includes("Scenario group ID: '+String(q.stimulusSetId)"));
 assert.ok(html.includes('const file=new Blob([text],'));
 assert.ok(html.includes("anchor.download=filename"));
 assert.ok(html.includes('nothing was sent automatically.'));
 assert.ok(html.includes('Copy issue report'));
 assert.ok(html.includes('no report has been sent automatically'));
 const original=JSON.parse(fs.readFileSync(path.join(root,sourcePaths[0]),'utf8'));
 const fig=original.questions.find(q=>q.id===originalFigureId);
 assert.ok(fig,'Original NBF source figure question absent');
 assert.equal(fig.referenceFigureId,'unit6-figure62');
 assert.equal(fig.sourceQuestionNumber,11);
 const refs=JSON.parse(fs.readFileSync(path.join(root,'server/review-manifests/grade11-approved-public-review-refs-v99i.json'),'utf8'));
 assert.equal(refs.questionRefs.length,2250);
 assert.equal(refs.unitCounts['6'],560);
 assert.ok(refs.questionRefs.some(q=>q[0]===originalFigureId));
 const matrix=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(matrix.releaseApproved,false);
 assert.equal(matrix.teacherSignoff,'pending');
 assert.equal(matrix.studentCourseStatus,'planned');
}
async function captureDownload(page,trigger){
 const expected=page.waitForEvent('download',{timeout:10000});
 await trigger();
 const download=await expected;
 assert.equal(download.suggestedFilename(),'psn-mcq-issue-'+originalFigureId+'.txt');
 const file=await download.path();
 const report=fs.readFileSync(file,'utf8');
 assert.ok(report.includes('PHYSICS WITH SIR NAJAM — MCQ REVIEW REQUEST'));
 assert.ok(report.includes('Question ID: '+originalFigureId));
 assert.ok(report.includes('Original source question number: 11'));
 assert.ok(report.includes('Figure reference ID: unit6-figure62'));
 assert.ok(report.includes('Note: the actual diagram is not included in this text file.'));
 assert.ok(report.includes('Bank version: '));
 assert.ok(report.includes('Options as displayed during practice:'));
 assert.ok(report.includes('A. ')&&report.includes('B. ')&&report.includes('C. ')&&report.includes('D. '));
 assert.ok(report.includes('Report generated locally. No account identity, chosen answers, or result included.'));
 for(const forbidden of ['Correct answer:','Your answer:','Total score:','Student email:','Account ID:']){
  assert.ok(!report.includes(forbidden),'Sensitive/key field included in .txt issue report: '+forbidden);
 }
 return report;
}
async function main(){
 contracts();
 const base=await listen();
 let browser;
 const checks=[];
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const ctx=await browser.newContext({viewport:{width,height:860},acceptDownloads:true});
   const page=await ctx.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const url=base+'practice-engine/index.html?unit=6&scope=all&count=4&arrangement=random&selection=random&unseen=false&shuffle=false&feedback=end';
   assert.equal((await page.goto(url,{waitUntil:'domcontentloaded'})).status(),200);
   await page.locator('#begin').waitFor({state:'visible',timeout:25000});
   await page.locator('#begin').click();
   await page.locator('#question').waitFor({state:'visible',timeout:12000});
   const stable=await page.evaluate(id=>{
    const q=bank.questions.find(x=>x.id===id);
    if(!q||q.unit!==6||q.referenceFigureId!=='unit6-figure62')
     throw Error('Exact original Grade XI Unit6 figure candidate missing');
    if(!q.active||q.options.length!==4)throw Error('Source question inactive or missing A–D');
    // Narrow test-only navigation to this exact loaded ORIGINAL source record.
    test=[{...q,displayOptions:q.options.slice()}];index=0;answers={};checked={};render();
    return {id:q.id,unit:q.unit,sourceNumber:q.sourceQuestionNumber,
     figure:q.referenceFigureId,sourceStem:q.stem,options:test[0].displayOptions.map(o=>o.text)};
   },originalFigureId);
   assert.equal(stable.id,originalFigureId);
   assert.equal(await page.locator('#question-reference').innerText(),'Question reference: '+originalFigureId);
   await page.locator('#mcq-report-details summary').click();
   await page.locator('#mcq-report-type').selectOption('missing-context');
   await page.locator('#mcq-report-notes').fill('Please check the source diagram used in this question.');
   const quizReport=await captureDownload(page,async()=>page.locator('#download-mcq-report').click());
   assert.ok(quizReport.includes('Issue: Missing scenario, graph, diagram or information'));
   assert.ok(quizReport.includes('Student note: Please check the source diagram used in this question.'));
   assert.ok(quizReport.includes('Question: '+stable.sourceStem));
   assert.ok(stable.options.every(x=>quizReport.includes(x)),'Original displayed A–D option absent from issue report');
   assert.ok((await page.locator('#mcq-report-status').innerText()).includes('nothing was sent automatically'));
   // Existing copy action remains available after a download.
   await page.locator('#copy-mcq-report').click();
   // Clipboard write is async; wait for the existing copy/fallback path to settle.
   await page.waitForFunction(()=>{
    const status=document.querySelector('#mcq-report-status')?.textContent||'';
    return status.startsWith('Copied.')||status.startsWith('Automatic copying was blocked.');
   },null,{timeout:8000});
   const copyStatus=await page.locator('#mcq-report-status').innerText();
   assert.ok(copyStatus.includes('no report has been sent automatically')||
      copyStatus.includes('Automatic copying was blocked'),
      'Original copy-only status regressed');
   page.once('dialog',d=>d.accept());
   await page.locator('#submit').click();
   await page.locator('#result').waitFor({state:'visible',timeout:12000});
   assert.equal(await page.locator('#review .review-item').count(),1);
   const resultReport=await captureDownload(page,async()=>
    page.locator('#review .review-item').getByRole('button',{name:'Download this MCQ issue (.txt)'}).click());
   assert.ok(resultReport.includes('Issue: Other issue'));
   assert.ok(resultReport.includes('Student note: Please review this MCQ after the completed test.'));
   assert.ok(resultReport.includes('Figure reference ID: unit6-figure62'));
   assert.ok(resultReport.includes('Question: '+stable.sourceStem));
   assert.ok((await page.locator('#review .review-item p[role="status"]').last().innerText()).includes('nothing was sent automatically'));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,
    'MCQ issue download controls cause narrow-screen horizontal overflow');
   assert.deepEqual(errors,[],'Page JS exception in public quiz / results reporting');
   checks.push({viewportPx:width,publicOriginalSourceId:originalFigureId,
    originalFigureIdPresent:true,downloadWorkedDuringQuestion:true,
    downloadWorkedAfterSubmission:true,copyOnlyWorkflowPreserved:true,
    correctAnswerAndScoresNotExported:true,backendReportSent:false});
   await ctx.close();
  }
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 const after=Object.fromEntries(sourcePaths.map(p=>[p,digest(fs.readFileSync(path.join(root,p)))]));
 assert.deepEqual(after,before,'Original Grade XI source or academic release files changed during audit');
 fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,JSON.stringify({
  version:'V138',scope:'original Unit6 public diagram question issue-report download QA, 3 viewports',
  samples:checks,originalSourceModified:false,teacherInboxEnabled:false,
  privateStudentRecordsAccessed:false,academicSignoffComplete:false
 },null,2)+'\n');
 console.log('V138 PASS: local issue TXT downloads for original Unit6 figure source at 1280/390/320px, before and after practice; figure ID included, answer/grades excluded, no backend submission.');
}
main().catch(e=>{console.error('V138 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
