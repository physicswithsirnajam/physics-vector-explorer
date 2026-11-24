'use strict';
/**
 * V144: LOCAL AUTH+FIRESTORE EMULATORS ONLY — UNDEPLOYED teacher-only
 * READ-ONLY class and roster projection. NO UI, HTTP/callable endpoint,
 * Firestore client access, roles/claims/membership edits or live deployment.
 *
 * Auth every call: verifyIdToken(token,true), strict token/project checks,
 * fresh getUser for revocation/disabled state, current teacher:true claim,
 * trusted server-owned teacherDirectory status and class teacherUid.
 *
 * Admin Firestore bypasses client Security Rules: independent authorization
 * in this trusted module is non-negotiable. Public V142 client rule remains
 * DENY for teacher/class records, including browser teacher:true claims.
 */
const {extractBearer}=require('./verified-report-boundary-v99g.cjs');
const {PROJECT,FS_HOST,AUTH_HOST}=require('./local-classroom-provisioner-v143.cjs');

const UID=/^[A-Za-z0-9_-]{1,128}$/;
const CLASS_ID=/^[A-Za-z0-9_-]{3,56}$/;
const MAX_CLASSES=10;
const MAX_MEMBERSHIPS=50;
const allowedCodes=new Set([
 'invalid-request','authentication-required','verified-email-required',
 'teacher-access-required','class-access-required','temporarily-unavailable'
]);
const off=()=>false;
class TeacherClassroomError extends Error{
 constructor(code){super(code);this.name='TeacherClassroomError';this.code=code;}
}
function deny(code){throw new TeacherClassroomError(code);}
function plain(o){
 return o!==null&&typeof o==='object'&&!Array.isArray(o)&&
   (Object.getPrototypeOf(o)===Object.prototype||Object.getPrototypeOf(o)===null);
}
function requestFields(req,required){
 if(!plain(req)||Object.keys(req).length!==required.length||
    required.some(k=>!Object.hasOwn(req,k)))deny('invalid-request');
}
function validClass(row,id,teacherUid){
 return plain(row)&&row.schemaVersion===1&&row.classId===id&&
  CLASS_ID.test(id)&&row.teacherUid===teacherUid&&
  row.grade===11&&row.status==='draft'&&
  typeof row.title==='string'&&row.title.trim().length>=3&&
  row.title.length<=80&&!/[\u0000-\u001F\u007F<>]/.test(row.title)&&
  typeof row.createdByUid==='string'&&UID.test(row.createdByUid);
}
function requireLocal({firestore,adminAuth,isTeacherReaderEnabled}){
 if(process.env.GCLOUD_PROJECT!==PROJECT||
   process.env.FIRESTORE_EMULATOR_HOST!==FS_HOST||
   process.env.FIREBASE_AUTH_EMULATOR_HOST!==AUTH_HOST||
   process.env.GOOGLE_APPLICATION_CREDENTIALS)
  throw Error('V144 refuses nonlocal/demo Firebase environments or service credentials');
 if(!firestore||firestore.projectId!==PROJECT||
   typeof firestore.doc!=='function'||typeof firestore.collection!=='function'||
   typeof firestore.runTransaction!=='function'||
   !adminAuth||adminAuth.app?.options?.projectId!==PROJECT||
   typeof adminAuth.verifyIdToken!=='function'||typeof adminAuth.getUser!=='function'||
   typeof isTeacherReaderEnabled!=='function')
  throw TypeError('V144 requires local trusted Admin SDK interfaces and enable callback');
}
function createLocalTeacherClassroomReader({
 firestore,adminAuth,isTeacherReaderEnabled=off
}={}){
 requireLocal({firestore,adminAuth,isTeacherReaderEnabled});
 async function verify(request,required){
  let enabled=false;
  try{enabled=await isTeacherReaderEnabled()===true}catch{enabled=false}
  if(!enabled)deny('temporarily-unavailable');
  requestFields(request,required);
  let jwt;
  try{jwt=extractBearer(request.authorization)}
  catch{deny('authentication-required')}
  let claims;
  try{claims=await adminAuth.verifyIdToken(jwt,true)}
  catch{deny('authentication-required')}
  if(!plain(claims)||claims.aud!==PROJECT||
    claims.iss!=='https://securetoken.google.com/'+PROJECT||
    typeof claims.uid!=='string'||!UID.test(claims.uid)||
    claims.uid!==claims.sub)
   deny('authentication-required');
  if(claims.email_verified!==true)deny('verified-email-required');
  // An admin browser cannot silently use a teacher-only operation.
  if(claims.teacher!==true||claims.admin===true)
   deny('teacher-access-required');
  let fresh;
  try{fresh=await adminAuth.getUser(claims.uid)}
  catch{deny('authentication-required')}
  if(!fresh||fresh.uid!==claims.uid||fresh.disabled===true)
   deny('authentication-required');
  if(fresh.emailVerified!==true)deny('verified-email-required');
  if(fresh.customClaims?.teacher!==true||
    fresh.customClaims?.admin===true)
   deny('teacher-access-required');
  let directory;
  try{directory=await firestore.doc('teacherDirectory/'+claims.uid).get()}
  catch{deny('temporarily-unavailable')}
  const d=directory.exists?directory.data():null;
  if(!plain(d)||d.schemaVersion!==1||
    d.teacherUid!==claims.uid||d.status!=='active')
   deny('teacher-access-required');
  return claims.uid;
 }
 function guarded(fn){
  return async request=>{
   try{return Object.freeze({ok:true,...await fn(request)})}
   catch(e){
    // Auth/Firestore errors and all private contents are never exposed.
    return Object.freeze({ok:false,code:e instanceof TeacherClassroomError&&
      allowedCodes.has(e.code)?e.code:'temporarily-unavailable'});
   }
  };
 }
 async function ownedClass(id,teacherUid){
  let snap;
  try{snap=await firestore.doc('classes/'+id).get()}
  catch{deny('temporarily-unavailable')}
  if(!snap.exists||!validClass(snap.data(),id,teacherUid))
   deny('class-access-required'); // nonexistent vs another teacher: same code
  return Object.freeze({classId:id,title:snap.data().title,grade:11,status:'draft'});
 }
 const listOwnClasses=guarded(async request=>{
  const uid=await verify(request,['authorization']);
  let rows;
  try{
   rows=await firestore.collection('classes')
    .where('teacherUid','==',uid).limit(MAX_CLASSES+1).get();
  }catch{deny('temporarily-unavailable')}
  if(rows.size>MAX_CLASSES)deny('temporarily-unavailable');
  const classes=[];
  for(const s of rows.docs){
   const data=s.data();
   if(!validClass(data,s.id,uid))deny('temporarily-unavailable');
   classes.push(Object.freeze({classId:s.id,title:data.title,
    grade:11,status:'draft'}));
  }
  classes.sort((a,b)=>a.classId.localeCompare(b.classId));
  return Object.freeze({classes:Object.freeze(classes),count:classes.length});
 });
 const getClassRoster=guarded(async request=>{
  const uid=await verify(request,['authorization','classId']);
  const id=request.classId;
  if(typeof id!=='string'||!CLASS_ID.test(id))deny('invalid-request');
  const cls=await ownedClass(id,uid);
  let rows;
  try{
   rows=await firestore.collection('classes').doc(id)
    .collection('members').limit(MAX_MEMBERSHIPS+1).get();
  }catch{deny('temporarily-unavailable')}
  if(rows.size>MAX_MEMBERSHIPS)deny('temporarily-unavailable');
  const assigned=[];
  for(const s of rows.docs){
   const r=s.data();
   if(!plain(r)||r.schemaVersion!==1||r.classId!==id||
      r.studentUid!==s.id||!UID.test(s.id)||
      r.role!=='student'||!['assigned','revoked'].includes(r.status))
    deny('temporarily-unavailable');
   if(r.status==='assigned')assigned.push(s.id);
  }
  assigned.sort();
  // Return only IDs that the admin placed in THIS teacher-owned class.
  // Never read users/{uid}, user attempts, grades, email, private profile,
  // all-class directory, or unrelated class memberships.
  return Object.freeze({classId:cls.classId,title:cls.title,
   grade:cls.grade,status:cls.status,
   assignedStudentUids:Object.freeze(assigned),assignedCount:assigned.length});
 });
 return Object.freeze({listOwnClasses,getClassRoster});
}
module.exports=Object.freeze({
 createLocalTeacherClassroomReader,MAX_CLASSES,MAX_MEMBERSHIPS
});
