# V95-B4 — Topic 6.4 Equation of Continuity: student lesson provenance, physics checks and teacher signoff

**Release status:** Provisional *public student study preview*, not the completed and teacher-certified Unit 6 course. Begun after independently verifying teacher-merged **PR #100** on `main`. Read → Simulate → Practice → Revise desk remains a public preview until final signoff.

## Direct source inspection and framework evidence

- Owner's **private** 577-page `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, Topic6.4 Part C **compiled pp.162–172**, examined directly: full **12-step** `Δm=ρAvΔt` derivation, `ρ₁A₁v₁=ρ₂A₂v₂` followed by constant-density `A₁v₁=A₂v₂`, branch and radius-square extensions, real hose/falling-jet/channel caveats, the original-labelled **Example 6.3 data** and **11 supplementary applications**.
- Owner's prepared Topic6.4 Part D **compiled pp.173–182** examined: 32 author-prepared items, of which Q9/Q10 are attributed to NBF Example/Assignment 6.3, and Q21–Q32 are supplementary. Topic6.4 Part B has 56 Q&As, as independently documented in the merged audit; no bank source material is republished.
- `quality/grade11-unit06-v94c2-topic64-detailed-qc.md`, merged V94-C2.4 (PR #92), including nine teacher decisions **T64-01…T64-09**, all reviewed for this student preview.
- Official supplied **FBISE HSSC-I Physics Assessment Framework PDF p.11**:
  - **P-11-B-36 = Summative / Application** (continuity calculations).
  - **P-11-B-37 = Summative / Understanding** (squeezed rubber-pipe speed).
  - **P-11-B-38 = Summative / Application** (mass conservation).
  These are **outcome-level** classifications only. Nothing authorizes automatic per-MCQ FBISE certification.
- Protected original NBF printed **pp.96–99**, original **Figures6.7/6.8** and exact wording/data of **NBF Example6.3 and Assignment6.3** have *not* been exhaustively directly compared against the originals. The named exercise's data are credited as teacher-*prepared master* and newly explained; no verbatim original-page claim is made.

## Student-facing deliverables

1. `portal/unit-06-topic-64-study-v95b4.html`: **8** substantive sections — quantities/units; 12-step general mass derivation; incompressible special case; n-branch conservation; squeeze/jet/river applications; **8** full numerical worked examples (prepared Example6.3 plus 7 supplementary); two interactive calculation forms; **6** conceptual revealable checks and formula recap.
2. `assets/illustrations/unit6-v95b4-continuity-pipe-original.svg`: independent accessible wide/narrow ρAv schematic; **not NBF Fig6.7**.
3. `assets/illustrations/unit6-v95b4-branching-original.svg`: independent accessible 1-inlet/3-outlet flow diagram; **not NBF Fig6.8**.
4. `portal/unit-06-topic-64-study-v95b4.js`: browser-only, two live model activities — general **variable-density mass continuity** with water/gas presets and **n identical equal-flow circular branches** with 30-artery/3-branch presets. Enforces positive area/density and integer branch count; shows mass versus volume rate, condition-dependent statements, and source caveats. Stores/transmits **no names, input data or grades**.
5. `portal/unit-06-learning-desk-v95a.html`: only Topic6.4 **Read** gets the new study link; Topics6.1–6.3 detailed lessons, all 7×80 MCQ source previews and existing 5 simulations remain untouched.

## Independently rechecked worked answers (newly worded pedagogical explanations)

| Example | Prepared givens | Rechecked result | Scope |
|---|---|---|---|
| Prepared **NBF-labelled Example6.3** | Aorta r=.8cm, v=.33m/s, n=**30** branches r=.4cm | v per branch = (.8/.4)²×.33/30 = **0.044 m/s**; combined branch area = 7.5× inlet area | Original question's exact book text/picture **not** yet directly matched |
| Supplementary 1 | A₁=.012m²; v₁=1.5; A₂=.004m² | v₂ = **4.5 m/s**; Q = **.018 m³/s** | Equal density/steady single passage |
| Supplementary 2 | r₁=6cm, r₂=3cm, v₁=1.2 | v₂ = **4.8 m/s** | Square radius ratio |
| Supplementary 3 | 12L/40s; outlet r=.010m | Q = **.00030m³/s**, v ≈ **.955m/s** | Ideal average flow |
| Supplementary 4 | Inlet r=1.2cm, v=1m/s, 3 branches r=.6cm | each v ≈ **1.33m/s** | Exactly 3 equal branches |
| Supplementary 5 | Qin=.040m³/s, Q1=.015m³/s, A2=.005m² | Q₂ = **.025m³/s**, v₂ = **5.0m/s** | Unequal outlets |
| Supplementary 6 | ρ₁=1.2kg/m³ A₁=.08m² v₁=3m/s; ρ₂=.9kg/m³ A₂=.06m² | mass rate **.288kg/s**; v₂ = **5.33m/s**; Q1=.24 vs Q2=.32m³/s | **Do not cancel unequal density** |
| Supplementary 7 | River width=20m, depths 2.5m/1.0m, deep speed=.80 | shallow speed **2.0m/s** | Same discharge/width rectangular channel only |

Original prepared **Assignment6.3** river question is explained as a model, not as an unqualified “all rivers” rule; no direct original printed wording is rehosted. The separately prepared additional jet-kinematics exercise is **not** shown as an official extra continuity derivation.

## Nine-item teacher issue register

| ID | Handling in preview | Pending teacher/source action |
|---|---|---|
| **T64-01** | Mass flow `ρAv`, equal `Δt`, units kg/s vs m³/s; no leaks/storage and section-mean speeds explicitly documented | **Compulsory scientific clarity addressed**, final approval pending |
| **T64-02** | Same steady instant/unbranched hose Q compared vs changed *before-and-after* real system discharge | **Compulsory hose caveat addressed** |
| **T64-03** | Sum outlet rates; preserve the **30** equal branches and distinguish unequal branches | **Compulsory branch count addressed** |
| **T64-04** | Qualified rectangular river model only with matched width and Q | **Compulsory interpretation addressed** |
| **T64-05** | Pressure excluded from continuity; Topic6.5 reserved for energy/pressure | **Compulsory topic boundary addressed** |
| **T64-06** | Two new accessible original schematics; printed NBF Figures6.7/6.8 and example/assignment *not claimed exact* | **Original printed pp.96–99 source check remains outstanding** |
| **T64-07** | B36/B37/B38 official SLO/cognitive labels at topic level only | **Individual MCQ mapping/teacher approval still pending** |
| **T64-08** | Square ratios, cm²→m², litre→m³, SI units and the 30-branch calculation visibly checked | **Teacher content/layout review still pending**, no bank-key corrections made |
| **T64-09** | SVG alt/figure caption, equation explanation, keyboard labels, 390px/768px/1440px browser checks and print CSS reused from previous lesson | **Manual classroom projector/print review pending** |

## Release invariants

Current `portal/learning-catalog.json` Unit6 full status **planned**, assessment **not-published**; full `portal/unit-06.html` route **must remain absent**. Existing source bank **560 Unit6 MCQs and 2,250 Grade XI provisional MCQs** unchanged, **136** standalone situation items, **0** authentic grouped-stimulus Unit6 sets, **0** source figure holds, **5** original mapped simulations. `quality/grade11-unit06-v94d-signoff-matrix.json` release approval and all teacher topic signoffs remain **false**. No student grades, Firebase, access rules, billing, answer keys or protected original NBF image/PDF assets changed.

**Next:** V95-B5 Topic 6.5 Bernoulli's Equation after review/merge, followed by 6.6/6.7, detailed teacher source/fidelity acceptance, V95-C assessments and V95-D accessibility/security/release signoff before changing course availability or starting Unit 7.
