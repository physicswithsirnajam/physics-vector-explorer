# V99-P — Server-only, read-only MCQ report review queue (LOCAL DEMO)

## Verified prerequisite

PR #176 (V99-O) merged into `main` on 22 November 2026 at `6e592ce4b370d257fcfb422cf836e23e2fabb932`. That phase traced real localhost HTTP requests through strict ingress, the default-OFF reporting gate, Firebase Auth Emulator identity, pinned 2,250-MCQ Grade XI references, and genuine local Firestore Admin transactions; successful App Check was explicitly **synthetic**.

V99-P builds the next half of the teacher-feedback workflow: prove that **only an explicitly designated administrator**, not a student or self-described teacher, can retrieve a small, sanitized set of synthetic reports. There is still no deployed teacher inbox or public service.

## Five new files, no existing production code modified

1. `server/local-admin-review-reader-v99p.cjs` — a strictly LOCAL, read-only function. It requires a **real Firebase Admin Auth ID token verification** (`verifyIdToken(token,true)`) from the local Auth Emulator, matching demo project/issuer, verified email, the **trusted server-side `admin:true` custom claim**, and a separately configured **server-only allowlist of exact administrator UIDs**. Merely sending `admin:true`, `role:'teacher'` or `isTeacher:true` in client JSON is never accepted. There is **no GET/HTTP/Callable route** and no credential, Firebase or browser initialization in this module. It refuses production projects, nonlocal emulator hosts and service-account credential configuration.
2. `scripts/test_grade11_admin_review_reader_v99p.cjs` — creates synthetic accounts in the **local Firebase Auth Emulator** (verified administrator, otherwise legitimate administrator not on the UID allowlist, forged "teacher", student, and unverified administrator). Proves exact allowlist, project verification and email-verification requirements, rejects tampered/forged requests, then seeds **30 synthetic Firestore report documents** referencing source records from all six units. Verifies the default 10 and maximum 25 latest-record read, no writer functions, no rate changes, exact allowlisted fields and no owner UID, email, answer, score or secret leakage.
3. `security-proposals/v99p/server-only-admin-queue-isolated.rules` — a **NEW ISOLATED TEST FIXTURE ONLY** that denies **all** direct browser Firebase SDK accesses to the report and rate collections, **including administrator browsers**. This is deliberately more restrictive than earlier V99-C exploratory admin-browser access. The allowed path is an authenticated, allowlisted **trusted Admin SDK backend** only. Do **not** deploy this incomplete test fixture in place of the owner's real full rules.
4. `.github/workflows/validate-grade11-admin-review-reader-v99p.yml` — no-secret, read-only GitHub Actions using Node 24, Java 21, pinned Firebase SDKs and the same local Auth+Firestore emulators. Uploads aggregate synthetic pass/fail labels only; never tokens, account IDs, notes or full reports.
5. This QC note.

### Scope: source-preserving and privacy-first

The review-reader response includes ONLY:
- `reportId`, `unit`, `questionId`, `sourceQuestionNumber`, `bankVersion`, `category`, `note`, `status`, `createdAtIso`.

The report is checked against the frozen original Grade XI catalog for **exact unit, question ID, source number and bank version**. Invalid or corrupted selected documents lead to a fixed safe failure; do not silently output arbitrary Firestore fields. The student note is intentionally shown to the authorized backend reader, so **future UI must escape it and enforce additional data-minimization/privacy controls**.

The snapshot displays only the **latest page up to 25**; it is not a full workflow with pagination, status updates, assignments, identity exposure, audit logs or exports. No administrator report mutation, notification or automated resolution occurs. There is no storage or read backdoor for students.

### Production boundaries not yet cleared

- A Firebase custom claim and UID allowlist are two independent controls. The trusted allowlist in this local test is synthetic and **does not establish who is authorized in the owner's real Firebase project**.
- The V99-P browser rules file is an **isolated deny-all test fixture**, not the owner's current published policy; the complete current production Firestore rules require verification and preservation before editing.
- No genuine Firebase App Check positive token has been verified in the preceding phases. Production endpoints need genuine attestation enforcement, authorization, per-admin audit logging, request and response limits, anti-abuse/resource controls, TLS/origin/CSRF/CORS decisions, secrets handling, secure operational kill switch and an explicit rollback plan.
- Do not activate the student **Send issue report** action or show an administrator inbox until a separate approved and tested release. Existing student **Copy issue report** remains unchanged.

## Merge checklist

Only merge after the latest-head `Grade XI Local Server-Only Administrator MCQ Review Reader (V99-P)` workflow is green, all five new files are inspected, and the log shows:
- verified Firebase Auth Emulator ID token and email,
- explicit ADMIN claim **and** independent trusted UID allowlist,
- default 10/max 25 sanitized reads of 30 synthetic reports,
- zero writes by the reader, and
- client SDK denial **even for admin claims** under isolated fixture.

Then manually **Ready for review → Merge pull request → Confirm merge**. No live Firebase Console settings, GitHub secrets or published site changes are needed for this test-only stage.
