/* V52: Public, unprotected, AFTER-PRACTICE teacher discussion.
 * Data sources include a separate worked key. No user data or grade persistence.
 * Initial page contains NO answer card until explicit reveal. Hiding clears DOM.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const root="../question-bank/grade-11/";
const levels={"P-11-B-29":"Application","P-11-B-30":"Application","P-11-B-31":"Understanding","P-11-B-32":"Application"};
let student=null,key=null,visible=false;
function el(type,css,content){const n=document.createElement(type);if(css)n.className=css;if(content!==undefined)n.textContent=String(content);return n;}
function validate(s,k){
 if(!s||!k||s.grade!==11||k.grade!==11||s.unit!==5||k.unit!==5||
 s.status!=="provisional-teacher-review-pending"||k.status!=="provisional-teacher-review-pending"||
 s.sectionB?.length!==7||s.sectionC?.length!==2||k.answers?.length!==18||
 s.pattern?.totalMarks!==40||k.totalPaperMarks!==40||k.totalOrPairs!==9||
 k.totalChoices!==18||k.publicResource!==true||k.notSecured!==true||k.officialFBISEKey!==false||
 k.companionStudentBank!=="unit-05-v52-descriptive-student.json")
 throw Error("Unexpected teacher marking source or public status");
 const ids=new Set(),keyed=new Set();
 for(const q of [...s.sectionB,...s.sectionC]){
  const marks=q.number<=7?4:6,section=q.number<=7?"B":"C";
  if(q.marks!==marks||q.choices?.length!==2||q.section!==section)
   throw Error("Incorrect question or OR marks "+q.number);
  for(const [i,c] of q.choices.entries()){
   if(c.id!==section+"-"+q.number+"-"+(i===0?"A":"B")||ids.has(c.id)||
   !Object.hasOwn(levels,c.sloCode)||c.cognitiveLevel!==levels[c.sloCode]||
   c.assessment!=="summative-theory"||!c.prompt||c.sourcePage<79||c.sourcePage>83)
    throw Error("Invalid source SLO/choice "+c.id);
   ids.add(c.id);
  }
  if(q.choices[0].sloCode!==q.choices[1].sloCode)
   throw Error("Unbalanced OR-choice SLO pair");
 }
 for(const a of k.answers){
  const no=Number(a.choiceId?.split("-")[1]),required=no<=7?4:6;
  if(!ids.has(a.choiceId)||keyed.has(a.choiceId)||a.marking?.length!==required||
   a.marking.reduce((sum,item)=>sum+item.marks,0)!==required||
   a.marking.some(item=>item.marks!==1||typeof item.text!=="string"||item.text.length<25)||
   !a.teacherNotes)throw Error("Invalid worked solution or mark total "+a.choiceId);
  keyed.add(a.choiceId);
 }
 if(ids.size!==18||keyed.size!==18)throw Error("Missing source/key pair");
}
function render(){
 const rows=[],cards=[],map=new Map(key.answers.map(a=>[a.choiceId,a]));
 for(const q of [...student.sectionB,...student.sectionC]){
  const tr=el("tr");for(const value of ["Q"+q.number,"A OR B",q.marks,q.choices[0].sloCode,q.choices[0].cognitiveLevel])tr.append(el("td","",value));rows.push(tr);
  for(const c of q.choices){
   const a=map.get(c.id),card=el("article","solution-card");card.dataset.choice=c.id;
   card.append(el("h3","", "Question "+q.number+" · Option "+c.label+" · "+q.marks+" marks"),
    el("div","tag",c.sloCode+" · "+c.cognitiveLevel+" · "+c.kind+" · NBF p. "+c.sourcePage),
    el("p","prompt",c.prompt));
   const list=el("ol","steps");
   for(const item of a.marking){const li=el("li");li.append(el("span","",item.text+" "),el("span","points","["+item.marks+" mark]"));list.append(li);}
   card.append(list,el("p","teacherNote","Teacher marking note: "+a.teacherNotes));
   cards.push(card);
  }
 }
 $("rubricSummary").replaceChildren(...rows);
 $("teacherSolutions").replaceChildren(...cards);
}
function show(){
 if(!student||!key)return;
 if(!visible)render();
 visible=true;$("teacherContent").hidden=false;
 $("revealSolutions").disabled=true;$("hideSolutions").disabled=false;$("printSolutions").disabled=false;
 $("revealStatus").textContent="18 model solutions revealed · 7 short OR pairs + 2 extended OR pairs";
}
function hide(){
 visible=false;$("teacherContent").hidden=true;
 $("rubricSummary").replaceChildren();$("teacherSolutions").replaceChildren();
 $("revealSolutions").disabled=false;$("hideSolutions").disabled=true;$("printSolutions").disabled=true;
 $("revealStatus").textContent="Solutions hidden · no answer cards rendered";
}
function get(path){return fetch(root+path,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status+" for "+path);return r.json();});}
$("revealSolutions").addEventListener("click",show);
$("hideSolutions").addEventListener("click",hide);
$("printSolutions").addEventListener("click",()=>{if(visible)window.print();});
Promise.all([get("unit-05-v52-descriptive-student.json"),get("unit-05-v52-descriptive-teacher-key.json")]).then(([s,k])=>{
 validate(s,k);student=s;key=k;
 $("teacherStatus").textContent="Ready · 18 independently mapped public worked alternatives checked · no answer cards displayed until reveal";
 $("revealSolutions").disabled=false;
}).catch(e=>{
 $("teacherStatus").textContent="Could not load worked key: "+e.message;
 $("revealSolutions").disabled=true;
});
})();