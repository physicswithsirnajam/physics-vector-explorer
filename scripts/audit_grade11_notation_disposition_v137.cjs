#!/usr/bin/env node
'use strict';
/* V137: read-only reconciliation of V131 original 304 notation candidates
 * against the independent, checked-in V132–V136 follow-up test coverage.
 * Evidence is about TECHNICAL MECHANISMS and sampled browser display;
 * no candidate is certified as a scientifically correct answer or textbook match.
 * Output: original public ID, unit, source number, signal codes and evidence
 * status only. Never export question text/options/correct letter/solution.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa-artifacts/grade11-v137-notation-evidence-disposition/teacher-queue.json');
const {buildReport}=require('./audit_grade11_math_notation_v131.cjs');
const EXPECTED_UNITS={1:217,2:67,3:12,4:0,5:8,6:0};
const total=304;
const checked=[
 {unit:1,status:'question_screenshot_sampled',proof:'V133',
  ids:[3,5,19,24].map(n=>'XI-U01-MCQ-'+String(n).padStart(4,'0')),
  detail:'Four original question-only MathML/Greek/power previews at 1280/390/320px. Human visual signoff not recorded.'},
 {unit:2,status:'question_screenshot_sampled',proof:'V132',
  ids:['XI-U02-TEXT-0006','XI-U02-MCQ-0035'],
  detail:'Two original arrow-bearing public questions captured at 1280/390/320px. No certification of other Unit2 vector arrows.'},
 {unit:2,status:'explanation_dom_sampled',proof:'V132',
  ids:['XI-U02-MCQ-0019'],
  detail:'After-submission arrow mark preserved in DOM; no screenshot of solved answer or full glyph signoff.'},
 {unit:3,status:'source_renderer_mechanism_checked',proof:'V135/V136',
  ids:['XI-U03-MCQ-0031',...[36,42,45,47,50,53,55,57,58,59,60].map(n=>'g11-u03-master-t33-q'+String(n).padStart(3,'0'))],
  detail:'One summative overline and eleven formative caret/source tokens checked. Sample marker screenshots only; V136 confirmed existing V112 formats braced s^{-1} without changing original text. Full worked solution typography and science not certified.'},
 {unit:5,status:'encoded_entity_decodes_in_chromium',proof:'V134',
  ids:[61,62,63,64,77,78,79,80].map(n=>'g11-u05-master-t54-q'+String(n).padStart(3,'0')),
  detail:'All eight flagged stimulus fields are two original four-item scenario groups; source apostrophe &#x27; decoded correctly via the unchanged setRich renderer at 1280/390/320px. Group-level preview, not full eight-item answer QC.'}
];
const provenance={
 'V132':'scripts/test_grade11_v132_unit2_vector_arrow_browser.cjs',
 'V133':'scripts/test_grade11_v133_unit1_mathml_browser.cjs',
 'V134':'scripts/test_grade11_v134_unit5_entity_rendering.cjs',
 'V135':'scripts/test_grade11_v135_unit3_notation_browser.cjs',
 'V136':'scripts/test_grade11_v136_unit3_seconds_display_browser.cjs'
};
function buildEvidence(){
 const result=new Map();
 for(const g of checked){
  for(const proof of g.proof.split('/')){
   assert.ok(fs.existsSync(path.join(root,provenance[proof])),'Missing original follow-up evidence script '+proof);
  }
  for(const id of g.ids){
   assert.ok(!result.has(id),'Overlapping follow-up coverage: '+id);
   result.set(id,{unit:g.unit,status:g.status,evidence:g.proof,note:g.detail});
  }
 }
 return result;
}
async function createLedger(){
 const scan=await buildReport();
 assert.equal(scan.sourceCount,2250);
 assert.equal(scan.candidateCount,total);
 assert.equal(scan.signalCount,1622);
 for(const u of Object.keys(EXPECTED_UNITS))
  assert.equal(scan.unitSummary[u].candidateQuestions,EXPECTED_UNITS[u],
   'V131 candidate counts changed; teacher must review the baseline before asserting dispositions');
 const evidence=buildEvidence();
 assert.equal(evidence.size,27,'Follow-up source ID register changed; reconcile by original evidence');
 const byId=new Map();
 for(const f of scan.findings){
  if(!byId.has(f.id))byId.set(f.id,{unit:f.unit,id:f.id,sourceQuestionNumber:f.sourceQuestionNumber,signalCodes:new Set()});
  const q=byId.get(f.id);
  assert.equal(q.unit,f.unit);assert.equal(q.sourceQuestionNumber,f.sourceQuestionNumber);
  q.signalCodes.add(f.code);
 }
 assert.equal(byId.size,total);
 for(const [id,ev] of evidence){
  const item=byId.get(id);
  assert.ok(item,'Evidence ID absent from current original V131 flagged source: '+id);
  assert.equal(item.unit,ev.unit);
 }
 const rows=[...byId.values()].map(item=>{
  const e=evidence.get(item.id);
  return {
   unit:item.unit,id:item.id,sourceQuestionNumber:item.sourceQuestionNumber,
   signalCodes:[...item.signalCodes].sort(),
   followUpStatus:e?.status||'not_yet_targeted',
   evidenceScript:e?.evidence||null,
   teacherVisualSignoff:'PENDING',
   individualScientificAnswerQc:'NOT_DONE',
   correctOptionOrExplanationModified:false
  };
 }).sort((a,b)=>a.unit-b.unit||a.sourceQuestionNumber-b.sourceQuestionNumber||a.id.localeCompare(b.id));
 const counts={};
 for(const row of rows)counts[row.followUpStatus]=(counts[row.followUpStatus]||0)+1;
 assert.equal(counts.not_yet_targeted,277);
 assert.equal(counts.question_screenshot_sampled,6);
 assert.equal(counts.explanation_dom_sampled,1);
 assert.equal(counts.source_renderer_mechanism_checked,12);
 assert.equal(counts.encoded_entity_decodes_in_chromium,8);
 const unitSummary={};
 for(let unit=1;unit<=6;unit++){
  const subset=rows.filter(x=>x.unit===unit);
  unitSummary[unit]={
   originalPublicMCQs:scan.unitSummary[unit].sourceMCQs,
   originalV131FlaggedCandidates:subset.length,
   selectedForTechnicalFollowUp:subset.filter(x=>x.followUpStatus!=='not_yet_targeted').length,
   notYetSelected:subset.filter(x=>x.followUpStatus==='not_yet_targeted').length,
   teacherVisualAndScientificSignoffComplete:false
  };
 }
 const matrix=JSON.parse(fs.readFileSync(path.join(root,'quality/grade11-unit06-v94d-signoff-matrix.json'),'utf8'));
 assert.equal(matrix.releaseApproved,false);
 assert.equal(matrix.teacherSignoff,'pending');
 assert.equal(matrix.studentCourseStatus,'planned');
 const result={
  version:'V137',source:'V131 original public-bank notation scan + V132–V136 checked-in technical coverage',
  originalProvisionalMCQs:2250,originalFlaggedCandidateCount:total,
  originalAdvisorySignalCount:scan.signalCount,
  selectedTechnicalFollowUpIDs:27,notYetTargetedCandidateIDs:277,
  categoryCounts:counts,byUnit:unitSummary,
  evidenceReferenceFiles:provenance,
  priorities:[
   'P0: Review exact student-reported wrong-answer, missing-option, figure or unrenderable-math incidents against original NBF materials before editing anything.',
   'P1: Inspect further original Unit 2 vector-arrow candidates in live desktop/phone and, where needed, print views; existing two screenshots and one DOM check do not certify remaining 64 IDs.',
   'P1: Triage remaining 213 source-flagged Unit 1 MathML candidate IDs based on visible teaching risk; source rich markup is often intentional.',
   'P2: Keep V134 eight decoded apostrophes recorded as source-scanner false-positive display risks for the tested Chromium renderer, not as corrected question data.',
   'P2: Preserve Unit 3 formative/summative boundaries and the existing V112 scientific superscript renderer: do not rewrite original braced s^{-1}.',
   'P0 academic release: 560 Unit6 individual academic approvals remain PENDING, full course planned, graded exam unpublished.'
  ],
  limitations:[
   'These are notation PATTERN candidates, not counts of incorrect MCQs.',
   'Technical source-code, DOM and screenshot evidence is not independent NBF/scientific answer verification.',
   'Zero notation candidates in Units4/6 does NOT mean all symbols, figures or answers in those units are correct.',
   'Screenshots are representative; manual teacher visual signoff remains outstanding.',
   'No student issue-report submissions are delivered automatically: reporting remains Copy only.'
  ],
  sourceBanksEdited:false,originalAnswersChanged:false,
  academicCertificationComplete:false,unit6FormalRelease:false,
  rows
 };
 return result;
}
async function main(){
 const report=await createLedger();
 fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
 console.log('V137 PASS: '+report.originalFlaggedCandidateCount+' original notation candidates reconciled with 27 targeted technical evidence IDs; 277 not yet targeted. Zero original source/answer changes.');
 console.log('V137 RELEASE: No teacher academic signoff; 560 Unit6 item reviews remain pending.');
}
if(require.main===module)main().catch(e=>{console.error('V137 FAILED:',e.stack||e);process.exitCode=1;});
module.exports=Object.freeze({createLedger,out,checked});
