# V180 — Unit 7 Batch 02: 12 high-priority original MCQs, separate private teacher candidates, and no scored release

**Decision:** 12 *new* exact-owner-source rows inspected in the three previously SHA-pinned original Word files, with a separate privately rendered **13-page teacher candidate pack**; no overlap with V179's first 12. **Science signoffs 0, cognitive signoffs 0, scoring approvals 0 and Unit7 scored releases 0.** This PR is keyless and nondeploying. **Formal academic status: HOLD for all scored Unit7 items until authenticated individual teacher science, cognitive, and scoring approvals.**

## Source identity and provenance

**Prerequisite:** PR #283 (V179 Batch01) merged to `main` at `e7f1f0f5646d7efc78257c20ae1d7c9ff3c5565a`. The source files were materialized privately and their actual SHA-256 values recalculated, matching the existing source-ledger document identities:

| Exact private owner-authored DOCX | SHA-256 identity | Previous public register | V180 selected ORIGINAL rows |
|---|---|---|---|
| `Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.docx` | `930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58` | V154 | **Q1, Q30, Q41, Q43** |
| `Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx` | `a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada` | V168 | **Q7, Q8, Q15, Q19** |
| `Grade11_Unit7_Topic7.3_PartA_80MCQs_Study_With_Answers.docx` | `f92ca26d3fd794b07ee4b5bc94b8418575c3c36076b9b0805f8e209e0aa4b279` | V173 | **Q12, Q24, Q31, Q42** |

Each source item is referenced in the keyless public JSON by its **unique section-prefixed ID and prior full-original-row fingerprint**. The privately authored `Unit7_V180_Teacher_Review_Batch02_PRIVATE.docx` has SHA-256 `cd1a464c56538dee3caf78fe908c9658338170a9e8c4d0a58db00a61969aedfa`; its 13-page rendered layout was visually checked. It contains *original source questions, answer choices, original keys and explanations, separate candidate alternatives and proposed key/explanation, plus blank teacher decisions*. **No part of that private question/answer pack is committed in this PR or automatically approved.**

## Amendments-only decisions: original source remains unchanged

| Source | Existing review issue | Separate private candidate direction / teacher science decision |
|---|---|---|
| **Topic7.1 Q1** | Original class-label selection is scientifically correct in chapter context, but teaching may conflate **polycrystalline** (oriented ordered grains) and **polymeric** (long-chain molecules); a class-name recognition item is primarily **Knowledge**, not automatically B-22 Understanding. | Keep original options/key; add teacher explanation distinguishing classifications. Treat as **supporting Knowledge** evidence under B-22 unless enriched to actually compare structures. |
| **Topic7.1 Q30** | Original grain-structure identification is valid but must not imply polymer chemistry. | Separate contextual polycrystalline-grain case; B-22 Understanding candidate; source retained. |
| **Topic7.1 Q41** | Diagram has **eight marked SC corner positions**, but each is shared by eight unit cells. The effective number of lattice points of a conventional mono-lattice SC cell is **one**. | Separate shared-corner counting candidate; clarify drawn locations vs effective lattice-point contributions; supplementary crystallography to the exact named B-22 outcome. |
| **Topic7.1 Q43** | Conventional **FCC** is marked at corners and six face centres, but those geometrical sites are shared: `8×1/8 + 6×1/2 = 4` effective lattice points per conventional cell. | Teacher candidate asks for the shared count, avoiding the mistake of calling six drawn face points six independent whole atoms. Rotate with Q41 in short tests to avoid repetitive counting. |
| **Topic7.2 Q7** | Tangential surface loading correctly corresponds to shear, but original K recognition is not automatically the named official B-23 Understanding demand. | Self-contained block-face sideways-loading scenario; intended B-23 Understanding **supporting** candidate pending teacher exact outcome classification. |
| **Topic7.2 Q8** | Uniform pressure on all sides primarily raises bulk/volumetric stress rather than a pure one-axis tensile or torsional response; practical volume changes are material-dependent. | Provide local equal-inward-pressure scenario; preserve original answer intent; **supporting** B-23 outcome candidate. |
| **Topic7.2 Q15** | Original generic `stress/strain` formula has no assurance of **constant modulus** outside proportional elasticity; original definition-level K does not show official B-24 **Application**. | Separate numerical **Young-modulus** problem explicitly giving corresponding tensile stress and longitudinal strain in the proportional regime, with independently checked single numerical result. Original archival K item preserved. |
| **Topic7.2 Q19** | `Y` in the old shear diagram denotes **height**, but the same symbol also denotes **Young's modulus** in this unit. A question giving only `ΔX/Y` also depends on the small-angle convention. | Use clearly named specimen height `h`, known lateral displacement and small-angle assumption; `θ≈Δx/h`. Mark as *supporting shear-geometry Application*, **not** automatically direct B-24 Young-modulus scoring evidence. |
| **Topic7.3 Q12** | "Elastic loading" does **not** guarantee a linear ramp or average force `F/2`; work area depends on force-versus-extension path. | Locally state a straight line through the origin with force vertical, extension horizontal; compute the **area/work** for B-27 **Application** rather than recall `F/2`. |
| **Topic7.3 Q24** | `U=½kx²` is proportional to stiffness at fixed extension **only for Hooke-law constant k**. A recoverably nonlinear elastic response could have different path-area energy. | Explicit constant-stiffness Hooke-law comparison at equal extension. B-28 Application candidate. |
| **Topic7.3 Q31** | The original result (halving area doubles extension at same force) presumes the compared wires stay proportional. The source originally maps it to **B-25**, which is the experiment-description outcome, although this item applies `ΔL=FL/(YA)`. | Specify matching material, length, force and linear elastic range, and propose **B-24 Application**, not B-25. Keep original correct choice and archived SLO label unchanged pending teacher remap. |
| **Topic7.3 Q42** | `U=½Fx` requires a proportional force-extension history from zero. The supplied force and final extension alone are not sufficient for nonlinear paths. | Specify Hooke's law and zero-start loading; convert millimetres to metres; proposed B-28 Application energy calculation. Avoid pairing with Q12's nearly identical triangle-area reasoning in a short scored test. |

