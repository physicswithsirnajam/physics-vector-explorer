#!/usr/bin/env node
"use strict";
/* V54 integration: actual first-run Unit 1/2 builder → 20-question quiz.
 * No question data, grading, saved attempts or Firebase rules are modified.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),http=require("node:http");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,".."),out=path.join(root,"qa-artifacts","builder-v54");
fs.mkdirSync(out,{recursive:true});
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const name=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  const file=path.resolve(root,"."+name);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end("Not found");return;
  }
  res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
  fs.createReadStream(file).pipe(res);
 }catch(err){res.writeHead(500);res.end(String(err));}
});
async function main(){
 const html=fs.readFileSync(path.join(root,"build-your-physics-test.html"),"utf8");
 const u1=JSON.parse(fs.readFileSync(path.join(root,"question-bank/grade-11/unit-01.json"),"utf8"));
 const u2=JSON.parse(fs.readFileSync(path.join(root,"question-bank/grade-11/unit-02.json"),"utf8"));
 assert.equal(u1.questions.length,275);assert.equal(u2.questions.length,206);
 assert.ok(html.includes('id="quickStartLink"'));
 assert.ok(html.includes('name="unit"'));
 assert.ok(html.includes('value="mcq" selected'));
 assert.ok(!html.includes("our first live MCQ pilot is available for Grade XI Unit 1"));
 await new Promise((resolve,reject)=>server.listen(0,"127.0.0.1",err=>err?reject(err):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  const page=await browser.newPage({viewport:{width:1365,height:900},deviceScaleFactor:1});
  const errs=[];page.on("pageerror",e=>errs.push(e.message));
  const base="http://127.0.0.1:"+server.address().port+"/";
  await page.goto(base+"build-your-physics-test.html",{waitUntil:"networkidle"});
  await page.waitForFunction(()=>document.getElementById("availabilityCount").textContent.includes("275 eligible MCQ"));
  assert.equal(await page.locator("#type").inputValue(),"mcq","MCQ mode must be first-run default");
  assert.equal(await page.locator('input[name="unit"][value="1"]').isChecked(),true);
  assert.equal(await page.locator('input[name="unit"][value="2"]').isChecked(),false);
  for(const n of [3,4,5])assert.equal(await page.locator('input[name="unit"][value="'+n+'"]').isDisabled(),false,"Unit "+n+" is now test-ready in V55");
  for(const n of [6,14])assert.equal(await page.locator('input[name="unit"][value="'+n+'"]').isDisabled(),true,"Unit "+n+" must not claim builder readiness");
  assert.equal(await page.locator("#allUnits").isDisabled(),false,"V56 enables all five published units");
  assert.equal(await page.locator("#quickStartLink").isVisible(),true,"Default quick start must be visible");
  assert.match(await page.locator("#quickStartLink").getAttribute("href"),/unit=1/);
  await page.screenshot({path:path.join(out,"01-unit1-ready.png"),fullPage:false});

  // V56 permits both units; deselect Unit 1 to verify Unit 2 still works alone.
  await page.locator('input[name="unit"][value="2"]').check();
  await page.waitForFunction(()=>document.getElementById("availabilityCount").textContent.includes("481 eligible MCQ"));
  assert.equal(await page.locator('input[name="unit"][value="1"]').isChecked(),true);
  await page.locator('input[name="unit"][value="1"]').uncheck();
  await page.waitForFunction(()=>document.getElementById("availabilityCount").textContent.includes("206 eligible MCQ"));
  assert.equal(await page.locator('input[name="unit"][value="2"]').isChecked(),true);
  assert.match(await page.locator("#quickStartLink").getAttribute("href"),/unit=2/);
  await page.screenshot({path:path.join(out,"02-unit2-ready.png"),fullPage:false});

  // First-run student launches directly into real Unit 2 practice engine.
  await page.locator("#quickStartLink").click();
  await page.waitForURL(/practice-engine\/index\.html\?/);
  await page.waitForFunction(()=>!document.getElementById("start").classList.contains("hidden"));
  assert.match(await page.locator("#unitTitle").textContent(),/Vectors/);
  assert.match(await page.locator("#setupSummary").textContent(),/20 MCQs/);
  await page.locator("#begin").click();
  await page.waitForFunction(()=>!document.getElementById("quiz").classList.contains("hidden"));
  assert.match(await page.locator("#qcounter").textContent(),/Question 1 of 20/);
  assert.equal(await page.locator('#choices label').count(),4);
  await page.screenshot({path:path.join(out,"03-unit2-quiz-started.png"),fullPage:false});

  // Bad SLO filters and empty selection cannot trigger a misleading Start button.
  await page.goto(base+"build-your-physics-test.html?unit=2",{waitUntil:"networkidle"});
  await page.waitForFunction(()=>document.getElementById("availabilityCount").textContent.includes("206 eligible MCQ"));
  await page.locator("#slo").fill("P-11-B-99");
  assert.equal(await page.locator("#quickStartLink").isVisible(),false);
  await page.locator("#slo").fill("");
  assert.equal(await page.locator("#quickStartLink").isVisible(),true);
  await page.locator("#clearUnits").click();
  assert.equal(await page.locator("#quickStartLink").isVisible(),false);
  await page.locator('input[name="unit"][value="1"]').check();
  assert.equal(await page.locator("#quickStartLink").isVisible(),true);

  // Full-exam PREVIEW cannot silently activate unsupported unit banks.
  await page.locator("#mode-full").check();
  assert.equal(await page.locator("#quickStartLink").isVisible(),false);
  await page.locator("#mode-practice").check();
  assert.equal(await page.locator('input[name="unit"]:checked').count(),1);
  assert.equal(await page.locator('input[name="unit"][value="1"]').isChecked(),true);
  assert.equal(await page.locator('input[name="unit"][value="5"]').isDisabled(),false);
  assert.equal(await page.locator('input[name="unit"][value="14"]').isDisabled(),true);
  await page.locator("#resetButton").click();
  assert.equal(await page.locator("#type").inputValue(),"mcq");
  await page.setViewportSize({width:390,height:844});
  const dimensions=await page.evaluate(()=>({vw:document.documentElement.clientWidth,sw:document.documentElement.scrollWidth}));
  assert.ok(dimensions.sw<=dimensions.vw+2,"390px mobile page overflow "+JSON.stringify(dimensions));
  await page.screenshot({path:path.join(out,"04-builder-mobile.png"),fullPage:false});
  assert.deepEqual(errs,[],"No uncaught builder/practice engine browser exceptions");
  console.log("PASS V54: default 275 Unit 1 / 206 Unit 2 pilot records, visible quick launch, valid MCQ selection.");
  console.log("PASS V54 regression on V56: Unit 2 remains available alone and in mixed selection; future units fail closed, filters and reset.");
  console.log("PASS V54: full-preview return, 390px mobile, no uncaught browser errors.");
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(err=>{console.error("FAIL V54",err);server.close();process.exitCode=1;});
