# V224 — Grade XI Unit 8 original NBF textbook / FBISE source-and-SLO baseline

**Source-first milestone, 27 November 2026. Not an academic approval, student-facing textbook reproduction, or MCQ release.**

## The authoritative sources actually opened
1. Library file **`11 Physics Book(20261125-065940).pdf`**, a 292-page scan of the NBF / Federal Textbook Board *Physics Grade 11* model textbook (National Curriculum of Pakistan 2022–23). Original book front-page and contents visually examined. **Printed pages 127–153** are the exact **27-page Unit 8: Heat and Thermodynamics**; Unit 9 begins on printed page 154. Each of the 27 printed Unit8 pages was rendered and visually inspected. The complete original book's SHA-256 is recorded in the source JSON so later reviewers can identify the specific edition; the original scan is **not uploaded to GitHub**.
2. Library file **`11_Physics_HSSC_I_model_paper_50_percent(10).pdf`**, the official FBISE Grade XI Physics assessment framework. **PDF pages 12–14 / internally numbered pages 6–8** contain Domain C, **Heat and Thermodynamics**, **23 summative theory SLO rows** and the **30-period** allocation. All 23 are shown as summative in this framework; individual cognitive demands are preserved in the JSON.
3. Current `portal/learning-catalog.json`: Unit 8 **planned**, **zero** authenticated/unscored academic lesson releases, **zero** scored MCQs, **four** public enrichment simulations, and a separate legacy external reference. These resources are not a substitute for source-verified original textbook lessons.

## Unit 8 topic-by-topic book boundaries

| Printed heading | Original printed pages | Content scope (paraphrase; not a copy of the book) |
|---|---|---|
| 8.1 Thermal Equilibrium | 128–130 | Thermal equilibrium, internal energy, ideal gas equation |
| 8.2 Kinetic Theory of Gases | 131–134 | Kinetic assumptions, ideal-gas conditions, work by/on gas |
| 8.3 The Gas Laws | 134–135 | Boyle, Charles, Gay-Lussac relationships and graphs |
| 8.4 First Law of Thermodynamics | 135–140 | Internal-energy balance, isothermal, adiabatic, isochoric, isobaric |
| 8.5 Heat Engine | 140–141 | Hot/cold reservoirs, work output |
| 8.6 Reversible and Irreversible Processes | 141–142 | Cyclic paths and ideal reversibility |
| 8.7 Second Law of Thermodynamics | 142–143 | Kelvin–Planck and Clausius statements |
| 8.8 Carnot's Engine | 143–145 | Cycle, efficiency, Carnot theorem |
| 8.9 Refrigerator | 145–147 | Reverse heat engine, cooling/heating COP |
| 8.10 Entropy | 147–149 | Entropy sign, thermal disorder, energy degradation |

The 10 main headings and 14 subtopics are maintained individually in the structured source ledger. Printed Figure **8.1–8.20** identities and page locations are indexed as metadata only. No source illustrations were copied or AI-redrawn.

## Worked content, assignments and original end-of-unit exercise count
| Book component | Original print page(s) | Verified identities |
|---|---|---|
| Worked examples 8.1–8.6 | 130–131, 133, 139–140, 145, 146–147, 149 | **6** |
| In-chapter assignments 8.1–8.6 | 131, 133, 140, 145, 147, 149 | **6** |
| Unit summary | 150 | 1 |
| End-of-unit MCQs | 150–152 | **18** |
| Original end-of-unit short responses | 152 | **13** |
| Original comprehensive responses | 152–153 | **11** |
| Original numerical problems | 153 | **9** |
| **Original end-exercise total** | **150–153** | **51 numbered question identities** |

**All 51 original exercise identities remain a source-only inventory**. Source-exact statements, copyrighted scans, teacher answers, MCQ keys, SLO mappings, exact text, calculations, diagrams and individual cognitive demand require subsequent independent QC; none is being published as a scored student item.

## Two FBISE source-data anomalies / QA priorities

**1. Official Grade XI framework code anomaly.** Domain C's first listed thermal-equilibrium outcome is **printed exactly `P-12-C-01`** on the Grade XI framework PDF page 12, while the other 22 Domain C rows are `P-11-C-02` through `P-11-C-23`. This is *probably* an editorial code typo, but the manifest stores the **actual printed code**, and `P-11-C-01` is only a possible corrected version **not yet officially authenticated**. Do not overwrite this code, cite it as confirmed corrected, or import it as an approved scored-SLO key without a deliberate verification decision.

**2. Overlapping internal-energy outcomes.** `P-11-C-02` and `P-11-C-12` both connect a temperature rise with greater internal energy. They remain separate source rows but need duplicate-aware question bank mapping to avoid unnecessary repeated MCQs and false coverage progress.

## Important scientific and assessment safeguards for later steps
- The book expresses **`Q = ΔU + W` when W is work done by the gas**. Distinguish work **by** and **on** the gas and state the sign convention per problem; do not teach both as positive W automatically.
- For constant-pressure processes, `W = pΔV`; for isochoric processes, `W = 0`. For ideal-gas isothermal processes `ΔU = 0`, within assumptions. When using a P–V graph, use **area in appropriate coordinates** and direction-aware sign.
- Carnot efficiency uses **absolute temperatures in kelvin**, not Celsius differences incorrectly substituted into `η = 1 − T_c/T_h`.
- Entropy signs require a clearly chosen system and reversible-heat-transfer assumptions. The book's printed answer hints, including entropy numericals, are **not yet independently QC-approved**.
- Every original question must be traced to its printed page and the exact official Domain C SLO, with any formative/application mismatch held for teacher review. A **green source-inventory test is not independent Physics answer approval**.

## Next small releases (not implemented by this source-control PR)
1. **Stage 2A:** Build a teacher-QC-only worked **Example 8.1**, its linked **Assignment 8.1** and concise Topic 8.1 study explanation directly from original pages 127–131. Include source-based mathematical formatting and check Boltzmann/gas-law unit values. No original source-page scans or verbatim reproduction.
2. **Stage 2B:** After independent QC, expose the unscored Unit8 Topic8.1 learning page alongside the four existing simulations; retain the full-unit `planned` and `0 scored` status.
3. **Stage 3 onward:** Progress through textbook main headings in small batches, verifying original examples, assignments and original end exercises separately, followed by a teacher-reviewed item bank with mixed straight and genuine shared-stimulus MCQs. Apply FBISE pattern only after academic review. Student auth/scoring release is a separate owner decision.

## Exact V224 GitHub impact
**Adds only** a keyless source ledger JSON, this human-readable audit, a deterministic source-integrity/QA test, and its GitHub Actions workflow. Does **not** edit the 292-page original textbook, framework, portal UI, official logo, simulation links, student accounts/grades, Firebase settings, Unit7 approval holds, 59 public catalog resource records, or existing **2,250** Units1–6 provisional MCQ identities/answer keys.

### Owner merge protocol
Leave **Draft** until every latest-head GitHub Actions check is green. After reviewing four new files: **Ready for review → Merge pull request → Confirm merge**. This merge does **not** publish Unit 8 lessons, assignments, MCQs or complete course status. Then begin Stage 2A's tiny source-grounded Topic 8.1 bundle.
