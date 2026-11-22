#!/usr/bin/env node
'use strict';
/* V102: verify the existing V70 eight-line print watermark on newly included
 * study / numerical print pages, testing REAL multi-page browser PDFs with
 * printBackground: false (normal browser print background-graphics OFF).
 * Only public source data / synthetic content; no Firebase accounts or writes.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/print-watermark-v102');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const u=new URL(req.url,'http://localhost');
  let f=path.resolve(root,'.'+decodeURIComponent(u.pathname));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end('Not Found');return}
  if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.statSync(f).isFile()){res.writeHead(404);res.end('Not Found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch{res.writeHead(404);res.end('Not Found')}
});
let count=0;
function pass(label){console.log('V102 PASS:',label);count++}
function pdfCheck(file,minPages,requiredText){
 const info=execFileSync('pdfinfo',[file],{encoding:'utf8'});
 const n=Number(info.match(/^Pages:\s+(\d+)/m)?.[1]||0);
 assert.ok(n>=minPages,file+' has '+n+' pages, expected >= '+minPages);
 const extracted=execFileSync('pdftotext',['-raw',file,'-'],{encoding:'utf8',maxBuffer:12*1024*1024});
 const pages=extracted.split('\f').filter(s=>s.trim());
 assert.equal(pages.length,n,file+' extracted page count mismatch');
 for(let i=0;i<pages.length;i++){
  const text=pages[i].toUpperCase();
  const found=(text.match(/PHYSICS\s+WITH/g)||[]).length;
  const sir=(text.match(/SIR/g)||[]).length;
  const najam=(text.match(/NAJAM/g)||[]).length;
  assert.ok(found>=4&&sir>=4&&najam>=4,
   file+' page '+(i+1)+' watermark repetitions missing: physics='+found+' sir='+sir+' najam='+najam);
 }
 for(const text of requiredText)assert.ok(extracted.includes(text),
  file+' lost expected original document content: '+text);
 return n;
}
async function pageProof(browser,url,label,options={}){
 const page=await browser.newPage({viewport:{width:1140,height:850}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  let response=await page.goto(url,{waitUntil:'domcontentloaded'});
  assert.equal(response.status(),200,'cannot load '+label);
  await page.locator('#psn-global-nav').waitFor();
  await page.locator('.psn-print-watermark').waitFor({state:'attached'});
  await page.waitForFunction(()=>{
   const link=document.querySelector('link[data-psn-print-watermark="v102"]');
   return Boolean(link&&link.sheet);
  });
  assert.equal(await page.locator('.psn-print-watermark').count(),1);
  assert.equal(await page.locator('.psn-print-watermark span').count(),8);
  assert.equal(await page.locator('.psn-print-watermark').getAttribute('aria-hidden'),'true');
  assert.equal(await page.locator('.psn-print-watermark').evaluate(x=>getComputedStyle(x).display),'none');
  if(options.dataReady)await page.waitForFunction(options.dataReady,{timeout:30000});
  if(options.selectPrint){
   await page.evaluate(()=>{window.__printClicks=0;window.print=()=>{window.__printClicks++}});
   await page.locator(options.selectPrint).click();
   assert.equal(await page.evaluate(()=>window.__printClicks),1,'Print button was not invoked '+label);
  }
  await page.emulateMedia({media:'print'});
  const style=await page.locator('.psn-print-watermark').evaluate(e=>({
   display:getComputedStyle(e).display,
   position:getComputedStyle(e).position,
   color:getComputedStyle(e).color,
   transform:getComputedStyle(e).transform
  }));
  assert.equal(style.display,'flex');assert.equal(style.position,'fixed');
  assert.ok(style.transform&&style.transform!=='none');
  assert.match(style.color,/rgba/);
  // Full native browser PDF extraction. printBackground:false intentionally
  // tests the browser print dialog's default, not a privileged screenshot.
  const file=path.join(out,label+'.pdf');
  fs.writeFileSync(file,await page.pdf({format:'A4',printBackground:false,preferCSSPageSize:true}));
  const n=pdfCheck(file,options.minPages||2,options.requiredText||[]);
  if(errors.length)console.log('V102 DIAGNOSTIC JS messages:',label,errors.slice(0,5));
  pass(label+' repeated Physics with Sir Najam on all '+n+' PDF pages, background graphics OFF');
  return {label,pages:n,pdf:file.replace(root,'[workspace]')};
 }finally{await page.close()}
}
async function main(){
 fs.mkdirSync(out,{recursive:true});
 const nav=read('shared/navigation.js'),css=read('shared/print-watermark-v70.css');
 assert.ok(nav.includes('function attachPrintWatermark()')&&nav.includes('attachPrintWatermark();'));
 assert.ok(nav.includes('shared/print-watermark-v70.css?v=102'));
 assert.ok(nav.includes("if(document.querySelector('.psn-print-watermark'))return;"));
 assert.ok(nav.includes("mark.style.display='none'"));
 assert.ok(nav.includes("mark.setAttribute('aria-hidden','true')"));
 assert.ok(nav.includes("for(let i=0;i<8;i++)"));
 assert.ok(css.includes('position:fixed')&&css.includes('transform:rotate')&&css.includes('print-color-adjust:exact'));
 assert.ok(!/FIREBASE_APPCHECK_DEBUG_TOKEN|sendReport|serviceAccount|initializeAppCheck/.test(nav));
 assert.ok(read('practice-engine/index.html').includes('print-watermark-v70.css?v=71'));
 assert.ok(read('portal/pdf-report.js').includes('print-watermark-v70.css'));
 pass('original V70 attribution preserved; global nav adds only one print overlay, no backend change');
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 const proofs=[];
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const base='http://127.0.0.1:'+server.address().port+'/';
  proofs.push(await pageProof(browser,base+'portal/unit-03-numericals.html',
   'unit03-questions-no-background',{minPages:2,
    dataReady:"document.getElementById('printQuestions')?.disabled===false",
    selectPrint:'#printQuestions',requiredText:['Numerical 3.1','Numerical 3.8']}));
  proofs.push(await pageProof(browser,base+'portal/unit-03-numericals.html',
   'unit03-worked-solutions-no-background',{minPages:2,
    dataReady:"document.getElementById('printSolutions')?.disabled===false",
    selectPrint:'#printSolutions',requiredText:['Numerical 3.1','Numerical 3.8']}));
  proofs.push(await pageProof(browser,base+'portal/unit-01-numericals.html',
   'unit01-worked-numericals-no-background',{minPages:2,
    requiredText:['Calculations, Dimensions']}));
  proofs.push(await pageProof(browser,base+'portal/unit-02-numericals.html',
   'unit02-worked-numericals-no-background',{minPages:2,
    requiredText:['Worked Numericals']}));
  // Synthetic protected-content DOM: no real Firebase account, lesson text, or
  // Firestore credentials, solely verifies the shared global print layer.
  const protectedPage=await browser.newPage({viewport:{width:1140,height:850}});
  try{
   await protectedPage.goto(base+'portal/course-lesson.html',{waitUntil:'domcontentloaded'});
   await protectedPage.locator('.psn-print-watermark').waitFor({state:'attached'});
   await protectedPage.evaluate(()=>{
    const doc=document.getElementById('resource');
    doc.hidden=false;
    document.getElementById('resource-title').textContent='Synthetic private lesson PDF watermark smoke test';
    const body=document.getElementById('resource-body');
    body.textContent=Array(160).fill('Synthetic example content without real student data.').join(' ');
   });
   const file=path.join(out,'synthetic-protected-lesson-no-background.pdf');
   fs.writeFileSync(file,await protectedPage.pdf({format:'A4',printBackground:false,preferCSSPageSize:true}));
   const pages=pdfCheck(file,1,['Synthetic private lesson']);
   pass('synthetic Firestore protected lesson print overlay visible on all '+pages+' PDF page(s)');
  }finally{await protectedPage.close()}
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 const result={version:'V102',status:'PASS — REAL LOCAL BROWSER PDF QA',groups:count,proofs,watermark:'Physics with Sir Najam; original V70 diagonal repeated attribution',backgroundGraphicsRequired:false,liveFirebaseTest:false,productionFirebaseWrites:false,thirdPartyPDFsRewritten:false,questionBanksModified:false,portalHtmlModified:false};
 fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(result,null,2)+'\n');
 console.log('V102 FINISHED:',count,'test groups passed; browser PDFs contain watermark on every inspected page. External linked PDFs not stamped.');
}
main().catch(e=>{console.error('V102 FAILED:',String(e?.stack||e).slice(0,2300));process.exitCode=1;try{server.close()}catch{}});
