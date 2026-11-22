#!/usr/bin/env node
'use strict';
// Temporary V99-I bootstrap only. Emits PUBLIC ID-only JSON in bounded lines,
// allowing a read-only CI runner and a reviewed GitHub connector commit.
// Remove this script/workflow from PR after frozen snapshot is committed.
const {buildManifest}=require('./build_grade11_static_review_manifest_v99h.cjs');
(async()=>{
 const m=await buildManifest();
 if(m.questionRefs.length!==2250)throw Error('Unexpected public source count');
 const s=JSON.stringify(m);
 const size=3000,n=Math.ceil(s.length/size);
 console.log('PSN_V99I_BEGIN:'+s.length+':'+n+':'+m.contentSha256);
 for(let i=0;i<n;i++){
  console.log('PSN_V99I_PIECE:'+i+':'+s.slice(i*size,(i+1)*size));
 }
 console.log('PSN_V99I_END:'+n);
})().catch(e=>{console.error('V99-I bootstrap source validation failed:',e);process.exitCode=1;});
