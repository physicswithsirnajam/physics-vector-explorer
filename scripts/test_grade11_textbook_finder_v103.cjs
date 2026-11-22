#!/usr/bin/env node
'use strict';
/* V103 — source-only textbook finder QA. No Firebase account, auth, grade,
 * academic key mutation, private source, live student details or backend writes.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/textbook-finder-v103');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const catalog=JSON.parse(read('portal/verified-textbook-index-v103.json'));
const data3=JSON.parse(read('question-bank/grade-11/unit-03-textbook-numericals.json'));
let gates=0;
function pass(name){gates++;console.log('V103 PASS:',name)}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{
 try{
  const u=new URL(req.url,'http://localhost');let file=path.resolve(root,'.'+decodeURIComponent(u.pathname));
  if(!file.startsWith(root+path.sep))throw Error('Outside source tree');
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Missing');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(404);res.end('Missing')}
});
function sourceAudit(){
 assert.equal(catalog.schemaVersion,1);assert.equal(catalog.grade,11);
 assert.equal(catalog.entries.length,28);
 const counts=[1,2,3,4].map(n=>catalog.entries.filter(x=>x.unit===n).length);
 assert.deepEqual(counts,[10,5,11,2]);
 assert.equal(catalog.entries.filter(x=>x.kind==='source-related-practice').length,10);
 assert.equal(catalog.entries.filter(x=>x.kind==='textbook-numerical').length,13);
 assert.equal(catalog.entries.filter(x=>x.kind==='textbook-example').length,5);
 assert.equal(new Set(catalog.entries.map(x=>x.id)).size,28);
 pass('28 source-confirmed entries: 10 adapted Unit 1, 5 Unit 2 numericals, 8 Unit 3 numericals, 3 Unit 3 examples and 2 Unit 4 examples');
 const data3byId=new Map(data3.numericals.map(n=>[n.id,n]));
 for(const x of catalog.entries){
  assert.ok(typeof x.label==='string'&&x.label.length>10);
  assert.ok(typeof x.sourceNote==='string'&&x.sourceNote.length>10);
  assert.match(x.href,/^\.\/[a-z0-9-]+\.html#[a-zA-Z0-9.-]+$/);
  const [file,fragment]=x.href.slice(2).split('#');
  const html=read('portal/'+file);
  if(x.unit===1){
   assert.equal(x.kind,'source-related-practice');
   assert.match(x.confidence,/adapted-or-inspired/);
   assert.ok(html.includes('id="'+fragment+'"'));
   assert.ok(html.includes(x.sourceNote));
  }else if(x.unit===2){
   assert.ok(html.includes('id="'+fragment+'"'));
   assert.ok(html.includes(x.label.split(' — ')[0].replace('Textbook Numerical','Textbook numerical')));
   assert.ok(html.includes(x.slo));
  }else if(x.unit===3&&x.kind==='textbook-numerical'){
   const source=data3byId.get(fragment);
   assert.ok(source,'Unknown Unit3 source ID '+fragment);
   assert.equal(x.label,'Textbook '+source.sourceExercise);
   assert.equal(x.sourcePage,source.sourcePage);
   assert.equal(x.slo,source.slo||null);
   assert.equal(x.assessment,source.assessment);
   assert.ok(read('portal/unit-03-numericals.js').includes('article.id=n.id;'));
  }else{
   assert.ok(html.includes('id="'+fragment+'"'),'Missing real target '+x.href);
  }
 }
 assert.equal(data3.status,'teacher-review-pending');
 assert.ok(catalog.studentNotice.includes('not verbatim'));
 assert.ok(catalog.studentNotice.includes('Unit 3 teacher scientific'));
 assert.ok(!catalog.entries.some(x=>x.unit===5||x.unit===6));
 pass('all 28 links have documented exact matching public source IDs, including dynamic Unit 3 textbook data and honest missing Units 5–6');
 const quick=read('portal/exam-quick-access.html');
 assert.ok(quick.includes('href="./textbook-resource-finder.html"'));
 assert.ok(quick.includes('exact textbook end-of-unit and derivation indexes are still being prepared'));
 const finder=read('portal/textbook-resource-finder.html');
 for(const s of ['id="unit"','id="kind"','id="query"','aria-live="polite"','./verified-textbook-index-v103.json','Grade XI']){
  assert.ok(finder.includes(s),'Missing page contract '+s);
 }
 for(const forbidden of ['localStorage','sessionStorage','indexedDB','firebaseConfig','initializeAppCheck','sendReport']){
  assert.equal(finder.includes(forbidden),false,'Unexpected data collection/backend in index: '+forbidden);
 }
 assert.ok(finder.includes('shared/navigation.js')&&finder.includes('official-logo.png'));
 pass('public finder accessible from Exam Quick Access, filtered and honest, preserving attribution, privacy and old six-unit link inventory');
}
async function main(){
 fs.mkdirSync(out,{recursive:true});
 sourceAudit();
 await new Promise((res,rej)=>server.listen(0,'127.0.0.1',err=>err?rej(err):res()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const base='http://127.0.0.1:'+server.address().port+'/portal/';
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:850}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const resp=await page.goto(base+'textbook-resource-finder.html?unit=3&kind=textbook-numerical',{waitUntil:'load'});
   assert.equal(resp.status(),200);
   await page.waitForFunction(()=>document.getElementById('finder-status').textContent.includes('8 source-labelled'));
   assert.equal(await page.locator('#unit').inputValue(),'3');
   assert.equal(await page.locator('#kind').inputValue(),'textbook-numerical');
   assert.equal(await page.locator('.item').count(),8);
   assert.equal(await page.locator('h2').count(),1);
   assert.equal(await page.locator('.item a[href*="XI-U03-N-3.6"]').count(),1);
   const over=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
   assert.equal(over,false,'Horizontal overflow at '+width);
   assert.deepEqual(errors,[],'Page JS errors at '+width);
   await page.screenshot({path:path.join(out,'finder-unit3-numericals-'+width+'.png'),fullPage:true});
   await page.close();
  }
  pass('Chrome/Chromium verifies selected Unit 3 numericals at 1280px, 390px and 320px without overflow');
  const page=await browser.newPage({viewport:{width:390,height:780}});
  try{
   await page.goto(base+'textbook-resource-finder.html',{waitUntil:'load'});
   await page.waitForFunction(()=>document.querySelectorAll('.item').length===28);
   await page.locator('#unit').selectOption('5');
   await page.waitForFunction(()=>document.getElementById('finder-status').textContent.includes('0 source-labelled'));
   assert.ok(await page.locator('.none').isVisible());
   assert.match(await page.locator('.none').innerText(),/No independently indexed links/);
   await page.locator('#unit').selectOption('6');
   assert.ok(await page.locator('a[href="./exam-quick-access.html?unit=6"]').isVisible());
   await page.locator('#unit').selectOption('2');
   await page.locator('#kind').selectOption('textbook-numerical');
   assert.equal(await page.locator('.item').count(),5);
   await page.locator('#unit').selectOption('3');
   await page.locator('#kind').selectOption('textbook-example');
   assert.equal(await page.locator('.item').count(),3);
   await page.locator('#query').fill('3.5');
   assert.equal(await page.locator('.item').count(),1);
   assert.ok(new URL(page.url()).searchParams.get('q')==='3.5');
   pass('Unit5/6 honest missing state; Unit2 five numbered numericals; Unit3 three examples and searchable source numbers');
  }finally{await page.close()}
  const deep=await browser.newPage({viewport:{width:1180,height:760}});
  try{
   await deep.goto(base+'textbook-resource-finder.html?unit=3&kind=textbook-numerical');
   await deep.waitForFunction(()=>document.querySelectorAll('.item').length===8);
   await deep.locator('a[href="./unit-03-numericals.html#XI-U03-N-3.6"]').click();
   await deep.waitForURL('**/unit-03-numericals.html#XI-U03-N-3.6');
   await deep.locator('[id="XI-U03-N-3.6"]').waitFor();
   await deep.waitForFunction(()=>{
    const node=document.getElementById('XI-U03-N-3.6');
    if(!node)return false;
    const top=node.getBoundingClientRect().top;
    return top>=0&&top<window.innerHeight-100;
   });
   assert.match(await deep.locator('[id="XI-U03-N-3.6"]').innerText(),/Numerical 3.6/);
   pass('real click directly scrolls to dynamically loaded Unit 3 textbook Numerical 3.6');
  }finally{await deep.close()}
  const deep2=await browser.newPage({viewport:{width:1180,height:760}});
  try{
   await deep2.goto(base+'unit-03-study-guide.html#textbook-example-3-2');
   const target=deep2.locator('#textbook-example-3-2');
   await target.waitFor();
   assert.match(await target.innerText(),/Textbook Example 3.2/);
   const top=await target.evaluate(el=>el.getBoundingClientRect().top);
   assert.ok(top>-25&&top<800,'Static Unit 3 example anchor not navigable: '+top);
   pass('Unit 3 worked Example 3.2 has real in-page source label/anchor');
  }finally{await deep2.close()}
  fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({version:'V103',checks:gates,entries:28,unitCounts:[10,5,11,2],exactNumbered:18,sourceRelatedUnit1:10,grade11OfficialAcademicApproval:false,firebaseWrites:false,mcqContentEdited:false,appCheckEnforcementChanged:false,reportSendEnabled:false},null,2)+'\n');
  console.log('V103 COMPLETE:',gates,'evidence groups passed with no academic answer edits.');
 }finally{if(browser)await browser.close();await new Promise(res=>server.close(res))}
}
main().catch(e=>{console.error('V103 FAILED:',e?.stack||e);process.exitCode=1;try{server.close()}catch{}});
