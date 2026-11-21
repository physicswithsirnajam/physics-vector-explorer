# V98-H — Visual and functional browser QA for seven public Grade XI student practice pages

## Prerequisite and quality approach

PR #151 (V98-G) merged, verified at GitHub commit `22d9672607a111063689aa8b7184f60d09577317`. The seven Unit 6 topic previews successfully loaded their source banks, started 10-question practice sessions and displayed answer choices across desktop/mobile, with zero reported page errors and layout alerts in the scoped run.

V98-H is another **test-only baseline**. It changes no existing teaching page, MCQ source, numerical answer, student/teacher key, styling, original logo, Firebase rules, permissions, or portal behavior.

## Sample: seven student practice views

| Student page | Meaningful smoke test |
|---|---|
| `portal/unit-03-mcq-practice.html` | 40 source-validated boxed MCQs, select first bubble, reset; do not reveal key |
| `portal/unit-03-mcq-full80.html` | 80 source-validated boxed MCQs, select bubble, reset; do not reveal key |
| `portal/unit-04-mcq-full80.html` | 80 source-validated boxed MCQs, select bubble, reset; do not reveal key |
| `portal/unit-04-combined-student-paper.html` | Source-backed student paper loads Sections A/B/C; do not print or grade |
| `portal/unit-05-mcq-practice.html` | 16 student MCQs (Set A), four local bubble options each, mark and clear |
| `portal/unit-05-mcq-set-b.html` | 16 student MCQs (Set B), four local bubble options each, mark and clear |
| `portal/unit-05-descriptive-student.html` | Seven short/numerical OR pairs and two extended OR pairs load in student edition |

All pages were inspected in repository source prior to being included. They have viewport metadata, existing direct references to the original official logo `portal/assets/physics-with-sir-najam-official-logo.png`, and genuine student practice rather than private login/enrolled lesson routes.

**Important:** Some public Unit 3/4 MCQ pages deliberately expose an optional after-practice explanation key, but this diagnostic **never clicks** Check Answers, Show Key, Print Key, Submit, or any teacher resource link. No new permission/security claim is made.

## Local Chromium checks

`scripts/audit_grade11_student_practice_v98h.cjs`, invoked by `Grade XI Student Practice Visual and Interaction Audit (V98-H)`, serves checked-out repository files locally. At **1280px desktop and 390px phone** it checks page/title and original header logo loading with alt text and visible image, records page overflow, JS page errors and local 404s, and captures **14 screenshots** (7 desktop, 7 mobile).

At mobile width, it also runs the safe, unsaved student interactions described in the table. Boxed-question tables are permitted to scroll *within their own table container*; any overall document horizontal overflow is recorded as a diagnostic issue. Tests do not claim that the questions and answers are academically approved, or that the live deployed site and Firebase authorization have been assessed.

Audit artifacts: `grade11-student-practice-v98h-evidence`, containing screenshots, `audit.json`, and `report.md`. A green result confirms page loading and smoke interactions. **Review diagnostic alerts even after a green check**; any confirmed source-page issue should be handled by a separate, minimal PR.

CI is triggered on the seven HTML pages, their student JS, relevant question-bank JSON files, original logo and the test/workflow itself.

## Follow-up and safety

Do not modify original official branding, science, student data, teacher answers or permission boundaries to accommodate a test. This is a read-only exploratory baseline. Green-check-first review and one-PR-at-a-time remain the release process. Next: fix any verified UI issue in a separate focused PR or sample remaining public study/practice views.
