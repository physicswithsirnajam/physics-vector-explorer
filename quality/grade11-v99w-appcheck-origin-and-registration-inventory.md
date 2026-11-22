# V99-W — App Check browser origin, registration and enforcement READ-ONLY inventory

## Confirmed prerequisite

PR #183 (V99-V) merged into main at `443dc81a0d0b878534bc15b936b50887f58262df`. It added an owner-operated genuine App Check verification tool, **OFF by default**. Its safe CI only proved the Firebase Admin SDK rejects bad tokens and ten synthetic/gating groups passed. **A genuine positively verified real-provider token does NOT yet exist as evidence**.

PR #182's source launch lock also remains active: student reporting is **Copy only**, local intake/admin switches are OFF and no live MCQ issue-report endpoint, production teacher inbox or relevant Cloud Function is deployed.

## Evidence found in this repository (NOT from Firebase Console)

- Existing public Firebase project ID: `physics-with-sir-najam-portal`.
- Existing public Firebase Web App ID: `1:158078442603:web:b4738a9875a1d5b1c8a52e`.
- The Firebase `authDomain` is `physics-with-sir-najam-portal.firebaseapp.com`. **This is Firebase Authentication metadata; it is NOT evidence that the site's active browser hostname is `firebaseapp.com` or that this is the reCAPTCHA Enterprise allowlisted website domain.**
- Three existing browser-service entrypoints use Firebase Auth and Firestore SDKs:
  1. `portal/app.js` — student sign-in, profile and enrollment/account functions.
  2. `portal/attempt-sync.js` — user-initiated saved self-practice records.
  3. `portal/course-lesson.js` — access to enrolled protected lessons.
- No `initializeAppCheck` or `ReCaptchaEnterpriseProvider` initializer was observed in these three inspected entrypoints, and no corresponding browser App Check init file was discovered in the inspected source paths. The broader V99-U static launch-lock separately checks the known reporting paths. Neither source search proves the real Firebase Console's App Check registration state.
- GitHub marks this repository as having Pages enabled, but a **live verified deployment URL/custom domain was not retrieved**. The standard GitHub Pages URL derived from the username and repo would have hostname `physicswithsirnajam.github.io` with `/physics-vector-explorer/portal/index.html` as the possible student entry. This is a **candidate**, not independently validated as the current live browser URL. No tracked `CNAME` is present; absence alone cannot certify a custom domain is not configured.
- The older Google Sites address `https://sites.google.com/view/physics-with-sir-najam/student-hub/1st-year-hssc` occurs in *historical migration documentation*, but active live embedding of the new portal on Google Sites has **not** been independently established. Old archive links are not automatically allowed App Check domains.
- YouTube iframe hosts are third-party video players, not the Firebase-enabled app's website origin.

## Four new files; NO existing live code modified

1. `scripts/audit_grade11_appcheck_origin_registration_v99w.cjs`: uses `git ls-files` and six known local source files only. Verifies exact public project, web-app ID and Auth domain, three Firebase SDK initialization paths, existing student copy-only wording and absence of unexpected App Check initialization/debug tokens in these paths. Rejects an added `CNAME` or new browser App Check file until source and domain inventory are reviewed. Writes only the safe source-observation fields and explicit unverified status.
2. `scripts/test_grade11_appcheck_origin_registration_v99w.cjs`: adversarial synthetic fixtures for changed project/app ID/auth domain, credential leakage, broken protected-service entrypoints, added browser App Check init/debug token, custom-domain file and automatic-report wording.
3. `.github/workflows/validate-grade11-appcheck-origin-v99w.yml`: no credentials, no Firebase Admin SDK, no project API, no browser live access and no deploy; Node 24 source checks only.
4. This document.

## One read-only owner review, AFTER merging this test-only PR

**No Firebase settings should be changed in this stage.** The owner should inspect:

