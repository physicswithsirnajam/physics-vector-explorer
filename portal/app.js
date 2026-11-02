/* Physics with Sir Najam — Portal Pilot V1.
   Frontend roles are intentionally not assignable. All signups are ordinary learners.
   The first administrator must be granted privileges via a trusted backend in a future release.
   Existing external learning resources remain public; this UI is NOT a content paywall. */
import {firebaseConfig} from './firebase-config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import {
 getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword,
 signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail,
 onAuthStateChanged, signOut, updateProfile, reload
} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import {getFirestore, doc, getDoc, setDoc, serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';

const $=id=>document.getElementById(id);
const notice=$('notice');
let auth=null, db=null, navigationToken=0;
const ready=Object.values(firebaseConfig).every(v=>typeof v==='string' && v.trim() && !v.includes('REPLACE_'));

function status(message='',kind='error'){
 notice.textContent=message;
 notice.className='alert'+(kind==='success'?' alert-success':' alert-error');
 notice.hidden=!message;
}
function pane(name){
 ['login','signup','reset','verify','error'].forEach(id=>{$('panel-'+id).hidden=id!==name;});
 status('');
}
function screen(name){
 $('auth-screen').hidden=name!=='auth';
 $('dashboard-screen').hidden=name!=='dashboard';
}
function showBusy(form,busy){
 for (const button of form.querySelectorAll('button')) button.disabled=busy;
}
function authError(err){
 const code=String(err?.code||'');
 const descriptions={
  'auth/invalid-email':'Please enter a valid email address.',
  'auth/invalid-credential':'Email or password is incorrect. Try again or reset your password.',
  'auth/email-already-in-use':'An account already uses this email. Please sign in instead.',
  'auth/weak-password':'Choose a stronger password.',
  'auth/too-many-requests':'Too many attempts. Please try again later.',
  'auth/network-request-failed':'Network error. Check your internet connection.',
  'auth/popup-blocked':'Allow pop-ups for this portal and try again.',
  'auth/popup-closed-by-user':'Google sign-in window was closed. You may try again.',
  'auth/unauthorized-domain':'Add this website domain to Firebase Authentication → Settings → Authorized domains.',
  'permission-denied':'Firestore denied access. Verify the database exists and the provided security rules are published.',
  'unavailable':'The database is temporarily unavailable. Check your connection.'
 };
 return descriptions[code] || 'Unable to complete the action. Check your Firebase settings and try again.';
}
async function profileFor(user){
 const reference=doc(db,'users',user.uid);
 const snapshot=await getDoc(reference);
 if(snapshot.exists()) return snapshot.data();
 let name=(user.displayName||'Student').trim().slice(0,80);
 if(!name)name='Student';
 const profile={displayName:name,createdAt:serverTimestamp(),updatedAt:serverTimestamp()};
 await setDoc(reference,profile); // Rules restrict the exact fields: no role, entitlement, class, or admin flag.
 return {displayName:name};
}
async function refreshView(user){
 const current=++navigationToken;
 if(!user){screen('auth');pane('login');return;}
 screen('auth');
 if(!user.emailVerified){
  $('verify-email').textContent=user.email||'your email address';
  pane('verify');return;
 }
 try{
  await user.getIdToken(true);
  const profile=await profileFor(user);
  if(current!==navigationToken||auth.currentUser?.uid!==user.uid) return;
  $('student-name').textContent=profile.displayName||user.displayName||'Student';
  $('student-email').textContent=user.email||'your Google account';
  screen('dashboard');
 }catch(err){
  if(current!==navigationToken) return;
  screen('auth');pane('error');
  $('data-error').textContent=authError(err);
 }
}

for(const button of document.querySelectorAll('[data-show]')){
 button.addEventListener('click',()=>pane(button.dataset.show));
}

if(!ready){
 $('setup-prompt').hidden=false;
 for(const element of document.querySelectorAll('form button[type="submit"],#google-signin')) element.disabled=true;
}else{
 try{
  const firebase=initializeApp(firebaseConfig);
  auth=getAuth(firebase);
  db=getFirestore(firebase);
  onAuthStateChanged(auth,user=>{refreshView(user);},err=>{screen('auth');pane('login');status(authError(err));});
 }catch(err){$('setup-prompt').hidden=false;status('Firebase could not initialize. Recheck your Web App config.');}
}

$('login-form').addEventListener('submit',async e=>{
 e.preventDefault();if(!auth)return;
 const form=e.currentTarget;showBusy(form,true);status('');
 try{await signInWithEmailAndPassword(auth,$('login-email').value.trim(),$('login-password').value);}catch(err){status(authError(err));}finally{showBusy(form,false);}
});
$('signup-form').addEventListener('submit',async e=>{
 e.preventDefault();if(!auth)return;
 const name=$('signup-name').value.trim().slice(0,80);
 const password=$('signup-password').value;
 if(!name){status('Please enter your name.');return;}
 if(password!==$('signup-confirm').value){status('Passwords do not match.');return;}
 const form=e.currentTarget;showBusy(form,true);status('');
 try{
  const result=await createUserWithEmailAndPassword(auth,$('signup-email').value.trim(),password);
  await updateProfile(result.user,{displayName:name});
  await sendEmailVerification(result.user);
  $('verify-email').textContent=result.user.email||'your email';
  pane('verify');status('Verification email sent. Check your inbox and spam folder.','success');
 }catch(err){status(authError(err));}finally{showBusy(form,false);}
});
$('google-signin').addEventListener('click',async()=>{
 if(!auth)return;const button=$('google-signin');button.disabled=true;status('');
 try{await signInWithPopup(auth,new GoogleAuthProvider());}catch(err){status(authError(err));}finally{button.disabled=false;}
});
$('reset-form').addEventListener('submit',async e=>{
 e.preventDefault();if(!auth)return;
 const form=e.currentTarget;showBusy(form,true);status('');
 try{
  await sendPasswordResetEmail(auth,$('reset-email').value.trim());
  status('If this address is eligible, a password reset link will be sent. Check your inbox and spam folder.','success');
 }catch(err){status(authError(err));}finally{showBusy(form,false);}
});
$('check-verification').addEventListener('click',async()=>{
 const user=auth?.currentUser;if(!user)return;
 try{await reload(user);await user.getIdToken(true);if(user.emailVerified)await refreshView(user);else status('Your email is not verified yet. Open the link from your email, then check again.');}catch(err){status(authError(err));}
});
$('resend-verification').addEventListener('click',async()=>{
 if(!auth?.currentUser)return;
 try{await sendEmailVerification(auth.currentUser);status('Verification email sent again.','success');}catch(err){status(authError(err));}
});
async function logout(){if(auth){try{await signOut(auth);}catch(err){status(authError(err));}}}
$('verify-signout').addEventListener('click',logout);
$('error-signout').addEventListener('click',logout);
$('signout').addEventListener('click',logout);
$('retry-profile').addEventListener('click',()=>{if(auth?.currentUser)refreshView(auth.currentUser);});
