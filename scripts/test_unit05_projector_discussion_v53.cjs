#!/usr/bin/env node
"use strict";
/* V53 source, regression and actual Chromium tests for teacher-led projector slides.
 * Existing V52 student and worked teacher data are unchanged. */
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),http=require("node:http");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,".."),out=path.join(root,"qa-artifacts","unit05-v53");
fs.mkdirSync(out,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const student=JSON.parse(read("question-bank/grade-11/unit-05-v52-descriptive-student.json"));
const key=JSON.parse(read("question-bank/grade-11/unit-05-v52-descriptive-teacher-key.json"));
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const levels={"P-11-B-29":"Application","P-11-B-30":"Application","P-11-B-31":"Understanding","P-11-B-32":"Application"};
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".png":"image/png"};
const server=http.createServer((req,res)=>{
 try{
  const p=decodeURIComponent(new URL(req.url,"http://localhost").pathname),f=path.resolve(root,"."+p);
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return;}
  res.writeHead(200,{"Content-Type":mime[path.extname(f)]||"application/octet-stream","Cache-Control":"no-store"});
  fs.createReadStream(f).pipe(res);
 }catch(err){res.writeHead(500);res.end(String(err));}
});
function scienceAndCatalog(){
 const qs=[...student.sectionB,...student.sectionC];
 assert.equal(qs.length,9);assert.equal(key.answers.length,18);
 assert.equal(key.answers.reduce((acc,a)=>acc+a.marking.length,0),80);
 assert.equal(qs.reduce((sum,q)=>sum+q.marks,0),40);
 const ids=new Set(),solutions=new Map(key.answers.map(a=>[a.choiceId,a]));
 for(const q of qs){
  assert.equal(q.choices.length,2);
  assert.equal(q.marks,q.number<=7?4:6);
  assert.equal(q.choices[0].sloCode,q.choices[1].sloCode);
  for(const c of q.choices){
   assert.equal(c.cognitiveLevel,levels[c.sloCode]);
   assert.equal(c.assessment,"summative-theory");
   assert.ok(c.sourcePage>=79&&c.sourcePage<=83);
   assert.ok(!ids.has(c.id));ids.add(c.id);
   const a=solutions.get(c.id);assert.ok(a);
   assert.equal(a.marking.length,q.marks);
   assert.equal(a.marking.reduce((s,m)=>s+m.marks,0),q.marks);
   assert.ok(a.marking.every(m=>m.marks===1));
  }
 }
 assert.equal(ids.size,18);
 const u=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===5);
 assert.equal(u.questionBankCount,349);
 assert.equal(u.descriptivePracticeMarks,40);
 assert.equal(u.resourceIds.length,11);
 assert.equal(u.resourceIds.at(-1),"unit5-projector-discussion");
 const r=catalog.resources.find(r=>r.id==="unit5-projector-discussion");
 assert.equal(r.public,true);assert.equal(r.href,"./unit-05-projector-discussion.html");
 assert.ok(read("portal/unit-05.html").includes(r.href));
 const page=read("portal/unit-05-projector-discussion.html"),js=read("portal/unit-05-projector-discussion-v53.js");
 assert.ok(page.includes('assets/physics-with-sir-najam-official-logo.png'));
 assert.ok(page.includes("not a secure test"));
 assert.ok(js.includes("unit-05-v52-descriptive-student.json"));
 assert.ok(js.includes("unit-05-v52-descriptive-teacher-key.json"));
 assert.ok(!/localStorage|sessionStorage|setItem\s*\(|post\s*\(|sendBeacon|XMLHttpRequest|firebase|firestore/i.test(js));
 assert.ok(!/correctOptionId|answerKey|questionBankCount\s*=\s*80/.test(js));
}
async function main(){
 scienceAndCatalog();
 await new Promise((resolve,reject)=>server.listen(0,"127.0.0.1",err=>err?reject(err):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  const page=await browser.newPage({viewport:{width:1365,height:900},deviceScaleFactor:1});
  const errors=[],requests=[],posted=[];
  page.on("pageerror",err=>errors.push(err.message));
  page.on("request",req=>{
   requests.push(req.url());
   if(req.method()!=="GET")posted.push(req.method()+" "+req.url());
  });
  const url="http://127.0.0.1:"+server.address().port+"/portal/unit-05-projector-discussion.html";
  await page.goto(url,{waitUntil:"networkidle"});
  await page.waitForFunction(()=>document.getElementById("loadStatus").textContent.startsWith("Ready"));
  const keyRequests=()=>requests.filter(x=>x.includes("unit-05-v52-descriptive-teacher-key.json")).length;
  assert.equal(keyRequests(),0,"Teacher key must not be fetched on opening question view");
  assert.equal(await page.locator("#questionPicker option").count(),9);
  assert.equal(await page.locator("#solutionSteps li").count(),0);
  assert.equal(await page.locator("#questionText").textContent(),student.sectionB[0].choices[0].prompt);
  assert.equal(await page.locator("#teacherInsight").isHidden(),true);
  assert.equal(await page.locator("#slideCount").textContent(),"1 / 9");
  const logo=await page.locator(".brand img").evaluate(e=>e.complete&&e.naturalWidth>0);
  assert.equal(logo,true,"Original official logo must load");
  await page.screenshot({path:path.join(out,"01-question-only.png"),fullPage:false});
  await page.locator("#revealStep").click();
  await page.waitForFunction(()=>document.querySelectorAll("#solutionSteps li").length===1);
  assert.equal(keyRequests(),1,"Teacher key loads on explicit teacher reveal only");
  assert.equal(await page.locator("#stepCounter").textContent(),"1 / 4 steps");
  await page.locator("#revealStep").click();await page.locator("#revealStep").click();await page.locator("#revealStep").click();
  assert.equal(await page.locator("#solutionSteps li").count(),4);
  assert.equal(await page.locator("#teacherInsight").isHidden(),false);
  await page.screenshot({path:path.join(out,"02-four-steps.png"),fullPage:false});
  await page.locator("#hideSteps").click();
  assert.equal(await page.locator("#solutionSteps li").count(),0,"Hide removes actual solution nodes");
  assert.equal(await page.locator("#teacherInsight").isHidden(),true);
  await page.locator("#optionB").click();
  assert.equal(await page.locator("#questionText").textContent(),student.sectionB[0].choices[1].prompt);
  assert.equal(await page.locator("#solutionSteps li").count(),0);
  await page.locator("#questionPicker").selectOption("1");
  await page.locator("#optionB").click();
  for(let i=0;i<4;i++)await page.locator("#revealStep").click();
  assert.match(await page.locator("#solutionSteps").textContent(),/\+12 J/,"Signed force graph must give net +12 J");
  await page.screenshot({path:path.join(out,"03-signed-graph.png"),fullPage:false});
  await page.locator("#questionPicker").selectOption("3");
  assert.equal(await page.locator("#solutionSteps li").count(),0,"Changing question resets revealed solution");
  await page.locator("#optionB").click();
  for(let i=0;i<4;i++)await page.locator("#revealStep").click();
  assert.match(await page.locator("#solutionSteps").textContent(),/4\.0 m/,"Stopping before 5m must be explained");
  await page.locator("#questionPicker").selectOption("8");
  await page.locator("#optionB").click();
  for(let i=0;i<6;i++)await page.locator("#revealStep").click();
  assert.equal(await page.locator("#solutionSteps li").count(),6);
  assert.match(await page.locator("#solutionSteps").textContent(),/8\.0 m/,"Unreachable 10m target stops at 8m");
  assert.equal(await page.locator("#revealStep").isDisabled(),true);
  await page.locator("#presentationToggle").click();
  assert.equal(await page.locator("body").evaluate(e=>e.classList.contains("focus-mode")),true);
  await page.screenshot({path:path.join(out,"04-focus-projector.png"),fullPage:false});
  await page.locator("#presentationToggle").click();
  await page.locator("#hideSteps").click();
  await page.setViewportSize({width:390,height:844});
  const dim=await page.evaluate(()=>({w:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dim.scroll<=dim.w+2,"Mobile horizontal overflow: "+JSON.stringify(dim));
  assert.equal(await page.locator("#solutionSteps li").count(),0);
  await page.screenshot({path:path.join(out,"05-mobile-390.png"),fullPage:false});
  await page.emulateMedia({media:"print"});
  assert.equal(await page.locator(".toolbar").evaluate(e=>getComputedStyle(e).display),"none");
  assert.equal(await page.locator(".controls").evaluate(e=>getComputedStyle(e).display),"none");
  await page.emulateMedia({media:"screen"});
  assert.equal(keyRequests(),1,"Do not repeat-load already validated public teacher key");
  assert.deepEqual(posted,[],"No student data or grades may be transmitted");
  assert.deepEqual(errors,[],"No uncaught JS exceptions");
  assert.equal((await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}))).local,0);
  console.log("PASS V53: V52 9 OR questions, 18 alternatives, 80 one-mark steps; original SLO and 40-mark scope intact.");
  console.log("PASS V53: Chromium question-first projector, key loaded on deliberate reveal, hide/OR/reset, negative graph and unreachable stopping cases.");
  console.log("PASS V53: original logo, focus view, 390px responsive, print-only current slide, no POST/grade storage or browser errors.");
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(err=>{console.error("FAIL V53",err);server.close();process.exitCode=1;});
