/* V48 Unit 5 Work–Energy teaching laboratory.
 * Source: user-supplied NBF Grade XI Unit 5 pp.77–87, especially pp.78–84.
 * All numerical calculations are local; no user data, grades or responses stored.
 */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const NS="http://www.w3.org/2000/svg";
const input=id=>Number($(id).value);
const fmt=n=>!Number.isFinite(n)?"—":String(Number((Math.abs(n)<1e-10?0:n).toFixed(3)));
function metric(id,n,unit){
 const e=$(id);e.dataset.value=String(Math.abs(n)<1e-10?0:n);
 e.textContent=fmt(n)+(unit?" "+unit:"");
}
function label(id,unit){
 $(id+"Label").textContent=fmt(input(id))+" "+unit;
}
function svgEl(tag,attrs,text){
 const e=document.createElementNS(NS,tag);
 for(const [key,value] of Object.entries(attrs||{}))e.setAttribute(key,String(value));
 if(text!==undefined)e.textContent=String(text);
 return e;
}
function poly(points,fill){
 return svgEl("polygon",{points:points.map(p=>p.join(",")).join(" "),fill,opacity:"0.60"});
}
function forceGraph(f0,f1,d){
 const x0=74,x1=660,y0=231,s=2.1;
 const y=f=>y0-f*s;
 const line=$("forceLine"),area=$("forceArea"),grid=$("forceGrid"),labels=$("forceLabels");
 line.replaceChildren();area.replaceChildren();grid.replaceChildren();labels.replaceChildren();
 for(const f of [-30,0,30,60]){
  const gy=y(f);
  grid.append(svgEl("line",{x1:60,x2:678,y1:gy,y2:gy,stroke:f===0?"#394e63":"#d0dfea","stroke-width":f===0?2:1}));
  labels.append(svgEl("text",{x:48,y:gy+5,"font-size":17,fill:"#335770","text-anchor":"end"},String(f)));
 }
 grid.append(svgEl("line",{x1:x0,y1:45,x2:x0,y2:311,stroke:"#344f62","stroke-width":2}));
 grid.append(svgEl("line",{x1:x0,y1:y0,x2:678,y2:y0,stroke:"#344f62","stroke-width":2}));
 const steps=f0*f1<0?[{xa:x0,xb:x0+(0-f0)/(f1-f0)*(x1-x0),fa:f0,fb:0},{xa:x0+(0-f0)/(f1-f0)*(x1-x0),xb:x1,fa:0,fb:f1}]:[{xa:x0,xb:x1,fa:f0,fb:f1}];
 for(const seg of steps){
  const av=(seg.fa+seg.fb)/2;
  area.append(poly([[seg.xa,y0],[seg.xa,y(seg.fa)],[seg.xb,y(seg.fb)],[seg.xb,y0]],av<0?"#d97965":"#42a4b1"));
 }
 line.append(svgEl("line",{x1:x0,y1:y(f0),x2:x1,y2:y(f1),stroke:"#145f8c","stroke-width":5,"stroke-linecap":"round"}));
 for(const [px,f] of [[x0,f0],[x1,f1]])line.append(svgEl("circle",{cx:px,cy:y(f),r:7,fill:"#114a74",stroke:"#fff","stroke-width":2}));
 labels.append(svgEl("text",{x:x0,y:325,"font-size":19,fill:"#244862","text-anchor":"middle"},"0"));
 labels.append(svgEl("text",{x:x1,y:325,"font-size":19,fill:"#244862","text-anchor":"middle"},fmt(d)+" m"));
 labels.append(svgEl("text",{x:125,y:38,"font-size":20,fill:"#204d70","font-weight":700},"F∥ (N)"));
 labels.append(svgEl("text",{x:624,y:328,"font-size":19,fill:"#204d70","font-weight":700},"d (m)"));
}
function updateWork(){
 const f0=input("fStart"),f1=input("fEnd"),d=input("graphDistance");
 for(const id of ["fStart","fEnd"])label(id,"N");
 label("graphDistance","m");
 const avg=(f0+f1)/2,work=avg*d;
 metric("graphAvg",avg,"N");metric("graphWork",work,"J");
 let sign=work>0?"positive net work":work<0?"negative net work":"zero net work";
 if(f0*f1<0)sign+="; the graph crosses the zero-force axis, so positive and negative areas must be subtracted";
 else if(work===0)sign+="; equal positive and negative signed areas may cancel";
 $("graphExplain").textContent="The parallel force varies linearly: Favg = ("+fmt(f0)+" + "+fmt(f1)+")/2 = "+
  fmt(avg)+" N. The signed area is "+fmt(avg)+" × "+fmt(d)+" = "+fmt(work)+" J ("+sign+").";
 forceGraph(f0,f1,d);
 const F=input("forceAngle"),dist=input("angleDistance"),theta=input("theta");
 label("forceAngle","N");label("angleDistance","m");label("theta","°");
 const component=F*Math.cos(theta*Math.PI/180);
 metric("angleComponent",component,"N");
 metric("angleWork",component*dist,"J");
}
function updateKinetic(){
 const m=input("keMass"),u=input("keInitial"),v=input("keFinal");
 label("keMass","kg");label("keInitial","m/s");label("keFinal","m/s");
 const K0=.5*m*u*u,K1=.5*m*v*v,delta=K1-K0;
 metric("keStart",K0,"J");metric("keEnd",K1,"J");metric("keDelta",delta,"J");
 const ratio=u===0?"undefined (u = 0)":fmt(v/u);
 $("keRatio").textContent=ratio;
 if(u===0)delete $("keRatio").dataset.value;
 else $("keRatio").dataset.value=String(v/u);
 $("keExplain").textContent="From v² − u² = 2ad and Wnet = (ma)d, "+
  "Wnet = ½ × "+fmt(m)+" × ("+fmt(v)+"² − "+fmt(u)+"²) = "+fmt(delta)+" J. "+
  (delta>0?"Net work increases kinetic energy.":delta<0?"Net work decreases kinetic energy.":"There is no change in kinetic energy.")+
  " Initial K = "+fmt(K0)+" J; final K = "+fmt(K1)+" J.";
}
function updateFields(){
 const m=input("fieldMass"),r=input("fieldResistance"),g=9.8;
 label("fieldMass","kg");label("fieldResistance","N");
 const gravity=m*g*(10-4),short=-r*10,long=-r*18;
 metric("gravityWork",gravity,"J");
 metric("resistShort",short,"J");
 metric("resistLong",long,"J");
 metric("resistExtra",Math.abs(long)-Math.abs(short),"J");
}
function updateResistive(){
 const m=input("resMass"),u=input("resInitial"),fa=input("resApplied"),fr=input("resOppose"),d=input("resDistance");
 label("resMass","kg");label("resInitial","m/s");label("resApplied","N");
 label("resOppose","N");label("resDistance","m");
 const K0=.5*m*u*u,applied=fa*d,resWork=-fr*d,delta=(fa-fr)*d,targetK=K0+delta;
 metric("resInitialKE",K0,"J");metric("resAppliedWork",applied,"J");
 metric("resResistanceWork",resWork,"J");metric("resNetWork",delta,"J");
 const warning=$("resReachWarning"),exp=$("resExplain");
 if(targetK< -1e-9||(K0===0&&fa<=fr)){
  warning.hidden=false;
  if(K0===0&&fa<=fr){
   warning.textContent="The object starts from rest and has no positive net forward force. "+
     "It cannot begin travelling the requested "+fmt(d)+" m under these constant-force assumptions.";
  }else{
   const stopping=K0/(fr-fa);
   warning.textContent="The object cannot reach "+fmt(d)+" m under the stated constant forces. "+
     "It stops after "+fmt(stopping)+" m (using K₀/(Fᵣ−Fₐ)). "+
     "A negative target kinetic energy is a reachability warning, not a physical final energy.";
  }
  $("resFinalKE").dataset.value="";
  $("resFinalKE").textContent="Not reachable";
  $("resFinalSpeed").dataset.value="";
  $("resFinalSpeed").textContent="Not defined at target";
  exp.textContent="Initial K = "+fmt(K0)+" J; applied work to the unreachable target would be "+
    fmt(applied)+" J and resistance work "+fmt(resWork)+" J. "+
    "The constant-force model is valid only up to the stopping point; motion beyond that requires changed conditions.";
 }else{
  warning.hidden=true;warning.textContent="";
  const fixedK=Math.max(0,targetK),v=Math.sqrt(2*fixedK/m);
  metric("resFinalKE",fixedK,"J");metric("resFinalSpeed",v,"m/s");
  exp.textContent="Work applied = "+fmt(applied)+" J. Work by resistance = "+
    fmt(resWork)+" J. Net work = "+fmt(delta)+" J, giving Ktarget = "+
    fmt(K0)+" + ("+fmt(delta)+") = "+fmt(fixedK)+" J and final speed = "+fmt(v)+" m/s.";
 }
}
const modes={work:updateWork,kinetic:updateKinetic,fields:updateFields,resistive:updateResistive};
const panelIds={work:"workPanel",kinetic:"kineticPanel",fields:"fieldsPanel",resistive:"resistivePanel"};
function selectMode(mode){
 if(!Object.prototype.hasOwnProperty.call(modes,mode))return;
 for(const [key,id] of Object.entries(panelIds)){
  $(id).hidden=key!==mode;
  const tab=document.querySelector('[role="tab"][data-mode="'+key+'"]');
  tab.setAttribute("aria-selected",key===mode?"true":"false");
  tab.tabIndex=key===mode?0:-1;
 }
 modes[mode]();
}
const tabButtons=[...document.querySelectorAll('[role="tab"][data-mode]')];
for(const [i,tab] of tabButtons.entries()){
 tab.addEventListener("click",()=>selectMode(tab.dataset.mode));
 tab.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight"||e.key==="ArrowLeft"){
   e.preventDefault();
   const next=(i+(e.key==="ArrowRight"?1:-1)+tabButtons.length)%tabButtons.length;
   tabButtons[next].focus();selectMode(tabButtons[next].dataset.mode);
  }
 });
}
for(const id of ["fStart","fEnd","graphDistance","forceAngle","angleDistance","theta"])
 $(id).addEventListener("input",updateWork);
for(const id of ["keMass","keInitial","keFinal"])$(id).addEventListener("input",updateKinetic);
for(const id of ["fieldMass","fieldResistance"])$(id).addEventListener("input",updateFields);
for(const id of ["resMass","resInitial","resApplied","resOppose","resDistance"])
 $(id).addEventListener("input",updateResistive);
updateWork();updateKinetic();updateFields();updateResistive();selectMode("work");
})();