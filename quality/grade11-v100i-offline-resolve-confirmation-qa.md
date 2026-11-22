# V100-I — Safe, cancelable resolution confirmation in the offline MCQ Review Desk

## Verified baseline

PR **#195 (V100-H)** merged into `main` as `e19d6764e84f066596443aad380d9594ea306128` on 22 November 2026. The branded, downloadable, fictional MCQ Review Desk already supports source-linked metadata, sample-only search and filters, status feedback and keyboard focus. V100-F verifies the data shape against real **local-only**, default-OFF V100-A/B/C endpoints, but the UX has **no real account or database connection**.

## Narrow behavior correction

In V100-H, clicking **Mark resolved (demo)** immediately changed the selected fictional report from `in-review` to `resolved`, appended one simulated audit event and removed the resolve button. A reviewer could do this accidentally. For a future administrator UX, resolution should be a deliberately confirmed decision rather than an unguarded click.

V100-I changes only the offline visual prototype:

1. **Start review (demo)** remains a single step for `new → in-review`, as in the approved existing local backend.
2. Clicking **Mark resolved (demo)** opens a native accessible HTML `dialog` with a **specific approved MCQ ID**, an explicit **no real report changes** explanation, and **Cancel** / **Confirm resolved (demo)** buttons. **Cancel receives the initial focus**.
3. **Cancel** or keyboard **Escape** closes the dialog without changing the report, metrics, events or status. Cancel restores focus to the original review action.
4. Only a genuine click/keyboard activation on **Confirm resolved (demo)** performs the already approved `in-review → resolved` synthetic transition. It checks the still-selected, still-in-review fictional record before changing it; existing action feedback, stage filtering, focus restoration and 0/1/2 audit timeline are preserved. A canceled/opened dialog cannot produce an audit event.
5. No new statuses, private reviewer notes, MCQ answers, browser storage, API requests, Firestore SDK calls or back-end write routes were introduced. The modal uses safe `textContent` for the ID, a standard keyboard-accessible native dialog and constrained small-screen width.

## Exact files and proof

- `scripts/fixtures/grade11-admin-review-preview-v100e.template.html`: native confirmation dialog, brand-matched CSS and DOM-only guarded transition logic.
- `scripts/test_grade11_admin_review_preview_v100e.cjs`: Playwright/Chromium assertions for open-is-not-commit, cancel and Escape no-op, focus returning after cancel, explicit resolve confirmation, keyboard Enter/Tab/Enter, and 390px mobile-width dialog/cancel. Existing desktop/mobile, logo, search/filter, text injection, no-network and reload regressions remain.
- This scope and safety note.

The existing **Grade XI Synthetic Administrator Review UX Preview (V100-E)** GitHub Action automatically runs the V100-F source-derived contract suite and amended Chromium tests on these changed paths. It also uploads offline `index.html` and updated screenshots, including `resolution-confirm-mobile.png`.

## Security, content and production boundaries

**Unchanged:** original Physics with Sir Najam logo bytes and navy/gold palette, 2,250 frozen public Grade XI MCQ metadata references, student/teacher access, public portal and MCQs, Firebase App Check registration/enforcement, current deployed Firestore rules/Auth/Firestore, actual report data, all three local default-OFF HTTP endpoints, cloud deployment, domain and DNS.

The reported issue text remains safely rendered as text. The confirmation is **a usability safeguard, not server-side authorization or proof of genuine administrator review**. A future real admin deployment would still require independently verified current admin roles, transactional server state machine, actual App Check, privacy governance, retention and secure hosting. **Student reporting remains Copy only**.

## Merge gate

Keep this PR **Draft** until the exact latest-head **Grade XI Synthetic Administrator Review UX Preview (V100-E)** workflow (including V100-F wire-contract suite) completes **SUCCESS**. Review the downloadable `grade11-admin-review-ux-preview-v100e` artifact (desktop/mobile screenshots and confirmation screen) and verify that the **V99-U Reporting/App Check Launch Lock** remains intact. This PR changes no V99-U-tracked paths; the earlier successful `main` lock run is not a new PR-head workflow.

After confirmation, owner alone selects **Ready for review → Merge pull request → Confirm merge**. No Firebase Console settings, GitHub secrets, localhost command, domain purchase or deployment needed.
