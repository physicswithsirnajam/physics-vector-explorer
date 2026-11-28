# V248 — Original NBF Grade XI Physics Unit 8 Numericals 8.7–8.9: final preliminary source review

## Source and review boundary

Continuation after **PR #350 / V247 confirmed merged**. The owner's original scanned NBF Grade XI Physics **printed page 153** was reopened and read visually in full. This final numerical batch examines all source inputs, the publisher-provided answer labels, and **both original parts (a) and (b) of Numerical 8.9**. The exact original source SHA-256 recorded in the companion JSON matches prior V224/V235 source inventories. Relevant original chapter coverage includes Carnot efficiency (pp.143–145), entropy (pp.147–149), and isobaric P–V work (pp.138–140). No publisher stems, scans, printed diagrams, certified solutions or student graded questions are copied to this PR.

### Teacher-facing change triage — retain original, document qualification

| Original item | Publisher answer | Independent calculation and scientific nuance | Compulsory/optional; retain or add? |
|---|---|---|---|
| **8.7 — Carnot heat rejection** | **Q/3** | The original explicitly identifies a Carnot engine receiving **Q at temperature T**, rejecting heat to a reservoir at **T/3**. For a reversible Carnot cycle, **Q_C/Q_H = T_C/T_H = (T/3)/T = 1/3**, hence **Q_C=Q/3** as the **positive magnitude** of heat rejected; the signed heat absorbed by the working fluid during rejection is **−Q/3**. This relation is *not* generally valid for an irreversible engine. | **Keep original, no compulsory publisher-stem amendment.** **COMPULSORY interpretation and candidate SLO/cognitive approval** for any scored item. Closest printed P-11-C-23 is Knowledge, while obtaining the heat ratio requires symbolic Application. No extra item necessary. |
| **8.8 — water freezing and negative entropy** | **−64 J K⁻¹** | The original source **explicitly** supplies **500 J needed to melt 2 g of ice at 0°C**. For **70 g water freezing at 0°C**, use that given ratio: **Q_water = −500×(70/2)=−17,500 J**. The entropy change of **the freezing water** is **ΔS_water=−17,500/273.15 ≈ −64.067 J K⁻¹**, agreeing with source to whole units. The source-specific latent heat is **250 kJ kg⁻¹**, *different* from standard tabulated ice fusion heat (~334 kJ kg⁻¹); **do not replace supplied data**. Freezing water can lose entropy while the refrigerator+surroundings total still respects the Second Law. | **Keep original and printed −64 J K⁻¹.** **COMPULSORY source-specific latent-energy, sign and system-boundary note.** The available original V224 Domain C outcomes describe entropy conceptually, but **none directly certifies quantitative freezing entropy Application**; keep SLO eligibility **PENDING**, do not fabricate a direct SLO. A separately authored variant is not needed merely to fix this exercise. |
| **8.9 — constant-atmospheric-pressure expansion** | **1.013 × 10⁵ J** | Original gas volume rises **1 m³ → 2 m³**, at **constant atmospheric pressure**. With **P≈1.013×10⁵ Pa**, **ΔV=+1 m³**, **W_by=PΔV=+1.013×10⁵ J**. At exact standard atmosphere **101,325 Pa**, the computed work is 101,325 J, consistent with the printed rounded pressure. **Part (b) explicitly requires a P–V diagram**, not just a number. It must show **P vertical, V horizontal, rightward constant-P isobar from 1 to 2 m³, and shaded rectangular area underneath equal to W_by**. | **Keep BOTH original parts (a) and (b)**. **COMPULSORY completeness/diagram check before a certified teacher solution**. The correct positive work sign is for work done **by** the expanding gas; work **on** gas is negative. Candidate P-11-C-06 (Application) directly matches, while P-11-C-07 assists work sign language. A separate independently authored diagram may be prepared and vetted later; **no original textbook figure is copied**. |

**There is no newly demonstrated incorrect publisher answer in these three.** Original 8.7, 8.8 and 8.9 answer labels reproduce under clearly stated scientific conventions and the problem's own supplied values. These checks do **not** retroactively approve source questions held in earlier numerical batches.

## Dimensional and scientific checks

**8.7 — heat ratio and model.** The relation \(Q_C/Q_H=T_C/T_H\) is a Carnot *reversible cycle* statement using absolute reservoir temperatures. A positive `Q_C` in the heat-balance convention denotes heat rejected. For a signed heat transfer *into the working gas*, the cold-side term is negative. The question names a Carnot engine, so the ideal reversible model is reasonable, but the outcome's Knowledge classification must not be silently changed to Application.

