#!/usr/bin/env node
'use strict';
/* V80: source-faithful Topic 6.3 standalone public MCQ preview.
 * Full Unit6 and central V79 2,164 bank remain unchanged; no cloud grades.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),load=p=>JSON.parse(read(p));
const bank=load('question-bank/grade-11/unit-06-topic-63-v80-80-source.json');
const key='AADBDCBADCCDBBACCDBCADDBCBBADDABACCBDDCDCDCBDACBCDABBACCDAACCADDAABCADABBACABBDB';
assert.equal(key.length,80);
assert.equal(bank.bankId,'PSN-XI-U06-T63-V80');
assert.equal(bank.schemaVersion,1);assert.equal(bank.grade,11);
assert.equal(bank.unit,6);assert.equal(bank.topicNumber,'6.3');
assert.equal(bank.sourceQuestionCount,80);assert.equal(bank.importedQuestionCount,80);
assert.equal(bank.publicPreviewCount,78);assert.equal(bank.questions.length,80);
assert.equal(bank.secureExam,false);assert.equal(bank.publicSelfPractice,true);
assert.equal(bank.unitReleaseStatus,'planned-partial-topic-preview');
assert.deepEqual(bank.verifiedFrameworkTopicSloCodes,['P-11-B-35']);
assert.equal(bank.frameworkClassification,'Summative');
assert.equal(bank.officialFrameworkCognitiveLevel,'Knowledge + Understanding');
assert.equal(bank.perQuestionFrameworkMappingStatus,'not individually verified');
assert.equal(bank.originalSourceAnswerKey,key);
assert.equal(bank.questions.map(x=>x.correctOptionId).join(''),key,'Printed source answer key changed');
assert.deepEqual(bank.questions.filter(x=>!x.active).map(x=>x.sourceQuestionNumber),[24,80]);
assert.deepEqual(bank.sections,{fundamentals:20,reasoning:20,numericals:20,'standalone-situations':20,sharedStimulusGroups:0});
assert.equal(bank.questions.filter(x=>x.active).length,78);
assert.equal(bank.questions.filter(x=>x.active&&x.situationBased).length,19);
assert.equal(new Set(bank.questions.map(x=>x.id)).size,80);
assert.equal(new Set(bank.questions.map(x=>x.stem.toLowerCase()+'|'+x.options.map(y=>y.text).join('|'))).size,80);
const live={fundamentals:0,reasoning:0,numericals:0,'standalone-situations':0};
for(let i=0;i<80;i++){
 const q=bank.questions[i],n=i+1;
 assert.equal(q.id,'XI-U06-T63-MCQ-'+String(n).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,n);
 assert.equal(q.grade,11);assert.equal(q.unit,6);assert.equal(q.topic,'Fluid Flow');
 assert.equal(q.type,'single_choice');
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.stem.length>20&&q.explanation.length>25&&q.explanation.length<350,'Incomplete source text Q'+n);
 assert.ok(q.options.every(o=>typeof o.text==='string'&&o.text.trim()));
 assert.ok(q.options.some(o=>o.id===q.correctOptionId));
 assert.ok(q.sourcePdfPage>=99&&q.sourcePdfPage<=108);
 assert.equal(q.sourceSection,n<=20?'fundamentals':n<=40?'reasoning':n<=60?'numericals':'standalone-situations');
 assert.equal(q.situationBased,n>=61);
 assert.equal(q.stimulusSetId,null,'No fabricated common-stimulus group Q'+n);
 assert.deepEqual(q.sloCodes,[]);
 assert.deepEqual(q.topicSloCodes,['P-11-B-35']);
 assert.equal(q.boardEligible,false);
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(q.cognitiveLevel,'Unspecified');assert.equal(q.difficulty,'Unspecified');
 assert.ok(!/NBF PHYSICS XI|TEACHER NOTE|SECTION (?:I|II|III|IV)/i.test(q.stem+' '+q.explanation),'PDF page furniture leaked Q'+n);
 if(n===24||n===80){
  assert.equal(q.active,false);assert.equal(q.status,'pending-figure-review');
  assert.match(q.stem,/Fig\. 6\.6/);assert.match(q.holdReason,/Figure 6\.6/);
 }else{
  assert.equal(q.active,true);assert.equal(q.status,'provisional-public-self-practice');
  live[q.sourceSection]++;
 }
}
assert.deepEqual(live,{fundamentals:20,reasoning:19,numericals:20,'standalone-situations':19});
const scientificExp=exp=>{
 const digits={'⁻':'-','⁺':'+','⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
 const value=Array.from(exp,ch=>digits[ch]).join('');
 assert.match(value,/^[+-]?\d+$/);
 return Number(value);
};
function numericAnswer(n){
 const q=bank.questions[n-1],txt=q.options.find(o=>o.id===q.correctOptionId).text.replace(/\s+/g,'');
 const sci=txt.match(/^([+-]?\d+(?:\.\d+)?)×10([⁻⁺⁰¹²³⁴⁵⁶⁷⁸⁹]+)/);
 if(sci)return Number(sci[1])*10**scientificExp(sci[2]);
 const plain=txt.match(/^[+-]?\d+(?:\.\d+)?/);
 assert.ok(plain,'Cannot evaluate numeric answer Q'+n+': '+txt);
 return Number(plain[0]);
}
const checks={
 41:1.2/4,42:9/3,43:600/2,44:2/1000,45:.015*1000,
 46:.25*8,47:1.8/.3,48:12/60,49:360/(3*60),
 50:.8/20,51:(90/3)/1e6,52:2.5/5,53:(5e-3*2)*1000,
 54:15/30,57:5/.5,58:.06*10
};
for(const [n,calculated] of Object.entries(checks)){
 const stated=numericAnswer(Number(n));
 assert.ok(Math.abs(stated-calculated)<=Math.max(1e-12,Math.abs(calculated)*.001),'Source Q'+n+' incorrect arithmetic: '+stated+' instead of '+calculated);
}
assert.equal(bank.questions[77].correctOptionId,'B'); // Q78 rate: 18 L / 6 s = 3 L/s
assert.ok(bank.questions[77].options[1].text.includes('3 L/s'));
assert.equal(18/6,3);
assert.equal(bank.questions[54].correctOptionId,'C'); // 60/20=3, 45/10=4.5
assert.match(bank.questions[54].options[2].text,/4\.5\s*L\/s\s*>\s*3\.0\s*L\/s/);
assert.equal(bank.questions[55].correctOptionId,'C'); // 2/5 = 1.2/3 = 0.4
assert.match(bank.questions[55].options[2].text,/0\.40\s*m³\/s/);
assert.equal(bank.questions[58].correctOptionId,'A'); // time needed for Q=V/t
assert.equal(bank.questions[59].correctOptionId,'C'); // units m³/s
// V80 does not modify central builder or full course status.
const xi=load('question-bank/manifest.json').grades.find(g=>g.grade===11).units;
assert.deepEqual(xi.map(x=>x.liveMcqCount),[275,206,220,640,349,474]);
assert.equal(xi.reduce((n,x)=>n+x.liveMcqCount,0),2164);
const unit6=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(x=>x.unit===6);
assert.equal(unit6.status,'planned');
assert.equal(unit6.questionBankCount,0);
assert.equal(unit6.partialTestBuilderMcqCount,474);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')));
assert.ok(!fs.existsSync(path.join(root,'portal/Grade11_Unit6_COMPLETE_MASTER_ALL.pdf')));
const hub=read('portal/index.html');
assert.ok(hub.includes('href="./unit-06-topic-63-preview.html"'));
assert.ok(hub.includes('Topic 6.3 is also now in the central Test Builder'));
assert.ok(hub.includes('unit-06-topic-63-preview.html'));
assert.ok(hub.includes('build-your-physics-test.html?unit=6'));
assert.ok(read('portal/unit-06-topic-63-preview.html').includes('id="question-count">78</strong>'));
assert.ok(read('portal/unit-06-topic-63-preview.js').includes("fetch('../question-bank/grade-11/unit-06-topic-63-v80-80-source.json'"));
assert.ok(fs.existsSync(path.join(root,'continuity-fluid-flow.html')));
console.log('V80 STATIC PASS: 80 original Q/answers, 78 active, Figure6.6 Q24/Q80 held, 20+19+20+19 public groups, independent Q=V/t calculations, central 2,164 unchanged.');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.css':'text/css'};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const f=path.resolve(root,'.'+p);
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'text/plain','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
async function browserTest(){
 const {chromium}=require('playwright');
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[],missing=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1')&&r.status()>=400)missing.push(r.url())});
  page.on('dialog',d=>d.accept());
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'portal/unit-06-topic-63-preview.html',{waitUntil:'load'});
  await page.waitForFunction(()=>!document.getElementById('begin').disabled);
  assert.equal(await page.locator('#question-count').textContent(),'78');
  assert.equal(await page.locator('a[href="../continuity-fluid-flow.html"]').count(),1);
  for(const [section,count] of [['fundamentals',20],['reasoning',19],['numericals',20],['standalone-situations',19]]){
    await page.locator('#category').selectOption(section);
    await page.locator('#size').selectOption('all');
    await page.locator('#begin').click();
    assert.match(await page.locator('#position').textContent(),new RegExp('of '+count+'$'));
    assert.equal(await page.locator('#option-grid input[type="radio"]').count(),4);
    await page.locator('#option-grid input[type="radio"]').first().check();
    await page.locator('#finish').click();
    await page.waitForFunction(()=>!document.getElementById('results').hidden);
    assert.equal(await page.locator('#review article').count(),count);
    assert.match(await page.locator('#score').textContent(),new RegExp('/ '+count+'$'));
    assert.match(await page.locator('#review').textContent(),/Answer:/);
    await page.locator('#try-again').click();
  }
  await page.locator('#category').selectOption('all');
  await page.locator('#size').selectOption('all');
  await page.locator('#begin').click();
  assert.match(await page.locator('#position').textContent(),/of 78$/);
  await page.locator('#finish').click();
  assert.equal(await page.locator('#review article').count(),78);
  const text=await page.locator('#review').textContent();
  assert.ok(!text.includes('original Q24 '),'Held Q24 accidentally served');
  assert.ok(!text.includes('original Q80 '),'Held Q80 accidentally served');
  await page.locator('#try-again').click();
  await page.setViewportSize({width:390,height:844});
  const dims=await page.evaluate(()=>({w:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dims.scroll<=dims.w+2,'Mobile 390px overflow: '+JSON.stringify(dims));
  const out=path.join(root,'qa-artifacts','unit06-topic63-v80');
  fs.mkdirSync(out,{recursive:true});
  await page.screenshot({path:path.join(out,'unit06-topic63-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  assert.deepEqual(missing,[],'Missing local assets');
  console.log('V80 BROWSER PASS: four topic categories, full 78-MCQ review, diagram holds, explanation scoring, related link and mobile 390px.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
browserTest().catch(e=>{console.error('FAIL V80',e);process.exitCode=1;});
