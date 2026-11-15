# V49 — Grade XI NBF Unit 5 Official FBISE Theory SLO Verification

**Physics with Sir Najam · Unit 5 Work and Energy · PR #39 · Verified source classification, NOT an exam-bank release**

## Why this release matters

PR #38/V48 published the first Unit 5 source-based teaching materials and labelled the candidate summative SLO mapping **provisional**, because the original official federal-board assessment table had not been independently located and read.

That source **was recovered and inspected** from the user's file library during V49:

- **Official supplied PDF:** `11_Physics_HSSC_I_model_paper_50_percent(9).pdf`
- Title: *FBISE Assessment Framework and Model Question Paper, Physics Grade XI, National Curriculum 2022–23, Inclusive Scheme of Studies 2024*
- **PDF page 11**, framework printed **p.5 of 21**: table explicitly lists the four Unit 5 outcomes and their status/cognitive levels.
- **PDF page 4:** distinguishes formative from summative and practical/PBA theory coverage.
- **PDF page 27:** states that summative PBA practical SLOs were **not identified** in this framework and that a separate practical list would be shared.
- **PDF page 28:** states the 80-mark whole-grade paper structure.
- **PDF page 30:** reproduces the official four-column boxed A/B/C/D MCQ and separate bubbles format.
- **PDF pages 42–43:** alignment table includes sample item references B-31 (A13), B-32 (A14), and B-30 (A17).
- **NBF primary:** `11 Physics Book(7).pdf`, original printed Unit 5 Work and Energy **pp.77–87**, *all eleven chapter pages visually inspected* (including pp.85–87 end exercises).
- Prior `Grade11_Physics_Unit5_Student_Notes_and_Practice.pdf` remains a supplementary teaching cross-reference, **not** the authority for official assessment classification.

**Important nuance:** The model's item-level cognitive classification for some example questions may differ from the parent SLO's framework-wide cognitive level. For SLO mapping, retain the framework classifications in the primary SLO table, rather than silently replacing them with individual sample-question cognitive tags.

## Official Unit 5 outcome verification

| Code | Summative status | Official cognitive level | Source text / work focus | NBF pp. |
| --- | --- | --- | --- | --- |
| P-11-B-29 | Summative theory | Application | Derive kinetic energy formula from motion equations | 81–82 |
| P-11-B-30 | Summative theory | Application | Deduce work done from force–displacement graph | 79–80 |
| P-11-B-31 | Summative theory | Understanding | Differentiate conservative/non-conservative forces | 81 |
| P-11-B-32 | Summative theory | Application | Use the work–energy theorem in a resistive medium | 82–83 |

All four are explicitly marked **Summative** and **question(s) will be asked in final examination** in the provided framework. No separate formative theory SLO is identified for this chapter among B-29–B-32. Do **not** conflate adjacent B-28 (elastic potential energy from elasticity) or B-33 (Archimedes, Unit 6) with Unit 5.

**PBA warning:** The framework expressly defers summative PBA practical listing. This does **not** imply there are no PBA practical requirements for Unit 5. Retrieve/check the separate PBA list before claiming practical assessment coverage.

**Latest revision warning:** The classification is verified **against the supplied official 2024-scheme file**. This workflow did not verify that no newer online FBISE framework was published after it.

## Global board-paper pattern (NOT a Unit 5 quota)

Full HSSC-I theory paper in supplied framework PDF p.28:

- **Section A: 80 MCQs × 0.5 = 40 marks** (56 independent plus 24 in six stimulus-based scenario groups).
- **Section B: 7 short-response questions × 4 = 28 marks**, with internal OR.
- **Section C: 2 extended-response questions × 6 = 12 marks**, with internal OR.
- **Total 80 marks (40 objective + 40 descriptive).**

These numbers describe the **whole-grade, multi-unit theory paper**, not a minimum target for a single Unit 5 practice exercise. Official boxed MCQ layout with A/B/C/D circles is required for future printed practice familiarity.

## Changes in V49

- `portal/unit-05-slo-audit.json` now records the official source file/page and edition, confirmed classifications A/A/U/A, supporting NBF page map, scope boundaries, PBA caution, and future-item review gates.
- `portal/unit-05-fbise-audit.html` publishes an accessible, mobile/print-friendly source map and official format explanation with clear not-yet-published assessment status.
- Unit 5 Learning Desk and work-energy study/interactive pages now link to the source audit and no longer mistakenly claim the theory SLO mapping itself awaits verification.
- `portal/learning-catalog.json` adds a **fourth Unit 5 public resource**: official-framework theory audit. Unit 5 question bank count **0**, assessment status **not-published**, and existing Unit 4 18 resources plus original 80 MCQs remain unchanged.
- `scripts/test_unit05_fbise_audit_v49.cjs` and Chromium CI enforce the recorded source/official mapping, whole-grade paper blueprint, explicit PBA limitation, zero question bank, 4 public links, real rendered SLO rows, 390px page layout and no account/grade writes.
- V48 numerical physics explorer regression remains active (signed work, KE, force-field path, stopping guard); older Unit 4 source and academic tests rerun.

## Teacher review / acceptance checklist

- [ ] Open official supplied PDF **p.11** and compare each four SLO rows; check exactly the A/A/U/A cognitive levels.
- [ ] Read the actual supplied model paper PDF **pp.27–30** and the official **boxed MCQ** appearance. Confirm the global 80-mark structure is not being imposed on a single unit.
- [ ] Check the **separate PBA source** if practical assessment is planned; this PDF does not itself certify practical coverage.
- [ ] Open portal Unit 5 → **Verified FBISE Theory SLO & Assessment Audit**, and inspect on phone, projector and Chrome/Google Sites.
- [ ] Recheck source NBF printed **pp.77–87** for each proposed question against the original text and correct answers, not merely earlier third-party answers.
- [ ] Before releasing a practice bank, independently solve each candidate MCQ, verify distractors, avoid repeated predictable correct-option positions, and verify numerical assumptions/rounding.
- [ ] Preserve **student-only** MCQ questions and **teacher** key/marking scheme separately. Do not connect the public audit to student account results.
- [ ] Keep official exam-release claims **off** until teacher academic approval.

## CI limits

**A green CI run tests code consistency, correctness of the recorded four-SLO mapping against the manually inspected official source, and browser rendering.** The original official PDF is in the user's file library, *not checked into the GitHub repo*, so CI does not programmatically re-extract and verify its bytes. The source PDF and original NBF pages were read separately before the verified metadata was authored. Nor does green CI certify future exam questions or a newer online revision.

**Next milestone recommendation:** author the first **small, source-referenced Unit 5 summative theory practice set** (B-29–B-32), with independently checked solutions and boxed MCQ formatting; keep it provisional until teacher review, rather than prematurely claiming a complete official 80-MCQ single-unit paper.
