# V95-C2H — Grade XI Unit 6 Topic 6.2 MCQs 61–80: 20 standalone scenario scientific and source QC

**Review purpose:** Complete the **80 original teacher-prepared MCQ items in Topic 6.2** following independent confirmation that PR #112 was merged. This PR adds a per-question evidence addendum, a teacher-facing report and deterministic regression. It **does not change any original student-facing question, A–D option, answer key, explanation, figure, login code, graded assessment or course-release setting**.

## Actual material reopened for this review

- Owner-private prepared `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf` **compiled PDF pages 58–60**: all 20 original Q61–80 scenario stems and all 80 A–D options; **pages 63–64**: answer letters and one-line original explanations.
- GitHub source bank `question-bank/grade-11/unit-06-topic-62-v78-80-source.json` records `XI-U06-T62-MCQ-0061` through `0080`, independently compared after Unicode NFKC/whitespace normalization with PDF running headers/footers excluded.
- Verified comparison: **20/20 matching stems, 80/80 matching options and 20/20 matching answer letters**. Original letter sequence **`DDAADDADAAADDBDCABBD`**. Scientific explanations were critically reviewed for physical meaning, **not** assumed byte-exact.
- Official user-supplied FBISE `Physics_HSSC_I_model_paper_50_percent(5).pdf`, page **12**, was reopened: **P-11-B-41** (why real fluids are viscous) and **P-11-B-42** (viscous retarding force on moving objects) are **Summative/Understanding** outcomes. They do **not** automatically certify the individual original MCQs as final-paper eligible or at a specific Knowledge/Understanding/Application level.
- **Original printed NBF textbook pp.91–95 were NOT independently reopened.** Teacher-prepared textbook references, Figure 6.3, Figure 6.5(c), Table 6.1, illustrated timings and printed-caption fidelity are **PENDING original-source review**. Existing public figure link IDs are recorded, not asserted to be reverified against original print.
- All 20 are **individually written standalone scenarios**, `situationBased:true`, `stimulusSetId:null`, **zero true shared-stimulus grouped questions**. Q64 links `unit6-figure65c` and Q72 links `unit6-figure63`.

## Scientific review summary

| Review gate | Findings |
|---|---|
| Prepared-master stem / option / answer-key matching | **20/20, 80/80, 20/20** |
| Independent selected-answer physics check | **20/20 source best choices supported under specified assumptions** |
| Compulsory teacher nuance/printed-source decisions | **6: Q64, Q65, Q72, Q75, Q78, Q80** |
| Other optional explanatory/context checks | **14** |
| Compulsory answer-letter changes identified | **0** |
| Real shared-stimulus groups | **0** |
| Actual source NBF pp.91–95, figure caption and table fidelity | **PENDING** |
| Individual teacher SLO/cognitive/assessment certification | **PENDING** |

### Six compulsory teacher decisions before any official examination use

