# V77 — Central Grade XI Test Builder, Unit 6 Topic 6.1 partial-bank integration

## What this PR actually publishes
The **79 already-public, V76 source-preserved Topic 6.1 MCQs** are now eligible for selection by the central Grade XI Test Builder, either as Unit 6-only practice or in multiunit tests with previously released Units 1–5. The original V76 80-question archival source remains unchanged: NBF Figure 6.2-referencing **Q11 is still withheld**; the 16 real-life situations are **standalone items**, not shared four-question stimulus groups.

**Before:** 275 + 206 + 220 + 640 + 349 = **1,690** questions in Units 1–5.  
**After:** 1,690 + 79 = **1,769** public self-practice MCQs across five full unit banks and one *partial Unit 6 Topic 6.1 bank*. **Unit 6 overall is still planned**, not academically complete; its other six topics, 14 textbook MCQs and full master study notes are not published in this PR.

## Academic truthfulness
The actual uploaded FBISE HSSC-I framework lists B-33/B-34 at **Summative / Application at the topic level**. The V76 original source did NOT individually certify all 80 questions against those SLOs/cognitive levels. Therefore Unit 6 central items retain `sloCodes: []`, `cognitiveLevel: Unspecified`, `difficulty: Unspecified`, `boardEligible: false` and `assessmentClassification: summative-topic-provisional`. They are eligible under the Test Builder's broad **All learning outcomes** practice scope only; strict Summative, SLO-specific, and specified-cognitive/difficulty filters fail closed until academic audit. Do not portray these as certified FBISE items.

## Scenario integrity and exact selection
- Unit 6 has **zero verified common-stimulus groups**. U6-only *Scenario sets only* is not allowed, and any six-unit scenario-only test is rejected with a clear reason.
- Existing Units 1–5 keep their original 24, 15, 17, 48 and 26 verified-structure group counts, respectively.
- **Mixed grouped mode** can combine an intact scenario from an older unit with independently self-contained Unit 6 questions; six-unit random mode includes at least one question from each selected unit.
- The existing per-unit breakdown in the Practice Engine includes Unit 6. Scores are self-practice, not official exams, and **Unit 6/mixed results do not write to Firestore** (save remains allowlisted only for eligible original Units 1–2).

## Changes
- Source-verified Unit 6 adaptation in `shared/practice-bank-adapter-v55.js` checks original 80-source letter sequence, Q11 hold, no per-item SLOs, 16 independent situations, 79 live items and exactly zero shared-stimulus sets.
- The existing planner supports six selected banks while retaining group-completeness safeguards.
- Test Builder and Practice Engine accept `?unit=6` or `?units=1,6`; `?unit=7` and duplicate selection still fail closed.
- Partial bank recorded in `question-bank/manifest.json`, and course catalogue has separate `partialTestBuilderMcqCount: 79` while keeping Unit 6 `status: planned` and `questionBankCount: 0` for its **unreleased full unit**.
- Signed-in Learning Hub gains a direct Unit6 Test Builder link alongside the V76 standalone practice page. Existing 59 public study resource records, 31 original simulations + 9 enhanced labs, YouTube links, Firebase records and legacy Google Sites stay unchanged.

## Verification
Dedicated `scripts/test_grade11_central_v77.cjs` validates 1,769 unique IDs; all five prior unit counts; 79 active Unit 6 items with original Q11 hold and source metadata; six-unit allocations; group-only rejection; SLO/cognitive filter caution; real Chromium browser student practice and per-unit results, 390px mobile, and no unauthorized result saving. Historical workflows are minimally updated to test their original five-unit baselines using the first five manifest rows while checking the additional sixth preview row separately.

**Do not merge** until all required GitHub Actions on final PR head are green. Then manually open the signed-in Learning Hub, select Unit6 Test Builder, run a 20-question session, run Units 1+6 in grouped mode, and confirm scenario-only selections involving Unit6 are blocked.

No NBF textbook source scans or confidential original notes were uploaded to GitHub, no new Firebase backend access was granted, and no paid-access claims are made.
