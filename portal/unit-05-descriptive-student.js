/* V52: Original Unit 5 question-only Section B/C student practice.
 * Never requests teacher key, grades responses or stores data.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const source="../question-bank/grade-11/unit-05-v52-descriptive-student.json";
const levels={"P-11-B-29":"Application","P-11-B-30":"Application","P-11-B-31":"Understanding","P-11-B-32":"Application"};
let loaded=false;
function el(type,css,content){const n=document.createElement(type);if(css)n.className=css;if(content!==undefined)n.textContent=String(content);return n;}
function valid(d){
 if(!d||d.schemaVersion!==1||d.grade!==11||d.unit!==5||d.officialBoardPaper!==false||
 d.status!=="provisional-teacher-review-pending"||d.pattern?.totalMarks!==40||
 d.pattern?.fullSyllabusPaper!==false||d.pattern?.unitOnly!==true||
 d.pattern?.sectionB?.questionCount!==7||d.pattern?.sectionB?.totalMarks!==28||
 d.pattern?.sectionC?.questionCount!==2||d.pattern?.sectionC?.totalMarks!==12||
 d.pattern?.alternatives!==18||d.sectionB?.length!==7||d.sectionC?.length!==2)
 throw Error("Unexpected student-only Unit 5 descriptive blueprint");
 if(/"marking"|"answers"|"teacherNotes"|"workedSteps"|"correctOptionId"/.test(JSON.stringify(d)))
  throw Error("Student question bank must not contain model answers or marking rubrics");
 const ids=new Set();
 for(const q of [...d.sectionB,...d.sectionC]){
  const section=q.number<=7?"B":"C",marks=section==="B"?4:6;
  if(q.section!==section||q.number<1||q.number>9||q.marks!==marks||q.choices?.length!==2)
   throw Error("Malformed OR question "+q.number);
  for(const [i,c] of q.choices.entries()){
   if(c.id!==section+"-"+q.number+"-"+(i===0?"A":"B")||ids.has(c.id)||
   c.assessment!=="summative-theory"||!Object.hasOwn(levels,c.sloCode)||
   c.cognitiveLevel!==levels[c.sloCode]||c.sourcePage<79||c.sourcePage>83||
   !c.prompt||c.prompt.length<70||!["numerical","derivation","conceptual"].includes(c.kind))
    throw Error("Invalid choice, SLO or source page: "+c.id);
   ids.add(c.id);
  }
  if(q.choices[0].sloCode!==q.choices[1].sloCode)
   throw Error("An internal OR pair must target a balanced matching summative SLO");
 }
 if(ids.size!==18)throw Error("Expected eighteen distinct OR choices");
}
function makeQuestion(q){
 const article=el("article","question");article.dataset.question=String(q.number);
 const top=el("div","questionhead");top.append(el("h3","", "Question "+q.number),el("span","mark",q.marks+" marks · choose A OR B"));
 article.append(top);
 for(let i=0;i<2;i++){
  const c=q.choices[i],wrap=el("div","option");wrap.dataset.choice=c.id;
  wrap.append(el("strong","optlabel",(i===0?"A":"B")+") "+c.prompt),
  el("p","meta",c.sloCode+" · "+c.cognitiveLevel+" · NBF printed p. "+c.sourcePage+" · "+(c.kind==="numerical"?"Numerical response":c.kind==="derivation"?"Derivation":"Conceptual response")));
  article.append(wrap);
  if(i===0)article.append(el("div","or","OR"));
 }
 const space=el("div","answer-space"+(q.marks===6?" extended":""));
 space.setAttribute("aria-hidden","true");article.append(space);
 return article;
}
function render(d){
 $("shortQuestions").replaceChildren(...d.sectionB.map(makeQuestion));
 $("extendedQuestions").replaceChildren(...d.sectionC.map(makeQuestion));
 $("loadStatus").textContent="Ready · 7 short/numerical OR pairs (28 marks) + 2 extended/numerical OR pairs (12 marks) · no model answers loaded";
 $("printPaper").disabled=false;loaded=true;
}
$("printPaper").addEventListener("click",()=>{if(loaded)window.print();});
fetch(source,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Student bank HTTP "+r.status);return r.json();}).then(d=>{valid(d);render(d);}).catch(e=>{
 $("loadStatus").textContent="Could not load Unit 5 descriptive questions: "+e.message;
 $("printPaper").disabled=true;
});
})();