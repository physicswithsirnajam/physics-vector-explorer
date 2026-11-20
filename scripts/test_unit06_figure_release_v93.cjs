#!/usr/bin/env node
'use strict';
/* V93 source, illustration and student-browser release gate. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const sources=[
 ['61','unit-06-topic-61-v76-80-source.json',[11]],
 ['62','unit-06-topic-62-v78-80-source.json',[26,64,72]],
 ['63','unit-06-topic-63-v80-80-source.json',[24,80]]
];
const figureIds={
'XI-U06-T61-MCQ-0011':['C','unit6-figure62'],
'XI-U06-T62-MCQ-0026':['D','unit6-figure63'],
'XI-U06-T62-MCQ-0064':['A','unit6-figure65c'],
'XI-U06-T62-MCQ-0072':['D','unit6-figure63'],
'XI-U06-T63-MCQ-0024':['B','unit6-figure66'],
'XI-U06-T63-MCQ-0080':['B','unit6-figure66']
};
const originalKey={
61:'CDBDBDCDBBCCDCABABDCBACABDCAADCBDBDABBDCCDCDCBACAABABCAAACDDDDADDBBCAAADBBCCAABC',
62:'BCBDCCCBBABCADBBCACADACBDDDBDBCCCCDADAABCADCCCBBBAAABCBDACCBDDAADDADAAADDBDCABBD',
63:'AADBDCBADCCDBBACCDBCADDBCBBADDABACCBDDCDCDCBDACBCDABBACCDAACCADDAABCADABBACABBDB'
};
const banks={};let total=0;
for(const [topic,file,previousHolds] of sources){
 const b=json('question-bank/grade-11/'+file);banks[topic]=b;
 assert.equal(b.questions.length,80);assert.equal(b.publicPreviewCount,80);
 assert.deepEqual(b.holds,[]);assert.equal(b.questions.filter(q=>q.active).length,80);
 assert.equal(b.questions.map(q=>q.correctOptionId).join(''),originalKey[topic],'No original source answer key may change');
 for(const q of b.questions){
  assert.equal(q.boardEligible,false);assert.deepEqual(q.sloCodes,[]);assert.equal(q.cognitiveLevel,'Unspecified');
  assert.equal(q.stimulusSetId,null);assert.equal(q.status,'provisional-public-self-practice');
  assert.ok(q.options.map(o=>o.id).join('')==='ABCD');assert.equal(q.explanation.trim().length>0,true);
 }
 for(const n of previousHolds){
  const q=b.questions[n-1],expected=figureIds[q.id];
  assert.ok(expected,'Original source ID missing '+topic+'/'+n);
  assert.equal(q.correctOptionId,expected[0]);assert.equal(q.referenceFigureId,expected[1]);
  assert.equal(q.holdReason,null);assert.equal(q.active,true);
 }
 total+=b.questions.length;
}
for(const [id,[answer,figure]] of Object.entries(figureIds)){
 assert.ok(figure&&answer);
 const f='assets/illustrations/'+figure+'-reference.svg';
 const svg=read(f);assert.match(svg,/<svg[^>]*viewBox=/);assert.match(svg,/<title/);assert.match(svg,/<desc/);
}
assert.equal(total,240);
const man=json('question-bank/manifest.json').grades.find(g=>g.grade===11).units;
assert.deepEqual(man.map(u=>u.liveMcqCount),[275,206,220,640,349,560]);
assert.equal(man[5].sourceTopicMcqCount,560);assert.equal(man[5].sourceFigureHeldCount,0);
assert.equal(man.reduce((a,u)=>a+u.liveMcqCount,0),2250);
const c=json('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.equal(c.status,'planned');assert.equal(c.questionBankCount,0);assert.equal(c.partialTestBuilderMcqCount,560);assert.equal(c.sourceFigureHeldCount,0);
const card=read('portal/unit06-figure-card-v93.js');
for(const [,id] of Object.values(figureIds))assert.ok(card.includes("'"+id+"'"));
const central=read('practice-engine/index.html');
assert.match(central,/PSNUnit6FigureCardV93[.]append/);assert.match(central,/PSNUnit6FigureCardV93[.]has/);
for(const [topic] of sources){
 assert.match(read('portal/unit-06-topic-'+topic+'-preview.html'),/unit06-figure-card-v93[.]js/);
 assert.match(read('portal/unit-06-topic-'+topic+'-preview.js'),/PSNUnit6FigureCardV93[.]show/);
}
console.log('V93 STATIC PASS — original C/D/A/D/B/B keys preserved, 6 original illustrations and question links, 80/80 in Topics6.1–6.3, Unit6 560, GradeXI 2,250, full Unit6 still planned.');

async function browser(){
 const {chromium}=require('playwright');
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.css':'text/css; charset=utf-8','.png':'image/png'};
 const srv=http.createServer((req,res)=>{
  const name=decodeURIComponent((req.url||'/').split('?')[0]),relative=name.replace(/^\/+/,''),target=path.resolve(root,relative||'index.html');
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(target).pipe(res);
 });
 await new Promise(resolve=>srv.listen(0,'127.0.0.1',resolve));
 const port=srv.address().port,origin='http://127.0.0.1:'+port;
 let b;
 try{
  b=await chromium.launch({headless:true});
  for(const [topic,,previousHolds] of sources){
   const page=await b.newPage({viewport:{width:390,height:844}});
   const errs=[];page.on('pageerror',e=>errs.push(e.message));
   await page.goto(origin+'/portal/unit-06-topic-'+topic+'-preview.html',{waitUntil:'domcontentloaded'});
   await page.locator('#begin').waitFor({state:'visible'});
   await page.waitForFunction(()=>!document.getElementById('begin').disabled,{timeout:20000});
   await page.selectOption('#size','all');await page.click('#begin');
   const observed=new Set();
   for(let j=0;j<80;j++){
    const ref=await page.locator('#source-number').textContent();
    for(const n of previousHolds)if(ref.includes('source Q'+n+' ')){
     const img=page.locator('#figure-reference img');assert.equal(await img.count(),1,'A figure-dependent question needs its own original diagram');
     await img.evaluate(async im=>{if(!im.complete)await new Promise((res,rej)=>{im.onload=res;im.onerror=rej;});});
     assert.equal(await img.evaluate(im=>im.naturalWidth>0),true,'Diagram must decode');
     observed.add(n);
    }
    if(j<79)await page.click('#next');
   }
   assert.deepEqual([...observed].sort((a,b)=>a-b),previousHolds.slice().sort((a,b)=>a-b));
   const width=await page.evaluate(()=>({w:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(width.scroll<=width.w+2,'Horizontal overflow at 390px '+JSON.stringify(width));
   assert.deepEqual(errs,[]);
   await page.close();
  }
  console.log('V93 BROWSER PASS — six released original figure items show matching SVG in three 80-MCQ mobile self-practices.');
 }finally{if(b)await b.close();await new Promise(resolve=>srv.close(resolve));}
}
if(process.argv.includes('--browser'))browser().catch(e=>{console.error(e);process.exitCode=1;});
