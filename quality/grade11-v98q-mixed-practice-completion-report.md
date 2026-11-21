# V98-Q — Complete Six-Unit Grade XI Practice Attempt and MCQ Issue-Report Audit

## Verified prerequisite

PR **#160** merged into `main` at `a55183c974a944ba5110a01d30188f929cbafe87`. Its targeted and broader browser regressions confirmed the original Notes & Videos PDF titles now wrap inside cards at phone and desktop widths; source URLs, original branding and catalog references remain unchanged.

V98-Q is a **testing-only extension** of the Grade XI Student Portal. Prior V54/V55/V56/V89 tests already cover unit-bank integrity, baseline navigation, scenario grouping and small submissions. This batch covers an additional student-critical failure mode: **a complete multi-unit attempt and its final scored review**, plus the precise meaning of an MCQ issue-report action.

## What the browser actually does

Run a real **30-question Grade XI Units 1–6 practice session** from the public Test Builder in local Chromium with **all external HTTPS requests blocked**. It is not logged in and has no access to student account records or a backend.

- Confirm original brand-logo image bytes are identical across the Test Builder and Portal reference copies, and that they load visibly.
- Select six units and 30 MCQs, navigate into the actual Practice Engine, and start a real quiz populated from the existing source banks.
- Exercise a sample answer, **Next → Previous**, and verify the original selection persists.
- Answer 29 real questions (one deliberately unanswered), verify **30 distinct question IDs, four choices per item**, and every selected unit contributes questions.
- Submit with local confirmation for the one unanswered item. Verify the question-by-question review entries, original selected choices, per-unit question counts, Correct/Incorrect/Not Answered totals and rounded Score **reconcile**. This tests internal reporting consistency; it does not independently certify source answer correctness.
- Confirm **cloud-saving remains disabled** for unauthenticated multi-unit practice. Test **1280px desktop, 390px phone, 320px narrow phone** for the Builder, Quiz and Result (9 screenshots).
- Capture JS exceptions and local asset failures. Any page-wide mobile overflow is an explicit diagnostic, even if the core test passes.
- Never print, authenticate, save grades, access private lessons, reveal teacher keys, contact Google Drive or YouTube, or send any message to a live backend.

GitHub artifact: **`grade11-mixed-practice-v98q-evidence`**, containing `audit.json`, `report.md`, and screenshots of all three states at three viewport widths.

## Exact MCQ issue-report behavior and the current gap

The present `practice-engine/index.html` displays the student action **“Found an issue with this MCQ? Prepare a report”**. It accepts a problem category and optional note, prepares a text report containing the **question ID, original source question number, bank version, original question, currently displayed options and problem description**, and attempts to **copy** it to the browser clipboard. If copying is blocked, a selectable text fallback is displayed. The page explicitly says students must paste the report into a teacher message and that **no report is sent automatically**. It avoids account identity, chosen answers and scores.

The V98-Q test verifies real clipboard/fallback content and asserts that **no POST request occurs** during the issue-report action or anonymous practice session. It does **not** claim there is already an admin inbox, notification, tracked ticket, or server-side receipt from this particular Practice Engine button. An actual submitted-report workflow with privacy, abuse prevention, access controls and acknowledgment would be a **separate product/security task**, requiring careful design and review.

## Academic, safety and deployment limitations

This audit is against checked-out local source files, not live GitHub Pages. Source answer keys are not academically reverified by a successful score/review reconciliation. It does not test email or administrative delivery, Firebase rules or production authentication. It changes **no existing teaching HTML, science engines, source question banks, official logo, saved account records, authentication permissions or site behavior**.

## Release gate

Do not merge a pending or failing workflow. Review latest-head GitHub Actions and diagnostic artifact. On green, use **Ready for review → Merge pull request → Confirm merge**. If a new UI defect is found, fix it in a separate, minimal PR while preserving the original teaching sources.
