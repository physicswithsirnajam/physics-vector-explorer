/* Grade XI Unit 3 assessment pack — public, read-only practice resources.
 * Reuses existing source banks without modifying any student progress, accounts
 * or question files. All dynamic source text is rendered as text nodes.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const SLO=["P-11-B-04","P-11-B-05","P-11-B-06","P-11-B-12","P-11-B-13"];
let mcq=null,descriptive=null,teacherShown=false;
function make(tag,cls,content){
 const e=document.createElement(tag);
 if(cls)e.className=cls;
 if(content!==undefined)e.textContent=String(content);
 return e;
}
const fmt=n=>Number.isInteger(n)?String(n):Number(n.toFixed(2)).toString();
function verify(a,b){
 if(!a||a.status!=="practice-pilot"||a.questions?.length!==80||
  a.structure?.straight!==56||a.structure?.scenario!==24||
  a.structure?.scenarioSets!==6||a.structure?.marksPerQuestion!==.5||
  !b||b.status!=="teacher-review-pending"||
  b.pattern?.sectionB?.total!==28||b.pattern?.sectionC?.total!==12||
  b.pattern?.totalMarks!==40||b.sectionB?.length!==7||b.sectionC?.length!==2)
  throw Error("Assessment source bank format is inconsistent");
 const groups=new Map(),ids=new Set();
 for(const [i,q] of a.questions.entries()){
  if(!q.id||ids.has(q.id)||q.sourceQuestionNumber!==i+1||
   q.grade!==11||q.unit!==3||q.boardEligible!==false||
   q.assessmentClassification!=="summative-theory"||
   !SLO.includes(q.sloCodes?.[0])||q.sloCodes.length!==1||
   q.options?.length!==4||q.options.map(o=>o.id).join("")!=="ABCD"||
   !q.options.some(o=>o.id===q.correctOptionId)||!q.explanation)
   throw Error("Invalid objective question at "+(i+1));
  ids.add(q.id);
  if(q.scenarioSetId){
   if(i<56||!q.stimulusText||q.scenarioIndex<1||q.scenarioIndex>4)throw Error("Invalid scenario item");
   if(!groups.has(q.scenarioSetId))groups.set(q.scenarioSetId,[]);
   groups.get(q.scenarioSetId).push(q);
  }else if(i>=56)throw Error("Scenario missing in Q"+(i+1));
 }
 if(groups.size!==6||[...groups.values()].some(items=>items.length!==4||
  items.map(q=>q.scenarioIndex).join(",")!=="1,2,3,4"||
  new Set(items.map(q=>q.stimulusText)).size!==1))throw Error("Incomplete scenarios");
 for(const [i,q] of [...b.sectionB,...b.sectionC].entries()){
  const marks=i<7?4:6;
  if(q.number!==i+1||q.marks!==marks||q.choices?.length!==2)throw Error("Invalid OR options");
  for(const choice of q.choices){
   if(!SLO.includes(choice.slo)||choice.assessment!=="summative-theory"||
    !Array.isArray(choice.marking)||choice.marking.reduce((n,x)=>n+x.marks,0)!==marks)
    throw Error("Invalid descriptive SLO or marking for question "+q.number);
  }
 }
 return groups;
}
function bubble(letter,marked){
 const e=make("span","bubble"+(marked?" correct":""),letter);
 e.setAttribute("aria-label",letter+(marked?" correct answer":" empty bubble"));
 return e;
}
function questionRow(q,mark){
 const r=make("div","omr-row");
 r.append(make("span","qnum",q.sourceQuestionNumber));
 for(const letter of "ABCD")r.append(bubble(letter,mark&&q.correctOptionId===letter));
 return r;
}
function straightGrid(target,mark){
 const boxes=[];
 for(let col=0;col<4;col++){
  const box=make("div","omr-box");
  const start=col*14,end=start+14;
  box.append(make("h4","", "Questions "+(start+1)+"–"+end));
  for(let j=start;j<end;j++)box.append(questionRow(mcq.questions[j],mark));
  boxes.push(box);
 }
 $(target).replaceChildren(...boxes);
}
function scenarioGrid(target,groups,mark){
 const boxes=[];
 let index=0;
 for(const questions of groups.values()){
  index++;
  const box=make("div","scenario-box");
  const h=make("h4","", "Scenario "+index+" · Q"+questions[0].sourceQuestionNumber+"–"+questions[3].sourceQuestionNumber);
  box.append(h);
  for(const q of questions)box.append(questionRow(q,mark));
  boxes.push(box);
 }
 $(target).replaceChildren(...boxes);
}
function explanations(){
 const rows=mcq.questions.map(q=>{
  const r=make("tr");
  const option=q.options.find(o=>o.id===q.correctOptionId);
  r.append(make("td","num",q.sourceQuestionNumber),
    make("td","num",q.correctOptionId),
    make("td","",q.sloCodes[0]),
    make("td","",option.text+". "+q.explanation));
  return r;
 });
 $("explanationRows").replaceChildren(...rows);
}
function markScheme(){
 const nodes=[];
 for(const [section,list] of [["Section B",descriptive.sectionB],["Section C",descriptive.sectionC]]){
  nodes.push(make("h3","sheet-title",section+" — Suggested marking steps"));
  for(const q of list){
   const card=make("article","mark-item");
   card.append(make("h4","",section+" · Question "+q.number+" · "+q.marks+" marks (attempt A OR B)"));
   for(const [i,opt] of q.choices.entries()){
    const letter=i===0?"A":"B";
    card.append(make("p","",letter+". "+opt.prompt));
    card.append(make("p","source",opt.slo+" · Original/adapted study reference: "+opt.sourceRef));
    const list=make("ol");
    for(const step of opt.marking){
     const li=make("li");
     li.append(make("span","",step.text+" "),
       make("span","mark","["+step.marks+" mark"+(step.marks===1?"":"s")+"]"));
     list.append(li);
    }
    card.append(list);
    if(i===0)card.append(make("p","mark","OR — choose one alternative, not both"));
   }
   nodes.push(card);
  }
 }
 $("descriptiveKey").replaceChildren(...nodes);
}
function tableOfSpecifications(){
 const counts={};
 for(const s of SLO)counts[s]={mcq:0,mcqMarks:0,descA:0,descB:0};
 for(const q of mcq.questions){const t=counts[q.sloCodes[0]];t.mcq++;t.mcqMarks+=.5}
 for(const q of [...descriptive.sectionB,...descriptive.sectionC]){
  counts[q.choices[0].slo].descA+=q.marks;
  counts[q.choices[1].slo].descB+=q.marks;
 }
 const rows=[];
 for(const s of SLO){
  const t=counts[s];
  const row=make("tr");
  row.append(make("td","slo-name",s),make("td","num",t.mcq),
   make("td","num",fmt(t.mcqMarks)),make("td","num",fmt(t.descA)),
   make("td","num",fmt(t.descB)),
   make("td","num",fmt(t.mcqMarks+t.descA)),
   make("td","num",fmt(t.mcqMarks+t.descB)));
  rows.push(row);
 }
 $("tosRows").replaceChildren(...rows);
 const all=SLO.reduce((a,s)=>{const t=counts[s];a.mcq+=t.mcq;a.mcqMarks+=t.mcqMarks;
  a.a+=t.descA;a.b+=t.descB;return a},{mcq:0,mcqMarks:0,a:0,b:0});
 if(all.mcq!==80||all.mcqMarks!==40||all.a!==40||all.b!==40)throw Error("SLO marks do not total 80");
 const r=make("tr");
 for(const cell of ["TOTAL",all.mcq,fmt(all.mcqMarks),fmt(all.a),fmt(all.b),
  fmt(all.mcqMarks+all.a),fmt(all.mcqMarks+all.b)])
  r.append(make("th",typeof cell==="number"?"num":"",cell));
 $("tosTotal").replaceChildren(r);
 $("tosDetails").textContent="Official HSSC-I Section A count: 80 MCQs × 0.5 = 40 marks, including "+
  "56 independent and 24 stimulus-based questions. Section B: 7 × 4 = 28 marks; Section C: 2 × 6 = 12 marks. "+
  "Question 9's internal OR changes the distribution between "+descriptive.sectionC[1].choices[0].slo+
  " and "+descriptive.sectionC[1].choices[1].slo+
  ". Formative-only P-11-B-03 and P-11-B-11 are excluded from these summative practice items. "+
  "This table describes Unit 3 only, not the full HSSC-I syllabus or an official board-approved Table of Specifications.";
}
function printView(view){
 if(!mcq||!descriptive)return;
 document.body.classList.remove("print-omr","print-key","print-tos");
 document.body.classList.add("print-"+view);
 window.print();
}
window.addEventListener("afterprint",()=>{
 document.body.classList.remove("print-omr","print-key","print-tos");
});
function toggleTeacher(){
 teacherShown=!teacherShown;
 $("teacherSection").classList.toggle("hidden",!teacherShown);
 $("showTeacher").textContent=teacherShown?"Hide teacher resources":"Show teacher resources";
 if(teacherShown)$("teacherSection").scrollIntoView({behavior:"smooth",block:"start"});
}
$("showTeacher").addEventListener("click",toggleTeacher);
$("printOMR").addEventListener("click",()=>printView("omr"));
$("printKey").addEventListener("click",()=>printView("key"));
$("printTos").addEventListener("click",()=>printView("tos"));
$("printTosInline").addEventListener("click",()=>printView("tos"));
const links=[
 "../question-bank/grade-11/unit-03-stage2-80-practice.json",
 "../question-bank/grade-11/unit-03-descriptive-practice.json"
];
Promise.all(links.map(link=>fetch(link,{cache:"no-store"}).then(r=>{
 if(!r.ok)throw Error("HTTP "+r.status+" loading "+link);
 return r.json();
}))).then(([a,b])=>{
 const groups=verify(a,b);
 mcq=a;descriptive=b;
 straightGrid("blankStraight",false);straightGrid("keyStraight",true);
 scenarioGrid("blankScenarios",groups,false);scenarioGrid("keyScenarios",groups,true);
 explanations();markScheme();tableOfSpecifications();
 for(const id of ["printOMR","printKey","printTos","printTosInline","showTeacher"])$(id).disabled=false;
 $("loadStatus").textContent="Ready · 80 keyed MCQs · 9 descriptive OR pairs · verified 80 marks";
}).catch(error=>{
 $("loadStatus").textContent="Source bank could not be loaded: "+error.message;
 $("tosDetails").textContent="Please reload this page. Print actions remain disabled until both question banks pass checks.";
});
})();