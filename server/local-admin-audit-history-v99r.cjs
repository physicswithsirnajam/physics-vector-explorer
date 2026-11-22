'use strict';
/**
 * V99-R — LOCAL FIREBASE EMULATOR ONLY, server-side private audit HISTORY.
 *
 * No HTTP route, Cloud Function, browser access, real Admin UID, production
 * Firebase, report edits, question/answer change or teacher inbox.
 *
 * Read-only serializable transaction reads exactly ONE report and its TWO
 * deterministic V99-Q event IDs (no arbitrary query or client-supplied path).
 * Enabled only by an explicit trusted server callback; OFF by default.
 * Every call independently verifies real LOCAL Firebase Auth Emulator token
 * via Admin SDK with revocation check, verified email, signed admin claim and
 * an independent server-owned exact administrator UID allowlist.
 *
 * Corrupt/incomplete/nonchronological history fails closed, never silently
 * inventing or skipping an event. Response never exposes reviewerUid,
 * ownerUid, student note, grade, answer key or arbitrary document fields.
 */
const crypto=require('node:crypto');
const {PROJECT,HOST:FS_HOST,REPORTS,requireLocalDemo}=
 require('./firebase-review-emulator-v99f.cjs');
const {AUDIT}=require('./local-admin-review-transitions-v99q.cjs');
const {extractBearer}=require('./verified-report-boundary-v99g.cjs');
const catalog=require('./pinned-approved-review-catalog-v99i.cjs');
const {checkFreshLocalAdmin}=require('./local-admin-account-freshness-v99y.cjs');

