/* Grade XI Unit 3 Part 2 browser UI: original teaching diagrams, local calculations.
 * No account access, browser storage, network requests or saved assessments.
 */
(function(){
  "use strict";
  const lib=window.PSNUnit3Collisions;
  const $=id=>document.getElementById(id);
  if(!lib){$("collisionStatus").textContent="Physics module unavailable. Reload the page.";return}
  const ns="http://www.w3.org/2000/svg";
  const theme={one:"#12788f",two:"#c17738",axis:"#637f97",pale:"#e5edf5",text:"#26415b"};
  const num=(x,d=2)=>lib.fmt(x,d);
  const svg=(tag,attrs={},value)=>{
    const e=document.createElementNS(ns,tag);
    for(const [key,val] of Object.entries(attrs))e.setAttribute(key,String(val));
    if(value!==undefined)e.textContent=String(value);
    return e;
  };
  function text(svgRoot,x,y,value,size=12,fill=theme.text,anchor="start"){
    svgRoot.append(svg("text",{x,y,fill,"font-size":size,"text-anchor":anchor,"font-weight":"650"},value));
  }
  function line(root,x1,y1,x2,y2,stroke,width=1){
    root.append(svg("line",{x1,y1,x2,y2,stroke,"stroke-width":width}));
  }
  function arrowHead(root,fromX,fromY,toX,toY,color){
    const angle=Math.atan2(toY-fromY,toX-fromX),length=10,wing=5;
    const p1=[toX-length*Math.cos(angle)+wing*Math.sin(angle),toY-length*Math.sin(angle)-wing*Math.cos(angle)];
    const p2=[toX-length*Math.cos(angle)-wing*Math.sin(angle),toY-length*Math.sin(angle)+wing*Math.cos(angle)];
    root.append(svg("polygon",{points:toX+","+toY+" "+p1.join(",")+" "+p2.join(","),fill:color}));
  }
  function showDragFocus(name){
    const topic=lib.topic(name);
    $("dragTitle").textContent=topic.title;
    $("idealExplanation").textContent=topic.noDrag;
    $("dragExplanation").textContent=topic.withDrag;
    $("dragCaution").textContent=topic.caution;
    for(const button of document.querySelectorAll("[data-focus]")){
      button.setAttribute("aria-pressed",String(button.dataset.focus===name));
    }
    // Colour and opacity only; the plotted lines are deliberately qualitative.
    $("idealPath").setAttribute("opacity",name==="range"||name==="peak"?"1":"0.68");
    $("dragPath").setAttribute("opacity",name==="range"||name==="peak"?"1":"0.8");
    $("dragPlot").setAttribute("aria-label",topic.title+". Both trajectories illustrative, not calculated from a drag force model.");
  }
  function blankResult(){
    for(const id of ["v1Value","v2Value","momentumValue","kineticValue","lossValue","relativeValue"])$(id).textContent="—";
    $("conclusion").textContent="Select an approaching pair of bodies to compare conservation laws.";
    $("collisionPlot").replaceChildren(svg("title",{},"Set u₁ greater than u₂ to show collision velocity vectors."),
      svg("text",{x:270,y:152,fill:theme.text,"font-size":15,"text-anchor":"middle"},"No collision: the bodies are not approaching."));
  }
  function signedArrow(canvas,x0,y,velocity,scale,color,labelText){
    const dx=velocity*scale;
    line(canvas,x0,y,x0+dx,y,color,4);
    if(Math.abs(dx)>2)arrowHead(canvas,x0,y,x0+dx,y,color);
    else canvas.append(svg("circle",{cx:x0,cy:y,r:4,fill:color}));
    const xpos=velocity<0?x0+dx-8:x0+dx+8;
    text(canvas,Math.max(9,Math.min(534,xpos)),y-9,num(velocity)+" m/s",12,color,velocity<0?"end":"start");
    text(canvas,10,y+4,labelText,12,color);
  }
  function plotCollision(result){
    const canvas=$("collisionPlot");
    canvas.replaceChildren(svg("title",{},"Signed velocities of two objects before and after the selected isolated one-dimensional head-on collision."));
    canvas.setAttribute("aria-label","Object 1 and object 2 velocities before and after "+result.type+" collision. Right positive, left negative.");
    const center=295,scale=155/Math.max(1,Math.abs(result.u1),Math.abs(result.u2),Math.abs(result.v1),Math.abs(result.v2));
    text(canvas,10,23,"BEFORE",14,theme.text);
    text(canvas,10,172,"AFTER",14,theme.text);
    line(canvas,5,164,535,164,theme.pale,2);
    line(canvas,center,36,center,296,theme.axis,1.5);
    text(canvas,center+5,31,"0",11);
    text(canvas,center-9,310,"← negative",11,theme.text,"end");
    text(canvas,center+9,310,"positive →",11);
    for(const y of [75,123,214,260])line(canvas,157,y,535,y,theme.pale);
    signedArrow(canvas,center,75,result.u1,scale,theme.one,"Object 1");
    signedArrow(canvas,center,123,result.u2,scale,theme.two,"Object 2");
    signedArrow(canvas,center,214,result.v1,scale,theme.one,"Object 1");
    signedArrow(canvas,center,260,result.v2,scale,theme.two,"Object 2");
  }
  function refreshCollision(){
    const m1=Number($("m1").value),m2=Number($("m2").value),
      u1=Number($("u1").value),u2=Number($("u2").value),type=$("collisionType").value;
    for(const name of ["m1","m2","u1","u2"]){
      const unit=name.startsWith("m")?"kg":"m/s";
      $(name+"Label").textContent=num(Number($(name).value),1)+" "+unit;
    }
    let result;
    try{result=lib.collision(m1,m2,u1,u2,type)}catch(error){
      $("collisionStatus").className="alert error";
      $("collisionStatus").textContent="No approach: the left object (1) must move toward object 2 faster, so set u₁ > u₂. No collision result can be calculated for the selected arrangement.";
      blankResult();
      return;
    }
    const verified=lib.checkConservation(result);
    $("collisionStatus").className="alert";
    $("collisionStatus").textContent=type==="elastic" ?
      "Elastic collision calculated: momentum and kinetic energy are conserved." :
      "Perfectly inelastic collision calculated: the bodies move together; momentum is conserved and kinetic energy decreases.";
    $("v1Value").textContent=num(result.v1)+" m/s";
    $("v2Value").textContent=num(result.v2)+" m/s";
    $("momentumValue").textContent=num(result.momentumBefore)+" / "+num(result.momentumAfter)+" kg·m/s";
    $("kineticValue").textContent=num(result.kineticBefore)+" / "+num(result.kineticAfter)+" J";
    $("lossValue").textContent=num(result.kineticLoss)+" J";
    $("relativeValue").textContent=num(result.approachSpeed)+" / "+num(result.separationSpeed)+" m/s";
    $("conclusion").textContent=type==="elastic"?
      "Momentum check: "+(verified.momentumConserved?"conserved":"check failed")+
      ". Kinetic energy check: "+(verified.energyConserved?"conserved":"check failed")+
      ". Relative speed of approach equals the speed of separation.":
      "Momentum remains conserved. Both bodies share the common final velocity. "+
      "The loss of mechanical kinetic energy is transformed into other energy forms (deformation, heat and sound); total energy is not destroyed.";
    plotCollision(result);
  }
  for(const item of document.querySelectorAll("[data-focus]")){
    item.addEventListener("click",()=>showDragFocus(item.dataset.focus));
  }
  for(const id of ["m1","m2","u1","u2","collisionType"]){
    $(id).addEventListener("input",refreshCollision);
    $(id).addEventListener("change",refreshCollision);
  }
  for(const button of document.querySelectorAll("[data-preset]")){
    button.addEventListener("click",()=>{
      const p=lib.presets.find(item=>item.id===button.dataset.preset);
      if(!p)return;
      for(const id of ["m1","m2","u1","u2"])$(id).value=String(p[id]);
      $("collisionType").value=p.type;
      refreshCollision();
    });
  }
  showDragFocus("range");
  refreshCollision();
})();
