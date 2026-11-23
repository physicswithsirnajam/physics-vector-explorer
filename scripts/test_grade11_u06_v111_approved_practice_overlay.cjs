#!/usr/bin/env node
'use strict';
/* V111: owner-authorized practice fixes only; original V82 bank, historical audits
 * and all official FBISE/item certification locks remain unchanged. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),vm=require('node:vm');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/unit6-v111-practice-overlay');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const file='question-bank/grade-11/unit-06-topic-64-v82-80-source.json',overlayFile='question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json';
const raw=read(file),src=JSON.parse(raw),over=json(overlayFile);
const numbers=[28,51,52,67],blocked=numbers.slice(1).map(n=>'XI-U06-T64-MCQ-'+String(n).padStart(4,'0'));
let gates=0;function pass(s){gates++;console.log('V111 PASS:',s)}
const gitBlobSha=buf=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(buf)+'\0').update(buf).digest('hex');
function makeContext(fetchFn){
 const sandbox={fetch:fetchFn||(async url=>{
  const p=String(url);assert.ok(p.startsWith('question-bank/grade-11/')||p.startsWith('../question-bank/grade-11/'),'Unexpected fetch '+p);
  const filepath=p.replace(/^\.\.\//,'');
  if(!fs.existsSync(path.join(root,filepath)))return {ok:false,status:404};
  return {ok:true,status:200,json:async()=>json(filepath),text:async()=>read(filepath)};
 })};
 vm.createContext(sandbox);vm.runInContext(read('shared/practice-bank-adapter-v55.js'),sandbox,{filename:'practice-bank-adapter-v55.js'});
 return sandbox;
}
async function sourceChecks(){
 assert.equal(gitBlobSha(raw),'c832e1e0e71773a23e5364e8f065c6b520f7f5e6');
 assert.equal(over.sourceBankBlobSha,gitBlobSha(raw));
 assert.equal(src.questions.length,80);assert.equal(over.replacements.length,4);
 assert.deepEqual(over.blockedOriginalIds,blocked);
 assert.equal(over.sourceArchivedUnchanged,true);
 assert.equal(over.releaseState,'provisional-self-practice-only');
 for(let i=0;i<4;i++){
  const q=src.questions[numbers[i]-1],r=over.replacements[i];
  assert.equal(q.id,r.originalId);
  assert.equal(q.stem,r.originalStem);
  assert.equal(q.options[1].text,r.originalOptionB);
  assert.equal(q.correctOptionId,r.correctOptionId);
  assert.equal(r.boardEligible,false);
  assert.equal(r.individualSloCertified,false);
  assert.equal(r.individualCognitiveCertified,false);
  assert.equal(r.teacherAuthorization,'explicit-narrow-treatment-approval-2026-11-23');
  assert.ok(r.explanation.length>60);
 }
 assert.equal(src.questions[27].options[1].text,'Its speed increases while approximately the same water volume passes each level per');
 pass('original 80 question source byte-identical, teacher-authorized V111 overlay separate and explicitly provisional');
 const x=makeContext(),fn=x.PSNPracticeBankV55.applyUnit6Topic64PracticeOverlay;
 assert.equal(typeof fn,'function');
 const preview=JSON.parse(JSON.stringify(fn(src.questions,over)));
 assert.equal(preview.length,80);assert.equal(new Set(preview.map(q=>q.id)).size,80);
 for(const id of blocked)assert.equal(preview.some(q=>q.id===id),false,'Unqualified original served: '+id);
 for(let i=0;i<4;i++){
  const q=preview[numbers[i]-1],r=over.replacements[i];
  assert.equal(q.id,r.practiceId);assert.equal(q.stem,r.proposedStem);
  assert.deepEqual(q.options,r.proposedOptions);
  assert.equal(q.correctOptionId,r.correctOptionId);
  assert.equal(q.sourceOriginalId,r.originalId);
  assert.equal(q.practiceOverlayVersion,'V111');
  assert.equal(q.boardEligible,false);assert.deepEqual(q.sloCodes,[]);
  assert.equal(q.cognitiveLevel,'Unspecified');assert.equal(q.active,true);
  assert.equal(q.status,'provisional-public-self-practice');
 }
 assert.ok(preview[27].options[1].text.endsWith('per second'));
 assert.ok([51,52,67].every(n=>preview[n-1].stem.includes('equal volume flow')));
 assert.deepEqual([28,51,52,67].map(n=>preview[n-1].correctOptionId),['B','A','D','A']);
 pass('exact student-facing Q28 option and three separately identified equal-flow variants; no ambiguous originals or fake SLO approval');
 const unit=JSON.parse(JSON.stringify(await x.PSNPracticeBankV55.loadBank(6,'question-bank/grade-11/')));
 assert.equal(unit.questions.length,560);
 assert.equal(unit.bankVersion,'v114-topic64-v111-and-topic65-three-clarified-560-provisional');
 assert.equal(unit.questions.filter(q=>q.situationBased).length,136);
 assert.equal(unit.questions.filter(q=>q.practiceOverlayVersion==='V111').length,4);
 for(const id of blocked)assert.equal(unit.questions.some(q=>q.id===id),false);
 assert.equal(unit.questions.every(q=>q.boardEligible===false),true);
 pass('central Test Builder adapter loads 560 non-certified MCQs with all four safe substitutions');
 const noOverlay=makeContext(async url=>{
  const p=String(url).replace(/^\.\.\//,'');
  if(p===overlayFile)return {ok:false,status:404};
  return {ok:true,status:200,json:async()=>json(p),text:async()=>read(p)};
 });
 await assert.rejects(noOverlay.PSNPracticeBankV55.loadBank(6,'question-bank/grade-11/'),/overlay unavailable/i);
 const tampered=JSON.parse(JSON.stringify(over));tampered.replacements[1].proposedStem=src.questions[50].stem;
 assert.throws(()=>fn(src.questions,tampered),/equal-flow assumption/i);
 const fakeCert=JSON.parse(JSON.stringify(over));fakeCert.replacements[3].boardEligible=true;
 assert.throws(()=>fn(src.questions,fakeCert),/boundary failed/i);
 pass('fail closed on missing overlay, missing equal-flow assumption and forged exam certification');
 const ledger=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
 assert.equal(ledger.length,561);
 const heads=ledger[0].split(',');
 for(const line of ledger.slice(1)){
  const cells=line.split(',');
  for(const h of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(cells[heads.indexOf(h)],'PENDING');
 }
 const signoff=json('quality/grade11-unit06-v94d-signoff-matrix.json');
 const course=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(signoff.releaseApproved,false);assert.equal(signoff.teacherSignoff,'pending');
 assert.equal(course.status,'planned');assert.equal(course.assessmentStatus,'not-published');
 const expectedSites=[
 'portal/unit-06-topic-64-preview.js','portal/unit-06-balanced-mcq-v95c1.js','shared/practice-bank-adapter-v55.js'
 ];
 for(const p of expectedSites){
  assert.ok(read(p).includes('applyUnit6Topic64PracticeOverlay'),'Missing safety application at '+p);
 }
 for(const p of ['portal/unit-06-topic-64-preview.html','portal/unit-06-balanced-mcq-v95c1.html','practice-engine/index.html','build-your-physics-test.html'])
  assert.ok(read(p).includes('practice-bank-adapter-v55.js?v='+(p.includes('topic-64-preview')?'111':'114')),
    'Missing cache-busted versioned safety adapter at '+p);
 pass('all original academic signoffs and release locks remain pending; all four practice entrypoints use V111');
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 try{
  const u=new URL(req.url,'http://localhost');
  let f=path.resolve(root,'.'+decodeURIComponent(u.pathname));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end('Not found');return}
  if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.statSync(f).isFile()){res.writeHead(404);res.end('Not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch{res.writeHead(404);res.end('Not found')}
});
async function browserChecks(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const base='http://127.0.0.1:'+server.address().port;
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:820},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   page.on('dialog',d=>d.accept());
   try{
    const response=await page.goto(base+'/portal/unit-06-topic-64-preview.html',{waitUntil:'load'});
    assert.equal(response.status(),200);
    await page.waitForFunction(()=>document.querySelector('#load-status')?.textContent.includes('80 questions available'));
    assert.equal(await page.locator('#begin').isEnabled(),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'Topic preview overflow '+width);
    if(width===390){
     await page.locator('#size').selectOption('all');await page.locator('#begin').click();
     await page.locator('#finish').click();
     await page.locator('#results').waitFor({state:'visible'});
     assert.equal(await page.locator('#review article').count(),80);
     const review=await page.locator('#review').innerText();
     for(const t of ['each level per second','with equal volume flow rate through both branches','with equal volume flow through each artery','with equal volume flow rate through each branch'])assert.ok(review.includes(t),'Missing revised MCQ in real rendered practice: '+t);
     assert.ok(review.includes('clarified variant of source Q51')&&review.includes('clarified variant of source Q67'));
     await page.screenshot({path:path.join(out,'topic64-review390.png'),fullPage:true});
    }else await page.screenshot({path:path.join(out,'topic64-loaded-'+width+'.png'),fullPage:true});
    assert.deepEqual(errors,[],'Topic page JavaScript errors '+width);
   }finally{await page.close()}
  }
  pass('real Chromium 1280/390/320 Topic 6.4 practice: all 80 review rows include Q28 repair and Q51/52/67 clarified versions');
  const balanced=await browser.newPage({viewport:{width:390,height:840}});
  try{
   const response=await balanced.goto(base+'/portal/unit-06-balanced-mcq-v95c1.html',{waitUntil:'load'});assert.equal(response.status(),200);
   await balanced.waitForFunction(()=>document.getElementById('start')?.disabled===false,null,{timeout:20000});
   assert.ok((await balanced.locator('#status').innerText()).includes('V111 Topic 6.4 practice corrections'));
   await balanced.locator('#per-topic').selectOption('4');
   await balanced.locator('#start').click();
   assert.equal(await balanced.locator('#quiz-panel').isVisible(),true);
   assert.equal(await balanced.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
  }finally{await balanced.close()}
  pass('real seven-topic balanced quiz loads V111 corrections without disabling the existing 28-item practice');
  const central=await browser.newPage({viewport:{width:1180,height:830}});
  try{
   await central.goto(base+'/practice-engine/index.html?unit=6&count=10',{waitUntil:'load'});
   const audit=await central.evaluate(async()=>{
    const result=await window.PSNPracticeBankV55.loadBank(6,'../question-bank/grade-11/');
    return {total:result.questions.length,fixes:result.questions.filter(q=>q.practiceOverlayVersion==='V111').map(q=>({id:q.id,sourceId:q.sourceOriginalId,boardEligible:q.boardEligible})),ambiguous:result.questions.some(q=>['XI-U06-T64-MCQ-0051','XI-U06-T64-MCQ-0052','XI-U06-T64-MCQ-0067'].includes(q.id))};
   });
   assert.equal(audit.total,560);assert.equal(audit.fixes.length,4);assert.equal(audit.ambiguous,false);
   assert.ok(audit.fixes.every(q=>q.boardEligible===false));
  }finally{await central.close()}
  pass('real central Practice Engine uses same V111 560-item safe pool, preserving original source history');
  const missing=await browser.newPage({viewport:{width:390,height:800}});
  try{
   await missing.route('**/unit-06-topic64-v111-approved-practice-overlay.json',route=>route.fulfill({status:404,body:'not found'}));
   await missing.goto(base+'/portal/unit-06-topic-64-preview.html',{waitUntil:'load'});
   await missing.waitForFunction(()=>document.getElementById('load-status')?.textContent.includes('disabled'));
   assert.equal(await missing.locator('#begin').isDisabled(),true);
  }finally{await missing.close()}
  pass('browser fail-closed: missing V111 overlay disables Topic 6.4 practice instead of serving under-specified originals');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});await sourceChecks();await browserChecks();
 fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({version:'V111',gates,sourceBankUnchanged:true,unit6AvailablePractice:560,correctedPracticeItems:4,originalAmbiguousItemsServed:0,academicApprovalsGranted:0,examReleased:false},null,2)+'\n');
 console.log('V111 COMPLETE',gates,'QA groups');
})().catch(e=>{console.error('V111 FAILED',e?.stack||e);process.exitCode=1;try{server.close()}catch{}});
