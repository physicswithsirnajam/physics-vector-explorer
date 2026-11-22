# V99-K — Offline request-shape, App Check interface and safe-error contract

## Prerequisite and purpose

PR #171 (V99-J) merged at `340451a4c8c9d858bc0e61b6ce7bf00c50771918`. That phase showed that a synthetic learner's **real local Firebase Auth Emulator token**, approved Grade XI enrollment, pinned original 2,250-question lookup and **real Firestore Admin SDK transactions** work end to end in the local test project.

V99-K adds a **separate, dependency-free request-preflight contract** for future review only. It does **not** create an HTTPS route, Cloud Function or live reporting facility.

## Exactly four new files

1. `server/offline-review-request-gate-v99k.cjs`: offline function accepting only six primitives extracted by a **future trusted transport adapter**: method, route label, Content-Type, bearer authorization, App Check token, and raw JSON body string. Enforces POST, fixed design route, `application/json` with optional UTF-8, a **4,096-byte body maximum**, bounded token syntax, a valid exact Grade XI report contract and no unexpected fields. It requires a separately trusted App Check token verifier and fixed allowlist of app IDs; refuses missing, failed or mismatched App Check proof **before** calling the existing verified Firebase ID-token handler.
2. `scripts/test_grade11_offline_review_request_gate_v99k.cjs`: Node-only tests with **explicitly synthetic**, injected App Check and Firebase Auth verifier stand-ins. They do not establish cryptographic validity. Tests accepted/sanitized receipts, forged identity and report fields, invalid JSON, oversized bodies, malformed tokens, prohibited app IDs, missing verification, rate/authorization error codes, and storage error redaction.
3. `.github/workflows/validate-grade11-offline-request-gate-v99k.yml`: read-only Node 24 CI with **no Firebase install, emulator, secret, database, user or deployment access**.
4. This document.

No existing user portal, branding, MCQ, question key, grade, teacher inbox, enrollment, student-facing button, published rules, Cloud Function, Firebase Auth/App Check settings or report data is modified.

## Trust model — what this test is AND is not

- **Not a working production App Check integration.** The test's App Check verifier is a stub returning a synthetic `appId`, solely to exercise callback behavior and denial logic. A real deployment must use trusted server-side SDK verification against actual Firebase App Check token signatures/issuer/audience, and bind valid app IDs to the owner's Firebase project.
- **Not a registered HTTP path.** The value `/api/grade11/mcq-review` is a design-only label. No listener/route is created. Real HTTP adapters must enforce limits **during reading** the request body (not just after the full body is buffered), TLS, allowed methods, origin/CORS and CSRF policies as appropriate, transport authentication, appropriate infrastructure-level protection, and secrets management.
- App Check and Authentication are **separate controls**. A valid app proof does not identify an authorized student; V99-G/V99-J must continue independently verifying the Firebase Auth ID token with revocation checking, verified email and active Grade XI enrollment.
- Strict field rules prevent browser-supplied UID, teacher roles, admin status and keys from being forwarded. Unknown internal exceptions are projected to a fixed 503 response, not raw Firebase errors, stack traces or credentials.
- Existing report duplicate/quota/cooldown transaction rules remain server-owned and are already tested in V99-E/F/J. The offline gate **does not** implement IP-based throttling, replay protection for App Check, production anti-abuse, client-side UI or a live network boundary.
- This stage does **not** certify the academic correctness of the public practice bank. Its source mappings are unchanged.

## Response contract (synthetic test only)

Success: a small object holding `ok`, `status`, the sanitized `receiptId`, and `alreadyReceived`. All other backend fields cause a safe failure.

Errors: a fixed, allowlisted `code` and numeric `statusCode`. Validated errors include missing authorization, missing App Check, unenrolled learner, invalid draft, unknown public MCQ, daily quota, cooldown and generic unavailable. No request text, token, raw database exception, record owner or stack trace appears in the result.

## Merge and future deployment gate

Keep the PR **Draft** until the exact latest-head `Grade XI Offline Request Shape and Privacy Gate (V99-K)` workflow is green and the source diff has been inspected. Then use **Ready for review → Merge pull request → Confirm merge**.

Before ANY actual web endpoint or student Send action, separately review and test **real Firebase Admin App Check SDK verification**, deployment configuration, resource/abuse budgets, current production rules against the owner-supplied policy, UI consent, administrator inbox/triage, testing, monitoring and an explicit rollback/disable plan. The next incremental PR may cover a **local-only proof-of-verification adapter/test**; it must not pretend synthetic App Check checks are authentic.
