/* Physics with Sir Najam — Portal V11 Grade XI course catalogue.
   Resource metadata and the catalogue JSON are PUBLIC. They DO NOT grant access.
   Firestore Security Rules enforce the enrolled protected-lesson read.
   Public GitHub Pages files are not made private by navigation alone.
   Never infer paid access, board verification, or teacher permissions from this data. */
import {SLO_TOPICS,targetedPracticeUrl} from './learning-analytics.js';

const byId=id=>document.getElementById(id);
const catalogUrl=new URL('./learning-catalog.json?v=74',import.meta.url);
const gradeButtons=[...document.querySelectorAll('[data-hub-grade]')];
let selectedGrade='11'; // displayed only after the Firestore enrollment gate
let selectedUnit='all'; // filter within the learner's Grade XI course; does not grant access
let showAllResources=false; // user-controlled expansion; not an access grant
let catalogue=null;
const fallbackBuilder='../build-your-physics-test.html';
const ACCESS_LABELS={
 'public-link':'Public link',
 'enrolled-protected':'Enrolled learner',
 'account-private':'My private progress'
};
function safeHref(raw){
 try{
  const url=new URL(raw,location.href);
  if(!['http:','https:'].includes(url.protocol))return null;
  // Only same-site links are surfaced in learner navigation; archived original
  // source URLs remain in the separate migration inventory.
  return url.origin===location.origin?url.href:null;
 }catch{return null;}
}
function resetChildren(id){const node=byId(id);node?.replaceChildren();return node;}
function chip(text,kind){
 const item=document.createElement('span');item.className='hub-chip';item.textContent=text;
 if(kind)item.dataset.live=kind;
 return item;
}
function renderResourceList(grade,active){
 const wrap=resetChildren('hub-resources');
 const visibleUnits=selectedUnit==='all'?active:active.filter(u=>String(u.unit)===selectedUnit);
 const ids=[...new Set(visibleUnits.flatMap(u=>u.resourceIds||[]))];
 const records=[...ids.map(id=>catalogue.resources.find(x=>x.id===id)),
   ...visibleUnits.filter(u=>u.practicePreviewStatus==='public-provisional').flatMap(u=>Array.isArray(u.previewResources)?u.previewResources:[])];
 const filter=byId('hub-resource-filter')?.value||'all';
 const term=(byId('hub-resource-search')?.value||'').trim().toLowerCase();
 const browseButton=byId('hub-browse-all');
 if(browseButton){
  browseButton.hidden=selectedUnit!=='all';
  browseButton.setAttribute('aria-expanded',String(showAllResources));
  browseButton.textContent=showAllResources?'Hide all learning resources':'Show all learning resources';
 }
 if(selectedUnit==='all'&&!showAllResources&&filter==='all'&&!term){
  byId('hub-resource-feedback').textContent='Choose a unit above to see its resources, or search, filter or show all resources.';
  return;
 }
 let found=0;
 for(const r of records){
  if(!r)continue;
  if(filter!=='all'&&r.category!==filter)continue;
  if(term&&![r.title,r.description,r.category,r.accessDescription].join(' ').toLowerCase().includes(term))continue;
  const href=safeHref(r.href);if(!href)continue;
  const link=document.createElement('a');link.className='hub-resource';link.href=href;
  if(r.external){link.target='_blank';link.rel='noopener noreferrer';}
  const kind=document.createElement('span');kind.textContent=r.category||'RESOURCE';
  const title=document.createElement('strong');title.textContent=r.title||'Learning resource';
  const explanation=document.createElement('small');explanation.textContent=r.description||'';
  const badge=document.createElement('span');badge.className='hub-access-pill';
  badge.dataset.access=r.access||'public-link';badge.textContent=ACCESS_LABELS[r.access]||'Public link';
  const detail=document.createElement('small');detail.className='hub-access-detail';detail.textContent=r.accessDescription||'';
  const action=document.createElement('span');action.className='hub-open';action.textContent=r.action||'Open resource';
  link.append(kind,title,explanation,badge,detail,action);wrap.append(link);found++;
 }
 byId('hub-resource-feedback').textContent=found
   ? `${found} resource${found===1?'':'s'} shown · Access labels describe how each resource is currently delivered.`
   : 'No matching resources are currently linked for this unit. Clear the filter or search to see available items.';
}
function appendSourceReferences(card,unit){
 const count=(unit.directYouTubeCount||0)+(unit.legacyVideoPageCount||0)+(unit.originalPdfCount||0)+(unit.originalExternalReadingCount||0);
 if(!count||!unit.originalReferenceHref)return;
 const url=safeHref(unit.originalReferenceHref);
 if(!url)return;
 const link=document.createElement('a');
 link.href=url;link.className='hub-source-reference-shortcut';
 const pieces=[];
 if(unit.directYouTubeCount)pieces.push(unit.directYouTubeCount+' YouTube concept video'+(unit.directYouTubeCount===1?'':'s'));
 else if(unit.legacyVideoPageCount)pieces.push(unit.legacyVideoPageCount+' original video page'+(unit.legacyVideoPageCount===1?'':'s'));
 if(unit.originalPdfCount)pieces.push(unit.originalPdfCount+' original PDF'+(unit.originalPdfCount===1?'':'s'));
 if(unit.originalExternalReadingCount)pieces.push(unit.originalExternalReadingCount+' external reading');
 link.textContent='View source resources: '+pieces.join(' + ')+(unit.directVideoReviewRequired?' · Review one video link':'')+' ↗';
 link.title='YouTube and Google Drive resources are publicly linked, not protected student-only files';
 card.append(link);
}
function renderGrade(){
 const xi=selectedGrade==='11';
 byId('hub-main').hidden=!xi;
 byId('hub-upcoming').hidden=xi;
 for(const button of gradeButtons)button.setAttribute('aria-pressed',String(button.dataset.hubGrade===selectedGrade));
 const line=byId('hub-availability');
 if(!xi){line.textContent='No course resources are linked for this enrollment yet';return;}
 if(!catalogue){line.textContent='Catalogue temporarily unavailable. Existing links in the dashboard may still work.';return;}
 const grade=catalogue.grades.find(g=>g.grade===11);
 if(!grade){line.textContent='Grade XI catalogue is not available.';return;}
 const published=grade.units.filter(u=>u.status==='available');
 const previews=grade.units.filter(u=>u.status!=='available'&&u.practicePreviewStatus==='public-provisional'&&Number(u.partialTestBuilderMcqCount)>0&&Array.isArray(u.previewResources)&&u.previewResources.length>0);
 const active=[...published,...previews].sort((a,b)=>a.unit-b.unit);
 const planned=grade.units.filter(u=>!active.includes(u));
 const total=grade.units.length;
 const unitFilter=byId('hub-unit-filter');
 if(unitFilter){
   const old=selectedUnit;
   unitFilter.replaceChildren();
   const all=document.createElement('option');all.value='all';all.textContent='All units with study or practice resources';unitFilter.append(all);
   for(const u of active){const option=document.createElement('option');option.value=String(u.unit);option.textContent=`Unit ${u.unit} — ${u.title}${u.practicePreviewStatus==='public-provisional'?' (practice preview)':''}`;unitFilter.append(option);}
   selectedUnit=active.some(u=>String(u.unit)===old)?old:'all';unitFilter.value=selectedUnit;
 }
 byId('hub-total-units').textContent=String(total);
 byId('hub-linked-units').textContent=String(active.length);
 byId('hub-awaiting-units').textContent=String(planned.length);
 byId('hub-upcoming-count').textContent=`(${planned.length})`;
 line.textContent=`Grade XI / FBISE · ${published.length} published-resource units + ${previews.length} provisional practice preview${previews.length===1?'':'s'} · ${active.length} of ${total} units with learning resources. Full Unit 6 course and formal assessment remain pending.`;
 const list=resetChildren('hub-units');
 list.dataset.view=selectedUnit==='all'?'overview':'focused';
 const current=active.find(u=>String(u.unit)===selectedUnit);
 const selectionStatus=byId('hub-selection-status');
 if(selectionStatus)selectionStatus.textContent=current
   ? `Showing Unit ${current.unit} — ${current.title}${current.practicePreviewStatus==='public-provisional'?' (provisional practice)':''}. Choose another unit to switch resources.`
   : 'Browse six units below or select one unit to focus on its resources.';
 const unit6Topics=byId('hub-unit6-topic-shortcuts');
 if(unit6Topics)unit6Topics.hidden=selectedUnit!=='all'&&selectedUnit!=='6';
 for(const u of active){
  if(selectedUnit!=='all'&&String(u.unit)!==selectedUnit)continue;
  const card=document.createElement('article');card.className='hub-unit';
  const top=document.createElement('div');top.className='hub-unit-top';
  const title=document.createElement('strong');title.textContent=`Unit ${u.unit} — ${u.title}`;
  const bankCount=Number(u.questionBankCount)>0?Number(u.questionBankCount):u.practicePreviewStatus==='public-provisional'?Number(u.partialTestBuilderMcqCount)||0:0;
  const hasBank=bankCount>0;
  top.append(title,chip(u.practicePreviewStatus==='public-provisional'?'Provisional practice · Teacher approval pending':hasBank?'Pilot MCQ practice':'Enrolled study lessons','true'));
  const desc=document.createElement('p');desc.textContent=u.summary||'';
  const meta=document.createElement('div');meta.className='hub-unit-meta';
  meta.append(chip(hasBank?`${bankCount} provisional MCQs`:'Unit MCQs not yet imported'),chip(u.practicePreviewStatus==='public-provisional'?'First-pass inspected · Certification pending':hasBank?'MCQ academic review pending':'Unit source package QC passed'));
  const note=document.createElement('p');note.className='hub-unit-note';
  note.textContent=u.studentNotice||'Available for exploratory self-practice; academic approval remains in progress.';
  card.append(top,desc,meta,note);
  const unitHref=u.landingHref?safeHref(u.landingHref):null;
  if(unitHref){const link=document.createElement('a');link.href=unitHref;link.className='btn btn-secondary btn-small';link.textContent=`Open Unit ${u.unit} ${u.practicePreviewStatus==='public-provisional'?'Learning Desk Preview':'Learning Desk'} ↗`;card.append(link);}
  if(hasBank&&Number.isInteger(u.unit)&&u.unit>=1&&u.unit<=6){
    const practiceHref=safeHref('../build-your-physics-test.html?unit='+u.unit);
    if(practiceHref){const practice=document.createElement('a');practice.href=practiceHref;practice.className='btn btn-primary btn-small';practice.textContent=`Practise Unit ${u.unit} MCQs ↗`;card.append(practice);}
  }
  if(u.simulationCount>0&&u.simulationHref){
    const simulationHref=safeHref(u.simulationHref);
    if(simulationHref){const explore=document.createElement('a');explore.href=simulationHref;
      explore.className='hub-sim-shortcut';explore.textContent='Explore '+u.simulationCount+' original simulation'+(u.simulationCount===1?'':'s')+' ↗';
      card.append(explore);}
  }
  appendSourceReferences(card,u);
  list.append(card);
 }
 const upcoming=resetChildren('hub-planned-units');
 for(const u of planned){
  const card=document.createElement('div');card.className='hub-planned-unit';
  const label=document.createElement('span');label.textContent='Unit '+u.unit+' · '+(u.title||'Physics');
  const note=document.createElement('small');
  note.textContent=u.simulationCount>0
    ?'Full unit notes and MCQs in preparation; original interactive labs can already be explored.'
    :'Unit lessons and MCQs in preparation';
  card.append(label,note);
  if(u.simulationCount>0&&u.simulationHref){
    const link=safeHref(u.simulationHref);
    if(link){const explore=document.createElement('a');explore.href=link;
      explore.className='hub-sim-shortcut';explore.textContent='Explore '+u.simulationCount+' original lab'+(u.simulationCount===1?'':'s')+' ↗';card.append(explore);}
  }
  appendSourceReferences(card,u);
  upcoming.append(card);
 }
 renderResourceList(grade,active);
}
export function initLearningHub(){
 for(const btn of gradeButtons){btn.disabled=true;btn.title='Enrollment grade is controlled by your academic record';}
 byId('hub-back-to-xi')?.addEventListener('click',event=>{event.preventDefault();byId('learning-hub').scrollIntoView({block:'start'});});
 for(const id of ['hub-unit-filter','hub-resource-filter','hub-resource-search']){
  const input=byId(id);if(!input)continue;
  input.addEventListener(id==='hub-resource-search'?'input':'change',()=>{
    if(id==='hub-unit-filter'){
      selectedUnit=input.value;
      if(selectedUnit!=='all')showAllResources=false;
    }
    if(catalogue&&selectedGrade==='11')renderGrade();
  });
 }
 byId('hub-browse-all')?.addEventListener('click',()=>{
  showAllResources=!showAllResources;
  if(catalogue&&selectedGrade==='11'){
   const grade=catalogue.grades.find(g=>g.grade===11);
   const visible=grade?.units.filter(u=>u.status==='available'||u.practicePreviewStatus==='public-provisional')||[];
   renderResourceList(grade,visible);
  }
 });
 const slos=resetChildren('hub-slo-links');
 for(const [code,title] of Object.entries(SLO_TOPICS)){
  const url=targetedPracticeUrl(code);if(!url)continue;
  const href=safeHref(url);if(!href)continue;
  const item=document.createElement('a');item.className='hub-slo-link';item.href=href;
  const slo=document.createElement('strong');slo.textContent=code+(code==='P-11-A-01'?' · Formative':'');
  const text=document.createElement('span');text.textContent=title;item.append(slo,text);slos.append(item);
 }
 renderGrade();
 fetch(catalogUrl,{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error('Catalogue unavailable');return response.json();})
 .then(data=>{
  if(data.schemaVersion!==1||!Array.isArray(data.grades)||!Array.isArray(data.resources))throw new Error('Invalid catalogue');
  const grade=data.grades.find(g=>g.grade===11);
  if(!grade||!Array.isArray(grade.units))throw new Error('Grade XI catalogue unavailable');
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
  message.textContent='Practise MCQs from any published Grade XI Unit 1–5, or combine units. To build a private saved history, start with an individual Unit 1 or Unit 2 test and choose Save after submitting.';
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
  message.textContent='No specific revision priority is established from your currently saved Unit 1/2 attempts. You can practise any of Units 1–5; combined-unit results can be printed but are not saved to your account yet.';
  link.href=fallbackBuilder;link.textContent='Choose another practice test ↗';
 }
 note.textContent=hasOlder
  ? `Based on ${analytics.attempts} loaded attempts. Older saved attempts may remain and could change this suggestion.`
  : `Based on all ${analytics.attempts} currently saved attempts. Recommendations are provisional self-practice insights.`;
}
export function clearLearningHubInsight(){updateLearningHubInsight(null,true);}

export function setHubEnrollment(grade){selectedGrade=String(grade);renderGrade();}
