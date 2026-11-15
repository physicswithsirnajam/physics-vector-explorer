#!/usr/bin/env node
"use strict";
/* V41 Unit 4 descriptive practice academic and code regressions, not examiner certification. */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const paper=JSON.parse(read("question-bank/grade-11/unit-04-descriptive-practice.json"));
const catalog=JSON.parse(read("portal/learning-catalog.json"));
const audit=JSON.parse(read("portal/unit-04-slo-audit.json"));
const page=read("portal/unit-04-descriptive-practice.html"),ui=read("portal/unit-04-descriptive-practice.js");
const desk=read("portal/unit-04.html"),auditPage=read("portal/unit-04-slo-audit.html");
const codes=["P-11-B-07","P-11-B-08","P-11-B-09","P-11-B-10","P-11-B-14","P-11-B-15","P-11-B-16","P-11-B-17","P-11-B-18","P-11-B-19","P-11-B-20","P-11-B-21"];
assert.equal(paper.schemaVersion,1);assert.equal(paper.status,"teacher-review-pending");
assert.equal(paper.pattern.totalMarks,40);
assert.deepEqual(paper.pattern.sectionB,{questions:7,marksEach:4,total:28,internalOr:true});
assert.deepEqual(paper.pattern.sectionC,{questions:2,marksEach:6,total:12,internalOr:true});
assert.equal(paper.sectionB.length,7);assert.equal(paper.sectionC.length,2);
const all=[...paper.sectionB,...paper.sectionC],coverage=new Set(),choices=[];
for(const [i,q] of all.entries()){
 const marks=i<7?4:6;assert.equal(q.number,i+1);assert.equal(q.marks,marks);
 assert.equal(q.choices.length,2,"Each question needs two full OR alternatives");
 for(const opt of q.choices){
  choices.push(opt);coverage.add(opt.slo);
  assert.equal(opt.assessment,"summative-theory");
  assert.ok(codes.includes(opt.slo),"Non-summative or out-of-chapter SLO "+opt.slo);
  assert.ok(audit.allSummativeSLOs.find(x=>x.code===opt.slo));
  assert.ok(opt.sourcePage>=53&&opt.sourcePage<=76);
  assert.ok(opt.sourceRef.includes("NBF Grade XI Unit 4"));
  assert.ok(opt.prompt.length>60);
  assert.ok(opt.marking.length>=4);
  assert.ok(opt.marking.every(s=>Number.isInteger(s.marks)&&s.marks>0&&s.text.length>22));
  assert.equal(opt.marking.reduce((a,s)=>a+s.marks,0),marks,"Wrong marking at Q"+q.number);
  assert.ok(opt.notes.includes("not an official FBISE"));
 }
 assert.notEqual(q.choices[0].prompt,q.choices[1].prompt);
}
assert.equal(choices.length,18);
assert.deepEqual([...coverage].sort(),codes.sort(),"Missing Unit 4 SLO coverage");
for(const n of [11,12,13])assert.ok(!choices.some(q=>q.slo==="P-11-B-"+n));
const near=(v,expected,e=1e-8)=>assert.ok(Math.abs(v-expected)<e,"Expected "+expected+" got "+v);
near(225*Math.PI/180,5*Math.PI/4);
near(.40*10*.50,2);near(.40*10**2,40);
near(4+3*4,16);near(4*4+.5*3*4**2,40);
near((0-30)/6,-5);near((30+0)*6/2,90);
near(3*4**2/2,24);near(3*8**2/2,96);
near(1000*10**2/50,2000);
near(Math.atan(14**2/(50*9.8))*180/Math.PI,21.8,.05);
near(2*1.5*.5**2,.75);near(.75*8,6);
near(6/2,3);near(2+3*4,14);
near(.6*4,2.4);near(4*3/2,6);
near(.5*4*3**2,18);near(.5*2*6**2,36);
near(20**2/80,5);near(30**2/80,11.25);
near(1200*5,6000);near(1200*11.25,13500);near(13500/6000,2.25);
near(.5*2*.5**2,.25);near(2*.5**2,.5);
near(.25*10,2.5);near(.5*10,5);
for(const token of ["5π/4 rad","40 m/s²","+40 rad","−5.0 rad/s²","24 N","96 N","2000 N","21.8°","6.0 kg m²/s","+14 rad/s","2.4 N m","18 J","36 J","6000 N","13,500 N","0.25 kg m²","0.50 kg m²"]){
 assert.ok(choices.some(q=>q.marking.some(x=>x.text.includes(token))),"Missing worked-answer text "+token);
}
assert.equal(audit.descriptivePaperPublished,true);
assert.equal(audit.protectedOrGradedAssessmentPublished,false);
assert.equal(audit.studentGradesRecorded,false);
assert.equal(audit.publishedDescriptiveBankFile,"question-bank/grade-11/unit-04-descriptive-practice.json");
assert.equal(audit.publishedDescriptivePage,"./unit-04-descriptive-practice.html");
assert.ok(audit.proposedPracticeOnly.descriptiveStatus.includes("teacher-review-pending"));
const u4=catalog.grades.find(g=>g.grade===11)?.units.find(u=>u.unit===4);
assert.equal(u4.questionBankCount,80);assert.equal(u4.resourceIds.length,15);
assert.equal(new Set(u4.resourceIds).size,15);
assert.ok(u4.resourceIds.includes("unit4-descriptive-practice"));
assert.equal(u4.assessmentStatus,"provisional-unit4-integrated-80-mark-classroom-practice");
const r=catalog.resources.filter(v=>v.id==="unit4-descriptive-practice");
assert.equal(r.length,1);assert.equal(r[0].href,"./unit-04-descriptive-practice.html");
assert.equal(r[0].public,true);
for(const v of [desk,auditPage])assert.ok(v.includes('href="./unit-04-descriptive-practice.html"'));
assert.ok(page.includes('src="./assets/physics-with-sir-najam-official-logo.png"'));
assert.ok(page.includes("7 × 4 = 28 marks"));assert.ok(page.includes("2 × 6 = 12 marks"));
assert.ok(page.includes("@page{size:A4 portrait"));
assert.ok(page.includes("body:not(.print-teacher)"));
assert.ok(page.includes("body.print-teacher details"));
for(const id of ["sectionB","sectionC","shortQuestions","longQuestions","showAll","hideAll","printStudent","printTeacher","loadStatus"])assert.ok(page.includes('id="'+id+'"'),"Missing UI "+id);
assert.ok(ui.includes("fetch(src"));assert.ok(ui.includes("window.print()"));
assert.ok(ui.includes("afterprint"));assert.ok(ui.includes("textContent=String(value)"));
assert.ok(!/firebase|firestore|localStorage|sessionStorage|auth\.|indexedDB|setDoc|updateDoc|addDoc|sendBeacon|XMLHttpRequest/i.test(ui));
assert.ok(!/unit-03|Translatory Motion/.test(page+ui));
const u3=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===3);
assert.equal(u3.resourceIds.length,10);assert.equal(u3.questionBankCount,80);
console.log("PASS V41: 7x4+2x6=40, nine OR pairs, 18 choices, 12 summative SLOs, physics checks, A4 print, no grade writes.");
