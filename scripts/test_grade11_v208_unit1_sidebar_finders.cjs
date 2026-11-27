#!/usr/bin/env node
'use strict';
/* V208 — honest Unit 1 source-related question navigation: local read-only Chromium.
 * No student accounts, Firebase, question keys, or source-bank edits.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'qa-artifacts/grade11-v208-unit1-exercise-navigation');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const numeric=json('portal/verified-textbook-index-v103.json').entries.filter(x=>x.unit===1);
const written=json('portal/verified-descriptive-index-v104.json').records.filter(x=>x.unit===1);
const short=written.filter(x=>x.type==='short-response');
const extended=written.filter(x=>x.type==='comprehensive-response');
const catalog=json('portal/learning-catalog.json');
const manifest=json('question-bank/manifest.json');
const nav=read('shared/navigation.js'),desk=read('portal/unit-01.html');

function sourceAudit(){
 assert.equal(numeric.length,10,'ten source-related/adapted worked problems only');
 assert.equal(short.length,10);
 assert.equal(extended.length,4);
 assert.ok(numeric.every(x=>x.kind==='source-related-practice'&&x.confidence.includes('not the exact textbook question')));
 assert.ok(written.every(x=>['source-related-adapted','original-reinforcement'].includes(x.sourceKind)));
 for(const item of [...numeric,...written]){
  const match=/^\.\/([a-z0-9-]+\.html)#([a-zA-Z0-9-]+)$/.exec(item.href);
  assert.ok(match,'Only an existing internal anchored destination may be offered: '+item.id);
  const file='portal/'+match[1];
  assert.ok(fs.existsSync(path.join(root,file)),'Missing destination '+file);
  assert.ok(read(file).includes('id="'+match[2]+'"'),'Missing anchored question '+item.id);
 }
 const original=manifest.grades.find(g=>g.grade===11).units;
 assert.deepEqual(original.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
 assert.equal(catalog.resources.length,59,'No global resource records inserted');
 assert.equal(catalog.grades[0].units[0].resourceIds.length,12);
 assert.equal(catalog.grades[0].units[6].questionBankCount,0,'Do not publish Unit 7 bank');
 for(const phrase of ['v208-u01-numerical-finder','v208-u01-short-response-finder',
                      'v208-u01-comprehensive-response-finder','unit1-original-end-exercises-pending'])
  assert.ok(nav.includes(phrase),'Missing Unit 1 navigation intent '+phrase);
 assert.ok(desk.includes('id="unit1-question-finders"'));
 assert.ok(desk.includes('not</strong> a verified list'));
 assert.ok(desk.includes('Not yet separately verified or indexed as original NBF end-of-unit sections'));
 for(const forbidden of ['firebaseConfig','initializeAppCheck','teacherUid','sendIssueReport'])
  assert.equal(nav.includes(forbidden),false,'Public navigation must not take privileged actions');
}

const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('Invalid local route')}
});
async function startServer(){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function openUnitOneMenu(page){
 await page.getByRole('button',{name:'Open unit resources menu'}).click();
 await page.waitForFunction(()=>{
  const text=document.querySelector('#psn-resource-drawer .psn-drawer-loading')?.textContent||'';
  return text.includes('unit menus');
 },null,{timeout:18000});
 const unit=page.locator('.psn-drawer-unit[data-psn-unit="1"]');
 assert.equal(await unit.count(),1);
 assert.equal(await unit.locator('.psn-drawer-stage').count(),5);
 return unit;
}
async function checkJourney(browser,base,width,stage,target,expected,expectedCount){
 const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  assert.equal((await page.goto(base+'portal/unit-01.html',{waitUntil:'domcontentloaded'})).status(),200);
  const unit=await openUnitOneMenu(page);
  const prepare=unit.locator('.psn-drawer-stage[data-psn-stage="PREPARE"]');
  await prepare.locator('summary').click();
  const disclosure=prepare.locator('[data-psn-source-status="unit1-original-end-exercises-pending"]');
  assert.equal(await disclosure.count(),1,'Textbook exercise disclosure must exist');
  assert.match(await disclosure.innerText(),/not yet separately verified and indexed/);
  if(stage!=='PREPARE')await unit.locator('.psn-drawer-stage[data-psn-stage="'+stage+'"] > summary').click();
  const group=unit.locator('.psn-drawer-stage[data-psn-stage="'+stage+'"]');
  const a=group.locator('a[href$="'+target+'"]');
  assert.equal(await a.count(),1,'Source finder navigation link must be unique');
  await a.click();
  await page.waitForURL(url=>url.pathname.endsWith(expected.path)&&url.searchParams.get('unit')==='1',{timeout:12000});
  assert.equal(await page.locator('#unit').inputValue(),'1');
  if(expected.type)assert.equal(await page.locator('#type').inputValue(),expected.type);
  const cardSelector=expected.type?'#results .card':'#results .item';
  await page.waitForFunction(({sel,num})=>document.querySelectorAll(sel).length===num,
   {sel:cardSelector,num:expectedCount},{timeout:18000});
  const first=page.locator(cardSelector+' a').first();
  const href=await first.getAttribute('href');
  assert.match(href,/unit-01-(?:numericals|descriptive)\.html#/);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Horizontal page overflow at '+width+'px: '+overflow);
  assert.deepEqual(errors,[],'Browser errors in learner journey');
  return {width,stage,filter:expected.type||'numerical',items:expectedCount,link:href};
 }finally{await page.close()}
}
(async()=>{
 sourceAudit();
 fs.mkdirSync(output,{recursive:true});
 const base=await startServer();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const results=[];
  results.push(await checkJourney(browser,base,1280,'PRACTISE',
   'textbook-resource-finder.html?unit=1',
   {path:'/portal/textbook-resource-finder.html'},10));
  results.push(await checkJourney(browser,base,390,'PREPARE',
   'descriptive-answer-finder.html?unit=1&type=short-response',
   {path:'/portal/descriptive-answer-finder.html',type:'short-response'},10));
  results.push(await checkJourney(browser,base,320,'PREPARE',
   'descriptive-answer-finder.html?unit=1&type=comprehensive-response',
   {path:'/portal/descriptive-answer-finder.html',type:'comprehensive-response'},4));
  fs.writeFileSync(path.join(output,'navigation-audit.json'),JSON.stringify({
   version:'V208',results,sourceRelatedNumericals:10,shortAdaptedOrOriginal:10,
   comprehensiveAdapted:4,originalNbfEndExercisesIndividuallyVerified:false,
   questionSourceKeysChanged:false,bankCountsChanged:false,teacherBackendChanged:false
  },null,2)+'\n');
  console.log('V208 PASS: Unit1 three accurate drawer shortcuts and academic status; desktop and mobile finder navigation 10 / 10 / 4, original 2250-bank unchanged.');
 }finally{
  if(browser)await browser.close();
  await new Promise(ok=>server.close(ok));
 }
})().catch(err=>{console.error('V208 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
