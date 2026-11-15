/* Physics with Sir Najam — Unit 4 Part 2 centripetal lab UI.
 * Diagram animation at 30% of model physical time for projector visibility;
 * all numerical physics is computed with unscaled speed/radius/mass.
 * No persistence, account operations or network requests.
 */
(function(){
"use strict";
const model=window.PSNUnit4Centripetal;
if(!model)return;
const $=id=>document.getElementById(id);
const NS="http://www.w3.org/2000/svg";
let playing=false,frame=null,last=null,angle=Math.PI/6;
function el(tag,attrs={},label){
 const n=document.createElementNS(NS,tag);
 for(const [key,value] of Object.entries(attrs))n.setAttribute(key,String(value));
 if(label!==undefined)n.textContent=String(label);
 return n;
}
function txt(root,x,y,value,opts={}){
 root.append(el("text",{"x":x,"y":y,"fill":opts.fill||"#31536d","font-size":opts.size||12,
   "font-weight":opts.weight||"600","text-anchor":opts.anchor||"start"},value));
}
const readable=(number,dp=2)=>model.format(number,dp);
function pointOnCircle(a){
 return {x:244+126*Math.cos(a),y:187-126*Math.sin(a)};
}
function line(id,x1,y1,x2,y2){
 const e=$(id);for(const [key,value] of Object.entries({x1,y1,x2,y2}))e.setAttribute(key,String(value));
}
function updateVectors(){
 const p=pointOnCircle(angle),dirs=model.vectors(angle,"ccw");
 const inwardX=dirs.inward[0],inwardY=-dirs.inward[1];
 const velocityX=dirs.velocity[0],velocityY=-dirs.velocity[1];
 line("radiusRay",244,187,p.x,p.y);
 line("velocityArrow",p.x,p.y,p.x+78*velocityX,p.y+78*velocityY);
 line("forceArrow",p.x,p.y,p.x+82*inwardX,p.y+82*inwardY);
 $("bodyPoint").setAttribute("cx",p.x);
 $("bodyPoint").setAttribute("cy",p.y);
 $("velocityLabel").setAttribute("x",p.x+88*velocityX);
 $("velocityLabel").setAttribute("y",p.y+88*velocityY-9);
 $("forceLabel").setAttribute("x",p.x+80*inwardX);
 $("forceLabel").setAttribute("y",p.y+80*inwardY-9);
 $("circlePlot").setAttribute("aria-label",
  "At the current position on the circle, blue velocity is tangential and amber net force and centripetal acceleration point toward the centre.");
}
function drawGraph(mass,speed,radius){
 const g=$("forceGraph"),left=64,right=495,top=26,bottom=250;
 const maxSpeed=30;
 const maxForce=Math.max(.0001,model.circle(mass,maxSpeed,radius).centripetalNetForce);
 const X=v=>left+(right-left)*(v/maxSpeed);
 const Y=f=>bottom-(bottom-top)*(f/maxForce);
 const parts=[
 el("title",{},"Centripetal force increases quadratically with speed, at fixed mass and radius."),
 el("line",{x1:left,y1:top,x2:left,y2:bottom,stroke:"#9db4c7","stroke-width":1.5}),
 el("line",{x1:left,y1:bottom,x2:right,y2:bottom,stroke:"#9db4c7","stroke-width":1.5})
 ];
 let d="";
 for(let v=0;v<=maxSpeed+1e-9;v+=.25){
  const f=model.circle(mass,v,radius).centripetalNetForce;
  d+=(v===0?"M":"L")+X(v).toFixed(2)+","+Y(f).toFixed(2)+" ";
 }
 parts.push(el("path",{d,fill:"none",stroke:"#147a94","stroke-width":3,"stroke-linejoin":"round"}));
 const currentForce=model.circle(mass,speed,radius).centripetalNetForce;
 parts.push(el("line",{x1:X(speed),y1:top,x2:X(speed),y2:bottom,
  stroke:"#bb7841","stroke-dasharray":"5 5","stroke-width":1.5}));
 parts.push(el("circle",{cx:X(speed),cy:Y(currentForce),r:6,fill:"#bb7841"}));
 g.replaceChildren(...parts);
 txt(g,left-7,top+5,readable(maxForce,0)+" N",{anchor:"end",size:11});
 txt(g,left-7,bottom, "0",{anchor:"end",size:11});
 txt(g,left,bottom+19,"0 m/s",{size:12});
 txt(g,right,bottom+19,"30 m/s",{anchor:"end",size:12});
 txt(g,left,16,"F (N)",{weight:"800"});
 txt(g,left+120,16,"Selected: "+readable(speed,1)+" m/s → "+readable(currentForce,1)+" N",{size:12,weight:"800",fill:"#aa6b32"});
 g.setAttribute("aria-label","Centripetal force vs speed for mass "+readable(mass,1)+
  " kilograms and radius "+readable(radius,2)+" metres. Current speed "+
  readable(speed,1)+" metres per second requires "+readable(currentForce,1)+" newtons inward.");
}
const sourceText={
 friction:"A vehicle on a flat, unbanked curve needs an inward force. Static tyre–road friction supplies it while the tyres roll without skidding. This display does not calculate the maximum available friction.",
 tension:"A rotating object on a string needs a force toward the circle centre. Where string tension is the sole radial force, T = mv²/r. Releasing the string sends the object initially along the tangent.",
 normal:"On an ideally friction-free banked turn, the inward horizontal component of the normal reaction provides mv²/r; its vertical component balances mg. The displayed angle is the design angle for the selected speed.",
 gravity:"In circular orbital motion, gravity can provide the required inward net force. The slider values are a schematic motion example, not realistic orbital dimensions; detailed satellite physics follows in a later lesson."
};
function readInputs(){
 return {mass:Number($("mass").value),speed:Number($("speed").value),radius:Number($("radius").value)};
}
function update(){
 const {mass,speed,radius}=readInputs();
 const p=model.circle(mass,speed,radius),bank=model.frictionlessBank(speed,radius);
 const scale=model.scaling(mass,speed,radius);
 $("massValue").textContent=readable(mass,mass<10?2:1)+" kg";
 $("speedValue").textContent=readable(speed,2)+" m/s";
 $("radiusValue").textContent=readable(radius,2)+" m";
 $("ac").textContent=readable(p.centripetalAcceleration,3)+" m/s²";
 $("fc").textContent=readable(p.centripetalNetForce,2)+" N";
 $("omega").textContent=readable(p.angularSpeed,3)+" rad/s";
 $("at").textContent="0 m/s²";
 $("doubleSpeed").textContent=readable(scale.doubleSpeed,2)+" N";
 $("doubleRadius").textContent=readable(scale.doubleRadius,2)+" N";
 $("mechanismText").textContent=sourceText[$("mechanism").value]||sourceText.friction;
 $("bankAngle").textContent=readable(bank.angleDegrees,2)+"°";
 $("bankTangent").textContent=readable(bank.tanTheta,4);
 const normal=mass*model.G/Math.cos(bank.angleRadians);
 $("normal").textContent=readable(normal,2)+" N";
 $("scalingText").textContent="At these values, F = "+readable(scale.base,2)+
  " N. At DOUBLE speed (same m and r): "+readable(scale.doubleSpeed,2)+
  " N (×4). At DOUBLE radius (same m and v): "+readable(scale.doubleRadius,2)+
  " N (×½). Doubling the mass gives "+readable(scale.doubleMass,2)+" N (×2).";
 const stationary=speed===0;
 $("bankExplanation").textContent=stationary?
  "At zero speed the equation gives θ = 0°. The nonzero-angle bank result only applies at a moving design speed with no friction and no vertical acceleration.":
  "Friction-free ideal bank at "+readable(speed,2)+" m/s on radius "+
    readable(radius,2)+" m: θ ≈ "+readable(bank.angleDegrees,2)+
    "°. Normal-force components satisfy N sinθ = mv²/r and N cosθ = mg. Mass cancels in the angle.";
 updateVectors();
 drawGraph(mass,speed,radius);
}
function stop(){
 if(frame!==null)cancelAnimationFrame(frame);
 frame=null;last=null;playing=false;
 $("play").textContent="Play motion";
}
function animate(timestamp){
 if(!playing)return;
 if(last===null)last=timestamp;
 const dt=Math.min(.07,Math.max(0,(timestamp-last)/1000));last=timestamp;
 const {speed,radius}=readInputs();
 angle=(angle+(speed/radius)*dt*.3)%(2*Math.PI);
 updateVectors();
 frame=requestAnimationFrame(animate);
}
function preset(name){
 stop();
 let values=null,mechanism="friction";
 if(name==="example-4.2"){
  const ex=model.example42();
  values={mass:ex.mass,speed:ex.speed,radius:ex.radius};mechanism="friction";
 }else if(name==="flat-road"){values={mass:1000,speed:15,radius:45};mechanism="friction";}
 else if(name==="string"){values={mass:2,speed:6,radius:5};mechanism="tension";}
 else if(name==="banked"){values={mass:900,speed:12,radius:50};mechanism="normal";}
 if(!values)return;
 for(const [id,value] of Object.entries(values))$(id).value=String(value);
 $("mechanism").value=mechanism;
 angle=Math.PI/6;
 update();
}
for(const id of ["mass","speed","radius"])$(id).addEventListener("input",update);
$("mechanism").addEventListener("change",update);
for(const button of document.querySelectorAll("[data-preset]"))
 button.addEventListener("click",()=>preset(button.dataset.preset));
$("play").addEventListener("click",()=>{
 if(playing){stop();return;}
 playing=true;last=null;$("play").textContent="Pause motion";
 frame=requestAnimationFrame(animate);
});
$("resetPosition").addEventListener("click",()=>{
 stop();angle=Math.PI/6;updateVectors();
});
document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();});
preset("example-4.2");
})();