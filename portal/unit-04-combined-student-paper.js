/*
 * V44: public Grade XI Unit 4 combined STUDENT-ONLY print document.
 * Reads the existing two provisional source banks. Never renders or stores answer keys,
 * scores, user identities or assessment submissions.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const paths=[
 "../question-bank/grade-11/unit-04-v39-80-practice.json",
 "../question-bank/grade-11/unit-04-descriptive-practice.json"
];
const SLO=new Set(["P-11-B-07","P-11-B-08","P-11-B-09","P-11-B-10","P-11-B-14","P-11-B-15","P-11-B-16","P-11-B-17","P-11-B-18","P-11-B-19","P-11-B-20","P-11-B-21"]);
let ready=false;
function make(tag,cls,value){
 const el=document.createElement(tag);
 if(cls)el.className=cls;
 if(value!==undefined)el.textContent=String(value);
 return el;
}
function verify(m,d){
 if(!m||m.schemaVersion!==1||m.status!=="practice-pilot"||!Array.isArray(m.questions)||m.questions.length!==80||
    m.structure?.straight!==56||m.structure?.scenario!==24||
    m.structure?.scenarioSets!==6||m.structure?.scenarioQuestionsPerSet!==4||
    m.structure?.marksPerQuestion!==0.5||m.structure?.totalPracticeMarks!==40)
  throw Error("MCQ source shape does not match 80-question Unit 4 practice");
 if(!d||d.schemaVersion!==1||d.status!=="teacher-review-pending"||
    d.pattern?.totalMarks!==40||d.pattern?.sectionB?.total!==28||
    d.pattern?.sectionC?.total!==12||d.sectionB?.length!==7||d.sectionC?.length!==2)
  throw Error("Descriptive source shape does not match Section B/C");
 const groups=new Map(),seen=new Set();
 for(const [i,q] of m.questions.entries()){
  if(q.sourceQuestionNumber!==i+1||q.grade!==11||q.unit!==4||
     q.assessmentClassification!=="summative-theory"||q.boardEligible!==false||
     !q.id||seen.has(q.id)||q.sloCodes?.length!==1||!SLO.has(q.sloCodes[0])||
     !q.stem||q.options?.length!==4||q.options.map(o=>o.id).join("")!=="ABCD"||
     q.options.some(o=>!o.text)||!q.options.some(o=>o.id===q.correctOptionId))
    throw Error("Invalid source MCQ at Q"+(i+1));
  seen.add(q.id);
  if(i<56){if(q.scenarioSetId)throw Error("Scenario in straight section");}
  else {
   if(!q.scenarioSetId||!q.scenarioTitle||!q.stimulusText||q.scenarioIndex<1||q.scenarioIndex>4)
    throw Error("Incomplete scenario context for Q"+(i+1));
   if(!groups.has(q.scenarioSetId))groups.set(q.scenarioSetId,[]);
   groups.get(q.scenarioSetId).push(q);
  }
 }
 if(groups.size!==6||[...groups.values()].some(g=>g.length!==4||
  g.map(q=>q.scenarioIndex).join(",")!=="1,2,3,4"||
  new Set(g.map(q=>q.stimulusText)).size!==1))
  throw Error("Incomplete contextual MCQ groups");
 for(const [i,q] of [...d.sectionB,...d.sectionC].entries()){
  const marks=i<7?4:6;
  if(q.number!==i+1||q.marks!==marks||q.choices?.length!==2)throw Error("Invalid descriptive OR pair");
  for(const choice of q.choices){
   if(!choice.prompt||choice.assessment!=="summative-theory"||!SLO.has(choice.slo)||
      choice.marking?.reduce((n,s)=>n+s.marks,0)!==marks)
    throw Error("Invalid descriptive source choice at Q"+q.number);
  }
 }
 return groups;
}
function table(questions){
 const wrap=make("div","scroll-table"),t=make("table","mcq-table");
 const head=make("thead"),tr=make("tr");
 for(const label of ["Sr.","Question","(A)","(B)","(C)","(D)","A","B","C","D"]){
  const th=make("th","",label);th.scope="col";tr.append(th);
 }
 head.append(tr);t.append(head);
 const body=make("tbody");
 for(const q of questions){
  const r=make("tr");r.setAttribute("data-number",q.sourceQuestionNumber);
  r.append(make("td","qnum",q.sourceQuestionNumber),make("td","stem",q.stem));
  for(const opt of q.options)r.append(make("td","option",opt.text));
  for(const letter of "ABCD"){
   const c=make("td","bubble-cell"),b=make("span","empty-bubble");
   b.setAttribute("aria-label","Question "+q.sourceQuestionNumber+" blank option "+letter);
   c.append(b);r.append(c);
  }
  body.append(r);
 }
 t.append(body);wrap.append(t);
 return wrap;
}
function renderMcqs(m,groups){
 const out=[];
 for(let i=0;i<56;i+=14){
  const items=m.questions.slice(i,i+14);
  const block=make("section","mcq-block"),h=make("h3","", "Independent MCQs · Q"+(i+1)+"–"+(i+items.length));
  block.append(h,table(items));out.push(block);
 }
 let groupIndex=0;
 for(const questions of groups.values()){
  groupIndex++;
  const block=make("section","mcq-block"),h=make("h3","", "Scenario "+groupIndex+" · Q"+questions[0].sourceQuestionNumber+"–"+questions[3].sourceQuestionNumber+" · "+questions[0].scenarioTitle);
  const context=make("div","scenario-context");
  context.append(make("strong","", "Shared scenario / situation for the following four questions"),make("p","",questions[0].stimulusText));
  block.append(h,context,table(questions));out.push(block);
 }
 $("mcqQuestions").replaceChildren(...out);
}
function renderDescriptive(questions,target){
 const out=[];
 for(const q of questions){
  const article=make("article","desc-question"),title=make("h3");
  title.append(make("span","", "Question "+q.number),make("span","",q.marks+" marks"));
  article.append(title);
  for(const [i,choice] of q.choices.entries()){
   if(i===1)article.append(make("div","or-divider","OR"));
   article.append(make("p","question-option",(i===0?"A. ":"B. ")+choice.prompt));
  }
  const space=make("div","response-lines");space.setAttribute("aria-hidden","true");
  article.append(space);
  out.push(article);
 }
 $(target).replaceChildren(...out);
}
$("printPaper").addEventListener("click",()=>{if(ready)window.print();});
Promise.all(paths.map(path=>fetch(path,{cache:"no-store"}).then(res=>{
 if(!res.ok)throw Error("HTTP "+res.status+" while loading "+path);
 return res.json();
}))).then(([mcq,descriptive])=>{
 const groups=verify(mcq,descriptive);
 renderMcqs(mcq,groups);
 renderDescriptive(descriptive.sectionB,"shortQuestions");
 renderDescriptive(descriptive.sectionC,"longQuestions");
 ready=true;$("printPaper").disabled=false;
 $("loadStatus").textContent="Ready · 80 MCQs · 9 internal-OR pairs · 80 marks · student questions only";
}).catch(error=>{
 $("loadStatus").textContent="Cannot load student paper: "+error.message;
 $("mcqQuestions").replaceChildren(make("p","notice","The source question banks could not be verified. Printing remains disabled."));
});
})();
