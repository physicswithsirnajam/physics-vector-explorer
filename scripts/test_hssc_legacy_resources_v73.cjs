#!/usr/bin/env node
'use strict';
/* V73: source-linked student index. This validates existing Drive URL references
 * and original Google Sites video page URLs without downloading/rehosting files,
 * publishing private notes, or modifying any Google or Firebase data.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/hssc-source-v73');
fs.mkdirSync(out,{recursive:true});
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const sources=JSON.parse(read('portal/legacy-hssc-resources-v73.json'));
const crosswalk=JSON.parse(read('quality/hssc-v73-31-simulation-link-crosswalk.json'));
const sims=JSON.parse(read('portal/simulation-catalog.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end('Missing');return;}
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.statSync(file).isFile()){res.writeHead(404);res.end('Missing');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end('Internal test server error');}
});
const countsByUnit={1:[1,7,0],2:[1,7,0],3:[1,1,0],4:[1,1,0],5:[1,1,0],
 6:[1,0,0],7:[1,0,1],8:[1,0,0],9:[1,0,0],10:[1,0,0],11:[1,0,0],
 12:[1,0,0],13:[2,0,0],14:[1,0,0]};
function staticAudit(){
 assert.equal(sources.schemaVersion,1);
 assert.equal(sources.videoPages.length,15,'15 unit concept-video pages');
 assert.equal(sources.generalVideos.length,2,'2 general concept-video pages');
 assert.equal(sources.pdfHandouts.length,17,'17 pre-existing Drive files');
 assert.equal(sources.extraReading.length,1,'1 original Unit 7 external reading');
 assert.equal(sources.legacyCoursePages.length,17,'original 17 old lecture/notes/exercises subpages must be preserved for later review');
 const pageUrls=new Set();
 for(const legacy of sources.legacyCoursePages){
  assert.ok([1,2,3,4,5].includes(legacy.unit));
  assert.equal(legacy.migratedContentVerified,false,'do not claim old nested pages migrated');
  assert.equal(legacy.sourcePageBodyInspected,false,'old pages are not yet source inspected');
  assert.equal(new URL(legacy.pageUrl).origin,'https://sites.google.com');
  assert.ok(!pageUrls.has(legacy.pageUrl),'duplicate original legacy course subpage');
  pageUrls.add(legacy.pageUrl);
 }
 assert.ok(sources.oldTestBuilderPage.url.includes('/physics-practice-assessment/build-your-physics-test'));
 assert.equal(sources.oldTestBuilderPage.equivalence.includes('old nested page body not inspected'),true);
 assert.equal(crosswalk.links.length,31);
 assert.equal(sims.simulations.length,31);
 assert.equal(JSON.parse(read('portal/learning-labs-v72.json')).labs.length,9);
 assert.equal(catalog.resources.length,59,'preserve original resource list');
 const grades=catalog.grades.find(x=>x.grade===11);
 assert.equal(grades.units.filter(x=>x.status==='available').length,5);
 for(const u of grades.units.filter(x=>x.unit>=6))assert.equal(u.status,'planned','no premature course availability');
 const mcq=JSON.parse(read('question-bank/manifest.json')).grades.find(x=>x.grade===11).units.map(x=>x.liveMcqCount);
 assert.deepEqual(mcq.slice(0,5),[275,206,220,640,349]);
  assert.equal(mcq[5],394);
 const ids=new Set(),pdfIds=new Set();
 for(const [n,row] of Object.entries(countsByUnit)){
  const id=Number(n),[video,pdfs,extra]=row;
  assert.equal(sources.videoPages.filter(x=>x.unit===id).length,video,'concept pages Unit '+id);
  assert.equal(sources.pdfHandouts.filter(x=>x.unit===id).length,pdfs,'Drive files Unit '+id);
  assert.equal(sources.extraReading.filter(x=>x.unit===id).length,extra,'external reading Unit '+id);
  const item=grades.units.find(x=>x.unit===id);
  assert.equal(item.legacyVideoPageCount,video);
  assert.equal(item.originalPdfCount,pdfs);
  assert.equal(item.originalExternalReadingCount,extra);
  assert.equal(item.originalReferenceHref,'./legacy-hssc-resources.html?unit='+id);
 }
 for(const x of [...sources.videoPages,...sources.generalVideos]){
  const u=new URL(x.pageUrl);
  assert.equal(u.origin,'https://sites.google.com');
  assert.ok(u.pathname.startsWith('/view/physics-with-sir-najam/'));
  assert.ok(!ids.has(u.href),'duplicate original Google Sites video page URL: '+u.href);
  ids.add(u.href);
  assert.equal(x.hostingVideoUrlVerified,false);
  assert.ok(x.sourcePdfPage>=2&&x.sourcePdfPage<=14);
 }
 for(const x of sources.pdfHandouts){
  const u=new URL(x.fileUrl);
  assert.equal(u.origin,'https://drive.google.com');
  assert.match(u.pathname,/^\/file\/d\/[-A-Za-z0-9_]+\/view$/);
  assert.ok(!pdfIds.has(x.sourceDriveId),'duplicate public Drive PDF file reference');
  pdfIds.add(x.sourceDriveId);
  assert.equal(x.accessAsVerified,'anyone-with-link-reader');
  assert.equal(x.protectedDownload,false);
  assert.equal(x.watermarkAdded,false);
 }
 assert.equal(sources.extraReading[0].url,
  'https://courses.lumenlearning.com/chemistryformajors/chapter/lattice-structures-in-crystalline-solids-2/');
 assert.ok(sources.videoPages.some(x=>x.unit===7&&x.title.includes('Graphene')&&x.pageUrl.endsWith('/the-molecular-limits-of-materials')),
  'preserve original Unit 7 video-page title/url mismatch for manual review');
 const originalFiles=new Set(sims.simulations.map(x=>x.file));
 const oldUrls=new Set(),mapped=new Set();
 for(const x of crosswalk.links){
  assert.ok(originalFiles.has(x.repositoryFile),'source simulation missing '+x.repositoryFile);
  assert.ok(fs.existsSync(path.join(root,x.repositoryFile)),'original simulation file missing '+x.repositoryFile);
  assert.ok(!mapped.has(x.repositoryFile),'two old simulations incorrectly mapped to one GitHub model');
  mapped.add(x.repositoryFile);
  const u=new URL(x.legacyPageUrl);
  assert.equal(u.origin,'https://sites.google.com');
  assert.ok(u.pathname.includes('/student-hub/1st-year-hssc/simulations/unit-'));
  assert.ok(!oldUrls.has(x.legacyPageUrl));oldUrls.add(x.legacyPageUrl);
  const sim=sims.simulations.find(s=>s.file===x.repositoryFile);
  assert.equal(sim.unit,x.unit,'crosswalk chapter differs from original GitHub simulation');
 }
 assert.equal(mapped.size,31);
 const hub=read('portal/learning-hub.js'),index=read('portal/index.html'),page=read('portal/legacy-hssc-resources.html');
 assert.ok(hub.includes('appendSourceReferences(card,u)'));
 assert.ok(hub.includes("learning-catalog.json?v=74"));
 assert.ok(read('portal/app.js').includes("learning-hub.js?v=74"));
 assert.ok(index.includes('app.js?v=74'));
 assert.ok(page.includes('id="pdf-cards"')&&page.includes('id="video-cards"')&&page.includes('id="extra-cards"'));
 assert.ok(page.includes('not secure student-only downloads')&&page.includes('original YouTube hosts'));
 assert.ok(page.includes("link.rel='noopener noreferrer'"));
 assert.ok(!page.includes('firebase/storage'),'no false backend secure-file claims');
 assert.ok(!page.includes('youtube.com/embed/'),'never invent YouTube embedding URL');
 console.log('PASS V73 static source audit: 31 old↔new simulation matches, 15+2 original video page links, 17 public Drive PDFs, 1 original external reading, no security/MCQ changes');
}
async function main(){
 staticAudit();
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1350,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'portal/legacy-hssc-resources.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelectorAll('.card').length===62);
  assert.equal(await page.locator('#pdf-cards .card').count(),17);
  assert.equal(await page.locator('#video-cards .card').count(),17);
  assert.equal(await page.locator('#extra-cards .card').count(),1);
  assert.equal(await page.locator('#youtube-cards .card').count(),27);
  await page.screenshot({path:path.join(out,'grade11-all-external-source-links-desktop.png'),fullPage:false});
  for(const [n,[video,pdfs,extra]] of Object.entries(countsByUnit)){
   await page.locator('#unit').selectOption(n);
   assert.equal(await page.locator('#video-cards .card').count(),video,'video count for Unit '+n);
   assert.equal(await page.locator('#pdf-cards .card').count(),pdfs,'original PDF count Unit '+n);
   assert.equal(await page.locator('#extra-cards .card').count(),extra,'extra reading Unit '+n);
   assert.equal(new URL(page.url()).searchParams.get('unit'),n);
  }
  await page.locator('#unit').selectOption('7');
  const graph=page.locator('#video-cards .card');
  assert.match(await graph.textContent(),/Graphene/);
  const graphUrl=await graph.locator('a').getAttribute('href');
  assert.match(graphUrl,/the-molecular-limits-of-materials$/);
  assert.match(await page.locator('#extra-cards .card').textContent(),/Lumen Learning/);
  await page.locator('#unit').selectOption('additional');
  assert.equal(await page.locator('#video-cards .card').count(),2);
  assert.equal(await page.locator('#pdf-cards .card').count(),0);
  await page.locator('#unit').selectOption('');
  await page.locator('#search').fill('magNUS');
  assert.equal(await page.locator('#video-cards .card').count(),1);
  assert.match(await page.locator('#video-cards .card').textContent(),/Magnus/);
  await page.locator('#search').fill('');
  await page.locator('#unit').selectOption('1');
  await page.screenshot({path:path.join(out,'unit01-original-seven-drive-pdfs-video-page.png'),fullPage:false});
  const links=await page.locator('#pdf-cards .card a, #video-cards .card a, #extra-cards .card a').all();
  assert.equal(links.length,8);
  for(const link of links){
   assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
   assert.equal(await link.getAttribute('target'),'_blank');
   assert.match(await link.getAttribute('href'),/^https:\/\//);
  }
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('unit')?.value==='1');
  assert.equal(await page.locator('#pdf-cards .card').count(),7,'deep link survives refresh');
  await page.setViewportSize({width:390,height:844});
  const dim=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(dim[1]<=dim[0]+2,'390px mobile horizontal overflow in source resource directory');
  await page.screenshot({path:path.join(out,'unit01-source-links-mobile.png'),fullPage:false});
  assert.deepEqual(errors,[]);
  console.log('PASS V73 Chromium: 35 external links, Unit1–14 source counts, Unit7 original title/URL mismatch preserved, search, bookmarks, 390px layout and no browser errors');
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
}
main().catch(e=>{console.error('FAIL V73 original Google Sites/Drive source index QA',e);server.close();process.exitCode=1;});
