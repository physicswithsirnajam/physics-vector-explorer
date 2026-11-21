# V98-F — Unit 6 six-topic lesson and balanced-MCQ visual baseline

## Context and safe scope

PR #149 is confirmed merged (commit `91e8b89697d740147095ef4d9370724bdddca66d`), fixing the Unit 5 phone overflow while preserving all original source content. The V98-E regression confirmed document widths equal to 320px and 390px phone viewports and all 12 checks passed.

This PR continues the existing **read-only student visual QA series**. It creates only an audit script, GitHub Actions workflow, and this note. **No existing page, physics lesson, logo, exercise, question, assessment, login, permissions, data, or publication status is changed.**

## Seven public pages in this new, non-overlapping batch

| Route | Learning content / key DOM existence check |
|---|---|
| `portal/unit-06-topic-61-study-v95b1.html` | Upthrust and Archimedes; `#buoyancy-form` |
| `portal/unit-06-topic-62-study-v95b2.html` | Viscous drag and terminal velocity; `#stokes-form` |
| `portal/unit-06-topic-63-study-v95b3.html` | Fluid flow; `#flow-rate-form` |
| `portal/unit-06-topic-64-study-v95b4.html` | Equation of continuity; `#mass-continuity-form` |
| `portal/unit-06-topic-65-study-v95b5.html` | Bernoulli equation; `#bernoulli-pressure-form` |
| `portal/unit-06-topic-66-study-v95b6.html` | Bernoulli applications; `#torricelli-form` |
| `portal/unit-06-balanced-mcq-v95c1.html` | Student seven-topic balanced MCQ practice; `#setup-form` |

The detailed Topic 6.7 lesson and the Unit 6 Learning Desk were already included in the earlier V98-D and V98-C baselines, respectively, so are not repeated in the seven screenshot pairs here. Every selected page was confirmed to reference the canonical `portal/assets/physics-with-sir-najam-official-logo.png` and have a viewport meta element.

## Local browser evidence

The new `scripts/audit_grade11_student_visual_v98f.cjs` runs in Chromium against files checked out from GitHub and served by a temporary local HTTP server. It checks all seven pages at **1280px desktop** and **390px phone**: title, displayed original logo with meaningful alt text, core lesson/practice elements, page width, visible links, logo size, local missing resources and browser JavaScript exceptions. It follows the **Topic 6.1 → Unit 6 Learning Desk #topic-61** link and verifies the real destination. It archives **14 screenshots, `audit.json`, `report.md`** in `grade11-unit06-student-visual-v98f-evidence`.

**Important interpretation:** a *green* audit confirms the pages load, official logos and core elements appear, and navigation works; it can still record **non-blocking diagnostic alerts** for horizontal overflow, unusual brand size, local missing assets or JS exceptions. Read the evidence artifact before any cosmetic remediation.

## Safety and limitations

No authentication, student accounts, private enrolled content, teacher keys, Firebase data or individual learning records are accessed. The test enforces that no teacher, secure-lesson, course-lesson, admin or MCQ key route enters its seven-page sample. This is **source-local UI QA**, not a certification of the live site, production authorization, educational content/answer correctness, or a full 73-page review. Address genuine defects in a separate minimal PR rather than disguising edits as part of an observational audit.

## Merge rule

Keep draft until all latest-head checks are green; review report and screenshots, then Ready for review → Merge pull request → Confirm merge. Next batch should target other uncovered public study/practice page types.
