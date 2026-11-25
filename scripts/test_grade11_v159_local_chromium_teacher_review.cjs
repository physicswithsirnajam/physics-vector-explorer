#!/usr/bin/env node
'use strict';
/**
 * V159 REAL HEADLESS CHROMIUM UI / KEYBOARD / MOBILE / ACCESSIBILITY TEST.
 * Uses only synthetic Auth Emulator accounts and actual local Firestore.
 * Browser talks to the V158/V159 local-only server; not the live portal.
 *
 * The genuine Firebase browser SDK is fetched from its pinned gstatic URL.
 * CDN availability is checked, not mocked. No real user credentials exist.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const {initializeApp:adminInit,deleteApp:adminDelete}=require('firebase-admin/app');
const {getAuth:adminAuthFor}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const {PROJECT}=require('../server/local-classroom-provisioner-v143.cjs');
const {startLocalTopic71BrowserReview}=require('../server/local-topic71-browser-review-v158.cjs');
const {COLLECTION,AUDIT}=require('../server/local-topic71-teacher-review-pilot-v155.cjs');
const ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'qa-artifacts/grade11-v159-local-chromium-teacher-review');
const PASSWORD='V159_SYNTHETIC_LOCAL_EMULATOR_ONLY_2026!';
const email=u=>u+'@example.test';
const paths=[
 'portal/learning-catalog.json','question-bank/manifest.json',
 'quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json',
 'quality/unit07/topic71-v149-80-source-aligned-question-only-candidate.tsv',
 'quality/grade11-unit06-v94d-signoff-matrix.json'
];
const original=Object.fromEntries(paths.map(p=>[p,fs.readFileSync(path.join(ROOT,p),'utf8')]));
const stats={nativeChromiumRuns:0,anonymousExposures:0,unauthorizedSigninsDenied:0,
 teacherCardsChecked:0,keyboardSelections:0,successfulBrowserRecommendations:0,
 browserAccessibilitySeriousCritical:0,mobileViewports:0,focusTransfers:0,
 actualKeyedContentExposures:0,revokedTeacherWritesDenied:0,
 scorerReleaseCount:0,academicApprovalCount:0};

function reportPass(label){console.log('V159 PASS: '+label);}
function cleanError(error){
 return String(error?.message||error).slice(0,200).replace(/[\r\n]+/g,' ');
}
async function waitReady(page){
 await page.waitForFunction(
  ()=>document.documentElement.dataset.localReviewReady==='true',
  null,{timeout:45000}
 );
}
async function login(page,uid){
 await page.locator('#email').fill(email(uid));
 await page.locator('#password').fill(PASSWORD);
 await page.locator('#login-button').click();
}
async function noLeak(body){
 for(const marker of ['correctOptionId','answerKey','originalExplanationText',
  'studentUid','studentEmail','sourceAnswerKeyCertified',
  'PRIVATE_TEST_NAME','firebaseToken']){
  assert.ok(!body.includes(marker),'Protected answer or identity field exposed: '+marker);
 }
}
async function accessibility(page,name){
 const result=await page.evaluate(async()=>{
  if(typeof window.axe==='undefined')return {missing:true};
  const output=await window.axe.run(document,{
   runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}
  });
  return {violations:output.violations.map(x=>({
   id:x.id,impact:x.impact,nodes:x.nodes.length
  }))};
 });
 assert.equal(result.missing,undefined,'Axe did not load into real Chromium page');
 const major=result.violations.filter(x=>x.impact==='critical'||x.impact==='serious');
 stats.browserAccessibilitySeriousCritical+=major.length;
 assert.equal(major.length,0,
  'Accessibility serious/critical in '+name+': '+JSON.stringify(major));
 return result;
}
async function main(){
 assert.equal(process.env.GCLOUD_PROJECT,PROJECT);
 assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,'127.0.0.1:9099');
 assert.equal(process.env.FIRESTORE_EMULATOR_HOST,'127.0.0.1:8089');
 assert.equal(process.env.PSN_LOCAL_TOPIC71_BROWSER_REVIEW,'enabled-local-test-only');
 assert.equal(Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS),false);
 const catalog=JSON.parse(original['portal/learning-catalog.json']);
 const unit7=catalog.grades.find(g=>g.grade===11).units.find(u=>u.unit===7);
 assert.equal(unit7.questionBankCount,0);
 assert.equal(unit7.status,'planned');
 const academic=JSON.parse(original['quality/unit07/topic71-v154-80-source-bound-teacher-decision-queue.json']);
 assert.equal(academic.teacherScienceSignoffs,0);
 assert.equal(academic.unit7ScoredReleaseCount,0);
 fs.mkdirSync(OUT,{recursive:true});
 const admin=adminInit({projectId:PROJECT},'v159-synthetic-admin');
 let browser=null,server=null;
 try{
  const auth=adminAuthFor(admin),db=getFirestore(admin);
  for(const [uid,verified,claims] of [
    ['teacherOne',true,{teacher:true}],
    ['teacherOther',true,{teacher:true}],
    ['studentOne',true,{}]
  ]){
   await auth.createUser({uid,email:email(uid),password:PASSWORD,emailVerified:verified});
   if(Object.keys(claims).length)await auth.setCustomUserClaims(uid,claims);
  }
  for(const uid of ['teacherOne','teacherOther'])
   await db.doc('teacherDirectory/'+uid).set({
    schemaVersion:1,teacherUid:uid,status:'active'
   });
  let on=true;
  server=await startLocalTopic71BrowserReview({
   firestore:db,adminAuth:auth,allowedReviewerUids:['teacherOne'],
   isPilotEnabled:()=>on,now:()=>Date.parse('2026-11-25T04:30:00.000Z')
  });
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  stats.nativeChromiumRuns++;
  const context=await browser.newContext({
   viewport:{width:1280,height:900},deviceScaleFactor:1,
   permissions:[],serviceWorkers:'block'
  });
  // Insert axe before the application starts, without disabling CSP.
  await context.addInitScript({path:require.resolve('axe-core/axe.min.js')});
  const page=await context.newPage();
  const errors=[],cdnFailures=[],browserPosts=[];
  page.on('pageerror',err=>errors.push(cleanError(err)));
  page.on('requestfailed',req=>{
   if(req.url().startsWith('https://www.gstatic.com/'))
    cdnFailures.push(req.url().split('/').slice(-1)[0]+':'+
      (req.failure()?.errorText||'request-failed').slice(0,100));
  });
  page.on('request',req=>{
   if(req.method()==='POST'&&req.url().endsWith('/recommendation'))
    browserPosts.push(req.url());
  });
  await page.goto(server.url,{waitUntil:'domcontentloaded',timeout:45000});
  await waitReady(page); // This requires successful loading of actual Firebase browser modules.
  assert.equal(await page.locator('#review-panel').isHidden(),true);
  assert.equal(await page.locator('#questions article').count(),0);
  assert.ok(await page.locator('#signin').isVisible());
  await accessibility(page,'anonymous');
  reportPass('anonymous shell has no question stems or answer keys');
  // A real browser executes the sign-in, obtains a synthetic local Firebase
  // session, and the trusted server denies students and other teachers.
  await login(page,'studentOne');
  await page.locator('#auth-status').getByText(
   'Access denied or local emulator unavailable.').waitFor({timeout:25000});
  assert.equal(await page.locator('#questions article').count(),0);
  assert.equal((await db.collection(COLLECTION).get()).size,0);
  stats.unauthorizedSigninsDenied++;
  await login(page,'teacherOther');
  await page.locator('#auth-status').getByText(
   'Access denied or local emulator unavailable.').waitFor({timeout:25000});
  assert.equal(await page.locator('#questions article').count(),0);
  stats.unauthorizedSigninsDenied++;
  reportPass('student and unrelated teacher denied by backend despite valid browser Auth sign-in');

  await login(page,'teacherOne');
  await page.locator('#questions article').nth(3).waitFor({timeout:30000});
  assert.equal(await page.locator('#questions article').count(),4);
  assert.equal(await page.locator('#review-panel').isVisible(),true);
  assert.equal(await page.locator('#signin').isHidden(),true);
  assert.equal(await page.locator('#logout-button').isVisible(),true);
  assert.equal(await page.evaluate(()=>
    document.activeElement?.id==='review-heading'),true,
    'After login, keyboard focus should move to review heading');
  stats.focusTransfers++;
  for(const n of [10,15,62,76]){
   const card=page.locator('#questions article[data-question-id="XI-U07-T071-Q'+
    String(n).padStart(3,'0')+'"]');
   assert.equal(await card.count(),1);
   assert.equal(await card.locator('li').count(),4);
   assert.ok((await card.innerText()).includes('PENDING'));
   assert.ok((await card.innerText()).includes('HOLD'));
   stats.teacherCardsChecked++;
  }
  const rendered=await page.locator('#review-panel').innerText();
  await noLeak(rendered);
  for(const n of [10,76]){
   const c=page.locator('[data-question-id="XI-U07-T071-Q'+
    String(n).padStart(3,'0')+'"]');
   assert.ok((await c.innerText()).includes('Original source explanation requires separate'));
  }
  await accessibility(page,'authorized teacher desktop');
  reportPass('four verified source questions, labelled choices, PENDING and HOLD on desktop');

  const card10=page.locator('[data-question-id="XI-U07-T071-Q010"]');
  const radio10=card10.locator('input[type="radio"]').first();
  const submit10=card10.getByRole('button',{name:'Submit advisory recommendation for Question 10'});
  assert.equal(await submit10.isDisabled(),true);
  await radio10.focus();await page.keyboard.press('Space');
  assert.equal(await radio10.isChecked(),true);
  assert.equal(await submit10.isEnabled(),true);
  stats.keyboardSelections++;
  await submit10.click();
  await page.locator('#action-status').getByText(
   /Q10: recommendation recorded/).waitFor({timeout:20000});
  await card10.getByText(/Your recorded advisory recommendation:/).waitFor({timeout:20000});
  assert.equal(await card10.locator('button').count(),0);
  stats.successfulBrowserRecommendations++;
  const card76=page.locator('[data-question-id="XI-U07-T071-Q076"]');
  await card76.getByText('Needs further revision').click();
  const button76=card76.getByRole('button',{name:'Submit advisory recommendation for Question 76'});
  assert.equal(await button76.isEnabled(),true);
  await button76.click();
  await card76.getByText(/Your recorded advisory recommendation:/).waitFor({timeout:20000});
  stats.successfulBrowserRecommendations++;
  assert.equal(browserPosts.length,2,'Actual Chromium must issue exactly two POST requests');
  const writes=await db.collection(COLLECTION).get();
  const audits=await db.collection(AUDIT).get();
  assert.equal(writes.size,2);assert.equal(audits.size,2);
  for(const doc of writes.docs){
   const r=doc.data();
   assert.equal(r.status,'advisory-only');
   assert.equal(r.teacherScientificSignoff,'PENDING');
   assert.equal(r.teacherCognitiveSignoff,'PENDING');
   assert.equal(r.sourceAnswerKeyCertified,false);
   assert.equal(r.scoredReleaseApproved,false);
  }
  reportPass('real keyboard/radio and button clicks wrote two immutable synthetic advisory audits');
  await page.screenshot({path:path.join(OUT,'teacher-review-desktop.png'),fullPage:true});
  for(const width of [390,320]){
   await page.setViewportSize({width,height:820});
   const dimensions=await page.evaluate(()=>({
    visible:document.documentElement.clientWidth,
    scroll:document.documentElement.scrollWidth
   }));
   assert.ok(dimensions.scroll<=dimensions.visible+1,
    'Horizontal overflow at '+width+'px: '+JSON.stringify(dimensions));
   assert.ok(await page.locator('#questions article').first().isVisible());
   stats.mobileViewports++;
   if(width===390){
    await accessibility(page,'mobile 390px');
    await page.screenshot({path:path.join(OUT,'teacher-review-mobile-390.png'),fullPage:true});
   }
  }
  reportPass('no horizontal overflow at 390px or 320px and native accessibility audits passed');

  // Revoking a real current teacher directory blocks even a previously-issued
  // browser session from submitting. Error may be shown, but no extra write.
  await db.doc('teacherDirectory/teacherOne').update({status:'revoked'});
  const card15=page.locator('[data-question-id="XI-U07-T071-Q015"]');
  await card15.getByText('Needs further revision').click();
  await card15.getByRole('button',{name:'Submit advisory recommendation for Question 15'}).click();
  await page.locator('#action-status').getByText(
   /Recommendation was not confirmed: teacher-access-required/).waitFor({timeout:20000});
  assert.equal((await db.collection(COLLECTION).get()).size,2);
  assert.equal((await db.collection(AUDIT).get()).size,2);
  stats.revokedTeacherWritesDenied++;
  reportPass('mid-session teacher revocation stops native-browser POST with no extra audit');

  await page.locator('#logout-button').click();
  assert.equal(await page.locator('#review-panel').isHidden(),true);
  assert.equal(await page.locator('#questions article').count(),0);
  assert.equal(await page.locator('#signin').isVisible(),true);
  assert.equal(await page.evaluate(()=>
   document.activeElement?.id==='email'),true,
   'After logout, keyboard focus should return to sign-in email');
  stats.focusTransfers++;
  await page.reload({waitUntil:'domcontentloaded'});
  await waitReady(page);
  assert.equal(await page.locator('#review-panel').isHidden(),true);
  assert.equal(await page.locator('#questions article').count(),0);
  await noLeak(await page.content());
  assert.deepEqual(errors,[],'Browser runtime errors: '+JSON.stringify(errors));
  assert.deepEqual(cdnFailures,[],'Pinned Firebase CDN failed: '+JSON.stringify(cdnFailures));
  for(const p of paths)
   assert.equal(fs.readFileSync(path.join(ROOT,p),'utf8'),original[p],
    'Protected academic source modified '+p);
  const check=JSON.parse(original['portal/learning-catalog.json']);
  assert.equal(check.grades.find(g=>g.grade===11).units.find(u=>u.unit===7).questionBankCount,0);
  fs.writeFileSync(path.join(OUT,'summary.json'),JSON.stringify({
   version:'V159',execution:'REAL_PLAYWRIGHT_CHROMIUM_WITH_LOCAL_FIREBASE_AUTH_FIRESTORE',
   realBrowserInteractionVerified:true,liveTeacherPortalDeployed:false,
   sourceQuestionNumbers:[10,15,62,76],teacherApprovals:0,unit7ScoredMCQs:0,
   answerKeysRevealed:0,screenshotTypes:['synthetic-desktop','synthetic-mobile-390'],
   ...stats
  },null,2)+'\n');
  reportPass('logout clears browser view; all source fingerprints and scored-release safeguards unchanged');
 }finally{
  if(browser)await browser.close().catch(()=>{});
  if(server)await server.close().catch(()=>{});
  await adminDelete(admin).catch(()=>{});
 }
}
main().catch(e=>{console.error('V159 FAIL:',e.stack||e);process.exitCode=1;});
