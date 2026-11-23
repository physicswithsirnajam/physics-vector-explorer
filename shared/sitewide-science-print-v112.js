/* V112: Public-site scientific exponent display and universal owned HTML print/PDF watermark.
 * Presentation only: preserve ORIGINAL textContent and all authored question-bank bytes,
 * answer letters, solutions, arithmetic and item-level FBISE release flags.
 * Use an allowlisted unit/exponent grammar, never blind number replacement.
 * External/third-party PDF assets cannot be modified by browser print styles.
 */
(() => {
  'use strict';
  const bootScript=document.currentScript;
  if(!bootScript || window.PSNSciencePrintV112)return;
  const root=new URL('../',bootScript.src);
  const unitPattern=/(?<![\p{L}\p{N}_])(?:(?<unit>kg|cm|mm|km|µm|μm|nm|mol|rad|Pa|Hz|m|s|g|N|J|W|K|A|V|C|L)(?<power>\^\{?-?[123]\}?|-[123]|[23])|(?<variable>10|[xyzvrautFPE])(?<explicit>\^\{?-?\d{1,3}\}?))(?=$|[^\p{L}\p{N}_])/gu;
  const skipSelector=[
    'script','style','noscript','template','textarea','code','pre','svg','math',
    '.katex','.MathJax','.psn-print-watermark','.psn-scientific-token',
    '.psn-scientific-source-notation','.psn-vector-symbol','.psn-vector-source-mark',
    '[contenteditable]','[data-psn-no-unit-format]'
  ].join(',');
  let decoratedPowerTokens=0;
  let observer;
  function appendStyle(href,stamp){
    if(document.querySelector('link[data-psn-science-print="'+stamp+'"]'))return;
    const link=document.createElement('link');link.rel='stylesheet';
    link.href=new URL(href,root).href;
    link.dataset.psnSciencePrint=stamp;
    document.head.appendChild(link);
  }
  function ensurePrintWatermark(){
    // Existing V70/V102 printable reports and global navigation already add one.
    if(!document.querySelector('link[href*="print-watermark-v70.css"]'))
      appendStyle('shared/print-watermark-v70.css?v=112','watermark');
    if(document.querySelector('.psn-print-watermark'))return;
    const mark=document.createElement('div');
    mark.className='psn-print-watermark';
    mark.setAttribute('aria-hidden','true');
    mark.style.display='none'; // print stylesheet overrides this with !important
    for(let i=0;i<8;i++){
      const line=document.createElement('span');
      line.textContent='Physics with Sir Najam';
      mark.appendChild(line);
    }
    document.body.appendChild(mark);
  }
  function eligible(node){
    return node?.nodeType===Node.TEXT_NODE &&
      node.parentElement && !node.parentElement.closest(skipSelector);
  }
  function hiddenSource(value){
    const n=document.createElement('span');
    n.className='psn-scientific-source-notation';
    n.setAttribute('aria-hidden','true');
    n.textContent=value;
    return n;
  }
  function formatTextNode(node){
    if(!eligible(node))return;
    const original=node.data;
    if(!original||original.length>20000)return; // skip unusually large blocks, avoid UI hangs
    unitPattern.lastIndex=0;
    let found,at=0,changes=0;
    const fragment=document.createDocumentFragment();
    while((found=unitPattern.exec(original))!==null){
      if(found.index>at)fragment.appendChild(document.createTextNode(original.slice(at,found.index)));
      const base=found.groups.unit||found.groups.variable;
      const raw=found.groups.power||found.groups.explicit;
      const n=raw.match(/-?\d+/);
      if(!base||!n){fragment.appendChild(document.createTextNode(found[0]));at=found.index+found[0].length;continue;}
      const power=n[0],powerStart=raw.indexOf(power);
      const wrap=document.createElement('span');
      wrap.className='psn-scientific-token';
      wrap.appendChild(document.createTextNode(base));
      if(powerStart)wrap.appendChild(hiddenSource(raw.slice(0,powerStart)));
      const sup=document.createElement('sup');
      sup.textContent=power;
      wrap.appendChild(sup);
      if(powerStart+power.length<raw.length)wrap.appendChild(hiddenSource(raw.slice(powerStart+power.length)));
      // This must remain bit-for-bit equal in DOM textContent, including caret/braces.
      if(wrap.textContent!==found[0])throw Error('Scientific notation source text mismatch');
      fragment.appendChild(wrap);
      at=found.index+found[0].length;
      changes++;
    }
    if(!changes)return;
    if(at<original.length)fragment.appendChild(document.createTextNode(original.slice(at)));
    if(fragment.textContent!==original)throw Error('Scientific notation source sentence changed');
    node.replaceWith(fragment);
    decoratedPowerTokens+=changes;
  }
  function scan(node){
    if(!node)return;
    if(node.nodeType===Node.TEXT_NODE){formatTextNode(node);return}
    if(node.nodeType!==Node.ELEMENT_NODE||node.matches(skipSelector))return;
    const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT),nodes=[];
    while(walker.nextNode())if(eligible(walker.currentNode))nodes.push(walker.currentNode);
    for(const n of nodes)formatTextNode(n);
  }
  function boot(){
    if(!document.body)return;
    appendStyle('shared/sitewide-science-print-v112.css?v=112','notation');
    ensurePrintWatermark();
    scan(document.body);
    observer=new MutationObserver(records=>{
      for(const r of records){
        if(r.type==='childList')for(const n of r.addedNodes)scan(n);
      }
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('beforeprint',ensurePrintWatermark);
    window.PSNSciencePrintV112=Object.freeze({
      get decoratedPowerTokens(){return decoratedPowerTokens;},
      get watermarkCount(){return document.querySelectorAll('.psn-print-watermark').length;},
      rescan(){scan(document.body)}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
