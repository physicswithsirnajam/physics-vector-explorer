# V100-D — One real local administrator HTTP workflow: queue → triage → audit history

## Confirmed baseline and owner decision

PR #190 (V100-C) merged as `995264a983b8d2caed769ba47cecccfb123fa670` on 22 November 2026. It completed the third independent **local-only** administrator HTTP interface. The user has chosen to keep developing in `physicswithsirnajam/physics-vector-explorer` and **postpone custom-domain migration** until purchasing a suitable domain.

The three prior independent local HTTP implementations are:

1. V100-A: authorized server-only `GET /__local/grade11/admin/reviews` — bounded and redacted read-only queue, explicitly OFF unless trusted backend opts in.
2. V100-C: authorized server-only `POST /__local/grade11/admin/reviews/<strict-report-id>/transition` — only `start-review` and `resolve` actions, independently OFF, with transactional status and private audit event.
3. V100-B: authorized server-only `GET /__local/grade11/admin/reviews/<strict-report-id>/history` — exact 0, 1 or 2 validated audit events; independently OFF.

Each existing HTTP test independently passed against the Firebase Auth and Firestore Emulators. **The missing assurance was that all three use the same real synthetic local Firestore data and return consistent results in sequence**. That is V100-D.

## Three added files, no edits to existing runtime code

- New `scripts/test_grade11_local_admin_complete_http_workflow_v100d.cjs`: genuine Auth Emulator ID tokens (signed-in synthetic Admin, student, teacher and nonallowlisted Admin), **one** local Firestore Emulator and **three** disposable, independent loopback HTTP servers running simultaneously.
- New `.github/workflows/validate-grade11-local-admin-complete-http-v100d.yml`: Node 24, Java 21, pinned demo-only Firebase SDKs, local Firestore/Auth Emulators and aggregate synthetic test artifact, with source-only GitHub Actions permissions.
- This owner/reviewer safety documentation.

## End-to-end test design

The test seeds two synthetic reports referring to the original checked-in 2,250 approved public Grade XI MCQ reference catalogue. It starts the three HTTP servers at different loopback ports, each independently **OFF**. With an explicitly trusted per-route test callback ON, the test performs genuine local HTTP requests:

1. **Discover** two redacted queue reports sorted newest first; the target report is `new`.
2. **Inspect** target history before review: status `new`, zero audit events, no student note/reviewer UID.
3. **Reject illegal transition**: attempting `resolve` directly from `new` fails without a Firestore write.
4. **Start review** with POST: one atomic update and private audit event. A different HTTP GET port now shows `in-review`; another shows exactly one matching audit entry.
5. **Retry** the same action: idempotent receipt, no duplicate audit.
6. **Resolve** through the same HTTP POST port: the queue shows `resolved`, history has exactly two ordered events, and the unrelated second report remains `new` and unaudited.
7. **Retry resolved**: safe receipt, no extra report/audit/quota writes. Verify the actual private stored `reviewerUid` exists in Firestore but **never** appears in any HTTP result. Responses allowlist only fixed public-safe fields and have no CORS or caching.
8. **Attack/authorization negatives**: student, teacher, nonallowlisted Admin and forged token cannot use *any* of the three HTTP routes; current admin custom claim revocation also blocks an older still-valid `admin:true` signed token on all three.
9. **Operational switches**: turning OFF only one service denies just its endpoint, while permitted other read-only services remain usable. Turning OFF status transitions prevents a pending second-report mutation.

The exact approved source pin, field projections and fixed state machine are taken from existing tested V99-P/Q/R and V100-A/B/C modules; no new business rules or question data are copied into a new public runtime.

## Scope and non-goals

- **LOCAL EMULATORS ONLY**: environment must use `GCLOUD_PROJECT=demo-psn-v99f-firestore`, `FIRESTORE_EMULATOR_HOST=127.0.0.1:8089`, `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`, all three exact deliberate `PSN_LOCAL_ADMIN_...=enabled-local-test-only` flags, and **no** Google service-account credential.
- Each HTTP server binds only `127.0.0.1` on an ephemeral port; tests use real Node HTTP sockets but no public listener, Cloud Function, deployed API, GraphQL server or teacher inbox.
- **No production Firebase** project or actual student accounts, enrollment state, achievements, teacher grades, source MCQ content, answer keys, private review submissions or deployed Firestore Rules are touched.
- No custom-domain purchase, DNS adjustment, Pages config change, browser student Send switch, administrator website, private secret, genuine production App Check attestation, Firebase enforcement or live reporting activation.
- **Student issue reports remain Copy only**. The owner previously confirmed Firebase App Check web app is **Unregistered** and Authentication/Firestore App Check enforcement are **Unenforced**. Do not enable these without the planned real-domain/provider checks and explicit approval.
- **Not a production security certification:** loopback-only HTTP cannot by itself test real browser/API CORS, operational IAM, production signed App Check, production rate limits, HTTPS/CSRF, notifications, privacy retention or incident-response workflow.
- Trusted callback OFF checks and per-request fresh Auth lookups cannot undo a Firestore transaction already committed, a read already executed, or a response already sent. Independent operational traffic controls will be required for any future real deployment.

## Latest-head merge gate

Keep the PR **Draft** until GitHub Actions **V100-D Complete Local Administrator HTTP Review Workflow** and **V99-U Reporting Launch Lock** both show **SUCCESS on the exact current PR head**. If any relevant existing regression is triggered, it must also be green. Review the three additions and confirm the only tests are disposable, that the full state and audit cycle is consistent, and that public Send stays disabled.

Then the owner may select **Ready for review → Merge pull request → Confirm merge**. No Firebase Console, GitHub secrets, custom domain or manual command changes are required.

After merging, review remaining release gates and plan a safe administrator UX, provider verification and production service design in deliberately separate owner-approved steps.
