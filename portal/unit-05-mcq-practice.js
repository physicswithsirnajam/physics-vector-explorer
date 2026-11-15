/*
 * V50: public student-only 16-MCQ mini-practice.
 * Fetches student JSON only. No teacher answer-key requests, answer checking,
 * storage, network writes, grade collection or account logic.
 * On-screen circles are OPTIONAL, local to the current unsaved page.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const SOURCE="../question-bank/grade-11/unit-05-v50-16-student.json";
const OFFICIAL={
 "P-11-B-29":"Application","P-11-B-30":"Application",
 "P-11-B-31":"Understanding","P-11-B-32":"Application"
};
const selections=new Map();
let bank=null;
function el(tag,className,value){
 const node=document.createElement(tag);
 if(className)node.className=className;
 if(value!==undefined)node.textContent=String(value);
 return node;
}
function validate(data){
 if(!data||data.schemaVersion!==1||data.grade!==11||data.unit!==5||
  data.status!=="provisional-teacher-review-pending"||data.officialBoardPaper!==false||
  data.questions?.length!==16||data.structure?.questions!==16||
  data.structure?.straight!==12||data.structure?.scenario!==4||
  data.structure?.scenarioSets!==1||data.structure?.scenarioQuestionsPerSet!==4||
  data.structure?.marksEach!==.5||data.structure?.practiceMarks!==8||
  data.scenarios?.length!==1)throw Error("Unexpected Unit 5 student source structure");
 if(JSON.stringify(data).match(/"correctOptionId"|"workedSteps"|"answerKeys"|"explanation"/))
  throw Error("Teacher keys must not be included in student source");
 const seen=new Set(),counts={};
 for(const [i,q] of data.questions.entries()){
  if(q.id!=="U05-MCQ-"+String(i+1).padStart(2,"0")||
   q.sourceQuestionNumber!==i+1||seen.has(q.id)||!q.stem||
   !Object.hasOwn(OFFICIAL,q.sloCode)||q.cognitiveLevel!==OFFICIAL[q.sloCode]||
   q.source?.unit!==5||q.source?.frameworkCode!==q.sloCode||
   !Number.isInteger(q.source?.printedPage)||q.source.printedPage<79||q.source.printedPage>83||
   q.options?.length!==4||q.options.map(o=>o.id).join("")!=="ABCD"||
   q.options.some(o=>!o.text)||new Set(q.options.map(o=>o.text)).size!==4)
   throw Error("Invalid item or source for question "+(i+1));
  seen.add(q.id);counts[q.sloCode]=(counts[q.sloCode]||0)+1;
  if(i<12){
   if(q.type!=="straight"||q.scenarioSetId!==null||q.scenarioIndex!==null)
    throw Error("Unexpected scenario in independent question "+(i+1));
  }else if(q.type!=="scenario"||q.scenarioSetId!==data.scenarios[0].id||q.scenarioIndex!==i-11)
   throw Error("Invalid scenario order at question "+(i+1));
 }
 if(Object.values(OFFICIAL).length!==4||Object.keys(counts).length!==4||
   Object.values(counts).some(n=>n!==4)||!data.scenarios[0].stimulus||!data.scenarios[0].title)
  throw Error("All four theory SLOs and full situation required");
}
function markQuestion(number,letter){
 const old=selections.get(number);
 if(old===letter)selections.delete(number);
 else selections.set(number,letter);
 for(const button of document.querySelectorAll('.choice[data-q="'+number+'"]')){
  const yes=selections.get(number)===button.dataset.option;
  button.classList.toggle("selected",yes);
  button.setAttribute("aria-pressed",yes?"true":"false");
  button.textContent=yes?"●":"○";
 }
 updateCount();
}
function updateCount(){
 $("markedCount").textContent=selections.size+" / 16 bubbles marked";
 document.querySelectorAll("#responseGrid [data-response-q]").forEach(node=>{
  const n=Number(node.dataset.responseQ),selected=selections.get(n);
  node.textContent=["A","B","C","D"].map(letter=>letter+(selected===letter?"●":"○")).join("  ");
 });
}
function render(data){
 const rows=[],responses=[];
 for(const q of data.questions){
  if(q.scenarioIndex===1){
   const scenario=data.scenarios.find(item=>item.id===q.scenarioSetId);
   const tr=el("tr","scenario-row"),td=el("td");
   td.colSpan=10;
   td.append(el("strong","",scenario.title+" — shared scenario for Q13–Q16"),el("p","",scenario.stimulus));
   tr.append(td);rows.push(tr);
  }
  const tr=el("tr","question-row");
  tr.dataset.q=String(q.sourceQuestionNumber);
  const n=el("td","num",q.sourceQuestionNumber),stem=el("td","",q.stem);
  tr.append(n,stem);
  for(const opt of q.options)tr.append(el("td","option-text",opt.text));
  for(const opt of q.options){
   const td=el("td","bubblecell");
   const b=el("button","choice","○");
   b.type="button";b.dataset.q=String(q.sourceQuestionNumber);
   b.dataset.option=opt.id;b.setAttribute("aria-pressed","false");
   b.setAttribute("aria-label","Question "+q.sourceQuestionNumber+": mark option "+opt.id);
   b.addEventListener("click",()=>markQuestion(q.sourceQuestionNumber,opt.id));
   td.append(b);tr.append(td);
  }
  rows.push(tr);
  const cell=el("div","response-item"),dots=el("span","dots");
  dots.dataset.responseQ=String(q.sourceQuestionNumber);
  cell.append(el("strong","",String(q.sourceQuestionNumber)+":"),dots);responses.push(cell);
 }
 $("questionRows").replaceChildren(...rows);
 $("responseGrid").replaceChildren(...responses);
 updateCount();
 $("printBtn").disabled=false;$("clearBtn").disabled=false;
 $("loadStatus").textContent="Ready · 16 original MCQs · 4 verified summative theory SLOs · 12 independent + 4 contextual · No answer key loaded";
}
$("printBtn").addEventListener("click",()=>{if(bank)window.print();});
$("clearBtn").addEventListener("click",()=>{
 if(!bank)return;
 selections.clear();
 document.querySelectorAll(".choice").forEach(b=>{
  b.classList.remove("selected");b.setAttribute("aria-pressed","false");b.textContent="○";
 });
 updateCount();
});
fetch(SOURCE,{cache:"no-store"}).then(r=>{
 if(!r.ok)throw Error("HTTP "+r.status);
 return r.json();
}).then(data=>{validate(data);bank=data;render(data);}).catch(err=>{
 $("loadStatus").textContent="Unable to load the practice set: "+err.message;
 $("printBtn").disabled=true;$("clearBtn").disabled=true;
});
})();