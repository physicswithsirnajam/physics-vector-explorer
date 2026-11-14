/* Physics with Sir Najam · Portal V16
   Public application shell. No lesson text, answer keys, keys or access tokens here.
   Firestore security rules authorize the DOCUMENT request independently.
   Never rely on JavaScript checks alone for access control. */
import {firebaseConfig} from './firebase-config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import {getAuth,onAuthStateChanged,reload,getIdToken,signOut} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import {getFirestore,doc,getDocFromServer} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';

const $=id=>document.getElementById(id);
const lessonId=new URL(location.href).searchParams.get('id')||'g11-u01-uncertainty-workshop-01';
const validId=/^g11-u\d{2}-[a-z0-9-]{1,64}$/.test(lessonId);
let auth=null,db=null,sequence=0;

function clearLesson(){
  $('resource').hidden=true;
  $('resource-title').textContent='';
  $('resource-summary').textContent='';
  $('resource-meta').textContent='';
  $('resource-body').replaceChildren();
  $('print').hidden=true;
}
function state(heading,message,{login=false,retry=false,logout=false}={}){
  $('state-heading').textContent=heading;
  $('state-message').textContent=message;
  $('login').hidden=!login;
  $('retry').hidden=!retry;
  $('signout').hidden=!logout;
}
function safeText(value,max){
  return typeof value==='string'?value.slice(0,max):'';
}
function renderLesson(data){
  $('resource-title').textContent=safeText(data.title,160)||'Enrolled student lesson';
  $('resource-summary').textContent=safeText(data.summary,500);
  $('resource-meta').textContent='Grade '+data.grade+' · Unit '+data.unit+' · '+safeText(data.slo,50)+' · '+safeText(data.board,20).toUpperCase();
  const body=$('resource-body');
  body.replaceChildren();
  const blocks=safeText(data.body,90000).split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
  for(const block of blocks){
    if(block.startsWith('## ')){
      const heading=document.createElement('h3');
      heading.textContent=block.slice(3,200);
      body.append(heading);
    }else if(block==='---'){
      body.append(document.createElement('hr'));
    }else{
      const paragraph=document.createElement('p');
      paragraph.textContent=block;
      body.append(paragraph);
    }
  }
  $('resource').hidden=false;
  $('print').hidden=false;
}
async function verifyAndLoad(user){
  const run=++sequence;
  clearLesson();
  if(!validId){state('Invalid lesson link','The lesson identifier is not recognized. Return to My Learning Hub.');return;}
  if(!user){state('Sign in required','Sign in and complete your Grade XI / FBISE enrollment to access this lesson.',{login:true});return;}
  state('Verifying your account','Checking email verification and active course permissions…',{logout:true});
  try{
    if(!user.emailVerified)await reload(user);
    if(run!==sequence)return;
    if(!user.emailVerified){
      state('Email verification required','Complete email verification through your account and sign in again.',{login:true,logout:true});
      return;
    }
    // The refreshed token carries the latest email_verified claim for Firestore rules.
    await getIdToken(user,true);
    if(run!==sequence)return;
    state('Retrieving your lesson','The Firebase server is checking your academic enrollment…',{logout:true});
    const snapshot=await getDocFromServer(doc(db,'courseLessons',lessonId));
    if(run!==sequence)return;
    if(!snapshot.exists()){
      state('Lesson not available','This lesson has not yet been published in Firestore.',{retry:true,logout:true});return;
    }
    const data=snapshot.data();
    if(data.grade!==11||data.board!=='fbise'||data.status!=='published'||data.type!=='lesson'||data.accessTier!=='enrolled'||!data.body){
      state('Lesson not available','The lesson is not ready for the enrolled learner catalogue.',{retry:true,logout:true});return;
    }
    renderLesson(data);
    state('Access granted','This lesson was retrieved with your verified Grade XI enrollment.',{logout:true});
  }catch(error){
    if(run!==sequence)return;
    clearLesson();
    if(error?.code==='permission-denied'){
      state('Access denied','Your account does not have permission to read this lesson. Verify your email and Grade XI enrollment, or contact the administrator.',{login:true,retry:true,logout:true});
    }else if(error?.code==='unavailable'){
      state('Temporarily unavailable','Please check your connection and try again.',{retry:true,logout:true});
    }else{
      state('Unable to load the lesson','The Firebase resource could not be retrieved. Please contact the administrator if this continues.',{retry:true,logout:true});
    }
  }
}
function boot(){
  if(!validId){state('Invalid lesson link','The lesson identifier is not recognized.');return;}
  if(!Object.values(firebaseConfig).every(v=>typeof v==='string'&&v.trim()&&!v.includes('REPLACE_'))){
    state('Portal configuration required','The existing Firebase configuration must be restored. Never add a service-account key to public code.');return;
  }
  try{
    auth=getAuth(initializeApp(firebaseConfig));
    db=getFirestore();
    onAuthStateChanged(auth,user=>{void verifyAndLoad(user);},
      ()=>{clearLesson();state('Unable to verify sign-in','Return to the Student Portal and try again.',{login:true});});
  }catch{
    clearLesson();state('Unable to start secure lesson','Check the existing Firebase portal configuration.');
  }
}
$('retry').addEventListener('click',()=>{void verifyAndLoad(auth?.currentUser);});
$('print').addEventListener('click',()=>{if(!$('resource').hidden)window.print();});
$('signout').addEventListener('click',async()=>{
  clearLesson();sequence++;
  state('Signing out…','Removing lesson content from this view.');
  try{await signOut(auth);}catch{state('Sign-out was not completed','Please return to your Portal dashboard and try again.',{retry:true,logout:true});}
});
boot();
