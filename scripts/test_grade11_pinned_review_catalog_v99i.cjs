#!/usr/bin/env node
'use strict';
/* V99-I: locked-source manifest parity, integrity and static-only loading. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {validateStaticManifest,EXPECTED,TOTAL}=
 require('../server/static-review-catalog-v99h.cjs');

const file=path.join(__dirname,
 '../server/review-manifests/grade11-approved-public-review-refs-v99i.json');

function formatManifest(manifest){
 // Preserve exact JSON data, but give the reviewer one original MCQ per line.
 const head=JSON.stringify({...manifest,questionRefs:[]},null,2);
 const marker='  "questionRefs": [],';
 if(!head.includes(marker))throw Error('Manifest layout unexpectedly changed');
 const rows=manifest.questionRefs.map((row,i)=>
  '    '+JSON.stringify(row)+(i<manifest.questionRefs.length-1?',':'')
 ).join('\n');
 return head.replace(marker,'  "questionRefs": [\n'+rows+'\n  ],')+'\n';
}

async function main(){
 const raw=fs.readFileSync(file,'utf8');
 const frozen=JSON.parse(raw);
 // Load only pinned metadata FIRST; reject accidental browser-source/VM import.
 const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');
 const staticModuleCache=Object.keys(require.cache);
 assert.ok(!staticModuleCache.some(p=>p.includes('approved-practice-catalog-v99g')||
   p.includes('practice-bank-adapter-v55')),
   'static runtime must not load a browser bank adapter');
 assert.ok(!staticModuleCache.some(p=>p.includes('firebase-admin')||
   p.includes('firebase/')),'static runtime must not initialize Firebase');
 assert.equal(catalog.total,TOTAL);
 assert.deepEqual(catalog.counts,EXPECTED);
 assert.equal(catalog.contentSha256,frozen.contentSha256);
 const checked=validateStaticManifest(frozen);
 assert.equal(checked.ids().length,2250);
 assert.equal(new Set(checked.ids()).size,2250);
 assert.deepEqual(catalog.ids(),checked.ids());

 const names=['U05B-MCQ-01','g11-u03-master-t33-q001',
  'g11-u04-master-t41-q001','g11-u05-master-t51-q001'];
 for(const id of names)
  assert.ok(await catalog.lookup(id),'original approved source ID omitted: '+id);
 assert.equal(await catalog.lookup('XI-U06-UNKNOWN-9999'),null);
 console.log('V99-I PASS: pinned runtime is static-only; original Set B and master IDs preserved');

 // Import the reviewed dynamic reader ONLY in this offline CI test to prove
 // byte-for-byte regeneration parity. Never import this in the server loader.
 const {buildManifest}=
  require('./build_grade11_static_review_manifest_v99h.cjs');
 const regenerated=await buildManifest();
 assert.equal(raw,formatManifest(regenerated),
  'committed snapshot differs from the current original V55 public MCQ bank');
 assert.equal(frozen.contentSha256,regenerated.contentSha256,
  'bank version or public question catalog digest changed');
 assert.deepEqual(frozen.unitCounts,EXPECTED);
 const {loadApprovedCatalog}=require('../server/approved-practice-catalog-v99g.cjs');
 const original=await loadApprovedCatalog();
 assert.equal(original.total,2250);
 for(const id of original.ids()){
  const a=await catalog.lookup(id),b=await original.lookup(id);
  assert.deepEqual(a,b,'pinned reference diverged from original ID/version/number: '+id);
 }
 console.log('V99-I PASS: checked-in reviewed JSON is exactly reproducible; all 2250 records match source');

 const clone=()=>JSON.parse(JSON.stringify(frozen));
 const changes=[
  x=>{x.questionRefs[0][2]=4999;},
  x=>{x.questionRefs.pop();},
  x=>{x.questionRefs[1]=[...x.questionRefs[0]];},
  x=>{x.questionRefs[0].push('private-answer');},
  x=>{x.bankVersions[5]='unreviewed';},
  x=>{x.unitCounts[4]=641;},
  x=>{x.questionRefs[0][1]=6;},
  x=>{x.answerKey='D';}
 ];
 for(const mutate of changes){
  const test=clone();mutate(test);
  assert.throws(()=>validateStaticManifest(test),Error,
   'tampered/static metadata or unauthorized answer field must be rejected');
 }
 console.log('V99-I PASS: frozen catalog rejects modifications, missing/duplicate entries and answer leakage');
 console.log('V99-I boundary: NO Firebase access, deployment, student report submission or UI changes');
}
main().catch(e=>{console.error('V99-I FAILED:',e);process.exitCode=1;});
