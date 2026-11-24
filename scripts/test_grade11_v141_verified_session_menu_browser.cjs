#!/usr/bin/env node
'use strict';
/* V141: isolated browser DOM test of REAL top-right session-menu module.
 * Fake users exist only within headless Chromium to exercise presentation;
 * this is NOT a Firebase, role, token, class or protected-data access test.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v141-session-header');
const protectedPaths=[
 'portal/index.html','portal/styles.css','portal/app.js','portal/session-menu-v141.js',
 'portal/academic-enrollment.js','portal/attempt-sync.js',
 'question-bank/manifest.json','question-bank/grade-11/unit-06-topic-61-v76-80-source.json',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const hash=buf=>crypto.createHash('sha256').update(buf).digest('hex');
const original=Object.fromEntries(protectedPaths.map(p=>[p,hash(fs.readFileSync(path.join(root,p)))]));
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.mjs':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
 '.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 try{
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
  if(!file.startsWith(root+path.sep))throw Error('outside repository');
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('bad route')}
});
async function listen(){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
function staticGuard(){
 const app=fs.readFileSync(path.join(root,'portal/app.js'),'utf8');
 const index=fs.readFileSync(path.join(root,'portal/index.html'),'utf8');
 const menu=fs.readFileSync(path.join(root,'portal/session-menu-v141.js'),'utf8');
 const rules=fs.readFileSync(path.join(root,'portal/academic-enrollment.js'),'utf8');
 assert.ok(index.includes('id="psn-account-holder"')&&index.includes('hidden'));
 assert.ok(index.includes('id="psn-account-trigger"'));
 assert.ok(index.includes('id="psn-account-signout"'));
 assert.ok(index.includes('href="./#my-profile"'));
 assert.ok(index.includes('href="./#my-progress"'));
 assert.ok(index.includes('app.js?v=141'));
 assert.ok(menu.includes('user.emailVerified!==true'));
 assert.ok(menu.includes('textContent=name'));
 assert.ok(menu.includes('sessionUid=null'));
 assert.ok(menu.includes("if(!sessionUid)return"));
 assert.ok(!menu.includes('getFirestore('));
 assert.ok(!menu.includes('localStorage'));
 assert.ok(!menu.includes('setCustomUserClaims'));
 assert.ok(app.includes("import {createSessionMenu} from './session-menu-v141.js'"));
 assert.ok(app.includes('const sessionMenu=createSessionMenu({onSignOut:()=>logout()});'));
 assert.ok(app.includes('sessionMenu.show(user,displayName)'));
 assert.ok(app.includes("sessionMenu.show(user,user.displayName||user.email||'Administrator')"));
 assert.ok(app.includes("if(name==='auth'){\n  sessionMenu.hide();"));
 assert.ok(app.includes('const token=await user.getIdTokenResult(true);'));
 assert.ok(app.includes('if(current!==navigationToken||auth.currentUser?.uid!==user.uid) return;'));
 assert.ok(app.includes('if(token.claims.admin===true'));
 assert.ok(app.includes("screen('auth');pane('login');return;"));
 assert.ok(app.includes("await signOut(auth)"));
 assert.ok(app.includes("['#student-top','#learning-hub','#my-progress','#my-profile','#privacy-centre'].includes(location.hash)"));
 assert.ok(!app.includes('setCustomUserClaims'));
 assert.ok(rules.includes('readEnrollment'));
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'question-bank/manifest.json'),'utf8'));
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
 const hold=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(hold.releaseApproved,false);
 assert.equal(hold.teacherSignoff,'pending');
 assert.equal(hold.studentCourseStatus,'planned');
}
async function main(){
 staticGuard();fs.mkdirSync(out,{recursive:true});
 const base=await listen(),reports=[];
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:830},deviceScaleFactor:1});
   // Test real existing portal HTML and menu module, but no Firebase connection.
   // Auth state is simulated for UI only; no security/role claim is inferred.
   await page.route('https://www.gstatic.com/**',route=>route.abort());
   assert.equal((await page.goto(base+'portal/index.html',{waitUntil:'domcontentloaded'})).status(),200);
   const holder=page.locator('#psn-account-holder');
   assert.equal(await holder.isVisible(),false,'account should start hidden');
   await page.evaluate(async()=>{
    const module=await import('./session-menu-v141.js');
    window.fakeLogoutCount=0;
    window.v141Menu=module.createSessionMenu({onSignOut:async()=>{
     window.fakeLogoutCount++;
     window.v141Menu.hide();
    }});
   });
   const unverified=await page.evaluate(()=>window.v141Menu.show({
    uid:'test-unverified',email:'test@example.invalid',emailVerified:false,displayName:'Unverified'
   },'Unverified'));
   assert.equal(unverified,false);
   assert.equal(await holder.isVisible(),false);
   await page.evaluate(()=>window.v141Menu.show({
    uid:'test-learner-1',email:'learner@example.invalid',emailVerified:true,displayName:'Learner'
   },'Sample Learner'));
   assert.equal(await holder.isVisible(),true);
   assert.equal(await page.locator('#psn-account-name').innerText(),'Sample Learner');
   assert.equal(await page.locator('#psn-account-avatar').innerText(),'S');
   await page.locator('#psn-account-trigger').click();
   assert.equal(await page.locator('#psn-account-popover').getAttribute('open'),'');
   assert.equal(await page.locator('#psn-account-email').innerText(),'learner@example.invalid');
   assert.equal(await page.locator('a[href="./#my-profile"]').getAttribute('href'),'./#my-profile');
   assert.equal(await page.locator('a[href="./#my-progress"]').getAttribute('href'),'./#my-progress');
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#psn-account-popover').getAttribute('open'),null);
   assert.equal(await page.evaluate(()=>document.activeElement?.id),'psn-account-trigger');
   await page.locator('#psn-account-trigger').click();
   // Exercise outside click without navigating away from the mounted module.
   // Opening again and clicking outside never signs out.
   await page.locator('#psn-account-trigger').click();
   await page.evaluate(()=>document.body.dispatchEvent(new MouseEvent('click',{bubbles:true})));
   assert.equal(await page.locator('#psn-account-popover').getAttribute('open'),null);
   assert.equal(await page.evaluate(()=>window.fakeLogoutCount),0);
   // Account switch must not retain previous person's visible information.
   await page.evaluate(()=>window.v141Menu.show({
    uid:'test-account-2',email:'second@example.invalid',emailVerified:true,displayName:'Different'
   },'<img src=x onerror=alert(1)>'));
   assert.equal(await page.locator('#psn-account-name').innerText(),'<img src=x onerror=alert(1)>');
   assert.equal(await page.locator('#psn-account-holder img').count(),0,'name was interpreted as untrusted markup');
   assert.equal(await page.locator('#psn-account-email').innerText(),'second@example.invalid');
   await page.locator('#psn-account-trigger').click();
   await page.locator('#psn-account-signout').click();
   assert.equal(await holder.isVisible(),false);
   assert.equal(await page.evaluate(()=>window.fakeLogoutCount),1);
   assert.equal(await page.locator('#psn-account-email').innerText(),'');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,
    'Account menu causes mobile overflow');
   reports.push({width,initiallyHidden:true,unverifiedRejected:true,verifiedSessionVisible:true,
    profileLinksPresent:true,escapeAndOutsideClose:true,accountSwitchClearsOldEmail:true,
    signOutDelegatedToOwner:true,htmlInputNotExecuted:true,backendAuthTested:false});
   await page.close();
  }
 }finally{
  if(browser)await browser.close();
  await new Promise(ok=>server.close(ok));
 }
 assert.equal(reports.length,3);
 assert.deepEqual(Object.fromEntries(protectedPaths.map(p=>[p,hash(fs.readFileSync(path.join(root,p)))])),original,
  'Read-only V141 test modified protected source or question data');
 fs.writeFileSync(path.join(out,'status.json'),JSON.stringify({
  version:'V141',tested:'header menu only; simulated verified/unverified accounts',
  screenWidths:[1280,390,320],checks:reports,
  noAuthBackendAttempted:true,teacherPermissionsReleased:false,
  studentClassIsolationNotYetCertified:true,
  originalQuestionsChanged:false,unit6AcademicReleaseStillPending:true
 },null,2)+'\n');
 console.log('V141 PASS: real portal header menu hidden for signed-out/unverified; verified display, Escape, outside click, profile links, user switch, signout callback, XSS text, 1280/390/320px; no backend access claims.');
}
main().catch(e=>{console.error('V141 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
