/* Physics with Sir Najam — V56 multi-unit MCQ allocation planner.
 * PUBLIC self-practice only. This module neither grades nor saves results.
 * Source bank questions are read-only and all complete stimuli stay together
 * when a student requests grouped/scenario-only arrangements.
 *
 * Shared by Test Builder and Practice Engine to avoid a preview/launch mismatch.
 */
(function(root){
'use strict';
const MAX_UNIT=6; // Unit 6 has Topics 6.1–6.3 only, with zero shared-stimulus sets.
function isValidUnits(input){
 return Array.isArray(input)&&input.length>=1&&input.length<=MAX_UNIT&&
  input.every(Number.isInteger)&&input.every(n=>n>=1&&n<=MAX_UNIT)&&
  new Set(input).size===input.length;
}
function completeUnitGroups(all,eligible,unit,order){
 const allowed=new Set(eligible.map(q=>q.id)),groups=new Map();
 for(const q of all){
  if(q.unit!==unit||!q.stimulusSetId)continue;
  if(!groups.has(q.stimulusSetId))groups.set(q.stimulusSetId,[]);
  groups.get(q.stimulusSetId).push(q);
 }
 const ready=[...groups.values()].filter(g=>g.length>1&&g.every(q=>allowed.has(q.id)))
  .map(g=>g.slice().sort((a,b)=>a.sourceQuestionNumber-b.sourceQuestionNumber));
 return typeof order==='function'?order(ready):ready;
}
function groupSubsets(groups,count){
 const reachable=new Map([[0,[]]]);
 for(const g of groups){
  // Snapshot: no group may be taken twice, even when sums collide.
  for(const [sum,parts] of [...reachable.entries()]){
   const next=sum+g.length;
   if(next<=count&&!reachable.has(next))reachable.set(next,[...parts,g]);
  }
 }
 return reachable;
}
function unitOptions(all,eligible,unit,arrangement,count,order){
 const qs=eligible.filter(q=>q.unit===unit);
 const groups=completeUnitGroups(all,eligible,unit,order);
 const singles=qs.filter(q=>!q.stimulusSetId);
 const possible=groupSubsets(groups,count);
 const choices=[];
 for(let k=1;k<=Math.min(qs.length,count);k++){
  if(arrangement==='random'){
   choices.push({unit,count:k,groups:[],groupQuestions:0});continue;
  }
  if(arrangement==='scenario'){
   if(possible.has(k)&&k>0)choices.push({unit,count:k,groups:possible.get(k),groupQuestions:k});
   continue;
  }
  // In grouped mode, every chosen stimulus group stays intact. Remaining
  // questions must come from independent MCQs, never partial groups.
  const sums=[...possible.keys()].filter(n=>n<=k&&k-n<=singles.length);
  if(!sums.length)continue;
  sums.sort((a,b)=>Math.abs(a-k*.30)-Math.abs(b-k*.30)||b-a);
  const n=sums[0];
  choices.push({unit,count:k,groups:possible.get(n),groupQuestions:n});
 }
 return {unit,choices,readyGroups:groups.length,eligible:qs.length,
  available:arrangement==='scenario'?groups.reduce((n,g)=>n+g.length,0):
   arrangement==='grouped'?singles.length+groups.reduce((n,g)=>n+g.length,0):qs.length};
}
function plan(all,eligible,units,arrangement,count,order){
 if(!isValidUnits(units))return {possible:false,available:0,reason:'Choose at least one supported bank among Units 1–6 (Unit 6 is a partial three-topic preview).'};
 if(!Array.isArray(all)||!Array.isArray(eligible))return {possible:false,available:0,reason:'Question banks are not ready.'};
 if(!['random','grouped','scenario'].includes(arrangement))return {possible:false,available:0,reason:'Unknown question arrangement.'};
 if(!Number.isInteger(count)||count<1||count>60)return {possible:false,available:0,reason:'Choose a supported number of questions.'};
 const chosen=[...units].sort((a,b)=>a-b);
 const per=chosen.map(u=>unitOptions(all,eligible,u,arrangement,count,order));
 const available=per.reduce((n,x)=>n+x.available,0);
 const noItems=per.find(x=>x.eligible===0);
 if(noItems)return {possible:false,available,reason:'Unit '+noItems.unit+' has no eligible MCQs for the selected filters. Change scope, SLO, difficulty or cognitive level.'};
 if(count<chosen.length)return {possible:false,available,reason:'Select at least '+chosen.length+' questions to include all '+chosen.length+' selected units.'};
 if(available<count)return {possible:false,available,reason:'Only '+available+' eligible questions are available for this arrangement and filters; '+count+' were requested.'};
 if(arrangement==='scenario'){
  const noGroups=per.find(x=>x.readyGroups===0);
  if(noGroups)return {possible:false,available,reason:'Unit '+noGroups.unit+' has no complete eligible scenario group; broaden the filters or choose another arrangement.'};
 }
 let dp=new Map([['0:0',{total:0,hasGroup:false,score:0,allocations:[]}]]);
 const target=count/chosen.length;
 for(const u of per){
  const next=new Map();
  for(const state of dp.values())for(const opt of u.choices){
   const total=state.total+opt.count;
   if(total>count)continue;
   const hasGroup=state.hasGroup||opt.groupQuestions>0;
   const score=state.score+
    Math.pow(opt.count-target,2)/(target+1)+
    (arrangement==='grouped'?Math.abs(opt.groupQuestions-opt.count*.3)*.016:0);
   const key=total+':'+Number(hasGroup);
   const prev=next.get(key);
   if(!prev||score<prev.score){
    next.set(key,{total,hasGroup,score,allocations:[...state.allocations,opt]});
   }
  }
  dp=next;
  if(!dp.size)break;
 }
 const result=dp.get(count+':1')||(arrangement==='random'?dp.get(count+':0'):null);
 if(!result)return {possible:false,available,reason:
  'Cannot assemble exactly '+count+' questions while including every selected unit and keeping scenario sets complete. Try a larger count, different arrangement or broader filters.'};
 return {
  possible:true,available,allocations:result.allocations,
  groupQuestions:result.allocations.reduce((n,a)=>n+a.groupQuestions,0),
  groupCount:result.allocations.reduce((n,a)=>n+a.groups.length,0),
  unitCounts:Object.fromEntries(result.allocations.map(a=>[String(a.unit),a.count])),
  units:chosen,arrangement,count
 };
}
root.PSNMultiUnitV56=Object.freeze({plan,isValidUnits});
})(typeof window==='object'?window:globalThis);
