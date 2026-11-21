# V99-F — Real Firestore Emulator Transactions for Grade XI MCQ Reports

## Prerequisite

PR **#166** merged as `e78095587815a1ad215f6271cd5fd798f0efe235`. Its undeployed V99-E server intake core passed offline tests for strict report shape, server-trusted identity/enrollment/approved question, idempotent receipts and account-level submission throttling. The prior V99-D complete **owner-provided** Firestore rules regression passed 91 emulator cases, but did not independently verify currently *published* production rules.

This PR verifies that the existing core can commit **real atomic Firestore Admin SDK transactions**, rather than only in-memory fakes. It does **not** create an HTTP/callable Cloud Function, real Firebase Auth ID-token verifier, production approval, user interface, teacher inbox, notifications or live database write.

## Exactly what's implemented

`server/firebase-review-emulator-v99f.cjs` is an **emulator-locked adapter** to `createIntakeService`:

- Requires **`GCLOUD_PROJECT=demo-psn-v99f-firestore`**, **`FIRESTORE_EMULATOR_HOST=127.0.0.1:8089`** and a Firestore client tied to the demo project; refuses other/missing values.
- Uses Firebase Admin SDK to look up the current learner enrollment from `academicEnrollments/{uid}`. No student-supplied grade, institution, or membership value is trusted.
- Requires an explicit, **trusted server-owned question lookup**. During this test the lookup is a local Map built from original publicly available question-bank files covering Units 1–6. This test is **not** a production-ready full 2,250-item catalog or independent scientific item certification.
- Uses an actual Firestore `runTransaction`: read both `mcqReviewReports/{deterministic-hash-id}` and `mcqReviewRate/{hashed-UID}` first, then atomically create a report and update the owner limit.
- Retains the V99-E policy of **five distinct reports per owner per UTC day** and **60 seconds between new reports**, with same owner/question/category/day duplicates returning the same receipt without consuming extra quota.
- The server, never the student, controls `ownerUid`, `status:'new'`, time, and authoritative bank version. The stored record does not contain selected answers, scores, answer keys, email or browser-declared role.
- Receipts are returned **only after the Firestore transaction commits successfully**. A simulated transaction failure must never fabricate a receipt.
- This adapter cannot open production Firestore, even if invoked elsewhere, and exports **no web endpoint**.

## Browser access protection used in the integration suite

This PR reuses the previously created **V99-C ISOLATED** report rules fixture. In the local emulator it checks:

- The real Admin SDK can create a synthetic report (server SDK bypasses browser client rules; trusted backend validations remain essential).
- A verified learner cannot read or directly write that report from the Firebase browser SDK, even if the report's owner UID matches.
- A browser role field such as `isTeacher:true` cannot grant access.
- A verified `admin:true` claim can `get` and `list` within 25, but cannot directly change status via the browser.
- No client-side Firebase Rules deployment, current production report collection creation or tenant migration occurs.

**Security caveats:** These are simulated Auth claims and server-side synthetic identities, not actual cryptographically verified Firebase ID tokens. A next PR must implement the trusted Firebase Auth verification boundary, anti-abuse/App Check decision, and a complete approved-question catalog. The *isolated fixture* does not independently prove existing production policy compatibility; see V99-D for the owner-provided full-policy regression, and reverify the actual published revision before deployment.

## Test evidence and privacy boundaries

`scripts/test_grade11_firestore_adapter_v99f.cjs` loads **six original sample MCQ references** from the public grade-11 files; synthetic enrollment records are created in the emulator. It exercises:

- Successful server-created report and owner-rate commit with an opaque receipt and no personal details in the stored report.
- Duplicate retry, cooldown, quota, new UTC day, four simultaneous duplicate attempts, bad/unverified/non-enrolled account, and unrecognized question ID.
- A rejected storage transaction that yields **no confirmation**.
- Browser Rules denied writes/reads for ordinary students and fake teacher claims, while bounded verified-admin reads pass.
- Explicit runtime rejection of mismatched project, absent localhost emulator or wrong Firestore instance.

CI runs Node 22, Java 21, pinned Admin SDK and Firebase Emulator on local demo project **only**, and saves `audit.json` and `report.md` as **`grade11-firestore-review-v99f-evidence`**. No production credentials or GitHub repository secrets are needed. The source files and artifacts contain **no real student identities or database contents**.

## What is still missing

There is **no real report sender, deployed backend, authenticated receiving endpoint, teacher dashboard or student submission confirmation** yet. The current Practice Engine report button remains **copy-only** and correctly says no report has been sent automatically.

Next narrowly scoped step: trusted Firebase Auth ID-token verification and a complete, read-only server-approved public MCQ catalog in an **emulator-only service boundary**, followed by denial, malformed-body, and anonymous/unauthorized call tests. Only after endpoint/rules/authorization and operational readiness should production activation be proposed for owner review.

## Merge gate

Leave PR #167 as Draft while the **latest-head** dedicated V99-F workflow is pending or red. Review the report artifact and no-deployment boundaries. Once green, **Ready for review → Merge pull request → Confirm merge**. Merging code does not deploy Firebase Functions or enable student report sending.
