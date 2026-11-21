/* V95-B3: supplementary, local-only fluid-volume transfer calculations.
 * No network calls, storage, account access or school-grading operation.
 * Qavg = total transferred volume / total elapsed time.
 * The arithmetic mean of unequal-duration interval rates is generally wrong.
 */
(function(){
'use strict';
const flowForm=document.getElementById('flow-rate-form');
const intervalsForm=document.getElementById('two-interval-form');
if(!flowForm||!intervalsForm)return;
const output=document.getElementById('rate-output');
const rateError=document.getElementById('rate-error');
const intervalsOutput=document.getElementById('interval-output');
const intervalError=document.getElementById('interval-error');
const byId=id=>document.getElementById(id);
const format=n=>{
 if(n===0)return '0';
 if(Math.abs(n)>=.00001&&Math.abs(n)<1e9)return Number(n.toPrecision(7)).toLocaleString('en-US',{maximumFractionDigits:8});
 return n.toExponential(5);
};
function number(id,min,max){
 const field=byId(id);
 const val=Number(field.value);
 if(field.value.trim()===''||!Number.isFinite(val)||val<min||val>max){
  const name=field.labels?.[0]?.textContent.trim()||id;
  throw {field,message:name+' must be between '+min+' and '+max+'.'};
 }
 return val;
}
function row(label,text){
 const el=document.createElement('p'),strong=document.createElement('strong');
 strong.textContent=label;
 el.append(strong,document.createTextNode(' '+text));
 return el;
}
function renderFailure(error,err){
 error.textContent=err?.message||'Please enter valid volumes and times.';
 error.hidden=false;
 err?.field?.focus();
}
flowForm.addEventListener('submit',event=>{
 event.preventDefault();rateError.hidden=true;
 try{
  const volume=number('transfer-litres',0,1e8);
  const time=number('transfer-seconds',.000001,1e8);
  const q=volume/time;
  if(!Number.isFinite(q))throw {field:byId('transfer-litres'),message:'Calculated rate is outside supported range.'};
  output.replaceChildren(
   row('Given:','Transferred '+format(volume)+' L in '+format(time)+' s.'),
   row('Average flow rate:','Q = V/t = '+format(q)+' L/s = '+format(q/1000)+' m³/s.'),
   row('Meaning:','On average, '+format(q)+' L crosses the chosen section per second during this interval.')
  );
 }catch(e){renderFailure(rateError,e);}
});
intervalsForm.addEventListener('submit',event=>{
 event.preventDefault();intervalError.hidden=true;
 try{
  const v1=number('first-litres',0,1e8),t1=number('first-seconds',.000001,1e8);
  const v2=number('second-litres',0,1e8),t2=number('second-seconds',.000001,1e8);
  const q1=v1/t1,q2=v2/t2;
  const totalV=v1+v2,totalT=t1+t2;
  const q=totalV/totalT,naive=(q1+q2)/2;
  if(![q1,q2,totalV,totalT,q,naive].every(Number.isFinite))throw {field:byId('first-litres'),message:'Calculated rate is outside supported range.'};
  const sameDuration=Math.abs(t1-t2)<=Math.max(t1,t2)*1e-12;
  const sameRates=Math.abs(q1-q2)<=Math.max(1e-12,Math.max(Math.abs(q1),Math.abs(q2))*1e-12);
  const note=(sameDuration||sameRates)
   ? 'The two rates happen to give the same arithmetic and time-weighted average here. In general, prefer total volume ÷ total time.'
   : 'A simple average of '+format(q1)+' and '+format(q2)+' L/s would be '+format(naive)+' L/s, which is incorrect across unequal-duration intervals.';
  intervalsOutput.replaceChildren(
   row('Interval rates:','Q₁ = '+format(q1)+' L/s; Q₂ = '+format(q2)+' L/s.'),
   row('Overall average:','('+format(v1)+' + '+format(v2)+') L ÷ ('+format(t1)+' + '+format(t2)+') s = '+format(q)+' L/s = '+format(q/1000)+' m³/s.'),
   row('Why total time matters:',note)
  );
 }catch(e){renderFailure(intervalError,e);}
});
})();
