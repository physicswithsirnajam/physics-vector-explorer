'use strict';
/**
 * V100-B — strictly LOCAL read-only audit history HTTP rehearsal.
 * No Cloud Function, student endpoint, hosted route, service account, or
 * production Firebase. Binds only 127.0.0.1:ephemeral and refuses start
 * without deliberate local demo/emulator flags.
 */
const http=require('node:http');
const {PROJECT,HOST:FS_HOST}=require('./firebase-review-emulator-v99f.cjs');
const {createLocalAdminAuditHistoryReader}=
 require('./local-admin-audit-history-v99r.cjs');
const HOST='127.0.0.1';
const AUTH_HOST='127.0.0.1:9099';
const BASE='/__local/grade11/admin/reviews/';
const PATH=/^\/__local\/grade11\/admin\/reviews\/(mr_[a-f0-9]{48})\/history$/;
const MAX_HEADERS=8192;
const CODES=new Set([
 'invalid-request','unsupported-method','authentication-required',
 'verified-email-required','admin-access-required','not-found',
 'temporarily-unavailable'
]);
const ACTIONS=new Set(['start-review','resolve']);
const STATUSES=new Set(['new','in-review','resolved']);
const EVENT_FIELDS=Object.freeze([
 'action','fromStatus','toStatus','reviewedAtIso'
]);
const ISO=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/;
function exact(value,keys){
 return value!==null&&typeof value==='object'&&!Array.isArray(value)&&
  Object.keys(value).length===keys.length&&
  keys.every(key=>Object.hasOwn(value,key));
}
function validEvent(e){
 return exact(e,EVENT_FIELDS)&&
  ACTIONS.has(e.action)&&STATUSES.has(e.fromStatus)&&
  STATUSES.has(e.toStatus)&&typeof e.reviewedAtIso==='string'&&
  ISO.test(e.reviewedAtIso)&&Number.isFinite(Date.parse(e.reviewedAtIso))&&
  ((e.action==='start-review'&&e.fromStatus==='new'&&
    e.toStatus==='in-review')||
   (e.action==='resolve'&&e.fromStatus==='in-review'&&
    e.toStatus==='resolved'));
}
function safe(result,requestedId){
 if(!result||result.ok!==true){
  const code=exact(result,['ok','code'])&&result.ok===false&&
   CODES.has(result.code)?result.code:'temporarily-unavailable';
  const status=code==='authentication-required'?401:
   code==='admin-access-required'||code==='verified-email-required'?403:
   code==='not-found'?404:code==='unsupported-method'?405:
   code==='temporarily-unavailable'?503:400;
  return {status,body:{ok:false,code}};
 }
 if(!exact(result,['ok','reportId','questionId','status','events'])||
    result.reportId!==requestedId||
    typeof result.questionId!=='string'||
    !/^[A-Za-z0-9_.:-]{1,160}$/.test(result.questionId)||
    !STATUSES.has(result.status)||
    !Array.isArray(result.events)||result.events.length>2||
    result.events.some(e=>!validEvent(e))||
    (result.status==='new'&&result.events.length!==0)||
    (result.status==='in-review'&&
     (result.events.length!==1||result.events[0].action!=='start-review'))||
    (result.status==='resolved'&&
     (result.events.length!==2||
      result.events[0].action!=='start-review'||
      result.events[1].action!=='resolve')))
  return safe({ok:false,code:'temporarily-unavailable'},requestedId);
 return {status:200,body:{
  ok:true,reportId:result.reportId,questionId:result.questionId,
  status:result.status,events:result.events.map(e=>Object.fromEntries(
   EVENT_FIELDS.map(field=>[field,e[field]])
  ))
 }};
}
function write(res,result,id){
 const checked=safe(result,id);
 res.statusCode=checked.status;
 res.shouldKeepAlive=false;
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','no-store, max-age=0');
 res.setHeader('Pragma','no-cache');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('Content-Security-Policy',"default-src 'none'");
 res.setHeader('Connection','close');
 // Never CORS-enable this local rehearsal or emit an HTML/error stack.
 res.end(JSON.stringify(checked.body));
}
function once(req,key){
 let count=0;
 for(let i=0;i<req.rawHeaders.length;i+=2)
  if(req.rawHeaders[i].toLowerCase()===key)count++;
 return count===1;
}
function localOnly(){
 return process.env.PSN_LOCAL_ADMIN_HISTORY_HTTP==='enabled-local-test-only'&&
  process.env.GCLOUD_PROJECT===PROJECT&&
  process.env.FIRESTORE_EMULATOR_HOST===FS_HOST&&
  process.env.FIREBASE_AUTH_EMULATOR_HOST===AUTH_HOST&&
  !process.env.GOOGLE_APPLICATION_CREDENTIALS;
}
async function startLocalAdminHistoryHttpRehearsal({
 firestore,adminAuth,allowedAdminUids,isHistoryEnabled=()=>false
}={}){
 if(!localOnly())
  throw new Error('V100-B only permits explicit credential-free localhost emulators');
 if(typeof isHistoryEnabled!=='function')
  throw new TypeError('Trusted server-only history switch must be a function');
 const enabled=async()=>{
  try{return await isHistoryEnabled()===true;}catch{return false;}
 };
 // Keep authentication, current user authorization, approved MCQ source
 // and deterministic Firestore history validation inside the already-tested
 // V99-R reader. Never accept a browser-provided "admin" override.
 const readHistory=createLocalAdminAuditHistoryReader({
  firestore,adminAuth,allowedAdminUids,isHistoryEnabled
 });
 const server=http.createServer({
  maxHeaderSize:MAX_HEADERS,requestTimeout:5000,
  headersTimeout:5000,keepAliveTimeout:1000
 },async(req,res)=>{
  try{
   if(req.socket.localAddress!==HOST||req.socket.remoteAddress!==HOST)
    return write(res,{ok:false,code:'invalid-request'});
   if(req.method!=='GET')
    return write(res,{ok:false,code:'unsupported-method'});
   const match=PATH.exec(req.url||'');
   if(!match||!once(req,'host')||!once(req,'authorization')||
      req.headers.host!==HOST+':'+server.address()?.port||
      req.headers.origin!==undefined||req.headers.referer!==undefined||
      req.headers.cookie!==undefined||
      req.headers.forwarded!==undefined||
      req.headers['x-forwarded-for']!==undefined||
      req.headers['x-forwarded-host']!==undefined||
      req.headers['x-forwarded-proto']!==undefined||
      req.headers['content-length']!==undefined||
      req.headers['transfer-encoding']!==undefined)
    return write(res,{ok:false,code:'invalid-request'});
   const result=await readHistory(Object.freeze({
    authorization:req.headers.authorization,reportId:match[1]
   }));
   // Explicit final check also suppresses a completed private history
   // read if the trusted server switch was turned OFF before response.
   if(!(await enabled()))
    return write(res,{ok:false,code:'temporarily-unavailable'});
   return write(res,result,match[1]);
  }catch{
   return write(res,{ok:false,code:'temporarily-unavailable'});
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
 }catch(error){server.close();throw error;}
 const port=server.address().port,origin='http://'+HOST+':'+port;
 return Object.freeze({
  origin,
  historyUrl:reportId=>BASE+reportId+'/history',
  urlFor:reportId=>origin+BASE+reportId+'/history',
  close:()=>new Promise((resolve,reject)=>
   server.close(error=>error?reject(error):resolve()))
 });
}
module.exports=Object.freeze({
 HOST,BASE,PATH,startLocalAdminHistoryHttpRehearsal
});
