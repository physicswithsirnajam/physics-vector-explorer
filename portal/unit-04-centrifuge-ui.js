/* Physics with Sir Najam — Unit 4 centrifugation teaching UI.
 * Qualitative before/after diagram, NOT a particle-transport simulation.
 * Numeric centripetal acceleration demand is from actual unscaled inputs.
 * No persistence, student account calls, network requests or grades.
 */
(function(){
"use strict";
const m=window.PSNUnit4Centrifuge;if(!m)return;
const $=id=>document.getElementById(id);
const ns="http://www.w3.org/2000/svg";
const fmt=(x,dp=2)=>m.format(x,dp);
let separated=false,angle=0,playing=false,frame=null,last=null;
function values(){return {rpm:Number($("rpm").value),radius:Number($("radius").value),mass:Number($("mass").value)}}
function svg(tag,attrs,label){
 const e=document.createElementNS(ns,tag);
 for(const [k,v] of Object.entries(attrs||{}))e.setAttribute(k,String(v));
 if(label!==undefined)e.textContent=String(label);
 return e;
}
function txt(target,x,y,words,options={}){
 target.append(svg("text",{x,y,"text-anchor":options.anchor||"start",
  fill:options.fill||"#345773","font-size":options.size||12,"font-weight":options.weight||"700"},words));
}
function particles(){
 for(const [i,el] of [...document.querySelectorAll(".dense")].entries()){
  const x=separated?(i%2===0?391:400):(i%2===0?345:370);
  el.setAttribute("cx",String(x));
 }
 for(const [i,el] of [...document.querySelectorAll(".light")].entries()){
  const x=separated?(i%2===0?335:346):(i%2===0?350:387);
  el.setAttribute("cx",String(x));
 }
 $("diagramState").textContent=separated?
  "Conceptual outcome: dense material toward outer ends":
  "Mixed sample: fractions distributed through tubes";
}
function updateSvg(){
 $("rotorGroup").setAttribute("transform","rotate("+(-angle*180/Math.PI)+" 260 188)");
 particles();
 const p=values();
 $("centrifugePlot").setAttribute("aria-label",
  "Four sample tubes rotating around a central axis; outer ends are farther from centre. "+
  (separated?"Conceptual separation: denser fraction toward outer-end tube bottoms.":
   "Mixed samples show both fractions throughout the tube.")+
  " Selected rpm "+fmt(p.rpm,0)+". Diagram is schematic and not a prediction of settling time.");
}
function chart(values){
 const target=$("scalingGraph"),base=values.base.centripetalAcceleration;
 const bars=[
  {label:"Selected RPM",value:base,ratio:1},
  {label:"2 × RPM",value:values.twiceRPM.centripetalAcceleration,ratio:4},
  {label:"2 × radius",value:values.twiceRadius.centripetalAcceleration,ratio:2}
 ];
 const max=Math.max(1,...bars.map(x=>x.value));
 const left=80,top=28,bottom=250,right=510;
 const baseline=svg("line",{x1:left,y1:bottom,x2:right,y2:bottom,stroke:"#859fb5","stroke-width":2});
 const topLine=svg("line",{x1:left,y1:top,x2:left,y2:bottom,stroke:"#859fb5","stroke-width":2});
 const nodes=[svg("title",{},"Required inward acceleration versus selected rotor settings"),baseline,topLine];
 bars.forEach((item,i)=>{
  const x=125+145*i;
  const h=(item.value/max)*166;
  nodes.push(svg("rect",{x,y:bottom-h,width:80,height:h,rx:5,fill:i===0?"#147990":i===1?"#b87b42":"#6d99b2"}));
 });
 target.replaceChildren(...nodes);
 txt(target,16,19,"Required centripetal acceleration (m/s²)",{weight:"800",size:13});
 for(let i=0;i<bars.length;i++){
  const item=bars[i],x=165+145*i;
  txt(target,x,250-Math.max(0,item.value/max*166)-8,fmt(item.value,1),{anchor:"middle",size:12,weight:"800"});
  txt(target,x,270,item.label,{anchor:"middle",size:12});
 }
 target.setAttribute("aria-label","Accelerations: selected "+fmt(bars[0].value,2)+
  ", twice rpm "+fmt(bars[1].value,2)+
  ", twice radius "+fmt(bars[2].value,2)+
  " metres per second squared. Acceleration is a force requirement, not a measured separation rate.");
}
function update(){
 const p=values(),a=m.model(p.rpm,p.radius,p.mass),comparison=m.comparison(p.rpm,p.radius,p.mass);
 $("rpmValue").textContent=fmt(p.rpm,0)+" rpm";
 $("radiusValue").textContent=fmt(p.radius,3)+" m";
 $("massValue").textContent=fmt(p.mass,1)+" g";
 $("omega").textContent=fmt(a.omegaRadPerSec,2)+" rad/s";
 $("ac").textContent=fmt(a.centripetalAcceleration,1)+" m/s²";
 $("gRatio").textContent=fmt(a.radialAccelerationInG,1)+" g";
 $("force").textContent=fmt(a.neededInwardForce,2)+" N";
 $("frequency").textContent=fmt(a.revolutionsPerSecond,2)+" Hz";
 $("period").textContent=a.periodSeconds===null?"Not rotating":fmt(a.periodSeconds,3)+" s";
 $("caseExplanation").textContent=m.examples[$("useCase").value].density;
 $("separate").disabled=p.rpm===0;
 $("spin").disabled=p.rpm===0;
 if(p.rpm===0){
  $("status").textContent="Rotor at rest: there is no rotation-related centripetal acceleration. Spin to explore an illustrative separation outcome. Any currently displayed separation represents an earlier conceptual state.";
 }else if(separated){
  $("status").textContent="Conceptual post-spin arrangement shown: denser suspended particles appear closer to the outer ends of the tubes. This is a manually selected teaching illustration; it is not computed from rpm or time.";
 }else{
  $("status").textContent="Mixed fractions shown. Click 'Show conceptual separation' to compare a possible after-spinning arrangement; the model does not calculate a settling time.";
 }
 $("comparisonText").textContent="At the chosen settings, inward acceleration demand is "+
  fmt(a.centripetalAcceleration,2)+" m/s². Holding radius fixed, twice rpm requires "+
  fmt(comparison.twiceRPM.centripetalAcceleration,2)+
  " m/s² (4×). Holding rpm fixed, twice radius requires "+
  fmt(comparison.twiceRadius.centripetalAcceleration,2)+
  " m/s² (2×). Neither relationship predicts how fast a material separates.";
 chart(comparison);
 updateSvg();
}
function stop(){
 if(frame!==null)cancelAnimationFrame(frame);
 frame=null;last=null;playing=false;$("spin").textContent="Play schematic rotation";
}
function animate(t){
 if(!playing)return;
 if(last===null)last=t;
 const dt=Math.max(0,Math.min(.1,(t-last)/1000));last=t;
 const omega=m.model(values().rpm,values().radius,values().mass).omegaRadPerSec;
 // Deliberately slow visual rotation, never used for calculated accelerations.
 const visualOmega=Math.min(2,omega*.03);
 angle=(angle+visualOmega*dt)%(Math.PI*2);
 updateSvg();
 frame=requestAnimationFrame(animate);
}
for(const id of ["rpm","radius","mass"]){
 $(id).addEventListener("input",()=>{
  if(id==="rpm"&&values().rpm===0)stop();
  update();
 });
}
$("useCase").addEventListener("change",update);
$("mix").addEventListener("click",()=>{separated=false;update()});
$("separate").addEventListener("click",()=>{
 if(values().rpm===0)return;
 separated=true;update();
});
$("spin").addEventListener("click",()=>{
 if(playing){stop();return}
 if(values().rpm===0)return;
 playing=true;last=null;$("spin").textContent="Pause schematic rotation";
 frame=requestAnimationFrame(animate);
});
document.addEventListener("visibilitychange",()=>{if(document.hidden)stop()});
update();
})();