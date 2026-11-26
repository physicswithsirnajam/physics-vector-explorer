#!/usr/bin/env node
'use strict';
/**
 * V186 — LOCAL/SYNTHETIC PROTOCOL ONLY.
 * Not Firebase authentication, not an endpoint, not a production teacher
 * approval service, and NEVER a scored-release mechanism.
 * Do not use with actual owner source questions or student/reviewer identities
 * in a public repository. All fixture content in tests is invented.
 */
const crypto=require('node:crypto');
const VERSION='PWSN-U07-CANDIDATE-V1';
const AUDIT_DOMAIN='PWSN-U07-SYNTHETIC-REVIEW-AUDIT-V1\n';
const SOURCE_ID=/^XI-U07-T07[123]-Q(?:00[1-9]|0[1-7][0-9]|080)$/;
const HASH=/^[0-9a-f]{64}$/;
const ROLES=['science','cognitive','owner'];
const ACTION_ROLES={
 'source-check':'science','science-approve':'science',
 'cognitive-approve':'cognitive','owner-authorize':'owner',
 'revoke':'owner','supersede':'owner'
};
function fail(message){throw new Error('V186_DENIED: '+message);}
function exactObject(value,names,label){
 if(value===null||typeof value!=='object'||Array.isArray(value))fail(label+' must be an object');
 const actual=Object.keys(value).sort(),expected=[...names].sort();
 if(JSON.stringify(actual)!==JSON.stringify(expected))fail(label+' has missing or extra fields');
}
function cleanString(v,label,min=1,max=2000){
 if(typeof v!=='string')fail(label+' is not a string');
 const s=v.normalize('NFC').replace(/\r\n?/g,'\n');
 if(s.length<min||s.length>max||!s.trim()||s!==s.trim())fail(label+' invalid length/edge whitespace');
 if(s.includes('\u0000'))fail(label+' contains NUL');
 return s;
}
function sha256(v){return crypto.createHash('sha256').update(v,'utf8').digest('hex');}
function requireHash(v,label){if(typeof v!=='string'||!HASH.test(v))fail(label+' must be lower-case SHA256');return v;}
function canonicalCandidate(v){
 exactObject(v,['sourceId','sourceSha256','stem','options','correctOption','explanation','slo','cognitive','diagram'],'candidate');
 if(typeof v.sourceId!=='string'||!SOURCE_ID.test(v.sourceId))fail('invalid sourceId');
 const sourceSha256=requireHash(v.sourceSha256,'sourceSha256');
 exactObject(v.options,['A','B','C','D'],'options');
 const opts={};
 for(const x of ['A','B','C','D'])opts[x]=cleanString(v.options[x],'option '+x,1,300);
 if(new Set(Object.values(opts)).size!==4)fail('duplicate answer options');
 if(!['A','B','C','D'].includes(v.correctOption))fail('invalid single correct option');
 if(typeof v.slo!=='string'||!/^P-11-B-(?:22|23|24|25|26|27|28)$/.test(v.slo))fail('outside known Unit7 outcome range');
 if(!['K','U','A'].includes(v.cognitive))fail('invalid cognitive demand');
 let diagram=null;
 if(v.diagram!==null){
  exactObject(v.diagram,['contentSha256','altText','permissionEvidenceSha256'],'diagram');
  diagram={
   contentSha256:requireHash(v.diagram.contentSha256,'diagram content'),
   altText:cleanString(v.diagram.altText,'diagram alt text',3,700),
   permissionEvidenceSha256:requireHash(v.diagram.permissionEvidenceSha256,'diagram permission evidence')
  };
 }
 return {sourceId:v.sourceId,sourceSha256,
  stem:cleanString(v.stem,'stem',5,10000),options:opts,
  correctOption:v.correctOption,
  explanation:cleanString(v.explanation,'explanation',8,10000),
  slo:v.slo,cognitive:v.cognitive,diagram};
}
function revisionSha256(candidate){
 const canonical=canonicalCandidate(candidate);
 return sha256(VERSION+'\n'+JSON.stringify(canonical));
}
function verifySyntheticAudit(entries){
 if(!Array.isArray(entries))return false;
 let previous='0'.repeat(64);
 for(let i=0;i<entries.length;i++){
  const e=entries[i];
  if(e===null||typeof e!=='object'||Array.isArray(e))return false;
  const fields=['index','action','actor','sourceId','revisionSha256','evidenceSha256',
   'nextRevisionSha256','previousHash','digest'];
  if(JSON.stringify(Object.keys(e).sort())!==JSON.stringify(fields.sort()))return false;
  if(e.index!==i+1||e.previousHash!==previous)return false;
  const {digest,...body}=e;
  if(!HASH.test(digest)||sha256(AUDIT_DOMAIN+JSON.stringify(body))!==digest)return false;
  previous=digest;
 }
 return true;
}
function createSyntheticReviewHarness(candidate,syntheticServerDirectory){
 // This directory is a TEST FIXTURE, not proven Auth, App Check, Rules or role issuance.
 if(syntheticServerDirectory===null||typeof syntheticServerDirectory!=='object'||
  Array.isArray(syntheticServerDirectory))fail('invalid synthetic server directory');
 const dir=new Map();
 for(const [id,data] of Object.entries(syntheticServerDirectory)){
  if(!/^[a-z][a-z0-9_-]{2,30}$/.test(id))fail('invalid synthetic reviewer identity');
  exactObject(data,['role','active'],'synthetic reviewer');
  if(!ROLES.includes(data.role)||typeof data.active!=='boolean')fail('invalid synthetic reviewer role/status');
  dir.set(id,{role:data.role,active:data.active});
 }
 let current=canonicalCandidate(candidate);
 const state={sourceId:current.sourceId,sourceSha256:current.sourceSha256,
  revisionSha256:revisionSha256(current),sourceCheck:null,science:null,cognitive:null,
  owner:null,revoked:false,events:[]};
 function append(action,actor,evidenceSha256=null,nextRevisionSha256=null){
  const body={index:state.events.length+1,action,actor,sourceId:state.sourceId,
   revisionSha256:state.revisionSha256,evidenceSha256,nextRevisionSha256,
   previousHash:state.events.length?state.events.at(-1).digest:'0'.repeat(64)};
  const digest=sha256(AUDIT_DOMAIN+JSON.stringify(body));
  state.events.push({...body,digest});
 }
 function dispatch(trustedSyntheticActorId,command){
  if(!Object.hasOwn(ACTION_ROLES,command?.action))fail('unrecognized action');
  const action=command.action;
  const fields=action==='supersede'?
   ['action','sourceId','revisionSha256','newCandidate']:
   action==='revoke'?['action','sourceId','revisionSha256','reasonCode']:
   ['action','sourceId','revisionSha256','evidenceSha256'];
  exactObject(command,fields,'review command');
  if(command.sourceId!==state.sourceId||command.revisionSha256!==state.revisionSha256)fail('stale or mismatched source/revision');
  const actor=dir.get(trustedSyntheticActorId);
  if(!actor||!actor.active||actor.role!==ACTION_ROLES[action])fail('synthetic actor is inactive or lacks required role');
  if(state.revoked&&action!=='supersede')fail('revision revoked');
  if(action==='supersede'){
   const next=canonicalCandidate(command.newCandidate);
   if(next.sourceId!==state.sourceId||next.sourceSha256!==state.sourceSha256)fail('source binding changed');
   const nextSha=revisionSha256(next);
   if(nextSha===state.revisionSha256)fail('supersede requires changed candidate');
   append(action,trustedSyntheticActorId,null,nextSha);
   current=next;state.revisionSha256=nextSha;
   state.sourceCheck=null;state.science=null;state.cognitive=null;state.owner=null;state.revoked=false;
  }else if(action==='revoke'){
   const reason=cleanString(command.reasonCode,'revocation reason',3,120);
   append(action,trustedSyntheticActorId,sha256('SYNTHETIC_REVOCATION_REASON\n'+reason));
   state.sourceCheck=null;state.science=null;state.cognitive=null;state.owner=null;state.revoked=true;
  }else{
   const evidence=requireHash(command.evidenceSha256,'evidenceSha256');
   if(action==='source-check'){
    if(state.sourceCheck)fail('source already checked for revision');
    state.sourceCheck={actor:trustedSyntheticActorId,evidence};
   }
   if(action==='science-approve'){
    if(!state.sourceCheck||state.science)fail('science requires source check and single approval');
    state.science={actor:trustedSyntheticActorId,evidence};
   }
   if(action==='cognitive-approve'){
    if(!state.science||state.cognitive||state.science.actor===trustedSyntheticActorId)fail('cognitive review requires independent science approval');
    state.cognitive={actor:trustedSyntheticActorId,evidence};
   }
   if(action==='owner-authorize'){
    if(!state.science||!state.cognitive||state.owner)fail('owner stage requires science and cognitive checks');
    if([state.science.actor,state.cognitive.actor].includes(trustedSyntheticActorId))fail('owner must be distinct');
    state.owner={actor:trustedSyntheticActorId,evidence};
   }
   append(action,trustedSyntheticActorId,evidence);
  }
  return snapshot();
 }
 function snapshot(){
  return {sourceId:state.sourceId,sourceSha256:state.sourceSha256,
   revisionSha256:state.revisionSha256,
   sourceCheckRecorded:!!state.sourceCheck,scienceRecorded:!!state.science,
   cognitiveRecorded:!!state.cognitive,ownerRecorded:!!state.owner,
   revoked:state.revoked,syntheticEventCount:state.events.length,
   studentScoringEligible:false,scoredRelease:'HOLD'};
 }
 function disableSyntheticActor(id){const actor=dir.get(id);if(!actor)fail('missing synthetic identity');actor.active=false;}
 function audit(){return structuredClone(state.events);}
 return Object.freeze({dispatch,snapshot,audit,disableSyntheticActor,
  // A passing local simulation is never production authorization.
  eligibility:()=>({eligible:false,reason:'LOCAL_SYNTHETIC_ONLY_NO_AUTH_APP_CHECK_OR_DEPLOYMENT'})});
}
module.exports={VERSION,canonicalCandidate,revisionSha256,createSyntheticReviewHarness,verifySyntheticAudit};
