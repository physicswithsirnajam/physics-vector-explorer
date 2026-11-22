# V99-V — Genuine Firebase App Check Signed-Token Proof (Owner-Operated, Not Yet Run)

## Verified prerequisite

PR #182 (V99-U) merged as `5a2b93bb346fb7867ba32798d6d81cb7ca700741`. That phase created a source-only fail-closed CI guard for **Copy issue report**, local-only HTTP rehearsal, default-OFF admin and reporting gates, and no accidental App Check debug-token/browser or deployment integration. It passed 18 injected-regression groups and scanned known repository paths. A source guard is not a signed App Check-positive test or a complete production security audit.

The original **Physics with Sir Najam** Firebase public web configuration identifies project `physics-with-sir-najam-portal` and web app `1:158078442603:web:b4738a9875a1d5b1c8a52e`. These values are public *identifiers*, not authentication credentials. The pinned values cannot be changed by token input.

## What this PR actually adds

Four new files, with NO changes to existing production/browser code:

1. `scripts/probe_grade11_real_appcheck_token_v99v.cjs`: **owner-invoked ONLY** Node CLI. It is inert without exact `--verify-real-appcheck-token-stdin` and trusted local acknowledgement `PSN_APPCHECK_LOCAL_PROOF=owner-authorized-real-provider-local-only`. It refuses CI/GitHub Actions invocation, interactive typed input (token echo), credential-key/emulator/debug-token environment variables, malformed/non-JWT input and tokens above 8192 bytes. It reads only from **piped local stdin**, initializes Firebase Admin SDK with the pinned public Firebase project ID, and calls the **real** `getAppCheck(app).verifyToken(token,{consume:false})`. A successful SDK verification is accepted only if the resulting `appId` exactly matches the pinned web app ID. It then prints a **short Boolean-style success message only**. Any failure prints a short fixed denial. **No raw App Check token, signed JWT claims, credentials or private student data are printed, persisted, sent to GitHub or included in an artifact.**
2. `scripts/test_grade11_real_appcheck_owner_proof_v99v.cjs`: **no genuine token** CI tests for default OFF, exact project/web app, safe invocation, no echoed token, strict JWT input size, failure redaction, wrong app ID rejection, and the *real Firebase Admin App Check SDK's rejection of malformed JWTs*. All mock positive verification contracts in tests are **explicitly synthetic**.
3. `.github/workflows/validate-grade11-real-appcheck-owner-proof-v99v.yml`: Node 24 and pinned Firebase Admin SDK. No GitHub Actions secrets, real App Check token, owner credentials, production Auth/Firestore, deployment, Google Cloud console write or endpoint.
4. This review document.

## Important distinction — Firebase-signed token vs real provider attestation

The Firebase Admin SDK verifies whether an App Check JWT is validly signed for the Firebase project, unexpired, and belongs to the expected web-app ID. **But a Firebase-issued JWT can also result from a registered App Check *debug token*. The Admin SDK alone cannot establish that a real reCAPTCHA Enterprise provider, rather than the debug provider, attested the browser.** An owner must separately verify actual provider configuration, allowed domains, browser initialization and that the tested token was generated without the debug provider. This CLI cannot assert the missing provider provenance from JWT claims.

Current CI establishes only the **negative** real SDK check. **A GENUINE POSITIVE TOKEN HAS NOT YET BEEN VERIFIED.** A verified positive token would not itself prove student authentication, Grade XI enrollment, owner-controlled admin privileges, backend rate limiting, replay protection, Cloud Function hardening or overall launch readiness.

## Owner steps for the FUTURE real positive proof — do not perform until instructed

The prerequisite is a **registered Firebase App Check provider** for the existing web app on its actual, deployed hostname. The current docs support reCAPTCHA Enterprise for web apps; registration is configured in Google Cloud/Firebase Console. These procedures must be reviewed against the owner's real domain (GitHub Pages and any Google Sites embedding can differ) before creating or activating credentials.

1. In Firebase Console, select **`physics-with-sir-najam-portal`** → **Security → App Check**. Inspect whether the pinned Web app ID is registered, the configured provider, monitoring metrics and enforcement status. **For now, do not enable enforcement** on Firestore, Authentication or other existing services; doing so without monitoring could block student sign-in or progress.
2. In a separate approved phase, register a correctly scoped *score-based* **reCAPTCHA Enterprise web key** with only the exact real web domain(s). Firebase specifically warns against adding **localhost to a production reCAPTCHA key**. Do **not** create/register an App Check debug token as a shortcut for this proof.
3. In a separately approved phase, initialize `initializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider(SITE_KEY),isTokenAutoRefreshEnabled:true})` **early in the legitimate web app** on the registered domain, while existing Firebase service enforcement remains **OFF**. Check real metrics and ensure no existing authentication or profile regression. Do not expose the actual App Check token in screenshots, web pages, console output or network logging beyond the necessary secure request.
4. A trusted owner/operator can run the CLI **locally on a trusted computer** with Node 24 and the pinned `firebase-admin@14.3.0` package, after obtaining a short-lived token via the real registered browser provider. The input goes through a **private pipe into stdin**, never as a command argument, GitHub secret, code file, issue comment, screenshot, chat message or environment variable. The local tool performs a real Admin SDK JWT signature/issuer/expiration check; it emits no token itself. **This proof mode must never be exercised by public GitHub Actions or an untrusted pull request.**
5. Record *only*: that the Admin SDK accepted/rejected, an owner-attested statement that the token originated from the real reCAPTCHA provider on the allowlisted hostname and no debug provider was enabled, the app ID match, and the non-sensitive test date. Do not store the token. If rejected, review safe Console configuration privately; don't weaken verifiers.
6. Only after positive and negative checks on a non-public test backend, real security roles, ingress safeguards, privacy, cost, monitoring and rollback can another explicit owner-approved release phase consider live student report submission.

## Guard against misleading status claims

- `realAdminSdkMalformedJwtRejected=true`: can be demonstrated in this PR's CI.
- `realFirebaseSignedAppCheckAccepted=true`: **NOT yet**, requires the owner-operated CLI on a fresh genuine token.
- `realRecaptchaEnterpriseProviderProven=true`: **NOT yet**, requires separate provider registration/origin evidence; a successful signed token alone is insufficient.
- `appCheckReplayProtection=true`: **NOT** provided by `consume:false`.
- `studentReportSenderEnabled=true`: **NOT**; the portal remains COPY ONLY.
- `productionFirebaseRulesModified=true`: **NOT**; no rules or enforcement settings are changed.

## Official Firebase documentation

- [Get started with App Check reCAPTCHA Enterprise on web](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider)
- [Send App Check tokens to custom backend](https://firebase.google.com/docs/app-check/web/custom-resource)
- [Verify App Check tokens on custom backend](https://firebase.google.com/docs/app-check/custom-resource-backend)
- [Web App Check debug provider](https://firebase.google.com/docs/app-check/web/debug-provider)

## Merge gate

Keep Draft until the **latest-head** `Grade XI Owner-Only Genuine App Check Verifier Preflight (V99-V)` CI is GREEN and the four-file diff reviewed. CI must report clearly that the **genuine positive token is untested**, real Admin SDK invalid-token rejection passed, no tokens/secrets used, no deploy. Only then **Ready for review → Merge pull request → Confirm merge**. For this PR there is **NO new Firebase Console setting, GitHub secret, runtime token, live backend or administrator action** required.
