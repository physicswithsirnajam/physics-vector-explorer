'use strict';
/**
 * V99-N — REAL HTTP ingestion rehearsal, strictly loopback TEST ONLY.
 *
 * A test temporarily listens on 127.0.0.1:ephemeral-port using Node HTTP.
 * No Cloud Function, Firebase connection, real App Check token, or production
 * route is registered. Production traffic MUST NOT use this helper.
 *
 * The HTTP body byte limit is enforced as data arrives (including chunked
 * requests), before V99-K sees the body. Only bounded data enters memory.
 * Same-origin checking is a defense-in-depth local test, NOT authentication,
 * CSRF protection or production CORS policy.
 */
const http=require('node:http');
const {PATH,MAX_BODY_BYTES,publicError,RequestGateError}=
 require('./offline-review-request-gate-v99k.cjs');

const DEMO_PROJECT='demo-psn-v99f-firestore';
const HOST='127.0.0.1';
const MAX_READ_MS=3500;
const SAFE_CODE=Object.freeze([
 'invalid-request','unsupported-method','unsupported-content-type',
 'payload-too-large','invalid-report','authentication-required',
 'verified-email-required','enrollment-required','app-check-required',
 'unavailable-question','please-try-later','daily-limit-reached',
 'temporarily-unavailable'
]);
const CODE_SET=new Set(SAFE_CODE);
function refusal(code){
 return publicError(new RequestGateError(code));
}
function ownObject(obj){
 return obj!==null&&typeof obj==='object'&&!Array.isArray(obj)&&
  (Object.getPrototypeOf(obj)===Object.prototype||
   Object.getPrototypeOf(obj)===null);
}
function exact(obj,keys){
 return ownObject(obj)&&Object.keys(obj).length===keys.length&&
  keys.every(k=>Object.hasOwn(obj,k));
}
function safeResponse(proposed){
 if(!exact(proposed,['statusCode','body']))return refusal('temporarily-unavailable');
 const body=proposed.body;
 if(proposed.statusCode===200){
  if(!exact(body,['ok','status','receiptId','alreadyReceived'])||
     body.ok!==true||body.status!=='received'||
     typeof body.receiptId!=='string'||
     !/^MR-\d{8}-[A-F0-9]{12}$/.test(body.receiptId)||
     typeof body.alreadyReceived!=='boolean')
   return refusal('temporarily-unavailable');
  return {statusCode:200,body:{
   ok:true,status:'received',receiptId:body.receiptId,
   alreadyReceived:body.alreadyReceived
  }};
 }
 if(!exact(body,['ok','code'])||body.ok!==false||
    !CODE_SET.has(body.code))return refusal('temporarily-unavailable');
 const allow=refusal(body.code);
 return proposed.statusCode===allow.statusCode?allow:refusal('temporarily-unavailable');
}
function singleHeader(req,name){
 let hits=0;
 for(let i=0;i<req.rawHeaders.length;i+=2){
  if(req.rawHeaders[i].toLowerCase()===name)hits++;
 }
 return hits===1;
}
function readBodyWithEarlyLimit(req){
 return new Promise((resolve,reject)=>{
  let done=false,size=0;
  const chunks=[];
  const timeout=setTimeout(()=>finish(new RequestGateError('temporarily-unavailable')),MAX_READ_MS);
  function finish(error,body){
   if(done)return;
   done=true;clearTimeout(timeout);
   req.removeListener('data',onData);
   req.removeListener('end',onEnd);
   req.removeListener('error',onError);
   req.removeListener('aborted',onAbort);
   if(error){
    // Discard any remaining incoming bytes without retaining them or blocking
    // the response. The response always sets Connection: close.
    req.resume();
    reject(error);
   }else resolve(body);
  }
  function onData(chunk){
   size+=chunk.length;
   if(size>MAX_BODY_BYTES){
    finish(new RequestGateError('payload-too-large'));
    return;
   }
   chunks.push(chunk);
  }
  function onEnd(){finish(null,Buffer.concat(chunks,size).toString('utf8'));}
  function onError(){finish(new RequestGateError('temporarily-unavailable'));}
  function onAbort(){finish(new RequestGateError('temporarily-unavailable'));}
  req.on('data',onData);req.on('end',onEnd);
  req.on('error',onError);req.on('aborted',onAbort);
 });
}
function emit(res,outcome){
 const safe=safeResponse(outcome);
 res.statusCode=safe.statusCode;
 res.shouldKeepAlive=false;
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Connection','close');
 res.end(JSON.stringify(safe.body));
}
/** Start a loopback ephemeral listener ONLY when explicitly opted into a local rehearsal. */
async function startLocalReviewHttpRehearsal({handle}={}){
 if(process.env.PSN_LOCAL_HTTP_REHEARSAL!=='enabled-local-test-only'||
    process.env.GCLOUD_PROJECT!==DEMO_PROJECT||
    process.env.GOOGLE_APPLICATION_CREDENTIALS)
  throw new Error('V99-N only allows explicit credential-free demo localhost tests');
 if(typeof handle!=='function')throw new TypeError('Trusted test-only request handler required');
 const server=http.createServer({maxHeaderSize:8192,requestTimeout:5000,
  headersTimeout:5000,keepAliveTimeout:1000},async(req,res)=>{
  try{
   // No nonlocal interface or nonlocal peer is permitted. This remains
   // test-only even if the caller tries to supply forwarded proxy headers.
   if(req.socket.localAddress!==HOST||req.socket.remoteAddress!==HOST)
    return emit(res,refusal('invalid-request'));
   const port=server.address()?.port;
   const authority=HOST+':'+port;
   if(req.method!=='POST')return emit(res,refusal('unsupported-method'));
   if(req.url!==PATH)return emit(res,refusal('invalid-request'));
   for(const name of ['host','origin','content-type','authorization','x-firebase-appcheck']){
    if(!singleHeader(req,name))return emit(res,refusal('invalid-request'));
   }
   if(req.headers.host!==authority||
      req.headers.origin!=='http://'+authority||
      req.headers.cookie!==undefined||
      req.headers.forwarded!==undefined||
      req.headers['x-forwarded-for']!==undefined)
    return emit(res,refusal('invalid-request'));
   // V99-K remains authoritative for Content-Type, bearer and report shapes.
   const declared=req.headers['content-length'];
   if(declared!==undefined){
    if(!singleHeader(req,'content-length')||!/^(0|[1-9][0-9]*)$/.test(declared))
     return emit(res,refusal('invalid-request'));
    if(Number(declared)>MAX_BODY_BYTES)
     return emit(res,refusal('payload-too-large'));
   }
   const bodyText=await readBodyWithEarlyLimit(req);
   const result=await handle(Object.freeze({
    method:req.method,path:req.url,
    contentType:req.headers['content-type'],
    authorization:req.headers.authorization,
    appCheckToken:req.headers['x-firebase-appcheck'],
    bodyText
   }));
   return emit(res,result);
  }catch(e){
   // Permit ONLY explicitly typed allowlisted RequestGateError codes, such
   // as streamed body 413. Any arbitrary/internal exception is redacted.
   return emit(res,publicError(e));
  }
 });
 server.maxHeadersCount=24;
 try{
  await new Promise((resolve,reject)=>{
   server.once('error',reject);
   server.listen(0,HOST,()=>{
    server.removeListener('error',reject);
    resolve();
   });
  });
 }catch(error){
  server.close();
  throw error;
 }
 const port=server.address().port;
 return Object.freeze({
  url:'http://'+HOST+':'+port+PATH,
  origin:'http://'+HOST+':'+port,
  close:()=>new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve()))
 });
}
module.exports=Object.freeze({
 DEMO_PROJECT,HOST,MAX_READ_MS,startLocalReviewHttpRehearsal
});
