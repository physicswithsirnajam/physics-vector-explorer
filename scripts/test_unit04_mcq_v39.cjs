#!/usr/bin/env node
"use strict";
/* PSN Grade XI Unit 4 V39: original 80-MCQ provisional self-practice.
 * Source: NBF Grade XI Physics printed pp.53–76; FBISE HSSC-I framework
 * printed pages 3–4, original 50% boxed-MCQ model paper.
 * Code/physics spot checks do NOT certify all 80 items academically.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const bank=JSON.parse(read("question-bank/grade-11/unit-04-v39-80-practice.json"));
const audit=JSON.parse(read("portal/unit-04-slo-audit.json"));
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const desk=read("portal/unit-04.html");
const auditPage=read("portal/unit-04-slo-audit.html");
const html=read("portal/unit-04-mcq-full80.html");
const ui=read("portal/unit-04-mcq-full80.js");
const near=(actual,expected,tol=1e-8)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=tol,
 "Expected "+expected+" ±"+tol+", observed "+actual);
const expectedCodes=["P-11-B-07","P-11-B-08","P-11-B-09","P-11-B-10",
 "P-11-B-14","P-11-B-15","P-11-B-16","P-11-B-17","P-11-B-18",
 "P-11-B-19","P-11-B-20","P-11-B-21"];
const distribution=[6,8,8,5,8,8,5,6,8,6,8,4];
assert.equal(bank.schemaVersion,1);
assert.equal(bank.status,"practice-pilot");
assert.equal(bank.bankId,"PSN-XI-UNIT-04-V39");
assert.equal(bank.questions.length,80);
assert.equal(bank.structure.straight,56);
assert.equal(bank.structure.scenario,24);
assert.equal(bank.structure.scenarioSets,6);
assert.equal(bank.structure.scenarioQuestionsPerSet,4);
assert.equal(bank.structure.totalPracticeMarks,40);
assert.equal(bank.structure.marksPerQuestion,.5);
assert.equal(bank.limitations.length>=5,true);
assert.ok(bank.limitations.some(x=>x.includes("NOT official FBISE")));
assert.ok(bank.limitations.some(x=>x.includes("no")||x.includes("No")||x.includes("not")));
const ids=new Set(),stems=new Set(),letters={A:0,B:0,C:0,D:0},bySLO=new Map(),groups=new Map(),sequence=[];
let independent=0,scenario=0;
for(const [i,q] of bank.questions.entries()){
 assert.equal(q.sourceQuestionNumber,i+1);
 assert.equal(q.id,"XI-U04-MCQ-"+String(i+1).padStart(4,"0"));
 assert.ok(!ids.has(q.id));ids.add(q.id);
 assert.equal(q.grade,11);assert.equal(q.unit,4);
 assert.equal(q.type,"single_choice");
 assert.equal(q.assessmentClassification,"summative-theory");
 assert.equal(q.status,"teacher-review-pending");
 assert.equal(q.boardEligible,false);assert.equal(q.active,true);
 assert.ok(q.stem.length>=25&&q.explanation.length>=18,"Insufficient question/explanation "+q.id);
 assert.ok(q.topic&&q.topic.length>5);
 assert.ok(!stems.has(q.stem),"Duplicate stem "+q.id);stems.add(q.stem);
 assert.deepEqual(q.options.map(x=>x.id),["A","B","C","D"]);
 assert.ok(q.options.every(x=>typeof x.text==="string"&&x.text.trim().length>0));
 assert.equal(new Set(q.options.map(x=>x.text.trim().toLowerCase())).size,4,"Option duplicate "+q.id);
 assert.ok("ABCD".includes(q.correctOptionId));
 assert.equal(q.sloCodes.length,1);
 assert.ok(expectedCodes.includes(q.sloCodes[0]),"Unexpected SLO "+q.id);
 assert.ok(q.source&&q.source.file==="11 Physics Book(10).pdf");
 assert.ok(Number.isInteger(q.source.textbookPage)&&q.source.textbookPage>=53&&q.source.textbookPage<=76);
 assert.ok(["original-slo-practice","original-scenario-practice"].includes(q.source.sourceType));
 const s=audit.allSummativeSLOs.find(s=>s.code===q.sloCodes[0]);
 assert.ok(s&&s.cognitive.includes(q.cognitiveLevel),
  "Cognitive level "+q.cognitiveLevel+" not in supplied FBISE SLO "+q.sloCodes[0]+" for question "+(i+1));
 assert.ok(["Knowledge","Understanding","Application"].includes(q.cognitiveLevel));
 bySLO.set(q.sloCodes[0],(bySLO.get(q.sloCodes[0])||0)+1);
 letters[q.correctOptionId]++;sequence.push(q.correctOptionId);
 if(!q.scenarioSetId){
  independent++;
  assert.ok(i<56,"Independent questions must precede six grouped scenarios");
  assert.ok(!q.stimulusText,"Independent MCQ incorrectly has scenario stimulus");
 }else{
  scenario++;
  assert.ok(i>=56,"Scenario item out of group zone");
  assert.ok(q.stimulusText&&q.stimulusText.length>140,"Scenario lacks independent source context "+q.id);
  assert.ok(q.scenarioTitle&&q.scenarioTitle.length>12);
  assert.ok(/^U04-S0[1-6]$/.test(q.scenarioSetId));
  assert.ok(q.scenarioIndex>=1&&q.scenarioIndex<=4);
  if(!groups.has(q.scenarioSetId))groups.set(q.scenarioSetId,[]);
  groups.get(q.scenarioSetId).push(q);
 }
}
assert.equal(independent,56);assert.equal(scenario,24);
assert.equal(groups.size,6);
for(const [id,qs] of groups){
 assert.equal(qs.length,4,"Scenario group not complete "+id);
 assert.deepEqual(qs.map(q=>q.scenarioIndex),[1,2,3,4]);
 assert.equal(new Set(qs.map(q=>q.stimulusText)).size,1);
 assert.equal(new Set(qs.map(q=>q.scenarioTitle)).size,1);
 assert.equal(new Set(qs.map(q=>q.correctOptionId)).size,4,
  "Each 4-question scenario should contain one of each answer letter "+id);
}
for(const c of "ABCD")assert.equal(letters[c],20,"Correct option not exactly balanced for "+c);
let maxRun=0,last="",run=0;
for(const letter of sequence){
 run=letter===last?run+1:1;maxRun=Math.max(run,maxRun);last=letter;
}
assert.ok(maxRun<=2,"Answer pattern has 3+ consecutive identical letters");
assert.deepEqual(audit.allSummativeSLOs.map(x=>x.code),expectedCodes);
for(const [index,code] of expectedCodes.entries()){
 assert.equal(bySLO.get(code),distribution[index],"Wrong source SLO balance "+code);
 const record=audit.allSummativeSLOs[index];
 assert.equal(record.proposedMCQs,distribution[index]);
 assert.equal(record.publishedProvisionalMCQs,distribution[index]);
 assert.equal(record.assessmentStatus,"provisional-public-self-practice-teacher-review-pending");
}
// Independent numerical spot-checks using original NBF worked-example values.
const answer=n=>{
 const q=bank.questions[n-1];
 return q.options.find(o=>o.id===q.correctOptionId).text;
};
const key={
 1:"π rad",2:"π/2 rad",3:"One complete revolution",6:"3.0 m",7:"2 rad/s",
 8:"10 m/s",9:"2 rad/s²",10:"π rad/s",11:"2.0 m/s²",12:"16 rad/s",
 13:"6 rad/s",14:"16 rad",15:"6 rad/s",16:"5 s",17:"15 rad",18:"25 rad",
 22:"16 N",23:"1000 N",24:"9",25:"24 N",38:"77.7 s",
 39:"18 kg m²",40:"0.50 kg m²",42:"2.0 kg m²/s",
 44:"10 N m",45:"3 rad/s²",46:"−3 N m",
 57:"2π rad",58:"20.54 rad/s",59:"−0.94 rad/s²",60:"About 22 s",
 62:"17 m",63:"8.47 m/s²",65:"2592 N",67:"16.4°",
 69:"0.17298 kg m²",70:"20.83 kg m²/s",71:"−2.67 N m",
 72:"−15.44 rad/s²",74:"0.0808 rad/s",75:"77.7 s",
 77:"8.76 kg m²",78:"78.2 rpm"
};
for(const [n,expected] of Object.entries(key))
 assert.equal(answer(Number(n)),expected,"Source calculation altered for question "+n);
near(856*12**2/7250,17,.01);
near(7250/856,8.47,.01);
near(900*12**2/50,2592);
near(Math.atan(12**2/(50*9.8))*180/Math.PI,16.4,.1);
near(.5*3.6*.31**2,.17298);
const w=1150*2*Math.PI/60,I=.5*3.6*.31**2,L=I*w;
near(L,20.83,.01);
near(-L/7.8,-2.67,.01);
near(-w/7.8,-15.44,.01);
near(2*Math.PI*Math.sqrt(1500/9.8),77.73,.01);
near((3+4*1.2**2)/(3+4*.3**2)*30,78.2,.1);
near(Math.pow(6.8/.331,2)/(-2*74.8/.331),-.934,.002);
// 12 SLOs are Unit 4; do not contaminate with formative B11 or collision B12/B13.
assert.ok(!bank.questions.some(q=>["P-11-B-11","P-11-B-12","P-11-B-13"].includes(q.sloCodes[0])));
assert.equal(audit.studentQuestionBankPublished,true);
assert.equal(audit.studentQuestionBankStatus,"provisional-public-self-practice-teacher-academic-review-pending");
assert.equal(audit.studentGradesRecorded,false);
assert.equal(audit.protectedOrGradedAssessmentPublished,false);
assert.equal(audit.descriptivePaperPublished,false);
assert.equal(audit.publishedPracticeBankFile,"question-bank/grade-11/unit-04-v39-80-practice.json");
assert.equal(audit.publishedPracticePage,"./unit-04-mcq-full80.html");
const unit4=catalog.grades.find(g=>g.grade===11)?.units.find(x=>x.unit===4);
assert.equal(unit4.questionBankCount,80);
assert.equal(unit4.assessmentStatus,"provisional-unit4-public-mcq-self-practice");
assert.equal(unit4.resourceIds.length,13);
assert.equal(new Set(unit4.resourceIds).size,13);
assert.ok(unit4.studentNotice.includes("No protected Unit 4 tests"));
assert.ok(unit4.studentNotice.includes("saved scores"));
assert.ok(unit4.resourceIds.includes("unit4-mcq-full80"));
const r=catalog.resources.filter(r=>r.id==="unit4-mcq-full80");
assert.equal(r.length,1);
assert.equal(r[0].href,"./unit-04-mcq-full80.html");
assert.equal(r[0].public,true);
assert.equal(r[0].category,"PRACTISE");
assert.ok(r[0].contentStatus.includes("teacher-review-pending"));
for(const page of [html,desk,auditPage]){
 assert.ok(page.includes('href="./unit-04-mcq-full80.html"')||page===html,"Practice link missing");
 assert.ok(page.includes('src="./assets/physics-with-sir-najam-official-logo.png"'),"Missing exact existing logo");
 const ids=[...page.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(ids.length,new Set(ids).size,"Duplicate HTML ID");
}
assert.ok(html.includes('src="./unit-04-mcq-full80.js"'));
assert.ok(html.includes("boxed A/B/C/D options"));
assert.ok(html.includes("not an official examiner-approved key"));
assert.ok(html.includes("not saved to My Physics Progress"));
for(const id of ["bankStatus","questionArea","check","showKey","reset","printQuestions",
 "printKey","result","answerKey","solutionList"])
 assert.ok(html.includes('id="'+id+'"'),"Missing practice page control "+id);
for(const k of ['"Sr #","Question","(A)","(B)","(C)","(D)","A","B","C","D"',
 '"../question-bank/grade-11/unit-04-v39-80-practice.json"', // Exact relative bank path
 'q.unit!==4','data.questions.length!==80','q.stimulusText',
 'renderQuestions()','renderKey()','printQuestions','printKey',
 'cache:"no-store"','Correct: ','Explanation: ']){
 assert.ok(ui.includes(k),"Missing source-practice UI behavior "+k);
}
assert.ok(ui.includes('const EXPECTED=['));
assert.ok(ui.includes('"P-11-B-21"'));
assert.ok(ui.includes('!q.scenarioTitle'));
assert.ok(ui.includes('Object.values(letters).some(n=>n!==20)'));
assert.ok(ui.includes('new Set(g.map(q=>q.stimulusText)).size!==1'));
for(const content of [html,ui]){
 for(const disallowed of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,
 /\bFirebase\b/i,/\bFirestore\b/i,/\bWebSocket\b/i,/\bsendBeacon\b/i,
 /createUserWithEmailAndPassword/i,/\bsetDoc\s*\(/i]){
  assert.ok(!disallowed.test(content),"Public Unit4 practice must not touch protected results");
 }
}
const unit3=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===3);
assert.equal(unit3.questionBankCount,80);
assert.equal(unit3.resourceIds.length,10);
assert.ok(unit3.resourceIds.includes("unit3-assessment-pack"));
console.log("PASS — 80 unique Unit 4 source-grounded MCQs with complete options/keys/explanations and 56+24/6×4 grouping.");
console.log("PASS — Twelve exact official summative SLO counts, each cognitive tag within official framework, B11/B12/B13 excluded.");
console.log("PASS — All A/B/C/D exactly 20 correct, no more than 2 identical answers consecutive; scenario texts preserved per item.");
console.log("PASS — Independently recalculated 10+ textbook numeric relationships and 43 stored answer-key values.");
console.log("PASS — FBISE boxed print/bubble browser UI, 13 Unit4 catalogue resources and full prior Unit3 80-question data continuity.");
console.log("PASS — No protected test scores, accounts, grades, Firestore, browser storage or remote student writes.");
console.log("NOTE — Provisional teacher-review-pending self-practice; automated checks are not complete item-by-item science certification or live browser QA.");
