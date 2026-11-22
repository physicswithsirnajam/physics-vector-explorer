'use strict';
/**
 * V99-P — strictly LOCAL, read-only administrative MCQ review queue.
 *
 * No browser access, teacher inbox, live HTTP/Callable endpoint, report edits,
 * Cloud Functions or production Firebase connection. A real Firebase Admin
 * Auth Emulator ID token (verifyIdToken(...,true)), explicit trusted Admin
 * custom claim, VERIFIED email, server-configured UID allowlist, and an
 * explicit trusted enable flag are ALL required before Admin Firestore reads
 * of at most 25 synthetic reports. This reader now starts OFF by default.
 *
 * We deliberately redact stored ownerUid, email and unrecognized fields even
 * from this local admin view. Future production UI must escape note text.
 */
const {PROJECT,HOST:FS_HOST,REPORTS,requireLocalDemo}=
 require('./firebase-review-emulator-v99f.cjs');
const {extractBearer}=require('./verified-report-boundary-v99g.cjs');
const catalog=require('./pinned-approved-review-catalog-v99i.cjs');
const {checkFreshLocalAdmin}=require('./local-admin-account-freshness-v99y.cjs');

const AUTH_HOST='127.0.0.1:9099';
const MAX_PAGE=25,DEFAULT_PAGE=10;
const ID=/^[A-Za-z0-9_-]{1,128}$/;
const REPORT_ID=/^mr_[0-9a-f]{48}$/;
const STATUSES=new Set(['new','in-review','resolved']);
const CATEGORY=new Set([
 'missing-context','incorrect-key','unclear-wording','formula-display','other'
]);
const CODES=new Set([
 'invalid-request','authentication-required','verified-email-required',
 'admin-access-required','temporarily-unavailable'
]);
class LocalAdminReviewError extends Error{
 constructor(code){
  super(code);this.name='LocalAdminReviewError';this.code=code;
 }
}
function reject(code){throw new LocalAdminReviewError(code);}
function plain(obj){
 return obj!==null&&typeof obj==='object'&&!Array.isArray(obj)&&
  (Object.getPrototypeOf(obj)===Object.prototype||
   Object.getPrototypeOf(obj)===null);
}
function sanitize(record,id,source){
 if(!REPORT_ID.test(id)||!plain(record)||!source||
    record.schemaVersion!==1||record.kind!=='grade11-mcq-review'||
    record.grade!==11||record.origin!=='practice-engine'||
    record.unit!==source.unit||
    record.questionId!==source.id||
    record.sourceQuestionNumber!==source.sourceQuestionNumber||
    record.bankVersion!==source.bankVersion||
    !STATUSES.has(record.status)||
    !CATEGORY.has(record.category)||
    typeof record.note!=='string'||record.note.length>500||
    typeof record.createdAtIso!=='string'||
    !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(record.createdAtIso)||
    !Number.isFinite(Date.parse(record.createdAtIso)))
  reject('temporarily-unavailable');
 // Server-controlled projection only. Never return raw Firestore docs,
 // account UID/email, claims, scores, keys, arbitrary private fields, etc.
 return Object.freeze({
  reportId:id,unit:record.unit,questionId:record.questionId,
  sourceQuestionNumber:record.sourceQuestionNumber,
  bankVersion:source.bankVersion,category:record.category,
  note:record.note,status:record.status,createdAtIso:record.createdAtIso
 });
}
function createLocalAdminReviewReader({
 firestore,adminAuth,allowedAdminUids,isReviewReaderEnabled=()=>false
}={}){
 if(process.env.GCLOUD_PROJECT!==PROJECT||
    process.env.FIRESTORE_EMULATOR_HOST!==FS_HOST||
    process.env.FIREBASE_AUTH_EMULATOR_HOST!==AUTH_HOST||
    process.env.GOOGLE_APPLICATION_CREDENTIALS)
  throw new Error('V99-P refuses production projects, credentials and nonlocal emulators');
 requireLocalDemo(firestore);
 if(!adminAuth||typeof adminAuth.verifyIdToken!=='function'||
    adminAuth.app?.options?.projectId!==PROJECT)
  throw new TypeError('A matching demo-project Firebase Admin Auth instance is required');
 if(!Array.isArray(allowedAdminUids)||allowedAdminUids.length<1||
    allowedAdminUids.length>5||
    allowedAdminUids.some(uid=>typeof uid!=='string'||!ID.test(uid))||
    new Set(allowedAdminUids).size!==allowedAdminUids.length)
  throw new TypeError('Explicit trusted server-side admin UID allowlist required');
 if(typeof isReviewReaderEnabled!=='function')
  throw new TypeError('Trusted server-only reader enable switch required');
 const allowed=new Set(allowedAdminUids);
 const enabled=async()=>{
  try{return await isReviewReaderEnabled()===true;}catch{return false;}
 };
 if(catalog.total!==2250)throw new Error('Original 2250-entry catalog required');
 return async function listLatest(request){
  try{
   if(!(await enabled()))reject('temporarily-unavailable');
   if(!plain(request)||Object.keys(request).some(k=>!['authorization','limit'].includes(k))||
      !Object.hasOwn(request,'authorization'))reject('invalid-request');
   const limit=request.limit===undefined?DEFAULT_PAGE:request.limit;
   if(!Number.isInteger(limit)||limit<1||limit>MAX_PAGE)
    reject('invalid-request');
   let token;
   try{token=extractBearer(request.authorization);}
   catch{reject('authentication-required');}
   let verified;
   try{verified=await adminAuth.verifyIdToken(token,true);}
   catch{reject('authentication-required');}
   if(!plain(verified)||verified.aud!==PROJECT||
      verified.iss!=='https://securetoken.google.com/'+PROJECT||
      typeof verified.uid!=='string'||!ID.test(verified.uid)||
      verified.sub!==verified.uid)
    reject('authentication-required');
   if(verified.email_verified!==true)reject('verified-email-required');
   if(verified.admin!==true||!allowed.has(verified.uid))
    reject('admin-access-required');
   const freshCode=await checkFreshLocalAdmin({adminAuth,verified,allowedAdminUids:allowed});
   if(freshCode)reject(freshCode);
   // Recheck immediately before the Firestore read. An in-flight query
   // cannot be retroactively canceled, but a later OFF prevents response.
   if(!(await enabled()))reject('temporarily-unavailable');
   // Always read the specific server-controlled collection, no arbitrary
   // field filters, owner searches, cursors or unbounded collection dumps.
   const snapshot=await firestore.collection(REPORTS)
    .orderBy('createdAtIso','desc').limit(limit).get();
   if(!snapshot||!Array.isArray(snapshot.docs)||
      snapshot.docs.length>limit)reject('temporarily-unavailable');
   const reports=[];
   for(const doc of snapshot.docs){
    const data=doc.data();
    const source=await catalog.lookup(data?.questionId);
    reports.push(sanitize(data,doc.id,source));
   }
   if(!(await enabled()))reject('temporarily-unavailable');
   return Object.freeze({
    ok:true,count:reports.length,reports:Object.freeze(reports)
   });
  }catch(err){
   const code=err instanceof LocalAdminReviewError&&CODES.has(err.code)?
    err.code:'temporarily-unavailable';
   return Object.freeze({ok:false,code});
  }
 };
}
module.exports=Object.freeze({
 MAX_PAGE,DEFAULT_PAGE,LocalAdminReviewError,createLocalAdminReviewReader
});
