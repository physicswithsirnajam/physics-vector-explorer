#!/usr/bin/env node
'use strict';
/**
 * V100-K: reconcile the owner's already-reported website host and Firebase
 * App Check Console statuses with repository source ONLY.
 * No real Console/API inspection, provider registration, token, secret,
 * browser App Check initializer, enforcement, HTTP endpoint or deployment.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const v99w=require('./audit_grade11_appcheck_origin_registration_v99w.cjs');
const v99u=require('./audit_grade11_reporting_launch_lock_v99u.cjs');
const ROOT=path.resolve(__dirname,'..');

// These are owner-reported observations from 22 Nov 2026, not current
// independent Firebase API evidence or approval to change settings.
// Do NOT replace the observed GitHub Pages host with the Firebase authDomain.
const OWNER_REPORTED=Object.freeze({
  observedOn:'2026-11-22',
  websiteUrl:'https://physicswithsirnajam.github.io/physics-vector-explorer/',
  browserHostname:'physicswithsirnajam.github.io',
  firebaseProjectId:'physics-with-sir-najam-portal',
  firebaseWebAppId:'1:158078442603:web:b4738a9875a1d5b1c8a52e',
  appCheckRegistration:'unregistered',
  appCheckProvider:'none',
  firestoreAppCheckEnforcement:'not-enforced',
  authenticationAppCheckEnforcement:'not-enforced',
  externalIframeEmbedding:'not-confirmed'
});
const ALLOWED_STATUSES=Object.freeze([
 'unregistered','none','not-enforced','not-confirmed'
]);
function inspect(snapshot,observation=OWNER_REPORTED){
  assert.ok(snapshot&&snapshot.originSnapshot&&snapshot.launchSnapshot,
    'Must inspect actual repository source snapshots');
  assert.ok(observation&&typeof observation==='object',
    'Owner-reported observation required');
  const source=v99w.inspect(snapshot.originSnapshot);
  const lock=v99u.auditLaunchLock(snapshot.launchSnapshot);
  const u=new URL(observation.websiteUrl);
  assert.equal(u.protocol,'https:');
  assert.equal(u.username,'');
  assert.equal(u.password,'');
  assert.equal(u.port,'');
  assert.equal(u.search,'');
  assert.equal(u.hash,'');
  assert.equal(u.hostname,observation.browserHostname);
  assert.equal(u.hostname,v99w.EXPECTED.candidateHost);
  assert.equal(u.pathname,'/physics-vector-explorer/');
  assert.equal(observation.firebaseProjectId,v99w.EXPECTED.projectId);
  assert.equal(observation.firebaseWebAppId,v99w.EXPECTED.webAppId);
  assert.equal(observation.observedOn,'2026-11-22');
  assert.equal(observation.appCheckRegistration,'unregistered');
  assert.equal(observation.appCheckProvider,'none');
  assert.equal(observation.firestoreAppCheckEnforcement,'not-enforced');
  assert.equal(observation.authenticationAppCheckEnforcement,'not-enforced');
  assert.equal(observation.externalIframeEmbedding,'not-confirmed');
  assert.ok(ALLOWED_STATUSES.includes(observation.appCheckRegistration));
  assert.notEqual(u.hostname,source.firebaseAuthenticationDomain,
    'Auth metadata domain is not the actual GitHub Pages browser origin');
  assert.equal(source.candidateOriginVerifiedFromActualBrowser,false,
    'Source-only V99-W cannot self-upgrade into browser verification');
  assert.equal(source.realAppCheckRegistrationFetchedFromFirebase,false);
  assert.equal(lock.studentReportInterface,'COPY_ONLY');
  assert.equal(lock.safeToEnableStudentReporting,false);
  assert.equal(lock.genuineSignedAppCheckPositiveVerified,false);
  return Object.freeze({
    version:'V100-K',
    evidence:'OWNER-REPORTED 2026-11-22 + REPOSITORY SOURCE ONLY; NOT LIVE FIREBASE API VERIFICATION',
    website:Object.freeze({
      ownerReportedPublicLandingUrl:observation.websiteUrl,
      ownerReportedBrowserHostname:u.hostname,
      verifiedByIndependentLiveRequest:false,
      signedInPortalPathIndependentlyVerified:false,
      googleSitesIframeEmbeddingConfirmed:false,
      expectedAuthDomainIsNotWebsiteHost:true
    }),
    firebase:Object.freeze({
      projectId:source.publicFirebaseProjectId,
      webAppId:source.publicFirebaseWebAppId,
      ownerReportedAppCheckRegistration:observation.appCheckRegistration,
      ownerReportedAppCheckProvider:observation.appCheckProvider,
      ownerReportedFirestoreAppCheckEnforcement:observation.firestoreAppCheckEnforcement,
      ownerReportedAuthenticationAppCheckEnforcement:observation.authenticationAppCheckEnforcement,
      currentConsoleStateIndependentlyQueried:false,
      genuineProviderSignedAppCheckPositiveVerified:false,
      safeToEnableEnforcement:false
    }),
    futureDomainChange:Object.freeze({
      domainRegistrationOrDnsChangedByThisStep:false,
      mustReassessProviderWebsiteHostnamesBeforeAppCheckRelease:true,
      realProviderWebKeyAllowedHostnamesVerified:false
    }),
    studentReportAction:'COPY_ONLY',
    releaseStatus:'BLOCKED — NO LIVE REPORTING OR APPCHECK ENFORCEMENT',
    noLiveFirebaseOrPortalChanges:true
  });
}
function main(){
  try{
    const result=inspect({
      originSnapshot:v99w.readSourceSnapshot(),
      launchSnapshot:v99u.repositorySnapshot()
    });
    const dir=path.join(ROOT,'qa-artifacts/grade11-owner-appcheck-v100k');
    fs.mkdirSync(dir,{recursive:true});
    fs.writeFileSync(path.join(dir,'owner-observed-preflight.json'),
      JSON.stringify(result,null,2)+'\n');
    console.log('V100-K PASS: owner-reported GitHub Pages origin and unregistered/unenforced App Check match source identity.');
    console.log('V100-K HOLD: owner observation is not current live API proof; Copy only, enforcement OFF, future domain needs separate review.');
  }catch(err){
    console.error('V100-K FAILED: '+String(err.message||err).slice(0,320));
    process.exitCode=1;
  }
}
module.exports=Object.freeze({OWNER_REPORTED,inspect});
if(require.main===module)main();
