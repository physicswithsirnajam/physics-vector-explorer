# V100-H — Truthful offline Review Desk result counts and simulated action feedback

## Confirmed baseline

PR **#194 (V100-G)** is merged into `main` as `00b5f4ed288acf27dcdb5268881142b3f2b89a1d` (22 November 2026). Filtering and search now keep the fictional report list, details and keyboard focus in sync. The downloadable V100-E/F/G Review Desk is **not connected to a live service**.

## Next small UX gap

- A status change made inside the **New** filter removes the changed report from the visible list and may automatically select another report. Without an explicit message, a reviewer cannot tell whether the selected report changed because of the filter or because their action failed.
- The four dashboard tiles show fictional sample totals, but the queue previously did not state **how many of the four demo entries currently match** the search and stage filter.
- Empty searches require users to reverse search text and the stage filter manually. A single clear-view control makes recovery easier; it must not be confused with **Reset demonstration**, which reloads and restores the initial fictional statuses.

## Narrow implementation

- **Only** the unlinked offline template `scripts/fixtures/grade11-admin-review-preview-v100e.template.html` changes visually. Add **Showing N of 4 fictional sample reports** beside a **Clear search and filters** button. Count must recompute from the exact same visible array used by the queue and details, including zero-match.
- After a simulated `start-review` or `resolve`, show a safe **role=status / aria-live=polite** message naming the approved public MCQ ID and new stage, **always** stating no real report was updated. When the new stage makes the report leave the active stage filter, explicitly mention that filter. Screen readers get the same text.
- Selecting a different report or changing search/filter dismisses the previous action message. Clear-view restores **All**, empties the search input, updates ARIA-pressed states, preserves an available selection, and returns focus to the search input. It **does not** undo simulated statuses. The original Reset demonstration still reloads and restores them.
- Extend the existing `scripts/test_grade11_admin_review_preview_v100e.cjs` headless browser regression with count 4/2/1/0, reset controls, sample-only announcements, focus, no hidden-detail cases, and initial status reset. Preserve all V100-F exact backend-contract checks and existing desktop/mobile, injection and no-network tests.

## Deliberate protection boundary

All four reports remain fictional, with reference IDs taken from the frozen **2,250-item approved public Grade XI MCQ metadata source**. No real note, real student identity, exam answer key, private audit fields or real administrator credential is introduced. Text is always set through `textContent`; never turn a report or note into executable HTML.

No edits to the live portal, public student practice, Firebase Auth/Firestore/rules, real App Check registration or enforcement, server routes, Cloud services, public admin URL, custom domain or DNS. The prototype is available **only as an offline GitHub Actions artifact**. The actual student MCQ Report control remains **Copy only**.

## Merge gate

The existing **Grade XI Synthetic Administrator Review UX Preview (V100-E)** action, now exercising V100-H tests and V100-F schema contract, must complete **SUCCESS at the exact PR head**. Re-verify the **V99-U Reporting/App Check Launch Lock** against unchanged source (the PR's `scripts/fixtures` and browser-test paths do not trigger that workflow; the latest successful `main` run is an earlier baseline, not a new PR run). The owner may inspect the generated HTML and desktop/mobile screenshots under the **grade11-admin-review-ux-preview-v100e** artifact. Keep PR **Draft** until checks and visual review; then the owner decides when to mark ready and merge.

No Firebase Console steps, secrets, local CLI, purchases or domain changes required.
