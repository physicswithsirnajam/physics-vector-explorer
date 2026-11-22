# V99-R — Local, read-only administrator review audit history

## Verified prerequisite

PR #178 (V99-Q) merged into `main` at `663a02b887cbbc7604e3a74de1b73e2afbbfe201`. It tested a server-only, authenticated, default-OFF local Firebase report triage workflow: `new → in-review → resolved`, with an **atomic, private audit document** for each real change, no reopens and no direct browser writes. PR #177 established a separate read-only administrator report queue.

This PR adds a **local-only read view of the private audit history**, not a public site endpoint or a deployed teacher dashboard.

## Exactly four new files

1. `server/local-admin-audit-history-v99r.cjs` — a read-only service that starts **OFF**. Requires a real LOCAL Firebase Auth Emulator-issued token verified with `verifyIdToken(token,true)`, verified email, the trusted `admin:true` claim, and an independent immutable **server-controlled exact UID allowlist**. Refuses non-demo projects, missing loopback emulator hosts, service credentials, unsolicited request fields and arbitrary document IDs. No public route, browser SDK, Cloud Function or Firebase initialization is added.
2. `scripts/test_grade11_admin_audit_history_v99r.cjs` — real local Admin SDK verification of synthetic accounts and real read-only Firestore transactions, using the existing V99-Q writer to create genuine **local** audit documents. Tests no-history `new`, one-event `in-review`, two-event `resolved`, duplicates, role/allowlist violations, malformed reports, corrupted/missing/reordered audit data, OFF switch, backend exception redaction and isolated browser denials.
3. `.github/workflows/validate-grade11-admin-audit-history-v99r.yml` — Node 24, Java 21, pinned Firebase SDKs, **only** local Auth+Firestore emulators, read-only GitHub permissions, no service account. Uploads aggregate synthetic quality labels only.
4. This review note.

## Exact reader security and integrity contract

The request contains **only** `authorization` (Firebase Auth bearer token) and one strict `reportId`. The server computes **both** original V99-Q deterministic audit IDs itself, then issues a **read-only Firestore Admin transaction** to obtain the report and those two known audit documents together in one consistent snapshot. This does not expose arbitrary Firestore filters, allow client-selected paths, create audit records, or update a report.

Before showing anything, the reader checks the report's immutable source metadata against the pinned **2,250 Grade XI public MCQ references** and verifies:

- **New**: no audit events; no review-update timestamp.
- **In Review**: exactly one authentic `new → in-review` event, with the report's update time matching that audit event.
- **Resolved**: exactly two authentic, ordered events: `new → in-review` and `in-review → resolved`, with the report's update time matching the second event.
- Each audit event's exact fields, action, transition, report ID, trusted reviewer UID *format*, timestamp and relation to original report creation must be valid. A missing, forged, altered, extra-field or time-reversed event causes an allowlisted safe error, not a fabricated partial timeline.

The response returns ONLY `ok`, `reportId`, the approved `questionId`, the report's `status`, and a maximum **two** events containing `action`, `fromStatus`, `toStatus` and `reviewedAtIso`. It **never** returns the reviewer UID, student owner UID, report note, email, scores, answers, unrecognized fields, raw Firestore exceptions, or bearer token. This is deliberately more private than a full administrator forensic export; trusted internal audit documents retain the reviewer UID.

## Limitations and future work

- **Test-only and OFF by default.** Real owner administrator UIDs and custom claims have **not** been configured. Firebase Auth tokens in this CI are issued by the **local emulator**, not by the real production project.
- The Admin Firestore SDK bypasses browser Security Rules; the server checks role, email, allowlist and project independently. The test reuses V99-Q's **isolated deny-all browser rules fixture**, which is NOT a replacement for the user's existing published rules and must not be deployed.
- The reader detects inconsistent or unexpectedly altered records but does **not** cryptographically prevent a privileged administrator with direct server credentials from tampering with Firestore history. Actual immutable/auditable production logs, retention policies, operational monitoring and admin action attribution are separate release gates.
- No genuine Firebase App Check-positive verification, replay protection, hosted TLS/CORS/CSRF review, teacher inbox UI, student "Send issue report", production rules changes, Firebase settings, secret changes, or deployed function are included.
- There are **no modifications** to original MCQs, options, answer keys, notes, SLOs, practice tests, grades, graphics or the current **Copy issue report** interface.

## Merge gate

Keep Draft until latest-head `Grade XI Local Authorized Admin Audit History (V99-R)` is GREEN and the four-file diff is inspected. Verify that the audit timeline matches the real local V99-Q transitions, all unauthorized roles and forged history are rejected, default-OFF remains in place, and no browser can access the private collection directly. Only then **Ready for review → Merge pull request → Confirm merge**.

The next separate stage can cover production readiness (actual published rules, genuine App Check, trusted administrator configuration, logging, rollout and rollback), but **no live student reporting or admin inbox should be enabled automatically**.
