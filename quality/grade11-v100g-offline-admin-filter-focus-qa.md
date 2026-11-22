# V100-G — Offline Review Desk selection and keyboard focus QA

## Starting point

Owner confirmed **PR #193 (V100-F)** merged into `main` at `f380e65b66fe5ba048e43dad401612a4ce530ea4` on 22 November 2026. V100-E/F provides a downloadable, self-contained, branded **fictional** administrator UI checked against the existing local-only V100-A/B/C queue/transition/history contracts. This PR does **not** connect that UI to a real backend.

## Specific bugs addressed before later integration

1. **Stale detail on filters:** previously selecting a report and then showing a filter (e.g. Resolved) could leave the detail pane displaying a report that is **not in the filtered list**. An unmatched search produced an empty queue but continued to show the previously selected issue. That is confusing and could mislead a future reviewer.
2. **Lost keyboard focus:** rendering a new selection replaced its button; moving a report through the demo review stages replaced the action button. With no focus restoration, keyboard users could be unexpectedly returned to the browser document.
3. **Filtered transition hazard:** if starting review removes a selected report from the current New-only filter, focus should move to the **next visible list item**, never to the *action button of a different report*.

## Small, isolated fix

- Update **only the offline** `scripts/fixtures/grade11-admin-review-preview-v100e.template.html`: compute one visible list for the current search/filter; if the selected report is no longer visible, select the first visible match, or clear selection if none remain; show a clear no-match message instead of a hidden report. Restore focus after report selection and simulated review actions. Preserve focus in search on typing. Keep existing native buttons, live detail region, text-only user note rendering, branding, demo disclaimers and in-memory reset semantics.
- Extend existing `scripts/test_grade11_admin_review_preview_v100e.cjs` headless Chromium checks to reproduce all three cases, including keyboard **Enter**, focus after New → In Review → Resolved, search with zero results, and a transition that changes filtered visibility. Keep existing screen-width, official-logo, note-injection, reload/non-persistence and no-network checks unchanged.
- This documentation records the limited change and review gate. The existing preview workflow already watches the changed HTML and browser-test paths; no new CI workflow or secrets required.

## Owner verification and safety

Run the existing **Grade XI Synthetic Administrator Review UX Preview (V100-E)** workflow. It must pass its V100-F schema/contract group and all amended V100-E Chromium browser groups on the exact PR HEAD. Inspect updated `desktop.png`, `mobile.png` and downloadable `index.html` under the existing `grade11-admin-review-ux-preview-v100e` artifact; use the search, New/Resolved filters and Tab/Enter on the preview.

Also verify **V99-U Reporting/App Check Launch Lock** remains successful (if no path-triggered run, use a manual dispatch or inspect the separately reported launch-lock source invariant; never assume green).

**Absolutely unchanged:** public portal pages, original logo bytes, 2,250-reference frozen approved MCQ catalogue, Firebase Auth/Firestore/rules, app checks, private report IDs, live report submissions, actual administrator login and HTTP deployment, custom domain/DNS. The preview remains **synthetic demo, not connected**. Student reporting remains **Copy only** until genuine App Check and secure production service gates are met.

No Firebase Console settings, GitHub secrets, paid domain, real student accounts, local CLI, or production configuration needed. Owner retains the merge decision after the tests and screenshots are reviewed.
