#!/usr/bin/env node
'use strict';
/* V70: Browser-generated PDFs must have a transparent diagonal brand watermark
 * on EVERY page. Raw machine-readable CSV/JSON keep schema-valid publisher metadata.
 * Fake student data only; no Firebase login, student profile or backend writes.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/watermark-v70');
fs.mkdirSync(out,{recursive:true});
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
 '.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 try{
  let f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end('Missing');return;}
  if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.statSync(f).isFile()){res.writeHead(404);res.end('Missing');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));}
});
function validatePdf(file,minPages){
 const meta=execFileSync('pdfinfo',[file],{encoding:'utf8'});
 const pages=Number(meta.match(/^Pages:\s+(\d+)/m)?.[1]||0);
 assert.ok(pages>=minPages,'expected at least '+minPages+' actual A4 pages, found '+pages+' for '+file);
 const content=execFileSync('pdftotext',['-layout',file,'-'],{encoding:'utf8',maxBuffer:5*1024*1024});
 const parts=content.split('\f').filter(p=>p.trim());
 assert.equal(parts.length,pages,'must parse and inspect all PDF pages');
 for(let i=0;i<parts.length;i++){
  const count=(parts[i].match(/Physics\s+with\s+Sir\s+Najam/gi)||[]).length;
  assert.ok(count>=4,'repeat-on-page watermark missing from '+file+' page '+(i+1)+'; count='+count);
 }
 return pages;
}
function staticAudit(){
 const css=read('shared/print-watermark-v70.css');
 const pdf=read('portal/pdf-report.js');
 const practice=read('practice-engine/index.html');
 const portal=read('portal/index.html'),app=read('portal/app.js');
 for(const x of ['@media print','position:fixed','transform:rotate','pointer-events:none','print-color-adjust:exact']){
  assert.ok(css.includes(x),'watermark is not print-safe: '+x);
 }
 assert.ok(pdf.includes("new URL('../shared/print-watermark-v70.css',import.meta.url)"));
 assert.ok(pdf.includes('psn-print-watermark')&&pdf.includes('watermarkLines'));
 assert.ok(practice.includes('print-watermark-v70.css?v=70')&&practice.includes('psn-print-watermark'));
 assert.ok(practice.includes('Print / Save Results as PDF'));
 assert.ok(app.includes("publisher:'Physics with Sir Najam'")&&app.includes("documentBranding:"));
 assert.ok(app.includes("'Exported by'")&&app.includes("r.bankVersion||'','Physics with Sir Najam'"));
 assert.ok(portal.includes('id="admin-learner-section"')&&portal.includes('id="admin-privacy-section"'));
 assert.ok(portal.includes('id="admin-future-work"')&&portal.includes('admin-section-tabs'));
 assert.ok(portal.includes('Backend required')&&portal.includes('planning previews, not active permissions'));
 assert.ok(portal.includes('id="admin-screen" class="dashboard admin-dashboard" hidden'));
 assert.ok(app.includes('getIdTokenResult(true)')&&app.includes('token.claims.admin===true'));
 const grades=JSON.parse(read('question-bank/manifest.json')).grades.find(x=>x.grade===11).units;
 assert.deepEqual(grades.map(x=>x.liveMcqCount),[275,206,220,640,349]);
 assert.equal(grades.reduce((sum,x)=>sum+x.liveMcqCount,0),1690);
 console.log('PASS V70 static: printable watermarks, export provenance, honest admin roadmap and original student security boundaries preserved');
}
async function main(){
 staticAudit();
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1280,height:850}});
  const base='http://127.0.0.1:'+server.address().port+'/';
  const page=await context.newPage();
  await page.goto(base+'portal/privacy.html',{waitUntil:'networkidle'});
  // Prepare the report generator before clicking to retain genuine user gesture.
  await page.evaluate(async()=>{
   window.__reportModule=await import('../portal/pdf-report.js');
   const button=document.createElement('button');button.id='generate-fake-report';button.textContent='Generate synthetic report';
   button.addEventListener('click',()=>{
    const rows=Array.from({length:80},(_,i)=>({
     createdAt:new Date(Date.UTC(2026,10,17-i)),questionCount:40,correctCount:28+i%10,
     arrangement:i%2?'scenario':'random'
    }));
    const slos=Array.from({length:32},(_,i)=>({
     code:'P-11-B-'+String(i+1).padStart(2,'0'),answered:20+i,correct:10+i,
     accuracy:50+i%35,status:i%3?'developing':'focus'
    }));
    window.__reportModule.openProgressPdfReport({
     studentName:'Synthetic Example Only',records:rows,complete:true,
     analytics:{attempts:80,answered:3200,accuracy:81,uniqueQuestions:600,slos,priority:[],needsEvidence:[]}
    });
   });
   document.body.append(button);
  });
  const [popup]=await Promise.all([page.waitForEvent('popup'),page.locator('#generate-fake-report').click()]);
  await popup.waitForLoadState('load');
  await popup.waitForFunction(()=>{
   const el=document.querySelector('.psn-print-watermark');
   return el&&el.children.length===8&&[...el.children].every(x=>x.textContent==='Physics with Sir Najam');
  });
  await popup.emulateMedia({media:'print'});
  const computed=await popup.locator('.psn-print-watermark').evaluate(e=>({
   display:getComputedStyle(e).display,
   position:getComputedStyle(e).position,
   transform:getComputedStyle(e).transform
  }));
  assert.equal(computed.display,'flex');assert.equal(computed.position,'fixed');
  assert.notEqual(computed.transform,'none');
  const progress=path.join(out,'synthetic-progress-watermarked.pdf');
  fs.writeFileSync(progress,await popup.pdf({format:'A4',printBackground:true,preferCSSPageSize:true}));
  const progressPages=validatePdf(progress,2);
  assert.match(await popup.locator('body').textContent(),/Synthetic Example Only/);
  assert.match(await popup.locator('body').textContent(),/Only the/);
  await popup.close();

  // Static source practice app: display fake long solution set without touching real MCQs.
  const practice=await context.newPage();
  await practice.goto(base+'practice-engine/index.html?unit=1',{waitUntil:'domcontentloaded'});
  await practice.waitForSelector('.psn-print-watermark');
  await practice.evaluate(()=>{
   const quiz=document.getElementById('quiz'),start=document.getElementById('start');
   if(quiz)quiz.classList.add('hidden');if(start)start.classList.add('hidden');
   const result=document.getElementById('result');result.classList.remove('hidden');
   const review=document.getElementById('review');
   review.replaceChildren();
   for(let i=1;i<=75;i++){
    const item=document.createElement('article');item.className='review-item';
    const title=document.createElement('h4');title.textContent='Synthetic question '+i+': sample calculation';
    const text=document.createElement('p');text.textContent='Synthetic answer explanation for watermark print QA. Real MCQ answers are unchanged.';
    item.append(title,text);review.append(item);
   }
  });
  await practice.emulateMedia({media:'print'});
  assert.equal(await practice.locator('.psn-print-watermark').evaluate(e=>getComputedStyle(e).position),'fixed');
  const practicePdf=path.join(out,'synthetic-mcq-results-watermarked.pdf');
  fs.writeFileSync(practicePdf,await practice.pdf({format:'A4',printBackground:true,preferCSSPageSize:true}));
  const practicePages=validatePdf(practicePdf,2);
  console.log('PASS V70 Chromium+PDF text inspection: watermark repeats on '+progressPages+' progress PDF pages and '+practicePages+' MCQ solution PDF pages');
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
}
main().catch(e=>{console.error('FAIL V70 print watermark QA',e);server.close();process.exitCode=1;});
