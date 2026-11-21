/* V95-B2: independent local-only Stokes-model exploratory calculator.
 * Numeric Stokes outputs are ALWAYS explicitly model-based. Re uses an
 * additional fluid-density input; no server calls, data storage or grades.
 */
(function(){
'use strict';
const form=document.getElementById('stokes-form');
if(!form)return;
const eta=document.getElementById('viscosity');
const radius=document.getElementById('sphere-radius');
const speed=document.getElementById('relative-speed');
const rho=document.getElementById('fluid-density');
const error=document.getElementById('calc-error');
const output=document.getElementById('calc-output');
const slow=document.getElementById('preset-slow');
const textbook=document.getElementById('preset-textbook');
function number(field,min,max){
 const raw=field.value.trim();
 const val=Number(raw);
 if(raw===''||!Number.isFinite(val)||val<min||val>max){
  throw {field,message:field.labels?.[0]?.textContent.trim()+' must be a finite number between '+min+' and '+max+'.'};
 }
 return val;
}
function item(label,message){
 const p=document.createElement('p'),s=document.createElement('strong');
 s.textContent=label;p.append(s,document.createTextNode(' '+message));return p;
}
function fmt(n){
 if(n===0)return '0';
 if(Math.abs(n)>=1e-3&&Math.abs(n)<1e6)return Number(n.toPrecision(6)).toLocaleString('en-US',{maximumFractionDigits:7});
 return n.toExponential(4);
}
function preset(values){
 [eta,radius,speed,rho].forEach((field,i)=>{field.value=String(values[i]);});
 form.requestSubmit();
}
slow?.addEventListener('click',()=>preset([.1,.05,.001,1000]));
textbook?.addEventListener('click',()=>preset([1.9e-5,2,2,1.2]));
form.addEventListener('submit',event=>{
 event.preventDefault();
 error.hidden=true;
 try{
  const viscosity=number(eta,1e-9,100000);
  const rMm=number(radius,1e-6,1000);
  const v=number(speed,0,100000);
  const fluidDensity=number(rho,1e-6,25000);
  const rMetres=rMm/1000;
  const force=6*Math.PI*viscosity*rMetres*v;
  const Re=2*fluidDensity*v*rMetres/viscosity;
  if(!Number.isFinite(force)||!Number.isFinite(Re)){
   throw {field:eta,message:'The given values produce a result outside the supported numeric range.'};
  }
  let verdict;
  if(v===0){
   verdict='Zero relative motion gives zero Stokes drag in this expression. Terminal force balance must be studied separately.';
  }else if(Re<.1){
   verdict='Re is well below 1. Creeping-flow use is plausible for an isolated sphere in a suitable Newtonian fluid if the remaining physical conditions are satisfied.';
  }else if(Re<1){
   verdict='Re is below 1 but not comfortably much smaller than 1. The strict creeping-flow approximation needs caution and an independent model check.';
  }else{
   verdict='Re is not much smaller than 1. Stokes’ slow-sphere assumption is not satisfied: the calculated force is a formal algebraic value, NOT a trustworthy real drag prediction.';
  }
  output.replaceChildren(
   item('Stokes drag (formal):','Fd = 6πηrv = '+fmt(force)+' N.'),
   item('Reynolds number (supplementary):','Re = 2ρfluidvr/η = '+fmt(Re)+' (dimensionless).'),
   item('Model interpretation:',verdict)
  );
 }catch(e){
  error.textContent=e?.message||'Please enter valid physical inputs.';
  error.hidden=false;
  e?.field?.focus();
 }
});
})();
