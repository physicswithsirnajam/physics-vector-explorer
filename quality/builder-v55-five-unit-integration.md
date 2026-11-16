# V55 — Grade XI first-five-unit central MCQ integration

## Student-facing release
- Connect all five published Grade XI unit banks to the existing Test Builder and MCQ Practice Engine for individual (one-unit) tests.
- Counts from unchanged original sources: Unit 1 **275**, Unit 2 **206**, Unit 3 **80**, Unit 4 **80**, Unit 5 **32** (Set A 16 + Set B 16). **673** distinct IDs total.
- Start links, SLO filters, difficulty options, question counts (4/10/20/30/40/60), random/grouped/scenario arrangements and provisional practice explanations work across the five units, constrained by actual eligible questions.
- Unit 5 is supported by joining its ORIGINAL public student JSONs and ORIGINAL public post-practice teacher key JSONs at runtime: retain question stems, four option texts, distinct IDs, source printed page metadata and 3-step worked explanations. All keys are openly accessible; this is NOT teacher-restricted practice or a secure exam.
- Unit 3 and Unit 4 carry original 56 independent plus 24 scenario-dependent MCQs. All 6 original 4-question stimulus scenarios remain complete in grouped modes; when an individual scenario question is randomly selected its source stimulus is also visible.
- Unit 1 and Unit 2 existing MathML stimulus HTML stays byte-equivalent, preventing degradation of mathematical expressions. All original students' source MCQs remain unchanged.

## Safeguards
- Dynamic V55 bank adapter checks all expected counts, IDs, options, companion Unit 5 keys, SLOs, published scenario text, complete groups and source unit/grade before marking a bank ready; unexpected or inaccessible banks fail closed.
- Adapter is restricted to repository-owned bank file paths; not remote URLs.
- Unit 5 has NO source difficulty rating, so the adapter uses the honest value "Unspecified" instead of inventing Foundation/Standard/Challenge labels. When a student chooses a difficulty filter unsupported by Unit 5's metadata, they see the actual zero eligibility and Start is unavailable; choose Balanced.
- All 673 are provisional educational practice questions. Source-grounding and automated structural QC do not substitute for human item-by-item scientific verification or certified FBISE board approval.
- Only ONE unit at a time is currently enabled. "Select all" remains disabled until the next PR implements balanced cross-unit tests safely. The centrally loaded 673 questions do not yet imply cross-unit paper generation.
- Personal cloud saving remains authorized only for Units 1 and 2. Unit 3–5 sessions still display an independent printable in-browser report, while the Save button stays disabled with a clear pending message. No Firestore rules, student accounts or historical records are changed.

## Browser and static QC
- scripts/test_builder_five_units_v55.cjs checks original 673 source records against normalized output for unchanged questions/options/keys/explanations, full source scenario retention, Unit 5 key joins and invalid-unit/path rejection.
- It also opens the actual Test Builder for Units 1–5 independently, confirms exact available questions and launch links, actually begins five real 20-question tests, tests four-question intact Unit 3/4/5 scenarios, verifies Unit 5 cannot make a 40-question test from only 32 questions or misreport 8 SLO-matched questions as enough for a 20-question test, finishes a Unit 5 self-assessment and checks 390px mobile width.
- The V54 regression test must remain green with new Unit 3–5 enablement and Units 6–14 disabled.
- GitHub Actions executes all tests in installed real Chromium and attaches screenshots.

## Classroom sign-off (after all checks pass)
1. Test Builder with query unit=3: 80 eligible, start 20 MCQs, see Translatory Motion heading and four options.
2. Repeat Unit 4: 80 eligible, source scenario appears in scenario-only mode.
3. Repeat Unit 5: 32 eligible, distinct Set A/B IDs, scenario explanation from trolley, and full 3-step rationale after submission.
4. Set Unit 5 count to 40: Start must disappear. Reduce to 20 and select a summative Unit 5 SLO: eligibility must update.
5. Select a second available unit: first selection must clear. Multi-unit mode is not released yet.
6. Verify 390px mobile, sign-in unaffected, and existing Unit 1–2 saved progress unchanged.

## Next release
- Permit any combination of Units 1–5, distribute questions across selected units, avoid duplicate IDs and partial stimulus groups, support per-unit/SLO breakdowns, and update repeat preference across units.
- Future cloud saving must undergo Firestore policy and historical progress-schema checks before enabling.
- After all five-unit test workflows stabilize, accept newer complete teacher MCQ files, compare/deduplicate against these 673 existing MCQs and carry over references/diagrams without inventing missing keys.
