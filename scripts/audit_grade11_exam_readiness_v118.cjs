#!/usr/bin/env node
'use strict';
/* V118: read-only Grade XI pre-exam source-and-route inventory.
 * No live Firebase, privileged endpoints, student data, protected source PDFs,
 * course release, question content or auth state are touched.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'qa-artifacts/grade11-v118-exam-readiness');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const load=p=>JSON.parse(read(p));
const rootUrl='https://audit.invalid/physics-vector-explorer/';
let gates=0;
function check(message){gates++;console.log('V118 PASS:',message)}
function relUrl(href,from){
 const url=new URL(href,new URL(from,rootUrl));
 if(url.protocol!=='https:'&&url.protocol!=='http:')return {kind:'unsupported',url:url.href};
 if(url.origin!==new URL(rootUrl).origin)return {kind:'external',url:url.href};
 const base=new URL(rootUrl).pathname;
 if(!url.pathname.startsWith(base))return {kind:'out-of-repo',url:url.href};
 let file=decodeURIComponent(url.pathname.slice(base.length));
 if(!file||file.endsWith('/'))file+='index.html';
 // No filesystem traversal or URLs disguised as local route links.
 const abs=path.resolve(root,file);
 if(!abs.startsWith(root+path.sep))return {kind:'out-of-repo',url:url.href};
 return {kind:'local',file:file.replaceAll('\\','/'),url:url.href,exists:fs.existsSync(abs)&&fs.statSync(abs).isFile()};
}
function anchorLinks(html,from){
 const entries=[],rx=/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gims;
 let m;
 while((m=rx.exec(html))!==null)entries.push({href:m[2],...relUrl(m[2],from)});
 return entries;
}
function recordsSourceSafety(){
 const catalog=load('portal/learning-catalog.json');
 const grade=catalog.grades.find(g=>g.grade===11);
 assert.ok(grade&&Array.isArray(grade.units)&&grade.units.length===14);
 const active=grade.units.filter(u=>u.unit<=6).sort((a,b)=>a.unit-b.unit);
 assert.deepEqual(active.map(u=>u.unit),[1,2,3,4,5,6]);
 assert.deepEqual(active.map(u=>u.unit===6?u.partialTestBuilderMcqCount:u.questionBankCount),[275,206,220,640,349,560]);
 assert.ok(active.slice(0,5).every(u=>u.status==='available'));
 assert.equal(active[5].status,'planned');
 assert.equal(active[5].practicePreviewStatus,'public-provisional');
 assert.equal(active[5].assessmentStatus,'not-published');
 assert.equal(active[5].simulationCount,5);
 assert.equal(active.reduce((a,u)=>a+Number(u.unit===6?u.partialTestBuilderMcqCount:u.questionBankCount),0),2250);
 assert.ok(grade.units.slice(6).every(u=>u.status==='planned'&&u.assessmentStatus==='not-published'));
 const signoff=load('quality/grade11-unit06-v94d-signoff-matrix.json');
 assert.equal(signoff.releaseApproved,false);
 const rows=read('quality/grade11-unit06-v95c1-560-item-review-queue.csv').trimEnd().split(/\r?\n/);
 assert.equal(rows.length,561);
 const header=rows[0].split(',');
 for(const row of rows.slice(1)){
  const cols=row.split(',');
  for(const col of ['scientific_key_review','original_print_fidelity_review','individual_fbise_slo_review','individual_cognitive_review','teacher_approval'])
   assert.equal(cols[header.indexOf(col)],'PENDING');
 }
 const overlayVersions=[['111','unit-06-topic64-v111-approved-practice-overlay.json',4],
  ['114','unit-06-topic65-v114-approved-practice-overlay.json',3],
  ['116','unit-06-topic65-v116-approved-stagnation-practice-overlay.json',2]];
 for(const [v,f,n] of overlayVersions){const x=load('question-bank/grade-11/'+f);assert.equal(x.version,'V'+v);assert.equal(x.overlayQuestionCount,n)}
 check('six authentic active unit resource states, 2,250 provisional MCQs, 560 Unit6 PENDING academic reviews, unchanged V111/V114/V116 overlays');
 return {catalog,grade,active,signoff};
}
function pageNavigationAudit(catalog,active){
 const quick=read('portal/exam-quick-access.html');
 const links=anchorLinks(quick,'portal/exam-quick-access.html');
 const missing=links.filter(x=>x.kind==='local'&&!x.exists);
 const outOfSite=links.filter(x=>x.kind==='out-of-repo'||x.kind==='unsupported');
 assert.equal(missing.length,0,'Exam Quick Access has nonexistent local hrefs: '+JSON.stringify(missing));
 assert.equal(outOfSite.length,0,'Exam Quick Access links outside portal unexpectedly: '+JSON.stringify(outOfSite));
 assert.ok(links.length>=41,'Exam Quick Access lost its verified resource links');
 assert.ok(quick.includes('id="unit-filter"')&&quick.includes('id="kind-filter"'));
 assert.ok(quick.includes('data-kind="answers"')&&quick.includes('data-kind="mcq"')&&
  quick.includes('data-kind="numericals"')&&quick.includes('data-kind="original"')&&
  quick.includes('data-kind="labs"')&&quick.includes('data-kind="study"'));
 const unitSections=[];
 for(const unit of active){
  const open='<details class="unit" data-unit="'+unit.unit+'"';
  const first=quick.indexOf(open),last=quick.indexOf('</details>',first);
  assert.ok(first>=0&&last>first,'Missing accessible exam-revision unit panel '+unit.unit);
  const body=quick.slice(first,last);
  const unitLinks=anchorLinks(body,'portal/exam-quick-access.html');
  assert.ok(unitLinks.length>=4,'Insufficient unit revision links '+unit.unit);
  assert.ok(body.includes('unit='+unit.unit),'Unit-specific MCQ/simulation/resource filter missing '+unit.unit);
  assert.ok(body.includes('class="empty" hidden'),'No explicit missing-resource message for Unit '+unit.unit);
  unitSections.push({unit:unit.unit,links:unitLinks.length,
   kinds:['study','numericals','answers','mcq','original','labs'].filter(k=>body.includes('data-kind="'+k+'"')),
   notices:body.includes('No separately verified page for that resource type'),
   status:unit.status,mode:unit.practicePreviewStatus||'published-resources'});
 }
 assert.ok(quick.includes('Full Unit 6 course')||quick.includes('Seven-topic provisional preview'));
 assert.ok(!/<details class="unit" data-unit="7"/.test(quick),'Not-yet-published unit was labelled available');
 check('all Grade XI six-unit Exam Quick Access cards/filters, '+links.length+' local revision links and honest missing-resource notices');
 const nav=read('shared/navigation.js');
 assert.ok(nav.includes("link('portal/exam-quick-access.html','Exam Quick Access'"));
 assert.ok(nav.includes("link('portal/simulations.html','Simulations'"));
 assert.ok(nav.includes("link('portal/#my-progress','My Progress'"));
 assert.ok(nav.includes("link('build-your-physics-test.html','Build a Test'"));
 assert.ok(nav.includes("unit.practicePreviewStatus==='public-provisional'"));
 assert.ok(nav.includes("u.unit<=14"));
 const hub=read('portal/learning-hub.js');
 assert.ok(hub.includes("selectedUnit='all'"));
 assert.ok(hub.includes('hub-unit-filter')&&hub.includes('hub-resource-search')&&hub.includes('hub-resource-filter'));
 assert.ok(hub.includes('Choose a unit above to see its resources'));
 assert.ok(read('shared/simulation-return-v96c.js').includes('portal/'));
 check('global six-unit drawer, focused Learning Hub selectors, dashboard/Test Builder/simulation return routes preserved');
 return {links,unitSections,missing,outOfSite};
}
function catalogAndPublicationAudit(catalog,active){
 const idMap=new Map(catalog.resources.map(r=>[r.id,r]));
 assert.equal(idMap.size,catalog.resources.length,'Duplicate learning resource IDs');
 const records=[],broken=[],externals=[],archival=[],unassigned=[];
 for(const u of active){
  const items=[...(u.resourceIds||[]).map(id=>idMap.get(id)),
   ...(Array.isArray(u.previewResources)?u.previewResources:[])];
  for(const [i,r] of items.entries()){
   if(!r){unassigned.push({unit:u.unit,i});continue}
   const link=relUrl(r.href,'portal/learning-catalog.json');
   records.push({unit:u.unit,id:r.id||'(unit-preview)',title:r.title,category:r.category,href:r.href,access:r.access,kind:link.kind});
   if(link.kind==='local'&&!link.exists)broken.push({unit:u.unit,id:r.id,href:r.href,missing:link.file});
   if(link.kind==='external')externals.push({unit:u.unit,id:r.id,url:link.url});
   if(/sites\.google\.com/i.test(r.href||''))archival.push({unit:u.unit,id:r.id,href:r.href});
  }
 }
 assert.equal(unassigned.length,0,'Unit catalog has invalid resourceIds');
 assert.equal(archival.length,0,'Legacy Google Sites direct student catalog link reappeared');
 const archived=load('portal/legacy-hssc-resources-v73.json');
 assert.equal(archived.videoPages.length,15);
 assert.equal(archived.generalVideos.length,2);
 assert.equal(archived.pdfHandouts.length,17);
 const index=read('portal/legacy-hssc-resources.html');
 assert.ok(!/<a\b[^>]*\bhref\s*=\s*["']https?:\/\/sites\.google\.com/i.test(index));
 const direct=load('portal/hssc-concept-videos-v74.json');
 assert.equal(direct.videos.length,27);
 assert.equal(direct.uniqueVideoCount,26);
 check('unit resource IDs resolve, obsolete Google Sites links retired from student catalog, historical video and PDF provenance preserved');
 return {records,broken,externals,archival,archived:{videoPages:15,generalVideoPages:2,pdfHandouts:17,directYouTubeEntries:27,uniqueYouTubeIds:26}};
}
function publicContentExposureAudit(){
 const candidate=[
 ['portal/unit-05-descriptive-teacher.html','worked solution + teacher-labelled rubric','P1'],
 ['portal/unit-05-mcq-key.html','public provisional answer key','P1'],
 ['portal/unit-05-mcq-set-b-key.html','public second-set answer key','P1'],
 ['portal/unit-04-discussion-slides.html','projector teacher discussion material','P2'],
 ['portal/unit-05-projector-discussion.html','projector teacher discussion material','P2'],
 ['portal/unit-04-slo-audit.html','teacher-facing academic scope audit','P2'],
 ['portal/unit-05-fbise-audit.html','teacher-facing academic scope audit','P2'],
 ['portal/unit-06-figure-verification-v91.html','source-verification review UI','P2']
 ];
 const visible=candidate.map(([route,reason,priority])=>({route,reason,priority,exists:fs.existsSync(path.join(root,route))}));
 const quick=read('portal/exam-quick-access.html');
 assert.ok(visible.every(x=>x.exists),'Previously enumerated public teacher-like routes changed; inspect new exposure classification');
 const directlyLinked=visible.filter(x=>quick.includes('href="./'+path.basename(x.route)+'"')).map(x=>x.route);
 assert.ok(directlyLinked.includes('portal/unit-05-descriptive-teacher.html'),'Previously public Unit5 worked-solution link changed, reclassify before publishing a new claim');
 const signIn=read('portal/index.html');
 assert.ok(signIn.includes('Public simulations and practice files remain separately accessible'));
 assert.ok(read('portal/app.js').includes('Teacher/class/payments management remains DISABLED'));
 check('teacher-labelled publicly retrievable paths enumerated for owner decision; no false login-protection or teacher-account claim');
 return {candidatePublicRoutes:visible,linkedFromExamQuickAccess:directlyLinked,reviewRequired:true};
}
function ongoingSafetyAudit(){
 const test=read('practice-engine/index.html');
 assert.ok(test.includes('Copy issue report')&&test.includes('no report has been sent automatically'));
 assert.ok(!test.includes('Send issue report'));
 const sync=read('portal/attempt-sync.js');
 assert.ok(sync.includes('![1,2].includes(payload.unit)'));
 assert.ok(sync.includes('Cloud saving for combined-unit practice is not active yet'));
 const hub=read('portal/learning-hub.js');
 assert.ok(hub.includes('combined-unit results can be printed but are not saved'));
 const quick=read('portal/exam-quick-access.html');
 assert.ok(quick.includes('Sign in to save only eligible Unit 1 or Unit 2'));
 assert.ok(quick.includes('not a complete released course'));
 assert.ok(quick.includes('not an official examination syllabus'));
 assert.ok(read('shared/navigation.js').includes('sitewide-science-print-v112'));
 const watermark=read('shared/sitewide-science-print-v112.js');
 assert.ok(watermark.includes('watermark')||watermark.includes('Watermark'));
 assert.ok(read('portal/recaptcha-enterprise-v100m.mjs').includes('MONITORING'));
 check('issue reporting stays Copy only, saved attempts stay Units 1–2, full Unit6/exam locks and V112 watermark remain active');
 return {issueReporting:'student-copy-only; no live inbox',cloudSaving:'only individual Unit 1/2 self-practice',teacherAssignments:'not live',siteAccess:'public resources remain public',appCheck:'monitoring-only'};
}
function liveSurfaceHygiene(){
 const targets=['index.html','student-guide.html','build-your-physics-test.html',
  'portal/index.html','portal/simulations.html','portal/exam-quick-access.html',
  'portal/legacy-hssc-resources.html','portal/unit-01.html'];
 const sites=[];
 for(const name of targets){
  const h=read(name),direct=anchorLinks(h,name);
  for(const item of direct){if(/sites\.google\.com/i.test(item.href))sites.push({file:name,href:item.href})}
 }
 assert.equal(sites.length,0,'Found retired Google Sites navigation on core student pages');
 // This is a source audit. GitHub Pages files and owner browser checks are separate.
 check('no old Google Sites hrefs in eight key student entrypoints; archived URLs remain untouched in JSON only');
 return {examQuickLinksChecked:true,coreEntryPointsChecked:targets,legacySiteNavigationHits:sites};
}
function main(){
 const {catalog,grade,active}=recordsSourceSafety();
 const navigation=pageNavigationAudit(catalog,active);
 const resources=catalogAndPublicationAudit(catalog,active);
 const exposure=publicContentExposureAudit();
 const backend=ongoingSafetyAudit(),hygiene=liveSurfaceHygiene();
 const priorities=[
  {priority:'P1',topic:'Public teacher-labelled worked answers and MCQ answer keys',
   evidence:['portal/unit-05-descriptive-teacher.html','portal/unit-05-mcq-key.html','portal/unit-05-mcq-set-b-key.html'],
   next:'Obtain owner audience/assessment decision; do not hide with CSS or claim GitHub Pages has private URL access.'},
  {priority:'P1',topic:'Unit6 exact textbook exercises not yet verified/released',
   evidence:['portal/exam-quick-access.html','portal/learning-catalog.json'],
   next:'Continue source/page-numbered textbook example and end-of-unit inventory; retain truthful provisional label.'},
  {priority:'P2',topic:'Unit1 simulation shortcut with zero cataloged unit models',
   evidence:['portal/exam-quick-access.html','portal/learning-catalog.json','portal/simulation-catalog.json'],
   next:'Verify actual Unit1 empty-state wording on mobile; do not invent models.'},
  {priority:'P2',topic:'Internal audit/release language on public pages',
   evidence:['portal/unit-04-slo-audit.html','portal/unit-05-fbise-audit.html','portal/unit-06-figure-verification-v91.html','portal/index.html'],
   next:'Review intended audience and student wording; separate teacher-only material using backend if necessary.'},
  {priority:'P2',topic:'Combined-unit result saving and student issue reporting not live',
   evidence:['portal/attempt-sync.js','practice-engine/index.html'],
   next:'Keep Copy-only / printable controls; design and security-review authenticated server workflows later.'},
  {priority:'P2',topic:'Handout/video and unit-specific exercise mapping incomplete',
   evidence:['portal/legacy-hssc-resources-v73.json','portal/hssc-concept-videos-v74.json'],
   next:'Verify each exact textbook/PDF/video URL and SLO mapping separately; preserve historical archives.'}
 ];
 const report={
  version:'V118',scope:'read-only-source-and-local-route-audit',generatedAt:new Date().toISOString(),
  sourceOfTruth:'GitHub repository checked out at the workflow commit, not live Firebase/Google Sites and not a public CDN fetch',
  studentPagesChanged:false,teacherClassificationCertified:false,boardExamReleaseChanged:false,
  revisionUnits:navigation.unitSections,
  unitCounts:active.map(u=>({unit:u.unit,mcqs:u.unit===6?u.partialTestBuilderMcqCount:u.questionBankCount,
   simulations:u.simulationCount||0,sourceCatalogResources:u.resourceIds?.length||0,
   previewResources:u.previewResources?.length||0,courseStatus:u.status,assessmentStatus:u.assessmentStatus})),
  examQuick:{localAndExternalHrefCount:navigation.links.length,missingLinks:navigation.missing,
   unsafeLinks:navigation.outOfSite,unitCount:6,missingResourceMessages:6},
  catalog:{resolvedUnitResources:resources.records.length,brokenLocalHref:resources.broken,
   externalReferencesNotNetworkChecked:resources.externals.length,historicalArchive:resources.archived},
  exposure,backend,hygiene,priorities,
  confidenceLimitations:[
   'GitHub source existence is not a live DNS/CDN/permission or browser-network test.',
   'A public GitHub Pages link cannot be made private by hiding its menu entry.',
   'Historical Google Sites, YouTube and Google Drive destination availability not fetched.',
   'No original NBF PDF, course-specific assessment framework or school syllabus inspected in V118.',
   'Student-facing exact end-of-unit source coverage, question grading and official individual SLO/cognitive certifications remain separate.',
   'No live Firebase security-rule, App Check monitoring, real report inbox or student account verification.'
  ],
  gatesPassed:gates
 };
 fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'readiness-audit.json'),JSON.stringify(report,null,2)+'\n');
 console.log('V118 AUDIT SUMMARY',JSON.stringify({gates,examQuickLinks:report.examQuick.localAndExternalHrefCount,
  catalogBrokenLocalHref:resources.broken.length,archivedSiteNavigation:hygiene.legacySiteNavigationHits.length,
  reviewOnlyExposure:exposure.candidatePublicRoutes.length,scope:'No runtime files modified'}));
 if(resources.broken.length)console.warn('V118 REVIEW: catalog local routes unresolved:',JSON.stringify(resources.broken));
}
try{main()}catch(e){console.error('V118 FAILED:',e.stack||e);process.exitCode=1}
