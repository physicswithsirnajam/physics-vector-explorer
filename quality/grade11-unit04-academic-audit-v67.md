# V67 — Grade XI Unit 4: complete-bank source, scientific spot-check and FBISE SLO-precision audit

**Status:** Automated quality gate and disclosure; **not** final independent scientific or examiner certification. The original 640 questions and their source answer letters are unchanged in this PR.

## 1. Scope and audited source editions

- Grade XI Unit 4 central PUBLIC Test Builder: **640 MCQs**, comprising the existing **80 separate classroom-source questions** followed by **560 corrected original-source MCQs** drawn from all seven topics, 80 per topic.
- All 560 supplement source keys come from the user-supplied **`Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx`**, SHA256 `925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777`. V61/V62/V63/V64/V65 original source archives plus V66 Figure4.13 five-item supplement are read and cross-checked; none is rewritten.
- Unchanged 80-item classroom bank source remains `question-bank/grade-11/unit-04-v39-80-practice.json`.
- Original Unit4 complete scenario groups: **48 × 4 = 192 scenario questions**. Original standalone Q38 and entire original Figure4.13-linked Q69–72 scenario remain available with a checked axis schematic. Five-unit public total remains **1,690**.
- All published MCQs remain source-matched provisional practice; authentication, Firebase, saved grades, OMR/projector/classroom practice and separate descriptive resources unchanged.

## 2. Official FBISE SSC/HSSC-I framework crosswalk

Checked directly against user-supplied `Physics_HSSC_I_model_paper_50_percent.pdf`, Assessment Framework Physics Grade XI, printed framework pages **3–4**, uploaded PDF pages **9–10**. These **12** Unit4 theory outcomes are classified **Summative** by the framework:

| Topic / topic-level candidate | SLO code(s) | Official cognitive levels |
|---|---|---|
| 4.1 rotational kinematics | P-11-B-07, 08, 09 | 07 Knowledge/Understanding; 08 Knowledge/Understanding/Application; 09 Application |
| 4.2 centripetal acceleration and force | P-11-B-10, 14, 15, 21 | 10 Understanding/Application; 14 Knowledge/Application; 15 Application; 21 Application |
| 4.3 moment of inertia | P-11-B-18 | Knowledge/Application |
| 4.4 angular momentum | P-11-B-18, 20 | 18 Knowledge/Application; 20 Knowledge/Understanding/Application |
| 4.5 torque–angular acceleration | P-11-B-19 | Application |
| 4.6 satellite weightlessness | P-11-B-16 | Understanding |
| 4.7 artificial gravity | P-11-B-17 | Understanding |

Machine-readable official matrix: `quality/grade11-unit04-v67-fbise-framework.json`.

**Critical precision distinction:** all 560 corrected-source MCQs inherited **topic-level SLO candidates** when imported. They have *not* been independently tagged against each individual official SLO. Specifically, **240 source MCQs** in topics 4.1, 4.2, and 4.4 each bear **multiple broad candidate codes**, even if their individual stems assess only one. The remaining **320 source MCQs** have single topic candidates but still await independent item-level verification. An SLO filter can therefore include wider-topic practice, and multi-code answer breakdowns may count the same question under more than one outcome. The original 80 questions carry *individual teacher-prepared SLO labels*, also provisional rather than official examiner-certified.

## 3. Automated scientific and structural audit

`scripts/test_unit04_science_slo_v67.cjs` enforces:

- The **560 original source rows and original answer-table letters**, across six archived source segments, all 80 numbers in every topic.
- Original classroom 80 question stems, explanations, keys and difficulty/cognitive labels unchanged.
- **640 unique question IDs and question+four-option fingerprints**, four present distinct options, correct answer ID, and nonempty explanation for each question.
- Exact **48 intact four-item scenario groups**, with 192 contextual questions and identical source context within each group.
- All 640 items use one or more of the 12 officially summative Unit4 codes; all 560 supplemental topic candidate-code lists match the checked source framework; no newly imported question falsely advertises vetted cognitive or difficulty metadata.
- Per-topic key distribution and all-unit answer balance, plus **19 independent physics conceptual/numerical spot-checks** across centripetal force, moment of inertia, angular momentum, torque, apparent weight, and artificial gravity. These include 4500 N for a 1200 kg car at 15 m/s on a 60 m curve, 0.125 versus 0.50 kg m² for the centre/corner rectangular axes, 686 N before ideal free fall, and 77.7 s for a 1500 m radius habitat adjusted to 1g.
- This does **not** imply independent scientific verification of the other **621** question solutions. A full teacher-led science/distractor review remains necessary.

`scripts/test_unit04_slo_ui_v67.cjs` checks actual Chromium Test Builder/quiz/results at desktop and 390px mobile, ensures teacher-review-pending source questions are visibly labelled **topic-level SLO candidates**, and that score summaries explicitly disclaim certified per-SLO mastery. Saved student-grade submission remains disabled for Unit4 practice.

## 4. Teacher correction queue (no silent changes)

| Priority | Scope | Reason and proposed work | Compulsory for valid claims? |
|---|---|---|---|
| **High** | 240 multi-code supplemental MCQs | Independently select the *actual* SLO(s) per individual question; do not assign every outcome of a topic to every question. | **Yes**, before describing SLO-filtered scores as precise. Source questions themselves can stay as provisional practice. |
| **High** | All 640 answer keys and distractors | Independently solve the question, verify conditions, units, signs, numerical values, and plausible distractors against the book and official framework; record only items needing amendment, with reasons and compulsory/optional status. | **Yes**, before certifying scientifically vetted question bank. Original source keys are not proof of independent correctness. |
| **Medium** | 320 single-code supplemental MCQs | Independently verify each candidate SLO and exclude ancillary/out-of-scope details as appropriate. | Yes before item-level SLO certification; no need to remove from provisional practice meanwhile. |
| **Medium** | 560 imported corrected-source MCQs | Allocate independently supported Knowledge, Understanding, Application levels and difficulty; retain `Unspecified` meanwhile instead of guessing. | Yes before official cognitive/ToS percentages or per-level mastery claims. |
| **Medium** | Original classroom 80 | Cross-check teacher-prepared question-level mapping and K/U/A labels against framework and textbook. | Yes before saying examiner-approved; current original practice remains unchanged. |
| **Optional** | Students' source report and review UX | Improve topic-to-SLO explanations and collect question-level issue reports for systematic QC. | Optional; future work once high-priority scientific checks are complete. |

**Amendment policy:** preserve original source questions and answer letters until each proposed correction has a stated reason and human/teacher approval. List *only questions requiring amendments*, mark **compulsory vs optional**, and note whether the original could remain while a revised item is added instead. Do not silently replace source answers, invent cognitive labels, or claim an FBISE-certified question paper.

## 5. User-facing improvement

- Test Builder input help now warns that selecting a specific SLO for Unit4 may include related **topic-level** source questions.
- In practice, corrected-source Unit4 items are visibly labelled **"Topic SLO candidates"** and **"Item-level SLO not independently verified"**.
- In the results SLO breakdown, the new warning explicitly states a question may contribute to more than one candidate SLO and the reported results are **not certified FBISE SLO mastery**.
- Student Guide clarifies the exact provisional status for all 560 imported Unit4 MCQs.

## 6. Merge gate and follow-up

Do not merge until the dedicated V67 source/physics QC and actual Chromium disclosure workflow, together with all older GitHub Actions checks, are green on the final commit. The next PR should run **teacher-oriented question-level audit by topic** and propose only evidence-backed corrections with compulsory/optional tags. Avoid broad rewording of all MCQs and preserve the original classroom 80, source archive and existing student attempts.
