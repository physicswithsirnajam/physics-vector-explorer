# V189 — Unit 7 private two-item academic review: exact B-22 scope, distractors, and HOLD

**Decision: TWO MODEL-PRESCREENED PRIVATE CANDIDATES; NOT APPROVED; ZERO AUTHENTICATED TEACHER APPROVALS; ZERO SCORED UNIT 7 QUESTIONS.** This is an academic revision review, not an automatic teacher signoff or a deployment. The predecessor PR #292 (V188) is confirmed merged to `main` at `e61222adfc433a6fd0d455374789c1ace3ba040e`.

## Sources and exact limits

We reopened the owner's **original Topic7.1 Word bank** (whole-file SHA-256 `930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58`), the original-preserving **V184 private teacher revision Word** (SHA-256 `c63f8ed1c9fe68d3e331971e258d2b2104da58a098ca8b2975a83c16b6356980`), and both V188 private candidate JSON and private keyless digest manifest. Original owner-authored stems, all four choices, keyed answers and explanations were compared directly to the separate proposed V188 candidates for the two IDs below. The entire NBF printed Unit7 explanatory text **pp.113–116 was not independently reopened**. The supplied printed p126 shows the end-of-unit exercise, not the actual text of those earlier teaching pages.

**External official assessment reference independently consulted:** FBISE 2025 HSSC-I Physics assessment framework:
`https://fbise.edu.pk/ModelPaper/2025/Assessment%20Frameworks/HSSC-I/Final%20Assessment%20Framework%20Model%20Question%20Paper%20Physics%20HSSC-I.pdf`

The published **P-11-B-22** explicitly asks students to **distinguish between the structures of crystalline, glassy, amorphous, and polymeric solids** and designates the outcome **Summative / Understanding**. This exact assessment scope is materially narrower than merely having any scientifically related structural example. The 2025 framework was checked; this PR does not claim exhaustive verification of any later notification. Note also that *polycrystalline* refers to many ordered grains, while *polymeric* refers to molecular-chain chemistry. These descriptions are not interchangeable or necessarily mutually exclusive with amorphous/crystalline order.

## Amendments-only verdicts — original source preserved

| Original source ID | Scientific finding and assessment concern | Teacher decision requested |
|---|---|---|
| **XI-U07-T071-Q022** | Randomly oriented many-grain material can show **approximately** direction-independent macroscopic responses by averaging anisotropic grain responses, provided grain textures, microstructure and measured property permit. Original keyed logic and V188 candidate are scientifically defensible. **However**, this asks about macroscopic isotropy of polycrystals rather than explicitly distinguishing named B-22 structural classes. | **COMPULSORY scope decision** before direct summative use: retain original and V188 candidate for **supporting classroom study**, NOT automatically direct B-22 scored evidence. Optional future candidate could explicitly compare the structural arrangements; that would need a *different* private revision fingerprint and fresh review. |
| **XI-U07-T071-Q025** | The original and V188 selected answer correctly capture **short-range order without extended periodicity** in amorphous structures. Two earlier V188 distractors were unusually weak (one self-contradictory grain-free polycrystal, one unrelated gas), reducing discrimination. Broad sample-level periodicity language could also fail to distinguish a polycrystal's grains. | **COMPULSORY distractor-quality revision** before scoring. A **separate private V189 revised candidate** now states absence of extended periodicity *within any extended region* and compares amorphous, single-crystal, polycrystalline and polymeric interpretations. Its one-best-answer plausibility was model pre-screened. Actual candidate wording/options/key and NEW SHA-256 remain **PRIVATE**, not public. Teacher science, real cognitive/SLO and final scoring approval still **PENDING**. |

**No original keyed source answer is hereby labelled incorrect or changed in the owner's Word source.** The V188 Q22 revision remains its original private identity. The V188 Q25 revision remains archived and its revised V189 candidate has a **new private SHA-256** because stem/options/explanation changed; there is no transferable academic approval from one revision to another.

## Exact privacy and provenance boundary

A private, visually inspected five-page DOCX `Unit7_V189_Private_Two_Item_Academic_QC.docx` records original and previous private questions, independent physics and distractor concerns, the separate improved Q25 candidate and blank teacher decision fields. Accompanying private JSON and a private hash manifest record two individually identified candidate revisions (one retained, one changed). **None of their full question stems/options, answer letters, explanations, content-derived candidate hashes or private document bytes is stored in public GitHub.**

Hash comparison was independently reproduced from the V186 canonical convention locally; the full checked-in V187 intake program was **not** executed with a complete local V185 source-index file. A deterministic SHA proves identity of a private candidate, not copyright permission, scientific correctness, source textbook accuracy, or an authenticated teacher approval. The public GitHub audit cannot independently recompute withheld private question hashes; it verifies public original source IDs/row hashes and fail-closed metadata only.

## Current academic and security gates

- Original Unit7 inventory **274**, existing detailed private candidate queue **72**. These two V189-reviewed items are **members of that existing 72**, not new source questions.
- Actual owner-scored Unit7 items **0**, authenticated teacher science decisions **0**, verified cognition decisions **0**, separate owner scoring permissions **0**.
- Prior V185 per-item candidate digest fields remain **null in public metadata**, though the two pilot private digests are held separately. Neither V185 nor the live bank is silently updated.
- Original NBF printed **p114**, **p115**, **Example 7.2**, and apparatus figure licensing/source questions elsewhere in Unit7 remain outstanding; they are **not resolved by this two-item review**.
- The V160 `NO_GO_DEPLOYMENT_BLOCKED` and V161 `NO_GO_PRODUCTION_AND_STAGING_DEPLOYMENT` teacher backend gates remain unchanged. No Firebase, student/teacher records, staging/production, roles, App Check settings, or scored Test Builder source changes are made.

## Four nondeployment PR files

1. `quality/unit07/unit07-v189-two-candidate-slo-distractor-qc-no-keys.json` — two original IDs, source SHA fingerprints, supporting-versus-direct summative conclusion, privacy/revision boundaries and score HOLD.
2. `quality/grade11-v189-unit07-two-private-candidate-slo-distractor-review.md` — this amendments-only academic report.
3. `scripts/audit_grade11_unit07_two_candidate_review_v189.cjs` — verify V188/V185/V184 source identity, scope, privacy and no-release invariants with negative tests.
4. `.github/workflows/validate-grade11-v189-unit07-private-academic-review.yml` — run public-only audit plus V188/V187/V186, V185–V154, Grade XI pinned original, Unit6 560 and backend/App Check no-score regressions.

**Next V190:** use the owner-reviewed private Q25 draft and Q22 supporting classification to design protected, **actual item-revision-bound teacher decision intake**, without implementing or deploying real teacher approval until the owner consents to the backend and security requirements. Continue offline scientific checks and source evidence closure as appropriate.

**Owner merge sequence:** inspect four changed files only; wait until both exact latest-head GitHub checks pass GREEN, then **Ready for review → Merge pull request → Confirm merge**. Do not merge on failed or pending checks. Keep all private JSON/Word/ZIP artifacts out of public GitHub.
