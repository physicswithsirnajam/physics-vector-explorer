#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const {
 BASELINE_SHA,REQUIRED_LINES,normalizeRules,digest,compareSnapshots
}=require('./compare_grade11_published_rules_snapshot_v99t.cjs');
const SCRIPT=path.resolve(__dirname,'compare_grade11_published_rules_snapshot_v99t.cjs');
let n=0;
function pass(label){n++;console.log('V99-T SELFTEST PASS:',label);}
const synthetic=[
 "rules_version = '2';",
 "service cloud.firestore {",
 "  match /databases/{database}/documents {",
 "    match /synthetic/{id} { allow read, write: if false; }",
 "  }",
 "}"
].join('\n')+'\n';
function spawnCheck(extra){
 return spawnSync(process.execPath,[SCRIPT],{
  encoding:'utf8',
  env:{
   PATH:process.env.PATH||'',
   ...extra
  }
 });
}
function noLeaks(output,strings){
 for(const s of strings){
  assert.ok(!output.includes(s),'Secret text may never escape into test logs');
 }
}
assert.equal(BASELINE_SHA,'c3d5ee6286b006510fd793cd18467493f2e7eccf3f17437182bcb0fd9d43ec39');
assert.equal(REQUIRED_LINES,227);
pass('pinned owner-supplied baseline fingerprint and line count remain exact');
assert.equal(normalizeRules('\uFEFF'+synthetic.replace(/\n/g,'\r\n')+'\r\n'),synthetic);
assert.equal(normalizeRules(synthetic.replace(/\n/g,'\r')),synthetic);
assert.equal(normalizeRules(synthetic+'\n\n'),synthetic);
pass('BOM, Windows CRLF, classic Mac CR, and harmless trailing blank lines normalize reproducibly');
const same=compareSnapshots(synthetic,'\uFEFF'+synthetic.replace(/\n/g,'\r\n'),
 {requirePinnedBaseline:false});
assert.equal(same.exactNormalizedMatch,true);
assert.equal(same.baselineMatchesPinned,false);
assert.equal(same.pinnedBaselineLines,6);
pass('identical private mock rules match in both normal and Windows line-ending forms');
const changed=synthetic.replace('false','true');
const different=compareSnapshots(synthetic,changed,{requirePinnedBaseline:false});
assert.equal(different.exactNormalizedMatch,false);
assert.notEqual(digest(synthetic),digest(changed));
pass('a one-word grant-permission change fails exact normalized equality');
assert.throws(()=>compareSnapshots(synthetic,synthetic),/baseline/);
assert.throws(()=>normalizeRules(''),TypeError);
assert.throws(()=>normalizeRules('X'.repeat(160_001)),TypeError);
assert.throws(()=>normalizeRules({rules:synthetic}),TypeError);
pass('actual published snapshot gate refuses nonpinned, blank, oversized and non-text inputs');
const missing=spawnCheck({});
assert.equal(missing.status,1);
assert.match(missing.stderr,/both private Rules secrets are required/);
assert.ok(!missing.stdout.includes('PASS'));
pass('CLI fails closed when the new private Console snapshot secret has not been provided');
const leakedMarker='PRIVATE_DO_NOT_DISPLAY_source_7143';
const bad=spawnCheck({
 PSN_FIRESTORE_BASELINE_RULES:synthetic+leakedMarker,
 PSN_FIRESTORE_PUBLISHED_RULES_SNAPSHOT:synthetic+leakedMarker
});
assert.equal(bad.status,1);
noLeaks(bad.stdout+bad.stderr,[leakedMarker,synthetic]);
assert.match(bad.stderr,/owner baseline changed/);
pass('CLI never prints secret input or private rules even when supplied baseline fingerprint is incorrect');
console.log('V99-T SELFTEST FINISHED: '+n+' checks. Full Console-snapshot attestation is separately gated by two GitHub Actions secrets.');
