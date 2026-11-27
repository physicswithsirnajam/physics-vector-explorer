# V209 — Grade XI Unit 7 unscored study lessons visible before Unit 8

## Student navigation reality
Unit 7.1 learning introduction, Unit 7.2 deformation, and Unit 7.3 elastic energy have **already** been individually created as public, unscored lesson pages (V145, V162, V163). Until this change the global unit menu only directly showed Topic 7.1; Exam Quick Access only listed Units 1–6.

## Source-bounded discovery change
- Unit 7 remains catalog status `planned`, `questionBankCount: 0`, `assessmentStatus: not-published`, and `resourceIds: []`. The existing V145 `learningPreviewStatus` sentinel is retained for compatibility; the additional known source-backed 7.2 and 7.3 lessons are separately enumerated under `additionalLearningPreviews` and explicitly marked `public-unscored-study-teacher-review`.
- Updated catalog summary/student notice reflect the three existing learning lessons but **not** a scored MCQ release or complete textbook-exercise set.
- Global Unit 7 menu shows links to 7.1, 7.2, 7.3 and a clear “Three public unscored learning lessons · Teacher review in progress” statement. Unit 7 remains inside **Coming soon** for scored course release; no test link is offered.
- Exam Quick Access introduces a source-verified standalone Unit 7 learning section with these **three** links, outside the original six-unit exam filter to preserve its existing student revision and regression contracts.
- New source/real-Chromium V209 QA navigates from the global menu and exam-access page to the original lesson destinations at 1280, 390 and 320 px, and ensures original pinned 2250 MCQs, 59 resource records, and zero Unit7 scored release are unchanged.
- Existing V145 and V140 browser regressions are rerun with Chromium in the new workflow.

## Academic boundaries — owner/teacher review still required
The 240 original Topic 7.1–7.3 MCQs plus 34 end-of-unit exercises (10 MCQs, 11 short responses, 8 comprehensive and 5 numericals) remain **under teacher/content approval**, not available for scored student selection. The original numerical exercise answers have unresolved printed-source ambiguities, so no solutions are promoted merely because a public study lesson exists.

No source-bank/key edits, teacher approvals, grade calculation, Firebase/Auth/App Check/security rules, student results, live report submission, classes, original official brand/logo asset, videos or official PDF question material are changed.

## Owner checklist
Only after all latest-head checks pass: Ready for review → Merge → Confirm. Then open **Units & Resources → Next units 7–10 → Unit 7** and open Topics 7.1, 7.2 and 7.3. Also open **Exam Quick Access** and find the separate Unit 7 public study preview. Verify that all show unscored/teacher-review wording and that Unit 7 still offers **no Build-a-Test/graded MCQ link**.

Following this PR: continue per-unit original-NBF textbook end-exercise and assignments mapping, beginning with Unit 1, separate from adapted/teacher-authored question sets and final teacher signoff.
