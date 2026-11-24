# V127 — Direct Unit 3 80-mark public practice pack in Exam Quick Access

## Verified source and prerequisite

PR #226/V126 merged on **24 November 2026** and GitHub confirmed **19 of 19 latest-head workflows succeeded**. This V127 change follows the existing Grade XI exam revision roadmap before **7 December 2026**.

The source `portal/unit-03.html` already links to `portal/unit-03-assessment-pack.html`, an original **Unit 3-only 80-mark practice resource**: Section A contains 80 questions (40 marks), Sections B/C contain nine internal-OR descriptive pairs (40 marks). The pack includes a manually completed blank OMR-style sheet, a marked teacher reference, worked discussion/marking suggestions and a source-derived SLO distribution. Its existing notice explicitly states that the pack is **not an official FBISE full-syllabus examination**, OMR sheet or certified marking scheme, that teacher academic review remains outstanding, and that student scores/responses are not saved. The pack and its public worked keys are **not access-restricted** and must not be treated as confidential exam material.

## Narrow proposed change

Add **one direct link** under **Exam Quick Access → Unit 3 → Short and long responses**, below the existing Unit 3 descriptive Sections B/C practice:
- `./unit-03-assessment-pack.html` — "Unit 3 — 80-mark practice pack, public worked keys and manual OMR (open after practice; not official)"

This preserves question-only/practice-first ordering and leaves the existing Unit 3 MCQ Test Builder plus 40/80-question summative MCQ links untouched. No combined question-only paper is invented or claimed for Unit 3; the 80-mark pack coordinates the existing separate Section A and B/C pages.

## QA and boundaries

- Update the inherited `scripts/test_grade11_exam_quick_access_v101a.cjs` static inventory from **54 to 55** direct resource links. Check the exact added destination, honest official-exam warning, provisional status, and manual OMR disclaimer.
- Continue real Chromium **1280/390/320px** checks. On 390px phone, verify Unit 3 **answers** filter includes the original descriptive-practice link followed by the public pack, no horizontal overflow and a synthetic screenshot. Explicitly restore `numericals` before Unit 6's legacy intentionally empty-category check, preserving the V126 CI fix.
- Run prior V119, V122, V121, V118, V94D and V99i guards for public worked key transparency and Unit 6 nonrelease. Preserve all **2,250** provisional central-bank public report references across the six units (275, 206, 220, 640, 349, 560).
- **560 Unit6 academic approvals remain PENDING**; the planned course and graded assessment are not published. No question/answer/scenario/SLO/source file, logo, watermark, score, student data, Firebase, App Check, authentication, reporting or backend changes are made.
- No assertion that independent academic review has been completed. Technical checks are not teacher academic certification.

## Owner acceptance

Review PR #227 in **Files changed**: one Unit 3 answers-category link, one inherited navigation test, this V127 rationale and a workflow file. Keep PR in **Draft** until **every latest-head check is green**. If any check fails, do not merge. Once all pass, **Ready for review → Merge pull request → Confirm merge**. After GitHub Pages deploys, go to **Exam Quick Access → Unit 3 → Short and long responses**; confirm the original Section B/C link and the public 80-mark pack, and only use worked keys after completing practice.
