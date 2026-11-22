'use strict';
/**
 * V99-L — App Check Admin SDK interface adapter, LOCAL / OFFLINE REVIEW ONLY.
 *
 * No Firebase initialization, HTTP/Callable endpoint, app attestation provider,
 * production credentials, App Check debug-token registration or deployment.
 *
 * The Firebase Local Emulator Suite does not provide a standard App Check
 * emulator. We can exercise a real Admin SDK's rejection of invalid JWTs in
 * no-credential CI, but NOT prove acceptance of a genuine signed App Check
 * token. Positive outcomes here are explicitly injected test doubles.
 *
 * The SDK's verifyToken() is the trusted production verification operation:
 * Firebase documentation: https://firebase.google.com/docs/app-check/custom-resource-backend
 */
const {createOfflineRequestGate}=require('./offline-review-request-gate-v99k.cjs');
const DEMO_PROJECT='demo-psn-v99f-firestore';

function createOfflineAdminAppCheckGate({
 adminAppCheck,allowedAppIds,receiveVerified
}={}){
 if(process.env.GCLOUD_PROJECT!==DEMO_PROJECT||
    process.env.GOOGLE_APPLICATION_CREDENTIALS)
  throw new Error('V99-L is restricted to a synthetic, credential-free demo project');
 if(!adminAppCheck||typeof adminAppCheck.verifyToken!=='function'||
    !adminAppCheck.app||
    adminAppCheck.app.options?.projectId!==DEMO_PROJECT)
  throw new TypeError('Matching demo-project Firebase Admin App Check required');
 const verifyAppCheckToken=async token=>{
  // A real SDK implementation must verify signature, issuer, audience and
  // expiration. Never parse JWT claims yourself or trust a browser-supplied ID.
  //
  // This is ordinary multi-use verification, *not* one-time replay protection.
  // Enabling replay protection later would require limited-use client tokens,
  // SDK verifyToken(token,{consume:true}), role/permission configuration, and
  // rejecting alreadyConsumed in the response.
  const verified=await adminAppCheck.verifyToken(token,{consume:false});
  if(!verified||typeof verified!=='object'||
     typeof verified.appId!=='string'||verified.alreadyConsumed===true)
   throw new Error('Invalid trusted App Check SDK verification result');
  return Object.freeze({appId:verified.appId});
 };
 return createOfflineRequestGate({
  verifyAppCheckToken,allowedAppIds,receiveVerified
 });
}
module.exports=Object.freeze({DEMO_PROJECT,createOfflineAdminAppCheckGate});
