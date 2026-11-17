#!/usr/bin/env node
"use strict";
/* Grade XI Unit 4, NBF printed pp.53–76 + FBISE framework pp.3–4.
 * Source-mapped teaching audit and centrifuge conceptual lab, not a finished
 * question bank or a physical sedimentation / safety calculation.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const m=require(path.join(root,"portal/unit-04-centrifuge-engine.js"));
const page=read("portal/unit-04-centrifuge-study.html");
const lab=read("portal/unit-04-centrifuge-lab.html");
const ui=read("portal/unit-04-centrifuge-ui.js");
const engine=read("portal/unit-04-centrifuge-engine.js");
const auditPage=read("portal/unit-04-slo-audit.html");
const audit=JSON.parse(read("portal/unit-04-slo-audit.json"));
const desk=read("portal/unit-04.html");
const cat=JSON.parse(read("portal/learning-catalog.json"));
const near=(x,y,t=1e-9)=>assert.ok(Number.isFinite(x)&&Math.abs(x-y)<=t,"Expected "+y+" ± "+t+", observed "+x);
near(m.G,9.8);near(m.TAU,2*Math.PI);
const p=m.model(600,.1,2);
near(p.omegaRadPerSec,20*Math.PI);
near(p.revolutionsPerSecond,10);
near(p.periodSeconds,.1);
near(p.centripetalAcceleration,400*Math.PI**2*.1);
near(p.centripetalAcceleration,394.7841760436,1e-7);
near(p.radialAccelerationInG,p.centripetalAcceleration/9.8);
near(p.neededInwardForce,.002*p.centripetalAcceleration);
const zero=m.model(0,.1,2);
near(zero.omegaRadPerSec,0);near(zero.centripetalAcceleration,0);
near(zero.neededInwardForce,0);assert.equal(zero.periodSeconds,null);
const scale=m.comparison(600,.1,2);
near(scale.twiceRPM.centripetalAcceleration,4*scale.base.centripetalAcceleration);
near(scale.twiceRadius.centripetalAcceleration,2*scale.base.centripetalAcceleration);
near(scale.twiceRPM.neededInwardForce,4*scale.base.neededInwardForce);
near(scale.twiceRadius.neededInwardForce,2*scale.base.neededInwardForce);
assert.ok(scale.statement.includes("does not mean sedimentation time"));
for(const invalid of [
 ()=>m.model(-1,.1,2),()=>m.model(12001,.1,2),
 ()=>m.model(600,0,2),()=>m.model(600,11,2),
 ()=>m.model(600,.1,0),()=>m.model(Infinity,.1,2),
 ()=>m.model(500,NaN,2),()=>m.format(Infinity),()=>m.format(1,7)
])assert.throws(invalid);
let n=0;
for(const rpm of [0,300,600,1500,3000])
for(const radius of [.05,.1,.125,.25])
for(const mass of [.5,2,10]){
 const x=m.model(rpm,radius,mass),w=rpm*2*Math.PI/60;
 near(x.centripetalAcceleration,w*w*radius,1e-7);
 near(x.neededInwardForce,mass/1000*w*w*radius,1e-7);
 if(rpm>0)near(x.periodSeconds,60/rpm);
 const c=m.comparison(rpm,radius,mass);
 near(c.twiceRPM.centripetalAcceleration,4*x.centripetalAcceleration,1e-7);
 near(c.twiceRadius.centripetalAcceleration,2*x.centripetalAcceleration,1e-7);
 n++;
}
assert.equal(n,60);
assert.deepEqual(Object.keys(m.examples),["suspension","cream","laundry"]);
for(const x of Object.values(m.examples))assert.ok(x.source.includes("p.63"));
assert.ok(m.examples.suspension.density.includes("outer-end"));
assert.ok(m.examples.cream.density.includes("skim"));
assert.ok(m.examples.laundry.density.includes("holes"));
assert.ok(m.model(300,.1,2).distinction.includes("inertial frame"));
assert.ok(m.model(300,.1,2).caveat.includes("NOT a prediction"));
assert.equal(m.format(-.000001),"0");
const expected=["P-11-B-07","P-11-B-08","P-11-B-09","P-11-B-10",
 "P-11-B-14","P-11-B-15","P-11-B-16","P-11-B-17",
 "P-11-B-18","P-11-B-19","P-11-B-20","P-11-B-21"];
const entries=audit.allSummativeSLOs;
assert.equal(audit.grade,11);assert.equal(audit.unit,4);
assert.equal(entries.length,12);
assert.deepEqual(entries.map(x=>x.code),expected);
assert.ok(audit.sources.textbook.includes("53–76"));
assert.ok(audit.sources.framework.includes("pp.3–4"));
assert.equal(audit.studentQuestionBankPublished,true);
assert.equal(audit.studentQuestionBankStatus,"provisional-public-self-practice-teacher-academic-review-pending");
assert.equal(audit.protectedOrGradedAssessmentPublished,false);
assert.equal(audit.descriptivePaperPublished,true);
assert.ok(audit.scopeNote.includes("full Grade XI syllabus coverage"));
const identifiers=new Set(),allowedCognitive=new Set(["Knowledge","Understanding","Application"]);
const urls={
 "unit4-rotation-study":"unit-04-rotation-study.html",
 "unit4-centripetal-study":"unit-04-centripetal-study.html",
 "unit4-artificial-gravity-study":"unit-04-artificial-gravity-study.html",
 "unit4-angular-momentum-study":"unit-04-angular-momentum-study.html",
 "unit4-centrifuge-study":"unit-04-centrifuge-study.html",
 "unit4-rotation-lab":"unit-04-rotation-lab.html",
 "unit4-centripetal-lab":"unit-04-centripetal-lab.html",
 "unit4-artificial-gravity-lab":"unit-04-artificial-gravity-lab.html",
 "unit4-angular-momentum-lab":"unit-04-angular-momentum-lab.html",
 "unit4-centrifuge-lab":"unit-04-centrifuge-lab.html"
};
const byId=Object.fromEntries(cat.resources.map(x=>[x.id,x]));
for(const x of entries){
 assert.ok(!identifiers.has(x.code));identifiers.add(x.code);
 assert.equal(x.form,"Summative");
 assert.equal(x.teachingStatus,"available-source-based");
 assert.equal(x.assessmentStatus,"provisional-public-self-practice-teacher-review-pending");
 assert.equal(x.publishedProvisionalMCQs,x.proposedMCQs);
 assert.ok(x.sourceOutcome.length>12);
 assert.ok(x.cognitive.length>=1);
 for(const k of x.cognitive)assert.ok(allowedCognitive.has(k),"Unexpected cognitive level "+k);
 assert.ok(x.printedTextbookPages.length>0);
 for(const pg of x.printedTextbookPages)assert.ok(pg>=53&&pg<=76);
 assert.ok(Number.isInteger(x.proposedMCQs)&&x.proposedMCQs>=1);
 for(const id of [x.guideResourceId,x.labResourceId]){
  assert.ok(urls[id],"Missing source mapping "+id);
  assert.ok(byId[id]&&byId[id].public,"Unpublished teaching resource "+id);
  assert.equal(byId[id].href,"./"+urls[id]);
  const resourceFile=read("portal/"+urls[id]);
  assert.ok(resourceFile.includes("Physics with Sir Najam"));
  assert.ok(resourceFile.includes(x.code),"Missing SLO in learning page "+id+": "+x.code);
  assert.ok(auditPage.includes('href="./'+urls[id]+'"'),"Audit link missing "+urls[id]);
 }
 assert.ok(auditPage.includes('data-slo="'+x.code+'"'),"Audit not showing SLO "+x.code);
}
assert.equal(entries.reduce((n,x)=>n+x.proposedMCQs,0),80);
assert.equal(entries.find(x=>x.code==="P-11-B-21").proposedMCQs,4);
const pblue=audit.proposedPracticeOnly;
assert.equal(pblue.objective.totalQuestions,80);
assert.equal(pblue.objective.independentMCQs,56);
assert.equal(pblue.objective.stimulusMCQs,24);
assert.equal(pblue.objective.stimulusSets,6);
assert.equal(pblue.objective.questionsPerStimulus,4);
assert.equal(pblue.objective.independentMCQs+pblue.objective.stimulusMCQs,80);
assert.equal(pblue.objective.stimulusSets*pblue.objective.questionsPerStimulus,24);
assert.equal(pblue.objective.marksPerQuestion,.5);
assert.equal(pblue.objective.totalMarks,40);
assert.equal(pblue.descriptive.sectionBSRQs,7);
assert.equal(pblue.descriptive.sectionBTotal,28);
assert.equal(pblue.descriptive.sectionCERQs,2);
assert.equal(pblue.descriptive.sectionCTotal,12);
assert.equal(pblue.fullPracticeMarks,80);
assert.ok(pblue.warning.includes("NOW PUBLIC separately"));
assert.equal(audit.excludedAdjacentFrameworkSLOs.length,3);
assert.deepEqual(audit.excludedAdjacentFrameworkSLOs.map(x=>x.code),
 ["P-11-B-11","P-11-B-12","P-11-B-13"]);
assert.equal(audit.excludedAdjacentFrameworkSLOs[0].form,"Formative");
assert.ok(audit.excludedAdjacentFrameworkSLOs.slice(1).every(x=>x.form==="Summative"));
for(const [name,html] of [["Centrifuge guide",page],["Centrifuge lab",lab],["SLO audit",auditPage],["Learning Desk",desk]]){
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(z=>z[1]);
 assert.equal(ids.length,new Set(ids).size,name+" duplicate DOM IDs");
 assert.ok(html.includes('src="./assets/physics-with-sir-najam-official-logo.png"'),name+" official logo must be untouched");
}
assert.ok(page.includes("P-11-B-21"));
assert.ok(page.includes("printed p.63"));
assert.ok(page.includes("NBF Grade XI Physics"));
assert.ok(page.includes("washing-machine"));
assert.ok(page.includes("Cream separator"));
assert.ok(page.includes("inertial-frame"));
assert.ok(page.includes("rotating with"));
assert.ok(page.includes("394.8 m/s²"));
assert.ok(lab.includes('src="./unit-04-centrifuge-engine.js"'));
assert.ok(lab.includes('src="./unit-04-centrifuge-ui.js"'));
assert.ok(lab.includes("not a real separation prediction")||lab.includes("not a real separation"));
for(const id of ["rpm","radius","mass","useCase","spin","mix","separate",
 "status","caseExplanation","centrifugePlot","rotorGroup","diagramState","omega","ac",
 "gRatio","force","frequency","period","scalingGraph","comparisonText"]){
 assert.ok(lab.includes('id="'+id+'"'),"Centrifuge UI missing "+id);
}
for(const tok of ["m.model(","m.comparison(","m.examples[","requestAnimationFrame(","cancelAnimationFrame(",
 "separated=true","separated=false","p.rpm===0","visibilitychange"]){
 assert.ok(ui.includes(tok),"Missing safe UI behaviour "+tok);
}
assert.ok(!ui.includes("innerHTML"),"No dynamic HTML injection allowed");
for(const content of [engine,ui,lab]){
 for(const forbidden of [/\blocalStorage\b/i,/\bsessionStorage\b/i,/\bindexedDB\b/i,
  /\bFirebase\b/i,/\bFirestore\b/i,/\bWebSocket\b/i,/\bsendBeacon\b/i,/\bfetch\s*\(/i]){
  assert.ok(!forbidden.test(content),"New open lab must not read/write student data");
 }
}
const u4=cat.grades.find(x=>x.grade===11)?.units.find(x=>x.unit===4);
assert.equal(u4.questionBankCount,640);
assert.equal(u4.assessmentStatus,"provisional-unit4-integrated-80-mark-classroom-practice");
assert.equal(u4.resourceIds.length,18);
assert.equal(new Set(u4.resourceIds).size,18);
for(const id of ["unit4-centrifuge-study","unit4-centrifuge-lab","unit4-slo-audit"])
 assert.ok(u4.resourceIds.includes(id),"New audit resource missing "+id);
assert.ok(u4.studentNotice.includes("80 provisional public self-practice MCQs"));
assert.ok(u4.studentNotice.includes("12 summative SLOs"));
for(const href of ["./unit-04-centrifuge-study.html","./unit-04-centrifuge-lab.html",
 "./unit-04-slo-audit.html"])
 assert.ok(desk.includes('href="'+href+'"'),"Learning Desk lacks "+href);
const u3=cat.grades.find(g=>g.grade===11).units.find(x=>x.unit===3);
assert.equal(u3.questionBankCount,220);
assert.equal(u3.resourceIds.length,10);
assert.ok(u3.resourceIds.includes("unit3-assessment-pack"));
console.log("PASS — 60 centrifuge rpm/radius/mass cases: ω=2πrpm/60, a=ω²r, F=ma; 600rpm, .1m≈394.8m/s².");
console.log("PASS — Original NBF centrifuge p.63, real inward vs apparent outward conceptual explanation, cream separator and dryer.");
console.log("PASS — All 12 summative Unit 4 SLOs (B07–B10/B14–B21) mapped to book, cognitive levels, existing public lessons and labs.");
console.log("PASS — Formative B11 and unrelated collision B12/B13 correctly excluded from Unit 4; public 80 MCQs are provisional only.");
console.log("PASS — 18 public Unit 4 resources including integrated provisional assessment pack, zero graded assessments/browser saved data, prior Unit 3 80-MCQ assessment unchanged.");
console.log("NOTE — Source-aligned public 80-MCQ bank is teacher-review pending; no approved official FBISE paper; browser/projector QA required.");
