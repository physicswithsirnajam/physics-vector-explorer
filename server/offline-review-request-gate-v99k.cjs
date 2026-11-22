'use strict';
/**
 * V99-K — OFFLINE, transport-neutral MCQ review request gate.
 *
 * NOT a live HTTP endpoint or deployable Firebase Cloud Function. A future
 * trusted transport adapter must extract the six named primitive fields,
 * apply its own network/origin/CSRF/infrastructure controls, and supply a
 * genuine Firebase Admin App Check verifyToken implementation. A synthetic
 * verifier in unit tests is NOT production App Check security.
 *
 * No network, Firebase init, logging, real identities or deployment here.
 */
const contract=require('../shared/mcq-review-contract-v99a.js');
const {extractBearer,ReviewAuthenticationError}=
 require('./verified-report-boundary-v99g.cjs');
const {IntakeError}=require('./mcq-review-intake-v99e.cjs');

const PATH='/api/grade11/mcq-review'; // design-only route label, NOT registered
const MAX_BODY_BYTES=4096;
const MAX_APPCHECK_TOKEN=8192;
const FIELDS=Object.freeze([
 'method','path','contentType','authorization','appCheckToken','bodyText'
]);
const ERROR_STATUS=Object.freeze({
 'invalid-request':400,'unsupported-method':405,'unsupported-content-type':415,
 'payload-too-large':413,'invalid-report':400,'authentication-required':401,
 'verified-email-required':403,'enrollment-required':403,
 'app-check-required':403,'unavailable-question':404,
 'please-try-later':429,'daily-limit-reached':429,
 'temporarily-unavailable':503
});
class RequestGateError extends Error{
 constructor(code){super(code);this.name='RequestGateError';this.code=code;}
}
function fail(code){throw new RequestGateError(code);}
function plainObject(value){
 return value!==null&&typeof value==='object'&&!Array.isArray(value)&&
  (Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
}
function parseRequest(raw){
 if(!plainObject(raw)||Object.keys(raw).length!==FIELDS.length||
    FIELDS.some(k=>!Object.hasOwn(raw,k)))fail('invalid-request');
 if(raw.method!=='POST')fail('unsupported-method');
 if(raw.path!==PATH)fail('invalid-request');
 if(typeof raw.contentType!=='string'||
    !/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(raw.contentType))
  fail('unsupported-content-type');
 if(typeof raw.bodyText!=='string')fail('invalid-request');
 if(Buffer.byteLength(raw.bodyText,'utf8')>MAX_BODY_BYTES)fail('payload-too-large');
 // First reject invalid bearer format WITHOUT invoking any backend.
 try{extractBearer(raw.authorization);}
 catch{fail('authentication-required');}
 if(typeof raw.appCheckToken!=='string'||
    raw.appCheckToken.length<20||raw.appCheckToken.length>MAX_APPCHECK_TOKEN||
    !/^[A-Za-z0-9_.~-]+$/.test(raw.appCheckToken))
  fail('app-check-required');
 let draft;
 try{draft=JSON.parse(raw.bodyText);}
 catch{fail('invalid-report');}
 if(!plainObject(draft)||!contract.validateDraft(draft).ok)
  fail('invalid-report');
 return Object.freeze({authorization:raw.authorization,
  appCheckToken:raw.appCheckToken,draft:Object.freeze(draft)});
}
function publicError(e){
 const code=(e instanceof RequestGateError||
    e instanceof ReviewAuthenticationError||e instanceof IntakeError)&&
    Object.hasOwn(ERROR_STATUS,e.code)?e.code:'temporarily-unavailable';
 return Object.freeze({
  statusCode:ERROR_STATUS[code],
  body:Object.freeze({ok:false,code})
 });
}
function createOfflineRequestGate({verifyAppCheckToken,allowedAppIds,receiveVerified}={}){
 if(typeof verifyAppCheckToken!=='function'||typeof receiveVerified!=='function'||
    !Array.isArray(allowedAppIds)||allowedAppIds.length<1||
    allowedAppIds.length>20||
    allowedAppIds.some(x=>typeof x!=='string'||!/^[-A-Za-z0-9:_.]{5,180}$/.test(x)))
  throw new TypeError('Trusted App Check verifier, explicit app IDs and authenticated receiving handler required');
 const allowed=new Set(allowedAppIds);
 if(allowed.size!==allowedAppIds.length)throw new TypeError('Duplicate allowed App Check app ID');
 return async function handle(request){
  try{
   const parsed=parseRequest(request);
   let proof;
   try{proof=await verifyAppCheckToken(parsed.appCheckToken);}
   catch{fail('app-check-required');}
   if(!proof||typeof proof!=='object'||typeof proof.appId!=='string'||
      !allowed.has(proof.appId))fail('app-check-required');
   // App Check proves app origin only when verified by a *real trusted SDK*.
   // Verified Firebase ID-token identity and enrollment still come from
   // V99-G / V99-J; neither UID nor role may enter this request envelope.
   const result=await receiveVerified(Object.freeze({
    authorization:parsed.authorization,draft:parsed.draft
   }));
   if(!result||typeof result!=='object'||Object.keys(result).length!==3||
      result.status!=='received'||typeof result.receiptId!=='string'||
      !/^MR-\d{8}-[A-F0-9]{12}$/.test(result.receiptId)||
      typeof result.alreadyReceived!=='boolean')
    fail('temporarily-unavailable');
   return Object.freeze({
    statusCode:200,
    body:Object.freeze({
     ok:true,status:'received',receiptId:result.receiptId,
     alreadyReceived:result.alreadyReceived
    })
   });
  }catch(e){return publicError(e);}
 };
}
module.exports=Object.freeze({
 PATH,MAX_BODY_BYTES,MAX_APPCHECK_TOKEN,
 RequestGateError,parseRequest,publicError,createOfflineRequestGate
});
