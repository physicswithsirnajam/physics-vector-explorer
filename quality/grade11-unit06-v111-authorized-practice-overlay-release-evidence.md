# V111 — Teacher-authorized safe practice overlay for four Unit 6 Topic 6.4 MCQs

**Decision/authorization:** On 23 November 2026, the teacher explicitly authorized the exact four V109/V110 treatments: correct missing word in Q28 option B, preserve original source records for Q51/Q52/Q67, make separately identifiable clarified equal-flow practice variants, prevent the ambiguous original versions from being selected in public practice, and **leave item-level SLO/cognitive/official exam approval pending**.

## Source archive versus student practice

The existing **80-question** `question-bank/grade-11/unit-06-topic-64-v82-80-source.json` is preserved **byte-for-byte** under the same historical Git blob SHA `c832e1e0e71773a23e5364e8f065c6b520f7f5e6`. This includes the historical source-import truncation in Q28 option B. V95-C2N/O/P and V109/V110 historical source audits therefore remain reproducible, without rewriting evidence.

The separate `question-bank/grade-11/unit-06-topic64-v111-approved-practice-overlay.json` is **authorized for public provisional learning use only**. Every student practice entrypoint obtains the original 80 source questions, validates original records, and applies exactly four controlled changes:

| Source number | Public student-practice ID | Actual student-facing treatment | Intended letter |
|---|---|---|---|
| 28 | `XI-U06-T64-MCQ-0028` (correction of original ID) | Finish B with **“per second”**; other options and stem unchanged | B |
| 51 | `XI-U06-T64-MCQ-0051-V111` | Explicit **equal volume flow through both outlets**; original 0051 excluded from practice | A |
| 52 | `XI-U06-T64-MCQ-0052-V111` | Original NBF Example 6.3 **numerical data** and result retained; original 0052 excluded; author-written equal-discharge model stated | D |
| 67 | `XI-U06-T64-MCQ-0067-V111` | Explicit **equal volume flow through each of 50 branches**, incompressibility; original 0067 excluded | A |

Each practice record retains `sourceOriginalId`, `sourceQuestionNumber`, original source/section metadata, preserved A/B/C/D and correct letter, and distinct `practiceOverlayVersion:"V111"`. All 80 are still active *in the practice copy*; every item remains `boardEligible:false`, individual `sloCodes:[]`, `cognitiveLevel:"Unspecified"`, and `status:"provisional-public-self-practice"`. The 560 central student-practice count is **unchanged**, with three originals replaced by three new stable variants (not duplicated or silently served). The original teacher-prepared bank **and source history remain public** for provenance; this exclusion applies to quizzes/Test Builder, not to an auditor requesting the archived raw JSON URL.

**Source nuance for Q52:** Original printed NBF Grade XI pp.98–99 Example 6.3 has the numerical givens and idealized printed result 0.044 m/s, independently checked in V95-C2S. The extra "equal volume flow" wording is teacher-authored scientific clarification; never advertise it as verbatim NBF original exercise text.

## Routes protected by the one shared read-only transformation

- `portal/unit-06-topic-64-preview.html`: load original archive plus overlay, validate original 80, then show only the safe 80-item practice copy. If overlay unavailable or invalid, practice disabled.
- `portal/unit-06-balanced-mcq-v95c1.html`: seven-topic 28/35/42/56-quiz selection loads all seven original source banks, then safely replaces Topic 6.4's four review items before random selection. No shared-stimulus groups are invented.
- `build-your-physics-test.html` and `practice-engine/index.html`: use the existing `shared/practice-bank-adapter-v55.js` central loader. Its Unit 6 branch validates all original banks, then **requires** the V111 overlay and applies the same `applyUnit6Topic64PracticeOverlay` pure helper. The central 560-item selection never exposes Q51/52/67 original IDs.
- Exact script cache versions are raised to `v=111` for all entrypoints; no stale cached central adapter accidentally omits the correction.

The helper rejects overlay missing/invalid/wrong source archive, answer/key mutation, altered A–D options, missing equal-flow condition, forged exam certification, absent corrected word, duplicate IDs and any attempt to restore the blocked original IDs. This **fail-closed** behavior is deliberate even if it temporarily disables Unit 6 self-practice while GitHub Pages assets deploy; avoid quietly falling back to incorrect data.

## Historical regression migration

The original V79/V81/V83/V85/V87/V89 source-to-central equality tests are intentionally updated to distinguish **raw source archive equality for the other 556 items** from **four known authorized student-practice substitutions**. The source archive/author-letter checks, original V95-C2N/O/P evidence, and legacy V109/V110 historic source checksum tests remain intact.

V95-C1 balanced browser test accepts the explicitly labelled V111 practice variants while retaining the seven-topic/situation counts, original source numbers, correct-letter scoring and prohibited exam certification. CI also includes actual Chromium at 1280, 390 and 320 pixels, all-80 direct quiz review, real balanced quiz, central adapter through Practice Engine, missing-overlay fail-closed, source hash and opposite-branch conservation counterexamples.

## Approval boundaries not crossed

- The teacher's **narrow practice-text authorization** does not approve item-by-item official FBISE SLO/cognitive classification, final scientific key certification for the entire bank, textbook-figure rights or graded exam use.
- All **560** central academic approval queue entries remain PENDING, even for these four items; `quality/grade11-unit06-v94d-signoff-matrix.json` retains `releaseApproved:false`.
- `portal/learning-catalog.json` retains Unit 6 `planned` and assessment `not-published`. No board-certified question pool or official exam release is enabled.
- No Firebase, App Check enforcement, Firestore, student data, teacher key privacy, PDF watermarks, branding or unrelated units changed.

## Owner validation after green CI, review and merge

1. After all latest-head Actions checks pass, mark PR Ready for review, review the files, merge and confirm.
2. Wait for GitHub Pages deployment to complete before opening `/portal/unit-06-topic-64-preview.html`.
3. Select **All questions** and submit local practice, then inspect review: Q28 option B ends **per second**; Q51/Q52/Q67 are explicitly equal-flow; original ambiguous Q51/Q52/Q67 are not displayed. The topic still has **80** provisional questions.
4. Open `/portal/unit-06-balanced-mcq-v95c1.html`; confirm seven-topic practice and obvious provisional status.
5. Open `/build-your-physics-test.html?unit=6`; confirm the central Unit 6 self-practice pool remains **560**. No official-exam claim.
6. Check print/PDF watermark independently where relevant; this PR never changes printer source or logos.

**Next high-priority academic work:** Continue the Unit 6 compulsory teacher-decision queue by scientific risk (Topic 6.5 flow qualifiers, Topic 6.6 head/wing model, Topic 6.7 graphic and source scope), with independently reviewed and owner-approved small candidate packs. Unit 7 begins only after satisfactory Unit 6 teacher-approved release criteria.
