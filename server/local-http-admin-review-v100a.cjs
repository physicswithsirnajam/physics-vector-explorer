'use strict';
/**
 * V100-A — synthetic LOCAL, loopback-only HTTP rehearsal of the read-only
 * administrator MCQ issue-review queue.
 *
 * There is NO production Firebase endpoint, Cloud Function, static Pages
 * server or teacher inbox. Requires explicit trusted enable switches,
 * fixed emulator-only project/hosts, verified Admin Auth identity, current
 * Admin user record and server-controlled UID allowlist. Never deploy.
 */
const http=require('node:http');
const {PROJECT,HOST:FS_HOST}=require('./firebase-review-emulator-v99f.cjs');
const {createLocalAdminReviewReader}=require('./local-admin-review-reader-v99p.cjs');

const HOST='127.0.0.1';
const AUTH_HOST='127.0.0.1:9099';
const PATH='/__local/grade11/admin/reviews';
const PAGE_SIZE=10;
const MAX_HEADERS=8192;
const SAFE_ERRORS=new Set([
 'invalid-request','unsupported-method','authentication-required',
 'verified-email-required','admin-access-required','temporarily-unavailable'
]);
const ROW_FIELDS=Object.freeze([
 'reportId','unit','questionId','sourceQuestionNumber',
 'bankVersion','category','note','status','createdAtIso'
]);
const CATEGORY=new Set([
 'missing-context','incorrect-key','unclear-wording','formula-display','other'
]);
const STATUS=new Set(['new','in-review','resolved']);
const REPORT_ID=/^mr_[0-9a-f]{48}$/;
const UID=/^[A-Za-z0-9_-]{1,128}$/;
function exact(obj,keys){
 return obj!==null&&typeof obj==='object'&&!Array.isArray(obj)&&
  Object.keys(obj).length===keys.length&&
  keys.every(k=>Object.hasOwn(obj,k));
}
function checkRow(row){
 return exact(row,ROW_FIELDS)&&
  REPORT_ID.test(row.reportId)&&
  Number.isInteger(row.unit)&&row.unit>=1&&row.unit<=6&&
  typeof row.questionId==='string'&&row.questionId.length<=140&&
  Number.isInteger(row.sourceQuestionNumber)&&row.sourceQuestionNumber>=1&&
  typeof row.bankVersion==='string'&&row.bankVersion.length<=160&&
  CATEGORY.has(row.category)&&STATUS.has(row.status)&&
  typeof row.note==='string'&&row.note.length<=500&&
  typeof row.createdAtIso==='string'&&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.createdAtIso);
}
function safeResult(result){
 if(!result||result.ok!==true){
  const code=exact(result,['ok','code'])&&result.ok===false&&
   SAFE_ERRORS.has(result.code)?result.code:'temporarily-unavailable';
  const status=code==='authentication-required'?401:
   code==='admin-access-required'||code==='verified-email-required'?403:
   code==='temporarily-unavailable'?503:
   code==='unsupported-method'?405:400;
  return {status,body:{ok:false,code}};
 }
 if(!exact(result,['ok','count','reports'])||
    !Number.isInteger(result.count)||result.count<0||
    result.count>PAGE_SIZE||!Array.isArray(result.reports)||
    result.reports.length!==result.count||
    result.reports.some(row=>!checkRow(row)))
  return safeResult({ok:false,code:'temporarily-unavailable'});
 return {status:200,body:{
  ok:true,count:result.count,
  reports:result.reports.map(row=>Object.fromEntries(
   ROW_FIELDS.map(key=>[key,row[key]])
  ))
 }};
}
function write(res,result){
 const safe=safeResult(result);
 res.statusCode=safe.status;
 res.shouldKeepAlive=false;
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','no-store, max-age=0');
 res.setHeader('Pragma','no-cache');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('Content-Security-Policy',"default-src 'none'");
 res.setHeader('Connection','close');
 // Deliberately NO Access-Control-Allow-Origin, credentials or HTML response.
 res.end(JSON.stringify(safe.body));
}
function headerOnce(req,header){
 let n=0;
 for(let i=0;i<req.rawHeaders.length;i+=2){
  if(req.rawHeaders[i].toLowerCase()===header)n++;
 }
 return n===1;
}
function strictLocalOnly(){
 return process.env.PSN_LOCAL_ADMIN_HTTP_REHEARSAL==='enabled-local-test-only'&&
  process.env.GCLOUD_PROJECT===PROJECT&&
  process.env.FIRESTORE_EMULATOR_HOST===FS_HOST&&
  process.env.FIREBASE_AUTH_EMULATOR_HOST===AUTH_HOST&&
  !process.env.GOOGLE_APPLICATION_CREDENTIALS;
}
/**
 * Only callable by trusted synthetic local scripts with a genuine local
 * Admin Auth SDK and Firestore emulator. Never provide a request callback
 * from a public browser. An object with url/close is returned for tests.
 */
async function startLocalAdminReviewHttpRehearsal({
 firestore,adminAuth,allowedAdminUids,isReviewReaderEnabled=()=>false
}={}){
 if(!strictLocalOnly())
  throw new Error('V100-A only permits explicit credential-free local emulator testing');
 // Construct the already-tested Admin reader internally. A client cannot
 // swap in an arbitrary unverified handler to avoid role/freshness checks.
 const readReview=createLocalAdminReviewReader({
  firestore,adminAuth,allowedAdminUids,isReviewReaderEnabled
 });
 const server=http.createServer({
  maxHeaderSize:MAX_HEADERS,requestTimeout:5000,
  headersTimeout:5000,keepAliveTimeout:1000
 },async(req,res)=>{
  try{
   if(req.socket.localAddress!==HOST||req.socket.remoteAddress!==HOST)
    return write(res,{ok:false,code:'invalid-request'});
   const host=HOST+':'+server.address()?.port;
   // Never accept URL parameters, cookies, Origin/CSRF browser requests,
   // URL user credentials, forwarded headers or an upload/body.
   if(req.method!=='GET')
    return write(res,{ok:false,code:'unsupported-method'});
   if(req.url!==PATH||
      !headerOnce(req,'host')||!headerOnce(req,'authorization')||
      req.headers.host!==host||req.headers.origin!==undefined||
      req.headers.referer!==undefined||req.headers.cookie!==undefined||
      req.headers.forwarded!==undefined||
      req.headers['x-forwarded-for']!==undefined||
      req.headers['x-forwarded-host']!==undefined||
      req.headers['x-forwarded-proto']!==undefined||
      req.headers['transfer-encoding']!==undefined||
      req.headers['content-length']!==undefined)
    return write(res,{ok:false,code:'invalid-request'});
   const result=await readReview(Object.freeze({
    authorization:req.headers.authorization,limit:PAGE_SIZE
   }));
   return write(res,result);
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
 const port=server.address().port;
 return Object.freeze({
  url:'http://'+HOST+':'+port+PATH,
  origin:'http://'+HOST+':'+port,
  close:()=>new Promise((resolve,reject)=>
   server.close(err=>err?reject(err):resolve()))
 });
}
module.exports=Object.freeze({
 HOST,PATH,PAGE_SIZE,startLocalAdminReviewHttpRehearsal
});
