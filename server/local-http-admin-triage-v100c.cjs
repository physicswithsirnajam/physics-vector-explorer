'use strict';
/**
 * V100-C — one LOCAL-only administrator MCQ triage HTTP action.
 * This is an emulator rehearsal, NOT a deployed Cloud Function or site API.
 * Only a matching 127.0.0.1 client can POST the exact action JSON.
 * Existing V99-Q separately verifies Firebase Auth Emulator JWT (revocation
 * checks), current account admin role/email/disabled state, immutable trusted
 * Admin UID allowlist, source-verified question and atomic Firestore audit.
 */
const http=require('node:http');
const {PROJECT,HOST:FS_HOST}=require('./firebase-review-emulator-v99f.cjs');
const {createLocalAdminReviewTransitions}=
 require('./local-admin-review-transitions-v99q.cjs');

const HOST='127.0.0.1';
const AUTH_HOST='127.0.0.1:9099';
const PATH=/^\/__local\/grade11\/admin\/reviews\/(mr_[a-f0-9]{48})\/transition$/;
const MAX_BODY_BYTES=80;
const MAX_HEADERS_BYTES=8192;
const READ_TIMEOUT_MS=3500;
const ACTIONS=Object.freeze({
 'start-review':'in-review',
 'resolve':'resolved'
});
const SAFE_ERRORS=new Set([
 'invalid-request','unsupported-method','authentication-required',
 'verified-email-required','admin-access-required','not-found',
 'invalid-transition','temporarily-unavailable'
]);
function exact(x,keys){
 return x!==null&&typeof x==='object'&&!Array.isArray(x)&&
  Object.keys(x).length===keys.length&&
  keys.every(k=>Object.hasOwn(x,k));
}
function localOnly(){
 return process.env.PSN_LOCAL_ADMIN_TRIAGE_HTTP==='enabled-local-test-only'&&
  process.env.GCLOUD_PROJECT===PROJECT&&
  process.env.FIRESTORE_EMULATOR_HOST===FS_HOST&&
  process.env.FIREBASE_AUTH_EMULATOR_HOST===AUTH_HOST&&
  !process.env.GOOGLE_APPLICATION_CREDENTIALS;
}
function once(req,name){
 let count=0;
 for(let i=0;i<req.rawHeaders.length;i+=2)
  if(req.rawHeaders[i].toLowerCase()===name)count++;
 return count===1;
}
function error(code='temporarily-unavailable'){
 const safe=SAFE_ERRORS.has(code)?code:'temporarily-unavailable';
 const status=safe==='authentication-required'?401:
  safe==='admin-access-required'||safe==='verified-email-required'?403:
  safe==='not-found'?404:safe==='invalid-transition'?409:
  safe==='unsupported-method'?405:safe==='temporarily-unavailable'?503:400;
 return {status,body:{ok:false,code:safe}};
}
function sanitizeReceipt(result,reportId,action){
 if(!result||result.ok!==true)
  return error(exact(result,['ok','code'])&&result.ok===false?
   result.code:'temporarily-unavailable');
 if(!exact(result,['ok','reportId','status','alreadyApplied'])||
    result.reportId!==reportId||result.status!==ACTIONS[action]||
    typeof result.alreadyApplied!=='boolean')
  return error();
 return {status:200,body:{
  ok:true,reportId,status:result.status,alreadyApplied:result.alreadyApplied
 }};
}
function emit(res,result){
 res.statusCode=result.status;
 res.shouldKeepAlive=false;
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','no-store, max-age=0');
 res.setHeader('Pragma','no-cache');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('Content-Security-Policy',"default-src 'none'");
 res.setHeader('Connection','close');
 // Never emit CORS or cookies. Only fixed status codes and allowlisted fields.
 res.end(JSON.stringify(result.body));
}
function readExactly(req,expected){
 return new Promise((resolve,reject)=>{
  let size=0,done=false;
  const chunks=[];
  const timeout=setTimeout(()=>finish(Error('body-timeout')),READ_TIMEOUT_MS);
  function finish(err,body){
   if(done)return;
   done=true;clearTimeout(timeout);
   req.removeListener('data',onData);req.removeListener('end',onEnd);
   req.removeListener('error',onError);req.removeListener('aborted',onAbort);
   if(err){req.resume();reject(err);}else resolve(body);
  }
  function onData(chunk){
   size+=chunk.length;
   if(size>MAX_BODY_BYTES||size>expected)
    return finish(Error('overlong-body'));
   chunks.push(chunk);
  }
  function onEnd(){
   if(size!==expected)return finish(Error('wrong-content-length'));
   try{
    const decoder=new TextDecoder('utf-8',{fatal:true});
    finish(null,decoder.decode(Buffer.concat(chunks,size)));
   }catch{finish(Error('invalid-utf8'));}
  }
  function onError(){finish(Error('body-error'));}
  function onAbort(){finish(Error('aborted'));}
  req.on('data',onData);req.on('end',onEnd);
  req.on('error',onError);req.on('aborted',onAbort);
 });
}
/**
 * Returns the local listener address for the disposable test only. No global
 * register, public route, external service or browser UI is introduced.
 */
