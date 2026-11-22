#!/usr/bin/env node
'use strict';
/** V100-L real-source inventory + adversarial offline mutations, no live Firebase. */
const assert=require('node:assert/strict');
const audit=require('./audit_grade11_appcheck_browser_entrypoints_v100l.cjs');
const snapshot=audit.sourceSnapshot();
const groups=[];
function pass(s){groups.push(s);console.log('V100-L PASS:',s);}
function changeFile(p,edit){
 const files={...snapshot.checkedFiles,[p]:edit(snapshot.checkedFiles[p])};
 const js={...snapshot.javascriptFiles};
 if(Object.hasOwn(js,p))js[p]=files[p];
 return {...snapshot,checkedFiles:files,javascriptFiles:js};
}
function mustReject(name,record){
 assert.throws(()=>audit.inspect(record),undefined,name);
}
function main(){
 const report=audit.inspect(snapshot);
 assert.equal(report.version,'V100-L');
 assert.equal(report.browserEntrypointCount,4);
 assert.deepEqual(report.browserEntrypoints.map(x=>x.module),[
  'portal/app.js','portal/attempt-sync.js','portal/course-lesson.js','portal/secure-lesson.js'
 ]);
 assert.ok(report.browserEntrypoints.every(x=>
  x.pinnedFirebaseWebSdk==='13.1.0'&&
  x.appCheckCurrentlyInitialized===false&&x.realBrowserProviderProof===false));
 pass('four actual HTML module links each independently initialize the pinned Firebase 13.1.0 SDK');

 assert.equal(report.sharedFirebaseServiceConsumer.length,1);
 assert.equal(report.sharedFirebaseServiceConsumer[0].module,'portal/academic-enrollment.js');
 assert.equal(report.sharedFirebaseServiceConsumer[0].importedBy,'portal/app.js');
 pass('academic-enrollment consumes caller-provided Firestore instance; no fifth standalone entrypoint');

 for(const e of audit.ENTRIES){
  mustReject('missing HTML link '+e.page,changeFile(e.page,s=>
   s.replace('src="'+e.script+'"','src="./missing-module.js"')));
  mustReject('mismatched version '+e.module,changeFile(e.module,s=>
   s.replace('firebasejs/13.1.0/firebase-auth.js','firebasejs/12.0.0/firebase-auth.js')));
 }
 pass('source drift in any of the four page/module links or Firebase SDK versions fails closed');

 for(const e of audit.ENTRIES){
  mustReject('missing known initializer '+e.module,changeFile(e.module,s=>
   s.replace(e.initializer,'/* no firebase application initialization */')));
  mustReject('live client App Check '+e.module,changeFile(e.module,s=>
   s+'\ninitializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider("UNREGISTERED")});\n'));
 }
 pass('missing initialization and unexpected App Check setup are refused on every route');

 const phantom='shared/accidental-firebase-init.js';
 const extra="import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';\n"+
  "const app=initializeApp(firebaseConfig);";
 mustReject('untracked fifth Firebase entrypoint',{
  ...snapshot,trackedPaths:snapshot.trackedPaths.concat([phantom]),
  javascriptFiles:{...snapshot.javascriptFiles,[phantom]:extra}
 });
 pass('fifth unreviewed Firebase browser initializer requires a new inventory update');

 mustReject('enrollment module detached',changeFile('portal/app.js',s=>
  s.replace("from './academic-enrollment.js?v=10'","from './wrong-enrollment.js'")));
 mustReject('enrollment unexpectedly gets own Firebase application',
  changeFile('portal/academic-enrollment.js',s=>
   s+'\nconst app=initializeApp(firebaseConfig);\n'));
 pass('shared academic enrollment remains accounted for within student portal Auth/Firestore access');

 mustReject('new custom domain',{...snapshot,
  trackedPaths:snapshot.trackedPaths.concat(['CNAME'])});
 mustReject('changed public app config',
  changeFile('portal/firebase-config.js',s=>
   s.replace('physics-with-sir-najam-portal.firebaseapp.com','unapproved.example.net')
  ));
 pass('domain and public Firebase configuration changes require explicit owner review');

 assert.equal(report.providerRegistrationStatus,'UNREGISTERED — OWNER REPORTED');
 assert.equal(report.serviceEnforcementStatus,'NOT ENFORCED — OWNER REPORTED');
 assert.equal(report.originalBrowserAppCheckSetupPresent,false);
 assert.equal(report.firebaseConsoleIndependentlyQueried,false);
 assert.equal(report.realProviderProofReceived,false);
 assert.equal(report.safeToEnforceAppCheck,false);
 assert.equal(report.studentReportAction,'COPY ONLY');
 assert.equal(report.liveReportSendingEnabled,false);
 pass('all live/provider/enforcement claims remain explicitly blocked and no simulated success is mislabeled real');

 console.log('V100-L FINISHED: '+groups.length+
  ' OFFLINE inventory/regression groups passed; no service setting changed.');
}
try{main();}catch(e){console.error('V100-L FAILED: '+String(e.message||e).slice(0,330));process.exitCode=1;}
