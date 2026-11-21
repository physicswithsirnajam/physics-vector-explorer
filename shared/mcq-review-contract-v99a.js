/* Physics with Sir Najam — V99-A MCQ report intake contract.
 * Pure, dependency-free data validation for a FUTURE authenticated review queue.
 * Importing this module never contacts a server or sends a student report.
 * It does not grant any teacher role or alter Firebase security rules.
 */
(function (root, factory) {
  'use strict';
  const contract=factory();
  if(typeof module==='object'&&module.exports)module.exports=contract;
  if(root)root.PSNMCQReviewV99A=contract;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const CATEGORIES=Object.freeze([
    'missing-context','incorrect-key','unclear-wording','formula-display','other'
  ]);
  const ALLOWED_KEYS=Object.freeze([
    'schemaVersion','kind','grade','unit','questionId',
    'sourceQuestionNumber','bankVersion','category','note','origin'
  ]);
  const SCHEMA_VERSION=1, KIND='grade11-mcq-review', ORIGIN='practice-engine';
  const ID=/^[A-Za-z0-9_-]{7,80}$/;
  const CONTROLS=/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

  function clean(value,max){
    if(typeof value!=='string')throw new TypeError('Text value must be a string');
    const text=value.replace(CONTROLS,'').trim();
    if(text.length>max)throw new RangeError('Text exceeds the '+max+'-character report limit');
    return text;
  }
  function numberIn(value,low,high,label){
    if(!Number.isInteger(value)||value<low||value>high)throw new TypeError(label+' is out of range');
    return value;
  }
  function buildDraft(input){
    if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('Report input must be an object');
    // Construct a new allowlisted record from selected fields only.
    // Never spread source question objects, even if they contain a private key,
    // answer, score, email, full identity or arbitrary HTML.
    const unit=numberIn(input.unit,1,6,'Grade XI unit');
    const questionId=clean(input.questionId,80);
    if(!ID.test(questionId))throw new TypeError('Invalid stable source question identifier');
    const idUnit=/^(?:XI-)?U0([1-6])-/.exec(questionId);
    if(!idUnit||Number(idUnit[1])!==unit)throw new TypeError('Question ID does not belong to the stated unit');
    const sourceQuestionNumber=numberIn(input.sourceQuestionNumber,1,5000,'Source question number');
    const bankVersion=clean(input.bankVersion,120);
    if(!bankVersion)throw new TypeError('Bank version required for teacher lookup');
    const category=clean(input.category,32);
    if(!CATEGORIES.includes(category))throw new TypeError('Unrecognized review category');
    const note=clean(input.note==null?'':input.note,500);
    return {
      schemaVersion:SCHEMA_VERSION,kind:KIND,grade:11,unit,
      questionId,sourceQuestionNumber,bankVersion,category,note,origin:ORIGIN
    };
  }
  function validateDraft(value){
    const issues=[];
    if(!value||typeof value!=='object'||Array.isArray(value))return {ok:false,issues:['not-an-object']};
    const keys=Object.keys(value);
    if(keys.length!==ALLOWED_KEYS.length||keys.some(k=>!ALLOWED_KEYS.includes(k)))
      issues.push('unexpected-or-missing-fields');
    if(value.schemaVersion!==SCHEMA_VERSION||value.kind!==KIND||value.grade!==11||value.origin!==ORIGIN)
      issues.push('invalid-fixed-fields');
    try{
      const candidate=buildDraft(value);
      for(const k of ALLOWED_KEYS)if(value[k]!==candidate[k])issues.push('invalid-'+k);
    }catch(e){issues.push('invalid-report:'+String(e.message).slice(0,120));}
    return {ok:issues.length===0,issues};
  }
  function toTeacherLabel(draft){
    if(!validateDraft(draft).ok)throw new TypeError('Only a validated report may be labelled');
    return 'Grade XI · Unit '+draft.unit+' · '+draft.questionId+' · '+draft.category;
  }
  return Object.freeze({
    SCHEMA_VERSION,KIND,ORIGIN,CATEGORIES,ALLOWED_KEYS,
    buildDraft,validateDraft,toTeacherLabel
  });
});
