# Grade XI Physics Unit 4 — V43 Classroom Readiness and Independent QC

**Physics with Sir Najam | Rotational and Circular Motion | PR #33**

**Status: AUTOMATED CHROMIUM QC SUBJECT TO SUCCESSFUL GITHUB ACTIONS; HUMAN CLASSROOM REVIEW STILL REQUIRED.** This check does **not** certify the provisional questions as an official FBISE exam, official marking key, automated graded test or machine-scannable OMR.

## Assessment sources and limits

- Existing 80-item Unit 4 Section A source: `question-bank/grade-11/unit-04-v39-80-practice.json` (56 independent + 24 scenario MCQs; 40 practice marks).
- Existing Unit 4 Sections B/C: `question-bank/grade-11/unit-04-descriptive-practice.json` (7 × 4 + 2 × 6 = 40 marks; 9 OR pairs, 18 fully worked alternatives).
- Integrated practice: `portal/unit-04-assessment-pack.html`; printed blank and teacher-marked OMR-style pages, 80 answer explanations, 18 descriptive marking choices, OR-sensitive SLO/marks audit.
- FBISE summative content only: P-11-B-07 through B-10 and B-14 through B-21. Formative B-11 and out-of-chapter collisions B-12/B-13 are excluded. All 12 appear across the combined choices, but a student's selected OR path covers only a subset.
- Textbook source: NBF Grade XI Physics printed pp.53–76; FBISE HSSC-I 50% MCQs/50% descriptive model paper. Unit-only practice is not full-syllabus board coverage.

## Tier 1: existing numerical and source-bank CI

- [ ] Existing V39–V42 checks all green on the final PR SHA: 80 actual source items in order, 20 correct answers per letter, six complete and self-contained scenarios, 80 MCQ explanatory entries, 9 descriptive questions with equal-mark internal OR pairs.
- [ ] Section A = 80 × 0.5 = 40, Section B = 7 × 4 = 28, Section C = 2 × 6 = 12. For each all-A or all-B example path total = 80 marks. Never add A and B OR alternatives together.
- [ ] All twelve summative SLOs mapped and no changes to the original physics calculations, marks, logo, other units, authentication or saved grades.

## Tier 2: newly automated Chromium real-browser check

The workflow `.github/workflows/validate-grade11-unit4-classroom-v43.yml` temporarily installs a pinned Playwright browser on a GitHub runner, serves the checked-out repository over local HTTP, and tests the *actual JavaScript-fetch-rendered* pages. It does not install any runtime dependency in the website or use privileged student accounts.

- [ ] Integrated assessment loads both banks, all 80 blank OMR rows and 80 separately shaded teacher bubbles, six scenario boxes, all 80 answer rows and all 18 descriptive OR solutions.
- [ ] Every OMR number Q1–Q80 appears once, without gaps; 12-SLO table totals and distinct all-A/all-B 80-mark paths are correct.
- [ ] Real Chromium print stylesheet isolates blank OMR, teacher key and SLO/marks table as **three distinct views**.
- [ ] Descriptive student-print view hides worked answers; teacher-print view reveals 18 marked alternatives; viewing/printing restores the original answer visibility.
- [ ] Boxed FBISE MCQ UI shows 80 × 4 selectable options, supports check and reset without any recorded student grade.
- [ ] 390-pixel mobile viewport does not create page-level horizontal overflow. No unhandled browser JavaScript errors occur.
- [ ] Review screenshot artifact **`unit04-v43-browser-and-print-reference-screenshots`** in the successful workflow run (retained seven days). Screenshots are technical references, not a substitute for physically printing A4 sheets.

## Tier 3: teacher sign-off — mandatory manual review

These checks cannot be certified by source-level scripts or headless browser snapshots:

- [ ] Open the published Unit 4 Learning Desk on both laptop/projector and a mobile phone. Confirm all study/lab/MCQ/descriptive/integrated links and the original logo are visually intact.
- [ ] Print the blank OMR on **actual A4 paper**. Inspect border alignment, all 80 rows, 56 independent + 6 groups of 4, legible A–D circles, no shaded answers, and no cut-off questions. These circles are for **manual practice only**, not FBISE scanning.
- [ ] Print the teacher-marked OMR. Check that exactly one answer bubble is visibly shaded for each numbered MCQ and reconcile spot checks against the original live source bank rather than a copied answer list.
- [ ] Print the boxed MCQ student question paper and verify every option column/bubble, especially long stems and six scenario passages, is readable without clipping or accidental answer disclosure.
- [ ] Print the descriptive **student paper** and **teacher key** separately. Check 7 × 4-mark short questions and 2 × 6-mark extended questions, two complete OR alternatives for each, and sufficient writing space.
- [ ] Verify physics and suggested marks by hand: Q1 radian 5π/4; Q4 friction/banked turn ≈21.8°; Q8 angular momentum skater 18 J → 36 J; Q9 force comparison 6,000 N → 13,500 N; plus one full question from each remaining SLO.
- [ ] Confirm Unit 4 SLO/marks table changes correctly across all-A and all-B paths, does **not** add both, and communicates that one student's chosen nine OR alternatives cover fewer SLOs than the union of both options.
- [ ] Test with a school printer, projector and a phone using an ordinary browser; verify no unintended login prompt, grades, progress saving or account updates.
- [ ] Teacher gives explicit academic approval before describing the provisional key as classroom-verified. Do not claim official FBISE endorsement or print certification based only on green GitHub CI.

## Scope of V43 code changes

- New browser test and CI only; no change to MCQ or descriptive JSON banks, student scores, previous Units 1–3, study/lab engines or official logo.
- Correct a **compulsory terminology mistake** on the Unit 4 descriptive page: the board stage for Grade XI must read **HSSC-I**, not **SSC-I**.
- Successful CI provides browser evidence. Any remaining physical-print or academic discrepancies must be resolved as follow-up PRs; CI success alone does not equal teacher sign-off.
