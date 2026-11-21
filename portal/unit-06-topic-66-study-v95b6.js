/* V95-B6 — teacher-developed client-only ideal-fluid applications.
 * Torricelli, Venturi and simplified educational lift: no network, storage,
 * user identity, school grades or real-world safety/design certification.
 */
(function(){
'use strict';
const id=k=>document.getElementById(k);
const fmt=n=>{
 if(n===0)return '0';
 const value=Number(n.toPrecision(7));
 return Math.abs(value)>=.000001&&Math.abs(value)<1e9
  ? value.toLocaleString('en-US',{maximumFractionDigits:8})
  : value.toExponential(5);
};
function number(key,min,max){
 const field=id(key),raw=field.value.trim(),value=Number(raw);
 if(raw===''||!Number.isFinite(value)||value<min||value>max){
  throw {field,message:(field.labels?.[0]?.textContent?.trim()||key)+' must be between '+min+' and '+max+'.'};
 }
 return value;
}
function line(label,message){
 const p=document.createElement('p'),strong=document.createElement('strong');
 strong.textContent=label;p.append(strong,document.createTextNode(' '+message));return p;
}
function fail(err,element){element.textContent=err?.message||'Invalid physical input.';element.hidden=false;err?.field?.focus();}
function bind(formId,errorId,outputId,compute){
 const form=id(formId),error=id(errorId),output=id(outputId);
 if(!form||!error||!output)return;
 form.addEventListener('submit',e=>{
  e.preventDefault();error.hidden=true;
  try{output.replaceChildren(...compute());}catch(err){fail(err,error);}
 });
}
bind('torricelli-form','torricelli-error','torricelli-output',()=>{
 const H=number('tank-head',0,1e5),g=number('tank-gravity',.000001,1000),areaCm2=number('tank-area',.000001,1e5);
 const speed=Math.sqrt(2*g*H),area=areaCm2*1e-4,Q=area*speed;
 if(![speed,Q].every(Number.isFinite))throw {field:id('tank-head'),message:'Model output exceeds supported numeric range.'};
 return [
  line('Ideal outlet speed:','v = √(2gH) = '+fmt(speed)+' m/s.'),
  line('Outlet area and ideal volume rate:','A = '+fmt(area)+' m²; Q = Av = '+fmt(Q)+' m³/s = '+fmt(Q*1000)+' L/s.'),
  line('Assumptions:','Large open tank, equal atmospheric pressure at free surface/outlet, negligible surface speed and losses. This is an instant at the specified head.')
 ];
});
function preset(formId,map){
 for(const [field,value] of Object.entries(map))id(field).value=String(value);
 id(formId).requestSubmit();
}
id('preset-venturi-area')?.addEventListener('click',()=>preset('venturi-form',{
 'venturi-area-in':12,'venturi-area-out':6,'venturi-speed-in':2,'venturi-density':1000
}));
id('preset-venturi-diameters')?.addEventListener('click',()=>preset('venturi-form',{
 'venturi-area-in':16,'venturi-area-out':4,'venturi-speed-in':1.5,'venturi-density':1000
}));
bind('venturi-form','venturi-error','venturi-output',()=>{
 const A1=number('venturi-area-in',.000001,1e6),A2=number('venturi-area-out',.000001,1e6);
 const v1=number('venturi-speed-in',0,1e5),rho=number('venturi-density',.000001,25000);
 if(A2>=A1)throw {field:id('venturi-area-out'),message:'For the narrow-throat exercise, the throat area A₂ must be less than the wide inlet area A₁.'};
 const ratio=A1/A2,v2=ratio*v1,dP=.5*rho*(v2*v2-v1*v1),Q=A1*1e-4*v1;
 if(![v2,dP,Q].every(Number.isFinite)||v2>1e11)throw {field:id('venturi-area-out'),message:'Model outputs exceed supported numeric range.'};
 return [
  line('Ideal throat speed:','v₂ = (A₁/A₂)v₁ = '+fmt(v2)+' m/s. Area ratio = '+fmt(ratio)+'.'),
  line('Inlet-minus-throat static pressure difference:','P₁ − P₂ = '+fmt(dP)+' Pa = '+fmt(dP/1000)+' kPa.'),
  line('Conserved volume rate:','Q = '+fmt(Q)+' m³/s = '+fmt(Q*1000)+' L/s (steady incompressible, no leaks).'),
  line('Model condition:','Horizontal ideal streamtube; real turbulence and loss coefficients not included. Piezometer relation needs two open same-liquid columns.')
 ];
});
id('preset-wing-moderate')?.addEventListener('click',()=>preset('wing-form',{
 'wing-upper-speed':80,'wing-lower-speed':60,'wing-air-density':1.2,'wing-effective-area':20
}));
id('preset-wing-textbook')?.addEventListener('click',()=>preset('wing-form',{
 'wing-upper-speed':450,'wing-lower-speed':410,'wing-air-density':1.29,'wing-effective-area':45
}));
bind('wing-form','wing-error','wing-output',()=>{
 const upper=number('wing-upper-speed',0,1e5),lower=number('wing-lower-speed',0,1e5);
 const rho=number('wing-air-density',.000001,25000),area=number('wing-effective-area',.000001,1e6);
 const pressure=.5*rho*(upper*upper-lower*lower);
 const force=pressure*area;
 if(![pressure,force].every(Number.isFinite))throw {field:id('wing-air-density'),message:'Model outputs exceed supported range.'};
 // High-speed warning triggered at 300 m/s for clear textbook 450/410 illustration,
 // NOT a universal Mach threshold. Actual speed of sound depends on gas temperature.
 const high=Math.max(upper,lower)>=300;
 const conclusion=high
  ? 'HIGH-SPEED MODEL WARNING: these speeds are near or beyond typical speed of sound in air. Compressibility and real pressure distribution invalidate this toy formula as a real-wing lift prediction.'
  : 'This is still a simplified constant-density and uniform-pressure-difference classroom estimate, NOT measured or certified lift of an actual wing.';
 return [
  line('Formal simplified pressure difference (lower minus upper):','ΔP = ½ρ(vupper² − vlower²) = '+fmt(pressure)+' Pa.'),
  line('Formal simplified wing force:','F ≈ ΔP A = '+fmt(force)+' N. A negative sign denotes a downward force under the chosen model direction.'),
  line('Physical interpretation:',conclusion)
 ];
});
})();
