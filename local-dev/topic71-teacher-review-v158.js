/**
 * V158 LOCAL emulator-only browser interaction.
 * No deployed route or production Firebase configuration. Synthetic test
 * teacher credentials go only to the localhost Auth Emulator via Firebase SDK;
 * Firebase ID token stays in module memory and is sent only to same-origin
 * source-bound teacher review endpoints. Never store/print an answer key.
 */
import {initializeApp} from
 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import {getAuth,connectAuthEmulator,signInWithEmailAndPassword,
 signOut,setPersistence,inMemoryPersistence} from
 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';

const PROJECT='demo-psn-v143-classrooms';
const app=initializeApp({
 apiKey:'v158-local-emulator-synthetic-only',
 authDomain:PROJECT+'.firebaseapp.com',projectId:PROJECT
},'v158-teacher-local-review');
const auth=getAuth(app);
connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});
const base='/__local/grade11/teacher/unit7/topic71';
const qs=id=>document.getElementById(id);
const form=qs('signin'),logout=qs('logout-button');
const panel=qs('review-panel'),questionRoot=qs('questions');
const authStatus=qs('auth-status'),actionStatus=qs('action-status');
let busy=false,viewer=null;
const numbers=[10,15,62,76];

function status(el,message,failed=false){
 el.textContent=message;
 el.classList.toggle('error',failed);
}
function busyMode(value){
 busy=value;
 qs('login-button').disabled=value;
 logout.disabled=value;
}
function el(tag,value,cls=''){
 const item=document.createElement(tag);
 if(value!==undefined)item.textContent=value;
 if(cls)item.className=cls;
 return item;
}
function validItem(x,i){
 return x&&x.sourceNumber===numbers[i]&&
  x.questionId==='XI-U07-T071-Q'+String(numbers[i]).padStart(3,'0')&&
  typeof x.stem==='string'&&Array.isArray(x.options)&&x.options.length===4&&
  x.options.every(t=>typeof t==='string')&&
  /^[a-f0-9]{64}$/.test(x.originalSha256)&&
  /^[a-f0-9]{64}$/.test(x.candidateSha256)&&
  x.teacherAcademicSignoff==='PENDING'&&x.studentScoredRelease==='HOLD'&&
  (x.recommendation===null||['supports-candidate-wording','needs-revision'].includes(x.recommendation));
}
async function bearer(){
 const user=auth.currentUser;
 if(!user||viewer!==user.uid)throw Error('Signed-in teacher session is required');
 // ID token is never injected into HTML, URL, storage, logs or source.
 return 'Bearer '+await user.getIdToken(true);
}
async function secureRequest(target,method='GET',body){
 const headers={Authorization:await bearer()};
 if(method==='POST')headers['Content-Type']='application/json';
 const response=await fetch(base+target,{
  method,headers,body:body===undefined?undefined:JSON.stringify(body),
  cache:'no-store',credentials:'omit',mode:'same-origin',
  redirect:'error',referrerPolicy:'no-referrer'
 });
 const result=await response.json();
 if(!result||typeof result!=='object')throw Error('Invalid local review response');
 if(!response.ok)throw Error(result.code||'Request rejected');
 return result;
}
function showItem(item){
 const card=el('article');
 card.dataset.questionId=item.questionId;
 const heading=el('h3','Question '+item.sourceNumber);
 heading.id='question-heading-'+item.sourceNumber;
 card.setAttribute('aria-labelledby',heading.id);
 card.append(heading);
 card.append(el('p',item.stem,'stem'));
 const choices=el('ol',undefined,'choices');
 item.options.forEach((choice,index)=>{
  const li=el('li');
  li.append(el('strong',String.fromCharCode(65+index)+'. '));
  li.append(document.createTextNode(choice));
  choices.append(li);
 });
 card.append(choices);
 card.append(el('p','Review concern: '+item.issue.replaceAll('-',' '),'subtle'));
 card.append(el('p','Revision '+item.candidateSha256.slice(0,12)+
  ' · source '+item.originalSha256.slice(0,12),'subtle'));
 card.append(el('p','Academic approval: PENDING · Scored practice: HOLD','hold'));
 if(item.explanationRepairStillRequired)
  card.append(el('p','Original source explanation requires separate verification and correction before any scored release.','warning'));
 if(item.recommendation!==null){
  card.append(el('p','Your recorded advisory recommendation: '+
   item.recommendation.replaceAll('-',' ')+' (immutable for this source revision).'));
  return card;
 }
 const group=el('fieldset'),legend=el('legend','Recommendation for Question '+item.sourceNumber+' (not approval)');
 group.append(legend);
 const choicesSpec=[
  ['supports-candidate-wording','Supports candidate wording'],
  ['needs-revision','Needs further revision']
 ];
 let selected=null;
 const submit=el('button','Submit advisory recommendation');
 submit.type='button';submit.disabled=true;
 submit.setAttribute('aria-label','Submit advisory recommendation for Question '+item.sourceNumber);
 choicesSpec.forEach(([value,title])=>{
  const label=el('label');
  const radio=el('input');radio.type='radio';
  radio.name='decision-'+item.sourceNumber;radio.value=value;
  radio.addEventListener('change',()=>{
   selected=value;submit.disabled=busy||!selected;
  });
  label.append(radio,document.createTextNode(title));
  group.append(label);
 });
 card.append(group,submit);
 submit.addEventListener('click',async()=>{
  if(!selected||submit.disabled)return;
  submit.disabled=true;
  status(actionStatus,'Submitting recommendation for Q'+item.sourceNumber+'…');
  let stored=false;
  try{
   const receipt=await secureRequest('/recommendation','POST',{
    questionId:item.questionId,
    originalSha256:item.originalSha256,
    candidateSha256:item.candidateSha256,
    recommendation:selected
   });
   if(receipt.academicSignoff!=='PENDING'||receipt.scoredRelease!=='HOLD'||
      receipt.status!=='advisory-only')
    throw Error('Unexpected review status');
   stored=true;
   status(actionStatus,'Q'+item.sourceNumber+
    ': recommendation recorded; academic approval remains PENDING.');
   try{await refresh();}
   catch{status(actionStatus,'Recommendation stored, but the updated list could not be loaded. Sign out and sign in to refresh.',true);}
  }catch(e){
   status(actionStatus,stored?'Recommendation stored but response validation failed.':
    'Recommendation was not confirmed: '+e.message,true);
   if(!stored)submit.disabled=false;
  }
 });
 return card;
}
async function refresh(){
 const result=await secureRequest('/items');
 if(result.count!==4||!Array.isArray(result.items)||result.items.length!==4||
    !result.items.every(validItem))throw Error('Unexpected teacher review source');
 questionRoot.replaceChildren(...result.items.map(showItem));
 panel.hidden=false;
}
form.addEventListener('submit',async event=>{
 event.preventDefault();
 if(busy)return;
 busyMode(true);
 status(authStatus,'Verifying synthetic local teacher identity…');
 try{
  await setPersistence(auth,inMemoryPersistence);
  const email=qs('email').value.trim();
  const password=qs('password').value;
  const session=await signInWithEmailAndPassword(auth,email,password);
  qs('password').value='';
  viewer=session.user.uid;
  await refresh(); // Server rechecks role, allowlist and active teacher directory.
  form.hidden=true;logout.hidden=false;
  status(authStatus,'Verified local teacher session · Advisory-only.');
  qs('review-heading').focus();
 }catch{
  viewer=null;panel.hidden=true;questionRoot.replaceChildren();
  qs('password').value='';
  await signOut(auth).catch(()=>{});
  status(authStatus,'Access denied or local emulator unavailable.',true);
  qs('email').focus();
 }finally{busyMode(false);}
});
logout.addEventListener('click',async()=>{
 if(busy)return;
 busyMode(true);
 await signOut(auth).catch(()=>{});
 viewer=null;form.hidden=false;logout.hidden=true;
 panel.hidden=true;questionRoot.replaceChildren();
 status(actionStatus,'');
 status(authStatus,'Signed out of the local emulator.');
 busyMode(false);
 qs('email').focus();
});
window.addEventListener('pagehide',()=>{
 // No persistent Firebase Auth session or bearer token in storage.
 viewer=null;
});

// Native Chromium QA can detect a loaded, event-bound module; no credential data.
document.documentElement.dataset.localReviewReady='true';
