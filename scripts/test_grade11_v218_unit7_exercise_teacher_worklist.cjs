#!/usr/bin/env node
'use strict';
/* V218: source-verified, keyless review priorities. Approval backend is NOT deployed.
 * No private question stem, answer key, figure or student scoring may be introduced.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const index=json('quality/unit07/unit07-v218-34-original-exercises-teacher-worklist-no-keys.json');
const v178=json('quality/unit07/unit07-v178-consolidated-274-teacher-approval-index-no-keys.json');
const v195=json('quality/unit07/unit07-v195-unsigned-independent-teacher-review-no-keys.json');
const catalog=json('portal/learning-catalog.json');
const manifest=json('question-bank/manifest.json');
const worklist=read('portal/unit-07-original-exercise-teacher-worklist-v218.html');
const directory=read('portal/textbook-exercise-status-v216.html');
const out=path.join(ROOT,'qa-artifacts/grade11-v218-unit07-exercise-teacher-worklist');
const sources=[
 {kind:'mcq',count:10,path:'quality/unit07/unit07-v174-end-exercise-mcq01-10-fig-bound-no-keys.json',key:'sourceBoundItems'},
 {kind:'short',count:11,path:'quality/unit07/unit07-v175-end-exercise-short01-11-image-bound-no-answers.json',key:'items'},
 {kind:'comprehensive',count:8,path:'quality/unit07/unit07-v176-end-exercise-comprehensive01-08-image-bound-no-answers.json',key:'items'},
 {kind:'numerical',count:5,path:'quality/unit07/unit07-v177-end-exercise-numerical01-05-image-bound-no-keys.json',key:'items'}
];
const derivePriority=x=>{
 const flag=x.changeNeeded??x.reviewFlag??x.teacherReviewPriority??'none';
 if(String(flag).startsWith('compulsory'))return 'compulsory';
 if(String(flag).startsWith('optional'))return 'optional';
 if(flag==='none')return 'ordinary';
 throw Error('Unsupported academic flag '+flag);
};
function sourceAudit(){
 assert.equal(index.schemaVersion,1);
 assert.equal(index.version,'V218');
 assert.equal(index.asOfDate,'2026-11-27');
 assert.equal(index.snapshotNotLive,true);
 assert.equal(index.items.length,34);
 assert.deepEqual(index.counts,{originalExercises:34,mcq:10,short:11,
  comprehensive:8,numerical:5,compulsory:20,optional:8,ordinary:6});
 assert.equal(index.notAnAnswerKey,true);
 assert.equal(index.noSourceStemsOrFigures,true);
 assert.equal(index.teacherDecisionBackendDeployed,false);
 assert.equal(index.release.teacherScienceApprovals,0);
 assert.equal(index.release.teacherCognitiveApprovals,0);
 assert.equal(index.release.ownerScoredApproval,0);
 assert.equal(index.release.studentScoredUnit7Mcqs,0);
 let total=0;
 for(const set of sources){
  const ledger=json(set.path);
  const original=ledger[set.key];
  assert.equal(original.length,set.count,'Original NBF exercise count changed for '+set.kind);
  const records=index.items.filter(x=>x.kind===set.kind);
  assert.equal(records.length,set.count,'Teacher index section count drift '+set.kind);
  assert.deepEqual(records.map(x=>x.question_number),
   Array.from({length:set.count},(_,i)=>i+1),'Original item order drift '+set.kind);
  for(const row of records){
   const x=original.find(item=>item.sourceQuestionNumber===row.question_number);
   assert.ok(x,'Original source missing '+row.id);
   assert.equal(row.id,'U07-'+set.kind.toUpperCase()+'-'+String(row.question_number).padStart(2,'0'));
   assert.equal(row.priority,derivePriority(x),'Review priority sourced from original record');
   assert.equal(row.original_review_flag,x.changeNeeded??x.reviewFlag??x.teacherReviewPriority??'none');
   assert.equal(row.issue_code,x.issueCategory||x.reviewCategory||'none');
   assert.equal(row.nearest_slo,x.nearestFBISETheorySlo||x.nearestOfficialTheorySlo||
    x.closestSummativeTheorySlo||x.nearestOfficialSummativeSlo);
   assert.equal(row.printed_page,x.sourcePrintedPage||ledger.originalPrintedPage||125);
   assert.equal(row.sourceRegionSha256,x.renderedQuestionRgbPixelSha256||
    x.renderedSourceCropRgbSha256||x.uploadedPageCropRgbSha256);
   assert.match(row.sourceRegionSha256,/^[0-9a-f]{64}$/);
   assert.equal(row.science,'PENDING');
   assert.equal(row.cognitive,'PENDING');
   assert.equal(row.release,'HOLD');
   assert.equal(row.source_ledger,set.path);
   assert.equal((worklist.match(new RegExp('data-item="'+row.id+'"','g'))||[]).length,1);
   assert.ok(worklist.includes('data-item="'+row.id+'" data-priority="'+row.priority+'"'));
   total++;
  }
 }
 assert.equal(total,34);
 assert.equal(index.items.filter(x=>x.priority==='compulsory').length,20);
 assert.equal(index.items.filter(x=>x.priority==='optional').length,8);
 assert.equal(index.items.filter(x=>x.priority==='ordinary').length,6);
 assert.equal(v178.totalOriginalItems,274);
 assert.equal(v178.originalTextbookExerciseItems,34);
 assert.equal(v178.teacherScienceApprovals,0);
 assert.equal(v178.teacherCognitiveApprovals,0);
 assert.equal(v178.scoredUnit7PortalQuestions,0);
 assert.deepEqual(v195.numericalReview.filter(x=>x.disposition==='COMPULSORY_REVIEW').map(x=>x.n),
  [1,3,4,5]);
 assert.equal(v195.unit7StudentScoredQuestions,0);
 const u7=catalog.grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
 assert.equal(catalog.resources.length,59);
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),
  [275,206,220,640,349,560]);
 for(const term of ['34 Original Textbook Exercise Items','Compulsory-priority decisions',
   'All 34 entries were first-pass reviewed','Teacher signoff pending',
   'no original stems, publisher figures, keyed MCQ letters or full solutions',
   'none has an authenticated independent teacher science or cognitive approval']){
   assert.ok(worklist.toLowerCase().includes(term.toLowerCase()),'Required note missing '+term);
 }
 for(const forbidden of ['<form','<input','firestore','initializeAppCheck','getAuth(','studentUid',
    'reviewerUid','firebaseConfig','submitApproval','sourceOriginalQuestionAnswerPayload']){
  assert.ok(!worklist.includes(forbidden),'Public reviewer list must not capture or authorize '+forbidden);
 }
 const link='./unit-07-original-exercise-teacher-worklist-v218.html';
 assert.equal(directory.split('href="'+link+'"').length-1,1,
  'Only one approved metadata-only teacher review link should appear in Unit7 directory');
 const unit7=directory.slice(directory.indexOf('id="unit-7" data-unit="7"'));
 assert.ok(unit7.includes('data-kind="mcq-practice" data-state="pending"'));
 assert.ok(unit7.includes('No Unit 7 scored question bank is published.'));
 assert.ok(!directory.includes('href="./unit-07-original-exercise-teacher-worklist-v218.html" data-scored-release="true"'));
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const u=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const f=path.resolve(ROOT,'.'+u);
  if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
 }catch{res.writeHead(400);res.end('Invalid request')}
});
async function serve(){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function studentAndTeacherJourney(browser,base,width){
 const page=await browser.newPage({viewport:{width,height:850}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  assert.equal((await page.goto(base+'portal/textbook-exercise-status-v216.html?unit=7',
   {waitUntil:'domcontentloaded'})).status(),200);
  const link=page.getByRole('link',{name:/View the 34-item keyless original-exercise teacher review priorities/});
  assert.equal(await link.count(),1);
  await link.click();
  await page.waitForURL(url=>url.pathname==='/portal/unit-07-original-exercise-teacher-worklist-v218.html',
   {timeout:14000});
  assert.equal(await page.locator('tr[data-item]').count(),34);
  assert.equal(await page.locator('tr[data-item]:visible').count(),34);
  assert.equal(await page.locator('.section[data-review-section]').count(),4);
  assert.equal(await page.locator('[data-teacher-status="PENDING"][data-scored-unit7="0"]').count(),1);
  assert.equal(await page.locator('tr[data-teacher-decision="PENDING"][data-release="HOLD"]').count(),34);
  const priority=page.locator('#priority-filter'),section=page.locator('#section-filter');
  await priority.selectOption('compulsory');
  assert.equal(await page.locator('tr[data-item]:visible').count(),20);
  assert.equal(await page.locator('.section:visible').count(),4);
  await section.selectOption('numerical');
  assert.equal(await page.locator('tr[data-item]:visible').count(),4);
  assert.equal(await page.locator('tr[data-item="U07-NUMERICAL-02"]:visible').count(),0);
  await priority.selectOption('ordinary');
  assert.equal(await page.locator('tr[data-item]:visible').count(),1);
  assert.equal(await page.locator('tr[data-item="U07-NUMERICAL-02"]:visible').count(),1);
  await section.selectOption('all');await priority.selectOption('all');
  assert.equal(await page.locator('tr[data-item]:visible').count(),34);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(overflow>3){
   const offenders=await page.evaluate(()=>{
    const viewport=document.documentElement.clientWidth;
    return [...document.querySelectorAll('header, header *, main, main > *, .filters, .filters *, .counters, .counter, .section, .section-head, .table-scroll, table, #psn-global-nav')]
     .map(el=>({tag:el.tagName,selector:el.id||el.className||'',right:Math.round(el.getBoundingClientRect().right),
      left:Math.round(el.getBoundingClientRect().left),scroll:el.scrollWidth,client:el.clientWidth}))
     .filter(x=>x.right>viewport+3||x.left< -3||x.scroll>x.client+5).slice(0,24);
   });
   console.error('V218 320px overflow offender report:',JSON.stringify(offenders));
  }
  assert.ok(overflow<=3,'Outer page horizontal overflow width '+width+': '+overflow);
  assert.deepEqual(errors,[],'Browser JS errors');
  return {width,publicTeacherMetadataOnly:true,rows:34,compulsoryFilter:20,
   numericalCompulsoryFilter:4,numericalOrdinaryFilter:1,teacherApprovals:0,scoredQuestions:0};
 }finally{await page.close()}
}
(async()=>{
 sourceAudit();fs.mkdirSync(out,{recursive:true});const base=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const journeys=[];
  journeys.push(await studentAndTeacherJourney(browser,base,1280));
  journeys.push(await studentAndTeacherJourney(browser,base,390));
  journeys.push(await studentAndTeacherJourney(browser,base,320));
  fs.writeFileSync(path.join(out,'evidence.json'),JSON.stringify({
   version:'V218',asOfDate:'2026-11-27',sourceReviewSet:'V174+V175+V176+V177',
   original34:34,compulsory:20,optional:8,ordinary:6,
   individualScienceApprovals:0,individualCognitiveApprovals:0,studentScoredRelease:0,
   immutableSourceBanks:true,privateQuestionAnswerPayloadPublished:false,journeys
  },null,2)+'\n');
  console.log('V218 PASS: 34 source-indexed keyless Unit7 exercise teacher priorities, 20 compulsory, 8 optional, 6 ordinary, desktop/mobile and zero scored release');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(e=>{console.error('V218 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
