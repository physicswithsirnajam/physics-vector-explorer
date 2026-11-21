#!/usr/bin/env node
'use strict';
/* V94-D: release-blocked academic signoff inventory.
 * This checks that the 7 merged topic reviews and public catalogue stay
 * consistent. It does not certify scientific content or publish Unit6 lessons.
 */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const matrix=JSON.parse(read('quality/grade11-unit06-v94d-signoff-matrix.json'));
const report=read('quality/grade11-unit06-v94d-signoff-and-release-gates.md');
const manifest=JSON.parse(read('question-bank/manifest.json'));
const catalogue=JSON.parse(read('portal/learning-catalog.json'));
const grade=manifest.grades.find(g=>g.grade===11);
const unit=grade.units.find(u=>u.unit===6);
const unitCatalogue=catalogue.grades.find(g=>g.grade===11).units.find(u=>u.unit===6);
assert.ok(matrix && Array.isArray(matrix.topics));
assert.equal(matrix.topics.length,7);
assert.equal(matrix.releaseApproved,false);
assert.equal(matrix.studentCourseStatus,'planned');
assert.equal(matrix.teacherSignoff,'pending');
assert.equal(matrix.framework.itemLevelSloVerified,false);
assert.equal(matrix.framework.cognitiveLevelVerified,false);
assert.deepEqual(matrix.framework.officialFormative,['P-11-B-39']);
assert.ok(!matrix.framework.officialSummative.includes('P-11-B-39'));
assert.ok(matrix.framework.officialSummative.includes('P-11-B-43'));
assert.equal(matrix.gates.studentLessonCompleteness,'not-started');
assert.equal(matrix.gates.browserMobileProjectorPrint,'not-started');
let issueCount=0,partB=0,partC=0,partD=0;
const perTopic=[8,9,9,9,9,10,11];
matrix.topics.forEach((topic,i)=>{
  const number=i+1;
  assert.equal(topic.id,'6.'+number);
  assert.equal(topic.academicAuditMerged,true);
  assert.equal(topic.topicTeacherApproved,false);
  assert.equal(topic.studentLessonReady,false);
  assert.equal(topic.teacherIssueIDs.length,perTopic[i]);
  const source=read(topic.sourceAudit);
  assert.ok(source.length>2000,'Expected complete source audit for '+topic.id);
  const unique=new Set(topic.teacherIssueIDs);
  assert.equal(unique.size,topic.teacherIssueIDs.length,'Duplicate issue ID in '+topic.id);
  for(const id of topic.teacherIssueIDs)assert.ok(source.includes(id),'Missing issue '+id+' from source audit');
  for(const code of topic.officialSummativeTopicSloCodes)
    assert.ok(matrix.framework.officialSummative.includes(code),'Unexpected formative/unknown SLO '+code);
  issueCount+=topic.teacherIssueIDs.length;
  partB+=topic.partBCount;
  partC+=topic.partCSectionCount;
  partD+=topic.partDCount;
});
assert.equal(issueCount,65);
assert.equal(partB,372);
assert.equal(partC,92);
assert.equal(partD,216);
assert.equal(unit.liveMcqCount,560);
assert.equal(unit.sourceTopicMcqCount,560);
assert.equal(unit.standaloneSituationQuestionCount,136);
assert.equal(unit.independentSharedStimulusGroupCount,0);
assert.equal(unit.sourceFigureHeldCount,0);
assert.equal(unit.perQuestionSloVerified,false);
assert.equal(unit.cognitiveLevelVerified,false);
assert.equal(unit.exactFbiseModeReady,false);
assert.equal(grade.units.reduce((sum,u)=>sum+(u.liveMcqCount||0),0),2250);
assert.equal(unitCatalogue.status,'planned');
assert.equal(unitCatalogue.assessmentStatus,'not-published');
assert.equal(unitCatalogue.partialTestBuilderMcqCount,560);
assert.equal(unitCatalogue.simulationCount,5);
assert.equal(unitCatalogue.sourceFigureHeldCount,0);
assert.equal(matrix.currentPublicBank.unit6,unit.liveMcqCount);
assert.equal(matrix.currentPublicBank.grade11,2250);
assert.equal(matrix.currentPublicBank.mappedSimulations,unitCatalogue.simulationCount);
assert.equal(matrix.currentPublicBank.authenticSharedStimulusGroups,0);
assert.equal(matrix.exerciseAudit.printedNumerical69UnitErrorConfirmed,true);
assert.equal(matrix.exerciseAudit.studentCorrectionPublished,false);
assert.ok(report.includes('NBF Figure6.17'),'Must state copyright/source restriction');
assert.ok(report.includes('Numerical6.9'),'Must retain original textbook unit correction gate');
assert.ok(report.includes('Do not start Unit 7'),'Unit7 is gated by Unit6 integration');
console.log('PASS V94-D: 7 topic audits, 65 issue IDs, 372 Part B, 92 Part C and 216 Part D inventory entries verified');
console.log('No course release authorized: V95 lessons and approvals pending; 560 Unit6 / 2250 GradeXI / 5 mapped sims / 136 independent situations unchanged');
