#!/usr/bin/env node
'use strict';
/*
 * V191 — keyless OFFLINE review evidence receipt model.
 * It is not Auth, App Check, secure storage, teacher signoff or release.
 * Use mock digests in public tests. Actual candidate digests and notes stay
 * in the owner's PRIVATE working files and must NEVER be committed to GitHub.
 */
const crypto=require('node:crypto');
const {POLICY}=require('./unit07_revision_bound_review_v190.cjs');
const HASH=/^[0-9a-f]{64}$/;
const CHECKS=['sourceFidelity','science','distractors','summativeSlo','accessibility','rights'];
const STATUSES=['NOT_ASSESSED','ISSUE_IDENTIFIED','NOTES_CAPTURED_OFFLINE'];
const INPUT_FIELDS=['sourceId','sourceSha256','candidateRevisionSha256','checklist','claimedApproval'];
const CHECK_FIELDS=['status','evidenceSha256'];
function reject(why){throw Error('V191_DENIED: '+why);}
function exact(x,fields,where){
 if(!x||typeof x!=='object'||Array.isArray(x))reject(where+'_OBJECT_REQUIRED');
 if(JSON.stringify(Object.keys(x).sort())!==JSON.stringify([...fields].sort()))
  reject(where+'_FIELDS_INVALID');
}
function sha(x){return crypto.createHash('sha256').update(x,'utf8').digest('hex');}
function generateOfflineReceipt(input){
 exact(input,INPUT_FIELDS,'INPUT');
 const p=POLICY[input.sourceId];
 if(!p||p.sourceSha256!==input.sourceSha256)reject('SOURCE_REFERENCE_MISMATCH');
 if(typeof input.candidateRevisionSha256!=='string'||!HASH.test(input.candidateRevisionSha256))
  reject('REVISION_DIGEST_FORMAT_INVALID');
 if(input.claimedApproval!==false)reject('CANNOT_CLAIM_ACADEMIC_APPROVAL_OFFLINE');
 exact(input.checklist,CHECKS,'CHECKLIST');
 const checks={};
 let open=0,issue=0,notes=0;
 for(const key of CHECKS){
  const f=input.checklist[key];
  exact(f,CHECK_FIELDS,'CHECK_'+key);
  if(!STATUSES.includes(f.status))reject('APPROVAL_STATUS_NOT_ALLOWED');
  if(f.evidenceSha256!==null&&!(typeof f.evidenceSha256==='string'&&HASH.test(f.evidenceSha256)))
   reject('EVIDENCE_DIGEST_FORMAT_INVALID');
  if(f.status==='NOT_ASSESSED'){
   if(f.evidenceSha256!==null)reject('UNASSESSED_WITH_EVIDENCE');
   open++;
  }else{
   if(f.evidenceSha256===null)reject('NOTES_REQUIRE_EVIDENCE_REFERENCE');
   if(f.status==='ISSUE_IDENTIFIED')issue++;else notes++;
  }
  checks[key]={status:f.status,evidenceSha256:f.evidenceSha256};
 }
 const receipt={
  version:'V191',type:'UNTRUSTED_OFFLINE_REVIEW_NOTES_ONLY',
  sourceId:input.sourceId,
  sourceSha256:input.sourceSha256,
  candidateRevisionSha256:input.candidateRevisionSha256,
  proposedSlo:'P-11-B-22',
  sourceScope:p.scope,
  directlyEligibleForSummative:false,
  checklist:checks,
  summary:{notAssessed:open,issueIdentified:issue,notesCapturedOffline:notes},
  evidenceReferencesNotVerified:true,
  privateOriginalAndCandidateContentNotReviewedByThisFunction:true,
  authenticatedTeacherIdentityVerified:false,
  signedAuditVerified:false,
  scienceApproved:false,cognitiveApproved:false,ownerScoringAuthorized:false,
  realBackendAndAppCheckVerified:false,
  scoredTestBuilderEligible:false,
  studentScoredRelease:'HOLD',
  nextStep:'HUMAN_PRIVATE_REVIEW_AND_FUTURE_AUTHENTICATED_DECISION_REQUIRED'
 };
 // This digest is an integrity aid for the local receipt, NOT trusted signing.
 return {...receipt,localReceiptSha256:sha('PWSN-V191-LOCAL-UNTRUSTED-RECEIPT\n'+JSON.stringify(receipt))};
}
module.exports={CHECKS,STATUSES,generateOfflineReceipt};
