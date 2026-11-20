(function(){
'use strict';
const $=id=>document.getElementById(id);
const base='../question-bank/grade-11/';
const groups=[
 {title:'Figure 6.2 · Immersed cylinder and upthrust',printedPage:90,fragment:'figure62',topic:'6.1',file:'unit-06-topic-61-v76-80-source.json',bankId:'PSN-XI-U06-T61-V76',ids:[11]},
 {title:'Figure 6.3 · Migrating geese V-formation',printedPage:92,fragment:'figure63',topic:'6.2',file:'unit-06-topic-62-v78-80-source.json',bankId:'PSN-XI-U06-T62-V78',ids:[26,72]},
 {title:'Figure 6.5(c) · Paratrooper speed–time graph',printedPage:94,fragment:'figure65c',topic:'6.2',file:'unit-06-topic-62-v78-80-source.json',bankId:'PSN-XI-U06-T62-V78',ids:[64]},
 {title:'Figure 6.6 · Streamline and turbulent flow',printedPage:95,fragment:'figure66',topic:'6.3',file:'unit-06-topic-63-v80-80-source.json',bankId:'PSN-XI-U06-T63-V80',ids:[24,80]}
];
const exactKeys={'XI-U06-T61-MCQ-0011':'C','XI-U06-T62-MCQ-0026':'D','XI-U06-T62-MCQ-0064':'A','XI-U06-T62-MCQ-0072':'D','XI-U06-T63-MCQ-0024':'B','XI-U06-T63-MCQ-0080':'B'};
const expectedHolds={'6.1':[11],'6.2':[26,64,72],'6.3':[24,80]};
const records=new Map();let loaded=false;
function el(tag,className,value){
 const node=document.createElement(tag);
 if(className)node.className=className;
 if(value!==undefined&&value!==null)node.textContent=String(value);
 return node;
}
function requireBank(b,group){
 if(!b||b.schemaVersion!==1||b.bankId!==group.bankId||b.grade!==11||b.unit!==6||
    b.topicNumber!==group.topic||b.sourceQuestionCount!==80||b.questions?.length!==80||
    b.publicSelfPractice!==true||b.secureExam!==false)throw Error('Unexpected original bank metadata');
 const held=b.questions.filter(q=>q.active===false),expected=expectedHolds[group.topic];
 if(held.map(q=>q.sourceQuestionNumber).join(',')!==expected.join(','))throw Error('Source hold flags have changed');
 for(const q of held){
  if(!Object.prototype.hasOwnProperty.call(exactKeys,q.id)||exactKeys[q.id]!==q.correctOptionId||
    q.boardEligible!==false||q.stimulusSetId!==null||q.cognitiveLevel!=='Unspecified'||
    !Array.isArray(q.sloCodes)||q.sloCodes.length!==0||
    !Array.isArray(q.options)||q.options.map(o=>o.id).join('')!=='ABCD'||
    typeof q.stem!=='string'||typeof q.explanation!=='string'||!q.holdReason){
   throw Error('Archived figure hold, key, or provisional certification changed');
  }
 }
}
function fieldWithCheckbox(text){
 const label=el('label');const check=document.createElement('input');
 check.type='checkbox';label.append(check,el('span','',text));return {label,check};
}
function makeQuestion(q,group){
 const article=el('article','question');article.id='held-'+q.id;
 article.append(el('p','qid',q.id+' · original Topic '+group.topic+' source Q'+q.sourceQuestionNumber+' · compiled study source p. '+q.sourcePdfPage));
 article.append(el('p','stem',q.stem));
 const opts=el('div','option-grid');
 for(const opt of q.options){const row=el('div','option');row.append(el('span','letter',opt.id),el('span','',opt.text));opts.append(row);}
 article.append(opts);
 const detail=el('details');const summary=el('summary','','Show original study-edition answer and explanation');
 detail.append(summary);
 const answer=q.options.find(o=>o.id===q.correctOptionId);
 const source=el('div','source-key');
 const key=el('p');key.append(el('strong','',q.correctOptionId+' — '+answer.text));
 source.append(key,el('p','',q.explanation),el('p','', 'Original hold reason: '+q.holdReason));
 detail.append(source);article.append(detail);
 const checks=el('div','checks');
 const viewed=fieldWithCheckbox('I examined the actual printed NBF figure, not only the V90 drawing.');
 const labels=fieldWithCheckbox('The printed figure’s arrows, axes, labels and orientation support the MCQ wording.');
 const answerSupported=fieldWithCheckbox('I independently checked the original A–D answer against the printed figure.');
 checks.append(viewed.label,labels.label,answerSupported.label);
 article.append(checks);
 const controls=el('div','controls');
 const choiceLabel=el('label','field');const choiceTitle=el('span','','Review recommendation');
 const choice=document.createElement('select');choice.setAttribute('aria-label','Review decision for '+q.id);
 [['not-reviewed','Not reviewed yet — held'],['keep-held','Keep held — review incomplete / issue found'],['candidate-signoff','Candidate for teacher signoff (still held)']].forEach(([v,t])=>{
  const o=document.createElement('option');o.value=v;o.textContent=t;choice.append(o);
 });
 choiceLabel.append(choiceTitle,choice);
 const noteLabel=el('label','field');noteLabel.append(el('span','','Evidence or concern (specific observations)'));
 const notes=document.createElement('textarea');notes.rows=3;notes.maxLength=1200;
 notes.placeholder='Printed label, visual discrepancy, graph stage, correct answer justification or unresolved concern…';
 notes.setAttribute('aria-label','Evidence notes for '+q.id);
 noteLabel.append(notes);controls.append(choiceLabel,noteLabel);article.append(controls);
 const indicator=el('p','indicator','The original question remains held regardless of this worksheet recommendation.');
 indicator.setAttribute('role','status');article.append(indicator);
 const item={q,group,viewed:viewed.check,labels:labels.check,answerSupported:answerSupported.check,choice,notes,indicator};
 function update(){
  if(choice.value==='candidate-signoff'){
   const all=viewed.check.checked&&labels.check.checked&&answerSupported.check.checked;
   const reason=notes.value.trim().length>=15;
   if(!all||!reason){
    choice.value='keep-held';
    indicator.textContent='Recommendation kept on HOLD: candidate status needs all three checks and at least 15 characters of evidence.';
   }else indicator.textContent='Candidate for independent teacher signoff only — the original question is still held.';
  }else{
   indicator.textContent=choice.value==='keep-held'?'Keep held — no public source question has changed.':'Not reviewed — source question remains held.';
  }
  rebuildSummary();
 }
 for(const box of [viewed.check,labels.check,answerSupported.check])box.addEventListener('change',update);
 choice.addEventListener('change',update);notes.addEventListener('input',update);
 records.set(q.id,item);return article;
}
function render(archives){
 const mount=$('review-container');mount.replaceChildren();
 for(const group of groups){
  const section=el('section','panel');
  const h=el('h2','',group.title);section.append(h);
  const caption=el('p','fig-crumb','Printed NBF Grade XI Physics p. '+group.printedPage+' · Topic '+group.topic);
  section.append(caption);
  const link=el('a','','Open the V90 teaching schematic (not the original textbook)');
  link.href='./unit-06-figure-study-v90.html#'+group.fragment;
  const p=el('p');p.append(link);section.append(p);
  const bank=archives[group.file];
  for(const n of group.ids){
   const q=bank.questions.find(q=>q.sourceQuestionNumber===n);
   if(!q||q.active!==false)throw Error('Expected held source question unavailable');
   section.append(makeQuestion(q,group));
  }
  mount.append(section);
 }
 if(records.size!==6)throw Error('Expected exactly six distinct held MCQs');
 loaded=true;$('copy-record').disabled=false;$('print-record').disabled=false;
 $('load-status').textContent='Six original held MCQs loaded from verified archives. Compare printed textbook pages 90, 92, 94 and 95.';
 rebuildSummary();
}
function rebuildSummary(){
 if(!loaded)return;
 const lines=['PHYSICS WITH SIR NAJAM — UNIT 6 PRINTED FIGURE VERIFICATION WORKSHEET (V91)',
 'Record type: Local recommendation ONLY. Not an official FBISE key, secure approval or automatic code change.',
 'Source: NBF Grade XI Physics, printed pp. 90, 92, 94 and 95. Compare the original artwork physically.',
 'Current public state: Unit 6 554 of 560 original MCQs selectable; six remain HELD; Grade XI total 2,244.',
 'All source bank flags remain HELD regardless of the recommendations below.',''];
 const entries=[...records.values()];
 const candidate=entries.filter(x=>x.choice.value==='candidate-signoff').length;
 const held=entries.filter(x=>x.choice.value==='keep-held').length;
 const notReviewed=entries.filter(x=>x.choice.value==='not-reviewed').length;
 lines.push('Recommendations: '+candidate+' candidates for separate teacher signoff, '+held+' keep held, '+notReviewed+' not reviewed.','');
 for(const item of entries){
  const q=item.q;
  lines.push(q.id+' | '+item.group.title+' | NBF printed p. '+item.group.printedPage,
   'Original stem: '+q.stem,
   'Original source answer: '+q.correctOptionId+' — '+q.options.find(o=>o.id===q.correctOptionId).text,
   'Printed original figure viewed: '+(item.viewed.checked?'YES':'NO'),
   'Labels/orientation support item: '+(item.labels.checked?'YES':'NO'),
   'Answer independently supported: '+(item.answerSupported.checked?'YES':'NO'),
   'Recommendation: '+(item.choice.value==='candidate-signoff'?'CANDIDATE — separate teacher signoff required':item.choice.value==='keep-held'?'KEEP HELD':'NOT REVIEWED'),
   'Evidence notes: '+(item.notes.value.trim()||'(none)'),
   'Public question status: STILL HELD','');
 }
 lines.push('Teacher signoff and an independently tested future PR are required before any source question can be activated.');
 $('review-summary').textContent=lines.join('\n');
 $('copy-status').textContent='Worksheet is ready for local copying. Nothing has been uploaded or automatically saved.';
}
async function copyRecord(){
 const content=$('review-summary').textContent;
 $('copy-status').textContent='Copying the review record to this device’s clipboard…';
 try{
  if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(content);
  else{
   const field=document.createElement('textarea');field.value=content;field.style.position='fixed';field.style.left='-99999px';
   document.body.append(field);field.select();
   const okay=document.execCommand('copy');field.remove();
   if(!okay)throw Error('Browser rejected clipboard operation');
  }
  $('copy-status').textContent='Review record copied locally. Paste it into the chat for further verification.';
 }catch(_){
  $('copy-status').textContent='Automatic copying was blocked. Select the visible review record and copy it manually.';
 }
}
$('copy-record').addEventListener('click',copyRecord);
$('print-record').addEventListener('click',()=>window.print());
const requested=[...new Set(groups.map(g=>g.file))];
Promise.all(requested.map(async file=>{
 const response=await fetch(base+file,{cache:'no-store'});
 if(!response.ok)throw Error('Cannot load original source '+file);
 const bank=await response.json();
 for(const group of groups.filter(g=>g.file===file))requireBank(bank,group);
 return [file,bank];
}))
.then(results=>render(Object.fromEntries(results)))
.catch(()=>{$('load-status').textContent='Original archives could not be verified. Review controls remain disabled; no question status was changed.';});
})();