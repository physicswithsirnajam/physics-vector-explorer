# V100-K — Owner-observed GitHub Pages origin and Firebase App Check baseline

## Verified starting point

PR **#197 (V100-J)** merged into `main` at `dc6c28e8dc525c760c82afcb5fb2948e80ae827c` on 22 November 2026. Its readiness ledger correctly shows that seven real-world production reporting gates are still unmet or unproven. It does not justify activating a student Send button or administrator HTTP service.

Unlike the original V99-W **source-only** candidate hostname, the owner already provided nonsecret factual observations in the portal setup discussion on **22 November 2026**. Do **not** repeatedly request the same information:

| Topic | Owner-reported observation — 22 Nov 2026 | Independent verification by this PR |
|---|---|---|
| Published GitHub Pages project website | `https://physicswithsirnajam.github.io/physics-vector-explorer/` | **No live HTTP check or authenticated Pages settings call** |
| Actual website/browser hostname | `physicswithsirnajam.github.io` | **No live browser or DNS check** |
| Firebase public project | `physics-with-sir-najam-portal` | Cross-checked against checked-in public web config |
| Firebase Web App ID | `1:158078442603:web:b4738a9875a1d5b1c8a52e` | Cross-checked against checked-in public web config |
| **Firebase App Check** enrollment | **Unregistered** | **No independent Console/API read** |
| App Check provider | **None configured** | **No independent Console/API read** |
| Cloud Firestore App Check enforcement | **Not enforced** | **No independent Console/API read** |
| Firebase Authentication App Check enforcement | **Not enforced** | **No independent Console/API read** |
| Whether portal is embedded inside Google Sites | **Not confirmed** | No iframe/outer-page verification |

**Important distinction:** The existing Firebase **Web App is registered for Firebase Auth/project configuration**, but its **App Check enrollment was reported unregistered**. These are different statuses. The Firebase Authentication domain `physics-with-sir-najam-portal.firebaseapp.com` is **not** the confirmed GitHub Pages website hostname. A root request to `physicswithsirnajam.github.io/` may not resolve the repository site; the **`/physics-vector-explorer/`** path matters. The Grade XI sign-in portal's specific deep-link and Google Sites embedding are not asserted as independently verified.

The owner decided to **continue using current GitHub Pages and defer purchasing a custom domain** until a suitable price is available. Registering a custom domain later will require a separate browser-origin/provider allowlist reassessment; this PR makes no domain changes.

## Exactly four new files; no live application edits

1. `scripts/audit_grade11_owner_appcheck_baseline_v100k.cjs`: a read-only, fixed-date owner-observation record checked against existing V99-W source inventory and V99-U Copy-only launch lock. Validates HTTPS, exact observed hostname and repository path, public Firebase ID, default-OFF reporting, owner-reported **Unregistered/None/Not enforced** statuses and no inferred Google Sites embedding. Writes only source-safe, non-secret output. It **never queries Firebase APIs or a real browser**.
2. `scripts/test_grade11_owner_appcheck_baseline_v100k.cjs`: adversarial source and observation changes covering spoofed host/path, HTTP vs HTTPS, Firebase `authDomain` confusion, changed web app ID, false App Check registration, accidental enforcement, fabricated iframe confirmation, unreviewed `CNAME`, silent production App Check initializer and student report Send.
3. `.github/workflows/validate-grade11-owner-appcheck-baseline-v100k.yml`: Node 24, read-only repo access, no Firebase SDK, tokens, keys, Cloud deployment or Firebase Console mutations. Uploads only `owner-observed-preflight.json` with source and owner-observation statuses.
4. This document.

## Next actual provider work — deliberately separated

Once the owner approves a future stage, check the **same live web app ID**, the actual Grade XI **student login page browser origin**, the presence/absence of Google Sites iframe embedding, the relevant reCAPTCHA Enterprise website-domain allowlist, and the current **Firebase Console Security → App Check → Apps/APIs** statuses. A source-confirmed or owner-reported site hostname is not proof that a provider is registered. If the owner later registers a custom domain, re-evaluate hostnames and permitted website key domains first.

**Do not click Register, create a reCAPTCHA Enterprise key, enable App Check enforcement, use an App Check debug token, change auth providers, or connect a real sender in V100-K.** Existing student sign-in, enrollment, saved progress and protected lessons could break if enforcement is enabled without a legitimate tested browser provider. A provider proof must be genuine and not synthetically asserted. Source and owner observations alone do not authorize a production deployment.

No administrator accounts, real student identities, MCQ answers, real issue notes, private published Firestore policy text, keys, tokens, credentials, Firebase Rules or DNS are inspected or modified. **Student issue reporting remains Copy only.** The offline review desk remains entirely fictional.

## Merge gates and future evidence

Keep **Draft** until both exact PR-head checks are green:

- **Grade XI Owner-Observed GitHub Pages and App Check Baseline (V100-K)**, including mutation tests and the explicit date/provenance flags.
- **Grade XI App Check Reporting Launch Lock (V99-U)**, proving the current student issue-report control is still Copy only and no backend sender or App Check enforcement is introduced.

Review all four files, inspect the nonsecret artifact, and confirm every real-production field remains **false/blocked**. The owner alone chooses **Ready for review → Merge pull request → Confirm merge**. No Firebase Console or GitHub Settings action is required to merge this PR, and no domain purchase is necessary.

After the merge, we can use the now-grounded GitHub Pages host in a **separate owner-approved provider preparation stage**; do not mistake this evidence snapshot for live-provider readiness.
