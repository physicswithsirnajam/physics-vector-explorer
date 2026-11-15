/*
 * V47 SLO-focused teacher session navigator.
 * Read-only original MCQ bank. All counts/topic labels derive from source,
 * not from duplicated or hand-keyed question numbers or answer letters.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const SLOS=[
 ["P-11-B-07","Angles in radians"],
 ["P-11-B-08","Angular and linear quantities"],
 ["P-11-B-09","Equations of rotational motion"],
 ["P-11-B-10","Perpendicular force and curved motion"],
 ["P-11-B-14","Calculating centripetal force"],
 ["P-11-B-15","Sources of inward force"],
 ["P-11-B-16","Weightlessness in orbit"],
 ["P-11-B-17","Artificial gravity in rotation"],
 ["P-11-B-18","Moment of inertia and angular momentum"],
 ["P-11-B-19","Torque and angular acceleration"],
 ["P-11-B-20","Conservation of angular momentum"],
 ["P-11-B-21","Centrifugation"]
];
const known=new Set(SLOS.map(x=>x[0]));
const source="../question-bank/grade-11/unit-04-v39-80-practice.json";
function el(tag,className,text){
 const e=document.createElement(tag);
 if(className)e.className=className;
 if(text!==undefined)e.textContent=String(text);
 return e;
}
function countsFromBank(data){
 if(!data||data.schemaVersion!==1||data.status!=="practice-pilot"||
  !Array.isArray(data.questions)||data.questions.length!==80||
  data.structure?.straight!==56||data.structure?.scenario!==24||
  data.structure?.scenarioSets!==6||data.structure?.marksPerQuestion!==.5)
  throw Error("Provisional 80-MCQ source bank is unavailable or incomplete");
 const counts=new Map(SLOS.map(([id])=>[id,{total:0,scenario:0,straight:0,cognitive:new Map()}]));
 const seen=new Set(),situations=new Map();
 for(const [i,q] of data.questions.entries()){
  if(!q.id||seen.has(q.id)||q.sourceQuestionNumber!==i+1||q.grade!==11||q.unit!==4||
    q.boardEligible!==false||q.assessmentClassification!=="summative-theory"||
    q.sloCodes?.length!==1||!known.has(q.sloCodes[0])||!q.stem||
    q.options?.length!==4||q.options.map(o=>o.id).join("")!=="ABCD")
   throw Error("Invalid MCQ mapping near question "+(i+1));
  seen.add(q.id);
  const c=counts.get(q.sloCodes[0]);c.total++;
  if(q.scenarioSetId){
   if(i<56||!q.stimulusText||!q.scenarioTitle||q.scenarioIndex<1||q.scenarioIndex>4)throw Error("Missing scenario passage");
   c.scenario++;
   if(!situations.has(q.scenarioSetId))situations.set(q.scenarioSetId,[]);
   situations.get(q.scenarioSetId).push(q);
  }else{
   if(i>=56)throw Error("Contextual item must have scenario");
   c.straight++;
  }
  c.cognitive.set(q.cognitiveLevel,(c.cognitive.get(q.cognitiveLevel)||0)+1);
 }
 if(situations.size!==6||[...situations.values()].some(g=>g.length!==4||
  g.map(q=>q.scenarioIndex).join(",")!=="1,2,3,4"||
  new Set(g.map(q=>q.stimulusText)).size!==1))
  throw Error("Incomplete four-question scenario group");
 if([...counts.values()].some(c=>c.total===0))throw Error("All 12 summative SLOs must have questions");
 if([...counts.values()].reduce((n,c)=>n+c.total,0)!==80)throw Error("Counts must sum to 80");
 return counts;
}
function link(label,path,slo){
 const a=el("a","link-pill",label);
 a.href=path+"?"+new URLSearchParams({slo}).toString();
 return a;
}
function render(counts){
 const cards=SLOS.map(([id,topic])=>{
  const c=counts.get(id),article=el("article","card");
  const title=el("h3","",topic),intro=el("p","stat",c.total+" original MCQs");
  const breakdown=el("p","",c.straight+" independent · "+c.scenario+" contextual");
  const cognitive=el("p","",["Knowledge","Understanding","Application"]
   .filter(level=>c.cognitive.has(level)).map(level=>level+": "+c.cognitive.get(level)).join(" · "));
  const actions=el("div","actions");
  actions.append(
   link("Timed student slides","./unit-04-projector-practice.html",id),
   link("Teacher discussions","./unit-04-discussion-slides.html",id)
  );
  article.append(el("div","slo",id),title,intro,breakdown,cognitive,actions);
  return article;
 });
 $("sloGrid").replaceChildren(...cards);
 $("status").textContent="Ready · 12 summative SLOs · 80 original MCQs · per-objective counts verified";
}
fetch(source,{cache:"no-store"}).then(r=>{
 if(!r.ok)throw Error("HTTP "+r.status);
 return r.json();
}).then(data=>render(countsFromBank(data))).catch(error=>{
 $("status").textContent="SLO counts could not be loaded: "+error.message+". Use the full-paper links above or reload.";
 $("sloGrid").replaceChildren();
});
})();