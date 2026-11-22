/* Physics with Sir Najam — V100-M.
 * Public reCAPTCHA Enterprise SITE KEY (not a secret); registered in Firebase
 * App Check by the owner on 22 November 2026 for physicswithsirnajam.github.io.
 * The monitored browser rollout does NOT enable enforcement, submit MCQ reports,
 * create privileged roles or establish positive signed-token proof.
 *
 * Firestore/Auth are currently MONITORING; preserve student access if a network
 * filter blocks the optional App Check SDK. Real attestation must be checked
 * independently in Firebase Console before anyone considers enforcement.
 */
const SITE_KEY='6Lfx8SwuAAAAAIESGwxZpU5R6qNfK3tHb2sFvHNf';
const APPROVED_HOST='physicswithsirnajam.github.io';
const SDK_URL='https://www.gstatic.com/firebasejs/13.1.0/firebase-app-check.js';

/** Invoke after initializeApp, BEFORE getAuth/getFirestore in each document.
 * Only returns whether SDK initialization succeeded, NOT a real verified token.
 * Optional injected loader/origin allow deterministic OFFLINE regression tests.
 */
export async function initializeAppCheckBeforeServices(firebaseApp,{
 locationLike=globalThis.location,
 loadSdk=()=>import(SDK_URL)
}={}){
 if(!firebaseApp||locationLike?.protocol!=='https:'||
    locationLike?.hostname!==APPROVED_HOST)return false;
 try{
  const sdk=await loadSdk();
  sdk.initializeAppCheck(firebaseApp,{
   provider:new sdk.ReCaptchaEnterpriseProvider(SITE_KEY),
   isTokenAutoRefreshEnabled:true
  });
  return true; // SDK configured; never interpreted as token verified
 }catch{
  // Monitoring mode only: blocked SDK/provider must not prevent sign-in,
  // enrolled lessons or optional saved practice. No tokens/logs persisted.
  return false;
 }
}
