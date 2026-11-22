# V99-Z — Default-OFF private administrator MCQ report queue (LOCAL EMULATORS ONLY)

## Verified prerequisite

PR #186 (V99-Y) merged as `761961a7d8e8a2f75d880e3d0d98b238854ef245`, strengthening all three local administrator operations by rechecking the **current Auth account** after verifying the caller's real local-emulator ID token, current admin custom claim and immutable UID allowlist.

The owner will keep the current `physicswithsirnajam/physics-vector-explorer` GitHub Pages project and register a custom domain later. Neither a new GitHub user site nor a domain migration is required to keep developing.

**Problem:** Although V99-Q (status changes) and V99-R (audit history) are explicitly disabled unless a trusted server callback opts in, V99-P's read-only private **review queue** lacked a matching default-OFF switch. Its existing emulator-only constructor, verified token/allowlist, current-user checks and private-field projection were protective, but a defense-in-depth emergency opt-out would be useful before any future production backend design.

## What changed

1. `server/local-admin-review-reader-v99p.cjs`: adds `isReviewReaderEnabled=()=>false`, checked for **literal `true`**, never a truthy user parameter. Constructor requires a trusted callback function. Every request checks it before processing and again **after verified Auth/permit checks, immediately before Firestore retrieval**, and once more **before returning the sanitized queue**. If disabled, throws, returns `undefined`, or returns anything other than literal true, the reader returns exactly `{ok:false,code:'temporarily-unavailable'}`. The switch is controlled by the trusted server only; it is never accepted from the browser/request.
2. `scripts/test_grade11_admin_review_reader_v99p.cjs`: existing genuine local Firebase Auth/Firestore Emulator suite now separately tests default-OFF, thrown/undefined switches, invalid nonfunction configuration, and a spy guaranteeing no Firestore reads when disabled. Another test disables the switch after token verification (before query); a final test disables it after the Firestore query completes (before response) and proves no private queue is returned.
3. `scripts/test_grade11_admin_review_transitions_v99q.cjs`: explicitly opts the **synthetic, local test** reader into the enabled state for its existing compatibility test. Transactional write service remains default OFF with its own separate flag.
4. `scripts/test_grade11_admin_account_freshness_v99y.cjs`: explicitly opts the synthetic authorized and fake-backend reader instances into the test state so the V99-Y revocation tests continue to measure **role/email/disabled** denial rather than an unrelated reader-OFF denial.
5. This document.

The original 2,250 pinned Grade XI public source MCQs, private report IDs, 25-item page limit, redacted projection, authentic local Firebase SDK token verification, server-controlled UID allowlist, fresh Auth user status, and browser Firestore Rules denial all remain unchanged.

## Important behavior and boundaries

- A default-OFF switch is useful against **accidental invocation** but does not replace network shutdown, Firebase IAM, real signed App Check, identity checks, trusted admin provisioning, server rate limits, or proper production monitoring.
- If the switch becomes OFF **after an in-flight Firestore query began**, the code cannot cancel the query or undo any already-completed read. It **does refuse to return the collected report data** if it observes OFF at the post-query check. A switch change after that final check cannot retroactively revoke a response already emitted.
- If a permission is removed mid-request, the V99-Y **per-request** account lookup still applies; it is not atomically locked with Firestore and is not a guarantee against in-flight races.
- **No public endpoint, teacher inbox UI, current user database, real production Firebase/App Check setting, custom domain, student Send button or new data retention rules** are introduced in this PR. Student issue reports still use **Copy only**.
- The Firebase web app observed by the owner remains **App Check Unregistered**, and both Firestore and Authentication were shown as **Unenforced**. Do **not** turn them on until the website/provider/final-domain plan is approved and genuine signed provider attestation is tested.
- Existing published Firestore rules remain unchanged. All browser access to review/rate/audit collections is denied by the previously tested **isolated, undeployed** fixtures.

## Tests and merge gate

Keep the PR Draft until latest-head GitHub Actions for **V99-P reader**, **V99-Q transitions**, **V99-Y fresh account**, and existing **V99-U reporting launch-lock** are green. Also check V99-R if triggered, because the audit-history feature relies on the same review records.

After all tests pass, owner reviews the limited changes, clicks **Ready for review → Merge pull request → Confirm merge**. No new Firebase Console configuration, GitHub secret, hosting, DNS, custom-domain purchase or manual command is required.

Next: continue production readiness proof work in deliberately small increments. Do not publish or activate live student issue submission without genuine App Check-positive evidence and an approved secure backend rollout.
