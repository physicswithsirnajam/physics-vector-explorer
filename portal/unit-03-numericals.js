/* Physics with Sir Najam — textbook numerical solution and practice renderer.
 * Public read-only maths, no persistent storage or student account access.
 */
(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  let bank=null,printState=null;
  const create=(tag,className,text)=>{
    const element=document.createElement(tag);
    if(className)element.className=className;
    if(text!==undefined)element.textContent=String(text);
    return element;
  };
  function check(data){
    if(data?.schemaVersion!==1||data?.status!=="teacher-review-pending"||
       !Array.isArray(data.numericals)||data.numericals.length!==8)throw Error("Unexpected Unit 3 numerical data");
    const found=new Set();
    for(const [i,n] of data.numericals.entries()){
      if(n.sourceExercise!=="Numerical 3."+(i+1)||
         n.id!=="XI-U03-N-3."+(i+1)||found.has(n.id)||
         ![51,52].includes(n.sourcePage)||n.question.length<20||
         !n.answer||!n.given||!Array.isArray(n.steps)||
         n.steps.reduce((t,s)=>t+s.marks,0)!==n.practiceMarks)throw Error("Numerical "+(i+1)+" failed checks");
      found.add(n.id);
    }
    if(data.numericals.filter(n=>n.assessment==="summative").length!==6||
       data.numericals.filter(n=>n.assessment!=="summative").length!==2)throw Error("Formative/summative exercise classification incorrect");
  }
  function exercise(n){
    const article=create("article","problem");
    article.id=n.id;
    const top=create("div","top");
    top.append(create("h3","",n.sourceExercise),
      create("span","badge "+(n.assessment==="summative"?"":"formative"),n.assessment==="summative"?"Summative aligned":"Formative / supplementary"));
    article.appendChild(top);
    article.appendChild(create("p","",n.question));
    article.appendChild(create("div","given","Given: "+n.given));
    const meta=create("p","source","Textbook p. "+n.sourcePage+" · SLO: "+(n.slo||"Cross-topic supplementary")+
      " · suggested practice marks: "+n.practiceMarks+" (not official)");
    article.appendChild(meta);
    const details=create("details"),summary=create("summary","","Show solution and suggested marking ("+n.practiceMarks+" marks)");
    const answer=create("div","answer"),steps=create("ol");
    for(const step of n.steps){
      const item=create("li");
      item.append(create("span","",step.text),create("span","marks","  ["+step.marks+" mark"+(step.marks===1?"":"s")+"]"));
      steps.appendChild(item);
    }
    answer.appendChild(steps);
    answer.appendChild(create("p","final-answer","Final answer: "+n.answer));
    answer.appendChild(create("p","source","Textbook printed answer: "+n.sourceAnswer));
    answer.appendChild(create("p","note",n.note));
    details.append(summary,answer);
    article.appendChild(details);
    const answerSpace=create("div","answer-space");
    answerSpace.setAttribute("aria-hidden","true");
    article.appendChild(answerSpace);
    return article;
  }
  /* V103: number-specific textbook links can arrive before the source
   * exercise JSON finishes loading. Revisit URL fragments after rendering.
   * No edits to questions, answers, printing or assessment logic. */
  function revealReferencedExercise(){
    let id;
    try{id=decodeURIComponent(window.location.hash.slice(1))}catch{return}
    if(!id || !/^XI-U03-N-3\.[1-8]$/.test(id))return;
    const target=document.getElementById(id);
    if(target){
      target.style.scrollMarginTop="5rem"; // retain heading below sticky global navigation
      requestAnimationFrame(()=>target.scrollIntoView({block:"start"}));
    }
  }
  window.addEventListener("hashchange",revealReferencedExercise);
  function allDetails(){return [...document.querySelectorAll(".problem details")]}
  function print(teacher){
    if(!bank)return;
    printState=allDetails().map(d=>d.open);
    document.body.classList.toggle("print-teacher",teacher);
    if(teacher)allDetails().forEach(d=>d.open=true);
    window.print();
  }
  window.addEventListener("afterprint",()=>{
    document.body.classList.remove("print-teacher");
    if(printState){
      const all=allDetails();
      all.forEach((d,i)=>d.open=printState[i]);
      printState=null;
    }
  });
  $("revealAll").addEventListener("click",()=>allDetails().forEach(d=>d.open=true));
  $("hideAll").addEventListener("click",()=>allDetails().forEach(d=>d.open=false));
  $("printQuestions").addEventListener("click",()=>print(false));
  $("printSolutions").addEventListener("click",()=>print(true));
  fetch("../question-bank/grade-11/unit-03-textbook-numericals.json",{cache:"no-store"})
  .then(response=>{
    if(!response.ok)throw Error("HTTP "+response.status);
    return response.json();
  }).then(data=>{
    check(data);
    bank=data;
    $("summativeExercises").replaceChildren(...data.numericals.filter(n=>n.assessment==="summative").map(exercise));
    $("formativeExercises").replaceChildren(...data.numericals.filter(n=>n.assessment!=="summative").map(exercise));
    $("loadStatus").textContent="8 numericals ready · 6 summative aligned · 2 formative";
    revealReferencedExercise();
    for(const id of ["revealAll","hideAll","printQuestions","printSolutions"])$(id).disabled=false;
  }).catch(error=>{
    $("loadStatus").textContent="Could not load numerical exercises";
    $("summativeExercises").replaceChildren(create("p","notice","The exercise source could not be loaded: "+error.message));
  });
})();
