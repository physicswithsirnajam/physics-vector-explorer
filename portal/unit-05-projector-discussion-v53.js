/* V53: Unit 5 teacher-led projector discussion.
 * Reads existing V52 student prompts; public teacher key is requested only
 * on a deliberate Reveal click. Nothing is submitted or persisted.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const root="../question-bank/grade-11/";
const source=root+"unit-05-v52-descriptive-student.json";
const teacherSource=root+"unit-05-v52-descriptive-teacher-key.json";
const levels={"P-11-B-29":"Application","P-11-B-30":"Application","P-11-B-31":"Understanding","P-11-B-32":"Application"};
let questions=[],student=null,teacher=null,loadingKey=null;
let index=0,choiceIndex=0,step=0,revision=0,working=false;
function el(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=String(text);return node;}
function validateStudent(s){
 if(!s||s.grade!==11||s.unit!==5||s.schemaVersion!==1||s.officialBoardPaper!==false||
 s.status!=="provisional-teacher-review-pending"||s.pattern?.totalMarks!==40||
 s.pattern?.unitOnly!==true||s.pattern?.fullSyllabusPaper!==false||
 s.sectionB?.length!==7||s.sectionC?.length!==2||
 s.pattern?.alternatives!==18)throw Error("Unexpected V52 question blueprint");
 const arr=[...s.sectionB,...s.sectionC],ids=new Set();
 for(let i=0;i<arr.length;i++){
  const q=arr[i],section=i<7?"B":"C",marks=i<7?4:6;
  if(q.number!==i+1||q.section!==section||q.marks!==marks||q.choices?.length!==2)
   throw Error("Incorrect question number, OR or marks");
  for(let alt=0;alt<2;alt++){
   const c=q.choices[alt],expected=section+"-"+q.number+"-"+(alt===0?"A":"B");
   if(c.id!==expected||ids.has(c.id)||!Object.hasOwn(levels,c.sloCode)||
   c.cognitiveLevel!==levels[c.sloCode]||c.assessment!=="summative-theory"||
   !c.prompt||c.sourcePage<79||c.sourcePage>83)throw Error("Invalid source-mapped choice "+expected);
   ids.add(c.id);
  }
  if(q.choices[0].sloCode!==q.choices[1].sloCode)throw Error("Unbalanced OR SLO "+q.number);
 }
 if(ids.size!==18)throw Error("Expected eighteen original question choices");
 return arr;
}
function validateTeacher(k){
 if(!student||!k||k.grade!==11||k.unit!==5||k.schemaVersion!==1||
 k.status!=="provisional-teacher-review-pending"||k.publicResource!==true||
 k.notSecured!==true||k.officialFBISEKey!==false||
 k.companionStudentBank!=="unit-05-v52-descriptive-student.json"||
 k.totalPaperMarks!==40||k.totalChoices!==18||k.totalOrPairs!==9||
 k.answers?.length!==18)throw Error("Teacher key provenance / number mismatch");
 const lookup=new Map(k.answers.map(a=>[a.choiceId,a]));
 if(lookup.size!==18)throw Error("Duplicate solution alternative");
 for(const q of questions)for(const c of q.choices){
  const answer=lookup.get(c.id);
  if(!answer||answer.marking?.length!==q.marks||
    answer.marking.some(m=>m.marks!==1||typeof m.text!=="string"||m.text.length<20)||
    answer.marking.reduce((sum,m)=>sum+m.marks,0)!==q.marks||
    typeof answer.teacherNotes!=="string"||!answer.teacherNotes)
   throw Error("Missing or invalid 4/6-mark model steps for "+c.id);
 }
 return lookup;
}
function clearWorking(){
 revision++;step=0;working=false;
 $("solutionSteps").replaceChildren();$("teacherInsight").textContent="";
 $("teacherInsight").hidden=true;
 $("revealStatus").textContent="Solutions hidden. Discuss the question first.";
 $("hideSteps").disabled=true;
}
function render(){
 if(!questions.length)return;
 clearWorking();
 const q=questions[index],c=q.choices[choiceIndex];
 const alt=choiceIndex?"B":"A",section=q.section;
 $("slideKicker").textContent="Section "+section+" · Question "+q.number+" · "+alt+" · Teacher-led discussion";
 $("slideTitle").textContent="Question "+q.number+" — "+(section==="B"?"Short / Numerical":"Extended / Numerical")+" Response";
 $("slideCount").textContent=(index+1)+" / "+questions.length;
 $("questionMeta").textContent=c.sloCode+" · "+c.cognitiveLevel+" · NBF printed p. "+c.sourcePage+" · "+q.marks+" marks · "+c.kind;
 $("questionText").textContent=c.prompt;
 $("optionA").setAttribute("aria-pressed",String(choiceIndex===0));
 $("optionB").setAttribute("aria-pressed",String(choiceIndex===1));
 $("stepCounter").textContent="0 / "+q.marks+" steps";
 $("previousQuestion").disabled=index===0;
 $("nextQuestion").disabled=index===questions.length-1;
 $("questionPicker").value=String(index);
 $("revealStep").disabled=false;
 $("printSlide").disabled=false;
 $("revealStep").textContent="Reveal next step (1 mark)";
}
async function loadKey(){
 if(teacher)return teacher;
 if(!loadingKey)loadingKey=fetch(teacherSource,{cache:"no-store"}).then(r=>{
  if(!r.ok)throw Error("Public teacher key HTTP "+r.status);
  return r.json();
 }).then(k=>{validateTeacher(k);teacher=k;return k;}).finally(()=>{loadingKey=null;});
 return loadingKey;
}
async function reveal(){
 if(!questions.length||working)return;
 const token=revision,q=questions[index],c=q.choices[choiceIndex];working=true;
 $("revealStep").disabled=true;
 $("revealStatus").textContent=teacher?"Preparing next one-mark reasoning step…":"Loading public worked key on explicit teacher request…";
 try{
  const key=await loadKey();
  if(token!==revision)return;
  const answer=key.answers.find(x=>x.choiceId===c.id);
  if(!answer)throw Error("No teacher solution for "+c.id);
  if(step<answer.marking.length){
   const item=answer.marking[step];
   $("solutionSteps").append(el("li","",item.text));
   step++;
  }
  $("stepCounter").textContent=step+" / "+q.marks+" steps";
  $("hideSteps").disabled=false;
  if(step===answer.marking.length){
   $("teacherInsight").textContent="Teacher discussion note: "+answer.teacherNotes;
   $("teacherInsight").hidden=false;
   $("revealStatus").textContent="All "+q.marks+" one-mark steps shown. Award marks for one chosen OR alternative only.";
   $("revealStep").textContent="All steps revealed";
   $("revealStep").disabled=true;
  }else{
   $("revealStatus").textContent=step+" of "+q.marks+" one-mark steps visible; continue discussion.";
   $("revealStep").textContent="Reveal next step (1 mark)";
   $("revealStep").disabled=false;
  }
 }catch(err){
  if(token===revision){
   $("revealStatus").textContent="Cannot display worked steps: "+err.message;
   $("revealStep").disabled=false;
  }
 }finally{working=false;}
}
function changeQuestion(n){if(n<0||n>=questions.length)return;index=n;render();}
$("previousQuestion").addEventListener("click",()=>changeQuestion(index-1));
$("nextQuestion").addEventListener("click",()=>changeQuestion(index+1));
$("questionPicker").addEventListener("change",e=>changeQuestion(Number(e.target.value)));
$("optionA").addEventListener("click",()=>{choiceIndex=0;render();});
$("optionB").addEventListener("click",()=>{choiceIndex=1;render();});
$("revealStep").addEventListener("click",reveal);
$("hideSteps").addEventListener("click",()=>{clearWorking();$("stepCounter").textContent="0 / "+questions[index].marks+" steps";$("revealStep").disabled=false;$("revealStep").textContent="Reveal next step (1 mark)";});
$("printSlide").addEventListener("click",()=>{if(questions.length)window.print();});
$("presentationToggle").addEventListener("click",()=>{
 const on=document.body.classList.toggle("focus-mode");
 $("presentationToggle").setAttribute("aria-pressed",String(on));
 $("presentationToggle").textContent=on?"Exit focus / projector view":"Focus / projector view";
});
document.addEventListener("keydown",e=>{
 if(!questions.length||e.altKey||e.ctrlKey||e.metaKey||["INPUT","SELECT","TEXTAREA"].includes(document.activeElement?.tagName))return;
 if(e.key==="Escape"&&!$("hideSteps").disabled){$("hideSteps").click();}
 if(e.key==="ArrowLeft"){e.preventDefault();changeQuestion(index-1);}
 if(e.key==="ArrowRight"){e.preventDefault();changeQuestion(index+1);}
});
fetch(source,{cache:"no-store"}).then(r=>{
 if(!r.ok)throw Error("Student questions HTTP "+r.status);
 return r.json();
}).then(s=>{
 questions=validateStudent(s);student=s;
 for(let i=0;i<questions.length;i++){
  const option=el("option","",String(i+1)+" · "+(i<7?"Section B":"Section C"));
  option.value=String(i);$("questionPicker").append(option);
 }
 ["questionPicker","optionA","optionB"].forEach(id=>$(id).disabled=false);
 $("loadStatus").textContent="Ready · 9 OR question pairs · 18 alternatives · 80 one-mark model steps · public key not loaded";
 render();
}).catch(err=>{
 $("loadStatus").textContent="Unable to load original Unit 5 questions: "+err.message;
 $("questionText").textContent="Question bank unavailable. Please retry when the resource is accessible.";
});
})();
