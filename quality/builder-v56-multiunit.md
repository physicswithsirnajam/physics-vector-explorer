# V56 — First-five-unit checkpoint: any combination of Grade XI Units 1–5

## Student release
- The existing 673 published source MCQs remain unchanged across Units 1–5. No fresh questions, answer keys or curriculum mappings are invented.
- Students may select **one, two, three, four or all five** units, in any valid combination, for a **single** self-practice MCQ test.
- Test Builder checks all selected real bank sources, displays accurate available-question counts and a preview of per-unit quotas. It refuses a test that cannot contain at least one eligible item from each selected unit.
- "Select all five" checks only the five published units. Future Units 6–14 remain disabled. Old deep links with unit=2 still work. New combined links use units=1,3,5 and are validated by the Practice Engine independently of the UI.
- A shared planner drives BOTH Builder preview and the actual quiz, preventing false-positive Start buttons. For each chosen unit, the default balanced mode allocates a comparable number of questions, adjusting for bank limits (Unit 5 currently has 32 MCQs).
- In Ordinary Random mode, scenario-related individual MCQs can be picked separately, but the *full original source scenario* stays visible. In Mixed—Intact Stimulus and Scenario-Only modes, no selected group is split.
- Complete scenario-only coverage across all 5 units at count 20 is 4 questions per unit / 5 intact source scenarios. Tests for other counts or filters that cannot give every unit a complete group are rejected with an explanation.
- Report shows total score, answered/incorrect/skipped, **per-unit correct/total and answered**, all source SLO breakdowns, question-by-question answer/explanation and print-to-PDF. Each question visibly identifies its actual textbook unit.

## Compatibility and safety
- This is **public, provisional, self-graded self-practice**, not secure school marks, an official FBISE examination, or examiner-approved MCQs.
- Existing saved attempts and private Firestore rules are untouched. Per existing allowlist, cloud saving remains available only for a SINGLE Unit 1 or Unit 2 self-practice attempt; combined-unit tests and Units 3–5 have a transparent notice and a printable local report.
- Multi-unit practice emits unit:null and units:[...] in browser-only event metadata. Because the account-saving path strictly allows only integer unit 1 or 2, no unauthorized mixed-unit attempt reaches Firestore.
- Original Unit 1/2 recent-question preference browser keys remain unchanged. A combined-unit selection has its own browser-local recent-question key; there is no tracking of student identities.
- Existing five-unit bank adapters and original student / teacher-key files are reused; no source bank mutation.

## Automated regression
1. Verify all 673 original question IDs are distinct.
2. Pure planner checks 5-unit fair allocation 4+4+4+4+4 from 20 items.
3. Verify exact complete scenario-only arrangement across 5 units at count 20 and mixed-group coverage; reject 5-unit count 4.
4. Real Chromium selects Units 1/3/5 and launches a 20-item quiz; the report includes all 3 units with 20 total questions.
5. Select-all-five -> 673 eligible; count 4 disables Start, count 20 + scenario-only launches five consecutive four-question groups, showing each complete source situation.
6. Test grouped mix on Units 2 and 4; formative filter across Units 1 and 5 makes Unit 5 ineligible and hides Start.
7. Direct URLs with duplicate or unavailable unit numbers fail closed.
8. Verify mobile 390px without horizontal overflow.
9. Rerun original V55 673-question source checks plus all five single-unit browser journeys.
10. Rerun original V54 Unit 1/2 flows after updating previous single-unit-check expectations to reflect enabled multiple selection.

## Next checkpoints
- Validate real student experience on Google Sites embed and common mobile devices.
- Review the Firestore schema and security rules *separately* before enabling cloud saving of multi-unit results.
- After the agreed five-unit review is stable, import and deduplicate any additional user-owned master MCQs; retain full formulas, diagrams, verified keys, SLOs and stimulus contexts.
- Then develop collapsible navigation/sidebar, accessibility and discoverability improvements before beginning Unit 6.
