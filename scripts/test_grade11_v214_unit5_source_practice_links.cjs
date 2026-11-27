#!/usr/bin/env node
'use strict';
/* V214 — Grade XI Unit 5 linked source-based examples and separate
 * teacher-authored descriptive practice sections; no new question bank,
 * official NBF exercise mapping, scored tests, auth or student record writes.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const parse=p=>JSON.parse(read(p));
const catalog=parse('portal/learning-catalog.json');
const manifest=parse('question-bank/manifest.json');
const v103=parse('portal/verified-textbook-index-v103.json');
const v104=parse('portal/verified-descriptive-index-v104.json');
const nav=read('shared/navigation.js');
const desk=read('portal/unit-05.html');
const study=read('portal/unit-05-work-study.html');
const student=read('portal/unit-05-descriptive-student.html');
const out=path.join(ROOT,'qa-artifacts/grade11-v214-unit5-source-practice-navigation');
const links=[
 {id:'v214-u05-worked-example-51',stage:'PRACTISE',
  title:'Example 5.1 adapted',href:'./unit-05-work-study.html#example51',
  marker:'Worked example based on NBF Example 5.1'},
 {id:'v214-u05-resistive-case',stage:'PRACTISE',
  title:'Teacher resistive medium case',href:'./unit-05-work-study.html#resistance',
  marker:'Work–energy theorem in a resistive medium'},
 {id:'v214-u05-section-b',stage:'PREPARE',
  title:'Teacher Section B',href:'./unit-05-descriptive-student.html#shortTitle',
  marker:'Section B — Short / Numerical Response'},
 {id:'v214-u05-section-c',stage:'PREPARE',
  title:'Teacher Section C',href:'./unit-05-descriptive-student.html#longTitle',
  marker:'Section C — Extended / Numerical Response'}
];
function sourceAudit(){
 const units=catalog.grades.find(g=>g.grade===11).units;
 const u5=units.find(u=>u.unit===5),u7=units.find(u=>u.unit===7);
 assert.equal(catalog.resources.length,59,'Existing 59-source resources not modified');
 assert.equal(u5.questionBankCount,349,'Original 349 source bank unchanged');
 assert.equal(u7.questionBankCount,0);
 assert.equal(u7.assessmentStatus,'not-published');
 assert.deepEqual(manifest.grades.find(x=>x.grade===11).units.map(x=>x.liveMcqCount),
  [275,206,220,640,349,560],'All 2250 pinned MCQ identities preserved');
 assert.equal(v103.entries.filter(x=>x.unit===5).length,0,'No Unit5 original numbered source references verified in V103');
 assert.equal(v104.records.filter(x=>x.unit===5).length,0,'No Unit5 original descriptive question-number index in V104');
 assert.ok(study.includes('id="example51"'));
 assert.equal((study.match(/id="example51"/g)||[]).length,1);
 assert.ok(study.includes('Worked example based on NBF Example 5.1'));
 assert.ok(study.includes('id="resistance"'));
 assert.ok(student.includes('id="shortTitle"'));
 assert.ok(student.includes('id="longTitle"'));
 assert.ok(student.includes('seven Section B question pairs'));
 assert.ok(student.includes('two Section C question pairs'));
 assert.ok(student.includes('never loads the separate teacher key'));
 assert.ok(desk.includes('id="unit5-source-practice-finders"'));
 assert.ok(desk.includes('id="unit5-exercise-mapping-status"'));
 assert.ok(desk.includes('349 central Unit 5 practice MCQs remain provisional'));
 assert.ok(desk.includes('These are not an index of original NBF end-of-unit short responses'));
 assert.ok(nav.includes("unit5-original-exercises-unmapped"));
 assert.ok(nav.includes('teacher-created illustration'));
 for(const x of links){
  assert.equal(nav.split("id:'"+x.id+"'").length-1,1);
  assert.ok(nav.includes("href:'"+x.href+"'"),'Missing safe direct link '+x.id);
  assert.ok(desk.includes('href="'+x.href+'"'), 'Learning Desk link missing '+x.title);
  assert.ok((x.href.includes('work-study')?study:student).includes(
    'id="'+x.href.split('#')[1]+'"'),'Destination anchor not authored '+x.title);
 }
 const w=16.8*4.90*Math.cos(Math.PI/6)-0.170*4.90;
 assert.ok(Math.abs(w-70.46)<0.05,'Source-adapted Example 5.1 net work sanity');
 const v=Math.sqrt(2*(0.5*5*2**2+(30-12)*4)/5);
 assert.ok(Math.abs(v-5.73)<0.01,'Teacher example speed sanity');
 for(const forbidden of ['firebase.firestore','studentUid','teacherUid','getAuth()']){
  assert.ok(!desk.includes(forbidden),'Public index should never introduce privileged backend access');
 }
}
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const file=path.resolve(ROOT,'.'+pathname);
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('Missing');return;
  }
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('Invalid route')}
});
async function serve(){
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
async function scenario(browser,base,width,selected){
 const page=await browser.newPage({viewport:{width,height:860}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const result={width,found:[],opened:[],sourceImageVerified:false,gradedPublication:false};
 try{
  const openMenu=async()=>{
   await page.getByRole('button',{name:'Open unit resources menu'}).click();
   await page.waitForFunction(()=>(
    document.querySelector('.psn-drawer-loading')?.textContent||''
   ).includes('unit menus'),null,{timeout:18000});
  };
  assert.equal((await page.goto(base+'portal/unit-05.html',{waitUntil:'domcontentloaded'})).status(),200);
  await openMenu();
  const unit=page.locator('.psn-drawer-unit[data-psn-unit="5"]');
  assert.equal(await unit.count(),1);
  const prepare=unit.locator('.psn-drawer-stage[data-psn-stage="PREPARE"]');
  const disclosure=prepare.locator('[data-psn-source-status="unit5-original-exercises-unmapped"]');
  assert.equal(await disclosure.count(),1);
  assert.match(await disclosure.textContent(),/not numbered original NBF end-of-unit/);
  for(const x of links){
   const stage=unit.locator('.psn-drawer-stage[data-psn-stage="'+x.stage+'"]');
   const link=stage.locator('a[href$="'+x.href.slice(2)+'"]');
   assert.equal(await link.count(),1,'Expected exactly one '+x.title+' in '+x.stage);
   result.found.push(x.title);
  }
  for(const selectedIndex of selected){
   const x=links[selectedIndex];
   const stage=unit.locator('.psn-drawer-stage[data-psn-stage="'+x.stage+'"]');
   if((await stage.getAttribute('open'))===null)await stage.locator('summary').click();
   await stage.locator('a[href$="'+x.href.slice(2)+'"]').click();
   const [p,h]=x.href.slice(2).split('#');
   await page.waitForURL(u=>u.pathname==='/portal/'+p&&u.hash==='#'+h,{timeout:12000});
   const section=page.locator('[id="'+h+'"]');
   await section.waitFor({state:'visible',timeout:12000});
   assert.match(await section.textContent(),new RegExp(x.marker.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   assert.ok(overflow<=3,'Horizontal overflow at '+width+' in '+x.title+': '+overflow);
   result.opened.push(x.title);
   await page.goto(base+'portal/unit-05.html',{waitUntil:'domcontentloaded'});
   await openMenu();
  }
  assert.deepEqual(errors.filter(e=>/ReferenceError|TypeError|navigation/i.test(e)),[]);
  return result;
 }finally{await page.close()}
}
(async()=>{
 sourceAudit();
 fs.mkdirSync(out,{recursive:true});
 const base=await serve();let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const results=[];
  results.push(await scenario(browser,base,1280,[0,1]));
  results.push(await scenario(browser,base,390,[2]));
  results.push(await scenario(browser,base,320,[3]));
  const opened=results.flatMap(x=>x.opened).sort();
  assert.deepEqual(opened,links.map(x=>x.title).sort());
  fs.writeFileSync(path.join(out,'navigation-audit.json'),JSON.stringify({
   version:'V214',results,existingSourceAdaptedExample51:1,
   existingTeacherIllustrativeNumerical:1,existingTeacherShortOrPairs:7,
   existingTeacherExtendedOrPairs:2,originalNbfEndExerciseMappingsPublished:0,
   teacherAcademicApproval:'pending',bankSourceChanges:0,studentWrites:0
  },null,2)+'\n');
  console.log('V214 PASS: Unit5 Example5.1, teacher resistance case, teacher Sections B/C direct navigation; 1280/390/320, original MCQ bank untouched');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error('V214 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
