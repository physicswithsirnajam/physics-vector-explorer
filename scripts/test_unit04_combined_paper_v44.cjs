#!/usr/bin/env node
"use strict";
/*
 * V44 Chromium QA: one combined student-only question paper from both original Unit 4 banks.
 * Validates the REAL rendered DOM and print CSS; teacher must still inspect physical A4 output.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),http=require("node:http"),path=require("node:path");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,".."),artifact=path.join(root,"qa-artifacts","unit04-v44");
fs.mkdirSync(artifact,{recursive:true});
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const mcq=load("question-bank/grade-11/unit-04-v39-80-practice.json");
const desc=load("question-bank/grade-11/unit-04-descriptive-practice.json");
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let dest=path.resolve(root,"."+pathname);
  if(dest!==root&&!dest.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(dest)&&fs.statSync(dest).isDirectory())dest=path.join(dest,"index.html");
  if(!fs.existsSync(dest)||!fs.statSync(dest).isFile()){res.writeHead(404);res.end("Not found");return;}
  res.writeHead(200,{"Content-Type":types[path.extname(dest)]||"application/octet-stream","Cache-Control":"no-store"});
  fs.createReadStream(dest).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
const codes=["P-11-B-07","P-11-B-08","P-11-B-09","P-11-B-10","P-11-B-14","P-11-B-15","P-11-B-16","P-11-B-17","P-11-B-18","P-11-B-19","P-11-B-20","P-11-B-21"];
async function check(){
 await new Promise((resolve,reject)=>server.once("error",reject).listen(0,"127.0.0.1",resolve));
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1365,height:900},deviceScaleFactor:1});
  const errors=[];page.on("pageerror",error=>errors.push(error.message));
  const base="http://127.0.0.1:"+server.address().port+"/portal/";
  const response=await page.goto(base+"unit-04-combined-student-paper.html",{waitUntil:"networkidle"});
  assert.equal(response.status(),200);
  await page.waitForFunction(()=>document.getElementById("loadStatus").textContent.includes("Ready · 80 MCQs"),{timeout:30000});
  assert.equal(await page.locator("#printPaper").isEnabled(),true);
  assert.equal(await page.locator("#paper").getAttribute("data-output-type"),"student-questions-only");
  assert.equal(await page.locator("#mcqQuestions .mcq-block").count(),10);
  assert.equal(await page.locator("#mcqQuestions .mcq-table").count(),10);
  assert.equal(await page.locator("#mcqQuestions .mcq-table tbody tr").count(),80);
  assert.equal(await page.locator("#mcqQuestions .mcq-table thead tr th").count(),100);
  assert.equal(await page.locator("#mcqQuestions .empty-bubble").count(),320);
  assert.equal(await page.locator("#mcqQuestions .scenario-context").count(),6);
  assert.equal(await page.locator("#mcqQuestions .scenario-context p").count(),6);
  assert.equal(await page.locator("#shortQuestions .desc-question").count(),7);
  assert.equal(await page.locator("#longQuestions .desc-question").count(),2);
  assert.equal(await page.locator(".question-option").count(),18);
  assert.equal(await page.locator(".or-divider").count(),9);
  const rows=page.locator("#mcqQuestions .mcq-table tbody tr");
  const numbers=await rows.locator("td:first-child").allTextContents();
  assert.deepEqual(numbers.map(t=>Number(t.trim())),Array.from({length:80},(_,i)=>i+1));
  const stems=await rows.locator("td:nth-child(2)").allTextContents();
  assert.deepEqual(stems,mcq.questions.map(q=>q.stem),"Printed MCQ stems must be exactly the current bank");
  const optionCells=await rows.locator("td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6)").allTextContents();
  assert.deepEqual(optionCells,mcq.questions.flatMap(q=>q.options.map(o=>o.text)),"Printed option wording and order must be unchanged");
  const contexts=await page.locator("#mcqQuestions .scenario-context p").allTextContents();
  const groups=new Map();
  for(const q of mcq.questions.slice(56)){if(!groups.has(q.scenarioSetId))groups.set(q.scenarioSetId,q.stimulusText);}
  assert.equal(groups.size,6);
  assert.deepEqual(contexts,[...groups.values()],"Every scenario must have its complete original stimulus exactly once");
  for(let i=0;i<6;i++)assert.ok((await page.locator("#mcqQuestions .mcq-block").nth(i+4).locator("h3").innerText()).includes("Q"+(57+i*4)+"–"+(60+i*4)));
  const choices=await page.locator(".question-option").allTextContents();
  const fromBank=[...desc.sectionB,...desc.sectionC].flatMap(q=>q.choices.map((o,i)=>(i===0?"A. ":"B. ")+o.prompt));
  assert.deepEqual(choices,fromBank,"Descriptive OR questions must exactly match original bank");
  const sloFromBoth=new Set([...mcq.questions.map(q=>q.sloCodes[0]),...[...desc.sectionB,...desc.sectionC].flatMap(q=>q.choices.map(o=>o.slo))]);
  assert.deepEqual([...sloFromBoth].sort(),codes.sort(),"Only expected 12 Unit 4 summative SLOs");
  assert.equal(mcq.questions.length*.5+desc.sectionB.reduce((v,q)=>v+q.marks,0)+desc.sectionC.reduce((v,q)=>v+q.marks,0),80);
  const noAnswerSelectors=["[data-correct]",".correct",".answer-key",".model-answer",".marking-steps",".teacher-answer"];
  for(const sel of noAnswerSelectors)assert.equal(await page.locator("#paper "+sel).count(),0,"Student paper must not leak a marked answer: "+sel);
  assert.ok(!(await page.locator("#paper").innerText()).includes("Correct answer:"));
  assert.ok(!(await page.locator("#paper").innerText()).includes("Suggested marking steps"));
  assert.equal(await page.locator("#paper .empty-bubble").count(),320);
  await page.screenshot({path:path.join(artifact,"01-student-paper-desktop.png"),fullPage:false});
  // Verify old resource links and new navigation all operate on a local static preview.
  const integrated=await page.request.get(base+"unit-04-assessment-pack.html");
  assert.equal(integrated.status(),200);assert.ok((await integrated.text()).includes('href="./unit-04-combined-student-paper.html"'));
  const desk=await page.request.get(base+"unit-04.html");
  assert.equal(desk.status(),200);assert.ok((await desk.text()).includes('href="./unit-04-combined-student-paper.html"'));
  // Responsive checks: the table itself may scroll, but neither page nor global navigation may overrun the screen.
  await page.setViewportSize({width:390,height:844});
  const width=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(width.scroll<=width.viewport+2,"Mobile page-level horizontal overflow: "+JSON.stringify(width));
  assert.ok(await page.locator(".scroll-table").first().evaluate(el=>el.scrollWidth>el.clientWidth),"Boxed MCQs must scroll INSIDE their table wrapper on mobile");
  assert.ok(await page.locator("#psn-global-nav .psn-nav-inner").evaluate(el=>el.getBoundingClientRect().width<=390));
  await page.screenshot({path:path.join(artifact,"02-student-paper-mobile.png"),fullPage:false});
  // Real Chromium print media: no web toolbar/teacher answers; blank bubbles still visible.
  await page.setViewportSize({width:794,height:1122});
  await page.emulateMedia({media:"print"});
  assert.equal(await page.locator(".toolbar").evaluate(el=>getComputedStyle(el).display),"none");
  assert.equal(await page.locator("header").evaluate(el=>getComputedStyle(el).display),"none");
  assert.equal(await page.locator("#paper").evaluate(el=>getComputedStyle(el).display),"block");
  assert.equal(await page.locator("#mcqQuestions .empty-bubble").count(),320);
  const table=await page.locator(".mcq-table").first().evaluate(el=>({minWidth:getComputedStyle(el).minWidth,width:el.getBoundingClientRect().width,wrap:el.parentElement.getBoundingClientRect().width}));
  assert.ok(table.width<=table.wrap+2,"A4 print table should not be clipped: "+JSON.stringify(table));
  const pageStyle=await page.locator(".empty-bubble").first().evaluate(el=>({width:getComputedStyle(el).width,height:getComputedStyle(el).height,border:getComputedStyle(el).borderTopStyle}));
  assert.ok(parseFloat(pageStyle.width)>=8&&pageStyle.border==="solid");
  await page.screenshot({path:path.join(artifact,"03-student-paper-print-media.png"),fullPage:false});
  await page.emulateMedia({media:"screen"});
  await page.evaluate(()=>{window.__qaPrintCount=0;window.print=()=>window.__qaPrintCount++;});
  await page.locator("#printPaper").click();
  assert.equal(await page.evaluate(()=>window.__qaPrintCount),1);
  assert.deepEqual(errors,[],"Browser runtime errors: "+errors.join("; "));
  console.log("PASS V44: 80 keyed-source stems and 320 original options rendered in 10 boxed tables, 56 independent + six complete four-question scenarios.");
  console.log("PASS V44: 7 short and 2 extended questions, 18 exact original OR choices, 12 summative Unit 4 SLOs, 80 marks.");
  console.log("PASS V44: 320 unmarked student bubbles and ZERO answer keys; 390px mobile page fits, A4 print CSS and print button operate in Chromium.");
  console.log("Screenshots: qa-artifacts/unit04-v44; source text and student grade privacy unchanged.");
 }finally{await browser.close();}
}
check().catch(err=>{console.error("FAIL V44:",err.stack||err);process.exitCode=1;}).finally(()=>server.close());
