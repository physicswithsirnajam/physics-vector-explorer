# V161 — Proposed staging callable contract for Grade XI Topic 7.1 teacher review (NO-GO / NO DEPLOY)

**Status at 25 November 2026: DESIGN ONLY, NOT DEPLOYED.** V160/PR #261 is merged. All **12 production gates G01–G12 remain BLOCKED**, and neither real staging nor production deployment is authorized. The reason for this PR is to prepare a **source-only, machine-checkable interface contract** without creating a live Cloud Function, modifying GitHub Pages, or changing Firebase Console.

The academic baseline remains **80/80 Unit 7 Topic 7.1 MCQs pending teacher science/cognitive signoff; zero scored Unit7 MCQs**. Q10 and Q76 original keyed explanations require verified correction; Q15 and Q62 revised stems require approval. A wording recommendation is **not academic signoff, not a correct answer key and not a release decision**.

## Confirmed context, limitations and cost decision

The owner-reported existing website is **GitHub Pages**, at `https://physicswithsirnajam.github.io/physics-vector-explorer/`. Public web configuration points to Firebase project `physics-with-sir-najam-portal`. The previous teacher pilot instead uses synthetic `demo-psn-v143-classrooms` with localhost emulators and **refuses real projects**. There is no Firebase Functions deployable package, no `firebase.json` / `.firebaserc` in the current repository baseline, and no approved live teacher role provisioning.

V160 compared two architectures. This contract evaluates **Option A first** (keep GitHub Pages, add a separate protected Firebase Functions callable) because a teacher backend does not itself require migrating the public learning site. It is an **evaluation preference, not an owner selection or deployment authorization**. **Option B**, Firebase Hosting with a same-origin backend rewrite, remains open for a later owner decision.

Current Firebase documentation confirms that **v2 HTTPS Callable / onCall** requests can carry Firebase Auth and App Check context through the Firebase client SDK. The future handler must use a verified *server/framework-provided context*; **never trust a browser body containing a self-declared uid, teacher claim, App Check success, or source-key approval**. For a sensitive callable, `enforceAppCheck: true` is a required design condition; consuming App Check tokens for replay protection merits evaluation for writes, including latency and service permissions. Enforcement evidence must come from actual staging, not from a JSON flag. See <https://firebase.google.com/docs/functions/callable> and <https://firebase.google.com/docs/app-check/cloud-functions>.

The callable candidate should have an **explicit exact CORS origin allowlist**: eventual known GitHub Pages browser **Origin** `https://physicswithsirnajam.github.io`, **without** the `/physics-vector-explorer/` path. The current staging origin is deliberately **empty/unapproved**. In Cloud Functions v2 callable configuration, unrestricted CORS defaults must **not** be silently accepted. If the owner selects a staging URL, a specific allowed origin must be approved and tested; an arbitrary `*` or copied production origin is unsafe.

Firebase Cloud Functions may require the **Blaze plan / linked Cloud Billing**. No assumption is made about the owner's actual billing tier. Do not upgrade the project, start a billable service, select a region or configure IAM without explicit owner approval and agreed budget alerts/quotas. See <https://firebase.google.com/docs/projects/billing/firebase-pricing-plans> and <https://firebase.google.com/docs/functions/quotas>.

## Two future callable operations — not handlers

All types below describe the **payload inside a Firebase Callable's `request.data` and resolved result data**, not raw HTTP endpoints. Native Firebase callable protocol envelopes, Auth/App Check verification and Firebase SDK error mappings belong to the future implementation.

### 1. `listTopic71ReviewCandidatesV1` — read-only

- Request data: **empty object** only. Authentication and App Check belong to trusted SDK/framework context, **not** to client-supplied `data`.
- Reply: exactly **four** authenticated-reviewer rows for **Q10, Q15, Q62, Q76**: `questionId`, `sourceNumber`, question-only `stem`, exactly four `options`, original full-row and candidate SHA-256, fixed issue code, `explanationRepairStillRequired`, caller's own already-recorded `recommendation`, `teacherAcademicSignoff=PENDING` and `studentScoredRelease=HOLD`.
- No owner answer letters, keyed source explanation, student PII, another teacher's review or private audit row. A Firestore browser SDK must **not** gain direct access to review/audit collections.

### 2. `recordTopic71WordingRecommendationV1` — immutable advisory-only

- Request data: exact four fields `questionId`, `originalSha256`, `candidateSha256`, `recommendation` (no extra fields). The only permitted IDs are `XI-U07-T071-Q010`, `Q015`, `Q062`, `Q076` using full canonical prefix. Both hashes must match **server-loaded** canonical source/candidate fingerprints, not whichever hash the browser asserts.
- Recommendation values: **`supports-candidate-wording`** or **`needs-revision`**, never `approve`, `publish`, `correctOption`, `teacherApproved`, `sourceAnswerKeyCertified` or any custom body field.
- Success result: `{ok:true, questionId, status:"advisory-only", alreadyRecorded:boolean, academicSignoff:"PENDING", scoredRelease:"HOLD"}`. Existing exact retry is **idempotent**; conflicting recommendation is rejected; an edited source revision invalidates the earlier review.
- One transaction creates the revision-bound review and an append-only private audit record, with no answer key. Advisory review has **no permission path** to the private keyed source, academic approval or Student Build My Test release.

