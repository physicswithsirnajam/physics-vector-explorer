#!/usr/bin/env node
'use strict';
/* V91 source-faithful, local-only figure verification review desk.
 * No actual PDF figure pixels were published or automatically certified.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const held=[
 {topic:'61',num:11,answer:'C',printedPage:90,figure:'6.2'},
 {topic:'62',num:26,answer:'D',printedPage:92,figure:'6.3'},
 {topic:'62',num:64,answer:'A',printedPage:94,figure:'6.5(c)'},
 {topic:'62',num:72,answer:'D',printedPage:92,figure:'6.3'},
 {topic:'63',num:24,answer:'B',printedPage:95,figure:'6.6'},
 {topic:'63',num:80,answer:'B',printedPage:95,figure:'6.6'}
];
const sourceFiles={61:'unit-06-topic-61-v76-80-source.json',62:'unit-06-topic-62-v78-80-source.json',63:'unit-06-topic-63-v80-80-source.json'};
const key={61:79,62:77,63:78};
for(const topic of ['61','62','63']){
 const bank=json('question-bank/grade-11/'+sourceFiles[topic]);
 assert.equal(bank.sourceQuestionCount,80);
 assert.equal(bank.questions.length,80);
 assert.equal(bank.questions.filter(q=>q.active).length,key[topic]);
 const expected=held.filter(x=>x.topic===topic).map(x=>x.num).join(',');
 assert.equal(bank.questions.filter(q=>!q.active).map(q=>q.sourceQuestionNumber).join(','),expected,'Held source list changed for topic '+topic);
 for(const h of held.filter(x=>x.topic===topic)){
  const q=bank.questions[h.num-1];
  assert.equal(q.sourceQuestionNumber,h.num);
  assert.equal(q.active,false);assert.equal(q.holdReason?.length>15,true);
  assert.equal(q.correctOptionId,h.answer,'Original teacher key changed');
  assert.equal(q.id,'XI-U06-T'+topic+'-MCQ-'+String(h.num).padStart(4,'0'));
  assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
  assert.equal(q.boardEligible,false);assert.equal(q.cognitiveLevel,'Unspecified');
  assert.deepEqual(q.sloCodes,[]);assert.equal(q.stimulusSetId,null);
 }
}
const manifest=json('question-bank/manifest.json').grades.find(g=>g.grade===11).units;
assert.deepEqual(manifest.map(u=>u.liveMcqCount),[275,206,220,640,349,554]);
assert.equal(manifest[5].sourceTopicMcqCount,560);
assert.equal(manifest[5].sourceFigureHeldCount,6);
assert.equal(manifest[5].independentSharedStimulusGroupCount,0);
assert.equal(manifest[5].standaloneSituationQuestionCount,133);
assert.equal(manifest.reduce((n,u)=>n+u.liveMcqCount,0),2244);
const unit=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(unit.status,'planned');assert.equal(unit.questionBankCount,0);
assert.equal(unit.partialTestBuilderMcqCount,554);
assert.equal(unit.sourceTopicMcqCount,560);
const html=read('portal/unit-06-figure-verification-v91.html'),controller=read('portal/unit-06-figure-verification-v91.js');
assert.match(html,/Unit 6 Figure Verification Desk|Figure Verification Desk|Figure Comparison &amp; Verification Desk/);
assert.match(html,/2,244/);
assert.match(html,/local browser worksheet/);
assert.match(html,/No automatic release or official certification/);
assert.match(html,/actual NBF Grade XI printed figures/);
assert.match(html,/unit-06-figure-verification-v91\.js/);
assert.match(read('portal/index.html'),/unit-06-figure-verification-v91\.html/);
assert.match(read('portal/unit-06-figure-study-v90.html'),/unit-06-figure-verification-v91\.html/);
for(const file of Object.values(sourceFiles))assert.match(controller,new RegExp(file.replaceAll('.','\\.')));
assert.match(controller,/candidate-signoff/);
assert.match(controller,/candidate status needs all three checks/i);
assert.match(controller,/source question remains held|original question is still held/i);
assert.match(controller,/navigator\.clipboard/);
assert.match(controller,/copyRecord/);
assert.doesNotMatch(controller,/\blocalStorage\b|\bsessionStorage\b|indexedDB|firestore|firebase|sendBeacon|XMLHttpRequest|\.post\(/i);
assert.doesNotMatch(html,/<iframe\b/i);
assert.ok(!fs.existsSync(path.join(root,'portal','Grade11_Unit6_COMPLETE_MASTER_ALL.pdf')));
assert.ok(!fs.existsSync(path.join(root,'portal','unit-06.html')),'Full Unit6 course cannot be released with an unverified figure');
console.log('V91 STATIC PASS — six original held keys, no certification, 554 Unit6 / 2,244 all XI unchanged, no cloud or auth changes.');
async function verifyBrowser(){
 const {chromium}=require('playwright'),mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
 const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent((req.url||'/').split('?')[0]),file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:840}}),errors=[],missing=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))missing.push(r.status()+': '+r.url());});
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:'))external.push(r.url());});
  await page.goto('http://127.0.0.1:'+server.address().port+'/portal/unit-06-figure-verification-v91.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#load-status')?.textContent.includes('Six original held MCQs loaded'));
  assert.equal(await page.locator('article.question').count(),6);
  assert.equal(await page.locator('.question .option').count(),24);
  assert.equal(await page.locator('.question details').count(),6);
  assert.equal(await page.locator('.question input[type=checkbox]').count(),18);
  assert.equal(await page.locator('.question textarea').count(),6);
  assert.equal(await page.locator('.question select').count(),6);
  assert.equal(await page.locator('.question .source-key').count(),6);
  const first=page.locator('article.question').first();
  assert.match(await first.locator('.qid').textContent(),/XI-U06-T61-MCQ-0011/);
  assert.match(await first.locator('.stem').textContent(),/cylinder in Fig\. 6\.2/i);
  await first.locator('select').selectOption('candidate-signoff');
  assert.equal(await first.locator('select').inputValue(),'keep-held','No candidate status without printed source checklist and evidence');
  assert.match(await first.locator('.indicator').textContent(),/kept on HOLD/i);
  const checks=first.locator('input[type=checkbox]');for(let i=0;i<3;i++)await checks.nth(i).check();
  await first.locator('textarea').fill('Synthetic browser-QA demonstration only; NOT a real visual signoff of the printed NBF figure.');
  await first.locator('select').selectOption('candidate-signoff');
  assert.equal(await first.locator('select').inputValue(),'candidate-signoff');
  const report=await page.locator('#review-summary').textContent();
  assert.match(report,/1 candidates for separate teacher signoff/);
  assert.match(report,/Public question status: STILL HELD/);
  assert.equal((report.match(/Public question status: STILL HELD/g)||[]).length,6);
  assert.match(report,/XI-U06-T62-MCQ-0064/);
  assert.match(report,/XI-U06-T63-MCQ-0080/);
  await page.context().grantPermissions(['clipboard-read','clipboard-write']);
  await page.locator('#copy-record').click();
  await page.waitForFunction(()=>/copied locally|blocked/i.test(document.querySelector('#copy-status')?.textContent||''),{timeout:10000});
  assert.match(await page.locator('#copy-status').textContent(),/copied locally|blocked/i);
  await page.setViewportSize({width:390,height:844});
  const dimensions=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dimensions.scroll<=dimensions.viewport+2,'390px horizontal overflow: '+JSON.stringify(dimensions));
  const out=path.join(root,'qa-artifacts','unit06-review-v91');fs.mkdirSync(out,{recursive:true});
  await page.screenshot({path:path.join(out,'unit06-six-held-review-desk-390px.png'),fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert.deepEqual(external,[]);
  console.log('V91 CHROMIUM PASS — all 6 source MCQs and 24 options loaded; candidate gate, review text, clipboard action, 390px mobile, no third-party calls.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
verifyBrowser().catch(err=>{console.error('V91 QA FAILURE',err);process.exitCode=1;});
