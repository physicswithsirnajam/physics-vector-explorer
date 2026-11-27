# V198 — Grade XI Unit 7.2: twelve new owner-source MCQ science/SLO second-pass findings

**Verified prerequisite:** PR #301/V197 is merged into `main` at `debe8497fccef465673ff6ac9aeace4769d94a92`. The previous first-principles source-QC batch was Topic 7.3; this V198 batch examines *different* owner-authored questions from **Topic 7.2 — Deformation in Solids**, with no scoring.

## What was examined, not inferred

- Original boxed Word bank `Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx`, SHA-256 `a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada`. All twelve complete original stems, **48 original option texts**, supplied letters, answer explanations, original SLO and K/U/A labels were reopened directly. The complete original 80-item source-keyed Word remains unchanged.
- Actual two user-uploaded NBF Unit 7 PDF copies, each 15 pages, original printed **pp.116–122**, for the deformation examples, stress/strain definitions, units, Young/bulk/shear modulus and **Fig 7.12** ductile stress–strain curve.
- Official FBISE HSSC-I Physics **2025** assessment-framework demand from existing verified project controls: **P-11-B-23 = Understanding**, **P-11-B-24 = Application**, **P-11-B-26 = Understanding**. The original author cognitive label is not itself proof of the actual cognitive demand.

Original V168 Topic7.2 80-item register `quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json` and V185 72-item teacher review queue were checked before selecting. Every one of these exact original IDs was **absent** from the V185 queue and, by their topic code, from the different V197 Topic7.3 twelve-source batch.

## Actual amendments-only per-question decisions

| Source Q | Original SLO / author demand | Independent source-based QC recommendation |
|---|---|---|
| **1** | B-23 / K | **Supporting recall** of mechanical deformation: original key/explanation correct, but direct B-23 *Understanding* would require interpretation or scenario. Optional augmentation, not original key correction |
| **2** | B-24 / K | **Supporting formula definition** of stress: correct original key, but standalone recall does not prove B-24 *Application*. Optional applied force/area version |
| **4** | B-24 / U | **Cross-SLO / cognitive decision**: correct stress dimensions deduced from force/area; primarily dimensional analysis. Compulsory human decision before claiming direct B-24 scoring, optional dimensions-focused enrichment |
| **10** | B-24 / U | **Supporting concept**: unitless strain as ratio of same-unit quantities is scientifically sound. Optional data-based strain calculation to meet B-24 Application |
| **16** | B-24 / K | **Supporting modulus definition**: Young's modulus is longitudinal stress divided by longitudinal strain, not bulk/shear modulus. Original answer correct; optional scenario requiring measured Y |
| **21** | B-24 / U | **Borderline actual cognitive demand**: increasing area under fixed force reduces stress. Teacher should decide whether this particular comparative use of `σ=F/A` counts as direct Application rather than Understanding. No wrong source key |
| **22** | B-24 / A | **Promising direct Application**: fixed `ΔL`, changed original length; the strain ratio yields the correct comparison. No compulsory revision |
| **23** | B-24 / U | **Borderline actual cognitive demand**: at equal longitudinal stress, a higher Young modulus gives smaller elastic strain. The original physical conclusion is correct, but U-versus-A for the qualitative material comparison needs a teacher review |
| **24** | B-24 / A | **Promising direct Application**: with equal force, area and Young modulus, rod extension scales with original length. Elastic Hookean range assumption may be made more explicit, but source key is correct |
| **28** | B-26 / U | **Promising direct Understanding** of Hooke proportionality in the initial OA segment of Fig **7.12** on printed p120. Figure/context is essential; compulsory accessible figure or self-contained approved restatement for **standalone** scored use |
| **41** | B-24 / A | **Promising direct numerical Application**: normal stress found by dividing given force by stated m² area; arithmetic and unit check pass. No original answer amendment |
| **68** | B-24 / A | **Promising graph Application**, but graph axes must be explicit: for a **stress-vertical versus strain-horizontal** straight graph the greater gradient represents greater Young modulus. **Compulsory axis qualification** before standalone scored inclusion; original keyed choice consistent with standard graph conventions |

**Final balance:** **5** promising direct SLO candidates (22, 24, 28, 41, 68), **2** borderline teacher cognitive decisions (21, 23), and **5** supporting/cross-SLO study items (1, 2, 4, 10, 16). **No wrong supplied answer letters** were identified in these twelve questions. No source row or answer key was edited.

**Nuance:** Q21 and Q23 *may* count as Application when an examiner applies a formula to a comparative situation; the Word author's original U tag alone does **not** establish failure. Both remain pending rather than being silently demoted to formative. Likewise Q28's science is sound while its standalone figure-accessibility requirement remains outstanding. The user-provided PDF lets us verify the original Fig 7.12 **as a source**, not necessarily reuse it online with distribution rights.

## Private answer-key dossier

The **seven-page** Word and PDF private academic review pack was rendered and visually checked:
- `Unit7_V198_PRIVATE_Topic72_Twelve_Source_SLO_QC.docx` SHA-256 `71edfd4763c90b04d9d12befc0938d84191e3007e144c7ad7499ee992a9a3260`.
- `Unit7_V198_PRIVATE_Topic72_Twelve_Source_SLO_QC.pdf` SHA-256 `f589bab1509586039f454cae1d150b827aba47e46c8f2e3acfc19c2ece092bd4`.
- Working private source-review JSON SHA-256 `0dc584ed0c1c23dd1d212b212f82e4982a776c982ec1c0f3428b726bd852f58b`.

Only these private materials contain the **original MCQ text, complete four options, original correct letters/explanations and unsigned teacher review fields**. Do **NOT** commit them to public GitHub or run them through Actions logs. A local model QC is not a verified independent teacher signoff.

## Project changes and release boundary

Exactly **five additive public files** are included in V198:
1. `quality/unit07/unit07-v198-topic72-twelve-unreviewed-source-slo-no-keys.json` — twelve immutable original V168 row hashes, source references, qualified academic classifications and explicit HOLD.
2. `quality/grade11-v198-unit07-topic72-twelve-original-mcq-science-slo-qc.md` — this amendments-only academic report.
3. `scripts/audit_grade11_unit07_topic72_secondpass_v198.cjs` — independent fixed source SHA/SLO labels, zero overlap against original V185 queue/V197, and adversarial no-score/no-leak checks.
4. `scripts/test_grade11_unit07_topic72_math_v198.cjs` — small independent mechanics/dimensions/scaling checks, with no private keyed answers or scoring capability.
5. `.github/workflows/validate-grade11-v198-topic72-twelve-source-slo.yml` — target checks plus original Topic7.2 80 audit, V197 and original release/security controls.

Unit 7 still has **274 original source identities**, **72 detailed privately drafted candidates** awaiting real review, **zero authenticated teacher science/cognitive approvals, zero owner scoring permissions and zero scored Unit7 student questions**. V198's twelve additional original-source QC checks are **not** new private revised candidates; don't add them to the 72. V160 production teacher backend and V161 staging/production teacher backend stay **NO-GO**; no Firebase Auth/Firestore/App Check, teacher roles, student records, live bank or billing change.

**V199:** review a small further batch from actual owner Word/NBF pages, or reconcile a genuinely completed independent teacher decision sheet when received. Do not present a green CI check as academic signoff.

**Owner merge:** Keep the pull request in Draft until both latest-head checks are GREEN. Review five Files changed → Ready for review → Merge pull request → Confirm merge. No Firebase or domain steps are required.
