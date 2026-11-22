# V100-J — MCQ reporting and administrator Review Desk production-readiness ledger

## Why this milestone follows PR #196

PR **#196 (V100-I)** merged into main at aa82359400737fa72e64a23999f951399796d71b on 22 November 2026. The administrator Review Desk is now an accessible and well-tested **offline fictional** prototype; it is not a live teacher account, inbox or secure web service. The backend V100-A/B/C/D workflow previously passed shared local Firebase Auth/Firestore Emulator tests, but no public administrator endpoint was deployed by those PRs.

Further purely cosmetic changes are not the priority. Before any real student “Send issue report” or authenticated administrator review, we need an explicit, source-grounded account of what is tested and what is still **not verified**. A green source test is not authorization to release.

## Exactly four new files

1. **scripts/audit_grade11_review_launch_readiness_v100j.cjs** — read-only Node source audit. It invokes the already merged V99-U **Copy-only/launch-lock** and V99-W **web origin/App Check source inventory**, verifies the V100-A/B/C loopback-only/default-OFF private HTTP endpoints, V100-D shared emulator-test source, synthetic V100-E–I UI, V100-F contract check and original 2,250 approved public Grade XI MCQ references. It writes a **BLOCKED** readiness JSON and **seven explicit outstanding gates**. It does not query Firebase.
2. **scripts/test_grade11_review_launch_readiness_v100j.cjs** — offline mutation tests. Reject removed copy-only handler, changed Firebase project identity, public HTTP interface, default-ON admin operation, preview-side report fetch, false “live” banner or removed regression proof. Verify all production-readiness flags stay false, including “current published Firestore rules independently verified.”
3. **.github/workflows/validate-grade11-review-readiness-v100j.yml** — GitHub Actions on relevant changes, Node 24, no Firebase SDK, no real website access, no secrets, no deployment. Output readiness.json with only source evidence and generic owner-review steps.
4. This scope and decision record.

This four-file PR changes **no** live portal or backend code.

## Seven unresolved production gates

| Gate | What this repository does (and doesn't) establish | Required subsequent owner-controlled evidence |
|---|---|---|
| Actual browser origin | The default GitHub Pages hostname can be inferred, **not independently observed** as the live student app origin | Confirm real Grade XI portal browser URL and any iframe origin |
| Genuine App Check | V99-V CI rejects bad JWTs but has **no real registered-provider positive proof** | Read App Check Apps/APIs/provider/host allowlist; plan legitimate browser test, no debug-token shortcut |
| Current published rules | V99-T compared an **owner-copied** published snapshot with a 227-line baseline, not a trusted current rules API revision | Privately check the current active published rules revision and reconcile any drift |
| Live administrator service and roles | Trusted Admin readers/transitions/audits were exercised on **local emulators** | Design approved hosted authenticated HTTPS API and server-owned admin roles |
| Real abuse/transport controls | Local request validation/quotas and default OFF are only component tests | Evaluate real Auth/App Check combinations, server rate controls, request paths, fail-closed behavior and shutdown |
| Privacy and operations | No real data is in this PR; a safe demo cannot prove real-world policies | Define retention, minimal notes, access logs, cost limits, monitoring, incident response and rollback |
| Deliberate student release | The student button is **Copy only** and reports are **not sent by this feature** | Distinct owner-approved, independently reviewed production release with a real server acknowledgement |

Do not interpret “7 unresolved gates” as seven production bugs already confirmed in the user’s Firebase Console. They are evidence/approval gaps from the scope of a Git repository audit. A source check cannot see account settings, billing, service uptime or active private Firebase rules.

## Source and privacy protections

- Only the previously approved original public MCQ IDs/metadata are counted (2,250 references); no answers, real student identities, notes, reviews or secrets are copied into the generated ledger.
- The exact official Physics with Sir Najam logo and the real student-facing portal remain unchanged.
- The source audit never reads or logs the private owner baseline, current deployed rules, Firebase user/ID tokens, real App Check JWT, GitHub secrets or service-account credentials.
- The protected student/teacher application already uses Auth and Firestore. **Do not enable enforcement now**: without genuine valid client provider initialization, this may break existing sign-in, progress, enrollments or lessons.
- This ledger should **fail** if source-only safety assumptions drift. It is not penetration testing, an audit of every deployed endpoint, nor a proof that existing cloud resources do not exist.

## Owner's next read-only evidence collection, AFTER merge

1. In GitHub → repository **Settings → Pages**, view the published URL, then open the actual Grade XI student portal in the browser and note its final hostname and whether an external Google Sites iframe is involved.
2. In Firebase Console for **physics-with-sir-najam-portal**, view **Project settings → Your apps** (expected public Web App ID **1:158078442603:web:b4738a9875a1d5b1c8a52e**).
3. In **Security → App Check → Apps**, read Registered/Unregistered and provider; in **APIs**, read Firestore and Authentication monitoring/enforcement states. **Do not click Register or Enforce.**
4. Share only the observed public website URL and visible status descriptions. **Never send token, secret key, service account, protected student data, private UID/claims or full Firestore rules in chat.**

This information will guide a separate, smallest-safe real-provider readiness step; keeping our current GitHub Pages project and purchasing a custom domain later remains supported.

## Merge gate

Keep **Draft** until the latest-head **Grade XI MCQ Review Launch Readiness Ledger (V100-J)** and **V99-U App Check Reporting Launch Lock** workflows succeed. Both should report **BLOCKED FOR LIVE STUDENT SEND** despite the green source tests. If additional path-based CI runs, resolve any failure before merge; verify exactly four new files and no runtime edits. The owner should inspect the safe JSON artifact and decide **Ready for review → Merge pull request → Confirm merge**.

No new GitHub secrets, billing, Firebase Console changes, App Check provider registration, live deployment, DNS or domain purchase.
