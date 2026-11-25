'use strict';
/**
 * V155 — LOCAL FIREBASE EMULATORS ONLY. Four-item Grade XI U7 Topic 7.1
 * teacher recommendation rehearsal (Q10/Q15/Q62/Q76).
 *
 * NO HTTP endpoint, browser import, live Firebase deployment, answer-key
 * publication, actual academic approval or student scoring. A recommendation
 * is NOT a scientific/cognitive signoff. Client SDK Rules must deny direct
 * access, including for teacher/admin browser claims.
 *
 * Firebase Admin SDK bypasses Rules; independently validate each caller,
 * trust only server-loaded source records, bind decisions to exact question
 * revision and use an atomic immutable audit write.
 */
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const {extractBearer}=require('./verified-report-boundary-v99g.cjs');
const {PROJECT,FS_HOST,AUTH_HOST}=require('./local-classroom-provisioner-v143.cjs');
const ROOT=path.resolve(__dirname,'..');
const ID=/^[A-Za-z0-9_-]{1,128}$/;
const QUESTION=/^XI-U07-T071-Q(010|015|062|076)$/;
const FIRST_PASS='quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json';
const CANDIDATES='quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv';
const COLLECTION='unit07Topic71TeacherReviewPilot';
const AUDIT='unit07Topic71TeacherReviewPilotAudit';
const DECISIONS=new Set(['supports-candidate-wording','needs-revision']);
const CODES=new Set([
 'invalid-request','authentication-required','verified-email-required',
 'teacher-access-required','source-revision-mismatch','conflict','temporarily-unavailable'
]);
const OFF=()=>false;
class PilotReviewError extends Error{
 constructor(code){super(code);this.code=code;this.name='PilotReviewError';}
}
function deny(code){throw new PilotReviewError(code);}
function plain(x){
 return x!==null&&typeof x==='object'&&!Array.isArray(x)&&
  (Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
}
function exact(x,keys){
 if(!plain(x)||Object.keys(x).length!==keys.length||
   keys.some(k=>!Object.hasOwn(x,k)))deny('invalid-request');
}
function sha(s){return crypto.createHash('sha256').update(s,'utf8').digest('hex');}
function sourceSpecs(){
 const ledger=JSON.parse(fs.readFileSync(path.join(ROOT,FIRST_PASS),'utf8'));
 const q=fs.readFileSync(path.join(ROOT,CANDIDATES),'utf8');
 const lines=q.trimEnd().split('\n');
 if(ledger.version!=='V154'||ledger.entries.length!==80||lines.length!==80||
   ledger.teacherScienceSignoffs!==0||ledger.unit7ScoredReleaseCount!==0||
   ledger.originalOwnerAnswerLettersAndExplanationsIncluded!==false)
  throw new Error('V155 missing original V154 teacher HOLD source');
 const ret=new Map();
 for(const number of [10,15,62,76]){
  const data=ledger.entries[number-1],parts=lines[number-1].split('\t');
  const id='XI-U07-T071-Q'+String(number).padStart(3,'0');
  if(data.id!==id||data.sourceNumber!==number||parts.length!==5||
     data.academicScienceDecision!=='PENDING'||
     data.academicCognitiveDecision!=='PENDING'||
     data.eligibleForScoredStudentRelease!==false||
     data.originalWordAnswerKeyIndependentlyApproved!==false||
     !/^[a-f0-9]{64}$/.test(data.originalFullRowSha256)||
     parts.some(s=>s.length===0)||new Set(parts.slice(1)).size!==4)
   throw new Error('V155 untrusted or incomplete source item '+id);
  ret.set(id,Object.freeze({
   id,number,originalSha256:data.originalFullRowSha256,
   candidateSha256:sha(lines[number-1]),
   issue:number===10?'original-explanation-attribution':
     number===15?'source-sulphur-stem':
     number===62?'source-glass-stem':'source-polythene-candidate-and-original-explanation',
   explanationRepairStillRequired:number===10||number===76
  }));
 }
 return ret;
}
function localOnly(db,auth){
 if(process.env.GCLOUD_PROJECT!==PROJECT||
   process.env.FIRESTORE_EMULATOR_HOST!==FS_HOST||
   process.env.FIREBASE_AUTH_EMULATOR_HOST!==AUTH_HOST||
   process.env.GOOGLE_APPLICATION_CREDENTIALS)
  throw new Error('V155 refuses real projects, production credentials and nonlocal hosts');
 if(!db||db.projectId!==PROJECT||typeof db.doc!=='function'||
   typeof db.runTransaction!=='function'||
   !auth||auth.app?.options?.projectId!==PROJECT||
   typeof auth.verifyIdToken!=='function'||typeof auth.getUser!=='function')
  throw new TypeError('V155 requires trusted local Admin SDK Auth and Firestore');
}
function createLocalTopic71TeacherReviewPilot({
 firestore,adminAuth,allowedReviewerUids,isPilotEnabled=OFF,now=Date.now
}={}){
 localOnly(firestore,adminAuth);
 if(!Array.isArray(allowedReviewerUids)||allowedReviewerUids.length<1||
    allowedReviewerUids.length>5||
    allowedReviewerUids.some(u=>typeof u!=='string'||!ID.test(u))||
    new Set(allowedReviewerUids).size!==allowedReviewerUids.length)
  throw new TypeError('V155 requires immutable server-owned explicit reviewer UID list');
 if(typeof isPilotEnabled!=='function'||typeof now!=='function')
  throw new TypeError('V155 requires trusted server switch and clock');
 const reviewers=new Set(allowedReviewerUids);
 const specs=sourceSpecs();
 async function enabled(){
  try{return await isPilotEnabled()===true;}catch{return false;}
 }
 async function authorize(req,keys){
  if(!(await enabled()))deny('temporarily-unavailable');
  exact(req,keys);
  let token;
  try{token=extractBearer(req.authorization);}
  catch{deny('authentication-required');}
  let claims;
  try{claims=await adminAuth.verifyIdToken(token,true);}
  catch{deny('authentication-required');}
  if(!plain(claims)||claims.aud!==PROJECT||
     claims.iss!=='https://securetoken.google.com/'+PROJECT||
     typeof claims.uid!=='string'||!ID.test(claims.uid)||
     claims.uid!==claims.sub)deny('authentication-required');
  if(claims.email_verified!==true)deny('verified-email-required');
  if(claims.teacher!==true||claims.admin===true||
     !reviewers.has(claims.uid))deny('teacher-access-required');
  let fresh;
  try{fresh=await adminAuth.getUser(claims.uid);}
  catch{deny('authentication-required');}
  if(!fresh||fresh.uid!==claims.uid||fresh.disabled===true)
   deny('authentication-required');
  if(fresh.emailVerified!==true)deny('verified-email-required');
  if(fresh.customClaims?.teacher!==true||fresh.customClaims?.admin===true)
   deny('teacher-access-required');
  let directory;
  try{directory=await firestore.doc('teacherDirectory/'+claims.uid).get();}
  catch{deny('temporarily-unavailable');}
  const d=directory.exists?directory.data():null;
  if(!plain(d)||d.schemaVersion!==1||
     d.teacherUid!==claims.uid||d.status!=='active')
   deny('teacher-access-required');
  if(!(await enabled()))deny('temporarily-unavailable');
  return claims.uid;
 }
 function docId(item,uid){
  return 'rq_'+sha('u07t71-review:v1\0'+item.id+'\0'+
   item.originalSha256+'\0'+item.candidateSha256+'\0'+uid).slice(0,48);
 }
 function isoNow(){
  const x=now();
  if(!Number.isSafeInteger(x)||x<0||!Number.isFinite(new Date(x).getTime()))
   deny('temporarily-unavailable');
  return new Date(x).toISOString();
 }
 function safe(fn){
  return async req=>{
   try{return Object.freeze({ok:true,...await fn(req)});}
   catch(e){return Object.freeze({ok:false,code:e instanceof PilotReviewError&&
     CODES.has(e.code)?e.code:'temporarily-unavailable'});}
  };
 }
 const listPilotItems=safe(async request=>{
  const uid=await authorize(request,['authorization']);
  const items=[];
  for(const item of specs.values()){
   const ref=firestore.doc(COLLECTION+'/'+docId(item,uid));
   let snap;
   try{snap=await ref.get();}catch{deny('temporarily-unavailable');}
   const existing=snap.exists?snap.data():null;
   if(existing&&(!plain(existing)||existing.questionId!==item.id||
     existing.originalSha256!==item.originalSha256||
     existing.candidateSha256!==item.candidateSha256||
     existing.reviewerUid!==uid||existing.status!=='advisory-only'||
     !DECISIONS.has(existing.recommendation)||existing.scoredReleaseApproved!==false))
    deny('temporarily-unavailable');
   items.push(Object.freeze({
    questionId:item.id,sourceNumber:item.number,
    originalSha256:item.originalSha256,candidateSha256:item.candidateSha256,
    issue:item.issue,explanationRepairStillRequired:item.explanationRepairStillRequired,
    recommendation:existing?existing.recommendation:null,
    teacherAcademicSignoff:'PENDING',studentScoredRelease:'HOLD'
   }));
  }
  return Object.freeze({items:Object.freeze(items),count:4});
 });
 const recordPilotRecommendation=safe(async request=>{
  const uid=await authorize(request,[
   'authorization','questionId','originalSha256','candidateSha256','recommendation'
  ]);
  const id=request.questionId;
  if(typeof id!=='string'||!QUESTION.test(id)||
     !DECISIONS.has(request.recommendation)||
     typeof request.originalSha256!=='string'||
     typeof request.candidateSha256!=='string')
   deny('invalid-request');
  const item=specs.get(id);
  if(!item||request.originalSha256!==item.originalSha256||
     request.candidateSha256!==item.candidateSha256)
   deny('source-revision-mismatch');
  const time=isoNow(),reviewId=docId(item,uid);
  const ref=firestore.doc(COLLECTION+'/'+reviewId);
  const auditRef=firestore.doc(AUDIT+'/'+reviewId);
  let alreadyRecorded=false;
  try{
   await firestore.runTransaction(async tx=>{
    if(!(await enabled()))deny('temporarily-unavailable');
    const [existing,auditSnap]=await Promise.all([tx.get(ref),tx.get(auditRef)]);
    if(existing.exists){
     const row=existing.data();
     if(!plain(row)||row.questionId!==id||
       row.originalSha256!==item.originalSha256||
       row.candidateSha256!==item.candidateSha256||
       row.reviewerUid!==uid||row.status!=='advisory-only'||
       row.scoredReleaseApproved!==false||!auditSnap.exists)
      deny('temporarily-unavailable');
     if(row.recommendation!==request.recommendation)deny('conflict');
     alreadyRecorded=true;
     return;
    }
    if(auditSnap.exists)deny('temporarily-unavailable');
    if(!(await enabled()))deny('temporarily-unavailable');
    tx.create(ref,{
     schemaVersion:1,kind:'grade11-topic71-teacher-recommendation-pilot',
     questionId:id,sourceNumber:item.number,
     originalSha256:item.originalSha256,candidateSha256:item.candidateSha256,
     reviewerUid:uid,recommendation:request.recommendation,
     requiresExplanationRepair:item.explanationRepairStillRequired,
     status:'advisory-only',teacherScientificSignoff:'PENDING',
     teacherCognitiveSignoff:'PENDING',sourceAnswerKeyCertified:false,
     scoredReleaseApproved:false,createdAtIso:time
    });
    tx.create(auditRef,{
     schemaVersion:1,kind:'topic71-teacher-pilot-audit',
     questionId:id,reviewDocumentId:reviewId,
     reviewerUid:uid,originalSha256:item.originalSha256,
     candidateSha256:item.candidateSha256,
     recommendation:request.recommendation,createdAtIso:time,
     scoredReleaseApproved:false
    });
   });
  }catch(e){if(e instanceof PilotReviewError)throw e;deny('temporarily-unavailable');}
  return Object.freeze({questionId:id,status:'advisory-only',alreadyRecorded,
   academicSignoff:'PENDING',scoredRelease:'HOLD'});
 });
 return Object.freeze({listPilotItems,recordPilotRecommendation});
}
module.exports=Object.freeze({
 createLocalTopic71TeacherReviewPilot,QUESTION_IDS:Object.freeze([10,15,62,76]),
 COLLECTION,AUDIT,PROJECT
});
