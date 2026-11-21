# V94-C2.5 — Grade XI Physics Unit 6 Topic 6.5: Bernoulli's Equation — academic quality review

**Review date:** 21 November 2026. **Prerequisite:** PR #92 (Topic 6.4) independently verified merged into `main`. **Release classification:** academic audit and arithmetic regressions only; NO student content / question-bank / user-account changes.

## Sources actually examined (private, not included in this public repository)

- Owner's 577-page prepared master `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`: compiled **pp.197–206** (Part B: **56** Quick Revision/Board-Ready Q&As), **pp.207–219** (Part C: **12 numbered sections**, including the full Bernoulli derivation, **14 supplementary fully worked applications**, and **8 self-checks**), and **pp.220–226** (Part D: **32 textbook-guided/supplementary tasks**, including **12 independently authored numerical questions Q21–Q32**).
- Official Grade XI Physics FBISE framework `11_Physics_HSSC_I_model_paper_50_percent(9).pdf`, compiled PDF **pp.11–12**: **P-11-B-40 — Summative, Application** explicitly covers **horizontal AND vertical fluid flow**. **P-11-B-39 — Formative, Application** concerns explaining pressure differences from different rates of fluid flow and is **not by itself a final-theory-exam SLO**. The owner-prepared paper's question-level K/U/A labels are author-developed practice metadata, **not official per-item certification**.
- Owner-prepared figures: an **original teaching schematic corresponding conceptually to NBF Figure 6.9** appears in Part C p.208 and Part D p.220. The original textbook's printed **pp.99–101** and actual printed **Figure 6.9** were **not independently compared page-by-page** in this review. No original NBF scans, screenshots, extracted artwork or private master pages may be uploaded to GitHub.

## Structure / provenance record

| Section | Compiled pages | Verified source organization | Source integrity guard |
|---|---|---|---|
| Part B | 197–206 | **56** original teacher-authored Q&As: Q1–14 concepts, Q15–28 derivation reasoning, Q29–42 physical cases, Q43–56 numerical practice | They are not 56 verbatim NBF textbook questions. Source independently labels its **14 final calculations as additional numerical practice**. |
| Part C | 207–219 | **12** sections: objectives/assumptions; 12-step pressure-work derivation; dimensional equality; three energy forms; horizontal/equal-speed/equal-pressure cases; formula rearrangements; continuity coupling; numerical method; **14 supplementary worked examples**; common errors; **8 self-checks**; formula sheet | Textbook equation chain **6.11–6.21** is *described as an expanded derivation*; extensions and all Part C numerical examples are **not NBF numbered examples**. |
| Part D | 220–226 | **32** questions: **Q1–8** Fig6.9 guided derivation, **Q9–16** concepts, **Q17–20** scenarios, **Q21–32** twelve supplementary worked numericals | Part D explicitly states **no separate numbered NBF example/assignment** in §6.5. Figure6.9 illustration is separately authored, not a reproduction. |

## Part B, all 56 source questions — focused findings

- **Q1–14:** The prepared source gives `P + ½ρv² + ρgh = constant` along a streamline for steady, incompressible, effectively inviscid flow without loss/pump work. Each term is **J/m³ = Pa** (pressure work per unit volume, kinetic-energy density, gravitational-energy density). **Static pressure P must not be confused with dynamic pressure ½ρv²**. The term “pressure energy” is school-level **flow work**, not an invitation to claim a stationary fluid stores all such energy in one scalar `P`.
- **Q15–28:** Upstream work `+P₁A₁Δx₁`, downstream work `−P₂A₂Δx₂`, equal transported `ΔV` from incompressible continuity, `m=ρΔV`, and `W=ΔK+ΔU` lead algebraically to the two-point Bernoulli equation. The derivation uses the **same interval** and **same mass** on a single steady streamtube, not an arbitrary pair of cross-streamline points. Supplementary Q28 correctly flags energy dissipation in real flow.
- **Q29–42:** Horizontal flow cancels `ρgh`; equal speed cancels `½ρv²`; unequal speed **and** height require evaluating both contributions. Q40 correctly rejects guessing pressure direction for rising but decelerating flow without numerical comparison. **Q41** consistently distinguishes gauge vs absolute pressure; **Q42** correctly uses one common height datum. Continuity alone does not determine pressure. Statements such as “higher speed means lower static pressure” apply only under appropriate ideal comparison conditions, never universally.
- **Q43–56:** Fourteen independent arithmetic applications were recalculated in a dedicated test. Source results agree under stated ideal-fluid assumptions: **204 kPa; 167.2 kPa; 5.29 m/s; 16 kPa; 151 kPa; 202.8 kPa; 160 kPa; 5.0 m; 137.4 kPa; 2.0 m; 4.9 m; 16.5 m; 39.4 kPa; 4.90 m/s**. Numerical data are teacher-developed exercises, not original NBF textbook exercise items.

