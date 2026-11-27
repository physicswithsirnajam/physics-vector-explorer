#!/usr/bin/env node
'use strict';
/* V207 — independent, network-free regression for reported Unit 2 Q119. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const bank=JSON.parse(fs.readFileSync(path.join(root,'question-bank/grade-11/unit-02.json'),'utf8'));
const raw=bank.questions.find(q=>q.id==='XI-U02-MCQ-0119');
const previous=bank.questions.find(q=>q.id==='XI-U02-MCQ-0116');

assert.equal(raw.stem,'The scalar projection of A on B for Q116 is:');
assert.equal(raw.correctOptionId,'A');
assert.equal(raw.options.find(o=>o.id==='A').text,'14/√20');
assert.equal(raw.stimulusText,undefined,'original source JSON remains unchanged');
assert.match(previous.stem,/5î \+ ĵ/);
assert.match(previous.stem,/2î \+ 4ĵ/);

const seenPaths=[];
const sandbox={
  console,
  fetch:async (url)=>{
    seenPaths.push(url);
    if(url!=='question-bank/grade-11/unit-02.json')
      throw Error('unexpected external or other bank URL: '+url);
    return {ok:true,json:async()=>bank};
  }
};
sandbox.window=sandbox;
vm.runInNewContext(fs.readFileSync(path.join(root,'shared/practice-bank-adapter-v55.js'),'utf8'),sandbox,{filename:'practice-bank-adapter-v55.js'});
const adapter=sandbox.PSNPracticeBankV55;
assert.ok(adapter&&typeof adapter.loadBank==='function');

(async ()=>{
  const loaded=await adapter.loadBank(2,'question-bank/grade-11/');
  assert.deepEqual(seenPaths,['question-bank/grade-11/unit-02.json']);
  assert.equal(loaded.bankVersion,bank.bankVersion);
  assert.equal(loaded.questions.length,206);
  assert.equal(loaded.questions.filter(q=>q.stimulusSetId).length,60);
  const q=loaded.questions.find(q=>q.id==='XI-U02-MCQ-0119');
  assert.ok(q);
  assert.equal(q.contextSourceQuestionNumber,116);
  assert.equal(q.presentationContextRevision,'v207-unit2-q119-standalone');
  assert.ok(q.stimulusHtml.includes('A = (5, 1)')&&q.stimulusHtml.includes('B = (2, 4)'));
  assert.ok(q.stimulusText.includes('perpendicular unit axes'));
  assert.doesNotMatch(q.stem,/Q116/i,'student stem no longer relies on unseen question');
  assert.equal(q.correctOptionId,raw.correctOptionId);
  assert.equal(JSON.stringify(q.options),JSON.stringify(raw.options));
  assert.equal(q.explanation,raw.explanation);
  assert.equal(q.stimulusSetId,null,'not a fabricated shared-stimulus scenario');
  assert.ok(Math.abs(14/Math.hypot(2,4)-14/Math.sqrt(20))<1e-12);
  for(const n of [4,13,15,153]){
    const other=loaded.questions.find(z=>z.id==='XI-U02-MCQ-'+String(n).padStart(4,'0'));
    assert.ok(other.stimulusHtml&&other.contextSourceQuestionNumber,'previous companion context '+n+' retained');
  }
  const rawAgain=bank.questions.find(z=>z.id===q.id);
  assert.equal(rawAgain.stem,'The scalar projection of A on B for Q116 is:','source question unedited');
  assert.equal(rawAgain.stimulusText,undefined,'overlay is not written back to the pinned bank');
  console.log('V207 PASS: Q119 standalone context visible, scalar projection correct, 206 source identities and 15 original 4-item scenario groups untouched.');
})().catch(e=>{console.error(e);process.exitCode=1;});
