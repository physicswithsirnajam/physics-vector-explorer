(function () {
'use strict';
const $=id=>document.getElementById(id);
let source=null,pool=[],test=[],responses=new Map(),position=0;
const labels={fundamentals:'Fundamentals',reasoning:'Conceptual reasoning',numericals:'Numerical applications','standalone-situations':'Real-life situation'};
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function make(tag,className,text){const x=document.createElement(tag);if(className)x.className=className;if(text!==undefined)x.textContent=String(text);return x;}
function safeBank(bank){
 if(!bank||bank.schemaVersion!==1||bank.bankId!=='PSN-XI-U06-T62-V78'||!Array.isArray(bank.questions)||bank.questions.length!==80)return false;
 const ids=new Set();
 for(const q of bank.questions){
  if(q.unit!==6||!Number.isInteger(q.sourceQuestionNumber)||!q.stem||ids.has(q.id)||!Array.isArray(q.options)||q.options.length!==4||!['A','B','C','D'].includes(q.correctOptionId)||!q.explanation)return false;
  ids.add(q.id);
  if(q.options.map(x=>x.id).join('')!=='ABCD')return false;
  if(q.sloCodes?.length!==0||q.boardEligible!==false||q.stimulusSetId!==null)return false;
 }
 return bank.questions.filter(q=>q.active).length===77&&[26,64,72].every(n=>bank.questions.find(q=>q.sourceQuestionNumber===n)?.active===false);
}
function setMessage(message){$('load-status').textContent=message;}
function selectedQuestions(){
 const category=$('category').value;
 return source.questions.filter(q=>q.active&&(category==='all'||q.sourceSection===category));
}
function updateSize(){
 if(!source)return;
 const count=selectedQuestions().length;
 for(const opt of $('size').options)if(opt.value!=='all'){opt.disabled=Number(opt.value)>count;}
 if($('size').selectedOptions[0]?.disabled)$('size').value='all';
 setMessage(count+' questions available for this selection. No cloud save.');
 $('begin').disabled=count<1;
}
function build(){
 const available=selectedQuestions();
 const count=$('size').value==='all'?available.length:Math.min(available.length,Number($('size').value));
 if(count<1)return;
 test=shuffle(available.slice()).slice(0,count);responses=new Map();position=0;
 $('setup').hidden=true;$('results').hidden=true;$('quiz').hidden=false;showQuestion();$('quiz').scrollIntoView({block:'start'});
}
function showQuestion(){
 const q=test[position];
 $('position').textContent='Question '+(position+1)+' of '+test.length;
 $('answered').textContent=responses.size+' of '+test.length+' answered';
 $('bar').style.width=String(100*(position+1)/test.length)+'%';
 $('source-number').textContent='Original Topic 6.2 source Q'+q.sourceQuestionNumber+' · '+labels[q.sourceSection]+' · NBF pp. 91–95';
 $('stem').textContent=q.stem;
 PSNUnit6FigureCardV93.show($('figure-reference'),q,'../assets/illustrations/');
 const grid=$('option-grid');grid.replaceChildren();
 q.options.forEach(o=>{
  const lab=make('label','answer-option'),input=make('input'),letter=make('span','letter',o.id),body=make('span','',o.text);
  input.type='radio';input.name='answer-'+q.id;input.value=o.id;input.checked=responses.get(q.id)===o.id;
  input.addEventListener('change',()=>{responses.set(q.id,o.id);$('answered').textContent=responses.size+' of '+test.length+' answered';});
  lab.append(input,letter,body);grid.append(lab);
 });
 $('previous').disabled=position===0;
 $('next').disabled=position===test.length-1;
 $('next').textContent=position===test.length-1?'Last question':'Next question';
}
function submit(){
 const missing=test.length-responses.size;
 if(missing>0&&!window.confirm('You have '+missing+' unanswered question(s). Submit this practice anyway?'))return;
 const marks=test.reduce((n,q)=>n+(responses.get(q.id)===q.correctOptionId?1:0),0);
 $('quiz').hidden=true;$('results').hidden=false;
 $('score').textContent=marks+' / '+test.length;
 $('score-note').textContent='Self-practice result only · '+Math.round(100*marks/test.length)+'% · No cloud record or official grade';
 const review=$('review');review.replaceChildren();
 test.forEach((q,i)=>{
  const row=make('article'),good=responses.get(q.id)===q.correctOptionId;
  row.append(make('strong',good?'ok':'wrong','Q'+(i+1)+' · '+(good?'Correct':'Review needed')+' · original Q'+q.sourceQuestionNumber));
  row.append(make('p','',q.stem));
  const selected=responses.get(q.id)||'Unanswered';
  const right=q.options.find(x=>x.id===q.correctOptionId);
  const user=q.options.find(x=>x.id===selected);
  row.append(make('p','answer-summary','Your choice: '+selected+(user?' — '+user.text:'')+' | Answer: '+right.id+' — '+right.text));
  row.append(make('p','',q.explanation));
  row.append(make('small','subtle','Original compiled source PDF p. '+q.sourcePdfPage+' · provisional public practice'));
  review.append(row);
 });
 $('results').scrollIntoView({block:'start'});
}
$('category').addEventListener('change',updateSize);
$('size').addEventListener('change',updateSize);
$('begin').addEventListener('click',build);
$('previous').addEventListener('click',()=>{if(position>0){position--;showQuestion();}});
$('next').addEventListener('click',()=>{if(position<test.length-1){position++;showQuestion();}});
$('finish').addEventListener('click',submit);
$('try-again').addEventListener('click',()=>{$('results').hidden=true;$('setup').hidden=false;updateSize();$('setup').scrollIntoView({block:'start'});});
$('print-review').addEventListener('click',()=>window.print());
fetch('../question-bank/grade-11/unit-06-topic-62-v78-80-source.json',{cache:'no-store'})
 .then(r=>{if(!r.ok)throw Error('Source not available');return r.json();})
 .then(bank=>{if(!safeBank(bank))throw Error('Source validation failed');source=bank;pool=bank.questions.filter(q=>q.active);$('question-count').textContent=String(pool.length);updateSize();})
 .catch(()=>{setMessage('The question bank could not be verified. Practice has been disabled; please try again later.');$('begin').disabled=true;});
})();
