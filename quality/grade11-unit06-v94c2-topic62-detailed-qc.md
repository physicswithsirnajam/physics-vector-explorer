# V94-C2.2 — Grade XI Physics Unit 6 Topic 6.2 detailed academic QC

**Date:** 21 November 2026  
**Topic:** 6.2 — Viscous Drag and Terminal Velocity.  
**Current status:** a detailed source-based first-pass review with reproducible arithmetic checks, **not** authority to publish the private notes or to certify every item as an official FBISE examination question.

## Sources opened and provenance

1. **Owner's actual prepared private source:** `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf` (577 pages), compiled PDF **pp.65–77 Part B**, **78–87 Part C**, **88–98 Part D**. Inspected all **56** numbered Part B questions/quick answers/detailed answers, Part C's **14 top-level explanatory/derivation/reference sections**, and Part D's **32 numbered items**. Representative technical calculations were independently recomputed.
2. **FBISE assessment framework, Grade XI**, PDF pp.11–12: **P-11-B-41** (why real fluids are viscous) and **P-11-B-42** (viscous retarding forces on moving objects) are **Summative / Understanding** official outcomes. Their outcome-level cognitive label must not be misrepresented as official individual certification of this source's authored `K/U/A` exercise tags. B39 is formative but is a *different Bernoulli outcome*.
3. **Original textbook illustrations supplied in prior teacher evidence:** NBF printed **Figure 6.3 (geese)** and **Figure 6.5(c) (speed-time graph)** have undergone a focused V93 visual comparison; Figures 6.5(a)/(b) were also supplied as photographs. **Figure 6.4, original Table 6.1 and the printed source texts/figures surrounding Example 6.2 and Assignment 6.2 are not separately certified in this audit.** The 577-page document is a *prepared solved compilation*, not the NBF textbook scan. Do not commit original NBF photos or the private master PDF.
4. **V94-C2.1 prior milestone:** merged PR #89 audited Topic 6.1. This Topic 6.2 branch was created from main and leaves all live bank/status/authentication systems unchanged.

## Exact inventory of prepared material

| Subsection | Compiled PDF pages | Source inventory | Distinction |
|---|---|---|---|
| Part B — explanations | **65–77** | **56 numbered Q&As** (Q1–14 fundamentals, Q15–42 reasoning/phenomena, Q43–56 worked mathematics and graph reading) | Author-developed learning questions *based on* NBF pp.91–95, not 56 verbatim textbook end-unit questions |
| Part C — mathematical development | **78–87** | **14 numbered sections**, including viscosity units, full Stokes/terminal-speed derivations, buoyancy-corrected extension, formula inversions, Reynolds plausibility, 8 supplementary numerical practices, and error checklist | Clearly distinguish original textbook equations and Example6.2/Assignment6.2 from extra derived material |
| Part D — examples and activities | **88–98** | **32 items**: **14 textbook-guided**, **2 explicitly numbered textbook tasks (Example6.2 and Assignment6.2)**, **16 supplementary problems** | “Textbook-guided” is *not* “original NBF printed question” |

## Part B — detailed question-range findings

**Q1–14 (viscosity, temperature, units, Stokes drag).** Core definitions and `Pa s = N s m⁻² = kg m⁻¹ s⁻¹` equivalence are correct. Most liquids generally lose viscosity as temperature rises, while most gases show the opposite trend; these are **typical material trends**, not universal laws. The numerical `Table 6.1` values (water **1.0016 mPa s**, honey **2000–10000 mPa s**, glycerin **1410 mPa s**, etc.) are taken from the *prepared copy* and require comparison with original NBF printed p.92 before labelling them “exact original values” in V95. Stokes' `6πηrv` is a **sphere creeping-flow relation**, not an all-object drag formula.

**Q15–24 (physical reasoning).** Honey and water through same cup hole: compare geometry, pressure head, fluid properties and temperature; the large viscosity difference explains the intended example without implying identical actual discharge for all conditions. Drag in water/air rises with relative movement, but high-speed hands, swimmers, vehicles and birds should **not** be quantified by Stokes' sphere law. Q22's moving-car hand is **thought/discussion only** and must never invite students to extend their hands outside moving vehicles.

**Q25–42 (terminal forces, geese, paratrooper).** Terminal speed is **constant nonzero velocity at zero net force**, not cessation of gravity or drag. A buoyancy-inclusive terminal condition has `mg-F_b-F_d=0`; the textbook `mg=F_d` is a simplified approximation. Q30's resultant from downward **0.020 N** and upward drag **0.008 N** is **0.012 N downward** before any other forces. The first/second steady parachutist speeds are approximately **50 m/s and 8 m/s**; opening near **42 s**, landing near **70 s**, and the approximately 5-second deceleration interval are **graph readings**, not exact field measurements. V-formation and air posture are *aerodynamic* examples, not low-Re sphere examples.