async function startLocalAdminTriageHttpRehearsal({
 firestore,adminAuth,allowedAdminUids,isTriageEnabled=()=>false,
 now=Date.now
}={}){
 if(!localOnly())
  throw new Error('V100-C permits explicit credential-free local emulators only');
 const transition=createLocalAdminReviewTransitions({
  firestore,adminAuth,allowedAdminUids,isTriageEnabled,now
 });
 const server=http.createServer({
  maxHeaderSize:MAX_HEADERS_BYTES,requestTimeout:5000,
  headersTimeout:5000,keepAliveTimeout:1000
 },async(req,res)=>{
  try{
   if(req.socket.localAddress!==HOST||req.socket.remoteAddress!==HOST)
    return emit(res,error('invalid-request'));
   if(req.method!=='POST')
    return emit(res,error('unsupported-method'));
   const match=PATH.exec(req.url||'');
   if(!match||!once(req,'host')||!once(req,'authorization')||
      !once(req,'content-type')||!once(req,'content-length')||
      req.headers.host!==HOST+':'+server.address()?.port||
      req.headers['content-type']!=='application/json'||
      req.headers.origin!==undefined||req.headers.referer!==undefined||
      req.headers.cookie!==undefined||req.headers.forwarded!==undefined||
      req.headers['x-forwarded-for']!==undefined||
      req.headers['x-forwarded-host']!==undefined||
      req.headers['x-forwarded-proto']!==undefined||
      req.headers['transfer-encoding']!==undefined)
    return emit(res,error('invalid-request'));
   const length=req.headers['content-length'];
   if(!/^[1-9]\d{0,2}$/.test(length)||
      Number(length)>MAX_BODY_BYTES)
    return emit(res,error('invalid-request'));
   const raw=await readExactly(req,Number(length));
   let payload;
   try{payload=JSON.parse(raw);}
   catch{return emit(res,error('invalid-request'));}
   if(!exact(payload,['action'])||
      typeof payload.action!=='string'||
      !Object.hasOwn(ACTIONS,payload.action))
    return emit(res,error('invalid-request'));
   const result=await transition(Object.freeze({
    authorization:req.headers.authorization,
    reportId:match[1],action:payload.action
   }));
   // A committed transition must receive its genuine receipt, even if the
   // safety switch flips immediately afterward. Do not claim it was undone.
   return emit(res,sanitizeReceipt(result,match[1],payload.action));
  }catch{
   return emit(res,error('temporarily-unavailable'));
  }
 });
 server.maxHeadersCount=20;
 try{
  await new Promise((resolve,reject)=>{
   server.once('error',reject);
   server.listen(0,HOST,()=>{
    server.removeListener('error',reject);resolve();
   });
  });
 }catch(err){server.close();throw err;}
 const port=server.address().port;
 return Object.freeze({
  origin:'http://'+HOST+':'+port,
  urlFor:id=>'http://'+HOST+':'+port+
   '/__local/grade11/admin/reviews/'+id+'/transition',
  close:()=>new Promise((resolve,reject)=>
   server.close(err=>err?reject(err):resolve()))
 });
}
module.exports=Object.freeze({
 HOST,PATH,MAX_BODY_BYTES,startLocalAdminTriageHttpRehearsal
});
