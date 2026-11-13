/* Physics with Sir Najam — Protected learning resource pilot V9.
   The resource's actual text is NOT stored in this public file.
   Firebase Firestore Security Rules (not this UI) are the access control.
   Do not store private keys, answer keys, or restricted lessons here. */
import {firebaseConfig} from './firebase-config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import {getAuth,onAuthStateChanged,reload,signOut} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import {getFirestore,doc,getDocFromServer} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';

const $=id=>document.getElementById(id);
const lessonPath=['protectedLessons','unit-01-access-pilot'];
let sequence=0,auth,db;

function clearContent(){
  $('resource').hidden=true;
  $('lesson-title').textContent='';
  $('lesson-summary').textContent='';
  $('lesson-body').replaceChildren();
}
function state(title,message,{login=false,retry=false,logout=false}={}){
  $('state-heading').textContent=title;
  $('state-message').textContent=message;
  $('login-link').hidden=!login;
  $('retry-button').hidden=!retry;
  $('signout-button').hidden=!logout;
}
function safeText(v,max=12000){return typeof v==='string'?v.slice(0,max):'';}
function renderLesson(data){
  $('lesson-title').textContent=safeText(data.title,160)||'Protected learning resource';
  $('lesson-summary').textContent=safeText(data.summary,800);
  const body=$('lesson-body');body.replaceChildren();
  const chunks=safeText(data.body,24000).split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
  for(const chunk of chunks){const p=document.createElement('p');p.textContent=chunk;body.append(p);}
  $('resource').hidden=false;
}
async function verifyAndLoad(user){
  const run=++sequence;
  clearContent();
  if(!user){state('Sign in required','Open the Student Portal, sign in, and return through My Learning Hub.',{login:true});return;}
  state('Checking verified access','Confirming your email verification and resource permission…',{logout:true});
  try{
    // Ensures a recently verified email is reflected in the current user object.
    if(!user.emailVerified)await reload(user);
    if(run!==sequence)return;
    if(!user.emailVerified){
      state('Verify your email first','Please complete Firebase email verification through the Portal, then sign in again.',{login:true,logout:true});
      return;
    }
    state('Loading your protected lesson','Reading the resource through authenticated Firestore access…',{logout:true});
    // Server read, not IndexedDB cache. Rules are evaluated independently.
    const snap=await getDocFromServer(doc(db,...lessonPath));
    if(run!==sequence)return;
    if(!snap.exists()){
      state('Pilot lesson not yet installed','Ask the administrator to create protectedLessons / unit-01-access-pilot in Firebase Console.',{retry:true,logout:true});return;
    }
    const data=snap.data();
    if(data.status!=='pilot'){
      state('Lesson unavailable','This resource is not currently published for the pilot.',{logout:true});return;
    }
    renderLesson(data);
    state('Access granted','Your verified account was permitted to retrieve this Firestore resource.',{retry:true,logout:true});
  }catch(err){
    if(run!==sequence)return;
    clearContent();
    const denied=err?.code==='permission-denied';
    const offline=err?.code==='unavailable';
    const message=denied
      ? 'Firestore denied the read. Check your email verification, the V9 rules, and the lesson document status. No access was granted.'
      : offline?'The Firebase server is unavailable. Check your connection and try again.'
      :'This resource could not be loaded. Check Firebase configuration and V9 setup instructions.';
    state(denied?'Access denied':'Unable to open lesson',message,{retry:true,logout:true});
  }
}
function boot(){
  const configured=Object.values(firebaseConfig).every(v=>typeof v==='string' && v.trim() && !v.includes('REPLACE_'));
  if(!configured){state('Firebase setup needed','Use the existing working portal/firebase-config.js. Never publish service-account private keys.');return;}
  try{
    const app=initializeApp(firebaseConfig);
    auth=getAuth(app);db=getFirestore(app);
    onAuthStateChanged(auth,user=>verifyAndLoad(user),()=>state('Sign-in status unavailable','Return to Portal and try again.',{login:true}));
  }catch{state('Firebase setup error','Check the existing portal configuration and retry after correcting it.');}
}
$('retry-button').addEventListener('click',()=>verifyAndLoad(auth?.currentUser));
$('signout-button').addEventListener('click',async()=>{clearContent();sequence++;state('Signing out…','Removing the lesson from this view.');try{await signOut(auth);}catch{state('Sign-out not completed','Return to the Portal and try again.',{retry:true,logout:true});}});
boot();
