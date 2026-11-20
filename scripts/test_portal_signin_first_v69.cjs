#!/usr/bin/env node
'use strict';
/* V69: sign-in-first portal chrome. All browser auth views are synthetic:
 * NOT a Firebase Auth test, Firestore rules test, or paid-content protection.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'qa-artifacts/portal-v69');
fs.mkdirSync(output,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 try{
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return;}
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(err){res.writeHead(500);res.end(String(err));}
});
function audit(){
 const portal=read('portal/index.html'),css=read('shared/navigation.css'),app=read('portal/app.js');
 const nav=read('shared/navigation.js');
 assert.match(portal,/<body class="psn-portal-auth-gated">/);
 assert.match(portal,/href="\.\/" aria-label="Physics with Sir Najam portal home"/);
 assert.match(portal,/id="auth-screen" class="auth-layout"/);
 assert.match(portal,/id="dashboard-screen" class="dashboard" hidden/);
 assert.match(portal,/id="admin-screen"[^>]*hidden/);
 assert.match(portal,/id="panel-login"/);
 assert.match(portal,/id="panel-signup"/);
 assert.match(portal,/id="panel-reset"/);
 assert.match(portal,/id="panel-verify"/);
 assert.ok(portal.includes('./privacy.html'),'privacy route still available from login');
 assert.ok(css.includes('body.psn-portal-auth-gated:not(.psn-portal-access-approved) #psn-global-nav'));
 assert.ok(css.includes('body.psn-portal-auth-gated:not(.psn-portal-access-approved) #psn-resource-drawer'));
 assert.ok(css.includes('body.psn-portal-auth-gated:not(.psn-portal-access-approved) .topbar .header-link'));
 assert.ok(css.includes('body.psn-portal-auth-gated:not(.psn-portal-access-approved) .public-demo'));
 assert.ok(app.includes("document.body.classList.toggle('psn-portal-access-approved',name==='dashboard'||name==='admin')"));
 assert.ok(app.includes("getIdTokenResult(true)"),'original claim checking preserved');
 assert.ok(app.includes('if(!user.emailVerified)'), 'verified-email access decision preserved');
 assert.ok(app.includes('readEnrollment(db,user)'), 'academic enrollment check preserved');
 assert.ok(nav.includes('psn-portal-shell-closed'),'drawer must close on logout');
 assert.ok(nav.includes('permitNavigation'),'quiz departure warning preserved');
 assert.equal(JSON.parse(read('portal/simulation-catalog.json')).simulations.length,31);
 const units=JSON.parse(read('question-bank/manifest.json')).grades.find(x=>x.grade===11).units;
 assert.deepEqual(units.slice(0,5).map(x=>x.liveMcqCount),[275,206,220,640,349]);
  assert.equal(units.find(x=>x.unit===6)?.liveMcqCount,554);
 assert.equal(units.slice(0,5).reduce((n,x)=>n+x.liveMcqCount,0),1690);
  assert.equal(units.reduce((n,x)=>n+x.liveMcqCount,0),2244);
 console.log('PASS V69 static: original 1690 MCQs/31 simulations intact; login, signup, reset, email verification and navigation isolation retained');
}
async function main(){
 audit();
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // No real authentication, Firebase calls or personal data are used in CI.
  await page.route('**/portal/app.js*',route=>route.fulfill({status:200,contentType:'application/javascript',body:'/* local anonymous sign-in visual audit; no backend code executed */'}));
  const base='http://127.0.0.1:'+server.address().port+'/';
  await page.goto(base+'portal/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.getElementById('psn-global-nav')&&window.PSNWorkspaceTabs);
  assert.equal(await page.locator('#auth-screen').isVisible(),true);
  assert.equal(await page.locator('#panel-login').isVisible(),true);
  assert.equal(await page.locator('#login-form').isVisible(),true);
  assert.equal(await page.locator('#dashboard-screen').isHidden(),true);
  assert.equal(await page.locator('#admin-screen').isHidden(),true);
  assert.equal(await page.locator('#psn-global-nav').isHidden(),true,'top unit/resource navbar must be invisible to anonymous arrival');
  assert.equal(await page.locator('#psn-resource-drawer').isHidden(),true,'resource drawer must not be available before verified UI session');
  assert.equal(await page.locator('#psn-workspace-nav').isHidden(),true,'private dashboard tabs hidden');
  assert.equal(await page.locator('.topbar .header-link').isHidden(),true,'top external link must not distract login');
  assert.equal(await page.locator('.public-demo').isHidden(),true,'public demo CTA hidden from sign-in screen');
  assert.equal(await page.locator('.auth-card .privacy-inline-note a').first().isVisible(),true);
  await page.screenshot({path:path.join(output,'anonymous-sign-in-desktop.png'),fullPage:false});
  await page.setViewportSize({width:390,height:844});
  const dims=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(dims[1]<=dims[0]+2,'anonymous sign-in page overflows mobile');
  assert.equal(await page.locator('#psn-global-nav').isHidden(),true);
  await page.screenshot({path:path.join(output,'anonymous-sign-in-mobile.png'),fullPage:false});
  await page.setViewportSize({width:1280,height:900});
  // Synthetic DOM-only learner screen; production only sets this class after
  // verified email/profile/token checks in portal/app.js, which we inspect above.
  await page.evaluate(()=>{
   document.getElementById('auth-screen').hidden=true;
   document.getElementById('dashboard-screen').hidden=false;
   document.body.classList.add('psn-portal-access-approved');
   document.getElementById('enrolled-learner-content').hidden=false;
   document.getElementById('enrollment-gate').hidden=true;
  });
  assert.equal(await page.locator('#psn-global-nav').isVisible(),true,'navbar should show in the signed-in workspace view');
  assert.equal(await page.locator('#psn-workspace-nav').isVisible(),true);
  await page.screenshot({path:path.join(output,'synthetic-signed-in-navigation.png'),fullPage:false});
  await page.locator('#psn-global-nav .psn-nav-menu-button').click();
  assert.equal(await page.locator('#psn-resource-drawer').isVisible(),true);
  const wasOpen=await page.locator('#psn-global-nav .psn-nav-menu-button').getAttribute('aria-expanded');
  assert.equal(wasOpen,'true');
  await page.evaluate(()=>{
   document.body.classList.remove('psn-portal-access-approved');
   document.getElementById('dashboard-screen').hidden=true;
   document.getElementById('auth-screen').hidden=false;
   document.dispatchEvent(new Event('psn-portal-shell-closed'));
  });
  assert.equal(await page.locator('#psn-global-nav').isHidden(),true);
  assert.equal(await page.locator('#psn-resource-drawer').isHidden(),true);
  assert.equal(await page.locator('#psn-global-nav .psn-nav-menu-button').getAttribute('aria-expanded'),'false');
  assert.equal(await page.locator('#auth-screen').isVisible(),true);
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'','drawer scroll lock not removed at logout');
  // A public static HTML file is still publicly reachable by direct URL!
  // This is intentional: test does NOT claim server-side protected delivery.
  await page.goto(base+'portal/simulations.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelectorAll('#cards .card').length===31);
  assert.equal(await page.locator('#psn-global-nav').isVisible(),true,'public simulation pages remain public in this phase');
  assert.deepEqual(errors,[]);
  console.log('PASS V69 real Chromium: anonymous sign-in only, nav/links hidden, signed-in presentation, signout closes drawer, 390px mobile and public-file limitation visible');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(e=>{console.error('FAIL V69',e);server.close();process.exitCode=1});
