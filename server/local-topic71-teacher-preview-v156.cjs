'use strict';
/**
 * V156 — LOCAL-ONLY, AUTHENTICATED, READ-ONLY HTML TEACHER REVIEW PREVIEW.
 * Source questions Q10/Q15/Q62/Q76 are question-only; no keyed answers.
 * This preview is not a public teacher dashboard, approval endpoint or
 * browser sign-in flow. A verified LOCAL Auth Emulator Bearer token is needed
 * to fetch its HTML. No production Firebase, student data or HTTP writes.
 */
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {PROJECT,FS_HOST,AUTH_HOST}=require('./local-classroom-provisioner-v143.cjs');
const {createLocalTopic71TeacherReviewPilot}=require('./local-topic71-teacher-review-pilot-v155.cjs');

const HOST='127.0.0.1';
const ROUTE='/__local/grade11/teacher/unit7/topic71/preview';
const SWITCH='PSN_LOCAL_TOPIC71_TEACHER_PREVIEW';
const ROOT=path.resolve(__dirname,'..');
const MAX_HEADER_BYTES=8192;
const NUMBERS=Object.freeze([10,15,62,76]);
const TYPES=new Set([
 'original-explanation-attribution','source-sulphur-stem',
 'source-glass-stem','source-polythene-candidate-and-original-explanation'
]);
const RECOMMENDATIONS=new Set(['supports-candidate-wording','needs-revision']);
const ERROR_CODES=new Set([
 'invalid-request','unsupported-method','authentication-required',
 'verified-email-required','teacher-access-required','temporarily-unavailable'
]);
function h(value){
 return String(value).replace(/[&<>"']/g,c=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
 })[c]);
}
function exact(obj,fields){
 return obj!==null&&typeof obj==='object'&&!Array.isArray(obj)&&
  Object.keys(obj).length===fields.length&&fields.every(k=>Object.hasOwn(obj,k));
}
function sha(s){return crypto.createHash('sha256').update(s,'utf8').digest('hex');}
function source(){
 const rows=fs.readFileSync(path.join(ROOT,
  'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv'),'utf8')
  .trimEnd().split('\n');
 const queue=JSON.parse(fs.readFileSync(path.join(ROOT,
  'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json'),'utf8'));
 if(rows.length!==80||queue.version!=='V154'||queue.entries?.length!==80||
    queue.teacherScienceSignoffs!==0||queue.unit7ScoredReleaseCount!==0)
  throw Error('V156 source/candidate teacher HOLD is missing');
 return new Map(NUMBERS.map(n=>{
  const id='XI-U07-T071-Q'+String(n).padStart(3,'0');
  const words=rows[n-1].split('\t'),record=queue.entries[n-1];
  if(words.length!==5||words.some(s=>s.trim().length===0)||
    record.id!==id||record.originalWordAnswerKeyIndependentlyApproved!==false||
    record.eligibleForScoredStudentRelease!==false||
    !/^[a-f0-9]{64}$/.test(record.originalFullRowSha256))
   throw Error('V156 invalid source item '+id);
  return [id,Object.freeze({
   id,number:n,words:Object.freeze(words),
   originalSha256:record.originalFullRowSha256,candidateSha256:sha(rows[n-1])
  })];
 }));
}
function localOnly(){
 return process.env[SWITCH]==='enabled-local-test-only'&&
  process.env.GCLOUD_PROJECT===PROJECT&&
  process.env.FIRESTORE_EMULATOR_HOST===FS_HOST&&
  process.env.FIREBASE_AUTH_EMULATOR_HOST===AUTH_HOST&&
  !process.env.GOOGLE_APPLICATION_CREDENTIALS;
}
function headerOnce(req,name){
 let n=0;
 for(let i=0;i<req.rawHeaders.length;i+=2)
  if(req.rawHeaders[i].toLowerCase()===name)n++;
 return n===1;
}
function statusFor(code){
 if(code==='authentication-required')return 401;
 if(code==='verified-email-required'||code==='teacher-access-required')return 403;
 if(code==='temporarily-unavailable')return 503;
 if(code==='unsupported-method')return 405;
 return 400;
}
function basicHeaders(res){
 res.shouldKeepAlive=false;
 res.setHeader('Cache-Control','no-store, max-age=0');
 res.setHeader('Pragma','no-cache');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('X-Frame-Options','DENY');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('Content-Security-Policy',
  "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'");
 res.setHeader('Connection','close');
 // Deliberately NO Access-Control-Allow-Origin or cookies.
}
function emitError(res,code){
 const result=ERROR_CODES.has(code)?code:'temporarily-unavailable';
 basicHeaders(res);res.statusCode=statusFor(result);
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.end(JSON.stringify({ok:false,code:result}));
}
function validateProjection(result,authoritative){
 if(!exact(result,['ok','items','count'])||result.ok!==true||
   result.count!==4||!Array.isArray(result.items)||result.items.length!==4)
  return false;
 const keys=['questionId','sourceNumber','originalSha256','candidateSha256',
  'issue','explanationRepairStillRequired','recommendation',
  'teacherAcademicSignoff','studentScoredRelease'];
 return result.items.every((x,i)=>{
  const target=authoritative.get('XI-U07-T071-Q'+String(NUMBERS[i]).padStart(3,'0'));
  return exact(x,keys)&&!!target&&
   x.questionId===target.id&&x.sourceNumber===target.number&&
   x.originalSha256===target.originalSha256&&
   x.candidateSha256===target.candidateSha256&&TYPES.has(x.issue)&&
   x.explanationRepairStillRequired===[10,76].includes(target.number)&&
   (x.recommendation===null||RECOMMENDATIONS.has(x.recommendation))&&
   x.teacherAcademicSignoff==='PENDING'&&x.studentScoredRelease==='HOLD';
 });
}
function renderTeacherPreview(projection,authoritative){
 if(!validateProjection(projection,authoritative))
  throw Error('V156 refuses malformed or untrusted backend projection');
 const cards=projection.items.map(item=>{
  const canonical=authoritative.get(item.questionId);
  const choices=canonical.words.slice(1).map((s,i)=>
   '<li><strong>'+String.fromCharCode(65+i)+'.</strong> '+h(s)+'</li>').join('');
  return '<article data-question-id="'+h(item.questionId)+'">'+
   '<h2>Question '+canonical.number+'</h2>'+
   '<p class="stem">'+h(canonical.words[0])+'</p>'+
   '<ol class="choices">'+choices+'</ol>'+
   '<dl><dt>Review concern</dt><dd>'+h(item.issue.replaceAll('-',' '))+'</dd>'+
   '<dt>Candidate revision</dt><dd><code>'+h(item.candidateSha256.slice(0,12))+'</code></dd>'+
   '<dt>Source row</dt><dd><code>'+h(item.originalSha256.slice(0,12))+'</code></dd>'+
   '<dt>Teacher recommendation</dt><dd>'+h(item.recommendation??'Not recorded')+'</dd>'+
   '<dt>Scientific/cognitive signoff</dt><dd>Pending — not an approval</dd>'+
   '<dt>Scored practice</dt><dd>HOLD — 0 published</dd></dl>'+
   (item.explanationRepairStillRequired?
    '<p class="warning">Original owner explanation needs separate verified correction before any scored-key release.</p>':'')+
   '</article>';
 }).join('');
 return '<!doctype html><html lang="en"><head><meta charset="utf-8">'+
  '<meta name="viewport" content="width=device-width, initial-scale=1">'+
  '<title>Physics with Sir Najam | Local Teacher Review Preview</title>'+
  '<style>body{font-family:system-ui,sans-serif;background:#f6f8fb;color:#192840;max-width:980px;margin:0 auto;padding:24px;line-height:1.5}header{background:#172d50;color:white;border-radius:12px;padding:22px;margin-bottom:22px}h1{font-size:1.7rem;margin:.3rem 0}header p{margin-bottom:0}article{background:white;border:1px solid #dbe3ef;border-radius:12px;margin:18px 0;padding:22px}h2{font-size:1.25rem;color:#172d50;margin:0 0 10px}.stem{font-weight:600}.choices{list-style:none;padding:0}.choices li{padding:8px;margin:6px 0;background:#f5f7fa;border-radius:6px}dl{display:grid;grid-template-columns:160px 1fr;gap:6px;font-size:.9rem}dt{font-weight:700}dd{margin:0}.warning{padding:12px;border-left:4px solid #a55a00;background:#fffaef}footer{color:#415670;font-size:.9rem}</style>'+
  '</head><body><header><p>PHYSICS WITH SIR NAJAM · GRADE XI · UNIT 7, TOPIC 7.1</p>'+
  '<h1>Teacher review preview · 4 source decisions</h1>'+
  '<p>LOCAL FIREBASE EMULATOR ONLY · READ-ONLY · NO ANSWER KEYS · NO STUDENT RELEASE</p></header>'+
  cards+'<footer>Questions 10, 15, 62 and 76 remain pending academic verification. '+
  'Recommendations are advisory; this preview cannot approve, edit, grade or publish questions.'+
  '</footer></body></html>';
}
/**
 * This listener accepts only LOCAL trusted tools capable of setting an
 * Authorization header. It does not implement a browser sign-in flow.
 */
