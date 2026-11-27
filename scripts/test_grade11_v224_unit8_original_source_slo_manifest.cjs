#!/usr/bin/env node
'use strict';
/* V224 Stage 1: verify only an ORIGINAL SOURCE INVENTORY, not scientific
 * approvals or scored source bank. The private 292-page NBF PDF is NOT
 * uploaded to GitHub, so this CI does not claim to re-open its page images. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const parse=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const m=parse('quality/unit08/unit08-v224-original-textbook-source-slo-inventory-no-keys.json');
const cat=parse('portal/learning-catalog.json');
const bank=parse('question-bank/manifest.json');
const u8=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===8);
const u7=cat.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
assert.equal(m.version,'V224');
assert.equal(m.unit,8);
assert.equal(m.grade,11);
assert.equal(m.title,'Heat and Thermodynamics');
assert.deepEqual(m.originalTextbook.printedPages,[127,153]);
assert.deepEqual(m.originalTextbook.pdfPages,[127,153]);
assert.equal(m.originalTextbook.pdfTotalPages,292);
assert.equal(m.originalTextbook.visuallyInspectedPdfPages.length,27);
assert.deepEqual(m.originalTextbook.visuallyInspectedPdfPages,
 Array.from({length:27},(_,i)=>i+127));
assert.match(m.originalTextbook.sha256,/^[0-9a-f]{64}$/);
assert.equal(m.originalTextbook.originalPdfInGitHub,false);
assert.equal(m.originalTextbook.originalChapterPageImagesInGitHub,false);
assert.equal(m.originalTextbook.summaryPrintedPage,150);
assert.deepEqual(m.originalTextbook.exercisePrintedPages,[150,153]);
assert.equal(m.officialFramework.domain,'C: Heat and Thermodynamics');
assert.deepEqual(m.officialFramework.pdfPages,[12,14]);
assert.equal(m.officialFramework.periodAllocation,30);
assert.equal(m.officialFramework.sourceSloRows,23);
assert.equal(m.officialFramework.summativeRows,23);
assert.equal(m.officialFramework.formativeRowsInThisDomain,0);
assert.equal(m.officialFramework.slos.length,23);
assert.deepEqual(m.officialFramework.slos.map(x=>x.codeIndex),
 Array.from({length:23},(_,i)=>i+1));
assert.equal(m.officialFramework.slos[0].printedCode,'P-12-C-01');
assert.equal(m.officialFramework.issues[0].exactPrintedCode,'P-12-C-01');
assert.equal(m.officialFramework.issues[0].likelyIntendedCode,'P-11-C-01');
assert.match(m.officialFramework.issues[0].resolution,/PENDING/);
assert.equal(m.officialFramework.slos.filter(x=>x.printedCode==='P-11-C-01').length,0,
 'Do not silently invent the corrected source code P-11-C-01');
for(let i=1;i<23;i++){
 const x=m.officialFramework.slos[i];
 assert.equal(x.printedCode,'P-11-C-'+String(i+1).padStart(2,'0'));
 assert.equal(x.assessment,'Summative');
 assert.ok(['Knowledge','Understanding','Application',
  'Knowledge + Understanding','Knowledge + Understanding + Application'].includes(x.cognitive));
 assert.ok(x.displayShortDescription.length>12);
 assert.ok(x.frameworkPdfPage>=12&&x.frameworkPdfPage<=14);
}
assert.equal(m.officialFramework.slos[0].assessment,'Summative');
assert.equal(m.officialFramework.slos[0].cognitive,'Knowledge');
assert.deepEqual(m.officialFramework.issues[1].codes,['P-11-C-02','P-11-C-12']);
assert.equal(m.sections.length,10);
assert.deepEqual(m.sections.map(x=>x.code),
 Array.from({length:10},(_,i)=>'8.'+(i+1)));
assert.deepEqual(m.sections.map(x=>x.title),[
 'Thermal Equilibrium','Kinetic Theory of Gases','The Gas Laws',
 'First Law of Thermodynamics','Heat Engine','Reversible and Irreversible Processes',
 'Second Law of Thermodynamics',"Carnot's Engine",'Refrigerator','Entropy'
]);
const slos=m.sections.flatMap(x=>x.slo);
assert.equal(slos.length,23);
assert.equal(new Set(slos).size,23);
assert.deepEqual([...slos].sort(),m.officialFramework.slos.map(x=>x.printedCode).sort(),
 'Each originally printed FBISE Domain C code must be covered in the topic index once');
for(const section of m.sections){
 assert.ok(section.pages[0]>=128&&section.pages[1]<=149);
 assert.ok(section.pages[0]<=section.pages[1]);
 for(const t of section.subtopics){
  assert.ok(t.code.startsWith(section.code+'.'));
  assert.ok(t.pages[0]>=section.pages[0]&&t.pages[1]<=section.pages[1]);
 }
}
assert.equal(m.figures.length,20);
assert.deepEqual(m.figures.map(x=>x.figure),
 Array.from({length:20},(_,i)=>'8.'+(i+1)));
assert.ok(m.figures.every(x=>x.printedPage>=128&&x.printedPage<=149&&x.sourceImageNotPublished));
assert.equal(m.examples.length,6);
assert.equal(m.assignments.length,6);
assert.deepEqual(m.examples.map(x=>x.id),
 Array.from({length:6},(_,i)=>'Example 8.'+(i+1)));
assert.deepEqual(m.assignments.map(x=>x.id),
 Array.from({length:6},(_,i)=>'Assignment 8.'+(i+1)));
assert.deepEqual(m.examples.map(x=>x.printedPages),[[130,131],[133,133],[139,140],[145,145],[146,147],[149,149]]);
assert.deepEqual(m.assignments.map(x=>x.printedPage),[131,133,140,145,147,149]);
assert.ok(m.examples.every(x=>x.scienceApproval==='PENDING'));
assert.ok(m.assignments.every(x=>x.scienceApproval==='PENDING'));
assert.deepEqual([m.exercise.mcqs.count,m.exercise.shortResponses.count,
 m.exercise.comprehensiveResponses.count,m.exercise.numericalProblems.count],[18,13,11,9]);
assert.equal(Object.values(m.exercise).reduce((n,x)=>n+x.count,0),51);
assert.deepEqual(m.exercise.mcqs.printedPages,[150,152]);
assert.equal(m.exercise.numericalProblems.printedPage,153);
assert.equal(m.exercise.mcqs.sourceItemNumbers,'1-18');
assert.equal(m.exercise.numericalProblems.sourceItemNumbers,'8.1-8.9');
assert.equal(m.releaseGate.questionStemOCROrVerbatimCopyIncluded,false);
assert.equal(m.releaseGate.independentAnswerQc,'PENDING');
assert.equal(m.releaseGate.independentTeacherScienceApproval,'PENDING');
assert.equal(m.releaseGate.independentTeacherCognitiveApproval,'PENDING');
assert.equal(m.releaseGate.ownerScoredReleaseApproval,'HOLD');
assert.equal(m.releaseGate.studentScoredUnit8Mcqs,0);
assert.equal(m.releaseGate.originalExercisesPublished,0);
assert.equal(m.releaseGate.portalUnit8Status,'planned');
assert.equal(m.releaseGate.existingPublicSimulations,4);
assert.equal(m.releaseGate.originalLessonTextPublished,0);
assert.equal(cat.resources.length,59);
assert.equal(u8.status,'planned');
assert.equal(u8.assessmentStatus,'not-published');
assert.equal(u8.questionBankCount,0);
assert.equal(u8.simulationCount,4);
assert.equal(u8.originalPdfCount,0);
assert.equal(u8.resourceIds.length,0);
assert.equal(u7.questionBankCount,0);
assert.equal(u7.assessmentStatus,'not-published');
assert.deepEqual(bank.grades.find(x=>x.grade===11).units.map(x=>x.liveMcqCount),
 [275,206,220,640,349,560]);
console.log('V224 PASS: real visual 27-page Unit8 source manifest, 23 framework codes including exact C01 misprint, 10 topics, 6 examples, 6 assignments, 20 figures, 51 end exercises and zero scored release.');
