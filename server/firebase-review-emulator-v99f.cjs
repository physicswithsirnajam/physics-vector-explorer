'use strict';
/**
 * V99-F — Real Firestore Admin SDK adapter for a LOCAL EMULATOR ONLY.
 *
 * This module intentionally has NO Firebase app initialization, HTTP endpoint,
 * Cloud Functions exports, or production wiring.
 *
 * In future, a separate trusted HTTP/callable boundary MUST:
 *   1. cryptographically verify a Firebase ID token (and email_verified);
 *   2. never take callerIdentity from client JSON;
 *   3. use server-owned academicEnrollment and approvedQuestion references;
 *   4. apply abuse/App Check protections and authorized admin review;
 *   5. deploy only after inspecting the actual published Firebase policy.
 */
const {createIntakeService}=require('./mcq-review-intake-v99e.cjs');

const PROJECT='demo-psn-v99f-firestore',HOST='127.0.0.1:8089';
const REPORTS='mcqReviewReports',RATES='mcqReviewRate';

function requireLocalDemo(firestore){
 if(process.env.GCLOUD_PROJECT!==PROJECT ||
    process.env.FIRESTORE_EMULATOR_HOST!==HOST)
  throw new Error('V99-F refuses non-demo Firebase projects and nonlocal emulator endpoints');
 if(!firestore||typeof firestore.collection!=='function'||
    typeof firestore.doc!=='function'||typeof firestore.runTransaction!=='function')
  throw new TypeError('A trusted Firebase Admin SDK Firestore instance is required');
 // Firebase Admin Firestore exposes a projectId property.
 if(firestore.projectId!==PROJECT)
  throw new Error('V99-F rejects Firestore clients from unexpected projects');
}
function createEmulatorReviewService({firestore,approvedQuestionLookup,now=Date.now}={}){
 requireLocalDemo(firestore);
 if(typeof approvedQuestionLookup!=='function')
  throw new TypeError('Server-controlled approved-question lookup required');
 const reports=firestore.collection(REPORTS);
 const rate=firestore.collection(RATES);
 const enrollmentLookup=async uid=>{
  // The V99-E core validates the identity before ever invoking this lookup.
  const snap=await firestore.doc('academicEnrollments/'+uid).get();
  return snap.exists?snap.data():null;
 };
 const runTransaction=handler=>firestore.runTransaction(async transaction=>{
  const wrapped={
   getReport:async id=>{
    const snap=await transaction.get(reports.doc(id));
    return snap.exists?snap.data():null;
   },
   getRate:async id=>{
    const snap=await transaction.get(rate.doc(id));
    return snap.exists?snap.data():null;
   },
   createReport:(id,record)=>transaction.create(reports.doc(id),record),
   setRate:(id,record)=>transaction.set(rate.doc(id),record)
  };
  // The underlying V99-E core reads BOTH Firestore documents before
  // scheduling either write, permitting atomic serializable commit/retry.
  return handler(wrapped);
 });
 return createIntakeService({
  enrollmentLookup,questionLookup:approvedQuestionLookup,runTransaction,now
 });
}
module.exports=Object.freeze({
 PROJECT,HOST,REPORTS,RATES,requireLocalDemo,createEmulatorReviewService
});
