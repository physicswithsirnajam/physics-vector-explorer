#!/usr/bin/env node
'use strict';
/*
 * V190: ISOLATED SYNTHETIC REVIEW DECISION PROTOCOL, not a web API.
 * NO REAL teacher identity, actual private candidate digest, Firebase, or
 * student scoring capability. Caller actor IDs below are TEST FIXTURE ONLY.
 */
const A=require('node:assert/strict');
const crypto=require('node:crypto');
const HASH=/^[0-9a-f]{64}$/;
const DOMAIN='PWSN-V190-SYNTHETIC-REVIEW-EVENT-V1\n';
const POLICY=Object.freeze({
 'XI-U07-T071-Q022':Object.freeze({
  sourceSha256:'4632066b3e8eff54029b85cebfdebb823f9e3364e64cb9c15b0905691c1e0dd3',
  directSummative:false,
  scope:'SUPPORTING_ONLY_NOT_DIRECT_SUMMATIVE_B22'}),
 'XI-U07-T071-Q025':Object.freeze({
  sourceSha256:'27d9b15ebe860eca6b4788d6420db4230e6266295027ef01d28ca2383a7f5353',
  directSummativeCandidate:true,
  scope:'PROMISING_DIRECT_B22_TEACHER_PENDING'})
});
const ACTION_ROLE=Object.freeze({
 'verify-source':'science',
 'approve-physics':'science',
 'approve-slo':'cognitive',
 'acknowledge-owner':'owner',
 'revoke':'owner',
 'supersede':'owner'
});
const EXACT={
 'verify-source':['action','sourceId','sourceSha256','revisionSha256','expectedSequence','evidenceSha256'],
 'approve-physics':['action','sourceId','sourceSha256','revisionSha256','expectedSequence','evidenceSha256'],
 'approve-slo':['action','sourceId','sourceSha256','revisionSha256','expectedSequence','evidenceSha256'],
 'acknowledge-owner':['action','sourceId','sourceSha256','revisionSha256','expectedSequence','evidenceSha256'],
 'revoke':['action','sourceId','sourceSha256','revisionSha256','expectedSequence','reasonCode'],
 'supersede':['action','sourceId','sourceSha256','revisionSha256','expectedSequence','nextRevisionSha256']
};
function deny(code){throw Error('V190_DENIED: '+code);}
function obj(v,fields,where){
 if(!v||typeof v!=='object'||Array.isArray(v))deny(where+'_OBJECT');
 if(JSON.stringify(Object.keys(v).sort())!==JSON.stringify([...fields].sort()))deny(where+'_FIELDS');
}
function isHash(v){return typeof v==='string'&&HASH.test(v);}
function digest(s){return crypto.createHash('sha256').update(s,'utf8').digest('hex');}
function evidence(x){if(!isHash(x))deny('INVALID_EVIDENCE_SHA');return x;}
function createSyntheticDecisionHarness({sourceId,sourceSha256,revisionSha256,actors}){
 const policy=POLICY[sourceId];
 if(!policy||sourceSha256!==policy.sourceSha256)deny('SOURCE_POLICY_MISMATCH');
 if(!isHash(revisionSha256))deny('INVALID_SYNTHETIC_REVISION');
 if(!actors||typeof actors!=='object'||Array.isArray(actors))deny('ACTORS_INVALID');
 const directory=new Map();
 for(const [id,v] of Object.entries(actors)){
  if(!/^mock_[a-z][a-z0-9_]{2,30}$/.test(id))deny('MOCK_ACTOR_ID_INVALID');
  obj(v,['role','active'],'MOCK_ACTOR');
  if(!['science','cognitive','owner'].includes(v.role)||typeof v.active!=='boolean')deny('MOCK_ROLE_INVALID');
  directory.set(id,{role:v.role,active:v.active});
 }
 if(directory.size<3)deny('INSUFFICIENT_SYNTHETIC_ROLES');
 const state={
  sourceId,sourceSha256,revisionSha256,sequence:0,revoked:false,
  approvals:{source:null,physics:null,slo:null,owner:null},events:[],
  seenRevisions:new Set([revisionSha256])
 };
 function activeApproval(v){return !!v && !!directory.get(v.actor)?.active;}
 function append(action,actor,evidenceSha256=null,nextRevisionSha256=null){
  const body={
   index:state.sequence+1,sourceId:state.sourceId,sourceSha256:state.sourceSha256,
   revisionSha256:state.revisionSha256,action,actor,evidenceSha256,nextRevisionSha256,
   previousHash:state.events.at(-1)?.digest??'0'.repeat(64)
  };
  const event={...body,digest:digest(DOMAIN+JSON.stringify(body))};
  state.events.push(event);state.sequence++;
 }
 function snapshot(){
  const s=state.approvals;
  const sourceOkay=activeApproval(s.source),physicsOkay=activeApproval(s.physics),
   sloOkay=activeApproval(s.slo),ownerOkay=activeApproval(s.owner);
  const reviewStagesComplete=!state.revoked&&sourceOkay&&physicsOkay&&sloOkay&&ownerOkay;
  return Object.freeze({
   sourceId:state.sourceId,sourceSha256:state.sourceSha256,
   currentRevisionSha256:state.revisionSha256,sequence:state.sequence,revoked:state.revoked,
   academicSourceCheckActive:sourceOkay,academicScienceCheckActive:physicsOkay,
   academicSloCheckActive:sloOkay,syntheticOwnerAcknowledgedActive:ownerOkay,
   syntheticReviewStagesComplete:reviewStagesComplete,
   directSummativeCandidate:policy.directSummativeCandidate===true,
   provisionalSloScope:policy.scope,
   realAuthenticationVerified:false,backendSecurityGatesVerified:false,
   realTeacherApprovalGranted:false,realOwnerScoringAuthorizationGranted:false,
   eligibleForScoredTestBuilder:false,studentScoredRelease:'HOLD'
  });
 }
 function dispatch(trustedMockActorId,command){
  if(!command||!Object.hasOwn(ACTION_ROLE,command.action))deny('ACTION_INVALID');
  const action=command.action;
  obj(command,EXACT[action],'COMMAND');
  if(command.sourceId!==state.sourceId||command.sourceSha256!==state.sourceSha256)
   deny('SOURCE_BINDING_CHANGED');
  if(command.revisionSha256!==state.revisionSha256)deny('STALE_REVISION');
  if(!Number.isSafeInteger(command.expectedSequence)||command.expectedSequence!==state.sequence)
   deny('STALE_DECISION_SEQUENCE');
  const actor=directory.get(trustedMockActorId);
  if(!actor||!actor.active||actor.role!==ACTION_ROLE[action])deny('UNTRUSTED_OR_INACTIVE_MOCK_ROLE');
  if(state.revoked&&action!=='supersede')deny('REVOKED_REVISION');
  const a=state.approvals;
  if(action==='supersede'){
   if(!isHash(command.nextRevisionSha256)||command.nextRevisionSha256===state.revisionSha256||
    state.seenRevisions.has(command.nextRevisionSha256))deny('INVALID_OR_REPLAYED_SUPERSEDE');
   append(action,trustedMockActorId,null,command.nextRevisionSha256);
   state.revisionSha256=command.nextRevisionSha256;
   state.seenRevisions.add(state.revisionSha256);
   state.revoked=false;
   state.approvals={source:null,physics:null,slo:null,owner:null};
  }else if(action==='revoke'){
   if(typeof command.reasonCode!=='string'||!/^[A-Z][A-Z0-9_]{2,80}$/.test(command.reasonCode))deny('REASON_CODE_REQUIRED');
   append(action,trustedMockActorId,digest('SYNTHETIC-REASON\n'+command.reasonCode));
   state.approvals={source:null,physics:null,slo:null,owner:null};
   state.revoked=true;
  }else{
   const h=evidence(command.evidenceSha256);
   const record={actor:trustedMockActorId,evidenceSha256:h};
   if(action==='verify-source'){
    if(a.source)deny('SOURCE_ALREADY_ATTESTED');a.source=record;
   }else if(action==='approve-physics'){
    if(!activeApproval(a.source)||a.physics)deny('PHYSICS_REQUIRES_SOURCE_ATTESTATION');
    a.physics=record;
   }else if(action==='approve-slo'){
    if(!activeApproval(a.physics)||a.slo||a.physics.actor===trustedMockActorId)
     deny('SLO_REQUIRES_INDEPENDENT_ACTIVE_PHYSICS_REVIEW');
    a.slo=record;
   }else if(action==='acknowledge-owner'){
    if(!activeApproval(a.physics)||!activeApproval(a.slo)||a.owner||
     [a.physics.actor,a.slo.actor].includes(trustedMockActorId))
     deny('OWNER_REQUIRES_TWO_DISTINCT_ACTIVE_REVIEWERS');
    a.owner=record;
   }
   append(action,trustedMockActorId,h);
  }
  return snapshot();
 }
 function disableMockActor(trustedOwnerId,targetActorId){
  const owner=directory.get(trustedOwnerId),target=directory.get(targetActorId);
  if(!owner||owner.role!=='owner'||!owner.active||!target)deny('MOCK_ROLE_REVOCATION_DENIED');
  if(!target.active)deny('MOCK_ROLE_ALREADY_REVOKED');
  target.active=false;
  // Reset every dependent result so reactivated identities never inherit stale approvals.
  state.approvals={source:null,physics:null,slo:null,owner:null};
  append('disable-mock-role',trustedOwnerId,digest('SYNTHETIC-ROLE-REVOCATION\n'+targetActorId));
  return snapshot();
 }
 function audit(){return structuredClone(state.events);}
 return Object.freeze({dispatch,snapshot,disableMockActor,audit});
}
function verifyLocalHashChain(events){
 if(!Array.isArray(events))return false;
 let prev='0'.repeat(64);
 for(let i=0;i<events.length;i++){
  const x=events[i];
  if(!x||typeof x!=='object'||Array.isArray(x))return false;
  const keys=['index','sourceId','sourceSha256','revisionSha256','action','actor',
   'evidenceSha256','nextRevisionSha256','previousHash','digest'];
  if(JSON.stringify(Object.keys(x).sort())!==JSON.stringify(keys.sort()))return false;
  const {digest:declared,...body}=x;
  if(x.index!==i+1||x.previousHash!==prev||!isHash(declared)||
   declared!==digest(DOMAIN+JSON.stringify(body)))return false;
  prev=declared;
 }
 return true;
}
module.exports={POLICY,createSyntheticDecisionHarness,verifyLocalHashChain};
