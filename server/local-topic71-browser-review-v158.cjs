'use strict';
/**
 * V158 — LOCAL EMULATORS ONLY: same-origin teacher review browser shell.
 * This is NOT production hosting, a live Firebase API, a teacher approval
 * service, a keyed-answer importer or a scored-test release mechanism.
 *
 * Public GET /review contains NO question data. Source questions are returned
 * only after verified Auth Emulator bearer via V155, and POST recommendations
 * are advisory-only, revision-bound and atomically audited by V155.
 */
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {PROJECT,FS_HOST,AUTH_HOST}=require('./local-classroom-provisioner-v143.cjs');
const {createLocalTopic71TeacherReviewPilot}=
 require('./local-topic71-teacher-review-pilot-v155.cjs');

const ROOT=path.resolve(__dirname,'..');
const HOST='127.0.0.1';
const SWITCH='PSN_LOCAL_TOPIC71_BROWSER_REVIEW';
const BASE='/__local/grade11/teacher/unit7/topic71';
const ROUTES=Object.freeze({
 home:BASE+'/review',
 client:BASE+'/review-client.js',
 items:BASE+'/items',
 submit:BASE+'/recommendation'
});
const MAX_HEADERS=8192,MAX_BODY=512;
const ALLOW_CODES=new Set([
 'invalid-request','authentication-required','verified-email-required',
 'teacher-access-required','source-revision-mismatch','conflict',
 'temporarily-unavailable','unsupported-method'
]);
const IDS=Object.freeze([10,15,62,76]);
const SHA=/^[a-f0-9]{64}$/;
const ID=/^XI-U07-T071-Q(010|015|062|076)$/;
const ADVICE=new Set(['supports-candidate-wording','needs-revision']);
const SIZES=Object.freeze({min:2,max:MAX_BODY});
const html='<!doctype html><html lang="en"><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>Physics with Sir Najam | Local Teacher Review</title>'+
 '<style>:root{color-scheme:light}*{box-sizing:border-box}body{font:16px/1.55 system-ui,sans-serif;max-width:1000px;margin:auto;padding:24px;background:#f4f7fb;color:#122741}header{background:#152d52;color:white;border-radius:14px;padding:24px;margin-bottom:18px}h1{margin:.1rem 0;font-size:1.8rem}header p{margin:.2rem 0}main{display:grid;gap:16px}.panel,article{background:white;border:1px solid #d7dfeb;border-radius:12px;padding:20px}label{display:block;font-weight:650;margin:8px 0 4px}input{width:100%;padding:10px;border:1px solid #9cabbd;border-radius:6px;font:inherit}button{background:#173b70;color:white;border:0;border-radius:7px;padding:10px 15px;margin:9px 8px 0 0;font:inherit;cursor:pointer}button:disabled{background:#758393;cursor:not-allowed}.subtle{font-size:.9rem;color:#495d74}article h2{margin:0 0 8px;font-size:1.2rem}.choices{list-style:none;padding:0}.choices li{margin:7px 0;padding:9px;background:#f4f7fb;border-radius:7px}.warning{border-left:4px solid #b05f00;background:#fffaef;padding:10px}.status{min-height:24px}.error{color:#8f2020}.hold{font-weight:700;color:#6c3f0a}fieldset{border:1px solid #d7dfeb;border-radius:8px}legend{font-weight:650}fieldset label{font-weight:450}input[type=radio]{width:auto;margin-right:6px}footer{color:#516378;font-size:.88rem;margin-top:16px}@media(max-width:500px){body{padding:12px}header,.panel,article{padding:14px}}</style>'+
 '</head><body><header><p>PHYSICS WITH SIR NAJAM · GRADE XI · UNIT 7 · TOPIC 7.1</p>'+
 '<h1>Teacher review — local security pilot</h1>'+
 '<p>Advisory recommendations only · No answer keys · No scored release</p></header>'+
 '<main><section class="panel" aria-labelledby="signin-title"><h2 id="signin-title">Synthetic local teacher sign-in</h2>'+
 '<p class="subtle">Works only with the disposable local Firebase Auth emulator, not your live account.</p>'+
 '<form id="signin"><label for="email">Synthetic test email</label><input id="email" type="email" autocomplete="off" required>'+
 '<label for="password">Synthetic test password</label><input id="password" type="password" autocomplete="off" required>'+
 '<button id="login-button" type="submit">Sign in to local emulator</button></form>'+
 '<button id="logout-button" type="button" hidden>Sign out</button>'+
 '<p id="auth-status" class="status" role="status">Not signed in.</p></section>'+
 '<section id="review-panel" class="panel" hidden><h2>Four source questions awaiting review</h2>'+
 '<p class="subtle">You may recommend wording, but cannot approve an answer, correct an explanation, or publish anything.</p>'+
 '<div id="questions"></div><p id="action-status" role="status" class="status"></p></section></main>'+
 '<footer>LOCAL EMULATOR ONLY · All 80 Unit 7 MCQs remain teacher PENDING. Q10 and Q76 require separate explanation correction.</footer>'+
 '<script type="module" src="'+ROUTES.client+'"></script></body></html>';
