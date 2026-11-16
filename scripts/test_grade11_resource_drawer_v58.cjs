#!/usr/bin/env node
'use strict';
/* V58: first-five-unit resource sidebar integrity + actual Chromium student navigation.
 * No account writes, security-rule changes or original MCQ mutations.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts','drawer-v58');
fs.mkdirSync(out,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('portal/learning-catalog.json'));
const units=data.grades.find(g=>g.grade===11).units.filter(u=>u.status==='available');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const u=new URL(req.url,'http://localhost'),p=decodeURIComponent(u.pathname);
  let file=path.resolve(root,'.'+p);
  if(!file.startsWith(root+path.sep))throw Error('Outside public repository');
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Missing');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(404);res.end('Not found')}
});
function audit(){
 assert.equal(units.length,5);assert.equal(data.resources.length,59);
 assert.equal(units.reduce((n,u)=>n+u.resourceIds.length,0),59);
 assert.ok(read('shared/navigation.js').includes("portal/learning-catalog.json"),'public catalog must be source');
 assert.ok(read('shared/navigation.js').includes('permitNavigation'),'unfinished quiz protection must remain');
 assert.ok(read('shared/navigation.css').includes('#psn-resource-drawer'),'sidebar stylesheet must be namespaced');
 const files=new Set(data.resources.map(r=>r.href)
  .filter(h=>typeof h==='string'&&h.startsWith('./')&&h.includes('.html'))
  .map(h=>'portal/'+h.slice(2).split('?')[0]));
 assert.equal(files.size,51,'expected 51 independently accessible catalogue HTML files');
 for(const file of files){
  const html=read(file);
  assert.ok(html.includes('shared/navigation.js'),'resource missing V58 navbar: '+file);
  assert.ok(html.includes('shared/navigation.css'),'resource missing V58 css: '+file);
 }
 for(const file of ['portal/index.html','student-guide.html','build-your-physics-test.html',
  'practice-engine/index.html','assessment-blueprint/index.html']){
  assert.ok(read(file).includes('shared/navigation.js?v=58'),'student entry still using stale navigation asset '+file);
 }
 console.log('PASS V58 static: 5 released units, 59 public-catalog resource IDs, 51 linked HTML resources all use shared nav.');
}
async function main(){
 audit();
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1320,height:900}});
  const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'student-guide.html',{waitUntil:'networkidle'});
  const trigger=page.locator('#psn-global-nav .psn-nav-menu-button');
  assert.equal(await trigger.count(),1);
  assert.equal(await trigger.getAttribute('aria-expanded'),'false');
  assert.equal(await page.locator('#psn-resource-drawer').isHidden(),true);
  await trigger.click();
  await page.waitForFunction(()=>document.querySelectorAll('#psn-resource-drawer .psn-drawer-unit').length===5);
  assert.equal(await trigger.getAttribute('aria-expanded'),'true');
  assert.equal(await page.locator('#psn-resource-drawer').isVisible(),true);
  assert.equal(await page.locator('#psn-nav-backdrop').isVisible(),true);
  assert.equal(await page.locator('#psn-resource-drawer .psn-drawer-category-links a').count(),59,'all 59 catalogue resources must be in the drawer');
  assert.match(await page.locator('#psn-resource-drawer .psn-drawer-loading').textContent(),/5 published unit/);
  await page.locator('[data-psn-unit="4"] > summary').click();
  assert.equal(await page.locator('[data-psn-unit="4"]').evaluate(x=>x.open),true);
  const labs=page.locator('[data-psn-unit="4"] [data-psn-category="SIMULATIONS"]');
  assert.equal(await labs.count(),1);
  await labs.locator('summary').click();
  assert.ok(await labs.locator('a').count()>=4,'Unit 4 simulation links present');
  const href=await labs.locator('a').first().getAttribute('href');
  assert.ok(href.startsWith(base+'portal/unit-04-'),'simulation URL resolves to source resource');
  await page.screenshot({path:path.join(out,'01-sidebar-desktop-unit04-open.png'),fullPage:false});
  const protectedLink=page.locator('[data-psn-unit="2"] .psn-drawer-resource-link small').first();
  assert.ok((await protectedLink.textContent()).includes('Enrollment required')||
    (await protectedLink.textContent()).includes('Private account'));
  // ESC closes, restores keyboard focus to original trigger.
  await page.keyboard.press('Escape');
  assert.equal(await trigger.getAttribute('aria-expanded'),'false');
  assert.equal(await page.locator('#psn-resource-drawer').isHidden(),true);
  assert.equal(await trigger.evaluate(el=>document.activeElement===el),true);
  await trigger.click();
  await page.locator('#psn-nav-backdrop').click({position:{x:1270,y:840},force:true});
  assert.equal(await page.locator('#psn-resource-drawer').isHidden(),true);
  // Keyboard Tab may not escape modal drawer.
  await trigger.focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#psn-resource-drawer .psn-drawer-close').evaluate(el=>document.activeElement===el),true);
  await page.keyboard.press('Shift+Tab');
  const inDrawer=await page.evaluate(()=>document.getElementById('psn-resource-drawer').contains(document.activeElement));
  assert.equal(inDrawer,true,'keyboard focus must stay inside the open modal');
  await page.keyboard.press('Escape');
  console.log('PASS V58 desktop: 59 original resources in collapsible categories; accessible open, ESC, backdrop and keyboard focus.');

  await page.setViewportSize({width:390,height:844});
  await trigger.click();
  await page.waitForFunction(()=>document.querySelectorAll('#psn-resource-drawer .psn-drawer-unit').length===5);
  const size=await page.evaluate(()=>{
   const drawer=document.getElementById('psn-resource-drawer');
   return {vw:document.documentElement.clientWidth,sw:document.documentElement.scrollWidth,
     drawer:drawer.getBoundingClientRect().width,visible:!drawer.hidden};
  });
  assert.ok(size.sw<=size.vw+2,'390px page horizontal overflow '+JSON.stringify(size));
  assert.ok(size.drawer<=size.vw&&size.drawer>250,'sidebar must fit phone '+JSON.stringify(size));
  await page.locator('[data-psn-unit="5"] > summary').click();
  await page.screenshot({path:path.join(out,'02-sidebar-mobile-unit05-open.png'),fullPage:false});
  await page.locator('#psn-resource-drawer .psn-drawer-close').click();
  assert.equal(await page.locator('#psn-resource-drawer').isHidden(),true);
  console.log('PASS V58 mobile: drawer fits 390px without horizontal overflow and closes independently.');

  // Originally missing navigation on public Unit 1/2 pages: now consistent.
  for(const file of ['portal/unit-01.html','portal/unit-02.html','portal/simulations.html',
    'portal/unit-01-study-guide.html','portal/course-lesson.html']){
   await page.goto(base+file,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.getElementById('psn-global-nav')!==null);
   await page.locator('#psn-global-nav .psn-nav-menu-button').click();
   await page.waitForFunction(()=>document.querySelectorAll('#psn-resource-drawer .psn-drawer-unit').length===5);
   assert.equal(await page.locator('[data-psn-unit="1"]').count(),1,'drawer missing '+file);
   await page.keyboard.press('Escape');
   console.log('PASS previously missing nav: '+file);
  }

  // Existing unfinished-quiz navigation confirmation must still work.
  await page.setViewportSize({width:1320,height:900});
  await page.goto(base+'build-your-physics-test.html?units=1,3,5',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('availabilityCount').textContent.includes('704 eligible MCQ'));
  await page.locator('#quickStartLink').click();
  await page.waitForFunction(()=>!document.getElementById('start').classList.contains('hidden'));
  await page.locator('#begin').click();
  await page.waitForFunction(()=>!document.getElementById('quiz').classList.contains('hidden'));
  await page.locator('#psn-global-nav .psn-nav-menu-button').click();
  let warning=false;
  page.once('dialog',dialog=>{warning=true;dialog.dismiss()});
  await page.locator('#psn-resource-drawer .psn-drawer-quick a').filter({hasText:'Start Here'}).click();
  assert.equal(warning,true,'unfinished test must warn before leaving through sidebar');
  assert.match(page.url(),/practice-engine/,'cancelled warning must preserve the live test');
  assert.equal(await page.locator('#psn-resource-drawer').isVisible(),true,'cancelled navigation keeps menu open');
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#psn-resource-drawer .psn-drawer-quick a').filter({hasText:'Start Here'}).click();
  await page.waitForURL(/student-guide\.html/);
  assert.deepEqual(errs,[],'no unexpected browser errors');
  console.log('PASS V58 quiz: cancelled navigation protects unfinished answers; confirmed navigation follows requested link.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(e=>{console.error('FAIL V58',e);server.close();process.exitCode=1});
