# V99-T — Private Owner Console Snapshot Comparison (READ ONLY)

## Verified prerequisite

PR #180 (V99-S) merged at `c1e592a4a1bfcec58b5a7f6ccd6dab6d18d4000a`. Its GitHub Actions test passed **213** synthetic allow/deny cases against the *owner-supplied* complete 227-line Firestore rules baseline with only three new **server-only/browser-deny** collection proposals. The source text was held in the existing encrypted `PSN_FIRESTORE_BASELINE_RULES` GitHub Actions secret and was never published.

**Important remaining uncertainty:** This 227-line owner-supplied policy may be different from the exact rules currently PUBLISHED in Firebase Console. We have no authenticated Firebase read endpoint available in this GitHub workflow; a Firebase web client API key cannot fetch production Security Rules. The installed Firebase plugin is not exposing a Firestore rules-read operation in this session. Hence **this PR does not claim independent live-rule retrieval**.

## Scope — exactly four new files

1. `scripts/compare_grade11_published_rules_snapshot_v99t.cjs` — no-network, no-Firebase parser. Receives **two encrypted secret values**: the original owner baseline and a newly copied *published rules* snapshot. It strips a BOM, normalizes CRLF/CR to LF, removes trailing blank lines and computes SHA-256. Before comparing, it **requires the original baseline SHA `c3d5ee6286b006510fd793cd18467493f2e7eccf3f17437182bcb0fd9d43ec39` and exactly 227 lines**. A mismatch, missing value, unexpected original or invalid input results in a **hard failure**, with no rules source printed. The only retained artifact records equality flags and counts, not text. A matching result is a **copy comparison based on an owner-attributed Console snapshot**, not a direct API verification of its provenance.
2. `scripts/test_grade11_published_rules_snapshot_v99t.cjs` — wholly synthetic, no-secret tests covering BOM/newline normalization, one-word permission differences, pinned-baseline refusal, size/type limits, missing new secret and failure-log redaction.
3. `.github/workflows/validate-grade11-private-published-rules-v99t.yml` — read-only GitHub Actions job, Node 24, no Firebase SDK or emulator, and **no deploy command**. It requires both private repository secrets for the final verification and blocks merging until the comparison passes. The synthetic unit tests alone are not sufficient.
4. This review note.

## One-time owner action required — Firebase Console VIEW ONLY

After reviewing the four-file diff, the owner must complete these steps **without modifying Firebase**:

1. Open <https://console.firebase.google.com/> and choose the existing **Physics with Sir Najam portal** project. Its known public project ID in `portal/firebase-config.js` is `physics-with-sir-najam-portal`; confirm this in the Console rather than selecting a similarly named project.
2. Open **Build → Firestore Database → Rules**.
3. Confirm the displayed text is the **currently published, active rules**, *not unsaved draft text*. If possible, note the active published revision/time privately. Select and copy the **entire displayed published rules text** from first to last line. **DO NOT click Publish or edit any text.**
4. Open <https://github.com/physicswithsirnajam/physics-vector-explorer/settings/secrets/actions> and select **New repository secret**.
5. Enter the exact name `PSN_FIRESTORE_PUBLISHED_RULES_SNAPSHOT`, paste the full current published rules **text only** as its value (not JSON/base64, not a screenshot), and select **Add secret**. **Never paste a Firebase service account, API access token, student data or passwords.** This snapshot is private policy text; do not submit it in a public issue, PR comment or file.
6. Tell ChatGPT **“Pal, the published-rules snapshot secret is added.”** The connected GitHub integration can then **re-run the failed V99-T GitHub Actions job** and check its exact-head result. Alternatively, in PR #181, use **Checks → Re-run failed jobs** after adding the secret.

### Why the first CI run is deliberately red

The new secret **does not exist until the owner creates it**. A missing snapshot must cause a **red** job; it cannot be replaced with a guessed, synthetic or previously submitted baseline, because that would create a false assertion of live readiness. The unit tests may pass first, but the full gate is not green until both encrypted inputs exist and compare exactly.

### Outcomes

- **MATCH:** The two supplied texts are byte-equivalent after the stated BOM/newline/trailing-blank normalization. This provides *owner-attested* evidence that the copied published snapshot matches the previously tested policy. Still requires confidence that the owner selected the right Firebase project and active published revision. Next release phases remain blocked by real App Check positive verification and backend deployment controls.
- **MISMATCH:** Stay Draft. The owner must privately inspect the active Firebase Rules history and reconcile the difference before considering *any* policy update. Do **not** automatically replace currently published rules with the older baseline or try to force a passing hash.
- **UNAVAILABLE:** Stay Draft. No shortcut, temporary open rules, public paste, or fake credential should be used.

## Why this cannot certify the full production system

Even with a passing owner-copied snapshot comparison, the test does not independently fetch the live rule revision via a privileged Firebase API; verify actual published Storage rules; prove actual Firebase App Check web attestation; provision real administrator custom claims or UID allowlists; certify production HTTPS ingress, cost limits, CSRF/CORS, privacy handling, logs and rollback; or activate a student Send action or administrator inbox.

No existing MCQs, answers, unit content, user data, website styling, authentication settings, original policy or GitHub secret values are altered by this PR. **No production deployment.**

## Review and merge gate

Keep **Draft** until:
- both source and test code are reviewed,
- private Console snapshot secret has been added **by the owner**,
- the latest-head `Grade XI Private Published Rules Snapshot Gate (V99-T)` job is **green**, and
- the owner confirms the copy was taken from the **active published Firestore Rules** in the correct Firebase project.

Only after that should the owner select **Ready for review → Merge pull request → Confirm merge**. This is a provenance/reconciliation milestone, not production approval.
