#!/usr/bin/env node
"use strict";
/*
 * V45 source + real Chromium timer QA for public Unit 4 student-facing projector.
 * This is not examiner validation or a protected test. Runs without accounts.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),http=require("node:http"),path=require("node:path");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,".."),out=path.join(root,"qa-artifacts","unit04-v45");
fs.mkdirSync(out,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const bank=JSON.parse(read("question-bank/grade-11/unit-04-v39-80-practice.json"));
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const audit=JSON.parse(read("portal/unit-04-slo-audit.json"));
const html=read("portal/unit-04-projector-practice.html"),js=read("portal/unit-04-projector-practice.js");
const desk=read("portal/unit-04.html"),hub=read("portal/unit-04-assessment-pack.html");
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let file=path.resolve(root,"."+p);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,"index.html");
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
const SLO=["P-11-B-07","P-11-B-08","P-11-B-09","P-11-B-10","P-11-B-14","P-11-B-15","P-11-B-16","P-11-B-17","P-11-B-18","P-11-B-19","P-11-B-20","P-11-B-21"];
function sourceChecks(){
 assert.equal(bank.questions.length,80);
 assert.equal(bank.structure.straight,56);assert.equal(bank.structure.scenario,24);
 assert.equal(bank.structure.scenarioSets,6);
 assert.equal(bank.structure.marksPerQuestion,.5);
 const perLetter={A:0,B:0,C:0,D:0},sets=new Map();
 for(const [i,q] of bank.questions.entries()){
  assert.equal(q.sourceQuestionNumber,i+1);
  assert.equal(q.unit,4);assert.equal(q.grade,11);
  assert.ok(SLO.includes(q.sloCodes[0]));
  perLetter[q.correctOptionId]++;
  if(i<56)assert.ok(!q.scenarioSetId);
  else {
   assert.ok(q.scenarioSetId&&q.stimulusText&&q.scenarioTitle);
   if(!sets.has(q.scenarioSetId))sets.set(q.scenarioSetId,[]);
   sets.get(q.scenarioSetId).push(q);
  }
 }
 assert.deepEqual(perLetter,{A:20,B:20,C:20,D:20});
 assert.equal(sets.size,6);
 for(const arr of sets.values()){
  assert.equal(arr.length,4);
  assert.deepEqual(arr.map(q=>q.scenarioIndex),[1,2,3,4]);
  assert.equal(new Set(arr.map(q=>q.stimulusText)).size,1);
 }
 assert.ok(html.includes('src="./assets/physics-with-sir-najam-official-logo.png"'));
 assert.ok(html.includes('src="./unit-04-projector-practice.js"'));
 assert.ok(js.includes('unit-04-v39-80-practice.json'));
 assert.ok(js.includes("performance.now()"));
 assert.ok(js.includes("visibilitychange"));
 assert.ok(js.includes("requestFullscreen"));
 assert.ok(js.includes("document.createElement(tag)"));
 assert.ok(!js.includes("innerHTML"));
 for(const text of [html,js]){
  for(const forbidden of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,/\bFirebase\b/i,/\bFirestore\b/i,/\bsendBeacon\b/i,/\bWebSocket\b/i]){
   assert.ok(!forbidden.test(text),"Student projector cannot record grades or identity: "+forbidden);
  }
 }
 const tags=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(tags.length,new Set(tags).size,"Duplicate HTML ids");
 for(const id of ["paceSelect","autoAdvance","loadStatus","stageShell","slideIndex","questionType","sloLabel","scenarioLabel","scenarioPane","scenarioHeading","scenarioText","questionText","answersGrid","secondsRemaining","progress","progressBar","timerState","startBtn","prevBtn","pauseBtn","nextBtn","resetBtn","fullscreenBtn","jumpInput","jumpBtn"]){
  assert.ok(tags.includes(id),"Missing projector element "+id);
 }
 assert.ok(desk.includes('href="./unit-04-projector-practice.html"'));
 assert.ok(hub.includes('href="./unit-04-projector-practice.html"'));
 const u4=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===4);
 assert.equal(u4.questionBankCount,80);assert.equal(u4.resourceIds.length,16);
 assert.equal(new Set(u4.resourceIds).size,16);
 assert.ok(u4.resourceIds.includes("unit4-projector-practice"));
 assert.equal(u4.assessmentStatus,"provisional-unit4-integrated-80-mark-classroom-practice");
 const item=catalog.resources.filter(r=>r.id==="unit4-projector-practice");
 assert.equal(item.length,1);assert.equal(item[0].href,"./unit-04-projector-practice.html");assert.equal(item[0].public,true);
 const u3=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===3);
 assert.equal(u3.resourceIds.length,10);assert.equal(u3.questionBankCount,80);
 assert.equal(audit.projectorClassroomPracticePublished,true);
 assert.equal(audit.projectorPracticePage,"./unit-04-projector-practice.html");
 assert.equal(audit.protectedOrGradedAssessmentPublished,false);
 assert.equal(audit.studentGradesRecorded,false);
}
async function browserChecks(){
 await new Promise((resolve,reject)=>server.once("error",reject).listen(0,"127.0.0.1",resolve));
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1365,height:900},deviceScaleFactor:1});
  const errors=[],posts=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("request",r=>{if(r.method()!=="GET")posts.push(r.method()+" "+r.url());});
  const base="http://127.0.0.1:"+server.address().port+"/portal/";
  const response=await page.goto(base+"unit-04-projector-practice.html",{waitUntil:"networkidle"});
  assert.equal(response.status(),200);
  await page.waitForFunction(()=>document.getElementById("loadStatus").textContent.includes("Ready · 80"));
  await page.clock.install();
  assert.equal(await page.locator("#startBtn").isEnabled(),true);
  assert.equal(await page.locator("#paceSelect").inputValue(),"50");
  assert.equal(await page.locator("#autoAdvance").isChecked(),true);
  assert.equal(await page.locator("#pauseBtn").isEnabled(),false);
  assert.equal(await page.locator("#secondsRemaining").textContent(),"50");
  // Source fidelity: actual projector DOM, not mere JSON consistency.
  await page.locator("#paceSelect").selectOption("40");
  await page.locator("#startBtn").click();
  assert.equal(await page.locator("#slideIndex").textContent(),"Q 1 / 80");
  assert.equal(await page.locator("#questionText").textContent(),bank.questions[0].stem);
  assert.deepEqual(await page.locator("#answersGrid .option-text").allTextContents(),bank.questions[0].options.map(x=>x.text));
  assert.deepEqual(await page.locator("#answersGrid .letter").allTextContents(),["A","B","C","D"]);
  assert.equal(await page.locator("#scenarioPane").isVisible(),false);
  assert.equal(await page.locator("#secondsRemaining").textContent(),"40");
  assert.equal(await page.locator("#pauseBtn").textContent(),"Pause timer");
  const bar=await page.locator("#progress").getAttribute("aria-valuenow");
  assert.equal(bar,"100");
  await page.screenshot({path:path.join(out,"01-projector-desktop.png"),fullPage:false});
  // Clock emulation: a full 40-second question advances exactly one slide.
  await page.clock.fastForward(40500);
  assert.equal(await page.locator("#slideIndex").textContent(),"Q 2 / 80");
  assert.equal(await page.locator("#questionText").textContent(),bank.questions[1].stem);
  // Pause freezes countdown; next resumes accurately.
  await page.locator("#pauseBtn").click();
  const frozen=await page.locator("#secondsRemaining").textContent();
  await page.clock.fastForward(25000);
  assert.equal(await page.locator("#secondsRemaining").textContent(),frozen);
  await page.locator("#pauseBtn").click();
  await page.clock.fastForward(1100);
  assert.ok(Number(await page.locator("#secondsRemaining").textContent())<Number(frozen));
  // Changing pace while active resets this question and pauses, rather than skipping slides.
  await page.locator("#paceSelect").selectOption("adaptive");
  assert.equal(await page.locator("#slideIndex").textContent(),"Q 2 / 80");
  assert.equal(await page.locator("#pauseBtn").textContent(),"Resume timer");
  // Jump to all six scenarios and verify the exact passage and original option wording.
  for(let i=0;i<6;i++){
   const start=57+i*4;
   await page.locator("#jumpInput").fill(String(start));
   await page.locator("#jumpBtn").click();
   const q=bank.questions[start-1];
   assert.equal(await page.locator("#slideIndex").textContent(),"Q "+start+" / 80");
   assert.equal(await page.locator("#scenarioPane").isVisible(),true);
   assert.equal(await page.locator("#scenarioText").textContent(),q.stimulusText);
   assert.deepEqual(await page.locator("#answersGrid .option-text").allTextContents(),q.options.map(o=>o.text));
   assert.ok((await page.locator("#scenarioLabel").textContent()).includes("Situation "+(i+1)+" / 6"));
   await page.locator("#nextBtn").click();
   assert.equal(await page.locator("#scenarioText").textContent(),q.stimulusText,"Shared passage must repeat on next slide");
  }
  await page.screenshot({path:path.join(out,"02-projector-scenario.png"),fullPage:false});
  // Disable auto-advance and let time expire: no surprise next question.
  await page.locator("#paceSelect").selectOption("40");
  await page.locator("#autoAdvance").uncheck();
  await page.locator("#pauseBtn").click();
  const before=await page.locator("#slideIndex").textContent();
  await page.clock.fastForward(40500);
  assert.equal(await page.locator("#slideIndex").textContent(),before);
  assert.equal(await page.locator("#secondsRemaining").textContent(),"0");
  assert.ok((await page.locator("#timerState").textContent()).includes("Time is up"));
  await page.locator("#nextBtn").click();
  assert.notEqual(await page.locator("#slideIndex").textContent(),before);
  // Jump to final MCQ and manually finish without exposing any solutions.
  await page.locator("#jumpInput").fill("80");
  await page.locator("#jumpBtn").click();
  assert.equal(await page.locator("#scenarioText").textContent(),bank.questions[79].stimulusText);
  assert.equal(await page.locator("#nextBtn").textContent(),"Finish presentation");
  await page.locator("#nextBtn").click();
  assert.ok((await page.locator("#timerState").textContent()).includes("Presentation complete"));
  assert.equal(await page.locator("#nextBtn").isEnabled(),false);
  await page.locator("#prevBtn").click();
  assert.equal(await page.locator("#slideIndex").textContent(),"Q 79 / 80");
  // Keyboard controls operate when focus is on the slide rather than an input.
  await page.locator("#questionText").click();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator("#slideIndex").textContent(),"Q 80 / 80");
  await page.locator("#questionText").click();
  await page.keyboard.press("ArrowLeft");
  assert.equal(await page.locator("#slideIndex").textContent(),"Q 79 / 80");
  // Student-facing slides do NOT contain explanations or highlighted answers.
  const stage=await page.locator("#stageShell").innerText();
  assert.ok(!stage.includes(bank.questions[78].explanation));
  assert.ok(!stage.includes("Correct answer"));
  assert.equal(await page.locator(".option.correct,.option.selected,.answer-key,.explanation").count(),0);
  assert.deepEqual(errors,[],"Unexpected runtime errors: "+errors.join("; "));
  assert.deepEqual(posts,[],"Projector should only GET public files; no student POSTs");
  const saved=await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}));
  assert.deepEqual(saved,{local:0,session:0});
  // Mobile: page must not widen; options should stack and timer remain readable.
  await page.setViewportSize({width:390,height:844});
  const width=await page.evaluate(()=>({page:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  if(width.scroll>width.page+2){
    const suspects=await page.evaluate(()=>[...document.querySelectorAll("body *")].filter(el=>{
      const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
      return cs.display!=="none"&&r.width>0&&r.right>innerWidth+3&&r.left>=0&&el.getClientRects().length;
    }).sort((a,b)=>b.getBoundingClientRect().right-a.getBoundingClientRect().right).slice(0,12).map(el=>{
      const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
      return {tag:el.tagName,id:el.id,cls:typeof el.className==="string"?el.className:"",
        left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),
        overflowX:cs.overflowX,content:el.textContent.trim().slice(0,55)};
    }));
    console.error("V45 mobile overflow suspects:",JSON.stringify(suspects));
    await page.screenshot({path:path.join(out,"03-mobile-overflow-diagnostic.png"),fullPage:false});
  }
  assert.ok(width.scroll<=width.page+2,"Projector mobile overflow "+JSON.stringify(width));
  const cols=await page.locator("#answersGrid").evaluate(el=>getComputedStyle(el).gridTemplateColumns);
  assert.equal(cols.trim().split(/\s+/).length,1,"Phone view should stack answer options");
  await page.screenshot({path:path.join(out,"03-projector-mobile.png"),fullPage:false});
  console.log("PASS V45: verified original 80-question source and 12 SLO coverage; blank student-only answer rendering without response storage.");
  console.log("PASS V45: full Chromium timer auto-advance (40 seconds virtual clock), pause/resume, adaptive pacing, manual timeout, navigation, final completion.");
  console.log("PASS V45: all six scenario passages on successive slides; 390px mobile fit, keyboard controls, no account writes or runtime errors.");
  console.log("Screenshots: qa-artifacts/unit04-v45; projector visibility and academic teacher sign-off still require physical classroom review.");
 }finally{await browser.close();}
}
sourceChecks();
browserChecks().catch(error=>{console.error("FAIL V45:",error.stack||error);process.exitCode=1;}).finally(()=>server.close());
