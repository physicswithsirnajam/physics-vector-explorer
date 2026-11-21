# V95-C2O — Topic 6.4 MCQs 41–60 Independent Numerical and SLO QC

**Branch based on confirmed PR #119 merge.** Teacher evidence only: no original student-facing stems, options, letters, explanations or release settings changed.

## Reopened sources and fidelity
- Teacher-private compiled `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, **PDF pp.142–144** (20 stems/80 A–D options), **p.149** (20 source letters/explanations).
- Direct bank: `question-bank/grade-11/unit-06-topic-64-v82-80-source.json`, Q41–60; original letter sequence **`ABCDACBDBDADABBDCBAA`**.
- **18/20 stems** matched literally under NFKC/whitespace normalization; **Q45 and Q53** had superscripts detached by PDF text parsing, but the rendered PDF pages were inspected and correctly display both source stems. Therefore **20/20 stems reconciled**, **80/80 option texts matched**, **20/20 original answer letters matched**.
- Official teacher-supplied FBISE framework p.11: **P-11-B-36 Summative/Application**, **P-11-B-37 Summative/Understanding**, **P-11-B-38 Summative/Application**; all individual per-question mapping remains **unapproved**.
- **Actual original printed NBF pp.96–99, especially Example 6.3 and Figure 6.7, were not available for visual verification.** Teacher-provided photos are requested; the compiled master is not proof of textbook-exact attribution.

## Independent calculations
All **20 selected numeric values recalculate** in the source model, **but Q51 and Q52 are not uniquely determined as written without assuming equal branch flow**. Hence no selected letter change is proposed, but the two items must remain on hold for certified examination use until clarified.

| Q | Source letter | Independent calculation | Result | Original selected option |
|---|---|---|---|---|
| 41 | A | 6/3×2 | 4 | 4 m s-1 |
| 42 | B | 4×10^-4 × 3 | 0.0012 | 1.2 × 10-3 m3 s-1 |
| 43 | C | 2×10^-3 / 5×10^-4 | 4 | 4 m s-1 |
| 44 | D | 12×10^-3 / 60 | 0.0002 | 2.0 × 10-4 m3 s-1 |
| 45 | A | 3×10^-3 × 40 | 0.12 | 0.12 m3 |
| 46 | C | (4/2)^2 × 1 | 4 | 4 m s-1 |
| 47 | B | 8×(1/2)^2 | 2 | 2 m s-1 |
| 48 | D | 800×0.002/(1000×0.001) | 1.6 | 1.6 m s-1 |
| 49 | B | 2/1000 | 0.002 | 2 × 10-3 m3 s-1 |
| 50 | D | 3×(2×10^-4)×1.5 | 0.0009 | 9 × 10-4 m3 s-1 |
| 51 | A | (2×5)/(2×1) assuming equal split | 5 | 5 m s-1 |
| 52 | D | (.8/.4)^2×.33/30 assuming equal split | 0.044 | 0.044 m s-1 |
| 53 | A | (.8/.2)^2×.40/16 | 0.4 | 0.40 m s-1 |
| 54 | B | 10/2×.6 | 3 | 3.0 m s-1 |
| 55 | B | 15×10^-3/5 | 0.003 | 3 × 10-3 m3 s-1 |
| 56 | D | .008×.25 | 0.002 | 0.002 m3 s-1 |
| 57 | C | 10^-3/(2.5×10^-4) | 4 | 4 m s-1 |
| 58 | B | 1000×.004×1.5 | 6 | 6 kg s-1 |
| 59 | A | .006/.003 | 2 | 2 m s-1 |
| 60 | A | 1.2×.010×10/(1.5×.008) | 10 | 10 m s-1 |

## Eight compulsory teacher reviews

| MCQ | Priority | Scientific or FBISE issue |
|---|---|---|
| **44** | COMPULSORY_SLO_SCOPE_NOTE | 12 L/min=2×10^-4 m³/s. Accurate conversion, but this alone does not solve the two-section continuity equation specified by official B36. |
| **45** | COMPULSORY_SLO_SCOPE_NOTE | V=Qt=0.12 m³. The PDF visual shows correct superscript despite detached PDF text extraction. This is rate-times-time practice, not independently a B36 continuity problem. |
| **48** | COMPULSORY_COMPRESSIBLE_SCOPE_NOTE | v2=1.6 m/s from rho1 A1 v1=rho2 A2 v2, requiring steady one-inlet/outlet flow without storage, leaks or branches; not universally valid for unsteady compressible systems. |
| **49** | COMPULSORY_SLO_SCOPE_NOTE | Q=mass-rate/density=0.002 m³/s; a valid dimensional calculation but it does not alone justify continuity as the conservation-of-mass principle in official B38. |
| **51** | COMPULSORY_UNDERDETERMINED_BRANCH_SPLIT | Question gives two equal-area 1 cm² branches but does not explicitly say discharge divides equally. Continuity fixes v_a+v_b=10 m/s, allowing e.g. 3 and 7; each 5 m/s (option A) is conditional only. Clarify equal discharge or symmetric flow before certifying. |
| **52** | COMPULSORY_PRINT_AND_EQUAL_SPLIT_NOTE | 0.044 m/s assumes identical discharge to all 30 arteries; equal radii alone do not force equal flow. Printed NBF Example6.3 has not been inspected. Teacher must check its exact statement and approve any equal-split clarification before exam use. |
| **55** | COMPULSORY_SLO_SCOPE_NOTE | 15 L in 5 s gives 3×10^-3 m³/s. Correct volume/time problem, not by itself the two-section continuity relation in official B36. |
| **58** | COMPULSORY_SLO_SCOPE_NOTE | Mass-rate=rho Av=6 kg/s. Correct formula substitution but does not independently justify the mass-conservation relation expected by B38. |

**Q51 underdetermination:** an inlet of 2 cm² at 5 m/s has total area-weighted flow 10 cm²·m/s. Two outlet branches of area 1 cm² each satisfy `v_a+v_b=10 m/s`; equal area alone does not require equal discharge, e.g., 3 and 7 m/s also conserve mass. Source choice **A (5 m/s each)** assumes equal division, which should be explicit in an amended stem.

**Q52 printed-book and flow-split conditions:** the prepared source invokes “NBF Example 6.3.” If the 30 arteries each have radius 0.4 cm AND equal discharge, `v=(0.33/30)(0.8/0.4)²=0.044 m/s`, original **D**. But equal radii alone do not guarantee equal flow. Verify printed example wording before proposing a teacher-approved wording improvement.

**Q45 and Q53:** the printed compiled PDF actually has the right superscripts; no typo corrections should be made to these bank stems.

**Q44/Q45/Q49/Q55/Q58:** correct individual conversion or mass/volume-rate arithmetic may be supporting practice rather than direct proof of official B36/B38 summative Application-level SLO achievement. Individual mapping and approval are pending; keep provisional self-practice intact.

**Q48/Q60:** mass-flow continuity for a compressible fluid requires a steady no-accumulation, one-inlet/one-outlet model; a changing-density flow cannot simply cancel `ρ` without justification.

## Protected evidence and course status

- Addendum `quality/grade11-unit06-v95c2o-topic64-mcq41-60-numerical-review.csv`: 20 unique source IDs, source pages, original option/letter, independently calculated numerical value, eight decision priorities, per-item physics note, provisional SLO/cognition and printed-NBF/teacher signoff **PENDING**.
- Script `scripts/test_grade11_unit06_v95c2o_topic64_num41_60_academic.cjs` locks original 20 stems/80 options/20 keys with fingerprint `0xb3339fcd`, checks numerical values, Q51 unequal-split counterexample, all eight teacher flags, 560 pending central reviews and course/exam release holds. Dedicated workflow reruns inherited validations.
- **Review progress: 300/560 Unit 6 MCQs academically inspected** = 80/80 in 6.1, 80/80 in 6.2, 80/80 in 6.3 and 60/80 in 6.4. **260 remain uninspected**; none is individually teacher certified and all 560 central teacher approvals are PENDING.
- Full Unit6 course `planned`, formal assessment `not-published`, 560 Unit6/2250 GradeXI provisional self-practice MCQs; 136 standalone situations, 0 authentic shared-stimulus groups. The 14 separately maintained actual NBF end-unit exercise items remain out of scope. The earlier Q28 truncation flagged in PR #119 remains a separate source-correction decision and is not silently edited here.

**Keep DRAFT until latest-head CI passes and teacher reviews eight flags, especially Q51/Q52.** Next V95-C2P: Topic6.4 Q61–80 standalone real-world scenarios.
