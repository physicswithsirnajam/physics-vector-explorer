/* Physics with Sir Najam — Portal V7: privacy controls and integrated learning hub, PDF-first reports, navigation, paged self-practice archive and learner analytics and V2 Admin Foundation.
   Every self-registered learner remains unprivileged. Only Firebase trusted
   custom claims determine admin status. Firestore rules enforce actual access.
   Teacher/class/payments management remains DISABLED. Self-practice results are student-owned, not trusted grades.
   Public GitHub Pages resources are not protected by this login. */
import {firebaseConfig} from './firebase-config.js';
import {analyzeAttempts,SLO_TOPICS,targetedPracticeUrl} from './learning-analytics.js';
import {openProgressPdfReport} from './pdf-report.js';
import {initLearningHub,updateLearningHubInsight,clearLearningHubInsight,setHubEnrollment} from './learning-hub.js?v=11';
import {readEnrollment,createPilotEnrollment} from './academic-enrollment.js?v=10';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import {
 getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword,
 signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail,
 onAuthStateChanged, signOut, updateProfile, reload
} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import {getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, query, orderBy, limit, startAfter, getDocs} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';

const $=id=>document.getElementById(id);
const notice=$('notice');
let auth=null, db=null, navigationToken=0, adminSessionUid=null, progressRequestToken=0, enrollmentToken=0;
// Archived attempts are paged under the existing V3 25-document query limit.
const PROGRESS_PAGE=25;
let progressRecords=[], progressCursor=null, progressHasOlder=true, progressLoading=false, progressOwnerUid=null;
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
 $('admin-screen').hidden=name!=='admin';
}
function adminStatus(message='',kind='error'){
 const el=$('admin-notice');
 el.textContent=message;
 el.className='alert'+(kind==='success'?' alert-success':' alert-error');
 el.hidden=!message;
}
function enrollmentNotice(text,error=false){
 const el=$('enrollment-status');el.textContent=text;el.dataset.error=error?'true':'false';
}
async function showLearner(user,profile){
 const request=++enrollmentToken;
 $('student-name').textContent=profile.displayName||user.displayName||'Student';
 $('student-email').textContent=user.email||'your Google account';
 $('enrolled-learner-content').hidden=true;
 $('enrollment-gate').hidden=false;
 enrollmentNotice('Checking your academic enrollment…');
 screen('dashboard');
 // Privacy and old personal progress records remain available even for
 // accounts created before V10; access to learning resources is gated.
 loadProgress(user);
 refreshPrivacyRequest(user);
 try{
  const record=await readEnrollment(db,user);
  if(request!==enrollmentToken||auth?.currentUser?.uid!==user.uid)return;
  if(record){
   $('enrollment-gate').hidden=true;
   $('enrolled-learner-content').hidden=false;
   $('current-enrollment-label').textContent='Grade XI · FBISE';
   setHubEnrollment(record.grade);
   portalAnchorScroll();
  }else{
   enrollmentNotice('No current grade enrollment yet. Select Grade XI / FBISE to begin.');
  }
 }catch(error){
  if(request!==enrollmentToken||auth?.currentUser?.uid!==user.uid)return;
  enrollmentNotice('Unable to verify enrollment from Firebase. Please check the V10 Firestore rules and your connection, then choose Refresh account permissions. '+authError(error),true);
 }
}

function portalAnchorScroll(){
 const hash=location.hash;
 if(hash!=='#learning-hub' && hash!=='#my-progress')return;
 requestAnimationFrame(()=>document.getElementById(hash.slice(1))?.scrollIntoView({block:'start'}));
}

