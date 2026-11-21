# V94-C2.4 — Grade XI Physics Unit 6 Topic 6.4: Equation of Continuity — detailed academic QC

**Date:** 21 November 2026  
**Workflow:** PR #91 (Topic 6.3) was independently confirmed merged before this branch was created from `main`. Topic 6.4 is the fourth detailed source review toward the seven-topic `Read → Simulate → Practice → Revise` desk. This change contains **documentation and executable arithmetic checks only**; it is not a student-content release.

## Material actually opened, and evidence limits

- **Private owner-prepared master:** `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, compiled pp. **151–161** (Part B: **56** Q&As, divided into four groups of 14); pp. **162–172** (Part C: **17** main numbered sections, including the conservation-of-mass derivation, **11 supplementary worked applications**, six self-check questions and source tables); pp. **173–182** (Part D: **32** questions, including 8 figure/concept guides, **Q9 original-labelled NBF Example 6.3**, **Q10 original-labelled Assignment 6.3**, ten other applications and **12 supplementary numericals Q21–Q32**).
- **Rendered visual source check:** Master PDF pp. **163** and **173** were inspected as page images. The Part C tube schematic and Part D flow-tube/falling-jet/squeezed-hose drawings are described in the source as **original teaching schematics**, not scanned original NBF figures. Raw text extraction represents some superscript squares as `r12` or `(6/3)2`; the rendered PDF or intended equation context must be checked before declaring an actual typography/scientific defect. V95 needs independently verified math in HTML/print.
- **Official FBISE Grade XI framework:** PDF p.11 explicitly categorizes `P-11-B-36` **Summative/Application** (solve continuity problems); `P-11-B-37` **Summative/Understanding** (explain faster flow at squeezed rubber-pipe outlet); `P-11-B-38` **Summative/Application** (continuity expresses conservation of mass). This is **SLO-level** classification only. Each authored question's suggested SLO/cognitive label requires separate academic review before claiming official item-level status. `B39` is formative in the next Bernoulli topic.
- **Unverified original NBF text/figure fidelity:** The private compilation attributes its basis to NBF printed **pp.96–99** and to **Figures 6.7 and 6.8**, **Example 6.3** and **Assignment 6.3**. Their complete original printed images/text have **not** been directly matched in this review. Refrain from claiming word-for-word fidelity; do not upload original NBF scans or the protected 577-page owner document.

## Structured source inventory and first-pass science assessment

### Part B — all 56 question/answer pairs (compiled pp.151–161)

| Questions | Focus and outcome | Source assessment and qualification |
|---|---|---|
| **Q1–Q14** | Meaning, density-dependent and incompressible continuity, `Q=Av`, `ṁ=ρAv`, units and circular areas | Derivations and units are consistent: **kg/s** for mass flow and **m³/s** for volume flow. `A₁v₁=A₂v₂` requires equal densities and single unbranched flow **for the two-section comparison**, not merely that the liquid is present. Q10 correctly qualifies increased speed in a real squeezed hose by the supply/discharge. |
| **Q15–Q28** | Derivation from `Δm=ρAvΔt`, conservation, branches, leaks, diameter/area ratios | Core mass-conservation reasoning is correct under *steady*, no-storage, no-leak conditions. If there are branches, **sum all mass flows**. A two-section fixed area implies fixed sectional mean speed only for unchanged incompressible flow. Q22 (longer hose jet range) is conditional on outlet direction, pressure, supply and drag; a classroom idealization, not a universal prediction. |
| **Q29–Q42** | Fig6.7/6.8 interpretations, 30-artery branch example, falling jet, river channel, pressure-vs-continuity distinction | Q32/Q33 correctly use **30 outlets** and total cross-sectional area. Q39 correctly rejects a universal claim that “deep water always flows slowly”: same discharge and comparable width are necessary for the simple rectangular model. **Q40 is particularly valuable:** the continuity equation contains **no pressure term**, so pressure cannot be inferred from it alone. Q41 uses slope of volume–time curve for volumetric rate. |
| **Q43–Q56** | Fourteen original teacher-authored numerical applications of continuity | Independent recalculation matches the prepared solutions: 3.0, 0.40, 3.2, 0.60 m/s; Q47 0.003 m³/s = 3 L/s; Q48 2.0 m/s; Q49 4.0 m/s; Q50 2.0 m/s; Q51 original-labelled Example6.3 result 0.044 m/s; Q52 2.0 kg/s; Q53 2.0 m/s; Q54 4.0 m/s; Q55 2.0 cm²; Q56 6.28×10⁻⁴ m³/s = 0.628 L/s **using the source-specified π≈3.14**. These results are conditional on the stated geometry, densities and equal flow through branches, where relevant. |

**Book-versus-author boundary:** Part B is **56 authored explanatory questions**, some discussing named NBF examples, not 56 direct printed exercise prompts. SLO tags placed under the author's explanations are not independent FBISE item certification.

### Part C — all 17 numbered sections (compiled pp.162–172)

| Sections | Review | Required qualification for V95 |
|---|---|---|
| **§§1–5** | Symbol table; general derivation `Δm=ρAvΔt` → `ρ₁A₁v₁=ρ₂A₂v₂`; constant-density reduction `A₁v₁=A₂v₂=Q`; `ṁ=ρQ`. Equations/units and rendered tube illustration are consistent. | State **same time interval**; steady state with no accumulation, leak or side source; areas are **normal to local flow** and v is mean normal speed. |
| **§§6–8** | Speed, area, density inversions; circular `A=πr²=πd²/4`; total-outlet continuity for many branches; equal branches as a special case. | **Radius and diameter ratios must be squared**; if densities differ, use `ρAv`; do not drop branch count n. Supplementary formulas should be called *derived practice*, not extra printed NBF derivations. |
| **§§9–11** | Hose squeeze, falling jet and deep/shallow river. The source already supplies source-critical conditions: near-constant discharge, steady density, comparable river width and no significant tributaries. | **Distinguish two comparisons**: at a given steady instant the discharge matches between two sections of an unbranched hose; **between before/after squeezing**, the overall discharge may differ. For a falling jet gravity supplies acceleration; continuity describes narrowing, not its cause. |
| **§12** | Original-labelled Example6.3 (aorta to 30 smaller arteries) leads to `(0.8/0.4)²×0.33/30=0.044 m/s`. | Assumes approximately incompressible blood, equal share/size/speed in **30** branches, and average cross-sectional velocities. Original printed wording/data on NBF pp.98–99 not yet independently compared. |
| **§13** | **11 explicitly supplementary** worked applications: area/radius/diameter, bottle collection, three unequal/equal branches, variable density, ideal river, falling jet kinematics. Values and units independently checked. | Label as teacher-developed; separate **kinematics + continuity** enrichment (Application 11) from an NBF-required standalone derivation. |
| **§§14–17** | Revision formulas, common-error list, **six self-check questions**, and explicit source/provenance audit. | Preserve `m³/s`, `kg/s`, `cm²→m²`, Greek rho/delta, square-root and superscript powers in mobile/projector/print; never auto-inherit item-level board certification. |

**Important non-defect:** Some lines in PDF text extraction render `r₁²` as `r12`, and `v₂²` as `v22`. Source pages were visually checked; do not confuse extraction problems with actual mathematical errors. Independently verify mathematical layout when converting to a website.

### Part D — all 32 questions (compiled pp.173–182)

| Group | What was checked | Outcome |
|---|---|---|
| **Q1–Q8** | Eight textbook-**guided** concept/figure prompts for 6.7/6.8, mass-flow, falling-jet and squeeze. | Scientifically consistent with stated assumptions; source's schematics are independently authored, not the original NBF artwork. |
| **Q9–Q10** | The **only two originally numbered NBF tasks** identified in this source section: **Example6.3** (30 equal arteries, `0.044 m/s`) and **Assignment6.3** (deep/shallow channel model). | Example answer agrees with the prepared values; river statement explicitly conditional. **Direct original NBF pp.98–99 still required** before labelling wording “textbook-exact.” |
| **Q11–Q20** | Ten teacher-supplemented conceptual and scenario questions. | Branching, leakage, density changes, units and pressure are distinguished. **Q20** asks why continuity cannot fix pressure; its B37 *suggested topic label* should not be promoted as an official standalone B37 competency without justification. |
| **Q21–Q32** | **Twelve** supplementary numerical questions (area, radius, diameter, Q and volume, variable-density gas, five branches, conditional channel, falling jet, filling time, unequal branches). | All twelve arithmetic outcomes agree with the source under their assumptions; answer units and physical preconditions must accompany students' worked solutions. Q27 denominator `ρ₂A₂=0.0090 kg/m` is dimensionally correct; quotient from upstream kg/s gives m/s. |

**Part D source-assigned SLO allocation:** B36 **21** items, B37 **3**, B38 **8** (32 total); this count matches the individual labels in the compiled page text. Such allocation remains **author-selected** until a separate per-item teacher/board alignment audit.

## Teacher amendment register — only attention-worthy items

| ID | Where | Priority | Recommended action | Can original remain, adding a note/alternate? |
|---|---|---|---|---|
| **T64-01** | B Q1–9, Q17–27; C §§3–5; D Q1–4/Q11–15 | **Compulsory scientific conditions** | Show `ρAv` conservation with steady flow, no accumulation/sources/sinks; reduce to `Av` only for unchanged density. Distinguish section-averaged normal speed, flow volume per time and mass per time. | **Yes**, preserve prepared source and add an explicit assumptions/units panel. |
| **T64-02** | B Q10/Q22/Q38; C §9; D Q6/Q13 | **Compulsory clarity** | In one steady pipe at a time `Q_in=Q_out`; comparing **before/after** a real hose squeeze, `Q` can change. Do not claim an area reduction forces a factor-fixed speed rise regardless of supply. | **Yes**, use a two-case teaching demonstration. |
| **T64-03** | B Q32–33/Q50–51; C §§8/12/13; D Q9/Q14/Q19/Q26/Q31 | **Compulsory** | Sum **all** outgoing branches; do not equate inlet Q with one branch; distinguish equal from unequal branch flow. In Example6.3 divide among **30** vessels. | **Yes**. |
| **T64-04** | B Q39; C §§11/13; D Q10/Q28 | **Compulsory interpretation** | “Deep water is slower” only within comparable-width, equal-discharge model. Real rivers depend on slope, bed friction and geometry. Preserve caveat already present. | **Yes**, keep original question and qualify. |
| **T64-05** | B Q40; C §§1/9; D Q20 | **Compulsory topic boundary** | Continuity is **mass conservation**, not a pressure relation; pressure models belong to Bernoulli/energy analysis in Topic6.5. | **Yes**. |
| **T64-06** | B Q29–31; C §3; D Q1–8, source diagrams | **Compulsory before exact NBF artwork claims** | Verify original textbook **Figures6.7 and 6.8**, plus NBF Example6.3 and Assignment6.3 wording on printed pp.96–99. Use independently-authored, accessible diagrams; private textbook scans remain outside GitHub. | **Yes**. |
| **T64-07** | All authored K/U/A and per-item SLO tags, notably D Q20 | **Compulsory for final-exam claims** | Official framework B36/B37/B38 classifications are at **SLO level**; author-created question mappings are provisional until teacher signs off; a pressure-boundary question alone is not a full B37 performance test. | **Yes**, preserve educational labels with qualification. |
| **T64-08** | B Q43–56; C §§6–13/16; D Q21–32 | **Compulsory for student numerical presentation, not an arithmetic correction** | Verify squared radii/diameters, conversions `1 cm²=10⁻⁴ m²`, `1 L=10⁻³ m³`, and all formula subscripts; differentiate kg/s vs m³/s; preserve source-specified π≈3.14 in Q56. | **Yes**. |
| **T64-09** | Flow sketches and worked solution rendering in V95 | **Compulsory technical/visual QA** | Recheck interactive SVG meaning, accurate figure labels/alt text, accessible equations, 390px mobile, projector readability and printable answer review. Text extraction anomalies are not source defects. | **Yes**. |

**Scientific correction verdict:** No compulsory **numerical answer-key replacement** emerged from the independently recalculated values at this stage. The *real* release work is precise assumptions, source/figure provenance, SLO/item distinction, branching rules, pressure boundary and student-ready equation rendering. Do not silently edit original source questions.

## Mathematics and automated verification

A dedicated source-independent Node regression `scripts/test_grade11_unit06_topic64_academic_v94c2.cjs` checks the **14 Part B quantitative answers Q43–Q56**, **11 Part C supplementary applications**, **6 Part C self-checks**, and **12 Part D numericals Q21–Q32**, including secondary unit conversions, plus invariants `Unit6=560`, `GradeXI=2250`, `136` independently-labelled scenarios and zero figure holds. These are *calculation/model-consistency checks* using prepared givens, not original-textbook fidelity or FBISE item certification. 

## Next steps and code/publication boundary

1. Teacher reviews T64-01–T64-09, preserving originals and adding only accepted explanatory notes for a later V95 student interface. No mass rewrite of 56 Q&As or 32 Part D tasks.
2. For exact source attribution, teacher may provide printed NBF **pp.96–99** and Figures 6.7–6.8; until then, show independent educational figures and qualify source-text status.
3. Continue C2.5 Bernoulli's Equation, C2.6 applications and C2.7 superfluidity, then construct the integrated Unit 6 Learning Desk.
4. **No change in this PR** to 560 source MCQs, 2,250 total, answer keys, full Unit6 `planned` status, authentication, Firebase, student data, paid content, private PDFs, original textbook scans or existing student portal code.

**This is an academically grounded detailed first-pass review, not an exhaustive independent NBF original-page transcription or official item-level FBISE certification.**
