#!/usr/bin/env node
'use strict';
/* V95-B7: final topic-level student PREVIEW audit.
 * Static science/provenance/privacy/academic gates, plus optional Chromium.
 * Does not certify source NBF printed figures or provisional MCQ tagging.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pagePath='portal/unit-06-topic-67-study-v95b7.html';
const html=read(pagePath),js=read('portal/unit-06-topic-67-study-v95b7.js');
const css=read('portal/unit-06-study-v95b1.css'),desk=read('portal/unit-06-learning-desk-v95a.html');
const report=read('quality/grade11-unit06-v95b7-topic67-student-lesson-source-and-signoff.md');
const svgPaths=[
 'assets/illustrations/unit6-v95b7-superfluid-film-original.svg',
 'assets/illustrations/unit6-v95b7-vortex-onset-original.svg',
 'assets/illustrations/unit6-v95b7-phase-axes-guide-original.svg'
];
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalog=JSON.parse(read('portal/learning-catalog.json'));
const signoff=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const grade=manifest.grades.find(g=>g.grade===11),bank=grade.units.find(u=>u.unit===6);
const unit=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(bank.liveMcqCount,560);
assert.equal(bank.standaloneSituationQuestionCount,136);
assert.equal(bank.independentSharedStimulusGroupCount,0);
assert.equal(bank.sourceFigureHeldCount,0);
assert.equal(bank.perQuestionSloVerified,false);
assert.equal(bank.exactFbiseModeReady,false);
assert.equal(grade.units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.equal(unit.status,'planned');
assert.equal(unit.assessmentStatus,'not-published');
assert.equal(unit.questionBankCount,0);
assert.equal(unit.partialTestBuilderMcqCount,560);
assert.equal(unit.simulationCount,5);
assert.equal(signoff.releaseApproved,false);
assert.equal(signoff.topics[6].topicTeacherApproved,false);
assert.equal(signoff.topics[6].studentLessonReady,false);
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')),'Full Unit6 course URL must remain reserved');
assert.equal((desk.match(/class="topic" id="topic-/g)||[]).length,7);
assert.equal((desk.match(/class="stage" role="listitem"/g)||[]).length,28);
assert.equal((desk.match(/<details>/g)||[]).length,7);
for(const n of ['61','62','63','64','65','66','67']){
 assert.ok(desk.includes('href="./unit-06-topic-'+n+'-study-v95b'+(Number(n)-60)+'.html"'),'Detailed lesson link missing '+n);
 assert.ok(desk.includes('href="./unit-06-topic-'+n+'-preview.html"'),'80 MCQ preview link missing '+n);
}
assert.ok(desk.includes('href="../superfluidity-explorer.html"'));
assert.ok(desk.includes('Seven detailed lesson previews are now linked'));
assert.ok(desk.includes('Teacher source fidelity'));
assert.equal((html.match(/<body>/g)||[]).length,1,'Exactly one body element required');
assert.equal((html.match(/class="lesson" id=/g)||[]).length,8);
assert.equal((html.match(/class="problem"/g)||[]).length,8);
assert.equal((html.match(/<details>/g)||[]).length,10);
for(const name of ['zero-viscosity','wall-creep','vortices','helium','applications','worked','try-it','review']){
 assert.ok(html.includes('id="'+name+'"'),'Missing lesson section '+name);
}
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
assert.equal(ids.length,new Set(ids).size,'Form and anchor IDs must be unique');
for(const term of [
'P-11-B-43','Summative','Understanding','zero viscosity',
'not a completed or officially approved Unit 6 course','η = 0 Pa·s',
'thin-film','open','quantized','critical angular velocity',
'2.17 K','0.0025 K','2170 mK','2.5 mK','868',
'2.1675 K','0.0030 K','2500 μK','−270.98 °C','0.67 K',
'pressure (MPa)','temperature (K)','solid, normal liquid, superfluid and gas',
'not a copy or reconstruction of NBF Figure 6.17','does not reproduce the original textbook Figure 6.17',
'not a reproduction of NBF Figure 6.16','supplementary','not a laboratory'
]){
 assert.ok(html.toLowerCase().includes(term.toLowerCase()),'Expected source, model or arithmetic wording missing: '+term);
}
for(let i=1;i<=11;i++)assert.ok(report.includes('T67-'+String(i).padStart(2,'0')),'Missing teacher QC amendment T67-'+i);
assert.ok(report.includes('Part D p.304')&&report.includes('NOT copied'));
assert.ok(!html.includes('Grade11_Unit6_COMPLETE_MASTER_ALL.pdf'),'Private source PDF must not be a linked student asset');
assert.ok(!html.includes('<iframe'),'Do not embed private textbook pages');
for(const pic of svgPaths){
 const image=read(pic);
 assert.ok(image.includes('<title')&&image.includes('<desc')&&image.includes('role="img"'));
 assert.ok(image.includes('independently')||image.includes('original')||image.includes('not a copy'),'Original artwork provenance missing '+pic);
 assert.ok(html.includes('../'+pic),'Lesson did not link safe original SVG '+pic);
}
const phase=read(svgPaths[2]);
assert.ok(phase.includes('No phase boundaries')&&phase.includes('not a copy'));
assert.ok(!phase.includes('M100 200L'),'Phase map must not trace a sourced boundary');
assert.match(css,/@media\(max-width:550px\)/);
assert.match(css,/@media print/);
assert.match(css,/prefers-reduced-motion/);
assert.ok(js.includes('event.preventDefault()'));
assert.ok(!/\b(?:fetch|localStorage|sessionStorage|firebase)\b/.test(js),'Student practice must not call network or access persistent storage');
assert.ok(js.includes('does not label samples superfluid or normal'));
for(const ref of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(x=>x[1])){
 if(ref.startsWith('#'))continue;
 const rel=ref.split('?')[0].split('#')[0];if(!rel)continue;
 assert.ok(!/^[a-z]+:/i.test(rel),'Unreviewed external student URL '+ref);
 assert.ok(fs.existsSync(path.resolve(root,'portal',rel)),'Broken local lesson resource '+ref);
}
const near=(what,actual,want,tol=1e-8)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-want)<=Math.max(1e-12,Math.abs(want)*tol),what+': '+actual+' != '+want);
near('He4 K->mK',2.17*1000,2170);
near('He3 K->mK',.0025*1000,2.5);
near('Reference temperature ratio',2.17/.0025,868);
near('Reference difference',2.17-.0025,2.1675);
near('3mK to K',3/1000,.003);
near('He3 K to microkelvin',.0025*1e6,2500);
near('He4 K to Celsius',2.17-273.15,-270.98);
near('He4 1.5K below reference',2.17-1.5,.67);
near('D Q25 upper difference',2.5-2.17,.33);
near('D Q25 lower difference',2.17-2,.17);
near('D Q27 He3 above',.0030-.0025,.0005);
near('D Q28 He3 below',.0025-.002,.0005);
console.log('V95-B7 STATIC PASS: all seven topic lesson links, eight sections, eight supplementary temperature problems, ten revision disclosures, three original copyright-safe diagrams, eleven academic corrections and reserved course release.');

async function browser(){
 const {chromium}=require('playwright');
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
 const server=http.createServer((req,res)=>{
  let rel;try{rel=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\/+/, '');}catch{res.writeHead(400);res.end();return;}
  const target=path.resolve(root,rel||'index.html');
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(target).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let instance;
 try{
  instance=await chromium.launch({headless:true});
  const base='http://127.0.0.1:'+server.address().port;
  for(const width of [390,768,1440]){
   const page=await instance.newPage({viewport:{width,height:850},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',err=>errors.push(err.message));
   const resp=await page.goto(base+'/'+pagePath,{waitUntil:'load'});
   assert.equal(resp.status(),200);
   assert.equal(await page.locator('.lesson').count(),8);
   const dims=await page.evaluate(()=>({view:document.documentElement.clientWidth,full:document.documentElement.scrollWidth}));
   assert.ok(dims.full<=dims.view+2,'Horizontal overflow @'+width+': '+JSON.stringify(dims));
   assert.equal(await page.locator('.teaching-figure img').count(),3);
   for(const img of await page.locator('.teaching-figure img').all()){
    await img.scrollIntoViewIfNeeded();
    const loaded=await img.evaluate(async i=>{try{await i.decode();return i.complete&&i.naturalWidth>0;}catch{return false;}});
    assert.equal(loaded,true,'Original illustration did not load @'+width);
   }
   const details=page.locator('#review details');assert.equal(await details.count(),10);
   await details.first().locator('summary').click();
   assert.equal(await details.first().evaluate(x=>x.open),true);
   await page.locator('#helium-converter-form button[type="submit"]').click();
   let output=await page.locator('#helium-output').innerText();
   assert.ok(output.includes('2,170 mK')&&output.includes('2,170,000 μK')&&output.includes('-270.98 °C'),'He4 conversion mismatch @'+width+': '+output);
   assert.ok(output.includes('does not label samples superfluid or normal'),'Actual-phase caveat missing');
   await page.locator('#preset-he3').click();
   output=await page.locator('#helium-output').innerText();
   assert.ok(output.includes('0.0025 K')&&output.includes('2.5 mK')&&output.includes('2,500 μK'),'He3 reference conversion mismatch @'+width+': '+output);
   await page.locator('#preset-millikelvin').click();
   output=await page.locator('#helium-output').innerText();
   assert.ok(output.includes('0.003 K')&&output.includes('3 mK')&&output.includes('above'),'3 mK preset mismatch @'+width+': '+output);
   await page.locator('#helium-temp-k').fill('-1');
   await page.locator('#helium-converter-form button[type="submit"]').click();
   assert.equal(await page.locator('#helium-error').isVisible(),true,'Invalid negative Kelvin not rejected @'+width);
   await page.locator('#superfluid-observation').selectOption('vortex');
   await page.locator('#superfluid-concept-form button[type="submit"]').click();
   output=await page.locator('#superfluid-concept-output').innerText();
   assert.ok(output.includes('Persistent vortex')&&output.includes('viscous damping'),'Persistent vortex explanation missing @'+width);
   await page.locator('#superfluid-observation').selectOption('graph');
   await page.locator('#superfluid-concept-form button[type="submit"]').click();
   output=await page.locator('#superfluid-concept-output').innerText();
   assert.ok(output.includes('temperature (K)')&&output.includes('pressure (MPa)')&&output.includes('verified'),'Graph reading boundary missing @'+width);
   assert.deepEqual(errors,[],'JavaScript errors @'+width);
   await page.close();
  }
  console.log('V95-B7 BROWSER PASS: 390/768/1440, three original figures, 10 revision items, helium source conversions/presets and concept checker.');
 }finally{if(instance)await instance.close();await new Promise(resolve=>server.close(resolve));}
}
if(process.argv.includes('--browser'))browser().catch(err=>{console.error(err);process.exitCode=1;});
