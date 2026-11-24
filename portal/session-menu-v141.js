/* Physics with Sir Najam V141 — presentational verified-account header menu.
 * This module NEVER authenticates users or authorizes teacher/student records.
 * app.js calls show() only after Firebase verified-email/ID-token/profile check;
 * the backend's deployed Security Rules remain the actual permissions gate.
 */
export function createSessionMenu({onSignOut}){
 const $=id=>document.getElementById(id);
 const holder=$('psn-account-holder');
 const pop=$('psn-account-popover');
 const button=$('psn-account-trigger');
 const username=$('psn-account-name');
 const avatar=$('psn-account-avatar');
 const email=$('psn-account-email');
 const logout=$('psn-account-signout');
 if(!holder||!pop||!button||!username||!avatar||!email||!logout||
    typeof onSignOut!=='function')throw Error('V141 account menu setup incomplete');
 let sessionUid=null;
 const close=()=>{pop.open=false};
 const hide=()=>{
  sessionUid=null;close();holder.hidden=true;
  username.textContent='Account';avatar.textContent='?';email.textContent='';
  button.setAttribute('aria-label','Account options');
 };
 const show=(user,verifiedDisplayName)=>{
  if(!user?.uid||user.emailVerified!==true){hide();return false}
  const raw=typeof verifiedDisplayName==='string'?verifiedDisplayName:user.displayName;
  const name=(String(raw||'Student').trim().slice(0,80)||'Student');
  const address=String(user.email||'Verified account').slice(0,140);
  if(sessionUid!==user.uid)close();
  sessionUid=user.uid;
  username.textContent=name;email.textContent=address;
  avatar.textContent=(name.match(/[\p{L}\p{N}]/u)||['?'])[0].toLocaleUpperCase();
  button.setAttribute('aria-label','Account options for '+name);
  holder.hidden=false;
  return true;
 };
 document.addEventListener('click',event=>{
  if(!holder.hidden&&!holder.contains(event.target))close();
 });
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&pop.open){close();button.focus();}
 });
 logout.addEventListener('click',async()=>{
  if(!sessionUid)return;
  close();
  try{await onSignOut()}catch{
   // app.js owns Firebase/auth error display; do not claim sign-out succeeded.
  }
 });
 for(const link of holder.querySelectorAll('a[href]'))
  link.addEventListener('click',close);
 hide();
 return Object.freeze({show,hide,close});
}
