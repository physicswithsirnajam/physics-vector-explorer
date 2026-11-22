'use strict';
/**
 * V99-Q — LOCAL EMULATOR ONLY: transactional administrator review transitions.
 *
 * Independent of student submission. No HTTP/Callable route, Cloud Function,
 * production Firebase connection, teacher UI, notification, question edit,
 * answer-key edit, or published rules update.
 *
 * Requires a real LOCAL Admin Auth Emulator token verified with revocation
 * checking, email_verified, admin:true AND an exact trusted server UID list.
 * The admin triage switch is OFF by default; only a trusted server function
 * can enable it. Two transitions only:
 *    new -> in-review -> resolved
 * No reopening, arbitrary status, client role, custom field or silent delete.
 * Each committed change writes one private audit event in the SAME Firestore
 * transaction. Duplicate same-action retries do not add audit or writes.
 *
 * This switch cannot cancel a transaction already committing. Real deployment
 * would require independent operational traffic disablement and proper audit.
 */
const crypto=require('node:crypto');
const {PROJECT,HOST:FS_HOST,REPORTS,requireLocalDemo}=
 require('./firebase-review-emulator-v99f.cjs');
const {extractBearer}=require('./verified-report-boundary-v99g.cjs');
const catalog=require('./pinned-approved-review-catalog-v99i.cjs');
const {checkFreshLocalAdmin}=require('./local-admin-account-freshness-v99y.cjs');

