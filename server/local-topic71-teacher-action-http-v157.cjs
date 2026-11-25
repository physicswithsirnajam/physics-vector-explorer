'use strict';
/**
 * V157 — STRICT LOCAL POST recommendation route, NOT a live or browser API.
 *
 * Extends the V155 teacher-authenticated four-item advisory-only pilot with
 * a disposable localhost HTTP action suitable for TRUSTED synthetic test
 * clients that attach their own Firebase Auth Emulator Authorization bearer.
 * Never exposes teacher scientific signoff, answer keys or scored releases.
 *
 * The V156 rendered HTML preview stays READ-ONLY; browser login/CSRF and
 * live deployment are deliberately separate owner-controlled milestones.
 */
const http=require('node:http');
const {PROJECT,FS_HOST,AUTH_HOST}=
 require('./local-classroom-provisioner-v143.cjs');
const {createLocalTopic71TeacherReviewPilot}=
 require('./local-topic71-teacher-review-pilot-v155.cjs');

const HOST='127.0.0.1';
const PATH='/__local/grade11/teacher/unit7/topic71/recommendation';
const SWITCH='PSN_LOCAL_TOPIC71_TEACHER_ACTION_HTTP';
const MAX_HEADER_BYTES=8192;
const MAX_BODY_BYTES=512;
const READ_TIMEOUT_MS=3500;
const RECOMMENDATIONS=new Set(['supports-candidate-wording','needs-revision']);
const ID=/^XI-U07-T071-Q(010|015|062|076)$/;
const SHA=/^[a-f0-9]{64}$/;
const FIELDS=['questionId','originalSha256','candidateSha256','recommendation'];
const SAFE_CODES=new Set([
 'invalid-request','unsupported-method','authentication-required',
 'verified-email-required','teacher-access-required','source-revision-mismatch',
 'conflict','temporarily-unavailable'
]);
function exactly(x,keys){
 return x!==null&&typeof x==='object'&&!Array.isArray(x)&&
  Object.getPrototypeOf(x)===Object.prototype&&
  Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
}
function enabled(){
 return process.env[SWITCH]==='enabled-local-test-only'&&
  process.env.GCLOUD_PROJECT===PROJECT&&
  process.env.FIRESTORE_EMULATOR_HOST===FS_HOST&&
  process.env.FIREBASE_AUTH_EMULATOR_HOST===AUTH_HOST&&
  !process.env.GOOGLE_APPLICATION_CREDENTIALS;
}
function one(req,name){
 let count=0;
 for(let i=0;i<req.rawHeaders.length;i+=2){
  if(req.rawHeaders[i].toLowerCase()===name)count++;
 }
 return count===1;
}
function status(code){
 if(code==='authentication-required')return 401;
 if(code==='teacher-access-required'||code==='verified-email-required')return 403;
 if(code==='unsupported-method')return 405;
 if(code==='source-revision-mismatch'||code==='conflict')return 409;
 if(code==='temporarily-unavailable')return 503;
 return 400;
}
function sanitized(result,itemId){
 if(!result||result.ok!==true){
  const code=exactly(result,['ok','code'])&&result.ok===false&&
   SAFE_CODES.has(result.code)?result.code:'temporarily-unavailable';
  return {status:status(code),body:{ok:false,code}};
 }
 if(!exactly(result,['ok','questionId','status','alreadyRecorded','academicSignoff','scoredRelease'])||
  result.questionId!==itemId||result.status!=='advisory-only'||
  typeof result.alreadyRecorded!=='boolean'||
  result.academicSignoff!=='PENDING'||result.scoredRelease!=='HOLD')
  return sanitized({ok:false,code:'temporarily-unavailable'});
 return {status:200,body:{
  ok:true,questionId:itemId,status:'advisory-only',
  alreadyRecorded:result.alreadyRecorded,academicSignoff:'PENDING',
  scoredRelease:'HOLD'
 }};
}
function emit(res,response){
 res.statusCode=response.status;
 res.shouldKeepAlive=false;
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','no-store, max-age=0');
 res.setHeader('Pragma','no-cache');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('X-Frame-Options','DENY');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('Content-Security-Policy',"default-src 'none'; frame-ancestors 'none'; form-action 'none'");
 res.setHeader('Connection','close');
 // No cookies or CORS; trusted loopback clients send Authorization directly.
 res.end(JSON.stringify(response.body));
}
function reject(res,code){emit(res,sanitized({ok:false,code}));}
function receive(req,length){
 return new Promise((resolve,reject)=>{
  let bytes=0,done=false;
  const chunks=[];
  const timer=setTimeout(()=>finish(Error('request-body-timeout')),READ_TIMEOUT_MS);
  function finish(err,body){
   if(done)return;
   done=true;clearTimeout(timer);
   req.removeListener('data',onData);req.removeListener('end',onEnd);
   req.removeListener('error',onError);req.removeListener('aborted',onAbort);
   if(err){req.resume();reject(err);}else resolve(body);
  }
  function onData(chunk){
   bytes+=chunk.length;
   if(bytes>length||bytes>MAX_BODY_BYTES)
    return finish(Error('bad-body-length'));
   chunks.push(chunk);
  }
  function onEnd(){
   if(bytes!==length)return finish(Error('bad-body-length'));
   try{
    const decoder=new TextDecoder('utf-8',{fatal:true});
    finish(null,decoder.decode(Buffer.concat(chunks,bytes)));
   }catch{finish(Error('invalid-utf8'));}
  }
  function onError(){finish(Error('body-error'));}
  function onAbort(){finish(Error('request-aborted'));}
  req.on('data',onData);req.on('end',onEnd);
  req.on('error',onError);req.on('aborted',onAbort);
 });
}
function parseAction(body){
 let action;
 try{action=JSON.parse(body);}catch{return null;}
 if(!exactly(action,FIELDS)||!ID.test(action.questionId)||
  !SHA.test(action.originalSha256)||!SHA.test(action.candidateSha256)||
  !RECOMMENDATIONS.has(action.recommendation))return null;
 // Canonical exact JSON rejects duplicate keys, hidden fields and confusing
 // alternate encodings, not merely what JSON.parse returns after coercion.
 if(JSON.stringify(action)!==body)return null;
 return action;
}
async function startLocalTopic71TeacherActionHttp({
 firestore,adminAuth,allowedReviewerUids,isPilotEnabled=()=>false,now=Date.now
}={}){
 if(!enabled())throw Error('V157 refuses production and nonlocal HTTP action');
 const pilot=createLocalTopic71TeacherReviewPilot({
  firestore,adminAuth,allowedReviewerUids,isPilotEnabled,now
 });
 const server=http.createServer({
  maxHeaderSize:MAX_HEADER_BYTES,requestTimeout:5000,
  headersTimeout:5000,keepAliveTimeout:1000
 },async(req,res)=>{
  try{
   if(req.socket.localAddress!==HOST||req.socket.remoteAddress!==HOST)
    return reject(res,'invalid-request');
   if(req.method!=='POST')return reject(res,'unsupported-method');
   const host=HOST+':'+server.address()?.port;
   if(req.url!==PATH||req.headers.host!==host||
     !one(req,'host')||!one(req,'authorization')||
     !one(req,'content-type')||!one(req,'content-length')||
     req.headers['content-type']!=='application/json'||
     req.headers.origin!==undefined||req.headers.referer!==undefined||
     req.headers.cookie!==undefined||req.headers.forwarded!==undefined||
     req.headers['x-forwarded-for']!==undefined||
     req.headers['x-forwarded-host']!==undefined||
     req.headers['x-forwarded-proto']!==undefined||
     req.headers['transfer-encoding']!==undefined)
    return reject(res,'invalid-request');
   const len=Number(req.headers['content-length']);
   if(!Number.isSafeInteger(len)||len<2||len>MAX_BODY_BYTES)
    return reject(res,'invalid-request');
   let body;
   try{body=await receive(req,len);}catch{return reject(res,'invalid-request');}
   const parsed=parseAction(body);
   if(!parsed)return reject(res,'invalid-request');
   const result=await pilot.recordPilotRecommendation({
    authorization:req.headers.authorization,
    questionId:parsed.questionId,
    originalSha256:parsed.originalSha256,
    candidateSha256:parsed.candidateSha256,
    recommendation:parsed.recommendation
   });
   return emit(res,sanitized(result,parsed.questionId));
  }catch{return reject(res,'temporarily-unavailable');}
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
  url:'http://'+HOST+':'+port+PATH,
  origin:'http://'+HOST+':'+port,
  close:()=>new Promise((resolve,reject)=>
   server.close(err=>err?reject(err):resolve()))
 });
}
module.exports=Object.freeze({
 startLocalTopic71TeacherActionHttp,HOST,PATH,
 MAX_BODY_BYTES,parseAction
});
