# V147 — Grade XI Unit 7 Topic 7.1: exact 80-question candidate, with two transparent edits (NOT STUDENT RELEASED)

## Starting point

PR **#246/V146** merged on 25 November 2026 with **2/2 latest-head checks successful**. The owner’s source-based review identified **80 complete boxed MCQs**, four distinct options each, a separate 80-row answer/explanation table, and two narrowly scoped text issues at **Q15 and Q62**. However, **all 80 individual scientific teacher approvals remain pending**. V146 deliberately kept no source questions or answer keys in the public repository.

For V147, the goal is to stop treating a fingerprint register as a substitute for real learning content while **not** presenting unapproved answers as graded results. This PR prepares the actual **source-derived questions and choices only**, as a non-student staging asset. It does **not** modify the student Test Builder, course-release catalog, question-bank manifest, grades, saved attempts or Firebase.

## Exact original source, derivation and reproducibility

The original user-authored document reopened for this change is:

- `Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.docx`; confirmed SHA-256 `930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58`.
- Matching PDF SHA-256 `1b440b31bf2127fc4d62edbc223e3a23cf556d56aa5e8a5a46a4a9212960f5b5`.
- Original NBF Physics Grade XI printed pages **113–116** have already been visually inspected. Primary source topic is **7.1 Classification of Solids**, candidate FBISE theory SLO **P-11-B-22**.

The Word document’s first table contains exactly 80 stems and A/B/C/D option sets, with the answer-key/explanation table entirely separate. We used the **first table only**, taking each row in original order; data is UTF-8 `stem<TAB>A<TAB>B<TAB>C<TAB>D<LF>`, with **no keyed answer letter, explanation or teacher marks**.

- Exact **source-unmodified** 80-row question-and-option stream fingerprint: `47e7b2e2c4fd3885ac40ad4492fe5b0c19e5703cece6afac8cd9f1913ffe8ddb`.
- Staged **candidate** after exactly the two proposed Q15/Q62 stem changes: `03659cb562a666477882c830d3c7c407bc9e90f41db5077ac75435cf14a80f2a`.
- The frozen V146 ledger supplies stable IDs `XI-U07-T071-Q001` through `...Q080` and the full original source row fingerprints; its contents remain untouched. It is the handoff key for later import and answer-key matching.

**78 stems are source-exact; four choices per item are 80/80 source-exact.** The remaining two stem differences are explicitly marked below as proposals, and their four original option strings are unchanged. The source Word/PDF and answer table do not appear in this GitHub PR.

### Targeted teacher review: exactly two proposed text changes

| Item | Action | Required? | Source transparency | Keep/add recommendation |
|---|---|---|---|---|
| **Q15** | Change from *“Which example in the chapter is a molecular crystalline solid?”* to *“Which of the following nonmetal crystalline materials is listed in the NBF textbook?”* | **Compulsory** if bank is strictly limited to explicit original NBF material; optional to keep original only in a labelled supplementary chemistry extension | Original NBF p. 113 lists sulphur among crystalline nonmetal examples but does not explicitly state a molecular-crystal classification for sulphur there | Use the revised core question; optionally keep source original as an **additional, separately labelled extension**, not two near-identical core MCQs |
| **Q62** | Change from *“A glass pane has a random long-range arrangement ...”* to *“A glass pane has no regular long-range repeating arrangement of constituent particles. The best description is:”* | **Compulsory** scientific-precision edit | Amorphous glass lacks long-range periodic crystal order; the original phrase risks suggesting a specific long-range pattern | Replace original wording **in place**, do not keep the misleading version as a second question |

This file is **not an academic correction of the owner’s original DOCX**. It is a separate proposed candidate, and no answer choices were reordered. Original source answer letters and explanations stay in the owner’s Library pending detailed teacher review and reconciliation.

### Candidate structure and teaching implications

- **80** numerically ordered MCQs, each with **four** independently selectable, nonblank, distinct options.
- Source sections **Q1–60** conceptual/direct and **Q61–80** standalone context/situation. They are **not** six verified shared-stimulus groups; using these 20 as grouped questions would falsely claim official FBISE scenario-paper compliance.
- Topic B-22 is the original teacher source label. The full official FBISE paper pattern, actual summative/formative scope and per-item cognitive levels need final mapping before graded assessment claims.
- In the draft audit, correct answers are deliberately **absent**. Passing a mechanical choice-format check must not be mistaken for an independently checked Physics answer.
- Approved item import must preserve stable source IDs and prevent frequent near-identical SC/BCC/FCC items in the same short randomized quiz.

## Current safeguards

The new file `quality/unit07/topic71-v147-80-question-only-candidate.tsv` sits **outside** `question-bank/` and has **no reference** in the learner portal, Build My Test page, question-bank manifest or course navigation. Note: a public GitHub repository can make committed candidate questions publicly visible to anyone who finds this file; **“not student-released” means not integrated into the portal’s question/answer/scoring workflow, not access-controlled GitHub content**.

The V147 audit validates the exact 80-row source-derived candidate fingerprint, all complete A/B/C/D choices, stable V146 IDs and PENDING statuses, and confirms the Unit 7 public course stays `planned` with **zero** live scored MCQs. All **2,250** existing Grade XI provisional question identities and the **560 pending Unit 6 academic approvals** remain untouched. No student answers, accounts, teacher/class records or Firebase credentials are used.

## Next stage before student-facing scored practice

1. **Scientific-answer check**: reopen the original teacher Word answer table and NBF printed pages; individually audit all 80 correct options and their explanations and identify any additional mandatory corrections. Explicitly approve the two Q15/Q62 proposals or record the teacher’s alternate decision.
2. **Cognitive/SLO mapping**: confirm the official current FBISE framework’s exact P-11-B-22 classification and map individual questions, including limitations of standalone scenario questions.
3. **Production-ready import**: create the Grade XI Unit 7 provisional *public self-practice* source with keys only after documented academic review; test exact grading, all four choices, mixed-unit selection, 1280/390/320px rendering and PDF/watermark behavior. **Never use the public self-practice answer source as a secured high-stakes school examination bank.**
4. **Speed priority**: continue Topic 7.2 (80 prepared MCQs), complete Topic 7.3 and end-of-unit exercises, then Units 8–10. We can parallelize source inventories but should not falsely approve academic answers.

## Review, CI and PR

**Four scoped files:** (1) the 80-row question-only TSV; (2) `scripts/audit_grade11_unit7_topic71_candidate_v147.cjs`; (3) this decision note; (4) `.github/workflows/validate-grade11-v147-unit7-candidate.yml`.

Keep **PR #247/V147 Draft** until every latest-head check passes. Review all four files and especially proposed Q15/Q62 wording. On green: **Ready for review → Merge pull request → Confirm merge**. A merge stages a non-scored draft; it **does not publish 80 Unit 7 scored questions**. No Firebase Console changes.