**Q43–56 (14 quantitative/graph items).** Independently checked the source's Stokes drag, inverse quantities, speed proportionalities and parachutist graph arithmetic. Notably:
- **Q43:** formal textbook Example 6.2 `r=2 mm, v=2 m/s, η=1.9×10⁻⁵ Pa s` gives `6π ηrv≈1.43×10⁻⁶ N` mathematically, but a supplementary Reynolds estimate with typical `ρ_air≈1.2 kg/m³` gives `Re≈505`; this is **not physically within creeping flow**. Preserve the printed worked calculation *as a textbook algebra exercise* with a conspicuous model-validity warning; do not imply this is measured real aerodynamic drag.
- **Q44:** `3.58×10⁻⁷ N`; **Q45,46,47:** Stokes drag doubles under the specified factor of two in radius, speed or η **if** the model stays valid; **Q48:** `1.88×10⁻⁷ N`.
- **Q49:** `r=1.00×10⁻³ m`; **Q50:** `η=1.00×10⁻³ Pa s`; **Q51:** `v_t≈5.20×10⁻³ m/s`; **Q52:** `v_t≈2.18×10⁻⁴ m/s`; **Q53:** ratio 9:1; **Q54:** one-third; **Q55:** high/low graph speed ratio 6.25; **Q56:** `v_t≈10.9 m/s`, again **only** the formal simplified Stokes-model output.
- **Q56/Assignment6.2:** Actual prepared prompt supplies `r=0.3 mm` and `η=1.8×10⁻⁵ Pa s`, but the original as quoted does **not** give drop density; source assumes water `1000 kg/m³` and `g=9.8`. Using supplementary air density `1.2 kg/m³` to test the result gives `Re≈436` and invalidates the low-Re physical interpretation. A more realistic droplet model needs non-Stokes aerodynamic drag; **do not invent an NBF “correct” measured terminal speed.**

**Conclusion on Part B answers:** No compulsory *algebraic answer-key replacement* identified in the checked numerical outputs. The compulsory issues are source-number integrity, assumptions, scope of model, physical realism and board-certification language. The above is an instructional scientific review; it is not source-to-NBF-exact transcription certification for all 56.

## Part C — 14-section derivation and supplemental-maths review

| Section(s) | Verified concept/equation | Compulsory scope note |
|---|---|---|
| §§1–4 | Dynamic viscosity in SI; `[η]=ML⁻¹T⁻¹`, `[ηrv]=MLT⁻²` | A dimensional check establishes consistency of Stokes force; **cannot derive its numerical `6π` coefficient** or demonstrate its range of applicability |
| §5 | `mg=6πηrv_t`; with `m=(4/3)πr³ρ_s`, derive `v_t=2ρ_sgr²/(9η)` | A small sphere; downward settling; weight and Stokes drag, **buoyancy omitted**; very-low-Re regime |
| §6 | Buoyancy-aware extension `v_t=2(ρ_s−ρ_f)gr²/(9η)` | A **separate prepared-source enrichment**, not the original simplification; sign of velocity depends on density difference and selected positive direction |
| §§7–8 | Rearrangement, `r=√(9ηv_t/(2ρ_sg))`; `v_t∝r²`, `v_t∝1/η`; diameter form | Model parameters fixed; changing radius/viscosity may invalidate the creeping-flow assumption |
| §9 | `a=g(1−v/v_t)` from `ma=mg−6πηrv` | This acceleration formula is only for **the simplified linear-drag model** starting downward with v defined consistently; do not use for paratroopers |
| §§10–11 | Explicit slow-flow limitation, graph stages, Example6.2 and Assignment6.2 | **Exemplary warning already present** that 10.9 m/s real-raindrop prediction is not self-consistent |
| §12 | Eight source-created worked exercises (including viscosity inversions and buoyancy correction) | Correctly identify them as **supplementary**; note Re test uses **supplementary** air density 1.2 kg/m³ |
| §§13–14 | Formula register and common-error checklist | Keep signed directions, sphere-versus-fluid density, unit conversions and uncertainty of source models clear |

Selected independent arithmetic includes supplementary Practice 1 `1.508×10⁻³ N`, Practice 2 `0.015915 Pa s`, Practice 3 `1.089×10⁻⁵ m/s`, Practice 4 `r≈0.606 mm`, Practice 7 `1.026×10⁻⁶ N` and Practice 8 `Re≈435.6`. These formula steps are independently verified by the versioned test.

## Part D — 32-item classification and answer audit

- **Q1–14 textbook-guided only:** Honey/water, viscosity-temperature trends, table, hand in water/air, geese, swimmers, Stokes applicability, raindrop-force sketch and paratrooper phases. Separate **V93-verified Figure6.3** and **Figure6.5(c)** from **unverified original Figure6.4 and Table6.1**. Avoid exposing private scans in public GitHub.
- **Q15 = original Example6.2, Q16 = original Assignment6.2:** Source asks for calculated `1.43×10⁻⁶ N` and `10.9 m/s` in simplified formula, respectively. Preserve these as **formal school-model outcomes**, with explicit **Re≫1** warning and the unstated droplet-density assumption for Q16.
- **Q17–32 supplementary:** Dimensional check, unit conversion, Stokes variable inversions, speed and radius factors, buoyancy-corrected setting and approximate parachutist graph calculations. Checked: Q18 `1.0016×10⁻³ Pa s`; Q19 `1.410 Pa s`; Q20 `9.048×10⁻⁵ N`; Q24 `0.100 m/s`; Q25 `1.00 Pa s`; Q26 `5.44×10⁻⁵ m/s`; Q30 `8.17×10⁻⁴ m/s`; Q31 `−8.4 m/s²` (downward velocity positive), Q32 kinetic-energy ratio `39.0625`. The quoted “5 s” graph duration is approximate, not a precisely measured interval.
- An illustrative *original reconstruction* of the paratrooper graph is included in the **prepared private source**. If V95 needs a graph, use the existing **V90 originally authored educational SVG**, and verify axes, time labels and alt text. Do not copy either a scanned textbook graphic or private PDF artwork automatically.

