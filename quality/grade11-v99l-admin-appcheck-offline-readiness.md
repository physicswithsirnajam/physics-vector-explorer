# V99-L — Real Firebase Admin App Check SDK **rejection** and offline integration contract

## Verified prerequisite

PR #172 (V99-K) merged into main at `eeeb6e9294e01ba3bb4d5997ad33e86d3b01d095`. That offline-only contract prevents malformed/oversized/forged MCQ review envelopes and redacts errors. Its prior App Check interface tests used only **synthetic verifier callbacks**.

V99-L adds the next constrained step. It imports the **actual pinned Firebase Admin SDK** into an offline CI test and confirms that its App Check service can reject a deliberately malformed JWT, then tests how a trusted `verifyToken` result would enter V99-K. There is **no genuine positively verified Firebase App Check token** in this test.

### Scope (four new files)

- `server/offline-admin-appcheck-v99l.cjs`: a non-deployable adapter accepting a matching demo-project Firebase Admin App Check instance. Requires the exact `demo-psn-v99f-firestore` project with **no service-account credentials** and delegates every received token to `adminAppCheck.verifyToken(token,{consume:false})`. Rejects malformed/foreign/already-consumed proof; forwards only the SDK-verified `appId` into the V99-K gate's explicit app-ID allowlist. The existing V99-K gate still separately invokes the V99-G verified Firebase Authentication boundary and enrollment/transaction intake callback.
- `scripts/test_grade11_offline_admin_appcheck_v99l.cjs`: a **real installed** `firebase-admin/app-check` instance under a synthetic no-credential project rejects one malformed App Check JWT before any receiving callback. Other tests use **clearly labelled stub returns** to validate successful forwarding, no raw token or identity forwarding, strict accepted app IDs, no replay claim, redacted verifier errors, denied wrong SDK app/project/credential config, and no unauthorized success.
- `.github/workflows/validate-grade11-admin-appcheck-v99l.yml`: Node 24, `firebase-admin@14.3.0`, no Firebase emulators, no service account, no external token, no deploy. An internet-connected CI machine may install the SDK; the test uses no live project.
- This QC document.

## Important security and limitations

**Firebase's standard Local Emulator Suite does not include an App Check emulator.** Therefore this PR proves **real Admin SDK malformed-token rejection**, not cryptographic acceptance of genuine signed App Check tokens, app attestation, replay protection, real debug token registration, or real production readiness.

Official documentation:
- Firebase: <https://firebase.google.com/docs/app-check/custom-resource-backend> — genuine custom backend verification uses `firebase-admin/app-check` `getAppCheck().verifyToken(token)`.
- Firebase Admin Node: <https://firebase.google.com/docs/reference/admin/node/firebase-admin.app-check.appcheck> — `verifyToken` is the SDK verification operation.
- Firebase: <https://firebase.google.com/docs/reference/admin/node/firebase-admin.app-check.verifyappchecktokenoptions> — `consume:true` is separate beta replay protection that requires a backend network call, client limited-use tokens, permissions and quota consideration. **V99-L deliberately uses `consume:false` and does NOT claim replay protection.**

For production:
1. A separate explicitly approved deployment must instantiate a trusted Admin App Check service in the **owner's confirmed project**, with real registered web-app attestation and allowlisted Firebase app IDs, and test one **real token**. Never accept self-asserted decoded claims, dummy app IDs or credentials from students.
2. Preserve **independent** Firebase Auth token verification/revocation, student email verification, active academic enrollment and Firestore transaction quotas; App Check does **not** identify an authorized student.
3. Resolve server resource costs/rate abuse, fail-closed telemetry, origin/CORS/CSRF, real App Check token replay policy, student expectations/privacy notices, teacher-only triage inbox and rollback plan separately.
4. Re-review **currently deployed** Firestore rules and existing owner permissions before any change. Test fixtures do not substitute for production rules.

## Unchanged

No original Grade XI MCQ, answer, explanation, grading mapping, simulation, branding, student "Copy issue report" UI, Firebase production project, Security Rules, account, credential, collection, registered App Check provider, Cloud Function, HTTP endpoint or actual student submission is changed.

## Merge gate

Keep Draft until the *latest-head* `Grade XI Offline Firebase Admin App Check SDK Rejection (V99-L)` check is green and all four files are inspected. Review log labels carefully: **one real SDK negative check**, all positive app-proof paths **synthetic**. Then **Ready for review → Merge pull request → Confirm merge**.
