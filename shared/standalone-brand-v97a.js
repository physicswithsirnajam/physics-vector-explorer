/* V97-A · Physics with Sir Najam official branding for standalone Grade XI labs.
   Only public navigation and exact repository-owned branding assets. No physics
   model, authentication, tracking, storage or assessment behavior is touched. */
(()=>{
 'use strict';
 const script=document.currentScript;
 if(!script || document.getElementById('psn-standalone-brand-v97a'))return;
 const root=new URL('../',script.src);
 const nav=document.createElement('nav');
 nav.id='psn-standalone-brand-v97a';
 nav.className='psn-standalone-brand-v97a';
 nav.setAttribute('aria-label','Physics with Sir Najam laboratory navigation');
 const inner=document.createElement('div');
 inner.className='psn-standalone-brand-inner';
 const identity=document.createElement('div');
 identity.className='psn-standalone-brand-identity';
 const logo=document.createElement('img');
 logo.className='psn-standalone-brand-logo';
 logo.src=new URL('portal/assets/physics-with-sir-najam-official-logo.png',root).href;
 logo.alt='Physics with Sir Najam official logo';
 logo.width=40; logo.height=40; logo.decoding='async';
 const wording=document.createElement('div');
 wording.className='psn-standalone-brand-wording';
 const title=document.createElement('strong');
 title.className='psn-standalone-brand-title';
 title.textContent='PHYSICS WITH SIR NAJAM';
 const subtitle=document.createElement('span');
 subtitle.className='psn-standalone-brand-subtitle';
 subtitle.textContent='INTERACTIVE PHYSICS LABORATORY';
 wording.append(title,subtitle);
 identity.append(logo,wording);
 const links=document.createElement('div');
 links.className='psn-standalone-brand-links';
 const destinations=[
  ['portal/simulations.html','All Simulations'],
  ['portal/#learning-hub','Learning Hub'],
  ['student-guide.html','Student Guide']
 ];
 for(const [relative,name] of destinations){
  const a=document.createElement('a');
  a.className='psn-standalone-brand-link';
  a.href=new URL(relative,root).href;
  a.textContent=name;
  links.append(a);
 }
 inner.append(identity,links);
 nav.append(inner);
 document.body.insertBefore(nav,document.body.firstChild);
})();
