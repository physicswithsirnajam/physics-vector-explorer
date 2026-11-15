/*
 * V46 — Grade XI Unit 4 post-practice teacher discussions.
 * Deliberately separate public page from the V45 student timed projector.
 * One unmarked question, then one explicitly revealed source-keyed solution.
 * No clock, no answer collection, no authentication, no grade data writes.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const url="../question-bank/grade-11/unit-04-v39-80-practice.json";
const SLO=new Set(["P-11-B-07","P-11-B-08","P-11-B-09","P-11-B-10","P-11-B-14","P-11-B-15","P-11-B-16","P-11-B-17","P-11-B-18","P-11-B-19","P-11-B-20","P-11-B-21"]);
const levels=new Set(["Knowledge","Understanding","Application"]);
let questions=null,groups=null,index=-1,phase="question";
const selectedSlo=new URLSearchParams(location.search).get("slo");
const focused=selectedSlo!==null;
function make(tag,cls,text){
 const e=document.createElement(tag);
 if(cls)e.className=cls;
 if(text!==undefined)e.textContent=String(text);
 return e;
}
function validate(data){
 if(!data||data.schemaVersion!==1||data.status!=="practice-pilot"||
   data.questions?.length!==80||data.structure?.straight!==56||
   data.structure?.scenario!==24||data.structure?.scenarioSets!==6||
   data.structure?.scenarioQuestionsPerSet!==4||
   data.structure?.marksPerQuestion!==.5||data.structure?.totalPracticeMarks!==40)
  throw Error("Unexpected Unit 4 provisional MCQ bank");
 const seen=new Set(),scenarios=new Map(),answers={A:0,B:0,C:0,D:0};
 for(const [i,q] of data.questions.entries()){
  if(!q.id||seen.has(q.id)||q.sourceQuestionNumber!==i+1||
    q.grade!==11||q.unit!==4||q.assessmentClassification!=="summative-theory"||
    q.boardEligible!==false||q.sloCodes?.length!==1||!SLO.has(q.sloCodes[0])||
    !q.stem||!q.topic||!levels.has(q.cognitiveLevel)||
    !q.explanation||q.explanation.length<20||
    q.options?.length!==4||q.options.map(o=>o.id).join("")!=="ABCD"||
    q.options.some(o=>!o.text)||new Set(q.options.map(o=>o.text)).size!==4||
    !q.options.some(o=>o.id===q.correctOptionId)||
    !Number.isInteger(q.source?.textbookPage)||
    q.source.textbookPage<53||q.source.textbookPage>76)
    throw Error("Invalid source MCQ "+(i+1));
  seen.add(q.id);answers[q.correctOptionId]++;
  if(i<56){
   if(q.scenarioSetId||q.stimulusText)throw Error("Unexpected scenario in straight MCQs");
  }else{
   if(!q.scenarioSetId||!q.scenarioTitle||!q.stimulusText||
     q.scenarioIndex<1||q.scenarioIndex>4)
    throw Error("Missing situation for MCQ "+(i+1));
   if(!scenarios.has(q.scenarioSetId))scenarios.set(q.scenarioSetId,[]);
   scenarios.get(q.scenarioSetId).push(q);
  }
 }
 if(Object.values(answers).some(n=>n!==20))throw Error("Unbalanced source answer positions");
 if(scenarios.size!==6||[...scenarios.values()].some(items=>
  items.length!==4||items.map(q=>q.scenarioIndex).join(",")!=="1,2,3,4"||
  new Set(items.map(q=>q.stimulusText)).size!==1))
  throw Error("Six complete source-based scenario groups required");
 return scenarios;
}
function teachingPrompt(level,topic){
 if(level==="Knowledge")return "Teacher discussion: Ask learners to recall the definition or relation for "+topic+
  ", then explain why the keyed option matches it.";
 if(level==="Understanding")return "Teacher discussion: Ask students to describe the physical reasoning behind "+topic+
  " and compare the keyed option with one plausible distractor.";
 return "Teacher discussion: Rework the numerical or physical application for "+topic+
  ", check quantities and units, and identify where an incorrect option could come from.";
}
function context(q){
 const pane=$("contextPane"),badge=$("scenarioBadge");
 if(!q.scenarioSetId){
  pane.hidden=true;badge.hidden=true;
  $("contextHeading").textContent="";$("contextText").textContent="";badge.textContent="";
  return;
 }
 const setNo=[...groups.keys()].indexOf(q.scenarioSetId)+1;
 pane.hidden=false;badge.hidden=false;
 badge.textContent="Situation "+setNo+" / 6 · item "+q.scenarioIndex+" / 4";
 $("contextHeading").textContent="Situation "+setNo+" — "+q.scenarioTitle;
 $("contextText").textContent=q.stimulusText;
}
function paintOptions(q,showAnswer){
 const nodes=q.options.map(opt=>{
  const isCorrect=showAnswer&&opt.id===q.correctOptionId;
  const item=make("div","option"+(isCorrect?" correct":""));
  const circle=make("span","letter",opt.id),label=make("span","option-text",opt.text);
  item.append(circle,label);
  if(isCorrect)item.append(make("span","correct-label","Correct"));
  return item;
 });
 $("optionGrid").replaceChildren(...nodes);
}
function paint(){
 if(index<0||!questions)return;
 const q=questions[index],reveal=phase==="solution";
 $("stepIndex").textContent="Discussion "+(index*2+(reveal?2:1))+" / "+(questions.length*2);
 $("questionIndex").textContent="Q "+q.sourceQuestionNumber+" / 80"+(focused?" · focus "+(index+1)+" / "+questions.length:"");
 $("focusBadge").hidden=!focused;
 $("focusBadge").textContent=focused?selectedSlo+" · "+questions.length+" MCQs":"";
 $("phaseLabel").textContent=reveal?"Worked solution":"Question only";
 $("questionText").textContent=q.stem;
 context(q);paintOptions(q,reveal);
 $("solutionPanel").hidden=!reveal;
 if(reveal){
  const correct=q.options.find(o=>o.id===q.correctOptionId);
  $("solutionHeading").textContent="Correct option "+correct.id+" — "+correct.text;
  $("solutionExplanation").textContent=q.explanation;
  $("solutionMeta").textContent="SLO: "+q.sloCodes[0]+" · Cognitive level: "+q.cognitiveLevel+
   " · Topic: "+q.topic+" · NBF printed p. "+q.source.textbookPage+" · 0.5 practice mark";
  $("discussionPrompt").textContent=teachingPrompt(q.cognitiveLevel,q.topic);
  $("teacherNotice").textContent="Teacher key visible — discuss the reasoning, then proceed to the next question.";
 }else{
  $("solutionHeading").textContent="";
  $("solutionExplanation").textContent="";
  $("solutionMeta").textContent="";
  $("discussionPrompt").textContent="";
  $("teacherNotice").textContent="Question-only view — select Reveal worked solution when ready.";
 }
 $("progressLabel").textContent=reveal?"Worked solution "+(index+1)+" / "+questions.length:"Question "+(index+1)+" / "+questions.length;
 $("jumpInput").value=String(q.sourceQuestionNumber);
 $("prevBtn").disabled=index===0&&!reveal;
 $("revealBtn").disabled=reveal;
 $("hideBtn").disabled=!reveal;
 $("nextBtn").disabled=!reveal||index>=questions.length-1;
 $("nextBtn").textContent=index===questions.length-1?"Discussion complete":"Next question";
 $("jumpInput").disabled=false;
 $("jumpBtn").disabled=false;
 $("startBtn").textContent=focused?"Restart focused discussion":"Restart at Q1";
}
function openQuestion(newIndex){
 if(!questions||newIndex<0||newIndex>=questions.length)return;
 index=newIndex;phase="question";paint();
}
function showSolution(){
 if(index<0||phase!=="question")return;
 phase="solution";paint();
}
function hideSolution(){
 if(index<0||phase!=="solution")return;
 phase="question";paint();
}
function nextQuestion(){
 if(index<0||phase!=="solution")return;
 if(index>=questions.length-1){
  $("teacherNotice").textContent="All "+questions.length+" selected question/solution pairs completed; close this public teacher discussion page before another assessment.";
  return;
 }
 openQuestion(index+1);
}
function previous(){
 if(index<0)return;
 if(phase==="solution")hideSolution();
 else if(index>0)openQuestion(index-1);
}
function jump(){
 if(index<0)return;
 const raw=$("jumpInput").value.trim(),number=Number(raw);
 if(!raw||!Number.isInteger(number)||number<1||number>80){
  $("teacherNotice").textContent="Enter a whole-number question between 1 and 80.";
  return;
 }
 const targetIndex=questions.findIndex(q=>q.sourceQuestionNumber===number);
 if(targetIndex===-1){
  $("teacherNotice").textContent="Q"+number+" is outside this SLO-focused discussion. Choose a listed original question number.";
  return;
 }
 openQuestion(targetIndex); // Always hide the answer on a jump.
}
async function fullscreen(){
 try{
  if(document.fullscreenElement)await document.exitFullscreen();
  else if($("stageShell").requestFullscreen)await $("stageShell").requestFullscreen();
  else $("teacherNotice").textContent="Fullscreen is not supported here. Open in a new tab.";
 }catch(err){
  $("teacherNotice").textContent="Fullscreen may be restricted inside Google Sites. Open this page in a new tab.";
 }
}
$("startBtn").addEventListener("click",()=>{
 if(!questions)return;
 if(index>=0&&!window.confirm("Restart the teacher discussion at Question 1?"))return;
 openQuestion(0);
});
$("revealBtn").addEventListener("click",showSolution);
$("hideBtn").addEventListener("click",hideSolution);
$("nextBtn").addEventListener("click",nextQuestion);
$("prevBtn").addEventListener("click",previous);
$("jumpBtn").addEventListener("click",jump);
$("fullscreenBtn").addEventListener("click",fullscreen);
document.addEventListener("fullscreenchange",()=>{
 $("fullscreenBtn").textContent=document.fullscreenElement?"Exit fullscreen":"Fullscreen";
});
document.addEventListener("keydown",event=>{
 if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||index<0)return;
 const target=event.target;
 if(target&&(target.isContentEditable||["INPUT","TEXTAREA","SELECT","BUTTON"].includes(target.tagName)))return;
 if(event.key==="ArrowLeft"){event.preventDefault();previous();}
 else if(event.key==="ArrowRight"){event.preventDefault();nextQuestion();}
 else if(event.key.toLowerCase()==="f"){event.preventDefault();fullscreen();}
});
fetch(url,{cache:"no-store"}).then(response=>{
 if(!response.ok)throw Error("HTTP "+response.status);
 return response.json();
}).then(data=>{
 groups=validate(data);
 if(focused&&!SLO.has(selectedSlo))throw Error("Invalid summative Unit 4 SLO requested");
 questions=focused?data.questions.filter(q=>q.sloCodes[0]===selectedSlo):data.questions;
 if(!questions.length)throw Error("No provisional MCQs map to this SLO");
 $("startBtn").disabled=false;
 $("fullscreenBtn").disabled=false;
 $("loadStatus").textContent=focused?
  "Ready · "+selectedSlo+" · "+questions.length+" question/solution pairs · "+(questions.length*2)+" deliberate steps · public discussion":
  "Ready · 80 question/solution pairs · 160 deliberate steps · teacher discussion only";
}).catch(error=>{
 $("loadStatus").textContent="Unable to load discussion bank: "+error.message;
 $("teacherNotice").textContent="Solutions cannot be shown until the original source bank passes validation.";
});
})();