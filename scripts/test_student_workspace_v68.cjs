#!/usr/bin/env node
'use strict';
/* V68: static navigation/data-minimization audit + REAL Chromium visual UX.
 * IMPORTANT: learner dashboard is mocked as visible for layout tests only.
 * This does NOT simulate authentication or validate Firebase security rules.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts','workspace-v68');
fs.mkdirSync(out,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.b64':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
 try{
  let p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!p.startsWith(root+path.sep)||!fs.existsSync(p)){res.writeHead(404);res.end('Missing');return;}
  if(fs.statSync(p).isDirectory())p=path.join(p,'index.html');
  if(!fs.statSync(p).isFile()){res.writeHead(404);res.end('Missing');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(p).pipe(res);
 }catch(e){res.writeHead(500);res.end('Server error');}
});
function audit(){
 const simulations=JSON.parse(read('portal/simulation-catalog.json')).simulations;
 assert.equal(simulations.length,31,'keep all original published simulation links');
 const ids=new Set();
 for(const s of simulations){
  assert.ok(/^[a-z0-9-]+\.html$/.test(s.file),'untrusted simulation file');
  assert.ok(!ids.has(s.file),'duplicate simulation link');ids.add(s.file);
  assert.ok(fs.existsSync(path.join(root,s.file)),'missing published simulation '+s.file);
 }
 const navigation=read('shared/navigation.js');
 assert.ok(navigation.includes("link('portal/simulations.html','Simulations','simulations')"),
  'top Simulations tab must lead to the local catalog, not the external Google Sites homepage');
 assert.ok(!navigation.includes("label:'Simulations',key:'explore'"),'stale Google Sites Simulations alias');
 assert.ok(navigation.includes('permitNavigation'),'in-progress quiz warning removed');
 assert.ok(navigation.includes('Google Sites Student Hub (external)'),'Google Sites should remain clearly labeled');
 const portal=read('portal/index.html');
 for(const view of ['overview','learn','progress','profile','privacy']){
  assert.ok(portal.includes('data-workspace-tab="'+view+'"'));
  assert.ok(portal.includes('data-workspace-panel="'+view+'"'));
 }
 assert.ok(portal.includes('id="dashboard-screen" class="dashboard" hidden'),'private screen must initially be hidden');
 assert.ok(portal.includes('id="my-profile" data-workspace-panel="profile"'),'read-only profile section missing');
 assert.ok(portal.includes('workspace-tabs.js?v=68')&&portal.includes('workspace-tabs.css?v=68'));
 const app=read('portal/app.js'),tabs=read('portal/workspace-tabs.js');
 for(const k of ["if(!user.emailVerified)","getIdTokenResult(true)","profileFor(user)","readEnrollment(db,user)"]){
  assert.ok(app.includes(k),'existing verified-account controls must remain: '+k);
 }
 for(const field of ['profile-display-name','profile-email','profile-verification','profile-enrollment']){
  assert.ok(app.includes("'"+field+"'"),'signed-in profile must use existing auth/account fields');
 }
 assert.ok(tabs.includes('No account writes')||tabs.includes('No account writes,'));
 for(const forbidden of ['localStorage','sessionStorage','setDoc(','addDoc(','deleteDoc(','getFirestore(','updateProfile(','fetch(']){
  assert.ok(!tabs.includes(forbidden),'workspace nav unexpectedly accesses storage or private backend: '+forbidden);
 }
 assert.ok(!portal.includes('id="profile-photo"'),'new sensitive profile photo collection is not permitted in V68');
 assert.ok(!fs.existsSync(path.join(root,'firestore.rules')),'review deployment separately; no assumptions about Firebase rules');
 console.log('PASS V68 static: all 31 simulations resolve locally, top navigation correctly routed, five section views and private-account safety invariants retained');
}
async function main(){
 audit();
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',err=>err?reject(err):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'student-guide.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('psn-global-nav')!==null);
  const sims=page.locator('#psn-global-nav .psn-nav-links a').filter({hasText:'Simulations'});
  assert.equal(await sims.count(),1);
  assert.match(await sims.getAttribute('href'),/\/portal\/simulations\.html$/);
  await sims.click();
  await page.waitForURL(/\/portal\/simulations\.html$/);
  await page.waitForFunction(()=>document.querySelectorAll('#cards .card').length===31);
  assert.match(await page.locator('#results').textContent(),/31 of 31 simulations shown/);
  const link=page.locator('#cards .card a').first();
  assert.match(await link.getAttribute('href'),/^http:\/\/127\.0\.0\.1:\d+\//);
  assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
  await page.screenshot({path:path.join(out,'simulation-library-desktop.png'),fullPage:false});
  await page.locator('#search').fill('vector');
  const count=await page.locator('#cards .card').count();
  assert.ok(count>=2&&count<31,'simulation search not filtering visible cards');
  await page.locator('#search').fill('');
  await page.locator('#topic').selectOption('Waves and optics');
  assert.ok(await page.locator('#cards .card').count()>0);
  await page.locator('#topic').selectOption('');
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.locator('#search').isVisible());
  const dimensions=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(dimensions[1]<=dimensions[0]+2,'simulation catalog has mobile horizontal overflow');
  await page.screenshot({path:path.join(out,'simulation-library-mobile.png'),fullPage:false});
  // Layout-only account screen test: intercept auth module so no real user,
  // password, Firebase token, or backend request is used in CI.
  await page.route('**/portal/app.js*',route=>route.fulfill({
   status:200,contentType:'application/javascript',
   body:'/* V68 visual QA stub: no Firebase initialization, login or account permissions */'
  }));
  await page.setViewportSize({width:1280,height:900});
  await page.goto(base+'portal/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.PSNWorkspaceTabs&&document.getElementById('psn-workspace-nav'));
  assert.equal(await page.locator('#dashboard-screen').isHidden(),true,'real account data must not be visible by default');
  assert.equal(await page.locator('#auth-screen').isVisible(),true);
  // Explicitly force existing private dashboard DOM for visual testing only.
  await page.evaluate(()=>{
   document.getElementById('auth-screen').hidden=true;
   document.getElementById('dashboard-screen').hidden=false;
   document.getElementById('enrolled-learner-content').hidden=false;
   document.getElementById('enrollment-gate').hidden=true;
   document.getElementById('student-name').textContent='Example Student';
   document.getElementById('student-email').textContent='student@example.invalid';
   document.getElementById('profile-display-name').textContent='Example Student';
   document.getElementById('profile-email').textContent='student@example.invalid';
   document.getElementById('profile-verification').textContent='Verified email';
   document.getElementById('profile-enrollment').textContent='Grade XI · HSSC-I · FBISE';
   window.PSNWorkspaceTabs.select('overview');
  });
  assert.equal(await page.locator('#student-top').isVisible(),true);
  assert.equal(await page.locator('#learning-hub').isHidden(),true);
  assert.equal(await page.locator('#my-progress').isHidden(),true);
  assert.equal(await page.locator('#my-profile').isHidden(),true);
  assert.equal(await page.locator('#privacy-centre').isHidden(),true);
  assert.equal(await page.locator('#psn-workspace-nav a').count(),6);
  assert.match(await page.locator('#psn-workspace-nav a[href="./simulations.html"]').getAttribute('href'),/simulations\.html/);
  await page.screenshot({path:path.join(out,'dashboard-overview-desktop.png'),fullPage:false});
  await page.locator('#psn-workspace-nav a[href="#learning-hub"]').click();
  assert.equal(await page.locator('#learning-hub').isVisible(),true);
  assert.equal(await page.locator('#student-top').isHidden(),true);
  assert.equal(await page.locator('#psn-workspace-nav a[href="#learning-hub"]').getAttribute('aria-current'),'page');
  await page.locator('#psn-workspace-nav a[href="#my-progress"]').click();
  assert.equal(await page.locator('#my-progress').isVisible(),true);
  assert.equal(await page.locator('#learning-hub').isHidden(),true);
  await page.locator('#psn-workspace-nav a[href="#my-profile"]').click();
  assert.equal(await page.locator('#my-profile').isVisible(),true);
  assert.match(await page.locator('#profile-display-name').textContent(),/Example Student/);
  await page.screenshot({path:path.join(out,'read-only-profile-desktop.png'),fullPage:false});
  await page.locator('#my-profile a[href="#privacy-centre"]').click();
  assert.equal(await page.locator('#privacy-centre').isVisible(),true);
  assert.equal(await page.locator('#my-profile').isHidden(),true);
  assert.equal(await page.locator('#psn-workspace-nav a[href="#privacy-centre"]').getAttribute('aria-current'),'page');
  await page.setViewportSize({width:390,height:844});
  await page.locator('#psn-workspace-nav a[href="#my-profile"]').click();
  assert.equal(await page.locator('#my-profile').isVisible(),true);
  const mobile=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(mobile[1]<=mobile[0]+2,'workspace profile overflows 390px screen');
  const tab=page.locator('#psn-workspace-nav a[href="#my-profile"]');
  assert.equal(await tab.getAttribute('aria-current'),'page');
  await page.screenshot({path:path.join(out,'read-only-profile-mobile.png'),fullPage:false});
  await page.goto(base+'portal/#my-progress',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.PSNWorkspaceTabs?.current()==='progress');
  // The auth-only outer dashboard remains hidden until a verified login.
  assert.equal(await page.locator('#dashboard-screen').isHidden(),true);
  assert.equal(await page.locator('#my-profile').isHidden(),true);
  assert.equal(await page.locator('#psn-workspace-nav a[href="#my-progress"]').getAttribute('aria-current'),'page');
  assert.deepEqual(errors,[],'unexpected browser execution errors');
  console.log('PASS V68 Chromium: local 31-model library, filter/search, five workspace views, private profile/desktop/mobile, hash deep links, unauthenticated dashboard hidden');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(e=>{console.error('FAIL V68',e);server.close();process.exitCode=1});
