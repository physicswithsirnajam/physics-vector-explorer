#!/usr/bin/env node
'use strict';
/* V84: Topic6.5 Bernoulli original 80 MCQs and student-only practice. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-65-v84-80-source.json'));
const key='AACCBCDCBACADDBCABADCDDABCDACCADBDDAABDADBDADBACCBBABCBBACADDBBABCCDBDBCBDCACCDA';
assert.equal(key.length,80);
assert.equal(bank.schemaVersion,1);assert.equal(bank.bankId,'PSN-XI-U06-T65-V84');
assert.equal(bank.unit,6);assert.equal(bank.grade,11);assert.equal(bank.topicNumber,'6.5');
assert.equal(bank.title,'Bernoulli’s Equation');assert.equal(bank.sourceQuestionCount,80);
assert.equal(bank.importedQuestionCount,80);assert.equal(bank.publicPreviewCount,80);
assert.equal(bank.originalSourceAnswerKey,key);assert.equal(bank.questions.map(q=>q.correctOptionId).join(''),key);
assert.equal(bank.questions.length,80);
assert.deepEqual(bank.verifiedFrameworkTopicSloCodes,['P-11-B-40']);
assert.deepEqual(bank.formativeContextSloCodes,['P-11-B-39']);
assert.equal(bank.perQuestionFrameworkMappingStatus,'not individually verified');
assert.equal(bank.secureExam,false);assert.equal(bank.publicSelfPractice,true);
assert.equal(bank.unitReleaseStatus,'planned-partial-topic-preview');
assert.deepEqual(bank.holds,[]);
assert.deepEqual(bank.sections,{fundamentals:20,reasoning:20,numericals:20,'standalone-situations':20,sharedStimulusGroups:0});
const labels={K:0,U:0,A:0},ids=new Set();
for(let i=0;i<80;i++){
 const q=bank.questions[i],n=i+1;
 assert.equal(q.id,'XI-U06-T65-MCQ-'+String(n).padStart(4,'0'));
 assert.ok(!ids.has(q.id));ids.add(q.id);
 assert.equal(q.sourceQuestionNumber,n);assert.equal(q.grade,11);assert.equal(q.unit,6);
 assert.equal(q.topic,'Bernoulli’s Equation');assert.equal(q.type,'single_choice');
 assert.equal(q.sourceSection,n<=20?'fundamentals':n<=40?'reasoning':n<=60?'numericals':'standalone-situations');
 assert.equal(q.situationBased,n>=61);
 assert.equal(q.stimulusSetId,null);
 assert.equal(q.active,true);assert.equal(q.holdReason,null);assert.equal(q.status,'provisional-public-self-practice');
 assert.equal(q.boardEligible,false);assert.deepEqual(q.sloCodes,[]);
 assert.deepEqual(q.topicSloCodes,['P-11-B-40']);assert.deepEqual(q.formativeContextSloCodes,['P-11-B-39']);
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(q.cognitiveLevel,'Unspecified');assert.equal(q.difficulty,'Unspecified');
 assert.ok(Object.hasOwn(labels,q.sourceKeyCognitiveTag));labels[q.sourceKeyCognitiveTag]++;
 assert.match(q.sourceKeyCognitiveTagStatus,/not independently board-certified/);
 assert.equal(q.options.length,4);assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.options.every(o=>o.text.trim().length>0));
 assert.ok(q.options.some(o=>o.id===q.correctOptionId));
 assert.ok(q.stem.length>20&&q.explanation.length>19);
 assert.ok(q.sourcePdfPage>=183&&q.sourcePdfPage<=193);
 assert.doesNotMatch(q.stem+' '+q.explanation,/TOPIC 6\.5 \| PART A|Page \d+|EXAMINER|GRADE XI PHYSICS \| UNIT 6/);
}
assert.deepEqual(labels,{K:10,U:26,A:44});
assert.deepEqual(bank.sourceCognitiveTagCounts,labels);
assert.equal(ids.size,80);
assert.match(bank.questions[2].explanation,/potential energy density add to a constant/);
assert.match(bank.questions[13].explanation,/Outlet pressure acts opposite/);
assert.match(bank.questions[31].explanation,/extended energy balance/);
assert.match(bank.questions[78].explanation,/pressure work to kinetic and potential energies/);
// Independently derive each Q41-60 correct-option number and verify original key
// on the student-visible supplied values without modifying any source record.
const numericAnswers={
 41:104,42:82,43:186,44:151,45:12500,46:40000,47:29400,48:6.63,
 49:24,50:5.29,51:1.1,52:0.4,53:19.6,54:20000,55:8,56:50,57:160,58:0.30,59:8000,60:6
};
function numericText(q){
 const chosen=q.options.find(o=>o.id===q.correctOptionId).text;
 const match=chosen.match(/^\s*([0-9]+(?:\s+[0-9]{3})*(?:\.[0-9]+)?)/);
 assert.ok(match,'Cannot parse original Q'+q.sourceQuestionNumber+' option: '+chosen);
 return Number(match[1].replace(/\s/g,''));
}
for(const [str,correct] of Object.entries(numericAnswers)){
 const n=Number(str),actual=numericText(bank.questions[n-1]);
 assert.ok(Math.abs(actual-correct)<=Math.max(0.01,correct*1e-5),'Numerical original answer Q'+n+' = '+actual+' != '+correct);
}
const manifest=JSON.parse(read('question-bank/manifest.json')).grades.find(g=>g.grade===11).units;
assert.deepEqual(manifest.map(u=>u.liveMcqCount),[275,206,220,640,349,394]);
assert.equal(manifest.reduce((s,u)=>s+u.liveMcqCount,0),2084);
assert.equal(manifest[5].sourceTopicMcqCount,400);
assert.equal(manifest[5].sourceFigureHeldCount,6);
assert.equal(manifest[5].independentSharedStimulusGroupCount,0);
const course=JSON.parse(read('portal/learning-catalog.json')).grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(course.status,'planned');assert.equal(course.questionBankCount,0);assert.equal(course.partialTestBuilderMcqCount,394);
const hub=read('portal/index.html'),client=read('portal/unit-06-topic-65-preview.js'),html=read('portal/unit-06-topic-65-preview.html');
assert.match(hub,/unit-06-topic-65-preview\.html/);assert.match(client,/unit-06-topic-65-v84-80-source\.json/);
assert.match(html,/P-11-B-39 is formative/);assert.match(html,/2,084/);
assert.doesNotMatch(client,/firebase|firestore|localStorage\.setItem/i);
assert.match(read('portal/unit-06-topic-64-preview.html'),/2,084/);
assert.doesNotMatch(read('portal/unit-06-topic-64-preview.html'),/1,924/);
assert.ok(!fs.existsSync(path.join(root,'portal','unit-06.html')));
assert.ok(!fs.existsSync(path.join(root,'portal','Grade11_Unit6_COMPLETE_MASTER_ALL.pdf')));
async function browser(){
 const {chromium}=require('playwright'),mime={'.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
 const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent((req.url||'/').split('?')[0]),local=path.resolve(root,'.'+pathname);
  if(!local.startsWith(root+path.sep)||!fs.existsSync(local)||!fs.statSync(local).isFile()){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(local)]||'application/octet-stream'});res.end(fs.readFileSync(local));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let b;
 try{
  b=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await b.newPage({viewport:{width:1280,height:840}}),errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+': '+r.url())});
  page.on('dialog',d=>d.accept());
  await page.goto('http://127.0.0.1:'+server.address().port+'/portal/unit-06-topic-65-preview.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#load-status')?.textContent.includes('80 questions available'));
  await page.selectOption('#category','numericals');assert.match(await page.locator('#load-status').textContent(),/20 questions available/);
  await page.selectOption('#size','10');await page.locator('#begin').click();
  assert.match(await page.locator('#position').textContent(),/1 of 10/);
  assert.equal(await page.locator('#option-grid label').count(),4);
  await page.locator('#option-grid input').first().check();await page.locator('#finish').click();
  await page.locator('#results').waitFor({state:'visible'});
  assert.equal(await page.locator('#review article').count(),10);
  assert.match(await page.locator('#score-note').textContent(),/No cloud record/);
  await page.locator('#try-again').click();await page.selectOption('#category','all');
  await page.selectOption('#size','all');await page.locator('#begin').click();await page.locator('#finish').click();
  assert.equal(await page.locator('#review article').count(),80);
  await page.locator('#try-again').click();await page.setViewportSize({width:390,height:844});
  const dim=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dim.scroll<=dim.width+2,'Mobile 390px overflow: '+JSON.stringify(dim));
  const output=path.join(root,'qa-artifacts','unit06-topic65-v84');fs.mkdirSync(output,{recursive:true});
  await page.screenshot({path:path.join(output,'unit06-topic65-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  console.log('V84 PASS — 80 original Bernoulli keys, 20 numerical values, 20 independent situations, 2,084 central preserved, 80-question explanation review and 390px mobile.');
 }finally{if(b)await b.close();await new Promise(resolve=>server.close(resolve));}
}
browser().catch(e=>{console.error('FAIL V84',e);process.exitCode=1;});
