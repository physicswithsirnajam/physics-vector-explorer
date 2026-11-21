# V95-C2M — Grade XI Unit 6 Topic 6.4 Equation of Continuity, MCQs 1–20 Academic Source and Scientific QC

**Scope:** First 20 original teacher-prepared MCQs of Topic6.4; PR #117 independently verified merged before branching. This PR adds a per-item evidence register, teacher report and deterministic regression. **It does not modify source MCQs, A–D options, correct-answer letters, original explanations, figures, public portal, student data, course releases or graded assessments.**

## Reopened material (precise source distinction)

- Owner-private teacher-prepared `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, **compiled PDF pp.137–139** for Q1–20 original stems and **80/80 option texts**, and **p.148** for original Q1–20 answer letters and explanations.
- Independently re-read GitHub `question-bank/grade-11/unit-06-topic-64-v82-80-source.json`, exactly Q1–20. Unicode NFKC and whitespace normalization (excluding prepared-PDF page headers/footers) yielded **20/20 matching stems, 80/80 matching options, 20/20 matching answer letters**. Original key sequence **`BBCCACCCBCACBADDCBCC`**. Prepared explanations were critically checked for meaning, **not asserted byte-exact**.
- Reopened owner-supplied **official** `Physics_HSSC_I_model_paper_50_percent(5).pdf`, framework PDF **p.11**: **P-11-B-36 Summative / Application** (“Use equation of continuity to solve problems”); **P-11-B-37 Summative / Understanding** (explain squeezing a rubber pipe and increased velocity); **P-11-B-38 Summative / Application** (justify continuity as conservation of mass). These three are **topic-level SLOs**, not automatic individual K/U/A or exam certification for these introductory questions.
- The **original NBF printed Physics XI pp.96–99 and original Fig.6.7 were NOT directly reopened**. Do not confuse the teacher-prepared PDF's textbook attribution with exact printed fidelity. No original textbook imagery or private assets are republished.
- Q14 references `Fig. 6.7` in its stem but has **no attached `referenceFigureId`** in the public bank. The question is readable without an image, but the exact original figure/caption attribution requires teacher visual verification before any certified figure-based use.

## Findings

| Evidence gate | Status |
|---|---|
| Prepared-master questions/options/key | **20/20 stems; 80/80 options; 20/20 source letters** |
| Source-selected letter scientifically supported | **20/20** within steady one-inlet/outlet or branching conditions as stated |
| Source answer-letter amendments identified | **0** |
| Compulsory teacher source/model/cognition/scope notes | **8:** Q2, Q5, Q6, Q8, Q9, Q14, Q18, Q20 |
| Optional per-item context notes | **12** |
| Original printed NBF pp.96–99 / Fig.6.7 directly verified | **No — PENDING** |
| Individual FBISE question/specific K/U/A and teacher approval | **PENDING** |

### Eight compulsory teacher decisions (NOT answer-letter errors)

| Original source ID | Priority | Finding | Teacher note / retain-vs-amend |
|---|---|---|---|
| **XI-U06-T64-MCQ-0002** | COMPULSORY_MODEL_SCOPE_NOTE | General two-section relation assumes steady single-throughflow without sources or storage | The source B ρ₁A₁v₁=ρ₂A₂v₂ is steady mass conservation for one inlet, one outlet, no accumulating mass, and mean normal speeds. It is not universal for pipes with leaks, storage, branching or unsteady flow; retain the intended simplified assumptions. **Keep original source answer B** and hold individual exam certification pending teacher approval. |
| **XI-U06-T64-MCQ-0005** | COMPULSORY_MEAN_VELOCITY_NOTE | Flow-rate speed is cross-sectional average normal component | The source A is scientifically right when v denotes mean normal speed across section: Q=Av. Nonuniform real profiles require integration of local normal velocity or its cross-sectional average, not an arbitrary point speed. **Keep original source answer A** and hold individual exam certification pending teacher approval. |
| **XI-U06-T64-MCQ-0006** | COMPULSORY_COGNITIVE_SCOPE_NOTE | Unit of Av versus B-36 Application | [Av]=m²·m/s=m³/s, correct C; however this is dimensional recall/knowledge, not automatically a direct application of the continuity equation meeting the official B-36 cognitive demand. Keep as prerequisite practice. **Keep original source answer C** and hold individual exam certification pending teacher approval. |
| **XI-U06-T64-MCQ-0008** | COMPULSORY_COGNITIVE_SCOPE_NOTE | kg/s is foundational mass-rate knowledge | The correct source option C is kg s⁻¹ for mass flow rate. This is a definition/unit recall question; the official B-38 summative target requires justification/application, so do not automatically certify cognitive alignment. **Keep original source answer C** and hold individual exam certification pending teacher approval. |
| **XI-U06-T64-MCQ-0009** | COMPULSORY_SLO_SCOPE_NOTE | Displacement formula is supporting kinematics rather than direct continuity | Δx=vΔt for constant speed/velocity along a straight segment is correct option B, but does not alone test B-36's continuity-problem application. It is a step in the derivation and should remain supportive practice until teacher SLO review. **Keep original source answer B** and hold individual exam certification pending teacher approval. |
| **XI-U06-T64-MCQ-0014** | COMPULSORY_FIGURE_FIDELITY_NOTE | Figure 6.7 printed NBF attribution without attached figure | The teacher-prepared master states Fig.6.7 is a one-inlet/one-outlet pipe, so the prepared key A is internally consistent, but the original printed NBF Fig.6.7 panel/caption on pp.96–99 was NOT reopened. GitHub Q14 contains a figure reference in the stem but no source figure-link field; verify original figure and student readability before any certified source-figure use. **Keep original source answer A** and hold individual exam certification pending teacher approval. |
| **XI-U06-T64-MCQ-0018** | COMPULSORY_COGNITIVE_SCOPE_NOTE | Density SI units and B-38 Application classification | ρ has SI unit kg m⁻³, so source B is correct. Unit identification does not by itself justify mass continuity as required by official B-38 Application; keep as a study prerequisite and withhold per-item certification. **Keep original source answer B** and hold individual exam certification pending teacher approval. |
| **XI-U06-T64-MCQ-0020** | COMPULSORY_BRANCH_DIRECTIONS_NOTE | Branch continuity and signed rate accounting | For steady incompressible one-inlet/two-outlet division, Q_main=Q_branch1+Q_branch2 when positive magnitudes refer to their own outward/inward directions. More generally signed fluxes sum to zero with consistent normals; option B says all directions taken positive and is invalid. Source C is correct. **Keep original source answer C** and hold individual exam certification pending teacher approval. |

### Detailed scientific audit and cautions

**Steady mass conservation:** For a single steady inlet/outlet without mass accumulation, `ρ₁A₁v₁=ρ₂A₂v₂` (Q1–2). If incompressible and density identical at both sections, `A₁v₁=A₂v₂` (Q3 and Q12). For Q5/6/10/11, the `v` in `Q=Av` is **mean velocity normal to section** when the profile is not uniform; `ΔV=AvΔt`; `ṁ=ρAv`. A speed measured at one arbitrary location is not universally the representative mean.

**Two-branch flow (Q20):** In one-main-inlet/two-outlet, steady incompressible conservation is `Q_main=Q₁+Q₂`, with positive flow magnitudes appropriate to the inlet/outlet choices. Signed normal mass fluxes sum to zero instead if the sign convention is consistently followed. The key C is correct; selecting the alternate sum of three **all-positive** rates would be wrong.

**Dimensional prerequisite versus official Application demand (Q6, Q8, Q9, Q18):** `[Av]=m³/s`, `[ρAv]=kg/s`, `[ρ]=kg/m³`, `Δx=vΔt`. These are correct and useful prerequisite questions, but are primarily Knowledge/introductory work. **Do not automatically certify each as an Application-level B-36/B-38 item merely because it comes from a summative topic.** Similarly, recognizing formulas and symbol labels is not a substitute for solving continuity problems or justifying mass conservation.

**Figure/source (Q14):** Teacher-prepared compilation states the original Fig6.7 shows a one-inlet/one-outlet continuity tube, and selects A. We verified the teacher-compilation stem and answer but **not** the original printed Figure6.7. Do not claim board-ready figure fidelity or that a verified source figure is displayed publicly.

**Q15–16/Q19:** With fixed steady discharge and same liquid, volume flow is conserved, speed increases as area decreases, and equal sections yield equal *mean speed magnitudes*; neither pressure nor each section's velocity is globally fixed. Q17 explicitly recognizes conservation of equal mass entering/leaving as a B-38 idea.

### Candidate SLO and cognitive level ONLY (teacher approval pending)

| MCQ | Original key | Candidate SLO from prepared key | Tentative cognitive level | Priority |
|---|---|---|---|---|
| 1 | B | P-11-B-38 | Knowledge | OPTIONAL |
| 2 | B | P-11-B-38 | Understanding | COMPULSORY_MODEL_SCOPE_NOTE |
| 3 | C | P-11-B-36 | Understanding | OPTIONAL |
| 4 | C | P-11-B-36 | Knowledge | OPTIONAL |
| 5 | A | P-11-B-36 | Understanding | COMPULSORY_MEAN_VELOCITY_NOTE |
| 6 | C | P-11-B-36 | Knowledge | COMPULSORY_COGNITIVE_SCOPE_NOTE |
| 7 | C | P-11-B-38 | Knowledge | OPTIONAL |
| 8 | C | P-11-B-38 | Knowledge | COMPULSORY_COGNITIVE_SCOPE_NOTE |
| 9 | B | P-11-B-36 | Knowledge | COMPULSORY_SLO_SCOPE_NOTE |
| 10 | C | P-11-B-36 | Understanding | OPTIONAL |
| 11 | A | P-11-B-38 | Understanding | OPTIONAL |
| 12 | C | P-11-B-38 | Understanding | OPTIONAL |
| 13 | B | P-11-B-36 | Knowledge | OPTIONAL |
| 14 | A | P-11-B-38 | Knowledge | COMPULSORY_FIGURE_FIDELITY_NOTE |
| 15 | D | P-11-B-36 | Understanding | OPTIONAL |
| 16 | D | P-11-B-36 | Understanding | OPTIONAL |
| 17 | C | P-11-B-38 | Understanding | OPTIONAL |
| 18 | B | P-11-B-38 | Knowledge | COMPULSORY_COGNITIVE_SCOPE_NOTE |
| 19 | C | P-11-B-36 | Understanding | OPTIONAL |
| 20 | C | P-11-B-38 | Understanding | COMPULSORY_BRANCH_DIRECTIONS_NOTE |

The provisional assignments reflect the prepared teacher key's B36/B38 labels, but **no individual item mapping is certified**. Original `sloCodes:[]`, `cognitiveLevel:'Unspecified'`, `boardEligible:false` stay untouched. Official B-37 is the hose-constriction explanation SLO and does not automatically apply to these first 20 definitions.

## Evidence ledger, regression and release restrictions

- `quality/grade11-unit06-v95c2m-topic64-mcq01-20-academic-review.csv`: **20 exact original IDs**, prepared PDF source/key pages, source key, figure-link limitation, scientific note/priority, candidate-only B36/B38 cognitive classification, printed-original fidelity `PENDING`, individual SLO certification `PENDING`, teacher approval `PENDING`.
- `scripts/test_grade11_unit06_v95c2m_topic64_first20_academic.cjs`: deterministic lock on original 20 stems, 80 A–D choices and 20 original letters (fingerprint **`0xd6df1ce5`**); correct mass/volume-flow identities, all eight compulsory notes, Q14's missing figure link and central 560 PENDING teacher-approval queue; inherited V95-C2L back to V94D academic/release safeguards.
- The current status **after inspection** is Topic6.1 **80/80**, 6.2 **80/80**, 6.3 **80/80**, 6.4 **20/80**, so **260/560** unit questions academically inspected and **300 still uninspected through the V95-C2 batches**. Inspection is **not teacher certification**. All **560** master queue approvals remain PENDING; the separately maintained 14 original end-unit textbook MCQs are outside this 560 pool.
- Full Unit6 course stays `planned`, formal assessment `not-published`, master `releaseApproved:false`, GradeXI self-practice source 2,250 / Unit6 560 provisional, Unit6 standalone situations 136 / authentic shared stimuli 0. No textbook images imported or official graded exam released.

**Keep this PR DRAFT until latest-head GitHub Actions CI is green and teacher considers eight flagged notes.** Next: V95-C2N — Topic6.4 Q21–40 continuity conceptual/reasoning quality review.
