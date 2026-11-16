# V54 — Test Builder first-run repair

## Implemented scope
- Only the public build-your-physics-test.html interface, one live-Chromium QA suite and the V54 GitHub Actions workflow are changed.
- Existing Unit 1 and Unit 2 question banks, 275 + 206 = 481 original pilot MCQs, remain byte-for-byte unchanged.
- Units 3, 4 and 5 have another 80 + 80 + 32 = 192 published provisional MCQs in separately maintained banks, but V54 does NOT assert central Test Builder availability for those units yet.
- First-run Test Builder defaults to MCQs only. The initial previous Mixed format default prevented immediate practice launch.
- One ready unit (1 or 2) at a time is selectable; choosing the second replaces the first, and explicit unavailable-unit labels prevent misleading options.
- Students now get a direct Start MCQ Practice link as soon as the bank loads and settings are eligible; Review My Test Plan is optional.
- Multi-unit Select All is disabled pending the proper bank-normalization and multi-selection milestone. Reversing out of full mock preview resets to Unit 1 instead of leaving fourteen units selected.
- Existing full mock, descriptive, secure exam and paper-generation functionality are NOT claimed operational by this release.

## Verification
1. Confirm default Unit 1, MCQs only, 275 eligible, visible Start link on page load.
2. Click Unit 2; Unit 1 clears automatically; verify 206 eligible, direct Start.
3. Actually launch Unit 2 Practice Engine and begin a 20-question quiz with four options.
4. Check deep link from Unit 2 with query unit=2.
5. Enter unavailable SLO or clear selection: Start hidden until eligibility restored.
6. Enter and leave full-board preview without reactivating unsupported units.
7. Confirm 390px responsive behavior and the original official brand.
8. Review screenshots in GitHub Actions; verify independent physics question review is still pending.

## Boundaries and next steps
- Public self-practice only. Original option/answer/explanation/SLO/scenario source records are untouched.
- Existing account save of self-practice is still allowlisted to Unit 1 or 2. Do not widen Firestore without rules and schema review.
- Next: normalize and import Units 3–5 into a central versioned read-only MCQ representation, with Unit 5 student records verified against its distinct publicly accessible teacher answer keys, then allow students to select any combination of Units 1–5.
- After that: safe per-unit and per-SLO test reports and progress support, then collapsible portal navigation and mobile usability.
- Additional uploaded master MCQ banks should be deduplicated and academically checked before adding them to the currently published 673 records.
