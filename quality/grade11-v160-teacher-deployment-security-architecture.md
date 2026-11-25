# V160 — Grade XI Unit 7 Teacher Portal: Deployment Architecture and NO-GO Readiness Gate

**As of 25 November 2026. Scope:** evaluate whether the locally tested teacher-review interface may safely go live. **Decision: NO-GO. No live deployment, Firebase Console change, hosting migration, credentials, or publication of student scores is made or authorized by this PR.**

## What is actually established

- PR #260/V159 is merged. The source-bound V155–V159 chain passed **local** Auth/Firestore emulator and real Chromium UI tests, including synthetic teacher sign-in, four question-only items (Q10/Q15/Q62/Q76), advisory recommendation submission, atomic audit, revocation, keyboard/mobile and automated WCAG A/AA checks. A test screenshot is *not* a live teacher account.
- The existing public **GitHub Pages** site is a **static** site at the owner-observed project URL `https://physicswithsirnajam.github.io/physics-vector-explorer/` (V100-K; the site URL is **not freshly verified** here). Public Firebase web configuration lives in `portal/firebase-config.js` for the **physics-with-sir-najam-portal** project. This does not provide a private backend and is not proof of configured live teacher roles.
- The V155–V159 source is intentionally **demo-psn-v143-classrooms**, `127.0.0.1`, synthetic credentials and feature switches only. `server/local-topic71-teacher-review-pilot-v155.cjs` and `server/local-topic71-browser-review-v158.cjs` **refuse production**; `local-dev/topic71-teacher-review-v158.js` is outside the production `portal/` Firebase entrypoint inventory.
- The full owner production **227-line Firestore Rules** baseline remains private; V99-T tested a **private snapshot attestation mechanism**, not independent live published Rules retrieval. The V142 classroom Rules file is an **isolated deny-all emulator fixture** and must **NEVER** replace production Rules.
- App Check V100-M is registered to the owner-observed GitHub Pages hostname with a reCAPTCHA Enterprise/Fraud Defense provider, but the earlier Console evidence was **Monitoring only**. It is not acceptable to infer current verified App Check tokens, enforcement, or a new callable API's protection from a prior registration snapshot. Existing App Check launch locks remain intact.
- **80/80 Unit7 question science/cognitive approvals remain PENDING; 0 Unit7 MCQs are available to scored practice.** Q10 and Q76 original *keyed explanations* require correction and teacher approval, Q15/Q62 revised candidate stems require teacher review. Merging this readiness document is **not academic signoff**.

## Architecture choices to take to the owner — neither selected yet

| Option | What it means | Pros | Main work/risk |
|---|---|---|---|
| **A — Retain GitHub Pages + protected backend** | Keep existing static public lessons and portal, add a separate **authenticated Firebase HTTPS Callable Function** or other protected server endpoint for teacher recommendation operations; client uses explicit configured origin/SDK. | Avoids moving existing pages, links or videos. Preserves current domain while building teacher backend separately. | New cross-origin/CORS (if HTTP API), App Check token enforcement for chosen callable/service, Firebase Auth permissions, cost, production Rules, safe API versioning. |
| **B — Firebase Hosting + same-origin serverless rewrite** | Owner opts for an authenticated teacher subsite or migration to Firebase Hosting, with Cloud Functions or Cloud Run backend reached through Hosting rewrites. | Can simplify same-origin routing and managed backend integration. | Changes site origin and redirects, Auth authorized domains, App Check key/origin settings, existing GitHub links and Google Sites embeds, production deploy/rollback, Hosting charges/quotas. |

**Recommendation for next decision:** **Do not move the existing public GitHub Pages site merely because we need a teacher backend.** Evaluate Option A first to minimize disruption, then compare hosted teacher-only experience and cost. Neither option is approved, configured, or deployed by this PR. The user's custom domain can still be planned separately; it must not be silently tied to the backend decision.

**Firebase technical references:** <https://firebase.google.com/docs/hosting/functions>, <https://firebase.google.com/docs/hosting/full-config>, <https://firebase.google.com/docs/app-check/cloud-functions>, <https://firebase.google.com/docs/firestore/security/get-started>. Firebase Hosting supports Cloud Functions rewrites; App Check can be enforced on appropriate Cloud Functions callables. Firebase Admin SDK/server libraries **bypass client Firestore Security Rules**, so backend Auth/role checks and least-privilege IAM cannot be replaced by hidden UI controls or browser Rules.

## 12 production gates — blocking until independently satisfied

