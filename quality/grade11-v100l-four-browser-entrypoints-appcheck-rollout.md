# V100-L — Four Firebase browser startup paths: preflight for real App Check

## Confirmed baseline

PR #198 (V100-K) merged into main at fa03f4d095d2fa9c85683c78fecaf508c6759cf0 on 22 November 2026. It preserved the owner's reported GitHub Pages website at https://physicswithsirnajam.github.io/physics-vector-explorer/, the existing Firebase project physics-with-sir-najam-portal, and Web App ID 1:158078442603:web:b4738a9875a1d5b1c8a52e.

The owner's 22 November observation was App Check **Unregistered**, provider **none**, Firestore App Check **not enforced**, and Authentication App Check **not enforced**. V100-K did NOT independently fetch the latest Firebase API status. No one should repeat the same basic owner question unnecessarily or treat the dated observation as live API verification.

The older V99-W source inventory described only **three** Firebase app entrypoint modules. Actual inspection of the repository has now located a **fourth** module — portal/secure-lesson.js — and its own portal/secure-lesson.html entry page. The inventory must account for all four before any future provider integration.

## Existing separate startup paths

| Browser entry page | Actual Firebase initializer module | Protected user functionality |
|---|---|---|
| portal/index.html | portal/app.js | Student sign-in, verified profiles, enrollment and saved progress |
| practice-engine/index.html | portal/attempt-sync.js | Optional user-initiated saved practice results |
| portal/course-lesson.html | portal/course-lesson.js | Firebase Auth + Firestore courseLessons resources |
| portal/secure-lesson.html | portal/secure-lesson.js | Firebase Auth + Firestore protectedLessons pilot |

All four browser initializer modules currently import Firebase Web SDK **13.1.0**, Auth, Firestore and the common public firebase-config.js, but they use **different initialization patterns**. The practice saving module has getApps/getApp reuse and a possible initializeApp fallback. These modules each execute in their own browser documents; App Check initialization on one page cannot be assumed to cover the other documents.

Also tracked: portal/academic-enrollment.js is an auxiliary Firestore consumer imported by portal/app.js, receiving a database instance from the portal. It is **not** a fifth independent Firebase initializer.

## Exactly four new files; no existing browser code edited

1. scripts/audit_grade11_appcheck_browser_entrypoints_v100l.cjs — compares four real HTML script links with four source initializers and exact Firebase SDK version; scans browser JavaScript for an unexpected fifth initializer; checks the shared enrollment consumer, V100-K dated observation and V99-U Copy-only reporting lock.
2. scripts/test_grade11_appcheck_browser_entrypoints_v100l.cjs — offline mutation tests against wrong links, changed SDK versions, missing initializers, new unexpected initializer, premature provider/debug code, wrong config, changed CNAME and student Send drift.
3. .github/workflows/validate-grade11-appcheck-entrypoints-v100l.yml — read-only Node 24 CI, no real Firebase project call, no App Check keys, secrets or deployment. Uploads a nonsecret source-inventory.json.
4. This owner review note.

The check is purposely strict about exact source-bound module wiring. Any future legitimate client refactor or provider addition requires a distinct reviewed PR updating the source inventory and appropriate regression tests.

## Future owner-approved App Check rollout — separate milestones

**Step A — confirm hosting context:** Reuse the already-reported GitHub Pages domain physicswithsirnajam.github.io, check the actual Grade XI sign-in page URL and any Google Sites embedding or iframe origin. Do not use the Firebase authDomain as the reCAPTCHA Enterprise allowed-hostname assumption. Before replacing Pages with a purchased domain, reassess the browser origin and provider key allowlist.

**Step B — prepare legitimate provider registration:** Only in a separately authorized step, review an appropriately host-scoped reCAPTCHA Enterprise web key, Firebase Console web app ID, provider settings and any costs. No registration, key provisioning, relaxed verification or localhost in a production website key in V100-L.

**Step C — separately implement and test real browser startup:** After a genuine provider/key exists and owner approval, implement initializeAppCheck with ReCaptchaEnterpriseProvider and token auto-refresh **before accessing Firebase services in every affected browser entrypoint**. Include tests for email/password and Google sign-in, saved practice, account profile/enrollment, protected lesson loads and sign-out; preserve existing content and branding. Do not activate the debug provider on live Pages.

**Step D — monitor legitimate traffic before enforcement:** Firebase advises reviewing Verified and Unverified/Outdated App Check metrics per Firebase API before enabling enforcement; enforcement would reject unverified requests. Student login, progress and protected lessons must remain available, so do not enforce Firestore or Authentication in V100-L.

**Step E — separate real reporting release:** Signed positive non-debug provider proof, actual server-side authorization and App Check checks, rate limiting, private audit, production infrastructure, owner privacy/retention and operations approval are prerequisites. App Check alone cannot authorize a teacher. Student reporting must remain Copy only until a distinct reviewed launch PR.

Official Firebase references (externally verified 22 November 2026):
- https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider
- https://firebase.google.com/docs/app-check/monitor-metrics
- https://firebase.google.com/docs/app-check/enable-enforcement
- https://firebase.google.com/docs/app-check/web/debug-provider

## Unchanged safety boundaries and merge gate

No edits to existing public portal or practice HTML/JS, original Physics with Sir Najam logo, 2,250 public Grade XI MCQ references, original MCQ answers, live Firestore rules, Firebase Auth, App Check registration/enforcement, student accounts, administrator privileges, report intake, private backend, GitHub Pages or custom domain/DNS. The Review Desk remains an offline, fictional artifact; student issue reports still **Copy only**. No genuine App Check provider token has been positively verified.

Keep the PR **Draft** until both the exact latest-head **Grade XI App Check Four-Entrypoint Readiness Map (V100-L)** and existing **V99-U App Check Reporting Launch Lock** report SUCCESS. Review four additions and the nonsecret source inventory. Then owner alone chooses Ready for review → Merge pull request → Confirm merge.

No Firebase Console action, key, secret, owner CLI, payment, site deployment or domain purchase needed for this PR.
