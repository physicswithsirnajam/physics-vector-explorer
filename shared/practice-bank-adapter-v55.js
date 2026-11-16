/* V55 — Read-only Grade XI central MCQ bank adapter.
 * Reuses original source JSON, no copied/rewritten question records.
 * This PUBLIC adapter may load the PUBLIC Unit 5 worked teacher keys:
 * it must never be used to implement a secured exam or concealed answer key.
 */
(function(root){
'use strict';
const expected={1:275,2:206,3:80,4:80,5:32};
const names={
  1:'Physical Quantities and Measurements',2:'Vectors',3:'Translatory Motion',
  4:'Rotational and Circular Motion',5:'Work and Energy'
};
const files={
  1:['unit-01.json'],2:['unit-02.json'],
  3:['unit-03-stage2-80-practice.json'],
  4:['unit-04-v39-80-practice.json'],
  5:[
    'unit-05-v50-16-student.json','unit-05-v50-16-teacher-key.json',
    'unit-05-v51-16-student-b.json','unit-05-v51-16-teacher-key-b.json'
  ]
};
function need(condition,reason){if(!condition)throw Error('Grade XI MCQ source validation: '+reason);}
function escapeHTML(value){return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function checkQuestions(unit,items){
  need(Array.isArray(items)&&items.length===expected[unit],'unexpected count in Unit '+unit);
  const seen=new Set(),groups=new Map();
  for(const q of items){
    need(q&&typeof q.id==='string'&&!seen.has(q.id),'missing or duplicated MCQ ID '+String(q?.id));
    seen.add(q.id);
    need(q.grade===11&&q.unit===unit&&q.active===true&&q.type==='single_choice','invalid unit/active/type '+q.id);
    need(typeof q.stem==='string'&&q.stem.trim().length>0,'empty question '+q.id);
    need(Array.isArray(q.options)&&q.options.length===4&&q.options.map(o=>o.id).join('')==='ABCD','bad option IDs '+q.id);
    need(q.options.every(o=>typeof o.text==='string'&&o.text.trim()),'empty option '+q.id);
    need(q.options.some(o=>o.id===q.correctOptionId),'unmatched answer '+q.id);
    need(typeof q.explanation==='string'&&q.explanation.trim(),'missing explanation '+q.id);
    need(Array.isArray(q.sloCodes)&&q.sloCodes.length>0,'missing SLO '+q.id);
    need(q.assessmentClassification==='formative'||q.assessmentClassification==='summative-theory','missing practice classification '+q.id);
    need(typeof q.difficulty==='string'&&q.difficulty.length>0,'missing difficulty metadata '+q.id);
    if(q.stimulusSetId){
      need(typeof q.stimulusHtml==='string'&&q.stimulusHtml.length>0,'missing scenario stimulus '+q.id);
      if(!groups.has(q.stimulusSetId))groups.set(q.stimulusSetId,[]);
      groups.get(q.stimulusSetId).push(q);
    }
  }
  const expectedGroups=unit===1?24:unit===2?15:unit===3?6:unit===4?6:2;
  need(groups.size===expectedGroups,'unexpected number of complete Unit '+unit+' scenario groups');
  for(const [id,group] of groups){
    need(group.length>1,'partial scenario '+id);
    need(group.every(q=>q.stimulusHtml===group[0].stimulusHtml),'inconsistent scenario introduction '+id);
  }
  return items;
}
function adaptLegacy(unit,data){
  need(data?.status==='practice-pilot'&&Array.isArray(data.questions),'invalid original Unit '+unit+' bank');
  return data.questions.map(q=>({
    ...q,
    // Unit 3/4 source calls its original group 'scenarioSetId', while the central
    // engine uses 'stimulusSetId'. Preserve both source fields without rewriting.
    stimulusSetId:q.stimulusSetId||q.scenarioSetId||null,
    stimulusHtml:q.stimulusHtml|| (q.stimulusText?'<p>'+escapeHTML(q.stimulusText)+'</p>':'')
  }));
}
function adaptUnitFive(student,key,setLabel){
  need(student?.grade===11&&student.unit===5&&student.officialBoardPaper===false&&student.questions?.length===16,'bad Unit 5 Set '+setLabel+' student source');
  need(key?.grade===11&&key.unit===5&&key.publicResource===true&&key.notSecured===true&&key.officialFBISEKey===false,'Unit 5 key must be labelled publicly accessible and non-official');
  need(key.companionStudentBank===files[5][setLabel==='A'?0:2],'Unit 5 mismatched companion '+setLabel);
  need(key.answerKeys?.length===16,'Unit 5 Set '+setLabel+' key count');
  const answerMap=new Map(key.answerKeys.map(k=>[k.id,k]));
  need(answerMap.size===16,'duplicate Unit 5 key '+setLabel);
  const scenarios=new Map((student.scenarios||[]).map(x=>[x.id,x]));
  need(scenarios.size===1,'missing scenario in Unit 5 Set '+setLabel);
  const mapped=student.questions.map(q=>{
    const a=answerMap.get(q.id);
    need(a&&q.options?.some(o=>o.id===a.correctOptionId),'missing or wrong companion answer '+q.id);
    need(Array.isArray(a.workedSteps)&&a.workedSteps.length>=1&&a.workedSteps.every(x=>typeof x==='string'&&x.trim()),'missing worked explanation '+q.id);
    const scene=q.scenarioSetId?scenarios.get(q.scenarioSetId):null;
    need(!q.scenarioSetId||scene,'missing Unit 5 scenario '+q.id);
    const stimulus=scene?'<p><strong>'+escapeHTML(scene.title)+'</strong></p><p>'+escapeHTML(scene.stimulus)+'</p>':'';
    need(q.source?.frameworkCode===q.sloCode,'framework mismatch '+q.id);
    return {
      ...q,
      grade:11,unit:5,active:true,boardEligible:false,
      type:'single_choice',sourceSet:setLabel,
      correctOptionId:a.correctOptionId,
      explanation:a.workedSteps.join(' '),
      sloCodes:[q.sloCode],assessmentClassification:'summative-theory',
      // Student and teacher Unit 5 originals do not assert an assessed difficulty band.
      difficulty:'Unspecified',
      stimulusSetId:q.scenarioSetId||null,stimulusHtml:stimulus,
      status:'teacher-review-pending'
    };
  });
  need(answerMap.size===mapped.length&&mapped.every(q=>answerMap.has(q.id)),'unmatched Unit 5 key records');
  return mapped;
}
async function loadBank(unit,basePath){
  need(Number.isInteger(unit)&&Object.hasOwn(files,unit),'unit not available');
  need(typeof basePath==='string'&&/^(?:\.\.\/)?question-bank\/grade-11\/$/.test(basePath),'unexpected question bank folder');
  const data=await Promise.all(files[unit].map(async file=>{
    const response=await fetch(basePath+file,{cache:'no-store'});
    if(!response.ok)throw Error('Could not load '+file+' (HTTP '+response.status+')');
    return response.json();
  }));
  let questions;
  if(unit===5)questions=[
    ...adaptUnitFive(data[0],data[1],'A'),
    ...adaptUnitFive(data[2],data[3],'B')
  ];
  else questions=adaptLegacy(unit,data[0]);
  const mapped=checkQuestions(unit,questions);
  return {
    schemaVersion:1,status:'practice-pilot',
    bankId:'central-readonly-unit-'+unit,
    bankVersion:unit===5?'v55-adapter-original-v50-and-v51':data[0].bankVersion,
    title:names[unit],unit,grade:11,questions:mapped,
    publicSelfPractice:true,secureExam:false,
    academicStatus:'provisional-independent-teacher-review-pending'
  };
}
root.PSNPracticeBankV55=Object.freeze({
  loadBank,expected:Object.freeze(expected),names:Object.freeze(names)
});
})(typeof window==='object'?window:globalThis);
