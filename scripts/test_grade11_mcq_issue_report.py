#!/usr/bin/env python3
"""Safety smoke test for the Grade XI MCQ issue-report generator.

No browser, Firebase, student account, or private data is required.
"""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "practice-engine" / "index.html").read_text(encoding="utf-8")
required = (
    'id="mcq-report-details"',
    'id="mcq-report-type"',
    'id="mcq-report-notes"',
    'id="copy-mcq-report"',
    'id="mcq-report-fallback"',
    'Copy this MCQ for teacher review',
    "window.dispatchEvent(new CustomEvent('psn:practice-finished'",
)
for marker in required:
    if marker not in html:
        raise SystemExit(f"FAIL — missing UI or persistence marker: {marker!r}")

a = html.index("const issueKinds={")
b = html.index("async function writeIssueReport(", a)
pure_js = html[a:b]
test_js = r"""
'use strict';
const cfg={unit:2};
const bank={bankVersion:'v19-provisional'};
const q={
 id:'XI-U02-MCQ-0013',
 sourceQuestionNumber:13,
 stem:'The y-component of that force is:',
 stimulusText:'A force of 10 N acts at 30 degrees.',
 correctOptionId:'A',
 displayOptions:[
  {id:'C',text:'10 N'}, {id:'A',text:'5 N'},
  {id:'B',text:'8.66 N'}, {id:'D',text:'20 N'}
 ]
};
const report=makeMcqIssueReport(q,'missing-context','Please restore the context.');
const expectations=[
 'Question ID: XI-U02-MCQ-0013',
 'Original source question number: 13',
 'Unit: 2',
 'v19-provisional',
 'A force of 10 N acts at 30 degrees.',
 'Missing scenario, graph, diagram or information',
 'A. 10 N\nB. 5 N\nC. 8.66 N\nD. 20 N',
 'Please restore the context.'
];
for(const value of expectations){if(!report.includes(value))throw Error('Missing report section: '+value)}
if(report.includes('correctOptionId:')||report.includes('Correct answer:')){
 throw Error('Report must not expose a hidden answer key.');
}
const withoutStimulus=makeMcqIssueReport({...q,stimulusText:null},'other','');
if(!withoutStimulus.includes('extra context: (none shown)')){
 throw Error('Missing-scenario fallback text not preserved');
}
console.log('PASS — report includes stable reference, scenario and shuffled option text without hidden keys.');
"""
result = subprocess.run(
    ["node", "-e", test_js.replace("const q=",pure_js+"\nconst q=",1)],
    cwd=ROOT, capture_output=True, text=True,
)
if result.returncode:
    print(result.stderr or result.stdout, file=sys.stderr)
    raise SystemExit(result.returncode)
print(result.stdout.strip())
print("PASS — UI controls and saved-attempt event remain present.")
