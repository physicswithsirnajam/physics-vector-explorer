#!/usr/bin/env node
'use strict';
/**
 * V187 — LOCAL PRIVATE FILE INTAKE, NEVER PUBLIC REPOSITORY OUTPUT.
 * Reads a user-created JSON file containing the exact private candidate
 * revisions and writes ONLY a keyless manifest at an OUTSIDE-REPOSITORY path.
 * No Firebase, internet, teacher authentication, scoring or approval.
 * NOT a parser for the old V179–V184 Word packs: no private item text is
 * invented or silently reconstructed.
 */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {revisionSha256,canonicalCandidate,VERSION:REVISION_DOMAIN}
 =require('./unit07_offline_revision_protocol_v186.cjs');
const ROOT=path.resolve(__dirname,'..');
const INDEX_PATH=path.join(ROOT,'quality/unit07/unit07-v185-first-72-teacher-approval-readiness-only-no-keys.json');
const MAX_INPUT_BYTES=512*1024;
const SHA=/^[a-f0-9]{64}$/;
const INPUT_FIELDS=['schemaVersion','version','unit','candidates'];
const hashBytes=b=>crypto.createHash('sha256').update(b).digest('hex');
function denied(code){throw new Error('V187_DENIED: '+code);}
function fields(value,keys,label){
 if(value===null||typeof value!=='object'||Array.isArray(value))denied(label+'_OBJECT_REQUIRED');
 const got=Object.keys(value).sort();
 if(JSON.stringify(got)!==JSON.stringify([...keys].sort()))denied(label+'_FIELD_MISMATCH');
}
function within(root,candidate){
 const relative=path.relative(root,candidate);
 return relative===''||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative));
}
function safeExternalPaths(inputPath,outputPath){
 if(typeof inputPath!=='string'||typeof outputPath!=='string'||!inputPath||!outputPath)denied('TWO_ABSOLUTE_PATHS_REQUIRED');
 if(!path.isAbsolute(inputPath)||!path.isAbsolute(outputPath))denied('ABSOLUTE_PATHS_REQUIRED');
 if(!inputPath.endsWith('.json')||!outputPath.endsWith('.json'))denied('JSON_EXTENSION_REQUIRED');
 const file=fs.realpathSync(inputPath),parent=fs.realpathSync(path.dirname(outputPath));
 if(within(ROOT,file)||within(ROOT,parent))denied('REPOSITORY_PATH_REJECTED');
 const out=path.join(parent,path.basename(outputPath));
 if(out===file)denied('INPUT_OUTPUT_SAME_FILE');
 if(fs.existsSync(out))denied('OUTPUT_EXISTS_NO_OVERWRITE');
 return {file,out};
}
function validateInput(input){
 fields(input,INPUT_FIELDS,'PRIVATE_INPUT');
 if(input.schemaVersion!==1||input.version!=='V187'||input.unit!==7)denied('INVALID_PRIVATE_INPUT_VERSION');
 if(!Array.isArray(input.candidates)||input.candidates.length<1||input.candidates.length>12)denied('ONE_TO_TWELVE_CANDIDATES_ONLY');
}
function buildKeylessManifest(input,registry,privateInputSha256,sourceIndexSha256){
 validateInput(input);
 if(registry.version!=='V185'||registry.candidateRegistry?.length!==72)denied('SOURCE_INDEX_NOT_V185_72');
 if(!SHA.test(privateInputSha256)||!SHA.test(sourceIndexSha256))denied('INVALID_INPUT_OR_INDEX_HASH');
 const sourceMap=new Map(registry.candidateRegistry.map(r=>[r.sourceId,r]));
 if(sourceMap.size!==72)denied('DUPLICATE_SOURCE_INDEX');
 const rows=[],seen=new Set();
 for(const raw of input.candidates){
  // Exact source/content schema and canonicalization reused from V186.
  let c;
  try{c=canonicalCandidate(raw);}catch(e){denied('CANDIDATE_SCHEMA_OR_CONTENT_INVALID');}
  if(seen.has(c.sourceId))denied('DUPLICATE_PRIVATE_CANDIDATE');
  seen.add(c.sourceId);
  const source=sourceMap.get(c.sourceId);
  if(!source)denied('CANDIDATE_NOT_IN_72_PRIVATE_REVIEW_QUEUE');
  if(source.originalSourceRowSha256!==c.sourceSha256)denied('CANDIDATE_SOURCE_FINGERPRINT_MISMATCH');
  if(source.scoredRelease!=='HOLD'||source.eligibleForStudentScoredUse!==false||
     source.secureAuthenticatedApprovalAvailable!==false||
     source.candidateIndividualRevisionSha256!==null)denied('SOURCE_QUEUE_NOT_PENDING');
  const digest=revisionSha256(c);
  if(!SHA.test(digest))denied('REVISION_DIGEST_INVALID');
  rows.push({
   sourceId:c.sourceId,
   originalSourceRowSha256:c.sourceSha256,
   candidateRevisionSha256:digest,
   candidateSchema:REVISION_DOMAIN,
   priorPrivateReviewBatch:source.priorPrivatePackVersion,
   sourceException:source.sourceException,
   sourceEvidenceClearance:'NOT_ATTESTED',
   candidateScienceVerified:false,
   candidateCognitiveVerified:false,
   independentTeacherScienceApproval:'PENDING',
   independentTeacherCognitiveApproval:'PENDING',
   independentOwnerScoringAuthorization:'PENDING',
   secureAuthAndAppCheckVerified:false,
   eligibleForScoredTestBuilder:false,
   scoredRelease:'HOLD'
  });
 }
 rows.sort((a,b)=>a.sourceId.localeCompare(b.sourceId,'en'));
 return {
  schemaVersion:1,version:'V187',
  status:'LOCAL_PRIVATE_KEYLESS_MANIFEST_ONLY_NOT_ACADEMIC_APPROVAL',
  originalSourceIndexVersion:'V185',
  originalSourceIndexSha256:sourceIndexSha256,
  privateInputBytesSha256:privateInputSha256,
  candidateCount:rows.length,
  sourceUniverseCount:72,
  sourceOriginalUnit7Count:274,
  teacherScienceApprovals:0,teacherCognitiveApprovals:0,
  ownerScoredReleaseApprovals:0,studentScoredReleaseCount:0,
  noFirebaseAccess:true,noLiveImport:true,
  rows
 };
}
function runLocal(inputPath,outputPath){
 const {file,out}=safeExternalPaths(inputPath,outputPath);
 const stat=fs.statSync(file);
 if(!stat.isFile()||stat.size===0||stat.size>MAX_INPUT_BYTES)denied('PRIVATE_INPUT_SIZE_OR_TYPE');
 // Limit bytes before JSON parse and never log raw content on failure.
 const bytes=fs.readFileSync(file);
 if(bytes.length>MAX_INPUT_BYTES)denied('INPUT_EXCEEDS_LIMIT');
 let parsed;
 try{parsed=JSON.parse(bytes.toString('utf8'));}catch(e){denied('INVALID_PRIVATE_JSON');}
 const registryBytes=fs.readFileSync(INDEX_PATH);
 const registry=JSON.parse(registryBytes.toString('utf8'));
 const manifest=buildKeylessManifest(parsed,registry,hashBytes(bytes),hashBytes(registryBytes));
 // Manifest still contains derived private-content hashes; keep outside repo.
 fs.writeFileSync(out,JSON.stringify(manifest,null,2)+'\n',{flag:'wx',mode:0o600});
 return {candidateCount:manifest.candidateCount,status:manifest.status};
}
if(require.main===module){
 try{
  if(process.argv.length!==4)denied('TWO_ABSOLUTE_PATHS_REQUIRED');
  const result=runLocal(process.argv[2],process.argv[3]);
  console.log('V187 LOCAL PASS: '+result.candidateCount+' item digest(s), keyless output OUTSIDE repo, review and score HOLD.');
 }catch(err){
  // IMPORTANT: no raw exception, original answer, filename or candidate content.
  console.error('V187 LOCAL DENIED: private item manifest not written. Check the V187 local-only guide.');
  process.exitCode=1;
 }
}
module.exports={buildKeylessManifest,runLocal,safeExternalPaths,validateInput};
