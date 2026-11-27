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
  // V140: unit awareness from explicit unit filters, then physical learning pages.
  // Do not guess a unit for mixed-unit tests or unfiltered libraries.
  function activeUnitNumber(){
    const chosen=new URLSearchParams(location.search).get('unit');
    if(/^(?:[1-9]|1[0-4])$/.test(chosen||''))return Number(chosen);
    const match=here.match(/\/unit-0?([1-9]|1[0-4])(?=[.\/-])/);
    return match?Number(match[1]):null;
  }
  const activeUnit=activeUnitNumber();
  const e=(tag,className,text)=>{
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=text;
    return node;
  };
  /* V102: Extend the established V70 browser print watermark to the public
   * study/numerical/question pages that already use this global navigation.
   * The brand remains the owner-approved repeated diagonal text; third-party
   * linked PDFs and machine-readable data are deliberately untouched.
   * No Firebase, question bank, report-submission or answer-data interaction. */
  function attachPrintWatermark(){
    // V70 already brands MCQ practice/Progress reports. Never double-stamp.
    if(document.querySelector('.psn-print-watermark'))return;
    if(!document.querySelector('link[href*="print-watermark-v70.css"]')){
      const sheet=document.createElement('link');
      sheet.rel='stylesheet';
      sheet.href=new URL('shared/print-watermark-v70.css?v=102',root).href;
      sheet.dataset.psnPrintWatermark='v102';
      document.head.appendChild(sheet);
    }
    const mark=e('div','psn-print-watermark');
    mark.setAttribute('aria-hidden','true');
    mark.style.display='none'; // avoid a brief on-screen flash before CSS loads
    for(let i=0;i<8;i++)mark.append(e('span',null,'Physics with Sir Najam'));
    document.body.appendChild(mark);
  }
  attachPrintWatermark();
  /* V112: every page with existing shared navigation also uses native
   * superscript math presentation. Pages without navigation load V112 directly.
   * The V112 loader recognizes an existing watermark and never duplicates it. */
  if(!document.querySelector('script[data-psn-science-print-loader="v112"]')){
    const scienceScript=document.createElement('script');
    scienceScript.src=new URL('shared/sitewide-science-print-v112.js?v=112',root).href;
    scienceScript.dataset.psnSciencePrintLoader='v112';
    document.head.appendChild(scienceScript);
  }

  const safeHref=(raw,base)=>{
    if(typeof raw!=='string'||!raw.trim())return null;
    try{
      const url=new URL(raw,base);
      const sameOrigin=url.origin===root.origin && url.pathname.startsWith(root.pathname);
      // Student navigation is same-site only; historical sources are archived separately.
      return (url.protocol==='https:'||url.protocol==='http:')&&sameOrigin ? url.href : null;
    }catch{return null;}
  };
  const link=(target,label,key)=>({url:new URL(target,root).href,label,key});
  const links=[
    link('portal/','Dashboard','portal'),
    link('portal/#my-progress','My Progress','progress'),
    link('build-your-physics-test.html','Build a Test','builder'),
    link('portal/exam-quick-access.html','Exam Quick Access','revision'),
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
    if(item.key==='revision'&&here.endsWith('/portal/exam-quick-access.html'))a.setAttribute('aria-current','page');
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
    link('portal/exam-quick-access.html','Exam Quick Access','revision'),
    link('student-guide.html','Start Here','guide'),
    link('build-your-physics-test.html','Build a Physics Test','builder'),
    link('portal/','Student Dashboard','portal'),
    link('portal/#my-progress','My Private Progress','progress'),
    link('assessment-blueprint/','FBISE Blueprint','blueprint'),
    link('portal/simulations.html','Simulation Library','simulations'),
    link('portal/legacy-hssc-resources.html','Notes & Concept Videos','videos')
  ];
  const info=e('p','psn-drawer-hint','Choose a unit to explore study, simulations and practice. Unit 6 is a provisional practice preview, not an approved full course.');
  const content=e('nav','psn-drawer-content');content.setAttribute('aria-label','Grade XI unit-by-unit resources');
  const live=e('p','psn-drawer-loading','Open the menu to browse available resources.');
  live.setAttribute('role','status');live.setAttribute('aria-live','polite');
  const access=e('p','psn-drawer-access',
    'Public links open without sign-in. Enrolled lessons and My Progress require the appropriate account access. These are provisional learning resources, not certified FBISE examinations.');
  drawer.append(header,quick,info,live,content,access);
  document.body.append(backdrop,drawer);
  let opened=false,loaded=false,loading=false,previousFocus=null,previousOverflow='';
  const isCurrent=(url)=>{
    try{
      const target=new URL(url),page=new URL(location.href);
      if(target.pathname!==page.pathname)return false;
      if(target.searchParams.has('unit') &&
        target.searchParams.get('unit')!==page.searchParams.get('unit'))return false;
      if(target.hash && target.hash!==page.hash)return false;
      return true;
    }catch{return false;}
  };
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
  // Close any open drawer immediately when a portal session returns to sign-in.
  // This resets body scrolling even when CSS hides the navigation shell.
  document.addEventListener('psn-portal-shell-closed',()=>closeDrawer(false));
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
    else if(loaded)syncActiveUnit();
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
  // V140: five permanent stages; resource classification is based only on
  // public catalogue metadata, never user identity, SLO certification or marks.
  const stageDefs=[
    {key:'LEARN',label:'01 · Learn',empty:'Notes, official lessons and formulas will appear here as they are verified.'},
    {key:'EXPLORE',label:'02 · Explore',empty:'No unit-specific interactive activity is mapped yet.'},
    {key:'PRACTISE',label:'03 · Practise',empty:'No extra worked examples or self-practice links have been mapped yet.'},
    {key:'PREPARE',label:'04 · Prepare',empty:'Additional exercises and assignments will appear when verified.'},
    {key:'TRACK',label:'05 · Track',empty:'Personal progress and classroom assignments require the appropriate account access.'}
  ];
  function learningStage(record){
    const cat=String(record.category||'').toUpperCase();
    const id=String(record.id||'').toLowerCase();
    const title=String(record.title||'').toLowerCase();
    const label=id+' '+title;
    if(record.access==='account-private'||record.access==='enrolled-protected' ||
      cat==='REVIEW'||cat==='REGISTERED LEARNERS')return ['TRACK','Progress & enrolled lessons'];
    if(cat==='VIDEOS')return ['LEARN',
      record.videoPriority==='official-psn'?'Physics with Sir Najam videos':'Additional videos & source references'];
    if(cat==='SIMULATIONS'||cat==='EXPLORE'||/\b(lab|interactive|explorer|simulation)\b/.test(label))
      return ['EXPLORE','Simulations & learning activities'];
    if(/formula\s+sheet/.test(label)||cat==='REVISION')
      return ['LEARN','Formula sheets & revision notes'];
    if(/worked\s+numerical|numericals|worked\s+example/.test(label))
      return ['PRACTISE','Examples & numerical problems'];
    if(/descriptive|comprehensive|short\s+response|extended|assessment\s+pack|projector|discussion\s+slide|worked\s+key|marking\s+scheme|\bexam\b|blueprint|slo.*audit/.test(label)
      ||cat==='EXAM PREPARATION')
      return ['PREPARE','Exam questions, exercises & assignments'];
    if(cat==='PRACTISE'||/mcq|practice|test\b/.test(label))
      return ['PRACTISE','MCQs & independent practice'];
    return ['LEARN','SLO notes & concept study'];
  }
  function renderUnit(unit,byId,portalBase){
    const panel=e('details','psn-drawer-unit');
    panel.dataset.psnUnit=String(unit.unit);
    const summary=e('summary','psn-drawer-unit-summary');
    const preview=unit.practicePreviewStatus==='public-provisional';
    const name=e('strong',null,'Unit '+unit.unit+' — '+unit.title+(preview?' · Practice preview':''));
    const indicator=e('span','psn-drawer-chevron','Expand');
    summary.append(name,indicator);panel.append(summary);
    const body=e('div','psn-drawer-unit-body');
    if(preview)body.append(e('p','psn-drawer-unit-notice',
      'Provisional self-practice only · Unit 6 individual teacher signoffs and formal graded assessment remain pending.'));
    const groups=new Map(stageDefs.map(s=>[s.key,[]]));
    const seenIds=new Set(),seenHref=new Set();
    function add(record){
      if(!record?.id||seenIds.has(record.id)||record.id==='protected-lesson')return;
      const href=safeHref(record.href,portalBase);
      if(!href||seenHref.has(href))return;
      seenIds.add(record.id);seenHref.add(href);
      const [stage,subgroup]=learningStage(record);
      groups.get(stage).push({href,record,subgroup});
    }
    // Always keep the original, source-grounded landing desk and unit-filtered
    // test link; dedupe any matching public catalogue entries.
    if(unit.landingHref)add({id:'v140-desk-'+unit.unit,
      title:'Unit '+unit.unit+' · Learning Desk / Overview',
      category:'STUDY',href:unit.landingHref,access:'public-link'});
    add({id:'v140-practise-'+unit.unit,title:'Unit '+unit.unit+' · Build an MCQ Practice Test',
      category:'PRACTISE',href:'../build-your-physics-test.html?unit='+unit.unit,access:'public-link'});
    const records=[...(unit.resourceIds||[]).map(id=>byId.get(id)),
      ...(preview&&Array.isArray(unit.previewResources)?unit.previewResources:[])];
    records.forEach(add);
    /* V208 — source-verified Unit 1 finder shortcuts. These links only point
     * to already published, independently indexed *adapted/original practice*.
     * Do not relabel them as a complete verbatim NBF end-of-unit exercise.
     * Keep the frozen source catalogue, MCQs and per-question answers intact. */
    if(unit.unit===1){
      [
        {id:'v208-u01-numerical-finder',category:'PRACTISE',
         title:'Unit 1 · Find 10 adapted numerical examples / problems',
         href:'./textbook-resource-finder.html?unit=1',access:'public-link'},
        {id:'v208-u01-short-response-finder',category:'EXAM PREPARATION',
         title:'Unit 1 · Find 10 adapted/original short responses',
         href:'./descriptive-answer-finder.html?unit=1&type=short-response',access:'public-link'},
        {id:'v208-u01-comprehensive-response-finder',category:'EXAM PREPARATION',
         title:'Unit 1 · Find 4 adapted comprehensive / extended responses',
         href:'./descriptive-answer-finder.html?unit=1&type=comprehensive-response',access:'public-link'}
      ].forEach(add);
    }
    // The existing catalogue already stores a source directory for each unit's
    // public historic concept videos. Reuse it instead of duplicating entries
    // and disturbing frozen resource-count contracts.
    if(unit.legacyVideoPageCount>0 && unit.originalReferenceHref)
      add({id:'v140-supplementary-videos-'+unit.unit,
        title:'Unit '+unit.unit+' · Additional Existing Concept Videos & Original References',
        category:'VIDEOS',videoPriority:'supplementary-existing',
        href:unit.originalReferenceHref,access:'public-link'});
    // These verified same-site library routes are navigable from the unit menu,
    // but are never represented as original source videos or graded assignments.
    if(unit.simulationCount>0 && unit.simulationHref)
      add({id:'v140-simulations-'+unit.unit,category:'SIMULATIONS',
        title:'Unit '+unit.unit+' · Existing Simulations',
        href:unit.simulationHref,access:'public-link'});
    for(const stage of stageDefs){
      const items=groups.get(stage.key);
      const group=e('details','psn-drawer-stage');
      group.dataset.psnStage=stage.key;
      const stageSummary=e('summary','psn-drawer-stage-summary',
        stage.label+' ('+items.length+')');
      group.append(stageSummary);
      const linksBox=e('div','psn-drawer-stage-links');
      if(!items.length)linksBox.append(e('p','psn-drawer-stage-empty',stage.empty));
      let lastSubgroup='';
      for(const item of items){
        if(item.subgroup!==lastSubgroup){
          const sub=e('p','psn-drawer-topic-label',item.subgroup);
          linksBox.append(sub);lastSubgroup=item.subgroup;
        }
        linksBox.append(makeLink(item.href,item.record.title,item.record.access));
      }
      if(unit.unit===1 && stage.key==='PREPARE'){
        const status=e('p','psn-drawer-stage-empty',
          'Textbook end-of-unit MCQs, short/extended questions, numbered numerical exercises, and assignments are not yet separately verified and indexed here. The links above lead to adapted or original practice, not a full NBF exercise reproduction.');
        status.dataset.psnSourceStatus='unit1-original-end-exercises-pending';
        linksBox.append(status);
      }
      if(stage.key==='LEARN' && !items.some(item=>item.record.videoPriority==='official-psn')){
        linksBox.append(e('p','psn-drawer-video-upcoming',
          'Physics with Sir Najam original video lessons · coming after upload and review. Existing videos are supplementary.'));
      }
      group.append(linksBox);body.append(group);
      if(unit.unit===activeUnit && items.some(item=>isCurrent(item.href)))group.open=true;
    }
    panel.append(body);
    panel.open=unit.unit===activeUnit;
    if(panel.open && !body.querySelector('.psn-drawer-stage[open]')){
      const first=body.querySelector('.psn-drawer-stage');
      if(first)first.open=true;
    }
    return panel;
  }
  function comingSoon(units,label){
    const group=e('details','psn-drawer-future');
    group.dataset.psnFutureUnits=units.map(unit=>unit.unit).join(',');
    const summary=e('summary',null,label+' ('+units.length+')');
    group.append(summary);
    const rows=e('div','psn-drawer-future-rows');
    for(const unit of units){
      const item=e('p',null,'Unit '+unit.unit+' · '+unit.title+' · Coming soon');
      rows.append(item);
      // V145: a separately verified introductory topic may be offered while
      // the rest of this NBF unit, original MCQ bank and graded exam remain
      // explicitly planned. Never expose a non-source-backed route.
      const introduction=unit.learningPreviewStatus==='public-topic-7.1-introduction-only'
        ?safeHref(unit.learningPreviewHref,new URL('portal/',root)):null;
      if(unit.unit===7&&introduction){
        rows.append(e('p','psn-drawer-unit-notice',
          'Three public unscored learning lessons · Teacher review in progress. Original textbook exercises and Unit 7 scored MCQs are not published.'));
        rows.append(makeLink(introduction,
          'Unit 7 · Topic 7.1 Learning Introduction · Unscored study',
          'public-link'));
        // V209: only explicitly enumerated existing source-based public
        // lessons; the legacy V145 introduction sentinel remains unchanged
        // so an unapproved MCQ bank is never activated by adding routes.
        for(const lesson of unit.additionalLearningPreviews||[]){
          if(!['7.2','7.3'].includes(lesson.topic) ||
            lesson.access!=='public-unscored-study-teacher-review')continue;
          const href=safeHref(lesson.href,new URL('portal/',root));
          if(!href)continue;
          rows.append(makeLink(href,'Unit 7 · Topic '+lesson.topic+' '+lesson.title+
            ' · Unscored study · Academic review pending','public-link'));
        }
      }
      // Existing enrichment simulations for future units may already be public.
      // This link does NOT publish the unit, its notes, MCQ bank or exams.
      const sim=safeHref(unit.simulationHref,new URL('portal/',root));
      if(unit.simulationCount>0 && sim){
        rows.append(makeLink(sim,'Explore '+unit.simulationCount+
          ' existing simulation'+(unit.simulationCount===1?'':'s')+' · Unit still planned','public-link'));
      }
    }
    group.append(rows);
    return group;
  }
  // Simulation-unit filters can change location.search with replaceState().
  // Re-read the current URL every time the drawer opens, not only on first load.
  function syncActiveUnit(){
    const selected=activeUnitNumber();
    for(const unit of content.querySelectorAll('.psn-drawer-unit')){
      const match=Number(unit.dataset.psnUnit)===selected;
      unit.open=match;
      if(!match)continue;
      let chosen=false;
      for(const stage of unit.querySelectorAll('.psn-drawer-stage')){
        const current=[...stage.querySelectorAll('a[href]')].some(a=>isCurrent(a.href));
        stage.open=current;
        if(current)chosen=true;
      }
      if(!chosen){
        const first=unit.querySelector('.psn-drawer-stage');
        if(first)first.open=true;
      }
    }
    for(const future of content.querySelectorAll('.psn-drawer-future[data-psn-future-units]')){
      future.open=future.dataset.psnFutureUnits.split(',').map(Number).includes(selected);
    }
    for(const link of content.querySelectorAll('a[href]')){
      if(isCurrent(link.href))link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    }
  }
  async function loadResources(){
    loading=true;live.textContent='Loading available Grade XI unit resources and provisional practice previews…';
    try{
      const url=new URL('portal/learning-catalog.json',root);
      const response=await fetch(url,{cache:'no-store'});
      if(!response.ok)throw Error('Resource catalogue unavailable (HTTP '+response.status+')');
      const catalog=await response.json();
      const grade=catalog.grades?.find(g=>g.grade===11);
      if(!grade||!Array.isArray(grade.units)||!Array.isArray(catalog.resources))throw Error('Invalid learning catalogue');
      const active=grade.units.filter(u=>(u.status==='available'||u.practicePreviewStatus==='public-provisional')&&
        Number.isInteger(u.unit)&&u.unit>=1&&u.unit<=14&&Array.isArray(u.resourceIds));
      const map=new Map(catalog.resources.filter(r=>typeof r.id==='string').map(r=>[r.id,r]));
      const portalBase=new URL('portal/',root);
      const fragment=document.createDocumentFragment();
      for(const unit of active)fragment.append(renderUnit(unit,map,portalBase));
      const coming=grade.units.filter(u=>u.status==='planned' && u.practicePreviewStatus!=='public-provisional' &&
        Number.isInteger(u.unit) && u.unit>=7 && u.unit<=14);
      const next=coming.filter(u=>u.unit<=10),later=coming.filter(u=>u.unit>=11);
      if(next.length)fragment.append(comingSoon(next,'Next units · 7–10'));
      if(later.length)fragment.append(comingSoon(later,'Future units · 11–14'));
      content.replaceChildren(fragment);
      syncActiveUnit();
      live.textContent=active.length+' available or provisional Grade XI unit menus, in five learning stages. Planned units are labelled Coming soon; Unit 6 remains a provisional preview.';
      loaded=true;
    }catch(error){
      // Five original published desks plus the Unit 6 public study preview remain reachable if catalogue fetch fails.
      const fallback=e('div','psn-drawer-fallback');
      fallback.append(e('p',null,'Resource categories are temporarily unavailable. Open a published Unit Learning Desk instead.'));
      const names=['Physical Quantities and Measurements','Vectors','Translatory Motion',
        'Rotational and Circular Motion','Work and Energy','Fluid Mechanics (practice preview)'];
      names.forEach((name,index)=>fallback.append(makeLink(
        new URL(index===5?'portal/unit-06-learning-desk-v95a.html':'portal/unit-0'+(index+1)+'.html',root).href,
        'Unit '+(index+1)+' — '+name,'public-link'
      )));
      content.replaceChildren(fallback);
      live.textContent='Unable to load the full resource list. Learning Desk links are still available.';
      loaded=false;
    }finally{loading=false;}
  }
})();
