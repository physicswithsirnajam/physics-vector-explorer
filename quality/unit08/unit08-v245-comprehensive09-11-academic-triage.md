# V245 — Original NBF Grade XI Unit 8 Comprehensive Questions 8.9–8.11: source and academic quality review

## Source directly inspected

After **PR #347 / V244 was confirmed merged**, the owner-provided original scanned **NBF Physics Grade XI Unit 8** was directly re-opened. Exact SHA-256: `00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe`.

- Original printed **p.153** contains the final three **Comprehensive Questions 8.9, 8.10 and 8.11** (refrigerator, entropy, entropy/energy degradation).
- Source **pp.145–147** contain the refrigerator and cooling/heating COP material and original **Figure 8.18**; **pp.147–149** contain entropy discussion, original **Figures 8.19–8.20** and worked Example 8.6.
- The original complete section was inspected visually; **no OCR, source scan image or verbatim publisher question has been copied into GitHub**.
- Existing V235 source inventory confirms **10** visibly numbered original comprehensive questions: **8.1–8.7 and 8.9–8.11**. The source **skips comprehensive 8.8**, though V224 historically claimed 11. **Preserve the discrepancy and never manufacture missing 8.8**.

This PR is **teacher-facing preliminary academic QC metadata only**, not an answer key, teacher-certified marking scheme, source-text correction, student simulation, or graded Test Builder release.

## Teacher-facing triage: only what needs qualification

| Original comprehensive item | Decision before a certified answer | Science and source fidelity | Keep original or add? |
|---|---|---|---|
| **8.9 — refrigerator** | **COMPULSORY ideal-COP/model and energy-flow explanation.** | The original source describes a reversed heat-engine cycle: useful refrigerator effect is heat **Q_C removed from the cold region**, enabled by external **work W_in**, with **Q_H=Q_C+W_in** rejected to a warmer environment. **Cooling COP=Q_C/W_in**; **heating COP=Q_H/W_in**. Original p.146 also prints **COP_C=T_C/(T_H−T_C)** after a broad “heat proportional to absolute T” statement. **This temperature formula is only the reversible Carnot limit, not the COP of a general or real compressor.** Original p.147 Example 8.5 is explicitly ideal; never silently apply it to real equipment. | **Keep original comprehensive question** and Figure 8.18 reference; prepare an independently verified, correctly labelled flow diagram later only if teacher-approved. |
| **8.10 — entropy** | **COMPULSORY entropy definition, equation domain and melting-sign correction in teacher explanation.** | Entropy **S** is a state variable (unit **J K⁻¹**). General definition for a reversible elementary transfer is **dS=δQ_rev/T**, with finite **ΔS=Q_rev/T only for reversible isothermal exchange**. A simplified “randomness/disorder” picture is not a universal entropy definition. **Textbook p.148 incorrectly says melting ice releases heat and entropy decreases**, contradicting p.149 Example 8.6, which correctly uses **positive ΔS** for melting. Textbook p.149 also says every reversible process leaves system entropy fixed—incorrect for reversible heat transfer; **zero entropy generation** belongs to the combined reversible whole. | **Keep original question**. Preserve publisher contradictions as explicit source flags; do **not** reproduce the wrong claims as correct teaching or publish a solved edition until verified. |
| **8.11 — explain energy degradation using entropy** | **COMPULSORY energy-conservation, boundary and availability explanation.** | Irreversibility **generates entropy** and reduces potential useful work relative to a specified environment (**exergy**); it does **not destroy total energy**. For an **isolated combined system**, ΔS_total ≥ 0, with equality for ideal reversible changes. A **non-isolated part** may lose entropy by exporting heat/matter. Original p.149 overgeneralizes that natural processes always increase the system entropy and that all reversible system processes have constant entropy. The assertion that “all heat was available for work” before entropy change is also scientifically too broad. | **Keep original question**. Qualify the system boundary and reversible/irreversible cases; an original visualization may be designed later only after source and teacher QC. |

**No defective printed exercise-question stem is newly established here.** These compulsory controls concern the *chapter's explanations and the future solutions*, not replacement of the original exercise questions.

## Independently verified publisher-text risks, by original page

These are **explicit findings about the source's printed explanations**, separate from the original question stems and from the assistant's scientifically qualified interpretation.

