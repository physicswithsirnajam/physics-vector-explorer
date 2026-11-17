#!/usr/bin/env node
"use strict";
/* V52: Test original Unit 5 40-mark descriptive student/teacher practice, source,
 * numerical calculations, 9 equal-marks OR pairs, print and 390px mobile.
 * Official supplied FBISE 2024-scheme SLO classifications checked previously.
 * CI validates authored-source consistency, NOT new textbook PDF bytes.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),http=require("node:http");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,".."),shotDir=path.join(root,"qa-artifacts","unit05-v52");
fs.mkdirSync(shotDir,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const student=JSON.parse(read("question-bank/grade-11/unit-05-v52-descriptive-student.json"));
const teacher=JSON.parse(read("question-bank/grade-11/unit-05-v52-descriptive-teacher-key.json"));
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const audit=JSON.parse(read("portal/unit-05-slo-audit.json"));
const expectedLevels={"P-11-B-29":"Application","P-11-B-30":"Application","P-11-B-31":"Understanding","P-11-B-32":"Application"};
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let full=path.resolve(root,"."+p);
  if(full!==root&&!full.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(full)&&fs.statSync(full).isDirectory())full=path.join(full,"index.html");
  if(!fs.existsSync(full)||!fs.statSync(full).isFile()){res.writeHead(404);res.end("Not found");return;}
  res.writeHead(200,{"Content-Type":mime[path.extname(full)]||"application/octet-stream","Cache-Control":"no-store"});
  fs.createReadStream(full).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
function numerics(){
 const close=(actual,expect,label,eps=1e-9)=>assert.ok(Math.abs(actual-expect)<eps,
   label+" expected "+expect+", received "+actual);
 close(.5*3*2**2,6,"B1B initial K");
 close(.5*3*8**2,96,"B1B final K");
 close(.5*3*(8**2-2**2),90,"B1B net work");
 close(.5*(4+12)*6,48,"B2A trapezoid");
 close(6*8/(8+4),4,"B2B crossing x");
 close(.5*4*8,16,"B2B positive triangle");
 close(-.5*2*4,-4,"B2B negative triangle");
 close(16-4,12,"B2B net signed work");
 close(.5*4*3**2,18,"B4A initial kinetic energy");
 close((20-8)*4,48,"B4A net work");
 close(18+48,66,"B4A final kinetic energy");
 close(Math.sqrt(2*66/4),5.74,"B4A final speed",.005);
 close(.5*2*6**2,36,"B4B initial kinetic energy");
 close(-9*5,-45,"B4B impossible hypothetical target resistance work");
 close(36/9,4,"B4B stopping distance");
 close(9*6,54,"B5A work");
 close(Math.sqrt(2*54/3),6,"B5A speed");
 close(.5*2*5**2,25,"B5B initial KE");
 close(.5*2*10**2,100,"B5B doubled speed KE");
 close(100/25,4,"B5B ratio");
 close(10*3,30,"B6A positive graph work");
 close(-5*4,-20,"B6A negative graph work");
 close(30-20,10,"B6A net work");
 close(.5*2*8+3*8+.5*2*8,40,"B6B graph area");
 close(8*5,40,"C8B stage 1 work");
 close(Math.sqrt(2*40/2),6.32,"C8B stage 1 speed",.005);
 close(-4*3,-12,"C8B stage 2 work");
 close(40-12,28,"C8B final KE");
 close(Math.sqrt(2*28/2),5.29,"C8B final speed",.005);
 close(.5*5*2**2,10,"C9A initial KE");
 close(30*4,120,"C9A applied work");
 close(-12*4,-48,"C9A resistive work");
 close(120-48,72,"C9A net work");
 close(10+72,82,"C9A final KE");
 close(Math.sqrt(2*82/5),5.73,"C9A final speed",.005);
 close(.5*3*8**2,96,"C9B initial KE");
 close(5-17,-12,"C9B net force");
 close(-12*10,-120,"C9B unreachable target work");
 close(96-120,-24,"C9B impossible target kinetic energy");
 close(96/12,8,"C9B actual stopping distance");
 const finalExpected={
  "B-1-B":["6.0 J","96 J","+90 J"],
  "B-2-A":["+48 J"],
  "B-2-B":["4.0 m","+16 J","−4.0 J","+12 J"],
  "B-4-A":["18 J","+48 J","66 J","5.74 m/s"],
  "B-4-B":["36 J","−45 J","4.0 m","unreachable"],
  "B-5-A":["54 J","6.0 m/s"],
  "B-5-B":["25 J","100 J","4:"],
  "B-6-A":["+30 J","−20 J","+10 J"],
  "B-6-B":["+8 J","+24 J","+40 J"],
  "C-8-B":["40 J","6.32 m/s","−12 J","28 J","5.29 m/s"],
  "C-9-A":["10 J","+120 J","−48 J","+72 J","82 J","5.73 m/s"],
  "C-9-B":["96 J","−12 N","−120 J","−24 J","8.0 m","cannot reach"]
 };
 const keyed=new Map(teacher.answers.map(x=>[x.choiceId,x.marking.map(y=>y.text).join(" ")]));
 for(const [id,parts] of Object.entries(finalExpected)){
  const solution=keyed.get(id);assert.ok(solution,"Missing independent answer "+id);
  for(const chunk of parts)assert.ok(solution.includes(chunk),"Missing independently verified numeric result "+id+": "+chunk);
 }
}
function sourceChecks(){
 assert.equal(student.schemaVersion,1);assert.equal(student.unit,5);assert.equal(student.grade,11);
 assert.equal(student.officialBoardPaper,false);assert.equal(student.status,"provisional-teacher-review-pending");
 assert.equal(student.pattern.totalMarks,40);
 assert.equal(student.pattern.unitOnly,true);assert.equal(student.pattern.fullSyllabusPaper,false);
 assert.deepEqual(student.pattern.sectionB,{questionCount:7,marksEach:4,totalMarks:28,internalOr:true});
 assert.deepEqual(student.pattern.sectionC,{questionCount:2,marksEach:6,totalMarks:12,internalOr:true});
 assert.equal(student.pattern.alternatives,18);
 assert.equal(student.sectionB.length,7);assert.equal(student.sectionC.length,2);
 assert.deepEqual(student.verifiedFramework.officialTheorySloCodes,Object.keys(expectedLevels));
 assert.deepEqual(student.verifiedFramework.cognitiveLevels,Object.values(expectedLevels));
 assert.equal(student.verifiedFramework.pdfPage,11);
 assert.ok(student.sourceTextbook.printedPages.includes("77"));
 assert.equal(teacher.status,"provisional-teacher-review-pending");
 assert.equal(teacher.publicResource,true);assert.equal(teacher.notSecured,true);
 assert.equal(teacher.officialFBISEKey,false);
 assert.equal(teacher.companionStudentBank,"unit-05-v52-descriptive-student.json");
 assert.equal(teacher.totalPaperMarks,40);assert.equal(teacher.totalChoices,18);
 assert.equal(teacher.totalOrPairs,9);
 assert.equal(teacher.sectionBMarks,28);assert.equal(teacher.sectionCMarks,12);
 assert.equal(teacher.answers.length,18);
 const all=[...student.sectionB,...student.sectionC];
 const ids=new Set();const keyMap=new Map(teacher.answers.map(a=>[a.choiceId,a]));
 assert.equal(keyMap.size,18);
 const counts={};const optionKinds={};
 for(const q of all){
  const section=q.number<=7?"B":"C",marks=section==="B"?4:6;
  assert.equal(q.section,section);assert.equal(q.marks,marks);
  assert.equal(q.choices.length,2);
  assert.equal(q.choices[0].sloCode,q.choices[1].sloCode,
    "OR partners must test the same verified objective");
  for(const [i,c] of q.choices.entries()){
   assert.equal(c.id,section+"-"+q.number+"-"+(i===0?"A":"B"));
   assert.ok(!ids.has(c.id));ids.add(c.id);
   assert.equal(c.assessment,"summative-theory");
   assert.ok(Object.hasOwn(expectedLevels,c.sloCode));
   assert.equal(c.cognitiveLevel,expectedLevels[c.sloCode]);
   assert.ok(c.sourcePage>=79&&c.sourcePage<=83);
   assert.ok(c.prompt.length>70);
   assert.ok(["numerical","conceptual","derivation"].includes(c.kind));
   counts[c.sloCode]=(counts[c.sloCode]||0)+1;
   optionKinds[c.kind]=(optionKinds[c.kind]||0)+1;
   const answer=keyMap.get(c.id);
   assert.ok(answer,"Missing teacher answer for "+c.id);
   assert.equal(answer.marking.length,marks);
   assert.equal(answer.marking.reduce((sum,a)=>sum+a.marks,0),marks);
   assert.ok(answer.marking.every(a=>a.marks===1&&a.text.length>=25));
   assert.ok(answer.teacherNotes.length>30);
  }
 }
 assert.equal(ids.size,18);
 assert.deepEqual(counts,{"P-11-B-29":6,"P-11-B-30":4,"P-11-B-31":4,"P-11-B-32":4});
 assert.ok(optionKinds.numerical>=9,"Numerical practice must be substantive");
 assert.equal(teacher.answers.reduce((sum,a)=>sum+a.marking.length,0),80,"18 alternatives need 80 individual point-level marks");
 assert.equal(audit.officialFrameworkVerified,true);
 assert.equal(audit.questionBankCount,32); // MCQs unchanged
 assert.equal(audit.studentGradesRecorded,false);
 assert.equal(audit.descriptivePracticePublished,true);
 assert.equal(audit.descriptivePaperPublished,false); // no formal official paper
 assert.equal(audit.omrPublished,false);
 assert.equal(audit.protectedOrGradedAssessmentPublished,false);
 assert.equal(audit.descriptivePractice.totalPracticeMarks,40);
 assert.equal(audit.descriptivePractice.alternatives,18);
 assert.equal(audit.descriptivePractice.fullGradeExam,false);
 assert.equal(audit.descriptivePractice.teacherKeyPublicNotSecured,true);
 const u5=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===5);
 assert.equal(u5.resourceIds.length,11);
 assert.equal(u5.questionBankCount,349);
 assert.equal(u5.descriptivePracticeMarks,40);
 assert.equal(u5.descriptivePracticePairs,9);
 assert.equal(u5.descriptivePracticeAlternatives,18);
 assert.deepEqual(u5.resourceIds.slice(-3),["unit5-descriptive-student","unit5-descriptive-worked-key","unit5-projector-discussion"]);
 for(const id of u5.resourceIds){
  const resources=catalog.resources.filter(x=>x.id===id);
  assert.equal(resources.length,1);assert.equal(resources[0].public,true);
  assert.ok(fs.existsSync(path.join(root,"portal",resources[0].href.slice(2))));
 }
 const grade=catalog.grades.find(g=>g.grade===11);
 assert.equal(grade.units.find(u=>u.unit===4).resourceIds.length,18);
 assert.equal(grade.units.find(u=>u.unit===4).questionBankCount,635);
 assert.equal(grade.units.find(u=>u.unit===3).resourceIds.length,10);
 const studentJs=read("portal/unit-05-descriptive-student.js");
 const studentHtml=read("portal/unit-05-descriptive-student.html");
 const teacherJs=read("portal/unit-05-descriptive-teacher.js");
 assert.ok(studentJs.includes("unit-05-v52-descriptive-student.json"));
 assert.ok(!studentJs.includes("unit-05-v52-descriptive-teacher-key.json"));
 assert.ok(!studentHtml.includes("unit-05-descriptive-teacher.html"));
 assert.ok(teacherJs.includes("unit-05-v52-descriptive-teacher-key.json"));
 for(const script of [studentJs,teacherJs]){
  for(const risky of ["localStorage","sessionStorage","indexedDB","sendBeacon","setDoc","innerHTML"]){
   assert.ok(!script.includes(risky),"No grade storage or unsanitized HTML injection: "+risky);
  }
 }
 assert.ok(!/"answers"|"marking"|"teacherNotes"|"workedSteps"/.test(JSON.stringify(student)));
 const css=read("portal/unit-05-descriptive-v52.css");
 assert.ok(css.includes("@page{size:A4 portrait"));
 assert.ok(css.includes("#teacherContent .notice{display:block!important"));
 numerics();
}
async function browserChecks(){
 await new Promise((resolve,reject)=>server.once("error",reject).listen(0,"127.0.0.1",resolve));
 const browser=await chromium.launch({headless:true});
 try{
  const base="http://127.0.0.1:"+server.address().port+"/portal/";
  const errors=[],writes=[],notFound=[],requests=[];
  const watch=page=>{
   page.on("pageerror",e=>errors.push(e.message));
   page.on("request",r=>{requests.push(r.url());if(r.method()!=="GET")writes.push(r.method()+" "+r.url());});
   page.on("response",r=>{if(r.status()>=400)notFound.push(r.status()+" "+r.url());});
  };
  const page=await browser.newPage({viewport:{width:1360,height:900}});watch(page);
  let res=await page.goto(base+"unit-05-descriptive-student.html",{waitUntil:"networkidle"});
  assert.equal(res.status(),200);
  await page.waitForFunction(()=>document.querySelector("#loadStatus")?.textContent.includes("Ready"));
  assert.ok(await page.locator("header img").first().evaluate(im=>im.complete&&im.naturalWidth>0));
  assert.equal(await page.locator("#shortQuestions .question").count(),7);
  assert.equal(await page.locator("#extendedQuestions .question").count(),2);
  assert.equal(await page.locator(".option[data-choice]").count(),18);
  assert.equal(await page.locator(".or").count(),9);
  assert.equal(await page.locator(".answer-space").count(),9);
  assert.equal(await page.locator("#printPaper").isEnabled(),true);
  assert.ok(!requests.some(x=>x.includes("descriptive-teacher-key.json")),"Student browser must not fetch teacher rubric");
  const combined=[...student.sectionB,...student.sectionC];
  for(const q of combined){
   const block=page.locator('.question[data-question="'+q.number+'"]');
   assert.equal(await block.count(),1);
   assert.ok((await block.locator(".mark").textContent()).includes(q.marks+" marks"));
   for(const c of q.choices){
    const card=block.locator('.option[data-choice="'+c.id+'"]');
    assert.equal(await card.count(),1);
    assert.ok((await card.textContent()).includes(c.prompt));
    assert.ok((await card.textContent()).includes(c.sloCode));
    assert.ok((await card.textContent()).includes("p. "+c.sourcePage));
   }
  }
  await page.screenshot({path:path.join(shotDir,"01-student-descriptive-desktop.png"),fullPage:false});
  await page.evaluate(()=>{window.__printCount=0;window.print=()=>window.__printCount++;});
  await page.locator("#printPaper").click();
  assert.equal(await page.evaluate(()=>window.__printCount),1);
  await page.emulateMedia({media:"print"});
  assert.equal(await page.locator("header").evaluate(e=>getComputedStyle(e).display),"none");
  assert.equal(await page.locator("#shortQuestions .question").count(),7);
  assert.equal(await page.locator("#extendedQuestions .question").count(),2);
  await page.emulateMedia({media:"screen"});
  await page.setViewportSize({width:390,height:844});
  const mobile=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(mobile.scroll<=mobile.client+2,"Student mobile overflow "+JSON.stringify(mobile));
  await page.screenshot({path:path.join(shotDir,"02-student-descriptive-mobile.png"),fullPage:false});
  const keyPage=await browser.newPage({viewport:{width:1360,height:900}});watch(keyPage);
  res=await keyPage.goto(base+"unit-05-descriptive-teacher.html",{waitUntil:"networkidle"});
  assert.equal(res.status(),200);
  await keyPage.waitForFunction(()=>document.querySelector("#teacherStatus")?.textContent.includes("Ready"));
  assert.ok(requests.some(x=>x.includes("unit-05-v52-descriptive-teacher-key.json")));
  assert.equal(await keyPage.locator("#teacherContent").isVisible(),false);
  assert.equal(await keyPage.locator("#teacherSolutions .solution-card").count(),0);
  assert.equal(await keyPage.locator("#rubricSummary tr").count(),0);
  assert.equal(await keyPage.locator("#printSolutions").isEnabled(),false);
  await keyPage.locator("#revealSolutions").click();
  assert.equal(await keyPage.locator("#teacherSolutions .solution-card").count(),18);
  assert.equal(await keyPage.locator("#rubricSummary tr").count(),9);
  assert.equal(await keyPage.locator("#teacherSolutions li").count(),80);
  const entries=new Map(teacher.answers.map(a=>[a.choiceId,a]));
  for(const q of combined)for(const c of q.choices){
   const card=keyPage.locator('.solution-card[data-choice="'+c.id+'"]'),source=entries.get(c.id);
   assert.equal(await card.count(),1);
   assert.ok((await card.locator(".prompt").textContent()).includes(c.prompt));
   assert.ok((await card.locator(".tag").textContent()).includes(c.sloCode));
   assert.ok((await card.locator(".tag").textContent()).includes(c.cognitiveLevel));
   assert.ok((await card.locator(".tag").textContent()).includes("p. "+c.sourcePage));
   assert.equal(await card.locator("li").count(),q.marks);
   const steps=await card.locator("li").allTextContents();
   assert.deepEqual(steps,source.marking.map(x=>x.text+" ["+x.marks+" mark]"));
   assert.ok((await card.locator(".teacherNote").textContent()).includes(source.teacherNotes));
  }
  await keyPage.screenshot({path:path.join(shotDir,"03-teacher-descriptive-worked-key.png"),fullPage:false});
  await keyPage.emulateMedia({media:"print"});
  assert.equal(await keyPage.locator("#teacherContent .notice").evaluate(e=>getComputedStyle(e).display),"block");
  await keyPage.emulateMedia({media:"screen"});
  await keyPage.evaluate(()=>{window.__printCount=0;window.print=()=>window.__printCount++;});
  await keyPage.locator("#printSolutions").click();
  assert.equal(await keyPage.evaluate(()=>window.__printCount),1);
  await keyPage.locator("#hideSolutions").click();
  assert.equal(await keyPage.locator("#teacherContent").isVisible(),false);
  assert.equal(await keyPage.locator("#teacherSolutions .solution-card").count(),0);
  assert.equal(await keyPage.locator("#rubricSummary tr").count(),0);
  assert.equal(await keyPage.locator("#printSolutions").isEnabled(),false);
  await keyPage.locator("#revealSolutions").click();
  await keyPage.setViewportSize({width:390,height:844});
  const keyMobile=await keyPage.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(keyMobile.scroll<=keyMobile.client+2,"Teacher mobile overflow "+JSON.stringify(keyMobile));
  await keyPage.screenshot({path:path.join(shotDir,"04-teacher-descriptive-mobile.png"),fullPage:false});
  for(const pageName of ["unit-05.html","unit-05-fbise-audit.html"]){
   await page.goto(base+pageName,{waitUntil:"networkidle"});
   for(const href of ["./unit-05-descriptive-student.html","./unit-05-descriptive-teacher.html"])
    assert.ok(await page.locator('a[href="'+href+'"]').count()>0,"Unit5 source/desk missing "+href);
  }
  assert.deepEqual(errors,[],"No page JavaScript exceptions");
  assert.deepEqual(notFound,[],"No missing source assets");
  assert.deepEqual(writes,[],"No score or response uploads");
  const stored=await keyPage.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}));
  assert.deepEqual(stored,{local:0,session:0});
  console.log("PASS V52: original 9 OR question pairs, exactly 7×4+2×6=40 Unit 5 practice marks, no full-syllabus claim.");
  console.log("PASS V52: 18 alternatives, all official B29–B32 summative theory and cognitive codes, 80 point-level rubric items, independent scientific/numerical arithmetic.");
  console.log("PASS V52: student browser never fetches model answers or saves scores; teacher explicit reveal renders 18 exact keyed cards, hide clears answer DOM, A4 portrait print and 390px mobile.");
 }finally{await browser.close();}
}
sourceChecks();
browserChecks().catch(e=>{console.error("FAIL V52",e.stack||e);process.exitCode=1;}).finally(()=>server.close());
