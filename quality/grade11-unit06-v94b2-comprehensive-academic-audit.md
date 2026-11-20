# V94-B2 — Unit 6 comprehensive-response questions: initial academic and curriculum audit

**Date:** 20 November 2026. **Scope:** 11 prepared comprehensive-response items (6.1–6.11), including their explanations, worked derivations, notes, and source-cited figure references. This is a **first-pass audit**, not final NBF transcription certification or teacher-approved publication.

## Exact sources inspected

- User-owned **`Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`**, compiled PDF pp.319–329, section headed “End-of-Unit Comprehensive Questions (6.1–6.11), Complete Solved Edition.” The prepared notes identify NBF printed exercise p.110 and textbook explanations pp.89–106 as their claimed basis. This compiled, owner-prepared study guide is **not** a separately inspected original NBF textbook scan.
- User-owned official **`11_Physics_HSSC_I_model_paper_50_percent(9).pdf`**, PDF pp.11–12, Grade XI Physics FBISE assessment framework (Curriculum 2022–23 / Scheme of Studies 2024; 50% MCQs, 50% descriptive). Relevant theory SLOs B33–B38 and B40–B44 are **summative**; **B39 is formative**. Official framework descriptions govern exam alignment.
- GitHub main after V94-B1: public Unit 6 has 560/560 provisional original topic MCQs, 136 standalone situation-type questions, 0 genuine Unit 6 shared-stimulus groups, while the **complete Unit 6 learning desk remains planned**. The protected master, its schematic figures and teacher schemes remain outside the public repository.

## Item-by-item science and teaching QA

| Q | Source title / core derivation | Source's suggested FBISE SLO | First-pass QC result | Priority before final student-ready publication |
|---|---|---|---|---|
| **6.1** | Upthrust; fluid pressure top/bottom, `F_B=ρ_f g V_displaced` | B33 | The hydrostatic force-difference derivation for a vertical immersed cylinder is dimensionally consistent and correctly distinguishes buoyancy from aerodynamic lift. The cylinder/symmetric-face example has geometric assumptions and an independently authored schematic. | **Optional:** label cylinder geometry and hydrostatic conditions clearly; visual source/image signoff needed if diagram reused. |
| **6.2** | Archimedes' flotation principle and ships/submarines | B33, B34 | `F_B=W` is right **for a freely floating object in equilibrium**; an immersed object may experience buoyancy without floating. Ships float because weight balances displaced-fluid weight; stability has additional factors. | **Compulsory context:** make equilibrium versus general immersion unambiguous in both short answer and revision questions. |
| **6.3** | Definition of viscosity, `[η]=ML⁻¹T⁻¹`, Pa·s | B41 | Correct distinction of dynamic viscosity from viscous drag. Honey/water comparisons must assume broadly comparable geometry/temperature; gas/liquid temperature tendencies are general, not universal laws. | **Optional:** include units, flow comparison conditions, and mention ideal fluids are a model. |
| **6.4** | Viscous drag; force opposite relative fluid motion; Stokes special case | B42 | Correct distinction of viscosity (property) from drag (force). Stokes `F_D=6πηrv` cannot be used universally for cyclist/raindrop/geese drag. The notes correctly identify a small sphere in Newtonian creeping flow. | **Compulsory:** retain scope restriction when teaching drag examples; do not imply Stokes law covers high-speed aerodynamic shapes. |
| **6.5** | “Derive” Stokes law by dimensional analysis | B42 | Power matching correctly yields `F_D=kηrv` for the **assumed input variables**. **Dimensional analysis cannot produce `k=6π`**; the prepared explanation explicitly says this comes from a full hydrodynamic solution, and requires very-low-Re conditions/boundary assumptions. | **Compulsory:** preserve this explicit distinction, especially in assessment solutions; do not describe dimensional analysis alone as an exact derivation of the numerical factor. |
| **6.6** | Terminal velocity using Stokes drag | B42 | `v_t=2ρ_sgr²/(9η)` follows from `mg=6πηrv_t` **only when buoyancy is neglected**; prepared notes also correctly show `v_t=2(ρ_s−ρ_f)gr²/(9η)` when buoyancy is included. Both assume low-Re Stokes regime. | **Compulsory:** identify textbook approximation, sphere/medium density symbols, buoyancy and regime; avoid universal `v_t∝r²` for large/high-speed bodies. |
| **6.7** | Continuity equation from mass conservation | B36, B37, B38 | `ρ₁A₁v₁=ρ₂A₂v₂` correctly represents steady no-leak/no-accumulation flow using sectional mean normal speeds; `A₁v₁=A₂v₂` follows for incompressible fluid. Pipe squeezing can change total real discharge. | **Compulsory:** show general mass continuity before incompressible simplification; state steady/equal-flow assumptions for the squeezed hose, and distinguish Q [m³/s] from mass flow [kg/s]. |
| **6.8** | Bernoulli's equation via energy balance | B40, B44 | The pressure-work/kinetic/potential-energy steps are algebraically correct: `p+½ρv²+ρgh=constant` along a streamline in the ideal steady incompressible non-viscous setting without pumps/losses. Applications include atomizer, Venturi and an explicitly qualified wing discussion. | **Compulsory:** do not use the ideal relation unchanged in turbulent/dissipative flow or replace a full aerodynamic explanation with an unqualified “equal transit time” myth. Do not certify B39 formative reasoning as a final-exam item on its own. |
| **6.9** | Torricelli's theorem, `v=√(2gh)` | B40 | Derivation correctly cancels equal atmospheric pressures and assumes negligible tank-surface speed, ideal flow and elevation head difference; the illustrative `h=1.25 m,` `g=9.8` gives `√24.5≈4.95 m/s`. | **Compulsory:** display large-reservoir and ideal-loss assumptions; real outlet velocity/discharge may be smaller. |
| **6.10** | Venturi meter; continuity + Bernoulli + pressure columns | B40, B44 | Correct formula `Δp=½ρv₁²[(A₁/A₂)²−1]`, `Q=A₁√{2Δp/[ρ((A₁/A₂)²−1)]}` for ideal same-height flow. `Δp=ρgh` only for the specifically described open pressure tubes containing the same liquid, not every differential manometer. | **Compulsory:** distinguish area ratio from diameter ratio, specify open same-fluid columns vs other manometer fluids, explain loss-free ideal-flow approximation. |
| **6.11** | Superfluidity, wall creeping, persistent vortices, helium transitions | B43 | Source definition and examples align well with B43. “Zero viscosity” is an idealization for the superfluid component, not an assertion that all interactions dissipate zero energy. Quantitative He-4 / He-3 thresholds given in source and references to textbook Figures 6.16–6.17 require original-textbook validation before claiming exact image/data fidelity. | **Optional** scientific refinement; **compulsory** original textbook check if publishing precise phase/temperature numbers or Fig.6.16/6.17 interpretations. |

