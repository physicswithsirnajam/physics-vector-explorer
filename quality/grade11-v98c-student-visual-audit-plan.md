# V98-C — Read-only Grade XI student-facing visual QA baseline

## Purpose and prerequisite

PR #146 is confirmed merged (merge commit `87ba0fdf43edd949afacd587eb15f6890b0ba4b7`), completing the known original Vector Explorer logo correction. Prior V98-A recorded **73/73 `portal/*.html` pages** with exact official-logo source references and all 30 recorded standalone laboratories branded; that was a **source inventory**, not visual proof that every page displays correctly.

**This PR is intentionally read-only from the students' perspective.** It introduces a Chromium QA script and workflow, plus this plan; it does **not** update or redesign any student HTML, brand image, simulation physics, quiz, assessment, teacher view, Firebase configuration or login flow.

## Seven representative pages (one deliberate sample)

| Route | Why included |
|---|---|
| `portal/index.html` | Student-first portal and public sign-in presentation; do not authenticate |
| `portal/simulations.html` | Public simulation catalogue and navigation |
| `portal/unit-01.html` | Early foundational unit desk |
| `portal/unit-03.html` | Deeper unit/assessment-resource navigation |
| `portal/unit-06-learning-desk-v95a.html` | Unit 6 public preview scaffold and richer layout |
| `student-guide.html` | Student-facing start/navigation guide |
| `index.html` | Original vector lab after V98-B logo fix |

These seven are **representative** across layout types; they do not constitute an all-73-page verification, nor does this first pass establish live deployment status. Explicitly excluded: teacher answer-key pages, private enrolled lesson content, login or enrollment testing and any hidden student records.

## Automated browser audit

`scripts/audit_grade11_student_visual_v98c.cjs` serves repository files locally through a temporary HTTP server and uses headless Chromium at **1280px desktop and 390px mobile**. It checks:

- Each public/student page loads and retains its brand title.
- The **unchanged original** `portal/assets/physics-with-sir-najam-official-logo.png` image loads with a nonempty accessible `alt` description and is visually present on both viewports.
- Records displayed logo dimensions, page width vs viewport, visible links and heading count.
- Records horizontal overflow, unusually sized logos, page JavaScript exceptions and missing same-origin source assets as **explicit diagnostic alerts** (not silently ignored, and not prematurely treated as regressions requiring a broad mixed PR).
- Exercises one real safe navigation: public simulation catalogue → Unit 1 learning desk.
- Archives **14 screenshots**, one desktop + one mobile for each route, and an `audit.json` plus human-readable `report.md`.

GitHub Actions `Grade XI Student Visual Baseline (V98-C)` runs the audit without accounts, secrets, write privileges or private Firebase content. **A green audit job means the seven pages loaded, official logos were present and the safe navigation worked. It does not mean there were zero diagnostic alerts.** The attached JSON/Markdown reports and screenshots remain essential to review.

## Review and next steps

1. Leave PR in **Draft** until latest-head CI completes. Inspect the screenshot and report artifact `grade11-student-visual-v98c-evidence`, especially any overflow/runtime alerts.
2. After a green workflow, mark **Ready for review** and merge this source-only observability baseline.
3. Address any serious documented presentation issue separately in a **single focused follow-up PR**, preserving original branding assets, scientific calculations and teacher/student authorization boundaries.
4. A distinct later live-deployment/browser audit can compare the deployed GitHub Pages site to checked-in source, without exposing sign-in credentials or accessing teacher/private answers. Do not describe this local baseline as a live site certification.
