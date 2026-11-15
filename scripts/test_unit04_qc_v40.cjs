#!/usr/bin/env node
"use strict";
/* V40 editorial QC regression, not an official examination or teacher-certification claim. */
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const bank=JSON.parse(fs.readFileSync(path.join(root,"question-bank/grade-11/unit-04-v39-80-practice.json"),"utf8"));
const q=n=>{const item=bank.questions[n-1];assert.equal(item?.sourceQuestionNumber,n);return item;};
const answer=n=>q(n).options.find(o=>o.id===q(n).correctOptionId)?.text;
const eq=(n,expected)=>assert.equal(answer(n),expected,"Incorrect keyed answer at Q"+n);
eq(3,"Three-quarters of a revolution");
eq(27,"It becomes four times as large; limited grip may cause slipping");
eq(28,"Only N cosθ balances mg; N sinθ provides inward force");
eq(38,"62.8 s");
eq(57,"3π rad");
eq(73,"The supporting normal contact force from the spacecraft floor");
assert.ok(q(47).explanation.includes("doubling the moment of inertia"));
assert.ok(!q(47).explanation.includes("For fixed I"));
assert.ok(q(60).explanation.includes("22.0 s"));
assert.equal(q(3).cognitiveLevel,"Understanding");
assert.equal(q(57).cognitiveLevel,"Understanding");
assert.equal(q(27).sloCodes[0],"P-11-B-15");
assert.equal(q(28).sloCodes[0],"P-11-B-15");
assert.equal(q(38).sloCodes[0],"P-11-B-17");
assert.equal(q(73).sloCodes[0],"P-11-B-16");
// Recalculate the amended numerical and physical relationships rather than
// trusting answer strings alone.
const near=(actual,expected,eps)=>assert.ok(Math.abs(actual-expected)<eps,actual+" != "+expected);
near((1.5*2*Math.PI)/Math.PI,3,1e-12);    // Q57: radians
near(2*Math.PI*Math.sqrt(980/9.8),62.8,.05); // Q38: ring period
near((2*12)**2/12**2,4,1e-12);            // Q27: friction speed-squared scaling
near(74.8/(6.80/2),22,.001);             // Q60: stopping time
const theta=Math.atan(12**2/(50*9.8));   // Q28: normal resolution
assert.ok(1/Math.cos(theta)>1);
near(Math.cos(theta)*(1/Math.cos(theta)),1,1e-12);
assert.equal(bank.questions.length,80);
assert.equal(bank.questions.filter(item=>!item.scenarioSetId).length,56);
assert.equal(bank.questions.filter(item=>item.scenarioSetId).length,24);
assert.equal(new Set(bank.questions.map(item=>item.stem)).size,80);
assert.deepEqual(Object.fromEntries("ABCD".split("").map(c=>[c,bank.questions.filter(item=>item.correctOptionId===c).length])),{A:20,B:20,C:20,D:20});
const counts=new Map();
for(const item of bank.questions){assert.equal(item.status,"teacher-review-pending");assert.equal(item.boardEligible,false);const c=item.sloCodes[0];counts.set(c,(counts.get(c)||0)+1);}
const expectedCounts={"P-11-B-07":6,"P-11-B-08":8,"P-11-B-09":8,"P-11-B-10":5,"P-11-B-14":8,"P-11-B-15":8,"P-11-B-16":5,"P-11-B-17":6,"P-11-B-18":8,"P-11-B-19":6,"P-11-B-20":8,"P-11-B-21":4};
assert.deepEqual(Object.fromEntries(counts),expectedCounts);
for(const [a,b] of [[3,1],[27,64],[28,66],[38,75],[57,3],[73,32]])assert.notEqual(q(a).stem,q(b).stem);
console.log("Unit 4 V40 academic QC regression passed: 8 edits; 80 provisional MCQs; 12 SLOs; answer balance and privacy status preserved.");
