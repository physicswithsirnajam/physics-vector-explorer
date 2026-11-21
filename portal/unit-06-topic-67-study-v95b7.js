/* V95-B7 — Source-bounded superfluidity learning aids.
 * Browser-only Kelvin conversion and conceptual observation helper.
 * Neither tool can determine a phase from temperature alone, infer a vortex
 * count/critical speed, store student data or contact a server.
 */
(function(){
'use strict';
const el=k=>document.getElementById(k);
const form=el('helium-converter-form'),concept=el('superfluid-concept-form');
if(!form||!concept)return;
function format(n){
 if(n===0)return '0';
 const x=Number(n.toPrecision(8));
 return Math.abs(x)>=.000001&&Math.abs(x)<1e10
  ? x.toLocaleString('en-US',{maximumFractionDigits:9})
  : x.toExponential(6);
}
function line(label,msg){
 const p=document.createElement('p'),strong=document.createElement('strong');
 strong.textContent=label;
 p.append(strong,document.createTextNode(' '+msg));
 return p;
}
function preset(temp,isotope){
 el('helium-temp-k').value=String(temp);
 el('helium-isotope').value=isotope;
 form.requestSubmit();
}
el('preset-he4')?.addEventListener('click',()=>preset(2.17,'he4'));
el('preset-he3')?.addEventListener('click',()=>preset(.0025,'he3'));
el('preset-millikelvin')?.addEventListener('click',()=>preset(.003,'he3'));
form.addEventListener('submit',event=>{
 event.preventDefault();const error=el('helium-error');error.hidden=true;
 try{
  const field=el('helium-temp-k');
  const raw=field.value.trim(),temperature=Number(raw);
  if(raw===''||!Number.isFinite(temperature)||temperature<0||temperature>1e6)
   throw {field,message:'Temperature must be a finite Kelvin value from 0 to 1,000,000 K.'};
  const isotope=el('helium-isotope').value;
  if(isotope!=='he4'&&isotope!=='he3')
   throw {field:el('helium-isotope'),message:'Choose either the helium-4 or helium-3 source reference.'};
  const reference=isotope==='he4'?2.17:.0025;
  const label=isotope==='he4'?'⁴He':'³He';
  const difference=temperature-reference;
  const tolerance=Math.max(1e-12,reference*1e-10);
  const assessment=Math.abs(difference)<=tolerance
   ? 'numerically equal to'
   : difference>0?'above':'below';
  const relative=Math.abs(difference)<=tolerance?''
   : ' by '+format(Math.abs(difference))+' K';
  const note=temperature===0
   ? 'Zero kelvin is a theoretical lower limit, not a laboratory temperature attained by entering the value 0 in this form. '
   : '';
  el('helium-output').replaceChildren(
   line('Unit conversions:','T = '+format(temperature)+' K = '+format(temperature*1000)+' mK = '+format(temperature*1e6)+' μK = '+format(temperature-273.15)+' °C.'),
   line('Source benchmark comparison:','T is '+assessment+' the prepared '+label+' reference ('+format(reference)+' K)'+relative+'.'),
   line('Important limitation:',note+'This compares reported rounded numbers only. Isotope, pressure and verified phase boundaries are required to determine the actual fluid state; this tool does not label samples superfluid or normal.')
  );
 }catch(ex){
  error.textContent=ex?.message||'Please check the entered temperature.';
  error.hidden=false;
  ex?.field?.focus();
 }
});
const explanations={
 film:['Surface-film creep','A thin film may move over the rim of an open vessel along a continuous surface route, transferring liquid outside. This is not bulk liquid jumping over a wall.'],
 vortex:['Persistent vortex','Absence of ordinary viscous damping permits very long-lived circulation in the simplified model. Actual energy can still transfer through other mechanisms.'],
 below:['Below a particular onset','The superfluid can remain vortex-free below the critical onset for the specified arrangement. The source does not supply a universal numerical threshold.'],
 graph:['Read both coordinates','A verified helium phase diagram uses horizontal temperature (K) and vertical pressure (MPa). A reliable phase region requires an actual verified plotted boundary; this guide cannot assign one.']
};
concept.addEventListener('submit',event=>{
 event.preventDefault();
 const choice=el('superfluid-observation').value;
 const selected=explanations[choice];
 const target=el('superfluid-concept-output');
 if(!selected){target.replaceChildren(line('Select an observation:','Choose one of the provided conceptual situations.'));return;}
 target.replaceChildren(line(selected[0]+':',selected[1]));
});
})();
