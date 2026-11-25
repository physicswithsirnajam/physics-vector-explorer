# V146 — Grade XI Unit 7, Topic 7.1: 80-MCQ source-fingerprint audit and teacher decision register

**Academic status:** STRUCTURAL CHECK COMPLETE • TWO TARGETED TEXT/SOURCE ITEMS FLAGGED • **ALL 80 TEACHER SCIENTIFIC SIGNOFFS PENDING** • **DO NOT RELEASE A UNIT 7 SCORED BANK YET**.

## Why this review follows V145

PR **#245/V145** was merged on 25 November 2026 with **71/71 latest-head checks green**. It introduced a public, textbook-based Unit 7 Topic 7.1 introduction while truthfully keeping the complete Unit 7 course **planned**, with `questionBankCount=0`. That is preserved here. The owner wants to progress quickly through Units 7–10 before the 7 December exams without compromising the original NBF textbook, official FBISE theory SLO classifications or answer quality.

### Original user-owned sources actually reopened

I re-opened the **previously prepared teacher-authored Word study edition** `Grade11_Unit7_Topic7.1_FBISE_Boxed_Study_With_Answers.docx`, its **corresponding 14-page PDF**, and the **actual NBF Physics Grade XI scanned printed pages 113–116** (including all diagrams of crystalline, polycrystalline, amorphous arrangements, polymers, X-ray diffraction, SC/BCC/FCC and seven crystal systems). The original NBF pages are visual scans; their machine-extracted PDF text is garbled and **was not** used as authority in place of the images.

Original study-edition byte-level file hashes:

- DOCX SHA-256: `930f6f18bed3f61ad4fb6b7c4da294d9880b0ca1723aef092c1979390cbe1d58`
- PDF SHA-256: `1b440b31bf2127fc4d62edbc223e3a23cf556d56aa5e8a5a46a4a9212960f5b5`

The original Word document consists of **81×10 MCQ table** (one heading row and 80 MCQs) and a separate **81×4 answer/explanation/SLO table**. The source Word and PDF are **not** copied into the public repository by this PR. `quality/unit07/topic71-v146-teacher-80-item-source-fingerprint-ledger.json` records **only** 80 safe source-identity fingerprints, topic mapping and review states—**never** stems, A/B/C/D options, individual answer letters or explanations. Each row fingerprint is SHA-256 over the Python JSON canonical object `{n,stem,options,key,explanation,slo}` with UTF-8 Unicode, `sort_keys=True, ensure_ascii=False, separators=(',',':')`. Later imports must re-read the owner's authoritative Word source and reconcile hashes; CI **cannot certify unseen source correctness merely by checking recorded hashes**.

## Full 80-row structural inspection result

| Check | Finding |
|---|---|
| Numbering | Original MCQ entries exactly **1–80**; answer-key rows exactly **1–80**; ordered and aligned |
| Four-option completeness | **80/80** questions have four nonblank and text-distinct options |
| Original answer/one-line explanation | **80/80** key rows have a valid A/B/C/D letter, explanation and original `B-22` tag |
| Distribution of original correct letter (aggregate only) | A: **20**, B: **20**, C: **20**, D: **20**; balanced distribution is **not proof** the keys are scientifically correct |
| Exact duplicate question statements | **0**, based on original Word table stem text |
| Source SLO label | **80/80** tagged `B-22` in teacher Word; treated as candidate `P-11-B-22` (summative) |
| Question style | **1–60** are direct/conceptual, **61–80** stand-alone contextual/situational questions |
| Word-to-PDF visual spot check | PDF page **1** original boxed question layout and page **14** keyed-table layout visually inspected; no visible clipping on those two inspected pages; **not** a 14-page, every-cell proof |
| Individual scientific approval | **0/80 formally approved**; initial scan identifies two targeted amendments, but this audit does **not** warrant zero defects across the other 78 |
| Formal release | **HOLD**; no MCQs added to the central Test Builder and no marks/grade decisions opened |

### Original source-scope content coverage

The 80 source rows were individually categorized by their presented primary concept, not automatically inferred from a keyword scan. This is a review map, not a prescribed FBISE weighting.

| Topic cluster | MCQs | Share |
|---|---:|---:|
| Crystal / polycrystal / amorphous classification and examples | 28 | 35.0% |
| Polymers, monomers, natural vs synthetic materials | 10 | 12.5% |
| Crystal lattice and unit cell | 7 | 8.75% |
| Anisotropy / isotropy | 6 | 7.5% |
| X-ray diffraction | 3 | 3.75% |
| SC/BCC/FCC cubic cells and associated geometry | 20 | 25.0% |
| Crystal systems | 4 | 5.0% |
| Materials-engineering uses | 2 | 2.5% |
| **TOTAL** | **80** | **100%** |

Those concepts are substantively present on the NBF printed pp. **113–116**. This check does not mean every source answer/explanation has yet been independently recalculated or accepted for grading. Source wording and epistemic scope still matter.

## Targeted question amendments — ONLY ITEMS NEEDING CONSIDERATION

