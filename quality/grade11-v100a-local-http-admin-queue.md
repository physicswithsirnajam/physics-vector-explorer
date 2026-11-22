# V100-A — Local-only HTTP rehearsal for owner/admin MCQ review queue

## Context and reason

PR #187 (V99-Z) is confirmed merged on `main` as `0384e58042b9b7a3f208a61fe5e0b192887edc6c`. Its server-only administrator review reader is now **OFF by default**, and requires a trusted server-supplied callback returning exactly `true`. It also requires a valid Firebase Auth Emulator ID token, verified email, Admin custom claim, an immutable server-side allowlist, and the **current Firebase account** to remain authorized.

The owner has chosen to **keep our existing `physicswithsirnajam/physics-vector-explorer` GitHub Pages repository** and postpone purchasing/connecting a custom domain. Firebase App Check remains **Unregistered** in the owner's confirmed Console screenshots; Firestore and Authentication App Check enforcement remain **Unenforced**. No production App Check or domain migration is approved here.

The next missing step is a secure **HTTP transport rehearsal** for the owner-only **read-only** queue. Until now, V99-P was an SDK function callable by local tests, not a real HTTP request. V100-A tests the exact composition in a **loopback-only disposable process**.

## Four new files only

1. `server/local-http-admin-review-v100a.cjs`: `startLocalAdminReviewHttpRehearsal(...)`, an explicit local-only, ephemeral `127.0.0.1` HTTP server. It constructs the existing administrator reader internally, rather than allowing an unverified handler injection. Its exact read-only path is `GET /__local/grade11/admin/reviews`, with a fixed maximum response of **10** records. Each call must pass the existing reader's server-only default-OFF flag and verified/local current-account checks.
2. `scripts/test_grade11_local_http_admin_review_v100a.cjs`: real Node HTTP request assertions with a genuine local **Firebase Auth Emulator-issued ID token** and two completely synthetic private Firestore report documents. Confirms permitted owner gets a bounded nine-field projection, while students, teachers, unallowlisted admins, unverified email, invalid/missing tokens and stale authorized claims fail. Tests bad Host, query, method, Origin, Referer, Cookie, proxy headers and Content-Length; revocation, disabled accounts, ON/OFF and account recovery. Does not log tokens or identifying details.
3. `.github/workflows/validate-grade11-local-http-admin-v100a.yml`: pinned Node 24 + Java 21 + Firebase SDKs + local Auth/Firestore emulators; no service credentials, Firebase Console, Cloud Functions, hosting or production data.
4. This documentation and explicit release gate.

## Defenses and proof boundaries

- **No external network listener:** binds strictly to `127.0.0.1` on an automatically assigned local port and checks both socket local and peer addresses.
- **No accidental startup:** requires `PSN_LOCAL_ADMIN_HTTP_REHEARSAL=enabled-local-test-only`, `GCLOUD_PROJECT=demo-psn-v99f-firestore`, both exact emulator environment hosts `127.0.0.1:8089` and `127.0.0.1:9099`, and absence of `GOOGLE_APPLICATION_CREDENTIALS`.
- **No exposed auth data:** rejects URLs with arbitrary query strings, non-GET methods, invalid or duplicate bearer headers, unexpected Host, Origin/Referer/Cookie/Forwarded headers, or GET uploads/bodies. Never places tokens in URL or query.
- **No browser CORS:** response includes **no** `Access-Control-Allow-Origin` and no cookies; it returns JSON with `Cache-Control: no-store`, `Pragma: no-cache`, `nosniff`, `Referrer-Policy: no-referrer`, restrictive CSP and closed connections.
- **No arbitrary Firestore projection:** constructs the already-tested, server-only default-OFF V99-P reader internally, and independently checks the exact returned nine fields. `ownerUid`, account email, scores, correct answers, arbitrary internal fields, tokens and other private fields cannot appear in the HTTP JSON response.
- **Current-account checks:** the backend re-checks that the exact UID is still enabled, verified and holds `admin:true`, and belongs to the immutable server allowlist. JWTs with stale claims cannot open the queue after current-role removal.
- **Independent enable switch:** `isReviewReaderEnabled=()=>false` by default; only trusted literal `true` enables the response. The HTTP call cannot set this callback.
- **No private writes:** the HTTP route delegates only to the read-only queue. The two synthetic Firestore report documents remain unchanged; no quotas or audit events are created.
- **Local HTTP does not equal production security certification.** Real HTTPS/TLS, authentication session policies, real App Check-positive provider proof, Cloud Run/Functions routing, production rate limiting, operational secrets/IAM, CSRF/CORS review, quota, telemetry, retention, user privacy and deployment rollback have not been implemented or independently approved. A local read-only transport **must not** be deployed to the internet as-is.
- Existing teacher triage/history services still have separate trusted enable switches and are **not** exposed by this HTTP rehearsal.

## Important remaining roadmap gates

The user-verified portal remains on `https://physicswithsirnajam.github.io/physics-vector-explorer/portal/`. A future purchased domain will be connected to existing GitHub Pages without creating a new user-site repository, after link/Auth/App Check hostname tests. No custom domain or Firebase configuration change is needed for V100-A.

**Student MCQ issue-report UI remains Copy only.** The owner has not registered the App Check web app; the genuine production-provider positive token check from V99-V is outstanding. Do **not** enable live student report Send, Firebase App Check enforcement, or deploy the test-only listener.

## Merge gate

Keep Draft until latest-head **Grade XI Local HTTP Administrator Review Queue (V100-A)** and **V99-U reporting launch lock** (plus any triggered V99-P/Y tests) are green. Verify local HTTP read-only behavior and all negative tests, no public listener and no Firebase configuration mutation. Then owner reviews → **Ready for review → Merge pull request → Confirm merge**.

No user setup, GitHub secret, Firebase Console, domain or production changes for this PR.
