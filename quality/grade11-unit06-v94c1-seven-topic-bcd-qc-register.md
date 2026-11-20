# V94-C1 — Unit 6 seven-topic Parts B/C/D source inventory and targeted quality-control register

**Date:** 20 November 2026. **Purpose:** The teacher has chosen to finish Unit 6 as an integrated `Read → Simulate → Practice → Revise` learning experience before opening Unit 7. This is a *first-pass inventory and targeted scientific QC*, **not** the completed item-by-item content audit or permission to publish solved material.

## Evidence and safe use

- **Source directly reopened and inspected:** owner's private `Grade11_Unit6_COMPLETE_MASTER_ALL.pdf` (577-page prepared compilation, 17 Oct 2026). All seven topics' **21 Part B/C/D sections** were programmatically located and inspected for title, page span, author-stated source boundary and notable equations/qualifications. Selected derivations, examples, explanations and question descriptions were checked in context. **No exhaustive verification of every individual answer in these 21 sections is claimed.**
- **Official classification reopened:** owner's `11_Physics_HSSC_I_model_paper_50_percent(9).pdf`, framework PDF pp.11–12. **P-11-B-39 Formative**; B33–B38 and B40–B44 **Summative**. A topic's official SLO classification does not certify each authored question or its particular cognitive tag.
- **Original NBF evidence available:** teacher photographs of printed pages 110–111, and previously provided Figures 6.2, 6.3, 6.5(c) and 6.6. Original textbook diagrams for Figures 6.1, 6.4, 6.5 other panels, 6.7–6.17 and relevant pp.89–106 remain to be verified individually if fidelity is claimed. **Do not publish textbook page images or figures without permission; prepare distinct independent teaching diagrams**.
- **Repository state as checked:** `question-bank/manifest.json` reports seven provisional source topic banks **560/560**, **136** independent situation questions, **0** authentic common-stimulus groups, individual SLO/cognitive tags unverified. `portal/learning-catalog.json` still marks the *complete* Unit 6 as **planned**, with five mapped simulations and no published protected original PDF. Grade XI central MCQ total remains **2,250**. This PR must not change any of these or introduce school grading.
- **Parallel audit PRs:** V94-B2 `#86` and V94-B3 `#87` were **both still open** on GitHub when this C1 branch was opened; C1 is intentionally a documentation-only independent PR created from `main`. Do not assume previous PRs merged.

## 21-section map: actual compiled PDF page spans (NOT printed NBF page numbers)

| Topic / printed NBF pages cited in source | Part B — explanations and Q&A | Part C — derivations/formulae | Part D — activities, figures and problems | Official summative theory SLO(s) |
|---|---|---|---|---|
| **6.1 Upthrust & Archimedes** / 89–91 | PDF **17–25** (source describes 52 Q&A) | **26–39** | **40–50** | B33, B34 |
| **6.2 Viscous Drag & Terminal Velocity** / 91–95 | **65–77** (56 Q&A) | **78–87** | **88–98** | B41, B42 |
| **6.3 Fluid Flow** / 95–96 | **113–120** (48 Q&A) | **121–126** | **127–136** | B35 |
| **6.4 Continuity** / 96–99 | **151–161** (56 Q&A) | **162–172** | **173–182** | B36, B37, B38 |
| **6.5 Bernoulli’s Equation** / 99–101 | **197–206** (56 Q&A) | **207–219** | **220–226** | B40; B39 *formative supporting only* |
| **6.6 Bernoulli Applications** / 101–106 | **243–254** (56 Q&A) | **255–265** | **266–273** | B40, B44; B39 *formative supporting only* |
| **6.7 Superfluidity** / 106 | **289–297** (48 Q&A) | **298–303** | **304–311** | B43 |

**Source boundary note:** Part B questions are authored SLO-based preparation, Part C expands source derivations and labels supplementary mathematics, and Part D often combines explicitly numbered NBF examples/assignments with separately authored textbook-guided and supplementary tasks. They must not all be presented as verbatim textbook exercises. The source's printed NBF page labels are a provenance claim, not independent image-by-image validation for the full chapter.

## Seven-topic scientific QC findings (focused, source-backed)

### 6.1: upthrust and flotation — PDFs 17–50
- Part B targets B33/B34; Part C derives cylinder upthrust `F_B=F_bottom-F_top=ρ_f gA(h₂−h₁)=ρ_f gV_displaced` with hydrostatic, uniform-density, equal-face-area assumptions. The result's units are newtons. Part D expressly includes **Example 6.1** and **Assignment 6.1**, figures and teacher-added scenarios.
- **Compulsory for teaching:** `F_B=W` describes a freely floating body in *vertical equilibrium*, not any immersed body. Distinguish **body density** from **fluid density**, displaced volume from total volume, and buoyancy from aerodynamic wing lift. Provide original accessible drawing(s) for any figure-dependent answer. Original Fig6.2 already received a limited V93 verification.
- **QC state:** source map and derivation spot-checked, not all 52 explanations or Part D items recalculated.

