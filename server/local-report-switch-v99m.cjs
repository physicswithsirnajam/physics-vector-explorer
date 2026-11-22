'use strict';
/**
 * V99-M — fail-closed, LIVE-UNDEPLOYED, local-only emergency OFF switch.
 *
 * This is NOT an HTTP listener, callable Cloud Function, production runtime
 * config, or student submission feature. It composes existing V99-J/L/K gates
 * only against the same local Firebase emulator project.
 *
 * OFF is the default. The sole enable signal is a callback supplied by
 * trusted SERVER code, never a browser request/claim. A failed or non-true
 * callback denies. The signal is checked before request validation/App Check,
 * and again immediately before the Auth+Firestore receive handler.
 *
 * It does not cancel transactions already in flight when disabled. A future
 * production service would need independent deployment/traffic controls.
 */
const {createLocalReviewPipeline}=require('./local-review-pipeline-v99j.cjs');
const {createOfflineAdminAppCheckGate}=
 require('./offline-admin-appcheck-v99l.cjs');
const {RequestGateError,publicError}=
 require('./offline-review-request-gate-v99k.cjs');

function createLocalSwitchableReviewGate({
 firestore,adminAuth,adminAppCheck,allowedAppIds,now=Date.now,
 isEnabled=()=>false
}={}){
 if(typeof isEnabled!=='function')
  throw new TypeError('Only a trusted server-owned report-enable callback is accepted');
 // These constructors enforce exact demo Firebase project and loopback
 // emulators, genuine Admin Auth API, and an App Check verification interface.
 const receive=createLocalReviewPipeline({firestore,adminAuth,now});
 const enabled=async()=>{
  try{return await isEnabled()===true;}catch{return false;}
 };
 const secured=createOfflineAdminAppCheckGate({
  adminAppCheck,allowedAppIds,
  receiveVerified:async request=>{
   // Deny if switched OFF while App Check was being verified. Does not claim
   // atomic cancellation of any transaction already started.
   if(!(await enabled()))
    throw new RequestGateError('temporarily-unavailable');
   return receive(request);
  }
 });
 return async function handle(request){
  if(!(await enabled()))
   return publicError(new RequestGateError('temporarily-unavailable'));
  return secured(request);
 };
}
module.exports=Object.freeze({createLocalSwitchableReviewGate});
