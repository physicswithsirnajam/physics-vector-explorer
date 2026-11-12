/* Physics with Sir Najam — Portal V5 learner analytics.
 * Pure calculations on the currently loaded SELF-PRACTICE archive.
 * No student-identifying data is stored here. None of these metrics is a
 * verified board result, clinical assessment, or certified SLO mastery. */

export const SLO_TOPICS = Object.freeze({
  'P-11-A-01': 'Estimation of physical quantities',
  'P-11-A-02': 'Derived SI units',
  'P-11-A-03': 'Dimensional homogeneity',
  'P-11-A-04': 'Dimensional derivation',
  'P-11-A-05': 'Accuracy and precision',
  'P-11-A-06': 'Propagation of uncertainty',
  'P-11-A-07': 'Measurement uncertainty'
});
const CODE_RE=/^P-11-A-\d{2}$/;
const integer=x=>Number.isInteger(x)&&x>=0?x:0;
const pct=(right,total)=>total?Math.round(100*right/total):null;
function msOf(timestamp){
  if(timestamp && typeof timestamp.toDate==='function'){
    const d=timestamp.toDate();return d instanceof Date&&Number.isFinite(d.getTime())?d.getTime():0;
  }
  if(timestamp instanceof Date) return timestamp.getTime();
  if(Number.isFinite(timestamp?.seconds))return timestamp.seconds*1000;
  return 0;
}
function createSlo(code){return {code,topic:SLO_TOPICS[code]||'Learning outcome',answered:0,correct:0,skipped:0,uniqueIds:new Set(),attemptIds:new Set()};}
export function analyzeAttempts(input){
  const attempts=(Array.isArray(input)?input:[]).map((r,i)=>({
    ...r, _order:i, _ms:msOf(r.createdAt), _items:Array.isArray(r.questionResults)?r.questionResults:[]
  })).sort((a,b)=>b._ms-a._ms||a._order-b._order);
  const slos=new Map(),uniqueQuestions=new Set();
  let presented=0,answered=0,correct=0,skipped=0;
  const timeline=[];
  attempts.forEach((r,aIndex)=>{
    let n=0,ok=0,missing=0;
    // The stored question count is the canonical number of questions shown.
    // Individual records are self-reported and may have imperfect metadata.
    const count=integer(r.questionCount);
    presented+=count;
    const items=r._items.slice(0,60);
    for(const item of items){
      if(!item||typeof item!=='object')continue;
      const isAnswered=item.answered===true;
      const isCorrect=isAnswered&&item.correct===true;
      const id=typeof item.id==='string'?item.id:'';
      if(id)uniqueQuestions.add(id);
      if(isAnswered){n++;answered++;if(isCorrect){ok++;correct++;}}
      else{missing++;}
      const codes=[...new Set((Array.isArray(item.sloCodes)?item.sloCodes:[]).filter(x=>typeof x==='string'&&CODE_RE.test(x)))];
      for(const code of codes){
        if(!slos.has(code))slos.set(code,createSlo(code));
        const x=slos.get(code);
        if(id)x.uniqueIds.add(id);
        if(isAnswered){x.answered++;x.attemptIds.add(aIndex);if(isCorrect)x.correct++;}
        else x.skipped++;
      }
    }
    skipped+=Math.max(0,count-n); // includes unrecorded/invalid entries as unanswered
    timeline.push({timestamp:r.createdAt,answered:n,correct:ok,questionCount:count,accuracy:pct(ok,n)});
  });
  const allSlos=[...slos.values()].map(x=>{
    const unique=x.uniqueIds.size,distinctAttempts=x.attemptIds.size;
    const enoughEvidence=x.answered>=5&&unique>=3&&distinctAttempts>=2;
    const accuracy=pct(x.correct,x.answered);
    const status=!enoughEvidence?'building':accuracy<65?'focus':accuracy>=80?'strong':'developing';
    return {code:x.code,topic:x.topic,answered:x.answered,correct:x.correct,skipped:x.skipped,unique,distinctAttempts,accuracy,enoughEvidence,status};
  }).sort((a,b)=>a.code.localeCompare(b.code));
  const priority=allSlos.filter(x=>x.status==='focus').sort((a,b)=>a.accuracy-b.accuracy||b.answered-a.answered).slice(0,3);
  const needsEvidence=allSlos.filter(x=>x.status==='building').sort((a,b)=>a.answered-b.answered||a.code.localeCompare(b.code));
  return {
    attempts:attempts.length,presented,answered,correct,skipped,accuracy:pct(correct,answered),
    uniqueQuestions:uniqueQuestions.size,slos:allSlos,priority,needsEvidence,
    timeline:timeline.slice(0,10).reverse(),hasMoreThanWindow:false
  };
}
export function targetedPracticeUrl(code){
  if(!CODE_RE.test(code))return null;
  // Every mapped Unit 1 SLO has at least 9 active MCQs in the V6.2 bank.
  // Use a conservative 4-item sample; the engine revalidates on launch.
  const params=new URLSearchParams({count:'4',scope:'all',slo:code,arrangement:'random',selection:'balanced',unseen:'true',feedback:'end',shuffle:'true'});
  return '../practice-engine/index.html?'+params.toString();
}
