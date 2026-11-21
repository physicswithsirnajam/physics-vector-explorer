# V95-C2E — Grade XI Unit 6 Topic 6.2 MCQs 1–20: prepared-source, scientific and official framework review

**Scope:** First 20 of 80 original Topic 6.2 teacher-prepared MCQs, following confirmed merge of PR #109. This PR adds **only evidence, review notes and regression gates**. Original bank answer letters, stems, options, explanations, official-per-item eligibility flags, course pages and master teacher approvals remain **unchanged**.

## Primary sources reopened in this review

- Original owner-private **`Grade11_Unit6_COMPLETE_MASTER_ALL.pdf`**, compiled **PDF pp.51–53**, Topic 6.2 Part A, Section I (Q1–20, four A–D options each), and **PDF p.61**, source answer-letter and explanatory key for exactly Q1–20.
- Direct re-read of GitHub source **`question-bank/grade-11/unit-06-topic-62-v78-80-source.json`**: original source IDs `XI-U06-T62-MCQ-0001` to `0020`.
- Unicode NFKC plus whitespace-only matching (excluding the prepared PDF's page furniture) yielded **20/20 matching stems, 80/80 matching options and 20/20 original answer letters**. Original sequence: **`BCBDCCCBBABCADBBCACA`**. Source answer explanations were read for scientific meaning, **not** byte-for-byte text compared.
- Directly reopened the **official teacher-supplied `Physics_HSSC_I_model_paper_50_percent.pdf` p.12**: **P-11-B-41:** “Explain why real fluids are viscous fluids” and **P-11-B-42:** “Describe how viscous forces in a fluid cause a retarding force on an object moving through it”; **both Summative / Understanding**. This validates **the SLO-level official classification**, not automatically the original question's individual K/U/A level or eligibility.
- The independently supplied original printed **NBF textbook pp.91–95 were NOT directly available/reopened in this stage**. This is a comparison to the teacher-prepared master PDF and cannot certify textbook-exact wording or artwork.
- These are original student-facing teacher-developed MCQs, not necessarily 20 verbatim printed-NBF exercises.

## Academic and option-key result

| Evidence gate | Result |
|---|---|
| Source stems identical to prepared master | **20/20** |
| Four A–D option texts identical | **80/80** |
| Original source answer keys match prepared master | **20/20**, `BCBDCCCBBABCADBBCACA` |
| Independent scientific review | All **20 original letter selections supported** within the source models |
| Required explanation/model/source notes | **3**: Q2, Q7, Q13 |
| Optional context/cognition notes | **17** |
| Compulsory original answer-letter corrections found | **0** |
| Original public-bank records edited | **0** |
| Individual official SLO/K-U-A/teacher approvals | **PENDING** |

Key dimensional checks independently reviewed: `η` in **Pa·s = N·s·m⁻² = kg·m⁻¹·s⁻¹**; `F_d=6πηrv` has units newtons; `F_d∝v` with `r`, `η` held fixed; `F_d∝r` with `v`, `η` fixed, **only within Stokes flow conditions**. With buoyancy neglected in the named simplified falling-body model `F_d=mg` at terminal velocity; a constant **nonzero** speed has acceleration **zero**.

### Items requiring compulsory source/model decisions before assessment certification

| Exact original ID | Priority | Issue | Teacher action |
|---|---|---|---|
| **XI-U06-T62-MCQ-0002** | COMPULSORY_SOURCE_NOTE | η textbook symbol attribution requires printed-source check | Teacher-prepared source says the NBF section uses η for the coefficient of dynamic viscosity; that convention is scientifically valid, but printed NBF pp.91–95 have not been directly inspected and textbook-exact attribution remains pending. **Decision:** retain original letter **C**; add context/source verification, with any new wording kept as a separate teacher-approved alternative. |
| **XI-U06-T62-MCQ-0007** | COMPULSORY_CONTEXT_NOTE | Flow rate is not determined by viscosity alone | Honey generally has much greater viscosity than water at comparable temperature, but 'flows more slowly' assumes comparable geometry, pressure/head, volume and temperature; viscosity alone does not set a universal flow speed for unrelated arrangements. **Decision:** retain original letter **C**; add context/source verification, with any new wording kept as a separate teacher-approved alternative. |
| **XI-U06-T62-MCQ-0013** | COMPULSORY_MODEL_NOTE | Stokes law validity regime | F_d=6πηrv is for a small rigid sphere moving slowly relative to an approximately Newtonian fluid in a creeping-flow/low-Reynolds-number regime; not a universal drag law for fast objects or non-spherical shapes. **Decision:** retain original letter **A**; add context/source verification, with any new wording kept as a separate teacher-approved alternative. |

The other 17 items are scientifically sound as **provisional self-practice** under their stated physical assumptions. Important optional distinctions include: gas versus liquid viscosity temperature behavior (Q5–6); direction of drag *relative to fluid* rather than always upward (Q10); terminal velocity and net force (Q18–20); gravity being **absent explicitly** in Stokes’ drag formula while possibly affecting actual falling speed (Q14).

### Cognitive-level caution

The official topic outcomes are **Understanding**, yet several source items merely ask for a name, symbol, SI unit, or expression; a per-item question can be **Knowledge-level** even if its broader topic is associated with a Summative/Understanding SLO. These should remain useful for student practice, while **individual examination eligibility** requires separate teacher verification.

| MCQ | Original letter | Candidate topic SLO only | Tentative cognitive demand | Status |
|---|---|---|---|---|
| 1 | B | P-11-B-41 | Knowledge | OPTIONAL |
| 2 | C | P-11-B-41 | Knowledge | COMPULSORY_SOURCE_NOTE |
| 3 | B | P-11-B-41 | Knowledge | OPTIONAL |
| 4 | D | P-11-B-41 | Understanding | OPTIONAL |
| 5 | C | P-11-B-41 | Knowledge | OPTIONAL |
| 6 | C | P-11-B-41 | Knowledge | OPTIONAL |
| 7 | C | P-11-B-41 | Understanding | COMPULSORY_CONTEXT_NOTE |
| 8 | B | P-11-B-41 | Knowledge | OPTIONAL |
| 9 | B | P-11-B-42 | Knowledge | OPTIONAL |
| 10 | A | P-11-B-42 | Understanding | OPTIONAL |
| 11 | B | P-11-B-42 | Knowledge | OPTIONAL |
| 12 | C | P-11-B-42 | Knowledge | OPTIONAL |
| 13 | A | P-11-B-42 | Knowledge | COMPULSORY_MODEL_NOTE |
| 14 | D | P-11-B-42 | Understanding | OPTIONAL |
| 15 | B | P-11-B-42 | Knowledge | OPTIONAL |
| 16 | B | P-11-B-42 | Understanding | OPTIONAL |
| 17 | C | P-11-B-42 | Understanding | OPTIONAL |
| 18 | A | P-11-B-42 | Understanding | OPTIONAL |
| 19 | C | P-11-B-42 | Understanding | OPTIONAL |
| 20 | A | P-11-B-42 | Understanding | OPTIONAL |

## Evidence ledger, release and rights guards

- New **20-row per-ID addendum** `quality/grade11-unit06-v95c2e-topic62-mcq01-20-academic-review.csv` preserves each original question ID, original prepared PDF page and answer, scientific qualification, candidate-only SLO and tentative cognition, printed-source review status **PENDING**, and teacher approval **PENDING**.
- Dedicated test `scripts/test_grade11_unit06_v95c2e_topic62_first20_academic.cjs` locks all 20 original stems/options/answer letters (deterministic fingerprint `0x3cdb5f37`), validates their source pages/key sequence, demonstrates formula dimensional relationships, insists on all 3 documented mandatory notes, preserves teacher queue flags and original unit-release holds.
- Inherits V95-C2D/C2C/C2B/C2A/V95-C1/V94-D checks. **No amendments were made to the existing bank**.
- Scope progression: **80/80 Topic6.1 academically inspected** (still not teacher approved) + **20/80 Topic6.2 inspected** = **100/560 Unit6 items inspected**. The other **460 Unit6** questions are not scientifically reviewed in V95-C2. The original 560-row master queue still retains all teacher approvals PENDING. The original 14 separate end-of-unit textbook MCQs are not part of the 560 and are not approved here.
- Original release status remains `planned` / assessment `not-published`; **560 Unit6 / 2250 Grade XI** public provisional questions, **136 standalone situations and zero genuine shared-stimulus groups**, no original textbook scan/figure imports.

**Keep this PR DRAFT until latest-head CI is green and the teacher reviews Q2, Q7 and Q13.** Next: V95-C2F Topic6.2 conceptual reasoning MCQs 21–40, then numerical and scenario groups in appropriately bounded batches.
