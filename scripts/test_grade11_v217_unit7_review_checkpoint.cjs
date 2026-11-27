#!/usr/bin/env node
'use strict';
/* V217 — public keyless Unit7 academic checkpoint linked to real source gates.
 * A source-reviewed identity is never equivalent to an approved answer.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const original=load('quality/unit07/unit07-v178-consolidated-274-teacher-approval-index-no-keys.json');
const teacher=load('quality/unit07/unit07-v195-unsigned-independent-teacher-review-no-keys.json');
const catalog=load('portal/learning-catalog.json');
const manifest=load('question-bank/manifest.json');
const page=read('portal/textbook-exercise-status-v216.html');
const out=path.join(ROOT,'qa-artifacts/grade11-v217-unit7-review-checkpoint');
const sectionId='unit7-teacher-review-checkpoint-v217';
function sourceAudit(){
 assert.equal(original.totalOriginalItems,274);
 assert.equal(original.firstPassReviewedItemCount,274);
 assert.equal(original.sourceSlices.length,7);
 assert.deepEqual(original.sourceSlices.map(s=>s.count),[80,80,80,10,11,8,5]);
 assert.equal(original.sourceSlices.reduce((n,s)=>n+s.count,0),274);
 assert.equal(original.ownerAuthoredMcqItems,240);
 assert.equal(original.originalTextbookExerciseItems,34);
 assert.deepEqual(original.originalTextbookBreakdown,
  {mcq:10,short:11,comprehensive:8,numerical:5});
 assert.equal(original.disjointFirstPassPriorityCensus.compulsory,83);
 assert.equal(original.teacherScienceApprovals,0);
 assert.equal(original.teacherCognitiveApprovals,0);
 assert.equal(original.teacherScoredReleaseApprovals,0);
 assert.equal(original.scoredUnit7PortalQuestions,0);
 assert.equal(teacher.numericalReview.length,5);
 assert.deepEqual(teacher.numericalReview.filter(x=>x.disposition==='COMPULSORY_REVIEW').map(x=>x.n),
  [1,3,4,5]);
 assert.deepEqual(teacher.numericalReview.filter(x=>x.disposition==='CONSISTENT').map(x=>x.n),[2]);
 assert.ok(teacher.numericalReview.every(x=>x.teacherDecision==='PENDING'&&x.scoredStatus==='HOLD'));
 assert.equal(teacher.graphReview.teacherDecision,'PENDING');
 assert.equal(teacher.graphReview.scoredStatus,'HOLD');
 assert.equal(teacher.realAuthenticatedTeacherScienceApprovals,0);
 assert.equal(teacher.realAuthenticatedTeacherCognitiveApprovals,0);
 assert.equal(teacher.ownerStudentScoringApprovals,0);
 assert.equal(teacher.unit7StudentScoredQuestions,0);
 assert.equal(teacher.privateArtifact.committedToPublicRepository,false);
 const grade=catalog.grades.find(g=>g.grade===11).units;
 const u7=grade.find(u=>u.unit===7);
 assert.equal(u7.status,'planned');
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal(catalog.resources.length,59);
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 assert.equal(page.split('id="'+sectionId+'"').length-1,1);
 const start=page.indexOf('id="unit-7" data-unit="7"');
 const end=page.indexOf('</section>',page.indexOf('id="'+sectionId+'"'))+10;
 const unit7=page.slice(start,end);
 assert.ok(unit7.includes('data-snapshot="2026-11-27" data-release-status="hold"'));
 for(const snippet of [
  '240 owner-authored topic MCQs','34 original NBF end-of-unit exercise items',
  '10 MCQs, 11 short responses, 8 comprehensive responses and 5 numericals',
  'All 274 identities have first-pass source/science notes',
  '83 of those 274 items are flagged for compulsory-priority independent review',
  'not</strong> a declaration that 83 answers are incorrect',
  '0 science decisions, 0 cognitive decisions and 0 owner approvals for student scoring',
  'Public scored Unit 7 MCQs: 0',
  '7.1, 7.3, 7.4 and 7.5',
  'Problem 7.2 agrees with its printed numerical hint',
  'Fig. 7.14 force–extension axis orientation',
  'This public status page neither collects those decisions',
  'This statement reflects the source audit available on 27 November 2026'
 ]){
  assert.ok(unit7.includes(snippet),'Missing or inconsistent release warning '+snippet);
 }
 assert.equal((page.match(/data-kind="end-(?:mcq|short|extended|numericals)" data-state="pending"/g)||[]).length,28);
 assert.ok(unit7.includes('data-kind="mcq-practice" data-state="pending"'));
 assert.ok(!unit7.includes('href="./unit-07-mcq'));
 assert.ok(!unit7.includes('<form')&&!unit7.includes('<input'));
 assert.ok(!unit7.includes('privateArtifact.docxSha256'));
 assert.ok(!unit7.includes('sourceOriginalQuestionAnswerPayload'));
 assert.ok(!unit7.includes('full owner-original questions'));
}
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const raw=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const file=path.resolve(ROOT,'.'+raw);
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('Invalid path')}
});
async function serve(){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function browse(browser,base,width,unit){
 const page=await browser.newPage({viewport:{width,height:870}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const res=await page.goto(base+'portal/textbook-exercise-status-v216.html?unit='+unit+'#unit-'+unit,
   {waitUntil:'domcontentloaded'});
  assert.equal(res.status(),200);
  assert.equal(await page.locator('#unit-filter').inputValue(),String(unit));
  assert.equal(await page.locator('.unit-panel:visible').count(),1);
  const checkpoint=page.locator('#'+sectionId);
  assert.equal(await checkpoint.count(),1);
  assert.equal(await checkpoint.getAttribute('data-release-status'),'hold');
  assert.equal(await checkpoint.getAttribute('data-snapshot'),'2026-11-27');
  const visible=unit===7?await checkpoint.isVisible():await checkpoint.isHidden();
  assert.equal(visible,true);
  if(unit===7){
   const actual=await checkpoint.innerText();
   assert.match(actual,/274 inventoried/);
   assert.match(actual,/0 science decisions/);
   assert.match(actual,/83 of those 274 items/);
   assert.ok((await checkpoint.locator('a').count())===0);
   assert.equal(await page.locator('#unit-7 [data-kind="mcq-practice"] a').count(),0);
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Page overflow at '+width+': '+overflow);
  assert.deepEqual(errors,[]);
  return {width,selectedUnit:unit,unit7GateVisible:unit===7,
   teacherScienceApprovals:0,scoredQuestions:0};
 }finally{await page.close()}
}
(async()=>{
 sourceAudit();fs.mkdirSync(out,{recursive:true});
 const base=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const results=[
   await browse(browser,base,1280,7),
   await browse(browser,base,390,7),
   await browse(browser,base,320,6)
  ];
  fs.writeFileSync(path.join(out,'evidence.json'),JSON.stringify({
   version:'V217',source:'V178 source inventory + V195 unsigned decision register',
   date:'2026-11-27',originalItems:274,topicMcqs:240,textbookExercises:34,
   compulsoryPriorityQueue:83,numericalCompulsoryReview:[1,3,4,5],
   teacherScienceApprovals:0,teacherCognitiveApprovals:0,studentScoredQuestions:0,
   originalSourcePayloadPublished:false,results
  },null,2)+'\n');
  console.log('V217 PASS: sourced 274-item Unit7 review status, 83 review priorities, 0 teacher approvals and 0 scored releases; desktop/mobile.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(e=>{console.error('V217 FAILED:',e.stack||e);process.exitCode=1;
 try{server.close()}catch{}
});
