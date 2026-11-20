#!/usr/bin/env node
'use strict';
/* V86 source and student preview audit; no production exam or cloud-grade writes. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const read=loc=>fs.readFileSync(path.join(root,loc),'utf8');
const bank=JSON.parse(read('question-bank/grade-11/unit-06-topic-66-v86-80-source.json'));
const key='BBCCACCCBCACBADDCBCCDCADDBBBDDDBCCDBBDBAABCDACBDBDADABBDCBAAACAAADABDAADCAABCDCD';
assert.equal(key.length,80);
assert.equal(bank.schemaVersion,1);assert.equal(bank.bankId,'PSN-XI-U06-T66-V86');
assert.equal(bank.grade,11);assert.equal(bank.unit,6);assert.equal(bank.topicNumber,'6.6');
assert.equal(bank.title,'Applications of Bernoulli’s Equation');
assert.equal(bank.sourceQuestionCount,80);assert.equal(bank.importedQuestionCount,80);assert.equal(bank.publicPreviewCount,80);
assert.equal(bank.originalSourceAnswerKey,key);
assert.equal(bank.questions.map(q=>q.correctOptionId).join(''),key);
assert.deepEqual(bank.verifiedFrameworkTopicSloCodes,['P-11-B-40','P-11-B-44']);
assert.deepEqual(bank.formativeContextSloCodes,['P-11-B-39']);
assert.equal(bank.perQuestionFrameworkMappingStatus,'not individually independently verified');
assert.equal(bank.secureExam,false);assert.equal(bank.publicSelfPractice,true);
assert.equal(bank.unitReleaseStatus,'planned-partial-topic-preview');
assert.deepEqual(bank.holds,[]);
assert.deepEqual(bank.sections,{fundamentals:20,reasoning:20,numericals:20,'standalone-situations':20,sharedStimulusGroups:0});
const countCog={K:0,U:0,A:0},countSlo={'P-11-B-40':0,'P-11-B-44':0},ids=new Set();
assert.equal(bank.questions.length,80);
for(let i=0;i<80;i++){
 const q=bank.questions[i],n=i+1;
 assert.equal(q.id,'XI-U06-T66-MCQ-'+String(n).padStart(4,'0'));assert.ok(!ids.has(q.id));ids.add(q.id);
 assert.equal(q.sourceQuestionNumber,n);assert.equal(q.grade,11);assert.equal(q.unit,6);
 assert.equal(q.topic,'Applications of Bernoulli’s Equation');assert.equal(q.type,'single_choice');
 assert.equal(q.sourceSection,n<=20?'fundamentals':n<=40?'reasoning':n<=60?'numericals':'standalone-situations');
 assert.equal(q.situationBased,n>=61);assert.equal(q.stimulusSetId,null);
 assert.equal(q.active,true);assert.equal(q.holdReason,null);assert.equal(q.boardEligible,false);
 assert.equal(q.status,'provisional-public-self-practice');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.deepEqual(q.sloCodes,[]);assert.deepEqual(q.topicSloCodes,['P-11-B-40','P-11-B-44']);
 assert.deepEqual(q.formativeContextSloCodes,['P-11-B-39']);
 assert.equal(q.cognitiveLevel,'Unspecified');assert.equal(q.difficulty,'Unspecified');
 assert.ok(Object.hasOwn(countSlo,q.sourceKeySloReference));countSlo[q.sourceKeySloReference]++;
 assert.ok(Object.hasOwn(countCog,q.sourceKeyCognitiveTag));countCog[q.sourceKeyCognitiveTag]++;
 assert.match(q.sourceKeyTagsStatus,/not independent per-question board certification/);
 assert.equal(q.options.length,4);assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.options.every(o=>typeof o.text==='string'&&o.text.trim().length>0));
 assert.ok(q.options.some(o=>o.id===q.correctOptionId));
 assert.ok(q.stem.length>20&&q.explanation.length>20);
 assert.ok(q.sourcePdfPage>=227&&q.sourcePdfPage<=238);
 assert.doesNotMatch(q.stem+' '+q.explanation,/Topic 6\.6 \| Study Edition|COMPLETE STUDY EDITION|Page \d+|GRADE XI PHYSICS \| UNIT 6/);
}
assert.equal(ids.size,80);
assert.deepEqual(countCog,{K:4,U:41,A:35});
assert.deepEqual(countSlo,{'P-11-B-40':39,'P-11-B-44':41});
assert.deepEqual(bank.sourceKeyCognitiveTagCounts,countCog);
assert.deepEqual(bank.sourceKeySloCounts,countSlo);
assert.match(bank.questions[0].explanation,/lowers static pressure and draws liquid up/);
assert.match(bank.questions[13].explanation,/At equal heights/);
assert.match(bank.questions[74].explanation,/equal transit times are not a valid requirement/);
assert.match(bank.questions[79].options[3].text,/comparable heights$/);
assert.match(bank.questions[79].explanation,/air density and the speeds above and below/);
// Independently evaluate each original numerical Q41–Q60 from the stated inputs.
// All math follows the chapter's stated idealized assumptions and SI conversions.
const expected={
41:Math.sqrt(2*9.8*5),42:Math.sqrt(2*9.8*1.25),43:(14**2)/(2*9.8),
44:Math.sqrt(2*9.8*2),45:3*1,46:(8/2)*1.5,
47:0.5*1000*(6**2-2**2),48:0.5*800*(5**2-2**2),
49:Math.sqrt(2**2+(2*4500/1000)),50:1000*9.8*2.5,
51:Math.sqrt((2*9.8*0.6)/(2**2-1)),52:Math.sqrt((2*9.8*0.8)/(3**2-1)),
53:(5e-4)*4,54:0.5*1000*(5**2-3**2)/1000,
55:47.1+(0.5*1000*(4**2-3**2))/1000+(1000*9.8*3)/1000,
56:(1000*9.8*3)/1000,57:0.5*1.29*(450**2-410**2),
58:(0.5*1.29*(450**2-410**2))*15*3,59:1500*20,60:0.5*1.2*(30**2-20**2)
};
const digit={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','⁺':'+'};
function numericValue(text,n){
 const m=text.match(/^\s*([0-9][0-9,]*(?:\.[0-9]+)?)/);
 assert.ok(m,'Cannot read number Q'+n+': '+text);
 let value=Number(m[1].replaceAll(',',''));
 const power=text.match(/×\s*10([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)/);
 if(power){const exponent=Number([...power[1]].map(c=>digit[c]).join(''));assert.ok(Number.isInteger(exponent));value*=10**exponent;}
 return value;
}
for(let n=41;n<=60;n++){
 const q=bank.questions[n-1],source=q.options.find(o=>o.id===q.correctOptionId),value=numericValue(source.text,n),answer=expected[n];
 const tolerance=Math.max(answer<.1?1e-6:.02,Math.abs(answer)*.005);
 assert.ok(Math.abs(value-answer)<=tolerance,'Q'+n+' original key '+q.correctOptionId+' ('+source.text+') = '+value+'; independently computed '+answer);
}
const manifest=JSON.parse(read('question-bank/manifest.json')).grades.find(g=>g.grade===11).units;
assert.deepEqual(manifest.map(u=>u.liveMcqCount),[275,206,220,640,349,474]);
assert.equal(manifest.reduce((s,u)=>s+u.liveMcqCount,0),2164);
assert.equal(manifest[5].sourceTopicMcqCount,480);
assert.equal(manifest[5].sourceFigureHeldCount,6);
assert.equal(manifest[5].independentSharedStimulusGroupCount,0);
const course=JSON.parse(read('portal/learning-catalog.json')).grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(course.status,'planned');
assert.equal(course.questionBankCount,0);assert.equal(course.partialTestBuilderMcqCount,474);
assert.equal(course.sourceTopicMcqCount,400);
const hub=read('portal/index.html'),client=read('portal/unit-06-topic-66-preview.js'),html=read('portal/unit-06-topic-66-preview.html');
assert.match(hub,/unit-06-topic-66-preview\.html/);
assert.match(client,/unit-06-topic-66-v86-80-source\.json/);
assert.match(html,/P-11-B-39 is formative/);
assert.match(html,/2,164 MCQs/);
assert.doesNotMatch(client,/firebase|firestore|localStorage\.setItem/i);
assert.ok(!fs.existsSync(path.join(root,'portal','Grade11_Unit6_COMPLETE_MASTER_ALL.pdf')),'Owner private PDF unexpectedly published');
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
  page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+': '+r.url());});
  page.on('dialog',d=>d.accept());
  await page.goto('http://127.0.0.1:'+server.address().port+'/portal/unit-06-topic-66-preview.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#load-status')?.textContent.includes('80 questions available'));
  await page.selectOption('#category','numericals');
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
  await page.selectOption('#size','all');await page.locator('#begin').click();
  await page.locator('#finish').click();assert.equal(await page.locator('#review article').count(),20);
  await page.locator('#try-again').click();await page.selectOption('#category','all');
  await page.selectOption('#size','all');await page.locator('#begin').click();
  await page.locator('#finish').click();assert.equal(await page.locator('#review article').count(),80);
  await page.locator('#try-again').click();await page.setViewportSize({width:390,height:844});
  const dim=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dim.scroll<=dim.width+2,'390px horizontal overflow: '+JSON.stringify(dim));
  const output=path.join(root,'qa-artifacts','unit06-topic66-v86');fs.mkdirSync(output,{recursive:true});
  await page.screenshot({path:path.join(output,'unit06-topic66-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  console.log('V86 PASS — 80 original Bernoulli applications MCQs, 20 independently recomputed numericals, 20 independent situations, local-only review and 390px mobile. Central 2,164 unchanged.');
 }finally{if(b)await b.close();await new Promise(resolve=>server.close(resolve));}
}
browser().catch(e=>{console.error('V86 FAILURE',e);process.exitCode=1;});
