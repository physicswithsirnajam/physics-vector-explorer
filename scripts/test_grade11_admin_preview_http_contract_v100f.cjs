#!/usr/bin/env node
'use strict';
/**
 * V100-F: source-derived, offline-only crosswalk between the fictional UX
 * fixtures and approved localhost HTTP review queue/history/triage schemas.
 * No Firebase initialization, real account, network call or production data.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const template=read('scripts/fixtures/grade11-admin-review-preview-v100e.template.html');
const html=read('qa-artifacts/admin-review-preview-v100e/index.html');
const queue=read('server/local-http-admin-review-v100a.cjs');
const history=read('server/local-http-admin-history-v100b.cjs');
const triage=read('server/local-http-admin-triage-v100c.cjs');
const reader=read('server/local-admin-review-reader-v99p.cjs');
const catalog=require('../server/pinned-approved-review-catalog-v99i.cjs');
const checks=[];
function pass(msg){checks.push(msg);console.log('V100-F PASS:',msg);}
function literalList(source,name){
 const anchor='const '+name+'=Object.freeze([';
 assert.equal(source.split(anchor).length,2,'backend '+name+' must be a single literal allowlist');
 const body=source.split(anchor)[1].split(']);')[0];
 const values=[...body.matchAll(/'([a-zA-Z][a-zA-Z0-9]*)'/g)].map(x=>x[1]);
 assert.ok(values.length>0,'missing allowed fields '+name);
 return values;
}
function exact(obj,fields){
 assert.deepEqual(Object.keys(obj),fields,'mock wire object must have exactly backend fields');
}
function validTime(iso){
 assert.equal(typeof iso,'string');
 assert.match(iso,/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
 assert.equal(new Date(iso).toISOString(),iso);
}
async function main(){
 assert.equal(catalog.total,2250);
 const rows=literalList(queue,'ROW_FIELDS');
 const events=literalList(history,'EVENT_FIELDS');
 assert.deepEqual(rows,['reportId','unit','questionId','sourceQuestionNumber',
  'bankVersion','category','note','status','createdAtIso']);
 assert.deepEqual(events,['action','fromStatus','toStatus','reviewedAtIso']);
 assert.match(queue,/const PAGE_SIZE=10;/);
 assert.match(queue,/limit:PAGE_SIZE/);
 assert.match(reader,/MAX_PAGE=25,DEFAULT_PAGE=10/);
 assert.match(queue,/result\.reports\.map\(row=>Object\.fromEntries\(/);
 assert.match(history,/result\.events\.map\(e=>Object\.fromEntries\(/);
 assert.match(triage,/return \{status:200,body:\{\s*ok:true,reportId,status:result\.status,alreadyApplied:result\.alreadyApplied/s);
 pass('source-defined private queue fields, audit fields, status receipt and 10-newest-item HTTP page limit');

 const match=/<script id="demo-data" type="application\/json">([\s\S]*?)<\/script>/.exec(html);
 assert.ok(match,'generated offline preview must embed fictional JSON fixture');
 const fixture=JSON.parse(match[1]);
 assert.equal(fixture.length,4);
 assert.deepEqual(fixture.map(f=>f.unit),[1,2,4,6]);
 const categories=new Set(['missing-context','incorrect-key','unclear-wording','formula-display','other']);
 const statuses=new Set(['new','in-review','resolved']);
 for(const r of fixture){
  const {events:historyEvents,...queueRow}=r;
  exact(queueRow,rows);
  assert.match(r.reportId,/^mr_[a-f0-9]{48}$/);
  assert.ok(categories.has(r.category)&&statuses.has(r.status));
  assert.ok(r.note.startsWith('Synthetic issue:')&&r.note.length<=500);
  assert.ok(Number.isInteger(r.sourceQuestionNumber));
  validTime(r.createdAtIso);
  const q=await catalog.lookup(r.questionId);
  assert.ok(q&&q.publicPractice===true,'not a pinned original practice MCQ');
  assert.equal(r.unit,q.unit);
  assert.equal(r.bankVersion,q.bankVersion);
  assert.equal(r.sourceQuestionNumber,q.sourceQuestionNumber);
  assert.ok(Array.isArray(historyEvents));
  assert.equal(historyEvents.length,r.status==='new'?0:r.status==='in-review'?1:2);
  let prior='new',when=r.createdAtIso;
  historyEvents.forEach((event,i)=>{
   exact(event,events);
   assert.equal(event.action,i===0?'start-review':'resolve');
   assert.equal(event.fromStatus,prior);
   assert.equal(event.toStatus,i===0?'in-review':'resolved');
   validTime(event.reviewedAtIso);
   assert.ok(event.reviewedAtIso>=when);
   when=event.reviewedAtIso;prior=event.toStatus;
   for(const sensitive of ['ownerUid','reviewerUid','email','correctOptionId','score','note'])
    assert.equal(Object.hasOwn(event,sensitive),false);
  });
  assert.equal(prior,r.status,'audit events must explain current status');
 }
 assert.equal(new Set(fixture.map(r=>r.reportId)).size,4);
 pass('four fictional source-pinned reports conform exactly to private queue fields');
 pass('0/1/2 audit event arrays match approved transitions, time ordering and redaction');

 for(const required of [
  'Sample reports','Sample new','Sample in review','Sample resolved',
  'Search this sample by MCQ ID or category',
  'at most 10 newest reports per request',
  'it does not provide a system-wide total, pagination or server-side filters',
  'Report created · queue timestamp (not an audit event)',
  'creation + audit events','separate private audit-history contract',
  'Every item is fictional','SYNTHETIC DEMO · NOT CONNECTED'
 ])assert.ok(template.includes(required),'missing truthful sample/contract label: '+required);
 assert.ok(!template.includes('Total reports'));
 pass('dashboard labels are sample-only; report-created timestamp is not misrepresented as an audit event');

 assert.ok(rows.includes('note')&&!events.includes('note')&&!events.includes('reviewerUid'));
 assert.match(template,/add\(btn,'p','item-note',r\.note\)/);
 assert.match(template,/add\(details,'div','issue',r\.note\)/);
 assert.ok(template.includes('e.textContent=String(value);'));
 assert.ok(!/\.innerHTML\s*=|fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|<script[^>]+src=/i.test(template));
 pass('authorized queue may show issue note as safe text; history and receipts have no note or reviewer identifiers');

 const output=path.join(root,'qa-artifacts/admin-review-preview-v100e/contract-test-summary-v100f.json');
 fs.writeFileSync(output,JSON.stringify({
  version:'V100-F',status:'PASS',checks,
  originalPublicMCQReferenceCount:2250,
  queuePageSize:10,syntheticSampleSize:fixture.length,
  queueFields:rows,auditEventFields:events,
  productionFirebaseAccess:false,
  backendHttpInvoked:false,realAdminLogin:false,studentSendEnabled:false
 },null,2)+'\n');
 console.log('V100-F FINISHED: '+checks.length+' schema/meaning QC groups passed; offline sources only.');
}
main().catch(e=>{console.error('V100-F FAILED:',e.message);process.exitCode=1;});
