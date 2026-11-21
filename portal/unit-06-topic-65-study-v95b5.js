/* V95-B5: browser-local Bernoulli pressure and head learning calculators.
 * These are ideal-flow models, not measurements. No network, persistent storage,
 * identity, school grade or authentication access is used.
 */
(function(){
'use strict';
const pressureForm=document.getElementById('bernoulli-pressure-form');
const headForm=document.getElementById('bernoulli-head-form');
if(!pressureForm||!headForm)return;
const id=x=>document.getElementById(x);
function number(field,min,max){
 const raw=field.value.trim(),v=Number(raw);
 if(raw===''||!Number.isFinite(v)||v<min||v>max){
  throw {field,message:(field.labels?.[0]?.textContent?.trim()||'Value')+' must be a finite number between '+min+' and '+max+'.'};
 }
 return v;
}
const value=(name,min,max)=>number(id(name),min,max);
const fmt=v=>{
 if(v===0)return '0';
 const n=Number(v.toPrecision(7));
 if(Math.abs(n)>=.000001&&Math.abs(n)<1e9)return n.toLocaleString('en-US',{maximumFractionDigits:7});
 return n.toExponential(5);
};
function paragraph(title,message){
 const p=document.createElement('p'),strong=document.createElement('strong');
 strong.textContent=title;
 p.append(strong,document.createTextNode(' '+message));
 return p;
}
function fail(err,element){
 element.textContent=err?.message||'Please enter valid numeric inputs.';
 element.hidden=false;
 err?.field?.focus();
}
function preset(values){
 for(const [key,v] of Object.entries(values))id(key).value=String(v);
 pressureForm.requestSubmit();
}
id('preset-horizontal')?.addEventListener('click',()=>preset({
 'bern-density':1000,'bern-gravity':9.8,'bern-pressure-in':180,
 'bern-speed-in':2,'bern-speed-out':5,'bern-height-in':0,'bern-height-out':0
}));
id('preset-rising')?.addEventListener('click',()=>preset({
 'bern-density':1000,'bern-gravity':9.8,'bern-pressure-in':220,
 'bern-speed-in':3,'bern-speed-out':4,'bern-height-in':2,'bern-height-out':8
}));
id('preset-slowing')?.addEventListener('click',()=>preset({
 'bern-density':1000,'bern-gravity':9.8,'bern-pressure-in':150,
 'bern-speed-in':4,'bern-speed-out':2,'bern-height-in':5,'bern-height-out':7
}));
pressureForm.addEventListener('submit',event=>{
 event.preventDefault();
 const error=id('bern-pressure-error');error.hidden=true;
 try{
  const rho=value('bern-density',.000001,25000);
  const g=value('bern-gravity',.000001,1000);
  const p1=value('bern-pressure-in',-1e6,1e6)*1000;
  const v1=value('bern-speed-in',0,1e5),v2=value('bern-speed-out',0,1e5);
  const h1=value('bern-height-in',-1e6,1e6),h2=value('bern-height-out',-1e6,1e6);
  const kinetic=.5*rho*(v1*v1-v2*v2);
  const elevation=rho*g*(h1-h2);
  const p2=p1+kinetic+elevation;
  if(![kinetic,elevation,p2].every(Number.isFinite))throw {field:id('bern-density'),message:'The calculated values exceed the supported numeric range.'};
  const physical=p2<0
   ? 'The calculated static pressure is negative with the chosen reference. Negative gauge pressure can occur, but a negative absolute pressure would be impossible; verify the pressure reference and ideal-model assumptions.'
   : 'The algebra gives the stated pressure for the assumed ideal streamline. The actual pressure in a lossy real flow may differ.';
  id('bern-pressure-output').replaceChildren(
   paragraph('Ideal downstream static pressure:','P₂ = '+fmt(p2/1000)+' kPa ('+fmt(p2)+' Pa).'),
   paragraph('Signed speed contribution:','½ρ(v₁² − v₂²) = '+fmt(kinetic/1000)+' kPa.'),
   paragraph('Signed elevation contribution:','ρg(h₁ − h₂) = '+fmt(elevation/1000)+' kPa.'),
   paragraph('Interpretation:',physical)
  );
 }catch(err){fail(err,error);}
});
headForm.addEventListener('submit',event=>{
 event.preventDefault();
 const error=id('bern-head-error');error.hidden=true;
 try{
  const pressure=value('head-pressure',-1e6,1e6)*1000;
  const speed=value('head-speed',0,1e5),h=value('head-height',-1e6,1e6);
  const rho=value('head-density',.000001,25000),g=value('head-gravity',.000001,1000);
  const pHead=pressure/(rho*g),vHead=speed*speed/(2*g),total=pHead+vHead+h;
  if(![pHead,vHead,total].every(Number.isFinite)||Math.max(Math.abs(pHead),Math.abs(vHead),Math.abs(total))>1e12){
   throw {field:id('head-density'),message:'The calculated head exceeds the supported display range.'};
  }
  id('bern-head-output').replaceChildren(
   paragraph('Pressure head:','P/(ρg) = '+fmt(pHead)+' m.'),
   paragraph('Velocity head:','v²/(2g) = '+fmt(vHead)+' m.'),
   paragraph('Elevation head:','h = '+fmt(h)+' m.'),
   paragraph('Total head:','H = '+fmt(total)+' m. These are metres, not pascals, and refer to one chosen height and pressure datum.')
  );
 }catch(err){fail(err,error);}
});
})();
