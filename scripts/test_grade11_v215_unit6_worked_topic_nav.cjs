#!/usr/bin/env node
'use strict';
/* V215 read-only Unit 6 provisional worked-topic discovery.
 * Check original V108 source, accurate navigation and approval boundaries.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const index=json('portal/verified-unit6-worked-topic-index-v108.json');
const catalog=json('portal/learning-catalog.json');
const manifest=json('question-bank/manifest.json');
const nav=read('shared/navigation.js');
const desk=read('portal/unit-06-learning-desk-v95a.html');
const destination='textbook-resource-finder.html?unit=6&kind=provisional-worked-topic-section';
const out=path.join(ROOT,'qa-artifacts/grade11-v215-unit6-worked-finder');
function checkSource(){
 assert.equal(index.entries.length,7);
 assert.equal(index.status,'public-provisional-worked-section-index-not-verified-textbook-exercises');
 assert.deepEqual(index.entries.map(e=>e.topic),['6.1','6.2','6.3','6.4','6.5','6.6','6.7']);
 assert.deepEqual(index.entries.map(e=>e.sourceType),
  ['mixed','mixed','teacher-developed','mixed','teacher-developed','mixed','teacher-developed']);
 for(const e of index.entries){
  assert.equal(e.kind,'provisional-worked-topic-section');
  const match=/^\.\/(unit-06-topic-6[1-7]-study-v95b[1-7]\.html)#worked$/.exec(e.href);
  assert.ok(match,'No invented source route '+e.id);
  const file=read('portal/'+match[1]);
  assert.ok(file.includes('id="worked"'),'Existing worked section missing: '+e.id);
  assert.ok(file.includes('id="worked-title"'),'Existing worked title missing: '+e.id);
  assert.match(e.assessmentStatus,/Provisional/);
 }
 const u6=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(catalog.resources.length,59);
 assert.equal(u6.status,'planned');
 assert.equal(u6.questionBankCount,0);
 assert.equal(u6.assessmentStatus,'not-published');
 assert.equal(u6.partialTestBuilderMcqCount,560);
 assert.equal(u6.previewResources.length,3,'Original preview resource list unchanged');
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560]);
 assert.equal(nav.split("id:'v215-u06-seven-worked-topic-finder'").length-1,1);
 assert.ok(nav.includes("href:'./"+destination+"'"));
 assert.ok(nav.includes('unit6-worked-topic-not-original-exercises'));
 assert.ok(desk.includes('id="unit6-worked-topic-finder"'));
 assert.ok(desk.includes('href="./'+destination.replace('&','&amp;')+'"'));
 assert.ok(desk.includes('These are not seven verified NBF textbook example numbers'));
 assert.ok(desk.includes('Original NBF end-of-unit MCQs, short-response questions'));
 assert.ok(!desk.includes('id="original-nbf-end-exercise-released"'));
}
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(ROOT,'.'+pathname);
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('Invalid request')}
});
async function serve(){await new Promise((resolve,reject)=>{
 server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
});return 'http://127.0.0.1:'+server.address().port+'/'}
async function journey(browser,base,width,fromSidebar){
 const page=await browser.newPage({viewport:{width,height:850}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 try{
  assert.equal((await page.goto(base+'portal/unit-06-learning-desk-v95a.html',{waitUntil:'domcontentloaded'})).status(),200);
  const banner=page.locator('#unit6-worked-topic-finder');
  assert.equal(await banner.count(),1);
  assert.ok((await banner.innerText()).includes('not seven verified NBF textbook example numbers'));
  if(fromSidebar){
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(
    document.querySelector('.psn-drawer-loading')?.textContent||''
   ).includes('unit menus'),null,{timeout:18000});
   const unit=page.locator('.psn-drawer-unit[data-psn-unit="6"]');
   assert.equal(await unit.count(),1,'Unit 6 provisional menu available');
   const practise=unit.locator('.psn-drawer-stage[data-psn-stage="PRACTISE"]');
   const prepare=unit.locator('.psn-drawer-stage[data-psn-stage="PREPARE"]');
   assert.equal(await prepare.locator('[data-psn-source-status="unit6-worked-topic-not-original-exercises"]').count(),1);
   assert.match(await prepare.textContent(),/NOT seven original numbered NBF textbook exercises/);
   if((await practise.getAttribute('open'))===null)await practise.locator('summary').click();
   const l=practise.locator('a[href$="'+destination+'"]');
   assert.equal(await l.count(),1);
   await l.click();
  }else{
   const l=banner.locator('a[href="./'+destination+'"]');
   assert.equal(await l.count(),1);
   await l.click();
  }
  await page.waitForURL(url=>url.pathname==='/portal/textbook-resource-finder.html' &&
   url.searchParams.get('unit')==='6'&&
   url.searchParams.get('kind')==='provisional-worked-topic-section',
   {timeout:12000});
  assert.equal(await page.locator('#unit').inputValue(),'6');
  assert.equal(await page.locator('#kind').inputValue(),'provisional-worked-topic-section');
  await page.waitForFunction(()=>document.querySelectorAll('#provisional-worked .preview-card').length===7,
   null,{timeout:18000});
  assert.equal(await page.locator('#results .item').count(),0,
   'Provisional worked topics must not enter original numbered-exercise table');
  assert.ok((await page.locator('#provisional-worked').innerText())
   .includes('NOT seven verified NBF textbook exercises'));
  const fifth=page.locator('#provisional-worked a[href$="unit-06-topic-65-study-v95b5.html#worked"]');
  assert.equal(await fifth.count(),1);
  await fifth.click();
  await page.waitForURL(url=>url.pathname==='/portal/unit-06-topic-65-study-v95b5.html'&&url.hash==='#worked');
  assert.equal(await page.locator('#worked').count(),1);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Student page overflow '+width+'px');
  assert.deepEqual(errors,[],'No runtime errors');
  return {width,source:fromSidebar?'sidebar':'learning-desk',workedSectionCount:7,
   checkedTopic:'6.5',originalTextbookExerciseCertified:false,scoredUnit6Published:false};
 }finally{await page.close()}
}
(async()=>{
 checkSource();fs.mkdirSync(out,{recursive:true});
 const base=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const results=[];
  results.push(await journey(browser,base,1280,true));
  results.push(await journey(browser,base,390,true));
  results.push(await journey(browser,base,320,false));
  fs.writeFileSync(path.join(out,'navigation-audit.json'),JSON.stringify({
   version:'V215',results,sourceIndex:'V108 existing seven provisional topic-section index',
   exactOriginalTextbookExercisesVerified:false,originalMcqBankChanges:0,
   unit6TeacherSignoff:'pending',unit6ExistingProvisionalMcqs:560,formalRelease:false
  },null,2)+'\n');
  console.log('V215 PASS: Unit 6 7 provisional worked-topic sections via sidebar and desk on 1280/390/320; original textbook exercises not claimed, bank unchanged');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(e=>{console.error('V215 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
