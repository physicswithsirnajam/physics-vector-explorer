#!/usr/bin/env node
"use strict";
/*
 * Grade XI Unit 5 V51 Set B pilot QA.
 * Original NBF chapter and official supplied FBISE SLO table were inspected
 * separately. This test validates bank metadata, manual independent arithmetic
 * and every rendered student/teacher browser item, NOT new external PDF bytes.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),http=require("node:http"),path=require("node:path");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,"..");
const shots=path.join(root,"qa-artifacts","unit05-v51");
fs.mkdirSync(shots,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const baseBank="question-bank/grade-11/";
const student=JSON.parse(read(baseBank+"unit-05-v51-16-student-b.json"));
const teacher=JSON.parse(read(baseBank+"unit-05-v51-16-teacher-key-b.json"));
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const audit=JSON.parse(read("portal/unit-05-slo-audit.json"));
const expectedCodes=["P-11-B-29","P-11-B-30","P-11-B-31","P-11-B-32"];
const cognitive={"P-11-B-29":"Application","P-11-B-30":"Application","P-11-B-31":"Understanding","P-11-B-32":"Application"};
const expectedKeys=["B","D","A","C","A","B","D","C","B","A","C","D","C","D","A","B"];
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let f=path.resolve(root,"."+p);
  if(f!==root&&!f.startsWith(root+path.sep)){res.writeHead(403);res.end("Path forbidden");return;}
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,"index.html");
  if(!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end("Not found");return;}
  res.writeHead(200,{"Content-Type":mime[path.extname(f)]||"application/octet-stream","Cache-Control":"no-store"});
  fs.createReadStream(f).pipe(res);
 }catch(err){res.writeHead(500);res.end(String(err));}
});
function numericalChecks(){
 const close=(got,want,label,tolerance=1e-9)=>assert.ok(Math.abs(got-want)<tolerance,
  label+": "+got+" vs "+want);
 close(.5*4*(5**2-3**2),32,"Q1 net work");
 close(.5*3*(4**2),24,"Q2 kinetic energy");
 close(Math.sqrt(2),1.4142135623730951,"Q3 doubling force speed scaling");
 close(.5*(12+(-4))*8,32,"Q4 signed work crossing axis");
 close(.5*6*12,36,"Q4 positive signed triangle");
 close(-.5*2*4,-4,"Q4 negative signed triangle");
 close(.5*6*9,27,"Q5 triangle graph");
 close(10*3*Math.cos(120*Math.PI/180),-15,"Q6 angle-projected graph area");
 close(-40,-40,"Q7 gravity reversal");
 close((5-8)*3,-9,"Q10 net resistive work");
 close(.5*3*4**2+(5-8)*3,15,"Q10 final KE");
 close(Math.sqrt(2*15/3),3.16,"Q10 final speed",.005);
 close((.5*5*4**2)/10,4,"Q11 stopping distance");
 close(5*2,10,"Q12 work against resistance");
 close(.5*3*4**2,24,"Q13 initial KE");
 close(.5*(10+2)*5,30,"Q14 applied trapezoid area");
 close(-2*5,-10,"Q16 work by resistance");
 close(Math.sqrt(2*(24+30-10)/3),5.42,"Q16 final speed",.005);
 const correctAnswerTexts={
  1:"32 J",2:"24 J",3:"√2 v",4:"32 J",5:"27 J",6:"−15 J",7:"−40 J",
  8:"Gravity's work depends only on the endpoints, whereas kinetic friction generally depends on path length.",
  9:"Non-conservative, because the work depends on the route.",
  10:"3.16 m/s",11:"4.0 m",12:"10 J",13:"24 J",14:"30 J",
  15:"Its work depends on the distance travelled and dissipates mechanical energy.",
  16:"5.42 m/s"
 };
 for(const [number,text] of Object.entries(correctAnswerTexts)){
  const i=Number(number)-1,q=student.questions[i],k=teacher.answerKeys[i];
  assert.equal(q.options.find(option=>option.id===k.correctOptionId)?.text,text,
   "Independently verified Set B answer for Q"+number);
 }
}
function checkFiles(){
  assert.equal(student.practiceSet,"B");
 assert.equal(teacher.practiceSet,"B");
 assert.equal(audit.totalPublicPracticeMCQs,32);
 assert.deepEqual(audit.combinedPublicPracticeSloCounts,Object.fromEntries(expectedCodes.map(code=>[code,8])));
 assert.equal(student.grade,11);assert.equal(student.unit,5);
 assert.equal(student.officialBoardPaper,false);
 assert.equal(student.status,"provisional-teacher-review-pending");
 assert.deepEqual(student.structure,{straight:12,scenario:4,scenarioSets:1,scenarioQuestionsPerSet:4,questions:16,marksEach:.5,practiceMarks:8});
 assert.equal(student.questions.length,16);assert.equal(student.scenarios.length,1);
 assert.equal(teacher.answerKeys.length,16);
 assert.equal(teacher.publicResource,true);assert.equal(teacher.notSecured,true);
 assert.equal(teacher.officialFBISEKey,false);
 assert.equal(teacher.status,"provisional-teacher-review-pending");
 assert.ok(teacher.usageBoundary.includes("Public"));
 assert.equal(teacher.companionStudentBank,"unit-05-v51-16-student-b.json");
 assert.ok(!/"correctOptionId"|"workedSteps"|"answerKeys"|"explanation"/.test(JSON.stringify(student)),"Student bank must not carry key fields");
 const counts={A:0,B:0,C:0,D:0},sloCounts={};
 for(const [i,q] of student.questions.entries()){
  const a=teacher.answerKeys[i];
  assert.equal(q.sourceQuestionNumber,i+1);
  assert.equal(q.id,"U05B-MCQ-"+String(i+1).padStart(2,"0"));assert.equal(a.id,q.id);
  assert.ok(q.stem.length>45);
  assert.ok(expectedCodes.includes(q.sloCode));
  assert.equal(q.cognitiveLevel,cognitive[q.sloCode]);
  assert.equal(q.source.unit,5);
  assert.equal(q.source.frameworkCode,q.sloCode);
  assert.ok(q.source.printedPage>=79&&q.source.printedPage<=83);
  assert.deepEqual(q.options.map(x=>x.id),["A","B","C","D"]);
  assert.equal(new Set(q.options.map(x=>x.text)).size,4);
  assert.ok(q.options.every(x=>x.text.length>0));
  assert.equal(a.correctOptionId,expectedKeys[i]);
  assert.equal(a.workedSteps.length,3);
  assert.ok(a.workedSteps.every(s=>typeof s==="string"&&s.length>8));
  assert.equal(a.reviewStatus,"independent-numeric-source-clarity-QC-teacher-signoff-pending");
  counts[a.correctOptionId]++;
  sloCounts[q.sloCode]=(sloCounts[q.sloCode]||0)+1;
  if(i<12){assert.equal(q.type,"straight");assert.equal(q.scenarioSetId,null);assert.equal(q.scenarioIndex,null);}
  else{assert.equal(q.type,"scenario");assert.equal(q.scenarioSetId,"U05B-S1");assert.equal(q.scenarioIndex,i-11);}
 }
 assert.deepEqual(sloCounts,Object.fromEntries(expectedCodes.map(x=>[x,4])));
 assert.deepEqual(counts,{A:4,B:4,C:4,D:4});
 assert.deepEqual(teacher.correctLetterDistribution,counts);
 assert.ok(student.scenarios[0].stimulus.includes("3.0 kg"));
 assert.ok(student.scenarios[0].stimulus.includes("10 N"));
 assert.ok(student.scenarios[0].stimulus.includes("2.0 N"));
 const grade=catalog.grades.find(x=>x.grade===11),u5=grade.units.find(x=>x.unit===5);
 assert.equal(u5.questionBankCount,32);
 assert.equal(u5.assessmentStatus,"provisional-ungraded-two-16-mcq-sets-plus-unit5-40-mark-descriptive-practice");
 assert.deepEqual(u5.resourceIds,["unit5-desk","unit5-work-study","unit5-work-energy-lab","unit5-fbise-audit","unit5-mcq-practice","unit5-mcq-worked-key","unit5-mcq-set-b-practice","unit5-mcq-set-b-key","unit5-descriptive-student","unit5-descriptive-worked-key","unit5-projector-discussion"]);
 for(const id of u5.resourceIds){
  const matches=catalog.resources.filter(r=>r.id===id);
  assert.equal(matches.length,1);
  assert.equal(matches[0].public,true);
  assert.ok(fs.existsSync(path.join(root,"portal",matches[0].href.slice(2))));
 }
 assert.equal(grade.units.find(x=>x.unit===4).resourceIds.length,18);
 assert.equal(grade.units.find(x=>x.unit===4).questionBankCount,80);
 assert.equal(grade.units.find(x=>x.unit===3).resourceIds.length,10);
 assert.equal(audit.status,"official-SLO-verified-32-mcq-two-pilot-sets-and-40-mark-descriptive-practice");
 assert.equal(audit.officialFrameworkVerified,true);
 assert.equal(audit.officialFrameworkSLOTablePdfPage,11);
 assert.deepEqual(audit.summativeTheorySLOs.map(x=>x.cognitiveLevel),["Application","Application","Understanding","Application"]);
 assert.equal(audit.studentQuestionBankPublished,true);
 assert.equal(audit.teacherAnswerKeyPublished,true);
 assert.equal(audit.questionBankCount,32);
 assert.deepEqual(audit.provisionalPracticeSetB.keyBalance,counts);
 assert.equal(audit.provisionalPracticeSetB.questions,16);
 assert.equal(audit.provisionalPracticeSetB.practiceMarks,8);
 assert.equal(audit.practiceResponseGridPublished,true);
 assert.equal(audit.omrPublished,false);assert.equal(audit.scannableOmrPublished,false);
 assert.equal(audit.officialFullPaperPublished,false);
 assert.equal(audit.descriptivePaperPublished,false);
 assert.equal(audit.studentGradesRecorded,false);assert.equal(audit.protectedOrGradedAssessmentPublished,false);
 assert.equal(audit.practicalPbaDetermination,"not-established-by-this-source");
 const studentJs=read("portal/unit-05-mcq-set-b.js");
 assert.ok(studentJs.includes("unit-05-v51-16-student-b.json"));
 assert.ok(!studentJs.includes("unit-05-v51-16-teacher-key-b.json"));
 assert.ok(!read("portal/unit-05-mcq-set-b.html").includes("unit-05-mcq-set-b-key.html"));
 for(const file of ["portal/unit-05-mcq-set-b.js","portal/unit-05-mcq-set-b-key.js"]){
  const src=read(file);
  for(const bad of ["localStorage","sessionStorage","indexedDB","sendBeacon","setDoc","innerHTML"]){
   assert.ok(!src.includes(bad),file+" must not store grade data or parse raw HTML via "+bad);
  }
 }
 numericalChecks();
}
async function browser(){
 await new Promise((resolve,reject)=>server.once("error",reject).listen(0,"127.0.0.1",resolve));
 const browser=await chromium.launch({headless:true});
 try{
  const base="http://127.0.0.1:"+server.address().port+"/portal/";
  const page=await browser.newPage({viewport:{width:1370,height:920}});
  const errors=[],writes=[],missing=[],studentRequests=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("request",r=>{if(r.method()!=="GET")writes.push(r.method()+" "+r.url());studentRequests.push(r.url());});
  page.on("response",r=>{if(r.status()>=400)missing.push(r.status()+" "+r.url());});
  let res=await page.goto(base+"unit-05-mcq-set-b.html",{waitUntil:"networkidle"});
  assert.equal(res.status(),200);
  await page.waitForFunction(()=>document.getElementById("loadStatus").textContent.includes("Ready"));
  assert.equal(await page.locator("header img").count(),1);
  assert.ok(await page.locator("header img").first().evaluate(img=>img.complete&&img.naturalWidth>0));
  assert.equal(await page.locator("#questionRows tr.question-row").count(),16);
  assert.equal(await page.locator("#questionRows tr.scenario-row").count(),1);
  assert.equal(await page.locator("#questionRows button.choice").count(),64);
  assert.equal(await page.locator("#questionRows button.choice.selected").count(),0);
  assert.equal(await page.locator("#responseGrid .response-item").count(),16);
  assert.equal(await page.locator("#markedCount").textContent(),"0 / 16 bubbles marked");
  assert.equal(await page.locator("#questionRows .correct").count(),0);
  assert.equal(await page.locator("#printBtn").isEnabled(),true);
  assert.equal(await page.locator("#clearBtn").isEnabled(),true);
  assert.ok(!studentRequests.some(url=>url.includes("teacher-key-b.json")),"Student page must never fetch teacher key");
  const scenarioText=await page.locator("tr.scenario-row").textContent();
  assert.ok(scenarioText.includes(student.scenarios[0].stimulus));
  for(let i=0;i<16;i++){
   const row=page.locator("#questionRows tr.question-row").nth(i),q=student.questions[i];
   assert.equal(await row.getAttribute("data-q"),String(i+1));
   assert.equal(await row.locator("td.num").textContent(),String(i+1));
   assert.equal(await row.locator("td").nth(1).textContent(),q.stem);
   assert.deepEqual(await row.locator("td.option-text").allTextContents(),q.options.map(x=>x.text));
   assert.equal(await row.locator("button[aria-pressed=true]").count(),0);
  }
  await page.screenshot({path:path.join(shots,"01-student-boxed-practice-desktop.png"),fullPage:false});
  await page.locator('button.choice[data-q="1"][data-option="C"]').click();
  assert.equal(await page.locator("#markedCount").textContent(),"1 / 16 bubbles marked");
  assert.equal(await page.locator("#responseGrid [data-response-q='1']").textContent(),"A○  B○  C●  D○");
  await page.locator('button.choice[data-q="2"][data-option="D"]').click();
  assert.equal(await page.locator("#markedCount").textContent(),"2 / 16 bubbles marked");
  await page.locator('button.choice[data-q="1"][data-option="C"]').click();
  assert.equal(await page.locator("#markedCount").textContent(),"1 / 16 bubbles marked");
  await page.locator("#clearBtn").click();
  assert.equal(await page.locator("#markedCount").textContent(),"0 / 16 bubbles marked");
  assert.equal(await page.locator("#questionRows button.choice.selected").count(),0);
  await page.evaluate(()=>{window.__printCount=0;window.print=()=>{window.__printCount++};});
  await page.locator("#printBtn").click();
  assert.equal(await page.evaluate(()=>window.__printCount),1);
  await page.emulateMedia({media:"print"});
  assert.equal(await page.locator("header").evaluate(el=>getComputedStyle(el).display),"none");
  assert.equal(await page.locator(".question-bank").evaluate(el=>getComputedStyle(el).minWidth),"0px");
  assert.equal(await page.locator("#questionRows tr.question-row").count(),16);
  await page.emulateMedia({media:"screen"});
  await page.setViewportSize({width:390,height:844});
  const size=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,content:document.documentElement.scrollWidth,
    tbl:document.querySelector(".table-scroll").scrollWidth,local:document.querySelector(".table-scroll").clientWidth}));
  assert.ok(size.content<=size.viewport+2,"Student page horizontal whole-document overflow "+JSON.stringify(size));
  assert.ok(size.tbl>size.local,"FBISE option table should scroll locally on small phones");
  await page.screenshot({path:path.join(shots,"02-student-boxed-practice-mobile.png"),fullPage:false});
  // Teacher key: no solutions in DOM until an explicit Reveal action.
  const teacherPage=await browser.newPage({viewport:{width:1370,height:900}});
  const keyRequests=[];
  teacherPage.on("pageerror",e=>errors.push(e.message));
  teacherPage.on("request",r=>{if(r.method()!=="GET")writes.push(r.method()+" "+r.url());keyRequests.push(r.url());});
  teacherPage.on("response",r=>{if(r.status()>=400)missing.push(r.status()+" "+r.url());});
  res=await teacherPage.goto(base+"unit-05-mcq-set-b-key.html",{waitUntil:"networkidle"});
  assert.equal(res.status(),200);
  await teacherPage.waitForFunction(()=>document.getElementById("teacherStatus").textContent.includes("Ready"));
  assert.ok(keyRequests.some(url=>url.includes("teacher-key-b.json")));
  assert.equal(await teacherPage.locator("#solutionCards .solution-card").count(),0);
  assert.equal(await teacherPage.locator("#keyRows tr").count(),0);
  assert.equal(await teacherPage.locator("#keyBody").isVisible(),false);
  assert.equal(await teacherPage.locator("#printKey").isEnabled(),false);
  await teacherPage.locator("#revealAll").click();
  assert.equal(await teacherPage.locator("#solutionCards .solution-card").count(),16);
  assert.equal(await teacherPage.locator("#keyRows tr").count(),16);
  for(let i=0;i<16;i++){
   const q=student.questions[i],a=teacher.answerKeys[i],card=teacherPage.locator("#solutionCards .solution-card").nth(i);
   assert.equal(await card.getAttribute("data-question"),String(i+1));
   assert.equal(await card.locator(".stem").textContent(),q.stem);
   assert.deepEqual(await card.locator(".option").allTextContents(),
    q.options.map(opt=>opt.id+". "+opt.text+(opt.id===a.correctOptionId?" — Correct":"")));
   assert.equal(await card.locator(".option.correct").count(),1);
   assert.equal(await card.locator(".correct-tag").textContent(),"Answer: "+a.correctOptionId);
   assert.deepEqual(await card.locator("li").allTextContents(),a.workedSteps);
   const slo=await card.locator(".slo").textContent();
   assert.ok(slo.includes(q.sloCode)&&slo.includes(q.cognitiveLevel)&&slo.includes("p. "+q.source.printedPage));
   if(q.scenarioSetId)assert.ok((await card.locator(".context").textContent()).includes(student.scenarios[0].stimulus));
  }
  await teacherPage.screenshot({path:path.join(shots,"03-public-teacher-key-revealed.png"),fullPage:false});
  await teacherPage.locator("#hideAll").click();
  assert.equal(await teacherPage.locator("#solutionCards .solution-card").count(),0);
  assert.equal(await teacherPage.locator("#keyRows tr").count(),0);
  assert.equal(await teacherPage.locator("#keyBody").isVisible(),false);
  assert.equal(await teacherPage.locator("#printKey").isEnabled(),false);
  await teacherPage.locator("#revealAll").click();
  await teacherPage.evaluate(()=>{window.__printCount=0;window.print=()=>{window.__printCount++};});
  await teacherPage.locator("#printKey").click();
  assert.equal(await teacherPage.evaluate(()=>window.__printCount),1);
  await teacherPage.setViewportSize({width:390,height:844});
  const mobile=await teacherPage.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(mobile.scroll<=mobile.client+2,"Teacher key page mobile overflow "+JSON.stringify(mobile));
  await teacherPage.screenshot({path:path.join(shots,"04-public-teacher-key-mobile.png"),fullPage:false});
  assert.deepEqual(errors,[],"Unexpected browser errors");
  assert.deepEqual(missing,[],"Missing source scripts/images/pages");
  assert.deepEqual(writes,[],"No student results/grades transmitted");
  const saved=await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}));
  assert.deepEqual(saved,{local:0,session:0});
  console.log("PASS V51: all 16 original Unit 5 MCQs source/option/official SLO/cognitive mapping and 4×4 balanced manually authored keys.");
  console.log("PASS V51: numeric examples independently recomputed, single four-item scenario preserved, 64 unmarked FBISE boxed bubbles, 8 practice marks.");
  console.log("PASS V51: student page never fetches teacher JSON, optional bubbles clear, no storage/grade writes, print mode and mobile local table scrolling.");
  console.log("PASS V51: public teacher solutions render only after deliberate reveal, hide removes key DOM, all 16 three-step solutions and source pages verified.");
 }finally{await browser.close();}
}
checkFiles();
browser().catch(e=>{console.error("FAIL V51",e.stack||e);process.exitCode=1;}).finally(()=>server.close());
