#!/usr/bin/env node
'use strict';
/**
 * V99-V — owner-operated, deliberately OFF-by-default proof of a REAL
 * Firebase-signed App Check JWT against the existing public web app ID.
 *
 * This is NOT a server, endpoint, browser script, token issuer, Firebase
 * deployment, production report receiver or authorization workflow.
 * No service-account key, GitHub secret, user ID token or database used.
 *
 * GENUINE positive evidence is NOT produced by CI. For a future owner-
 * approved local invocation, a short-lived App Check token must be obtained
 * via the REAL registered browser provider on an allowed domain, NOT the
 * Firebase debug provider. Token supplied only via piped stdin (never
 * command-line args, environment variables, GitHub, screenshots or chat).
 *
 * The Admin SDK can verify a Firebase-signed token but cannot on its own
 * prove whether it was minted following a debug-provider exchange. That
 * requires separate owner inspection of the web app's actual provider and
 * App Check Console configuration. No replay protection is claimed.
 */
const PROJECT_ID='physics-with-sir-najam-portal';
const WEB_APP_ID='1:158078442603:web:b4738a9875a1d5b1c8a52e';
const REQUIRED_ACK='owner-authorized-real-provider-local-only';
const LIMIT_BYTES=8192;
const MODE='--verify-real-appcheck-token-stdin';

function validateSdkProof(decoded) {
 if(!decoded||typeof decoded!=='object'||Array.isArray(decoded)||
    typeof decoded.appId!=='string'||decoded.appId!==WEB_APP_ID||
    decoded.alreadyConsumed===true)
  return false;
 return true;
}
function inputFormat(token){
 return typeof token==='string'&&token.length>=24&&
  Buffer.byteLength(token,'utf8')<=LIMIT_BYTES&&
  /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token);
}
function safeEnvironment(env,argv,stdinTTY){
 if(!Array.isArray(argv)||argv.length!==1||argv[0]!==MODE)
  return 'disabled';
 if(env.PSN_APPCHECK_LOCAL_PROOF!==REQUIRED_ACK)
  return 'owner-approval-required';
 if(env.GOOGLE_APPLICATION_CREDENTIALS||
    env.FIREBASE_AUTH_EMULATOR_HOST||
    env.FIRESTORE_EMULATOR_HOST||
    env.FIREBASE_APPCHECK_DEBUG_TOKEN||
    env.PSN_APPCHECK_DEBUG_TOKEN)
  return 'unexpected-credentials-emulators-or-debug';
 if(stdinTTY===true)return 'stdin-pipe-required';
 return null;
}
async function readBoundedInput(stream){
 const chunks=[];
 let length=0;
 for await(const part of stream){
  const bytes=Buffer.isBuffer(part)?part:Buffer.from(part);
  length+=bytes.length;
  if(length>LIMIT_BYTES+5)throw Error('input-too-large');
  chunks.push(bytes);
 }
 const raw=Buffer.concat(chunks).toString('utf8');
 const token=raw.trim();
 if(!inputFormat(token))throw Error('invalid-format');
 return token;
}
async function main(){
 const problem=safeEnvironment(process.env,process.argv.slice(2),
  Boolean(process.stdin.isTTY));
 if(problem==='disabled'){
  console.log('V99-V OFF: genuine App Check verification is owner-invoked only. No token requested.');
  return;
 }
 if(problem){
  console.error('V99-V BLOCKED: local owner approval or safe piped-stdin environment missing.');
  process.exitCode=1;return;
 }
 let app;
 try{
  const token=await readBoundedInput(process.stdin);
  const {initializeApp,deleteApp}=require('firebase-admin/app');
  const {getAppCheck}=require('firebase-admin/app-check');
  app=initializeApp({projectId:PROJECT_ID},'v99v-owner-real-appcheck-proof');
  const decoded=await getAppCheck(app).verifyToken(token,{consume:false});
  if(!validateSdkProof(decoded))
   throw Error('not-the-approved-registered-web-app');
  console.log('V99-V VERIFIED: Firebase Admin SDK accepted a signed App Check token for the pinned web-app ID.');
  console.log('V99-V LIMIT: owner must separately confirm real reCAPTCHA Enterprise provider (NOT debug); replay protection, Auth, enrollment and launch remain unverified.');
 }catch{
  // Never log SDK exceptions, token data, raw JWT, app claims, or private
  // environment/config. No token persistence in logs or artifacts.
  console.error('V99-V REJECTED: signed token verification, app-ID match, or safe stdin input failed.');
  process.exitCode=1;
 }finally{
  if(app){
   try{const {deleteApp}=require('firebase-admin/app');await deleteApp(app);}
   catch{process.exitCode=1;}
  }
 }
}
module.exports=Object.freeze({
 PROJECT_ID,WEB_APP_ID,REQUIRED_ACK,LIMIT_BYTES,MODE,
 validateSdkProof,inputFormat,safeEnvironment,readBoundedInput
});
if(require.main===module)main();
