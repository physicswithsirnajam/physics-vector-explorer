#!/usr/bin/env node
'use strict';
/**
 * V100-E real Chromium test of the isolated, fictional admin UX preview.
 * No production backend, Firebase SDK, account, student identity or token.
 */
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const dir=path.join(root,'qa-artifacts','admin-review-preview-v100e');
const index=path.join(dir,'index.html');
const html=fs.readFileSync(index,'utf8');
const original=fs.readFileSync(path.join(root,'portal','assets',
 'physics-with-sir-najam-official-logo.png'));
const base64=original.toString('base64');
const attempts=[];
const server=http.createServer((req,res)=>{
 const incoming=new URL(req.url,'http://127.0.0.1');
 attempts.push(incoming.pathname);
 if(incoming.pathname!=='/'&&incoming.pathname!=='/inject'){
  res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');
  return;
 }
 let body=html;
 if(incoming.pathname==='/inject'){
  body=html.replace('Synthetic issue: the listed answer key may not match the worked calculation.',
   '&lt;img src=x onerror=alert(99)&gt;');
 }
 res.writeHead(200,{
  'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'
 });
 res.end(body);
});
function log(label){console.log('V100-E PASS:',label);}
async function audit(){
 assert.ok(html.includes('data:image/png;base64,'+base64),
  'Official logo bytes must be byte-identical to project master');
 assert.ok(!/https?:\/\/|fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|<script[^>]+src=/i.test(html),
  'Offline artifact must not contain network, Firebase or browser storage code');
 assert.ok(!html.includes('__FIXTURES_JSON__')&&!html.includes('__LOGO_DATA__'));
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',e=>e?reject(e):resolve()));
 let browser;
 const checks=[];
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const origin='http://127.0.0.1:'+server.address().port;
  const page=await browser.newPage({
   viewport:{width:1320,height:900},reducedMotion:'reduce'
  });
  const errors=[],remoteRequests=[];
  page.on('pageerror',err=>errors.push(String(err.message).slice(0,200)));
  page.on('request',req=>{
   if(!req.url().startsWith(origin)&&!req.url().startsWith('data:'))
    remoteRequests.push(req.url().slice(0,100));
  });
  const resp=await page.goto(origin+'/',{waitUntil:'load'});
  assert.equal(resp.status(),200);
  assert.match(await page.title(),/MCQ Review Desk.*Physics with Sir Najam/);
  const logo=page.locator('img[alt="Physics with Sir Najam official logo"]');
  assert.equal(await logo.count(),1);
  assert.ok(await logo.evaluate(img=>img.complete&&img.naturalWidth>0));
  assert.equal(await page.locator('.demo').innerText(),
   'SYNTHETIC DEMO · NOT CONNECTED');
  assert.equal(await page.locator('#report-list .item').count(),4);
  for(const [field,count] of [
   ['total','4'],['new','2'],['in-review','1'],['resolved','1']
  ])assert.equal(await page.locator('#metric-'+field).innerText(),count);
  const fixtures=await page.locator('#demo-data').evaluate(el=>JSON.parse(el.textContent));
  assert.equal(fixtures.length,4);
  assert.deepEqual(fixtures.map(r=>r.unit),[1,2,4,6]);
  assert.ok(fixtures.every(r=>/^mr_[a-f0-9]{48}$/.test(r.reportId)));
  checks.push('official logo and four source-pinned fictional reports render accurately');
  log(checks[checks.length-1]);

  await page.locator('[data-filter="new"]').click();
  assert.equal(await page.locator('#report-list .item').count(),2);
  assert.equal(await page.locator('[data-filter="new"]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-filter="in-review"]').click();
  assert.equal(await page.locator('#report-list .item').count(),1);
  await page.locator('[data-filter="resolved"]').click();
  assert.equal(await page.locator('#report-list .item').count(),1);
  assert.equal(await page.locator('#report-list .item[aria-current="true"]').count(),1);
  assert.ok((await page.locator('#details').innerText()).includes(fixtures[3].questionId),
   'detail must follow visible resolved report, not a hidden selection');
  await page.locator('[data-filter="all"]').click();
  await page.locator('#report-search').fill(fixtures[1].questionId);
  assert.equal(await page.locator('#report-list .item').count(),1);
  assert.ok((await page.locator('#details').innerText()).includes(fixtures[1].questionId),
   'search result must select its matching detail');
  await page.locator('#report-search').fill('unfindable-fake-question');
  assert.equal(await page.locator('#report-list .empty').count(),1);
  assert.equal(await page.locator('#details .empty-detail').count(),1);
  assert.equal(await page.locator('#details .issue').count(),0,
   'empty results must not display an unrelated/hidden report');
  assert.equal(await page.locator('#report-search').evaluate(e=>document.activeElement===e),true,
   'search focus must be preserved during filtering');
  await page.locator('#report-search').fill('');
  assert.equal(await page.locator('#report-list .item[aria-current="true"]').count(),1);
  assert.equal(await page.locator('#details .empty-detail').count(),0);
  checks.push('filters/search synchronize selected detail, empty result and search focus');
  log(checks[checks.length-1]);

  const first=page.locator('[data-report-id="'+fixtures[0].reportId+'"]');
  await first.click();
  assert.equal(await first.getAttribute('aria-current'),'true');
  assert.equal(await page.evaluate(()=>document.activeElement?.dataset.reportId),fixtures[0].reportId,
   'focus must survive selection re-render');
  assert.match(await page.locator('#details .issue').innerText(),/Synthetic issue:/);
  const start=page.locator('[data-demo-action="start-review"]');
  assert.equal(await start.count(),1);
  await start.click();
  assert.equal(await page.locator('#metric-new').innerText(),'1');
  assert.equal(await page.locator('#metric-in-review').innerText(),'2');
  assert.equal(await page.locator('#details .timeline li').count(),2);
  assert.equal(await page.locator('[data-demo-action="resolve"]').count(),1);
  assert.equal(await page.evaluate(()=>document.activeElement?.dataset.demoAction),'resolve',
   'focus must move to the next action after starting review');
  await page.locator('[data-demo-action="resolve"]').click();
  assert.equal(await page.locator('#metric-resolved').innerText(),'2');
  assert.equal(await page.locator('#details .timeline li').count(),3);
  assert.equal(await page.locator('#details .pill-resolved').count(),2);
  assert.equal(await page.locator('[data-demo-action]').count(),0);
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'reset-demo',
   'focus must land on reset when review is complete');
  checks.push('in-memory new → in-review → resolved updates counters and 0/1/2 audit events');
  log(checks[checks.length-1]);

  // Native keyboard activation must survive list and action button replacement.
  await page.locator('[data-report-id="'+fixtures[1].reportId+'"]').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(()=>document.activeElement?.dataset.reportId),
   fixtures[1].reportId);
  await page.locator('[data-demo-action="start-review"]').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(()=>document.activeElement?.dataset.demoAction),'resolve');
  assert.ok((await page.locator('#details').innerText()).includes(fixtures[1].questionId));
  checks.push('keyboard Enter selects a report and advances its demo review without losing focus');
  log(checks[checks.length-1]);

  // In-memory demo changes must not persist across navigation/reload.
  await page.reload({waitUntil:'load'});
  assert.equal(await page.locator('#metric-new').innerText(),'2');
  assert.equal(await page.locator('#metric-resolved').innerText(),'1');
  assert.equal(await page.locator('#details .timeline li').count(),1);
  checks.push('reload restores initial fiction; no persistent report state or stored account data');
  log(checks[checks.length-1]);

  await page.locator('[data-filter="new"]').click();
  await page.locator('[data-report-id="'+fixtures[0].reportId+'"]').click();
  await page.locator('[data-demo-action="start-review"]').click();
  assert.equal(await page.locator('#report-list .item').count(),1);
  assert.ok((await page.locator('#details').innerText()).includes(fixtures[1].questionId));
  assert.equal(await page.evaluate(()=>document.activeElement?.dataset.reportId),fixtures[1].reportId,
   'focus must move to a visible list item if stage action hides the prior selection');
  checks.push('stage transition inside a filter never leaves stale detail or focuses another report action');
  log(checks[checks.length-1]);
  await page.reload({waitUntil:'load'});

  for(const width of [1320,390,320]){
   await page.setViewportSize({width,height:width===1320?900:850});
   const sizes=await page.evaluate(()=>({
    viewport:document.documentElement.clientWidth,
    scroll:document.documentElement.scrollWidth
   }));
   assert.ok(sizes.scroll<=sizes.viewport+2,
    'No horizontal overflow at '+width+': '+JSON.stringify(sizes));
   assert.ok(await page.locator('#details').isVisible());
   assert.ok(await page.locator('#report-list').isVisible());
   if(width===1320||width===390)
    await page.screenshot({
     path:path.join(dir,width===1320?'desktop.png':'mobile.png'),
     fullPage:true
    });
  }
  checks.push('legible desktop, 390px mobile and 320px narrow screen without horizontal overflow');
  log(checks[checks.length-1]);

  // Verify untrusted issue content is never parsed as executable markup.
  // No remote image requests, inline event handler or HTML tags in fixture.
  const inject=await browser.newPage();
  let dialogCount=0;
  inject.on('dialog',dialog=>{dialogCount++;return dialog.dismiss();});
  await inject.goto(origin+'/inject',{waitUntil:'load'});
  const issue=inject.locator('#report-list .item-note').first();
  assert.equal(await issue.locator('img').count(),0);
  assert.match(await issue.textContent(),/&lt;img/);
  assert.equal(dialogCount,0);
  await inject.close();
  checks.push('synthetic HTML injection string is rendered as harmless text, not DOM or event handler');
  log(checks[checks.length-1]);

  assert.deepEqual(errors,[]);
  assert.deepEqual(remoteRequests,[]);
  assert.ok(attempts.every(p=>p==='/'||p==='/inject'));
  checks.push('browser has no JS errors, third-party requests, auth traffic, Firebase or API calls');
  log(checks[checks.length-1]);

  fs.writeFileSync(path.join(dir,'browser-test-summary.json'),JSON.stringify({
   version:'V100-E',status:'PASS',groups:checks,
   syntheticReports:4,widths:[1320,390,320],
   originalLogoSourceUnmodified:true,networkRequestsOutsideLocal:0,
   realFirebaseAuth:false,realAdminPermissions:false,
   productionData:false,sessionPersistence:false,studentSend:false
  },null,2)+'\n');
  console.log('V100-E FINISHED: '+checks.length+
   ' local Chromium groups passed; DESIGN PREVIEW ONLY; no production access.');
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
}
audit().catch(err=>{
 console.error('V100-E FAILED:',err.message.slice(0,300));
 process.exitCode=1;
});
