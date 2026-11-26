# V197 — Twelve previously unqueued Unit 7.3 original MCQs: actual NBF source + FBISE cognitive-level QC

**Verified predecessor:** PR #300/V196 merged into `main` at `a1c91193f1a21b194d48ad80aa834fac5a277c54`. This V197 phase contains **new, substantive item-level second-pass QC**, not another simulated teacher signoff.

## Exact sources reopened

1. Owner-authored original `Grade11_Unit7_Topic7.3_PartA_80MCQs_Study_With_Answers.docx`, SHA-256 `f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279`. Its original 80-box MCQ table and its separate keyed answer/explanation/SLO/cognitive table were reopened. For each selected question, the four complete choices, source letter and keyed explanation were matched directly. **No existing source question/key was changed.**
2. The user-provided original NBF Grade XI **Unit 7** scans, 15 pages each: SHA-256 `0f6f5d63c26e44d49ada6eef730ea73e99e3bd2331324701953683644125b8d9` and `08e20e2e3768134cf2eecd5379aa175f9777d1f0efcf18ea984cd8ad2c80d892`. Printed textbook pp. **122–124** were directly consulted to verify the force–extension discussion, elastic energy, Example 7.3 and Assignment 7.3.
3. The official FBISE **2025** HSSC-I Physics assessment framework, `https://fbise.edu.pk/ModelPaper/2025/Assessment%20Frameworks/HSSC-I/Final%20Assessment%20Framework%20Model%20Question%20Paper%20Physics%20HSSC-I.pdf`: summative **P-11-B-25 = Understanding**, **P-11-B-27 = Application**, **P-11-B-28 = Application**. A correct K/U item may remain useful practice but should not automatically claim to assess the direct official A demand.

The original complete Topic7.3 80-item first-pass register is at `quality/unit07/topic73-v173-all80-consolidated-academic-qc-no-keys.json`. **These exact 12 IDs were checked to be absent from the existing V185 72-item detailed candidate queue.** They receive a second-pass academic assessment, **not an invented new keyed revision**, so original Unit7 source inventory remains **274** and the 72 private candidate queue remains **72**, with **202 originals not yet given an independent private revised-candidate draft**.

## Amendments-only academic findings (original answer letters all retained)

| Original Topic7.3 Q | Source mapping / author's demand | Teacher-QC disposition, not a scoring permission |
|---|---|---|
| **2** | B-28 / U | Correct linear loading premise, but **supporting conceptual explanation**, not direct A-level B-28 calculation. **Compulsory SLO/cognitive scope review before direct scoring**; optional future scenario version |
| **8** | B-27 / K | Correct force-versus-extension work-area concept; recall only. **Compulsory direct summative demand review**; retain as conceptual warm-up |
| **21** | B-27 / U | Triangle work argument correct **for linear loading from origin**. Conceptual rather than Application. **Compulsory direct demand review**; optional graph-data question |
| **27** | B-27 / U | Nonlinear `W=∫Fdx` remains valid for work under an actual force–extension curve; blanket `Fx/2` would not. **Compulsory demand review**; original key preserved |
| **38** | B-27 / U | Correctly warns that NBF Fig. **7.14** has **force horizontal and extension vertical**, so its general geometric under-curve area is **not** `∫Fdx`. **Compulsory axis/linearity qualification** and demand review |
| **40** | B-27 / U | Elastic strain energy is work stored **when recoverable elastic loading** applies. Concept sound but question tests conceptual recognition. **Compulsory direct demand review**; clarifying wording optional |
| **51** | B-28 / A | Correct worked calculation `U=YAx²/(2L)` gives **0.050 J**, with unit conversion. **Promising direct Application candidate**; no answer amendment detected |
| **56** | B-28 / A | Correct `U/V=½(stress)(strain)` gives **1000 J/m³**, but source author labeled **Supplementary** and V173 already gave compulsory before-scoring source-scope review. **Retain as enrichment pending human decision** |
| **59** | B-28 / A | Original **NBF Example 7.3** pp. **123–124** uses **980 N** and extension ≈**3.90×10⁻⁴ m**; **0.191 J** is reproduced correctly. **Promising direct Application candidate** |
| **60** | B-28 / A | Original p. **124 Assignment 7.3** uses `Y=2×10¹¹ Pa`, `A=1 mm²`, `L=5 m`, `x=1 mm`; derived work **0.020 J** is correct. **Promising direct Application candidate** |
| **72** | B-25 / A | Load-mass/extension slope in kg/m must be multiplied by `g` to yield stiffness N/m. Key is correct, but this is **supplementary graph-data conversion** rather than directly describing the experiment at official **B-25 Understanding**. **Teacher scope decision compulsory before scoring**; alternate remapping optional and not automatic |
| **80** | B-27 / A | Correct procedure to reinterpret the textbook's reversed axes to compute work, with force vertical versus extension horizontal. **Promising direct Application candidate**; high overlap with **Q38** (already flagged by V173), so do not automatically include both in one short scored test |

