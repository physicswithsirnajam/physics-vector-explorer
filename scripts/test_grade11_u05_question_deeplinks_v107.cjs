#!/usr/bin/env node
'use strict';
/* V107: original Unit 5 question-only link anchors; do not load teacher solutions
 * or promote classroom OR pairs as numbered textbook exercises.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/u05-question-deeplinks-v107');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=JSON.parse(read('portal/verified-u05-descriptive-practice-index-v107.json'));
const bank=JSON.parse(read('question-bank/grade-11/unit-05-v52-descriptive-student.json'));
const finder=read('portal/descriptive-answer-finder.html');
const student=read('portal/unit-05-descriptive-student.js');
const original=JSON.parse(read('portal/verified-descriptive-index-v104.json'));
let passed=0;function pass(s){passed++;console.log('V107 PASS:',s)}
function sourceAudit(){
 assert.equal(index.schemaVersion,1);assert.equal(index.grade,11);assert.equal(index.unit,5);
 assert.equal(index.status,'individual-public-question-only-practice-not-textbook-numbering');
 assert.equal(index.entries.length,9);
 assert.equal(original.records.length,64,'V104 solved-response index must not change');
 assert.ok(index.notice.includes('not certified NBF'));
 const questions=[...bank.sectionB,...bank.sectionC];
 assert.equal(questions.length,9);
 assert.equal(new Set(index.entries.map(e=>e.id)).size,9);
 for(let i=0;i<9;i++){
  const e=index.entries[i],q=questions[i],type=q.section==='B'?'short-response':'comprehensive-response';
  assert.equal(e.number,i+1);assert.equal(q.number,i+1);
  assert.equal(e.type,type);assert.equal(e.marks,q.marks);
  assert.equal(e.slo,q.choices[0].sloCode);assert.equal(e.sourcePage,q.choices[0].sourcePage);
  assert.equal(q.choices[1].sloCode,e.slo);
  assert.equal(q.choices[1].sourcePage,e.sourcePage);
  assert.equal(e.href,'./unit-05-descriptive-student.html#u5-q'+e.number);
  assert.equal(e.unit,5);assert.match(e.sourceNote,/not a claim of verbatim textbook/);
  assert.match(e.academicStatus,/Teacher scientific review pending/);
 }
 pass('nine question-pair links exactly match their original source SLOs, pages and marks; no invented exercise numbering');
 assert.match(student,/article\.id="u5-q"\+q\.number/);
 assert.match(student,/scrollToQuestionHash/);
 assert.match(student,/location\.hash/);
 assert.match(student,/requestAnimationFrame/);
 assert.match(finder,/verified-u05-descriptive-practice-index-v107\.json/);
 assert.match(finder,/make\('article','practice-card'\)/);
 assert.match(finder,/question-only/i);
 for(const bad of ['firebaseConfig','initializeAppCheck','localStorage','sessionStorage','indexedDB','sendReport','FIREBASE_APPCHECK_DEBUG_TOKEN'])assert.ok(!finder.includes(bad),'Disallowed backend addition '+bad);
 assert.ok(!student.includes('unit-05-v52-descriptive-teacher.json'),'Student script must never fetch teacher answer key');
 pass('safe, asynchronous deep linking with unchanged V104 response bank, no Firestore, hidden teacher key or student storage');
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'};
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
async function browserAudit(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const base='http://127.0.0.1:'+server.address().port+'/portal/';
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:850}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   try{
    const r=await page.goto(base+'descriptive-answer-finder.html?unit=5',{waitUntil:'load'});
    assert.equal(r.status(),200);
    await page.waitForFunction(()=>document.querySelectorAll('#unit5-practice-index .practice-card').length===9);
    assert.equal(await page.locator('#results .card').count(),0,'Unit 5 practice must not impersonate solved answers');
    assert.equal(await page.locator('#unit5-practice-index .practice-card').count(),9);
    assert.ok((await page.locator('#status').innerText()).includes('9 original Unit 5 question-only'));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'Horizontal overflow '+width);
    assert.deepEqual(errors,[],'Browser errors at '+width);
    await page.screenshot({path:path.join(out,'unit5-questions-'+width+'.png'),fullPage:true});
   }finally{await page.close()}
  }
  pass('live Chromium at 1280px, 390px and 320px displays nine separate question-only cards without overflow');
  const page=await browser.newPage({viewport:{width:390,height:900}});
  try{
   await page.goto(base+'descriptive-answer-finder.html?unit=5&type=comprehensive-response',{waitUntil:'load'});
   await page.waitForFunction(()=>document.querySelectorAll('#unit5-practice-index .practice-card').length===2);
   assert.equal(await page.locator('#unit5-practice-index a[href$="#u5-q8"]').count(),1);
   await page.locator('#unit5-practice-index a[href$="#u5-q8"]').click();
   await page.waitForURL('**/unit-05-descriptive-student.html#u5-q8');
   const target=page.locator('#u5-q8');
   await target.waitFor();
   assert.match(await target.innerText(),/Question 8/);
   assert.equal(await target.locator('.option').count(),2);
   assert.ok(await page.evaluate(()=>document.activeElement?.id==='u5-q8'),'Asynchronous anchor should receive keyboard focus');
   assert.ok((await page.locator('#loadStatus').innerText()).includes('no model answers loaded'));
   await page.goto(base+'descriptive-answer-finder.html?unit=5&type=short-response&q=Q4',{waitUntil:'load'});
   await page.waitForFunction(()=>document.querySelectorAll('#unit5-practice-index .practice-card').length===1);
   assert.match(await page.locator('#unit5-practice-index').innerText(),/Q4/);
   pass('Unit 5 full-page question #8 deep link resolves after asynchronous bank load; type and keyword filters work');
  }finally{await page.close()}
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
}
async function main(){
 fs.mkdirSync(out,{recursive:true});sourceAudit();await browserAudit();
 fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({version:'V107',passed,unit5QuestionOnlyPairs:9,existingAnsweredLinks:64,teacherKeyLoaded:false,sourceExerciseCertification:false,firestoreWrites:false},null,2)+'\n');
 console.log('V107 COMPLETE:',passed,'evidence groups');
}
main().catch(e=>{console.error('V107 FAILED:',e?.stack||String(e));process.exitCode=1;try{server.close()}catch{}});
