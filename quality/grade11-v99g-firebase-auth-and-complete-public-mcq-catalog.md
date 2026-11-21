# V99-G — Genuine Firebase Authentication Verification and Full Public MCQ Reference Lookup

## Verified prerequisite

PR **#167** merged into main at `10676d2626778aea723f2aefb0ef21b5e3d42221`. In that PR the **real Firestore Admin SDK** successfully committed synthetic MCQ reports and per-owner rate records in atomic transactions inside a local emulator, with duplicate protection, quota limits, and browser privacy rules. **There is still no deployed function, live student report submission, teacher dashboard, or production Firestore rule change**.

V99-G addresses the next two missing pieces, **without deploying**:

1. Authenticate incoming identities through **real Firebase Admin SDK token verification against the local Firebase Authentication Emulator**, not caller-supplied `uid`, `emailVerified`, or `isTeacher`.
2. Look up every approved question reference in the **actual original Grade XI V55 public self-practice bank**, covering 2,250 MCQs and original master-source IDs, rather than the previous six representative samples.

## 1. Strict verified-token boundary, still not a network endpoint

`server/verified-report-boundary-v99g.cjs` exposes `createVerifiedReviewBoundary`, a pure request handler factory. A future **trusted HTTPS/Callable function** must pass a server-owned Firebase Admin `verifyIdToken` function and the existing trusted intake service to it.

The boundary:
- Accepts only a Bearer ID token plus report `draft`. Rejects extra envelope fields such as `uid`, `admin`, `emailVerified`, or `callerIdentity`.
- Requests `verifyIdToken(token, true)` with revocation checking; refuses verification failure, missing/invalid subject, project audience or issuer mismatch, and unverified email.
- Creates the `callerIdentity` itself **solely from the returned verified token**. It forwards only the verified UID and email-verified state to V99-E, not any teacher/admin browser claim.
- Does not log a token, create a server, import Firebase credentials, expose a URL, or claim to authenticate production students. Admin SDK verification against the emulator is a genuine SDK check on **emulator-issued** tokens; production token issuance and revocation management are different operational concerns.
- Still requires anti-abuse measures, explicit trusted project configuration, server resource controls, App Check strategy, and deployment review before public activation.

## 2. Full current 2,250-item catalog

`server/approved-practice-catalog-v99g.cjs` reads and validates the repository-controlled V55 central bank adapter with a **source-local, restricted read shim**—never a network request or user-selected path. This is source-build/test logic, **not a production request-time runtime pattern**.

| Unit | Existing public MCQs |
|---|---:|
| 1 — Physical Quantities and Measurements | 275 |
| 2 — Vectors | 206 |
| 3 — Translatory Motion | 220 |
| 4 — Rotational and Circular Motion | 640 |
| 5 — Work and Energy | 349 |
| 6 — Fluid Mechanics, Topics 6.1–6.7 | 560 |
| **Total** | **2,250** |

The browser adapter already verifies question count, active status, four options, source/scenario consistency and original practice status. The server reader **rejects duplicates, malformed source references and any count change**. Its lookup projects only `id`, `unit`, `sourceQuestionNumber`, `bankVersion`, and `publicPractice:true`—not question stems, choices, correct answers, explanations, student grades or identities.

**Important compatibility correction:** V99-A initially accepted only `XI-U0N-…` / `U0N-…` IDs. The V55 public bank legitimately includes original lower-case `g11-u03-master-…`, `g11-u04-master-…`, and `g11-u05-master-…` IDs. The shared contract now accepts those three **source-true** prefixes only when they match the declared unit, while rejecting fabricated units. This does **not** alter any MCQ, answer key, academic status, source URL, or branding.

**Security caution:** Node's `vm` is **not** a security boundary for untrusted JavaScript. This parser must run only on repository-reviewed, checked-in adapter code and cannot ingest user-supplied scripts. **Before production deployment**, generate, review, and version a **static, metadata-only catalog artifact** so no request-time execution of the browser adapter is needed. Academic correctness and FBISE SLO mapping are not certified by source-reference validation.

## What CI actually tests

The `Grade XI Firebase Auth and Complete Public MCQ Catalog (V99-G)` workflow uses **Node 24**, Java 21 and a pinned local Auth Emulator at `127.0.0.1:9099` with project `demo-psn-v99g-auth-catalog`.

- Imports the real **2,250 public practice MCQs**, including compressed source-archived portions of Units 3 and 4, and validates each ID through the strict report contract. Confirms every lookup returns **only** non-sensitive source metadata.
- Registers a **synthetic** Firebase Auth Emulator user, confirms a real Admin SDK verification still rejects an unverified account, marks the dummy account email-verified inside the emulator, obtains a refreshed actual emulator token and verifies it through Admin SDK before accepting a source-backed report in an in-memory intake service.
- Denies malformed/missing/altered tokens, client-selected `uid`, `admin`, `emailVerified`, `callerIdentity`, invalid project audience/subject and failed/revoked verification checks.
- Rechecks V99-E's report drafting, source lookup, duplicate handling and refusal of forged report owner/status fields.
- Saves only synthetic counts and test outcomes to `grade11-auth-approved-catalog-v99g-evidence`. It does **not** store bearer tokens, email addresses, decrypted credentials, source answer keys, private lesson materials or student records in artifacts.

## Exact safety boundary

This PR adds two server/testing modules, a local Auth emulator configuration, one focused workflow, one test suite, this document, and a narrow V99-A source-ID compatibility correction.

**It does not add** a live Firebase Cloud Function, server deployment manifest, public report POST endpoint, a real Auth token verifier connected to production, report notifications, an admin inbox, Firestore client permissions, student data queries, new saved results, or any student-facing submit button. V99-F's Admin SDK real Firestore integration and V99-D's complete owner-supplied Firestore rules tests are separate, already merged stages.

The current **Copy issue report** workflow remains accurate: no issue is sent automatically.

## Next incremental stage

Once V99-G passes, create a **reviewable static catalog artifact and local callable/HTTP emulator boundary** combining the existing verified-token, approved-question and real Firestore-transaction adapters. Test malformed requests, denial under wrong Firebase project, App Check/anti-abuse, sender acknowledgment and failure rollback. Before ANY live rules deployment or student UI change, independently verify the currently published Firestore rules against the owner-provided policy and confirm production operational controls.

Merge only after latest-head workflow is green and reviewed; then **Ready for review → Merge pull request → Confirm merge**. No additional GitHub secrets or Firebase Console settings are required for V99-G.
