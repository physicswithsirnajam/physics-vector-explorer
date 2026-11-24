#!/usr/bin/env node
'use strict';
/* V137 verifies original source ID-based notation evidence, with no bank edits.
 * This is technical review triage; no answer-correctness or FBISE signoff.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const {createLedger,out}=require('./audit_grade11_notation_disposition_v137.cjs');
const protectedFiles=[
 'practice-engine/index.html','shared/sitewide-science-print-v112.js',
 'question-bank/manifest.json','shared/practice-bank-adapter-v55.js',
 'server/review-manifests/grade11-approved-public-review-refs-v99i.json',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const digest=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
async function main(){
 const before=Object.fromEntries(protectedFiles.map(p=>[p,digest(p)]));
 const data=await createLedger();
 assert.equal(data.version,'V137');
 assert.equal(data.originalProvisionalMCQs,2250);
 assert.equal(data.originalFlaggedCandidateCount,304);
 assert.equal(data.originalAdvisorySignalCount,1622);
 assert.equal(data.selectedTechnicalFollowUpIDs,27);
 assert.equal(data.notYetTargetedCandidateIDs,277);
 assert.equal(data.rows.length,304);
 assert.equal(new Set(data.rows.map(x=>x.id)).size,304);
 assert.deepEqual(Object.values(data.byUnit).map(x=>x.originalV131FlaggedCandidates),[217,67,12,0,8,0]);
 assert.deepEqual(Object.values(data.byUnit).map(x=>x.selectedForTechnicalFollowUp),[4,3,12,0,8,0]);
 assert.deepEqual(Object.values(data.byUnit).map(x=>x.notYetSelected),[213,64,0,0,0,0]);
 assert.equal(data.categoryCounts.not_yet_targeted,277);
 assert.equal(data.categoryCounts.question_screenshot_sampled,6);
 assert.equal(data.categoryCounts.explanation_dom_sampled,1);
 assert.equal(data.categoryCounts.source_renderer_mechanism_checked,12);
 assert.equal(data.categoryCounts.encoded_entity_decodes_in_chromium,8);
 const tag=(id)=>data.rows.find(q=>q.id===id);
 assert.equal(tag('XI-U01-MCQ-0003').followUpStatus,'question_screenshot_sampled');
 assert.equal(tag('XI-U02-MCQ-0019').followUpStatus,'explanation_dom_sampled');
 assert.equal(tag('XI-U03-MCQ-0031').followUpStatus,'source_renderer_mechanism_checked');
 assert.equal(tag('g11-u03-master-t33-q036').followUpStatus,'source_renderer_mechanism_checked');
 assert.equal(tag('g11-u05-master-t54-q080').followUpStatus,'encoded_entity_decodes_in_chromium');
 assert.ok(data.rows.every(x=>x.teacherVisualSignoff==='PENDING'));
 assert.ok(data.rows.every(x=>x.individualScientificAnswerQc==='NOT_DONE'));
 assert.ok(data.rows.every(x=>x.correctOptionOrExplanationModified===false));
 assert.ok(data.byUnit['4'].originalV131FlaggedCandidates===0);
 assert.ok(data.byUnit['6'].teacherVisualAndScientificSignoffComplete===false);
 assert.equal(data.academicCertificationComplete,false);
 assert.equal(data.unit6FormalRelease,false);
 assert.equal(data.sourceBanksEdited,false);
 assert.equal(data.originalAnswersChanged,false);
 // A source field location must not become a copied original question or answer.
 for(const x of data.rows)assert.deepEqual(Object.keys(x).sort(),
  ['unit','id','sourceQuestionNumber','signalCodes','followUpStatus','evidenceScript',
   'teacherVisualSignoff','individualScientificAnswerQc','correctOptionOrExplanationModified'].sort());
 assert.ok(data.rows.every(x=>x.signalCodes.every(code=>/^[A-Z_]+$/.test(code))));
 fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,JSON.stringify(data,null,2)+'\n');
 const after=Object.fromEntries(protectedFiles.map(p=>[p,digest(p)]));
 assert.deepEqual(after,before,'Read-only reconciliation modified a protected source');
 console.log('V137 PASS: 304 candidate IDs, 27 individually tied to source-backed technical follow-ups, 277 not yet targeted, zero academic signoffs or source changes.');
}
main().catch(e=>{console.error('V137 TEST FAILED:',e.stack||e);process.exitCode=1;});
