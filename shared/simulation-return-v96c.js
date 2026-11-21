/* Physics with Sir Najam · V96-C.
   Shared accessible navigation for original standalone Unit 6 simulations only.
   Pure same-origin anchors; no authentication, data collection or changes to lab models.
   Absolute targets are computed from this script's repository base so both custom-domain
   and project-path GitHub Pages installations work. */
(()=>{
  'use strict';
  const script=document.currentScript;
  if(!script||document.getElementById('psn-simulation-return-nav'))return;
  const repoRoot=new URL('../',script.src);
  const links=[
    ['portal/unit-06-learning-desk-v95a.html','Unit 6 Learning Desk'],
    ['portal/simulations.html?unit=6','Unit 6 Simulations'],
    ['portal/#learning-hub','Learning Hub'],
    ['portal/#student-top','Dashboard']
  ];
  const nav=document.createElement('nav');
  nav.id='psn-simulation-return-nav';
  nav.className='psn-simulation-return';
  nav.setAttribute('aria-label','Return to Unit 6 and learning portal');
  const inner=document.createElement('div');
  inner.className='psn-simulation-return-inner';
  // Reuse the repository's original official logo without redrawing it.
  // The identity is deliberately not an anchor: the four navigation targets stay unchanged.
  const identity=document.createElement('div');
  identity.className='psn-simulation-return-identity';
  const logo=document.createElement('img');
  logo.className='psn-simulation-return-logo';
  logo.src=new URL('portal/assets/physics-with-sir-najam-official-logo.png',repoRoot).href;
  logo.alt='Physics with Sir Najam official logo';
  logo.width=38;logo.height=38;logo.decoding='async';
  const labelGroup=document.createElement('div');
  labelGroup.className='psn-simulation-return-wordmark';
  const brandName=document.createElement('span');
  brandName.className='psn-simulation-return-brand';
  brandName.textContent='PHYSICS WITH SIR NAJAM';
  const title=document.createElement('span');
  title.className='psn-simulation-return-label';
  title.textContent='UNIT 6 · EXPLORE';
  labelGroup.append(brandName,title);
  identity.append(logo,labelGroup);
  inner.append(identity);
  const linkList=document.createElement('div');
  linkList.className='psn-simulation-return-links';
  for(const [relative,label] of links){
    const anchor=document.createElement('a');
    anchor.href=new URL(relative,repoRoot).href;
    anchor.textContent=label;
    anchor.className='psn-simulation-return-link';
    if(relative.startsWith('portal/#'))anchor.title='Opens the learner portal; sign-in or Grade XI enrollment may be required';
    linkList.append(anchor);
  }
  inner.append(linkList);
  nav.append(inner);
  document.body.insertBefore(nav,document.body.firstChild);
})();
