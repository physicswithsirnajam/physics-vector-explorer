#!/usr/bin/env node
'use strict';
/**
 * V99-V: CI proves the nonlogged local verifier is correctly gated and real
 * Firebase Admin SDK REJECTS invalid App Check tokens. All positive proof
 * result fixtures in these tests are SYNTHETIC — not real App Check proof.
 */
const assert=require('node:assert/strict');
const {Readable}=require('node:stream');
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const {initializeApp,deleteApp}=require('firebase-admin/app');
const {getAppCheck}=require('firebase-admin/app-check');
const proof=require('./probe_grade11_real_appcheck_token_v99v.cjs');

const groups=[];
function pass(label){groups.push(label);console.log('V99-V PASS:',label);}
function env(extra={}){return{
 PSN_APPCHECK_LOCAL_PROOF:proof.REQUIRED_ACK,
 ...extra
};}
function argv(){return[proof.MODE];}
function goodFakeJwt(){return 'eyJhbGciOiJSUzI1NiJ9.eyJmb28iOiJiYXIifQ.signature-text';}

async function main(){
 assert.equal(proof.PROJECT_ID,'physics-with-sir-najam-portal');
 assert.equal(proof.WEB_APP_ID,'1:158078442603:web:b4738a9875a1d5b1c8a52e');
 assert.equal(proof.MODE,'--verify-real-appcheck-token-stdin');
 assert.equal(proof.LIMIT_BYTES,8192);
 pass('pins the existing public Firebase project and web app ID, no caller-selected project or app');

 assert.equal(proof.safeEnvironment({},[],false),'disabled');
 assert.equal(proof.safeEnvironment({},['--help'],false),'disabled');
 assert.equal(proof.safeEnvironment({},argv(),false),'owner-approval-required');
 assert.equal(proof.safeEnvironment(env(),argv(),false),null);
 assert.equal(proof.safeEnvironment(env({CI:'true'}),argv(),false),'runner-forbidden');
 assert.equal(proof.safeEnvironment(env({GITHUB_ACTIONS:'true'}),argv(),false),'runner-forbidden');
 pass('genuine verification OFF by default, rejects CI/GitHub Actions, and requires exact owner mode and acknowledgement');

 for(const name of [
  'GOOGLE_APPLICATION_CREDENTIALS','FIRESTORE_EMULATOR_HOST',
  'FIREBASE_AUTH_EMULATOR_HOST','FIREBASE_APPCHECK_DEBUG_TOKEN',
  'PSN_APPCHECK_DEBUG_TOKEN'
 ])assert.equal(proof.safeEnvironment(env({[name]:'unsafe'}),argv(),false),
  'unexpected-credentials-emulators-or-debug');
 assert.equal(proof.safeEnvironment(env(),argv(),true),'stdin-pipe-required');
 pass('refuses service-account key, emulator environment, debug-provider indicators and echoed interactive terminal input');

 assert.equal(proof.inputFormat(goodFakeJwt()),true);
 for(const invalid of [
  '',null,'not-a-token','a.b.c',
  goodFakeJwt()+'!','a'.repeat(8193),
  'eyJhbGciOiJSUzI1NiJ9.eyJmb28iOiJiYXIifQ.'+'X'.repeat(8100)
 ])assert.equal(proof.inputFormat(invalid),false);
 pass('requires exactly three URL-safe JWT segments and an 8192-byte input cap');

 assert.equal(
  await proof.readBoundedInput(Readable.from([Buffer.from(' \n'+goodFakeJwt()+'\r\n')])),
  goodFakeJwt());
 await assert.rejects(
  ()=>proof.readBoundedInput(Readable.from([Buffer.alloc(8198,65)])),
  /input-too-large/);
 await assert.rejects(
  ()=>proof.readBoundedInput(Readable.from(['not-a-jwt'])),
  /invalid-format/);
 pass('streaming stdin validates token shape, strips only surrounding whitespace and prevents large input');

 assert.equal(proof.validateSdkProof({appId:proof.WEB_APP_ID}),true);
 assert.equal(proof.validateSdkProof({appId:proof.WEB_APP_ID,alreadyConsumed:false}),true);
 assert.equal(proof.validateSdkProof({appId:proof.WEB_APP_ID,alreadyConsumed:true}),false);
 assert.equal(proof.validateSdkProof({appId:'1:OTHER:web:OTHER'}),false);
 assert.equal(proof.validateSdkProof({appId:123}),false);
 assert.equal(proof.validateSdkProof(null),false);
 pass('positive verification RESULT-contract tests are synthetic and reject foreign app IDs or already-consumed results');

 const script=path.resolve(__dirname,'probe_grade11_real_appcheck_token_v99v.cjs');
 const scriptEnv={
  PATH:process.env.PATH||'',
  SystemRoot:process.env.SystemRoot||'',
  WINDIR:process.env.WINDIR||''
 };
 const off=spawnSync(process.execPath,[script],{
  input:goodFakeJwt(),encoding:'utf8',env:scriptEnv
 });
 assert.equal(off.status,0);
 assert.match(off.stdout,/V99-V OFF:/);
 assert.ok(!off.stdout.includes(goodFakeJwt()));
 const unauthorized=spawnSync(process.execPath,[script,proof.MODE],{
  input:goodFakeJwt(),encoding:'utf8',env:scriptEnv
 });
 assert.equal(unauthorized.status,1);
 assert.match(unauthorized.stderr,/V99-V BLOCKED/);
 assert.ok(!unauthorized.stdout.includes(goodFakeJwt()));
 assert.ok(!unauthorized.stderr.includes(goodFakeJwt()));
 pass('subprocess without approval performs no real verification, never logs input token and blocks unauthorized launch');

 const malformed='PRIVATE_NEVER_ECHO_THIS_TOKEN_VALUE_000XYZ';
 const bad=spawnSync(process.execPath,[script,proof.MODE],{
  input:malformed,encoding:'utf8',env:{
   ...scriptEnv,PSN_APPCHECK_LOCAL_PROOF:proof.REQUIRED_ACK
  }
 });
 assert.equal(bad.status,1);
 assert.match(bad.stderr,/V99-V REJECTED/);
 assert.ok(!(bad.stdout+bad.stderr).includes(malformed));
 pass('owner-approved real mode rejects malformed piped data without disclosing it');

 const admin=initializeApp({projectId:'demo-psn-v99f-firestore'},'v99v-invalid-appcheck-ci');
 try{
  await assert.rejects(
   ()=>getAppCheck(admin).verifyToken('not-a-valid-app-check-jwt',{consume:false})
  );
 }finally{await deleteApp(admin);}
 pass('REAL Firebase Admin App Check SDK rejects malformed token; no genuine positive proof performed in CI');

 const fs=require('node:fs');
 const original=fs.readFileSync(script,'utf8');
 assert.ok(original.includes("verifyToken(token,{consume:false})"));
 assert.ok(original.includes('getAppCheck(app)'));
 assert.ok(original.includes("getAppCheck(app).verifyToken(token,{consume:false})"));
 assert.ok(!original.includes('createToken('));
 assert.ok(!original.includes('fetch('));
 assert.ok(!original.includes('firebase deploy'));
 assert.ok(!original.includes("process.env.APP_CHECK_TOKEN"));
 pass('real proof path uses Firebase Admin SDK verification and has no token-minting, browser sender, or deployment');
 console.log('V99-V FINISHED: '+groups.length+
  ' groups passed; real SDK malformed JWT denial only; genuine positive verification NOT YET DONE.');
}
main().catch(e=>{
 console.error('V99-V FAILED: test assertion or SDK negative check did not pass.');
 process.exitCode=1;
});
