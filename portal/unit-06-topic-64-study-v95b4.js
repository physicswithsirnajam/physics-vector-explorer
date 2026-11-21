/* V95-B4: client-only continuity demonstrations.
 * Computes conservation of mass across one steady unbranched flow and
 * the special case of n equal incompressible outlets.
 * Does not predict real system pressure or before/after squeeze discharge.
 */
(function(){
'use strict';
const massForm=document.getElementById('mass-continuity-form');
const branchForm=document.getElementById('branch-continuity-form');
if(!massForm||!branchForm)return;
const id=x=>document.getElementById(x);
function numeric(field,min,max,integer){
 const raw=field.value.trim();
 const value=Number(raw);
 if(raw===''||!Number.isFinite(value)||value<min||value>max||(integer&&!Number.isInteger(value))){
  throw {field,message:(field.labels?.[0]?.textContent?.trim()||'Value')+' must be '+(integer?'an integer ':'a number ')+'between '+min+' and '+max+'.'};
 }
 return value;
}
const read=(field,min,max,integer=false)=>numeric(id(field),min,max,integer);
function fmt(n){
 if(n===0)return '0';
 const x=Number(n.toPrecision(7));
 if(Math.abs(x)>=0.0001&&Math.abs(x)<1e7)return x.toLocaleString('en-US',{maximumFractionDigits:8});
 return x.toExponential(5);
}
function sentence(label,message){
 const p=document.createElement('p'),strong=document.createElement('strong');
 strong.textContent=label;
 p.append(strong,document.createTextNode(' '+message));
 return p;
}
function showError(el,err){
 el.textContent=err?.message||'Please enter physically valid values.';
 el.hidden=false;
 err?.field?.focus();
}
function preset(mapping,form){
 for(const [key,value] of Object.entries(mapping))id(key).value=String(value);
 form.requestSubmit();
}
id('preset-water')?.addEventListener('click',()=>preset({
 'rho-in':1000,'area-in':.012,'speed-in':1.5,'rho-out':1000,'area-out':.004
},massForm));
id('preset-gas')?.addEventListener('click',()=>preset({
 'rho-in':1.2,'area-in':.08,'speed-in':3,'rho-out':.9,'area-out':.06
},massForm));
massForm.addEventListener('submit',e=>{
 e.preventDefault();
 const err=id('continuity-error');err.hidden=true;
 try{
  const rho1=read('rho-in',.000001,25000),a1=read('area-in',1e-9,1e6);
  const v1=read('speed-in',0,1e5),rho2=read('rho-out',.000001,25000),a2=read('area-out',1e-9,1e6);
  const massRate=rho1*a1*v1,v2=massRate/(rho2*a2);
  const q1=a1*v1,q2=a2*v2;
  if(![massRate,v2,q1,q2].every(Number.isFinite)||v2>1e11){
   throw {field:id('area-out'),message:'The required flow speed exceeds the supported illustration range.'};
  }
  const equalDensity=Math.abs(rho1-rho2)<=1e-12*Math.max(1,rho1,rho2);
  const description=equalDensity
   ? 'Incompressible comparison: both sections pass '+fmt(q1)+' m³/s at this one steady flow instant.'
   : 'Densities differ, so volume rates need not match: Q₁ = '+fmt(q1)+' m³/s and Q₂ = '+fmt(q2)+' m³/s. The same mass throughput is conserved.';
  id('continuity-output').replaceChildren(
   sentence('Required downstream speed:','v₂ = (ρ₁A₁v₁)/(ρ₂A₂) = '+fmt(v2)+' m/s.'),
   sentence('Conserved mass rate:','ṁ = ρ₁A₁v₁ = ρ₂A₂v₂ = '+fmt(massRate)+' kg/s.'),
   sentence('Volume-flow interpretation:',description),
   sentence('Physical boundary:','This is a steady, no-leak mass balance. The equation alone neither calculates pressure nor fixes discharge for two different hose settings.')
  );
 }catch(ex){showError(err,ex);}
});
id('preset-aorta')?.addEventListener('click',()=>preset({
 'branch-inlet-radius':.8,'branch-inlet-speed':.33,'branch-outlet-radius':.4,'branch-count':30
},branchForm));
id('preset-three')?.addEventListener('click',()=>preset({
 'branch-inlet-radius':1.2,'branch-inlet-speed':1,'branch-outlet-radius':.6,'branch-count':3
},branchForm));
branchForm.addEventListener('submit',e=>{
 e.preventDefault();const err=id('branch-error');err.hidden=true;
 try{
  const rIn=read('branch-inlet-radius',.000001,1e5),vIn=read('branch-inlet-speed',0,1e5);
  const rBranch=read('branch-outlet-radius',.000001,1e5),n=read('branch-count',1,1e5,true);
  const speed=(rIn/rBranch)**2*vIn/n;
  const inletQ=Math.PI*(rIn/100)**2*vIn;
  const eachQ=inletQ/n;
  if(![speed,inletQ,eachQ].every(Number.isFinite)||speed>1e11){
   throw {field:id('branch-outlet-radius'),message:'The required speed is beyond the model display range.'};
  }
  id('branch-output').replaceChildren(
   sentence('Mean speed of each branch:','v₍b₎ = (r₍in₎/r₍b₎)²(v₍in₎/n) = '+fmt(speed)+' m/s.'),
   sentence('Volume rate conservation:','Q in = '+fmt(inletQ)+' m³/s; each of '+n+' equal outlets carries '+fmt(eachQ)+' m³/s.'),
   sentence('Physical assumption:','The flow is incompressible, steady, without leakage, and divides equally among all '+n+' identical outlets. This is an average-flow model.')
  );
 }catch(ex){showError(err,ex);}
});
})();
