# V65 — Grade XI Unit 4 Topic 4.7 Artificial Gravity: final corrected master-source MCQ import

## Source and exact-question fidelity
- Source: user-supplied corrected `Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx` (8 October 2026), SHA256 `925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777`.
- Topic 4.7 Artificial Gravity comprises **80 exact printed MCQs**: Q1–56 are independent, and Q57–80 belong to **six complete, four-question original stimulus groups**. Scenario paragraphs precede their question tables in the corrected DOCX; the original introductions were extracted from the two preceding Word paragraphs, not guessed from questions.
- Original 4 options, source correct option letter, and original one-line explanation are taken directly from source Word tables 170–177. Printed answer distribution is A20/B20/C20/D20. The archived original-source stems/options were not rewritten or re-keyed.
- Original Word run-level math (such as `v²/R`, `ω²R`, `rad s⁻¹` and `m s⁻²`) is preserved. The six scenario contexts do not depend on an external omitted figure; all 80 can remain in six intact groups.
- Original Source classification: topic-level provisional candidate SLO **P-11-B-17** (summative theory in the supplied framework). All new questions retain `status:teacher-review-pending`, `boardEligible:false`, `cognitiveLevel:Unspecified`, `difficulty:Unspecified`. The source's answer-table agreement does **not** establish independent scientific accuracy or official FBISE certification.

## Student central Test Builder totals after V65
| Category | Pre-V65 | New | Post-V65 |
|---|---:|---:|---:|
| Grade XI Unit4 central public practice MCQs | 555 | 80 | **635** |
| Corrected source MCQs imported (all seven topics) | 475 | 80 | **555 of 560** |
| Unit4 complete 4-question scenarios | 41 | 6 | **47** |
| Unit4 scenario MCQs | 164 | 24 | **188** |
| Separate original Unit4 classroom-source 80 MCQs | 80 | 0 | **80, unchanged** |
| Grade XI Units1–5 combined central MCQs | 1,605 | 80 | **1,685** |

- Five-unit central counts: U1=275, U2=206, U3=220, U4=635, U5=349.
- Imported corrected original topic counts: 4.1=80, 4.2=80, 4.3=75, 4.4=80, 4.5=80, 4.6=80, 4.7=80.
- The remaining **five Figure4.13-dependent original Topic4.3 questions are still deliberately held:** Q38 and *the entire* scenario Q69–72. No fabricated figure, partial scenario, or claimed 560/560 import. The new source Topic4.7 is the final previously unimported full topic bank.
- Original separate 80-MCQ paper/projector/teacher discussion/OMR and descriptive assessment remain untouched. No protected exam, authenticated student grade storage, Firebase changes, account permissions, saved-results migrations or logo changes.

## Archive and fail-closed safeguards
- `question-bank/grade-11/unit04-v65-topic47.b64` stores the exact source 80 question stems, all four options, original correct answer letter, explanation, six scenario introductions, SHA256 provenance and Word formatting via gzip+base64.
- Encoded length **7,544 characters**, FNV32 **47cc9caf**. The adapter rejects wrong size, checksum, source edition, source topic, misnumbered Q1–80, missing keys/options/explanations, duplicate IDs/text, invalid answer distribution, or incomplete scenario groups.
- Final bank checks **635 unique items**, **47 original/complete scenario sets**, **188 scenario MCQs**, all 80 original V39 classroom MCQs unchanged, prior corrected 475 source questions preserved in order, and held figure questions excluded.

## Test/teacher acceptance
- `scripts/test_unit04_master_v65.cjs` validates original source archive and adapted questions plus real Chromium: Unit4 **635 eligible**, launch **40 Scenario Only**, validate four choices and displayed stimulus; Units3+4 **855 eligible** with separate results and disabled cloud-score saving; guide displays **1,685** total, Unit4 **635**, 390px mobile no horizontal overflow.
- V65 GitHub Actions also runs V64/V63/V62/V61 source and earlier original classroom V39, multi-unit V55/V56, student guide V57, Unit3 V60 and Unit5 V59 regressions; all existing CI count contracts updated to new totals.
- Before merge: verify every check is **green on final PR HEAD**. After merge: manually test central Unit4, 40 Scenario Only, mixed Unit3+Unit4, mobile Student Guide, original standalone 80-paper unchanged. Verify actual Google Sites embed behavior.
- Teacher review remains open for item-level SLO mapping, scientific answers/distractors/wording, and proofread of Word mathematical notation. Public practice is not a secured FBISE/school examination.

## Next work after V65
- Recover and visually inspect exact source Figure4.13 for the five held Topic4.3 items; import only after independent figure-driven QC and all four original scenario items can be provided together.
- Audit corrected Grade XI Unit3 Topics3.1/3.2 (source reconciliation) and Units1/2 complete original banks; Unit5 supplementary assessments and next Grade XI Unit6 content, avoiding duplicate import.
