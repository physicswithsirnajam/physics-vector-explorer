/* V68: private-account dashboard workspace views, navigation only.
 * This is a visual organizer, not access control: Firebase claims and
 * Firestore rules remain authoritative. No account writes, new data
 * collection, local/session storage, analytics, or protected route grants. */
(()=>{
 'use strict';
 const dashboard=document.getElementById('dashboard-screen');
 const navigation=document.getElementById('psn-workspace-nav');
 if(!dashboard||!navigation)return;
 const buttons=[...navigation.querySelectorAll('a[data-workspace-tab]')];
 const panels=[...dashboard.querySelectorAll('[data-workspace-panel]')];
 const values=new Set(['overview','learn','progress','profile','privacy']);
 const hashMap=new Map([
  ['student-top','overview'],['learning-hub','learn'],['my-progress','progress'],
  ['my-profile','profile'],['privacy-centre','privacy']
 ]);
 let active='overview';
 function viewForHash(hash=location.hash){
  const h=String(hash||'').replace(/^#/,'');
  if(hashMap.has(h))return hashMap.get(h);
  const direct=document.getElementById(h);
  const parent=direct?.closest?.('[data-workspace-panel]');
  return values.has(parent?.dataset.workspacePanel)?parent.dataset.workspacePanel:'overview';
 }
 function select(view,{scroll=false}={}){
  const target=values.has(view)?view:'overview';
  active=target;
  for(const element of panels){
   element.hidden=element.dataset.workspacePanel!==target;
  }
  for(const button of buttons){
   const chosen=button.dataset.workspaceTab===target;
   if(chosen)button.setAttribute('aria-current','page');
   else button.removeAttribute('aria-current');
  }
  navigation.dataset.activeView=target;
  if(scroll&&!dashboard.hidden){
   requestAnimationFrame(()=>{
    const id=String(location.hash||'').replace(/^#/,'');
    const requested=id?document.getElementById(id):null;
    const targetEl=requested&&!requested.hidden&&requested.getClientRects().length?requested:navigation;
    targetEl.scrollIntoView({block:'start',behavior:'instant'});
   });
  }
 }
 function fromHash(options={}){select(viewForHash(),options);}
 navigation.addEventListener('click',event=>{
  const link=event.target.closest('a[data-workspace-tab]');
  if(!link)return;
  // Allow normal hash navigation and history/back handling.
  select(link.dataset.workspaceTab);
  if(location.hash===link.getAttribute('href'))fromHash({scroll:true});
 });
 document.addEventListener('click',event=>{
  const anchor=event.target.closest('a[href^="#"]');
  if(!anchor||navigation.contains(anchor))return;
  const destination=anchor.getAttribute('href');
  if(hashMap.has(destination.slice(1)))select(hashMap.get(destination.slice(1)));
 });
 window.addEventListener('hashchange',()=>fromHash({scroll:true}));
 fromHash();
 window.PSNWorkspaceTabs=Object.freeze({
  fromHash,select,
  current:()=>active,
  reset:()=>select('overview')
 });
})();
