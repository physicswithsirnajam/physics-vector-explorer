# V99-Q — Local-only audited administrator review transitions

## Verified prerequisite

PR #177 (V99-P) was merged as `6a430ae314b1ebbc7290ff20c1a874e43f119606`. V99-P verified a **read-only** server-authorized administrator queue in the local Firebase Auth and Firestore emulators, using a custom `admin:true` claim, a distinct trusted server UID allowlist, verified email and bounded redacted report listing. No production Firebase data or permissions were changed.

V99-Q adds one narrowly constrained missing half of that local workflow: a **trusted server-only action** to move an individual report through `new → in-review → resolved`, recording a private audit event atomically for each real change. This is deliberately **not a production admin inbox or endpoint**.

## Five new files, no existing source changed

1. `server/local-admin-review-transitions-v99q.cjs`: strictly local Firebase Admin SDK review action, OFF by default. Construction refuses production project IDs, non-loopback Firebase Auth and Firestore hosts, service-account credentials, missing Admin SDK, or missing trusted UID allowlist. A request has **exactly** `authorization`, `reportId`, and one of two finite actions (`start-review`, `resolve`). No client-supplied identity, `status`, answer, free-form review text, owner, teacher role or override is allowed. Real local Auth Emulator-issued ID token must pass `verifyIdToken(token,true)`, correct demo project/issuer/subject, verified email, signed custom `admin:true` and the independent trusted administrator UID allowlist.
2. `scripts/test_grade11_admin_review_transitions_v99q.cjs`: real local Firebase Admin Auth token verification, 4 synthetic source-backed reports, correct and wrong-admin/teacher/student/unverified denial, illegal transitions, invalid source records, actual Firestore atomic status and audit writes, safe idempotent duplicates, same-action concurrent transactions, switch OFF and mid-auth shutdown, backend exception redaction, existing V99-P read-only viewer compatibility and direct browser-rule denial. Exercises original master source IDs and the pinned **2,250** public Grade XI MCQs.
3. `security-proposals/v99q/triage-server-only-isolated.rules`: **ISOLATED TEST FIXTURE ONLY**. Denies *all* browser SDK reads and writes to reports, per-student rate state and private admin audit records, including browser sessions with administrator/teacher claims. **Never deploy this file** in place of the user's full published Firebase rules.
4. `.github/workflows/validate-grade11-local-admin-review-transitions-v99q.yml`: Node 24, Java 21 and pinned SDKs; real Firebase **local Auth + Firestore emulators**, read-only GitHub permissions, no service account or live project. Uploads only synthetic counts/quality labels.
5. This review document.

## Exact server-side state machine

| Starting state | Allowed action | Result |
|---|---|---|
| new | start-review | in-review |
| in-review | resolve | resolved |
| in-review | start-review again | Already applied (no write) |
| resolved | resolve again | Already applied (no write) |
| new | resolve | Denied |
| resolved | start-review | Denied; no reopening |

Each successful *new* transition uses **one real Admin Firestore transaction** to update only `status` and `reviewUpdatedAtIso`, and **create** a separate immutable private event in `mcqReviewAdminAudit`. The audit event records the trusted verified administrator UID, report ID, fixed transition and trusted time—not report body, student account, answer key, email, grades or options. Each audit ID is deterministic per report/target state; duplicates do not append history or mutate quotas. Concurrency is tested in the emulator.

The admin receipt exposes only `ok`, `reportId`, `status`, and `alreadyApplied`; no reviewer identity, student identity, note, answer or audit contents. The existing V99-P read-only view still recognizes statuses and continues to redact sensitive content.

## Limits and launch gates

- The administrator action switch defaults **OFF**; a trusted server callback must return literal `true`, checked before accepting inputs, again after Auth and within the transaction. It is not browser-controlled and does **not cancel** already committed or in-flight writes if the flag changes later.
- Real Auth tokens in this test are issued by the **local Auth Emulator**, not production-signed tokens. These tests prove an emulator integration boundary, not production credential setup.
- No genuine Firebase App Check positively verified token is used, and there is **no live HTTP or Callable endpoint** for administrator updates. A future production review workflow needs its own independently verified App Check and CSRF/origin/CORS/anti-abuse/security policy as appropriate.
- Reports never change original MCQs, correct answers, source metadata, explanations, SLOs or students' marks. "Resolved" means **the report has been triaged**, not that a question's alleged defect has been independently confirmed or corrected. No notification or editing is implied.
- The private audit trail is a local design/test; comprehensive production audit durability, permissions, incident response and retention require separate review. No full production Firestore Security Rules, real admin UID assignments, or production database records have been touched.
- No existing site content, logos, banners, portal tests, student **Copy issue report** button, Firebase settings, secrets, teacher web interface or published rules were altered.

## Merge gate

Keep the PR Draft until the **latest-head Grade XI Local Authorized MCQ Review Transitions (V99-Q)** workflow is green and the 5-file diff is reviewed. Confirm local roles/allowlist, state-machine denials, idempotence, concurrency, **atomic report-and-audit write**, fail-closed OFF, redacted receipts, and **all browser SDK access denied** in the isolated fixture. Then **Ready for review → Merge pull request → Confirm merge**.

No Firebase Console actions, GitHub secrets or deployments are needed. The next increment should focus on audit history retrieval or explicit production-readiness risk review, not automatically enabling student submissions.
