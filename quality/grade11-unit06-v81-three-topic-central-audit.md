# V81 — Grade XI central Test Builder: Unit 6 Topics 6.1–6.3 (partial, source-faithful)

## Baseline and proposed integration
Following merged V80, reuse the untouched `question-bank/grade-11/unit-06-topic-63-v80-80-source.json` (original 80 Topic6.3 *Fluid Flow* questions, answer letters and explanations). Add exactly **78 previously released separate-preview questions** to the central mixed-unit practice builder.

- Units 1–5: **275 + 206 + 220 + 640 + 349 = 1,690** original public MCQs, untouched.
- Unit6 Topic6.1 (Upthrust & Archimedes): 79; Topic6.2 (Viscous Drag & Terminal Velocity): 77; Topic6.3 (Fluid Flow): **78**.
- Partial Unit6: **234** MCQs. All six supported Grade XI banks: **1,924**.
- The separate three topic source archives preserve all **240 original MCQs**. **Six figure-dependent items remain held**: T6.1 Q11/Fig6.2, T6.2 Q26/Q72/Fig6.3 and Q64/Fig6.5(c), T6.3 Q24/Q80/Fig6.6. No figure was silently invented or original question corrected.

## FBISE source and skill boundaries
The owner-uploaded official FBISE framework explicitly classifies topic **P-11-B-35** (steady/streamline/laminar, incompressible and non-viscous ideal flow) as **Summative / Knowledge + Understanding**. Topic6.1 B-33/B-34 (Summative / Application) and Topic6.2 B-41/B-42 (Summative / Understanding) remain source facts. **None** of the individual original questions has an independently certified per-item SLO or cognitive label. Therefore `sloCodes:[]`, `boardEligible:false`, `cognitiveLevel:'Unspecified'`, `assessmentClassification:'summative-topic-provisional'` remain unchanged; strict per-SLO or board-mode selections cannot falsely include these public items.

The 53 available original situation-style MCQs in Unit6 (16 + 18 + 19) are **independent standalone items, not shared four-question stimulus groups**; Unit6 has zero common-stimulus sets. Scenario-only mode involving Unit6 fails closed. Existing fully grouped scenarios in Units1–5 retain their integrity. Introductory source conflations of steady and laminar flow are flagged in the V80 archived source metadata and separate preview; they are not silently converted into new physics questions.

## Course status and student data
This is an incremental **public self-practice bank**, not a secure examination or official board-certified key. The course catalogue retains Unit6 `status:'planned'`, `questionBankCount:0` for unreleased **complete Unit6**, and separately announces `partialTestBuilderMcqCount:234`. The other Unit6 topics and full owner source PDF stay unreleased. No Firebase/Auth rules, existing student progress, course entitlements, payment, cloud-save policies, previous PDFs/notes, or legacy Google Sites are modified.

## Tests
`scripts/test_grade11_unit06_central_v81.cjs` validates 1,924 unique IDs, exact original source options/keys, the old 1,690 subtotal, 79+77+78 source splits, six holds, 53 standalone situations, no synthetic shared stimuli, six-unit planning, strict filter block, mobile and local grading. Earlier V54/V55/V56/V57 and V69–V80 tests are updated only where the sixth partial bank's new count changes the current expected total; they still explicitly protect the original 1,690 first-five-unit subtotal and archive-source fidelity.

**Do not merge until all required GitHub Actions checks pass on the final PR HEAD**. After merge, confirm 234 Unit6 questions, 509 combined Unit1+6, 1,924 all-six, and independent scenario/SLO filter safeguards.
