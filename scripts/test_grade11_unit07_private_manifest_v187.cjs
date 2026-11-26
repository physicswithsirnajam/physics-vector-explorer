#!/usr/bin/env node
'use strict';
/**
 * Invented private input strings only. Test the local V187 keyless export
 * against exact PUBLIC original source-row hashes, never real keyed questions.
 * Synthetic digest does NOT populate the real V185/72 approval index.
 */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const os=require('node:os'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const {buildKeylessManifest,runLocal,safeExternalPaths}
 =require('./unit07_private_candidate_manifest_v187.cjs');
const {revisionSha256}=require('./unit07_offline_revision_protocol_v186.cjs');
const ROOT=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const indexBytes=Buffer.from(read('quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json'),'utf8');
const registry=JSON.parse(indexBytes.toString('utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sourceIndexSha=sha(indexBytes);
const first=registry.candidateRegistry[0],second=registry.candidateRegistry[1];
const secret='SYNTHETIC_CANARY_QTEXT_NOT_AN_ACTUAL_SOURCE_984651';
const synth=x=>({
 sourceId:x.sourceId,sourceSha256:x.originalSourceRowSha256,
 stem:'INVENTED SYNTHETIC ONLY: '+secret+' Which answer is set by this fixture?',
 options:{A:'Invented alpha response',B:'Invented beta response',
  C:'Invented gamma response',D:'Invented delta response'},
 correctOption:'A',
 explanation:'This is a synthetic fixture and not a published scientific answer.',
 slo:'P-11-B-22',cognitive:'K',diagram:null
});
const input={schemaVersion:1,version:'V187',unit:7,candidates:[synth(first),synth(second)]};
const raw=Buffer.from(JSON.stringify(input,null,2),'utf8');
const m=buildKeylessManifest(input,registry,sha(raw),sourceIndexSha);
A.equal(m.version,'V187');
A.equal(m.status,'LOCAL_PRIVATE_KEYLESS_MANIFEST_ONLY_NOT_ACADEMIC_APPROVAL');
A.equal(m.candidateCount,2);A.equal(m.rows.length,2);
A.equal(m.originalSourceIndexSha256,sourceIndexSha);
A.equal(m.privateInputBytesSha256,sha(raw));
A.equal(m.studentScoredReleaseCount,0);A.equal(m.noFirebaseAccess,true);
const mText=JSON.stringify(m);
A.equal(mText.includes(secret),false);
A.equal(mText.includes('Invented alpha response'),false);
A.equal(mText.includes('correctOption'),false);
A.equal(mText.includes('explanation'),false);
A.equal(mText.includes('stem'),false);
for(const r of m.rows){
 A.equal(r.candidateSchema,'PWSN-U07-CANDIDATE-V1');
 A.match(r.candidateRevisionSha256,/^[0-9a-f]{64}$/);
 const original=input.candidates.find(x=>x.sourceId===r.sourceId);
 A.equal(r.candidateRevisionSha256,revisionSha256(original));
 A.equal(r.originalSourceRowSha256,original.sourceSha256);
 A.equal(r.sourceEvidenceClearance,'NOT_ATTESTED');
 A.equal(r.candidateScienceVerified,false);
 A.equal(r.candidateCognitiveVerified,false);
 A.equal(r.independentTeacherScienceApproval,'PENDING');
 A.equal(r.independentTeacherCognitiveApproval,'PENDING');
 A.equal(r.independentOwnerScoringAuthorization,'PENDING');
 A.equal(r.secureAuthAndAppCheckVerified,false);
 A.equal(r.eligibleForScoredTestBuilder,false);
 A.equal(r.scoredRelease,'HOLD');
}
const changed=structuredClone(input);
changed.candidates[0].options.B='An independently changed synthetic answer choice';
const changedText=Buffer.from(JSON.stringify(changed),'utf8');
const updated=buildKeylessManifest(changed,registry,sha(changedText),sourceIndexSha);
A.notEqual(updated.rows.find(x=>x.sourceId===first.sourceId).candidateRevisionSha256,
 m.rows.find(x=>x.sourceId===first.sourceId).candidateRevisionSha256);
A.equal(updated.rows.find(x=>x.sourceId===first.sourceId).eligibleForScoredTestBuilder,false);
A.equal(updated.rows.find(x=>x.sourceId===first.sourceId).scoredRelease,'HOLD');
let denied=0;
function negative(value,reg=registry){
 A.throws(()=>buildKeylessManifest(value,reg,sha(raw),sourceIndexSha),/V187_DENIED|V186_DENIED/);
 denied++;
}
negative({...input,unit:6});
negative({...input,version:'V185'});
negative({...input,developerRole:'owner'});
negative({...input,candidates:[]});
negative({...input,candidates:Array.from({length:13},()=>synth(first))});
negative({...input,candidates:[synth(first),synth(first)]});
negative({...input,candidates:[{...synth(first),sourceId:'XI-U07-T071-Q079'}]});
negative({...input,candidates:[{...synth(first),sourceSha256:'0'.repeat(64)}]});
negative({...input,candidates:[{...synth(first),answerKey:'A'}]});
negative({...input,candidates:[{...synth(first),correctOption:'E'}]});
negative({...input,candidates:[{...synth(first),options:{A:'same',B:'same',C:'c',D:'d'}}]});
negative({...input,candidates:[{...synth(first),slo:'P-11-B-99'}]});
negative({...input,candidates:[{...synth(first),diagram:{contentSha256:'4'.repeat(64),
 altText:'Synthetic example diagram',permissionEvidenceSha256:'BAD'}}]});
negative(input,{version:'V185',candidateRegistry:[]});
negative(input,{...registry,candidateRegistry:registry.candidateRegistry.slice(0,71)});
negative(input,{...registry,candidateRegistry:[...registry.candidateRegistry.slice(0,71),registry.candidateRegistry[0]]});
negative(input,{...registry,candidateRegistry:registry.candidateRegistry.map((x,i)=>
 i===0?{...x,scoredRelease:'RELEASED'}:x)});
negative(input,{...registry,candidateRegistry:registry.candidateRegistry.map((x,i)=>
 i===0?{...x,candidateIndividualRevisionSha256:'3'.repeat(64)}:x)});
negative(input,{...registry,candidateRegistry:registry.candidateRegistry.map((x,i)=>
 i===0?{...x,eligibleForStudentScoredUse:true}:x)});
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'pwsn-v187-private-'));
try{
 const inFile=path.join(dir,'private-synthetic-input.json');
 const outFile=path.join(dir,'keyless-private-manifest.json');
 fs.writeFileSync(inFile,raw,{mode:0o600});
 A.deepEqual(safeExternalPaths(inFile,outFile),{file:fs.realpathSync(inFile),out:outFile});
 const result=runLocal(inFile,outFile);
 A.equal(result.candidateCount,2);
 A.equal(result.status,'LOCAL_PRIVATE_KEYLESS_MANIFEST_ONLY_NOT_ACADEMIC_APPROVAL');
 const privateOut=JSON.parse(fs.readFileSync(outFile,'utf8'));
 A.equal(privateOut.candidateCount,2);
 A.equal(JSON.stringify(privateOut).includes(secret),false);
 if(process.platform!=='win32')A.equal(fs.statSync(outFile).mode&0o777,0o600);
 A.throws(()=>runLocal(inFile,outFile),/V187_DENIED: OUTPUT_EXISTS/);denied++;
 A.throws(()=>safeExternalPaths(path.join(ROOT,'quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json'),
  path.join(dir,'should-never-create.json')),/V187_DENIED: REPOSITORY_PATH_REJECTED/);denied++;
 A.throws(()=>safeExternalPaths(inFile,path.join(ROOT,'manifest-leak.json')),
  /V187_DENIED: REPOSITORY_PATH_REJECTED/);denied++;
 A.throws(()=>safeExternalPaths('private-relative.json',outFile),/V187_DENIED/);denied++;
 const noArgs=spawnSync(process.execPath,[path.join(ROOT,'scripts/unit07_private_candidate_manifest_v187.cjs')],
  {encoding:'utf8',cwd:ROOT});
 A.notEqual(noArgs.status,0);A.equal(noArgs.stdout.includes(secret),false);
 A.equal(noArgs.stderr.includes(secret),false);
 denied++;
 const privateBad=path.join(dir,'invalid-private.json');
 fs.writeFileSync(privateBad,'{ this is not JSON',{mode:0o600});
 A.throws(()=>runLocal(privateBad,path.join(dir,'bad-output.json')),/V187_DENIED: INVALID_PRIVATE_JSON/);denied++;
}finally{
 fs.rmSync(dir,{recursive:true,force:true});
}
// Original 72 real review items remain unapproved without any per-item hashes
// imported by this synthetic test, and the live Question Bank is absent.
A.equal(registry.candidateRegistry.length,72);
A.equal(registry.individualCandidateImmutableRevisionDigestsVerified,0);
A.equal(registry.individualTeacherScienceApprovals,0);
A.equal(registry.individualTeacherCognitiveApprovals,0);
A.equal(registry.individualTeacherScoringApprovals,0);
A.equal(registry.studentScoredUnit7Items,0);
for(const x of registry.candidateRegistry){
 A.equal(x.candidateIndividualRevisionSha256,null);
 A.equal(x.secureAuthenticatedApprovalAvailable,false);
 A.equal(x.eligibleForStudentScoredUse,false);
 A.equal(x.scoredRelease,'HOLD');
}
const v186=JSON.parse(read('quality/unit07/unit07-v186-offline-protocol-design-no-deploy.json'));
const v160=JSON.parse(read('quality/unit07/topic71-v160-production-readiness-no-go.json'));
const v161=JSON.parse(read('quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json'));
A.equal(v186.status,'LOCAL_SYNTHETIC_TEST_PROTOCOL_ONLY');
A.equal(v160.decision,'NO_GO_DEPLOYMENT_BLOCKED');
A.equal(v161.decision,'NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT');
const contract=JSON.parse(read('quality/unit07/unit07-v187-local-private-manifest-contract-no-deploy.json'));
A.equal(contract.version,'V187');
A.equal(contract.realState.actualPrivateCandidateManifestsProcessed,0);
A.equal(contract.realState.individualActualPrivateRevisionDigestsPersisted,0);
A.equal(contract.realState.actualTeacherScienceApprovals,0);
A.equal(contract.realState.actualTeacherCognitiveApprovals,0);
A.equal(contract.realState.actualOwnerScoringApprovals,0);
A.equal(contract.realState.studentScoredUnit7Releases,0);
for(const key of ['liveFirebaseModified','deployedBackendCreated','productionOrStagingTeacherRolesChanged',
 'originalOrCandidateQuestionTextCommitted','privateManifestCommitted','liveQuestionBankModified'])
 A.equal(contract[key],false);
const guide=read('quality/grade11-v187-unit07-local-private-manifest-review-qc.md').toLowerCase();
for(const x of ['v187','72','274','private','manifest','source','candidate','hash',
 'never upload','pending','hold','no-go','teacher','app check','firebase','v188'])
 A.ok(guide.includes(x),'V187 guide missing: '+x);
const qa=path.join(ROOT,'qa-artifacts/grade11-v187-private-manifest-synthetic');
fs.mkdirSync(qa,{recursive:true});
fs.writeFileSync(path.join(qa,'summary.json'),JSON.stringify({
 version:'V187',syntheticOnly:true,syntheticLocalManifestItems:2,
 sourceQueueItems:72,actualOriginalUnit7Items:274,
 actualCandidateRevisionDigestsImported:0,actualTeacherApprovals:0,
 studentScoredReleases:0,negativeChecks:denied,
 stagingOrProductionModified:false
},null,2)+'\n');
console.log('V187 PASS: synthetic local-only private manifest, '+denied+
 ' negative tests, 72 actual original-source candidate records still HOLD and no scored releases.');
