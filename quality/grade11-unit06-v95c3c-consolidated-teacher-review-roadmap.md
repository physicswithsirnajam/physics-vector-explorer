# V95-C3C — Unit 6, 560-MCQ Consolidated Teacher Decision Register and Certification Roadmap

**Stage:** First-pass academic inspection complete. **This PR is administrative/teacher-facing only.** It does not change any student questions, answer letters, explanatory content, textbook images, portal access, course publication, exam release, or individual teacher approvals.

## Direct repository evidence reviewed after PR #133
- `PR #133` merged on 21 November 2026, completing the final Topic 6.7 MCQ 61–80 audit.
- The 28 source-review CSVs in `quality/` cover all 560 provisional questions from Topics 6.1–6.7, once each. **216 are marked compulsory teacher decisions** and **344 optional teacher notes**. The values below are *flags for decisions*, **not 216 incorrect answers**.
- The authoritative `quality/grade11-unit06-v95c1-560-item-review-queue.csv` still has **560 PENDING** scientific key, printed-source, individual FBISE SLO, cognitive and teacher approval fields.
- `question-bank/manifest.json`: provisional **560 Unit 6 / 2,250 Grade XI**, **136 standalone situations**, **0 genuine shared-stimulus groups**, `perQuestionSloVerified:false`, `exactFbiseModeReady:false`.
- `portal/learning-catalog.json`: the full Unit6 course remains `planned`, formal graded assessment `not-published`; signoff matrix `releaseApproved:false`.
- The **14 original NBF end-unit textbook MCQs** remain a separately sourced pool outside the teacher-prepared 560 provisional practice items.

## One register, seven topics

| Topic | First-pass inspected | Compulsory decisions | Optional notes |
|---|---:|---:|---:|
| 6.1 | 80 | 22 | 58 |
| 6.2 | 80 | 19 | 61 |
| 6.3 | 80 | 20 | 60 |
| 6.4 | 80 | 30 | 50 |
| 6.5 | 80 | 35 | 45 |
| 6.6 | 80 | 38 | 42 |
| 6.7 | 80 | 52 | 28 |
| **Total** | **560** | **216** | **344** |

The accompanying deterministic script **parses every one of the 28 existing review CSVs**, correlates its question ID to exactly one row of the existing 560-row central review queue, checks category counts against this report, and generates a unified **560-row teacher decision register CSV** as a downloadable GitHub Actions artifact. The generated register contains original ID, topic/question, review classification and raw teacher finding, evidence file, and explicit **PENDING** decision fields. **Generated fields are suggestions/workflow fields, not student bank certifications.** Source review CSVs and the authoritative central approval ledger are intentionally left unchanged.

## Proposed teacher-review sequence

### Phase 1 — Establish consolidated decision register (this PR)
1. Produce a 560-row source-indexed teacher-facing register, grouped by topic and review flag; preserve links to each original review file and its exact question ID.
2. Confirm no missing/duplicated question IDs, all 216 compulsory vs 344 optional notes, and **560 central approvals PENDING**.
3. Classify each compulsory issue by actual intervention type; **not all 216 imply wrong or defective science**: many require SLO/cognitive review or extra textbook assumptions.

### Phase 2 — Highest-impact source repair, teacher-approved
Prioritize **scientifically materially under-specified or visibly incomplete** originals before general formatting:
- Topic6.4 **Q28** truncated source option B. Validate against owner's original prepared master and printed NBF context before proposing an exact replacement.
- Topic6.4 **Q51/Q52/Q67** equal branch-discharge / equal geometry assumptions that change numerical or conceptual uniqueness.
- Topic6.5 **Q61/Q67/Q78** ideal/incompressible flow qualifiers.
- Topic6.6 **Q43** ambiguous *pressure head* versus *velocity head*; **Q57/Q58/Q80** printed supersonic 450/410m/s wing-lift exercise—retain source arithmetic but explicitly separate ideal textbook model from physically compressible real flow.
- Topic6.7 **Q24/Q61** answers that name a phenomenon while stems ask for physical causes; **Q38** helium expansion-cooling context; **Q74** phase coordinates without identifying pressure/temperature axes.
**For each item:** mark compulsory or optional, state the scientific reason, decide whether to *keep original and add a new improved item* versus amend it, capture teacher signoff and run source-preserving regression. Never silently replace source content.

### Phase 3 — Original textbook figures and student display
- Inventory figure-dependent questions (NBF Figures 6.10, 6.13, 6.14, 6.16, 6.17, etc.) with missing `referenceFigureId` or other student rendering gaps.
- Confirm accurate, readable lawful figures, actual question/figure linkage, projector and mobile accessibility; if image use is unavailable, propose a teacher-approved self-contained textual variant.
- Do **not** infer that inspecting the owner's private original scan automatically makes that figure available to public students or legally reusable.

### Phase 4 — Individual FBISE SLO/cognitive classification
- Map every individual question, not just topic, to exact official framework SLO and Formative/Summative; confirm Knowledge/Understanding/Application as actually assessed by the stem.
- Examples of boundary checks: standalone continuity `P-11-B-36` versus Bernoulli `B-40`, formative `B-39` versus application `B-44`, and superfluidity `B-43 Summative/Understanding` versus isotope-temperature/unit-conversion textbook enrichment.
- Preserve useful Knowledge/enrichment questions in clearly labelled **practice-only** pool instead of trying to force all 560 into a formal-examination-eligible bank.

### Phase 5 — Assessment authoring and learning value
- Certify only teacher-approved, summative-theory eligible and cognitively appropriate items for official FBISE-pattern test generation.
- Create **genuine multi-item shared-stimulus groups**, since current **136 are standalone situations and zero are genuine common-stimulus sets**; original source questions should remain intact unless separately approved.
- Check exact FBISE MCQ boxed display, four options/OMR, accessible figures, correct explanations, numerical units, sample tests, practice/feedback mode, and balanced SLO/cognitive distribution. Separately retain the original 14 NBF end-unit textbook MCQs.

### Phase 6 — Controlled release and scaling
- Final teacher signoff and automated content regression on the approved assessment subset; no automatic approval of all 560.
- Only after all release gates are intentionally changed by a **separate explicitly approved PR**, publish formal graded assessment/course modes.
- Then scale the same review/figure/assessment pipeline to other Grade XI units, Grade IX resources and interactive simulations without conflating provisional practice with certified board preparation.

## Safety and teacher governance
- This PR **does not amend** the 560 original centralized teacher approvals or the previously merged 28 academic reports.
- Generated CSV columns `teacher_decision`, `individual_exam_certification`, and `source_edit_authorized` remain `PENDING`, `PENDING`, `NO`, respectively.
- The register is generated only as a **CI artifact**; it is not a rewritten authoritative approval ledger. Any future approval must be traceably entered via explicitly reviewed teacher-authored changes to the proper authority.
- All existing portal and academic safety gates must stay in the non-release state while decisions are pending.

**Next implementation PR after this consolidation:** V95-C3D — first *teacher-approved* source repair pack starting with Topic6.4 Q28 and Q51/Q52/Q67 (preserve original evidence, propose exact deltas, update only after signoff). When new source material or exact NBF figure crops are needed, request specific original page images rather than assuming they are available.
