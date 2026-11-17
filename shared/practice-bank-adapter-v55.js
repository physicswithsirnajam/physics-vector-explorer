/* V55 — Read-only Grade XI central MCQ bank adapter.
 * Reuses original source JSON, no copied/rewritten question records.
 * This PUBLIC adapter may load the PUBLIC Unit 5 worked teacher keys:
 * it must never be used to implement a secured exam or concealed answer key.
 */
(function(root){
'use strict';
const expected={1:275,2:206,3:220,4:555,5:349};
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
    'unit-05-v51-16-student-b.json','unit-05-v51-16-teacher-key-b.json',
    'unit-05-master-topic-v59-317.json'
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
  const expectedGroups=unit===1?24:unit===2?15:unit===3?17:unit===4?41:26;
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
/* The original U3 Topic 3.3/3.4 source is compactly stored as two audited
 * gzip+base64 text assets (140 MCQs) to avoid duplicating extracted
 * metadata on every record. No network request to an external host is made.
 * These are PUBLIC self-practice keys, not secure examination answers.
 */
const thirdMasterFiles=['unit03-v60-part1.b64','unit03-v60-part2.b64'];
async function loadMasterThree(basePath){
 const responses=await Promise.all(thirdMasterFiles.map(async file=>{
  const response=await fetch(basePath+file,{cache:'no-store'});
  if(!response.ok)throw Error('Cannot load Unit 3 master source '+file+' (HTTP '+response.status+')');
  return response.text();
 }));
 const text=responses.join('').trim();
 need(text.length===13820,'Unit 3 compressed bank parts missing or truncated');
 let fnv=2166136261;
 for(let i=0;i<text.length;i++)fnv=Math.imul(fnv^text.charCodeAt(i),16777619)>>>0;
 need(fnv===0xd73d09df,'Unit 3 compressed source content checksum mismatch');
 need(typeof DecompressionStream==='function','Your browser cannot decode the supplementary Unit 3 bank. Please update your browser.');
 const bytes=Uint8Array.from(atob(text),char=>char.charCodeAt(0));
 const plain=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
 return JSON.parse(plain);
}
function adaptMasterThree(master,older){
 need(master?.version===1&&master.rows?.length===140&&Object.keys(master.scenarios||{}).length===11,
  'Unit 3 master topic source count/scenarios');
 need(master.sourceSha256==='e9dc7e4ec9081cd881f8becb2408f503f48eb72ecaa99d195c83461f774f8df9' &&
   master.teacherKeySha256==='635f510251b78639f3bf2d22a9be71d3c226596e202f72cd11c7242966bed330',
   'unexpected Unit 3 student or key PDF sources');
 const oldIds=new Set(older.map(q=>q.id));
 const canon=q=>String(q.stem).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()+'|'+
   q.options.map(o=>String(o.text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()).join('|');
 const earlier=new Set(older.map(canon)),topicCount={33:0,34:0},seen=new Set(),groups=new Map();
 const questions=master.rows.map((r)=>{
  need(Array.isArray(r)&&r.length===9,'bad Unit 3 compact master record');
  const [topic,n,stem,optionText,answer,explanation,slo,level,page]=r;
  need((topic===33&&n>=1&&n<=60)||(topic===34&&n>=1&&n<=80),'unexpected Unit 3 master topic/item');
  need(typeof page==='number'&&page>=49&&page<=69,'incorrect master PDF source page');
  const id='g11-u03-master-t'+topic+'-q'+String(n).padStart(3,'0');
  need(!seen.has(id)&&!oldIds.has(id),'duplicate Unit 3 source id '+id);seen.add(id);
  need(Array.isArray(optionText)&&optionText.length===4&&optionText.every(x=>typeof x==='string'&&x.trim()),'missing Unit 3 source option '+id);
  need(typeof explanation==='string'&&explanation.trim()&&'ABCD'.includes(answer),'incomplete Unit 3 source answer '+id);
  need(slo===(topic===33?'P-11-B-11':slo)&&
    (topic!==34||['P-11-B-12','P-11-B-13'].includes(slo)),
    'Unit 3 original framework mapping '+id);
  const start=topic===33?41:57,groupStart=n>=start?start+Math.floor((n-start)/4)*4:null;
  const group=groupStart===null?null:'u03-master-t'+topic+'-s'+(1+(groupStart-start)/4);
  const stimulus=group?master.scenarios[group]:null;
  need(!group||typeof stimulus==='string'&&stimulus.trim().length>25,'missing Unit 3 complete scenario '+id);
  const q={
   id,grade:11,unit:3,active:true,type:'single_choice',status:'teacher-review-pending',
   stem,options:optionText.map((text,i)=>({id:'ABCD'[i],text})),
   correctOptionId:answer,explanation,sloCodes:[slo],
   assessmentClassification:topic===33?'formative':'summative-theory',
   cognitiveLevel:level,difficulty:'Unspecified',boardEligible:false,
   sourceQuestionNumber:n,
   topic:topic===33?'3.3 — Law of Conservation of Momentum':'3.4 — Elastic and Inelastic Collisions',
   source:{
    document:'Grade_11_Physics_Unit_3_MASTER_Student_Edition.pdf',
    teacherKey:'Grade11_Unit3_QC_TEACHER_KEYS_COMPLETE.pdf',
    qcReport:'Grade11_Unit3_QC_AUDIT_AND_CORRECTIONS_REPORT.pdf',
    topic:topic===33?'3.3':'3.4',itemNumber:n,sourcePdfPage:page,
    revisionNote:topic===33&&(n===34||n===44)?
     '61.6 m/s correct full-precision source QC report correction to earlier 60.9 m/s option':null
   },
   stimulusSetId:group,stimulusHtml:group?'<p>'+escapeHTML(stimulus)+'</p>':null
  };
  need(!earlier.has(canon(q)),'duplicate old Unit 3 stem/options '+id);
  topicCount[topic]++;
  if(group){if(!groups.has(group))groups.set(group,[]);groups.get(group).push(q);}
  if(topic===33&&(n===34||n===44)){
    need(q.options['ABCD'.indexOf(answer)].text.includes('61.6'),'missing documented correction '+id);
  }
  return q;
 });
 need(topicCount[33]===60&&topicCount[34]===80,'Unit 3 master topic counts changed');
 need(groups.size===11&&[...groups.values()].every(a=>a.length===4&&a.every(q=>q.stimulusHtml===a[0].stimulusHtml)),
   'Unit 3 supplementary scenarios not complete');
 return questions;
}

/* V61: original corrected Oct-08 Unit 4 notes; first two of seven master
 * topic banks, 160 PUBLIC self-practice questions. Source option letters
 * and worked key are kept as provided; no secure exam is created. */
const fourthMasterFiles=['unit04-v61-part1.b64','unit04-v61-part2.b64','unit04-v61-part3.b64'];
async function loadMasterFour(basePath){
 const parts=await Promise.all(fourthMasterFiles.map(async file=>{
  const r=await fetch(basePath+file,{cache:'no-store'});
  if(!r.ok)throw Error('Missing Unit 4 source '+file+' (HTTP '+r.status+')');
  return r.text();
 }));
 const encoded=parts.join('').trim();
 need(encoded.length===13600,'Unit 4 archive missing or truncated');
 let fnv=2166136261;
 for(let i=0;i<encoded.length;i++)fnv=Math.imul(fnv^encoded.charCodeAt(i),16777619)>>>0;
 need(fnv===0x20d5cb2e,'Unit 4 corrected master checksum mismatch');
 need(typeof DecompressionStream==='function','Supplementary Unit 4 bank needs a browser supporting gzip DecompressionStream.');
 const raw=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
 const json=await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
 return JSON.parse(json);
}
/* Word's run-level superscripts were flattened by the plain-text extractor.
 * Confirmed against every original text cell in corrected Topic 4.2 tables:
 * 720/720 reconstructed cells match the visual Word superscript content.
 * Restrict these restorations to that one topic; do not guess in other banks.
 */
function restoreCorrectedUnitFourMath(value,topic,n){
 if(topic!==42)return value;
 let correct=String(value)
  .replace(/([vωrm])2\b/g,'$1²')
  .replace(/s-1\b/g,'s⁻¹').replace(/s-2\b/g,'s⁻²')
  .replace(/tan-1\(/g,'tan⁻¹(');
 if(n===48)correct=correct.replace(/12\.02\b/g,'12.0²');
 return correct;
}
function adaptMasterFour(master,old){
 const topics={41:['P-11-B-07','P-11-B-08','P-11-B-09'],
   42:['P-11-B-10','P-11-B-14','P-11-B-15','P-11-B-21']};
 need(master?.version===1&&master.rows?.length===160&&Object.keys(master.scenarios||{}).length===12,
  'invalid Unit 4 master source inventory');
 need(master.source==='Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx'&&
  master.sourceSha256==='925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777',
  'wrong original corrected Unit 4 edition');
 const canon=q=>String(q.stem).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()+
   '|'+q.options.map(o=>String(o.text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()).join('|');
 const seen=new Set(old.map(q=>q.id)),content=new Set(old.map(canon)),groups=new Map(),counts={41:0,42:0};
 const questions=master.rows.map(r=>{
  need(Array.isArray(r)&&r.length===6,'bad source record');
  const [topic,n,stem,options,answer,explanation]=r;
  const id='g11-u04-master-t'+topic+'-q'+String(n).padStart(3,'0');
  need(Object.hasOwn(topics,topic)&&Number.isInteger(n)&&n>=1&&n<=80&&!seen.has(id),
   'invalid/repeated source record '+id);
  need(typeof stem==='string'&&stem.trim()&&Array.isArray(options)&&options.length===4&&
   options.every(x=>typeof x==='string'&&x.trim())&&'ABCD'.includes(answer)&&
   typeof explanation==='string'&&explanation.trim(),'missing source question/key/explanation '+id);
  const stimulusSetId=n>=57?'u04-v61-t'+topic+'-s'+(1+Math.floor((n-57)/4)):null;
  const stimulusHtml=stimulusSetId?master.scenarios[stimulusSetId]:null;
  need(!stimulusSetId||typeof stimulusHtml==='string'&&stimulusHtml.startsWith('<p>')&&stimulusHtml.length>35,
   'missing original scenario '+id);
  const q={id,grade:11,unit:4,active:true,type:'single_choice',
   status:'teacher-review-pending',boardEligible:false,
   stem:restoreCorrectedUnitFourMath(stem,topic,n),
   options:options.map((text,i)=>({id:'ABCD'[i],text:restoreCorrectedUnitFourMath(text,topic,n)})),
   correctOptionId:answer,explanation:restoreCorrectedUnitFourMath(explanation,topic,n),
   sloCodes:topics[topic],
   assessmentClassification:'summative-theory',difficulty:'Unspecified',
   cognitiveLevel:'Unspecified',
   sloAlignment:'Topic-level provisional source SLO mapping; item-level teacher review pending',
   sourceQuestionNumber:n,topic:topic===41?'4.1 — Rotational Kinematics':'4.2 — Centripetal Acceleration and Force',
   source:{document:master.source,sourceSha256:master.sourceSha256,
    topic:'4.'+(topic-40),itemNumber:n,
    sloPrecision:'topic-level; teacher-review-pending'},
   stimulusSetId,stimulusHtml:stimulusHtml||null};
  need(!content.has(canon(q)),'duplicate original or supplemental Unit 4 question '+id);
  seen.add(id);content.add(canon(q));counts[topic]++;
  if(stimulusSetId){if(!groups.has(stimulusSetId))groups.set(stimulusSetId,[]);groups.get(stimulusSetId).push(q);}
  return q;
 });
 need(counts[41]===80&&counts[42]===80&&groups.size===12&&
  [...groups.values()].every(group=>group.length===4&&group.every(q=>q.stimulusHtml===group[0].stimulusHtml)),
  'Unit 4 new scenarios or topic counts changed');
 return questions;
}

/* V62: source-preserving corrected Unit 4 Topic 4.3/4.4 bank.
 * Word run-level superscripts/subscripts are already serialized exactly in
 * this PUBLIC, auditable source archive. Never auto-correct source answers.
 * Figure 4.13 Question 38 and dependent Scenario 4 (Q69-72) are withheld.
 */
const fourthNextMasterFiles=['unit04-v62-part1.b64','unit04-v62-part2.b64','unit04-v62-part3.b64'];
async function loadMasterFourV62(basePath){
 const parts=await Promise.all(fourthNextMasterFiles.map(async file=>{
  const r=await fetch(basePath+file,{cache:'no-store'});
  if(!r.ok)throw Error('Missing Unit 4 corrected topic archive '+file+' (HTTP '+r.status+')');
  return r.text();
 }));
 const encoded=parts.join('').trim();
 need(encoded.length===13684,'Unit 4 Topic 4.3/4.4 archive is missing or truncated');
 let fnv=2166136261;
 for(let i=0;i<encoded.length;i++)fnv=Math.imul(fnv^encoded.charCodeAt(i),16777619)>>>0;
 need(fnv===0x55b60683,'Unit 4 Topic 4.3/4.4 source transfer checksum mismatch');
 need(typeof DecompressionStream==='function','Current browser cannot decompress the source topic bank. Update the browser.');
 const bytes=Uint8Array.from(atob(encoded),char=>char.charCodeAt(0));
 const json=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
 return JSON.parse(json);
}
function adaptMasterFourV62(master,existing){
 need(master?.version===1&&master.source==='Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx'&&
  master.sourceSha256==='925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777'&&
  master.rows?.length===155&&Object.keys(master.scenarios||{}).length===11,
  'unexpected corrected Unit 4 Topic 4.3/4.4 source');
 need(JSON.stringify(master.held)==='{"4.3":[38,69,70,71,72],"4.4":[]}',
  'Figure 4.13 dependent questions must remain held');
 need(master.formatMethod==='original Word run-level superscript/subscript restored before source compression',
  'original Word equation typography not verified');
 const slos={43:['P-11-B-18'],44:['P-11-B-18','P-11-B-20']};
 const canon=q=>String(q.stem).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()+'|'+
  q.options.map(o=>String(o.text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()).join('|');
 const ids=new Set(existing.map(q=>q.id)),fingerprints=new Set(existing.map(canon)),
  groups=new Map(),counts={43:0,44:0};
 const rows=master.rows.map(row=>{
  need(Array.isArray(row)&&row.length===6,'malformed corrected Topic 4.3/4.4 record');
  const [topic,n,stem,options,answer,explanation]=row;
  const id='g11-u04-master-t'+topic+'-q'+String(n).padStart(3,'0');
  need(Object.hasOwn(slos,topic)&&Number.isInteger(n)&&n>=1&&n<=80 &&
    !(topic===43&&[38,69,70,71,72].includes(n)) && !ids.has(id),
    'repeated or held Unit 4 source question '+id);
  need(typeof stem==='string'&&stem.trim()&&Array.isArray(options)&&options.length===4&&
   options.every(v=>typeof v==='string'&&v.trim())&&'ABCD'.includes(answer)&&
   typeof explanation==='string'&&explanation.trim(),'bad source option/key/explanation '+id);
  const group=n>=57?'u04-v61-t'+topic+'-s'+(1+Math.floor((n-57)/4)):null;
  const html=group?master.scenarios[group]:null;
  need(!group||(typeof html==='string'&&html.startsWith('<p>')&&html.length>40),
   'source scenario missing or truncated '+id);
  const q={id,grade:11,unit:4,active:true,type:'single_choice',
   status:'teacher-review-pending',boardEligible:false,
   stem,options:options.map((text,i)=>({id:'ABCD'[i],text})),
   correctOptionId:answer,explanation,
   sloCodes:slos[topic],assessmentClassification:'summative-theory',
   difficulty:'Unspecified',cognitiveLevel:'Unspecified',
   sloAlignment:'Topic-level provisional SLO candidate; item-level teacher academic review pending',
   sourceQuestionNumber:n,topic:topic===43?'4.3 — Moment of Inertia':'4.4 — Angular Momentum',
   source:{document:master.source,sourceSha256:master.sourceSha256,
    topic:'4.'+(topic-40),itemNumber:n,review:'academic-review-pending; source key only'},
   stimulusSetId:group,stimulusHtml:html||null};
  need(!fingerprints.has(canon(q)),'duplicate old/new Unit 4 question text '+id);
  ids.add(id);fingerprints.add(canon(q));counts[topic]++;
  if(group){if(!groups.has(group))groups.set(group,[]);groups.get(group).push(q);}
  return q;
 });
 need(counts[43]===75&&counts[44]===80&&groups.size===11&&
  [...groups.values()].every(g=>g.length===4&&g.every(q=>q.stimulusHtml===g[0].stimulusHtml)) &&
  !groups.has('u04-v61-t43-s4'),'Unit 4 source scenario integrity or figure hold changed');
 return rows;
}


/* V63: original corrected Unit 4 Topic 4.5 Torque and Angular Acceleration,
 * 80 PUBLIC self-practice items, with Word run-level math typesetting
 * preserved. Source keys are provisional, not independently certified. */
async function loadMasterFourV63(basePath){
 const filename='unit04-v63-topic45.b64';
 const response=await fetch(basePath+filename,{cache:'no-store'});
 if(!response.ok)throw Error('Missing corrected Unit4 Topic4.5 source (HTTP '+response.status+')');
 const encoded=(await response.text()).trim();
 need(encoded.length===7416,'Topic4.5 compressed source missing or truncated');
 let fnv=2166136261;
 for(let i=0;i<encoded.length;i++)fnv=Math.imul(fnv^encoded.charCodeAt(i),16777619)>>>0;
 need(fnv===0xb70ebe63,'Topic4.5 corrected source archive checksum mismatch');
 need(typeof DecompressionStream==='function','Topic4.5 requires browser gzip DecompressionStream support.');
 const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
 const raw=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
 return JSON.parse(raw);
}
function adaptMasterFourV63(master,existing){
 need(master?.version===1&&master.source==='Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx'&&
  master.sourceSha256==='925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777'&&
  master.formatMethod==='original Word run-level superscript/subscript restored before source compression'&&
  master.rows?.length===80&&Object.keys(master.scenarios||{}).length===6&&
  JSON.stringify(master.topics)==='["4.5"]'&&Object.keys(master.held||{}).length===0,
  'wrong corrected Topic4.5 master source inventory');
 const canon=q=>String(q.stem).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()+'|'+
  q.options.map(o=>String(o.text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()).join('|');
 const ids=new Set(existing.map(q=>q.id)),fingerprints=new Set(existing.map(canon)),groups=new Map(),
   letters={A:0,B:0,C:0,D:0};
 const questions=master.rows.map((r,index)=>{
  need(Array.isArray(r)&&r.length===6,'malformed Topic4.5 source record');
  const [topic,n,stem,options,answer,explanation]=r;
  const id='g11-u04-master-t45-q'+String(n).padStart(3,'0');
  need(topic===45&&n===index+1&&!ids.has(id),'Topic4.5 source order/repeat '+id);
  need(typeof stem==='string'&&stem.trim()&&Array.isArray(options)&&options.length===4&&
    options.every(v=>typeof v==='string'&&v.trim())&&['A','B','C','D'].includes(answer)&&
    typeof explanation==='string'&&explanation.trim(),'missing source option/key '+id);
  letters[answer]++;
  const group=n>=57?'u04-v61-t45-s'+(1+Math.floor((n-57)/4)):null;
  const stimulus=group?master.scenarios[group]:null;
  need(!group||(typeof stimulus==='string'&&stimulus.startsWith('<p>')&&stimulus.length>40),
    'missing source scenario '+id);
  const q={id,grade:11,unit:4,active:true,type:'single_choice',
    status:'teacher-review-pending',boardEligible:false,stem,
    options:options.map((text,i)=>({id:'ABCD'[i],text})),
    correctOptionId:answer,explanation,sloCodes:['P-11-B-19'],
    assessmentClassification:'summative-theory',difficulty:'Unspecified',
    cognitiveLevel:'Unspecified',sloAlignment:'Topic-level provisional SLO candidate; item-level teacher review pending',
    sourceQuestionNumber:n,topic:'4.5 — Torque and Angular Acceleration',
    source:{document:master.source,sourceSha256:master.sourceSha256,
      topic:'4.5',itemNumber:n,review:'academic-review-pending; source key only'},
    stimulusSetId:group,stimulusHtml:stimulus||null};
  need(!fingerprints.has(canon(q)),'duplicate original/new Unit4 question '+id);
  ids.add(id);fingerprints.add(canon(q));
  if(group){if(!groups.has(group))groups.set(group,[]);groups.get(group).push(q);}
  return q;
 });
 need(Object.values(letters).every(n=>n===20)&&groups.size===6&&
   [...groups.values()].every(g=>g.length===4&&g.every(q=>q.stimulusHtml===g[0].stimulusHtml)),
   'Topic4.5 answer distribution or scenario integrity mismatch');
 return questions;
}


/* V64: corrected Word Topic 4.6 — Weightlessness in Satellites.
 * 56 original straight + 24 in six complete scenarios; provisional source
 * keys only, with Word run-level mathematical superscripts maintained. */
async function loadMasterFourV64(basePath){
 const file='unit04-v64-topic46.b64';
 const response=await fetch(basePath+file,{cache:'no-store'});
 if(!response.ok)throw Error('Missing corrected Unit4 Topic4.6 source (HTTP '+response.status+')');
 const encoded=(await response.text()).trim();
 need(encoded.length===9192,'Topic4.6 compressed source missing or truncated');
 let hash=2166136261;
 for(const c of encoded)hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
 need(hash===0x7a493ad2,'Topic4.6 corrected source archive checksum mismatch');
 need(typeof DecompressionStream==='function','Topic4.6 requires browser gzip DecompressionStream support.');
 const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
 const plain=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
 return JSON.parse(plain);
}
function adaptMasterFourV64(master,previous){
 need(master?.version===1&&master.source==='Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx'&&
   master.sourceSha256==='925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777'&&
   master.formatMethod==='original Word run-level superscript/subscript restored before source compression'&&
   JSON.stringify(master.topics)==='["4.6"]'&&
   master.rows?.length===80&&Object.keys(master.scenarios||{}).length===6&&
   Object.keys(master.held||{}).length===0,'bad corrected Topic4.6 source edition/count');
 const canon=q=>String(q.stem).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()+'|'+
   q.options.map(o=>String(o.text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()).join('|');
 const ids=new Set(previous.map(q=>q.id)),fingerprints=new Set(previous.map(canon));
 const groups=new Map(),answers={A:0,B:0,C:0,D:0};
 const items=master.rows.map((r,index)=>{
  need(Array.isArray(r)&&r.length===6,'malformed corrected 4.6 source record');
  const [topic,n,stem,options,answer,explanation]=r;
  const id='g11-u04-master-t46-q'+String(n).padStart(3,'0');
  need(topic===46&&n===index+1&&!ids.has(id),'bad original topic order or duplicate '+id);
  need(typeof stem==='string'&&stem.trim()&&Array.isArray(options)&&options.length===4&&
   options.every(o=>typeof o==='string'&&o.trim())&&
   ['A','B','C','D'].includes(answer)&&typeof explanation==='string'&&explanation.trim(),
   'Topic4.6 original question missing source options/key/explanation '+id);
  answers[answer]++;
  const group=n>=57?'u04-v61-t46-s'+(1+Math.floor((n-57)/4)):null;
  const html=group?master.scenarios[group]:null;
  need(!group||(typeof html==='string'&&html.startsWith('<p>')&&html.length>40),
   'Topic4.6 complete scenario introduction missing '+id);
  const q={id,grade:11,unit:4,active:true,type:'single_choice',
    status:'teacher-review-pending',boardEligible:false,stem,
    options:options.map((text,i)=>({id:'ABCD'[i],text})),
    correctOptionId:answer,explanation,sloCodes:['P-11-B-16'],
    assessmentClassification:'summative-theory',
    difficulty:'Unspecified',cognitiveLevel:'Unspecified',
    sloAlignment:'Topic-level provisional SLO candidate; independent item-level Physics review pending',
    sourceQuestionNumber:n,topic:'4.6 — Weightlessness in Satellites',
    source:{document:master.source,sourceSha256:master.sourceSha256,
     topic:'4.6',itemNumber:n,review:'academic-review-pending; source key only'},
    stimulusSetId:group,stimulusHtml:html||null};
  need(!fingerprints.has(canon(q)),'duplicate old/new Unit4 question text '+id);
  ids.add(id);fingerprints.add(canon(q));
  if(group){if(!groups.has(group))groups.set(group,[]);groups.get(group).push(q);}
  return q;
 });
 need(Object.values(answers).every(n=>n===20)&&groups.size===6&&
   [...groups.values()].every(g=>g.length===4&&g.every(q=>q.stimulusHtml===g[0].stimulusHtml)),
   'Topic4.6 answer distribution or complete scenario grouping changed');
 return items;
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
function adaptMasterFive(master,older){
  need(master?.grade===11&&master.unit===5&&master.status==='practice-pilot'&&master.secureExam===false,
    'invalid teacher-supplied Unit 5 master bank');
  need(master.sourceDocument==='Grade11_Physics_Unit5_Student_Master_Pack.docx' &&
    master.sourceQuestionCount===320 && master.questionCount===317 &&
    master.questions?.length===317 && master.excludedPendingFigureReview?.length===3,
    'source/provisional import manifest mismatch for Unit 5');
  const held=new Set(master.excludedPendingFigureReview.map(x=>x.id));
  need(held.size===3 && [...held].every(id=>!master.questions.some(q=>q.id===id)),
    'figure-dependent questions must remain excluded');
  const expectedTopic={'5.1':79,'5.2':78,'5.3':80,'5.4':80};
  const expectedSlo={'5.1':'P-11-B-30','5.2':'P-11-B-31',
    '5.3':'P-11-B-29','5.4':'P-11-B-32'};
  const expectedLevel={'5.1':'Application','5.2':'Understanding',
    '5.3':'Application','5.4':'Application'};
  const topicCount=Object.fromEntries(Object.keys(expectedTopic).map(t=>[t,0]));
  const groups=new Map(),existingIds=new Set(older.map(x=>x.id));
  const canon=q=>String(q.stem).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()+'|'+q.options.map(o=>String(o.text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()).join('|');
  const previous=new Set(older.map(canon));
  for(const q of master.questions){
    const t=q.source?.topic;
    need(Object.hasOwn(expectedTopic,t),'unexpected source topic in '+q.id);
    need(q.source.document===master.sourceDocument &&
      q.source.itemNumber===q.sourceQuestionNumber &&
      q.id==='g11-u05-master-t'+t.replace('.','')+'-q'+String(q.sourceQuestionNumber).padStart(3,'0'),
      'source traceability mismatch in '+q.id);
    need(q.sloCodes?.length===1&&q.sloCodes[0]===expectedSlo[t] &&
      q.cognitiveLevel===expectedLevel[t] &&
      q.assessmentClassification==='summative-theory'&&q.boardEligible===false &&
      q.difficulty==='Unspecified' && q.status==='teacher-review-pending',
      'SLO, source status or cognitive mapping mismatch '+q.id);
    need(!existingIds.has(q.id)&&!previous.has(canon(q)),'duplicated original Unit 5 MCQ '+q.id);
    topicCount[t]++;
    if(q.stimulusSetId){
      if(!groups.has(q.stimulusSetId))groups.set(q.stimulusSetId,[]);
      groups.get(q.stimulusSetId).push(q);
    }
  }
  for(const t of Object.keys(expectedTopic))
    need(topicCount[t]===expectedTopic[t],'unexpected imported source count '+t);
  need(groups.size===24&&[...groups.values()].every(g=>g.length===4),
    'Unit 5 master must retain 24 intact four-question scenario groups');
  need(master.questions.filter(q=>q.stimulusSetId).length===96,
    'Unit 5 source scenario-question count mismatch');
  return master.questions;
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
  if(unit===3)questions=[...adaptLegacy(3,data[0]),...adaptMasterThree(await loadMasterThree(basePath),adaptLegacy(3,data[0]))];
  else if(unit===5)questions=[
    ...adaptUnitFive(data[0],data[1],'A'),
    ...adaptUnitFive(data[2],data[3],'B'),
    ...adaptMasterFive(data[4],[
      ...adaptUnitFive(data[0],data[1],'A'),
      ...adaptUnitFive(data[2],data[3],'B')
    ])
  ];
  else if(unit===4){const old=adaptLegacy(4,data[0]);const first=adaptMasterFour(await loadMasterFour(basePath),old);const existing=[...old,...first];const second=adaptMasterFourV62(await loadMasterFourV62(basePath),existing);const prior=[...existing,...second];const third=adaptMasterFourV63(await loadMasterFourV63(basePath),prior);const first475=[...prior,...third];questions=[...first475,...adaptMasterFourV64(await loadMasterFourV64(basePath),first475)];}
  else questions=adaptLegacy(unit,data[0]);
  const mapped=checkQuestions(unit,questions);
  return {
    schemaVersion:1,status:'practice-pilot',
    bankId:'central-readonly-unit-'+unit,
    bankVersion:unit===4?'v64-original80-plus-corrected-topics41-46-475':unit===5?'v59-original-v50-v51-plus-source-master-317':unit===3?'v60-original-80-plus-formative-60-and-collisions-80':data[0].bankVersion,
    title:names[unit],unit,grade:11,questions:mapped,
    publicSelfPractice:true,secureExam:false,
    academicStatus:'provisional-independent-teacher-review-pending'
  };
}
root.PSNPracticeBankV55=Object.freeze({
  loadBank,expected:Object.freeze(expected),names:Object.freeze(names)
});
})(typeof window==='object'?window:globalThis);
