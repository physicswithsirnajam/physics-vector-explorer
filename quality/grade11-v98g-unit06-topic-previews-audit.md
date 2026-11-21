# V98-G — Seven Unit 6 Topic Previews: Visual and Practice Interaction Baseline

## Prerequisite

PR #150 (V98-F) is **merged** at `5fa5a461efb6ee1562f44cb5b5a86af5479154dc`. Its six detailed lessons and balanced-MCQ student page passed locally served Chromium checks on desktop 1280px and mobile 390px, including official logo loading, safe lesson navigation, zero recorded diagnostic alerts, zero JS exceptions and zero missing local assets.

This PR adds **only** a read-only QA script, workflow, and this record; no HTML lesson, source bank, MCQ, physics, student records, logos or website settings are edited.

## Seven new pages

All seven standalone **Topic 6.1–6.7 student MCQ preview** HTML pages under `portal/unit-06-topic-XX-preview.html`. Each contains the exact original logo asset and a public provisional MCQ practice setup, with no cloud grading and no protected exam claim. Each is tested separately, not assumed equivalent because the pages look alike.

## Browser checks and evidence

`scripts/audit_grade11_student_visual_v98g.cjs` serves current repository files locally (not the live deployed site). In Chromium it checks each page at **1280px desktop and 390px mobile**, verifies the unchanged official logo loads, meaningful alt text, page title, `#setup`, visible link count, responsive page width, and records missing local assets and JavaScript exceptions.

**Functional student-practice QA:** each topic must load and validate its current local MCQ bank. The audit starts a **10-question session**, verifies four options are rendered, selects an answer, goes Next then Previous, and confirms that the answer is retained. No submission, results, sign-in, teacher access, private content or answer publication occurs.

For topic 6.2 it also follows the public link to the original `viscosity-terminal-velocity.html` standalone simulation.

**Evidence artifact:** `grade11-unit06-preview-v98g-evidence` includes **21 screenshots** (7 desktop setup + 7 mobile setup + 7 active-mobile-practice), `audit.json`, and `report.md`. A green workflow confirms page and practice smoke tests passed; the JSON/report can still contain nonblocking visual diagnostics like overflow or JS errors. A hidden official logo or practice bank that cannot start is blocking.

## Integrity and safety

All seven preview pages are already public; no student account is authenticated and no private question keys or teacher dashboards are accessed. User-scoped data are never collected or modified. Test interactions occur only in a temporary local browser session. The source question banks are read as served; **this does not validate all 560 MCQ answers or textbook references**, nor does it certify live deployment.

The file and route scope is constrained, and the workflow reruns when tested HTML/JS, canonical logo asset, or topic bank JSON sources change. If the audit finds a genuinely broken practice UI or mobile presentation, correct it only in a separate, narrowly tested PR after documenting the actual cause.

## Merge procedure

Keep Draft until all latest-head checks pass. Review artifact `report.md` and mobile screenshots before **Ready for review → Merge pull request → Confirm merge**.
