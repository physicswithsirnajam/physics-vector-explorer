/* Physics with Sir Najam — Portal V6 Student Learning Hub.
   The resource catalogue includes only existing public links and local progress navigation.
   Its public JSON is NOT a paywall, entitlement check, or protected resource system.
   Sensitive learner analytics remain in Firebase-owned session memory only. */
import {SLO_TOPICS,targetedPracticeUrl} from './learning-analytics.js';

const byId=id=>document.getElementById(id);
const catalogUrl=new URL('./learning-catalog.json',import.meta.url);
const gradeButtons=[...document.querySelectorAll('[data-hub-grade]')];
let selectedGrade='11';
let catalogue=null;
const fallbackBuilder='../build-your-physics-test.html';
function safeHref(raw){
 try{
  const url=new URL(raw,location.href);
  if(!['http:','https:'].includes(url.protocol))return null;
  // Only official public Site and same-origin repository URLs may be listed.
  const sameOrigin=url.origin===location.origin;
  const officialSite=url.hostname==='sites.google.com'&&url.pathname.startsWith('/view/physics-with-sir-najam/');
  return sameOrigin||officialSite?url.href:null;
 }catch{return null;}
}
function renderGrade(){
 const xi=selectedGrade==='11';
 byId('hub-main').hidden=!xi;
 byId('hub-upcoming').hidden=xi;
 for(const button of gradeButtons)button.setAttribute('aria-pressed',String(button.dataset.hubGrade===selectedGrade));
 const line=byId('hub-availability');
 if(!xi){line.textContent='Grade IX is planned · No linked question bank available yet';return;}
 if(!catalogue){line.textContent='Unit 1 is available · Learning catalogue could not be loaded. Existing practice links are still accessible above.';return;}
 const grade=catalogue.grades.find(g=>g.grade===11);
 if(!grade){line.textContent='The learning catalogue needs attention.';return;}
 const active=grade.units.filter(u=>u.status==='available');
 line.textContent=`Grade XI · ${active.length} unit(s) currently linked · Unit 1 self-practice bank: 275 MCQs (provisional)`;
 const list=byId('hub-units');list.replaceChildren();
 for(const u of active){
  const card=document.createElement('article');card.className='hub-unit';
  const top=document.createElement('div');top.className='hub-unit-top';
  const title=document.createElement('strong');title.textContent=`Unit ${u.unit} — ${u.title}`;
  const chip=document.createElement('span');chip.className='hub-chip';chip.dataset.live='true';chip.textContent='Available for practice';top.append(title,chip);
  const desc=document.createElement('p');desc.textContent=u.summary||'';
  const meta=document.createElement('div');meta.className='hub-unit-meta';
  for(const label of [`${u.questionBankCount||0} imported MCQs`,'Academic review in progress','More units to follow']){
   const span=document.createElement('span');span.className='hub-chip';span.textContent=label;meta.append(span);
  }
  card.append(top,desc,meta);list.append(card);
 }
 const resources=byId('hub-resources');resources.replaceChildren();
 for(const id of (active[0]?.resourceIds||[])){
  const r=catalogue.resources.find(x=>x.id===id);if(!r)continue;
  const href=safeHref(r.href);if(!href)continue;
  const link=document.createElement('a');link.className='hub-resource';link.href=href;
  if(r.external){link.target='_blank';link.rel='noopener noreferrer';}
  const kind=document.createElement('span');kind.textContent=r.category||'RESOURCE';
  const title=document.createElement('strong');title.textContent=r.title||'Learning resource';
  const explanation=document.createElement('small');explanation.textContent=r.description||'';
  const action=document.createElement('span');action.className='hub-open';action.textContent=r.action||'Open resource ↗';
  link.append(kind,title,explanation,action);resources.append(link);
 }
}
export function initLearningHub(){
 for(const btn of gradeButtons)btn.addEventListener('click',()=>{selectedGrade=btn.dataset.hubGrade;renderGrade();});
 byId('hub-back-to-xi')?.addEventListener('click',event=>{event.preventDefault();selectedGrade='11';renderGrade();byId('learning-hub').scrollIntoView({block:'start'});});
 const slos=byId('hub-slo-links');slos.replaceChildren();
 for(const [code,title] of Object.entries(SLO_TOPICS)){
  // A-01 is formative, but topic-level practice may still be useful. Display its status clearly.
  const url=targetedPracticeUrl(code);if(!url)continue;
  const item=document.createElement('a');item.className='hub-slo-link';item.href=safeHref(url)||url;
  const slo=document.createElement('strong');slo.textContent=code+(code==='P-11-A-01'?' · Formative':'');
  const text=document.createElement('span');text.textContent=title;item.append(slo,text);slos.append(item);
 }
 renderGrade();
 fetch(catalogUrl,{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error('Catalogue unavailable');return response.json();})
 .then(data=>{
  if(data.schemaVersion!==1||!Array.isArray(data.grades)||!Array.isArray(data.resources))throw new Error('Invalid catalogue');
  catalogue=data;renderGrade();
 }).catch(()=>{catalogue=null;renderGrade();});
}
export function updateLearningHubInsight(analytics,hasOlder){
 const message=byId('hub-focus-message'),link=byId('hub-focus-link'),note=byId('hub-focus-evidence');
 if(!message||!link||!note)return;
 const focus=analytics?.priority?.[0];
 const needs=analytics?.needsEvidence?.[0];
 const target=focus||needs;
 if(!analytics?.attempts){
  message.textContent='Start with a short Unit 1 MCQ test. Save your result to begin building a personal revision history.';
  note.textContent='No saved practice results have been loaded yet.';
  link.href=fallbackBuilder;link.textContent='Build my first test ↗';return;
 }
 if(target){
  message.textContent=focus
    ? `Your loaded practice suggests revisiting ${SLO_TOPICS[focus.code]||focus.code} (${focus.code}). Try a short targeted session, then save the result.`
    : `More evidence is needed for ${SLO_TOPICS[needs.code]||needs.code} (${needs.code}). A short targeted session may help clarify your current understanding.`;
  link.href=targetedPracticeUrl(target.code)||fallbackBuilder;
  link.textContent=focus?'Practise suggested SLO ↗':'Collect more SLO practice ↗';
 }else{
  message.textContent='No specific revision priority is established from the currently loaded attempts. Continue practising different Unit 1 outcomes.';
  link.href=fallbackBuilder;link.textContent='Choose another practice test ↗';
 }
 note.textContent=hasOlder
  ? `Based on ${analytics.attempts} loaded attempts. Older saved attempts may remain and could change this suggestion.`
  : `Based on all ${analytics.attempts} currently saved attempts. Recommendations are provisional self-practice insights.`;
}
export function clearLearningHubInsight(){updateLearningHubInsight(null,true);}