### 6.2: viscosity, Stokes' drag and terminal velocity — PDFs 65–98
- Part B explicitly warns that a computed **~10.9 m/s** rain-drop speed using Stokes linear drag is *not* a physically reliable real-raindrop terminal speed for the cited droplet size; the low-Re assumption is violated. Part C distinguishes `F_D=6πηrv` as sphere/creeping-flow physics, excludes large/high-speed objects, and includes a **buoyancy-corrected** terminal-speed extension. Part D separately names **Example 6.2** and **Assignment 6.2**.
- **Compulsory:** Preserve the model-domain warning everywhere an apparently realistic high-speed droplet answer appears; never treat a formal Stokes calculation outside its validity range as experimental fact. **Dimensional analysis alone cannot yield `6π`**. State where buoyancy has been ignored; clarify viscosity versus drag.
- **QC state:** representative formulae and high-speed-model caveat inspected, full item-by-item recalculation pending.

### 6.3: streamline, turbulent and ideal fluid flow — PDFs 113–136
- Part B correctly states the scope of B35, including streamline/steady, incompressible and non-viscous assumptions. Part C declares no long prescribed proof in this topic; independently authored flow-rate practice uses `Q=V/t` and correct time-weighted averaging. For example the source calculates `0.09 m³/50 s = 0.0018 m³/s`; a generated text extraction renders the superscript minus sign awkwardly, so preserve math rendering in student display. Part D contains 32 textbook-guided/supplementary questions and **no separately numbered NBF example or assignment** for §6.3.
- **Compulsory:** Avoid implying “steady” and “laminar” are exactly interchangeable in all fluid-mechanics contexts; separate particle path, local velocity and ideal-fluid approximations. Keep the broader continuity derivation in Topic 6.4. Use V93 independently drawn, verified Figure6.6(a)/(b).
- **QC state:** relation and source boundary checked; other Part D scenarios remain to be item-reviewed.

### 6.4: conservation of mass and continuity — PDFs 151–182
- Part B has 56 Q&As. Part C explicitly separates general steady mass-flow `ρ₁A₁v₁=ρ₂A₂v₂` from constant-density `A₁v₁=A₂v₂`; branching requires summing *all* branches. Part D identifies **Example 6.3** and **Assignment 6.3**, while other activities are independently authored.
- **Representative independent spot check:** The source example describes aorta radius **0.8 cm**, speed **0.33 m/s**, split into **30** arteries of radius **0.4 cm**. `v_branch=(0.8/0.4)²×0.33/30=0.044 m/s` if 30 equal-flow outlets; check all constraints and units when displaying the solved example.
- **Compulsory:** Full cross-sectional area, no leakage/accumulation and stable flow assumptions; distinguish mean flow speed, discharge `Q` and mass flow rate. A real squeezed-hose's discharge can change.
- **QC state:** selected general derivation and one branching example checked; other exercises remain pending.

### 6.5: Bernoulli theory and energy balance — PDFs 197–226
- Part B/C use summative **B40**, while explicitly labelling **B39 formative** background. Part C develops `p+½ρv²+ρgh=constant` from pressure work and kinetic/potential energy under steady, incompressible, inviscid, along-one-streamline, negligible-loss/no-pump assumptions. Part D is textbook-guided Figure6.9 practice; source expressly states **no separately numbered NBF worked example or assignment** occurs in §6.5.
- **Compulsory:** Keep static-pressure and energy-density units explicit; compare pressures only where the assumptions allow it; do not equate higher velocity with lower local static pressure across arbitrary unrelated streamlines. Flag head loss or pumps as extensions, never as the same simple formula.
- **QC state:** equation derivation, unit interpretation and scope notes spot-checked; figure 6.9 source-fidelity still outstanding.

### 6.6: practical Bernoulli applications — PDFs 243–273
- Part B/C map to **B40/B44**, with formative **B39** not an independent final-exam target. The prepared source enumerates *six* textbook application categories: atomizer, filter pump, Torricelli, Venturi, aerofoil and Magnus effect. Part D references textbook Figures6.10–6.15, original A4-sheet activity, **Example 6.4** and **Assignment 6.4**, plus authored supplementary problems.
- **Representative independent spot check:** A listed Example6.4 has upper location `p₁=47.1 kPa`, `v₁=4 m/s`, lower location 3.0 m below with `v₂=3 m/s`; for `ρ=1000 kg/m³`, `g=9.8 m/s²`, negligible loss, the downstream pressure is `47.1+3.5+29.4=80.0 kPa`. This is an **assumed-value spot check**, not full source image certification.
- **Compulsory:** Distinguish bulb/air-jet atomizer from pump sprayer, Venturi's area ratio and pressure tap/manometer conditions, Torricelli's open-tank assumptions, and the **full aerodynamic lift** explanation from an overly simple “top air moves faster” story. Do not use an equal-transit-time myth.
- **QC state:** application list and a representative ideal Bernoulli example checked; original NBF Figures6.10–6.15 remain for image comparison if reused.

