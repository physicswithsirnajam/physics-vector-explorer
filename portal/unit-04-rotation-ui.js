/* Physics with Sir Najam — Grade XI Unit 4 rotating-wheel browser UI.
 * Pure SVG and text-node rendering, no saved student data or external calls.
 */
(function(){
  "use strict";
  const lib=window.PSNUnit4Rotational;
  const $=id=>document.getElementById(id);
  if(!lib){return;}
  const NS="http://www.w3.org/2000/svg";
  const colour={ink:"#25435e",line:"#97aabc",teal:"#147b95",gold:"#b77c3d",zero:"#afc3d1"};
  let frame=null,last=null,playing=false;
  const format=(n,dp=2)=>lib.tidy(n,dp);
  function e(tag,attributes={},label){
    const item=document.createElementNS(NS,tag);
    for(const [key,value] of Object.entries(attributes))item.setAttribute(key,String(value));
    if(label!==undefined)item.textContent=String(label);
    return item;
  }
  function text(target,x,y,label,options={}){
    target.append(e("text",{x,y,fill:options.fill||colour.ink,"font-size":options.size||12,
      "font-weight":options.weight||"600","text-anchor":options.anchor||"start"},label));
  }
  function point(cx,cy,r,theta){return [cx+r*Math.cos(theta),cy-r*Math.sin(theta)];}
  function updateArc(){
    const radius=Number($("arcRadius").value);
    const deg=Number($("arcDegrees").value);
    const data=lib.circleArc(radius,deg);
    $("arcRadiusValue").textContent=format(radius,2)+" m";
    $("arcDegreesValue").textContent=(deg>0?"+":"")+format(deg,0)+"°";
    $("arcRadians").textContent=(data.radians>0?"+":"")+format(data.radians,3)+" rad";
    $("arcLength").textContent=(data.arcLength>0?"+":"")+format(data.arcLength,3)+" m";
    $("arcRevolutions").textContent=(data.revolutions>0?"+":"")+format(data.revolutions,3)+" turns";
    const cx=235,cy=166,outer=109,inner=75,ang=lib.radiansFromDegrees(deg),end=point(cx,cy,outer,ang);
    $("arcRay").setAttribute("x2",end[0]);
    $("arcRay").setAttribute("y2",end[1]);
    $("arcPoint").setAttribute("cx",end[0]);
    $("arcPoint").setAttribute("cy",end[1]);
    const sweep=deg>=0?0:1;
    const start=point(cx,cy,inner,0),arcEnd=point(cx,cy,inner,ang);
    let path="";
    if(Math.abs(deg)===360){
      const half=point(cx,cy,inner,deg>0?Math.PI:-Math.PI);
      path="M"+start.join(" ")+" A"+inner+" "+inner+" 0 0 "+sweep+" "+half.join(" ")+
          " A"+inner+" "+inner+" 0 0 "+sweep+" "+start.join(" ");
    }else if(deg!==0){
      const large=Math.abs(deg)>180?1:0;
      path="M"+start.join(" ")+" A"+inner+" "+inner+" 0 "+large+" "+sweep+" "+arcEnd.join(" ");
    }
    $("arcPath").setAttribute("d",path);
    $("arcLabel").textContent=(deg>0?"+":"")+format(deg,0)+"° = "+format(data.radians,3)+" rad";
    $("arcPlot").setAttribute("aria-label","Signed angle "+deg+" degrees, radius "+format(radius,2)+
      " metres, signed arc length "+format(data.arcLength,3)+" metres.");
  }
  function plotGraph(elementId,which,title,current,parameters){
    const el=$(elementId);
    const values=lib.sampleRotation(parameters.radius,parameters.omega0,parameters.alpha,30,90);
    const yValue=which==="omega"?p=>p.omega:p=>p.theta;
    const arr=values.map(yValue);
    let min=Math.min(0,...arr),max=Math.max(0,...arr);
    if(max-min<1e-7){max+=1;min-=1;}
    const pad=(max-min)*.10;max+=pad;min-=pad;
    const left=52,right=502,top=26,bottom=218;
    const X=t=>left+(t/30)*(right-left);
    const Y=v=>bottom-((v-min)/(max-min))*(bottom-top);
    const parts=[e("title",{},title),e("line",{x1:left,y1:top,x2:left,y2:bottom,stroke:colour.line,"stroke-width":1.5}),
      e("line",{x1:left,y1:bottom,x2:right,y2:bottom,stroke:colour.line,"stroke-width":1.5}),
      e("line",{x1:left,y1:Y(0),x2:right,y2:Y(0),stroke:colour.zero,"stroke-dasharray":"6 5"})];
    const d=values.map((v,i)=>(i?"L":"M")+X(v.time).toFixed(2)+","+Y(yValue(v)).toFixed(2)).join(" ");
    parts.push(e("path",{d,fill:"none",stroke:colour.teal,"stroke-width":3,"stroke-linecap":"round"}));
    parts.push(e("line",{x1:X(current.time),y1:top,x2:X(current.time),y2:bottom,
      stroke:colour.gold,"stroke-width":1.5,"stroke-dasharray":"4 5"}));
    parts.push(e("circle",{cx:X(current.time),cy:Y(yValue(current)),r:5,fill:colour.gold}));
    el.replaceChildren(...parts);
    text(el,left-8,top+5,format(max,1),{anchor:"end",size:11});
    text(el,left-8,bottom,format(min,1),{anchor:"end",size:11});
    text(el,left,bottom+18,"0 s",{size:11});
    text(el,right,bottom+18,"30 s",{size:11,anchor:"end"});
    text(el,left+4,17,which==="omega"?"ω (rad/s)":"Δθ (rad)",{size:12,weight:"800"});
    el.setAttribute("aria-label",title+". At "+format(current.time,2)+" seconds, "+
      (which==="omega"?"angular velocity ":"angular displacement ")+format(yValue(current),3)+
      (which==="omega"?" radians per second.":" radians."));
  }
  function updateWheel(){
    const radius=Number($("wheelRadius").value),omega0=Number($("wheelOmega").value);
    const alpha=Number($("wheelAlpha").value),time=Number($("wheelTime").value);
    const p=lib.rotating(radius,omega0,alpha,time);
    $("wheelRadiusValue").textContent=format(radius,3)+" m";
    $("wheelOmegaValue").textContent=format(omega0,3)+" rad/s";
    $("wheelAlphaValue").textContent=format(alpha,3)+" rad/s²";
    $("wheelTimeValue").textContent=format(time,2)+" s";
    $("wheelTheta").textContent=format(p.theta,3)+" rad";
    $("wheelFinalOmega").textContent=format(p.omega,3)+" rad/s";
    $("wheelRevs").textContent=format(p.revolutions,3)+" rev";
    $("wheelArc").textContent=format(p.linearArcDisplacement,3)+" m";
    $("wheelDistance").textContent=format(p.rimDistance,3)+" m";
    $("wheelRimSpeed").textContent=format(p.signedTangentialVelocity,3)+" m/s";
    $("wheelTangential").textContent=format(p.signedTangentialAcceleration,3)+" m/s²";
    $("wheelIdentity").textContent=Math.abs(p.identityLeft-p.identityRight)<1e-8?"Verified":"Check inputs";
    const deg=(p.theta*180/Math.PI)%360;
    $("wheelGroup").setAttribute("transform","rotate("+(-deg)+" 235 164)");
    let direction="Momentarily stationary (ω = 0)";
    if(p.omega>0.0005)direction="Anticlockwise (+)";
    else if(p.omega<-.0005)direction="Clockwise (−)";
    $("wheelDirection").textContent=direction;
    $("wheelPlot").setAttribute("aria-label","Wheel rotated through "+format(p.theta,2)+
      " radians at observation time "+format(time,2)+" seconds. "+direction+
      ". Total rim distance "+format(p.rimDistance,2)+" metres.");
    if(p.reverses){
      $("wheelStatus").textContent="Direction reversal occurred at t = "+format(p.reversalTime,2)+
        " s. Signed displacement ≠ total angular distance. At the selected time, signed Δθ = "+
        format(p.theta,2)+" rad and angular distance = "+format(p.angularDistance,2)+" rad.";
    }else if(Math.abs(p.omega)<.0005){
      $("wheelStatus").textContent="The wheel is instantaneously at rest at this observation time. "+
        "A nonzero angular acceleration can cause it to start moving in the opposite direction afterward.";
    }else{
      $("wheelStatus").textContent="Current motion: "+direction+". Angular acceleration is "+
        format(alpha,3)+" rad/s². The graph shows signed quantities and accounts for any reversal.";
    }
    plotGraph("omegaGraph","omega","Angular velocity versus time",p,{radius,omega0,alpha});
    plotGraph("thetaGraph","theta","Signed angular displacement versus time",p,{radius,omega0,alpha});
  }
  function stopPlayback(){
    if(frame!==null)cancelAnimationFrame(frame);
    frame=null;last=null;playing=false;
    $("wheelPlay").textContent="Play rotation";
  }
  function animate(ts){
    if(!playing)return;
    if(last===null)last=ts;
    const dt=Math.min(.12,Math.max(0,(ts-last)/1000));last=ts;
    const t=Number($("wheelTime").value)+dt*4;
    if(t>=30){$("wheelTime").value="30";updateWheel();stopPlayback();return;}
    $("wheelTime").value=String(t);
    updateWheel();
    frame=requestAnimationFrame(animate);
  }
  function applyPreset(name){
    stopPlayback();
    let v;
    if(name==="textbook-4.1"){
      const ex=lib.bicycleTyreExercise();
      v={radius:ex.radius,omega:ex.initialOmega,alpha:ex.alpha,time:ex.stoppingTime};
    }else if(name==="constant")v={radius:.5,omega:4,alpha:0,time:7};
    else if(name==="speedup")v={radius:.4,omega:2,alpha:1,time:8};
    else if(name==="reversal")v={radius:.35,omega:6,alpha:-2,time:4};
    else return;
    for(const [id,value] of [["wheelRadius",v.radius],["wheelOmega",v.omega],
      ["wheelAlpha",v.alpha],["wheelTime",v.time]])$(id).value=String(value);
    updateWheel();
  }
  for(const id of ["arcRadius","arcDegrees"])$(id).addEventListener("input",updateArc);
  for(const id of ["wheelRadius","wheelOmega","wheelAlpha","wheelTime"]){
    $(id).addEventListener("input",()=>{stopPlayback();updateWheel()});
  }
  for(const b of document.querySelectorAll("[data-preset]"))b.addEventListener("click",()=>applyPreset(b.dataset.preset));
  $("wheelPlay").addEventListener("click",()=>{
    if(playing){stopPlayback();return;}
    if(Number($("wheelTime").value)>=30)$("wheelTime").value="0";
    playing=true;last=null;$("wheelPlay").textContent="Pause rotation";
    frame=requestAnimationFrame(animate);
  });
  $("wheelReset").addEventListener("click",()=>{stopPlayback();$("wheelTime").value="0";updateWheel()});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)stopPlayback()});
  updateArc();
  applyPreset("textbook-4.1");
})();