**8.8 — phase change and entropy.** The exercise-derived heat of fusion is \(L=500\,\mathrm{J}/0.002\,\mathrm{kg}=250000\,\mathrm{J\,kg^{-1}}\). For \(0.07\,\mathrm{kg}\), a reversible reference path at \(273.15\,\mathrm{K}\) gives \(\Delta S=-mL/T\). Dimensions are \(\mathrm{J}/\mathrm{K}\). The **negative** value is the **water's entropy change**; an actual refrigerator consumes external work, and neither its entropy generation nor the total room+machine entropy change is given in the source. Do not confuse water freezing with ice melting or replace the nonstandard supplied latent-energy ratio with a more familiar handbook constant. The source's printed answer **−64 J K⁻¹** is a rounded source-specific result.

**8.9 — pressure/volume and graphical completeness.** Standard atmosphere approximately \(101300\,\mathrm{Pa}\) gives \(W_{by}=P(V_f-V_i)=101300\,\mathrm{Pa} \times 1\,\mathrm{m^3}=101300\,\mathrm{J}\), since \(\mathrm{Pa\,m^3=J}\). The intended P–V diagram is a **horizontal segment at \(P=1.013\times10^5\,\mathrm{Pa}\)** from \(V=1\,\mathrm{m^3}\) to \(V=2\,\mathrm{m^3}\), with a right-pointing arrow and the positive area between that segment and the \(V\) axis shaded. The diagram is specified in the internal JSON for a later **independently drawn and teacher-verified graphic**, rather than republishing any textbook figure. Actual expansion must be understood as quasistatic or as work done against constant external atmospheric pressure, without incorrectly extending the simple isobar to arbitrary non-equilibrium paths.

## Exact recorded official FBISE assessment-framework candidates

| Source numerical | Original official outcome, if applicable | Printed cognitive category | Teacher/QC reservation |
|---|---|---|---|
| **8.7** | **P-11-C-23** — Carnot efficiency limit; secondary **P-11-C-16** — Carnot engine working | Knowledge; secondary Knowledge + Understanding | Symbolic Carnot heat-ratio reasoning is observed **Application**; mapping approval required |
| **8.8** | **No directly verified numerical entropy summative outcome** in V224 original Domain C. Closest contextual theory outcome is **P-11-C-22** (entropy/disorder) | Understanding (context only) | Actual entropy computation is **Application**. Do not force the conceptual outcome as direct scored authorization |
| **8.9** | **P-11-C-06** — constant-pressure PΔV work; secondary **P-11-C-07** — work by versus on gas | Application; secondary Understanding | Direct match for numeric positive boundary work, with required graphical response assessed separately by the teacher |

The original printed SLO identifiers/classifications come from V224. Candidate mapping and academic correctness remain pending **human teacher approval**; passing a computer QA test cannot certify item-level summative eligibility.

## Full Unit 8 exercise preliminary-source QC milestone

- Original end-of-unit MCQs: **18/18**, covered by V237–V239, teacher-answer approval **PENDING**.
- Original short-response: **13/13**, covered by V240–V242, teacher-answer approval **PENDING**.
- Original visibly numbered comprehensive: **10/10**, covered by V243–V245. Preserve skipped printed comprehensive **8.8** and earlier V224 count discrepancy; do not invent/renumber it.
- Original numericals: **9/9** with V246 (8.1–8.3), V247 (8.4–8.6), and V248 (8.7–8.9), **preliminary source QC complete**.
- Total original publisher end-exercise source inventory: **50 visibly indexed entries** (18+13+10+9). This is preliminary source/scientific triage only, **not** 50 approved answers.
- **No new original publisher questions or answer keys** are imported to student access in this PR. Unit 7/8 `status=planned`, `assessmentStatus=not-published`, `questionBankCount=0`, while preserving public unscored lessons and simulations.
- Preserve exactly **2,250** pinned Units1–6 MCQs including identities/options/keys, **59** existing catalogue resources, Firebase/Auth/teacher roles, student enrollments and saved scores, navigation and branding.

**Human science approval PENDING; SLO/cognitive approvals PENDING; graded answers and solved numerical edition NOT-PUBLISHED; owner release HOLD.**

**Next academic stage after V248:** compile and adjudicate the source-QC issue ledger for all 50 Unit 8 original exercises; distinguish compulsory publisher defects from optional teaching notes and eligible original items from independent replacements. Then prepare an **internal teacher solution/marking draft in separately reviewed batches**, with correctly typeset scientific expressions and independently approved diagrams. Only after teacher answer/SLO sign-off should individual questions enter scored Unit 8 Test Builder practice.
