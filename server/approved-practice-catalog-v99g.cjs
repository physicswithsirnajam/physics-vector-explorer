'use strict';
/**
 * V99-G — trusted source lookup for the CURRENT PUBLIC 2,250-MCQ practice bank.
 *
 * This is a source-local, undeployed server-side catalog reader. It uses the
 * checked-in, approved V55 browser bank adapter only as a BUILD-TIME parser.
 * The parser runs with a small filesystem-read fetch shim and no network,
 * process, require, native Node imports, Firebase or user-controlled paths.
 *
 * WARNING: Node's vm is NOT a security boundary for untrusted JavaScript.
 * Never use this parser with uploaded/user-authored code. In deployment,
 * build and version a static, reviewed ID-only catalog artifact from this
 * trusted repository code rather than executing dynamic code from a request.
 */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {buildDraft}=require('../shared/mcq-review-contract-v99a.js');

const DEFAULT_ROOT=path.resolve(__dirname,'..');
const EXPECTED=Object.freeze({1:275,2:206,3:220,4:640,5:349,6:560});
const TOTAL=2250;
const PATH_RE=/^(?:\.\.\/)?question-bank\/grade-11\/([a-zA-Z0-9_.-]+\.(?:json|b64))$/;
const ALLOWED_FILES=new Set([
 'unit-01.json','unit-02.json',
 'unit-03-stage2-80-practice.json',
 'unit03-v60-part1.b64','unit03-v60-part2.b64',
 'unit-04-v39-80-practice.json',
 'unit04-v61-part1.b64','unit04-v61-part2.b64','unit04-v61-part3.b64',
 'unit04-v62-part1.b64','unit04-v62-part2.b64','unit04-v62-part3.b64',
 'unit04-v63-topic45.b64','unit04-v64-topic46.b64','unit04-v65-topic47.b64',
 'unit04-v66-figure413-five-source.json',
 'unit-05-v50-16-student.json','unit-05-v50-16-teacher-key.json',
 'unit-05-v51-16-student-b.json','unit-05-v51-16-teacher-key-b.json',
 'unit-05-master-topic-v59-317.json',
 'unit-06-topic-61-v76-80-source.json','unit-06-topic-62-v78-80-source.json',
 'unit-06-topic-63-v80-80-source.json','unit-06-topic-64-v82-80-source.json',
 'unit-06-topic64-v111-approved-practice-overlay.json',
 'unit-06-topic65-v114-approved-practice-overlay.json',
 'unit-06-topic-65-v84-80-source.json','unit-06-topic-66-v86-80-source.json',
 'unit-06-topic-67-v88-80-source.json'
]);
function readAllowed(root,url){
 const match=PATH_RE.exec(url);
 if(!match||!ALLOWED_FILES.has(match[1]))
  throw new Error('Unapproved public Grade XI question source path');
 const filename=path.resolve(root,'question-bank/grade-11',match[1]);
 const folder=path.resolve(root,'question-bank/grade-11');
 if(!filename.startsWith(folder+path.sep))throw new Error('Disallowed question source path');
 return fs.readFileSync(filename,'utf8');
}
async function loadApprovedCatalog({root=DEFAULT_ROOT}={}){
 const adapterSource=fs.readFileSync(path.join(root,'shared/practice-bank-adapter-v55.js'),'utf8');
 const fetchSource=async url=>{
  const contents=readAllowed(root,url);
  return Object.freeze({
   ok:true,status:200,
   json:async()=>JSON.parse(contents),
   text:async()=>contents
  });
 };
 const context=vm.createContext({
  fetch:fetchSource,Blob,Response,DecompressionStream,Uint8Array,atob,
  TextDecoder,TextEncoder
 });
 vm.runInContext(adapterSource,context,{timeout:4000,filename:'approved-browser-bank-parser.js'});
 const adapter=context.PSNPracticeBankV55;
 if(!adapter||typeof adapter.loadBank!=='function')
  throw new Error('Reviewed Grade XI source adapter not available');
 const records=new Map(),counts={},versions={};
 for(let unit=1;unit<=6;unit++){
  const bank=await adapter.loadBank(unit,'../question-bank/grade-11/');
  if(!bank||bank.unit!==unit||bank.grade!==11||
     bank.publicSelfPractice!==true||bank.secureExam!==false||
     typeof bank.bankVersion!=='string'||bank.bankVersion.length===0||
     bank.bankVersion.length>120||!Array.isArray(bank.questions)||
     bank.questions.length!==EXPECTED[unit])
   throw new Error('Unit '+unit+' current source bank failed trusted public-practice validation');
  counts[unit]=bank.questions.length;
  versions[unit]=bank.bankVersion;
  for(const q of bank.questions){
   if(!q||typeof q.id!=='string'||records.has(q.id)||
      !Number.isInteger(q.sourceQuestionNumber)||
      q.unit!==unit||q.grade!==11||q.active!==true||
      q.type!=='single_choice')throw new Error('Invalid or duplicate approved MCQ ID '+q?.id);
   // Validate each canonical original ID against the SAME strict input schema
   // before admitting it to any future server lookup.
   buildDraft({unit,questionId:q.id,sourceQuestionNumber:q.sourceQuestionNumber,
    bankVersion:bank.bankVersion,category:'other',note:''});
   // Project ONLY the minimal public reference metadata. No stems, answer
   // choices, correctOptionId, solution, SLOs, personally identifying data,
   // source PDF contents or privileged status leave this source adapter.
   records.set(q.id,Object.freeze({
    id:q.id,unit,sourceQuestionNumber:q.sourceQuestionNumber,
    bankVersion:bank.bankVersion,publicPractice:true
   }));
  }
 }
 if(records.size!==TOTAL||Object.values(counts).reduce((x,y)=>x+y,0)!==TOTAL)
  throw new Error('Incomplete or duplicated public practice catalog');
 return Object.freeze({
  total:records.size,counts:Object.freeze({...counts}),
  bankVersions:Object.freeze({...versions}),
  lookup:async id=>typeof id==='string'?(records.get(id)||null):null,
  ids:()=>Object.freeze([...records.keys()])
 });
}
module.exports=Object.freeze({TOTAL,EXPECTED,loadApprovedCatalog});
