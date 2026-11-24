# V122 — Unit 5 worked solutions: clear public after-practice link

**Owner decision:** In the conversation after merging PR #221/V121 on **24 November 2026**, the owner approved the V121 recommendation that all eight already public pages remain publicly accessible for now. Worked solutions and projector discussions remain revision resources, academic audits remain provisional/source-labelled, and the figure verification desk remains a public on-device teacher-quality worksheet. None of these routes becomes authenticated or exam-certified through this decision.

**Reason:** Before the **December 7, 2026** Grade XI Physics examination, students need honest and accessible revision links without mistakenly treating public worked keys as secure teacher-only materials or official examination answers. The V121 review warned that a reveal button is **not access-restricted** backend delivery. The historical V121 review file retains its original **PENDING** snapshot; this follow-up documents the owner's subsequent choice without rewriting that audit's recorded evidence.

## Exactly one live text change

In `portal/exam-quick-access.html`, Unit 5 > Short and long responses, change the existing anchor's displayed words only:

- Before: `Descriptive & Numerical Worked Answers`
- After: `Descriptive & Numerical Worked Answers — public after-practice solutions (not an official exam key)`

The exact href remains `./unit-05-descriptive-teacher.html`. Students encounter the original `unit-05-descriptive-student.html` 40-mark practice link first. The destination already says that the key and underlying JSON are public, available after completing practice, and not FBISE-certified.

## What remains untouched

- All **eight V121 public pages** and their answer-key JSON/companion JavaScript; no backend authorization is added or suggested by a hidden UI.
- Every MCQ, descriptive question, answer letter, calculation, solution rubric, SLO/cognitive classification, and provenance record.
- **2,250** provisional Grade XI MCQ reporting references (275/206/220/640/349/**560** for Units 1–6), plus all **560** pending Unit 6 academic approvals and disabled formal assessment release.
- Firebase, App Check, authentication, student data, score saving, Copy-only issue reporting, logo, V112 scientific typesetting and printed-PDF watermarks, Units 1–6 filters and resource destinations.

**No backend** access-control migration is included. If any answer key is intended to become confidential in a future school examination, it must first be removed from public static hosting and delivered via verified server-side roles; client-side hiding is not sufficient.

## Quality gates and acceptance

- New V122 source regression checks exact honest Unit 5 menu wording, unchanged practice-first links, accessible public destination warnings, unchanged eight-item V121 source-review history, existing Units 1–6 question counts and exam-release holds.
- The new V122 workflow also invokes the V121 eight-page Git-blob fingerprint regression, V118 six-unit exam-readiness audit, V94D Unit 6 signoff gates, and V99i answer-free 2,250-reference catalog test.
- Owner: keep the PR draft until latest-head checks are green. Inspect only this menu label and three new QA/documentation files; then Ready for review → Merge pull request → Confirm merge. After deployment, open Exam Quick Access → Unit 5 → Short and long responses, and ensure the new wording is visible, the student practice opens normally, and the worked-solution link still leads to the existing public post-practice page.

**Status:** Public-access classification approved for now; text-only student communication change is proposed, not yet merged.
