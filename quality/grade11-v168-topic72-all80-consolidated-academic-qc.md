# V168 — Unit 7.2 full 80-MCQ academic QC: original-source integrity, duplicates, stimulus readiness and FBISE blueprint

**Decision: 80 original questions have completed an initial source/answer check, but NO individual teacher academic approval and NO student scored release.** This report consolidates V164–V167 without silently rewriting the original Word, publishing original keyed stems/options/explanations, or treating a GitHub CI pass as an independent scientific endorsement.

## Original owner material and provenance

- **Original:** private `Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx`, SHA-256 `a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada`. Its **80 boxed MCQ rows** and **80 keyed answer/explanation/SLO rows** were inspected programmatically and for scientific consistency; neither full content nor private book scans are in public GitHub.
- **Textbook:** NBF Grade XI Physics Unit 7, printed **pp.116–121**, SHA-256 `00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe`. Official FBISE HSSC-I Physics Assessment Framework (Curriculum 2022–23, Scheme of Studies 2024), PDF p.10, internal Page 4 of 21, supplies actual summative/cognitive outcome labels.
- **First-pass answers:** **80/80** original answer letters select the correct-option text in the original answer table; earlier independent textbook/physics checks detected **0 incorrect keyed options**. All original keyed values and science explanations remain private. This is *not* 80 teacher-approved questions.
- **Option construction, exact duplicates:** the original bank has **4 distinct answer options for every question**; there is **no exact duplicated option string within an individual MCQ**, and no identical whole question stem across the bank. The correct-answer letters happen to be perfectly distributed **A20/B20/C20/D20**. Such balance is convenient for practice but is **not a substitute for physical correctness or good distractors**.
- **Stronger source integrity:** Earlier V164 Q1–20 full-row SHA-256 records used an insufficiently specified fingerprint field recipe, whereas V165 and later used exact canonical JSON keys. Using the *same original private DOCX* and the explicit V165 recipe, we **recomputed canonical hashes for Q1–20** and included them in a new 80-row keyless V168 manifest. The prior V164 review findings are preserved; **do not treat the original V164 hash values as interchangeable** with the canonical ones. The V168 manifest's ordered `sha256` list has SHA-256 `bfcba8b53f22093f481ce9c5ba6ca5c62512d4ebb5a697bcc3609f7563a069cf` after joining all 80 row hashes with **single newline separators and no trailing newline**. CI validates this checksum and confirms Q21–80 SHA values match their previous source-bound ledgers. CI cannot recompute keyed hashes from private Word bytes; this is **provenance attestation, not a source upload**.

## Exact original authored blueprint — now verified across all four batches

| Outcome code | Official status & demand | Original items | K | U | A | Strict direct-topic candidates | Supplementary NBF content |
|---|---|---:|---:|---:|---:|---:|---:|
| **P-11-B-23** — one-dimensional tensile/compressive deformation | Summative / Understanding | **11** | 4 | 7 | 0 | **6** | **5** |
| **P-11-B-24** — stress, strain and Young's modulus | Summative / Application | **48** | 9 | 11 | **28** | **31** (including **20 A**) | **17** |
| **P-11-B-26** — elastic/plastic deformation, elastic limit | Summative / Understanding | **21** | 7 | 14 | 0 | **15** | **6** |
| **TOTAL** | **first-pass, not teacher-certified** | **80** | **20** | **32** | **28** | **52** | **28** |

Original item-demand proportions: **K 25% · U 40% · A 35%**. The 28 original A-tagged items are **not automatically all 28 direct B-24 summative Applications**. Strictly applying earlier conservative scope categories gives **20 directly relevant A candidates** and eight additional supporting/prerequisite A items.

**Important nuance:** P-11-B-24 mentions *stress* and *strain* generally as well as Young's modulus. Earlier reviewers deliberately treated isolated shear/volume/bulk-modulus questions conservatively as *supporting*, because the official outcome does not explicitly name bulk/shear modulus as a separate summative construct. This is a **pending teacher scope decision**, not an authoritative claim that every shear- or volume-related item is prohibited in an FBISE paper. Similarly, an item marked K can support knowledge needed by an official Understanding or Application SLO without independently demonstrating that higher demand.

The independent other-unit outcomes **P-11-B-25** (metal-wire experiment), **P-11-B-27** (force–extension work) and **P-11-B-28** (stored elastic potential energy) belong to **NBF Topic 7.3**, not missing Topic 7.2 coverage. Our unscored Topic 7.3 lesson already covers them. Do not distort a Topic 7.2-only blueprint by inserting those outcomes into this 80-item original source bank.

## Priority 1 — new hard standalone-item readiness problem

