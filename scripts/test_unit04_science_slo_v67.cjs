/* V67: Grade XI Unit4 complete 640-item source/SLO safety audit.
 * Structural checks cover all 640; scientifically independent calculations
 * below are targeted SPOT CHECKS, not official question-by-question signoff.
 * No source answers or student scores are changed by this script.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const folder='question-bank/grade-11/';
const normalize=s=>String(s).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
const eq=(actual,expected,tolerance=1e-9)=>assert.ok(Math.abs(actual-expected)<=tolerance,'independent calculation mismatch '+actual+' vs '+expected);
function readArchive(files){
 const encoded=files.map(f=>read(folder+f).trim()).join('');
 return JSON.parse(zlib.gunzipSync(Buffer.from(encoded,'base64')).toString('utf8'));
}
function sourceInventory(){
 const b61=readArchive(['unit04-v61-part1.b64','unit04-v61-part2.b64','unit04-v61-part3.b64']);
 const b62=readArchive(['unit04-v62-part1.b64','unit04-v62-part2.b64','unit04-v62-part3.b64']);
 const b63=readArchive(['unit04-v63-topic45.b64']);
 const b64=readArchive(['unit04-v64-topic46.b64']);
 const b65=readArchive(['unit04-v65-topic47.b64']);
 const b66=json(folder+'unit04-v66-figure413-five-source.json');
 const segments=[[b61,160],[b62,155],[b63,80],[b64,80],[b65,80],[b66,5]];
 const sourceSHA='925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777';
 let result=[];
 for(const [archive,size] of segments){
  assert.equal(archive.source,'Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx');
  assert.equal(archive.sourceSha256,sourceSHA);
  assert.equal(archive.rows.length,size);
  for(const r of archive.rows){
   assert.ok(Array.isArray(r)&&r.length===6);
   const [topic,n,stem,opts,key,explain]=r;
   assert.ok(Number.isInteger(topic)&&topic>=41&&topic<=47);
   assert.ok(Number.isInteger(n)&&n>=1&&n<=80);
   assert.ok(typeof stem==='string'&&stem.trim().length>=8);
   assert.ok(Array.isArray(opts)&&opts.length===4&&opts.every(o=>typeof o==='string'&&o.trim()));
   assert.ok('ABCD'.includes(key)&&typeof explain==='string'&&explain.trim());
   result.push(r);
  }
 }
 assert.equal(result.length,560,'all seven corrected Unit4 topics should yield 560 original MCQs');
 const lookup=new Map(),byTopic={};
 for(const r of result){
  const [topic,n]=r;
  const id='g11-u04-master-t'+topic+'-q'+String(n).padStart(3,'0');
  assert.ok(!lookup.has(id),'original source archive duplicate '+id);
  lookup.set(id,r);
  byTopic[topic]=(byTopic[topic]||0)+1;
 }
 for(let topic=41;topic<=47;topic++){
  assert.equal(byTopic[topic],80,'original corrected 80 per topic '+topic);
  for(let n=1;n<=80;n++)assert.ok(lookup.has('g11-u04-master-t'+topic+'-q'+String(n).padStart(3,'0')),
   'original corrected topic/question missing '+topic+':'+n);
 }
 assert.deepEqual(Object.keys(byTopic).map(Number).sort(),[41,42,43,44,45,46,47]);
 return lookup;
}
async function audit(){
 const official=json('quality/grade11-unit04-v67-fbise-framework.json');
 assert.equal(official.version,1);assert.equal(official.slos.length,12);
 const expectedCodes=['P-11-B-07','P-11-B-08','P-11-B-09','P-11-B-10','P-11-B-14','P-11-B-15','P-11-B-16','P-11-B-17','P-11-B-18','P-11-B-19','P-11-B-20','P-11-B-21'];
 assert.deepEqual(official.slos.map(s=>s.code),expectedCodes);
 assert.ok(official.slos.every(s=>s.classification==='summative-theory'&&s.levels.length));
 const context={DecompressionStream,Blob,Response,atob,fetch:async u=>{
  const file=String(u).replace(/^\.\.\//,'');
  assert.match(file,/^question-bank\/grade-11\/[a-z0-9.-]+$/,'local source archive only');
  return {ok:true,json:async()=>json(file),text:async()=>read(file)};
 }};
 vm.createContext(context);
 vm.runInContext(read('shared/practice-bank-adapter-v55.js'),context);
 const result=await context.PSNPracticeBankV55.loadBank(4,folder),qs=result.questions;
 assert.equal(qs.length,640);
 assert.equal(context.PSNPracticeBankV55.expected[4],640);
 const source=sourceInventory(),seenIds=new Set(),seenContent=new Set();
 const byTopic={};const correctAnswers={A:0,B:0,C:0,D:0};
 let broadCodes=0,singleCodes=0,sourceMatched=0;
 const original=json(folder+'unit-04-v39-80-practice.json').questions;
 assert.equal(original.length,80);
 for(let i=0;i<80;i++){
  const actual=qs[i],before=original[i];
  for(const key of ['id','stem','correctOptionId','explanation','cognitiveLevel','difficulty'])
   assert.equal(actual[key],before[key],'V39 original classroom source changed at '+before.id);
 }
 for(const q of qs){
  assert.ok(!seenIds.has(q.id),'duplicate quiz ID '+q.id);seenIds.add(q.id);
  const fingerprint=normalize(q.stem)+'|'+q.options.map(o=>normalize(o.text)).join('|');
  assert.ok(!seenContent.has(fingerprint),'duplicated question with same four choices '+q.id);seenContent.add(fingerprint);
  assert.equal(q.assessmentClassification,'summative-theory','non-summative labelled Unit4 question '+q.id);
  assert.equal(q.status,'teacher-review-pending');
  assert.equal(q.boardEligible,false);
  assert.equal(q.options.length,4);assert.deepEqual(q.options.map(o=>o.id),['A','B','C','D']);
  const distinct=new Set(q.options.map(o=>normalize(o.text)));
  assert.equal(distinct.size,4,'duplicate distractor option inside original question '+q.id);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.explanation&&q.explanation.trim().length>0);
  correctAnswers[q.correctOptionId]++;
  assert.ok(q.sloCodes.length>0&&q.sloCodes.every(x=>expectedCodes.includes(x)),
   'Unit4 uses incorrect or formative official SLO '+q.id);
  const r=source.get(q.id);
  if(r){
   sourceMatched++;
   const [t,n,,options,answer]=r,topic='4.'+(t-40);
   byTopic[topic]=(byTopic[topic]||0)+1;
   assert.equal(q.sourceQuestionNumber,n,'original source number changed '+q.id);
   assert.equal(q.correctOptionId,answer,'Word answer-table key differs from published source '+q.id);
   assert.deepEqual(JSON.parse(JSON.stringify(q.sloCodes)),official.topicCandidateCodes[topic],
    'topic-level SLO candidate differs from official topic matrix '+q.id);
   assert.equal(q.cognitiveLevel,'Unspecified','corrected source should not claim vetted cognitive level '+q.id);
   assert.equal(q.difficulty,'Unspecified','corrected source should not claim vetted difficulty '+q.id);
   assert.equal(q.source?.document,'Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx');
   // V61 can deliberately restore mathematical superscripts and subscripts;
   // the per-topic original transfer tests verify exact source option fidelity.
   assert.equal(options.length,4);
   if(q.sloCodes.length>1)broadCodes++;else singleCodes++;
  }else assert.ok(iLikeOriginal(q,original),'unrecognized source question '+q.id);
 }
 assert.equal(sourceMatched,560);
 assert.equal(singleCodes,320);assert.equal(broadCodes,240);
 for(let topic=1;topic<=7;topic++)assert.equal(byTopic['4.'+topic],80);
 assert.deepEqual(correctAnswers,{A:160,B:160,C:160,D:160});
 const groups=new Map();
 for(const q of qs)if(q.stimulusSetId){
  if(!groups.has(q.stimulusSetId))groups.set(q.stimulusSetId,[]);
  groups.get(q.stimulusSetId).push(q);
 }
 assert.equal(groups.size,48);
 assert.ok([...groups.values()].every(group=>group.length===4&&
  group.every(q=>q.stimulusHtml===group[0].stimulusHtml)&&group[0].stimulusHtml.length>30));
 assert.equal(qs.filter(q=>q.stimulusSetId).length,192);
 function anchor(id,answer,selectedText){
  const q=qs.find(x=>x.id===id);assert.ok(q,'scientific anchor question missing '+id);
  assert.equal(q.correctOptionId,answer,'independent physics anchor disagrees with source key '+id);
  const chosen=q.options.find(o=>o.id===answer);
  assert.ok(normalize(chosen.text).includes(normalize(selectedText)),
    'scientific anchor answer text unexpected '+id+' '+chosen.text);
 }
 const id=(topic,n)=>'g11-u04-master-t'+topic+'-q'+String(n).padStart(3,'0');
 // Independent conceptual/calculation checks from the stated quantities, not
 // mere comparisons of answer letters to their own source tables.
 eq(15**2/60,3.75); anchor(id(42,57),'A','3.75');
 eq(1200*(15**2/60),4500);anchor(id(42,58),'D','4500');
 eq(856*12**2/7250,17,0.1);anchor(id(42,77),'B','17');
 eq(7250/856,8.47,0.02);anchor(id(42,78),'C','8.5');
 eq((1/3)/(1/12),4);anchor(id(43,39),'A','4');
 anchor(id(43,38),'A','1/3');
 eq((.4**2+.3**2)*6/12,.125);anchor(id(43,70),'B','0.125');
 eq((.4**2+.3**2)*6/3,.5);anchor(id(43,71),'C','0.50');
 anchor(id(44,1),'D','r × p');
 eq(2*(.5**2),.5);anchor(id(44,57),'B','0.50');
 eq(4*2.5,10);anchor(id(44,61),'A','10');
 anchor(id(45,1),'B','Iα');
 eq(6/2,3);anchor(id(45,57),'A','3');
 anchor(id(46,1),'C','zero or nearly zero');
 eq(70*9.8,686);anchor(id(46,57),'B','686');
 anchor(id(47,3),'C','v²/R');
 eq(Math.sqrt(9.8/1500),.0808,.001);anchor(id(47,57),'B','0.081');
 eq(2*Math.PI/Math.sqrt(9.8/1500),77.7,0.2);anchor(id(47,58),'C','77.7');
 eq(90*9.8,882);anchor(id(47,60),'A','882');
 const summary={
  version:67,publishedQuestions:qs.length,untouchedOriginalClassroom:original.length,
  originalCorrectedSourceQuestions:sourceMatched,originalTopics:byTopic,completeScenarioGroups:groups.size,
  scenarioQuestions:qs.filter(q=>q.stimulusSetId).length,
  officialTheorySlos:official.slos.length,
  provisionalMultiCodeTopicQuestions:broadCodes,
  provisionalSingleCodeTopicQuestions:singleCodes,
  sourceKeyDistribution:correctAnswers,
  independentPhysicsSpotCheckCount:19,
  scientificAndItemLevelSloTeacherApproval:'still pending',
  note:'Every source key, SLO candidate code and scenario was structurally checked. Independent scientific spot checks are not exhaustive certification.'
 };
 console.log('PASS V67 Unit4 whole-bank source/SLO integrity:',JSON.stringify(summary,null,2));
}
function iLikeOriginal(q,original){return original.some(o=>o.id===q.id);}
audit().catch(e=>{console.error('FAIL V67 Unit4 quality gate',e);process.exitCode=1});