## Part C, 12 sections / 14 worked examples — derivation and model review

| Source range | Independent academic finding | Presentation qualification |
|---|---|---|
| §§1–3 | Textbook-derived pressure-work/energy derivation, `W=(P₁−P₂)V`, `P₁+½ρv₁²+ρgh₁=P₂+½ρv₂²+ρgh₂`, and dimensions `ML⁻¹T⁻²` agree. | Display the signed outlet work, matching mass, equal transported volume and actual height **difference**. Raw text extraction misplaces some exponents/Greek letters; verify actual HTML equation rendering rather than silently altering verified PDF graphics. |
| §4 | Equivalents per volume, per mass and **head** (metres): `P/(ρg)+v²/(2g)+h=H` are dimensionally correct. | Keep pressure/energy **per volume vs per mass vs per weight** distinct; the head form is an explicitly marked **extension**. |
| §§5–6 | Horizontal, equal-speed, equal-pressure special cases, and signed rearrangements for pressures, speed, elevation and density agree. | Require same streamline, density, height datum, and **nonnegative speed squared** for real solutions. Do not announce unqualified density inferred from insufficient data. |
| §§7–8 | Coupling continuity `A₁v₁=A₂v₂` and Bernoulli correctly uses **diameter squared** for circular pipes. | Both conservation assumptions must hold; a real narrowing pipe can have turbulence or frictional losses. |
| §9: Worked 1–14 | All 14 independently recomputed values agree with their stated rounded keys (see regression), including **169.5 kPa**, **157.7 kPa**, **3.50 m/s**, **169 kPa**, **22.18 m total head**, **6.0 m/s & 183.125 kPa**, **100965 Pa**, **600 J**, **13.6 kPa**, **1.22 m**, **5.56 m/s & 13.43 kPa**, **5.29 m/s**, **114 kPa**, **136.4 kPa**. | These are explicitly **supplementary teacher-authored**, not numbered NBF textbook applications. Source air-density estimate assumes near-constant density. |
| §§10–12 | Common mistake register, **8** self-check answers and consolidated exam formulas are logically consistent. | Do not mix **Pa/kPa**, use velocity **squared**, keep vertical elevations signed, preserve `ρg h` unless heights equal; note source's supplementary head form and clearly separate **B39 Formative** from **B40 Summative**. |

## Part D, all 32 questions — source and calculation checks

- **Q1–8:** Figure6.9 guided concept/pressure-work steps are coherent. Pressure forces act with different work signs; if height and speed both change, neither the highest point nor the widest point automatically has higher pressure without numerical evaluation.
- **Q9–16:** Bernoulli term units, model assumptions, horizontal and equal-speed simplifications, and limitations from friction/pumps are consistent. No NBF numbered Example/Assignment occurs in the prepared section.
- **Q17–20:** Numerical pressure trends in a narrowing/widening pipe or a rising tube require the stated ideal/no-loss and geometry conditions. A claim that pressure **always** decreases with greater height is incorrect when the flow also decelerates substantially.
- **Q21–32:** **12** authored worked problems independently recalculated: **144 kPa; 8.94 m/s; 183.2 kPa; 196.4 kPa; 40.8 kPa; 8.98 m; 1000 kg/m³; 196.2 kPa; 10.34 m/s; 190.6 kPa; 420 J; ΔK=120 J, ΔU=196 J, W=316 J, P₂=154.2 kPa**. Q27 density inference assumes physical ideal conditions, and Q32's work is *net pressure work on the tracked fluid volume*, not generic total work by every force.

