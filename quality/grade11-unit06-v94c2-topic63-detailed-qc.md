# V94-C2.3 — Grade XI Physics Unit 6 Topic 6.3: Fluid Flow — Detailed Academic QC

**Date:** 21 November 2026. **Sequence:** Teacher confirmed PR #90 merged (verified on GitHub); this is the third detailed Topic 6 audit, after 6.1 and 6.2. **Publication status:** An academic review plus a deterministic numerical test, not an authorization to mark the complete Unit 6 Learning Desk available.

## Actual sources and evidence limits

- **Owner's private combined source, directly inspected:** `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, compiled PDF **pp.113–120** (Part B: **48** individually numbered Q&As), **pp.121–126** (Part C: **10** explanatory/mathematical headings with worked examples and self-checks), and **pp.127–136** (Part D: **32** newly written questions in four groups of eight). All sections were read, including the 48 answers and full 32-item teacher material, with independent recalculation of quantitative items.
- **Rendered PDF pages 123, 125, 127, 134 and 136 were visually inspected.** The master displays `[Q]=L³T⁻¹`, `m³s⁻¹` and the original supplementary volume-time slope graph correctly. Superscript ordering problems in raw PDF text extraction are **not source-paper mathematical errors**. V95 must recheck superscripts/labels in the HTML, mobile and print render.
- **Official FBISE HSSC-I Grade XI framework**: `P-11-B-35` is **Summative** at the level **Knowledge + Understanding**, requiring students to define/apply **steady (streamline or laminar)**, **incompressible** and **non-viscous** flow in an ideal-fluid description. This is official SLO scope, **not automatic per-question certification** for author's items.
- **NBF printed source claims:** Topic6.3 references original NBF Grade XI **pp.95–96**. Previously the teacher provided the actual original Figure **6.6(a),(b)** (streamline vs turbulent), visually verified during V93. We did **not** independently inspect the complete original printed pp.95–96 prose, ideal-fluid assumption table, original dolphin/wind-tunnel sidebars, or all source artwork in this turn. Respect the distinction between textbook-guided paraphrase and reproduced source.
- **Repository baseline:** The live Grade XI central Test Builder currently has **2,250 provisional MCQs**, with **560** from Unit6 and all six prior figure-held source MCQs released. Complete Unit6 course `planned`, not a board-certified course. No source PDF, original textbook image or teacher-only marking scheme may be added to public GitHub.

## Provenance inventory / exam boundary

| Prepared section | Master PDF pages | Actual scope | Source-integrity boundary |
|---|---|---|---|
| **Part B** | **113–120** | **48** original Q&As: 1–12 definitions, 13–24 reasoning, 25–36 ideal assumptions/real examples, 37–48 applications and flow-rate arithmetic | Author-prepared, not 48 verbatim printed NBF exercises |
| **Part C** | **121–126** | **10** main sections: topic scope; vocabulary/ideal assumptions; `Q=ΔV/Δt` and rearrangements; conversions; **seven** numbered examples C1–C7; volume–time graph; dolphin/car/wind-tunnel applications; eight self-check questions; answers; formula/revision sheet | No separate formal derivation is prescribed in Topic6.3. `Q=V/t` algebra, seven examples, graph and self-checks are explicitly **[DEVELOPED]** support. Preserve boundary with Topic6.4 continuity. |
| **Part D** | **127–136** | **32** practice questions: Q1–8 flow definitions/Fig6.6(a), Q9–16 turbulence/ideal-fluid assumptions, Q17–24 real fluids/applications, Q25–32 independent scenarios & flow-rate arithmetic | All **newly worded** teacher prompts. “Textbook-guided” means based on original ideas, **not** a verbatim NBF item. There is **no numbered NBF Example6.x or Assignment6.x** in §6.3 according to source. |

## Part B (all Q1–Q48): focused accuracy findings

**Q1–Q12 — definitions and ideal flow.** The prepared explanation identifies liquids and gases as fluids, specifies volume **passing a chosen section per unit time** rather than a literal zero-area “point,” and uses `Q=ΔV/Δt` for mean transferred volume per time. It separates ideal `η=0` from realistic water/air with viscosity, and density constancy from viscosity. Important: Q7 correctly defines **steady** at a fixed location (time-invariant local velocity); Q8 characterizes **laminar** as orderly layers. These concepts can overlap but are not universally identical.

**Q13–Q24 — ordered vs turbulent flow.** Q14 correctly says two distinct streamlines cannot intersect at an ordinary point with a uniquely defined nonzero velocity vector. Q15 correctly distinguishes **steadiness in time** from **same speed everywhere**. Q16's faster central layer is a **real viscous tube-flow phenomenon**, not a property of an inviscid plug-flow idealization. Q17–18 correctly treat the “critical speed” as contingent on geometry, fluid and perturbations, **not a single universal speed**. Curved smooth paths alone do **not** prove turbulence.

