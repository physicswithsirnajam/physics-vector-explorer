# V199 — Original Topic 7.1 twelve-item science, source and FBISE B-22 cognitive QC

**Predecessor verified:** PR #302 / V198 merged into `main` at `0601a1fe3236bc6956dab76e14de716f1a66a5a2`. V199 moves to **Topic 7.1 — Classification of Solids** (the prior V197 and V198 second-pass batches addressed Topics 7.3 and 7.2 respectively).

## Source evidence checked

The exact owner-original boxed `Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.docx` was opened and verified with SHA-256 `930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58`. All twelve selected original stems, **48 option texts**, original answer letters and original explanations were read from the two Word tables. None of those source rows was amended.

The complete owner-provided NBF Unit 7 PDFs (`Unit 7.pdf`, `unit 7 - Physics 11.pdf`), whose SHA-256 values are pinned in V193, were directly inspected on original printed **pp113–116**: crystalline materials and grains, polymers and amorphous/glassy structures, lattice/unit cell, and the seven crystal systems. The applicable prior verified official framework outcome is **FBISE HSSC-I Physics P-11-B-22 — Summative / Understanding** (published 2025). This review does not claim a new teacher verdict or that every contextual detail is direct official summative evidence.

The original 80-row source hashes were cross-checked against V146/V154. These twelve IDs are **outside** the 72-source detailed private candidate queue in V185. They are new **source-QC decisions only**, not twelve newly drafted or approved candidate revisions.

## Primary-source terminology warning

**Printed p113 contains the parenthetical “polycrystalline (polymeric)”** in a classification phrase and separately refers to grains as in “polymeric” solids. Scientific terminology requires a clear distinction: *polycrystalline* describes multiple crystallites/grains, while *polymeric* describes macromolecular-chain composition. **Printed p114 separately teaches polymers formed from smaller molecules**, supporting this correction. The new private review clearly separates the publisher's wording from the scientifically correct distinction; it does **not** silently overwrite the textbook or change the original authored answer keys.

The textbook p114 also calls amorphous solids **glassy**, and p115 uses unit-cell repetition. The lattice itself is an abstract periodic point arrangement, whereas crystal structure additionally needs a basis; using “lattice” loosely for repeated unit cells in a beginner example merits optional precision without wrongly invalidating the intended source MCQ.

## Amendments-only per-item findings

| Source Q | Original scientific assessment | Cognitive / direct-SLO decision |
|---|---|---|
| **2** | Regular repeating particles characterize crystals; original answer correct (p113) | Definition/identification **supporting recall**, not automatically B-22 Understanding |
| **3** | Many differently oriented crystallites/grains define polycrystalline material; original answer correct (p113) | **Promising structural distinction**, but teacher must judge whether the wording truly requires Understanding rather than recall; do not repeat p113's incorrect polymeric synonym |
| **8** | **Monomer** is valid terminology for polymer repeating units; original answer correct | p114 uses “small molecules” rather than the term “monomer”; **supplementary vocabulary**, optional source-wording note |
| **9** | The word **polymerization** is explicitly printed on p114; original key correct | **Supporting polymer-process recall**, not necessarily direct four-category structural comparison |
| **13** | Atoms, ions or molecules can occupy regular crystalline positions (p113); key correct | **Supporting constituent recall**; distractors are remote; optional improve discrimination |
| **21** | Ordered crystals can exhibit **anisotropy** because internal directions differ (p113); original key correct | Good physical **Understanding**, but direct B-22 category distinction remains **teacher-PENDING**; supporting until adjudicated |
| **24** | Glass lacks crystalline long-range periodic order and is amorphous/glassy (p114); original key correct | **Promising direct B-22 Understanding**; no compulsory science correction |
| **26** | Periodic repetition of unit cell constructs structure, as illustrated on p115; original key correct in elementary framing | **Supporting crystallography**; optional lattice/structure/basis clarification |
| **33** | No long-range regular atomic arrangement permits an amorphous interpretation; original “may” is defensible (p114) | **Promising direct B-22 inference**; optional replace loose “sharp long-range lattice pattern” with clear atomic periodicity phrase |
| **34** | Small crystal regions are grains/crystallites in polycrystalline solids (p113); key correct | **Supporting recall**, preserve previous V154 cognitive-demand reconsideration |
| **50** | Seven systems are distinguished by unit-cell side-length and interaxial-angle relations on pp115–116; key correct | **Supporting crystallography detail**, preserve prior V154 Understanding→recall review |
| **61** | Repeated arrangement of ions in NaCl identifies a crystalline solid (p113, Fig7.1); original key correct | **Promising direct interpretation**; optional more plausible *solid-category* distractors instead of visibly wrong liquid/gas alternatives |

