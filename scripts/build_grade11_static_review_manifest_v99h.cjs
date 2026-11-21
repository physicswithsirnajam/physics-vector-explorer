#!/usr/bin/env node
'use strict';
/**
 * V99-H deterministic BUILD-ONLY extraction of approved public Grade XI
 * question references. The V99-G browser adapter executes ONLY on reviewed
 * repository source during this local/CI build, never on production requests.
 */
const fs=require('node:fs'),path=require('node:path');
const {loadApprovedCatalog}=require('../server/approved-practice-catalog-v99g.cjs');
const {EXPECTED,TOTAL,createHashedManifest,validateStaticManifest}=
 require('../server/static-review-catalog-v99h.cjs');
const OUTPUT=path.join(__dirname,'../qa-artifacts/grade11-static-manifest-v99h/approved-public-review-refs.json');
async function buildManifest(){
 const source=await loadApprovedCatalog();
 if(source.total!==TOTAL)throw Error('Approved source count changed');
 const counts={},versions={};
 for(let unit=1;unit<=6;unit++){
  if(source.counts[unit]!==EXPECTED[unit])throw Error('Unexpected Grade XI unit '+unit+' size');
  counts[unit]=source.counts[unit];
  versions[unit]=source.bankVersions[unit];
 }
 const refs=[];
 for(const id of source.ids()){
  const q=await source.lookup(id);
  if(!q||!q.publicPractice||q.id!==id||q.unit<1||q.unit>6||
     q.bankVersion!==versions[q.unit])
   throw Error('Unapproved catalog entry '+id);
  refs.push([q.id,q.unit,q.sourceQuestionNumber]);
 }
 refs.sort((a,b)=>a[1]-b[1]||(a[0]<b[0]?-1:a[0]>b[0]?1:0));
 const manifest=createHashedManifest(counts,versions,refs);
 const lookup=validateStaticManifest(manifest);
 for(const id of source.ids()){
  const a=await lookup.lookup(id),b=await source.lookup(id);
  if(!a||a.id!==b.id||a.unit!==b.unit||
     a.sourceQuestionNumber!==b.sourceQuestionNumber||a.bankVersion!==b.bankVersion)
   throw Error('Static index differs from the original source '+id);
 }
 return manifest;
}
function serialize(manifest){return JSON.stringify(manifest,null,2)+'\n';}
async function main(){
 if(process.argv.length!==2)throw Error('This fixed-path local builder accepts no user arguments');
 const manifest=await buildManifest();
 fs.mkdirSync(path.dirname(OUTPUT),{recursive:true});
 fs.writeFileSync(OUTPUT,serialize(manifest),{encoding:'utf8',flag:'w'});
 console.log('V99-H built '+manifest.questionRefs.length+
  ' public source references; SHA-256: '+manifest.contentSha256);
 console.log('Artifact is local/CI evidence, NOT deployed or automatically committed.');
}
if(require.main===module)main().catch(error=>{console.error('V99-H build failed:',error);process.exitCode=1;});
module.exports=Object.freeze({OUTPUT,buildManifest,serialize});
