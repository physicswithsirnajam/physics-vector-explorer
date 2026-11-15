#!/usr/bin/env node
"use strict";
/*
 * V48 source and real-browser numerical QA for Grade XI Unit 5 Work and Energy.
 * Checks correct signed force–displacement area, kinetic energy scaling,
 * conservative/non-conservative path work and impossible-target conditions.
 * No new question bank or official assessment status is authorised.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),http=require("node:http");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,".."),out=path.join(root,"qa-artifacts","unit05-v48");
fs.mkdirSync(out,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const audit=JSON.parse(read("portal/unit-05-slo-audit.json"));
const files=["portal/unit-05.html","portal/unit-05-work-study.html","portal/unit-05-work-energy-lab.html","portal/unit-05-work-energy-lab.js"];
const texts=Object.fromEntries(files.map(p=>[p,read(p)]));
const extensions={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".jpg":"image/jpeg",".png":"image/png",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let file=path.resolve(root,"."+pathname);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,"index.html");
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end("Not found");return;}
  res.writeHead(200,{"Content-Type":extensions[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
const eq=(got,expected,epsilon=1e-8,msg="")=>assert.ok(Math.abs(got-expected)<=epsilon,
 msg+" expected "+expected+" received "+got);
function sourceChecks(){
 assert.equal(audit.unit,5);assert.equal(audit.unitTitle,"Work and Energy");
 assert.equal(audit.status,"source-grounded-teaching-pilot");
 assert.equal(audit.summativeTheorySLOs.length,4);
 assert.deepEqual(audit.summativeTheorySLOs.map(x=>x.code),["P-11-B-29","P-11-B-30","P-11-B-31","P-11-B-32"]);
 assert.deepEqual(audit.summativeTheorySLOs.map(x=>x.provisionalCognitiveLevel),["Application","Application","Understanding","Application"]);
 assert.deepEqual(audit.sourcePageMap.map(x=>x.section),["5.1","5.2","5.3","5.4"]);
 assert.equal(audit.sourceDocuments[0].role,"primary textbook");
 assert.deepEqual(audit.sourceDocuments[0].verifiedVisualPages,[77,78,79,80,81,82,83,84,85]);
 assert.equal(audit.studentQuestionBankPublished,false);
 assert.equal(audit.questionBankCount,0);
 assert.equal(audit.descriptivePaperPublished,false);
 assert.equal(audit.omrPublished,false);
 assert.equal(audit.protectedOrGradedAssessmentPublished,false);
 assert.equal(audit.studentGradesRecorded,false);
 const grade=catalog.grades.find(g=>g.grade===11);
 const u5=grade.units.find(u=>u.unit===5);
 assert.equal(u5.status,"available");
 assert.equal(u5.title,"Work and Energy");
 assert.equal(u5.assessmentStatus,"not-published");
 assert.equal(u5.questionBankCount,0);
 assert.deepEqual(u5.resourceIds,["unit5-desk","unit5-work-study","unit5-work-energy-lab"]);
 const expected=["./unit-05.html","./unit-05-work-study.html","./unit-05-work-energy-lab.html"];
 for(const [i,id] of u5.resourceIds.entries()){
  const matches=catalog.resources.filter(r=>r.id===id);
  assert.equal(matches.length,1);
  assert.equal(matches[0].public,true);
  assert.equal(matches[0].href,expected[i]);
  assert.equal(matches[0].access,"public-link");
  assert.ok(fs.existsSync(path.join(root,"portal",matches[0].href.replace("./",""))));
 }
 const u4=grade.units.find(u=>u.unit===4);
 assert.equal(u4.resourceIds.length,18);
 assert.equal(u4.questionBankCount,80);
 const u3=grade.units.find(u=>u.unit===3);
 assert.equal(u3.resourceIds.length,10);
 for(const [p,s] of Object.entries(texts)){
  assert.ok(s.includes("assets/physics-with-sir-najam-official-logo.png")||
    p.endsWith(".js"),"Do not replace official logo "+p);
  for(const risky of ["localStorage","sessionStorage","indexedDB","Firestore","sendBeacon","setDoc"]){
   assert.ok(!s.includes(risky),"Unwanted state/grade storage term "+p+": "+risky);
  }
 }
 const lab=texts["portal/unit-05-work-energy-lab.js"];
 assert.ok(!lab.includes("innerHTML"),"No unsanitised injection of student input/HTML");
 assert.ok(lab.includes("Math.cos(theta*Math.PI/180)"));
 assert.ok(lab.includes("if(f0*f1<0)"));
 assert.ok(lab.includes("targetK< -1e-9"));
 assert.ok(lab.includes("K0===0&&fa<=fr"));
 assert.ok(lab.includes("performance.now")===false,"No unattended timer needed in this exploratory tool");
 for(const code of ["P-11-B-29","P-11-B-30","P-11-B-31","P-11-B-32"])
  assert.ok(texts["portal/unit-05.html"].includes(code));
 assert.ok(texts["portal/unit-05-work-study.html"].includes("W = ½(F"));
 assert.ok(texts["portal/unit-05-work-study.html"].includes("A calculation that predicts negative final kinetic energy"));
 const nav=texts["portal/unit-05.html"];
 assert.ok(nav.includes("./unit-05-work-energy-lab.html"));
 assert.ok(nav.includes("./unit-05-work-study.html"));
 assert.ok(nav.includes("official FBISE assessment framework"));
}
async function browsers(){
 await new Promise((resolve,reject)=>server.once("error",reject).listen(0,"127.0.0.1",resolve));
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1365,height:900}});
  const errors=[],nonGets=[],notFound=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("request",r=>{if(r.method()!=="GET")nonGets.push(r.method()+" "+r.url());});
  page.on("response",r=>{if(r.status()>=400)notFound.push(r.status()+" "+r.url());});
  const base="http://127.0.0.1:"+server.address().port+"/portal/";
  for(const p of ["unit-05.html","unit-05-work-study.html"]){
   const res=await page.goto(base+p,{waitUntil:"networkidle"});
   assert.equal(res.status(),200);
   assert.ok((await page.locator("h1").textContent()).includes("Work"));
   assert.equal(await page.locator("header img").count(),1);
   assert.ok(await page.locator("header img").first().evaluate(el=>el.complete&&el.naturalWidth>0));
  }
  await page.goto(base+"unit-05-work-energy-lab.html",{waitUntil:"networkidle"});
  assert.equal(await page.locator('[role="tab"]').count(),4);
  assert.equal(await page.locator('[role="tab"][aria-selected="true"]').count(),1);
  assert.equal(await page.locator("#workPanel").isVisible(),true);
  assert.equal(await page.locator("#kineticPanel").isVisible(),false);
  async function numeric(id){return Number(await page.locator("#"+id).getAttribute("data-value"));}
  async function set(id,value){
   await page.locator("#"+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event("input",{bubbles:true}));},value);
  }
  // Basic signed-trapezoid work, and textbook 16.8 N suitcase W.
  eq(await numeric("graphWork"),60);
  eq(await numeric("graphAvg"),10);
  eq(await numeric("angleWork"),16.8*4.9*Math.cos(Math.PI/6),1e-8);
  assert.equal(await page.locator("#forceArea polygon").count(),1);
  await page.screenshot({path:path.join(out,"01-signed-work-graph.png"),fullPage:false});
  await set("fStart",-30);await set("fEnd",-30);
  eq(await numeric("graphWork"),-180);
  assert.ok((await page.locator("#graphExplain").textContent()).includes("negative net work"));
  await set("fStart",30);await set("fEnd",-30);
  eq(await numeric("graphWork"),0);
  assert.equal(await page.locator("#forceArea polygon").count(),2,
   "Signed graph crossing zero must split positive and negative regions");
  await set("fStart",60);await set("fEnd",20);await set("graphDistance",10);
  eq(await numeric("graphWork"),400);
  await set("theta",90);
  eq(await numeric("angleWork"),0,1e-9);
  await set("theta",180);
  eq(await numeric("angleWork"),-16.8*4.9);
  await page.locator("#kineticTab").click();
  assert.equal(await page.locator("#kineticPanel").isVisible(),true);
  assert.equal(await page.locator("#workPanel").isVisible(),false);
  eq(await numeric("keStart"),10);eq(await numeric("keEnd"),90);eq(await numeric("keDelta"),80);
  eq(await numeric("keRatio"),3);
  await set("keMass",10);eq(await numeric("keDelta"),160);
  await set("keInitial",0);
  assert.ok((await page.locator("#keRatio").textContent()).includes("undefined"));
  eq(await numeric("keStart"),0);eq(await numeric("keEnd"),180);
  await set("keInitial",6);
  eq(await numeric("keDelta"),0);
  await set("keFinal",3);eq(await numeric("keDelta"),-135);
  await page.screenshot({path:path.join(out,"02-kinetic-energy-derivation.png"),fullPage:false});
  await page.locator("#fieldsTab").click();
  eq(await numeric("gravityWork"),5*9.8*6);
  eq(await numeric("resistShort"),-50);
  eq(await numeric("resistLong"),-90);
  eq(await numeric("resistExtra"),40);
  await set("fieldResistance",0);
  eq(await numeric("resistShort"),0);
  eq(await numeric("resistLong"),0);
  await set("fieldMass",10);
  eq(await numeric("gravityWork"),588);
  await page.screenshot({path:path.join(out,"03-conservative-path-comparison.png"),fullPage:false});
  await page.locator("#resistiveTab").click();
  eq(await numeric("resInitialKE"),10);
  eq(await numeric("resAppliedWork"),120);
  eq(await numeric("resResistanceWork"),-48);
  eq(await numeric("resNetWork"),72);
  eq(await numeric("resFinalKE"),82);
  eq(await numeric("resFinalSpeed"),Math.sqrt(164/5));
  assert.equal(await page.locator("#resReachWarning").isVisible(),false);
  await page.screenshot({path:path.join(out,"04-resistive-work-reachable.png"),fullPage:false});
  // Physical impossibility: cannot reach proposed 4m; stop after 0.2m.
  await set("resApplied",0);
  await set("resOppose",50);
  assert.equal(await page.locator("#resReachWarning").isVisible(),true);
  assert.ok((await page.locator("#resReachWarning").textContent()).includes("0.2 m"));
  assert.equal(await page.locator("#resFinalKE").textContent(),"Not reachable");
  assert.equal(await page.locator("#resFinalSpeed").textContent(),"Not defined at target");
  // Even if naive ΔK=0 at requested displacement, object initially at rest cannot move
  // under zero/nonpositive net forward force.
  await set("resInitial",0);
  await set("resOppose",0);
  assert.equal(await page.locator("#resReachWarning").isVisible(),true);
  assert.ok((await page.locator("#resReachWarning").textContent()).includes("cannot begin travelling"));
  await set("resApplied",30);
  assert.equal(await page.locator("#resReachWarning").isVisible(),false);
  eq(await numeric("resFinalKE"),120);
  await page.screenshot({path:path.join(out,"05-resistive-stopping-guard.png"),fullPage:false});
  // Mobile panel overflow and underlying resource links.
  await page.setViewportSize({width:390,height:844});
  const w=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(w.scroll<=w.viewport+2,"Mobile page-level horizontal overflow "+JSON.stringify(w));
  await page.screenshot({path:path.join(out,"06-unit5-mobile.png"),fullPage:false});
  assert.deepEqual(errors,[],"Uncaught browser errors");
  assert.deepEqual(nonGets,[],"No data uploads/grade writes");
  assert.deepEqual(notFound,[],"All required resources load");
  const session=await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}));
  assert.deepEqual(session,{local:0,session:0});
  console.log("PASS V48: catalog includes exactly three public Unit 5 teaching resources and zero Unit 5 graded/question-bank releases.");
  console.log("PASS V48: work-angle sign, graph linear signed area including axis crossing, KE derivation/scaling, gravity vs resistance route, resistive stopping distance and impossible rest-force cases.");
  console.log("PASS V48: real Chromium/mobile 390px, source/provenance visible, no 404/JS error, no grades/response writes; previous Unit 4 resources intact.");
 }finally{await browser.close();}
}
sourceChecks();
browsers().catch(e=>{console.error("FAIL V48:",e.stack||e);process.exitCode=1;}).finally(()=>server.close());
