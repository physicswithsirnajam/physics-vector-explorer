# V99-N — Real HTTP ingress rehearsal, strictly loopback-only

## Verified prerequisite

PR #174 (V99-M) merged as `612b63690fa2909483fee99a6921efe8046fd070`. Its offline local report pipeline successfully tested default-OFF behavior with genuine local Firebase Auth tokens, real local Firestore transactions, a pinned 2,250-question reference index and **simulated** successful App Check proof. No live reporting endpoint exists.

V99-N solves a different missing safety requirement highlighted by V99-K: **enforce the 4 KiB upload limit while reading actual HTTP bytes**, rather than trusting a fully buffered JSON input. This PR adds only a localhost test harness and tests; it must never be deployed as a production service.

## Four new files

1. `server/local-http-review-ingress-v99n.cjs`: a test-only Node HTTP helper that can start a listener on `127.0.0.1` and an ephemeral OS-assigned port **only** when `GCLOUD_PROJECT=demo-psn-v99f-firestore`, `PSN_LOCAL_HTTP_REHEARSAL=enabled-local-test-only`, and no `GOOGLE_APPLICATION_CREDENTIALS` are present. Never accepts a caller-provided bind address, public port, or production project. It checks exact method/path, local Host and Origin, one each of required headers, no cookie/forwarded claim, declared Content-Length before reading, and byte-counts incoming streams including chunked uploads. The stream buffers at most 4,096 body bytes; extra bytes cause a 413. Read deadline is 3.5 seconds. It passes only an allowlisted six-field envelope to the already-tested V99-K gate, sanitizes every response, sets no-store and nosniff, and closes the connection.
2. `scripts/test_grade11_local_http_ingress_v99n.cjs`: opens and closes **real local TCP/HTTP sockets**. Tests default-OFF simulated downstream, malformed methods/paths/headers, declared and streaming/chunked oversized uploads, multi-byte UTF-8 byte limit, exact 4 KiB boundary, synthetic success callback, invalid content type, malformed Authorization and App Check tokens, forged report metadata, shutdown after enablement, no secret/exception leakage, and rejection of unauthorized environment settings.
3. `.github/workflows/validate-grade11-local-http-ingress-v99n.yml`: Node 24 read-only GitHub Actions, no Firebase SDK install, secret, local emulator, production credential or deployment; no permanent server.
4. This review note.

## Trust model and limits

- The HTTP listener exists **only during the test process** on `127.0.0.1` at a dynamically allocated port. The value `/api/grade11/mcq-review` remains a **design/test route**, not a public URL or deployed Cloud Function.
- Only the **HTTP ingestion mechanics** are genuine in this stage: real TCP/HTTP bytes, bounded buffering, response headers/status, and local denial. The downstream positive App Check callback and "received" acknowledgment are **synthetic**. No genuine signed Firebase App Check token is verified here, nor does it exercise live Firebase Auth or Firestore.
- Exact local Origin and Host checking are test-only defense-in-depth; **Origin can be spoofed outside browsers**, and no production browser CORS or CSRF readiness is claimed. This test helper intentionally publishes **no** `Access-Control-Allow-Origin` header. Production hosting, DNS, TLS, reverse proxy and CORS rules still require separate owner approval.
- The strict 4,096-byte limit is enforced in a streaming manner, but network load and request counts still require infrastructure-level rate limits, anti-DoS/resource controls and monitoring before serving real students. Read timeout and header parsing are illustrative localhost controls, not a production threat-model certification.
- The existing V99-M kill switch remains default OFF and untouched. The test uses a separate **synthetic downstream fixture** to exercise enabled/disabled responses and does **not** replace the approved local switch in a live service.
- No academic questions/answers, student data, teacher inbox, enrollment, Firebase Security Rules, Auth settings, App Check registration, production reporting, GitHub secrets, published site, logo or banners are modified.

## Merge checklist

1. Confirm the PR changes **exactly four new files**, with no production `firebase.json`, public HTTP deployment, student UI, or extra permissions.
2. Inspect the latest-head **Grade XI Loopback HTTP Request Ingress Rehearsal (V99-N)** workflow. It must be green and show the 413 rejection for streaming/chunked over-limit input, localhost environment refusal and sanitized responses.
3. Verify tests state **synthetic positive App Check**, not genuine signed-token success, and no real report is submitted.
4. Only then select **Ready for review → Merge pull request → Confirm merge**.

Next higher-priority launch blockers remain: actual authenticated App Check positive-path proof with owner-approved settings, published Firestore-rules verification and teacher triage authorization, production resource budget, monitoring, real server configuration and a documented disable/rollback plan. Do not activate student **Send issue report** until these are reviewed separately.
