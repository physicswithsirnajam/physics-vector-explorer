# V137 — Grade XI notation QC evidence ledger and outstanding review register

## Why this milestone comes after V136

PR **#236/V136** was merged on **24 November 2026** and its **two latest-head workflows passed**. That review confirmed the exact original formative Unit 3 source notation was **`s^{-1}`**. The existing **V112** formatter already displays it as a correct superscript while preserving the source `textContent`; therefore, the initially proposed extra source-string rewrite was **fully reverted** before the PR was merged. The final V136 was an audit-only safeguard.

We now need one place to distinguish **tested source/rendering mechanisms** from **untested items** and **academic approval**. The 304 flags returned by V131 are mathematical *pattern candidates*, not 304 bad MCQs, and they are not answer-quality results. Repeatedly treating flags as errors could corrupt scientifically correct questions.

## Source-grounded reconciliation

The original V131 GitHub Actions artifact `grade11-v131-math-notation-triage/review-queue.json` contains **304 unique source IDs and 1,622 notation signals** across 2,250 provisional Grade XI MCQs. V137 reruns its trusted checked-in `buildReport` rather than copying the artifact's values blindly. It then checks evidence IDs against the actual checked-in QA scripts from V132–V136.

| Unit | Public original MCQs | V131 notation candidates | Selected for targeted *technical* follow-up | Not yet selected |
|---|---:|---:|---:|---:|
| 1 | 275 | 217 | **4** original MathML/Greek samples (V133) | **213** |
| 2 | 206 | 67 | **2** vector-arrow question screenshots and **1** explanation DOM check (V132) | **64** |
| 3 | 220 | 12 | **12** source/renderer mechanism checks (V135/V136), with only a few photographed symbols | **0** |
| 4 | 640 | 0 | 0 | 0 |
| 5 | 349 | 8 | **8** original source HTML-entity fields in two summative scenario groups (V134) | **0** |
| 6 | 560 | 0 | 0 | 0 |
| **Total** | **2,250** | **304** | **27** | **277** |

### What the classifications mean

- **Question screenshot sampled — 6 IDs:** Four Unit 1 questions and two Unit 2 vector-mark questions had screenshots taken at 1280px, 390px, and 320px; this is **not proof** that other flagged items or browsers render correctly.
- **Explanation DOM sampled — 1 ID:** Unit 2 original `XI-U02-MCQ-0019` had its combining vector mark checked in the post-submission explanation DOM, with no revealed-answer screenshot.
- **Source/rendering mechanism checked — 12 IDs:** V135 inspected the one original Unit 3 summative average-velocity overline and eleven separate formative caret-power candidate IDs. V136 then verified original `s^{-1}` superscript formatting on appropriate formative examples through the existing V112 renderer in real student review/feedback. **This does not mean each full explanation or its mathematical answer has been independently checked.**
- **Encoded entity decodes correctly in Chromium — 8 IDs:** All eight original Unit 5 stimulus fields contain intentionally encoded apostrophes. V134 rendered both original four-question scenario paragraphs through the real safe renderer and confirmed that `&#x27;` becomes a natural apostrophe at three widths. Treat these eight as **technical source-scanner false positives for the tested renderer**, not academic certifications.
- **Not yet targeted — 277 IDs:** Exactly **213 Unit 1** and **64 Unit 2** warning IDs have not been individually selected for these targeted follow-ups. This does not mean 277 proven display errors.
- **Zero V131 flags in Units 4/6:** Only the specific notation patterns were scanned. **It does not mean** all Unit 4/6 scientific symbols, figures, worked keys or printed layouts are correct.

**All 304 rows retain `teacherVisualSignoff: PENDING` and `individualScientificAnswerQc: NOT_DONE`.** This is intentional: passing a GitHub test or visually checking a small screenshot is not equivalent to original-NBF-content, alternative-answer and correct-option review.

## Safe teacher priorities before the 7 December 2026 exam

1. **P0 — Actual reported defects first.** When a student reports a missing option, an incorrect correct-answer choice, incomplete figure, or unreadable symbol, identify the precise unit and immutable question ID. Compare the actual student-facing item with the owner's original NBF textbook and notes. Record the original wording, the reason for change, whether amendment is **compulsory or optional**, and whether keeping the original plus an explanatory annotation is preferable. Never invent an answer or bypass source review.
2. **P1 — Highest direct vector-glyph risk.** Pick the next small subset among the **64** unselected Unit 2 arrow-bearing candidates and inspect the actual quiz and printable result on desktop/phone. The two V132 question screenshots are not full 67-question visual coverage.
3. **P1 — Risk-based Unit 1 MathML.** Triage the **213** Unit 1 candidates not yet selected: rich HTML in `stemHtml` and `option.html` is often valid, as V133 demonstrated, and should not be rewritten simply because the source contains math tags. Prioritize actual phone clipping and missing powers over benign markup.
4. **P2 — Do not duplicate working science presentation.** Retain the already source-fidelitous V112 exponent formatter and V134 safe-HTML apostrophe decoder. Keep Unit 3's **60 formative** questions excluded by the summative filter; do not "approve" them by typography.
5. **Release/security:** All **560** Unit 6 individual teacher approvals are **PENDING**, full course `planned`, graded examination `not-published`. Student issue report remains **Copy only**, without automatic teacher inbox. Other public worked keys are post-practice learning material, not confidential exams.

## V137 implementation and safety

This is a **three-file nonproduction PR**:

- `scripts/audit_grade11_notation_disposition_v137.cjs`: dynamically scan the current 2,250 *original* provisional public source records using trusted V131, require exact frozen 304 ID baseline, reconcile V132–V136 technical evidence by stable original ID, then produce `qa-artifacts/grade11-v137-notation-evidence-disposition/teacher-queue.json`.
- `scripts/test_grade11_notation_disposition_v137.cjs`: assert original per-unit candidates **217/67/12/0/8/0**, exact 27/277 evidence split, source-only field schema, honest pending statuses, original source-checksum invariants and no scientific approval.
- `.github/workflows/validate-grade11-v137-notation-evidence-ledger.yml`: run the source reconciliation and prior V131/V128/V99i/V94D/V118 safety gates, upload a safe answer-free teacher review queue.

**Artifact privacy:** The 304 rows expose only the original publicly known MCQ ID, unit, source question number, codes for scanned notation, technical follow-up class, evidence script version, and **PENDING** teacher/academic status. They exclude original question stems, options, correct letters, explanations, private textbook pages, student responses and credentials. No runtime code, original question bank, printed report, public portal, Firebase/Auth/App Check or academic approval flag is changed.

## Review and next substantive step

Keep PR **#237/V137** in **Draft** until all latest-head checks pass. Review Files changed (three nonproduction files). If any red, do **not** merge. Once green: **Ready for review → Merge pull request → Confirm merge**, then inspect the Actions artifact `grade11-v137-notation-teacher-review-ledger`.

After the review ledger, **the next change should resolve a genuine evidenced student-visible problem** or initiate original-source numerical/answer-key verification where textbooks are available, not another broad navigation or ungrounded notation rewrite. This register makes the remaining work explicit without mislabeling hundreds of healthy questions as defective.
