/*
 * V45: projector-friendly, teacher-paced, student-facing Unit 4 MCQs.
 * Fetches the original provisional public bank. Correct answer/explanation fields
 * are validated but NEVER rendered. No storage, score, authentication or grade writes.
 * Uses performance.now() deadlines so a throttled interval does not drift.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const source="../question-bank/grade-11/unit-04-v39-80-practice.json";
const SLO=new Set(["P-11-B-07","P-11-B-08","P-11-B-09","P-11-B-10",
 "P-11-B-14","P-11-B-15","P-11-B-16","P-11-B-17","P-11-B-18",
 "P-11-B-19","P-11-B-20","P-11-B-21"]);
let questions=null,groups=null,index=-1;
let running=false,started=false,completed=false;
let duration=50,remaining=50,deadline=0,intervalId=null;
function node(tag,cls,value){
 const el=document.createElement(tag);
 if(cls)el.className=cls;
 if(value!==undefined)el.textContent=String(value);
 return el;
}
function verify(data){
 if(!data||data.schemaVersion!==1||data.status!=="practice-pilot"||
    data.questions?.length!==80||data.structure?.straight!==56||
    data.structure?.scenario!==24||data.structure?.scenarioSets!==6||
    data.structure?.scenarioQuestionsPerSet!==4||data.structure?.marksPerQuestion!==.5||
    data.structure?.totalPracticeMarks!==40)
  throw Error("Unit 4 source bank does not match the 80-MCQ practice format");
 const sets=new Map(),seen=new Set(),letters={A:0,B:0,C:0,D:0};
 for(const [i,q] of data.questions.entries()){
  if(!q.id||seen.has(q.id)||q.grade!==11||q.unit!==4||
    q.sourceQuestionNumber!==i+1||q.boardEligible!==false||
    q.assessmentClassification!=="summative-theory"||
    q.sloCodes?.length!==1||!SLO.has(q.sloCodes[0])||
    !q.stem||q.options?.length!==4||
    q.options.map(o=>o.id).join("")!=="ABCD"||
    q.options.some(o=>!o.text)||new Set(q.options.map(o=>o.text)).size!==4||
    !q.options.some(o=>o.id===q.correctOptionId)||!q.explanation)
   throw Error("Invalid MCQ at Q"+(i+1));
  seen.add(q.id);letters[q.correctOptionId]++;
  if(i<56){if(q.scenarioSetId||q.stimulusText)throw Error("Straight MCQ has scenario");}
  else {
   if(!q.scenarioSetId||!q.scenarioTitle||!q.stimulusText||
      q.scenarioIndex<1||q.scenarioIndex>4)throw Error("Incomplete scenario Q"+(i+1));
   if(!sets.has(q.scenarioSetId))sets.set(q.scenarioSetId,[]);
   sets.get(q.scenarioSetId).push(q);
  }
 }
 if(Object.values(letters).some(n=>n!==20))throw Error("Unexpected source answer-key balance");
 if(sets.size!==6||[...sets.values()].some(questions=>
   questions.length!==4||questions.map(q=>q.scenarioIndex).join(",")!=="1,2,3,4"||
   new Set(questions.map(q=>q.stimulusText)).size!==1))
  throw Error("Scenario groups need six complete 4-question stimuli");
 return sets;
}
function questionDuration(q){
 const setting=$("paceSelect").value;
 if(setting!=="adaptive")return Number(setting);
 const textLength=q.stem.length+q.options.reduce((n,o)=>n+o.text.length,0);
 if(q.scenarioSetId)return textLength+q.stimulusText.length>660?90:75;
 return textLength>300?75:textLength>170?60:45;
}
function stopClock(){
 if(intervalId!==null){clearInterval(intervalId);intervalId=null;}
 running=false;
}
function note(message){$("timerState").textContent=message;}
function updateTime(){
 $("secondsRemaining").textContent=String(remaining);
 $("timePreset").textContent=duration+"-second question";
 const percent=duration>0?Math.max(0,Math.min(100,100*remaining/duration)):0;
 $("progressBar").style.width=percent+"%";
 $("progress").setAttribute("aria-valuenow",String(Math.round(percent)));
}
function updateControls(){
 $("prevBtn").disabled=!started||index<=0;
 $("nextBtn").disabled=!started||completed;
 $("nextBtn").textContent=index===79?"Finish presentation":"Next →";
 $("pauseBtn").disabled=!started||completed||(!running&&remaining<=0);
 $("pauseBtn").textContent=running?"Pause timer":"Resume timer";
 $("resetBtn").disabled=!started;
 $("startBtn").textContent=started?"Restart at Q1":"Start presentation";
 $("jumpBtn").disabled=!started;
 $("jumpInput").disabled=!started;
}
function paintSlide(q){
 $("slideIndex").textContent="Q "+q.sourceQuestionNumber+" / 80";
 $("questionType").textContent=q.scenarioSetId?"Scenario MCQ":"Independent MCQ";
 $("sloLabel").textContent=q.sloCodes[0];
 const pane=$("scenarioPane"),lab=$("scenarioLabel");
 if(q.scenarioSetId){
  const setIndex=[...groups.keys()].indexOf(q.scenarioSetId)+1;
  pane.hidden=false;lab.hidden=false;
  lab.textContent="Situation "+setIndex+" / 6 · part "+q.scenarioIndex+" / 4";
  $("scenarioHeading").textContent="Situation "+setIndex+" — "+q.scenarioTitle;
  $("scenarioText").textContent=q.stimulusText;
 }else{
  pane.hidden=true;lab.hidden=true;
  $("scenarioHeading").textContent="";
  $("scenarioText").textContent="";
  lab.textContent="";
 }
 $("questionText").textContent=q.stem;
 const items=q.options.map(o=>{
  const item=node("div","option");
  item.append(node("span","letter",o.id),node("span","option-text",o.text));
  return item;
 });
 $("answersGrid").replaceChildren(...items);
 $("jumpInput").value=String(q.sourceQuestionNumber);
}
function showSlide(nextIndex,autoPlay){
 if(!questions||nextIndex<0||nextIndex>=80)return;
 stopClock();
 index=nextIndex;completed=false;started=true;
 const q=questions[index];
 duration=questionDuration(q);remaining=duration;
 paintSlide(q);updateTime();updateControls();
 if(autoPlay)play();
 else note("Paused on question "+(index+1)+". Press Resume timer when ready.");
}
function finish(){
 stopClock();completed=true;remaining=0;
 updateTime();updateControls();
 note("Presentation complete — all 80 Unit 4 questions shown. Use the separate teacher key for discussion.");
}
function tick(){
 if(!running)return;
 const left=deadline-performance.now();
 const value=Math.max(0,Math.ceil(left/1000));
 if(value!==remaining){remaining=value;updateTime();}
 if(left<=0){
  stopClock();remaining=0;updateTime();
  if($("autoAdvance").checked){
   if(index===79)finish();
   else showSlide(index+1,true);
  }else{
   note("Time is up on Q"+(index+1)+". Press Next → when the class is ready.");
   updateControls();
  }
 }
}
function play(){
 if(!started||completed||remaining<=0||running)return;
 deadline=performance.now()+remaining*1000;
 running=true;
 intervalId=setInterval(tick,150);
 note("Timer running — mark one choice on your blank OMR-style practice sheet.");
 updateControls();
}
function pause(message){
 if(!running)return;
 remaining=Math.max(0,Math.ceil((deadline-performance.now())/1000));
 stopClock();
 updateTime();updateControls();
 note(message||"Timer paused. Press Resume timer to continue.");
}
function move(delta){
 if(!started)return;
 const n=index+delta;
 if(n>=80){finish();return;}
 if(n<0)return;
 const continueTimer=running;
 showSlide(n,continueTimer);
}
function resetQuestion(){
 if(!started)return;
 showSlide(index,false);
 note("Question timer reset. Press Resume timer when you are ready.");
}
function jump(){
 if(!started)return;
 const raw=$("jumpInput").value.trim(),number=Number(raw);
 if(!raw||!Number.isInteger(number)||number<1||number>80){
  note("Enter a whole-number question from 1 to 80.");
  return;
 }
 const continueTimer=running;
 showSlide(number-1,continueTimer);
}
async function fullscreen(){
 try{
  if(document.fullscreenElement)await document.exitFullscreen();
  else if($("stageShell").requestFullscreen)await $("stageShell").requestFullscreen();
  else note("This browser does not support fullscreen. You can still use the projector view.");
 }catch(error){
  note("Fullscreen unavailable in this browser or embed. Use the open-in-new-tab view.");
 }
}
function restart(){
 if(!questions)return;
 if(started&&!window.confirm("Restart from question 1? The countdown will reset."))return;
 showSlide(0,true);
}
$("startBtn").addEventListener("click",restart);
$("prevBtn").addEventListener("click",()=>move(-1));
$("nextBtn").addEventListener("click",()=>move(1));
$("pauseBtn").addEventListener("click",()=>running?pause():play());
$("resetBtn").addEventListener("click",resetQuestion);
$("jumpBtn").addEventListener("click",jump);
$("fullscreenBtn").addEventListener("click",fullscreen);
document.addEventListener("fullscreenchange",()=>{
 $("fullscreenBtn").textContent=document.fullscreenElement?"Exit fullscreen":"Fullscreen";
});
$("paceSelect").addEventListener("change",()=>{
 if(started) {
  showSlide(index,false);
  note("Timing changed to "+$("paceSelect").selectedOptions[0].text+". Press Resume timer.");
 }else{
  duration=questionDuration({stem:"",options:[],scenarioSetId:null});
  remaining=duration;updateTime();
 }
});
document.addEventListener("visibilitychange",()=>{
 if(document.hidden&&running)pause("Paused when this tab became hidden. Press Resume timer to continue.");
});
document.addEventListener("keydown",event=>{
 if(event.altKey||event.ctrlKey||event.metaKey||event.repeat)return;
 const target=event.target;
 if(target&&(target.isContentEditable||["INPUT","SELECT","TEXTAREA","BUTTON"].includes(target.tagName)))return;
 if(!started)return;
 if(event.key==="ArrowRight"){event.preventDefault();move(1);}
 else if(event.key==="ArrowLeft"){event.preventDefault();move(-1);}
 else if(event.key===" "){event.preventDefault();running?pause():play();}
 else if(event.key.toLowerCase()==="f"){event.preventDefault();fullscreen();}
});
fetch(source,{cache:"no-store"}).then(response=>{
 if(!response.ok)throw Error("HTTP "+response.status);
 return response.json();
}).then(data=>{
 groups=verify(data);questions=data.questions;
 duration=50;remaining=50;updateTime();
 $("startBtn").disabled=false;
 $("fullscreenBtn").disabled=false;
 $("loadStatus").textContent="Ready · 80 source-verified MCQs · 56 independent + 24 scenario · 12 summative SLOs";
}).catch(error=>{
 $("loadStatus").textContent="Unable to load this provisional question bank: "+error.message;
 note("Presentation disabled until source bank passes validation.");
});
})();
