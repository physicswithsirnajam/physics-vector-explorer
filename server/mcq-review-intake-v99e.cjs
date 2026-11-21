'use strict';
/**
 * Physics with Sir Najam — V99-E
 * Pure, dependency-free server-side MCQ review intake core, NOT a deployed endpoint.
 *
 * CRITICAL ADAPTER CONTRACT:
 * - callerIdentity must be produced by a trusted, server-verified Firebase ID token;
 *   NEVER pass user-provided JSON as the identity.
 * - enrollmentLookup and questionLookup must query trusted server-controlled data,
 *   NOT a browser-supplied user profile, question list, or correct-answer field.
 * - runTransaction must implement a real atomic/serializable Firestore transaction
 *   spanning BOTH the report document and per-owner rate record.
 * - no public client writes, email, message delivery or live Firebase calls here.
 *
 * The next separate PR must implement and emulator-test those trusted adapters.
 */
const crypto=require('node:crypto');
const contract=require('../shared/mcq-review-contract-v99a.js');

const DAILY_LIMIT=5;
const COOLDOWN_MS=60_000;
const MAX_UID=128;
const ID_RE=/^[A-Za-z0-9_-]{1,128}$/;

class IntakeError extends Error{
 constructor(code){
  super(code);
  this.name='IntakeError';
  this.code=code;
 }
}
function fail(code){throw new IntakeError(code);}
function digest(value){return crypto.createHash('sha256').update(value,'utf8').digest('hex');}
function assertTrustedIdentity(identity){
 if(!identity||typeof identity!=='object'||Array.isArray(identity))fail('authentication-required');
 if(typeof identity.uid!=='string'||!ID_RE.test(identity.uid)||identity.uid.length>MAX_UID)fail('authentication-required');
 if(identity.emailVerified!==true)fail('verified-email-required');
 return identity.uid;
}
function checkEnrollment(uid,enrollment){
 if(!enrollment||enrollment.uid!==uid||enrollment.grade!==11||
   enrollment.board!=='fbise'||enrollment.status!=='active'||enrollment.type!=='independent')
  fail('enrollment-required');
}
function checkQuestion(draft,question){
 if(!question||question.id!==draft.questionId||question.unit!==draft.unit||
   question.sourceQuestionNumber!==draft.sourceQuestionNumber||
   question.publicPractice!==true)fail('unavailable-question');
 if(typeof question.bankVersion!=='string'||question.bankVersion.length<1||
   question.bankVersion.length>120)fail('unavailable-question');
 return question.bankVersion;
}
function validateNow(value){
 if(!Number.isSafeInteger(value)||value<0||!Number.isFinite(new Date(value).getTime()))
  throw new TypeError('Trusted server time must be a safe UTC epoch-millisecond integer');
 return value;
}
function checkRate(current,day,nowMs){
 if(!current)return 1;
 if(!current||typeof current!=='object')fail('storage-unavailable');
 if(current.day!==day)return 1;
 if(!Number.isSafeInteger(current.count)||current.count<0||current.count>DAILY_LIMIT||
   !Number.isSafeInteger(current.lastAtMs))fail('storage-unavailable');
 if(current.count>=DAILY_LIMIT)fail('daily-limit-reached');
 if(nowMs-current.lastAtMs<COOLDOWN_MS)fail('please-try-later');
 return current.count+1;
}
/**
 * Pure transactional policy. Every actual storage adapter MUST implement:
 * getReport(docId), getRate(rateKey), createReport(docId, record), setRate(rateKey, record).
 * Transaction reads must occur BEFORE any writes, and writes must commit atomically.
 */
async function commitWithinTransaction(tx,spec){
 if(!tx||['getReport','getRate','createReport','setRate'].some(k=>typeof tx[k]!=='function'))
  fail('storage-unavailable');
 const existing=await tx.getReport(spec.reportId);
 if(existing){
  if(existing.ownerUid!==spec.ownerUid || existing.questionId!==spec.questionId||
     existing.category!==spec.category)fail('storage-unavailable');
  return {kind:'duplicate'};
 }
 const rate=await tx.getRate(spec.rateKey);
 const count=checkRate(rate,spec.day,spec.nowMs);
 tx.createReport(spec.reportId,spec.record);
 tx.setRate(spec.rateKey,{day:spec.day,count,lastAtMs:spec.nowMs});
 return {kind:'created'};
}
/**
 * Returns a handler suitable ONLY for a future trusted callable/HTTP adapter.
 * A success receipt is produced AFTER the transaction resolves as written/duplicate.
 */
function createIntakeService({enrollmentLookup,questionLookup,runTransaction,now=Date.now}={}){
 if([enrollmentLookup,questionLookup,runTransaction,now].some(x=>typeof x!=='function'))
  throw new TypeError('Trusted enrollment, source-catalog, transaction, and server-clock adapters required');

 return async function receive({callerIdentity,draft}={}){
  const uid=assertTrustedIdentity(callerIdentity);
  if(!contract.validateDraft(draft).ok)fail('invalid-report');

  const enrollment=await enrollmentLookup(uid);
  checkEnrollment(uid,enrollment);
  const authoritative=await questionLookup(draft.questionId);
  const trustedBankVersion=checkQuestion(draft,authoritative);

  const nowMs=validateNow(now());
  const day=new Date(nowMs).toISOString().slice(0,10);
  const reportId='mr_'+digest('report:v1:'+uid+'\0'+day+'\0'+draft.questionId+'\0'+draft.category).slice(0,48);
  const rateKey='rl_'+digest('rate:v1:'+uid).slice(0,48);
  // Only allowlisted fields go into the stored report. Owner, status,
  // canonical version and timestamp derive from trusted SERVER adapters.
  const record={
   schemaVersion:contract.SCHEMA_VERSION,
   kind:contract.KIND,
   grade:11,unit:draft.unit,questionId:draft.questionId,
   sourceQuestionNumber:draft.sourceQuestionNumber,
   bankVersion:trustedBankVersion,
   displayedBankVersion:draft.bankVersion,
   category:draft.category,note:draft.note,origin:contract.ORIGIN,
   ownerUid:uid,status:'new',createdAtIso:new Date(nowMs).toISOString()
  };
  const result=await runTransaction(tx=>commitWithinTransaction(tx,{
   ownerUid:uid,questionId:draft.questionId,category:draft.category,
   reportId,rateKey,day,nowMs,record
  }));
  if(!result||!['created','duplicate'].includes(result.kind))
   fail('storage-unavailable');
  // No key, score, account email, report body or owner UID in student receipt.
  return Object.freeze({
   status:'received',
   receiptId:'MR-'+day.replace(/-/g,'')+'-'+reportId.slice(3,15).toUpperCase(),
   alreadyReceived:result.kind==='duplicate'
  });
 };
}
module.exports=Object.freeze({
 DAILY_LIMIT,COOLDOWN_MS,IntakeError,createIntakeService,
 commitWithinTransaction
});
