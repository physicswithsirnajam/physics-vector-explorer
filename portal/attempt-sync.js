/* Physics with Sir Najam • Portal V3 • optional learner-owned practice save.
   Browser-graded SELF-PRACTICE data only; NEVER treat as secure exam marks.
   Firebase rules must independently enforce ownership and schema. */
import {firebaseConfig} from './firebase-config.js';
import {initializeApp,getApp,getApps} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import {getFirestore,collection,addDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
const $=id=>document.getElementById(id);
const button=$('save-result'),status=$('save-result-status');
let auth=null,db=null,record=null,saved=false,uploading=false,lastSaveError='';
function say(s){status.textContent=s;}
function updateButton(){
 const user=auth?.currentUser;
 button.disabled=!record||saved||uploading||!user||!user.emailVerified;
 if(!record)return;
 if(saved){say('Saved successfully. Open your portal to see My Physics Progress.');return;}
 if(lastSaveError){say(lastSaveError);return;}
 if(!user){say('Not signed in. Sign in through the Portal, return here, and you can save this result.');return;}
 if(!user.emailVerified){say('Please verify your account email before saving.');return;}
 if(!uploading)say('Ready to save this self-practice result to your account.');
}
window.addEventListener('psn:practice-finished',event=>{
 record=event.detail;saved=false;uploading=false;lastSaveError='';updateButton();
});
try{
 if(Object.values(firebaseConfig).some(v=>typeof v!=='string'||!v.trim()||v.includes('REPLACE_')))throw Error('Firebase settings are incomplete');
 const app=getApps().length?getApp():initializeApp(firebaseConfig);
 auth=getAuth(app);db=getFirestore(app);
 onAuthStateChanged(auth,()=>updateButton());
}catch(error){say('Account saving is unavailable. The test will still work normally. Check the portal Firebase configuration.');}
button.addEventListener('click',async()=>{
 const user=auth?.currentUser;
 if(uploading||saved||!record||!user||!user.emailVerified||!db)return;
 uploading=true;lastSaveError='';updateButton();say('Saving your practice result…');
 try{
  // Explicit allowlist ensures no UI or privileged profile attributes are sent.
  const payload={
   schemaVersion:1,kind:'self-practice',grade:11,unit:record.unit,
   bankVersion:String(record.bankVersion||'unknown').slice(0,120),
   createdAt:serverTimestamp(),
   questionCount:record.questionCount,correctCount:record.correctCount,skippedCount:record.skippedCount,
   arrangement:record.arrangement,selection:record.selection,scope:record.scope,
   questionResults:record.questionResults
  };
  if(![1,2].includes(payload.unit)||record.grade!==11)throw Error('Unexpected practice unit. This result was not saved.');
  if(payload.questionResults.length!==payload.questionCount)throw Error('Question record count mismatch');
  // Rules check the authenticated UID in the document path.
  await addDoc(collection(db,'users',user.uid,'attempts'),payload);
  saved=true;say('Saved successfully. Open the Student Portal to see your history.');
 }catch(error){
  lastSaveError='Not saved. Check your internet connection and published V3 Firestore rules, then try again. ('+String(error?.code||'save-error')+')';
 }finally{uploading=false;updateButton();}
});
