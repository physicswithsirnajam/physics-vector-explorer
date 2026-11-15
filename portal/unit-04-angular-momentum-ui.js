/* Physics with Sir Najam — Unit 4 Part 4 public browser interface.
 * Values use pure physical models; visual angular motion is time-scaled
 * for the classroom. No student identity, results, storage or fetch calls.
 */
(function(){
"use strict";
const model=window.PSNUnit4Angular;
if(!model)return;
const $=id=>document.getElementById(id);
const ns="http://www.w3.org/2000/svg";
const fmt=(n,d=2)=>model.format(n,d);
const rotorIds=["shape","rotorMass","rotorRadius","rotorRPM","rotorTorque","rotorTime"];
const skaterIds=["handMass","coreMoment","initialArmRadius","finalArmRadius","initialSkaterRPM"];
let rotorFrame=null,rotorLast=null,rotorPlaying=false;
let skaterFrame=null,skaterLast=null,skaterPlaying=false,skaterAngle=0;
function val(id){return Number($(id).value);}
function make(tag,attrs,textValue){
 const el=document.createElementNS(ns,tag);
 for(const [key,v] of Object.entries(attrs||{}))el.setAttribute(key,String(v));
 if(textValue!==undefined)el.textContent=String(textValue);
 return el;
}
function text(svg,x,y,content,extra={}){
 svg.append(make("text",{x,y,fill:extra.fill||"#37566f","font-size":extra.size||12,
  "font-weight":extra.weight||"700","text-anchor":extra.anchor||"start"},content));
}
function rotorData(){
 return model.rotor($("shape").value,val("rotorMass"),val("rotorRadius"),
   val("rotorRPM"),val("rotorTorque"),val("rotorTime"));
}
function drawOmegaGraph(p){
 const plot=$("omegaChart"),left=58,right=510,top=25,bottom=222;
 const start=p.initialOmega,end=p.initialOmega+p.alpha*15;
 let lo=Math.min(0,start,end),hi=Math.max(0,start,end);
 if(Math.abs(hi-lo)<1e-6){lo-=1;hi+=1;}
 const pad=.08*(hi-lo);lo-=pad;hi+=pad;
 const X=t=>left+(right-left)*t/15;
 const Y=w=>bottom-(bottom-top)*(w-lo)/(hi-lo);
 const seg=[
 make("title",{}, "Angular speed changes at a constant rate α = net torque divided by I."),
 make("line",{x1:left,y1:top,x2:left,y2:bottom,stroke:"#9ab3c8","stroke-width":1.5}),
 make("line",{x1:left,y1:bottom,x2:right,y2:bottom,stroke:"#9ab3c8","stroke-width":1.5}),
 make("line",{x1:left,y1:Y(0),x2:right,y2:Y(0),stroke:"#bdcbd6","stroke-dasharray":"5 5"}),
 make("line",{x1:X(0),y1:Y(start),x2:X(15),y2:Y(end),stroke:"#127994","stroke-width":3}),
 make("line",{x1:X(p.time),y1:top,x2:X(p.time),y2:bottom,stroke:"#b47a3d","stroke-width":1.5,"stroke-dasharray":"5 5"}),
 make("circle",{cx:X(p.time),cy:Y(p.finalOmega),r:6,fill:"#c39146"})
 ];
 plot.replaceChildren(...seg);
 text(plot,left-7,top+5,fmt(hi,1),{anchor:"end",size:11});
 text(plot,left-7,bottom,fmt(lo,1),{anchor:"end",size:11});
 text(plot,left,bottom+20,"0 s",{size:12});
 text(plot,right,bottom+20,"15 s",{anchor:"end",size:12});
 text(plot,left+5,17,"ω (rad/s)",{weight:"800"});
 text(plot,left+145,17,"Observed: "+fmt(p.time,2)+" s; ω="+fmt(p.finalOmega,2)+" rad/s",{size:12,fill:"#ae6c35"});
 plot.setAttribute("aria-label","Angular velocity versus time graph, zero to 15 seconds; current observation at "+
   fmt(p.time,2)+" seconds has signed angular velocity "+fmt(p.finalOmega,2)+" radians per second.");
}
function updateRotor(){
 const p=rotorData();
 $("rotorMassValue").textContent=fmt(p.moment.mass,2)+" kg";
 $("rotorRadiusValue").textContent=fmt(p.moment.radius,3)+" m";
 $("rotorRPMValue").textContent=fmt(p.initialRPM,2)+" rpm";
 $("rotorTorqueValue").textContent=fmt(p.externalTorque,3)+" N m";
 $("rotorTimeValue").textContent=fmt(p.time,2)+" s";
 $("moment").textContent=fmt(p.moment.value,5)+" kg m²";
 $("omega0").textContent=fmt(p.initialOmega,3)+" rad/s";
 $("alpha").textContent=fmt(p.alpha,3)+" rad/s²";
 $("omegaFinal").textContent=fmt(p.finalOmega,3)+" rad/s";
 $("initialL").textContent=fmt(p.initialL,3)+" kg m²/s";
 $("finalL").textContent=fmt(p.finalL,3)+" kg m²/s";
 $("torqueImpulse").textContent=fmt(p.torqueImpulse,3)+" N m s";
 $("torqueCheck").textContent=Math.abs(p.deltaL-p.torqueImpulse)<1e-7?"Verified (0)":"Review";
 const deg=(p.angularDisplacement*180/Math.PI)%360;
 $("rotorGroup").setAttribute("transform","rotate("+(-deg)+" 243 164)");
 const stroke=p.moment.shape==="hoop"||p.moment.shape==="shell"?"#64859f":"#84a7bc";
 const width=p.moment.shape==="hoop"||p.moment.shape==="shell"?"12":"4";
 const outer=$("rotorOuter");
 outer.setAttribute("stroke",stroke);outer.setAttribute("stroke-width",width);
 outer.setAttribute("fill",p.moment.shape==="hoop"||p.moment.shape==="shell"?"#ffffff":"#dceaf4");
 $("rotorShapeLabel").textContent=model.factors[p.moment.shape].label+" — "+p.moment.expression+" (schematic)";
 const dir=p.finalOmega>1e-6?"Anticlockwise (+)":p.finalOmega< -1e-6?"Clockwise (−)":"Instantaneously stationary";
 $("rotorDirection").textContent=dir;
 if(p.reverses){
  $("rotorStatus").textContent="The rotor reversed after t="+fmt(p.reversalTime,2)+" s. Current ω="+fmt(p.finalOmega,2)+
   " rad/s; the sign of angular momentum follows the rotation direction.";
 }else if(Math.abs(p.finalOmega)<.0005){
  $("rotorStatus").textContent="The rotor is momentarily at rest at this time. Under continued nonzero net torque it would reverse; the textbook braking example ends here.";
 }else if(p.externalTorque===0){
  $("rotorStatus").textContent="No net external torque: angular momentum and angular speed remain constant for this rigid body with fixed moment of inertia.";
 }else{
  $("rotorStatus").textContent="Angular momentum change ΔL="+fmt(p.deltaL,3)+
   " kg m²/s equals net external torque impulse τΔt="+fmt(p.torqueImpulse,3)+
   " N m s. Negative torque means opposite to the chosen positive axis.";
 }
 $("rotorPlot").setAttribute("aria-label",model.factors[p.moment.shape].label+
  " on a fixed central axis. Time "+fmt(p.time,2)+" s, final angular speed "+fmt(p.finalOmega,2)+
  " rad/s, angular momentum "+fmt(p.finalL,2)+" kg m²/s.");
 drawOmegaGraph(p);
}
function stopRotor(){
 if(rotorFrame!==null)cancelAnimationFrame(rotorFrame);
 rotorFrame=null;rotorLast=null;rotorPlaying=false;$("rotorPlay").textContent="Play rotor";
}
function advanceRotor(timestamp){
 if(!rotorPlaying)return;
 if(rotorLast===null)rotorLast=timestamp;
 const dt=Math.max(0,Math.min(.08,(timestamp-rotorLast)/1000));rotorLast=timestamp;
 const time=val("rotorTime")+dt*2;
 if(time>=15){
  $("rotorTime").value="15";updateRotor();stopRotor();return;
 }
 $("rotorTime").value=String(time);
 updateRotor();
 rotorFrame=requestAnimationFrame(advanceRotor);
}
function applyRotorPreset(which){
 stopRotor();
 const ex=model.example43();
 const options={
  "example":{shape:"disk",mass:ex.mass,radius:ex.radius,rpm:ex.initialRPM,torque:ex.stoppingTorque,time:ex.stoppingTime},
  "hoop":{shape:"hoop",mass:ex.mass,radius:ex.radius,rpm:ex.initialRPM,torque:ex.stoppingTorque,time:ex.stoppingTime},
  "sphere":{shape:"sphere",mass:ex.mass,radius:ex.radius,rpm:ex.initialRPM,torque:ex.stoppingTorque,time:ex.stoppingTime}
 };
 const p=options[which];
 if(!p)return;
 for(const [id,value] of [["shape",p.shape],["rotorMass",p.mass],["rotorRadius",p.radius],
  ["rotorRPM",p.rpm],["rotorTorque",p.torque],["rotorTime",p.time]])$(id).value=String(value);
 updateRotor();
}
function skaterData(){
 return model.skater(val("handMass"),val("initialArmRadius"),
  val("finalArmRadius"),val("coreMoment"),val("initialSkaterRPM"));
}
function updateSkaterSvg(p){
 const px=Math.min(115,p.finalRadius/1.4*115);
 for(const [id,cx] of [["skaterHandLeft",247-px],["skaterHandRight",247+px]])
  $(id).setAttribute("cx",String(cx));
 $("skaterArm").setAttribute("x1",String(247-px));
 $("skaterArm").setAttribute("x2",String(247+px));
 $("skaterGroup").setAttribute("transform","rotate("+(-skaterAngle*180/Math.PI)+" 247 159)");
 $("skaterPlot").setAttribute("aria-label","Skater seen from above. Two hand masses of "+
  fmt(p.eachHandMass,2)+" kg each are positioned at final radius "+fmt(p.finalRadius,2)+
  " metres. Initial rate "+fmt(p.initialRPM,2)+" rpm, final predicted rate "+fmt(p.finalRPM,2)+
  " rpm with angular momentum unchanged.");
 $("skaterDirection").textContent="Final rate: "+fmt(p.finalRPM,2)+" rpm · L conserved";
}
function updateSkater(){
 const p=skaterData();
 $("handMassValue").textContent=fmt(p.eachHandMass,2)+" kg each";
 $("coreMomentValue").textContent=fmt(p.coreMoment,2)+" kg m²";
 $("initialArmRadiusValue").textContent=fmt(p.initialRadius,2)+" m";
 $("finalArmRadiusValue").textContent=fmt(p.finalRadius,2)+" m";
 $("initialSkaterRPMValue").textContent=fmt(p.initialRPM,2)+" rpm";
 $("skaterI0").textContent=fmt(p.initialMoment,3)+" kg m²";
 $("skaterIf").textContent=fmt(p.finalMoment,3)+" kg m²";
 $("skaterOmega0").textContent=fmt(p.initialOmega,3)+" rad/s";
 $("skaterOmegaf").textContent=fmt(p.finalOmega,3)+" rad/s";
 $("skaterL").textContent=fmt(p.angularMomentum,3)+" kg m²/s";
 $("skaterK0").textContent=fmt(p.initialKE,2)+" J";
 $("skaterKf").textContent=fmt(p.finalKE,2)+" J";
 $("skaterCheck").textContent=Math.abs(p.finalMoment*p.finalOmega-p.angularMomentum)<1e-9?"Verified":"Review";
 $("inertiaBar").style.width=Math.min(100,p.inertiaRatio/2*100)+"%";
 $("speedBar").style.width=Math.min(100,p.rotationRateRatio/2*100)+"%";
 $("inertiaBarText").textContent=fmt(p.inertiaRatio,3)+"× initial I";
 $("speedBarText").textContent=fmt(p.rotationRateRatio,3)+"× initial ω";
 if(p.finalRadius<p.initialRadius-1e-8){
  $("skaterStatus").textContent="Masses moved inward: I decreases, ω increases by "+
   fmt(p.rotationRateRatio,2)+"×. The skater does internal work; rotational kinetic energy may increase.";
 }else if(p.finalRadius>p.initialRadius+1e-8){
  $("skaterStatus").textContent="Masses moved outward: I increases, ω decreases. Angular momentum remains fixed if external torque is negligible.";
 }else{
  $("skaterStatus").textContent="Mass radius unchanged: I and ω remain constant. Moving mass changes rotation only when the moment of inertia changes.";
 }
 updateSkaterSvg(p);
}
function stopSkater(){
 if(skaterFrame!==null)cancelAnimationFrame(skaterFrame);
 skaterFrame=null;skaterLast=null;skaterPlaying=false;$("skaterPlay").textContent="Play skater";
}
function advanceSkater(timestamp){
 if(!skaterPlaying)return;
 if(skaterLast===null)skaterLast=timestamp;
 const dt=Math.min(.08,Math.max(0,(timestamp-skaterLast)/1000));skaterLast=timestamp;
 const p=skaterData();
 // Only display motion is scaled/capped for legibility, not physical numerics.
 const visualSpeed=Math.sign(p.finalOmega)*Math.min(3,Math.abs(p.finalOmega)*.3);
 skaterAngle=(skaterAngle+visualSpeed*dt)%(2*Math.PI);
 updateSkaterSvg(p);
 skaterFrame=requestAnimationFrame(advanceSkater);
}
for(const id of rotorIds){
 $(id).addEventListener(id==="shape"?"change":"input",()=>{stopRotor();updateRotor()});
}
$("grinderPreset").addEventListener("click",()=>applyRotorPreset("example"));
$("compareHoop").addEventListener("click",()=>applyRotorPreset("hoop"));
$("compareSphere").addEventListener("click",()=>applyRotorPreset("sphere"));
$("zeroTorque").addEventListener("click",()=>{stopRotor();$("rotorTorque").value="0";updateRotor()});
$("rotorPlay").addEventListener("click",()=>{
 if(rotorPlaying){stopRotor();return;}
 if(val("rotorTime")>=15)$("rotorTime").value="0";
 rotorPlaying=true;rotorLast=null;$("rotorPlay").textContent="Pause rotor";
 rotorFrame=requestAnimationFrame(advanceRotor);
});
$("rotorReset").addEventListener("click",()=>{stopRotor();$("rotorTime").value="0";updateRotor()});
for(const id of skaterIds)$(id).addEventListener("input",()=>{stopSkater();updateSkater()});
$("skaterIn").addEventListener("click",()=>{
 stopSkater();$("finalArmRadius").value="0.3";updateSkater();
});
$("skaterOut").addEventListener("click",()=>{
 stopSkater();$("finalArmRadius").value="1.4";updateSkater();
});
$("skaterReset").addEventListener("click",()=>{
 stopSkater();
 for(const [id,value] of [["handMass",2],["coreMoment",3],["initialArmRadius",1.2],
  ["finalArmRadius",.3],["initialSkaterRPM",30]])$(id).value=String(value);
 skaterAngle=0;updateSkater();
});
$("skaterPlay").addEventListener("click",()=>{
 if(skaterPlaying){stopSkater();return;}
 skaterPlaying=true;skaterLast=null;$("skaterPlay").textContent="Pause skater";
 skaterFrame=requestAnimationFrame(advanceSkater);
});
$("skaterResetAngle").addEventListener("click",()=>{stopSkater();skaterAngle=0;updateSkaterSvg(skaterData())});
document.addEventListener("visibilitychange",()=>{if(document.hidden){stopRotor();stopSkater()}});
applyRotorPreset("example");
updateSkater();
})();