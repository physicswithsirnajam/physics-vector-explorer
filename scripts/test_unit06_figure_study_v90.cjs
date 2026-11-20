#!/usr/bin/env node
'use strict';
/* V90: verify 4 original accessible concept illustrations, 6 archived source holds,
 * and unchanged V89 central public-practice inventory, including 390px browser.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8'),json=f=>JSON.parse(read(f));
const studyPath='portal/unit-06-figure-study-v90.html',html=read(studyPath);
const sourcePaths=[
 'question-bank/grade-11/unit-06-topic-61-v76-80-source.json',
 'question-bank/grade-11/unit-06-topic-62-v78-80-source.json',
 'question-bank/grade-11/unit-06-topic-63-v80-80-source.json'
];
const ids=['XI-U06-T61-MCQ-0011','XI-U06-T62-MCQ-0026','XI-U06-T62-MCQ-0064','XI-U06-T62-MCQ-0072','XI-U06-T63-MCQ-0024','XI-U06-T63-MCQ-0080'];
const key={ 'XI-U06-T61-MCQ-0011':'C','XI-U06-T62-MCQ-0026':'D','XI-U06-T62-MCQ-0064':'A','XI-U06-T62-MCQ-0072':'D','XI-U06-T63-MCQ-0024':'B','XI-U06-T63-MCQ-0080':'B'};
const banks=sourcePaths.map(json),held=banks.flatMap(b=>b.questions.filter(q=>!q.active));
assert.deepEqual(held.map(q=>q.id),ids,'Six archived original figure holds must remain unchanged and in source order');
assert.deepEqual(banks.map(b=>b.questions.length),[80,80,80]);
assert.deepEqual(banks.map(b=>b.questions.filter(q=>q.active).length),[79,77,78]);
for(const q of held){
 assert.equal(q.correctOptionId,key[q.id],'Original source key changed on '+q.id);
 assert.equal(q.active,false);assert.ok(q.holdReason&&q.holdReason.length>15);
 assert.ok(q.options.length===4&&q.options.map(o=>o.id).join('')==='ABCD');
 assert.equal(q.stimulusSetId,null);assert.equal(q.boardEligible,false);
 assert.deepEqual(q.sloCodes,[]);
}
assert.match(held[0].options.find(o=>o.id==='C').text,/P2A/);
assert.match(held[1].options.find(o=>o.id==='D').text,/reduce drag/i);
assert.match(held[2].options.find(o=>o.id==='A').text,/constant downward speed/i);
assert.match(held[3].options.find(o=>o.id==='D').text,/reduce each bird’s drag/i);
assert.match(held[4].options.find(o=>o.id==='B').text,/Orderly paths/i);
assert.match(held[5].options.find(o=>o.id==='B').text,/\(a\) streamline;\s*\(b\) turbulent/i);
const manifest=json('question-bank/manifest.json').grades.find(g=>g.grade===11).units;
assert.equal(manifest[5].liveMcqCount,554);
assert.equal(manifest[5].sourceTopicMcqCount,560);
assert.equal(manifest[5].sourceFigureHeldCount,6);
assert.equal(manifest[5].standaloneSituationQuestionCount,133);
assert.equal(manifest[5].independentSharedStimulusGroupCount,0);
assert.equal(manifest.reduce((sum,u)=>sum+u.liveMcqCount,0),2244);
assert.equal(manifest.slice(0,5).reduce((sum,u)=>sum+u.liveMcqCount,0),1690);
const course=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(course.status,'planned');assert.equal(course.questionBankCount,0);
assert.equal(course.partialTestBuilderMcqCount,554);
assert.equal(course.sourceTopicMcqCount,560);
assert.equal(course.sourceFigureHeldCount,6);
for(const [anchor,label] of [['figure62','Figure 6.2'],['figure63','Figure 6.3'],['figure65c','Figure 6.5(c)'],['figure66','Figure 6.6']]){
 assert.match(html,new RegExp('id="'+anchor+'"'),'Missing semantic section '+anchor);
 assert.ok(html.includes(label),'Missing original figure reference '+label);
}
assert.equal((html.match(/<svg role="img"/g)||[]).length,4,'Each of four diagrams must have role img');
assert.equal((html.match(/<title id="fig/g)||[]).length,4,'Each diagram must have accessible SVG title');
assert.equal((html.match(/<desc id="fig/g)||[]).length,4,'Each diagram must have accessible SVG textual description');
assert.equal((html.match(/<section class="card" id="figure/g)||[]).length,4);
assert.match(html,/<strong>554<\/strong>/,'Student gallery must display the current Unit6 selectable count');
assert.match(html,/Six source holds|six source holds|6<\/strong>[\s\S]*?Figure-referencing questions held/i);
assert.match(html,/original educational schematics/i);
assert.match(html,/not<\/strong> been activated/i);
assert.match(html,/actual printed diagram/i);
assert.doesNotMatch(html,/<script\b|<iframe\b|firebase|school grade stored|payment/i);
for(const number of ['11','26','64','72','24','80'])assert.match(html,new RegExp('Q'+number+'\\b'));
const hub=read('portal/index.html');
assert.match(hub,/unit-06-figure-study-v90\.html/);
assert.match(hub,/2,244/);
for(const [topic,anchor] of [['61','figure62'],['62','figure63'],['62','figure65c'],['63','figure66']]){
 assert.match(read('portal/unit-06-topic-'+topic+'-preview.html'),new RegExp('unit-06-figure-study-v90[.]html#'+anchor));
}
for(const b of banks)assert.deepEqual(b.questions.filter(q=>!q.active).map(q=>q.id),ids.filter(id=>id.includes('-T'+b.topicNumber.replace('.','')+'-')));
assert.ok(!fs.existsSync(path.join(root,'portal','Grade11_Unit6_COMPLETE_MASTER_ALL.pdf')));
console.log('V90 STATIC PASS: all 6 held original keys and 4 original accessible schematic descriptions; Unit6 remains 554/560, total 2,244, no new certs or source PDF.');
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
  const page=await b.newPage({viewport:{width:1280,height:850}}),errors=[],missing=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)missing.push(r.status()+': '+r.url());});
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:'))external.push(r.url());});
  await page.goto('http://127.0.0.1:'+server.address().port+'/'+studyPath,{waitUntil:'networkidle'});
  assert.equal(await page.locator('section.card').count(),4);
  assert.equal(await page.locator('svg[role=img]').count(),4);
  assert.equal(await page.locator('svg title').count(),4);
  assert.equal(await page.locator('svg desc').count(),4);
  assert.equal(await page.getByRole('heading',{name:/figure 6\.5\(c\)/i}).count(),1);
  await page.getByRole('link',{name:/fig\. 6\.5\(c\)/i}).first().click();
  await page.waitForFunction(()=>window.location.hash==='#figure65c');
  await page.setViewportSize({width:390,height:844});
  const dims=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dims.scroll<=dims.viewport+2,'mobile horizontal overflow '+JSON.stringify(dims));
  const folder=path.join(root,'qa-artifacts','unit06-figures-v90');fs.mkdirSync(folder,{recursive:true});
  await page.screenshot({path:path.join(folder,'unit06-figure-gallery-mobile390.png'),fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  assert.deepEqual(external,[],'No third-party requests or tracking');
  console.log('V90 CHROMIUM PASS: 4 accessible concept figures, 390px no-overflow, anchors work, no broken images or outside requests.');
 }finally{if(b)await b.close();await new Promise(resolve=>server.close(resolve));}
}
browser().catch(e=>{console.error('V90 FIGURE STUDY QA FAILURE',e);process.exitCode=1;});
