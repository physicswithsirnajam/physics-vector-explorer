# V95-C2P — Grade XI Unit 6 Topic 6.4 Q61–80: scenario/scientific/source QC

**Review scope:** Final 20 questions of Topic 6.4 (Equation of Continuity). Confirmed PR #120 merged before opening this branch. This is **teacher-facing academic evidence, a per-item QC register and automated regression only**. No source question, correct answer letter, A–D option, explanation, public figure or course/assessment release setting is edited.

## Source evidence reopened
- Private teacher-prepared `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, compiled **PDF pp.145–147** for 20 original Q61–80 scenario stems and 80 A–D options, and **p.150** for 20 original correct letters/one-line explanations.
- Public GitHub `question-bank/grade-11/unit-06-topic-64-v82-80-source.json`, original Q61–80. Unicode NFKC and whitespace comparison yielded **19/20 stems directly matching**; the remaining **Q68** had an incorrectly extracted (not incorrectly printed) exponent `s⁻¹`. The **rendered PDF page 146 was visually inspected** and matches the original GitHub Q68 stem. Therefore **20/20 stems reconciled, 80/80 options matched and 20/20 original answer letters matched**, key sequence `ACAAADABDAADCAABCDCD`. Source one-line explanations checked for meaning, **not** asserted byte-exact.
- Official owner-supplied `Physics_HSSC_I_model_paper_50_percent(5).pdf`, assessment framework p.11: **P-11-B-36 Summative/Application** (solve continuity problems); **P-11-B-37 Summative/Understanding** (explain squeezing end of rubber pipe); **P-11-B-38 Summative/Application** (justify mass continuity). Individual teacher-written MCQs are **not automatically certified** by topic classification.
- Actual original printed **NBF XI pp.96–99 including Example6.3/Figure6.7 were NOT directly reopened**. Textbook fidelity, particularly how the aorta-to-30-arteries example treats equal flow distribution, remains pending original page photos and teacher approval.
- All 20 items are **standalone scenarios** (`situationBased:true`, `stimulusSetId:null`), **not grouped/common-stimulus items**; none has an attached GitHub figure ID in this tranche.

## Results

| Check | Outcome |
|---|---|
| Prepared-master stems/options/answer letters | **20/20 reconciled, 80/80 match, 20/20 match** |
| Existing source-selected best answer | **20/20 defensible with conditions noted; none authorizes automatic graded exam release** |
| Compulsory answer-letter changes | **0** |
| Required teacher source/wording/SLO reviews | **7: Q66, Q67, Q73, Q74, Q77, Q78, Q79** |
| Other per-question optional context notes | **13** |
| Printed NBF Example6.3 figure/text verified | **No — PENDING** |
| Individual SLO/cognition and teacher approval | **PENDING** |

### Seven compulsory teacher decisions

| Original source ID | Priority | Scientific/assessment issue | Exact rationale and disposition |
|---|---|---|---|
| **XI-U06-T64-MCQ-0066** | COMPULSORY_EXAMPLE_AND_SPLIT_REVIEW | Aorta / thirty arteries Example 6.3 | Source D says total branch area is larger and is the best offered explanation, but the specific 0.044 m/s speed for EACH branch requires approximately equal discharge among all 30 arteries, not merely equal sizes. The printed NBF Example 6.3 radii, diagram and equal-split assumption have not been verified; require page image and teacher approval. **Original D stays unchanged for provisional practice.** |
| **XI-U06-T64-MCQ-0067** | COMPULSORY_UNDERDETERMINED_BRANCH_SPLIT | Fifty equal-size vessels but no equal discharge | Flow conservation and equal branch radii only constrain the SUM of 50 discharge rates, not each branch's velocity. Source A 0.40 m/s follows only if equal discharge is expressly assumed. Other distributions with distinct branch velocities also satisfy continuity. Add an equal-split condition before individually certified exam use. **Original A stays unchanged for provisional practice.** |
| **XI-U06-T64-MCQ-0073** | COMPULSORY_BRANCH_AREA_NUANCE | Aggregate outlet area versus speed in each artery | Comparing the aorta with the SUM of all branch cross-sectional areas is appropriate to compare aggregate transport; option C remains best. Inferring a particular speed for EACH artery additionally needs a specified distribution of flow, often equal splitting, which should be clarified alongside original Example 6.3. **Original C stays unchanged for provisional practice.** |
| **XI-U06-T64-MCQ-0074** | COMPULSORY_LEAK_UNIT_CLARITY | 1 L per second versus volumetric leak rate | Upstream 5 L/s minus downstream 4 L/s gives a leak RATE of 1 L/s; option A says 1 L, which is correct as the amount escaping DURING each one-second interval as asked, but is not itself a rate unit. Teacher should decide whether to retain that precise wording or produce a separate improved rate-question option reading 1 L/s; do not silently change original A. **Original A stays unchanged for provisional practice.** |
| **XI-U06-T64-MCQ-0077** | COMPULSORY_STEADY_LOCATION_WORDING | One-location temporal change ambiguous under steady condition | Numerical ratio (0.40/0.10)×0.5=2.0 m/s supports source C at equal discharge. But 'at one location in a steady channel, flow area decreases' may indicate a time-varying geometry at a fixed location, conflicting with steady flow during transition. Rephrase as two different channel sections, or distinct steady before/after states at constant Q, before exam certification. **Original C stays unchanged for provisional practice.** |
| **XI-U06-T64-MCQ-0078** | COMPULSORY_SLO_SCOPE_NOTE | Kinematic displacement not an independent continuity calculation | Δx=vΔt=2×0.50=1.0 m, source D correct. The problem uses single-element motion rather than mass conservation or the area–speed continuity equation; don't automatically certify as an application of P-11-B-36. **Original D stays unchanged for provisional practice.** |
| **XI-U06-T64-MCQ-0079** | COMPULSORY_SLO_COGNITIVE_NOTE | Units of Av are supportive, not application-level continuity | A[m²]×v[m/s] yields volumetric flow m³/s, so source C correct. This units/definition recognition is Knowledge-level supporting practice, not by itself a B-36 Summative/Application problem. **Original C stays unchanged for provisional practice.** |

### Especially important item-quality findings

**Q66 and Q67 — branching ambiguity:** The prepared aorta Example6.3 describes 30 equal-size arteries, and option D rightly identifies the *combined* branch cross-sectional area. But even when all branches have the same size, a specific speed in **each** branch is **not** uniquely determined unless equal discharge is stipulated. **Q67** gives one original source radius 1 cm, 50 equal-radius branches each 0.1 cm and inlet speed 0.20 m/s. Under an explicitly *equal-flow* split, each branch speed is `(1/50)×(1/0.1)²×0.20=0.40 m/s` (original A). Without equal discharge, an array of branch speeds can satisfy conservation. Keep source option A in provisional practice but mark the item underdetermined for official exam certification. **Q71**, by contrast, explicitly says “split equally,” so Q71's 9/3=3 L/min is fully determined.

**Q73 — aggregate versus individual speeds:** The combined outlet area is the correct quantity to compare to inlet area, but individual artery speeds also depend on how blood discharge divides among arteries. Original C remains the best of four offered.

**Q74 — unit/wording nuance:** `5 L/s−4 L/s=1 L/s` of leakage. The question asks amount escaping **each second**, so option A `1 L` can legitimately denote the amount during that second, but it must not be mislabeled as a rate unit. If reframed as “what is the rate of leakage?”, answer should instead read `1 L/s`. This is a wording/units refinement, **not a compulsory answer-letter change**.

**Q77 — single-location versus steady-state wording:** If “at one location” means area changed **over time**, the transition would contradict a strictly steady state while changing geometry. The intended ratio `0.40/0.10×0.5=2.0 m/s` is sound for two sections in one steady fixed-Q stream, or two separately established steady states with unchanged Q. The original C remains the intended choice but is not uniquely justified by its imprecise wording; clarify before exam use.

**Q78/79 — candidate individual FBISE scope:** `Δx=vΔt=2×0.50=1.0 m` is kinematics prerequisite rather than a continuity problem, and `[Av]=m³/s` is Knowledge/units recognition rather than official B36's Application demand. These remain valuable self-practice, but individual summative SLO and cognitive certification must be withheld.

**Q61–65, Q68–72, Q75–76, Q80:** Their source answers are supported with appropriate fixed-throughput, no-leak, density or geometry conditions. In particular Q69 correctly rejects incompatible steady equal-area speeds, Q70 includes side inflow, Q72 conserves density-weighted mass flux, and Q76 uses diameter-squared scaling.

### Individual candidate-only SLO/cognitive ledger

| Q | Original letter | Candidate topic SLO | Tentative cognitive level | Review priority |
|---|---|---|---|---|
| 61 | A | P-11-B-37 | Application | OPTIONAL |
| 62 | C | P-11-B-37 | Understanding | OPTIONAL |
| 63 | A | P-11-B-36 | Understanding | OPTIONAL |
| 64 | A | P-11-B-36 | Application | OPTIONAL |
| 65 | A | P-11-B-38 | Application | OPTIONAL |
| 66 | D | P-11-B-36;P-11-B-38_possible | Understanding | COMPULSORY_EXAMPLE_AND_SPLIT_REVIEW |
| 67 | A | P-11-B-38 | Application | COMPULSORY_UNDERDETERMINED_BRANCH_SPLIT |
| 68 | B | P-11-B-38 | Application | OPTIONAL |
| 69 | D | P-11-B-38 | Understanding | OPTIONAL |
| 70 | A | P-11-B-38 | Application | OPTIONAL |
| 71 | A | P-11-B-38 | Application | OPTIONAL |
| 72 | D | P-11-B-38 | Application | OPTIONAL |
| 73 | C | P-11-B-36;P-11-B-38_possible | Understanding | COMPULSORY_BRANCH_AREA_NUANCE |
| 74 | A | P-11-B-38 | Application | COMPULSORY_LEAK_UNIT_CLARITY |
| 75 | A | P-11-B-36 | Understanding | OPTIONAL |
| 76 | B | P-11-B-36 | Application | OPTIONAL |
| 77 | C | P-11-B-36 | Application | COMPULSORY_STEADY_LOCATION_WORDING |
| 78 | D | P-11-B-36_supporting | Application | COMPULSORY_SLO_SCOPE_NOTE |
| 79 | C | P-11-B-36_supporting | Knowledge | COMPULSORY_SLO_COGNITIVE_NOTE |
| 80 | D | P-11-B-36 | Application | OPTIONAL |

## Evidence and course restrictions
- `quality/grade11-unit06-v95c2p-topic64-mcq61-80-scenario-review.csv`: all 20 original source IDs, PDF question/answer page and original key, Q68 visual superscript exception, source option count, 7 priorities, scientific context notes, **candidate-only** SLO/cognition, original print/source teacher certification **PENDING**.
- `scripts/test_grade11_unit06_v95c2p_topic64_last20_scenarios.cjs`: exact original 20-stem/80-choice/20-key snapshot fingerprint `0x57ded990`, all 20 scenario flags/zero grouped stimuli, Q67 underdetermination counterexample, numeric Q61/Q65/Q68/Q71/Q74/Q76/Q77/Q78/Q80, seven teacher gates, all 560 central pending approvals and inherited release safeguards. Dedicated Actions workflow reruns V95-C2O through V94D.
- **Progress after this academic review: Topic6.1 80/80 + Topic6.2 80/80 + Topic6.3 80/80 + Topic6.4 80/80 = 320/560 Unit6 MCQs academically inspected**, **240 other MCQs remain**, none individually certified; all **560 central teacher approvals remain PENDING**. Separate 14 original textbook end-unit exercises are out of scope. Original provisional self-practice bank `560 Unit6 / 2,250 GradeXI`, with `136` standalone situation questions and `0` authentic shared-stimulus groups remains unchanged. Full course `planned`, formal assessment `not-published`, central release approval false.
- Earlier Topic6.4 Q28 one-word option B truncation, identified in merged PR #119, remains **separately documented and not edited** in this PR; Q51/Q52 branching source issues from PR #120 also remain under teacher review.

**Keep DRAFT until latest-head CI green and teacher reviews seven items, especially Q67/Q77.** Next V95-C2Q: begin Topic6.5 Q1–20, preserving the same source/physics/SLO validation discipline.
