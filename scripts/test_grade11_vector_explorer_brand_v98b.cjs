#!/usr/bin/env node
'use strict';
/* V98-B: exact official logo on the original vector explorer.
 * Regression preserves the entire old physics/science HTML after undoing only
 * the known brandmark HTML/CSS substitutions. No account data is accessed. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const originalMark='<div class="brandmark" aria-hidden="true">✦</div>';
const newMark='<div class="brandmark"><img src="portal/assets/physics-with-sir-najam-official-logo.png" alt="Physics with Sir Najam official logo" width="47" height="47" decoding="async"></div>';
const originalStyle='.brand strong{display:block;font-size:19px;letter-spacing:-.4px}';
const newStyle='.brandmark img{display:block;width:100%;height:100%;object-fit:contain}.brand strong{display:block;font-size:19px;letter-spacing:-.4px}';
const logo='portal/assets/physics-with-sir-najam-official-logo.png';
const addedCss='<link rel="stylesheet" href="shared/navigation.css?v=69">\n';
const addedStyle='.topactions a.btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}\n';
const addedLink='<a class="btn" href="portal/" aria-label="Return to the Physics learning portal">← Learning Portal</a>';
const addedJs='<script src="shared/navigation.js?v=69" defer></script>\n';
const fnv=s=>{let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h;};
function staticChecks(){
 const current=read('vector-explorer.html');
 for(const added of [addedCss,addedStyle,addedLink,addedJs])assert.equal(current.split(added).length,2,'exactly one navigation integration: '+added.slice(0,70));
 assert.equal(current.split(newMark).length,2,'exactly one original official image must replace the brandmark');
 assert.equal(current.split(newStyle).length,2,'one scoped image CSS rule');
 assert.ok(!current.includes(originalMark),'decorative star must be removed');
 assert.equal(fnv(current.replace(newMark,originalMark).replace(newStyle,originalStyle)
   .replace(addedCss,'').replace(addedStyle,'').replace(addedLink,'').replace(addedJs,'')),171963615,
   'entire original vector science HTML must remain unchanged except logo/brandmark CSS');
 assert.equal((current.match(/<img\b/g)||[]).length,1,'no duplicate logos');
 assert.ok(fs.statSync(path.join(root,logo)).size>1000,'exact official existing logo asset');
 assert.ok(current.includes('@media(max-width:680px)'),'existing phone layout unchanged');
 assert.ok(current.includes('body.projector'),'existing projector layout unchanged');
 assert.ok(current.includes('@media print'),'worksheet layout unchanged');
 assert.ok(current.includes("function setTab("),'original tab controller unchanged');
 assert.ok(current.includes("function pointerAngle("),'drag interaction unchanged');
 assert.ok(current.includes("function update("),'vector physics update unchanged');
 assert.ok(current.includes("window.print()"),'print worksheet remains available');
 console.log('V98-B source PASS: no change to original vector physics, worksheets, quizzes or behaviors.');
}
const mime={'.html':'text/html; charset=utf-8','.png':'image/png','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=http.createServer((req,res)=>{
 try{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname.startsWith('/physics-vector-explorer/'))pathname=pathname.slice('/physics-vector-explorer'.length);
  if(pathname==='/')pathname='/index.html';
  const full=path.resolve(root,'.'+pathname);
  if(!full.startsWith(root+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile())throw Error('not found');
  res.writeHead(200,{'Content-Type':mime[path.extname(full)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(full).pipe(res);
 }catch{res.writeHead(404);res.end('not found');}
});
async function browserChecks(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const out=path.join(root,'qa-artifacts','vector-brand-v98b');
  fs.mkdirSync(out,{recursive:true});
  for(const [name,prefix] of [['domain-root',''],['project-pages','/physics-vector-explorer']]){
   const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const resp=await page.goto(origin+prefix+'/vector-explorer.html',{waitUntil:'domcontentloaded'});
   assert.equal(resp.status(),200,name+' loads');
   const image=page.locator('header.top .brand .brandmark img');
   assert.equal(await image.count(),1,'exactly one official header image '+name);
   assert.equal(await image.getAttribute('alt'),'Physics with Sir Najam official logo','nonempty exact alt');
   assert.equal(await image.getAttribute('src'),logo,'the canonical image file must be referenced');
   await page.waitForFunction(()=>{const x=document.querySelector('header.top .brand .brandmark img');return x&&x.complete&&x.naturalWidth>0;});
   assert.equal(await image.isVisible(),true,'logo must display');
   assert.equal(await page.locator('header.top .brand strong').innerText(),'Physics with Sir Najam');
   assert.equal(await page.locator('#tab-components').getAttribute('aria-selected'),'true');
   assert.equal(await page.locator('#graph').count(),1,'original vector graph exists');
   const nav=page.locator('#psn-global-nav');
   await nav.waitFor({state:'visible'});
   assert.equal(await nav.count(),1,'exactly one shared global navigation bar '+name);
   const portalLink=page.getByRole('link',{name:'Return to the Physics learning portal'});
   assert.equal(await portalLink.count(),1,'explicit learning-portal return action');
   assert.equal(await portalLink.getAttribute('href'),'portal/');
   assert.equal(new URL(await portalLink.getAttribute('href'),page.url()).pathname,
    prefix+'/portal/','portal return link works under '+name+' prefix');
   assert.equal(await page.locator('#reset').isEnabled(),true);
   assert.equal(await page.locator('#print').isEnabled(),true);
   assert.equal(await page.locator('#projector').isEnabled(),true);
   // Exercise real original physics controls: switch tabs, adjust magnitude, reset.
   await page.locator('#tab-dot').click();
   assert.equal(await page.locator('#tab-dot').getAttribute('aria-selected'),'true','dot product works');
   await page.locator('#tab-cross').click();
   assert.equal(await page.locator('#tab-cross').getAttribute('aria-selected'),'true','cross product works');
   await page.locator('#tab-components').click();
   await page.locator('#mag-a').evaluate(el=>{el.value='15';el.dispatchEvent(new Event('input',{bubbles:true}));});
   assert.equal(await page.locator('#mag-a-value').innerText(),'15.0 N','slider redraws its result');
   await page.locator('#reset').click();
   assert.equal(await page.locator('#tab-components').getAttribute('aria-selected'),'true','reset restores components');
   assert.equal(await page.locator('#mag-a').inputValue(),'10','reset restores original magnitude');
   if(name==='domain-root')await page.screenshot({path:path.join(out,'vector-brand-desktop.png'),fullPage:false});
   await page.setViewportSize({width:390,height:844});
   await page.waitForTimeout(80);
   assert.equal(await image.isVisible(),true,'phone logo is visible');
   const imgBox=await image.boundingBox();
   assert.ok(imgBox.width>=30&&imgBox.width<=48,'compact original logo at phone size');
   const dims=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
   assert.ok(dims[1]<=dims[0]+2,'no horizontal page overflow on phone '+name+': '+dims);
   assert.equal(await page.locator('#graph').getAttribute('viewBox'),'95 8 530 492','mobile vector diagram remains responsive');
   if(name==='domain-root')await page.screenshot({path:path.join(out,'vector-brand-mobile.png'),fullPage:false});
   assert.deepEqual(errors,[],'no original vector/runtime errors '+name);
   await page.close();
  }
  console.log('V98-B/V99-X Chromium PASS: relocated Vector Explorer keeps original physics and logo at both local and GitHub-project prefixes; shared navigation, direct portal return, reset, tabs and mobile still work.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
(async()=>{staticChecks();await browserChecks();})().catch(e=>{console.error('V98-B FAILED',e);server.close();process.exitCode=1;});