// V3: learner-owned practice records. No admin/teacher access to independent
// students' attempts. All values are treated as user-entered/self-reported.
function progressStatus(message='',error=false){
 const el=$('progress-status');el.textContent=message;el.dataset.error=error?'true':'false';el.hidden=!message;
}
function progressDate(value){
 try{const date=value?.toDate?.();return date?date.toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'}):'Date unavailable';}catch{return 'Date unavailable';}
}
function renderProgress(records){
 const analytics=analyzeAttempts(records);
 updateLearningHubInsight(analytics,progressHasOlder);
 const stats=$('progress-content');stats.hidden=false;
 $('progress-attempts').textContent=String(analytics.attempts);
 $('progress-questions').textContent=String(analytics.presented);
 $('progress-accuracy').textContent=analytics.accuracy===null?'—':analytics.accuracy+'%';
 $('progress-unique').textContent=String(analytics.uniqueQuestions);
 $('progress-answered').textContent=String(analytics.answered);
 $('progress-window').textContent=progressHasOlder
  ? `${records.length} most recent saved attempts included so far. Load older records to extend all the figures below.`
  : `Complete saved practice history loaded: ${records.length} attempt(s). All of these records are included in the analytics.`;

 const sloContainer=$('progress-slos');sloContainer.replaceChildren();
 if(!analytics.slos.length)sloContainer.textContent='No SLO data yet. Complete and save a test to begin tracking.';
 for(const x of analytics.slos){
  const row=document.createElement('div');row.className='progress-slo';row.dataset.state=x.status;
  const head=document.createElement('div');head.className='progress-slo-top';
  const heading=document.createElement('div');const name=document.createElement('strong');name.textContent=x.code;
  const label=document.createElement('small');label.textContent=SLO_TOPICS[x.code]||'Learning outcome';heading.append(name,label);
  const value=document.createElement('span');value.textContent=x.accuracy===null?'No answers yet':`${x.accuracy}% · ${x.correct}/${x.answered} answered correctly`;
  head.append(heading,value);
  const meter=document.createElement('div');meter.className='progress-meter';meter.setAttribute('role','img');meter.setAttribute('aria-label',`${x.code}: ${x.accuracy??0} percent accuracy among answered questions`);
  const fill=document.createElement('span');fill.style.width=(x.accuracy??0)+'%';fill.dataset.weak=x.status==='focus'?'true':'false';meter.append(fill);
  const note=document.createElement('p');note.className='progress-footnote';
  const verdict=x.status==='focus'?'Suggested focus for revision':x.status==='strong'?'Strong recent practice accuracy':x.status==='developing'?'Continue guided practice':'More evidence needed before evaluating';
  note.textContent=`${verdict} · ${x.unique} different questions · ${x.distinctAttempts} saved attempt(s)`;
  row.append(head,meter,note);
  const url=targetedPracticeUrl(x.code);
  if(url){const link=document.createElement('a');link.className='slo-practice-link';link.href=url;link.textContent='Practise this SLO (4 MCQs) ↗';row.append(link);}
  sloContainer.append(row);
 }

 const plan=$('revision-priorities');plan.replaceChildren();
 const recommended=analytics.priority.length?analytics.priority:analytics.needsEvidence.slice(0,2);
 if(!recommended.length){
  const p=document.createElement('p');p.className='progress-footnote';p.textContent=analytics.attempts?'No specific revision priority is established from these records. Continue practising a variety of SLOs.':'Save an assessment to receive your first revision suggestions.';plan.append(p);
 }
 for(const [i,x] of recommended.entries()){
  const card=document.createElement('div');card.className='revision-card';
  const kicker=document.createElement('span');kicker.className='revision-kicker';kicker.textContent=analytics.priority.length?`REVISION PRIORITY ${i+1}`:'MORE PRACTICE DATA NEEDED';
  const title=document.createElement('strong');title.textContent=`${x.code} · ${x.topic}`;
  const why=document.createElement('p');why.textContent=x.status==='focus'?`${x.accuracy}% correct across ${x.answered} answered questions (${x.unique} unique). Review the concept and check your reasoning.`:`Only ${x.answered} answered questions across ${x.distinctAttempts} saved attempts. Try more questions before drawing a conclusion.`;
  card.append(kicker,title,why);
  const url=targetedPracticeUrl(x.code);if(url){const link=document.createElement('a');link.className='btn btn-secondary btn-small';link.href=url;link.textContent='Start 4-question practice ↗';card.append(link);}
  plan.append(card);
 }

 const trend=$('accuracy-trend');trend.replaceChildren();
 if(!analytics.timeline.length){trend.textContent='No saved test history yet.';}
 else {
  for(const [i,t] of analytics.timeline.entries()){
   const item=document.createElement('div');item.className='trend-item';
   const bar=document.createElement('div');bar.className='trend-bar';bar.setAttribute('role','img');
   bar.setAttribute('aria-label',`Attempt ${i+1}: ${t.accuracy===null?'no answered questions':t.accuracy+' percent correct among answered questions'}`);
   const fill=document.createElement('span');fill.style.height=(t.accuracy??0)+'%';bar.append(fill);
   const value=document.createElement('strong');value.textContent=t.accuracy===null?'—':t.accuracy+'%';
   const label=document.createElement('small');label.textContent=`#${i+1}`;
   item.append(value,bar,label);trend.append(item);
  }
 }

 const attemptList=$('progress-attempt-list');attemptList.replaceChildren();
 if(!records.length)attemptList.textContent='No saved attempts yet. Complete a test, then select Save to My Progress.';
 for(const r of records.slice(0,50)){
  const row=document.createElement('div');row.className='attempt-row';
  const left=document.createElement('div');const title=document.createElement('strong');const reportUnit=[1,2].includes(Number(r.unit))?Number(r.unit):1;title.textContent=`Grade XI · Unit ${reportUnit} · ${r.questionCount||0} MCQs`;
  const meta=document.createElement('small');meta.textContent=`${progressDate(r.createdAt)} · ${r.arrangement||'random'} · ${r.selection||'balanced'}`;
  left.append(title,meta);const score=document.createElement('span');score.className='attempt-score';score.textContent=`${r.correctCount||0}/${r.questionCount||0}`;
  row.append(left,score);attemptList.append(row);
 }
}
// Reset in-memory history when a student signs out, changes accounts, or
// switches to the administrator view. Data remains in that student's Firestore.
function clearProgressArchive(){
 progressRequestToken++;
 progressRecords=[];progressCursor=null;progressHasOlder=true;
 progressLoading=false;progressOwnerUid=null;
 clearLearningHubInsight();
 const content=$('progress-content');if(content)content.hidden=true;
 updateArchiveActions();
}
function updateArchiveActions(){
 const signedIn=auth?.currentUser && progressOwnerUid===auth.currentUser.uid && !$('dashboard-screen').hidden;
 const more=$('load-older-progress'),json=$('download-practice-json'),csv=$('download-practice-csv'),pdf=$('download-practice-pdf');
 more.hidden=!signedIn||!progressHasOlder||progressRecords.length===0;
 more.disabled=progressLoading;
 json.disabled=csv.disabled=pdf.disabled=!signedIn||!progressRecords.length||progressLoading;
 if(!signedIn){$('archive-completeness').textContent='Sign in to review your own saved records.';return;}
 $('archive-completeness').textContent=progressHasOlder
  ? `${progressRecords.length} attempt(s) loaded. Older records may remain; the downloads and analysis are not yet necessarily your complete history.`
  : `${progressRecords.length} attempt(s) loaded. No further saved attempts were found; the downloaded data covers your complete saved practice history at this time.`;
}
function progressDocData(snapshot){return {...snapshot.data(),_archiveDocumentId:snapshot.id};}
async function loadArchivePage(user){
 if(progressLoading||!user||!db||!user.emailVerified||progressOwnerUid!==user.uid||!progressHasOlder)return;
 const version=progressRequestToken;
 progressLoading=true;updateArchiveActions();
 progressStatus(`Loading ${progressRecords.length?'older':'recent'} practice records…`);
 try{
  const clauses=[orderBy('createdAt','desc')];
  if(progressCursor)clauses.push(startAfter(progressCursor));
  clauses.push(limit(PROGRESS_PAGE));
  const results=await getDocs(query(collection(db,'users',user.uid,'attempts'),...clauses));
  // Prevent a completed fetch from a prior account/session appearing in another account.
  if(version!==progressRequestToken||auth?.currentUser?.uid!==user.uid||$('dashboard-screen').hidden||progressOwnerUid!==user.uid)return;
  const existing=new Set(progressRecords.map(r=>r._archiveDocumentId));
  for(const snap of results.docs){if(!existing.has(snap.id)){progressRecords.push(progressDocData(snap));existing.add(snap.id);}}
  if(results.docs.length)progressCursor=results.docs[results.docs.length-1];
  progressHasOlder=results.docs.length===PROGRESS_PAGE;
  renderProgress(progressRecords);
  progressStatus(progressHasOlder
    ? `Loaded ${progressRecords.length} saved attempt(s). Choose “Load 25 older attempts” to extend your history.`
    : `Loaded your full currently saved practice history: ${progressRecords.length} attempt(s).`);
 }catch(err){
  if(version===progressRequestToken && auth?.currentUser?.uid===user.uid){
   progressStatus('Could not load this page. The previous loaded attempts remain available. '+authError(err),true);
   if(!progressRecords.length)$('progress-content').hidden=true;
  }
 }finally{
  if(version===progressRequestToken){progressLoading=false;updateArchiveActions();}
 }
}
async function loadProgress(user){
 clearProgressArchive();
 if(!user||!db||!user.emailVerified){progressStatus('Sign in with a verified student account first.',true);return;}
 progressOwnerUid=user.uid;progressHasOlder=true;
 await loadArchivePage(user);
}
function downloadAsFile(filename,content,mime){
 const blob=new Blob([content],{type:mime});
 const url=URL.createObjectURL(blob),anchor=document.createElement('a');
 anchor.href=url;anchor.download=filename;document.body.append(anchor);anchor.click();anchor.remove();
 // Revoke after the browser has had an opportunity to initiate the download.
 setTimeout(()=>URL.revokeObjectURL(url),10000);
}
function exportableAttempt(record){
 const { _archiveDocumentId,createdAt, ...rest}=record;
 let date=null;try{date=createdAt?.toDate?.()?.toISOString?.()??null;}catch{}
 return {recordId:_archiveDocumentId||null,createdAt:date,...rest};
}
function validExportSession(){
 return auth?.currentUser && progressOwnerUid===auth.currentUser.uid &&
   !$('dashboard-screen').hidden && !progressLoading && progressRecords.length>0;
}
function exportPracticeJson(){
 if(!validExportSession())return;
 const data={
  format:'Physics with Sir Najam self-practice archive V5',
  exportedAt:new Date().toISOString(),
  isCompleteSavedHistory:!progressHasOlder,
  loadedAttempts:progressRecords.length,
  records:progressRecords.map(exportableAttempt)
 };
 downloadAsFile('physics-with-sir-najam-practice-records.json',JSON.stringify(data,null,2),'application/json;charset=utf-8');
}
function csvField(value){
 let s=String(value??'');
 // Avoid spreadsheet-formula execution if a user-supplied string begins with a special prefix.
 if(/^[\s]*[=+@-]/.test(s))s="'"+s;
 return '"'+s.replaceAll('"','""')+'"';
}
function exportPracticeCsv(){
 if(!validExportSession())return;
 const header=['Attempt','Date (UTC)','Grade','Unit','Questions','Correct','Skipped','Selection','Arrangement','Bank version'];
 const rows=[header,...progressRecords.map((r,i)=>[
  i+1,exportableAttempt(r).createdAt||'',r.grade||11,r.unit||1,r.questionCount||0,
  r.correctCount||0,r.skippedCount||0,r.selection||'',r.arrangement||'',r.bankVersion||''
 ])];
 downloadAsFile('physics-with-sir-najam-practice-summary.csv',rows.map(r=>r.map(csvField).join(',')).join('\r\n'),'text/csv;charset=utf-8');
}

function showAdmin(user){
 privacyRequestSequence++;
 clearProgressArchive();
 adminSessionUid=user.uid;
 $('admin-email').textContent=user.email||'verified account';
 $('admin-loaded').textContent='Not loaded';
 $('admin-directory').hidden=true;
 $('admin-directory').replaceChildren();
 $('admin-directory-empty').hidden=false;
 adminStatus('');
 screen('admin');
}
function readableDate(timestamp){
 try{const date=timestamp?.toDate?.();return date?date.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'Not recorded';}
 catch{return 'Not recorded';}
}
async function loadProfiles(){
 const user=auth?.currentUser;
 if(!user || adminSessionUid!==user.uid || $('admin-screen').hidden)return;
 const button=$('admin-load-profiles');
 button.disabled=true;adminStatus('');
 try{
   // Role is checked again by Firebase Firestore security rules, not merely by UI.
   const results=await getDocs(query(collection(db,'users'),orderBy('createdAt','desc'),limit(25)));
   if(auth?.currentUser?.uid!==user.uid || $('admin-screen').hidden || adminSessionUid!==user.uid)return;
   const table=$('admin-directory');table.replaceChildren();
   const head=document.createElement('div');head.className='directory-head';
   for(const label of ['Display name','UID (short)','Profile created']){const e=document.createElement('span');e.textContent=label;head.append(e);}table.append(head);
   for(const record of results.docs){
     const data=record.data();const row=document.createElement('div');row.className='directory-row';
     const items=[String(data.displayName||'Learner').slice(0,80),record.id.slice(0,9)+'…',readableDate(data.createdAt)];
     for(const value of items){const el=document.createElement('span');el.textContent=value;row.append(el);}
     table.append(row);
   }
   $('admin-loaded').textContent=String(results.size)+' loaded';
   $('admin-directory-empty').hidden=results.size!==0;
   $('admin-directory-empty').textContent=results.size?'':'No profiles found.';
   table.hidden=results.size===0;
   if(results.size)adminStatus('Recent profiles loaded. This is a limited list, not a complete student count.','success');
 }catch(err){
   if(auth?.currentUser?.uid===user.uid)adminStatus('Cannot load profile directory. Check that the V2 Firestore rules are published and your administrator claim has refreshed. '+authError(err));
 }finally{button.disabled=false;}
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
 adminSessionUid=null;
 if(!user){enrollmentToken++;$('enrolled-learner-content').hidden=true;$('enrollment-gate').hidden=true;clearProgressArchive();screen('auth');pane('login');return;}
 screen('auth');
 if(!user.emailVerified){
  $('verify-email').textContent=user.email||'your email address';
  pane('verify');return;
 }
 try{
  // Force-refresh after the administrator claim has been assigned.
  // Display logic uses the trusted signed ID-token claims.
  const token=await user.getIdTokenResult(true);
  const profile=await profileFor(user);
  if(current!==navigationToken||auth.currentUser?.uid!==user.uid) return;
  if(token.claims.admin===true && !['#learning-hub','#my-progress'].includes(location.hash)){
    enrollmentToken++;$('enrolled-learner-content').hidden=true;showAdmin(user);
  }else{
    showLearner(user,profile);
    $('refresh-access').textContent=token.claims.admin===true?'Return to administrator console':'Refresh account permissions';
  }
 }catch(err){
  if(current!==navigationToken) return;
  screen('auth');pane('error');
  $('data-error').textContent=authError(err);
 }
}

initLearningHub();
$('enrollment-form').addEventListener('submit',async event=>{
 event.preventDefault();
 const user=auth?.currentUser;
 if(!user||!user.emailVerified||!db)return;
 const button=$('enrollment-submit');button.disabled=true;
 enrollmentNotice('Activating your free Grade XI enrollment…');
 try{
  await createPilotEnrollment(db,user,{
   grade:$('enrollment-grade').value,board:$('enrollment-board').value,
   institution:$('enrollment-institution').value
  });
  if(auth?.currentUser?.uid===user.uid){
   // Keep the sole administrator in learner mode after enrolling their own
   // optional academic record. Ordinary students are unaffected.
   if(adminSessionUid===user.uid)history.replaceState(null,'',location.pathname+location.search+'#learning-hub');
   await refreshView(user);
  }
 }catch(error){
  if(auth?.currentUser?.uid===user.uid)
   enrollmentNotice('Enrollment could not be created. If you already enrolled, select Refresh account permissions. '+authError(error),true);
 }finally{button.disabled=false;}
});

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
async function logout(){privacyRequestSequence++;if(auth){try{await signOut(auth);}catch(err){status(authError(err));}}}
$('verify-signout').addEventListener('click',logout);
$('error-signout').addEventListener('click',logout);
$('signout').addEventListener('click',logout);
$('retry-profile').addEventListener('click',()=>{if(auth?.currentUser)refreshView(auth.currentUser);});

// Portal V2 — claim-controlled navigation and read-only administration.
$('admin-load-profiles').addEventListener('click',loadProfiles);
$('admin-signout').addEventListener('click',logout);
$('admin-refresh-role').addEventListener('click',()=>{if(auth?.currentUser)refreshView(auth.currentUser);});
$('refresh-access').addEventListener('click',()=>{
 if($('refresh-access').textContent.includes('Return to administrator'))history.replaceState(null,'',location.pathname+location.search);
 if(auth?.currentUser)refreshView(auth.currentUser);
});
$('reload-progress').addEventListener('click',()=>{if(auth?.currentUser)loadProgress(auth.currentUser);});
$('load-older-progress').addEventListener('click',()=>{if(auth?.currentUser)loadArchivePage(auth.currentUser);});
$('download-practice-json').addEventListener('click',exportPracticeJson);
$('download-practice-csv').addEventListener('click',exportPracticeCsv);
$('download-practice-pdf').addEventListener('click',()=>{
 if(!validExportSession())return;
 const person=$('student-name').textContent||'Student';
 const result=openProgressPdfReport({studentName:person,records:progressRecords,complete:!progressHasOlder,analytics:analyzeAttempts(progressRecords)});
 const note=$('pdf-report-status');note.hidden=false;
 note.textContent=result?'Report opened. In the print dialog, choose Save as PDF.':'Your browser blocked the report window. Allow pop-ups for this site and try again.';
});
// V7 — privacy requests are deliberately non-destructive.
// Requests are created once at /privacyRequests/{uid} and read using owner
// or trusted administrator rules. No client can complete/cancel a request.
let privacyRequestSequence=0;
function privacyStatus(message,error=false){
 const el=$('deletion-request-status');if(!el)return;
 el.textContent=message;el.dataset.error=error?'true':'false';
}
async function refreshPrivacyRequest(user){
 const sequence=++privacyRequestSequence;
 const button=$('request-account-deletion');
 if(!user || !db || !user.emailVerified){
  button.disabled=true;privacyStatus('Sign in with a verified account to view requests.');return;
 }
 button.disabled=true;privacyStatus('Checking your request status…');
 try{
  const token=await user.getIdTokenResult();
  if(sequence!==privacyRequestSequence||auth?.currentUser?.uid!==user.uid)return;
  if(token.claims.admin===true){
   privacyStatus('The sole administrator cannot request deletion from this student interface. Use the separate verified administrator recovery procedure.');return;
  }
  const snapshot=await getDoc(doc(db,'privacyRequests',user.uid));
  if(sequence!==privacyRequestSequence||auth?.currentUser?.uid!==user.uid)return;
  if(snapshot.exists()){
   privacyStatus('Deletion review requested. No data has been deleted. Contact the platform administrator through the official website if you need to follow up.');
  }else{
   button.disabled=false;privacyStatus('No deletion request recorded for this account.');
  }
 }catch(error){
  if(sequence!==privacyRequestSequence||auth?.currentUser?.uid!==user.uid)return;
  privacyStatus('Unable to check requests. Please check the V7 Firestore security rules and try again. '+authError(error),true);
 }
}
$('request-account-deletion').addEventListener('click',async()=>{
 const user=auth?.currentUser,button=$('request-account-deletion');
 if(!user || !db || !user.emailVerified || progressOwnerUid!==user.uid)return;
 if(!window.confirm('Submit a request for administrator review of account and associated data deletion? This does not delete anything now, and may require identity verification.'))return;
 button.disabled=true;privacyStatus('Submitting deletion review request…');
 try{
  // No email or personal narrative is saved; ownership is enforced by rules.
  await setDoc(doc(db,'privacyRequests',user.uid),{
   uid:user.uid,type:'account-deletion',status:'requested',requestedAt:serverTimestamp()
  });
  if(auth?.currentUser?.uid===user.uid)privacyStatus('Request submitted. Your account and learning records remain available pending verified administrator processing.');
 }catch(error){
  if(auth?.currentUser?.uid===user.uid){
   privacyStatus('Request was not saved. '+authError(error),true);
   await refreshPrivacyRequest(user);
  }
 }
});
async function loadDeletionRequests(){
 const user=auth?.currentUser;
 if(!user || adminSessionUid!==user.uid || $('admin-screen').hidden)return;
 const button=$('admin-load-deletion-requests'),message=$('admin-deletion-status'),list=$('admin-deletion-list');
 button.disabled=true;message.textContent='Loading recent requests…';list.hidden=true;list.replaceChildren();
 try{
  const results=await getDocs(query(collection(db,'privacyRequests'),orderBy('requestedAt','desc'),limit(25)));
  if(auth?.currentUser?.uid!==user.uid||adminSessionUid!==user.uid||$('admin-screen').hidden)return;
  message.textContent=results.empty?'No requests found.':`${results.size} request(s) loaded (at most 25). This list is read-only.`;
  for(const r of results.docs){
   const x=r.data(),row=document.createElement('div');row.className='deletion-request-row';
   const id=document.createElement('code');id.textContent='UID: '+r.id;
   const date=document.createElement('span');date.textContent='Requested: '+readableDate(x.requestedAt)+' · '+String(x.status||'unknown');
   row.append(id,date);list.append(row);
  }
  list.hidden=results.empty;
 }catch(error){if(auth?.currentUser?.uid===user.uid){message.textContent='Unable to load requests. '+authError(error);}}
 finally{button.disabled=false;}
}
$('admin-load-deletion-requests').addEventListener('click',loadDeletionRequests);

$('admin-open-learning').addEventListener('click',async()=>{
 const user=auth?.currentUser;
 if(!user || !adminSessionUid || adminSessionUid!==user.uid)return;
 // A refreshed token is used before switching modes; never grant role from local state.
 try{
  const token=await user.getIdTokenResult(true);
  if(token.claims.admin!==true){await refreshView(user);return;}
  const profile=await profileFor(user);
  await showLearner(user,profile);
  const returnButton=$('refresh-access');returnButton.textContent='Return to administrator console';
 }catch(err){adminStatus(authError(err));}
});

// If the sole administrator chooses a learner anchor from the shared navigation,
// show the learner dashboard while keeping role authority server-controlled.
window.addEventListener('hashchange',()=>{
 if(adminSessionUid && ['#learning-hub','#my-progress'].includes(location.hash) && auth?.currentUser){
  refreshView(auth.currentUser);
 }
});
