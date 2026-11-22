# V99-M — Local-only Grade XI MCQ report emergency OFF switch

## Prerequisite and purpose

PR #173 (V99-L) merged at `0e83d0ff76e5d7c65d472e6598cebe14b2b9ce77`. Its genuinely installed Firebase Admin App Check SDK rejected malformed tokens in offline tests. V99-L correctly did **not** claim to verify a genuine positive App Check token, because Firebase's standard local emulator suite has no App Check emulator.

V99-M is an incremental **operational safety and integration** test, not a reporting launch. It connects the already-tested V99-J Firebase Auth + Firestore + immutable 2,250-MCQ catalog, V99-K strict offline request gate, and V99-L App Check verification interface behind a **trusted, fail-closed, default-OFF server-side switch**.

## Exactly four new files

- `server/local-report-switch-v99m.cjs` provides `createLocalSwitchableReviewGate`. If the trusted server callback does not return literal `true`, the request is rejected with the fixed 503 `temporarily-unavailable` response before checking tokens or touching storage. The switch is checked again **after the App Check verifier** and immediately before the authenticated receiving handler. It cannot be enabled by browser-supplied flags, status, headers or identity claims. The caller must provide it in trusted local server code; absence defaults to OFF. The preexisting demo project, loopback emulator host and credentials guards continue to apply.
- `scripts/test_grade11_local_report_switch_v99m.cjs` uses real **LOCAL** Firebase Authentication emulator tokens and real Admin SDK transactions in the **LOCAL** Firestore emulator, accessing only the pinned 2,250-ID-only Grade XI catalog. Positive App Check proof is **synthetic by necessity**, injected through a clearly labelled mock. The test also uses the **actual Admin App Check SDK to reject an invalid token**, never a fake verified token described as genuine. It tests OFF by default, explicit temporary local enable, unverified student, missing enrollment, atomic write, duplicate receipt, cooldown, subsequent OFF, failing flag callback, disablement during App Check, forged request, malformed App Check token and mismatched project.
- `.github/workflows/validate-grade11-local-report-switch-v99m.yml` uses a no-secrets read-only runner, pinned Firebase SDKs, Node 24/Java 21 and the existing combined local Auth+Firestore emulator configuration `security-proposals/v99j/combined-local-emulators.json`. Uploads **synthetic counts and scenario labels only**.
- This QC note.

**This does not create an HTTP/Callable endpoint or a production kill-switch control.** The local switch is a seam to establish shutdown semantics and tests. A real service would need a trustworthy, highly available deployment flag or traffic switch, restricted permissions, logging and monitoring, and verified operational shutdown procedures.

## Safety boundaries and limitations

1. **No live Firebase project, App Check registration, production Firestore Security Rules, secrets, student record, original MCQ/answer key, website, logo, banner or current "Copy issue report" behavior is changed.** No teacher inbox or actual student "Send" is enabled.
2. **Default OFF** is strict, even for malformed envelopes. An external caller cannot set the flag; runtime callback may only come from trusted server-side configuration.
3. **Fail closed**: exceptions, falsy values, missing data or non-boolean values from the switch callback result in 503, with no underlying error leak and no downstream App Check validation or Firestore write.
4. **Mid-verification switch OFF**: if OFF occurs while App Check verification is running, a second check stops processing before Firebase Auth verification and Firestore intake. **Already in-flight Firestore transactions are not canceled**; this is not a globally atomic emergency shutdown. In a future service, use independent operational traffic controls and drain/disable procedures.
5. **No genuine App Check positive token verification**: successful app proof remains a mock, and no replay/limited-use consumption is implemented. There is still no full production readiness certification.
6. The strict V99-K design-only route is still **not registered**. Future HTTP adapters must limit bytes at ingress, handle origin/CORS/CSRF and rate/resource protections, and enforce real Admin App Check and Auth token verification before live use.
7. The isolated V99-C Firestore test fixture is **not equivalent to the owner's published Firebase rules**. The current published rules and teacher permission policy require separate verification before release.

## Human merge gate

Only merge after the latest PR head has a green `Grade XI Local Report Emergency OFF Switch (V99-M)` workflow and logs explicitly distinguish the **real** local Auth/Firestore acceptance from the **synthetic** App Check acceptance.

When green: inspect the four-file diff, click **Ready for review → Merge pull request → Confirm merge**. Do **not** modify Firebase Console settings, GitHub secrets or website UI for this step.

Next isolated stage should assess deployment-readiness and actual App Check setup using owner-approved configuration (including a genuine token) **before any production endpoint or student Send control**.
