# V216 — Grade XI Units 1–7 textbook-exercise and assignment navigation coverage audit

**Status scope:** Student-visible **current public repository** (not a scientific endorsement of the source pack, not exact original textbook verification). Reconciles `learning-catalog.json`, V103 numbered worked-resource index, V104 descriptive answer index, V108 Unit 6 provisional worked-topic index, the V210–V215 linked pages and Unit 7 V145/V162/V163 unscored study lessons.

## Eight independent navigation and academic categories
Each of Units 1–7 has separate **worked learning**, **in-chapter assignments**, **original end-of-unit MCQs**, **original end-of-unit short-response questions**, **original end-of-unit extended-response questions**, **original end-of-unit numerical problems**, **teacher-prepared descriptive practice**, and **provisional MCQ self-practice** status. Unit 7 also has an additional unscored three-lesson category. "Link available" is deliberately not "exact original textbook item verified" or "teacher-approved marking key."

## Current verifiable public link summary

| Unit | Existing public worked material | In-chapter assignments | Existing teacher-model responses | Provisional central MCQs | Source-certified complete original end exercise? |
| --- | --- | --- | --- | ---: | --- |
| 1 | 10 adapted numerical/example problems | 3 teacher-pack previews, original scan unmatched | 10 short + 4 comprehensive adapted/practice | 275 | No |
| 2 | 5 source-number-labelled teacher adaptations | Not individually indexed | 35 short + 15 comprehensive teacher answers, including 9/4 labelled textbook-related in teacher pack | 206 | No |
| 3 | 3 numbered adapted worked examples, 8 numbered worked numeral adaptations (teacher science pending) | Not individually indexed | 40-mark Sections B/C teacher OR paper | 220 | No |
| 4 | 4 existing numbered source-adapted examples 4.1–4.4 | Existing Assignment 4.4 source adaptation | 40-mark Sections B/C teacher OR paper | 640 | No |
| 5 | Adapted NBF Example 5.1 and one separate teacher-created resistive calculation | Not individually indexed | Teacher Section B 7 and Section C 2 OR pairs | 349 | No |
| 6 | 7 provisional *worked topic sections*, **not** 7 original numbered textbook examples | Not individually indexed | No separately source-numbered public original descriptive exercise bank | 560, public provisional preview | No |
| 7 | Three unscored introductory lessons, no separate publicly approved example set | Not publicly approved | Teacher-prepared 11 short, 8 comprehensive and 5 numericals are on hold in the current study intro, not released | 0 scored/active bank | No |

### Correct interpretation
- "No" in the final column means the current **public source index** does not individually certify a complete exact original NBF end-of-unit exercise in each of the four categories. It does **not** mean the teacher has prepared no exercise content elsewhere. Avoid overwriting or dismissing offline source packs.
- Central Test Builder practice MCQs are a separate independently provisional category, **not** automatically the book's End-of-Unit MCQs. Original verbatim printed exercise MCQs still require individual source/image/answer review.
- Unit 3 numericals include formative items; Unit 6 has independent situation MCQs but no true shared-stimulus groups; Unit 7 scored content/teacher signoff remains unpublished.
- Every link in the new public page must be to an existing public resource and labelled according to the source, never to protected teacher keys, login APIs or a forged textbook original.
- No new question, assessment, correct option, scientific solution, roster, Firebase rule, cloud grade, logo change, 59-item shared catalog entry or Unit 7 scored release.

## Student-facing deliverable
- New `portal/textbook-exercise-status-v216.html` is a public unit-aware resource directory with 7 unit panels and **4 separately named original end-of-unit pending categories** per unit (28 total). It displays only existing practice links and candid academic statuses, with no fabricated end-of-unit question text.
- New global drawer quick link and one per-unit **PREPARE** status shortcut in Units 1–6.
- The **planned** Unit7 future group gets one *informational status-only* shortcut, without converting it into a current available/unit-scored menu.

## Test coverage
Real Chromium at 1280/390/320, filter query `?unit=n` and `?unit=all`, exact 7 categories/links, 28 pending original exercise categories, visible sidebar status route for Unit1/6, future Unit7 no test-builder path, no horizontal overflow, no JS errors. Check the physical files exist and explicitly targeted anchors exist; preserve V140, V209, V215 regressions and original 2250-key identity.

**Green CI proves navigation, not a certified NBF exercise answer bank.** Original NBF textbook pages for each unit and teacher scientific/answer/fidelity decisions are required before changing source statuses.

## Merge checklist
Keep PR Draft until every current-head CI check is green. Then inspect five changed files → Ready for review → Merge → Confirm. Student test: Units & Resources → Unit1–6 → Prepare → Textbook Exercise Status; Unit7 in Next Units → status-only link; choose each unit. Read "Source check pending" in each original end-of-unit category, and confirm accessible adapted teacher practice links remain distinctly labelled.
