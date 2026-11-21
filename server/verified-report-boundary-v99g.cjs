'use strict';
/**
 * V99-G — trusted request boundary for an UNDEPLOYED MCQ intake service.
 * ONLY the server Firebase Admin SDK's verifyIdToken(token, true) result may
 * become callerIdentity. Client JSON must never supply uid/emailVerified/admin.
 *
 * No HTTP route, Cloud Function export, network call, token database or
 * Firebase initialization here. Real ID tokens are tested only against the
 * LOCAL Firebase Authentication Emulator. Production use needs App Check,
 * anti-abuse review, a trusted service deployment and full catalog controls.
 */
const ALLOWED_INPUT=new Set(['authorization','draft']);
class ReviewAuthenticationError extends Error{
 constructor(code='authentication-required'){
  super(code);this.name='ReviewAuthenticationError';this.code=code;
 }
}
function error(code){throw new ReviewAuthenticationError(code);}
function extractBearer(value){
 if(typeof value!=='string'||value.length>8192)error('authentication-required');
 const match=/^Bearer ([-A-Za-z0-9._~+/=]{20,8192})$/.exec(value);
 if(!match||match[1].split('.').length!==3)error('authentication-required');
 return match[1];
}
function createVerifiedReviewBoundary({verifyIdToken,receive,projectId}={}){
 if(typeof verifyIdToken!=='function'||typeof receive!=='function'||
   typeof projectId!=='string'||!/^[-a-z0-9]{6,64}$/.test(projectId))
  throw new TypeError('Trusted Admin token verifier, receiving service and project ID required');

 return async function submit(request){
  if(!request||typeof request!=='object'||Array.isArray(request)||
     Object.keys(request).some(key=>!ALLOWED_INPUT.has(key)))
   error('invalid-request');
  // No account identity or email-verification flags are accepted as inputs.
  const token=extractBearer(request.authorization);
  let verified;
  try{verified=await verifyIdToken(token,true);} // checkRevoked MUST remain enabled
  catch{error('authentication-required');}
  if(!verified||typeof verified!=='object'||
     verified.aud!==projectId||
     verified.iss!=='https://securetoken.google.com/'+projectId||
     typeof verified.uid!=='string'||verified.uid!==verified.sub||
     !/^[A-Za-z0-9_-]{1,128}$/.test(verified.uid))
   error('authentication-required');
  if(verified.email_verified!==true)error('verified-email-required');
  // Project owner/admin/teacher claims are irrelevant to student submission.
  // Only the verified UID and email status are passed to the strict V99-E core.
  return receive({
   callerIdentity:Object.freeze({uid:verified.uid,emailVerified:true}),
   draft:request.draft
  });
 };
}
module.exports=Object.freeze({
 ReviewAuthenticationError,extractBearer,createVerifiedReviewBoundary
});
