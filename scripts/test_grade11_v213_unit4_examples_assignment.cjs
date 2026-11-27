#!/usr/bin/env node
'use strict';
/* V213 — read-only Unit 4 public worked-example and assignment navigation.
 * Browser smoke test, NOT proof of independent textbook page or answer approval.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const catalog=json('portal/learning-catalog.json');
const manifest=json('question-bank/manifest.json');
const index=json('portal/verified-textbook-index-v103.json');
const nav=read('shared/navigation.js'),desk=read('portal/unit-04.html');
const output=path.join(ROOT,'qa-artifacts/grade11-v213-unit4-examples-assignments');
const destinations=[
 {id:'v213-u04-example-41',kind:'example',section:'PRACTISE',label:'Example 4.1',
  file:'unit-04-rotation-study.html',anchor:'example',tag:'NBF WORKED EXAMPLE 4.1'},
 {id:'v213-u04-example-42',kind:'example',section:'PRACTISE',label:'Example 4.2',
  file:'unit-04-centripetal-study.html',anchor:'example42',tag:'NBF WORKED EXAMPLE 4.2'},
 {id:'v213-u04-example-43',kind:'example',section:'PRACTISE',label:'Example 4.3',
  file:'unit-04-angular-momentum-study.html',anchor:'example43',tag:'NBF EXAMPLE 4.3'},
 {id:'v213-u04-example-44',kind:'example',section:'PRACTISE',label:'Example 4.4',
  file:'unit-04-artificial-gravity-study.html',anchor:'example44',tag:'NBF EXAMPLE 4.4'},
 {id:'v213-u04-assignment-44',kind:'assignment',section:'PREPARE',label:'Assignment 4.4',
  file:'unit-04-artificial-gravity-study.html',anchor:'assignment44',tag:'NBF ASSIGNMENT 4.4'}
];
const links=destinations.map(x=>'./'+x.file+'#'+x.anchor);
function sourceIntegrity(){
 const u4=catalog.grades.find(g=>g.grade===11).units.find(x=>x.unit===4);
 const u7=catalog.grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
 assert.equal(catalog.resources.length,59,'Original resource catalogue frozen');
 assert.equal(u4.questionBankCount,640,'Unit 4 source MCQ bank unchanged');
 assert.equal(u7.questionBankCount,0,'Unit7 scored release still blocked');
 assert.equal(u7.assessmentStatus,'not-published');
 assert.deepEqual(manifest.grades.find(g=>g.grade===11).units.map(x=>x.liveMcqCount),
  [275,206,220,640,349,560],'All current public 2250 MCQ identities preserved');
 const sourceIndex=index.entries.filter(x=>x.unit===4);
 assert.equal(sourceIndex.length,2,'V103 original index has only Examples 4.1 and 4.2; do not silently expand source-certified index');
 assert.ok(sourceIndex.every(x=>x.kind==='textbook-example'));
 assert.ok(desk.includes('id="unit4-example-assignment-finder"'));
 assert.ok(desk.includes('not independent certification of textbook-page fidelity'));
 assert.ok(desk.includes('original NBF end-of-unit MCQs, short/extended responses and numbered numerical exercises'));
 assert.ok(nav.includes('unit4-original-end-exercises-pending'));
 assert.ok(nav.includes('Academic teacher approval of the current practice bank remains pending'));
 assert.ok(!desk.includes('build-your-physics-test.html?unit=7'));
 for(let i=0;i<destinations.length;i++){
  const x=destinations[i],h=links[i],content=read('portal/'+x.file);
  assert.ok(fs.existsSync(path.join(ROOT,'portal',x.file)),'Missing published existing source '+x.file);
  assert.ok(content.includes('id="'+x.anchor+'"'),'Missing stable public source anchor '+h);
  assert.ok(content.includes(x.tag),'Missing explicit source-labelled section '+x.label);
  assert.equal(nav.split("id:'"+x.id+"'").length-1,1,'Navigation must include exactly one '+x.id);
  assert.ok(nav.includes("href:'"+h+"'"),'Expected direct source page in menu '+x.label);
  assert.ok(desk.includes('href="'+h+'"'),'Learning Desk must deep link to '+x.label);
 }
 const formula=4*(20*2*Math.PI/60)**2;
 assert.ok(Math.abs(formula-17.55)<0.015,'Existing Assignment 4.4 given values should produce about 17.55 m/s²');
 assert.ok(read('portal/unit-04-artificial-gravity-study.html').includes('17.55 m/s²'));
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 try{
  const reqPath=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const filepath=path.resolve(ROOT,'.'+reqPath);
  if(!filepath.startsWith(ROOT+path.sep)||!fs.existsSync(filepath)||!fs.statSync(filepath).isFile()){
   res.writeHead(404);res.end('Missing file');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(filepath)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(filepath).pipe(res);
 }catch(e){res.writeHead(400);res.end('Invalid local path')}
});
async function serve(){
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function studentJourney(browser,base,width,selectedIndexes){
 const page=await browser.newPage({viewport:{width,height:860}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const evidence={width,foundExamples:0,foundAssignment:0,opened:[],horizontalOverflow:0};
 try{
  assert.equal((await page.goto(base+'portal/unit-04.html',{waitUntil:'domcontentloaded'})).status(),200);
  assert.equal(await page.locator('#unit4-example-assignment-finder').count(),1);
  await page.getByRole('button',{name:'Open unit resources menu'}).click();
  await page.waitForFunction(()=>(
   document.querySelector('.psn-drawer-loading')?.textContent||''
  ).includes('unit menus'),null,{timeout:18000});
  const unit=page.locator('.psn-drawer-unit[data-psn-unit="4"]');
  assert.equal(await unit.count(),1,'Unit4 must be present in global menu');
  const practise=unit.locator('.psn-drawer-stage[data-psn-stage="PRACTISE"]');
  const prepare=unit.locator('.psn-drawer-stage[data-psn-stage="PREPARE"]');
  assert.equal(await prepare.locator('[data-psn-source-status="unit4-original-end-exercises-pending"]').count(),1);
  assert.ok((await prepare.textContent()).includes('40-mark Sections B/C practice is teacher-prepared'));
  for(let i=0;i<destinations.length;i++){
   const x=destinations[i],stage=x.section==='PRACTISE'?practise:prepare;
   const link=stage.locator('a[href$="'+links[i].slice(2)+'"]');
   assert.equal(await link.count(),1,'Must be exactly one '+x.label+' in '+x.section);
   if(x.kind==='example')evidence.foundExamples++;else evidence.foundAssignment++;
  }
  for(const i of selectedIndexes){
   const x=destinations[i],stage=x.section==='PRACTISE'?practise:prepare;
   if((await stage.getAttribute('open'))===null)await stage.locator('summary').click();
   const link=stage.locator('a[href$="'+links[i].slice(2)+'"]');
   await link.click();
   await page.waitForURL(url=>url.pathname==='/portal/'+x.file&&url.hash==='#'+x.anchor,
    {timeout:12000});
   const destination=page.locator('[id="'+x.anchor+'"]');
   await destination.waitFor({state:'visible'});
   assert.ok((await destination.textContent()).includes(x.tag));
   evidence.opened.push(x.label);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   assert.ok(overflow<=3,'Source page overflows width '+width+' for '+x.label+': '+overflow);
   evidence.horizontalOverflow=Math.max(evidence.horizontalOverflow,overflow);
   // Return to source Learning Desk for the next menu shortcut.
   await page.goto(base+'portal/unit-04.html',{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(
    document.querySelector('.psn-drawer-loading')?.textContent||''
   ).includes('unit menus'),null,{timeout:18000});
  }
  assert.deepEqual(errors.filter(e=>/TypeError|ReferenceError|Cannot read|navigation/i.test(e)),[],
    'No navigation runtime exceptions');
  return evidence;
 }finally{await page.close()}
}
(async()=>{
 sourceIntegrity();fs.mkdirSync(output,{recursive:true});
 const base=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const result=[];
  result.push(await studentJourney(browser,base,1280,[0,1]));
  result.push(await studentJourney(browser,base,390,[2,4]));
  result.push(await studentJourney(browser,base,320,[3]));
  const opened=result.flatMap(x=>x.opened).sort();
  assert.deepEqual(opened,['Example 4.1','Example 4.2','Example 4.3','Example 4.4','Assignment 4.4'].sort());
  fs.writeFileSync(path.join(output,'audit.json'),JSON.stringify({
   version:'V213',studentJourneys:result,
   verifiedPublishedDestinations:5,inChapterExamples:4,inChapterAssignments:1,
   v103FrozenUnit4SourceIndex:2,fullOriginalEndOfUnitExerciseMapping:false,
   teacherScientificApproval:'pending',newOrEditedQuestionBankItems:0
  },null,2)+'\n');
  console.log('V213 PASS: 4 existing examples + 1 in-chapter assignment reachable from Unit4 sidebar, source anchors and mobile navigation; original bank untouched.');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{
 console.error('V213 FAILED:',error.stack||error);process.exitCode=1;
 try{server.close()}catch{}
});
