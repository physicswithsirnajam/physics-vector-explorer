/*
 * V51 Set B teacher key: clearly separate, PUBLIC and post-practice only.
 * Solutions are not rendered in the page until teacher deliberately reveals.
 * This is not access control: both JSON sources remain publicly retrievable.
 * No student grades, responses, authentication or persistent state are used.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const base="../question-bank/grade-11/";
const SLO={"P-11-B-29":"Application","P-11-B-30":"Application",
           "P-11-B-31":"Understanding","P-11-B-32":"Application"};
let bank=null,key=null,visible=false;
function node(tag,className,text){
 const e=document.createElement(tag);
 if(className)e.className=className;
 if(text!==undefined)e.textContent=String(text);
 return e;
}
function check(student,teacher){
 if(!student||!teacher||student.questions?.length!==16||
  student.scenarios?.length!==1||teacher.answerKeys?.length!==16||
  student.unit!==5||teacher.unit!==5||teacher.schemaVersion!==1||
  student.status!=="provisional-teacher-review-pending"||
  teacher.status!=="provisional-teacher-review-pending"||
  teacher.publicResource!==true||teacher.notSecured!==true||
  teacher.officialFBISEKey!==false||teacher.companionStudentBank!=="unit-05-v51-16-student-b.json")
  throw Error("Unexpected source banks or public teaching-key boundary");
 const keys=new Map(),counts={A:0,B:0,C:0,D:0},slocount={};
 for(const [i,q] of student.questions.entries()){
  if(q.id!=="U05B-MCQ-"+String(i+1).padStart(2,"0")||q.sourceQuestionNumber!==i+1||
   !Object.hasOwn(SLO,q.sloCode)||q.cognitiveLevel!==SLO[q.sloCode]||
   q.options?.length!==4||q.options.map(x=>x.id).join("")!=="ABCD"||
   !q.stem||!Number.isInteger(q.source?.printedPage))
   throw Error("Invalid student item "+(i+1));
  slocount[q.sloCode]=(slocount[q.sloCode]||0)+1;
 }
 for(const [i,a] of teacher.answerKeys.entries()){
  if(a.id!==student.questions[i].id||keys.has(a.id)||
   !"ABCD".includes(a.correctOptionId)||a.correctOptionId?.length!==1||
   a.workedSteps?.length!==3||a.workedSteps.some(s=>!s||typeof s!=="string")||
   !student.questions[i].options.some(x=>x.id===a.correctOptionId))
   throw Error("Invalid worked key "+(i+1));
  keys.set(a.id,a);counts[a.correctOptionId]++;
 }
 if(Object.keys(slocount).length!==4||Object.values(slocount).some(n=>n!==4)||
  Object.values(counts).some(n=>n!==4)||
  Object.keys(teacher.correctLetterDistribution).some(letter=>counts[letter]!==teacher.correctLetterDistribution[letter]))
  throw Error("Incorrect SLO or letter distribution in source keys");
}
function draw(){
 const rows=[],cards=[];
 for(const q of bank.questions){
  const a=key.answerKeys[q.sourceQuestionNumber-1];
  const tr=node("tr","key-row");
  for(const value of [q.sourceQuestionNumber,a.correctOptionId,q.sloCode,q.cognitiveLevel,"p. "+q.source.printedPage])tr.append(node("td","",value));
  rows.push(tr);
  const article=node("article","solution-card");
  article.dataset.question=String(q.sourceQuestionNumber);
  article.append(node("div","slo","Q"+q.sourceQuestionNumber+" · "+q.sloCode+" · "+q.cognitiveLevel+" · NBF p. "+q.source.printedPage));
  if(q.scenarioSetId){
   const set=bank.scenarios.find(x=>x.id===q.scenarioSetId);
   const context=node("div","context");
   context.append(node("strong","",set.title),node("p","",set.stimulus));
   article.append(context);
  }
  article.append(node("p","stem",q.stem));
  const opts=node("div","options");
  for(const opt of q.options){
   const correct=opt.id===a.correctOptionId;
   const option=node("div","option"+(correct?" correct":""),opt.id+". "+opt.text+(correct?" — Correct":""));
   opts.append(option);
  }
  article.append(opts,node("div","correct-tag","Answer: "+a.correctOptionId));
  const heading=node("h3","","Worked reasoning"),steps=node("ol");
  for(const step of a.workedSteps)steps.append(node("li","",step));
  article.append(heading,steps);
  cards.push(article);
 }
 $("keyRows").replaceChildren(...rows);
 $("solutionCards").replaceChildren(...cards);
}
function reveal(){
 if(!bank||!key)return;
 if(!visible)draw();
 visible=true;
 $("keyBody").hidden=false;
 $("answerStatus").textContent="Teacher key revealed · all 16 solutions";
 $("revealAll").disabled=true;$("hideAll").disabled=false;$("printKey").disabled=false;
}
function hide(){
 visible=false;
 $("keyBody").hidden=true;
 // Remove key-bearing elements from DOM rather than merely concealing them.
 $("keyRows").replaceChildren();$("solutionCards").replaceChildren();
 $("revealAll").disabled=false;$("hideAll").disabled=true;$("printKey").disabled=true;
 $("answerStatus").textContent="Teacher solutions hidden";
}
$("revealAll").addEventListener("click",reveal);
$("hideAll").addEventListener("click",hide);
$("printKey").addEventListener("click",()=>{if(visible)window.print();});
function fetchJson(path){
 return fetch(base+path,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status+": "+path);return r.json();});
}
Promise.all([fetchJson("unit-05-v51-16-student-b.json"),fetchJson("unit-05-v51-16-teacher-key-b.json")]).then(([s,t])=>{
 check(s,t);bank=s;key=t;
 $("teacherStatus").textContent="Ready · Set B · 16 source-mapped provisional questions and worked-key entries loaded · Answers are hidden until explicit reveal";
 $("revealAll").disabled=false;
}).catch(e=>{
 $("teacherStatus").textContent="Could not load separate post-practice key: "+e.message;
 $("revealAll").disabled=true;
});
})();