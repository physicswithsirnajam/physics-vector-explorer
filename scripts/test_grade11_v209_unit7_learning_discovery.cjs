#!/usr/bin/env node
'use strict';
/* V209 — browse source-anchored unscored Unit 7 lessons only.
 * No MCQ publishing, grade/answer changes, Firebase or teacher account use.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const manifest=JSON.parse(read('question-bank/manifest.json'));
const unit7=catalog.grades.find(x=>x.grade===11).units.find(x=>x.unit===7);
const nav=read('shared/navigation.js');
const quick=read('portal/exam-quick-access.html');
const study=[
 ['7.1','./unit-07-learning-intro-v145.html','Classification of solids'],
 ['7.2','./unit-07-topic72-deformation-v162.html','Deformation in Solids'],
 ['7.3','./unit-07-topic73-elastic-energy-v163.html','Elastic Potential Energy']
];
const resultsDir=path.join(ROOT,'qa-artifacts/grade11-v209-unscored-unit7-discovery');
function safety(){
 assert.equal(catalog.resources.length,59,'No original resource records inserted');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),[275,206,220,640,349,560]);
 assert.equal(unit7.status,'planned');
 assert.equal(unit7.questionBankCount,0);
 assert.equal(unit7.assessmentStatus,'not-published');
 assert.deepEqual(unit7.resourceIds,[]);
 assert.equal(unit7.learningPreviewStatus,'public-topic-7.1-introduction-only','Keep compatible source-backed introductory sentinel');
 assert.equal(unit7.learningPreviewHref,study[0][1]);
 assert.equal(unit7.additionalLearningPreviews.length,2);
 assert.deepEqual(unit7.additionalLearningPreviews.map(x=>x.topic),['7.2','7.3']);
 for(let i=0;i<2;i++){
  const actual=unit7.additionalLearningPreviews[i],expected=study[i+1];
  assert.equal(actual.href,expected[1]);
  assert.equal(actual.access,'public-unscored-study-teacher-review');
 }
 assert.match(unit7.summary,/Three public unscored study lessons/);
 assert.match(unit7.studentNotice,/graded assessment are not available as approved student tests/);
 assert.ok(nav.includes('function comingSoon('));
 assert.ok(nav.includes('unit.additionalLearningPreviews||[]'));
 assert.ok(nav.includes("unit.learningPreviewStatus==='public-topic-7.1-introduction-only'"));
 assert.ok(!quick.includes('build-your-physics-test.html?unit=7'));
 assert.ok(quick.includes('id="unit7-unscored-study-preview"'));
 for(const [topic,url,label] of study){
  const local='portal/'+url.slice(2);
  assert.ok(fs.existsSync(path.join(ROOT,local)),topic+' lesson source missing');
  const html=read(local);
  assert.ok(html.includes('<h1'),topic+' lesson title missing');
  assert.ok(quick.includes('href="'+url+'"'),topic+' quick access link missing');
  assert.ok(quick.includes(label),topic+' quick access title missing');
 }
 const first=read('portal/unit-07-learning-intro-v145.html');
 assert.ok(first.includes('./unit-07-topic72-deformation-v162.html'));
 assert.ok(first.includes('./unit-07-topic73-elastic-energy-v163.html'));
 for(const bad of ['firebase.firestore','sendReport','teacherUid','initializeAppCheck']){
  assert.ok(!nav.includes(bad),'Sidebar must not gain account/report backend');
 }
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const f=path.resolve(ROOT,'.'+pathname);
  if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){
   res.writeHead(404);res.end('Not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch{res.writeHead(400);res.end('Invalid route')}
});
async function serve(){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function browse(browser,root,width){
 const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const journeys=[];
 try{
  let response=await page.goto(root+'student-guide.html',{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200);
  await page.getByRole('button',{name:'Open unit resources menu'}).click();
  await page.waitForFunction(()=>{
   const text=document.querySelector('.psn-drawer-loading')?.textContent||'';
   return text.includes('unit menus');
  },null,{timeout:18000});
  const coming=page.locator('#psn-resource-drawer .psn-drawer-future').first();
  await coming.locator('summary').click();
  assert.ok((await coming.innerText()).includes('Three public unscored learning lessons'));
  assert.ok((await coming.innerText()).includes('Teacher review in progress'));
  const links=await coming.locator('a[href*="unit-07-"]').evaluateAll(as=>as.map(a=>({
   text:a.textContent.trim(),href:new URL(a.href).pathname
  })));
  for(const [topic,href] of study){
   assert.equal(links.filter(x=>x.href.endsWith(href.slice(2))).length,1,
    'Sidebar must link exactly once to '+topic);
  }
  assert.equal(await coming.getByRole('link',{name:/Unit 7.*Build.*Test|Unit 7.*MCQ Practice/}).count(),0);
  const go=coming.getByRole('link',{name:/Unit 7 · Topic 7\.2/});
  await go.click();
  await page.waitForURL(url=>url.pathname==='/portal/unit-07-topic72-deformation-v162.html');
  assert.equal(await page.locator('h1').count(),1);
  journeys.push('global-sidebar-to-topic7.2');
  response=await page.goto(root+'portal/exam-quick-access.html',{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200);
  const block=page.locator('#unit7-unscored-study-preview');
  assert.equal(await block.count(),1);
  assert.ok(await block.getByText('No graded Unit 7 test is available yet.',{exact:false}).count()>=1);
  const quickLinks=block.locator('a[href]');
  assert.equal(await quickLinks.count(),3);
  for(const [topic,href] of study){
   assert.equal(await block.locator('a[href="'+href+'"]').count(),1,topic+' quick link missing');
  }
  await block.locator('a[href="./unit-07-topic73-elastic-energy-v163.html"]').click();
  await page.waitForURL(url=>url.pathname==='/portal/unit-07-topic73-elastic-energy-v163.html');
  assert.equal(await page.locator('h1').count(),1);
  journeys.push('exam-quick-access-to-topic7.3');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=3,'Topic 7.3 horizontal overflow at '+width+'px: '+overflow);
  assert.deepEqual(errors.filter(x=>/TypeError|ReferenceError|navigation|catalog/i.test(x)),[]);
  return {width,journeys,unit7ScoredBankPublished:false};
 }finally{await page.close()}
}
(async()=>{
 safety();fs.mkdirSync(resultsDir,{recursive:true});
 const root=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const results=[];
  for(const width of [1280,390,320])results.push(await browse(browser,root,width));
  fs.writeFileSync(path.join(resultsDir,'audit.json'),JSON.stringify({
   version:'V209',results,unscoredLearningTopics:['7.1','7.2','7.3'],
   teacherAcademicApproval:'pending',unit7ScoredQuestionsPublished:0,
   originalTextbookExercisesPublished:false,originalBankCountsUnchanged:true,
   affectedStudentAccounts:0,affectsFirebase:false
  },null,2)+'\n');
  console.log('V209 PASS: Unit 7 three source-backed unscored lessons accessible via sidebar and Exam Quick Access (1280, 390, 320); scored release remains zero.');
 }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(err=>{console.error('V209 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
