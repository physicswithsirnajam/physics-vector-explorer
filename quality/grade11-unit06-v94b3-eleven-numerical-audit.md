# V94-B3 — Independent audit of all 11 Unit 6 end-of-unit numerical-response problems

**Date:** 20 November 2026  
**Owner-directed sequence:** V94-A (source inventory) → V94-B1 (11 short responses, merged) → V94-B2 (11 comprehensive responses, **PR #86 open, not merged when B3 began**) → V94-B3 (this independent audit) → V94-C (seven-topic lesson QC) → V95 (complete Unit 6 Learning Desk). This branch was created from **main** and is documentation/testing only, with no student-facing dependency on the unmerged V94-B2 PR.

## Source and proof boundaries

**Source actually read:** User-owned, private `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`, pages **330–337 of 577**: 11 prepared solved numerical exercises, steps, original-book answer comparisons asserted by the prepared notes, and source uncertainty notes. Original Grade XI NBF book **printed pages 110–111** are cited by this *derivative* solved compilation but **were not independently opened** for this 11-exercise audit. Therefore, statements such as “NBF prints 0.72 kg/m³” are explicitly **reported by the owner's prepared source, pending direct confirmation**, not a certified transcription of the actual textbook.

**Framework:** Previously accessed user's official `11_Physics_HSSC_I_model_paper_50_percent(9).pdf`, framework PDF pp.11–12, NCP Grade XI 2022–23 / Scheme 2024. Summative physics-outcome descriptions relevant to these numerical problems include B33 (Archimedes), B36 (continuity calculations), B40 (Bernoulli horizontal/vertical application); B44 describes Bernoulli real-life application, and B42 covers viscous retardation. B39 is **formative** and must not be silently assessed as summative in written theory exams. Per-item SLOs are **candidate alignment**, not official board item certification.

**Independent arithmetic:** All numeric results below were **recalculated with a separate Python mathematics check**, rather than merely copied from the prepared key. The symbolic Torricelli result was derived from stated Bernoulli assumptions, not numerically recalculated. The prepared question text/options, student-bank keys and live portal remain untouched.

## Problem-by-problem independent calculation

| No. | Prepared numerical input / relation | Independent result (before rounding) | Prepared master answer | First-pass outcome |
|---|---|---|---|---|
| **6.1** | `vₜ=2.98×10⁻³ m/s; η=1.9×10⁻⁵ Pa·s; r=√(9ηvₜ/(2ρₛg))` assuming water droplet `ρₛ=1000 kg/m³, g=9.8` | **5.098919453×10⁻⁶ m** | 5.10×10⁻⁶ m | **Agrees conditionally:** density isn't supplied in quoted problem; low-Re Stokes, negligible air buoyancy, constant g. |
| **6.2(a)** | `Q=π(0.0160/2)²×2.00` m³/s, multiply by 1000 L/m³ | **0.4021238597 L/s** | 0.402 L/s | **Agrees.** |
| **6.2(b)** | `d₂=0.0160√(2/15)` m, ×100 cm/m | **0.5842373947 cm** | 0.584 cm | **Agrees:** same steady incompressible discharge. |
| **6.3** | `Q=5.0×10⁻³/60 m³/s, A=π(0.010)² m², v=Q/A` | **26.52582385 cm/s** | ≈27 cm/s | **Agrees with rounding:** mean speed, not local speed; ignores pulsatility. |
| **6.4** | `d₂=4√(2/4)` cm | **2.828427125 cm** | ≈2.8 cm | **Agrees:** equal steady discharge. |
| **6.5** | `v₂=√(5.4²−2×9.8×1.3)` m/s | **1.918332609 m/s** | ≈1.9 m/s | **Agrees only** if same effective supply energy head, atmospheric exit pressures, no losses. |
| **6.6(a)** | `Q=5×10⁻³ m³/s; A₁=25×10⁻⁴ m², A₂=4×10⁻⁴ m²; vᵢ=Q/Aᵢ` | **2.0 m/s**, **12.5 m/s** | 2.0, 12.5 m/s | **Agrees.** |
| **6.6(b)** | `Δp=½×1000×(12.5²−2.0²)` | **76,125 Pa** | ≈7.6×10⁴ Pa | **Agrees:** horizontal steady ideal flow with no head losses. |
| **6.7** | `p₁=1.01×10⁵+½×1000×(25.5²−1.96²)` Pa | **424,204.2 Pa absolute** | 4.24×10⁵ Pa absolute | **Agrees conditionally:** water density 1000 kg/m³ is assumed but omitted from the quoted problem. Must not confuse gauge/absolute pressure. |
| **6.8** | Open large reservoir, `p₁=p₂=p_atm`, negligible `v_surface`: `gh=½v²` | **v=√(2gh)** | √(2gh) | **Symbolic derivation agrees:** h from surface to orifice, ideal negligible losses. |
| **6.9** | `v=33.8 m/s; Δp=4.12×10⁵ Pa`; `ρ=2Δp/v²` | **721.2632611 kg/m³ = 0.7212632611 g/cm³** | ≈721 kg/m³ ≈0.72 g/cm³ | **Agrees with corrected SI unit under gauge-pressure interpretation.** Prepared source reports original printed answer **0.72 kg/m³**, a factor-1000 unit inconsistency **pending actual printed NBF p.111 confirmation**. If 4.12×10⁵ Pa were **absolute** tank pressure against 1.01×10⁵ Pa atmosphere, ideal pressure-only calculation gives **≈544.45 kg/m³** instead. |
| **6.10** | `Δp=½×1.29×(30²−20²)` Pa | **322.5 Pa** (bottom minus top) | 322.5 Pa | **Arithmetic agrees**, but comparing the wing's top/bottom using simple Bernoulli needs a suitable common upstream total pressure/energy assumption; aerodynamic lift depends on full pressure field, not merely two chosen local velocities. |
| **6.11** | `(ρ_air−ρ_H2)gV−W_empty=(1.3−0.09)×9.8×10−80` N | **38.58 N** | 38.58 N | **Agrees:** maximum additional payload **WEIGHT** in newtons, not mass; fixed densities, volume and no other load. The prepared source retains original unusual “metrological balloon” wording. |

**Result:** 11/11 prepared exercises' final values are algebraically/numerically compatible with the stated models. This **does not mean all 11 wordings are self-sufficient or all printed textbook answers are correct**. Problems **6.1, 6.7 and 6.9** have particularly important missing/ambiguous givens, and 6.5/6.6/6.10 need ideal-flow qualifiers. All calculations are recorded separately; no prior source text was overwritten.

## Teacher-focused issue register

| Issue ID | Problem | Type and severity | Required handling | Can preserve original and add a clearer separate item? |
|---|---|---|---|---|
| NUM-01 | **6.9** | **Compulsory — major unit/pressure ambiguity** | Do **not** label `0.72 kg/m³` correct: under gauge-pressure driving head the SI result is `721 kg/m³`. **First inspect actual NBF printed p.111** before declaring a textbook printing error. Explicitly specify gauge pressure / outlet pressure assumptions; if treating pressure as absolute, recalculate with atmospheric subtraction. | **Yes**, retain textbook-exact quoted statement and append a conspicuous teacher correction/alternative version after source verification. |
| NUM-02 | **6.1** | **Compulsory — unstated density** | Supply/label water-droplet density assumption `1000 kg/m³` and low-Re/air buoyancy simplification. Without density, a unique numeric radius is not determined. | **Yes**; preserve question and add assumed givens box. |
| NUM-03 | **6.7** | **Compulsory — unstated water density & pressure basis** | Label density `1000 kg/m³` and differentiate `4.24×10⁵ Pa absolute` from gauge pressure. | **Yes**. |
| NUM-04 | **6.5, 6.6, 6.8** | **Compulsory — ideal-flow modelling** | Clarify no-loss, equal-head/level assumptions, relation of atmospheric pressure, large-reservoir condition and dimensional units. For 6.5 the supply head may change when lifting a real hose. | **Yes**. |
| NUM-05 | **6.10** | **Compulsory — oversimplified lift model** | Preserve school-level pressure arithmetic while identifying its assumed common upstream total pressure and clarifying that aerodynamic lift is governed by full pressure distribution/momentum transfer. | **Yes**. |
| NUM-06 | **6.2, 6.3, 6.4, 6.6** | **Optional to compulsory depending on presentation** | Reinforce `A∝d²`, `1 cm²=10⁻⁴ m²`, `1 L=10⁻³ m³`, `Q=Av` for sectional mean velocity, and steady flow. Essential if these are presented as automatically graded numerical answers without assumptions. | **Yes**; add distinct worked steps. |
| NUM-07 | **6.11** | **Compulsory output-label accuracy** | Answer is **payload force/weight** `38.58 N`, not payload mass. Density and displaced-air arguments must be distinguished. | **Yes**. |

**No source mutation:** All recommendations above concern teaching presentation, condition flags, independently authored question variants, or a prospective teacher-approved correction record. No original NBF question wording, private PDF, source answer key, current Unit6 original MCQ bank, status flags or source figures are changed.

## Future V95 acceptance criteria for numericals

1. Teacher reviews the 7 issue rows and approves any clarifications before exposing a textbook-exercise answer or automatic marking.
2. Directly inspect the **original NBF textbook printed pp.110–111**, especially **6.9 reported unit** and **6.1/6.7 missing variables**, before giving students a definitive “textbook correction.” If originals unavailable, label the result as confirmed against the *prepared copy only*.
3. Store source-exact problem separately from the *explicit-assumption worked version*; maintain precise units, boundary conditions, rounding, SLO candidate and teacher decision per item.
4. Expose the idealization `ρg` / pressure unit assumptions to students; distinguish **formula, substitution, unit analysis and final answer** in numerical practice and solution review.
5. Keep topic-candidate official B33/B36/B40/B42/B44 distinct from item-level FBISE certification. Do not classify official formative B39 as summative.
6. Add tests for 11 results and conditional branches (including both interpretations of pressure in 6.9), mobile/projector legibility, figures and answer review **before** enabling interactive auto-scoring.
7. The current full Unit6 Learning Desk remains `planned`, existing 560 source MCQs/2,250 GradeXI unaffected, and original private source files never published on public GitHub.

## Status

**V94-B3 audit complete for numerical consistency with prepared source:** 11 exercise solutions independently recalculated, all match their stated model assumptions. **Source-to-original textbook fidelity and teacher approval remain pending.** This is a documentation-only review pending its own draft PR merge gates. Independent V94-B2 PR #86 was open at the start of this work; do not assume or imply its merge by opening B3.