| Exact question source ID | Priority | Topic | Reason / scientific caution | Retain or change |
|---|---|---|---|---|
| **XI-U06-T62-MCQ-0064** | COMPULSORY_FIGURE_REVIEW | Figure 6.5(c) plateau and timing | Prepared-source question cites the before-canopy horizontal segment of Figure 6.5(c); a horizontal downward speed–time segment represents constant downward speed, not zero velocity. GitHub links unit6-figure65c, but the exact original printed NBF figure geometry, plateau position and caption have not been directly inspected in this review. | **Retain original A for provisional practice**; teacher should approve scope note or a separate clearer alternative before an exam. |
| **XI-U06-T62-MCQ-0065** | COMPULSORY_SOURCE_NOTE | Parachute time-since-jump and original textbook attribution | From stated values 42 s + 5 s = 47 s after jump, source D. The 42-second deployment and next 5-second transition are teacher-prepared textbook-attributed values; original printed NBF Figure/Example pp.91–95 is still unverified. This is approximate, not a separately timed measurement. | **Retain original D for provisional practice**; teacher should approve scope note or a separate clearer alternative before an exam. |
| **XI-U06-T62-MCQ-0072** | COMPULSORY_FIGURE_AND_AERO_NOTE | Figure 6.3 exact attribution and geese formation | Prepared master attributes energy/drag savings in V flight to NBF Figure 6.3; the existing public source refers to unit6-figure63. Exact printed figure/caption not directly inspected here. Benefits depend on positioning, wake/upwash interaction and roles; do not promise every bird always receives identical drag reduction. | **Retain original D for provisional practice**; teacher should approve scope note or a separate clearer alternative before an exam. |
| **XI-U06-T62-MCQ-0075** | COMPULSORY_WORDING_REVIEW | Viscosity comparison confounded by different fluid densities | Source answer D (half terminal speed) follows v_t∝1/η only when ALL other terms are fixed, especially sphere density, fluid density/buoyant density difference, radius, g and creeping-flow conditions. Saying only 'fluids of different viscosity' and 'same Stokes assumptions' does not explicitly fix density; different fluids may have different buoyancies. Clarify that equal other variables/identical fluid density are assumed before certified exam reuse. | **Retain original D for provisional practice**; teacher should approve scope note or a separate clearer alternative before an exam. |
| **XI-U06-T62-MCQ-0078** | COMPULSORY_MOTION_NOTE | Acceleration opposite current downward velocity | 900 N upward drag minus 700 N downward weight gives 200 N upward net force if no other vertical forces are significant. For a parachutist currently falling DOWN, upward acceleration DECREASES the downward speed; velocity does not become zero instantaneously. | **Retain original B for provisional practice**; teacher should approve scope note or a separate clearer alternative before an exam. |
| **XI-U06-T62-MCQ-0080** | COMPULSORY_TABLE_SOURCE_NOTE | Milk/ethanol viscosity data and units | Given teacher-master values η_milk=2.12 mPa·s and η_ethanol=1.144 mPa·s, ratio is 2.12/1.144≈1.85315≈1.85, original D. Both units cancel. Exact NBF Table 6.1 numbers and 20°C source attribution still need direct printed-textbook verification. | **Retain original D for provisional practice**; teacher should approve scope note or a separate clearer alternative before an exam. |

**Q75 is the highest-priority wording issue.** The phrase *fluids of different viscosity* doesn't ensure that fluid densities are identical. With buoyancy included, the creeping-flow result is `v_t=2(ρ_sphere−ρ_fluid)gr²/(9η)`. Even the prepared source's simplified `v_t∝1/η` calculation is a conditional comparison requiring all other relevant factors constant. Original **D** is still the intended answer, but **do not individually certify Q75 until the teacher clarifies the otherwise-held-constant conditions**, preferably with a separate alternative stem rather than overwriting the public original.

**Q64/65/72:** The prepared teacher compilation includes the reference to the time-speed figure, circa `42+5=47 s`, and geese formation figure, respectively. Do not conflate this with direct visual verification against the original printed NBF figures. Source answers remain A, D and D.

**Q78:** `F_net=900−700=200 N` upward. Because motion is still downward, that acceleration slows the descending speed; **upward force ≠ instantaneous upward travel**.

**Q80:** `2.12/1.144=1.853146853...` → `1.85`, a dimensionless ratio (the source unit `mPa·s` cancels). The exact figures stated for NBF Table 6.1 are not yet verified against original print.

## Complete per-question candidate-only SLO/cognition decisions