function plain(x){
 return x!==null&&typeof x==='object'&&!Array.isArray(x)&&
  Object.getPrototypeOf(x)===Object.prototype;
}
function fields(x,arr){
 return plain(x)&&Object.keys(x).length===arr.length&&
  arr.every(k=>Object.hasOwn(x,k));
}
function localOnly(){
 return process.env[SWITCH]==='enabled-local-test-only'&&
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
function codeStatus(code){
 if(code==='authentication-required')return 401;
 if(code==='teacher-access-required'||code==='verified-email-required')return 403;
 if(code==='unsupported-method')return 405;
 if(code==='source-revision-mismatch'||code==='conflict')return 409;
 if(code==='temporarily-unavailable')return 503;
 return 400;
}
function protect(res,mime){
 res.shouldKeepAlive=false;
 res.setHeader('Content-Type',mime);
 res.setHeader('Cache-Control','no-store, max-age=0');
 res.setHeader('Pragma','no-cache');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('X-Frame-Options','DENY');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('Cross-Origin-Resource-Policy','same-origin');
 res.setHeader('Cross-Origin-Opener-Policy','same-origin');
 res.setHeader('Content-Security-Policy',
  "default-src 'none'; script-src 'self' https://www.gstatic.com; "+
  "connect-src 'self' http://127.0.0.1:9099; style-src 'unsafe-inline'; "+
  "frame-ancestors 'none'; form-action 'none'; base-uri 'none'");
 res.setHeader('Connection','close');
 // Never set cookies or Access-Control-Allow-Origin.
}
function error(res,c){
 const code=ALLOW_CODES.has(c)?c:'temporarily-unavailable';
 protect(res,'application/json; charset=utf-8');
 res.statusCode=codeStatus(code);
 res.end(JSON.stringify({ok:false,code}));
}
function success(res,data){
 protect(res,'application/json; charset=utf-8');
 res.statusCode=200;
 res.end(JSON.stringify(data));
}
function strictBrowserHeaders(req,route,origin){
 const host=HOST+':'+origin.split(':').at(-1);
 if(req.headers.host!==host||!once(req,'host')||
   !once(req,'authorization')||
   req.headers.cookie!==undefined||
   req.headers.forwarded!==undefined||
   req.headers['x-forwarded-for']!==undefined||
   req.headers['x-forwarded-host']!==undefined||
   req.headers['x-forwarded-proto']!==undefined||
   req.headers['transfer-encoding']!==undefined||
   req.headers.referer!==undefined||
   (req.headers.origin!==undefined&&req.headers.origin!==origin))
  return false;
 if(route==='post'&&req.headers.origin!==origin)return false;
 return true;
}
function canonAction(raw){
 let o;
 try{o=JSON.parse(raw);}catch{return null;}
 const keys=['questionId','originalSha256','candidateSha256','recommendation'];
 if(!fields(o,keys)||!ID.test(o.questionId)||!SHA.test(o.originalSha256)||
    !SHA.test(o.candidateSha256)||!ADVICE.has(o.recommendation)||
    JSON.stringify(o)!==raw)return null;
 return o;
}
function readBody(req,size){
 return new Promise((resolve,reject)=>{
  let received=0,finished=false;
  const chunks=[],timer=setTimeout(()=>done(Error('body-timeout')),3500);
  function done(err,value){
   if(finished)return;
   finished=true;clearTimeout(timer);
   for(const [name,fn] of [['data',data],['end',end],['error',fail],['aborted',abort]])
    req.removeListener(name,fn);
   if(err){req.resume();reject(err);}else resolve(value);
  }
  function data(buf){
   received+=buf.length;
   if(received>size||received>MAX_BODY)return done(Error('overflow'));
   chunks.push(buf);
  }
  function end(){
   if(received!==size)return done(Error('bad-length'));
   try{done(null,new TextDecoder('utf-8',{fatal:true})
    .decode(Buffer.concat(chunks,received)));}catch{done(Error('bad-utf8'));}
  }
  function fail(){done(Error('read-error'));}
  function abort(){done(Error('aborted'));}
  req.on('data',data);req.on('end',end);req.on('error',fail);req.on('aborted',abort);
 });
}
function validProjection(reply){
 if(!fields(reply,['ok','items','count'])||reply.ok!==true||
    reply.count!==4||!Array.isArray(reply.items)||reply.items.length!==4)
  return false;
 return reply.items.every((x,i)=>fields(x,[
  'questionId','sourceNumber','originalSha256','candidateSha256',
  'issue','explanationRepairStillRequired','recommendation',
  'teacherAcademicSignoff','studentScoredRelease'])&&
  x.sourceNumber===IDS[i]&&x.questionId==='XI-U07-T071-Q'+String(IDS[i]).padStart(3,'0')&&
  SHA.test(x.originalSha256)&&SHA.test(x.candidateSha256)&&
  x.teacherAcademicSignoff==='PENDING'&&x.studentScoredRelease==='HOLD'&&
  (x.recommendation===null||ADVICE.has(x.recommendation))&&
  x.explanationRepairStillRequired===[10,76].includes(IDS[i]));
}
function getCandidate(){
 const lines=fs.readFileSync(path.join(ROOT,
  'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv'),'utf8')
  .trimEnd().split('\n');
 if(lines.length!==80)throw Error('Unit7 80 source candidates required');
 const entries=new Map();
 for(const n of IDS){
  const id='XI-U07-T071-Q'+String(n).padStart(3,'0');
  const row=lines[n-1].split('\t');
  if(row.length!==5||row.some(s=>!s.trim()))throw Error('Bad source question '+id);
  entries.set(id,Object.freeze({stem:row[0],options:row.slice(1)}));
 }
 return entries;
}
async function startLocalTopic71BrowserReview({
 firestore,adminAuth,allowedReviewerUids,isPilotEnabled=()=>false,now=Date.now
}={}){
 if(!localOnly())throw Error('V158 accepts localhost Firebase emulators only');
 const pilot=createLocalTopic71TeacherReviewPilot({
  firestore,adminAuth,allowedReviewerUids,isPilotEnabled,now
 });
 const source=getCandidate();
 const client=fs.readFileSync(path.join(ROOT,
  'portal/local-topic71-teacher-review-v158.js'),'utf8');
 const server=http.createServer({
  maxHeaderSize:MAX_HEADERS,requestTimeout:5000,
  headersTimeout:5000,keepAliveTimeout:1000
 },async(req,res)=>{
  try{
   if(req.socket.localAddress!==HOST||req.socket.remoteAddress!==HOST)
    return error(res,'invalid-request');
   const origin='http://'+HOST+':'+server.address()?.port;
   if(!once(req,'host')||req.headers.host!==HOST+':'+server.address()?.port||
     req.headers.cookie!==undefined||
     req.headers.origin!==undefined&&req.headers.origin!==origin||
     req.headers.forwarded!==undefined||
     req.headers['x-forwarded-for']!==undefined||
     req.headers['x-forwarded-host']!==undefined||
     req.headers['x-forwarded-proto']!==undefined||
     req.headers['transfer-encoding']!==undefined)
    return error(res,'invalid-request');
   if(req.url===ROUTES.home||req.url===ROUTES.client){
    if(req.method!=='GET')return error(res,'unsupported-method');
    if(req.headers.authorization!==undefined||
       req.headers['content-length']!==undefined||
       req.headers['content-type']!==undefined)
     return error(res,'invalid-request');
    protect(res,req.url===ROUTES.home?
      'text/html; charset=utf-8':'text/javascript; charset=utf-8');
    res.statusCode=200;
    return res.end(req.url===ROUTES.home?html:client);
   }
   if(req.url===ROUTES.items){
    if(req.method!=='GET')return error(res,'unsupported-method');
    if(!strictBrowserHeaders(req,'get',origin)||
      req.headers['content-length']!==undefined||
      req.headers['content-type']!==undefined)
     return error(res,'invalid-request');
    const result=await pilot.listPilotItems({authorization:req.headers.authorization});
    if(result.ok!==true)return error(res,result.code);
    if(!validProjection(result))return error(res,'temporarily-unavailable');
    const items=result.items.map(r=>{
      const row=source.get(r.questionId);
      if(!row)return null;
      return {
       questionId:r.questionId,sourceNumber:r.sourceNumber,
       stem:row.stem,options:row.options,
       originalSha256:r.originalSha256,candidateSha256:r.candidateSha256,
       issue:r.issue,explanationRepairStillRequired:r.explanationRepairStillRequired,
       recommendation:r.recommendation,
       teacherAcademicSignoff:'PENDING',studentScoredRelease:'HOLD'
      };
    });
    if(items.includes(null))return error(res,'temporarily-unavailable');
    return success(res,{ok:true,count:4,items});
   }
   if(req.url===ROUTES.submit){
    if(req.method!=='POST')return error(res,'unsupported-method');
    if(!strictBrowserHeaders(req,'post',origin)||
      !once(req,'content-type')||!once(req,'content-length')||
      req.headers['content-type']!=='application/json')
     return error(res,'invalid-request');
    const size=Number(req.headers['content-length']);
    if(!Number.isSafeInteger(size)||size<SIZES.min||size>SIZES.max)
     return error(res,'invalid-request');
    let raw;try{raw=await readBody(req,size);}catch{return error(res,'invalid-request');}
    const action=canonAction(raw);
    if(!action)return error(res,'invalid-request');
    const result=await pilot.recordPilotRecommendation({
      authorization:req.headers.authorization,...action
    });
    if(result.ok!==true)return error(res,result.code);
    if(!fields(result,['ok','questionId','status','alreadyRecorded','academicSignoff','scoredRelease'])||
       result.questionId!==action.questionId||result.status!=='advisory-only'||
       result.academicSignoff!=='PENDING'||result.scoredRelease!=='HOLD'||
       typeof result.alreadyRecorded!=='boolean')
     return error(res,'temporarily-unavailable');
    return success(res,{
     ok:true,questionId:action.questionId,status:'advisory-only',
     alreadyRecorded:result.alreadyRecorded,
     academicSignoff:'PENDING',scoredRelease:'HOLD'
    });
   }
   return error(res,'invalid-request');
  }catch{return error(res,'temporarily-unavailable');}
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
  url:'http://'+HOST+':'+port+ROUTES.home,
  origin:'http://'+HOST+':'+port,
  routes:ROUTES,
  close:()=>new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve()))
 });
}
module.exports=Object.freeze({startLocalTopic71BrowserReview,ROUTES,HOST,canonAction});
