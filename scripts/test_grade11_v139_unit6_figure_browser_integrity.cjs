#!/usr/bin/env node
'use strict';
/* V139 — six ORIGINAL Unit 6 figure-dependent public MCQs, four original
 * independent educational SVGs, real student practice and completed review.
 * Browser screenshots are question-only, never solution/answer reveal.
 * This verifies asset loading/legibility layout, NOT NBF source scientific
 * equivalence, per-item SLO signoff or correct option certification.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v139-unit6-figure-browser');
const sourceFiles=[
 'question-bank/grade-11/unit-06-topic-61-v76-80-source.json',
 'question-bank/grade-11/unit-06-topic-62-v78-80-source.json',
 'question-bank/grade-11/unit-06-topic-63-v80-80-source.json',
 'question-bank/manifest.json',
 'portal/unit06-figure-card-v93.js',
 'practice-engine/index.html',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const srcMap={
 'XI-U06-T61-MCQ-0011':'unit6-figure62',
 'XI-U06-T62-MCQ-0026':'unit6-figure63',
 'XI-U06-T62-MCQ-0064':'unit6-figure65c',
 'XI-U06-T62-MCQ-0072':'unit6-figure63',
 'XI-U06-T63-MCQ-0024':'unit6-figure66',
 'XI-U06-T63-MCQ-0080':'unit6-figure66'
};
const svgMap={
 'unit6-figure62':'unit6-figure62-reference.svg',
 'unit6-figure63':'unit6-figure63-reference.svg',
 'unit6-figure65c':'unit6-figure65c-reference.svg',
 'unit6-figure66':'unit6-figure66-reference.svg'
};
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const allProtected=[...sourceFiles,...Object.values(svgMap).map(n=>'assets/illustrations/'+n)];
const originalHashes=Object.fromEntries(allProtected.map(p=>[p,digest(fs.readFileSync(path.join(root,p)))]));
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8',
 '.svg':'image/svg+xml','.png':'image/png','.b64':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
 try{
  const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
   res.writeHead(404);res.end('not found');return;
  }
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream',
   'Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('invalid request')}
});
async function listen(){
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 return 'http://127.0.0.1:'+server.address().port+'/';
}
function sourceContract(){
 const data=sourceFiles.slice(0,3).map(p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')));
 assert.ok(data.every(d=>d.questions.length===80),'Original topics 6.1–6.3 should each contain 80 public source items');
 const figures=data.flatMap(d=>d.questions.filter(q=>q.referenceFigureId));
 assert.deepEqual(figures.map(q=>q.id),Object.keys(srcMap),'Original six figure-backed source IDs changed');
 for(const q of figures){
  assert.equal(q.referenceFigureId,srcMap[q.id]);
  assert.equal(q.assessmentClassification,'summative-topic-provisional');
  assert.equal(q.boardEligible,false);
  assert.ok(q.options.length===4&&q.options.map(o=>o.id).join('')==='ABCD');
 }
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'question-bank/manifest.json'),'utf8'));
 const u=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
 assert.equal(u.liveMcqCount,560);
 assert.equal(u.sourceFigureHeldCount,0);
 assert.equal(u.perQuestionSloVerified,false);
 assert.equal(u.exactFbiseModeReady,false);
 for(const [id,filename] of Object.entries(svgMap)){
  const art=fs.readFileSync(path.join(root,'assets/illustrations',filename),'utf8');
  assert.ok(art.includes('<svg')&&art.includes('viewBox'),'Invalid existing educational SVG: '+id);
  assert.ok(!/<script\b/i.test(art),'An original SVG contains unexpected script');
 }
 const refs=JSON.parse(fs.readFileSync(path.join(root,'server/review-manifests/grade11-approved-public-review-refs-v99i.json'),'utf8'));
 assert.equal(refs.questionRefs.length,2250);
 assert.equal(refs.unitCounts['6'],560);
 for(const id of Object.keys(srcMap))assert.ok(refs.questionRefs.some(row=>row[0]===id));
 const matrix=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(matrix.releaseApproved,false);assert.equal(matrix.teacherSignoff,'pending');
 assert.equal(matrix.studentCourseStatus,'planned');
}
async function assertLoadedImage(img,fig,width,stage){
 await img.waitFor({state:'visible',timeout:10000});
 await img.evaluate(async node=>{if(!node.complete)await new Promise((ok,fail)=>{node.addEventListener('load',ok,{once:true});node.addEventListener('error',()=>fail(Error('Image error event')),{once:true})});await node.decode();});
 const data=await img.evaluate(node=>{
  const bounds=node.getBoundingClientRect();
  return {src:new URL(node.currentSrc).pathname,alt:node.alt,
   naturalWidth:node.naturalWidth,naturalHeight:node.naturalHeight,
   boxWidth:bounds.width,boxHeight:bounds.height};
 });
 assert.equal(data.src,'/assets/illustrations/'+svgMap[fig],
  'Wrong source educational figure asset at '+stage);
 assert.ok(data.naturalWidth>0&&data.naturalHeight>0,
  'Missing or undecodable figure '+fig+' at '+width+'px / '+stage);
 assert.ok(data.boxWidth>0&&data.boxHeight>0,'Figure invisible at '+stage);
 assert.ok(data.alt.trim().length>20,'Figure alt text missing at '+stage);
 return {assetLoaded:true,altPresent:true,visible:true};
}
async function main(){
 sourceContract();fs.mkdirSync(out,{recursive:true});
 const base=await listen(),results=[],screenshots=[];
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390,320]){
   const page=await browser.newPage({viewport:{width,height:880},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'practice-engine/index.html?unit=6&scope=all&count=6&arrangement=random&selection=random&unseen=false&shuffle=false&feedback=end',
    {waitUntil:'domcontentloaded'});
   assert.equal(response.status(),200);
   await page.locator('#begin').waitFor({state:'visible',timeout:25000});
   await page.locator('#begin').click();
   await page.locator('#question').waitFor({state:'visible',timeout:10000});
   const orderedIds=Object.keys(srcMap);
   await page.evaluate(ids=>{
    if(!bank||bank.questions.length!==560)throw Error('Full provisional Unit6 original source not loaded');
    if(!window.PSNUnit6FigureCardV93)throw Error('Original V93 source figure renderer missing');
    const original=ids.map(id=>{
     const q=bank.questions.find(q=>q.id===id);
     if(!q||!PSNUnit6FigureCardV93.has(q))throw Error('Original source figure not linked to question '+id);
     return {...q,displayOptions:q.options.slice()};
    });
    // Test-only deterministic subset from original loaded public source,
    // using the identical prepared displayOptions contract as the UI.
    test=original;index=0;answers={};checked={};render();
   },orderedIds);
   const pictured=new Set();
   for(let i=0;i<orderedIds.length;i++){
    const id=orderedIds[i],fig=srcMap[id];
    assert.ok((await page.locator('#question-reference').innerText()).includes(id),
     'Wrong original question in browser order');
    assert.equal(await page.locator('#choices .option-txt').count(),4);
    const figure=page.locator('#stimulusPanel figure.unit6-source-figure');
    const img=figure.locator('img');
    await assertLoadedImage(img,fig,width,'question');
    assert.ok((await figure.locator('figcaption').innerText()).includes('NBF printed'),
     'Honest educational reference/caption missing');
    assert.ok(!(await page.locator('#feedbackBox').isVisible()),'Question-only screenshot would reveal worked answer');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,
     'Horizontal overflow while showing '+id+' at '+width);
    if(!pictured.has(fig)){
     pictured.add(fig);
     const file=fig+'-'+width+'px.png';
     await page.screenshot({path:path.join(out,file),fullPage:true});
     screenshots.push({figureId:fig,viewportPx:width,screenshot:file,teacherVisualSignoff:'PENDING'});
    }
    results.push({id,figureId:fig,viewportPx:width,stage:'original public quiz',
     assetLoaded:true,publicSourceQuestionUnchanged:true});
    if(i<orderedIds.length-1)await page.locator('#next').click();
   }
   assert.equal(pictured.size,4);
   page.once('dialog',dialog=>dialog.accept());
   await page.locator('#submit').click();
   await page.locator('#result').waitFor({state:'visible',timeout:10000});
   const cards=page.locator('#review .review-item');
   assert.equal(await cards.count(),6);
   for(let i=0;i<orderedIds.length;i++){
    const id=orderedIds[i],fig=srcMap[id],card=cards.nth(i);
    assert.ok((await card.innerText()).includes(id),'Source reference absent after submission: '+id);
    const figure=card.locator('figure.unit6-source-figure');
    await assertLoadedImage(figure.locator('img'),fig,width,'submitted review');
    assert.ok((await figure.locator('figcaption').innerText()).includes('NBF printed'));
    results.push({id,figureId:fig,viewportPx:width,stage:'submitted review',
     assetLoaded:true,publicSourceQuestionUnchanged:true});
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,
    'Results/diagrams cause horizontal overflow at '+width);
   assert.deepEqual(errors,[],'JavaScript exception in real Unit6 figure journey');
   await page.close();
  }
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
 assert.equal(results.length,36);
 assert.equal(screenshots.length,12);
 const after=Object.fromEntries(allProtected.map(p=>[p,digest(fs.readFileSync(path.join(root,p)))]));
 assert.deepEqual(after,originalHashes,'Read-only figure QA changed source questions or educational art');
 fs.writeFileSync(path.join(out,'review-summary.json'),JSON.stringify({
  version:'V139',originalFigureDependentSourceQuestions:6,
  originalFigureAssets:4,questionAndReviewImagesChecked:36,
  browserWidths:[1280,390,320],questionOnlyScreenshots:screenshots,
  records:results,
  sourceFiguresAreOriginalIndependentEducationArt:true,
  originalTextbookArtworkCopied:false,originalScientificAnswerQC:false,
  teacherNBFVisualSignoff:'PENDING',unit6IndividualAcademicSignoffs:'PENDING',
  fullUnit6CourseOrGradedExamReleased:false,questionBankChanged:false
 },null,2)+'\n');
 console.log('V139 PASS: all 6 source-verified Unit6 figure-dependent MCQs with 4 educational SVGs loaded in quiz and post-submit at 1280/390/320px; 12 question-only screenshots; 560 Unit6 signoffs still PENDING.');
}
main().catch(e=>{console.error('V139 FAILED:',e.stack||e);process.exitCode=1;try{server.close()}catch{}});