| Q | Original correct letter | Candidate topic SLO only | Tentative item cognition (NOT official certification) | Note priority |
|---|---|---|---|---|
| 61 | D | P-11-B-42 | Understanding | OPTIONAL |
| 62 | D | P-11-B-42 | Understanding | OPTIONAL |
| 63 | A | P-11-B-42 | Understanding | OPTIONAL |
| 64 | A | P-11-B-42 | Understanding | COMPULSORY_FIGURE_REVIEW |
| 65 | D | P-11-B-42 | Application | COMPULSORY_SOURCE_NOTE |
| 66 | D | P-11-B-42 | Application | OPTIONAL |
| 67 | A | P-11-B-41 | Understanding | OPTIONAL |
| 68 | D | P-11-B-41 | Understanding | OPTIONAL |
| 69 | A | P-11-B-41 | Understanding | OPTIONAL |
| 70 | A | P-11-B-42 | Understanding | OPTIONAL |
| 71 | A | P-11-B-42 | Understanding | OPTIONAL |
| 72 | D | P-11-B-42 | Understanding | COMPULSORY_FIGURE_AND_AERO_NOTE |
| 73 | D | P-11-B-42 | Understanding | OPTIONAL |
| 74 | B | P-11-B-42 | Understanding | OPTIONAL |
| 75 | D | P-11-B-42 | Application | COMPULSORY_WORDING_REVIEW |
| 76 | C | P-11-B-42 | Understanding | OPTIONAL |
| 77 | A | P-11-B-42 | Application | OPTIONAL |
| 78 | B | P-11-B-42 | Application | COMPULSORY_MOTION_NOTE |
| 79 | B | P-11-B-42 | Understanding | OPTIONAL |
| 80 | D | P-11-B-41 | Application | COMPULSORY_TABLE_SOURCE_NOTE |

Other sound model distinctions: terminal velocity is **nonzero** motion at **zero acceleration** (Q61, Q63, Q79), rapidly opening parachute imposes ordinary drag rather than Stokes' creeping flow (Q62, Q76), honey pouring is contingent on comparable geometry/driving head (Q67), typical warming makes common liquid less viscous and common gas more viscous (Q68–69), no fluid means no ordinary fluid drag (Q70), no relative motion gives zero *motion drag* but not zero buoyancy (Q71), smaller droplet generally has smaller **Stokes-model** terminal speed under validity conditions (Q74), and Q77 gives **8 N net downward** but does not establish instantaneous direction of velocity.

## Validation and release safeguards

- New `quality/grade11-unit06-v95c2h-topic62-mcq61-80-scenario-review.csv`: **20 unique original source IDs**, compiled PDF question/key pages, original key, figure links, per-ID physics note and priority, candidate-only SLO/cognition, printed NBF fidelity **PENDING**, per-item official certification **PENDING**, teacher approval **PENDING**.
- New `scripts/test_grade11_unit06_v95c2h_topic62_last20_scenarios.cjs` locks the original 20 stems, 80 options and 20 answer letters to fingerprint **`0xe417c728`**, asserts scenario-only classification and two figure IDs, tests Q65/Q66/Q77/Q78/Q80 arithmetic, six mandatory flagged issues, the full 560-item pending approval register and existing Unit6 release holds. The dedicated GitHub Actions workflow reruns the inherited V95-C2G through V94D regression suite.
- **Academic inspection progress:** Topic6.1 **80/80**, Topic6.2 **80/80** = **160/560** Unit6 MCQs inspected. All **560 teacher approvals in the original master register remain PENDING**, and individual original-NBF fidelity checks and SLO/cognitive assignment have not been signed off. **400 Unit6 questions remain outside this V95-C2 review**.
- The separately prepared 14 real NBF end-of-unit MCQs are **not** included in this provisional 560-item pool.
- The public 560 Unit6/2,250 GradeXI **provisional self-practice** records remain untouched; Unit6 136 standalone situations / **0** authentic common-stimulus groups; full Unit6 course is `planned`, formal assessment `not-published`, central signoff `releaseApproved:false`.

**Keep as DRAFT until latest-head GitHub Actions green and the teacher has reviewed Q64, Q65, Q72, Q75, Q78 and Q80.** Next review V95-C2I: Topic6.3 (Fluid Flow) MCQs 1–20, moving to the remaining topics in bounded academic-source review batches.
