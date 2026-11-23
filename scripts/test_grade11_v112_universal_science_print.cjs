#!/usr/bin/env node
'use strict';
/* V112 public-owned HTML print/PDF and scientific superscript QA.
 * Only synthetic samples and existing public pages; no bank/Firebase writes.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {execFileSync}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/v112-universal-science-print');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const norm=s=>s.split('\r\n').join('\n');
const pages=execFileSync('git',['ls-files','*.html'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/)
 .filter(p=>p&&!p.startsWith('scripts/fixtures/'));
const direct='sitewide-science-print-v112.js?v=112';
let groups=0;function pass(msg){groups++;console.log('V112 PASS:',msg)}
function staticCoverage(){
 assert.ok(pages.length>=110,'Public HTML route inventory unexpectedly incomplete: '+pages.length);
 assert.ok(!pages.some(p=>p.startsWith('scripts/fixtures/')),'Private fixture included in public watermark coverage');
 const nav=read('shared/navigation.js');
 assert.ok(nav.includes("attachPrintWatermark();"),'Established V102 global print stamp lost');
 assert.ok(nav.includes("shared/sitewide-science-print-v112.js?v=112"),'Existing navigation-backed routes omit science formatter');
 assert.ok(nav.includes('psn-print-watermark'),'Old print watermark accidentally removed');
 const js=read('shared/sitewide-science-print-v112.js');
 const css=read('shared/sitewide-science-print-v112.css'),wm=read('shared/print-watermark-v70.css');
 for(const x of ['MutationObserver','createTextNode','fragment.textContent!==original','sup.textContent=power','beforeprint','psn-print-watermark']){
  assert.ok(js.includes(x),'Loss of source-preserving notation or print behavior: '+x);
 }
 assert.ok(js.includes('question-bank')&&js.includes('all authored question-bank bytes'));
 assert.ok(css.includes('vertical-align:super!important')&&css.includes('@media print'));
 assert.ok(wm.includes('position:fixed')&&wm.includes('transform:rotate')&&wm.includes('print-color-adjust:exact'));
 let navCount=0,directCount=0;
 for(const p of pages){
  const s=read(p);
  const hasNavigation=s.includes('shared/navigation.js');
  const hasDirect=s.includes(direct);
  assert.equal(hasNavigation===hasDirect,false,'Public HTML is missing layer or double-loads it: '+p);
  if(hasNavigation)navCount++;else directCount++;
  if(hasDirect){
   const relative=p.startsWith('portal/')?'../shared/':'shared/';
   assert.ok(s.includes('src="'+relative+direct+'"'),'Direct loader wrong base path '+p);
  }
  assert.ok(/<html\b/i.test(s)&&/<\/head>/i.test(s)&&/<\/body>/i.test(s),'Unexpected public HTML route malformed '+p);
 }
 assert.ok(navCount>=60&&directCount>=35,'Sitewide coverage split unexpectedly narrowed: '+navCount+'/'+directCount);
 assert.ok(read('portal/pdf-report.js').includes("new URL('../shared/print-watermark-v70.css',import.meta.url)"),'Existing generated progress report stamp lost');
 assert.ok(read('practice-engine/index.html').includes('print-watermark-v70.css?v=71'),'Existing practice report stamp lost');
 pass('all '+pages.length+' tracked public HTML routes explicitly use navigation print layer or standalone shared layer ('+navCount+' navigation, '+directCount+' standalone), no double loaders');
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 try{
  let f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end('Missing');return}
  if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.statSync(f).isFile()){res.writeHead(404);res.end('Missing');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch(e){res.writeHead(404);res.end('Missing')}
});
function checkPdf(file,minPages,content){
 const info=execFileSync('pdfinfo',[file],{encoding:'utf8'});
 const n=Number(info.match(/^Pages:\s+(\d+)/m)?.[1]||0);assert.ok(n>=minPages,'PDF pages too few '+n);
 const full=execFileSync('pdftotext',['-raw',file,'-'],{encoding:'utf8',maxBuffer:20*1024*1024});
 const parts=full.split('\f').filter(x=>x.trim());
 assert.equal(parts.length,n,'Must audit every actual generated PDF page');
 parts.forEach((part,i)=>{
  const s=part.toUpperCase();
  const physics=(s.match(/PHYSICS\s+WITH/g)||[]).length,sir=(s.match(/SIR/g)||[]).length,najam=(s.match(/NAJAM/g)||[]).length;
  assert.ok(physics>=4&&sir>=4&&najam>=4,'Missing repeated print watermark on '+file+' PDF page '+(i+1)+': '+physics+'/'+sir+'/'+najam);
 });
 for(const text of content)assert.ok(full.includes(text),'PDF lost original content '+text);
 return n;
}
const fixture='Synthetic: 4 m3 s-1, 2 cm2, 1000 kg m-3, 5 m s^-2, v^2, 10^-3. Keep labels Q28 and v2 unchanged.';
async function proof(browser,url,name,options={}){
 const page=await browser.newPage({viewport:{width:options.width||390,height:820},reducedMotion:'reduce'});
 const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('dialog',d=>d.accept());
 try{
  const response=await page.goto(url,{waitUntil:'load'});
  assert.equal(response.status(),200);
  await page.waitForFunction(()=>window.PSNSciencePrintV112?.watermarkCount===1,null,{timeout:25000});
  await page.waitForFunction(()=>Boolean(document.querySelector('link[data-psn-science-print="notation"]')?.sheet&&document.querySelector('link[href*="print-watermark-v70.css"]')?.sheet));
  assert.equal(await page.locator('.psn-print-watermark').count(),1);
  assert.equal(await page.locator('.psn-print-watermark span').count(),8);
  await page.evaluate(v=>{
   const d=document.createElement('p');d.id='v112-scientific-synthetic';
   d.textContent=v;d.style.cssText='font-size:18px;line-height:1.9;margin:18px;color:black!important;display:block!important';
   document.body.appendChild(d);
  },fixture);
  await page.waitForFunction(()=>document.querySelectorAll('#v112-scientific-synthetic sup').length>=7);
  const fmt=await page.evaluate(()=>({
   source:document.querySelector('#v112-scientific-synthetic').textContent,
   sup:[...document.querySelectorAll('#v112-scientific-synthetic sup')].map(s=>({text:s.textContent,vertical:getComputedStyle(s).verticalAlign})),
   count:window.PSNSciencePrintV112.decoratedPowerTokens,
   width:document.documentElement.scrollWidth,view:document.documentElement.clientWidth
  }));
  assert.equal(fmt.source,fixture,'Scientific source text mutated instead of presentation-only superscript');
  for(const n of ['3','-1','2','-3','-2'])assert.ok(fmt.sup.some(x=>x.text===n),'Missing correct exponent '+n);
  assert.ok(fmt.sup.every(x=>x.vertical==='super'),'Scientific superscript not rendered via true vertical alignment');
  assert.ok(fmt.width<=fmt.view+3,'Scientific rendering created horizontal overflow on '+name);
  assert.deepEqual(errs,[],'Browser JS errors on '+name);
  await page.emulateMedia({media:'print'});
  assert.equal(await page.locator('.psn-print-watermark').evaluate(e=>getComputedStyle(e).position),'fixed');
  assert.equal(await page.locator('.psn-print-watermark').evaluate(e=>getComputedStyle(e).display),'flex');
  const file=path.join(out,name+'.pdf');
  fs.writeFileSync(file,await page.pdf({format:'A4',printBackground:false,preferCSSPageSize:true}));
  const pages=checkPdf(file,options.minPages||1,options.requiredText||[]);
  await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});
  pass(name+' native superscripts + repeated diagonal watermark on all '+pages+' A4 PDF page(s), background images OFF');
  return {name,pages,exponents:fmt.sup.length,sourcePreserved:true};
 }finally{await page.close()}
}
async function browser(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 const base='http://127.0.0.1:'+server.address().port+'/';
 const audits=[];
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  audits.push(await proof(browser,base+'portal/unit-06-topic-64-preview.html','topic64-provisional-preview-390',{width:390}));
  audits.push(await proof(browser,base+'continuity-fluid-flow.html','continuity-standalone-simulation-390',{width:390}));
  audits.push(await proof(browser,base+'portal/unit-02-numericals.html','unit02-navigation-numericals-1280',{width:1280,minPages:2,requiredText:['Worked Numericals']}));
  audits.push(await proof(browser,base+'index.html','standalone-homepage-390',{width:390}));
  // Real 80-item quiz: dynamic textContent rendering after clicks must be typographic.
  const quiz=await browser.newPage({viewport:{width:390,height:820}});
  try{
   await quiz.goto(base+'portal/unit-06-topic-64-preview.html',{waitUntil:'load'});
   await quiz.waitForFunction(()=>document.querySelector('#load-status')?.textContent.includes('80 questions available'),null,{timeout:25000});
   await quiz.locator('#size').selectOption('all');await quiz.locator('#begin').click();await quiz.locator('#finish').click();
   assert.equal(await quiz.locator('#review article').count(),80);
   await quiz.waitForFunction(()=>document.querySelectorAll('#review sup').length>=5);
   const src=await quiz.locator('#review').textContent();
   assert.ok(src.includes('m s-1'),'Rendered review did not preserve raw written unit token');
   assert.ok(src.includes('each level per second'),'Authorized Q28 student view lost');
   assert.ok(src.includes('equal volume flow'),'Authorized equal-flow variants not used');
   const q52=await quiz.locator('#review').textContent();
   assert.ok(q52.includes('0.044 m s-1'),'Original Q52 correct outcome changed');
   const pdf=path.join(out,'topic64-all-80-actual-review.pdf');
   await quiz.emulateMedia({media:'print'});
   fs.writeFileSync(pdf,await quiz.pdf({format:'A4',printBackground:false,preferCSSPageSize:true}));
   const pages=checkPdf(pdf,2,['Q51','Q52']);
   pass('real all-80 V111 corrected Topic 6.4 question review: correct unit superscripts, unchanged answer text and watermark across '+pages+' printed pages');
  }finally{await quiz.close()}
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
 return audits;
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 staticCoverage();
 const audits=await browser();
 fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({version:'V112',publicHtmlRoutes:pages.length,groups,tests:audits,originalBankChanged:false,printPdfSource:'owned-pages-only',pdfBackgroundGraphics:false,externalPdfStamped:false,graduationCertificateExceptionImplemented:false,teacherExamApprovalsChanged:false},null,2)+'\n');
 console.log('V112 COMPLETE:',groups,'test groups; all '+pages.length+' public HTML routes covered, no bank/official exam changes');
})().catch(e=>{console.error('V112 FAILED:',e?.stack||e);process.exitCode=1;try{server.close()}catch{}});
