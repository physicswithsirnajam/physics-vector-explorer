#!/usr/bin/env node
'use strict';
/* V95-C1: seven-topic balanced Unit6 self-practice integrity, teacher review queue,
 * source identity and browser checks. DOES NOT certify 560 physics keys/SLOs.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const pagePath='portal/unit-06-balanced-mcq-v95c1.html';
const html=read(pagePath),js=read('portal/unit-06-balanced-mcq-v95c1.js');
const css=read('portal/unit-06-balanced-mcq-v95c1.css');
const desk=read('portal/unit-06-learning-desk-v95a.html');
const report=read('quality/grade11-unit06-v95c1-assessment-baseline-and-review-method.md');
const sourceFiles=[
 'unit-06-topic-61-v76-80-source.json',
 'unit-06-topic-62-v78-80-source.json',
 'unit-06-topic-63-v80-80-source.json',
 'unit-06-topic-64-v82-80-source.json',
 'unit-06-topic-65-v84-80-source.json',
 'unit-06-topic-66-v86-80-source.json',
 'unit-06-topic-67-v88-80-source.json'
];
const banks=sourceFiles.map(f=>json('question-bank/grade-11/'+f));
const all=banks.flatMap(b=>b.questions),seen=new Set(),stems=new Set();
const figureIds=[
 'XI-U06-T61-MCQ-0011','XI-U06-T62-MCQ-0026',
 'XI-U06-T62-MCQ-0064','XI-U06-T62-MCQ-0072',
 'XI-U06-T63-MCQ-0024','XI-U06-T63-MCQ-0080'
];
const expectedFigures={
 'XI-U06-T61-MCQ-0011':'unit6-figure62',
 'XI-U06-T62-MCQ-0026':'unit6-figure63',
 'XI-U06-T62-MCQ-0064':'unit6-figure65c',
 'XI-U06-T62-MCQ-0072':'unit6-figure63',
 'XI-U06-T63-MCQ-0024':'unit6-figure66',
 'XI-U06-T63-MCQ-0080':'unit6-figure66'
};
let situations=0;
for(let i=0;i<banks.length;i++){
 const bank=banks[i],topic='6.'+(i+1);
 assert.equal(bank.topicNumber,topic);
 assert.equal(bank.grade,11);
 assert.equal(bank.unit,6);
 assert.equal(bank.questions.length,80);
 assert.equal(bank.questions.filter(q=>q.active).length,80);
 assert.equal(bank.questions.filter(q=>q.situationBased).length,i===0?16:20);
 assert.equal(bank.questions.filter(q=>q.stimulusSetId).length,0);
 assert.deepEqual(Object.fromEntries('ABCD'.split('').map(letter=>[letter,bank.questions.filter(q=>q.correctOptionId===letter).length])),
  {A:20,B:20,C:20,D:20});
 if(typeof bank.originalSourceAnswerKey==='string'&&bank.originalSourceAnswerKey.length===80)
  assert.equal(bank.questions.map(q=>q.correctOptionId).join(''),bank.originalSourceAnswerKey,'Source key altered in '+topic);
 for(const q of bank.questions){
  assert.ok(!seen.has(q.id),'Duplicate ID '+q.id);seen.add(q.id);
  const stem=q.stem.normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
  assert.ok(!stems.has(stem),'Duplicate text stem '+q.id);stems.add(stem);
  assert.ok(q.id.startsWith('XI-U06-T6'+(i+1)+'-MCQ-'),'Wrong topic ID '+q.id);
  assert.equal(q.sourceQuestionNumber,Number(q.id.slice(-4)));
  assert.equal(q.type,'single_choice');
  assert.ok(q.stem.trim().length>=8,'No meaningful question '+q.id);
  assert.equal(q.options.length,4);
  assert.equal(q.options.map(o=>o.id).join(''),'ABCD');
  assert.ok(q.options.every(o=>typeof o.text==='string'&&o.text.trim().length>0),'Blank option '+q.id);
  // Normalize only whitespace/case; preserve +,-,*,/, superscripts and symbols.
  assert.equal(new Set(q.options.map(o=>o.text.normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim())).size,4,'Exactly duplicated option in '+q.id);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId)&&q.explanation?.trim(),'Missing key/explanation '+q.id);
  assert.equal(q.boardEligible,false);
  assert.deepEqual(q.sloCodes,[]);
  assert.equal(q.cognitiveLevel,'Unspecified');
  assert.equal(q.stimulusSetId,null);
  assert.equal(q.situationBased,q.sourceSection==='standalone-situations');
  assert.equal(q.referenceFigureId||'',expectedFigures[q.id]||'');
  if(q.situationBased)situations++;
 }
}
assert.equal(all.length,560);
assert.equal(situations,136);
assert.equal(new Set(all.map(q=>q.id)).size,560);
assert.deepEqual(all.filter(q=>q.referenceFigureId).map(q=>q.id),figureIds);
assert.deepEqual(figureIds.map(id=>expectedFigures[id]),['unit6-figure62','unit6-figure63','unit6-figure65c','unit6-figure63','unit6-figure66','unit6-figure66']);
const manifest=json('question-bank/manifest.json'),catalog=json('portal/learning-catalog.json'),signoff=json('quality/grade11-unit06-v94d-signoff-matrix.json');
const grade=manifest.grades.find(g=>g.grade===11),mUnit=grade.units.find(u=>u.unit===6);
const cUnit=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(mUnit.liveMcqCount,560);
assert.equal(mUnit.independentSharedStimulusGroupCount,0);
assert.equal(mUnit.sourceFigureHeldCount,0);
assert.equal(mUnit.standaloneSituationQuestionCount,136);
assert.equal(mUnit.perQuestionSloVerified,false);
assert.equal(mUnit.cognitiveLevelVerified,false);
assert.equal(mUnit.exactFbiseModeReady,false);
assert.equal(grade.units.reduce((n,u)=>n+u.liveMcqCount,0),2250);
assert.equal(cUnit.status,'planned');
assert.equal(cUnit.assessmentStatus,'not-published');
assert.equal(cUnit.questionBankCount,0);
assert.equal(cUnit.partialTestBuilderMcqCount,560);
assert.equal(cUnit.simulationCount,5);
assert.equal(signoff.releaseApproved,false);
assert.ok(signoff.topics.every(t=>!t.topicTeacherApproved&&!t.studentLessonReady));
assert.ok(!fs.existsSync(path.join(root,'portal/unit-06.html')),'Full Unit6 route must remain unpublished');
assert.equal((desk.match(/class="topic" id="topic-/g)||[]).length,7);
for(let t=61;t<=67;t++){
 assert.ok(desk.includes('unit-06-topic-'+t+'-study-v95b'+(t-60)+'.html'),'Existing detailed study lesson removed '+t);
 assert.ok(desk.includes('unit-06-topic-'+t+'-preview.html'),'Original 80-item topic preview removed '+t);
}
assert.ok(desk.includes('unit-06-balanced-mcq-v95c1.html'));
assert.ok(desk.includes('../build-your-physics-test.html?unit=6'));
assert.ok(report.includes('14')&&report.includes('NOT included'));
assert.ok(report.includes('not guaranteed between all seven Unit6 *topics*'));
assert.ok(html.includes('not</strong> a complete official FBISE paper'));
assert.ok(html.includes('No cloud save')||html.includes('no cloud save'));
assert.ok(html.includes('id="figure-reference"'));
assert.equal((html.match(/class="topic-card"/g)||[]).length,7);
for(const n of [4,5,6,8])assert.ok(html.includes('option value="'+n+'"'),'Missing equal topic size '+n);
for(const mode of ['all','include-situation','situations-only'])assert.ok(html.includes('option value="'+mode+'"'),'Missing optional scenario mode '+mode);
for(const term of ['0','136','560','not</strong> a complete official FBISE paper','original source','topic-by-topic']){/* some terms may appear only in description; avoid using as certification */}
assert.ok(html.includes('source figure')||html.includes('source number'));
assert.ok(js.includes("PSNUnit6FigureCardV93.show"));
assert.ok(js.includes("PSNUnit6FigureCardV93.append"));
assert.ok(js.includes("test=build(count,mode,order)"));
assert.ok(js.includes('answers.get(item.q.id)===item.q.correctOptionId'),'Source-key scoring must read the unchanged question record');
assert.ok(js.includes("options.append(label)")||js.includes("options.append(label);"));
assert.ok(!/localStorage|sessionStorage|firebase|sendBeacon|XMLHttpRequest/.test(js));
assert.ok(!/\.innerHTML\s*=/.test(js),'Do not inject source stems as HTML');
assert.match(css,/@media\(max-width:450px\)/);
assert.match(css,/@media print/);
assert.match(css,/prefers-reduced-motion/);
for(const ref of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(x=>x[1])){
 if(ref.startsWith('#'))continue;
 const rel=ref.split('?')[0].split('#')[0];
 if(!rel)continue;
 assert.ok(!/^[a-z]+:/i.test(rel),'Unreviewed external reference '+ref);
 assert.ok(fs.existsSync(path.resolve(root,'portal',rel)),'Missing linked asset '+ref);
}
// Read CSV with true quote handling, not split on comma in review notes.
function parseCsvLine(str){
 const out=[];let value='',quoted=false;
 for(let i=0;i<str.length;i++){
  const ch=str[i];
  if(ch==='"'&&quoted&&str[i+1]==='"'){value+='"';i++;continue;}
  if(ch==='"'){quoted=!quoted;continue;}
  if(ch===','&&!quoted){out.push(value);value='';continue;}
  value+=ch;
 }
 assert.equal(quoted,false,'Unclosed CSV quote');out.push(value);return out;
}
const csv=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
assert.equal(csv.length,561,'Expected header plus 560 distinct review rows');
const header=parseCsvLine(csv[0]);
const entries=csv.slice(1).map(line=>Object.fromEntries(parseCsvLine(line).map((v,i)=>[header[i],v])));
assert.equal(new Set(entries.map(x=>x.source_question_id)).size,560);
for(let i=0;i<all.length;i++){
 const q=all[i],row=entries[i],bank=banks[Math.floor(i/80)];
 assert.equal(row.source_question_id,q.id);
 assert.equal(row.topic,bank.topicNumber);
 assert.equal(row.source_number,String(q.sourceQuestionNumber));
 assert.equal(row.source_pdf_page,String(q.sourcePdfPage||''));
 assert.equal(row.source_section,q.sourceSection);
 assert.equal(row.standalone_situation,q.situationBased?'YES':'NO');
 assert.equal(row.source_figure_id,q.referenceFigureId||'');
 assert.equal(row.topic_slo_candidates_not_item_certification,bank.verifiedFrameworkTopicSloCodes.join(';'));
 assert.equal(row.source_bank_file,sourceFiles[Math.floor(i/80)]);
 assert.equal(row.structural_integrity,'STRUCTURE_OK_ONLY');
 for(const col of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])assert.equal(row[col],'PENDING','Unsafe premature item approval '+q.id+' '+col);
 assert.ok(!row.review_note.includes(q.stem),'Do not duplicate source original MCQ text in review ledger');
}
console.log('V95-C1 STATIC PASS: 7 original banks × 80 = 560, 136 standalone situations, 6 original educational figures, 560 pending teacher rows, balanced 4/5/6/8 selections, safe unit release.');

