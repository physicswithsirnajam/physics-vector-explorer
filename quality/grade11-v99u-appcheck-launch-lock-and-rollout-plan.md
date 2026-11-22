# V99-U — App Check readiness and production MCQ report launch lock

## Verified prerequisite and scope

PR #181 (V99-T) merged into `main` as `3f331d1e67cda249e6c61e32dd3a2bb20045c077`. The owner-copied published Firestore Rules snapshot was compared PRIVATELY with the prior 227-line baseline; both supplied copies matched after newline normalization. This is owner-attested copy equivalence, **not a Firebase API live-read guarantee**. V99-S already passed 213 local emulator access-policy checks. Other V99-J through R local tests proved HTTP, Firebase Auth Emulator, Firestore Admin transactions, trusted admin review and audit-flow safety, but successful App Check responses were SYNTHETIC, not real attestation.

**V99-U is a fail-closed source regression guard and rollout plan, not a live App Check activation.** Its purpose is to prevent an accidental student Send/reporting endpoint from being added while genuine Firebase App Check acceptance and owner-controlled production infrastructure are still missing.

## Exactly four new files; no existing files edited

1. `scripts/audit_grade11_reporting_launch_lock_v99u.cjs`: checks Git-tracked source and known App Check/reporting code boundaries, with **no network access**. Verifies current student `Copy issue report` controls and explicit “no report has been sent” wording, that the report-handoff function has no direct sender, existing V99-K body size and App Check proof requirement, V99-L real SDK method and emulator restriction, V99-M default OFF, V99-N ephemeral loopback-only HTTP rehearsal, and V99-Q/R administrator transition/history default OFF. Also flags new Firebase deployment manifests/cloud backend paths, Cloud deployment commands in tracked workflows and App Check **debug-token provider** in tracked public browser JS/HTML. A later legitimate release PR would need a deliberate security-reviewed change to this launch lock; copying an arbitrary ready-state file is not enough.
2. `scripts/test_grade11_reporting_launch_lock_v99u.cjs`: wholly synthetic mutations against the real repository source inventory: fake delivery wording, a browser POST in the report handler, removed copy callback, changed App Check verifyToken call, non-demo project, switch enabled by default, changed localhost opt-in, new Firebase deploy manifest/cloud function, debug token in public JS, unauthorized "release approval" artifact, mismatched public project and other intentional regressions. Checks each is rejected.
3. `.github/workflows/validate-grade11-reporting-launch-lock-v99u.yml`: read-only Node 24 GitHub Actions, no Firebase SDK, no service-account or other secrets, no network except checkout/Node Actions, no Firebase deploy. Runs on future relevant source and workflow changes; artifact contains only check counts and explicit NOT-VERIFIED production fields.
4. This document.

### Critical limitations

- A static GitHub repository guard is **not** comprehensive security verification, cannot detect changes outside inspected code patterns or live Firebase Console configuration, and cannot prevent an authorized person from disabling/modifying this workflow. Future branch protection and required-check policies must be reviewed separately with owner approval. GitHub Pages deployment itself remains unchanged.
- The script records `genuineSignedAppCheckPositiveVerified:false`, `productionAdminAllowlistConfigured:false`, `productionReportingEndpointDeployed:false`, `safeToEnableStudentReporting:false`. These are **known missing release evidence**, not findings made by calling production Firebase.
- Existing developer/historical documentation containing synthetic test tokens is not a production credential. No actual Firebase App Check debug token should be published or stored in this repo or the student app.
- The real Firebase Auth/custom claims model, token replay decisions, resource rate limits and admin actions require **server-side** authorization; client-side checks and App Check alone are insufficient.
- No student messages/reports are sent, received, read or altered; no teacher dashboard, service credentials, Firebase production rules or existing MCQs/answer keys are modified.

## Owner review — App Check rollout prerequisites (separate, future work)

**Do not enable App Check enforcement for the live Firestore/Authentication APIs until current portal login, progress, enrollment and other backend operations have been validated in a non-disruptive staging/monitoring setup.** An incorrect enforcement toggle could block existing students even if the MCQ reporting feature remains disabled.

1. **Confirm the actual browser origins.** The web app is deployed on GitHub Pages, potentially accessed through a separate Google Sites Student Hub/embed. Confirm which **hostname and top-level browser origin** actually executes the Firebase Web SDK: embedded frames and external sites may not behave identically. Check the registered Firebase **web app ID** and authorized provider domain(s), but do not invent origins or turn on enforcement.
2. **Choose a web App Check provider** for a separate approved stage. Firebase documents `ReCaptchaEnterpriseProvider` with `initializeAppCheck`, token auto-refresh and a site key for legitimate browser runs. This stage DOES NOT add that code or a site key. A key's permitted hostnames, allowed domains, score/threshold considerations, and impact on website embeds require owner testing.
3. **Test genuine positive and negative attestation** with a nonpublic backend under an owner-approved, trusted Firebase project environment. Verify the *real* Firebase Admin SDK accepts a genuine, unexpired App Check token for the configured web-app ID and rejects malformed, expired, foreign-project and unregistered-app tokens. Capture only **redacted success/failure evidence**, never the actual token, credentials or student account.
4. **Keep authentication separate.** A valid App Check proof indicates the request originated from a registered app; it does not authorize a student or an administrator. Require real Auth ID token, verified email, Grade XI enrollment, pinned original MCQ reference, per-account rate budget, trusted admin role/UID allowlist, server-set timestamps, audit log and default-OFF status.
5. **Decide replay protection separately.** Existing V99-L uses `verifyToken(token,{consume:false})`; that is ordinary multi-use App Check validation and **does not provide one-time replay protection**. Firebase documents `consume:true` for replay protection with limited-use tokens and additional backend cost/permissions. Never label it as already enabled.
6. **Approve operation and rollback:** TLS endpoint/hosting, consent and privacy text for notes, teacher inbox permissions, cost caps and server rate limits, data retention, failure modes, monitoring, revocation, emergency network shutdown and an owner-approved rollback. Only then may a distinct controlled release PR consider adding a student **Send issue report** option.

### Official documentation (current source references)

- [Firebase — Get started using App Check with reCAPTCHA Enterprise in web apps](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider)
- [Firebase — Protect custom backend resources with App Check in web apps](https://firebase.google.com/docs/app-check/web/custom-resource)
- [Firebase — Verify App Check tokens from a custom backend](https://firebase.google.com/docs/app-check/custom-resource-backend)
- [Firebase — App Check web debug provider](https://firebase.google.com/docs/app-check/web/debug-provider)

## Merge gate

This PR is test-only. Keep DRAFT until the latest-head `Grade XI App Check Reporting Launch Lock (V99-U)` workflow succeeds and the four-file diff is reviewed. The artifact should explicitly show `safeToEnableStudentReporting:false`, `genuineSignedAppCheckPositiveVerified:false` and `studentReportInterface:COPY_ONLY`. Then **Ready for review → Merge pull request → Confirm merge**.

No Firebase Console changes, GitHub secrets, App Check debug token, provider registration, web-app reload or live backend deploy are required for this phase.
