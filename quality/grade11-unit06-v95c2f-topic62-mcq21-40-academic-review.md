# V95-C2F — Grade XI Unit 6 Topic 6.2 Q21–40 Conceptual Reasoning Academic Quality Review

**Review state:** PR #110 was confirmed merged before this work. Second batch of **20/80** Topic6.2 MCQs. This PR adds teacher-only decision evidence and immutable automated checks, **not** changes to original students' MCQ content, keys, explanations or any live assessment release flag.

## Sources actually reopened and exact comparison

- Owner-private `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, compiled **PDF pp.53–55** (Topic6.2 Section II, Q21–40, all stems and 80 A–D options) and **compiled PDF p.62** (matching 20 answer letters and explanations). The PDF was reread rather than trusting earlier review summaries.
- GitHub original `question-bank/grade-11/unit-06-topic-62-v78-80-source.json` records **`XI-U06-T62-MCQ-0021` through `0040`**.
- Independent PDF-text versus GitHub source Unicode NFKC and whitespace comparison, excluding PDF page furniture: **20/20 matching stems**, **80/80 matching options**, **20/20 matching source answer letters**. Source answer sequence **`DACBDDDBDBCCCCDADAAB`**. The prepared source's explanations were checked for scientific meaning, not byte equality.
- Original NBF Model Textbook printed pp.91–95 **were not directly reopened**; reported textbook/Figure6.3 claims remain original-print fidelity **PENDING**. The prepared PDF contains teacher-authored practice, not evidence of verbatim NBF exercises.
- Independently reopened teacher-supplied official `Physics_HSSC_I_model_paper_50_percent(5).pdf` **framework PDF page 12**: **P-11-B-41** “Explain why real fluids are viscous fluids” and **P-11-B-42** “Describe how viscous forces in a fluid cause a retarding force on an object moving through it,” both **Summative / Understanding**. This is topic-level classification only; **not proof every individual MCQ meets Understanding**.

## Scientific answer review

Original selected letters Q21–40 are **all supported** within the stated/simplified models, **zero mandatory answer-letter corrections identified**. Five questions require explicit teacher decisions or explanatory qualifications before board-certified reuse; fifteen have optional per-item comments.

| Gate | Outcome |
|---|---|
| Prepared-master source matching | **20/20 stems, 80/80 options, 20/20 original answer letters** |
| Original key sequence | **`DACBDDDBDBCCCCDADAAB`** |
| Original letter choices supported by independent physics | **20/20** in indicated model/conditions |
| **Compulsory context/figure/model/force teacher notes** | **5**: Q21, Q26, Q31, Q35, Q40 |
| Optional per-item model/cognitive notes | **15** |
| Original source keys/stems/options altered | **0** |
| Original NBF printed 91–95 image / captions verified | **No** |
| Candidate-only official SLO and cognition | **Not teacher certified** |

### Compulsory teacher note/decision register

| Exact source ID | Priority | Issue | Scientific reason / teacher decision |
|---|---|---|---|
| **XI-U06-T62-MCQ-0021** | COMPULSORY_CONTEXT_NOTE | Honey flow depends on controlled geometry and head | More viscous honey tends to drain more slowly than water under otherwise comparable conditions, but the word 'mainly' implicitly assumes comparable cup tilt, fill level, temperature and driving pressure; viscosity is not a stand-alone universal flow-rate predictor. **Teacher option:** retain original answer **D** and explanatory scope note; only create a revised question/alternative after approval. |
| **XI-U06-T62-MCQ-0026** | COMPULSORY_FIGURE_SOURCE_NOTE | V-formation figure and intended drag benefit | The prepared teacher source states geese in V-formation can reduce aerodynamic effort; the original GitHub bank references unit6-figure63. Claim of what the original printed NBF Figure 6.3 exactly shows/captions requires printed image verification. Aerodynamic saving depends on relative positions/upwash, not merely group shape. **Teacher option:** retain original answer **D** and explanatory scope note; only create a revised question/alternative after approval. |
| **XI-U06-T62-MCQ-0031** | COMPULSORY_MOTION_NOTE | Upward net force slows a still-descending parachutist | Immediately after deployment, upward drag may temporarily exceed downward weight, giving upward acceleration while the parachutist is STILL moving downward; source answer C does not imply upward instantaneous motion. Real parachute drag cannot be computed via Stokes small-sphere law. **Teacher option:** retain original answer **C** and explanatory scope note; only create a revised question/alternative after approval. |
| **XI-U06-T62-MCQ-0035** | COMPULSORY_MODEL_NOTE | Sphere-density doubling and neglected buoyancy | The source's simplified v_t∝ρ_s scaling gives D (double) only when the buoyant-density subtraction is neglected. With buoyancy included, v_t∝(ρ_s−ρ_f) and doubling ρ_s does NOT generally double v_t. Preserve source D for the explicitly simplified model only. **Teacher option:** retain original answer **D** and explanatory scope note; only create a revised question/alternative after approval. |
| **XI-U06-T62-MCQ-0040** | COMPULSORY_FORCE_NOTE | Net force gives acceleration, not immediate travel direction | Weight larger than upward drag gives a downward resultant and thus downward acceleration IF other vertical forces/buoyancy are negligible. It does not alone prove an object was already moving downward or is instantly at constant speed. **Teacher option:** retain original answer **B** and explanatory scope note; only create a revised question/alternative after approval. |

**Physics distinctions central to this batch:**

- **Q26 V-formation and Figure6.3:** the prepared source supports D as its intended answer; lift/upwash and group aerodynamics, not just a generic reduction in viscosity, explain energy savings. The GitHub question references original figure ID `unit6-figure63`; exact printed NBF figure/caption attribution is not certified by this review.
- **Q31:** a parachutist descending at speed can experience *upward acceleration* (upward resultant) without instantly reversing downward velocity. Opening a real parachute also leaves the small-sphere Stokes regime.
- **Q32–35:** the prepared source's simplified `v_t=2ρ_sgr²/(9η)` assumes buoyancy negligible and low-Reynolds flow; more complete creeping-flow expression is `v_t=2(ρ_s−ρ_f)gr²/(9η)`. The teacher-source answer for Q35 **D (doubles)** is supported only under its explicitly simplified density model. The exact general formula predicts ratio `(2ρ_s−ρ_f)/(ρ_s−ρ_f)`, not universally 2.
- **Q36–39:** doubling diameter doubles radius (`r²×4`); equal-density sphere mass `m∝r³` (`×8`); Stokes drag `F_d∝r` (`×2` at fixed η and v), **three distinct scaling laws**.
- **Q40:** when buoyancy is neglected and no additional vertical force is significant, `W>F_d` gives **downward acceleration**; no inference about the instantaneous sign of velocity is needed.

### Source-by-source teacher queue (official item levels remain provisional)

| Source MCQ | Original key | Tentative topic SLO | Tentative cognitive level | Review priority |
|---|---|---|---|---|
| Q21 | D | P-11-B-41 (candidate only) | Understanding | COMPULSORY_CONTEXT_NOTE |
| Q22 | A | P-11-B-41 (candidate only) | Understanding | OPTIONAL |
| Q23 | C | P-11-B-42 (candidate only) | Understanding | OPTIONAL |
| Q24 | B | P-11-B-42 (candidate only) | Understanding | OPTIONAL |
| Q25 | D | P-11-B-42 (candidate only) | Understanding | OPTIONAL |
| Q26 | D | P-11-B-42 (candidate only) | Understanding | COMPULSORY_FIGURE_SOURCE_NOTE |
| Q27 | D | P-11-B-42 (candidate only) | Understanding | OPTIONAL |
| Q28 | B | P-11-B-42 (candidate only) | Understanding | OPTIONAL |
| Q29 | D | P-11-B-42 (candidate only) | Understanding | OPTIONAL |
| Q30 | B | P-11-B-42 (candidate only) | Understanding | OPTIONAL |
| Q31 | C | P-11-B-42 (candidate only) | Application | COMPULSORY_MOTION_NOTE |
| Q32 | C | P-11-B-42 (candidate only) | Understanding | OPTIONAL |
| Q33 | C | P-11-B-42 (candidate only) | Application | OPTIONAL |
| Q34 | C | P-11-B-42 (candidate only) | Application | OPTIONAL |
| Q35 | D | P-11-B-42 (candidate only) | Application | COMPULSORY_MODEL_NOTE |
| Q36 | A | P-11-B-42 (candidate only) | Understanding | OPTIONAL |
| Q37 | D | P-11-B-42 (candidate only) | Understanding | OPTIONAL |
| Q38 | A | P-11-B-42 (candidate only) | Knowledge | OPTIONAL |
| Q39 | A | P-11-B-42 (candidate only) | Application | OPTIONAL |
| Q40 | B | P-11-B-42 (candidate only) | Understanding | COMPULSORY_FORCE_NOTE |

Even if the whole official topic is **Summative / Understanding**, source Q33–35 and Q39 may demand *Application* of quantitative proportionality, while recall/formula questions can be *Knowledge*. Retain `sloCodes:[]`, `cognitiveLevel:'Unspecified'`, `boardEligible:false` until individual verification and approval.

## Regression, pending signoff and release controls

- Individual teacher evidence **`quality/grade11-unit06-v95c2f-topic62-mcq21-40-academic-review.csv`** contains **20 unique original IDs**, prepared PDF pages, source keys, notes and priorities, candidate-only SLO/cognition, Q26's reference figure ID, and all teacher decisions **PENDING**.
- Deterministic test **`scripts/test_grade11_unit06_v95c2f_topic62_second20_academic.cjs`** locks original stems/80 options/20 answer letters with fingerprint `0x18db33e7` and checks Q26 figure reference, meaningful physics equations, 5 flagged notes, the full 560-row approval queue and original publication/signoff status. Dedicated GitHub Actions workflow also runs inherited V95-C2E/C2D/C2C/C2B/C2A/V95C1/V94D tests.
- Overall progress after this **source comparison and scientific inspection**: Topic6.1 **80/80**, Topic6.2 **40/80**; Unit6 **120/560** inspected, **440** still outside V95-C2 scope. **All 560 teacher approvals remain PENDING**; separately collected 14 original textbook end-unit MCQs remain outside the reviewed 560.
- No new authentic common-stimulus groups are asserted; global Unit6 currently has **136 separate situations**, **0 shared-stimulus groups**.
- Unit6 academic course remains **`planned`**, assessed lesson **`not-published`**, source practice MCQs **560 Unit6 / 2250 GradeXI** public provisional and the teacher signoff for full release **false**.

**Draft PR only** until current-head CI is green and teacher has considered Q21/Q26/Q31/Q35/Q40. Next planned review: **V95-C2G Topic6.2 Q41–60**, independently validating Stokes-law numericals, units, rounding and physical applicability before the final 20 scenario items.
