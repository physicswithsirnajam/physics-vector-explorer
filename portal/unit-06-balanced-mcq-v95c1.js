/* V95-C1 · Topic-balanced public Unit 6 MCQ self-practice.
 * Reads existing seven public source banks; does not rewrite any stem,
 * options, answer key, explanation or per-question SLO metadata.
 * Browser-local, ungraded by school, no cookies/storage/cloud writes.
 */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const topics=[
 {n:61,id:'6.1',title:'Upthrust and Archimedes’ Principle',file:'unit-06-topic-61-v76-80-source.json',bankId:'PSN-XI-U06-T61-V76'},
 {n:62,id:'6.2',title:'Viscous Drag and Terminal Velocity',file:'unit-06-topic-62-v78-80-source.json',bankId:'PSN-XI-U06-T62-V78'},
 {n:63,id:'6.3',title:'Fluid Flow',file:'unit-06-topic-63-v80-80-source.json',bankId:'PSN-XI-U06-T63-V80'},
 {n:64,id:'6.4',title:'Equation of Continuity',file:'unit-06-topic-64-v82-80-source.json',bankId:'PSN-XI-U06-T64-V82'},
 {n:65,id:'6.5',title:'Bernoulli’s Equation',file:'unit-06-topic-65-v84-80-source.json',bankId:'PSN-XI-U06-T65-V84'},
 {n:66,id:'6.6',title:'Applications of Bernoulli’s Equation',file:'unit-06-topic-66-v86-80-source.json',bankId:'PSN-XI-U06-T66-V86'},
 {n:67,id:'6.7',title:'Superfluidity',file:'unit-06-topic-67-v88-80-source.json',bankId:'PSN-XI-U06-T67-V88'}
];
const knownFigures=new Set(['unit6-figure62','unit6-figure63','unit6-figure65c','unit6-figure66']);
const banks=new Map();
let test=[],answers=new Map(),flags=new Set(),at=0,submitted=false;
function element(tag,cls,text){
 const e=document.createElement(tag);
 if(cls)e.className=cls;
 if(text!==undefined)e.textContent=String(text);
 return e;
}
function shuffle(items){
 for(let i=items.length-1;i>0;i--){
  const j=Math.floor(Math.random()*(i+1));
  [items[i],items[j]]=[items[j],items[i]];
 }
 return items;
}
function requireSource(ok,reason){if(!ok)throw new Error('Unit 6 source verification failed: '+reason);}
function verify(topic,data){
 requireSource(data&&data.schemaVersion===1&&data.bankId===topic.bankId,'wrong bank '+topic.id);
 requireSource(data.topicNumber===topic.id&&data.unit===6&&data.grade===11,'wrong topic metadata '+topic.id);
 requireSource(Array.isArray(data.questions)&&data.questions.length===80,'expected 80 questions in '+topic.id);
 const seen=new Set(),numbers=new Set();
 for(const q of data.questions){
  requireSource(q&&q.grade===11&&q.unit===6&&q.type==='single_choice'&&q.active===true,'not an active original MCQ '+topic.id);
  requireSource(typeof q.id==='string'&&q.id.startsWith('XI-U06-T'+topic.n+'-MCQ-')&&!seen.has(q.id),'duplicate/invalid question ID');
  seen.add(q.id);
  requireSource(Number.isInteger(q.sourceQuestionNumber)&&q.sourceQuestionNumber>=1&&q.sourceQuestionNumber<=80&&!numbers.has(q.sourceQuestionNumber),'wrong original question number '+q.id);
  numbers.add(q.sourceQuestionNumber);
  requireSource(typeof q.stem==='string'&&q.stem.trim().length>=8,'missing source stem '+q.id);
  requireSource(Array.isArray(q.options)&&q.options.length===4&&q.options.map(o=>o?.id).join('')==='ABCD','option letter layout '+q.id);
  requireSource(q.options.every(o=>typeof o.text==='string'&&o.text.trim()),'blank source option '+q.id);
  requireSource(new Set(q.options.map(o=>o.text.normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim())).size===4,'exact duplicated original options '+q.id);
  requireSource(q.options.some(o=>o.id===q.correctOptionId)&&typeof q.explanation==='string'&&q.explanation.trim(),'missing key/explanation '+q.id);
  requireSource(q.boardEligible===false&&q.cognitiveLevel==='Unspecified'&&Array.isArray(q.sloCodes)&&q.sloCodes.length===0,'unexpected certification or SLO claim '+q.id);
  requireSource(q.stimulusSetId===null||q.stimulusSetId===undefined,'unverified grouped scenario '+q.id);
  requireSource(Boolean(q.situationBased)===(q.sourceSection==='standalone-situations'),'standalone situation mislabel '+q.id);
  requireSource(!q.referenceFigureId||(knownFigures.has(q.referenceFigureId)&&window.PSNUnit6FigureCardV93?.has(q)),'unverified source figure '+q.id);
 }
 requireSource(numbers.size===80,'nonunique source question numbers '+topic.id);
 const situations=data.questions.filter(q=>q.situationBased).length;
 requireSource(situations===(topic.n===61?16:20),'unexpected situation bank count '+topic.id);
 if(typeof data.originalSourceAnswerKey==='string'&&data.originalSourceAnswerKey.length===80){
  requireSource(data.questions.map(q=>q.correctOptionId).join('')===data.originalSourceAnswerKey,'source key sequence mismatch '+topic.id);
 }
 return data.questions;
}
function message(text,error=false){
 const status=$('status');status.textContent=text;status.classList.toggle('error',error);
}
function updateCounters(){
 $('answered').textContent=answers.size+' of '+test.length+' answered';
 $('flagged-count').textContent=flags.size+' marked for review';
}
function show(){
 if(!test.length)return;
 const item=test[at],q=item.q;
 $('position').textContent='Question '+(at+1)+' of '+test.length;
 $('progress-fill').style.width=((at+1)/test.length*100)+'%';
 $('question-meta').textContent='Topic '+item.topic.id+' · '+item.topic.title+' · '+(q.practiceVariantType==='teacher-approved-clarified-practice-variant'?'V111 clarified variant of source Q':q.practiceOverlayVersion==='V111'?'V111 corrected source Q':'original source Q')+q.sourceQuestionNumber+' · '+q.sourceSection.replace(/-/g,' ');
 $('question-stem').textContent=q.stem;
 const area=$('figure-reference');
 if(q.referenceFigureId){
  window.PSNUnit6FigureCardV93.show(area,q,'../assets/illustrations/');
 }else{area.replaceChildren();area.hidden=true;}
 const options=$('option-grid');options.replaceChildren();
 for(const option of q.options){
  const label=element('label','option');
  const radio=element('input');radio.type='radio';radio.name='mcq-answer';radio.value=option.id;
  radio.checked=answers.get(q.id)===option.id;
  radio.addEventListener('change',()=>{answers.set(q.id,option.id);updateCounters();});
  const letter=element('span','letter',option.id);
  const body=element('span','answer-text',option.text);
  label.append(radio,letter,body);options.append(label);
 }
 $('mark-review').checked=flags.has(q.id);
 $('previous').disabled=at===0;
 $('next').disabled=at===test.length-1;
 updateCounters();
}
function build(perTopic,mode,order){
 requireSource(banks.size===7,'all seven banks must be loaded');
 requireSource([4,5,6,8].includes(perTopic),'unsupported practice size');
 requireSource(['all','include-situation','situations-only'].includes(mode),'unrecognized selection mode');
 requireSource(['mixed','topic-order'].includes(order),'unrecognized question arrangement');
 const result=[];
 for(const topic of topics){
  const questions=banks.get(topic.id);
  let chosen;
  if(mode==='situations-only'){
   chosen=shuffle(questions.filter(q=>q.situationBased).slice()).slice(0,perTopic);
  }else if(mode==='include-situation'){
   const situation=shuffle(questions.filter(q=>q.situationBased).slice())[0];
   chosen=[situation,...shuffle(questions.filter(q=>q.id!==situation.id).slice()).slice(0,perTopic-1)];
  }else{
   chosen=shuffle(questions.slice()).slice(0,perTopic);
  }
  requireSource(chosen.length===perTopic,'not enough original items from '+topic.id);
  result.push(...chosen.map(q=>({q,topic})));
 }
 requireSource(new Set(result.map(x=>x.q.id)).size===result.length,'duplicated selected question IDs');
 return order==='mixed'?shuffle(result):result;
}
function start(event){
 event.preventDefault();
 if(banks.size!==7)return;
 const count=Number($('per-topic').value),mode=$('selection-mode').value,order=$('answer-order').value;
 try{
  test=build(count,mode,order);
  answers=new Map();flags=new Set();at=0;submitted=false;
  $('setup-panel').hidden=true;
  $('results-panel').hidden=true;
  $('quiz-panel').hidden=false;
  show();
  $('quiz-panel').scrollIntoView({block:'start'});
 }catch(err){message('Cannot start this practice: '+err.message,true);}
}
function submit(){
 if(!test.length||submitted)return;
 const unanswered=test.length-answers.size;
 if(unanswered>0&&!window.confirm(unanswered+' questions remain unanswered. Submit this local practice anyway?'))return;
 submitted=true;
 const results=topics.map(topic=>({
  topic,rows:test.filter(t=>t.topic.id===topic.id)
 }));
 const score=test.reduce((sum,item)=>sum+(answers.get(item.q.id)===item.q.correctOptionId?1:0),0);
 $('score').textContent=score+' / '+test.length;
 $('score-note').textContent=Math.round(score/test.length*100)+'% · '+answers.size+'/'+test.length+' answered · '+flags.size+' flagged · Local self-practice only; no school grade or cloud record.';
 const tbody=$('topic-breakdown');tbody.replaceChildren();
 for(const item of results){
  const tr=element('tr');const name=element('th','',item.topic.id+' · '+item.topic.title);
  name.scope='row';
  const answered=element('td','',item.rows.filter(x=>answers.has(x.q.id)).length+' / '+item.rows.length);
  const correct=element('td','',item.rows.filter(x=>answers.get(x.q.id)===x.q.correctOptionId).length+' / '+item.rows.length);
  tr.append(name,answered,correct);tbody.append(tr);
 }
 const review=$('review');review.replaceChildren();
 for(let i=0;i<test.length;i++){
  const {q,topic}=test[i],chosen=answers.get(q.id)||'Unanswered';
  const right=q.options.find(o=>o.id===q.correctOptionId);
  const chosenOption=q.options.find(o=>o.id===chosen);
  const ok=chosen===q.correctOptionId;
  const row=element('article','review-card '+(ok?'correct':'wrong'));
  row.append(element('h3','',(i+1)+'. Topic '+topic.id+' · '+(q.practiceVariantType==='teacher-approved-clarified-practice-variant'?'V111 clarified variant of source Q':q.practiceOverlayVersion==='V111'?'V111 corrected source Q':'source Q')+q.sourceQuestionNumber+' · '+(ok?'Correct':'Review')));
  row.append(element('p','',q.stem));
  if(q.referenceFigureId){
   const fig=element('div','figure-area');
   window.PSNUnit6FigureCardV93.append(fig,q,'../assets/illustrations/');
   row.append(fig);
  }
  row.append(element('p','', 'Your choice: '+chosen+(chosenOption?' — '+chosenOption.text:'')));
  row.append(element('p','answer','Source answer: '+right.id+' — '+right.text));
  row.append(element('p','',q.explanation));
  row.append(element('p','small-note','Source ID '+q.id+' · original compiled PDF p. '+(q.sourcePdfPage||'not recorded')+' · provisional key, teacher scientific review pending'+(flags.has(q.id)?' · marked for review':'')));
  review.append(row);
 }
 $('quiz-panel').hidden=true;$('results-panel').hidden=false;
 $('results-panel').scrollIntoView({block:'start'});
}
function reset(){
 test=[];answers=new Map();flags=new Set();at=0;submitted=false;
 $('results-panel').hidden=true;$('quiz-panel').hidden=true;$('setup-panel').hidden=false;
 message('Seven provisional source banks: 560 available practice MCQs, including four corrected/clarified Topic 6.4 records; 136 independent situations. No official exam certification.');
 $('setup-panel').scrollIntoView({block:'start'});
}
$('setup-form').addEventListener('submit',start);
$('previous').addEventListener('click',()=>{if(at>0){at--;show();}});
$('next').addEventListener('click',()=>{if(at<test.length-1){at++;show();}});
$('mark-review').addEventListener('change',event=>{
 if(!test.length)return;
 const id=test[at].q.id;
 if(event.target.checked)flags.add(id);else flags.delete(id);
 updateCounters();
});
$('finish').addEventListener('click',submit);
$('another').addEventListener('click',reset);
$('print-review').addEventListener('click',()=>window.print());
Promise.all(topics.map(async topic=>{
 const response=await fetch('../question-bank/grade-11/'+topic.file,{cache:'no-store'});
 if(!response.ok)throw Error('Topic '+topic.id+' bank returned HTTP '+response.status);
 const data=await response.json();
 const originals=verify(topic,data);
 if(topic.n!==64)return {topic,questions:originals};
 const over=await fetch('../question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json',{cache:'no-store'});
 if(!over.ok)throw Error('V111 safety overlay missing; cannot serve ambiguous Topic 6.4 originals');
 if(!window.PSNPracticeBankV55?.applyUnit6Topic64PracticeOverlay)throw Error('V111 safety transform missing');
 return {topic,questions:window.PSNPracticeBankV55.applyUnit6Topic64PracticeOverlay(originals,await over.json())};
})).then(list=>{
 for(const item of list)banks.set(item.topic.id,item.questions);
 $('start').disabled=false;
 message('All seven provisional source banks and V111 Topic 6.4 practice corrections verified. Choose 28–56 MCQs. No formal certification, school grade or cloud saving.');
}).catch(err=>{
 banks.clear();$('start').disabled=true;
 message('Source verification failed. This practice is disabled to avoid inaccurate or incomplete tests: '+err.message,true);
});
})();
