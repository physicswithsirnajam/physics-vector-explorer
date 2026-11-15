/* Unit 3 Physics descriptive paper renderer; no login, saving or remote services.
 * Draws all source-based practice wording as text nodes.
 */
(function(){
  "use strict";
  const $=id=>document.getElementById(id),src="../question-bank/grade-11/unit-03-descriptive-practice.json";
  let paper=null,printerState=null;
  function element(type,cls,value){
    const e=document.createElement(type);
    if(cls)e.className=cls;
    if(value!==undefined)e.textContent=String(value);
    return e;
  }
  function validate(data){
    if(!data||data.schemaVersion!==1||data.status!=="teacher-review-pending"||
        data.pattern?.totalMarks!==40||!Array.isArray(data.sectionB)||data.sectionB.length!==7||
        !Array.isArray(data.sectionC)||data.sectionC.length!==2)throw Error("Invalid descriptive paper format");
    const list=[...data.sectionB,...data.sectionC];
    for(const [i,question] of list.entries()){
      const expected=i<7?4:6;
      if(question.number!==i+1||question.marks!==expected||question.choices.length!==2)throw Error("Invalid OR pair "+(i+1));
      for(const option of question.choices){
        if(!["P-11-B-04","P-11-B-05","P-11-B-06","P-11-B-12","P-11-B-13"].includes(option.slo)||
            option.assessment!=="summative-theory"||option.sourcePage<33||option.sourcePage>52||
            !option.prompt||!Array.isArray(option.marking)||
            option.marking.reduce((a,p)=>a+p.marks,0)!==expected)throw Error("Invalid SLO or marking for Q"+question.number);
      }
    }
  }
  function optionBlock(q,opt,letter){
    const section=element("div","or-item"),title=element("strong","",letter+") "+opt.prompt);
    section.appendChild(title);
    const meta=element("div","slo",opt.slo+" · "+opt.assessment);
    section.appendChild(meta);
    const source=element("p","source","Source: "+opt.sourceRef+" (printed p. "+opt.sourcePage+").");
    section.appendChild(source);
    const details=element("details"),summary=element("summary","", "Reveal model answer and "+q.marks+"-mark scheme");
    const body=element("div","answer"),list=element("ol");
    for(const item of opt.marking){
      const li=element("li",""),detail=element("span","",item.text);
      const marks=element("span","marks","  ["+item.marks+" mark"+(item.marks===1?"":"s")+"]");
      li.append(detail,marks);list.append(li);
    }
    body.appendChild(list);
    const note=element("p","teacher-note","Teacher guidance: "+opt.notes);
    body.appendChild(note);
    details.append(summary,body);
    section.appendChild(details);
    return section;
  }
  function questionBlock(q){
    const article=element("article","qa");article.id="q"+q.number;
    const top=element("div","qa-title");
    top.append(element("h3","", "Question "+q.number),
               element("strong","",q.marks+" marks · internal OR"));
    article.appendChild(top);
    article.appendChild(optionBlock(q,q.choices[0],"A"));
    article.appendChild(element("div","or-divider","OR"));
    article.appendChild(optionBlock(q,q.choices[1],"B"));
    const space=element("div","answer-space");
    space.setAttribute("aria-hidden","true");
    article.appendChild(space);
    return article;
  }
  function allDetails(){
    return [...document.querySelectorAll("#sectionB details, #sectionC details")];
  }
  function print(kind){
    if(!paper)return;
    printerState=allDetails().map(el=>el.open);
    if(kind==="teacher"){
      document.body.classList.add("print-teacher");
      allDetails().forEach(d=>d.open=true);
    }else{
      document.body.classList.remove("print-teacher");
    }
    window.print();
  }
  function afterPrint(){
    document.body.classList.remove("print-teacher");
    if(printerState){
      const details=allDetails();
      details.forEach((d,i)=>d.open=printerState[i]);
      printerState=null;
    }
  }
  $("showAll").addEventListener("click",()=>allDetails().forEach(d=>d.open=true));
  $("hideAll").addEventListener("click",()=>allDetails().forEach(d=>d.open=false));
  $("printStudent").addEventListener("click",()=>print("student"));
  $("printTeacher").addEventListener("click",()=>print("teacher"));
  window.addEventListener("afterprint",afterPrint);
  fetch(src,{cache:"no-store"}).then(r=>{
    if(!r.ok)throw Error("HTTP "+r.status);
    return r.json();
  }).then(data=>{
    validate(data);
    paper=data;
    $("shortQuestions").replaceChildren(...data.sectionB.map(questionBlock));
    $("longQuestions").replaceChildren(...data.sectionC.map(questionBlock));
    for(const id of ["showAll","hideAll","printStudent","printTeacher"])$(id).disabled=false;
    $("loadStatus").textContent="9 OR pairs ready · 18 solved choices · 40 marks";
  }).catch(error=>{
    $("loadStatus").textContent="Paper not available";
    $("shortQuestions").replaceChildren(element("p","notice","Could not load the descriptive practice paper: "+error.message));
  });
})();
