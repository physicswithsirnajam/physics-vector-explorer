# V225 — Grade XI Unit 8 Topic 8.1, first public unscored source-grounded lesson

**Purpose:** Move beyond the V224 source manifest to an accessible first learning path without fabricating original textbook graphics, teacher approval or graded Unit 8 questions.

## Sources inspected before authoring
- Original **NBF Grade XI Model Textbook of Physics**, first edition represented by the user's private 292-page PDF, **printed pp.127–131**, visually opened and compared with the draft.
- V224 source/SLO register, which maps the main heading **8.1 Thermal Equilibrium** across **printed pp.128–131**, including 8.1.1 Internal Energy and 8.1.2 Ideal Gas Equation, **Example 8.1 (pp.130–131)** and **Assignment 8.1 (p.131)**.
- Official Grade XI FBISE framework Domain C original rows `P-12-C-01` (as printed code; apparent Year 12 typo not silently normalized), `P-11-C-02`, `P-11-C-03`, `P-11-C-04` and overlapping internal-energy `P-11-C-12`. All are shown as Summative in the official framework, but the *public study page is not itself an approved summative paper*.

## Student-facing work
- New `portal/unit-08-topic81-thermal-equilibrium-v225.html`, premium navy/gold style with existing exact logo asset (no altered/generated branding), responsive desktop/projector/mobile, accessible skip/jump links and semantic layout.
- Original source-based, paraphrased explanations of thermal equilibrium, two systems in thermal contact, no **net** heat exchange at equal T; system/boundary/open/closed/isolated; microscopic internal energy and ideal gas temperature dependence; internal energy as a state function; the dual forms `pV=nRT` and `pV=Nk_BT`; and SI dimensions / Boltzmann constant.
- Scientific clarifications where the textbook wording can mislead: *heat is energy transferred due to temperature difference*, **not** stored heat content, and zero isothermal change in internal energy applies to the **ideal gas**, not automatically every real material. Original NBF statements are *not* rewritten.
- **Original Example 8.1**, author-worked adaptation: 25°C → 298 K; mean translational kinetic energy `(3/2)×1.38×10^-23×298 = 6.1686×10^-21 J ≈ 6.17×10^-21 J per molecule`. Independent formula and units verified.
- **Original Assignment 8.1**, separate teacher-review-only walkthrough: original **20.0 m³ room at 27°C and 1 atm**, ideal-gas approximation; 300 K, 101325 Pa, `N=pV/(k_B T)=4.8926265836×10^26` molecules → **4.89×10^26**. Equivalent `n=pV/(RT)≈812.44 mol`. Original question meaning and numbers preserved but no verbatim stem copied or publisher final answer certified.
- Interactive on-page ideal-gas calculator with positive input validation, SI unit conversion and no data persistence, login or network submission; unscored conceptual self-checks with expandable explanations.
- New Unit8 `learningPreviewHref` and `learningPreviewStatus` added to the existing catalogue, while the whole Unit8 remains **planned** with **0 MCQs and 0 graded assessments** and four original public simulations.
- One verified read-only "Next units" sidebar link and one Exam Quick Access section. No fabricated Topic8.2 page.

## Academic/release constraints
The new resource prominently says **Unscored source-based study preview — teacher academic review pending**. The independent example/assignment explanations are a draft teaching supplement; no original NBF page scan, Figure 8.1(a/b) image, copyrighted publisher question stem, source MCQ, original end-of-unit answer, official marking key, graded test or claim of independent teacher signoff is included.

- No new scored MCQ; Units 1–6 **2,250 existing pinned MCQ identities, answer choices and keys unchanged**, Unit7 0 scored release held.
- No Firebase Auth, Firestore, App Check, teacher-approval backend, reporting inbox, student profiles/rosters, saved scores, authentication or grading changes.
- The original 59 public resource records remain, and unit8's separate additional lesson is deliberately a **planned-unit unscored preview**, just as the previous Unit7 lessons were.
- V224 printed framework anomalies remain preserved; source review will later map every independent question/SLO with human approval.

## QA gates
V225 source+science check verifies both independent numerical results, positive temperature/pressure/volume handling, the exact original 8.1 source numbers/pagination, formulas, lesson labels, 59-resource catalogue, planned/0-scored statuses and original 2250-item bank. Real Chromium tests student entry from the global Next Units sidebar and Exam Quick Access, interactive calculator, solution reveal, no score/answers backend, and outer horizontal overflow on **1280, 390 and 320 px** screens. Reruns prior V224/V209/V140 source and navigation regressions.

**A green CI is software/numerical QC, not independent teacher science approval.** Later original end-of-unit question and full-unit MCQ bank publication remain blocked until item-by-item human QA and explicit owner authorization.

## Merge procedure
Keep draft until all latest-head checks green. Then inspect seven changed files → Ready for review → Merge pull request → Confirm. Student verify **Next Units 7–10 → Unit8 Topic 8.1**, or **Exam Quick Access → Unit8 Topic 8.1**; open Example and Assignment 8.1, test 101.325 kPa / 20.0 m³ / 300 K, confirm ~4.893e+26, then double volume to 40 m³ and check ~9.785e+26. Verify **no Unit8 Test Builder/graded MCQ link**.

**Next stage V226:** Original textbook Topic 8.2 (kinetic theory of gases) and underlying source pages 131–134, including work done by/on a gas. Keep it as a separate small, teacher-reviewed release.
