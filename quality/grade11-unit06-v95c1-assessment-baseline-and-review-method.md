# V95-C1 — Unit 6 Assessment Baseline: 560-Item Review Queue and Seven-Topic Balanced MCQ Preview

**Change category:** Incremental assessment *self-practice preview*, not final source-key verification, an official FBISE exam or completed Unit6 release. Begun after independently confirming GitHub **PR #104 merged** into main.

## What was actually inspected before authoring

- Existing live central Test Builder `build-your-physics-test.html` and `practice-engine/index.html`: the central public practice engine already supports selecting Unit6 **560** provisional MCQs and mixtures with other units, but balanced multiunit selection balances between *units*, not guaranteed between all seven Unit6 *topics*. We do **not** modify the validated central engine or falsely describe its selection as a seven-topic assessment pattern.
- The precise **seven original public source archives** `question-bank/grade-11/unit-06-topic-{61…67}-*-80-source.json` were directly loaded from GitHub; **80 active MCQs per topic**, complete A–D options and source answer letters/explanations, **560** unique question IDs and source numbers; **136 standalone situation questions** (16 in Topic6.1 and 20 each in Topics6.2–6.7); **zero authentic shared-stimulus groups**. Six figure-referenced questions retain independently authored V93 diagrams:
  - `XI-U06-T61-MCQ-0011` → `unit6-figure62`
  - `XI-U06-T62-MCQ-0026` → `unit6-figure63`
  - `XI-U06-T62-MCQ-0064` → `unit6-figure65c`
  - `XI-U06-T62-MCQ-0072` → `unit6-figure63`
  - `XI-U06-T63-MCQ-0024` → `unit6-figure66`
  - `XI-U06-T63-MCQ-0080` → `unit6-figure66`
- Independent **structural** first pass checks: none has an empty stem, absent option, *exact* repeated A–D option text, missing answer letter, absent explanation or duplicated normalized stem across the seven topic banks. A naïve mathematical-symbol-stripping normalization falsely flags numerous different algebraic distractors; **do not change original mathematically distinct options**. This is **NOT independent physics correctness/key approval**. All 560 are explicitly `boardEligible:false`, empty per-item `sloCodes`, `cognitiveLevel:'Unspecified'`.
- Source status: teacher's private `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf` is a prepared question/lesson compilation. Previously merged V94 A–D and V94-C2 detailed source analyses do **not** certify all 560 item answers or printed-NBF fidelity. The additional **14** NBF-labelled end-of-unit textbook MCQs, separately audited in `quality/grade11-unit06-v94-end-unit-14-mcq-firstpass.md`, are **NOT included** in these 560 and must not be silently imported or called source-exact (especially image-dependent balloon Q11 and Stokes-limit Q3).

## Student-facing new assessment pathway (no existing source mutation)

**New `portal/unit-06-balanced-mcq-v95c1.html` + `.css` + `.js`:**

1. Load all seven original public source archives directly and **fail closed** on missing or inconsistent banks, option IDs/keys, missing explanation, unsafe figure reference, unexpected individual SLO/cognitive certification or a false grouped scenario claim.
2. Students select **4, 5, 6 or 8 questions from each topic**, yielding **28, 35, 42 or 56** MCQs with **exact seven-topic coverage** and no repeated source ID within a session. Options are always original **A/B/C/D**, in an accessible board-inspired *boxed* layout; we do **not** claim a pixel-identical official FBISE paper layout.
3. Selection modes: **all sections**, **at least one standalone situation from each topic**, or **standalone situations only**. “Standalone” means each situation has its **own context**, not an authentic four-question common-stimulus group. Students may mix topic order or group by topic.
4. Client-side local quiz: one question at a time, previous/next, answer persistence while navigating, mark-for-review flags, source figure cards reusing `PSNUnit6FigureCardV93`, then source correct letters and explanations displayed **only after submission**. Seven-row topic score table, full printed local review and reset for a fresh selection.
5. No browser `localStorage`, student profile, login, Firebase, analytics, upload, network calls beyond fetching the seven static public source banks, hidden instructor keys or cloud school marks. Source question text is set using `textContent`, not unsafe dynamic `innerHTML`.
6. Link new balanced assessment page from existing `portal/unit-06-learning-desk-v95a.html` header and end-of-unit consolidation area, **keeping the original central Test Builder path and all seven separate 80-item topic preview routes**.

## 560-row individual teacher-review queue

**New `quality/grade11-unit06-v95c1-560-item-review-queue.csv`:** one row for **every original MCQ ID and question number**, source PDF page, topic, source section, whether independent situation, source figure reference and **topic SLO candidates** clearly marked **NOT item-level certification**. Every row has separate status columns:

- `scientific_key_review = PENDING`
- `original_print_fidelity_review = PENDING`
- `individual_fbise_slo_review = PENDING`
- `individual_cognitive_review = PENDING`
- `teacher_approval = PENDING`

The ledger intentionally **does not duplicate copyrighted original stems, answer text or complete private teacher documents**. It does not copy or change existing public original key letters. The source ID takes the teacher to the exact existing bank record. Figure-specific items are explicitly surfaced for source comparison. Formula/phase/figure-risk notes are *triage suggestions*, not adjudications or automatic answer amendments.

## Teacher decision method for the next V95-C stages

Review answers **item by item** against prepared student notes, original NBF textbook where available and the official framework. For each proposed change, identify **item ID, error/ambiguity, mathematical or textual evidence, compulsory versus optional severity, and whether to keep the original and add a clearer alternative**. Only after the teacher accepts an issue should an amended variant be added; **never silently overwrite the source letter/option order**. Quantitative examples and image-dependent questions require extra scrutiny. SLO mapping must distinguish **P-11-B-39 Formative** from **B40/B44 Summative**, and separately judge each actual question; topic-level codes in the CSV are not individual certifications.

Once all 560 source items are checked, separately source-verify and decide whether/how to add the **14 textbook end-unit MCQs**, then prepare descriptive assessment materials and exactly scoped FBISE-pattern assessment. The current page is **MCQ-only** and **not an official 50% MCQ / 50% descriptive paper**. Original current Grade XI framework/pattern governs any later full board-style assessment, not this self-practice selector.

## Release-safe numerical and technical invariants

| Field | Before and after V95-C1 |
|---|---|
| Public Unit6 provisional MCQs | **560** (7 × 80) |
| Public all GradeXI provisional MCQs | **2,250** |
| Independent situation MCQs | **136** |
| True source shared-stimulus Unit6 groups | **0** |
| Educational image-referenced MCQs | **6**, original V93 illustrations retained |
| Unit6 status in `portal/learning-catalog.json` | **planned** |
| Full Unit6 course URL `portal/unit-06.html` | **absent** |
| Assessment course status | **not-published** |
| Teacher individual SLO/key/cognitive approvals | **all pending** |
| Student cloud grade recording by this page | **none** |
| Existing five original simulations and seven detailed lessons | **unchanged** |

**Next after teacher merges V95-C1:** V95-C2 item-by-item scientific and original source review in manageable batches, including the teacher's decision register, and then official section B/C assessment integration; V95-D original figures/rights, accessibility and teacher release approval. Do not start Unit7 or mark Unit6 finally released on the basis of this preview.
