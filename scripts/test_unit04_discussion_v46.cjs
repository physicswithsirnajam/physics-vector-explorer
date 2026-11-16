#!/usr/bin/env node
"use strict";
/* V46: real Chromium, bank-derived 80 question + 80 teacher solution fidelity checks.
 * This is PUBLIC post-practice teaching content, not a secure access control or exam.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),http=require("node:http"),path=require("node:path");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,".."),screens=path.join(root,"qa-artifacts","unit04-v46");
fs.mkdirSync(screens,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const bank=JSON.parse(read("question-bank/grade-11/unit-04-v39-80-practice.json"));
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const audit=JSON.parse(read("portal/unit-04-slo-audit.json"));
const html=read("portal/unit-04-discussion-slides.html"),js=read("portal/unit-04-discussion-slides.js");
const student=read("portal/unit-04-projector-practice.js");
const desk=read("portal/unit-04.html"),hub=read("portal/unit-04-assessment-pack.html");
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let f=path.resolve(root,"."+p);
  if(f!==root&&!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,"index.html");
  if(!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end("Not found");return;}
  res.writeHead(200,{"Content-Type":mime[path.extname(f)]||"application/octet-stream","Cache-Control":"no-store"});
  fs.createReadStream(f).pipe(res);
 }catch(err){res.writeHead(500);res.end(String(err));}
});
const SLO=["P-11-B-07","P-11-B-08","P-11-B-09","P-11-B-10","P-11-B-14","P-11-B-15","P-11-B-16","P-11-B-17","P-11-B-18","P-11-B-19","P-11-B-20","P-11-B-21"];
function sourceChecks(){
 assert.equal(bank.schemaVersion,1);assert.equal(bank.status,"practice-pilot");
 assert.equal(bank.questions.length,80);
 assert.deepEqual({straight:bank.structure.straight,scenario:bank.structure.scenario,sets:bank.structure.scenarioSets},
                  {straight:56,scenario:24,sets:6});
 const counts={A:0,B:0,C:0,D:0},seen=new Set(),grouped=new Map(),levels=new Set();
 for(const [i,q] of bank.questions.entries()){
  assert.equal(q.sourceQuestionNumber,i+1);
  assert.ok(q.id&&!seen.has(q.id));seen.add(q.id);
  assert.equal(q.grade,11);assert.equal(q.unit,4);assert.equal(q.boardEligible,false);
  assert.equal(q.assessmentClassification,"summative-theory");
  assert.ok(SLO.includes(q.sloCodes[0]));
  assert.equal(q.sloCodes.length,1);
  assert.ok(["Knowledge","Understanding","Application"].includes(q.cognitiveLevel));levels.add(q.cognitiveLevel);
  assert.ok(q.source.textbookPage>=53&&q.source.textbookPage<=76);
  assert.ok(q.explanation.length>=20);
  assert.deepEqual(q.options.map(o=>o.id),["A","B","C","D"]);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));counts[q.correctOptionId]++;
  if(i<56)assert.ok(!q.scenarioSetId);
  else {
   assert.ok(q.scenarioSetId&&q.stimulusText&&q.scenarioTitle);
   if(!grouped.has(q.scenarioSetId))grouped.set(q.scenarioSetId,[]);
   grouped.get(q.scenarioSetId).push(q);
  }
 }
 assert.deepEqual(counts,{A:20,B:20,C:20,D:20});
 assert.deepEqual([...levels].sort(),["Application","Knowledge","Understanding"]);
 assert.equal(grouped.size,6);
 for(const values of grouped.values()){
  assert.equal(values.length,4);
  assert.deepEqual(values.map(q=>q.scenarioIndex),[1,2,3,4]);
  assert.equal(new Set(values.map(q=>q.stimulusText)).size,1);
 }
 for(const old of ["localStorage","sessionStorage","indexedDB","Firestore","Firebase","setDoc","sendBeacon","postMessage"]){
  assert.ok(!js.includes(old),"Teacher presentation must not access student records: "+old);
 }
 assert.ok(!js.includes("innerHTML"),"All bank text must use textContent / DOM nodes");
 assert.ok(js.includes("unit-04-v39-80-practice.json"));
 assert.ok(!js.includes("setInterval")&&!js.includes("setTimeout")&&!js.includes("autoAdvance"),
  "Teacher discussion MUST remain untimed / manually advanced");
 assert.ok(!student.includes("unit-04-discussion-slides"),"Timed student source must remain completely separate");
 for(const token of ["src=\"./assets/physics-with-sir-najam-official-logo.png\"",
  "src=\"./unit-04-discussion-slides.js\"",
  "public teaching resource, not access-restricted",
  "Reveal worked solution"]){
  assert.ok(html.includes(token),"Missing original logo/source/public boundary "+token);
 }
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,"Duplicate DOM ID");
 for(const id of ["loadStatus","stageShell","stepIndex","questionIndex","phaseLabel","scenarioBadge",
  "contextPane","contextHeading","contextText","questionText","optionGrid","solutionPanel",
  "solutionHeading","solutionExplanation","solutionMeta","discussionPrompt","teacherNotice",
  "progressLabel","startBtn","prevBtn","revealBtn","hideBtn","nextBtn","fullscreenBtn",
  "jumpInput","jumpBtn"]){
  assert.ok(ids.includes(id),"Missing UI element "+id);
 }
 const u4=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===4);
 assert.equal(u4.questionBankCount,395);
 assert.equal(u4.resourceIds.length,18);assert.equal(new Set(u4.resourceIds).size,18);
 assert.ok(u4.resourceIds.includes("unit4-discussion-slides"));
 assert.ok(u4.resourceIds.includes("unit4-projector-practice"));
 assert.equal(u4.assessmentStatus,"provisional-unit4-integrated-80-mark-classroom-practice");
 const item=catalog.resources.filter(x=>x.id==="unit4-discussion-slides");
 assert.equal(item.length,1);assert.equal(item[0].public,true);
 assert.equal(item[0].href,"./unit-04-discussion-slides.html");
 assert.ok(item[0].accessDescription.includes("Public"));
 assert.ok(desk.includes('href="./unit-04-discussion-slides.html"'));
 assert.ok(hub.includes('href="./unit-04-discussion-slides.html"'));
 assert.equal(audit.teacherDiscussionSlidesPublished,true);
 assert.equal(audit.teacherDiscussionPage,"./unit-04-discussion-slides.html");
 assert.equal(audit.protectedOrGradedAssessmentPublished,false);
 assert.equal(audit.studentGradesRecorded,false);
 const u3=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===3);
 assert.equal(u3.resourceIds.length,10);assert.equal(u3.questionBankCount,220);
}
async function runBrowser(){
 await new Promise((resolve,reject)=>server.once("error",reject).listen(0,"127.0.0.1",resolve));
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1365,height:900}});
  const errors=[],nonGets=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("request",r=>{if(r.method()!=="GET")nonGets.push(r.method()+" "+r.url());});
  const base="http://127.0.0.1:"+server.address().port+"/portal/";
  const response=await page.goto(base+"unit-04-discussion-slides.html",{waitUntil:"networkidle"});
  assert.equal(response.status(),200);
  await page.waitForFunction(()=>document.getElementById("loadStatus").textContent.includes("Ready · 80"));
  assert.equal(await page.locator("#startBtn").isEnabled(),true);
  assert.equal(await page.locator("#revealBtn").isEnabled(),false);
  assert.equal(await page.locator("#solutionPanel").isVisible(),false);
  await page.locator("#startBtn").click();
  assert.equal(await page.locator("#stepIndex").textContent(),"Discussion 1 / 160");
  assert.equal(await page.locator("#phaseLabel").textContent(),"Question only");
  assert.equal(await page.locator("#nextBtn").isEnabled(),false,
   "Next must not accidentally reveal the key or skip the question");
  await page.locator("#questionText").click();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator("#stepIndex").textContent(),"Discussion 1 / 160",
   "Keyboard next must not reveal an answer without pressing Reveal");
  // Verify every one of 80 questions and every one of 80 teacher solutions against the unchanged bank.
  for(let i=0;i<80;i++){
   const q=bank.questions[i];
   assert.equal(await page.locator("#stepIndex").textContent(),"Discussion "+(2*i+1)+" / 160");
   assert.equal(await page.locator("#questionIndex").textContent(),"Q "+(i+1)+" / 80");
   assert.equal(await page.locator("#phaseLabel").textContent(),"Question only");
   assert.equal(await page.locator("#questionText").textContent(),q.stem);
   assert.equal(await page.locator("#solutionPanel").isVisible(),false);
   assert.equal(await page.locator("#optionGrid .option.correct").count(),0);
   assert.equal(await page.locator("#optionGrid .correct-label").count(),0);
   assert.equal(await page.locator("#solutionExplanation").textContent(),"");
   assert.equal(await page.locator("#solutionMeta").textContent(),"");
   assert.deepEqual(await page.locator("#optionGrid .letter").allTextContents(),["A","B","C","D"]);
   assert.deepEqual(await page.locator("#optionGrid .option-text").allTextContents(),q.options.map(o=>o.text));
   assert.equal(await page.locator("#revealBtn").isEnabled(),true);
   assert.equal(await page.locator("#nextBtn").isEnabled(),false);
   if(q.scenarioSetId){
    assert.equal(await page.locator("#contextPane").isVisible(),true);
    assert.equal(await page.locator("#contextText").textContent(),q.stimulusText);
   }else assert.equal(await page.locator("#contextPane").isVisible(),false);
   if(i===0||i===56||i===79)await page.screenshot({path:path.join(screens,"question-"+(i+1)+".png"),fullPage:false});
   await page.locator("#revealBtn").click();
   assert.equal(await page.locator("#stepIndex").textContent(),"Discussion "+(2*i+2)+" / 160");
   assert.equal(await page.locator("#phaseLabel").textContent(),"Worked solution");
   assert.equal(await page.locator("#solutionPanel").isVisible(),true);
   assert.equal(await page.locator("#solutionExplanation").textContent(),q.explanation);
   const correct=q.options.find(o=>o.id===q.correctOptionId);
   assert.equal(await page.locator("#solutionHeading").textContent(),"Correct option "+correct.id+" — "+correct.text);
   const meta=await page.locator("#solutionMeta").textContent();
   for(const token of [q.sloCodes[0],q.cognitiveLevel,q.topic,"p. "+q.source.textbookPage]){
    assert.ok(meta.includes(token),"Missing teacher metadata "+token+" at question "+(i+1));
   }
   assert.ok((await page.locator("#discussionPrompt").textContent()).length>50);
   assert.equal(await page.locator("#optionGrid .option.correct").count(),1);
   assert.equal(await page.locator("#optionGrid .option.correct .letter").textContent(),q.correctOptionId);
   assert.equal(await page.locator("#revealBtn").isEnabled(),false);
   assert.equal(await page.locator("#hideBtn").isEnabled(),true);
   if(i===0||i===56||i===79)await page.screenshot({path:path.join(screens,"solution-"+(i+1)+".png"),fullPage:false});
   if(i<79){
    assert.equal(await page.locator("#nextBtn").isEnabled(),true);
    await page.locator("#nextBtn").click();
   }else assert.equal(await page.locator("#nextBtn").isEnabled(),false);
  }
  // Previous from a visible solution should return to the same question, not a prior visible key.
  await page.locator("#prevBtn").click();
  assert.equal(await page.locator("#stepIndex").textContent(),"Discussion 159 / 160");
  assert.equal(await page.locator("#solutionPanel").isVisible(),false);
  await page.locator("#prevBtn").click();
  assert.equal(await page.locator("#stepIndex").textContent(),"Discussion 157 / 160");
  // A jump must hide any previously revealed answer, including jumping to the same number.
  await page.locator("#revealBtn").click();
  await page.locator("#jumpInput").fill("57");
  await page.locator("#jumpBtn").click();
  assert.equal(await page.locator("#stepIndex").textContent(),"Discussion 113 / 160");
  assert.equal(await page.locator("#solutionPanel").isVisible(),false);
  assert.equal(await page.locator("#contextText").textContent(),bank.questions[56].stimulusText);
  await page.locator("#revealBtn").click();
  await page.locator("#jumpInput").fill("57");
  await page.locator("#jumpBtn").click();
  assert.equal(await page.locator("#solutionPanel").isVisible(),false,
    "Jump to same question must explicitly reset answer disclosure");
  // Invalid jumps cannot navigate and must not reveal a solution.
  await page.locator("#jumpInput").fill("81");
  await page.locator("#jumpBtn").click();
  assert.equal(await page.locator("#stepIndex").textContent(),"Discussion 113 / 160");
  assert.equal(await page.locator("#solutionPanel").isVisible(),false);
  // Only the existing bank was fetched: no requests writing student data.
  assert.deepEqual(nonGets,[]);
  const stores=await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}));
  assert.deepEqual(stores,{local:0,session:0});
  assert.deepEqual(errors,[],"Uncaught browser errors: "+errors.join("; "));
  await page.setViewportSize({width:390,height:844});
  const box=await page.evaluate(()=>({view:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(box.scroll<=box.view+2,"Mobile discussion slide should not widen page: "+JSON.stringify(box));
  assert.equal(await page.locator("#optionGrid .option").count(),4);
  await page.screenshot({path:path.join(screens,"discussion-mobile.png"),fullPage:false});
  console.log("PASS V46: all 160 teacher sequence states (80 question-only + 80 explicitly revealed solutions) checked against source bank.");
  console.log("PASS V46: every correct option, original explanation, SLO, cognitive level, topic, source page and six full scenario passages match.");
  console.log("PASS V46: keyboard Next gate, previous/hide, same-question jump resets answer, mobile width, no grade storage/writes or JS errors.");
  console.log("V46 remains PUBLIC provisional post-practice teaching material, not a secure or examiner-certified answer key.");
 }finally{await browser.close();}
}
sourceChecks();
runBrowser().catch(e=>{console.error("FAIL V46 teacher discussion:",e.stack||e);process.exitCode=1;}).finally(()=>server.close());
