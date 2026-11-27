#!/usr/bin/env node
'use strict';
/* V212 Unit 3 transparent source-numbered examples/numericals navigation.
 * No textbook-scan certification, database, scoring, or authored question changes.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const load=p=>JSON.parse(read(p));
const textbook=load('portal/verified-textbook-index-v103.json');
const catalog=load('portal/learning-catalog.json');
const manifest=load('question-bank/manifest.json');
const nav=read('shared/navigation.js'),desk=read('portal/unit-03.html');
const examples=textbook.entries.filter(x=>x.unit===3&&x.kind==='textbook-example');
const numerical=textbook.entries.filter(x=>x.unit===3&&x.kind==='textbook-numerical');
const output=path.join(ROOT,'qa-artifacts/grade11-v212-unit3-finder-audit');
const sourceAudit=()=>{
 assert.deepEqual(examples.map(x=>x.id),['u03-example-3.1','u03-example-3.2','u03-example-3.5']);
 assert.deepEqual(numerical.map(x=>x.id),Array.from({length:8},(_,i)=>'u03-numerical-3.'+(i+1)));
 assert.ok(examples.every(x=>x.sourceNote.includes('public study adaptation')));
 assert.ok(numerical.every(x=>x.sourceNote.includes('adapted and worked')&&
   x.confidence.includes('teacher scientific sign-off still pending')));
 const countFormative=numerical.filter(x=>x.assessment==='formative'||x.assessment==='supplementary-formative').length;
 assert.equal(countFormative,2,'Formative numericals cannot be advertised as summative');
 for(const entry of [...examples,...numerical]){
   const m=/^\.\/([a-z0-9-]+\.html)#([a-zA-Z0-9.\-]+)$/.exec(entry.href);
   assert.ok(m,'Unsafe source index link '+entry.id);
   const local='portal/'+m[1];
   assert.ok(fs.existsSync(path.join(ROOT,local)),'Missing destination '+local);
   const content=read(local);
   assert.ok(content.includes(m[2]),'Destination does not expose its indexed question reference '+entry.id);
 }
 const u3=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===3);
 const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(catalog.resources.length,59);
 assert.equal(u3.questionBankCount,220);assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
 assert.ok(nav.includes("v212-u03-worked-examples-finder"));
 assert.ok(nav.includes("v212-u03-numericals-finder"));
 assert.ok(nav.includes("unit3-original-end-exercises-pending"));
 assert.ok(desk.includes('id="unit3-examples-and-numericals-finders"'));
 assert.ok(desk.includes('independent original NBF page-image certification'));
 assert.ok(desk.includes('have not yet been individually source-mapped'));
 assert.ok(desk.includes('Sections B/C practice paper'));
 assert.ok(!desk.includes('build-your-physics-test.html?unit=7'));
};
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const f=path.resolve(ROOT,'.'+p);
  if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end('Missing');return}
  res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch(e){res.writeHead(400);res.end('Invalid route')}
});
async function listen(){await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';}
async function browse(browser,base,width,kind,amount){
 const page=await browser.newPage({viewport:{width,height:850}});
 const errors=[];page.on('pageerror',err=>errors.push(err.message));
 try{
  assert.equal((await page.goto(base+'portal/unit-03.html',{waitUntil:'domcontentloaded'})).status(),200);
  assert.equal(await page.locator('#unit3-examples-and-numericals-finders').count(),1);
  await page.getByRole('button',{name:'Open unit resources menu'}).click();
  await page.waitForFunction(()=>(
   document.querySelector('.psn-drawer-loading')?.textContent||''
  ).includes('unit menus'),null,{timeout:18000});
  const unit=page.locator('.psn-drawer-unit[data-psn-unit="3"]');
  assert.equal(await unit.count(),1);
  const stage=unit.locator('.psn-drawer-stage[data-psn-stage="PRACTISE"]');
  const prepare=unit.locator('.psn-drawer-stage[data-psn-stage="PREPARE"]');
  assert.equal(await prepare.locator('[data-psn-source-status="unit3-original-end-exercises-pending"]').count(),1);
  assert.ok((await prepare.innerText()).includes('not an individually indexed original end-of-unit'));
  if((await stage.getAttribute('open'))===null)await stage.locator('summary').click();
  const suffix='textbook-resource-finder.html?unit=3&kind='+kind;
  const link=stage.locator('a[href$="'+suffix+'"]');
  assert.equal(await link.count(),1,'Expect exactly one '+kind+' link in Unit 3 PRACTISE');
  await link.click();
  await page.waitForURL(url=>url.pathname==='/portal/textbook-resource-finder.html'&&
   url.searchParams.get('unit')==='3'&&url.searchParams.get('kind')===kind,
   {timeout:12000});
  assert.equal(await page.locator('#unit').inputValue(),'3');
  assert.equal(await page.locator('#kind').inputValue(),kind);
  await page.waitForFunction(n=>document.querySelectorAll('#results .item').length===n,amount,{timeout:17000});
  const hrefs=await page.locator('#results .item a[href]').evaluateAll(a=>a.map(x=>x.getAttribute('href')));
  assert.equal(hrefs.length,amount);
  assert.ok(hrefs.every(x=>kind==='textbook-example'?
   /unit-03-study-guide\.html#textbook-example-3-/.test(x):
   /unit-03-numericals\.html#XI-U03-N-3\./.test(x)),'Wrong kind or source link in filtered results');
  assert.deepEqual(errors,[],'Browser exception in Unit 3 menu or finder');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Page has horizontal overflow at width '+width);
  return {width,kind,count:amount,unit:3,sourceTeacherApproved:false,addedScoredItems:0};
 }finally{await page.close()}
}
(async()=>{
 sourceAudit();fs.mkdirSync(output,{recursive:true});const base=await listen();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const journeys=[];
  journeys.push(await browse(browser,base,1280,'textbook-example',3));
  journeys.push(await browse(browser,base,390,'textbook-numerical',8));
  journeys.push(await browse(browser,base,320,'textbook-example',3));
  fs.writeFileSync(path.join(output,'source-and-navigation.json'),JSON.stringify({
   version:'V212',journeys,workedSourceAdaptations:3,adaptedSourceNumberedNumericals:8,
   originalEndExerciseMcqMappingComplete:false,originalDescriptiveExerciseMappingComplete:false,
   independentNumericalScientificApproval:false,bankCountsUnchanged:true
  },null,2)+'\n');
  console.log('V212 PASS: 3 source-adapted numbered examples and 8 source-labelled worked numerical links, desktop/mobile, no graded/science release');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(err=>{console.error('V212 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}});
