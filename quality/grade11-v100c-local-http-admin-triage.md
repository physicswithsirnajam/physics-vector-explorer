# V100-C — Authenticated administrator MCQ review transitions over LOCAL HTTP

## Confirmed starting point

PR #189 (V100-B) is merged in `main` as `1488dd35ee3b17cc7b78103a2aaa8761a816a028`. We now have two separate, tested **local-only** private administrator HTTP interfaces:

- V100-A — redacted review queue GET
- V100-B — read-only report audit-history GET

The separate V99-Q local transaction service already knows how to perform the finite review state transitions `new → in-review → resolved` and write a consistent private audit event **in the same Firestore transaction**. That service requires a genuine local Firebase Auth Emulator JWT with revocation checks, a verified email, signed `admin:true` claim, trusted server UID allowlist and a fresh current Auth account (V99-Y), and is OFF by default.

**V100-C is one small transport step**, exercising that existing transition service over an actual ephemeral loopback HTTP POST. It does not modify the existing review/audit/queue services or the live portal.

## Four new files only

1. `server/local-http-admin-triage-v100c.cjs`: temporary `127.0.0.1` HTTP listener, exact `POST /__local/grade11/admin/reviews/mr_<48-lowercase-hex>/transition`. Only `application/json` and an exactly one-field JSON body `{"action":"start-review"}` or `{"action":"resolve"}`. Body capped at **80 bytes**, strict `Content-Length`; no query strings or arbitrary report fields. No CORS, cookies, browser Origin/Referer, proxy headers, alternate Host, raw-error disclosure, or client-selected status/identity.
2. `scripts/test_grade11_local_http_admin_triage_v100c.cjs`: real local Node HTTP requests, genuine Auth Emulator-issued signed tokens, two synthetic Firestore reports, atomic private audit writes and security negatives: default OFF, owner-only access, no duplicate events, invalid actions/body/status, revoked old administrator custom claim, unverified/disabled current account, illegal state transition, bad host/headers/method/path, OFF/restart and fixed safe HTTP response codes.
3. `.github/workflows/validate-grade11-local-http-admin-triage-v100c.yml`: pinned Node 24, Java 21 and local Auth/Firestore Emulators; emits only aggregate synthetic result labels.
4. This risk/merge-gate document.

## Security boundaries and limitations

- The listener **will not start** without `PSN_LOCAL_ADMIN_TRIAGE_HTTP=enabled-local-test-only`, exact `GCLOUD_PROJECT=demo-psn-v99f-firestore`, loopback Auth and Firestore Emulator hosts, and no Google application credentials. It listens on a random ephemeral **127.0.0.1-only** port; it must NEVER be deployed or bound to an external interface.
- The trusted triage switch **defaults OFF**, requires a server-provided callback returning literal `true`, and the existing V99-Q service checks the flag repeatedly through its transaction. HTTP requests can never set the flag.
- The backend verifies real local Firebase Auth Emulator tokens using Admin SDK `verifyIdToken(token,true)`, and then current user account role/disabled/email and the trusted administrator allowlist. No frontend claim or spoofed Admin header bypass.
- The only successful response is **`{ok:true,reportId,status,alreadyApplied}`**. A duplicate of the *same* already-applied transition is idempotent, and no other state jump or report edit is permitted. Students, teachers, unlisted admins and invalid/expired rights fail safely.
- The original source-pinned **2,250** public Grade XI MCQ reference index remains authoritative, along with the existing two-step audit and transaction validation. The HTTP route does **not** edit any MCQ text, correct answer, student score, bank version or question metadata.
- Errors return fixed safe codes only and never emit student owner UID, reviewer UID, question note, answer key, raw database data, tokens or backend stack traces. Response sets no-store, nosniff, restrictive CSP and no CORS.
- As with V99-Q, the emergency OFF switch **cannot undo an already committed Firestore transaction**. The HTTP layer intentionally returns the result of a committed action instead of falsely stating it was canceled if the switch changed immediately after commit.
- This remains **test-only**, not production availability, production App Check attestation, hosted HTTPS API, browser administrator inbox, real retention/monitoring/secret handling, or a recommendation to enable student report Send.
- The owner chose to **postpone the custom domain migration until a domain is purchased**, keeping the existing repository/hosting. Real Firebase App Check registration is unconfigured and Firestore/Auth App Check enforcement remains **OFF** according to the owner's last screenshots. No changes to that configuration here.
- Existing student issue report UI remains **Copy only**, and live database/security rules, student identities, GitHub Pages site and MCQ assets are unchanged.

## Merge gate

Keep the PR **Draft** until both the exact latest-head **V100-C local HTTP triage** Action and existing **V99-U reporting launch lock** Action pass, plus any other triggered regressions. Review four new files and the synthetic JSON audit evidence; no production Firebase access is made. Only then owner selects **Ready for review → Merge pull request → Confirm merge**.

Next small milestone: a **single integration rehearsal** linking V100-A queue, V100-C status changes and V100-B audit history through genuine local HTTP against one isolated synthetic database. Production release planning still requires a separate explicit approval, provider verification, backend security review and monitoring.
