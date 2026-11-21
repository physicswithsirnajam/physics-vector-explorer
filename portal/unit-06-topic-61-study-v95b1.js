/* V95-B1: local-only educational Archimedes calculator.
 * No school grade, data storage, network request or access control.
 * Given V is the currently displaced volume, NOT a prediction of final flotation.
 */
(function(){
'use strict';
const form=document.getElementById('buoyancy-form');
if(!form)return;
const output=document.getElementById('calc-output');
const error=document.getElementById('calc-error');
const density=document.getElementById('fluid-density');
const volume=document.getElementById('displaced-litres');
const weight=document.getElementById('body-weight');
const fmt=n=>Number(n.toPrecision(7)).toLocaleString('en-US',{maximumFractionDigits:7});
function para(label,value){
 const p=document.createElement('p');
 const strong=document.createElement('strong');
 strong.textContent=label;
 p.append(strong,document.createTextNode(' '+value));
 return p;
}
function readNumber(field,min,max){
 const raw=field.value.trim();
 const value=Number(raw);
 if(raw===''||!Number.isFinite(value)||value<min||value>max){throw {field,message:field.labels?.[0]?.textContent.trim()+' must be between '+min+' and '+max+'.'};}
 return value;
}
form.addEventListener('submit',function(event){
 event.preventDefault();
 error.hidden=true;
 try{
  const rho=readNumber(density,1,25000);
  const litres=readNumber(volume,.001,10000);
  const w=readNumber(weight,0,100000000);
  const displaced=litres/1000;
  const Fb=rho*9.8*displaced;
  const net=Fb-w;
  if(!Number.isFinite(Fb)||!Number.isFinite(net))throw {field:density,message:'The given values exceed the supported calculation range.'};
  const tolerance=Math.max(0.00001,Math.max(Fb,w)*1e-12);
  const direction=Math.abs(net)<=tolerance
   ? 'Buoyancy and weight balance for this specified immersion (net vertical force approximately zero, ignoring support and drag).'
   : 'Buoyancy is '+fmt(Math.abs(net))+' N '+(net>0?'greater':'less')+' than the specified weight; the resulting buoyancy-minus-weight force is '+(net>0?'upward':'downward')+' before support and drag.';
  output.replaceChildren(
   para('Given:', 'ρf = '+fmt(rho)+' kg/m³; Vdisplaced = '+fmt(litres)+' L = '+fmt(displaced)+' m³; g = 9.8 m/s².'),
   para('Upthrust:', 'FB = '+fmt(rho)+' × 9.8 × '+fmt(displaced)+' = '+fmt(Fb)+' N upward.'),
   para('At this specified immersion:', direction)
  );
 } catch(err){
  error.textContent=err?.message||'Please enter valid numeric values.';
  error.hidden=false;
  if(err?.field)err.field.focus();
 }
});
})();