Both operations require a current verified Firebase Auth identity, verified email, active/not-disabled user, trusted `teacher:true` role **and not admin by default**, server-owned reviewer allowlist, and administrator-managed active teacher-directory record. A revoked user, nonreviewer teacher, student or administrator without explicit separate teacher privileges must receive a denial. Future full classroom features require additional owner-class membership checks. Server-side authorization is mandatory because **Firebase Admin SDK bypasses client Firestore Security Rules**.

## Threat cases, failure modes and testing expectations

The contract includes **16 explicit negative scenarios (T01–T16)**: anonymous/expired tokens, absent App Check, student/outsider/admin, revoked teacher, forbidden Origin, forged body fields, nonpilot question, stale fingerprint, conflicting review, rate limits, disabled service, attempted private key/student access, attempted scored approval, and directory/database outages. All are **deny-by-default**.

For future v2 callable errors, use a tight set of SDK-supported codes (`unauthenticated`, `permission-denied`, `failed-precondition`, `already-exists`, `invalid-argument`, `resource-exhausted`, `unavailable`, `internal`). Return minimal safe details: never leak stack traces, email, uid, Auth/App Check JWT, correct choice or keyed explanation. Use structured server logs that omit tokens/answers/PII, with owner-approved retention and alerts. Rate limits and replay control are separate **runtime** duties; this V161 source-only check does not implement or prove them.

### Regression and misuse testing in this PR

`scripts/audit_grade11_v161_staging_callable_contract.cjs` validates the whole machine-readable contract against the merged V160 NO-GO, V154 80-pending source ledger, original V149 question-only TSV, Grade XI 2,250 provisional MCQs, Unit6 560 pending signoffs and Unit7 0 scored catalog. It refuses missing source-version checks, weakened role checks, direct browser Firestore access, nonempty staging origins, billing/deployment flags or answer/approval payload fields.

`scripts/test_grade11_v161_staging_callable_contract.cjs` mutates **at least 55** safeguards in isolation—including wildcards in CORS, false owner billing consent, forged roles, altered original SHA, "teacher approved" return, removal of atomic audit, optional App Check, unauthorized question IDs, runtime switch ON, stale revision acceptance and signed-off scoring—and confirms the contract audit fails.

**These are offline schema/mutation tests, not Firebase authorization, penetration testing, proof of current Console settings, or actual deployed staging endpoint tests.** V155–V159 already cover local synthetic Firebase/Chromium behavior; the next stage must validate the future real function in owner-approved **isolated staging**, not pretend the offline design is a live service.

## No-deploy boundaries: explicit owner sequence

- **G01 / G02**: Owner selects Option A/B, staging Firebase project/region, Blaze cost and alert limits, acceptable release window and rollback; only then can an isolated staging backend be considered. No deploy through this PR.
- **G03 / G04 / G05 / G06**: Verify owner-controlled role grants, current private production Rules (and staging equivalent) without publishing them, real provider App Check attestation, and exact permitted browser Origin / callable CORS.
- **G07 / G08 / G09**: Store source keys privately, independently correct Q10/Q76 original explanations and approve Q15/Q62 revised stems, then teacher-verify all individual items. Build an **entirely different** academic signoff/release mechanism. Zero scoring until separately approved.
- **G10 / G11 / G12**: Staging abuse/revocation/mobile tests, quotas/log retention/incident plan and teacher/class/student isolation. In all cases student data ownership and current exam resources must not be affected.

The V160 register remains **NO-GO with G01–G12 BLOCKED**, whether or not this V161 PR is merged. The real Firebase project, App Check, Firestore Rules, GitHub Pages, custom domains, user accounts, grades, original source Word and MCQ datasets are **not changed**.

### Exactly five non-deploy V161 files

1. `quality/unit07/topic71-v161-staging-callable-contract-no-deploy.json`
2. `quality/grade11-v161-teacher-staging-callable-architecture.md`
3. `scripts/audit_grade11_v161_staging_callable_contract.cjs`
4. `scripts/test_grade11_v161_staging_callable_contract.cjs`
5. `.github/workflows/validate-grade11-v161-teacher-staging-callable.yml`

The workflow runs only offline checks and preserved release-lock regressions—**no Firebase SDK, credentials, network backend calls, staging Cloud Function or deployment**. On latest-head green, inspect all five changed files → Ready for review → Merge pull request → Confirm merge. **No Firebase Console action.**
