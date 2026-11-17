/* Physics with Sir Najam V68 global public navigation.
 * An accessible, collapsible unit/resource drawer. It is navigation ONLY:
 * no login authority, data writes, academic approval or protected content grants.
 * Unit/resource links are derived from the already-public course catalogue.
 */
(() => {
  'use strict';
  const script=document.currentScript;
  if(!script || document.getElementById('psn-global-nav'))return;
  const root=new URL('../',script.src);
  const here=location.pathname;
  const e=(tag,className,text)=>{
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=text;
    return node;
  };
  const safeHref=(raw,base)=>{
    if(typeof raw!=='string'||!raw.trim())return null;
    try{
      const url=new URL(raw,base);
      const sameOrigin=url.origin===root.origin && url.pathname.startsWith(root.pathname);
      const verifiedSite=url.hostname==='sites.google.com' &&
        url.pathname.startsWith('/view/physics-with-sir-najam/');
      return url.protocol==='https:'&& (sameOrigin||verifiedSite) ? url.href :
        url.protocol==='http:'&&sameOrigin ? url.href : null;
    }catch{return null;}
  };
  const link=(target,label,key)=>({url:new URL(target,root).href,label,key});
  const links=[
    link('portal/','Dashboard','portal'),
    link('portal/#my-progress','My Progress','progress'),
    link('build-your-physics-test.html','Build a Test','builder'),
    link('portal/#learning-hub','Learning Hub','learn'),
    link('student-guide.html','Student Guide','guide'),
    link('portal/simulations.html','Simulations','simulations'),
    link('assessment-blueprint/','FBISE Blueprint','blueprint')
  ];
  const isQuizInProgress=()=>{
    const quiz=document.getElementById('quiz'),result=document.getElementById('result');
    return Boolean(quiz && !quiz.classList.contains('hidden') &&
      (!result||result.classList.contains('hidden')));
  };
  function permitNavigation(event){
    if(isQuizInProgress() &&
      !window.confirm('Your test is still in progress. Leaving this page will discard unsaved answers. Continue?')){
      event.preventDefault();return false;
    }
    return true;
  }
  const nav=e('nav');nav.id='psn-global-nav';
  nav.setAttribute('aria-label','Physics with Sir Najam main navigation');
  const inner=e('div','psn-nav-inner');
  const trigger=e('button','psn-nav-menu-button');
  trigger.type='button';trigger.setAttribute('aria-controls','psn-resource-drawer');
  trigger.setAttribute('aria-expanded','false');
  trigger.setAttribute('aria-label','Open unit resources menu');
  trigger.append(e('span','psn-nav-menu-icon','☰'),e('span','psn-nav-menu-text','Units & Resources'));
  const title=e('a','psn-nav-title');title.href=links[0].url;
  const logo=e('img');logo.src=new URL('portal/assets/physics-with-sir-najam-official-logo.png',root).href;
  logo.alt='';logo.loading='lazy';
  const brand=e('span',null,'Physics with Sir Najam');title.append(logo,brand);
  const list=e('div','psn-nav-links');
  for(const item of links){
    const a=e('a',null,item.label);a.href=item.url;
    if(item.key==='portal'&&/\/portal\/?$/.test(here))a.setAttribute('aria-current','page');
    if(item.key==='builder'&&here.endsWith('/build-your-physics-test.html'))a.setAttribute('aria-current','page');
    if(item.key==='guide'&&here.endsWith('/student-guide.html'))a.setAttribute('aria-current','page');
    if(item.key==='blueprint'&&here.includes('/assessment-blueprint/'))a.setAttribute('aria-current','page');
    if(item.key==='simulations'&&here.endsWith('/portal/simulations.html'))a.setAttribute('aria-current','page');
    a.addEventListener('click',permitNavigation);
    list.append(a);
  }
  inner.append(trigger,title,list);nav.append(inner);
  document.body.prepend(nav);

  const backdrop=e('div');backdrop.id='psn-nav-backdrop';backdrop.hidden=true;
  backdrop.setAttribute('aria-hidden','true');
  const drawer=e('aside');drawer.id='psn-resource-drawer';drawer.hidden=true;
  drawer.setAttribute('role','dialog');drawer.setAttribute('aria-modal','true');
  drawer.setAttribute('aria-labelledby','psn-drawer-heading');
  const header=e('div','psn-drawer-header');
  const headingWrap=e('div');
  const eyebrow=e('span','psn-drawer-eyebrow','GRADE XI · HSSC-I');
  const heading=e('h2',null,'Unit Resources');heading.id='psn-drawer-heading';
  headingWrap.append(eyebrow,heading);
  const close=e('button','psn-drawer-close','×');close.type='button';
  close.setAttribute('aria-label','Close unit resources menu');
  header.append(headingWrap,close);
  const quick=e('nav','psn-drawer-quick');
  quick.setAttribute('aria-label','Quick physics learning links');
  const quickLinks=[
    link('student-guide.html','Start Here','guide'),
    link('build-your-physics-test.html','Build a Physics Test','builder'),
    link('portal/','Student Dashboard','portal'),
    link('portal/#my-progress','My Private Progress','progress'),
    link('assessment-blueprint/','FBISE Blueprint','blueprint'),
    link('portal/simulations.html','Simulation Library','simulations'),
    {url:'https://sites.google.com/view/physics-with-sir-najam/student-hub/1st-year-hssc',label:'Google Sites Student Hub (external)',key:'external-hub'}
  ];
  const info=e('p','psn-drawer-hint','Select a published unit to expand its study, simulations, practice and revision resources.');
  const content=e('nav','psn-drawer-content');content.setAttribute('aria-label','Grade XI unit-by-unit resources');
  const live=e('p','psn-drawer-loading','Open the menu to browse available resources.');
  live.setAttribute('role','status');live.setAttribute('aria-live','polite');
  const access=e('p','psn-drawer-access',
    'Public links open without sign-in. Enrolled lessons and My Progress require the appropriate account access. These are provisional learning resources, not certified FBISE examinations.');
  drawer.append(header,quick,info,live,content,access);
  document.body.append(backdrop,drawer);
  let opened=false,loaded=false,loading=false,previousFocus=null,previousOverflow='';
  const isCurrent=(url)=>{try{return new URL(url).pathname===here;}catch{return false;}};
  const setCurrent=(a)=>{
    if(isCurrent(a.href))a.setAttribute('aria-current','page');
    a.addEventListener('click',event=>{
      if(permitNavigation(event))closeDrawer(false);
    });
    return a;
  };
  function addQuickLinks(){
    for(const item of quickLinks){
      const a=e('a',null,item.label);a.href=item.url;
      if(new URL(a.href).origin!==root.origin){a.target='_blank';a.rel='noopener noreferrer';}
      quick.append(setCurrent(a));
    }
  }
  addQuickLinks();
  function closeDrawer(restore=true){
    if(!opened)return;
    opened=false;drawer.hidden=true;backdrop.hidden=true;
    document.body.classList.remove('psn-resource-menu-open');
    document.body.style.overflow=previousOverflow;
    trigger.setAttribute('aria-expanded','false');
    trigger.setAttribute('aria-label','Open unit resources menu');
    if(restore && previousFocus?.isConnected)previousFocus.focus();
  }
  function openDrawer(){
    if(opened)return;
    previousFocus=document.activeElement;
    previousOverflow=document.body.style.overflow;
    opened=true;drawer.hidden=false;backdrop.hidden=false;
    document.body.classList.add('psn-resource-menu-open');
    document.body.style.overflow='hidden';
    trigger.setAttribute('aria-expanded','true');
    trigger.setAttribute('aria-label','Close unit resources menu');
    close.focus();
    if(!loaded&&!loading)loadResources();
  }
  trigger.addEventListener('click',()=>opened?closeDrawer():openDrawer());
  close.addEventListener('click',()=>closeDrawer());
  backdrop.addEventListener('click',()=>closeDrawer());
  document.addEventListener('keydown',event=>{
    if(!opened)return;
    if(event.key==='Escape'){event.preventDefault();closeDrawer();return;}
    if(event.key!=='Tab')return;
    const focusable=[...drawer.querySelectorAll('button, a[href], summary, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter(el=>!el.hasAttribute('disabled')&&el.getClientRects().length>0);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  function makeLink(href,label,accessCode){
    const a=e('a','psn-drawer-resource-link');
    a.href=href;
    const text=e('span',null,label);a.append(text);
    if(accessCode==='enrolled-protected'||accessCode==='account-private'){
      a.append(e('small',null,accessCode==='account-private'?'Private account':'Enrollment required'));
    }
    if(new URL(href).origin!==root.origin){
      a.target='_blank';a.rel='noopener noreferrer';
    }
    return setCurrent(a);
  }
  function renderUnit(unit,byId,portalBase){
    const panel=e('details','psn-drawer-unit');
    panel.dataset.psnUnit=String(unit.unit);
    const summary=e('summary','psn-drawer-unit-summary');
    const name=e('strong',null,'Unit '+unit.unit+' — '+unit.title);
    const indicator=e('span',null,'Expand');indicator.className='psn-drawer-chevron';
    summary.append(name,indicator);panel.append(summary);
    const body=e('div','psn-drawer-unit-body');
    const deskUrl=safeHref(unit.landingHref,portalBase);
    if(deskUrl)body.append(makeLink(deskUrl,'Open Unit '+unit.unit+' Learning Desk','public-link'));
    const practiceUrl=safeHref('../build-your-physics-test.html?unit='+unit.unit,portalBase);
    if(practiceUrl)body.append(makeLink(practiceUrl,'Practise Unit '+unit.unit+' MCQs','public-link'));
    const categories=new Map();
    const seen=new Set();
    for(const id of unit.resourceIds||[]){
      if(seen.has(id))continue;seen.add(id);
      const record=byId.get(id);
      if(!record)continue;
      const href=safeHref(record.href,portalBase);
      if(!href)continue;
      const category=record.category||'OTHER RESOURCES';
      if(!categories.has(category))categories.set(category,[]);
      categories.get(category).push({href,record});
    }
    const names={
      'STUDY':'Study & Worked Answers','EXPLORE':'Explore',
      'SIMULATIONS':'Simulations & Labs','PRACTISE':'MCQ & Practice',
      'EXAM PREPARATION':'Exam Preparation','REVISION':'Revision',
      'REVIEW':'My Progress','REGISTERED LEARNERS':'Enrolled Lessons'
    };
    for(const [cat,items] of categories){
      const group=e('details','psn-drawer-category');
      group.dataset.psnCategory=cat;
      const summary=e('summary',null,(names[cat]||cat)+' ('+items.length+')');
      const linksBox=e('div','psn-drawer-category-links');
      for(const item of items){
        linksBox.append(makeLink(item.href,item.record.title,item.record.access));
      }
      group.append(summary,linksBox);body.append(group);
    }
    panel.append(body);
    const activeUnit=here.match(/\/unit-0([1-5])(?:[.-]|\/)/);
    panel.open=Boolean(activeUnit&&Number(activeUnit[1])===unit.unit);
    if(panel.open){
      const active=[...body.querySelectorAll('.psn-drawer-category')];
      for(const group of active){
        if([...group.querySelectorAll('a')].some(a=>isCurrent(a.href)))group.open=true;
      }
    }
    return panel;
  }
  async function loadResources(){
    loading=true;live.textContent='Loading the five published Grade XI unit menus…';
    try{
      const url=new URL('portal/learning-catalog.json',root);
      const response=await fetch(url,{cache:'no-store'});
      if(!response.ok)throw Error('Resource catalogue unavailable (HTTP '+response.status+')');
      const catalog=await response.json();
      const grade=catalog.grades?.find(g=>g.grade===11);
      if(!grade||!Array.isArray(grade.units)||!Array.isArray(catalog.resources))throw Error('Invalid learning catalogue');
      const active=grade.units.filter(u=>u.status==='available'&&
        Number.isInteger(u.unit)&&u.unit>=1&&u.unit<=14&&Array.isArray(u.resourceIds));
      const map=new Map(catalog.resources.filter(r=>typeof r.id==='string').map(r=>[r.id,r]));
      const portalBase=new URL('portal/',root);
      const fragment=document.createDocumentFragment();
      for(const unit of active)fragment.append(renderUnit(unit,map,portalBase));
      content.replaceChildren(fragment);
      live.textContent=active.length+' published unit menus available. Other units are still being developed.';
      loaded=true;
    }catch(error){
      // Five verified first milestone desks remain reachable if the public JSON fails.
      const fallback=e('div','psn-drawer-fallback');
      fallback.append(e('p',null,'Resource categories are temporarily unavailable. Open a published Unit Learning Desk instead.'));
      const names=['Physical Quantities and Measurements','Vectors','Translatory Motion',
        'Rotational and Circular Motion','Work and Energy'];
      names.forEach((name,index)=>fallback.append(makeLink(
        new URL('portal/unit-0'+(index+1)+'.html',root).href,
        'Unit '+(index+1)+' — '+name,'public-link'
      )));
      content.replaceChildren(fallback);
      live.textContent='Unable to load the full resource list. Learning Desk links are still available.';
      loaded=false;
    }finally{loading=false;}
  }
})();