**Q25–Q36 — model assumptions and application sidebars.** The prepared list of four idealizations is **non-viscous, laminar, incompressible, irrotational**, with an important explanation in Q29: irrotational means **zero local vorticity**, not literally that all trajectories are straight; school-text shorthand should be attributed, then clarified separately. Dolphin/wind-tunnel/vehicle streamlining explanations are qualitative and cannot be used to calculate drag by inserting Stokes' `6πηrv` for fast bodies. The content uses independent educational sketches instead of the original scanned Fig6.6; cross-check all labelled panels/alt text during V95.

**Q37–Q45 — scenario interpretation.** Dye streak and swirl observations are **evidence consistent with** laminar/turbulent behavior, not definitive proof of the entire flow pattern; changing a pipe size can trigger turbulence but not for all conditions. Q40 and Q41 directly correct two conceptual mistakes: incompressible ≠ inviscid, and steady ≠ uniform across space. In wind tunnels, **relative movement** of air against a model is the relevant condition.

**Q46–Q48 — independent average-flow calculations.** Q46: `600 cm³/3 s = 200 cm³/s = 2.0×10⁻⁴ m³/s`. Q47: `1.5 L/30 s=0.050 L/s=5.0×10⁻⁵ m³/s`. Q48: `0.002 m³/s×10 s=0.020 m³=20 L`. All agree. These are **supporting arithmetic** developed from the source definition, *not* the SLO B35's separately prescribed numerical method and **not** the Topic6.4 continuity equation.

## Part C (10 sections) math, figures and answer audit

- **§§1–3:** Formulae `Q=ΔV/Δt`, `V=Qt`, `t=V/Q`, dimensional `L³T⁻¹` are correct in their explicitly stated mean-rate/constant-rate settings. Text extraction garbles superscripts, but the *rendered PDF p.123 is correct*.
- **§4:** Conversions checked: `180 L/min = 0.00300 m³/s`; `0.0025 m³/s=150 L/min`; `0.75 L/s=2.70 m³/h`.
- **§5 (C1–C7):** `0.48 m³/120s=0.004 m³/s=4L/s`; `720L/360s=2L/s`; `1.8/0.015=120s`; `45 mL/s×240s=10.8L`; `0.75m³/300s=0.0025m³/s`; `0.008m³/s×90s=0.72m³=720L`; and the **unequal interval** rate `(0.06+0.03)/(20+30)=0.0018m³/s`. The naïve arithmetic average of interval rates (0.002) is wrong because the intervals differ.
- **§6:** Independently verified *rendered* original educational graph: straight line reaches `0.20m³` at `50s`; slope `0.004m³/s` matches the separately shown `(0.160−0.040)/(40−10)` calculation.
- **§7:** Dolphin and vehicle streamlining, wind tunnels are qualitative, without a numerical car-drag law. No low-Re Stokes treatment for vehicles/dolphins.
- **§§8–10:** Eight prepared self-checks reviewed; arithmetic: `3L/s=0.003m³/s`; `0.012×25=0.300m³`; `500/2.5=200s=3min20s`; `96L/min=0.0016m³/s`; graph `(0.15−0.03)/(25−5)=0.006m³/s`. Solutions agree. Continuity `A₁v₁=A₂v₂` is intentionally reserved for **Topic6.4** and should not silently be added to this topic's SLO coverage.

## Part D (all Q1–Q32) quality and source-fidelity review

- **Section A Q1–8:** Eight new textbook-*guided* definitions/Figure6.6(a) questions. The rendered original **educational** sketch (PDF p.127) is distinct from NBF's scanned Figure6.6 and depicts regular paths next to eddies. Labels are readable, but do not present it as the exact NBF illustration or imply that a schematic cartoon is a rigorous instantaneous streamline vector field.
- **Section B Q9–16:** Eight guided descriptions of eddies, abrupt tube changes and ideal-fluid assumptions. Q16 correctly corrects the NBF “straight lines” irrotational simplification by distinguishing local vorticity.
- **Section C Q17–24:** Eight questions on real viscous fluids, dolphins, fast vehicles, wind tunnels, tracer observations and honey. Q21's single smooth tracer is suggestive **not conclusive** for flow regime. All are newly worded from the described ideas.
- **Section D Q25–32:** Eight independently authored scenarios/flow-rate exercises. Q26 correctly says gently *curved* streamline need not be turbulent. Q27 correctly states speed alone does not establish flow regime. Q29: `18L/6s=3L/s=3×10⁻³m³/s`; Q30: `2.4L/8s=0.30L/s=3×10⁻⁴m³/s`; Q31: `12L/(2.5L/min)=4.8min=288s`; Q32 graph: `12L/4s=3L/s=3×10⁻³m³/s`. The source graph on PDF p.134 was rendered and is independently authored supplementary material.

**Finding:** No incorrect numerical answers were found in the checked Part B, C or D exercises. This does not imply all 48+32 answers have been individually certified by FBISE or verified verbatim against the original printed book.

