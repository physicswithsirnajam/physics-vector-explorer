#!/usr/bin/env node
'use strict';
/* V96-D — Exact student entrypoint URL hygiene, migration archive source
 * preservation and public-route inventory. No source auto-edits and no
 * Firebase/student authorization bypass. Browser runs against synthetic local
 * server and public test pages, without login credentials. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const entrypoints=['shared/navigation.js','portal/learning-hub.js','portal/index.html','portal/simulations.html','portal/legacy-hssc-resources.html','student-guide.html','portal/unit-01.html'];
const original=JSON.parse(read('portal/legacy-hssc-resources-v73.json'));
const direct=JSON.parse(read('portal/hssc-concept-videos-v74.json'));
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const unit=manifest.grades.find(g=>g.grade===11).units.find(x=>x.unit===6);
const unitCat=catalog.grades.find(g=>g.grade===11).units.find(x=>x.unit===6);
const gate=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
function enumerate(folder){
 const out=[];
 for(const ent of fs.readdirSync(folder,{withFileTypes:true})){
  const f=path.join(folder,ent.name);
  if(ent.isDirectory())out.push(...enumerate(f));
  else if(ent.isFile()&&/\.html$/i.test(ent.name))out.push(f);
 }
 return out;
}
function staticAudit(){
 for(const name of entrypoints){
  assert.equal(read(name).includes('sites.google.com'),false,'Old Google Sites still referenced in student entrypoint '+name);
  assert.equal(/https?:\/\/sites\.google\.com/.test(read(name)),false,'No direct URL may appear '+name);
 }
 assert.ok(read('shared/navigation.js').includes("link('portal/legacy-hssc-resources.html','Notes & Concept Videos','videos')"));
 assert.ok(read('portal/index.html').includes('href="./legacy-hssc-resources.html"'));
 assert.ok(read('portal/simulations.html').includes('href="./unit-06-learning-desk-v95a.html"'));
 assert.ok(!read('portal/learning-hub.js').includes('officialSite'));
 assert.ok(!read('shared/navigation.js').includes('verifiedSite'));
 assert.equal(original.videoPages.length,15);
 assert.equal(original.generalVideos.length,2);
 assert.equal(original.pdfHandouts.length,17);
 assert.equal(original.extraReading.length,1);
 assert.ok([...original.videoPages,...original.generalVideos].every(r=>r.pageUrl.startsWith('https://sites.google.com/')),
 'Preserve owner original migration inventory; archival URLs are not student navigation');
 assert.equal(direct.videos.length,27);
 assert.equal(direct.uniqueVideoCount,26);
 assert.equal(catalog.resources.length,59);
 assert.equal(unit.liveMcqCount,560);
 assert.equal(unit.perQuestionSloVerified,false);
 assert.equal(unit.exactFbiseModeReady,false);
 assert.equal(unitCat.status,'planned');
 assert.equal(unitCat.assessmentStatus,'not-published');
 assert.equal(unitCat.practicePreviewStatus,'public-provisional');
 assert.equal(gate.releaseApproved,false);
 assert.equal(read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/).length,561);
 const publicFiles=[...fs.readdirSync(root,{withFileTypes:true})
   .filter(x=>x.isFile()&&x.name.endsWith('.html')).map(x=>path.join(root,x.name)),
   ...enumerate(path.join(root,'portal'))];
 const findings=[];
 for(const f of publicFiles){
  const text=fs.readFileSync(f,'utf8');
  for(const [i,line] of text.split(/\r?\n/).entries()){
   if(/href\s*=\s*["']https?:\/\/sites[.]google[.]com/i.test(line)){
    findings.push({file:path.relative(root,f).replace(/\\/g,'/'),line:i+1,kind:'literal-html-outbound-href'});
   }
  }
 }
 const out=path.join(root,'qa-artifacts','v96d');
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'remaining-public-html-google-sites-hrefs.json'),
 JSON.stringify({scanScope:'root and portal HTML',scanned:publicFiles.length,remainingLiteralHrefCount:findings.length,findings},null,2)+'\n');
 assert.equal(findings.length,0,'All root and portal HTML must be free of literal old-site outbound links');
 console.log('V96-D static PASS: 7 student entrypoints have zero old-site URLs; 17 legacy titles preserved for provenance, 27 direct YouTube links, 17 PDFs, 560 MCQs and assessment release gates closed.');
 console.log('V96-D inventory: '+publicFiles.length+' HTML pages scanned, '+findings.length+' remaining literal old-site hrefs logged for follow-up.');
 for(const finding of findings)console.log('V96-D REMAINING-LINK: '+finding.file+':'+finding.line);
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  let f=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f))throw Error('Not found');
  if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.statSync(f).isFile())throw Error('Not file');
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch{res.writeHead(404);res.end('Not found');}
});
async function browserAudit(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:840}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'student-guide.html',{waitUntil:'networkidle'});
  await page.locator('#psn-nav-menu-button, #psn-global-nav .psn-nav-menu-button').first().click();
  await page.waitForFunction(()=>document.querySelectorAll('#psn-resource-drawer .psn-drawer-unit').length===6);
  assert.equal(await page.locator('#psn-resource-drawer a[href*="sites.google.com"]').count(),0);
  assert.equal(await page.getByRole('link',{name:'Notes & Concept Videos'}).count(),1);
  await page.goto(base+'student-guide.html',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('a[href*="sites.google.com"]').count(),0);
 assert.equal(await page.locator('a[href="portal/legacy-hssc-resources.html"]').count(),1);
 await page.goto(base+'portal/unit-01.html',{waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('a[href*="sites.google.com"]').count(),0);
 assert.equal(await page.locator('a[href="./legacy-hssc-resources.html"]').count(),1);
 await page.goto(base+'portal/index.html',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('a[href*="sites.google.com"]').count(),0);
  assert.equal(await page.locator('.public-demo a[href="./legacy-hssc-resources.html"]').count(),1);
  await page.goto(base+'portal/simulations.html',{waitUntil:'networkidle'});
  assert.equal(await page.locator('a[href*="sites.google.com"]').count(),0);
  assert.equal(await page.locator('header a[href="./unit-06-learning-desk-v95a.html"]').count(),1);
  await page.waitForFunction(()=>document.querySelectorAll('#cards .card').length===31);
  await page.goto(base+'portal/legacy-hssc-resources.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelectorAll('.card').length===62);
  assert.equal(await page.locator('#video-cards .card').count(),17);
  assert.equal(await page.locator('#video-cards a').count(),0);
  assert.equal(await page.locator('a[href*="sites.google.com"]').count(),0);
  assert.equal(await page.locator('#youtube-cards .card').count(),27);
  assert.equal(await page.locator('#pdf-cards .card').count(),17);
  assert.equal(await page.locator('#extra-cards .card').count(),1);
  await page.locator('#unit').selectOption('6');
  assert.equal(await page.locator('#youtube-cards .card').count(),1);
  assert.equal(await page.locator('#video-cards .card').count(),1);
  await page.setViewportSize({width:390,height:844});
  const width=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(width[1]<=width[0]+2,'Mobile overflow in archived library '+width);
  assert.deepEqual(errors,[],'Unexpected browser errors on migrated student pages');
  console.log('V96-D browser PASS: global drawer, portal sign-in, simulation directory and source-video library have no old-site outbound links; 17 archived titles non-clickable, direct YouTube/PDF counts and phone layout preserved.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
async function main(){staticAudit();await browserAudit()}
main().catch(e=>{console.error('V96-D FAILED',e);server.close();process.exitCode=1});
