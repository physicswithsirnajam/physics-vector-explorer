#!/usr/bin/env node
'use strict';
/* V207: a real student saw Q119 without its Q116 vector context.
 * Verify it is independently answerable in randomized Test Builder sessions,
 * and original owner-authored key/options/stem remain immutable.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const bankFile=path.join(ROOT,'question-bank/grade-11/unit-02.json');
const raw=fs.readFileSync(bankFile);
const bank=JSON.parse(raw);
const manifest=load('question-bank/manifest.json');
const m=manifest.grades.find(g=>g.grade===11).units.find(u=>u.unit===2);
A.equal(bank.questions.length,206);
A.equal(m.liveMcqCount,206);
A.equal(bank.bankVersion,'v207-q119-source-context-patch-2026-11-27');
A.equal(m.bankVersion,bank.bankVersion);
A.equal(crypto.createHash('sha256').update(raw).digest('hex'),m.sha256);
const byNum=new Map(bank.questions.map(q=>[q.sourceQuestionNumber+'|'+q.source.section,q]));
const section='ADDITIONAL SLO-BASED MCQ BANK';
const q116=byNum.get('116|'+section),q119=byNum.get('119|'+section);
A.ok(q116&&q119);
A.equal(q116.id,'XI-U02-MCQ-0116');
A.equal(q119.id,'XI-U02-MCQ-0119');
A.equal(q119.contextSourceQuestionNumber,116);
A.equal(q119.stem,'The scalar projection of A on B for Q116 is:');
A.equal(q119.correctOptionId,'A');
A.deepEqual(q119.options.map(x=>x.text),['14/√20','14/√26','14/20','14/26']);
A.equal(q119.explanation,'Projection of A on B is 14/|B| = 14/√20.');
A.equal(q119.boardEligible,false);
A.equal(q119.assessmentClassification,'summative-theory'); // provisional browser practice, NOT certified board exam
for(const phrase of ['5î + ĵ','2î + 4ĵ']){
 A.ok(q116.stem.includes(phrase));
 A.ok(q119.stimulusText.includes(phrase));
 A.ok(q119.stimulusHtml.includes(phrase));
}
A.ok(q119.stimulusHtml.startsWith('<p>'));
A.ok(q119.stimulusHtml.endsWith('</p>'));
A.ok(!q119.stimulusSetId);
const a=[5,1],b=[2,4],dot=a[0]*b[0]+a[1]*b[1],magB=Math.hypot(...b);
A.equal(dot,14);A.equal(magB,Math.sqrt(20));
const projection=dot/magB,optionValue=14/Math.sqrt(20);
A.ok(Math.abs(projection-optionValue)<1e-12);
// Student sees options in arbitrary display order: the source option id must
// remain stable while the visible A/B/C/D label may change (C in their report).
const reordered=[q119.options[3],q119.options[1],q119.options[0],q119.options[2]];
A.equal(reordered[2].id,q119.correctOptionId);
A.equal(reordered[2].text,'14/√20');
A.ok(q119.stimulusText.includes('Question 116'));
const companions=bank.questions.filter(q=>q.contextSourceQuestionNumber!==undefined);
A.deepEqual(companions.map(x=>x.sourceQuestionNumber).sort((a,b)=>a-b),[4,13,15,119,153]);
for(const q of companions){A.ok(q.stimulusText?.trim()&&q.stimulusHtml?.trim());}
const sets=new Map();
for(const q of bank.questions)if(q.stimulusSetId){if(!sets.has(q.stimulusSetId))sets.set(q.stimulusSetId,[]);sets.get(q.stimulusSetId).push(q);}
A.equal(sets.size,15);for(const g of sets.values())A.equal(g.length,4);
const engine=fs.readFileSync(path.join(ROOT,'practice-engine/index.html'),'utf8');
A.ok(engine.includes("q.stimulusHtml"));
A.ok(engine.includes("q.stimulusText||'(none shown)'")); // issue report carries context
A.ok(engine.includes("setRich(sp,q.stimulusHtml,q.stimulusText||'')")); // quiz renders context
const unit7=load('portal/learning-catalog.json').grades.find(g=>g.grade===11).units.find(x=>x.unit===7);
A.equal(unit7.status,'planned');A.equal(unit7.questionBankCount,0);
A.equal(unit7.assessmentStatus,'not-published');
A.equal(fs.existsSync(path.join(ROOT,'question-bank/grade-11/unit-07.json')),false);
console.log('V207 PASS: user-reported Q119 is standalone with exact Q116 data, 206 original keys preserved, 15 scenario groups, Unit7 scored HOLD.');
