#!/usr/bin/env node
'use strict';
/* V98-A is an inventory-only, repository-source branding guard.
   It reads existing HTML and logos; it does not edit any learning page,
   publish assessments or affect login, access, storage or student records.
   Static source references do not prove browser visibility or authorization. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const portal=path.join(root,'portal');
const canonical='portal/assets/physics-with-sir-najam-official-logo.png';
const banner='physics-with-sir-najam-official-banner.png';
const standalone=[
 'archimedes-flotation.html','bernoulli-venturi.html','continuity-fluid-flow.html','superfluidity-explorer.html','viscosity-terminal-velocity.html',
 'centrifuge-applications.html','circular-motion.html','collisions-lab.html','coulomb-vector-lab.html','crystal-structure-explorer.html',
 'diffraction-ripple-tank.html','doppler-effect-laboratory.html','electric-field-particle-lab.html','first-law-pv-work.html','free-fall.html',
 'gravitational-waves-interferometer.html','heat-engine-carnot.html','ideal-gas-kinetic-theory.html','motion-graphs.html','polarization-malus-law.html',
 'projectile-motion.html','second-law-entropy-refrigerator.html','stationary-waves-harmonics.html','stress-strain-young-modulus.html','torque-angular-momentum.html',
 'vector-addition.html','wave-intensity-energy.html','wave-superposition-interference.html','weightlessness-artificial-gravity.html','work-energy.html'
];
function group(name){return name.match(/^unit-(\d{2})/)?.[1]||'core';}
function imageTags(html){return [...html.matchAll(/<img\b[^>]*>/gi)].map(x=>x[0]);}
function hasOfficialLogo(html){return imageTags(html).some(t=>/\bsrc\s*=\s*["'][^"']*physics-with-sir-najam-official-logo\.png["']/i.test(t));}
function main(){
 assert.ok(fs.existsSync(path.join(root,canonical)),'Original official logo must exist');
 assert.ok(fs.existsSync(path.join(root,'portal/assets',banner)),'Original official banner must exist');
 const htmls=fs.readdirSync(portal).filter(name=>name.endsWith('.html')).sort();
 assert.ok(htmls.length>=73,'Portal inventory unexpectedly lost HTML pages');
 const findings=[];
 const groups={};
 let bannerCount=0;
 for(const name of htmls){
  const html=read('portal/'+name), tags=imageTags(html), logo=hasOfficialLogo(html);
  const hasBanner=tags.some(t=>t.includes(banner));
  const groupName=group(name);
  groups[groupName]??={pages:0,withLogo:0,withBanner:0};
  groups[groupName].pages++;
  if(logo)groups[groupName].withLogo++;
  if(hasBanner){groups[groupName].withBanner++;bannerCount++;}
  const logoTags=tags.filter(t=>/\bsrc\s*=\s*["'][^"']*physics-with-sir-najam-official-logo\.png["']/i.test(t));
  const inaccessible=logoTags.filter(t=>!(/\balt\s*=\s*["'][^"']+["']/i.test(t)));
  if(!logo)findings.push('missing official logo image: portal/'+name);
  if(inaccessible.length)findings.push('official logo missing nonempty alt text: portal/'+name);
  if(logoTags.length>1 && name!=='index.html')findings.push('multiple official logo image tags: portal/'+name);
 }
 assert.deepEqual(findings,[],'Portal source branding errors:\n'+findings.join('\n'));
 // We explicitly check only pages in the recorded 30-lab root inventory.
 assert.equal(standalone.length,30);
 let count=0;
 for(const name of standalone){
  const html=read(name);
  const hasSharedV97=html.includes('shared/standalone-brand-v97a.js');
  const hasSharedV96=html.includes('shared/simulation-return-v96c.js');
  assert.ok(hasSharedV97||hasSharedV96,'Standalone simulation lacks verified branding integration: '+name);
  assert.ok(!(hasSharedV97&&hasSharedV96),'Standalone simulation should not have duplicate branding scripts: '+name);
  count++;
 }
 const v97=read('shared/standalone-brand-v97a.js');
 const v96=read('shared/simulation-return-v96c.js');
 assert.ok(v97.includes(canonical),'New shared component must reference exact official logo');
 assert.ok(v96.includes(canonical),'Unit 6 shared return bar must reference exact official logo');
 const guide=read('student-guide.html');
 assert.ok(hasOfficialLogo(guide),'Root student guide must have an original official logo image');
 const builder=read('build-your-physics-test.html');
 const legacy='assets/branding/physics-with-sir-najam-logo.png';
 assert.ok(imageTags(builder).some(x=>x.includes(legacy)),'Test Builder logo path changed; re-audit it');
 assert.ok(fs.readFileSync(path.join(root,canonical)).equals(fs.readFileSync(path.join(root,legacy))),'Builder logo is no longer exactly identical to canonical logo');
 const rootLanding=read('index.html');
 const relocatedVector=read('vector-explorer.html');
 assert.ok(hasOfficialLogo(rootLanding),'Root portal redirect must use canonical official logo');
 assert.ok(rootLanding.includes('url=./portal/'),'Public root must lead to the student portal');
 assert.ok(hasOfficialLogo(relocatedVector),'Relocated Vector Explorer must retain canonical official logo');
 assert.ok(relocatedVector.includes('shared/navigation.js?v=69'),
  'Relocated vector original must provide normal site navigation');
 console.log(JSON.stringify({scope:'static-source branding inventory',portalPages:htmls.length,groups,portalLogoPages:htmls.length,portalBannerPages:bannerCount,standaloneSimulationPages:count,standaloneBrandIntegrations:'30/30',rootStudentGuide:'canonical official logo',rootTestBuilder:'alternative path; byte-for-byte equal to canonical logo',rootLanding:'canonical logo and learning-portal redirect',relocatedVectorExplorer:'canonical logo, original science, and shared portal navigation',note:'This is static source QA, not a pixel-level visual/permissions/security audit.'},null,2));
}
try{main();}catch(err){console.error('V98-A BRAND AUDIT FAILED:',err);process.exitCode=1;}
