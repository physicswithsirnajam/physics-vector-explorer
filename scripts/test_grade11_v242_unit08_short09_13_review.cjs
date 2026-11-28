#!/usr/bin/env node
'use strict';
/* V242: original NBF Grade XI Unit 8 Short Questions 8.9–8.13.
 * Preliminary science/SLO metadata; no source stems or answers published.
 */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const rev=json('quality/unit08/unit08-v242-short09-13-review-no-answers.json');
const notes=read('quality/unit08/unit08-v242-short09-13-academic-triage.md');
const v241=json('quality/unit08/unit08-v241-short05-08-review-no-answers.json');
const v240=json('quality/unit08/unit08-v240-short01-04-review-no-answers.json');
const v235=json('quality/unit08/unit08-v235-original-exercises-inventory-no-keys.json');
const v224=json('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const catalog=json('portal/learning-catalog.json'),banks=json('question-bank/manifest.json');
assert.equal(rev.schema,'psn-nbf-grade11-unit08-short-response-qc-v242');
assert.equal(rev.version,'V242');
assert.equal(rev.originalSource.sourceSha256,v224.originalTextbook.sha256);
assert.equal(rev.originalSource.sourceSha256,v235.source.sha256);
assert.deepEqual(rev.originalSource.printedPages,[152]);
assert.deepEqual(rev.originalSource.questionIds,['8.9','8.10','8.11','8.12','8.13']);
assert.deepEqual(v240.originalSource.questionIds,['8.1','8.2','8.3','8.4']);
assert.deepEqual(v241.originalSource.questionIds,['8.5','8.6','8.7','8.8']);
const original=v235.sourceSections.find(x=>x.kind==='short');
assert.ok(original);
assert.equal(original.items.length,13);
assert.equal(v235.observedTotal,50);
assert.deepEqual([...v240.items,...v241.items,...rev.items].map(x=>x.sourceNumber),
 original.items.map(x=>x.sourceNumber),'All original 13 short questions must be covered in sequence');
assert.equal(rev.items.length,5);
assert.deepEqual(rev.items.map(x=>x.sourceNumber),['8.9','8.10','8.11','8.12','8.13']);
assert.deepEqual(rev.items.map(x=>x.printedPages),[[152],[152],[152],[152],[152]]);
assert.deepEqual(original.items.find(x=>x.sourceNumber==='8.13').subparts,['i','ii','iii','iv']);
assert.deepEqual(rev.items.find(x=>x.sourceNumber==='8.13').subparts,['i','ii','iii','iv']);
const framework=v224.officialFramework.slos;
for(const item of rev.items){
 const old=original.items.find(x=>x.sourceNumber===item.sourceNumber);
 assert.ok(old,'Missing original short question '+item.sourceNumber);
 assert.deepEqual(item.printedPages,old.printedPages);
 assert.equal(item.focus,old.focus);
 assert.equal(item.keepOriginal,true);
 assert.equal(item.studentRelease,'HOLD');
 assert.equal(item.answersPublished,false);
 assert.equal(item.approvedTeacherMarkingScheme,false);
 assert.equal(item.teacherScienceApproval,'PENDING');
 assert.equal(item.teacherSloApproval,'PENDING');
 assert.ok(item.scienceReview.length>170,'Require independently written nuanced science review');
 assert.ok(item.reason.length>190,'Require explicit teacher reasoning and scope control');
 const code=framework.find(s=>s.printedCode===item.candidateSummativeSlo);
 assert.ok(code,'Candidate printed SLO must be present in V224');
 assert.equal(code.assessment,'Summative');
 assert.equal(item.candidateFrameworkCognitive,code.cognitive);
 assert.ok(code.cognitive.includes(item.observedCognitive),'Observed cognitive level needs printed outcome support');
 if(item.additionalCandidateSlo){
  const secondary=framework.find(s=>s.printedCode===item.additionalCandidateSlo);
  assert.ok(secondary&&secondary.assessment==='Summative');
 }
}
assert.deepEqual(rev.items.map(x=>x.candidateSummativeSlo),
 ['P-11-C-08','P-11-C-16','P-11-C-20','P-11-C-17','P-11-C-08']);
assert.equal(rev.items.find(x=>x.sourceNumber==='8.10').additionalCandidateSlo,'P-11-C-14');
assert.equal(rev.items.find(x=>x.sourceNumber==='8.11').additionalCandidateSlo,'P-11-C-19');
assert.equal(rev.items.find(x=>x.sourceNumber==='8.13').additionalCandidateSlo,'P-11-C-12');
assert.deepEqual(rev.items.filter(x=>x.compulsoryExplanationBeforeAssessedUse).map(x=>x.sourceNumber),
 ['8.9','8.10','8.11','8.13']);
assert.deepEqual(rev.items.filter(x=>!x.compulsoryExplanationBeforeAssessedUse).map(x=>x.sourceNumber),['8.12']);
assert.deepEqual(rev.items.filter(x=>x.compulsoryMappingReview).map(x=>x.sourceNumber),['8.9','8.10','8.13']);
assert.match(rev.items.find(x=>x.sourceNumber==='8.9').scienceReview,/free.*vacuum/i);
assert.match(rev.items.find(x=>x.sourceNumber==='8.9').scienceReview,/not a quasistatic isothermal/i);
assert.match(rev.items.find(x=>x.sourceNumber==='8.10').scienceReview,/zero net entropy change/i);
assert.match(rev.items.find(x=>x.sourceNumber==='8.11').scienceReview,/isolated whole/i);
assert.match(rev.items.find(x=>x.sourceNumber==='8.12').scienceReview,/dehumidify/i);
assert.match(rev.items.find(x=>x.sourceNumber==='8.13').scienceReview,/mechanical shaking/i);
assert.match(rev.items.find(x=>x.sourceNumber==='8.13').reason,/\(i\).*\(ii\).*\(iii\).*\(iv\)/i);
const audit=rev.audit;
assert.equal(audit.sourceQuestionCount,5);
assert.equal(audit.sourceTotalShortResponseQuestions,13);
assert.equal(audit.allOriginalShortQuestionsCovered,'13/13 across V240–V242');
assert.deepEqual(audit.requiresCompulsoryExplanationQualification,['8.9','8.10','8.11','8.13']);
assert.deepEqual(audit.optionalTeachingNote,['8.12']);
assert.deepEqual(audit.requiresCognitiveOrDirectSloReview,['8.9','8.10','8.13']);
assert.deepEqual(audit.fourPartSourceCompleteness,['8.13']);
assert.deepEqual(audit.v235ExistingShortFlagsExpanded,[]);
assert.deepEqual(audit.newEstablishedPublisherStemErrors,[]);
assert.equal(audit.noSourceStemRewrites,true);
assert.equal(audit.printedSourceNumberingPreserved,true);
assert.equal(audit.humanScienceReview,'PENDING');
assert.equal(audit.humanSloCognitiveReview,'PENDING');
assert.equal(audit.studentAnswerEdition,'NOT-PUBLISHED');
for(const n of ['8.9','8.10','8.11','8.12','8.13'])assert.ok(notes.includes('**'+n+' —'),'Review table row missing '+n);
assert.match(notes,/13\/13 original Unit 8 short questions/i);
assert.match(notes,/four distinct \(i\)–\(iv\) parts/i);
assert.match(notes,/P-11-C-16/);assert.match(notes,/P-11-C-20/);
assert.match(notes,/2,250 pinned Units1–6 MCQs/);
const gate=rev.releaseGate;
assert.equal(gate.unit8ScoredQuestionCount,0);
assert.equal(gate.unit8TestBuilderBankEnabled,false);
assert.equal(gate.teacherAnswerEditionApproved,false);
assert.equal(gate.originalStemsCopied,false);
assert.equal(gate.sourcePageImagesCopied,false);
assert.equal(gate.ownerApproval,'HOLD');
const forbidden=['answerKey','correctAnswer','correctOption','verbatimQuestionStem',
 'fullModelAnswer','printedQuestionText','sourcePageImage','approvedMarkingScheme'];
const inspect=v=>{if(Array.isArray(v))return v.forEach(inspect);if(v&&typeof v==='object'){
 for(const key of forbidden)assert.ok(!Object.hasOwn(v,key),'Answer/printed-source field forbidden: '+key);
 Object.values(v).forEach(inspect);
}};inspect(rev);
const units=catalog.grades.find(g=>g.grade===11).units;
for(const n of [7,8]){
 const u=units.find(x=>x.unit===n);
 assert.equal(u.status,'planned');
 assert.equal(u.questionBankCount,0);
 assert.equal(u.assessmentStatus,'not-published');
 assert.deepEqual(u.resourceIds,[]);
}
assert.equal(units.find(x=>x.unit===7).additionalLearningPreviews.length,2);
assert.equal(units.find(x=>x.unit===8).additionalLearningPreviews.length,9);
assert.equal(units.find(x=>x.unit===7).simulationCount,2);
assert.equal(units.find(x=>x.unit===8).simulationCount,4);
assert.equal(catalog.resources.length,59);
const count=banks.grades.find(g=>g.grade===11).units.map(u=>u.liveMcqCount);
assert.deepEqual(count,[275,206,220,640,349,560]);
assert.equal(count.reduce((x,y)=>x+y,0),2250);
assert.equal(v224.releaseGate.studentScoredUnit8Mcqs,0);
console.log('V242 PASS: complete original Unit8 short-response 13/13 preliminary QC, four thermos parts, entropy boundaries and tentative FBISE SLOs; no keys, no bank release, pinned 2250 unchanged.');
