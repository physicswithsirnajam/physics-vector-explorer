'use strict';
/**
 * V99-J — LOCAL EMULATOR-ONLY wiring of previously audited components.
 *
 * No HTTPS/Callable endpoint, Cloud Function export, production Firebase SDK
 * app initialization, or student-facing Send control. Do not deploy this.
 * All environments must match the explicit loopback demo project.
 */
const {PROJECT,HOST:FS_HOST,requireLocalDemo,createEmulatorReviewService}=
 require('./firebase-review-emulator-v99f.cjs');
const {createVerifiedReviewBoundary}=
 require('./verified-report-boundary-v99g.cjs');
const approved=require('./pinned-approved-review-catalog-v99i.cjs');
const AUTH_HOST='127.0.0.1:9099';

function createLocalReviewPipeline({firestore,adminAuth,now=Date.now}={}){
 if(process.env.GCLOUD_PROJECT!==PROJECT||
    process.env.FIRESTORE_EMULATOR_HOST!==FS_HOST||
    process.env.FIREBASE_AUTH_EMULATOR_HOST!==AUTH_HOST||
    process.env.GOOGLE_APPLICATION_CREDENTIALS)
  throw new Error('V99-J refuses real projects, credentials or nonlocal emulators');
 requireLocalDemo(firestore);
 if(!adminAuth||typeof adminAuth.verifyIdToken!=='function'||
   !adminAuth.app||adminAuth.app.options?.projectId!==PROJECT)
  throw new TypeError('V99-J requires Admin Auth from the matching demo project');
 if(approved.total!==2250||typeof approved.lookup!=='function')
  throw new Error('V99-J requires the reviewed pinned Grade XI MCQ reference catalog');
 const receive=createEmulatorReviewService({
  firestore,approvedQuestionLookup:approved.lookup,now
 });
 return createVerifiedReviewBoundary({
  verifyIdToken:(token,checkRevoked)=>{
   if(checkRevoked!==true)throw new Error('Revocation checks must be enabled');
   return adminAuth.verifyIdToken(token,true);
  },
  receive,projectId:PROJECT
 });
}
module.exports=Object.freeze({PROJECT,AUTH_HOST,FS_HOST,createLocalReviewPipeline});
