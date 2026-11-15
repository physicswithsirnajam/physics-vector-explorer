#!/usr/bin/env node
"use strict";
/*
 * Real Chromium QA of the existing PUBLIC Unit 4 student and teacher practice pages.
 * Uses only HTTP serving of this checkout. Never signs in, saves grades or uploads student data.
 * Run with: npm install --no-save --no-package-lock playwright@1.56.1
 *           npx playwright install --with-deps chromium
 *           node scripts/test_unit04_classroom_browser_v43.cjs
 */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const http=require("node:http");
const path=require("node:path");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,".."),artifacts=path.join(root,"qa-artifacts","unit04-v43");
fs.mkdirSync(artifacts,{recursive:true});
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const rel=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let file=path.resolve(root,"."+rel);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,"index.html");
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end("Not found");return;}
  res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
  fs.createReadStream(file).pipe(res);
 }catch(err){res.writeHead(500);res.end(String(err));}
});
const getDisplay=(page,id)=>page.locator("#"+id).evaluate(el=>getComputedStyle(el).display);
async function media(page,mode){await page.emulateMedia({media:mode});}
async function printMock(page){
 await page.evaluate(()=>{
  window.__qaPrintCount=0;
  window.print=()=>{window.__qaPrintCount++};
 });
}
async function afterPrint(page){await page.evaluate(()=>window.dispatchEvent(new Event("afterprint")));}
async function ready(page,id,needle){await page.waitForFunction(({id,needle})=>document.getElementById(id)?.textContent?.includes(needle),{id,needle},{timeout:30000});}
async function screenshot(page,name){await page.screenshot({path:path.join(artifacts,name),fullPage:false});}
async function main(){
 await new Promise((resolve,reject)=>server.once("error",reject).listen(0,"127.0.0.1",resolve));
 const base="http://127.0.0.1:"+server.address().port+"/portal/";
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1365,height:900},deviceScaleFactor:1});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  // 1. Integrated pack: true network JSON fetch, runtime DOM + all 80 keyed rows.
  await page.goto(base+"unit-04-assessment-pack.html",{waitUntil:"networkidle"});
  await ready(page,"loadStatus","Ready · 80 keyed MCQs");
  assert.equal(await page.locator("#blankStraight .omr-row").count(),56);
  assert.equal(await page.locator("#blankScenarios .scenario-box").count(),6);
  assert.equal(await page.locator("#blankScenarios .omr-row").count(),24);
  assert.equal(await page.locator("#keyStraight .omr-row").count(),56);
  assert.equal(await page.locator("#keyScenarios .omr-row").count(),24);
  assert.equal(await page.locator("#blankStraight .bubble.correct, #blankScenarios .bubble.correct").count(),0);
  assert.equal(await page.locator("#keyStraight .bubble.correct, #keyScenarios .bubble.correct").count(),80);
  const numbers=await page.locator("#blankStraight .qnum,#blankScenarios .qnum").allTextContents();
  assert.deepEqual(numbers,Array.from({length:80},(_,i)=>String(i+1)));
  const labels=await page.locator("#blankScenarios .scenario-box h4").allTextContents();
  for(let i=0;i<6;i++)assert.ok(labels[i].includes("Q"+(57+i*4)+"–"+(60+i*4)));
  assert.equal(await page.locator("#explanationRows tr").count(),80);
  assert.equal(await page.locator("#descriptiveKey .mark-item").count(),9);
  assert.equal(await page.locator("#descriptiveKey .mark-item ol").count(),18);
  assert.equal(await page.locator("#tosRows tr").count(),12);
  const totals=await page.locator("#tosTotal tr th").allTextContents();
  assert.deepEqual(totals.map(x=>x.trim()),["TOTAL","80","40","40","40","80","80"]);
  const scenarioText=await page.locator("#explanationRows tr:nth-child(57) td:last-child").textContent();
  assert.ok(scenarioText.includes("Shared scenario")&&scenarioText.includes("Q: ")&&scenarioText.includes("Correct: "));
  assert.equal(await page.locator("#explanationRows tr td:last-child").count(),80);
  assert.equal(await page.locator("#teacherSection").isVisible(),false);
  await page.locator("#showTeacher").click();
  assert.equal(await page.locator("#teacherSection").isVisible(),true);
  await page.locator("#showTeacher").click();
  assert.equal(await page.locator("#teacherSection").isVisible(),false);
  await screenshot(page,"01-integrated-desktop.png");
  // 2. Actual print CSS: only intended section is visible for each mode, regardless of screen key toggle.
  await printMock(page);
  await page.locator("#printOMR").click();await media(page,"print");
  assert.equal(await getDisplay(page,"omrSection"),"block");
  assert.equal(await getDisplay(page,"teacherSection"),"none");
  assert.equal(await getDisplay(page,"tosSection"),"none");
  assert.equal(await page.locator(".bubble.correct").count(),80,"Print-OMR mode must not change answer data or display teacher key");
  await screenshot(page,"02-blank-omr-print-layout.png");
  await afterPrint(page);await media(page,"screen");
  await page.locator("#printKey").click();await media(page,"print");
  assert.equal(await getDisplay(page,"omrSection"),"none");
  assert.equal(await getDisplay(page,"teacherSection"),"block");
  assert.equal(await getDisplay(page,"tosSection"),"none");
  const shade=await page.locator("#keyStraight .bubble.correct").first().evaluate(el=>getComputedStyle(el).backgroundColor);
  assert.notEqual(shade,"rgba(0, 0, 0, 0)");
  await screenshot(page,"03-teacher-key-print-layout.png");
  await afterPrint(page);await media(page,"screen");
  await page.locator("#printTos").click();await media(page,"print");
  assert.equal(await getDisplay(page,"omrSection"),"none");
  assert.equal(await getDisplay(page,"teacherSection"),"none");
  assert.equal(await getDisplay(page,"tosSection"),"block");
  await screenshot(page,"04-slo-marks-print-layout.png");
  await afterPrint(page);await media(page,"screen");
  assert.equal(await page.evaluate(()=>window.__qaPrintCount),3);
  assert.equal(await page.locator("body.print-omr, body.print-key, body.print-tos").count(),0);
  // 3. Mobile viewport: no page-level horizontal overflow (tables may scroll within their own wrappers).
  await page.setViewportSize({width:390,height:844});
  const overflow=await page.evaluate(()=>({screen:document.documentElement.clientWidth,content:document.documentElement.scrollWidth}));
  if(overflow.content>overflow.screen+2){
    const suspects=await page.evaluate(()=>[...document.querySelectorAll("body *")].filter(el=>{
      const style=getComputedStyle(el),r=el.getBoundingClientRect();
      return style.display!=="none"&&r.width>0&&r.right>innerWidth+4&&r.left>=0&&el.getClientRects().length;
    }).sort((a,b)=>b.getBoundingClientRect().right-a.getBoundingClientRect().right).slice(0,12).map(el=>{
      const r=el.getBoundingClientRect(),style=getComputedStyle(el);
      return {tag:el.tagName,id:el.id,className:typeof el.className==="string"?el.className:"",left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),overflowX:style.overflowX,text:el.textContent.slice(0,65)};
    }));
    console.error("Mobile overflow suspects:",JSON.stringify(suspects));
    await screenshot(page,"05-mobile-overflow-debug.png");
  }
  assert.ok(overflow.content<=overflow.screen+2,"Integrated pack horizontal overflow: "+JSON.stringify(overflow));
  assert.equal(await page.locator("#blankStraight .omr-row").count(),56);
  await screenshot(page,"05-integrated-mobile.png");
  // 4. Descriptive: nine A/OR/B pairs, key isolation in student print, teacher print restored.
  await page.setViewportSize({width:1100,height:850});
  await page.goto(base+"unit-04-descriptive-practice.html",{waitUntil:"networkidle"});
  await ready(page,"loadStatus","9 OR pairs ready");
  assert.equal(await page.locator("#shortQuestions .qa").count(),7);
  assert.equal(await page.locator("#longQuestions .qa").count(),2);
  assert.equal(await page.locator("#sectionB details,#sectionC details").count(),18);
  await page.locator("#showAll").click();
  assert.equal(await page.locator("#sectionB details[open],#sectionC details[open]").count(),18);
  await page.locator("#hideAll").click();
  assert.equal(await page.locator("#sectionB details[open],#sectionC details[open]").count(),0);
  await printMock(page);
  await page.locator("#printStudent").click();await media(page,"print");
  const studentDetails=await page.locator("#sectionB details").first().evaluate(e=>getComputedStyle(e).display);
  assert.equal(studentDetails,"none","Student paper must hide worked solutions");
  assert.equal(await page.locator("body.print-teacher").count(),0);
  await screenshot(page,"06-descriptive-student-print-layout.png");
  await afterPrint(page);await media(page,"screen");
  await page.locator("#printTeacher").click();await media(page,"print");
  assert.equal(await page.locator("#sectionB details[open],#sectionC details[open]").count(),18);
  const teacherDetails=await page.locator("#sectionB details").first().evaluate(e=>getComputedStyle(e).display);
  assert.equal(teacherDetails,"block","Teacher print should reveal solution steps");
  await screenshot(page,"07-descriptive-teacher-print-layout.png");
  await afterPrint(page);await media(page,"screen");
  assert.equal(await page.locator("#sectionB details[open],#sectionC details[open]").count(),0);
  // 5. Boxed FBISE MCQs and self-check/reset; no save operation.
  await page.goto(base+"unit-04-mcq-full80.html",{waitUntil:"networkidle"});
  await ready(page,"bankStatus","80 questions");
  assert.equal(await page.locator("#questionArea .mcq tbody tr").count(),80);
  assert.equal(await page.locator("#questionArea .stimulus").count(),6);
  assert.equal(await page.locator("#questionArea .mcq tbody tr input[type=radio]").count(),320);
  const first=page.locator("#questionArea .mcq tbody tr").first();
  await first.locator('input[value="A"]').check();
  await page.locator("#check").click();
  assert.ok((await page.locator("#result").textContent()).includes("No grade has been recorded"));
  assert.equal(await page.locator("#solutionList .review").count(),80);
  await page.locator("#reset").click();
  assert.equal(await page.locator('#questionArea input[type=radio]:checked').count(),0);
  await screenshot(page,"08-fbise-mcq-boxes.png");
  assert.deepEqual(errors,[],"Unexpected browser runtime exceptions: "+errors.join("; "));
  console.log("PASS V43 browser: integrated source fetch, 80 blank and 80 shaded OMR items, six scenarios, all 80 key rows, nine OR pairs, 12-SLO totals.");
  console.log("PASS V43 browser: actual Chromium print-media isolation for blank OMR, teacher key and SLO table, plus descriptive student/teacher key isolation.");
  console.log("PASS V43 browser: 390px mobile overflow check, interactive boxed 80-MCQ self-check/reset, no JS errors.");
  console.log("V43 screen/print reference screenshots in qa-artifacts/unit04-v43; human review still required before classroom certification.");
 }finally{await browser.close();}
}
main().catch(err=>{console.error("FAIL V43 browser QA:",err.stack||err);process.exitCode=1;}).finally(()=>server.close());
