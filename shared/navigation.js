/* Public navigation only; this bar never grants access or changes authentication. */
(() => {
  const script=document.currentScript;
  if(!script || document.getElementById('psn-global-nav'))return;
  const root=new URL('../',script.src);
  const here=location.pathname;
  const link=(target,label,key)=>({url:new URL(target,root).href,label,key});
  const links=[
    link('portal/','Dashboard','portal'),
    link('portal/#my-progress','My Progress','progress'),
    link('build-your-physics-test.html','Build a Test','builder'),
    link('portal/#learning-hub','Learning Hub','learn'),
    {url:'https://sites.google.com/view/physics-with-sir-najam/student-hub/1st-year-hssc',label:'Simulations',key:'explore'},
    link('assessment-blueprint/','FBISE Blueprint','blueprint')
  ];
  const nav=document.createElement('nav');nav.id='psn-global-nav';nav.setAttribute('aria-label','Physics with Sir Najam main navigation');
  const inner=document.createElement('div');inner.className='psn-nav-inner';
  const title=document.createElement('a');title.className='psn-nav-title';title.href=links[0].url;
  const logo=document.createElement('img');logo.src=new URL('portal/assets/physics-with-sir-najam-official-logo.png',root).href;logo.alt='';logo.loading='lazy';
  const brand=document.createElement('span');brand.textContent='Physics with Sir Najam';title.append(logo,brand);
  const list=document.createElement('div');list.className='psn-nav-links';
  for(const item of links){
    const a=document.createElement('a');a.href=item.url;a.textContent=item.label;
    if(item.key==='portal'&&/\/portal\/?$/.test(here))a.setAttribute('aria-current','page');
    if(item.key==='builder'&&here.endsWith('/build-your-physics-test.html'))a.setAttribute('aria-current','page');
    if(item.key==='blueprint'&&here.includes('/assessment-blueprint/'))a.setAttribute('aria-current','page');
    a.addEventListener('click',event=>{
      const quiz=document.getElementById('quiz'),result=document.getElementById('result');
      // A live, unsubmitted quiz has unsaved answers; confirm before leaving.
      if(quiz && !quiz.classList.contains('hidden') && (!result || result.classList.contains('hidden'))){
        if(!window.confirm('Your test is still in progress. Leaving this page will discard unsaved answers. Continue?')) event.preventDefault();
      }
    });
    list.append(a);
  }
  inner.append(title,list);nav.append(inner);
  document.body.prepend(nav);
})();
