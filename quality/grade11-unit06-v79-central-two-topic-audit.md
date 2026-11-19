# V79 — Grade XI central Test Builder, Unit 6 Topics 6.1 and 6.2 (partial, source-preserving)

## Baseline and incremental scope
Following verified V78 merge into `main`, add **77 public Topic 6.2 (Viscous Drag and Terminal Velocity)** MCQs to the existing **79 public Topic 6.1 (Upthrust and Archimedes’ Principle)** MCQs in the central Test Builder. Both datasets are reused directly from the original source archives introduced in V76 and V78; source files are neither duplicated nor edited.

- Released full-unit bank totals **275 + 206 + 220 + 640 + 349 = 1,690** from Grade XI Units 1–5 (unchanged).
- Partial Unit 6 bank: **79 + 77 = 156** MCQs.
- Grade XI central public self-practice total: **1,846** MCQs.
- The source archives retain all **160 original Topic 6.1/6.2 questions** and printed answers; **four questions remain held** (6.1 Q11, 6.2 Q26/Q64/Q72) pending NBF textbook Fig. 6.2 / Fig. 6.3 / Fig. 6.5(c) context review. All 156 are newly verified as eligible for *provisional public practice*, not certified theory examination questions.

## Academic guardrails
Official FBISE framework marks topic SLOs **P-11-B-33 and B-34** as Summative / Application, and **P-11-B-41 and B-42** as Summative / Understanding. No individual original question has independently verified SLO or cognitive tags: all central U6 MCQs still have `sloCodes:[]`, `boardEligible:false`, `cognitiveLevel:Unspecified`, `difficulty:Unspecified`, `assessmentClassification:summative-topic-provisional`.

The source Situation questions are **standalone questions**: 16 from Topic6.1, 18 from Topic6.2. There are **zero complete common-stimulus groups** in Unit6, so Unit6-only or all-six-unit scenario-only arrangements fail closed rather than fabricate group context. Grouped mode may combine complete older-unit scenarios with independent Unit6 questions.

NBF simplified Stokes relations used in Topic 6.2 remain bounded by slow-flow spherical assumptions; the terminal-speed derivation neglects buoyancy. No implication of general parachute or fast-raindrop predictive validity.

## Access, grades and full-unit status
This is a **public** self-practice expansion. Unit6 `status:planned` and whole-unit `questionBankCount:0` remain unchanged; new `partialTestBuilderMcqCount:156` is separate. The full Unit6 course, source notes PDF, academic certification, Firebase entitlements and cloud-save permissions remain unchanged. Questions and answer keys are public; they are not secure examination data. Score saving remains disabled for Unit6 and mixed-unit practice.

## Changes
Existing read-only central bank adapter now validates and loads both archived 80-record source banks, checks each key and each original figure hold, preserves all source explanation/option text and distinct identifiers, and returns the 156 eligible records. Test Builder and Practice Engine receive a cache-bumped adapter and accurate labels. Manifest, course-catalogue and Learning Hub reflect the partial scope and 1,846 tally, without marking Unit6 fully available.

Historical V54–V78 integrity checks are updated only where their expectations need to distinguish the immutable old five-bank subtotal and the new sixth partial-bank count. New `scripts/test_grade11_unit06_central_v79.cjs` verifies source fidelity, all 1,846 IDs, four figure holds, 34 standalone situations, mixed-unit plans, fail-closed scenario and SLO filters, no cloud save, and mobile UI in Chromium.

**Merge only if all required GitHub Actions checks on the latest commit pass.** Teacher then validates Unit6-only 20-MCQ practice, Unit1+6 grouped mode, all-six-unit random mode, and reviews a Topic6.2 numerical answer.
