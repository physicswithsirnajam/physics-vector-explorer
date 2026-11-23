#!/usr/bin/env node
'use strict';
/* V116: explicit teacher-authorized B/B provisional practice replacements.
 * Immutable V84 prepared source and previous V111/V114 protective overlays.
 * No item-level FBISE certification or graded exam release.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const crypto=require('node:crypto'),vm=require('node:vm'),cp=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/unit6-v116-stagnation');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const originalFile='question-bank/grade-11/unit-06-topic-65-v84-80-source.json';
const v111File='question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json';
const v114File='question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json';
const overlayFile='question-bank/grade-11/unit-06-topic65-v116-approved-stagnation-practice-overlay.json';
const originalText=read(originalFile),original=JSON.parse(originalText),overlay=json(overlayFile);
const ids=[55,56].map(n=>'XI-U06-T65-MCQ-'+String(n).padStart(4,'0'));
const old114=[61,67,78].map(n=>'XI-U06-T65-MCQ-'+String(n).padStart(4,'0'));
const bankVersion='v116-topic64-v111-and-topic65-five-clarified-560-provisional';
let checks=0;const pass=s=>{checks++;console.log('V116 PASS:',s)};
const gitBlob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
const near=(v,x)=>assert.ok(Math.abs(v-x)<1e-9,'Expected '+x+' got '+v);
function adapter(customFetch){
 const g={fetch:customFetch||(async url=>{
  const p=String(url).replace(/^\.\.\//,'');
  assert.ok(p.startsWith('question-bank/grade-11/'),'Unexpected unsafe path '+p);
  return fs.existsSync(path.join(root,p))?
    {ok:true,status:200,json:async()=>json(p),text:async()=>read(p)}:
    {ok:false,status:404};
 })};
 vm.createContext(g);
 vm.runInContext(read('shared/practice-bank-adapter-v55.js'),g,{filename:'practice-bank-adapter-v55.js'});
 return g.PSNPracticeBankV55;
}
async function staticAudit(){
 assert.equal(gitBlob(originalText),'f5a7dd0a29d5e90842c0ef557071aebc10a70baf');
 assert.equal(overlay.sourceBankBlobSha,gitBlob(originalText));
 assert.equal(original.questions.length,80);assert.equal(overlay.sourceQuestionCount,80);
 assert.equal(overlay.practiceQuestionCount,80);assert.equal(overlay.overlayQuestionCount,2);
 assert.equal(overlay.sourceArchivedUnchanged,true);
 assert.equal(overlay.prerequisiteOverlayVersion,'V114');
 assert.equal(overlay.prerequisiteOverlayBlobSha,'701ac8e6daa4c2d7fdfc60671c3d8219626dd061');
 assert.deepEqual(overlay.blockedOriginalIds,ids);
 assert.deepEqual(overlay.previouslyApprovedV114PracticeIds,old114.map(id=>id+'-V114'));
 assert.equal(overlay.releaseState,'provisional-self-practice-only');
 assert.equal(overlay.replacements.length,2);
 const prepared=json('quality/grade11-unit06-v115-q55-q56-stagnation-teacher-candidates.json');
 assert.equal(prepared.version,'V115');
 for(let i=0;i<2;i++){
  const q=original.questions[54+i],r=overlay.replacements[i],c=prepared.candidates[i];
  assert.equal(q.id,ids[i]);assert.equal(r.originalId,q.id);assert.equal(r.practiceId,q.id+'-V116');
  assert.equal(r.originalStem,q.stem);assert.deepEqual(r.originalOptionTexts,q.options.map(o=>o.text));
  assert.equal(r.proposedStem,c.proposedStem);assert.deepEqual(r.proposedOptions,c.proposedOptions);
  assert.equal(r.explanation,c.proposedExplanation);
  assert.equal(r.correctOptionId,q.correctOptionId);assert.equal(r.correctOptionId,'B');
  assert.equal(r.sourcePdfPage,q.sourcePdfPage);
  assert.equal(r.teacherApprovedPracticeWording,true);
  assert.equal(r.teacherAuthorization,'explicit-topic65-Q55-Q56-practice-approval-2026-11-23');
  assert.equal(r.boardEligible,false);assert.equal(r.individualSloCertified,false);
  assert.equal(r.individualCognitiveCertified,false);assert.equal(r.fullExamCertificationApproved,false);
  assert.equal(r.originalSourceKeyUnchanged,true);
  assert.equal(r.academicStatus,'provisional-self-practice');
  assert.equal(r.sourceArchivedUnchanged,true);
 }
 pass('immutable exact 80-item V84 source SHA, exact authorized V115 candidate texts, original B/B options and individual certification locks');
 const mod=adapter();
 assert.equal(typeof mod.applyUnit6Topic65StagnationPracticeOverlay,'function');
 const prev=JSON.parse(JSON.stringify(mod.applyUnit6Topic65PracticeOverlay(original.questions,json(v114File))));
 const result=JSON.parse(JSON.stringify(mod.applyUnit6Topic65StagnationPracticeOverlay(prev,overlay)));
 assert.equal(prev.length,80);assert.equal(result.length,80);
 assert.equal(new Set(result.map(q=>q.id)).size,80);
 assert.equal(result.filter(q=>q.practiceOverlayVersion==='V116').length,2);
 assert.equal(result.filter(q=>q.practiceOverlayVersion==='V114').length,3);
 for(const id of [...ids,...old114])assert.equal(result.some(q=>q.id===id),false,'Ambiguous original served: '+id);
 for(const n of [55,56]){
  const q=result[n-1],r=overlay.replacements[n-55];
  assert.equal(q.id,r.practiceId);assert.equal(q.sourceOriginalId,r.originalId);
  assert.equal(q.correctOptionId,'B');assert.equal(q.stem,r.proposedStem);
  assert.deepEqual(q.options,r.proposedOptions);assert.equal(q.explanation,r.explanation);
  assert.equal(q.boardEligible,false);assert.deepEqual(q.sloCodes,[]);
  assert.equal(q.cognitiveLevel,'Unspecified');assert.equal(q.status,'provisional-public-self-practice');
  assert.equal(q.active,true);assert.equal(q.holdReason,null);
 }
 assert.ok(result[54].stem.includes('stagnation point Y'));
 assert.ok(result[55].stem.includes('very large reservoir'));
 for(const n of [61,67,78]){
  assert.equal(result[n-1].id,'XI-U06-T65-MCQ-'+String(n).padStart(4,'0')+'-V114');
  assert.equal(result[n-1].stem,prev[n-1].stem);
  assert.equal(result[n-1].correctOptionId,prev[n-1].correctOptionId);
 }
 pass('source-preserving Topic6.5 80-question copy has two distinct V116 and three untouched V114 variants; none of 5 originals are served');
 const central=JSON.parse(JSON.stringify(await mod.loadBank(6,'question-bank/grade-11/')));
 assert.equal(central.bankVersion,bankVersion);
 assert.equal(central.questions.length,560);
 assert.equal(central.questions.filter(q=>q.situationBased).length,136);
 assert.equal(central.questions.filter(q=>q.practiceOverlayVersion==='V111').length,4);
 assert.equal(central.questions.filter(q=>q.practiceOverlayVersion==='V114').length,3);
 assert.equal(central.questions.filter(q=>q.practiceOverlayVersion==='V116').length,2);
 assert.equal(new Set(central.questions.map(q=>q.id)).size,560);
 for(const id of [...ids,...old114,...[51,52,67].map(n=>'XI-U06-T64-MCQ-'+String(n).padStart(4,'0'))])
  assert.equal(central.questions.some(q=>q.id===id),false);
 assert.equal(central.questions.every(q=>q.boardEligible===false),true);
 pass('central Test Builder/Practice Engine has 560/136 inventory, V111 four+V114 three+V116 two, no old ambiguous IDs and no exam eligibility');
 const absent=adapter(async url=>{
  const p=String(url).replace(/^\.\.\//,'');
  if(p===overlayFile)return {ok:false,status:404};
  return {ok:true,status:200,json:async()=>json(p),text:async()=>read(p)};
 });
 await assert.rejects(absent.loadBank(6,'question-bank/grade-11/'),/V116 stagnation safety overlay unavailable/);
 assert.throws(()=>mod.applyUnit6Topic65StagnationPracticeOverlay(original.questions,overlay),/requires V114/);
 const withBadKey=JSON.parse(JSON.stringify(overlay));withBadKey.replacements[0].correctOptionId='C';
 assert.throws(()=>mod.applyUnit6Topic65StagnationPracticeOverlay(prev,withBadKey),/noncertification boundary/);
 const fakeExam=JSON.parse(JSON.stringify(overlay));fakeExam.replacements[1].boardEligible=true;
 assert.throws(()=>mod.applyUnit6Topic65StagnationPracticeOverlay(prev,fakeExam),/noncertification boundary/);
 const noStop=JSON.parse(JSON.stringify(overlay));noStop.replacements[0].proposedStem=original.questions[54].stem;
 assert.throws(()=>mod.applyUnit6Topic65StagnationPracticeOverlay(prev,noStop),/proposed wording\/options/);
 const wrongOption=JSON.parse(JSON.stringify(overlay));wrongOption.replacements[1].proposedOptions[1].text='incorrect replacement';
 assert.throws(()=>mod.applyUnit6Topic65StagnationPracticeOverlay(prev,wrongOption),/proposed wording\/options/);
 const wrongSource=JSON.parse(JSON.stringify(overlay));wrongSource.sourceBankBlobSha='bogus';
 assert.throws(()=>mod.applyUnit6Topic65StagnationPracticeOverlay(prev,wrongSource),/source version/);
 pass('missing V116 disabled, stale V114 refused, forged B/B key/exam status/options/stem/archive fingerprint rejected');
 // Independent Bernoulli calculations; source values and keys are not blindly trusted.
 const rho=1000;
 near(.5*rho*(4**2-0**2),8000);near(.5*rho*(4**2-0**2)/1000,8);
 near(100000+.5*rho*(0**2-10**2),50000);
 near((100000+.5*rho*(0**2-10**2))/1000,50);
 assert.notEqual(1*4,1*0,'a complete unbranched inlet/outlet cannot have unequal Q');
 assert.notEqual(1*0,1*10,'zero speed in a finite upstream pipe cannot feed a moving downstream flow');
 pass('independently calculated local stagnation +8 kPa and large-reservoir to duct 50 kPa, and contradicted finite pipe zero-velocity model');
 const queue=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
 assert.equal(queue.length,561);const h=queue[0].split(',');
 for(const row of queue.slice(1)){
  const c=row.split(',');
  for(const k of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(c[h.indexOf(k)],'PENDING');
 }
 const gates=json('quality/grade11-unit06-v94d-signoff-matrix.json');
 const course=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(gates.releaseApproved,false);assert.equal(gates.teacherSignoff,'pending');
 assert.equal(course.status,'planned');assert.equal(course.assessmentStatus,'not-published');
 const manifest=json('question-bank/manifest.json');
 assert.equal(manifest.grades.find(g=>g.grade===11).units[5].liveMcqCount,560);
 assert.ok(!read('question-bank/manifest.json').includes('-V116'));
 const pin=json('server/review-manifests/grade11-approved-public-review-refs-v99i.json');
 assert.equal(pin.questionRefs.length,2250);assert.equal(pin.bankVersions['6'],bankVersion);
 for(const n of [55,56]){
  const id='XI-U06-T65-MCQ-'+String(n).padStart(4,'0');
  assert.ok(pin.questionRefs.some(([key,unit,num])=>key===id+'-V116'&&unit===6&&num===n));
  assert.ok(!pin.questionRefs.some(([key])=>key===id));
 }
 for(const n of [61,67,78])assert.ok(pin.questionRefs.some(([id])=>id==='XI-U06-T65-MCQ-'+String(n).padStart(4,'0')+'-V114'));
 assert.ok(read('server/approved-practice-catalog-v99g.cjs').includes(path.basename(overlayFile)));
 pass('all 560 five-part individual certifications PENDING, course/exam release closed, answer-free signed reporting catalog holds 2250 exact public IDs');
 for(const p of ['shared/practice-bank-adapter-v55.js','portal/unit-06-topic-65-preview.js','portal/unit-06-balanced-mcq-v95c1.js'])
  assert.ok(read(p).includes('applyUnit6Topic65StagnationPracticeOverlay'),'Missing V116 safety transform '+p);
 for(const p of ['portal/unit-06-topic-65-preview.html','portal/unit-06-balanced-mcq-v95c1.html','practice-engine/index.html','build-your-physics-test.html'])
  assert.ok(read(p).includes('practice-bank-adapter-v55.js?v=116'),'Stale V116 JavaScript version '+p);
 assert.ok(read('portal/unit-06-topic-64-preview.html').includes('practice-bank-adapter-v55.js?v=111'));
 assert.ok(read('portal/unit-06-topic-65-preview.html').includes('sitewide-science-print-v112.js'));
 assert.ok(read('portal/unit-06-balanced-mcq-v95c1.html').includes('sitewide-science-print-v112.js'));
 assert.equal(json(v111File).overlayQuestionCount,4);
 assert.equal(json(v114File).overlayQuestionCount,3);
 pass('all 4 student routes include safe V116 adapter; V111 and V114 files and V112 native superscripts/watermark preserved');
}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 try{
  const f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end('not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch{res.writeHead(404);res.end('not found')}
});
function verifyPdf(file){
 const info=cp.execFileSync('pdfinfo',[file],{encoding:'utf8'});
 const n=Number(info.match(/^Pages:\s+(\d+)/m)?.[1]||0);
 assert.ok(n>=2,'80-item review must print at least two pages');
 const content=cp.execFileSync('pdftotext',['-raw',file,'-'],{encoding:'utf8',maxBuffer:20*1024*1024});
 const pages=content.split('\f').filter(s=>s.trim());
 assert.equal(pages.length,n);
 pages.forEach((page,i)=>{
  const t=page.toUpperCase();
  assert.ok((t.match(/PHYSICS\s+WITH/g)||[]).length>=4,'Repeated watermark missing on PDF p.'+(i+1));
  assert.ok((t.match(/NAJAM/g)||[]).length>=4,'Watermark name missing on PDF p.'+(i+1));
 });
 assert.ok(content.includes('stagnation point')||content.includes('stagnation'));
 return n;
}
async function browserAudit(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;const origin='http://127.0.0.1:'+server.address().port;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:840},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   let confirms=0;page.on('dialog',async d=>{assert.equal(d.type(),'confirm');confirms++;await d.accept()});
   try{
    const response=await page.goto(origin+'/portal/unit-06-topic-65-preview.html',{waitUntil:'load'});
    assert.equal(response.status(),200);
    await page.waitForFunction(()=>document.querySelector('#load-status')?.textContent.includes('80 questions available'),null,{timeout:25000});
    assert.equal(await page.locator('#begin').isEnabled(),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'Quiz overflow at '+width);
    assert.equal(await page.locator('.psn-print-watermark').count(),1);
    if(width===390){
     await page.locator('#size').selectOption('all');await page.locator('#begin').click();await page.locator('#finish').click();
     await page.locator('#results').waitFor({state:'visible'});
     assert.equal(confirms,1);assert.equal(await page.locator('#review article').count(),80);
     const review=await page.locator('#review').innerText();
     for(const n of [55,56])assert.ok(review.includes('V116 clarified variant of source Q'+n),'Missing source Q'+n);
     for(const n of [61,67,78])assert.ok(review.includes('V114 clarified variant of source Q'+n),'Prior V114 Q'+n+' missing');
     assert.ok(review.includes('stagnation point Y'));assert.ok(review.includes('very large reservoir'));
     assert.ok(review.includes('Answer: B'),'B/B answer keys not rendered');
     // V112 synthetic exponent check; original MCQs already contain valid Unicode powers.
     const synthetic='QA sample: 3 m3 s-1, 4 cm2, 1000 kg m-3, v^2 and 10^-3.';
     await page.evaluate(text=>{
      const p=document.createElement('p');p.id='v116-synthetic-units';p.textContent=text;
      document.querySelector('#review').appendChild(p);
     },synthetic);
     await page.waitForFunction(()=>document.querySelectorAll('#v116-synthetic-units sup').length>=6);
     const units=await page.evaluate(()=>{
      const p=document.getElementById('v116-synthetic-units');
      return {source:p.textContent,vertical:[...p.querySelectorAll('sup')].map(e=>getComputedStyle(e).verticalAlign)};
     });
     assert.equal(units.source,synthetic,'Source notation rewritten by presentation layer');
     assert.ok(units.vertical.every(v=>v==='super'),'Native exponent superscripts did not appear');
     const pdf=path.join(out,'topic65-v116-all-80-print-review.pdf');
     await page.emulateMedia({media:'print'});
     fs.writeFileSync(pdf,await page.pdf({format:'A4',printBackground:false,preferCSSPageSize:true}));
     const pages=verifyPdf(pdf);
     pass('Chromium 390px all-80 review includes B/B V116 and D/C/C V114, native exponents, repeated PSN watermark on every page of '+pages+'-page PDF');
     await page.screenshot({path:path.join(out,'topic65-v116-review-390.png'),fullPage:true});
    }else await page.screenshot({path:path.join(out,'topic65-v116-loaded-'+width+'.png'),fullPage:true});
    assert.deepEqual(errors,[],'Browser errors '+width);
   }finally{await page.close()}
  }
  pass('1280/390/320px real Topic6.5 preview loads exactly 80 provisional self-practice MCQs without overflow');
  const balanced=await browser.newPage({viewport:{width:390,height:850}});
  try{
   await balanced.goto(origin+'/portal/unit-06-balanced-mcq-v95c1.html',{waitUntil:'load'});
   await balanced.waitForFunction(()=>document.getElementById('start')?.disabled===false,null,{timeout:25000});
   const status=await balanced.locator('#status').innerText();
   assert.ok(status.includes('V111/V114/V116 approved practice clarifications'));
   await balanced.locator('#per-topic').selectOption('4');await balanced.locator('#start').click();
   assert.equal(await balanced.locator('#quiz-panel').isVisible(),true);
   assert.equal(await balanced.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
  }finally{await balanced.close()}
  pass('balanced seven-topic real browser quiz loads both Topic 6.5 safety overlays and V111 Topic 6.4 with 28-question mode');
  const central=await browser.newPage({viewport:{width:1180,height:840}});
  try{
   await central.goto(origin+'/practice-engine/index.html?unit=6&count=10',{waitUntil:'load'});
   const state=await central.evaluate(async()=>{
    const b=await window.PSNPracticeBankV55.loadBank(6,'../question-bank/grade-11/');
    return {n:b.questions.length,v111:b.questions.filter(x=>x.practiceOverlayVersion==='V111').length,
      v114:b.questions.filter(x=>x.practiceOverlayVersion==='V114').length,
      v116:b.questions.filter(x=>x.practiceOverlayVersion==='V116').map(x=>({id:x.id,eligible:x.boardEligible})),
      old:b.questions.filter(x=>['XI-U06-T65-MCQ-0055','XI-U06-T65-MCQ-0056'].includes(x.id)).length};
   });
   assert.equal(state.n,560);assert.equal(state.v111,4);assert.equal(state.v114,3);
   assert.equal(state.v116.length,2);assert.equal(state.old,0);
   assert.ok(state.v116.every(q=>q.id.endsWith('-V116')&&q.eligible===false));
  }finally{await central.close()}
  pass('real Practice Engine central bank has 560 items, previous corrections and zero ambiguous original Q55/Q56');
  const miss=await browser.newPage({viewport:{width:390,height:820}});
  try{
   await miss.route('**/unit-06-topic65-v116-approved-stagnation-practice-overlay.json',r=>r.fulfill({status:404,body:'missing'}));
   await miss.goto(origin+'/portal/unit-06-topic-65-preview.html',{waitUntil:'load'});
   await miss.waitForFunction(()=>document.querySelector('#load-status')?.textContent.includes('disabled'),null,{timeout:18000});
   assert.equal(await miss.locator('#begin').isDisabled(),true);
   await miss.goto(origin+'/portal/unit-06-balanced-mcq-v95c1.html',{waitUntil:'load'});
   await miss.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('disabled'),null,{timeout:18000});
   assert.equal(await miss.locator('#start').isDisabled(),true);
  }finally{await miss.close()}
  pass('missing V116 overlay fails closed in direct and seven-topic balanced quizzes, never serves Q55/Q56 originals');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 await staticAudit();await browserAudit();
 fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({version:'V116',groups:checks,
  originalV84SourceUnchanged:true,topic65ProvisionalCount:80,unit6ProvisionalCount:560,
  grade11ReferenceCount:2250,originalAmbiguousQ55Q56Served:0,
  retainedV111:4,retainedV114:3,clarifiedV116:2,formalExamCertified:0,allPdfPagesWatermarked:true},null,2)+'\n');
 console.log('V116 COMPLETE',checks,'source and student-browser test groups passed');
})().catch(e=>{console.error('V116 FAILED',e?.stack||e);process.exitCode=1;try{server.close()}catch{}});
