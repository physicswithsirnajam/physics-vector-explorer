# V134 — Unit 5 summative scenario HTML entities: distinguish encoded text from broken display

## Prerequisite and motivation

PR **#233/V133** merged on 24 November 2026 with both latest-head GitHub checks passing. Its original Unit1 MathML, Greek and superscript samples ran in real Chromium at 1280/390/320px; four selected examples were displayed, with 12 question-only screenshots for human review. Such sample QA is not individual teacher certification of all original 275 Unit1 questions.

The downloaded **V131** Grade XI source-ID audit scanned all **2,250** current provisional MCQs. It found exactly **eight** `ENTITY_IN_LITERAL_TEXT` warnings, *all* in **Unit 5, Topic 5.4 — Work-Energy Principle**. The warnings are located only in original `stimulusHtml` fields of two four-question scenarios:

| Scenario group | Original source question numbers | Original IDs | Original SLO & classification |
|---|---|---|---|
| `u05-t54-s2` | 61–64 | `g11-u05-master-t54-q061` through `q064` | `P-11-B-32`, `summative-theory` |
| `u05-t54-s6` | 77–80 | `g11-u05-master-t54-q077` through `q080` | `P-11-B-32`, `summative-theory` |

I inspected the source directly in `question-bank/grade-11/unit-05-master-topic-v59-317.json`: the alleged entity issue is an **HTML-encoded apostrophe** (`&#x27;`) in an ordinary word within each scenario paragraph. The source uses encoding deliberately to store valid HTML safely. This is not a missing scientific symbol or wrong MCQ choice, and it should **not** trigger automatic rewriting to raw unescaped source text. What matters is whether the original real student rendering function `setRich` decodes the entity to a readable apostrophe.

## Precisely scoped V134 visual check

New `scripts/test_grade11_v134_unit5_entity_rendering.cjs` loads **only the existing unchanged checked-in Unit5 317-item source master** and checks all eight original IDs, correct two complete four-question stimulus groups, exact original SLO/classification, matching stimulus string per group, and continued source SHA integrity.

Then Chromium opens the **real, unchanged student practice engine** and uses its exact production `setRich` safe rich-text renderer to create a **test-only** visible preview of the two original source stimulus strings. This does **not** forge a live session at those exact question IDs (the regular Test Builder limits a session to 60 questions and can select other source items). It accurately exercises the original browser parser and display code with real source values; QA-only elements are not persisted in the served page or repository.

For each of two paragraphs at **1280px, 390px, 320px**, check that `object&#x27;s` / `unit&#x27;s` source becomes a readable apostrophe `object's` / `unit's`, raw `&#x27;` never shows in the rendered text, the allowed paragraph is present and visible, no square/replacement glyph or horizontal overflow appears, no JavaScript exception occurs, and original source A–D practice still loads. Produce **six small screenshots of original public scenario text only** and an answer-free metadata-only review report.

### What this establishes—and what it does not

- Passing source and Chromium rendering checks means these **eight flagged Unit5 stimulus entries are most likely false-positive notation warnings**, not eight confirmed display problems. The relevant QA warning can be classified "encoded apostrophe decoded by safe renderer" in teacher review.
- It does **not** establish that the full eight-question sequences, all options and answer keys, original NBF calculations, print/PDF output, or all 349 public Unit5 MCQs are academically or visually perfect.
- The screenshots still need a teacher glance for natural spacing and readability. A DOM text assertion does not certify typography across all browsers.
- Other V131 warnings, particularly original Unit2 vector combining marks and Unit3 formative explanation powers, remain independent review candidates. V131 history stays immutable; this successor interpretation merely records source-backed false positives.

## Academic, privacy and scope safeguards

- **Exactly three new nonproduction files:** browser QA test, this quality rationale, dedicated GitHub Actions workflow.
- Original Grade XI provisional counts remain **275 / 206 / 220 / 640 / 349 / 560 = 2,250**; Unit5 has 349 public references including the 317-item master and 32 original supplementary Set A/B practice items.
- **No** question-bank JSON/B64, original stem, option, key, explanation, scenario, SLO, student-visible page, quiz runtime, grading, submission, score saving, source PDF, logo, watermark or security setting changes.
- Unit 6 **560** item-level academic signoffs **PENDING**, full course `planned` and formal graded assessment `not-published` remain preserved.
- Firebase/Auth/App Check, secure keys, accounts and the Copy-only student issue-report workflow remain untouched.
- CI reruns V131 full notation register, V128 source structural audit, V99i 2,250 frozen answer-free references, V94D Unit 6 nonrelease and V118 readiness/Copy-only assertions.

## Owner review and acceptance

Inspect **draft PR #234**: three QA-only files, no student-facing changes. Wait for all latest-head checks to pass before **Ready for review → Merge pull request → Confirm merge**. If a check fails, do **not** merge; correct the same branch. After green CI, download the `grade11-v134-unit5-encoded-stimulus-browser-evidence` Actions artifact and examine six original scenario-only screenshots. If correct, archive these eight warning IDs as **encoding false positives**, without editing any source; if actual problems are seen, record the exact group and width for a narrow follow-up.

**Quality principle:** a safe encoded HTML character is not a student-visible error unless the actual renderer displays it incorrectly.
