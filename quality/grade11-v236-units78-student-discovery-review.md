# V236 — Units 7–8 public-study discovery across sidebar, Student Guide and Test Builder

## Goal and current reality

The portal previously presented a visual impression that everything stopped at Unit 6, although the shared drawer already held Unit 7 and 8 lesson links inside a collapsed group labelled "Next units" and "Coming soon." The Student Guide still described only Units 1–5 and an old 1,690-MCQ count, while Build Your Test offered approved provisional self-practice MCQs only from Units 1–6.

**Actual verified resources at this checkpoint:**
- Units **1–5** provisional bank = 275 + 206 + 220 + 640 + 349 = **1,690 MCQs**.
- Unit **6** = 560 provisional public-topic MCQs (Topics 6.1–6.7); therefore **2,250 MCQs** across Units **1–6** in the current central Test Builder.
- Unit **7** = **3 source-based, public unscored lessons** (Topics 7.1–7.3) plus **2 existing simulations**; no Unit 7 scored or unscored MCQ Test Builder bank.
- Unit **8** = **10 source-based, public unscored lessons** (Topics 8.1–8.10), independently adapted in-chapter examples/assignments, and **4 existing simulations**. V235 inventories original end exercises but **does not approve or publish** any original source exercise answers, or enable a Unit 8 MCQ bank.
- Unit **9–10** have existing simulation links but no full topic/course or scored bank; future units remain planned.

## What is changed

- **Shared left sidebar:** add prominent Quick Links directly to the public Unit 7 and Unit 8 topic directories in Exam Quick Access. Preserve original `psn-drawer-future[data-psn-future-units="7,8,9,10"]` and its established links/semantics for previous lesson browser regressions, but accurately identify Unit 7 as *three unscored lessons* and Unit 8 as *ten unscored lessons*. Correct stale Topic 8.1-only notice and label Units 9–10 planned.
- **Build Your Physics Test:** show a clear section with two learning access cards (study directory and simulations), while retaining **disabled** Unit 7 and Unit 8 selection checkboxes, preserving the hard-coded 1–6 `liveBanks` and `isPilotConfiguration` restrictions. For direct `?unit=7` or `?unit=8` entry, explain the study-only status and **do not silently select Unit 1 instead**. Existing Unit 1–6 MCQ selection, scenario grouping, filters and report/save guards remain untouched.
- **Student Guide:** update outdated Units1–5 copy, list Units1–8 with exactly scoped study and practice links, show 2,250 provisional MCQs dynamically from Units1–6, and clearly distinguish the absence of Unit7/8 banks from availability of unscored lessons.

## Strong non-release gate

Nothing in this PR publishes student-facing exercise stems, end-of-unit MCQ answers, graded tests, or a supposedly approved teacher answer key. No Firebase/Auth/teacher roster/results rules are modified. Unit7 and Unit8 metadata must remain `status=planned`, `questionBankCount=0`, `assessmentStatus=not-published` with their existing explicit unscored learning previews. All 2,250 pinned Unit1–6 bank entries, 59 catalogue resources, and existing five/three/ten lessons are preserved.

Changing the accessibility/navigation to a public unscored lesson is **not** authority to activate Unit7–8 in the Test Builder. That will require content creation, original-source and answer-by-answer independent QC, summative/formative SLO validation, teacher approval, explicit owner release decision and a distinct technical PR.

## QA and next stage

V236 tests public navigation from the sidebar, Study Guide, and Test Builder on large and small viewports, the full 3/10 lesson links and simulations, direct `?unit=7` and `?unit=8` selection hold, no seventh/eighth MCQ launch, non-overflow, and no JS exceptions. Run V140 unit-aware sidebar, V234 Entropy, V209 Unit7 discovery and pinned bank regressions.

After V236 is merged and public links are checked, resume **V237** original Unit8 18-MCQ academic QC (without automatic graded release). When teacher-approved question banks for Units7 and 8 exist, enable their practice filters and progress tracking in small separate PRs, rather than implying the existing unscored topic lessons are MCQ banks.
