#!/usr/bin/env node
'use strict';
/* V99-H: offline, source-preserving determinism and tamper regression tests. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {buildManifest,serialize,OUTPUT}=
 require('./build_grade11_static_review_manifest_v99h.cjs');
const {validateStaticManifest,EXPECTED,TOTAL}=
 require('../server/static-review-catalog-v99h.cjs');
const {loadApprovedCatalog}=
 require('../server/approved-practice-catalog-v99g.cjs');

function copy(obj){return JSON.parse(JSON.stringify(obj));}
function mustReject(manifest,description){
 assert.throws(()=>validateStaticManifest(manifest),Error,description);
}
async function main(){
 const one=await buildManifest(),two=await buildManifest();
 assert.equal(serialize(one),serialize(two),'separate original-source builds must be byte-for-byte deterministic');
 assert.equal(one.questionRefs.length,TOTAL);
 assert.deepEqual(one.unitCounts,EXPECTED);
 const parsed=JSON.parse(serialize(one));
 const staticBank=validateStaticManifest(parsed),sourceBank=await loadApprovedCatalog();
 assert.equal(staticBank.total,2250);
 assert.equal(staticBank.contentSha256,one.contentSha256);
 assert.equal(staticBank.ids().length,2250);
 const sourceIds=new Set(sourceBank.ids());
 assert.equal(sourceIds.size,2250);
 for(const id of staticBank.ids()){
  assert.equal(sourceIds.has(id),true,'no original question may be invented');
  assert.deepEqual(await staticBank.lookup(id),await sourceBank.lookup(id),
   'static lookup must exactly match original ID/unit/number/bank version');
 }
 assert.equal(await staticBank.lookup('XI-U06-UNKNOWN-9999'),null);
 assert.equal(await staticBank.lookup(null),null);
 console.log('V99-H PASS: deterministic hash and exact lookup equivalence across all 2250 public source IDs');
 for(const id of ['U05B-MCQ-01','g11-u03-master-t33-q001','g11-u05-master-t51-q001']){
  assert.ok(await staticBank.lookup(id),'original Set B and lower-case master IDs must remain valid: '+id);
 }
 console.log('V99-H PASS: original Unit 5 Set B and Unit 3/5 master IDs are retained');

 const extra=copy(one);extra.correctOptionId='A';
 mustReject(extra,'reject a top-level answer-key leak');
 const extraRow=copy(one);extraRow.questionRefs[0].push('correct-answer');
 mustReject(extraRow,'reject extra per-question data');
 const missing=copy(one);missing.questionRefs.pop();
 mustReject(missing,'reject incomplete source-bank manifest');
 const duplicate=copy(one);duplicate.questionRefs[1]=[...duplicate.questionRefs[0]];
 mustReject(duplicate,'reject duplicate MCQ ID');
 const altered=copy(one);altered.questionRefs[0][2]=4999;
 mustReject(altered,'reject content changed after checksum creation');
 const wrongUnit=copy(one);wrongUnit.questionRefs[0][1]=6;
 mustReject(wrongUnit,'reject unit mismatch');
 const badCounts=copy(one);badCounts.unitCounts[1]=274;
 mustReject(badCounts,'reject per-unit count mismatch');
 const wrongVersion=copy(one);wrongVersion.bankVersions[5]='';
 mustReject(wrongVersion,'reject missing bank version');
 const shuffled=copy(one);
 [shuffled.questionRefs[0],shuffled.questionRefs[1]]=[shuffled.questionRefs[1],shuffled.questionRefs[0]];
 mustReject(shuffled,'reject noncanonical order');
 console.log('V99-H PASS: rejects extra fields, answers, missing/duplicate IDs, wrong units, count and version drift, reordered/tampered content');

 // Evidence file contains PUBLIC reference metadata only, no answers/stems.
 fs.mkdirSync(require('node:path').dirname(OUTPUT),{recursive:true});
 fs.writeFileSync(OUTPUT,serialize(one),'utf8');
 const onDisk=fs.readFileSync(OUTPUT,'utf8');
 assert.equal(onDisk,serialize(one));
 assert.deepEqual(Object.keys(JSON.parse(onDisk)),[
  'schemaVersion','kind','grade','publicPracticeOnly','unitCounts',
  'bankVersions','questionRefs','contentSha256'
 ]);
 console.log('V99-H PASS: approved-public-review-refs.json generated for manual review, NOT deployed');
}
main().catch(error=>{console.error('V99-H FAILED:',error);process.exitCode=1;});
