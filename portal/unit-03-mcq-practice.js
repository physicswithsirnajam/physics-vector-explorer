/* Physics with Sir Najam — Grade XI Unit 3 public summative MCQ self-practice.
 * 40 source-labelled provisional questions. No account SDK, sign-in or saved results.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const source="../question-bank/grade-11/unit-03-stage1-practice.json";
const EXPECTED=["P-11-B-04","P-11-B-05","P-11-B-06","P-11-B-12","P-11-B-13"];
let bank=null;
let restoreHidden=false;
function node(tag,cls,text){
 const element=document.createElement(tag);
 if(cls)element.className=cls;
 if(text!==undefined)element.textContent=String(text);
 return element;
}
function setStatus(message){
 $("bankStatus").textContent=message;
}
function headingTable(){
 const wrap=node("div","table-scroll");
 const table=node("table","mcq");
 const head=node("thead"), row=node("tr");
 for(const h of ["Sr #","Question","(A)","(B)","(C)","(D)","A","B","C","D"]){
  const th=node("th","",h);th.scope="col";row.appendChild(th);
 }
 head.appendChild(row);
 table.appendChild(head);
 const body=node("tbody");
 table.appendChild(body);
 wrap.appendChild(table);
 return {wrap,body};
}
function makeQuestionRow(q){
 const row=node("tr");
 row.setAttribute("data-question-id",q.id);
 row.appendChild(node("td","",String(q.sourceQuestionNumber)+"." ));
 row.appendChild(node("td","",q.stem));
 for(const option of q.options)row.appendChild(node("td","",option.text));
 for(const letter of "ABCD"){
  const cell=node("td"),label=node("label"),radio=node("input");
  radio.type="radio";
  radio.name="response-"+q.id;
  radio.value=letter;
  radio.setAttribute("aria-label","Question "+q.sourceQuestionNumber+": choose option "+letter);
  label.appendChild(radio);
  label.title="Question "+q.sourceQuestionNumber+": option "+letter;
  cell.appendChild(label);
  row.appendChild(cell);
 }
 return row;
}
function makeGroup(title,subtitle,items,stimulus){
 const sheet=node("section","sheet");
 const bar=node("div","sheet-head"),head=node("h2","",title),count=node("span","badge",subtitle);
 bar.append(head,count);sheet.appendChild(bar);
 if(stimulus){
  const context=node("div","stimulus");
  context.append(node("strong","", "Shared scenario / situation"));
  context.append(node("p","",stimulus));
  sheet.appendChild(context);
 }
 const {wrap,body}=headingTable();
 for(const item of items)body.appendChild(makeQuestionRow(item));
 sheet.appendChild(wrap);
 return sheet;
}
function renderQuestions(){
 const area=$("questionArea");
 const straight=bank.questions.filter(q=>!q.scenarioSetId);
 const scenarios=new Map();
 for(const q of bank.questions.filter(q=>q.scenarioSetId)){
  if(!scenarios.has(q.scenarioSetId))scenarios.set(q.scenarioSetId,[]);
  scenarios.get(q.scenarioSetId).push(q);
 }
 const sections=[makeGroup("Part A — Straight MCQs","28 questions · summative",straight)];
 for(const [set,qs] of scenarios){
  sections.push(makeGroup("Part B — Scenario "+(sections.length-1+1)+" · "+qs[0].scenarioTitle,
    "4 questions · "+qs[0].sloCodes[0],qs,qs[0].stimulusText));
 }
 area.replaceChildren(...sections);
}
function marked(q){
 const selected=document.querySelector('input[name="response-'+q.id+'"]:checked');
 return selected?selected.value:null;
}
function renderKey(){
 const list=$("solutionList");
 const entries=bank.questions.map(q=>{
  const chosen=marked(q);
  const correct=q.options.find(o=>o.id===q.correctOptionId);
  const item=node("li","review");
  const title=node("h3","", "Q"+q.sourceQuestionNumber+" · Correct: "+q.correctOptionId+
     " — "+correct.text);
  const answer=node("p","", "Your answer: "+(chosen===null?"not attempted":chosen)+
    (chosen===q.correctOptionId?" (correct)":chosen===null?"":" (review needed)"));
  const explanation=node("p","", "Explanation: "+q.explanation);
  const extra=q.source.sourceType==="textbook-adapted"?
    "Adapted from NBF Unit 3 end-of-unit exercise MCQ "+q.source.exerciseQuestionNumber+
    ", printed p. "+q.source.textbookPage:
    "Original SLO practice, textbook concept from p. "+q.source.textbookPage;
  const reference=node("p","small",q.id+" · "+q.sloCodes.join(", ")+" · "+extra);
  item.append(title,answer,explanation,reference);
  return item;
 });
 list.replaceChildren(...entries);
}
function check(){
 let correct=0,skipped=0;
 for(const q of bank.questions){
  const response=marked(q);
  if(response===null)skipped++;
  else if(response===q.correctOptionId)correct++;
 }
 const attempted=bank.questions.length-skipped;
 const marks=correct*.5;
 const result=$("result");
 result.textContent="Unit 3 provisional self-practice: "+
    correct+" / 40 correct ("+marks.toFixed(1)+" / 20 practice marks); "+
    attempted+" attempted; "+skipped+" unanswered. "+
    "Open the solution key to review every answer. No grade has been recorded in My Physics Progress.";
 result.classList.remove("hidden");
 renderKey();
 $("answerKey").classList.remove("hidden");
 result.scrollIntoView({behavior:"smooth",block:"center"});
}
function showKey(){
 renderKey();
 const panel=$("answerKey");
 panel.classList.toggle("hidden");
 $("showKey").textContent=panel.classList.contains("hidden")?
   "Show explanation key":"Hide explanation key";
 if(!panel.classList.contains("hidden"))
  panel.scrollIntoView({behavior:"smooth",block:"start"});
}
function reset(){
 for(const input of document.querySelectorAll('#questionArea input[type="radio"]'))input.checked=false;
 $("result").textContent="";
 $("result").classList.add("hidden");
 $("answerKey").classList.add("hidden");
 $("showKey").textContent="Show explanation key";
 $("questionArea").scrollIntoView({behavior:"smooth",block:"start"});
}
function checkSchema(data){
 if(!data||data.schemaVersion!==1||data.status!=="practice-pilot"||
    !Array.isArray(data.questions)||data.questions.length!==40)throw Error("Unexpected bank structure");
 const seen=new Set();
 for(const [i,q] of data.questions.entries()){
  if(!q.id||seen.has(q.id)||q.grade!==11||q.unit!==3||
   q.sourceQuestionNumber!==i+1||q.assessmentClassification!=="summative-theory"||
   !q.sloCodes||q.sloCodes.length!==1||!EXPECTED.includes(q.sloCodes[0])||
   !Array.isArray(q.options)||q.options.length!==4||
   q.options.map(o=>o.id).join("")!=="ABCD"||
   !q.options.some(o=>o.id===q.correctOptionId)||
   !q.stem||!q.explanation)throw Error("Bank item "+(i+1)+" fails validation");
  seen.add(q.id);
 }
 const basic=data.questions.filter(q=>!q.scenarioSetId);
 const groups=new Map();
 for(const q of data.questions.filter(q=>q.scenarioSetId)){
  if(!q.stimulusText)throw Error("Scenario lacks context");
  if(!groups.has(q.scenarioSetId))groups.set(q.scenarioSetId,[]);
  groups.get(q.scenarioSetId).push(q);
 }
 if(basic.length!==28||groups.size!==3||[...groups.values()].some(g=>g.length!==4))
   throw Error("Bank does not match the 28+3×4 practice plan");
}
function ready(){
 $("check").disabled=false;$("showKey").disabled=false;$("reset").disabled=false;
 $("printQuestions").disabled=false;$("printKey").disabled=false;
}
$("check").addEventListener("click",()=>{if(bank)check()});
$("showKey").addEventListener("click",()=>{if(bank)showKey()});
$("reset").addEventListener("click",()=>{if(bank)reset()});
$("printQuestions").addEventListener("click",()=>{if(bank)window.print()});
$("printKey").addEventListener("click",()=>{
 if(!bank)return;
 restoreHidden=$("answerKey").classList.contains("hidden");
 renderKey();
 $("answerKey").classList.remove("hidden");
 document.body.classList.add("print-answers");
 window.print();
});
window.addEventListener("afterprint",()=>{
 document.body.classList.remove("print-answers");
 if(restoreHidden)$("answerKey").classList.add("hidden");
 restoreHidden=false;
});
fetch(source,{cache:"no-store"}).then(response=>{
 if(!response.ok)throw Error("Question bank HTTP "+response.status);
 return response.json();
}).then(data=>{
 checkSchema(data);
 bank=data;
 renderQuestions();
 ready();
 setStatus("40 questions ready · 28 straight + 12 scenario · 5 summative SLOs");
}).catch(err=>{
 setStatus("Unable to load this question bank");
 $("questionArea").replaceChildren(node("p","notice",
   "The Unit 3 practice questions could not be loaded. Please refresh or check the repository files. "+err.message));
});
})();