| Gate | Required owner/security evidence before enabling real teachers |
|---|---|
| **G01 — Owner authorization** | Explicit choice of backend hosting, charges/quotas, staging account and deployment/rollback window. **No assumption that merging PR means consent to go live.** |
| **G02 — Trusted runtime** | Deployable server-side function design, HTTPS, region, service identity, isolation, no Firebase Admin SDK in GitHub Pages/any client bundle; production environment flags OFF until a controlled staging test. |
| **G03 — Teacher account provisioning** | Admin-only assignment/revocation of `teacher:true`, verified email, active teacher directory, owner-managed reviewer/teacher-class scopes, disabled-user checks, no admin/teacher privilege from registration or profile writes. |
| **G04 — Live Firestore Rules proof** | Owner-provided current published Rules snapshot or read via authorized Console, compare against private owner baseline, test additive **server-only** teacher review and audit collections with live-equivalent emulator including existing student/attempt/enrollment paths; never deploy V142 fixture. |
| **G05 — App Check live attestation** | Current production-site monitor telemetry and valid real-browser attestation on exact domain, then staged enforcement for new protected function; do not flip global Firestore/Auth enforcement prematurely. |
| **G06 — Web origin/CSRF** | Choose exact GitHub Pages origin versus Firebase Hosting rewrites, restrict CORS and Origin; enforce signed Auth token server-side. For cookie-based alternative, require explicit CSRF and secure cookie design. No wildcard CORS, arbitrary redirects or token in URL. |
| **G07 — Source/key isolation** | Controlled original keyed Word source storage; Q10/Q76 explanation correction and revisions bound to canonical original row and V149 candidate SHA-256; do not commit private answer keys to public repo. |
| **G08 — Teacher academic decision** | A **different** trusted, authenticated, audited scientific/cognitive signoff workflow with NBF and framework checks, evidence, timestamps, and revision invalidation. A `supports-candidate-wording` advisory is NOT approval. |
| **G09 — Scored release gate** | Independent owner-controlled publish/unpublish with two-phase validation, correct key/explanation, score eligibility, SLO moderation, duplicate suppression, rollback and test-selection safeguards. Default 0. |
| **G10 — Staging security and browser QA** | Firebase staging with distinct identities; student/outsider teacher/admin denied, revocation, stale source, replay, rate limiting, CSP, accessible/mobile login, failure recovery, action/audit logs. |
| **G11 — Data/cost operations** | Budget, logs avoiding tokens/PII, retention and backup of audit trails, access review, alerts, quotas, incident disable switch, privacy terms, recoverability. |
| **G12 — Teacher/class enrollment scope** | Trusted class-owner assignments, student enrollment visibility, cohort isolation, saved attempt ownership and no cross-class reads; general-purpose teacher portal not equal to four-item pilot. |

The machine-readable **`quality/unit07/topic71-v160-production-readiness-no-go.json`** records each gate as `BLOCKED` and owner decision `PENDING`. All twelve remain blocked because production evidence is not established in this PR; this does not say the live Firebase project is insecure, only that authorizing its *new teacher workflow* is not supported by the available evidence.

## Proposed staging sequence (a roadmap, NOT executed)

1. **V161:** Owner reviews Option A/B and staging/cost/region requirements. First implement **no-deploy** backend interface contracts and explicit anti-abuse/teacher authorization cases.
2. In a later PR, test *complete private published Rules* against original pathways plus proposed server-only collections without printing source Rules or weakening student security. Securely verify owner-controlled account provisioning and data classification.
3. Introduce **an isolated staging** server/callable with App Check and Auth checks, private audit and explicit default-OFF switch, then test real signed teacher only in staging; monitor costs and denied access. Require fresh owner consent before deploying staging.
4. Only after safe staging, prepare a separately approved production release plan with monitoring, rollback, published-rules comparison and App Check metrics. Never treat public GitHub Pages paths as a privileged endpoint.
5. **Independently and before scored test use**, verify four urgent source corrections plus all 80 teacher science/cognitive approvals, private answer keys, SLO fit and calibrated score release gating.

## PR boundaries and review instructions

**V160 changes exactly four new, non-deploy files:**
`quality/unit07/topic71-v160-production-readiness-no-go.json`,
`quality/grade11-v160-teacher-deployment-security-architecture.md`,
`scripts/audit_grade11_v160_teacher_deployment_no_go.cjs`,
`.github/workflows/validate-grade11-v160-teacher-deployment-no-go.yml`.

The CI verifies immutable no-go flags, source project split, live catalog/manifest holds, and previously merged launch/rules safeguards. The CI is **offline source-only**: green means the **NO-GO is truthful**, **NOT that production is safe or deployed**. No `firebase.json`, `.firebaserc`, Cloud Function/Run service, production `portal/` JS, rules, credentials, or deployment action is introduced.

**Owner:** Review these four files, wait for latest-head CI green, click **Ready for review → Merge pull request → Confirm merge**. There is **no Firebase Console action** and nothing new on the public portal from merging. We will ask separately before creating/deploying live infrastructure.
