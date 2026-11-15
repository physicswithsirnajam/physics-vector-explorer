#!/usr/bin/env node
"use strict";
/*
 * V47: true Chromium SLO lesson navigator and filtered Student/Teacher projectors.
 * All 12 Unit 4 SLO subsets are checked against the ORIGINAL unmodified 80-MCQ bank.
 * No grade saving, authentication or background submissions.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),http=require("node:http"),path=require("node:path");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,".."),screens=path.join(root,"qa-artifacts","unit04-v47");
fs.mkdirSync(screens,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const bank=JSON.parse(read("question-bank/grade-11/unit-04-v39-80-practice.json"));
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const audit=JSON.parse(read("portal/unit-04-slo-audit.json"));
const SLO=["P-11-B-07","P-11-B-08","P-11-B-09","P-11-B-10","P-11-B-14","P-11-B-15","P-11-B-16","P-11-B-17","P-11-B-18","P-11-B-19","P-11-B-20","P-11-B-21"];
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let target=path.resolve(root,"."+p);
  if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,"index.html");
  if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end("Not found");return;}
  res.writeHead(200,{"Content-Type":mime[path.extname(target)]||"application/octet-stream","Cache-Control":"no-store"});
  fs.createReadStream(target).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
function verifySource(){
 assert.equal(bank.status,"practice-pilot");assert.equal(bank.questions.length,80);
 assert.equal(bank.structure.straight,56);assert.equal(bank.structure.scenario,24);
 const counts=new Map(SLO.map(s=>[s,0])),groups=new Map();
 for(const [i,q] of bank.questions.entries()){
  assert.equal(q.sourceQuestionNumber,i+1);assert.ok(counts.has(q.sloCodes[0]));
  assert.equal(q.assessmentClassification,"summative-theory");
  counts.set(q.sloCodes[0],counts.get(q.sloCodes[0])+1);
  if(q.scenarioSetId){
   assert.ok(q.stimulusText);
   if(!groups.has(q.scenarioSetId))groups.set(q.scenarioSetId,[]);
   groups.get(q.scenarioSetId).push(q);
  }
 }
 assert.deepEqual([...counts.values()],[6,8,8,5,8,8,5,6,8,6,8,4]);
 assert.equal(groups.size,6);
 assert.equal([...counts.values()].reduce((a,b)=>a+b,0),80);
 const u4=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===4);
 assert.equal(u4.resourceIds.length,18);
 assert.equal(new Set(u4.resourceIds).size,18);
 assert.ok(u4.resourceIds.includes("unit4-slo-focus"));
 assert.equal(u4.assessmentStatus,"provisional-unit4-integrated-80-mark-classroom-practice");
 const r=catalog.resources.filter(x=>x.id==="unit4-slo-focus");
 assert.equal(r.length,1);assert.equal(r[0].href,"./unit-04-slo-focus.html");assert.equal(r[0].public,true);
 assert.equal(audit.sloFocusedClassroomPracticePublished,true);
 assert.equal(audit.sloFocusedPracticePage,"./unit-04-slo-focus.html");
 assert.equal(audit.protectedOrGradedAssessmentPublished,false);
 assert.equal(audit.studentGradesRecorded,false);
 const u3=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===3);
 assert.equal(u3.questionBankCount,80);assert.equal(u3.resourceIds.length,10);
 for(const p of ["portal/unit-04.html","portal/unit-04-assessment-pack.html"]){
  assert.ok(read(p).includes('href="./unit-04-slo-focus.html"'),"Missing Unit 4 discovery link: "+p);
 }
 for(const p of ["portal/unit-04-projector-practice.html","portal/unit-04-discussion-slides.html"]){
  assert.ok(read(p).includes('id="focusBadge"'),"Missing focus status badge "+p);
 }
 const student=read("portal/unit-04-projector-practice.js");
 assert.ok(!student.includes("solutionHeading")&&!student.includes("solutionExplanation")&&!student.includes("correct-label"));
 for(const p of ["portal/unit-04-projector-practice.js","portal/unit-04-discussion-slides.js","portal/unit-04-slo-focus.js"]){
  const s=read(p);
  for(const bad of ["localStorage","sessionStorage","indexedDB","Firestore","setDoc","sendBeacon","innerHTML"]){
   assert.ok(!s.includes(bad),"Public lesson source should not save data or insert raw HTML: "+p+" "+bad);
  }
 }
}
async function waitReady(page){await page.waitForFunction(()=>document.querySelector("#loadStatus")?.textContent.includes("Ready"),null,{timeout:30000});}
async function browser(){
 await new Promise((res,rej)=>server.once("error",rej).listen(0,"127.0.0.1",res));
 const browser=await chromium.launch({headless:true});
 try{
  const base="http://127.0.0.1:"+server.address().port+"/portal/";
  const page=await browser.newPage({viewport:{width:1290,height:900},deviceScaleFactor:1});
  const errors=[],writes=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("request",r=>{if(r.method()!=="GET")writes.push(r.method()+" "+r.url());});
  await page.goto(base+"unit-04-slo-focus.html",{waitUntil:"networkidle"});
  await page.waitForFunction(()=>document.querySelector("#status")?.textContent.includes("Ready"),null,{timeout:30000});
  assert.equal(await page.locator("#sloGrid .card").count(),12);
  assert.equal(await page.locator("#sloGrid .link-pill").count(),24);
  for(const [i,slo] of SLO.entries()){
   const items=bank.questions.filter(q=>q.sloCodes[0]===slo);
   const card=page.locator("#sloGrid .card").nth(i);
   assert.equal(await card.locator(".slo").textContent(),slo);
   assert.equal(await card.locator(".stat").textContent(),items.length+" original MCQs");
   assert.ok((await card.textContent()).includes(items.filter(q=>q.scenarioSetId).length+" contextual"));
   const anchors=card.locator("a");
   const student=new URL(await anchors.nth(0).getAttribute("href"),base);
   const teacher=new URL(await anchors.nth(1).getAttribute("href"),base);
   assert.equal(student.pathname,"/portal/unit-04-projector-practice.html");
   assert.equal(teacher.pathname,"/portal/unit-04-discussion-slides.html");
   assert.equal(student.searchParams.get("slo"),slo);
   assert.equal(teacher.searchParams.get("slo"),slo);
  }
  await page.screenshot({path:path.join(screens,"01-slo-navigator-desktop.png"),fullPage:false});
  await page.setViewportSize({width:390,height:844});
  const overview=await page.evaluate(()=>({v:document.documentElement.clientWidth,s:document.documentElement.scrollWidth}));
  assert.ok(overview.s<=overview.v+2,"Navigator horizontal overflow "+JSON.stringify(overview));
  await page.screenshot({path:path.join(screens,"02-slo-navigator-mobile.png"),fullPage:false});
  await page.setViewportSize({width:1290,height:900});
  // Check every objective's exact selected sequence, original Q numbers, and all passages.
  for(const [sloIndex,slo] of SLO.entries()){
   const questions=bank.questions.filter(q=>q.sloCodes[0]===slo);
   const studentUrl=base+"unit-04-projector-practice.html?slo="+encodeURIComponent(slo);
   await page.goto(studentUrl,{waitUntil:"networkidle"});
   await waitReady(page);
   assert.ok((await page.locator("#loadStatus").textContent()).includes(slo));
   assert.equal(await page.locator("#autoAdvance").isChecked(),true);
   await page.locator("#autoAdvance").uncheck();
   await page.locator("#startBtn").click();
   for(const [i,q] of questions.entries()){
    assert.equal(await page.locator("#slideIndex").textContent(),"Q "+q.sourceQuestionNumber+" / 80 · focus "+(i+1)+" / "+questions.length);
    assert.equal(await page.locator("#questionText").textContent(),q.stem);
    assert.deepEqual(await page.locator("#answersGrid .option-text").allTextContents(),q.options.map(o=>o.text));
    assert.equal(await page.locator("#answersGrid .option.correct").count(),0);
    assert.equal(await page.locator("#focusBadge").isVisible(),true);
    assert.ok((await page.locator("#focusBadge").textContent()).includes(slo));
    if(q.scenarioSetId){
     assert.equal(await page.locator("#scenarioPane").isVisible(),true);
     assert.equal(await page.locator("#scenarioText").textContent(),q.stimulusText);
    }else assert.equal(await page.locator("#scenarioPane").isVisible(),false);
    if(i<questions.length-1)await page.locator("#nextBtn").click();
   }
   const unrelated=bank.questions.find(q=>q.sloCodes[0]!==slo);
   await page.locator("#jumpInput").fill(String(unrelated.sourceQuestionNumber));
   await page.locator("#jumpBtn").click();
   assert.equal(await page.locator("#slideIndex").textContent(),"Q "+questions[questions.length-1].sourceQuestionNumber+" / 80 · focus "+questions.length+" / "+questions.length);
   assert.ok((await page.locator("#timerState").textContent()).includes("outside the selected SLO"));
   if(sloIndex===0)await page.screenshot({path:path.join(screens,"03-focused-timed-mcq.png"),fullPage:false});
   await page.locator("#nextBtn").click();
   assert.ok((await page.locator("#timerState").textContent()).includes("Presentation complete"));
   // Post-practice discussion for exactly these bank questions.
   await page.goto(base+"unit-04-discussion-slides.html?slo="+encodeURIComponent(slo),{waitUntil:"networkidle"});
   await waitReady(page);
   await page.locator("#startBtn").click();
   for(const [i,q] of questions.entries()){
    assert.equal(await page.locator("#stepIndex").textContent(),"Discussion "+(2*i+1)+" / "+(questions.length*2));
    assert.equal(await page.locator("#questionIndex").textContent(),"Q "+q.sourceQuestionNumber+" / 80 · focus "+(i+1)+" / "+questions.length);
    assert.equal(await page.locator("#questionText").textContent(),q.stem);
    assert.equal(await page.locator("#solutionPanel").isVisible(),false);
    assert.equal(await page.locator("#optionGrid .option.correct").count(),0);
    assert.equal(await page.locator("#nextBtn").isEnabled(),false);
    if(q.scenarioSetId)assert.equal(await page.locator("#contextText").textContent(),q.stimulusText);
    await page.locator("#revealBtn").click();
    assert.equal(await page.locator("#stepIndex").textContent(),"Discussion "+(2*i+2)+" / "+(questions.length*2));
    assert.equal(await page.locator("#solutionPanel").isVisible(),true);
    assert.equal(await page.locator("#solutionExplanation").textContent(),q.explanation);
    assert.equal(await page.locator("#optionGrid .option.correct .letter").textContent(),q.correctOptionId);
    if(i<questions.length-1)await page.locator("#nextBtn").click();
   }
   // Focused jump to an original question outside the subset must not reveal anything.
   await page.locator("#jumpInput").fill(String(unrelated.sourceQuestionNumber));
   await page.locator("#jumpBtn").click();
   assert.ok((await page.locator("#teacherNotice").textContent()).includes("outside this SLO-focused"));
   await page.locator("#jumpInput").fill(String(questions[0].sourceQuestionNumber));
   await page.locator("#jumpBtn").click();
   assert.equal(await page.locator("#stepIndex").textContent(),"Discussion 1 / "+(questions.length*2));
   assert.equal(await page.locator("#solutionPanel").isVisible(),false);
   if(sloIndex===0)await page.screenshot({path:path.join(screens,"04-focused-teacher-discussion.png"),fullPage:false});
  }
  // Reject invalid SLO query without silently showing the entire 80 question bank.
  for(const endpoint of ["unit-04-projector-practice.html","unit-04-discussion-slides.html"]){
   await page.goto(base+endpoint+"?slo=P-11-B-11",{waitUntil:"networkidle"});
   assert.ok((await page.locator("#loadStatus").textContent()).includes("Invalid summative Unit 4 SLO"));
   assert.equal(await page.locator("#startBtn").isEnabled(),false);
  }
  assert.deepEqual(errors,[],"No unexpected browser runtime errors"); 
  assert.deepEqual(writes,[],"No student answer or grade submissions");
  console.log("PASS V47: all 12 original-bank SLO subsets, 80 source-mapped questions and source-accurate response options; 24 SLO lesson links.");
  console.log("PASS V47: focused timed projector remains answer-free, all contextual passages retained, 12 exact teacher subset sequences with explicit reveal.");
  console.log("PASS V47: invalid/unrelated original Q jumps rejected; full-bank regression checks run separately; no grade writes.");
 }finally{await browser.close();}
}
verifySource();
browser().catch(err=>{console.error("FAIL V47:",err.stack||err);process.exitCode=1;}).finally(()=>server.close());
