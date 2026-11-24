# V124 — Direct Unit 4 self-practice and projector review from Exam Quick Access

**Prerequisite:** PR #223/V123 is confirmed merged and all 16 reported pull-request workflow checks succeeded. Keep proceeding in small, independently checked changes before the **7 December 2026** Grade XI Physics examination.

## Existing source-verified routes

The Unit 4 Learning Desk already publishes three separate supplementary uses of its original **80 Unit 4 MCQs**:

- `portal/unit-04-mcq-full80.html` — familiar FBISE boxed 80-question, **Unit 4-only** self-practice with 56 independent and 24 contextual MCQs and optional practice explanation key; provisional, not an official full-syllabus examination.
- `portal/unit-04-projector-practice.html` — classroom-oriented 80-question countdown presentation (50 seconds by default), designed to show question and options **without the answers** and use an existing blank OMR-style practice sheet; not a secure graded exam.
- `portal/unit-04-discussion-slides.html` — **public, untimed** question-first and deliberately revealed worked-answer discussion of the same 80 original MCQs; open after student practice, not password-protected or an official examiner key.

These exact file paths and claims were checked against the current GitHub source, not inferred from page names. The timed projector and worked discussion are intended for classroom use; the 80-question boxed practice is suitable for individual revision. Unit 4 Learning Desk already links all three. Exam Quick Access previously exposed only the general Test Builder for Unit 4.

## Exactly one student-facing change

In `portal/exam-quick-access.html`, keep the original **Unit 4 → Exam-style MCQ practice** Test Builder link and append the three existing links in deliberate order:

1. 80 boxed Unit 4 MCQs — provisional self-practice and explanations
2. 80-MCQ timed classroom projector practice — no solutions shown
3. 80-MCQ public worked discussion slides — **open after practice; not official**

No extra quick-access category or authentication is introduced, and the global route/category filter stays unchanged. The existing source-backed link inventory rises from **47 to 50**. Other units' resources are unmodified.

## Safeguards and regression

- There are **no newly authored MCQs**, answer letters, explanations, SLO classifications, teacher signoffs or grades in this change. The 80 Unit 4 projector/discussion questions are existing public educational material, not 80 additions to the central bank.
- Existing Grade XI public provisional question inventory remains **275 / 206 / 220 / 640 / 349 / 560 = 2,250**. All **560 Unit 6** per-item academic approvals remain **PENDING**, with course `planned` and official graded assessment `not-published`.
- Public answer reveal is a **presentation** feature, not backend authorization. A secure exam would need server-side protection; this task does not create one.
- No original academic source JSON, external PDFs, Firebase/App Check/Auth, score/saving/reporting, branding, watermark or other HTML/JS page is changed.
- Update existing `scripts/test_grade11_exam_quick_access_v101a.cjs` to inventory 50 local targets, preserve all inherited Unit 5 and Unit 6 paths, verify Unit 4's exact four links in the correct order via 390px Chromium browser filter, check no horizontal overflow, and save a synthetic screenshot.
- New V124 workflow runs revised V101A browser QA at **1280 / 390 / 320px**, inherited V119 Unit 6 links, V122 Unit 5 worked-key label, V121 public teacher review fingerprints, V118 source inventory, V94D Unit 6 release gates and V99i signed 2,250 answer-free reference inventory.

## Owner acceptance

1. Open PR #224 → **Files changed**: expect one Unit 4 link-group addition, a legacy V101A regression update, one V124 quality note and one V124 Actions workflow.
2. Keep **Draft** while latest-head checks run. If any red, share its failure details and **do not merge**.
3. Once all latest checks are green: **Ready for review → Merge pull request → Confirm merge**.
4. After GitHub Pages deploys, open Exam Quick Access, select **Unit 4 + MCQ practice**, verify four links, open the 80-MCQ self-practice and timed classroom slideshow, and only then open the public solution discussion.

**Status:** source-verified direct navigation proposed; no formal exam publication, teacher certification or restricted access.