The owner prefers a short, surgical amendment list: change the smallest set needed, classify **Compulsory/Optional**, explain the reason and whether to **retain the original and ADD a new item**. The original questions and keys are left untouched in this PR.

### Q15 — classification wording exceeds what the NBF source explicitly states

**Original source prompt:** “Which example in the chapter is a molecular crystalline solid?” The source's intended response is **sulphur**.

- **Finding:** On original NBF p. 113, sulphur is explicitly listed among **nonmetal crystalline materials**. The original page does **not** expressly classify this example as a *molecular crystal*. Ordinary external chemistry supports molecular crystalline sulphur (commonly S₈); that added classification is reasonable but should **not** be represented as a direct NBF statement when the student's source is strictly textbook-only.
- **Required vs optional:** **Compulsory** to revise the source attribution if all bank prompts must be provable strictly from the textbook. **Optional** to leave the advanced scientific version only if it is *clearly labelled supplementary* and separately approved.
- **Minimal source-faithful replacement:** “Which of the following nonmetal crystalline materials is listed in the NBF textbook?” Preserve the original intended answer and the four offered materials if a later item check confirms the options remain unambiguous. Explanation should describe sulphur as the textbook-listed crystalline nonmetal; discussion of sulphur's molecular structure belongs in a labelled supplement.
- **Keep original and add an extra?** **Yes, conditionally:** retain the present question in a *separate supplementary chemistry extension bank*, and create the textbook-faithful version for the NBF-only bank. **Do not publish both as two indistinguishable core questions.**

### Q62 — technically imprecise phrase “random long-range arrangement”

**Original source prompt fragment:** “A glass pane has a random long-range arrangement of constituent particles.”

- **Finding:** The introductory chapter classifies amorphous glass by the **absence of long-range regular/periodic structure**. A “random long-range arrangement” risks implying that there *is* a distinct long-range structure of some kind. The original intended class is **amorphous**, and the answer is directionally correct, but the scenario's scientific wording should be precise.
- **Required vs optional:** **Compulsory** before student-facing import if we are maintaining clear scientific definitions.
- **Minimal source-faithful replacement:** “A glass pane has no regular long-range repeating arrangement of its constituent particles. The best description is: …” Existing four choices and intended keyed option can be retained after verification.
- **Keep original and add an extra?** **No**, because it would preserve misleading language. Revise Q62 *in place* and record the approved amended text in a future, separate import/QC change.

### Additional improvements, not compulsory amendments to specific questions

- **Exam stimulus pattern — optional for ungraded SLO practice; compulsory for a claimed exact FBISE model paper.** The original 80-item topic bank has 20 independent contextual items numbered 61–80, **not** six shared passages/figures with four linked questions each. Do not label these as the official complete-paper `56 straight + 24 grouped situation/stimulus` composition. For future 80-mark formal board-style unit assessments, build genuine shared-stimulus sets and balance all relevant summative SLOs, not only B-22.
- **Topic repetition — optional.** Some unit-cell concepts recur multiple times in different surface forms (e.g. SC/BCC/FCC), which is useful during spaced practice but may overweight a single concept within a fixed short quiz. For Test Builder random selection, later implement concept-group diversity and avoid back-to-back near-identical prompts.
- **Individual cognitive and answer certification — required before calling the bank fully teacher approved.** The teacher source tags every item `B-22`, but does not supply independently certified **Knowledge/Understanding/Application** mapping for each item or a documented per-item textbook-and-answer academic signoff. The relevant current official framework should be reopened in the final import step. Importing provisional self-practice (when all flagged content resolved) is distinct from authorizing a secure graded assessment.

## Exact material untouched in this PR

No original questions/options/answer letters, per-item explanations, source DOCX/PDF, `question-bank/grade-11` file, public `question-bank/manifest.json`, `portal/learning-catalog.json`, V145 introductory page, Firebase Rules/Auth, student/class history or saved tests are modified. Student-facing Unit 7 remains **planned**, `questionBankCount=0`, graded assessment **not-published**. Existing Grade XI six-unit provisional bank count **2,250** and Unit6's **560 pending individual teacher signoffs** remain unchanged.

## Next meaningful small PR

**V147:** produce a source-faithful, reviewed **80-question Topic7.1 import candidate** from the owner's exact Word file. Resolve Q15/Q62 explicitly and verify all stems, options, explanations, SLO and scientific answers against original textbook images; map the per-item cognitive requirement. Then expose only the intended **provisional public self-practice** through a separate PR with real Chromium practice/answer/print checks, explicitly leaving any formal graded release disabled. Avoid copying third-party/private textbook scans into a public repo. Continue Topic7.2 and 7.3 in parallel with the Units 8–10 exam target.

**Owner review and PR handling:** Review the metadata-only 80-item ledger and this two-item amendment register. PR **#246/V146** stays **Draft until all latest-head checks GREEN**. On red, do **not** merge; fix on the same branch. When green: **Ready for review → Merge pull request → Confirm merge**. There is **no** Firebase Console change and **no** actual Unit 7 quiz released in this milestone.
