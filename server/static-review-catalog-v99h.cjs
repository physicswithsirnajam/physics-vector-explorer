'use strict';
/**
 * V99-H: strictly validated, static, metadata-only Grade XI MCQ report index.
 * No Firebase, browser script, user code, network, or Node vm is loaded.
 * A SHA-256 checksum detects accidental changes; it is NOT a signature.
 * Only a reviewed/committed manifest should be trusted by a future service.
 */
const {createHash}=require('node:crypto');
const {buildDraft}=require('../shared/mcq-review-contract-v99a.js');
const EXPECTED=Object.freeze({1:275,2:206,3:220,4:640,5:349,6:560});
const TOTAL=2250;
const KIND='grade11-public-mcq-report-source-refs';
const ROOT_KEYS=['schemaVersion','kind','grade','publicPracticeOnly','unitCounts','bankVersions','questionRefs','contentSha256'];

function exactKeys(value,keys){
 return value!==null&&typeof value==='object'&&!Array.isArray(value)&&
  Object.keys(value).length===keys.length&&keys.every(k=>Object.hasOwn(value,k));
}
function digest(payload){
 return createHash('sha256').update(JSON.stringify(payload),'utf8').digest('hex');
}
function payloadOf(manifest){
 return {
  schemaVersion:manifest.schemaVersion,kind:manifest.kind,grade:manifest.grade,
  publicPracticeOnly:manifest.publicPracticeOnly,unitCounts:manifest.unitCounts,
  bankVersions:manifest.bankVersions,questionRefs:manifest.questionRefs
 };
}
function validateStaticManifest(manifest){
 if(!exactKeys(manifest,ROOT_KEYS))throw Error('Unexpected static review manifest fields');
 if(manifest.schemaVersion!==1||manifest.kind!==KIND||manifest.grade!==11||
    manifest.publicPracticeOnly!==true)throw Error('Unexpected static report catalog scope');
 if(!exactKeys(manifest.unitCounts,['1','2','3','4','5','6'])||
    !exactKeys(manifest.bankVersions,['1','2','3','4','5','6']))
  throw Error('Expected six explicit public Grade XI units');
 for(let unit=1;unit<=6;unit++){
  if(manifest.unitCounts[unit]!==EXPECTED[unit])throw Error('Incorrect unit source count '+unit);
  const version=manifest.bankVersions[unit];
  if(typeof version!=='string'||!version.trim()||version.length>120)
   throw Error('Missing or invalid approved bank version '+unit);
 }
 if(!Array.isArray(manifest.questionRefs)||manifest.questionRefs.length!==TOTAL)
  throw Error('Incomplete 2250-item static report reference catalog');
 const seen=new Set(),counts={1:0,2:0,3:0,4:0,5:0,6:0};
 let prevUnit=0,prevId='';
 for(const row of manifest.questionRefs){
  if(!Array.isArray(row)||row.length!==3)throw Error('Expected ID/unit/source-number only');
  const [id,unit,number]=row;
  if(typeof id!=='string'||seen.has(id)||!Number.isInteger(unit)||unit<1||unit>6)
   throw Error('Duplicate or invalid public question ID');
  if(unit<prevUnit||(unit===prevUnit&&id<=prevId))
   throw Error('Catalog IDs must be in canonical unit/ASCII order');
  buildDraft({
   unit,questionId:id,sourceQuestionNumber:number,
   bankVersion:manifest.bankVersions[unit],category:'other',note:''
  });
  seen.add(id);counts[unit]++;prevUnit=unit;prevId=id;
 }
 for(let unit=1;unit<=6;unit++)
  if(counts[unit]!==EXPECTED[unit])throw Error('Invalid per-unit ID partition '+unit);
 if(typeof manifest.contentSha256!=='string'||!/^[a-f0-9]{64}$/.test(manifest.contentSha256)||
    digest(payloadOf(manifest))!==manifest.contentSha256)
  throw Error('Static catalog content hash mismatch');
 const rows=manifest.questionRefs;
 const lookup=new Map(rows.map(([id,unit,sourceQuestionNumber])=>[
  id,Object.freeze({id,unit,sourceQuestionNumber,
    bankVersion:manifest.bankVersions[unit],publicPractice:true})
 ]));
 return Object.freeze({
  total:TOTAL,counts:Object.freeze({...EXPECTED}),
  bankVersions:Object.freeze({...manifest.bankVersions}),
  contentSha256:manifest.contentSha256,
  lookup:async id=>typeof id==='string'?(lookup.get(id)||null):null,
  ids:()=>Object.freeze([...lookup.keys()])
 });
}
function createHashedManifest(unitCounts,bankVersions,questionRefs){
 const payload={
  schemaVersion:1,kind:KIND,grade:11,publicPracticeOnly:true,
  unitCounts,bankVersions,questionRefs
 };
 const manifest={...payload,contentSha256:digest(payload)};
 validateStaticManifest(manifest);
 return manifest;
}
module.exports=Object.freeze({TOTAL,EXPECTED,KIND,validateStaticManifest,createHashedManifest});