**Accounting:** Four promising direct A-level candidates: **51, 59, 60, 80**. Eight supporting, supplementary, or scope-sensitive originals: **2, 8, 21, 27, 38, 40, 56, 72**. **Zero wrong original answer letters were detected in this twelve-item pass**, but this does not certify independent teacher approval, all 80 items, or the exact final summative question selection. Original V173 flag for Q56 remains compulsory, for Q72 optional remapping; V197 tightens **direct scoring eligibility** without overwriting those earlier judgments.

## Important graph and source nuances

Printed NBF **Fig. 7.14 on p122** plots extension on the vertical axis and load/force on the horizontal. The general physical work is `∫F dx` when force is integrated over extension, not the area under the original reversed-axis graph for an arbitrary nonlinear curve. The source's **linear, zero-start triangle** still correctly evaluates to `½Fx`. Preserve that distinction in Q38, Q80, worked solutions and student explanations. Q38/Q80 overlap was already documented in V173 and is **not a newly discovered duplicate**.

Source **Example 7.3** pp123–124 is distinct from **Assignment 7.3** on printed p124; both Q59 and Q60 source attributions are verified and answers recalculate correctly. No publisher values or underlying owner-authored answers are silently replaced.

## Private teacher-review pack and public privacy boundary

A new **eight-page** Word academic review, `Unit7_V197_PRIVATE_Topic73_Twelve_Item_Source_SLO_QC.docx` (SHA-256 `180cb0549009d1449b46a6f213133cb9603c4e664325f8d8151b60c0426b3b61`) and accompanying PDF (SHA-256 `60ddc4317b3cfa16f02d2d2827c9152cb56693fa371e7d0c7f10471348af7090`) were rendered and visually checked. The private working JSON SHA is `93b865f22083a60ebdf0c0daa7545fa7d2ca8479a3fee0abf59cc28543edf7bb`.

The private pack contains original question stems, all four owner-authored options, correct letters, explanations, independent physics and demand analysis, and **blank teacher decision fields**. **Do NOT upload the Word, PDF, private JSON or actual question/key text to public GitHub, Actions logs or a scored student portal.** V197 records only existing V173 source-row SHA identities, non-keyed review classifications and private whole-file checksum metadata.

## Source/safety state, 5 public additions and V198

- **No new private revised-candidate hashes generated**, no existing V185 72-source queue item modified and no original bank changed.
- **Zero authenticated teacher science/cognitive approvals**, zero owner scoring authorizations, **zero scored Unit7 student questions**.
- V160 teacher production `NO_GO_DEPLOYMENT_BLOCKED`; V161 staging/production `NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT`; no Firebase Auth/Rules/App Check or deployment changes.
- Prior V195 signed human decision pack remains **NOT RETURNED / PENDING**. This V197 QC is independent of that missing review; it is not an excuse to invent approval.

Exactly **five public nondeploying files**:
1. `quality/unit07/unit07-v197-topic73-twelve-originals-source-slo-secondpass-no-keys.json` — original source hashes, verified p122–124, cognitive-level classification and all scoring HOLDS.
2. `quality/grade11-v197-topic73-12-original-mcq-source-slo-secondpass-qc.md` — this amendments-only academic report.
3. `scripts/audit_grade11_unit07_topic73_secondpass_v197.cjs` — exact V173 original row fingerprints, absence from prior V185 72, source and scope invariants, fail-closed tampering tests.
4. `scripts/test_grade11_unit07_topic73_math_v197.cjs` — original Q51/Q56/Q59/Q60 mathematical checks plus graph/units sanity, no student scoring capability.
5. `.github/workflows/validate-grade11-v197-topic73-twelve-source-slo.yml` — V197 checks and existing academic, original-source, student bank, teacher backend/App Check safety regressions.

**V198:** privately obtain an independent teacher assessment of these original 12. If none has arrived, continue a fresh small original NBF-source MCQ QC batch; only propose new private revision variants where an actual key, distractor or direct-SLO problem warrants a changed item, without auto-importing or scoring.

**Owner merge:** leave Draft until **both latest-head checks GREEN**, inspect five Files changed, then Ready for review → Merge pull request → Confirm merge. No Firebase, student portal, domain or billing action required.
