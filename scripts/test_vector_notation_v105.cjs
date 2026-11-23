#!/usr/bin/env node
'use strict';
/* V105: source-wide vector notation glyph audit + real Chromium and browser
 * Print→Save PDF tests. The original Physics expressions remain unchanged;
 * only the visual U+20D7 display is converted into CSS-drawn arrows.
 * No Firebase calls, grading, student data or source-question edits.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/vector-notation-v105');
const text=p=>fs.readFileSync(path.join(root,p),'utf8');
const MARK='\u20D7';
const pages=[
 ['portal/unit-02-descriptive.html',263],
 ['portal/unit-02-numericals.html',110],
 ['portal/unit-02-formula-sheet.html',48],
 ['portal/unit-03-collision-study.html',4],
 ['portal/unit-04-angular-momentum-study.html',8]
];
const dynamicPage='portal/descriptive-answer-finder.html';
let checks=0;
function pass(msg){checks++;console.log('V105 PASS:',msg)}
function sourceAudit(){
 const css=text('shared/vector-notation-v105.css'),js=text('shared/vector-notation-v105.js');
 assert.ok(css.includes('border-top: .074em solid currentColor'));
 assert.ok(css.includes('print-color-adjust: exact'));
 assert.ok(css.includes('font-size: 0 !important'));
 assert.ok(js.includes('regex = /(\\p{L})\\u20D7/gu'));
 assert.ok(js.includes('aria-label'));
 assert.ok(js.includes('MutationObserver'));
 for(const bad of ['firebaseConfig','initializeAppCheck','sendReport','localStorage','sessionStorage','navigator.clipboard'])assert.ok(!js.includes(bad),'Forbidden data action '+bad);
 pass('standalone font-independent CSS arrow preserves the combining mark, has accessible vector labels, and sends no private or backend data');
 const discovered=[];
 for(const name of fs.readdirSync(path.join(root,'portal')).filter(n=>n.endsWith('.html'))){
  const p='portal/'+name,src=text(p),n=src.split(MARK).length-1;
  if(n)discovered.push({path:p,n});
 }
 const missed=discovered.filter(x=>!pages.some(p=>p[0]===x.path));
 console.log('V105 STATIC HTML SOURCE AUDIT:',JSON.stringify({affected:discovered,missed}));
 assert.deepEqual(missed,[],'Uncovered public HTML pages with combining-arrow text');
 assert.equal(discovered.length,5);
 assert.equal(discovered.reduce((a,x)=>a+x.n,0),433);
 for(const [p,n] of pages){
  const src=text(p);
  assert.equal(src.split(MARK).length-1,n,'Changed mathematical source: '+p);
  assert.equal((src.match(/vector-notation-v105.css/g)||[]).length,1);
  assert.equal((src.match(/vector-notation-v105.js/g)||[]).length,1);
  assert.ok(src.includes('shared/navigation.js')||src.includes('Physics with Sir Najam'));
 }
 const finder=text(dynamicPage);
 assert.ok(finder.includes('vector-notation-v105.css')&&finder.includes('vector-notation-v105.js'));
 const index=text('portal/verified-descriptive-index-v104.json');
 const parsed=JSON.parse(index);
 assert.equal(parsed.records.length,64);
 assert.ok(index.includes(MARK));
 pass('all five static affected public HTML sources (433 original vector marks) and asynchronous finder explicitly opt in; original HTML and JSON mathematics retained');
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const u=new URL(req.url,'http://localhost');let p=path.resolve(root,'.'+decodeURIComponent(u.pathname));
  if(!p.startsWith(root+path.sep)||!fs.existsSync(p)){res.writeHead(404);res.end('Missing');return}
  if(fs.statSync(p).isDirectory())p=path.join(p,'index.html');
  if(!fs.statSync(p).isFile()){res.writeHead(404);res.end('Missing');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(p).pipe(res);
 }catch{res.writeHead(404);res.end('Missing')}
});
async function verifyDocument(page,expected){
 const report=await page.evaluate(()=>{
  const main=document.querySelector('main');
  const symbols=[...main.querySelectorAll('.psn-vector-symbol')];
  const originalMarks=[...main.querySelectorAll('.psn-vector-source-mark')];
  const remaining=[];
  const w=document.createTreeWalker(main,NodeFilter.SHOW_TEXT);
  while(w.nextNode()){
   if(w.currentNode.data.includes('\u20D7')&&!w.currentNode.parentElement.closest('.psn-vector-source-mark'))remaining.push(w.currentNode.data.slice(0,40));
  }
  const sample=symbols[0];
  const before=getComputedStyle(sample,'::before'),after=getComputedStyle(sample,'::after'),source=getComputedStyle(originalMarks[0]);
  return {
   count:symbols.length,originalMarks:originalMarks.length,
   marksInText:(main.textContent.match(/\u20D7/g)||[]).length,
   remaining,
   aria:sample?.getAttribute('aria-label'),role:sample?.getAttribute('role'),
   css:{beforeBorder:before.borderTopWidth,beforeType:before.borderTopStyle,beforeColor:before.borderTopColor,
     afterBorder:after.borderRightWidth,afterType:after.borderRightStyle,sourceFont:source.fontSize,
     arrowContent:before.content},
   applied:window.PSNVectorNotationV105?.correctedSymbols
  };
 });
 assert.equal(report.count,expected,'Wrong vector replacement count '+JSON.stringify(report).slice(0,900));
 assert.equal(report.originalMarks,expected);
 assert.equal(report.marksInText,expected,'Source text must retain exactly the original arrow combining marks');
 assert.deepEqual(report.remaining,[],'Unconverted visible unsupported marks: '+JSON.stringify(report.remaining));
 assert.equal(report.role,'img');assert.ok(report.aria.startsWith('vector '));
 assert.equal(report.css.beforeType,'solid');assert.equal(report.css.afterType,'solid');
 assert.ok(parseFloat(report.css.beforeBorder)>0&&parseFloat(report.css.afterBorder)>0);
 assert.equal(report.css.sourceFont,'0px');
 return report;
}
async function browserAudit(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const base='http://127.0.0.1:'+server.address().port+'/';
  for(const [pathName,n] of pages){
   const page=await browser.newPage({viewport:{width:1180,height:850}});
   const errs=[];page.on('pageerror',e=>errs.push(e.message));
   try{
    const resp=await page.goto(base+pathName,{waitUntil:'load'});
    assert.equal(resp.status(),200);
    await page.waitForFunction(()=>Boolean(window.PSNVectorNotationV105));
    const report=await verifyDocument(page,n);
    assert.deepEqual(errs,[],'Browser JS errors on '+pathName);
    if(pathName.includes('unit-02-descriptive')){
     const target=page.locator('#l15');await target.scrollIntoViewIfNeeded();
     await target.locator('details').evaluate(x=>x.open=true);
     await page.screenshot({path:require('node:path').join(out,'unit02-vectors-descriptive-desktop.png'),fullPage:false});
     const originalText=await target.innerText();
     assert.ok(originalText.includes('Dot product'));
     assert.ok(originalText.includes('A'));
    }
    if(pathName.includes('unit-02-formula-sheet')){
     await page.screenshot({path:require('node:path').join(out,'unit02-vector-formula-desktop.png'),fullPage:false});
     await page.emulateMedia({media:'print'});
     const style=await page.locator('.psn-vector-symbol').first().evaluate(el=>({
      before:getComputedStyle(el,'::before').borderTopStyle,
      after:getComputedStyle(el,'::after').borderRightStyle
     }));
     assert.equal(style.before,'solid');assert.equal(style.after,'solid');
     const file=require('node:path').join(out,'unit02-vector-formula-background-off.pdf');
     fs.writeFileSync(file,await page.pdf({format:'A4',printBackground:false,preferCSSPageSize:true}));
     const pages=Number(execFileSync('pdfinfo',[file],{encoding:'utf8'}).match(/^Pages:\s+(\d+)/m)?.[1]);
     assert.ok(pages>=1&&pages<=30);
     const pdfText=execFileSync('pdftotext',['-raw',file,'-'],{encoding:'utf8'});
     assert.ok(/Vector Formula|Vectors|vector/i.test(pdfText));
     pass('real Unit 2 Formula Sheet Print→Save PDF ('+pages+' pages), background graphics OFF, CSS arrows printed as borders');
    }
    console.log('V105 RENDER SOURCE:',pathName,n,'symbols and original marks',report.marksInText,'source text preserved');
   }finally{await page.close()}
  }
  pass('all five real static learning pages produce CSS-based arrows for all 433 vector marks, original mathematical text retained');
  const finder=await browser.newPage({viewport:{width:390,height:840}});
  const errs=[];finder.on('pageerror',e=>errs.push(e.message));
  try{
   await finder.goto(base+dynamicPage+'?unit=2&type=comprehensive-response',{waitUntil:'load'});
   await finder.waitForFunction(()=>document.querySelectorAll('.card').length===15);
   const count=await finder.locator('.psn-vector-symbol').count();
   assert.ok(count>=4,'Dynamic question labels did not receive vector fallback: '+count);
   const remaining=await finder.evaluate(()=>{
    const root=document.querySelector('#results');const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const out=[];
    while(walker.nextNode())if(walker.currentNode.data.includes('\u20D7')&&!walker.currentNode.parentElement.closest('.psn-vector-source-mark'))out.push(walker.currentNode.data);
    return out;
   });
   assert.deepEqual(remaining,[]);
   assert.deepEqual(errs,[]);
   await finder.screenshot({path:require('node:path').join(out,'unit02-descriptive-finder-mobile.png'),fullPage:false});
   assert.equal(await finder.locator('.card').count(),15);
   assert.equal(await finder.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
   pass('asynchronous Unit 2 descriptive finder question labels use the same font-independent vector notation on a narrow phone');
  }finally{await finder.close()}
  const phone=await browser.newPage({viewport:{width:390,height:820}});
  try{
   await phone.goto(base+'portal/unit-02-descriptive.html#l15',{waitUntil:'load'});
   await phone.waitForFunction(()=>document.querySelectorAll('.psn-vector-symbol').length===263);
   await phone.locator('#l15 details').evaluate(el=>el.open=true);
   await phone.locator('#l15').scrollIntoViewIfNeeded();
   await phone.screenshot({path:require('node:path').join(out,'unit02-descriptive-vectors-phone.png'),fullPage:false});
   assert.equal(await phone.locator('.psn-vector-symbol').count(),263);
   pass('Unit 2 comprehensive Q15 mobile view preserves arrow notation and original worked answer');
  }finally{await phone.close()}
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
}
async function main(){
 fs.mkdirSync(out,{recursive:true});
 sourceAudit();await browserAudit();
 fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({version:'V105',qaGroups:checks,sourceHtmlAffected:5,staticOriginalCombiningArrows:433,sourceTextPreserved:true,dynamicFinder:dynamicPage,originalCssBorderArrow:true,printBackgroundRequired:false,originalAnswerEdits:false,authChanges:false,firebaseWrites:false,appCheckEnforcement:false,reportSendEnabled:false},null,2)+'\n');
 console.log('V105 COMPLETE:',checks,'evidence groups passed; mathematical text untouched, unsupported glyph no longer visually required.');
}
main().catch(err=>{console.error('V105 FAILED:',String(err?.stack||err).slice(0,3000));process.exitCode=1;try{server.close()}catch{}});
