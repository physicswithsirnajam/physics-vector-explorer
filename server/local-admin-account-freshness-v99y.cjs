'use strict';
/**
 * V99-Y — LOCAL FIREBASE AUTH EMULATOR ONLY.
 *
 * A previously minted ID token may retain its old admin:true custom claim
 * until refreshed. Verify CURRENT account state with Admin Auth getUser()
 * on every trusted administrator request, AFTER verifyIdToken(token,true).
 *
 * This does not grant access. All existing services independently enforce
 * emulator-only project/hosts, issuer/audience/subject, verified token claims
 * and the immutable server-owned UID allowlist BEFORE invoking this helper.
 * No cache, no token issuance, no database writes and no production backend.
 *
 * Limit: role revocation concurrent with an in-flight Firestore transaction
 * cannot retroactively cancel a committed write. Application-wide shutdown
 * and operational controls are separate release gates.
 */
const UID=/^[A-Za-z0-9_-]{1,128}$/;
const PROJECT='demo-psn-v99f-firestore';
const FS_HOST='127.0.0.1:8089';
const AUTH_HOST='127.0.0.1:9099';
const ERRORS=new Set([
 'authentication-required','verified-email-required',
 'admin-access-required','temporarily-unavailable'
]);
async function checkFreshLocalAdmin({adminAuth,verified,allowedAdminUids}={}){
 // Fail closed if someone tries to call it outside the test-only backend.
 if(process.env.GCLOUD_PROJECT!==PROJECT||
    process.env.FIRESTORE_EMULATOR_HOST!==FS_HOST||
    process.env.FIREBASE_AUTH_EMULATOR_HOST!==AUTH_HOST||
    process.env.GOOGLE_APPLICATION_CREDENTIALS)
  return 'temporarily-unavailable';
 if(!adminAuth||typeof adminAuth.getUser!=='function'||
    adminAuth.app?.options?.projectId!==PROJECT||
    !verified||typeof verified!=='object'||
    typeof verified.uid!=='string'||!UID.test(verified.uid)||
    !(allowedAdminUids instanceof Set))
  return 'temporarily-unavailable';

 if(verified.admin!==true||!allowedAdminUids.has(verified.uid))
  return 'admin-access-required';
 if(verified.email_verified!==true)
  return 'verified-email-required';

 let fresh;
 try{fresh=await adminAuth.getUser(verified.uid);}
 catch(error){
  // A removed user should not retain server access. Any other emulator/Auth
  // outage returns the same safe unavailable code; no SDK error is exposed.
  return error?.code==='auth/user-not-found'?
   'authentication-required':'temporarily-unavailable';
 }
 if(!fresh||fresh.uid!==verified.uid||
    typeof fresh.disabled!=='boolean'||
    typeof fresh.emailVerified!=='boolean')
  return 'temporarily-unavailable';
 if(fresh.disabled)return 'authentication-required';
 if(!fresh.emailVerified)return 'verified-email-required';
 if(fresh.customClaims?.admin!==true)return 'admin-access-required';
 return null;
}
module.exports=Object.freeze({ERRORS,checkFreshLocalAdmin});
