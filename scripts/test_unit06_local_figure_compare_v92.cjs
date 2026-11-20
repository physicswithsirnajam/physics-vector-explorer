#!/usr/bin/env node
'use strict';
/* V92 — private browser-local NBF printed-image comparison.
 * Reviews do not save images, send image bytes, or unlock held source MCQs.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const manifest=json('question-bank/manifest.json').grades.find(g=>g.grade===11).units;
assert.equal(manifest[5].liveMcqCount,554);assert.equal(manifest[5].sourceTopicMcqCount,560);
assert.equal(manifest[5].sourceFigureHeldCount,6);assert.equal(manifest[5].standaloneSituationQuestionCount,133);
assert.equal(manifest[5].independentSharedStimulusGroupCount,0);assert.equal(manifest.reduce((n,u)=>n+u.liveMcqCount,0),2244);
const originals=[
 {file:'unit-06-topic-61-v76-80-source.json',hold:[11],key:'C'},
 {file:'unit-06-topic-62-v78-80-source.json',hold:[26,64,72],key:'DAD'},
 {file:'unit-06-topic-63-v80-80-source.json',hold:[24,80],key:'BB'}
];
for(const src of originals){
 const bank=json('question-bank/grade-11/'+src.file),held=bank.questions.filter(q=>!q.active);
 assert.equal(bank.questions.length,80);
 assert.deepEqual(held.map(q=>q.sourceQuestionNumber),src.hold);
 assert.equal(held.map(q=>q.correctOptionId).join(''),src.key);
 assert.ok(held.every(q=>q.boardEligible===false&&q.stimulusSetId===null&&q.sloCodes.length===0));
}
const pageSource=read('portal/unit-06-figure-verification-v91.html'),code=read('portal/unit-06-figure-verification-v91.js');
assert.match(pageSource,/V92/);
assert.match(pageSource,/local image-comparison worksheet/);
assert.match(pageSource,/never uploaded, saved, copied into the review text/);
assert.match(pageSource,/unit-06-figure-verification-v91\.js\?v=92/);
assert.match(code,/URL\.createObjectURL/);assert.match(code,/URL\.revokeObjectURL/);
assert.match(code,/image\/png,image\/jpeg,image\/webp/);
assert.match(code,/15\*1024\*1024/);
assert.match(code,/const localImages=new Map/);
assert.match(code,/pagehide/);
assert.match(code,/Local image shown during review/);
assert.match(code,/document\.importNode\(source,true\)/);
assert.match(code,/localImages\.get\(group\.fragment\)/);
assert.doesNotMatch(code,/\blocalStorage\b|\bsessionStorage\b|indexedDB|firebase|firestore|sendBeacon|XMLHttpRequest|\bpost\(/i);
assert.match(read('portal/index.html'),/V92 — Private Local Figure Comparison/);
assert.match(read('portal/unit-06-figure-study-v90.html'),/V92 — Private Local Figure Comparison/);
assert.ok(!fs.existsSync(path.join(root,'portal','Grade11_Unit6_COMPLETE_MASTER_ALL.pdf')));
console.log('V92 STATIC PASS — original 554/560, 6 source holds, local image URLs, clearing, no file transmission or cloud storage.');
async function browserTest(){
 const {chromium}=require('playwright');
 const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
 const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent((req.url||'/').split('?')[0]),file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:860}}),errors=[],missing=[],external=[],uploads=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))missing.push(r.status()+': '+r.url());});
  page.on('request',r=>{
   if(!r.url().startsWith('http://127.0.0.1:')&&!r.url().startsWith('blob:'))external.push(r.url());
   if(r.method()!=='GET')uploads.push(r.method()+':'+r.url());
  });
  await page.goto('http://127.0.0.1:'+server.address().port+'/portal/unit-06-figure-verification-v91.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#load-status')?.textContent.includes('Six original held MCQs loaded'));
  assert.equal(await page.locator('article.question').count(),6);
  assert.equal(await page.locator('.comparison').count(),4);
  assert.equal(await page.locator('.compare-grid').count(),4);
  assert.equal(await page.locator('input.local-input[type=file]').count(),4);
  assert.equal(await page.locator('.compare-pane svg[role=img]').count(),4);
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8//8/AwMDEwMDAwMDAwAkBgMB/DXemwAAAABJRU5ErkJggg==','base64');
  const input=page.locator('#local-fig-figure62');
  await input.evaluate(element=>{
   element.__v92Events=[];
   for(const name of ['input','change'])element.addEventListener(name,()=>element.__v92Events.push({event:name,fileName:element.files?.[0]?.name||null,mime:element.files?.[0]?.type||null}),{capture:true});
  });
  // Reject a non-image without creating a browser-local photo.
  await input.setInputFiles({name:'no-figure.txt',mimeType:'text/plain',buffer:Buffer.from('not an image')});
  assert.match(await page.locator('.comparison').first().locator('.compare-status').textContent(),/File rejected/);
  assert.equal(await page.locator('.comparison').first().locator('.compare-viewport img').count(),0);
  // Use a newly encoded, valid synthetic 2×2 test PNG, NOT a copied NBF figure or private file.
  await input.setInputFiles({name:'PRIVATE_ORIGINAL_BOOK_FILENAME.png',mimeType:'image/png',buffer:png});
  await page.waitForTimeout(500);
  const firstState=await page.evaluate(()=>({imgWidth:document.querySelector('#local-fig-figure62')?.closest('.compare-pane')?.querySelector('.compare-viewport img')?.naturalWidth||0,status:document.querySelector('#local-fig-figure62')?.closest('.compare-pane')?.querySelector('.compare-status')?.textContent||'',inputFiles:document.querySelector('#local-fig-figure62')?.files?.length||0,imageCount:document.querySelector('#local-fig-figure62')?.closest('.compare-pane')?.querySelectorAll('.compare-viewport img')?.length||0,imageSrc:document.querySelector('#local-fig-figure62')?.closest('.compare-pane')?.querySelector('.compare-viewport img')?.src||null,imageComplete:document.querySelector('#local-fig-figure62')?.closest('.compare-pane')?.querySelector('.compare-viewport img')?.complete??null,inputMime:document.querySelector('#local-fig-figure62')?.files?.[0]?.type||null,inputName:document.querySelector('#local-fig-figure62')?.files?.[0]?.name||null,events:document.querySelector('#local-fig-figure62')?.__v92Events||[]}));
  assert.equal(firstState.imgWidth,2,'Locally selected synthetic PNG did not load: '+JSON.stringify({...firstState,scriptErrors:errors}));
  const firstCompare=page.locator('.comparison').first();
  const localImg=firstCompare.locator('.compare-viewport img');
  assert.equal(await localImg.count(),1);
  assert.match(await localImg.getAttribute('src'),/^blob:http:\/\/127\.0\.0\.1:/);
  assert.match(await firstCompare.locator('.compare-status').textContent(),/No image has left your browser/);
  assert.equal(await page.locator('article.question').first().locator('input[type=checkbox]:checked').count(),0,
   'Loading an original textbook image MUST NOT mark a teacher/source signoff checkbox');
  let record=await page.locator('#review-summary').textContent();
  assert.match(record,/Local image shown during review: YES/);
  assert.doesNotMatch(record,/PRIVATE_ORIGINAL_BOOK_FILENAME/,'Private photo filename leaked into shareable review');
  assert.doesNotMatch(record,/blob:http:|data:image\/png|iVBORw0K/,'Photo bytes or URL leaked into shareable review');
  const zoom=page.locator('#zoom-figure62');
  assert.equal(await zoom.isEnabled(),true);
  await zoom.evaluate(node=>{node.value='200';node.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.equal(await localImg.evaluate(img=>img.style.width),'200%');
  assert.equal(await firstCompare.locator('output').textContent(),'200%');
  // Selecting a second figure is still private and leaves independent source holds intact.
  await page.locator('#local-fig-figure63').setInputFiles({name:'private_page92.png',mimeType:'image/png',buffer:png});
  await page.waitForTimeout(500);
  const secondState=await page.evaluate(()=>({imgWidth:document.querySelector('#local-fig-figure63')?.closest('.compare-pane')?.querySelector('.compare-viewport img')?.naturalWidth||0,status:document.querySelector('#local-fig-figure63')?.closest('.compare-pane')?.querySelector('.compare-status')?.textContent||''}));
  assert.equal(secondState.imgWidth,2,'Second original figure image failed: '+JSON.stringify(secondState));
  assert.equal(await page.locator('article.question').count(),6);
  assert.equal(await page.locator('article.question input[type=checkbox]:checked').count(),0);
  // Removing one photo revokes its object URL, leaving other local figure independent.
  await page.locator('#clear-figure62').click();
  assert.equal(await firstCompare.locator('.compare-viewport img').count(),0);
  assert.equal(await zoom.isDisabled(),true);
  record=await page.locator('#review-summary').textContent();
  assert.match(record,/XI-U06-T61-MCQ-0011[\s\S]*?Local image shown during review: NO/);
  assert.match(record,/XI-U06-T62-MCQ-0026[\s\S]*?Local image shown during review: YES/);
  assert.equal((record.match(/Public question status: STILL HELD/g)||[]).length,6);
  assert.deepEqual(external,[]);assert.deepEqual(uploads,[]);
  await page.setViewportSize({width:390,height:844});
  const size=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(size.scroll<=size.viewport+2,'Mobile horizontal overflow: '+JSON.stringify(size));
  const out=path.join(root,'qa-artifacts','unit06-comparison-v92');fs.mkdirSync(out,{recursive:true});
  await page.screenshot({path:path.join(out,'unit06-private-figure-comparison-mobile390.png'),fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert.deepEqual(external,[]);assert.deepEqual(uploads,[]);
  console.log('V92 CHROMIUM PASS — 4 original schematic panels, private local PNG previews, MIME rejection, 200% zoom, independent removal, no uploaded bytes, 6 holds unchanged, 390px mobile.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
browserTest().catch(e=>{console.error('V92 LOCAL FIGURE QA FAILURE',e);process.exitCode=1;});