**Never claim these are 12 incorrect original keyed answers.** The old source keyed selections are generally defensible in their intended study context. The required action is to repair source-example assumptions, standalone conditions, SLO scope or teaching precision, while **preserving the original**. A code PR, offline Word review and keyless metadata do not equal teacher authentication.

## Source limitations and pending work

The three **private author DOCX files** were directly opened in V180; the **full original NBF scanned textbook was not independently reopened in this pass**. Prior NBF p115 Fig7.5 source evidence in V154 can guide preliminary physics checking, but the requested **owner-supplied p115 image** is needed before finalizing textbook-specific attribution in Q41/Q43. The earlier V179 source requests remain open: printed **p114** for polymer example provenance, and NBF **Example 7.2** for actual bone-shortening data (Q57). **Do not silently mark any prior source dependency resolved here.**

Source-origin story, factual physics and official SLO placement are different validations. Candidate SLO and actual cognitive demand are provisional until the teacher reviews the final exact stem and its complete stimulus. For formulae, clearly distinguish *necessary assumptions*, *units* and the *direct official outcome* from supplementary enrichment.

## Artifacts, security, and following step

This V180 pull request adds **exactly four new nondeployment files**: a **12-row keyless candidate index**; this amendments-only memo; a Node verifier checking source row fingerprint references, selected source identity, originality versus V179, scientific flags and **fail-closed teacher/no-score** status; plus a GitHub Actions workflow running V180 and all prior V179–V154/Unit6/2250-bank/backend/App Check regressions.

The source original files, private teacher candidate DOCX, source textbook scans, keys, full candidate stems, student identities and authentication tokens are **not committed**. All 12 teacher decisions remain **PENDING**; scored Unit7 items **0**. There are **24 distinct** source-original rows across private candidate batches V179+V180, leaving **250 of 274 original identities not yet included in a private candidate tranche**; this does *not* mean the 24 are approved or the remaining 250 were never first-pass reviewed. Every original item has already had earlier first-pass source QC.

**Next V181:** continue with a new 20-or-fewer question priority tranche, or close exact p115/p114/Example7.2 source dependencies when supplied. Full authenticated individual teacher science/cognitive/scoring signoffs and the V160/V161 backend NO-GO gates must be resolved before student scored release.

**Owner merge only after latest-head green checks:** inspect four nondeploy files → Ready for review → Merge pull request → Confirm merge; do not merge a red, stale or pending check. No Firebase change is requested.