**Summary: four promising direct B-22 candidates** (Q3, Q24, Q33, Q61) and **eight supporting/scope-sensitive** (Q2, Q8, Q9, Q13, Q21, Q26, Q34, Q50). This grouping is an **unapproved model academic analysis**; original answer letters were checked and **zero wrong originals found in this batch**. Specifically, Q3 remains borderline between definition recall and genuine Understanding; Q61's distractors should be considered for improvement before real scored use. Any optional revision must create a **new private revision fingerprint**, preserve the owner original and undergo a fresh item-specific review.

## New private review deliverable

An original-keyed **seven-page** A4 Word and PDF review pack was created and visually checked. It includes each complete original MCQ, all four owner-authored options, original correct letter and explanation, NBF page mapping, item-level science/distractor analysis and **blank reviewer decision fields**:

- `Unit7_V199_PRIVATE_Topic71_Twelve_Original_Source_SLO_QC.docx`, SHA-256 `5ed0378eec4d41dfc5cae51803b34e97a273450ba86218ad92ef929b3dd3a09a`.
- `Unit7_V199_PRIVATE_Topic71_Twelve_Original_Source_SLO_QC.pdf`, SHA-256 `ec23428a892186b8c4fb57af265f07d0815c5c6adc89aea028cacb24594edec2`.
- Internal source-review working JSON SHA-256 `ed880009154a5d1a1d10c63c325263362ef700a31dec3d29d68c2a6cc3d9a0b7`.

**Privacy:** none of these original keyed documents, complete question options, individual approved candidate hashes, or original NBF page images is committed to public GitHub, Actions logs or the live student portal. Public code knows original **source fingerprints** and review codes only, not keyed answers.

## Four public additions and unchanged gates

1. `quality/unit07/unit07-v199-topic71-twelve-original-structure-slo-no-keys.json`: original V154 row SHA IDs, source/cognitive classifications, p113 science caveat and 0-scored status.
2. `quality/grade11-v199-unit7-topic71-twelve-original-structure-science-qc.md`: this source-based amendments-only report.
3. `scripts/audit_grade11_unit07_topic71_secondpass_v199.cjs`: exact 12 source SHA check against V146/V154; disjoint V185/V197/V198 selection; original framework B-22; forged source/approval/no-score denials.
4. `.github/workflows/validate-grade11-v199-topic71-twelve-source-slo.yml`: new audit plus original Unit7 source banks, V198/V197 audits, Grade XI 2250 original source, Unit6 560 teacher-pending, V160/V161 backend and App Check/reporting protections.

No textbook edit, original question/answer alteration, new candidate revision, teacher role, Firestore Rules/Auth/App Check, staging/production, live scored test, student record, or billing change.

The Unit7 source universe remains **274 original identities**, existing private candidate queue **72**, actual authenticated teacher science approvals **0**, cognitive approvals **0**, owner scoring authorizations **0**, scored Unit7 questions **0**. The earlier unsigned V195 independent teacher decision sheet remains not returned. Both V160/V161 backend and production/staging conditions remain **NO-GO**.

**V200:** continue fresh source-based item QC or incorporate real completed independent teacher-review evidence if received. Do not mistake a green GitHub test for a scientific or examination-authority signoff.

**Owner merge:** retain the PR in Draft until the latest head has **two GREEN checks**. Inspect four changed files, then **Ready for review → Merge pull request → Confirm merge**. Never merge red, pending or stale checks.
