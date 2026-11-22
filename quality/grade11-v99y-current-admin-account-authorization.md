# V99-Y — Fresh administrator account authorization for MCQ review (LOCAL ONLY)

## Why we are doing this before domain or App Check setup

The owner has chosen to keep the existing `physicswithsirnajam/physics-vector-explorer` development and GitHub Pages project, and to buy a short custom domain later. No extra user-site repository is needed now. PR #185 (V99-X) was verified merged at `490f85350ade20ecad4ec86373647e009c397985`: public project root now redirects to the existing Grade XI Learning Portal, and the preserved Vector Explorer has a dedicated simulation page with navigation.

The remaining production App Check problem is **not yet solved**: the owner observed in Firebase Console that the web app is **Unregistered** and Firestore and Authentication are **Unenforced**. We will not register reCAPTCHA Enterprise for a temporary hostname, enable enforcement or change the Firebase project until the relevant provider and final website domains are intentionally reviewed.

Meanwhile, we can reduce a concrete risk in the **local-only** administrator report-review prototypes from PR #177 (read-only queue), PR #178 (transactional status updates), and PR #179 (read-only audit history).

## The specific authorization gap

A JWT minted while the administrator's Firebase Auth **custom claim `admin:true`** is present may continue to carry that claim until the token expires or refreshes. Firebase Admin's `verifyIdToken(token,true)` proves the token was minted by the local emulator, matches its project and has not been revoked; it is **not by itself a fresh read of current custom claims**, which can change after the token was issued.

V99-Y now uses the real local Admin Auth SDK `getUser(uid)` on **every** private reader, review-transition and audit-history request, **after** the existing trusted checks:

1. Require the exact local demo project, Auth Emulator, Firestore Emulator and **no** service-account credential.
2. Verify token via `verifyIdToken(token,true)`, check token `aud`, `iss`, `uid/sub`, token `email_verified:true`, token `admin:true`, and a frozen **server-owned administrator UID allowlist**.
3. Read the **current server-side account record** using `getUser(uid)`; require exact same UID, current `disabled:false`, current `emailVerified:true`, and current `customClaims.admin === true`.
4. If the lookup is missing, mismatched or fails: **deny**, return only an allowlisted safe code, and perform **no privileged Firestore read or update**.
5. Continue all original source-pinned 2,250 Grade XI MCQ validation, bounded results, atomic audit transitions, OFF-by-default switches and private browser rule denials.

There is **no caching** of current permissions, no client role override, no automatic administrator provisioning, no new public endpoint and no website modification. The server-only UID allowlist is not modifiable by users, and the new check cannot grant access unless the old checks also passed.

## Changed files

1. New `server/local-admin-account-freshness-v99y.cjs`: narrow, fail-closed current account validator; refuses real Firebase project/service credentials. Handles disabled account, removed email verification, revoked admin claim, unknown user, changed UID and transient Auth SDK failures with fixed non-sensitive status codes.
2. Updated `server/local-admin-review-reader-v99p.cjs`: fresh-current-record gate before bounded private queue reads.
3. Updated `server/local-admin-review-transitions-v99q.cjs`: fresh-current-record gate before entering the Firestore status/audit transaction. Existing default OFF and finite state machine remain unchanged.
4. Updated `server/local-admin-audit-history-v99r.cjs`: fresh-current-record gate before reading the private report and deterministic audit IDs.
5. New `scripts/test_grade11_admin_account_freshness_v99y.cjs`: **genuine local Firebase Auth Emulator ID token** minted while admin claim and email verification were true; remove each current account permission **without refreshing the old token**. Check all three server private operations reject that stale token and leave report/audit unchanged. Also disable/re-enable account, restore authorization, test real Firestore audit transitions, missing/broken/mismatched Admin Auth lookups, non-demo project rejection and no sensitive error leaks.
6. New `.github/workflows/validate-grade11-admin-account-freshness-v99y.yml`: pinned Node 24, Java 21 and Firebase local Auth+Firestore Emulator. No service accounts or production Firebase credentials; aggregate synthetic counts only.
7. This document.

## Important accuracy boundaries

- **Local only**: A passing test is genuine **emulator** ID-token and Admin Auth user-record behavior, **not** production token verification, real existing user claims or production administrator accounts.
- A per-request current-role read minimizes stale-claim access, but does **not** atomically bind Auth account state to a Firestore transaction; revoking a role **during a transaction already underway** cannot retroactively stop a committed action. Strong operational kill switches, monitoring and cancellation procedures remain separate release prerequisites.
- Firebase Admin Firestore bypasses Firestore Security Rules, so backend access checks remain mandatory; browser reads of reports/rates/audit stay denied in the earlier undeployed test fixtures.
- If a real production identity is compromised, deleting an old claim is not equivalent to explicit Firebase session revocation; production operations must plan both proper token/session revocation and current-role validation.
- Student issue-report button remains **Copy only**. No App Check positive real-provider attestation, teacher inbox UI, live HTTP endpoint, custom domain, sign-in logic change, MCQ change, question-key change, published rules change or data deployment occurs here.
- The existing V99-U App Check launch lock must stay GREEN.

## Merge gate

Keep draft until the exact latest head of **Grade XI Fresh Admin Authority Before Private Review (V99-Y)** plus the existing P/Q/R test workflows and V99-U launch-lock workflow are all green. Review stale-JWT claims, role removal, email unverification and disabled-user denial across all three operations, and confirm no Firestore mutation during failed authorization. Only then **Ready for review → Merge pull request → Confirm merge**.

No Firebase Console, new GitHub secret, new user role, App Check configuration, DNS, domain or live deployment changes are required.

Next roadmap item after this test-only hardening: systematic production release gate review while keeping domain purchase independent. When the owner eventually purchases a domain, add the GitHub Pages custom domain and test URL relative paths, Firebase authorized domains and App Check provider hostname registration before announcing the move to students.