async function startLocalTopic71TeacherPreview({
 firestore,adminAuth,allowedReviewerUids,isPilotEnabled=()=>false
}={}){
 if(!localOnly())throw Error('V156 only starts with explicit loopback emulator enablement');
 const checked=source();
 const service=createLocalTopic71TeacherReviewPilot({
  firestore,adminAuth,allowedReviewerUids,isPilotEnabled
 });
 const server=http.createServer({
  maxHeaderSize:MAX_HEADER_BYTES,requestTimeout:5000,
  headersTimeout:5000,keepAliveTimeout:1000
 },async(req,res)=>{
  try{
   if(req.socket.localAddress!==HOST||req.socket.remoteAddress!==HOST)
    return emitError(res,'invalid-request');
   if(req.method!=='GET')return emitError(res,'unsupported-method');
   const host=HOST+':'+server.address()?.port;
   if(req.url!==ROUTE||req.headers.host!==host||
     !headerOnce(req,'host')||!headerOnce(req,'authorization')||
     req.headers.origin!==undefined||req.headers.referer!==undefined||
     req.headers.cookie!==undefined||req.headers.forwarded!==undefined||
     req.headers['x-forwarded-for']!==undefined||
     req.headers['x-forwarded-host']!==undefined||
     req.headers['x-forwarded-proto']!==undefined||
     req.headers['transfer-encoding']!==undefined||
     req.headers['content-length']!==undefined||
     req.headers['content-type']!==undefined)
    return emitError(res,'invalid-request');
   const result=await service.listPilotItems(Object.freeze({
    authorization:req.headers.authorization
   }));
   if(result?.ok!==true)return emitError(res,result?.code);
   if(!validateProjection(result,checked))
    return emitError(res,'temporarily-unavailable');
   const body=renderTeacherPreview(result,checked);
   basicHeaders(res);res.statusCode=200;
   res.setHeader('Content-Type','text/html; charset=utf-8');
   return res.end(body);
  }catch{return emitError(res,'temporarily-unavailable');}
 });
 server.maxHeadersCount=20;
 try{
  await new Promise((resolve,reject)=>{
   server.once('error',reject);
   server.listen(0,HOST,()=>{server.removeListener('error',reject);resolve();});
  });
 }catch(e){server.close();throw e;}
 const port=server.address().port;
 return Object.freeze({
  url:'http://'+HOST+':'+port+ROUTE,origin:'http://'+HOST+':'+port,
  close:()=>new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()))
 });
}
module.exports=Object.freeze({
 startLocalTopic71TeacherPreview,renderTeacherPreview,HOST,ROUTE
});
