#!/usr/bin/env node
"use strict";
/*
 * V49: audit provenance contract and real browser UI regression.
 * The ORIGINAL official document was checked by its table on PDF page 11
 * before authoring this audit; CI checks exact recorded classification
 * and consistency, not the bytes of the external user-library PDF.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),http=require("node:http");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,".."),out=path.join(root,"qa-artifacts","unit05-v49");
fs.mkdirSync(out,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const audit=JSON.parse(read("portal/unit-05-slo-audit.json"));
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const html=read("portal/unit-05-fbise-audit.html");
const bankDir=path.join(root,"question-bank","grade-11");
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".css":"text/css; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,"http://localhost");
  const p=decodeURIComponent(url.pathname);
  let file=path.resolve(root,"."+p);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,"index.html");
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end("Not found");return;}
  res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
const expected=[
 {code:"P-11-B-29",level:"Application",pages:[81,82]},
 {code:"P-11-B-30",level:"Application",pages:[79,80]},
 {code:"P-11-B-31",level:"Understanding",pages:[81]},
 {code:"P-11-B-32",level:"Application",pages:[82,83]}
];
function sourceContract(){
 assert.equal(audit.grade,11);assert.equal(audit.unit,5);assert.equal(audit.unitTitle,"Work and Energy");
 assert.equal(audit.status,"official-summative-SLO-verified-16-mcq-provisional-practice");
 assert.equal(audit.officialFrameworkVerified,true);
 assert.equal(audit.officialFBISEFrameworkIndependentVerification,"verified-against-user-uploaded-official-FBISE-HSSC-I-framework-PDF-page-11");
 assert.equal(audit.officialFrameworkSourceFile,"11_Physics_HSSC_I_model_paper_50_percent(9).pdf");
 assert.equal(audit.officialFrameworkEdition,"National Curriculum 2022–23 / Inclusive Scheme of Studies 2024");
 assert.equal(audit.officialFrameworkSLOTablePdfPage,11);
 assert.equal(audit.officialFrameworkSLOTablePrintedPage,5);
 assert.equal(audit.officialFrameworkPbaCautionPage,27);
 assert.equal(audit.officialModelPaperFormatPage,28);
 assert.equal(audit.officialModelPaperBoxedMcqPage,30);
 assert.equal(audit.latestOnlineFrameworkRevisionChecked,false);
 assert.deepEqual(audit.sourceDocuments[0].verifiedVisualPages,[77,78,79,80,81,82,83,84,85,86,87]);
 assert.equal(audit.sourceDocuments[2].role,"user-uploaded official FBISE HSSC-I Physics Assessment Framework and Model Question Paper");
 assert.equal(audit.summativeTheorySLOs.length,4);
 for(const [i,slo] of audit.summativeTheorySLOs.entries()){
  assert.equal(slo.code,expected[i].code);
  assert.equal(slo.cognitiveLevel,expected[i].level);
  assert.deepEqual(slo.printedPages,expected[i].pages);
  assert.equal(slo.formOfAssessment,"Summative");
  assert.equal(slo.theoryExamEligible,true);
  assert.equal(slo.officialFrameworkPdfPage,11);
  assert.equal(slo.assessmentStatus,"official-FBISE-framework-verified-summative-theory-slo");
  assert.ok(!("provisionalCognitiveLevel" in slo));
  assert.match(slo.classificationEvidence,/framework PDF page 11/i);
 }
 assert.equal(audit.unit5FormativeTheorySLOs.length,0);
 assert.equal(audit.formativeTheorySLOsVerifiedSeparately,true);
 assert.equal(audit.practicalPbaDetermination,"not-established-by-this-source");
 assert.match(audit.pbaSourceCaution,/separate (?:practical )?list/i);
 const full=audit.fullPaperStructure;
 assert.equal(full.applicability,"full-grade-XI-HSSC-I-theory-model-paper-only-not-a-single-unit-5-quota");
 assert.equal(full.totalMarks,80);
 assert.deepEqual(full.sectionA,{mcqs:80,marksEach:.5,totalMarks:40,straight:56,contextual:24,scenarioSets:6});
 assert.deepEqual(full.sectionB,{shortQuestions:7,marksEach:4,totalMarks:28,internalChoice:true});
 assert.deepEqual(full.sectionC,{extendedQuestions:2,marksEach:6,totalMarks:12,internalChoice:true});
 assert.equal(audit.studentQuestionBankPublished,true);
 assert.equal(audit.questionBankCount,16);
 assert.equal(audit.descriptivePaperPublished,false);
 assert.equal(audit.omrPublished,false);
 assert.equal(audit.protectedOrGradedAssessmentPublished,false);
 assert.equal(audit.studentGradesRecorded,false);
 assert.ok(audit.assessmentPublicationGate.length>=5);
 assert.deepEqual(audit.chapterExerciseEvidence.textbookPrintedPages,[85,86,87]);
 // The Unit 5 directory may contain only the explicit provisional V50 student and public teaching-key JSONs.
 assert.deepEqual(fs.readdirSync(bankDir).filter(x=>x.startsWith("unit-05")).sort(),["unit-05-v50-16-student.json","unit-05-v50-16-teacher-key.json"]);
 const u5=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===5);
 assert.equal(u5.status,"available");
 assert.equal(u5.assessmentStatus,"provisional-ungraded-16-mcq-mini-practice-teacher-review-pending");
 assert.equal(u5.questionBankCount,16);
 assert.deepEqual(u5.resourceIds,["unit5-desk","unit5-work-study","unit5-work-energy-lab","unit5-fbise-audit","unit5-mcq-practice","unit5-mcq-worked-key"]);
 for(const id of u5.resourceIds){
  const resources=catalog.resources.filter(r=>r.id===id);
  assert.equal(resources.length,1);
  assert.equal(resources[0].public,true);
  assert.equal(resources[0].external,false);
  assert.equal(resources[0].access,"public-link");
  assert.ok(resources[0].href.startsWith("./unit-05"));
  assert.ok(fs.existsSync(path.join(root,"portal",resources[0].href.slice(2))));
 }
 const u4=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===4);
 assert.equal(u4.resourceIds.length,18);assert.equal(u4.questionBankCount,80);
 const u3=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===3);
 assert.equal(u3.resourceIds.length,10);
 for(const page of ["portal/unit-05.html","portal/unit-05-work-study.html","portal/unit-05-work-energy-lab.html"]){
  const text=read(page);
  assert.ok(text.includes("./unit-05-fbise-audit.html"),"Audit link not visible on "+page);
  assert.ok(text.includes("official FBISE"),"Source authority must be explained "+page);
 }
 for(const forbidden of [/no practicals for unit 5/i,/unit 5 has no PBA/i,/PBA not required/i,/80 unit 5 mcqs/i]){
  assert.ok(!forbidden.test(html),"Misleading unsupported assessment claim: "+forbidden);
 }
 for(const word of ["Section A","Section B","Section C","PBA","not","Summative",
  "11_Physics_HSSC_I_model_paper_50_percent(9).pdf","77–87","B-29","B-30","B-31","B-32"]){
  assert.ok(html.includes(word),"Missing vital student-facing audit label: "+word);
 }
 const domIds=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(domIds.length,new Set(domIds).size);
}
async function browser(){
 await new Promise((resolve,reject)=>server.once("error",reject).listen(0,"127.0.0.1",resolve));
 const engine=await chromium.launch({headless:true});
 try{
  const page=await engine.newPage({viewport:{width:1365,height:900}});
  const errors=[],writes=[],notFound=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("request",r=>{if(r.method()!=="GET")writes.push(r.method()+" "+r.url());});
  page.on("response",r=>{if(r.status()>=400)notFound.push(r.status()+" "+r.url());});
  const base="http://127.0.0.1:"+server.address().port+"/portal/";
  const response=await page.goto(base+"unit-05-fbise-audit.html",{waitUntil:"networkidle"});
  assert.equal(response.status(),200);
  assert.ok((await page.locator("h1").textContent()).includes("FBISE"));
  assert.equal(await page.locator("#slo-table tbody tr").count(),4);
  for(const [i,expect] of expected.entries()){
   const tr=page.locator("#slo-table tbody tr").nth(i);
   assert.equal(await tr.getAttribute("data-slo"),expect.code);
   assert.equal(await tr.getAttribute("data-cognitive"),expect.level);
   const content=await tr.textContent();
   assert.ok(content.includes(expect.code));
   assert.ok(content.includes("Summative"));
   assert.ok(content.includes(expect.level));
  }
  assert.ok((await page.locator("#pba").textContent()).includes("separate list"));
  assert.ok((await page.locator("#exam-model").textContent()).includes("whole syllabus"));
  assert.ok((await page.locator("#publication-gates").textContent()).includes("16 original"));
  await page.screenshot({path:path.join(out,"01-official-audit-desktop.png"),fullPage:false});
  await page.setViewportSize({width:390,height:844});
  const geom=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  if(geom.scroll>geom.client+2){
   const suspects=await page.evaluate(()=>[...document.querySelectorAll("body *")].filter(el=>{
    const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
    return cs.display!=="none"&&r.width>0&&r.right>innerWidth+2&&r.left>=0&&el.getClientRects().length;
   }).sort((a,b)=>b.getBoundingClientRect().right-a.getBoundingClientRect().right).slice(0,12).map(el=>{
    const r=el.getBoundingClientRect();
    return {tag:el.tagName,id:el.id,cls:typeof el.className==="string"?el.className:"",
      left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),text:el.textContent.trim().slice(0,65)};
   }));
   console.error("V49 mobile offending DOM elements:",JSON.stringify(suspects));
  }
  assert.ok(geom.scroll<=geom.client+2,"Mobile viewport overflow "+JSON.stringify(geom));
  await page.screenshot({path:path.join(out,"02-official-audit-mobile.png"),fullPage:false});
  // The wide detailed table must scroll LOCALLY, not push the entire phone page.
  const table=page.locator("#slo-table .tbl");
  assert.equal(await table.evaluate(el=>getComputedStyle(el).overflowX),"auto");
  for(const file of ["unit-05.html","unit-05-work-study.html","unit-05-work-energy-lab.html"]){
   await page.goto(base+file,{waitUntil:"networkidle"});
   assert.ok(await page.locator('a[href="./unit-05-fbise-audit.html"]').count()>0);
  }
  assert.deepEqual(notFound,[]);
  assert.deepEqual(errors,[]);
  assert.deepEqual(writes,[]);
  const state=await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}));
  assert.deepEqual(state,{local:0,session:0});
  console.log("PASS V49: exact supplied FBISE official framework PDF p.11 Unit 5 SLO B-29/30/31/32 classification A/A/U/A preserved.");
  console.log("PASS V49: full-grade 80-mark structure, PBA caution, exactly 16 provisional Unit 5 MCQs, 6 public resources and no formal exam.");
  console.log("PASS V49: browser-rendered teacher-facing table, mobile 390px, no errors or grade writes; official file is provenance, not re-read by CI.");
 }finally{await engine.close();}
}
sourceContract();
browser().catch(e=>{console.error("FAIL V49:",e.stack||e);process.exitCode=1;}).finally(()=>server.close());
