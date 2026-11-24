'use strict';
/**
 * V143 — trusted administrator ONLY, LOCAL AUTH+FIRESTORE EMULATORS ONLY.
 *
 * Administrator provisions pre-existing, verified Firebase Auth users as
 * teachers, creates private draft classes and attaches/revokes student UIDs.
 * NO HTTP/callable endpoint, browser import, notification/email/password
 * creation, cloud deployment or production credentials.
 *
 * IMPORTANT: Admin SDK bypasses Firestore browser Rules. This module requires
 * independent server-side authentication, fresh Auth account state, explicit
 * admin UID allowlist and a fail-closed disabled-by-default launch switch.
 * Teacher/client cannot provision or change membership.
 */
const {extractBearer}=require('./verified-report-boundary-v99g.cjs');

const PROJECT='demo-psn-v143-classrooms';
const FS_HOST='127.0.0.1:8089';
const AUTH_HOST='127.0.0.1:9099';
const UID=/^[A-Za-z0-9_-]{1,128}$/;
const CLASS_ID=/^[A-Za-z0-9_-]{3,56}$/;
const NOOP=()=>false;
const CODES=new Set([
 'invalid-request','authentication-required','verified-email-required',
 'admin-access-required','invalid-target','conflict','temporarily-unavailable'
]);
class ClassroomProvisionError extends Error{
 constructor(code){super(code);this.name='ClassroomProvisionError';this.code=code}
}
function deny(code){throw new ClassroomProvisionError(code)}
function plain(x){
 return x!==null&&typeof x==='object'&&!Array.isArray(x)&&
  (Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
}
function requestFields(req,keys){
 if(!plain(req)||Object.keys(req).some(k=>!keys.includes(k))||
    keys.some(k=>!Object.hasOwn(req,k)))deny('invalid-request');
}
function requireUid(uid){
 if(typeof uid!=='string'||!UID.test(uid))deny('invalid-request');
 return uid;
}
function cleanText(value){
 if(typeof value!=='string'||value.trim().length<3||
    value.trim().length>80||/[\u0000-\u001F\u007F<>]/.test(value))
  deny('invalid-request');
 return value.trim();
}
function emulatorOnly(firestore,adminAuth){
 if(process.env.GCLOUD_PROJECT!==PROJECT||
    process.env.FIRESTORE_EMULATOR_HOST!==FS_HOST||
    process.env.FIREBASE_AUTH_EMULATOR_HOST!==AUTH_HOST||
    process.env.GOOGLE_APPLICATION_CREDENTIALS)
  throw new Error('V143 refuses nonlocal Firebase projects, endpoints and service accounts');
 if(!firestore||firestore.projectId!==PROJECT||
    typeof firestore.runTransaction!=='function'||
    typeof firestore.doc!=='function'||typeof firestore.collection!=='function'||
    !adminAuth||adminAuth.app?.options?.projectId!==PROJECT||
    typeof adminAuth.verifyIdToken!=='function'||
    typeof adminAuth.getUser!=='function'||
    typeof adminAuth.setCustomUserClaims!=='function')
  throw new Error('V143 requires matching trusted local Admin SDK Auth/Firestore');
}
function createLocalClassroomProvisioner({
 firestore,adminAuth,allowedAdminUids,isProvisioningEnabled=NOOP
}={}){
 emulatorOnly(firestore,adminAuth);
 if(!Array.isArray(allowedAdminUids)||allowedAdminUids.length<1||
   allowedAdminUids.length>5||
   allowedAdminUids.some(x=>typeof x!=='string'||!UID.test(x))||
   new Set(allowedAdminUids).size!==allowedAdminUids.length)
  throw new TypeError('V143 requires a server-configured immutable admin UID allowlist');
 if(typeof isProvisioningEnabled!=='function')
  throw new TypeError('V143 enable callback must be server-owned and default OFF');
 const allow=new Set(allowedAdminUids);
 async function authorized(request,keys){
  if(await Promise.resolve(isProvisioningEnabled()).catch(()=>false)!==true)
   deny('temporarily-unavailable');
  requestFields(request,keys);
  let token;
  try{token=extractBearer(request.authorization)}
  catch{deny('authentication-required')}
  let decoded;
  try{decoded=await adminAuth.verifyIdToken(token,true)}
  catch{deny('authentication-required')}
  if(!plain(decoded)||decoded.aud!==PROJECT||
     decoded.iss!=='https://securetoken.google.com/'+PROJECT||
     typeof decoded.uid!=='string'||decoded.uid!==decoded.sub||
     !UID.test(decoded.uid))deny('authentication-required');
  if(decoded.email_verified!==true)deny('verified-email-required');
  if(decoded.admin!==true||!allow.has(decoded.uid))deny('admin-access-required');
  let fresh;
  try{fresh=await adminAuth.getUser(decoded.uid)}
  catch{deny('authentication-required')}
  if(!fresh||fresh.uid!==decoded.uid||fresh.disabled===true)
   deny('authentication-required');
  if(fresh.emailVerified!==true)deny('verified-email-required');
  if(fresh.customClaims?.admin!==true)deny('admin-access-required');
  return Object.freeze({uid:decoded.uid});
 }
 async function target(uid,{teacher=false}={}){
  requireUid(uid);
  let record;
  try{record=await adminAuth.getUser(uid)}
  catch(e){
   if(e?.code==='auth/user-not-found')deny('invalid-target');
   deny('temporarily-unavailable');
  }
  if(record.uid!==uid||record.disabled||!record.emailVerified||
     record.customClaims?.admin===true)
    deny('invalid-target');
  if(teacher&&record.customClaims?.teacher!==true)
   deny('invalid-target');
  if(!teacher&&record.customClaims?.teacher===true)
   deny('invalid-target');
  return record;
 }
 function audit(tx,record){
  const ref=firestore.collection('teacherClassAudit').doc();
  tx.create(ref,{schemaVersion:1,kind:'classroom-provisioning',
   ...record,createdAtIso:new Date().toISOString()});
 }
 async function handle(fn){
  try{return {ok:true,...await fn()}}
  catch(e){
   // Never echo tokens, email, Auth SDK stack, Firestore error text or data.
   return {ok:false,code:e instanceof ClassroomProvisionError&&
    CODES.has(e.code)?e.code:'temporarily-unavailable'};
  }
 }
 return Object.freeze({
  provisionTeacher:request=>handle(async()=>{
   const admin=await authorized(request,['authorization','teacherUid']);
   const uid=requireUid(request.teacherUid);
   if(uid===admin.uid||allow.has(uid))deny('invalid-target');
   const user=await target(uid);
   const ref=firestore.doc('teacherDirectory/'+uid);
   // Claim is issued only after an administrator-owned, fail-closed
   // PENDING directory record exists. A failed Auth/DB step cannot produce
   // an ACTIVE directory and unverified user permissions.
   await firestore.runTransaction(async tx=>{
    const snap=await tx.get(ref);
    if(snap.exists)deny('conflict');
    tx.create(ref,{schemaVersion:1,teacherUid:uid,
     status:'pending-claim',createdByUid:admin.uid,
     createdAtIso:new Date().toISOString()});
    audit(tx,{operation:'teacher-pending',actorUid:admin.uid,
     subjectUid:uid});
   });
   await adminAuth.setCustomUserClaims(uid,{...(user.customClaims||{}),teacher:true});
   await firestore.runTransaction(async tx=>{
    const snap=await tx.get(ref);
    if(!snap.exists||snap.data().status!=='pending-claim'||
       snap.data().createdByUid!==admin.uid)
     deny('temporarily-unavailable');
    tx.update(ref,{status:'active',activatedAtIso:new Date().toISOString()});
    audit(tx,{operation:'teacher-activated',actorUid:admin.uid,
      subjectUid:uid});
   });
   return {teacherUid:uid,status:'active'};
  }),
  createClass:request=>handle(async()=>{
   const admin=await authorized(request,
     ['authorization','teacherUid','classId','title','grade']);
   const teacherUid=requireUid(request.teacherUid);
   const classId=request.classId;
   if(typeof classId!=='string'||!CLASS_ID.test(classId)||
      request.grade!==11)deny('invalid-request');
   const title=cleanText(request.title);
   await target(teacherUid,{teacher:true});
   const dir=firestore.doc('teacherDirectory/'+teacherUid);
   const ref=firestore.doc('classes/'+classId);
   await firestore.runTransaction(async tx=>{
    const [teacherSnap,classSnap]=await Promise.all([tx.get(dir),tx.get(ref)]);
    if(!teacherSnap.exists||teacherSnap.data().status!=='active')
     deny('invalid-target');
    if(classSnap.exists)deny('conflict');
    tx.create(ref,{schemaVersion:1,classId,grade:11,title,
      teacherUid,status:'draft',createdByUid:admin.uid,
      createdAtIso:new Date().toISOString()});
    audit(tx,{operation:'class-created',actorUid:admin.uid,
      classId,teacherUid});
   });
   return {classId,teacherUid,status:'draft'};
  }),
  attachStudent:request=>handle(async()=>{
   const admin=await authorized(request,
     ['authorization','classId','studentUid']);
   const {classId,studentUid}=request;
   if(typeof classId!=='string'||!CLASS_ID.test(classId))
    deny('invalid-request');
   requireUid(studentUid);
   if(studentUid===admin.uid||allow.has(studentUid))
    deny('invalid-target');
   await target(studentUid);
   const classRef=firestore.doc('classes/'+classId);
   const dirRef=uid=>firestore.doc('teacherDirectory/'+uid);
   const enrollRef=firestore.doc('academicEnrollments/'+studentUid);
   const memberRef=firestore.doc('classes/'+classId+'/members/'+studentUid);
   await firestore.runTransaction(async tx=>{
    const [cls,enroll,old]=await Promise.all([
     tx.get(classRef),tx.get(enrollRef),tx.get(memberRef)
    ]);
    if(!cls.exists||cls.data().status!=='draft'||
       cls.data().grade!==11)deny('invalid-target');
    const enrollment=enroll.exists?enroll.data():null;
    if(!enrollment||enrollment.uid!==studentUid||
       enrollment.grade!==11||enrollment.status!=='active')
     deny('invalid-target');
    const directory=await tx.get(dirRef(cls.data().teacherUid));
    if(!directory.exists||directory.data().status!=='active')
     deny('invalid-target');
    if(old.exists)deny('conflict'); // revoked membership requires explicit admin review
    tx.create(memberRef,{schemaVersion:1,classId,studentUid,
      role:'student',status:'assigned',createdByUid:admin.uid,
      createdAtIso:new Date().toISOString()});
    audit(tx,{operation:'student-assigned',actorUid:admin.uid,
     classId,subjectUid:studentUid});
   });
   return {classId,studentUid,status:'assigned'};
  }),
  revokeStudent:request=>handle(async()=>{
   const admin=await authorized(request,
     ['authorization','classId','studentUid']);
   const {classId,studentUid}=request;
   if(typeof classId!=='string'||!CLASS_ID.test(classId))
    deny('invalid-request');
   requireUid(studentUid);
   const ref=firestore.doc('classes/'+classId+'/members/'+studentUid);
   await firestore.runTransaction(async tx=>{
    const snap=await tx.get(ref);
    if(!snap.exists||snap.data().status!=='assigned'||
       snap.data().classId!==classId||
       snap.data().studentUid!==studentUid)
     deny('invalid-target');
    tx.update(ref,{status:'revoked',revokedByUid:admin.uid,
      revokedAtIso:new Date().toISOString()});
    audit(tx,{operation:'student-revoked',actorUid:admin.uid,
      classId,subjectUid:studentUid});
   });
   return {classId,studentUid,status:'revoked'};
  })
 });
}
module.exports=Object.freeze({
 PROJECT,FS_HOST,AUTH_HOST,createLocalClassroomProvisioner
});
