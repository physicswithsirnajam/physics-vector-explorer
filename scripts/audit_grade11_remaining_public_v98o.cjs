#!/usr/bin/env node
'use strict';
/* V98-O — Grade XI seven public source pages: navigation integrity + mobile QA.
 * Scans local link targets as files (no opening teacher/protected pages).
 * Browser interactions never submit grades, print keys, or reveal teacher sections.
 * All served from repository checkout, not the live website.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts','remaining-public-v98o');
const pages=[
 {path:'portal/unit-02.html',kind:'unit02',label:'Unit 2 Vector Learning Desk'},
 {path:'portal/unit-04.html',kind:'unit04',label:'Unit 4 Rotation Learning Desk'},
 {path:'portal/unit-05.html',kind:'unit05',label:'Unit 5 Work and Energy Learning Desk'},
 {path:'portal/legacy-hssc-resources.html',kind:'legacy',label:'Original Notes and Videos Directory'},
 {path:'portal/privacy.html',kind:'privacy',label:'Privacy and Account Information'},
 {path:'portal/unit-03-assessment-pack.html',kind:'assessment3',label:'Unit 3 public Assessment Pack'},
 {path:'portal/unit-04-assessment-pack.html',kind:'assessment4',label:'Unit 4 public Assessment Pack'}
];
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml',
 '.ico':'image/x-icon','.woff2':'font/woff2','.woff':'font/woff','.pdf':'application/pdf'};
const logo='header img[src*="physics-with-sir-najam-official-logo.png"]';
function localPath(raw){
 let pathname=decodeURIComponent(new URL(raw,'http://localhost').pathname);
 if(pathname.startsWith('/physics-vector-explorer/'))pathname=pathname.slice('/physics-vector-explorer'.length);
 if(pathname.endsWith('/'))pathname+='index.html';
 const file=path.resolve(root,'.'+pathname);
 return file.startsWith(root+path.sep)?file:null;
}
const server=http.createServer((req,res)=>{
 const file=localPath(req.url);
 if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){
  res.writeHead(404,{'Content-Type':'text/plain'});res.end('not found');return;
 }
 res.writeHead(200,{'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});
 fs.createReadStream(file).pipe(res);
});
function verifyLocalHrefs(){
 assert.equal(pages.length,7,'precisely seven public resource entries');
 assert.ok(fs.statSync(path.join(root,'portal/assets/physics-with-sir-najam-official-logo.png')).size>1000);
 const summaries=[],broken=[];
 for(const item of pages){
  assert.ok(!/secure-lesson|course-lesson|teacher-key|admin/i.test(item.path),'only public navigation pages');
  const html=fs.readFileSync(path.join(root,item.path),'utf8');
  assert.match(html,/<meta\s+name=["']viewport["']/i,'responsive viewport missing on '+item.path);
  assert.ok(html.includes('physics-with-sir-najam-official-logo.png'),'canonical logo reference missing on '+item.path);
  let verified=0,external=0,excluded=0;
  for(const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)){
   const href=match[1].trim();
   if(!href||href==='#'){excluded++;continue;}
   let url;
   try{url=new URL(href,'http://localhost/'+item.path);}catch{excluded++;continue;}
   if(url.protocol!=='http:'&&url.protocol!=='https:'){external++;continue;}
   if(url.origin!=='http://localhost'){external++;continue;}
   const target=localPath(url.pathname);
   if(target&&fs.existsSync(target)&&fs.statSync(target).isFile())verified++;
   else broken.push({page:item.path,href,resolvedPath:target?path.relative(root,target):'outside checkout'});
  }
  summaries.push({path:item.path,verifiedLocalLinks:verified,externalLinksNotOpened:external,ignored:excluded});
 }
 assert.deepEqual(broken,[],'all existing local page links must resolve; never open authenticated/teacher resources');
 console.log('V98-O source/local link PASS:',summaries.map(x=>x.path+' '+x.verifiedLocalLinks+' local hrefs').join('; '));
 return summaries;
}
async function smoke(page,item){
 if(item.kind==='unit02'||item.kind==='unit04'||item.kind==='unit05'){
  const targets={
   unit02:['./unit-02-formula-sheet.html','/portal/unit-02-formula-sheet.html'],
   unit04:['./unit-04-rotation-study.html','/portal/unit-04-rotation-study.html'],
   unit05:['./unit-05-work-study.html','/portal/unit-05-work-study.html']
  };
  const [href,pathname]=targets[item.kind];
  const a=page.locator('a[href="'+href+'"]').first();
  assert.equal(await a.count(),1,'public study-guide resource path exists in learning desk');
  await a.click();
  await page.waitForURL(u=>u.pathname===pathname);
  assert.ok((await page.title()).includes('Physics with Sir Najam'),'destination is branded study resource');
  return 'Learning Desk → real public study resource navigation';
 }
 if(item.kind==='privacy'){
  assert.ok((await page.locator('main').innerText()).includes('Privacy & Account Information'),'pilot privacy disclosure visible');
  assert.ok((await page.locator('main').innerText()).includes('not yet a finalized public privacy policy'),'correct pilot-only privacy caveat retained');
  await page.locator('a[href="./"]').first().click();
  await page.waitForURL(u=>u.pathname==='/portal/'||u.pathname==='/portal/index.html');
  return 'Pilot privacy disclosure and return to public portal';
 }
 if(item.kind==='legacy'){
  await page.waitForFunction(()=>/source entries shown/.test(document.getElementById('loading')?.textContent||''),null,{timeout:15000});
  const cards=page.locator('#pdf-cards .card, #youtube-cards .card, #video-cards .card, #extra-cards .card');
  assert.ok(await cards.count()>0,'original resource JSON catalogs populate the directory');
  await page.locator('#unit').selectOption('2');
  const u2=await cards.count();
  assert.ok(u2>0,'unit 2 has cataloged learning resources');
  const codes=await cards.evaluateAll(els=>els.map(e=>e.dataset.unit));
  assert.ok(codes.every(x=>x==='2'),'Unit 2 filter returns only matching source entries');
  await page.locator('#search').fill('no-matching-grade11-v98o-phrase');
  assert.equal(await cards.count(),0,'directory search filters to zero without opening external websites');
  await page.locator('#search').fill('');
  assert.equal(await cards.count(),u2,'clearing search restores unit 2 entries');
  // Do not play YouTube embeds, request Drive URLs or access external hosts.
  return 'Original PDF/video catalogs load; Unit 2 filter and no-match/clear search work';
 }
 if(item.kind==='assessment3'||item.kind==='assessment4'){
  await page.waitForFunction(()=>{
   const label=document.getElementById('loadStatus'),print=document.getElementById('printOMR');
   return label&&label.textContent.includes('Ready')&&print&&!print.disabled;
  },null,{timeout:15000});
  assert.equal(await page.locator('#blankStraight .omr-box').count(),4,'four original blank OMR columns');
  assert.equal(await page.locator('#blankScenarios .scenario-box').count(),6,'all six four-question scenario boxes');
  assert.equal(await page.locator('#teacherSection').isVisible(),false,'teacher display remains collapsed');
  // Intentionally do not click Show teacher resources, Print OMR, Print Key, Print ToS.
  return '80-blank-answer OMR with four columns and six scenarios loads; no print/teacher reveal';
 }
 throw Error('Unexpected public page category '+item.kind);
}
async function main(){
 const sourceLinks=verifyLocalHrefs();
 fs.mkdirSync(out,{recursive:true});
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const report={version:'V98-O',purpose:'Remaining seven public desks, resource directory, privacy and assessment landing pages',
   method:'Checked-out local repository, not live production',
   sourceLinks,pages:[],alerts:[],
   boundaries:['No user login','No protected/teacher page opened','No teacher resource reveal','No printing or grading','No Drive/YouTube media loaded','No student data accessed']};
  for(const item of pages){
   const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'});
   const errors=[],missing=[];
   page.on('pageerror',err=>errors.push(String(err.message).slice(0,260)));
   page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)missing.push({status:r.status(),uri:r.url().slice(origin.length).slice(0,175)});});
   const res=await page.goto(origin+'/'+item.path,{waitUntil:'domcontentloaded'});
   assert.equal(res.status(),200,'HTML page locally available '+item.path);
   const title=await page.title();
   assert.ok(title.includes('Physics with Sir Najam'),'correct original branding in page title '+item.path);
   const img=page.locator(logo).first();
   assert.equal(await img.count(),1,'original official logo in header '+item.path);
   await img.waitFor({state:'visible',timeout:15000});
   assert.ok((await img.getAttribute('alt')||'').length>9,'official logo meaningful alternative text');
   await page.waitForFunction(sel=>{const i=document.querySelector(sel);return i&&i.complete&&i.naturalWidth>0;},logo,{timeout:15000});
   const views=[];
   for(const width of [1280,390,320]){
    await page.setViewportSize({width,height:width===1280?850:844});
    await page.waitForTimeout(100);
    const metrics=await page.evaluate(sel=>{
     const i=document.querySelector(sel),r=i.getBoundingClientRect(),vw=document.documentElement.clientWidth,
       w=document.documentElement.scrollWidth;
     return {viewport:vw,documentWidth:w,pageOverflow:w>vw+2,
       logoVisible:r.width>0&&r.height>0&&getComputedStyle(i).display!=='none',logoWidth:Math.round(r.width)};
    },logo);
    assert.equal(metrics.logoVisible,true,'official logo visible on '+width+' '+item.path);
    const shot=item.path.split('/').join('-').replace('.html','')+'-'+width+'px.png';
    await page.screenshot({path:path.join(out,shot),fullPage:false,animations:'disabled'});
    views.push({...metrics,screenshot:shot});
    if(metrics.pageOverflow)report.alerts.push({page:item.path,viewport:width,type:'page-horizontal-overflow',documentWidth:metrics.documentWidth});
   }
   const interaction=await smoke(page,item);
   const uniqueErrors=[...new Set(errors)];
   for(const error of uniqueErrors)report.alerts.push({page:item.path,type:'javascript-error',message:error});
   for(const resource of missing)report.alerts.push({page:item.path,type:'missing-local-resource',...resource});
   report.pages.push({path:item.path,title,views,interaction,jsErrors:uniqueErrors.length,missingLocalResources:missing.length});
   console.log('Checked',item.path,views.map(x=>x.viewport+':'+x.documentWidth+(x.pageOverflow?' OVERFLOW':'')).join(' '),
     'student path:',interaction,'JS errors:',uniqueErrors.length,'local 404:',missing.length);
   await page.close();
  }
  fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(report,null,2)+'\n');
  const rows=report.pages.map(p=>'| '+p.path+' | '+p.views.map(v=>v.pageOverflow?'CHECK':'OK').join(' / ')+' | '+p.jsErrors+' | '+p.missingLocalResources+' |').join('\n');
  const lines=['# V98-O — Grade XI public remaining desks, source links and student resources','',
   'Locally served checked-out repository pages; not a production deployment or account audit.','',
   '| Public resource | 1280px / 390px / 320px page fit | JS errors | Local 404s |',
   '|---|---|---|---|',rows,'','## Local link integrity','',
   ...sourceLinks.map(x=>'- '+x.path+': '+x.verifiedLocalLinks+' valid local targets; '+x.externalLinksNotOpened+' external links left untouched'),
   '','## Functional student route checks','',
   ...report.pages.map(p=>'- '+p.path+': '+p.interaction),
   '','## Diagnostic alerts ('+report.alerts.length+')','',
   ...(report.alerts.length?report.alerts.map(a=>'- '+a.page+' '+(a.viewport||'runtime')+' '+a.type+' '+(a.documentWidth||a.message||''))
     :['None detected in this sample.']),
   '','## Scope limitations','',
   'Teacher-only resources are not opened or revealed; public assessment-pack source files are already fetched by their pre-existing scripts. This is not a security audit, teacher-answer secrecy claim, production sign-in test, source-content academic certification, or print-preview validation.',''];
  fs.writeFileSync(path.join(out,'report.md'),lines.join('\n'));
  console.log('V98-O completed seven original resource link and visual audits. Diagnostic alerts: '+report.alerts.length+'.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(err=>{console.error('V98-O FAILED:',err);server.close();process.exitCode=1;});