### Separate teacher amendment register

| Issue | Scope | Priority | Proposed change | Can original remain while adding clarification? |
|---|---|---|---|---|
| CR-01 | 6.2 | **Compulsory** | Explicitly identify floating **equilibrium** when using `F_B=W`; distinguish from immersed/sinking/rising cases. | **Yes**, preserve source Q and annotate answer. |
| CR-02 | 6.4–6.6 | **Compulsory** | Put low-Re Stokes and Newtonian-sphere applicability next to every `6πηrv` relation, especially `v_t∝r²`; distinguish buoyancy-corrected terminal speed. | **Yes**, keep source question, add labelled assumptions and comparison. |
| CR-03 | 6.5 | **Compulsory** | Never claim dimensional analysis derives coefficient `6π`; derive only the proportional form and state that the full result requires hydrodynamics. | **Yes**, the prepared source already does this, so safeguard the qualification in student content. |
| CR-04 | 6.7 | **Compulsory** | State mass continuity first, equal density for `Av=` constant, and fixed-discharge condition of pipe example. | **Yes**. |
| CR-05 | 6.8–6.10 | **Compulsory** | Preserve Bernoulli/Torricelli/Venturi ideal conditions; make outlet/tube pressure and manometer fluid assumptions explicit; distinguish formative B39 from summative B40/B44. | **Yes**. |
| CR-06 | 6.11 | **Compulsory if figures/data are published as NBF-exact** | Verify original Fig.6.16/6.17 and printed helium transition data. | **Yes**, avoid claiming unverified precision until source comparison. |
| CR-07 | 6.1, 6.3 | **Optional** | Add dimensional labels/diagram annotation and state viscosity general-trend limits. | **Yes**. |

**“Compulsory” means a necessary **release/teaching qualification**, not that the existing prepared notes are automatically wrong. The prepared master already includes many of these distinctions. Do not silently reword a textbook question and do not fabricate a different answer key.**

## Source-bound limits

1. **Not confirmed:** The original NBF textbook's exact wording/punctuation on printed exercise p.110 and all original NBF textbook illustrations; source master says it preserves them but is an independently prepared derivative study compilation. Original-figure audit V93 covers only Figures6.2, 6.3, 6.5(c), 6.6—not 6.16 or 6.17.
2. **Not confirmed:** Individual FBISE question-level board eligibility, cognitive tags, final assessment equivalence or ownership/licensing for distributing any original textbook image. The SLO numbers in the prepared answers are **author-suggested alignments** only.
3. **Not published:** 11 comprehensive exercises, private PDF pages, worked solutions or answers as new Unit6 portal content.
4. **Need teacher approval:** Corrective notes/extra questions must first be accepted by the teacher; only after that can V95 create independent, accessible student explanations and diagrams.

## Next work

**V94-B3:** independently recalculate all **11 numerical-response problems** from the compiled master p.330 onwards, auditing stated givens, inferred density/flow conditions, units, rounding, answer-key variants and textbook note discrepancies. Compare the original NBF printed pp.110–111 when available.

**V94-C:** review the seven topic Part B explanations, Part C derivations and Part D assignments against source and framework. Flag each actual problem rather than rewriting full prior work.

**V95:** design the seven-topic, fully integrated `Read → Simulate → Practice → Revise` desk; 560 public original topic MCQs remain unchanged until teacher explicitly approves corrections; the complete Unit6 portal status remains `planned` until rollout passes CI and user signoff.

**V94-B2 branch is documentation-only.** No mutation of original source answers, Test Builder, Firebase, student accounts/grades, textbook scans, billing or permissions. Keep as draft until teacher reviews and CI (if triggered) passes.
