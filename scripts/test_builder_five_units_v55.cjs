#!/usr/bin/env node
"use strict";
/* V55 source integrity regression after V59: 990 source-backed public MCQs. */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),http=require("node:http"),vm=require("node:vm");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,".."),out=path.join(root,"qa-artifacts","builder-v55");
fs.mkdirSync(out,{recursive:true});
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const fileAt="question-bank/grade-11/";
const title=["","Physical Quantities and Measurements","Vectors","Translatory Motion","Rotational and Circular Motion","Work and Energy"];
const totals={1:275,2:206,3:80,4:80,5:349};
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".png":"image/png",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const name=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  const file=path.resolve(root,"."+name);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end("Not found");return;}
  res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
  fs.createReadStream(file).pipe(res);
 }catch(err){res.writeHead(500);res.end(String(err));}
});
async function assertAdapters(){
 const context={
  fetch:async url=>{
   const name=String(url);
   assert.ok(name.startsWith(fileAt),"adapter may only use known local question-bank files");
   const p=path.resolve(root,name);
   assert.ok(p.startsWith(path.join(root,fileAt)),"unsafe path");
   return {ok:true,json:async()=>read(name)};
  }
 };
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(root,"shared/practice-bank-adapter-v55.js"),"utf8"),context);
 const adapter=context.PSNPracticeBankV55;
 assert.ok(adapter&&typeof adapter.loadBank==="function");
 const original=[
  read(fileAt+"unit-01.json").questions,
  read(fileAt+"unit-02.json").questions,
  read(fileAt+"unit-03-stage2-80-practice.json").questions,
  read(fileAt+"unit-04-v39-80-practice.json").questions
 ];
 const a5=read(fileAt+"unit-05-v50-16-student.json"),b5=read(fileAt+"unit-05-v51-16-student-b.json");
 const ka=read(fileAt+"unit-05-v50-16-teacher-key.json"),kb=read(fileAt+"unit-05-v51-16-teacher-key-b.json");
 let allIds=new Set();
 for(let u=1;u<=5;u++){
  const data=await adapter.loadBank(u,fileAt);
  assert.equal(data.unit,u);assert.equal(data.questions.length,totals[u]);
  assert.equal(data.secureExam,false);assert.equal(data.publicSelfPractice,true);
  for(let i=0;i<data.questions.length;i++){
   const q=data.questions[i];
   assert.equal(q.grade,11);assert.equal(q.unit,u);
   assert.ok(!allIds.has(q.id),"globally repeated question ID "+q.id);allIds.add(q.id);
   if(u<=4){
    const source=original[u-1][i];
    for(const field of ["id","stem","correctOptionId","explanation","sourceQuestionNumber"]){
     assert.equal(q[field],source[field],"altered original "+field+" in "+q.id);
    }
    assert.deepEqual(JSON.parse(JSON.stringify(q.options)),source.options,"altered option "+q.id);
    if(source.stimulusHtml)assert.equal(q.stimulusHtml,source.stimulusHtml,"lost original rich MathML stimulus");
    if(source.scenarioSetId)assert.ok(q.stimulusHtml.includes(source.stimulusText),"missing source scenario");
   }
  }
  if(u===5){
    const original5=[...a5.questions,...b5.questions],answers=[...ka.answerKeys,...kb.answerKeys];
    const keys=new Map(answers.map(q=>[q.id,q]));
    assert.equal(keys.size,32);
    assert.equal(new Set(data.questions.map(q=>q.id)).size,349);
    for(const [i,q] of data.questions.slice(0,32).entries()){
     assert.equal(q.stem,original5[i].stem);
     assert.deepEqual(JSON.parse(JSON.stringify(q.options)),original5[i].options);
     assert.equal(q.correctOptionId,keys.get(q.id).correctOptionId);
     assert.equal(q.explanation,keys.get(q.id).workedSteps.join(" "));
     assert.equal(q.sloCodes[0],original5[i].sloCode);
     assert.equal(q.difficulty,"Unspecified","do not invent source difficulty");
     assert.equal(q.sourceSet,i<16?"A":"B");
     if(q.scenarioSetId)assert.ok(q.stimulusHtml.includes(i<16?a5.scenarios[0].stimulus:b5.scenarios[0].stimulus));
    }
    const master=read(fileAt+"unit-05-master-topic-v59-317.json");
    assert.equal(master.sourceQuestionCount,320);
    assert.equal(master.questions.length,317);
    assert.equal(master.excludedPendingFigureReview.length,3);
    const held=new Set(master.excludedPendingFigureReview.map(q=>q.id));
    const added=data.questions.slice(32);
    assert.equal(added.length,317);
    const groups=new Map();
    for(const [i,q] of added.entries()){
     const source=master.questions[i];
     assert.ok(!held.has(q.id),"Missing-figure question must not be student-facing");
     for(const field of ["id","stem","correctOptionId","explanation","sourceQuestionNumber"])
       assert.equal(q[field],source[field],"Changed source field "+field+" in "+q.id);
     assert.deepEqual(JSON.parse(JSON.stringify(q.options)),source.options);
     assert.equal(q.sloCodes[0],source.sloCodes[0]);
     assert.equal(q.difficulty,"Unspecified");
     if(q.stimulusSetId){
       assert.equal(q.stimulusHtml,source.stimulusHtml);
       if(!groups.has(q.stimulusSetId))groups.set(q.stimulusSetId,[]);
       groups.get(q.stimulusSetId).push(q.id);
     }
    }
    assert.equal(groups.size,24,"All new scenario introductions must be preserved");
    assert.ok([...groups.values()].every(items=>items.length===4));
   }
    console.log("PASS source adapter Unit "+u+": "+data.questions.length+" original records, normalized and keys verified");
 }
 assert.equal(allIds.size,990,"all 990 original and imported questions must have unique IDs");
 await assert.rejects(adapter.loadBank(6,fileAt));
 await assert.rejects(adapter.loadBank(5,"https://untrusted.test/"),/unexpected question bank folder/);
}
async function assertBrowser(){
 await new Promise((resolve,reject)=>server.listen(0,"127.0.0.1",err=>err?reject(err):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  const page=await browser.newPage({viewport:{width:1365,height:900},deviceScaleFactor:1});
  const errors=[];page.on("pageerror",err=>errors.push(err.message));
  const base="http://127.0.0.1:"+server.address().port+"/";
  for(let u=1;u<=5;u++){
   await page.goto(base+"build-your-physics-test.html?unit="+u,{waitUntil:"networkidle"});
   await page.waitForFunction(({n})=>document.getElementById("availabilityCount")?.textContent.includes(n+" eligible MCQ"),{n:totals[u]});
   assert.equal(await page.locator('input[name="unit"][value="'+u+'"]').isChecked(),true);
   assert.equal(await page.locator('input[name="unit"]:checked').count(),1);
   assert.equal(await page.locator("#quickStartLink").isVisible(),true,"missing unit "+u+" start link");
   assert.match(await page.locator("#quickStartLink").getAttribute("href"),new RegExp("unit="+u+"(?:&|$)"));
   await page.locator("#quickStartLink").click();
   await page.waitForFunction(()=>!document.getElementById("start").classList.contains("hidden"));
   assert.match(await page.locator("#unitTitle").textContent(),new RegExp(title[u].replace(/[.*+?^$"()|[\]\\]/g,"\\$&")));
   await page.locator("#begin").click();
   await page.waitForFunction(()=>!document.getElementById("quiz").classList.contains("hidden"));
   assert.match(await page.locator("#qcounter").textContent(),/Question 1 of 20/);
   assert.equal(await page.locator("#choices label").count(),4);
   if(u===5)await page.screenshot({path:path.join(out,"05-work-energy-20-mcq-start.png"),fullPage:false});
   console.log("PASS browser: Unit "+u+" -> central builder -> actual 20-MCQ quiz");
  }
  // Whole-group scenario mode retains a full 4-question situation on Units 3–5.
  for(let u=3;u<=5;u++){
   await page.goto(base+"build-your-physics-test.html?unit="+u,{waitUntil:"networkidle"});
   await page.locator("#quantity").selectOption("4");
   await page.locator("#arrangement").selectOption("scenario");
   await page.waitForFunction(()=>document.getElementById("quickStartLink").style.display!=="none");
   await page.locator("#quickStartLink").click();
   await page.waitForFunction(()=>!document.getElementById("start").classList.contains("hidden"));
   await page.locator("#begin").click();
   await page.waitForFunction(()=>!document.getElementById("quiz").classList.contains("hidden"));
   assert.match(await page.locator("#qcounter").textContent(),/Scenario 1 \(1\/4\)/);
   assert.equal(await page.locator("#stimulusPanel").isVisible(),true);
   assert.ok((await page.locator("#stimulusPanel").textContent()).trim().length>30,"missing Unit "+u+" scenario context");
   for(let i=1;i<4;i++){
    await page.locator("#next").click();
    assert.match(await page.locator("#qcounter").textContent(),new RegExp("Scenario 1 \\("+(i+1)+"/4\\)"));
   }
   console.log("PASS browser: Unit "+u+" full 4-question scenario preserved");
  }
  await page.goto(base+"build-your-physics-test.html?unit=5",{waitUntil:"networkidle"});
  await page.waitForFunction(()=>document.getElementById("availabilityCount")?.textContent.includes("349 eligible MCQ"));
  await page.locator("#quantity").selectOption("40");
  assert.equal(await page.locator("#quickStartLink").isVisible(),true,"Unit 5 should now support 40 source-backed MCQs");
  await page.locator("#quantity").selectOption("20");
  await page.locator("#slo").fill("P-11-B-29");
  await page.waitForFunction(()=>document.getElementById("availabilityCount")?.textContent.includes("88 eligible MCQ"));
  assert.equal(await page.locator("#quickStartLink").isVisible(),true);
  await page.locator("#slo").fill("P-11-B-99");
  await page.waitForFunction(()=>document.getElementById("availabilityCount")?.textContent.includes("0 eligible MCQ"));
  assert.equal(await page.locator("#quickStartLink").isVisible(),false);
  await page.locator("#slo").fill("P-11-B-29");
  await page.locator("#quantity").selectOption("4");
  assert.equal(await page.locator("#quickStartLink").isVisible(),true);
  await page.locator("#slo").fill("");
  await page.locator("#quickStartLink").click();
  await page.waitForFunction(()=>!document.getElementById("start").classList.contains("hidden"));
  await page.locator("#begin").click();
  await page.locator('#choices input[type="radio"]').first().check();
  page.once("dialog",dialog=>dialog.accept());
  await page.locator("#submit").click();
  await page.waitForFunction(()=>!document.getElementById("result").classList.contains("hidden"));
  assert.ok((await page.locator("#review").textContent()).includes("Correct answer:"));
  assert.equal(await page.locator("#save-result").isDisabled(),true,"Unit 5 cloud saving remains restricted");
  await page.screenshot({path:path.join(out,"05-work-energy-ungraded-report.png"),fullPage:false});
  await page.goto(base+"build-your-physics-test.html?unit=5",{waitUntil:"networkidle"});
  await page.setViewportSize({width:390,height:844});
  const w=await page.evaluate(()=>[document.documentElement.clientWidth,document.documentElement.scrollWidth]);
  assert.ok(w[1]<=w[0]+2,"mobile builder should not overflow");
  await page.screenshot({path:path.join(out,"05-builder-mobile.png"),fullPage:false});
  assert.deepEqual(errors,[],"no uncaught browser exceptions");
  console.log("PASS V59+V55 regression: 990 source-backed MCQs, original 32 retained, 317 new Unit 5 source questions, 26 Unit 5 scenarios and mobile");
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
(async()=>{await assertAdapters();await assertBrowser();})().catch(err=>{console.error("FAIL V55",err);server.close();process.exitCode=1;});
