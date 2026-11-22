#!/usr/bin/env node
'use strict';
/** V100-K: source-only adversarial checks. No Firebase, DNS or live website. */
const assert=require('node:assert/strict');
const v99w=require('./audit_grade11_appcheck_origin_registration_v99w.cjs');
const v99u=require('./audit_grade11_reporting_launch_lock_v99u.cjs');
const gate=require('./audit_grade11_owner_appcheck_baseline_v100k.cjs');
const snapshot={
 originSnapshot:v99w.readSourceSnapshot(),
 launchSnapshot:v99u.repositorySnapshot()
};
const checks=[];
function pass(label){checks.push(label);console.log('V100-K PASS:',label);}
function observation(change){
 return Object.assign({},gate.OWNER_REPORTED,change);
}
function mutateOriginSource(path,edit){
 const initial=snapshot.originSnapshot;
 return {...snapshot,originSnapshot:{
  ...initial,files:{
   ...initial.files,[path]:edit(initial.files[path])
  }
 }};
}
function main(){
 const result=gate.inspect(snapshot);
 assert.equal(result.website.ownerReportedBrowserHostname,'physicswithsirnajam.github.io');
 assert.equal(result.website.ownerReportedPublicLandingUrl,
  'https://physicswithsirnajam.github.io/physics-vector-explorer/');
 assert.equal(result.firebase.projectId,'physics-with-sir-najam-portal');
 assert.equal(result.firebase.webAppId,'1:158078442603:web:b4738a9875a1d5b1c8a52e');
 pass('user-reported exact repository-scoped GitHub Pages URL and existing public Firebase identity');

 assert.equal(result.firebase.ownerReportedAppCheckRegistration,'unregistered');
 assert.equal(result.firebase.ownerReportedAppCheckProvider,'none');
 assert.equal(result.firebase.ownerReportedFirestoreAppCheckEnforcement,'not-enforced');
 assert.equal(result.firebase.ownerReportedAuthenticationAppCheckEnforcement,'not-enforced');
 assert.equal(result.firebase.currentConsoleStateIndependentlyQueried,false);
 assert.equal(result.website.verifiedByIndependentLiveRequest,false);
 assert.equal(result.website.googleSitesIframeEmbeddingConfirmed,false);
 pass('observations are dated, source-attributed, and never labeled live independent Console/API proof');

 for(const replacement of [
  'http://physicswithsirnajam.github.io/physics-vector-explorer/',
  'https://physicswithsirnajam.github.io/',
  'https://physicswithsirnajam.github.io/physics-vector-explorer/portal/index.html',
  'https://physicswithsirnajam.github.io/physics-vector-explorer/?debug=1',
  'https://physics-with-sir-najam-portal.firebaseapp.com/physics-vector-explorer/'
 ])assert.throws(()=>gate.inspect(snapshot,observation({websiteUrl:replacement})));
 pass('reject unsafe http, host confusion, unconfirmed deep-link and unexpected URL origin/path');

 for(const changed of [
  {appCheckRegistration:'registered'},
  {appCheckProvider:'recaptcha-enterprise'},
  {firestoreAppCheckEnforcement:'enforced'},
  {authenticationAppCheckEnforcement:'enforced'},
  {externalIframeEmbedding:'confirmed'},
  {firebaseWebAppId:'1:wrong:web:wrong'},
  {firebaseProjectId:'other-firebase-project'},
  {observedOn:'2026-12-01'}
 ])assert.throws(()=>gate.inspect(snapshot,observation(changed)));
 pass('cannot fabricate provider enrollment, changed service enforcement, iframe, project or date');

 assert.throws(()=>gate.inspect(mutateOriginSource('portal/firebase-config.js',s=>
  s.replace('physics-with-sir-najam-portal.firebaseapp.com','another.example.org'))));
 assert.throws(()=>gate.inspect(mutateOriginSource('portal/app.js',s=>
  s+'\ninitializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider("fake")});\n')));
 pass('existing Firebase project and client initialization guard still fail closed on source drift');

 const initial=snapshot.originSnapshot;
 assert.throws(()=>gate.inspect({...snapshot,originSnapshot:{
  ...initial,trackedPaths:initial.trackedPaths.concat(['CNAME'])
 }}));
 pass('unapproved future CNAME/domain change requires a new owner-approved origin review');

 const lock=snapshot.launchSnapshot;
 assert.throws(()=>gate.inspect({...snapshot,launchSnapshot:{
  ...lock,sources:{...lock.sources,
   'practice-engine/index.html':lock.sources['practice-engine/index.html']
    .replace('navigator.clipboard.writeText(text)','fetch("/api/grade11/mcq-review")')
  }
 }}));
 pass('Copy-only source drift cannot silently become live report submission');

 assert.equal(result.studentReportAction,'COPY_ONLY');
 assert.equal(result.firebase.genuineProviderSignedAppCheckPositiveVerified,false);
 assert.equal(result.firebase.safeToEnableEnforcement,false);
 assert.equal(result.futureDomainChange.domainRegistrationOrDnsChangedByThisStep,false);
 assert.equal(result.futureDomainChange.mustReassessProviderWebsiteHostnamesBeforeAppCheckRelease,true);
 assert.equal(result.releaseStatus,'BLOCKED — NO LIVE REPORTING OR APPCHECK ENFORCEMENT');
 pass('no positive App Check proof, enforced service, DNS change or live sender is claimed');
 console.log('V100-K FINISHED: '+checks.length+' source-only groups PASS. Real provider and release gates remain BLOCKED.');
}
try{main();}catch(e){
 console.error('V100-K FAILED: '+String(e.message||e).slice(0,300));process.exitCode=1;
}