**Q57 is currently NOT standalone test-ready.** Its original stem tells a student to use the values in **NBF Example 7.2**, but the stem does **not supply the example's physical inputs**. Its original keyed shortening is correct when the textbook example is available; this is **not a wrong answer key**. Earlier V166 had flagged only an *optional rounding note*, so the whole-bank audit now separately adds **CROSS-01, compulsory before standalone scored use**.

**Fix strategy:** retain the original Q57 in the owner Word archive and produce a source-bound, teacher-reviewed **self-contained numerical stem** supplying load, original bone length, radius/cross-section, and Young's modulus (or attach an accessible source-approved worked-example stimulus). Verify numeric units, sign conventions, rounding and distractors again when that actual revised candidate is created. Do **not** paste the private answer explanation into public GitHub or change the original letter merely to align its formatting.

### External figure/table/worked-example dependencies: 13 need a presentation decision

The original source **mentions an external Figure/Table/Example in 15 MCQs**. Two—**Q59 and Q76**—include enough numerical/situational detail in their current text to remain answerable without viewing the cited source. The other **13 items** require an accessible figure/table or carefully justified self-contained rewrite before the portal can claim independent, fair scored use:

| Missing or externally assumed context | Original question numbers | Recommended teacher decision |
|---|---|---|
| **Figure 7.8**: identify listed force/deformation types | **9** | Supply an authorized image/alt-text stimulus, or phrase as a self-contained classification question |
| **Figure 7.12**: axes, marked regions/points and elastic/yield/ultimate/fracture interpretation | **20, 28, 29, 30, 31, 33, 34, 79, 80** | Provide a **single accessible, original or permission-cleared stress–strain stimulus**, with labelled axes A–E and equivalent text; group related items if used together to avoid excessive repeated point-letter recall |
| **Table 7.1**: steel vs aluminium listed moduli | **39, 40** | Include the relevant supplied material values in stem/stimulus, or explicitly choose a verified comparative concept task; do not require an unavailable table |
| **NBF Example 7.2**: missing bone-problem numerical inputs | **57** | **Compulsory self-contained data or attached stimulus**, plus fresh worked-value QC |

**Important:** A reference to a figure is not automatically an error in a *textbook-dependent revision worksheet*. It becomes a **publication blocker** if the same question is offered as a standalone graded Test Builder item without the referenced figure or equivalent data. Even when the student has learned Figure 7.12, pure diagram-label memorization must not replace SLO-level conceptual understanding. Our original public lesson's independently drawn SVG could be adapted **only after** exact landmark/presentation consistency, alt-text, accessibility, mobile rendering, source rights, and teacher review; this PR **does not attach or activate stimuli**.

## Priority 2 — duplicate and near-duplicate whole-bank decisions

There are **no exactly repeated full stem strings**, but semantic/topic overlap exists. A question may be useful practice despite shared physics, particularly when one asks recognition and another asks a situation or calculation. **Do not auto-delete source items.**

| Original pair/group | Overlap assessment | Editorial action |
|---|---|---|
| **Q33 + Q80** | **High:** both ask for point **D = ultimate tensile strength**, the second adding only fracture context. | Keep originals, but for scored sampling prefer one or a meaningfully different reasoning item about material deformation or elastic limit |
| **Q37 + Q74** | **High:** metal wire-drawing ductility. | Keep originals for supplementary learning; consider replacing one scored candidate with distinct plastic-strain reasoning |
| **Q36 + Q75** | **High:** glass/brittle behavior; Q75 is a scenario. | Preserve the more demanding distinct interpretation if useful; avoid overrepresenting brittle examples |
| **Q5 + Q66**, **Q6 + Q61** | **Medium:** axial tension and compression, definition versus scenario. | Preserve both if the second genuinely assesses transfer; otherwise vary a force-direction context |
| **Q14 + Q64 + Q67** | **Medium:** elastic recoverability across direct definition and real-world objects. | Vary rationale and elastic-limit interpretation so correct choice is not merely the word “recovers” |
| **Q50 + Q60** | **Low:** same wire-extension formula with different inputs/units. | Both may remain if different misconception distractors and computational skills are required |
| **Q29/Q31/Q34** | **Shared figure, NOT exact duplicates:** three different landmarks A/B/E. | Deliver together with a graph stimulus when appropriate; check excessive label memorization |

A computer-assisted comparison of all 80 stems identified **Q17/Q18** as strongly lexically similar because of parallel phrasing, but they test **different material properties (bulk versus shear)**. They are **not** classified as science duplicates solely because the stems resemble each other. This is why a keyword/similarity score alone is never an editorial deletion rule.

