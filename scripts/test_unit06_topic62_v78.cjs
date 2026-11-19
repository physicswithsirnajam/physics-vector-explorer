#!/usr/bin/env node
'use strict';
/* V78 verifies the archived original Topic 6.2 question-bank source and
 * separate PUBLIC provisional practice, without altering central builder.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const load=p=>JSON.parse(read(p));
const source=load('question-bank/grade-11/unit-06-topic-62-v78-80-source.json');
const key='BCBDCCCBBABCADBBCACADACBDDDBDBCCCCDADAABCADCCCBBBAAABCBDACCBDDAADDADAAADDBDCABBD';
assert.equal(key.length,80);
assert.equal(source.bankId,'PSN-XI-U06-T62-V78');
assert.equal(source.grade,11);
assert.equal(source.unit,6);
assert.equal(source.topicNumber,'6.2');
assert.equal(source.sourceQuestionCount,80);
assert.equal(source.importedQuestionCount,80);
assert.equal(source.publicPreviewCount,77);
assert.equal(source.secureExam,false);
assert.equal(source.publicSelfPractice,true);
assert.equal(source.unitReleaseStatus,'planned-partial-topic-preview');
assert.deepEqual(source.verifiedFrameworkTopicSloCodes,['P-11-B-41','P-11-B-42']);
assert.equal(source.frameworkClassification,'Summative');
assert.equal(source.officialFrameworkCognitiveLevel,'Understanding');
assert.equal(source.perQuestionFrameworkMappingStatus,'not individually verified');
assert.equal(source.questions.length,80);
assert.equal(source.questions.map(q=>q.correctOptionId).join(''),key,'Original PDF source answer letters changed');
assert.deepEqual(source.questions.filter(q=>!q.active).map(q=>q.sourceQuestionNumber),[26,64,72]);
assert.equal(source.sections.sharedStimulusGroups,0);
assert.equal(source.sections.fundamentals,20);
assert.equal(source.sections.reasoning,20);
assert.equal(source.sections.numericals,20);
assert.equal(source.sections['standalone-situations'],20);
assert.equal(new Set(source.questions.map(q=>q.id)).size,80);
assert.equal(new Set(source.questions.map(q=>q.stem.toLowerCase()+'|'+q.options.map(o=>o.text).join('|'))).size,80);
const counts={};
source.questions.forEach((q,i)=>{
 assert.equal(q.id,'XI-U06-T62-MCQ-'+String(i+1).padStart(4,'0'));
 assert.equal(q.sourceQuestionNumber,i+1);
 assert.equal(q.grade,11);assert.equal(q.unit,6);
 assert.equal(q.type,'single_choice');
 assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
 assert.ok(q.options.every(o=>o.text.length>0));
 assert.ok(q.options.some(o=>o.id===q.correctOptionId));
 assert.ok(q.stem.length>=20&&q.explanation.length>=24&&q.explanation.length<270);
 assert.ok(q.sourcePdfPage>=51&&q.sourcePdfPage<=60);
 assert.ok(!/SOURCE AND QUALITY-CONTROL|NBF Physics XI • Topic|One-line explanation:|^\[P-11/i.test(q.explanation),'PDF parser leakage '+q.id);
 assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
 assert.ok(['P-11-B-41','P-11-B-42'].includes(q.sourceClaimedSloCode));
 assert.deepEqual(q.topicSloCodes,['P-11-B-41','P-11-B-42']);
 assert.equal(q.cognitiveLevel,'Unspecified');
 assert.equal(q.difficulty,'Unspecified');
 assert.equal(q.assessmentClassification,'summative-topic-provisional');
 assert.equal(q.stimulusSetId,null,'These are not common-stimulus groups');
 assert.equal(q.situationBased,i>=60);
 const range=i<20?'fundamentals':i<40?'reasoning':i<60?'numericals':'standalone-situations';
 assert.equal(q.sourceSection,range,'Original sections must not be rearranged');
 counts[q.sourceSection]=(counts[q.sourceSection]||0)+Number(q.active);
 if([26,64,72].includes(i+1)){
   assert.equal(q.active,false);
   assert.equal(q.status,'pending-figure-review');
   assert.match(q.holdReason,/Figure/);
 }else assert.equal(q.active,true);
});
assert.deepEqual(counts,{fundamentals:20,reasoning:19,numericals:20,'standalone-situations':18});
assert.equal(source.questions.filter(q=>q.active).length,77);
assert.equal(source.questions.filter(q=>q.situationBased&&q.active).length,18);
// Twenty numerical/mathematical application letters are checked in source order.
// The quantity checks are independent recalculations under the owner's explicitly
// limited Stokes approximation, not validation of all physical flow regimes.
assert.equal(source.questions.slice(40,60).map(q=>q.correctOptionId).join(''),'CADCCCBBBAAABCBDACCB');
const eq=(x,y,tol=0.001)=>assert.ok(Math.abs(x-y)<=Math.max(1e-12,Math.abs(y)*tol),x+' vs '+y);
function correctNumber(n){
 const q=source.questions[n-1],answer=q.options.find(o=>o.id===q.correctOptionId).text.trim();
 // Accept both "1.88 × 10⁻⁵" and bare "10⁻³"; do not silently treat either as 10.
 const s=answer.replace(/\s+/g,'');
 const superscript={'⁻':'-','⁺':'+','⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
 const exponent=raw=>{
  const t=Array.from(raw,ch=>superscript[ch]).join('');
  assert.match(t,/^[+-]?\d+$/,'Bad exponent for source Q'+n+': '+answer);
  return Number(t);
 };
 const bare=s.match(/^10([⁻⁺⁰¹²³⁴⁵⁶⁷⁸⁹]+)/);
 if(bare)return 10**exponent(bare[1]);
 const sci=s.match(/^([+-]?\d+(?:\.\d+)?)[×x]10([⁻⁺⁰¹²³⁴⁵⁶⁷⁸⁹]+)/);
 if(sci)return Number(sci[1])*10**exponent(sci[2]);
 const plain=s.match(/^[+-]?\d+(?:\.\d+)?/);
 assert.ok(plain,'Cannot read original numerical answer Q'+n+': '+answer);
 return Number(plain[0]);
}
eq(correctNumber(41),6*3.14*1e-3*1e-3,.004);
eq(correctNumber(42),2*4e-6);
eq(correctNumber(43),6*3.14*1.9e-5*2e-3*2,.004);
eq(correctNumber(45),12/2);
eq(correctNumber(46),2*3);
eq(correctNumber(47),1.884e-5/(6*3.14*1e-3*1));
eq(correctNumber(48),2); // source option uses mm
eq(correctNumber(49),1.884e-5/(6*3.14*2e-3*1e-3));
eq(correctNumber(51),.001);
eq(correctNumber(52),1.0016e-3);
eq(correctNumber(53),2);
eq(correctNumber(54),2*1000*10*(.0001**2)/(9*.001),.004);
eq(correctNumber(55),.03*4);
eq(correctNumber(56),.16/4);
eq(correctNumber(57),.1/2);
eq(correctNumber(58),.02*9);
eq(correctNumber(60),1000*(4/3)*3.14*(.001**3),.002);
eq(correctNumber(65),42+5);
eq(correctNumber(66),50/8);
eq(correctNumber(80),2.12/1.144,.006);
const xi=load('question-bank/manifest.json').grades.find(g=>g.grade===11).units;
assert.deepEqual(xi.map(x=>x.liveMcqCount),[275,206,220,640,349,79]);
assert.equal(xi.reduce((n,x)=>n+x.liveMcqCount,0),1769,'V78 must not add topic to central bank prematurely');
const course=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(course.status,'planned');
assert.equal(course.partialTestBuilderMcqCount,79);
assert.equal(course.questionBankCount,0);
assert.ok(!fs.existsSync(path.join(root,'portal','unit-06.html')),'Full unit6 not yet published');
assert.ok(!fs.existsSync(path.join(root,'portal','Grade11_Unit6_COMPLETE_MASTER_ALL.pdf')),'Owner original PDF must remain private');
assert.ok(read('portal/index.html').includes('href="./unit-06-topic-62-preview.html"'));
assert.ok(read('portal/unit-06-topic-62-preview.html').includes('Topic 6.2'));
assert.ok(read('portal/unit-06-topic-62-preview.html').includes('77'));
assert.ok(read('portal/unit-06-topic-62-preview.js').includes("fetch('../question-bank/grade-11/unit-06-topic-62-v78-80-source.json'"));
assert.ok(fs.existsSync(path.join(root,'viscosity-terminal-velocity.html')));
console.log('V78 STATIC PASS: 80 source records / 77 active, exact original letters, 3 held figure questions, 20+20+20+20 original groups, numerical formulas, unchanged central 1769.');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.css':'text/css'};
const server=http.createServer((req,res)=>{
 try{
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+name);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'text/plain','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
async function browserTest(){
 const {chromium}=require('playwright');
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[],missing=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1')&&r.status()>=400)missing.push(r.url()+' '+r.status())});
  page.on('dialog',d=>d.accept());
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'portal/unit-06-topic-62-preview.html',{waitUntil:'load'});
  await page.waitForFunction(()=>!document.getElementById('begin').disabled);
  assert.equal(await page.locator('#question-count').textContent(),'77');
  assert.ok(await page.locator('a[href="../viscosity-terminal-velocity.html"]').count());
  for(const [section,count] of [['fundamentals',20],['reasoning',19],['numericals',20],['standalone-situations',18]]){
    await page.locator('#category').selectOption(section);
    await page.locator('#size').selectOption('all');
    await page.locator('#begin').click();
    assert.match(await page.locator('#position').textContent(),new RegExp('of '+count+'$'));
    assert.equal(await page.locator('#option-grid input[type="radio"]').count(),4);
    await page.locator('#option-grid input[type="radio"]').first().check();
    assert.match(await page.locator('#answered').textContent(),new RegExp('1 of '+count));
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
  assert.match(await page.locator('#position').textContent(),/of 77$/);
  await page.locator('#finish').click();
  assert.equal(await page.locator('#review article').count(),77);
  const sourceNums=await page.locator('#review article .subtle').allTextContents();
  assert.equal(sourceNums.length,77);
  await page.locator('#try-again').click();
  await page.setViewportSize({width:390,height:844});
  const dimensions=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dimensions.scroll<=dimensions.client+2,'390px horizontal overflow: '+JSON.stringify(dimensions));
  const out=path.join(root,'qa-artifacts','topic62-v78');fs.mkdirSync(out,{recursive:true});
  await page.screenshot({path:path.join(out,'topic62-mobile-preview.png'),fullPage:true});
  assert.deepEqual(errors,[],'Browser script errors');
  assert.deepEqual(missing,[],'Missing HTTP assets');
  console.log('V78 BROWSER PASS: four source categories, 77-question full review, explanations, interactive simulation, mobile and no browser errors.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
browserTest().catch(e=>{console.error('FAIL V78',e);process.exitCode=1;});
