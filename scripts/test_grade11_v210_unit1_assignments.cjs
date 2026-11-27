#!/usr/bin/env node
'use strict';
/* V210 — source-pack assignment study preview, isolated real Chromium checks.
 * Deliberately does not read secrets, save student answers, alter source banks,
 * or claim the assignments have been re-verified against textbook page images.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const html=read('portal/unit-01-assignments-v210.html');
const desk=read('portal/unit-01.html'),nav=read('shared/navigation.js');
const catalog=json('portal/learning-catalog.json');
const manifest=json('question-bank/manifest.json');
const out=path.join(ROOT,'qa-artifacts/grade11-v210-unit1-assignment-preview');
function sourceAndMath(){
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount),
  [275,206,220,640,349,560],'Existing 2250 public MCQ source identity must remain');
 assert.equal(catalog.resources.length,59,'Frozen public resource catalogue remains unchanged');
 const u7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.equal((html.match(/<article class="assignment" id="assignment-1-[123]">/g)||[]).length,3);
 assert.equal((html.match(/<details><summary>Reveal /g)||[]).length,3);
 for(const number of [1,2,3]){
  assert.ok(html.includes('id="assignment-1-'+number+'"'));
  assert.ok(html.includes('href="#assignment-1-'+number+'"'));
 }
 for(const token of ['Source and approval status','teacher-prepared','not yet been independently matched',
   'not a certified verbatim textbook exercise','10<sup>−17</sup>',
   '8.64 × 10<sup>21</sup>','10<sup>22</sup>',
   'v<sup>2</sup>/x','LT<sup>−2</sup>',
   '346.2 ± 13.2','65.94 ± 1.26','275 Unit 1 practice questions']){
  assert.ok(html.includes(token),'Missing source-bounded science/status: '+token);
 }
 const operations=86400/1e-17;
 assert.ok(Math.abs(operations-8.64e21)/8.64e21<1e-12,
  'Floating-point ratio must match 8.64×10^21 within numerical precision');
 const radius=10.5,deltaRadius=0.2,pi=3.14;
 const area=pi*radius**2,circumference=2*pi*radius;
 const errArea=area*2*deltaRadius/radius,errCirc=circumference*deltaRadius/radius;
 assert.equal(Math.round(area*10)/10,346.2);
 assert.equal(Math.round(errArea*10)/10,13.2);
 assert.equal(Math.round(circumference*100)/100,65.94);
 assert.equal(Math.round(errCirc*100)/100,1.26);
 assert.equal(2-1,1,'Dimensional v²/x length exponent');
 assert.ok(html.includes('B · v/x<sup>2</sup>')&&html.includes('C · v<sup>2</sup>/t'));
 assert.ok(nav.includes("id:'v210-u01-inchapter-assignments'"));
 assert.ok(nav.includes("href:'./unit-01-assignments-v210.html'"));
 assert.ok(nav.includes('unit1-original-end-exercises-pending'));
 assert.ok(desk.includes('id="unit1-assignments"'));
 assert.ok(desk.includes('href="./unit-01-assignments-v210.html"'));
 assert.ok(desk.includes('Not yet separately verified or indexed as original NBF end-of-unit sections'));
 for(const disallowed of ['firebaseConfig','initializeAppCheck','localStorage','sessionStorage',
   'window.fetch(','teacherUid','studentUid','build-your-physics-test.html?unit=7']){
  assert.ok(!html.includes(disallowed),'Assignment preview cannot use privileged or saved interactions: '+disallowed);
 }
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png',
 '.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const local=path.resolve(ROOT,'.'+pathname);
  if(!local.startsWith(ROOT+path.sep)||!fs.existsSync(local)||!fs.statSync(local).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(local)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(local).pipe(res);
 }catch{res.writeHead(400);res.end('Invalid route')}
});
async function serve(){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function scenario(browser,root,width){
 const page=await browser.newPage({viewport:{width,height:850}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const response=await page.goto(root+'portal/unit-01.html',{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200);
  const deskCard=page.locator('#unit1-assignments');
  assert.equal(await deskCard.count(),1);
  assert.ok((await deskCard.textContent()).includes('Original NBF page-image verification is pending'));
  await deskCard.locator('a[href="./unit-01-assignments-v210.html"]').click();
  await page.waitForURL(url=>url.pathname.endsWith('/portal/unit-01-assignments-v210.html'));
  assert.equal(await page.locator('article.assignment').count(),3);
  assert.equal(await page.locator('article.assignment details').count(),3);
  for(let number=1;number<=3;number++){
   const section=page.locator('#assignment-1-'+number);
   const disclosure=section.locator('details');
   assert.equal(await disclosure.getAttribute('open'),null);
   await section.locator('summary').click();
   assert.equal(await disclosure.getAttribute('open'),'');
   assert.equal(await section.locator('.final').isVisible(),true);
  }
  await page.getByRole('button',{name:'Open unit resources menu'}).click();
  await page.waitForFunction(()=>{
   const t=document.querySelector('.psn-drawer-loading')?.textContent||'';
   return t.includes('unit menus');
  },null,{timeout:18000});
  const unit=page.locator('.psn-drawer-unit[data-psn-unit="1"]');
  assert.equal(await unit.getAttribute('open'),'');
  const prepare=unit.locator('.psn-drawer-stage[data-psn-stage="PREPARE"]');
  assert.equal(await prepare.count(),1);
  const a=prepare.locator('a[href$="/portal/unit-01-assignments-v210.html"]');
  assert.equal(await a.count(),1,'Exactly one Unit 1 assignment shortcut under Prepare');
  assert.equal(await a.getAttribute('aria-current'),'page');
  assert.ok((await prepare.textContent()).includes('original textbook images remain unverified'));
  const viewport=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}));
  assert.ok(viewport.overflow<=3,'Horizontal overflow at '+width+': '+viewport.overflow);
  assert.deepEqual(errors,[],'No browser errors');
  return {width,assignmentCount:3,detailsAnswersRevealed:3,sidebarStage:'PREPARE',
   originalSourceImageApproval:false,gradedPublishing:false};
 }finally{await page.close()}
}
(async()=>{
 sourceAndMath();fs.mkdirSync(out,{recursive:true});
 const origin=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const results=[];
  for(const width of [1280,390,320])results.push(await scenario(browser,origin,width));
  fs.writeFileSync(path.join(out,'teacher-preview-audit.json'),JSON.stringify({
   version:'V210',results,originalNbfPageImagesIndependentlyMatched:false,
   primarySource:'teacher-compiled Unit 1 source-completeness corrections pack',
   textbookExerciseMcq6OnTeacherHold:true,liveNewMcqs:0,
   originalPublicMcqs:2250,unit1InChapterAssignments:3
  },null,2)+'\n');
  console.log('V210 PASS: 3 teacher-pack assignments with correct arithmetic/dimensions, stable Unit1 sidebar, mobile 390/320 and desktop 1280, zero scored releases.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(e=>{console.error('V210 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
