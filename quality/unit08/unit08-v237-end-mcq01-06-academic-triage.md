# V237 — Unit 8 end-of-unit MCQs 1–6: source-based academic triage (no answers)

## Why this is a separate stage

PR #339 / V236 was merged; its student-facing navigation and Unit 7/8 study links are in `main`. V235 inventoried **18 original end MCQs** on original NBF Grade XI Physics pp.150–152. This first six-question V237 stage is **internal academic metadata review only**, **not** an MCQ import or answer-key release. The original source pages **150–151** were reopened visually; option letters and original question wording are **not** reproduced in this repository.

**Authoritative source:** Owner’s original scanned NBF Grade XI Physics Unit 8 pages 150 (MCQs 1–4) and 151 (MCQs 5–6). Original source SHA-256 is recorded in `unit08-v237-end-mcq01-06-review-no-keys.json` and matches V224/V235. The official summative SLO candidates derive from the preexisting original FBISE assessment-framework inventory; **teacher verification of the specific item-to-SLO and cognitive mapping is still pending.**

## Teacher-facing change triage — list only what needs action

| Original MCQ | Action | Scientific reason | Keep the original? Can a new item be added? |
|---|---|---|---|
| **2** — vigorous shaking in insulated thermos flask | **COMPULSORY before graded use** | Negligible heat exchange implies an **approximately adiabatic** process; a liquid in a rigid sealed flask can also have **approximately constant volume (isochoric)**. These descriptions are not mutually exclusive. A single-key question should specify classification *by heat exchange* rather than simply ask which process occurs. | **Yes**, retain the publisher item for conceptual discussion with caveat. **Yes**, add a separate independently authored, fully conditioned assessment item **after academic approval**. |
| **3** — fasting/metabolism | **COMPULSORY before graded use** | Fasting does not specify a complete thermodynamic system boundary or constant temperature, pressure, volume, or heat exchange. Human metabolism involves multiple processes; no unique idealised path follows merely from fasting. | **Yes**, retain the source as a critical-thinking/discussion example. **Yes**, add a separately authored physical-system item with explicit thermodynamic conditions after teacher approval. |
| **1** — ideal-gas approximation | **OPTIONAL teaching note** | Low density is a defensible ideal-gas condition; dilute gases at appropriately high temperature are often a better approximation. The item need not be discarded, but a high-temperature/weak-interaction teaching note improves precision. | **Keep original**. Additional independent scenario is optional, not necessary for coverage. |

**No amendment recommended at this stage for MCQs 4, 5 or 6.** They appear scientifically consistent with the printed source and subject to the usual system assumptions. This is **not** an instruction to publish or certify their answers.

## Source-consistent technical findings (independent checks; no answer letters)

- **MCQ 1 (p.150):** Real-gas ideal behaviour is favoured by low density; candidate **P-11-C-05**, Understanding. The source’s four alternatives make the intended basic approximation identifiable.
- **MCQ 2 (p.150):** Work input from vigorous shaking raises internal energy while negligible heat enters/exits an insulated flask. An adiabatic process **can simultaneously** take place at essentially fixed volume. Candidate **P-11-C-08**, Understanding, with **indirect SLO fit**; confirm before graded assessment.
- **MCQ 3 (p.150):** Metabolic-path question is underdetermined. Do **not** invent a unique answer, and do **not** assert an endorsed official theory-SLO match. Tentative curriculum section 8.4/P-11-C-08, but weak fit needs teacher review.
- **MCQ 4 (p.150):** Rigid volume prevents boundary PΔV work; for energy explicitly represented by heat Q, First Law is the appropriate tool. Candidate **P-11-C-08**, Application.
- **MCQ 5 (p.151):** Constant-pressure work uses **W_by=P(V_f−V_i)**, and the source’s pressure and change in SI volume yield a single consistent option; candidate **P-11-C-06**, Application. The calculations are checked without uploading their solution key.
- **MCQ 6 (p.151):** Direct solid-to-gas phase change tends to increase the substance’s entropy; source alternatives contrast this with freezing, crystallisation and condensation. Candidate **P-11-C-22**, Understanding.

The matching SLOs are **summative** in the original inspected FBISE framework inventory. Source-derived *potential* SLO matching does not mean these exact original MCQs satisfy every assessment criterion. In particular, **the source itself is not an official answer key**.

## V237 safeguards and next small stage

- Keep original NBF questions and options **exactly as published in the source textbook**. No corrections to the printed file.
- Publish **no option letters, answer keys, solution edition, original copied stems or scanned diagrams** to the student site or GitHub as part of V237.
- Keep Units 7 and 8 MCQ Test Builder selection disabled, with Unit8 0 scored MCQs and no academic release.
- Preserve all **2,250** pinned Units1–6 question identities, 59 catalogued resources, the 3 and 10 unscored Unit7/8 lessons, existing simulations, all Firebase/Auth roles and student scores.
- Validate exact V235 source inventory linkage, original page numbers, six review records, two compulsory hold items, one optional teaching note, no key fields and zero Unit8 scored content.
- **V238 candidate:** source-check **MCQs 7–12** separately. Pay special attention to the Carnot-efficiency assumptions, refrigerator COP missing room temperature, and the two potential no-unique-answer source questions (11 and 12). Do not release them automatically.

**Status:** teacher academic science review **PENDING**; teacher cognitive/SLO mapping **PENDING**; owner bank release **HOLD**. Passing CI or merging this review-only PR means metadata is indexed; it does not certify or publish answer choices.
