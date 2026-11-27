# V233 · NBF Grade XI Unit 8 Topic 8.9 Refrigerator — original-source QA

## Original book and FBISE alignment
- Reopened owner's original NBF Grade XI Physics textbook, printed **pp.145–147**. Verified the heading **8.9 Refrigerator** begins on printed p.145; next **8.10 Entropy** begins part-way through printed p.147 and is deliberately excluded.
- Original figure **8.18**, refrigerator/heat-pump energy diagram, appears on p.145; the illustration is **not reproduced or AI-redrawn** in this public lesson. The lesson uses independently written semantic text boxes.
- The book's **Example 8.5** begins on p.146 and its solution continues p.147. Its actual temperatures are cold cabinet **6 °C** and room **37 °C**, leading to the *ideal* source-reported **9 J of heat removed** and **10 J of heat delivered** for every 1 J of electricity, using the textbook's 273-K offset.
- **Critical original-source check:** **Assignment 8.5 (printed p.147)** gives the cabinet temperature as **t₂ °C** and room temperature as **t₁ °C**, not fixed numbers. The correct answer is **symbolic**. It is not a hidden '5 °C/25 °C' numerical question. Source names t₁ and t₂ must not be swapped.
- Original source inventory V224: topic `8.9` pages `[145,147]`, exactly **P-11-C-17 (Summative, Understanding)**; original source Example8.5 pages `[146,147]`, Assignment8.5 p.147; next topic 8.10 separately maps to entropy outcomes. Do not infer academic review from theory-SLO mapping.

## Equations, direction and example QC
Define **Q_C** as positive magnitude of heat removed from cold cabinet, **Q_H** as positive magnitude delivered to warmer room, **W_in > 0** as work supplied. Over a cycle, **Q_H=Q_C+W_in**, so **W_in=Q_H−Q_C**.

- General refrigeration **COP_cool=Q_C/W_in**; heating heat-pump **COP_heat=Q_H/W_in**. For the same cycle **COP_heat=COP_cool+1**. COP is unitless and can exceed 1 because heat is transported, not created.
- Ideal reversible/Carnot upper bounds: **COP_cool,ideal=T_C/(T_H−T_C)** and **COP_heat,ideal=T_H/(T_H−T_C)**. All T values in **kelvin**, T_H>T_C>0. Real refrigeration performance must not be mislabeled as the Carnot ideal.
- Example 8.5 with textbook rounded conversion **T_H=37+273=310 K**, **T_C=6+273=279 K**: COP_cool=279/(310−279)=**9**, for W=1 J heat removed Q_C=**9 J**, Q_H=Q_C+W=**10 J**. Using the more precise offset 273.15 gives COP_cool≈**9.00483871**, COP_heat≈**10.00483871**. These are consistent at the textbook precision; **do not change the printed-source answer**.
- Assignment 8.5 symbolic: T_H=t₁+273.15 K, T_C=t₂+273.15 K. At W_in=1 J, **Q_H=[(t₁+273.15)/(t₁−t₂)] J**. Valid under t₁>t₂ and positive absolute temperatures. This is the requested heat *delivered to the room*, not the cooling heat Q_C; the latter would be (t₂+273.15)/(t₁−t₂) J.
- The ideal limit becomes very large as the reservoir temperature gap tends to zero; implementation must guard empty, nonfinite, inverted, equal or below-absolute-zero input. General energy transfer calculator must require positive work and nonnegative cold heat and reject overflowing results.
- Original p.146 cooling and heating formula labels 8.10 and 8.11 remain associated with their correct useful quantity; avoid swapping heating and cooling COP.

## Release and technical checks
- A new branded, responsive public unscored page `portal/unit-08-topic89-refrigerator-v233.html`, with original independently authored explanation, correct source values in Example 8.5, **symbolic** Assignment 8.5, two independent live calculators and five conceptual self-checks.
- Explicit only Unit8 `additionalLearningPreviews[7]` topic `8.9`, source `[145,147]`, public-unscored-study-teacher-review; adjust existing navigation, Exam Quick Access and previous Carnot lesson's forward link. The next topic **8.10 Entropy remains planned**.
- Preserve Unit8 `status=planned`, `assessmentStatus=not-published`, zero scored questions, `resourceIds=[]`, **4** existing simulations; preserve Unit7 scored hold, **59** resources, all **2,250** Unit1–6 pinned MCQ identities, choices, answers and explanation references.
- No source PDF, original figure, publisher exercise prose/answer sheet or sensitive student identity. Do not modify Firebase/Auth, teacher permissions, roster, login and results persistence. Existing V232–V225 source/browser checks should be extended only for topic-count, status and explicit navigation, never removed.
- V233 dedicated Chromium check must verify **1280px sidebar**, **390px Quick Access**, **320px direct page**, source and SCIENCE, default and changed calculator outputs, invalid inputs, example/assignment reveal, five conceptual checks, no JS exceptions/overflow, and original graded release holds. Install Chromium without failed external MS apt source.
- **Teacher independent science/cognitive approval PENDING; owner scored Unit8 release HOLD.** CI and merge do not certify the academic answer editions.

**Next scoped development after PR passes:** V234, separate original source review of **8.10 Entropy**, starting printed p.147 and continuing through the relevant later pages. Do not publish it in this PR.
