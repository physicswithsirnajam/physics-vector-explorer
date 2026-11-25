# V164 — Unit 7.2 original 80-MCQ bank: private-source-bound first 20 scientific/answer/SLO QC

**Disposition: TEACHER REVIEW PENDING — no student scored release.** This PR checks original questions **Q1–Q20** from the user's already-authored *Grade11_Unit7_Topic7.2_PartA_80MCQs_Study_With_Answers.docx*, without publishing the privately keyed source, answer letters, answer explanations, question texts or their suggested revised versions. Follow the user's original **identify-needed-changes-first** editorial workflow. A private source row's SHA-256 fingerprint is a provenance reference, **not** publication authorization.

## Original-source evidence actually checked

- Owner private DOCX: SHA-256 `a721a7bbe5eecadcee17cb36e256a842795e586b74087fb6ced94c2b07683ada`. It contains **80 source question rows** and **80 separate answer/explanation/SLO/cognition rows**, in official FBISE-style boxed MCQ tables. The first 20 were extracted by `python-docx` and reviewed in the private working environment; no source payload is committed.
- All **20/20** original answer letters lead to the exact correct-option text in the separate answer table. All **20/20** assigned physical answers are consistent with the **original NBF textbook printed pp.116–121**; **zero wrong keyed letters detected** in this first batch. This is a first academic review, **not final teacher certification**.
- Original NBF textbook PDF SHA-256 `00cb6a4ac522ee1819d1b6d2384a152d3bd5b1035e2eb8fe8976e7453070f1fe`; directly inspected original printed pages **116–121**, including textbook **Figure 7.8, Figure 7.11 and Figure 7.12** and definitions of stress/strain/moduli.
- Official previously uploaded FBISE **Assessment Framework Physics Grade-XI (Curriculum 2022–23, Scheme of Studies 2024)**, PDF p.10, internally **Page 4 of 21**, gives:
  - **P-11-B-23: Summative / Understanding** — one-dimensional deformation by tensile or compressive forces;
  - **P-11-B-24: Summative / Application** — define/use stress, strain and **Young's modulus**;
  - **P-11-B-26: Summative / Understanding** — elastic deformation, plastic deformation and elastic limit.
- The cognitive level `K`, `U` or `A` printed in the **owner's answer table** is an **item-demand tag**; it is **not** necessarily the official SLO's estimated cognitive level. Preserve that difference rather than changing K to A without adding application reasoning.
- The source file is **not** used by public GitHub Actions; the SHA attests what was reviewed locally. Public CI can check the audit ledger's internal invariants and release holds, **but cannot recheck the private Word answers**.

## Only the first-batch items requiring action (no mass rewriting)

| Q | Priority | What needs attention | Can the original be kept and a separate item added? |
|---:|---|---|---|
| **7** | **Compulsory scope correction before summative placement** | Shear stress is correct NBF material, but **B-23 specifically describes one-dimensional tensile/compressive deformation**. A standalone shear item is not evidence of satisfying that precise outcome. | **Yes.** Keep original as supplementary NBF study, with explicit non-core scope; add an in-scope tensile/compressive item if required. |
| **8** | **Compulsory scope correction before summative placement** | Uniform hydrostatic/volume stress is three-dimensional, outside the named one-dimensional B-23 scope. | **Yes.** Retain source-valid volume-stress item as textbook extension, not a direct B-23 summative indicator. |
| **9** | **Compulsory scope correction before summative placement** | Figure 7.8 correctly shows five loading modes, but B-23 specifically names tensile and compressive; recall of all five types is broader source content. | **Yes.** Keep the original figure-recognition item as supplementary; add a one-dimensional contextual item later. |
| **12** | **Optional scope clarification** | NBF describes shear strain, but B-24 does not separately name shear strain; it names stress, strain and Young's modulus generally. | **Yes.** Original can remain for wider textbook coverage; final teacher may treat general strain definitions as B-24 support. Avoid claiming independent Application assessment from this recall alone. |
| **13** | **Optional scope clarification** | NBF describes volume strain, but it is not individually named in the official B-24 text. | **Yes.** Keep for fuller NBF learning; distinguish supporting terms from tested application of Young's modulus. |
| **15** | **Compulsory precision clarification for scored use** | The wording refers generally to **the elastic range** for stress/strain modulus. The textbook's Fig. 7.12/pp.120–121 explicitly shows an elastic interval **A–B beyond the proportional limit**, where a constant stress/strain ratio must not be assumed. | Keep original as an archived source item, but use a **clarified linear/proportional-regime stem** in any later scored bank. Correct physical choice remains unchanged. |
| **17** | **Compulsory scope correction before summative placement** | The bulk modulus is correctly taught in the NBF textbook, but the official B-24 explicitly names **Young's modulus**, not a separate bulk-modulus outcome. | **Yes.** Keep original as supplementary textbook study; assess the named Young's-modulus construct separately for B-24. |
| **18** | **Compulsory scope correction before summative placement** | The shear modulus is source-correct but likewise not a separately named summative B-24 concept. | **Yes.** Retain as textbook support; add/reuse a genuine Young's-modulus application problem elsewhere. |
| **19** | **Compulsory wording and scope clarification for scored use** | NBF Figure 7.11 uses **Y for face separation/height**, but the same topic also uses **Y for Young's modulus**. The unillustrated MCQ can be misread as length divided by pressure. It is also shear-specific rather than an independent B-24 application. | **Yes.** Retain the original for figure-context supplementary recall, or explicitly define `Y` as face separation. Prefer `h` for the denominator in a student-facing revision. |