const AUTH_HOST='127.0.0.1:9099';
const AUDIT='mcqReviewAdminAudit';
const UID=/^[A-Za-z0-9_-]{1,128}$/;
const REPORT_ID=/^mr_[a-f0-9]{48}$/;
const ACTIONS=Object.freeze({
 'start-review':Object.freeze({from:'new',to:'in-review'}),
 'resolve':Object.freeze({from:'in-review',to:'resolved'})
});
const CATEGORY=new Set([
 'missing-context','incorrect-key','unclear-wording','formula-display','other'
]);
const PUBLIC_CODES=new Set([
 'invalid-request','authentication-required','verified-email-required',
 'admin-access-required','not-found','invalid-transition',
 'temporarily-unavailable'
]);
class LocalReviewTransitionError extends Error{
 constructor(code){super(code);this.name='LocalReviewTransitionError';this.code=code;}
}
function deny(code){throw new LocalReviewTransitionError(code);}
function plain(value){
 return value!==null&&typeof value==='object'&&!Array.isArray(value)&&
  (Object.getPrototypeOf(value)===Object.prototype||
   Object.getPrototypeOf(value)===null);
}
function validRecord(record,source){
 return plain(record)&&source&&
  record.schemaVersion===1&&record.kind==='grade11-mcq-review'&&
  record.grade===11&&record.origin==='practice-engine'&&
  record.unit===source.unit&&record.questionId===source.id&&
  record.sourceQuestionNumber===source.sourceQuestionNumber&&
  record.bankVersion===source.bankVersion&&source.publicPractice===true&&
  typeof record.ownerUid==='string'&&UID.test(record.ownerUid)&&
  CATEGORY.has(record.category)&&
  typeof record.note==='string'&&record.note.length<=500&&
  typeof record.createdAtIso==='string'&&
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(record.createdAtIso)&&
  Number.isFinite(Date.parse(record.createdAtIso))&&
  ['new','in-review','resolved'].includes(record.status);
}
function auditId(reportId,target){
 return 'ar_'+crypto.createHash('sha256')
  .update('grade11-review-transition:v1:'+reportId+'\0'+target,'utf8')
  .digest('hex').slice(0,48);
}
function createLocalAdminReviewTransitions({
 firestore,adminAuth,allowedAdminUids,isTriageEnabled=()=>false,now=Date.now
}={}){
 if(process.env.GCLOUD_PROJECT!==PROJECT||
    process.env.FIRESTORE_EMULATOR_HOST!==FS_HOST||
    process.env.FIREBASE_AUTH_EMULATOR_HOST!==AUTH_HOST||
    process.env.GOOGLE_APPLICATION_CREDENTIALS)
  throw new Error('V99-Q refuses non-demo Firebase projects, credentials and nonlocal emulators');
 requireLocalDemo(firestore);
 if(!adminAuth||typeof adminAuth.verifyIdToken!=='function'||
    adminAuth.app?.options?.projectId!==PROJECT)
  throw new TypeError('Matching local Firebase Admin Auth SDK instance required');
 if(!Array.isArray(allowedAdminUids)||allowedAdminUids.length<1||
    allowedAdminUids.length>5||
    allowedAdminUids.some(uid=>typeof uid!=='string'||!UID.test(uid))||
    new Set(allowedAdminUids).size!==allowedAdminUids.length)
  throw new TypeError('Exact immutable trusted administrator UID allowlist required');
 if(typeof isTriageEnabled!=='function'||typeof now!=='function')
  throw new TypeError('Trusted server-only enable switch and clock required');
 if(catalog.total!==2250)throw new Error('Approved 2250-reference source catalog required');
 const allowed=new Set(allowedAdminUids);
 const enabled=async()=>{
  try{return await isTriageEnabled()===true;}catch{return false;}
 };
 return async function transition(request){
  try{
   if(!(await enabled()))deny('temporarily-unavailable');
   if(!plain(request)||Object.keys(request).length!==3||
      !['authorization','reportId','action'].every(k=>Object.hasOwn(request,k))||
      typeof request.reportId!=='string'||!REPORT_ID.test(request.reportId)||
      typeof request.action!=='string'||!Object.hasOwn(ACTIONS,request.action))
    deny('invalid-request');
   let token;
   try{token=extractBearer(request.authorization);}
   catch{deny('authentication-required');}
   let verified;
   try{verified=await adminAuth.verifyIdToken(token,true);}
   catch{deny('authentication-required');}
   if(!plain(verified)||verified.aud!==PROJECT||
      verified.iss!=='https://securetoken.google.com/'+PROJECT||
      typeof verified.uid!=='string'||!UID.test(verified.uid)||
      verified.sub!==verified.uid)
    deny('authentication-required');
   if(verified.email_verified!==true)deny('verified-email-required');
   if(verified.admin!==true||!allowed.has(verified.uid))
    deny('admin-access-required');
   if(!(await enabled()))deny('temporarily-unavailable');
   const freshCode=await checkFreshLocalAdmin({adminAuth,verified,allowedAdminUids:allowed});
   if(freshCode)deny(freshCode);

   const time=now();
   if(!Number.isSafeInteger(time)||time<0||
      !Number.isFinite(new Date(time).getTime()))
    deny('temporarily-unavailable');
   const iso=new Date(time).toISOString();
   const spec=ACTIONS[request.action],ref=firestore.collection(REPORTS).doc(request.reportId);
   const auditRef=firestore.collection(AUDIT).doc(auditId(request.reportId,spec.to));
   const result=await firestore.runTransaction(async tx=>{
    if(!(await enabled()))deny('temporarily-unavailable');
    const snapshot=await tx.get(ref);
    if(!snapshot.exists)deny('not-found');
    const record=snapshot.data();
    const source=await catalog.lookup(record?.questionId);
    if(!validRecord(record,source))deny('temporarily-unavailable');
    if(record.status===spec.to)return {alreadyApplied:true};
    if(record.status!==spec.from)deny('invalid-transition');
    // Do not allow the trusted clock to predate the original report.
    if(time<Date.parse(record.createdAtIso))deny('temporarily-unavailable');
    // Re-check immediately before writes, but committed/in-flight
    // transactions cannot be rolled back by this application flag.
    if(!(await enabled()))deny('temporarily-unavailable');
    tx.update(ref,{status:spec.to,reviewUpdatedAtIso:iso});
    tx.create(auditRef,{
     schemaVersion:1,kind:'grade11-admin-review-transition',
     reportId:request.reportId,action:request.action,
     fromStatus:spec.from,toStatus:spec.to,
     reviewedAtIso:iso,reviewerUid:verified.uid
    });
    return {alreadyApplied:false};
   });
   if(!result||typeof result.alreadyApplied!=='boolean')
    deny('temporarily-unavailable');
   // Admin receipt contains neither ownerUid nor reviewerUid, note,
   // answer, source text, Firebase ID token or audit record contents.
   return Object.freeze({
    ok:true,reportId:request.reportId,status:spec.to,
    alreadyApplied:result.alreadyApplied
   });
  }catch(err){
   const code=err instanceof LocalReviewTransitionError&&PUBLIC_CODES.has(err.code)?
    err.code:'temporarily-unavailable';
   return Object.freeze({ok:false,code});
  }
 };
}
module.exports=Object.freeze({
 AUDIT,LocalReviewTransitionError,createLocalAdminReviewTransitions
});