1. **Actual student URL:** In GitHub `physicswithsirnajam/physics-vector-explorer`, open **Settings → Pages** and copy the complete published website address. Open the Grade XI **student sign-in portal** from the usual student link. Note the final address-bar hostname and whether the page is inside an iframe or opened directly; if inside Google Sites, record both the *outer* Google Sites page and the *inner* iframe website URL. The Firebase Web SDK normally executes in the iframe document's origin, not the outer site's URL. Do not guess a reCAPTCHA Enterprise domain from the project ID.
2. **Confirm exact Firebase web app:** Open <https://console.firebase.google.com/> → project `physics-with-sir-najam-portal` → **Project settings → Your apps**. Check the *Web App ID* equals `1:158078442603:web:b4738a9875a1d5b1c8a52e`. The web app ID is public metadata and is safe to confirm.
3. **App registration/provider:** Firebase Console **Security → App Check → Apps**. Observe whether this exact web app is `Registered` or `Unregistered`, and if registered, what provider is shown (e.g., reCAPTCHA Enterprise). Do not click **Register** yet.
4. **Monitoring/enforcement:** Firebase Console **Security → App Check → APIs**. Read the state for **Cloud Firestore** and **Authentication** (and Storage/other relevant products if used). Report `Not enforced` versus `Enforced` or the Console's actual displayed status; do not click **Enforce** or change score thresholds.
5. **If reCAPTCHA Enterprise key already exists:** In Google Cloud Console choose the same project → **Security / Fraud Defense → reCAPTCHA Enterprise → Keys**, inspect the Web key's **allowed hostname list**. Do **not** create a key, add localhost, disable domain verification, relax validation, or change settings. Only the website's *actual verified browser hostnames* should be considered in a future provider setup. A different custom domain requires a separate registered-hostname review.

### What to share back (non-secret information)

The user can simply provide the **live portal URL**, whether embedded in Google Sites, and the visible statuses: *Web app registered? provider? Firestore enforcement? Authentication enforcement?* Do not paste App Check tokens, reCAPTCHA private keys, service-account JSON, passwords, user ID tokens or private student data. A cropped image showing only Apps/API status labels can help, but is not required. If a site key appears, redact it from any screenshot until its purpose is reviewed.

## Official Firebase documentation

- [Set up App Check reCAPTCHA Enterprise for web](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider). Firebase instructs operators to register the web app against the appropriate score-based Web key and warns **not to allow localhost on a production key**.
- [Monitor App Check request metrics](https://firebase.google.com/docs/app-check/monitor-metrics). Review live legitimate/unknown traffic before enforcing.
- [Enable App Check enforcement](https://firebase.google.com/docs/app-check/enable-enforcement). After enforcement, unverified requests to that service are rejected. **Do not enable enforcement now**; no production-positive attestation proof and no active client initialization has yet been established.
- [Use the Web App Check debug provider](https://firebase.google.com/docs/app-check/web/debug-provider). This is useful for dedicated development but **not acceptable as production-provider proof**.

## Why this phase must not activate App Check

The app already uses Firebase Authentication and Firestore for student accounts, enrollment and saved self-practice; enabling enforcement on existing services without registering, initializing and monitoring legitimate clients could prevent student sign-in or saving progress. It also would not automatically create a secure reporting backend.

**No Firebase Console mutation, website change, service-account credential, new GitHub secret, custom domain registration or student report submission occurs in V99-W.**

## Merge gate

Keep Draft until latest-head **Grade XI App Check Origin and Registration Inventory (V99-W)** and the existing **V99-U launch lock** are both green. Review exactly the four new files, confirm the evidence distinguishes **candidate hostname** from **observed live site** and that registration/enforcement status is **unknown**. Then **Ready for review → Merge pull request → Confirm merge**. Only after merging do the read-only Console/Pages inspection steps above.

The **next** incremental PR should use the owner's confirmed actual portal host and App Check registration/provisioning status; it must NOT assume a provider or silently enable enforcement.
