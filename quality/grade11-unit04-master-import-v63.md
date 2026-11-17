# V63 — Grade XI Unit 4 Topic 4.5 corrected source MCQ import

## Source and staged scope
- User-supplied original corrected **Grade11_Unit4_CORRECTED_STUDENT_NOTES.docx** (8 October 2026), SHA256 `925245851971b7adaf0a11018fd6cfa5a709e894c861d0893298827bd617a777`.
- **Topic 4.5 — Torque and Angular Acceleration:** all **80 original MCQs**, original four options, answer letter, explanation and scenario stimulus from source tables 140–147.
- **56 independent MCQs + 24 contextual MCQs in six intact four-question original scenarios (Q57–80)**. Source answer distribution A20/B20/C20/D20; the source was not reshuffled or re-keyed.
- DOCX run-level superscript/subscript styling was converted into faithful Unicode math characters (e.g., `τₙₑₜ`, `kg m²`, `rad s⁻²`). No fabricated figure, replacement visual or heuristic equation guessing.
- Source is a **student-authored/public provisional practice bank**, not an official FBISE answer key and not academically signed off item by item. These 80 new questions retain `status:teacher-review-pending`, `boardEligible:false`, `difficulty:Unspecified`, `cognitiveLevel:Unspecified`, and **Topic-level only candidate SLO P-11-B-19**. The current summative-theory classification follows the topic's known SLO, but individual item mapping must be independently verified.

## Updated public practice inventory
| Section | Before V63 | New in V63 | After V63 |
|---|---:|---:|---:|
| Grade XI Unit 4 central Test Builder | 395 | 80 | **475** |
| Unit 4 original classroom-source bank | 80 | 0 | 80 (unchanged) |
| Unit 4 supplementary corrected topic questions | 315 | 80 | **395** |
| Complete Unit 4 scenario sets | 29 | 6 | **35** |
| Scenario-based Unit 4 questions | 116 | 24 | **140** |
| Grade XI all published Units 1–5 | 1,445 | 80 | **1,525** |

- Published Units 1–5 counts: **275, 206, 220, 475, 349**.
- Unit4 cumulative imported topic counts: 4.1=80; 4.2=80; 4.3=75; 4.4=80; **4.5=80**.
- Unit4 original **80-question boxed classroom paper remains a separate unchanged resource**, including existing key, OMR, projector, teacher discussion and descriptive assessment.
- Topic 4.3 **five figure-dependent original questions remain held**: Q38 directly references Figure 4.13; the entire Q69–72 figure-dependent scenario remains on hold. No partial scenario is released.
- Topics **4.6 Weightlessness in Satellites** and **4.7 Artificial Gravity** remain **unimported**: 80 questions each, or 160 source questions total. Neither is represented as online at this stage.

## Original source data and fail-closed controls
- Archive `question-bank/grade-11/unit04-v63-topic45.b64` contains the original source stems, options, answer letter, explanation and six original scenario introductions. It is gzip + base64 **7,416 characters**, FNV32 checksum **b70ebe63**; original SHA256 is stored within the archive.
- Adapter validates the exact archive size, checksum, source identity, Topic4.5 80-item count, sequential printed question numbers 1–80, 20 of each source answer letter, complete 4-question scenarios, and all IDs/content against the original 395 questions.
- Source errors or a missing/corrupt archive fail closed; no partial or invented questions display. The new bank is read-only, served from the same public GitHub Pages site and uses the existing practice engine.
- No authentication, Firebase roles, Firestore rules, confidential documents, hidden grading, existing student grades, score-saving permissions, or Grade XI Unit 4 standalone classroom resource was changed.

## Automated acceptance and teacher signoff
- `scripts/test_unit04_master_v63.cjs` validates the original corrected source, all four answers, archive checksum, 80 exact source matches, unaltered original classroom80 and previous315 sequence, 475 unique IDs/content fingerprints and 35 fully intact four-item scenarios.
- The Chromium browser suite launches a **40-question Scenario Only** Unit4 test, checks **475 eligible**, tests the **Units 3 + 4 pool of 695**, verifies per-unit results and disabled cloud saving, and checks **1,525** question student guide at 390px mobile width.
- GitHub Actions `validate-grade11-unit04-master-v63.yml` also runs V61, V62, V55/V56/V57, original Unit4 V39 and Unit3/Unit5 source regressions. The prior workflows were updated to assert current *overall* counts while retaining their **historical topic-source integrity** checks.
- Human review still required: independent Physics calculations and distractor quality, individual SLO assignment versus the official assessment framework, corrected student source/answer key status, scenario readability in Google Sites iframe and on mobile, and verified CI green on the **final PR commit**. The question pool must not be described as teacher-certified or as an official FBISE examination.

## Post-merge checks
1. Unit4 only → **475 available MCQs**. Use Scenario Only with 40; scenarios should remain grouped in fours.
2. Unit3 + Unit4 → **695 eligible MCQs**. Launch practice, submit, and view the distinct unit performance breakdown. Cloud-save should stay disabled for Unit4/mixed units.
3. Student Guide → **1,525 MCQs** total; Unit4 card should show **475**.
4. Reopen the original Unit4 80-question classroom/OMR/projector material: it **must remain 80**, not 475.

## Next controlled work
- Import corrected Topic 4.6 and 4.7 80-MCQ banks after separate source checks; keep complete original scenarios and original keyed letters.
- Recover and independently inspect source Figure 4.13 before restoring the five held Topic 4.3 questions.
- Continue the previously queued Unit 3 source-reconciliation, Unit 5 additional-material audit, and Units 1/2 completeness checks before adding new Grade XI Unit 6 content.
