# V99-O — Full localhost HTTP → Auth Emulator → Firestore Emulator MCQ report trace

## Prerequisite

PR #175 (V99-N) merged into main at `fa5ff2746977375072379dc2eb1fda3af925541b` after the streamed-upload HTTP 413 mapping fix. PR #174 (V99-M) already added a local trusted fail-closed default-OFF switch, and PRs #168–171 established token verification, pinned original public question references and genuine local Firestore Admin transactions separately.

**This PR is a two-file test-only integration** of existing code, with this quality note as a third new file. There is **no new application endpoint**.

## What this increment verifies

`scripts/test_grade11_full_local_http_to_firestore_v99o.cjs` uses the existing fixed local-only `startLocalReviewHttpRehearsal` helper and routes real Node HTTP requests to the existing `createLocalSwitchableReviewGate` pipeline:

1. Exactly `127.0.0.1` on a temporary OS-chosen port, allowed only when `PSN_LOCAL_HTTP_REHEARSAL=enabled-local-test-only`, `GCLOUD_PROJECT=demo-psn-v99f-firestore`, loopback Auth and Firestore emulator hosts, and **no** service-account credentials.
2. The original **2,250 checked-in Grade XI public MCQ reference IDs** are projected strictly from the V99-I static JSON. It never loads the browser's question bank at request time and never includes options or answers.
3. The trusted server switch starts **OFF**, returning 503 before App Check/Auth or Firestore processing, including after later disablement. A client-supplied field cannot activate it.
4. A synthetic Firebase Auth Emulator student obtains a **real local emulator-issued ID token**, rejected until email verified and a trusted Grade XI `academicEnrollments/{uid}` record exists.
5. With the switch explicitly enabled in the **test process**, one original Unit 5 master MCQ report is stored using the **real Firebase Admin Firestore SDK transaction**, atomically writing the report and rate entry. Only source metadata and allowlisted report fields are saved; no email, grade score or answer key. The HTTP response contains only a safe receipt.
6. Duplicate reports are idempotent; a different Unit 3 source ID enforces the server's 60-second cooldown before the next report.
7. An oversized **streamed/chunked** upload and multibyte UTF-8 over-limit upload return HTTP **413**, *before* App Check or Firestore. Wrong method/origin, forged client owner, unapproved question and bad bearer token are denied.
8. A **real Admin App Check SDK** rejects a malformed token over HTTP, even while the synthetic report service is enabled; no Firestore write follows.

### The essential limitation

**Successful App Check proof remains a clearly labelled SYNTHETIC callback.** The standard Firebase Local Emulator Suite has no App Check emulator. A real positive signed Firebase App Check token and genuine app attestation have **not** been tested in this PR. Nothing here authorizes deployment or a student Send button. No real Firebase credentials, student accounts or reports exist in the CI test.

## Changes — only three new files

- `scripts/test_grade11_full_local_http_to_firestore_v99o.cjs`
- `.github/workflows/validate-grade11-full-local-http-firestore-v99o.yml`
- `quality/grade11-v99o-full-local-http-to-firestore-trace.md` (this note)

No modifications to existing web code, simulations, branding, original questions/answers, enrollment data, currently published Firestore Security Rules, Firebase project settings, student issue-copy control, notifications, teacher inbox, or production deployment.

## Why this matters

Prior checks proved the HTTP boundary and the Firebase pipeline separately. This test traces them through the **same request path** and catches mismatched response contracts, security regressions, malformed client payloads and possible bypasses between otherwise independently tested modules.

A green emulator test still does **not** establish production readiness. The remaining release gates include genuine owner-approved App Check token acceptance, current deployed rules + privileged teacher read authorization, production host/TLS/CORS/CSRF/abuse controls and costs, clear student privacy expectations, operational reporting inbox, monitoring and documented rollback/disable strategy.

## Merge gate

Keep the PR draft until the **latest-head** `Grade XI Full Local HTTP-to-Firestore Review Trace (V99-O)` check is green. Inspect the regression log, confirm 2,250 pinned source records and genuine **local** Firebase Auth/Firestore, and confirm App Check success was synthetic only. Then select **Ready for review → Merge pull request → Confirm merge**. No Firebase Console changes or new GitHub secrets are necessary.