**Arithmetic verdict:** No mandatory replacement of a checked original *prepared numerical result* identified. Scientific caveats, provenance and per-item assessment labels require explicit V95 student-facing review. This does not independently certify original printed NBF pp.99–101 or every item as official FBISE past-paper material.

## Teacher amendment register — only attention-worthy items

| ID | Where | Priority | Safe improvement | Original may remain + clarification? |
|---|---|---|---|---|
| **T65-01** | All Bernoulli formulas, B Q1–14, C §§1–6, D Q9–16 | **Compulsory model assumptions** | State `steady`, incompressible `ρ=constant`, negligible viscosity/loss, same streamline, no external pumps/turbines, consistent gravitational datum. Do not present as exact for all real flows. | **Yes**, preserve checked source and add assumptions card. |
| **T65-02** | B Q15–28, C §2, D Q2–7 | **Compulsory for scientific derivation** | Label outlet pressure work **negative**, common `Δt`, same `m` and common `V`; verify each step and indices in accessible HTML and print. | **Yes**. |
| **T65-03** | B Q30–42, C §§5–7, D Q14/Q17–20 | **Compulsory conclusion boundaries** | Speed–static-pressure comparison only for comparable points under ideal Bernoulli; rising height and decreasing speed act in **opposite** directions. Continuity is distinct from energy conservation. | **Yes**. |
| **T65-04** | B Q41–42; all numericals; C formula sheet | **Compulsory numerical presentation** | Use one pressure reference convention (gauge/absolute), one height datum, Pa/kPa conversions, squared velocities, physically meaningful sign/radicand; head and energy-density units must not be interchanged. | **Yes**. |
| **T65-05** | All Part B SLO/cognitive tags; C §§1/11–12; D Q17–20 | **Compulsory before FBISE certification** | **P-11-B-39 is Formative**, B40 is Summative/Application; author `K/U/A` tags don't certify an item and background Bernoulli-effect questions do not become separate summative B39 questions merely by being in this chapter. | **Yes**. |
| **T65-06** | B Q15–25; C p.208 schematic; D p.220 illustration/Q1–8 | **Compulsory before exact-art claim** | Original **NBF Figure6.9** and printed p.99–101 wording still need direct comparison. Use the prepared **independently drawn teaching diagram** only after checking axes/labels/alt text; no scans from NBF textbook. | **Yes**. |
| **T65-07** | C §§4/6–9; B Q43–56; D Q21–32 | **Compulsory provenance** | Head calculations and numerical examples are **teacher-authored enrichment**, not NBF-numbered examples; keep prepared values and differentiated student/teacher presentation. | **Yes**. |
| **T65-08** | All web transfer of equations and graphs | **Compulsory technical QA** | Verify `½ρv²`, `ρgh`, `ρg`, `Δx`, exponents, signed height differences and pressure-unit labels at **390px mobile**, projector and print; PDF extraction artifacts aren't proof of source errors. | **Yes**. |
| **T65-09** | Source reports / marking schemes | **Optional independent depth; compulsory if promising complete exam readiness** | Add a separate teacher-reviewed horizontal-and-vertical mixed assessment that actually covers full **B40**; do not certify full outcome from a single pressure-drop conceptual exercise or claim full NBF original-fidelity without printed pp.99–101. | **Yes**, add supplemental problem set. |

**Recommendation:** Preserve the existing 56+32 question wording and checked answers; teacher approves focused assumptions/source/SLO labels before inclusion in V95. No blanket reworking of authored answers is justified by the current first-pass evidence.

## Automated arithmetic and release boundary

The accompanying source-independent Node test recalculates **all 14 Part B numeric items, 14 Part C worked examples, 8 Part C self-checks, and 12 Part D numerical items**, including multi-result checks and immutable live bank invariants: **Unit6=560 provisional source MCQs**, **Grade XI=2,250**, 136 separate situations, zero original figure holds, full Unit6 course `planned`. The test does not certify question wording against the original NBF textbook or mark every authored exercise FBISE summative.

No student-facing portal code, original MCQs, textbook scans, private owner PDF, teacher-only keys, school scores, auth/Firebase rules, billing, or full-course status is changed. After approval, continue **V94-C2.6 Bernoulli Applications**, then **V94-C2.7 Superfluidity**, followed by **V95 — integrated Unit 6 Read → Simulate → Practice → Revise**.