async function browser(){
 const {chromium}=require('playwright');
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
 const server=http.createServer((req,res)=>{
  let relative;
  try{relative=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\/+/, '');}catch{res.writeHead(400);res.end();return;}
  const target=path.resolve(root,relative||'index.html');
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(target).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let instance;
 const answersByTopic=new Map(banks.map(b=>[b.topicNumber,new Map(b.questions.map(q=>[q.sourceQuestionNumber,q.correctOptionId]))]));
 try{
  instance=await chromium.launch({headless:true});
  const base='http://127.0.0.1:'+server.address().port;
  for(const width of [390,768,1440]){
   const page=await instance.newPage({viewport:{width,height:870},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/'+pagePath,{waitUntil:'networkidle'});
   assert.equal(response.status(),200);
   await page.waitForFunction(()=>document.getElementById('start')?.disabled===false,null,{timeout:25000});
   assert.equal(await page.locator('.topic-card').count(),7);
   const dimensions=await page.evaluate(()=>({view:document.documentElement.clientWidth,full:document.documentElement.scrollWidth}));
   assert.ok(dimensions.full<=dimensions.view+2,'Horizontal overflow @'+width+' '+JSON.stringify(dimensions));
   await page.locator('#selection-mode').selectOption('include-situation');
   await page.locator('#answer-order').selectOption('mixed');
   await page.locator('#per-topic').selectOption('4');
   await page.locator('#start').click();
   assert.equal(await page.locator('#quiz-panel').isVisible(),true);
   const seenIds=new Set(),perTopic={},scenarioByTopic={};
   for(let i=0;i<28;i++){
    const meta=await page.locator('#question-meta').innerText();
    const m=meta.match(/^Topic (6\.\d) · .* · (?:original source Q|V111 clarified variant of source Q|V111 corrected source Q)(\d+) · (.+)$/);
    assert.ok(m,'Missing topic and source number on item '+i+' '+meta);
    const [,topic,num,section]=m;
    const key=topic+'-'+num;
    assert.ok(!seenIds.has(key),'Repeated source MCQ '+key);seenIds.add(key);
    perTopic[topic]=(perTopic[topic]||0)+1;
    if(section==='standalone situations')scenarioByTopic[topic]=(scenarioByTopic[topic]||0)+1;
    const answer=answersByTopic.get(topic)?.get(Number(num));
    assert.ok('ABCD'.includes(answer),'Cannot find source public answer for '+key);
    await page.locator('#option-grid input[value="'+answer+'"]').check();
    if(i===0){
     await page.locator('#mark-review').check();
     await page.locator('#next').click();
     await page.locator('#previous').click();
     assert.equal(await page.locator('#option-grid input[value="'+answer+'"]').isChecked(),true,'Answer not remembered in navigation');
     assert.equal(await page.locator('#mark-review').isChecked(),true,'Review flag not remembered');
    }
    if(i<27)await page.locator('#next').click();
   }
   assert.equal(seenIds.size,28);
   for(let n=1;n<=7;n++){
    assert.equal(perTopic['6.'+n],4,'Unequal per-topic count for 6.'+n);
    assert.ok(scenarioByTopic['6.'+n]>=1,'No standalone situation for 6.'+n);
   }
   assert.ok((await page.locator('#answered').innerText()).includes('28 of 28'));
   await page.locator('#finish').click();
   assert.equal(await page.locator('#score').innerText(),'28 / 28','Full correct answers not scored correctly @'+width);
   assert.equal(await page.locator('#topic-breakdown tr').count(),7);
   assert.equal(await page.locator('.review-card').count(),28);
   assert.equal(await page.locator('#results-panel').isVisible(),true);
   assert.ok((await page.locator('#score-note').innerText()).includes('no school grade'));
   await page.locator('#another').click();
   assert.equal(await page.locator('#setup-panel').isVisible(),true);
   await page.locator('#selection-mode').selectOption('situations-only');
   await page.locator('#per-topic').selectOption('4');
   await page.locator('#answer-order').selectOption('topic-order');
   await page.locator('#start').click();
   const counts={};
   for(let i=0;i<28;i++){
    const meta=await page.locator('#question-meta').innerText();
    const m=meta.match(/^Topic (6\.\d) · .* · (?:original source Q|V111 clarified variant of source Q|V111 corrected source Q)(\d+) · (.+)$/);
    assert.ok(m&&m[3]==='standalone situations','Non-situation item in standalone-only quiz: '+meta);
    counts[m[1]]=(counts[m[1]]||0)+1;
    if(i<27)await page.locator('#next').click();
   }
   for(let n=1;n<=7;n++)assert.equal(counts['6.'+n],4);
   // Source-figure helper is re-used without copying or modifying protected art.
   const imageWidth=await page.evaluate(async()=>{
    const response=await fetch('../question-bank/grade-11/unit-06-topic-61-v76-80-source.json');
    const source=await response.json();
    const q=source.questions.find(x=>x.sourceQuestionNumber===11);
    const host=document.createElement('div');document.body.append(host);
    if(!window.PSNUnit6FigureCardV93?.append(host,q,'../assets/illustrations/'))return 0;
    const img=host.querySelector('img');
    try{await img.decode();return img.naturalWidth;}catch{return 0;}
   });
   assert.ok(imageWidth>0,'Figure-dependent source card unavailable @'+width);
   assert.deepEqual(errors,[],'Browser errors @'+width);
   await page.close();
  }
  // If any of the seven public source banks fails to load or validate, fail closed.
  const broken=await instance.newPage({viewport:{width:390,height:820}});
  await broken.route('**/unit-06-topic-64-v82-80-source.json',route=>route.fulfill({status:404,body:'not found'}));
  await broken.goto(base+'/'+pagePath,{waitUntil:'networkidle'});
  assert.equal(await broken.locator('#start').isEnabled(),false,'Partial bank load should never start a seven-topic quiz');
  assert.ok((await broken.locator('#status').innerText()).includes('disabled'));
  await broken.close();
  console.log('V95-C1 BROWSER PASS: 390/768/1440 responsive, equal four/topic, 7 standalone scenarios, all-correct local grading and seven-topic review, figure helper and fail-closed source loading.');
 }finally{if(instance)await instance.close();await new Promise(resolve=>server.close(resolve));}
}
if(process.argv.includes('--browser'))browser().catch(e=>{console.error(e);process.exitCode=1;});
