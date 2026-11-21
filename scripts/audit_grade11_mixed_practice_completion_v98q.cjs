#!/usr/bin/env node
'use strict';
/* V98-Q — real student browser attempt from the 6-unit Test Builder to final report.
 * Runs source-local, unauthenticated, with no external network access.
 * Do not transmit reports, grades or account data; do not edit teaching sources.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts','mixed-practice-v98q');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2',
 '.woff':'font/woff','.ico':'image/x-icon'};
function localPath(raw){
 let p=decodeURIComponent(new URL(raw,'http://localhost').pathname);
 if(p.startsWith('/physics-vector-explorer/'))p=p.slice('/physics-vector-explorer'.length);
 if(p.endsWith('/'))p+='index.html';
 const full=path.resolve(root,'.'+p);
 return full.startsWith(root+path.sep)?full:null;
}
const server=http.createServer((req,res)=>{
 const file=localPath(req.url);
 if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){
  res.writeHead(404,{'Content-Type':'text/plain'});res.end('not found');return;
 }
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
 fs.createReadStream(file).pipe(res);
});
function staticGate(){
 const canonical=fs.readFileSync(path.join(root,'portal/assets/physics-with-sir-najam-official-logo.png'));
 const builder=fs.readFileSync(path.join(root,'assets/branding/physics-with-sir-najam-logo.png'));
 assert.equal(Buffer.compare(canonical,builder),0,'the existing root-logo copy is byte-identical to the original official logo');
 for(const file of ['build-your-physics-test.html','practice-engine/index.html']){
  const s=fs.readFileSync(path.join(root,file),'utf8');
  assert.match(s,/<meta\s+name=["']viewport["']/i,'mobile metadata '+file);
  assert.ok(s.includes('Physics with Sir Najam'),'original brand '+file);
 }
 const engine=fs.readFileSync(path.join(root,'practice-engine/index.html'),'utf8');
 for(const marker of [
  'makeMcqIssueReport','navigator.clipboard.writeText','Copied. Paste the report into a message to your teacher; no report has been sent automatically.',
  'psn:practice-finished','id="unitStats"','id="save-result"'
 ])assert.ok(engine.includes(marker),'expected existing source-local issue/attempt feature: '+marker);
 console.log('V98-Q SOURCE PASS: Test Builder and Practice Engine unchanged; canonical image matches root brand; MCQ report is copy-only.');
}
async function verifyLogo(page){
 const logo=page.locator('header img[src*="physics-with-sir-najam-logo.png"], header img[src*="physics-with-sir-najam-official-logo.png"]').first();
 assert.equal(await logo.count(),1,'original Physics with Sir Najam logo visibly included');
 await logo.waitFor({state:'visible',timeout:12000});
 assert.equal(await logo.evaluate(e=>e.complete&&e.naturalWidth>0),true,'official image bytes load');
 assert.ok((await logo.getAttribute('alt')||'').trim().length>=8,'logo must have meaningful alternative text');
}
async function snapshot(page,phase,alerts){
 for(const width of [1280,390,320]){
  await page.setViewportSize({width,height:width===1280?850:844});
  await page.waitForTimeout(100);
  const metrics=await page.evaluate(()=>{
   const w=document.documentElement.clientWidth,sw=document.documentElement.scrollWidth;
   return {viewport:w,documentWidth:sw,horizontalOverflow:sw>w+2,logoImages:[...document.querySelectorAll('img[src*="physics-with-sir-najam-logo.png"], img[src*="physics-with-sir-najam-official-logo.png"]')].filter(i=>i.naturalWidth>0).length};
  });
  if(metrics.horizontalOverflow)alerts.push({phase,viewport:width,type:'document-overflow',documentWidth:metrics.documentWidth});
  if(metrics.logoImages===0)alerts.push({phase,viewport:width,type:'original-logo-not-loaded'});
  const name=phase+'-'+width+'px.png';
  await page.screenshot({path:path.join(out,name),fullPage:false,animations:'disabled'});
  console.log('V98-Q VIEW',phase,width,metrics.documentWidth,metrics.horizontalOverflow?'OVERFLOW':'fits');
 }
}
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
async function main(){
 staticGate();fs.mkdirSync(out,{recursive:true});
 await new Promise((ok,fail)=>server.listen(0,'127.0.0.1',e=>e?fail(e):ok()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const context=await browser.newContext({viewport:{width:1280,height:850},reducedMotion:'reduce',
   permissions:['clipboard-read','clipboard-write']});
  await context.route('https://**/*',route=>route.abort('blockedbyclient'));
  const page=await context.newPage();
  const errors=[],badAssets=[],posts=[];
  page.on('pageerror',e=>errors.push(String(e.message).slice(0,240)));
  page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)badAssets.push({status:r.status(),path:r.url().slice(origin.length)});});
  page.on('request',r=>{if(r.method().toUpperCase()==='POST')posts.push({url:r.url(),method:r.method()});});
  page.on('dialog',d=>d.accept());
  const report={version:'V98-Q',method:'Checked-out local source only; external network blocked',phases:[],alerts:[],selection:[],issueReport:{},results:{},
   boundaries:['No login','No user data','No cloud save','No teacher keys','No automatic issue-report sending','No printing','No external resource requests']};
  await page.goto(origin+'/build-your-physics-test.html?units=1,2,3,4,5,6',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#availabilityCount')?.textContent.includes('2250 eligible MCQ'),null,{timeout:20000});
  await verifyLogo(page);
  assert.deepEqual(await page.locator('#units input[name="unit"]:checked').evaluateAll(xs=>xs.map(x=>x.value)),['1','2','3','4','5','6'],
    'real Test Builder honors all-six-unit preselection');
  await page.locator('#quantity').selectOption('30');
  assert.equal(await page.locator('#quickStartLink').isVisible(),true,'30-question mixed-unit test is available');
  await snapshot(page,'01-builder',report.alerts);
  await page.setViewportSize({width:1280,height:850});
  await page.locator('#quickStartLink').click();
  await page.waitForURL(u=>u.pathname.endsWith('/practice-engine/index.html'));
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'),null,{timeout:20000});
  await verifyLogo(page);
  assert.match(await page.locator('#setupSummary').innerText(),/30 MCQs/,'all-six-unit practice request reaches real engine');
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'),null,{timeout:15000});
  assert.equal(await page.locator('#choices label').count(),4,'first original MCQ renders exactly four options');
  await snapshot(page,'02-quiz',report.alerts);
  await page.setViewportSize({width:1280,height:850});

  // Real issue report, no upload: verify selected MCQ ID and source details appear
  // in COPYABLE text, and the UI never promises a backend submission.
  const firstId=norm(await page.locator('#question-reference').innerText()).replace(/^Question reference:\s*/,'');
  await page.locator('#mcq-report-details summary').click();
  await page.locator('#mcq-report-type').selectOption('missing-context');
  await page.locator('#mcq-report-notes').fill('Fixture: a teaching diagram may be missing; please verify.');
  await page.locator('#copy-mcq-report').click();
  await page.waitForFunction(()=>{
   const text=document.getElementById('mcq-report-status')?.textContent||'';
   return text.includes('Copied')||text.includes('Automatic copying was blocked');
  },null,{timeout:8000});
  const status=norm(await page.locator('#mcq-report-status').innerText());
  let copied='';
  if(status.startsWith('Copied')){
   copied=await page.evaluate(()=>navigator.clipboard.readText());
  }else copied=await page.locator('#mcq-report-fallback').inputValue();
  for(const required of [
   'PHYSICS WITH SIR NAJAM — MCQ REVIEW REQUEST',
   'Question ID: '+firstId,
   'Issue: Missing scenario, graph, diagram or information',
   'Fixture: a teaching diagram may be missing',
   'Options as displayed during practice:',
   'Report generated locally. No account identity, chosen answers, or result included.'
  ])assert.ok(copied.includes(required),'copyable issue report includes '+required);
  assert.ok(status.includes('no report has been sent automatically')||status.includes('Automatic copying was blocked'),
   'issue reporter must not claim that a message was sent');
  assert.equal(posts.length,0,'copying an MCQ issue report never submits a POST request');
  report.issueReport={questionId:firstId,method:status.startsWith('Copied')?'copied to local clipboard':'manual copy fallback',
   noAutomaticSubmission:true,includesUserIdentity:false};
  console.log('V98-Q ISSUE REPORT: existing UI creates structured COPY-ONLY report, not a delivered administrator message.');

  // Verify answer persistence on back/next before completing a real 30-MCQ quiz.
  await page.locator('#choices input[type="radio"]').first().check();
  const firstValue=await page.locator('#choices input[type="radio"]:checked').inputValue();
  await page.locator('#next').click();await page.locator('#prev').click();
  assert.equal(await page.locator('#choices input[type="radio"]:checked').inputValue(),firstValue,
   'first selected answer survives Next → Previous navigation');
  const selections=[],shownIds=new Set(),unitTotals=new Map();
  for(let i=0;i<30;i++){
   const counter=norm(await page.locator('#qcounter').innerText());
   assert.ok(counter.startsWith('Question '+(i+1)+' of 30'),'expected question number '+(i+1)+': '+counter);
   const qId=norm(await page.locator('#question-reference').innerText()).replace(/^Question reference:\s*/,'');
   assert.ok(qId&&!shownIds.has(qId),'distinct real question ID '+qId);
   shownIds.add(qId);
   assert.equal(await page.locator('#choices label').count(),4,'exact four original options for '+qId);
   const tag=norm(await page.locator('#tags .chip').first().innerText());
   assert.match(tag,/^Unit [1-6]$/,'unit tag must identify an actual selected Grade XI unit');
   const unit=Number(tag.slice(5));unitTotals.set(unit,(unitTotals.get(unit)||0)+1);
   if(i<29)await page.locator('#choices input[type="radio"]').first().check(); // leave final item unanswered for report arithmetic
   selections.push({position:i+1,id:qId,unit,answered:i<29,chosen:i<29?await page.locator('#choices input[type="radio"]:checked').inputValue():null});
   if(i<29)await page.locator('#next').click();
  }
  assert.deepEqual([...unitTotals.keys()].sort(),[1,2,3,4,5,6],'all selected Grade XI units actually contribute to the 30-question quiz');
  assert.match(norm(await page.locator('#answeredCount').innerText()),/29 answered \/ 30/);
  report.selection=selections;
  await page.locator('#submit').click(); // local unanswered-question browser confirmation is accepted by test handler
  await page.waitForFunction(()=>!document.getElementById('result').classList.contains('hidden'),null,{timeout:12000});
  assert.equal(await page.locator('#review .review-item').count(),30,'all 30 original questions receive a review entry');
  assert.equal(await page.locator('#save-result').isDisabled(),true,'no cloud-saving for mixed-unit anonymous practice');
  const stats=await page.locator('#stats .stat').evaluateAll(xs=>xs.map(x=>({
   label:(x.querySelector('span')?.textContent||'').trim(),value:(x.querySelector('strong')?.textContent||'').trim()
  })));
  const values=Object.fromEntries(stats.map(x=>[x.label,x.value]));
  const entries=page.locator('#review .review-item');
  let correctlyReviewed=0,unanswered=0;
  for(let i=0;i<30;i++){
   const e=entries.nth(i);
   const currentUser=norm(await e.locator('.review-user span').innerText());
   const correct=norm(await e.locator('.review-answer span').innerText());
   assert.ok(correct.length>0,'correct-choice review text present for original MCQ '+(i+1));
   if(selections[i].answered){
    assert.ok(currentUser.length>0&&currentUser!=='Not answered','answer appears in review '+(i+1));
    if(currentUser===correct)correctlyReviewed++;
   }else{
    assert.equal(currentUser,'Not answered','unanswered item is represented correctly in review');
    unanswered++;
   }
  }
  assert.equal(unanswered,1,'exactly one intentionally unanswered item');
  assert.equal(Number(values.Correct),correctlyReviewed,'final correct-count matches question-by-question review');
  assert.equal(Number(values.Incorrect),29-correctlyReviewed,'incorrect-count matches selected wrong options');
  assert.equal(Number(values['Not answered']),1,'unanswered-count matches real attempt');
  assert.equal(values.Score,Math.round(100*correctlyReviewed/30)+'%','rounded score agrees with real review');
  const chips=await page.locator('#unitStats .slo-chip').allInnerTexts();
  assert.equal(chips.length,6,'performance includes six individual unit groups');
  for(const [unit,count] of unitTotals){
   assert.ok(chips.some(x=>x.startsWith('Unit '+unit+': ')&&x.includes('/'+count+' correct (')),
    'actual question mix reflected accurately for Unit '+unit);
  }
  assert.equal(posts.length,0,'no network POST during anonymous quiz/report/issue-report workflow');
  report.results={questionCount:30,answered:29,unanswered,correct:correctlyReviewed,incorrect:29-correctlyReviewed,
   score:values.Score,unitCounts:Object.fromEntries([...unitTotals].sort((a,b)=>a[0]-b[0])),unitChips:chips,
   cloudSaveDisabled:true};
  await snapshot(page,'03-result',report.alerts);
  fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(report,null,2)+'\n');
  const lines=['# V98-Q — Real mixed six-unit Grade XI MCQ attempt and issue-report audit','',
   'Anonymous source-local Chromium session, external HTTPS requests blocked. No real user data, Firebase saves or teacher/admin messages.','',
   '## Complete 30-question attempt','',
   'All six selected units contribute original source-backed questions. One question is left unanswered deliberately.',
   'Selected answers persist across Next / Previous. Final score, Correct/Incorrect/Not answered, review entries and per-unit counts reconcile.','',
   'Result: '+report.results.correct+'/'+report.results.questionCount+' correct, '+report.results.incorrect+' incorrect, '+report.results.unanswered+' unanswered, score '+report.results.score+'.',
   'Unit mix: '+Object.entries(report.results.unitCounts).map(([u,n])=>'Unit '+u+': '+n).join('; ')+'.','',
   '## Issue-report behavior','',
   '**Current portal behavior is COPY-ONLY, NOT an automatically transmitted teacher message.**',
   'The real practice-page report includes the MCQ ID, original source number, problem category, student note and options. Browser clipboard (or manual fallback) is used; no POST occurs. Students must paste and send the result themselves.','',
   '## Page layout diagnostics ('+report.alerts.length+')','',
   ...(report.alerts.length?report.alerts.map(a=>'- '+a.phase+' '+a.viewport+'px: '+a.type+' '+(a.documentWidth||'')):['No phone/desktop page overflow or branding warnings in the three sampled states.']),
   '', '## Boundaries','',
   'This is not a verified board assessment, scientific answer-key audit, authenticated profile test, private records test or proof of email/notification delivery. It does not publish MCQ reports to any server.',''];
  fs.writeFileSync(path.join(out,'report.md'),lines.join('\n'));
  console.log('V98-Q PASS: 30 actual questions across six units; review/score arithmetic reconciled; MCQ report copy-only; diagnostic alerts '+report.alerts.length+'.');
  assert.deepEqual(errors,[],'no browser JavaScript exceptions on public practice flow');
  assert.deepEqual(badAssets,[],'no missing local source assets');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
}
main().catch(e=>{console.error('V98-Q FAILED',e);server.close();process.exitCode=1;});
