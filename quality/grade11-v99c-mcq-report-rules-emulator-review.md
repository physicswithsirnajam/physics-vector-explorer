# V99-C — Report Intake: Isolated Firestore Emulator Test, Not a Live Rules Change

## Basis: the two Firestore Rules files provided on 21 November 2026

The owner supplied two `.txt` files containing the same 227 lines of Firestore Rules text with different newline encodings (LF and CRLF). The comments identify the file as Physics with Sir Najam Portal V17 rules, with V18 practice-save behavior. **No connector has independently retrieved the published version from Firebase.** The code was inspected as an owner-provided *candidate current policy*, not asserted to be deployed.

Source-review summary:

| Existing policy path | Owner-provided rules |
|---|---|
| `users/{userId}` | Email-verified owner may read/create/update only a minimal profile; verified server-claim admin may read/list up to 25; no delete |
| `users/{userId}/attempts/{attemptId}` | Verified owner can get and bounded-list up to 25; create only with active Grade XI enrollment and strict top-level schema for Unit 1 or 2; update/delete denied |
| `privacyRequests/{userId}` | Verified owner can create one pending account-deletion request; owner/admin reads, admin list at most 25; browser updates/deletes denied |
| `academicEnrollments/{userId}` | Verified user can create their own active, independent Grade XI/FBISE pilot enrollment once; no list or update/delete |
| `protectedLessons/{lessonId}` | Exactly the named Unit 1 access pilot allowed with eligible verified enrollment; other reads and all client writes denied |
| `courseLessons/{lessonId}` | Only three reviewed, published Grade XI/FBISE enrollment-gated lessons are individually readable; no listing or browser edits |
| Catch-all `/{document=**}` | `allow read, write: if false` |
| **Future `mcqReviewReports/{id}`** | No explicit match; therefore denied to web/mobile clients by the catch-all |

The policy is restrictive on its face, but a **source review does not establish that the copy is deployed, mathematically safe under every Firestore rule evaluation, or that other services (Storage, Auth, Cloud Functions) are secured**. The active pilot enrollment is intentionally self-created by a verified learner, **not** administrator-approved membership or paid access. Client-side practice scores remain **self-reported**, not authoritative exam marks.

## Why this PR is deliberately isolated and non-deployable

This PR does **not publish or repackage the owner's entire ruleset** in a public GitHub repository. Instead, it contains **one synthetic, isolated rules fixture** at:

`security-proposals/v99c/mcq-review-isolated.rules`

It tests only a proposed path, with the same trusted-admin definition the owner-provided policy uses:

```javascript
match /mcqReviewReports/{reportId} {
  allow get: if verifiedAdmin();
  allow list: if verifiedAdmin()
    && request.query.limit != null
    && request.query.limit <= 25;
  allow create, update, delete: if false;
}
```

`verifiedAdmin()` requires **both** `email_verified == true` and a **trusted, server-assigned** `admin == true` custom authentication claim.

The policy would permit a verified, claim-authorized administrator to **read a report queue of at most 25 records per query**, if a trusted server later created such reports. It would forbid **all browser clients**, including the administrator, from directly creating/changing/deleting report records. Teacher status updates must eventually be performed by a trusted server endpoint, with server-side identity checks, rate limiting and an audit trail. A standalone teacher-role system is **not yet provisioned**; do not confuse a browser flag with a trusted claim.

**This is NOT a working student submission mechanism.** The Practice Engine must continue to say that issue reports are copyable and **not automatically sent**. A future opt-in report submission should pass validated data to a trusted backend, which verifies the Firebase ID token, question reference, per-account authorization and abuse controls, adds the report owner and creation timestamp and only then returns a real receipt. Firebase Admin SDK server requests bypass Firestore client security rules, so the backend must independently enforce validation. <https://firebase.google.com/docs/firestore/security/rules-structure>

## GitHub CI emulator test

The `V99-C` workflow uses **only**:

- Demo Firebase project ID: `demo-psn-v99c-review` (never the production project identifier).
- Local Firestore emulator address: `127.0.0.1:8089`.
- Node 22, Java 21 and pinned Firebase emulator/testing dependencies.
- `security-proposals/v99c/emulator-only.json`, which deliberately has **NO `firestore.rules` deployment configuration**.
- A synthetic seeded report without any real student data.

`scripts/test_grade11_mcq_report_rules_emulator_v99c.cjs` checks anonymous access, verified student A/B, unverified student, browser-role spoof, unverified `admin:true` claim and verified server-claim admin. It tests get/list/create/update/delete, admin query bounds, and unrelated default-deny paths. Its generated evidence is `qa-artifacts/mcq-review-rules-v99c/report.md` and `audit.json`, archived as `grade11-mcq-report-rules-v99c-evidence`.

**Essential limitation:** This **isolated** emulator suite does not load the owner's existing complete rules, so it does **not** test whether a future delta would preserve existing users/attempts/enrollment/privacy/lessons. Those regression tests must be added **against the exact current published rules in a private local/test context** before any production rule change. The emulator fake custom claim tests only rules logic; it does **not** prove that real users cannot mint Firebase Auth custom claims.

## Connecting Firebase for easier future development

1. The official Firebase app/plugin was installed by the project owner, but the **current ChatGPT tool session has not exposed a live Firebase-project rules-reading action**. Never assume an app installation authorizes this conversation to read private production resources.
2. Prefer the supported **Firebase plugin in Codex/Work** with the existing Firebase project explicitly selected and normal Google authorization. If project scope or permission approval is requested, use **read-only** access for investigation.
3. In Firebase Console, go to **Project settings → Users and permissions** to inspect existing IAM principals and roles. **Do not add a generic AI account, grant Editor/Owner to an unverified identity, or enable public Firestore access**. Cloud IAM roles are not the same as app-level Firebase Auth custom claims.
4. In **Firestore Database → Rules**, review and back up the exact *published* text and history. Do not click Publish based on this isolated fixture. Avoid pasting service-account JSON, OAuth/CLI refresh tokens, private keys or student records into GitHub or chat.
5. Use a **separate demo/test Firebase project** for any future deployed staging, Auth tests, Cloud Functions, or migration experiments. That project must not contain real student personal data. The current V99-C emulator needs no credentials or live project.

## Next security milestone, not part of this PR

Obtain a verified current deployed rules snapshot via an authorized read-only connector or owner-reviewed console copy; reconcile with the already provided text. Then build **private full-policy emulator regression tests**, covering all existing collections and the proposed new report match. Only after all deny/allow results pass and the backend submission design is reviewed should any actual rule deployment be proposed. No user-facing “Report sent” promise until a server confirms receipt.

**Release:** On green latest-head CI, manually review **Ready for review → Merge pull request → Confirm merge**. This PR adds only an isolated fixture, demo emulator setup, audit code, CI and this note. No live writes, secrets, student data or source question changes.
