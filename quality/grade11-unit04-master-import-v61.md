# V61 — Grade XI Unit 4: Corrected Student Source, Topics 4.1 and 4.2

## Source provenance and academic limits
- Source: user-owned **Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx**, corrected October 8 2026. SHA256: 925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777.
- This corrected version supersedes the earlier October 5 Gold Standard master for this source extraction.
- Source comprises seven 80-MCQ topic banks (4.1–4.7), 560 total questions: for each topic, 56 straight and 24 scenario MCQs in six complete 4-question scenarios, with topic-specific source answers and one-line explanations.
- This staged release imports **only Topics 4.1 and 4.2**, 80 questions each (160 new: 112 independent and 48 in 12 intact scenarios).
- **The original V39 80 MCQs, original 6 scenario groups, original classroom/projector/OMR and descriptive paper sources are unchanged.** The central Test Builder gains supplementary MCQs without modifying or renumbering the separate 80-item classroom paper.
- New Unit 4 central Test Builder totals: **240 provisional MCQs** and **18 complete four-question scenario sets** (original6 + 12 newly added).
- Across Units 1–5: **1290 provisional MCQs** = 275 + 206 + 220 + 240 + 349.
- The remaining corrected source Topics 4.3–4.7 contain another 400 questions and remain held for later release. Topic 4.3 Q38 explicitly relies on Figure 4.13: do NOT release it without providing its source figure and correct in-question rendering. Other source items must be checked for diagram dependencies.
- New Topic 4.1 SLO mappings are **topic-level provisional** B-07/B-08/B-09; Topic4.2 topic-level mapping B-10/B-14/B-15/B-21. Do not present every listed SLO as individually confirmed for each question. Cognitive and difficulty metadata remain **Unspecified**. Items have teacher-review-pending status, boardEligible=false, summative-theory as provisional source classification.
- The bank is **public ungraded self-practice**. No independent scientific or full item-by-item FBISE assessment signoff has occurred. It does not constitute official FBISE keys, protected school exams, or verified student grades.

## Verified transfer
- Three compressed source text assets in question-bank/grade-11/ named unit04-v61-part1.b64 (6000 chars), unit04-v61-part2.b64 (6000 chars), unit04-v61-part3.b64 (1600 chars). Concatenated length: 13600. FNV32 transfer checksum: 20d5cb2e.
- A source-aware shared read-only adapter enforces source identity, expected topic counts and original question answer letters, full scenario text, 240 total item IDs, original school paper preservation and no identical normalized stem/options overlaps with existing Unit4 source.
- Browser capability DecompressionStream is used as it already is for Unit3 source supplements. Missing assets or mismatched sources fail closed.
- No account, Firestore permissions, original questions, student-grade history, external access, or logo changes in this PR.

## Test and release signoff
- scripts/test_unit04_master_v61.cjs: source rows and keys for 2 × 80 items, A/B/C/D correct answer distribution (20 each letter per topic), 12 new 4-question scenarios, original 80 unchanged, 240 validated adapter records, 1290 total bank and answer-source consistency.
- Chromium: actual Unit4 60 MCQ quiz, scope formative unavailable/summative 240, 40-question scenario-only, mixed Unit 2+4 = 446 eligible, per-unit reports with no private cloud saving, 1290 dynamic Student Guide total and 390px responsiveness.
- Existing V55/V56/V57, V59 and V60 source+browser suites remain required green. Run Unit4 V39 original paper/browser tests to catch unintended changes. Human physics review and real print inspection still required.
- Before merging, verify all CI checks for the **latest PR SHA**, open the central Test Builder Unit4 count 240, then test Unit4 40 scenario-only and mixed Units2/4; review that original 80-item classroom paper still contains only the original 80.

## Subsequent imports
1. Continue source-corrected Unit4 Topics4.3–4.7 after independent item/figure QC. Only 399 out of the remaining 400 are candidates before restoring missing Figure4.13 for Topic4.3 Q38.
2. Reconcile held Unit3 Topics3.1/3.2 against the corrected 130-page student edition and later key, rather than assuming option letters from an older 115-page version.
3. Review additional Unit5 exercises/assessment papers and Units1/2 full master-bank completeness; deduplicate before any new online publication.
4. Separately plan student cloud-saving / secure school tests only after Firestore rules, account roles and historical schema review.
