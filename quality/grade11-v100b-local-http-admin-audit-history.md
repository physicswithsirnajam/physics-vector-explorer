# V100-B — Read-only administrator MCQ audit history over real LOCAL HTTP (no deployment)

## Confirmed baseline

Owner confirmed the existing `physicswithsirnajam/physics-vector-explorer` project will remain the active Grade XI Learning Portal until a custom domain is purchased. No new GitHub Pages user-site repository is needed. **PR #188 (V100-A)** merged at `85685a6865b79a114d0b6dafb6261c2f10f4e6c2`. It provides a real, ephemeral loopback-only HTTP rehearsal of the private, source-validated and redacted administrator MCQ review **queue**, default OFF.

The next gap in the administrative workflow is the ability to view the audit HISTORY of one reported MCQ over an analogous strictly local HTTP transport. This PR deliberately does NOT add HTTP routes for changing review status, expose any public Cloud Function, enable student report Send, or change Firebase deployment settings.

## What V100-B adds

1. `server/local-http-admin-history-v100b.cjs` — a real, ephemeral HTTP server bound to **127.0.0.1 only**, with exactly one read-only route:
   `GET /__local/grade11/admin/reviews/mr_<48-lowercase-hex>/history`.
   Startup requires `PSN_LOCAL_ADMIN_HISTORY_HTTP=enabled-local-test-only`, the exact `demo-psn-v99f-firestore` project, Auth and Firestore Emulator hosts and no real service-account credentials.
2. Reuses the existing `createLocalAdminAuditHistoryReader` (V99-R), **without editing it**: server-owned OFF-by-default enable callback; genuine Firebase Auth Emulator ID-token verification with revoked-token check; signed `admin:true` claim; verified email; server-controlled exact UID allowlist; **current** Firebase Admin Auth `getUser` account-state verification from V99-Y; pinned 2,250 original public MCQ source references; consistent transactional reads of one report and two deterministic audit event documents, with impossible states, missing events and corrupt records rejected.
3. Independent HTTP response field allowlist: success returns only `ok`, `reportId`, `questionId`, `status` and an array of **0–2** events. Each event contains only `action`, `fromStatus`, `toStatus`, `reviewedAtIso`. Reviewer UID, student owner UID, email, MCQ answer, raw report note and arbitrary private document fields are never projected.
4. Strict ingress checks: only one exact GET path with validated lowercase report ID; no query strings, cookies, browser Origin/Referer, forwarded headers, uploads, invalid Host, duplicate Host/Authorization, PUT/POST/OPTIONS or client-controlled filters. Zero CORS response headers and non-cacheable JSON with `nosniff` and restrictive CSP.
5. The trusted server enable callback must return literal `true`. The route begins OFF and checks the switch again before sending a response. A missing, throwing or unknown switch safely denies access.
6. `scripts/test_grade11_local_http_admin_history_v100b.cjs` — real Node HTTP requests with genuine signed synthetic local Firebase Auth accounts and real Firestore Emulator reports + atomic triage/audit writes. It verifies zero-event `new`, one-event `in-review`, two-event `resolved`, idempotent duplicate resolves, precise privacy projection, blocked students/teachers/nonallowlisted admins, expired permission in a stale JWT, removed verified email, disabled account, corrupt audit content, incorrect route/method/headers, switch OFF and recovery, and no unauthorized data writes.
7. New dedicated GitHub Actions workflow using pinned Node 24, Java 21 and Firebase local emulators, plus this scope/security sign-off document.

## Explicit non-goals and safety caveats

- This is **not** a real, deployed production endpoint or a working browser administrator inbox.
- Local HTTP and genuine emulator tests do **not** establish genuine production Firebase App Check provider verification. App Check is still **Unregistered** for the owner's web app according to owner screenshots; Firestore and Authentication enforcement remain **Unenforced**. Do not enable enforcement or live student reporting.
- Per-request current-role reads and OFF checks do not retroactively cancel any in-flight Firestore read or already completed network response. These controls are additional safeguards, not a production security guarantee.
- No new domain purchase/connection, GitHub Pages settings changes, Firestore Security Rules deployment, backend IAM, student accounts, email notification, MCQ source edits or grading changes.
- Current student MCQ issue-report interface remains **Copy only**. The final report Send button, review dashboard, hosted service, provider-key registration and secure deployment/retention decisions remain separately gated.
- Only synthetic test Firestore records are created inside disposable local emulators; the real production database is never accessed. No privileged tokens, emails or synthetic report notes are uploaded in CI artifacts.

## Reviewer merge gates

Keep PR in Draft until **V100-B local HTTP audit history** AND **V99-U report launch lock** pass on the **exact latest head**, and any triggered V99-R/Y workflows also pass. Inspect how history is restricted to 0/1/2 validated events; confirm field redaction, unauthorized request denials, default OFF and no live Firebase connection.

Only after green results: owner reviews the four-file PR and clicks **Ready for review → Merge pull request → Confirm merge**. No Firebase Console change, GitHub secret, DNS edit, domain purchase or manual commands needed.

Following merge, next roadmap increments can connect the read-only queue and audit-history local contracts into a synthetic administrative workflow before planning any public backend rollout. Continue to keep all production reporting/authorization/App Check deployment gates closed.
