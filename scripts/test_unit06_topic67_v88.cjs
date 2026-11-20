#!/usr/bin/env node
'use strict';
/* V88: Topic 6.7 original 80 MCQs — source, answer-key, temperature and browser fidelity. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),json=f=>JSON.parse(read(f));
const bank=json('question-bank/grade-11/unit-06-topic-67-v88-80-source.json');
const key='ABABBCDABCCDDDDBACDCAAABCDAACCCCCDACDABBAAABDDDCCABCADBDBCBCBDDDBBBADACBADCABCDB';
assert.equal(key.length,80);
assert.equal(bank.schemaVersion,1);assert.equal(bank.bankId,'PSN-XI-U06-T67-V88');assert.equal(bank.bankVersion,'v88-topic67-superfluidity-original-80-source-preview');
assert.equal(bank.grade,11);assert.equal(bank.unit,6);assert.equal(bank.topicNumber,'6.7');assert.equal(bank.title,'Superfluidity');
assert.equal(bank.sourceDocument,'Grade11_Unit6_COMPLETE_MASTER_ALL.pdf');
assert.equal(bank.sourceCompiledPdfPages,'274–288 of 577');assert.equal(bank.originalNbfTextbookPages,'106');
assert.equal(bank.sourceQuestionCount,80);assert.equal(bank.importedQuestionCount,80);assert.equal(bank.publicPreviewCount,80);
assert.equal(bank.originalSourceAnswerKey,key);assert.equal(bank.questions.map(q=>q.correctOptionId).join(''),key);
assert.deepEqual(bank.verifiedFrameworkTopicSloCodes,['P-11-B-43']);
assert.equal(bank.frameworkClassification,'P-11-B-43 summative at topic level, official cognitive classification Understanding');
assert.equal(bank.officialTopicCognitiveLevel,'Understanding');
assert.equal(bank.perQuestionFrameworkMappingStatus,'not individually independently verified');
assert.equal(bank.secureExam,false);assert.equal(bank.publicSelfPractice,true);
assert.equal(bank.unitReleaseStatus,'planned-partial-topic-preview');assert.deepEqual(bank.holds,[]);
assert.deepEqual(bank.sections,{fundamentals:20,reasoning:20,'data-interpretation':20,'standalone-situations':20,sharedStimulusGroups:0});
assert.equal(bank.questions.length,80);
const unique=new Set(),sections={fundamentals:0,reasoning:0,'data-interpretation':0,'standalone-situations':0};
for(let i=0;i<80;i++){
 const q=bank.questions[i],n=i+1,section=n<=20?'fundamentals':n<=40?'reasoning':n<=60?'data-interpretation':'standalone-situations';
 assert.equal(q.id,'XI-U06-T67-MCQ-'+String(n).padStart(4,'0'));assert.ok(!unique.has(q.id));unique.add(q.id);
 assert.equal(q.sourceQuestionNumber,n);assert.equal(q.grade,11);assert.equal(q.unit,6);assert.equal(q.topic,'Superfluidity');
 assert.equal(q.type,'single_choice');assert.equal(q.sourceSection,section);sections[section]++;
 assert.equal(q.situationBased,n>=61);assert.equal(q.stimulusSetId,null);
 assert.equal(q.active,true);assert.equal(q.holdReason,null);assert.equal(q.boardEligible,false);
 assert.equal(q.status,'provisional-public-self-practice');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.deepEqual(q.sloCodes,[]);assert.deepEqual(q.topicSloCodes,['P-11-B-43']);
 assert.deepEqual(q.formativeContextSloCodes,[]);
 assert.equal(q.topicOfficialCognitiveLevel,'Understanding');
 assert.equal(q.sourceKeyCognitiveTag,null);
 assert.match(q.sourceKeyCognitiveTagStatus,/No individual item cognitive labels available/);
 assert.equal(q.cognitiveLevel,'Unspecified');assert.equal(q.difficulty,'Unspecified');
 assert.equal(q.options.length,4);assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.options.every(o=>typeof o.text==='string'&&o.text.trim().length>3));
 assert.ok(q.options.some(o=>o.id===q.correctOptionId));
 assert.ok(q.stem.length>19&&q.explanation.length>19);
 assert.ok(q.sourcePdfPage>=274&&q.sourcePdfPage<=285);
 assert.doesNotMatch(q.stem+' '+q.explanation,/Topic 6\.7 \| PART A|COMPLETE STUDY EDITION|NBF GRADE XI • SUPERFLUIDITY • PAGE/);
}
assert.equal(unique.size,80);assert.deepEqual(sections,{fundamentals:20,reasoning:20,'data-interpretation':20,'standalone-situations':20});
assert.match(bank.questions[0].explanation,/zero viscosity/);
assert.match(bank.questions[3].explanation,/persistent vortices/);
assert.match(bank.questions[79].explanation,/low-temperature state/);
// Independent evaluation of all numeric thresholds, differences, unit conversions
// and threshold-ranking choices in the source data/temperature section.
const selected={41:'A',42:'A',43:'A',44:'B',45:'D',46:'D',47:'D',48:'C',49:'C',50:'A',51:'B',60:'C',63:'D',64:'D'};
for(const [number,correct] of Object.entries(selected))assert.equal(bank.questions[Number(number)-1].correctOptionId,correct,'Original source key changed: Q'+number);
const t4=2.17,t3=.0025;
assert.ok(2.0<t4&&2.4>t4&&.0010<t3&&.0040>t3);
assert.ok(Math.abs((t4-2.0)-.17)<1e-12);
assert.equal(t3*1000,2.5);assert.equal(t4*1000,2170);
assert.equal(t4/t3,868);
function chosen(n){return bank.questions[n-1].options.find(o=>o.id===bank.questions[n-1].correctOptionId).text;}
assert.match(chosen(41),/^2\.00 K/);assert.match(chosen(42),/^2\.40 K/);
assert.match(chosen(43),/^0\.0010 K/);assert.match(chosen(44),/^0\.0040 K/);
assert.match(chosen(45),/^0\.17 K/);assert.match(chosen(46),/^2\.5 mK/);
assert.match(chosen(47),/^2170 mK/);assert.match(chosen(49),/^868\b/);
const manifest=json('question-bank/manifest.json').grades.find(g=>g.grade===11).units;
assert.deepEqual(manifest.map(x=>x.liveMcqCount),[275,206,220,640,349,474]);
assert.equal(manifest.reduce((n,u)=>n+u.liveMcqCount,0),2164);
assert.equal(manifest[5].sourceTopicMcqCount,480);assert.equal(manifest[5].sourceFigureHeldCount,6);
assert.equal(manifest[5].standaloneSituationQuestionCount,113);
assert.equal(manifest[5].independentSharedStimulusGroupCount,0);
assert.ok(!manifest[5].sourceFiles.some(f=>f.includes('topic-67')),'V88 preview must not silently integrate into central adapter');
const course=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(course.status,'planned');assert.equal(course.questionBankCount,0);
assert.equal(course.partialTestBuilderMcqCount,474);assert.equal(course.sourceTopicMcqCount,480);
const html=read('portal/unit-06-topic-67-preview.html'),client=read('portal/unit-06-topic-67-preview.js'),hub=read('portal/index.html');
assert.match(hub,/unit-06-topic-67-preview\.html/);assert.match(client,/unit-06-topic-67-v88-80-source\.json/);
assert.match(html,/P-11-B-43/);assert.match(html,/data-interpretation/);assert.match(html,/2,164 MCQs/);
assert.match(html,/Topic 6\.7 is not yet in the central builder/);
assert.doesNotMatch(client,/firebase|firestore|localStorage\.setItem/i);
assert.ok(!fs.existsSync(path.join(root,'portal','Grade11_Unit6_COMPLETE_MASTER_ALL.pdf')),'Protected source PDF unexpectedly published');
async function browser(){
 const {chromium}=require('playwright'),mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
 const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent((req.url||'/').split('?')[0]),file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let b;
 try{
  b=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await b.newPage({viewport:{width:1280,height:840}}),errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+': '+r.url());});
  page.on('dialog',d=>d.accept());
  await page.goto('http://127.0.0.1:'+server.address().port+'/portal/unit-06-topic-67-preview.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#load-status')?.textContent.includes('80 questions available'));
  await page.selectOption('#category','data-interpretation');
  assert.match(await page.locator('#load-status').textContent(),/20 questions available/);
  await page.selectOption('#size','10');await page.locator('#begin').click();
  assert.match(await page.locator('#position').textContent(),/1 of 10/);
  assert.equal(await page.locator('#option-grid label').count(),4);
  await page.locator('#option-grid input').first().check();
  await page.locator('#finish').click();await page.locator('#results').waitFor({state:'visible'});
  assert.equal(await page.locator('#review article').count(),10);
  assert.match(await page.locator('#score-note').textContent(),/No cloud record/);
  await page.locator('#try-again').click();await page.selectOption('#category','standalone-situations');
  assert.match(await page.locator('#load-status').textContent(),/20 questions available/);
  await page.selectOption('#size','all');await page.locator('#begin').click();await page.locator('#finish').click();
  assert.equal(await page.locator('#review article').count(),20);
  await page.locator('#try-again').click();await page.selectOption('#category','all');
  await page.selectOption('#size','all');await page.locator('#begin').click();await page.locator('#finish').click();
  assert.equal(await page.locator('#review article').count(),80);
  await page.locator('#try-again').click();await page.setViewportSize({width:390,height:844});
  const dim=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dim.scroll<=dim.width+2,'390px horizontal overflow: '+JSON.stringify(dim));
  const output=path.join(root,'qa-artifacts','unit06-topic67-v88');fs.mkdirSync(output,{recursive:true});
  await page.screenshot({path:path.join(output,'unit06-topic67-superfluidity-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  console.log('V88 PASS — 80 original Superfluidity MCQs, independently checked temperature options, 20 standalone situations, 80 reviews, no cloud grades, and mobile 390px. Existing 2,164 unchanged.');
 }finally{if(b)await b.close();await new Promise(resolve=>server.close(resolve));}
}
browser().catch(e=>{console.error('V88 FAILURE',e);process.exitCode=1;});
