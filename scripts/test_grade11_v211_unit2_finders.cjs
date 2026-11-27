#!/usr/bin/env node
'use strict';
/* V211 — Unit 2 three accurate source-indexed question-finder shortcuts.
 * Technical navigation audit only, not independent textbook science signoff.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const nIndex=json('portal/verified-textbook-index-v103.json').entries.filter(x=>x.unit===2);
const dIndex=json('portal/verified-descriptive-index-v104.json').records.filter(x=>x.unit===2);
const short=dIndex.filter(x=>x.type==='short-response');
const long=dIndex.filter(x=>x.type==='comprehensive-response');
const catalog=json('portal/learning-catalog.json');
const manifest=json('question-bank/manifest.json');
const desk=read('portal/unit-02.html'),nav=read('shared/navigation.js');
const output=path.join(root,'qa-artifacts/grade11-v211-unit2-finder-navigation');
function sourceAudit(){
 assert.equal(nIndex.length,5,'Only five teacher-source-numbered worked numerical exercises');
 assert.ok(nIndex.every(x=>x.kind==='textbook-numerical'));
 assert.ok(nIndex.every(x=>x.sourceNote.includes('worked adaptation')),
  'Do not claim 1:1 original textbook page verification');
 assert.equal(short.length,35);
 assert.equal(long.length,15);
 assert.equal(short.filter(x=>x.sourceKind==='textbook-labelled-in-teacher-source').length,9);
 assert.equal(long.filter(x=>x.sourceKind==='textbook-labelled-in-teacher-source').length,4);
 for(const entry of [...nIndex,...dIndex]){
  const match=/^\.\/([a-z0-9-]+\.html)#([A-Za-z0-9_-]+)$/.exec(entry.href);
  assert.ok(match,'Only existing local source-indexed question anchors allowed '+entry.id);
  const file='portal/'+match[1];
  assert.ok(fs.existsSync(path.join(root,file)),file+' not found');
  assert.ok(read(file).includes('id="'+match[2]+'"'),'Question anchor missing '+entry.id);
 }
 const units=catalog.grades.find(g=>g.grade===11).units;
 assert.equal(catalog.resources.length,59,'Frozen shared resource catalogue must not change');
 assert.equal(units.find(x=>x.unit===2).questionBankCount,206);
 assert.equal(units.find(x=>x.unit===7).questionBankCount,0);
 assert.equal(units.find(x=>x.unit===7).assessmentStatus,'not-published');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 for(const v of ['v211-u02-numerical-finder','v211-u02-short-finder',
  'v211-u02-comprehensive-finder','unit2-teacher-source-original-image-pending']){
  assert.ok(nav.includes(v),'Missing V211 sidebar intent '+v);
 }
 assert.ok(desk.includes('id="unit2-question-finders"'));
 assert.ok(desk.includes('9 short and 4 comprehensive'));
 assert.ok(desk.includes('independent match against original NBF page images has not been established'));
 assert.ok(!desk.includes('build-your-physics-test.html?unit=7'));
 assert.ok(!nav.includes('firebase.firestore'));
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('Invalid route')}
});
async function serve(){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function journey(browser,base,width,stage,query,count,type){
 const page=await browser.newPage({viewport:{width,height:860}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  assert.equal((await page.goto(base+'portal/unit-02.html',{waitUntil:'domcontentloaded'})).status(),200);
  assert.equal(await page.locator('#unit2-question-finders').count(),1);
  await page.getByRole('button',{name:'Open unit resources menu'}).click();
  await page.waitForFunction(()=>(
   document.querySelector('.psn-drawer-loading')?.textContent||''
  ).includes('unit menus'),null,{timeout:18000});
  const unit=page.locator('.psn-drawer-unit[data-psn-unit="2"]');
  assert.equal(await unit.count(),1);
  const prepare=unit.locator('.psn-drawer-stage[data-psn-stage="PREPARE"]');
  assert.equal(await prepare.locator('[data-psn-source-status="unit2-teacher-source-original-image-pending"]').count(),1);
  const section=unit.locator('.psn-drawer-stage[data-psn-stage="'+stage+'"]');
  const link=section.locator('a[href$="'+query+'"]');
  assert.equal(await link.count(),1,'Missing or incorrectly categorized link: '+query+' in '+stage);
  if((await section.getAttribute('open'))===null)await section.locator('summary').click();
  await link.click();
  const target=type==='textbook-numerical'?'textbook-resource-finder.html':'descriptive-answer-finder.html';
  await page.waitForURL(u=>u.pathname.endsWith('/portal/'+target)&&u.searchParams.get('unit')==='2',
   {timeout:12000});
  assert.equal(await page.locator('#unit').inputValue(),'2');
  const filterName=type==='textbook-numerical'?'kind':'type';
  assert.equal(await page.locator('#'+filterName).inputValue(),type);
  const sel=type==='textbook-numerical'?'#results .item':'#results .card';
  await page.waitForFunction(({sel,count})=>document.querySelectorAll(sel).length===count,
   {sel,count},{timeout:20000});
  const href=await page.locator(sel+' a').first().getAttribute('href');
  assert.match(href,/unit-02-(?:numericals|descriptive)\.html#(?:n|s|l)[0-9]+/);
  assert.deepEqual(errors,[],'Page runtime errors');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-
   document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Horizontal page overflow at '+width+'px: '+overflow);
  return {width,stage,kind:type,visibleCount:count,firstDestination:href,
   originalPageImageApproved:false,newScoredMcqs:0};
 }finally{await page.close()}
}
(async()=>{
 sourceAudit();fs.mkdirSync(output,{recursive:true});
 const base=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const results=[];
  results.push(await journey(browser,base,1280,'PRACTISE',
   'textbook-resource-finder.html?unit=2&kind=textbook-numerical',5,'textbook-numerical'));
  results.push(await journey(browser,base,390,'PREPARE',
   'descriptive-answer-finder.html?unit=2&type=short-response',35,'short-response'));
  results.push(await journey(browser,base,320,'PREPARE',
   'descriptive-answer-finder.html?unit=2&type=comprehensive-response',15,'comprehensive-response'));
  fs.writeFileSync(path.join(output,'evidence.json'),JSON.stringify({
   version:'V211',results,source:'existing V103/V104 indexed teacher-prepared Grade XI Unit 2 material',
   indexedNumericals:5,shortResponses:35,comprehensiveResponses:15,
   teacherTextbookLabelledShort:9,teacherTextbookLabelledComprehensive:4,
   originalPageImagesVerifiedByThisPR:false,bankQuestionsModified:0,newGradedQuestions:0
  },null,2)+'\n');
  console.log('V211 PASS: 5/35/15 Unit 2 prefiltered source-indexed finders, desktop/mobile and no MCQ changes.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(err=>{console.error('V211 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
