# V98-I — Seven public Grade XI study and numerical pages: responsive and functionality audit

## Confirmed prerequisite

PR #152 merged successfully (merge SHA `e9b26c5cb52db61496c7c2dec7d433336eaa7094`). Its seven checked-out student practice pages passed browser smoke testing at 1280px desktop and 390px mobile, with no recorded diagnostic alerts. The checked pages used the existing exact official `Physics with Sir Najam` logo; their student-only practice files, answers, grades and access were not modified.

**V98-I is strictly a read-only browser QA continuation**. It adds only a new test script, an Actions workflow, and this document. No science text, equations, solutions, print styles, question-bank JSON, original logo, navigation, student data, account rules or live web configuration is edited.

## Small, deliberately varied seven-page batch

| Checked route | Distinct purpose |
|---|---|
| `portal/unit-01-study-guide.html` | Measurement, accuracy and uncertainty study guide |
| `portal/unit-01-numericals.html` | Unit 1 worked numerical examples |
| `portal/unit-02-formula-sheet.html` | Vector formula sheet, quadrants, print control |
| `portal/unit-02-numericals.html` | 30 worked vector numericals and Show/Hide Solutions |
| `portal/unit-03-study-guide.html` | Translatory motion study guide |
| `portal/unit-03-numericals.html` | Eight source-backed exercises, six summative and two formative/supplementary |
| `portal/unit-05-work-study.html` | Work and Energy study guide |

The academic *scope of each page* is retained exactly as already implemented; browser existence checks **do not** independently certify numerical or textbook answer correctness.

## Local browser audit

`scripts/audit_grade11_student_study_v98i.cjs` serves checked-out repository files locally to Chromium and checks each page at **1280px desktop, 390px mobile, and 320px small phone**. It validates:

- Original, unaltered official logo loads, is visible in the header, and has meaningful alternative text.
- Correct branded title, main student content landmark, named section anchor and actual learning content.
- Width of document vs viewport; horizontal overflow is explicitly logged rather than silently ignored. The test also records JS exceptions, missing same-origin resources and unusually sized branding.
- Real **Unit 2 30-numerical Show All / Hide All** functionality.
- Unit 3 student numericals load from the existing validated JSON source, populate **6 summative + 2 formative/supplementary**, and the Reveal/Hide controls function.
- Unit 2 formula sheet retains the printer control; real public navigation **Unit 2 formula sheet → Unit 2 worked numericals** works.
- 21 static viewport screenshots, `audit.json`, and `report.md` collected in `grade11-student-study-v98i-evidence`.

The first check's result may contain **nonblocking diagnostic alerts** even with a green workflow; review the attached `report.md`. If a genuine mobile defect appears, identify and correct it separately in a single narrowly scoped PR without changing source physics or any answers.

## Boundaries

No personal logins, classroom/student records, private enrolled lesson, teacher-only key or protected assessment route was opened. No printing is triggered and no grade/answer submissions occur. This is **source-local browser testing**, not production/live-site verification or accessibility certification. Do not infer that all remaining portal pages have been fully audited.

## Merge gate

Only after latest-head GitHub checks pass and the diagnostic artifact is reviewed: **Ready for review → Merge pull request → Confirm merge**. Maintain separate, regression-tested PRs for any identified defects.
