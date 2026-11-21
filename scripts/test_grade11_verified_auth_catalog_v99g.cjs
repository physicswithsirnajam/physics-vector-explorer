#!/usr/bin/env node
'use strict';
/* V99-G: Verify real Firebase Authentication Emulator ID tokens, then call
 * an UNDEPLOYED, locally simulated receive() with the FULL 2250-question
 * public Grade XI source index. Never contact production Firebase.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {initializeApp:initializeAdmin,deleteApp:deleteAdmin}=require('firebase-admin/app');
const {getAuth:adminAuthFor}=require('firebase-admin/auth');
const {initializeApp:initializeClient,deleteApp:deleteClient}=require('firebase/app');
const {getAuth,connectAuthEmulator,createUserWithEmailAndPassword,reload,signOut}=
 require('firebase/auth');
const {buildDraft,validateDraft}=require('../shared/mcq-review-contract-v99a.js');
const {createVerifiedReviewBoundary,ReviewAuthenticationError}=
 require('../server/verified-report-boundary-v99g.cjs');
const {loadApprovedCatalog,TOTAL,EXPECTED}=require('../server/approved-practice-catalog-v99g.cjs');
const {createIntakeService,IntakeError}=require('../server/mcq-review-intake-v99e.cjs');

const PROJECT='demo-psn-v99g-auth-catalog',HOST='127.0.0.1:9099';
const root=path.resolve(__dirname,'..');
const dir=path.join(root,'qa-artifacts/verified-auth-catalog-v99g');
const results=[];
function ok(label){results.push(label);console.log('V99-G PASS:',label);}
async function denied(promise,code){
 await assert.rejects(promise,e=>e instanceof ReviewAuthenticationError&&e.code===code);
}
function serialTransaction(){
 const reports=new Map(),limits=new Map();
 let tail=Promise.resolve();
 return {
  reports,limits,
  runTransaction:async func=>{
   let release;
   const next=new Promise(r=>release=r);
   const before=tail;tail=next;await before;
   try{
    const writes=[];
    const tx={
     getReport:async id=>reports.get(id)||null,
     getRate:async id=>limits.get(id)||null,
     createReport:(id,record)=>writes.push(()=>reports.set(id,record)),
     setRate:(id,value)=>writes.push(()=>limits.set(id,value))
    };
    const result=await func(tx);
    writes.forEach(write=>write());
    return result;
   }finally{release();}
  }
 };
}
async function run(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT,'Only local demo Auth project is permitted');
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,HOST,'Refuse production Auth fallback');
 assert.ok(!process.env.GOOGLE_APPLICATION_CREDENTIALS,'No production service credentials permitted');
 fs.mkdirSync(dir,{recursive:true});
 const catalog=await loadApprovedCatalog();
 assert.equal(catalog.total,TOTAL);
 assert.equal(TOTAL,2250);
 assert.deepEqual({...catalog.counts},EXPECTED);
 const ids=catalog.ids();
 assert.equal(ids.length,2250);
 assert.equal(new Set(ids).size,2250);
 const byUnit={};
 for(const id of ids){
  const entry=await catalog.lookup(id);
  assert.ok(entry&&entry.publicPractice===true&&entry.id===id);
  assert.ok(entry.unit>=1&&entry.unit<=6);
  assert.ok(entry.sourceQuestionNumber>=1&&entry.sourceQuestionNumber<=5000);
  assert.equal(typeof entry.bankVersion,'string');
  assert.deepEqual(Object.keys(entry),[
   'id','unit','sourceQuestionNumber','bankVersion','publicPractice'
  ],'trusted lookup returns only source metadata, never answer or question text');
  const draft=buildDraft({
   unit:entry.unit,questionId:entry.id,sourceQuestionNumber:entry.sourceQuestionNumber,
   bankVersion:entry.bankVersion,category:'other',note:''
  });
  assert.equal(validateDraft(draft).ok,true,
   'canonical source ID must be accepted for every one of 2250 original MCQs');
  (byUnit[entry.unit]??=[]).push(entry);
 }
 assert.equal(await catalog.lookup('XI-U06-FAKE-9999'),null);
 assert.ok(ids.some(id=>id.startsWith('g11-u03-master-')));
 assert.ok(ids.some(id=>id.startsWith('g11-u04-master-')));
 assert.ok(ids.some(id=>id.startsWith('g11-u05-master-')));
 assert.ok(ids.some(id=>id.startsWith('XI-U06-T61-')));
 ok('all 2250 original public MCQs across six units, including master IDs, map to allowlisted no-answer reference records');

 const admin=initializeAdmin({projectId:PROJECT},'v99g-admin-auth-emulator');
 const client=initializeClient({
  apiKey:'demo-v99g-only-not-a-real-key',projectId:PROJECT,
  authDomain:PROJECT+'.firebaseapp.com'
 },'v99g-browser-auth-emulator');
 try{
  const auth=getAuth(client);
  connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});
  const serverAuth=adminAuthFor(admin);
  const first=await createUserWithEmailAndPassword(auth,'verified-demo@example.test','DemoPassword-12345!');
  const uid=first.user.uid;
  let raw=await first.user.getIdToken();
  const unverifiedDecoded=await serverAuth.verifyIdToken(raw,true);
  assert.equal(unverifiedDecoded.uid,uid);
  assert.notEqual(unverifiedDecoded.email_verified,true);

  const fakeTx=serialTransaction();
  let submitted=0;
  const receiver=createIntakeService({
   enrollmentLookup:async u=>({
    uid:u,grade:11,board:'fbise',status:'active',type:'independent'
   }),
   questionLookup:catalog.lookup,
   runTransaction:fakeTx.runTransaction,
   now:()=>Date.parse('2026-11-22T13:00:00.000Z')
  });
  const handler=createVerifiedReviewBoundary({
   verifyIdToken:async (token,checkRevoked)=>{
    assert.equal(checkRevoked,true,'must request server-side revoked-token verification');
    return serverAuth.verifyIdToken(token,true);
   },
   receive:async x=>{submitted++;return receiver(x);},
   projectId:PROJECT
  });
  const source=byUnit[5].find(q=>q.id.startsWith('g11-u05-master-'));
  assert.ok(source,'full source map includes Unit 5 lowercase master IDs');
  const report=buildDraft({
   unit:5,questionId:source.id,sourceQuestionNumber:source.sourceQuestionNumber,
   bankVersion:source.bankVersion,category:'missing-context',
   note:'Synthetic student concern about a source figure.'
  });

  await denied(handler({authorization:'Bearer '+raw,draft:report}),'verified-email-required');
  assert.equal(submitted,0,'unverified identity blocked before intake');
  ok('real Firebase Auth emulator token is rejected when email has not been verified');

  await serverAuth.updateUser(uid,{emailVerified:true});
  await reload(first.user);
  raw=await first.user.getIdToken(true);
  const verified=await serverAuth.verifyIdToken(raw,true);
  assert.equal(verified.uid,uid);
  assert.equal(verified.email_verified,true);
  assert.equal(verified.aud,PROJECT);
  assert.equal(verified.sub,uid);
  assert.equal(verified.iss,'https://securetoken.google.com/'+PROJECT);
  const accepted=await handler({authorization:'Bearer '+raw,draft:report});
  assert.equal(accepted.status,'received');
  assert.equal(accepted.alreadyReceived,false);
  assert.match(accepted.receiptId,/^MR-\d{8}-[A-F0-9]{12}$/);
  assert.equal(fakeTx.reports.size,1);
  assert.equal([...fakeTx.reports.values()][0].ownerUid,uid);
  assert.equal([...fakeTx.reports.values()][0].questionId,source.id);
  assert.equal([...fakeTx.reports.values()][0].correctOptionId,undefined);
  const duplicate=await handler({authorization:'Bearer '+raw,draft:report});
  assert.equal(duplicate.alreadyReceived,true);
  assert.equal(duplicate.receiptId,accepted.receiptId);
  assert.equal(fakeTx.reports.size,1);
  ok('server Admin SDK verifies actual emulator Firebase ID token before an original Unit 5 master-source report is acknowledged');

  for(const malformed of [
   {},{authorization:'Basic '+raw,draft:report},
   {authorization:'Bearer NOT-A-JWT',draft:report},
   {authorization:'Bearer '+raw+'.tamper',draft:report},
   {authorization:'Bearer '+raw,draft:report,uid:'attacker'},
   {authorization:'Bearer '+raw,draft:report,admin:true},
   {authorization:'Bearer '+raw,draft:report,emailVerified:true},
   {authorization:'Bearer '+raw,draft:report,callerIdentity:{uid:'admin',emailVerified:true}}
  ]){
   const code=Object.keys(malformed).some(k=>!['authorization','draft'].includes(k))?'invalid-request':'authentication-required';
   await denied(handler(malformed),code);
  }
  ok('missing, tampered, non-Bearer and browser-forged UID, admin and email claims are rejected');

  const fakeVerified={
   ...verified,aud:'different-demo-project'
  };
  const wrongProject=createVerifiedReviewBoundary({
   projectId:PROJECT,verifyIdToken:async()=>fakeVerified,
   receive:async()=>{throw Error('Should never reach receiver');}
  });
  await denied(wrongProject({authorization:'Bearer '+raw,draft:report}),'authentication-required');
  const wrongSubject=createVerifiedReviewBoundary({
   projectId:PROJECT,verifyIdToken:async()=>({...verified,sub:'different-uid'}),
   receive:async()=>{throw Error('Should never reach receiver');}
  });
  await denied(wrongSubject({authorization:'Bearer '+raw,draft:report}),'authentication-required');
  const revokedRequired=createVerifiedReviewBoundary({
   projectId:PROJECT,verifyIdToken:async (_token,checkRevoked)=>{
    assert.equal(checkRevoked,true);
    throw Error('mock token revoked');
   },
   receive:async()=>{throw Error('Should never reach receiver');}
  });
  await denied(revokedRequired({authorization:'Bearer '+raw,draft:report}),'authentication-required');
  ok('mismatched project/subject and failed revoked-token verification are denied before intake');

  // Caller supplies only a report DRAFT; future sender cannot choose status,
  // identity, stored scores, teacher role or any unexpected report keys.
  const forbidden={...report,ownerUid:'attacker'};
  await assert.rejects(handler({authorization:'Bearer '+raw,draft:forbidden}),
   e=>e instanceof IntakeError&&e.code==='invalid-report');
  assert.equal(fakeTx.reports.size,1);
  ok('validated Firebase identity cannot be replaced through draft payload fields');

  await signOut(auth);
 }finally{
  await deleteClient(client);
  await deleteAdmin(admin);
 }
 const summary={
  version:'V99-G',environment:'LOCAL FIREBASE AUTH EMULATOR ONLY',
  demoProjectId:PROJECT,realFirebaseAdminIdTokenVerification:true,
  verifiedEmailRequired:true,revocationVerificationRequested:true,
  productionFirebaseTouched:false,productionRulesChanged:false,
  httpCallableEndpointDeployed:false,studentSubmissionLive:false,teacherInboxLive:false,
  publicPracticeMCQTotal:catalog.total,counts:catalog.counts,bankVersions:catalog.bankVersions,
  onlyPublicReferenceFields:true,
  outcomes:results
 };
 fs.writeFileSync(path.join(dir,'audit.json'),JSON.stringify(summary,null,2)+'\n');
 fs.writeFileSync(path.join(dir,'report.md'),[
  '# V99-G — Auth Emulator and Complete Public MCQ Source-Reference Verification','',
  '**Only demo Firebase Authentication Emulator; no real student account, production credential, Firestore write or deployed endpoint.**','',
  'Validated all '+TOTAL+' public MCQ source references through the exact V55 bank adapter, including original lowercase Unit 3/4/5 master IDs. All source item projections include only ID, unit, source number and version, never the answer key.','',
  'Admin SDK successfully verified emulator ID tokens with revoked-token checking requested. Unverified/malformed/tampered tokens and browser-forged identity/role inputs were rejected.','',
  ...results.map(x=>'- PASS: '+x),'',
  'The request boundary has no actual HTTP/Callable export. The dummy receiver uses an in-memory transaction. Real Firestore Admin transactions were tested separately in V99-F.','',
  'WARNING: parsing repository-controlled browser adapter JS with Node vm during build-time is not a security boundary. Produce a static reviewed manifest before any production deployment.',''
 ].join('\n'));
 console.log('V99-G FINISHED: all 2250 source MCQs, real Firebase Auth Emulator verification and safe undeployed boundary; no production access.');
}
run().catch(err=>{console.error('V99-G FAILED:',String(err.stack||err).slice(0,1500));process.exitCode=1;});
