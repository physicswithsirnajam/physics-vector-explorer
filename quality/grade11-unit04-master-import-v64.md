# V64 — Grade XI Unit 4 Topic 4.6 corrected master-source MCQ import

## Original user-supplied source and exact answer matching
- Corrected `Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx` from 8 Oct 2026; original file SHA256: `925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777`.
- Source Topic 4.6, **Weightlessness in Satellites**: 80 printed questions (Q1–Q80), including **56 straight MCQs** and **24 scenario MCQs in six complete four-question original scenarios**.
- The source's Word answer table was matched question by question to the exact original correct option text, source letter, and one-line explanation. Original letter counts are **A20/B20/C20/D20**.
- Original Word run properties, not plain-text guessing, supply mathematical superscript and subscript symbols in questions/choices/keys/contexts: examples `gₒ=v²/r`, `F₉=mg`, `m s⁻²`.
- All six original scenario texts (Q57–60, Q61–64, Q65–68, Q69–72, Q73–76, Q77–80) are preserved. The source Topic4.6 MCQs have **no external-figure dependence**, so all 80 can be imported as complete scenarios.
- Source checks compare **source key and option integrity, not independent scientific validity**. All newly imported MCQs remain public **teacher-review-pending**, `boardEligible:false`, `difficulty:Unspecified`, `cognitiveLevel:Unspecified`. SLO **P-11-B-16** is a *topic-level candidate*, not a verified item-level FBISE mapping. Provisional summative-theory classification follows the source/topic framework pending review.

## Counts after V64 (only after merge)
| Scope | Previous V63 | New original source items | V64 |
|---|---:|---:|---:|
| Grade XI Unit4 central PUBLIC Test Builder | 475 | 80 | **555** |
| Corrected source supplements from topics 4.1–4.6 | 395 | 80 | **475** |
| Original separate Unit4 classroom practice bank | 80 | 0 | **80, unchanged** |
| Unit4 full four-question scenarios | 35 | 6 | **41** |
| Unit4 scenario MCQs | 140 | 24 | **164** |
| Grade XI published Units1–5 combined | 1,525 | 80 | **1,605** |

- Five-unit counts: Unit1 275, Unit2 206, Unit3 220, Unit4 **555**, Unit5 349.
- Cumulative source topic counts: 4.1=80; 4.2=80; 4.3=75; 4.4=80; 4.5=80; 4.6=80.
- **Topic4.7 Artificial Gravity: 80 original questions remain unimported.**
- **Five Figure4.13-dependent Topic4.3 questions remain on hold**: Q38 plus all four MCQs in source scenario Q69–72. Do not restore without the actual source figure and independent checking.
- No modifications to the separate original 80-item classroom MCQ paper, public teacher discussion/projector, manual OMR/print materials, Unit4 assessments, original logos, school/Firebase authentication, private saved marks or roles. No new cloud-save for Unit4 or mixed-unit results.

## Archive and fail-closed source integrity
- Original Word-preserved data stored as `question-bank/grade-11/unit04-v64-topic46.b64` (gzip+base64), **9,192 characters**, FNV32 **`7a493ad2`**, containing exact source questions, four options, answer letter, explanation and six scenario texts. Original file SHA256 carried in archive.
- Read-only adapter rejects missing/truncated archive, checksum/source SHA mismatch, missing options/keys/explanations, incorrect source order, nonunique IDs or stem/options content, incomplete four-question scenarios, or unexpected distribution of source keys.
- All previously published Unit4 source items remain in original order. Items requiring Figure4.13 stay excluded and no scenario is partially published.

## CI release and human sign-off
- `scripts/test_unit04_master_v64.cjs`: exact 80 source item matching, mathematical rendering, new source answers, 80 original classroom items unchanged, 395 earlier supplemental items retained, 555 unique IDs and content, 41 complete scenarios, 164 scenario MCQs and five held-figure IDs excluded.
- Chromium end-to-end checks: Unit4 **555 eligible**, start a **40-question Scenario Only** test with four-choice options and a visible original scenario; Unit3+4 **775 eligible**, submit for per-unit breakdown, verify Unit4/mixed cloud saving disabled; mobile Student Guide shows **1,605** across Units1–5 and Unit4 **555** with no horizontal overflow.
- The V64 workflow also runs historical V63/V62/V61 source integrity, V39 original classroom practice, V55/V56/V57 five-unit planner/guide and V60/V59 Unit3/Unit5 source regressions. Existing independent CI count checks updated to expected live totals without changing historical source question checks.
- Do not merge until **all GitHub Actions checks on the final commit** are green. Human Physics review remains required for numerical/scientific accuracy, distractors, true summative/formative item-level SLO placement, textbook alignment, original-source math readability and real student mobile/Google Sites testing.

## Post-merge manual checklist
1. Choose Unit4 only in the central Test Builder: **555** eligible; start **40 Scenario Only** and confirm full four-question scenario groups.
2. Select Units3+4: **775** eligible; complete a practice test, confirm separate per-unit performance and disabled cloud-save.
3. Student Guide: **1,605** total and Unit4 **555**.
4. Reopen separate Unit4 classroom 80-question paper, discussion/projector, OMR and descriptive resources and confirm they still reflect the original 80 only.
5. Next controlled original source import: **Topic4.7 Artificial Gravity (80)**, keeping all five Figure4.13 dependent Topic4.3 questions held until a correct figure is available.