## Teacher amendment register (only items requiring attention)

| ID | Items | Priority | Recommended release treatment | Can original be retained and supplemented? |
|---|---|---|---|---|
| **T63-01** | Part B Q7–8, Q15–16, Q41; Part C §2.3; Part D Q4/Q8/Q28 | **Compulsory scientific clarity** | Distinguish **steady/time-invariant** vs **laminar/ordered** and central viscous velocity profile vs non-viscous ideal assumption. The school source groups labels for beginners but they are not strictly interchangeable. | **Yes** — preserve attributed source language, add a precision note. |
| **T63-02** | Part B Q29; Part C §2.3; Part D Q16/Q26 | **Compulsory scientific accuracy** | **Irrotational ≠ straight-line path**. Correct statement is zero local fluid-element spin/vorticity, while streamlines may curve. | **Yes** |
| **T63-03** | Part B Q3/Q46–48; Part C §§3–6/8–10; Part D Q29–32 | **Compulsory provenance and SLO guard** | `Q=V/t`, conversions, time-averaged rates and supplementary graph are good teaching exercises but **do not relabel as extra required summative B35 calculation SLO** or as NBF original numbered examples; reserve `A₁v₁=A₂v₂` for Topic6.4. | **Yes** |
| **T63-04** | Part B Q17–18/Q37–39, Part D Q11–12/Q21/Q22/Q27 | **Optional scientific refinement; compulsory for categorical claims** | Turbulence depends on fluid, geometry, boundary conditions; a lone dye streak/speed observation is only suggestive. Avoid invented universal critical velocity. | **Yes** |
| **T63-05** | Part B Q35–36, Part C §2, Part D Q5/Q9 and source drawing | **Compulsory art/figure provenance** | Use already V93-verified independently authored Figure6.6 reference as accessible figure; keep no original NBF scans in the public repo. Distinguish illustrative path cartoon from rigorous measured flow field. | **Yes** |
| **T63-06** | Part B Q31–34; Part C §7; Part D Q18–20/Q25 | **Optional depth, compulsory model boundary if numerical drag introduced** | Qualitative streamlining and wind-tunnel science are acceptable; do not apply sphere Stokes drag to dolphin/car high-speed flow. No unverified drag coefficient or speed claims. | **Yes** |
| **T63-07** | Part C §§3–6,8–10 and D Q29–32 | **Compulsory transfer/render QA** | Preserve `m³s⁻¹`, `10⁻³`, `t`, `V`, axis units and slope of volume–time graph. Extractor character-order artifacts are not evidence of original-PDF mistakes; verify rendered HTML, projector, phone and print. | **Yes** |
| **T63-08** | Part D all Q1–32, Part B source-labelled examples | **Compulsory exact-source claims** | All Part D prompts are teacher-authored even when “textbook-guided”. Original NBF p.95–96 body text and Figure6.6 have only limited direct comparison; do not certify total exact-source transcription of whole section. | **Yes** |
| **T63-09** | Part B authored K/U and other tags; Part D outcome references | **Compulsory if claiming official item-level board eligibility** | Official B35 is summative Knowledge + Understanding at SLO level, but no automatic per-question FBISE, cognitive or PBA certification from a private learning-note label. | **Yes** |

**Recommendation:** Keep all original questions and answers. V95 should add concise assumption/figure/source notes rather than rewriting 48 Part B items or 32 Part D questions. Nothing in this audit warrants silently changing a live bank answer.

## Automated arithmetic and repo-safety gate

`scripts/test_grade11_unit06_topic63_academic_v94c2.cjs` recalculates Part B, Part C and Part D results and explicitly checks the time-weighted flow-rate example versus the incorrect unweighted average. It also asserts the unchanged **Unit6=560**, **Grade XI=2,250**, **136 independent situation MCQs**, **0 held original figure questions** and *full Unit6 planned*. Its test is **not** a full source-exact text comparison or item-level academic certification.

## Next work and merge restrictions

1. Teacher reviews the nine-item register (especially T63-01, T63-02, T63-03, T63-05 and T63-07). **Only teacher-approved explanations** should be used for V95 lessons; private owner-prepared PDFs and source scans remain private.
2. Continue V94-C2.4 Topic6.4 continuity, then 6.5 Bernoulli equation, 6.6 applications and 6.7 superfluidity. Verify entire source and focused numerics/figures by topic, recording only necessary changes.
3. Build seven-topic V95 `Read → Simulate → Practice → Revise` once content gates are approved. Use existing five Unit6 simulations and 560 public provisional MCQs, with accessible original figures and matched worked examples.
4. Retain `portal/learning-catalog.json` full Unit6 `status:planned` until integrated navigation and lessons pass teacher review and CI. No new access policy, Firebase write, paid material, student grading or original NBF scan in this branch.

**This V94-C2.3 PR is documentation plus a numerical regression only; no public MCQs, labels, answers, authentication, source files or UI were changed.**