The other **11 questions (1–6, 10, 11, 14, 16 and 20)** need **no compulsory individual amendment** in this first pass, though all remain teacher PENDING.

### Two compulsory **batch-wide** amendments before release

**Source-page header.** The original Word study edition's instructions say **NBF printed pp.116–122** for Section 7.2. The actual Section 7.2 runs **pp.116–121**; the Young's-modulus **experiment on p.122** begins **Section 7.3** and belongs to B-25. When an owner-approved private corrected edition is prepared, fix that header to pp.116–121; this public PR does not edit or duplicate the owner's private Word original.

**Summative Application coverage.** Q1–20 contain **15 K**, **5 U** and **0 A** item-demand tags. They are an effective foundation, but **cannot by themselves satisfy P-11-B-24's summative Application demand**. The remaining source Q21–80 must be reviewed for genuine scenario/numerical application. Do not manufacture compliance by relabelling recall items. SLO/item cognitive alignment is to be signed off after the complete bank is audited.

### QC summary, with careful interpretation

| Field | First-batch observation |
|---|---|
| Source rows inspected | **20 of 80** |
| Wrong original keyed option letters | **0 detected** |
| Original answer-table text matching its selected option | **20/20** |
| Explicit individual flags | **9 of 20** |
| Compulsory before scored use (scope or precision) | **7 of 20** |
| Optional scope clarification | **2 of 20** |
| Direct topic-core framework scope | **12 of 20** |
| Broader NBF supplementary content | **8 of 20** |
| Source item-demand mix | **K 15 · U 5 · A 0** |
| Teacher science/cognitive approvals | **0** |
| Unit 7 student scored release | **0** |

The word **compulsory** here chiefly means *fix summative classification / clarity before treating it as an official scored item*, **not** that the correct physics distractor choice has changed or the original NBF-compatible question must be destroyed. Neither this report nor a CI pass signs off teacher science or answer keys.

## Files and future review sequence

New source-bound queue: `quality/unit07/topic72-v164-first20-source-bound-teacher-review-no-keys.json`, containing Q numbers, full-row **nonreversible SHA-256 identifiers**, source framework/cognition and flags—but **no stems/options/key letters/keyed explanations/student personal data**. Each item explicitly remains `TEACHER_PENDING`, `PENDING` academic signoff and `HOLD` scoring.

New script `scripts/audit_grade11_unit7_topic72_batch1_v164.cjs` checks all 20 source hashes syntactically, unique contiguous original IDs, official cognitive-level distinction, issue flags, batch totals, 80 original teacher holds, Unit7 zero scored and preserved 2,250 original Grade XI provisional items. It cannot reconstruct the source Word; CI is **structural/guardrail validation**, not independent scientific correctness proof. The new workflow also runs V154, V160, V161, legacy review/App Check and Unit6 locks.

**V165, V166, V167** should audit existing **Q21–40**, **Q41–60** and **Q61–80** in the same QC-first style, using the recovered private original DOCX and NBF pp.116–121. Then do the final bank-wide overlap/application balance audit, and continue the owner's existing Topic **7.3 80-MCQ solved study bank**. Later check textbook end-unit MCQs/short/comprehensive/numericals. Avoid automatic scored release.

## Owner instructions

Merge only after the new latest-head CI and repository-wide existing checks are green. Review four scoped non-deployment files (source queue, QC memo, audit script, workflow), then **Ready for review → Merge pull request → Confirm merge**. **No Firebase Console, teacher role, question bank, live UI or source Word changes.** The source bank and framework already exist in the private Library; **no further uploads are needed at this stage**.