## Teacher amendment register (only attention-worthy items)

| ID | Where | Priority | Reason/action | Keep original and add a note or extra item? |
|---|---|---|---|---|
| **T62-01** | Part B Q43, Part C §11, Part D Q15 | **Compulsory** | Example6.2's algebra yields 1.43×10⁻⁶ N; at the stated scale an independent *supplementary* Re estimate is ≈505, outside creeping flow. **Display prominent “formal Stokes-model calculation, not a validated physical measurement” note.** | **Yes** |
| **T62-02** | Part B Q56, Part C §§10–12, Part D Q16 | **Compulsory** | Assignment6.2 omits water density and produces formal ≈10.9 m/s with Re≈436; explicitly assume ρ=1000 kg/m³, g=9.8 and model limitations; **do not present as real rain-drop velocity**. | **Yes** |
| **T62-03** | All invocations of `6πηrv`, terminal-speed proportionalities | **Compulsory** | Show sphere, Newtonian creeping flow, low Re and relevant buoyancy; distinguish `ρ_s` from `ρ_f`; ensure conditions remain when varying radius/speed/η. | **Yes** |
| **T62-04** | Part C §4 / potential “derive Stokes law” captions | **Compulsory** | `[ηrv]=[F]` is a dimensional check; **it cannot produce `6π`**. Preserve author-provided caveat and do not attribute an invented proof to the textbook. | **Yes** |
| **T62-05** | Part B Q30–42, Part D Q7–9, Q11–14, Q31–32 | **Compulsory for scientifically faithful visual teaching** | Air/water drag, geese and parachutes are not slow-moving spheres; graph readings are estimates; distinguish acceleration sign and terminal force balance. Car-window experiment must stay *discussion only*. | **Yes** |
| **T62-06** | Part B Q8–10, Part D Q4–5, Q18–19 | **Compulsory before exact NBF figure/table label** | Check **actual printed Table6.1 on p.92**, especially honey range and water/milk/glycerin viscosity values; prepared numbers are not independent NBF validation. | **Yes** |
| **T62-07** | Part B Q29, Part D Q11, Part C figures | **Compulsory before claiming original NBF figure fidelity** | Need original **Figure6.4** force panel; V93 figure checks covered 6.3 and 6.5(c) but not Fig6.4. Any public drawing must be independently authored, accessible and labelled as educational recreation. | **Yes** |
| **T62-08** | Part B author K/U/A labels / prepared SLO tags | **Compulsory for exam certification** | Official B41/B42 are Summative, **Understanding** outcome descriptions, but item-level labels remain author-generated until reviewed. Do not inherit automatic FBISE cognitive level or guarantee past-paper equivalence. | **Yes** |
| **T62-09** | Part C/D extra Reynolds, inverse and corrected-buoyancy questions | **Optional editorial, compulsory provenance** | Keep these valuable enrichment examples but label them **supplementary**, not source-original prescribed NBF exercise content. | **Yes** |

**Finding:** No checked numeric answer in Part B/C/D requires compulsory replacement based on arithmetic alone. The **physics/model-validity warnings are essential**, and several already appear correctly in the private notes. We should preserve those conditions in the V95 student presentation, not rewrite all 56+32 questions.

## Next steps and release boundaries

1. Teacher reviews the nine issue entries and approves preserving original wording while adding *explicit* modelling/figure/SLO/provenance notes as appropriate.
2. Obtain original NBF printed **pp.91–95** (especially Table6.1, Fig6.4, Example6.2/Assignment6.2 wording) only when necessary to claim exact textbook-source fidelity; clear teacher-owned source evidence remains private.
3. Continue **V94-C2.3 through C2.7** in order for remaining Topics 6.3–6.7. Do not skip individual evidence and exercise QC for the sake of an earlier Unit 7 launch.
4. Proceed to V95 after academic signoff: seven integrated `Read → Simulate → Practice → Revise` modules using existing five public Unit6 simulations, 560 provisional public MCQs, independently authored figure references, and transparent summative/formative boundaries. Keep teacher marking schemes and uploaded source PDFs private.
5. This PR changes **only** a QC document, a source-independent Node calculation regression and its GitHub Actions workflow: **no live question flags, no public answers, no bank count/status changes, no Firebase/admin/account changes, no payment flows.**