const AUTH_HOST='127.0.0.1:9099';
const UID=/^[A-Za-z0-9_-]{1,128}$/;
const REPORT_ID=/^mr_[a-f0-9]{48}$/;
const ISO=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/;
const VALID_CATEGORIES=new Set([
 'missing-context','incorrect-key','unclear-wording','formula-display','other'
]);
const ACTIONS=Object.freeze([
 Object.freeze({action:'start-review',from:'new',to:'in-review'}),
 Object.freeze({action:'resolve',from:'in-review',to:'resolved'})
]);
const CODES=new Set([
 'invalid-request','authentication-required','verified-email-required',
 'admin-access-required','not-found','temporarily-unavailable'
]);
const EVENT_FIELDS=Object.freeze([
 'schemaVersion','kind','reportId','action','fromStatus','toStatus',
 'reviewedAtIso','reviewerUid'
]);
class LocalAuditHistoryError extends Error{
 constructor(code){super(code);this.name='LocalAuditHistoryError';this.code=code;}
}
function deny(code){throw new LocalAuditHistoryError(code);}
function plain(obj){
 return obj!==null&&typeof obj==='object'&&!Array.isArray(obj)&&
  (Object.getPrototypeOf(obj)===Object.prototype||
   Object.getPrototypeOf(obj)===null);
}
function timestamp(value){
 if(typeof value!=='string'||!ISO.test(value))return null;
 const n=Date.parse(value);
 return Number.isFinite(n)&&new Date(n).toISOString()===value?n:null;
}
function eventId(id,to){
 return 'ar_'+crypto.createHash('sha256')
  .update('grade11-review-transition:v1:'+id+'\0'+to,'utf8')
  .digest('hex').slice(0,48);
}
function validReport(record,source){
 return plain(record)&&source&&source.publicPractice===true&&
  record.schemaVersion===1&&record.kind==='grade11-mcq-review'&&
  record.grade===11&&record.origin==='practice-engine'&&
  record.questionId===source.id&&record.unit===source.unit&&
  record.sourceQuestionNumber===source.sourceQuestionNumber&&
  record.bankVersion===source.bankVersion&&
  typeof record.ownerUid==='string'&&UID.test(record.ownerUid)&&
  VALID_CATEGORIES.has(record.category)&&
  typeof record.note==='string'&&record.note.length<=500&&
  timestamp(record.createdAtIso)!==null&&
  ['new','in-review','resolved'].includes(record.status);
}
function verifiedEvent(data,reportId,spec,createdAt){
 if(!plain(data)||Object.keys(data).length!==EVENT_FIELDS.length||
    EVENT_FIELDS.some(k=>!Object.hasOwn(data,k))||
    data.schemaVersion!==1||
    data.kind!=='grade11-admin-review-transition'||
    data.reportId!==reportId||data.action!==spec.action||
    data.fromStatus!==spec.from||data.toStatus!==spec.to||
    typeof data.reviewerUid!=='string'||!UID.test(data.reviewerUid)||
    timestamp(data.reviewedAtIso)===null||
    timestamp(data.reviewedAtIso)<createdAt)
  deny('temporarily-unavailable');
 return Object.freeze({
  action:spec.action,fromStatus:spec.from,toStatus:spec.to,
  reviewedAtIso:data.reviewedAtIso
 });
}
function createLocalAdminAuditHistoryReader({
 firestore,adminAuth,allowedAdminUids,isHistoryEnabled=()=>false
}={}){
 if(process.env.GCLOUD_PROJECT!==PROJECT||
    process.env.FIRESTORE_EMULATOR_HOST!==FS_HOST||
    process.env.FIREBASE_AUTH_EMULATOR_HOST!==AUTH_HOST||
    process.env.GOOGLE_APPLICATION_CREDENTIALS)
  throw new Error('V99-R refuses production projects, credentials and nonlocal emulators');
 requireLocalDemo(firestore);
 if(!adminAuth||typeof adminAuth.verifyIdToken!=='function'||
    adminAuth.app?.options?.projectId!==PROJECT)
  throw new TypeError('Matching local Firebase Admin Auth SDK instance required');
 if(!Array.isArray(allowedAdminUids)||allowedAdminUids.length<1||
    allowedAdminUids.length>5||
    allowedAdminUids.some(uid=>typeof uid!=='string'||!UID.test(uid))||
    new Set(allowedAdminUids).size!==allowedAdminUids.length)
  throw new TypeError('Independent exact administrator UID allowlist required');
 if(typeof isHistoryEnabled!=='function')
  throw new TypeError('A trusted server-only history switch is required');
 if(catalog.total!==2250)
  throw new Error('Pinned original 2250-question reference index required');
 const allowed=new Set(allowedAdminUids);
 const enabled=async()=>{
  try{return await isHistoryEnabled()===true;}catch{return false;}
 };
 return async function readHistory(request){
  try{
   if(!(await enabled()))deny('temporarily-unavailable');
   if(!plain(request)||Object.keys(request).length!==2||
      !Object.hasOwn(request,'authorization')||
      !Object.hasOwn(request,'reportId')||
      typeof request.reportId!=='string'||!REPORT_ID.test(request.reportId))
    deny('invalid-request');
   let token;
   try{token=extractBearer(request.authorization);}
   catch{deny('authentication-required');}
   let claim;
   try{claim=await adminAuth.verifyIdToken(token,true);}
   catch{deny('authentication-required');}
   if(!plain(claim)||claim.aud!==PROJECT||
      claim.iss!=='https://securetoken.google.com/'+PROJECT||
      typeof claim.uid!=='string'||!UID.test(claim.uid)||
      claim.sub!==claim.uid)
    deny('authentication-required');
   if(claim.email_verified!==true)deny('verified-email-required');
   if(claim.admin!==true||!allowed.has(claim.uid))
    deny('admin-access-required');
   if(!(await enabled()))deny('temporarily-unavailable');
   const freshCode=await checkFreshLocalAdmin({adminAuth,verified:claim,allowedAdminUids:allowed});
   if(freshCode)deny(freshCode);

   const reportRef=firestore.collection(REPORTS).doc(request.reportId);
   const firstRef=firestore.collection(AUDIT).doc(eventId(request.reportId,ACTIONS[0].to));
   const secondRef=firestore.collection(AUDIT).doc(eventId(request.reportId,ACTIONS[1].to));
   // The Admin SDK transaction gives a consistent snapshot of the report and
   // both fixed, known audit documents. This function NEVER schedules writes.
   const result=await firestore.runTransaction(async tx=>{
    if(!(await enabled()))deny('temporarily-unavailable');
    const reportSnap=await tx.get(reportRef);
    if(!reportSnap.exists)deny('not-found');
    const record=reportSnap.data();
    const source=await catalog.lookup(record?.questionId);
    if(!validReport(record,source))deny('temporarily-unavailable');
    const a=await tx.get(firstRef);
    const b=await tx.get(secondRef);
    const count=record.status==='new'?0:
     record.status==='in-review'?1:2;
    if(a.exists!==(count>=1)||b.exists!==(count===2))
     deny('temporarily-unavailable');
    const events=[];
    if(a.exists)events.push(verifiedEvent(a.data(),request.reportId,ACTIONS[0],
     timestamp(record.createdAtIso)));
    if(b.exists)events.push(verifiedEvent(b.data(),request.reportId,ACTIONS[1],
     timestamp(record.createdAtIso)));
    if(events.length===0){
     if(record.reviewUpdatedAtIso!==undefined)
      deny('temporarily-unavailable');
    }else{
     const last=events[events.length-1].reviewedAtIso;
     if(record.reviewUpdatedAtIso!==last)deny('temporarily-unavailable');
     if(events.length===2&&timestamp(events[1].reviewedAtIso)<
         timestamp(events[0].reviewedAtIso))
      deny('temporarily-unavailable');
    }
    return Object.freeze({
     ok:true,reportId:request.reportId,questionId:source.id,
     status:record.status,events:Object.freeze(events)
    });
   });
   if(!result||result.ok!==true||!Array.isArray(result.events)||
      result.events.length>2)deny('temporarily-unavailable');
   return result;
  }catch(error){
   const code=error instanceof LocalAuditHistoryError&&CODES.has(error.code)?
    error.code:'temporarily-unavailable';
   return Object.freeze({ok:false,code});
  }
 };
}
module.exports=Object.freeze({
 LocalAuditHistoryError,createLocalAdminAuditHistoryReader
});
