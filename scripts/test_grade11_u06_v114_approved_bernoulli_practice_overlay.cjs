#!/usr/bin/env node
'use strict';
/* V114: explicitly authorized public-self-practice-only Bernoulli variants.
 * No original source bank rewrites, no FBΙSE per-item certification, no exam release.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),
 crypto=require('node:crypto'),vm=require('node:vm'),cp=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/unit6-v114-bernoulli-overlay');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const sourceFile='question-bank/grade-11/unit-06-topic-65-v84-80-source.json';
const overlayFile='question-bank/grade-11/unit-06-topic65-v114-approved-practice-overlay.json';
const v111File='question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json';
const sourceRaw=read(sourceFile),src=JSON.parse(sourceRaw),overlay=json(overlayFile);
const numbers=[61,67,78],blocked=numbers.map(n=>'XI-U06-T65-MCQ-'+String(n).padStart(4,'0'));
const blocked64=[51,52,67].map(n=>'XI-U06-T64-MCQ-'+String(n).padStart(4,'0'));
const version='v116-topic64-v111-and-topic65-five-clarified-560-provisional';
let gates=0;const pass=s=>{gates++;console.log('V114 PASS:',s)};
const gitSha=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
const approx=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,'Expected '+b+' got '+a);
function context(customFetch){
 const obj={fetch:customFetch||(async url=>{
  const p=String(url).replace(/^\.\.\//,'');
  assert.ok(p.startsWith('question-bank/grade-11/'),'V114 unexpected path '+p);
  return fs.existsSync(path.join(root,p))
   ?{ok:true,status:200,json:async()=>json(p),text:async()=>read(p)}
   :{ok:false,status:404};
 })};
 vm.createContext(obj);
 vm.runInContext(read('shared/practice-bank-adapter-v55.js'),obj,{filename:'practice-bank-adapter-v55.js'});
 return obj;
}
async function auditStatic(){
 assert.equal(gitSha(sourceRaw),'f5a7dd0a29d5e90842c0ef557071aebc10a70baf');
 assert.equal(overlay.sourceBankBlobSha,gitSha(sourceRaw));
 assert.equal(overlay.sourceArchivedUnchanged,true);
 assert.equal(overlay.sourceBankFile,path.basename(sourceFile));
 assert.equal(overlay.schemaVersion,1);assert.equal(overlay.version,'V114');
 assert.equal(overlay.sourceQuestionCount,80);assert.equal(src.questions.length,80);
 assert.equal(overlay.practiceQuestionCount,80);assert.equal(overlay.overlayQuestionCount,3);
 assert.equal(overlay.releaseState,'provisional-self-practice-only');
 assert.deepEqual(overlay.blockedOriginalIds,blocked);
 assert.equal(overlay.replacements.length,3);
 const candidateFile=json('quality/grade11-unit06-v113-topic65-three-bernoulli-teacher-candidates.json');
 for(let i=0;i<3;i++){
  const q=src.questions[numbers[i]-1],r=overlay.replacements[i],c=candidateFile.candidates[i];
  assert.equal(q.id,blocked[i]);assert.equal(r.originalId,q.id);
  assert.equal(r.practiceId,q.id+'-V114');
  assert.equal(r.originalStem,q.stem);
  assert.deepEqual(r.originalOptionTexts,q.options.map(x=>x.text));
  assert.equal(r.proposedStem,c.proposedStem);
  assert.deepEqual(r.proposedOptions,c.proposedOptions);
  assert.equal(r.explanation,c.independentExplanation);
  assert.equal(r.correctOptionId,q.correctOptionId);
  assert.equal(r.correctOptionId,c.proposedCorrectOptionId);
  assert.equal(r.teacherApprovedPracticeWording,true);
  assert.equal(r.teacherAuthorization,'explicit-topic65-Q61-Q67-Q78-practice-approval-2026-11-23');
  assert.equal(r.boardEligible,false);
  assert.equal(r.individualSloCertified,false);
  assert.equal(r.individualCognitiveCertified,false);
  assert.equal(r.fullExamCertificationApproved,false);
  assert.equal(r.originalSourceKeyUnchanged,true);
  assert.equal(r.appliedPracticeOnly,true);
 }
 assert.deepEqual(overlay.replacements.map(x=>x.correctOptionId),['D','C','C']);
 pass('V84 exact original Git SHA, all 80 source records retained, V113 proposed stems authorized for 3 V114 provisional variants and source keys D/C/C');
 const cx=context(),fn=cx.PSNPracticeBankV55.applyUnit6Topic65PracticeOverlay;
 assert.equal(typeof fn,'function');
 const sample=JSON.parse(JSON.stringify(fn(src.questions,overlay)));
 assert.equal(sample.length,80);assert.equal(new Set(sample.map(q=>q.id)).size,80);
 assert.equal(sample.filter(q=>q.practiceOverlayVersion==='V114').length,3);
 for(let i=0;i<3;i++){
  const q=sample[numbers[i]-1],r=overlay.replacements[i];
  assert.equal(q.id,r.practiceId);assert.equal(q.sourceOriginalId,r.originalId);
  assert.equal(q.stem,r.proposedStem);assert.deepEqual(q.options,r.proposedOptions);
  assert.equal(q.correctOptionId,r.correctOptionId);assert.equal(q.explanation,r.explanation);
  assert.equal(q.boardEligible,false);assert.deepEqual(q.sloCodes,[]);
  assert.equal(q.cognitiveLevel,'Unspecified');assert.equal(q.status,'provisional-public-self-practice');
  assert.equal(q.active,true);assert.equal(q.holdReason,null);
 }
 for(const id of blocked)assert.equal(sample.some(q=>q.id===id),false,'Ambiguous original still served: '+id);
 assert.equal(sample[60].stem.includes('negligible viscous losses'),true);
 assert.equal(sample[66].stem.includes('without leaks'),true);
 assert.equal(sample[77].stem.includes('incompressible fluid'),true);
 pass('80-question Topic6.5 practice copy has three distinct V114 source-preserving replacements and no original ambiguous items');
 const bank=JSON.parse(JSON.stringify(await cx.PSNPracticeBankV55.loadBank(6,'question-bank/grade-11/')));
 assert.equal(bank.questions.length,560);assert.equal(bank.bankVersion,version);
 assert.equal(bank.questions.filter(x=>x.situationBased).length,136);
 assert.equal(bank.questions.filter(x=>x.practiceOverlayVersion==='V111').length,4);
 assert.equal(bank.questions.filter(x=>x.practiceOverlayVersion==='V114').length,3);
 assert.equal(bank.questions.filter(x=>x.practiceOverlayVersion==='V116').length,2);
 assert.equal(bank.questions.every(x=>x.boardEligible===false),true);
 assert.equal(new Set(bank.questions.map(q=>q.id)).size,560);
 for(const id of [...blocked,...blocked64])assert.equal(bank.questions.some(q=>q.id===id),false,'Central bank serves disallowed source: '+id);
 for(const n of [28,51,52,67]){
  const sourceId='XI-U06-T64-MCQ-'+String(n).padStart(4,'0');
  assert.ok(bank.questions.some(q=>q.sourceOriginalId===sourceId&&q.practiceOverlayVersion==='V111'));
 }
 pass('central Test Builder preserves 560/136 counts, four V111 continuity and three V114 Bernoulli safe records, no originals or approved exams');
 const withoutOverlay=context(async url=>{
  const p=String(url).replace(/^\.\.\//,'');
  if(p===overlayFile)return {ok:false,status:404};
  return {ok:true,status:200,json:async()=>json(p),text:async()=>read(p)};
 });
 await assert.rejects(withoutOverlay.PSNPracticeBankV55.loadBank(6,'question-bank/grade-11/'),/V114 Bernoulli safety overlay unavailable/);
 const badStem=JSON.parse(JSON.stringify(overlay));badStem.replacements[2].proposedStem=src.questions[77].stem;
 assert.throws(()=>fn(src.questions,badStem),/incorrect Bernoulli practice stem/);
 const fakeExam=JSON.parse(JSON.stringify(overlay));fakeExam.replacements[1].boardEligible=true;
 assert.throws(()=>fn(src.questions,fakeExam),/authorized item boundary/);
 const changedLetter=JSON.parse(JSON.stringify(overlay));changedLetter.replacements[0].correctOptionId='B';
 assert.throws(()=>fn(src.questions,changedLetter),/authorized item boundary/);
 const wrongSource=JSON.parse(JSON.stringify(overlay));wrongSource.sourceBankBlobSha='wrong';
 assert.throws(()=>fn(src.questions,wrongSource),/source version/);
 const modifiedOption=JSON.parse(JSON.stringify(overlay));modifiedOption.replacements[0].proposedOptions[3].text='All answers are correct';
 assert.throws(()=>fn(src.questions,modifiedOption),/incorrect Bernoulli practice stem or altered original options/);
 pass('no-overlay fails closed; forged official exam status, answer letter, source fingerprint, model assumptions or option edits are rejected');
 // Independent illustrative calculations for the three intended-model results.
 const A_X=2,A_Y=1,v_X=3,v_Y=A_X*v_X/A_Y,rho=1000;
 approx(A_X*v_X,A_Y*v_Y);approx(v_Y,6);
 const deltaP=.5*rho*(v_X*v_X-v_Y*v_Y);
 approx(deltaP,-13500);assert.ok(deltaP<0);
 const A=4,Q=12,v1=Q/A,v2=Q/A,g=9.8,h1=1,h2=4;
 approx(v1,v2);approx(.5*rho*v1*v1,.5*rho*v2*v2);
 approx(rho*g*(h2-h1),29400);
 // Compressible counterexample: equal area and mass flow, unequal speed.
 approx(2*2*3,1*2*6);assert.notEqual(3,6);
 pass('independent Bernoulli 13.5 kPa pressure decrease, unchanged kinetic term/rising height and compressible equal-area counterexample');
 const queue=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
 assert.equal(queue.length,561);const head=queue[0].split(',');
 for(const line of queue.slice(1)){
  const cells=line.split(',');
  for(const k of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(cells[head.indexOf(k)],'PENDING');
 }
 const gate=json('quality/grade11-unit06-v94d-signoff-matrix.json');
 const catalog=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(gate.releaseApproved,false);assert.equal(gate.teacherSignoff,'pending');
 assert.equal(catalog.status,'planned');assert.equal(catalog.assessmentStatus,'not-published');
 const manifest=json('question-bank/manifest.json');
 assert.equal(manifest.grades.find(g=>g.grade===11).units[5].liveMcqCount,560);
 assert.ok(!read('question-bank/manifest.json').includes('-V114'));
 const staticManifest=json('server/review-manifests/grade11-approved-public-review-refs-v99i.json');
 assert.equal(staticManifest.questionRefs.length,2250);
 assert.equal(staticManifest.bankVersions['6'],version);
 for(const n of numbers){
  const prefix='XI-U06-T65-MCQ-'+String(n).padStart(4,'0');
  assert.ok(staticManifest.questionRefs.some(([id,u,q])=>id===prefix+'-V114'&&u===6&&q===n));
  assert.ok(!staticManifest.questionRefs.some(([id])=>id===prefix));
 }
 assert.ok(read('server/approved-practice-catalog-v99g.cjs').includes(path.basename(overlayFile)));
 pass('560 academic approvals PENDING, original manifest/course unreleased, pinned public report refs contain 2250 answer-free IDs including three V114 variants');
 for(const p of ['portal/unit-06-topic-65-preview.js','portal/unit-06-balanced-mcq-v95c1.js','shared/practice-bank-adapter-v55.js']){
  assert.ok(read(p).includes('applyUnit6Topic65PracticeOverlay'),'New safety transform not linked at '+p);
 }
 for(const p of ['portal/unit-06-topic-65-preview.html','portal/unit-06-balanced-mcq-v95c1.html','practice-engine/index.html','build-your-physics-test.html']){
  assert.ok(read(p).includes('practice-bank-adapter-v55.js?v=116'),'V114+V116 combined safety adapter stale on '+p);
 }
 assert.ok(read('portal/unit-06-topic-65-preview.html').includes('sitewide-science-print-v112.js'));
 assert.ok(read('portal/unit-06-balanced-mcq-v95c1.html').includes('sitewide-science-print-v112.js'));
 assert.ok(read('portal/unit-06-topic-64-preview.html').includes('practice-bank-adapter-v55.js?v=111'));
 assert.ok(read('shared/practice-bank-adapter-v55.js').includes('applyUnit6Topic64PracticeOverlay'));
 assert.ok(fs.existsSync(path.join(root,v111File)));
 pass('four student practice entrypoints and V111 continuity checks remain cache-safe; V112 superscripts and universal PDF print watermark preserved');
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 try{
  const f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
 }catch{res.writeHead(404);res.end('Not found')}
});
function validatePdf(file){
 const info=cp.execFileSync('pdfinfo',[file],{encoding:'utf8'});
 const pages=Number(info.match(/^Pages:\s+(\d+)/m)?.[1]||0);
 assert.ok(pages>=2,'Expected multi-page printable 80-MCQ review');
 const raw=cp.execFileSync('pdftotext',['-raw',file,'-'],{encoding:'utf8',maxBuffer:20*1024*1024});
 const actual=raw.split('\f').filter(s=>s.trim());
 assert.equal(actual.length,pages);
 for(let i=0;i<actual.length;i++){
  const s=actual[i].toUpperCase();
  assert.ok((s.match(/PHYSICS\s+WITH/g)||[]).length>=4,'Repeated PSN watermark missing from PDF page '+(i+1));
  assert.ok((s.match(/NAJAM/g)||[]).length>=4,'PSN watermark name missing PDF page '+(i+1));
 }
 assert.ok(raw.includes('Kinetic term unchanged; gravitational term increased'));
 return pages;
}
async function browserAudit(){
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 const base='http://127.0.0.1:'+server.address().port;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:840},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   let prompts=0;
   page.on('dialog',async d=>{assert.equal(d.type(),'confirm');prompts++;await d.accept();});
   try{
    const response=await page.goto(base+'/portal/unit-06-topic-65-preview.html',{waitUntil:'load'});
    assert.equal(response.status(),200);
    await page.waitForFunction(()=>document.querySelector('#load-status')?.textContent.includes('80 questions available'),null,{timeout:25000});
    assert.equal(await page.locator('#begin').isEnabled(),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'Mobile overflow '+width);
    assert.equal(await page.locator('.psn-print-watermark').count(),1);
    if(width===390){
     await page.locator('#size').selectOption('all');await page.locator('#begin').click();
     await page.locator('#finish').click();
     await page.locator('#results').waitFor({state:'visible'});
     assert.equal(prompts,1);
     assert.equal(await page.locator('#review article').count(),80);
     const rows=await page.locator('#review').innerText();
     for(const id of numbers)assert.ok(rows.includes('V114 clarified variant of source Q'+id),'Missing clarified MCQ '+id);
     for(const phrase of ['negligible viscous losses','without leaks','incompressible fluid flows steadily'])assert.ok(rows.toLowerCase().includes(phrase.toLowerCase()),'Not displaying approved model '+phrase);
     assert.ok(rows.includes('Answer: D')&&rows.includes('Answer: C'),'Lost intended D/C/C answer explanation');
     // Existing teacher questions may already use true Unicode powers such as ²;
     // requiring a generated <sup> in those records would be an invalid QA condition.
     // Inject ONLY a clearly marked synthetic string into this headless test page.
     const synthetic='QA notation sample: 3 m3 s-1, 4 cm2, 1000 kg m-3, v^2 and 10^-3.';
     await page.evaluate(value=>{
      const p=document.createElement('p');p.id='v114-synthetic-notation';
      p.textContent=value;document.querySelector('#review').appendChild(p);
     },synthetic);
     await page.waitForFunction(()=>document.querySelectorAll('#v114-synthetic-notation sup').length>=6);
     const typesetting=await page.evaluate(()=>{
      const p=document.querySelector('#v114-synthetic-notation');
      return {source:p.textContent,raised:[...p.querySelectorAll('sup')].map(s=>({value:s.textContent,align:getComputedStyle(s).verticalAlign}))};
     });
     assert.equal(typesetting.source,synthetic,'V112 renderer altered original QA test text');
     assert.ok(typesetting.raised.every(s=>s.align==='super'),'V112 scientific superscripts were not visually raised');
     const pdf=path.join(out,'topic65-v114-all-80-print-review.pdf');
     await page.emulateMedia({media:'print'});
     fs.writeFileSync(pdf,await page.pdf({format:'A4',printBackground:false,preferCSSPageSize:true}));
     const pages=validatePdf(pdf);
     pass('Chromium 390px 80-MCQ real student review includes Q61/Q67/Q78 and V112 repeated watermark on all '+pages+' A4 PDF pages');
     await page.screenshot({path:path.join(out,'topic65-390-review.png'),fullPage:true});
    }else await page.screenshot({path:path.join(out,'topic65-'+width+'-loaded.png'),fullPage:true});
    assert.deepEqual(errors,[],'Unexpected JS errors '+width);
   }finally{await page.close()}
  }
  pass('Chromium 1280/390/320 Topic6.5 page usable, 80 corrected provisional practice questions, no script exceptions');
  const balanced=await browser.newPage({viewport:{width:390,height:820}});
  try{
   await balanced.goto(base+'/portal/unit-06-balanced-mcq-v95c1.html',{waitUntil:'load'});
   await balanced.waitForFunction(()=>document.getElementById('start')?.disabled===false,null,{timeout:25000});
   const status=await balanced.locator('#status').innerText();
   assert.ok(status.includes('V111/V114/V116 approved practice clarifications verified'));
   await balanced.locator('#per-topic').selectOption('4');
   await balanced.locator('#start').click();
   assert.equal(await balanced.locator('#quiz-panel').isVisible(),true);
   assert.equal(await balanced.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
  }finally{await balanced.close()}
  pass('Chromium balanced 7-topic quiz loads both approved overlays without changing 28-item balanced mode');
  const central=await browser.newPage({viewport:{width:1180,height:850}});
  try{
   await central.goto(base+'/practice-engine/index.html?unit=6&count=10',{waitUntil:'load'});
   const audit=await central.evaluate(async()=>{
    const b=await window.PSNPracticeBankV55.loadBank(6,'../question-bank/grade-11/');
    return {count:b.questions.length,v111:b.questions.filter(x=>x.practiceOverlayVersion==='V111').length,
      v114:b.questions.filter(x=>x.practiceOverlayVersion==='V114').map(x=>({id:x.id,source:x.sourceOriginalId,eligible:x.boardEligible})),
      originals:b.questions.filter(x=>[61,67,78].some(n=>x.id==='XI-U06-T65-MCQ-'+String(n).padStart(4,'0'))).length};
   });
   assert.equal(audit.count,560);assert.equal(audit.v111,4);assert.equal(audit.v114.length,3);assert.equal(audit.originals,0);
   assert.ok(audit.v114.every(x=>x.id.endsWith('-V114')&&x.eligible===false));
   // V116 adds two prior-source-preserving stagnation variants without changing three V114 results.
  }finally{await central.close()}
  pass('real central Practice Engine uses 560 source-preserving MCQs with no original Q61/Q67/Q78');
  const disabled=await browser.newPage({viewport:{width:390,height:840}});
  try{
   await disabled.route('**/unit-06-topic65-v114-approved-practice-overlay.json',r=>r.fulfill({status:404,body:'not available'}));
   await disabled.goto(base+'/portal/unit-06-topic-65-preview.html',{waitUntil:'load'});
   await disabled.waitForFunction(()=>document.querySelector('#load-status')?.textContent.includes('disabled'),null,{timeout:15000});
   assert.equal(await disabled.locator('#begin').isDisabled(),true);
   await disabled.goto(base+'/portal/unit-06-balanced-mcq-v95c1.html',{waitUntil:'load'});
   await disabled.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('disabled'),null,{timeout:15000});
   assert.equal(await disabled.locator('#start').isDisabled(),true);
  }finally{await disabled.close()}
  pass('browser fail closed: missing V114 overlay disables both Topic6.5 and all-seven-topic quiz instead of serving ambiguous sources');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 await auditStatic();await browserAudit();
 fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({version:'V114',groups:gates,
  archivedTopic65SourceUnchanged:true,topic65Available:80,unit6Available:560,grade11Available:2250,
  approvedPracticeVariants:3,retainedV111PracticeCorrections:4,ambiguousOriginalsServed:0,
  itemFbiseCertificationGranted:0,formalExamRelease:false,allPrintedPagesWatermarked:true},null,2)+'\n');
 console.log('V114 COMPLETE',gates,'verified groups, source-preserving public self-practice only');
})().catch(e=>{console.error('V114 FAILED',e?.stack||e);process.exitCode=1;try{server.close()}catch{}});
