# V123 — Direct Unit 5 MCQ revision pathways ahead of 7 December 2026

**Prerequisite:** Owner confirmed PR #222/V122 merged and reviewed. Its targeted and inherited workflows were all green. This V123 proposal continues the one-small-PR-at-a-time exam-readiness roadmap.

## Source-grounded need

On the already public `portal/unit-05.html` Learning Desk, two distinct original **16-question** boxed MCQ mini-practices and two public post-practice worked keys exist. The Exam Quick Access Unit 5 MCQ category previously linked only to the general Test Builder. Students preparing for the **December 7, 2026** Physics exam therefore had to find the already-published 16-question practice sheets indirectly.

The four existing paths have been verified in the current GitHub source:

1. `portal/unit-05-mcq-practice.html` — Set A, 16 provisional original boxed MCQs / 8 practice marks, question-only page; no key loaded.
2. `portal/unit-05-mcq-set-b.html` — Set B, 16 additional provisional original boxed MCQs / 8 practice marks, question-only page; no key loaded.
3. `portal/unit-05-mcq-key.html` — Set A public post-practice worked key; intentionally public, not a secure staff page or official marking scheme.
4. `portal/unit-05-mcq-set-b-key.html` — Set B public post-practice worked key; same public, nonofficial conditions.

**No new questions are authored by these links.** These 32 mini-practice examples are already part of the existing Unit 5 learning desk and must not be counted as additional MCQs in the signed 2,250-question Grade XI bank.

## Proposed student-facing delta

Only `portal/exam-quick-access.html` Unit 5 → Exam-style MCQ practice is changed:

- Retain existing central `../build-your-physics-test.html?unit=5` entry; clarify it is provisional.
- Append **Set A practice**, **Set B practice**, then **Set A public worked key — after practice**, **Set B public worked key — after practice**. Student question sheets appear before worked answers.
- All links point to existing public static HTML. No login/permission claim is added.
- Other Units 1–4 and 6, their filters and existing link targets remain unchanged.

Exam Quick Access original source-backed links increase **43 → 47**, while the Unit 5 MCQ section increases **1 → 5**. The existing V101-A regression is updated to verify the new total, each exact path, the practical phone UI, practice-first order and no horizontal overflow. V119 source regression on Unit 6's three links is retained.

## Academic, privacy and technology safeguards

- Both Unit 5 mini-sets remain provisional original classroom practice; their 16 × 0.5 = 8 practice mark format does not replace the full-grade FBISE 80-MCQ model paper.
- The Unit 5 worked-key routes and JSON are already public. A reveal control is presentation, **not backend authorization**; do not reuse their questions for a confidential unseen assessment.
- Neither the 16/16 paper question data, 16/16 worked-key data, 18 descriptive alternatives, original NBF references, teacher SLO/cognitive mapping, watermarked printing nor official logo is changed or newly certified.
- **275 + 206 + 220 + 640 + 349 + 560 = 2,250** existing Grade XI provisional public reporting refs remain unchanged; the **560** Unit 6 individual academic review approvals remain **PENDING**; course planned and graded assessment not published.
- No Firebase, App Check, backend, authentication, student response submission, saved-score functionality, teacher permissions, issue-report sending, source PDFs or other student practice changes.

## Quality gates

The V123 Actions workflow runs the adjusted V101A source and Chromium navigation tests (desktop 1280 px, phone 390 px, narrow 320 px), protected V119 Unit 6 link checks, V122 public-key label regression, V121 eight public-route Git blob fingerprints, V118 six-unit exam-readiness audit, V94D academic nonrelease and V99i answer-free signed reference inventory.

**Acceptance:** Keep the PR in Draft until latest-head checks all pass. Open Files changed and verify Unit 5 adds exactly four real revision links in the existing category and updates one inherited navigation test. After green checks, use Ready for review → Merge pull request → Confirm merge. Following GitHub Pages deployment, open Exam Quick Access, filter Unit 5 + MCQ practice, verify five links in practice-first order and that all four source destinations open.

**No direct production merge is requested.**