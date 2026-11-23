#!/usr/bin/env node
'use strict';
/* V108 source-anchored Unit 6 topic-only previews, strictly separate from textbook exercises. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/unit6-worked-topics-v108');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const idx=JSON.parse(read('portal/verified-unit6-worked-topic-index-v108.json'));
const old=JSON.parse(read('portal/verified-textbook-index-v103.json'));
const html=read('portal/textbook-resource-finder.html');
let gates=0;const pass=s=>{gates++;console.log('V108 PASS:',s)};
function sourceAudit(){
 assert.equal(idx.schemaVersion,1);assert.equal(idx.grade,11);assert.equal(idx.unit,6);
 assert.equal(idx.status,'public-provisional-worked-section-index-not-verified-textbook-exercises');
 assert.equal(idx.entries.length,7);assert.equal(new Set(idx.entries.map(x=>x.id)).size,7);
 assert.equal(old.entries.length,28);
 assert.deepEqual([1,2,3,4].map(u=>old.entries.filter(e=>e.unit===u).length),[10,5,11,2]);
 assert.equal(old.entries.filter(e=>e.unit===5||e.unit===6).length,0);
 const mixed=[1,2,4,6];
 for(const [i,e] of idx.entries.entries()){
  const topic=i+1,filename='unit-06-topic-6'+topic+'-study-v95b'+topic+'.html';
  assert.equal(e.unit,6);assert.equal(e.topic,'6.'+topic);
  assert.equal(e.id,'v108-u6-topic-'+topic);
  assert.equal(e.href,'./'+filename+'#worked');
  assert.equal(e.kind,'provisional-worked-topic-section');
  assert.equal(e.sourceType,mixed.includes(topic)?'mixed':'teacher-developed');
  assert.match(e.assessmentStatus,/Provisional/);
  assert.ok(e.sourceNote.length>70);
  const source=read('portal/'+filename);
  assert.match(source,/<section[^>]*id="worked"/,'Missing exact public section for Topic 6.'+topic);
  assert.ok(source.includes('id="worked-title"'));
  assert.match(source.slice(0,9000),/preview/i,'No provisional disclaimer on lesson '+topic);
  const block=source.slice(source.indexOf('id="worked"'),source.indexOf('id="worked"')+1100);
  assert.match(block,/teacher|master|supplementary|NBF/i,'Unclear source classification for '+topic);
 }
 assert.ok(idx.notice.includes('NOT seven individual textbook'));
 pass('all seven exact public worked-section anchors exist; mixed/source-related boundaries remain distinct from original textbook exercise numbers');
 for(const f of ['verified-unit6-worked-topic-index-v108.json','provisional-worked','Provisional worked-topic sections','NOT seven verified NBF textbook exercises']){
  assert.ok(html.includes(f),'Missing explicit finder contract '+f);
 }
 for(const forbidden of ['localStorage','sessionStorage','indexedDB','firebaseConfig','initializeAppCheck','sendReport','FIREBASE_APPCHECK_DEBUG_TOKEN']){
  assert.ok(!html.includes(forbidden),'Unexpected student data/backend addition: '+forbidden);
 }
 assert.ok(html.includes('verified-textbook-index-v103.json')&&html.includes('result.entries.length!==28'),'V103 original immutable source index removed');
 pass('legacy V103 source catalog preserved; public supplemental category has no student collection, Firebase or key exposure');
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{
 try{
  const u=new URL(req.url,'http://localhost');
  let f=path.resolve(root,'.'+decodeURIComponent(u.pathname));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end('Not found');return}
  if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.statSync(f).isFile()){res.writeHead(404);res.end('Not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch{res.writeHead(404);res.end('Not found')}
});
async function browserAudit(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const base='http://127.0.0.1:'+server.address().port+'/portal/';
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:840}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   try{
    const response=await page.goto(base+'textbook-resource-finder.html?unit=6&kind=provisional-worked-topic-section',{waitUntil:'load'});
    assert.equal(response.status(),200);
    await page.waitForFunction(()=>document.querySelectorAll('#provisional-worked .preview-card').length===7);
    assert.equal(await page.locator('#results .item').count(),0,'Supplement must never be blended into textbook catalog');
    assert.equal(await page.locator('#provisional-worked .preview-card').count(),7);
    assert.ok((await page.locator('#provisional-worked').innerText()).includes('NOT seven verified NBF textbook exercises'));
    assert.ok(await page.locator('#results .none').isVisible(),'Existing V103 no verified exercise warning must remain');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'Horizontal overflow '+width);
    assert.deepEqual(errors,[],'Page errors '+width);
    await page.screenshot({path:path.join(out,'unit6-provisional-worked-'+width+'.png'),fullPage:true});
   }finally{await page.close()}
  }
  pass('real Chromium 1280px, 390px, 320px displays seven clearly provisional Unit 6 links without hiding original verified-number gap');
  const page=await browser.newPage({viewport:{width:390,height:820}});
  try{
   await page.goto(base+'textbook-resource-finder.html?unit=6&kind=provisional-worked-topic-section&q=Bernoulli',{waitUntil:'load'});
   await page.waitForFunction(()=>document.querySelectorAll('#provisional-worked .preview-card').length===2);
   assert.equal(await page.locator('#provisional-worked a[href$="unit-06-topic-65-study-v95b5.html#worked"]').count(),1);
   await page.locator('#provisional-worked a[href$="unit-06-topic-65-study-v95b5.html#worked"]').click();
   await page.waitForURL('**/unit-06-topic-65-study-v95b5.html#worked');
   const target=page.locator('#worked');await target.waitFor();
   assert.match(await target.innerText(),/Eight supplementary numerical applications/);
   await page.goto(base+'textbook-resource-finder.html?unit=3&kind=textbook-numerical',{waitUntil:'load'});
   await page.waitForFunction(()=>document.querySelectorAll('#results .item').length===8);
   assert.equal(await page.locator('#provisional-worked .preview-card').count(),0,'Supplement leaked into textbook numericals');
   pass('real Bernoulli worked-section click, topic search, and original eight Unit 3 textbook numerical links work');
  }finally{await page.close()}
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
}
async function main(){
 fs.mkdirSync(out,{recursive:true});sourceAudit();await browserAudit();
 fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({version:'V108',gates,originalTextbookLinks:28,provisionalTopicSections:7,unit6TextbookNumberCertification:false,sourceAnswersChanged:false,studentData:false,FirebaseWrites:false,AppCheckEnforced:false},null,2)+'\n');
 console.log('V108 COMPLETE:',gates,'source/browser evidence groups');
}
main().catch(e=>{console.error('V108 FAILED:',e?.stack||String(e));process.exitCode=1;try{server.close()}catch{}});
