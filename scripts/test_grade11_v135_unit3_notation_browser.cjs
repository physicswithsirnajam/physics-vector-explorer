#!/usr/bin/env node
'use strict';
/* V135: SOURCE-ID-DRIVEN Unit 3 notation visual evidence.
 * The live, checked-in Grade XI practice engine loads the ORIGINAL public
 * compressed Unit3 source; this test previews only isolated math markers from
 * two original sources in the unchanged production safe renderer.
 *
 * No complete explanation, answer key, question, student record, private
 * PDF or content revision is included in screenshots or exported JSON.
 * Presence of a code point is not teacher certification of visual typography.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v135-unit3-notation-browser');
const overlineId='XI-U03-MCQ-0031';
const powers=[36,42,45,47,50,53,55,57,58,59,60].map(n=>'g11-u03-master-t33-q'+String(n).padStart(3,'0'));
const allIDs=[overlineId,...powers];
const samples=[overlineId,powers[0],powers[powers.length-1]];
const sourcePaths=[
 'practice-engine/index.html','shared/practice-bank-adapter-v55.js',
 'question-bank/grade-11/unit-03-stage2-80-practice.json',
 'question-bank/grade-11/unit03-v60-part1.b64',
 'question-bank/grade-11/unit03-v60-part2.b64',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const sha=contents=>crypto.createHash('sha256').update(contents).digest('hex');
const before=Object.fromEntries(sourcePaths.map(p=>[p,sha(fs.readFileSync(path.join(root,p)))]));
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.png':'image/png','.svg':'image/svg+xml','.b64':'text/plain; charset=utf-8',
 '.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('not found');return;
  }
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('invalid request')}
});
async function listen(){
 await new Promise((resolve,reject)=>{
  server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
 });
 return 'http://127.0.0.1:'+server.address().port+'/';
}
function sourceContract(){
 const old=JSON.parse(fs.readFileSync(path.join(root,'question-bank/grade-11/unit-03-stage2-80-practice.json'),'utf8'));
 assert.equal(old.questions.length,80,'Old Unit 3 source count changed');
 const q=old.questions.find(x=>x.id===overlineId);
 assert.ok(q&&q.explanation.includes('\u0305'),'Summative original overlined-velocity source not found');
 assert.equal(q.assessmentClassification,'summative-theory');
 assert.equal(q.sourceQuestionNumber,59);
 const refs=JSON.parse(fs.readFileSync(path.join(root,'server/review-manifests/grade11-approved-public-review-refs-v99i.json'),'utf8'));
 assert.equal(refs.questionRefs.length,2250);
 assert.equal(refs.unitCounts['3'],220);
 for(const id of allIDs)assert.ok(refs.questionRefs.some(row=>row[0]===id),'Original public ID not in frozen source register '+id);
 const matrix=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(matrix.teacherSignoff,'pending');assert.equal(matrix.releaseApproved,false);
}
async function main(){
 sourceContract();
 fs.mkdirSync(out,{recursive:true});
 const base=await listen();
 let browser;
 const audits=[],pictures=[];
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'practice-engine/index.html?unit=3&scope=all&count=4&arrangement=random&selection=random&unseen=false&shuffle=false',
    {waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200);
   await page.locator('#begin').waitFor({state:'visible',timeout:25000});
   await page.locator('#begin').click();
   await page.locator('#question').waitFor({state:'visible',timeout:10000});
   assert.equal(await page.locator('#choices .option-txt').count(),4,'Original Grade3 practice did not load four options');
   assert.equal(await page.locator('#feedbackBox').isVisible(),false,'QA must not expose a revealed key');
   // Actual original V55-bank values and actual unchanged production setRich().
   const checks=await page.evaluate(({allIDs,overlineId})=>{
    if(typeof setRich!=='function'||!bank||bank.questions.length!==220||bank.questions.some(q=>q.unit!==3))
     throw Error('Original Unit 3 220-item adapter or student renderer not loaded');
    const result=[];
    const mathPower=/(?:[A-Za-z0-9])\^(?:\{?-?\d{1,4}\}?|[xyz])/u;
    for(const id of allIDs){
     const q=bank.questions.find(x=>x.id===id);
     if(!q)throw Error('Missing real original Unit 3 source '+id);
     const holder=document.createElement('div');
     setRich(holder,q.explanationHtml,q.explanation);
     const text=holder.textContent;
     const isOverline=id===overlineId;
     const marker=isOverline?String(q.explanation).match(/[A-Za-z]\u0305/u)?.[0]:
      String(q.explanation).match(mathPower)?.[0];
     if(!marker)throw Error('V131 notation candidate disappeared from original source '+id);
     const parsed=String(text).includes(marker);
     const richSup=holder.querySelector('sup,msup')!==null;
     if(!parsed&&!richSup)throw Error('Original power/overline missing from real renderer '+id);
     result.push({id,sourceClass:q.assessmentClassification,
      originalMarkerDetected:true,survivesRenderer:parsed,richSuperscript:richSup});
    }
    return result;
   },{allIDs,overlineId});
   assert.equal(checks.length,12);
   assert.equal(checks[0].sourceClass,'summative-theory');
   assert.ok(checks.slice(1).every(c=>c.sourceClass==='formative'),
    'Unit3 3.3 original formative classification must remain intact');
   for(const item of checks){
    assert.equal(item.originalMarkerDetected,true);
    assert.ok(item.survivesRenderer||item.richSuperscript);
    audits.push({viewportPx:width,...item,
     originalKeyInspected:false,scientificCorrectnessCertified:false});
   }
   // Show source-derived isolated notation only, NOT original answer/explanation.
   for(const id of samples){
    const summary=await page.evaluate(({id,overlineId})=>{
     document.getElementById('v135-sample')?.remove();
     const q=bank.questions.find(x=>x.id===id);
     const regex=id===overlineId?/[A-Za-z]\u0305/u:
      /(?:[A-Za-z0-9])\^(?:\{?-?\d{1,4}\}?|[xyz])/u;
     const token=String(q.explanation).match(regex)?.[0];
     if(!token)throw Error('Missing source notation marker '+id);
     const panel=document.createElement('section');
     panel.id='v135-sample';
     panel.style.cssText='width:min(680px,calc(100vw - 24px));box-sizing:border-box;margin:20px auto;padding:16px;border:2px solid #314d73;border-radius:10px;background:white;color:#182640;font:16px/1.65 system-ui,sans-serif';
     const heading=document.createElement('strong');
     heading.textContent='Unit 3 original notation — isolated public-source marker';
     const meta=document.createElement('p');meta.style.margin='6px 0';
     meta.textContent='Source ID: '+id+' · '+q.assessmentClassification+' · answer-free rendering QA';
     const rendered=document.createElement('p');
     rendered.id='v135-rendered';
     rendered.style.cssText='padding:12px;background:#f2f4f8;font-size:26px;margin:10px 0 0';
     setRich(rendered,null,token); // Exact production safe plain-text fallback.
     panel.append(heading,meta,rendered);
     document.body.append(panel);
     return {tokenDetected:rendered.textContent===token,sourceId:id,
      visible:rendered.getBoundingClientRect().height>0,displayedAsSuperscript:!!rendered.querySelector('sup,msup')};
    },{id,overlineId});
    assert.equal(summary.tokenDetected,true,'Source marker changed in production fallback');
    assert.equal(summary.visible,true);
    const screenshot=id.toLowerCase().replace(/[^a-z0-9-]/g,'-')+'-'+width+'px.png';
    await page.locator('#v135-sample').screenshot({path:path.join(out,screenshot)});
    pictures.push({viewportPx:width,sourceId:id,screenshot,
     publicIsolatedNotationOnly:true,teacherVisualReview:'PENDING',
     shownAsSuperscript:summary.displayedAsSuperscript});
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,
    'Original quiz/preview horizontally overflows '+width+'px');
   assert.deepEqual(errors,[],'Original quiz JS error in Chromium at '+width+'px');
   await page.close();
  }
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 assert.equal(audits.length,36);
 assert.equal(pictures.length,9);
 const after=Object.fromEntries(sourcePaths.map(p=>[p,sha(fs.readFileSync(path.join(root,p)))]));
 assert.deepEqual(after,before,'Read-only browser preview changed original source file');
 const report={
  version:'V135',
  scope:'12 original Unit 3 V131 notation candidate IDs across 3 Chromium viewports',
  originalMasterFormativeCandidates:11,originalSummativeOverlineCandidates:1,
  browserChecks:audits.length,isolatedMarkerScreenshots:pictures.length,
  checks:audits,screenshots:pictures,
  caveats:[
   'The isolated notation marker is shown by the actual setRich fallback but not a full question-by-question explanation layout.',
   'Literal caret power in plain source is not automatically formatted to superscript; teacher visual QC decides whether a future display-only fix is desirable.',
   'Overlined velocity code point presence is not proof of correct glyph positioning in every font/browser.',
   'No examination-eligibility or scientific-answer certification occurs in this test.'
  ],
  originalBankChanged:false,answersOrQuestionsExported:false,
  full2250ItemVisualReviewComplete:false,unit6IndividualSignoff:'PENDING'
 };
 fs.writeFileSync(path.join(out,'review-summary.json'),JSON.stringify(report,null,2)+'\n');
 console.log('V135 PASS: 12 original Unit3 notation candidate IDs x 3 Chromium widths, 9 isolated source-marker screenshots; 11 formative power candidates and 1 summative overline. Human visual signoff pending.');
}
main().catch(e=>{console.error('V135 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
