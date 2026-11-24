#!/usr/bin/env node
'use strict';
/* V136: complete original Unit3 formative practice submission + checked-answer
 * browser regression for limited seconds-inverse presentation formatting.
 * Only isolated "s^-1" source notation screenshot evidence, no revealed keys.
 * Source JSON/B64, original wording and answer keys never modified/exported.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v136-unit3-seconds-inverse-display');
const ids=[36,42,45,47,50,53,55,57,58,59,60].map(n=>'g11-u03-master-t33-q'+String(n).padStart(3,'0'));
const specimen=[ids[0],ids[10]];
const paths=[
 'practice-engine/index.html',
 'shared/practice-bank-adapter-v55.js',
 'question-bank/grade-11/unit03-v60-part1.b64',
 'question-bank/grade-11/unit03-v60-part2.b64',
 'question-bank/grade-11/unit-03-stage2-80-practice.json',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const before=Object.fromEntries(paths.map(p=>[p,sha(fs.readFileSync(path.join(root,p)))]));
const html=fs.readFileSync(path.join(root,'practice-engine/index.html'),'utf8');
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
 assert.equal((html.match(/setPracticeExplanation\(e,q\)/g)||[]).length,1);
 assert.equal((html.match(/setPracticeExplanation\(reason,q\)/g)||[]).length,1);
 assert.ok(html.includes("q.unit!==3||q.assessmentClassification!=='formative'"));
 assert.ok(html.includes('current.parentElement?.closest('));
 assert.ok(html.includes("part.nodeValue.replace(/s\\^-1\\b/g,'s⁻¹')"));
 for(const id of ids)assert.ok(html.includes("'"+id+"'"),'Missing individual source-ID allowlist entry');
 const frozen=JSON.parse(fs.readFileSync(path.join(root,'server/review-manifests/grade11-approved-public-review-refs-v99i.json'),'utf8'));
 assert.equal(frozen.questionRefs.length,2250);
 assert.equal(frozen.unitCounts['3'],220);
 for(const id of ids)assert.ok(frozen.questionRefs.some(x=>x[0]===id));
 const hold=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(hold.releaseApproved,false);assert.equal(hold.teacherSignoff,'pending');
 assert.equal(hold.studentCourseStatus,'planned');
}
async function main(){
 contract();fs.mkdirSync(out,{recursive:true});
 const base=await listen(),screenshots=[],samples=[];
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:860},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   page.once('dialog',dialog=>dialog.accept());
   const url=base+'practice-engine/index.html?unit=3&scope=formative&count=60&arrangement=random&selection=random&unseen=false&shuffle=false&feedback=end';
   assert.equal((await page.goto(url,{waitUntil:'domcontentloaded'})).status(),200);
   await page.locator('#begin').waitFor({state:'visible',timeout:25000});
   await page.locator('#begin').click();
   await page.locator('#question').waitFor({state:'visible',timeout:10000});
   const realSource=await page.evaluate(ids=>{
    if(!bank||bank.questions.length!==220)throw Error('Original complete Unit 3 source not loaded');
    const formative=bank.questions.filter(q=>q.assessmentClassification==='formative');
    if(formative.length!==60)throw Error('Source formative count changed');
    const selected=test.map(q=>q.id);
    if(selected.length!==60||new Set(selected).size!==60)
     throw Error('60-question formative practice sample not complete');
    const selectedIds=new Set(selected);
    const originals=[];
    for(const id of ids){
     const q=bank.questions.find(x=>x.id===id);
     if(!q||q.unit!==3||q.assessmentClassification!=='formative'||!selectedIds.has(id))
      throw Error('Original formative item missing from actual complete practice: '+id);
     originals.push({id,hasSeconds:typeof q.explanation==='string'&&q.explanation.includes('s^-1')});
    }
    if(!originals.find(x=>x.id==='g11-u03-master-t33-q036')?.hasSeconds||
       !originals.find(x=>x.id==='g11-u03-master-t33-q060')?.hasSeconds)
      throw Error('Two original source-verified seconds-inverse examples changed');
    const summative=bank.questions.find(q=>q.id==='XI-U03-MCQ-0031');
    if(!summative||summative.assessmentClassification!=='summative-theory')
      throw Error('Original summative average-velocity example changed');
    const summary=document.createElement('span');
    setPracticeExplanation(summary,summative);
    if(!summary.textContent.includes('\u0305'))
      throw Error('Unrelated summative velocity overline was damaged');
    const synthetic=document.createElement('span');
    setPracticeExplanation(synthetic,{unit:2,id:ids[0],assessmentClassification:'formative',
     explanation:'s^-1',explanationHtml:null});
    if(synthetic.textContent!=='s^-1')throw Error('Unrelated Unit2 notation was unexpectedly changed');
    return {originals,formative:formative.length};
   },ids);
   await page.locator('#submit').click();
   await page.locator('#result').waitFor({state:'visible',timeout:10000});
   assert.equal(await page.locator('#review .review-item').count(),60,'Actual 60 formative question results missing');
   const checked=await page.evaluate(ids=>{
    const cards=[...document.querySelectorAll('#review .review-item')];
    const data=[];
    for(const id of ids){
     const q=bank.questions.find(x=>x.id===id);
     const card=cards.find(node=>[...node.querySelectorAll(':scope > p.muted')]
       .some(p=>p.textContent.includes('Ref: '+id+' ')));
     if(!card)throw Error('Submitted formative item not found by original ID: '+id);
     const reason=[...card.children].find(x=>x.tagName==='P'&&x.className==='');
     if(!reason)throw Error('Completed explanation missing: '+id);
     const shouldFormat=q.explanation.includes('s^-1');
     if(shouldFormat&&(!reason.textContent.includes('s⁻¹')||reason.textContent.includes('s^-1')))
      throw Error('Source seconds^-1 not rendered as a superscript in completed review: '+id);
     if(q.explanation.includes('s^-1')===false&&reason.textContent.includes('s⁻¹')===true)
      throw Error('Seconds-inverse transformed despite absent original token: '+id);
     if(!card.textContent.includes('Formative'))throw Error('Original formative label missing: '+id);
     if(q.explanation.includes('s^-1')===false&&!q.explanation.includes('^'))
      throw Error('Review candidate original caret pattern disappeared: '+id);
     data.push({id,formativePreserved:true,originalSecondsToken:shouldFormat,
      superscriptIfPresent:!shouldFormat||reason.textContent.includes('s⁻¹')});
    }
    return data;
   },ids);
   assert.equal(checked.length,11);
   assert.ok(checked.filter(x=>x.originalSecondsToken).length>=2);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,
    'Completed 60-item results overflow viewport '+width);
   assert.deepEqual(errors,[],'Browser JavaScript error during original formative submitted review');
   samples.push({width,originalFormativeCount:realSource.formative,submittedQuestionCount:60,
    targets:checked,originalBankChanged:false,answerKeyExported:false});
   await page.close();

   // Original-question instant feedback path: select one original formative record
   // from the REAL prepared test in QA-only state; activate actual checked feedback.
   const live=await browser.newPage({viewport:{width,height:860},deviceScaleFactor:1});
   const e2=[];live.on('pageerror',e=>e2.push(e.message));
   assert.equal((await live.goto(base+'practice-engine/index.html?unit=3&scope=formative&count=60&arrangement=random&selection=random&unseen=false&shuffle=false&feedback=instant',{waitUntil:'domcontentloaded'})).status(),200);
   await live.locator('#begin').waitFor({state:'visible',timeout:25000});
   await live.locator('#begin').click();
   await live.locator('#question').waitFor({state:'visible',timeout:10000});
   await live.evaluate(id=>{
    const original=test.find(q=>q.id===id);
    if(!original)throw Error('Real prepared source formative question not present');
    test=[original];index=0;answers={};checked={};render();
   },specimen[0]);
   await live.locator('#choices input[type="radio"]').first().check();
   await live.locator('#check').click();
   const feedback=await live.locator('#feedbackBox').innerText();
   assert.ok(feedback.includes('s⁻¹')&&!feedback.includes('s^-1'),
    'Instant feedback did not use the same source-preserving seconds display');
   assert.deepEqual(e2,[]);
   for(const id of specimen){
    const preview=await live.evaluate(id=>{
     document.querySelector('#v136-preview')?.remove();
     const q=bank.questions.find(x=>x.id===id);
     if(!q||!q.explanation.includes('s^-1'))throw Error('Original source token unavailable');
     const token=q.explanation.match(/s\^-1/)[0];
     const p=document.createElement('section');p.id='v136-preview';
     p.style.cssText='width:min(520px,calc(100vw - 24px));box-sizing:border-box;padding:14px;margin:14px auto;border:1px solid #61728c;border-radius:9px;background:#fff;color:#1a2742;font:16px/1.6 system-ui,sans-serif';
     const caption=document.createElement('strong');caption.textContent='Unit 3 formative — original seconds exponent display';
     const meta=document.createElement('div');meta.textContent='Original source: '+id;
     const glyph=document.createElement('p');glyph.style.cssText='font:28px/1.5 Georgia,serif;margin:10px 0 0';
     setPracticeExplanation(glyph,{unit:q.unit,id:q.id,
      assessmentClassification:q.assessmentClassification,explanation:token,explanationHtml:null});
     p.append(caption,meta,glyph);document.body.append(p);
     return {display:glyph.textContent,hasBox:glyph.getBoundingClientRect().height>0};
    },id);
    assert.equal(preview.display,'s⁻¹');assert.equal(preview.hasBox,true);
    const screenshot=id+'-'+width+'px.png';
    await live.locator('#v136-preview').screenshot({path:path.join(out,screenshot)});
    screenshots.push({id,width,screenshot,teacherVisualSignoff:'PENDING'});
   }
   await live.close();
  }
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 assert.equal(screenshots.length,6);
 const after=Object.fromEntries(paths.map(p=>[p,sha(fs.readFileSync(path.join(root,p)))]));
 assert.deepEqual(after,before,'Original live or scientific source files changed during browser regression');
 const report={
  version:'V136',source:'original 220-item Grade XI Unit3 public practice bank',
  originalUnit3FormativeCount:60,immutableCandidateIDs:ids,screenWidths:[1280,390,320],
  checkedResults:samples,screenshots,
  scope:'Display-only s^-1 to s⁻¹ for source-identified Unit3 formative explanations, instant and after-submit',
  teacherAcademicCertification:false,originalQuestionsOrKeysModified:false,
  unit6ReleaseStillPending:true
 };
 fs.writeFileSync(path.join(out,'review-summary.json'),JSON.stringify(report,null,2)+'\n');
 console.log('V136 PASS: original 11 Unit3 formative IDs, real 60-question completed reviews at three widths, actual instant feedback, six symbol-only screenshots. All original sources unchanged.');
}
main().catch(err=>{console.error('V136 FAILED:',err.stack||err);process.exitCode=1;try{server.close()}catch{}});
