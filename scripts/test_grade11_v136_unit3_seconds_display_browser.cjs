#!/usr/bin/env node
'use strict';
/* V136: verify the EXISTING V112 formatter renders original s^{-1}
 * as a visible superscript while preserving bit-for-bit source text.
 * No production runtime, question bank, answer keys or scores are changed.
 * Only isolated public mathematical tokens are included in screenshots.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v136-unit3-seconds-inverse-display');
const ids=[36,42,45,47,50,53,55,57,58,59,60].map(n=>'g11-u03-master-t33-q'+String(n).padStart(3,'0'));
const specimens=[ids[0],ids[10]];
const sourceFiles=[
 'practice-engine/index.html','shared/navigation.js',
 'shared/sitewide-science-print-v112.js','shared/sitewide-science-print-v112.css',
 'shared/practice-bank-adapter-v55.js',
 'question-bank/grade-11/unit03-v60-part1.b64',
 'question-bank/grade-11/unit03-v60-part2.b64',
 'question-bank/grade-11/unit-03-stage2-80-practice.json',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sourceHashes=Object.fromEntries(sourceFiles.map(p=>[p,sha(fs.readFileSync(path.join(root,p)))]));
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.b64':'text/plain; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 try{
  const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('not found');return;
  }
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('bad request')}
});
async function listen(){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
function contract(){
 const html=fs.readFileSync(path.join(root,'practice-engine/index.html'),'utf8');
 const nav=fs.readFileSync(path.join(root,'shared/navigation.js'),'utf8');
 const science=fs.readFileSync(path.join(root,'shared/sitewide-science-print-v112.js'),'utf8');
 const css=fs.readFileSync(path.join(root,'shared/sitewide-science-print-v112.css'),'utf8');
 assert.ok(!html.includes('UNIT3_FORMATIVE_SECONDS_IDS'),
  'An unnecessary Unit3-specific runtime rewrite was reintroduced');
 assert.ok(html.includes("setRich(e,q.explanationHtml,q.explanation)"));
 assert.ok(html.includes("setRich(reason,q.explanationHtml,q.explanation)"));
 assert.ok(nav.includes('sitewide-science-print-v112.js?v=112'));
 assert.ok(science.includes("wrap.textContent!==found[0]"),
  'Source-preserving V112 token roundtrip guard missing');
 assert.ok(science.includes("fragment.textContent!==original"),
  'Source-preserving V112 sentence guard missing');
 assert.ok(css.includes('.psn-scientific-token sup'));
 assert.ok(css.includes('.psn-scientific-source-notation'));
 const refs=JSON.parse(fs.readFileSync(path.join(root,'server/review-manifests/grade11-approved-public-review-refs-v99i.json'),'utf8'));
 assert.equal(refs.questionRefs.length,2250);
 assert.equal(refs.unitCounts['3'],220);
 for(const id of ids)assert.ok(refs.questionRefs.some(q=>q[0]===id));
 const hold=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(hold.releaseApproved,false);assert.equal(hold.teacherSignoff,'pending');
 assert.equal(hold.studentCourseStatus,'planned');
}

async function main(){
 contract();fs.mkdirSync(out,{recursive:true});
 const base=await listen();let browser;
 const audits=[],screenshots=[];
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:860},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const url=base+'practice-engine/index.html?unit=3&scope=formative&count=60&arrangement=random&selection=random&unseen=false&shuffle=false&feedback=end';
   assert.equal((await page.goto(url,{waitUntil:'domcontentloaded'})).status(),200);
   await page.locator('#begin').waitFor({state:'visible',timeout:25000});
   await page.waitForFunction(()=>Boolean(window.PSNSciencePrintV112),null,{timeout:15000});
   await page.locator('#begin').click();
   await page.locator('#question').waitFor({state:'visible',timeout:10000});
   const evidence=await page.evaluate(ids=>{
    if(!bank||bank.questions.length!==220)throw Error('Original Unit3 220-item source missing');
    const originals=bank.questions.filter(q=>q.assessmentClassification==='formative');
    if(originals.length!==60)throw Error('Original Unit3 60 formative items missing');
    if(test.length!==60||new Set(test.map(q=>q.id)).size!==60)
     throw Error('A complete 60-item original formative practice was not started');
    const result=[];
    for(const id of ids){
     const q=bank.questions.find(x=>x.id===id);
     if(!q||q.unit!==3||q.assessmentClassification!=='formative'||
        !test.some(x=>x.id===id))throw Error('Original formative source ID missing: '+id);
     result.push({id,hasBracedSeconds:String(q.explanation).includes('s^{-1}')});
    }
    for(const id of ['g11-u03-master-t33-q036','g11-u03-master-t33-q060']){
     if(!result.find(x=>x.id===id)?.hasBracedSeconds)
      throw Error('Original source scientific unit s^{-1} changed for '+id);
    }
    const overline=bank.questions.find(x=>x.id==='XI-U03-MCQ-0031');
    if(!overline||overline.assessmentClassification!=='summative-theory'||!overline.explanation.includes('\u0305'))
     throw Error('Unrelated original summative overlined-velocity source was modified');
    return result;
   },ids);
   page.once('dialog',d=>d.accept());
   await page.locator('#submit').click();
   await page.locator('#result').waitFor({state:'visible',timeout:15000});
   assert.equal(await page.locator('#review .review-item').count(),60);
   await page.locator('#review .psn-scientific-token sup').first().waitFor({state:'visible',timeout:15000});
   const checked=await page.evaluate(ids=>{
    const cards=[...document.querySelectorAll('#review .review-item')];
    return ids.map(id=>{
     const q=bank.questions.find(x=>x.id===id);
     const card=cards.find(el=>[...el.querySelectorAll(':scope > p.muted')]
      .some(p=>p.textContent.includes('Ref: '+id+' ')));
     if(!card)throw Error('Review source ID missing: '+id);
     const reason=[...card.children].find(el=>el.tagName==='P'&&el.className==='');
     if(!reason)throw Error('Original completed explanation missing: '+id);
     if(!card.textContent.includes('Formative'))throw Error('Formative classification was altered: '+id);
     const braced=q.explanation.includes('s^{-1}');
     if(braced){
      const token=[...reason.querySelectorAll('.psn-scientific-token')]
       .find(el=>el.textContent==='s^{-1}');
      if(!token)throw Error('V112 original source notation was not preserved: '+id);
      const sup=token.querySelector('sup');
      if(!sup||sup.textContent!=='-1')throw Error('V112 visible superscript missing: '+id);
      const hidden=token.querySelector('.psn-scientific-source-notation');
      if(!hidden||getComputedStyle(hidden).fontSize!=='0px')
       throw Error('Source-notation caret/braces are not visually hidden: '+id);
      if(getComputedStyle(sup).verticalAlign!=='super')
       throw Error('V112 superscript visually misaligned: '+id);
      if(!token.getBoundingClientRect().height)
       throw Error('V112 superscript has no visible inline box: '+id);
     }
     return {id,formativePreserved:true,originalBracedSeconds:braced,
      originalSourceTextPreserved:!braced||!!reason.querySelector('.psn-scientific-token'),
      superscriptVisible:braced};
    });
   },ids);
   assert.equal(checked.length,11);
   assert.ok(checked.filter(x=>x.originalBracedSeconds).length>=2);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,
    '60-item results horizontally overflow viewport '+width);
   assert.deepEqual(errors,[]);
   audits.push({viewportPx:width,originalQuestionCount:220,
    originalFormativeQuestionCount:60,submittedQuestions:60,
    sourceIDsChecked:checked,existingV112FormatterLoaded:true});
   await page.close();

   const live=await browser.newPage({viewport:{width,height:860},deviceScaleFactor:1});
   const liveErrors=[];live.on('pageerror',e=>liveErrors.push(e.message));
   assert.equal((await live.goto(base+'practice-engine/index.html?unit=3&scope=formative&count=60&arrangement=random&selection=random&unseen=false&shuffle=false&feedback=instant',{waitUntil:'domcontentloaded'})).status(),200);
   await live.locator('#begin').waitFor({state:'visible',timeout:25000});
   await live.waitForFunction(()=>Boolean(window.PSNSciencePrintV112),null,{timeout:15000});
   await live.locator('#begin').click();
   await live.locator('#question').waitFor({state:'visible',timeout:10000});
   await live.evaluate(id=>{
    const q=test.find(x=>x.id===id);
    if(!q)throw Error('Original formative item unavailable for instant feedback');
    test=[q];index=0;answers={};checked={};render();
   },specimens[0]);
   await live.locator('#choices input[type="radio"]').first().check();
   await live.locator('#check').click();
   await live.locator('#feedbackBox .psn-scientific-token sup').first().waitFor({state:'visible',timeout:15000});
   const instant=await live.locator('#feedbackBox .psn-scientific-token').evaluateAll(nodes=>
    nodes.some(el=>el.textContent==='s^{-1}'&&el.querySelector('sup')?.textContent==='-1'));
   assert.equal(instant,true,'Instant feedback lost original braced source or superscript');
   for(const id of specimens){
    const preview=await live.evaluate(id=>{
     document.querySelector('#v136-preview')?.remove();
     const q=bank.questions.find(x=>x.id===id);
     if(!q||!q.explanation.includes('s^{-1}'))throw Error('Original braced seconds unit missing: '+id);
     const originalToken='s^{-1}';
     const panel=document.createElement('section');
     panel.id='v136-preview';
     panel.style.cssText='width:min(520px,calc(100vw - 24px));box-sizing:border-box;padding:14px;margin:14px auto;border:1px solid #61728c;border-radius:9px;background:white;color:#1a2742;font:16px/1.6 system-ui,sans-serif';
     const heading=document.createElement('strong');heading.textContent='Unit 3 formative — existing V112 scientific notation';
     const meta=document.createElement('div');meta.textContent='Original source ID: '+id;
     const marker=document.createElement('p');marker.id='v136-symbol';
     marker.style.cssText='font:28px/1.5 Georgia,serif;margin:10px 0 0';
     setRich(marker,null,originalToken);
     panel.append(heading,meta,marker);document.body.append(panel);
     return {sourceTextPreserved:marker.textContent===originalToken,sourceId:id};
    },id);
    assert.equal(preview.sourceTextPreserved,true);
    await live.locator('#v136-symbol .psn-scientific-token sup').waitFor({state:'visible',timeout:10000});
    assert.equal(await live.locator('#v136-symbol .psn-scientific-token').textContent(),'s^{-1}');
    const screenshot=id+'-'+width+'px.png';
    await live.locator('#v136-preview').screenshot({path:path.join(out,screenshot)});
    screenshots.push({id,width,screenshot,teacherVisualSignoff:'PENDING',sourceBracesPreserved:true});
   }
   assert.deepEqual(liveErrors,[]);
   await live.close();
  }
 }finally{
  if(browser)await browser.close();
  await new Promise(ok=>server.close(ok));
 }
 assert.equal(screenshots.length,6);
 const after=Object.fromEntries(sourceFiles.map(p=>[p,sha(fs.readFileSync(path.join(root,p)))]));
 assert.deepEqual(after,sourceHashes,'Read-only V136 audit altered original or production files');
 fs.writeFileSync(path.join(out,'review-summary.json'),JSON.stringify({
  version:'V136',kind:'read-only-guard-for-existing-V112-source-preserving-superscripts',
  source:'original 220-item Grade XI Unit 3 public practice',
  sourceCandidateCount:11,formativeUnit3Total:60,
  browserTests:audits,isolatedSymbolScreenshots:screenshots,
  originalScientificSourceChanged:false,productionRuntimeChanged:false,
  academicAnswerCertification:false,unit6FormalRelease:false
 },null,2)+'\n');
 console.log('V136 PASS: existing V112 formats original s^{-1} into visual superscripts in 60-item formative results and instant feedback across 3 widths; source text preserved; no production change.');
}
main().catch(err=>{console.error('V136 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