| Risk ID / printed page | Source passage issue | Correct teaching distinction | Severity |
|---|---|---|---|
| **P146-REVERSIBLE-COP / 146** | Temperature-only refrigeration COP follows an unqualified heat/temperature proportionality statement | **Only reversible Carnot** gives COP_C=T_C/(T_H−T_C), with kelvin temperatures; actual cycle COP depends on hardware and losses | **Compulsory** |
| **P147-ENTROPY-DELTAQ-OVER-T / 147** | Printed Eq. 8.12 might be used without the nearby reversible qualification | **dS=δQ_rev/T**, integrated along a reversible path; finite Q/T when reversible and isothermal | **Compulsory** |
| **P148-MELTING-HEAT-SIGN / 148** | Melting ice is described as releasing heat | Ice melting at equilibrium **absorbs latent heat** | **Compulsory** |
| **P148-MELTING-ENTROPY-SIGN / 148** | Melting-ice passage says entropy decreases | Entropy of ice/water **increases** on melting; p.149 Example 8.6 independently gives a positive value | **Compulsory** |
| **P149-REVERSIBLE-SYSTEM-ENTROPY / 149** | Says entropy of the *system* remains constant in every reversible process | Reversibility implies **zero entropy generation** in the combined whole, not fixed S of each heat-exchanging system | **Compulsory** |
| **P149-NATURAL-SYSTEM-ENTROPY / 149** | Natural processes described as needing nondecreasing entropy of arbitrary *system* | Nondecrease applies to **isolated system/combined whole**, not every subsystem | **Compulsory** |
| **P149-ENERGY-AVAILABILITY / 149** | All heat claimed available for work before degradation; energy called “lost” | **Total energy conserved**; irreversibility decreases **useful work potential**, not energy quantity | **Compulsory** |
| **P148-FIGURE820-ORDER / 148** | Figure 8.20 arrows depict high randomness to low randomness while spontaneous-disorder narrative heads the opposite way | Inspect image orientation, system boundary and captions independently before classroom adaptation | **Optional diagram QA** |

**Additional subtlety:** Under the simple ice/water equilibrium melting model, **ΔS_melt=mL_f/T>0**. On p.149 the original worked example uses the source's rounded constants (0.7 kg, 3.36×10⁵ J/kg, 273 K) and gives approximately **861.5 J K⁻¹**, consistent with a positive entropy change. This comparison establishes the *internal textbook contradiction* without modifying either source page.

**Do not present original textbook Figures 8.18–8.20 as edited or official replacements in this PR.** Reproduction/editing would require an independent review stage.

## Official FBISE HSSC-I summative SLO candidate mapping

| Original question | Printed primary SLO | Printed secondary candidate | Observed demand / approval |
|---|---|---|---|
| **8.9** | **P-11-C-17** — refrigerator as reversed heat engine (**Understanding**) | None required | Understanding working principle and COP distinction; teacher approval pending |
| **8.10** | **P-11-C-22** — entropy as degree of particle disorder (**Understanding**) | **P-11-C-21** — natural tendency toward disorder (**Understanding**) | Full thermodynamic definition is broader than the printed disorder analogy; item coverage and cognitive approval pending |
| **8.11** | **P-11-C-19** — entropy increase as energy degradation (**Understanding**) | **P-11-C-20** — degradation in natural processes (**Understanding**) | Direct qualitative link provided system/combined surroundings are not conflated; teacher approval pending |

The codes and cognitive categories above are from the original visually sourced V224 FBISE inventory. They are **candidates, not approved item-level summative mapping**. No new framework entries have been invented or old entries relabelled.

## Milestones and technical release gate

- With V243 (8.1–8.4), V244 (8.5–8.7) and V245 (8.9–8.11), **all 10/10 visibly printed original comprehensive questions have preliminary QC coverage**. Missing **8.8** is preserved as a source anomaly, not created.
- Earlier V237–V239 cover **18/18 original end-of-unit MCQs** and V240–V242 cover **13/13 original short questions**. **No student or teacher-approved answer edition is thereby certified.**
- V235 original inventory separately records **9 original numerical problems (8.1–8.9) on p.153**; these are the next primary science-review milestone.
- All previously published **2,250 pinned Units1–6 MCQs**, their options, answer keys, and 59 portal resources remain unchanged. Units **7 and 8** remain `status=planned`, `questionBankCount=0`, `assessmentStatus=not-published`, retaining three/ten unscored lessons and two/four simulations, respectively.
- No change to original source PDF, original textbook figures, teacher/class Firebase permissions, authentication, student results or the PR #339 student navigation.
- V245 lightweight CI validates original source page/ID/hash, all eight source-passage risk records, candidate printed SLOs, missing comprehensive 8.8, all earlier V244–V224 academic/source QCs and pinned-bank invariants. **It does not approve science or unlock graded questions.**

**Status:** preliminary source-issue identification **DOCUMENTED**; independent teacher science review **PENDING**; exact question-to-SLO/cognitive approval **PENDING**; teacher-approved solutions **NOT PUBLISHED**; owner scored-content release **HOLD**.

**Next V246:** Original Unit 8 numerical problems **8.1–8.3**, each recalculated independently with explicit variables, unit conversions, assumptions and comparison to the *printed answers*. The original problem **8.3** does not specify its initial temperature; do not silently borrow one from an unstated assumption. Work in source-first small batches, then numericals 8.4–8.6 and 8.7–8.9.
