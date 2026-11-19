#!/usr/bin/env node
'use strict';
/* V74: 27 educator-supplied direct YouTube entries; 26 unique video IDs.
 * Preserve the original Google Sites subpages and all 17 Drive notes unchanged.
 * Every network call to youtube-nocookie.com is stubbed by Chromium; no real
 * students, video downloads or authenticated account access in CI.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/hssc-youtube-v74');
fs.mkdirSync(out,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const direct=JSON.parse(read('portal/hssc-concept-videos-v74.json'));
const legacy=JSON.parse(read('portal/legacy-hssc-resources-v73.json'));
const course=JSON.parse(read('portal/learning-catalog.json'));
const unitCounts=[0,3,3,1,1,2,1,2,1,1,1,1,1,5,4];
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  let f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end('Missing');return;}
  if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.statSync(f).isFile()){res.writeHead(404);res.end('Missing');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch(e){res.writeHead(500);res.end('Request error');}
});
function audit(){
 assert.equal(direct.schemaVersion,1);
 assert.equal(direct.videoCount,27);
 assert.equal(direct.uniqueVideoCount,26);
 assert.equal(direct.videos.length,27);
 assert.equal(new Set(direct.videos.map(x=>x.videoId)).size,26);
 assert.equal(direct.unitsCovered,14);
 const seen=new Set();
 const grade=course.grades.find(g=>g.grade===11);
 for(const v of direct.videos){
  assert.match(v.videoId,/^[-_A-Za-z0-9]{11}$/);
  assert.equal(v.watchUrl,'https://www.youtube.com/watch?v='+v.videoId);
  assert.equal(v.source,'provided-by-portal-owner-2026-11-18');
  assert.ok(Number.isInteger(v.unit)&&v.unit>=1&&v.unit<=14);
  assert.ok(!seen.has(v.id),'unique video record IDs');seen.add(v.id);
 }
 for(let n=1;n<=14;n++){
  assert.equal(direct.videos.filter(v=>v.unit===n).length,unitCounts[n],'unit '+n+' video count');
  const u=grade.units.find(x=>x.unit===n);
  assert.equal(u.directYouTubeCount,unitCounts[n]);
  if(n>=6)assert.equal(u.status,'planned','do not publish whole course just because videos are available');
 }
 const dup=direct.videos.filter(v=>v.videoId==='bHIhgxav9LY');
 assert.deepEqual(dup.map(v=>v.unit),[10,11]);
 assert.equal(dup[0].status,'needs-correction-duplicate-electricity-video');
 assert.equal(dup[0].embedAllowed,false,'never embed a known wrong Unit10 source as Electrostatics');
 assert.equal(grade.units.find(x=>x.unit===10).directVideoReviewRequired,true);
 assert.equal(dup[1].embedAllowed,true);
 assert.equal(legacy.pdfHandouts.length,17);
 assert.equal(legacy.videoPages.length,15);
 assert.equal(legacy.generalVideos.length,2);
 assert.equal(legacy.legacyCoursePages.length,17);
 assert.equal(JSON.parse(read('portal/simulation-catalog.json')).simulations.length,31);
 assert.equal(JSON.parse(read('portal/learning-labs-v72.json')).labs.length,9);
 const existing=JSON.parse(read('question-bank/manifest.json')).grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount);
  assert.deepEqual(existing.slice(0,5),[275,206,220,640,349]);
  assert.equal(existing[5],79);
 assert.equal(course.resources.length,59);
 const html=read('portal/legacy-hssc-resources.html');
 const script=html.match(/<script>\s*'use strict';([\s\S]*?)<\/script>/)?.[1];
 assert.ok(script,'inline source-video logic exists');
 new vm.Script("'use strict';\n"+script,{filename:'hssc-video-index-inline.js'});
 for(const text of ['id="youtube-cards"','id="video-cards"','id="pdf-cards"','id="legacy-video-pages"','youtube-nocookie.com/embed/','aria-label','embedAllowed','iframe.loading']){
  assert.ok(html.includes(text),'missing accessible source-video feature '+text);
 }
 assert.ok(html.includes("fetch('./hssc-concept-videos-v74.json'"));
 assert.ok(html.includes('Watch here'));
 assert.ok(html.includes('Needs correction'));
 assert.ok(!html.includes('<iframe src="https://www.youtube'), 'no automatic third-party embeds during page load');
 assert.ok(read('portal/learning-hub.js').includes('learning-catalog.json?v=74'));
 assert.ok(read('portal/app.js').includes('learning-hub.js?v=74'));
 assert.ok(read('portal/index.html').includes('app.js?v=74'));
 console.log('PASS V74 static: 27 teacher-supplied entries / 26 IDs / 14 units, Unit10/11 duplicate safety, original 17+17 source links unchanged, 31+9 simulations, 1690 MCQs');
}
async function main(){
 audit();
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:850}});
  const errors=[];
  const requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',req=>{if(req.url().includes('youtube-nocookie.com'))requests.push(req.url())});
  await page.route('https://www.youtube-nocookie.com/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html><body>Stubbed YouTube player — offline QA only</body></html>'}));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'portal/legacy-hssc-resources.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelectorAll('.card').length===62);
  assert.equal(await page.locator('#youtube-cards .card').count(),27);
  assert.equal(await page.locator('#pdf-cards .card').count(),17);
  assert.equal(await page.locator('#video-cards .card').count(),17);
  assert.equal(await page.locator('#extra-cards .card').count(),1);
  assert.equal(await page.locator('iframe').count(),0,'no iframe before opting in');
  assert.equal(requests.length,0,'no YouTube request before user click');
  await page.screenshot({path:path.join(out,'all-27-concept-videos-desktop.png'),fullPage:false});
  await page.locator('#unit').selectOption('1');
  assert.equal(await page.locator('#youtube-cards .card').count(),3);
  assert.equal(await page.locator('#pdf-cards .card').count(),7);
  assert.equal(await page.locator('#video-cards .card').count(),1);
  const first=page.locator('#youtube-cards .card').first();
  assert.match(await first.locator('h3').textContent(),/Roundest Object/);
  await first.locator('button.play').click();
  assert.equal(await page.locator('#youtube-cards iframe').count(),1);
  assert.match(await first.locator('iframe').getAttribute('src'),/^https:\/\/www[.]youtube-nocookie[.]com\/embed\/ZMByI4s-D-Y[?]rel=0$/);
  // The iframe has loading=lazy, so the browser may defer its real request
  // until it enters the viewport. DOM creation plus the exact URL is the
  // reliable click-to-load contract, not an immediate network-request count.
  assert.equal(await first.locator('iframe').getAttribute('loading'),'lazy');
  await page.locator('#youtube-cards .card').nth(1).locator('button.play').click();
  assert.equal(await page.locator('#youtube-cards iframe').count(),1,'one player at a time');
  assert.match(await page.locator('#youtube-cards iframe').getAttribute('src'),/Oo0jm1PPRuo/);
  await page.locator('#unit').selectOption('10');
  assert.equal(await page.locator('#youtube-cards .card').count(),1);
  assert.equal(await page.locator('#youtube-cards .card button.play').count(),0,'Unit10 wrong link not embedded');
  assert.match(await page.locator('#youtube-cards .card').textContent(),/Needs correction/);
  assert.match(await page.locator('#youtube-cards .card a').getAttribute('href'),/bHIhgxav9LY$/);
  await page.screenshot({path:path.join(out,'unit10-source-needs-correction.png'),fullPage:false});
  await page.locator('#unit').selectOption('11');
  assert.equal(await page.locator('#youtube-cards .card button.play').count(),1,'Unit11 original electricity link remains playable');
  for(const [unit,count] of [[2,3],[3,1],[4,1],[5,2],[6,1],[7,2],[8,1],[9,1],[12,1],[13,5],[14,4]]){
   await page.locator('#unit').selectOption(String(unit));
   assert.equal(await page.locator('#youtube-cards .card').count(),count,'YouTube count unit '+unit);
   assert.equal(new URL(page.url()).searchParams.get('unit'),String(unit));
  }
  await page.locator('#unit').selectOption('13');
  assert.match(await page.locator('#youtube-cards .card').last().textContent(),/Advanced Extension/);
  await page.screenshot({path:path.join(out,'unit13-special-relativity-five-videos.png'),fullPage:false});
  await page.locator('#unit').selectOption('');
  await page.locator('#search').fill('Higgs');
  assert.equal(await page.locator('#youtube-cards .card').count(),2,'Higgs filter');
  await page.locator('#search').fill('');
  await page.locator('#unit').selectOption('additional');
  assert.equal(await page.locator('#youtube-cards .card').count(),0,'two general video pages retained as old Google Sites links');
  assert.equal(await page.locator('#video-cards .card').count(),2);
  await page.locator('#unit').selectOption('6');
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('unit')?.value==='6');
  assert.equal(await page.locator('#youtube-cards .card').count(),1,'deep link persists');
  assert.match(await page.locator('#youtube-cards .card a').getAttribute('href'),/2OSrvzNW9FE/);
  await page.setViewportSize({width:390,height:844});
  const dims=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(dims[1]<=dims[0]+2,'no horizontal overflow at 390px');
  await page.screenshot({path:path.join(out,'unit06-video-on-mobile.png'),fullPage:false});
  assert.deepEqual(errors,[]);
  console.log('PASS V74 Chromium: 27 YouTube entries, 17+17 source links, 14 unit filters, click-only privacy player, Unit10 warning, Unit11 working, 390px mobile');
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
}
main().catch(e=>{console.error('FAIL V74 original YouTube concept-video gallery QA',e);server.close();process.exitCode=1;});
