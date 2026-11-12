/* Physics with Sir Najam — V5.1 personal PDF report using the browser's PDF printer.
   No CDN, no external data transfer, no actual PDF file is generated server-side.
   The original official logo PNG is used unchanged as an <img> reference.
   Report text is escaped; records are used only after a verified account session in app.js.
*/
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const toNum=value=>Number.isFinite(Number(value))?Number(value):0;
function dateLabel(value){
 try{const d=value?.toDate?.()||new Date(value||'');return Number.isFinite(+d)?d.toLocaleDateString('en-GB',{year:'numeric',month:'short',day:'numeric'}):'Not recorded';}
 catch{return 'Not recorded';}
}
function percent(value){return value==null?'N/A':escapeHtml(value)+'%';}
export function openProgressPdfReport({studentName,records,complete,analytics}){
 if(!records?.length)return false;
 // Open synchronously while the user click gesture is active, avoiding download/popup blockers.
 const win=window.open('','_blank');if(!win)return false;
 try{win.opener=null;}catch{}
 try{
 const logo=new URL('./assets/physics-with-sir-najam-official-logo.png',import.meta.url).href;
 const slos=analytics.slos||[];
 const rows=slos.map(x=>`<tr><td>${escapeHtml(x.code)}</td><td>${escapeHtml(x.answered)}</td><td>${escapeHtml(x.correct)}</td><td>${percent(x.accuracy)}</td><td>${escapeHtml(x.status==='focus'?'Revision suggested':x.status==='strong'?'Strong practice':x.status==='developing'?'Keep practising':'More evidence needed')}</td></tr>`).join('');
 const shown=records.slice(0,50);
 const attempts=shown.map((r,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(dateLabel(r.createdAt))}</td><td>${escapeHtml(toNum(r.questionCount))}</td><td>${escapeHtml(toNum(r.correctCount))}</td><td>${escapeHtml(r.arrangement||'random')}</td></tr>`).join('');
 const priorities=(analytics.priority?.length?analytics.priority:analytics.needsEvidence?.slice(0,3)||[]).map(x=>`<li><strong>${escapeHtml(x.code)}</strong> — ${escapeHtml(x.topic||'Physics learning outcome')} (${x.status==='focus'?'suggested revision':'more practice evidence needed'})</li>`).join('');
 const completeness=complete?`All ${records.length} saved attempts available at the time of export were loaded.`:`Only the ${records.length} most recently loaded attempts are included. Load more attempts in the portal to extend this report.`;
 const truncation=records.length>50?`The attempt table lists the latest 50 of ${records.length} loaded attempts; all ${records.length} are included in the statistics.`:`All ${records.length} loaded attempts are listed.`;
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My Physics Progress Report | Physics with Sir Najam</title><style>
 @page{size:A4;margin:17mm 16mm 18mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#182c49;background:#fff;margin:0}h1{font-family:Georgia,serif;font-size:25px;margin:6px 0}h2{color:#1b3e65;font-size:15px;margin:22px 0 9px;border-bottom:2px solid #e0b86f;padding-bottom:6px}p{line-height:1.55;margin:5px 0}.report-head{display:flex;align-items:center;gap:16px;border-bottom:3px solid #d8b66f;padding-bottom:14px}.report-logo{width:80px;height:80px;object-fit:contain;flex:0 0 80px}.kicker{font-weight:bold;font-size:10px;color:#8b6933;text-transform:uppercase;letter-spacing:.12em}.brand{font-weight:bold;font-size:13px;color:#2a4c74}.student{margin:14px 0;padding:12px;background:#edf3fa;border-radius:7px}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:13px 0}.metric{background:#f3f6fa;padding:11px 8px;border:1px solid #e3ebf3;border-radius:6px}.metric strong{display:block;font-size:23px;color:#1c456f}.metric span{font-size:9px;color:#657386}.notice{border-left:3px solid #cba565;background:#fff9eb;padding:10px 12px;font-size:10px;margin:15px 0}table{border-collapse:collapse;width:100%;table-layout:fixed}th,td{border-bottom:1px solid #e3eaf2;text-align:left;padding:8px 6px;overflow-wrap:anywhere}th{background:#e9f0f8;color:#2a527a;font-size:10px}tr{break-inside:avoid}.recommendations{padding-left:18px;line-height:1.8}.foot{font-size:9px;color:#5f6d81;margin:20px 0 10px}.toolbar{background:#0d2344;color:white;padding:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.toolbar button{border:0;background:#e5bd70;color:#142d4e;font-weight:bold;border-radius:5px;padding:10px 15px;cursor:pointer}.toolbar span{font-size:12px}.toolbar button:focus-visible{outline:2px solid white}section{break-inside:auto}@media print{.toolbar{display:none!important}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.student{background:#edf3fa!important}}
 </style></head><body><div class="toolbar"><span>Report ready. Select <strong>Save as PDF</strong> in the print dialog.</span><button onclick="window.print()">Save as PDF / Print</button></div>
 <div class="report-head"><img class="report-logo" src="${escapeHtml(logo)}" alt="Official Physics with Sir Najam logo"><div><div class="brand">PHYSICS WITH SIR NAJAM</div><h1>My Physics Progress Report</h1><div class="kicker">From Fundamentals to Frontiers.</div></div></div>
 <div class="student"><p><strong>Learner:</strong> ${escapeHtml(studentName||'Student')}</p><p><strong>Report generated:</strong> ${escapeHtml(new Date().toLocaleString('en-GB'))}</p><p><strong>Record coverage:</strong> ${escapeHtml(completeness)}</p></div>
 <div class="summary"><div class="metric"><strong>${escapeHtml(analytics.attempts)}</strong><span>Loaded attempts</span></div><div class="metric"><strong>${escapeHtml(analytics.answered)}</strong><span>Questions answered</span></div><div class="metric"><strong>${percent(analytics.accuracy)}</strong><span>Answered accuracy</span></div><div class="metric"><strong>${escapeHtml(analytics.uniqueQuestions)}</strong><span>Different MCQs seen</span></div></div>
 <div class="notice"><strong>Self-practice report:</strong> This is browser-graded practice, not verified examination results. SLO classifications are provisional and undergoing academic review. ${escapeHtml(completeness)}</div>
 <section><h2>Learning outcome performance</h2><table><thead><tr><th style="width:18%">SLO</th><th style="width:16%">Answered</th><th style="width:16%">Correct</th><th style="width:18%">Accuracy</th><th>Interpretation</th></tr></thead><tbody>${rows||'<tr><td colspan="5">No SLO records yet.</td></tr>'}</tbody></table></section>
 <section><h2>Suggested next steps</h2>${priorities?`<ol class="recommendations">${priorities}</ol>`:'<p>Continue a variety of practice tests. More evidence may be needed before recommending specific areas.</p>'}</section>
 <section><h2>Saved practice history</h2><p style="font-size:10px;color:#5f6d81">${escapeHtml(truncation)}</p><table><thead><tr><th>Number</th><th>Date</th><th>MCQs</th><th>Correct</th><th>Arrangement</th></tr></thead><tbody>${attempts}</tbody></table></section>
 <p class="foot">Physics with Sir Najam — personalized self-practice progress. This is a private student report. Keep it secure. Prepared from the records currently loaded in your account dashboard.</p>
 <script>window.addEventListener('load',()=>{const img=document.querySelector('.report-logo');const go=()=>setTimeout(()=>window.print(),160);if(img&&!img.complete){img.addEventListener('load',go,{once:true});img.addEventListener('error',go,{once:true});}else{go();}});</script></body></html>`;
 win.document.open();win.document.write(html);win.document.close();
 return true;
 }catch(err){try{win.close();}catch{}return false;}
}
