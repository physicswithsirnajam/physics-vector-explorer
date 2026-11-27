# V200 — Unit 7.1 classification and microstructure: 12 new original MCQ source/SLO reviews

**PR #303/V199 prerequisite verified merged into main** at `b41a762bae894e7f4eb09dd44fa9278c1d2ab2db`. This is a fresh academic batch, not a new teacher-approval form and not a scored question-bank deployment.

## Sources and selection

Reopened the actual owner-authored boxed Word bank `Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.docx`, whose SHA-256 is `930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58`. The original twelve stems, all **48 options**, answer letters and owner-written explanations were independently read. Original NBF Unit7 scanned pages **113–115** were checked for crystalline and polycrystalline microstructure, polymers, amorphous/glassy solids and repeated cubic lattice. FBISE HSSC-I **P-11-B-22** is a summative theory outcome at **Understanding**.

**Source IDs:** **Q17, Q18, Q23, Q28, Q29, Q32, Q35, Q36, Q38, Q39, Q55, Q67**. These were confirmed not to occur in the already-reviewed **V185 72-item** private candidate queue or the different **V199 12-item Topic7.1 source-only** audit. V197 and V198 belong to other topic codes and are also disjoint. All twelve original row SHA fingerprints match the V146 and V154 source registers.

## Amendments-only individual findings

| Original Q | Scientific and distractor finding | Recommended status |
|---|---|---|
| **17** | **Anisotropy** correctly means crystal properties may depend on direction, but recalling the term alone does not ensure structural comparison | **Supporting practice**; optional property-direction scenario |
| **18** | **Isotropic** correctly means direction-independent measured properties. Correct key, low conceptual demand | **Supporting practice**; optional grain-property explanation |
| **23** | One continuous crystal differs from a multi-grain polycrystalline body. Original C and explanation correctly distinguish structures | **Promising direct B-22 Understanding**, teacher decision pending |
| **28** | Different substances may have different crystalline structures. Original A correct, but broad statement does not necessarily compare named structural classes | **Supporting**; optional comparative variant |
| **29** | Multiple randomly oriented grains each retain local crystalline order, unlike the long-range disorder of amorphous solids. Original C correct | **Promising direct B-22** |
| **32** | Natural versus synthetic polymers refers to origin/manufacture, not presence of repeated chain units. Original B correct. This is orthogonal to amorphous/crystalline organization | **Supporting**; optional polymer crystallinity scenario |
| **35** | Regular atomic spacing permits characteristic diffraction, original A correct. Crystallographic characterization is useful but not automatically the required four-class distinction | **Supporting method**; optional graph/pattern inference |
| **36** | A periodic arrangement of ions supports an **ionic crystal**; original D is the best choice. A mention of *metal ions* alone does not specify an ionic compound's full cation/anion structure | **Promising direct**, optional specify oppositely charged ions for source precision |
| **38** | An amorphous **glass is still solid** without extended crystalline periodicity; original B scientifically correct | **Promising direct B-22** |
| **39** | Regular sodium-chloride crystal and amorphous window glass represent contrasting structural classes; original A correct | **Promising direct B-22** |
| **55** | Repeated ordered cubic lattice signifies crystalline material; original D correct. Other choices mainly describe unrelated phenomena, weakening distractors | **Supporting identification**, optional stronger plausible solid alternatives |
| **67** | Many randomly oriented grains can yield **approximately isotropic bulk properties**, despite possible directional behavior of an individual crystal. Original D correct **conditional on random/untextured orientations and the measurement/property** | **Promising direct**; **compulsory teaching qualifier** before scored use |

**Summary:** **6 promising direct Understanding candidates** (23, 29, 36, 38, 39, 67) and **6 supporting/scope-sensitive items** (17, 18, 28, 32, 35, 55). A correct answer letter and model QC do not imply an independent science/cognitive approval. **No wrong original answer letter found in this selection; zero original questions, options, explanations or answer keys changed.**

### Critical textbook caution preserved

Original NBF printed p113 misleadingly parenthesizes *polycrystalline (polymeric)*. **Polycrystalline** means a material containing many crystalline grains; **polymeric** means made of long-chain molecules. Printed p114 discusses polymer chains separately. These terms cannot be taught as synonyms. Similarly, polycrystalline bulk isotropy is **not guaranteed**: it depends on suitable random grain orientations, scale and property. The original question Q67 expresses this condition appropriately.

## Private keyed teacher pack

A **7-page A4 DOCX**, rendered and visually checked, plus corresponding PDF are private, complete original-MCQ teacher review artifacts. They contain all original questions/options/answers/explanations and separate science/SLO decisions with **blank real human-review fields**. Their exact SHA-256 hashes are:

- `Unit7_V200_PRIVATE_Topic71_Twelve_Original_Source_SLO_QC.docx` — `7a0a187b75682b02d3d5cf975a55cc0de4eb0e54e6edc9df943f365a95b1a881`.
- `Unit7_V200_PRIVATE_Topic71_Twelve_Original_Source_SLO_QC.pdf` — `3abf1edd05e480cb731bdf0f7655d71e4b9fb88cacf0e066ca3a78c7905d22cf`.
- Confidential working JSON — `cb66a874dba4e45afec2e419f54beff3f2a1cf687a707f0700951c6c63597fad`.

The private keyed files and original textbook scans **must not** be committed to GitHub, displayed in public CI or auto-imported into a scored student portal.

## Scope and safety boundaries

Exactly **four additive public, nondeploying files**:
1. `quality/unit07/unit07-v200-topic71-next12-structure-source-slo-no-keys.json`: source IDs, immutable source SHA, per-question provisional QC, no-score metadata.
2. `quality/grade11-v200-unit07-topic71-next12-structure-source-slo-qc.md`: this amendments-only academic report.
3. `scripts/audit_grade11_unit07_topic71_next12_v200.cjs`: exact V146/V154 source and V185/V199 disjointness, source claims, approval HOLD and fail-closed adversarial changes.
4. `.github/workflows/validate-grade11-v200-topic71-next12-source-slo.yml`: V200 with previous Unit7 topic/Grade XI originals, Unit6, V160/V161 backend and App Check tests.

Existing Unit7 inventory remains **274 original source questions**, **72 detailed private revised-candidate reviews**, **0 authenticated science/cognitive teacher approvals**, **0 owner scoring permissions**, **0 scored Unit7 student questions**. No source bank, Firebase Auth/Firestore Rules/App Check, teacher roles, live test builder, student records or production/staging deployment changes. Existing teacher backend **NO-GO** remains.

**Next V201:** continue distinct original source QC, or apply actual human teacher feedback if independently supplied. A green GitHub CI validates source/metadata controls only, not real human academic signoff.

**Owner merge:** keep PR Draft until the current branch's **two latest-head workflows pass**, review four Files changed, then Ready for review → Merge pull request → Confirm merge.
