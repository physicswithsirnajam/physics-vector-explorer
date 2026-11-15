# V44 — Grade XI Unit 4 Combined Student Paper: Teacher Readiness & Print QA

**Physics with Sir Najam | Rotational and Circular Motion | PR #34 | Teacher review pending**

## Why this release exists

PR #32 provides a useful 80-mark integrated *practice hub*, but until this change its Section A (boxed 80 MCQs) and Sections B/C (nine descriptive questions with internal OR) are printed from **two separate pages**. V44 adds one public `portal/unit-04-combined-student-paper.html` to print the complete question-only practice in a single browser print job (or save as PDF).

The new page **reuses, rather than copies or regenerates**, the approved-structure, provisional Unit 4 question banks:
- `question-bank/grade-11/unit-04-v39-80-practice.json`: 56 independent MCQs, six four-question scenarios (Q57–Q80), 40 marks total.
- `question-bank/grade-11/unit-04-descriptive-practice.json`: 7 × 4-mark SRQs + 2 × 6-mark ERQs, each with an equal-mark internal OR, 40 marks total.
- **Combined total: 80 marks.** Only one A/B choice is attempted per descriptive question. The union of all OR alternatives covers the 12 Unit 4 summative theory SLOs (P-11-B-07 to B-10; B-14 to B-21). Each student's OR path covers a subset.
- Summative Unit 4 only; formative P-11-B-11 and collision-related P-11-B-12/B-13 are excluded.

## What student printing must show

- [ ] Header is **Grade XI / HSSC-I / Unit 4 — Rotational and Circular Motion**; total 80 marks; student identification and marks summary.
- [ ] **80** independent or scenario MCQ rows in **10 boxed tables**, Q1–Q80 in order, with four original option text columns and four **blank A/B/C/D** circles per question.
- [ ] Full scenario passage before each set of four contextual questions, Q57–Q60 through Q77–Q80. The six passages must never be dropped or separated from their questions.
- [ ] **Section B:** Q1–Q7, four marks each, two complete A/OR/B questions per number; suitable working lines.
- [ ] **Section C:** Q8–Q9, six marks each, two complete A/OR/B questions per number; extra working space.
- [ ] **No correct options, explanations, solved numericals, teacher marking points or shaded circles** in the student page, screen view or print output.
- [ ] Student questions and option wording exactly match the two source banks; no edits to bank data.
- [ ] Existing integrated teacher answer key and manual blank/teacher-marked OMR-style response sheets remain separate and unchanged.

## Automated QC vs teacher sign-off

The new `.github/workflows/validate-grade11-unit4-combined-paper-v44.yml` runs Chromium on Ubuntu 24.04, checks JSON-source-to-rendered text, marks/SLOs, blank bubbles, six scenarios, A/B/C headings, mobile viewport, print CSS and the print button. It uploads screenshot previews to the completed GitHub Actions run. It also reruns V39, V40, V41 and V42 source and marks tests.

**Automated success is not physical print certification.** Before formal class use:

- [ ] Open the new page from **Unit 4 Learning Desk** or **Integrated Assessment Pack → 1. Complete 80-mark student paper**. The status must say *Ready* before printing.
- [ ] Use the print button, choose **A4 portrait** and inspect **all pages** in Chrome print preview. Check page count, wrapping, table borders, readable options, scenario blocks, section order, OR divisions and page breaks.
- [ ] Physically print a sample on the available school printer. Review blank circles, no clipped rows, no leaked answers, legibility, space for working and acceptable paper use. Adjust print scaling only if necessary.
- [ ] Inspect the new page on a **390-pixel phone**; the entire page should not scroll horizontally, while boxed MCQ tables should be horizontally scrollable *inside* each table wrapper.
- [ ] Review the printed questions academically: compare every original MCQ option and each descriptive alternative with the NBF Grade XI Unit 4 content and FBISE HSSC-I summative SLO mapping; check calculations and marks. The automated script checks source fidelity, **not independently guaranteed physics correctness**.
- [ ] Use the existing **teacher key** from the assessment pack, NOT this student-only page, to mark. The printed bubble circles are a manual classroom practice aid, **not** a scanner-approved official FBISE OMR.
- [ ] Verify no protected exam, student account/grade persistence, or other unit's question banks were modified.

## Release boundary

These are original Unit 4-only **provisional practice** resources, not an official full-syllabus FBISE examination or certified mark scheme. This PR adds a question-only print route plus two links from existing Unit 4 pages, one independent browser QC script, workflow and this checklist. It does not add a login, submission, grade recording, timers, question randomization or any changes to the original question bank answers.

**Next after merging:** teacher reviews print previews and physical A4 output, then report any errors before we design subsequent classroom-delivery features.
