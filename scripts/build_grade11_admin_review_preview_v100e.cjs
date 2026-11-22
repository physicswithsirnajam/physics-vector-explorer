#!/usr/bin/env node
'use strict';
/**
 * V100-E generates a standalone, no-network administrator UX mock.
 * Four fictional records reference checked-in metadata-only real MCQ IDs,
 * but no real student reports/answer keys/account information are copied.
 * The HTML output is a CI artifact, never written into the hosted portal.
 */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');
const root=path.resolve(__dirname,'..');
const templatePath=path.join(root,'scripts','fixtures',
 'grade11-admin-review-preview-v100e.template.html');
const logoPath=path.join(root,'portal','assets',
 'physics-with-sir-najam-official-logo.png');
const output=path.join(root,'qa-artifacts','admin-review-preview-v100e');
const notes=[
 'Synthetic issue: the listed answer key may not match the worked calculation.',
 'Synthetic issue: the question refers to a diagram that is not displayed.',
 'Synthetic issue: the formula exponent needs clearer formatting.',
 'Synthetic issue: two options appear too similar in wording.'
];
const categories=['incorrect-key','missing-context','formula-display','unclear-wording'];
const statuses=['new','new','in-review','resolved'];
async function pick(unit){
 for(const id of catalog.ids()){
  const data=await catalog.lookup(id);
  if(data&&data.publicPractice===true&&data.unit===unit)return data;
 }
 throw new Error('Approved source-pinned metadata unavailable for unit '+unit);
}
async function main(){
 assert.equal(catalog.total,2250);
 const sources=await Promise.all([1,2,4,6].map(pick));
 const fixture=sources.map((q,i)=>({
  reportId:'mr_'+(201+i).toString(16).padStart(48,'0'),
  unit:q.unit,questionId:q.id,
  sourceQuestionNumber:q.sourceQuestionNumber,
  bankVersion:q.bankVersion,category:categories[i],
  note:notes[i],status:statuses[i],
  createdAtIso:new Date(Date.parse('2026-11-22T12:00:00.000Z')+i*60000).toISOString(),
  events:i<2?[]:i===2?[{
   action:'start-review',fromStatus:'new',toStatus:'in-review',
   reviewedAtIso:'2026-11-22T12:20:00.000Z'
  }]:[
   {action:'start-review',fromStatus:'new',toStatus:'in-review',
    reviewedAtIso:'2026-11-22T12:15:00.000Z'},
   {action:'resolve',fromStatus:'in-review',toStatus:'resolved',
    reviewedAtIso:'2026-11-22T12:30:00.000Z'}
  ]
 }));
 const logo=fs.readFileSync(logoPath);
 assert.ok(logo.length>1000,'Official image must exist');
 assert.ok(logo.subarray(0,8).equals(
  Buffer.from([137,80,78,71,13,10,26,10])),'Official logo is intact PNG');
 let html=fs.readFileSync(templatePath,'utf8');
 assert.equal(html.split('__LOGO_DATA__').length,2);
 assert.equal(html.split('__FIXTURES_JSON__').length,2);
 const json=JSON.stringify(fixture)
  .replace(/</g,'\\u003c')
  .replace(/>/g,'\\u003e')
  .replace(/&/g,'\\u0026');
 html=html.replace('__LOGO_DATA__',
  'data:image/png;base64,'+logo.toString('base64'))
  .replace('__FIXTURES_JSON__',json);
 // Assert no runtime network calls or browser identity persistence.
 assert.ok(!/\bfetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|new WebSocket\s*\(|<script[^>]+src=/i.test(html));
 assert.equal(html.includes('__LOGO_DATA__'),false);
 assert.equal(html.includes('__FIXTURES_JSON__'),false);
 fs.mkdirSync(output,{recursive:true});
 fs.writeFileSync(path.join(output,'index.html'),html);
 fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify({
  version:'V100-E',kind:'fictional offline UX prototype',
  originalLogoEmbeddedByteForByte:true,
  approvedOriginalPublicMcqReferences:catalog.total,
  syntheticReports:fixture.length,sourceUnits:fixture.map(q=>q.unit),
  sourceQuestionIds:fixture.map(q=>q.questionId),
  browserLogin:false,realStudentData:false,firebaseApi:false,
  permanentReviewWrites:false,studentSendEnabled:false,
  deployedToPublicPortal:false,realAppCheckProof:false
 },null,2)+'\n');
 console.log('V100-E BUILD PASS: standalone preview, 4 synthetic reports from approved metadata, exact official logo. NO API OR FIREBASE.');
}
main().catch(error=>{
 console.error('V100-E BUILD FAILED:',error.message);
 process.exitCode=1;
});
