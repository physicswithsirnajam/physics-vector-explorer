# V100-E — Synthetic administrator MCQ review desk (offline visual UX prototype)

## Baseline and intent

Verified PR #191 (V100-D) merged into `main` as `2f9b9f5862ba7704e3eacc4b13255706d8ec837b` on 22 November 2026. Its real local Firebase Auth/Firestore Emulator integration test now covers the **complete authenticated** private review path: report queue → start review → resolve → validated private audit history, with three separate trusted default-OFF switches, per-request current administrator permissions, source-pin checks and privacy controls. **No deployed production review service exists**.

The next separate milestone is **UX design**, to make the eventual administrator experience clear and testable without prematurely wiring a public UI to private data. Do not conflate a visually convincing demonstration with authorization or a live feature.

The owner has elected to keep `physicswithsirnajam/physics-vector-explorer` as our current GitHub Pages project and defer any branded-domain migration until they buy a domain. App Check web registration and genuine provider token verification have **not** been completed; don't enable App Check enforcement or student Send.

## Five new files; no edits to the live portal, server, or MCQs

1. `scripts/fixtures/grade11-admin-review-preview-v100e.template.html` — self-contained accessible, responsive navy/gold **Physics with Sir Najam** administrator UX template with clear `SYNTHETIC DEMO · NOT CONNECTED` markings. The original official logo is used, never redrawn; the template itself contains placeholder tokens but no accounts, source answers, cookies or secret credentials. It is not linked from the live portal, but source-code files may be browsable from a GitHub Pages static repository and must never hold private data.
2. `scripts/build_grade11_admin_review_preview_v100e.cjs` — builds a **standalone offline HTML file only in `qa-artifacts/admin-review-preview-v100e/`**, distributed as a downloadable GitHub Actions artifact. It embeds the exact PNG bytes from `portal/assets/physics-with-sir-najam-official-logo.png` unchanged. It picks one checked-in, metadata-only approved public MCQ source reference for each of Units **1, 2, 4, 6** from the existing 2,250-reference catalogue; it invents **four clearly fictional issue reports**, not student records or sample correct answers.
3. `scripts/test_grade11_admin_review_preview_v100e.cjs` — Playwright/Chromium desktop and mobile UI regression. Checks the official logo, counts, accessible report selection, category/ID search, status filters, simulated New → In Review → Resolved actions, note/detail/historical timeline, 320px/390px/1320px readability, reset-on-reload, safe issue-note rendering as text, and no third-party network or browser JavaScript errors.
4. `.github/workflows/validate-grade11-admin-review-preview-v100e.yml` — pinned Node 24 and Playwright Chromium, builds an artifact and captures desktop/mobile screenshots. No Firebase SDKs, real service accounts, production browser login, or network API endpoints used.
5. This scope, interpretation and review document.

## What it intentionally simulates

- **Queue**: synthetic reports with precise approved MCQ ID, unit, source question number, category, student-style issue note and stage.
- **Filtering/search**: All / New / In Review / Resolved plus text search. Selection opens a detail panel.
- **Details**: visible concern, source bank version, status, and an accessible chronological audit-style timeline.
- **Buttons**: `Start review (demo)` and `Mark resolved (demo)` update **only in-memory client-side variables**. Counts and timeline update immediately. Reload discards all changes. There is **no saved status**, no account, no actual authenticated administrator or SDK/API call.
- **Privacy**: no student name/email/UID, reviewer UID, correct option, score, real report note or private Firestore collection ever appears in the preview. Content is rendered using `textContent`, not untrusted `innerHTML`; the HTML preview explicitly disables network connections via CSP and test assertions.
- **Branding**: exact existing official logo binary bytes are embedded in the generated preview, with navy/gold/white palette. The master asset itself is unmodified.

## What it does NOT demonstrate

- Genuine administrator authorization; administrator login and role provisioning; Firebase App Check, backend/rules/IAM/Cloud Functions; encryption or operational production security; actual MCQ correction or answer-key editing; notifications; real student report submissions; persistence, cross-device sync or live Firebase updates; data retention, privacy governance or custom domain launch.
- The separate **V100-D local HTTP emulator test** is the evidence for actual backend behavior, not the V100-E static UI preview. This preview deliberately never calls those local endpoints.

## Output and review instructions

After a green GitHub Actions run, open the workflow run on the PR, scroll to **Artifacts** and download **`grade11-admin-review-ux-preview-v100e`**. Extract the archive and open `index.html` in any modern browser on a computer or mobile device. Alternatively inspect the automated `desktop.png` and `mobile.png` screenshots in the archive. No install, server, GitHub secret, Firebase Console permission or real student login is required.

Opening the preview and pressing any simulated action cannot affect the portal. The output is generated during CI, not checked in as a hosted public web page.

## Merge gate

Keep PR **Draft** until latest-head **Grade XI Synthetic Administrator Review UX Preview (V100-E)** Chromium workflow and existing **V99-U Reporting Launch Lock** both pass; if the launch-lock workflow's path trigger does not run, proactively verify source invariants or request an explicit manual run rather than invent a green result. Review the artifact screenshots and mobile behavior before owner selects **Ready for review → Merge pull request → Confirm merge**. No App Check configuration, GitHub secrets, domain or live report feature should change.

Next roadmap steps: owner feedback on the mock UX, then a separate owner-approved decision on administrator login/roles, secure public backend, App Check provider configuration and private data governance. Keep student report Send Copy-only until real security release gates are met.
