# V148 — Unit 7 Topic 7.1 original NBF/Word answer review: teacher HOLD
## What this PR accomplishes
Read the owner's 80 original keyed Word questions and the original NBF Grade XI **printed pages 113–116** (not just a previously generated answer list). Checked question/answer row alignment, all four answer choices, and each teacher-authored answer explanation in a provisional academic first pass. **No teacher signs off by merging this PR.** The owner still must approve each item and the official FBISE theory SLO/cognitive tagging must be rechecked.

This PR adds a **keyless, explanation-free**, 80-item source/page issue register and a regression audit. Source answers and explanations remain in the owner's original Word document, **not** in this public GitHub repository. This is a review artifact, **not a provisional scored Test Builder release**.

## First-pass outcomes
- 80/80 original question rows align with 80/80 separate answer/explanation rows; each answer letter identifies one nonempty listed option and every original question has four distinct nonempty options. Original teacher source happens to have 20 each of A/B/C/D; this is a description of the source, **not** evidence of independent correctness.
- **79/80** have a source-consistent intended correct choice at first pass, subject to teacher re-verification, including provisional Q15 and Q62 candidate stems; **Q76 is BLOCKED** because the intended option claims something specifically listed in this textbook that these pages do not list.
- 0/80 individual **teacher** academic signatures; 0 live scored Unit 7 questions. This first pass does not confer summative/formative approval, regulatory approval, formal assessment suitability or test security.
- 60 straightforward/direct and 20 **standalone situational** source questions; no invented shared-stimulus scenario grouping.
- Source textbook's special vocabulary, claims, figures, unit cell diagrams and polymer examples are verified against the visible printed pages. Its historical wording is cited as source, not generalized as modern scientific fact.

## Compulsory before a textbook-only scored release (amend original candidate only after teacher decision)
| Q | Finding | Teacher decision recommended | Source |
|---|---|---|---|
| **10** | Correct identified material is natural rubber, but the authored explanation inaccurately says **nylon is listed** among the synthetic polymer examples. It is not named on printed p.114. Nylon is also a distractor sourced outside this four-page passage. | Rewrite explanation using the actual printed list **polythene, polystyrene and PVC**; for strict-only questions swap distractor "Nylon" for "Polythene" without reordering options. Intended answer unchanged. | 114 |
| **15** | Original asks for sulphur as a "molecular crystalline" material even though printed p.113 lists sulphur as **crystalline nonmetal** without asserting that subcategory. | Explicitly accept V147's narrower "nonmetal crystalline material listed in NBF" stem; do not silently edit the owner Word original. Intended answer unchanged. | 113 |
| **62** | Original glass stem says "random long-range arrangement" and can imply a long-range pattern; amorphous material instead lacks **regular long-range periodic order**. | Explicitly accept V147's revised no-regular-long-range-repeating-arrangement stem; retain four options and intended answer. | 114 |
| **76** | **BLOCKER:** The authored intended choice says **"Nylon is listed as a synthetic polymer"**. Printed p.114 does not list nylon; although nylon really is synthetic, the *textbook citation claim* is false. Under this textbook-only wording, intended choice is not defensibly correct. | Replace the scenario's nylon with **polythene** and revise related choices, especially the originally intended choice to **"Polythene is listed as a synthetic polymer."** This changes source words and requires an explicit teacher decision and new per-row source-revision trace. Keep the item out of scoring until accepted. | 114 |

## Optional precision / textbook-scope decisions
| Q | Finding | Recommendation | Source |
|---|---|---|---|
| **8** | "Monomer" is standard scientific vocabulary and its intended answer is defensible, but the printed textbook passage says **small molecules** and does not explicitly name the term *monomer*. | Either retain and label as supplementary terminology or rewrite the core MCQ in the textbook's "repeated small molecular units" wording. | 114 |
| **9** | Explanation uses "monomers," a correct term not introduced explicitly in this passage. | Optionally align explanation to the printed source's wording; intended answer remains polymerization. | 114 |
| **31** | Explanation also uses "monomer units" though p.114 describes repeated small molecules. | Optionally use NBF language; no answer-choice change needed. | 114 |

These are the **only issue-specific corrections found in this first pass**; this is not a guarantee that a further independent subject review or the official FBISE framework mapping will find no additional issues. Keep original items unchanged unless teacher explicitly authorizes the scoped revision. Preserve Q15/Q62 source-change history and create a fresh audit fingerprint for any later accepted Q10/Q76 revisions.

## What is strictly unchanged
No changes to student-facing questions or keys, `quality/unit07/topic71-v147-80-question-only-candidate.tsv`, `question-bank/manifest.json`, `portal/learning-catalog.json`, Grade XI existing 2,250 provisional MCQs, Unit6 560 pending signoffs, Firebase, teacher accounts, student enrollment, Test Builder, saved practice attempts, scoring, PDF watermark or live course routes. Public repository review register contains **no answer letters, correct option text or one-line explanations**.

## Next controlled stage
First obtain an explicit owner decision on the four compulsory and three optional item notes. Then apply approved text changes in a new version with full row-fingerprint provenance; cross-check the official Grade XI theory assessment framework; and only then import a provisional **student self-practice** bank with end-to-end choice rendering, scoring, printable watermarks and real-user testing. Never treat this public student practice bank as a secure high-stakes exam source.

**PR operating rule:** Draft until all latest-head checks green; if any red, repair this same PR. On two green checks, owner reviews this note/register and then **Ready for review → Merge pull request → Confirm merge**. No Firebase Console action.
