# V128 — Grade XI MCQ quality-control triage: source completeness, suspect rendering and review backlog

**Scope:** Read-only teacher/CI report. This proposal is not a student feature, corrected question bank, published examination, authenticated issue inbox, automated scientific answer-key verification or human academic signoff.

## Why the roadmap changes here

PRs **#222–#227** improved the source-grounded Exam Quick Access routes from 43 to **55** and clarified that public worked keys are for review after practice. PR **#226** also repaired a real browser-regression filter reset; PR **#227** merged with **20 successful recorded workflows**. Further shortcut work provides diminishing returns before the **7 December 2026** first Physics examination.

The repository's older V118 source audit and original V55 student practice adapter verify the **structural existence** of all original Grade XI question stems, four labelled answer choices, a matching source key letter, explanation, and consistent complete shared-stimulus groups. They cannot prove an answer is scientifically correct, that a pasted symbol will render in every browser, that a question tests an official summative SLO, or that its figure really matches the NBF page. Student reports still require manually copying a report to the teacher; the portal does **not** receive submissions automatically.

## What V128 adds

Run `node scripts/test_grade11_mcq_triage_v128.cjs` in the trusted CI checkout. The new read-only offline audit `scripts/audit_grade11_mcq_triage_v128.cjs` loads the **existing**, checked-in V55 adapter with only local source-file reads (the same trusted approach used by the previously merged V99-G source catalog). It checks all **2,250** provisional MCQs from Units 1–6 against the previously signed ID-only manifest:

| Unit | Provisional MCQs | Academic distinction |
|---|---:|---|
| 1 | 275 | Existing public mixed practice; original independent QC still required |
| 2 | 206 | Public Vectors self-practice |
| 3 | 220 | Includes **60 formative** momentum MCQs; theory exam users must select the summative filter |
| 4 | 640 | Additional topic-level SLO candidates are not individually certified |
| 5 | 349 | Three figure-dependent master questions remain held, outside the 349 published |
| 6 | 560 | Provisional topic classification only, **individual** SLO/cognitive signoffs PENDING |
| **Total** | **2,250** | Not an academically approved full-syllabus question bank |

Automatic source integrity asserts the ID/source-question-number reference parity, question counts, nonempty stem, four nonempty A/B/C/D options, source correct-letter membership, and an explanation. In addition to these existing basic guarantees, it produces **advisory**, source-ID-only flags for: identical normalized option texts, Unicode replacement glyph **U+FFFD**, literal square glyph **U+25A1** that may indicate a missing mathematical/vector symbol, and unresolved literal template tokens. Such flags require human review: a square may be intentional, and *absence* of a flag does not mean the science or browser rendering is correct.

**Important:** The precise number of flags is not guessed or preapproved here. The latest GitHub Actions artifact `qa-artifacts/grade11-v128-mcq-triage/triage.json` contains actual results from the committed source. It contains only stable source IDs, source question numbers, unit numbers, signal codes/locations and aggregate counts — **no question texts, options, correct letters, explanations, private credentials or student responses**. Do not treat its zero/nonzero count as an academic certification.

## Immediate human-review work, prioritized

**P0 — Student-visible defects:** The teacher should visually test suspicious square/replacement glyphs, difficult formatted vectors/fractions, figure-based questions and a representative mobile/desktop quiz. For any real fault, identify exact Unit + question ID, compare with the owner's original NBF textbook and master/teacher key, decide compulsory/optional amendment and whether to preserve the original and add an explanatory version. This audit **does not** silently rewrite or normalize copyrighted/source material.

**P1 — Question/answer science:** Separately verify suspect answers, alternative option logic, calculations and stimulus dependencies. Technical A/B/C/D key membership does **not** prove that the selected option solves the Physics correctly. Reconcile the original student edition, corrected teacher key and official summative/formative framework rather than inferring an answer.

**P1 — Unit 6 release blockers:** Preserve the existing **65 teacher issue-register entries** (not a count of wrong answers) and all **560 PENDING item signoffs**. Units 6.1–6.7 public practice may continue with accurate provisional notices; full Unit 6 course, exact end-unit textbook exercise content, protected tests and graded exam must remain withheld until actual textbook-source, numerical, teacher and browser reviews pass. Original 6.9 numerical unit concern requires a verified student-facing decision, not an automatic repair.

**P2 — Feedback/review intake:** The existing `practice-engine/index.html` button **copies** an MCQ issue report; it has **no live teacher inbox** and cannot retroactively deliver the earlier two reports the owner tried. The student must paste the copied report into a teacher message. A future server-side, authenticated receipt/triage system should be designed separately with safe Firebase rules, App Check review, report retention/abuse controls and private data protection. Do not enable sending in this PR.

**P2 — Saving and public access:** Cloud saving remains limited to eligible individual Unit 1/Unit 2 self-practice; mixed-unit results are local/printable, and GitHub Pages keys remain public. Hiding keys until a click does not protect a secure exam.

## Technical safety and acceptance

- No bank JSON/B64, original figure, attached PDF, correct key, scientific reasoning, SLO label, student answer data, grading settings, Firebase/Auth/App Check, publication status, visible portal page, logo or print watermark is modified.
- Synthetic test cases prove the detectors recognize deliberately duplicated choices, lost glyphs and literal template placeholders, and do not flag a clean four-option example.
- Regression verifies source count and version parity, Unit 3 formative count **60**, Unit 6 provisional count **560**, teacher-register count **65**, Copy-only status, immutable protected-source checksums, and that the CI artifact does not contain original stems/options/correct answers.
- New GitHub Actions workflow reruns the existing V99i, V94D, V118 and V121 safety tests. All GitHub Actions evidence refers to the checked-out repository, **not automatically** the externally published site or real enrolled student sessions.

**Owner action:** Review this audit-only draft PR and its new CI artifact. Merge only after all latest-head workflow checks turn green. Then use the per-ID signals as a *teacher QC to-do list*, without auto-marking the bank approved. The next substantive PR should target one *verified* Physics-content defect or a clear student-visible rendering defect, with an original-source comparison and focused regression.