## Priority 3 — correctness, wording and distractor improvements

The four previous amendment-only reports already give the **25 compulsory scope/clarity decisions and 8 optional clarifications**. Some of the 25 can be resolved by *scope classification* with no wording changes. No originally selected correct option requires a change based on first-pass science checks.

Additional cross-bank attention, without prematurely rewriting:

- **Q15:** a constant stress/strain modulus is guaranteed in the **proportional/linear elastic regime**, not the entire nonlinear yet recoverable elastic range (A–B). Compulsory scientific precision in any independent scored candidate.
- **Q19 and Q56:** NBF shear notation uses **Y for height/separation**, while elsewhere Y means Young's modulus. Prefer `h` for height in standalone explanations and define the variables.
- **Q38:** loaded-shelf content is a **text sidebar example**, not the illustrated drawing that the original stem implies.
- **Q39:** steel/aluminium comparison alternatives need more parallel, material-specific wording.
- **Q31/Q40/Q68:** examine distractor plausibility and relative option lengths. The original choices are all distinct, but some alternatives are much less physically credible or differently structured. This is a **quality refinement**, not a demonstrated wrong key.
- **Q57:** besides missing data, its MCQ precision is slightly more detailed than the NBF printed Example 7.2's one-significant-figure final answer. This was an optional V166 rounding note and remains separate from the **compulsory missing-context fix**.

### Original Word document heading

The source Topic 7.2 study-bank header cites **NBF printed pp.116–122**, although printed p.122 begins Topic **7.3**. In a separately approved *private corrected working edition*, revise the study-bank heading to **pp.116–121**. Keep the original source unchanged for provenance.

## Teacher decision gates and next academic steps

1. **Preserve original source archive.** Do not overwrite the original Word/answer files or copy keyed content into the public GitHub repo. Any revised item should be a **separate candidate** tied to the exact original canonical row SHA and a new candidate SHA, not a silent amendment.
2. **Resolve high-priority standalone blockers**: Q57 and the remaining figure/table/context-dependent items, with appropriate stimuli or self-contained stems and independently verified correct options.
3. **Review near-duplicates and conservative supplementary scope**, explicitly recording whether the original is retained supplementary, a teacher-revised candidate is approved for direct summative use, or the item is excluded from scored rotation. Do not delete originals.
4. **Audit cognitive demand and difficulty** with the actual final version, including strong distractors, scenario quality, official SLO, mathematical steps, unit conversions, accessible vector/math display, and correct source/learner boundaries.
5. Only a separate **authenticated, auditable teacher science and cognitive signoff** could later approve a private keyed scored edition. **Today: 0 Unit7 approved for scored Test Builder**, and no such live teacher backend has been deployed.

**Next V169:** while these Topic7.2 teacher/editorial decisions remain queued, move to the **already uploaded original Topic7.3 80-MCQ solved bank, starting Q1–20**. This advances completion of the chapter without incorrectly marking Topic7.2 as published or waiting for a production teacher console.

## Exactly four V168 files and machine-verifiable limits

1. `quality/unit07/topic72-v168-all80-consolidated-academic-qc-no-keys.json`: 80 canonical source-row hashes and **only original number/SLO/item-demand/scope/flag status**, plus the cross-bank stimulus/overlap/distractor and academic-hold register.
2. `quality/grade11-v168-topic72-all80-consolidated-academic-qc.md`: this owner-readable comprehensive scientific/format/blueprint audit, with compulsory vs optional distinctions.
3. `scripts/audit_grade11_unit7_topic72_bank_v168.cjs`: fail-closed, offline verification against the original four keyless ledgers, canonical V165 source-row fingerprint recipe, 80 unique row/answer-bound hashes, issue counts, official SLO cross-tabs, 13 presentation blockers, and all existing score-release guards.
4. `.github/workflows/validate-grade11-v168-topic72-full-bank-qc.yml`: executes the V168 and earlier V164–V167 audits, V154 Unit7.1 hold, original Grade XI 2,250 identities, Unit6 560 pending, App Check launch lock and teacher backend deployment NO-GO. **No private Word content or Firebase credentials enter GitHub CI**.

**CI evidence boundary:** The original owner DOCX was inspected outside GitHub. A green V168 structural audit confirms consistent fingerprints, labels and **HOLD** markers; **it does not independently read the private Word or certify academic science**. No bank publication, scored-question import, shared Firebase rule change, billing upgrade, teacher account creation, student attempt change or public portal page change is introduced.

**Owner merge steps:** On the latest PR head, verify all GitHub checks green, inspect the four new non-deploy files, then **Ready for review → Merge pull request → Confirm merge**. No additional textbook upload is needed.