### 6.7: superfluidity — PDFs 289–311
- Part B addresses **B43**, with wall creep, persistent circulation and quantized vortices. Part C correctly identifies **no prescribed formal derivation** in §6.7; supplementary conversions include **2.17 K = 2170 mK** for He-4 and **0.0025 K = 2.5 mK** for He-3, attributed to textbook notes. Part D has 32 original guided or supplementary items and identifies Figures6.16 and 6.17.
- **Critical original-artwork risk:** The **private prepared source itself says that Part D reproduces the “actual NBF Figure 6.17”** as an excerpt of the helium phase diagram. Do **not** copy that chart into public GitHub or V95 as if it were an original schematic. Obtain an independently produced, correctly labelled educational chart or appropriate permission, and check any exact phase boundaries/axis labels against original printed p.106.
- **Compulsory:** Clarify that ideal zero viscosity does not mean gravity disappears or real experimental systems have no dissipation whatsoever; do not convert enrichment temperature numericals into an invented required B43 derivation.
- **QC state:** source-specific claims and temperature conversions checked; independent original figure and numeric phase diagram verification pending.

## Teacher-facing risk register — first-pass priorities

| ID | Where | Finding | Priority | Proposed safe action | Can the source remain and extra material be added? |
|---|---|---|---|---|---|
| **C-01** | 6.2 B/C/D | 10.9 m/s model raindrop result violates Stokes low-Re conditions | **Compulsory** | Preserve answer as a *formal model result*, add visible regime warning and alternative physical interpretation | **Yes** |
| **C-02** | 6.2 C, end-unit CR6.5 | Dimensional analysis gives a proportional form, not coefficient `6π` | **Compulsory** | State `F_D=kηrv` and source of full Stokes coefficient explicitly | **Yes** |
| **C-03** | 6.1 / 6.4 / 6.5 | Assumptions for flotation equilibrium, mass continuity and Bernoulli flow | **Compulsory** | Add a short assumptions/units panel beside the relevant interactive numerical and solution | **Yes** |
| **C-04** | 6.3 / 6.4 | Topic boundary between basic flow-rate and continuity derivation | **Optional for content, compulsory for clear navigation** | Keep prescribed derivation in 6.4; link to it from 6.3 without double-counting as an NBF example | **Yes** |
| **C-05** | 6.5 / 6.6 | Official B39 is formative | **Compulsory** | Distinguish formative explanation from B40/B44 summative applications; no per-MCQ board tags until verified | **Yes** |
| **C-06** | 6.6 | Venturi/atomizer/lift model over-generalization | **Compulsory** | Explicit apparatus and ideal-flow boundary, original explanatory diagrams | **Yes** |
| **C-07** | 6.7 D | Private Part D explicitly embeds original NBF Figure6.17 | **Compulsory** | Do not rehost/reproduce; independently author or license a verified alternative | **Yes**, keep private source intact |
| **C-08** | 6.1–6.7 D | Several figures and numbered textbook tasks have not had *original image* comparison | **Compulsory for claiming exact textbook fidelity** | Compare appropriate original figures and example text before advertising a diagram or numerical as NBF-exact | **Yes** |
| **C-09** | all B/C/D | No exhaustive scientific review or item-by-item FBISE mapping of these 21 sections yet | **Compulsory before final full-desk academic approval** | Review one topic at a time, assign statuses and teacher signoff, keep actual original IDs/source pages | **Yes** |

## V94-C2 teacher and QA workflow (not implemented in C1)

1. **Topic-by-topic reviews** (6.1→6.7), recording *exactly which* Part B Q numbers, Part C derivations and Part D exercises/figures require amendments. Prioritize only changes needed and label **compulsory vs optional**; do not rewrite full sets without a teacher request.
2. Independently recalculate all selected Part D numbered NBF examples and assignments, plus source-created numerical worked examples; record precise givens and units, particularly physically invalid formal Stokes examples.
3. Verify textbook-labelled text/figures using original NBF pp.89–106, separating original Figure6.17 from independently authored graphics. No copying from protected private source into GitHub.
4. Build a per-content SLO register tied to **official B33–B44**; flag **B39 formative**. Author-created question difficulty/cognitive labels must not automatically become “official FBISE” certifications.
5. Obtain **teacher signoff** for material released to students, especially source inaccuracies, diagrams and numerical assumptions.
6. Only after that, implement **V95 Unit 6 Learning Desk**: seven clean topic sections; `Read → Simulate → Practice → Revise`; links to five existing public Unit6 simulations and 560 provisional MCQs; original accessible figures with alt text; static/public lesson content separated from teacher-only marking schemes and protected notes.
7. Audit mobile/projector readability, printable answer review, back/next links, public access boundaries, all existing MCQ counts, CI regressions and teacher view before changing full Unit6 catalogue status from `planned` to `available`.

**V94-C1 release classification:** academic planning/first-pass evidence only, no source questions, answers, portal code, Firebase, auth, paid content, protected PDFs or student records changed.
