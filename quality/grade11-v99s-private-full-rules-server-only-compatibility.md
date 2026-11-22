# V99-S — Private FULL Firestore Policy Compatibility with Server-Only MCQ Review

## Why this phase follows PR #179

PR **#179 (V99-R)** merged at `e1db6d6c9223c2c413e68332ac6376341c8d29c1`. The Grade XI MCQ report intake, review queue, administrator triage and private audit history have all been extensively tested **in local emulators**, but not connected to the public student portal or deployed to real Firebase.

A critical unresolved gate is compatibility with the **owner's existing complete Firestore rules**. If a new collection policy were installed carelessly, it could break legitimate student progress, academic enrollment, privacy requests or protected lessons—or expose reports, rate-limit state or private audit logs.

## Grounding and actual policy provenance

- V99-D already established a **PRIVATE owner-supplied 227-line full Firestore policy** (SHA-256 after newline normalization: `c3d5ee6286b006510fd793cd18467493f2e7eccf3f17437182bcb0fd9d43ec39`). The user previously configured this baseline through the encrypted GitHub Actions secret `PSN_FIRESTORE_BASELINE_RULES`. The full text is **not** committed to public GitHub.
- **This is a user-provided baseline, not an independently fetched revision from Firebase Console.** Even a green V99-S emulator run cannot establish that those 227 lines are the **currently published** production Firestore rules. Before any deployment, the owner or a consented read-only connector must compare the current published rules' normalized SHA-256 to the private baseline.
- The public repository's `portal/firebase-config.js` contains browser web-app connection metadata for the existing Firebase project; it does not itself authorize reading live rules or provide a trusted admin service account. The repository does **not** contain a confirmed `firestore.rules` file or deployable `firebase.json`.

## This PR changes exactly three new files

1. `scripts/test_grade11_private_full_rules_server_only_v99s.cjs`: exclusively local Firestore Emulator test. Requires `GCLOUD_PROJECT=demo-psn-v99s-private-full-rules`, `FIRESTORE_EMULATOR_HOST=127.0.0.1:8089`, no service-account credential variable, and the private rules baseline secret. It **requires the exact 227-line SHA** and original verified-admin function plus catch-all deny, then inserts exactly **three** new match blocks **immediately before** the existing catch-all, without touching any original rule bytes:
   ```js
   match /mcqReviewReports/{documentId} { allow read, write: if false; }
   match /mcqReviewRate/{documentId} { allow read, write: if false; }
   match /mcqReviewAdminAudit/{documentId} { allow read, write: if false; }
   ```
   These are **proposed** server-only database policies, NOT deployed. They deny ALL browser reads and writes, even for `admin:true` browsers, consistent with V99-P/Q/R. Privileged future access is instead through authenticated, authorized backend Admin SDK methods; the Admin SDK bypasses browser rules, so the server must enforce independent checks.
2. `.github/workflows/validate-grade11-private-full-rules-server-only-v99s.yml`: read-only GitHub Actions job with pinned Node/Firebase emulator packages. Retrieves the already-authorized **private rule text** via its existing GitHub Actions repository secret **only during the rules test**, never as an uploaded file or console output. Missing or hash-mismatched secret is a **hard failure**—there is no synthetic replacement.
3. This quality and release-gate document.

No original practice MCQs, answers, SLOs, student scores, website, banners, report buttons, Firebase credentials, deployed rules, real students or production database records are changed.

## Actual compatibility and access tests

The V99-S script seeds **synthetic** emulator documents and tests the **complete private owner baseline plus the proposed additive three-block policy**. It checks **both ALLOW and DENY** for the portal's existing access paths:

- `users/{uid}`: verified owner profile, trusted admin bounded listing, cross-user/anonymous denial, no student role escalation.
- `academicEnrollments/{uid}`: existing verified Grade XI/FBISE self-enrollment, no paid-entitlement forging or status escalation.
- `users/{uid}/attempts/{id}`: owner-only Unit 2 practice, bounded history, no cross-user reading, no Unit 3/graded-result forging or stored-attempt editing.
- `privacyRequests/{uid}`: owner-initiated deletion requests, bounded admin listing, no arbitrary student status updates.
- `protectedLessons/{id}` and `courseLessons/{id}`: exact approved existing lesson paths remain accessible only to eligible verified enrolled students; unapproved lessons and collection listing remain denied.
- The **new three review collections**: anonymous, verified students, unverified students, forged teachers, verified admins and unverified admins ALL denied `get`, bounded/unbounded `list`, `create`, `update`, and `delete` through browser Firestore SDK.
- Unrecognized private paths remain denied. The existing student practice issue-report button remains explicitly **copy-only**.

Only synthetic case labels, totals and baseline SHA are emitted as CI evidence. Do **not** log, paste, commit or publish original private rules text, a service-account key, GitHub secret values or private student records.

## Critical limitations and release status

**V99-S is an emulator compatibility review, not production launch authorization.** A green test does NOT prove:

1. the owner's **currently published** Firebase Firestore/Storage rule revisions are equal to the owner-supplied V99-D baseline;
2. actual privileged administrator UID allowlists and trusted Auth custom claims are configured and actively monitored;
3. genuinely signed Firebase **App Check-positive** tokens are accepted by a real trusted backend; earlier positive tests were synthetic, and local emulators provide no normal App Check emulator;
4. a secure and sustainable deployed HTTPS/Callable function exists, with resource budgeting, abuse limits, request ingress controls, authorized admin operations, private logs, identity minimization and operational shutdown;
5. incident response, log integrity/retention, privacy notice, student consent, uptime/monitoring, controlled rollout and rollback procedures are approved;
6. the student-facing `Send issue report` feature or an administrator inbox is active. Both remain **not deployed**.

### Required owner-authorized future step — read only

The next production-readiness task should compare the **actual published Firestore rules** with the private 227-line owner baseline using Firebase Console **Build → Firestore Database → Rules** (do **not** publish or overwrite) or a consented Firebase read-only connector. Preserve the exact current revision privately and reconcile any drift before considering ANY rule update.

The project's exact administrator UID, service-account key, Firebase private tokens, user data or other secrets must **not** be pasted in chat or into GitHub files. Only minimal nonsecret policy provenance and test findings belong in the PR.

## Merge gate

PR must stay Draft until the latest-head workflow **Grade XI Private Full-Policy Server-Only Review Gate (V99-S)** completes green. Review that all preexisting allow/deny checks passed; all three proposed sensitive collections deny even admin-browser reads; no original rule bytes were modified; and the evidence does NOT claim current published rules were inspected. Then **Ready for review → Merge pull request → Confirm merge**.

**Merging V99-S only stores emulator test code, CI and this report. It deploys absolutely nothing.**
