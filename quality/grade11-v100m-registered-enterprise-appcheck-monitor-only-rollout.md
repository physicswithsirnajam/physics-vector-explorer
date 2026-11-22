# V100-M — Live website App Check SDK initialization, Monitoring only

## Confirmed owner evidence and baseline

**PR #199 (V100-L)** merged into main as `cde1560532dfba972225c86eb4d94dd11362458c` on 22 November 2026. It identified **four independent Firebase Web SDK entrypoint modules**, not three.

On 22 November 2026 the owner showed Firebase Console screenshots confirming:

- Google Cloud reCAPTCHA Enterprise Web key named **Physics with Sir Najam - App Check** was created for `physicswithsirnajam.github.io`. The **public** site key was provided to this conversation. It is not a legacy secret key.
- Firebase App Check **Apps** reports the existing Physics with Sir Najam Portal Web app **Registered** with **Fraud Defense (formerly reCAPTCHA Enterprise)**.
- Firebase App Check **APIs** reports **Cloud Firestore: Monitoring, 0% Verified / 100% Unverified** and **Authentication (Preview): Monitoring, 0% Verified / 100% Unverified**. This is a *pre-client-integration snapshot*, not a post-deployment result.
- Firebase public Web App ID: `1:158078442603:web:b4738a9875a1d5b1c8a52e`; project `physics-with-sir-najam-portal`. GitHub Pages website host: `physicswithsirnajam.github.io`; project landing path `/physics-vector-explorer/`.

**Crucial:** Registration of an app/key does not itself prove real browser attestation. This PR only adds the browser SDK initiation code. Production provider acceptance and healthy real-user metrics must be observed *after* an owner-controlled merge/deployment, without publishing tokens.

## Runtime changes and behavior

New public source: `portal/recaptcha-enterprise-v100m.mjs`. It contains the **public site key** and fixed allowlisted GitHub Pages hostname, imports the pinned Firebase **13.1.0** App Check browser module asynchronously, and invokes:

```js
sdk.initializeAppCheck(firebaseApp,{
  provider:new sdk.ReCaptchaEnterpriseProvider(SITE_KEY),
  isTokenAutoRefreshEnabled:true
});
```

The wrapper is invoked after `initializeApp(firebaseConfig)` and **before `getAuth` / `getFirestore`** in each standalone HTML document. These entrypoints now await the helper:

| Page | Runtime module | Firebase behaviors protected by future attestation |
|---|---|---|
| `portal/index.html` | `portal/app.js` | Sign-in, profile, enrollment and progress |
| `practice-engine/index.html` | `portal/attempt-sync.js` | Optional own-account practice saves |
| `portal/course-lesson.html` | `portal/course-lesson.js` | Course lesson access |
| `portal/secure-lesson.html` | `portal/secure-lesson.js` | Protected lesson access |

**Monitoring availability safeguard:** On non-HTTPS, localhost, unexpected hostname or missing Firebase app the starter refuses to load App Check. On the intended HTTPS Pages host it attempts the registered provider; if the SDK/CDN/provider initializer throws, the helper catches that failure and returns false while the existing Auth and Firestore initialization **continues**. That is an intentional temporary student-availability decision **only while Firestore and Authentication remain Monitoring (not enforced)**. It is NOT a bypass that would work after enforcement, a verified successful App Check token, a trusted teacher role, or an authorization mechanism. Token issuance can also fail asynchronously even if the SDK initially returns successfully. Never label an SDK startup boolean as genuine positive attestation.

The project-scoped site key is **public browser metadata**; do not put any reCAPTCHA legacy *secret key*, debug token, Firebase user credential, App Check JWT, private Firestore Security Rules or service-account JSON into the repository or GitHub PR.

No student issue report Send button, Cloud reporting endpoint, admin inbox, real quiz answers or private log is introduced. Student issue reports remain **Copy only**, all local admin/reporting HTTP routes default OFF and bind loopback in tests.

## Historical guards updated rather than disabled

- V99-W now checks all **four** browser Firebase entrypoints and the approved early App Check wrapper, without claiming independent live API verification.
- V100-K updates dated owner-reported registration from earlier **Unregistered/None** to the later **Registered/Fraud Defense** screenshot, while keeping the APIs **Monitoring** and independent current API fetch **false**.
- V100-L now asserts that every browser entrypoint awaits the approved App Check wrapper **before** starting Firebase Auth/Firestore; it still rejects an unreviewed fifth initializer, wrong key/version, changed hostname, debug provider and custom-domain drift.
- The **V99-U Copy-only/reporting launch lock remains unchanged** and must pass its own triggered workflow.
- The new V100-M offline tests use **mock SDK implementations only**. A mock positive tests arguments, *not* a genuine Firebase-issued signed token. Tests cover allowed host, skipped origins, blocked CDN/provider, four boot paths, original Auth/Firestore functionality and reporting safety.

## Owner merge, post-merge live test, rollback

**Draft gate:** Check that exact-head V100-M workflow, V99-U launch lock, V99-W origin inventory, V100-K owner baseline, and V100-L entrypoint workflow all pass; inspect any other triggered website regressions. Do **not** merge if a red check remains or a real website change was introduced unexpectedly. The scope changes only 4 runtime modules, 1 public helper, updated source guards/tests, new CI and this note.

**After merge and GitHub Pages propagation:**

1. **Keep Cloud Firestore and Authentication in Monitoring. Do NOT click Enforce.** A registered provider and browser code are insufficient for enforcement.
2. Open the exact known Grade XI student portal **from the normal GitHub Pages student link**. Perform owner-authorized manual smoke tests with a permitted test/owner account: email/password login, Google sign-in if appropriate, enrollment/profile display, one supported user-initiated practice save, course lesson page, protected lesson page and sign-out. Do not disclose login information or private records. If you cannot access an enrolled protected lesson, distinguish existing content restrictions from SDK failure.
3. Look at Firebase Console → **Security → App Check → APIs**. Monitor Firestore and Authentication for actual **Verified** requests as the four entrypoints are exercised. Expect metrics to lag. Do not conclude success from a synthetic CI test or from an initial 0% snapshot.
4. Revisit Google Cloud key fraud scoring if verified requests remain absent, without disabling domain verification or adding localhost. Check real browser origin (especially Google Sites iframe) and any browser network/ad-block problems. Do not ask students to disclose App Check tokens.
5. If the production website behaves worse after merge, keep enforcement OFF and **revert this PR** through GitHub (or open an equivalent focused rollback PR); the existing Auth/Firestore clients should then revert to their previous initialization. Do not weaken Firestore Security Rules to mask a client failure.

**Never enable enforcement** until there is genuine non-debug provider proof and representative legitimate traffic has been observed, including separate browser pages and older clients. Existing student sign-in, progress and enrollment depend on this access. A purchased custom domain will need a separate approved-hostname/provider-key update *before* migrating, not silent DNS rewriting.

### Official Firebase sources

- https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider
- https://firebase.google.com/docs/app-check/monitor-metrics
- https://firebase.google.com/docs/app-check/enable-enforcement
- https://firebase.google.com/docs/app-check/web/debug-provider

## Explicit non-goals

No App Check Console enforcement toggle, new key or project, Google Cloud billing change, Firebase production rules deployment, external network endpoint, real positive token assertion, private admin role, custom domain or CNAME, student answer/question rewrite, new grade analytics collection or private student data disclosure. **This PR is an owner-reviewed browser monitoring integration, not a production security certification or automatic teacher report sender.**
