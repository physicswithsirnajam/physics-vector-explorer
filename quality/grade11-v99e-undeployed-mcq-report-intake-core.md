# V99-E — Private MCQ Review Intake: Server-Side Core (NOT Deployed)

## Verified prerequisite and release safety

PR **#165** merged at `d466b3fc30510d0b08e09e09158cbb49a7bd900c`. Its encrypted, 227-line owner-provided Firestore baseline passed **91 complete-policy emulator access cases** with an isolated proposed `mcqReviewReports/{reportId}` block. The test did **not** confirm that this owner-provided file is the current published Firebase revision. No actual production Firestore rule has been deployed.

Prior V99-C and V99-D rules proposals make `mcqReviewReports` **admin-claim-readable with a 25-record query limit and deny ALL browser client create/update/delete**. That is intentional. A real receiving backend must perform server-side identity and authorization checks and use privileged Admin SDK transactions. **Firebase Admin SDK bypasses Firestore Security Rules**, so *the function itself* must enforce validation, rate limits, and auditability.

V99-E is **one narrow step toward that backend: a dependency-free, testable server intake CORE**. It is **not** a Firebase Cloud Function, HTTPS route, existing-site script, actual Firestore writer, teacher inbox, email/WhatsApp notification, or live report-delivery feature.

## Added server core

`server/mcq-review-intake-v99e.cjs` implements `createIntakeService` with four compulsory **trusted server adapters**:

1. `callerIdentity` — **only** a server-verified Firebase ID-token identity, including authoritative `uid` and email-verification status. **Never pass student JSON as identity.** The core cannot cryptographically verify bearer tokens by itself.
2. `enrollmentLookup(uid)` — server-owned lookup requiring active, independent Grade XI / FBISE enrollment belonging to the verified UID. Browser-supplied enrollment or class labels must never be trusted.
3. `questionLookup(id)` — server-owned approved public-practice question catalog. It verifies canonical question ID, unit, original source question number and public-practice eligibility. The authoritative bank version comes from this lookup; the client's displayed bank version is retained separately and labeled as such. No secret answer key is required or stored.
4. `runTransaction(callback)` — **an actual serializable Firestore transaction** that reads the proposed report ID and owner rate record before committing them together. The core's `commitWithinTransaction` checks duplicate reports and enforces quotas. The future adapter MUST implement atomic `getReport`, `getRate`, `createReport` and `setRate`; casual nontransactional `addDoc` is unsafe.

Proposed private backend collection paths: `mcqReviewReports/{reportId}` for server-generated reports and `mcqReviewRate/{hashedUid}` for server-controlled limits. Both are **unpublished and not written** by V99-E. The final policy will continue denying direct browser writes.

### Security and receipt controls

| Control | Core behavior |
|---|---|
| Verified identity | Reject missing, malformed or email-unverified trusted caller |
| Academic enrollment | Reject inactive, missing, mismatched or non-Grade XI/FBISE independent enrollment |
| MCQ identity | Strict V99-A allowlist and trusted question-catalog cross-check |
| Payload | Exclude client UID, email, role, status, selected answers, scores and correct option; max 500-character note |
| Deduplication | Same verified UID / question / issue type / UTC day → same server-generated opaque report ID; returning existing receipt consumes no additional quota |
| Throttle | Maximum **5 distinct reports per verified account per UTC day**, with **60 seconds between new reports**, enforced atomically in the future backend |
| Private storage fields | Owner UID, `status:'new'`, trusted server timestamp and catalog bank version—not accepted from student payload |
| Acknowledgment | Return `status:'received'` and opaque receipt only **after** the actual storage adapter confirms a committed create or recognized existing report |
| Failure | No false success if storage fails or transaction is not implemented correctly |
| Data safety | Account identity and free-text notes remain inside private report storage; receipt excludes email, UID, answers, scores and report body |

**Caveat:** The free-text report note is untrusted and may contain personal information typed by a student. A future UI must explicitly discourage personal details; teacher dashboards must escape it as text and restrict viewing to authorized staff. Plain-text cleaning is not an all-purpose content moderation or PII detector.

### This PR does *not* wire to Firebase

No Firebase CLI configuration, Cloud Functions deployment manifest, Admin SDK credentials, Firestore client write, Auth role provisioning, HTTP/callable export or public form submit button has been created. The current Practice Engine's **Copy issue report** action and its explicit **“no report has been sent automatically”** wording remain unchanged. No actual teacher notification is possible with this PR alone.

Next small stages, in order:

1. **Trusted Firebase adapter and isolated emulator integration.** Implement a Cloud Functions callable/HTTP wrapper with verified Firebase Authentication identity, optional App Check review, server-only enrollment and approved-question lookup, atomic Firestore Admin SDK transactions, explicit size validation, error mapping and denial tests. Run it only in emulator/test with no production credential. Never trust client-declared `emailVerified` or teacher/UID fields. Confirm exact project and deployed rules before deployment.
2. **Protected admin receipt/triage.** Implement admin-claim-controlled listing and server-authorized status updates with an audit trail. Only after authorization tests should a browser dashboard expose submitted notes.
3. **Opt-in student handoff.** Add a visible **Submit issue to teacher** action, meaningful privacy instructions, loading/received/failed states and copy-only fallback for signed-out users. Never display a successful receipt unless the trusted backend acknowledges it.

Deployments, live rules changes, school data access and notifications are **out of scope**. We continue one reviewed PR at a time and will obtain the owner's approval before live activation.

## Quality evidence

`scripts/test_grade11_review_server_core_v99e.cjs` runs under Node.js 22, offline, against existing genuine Grade XI public question IDs from **Units 1–6** and a serializable fake transaction adapter. It tests strict allowlists, identity/enrollment/source validation, client-displayed versus canonical bank versions, quota and cooldown edges, duplicate idempotency, concurrent duplicate attempts, and rollback on injected storage failure. It confirms no existing student-facing report UI is modified and reruns the original copy-only reporting test.

The workflow `Grade XI Undeployed MCQ Report Intake Core (V99-E)` needs **no production Firebase credentials, project selection or repository secret**. A successful CI result validates only the module's policy with fake adapters, **not** the real Firebase Admin SDK wiring, deployed server Auth, rate-limit isolation or teacher receipt.

### Release gate

Keep this PR in Draft until the **latest-head** workflow passes. Review the code and this boundary statement, then use **Ready for review → Merge pull request → Confirm merge**. This cannot activate report submission by merging alone.
