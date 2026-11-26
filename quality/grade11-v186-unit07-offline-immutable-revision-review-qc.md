# V186 — Isolated immutable candidate revision and teacher review protocol (SYNTHETIC TEST ONLY)

**Decision: NO-GO for real authentication, Firestore persistence, production/staging deployment or scored student use.** V186 is a strict local prototype, not an academic approval workflow. The names, candidate question text, original-source hash stand-ins, teacher identities and evidence hashes in tests are **synthetic**, not drawn from the owner's six private keyed Word files.

## Verified baseline and why this matters

- **PR #289/V185** merged to main at `e71c46919aa571c08bc38e9a1802c341808b9cc7`.
- **274** original Unit7 source identities had previous first-pass review; **72** distinct original owner MCQs were selected for private detailed candidate work in V179–V184. The remaining **202** still lack a separate candidate sheet.
- **Zero of the 72** has an actual individual candidate immutable revision SHA-256 stored in the public V185 ledger. That ledger carries **original source-row fingerprints** and **whole Word-pack fingerprints**, not exact separate revised stem/options/key/explanation/figure hashes. We explicitly preserve these 72 missing digests; no fabricated hash or synthetic digest is assigned to a real owner question.
- Real independent teacher science, cognitive and scoring signoffs remain **PENDING**, and **zero Unit7 items** are approved or added to the scored Test Builder. Our original 2250 Grade XI MCQs and Unit6 560 teacher-pending controls are untouched.

## What this local protocol actually proves

A pure, nonnetworked Node helper and synthetic test suite implement an *offline* proposed candidate revision contract:

1. **Source binding and exact revision:** the exact prefixed Unit7 source ID and existing source-row SHA-256 are inputs, together with the proposed independent candidate stem, four options A–D, one selected key, answer explanation, proposed SLO, actual K/U/A label, and either `null` or diagram-content, accessible alternative text and permission-evidence digests.
2. **Canonicalization and deterministic hash:** strict allowlisted schema, fixed key order, UTF-8, NFC text normalization, CRLF-to-LF normalization, versioned SHA-256 domain separation. Identical content with differently ordered object properties hashes the same; meaningful changes to options, key, explanation, SLO, cognition or figure binding produce a **different** revision. This digest identifies bytes/content for a proposed item: **it cannot establish that the science is correct, the diagram is licensed, the textbook is verified, or the teacher approved it.**
3. **Synthetic role and stage checks:** source-check must precede scientific approval; cognitive review requires a distinct simulated cognitive reviewer; a different simulated owner records the final *synthetic authorization stage*. The local fixture's directory can deactivate a test reviewer. This is not Firebase Auth, does not verify real identity or App Check, and its data must never be treated as trusted browser-supplied authorization.
4. **Stale-version and revocation protections:** any action referencing an old candidate digest is denied; an owner-style *synthetic* revocation clears approvals and blocks the old revision. A new source-bound revision requires all checks again; no carry-forward of old decisions.
5. **Local audit tamper detection:** synthetic append-only event records include previous-record hashes. Tests catch partial edits; **a plain SHA-256 hash chain with no trusted signing or immutable server log is not tamperproof** against a privileged attacker who rewrites the entire chain. Production would need trusted audit ownership, stable authenticated identities, storage protection and monitoring.
6. **Unconditional scoring denial:** regardless of how many synthetic approvals are simulated, the protocol reports `studentScoringEligible: false`, `scoredRelease: HOLD`. There is deliberately **no API route, callable function, Firebase SDK, student UI import, or publication mechanism** in this PR.

The synthetic inputs are not academic content. No real source answer, keyed owner item, source photo, student or actual reviewer is embedded in scripts or Actions logs. The test output is **counts-only**, not a proposed real teacher verdict.

## Test coverage and failure handling

The verifier checks deterministic SHA-256 digests across property reordering and Unicode newline normalization, and rejects malformed source identities, malformed hashes, duplicated answer options, absent fields, extra fields, missing explanation, unsupported SLO/cognition, unlicensed-figure-metadata structure, impersonated command roles, inactive actors, out-of-order decisions, stale revisions, evidence corruption, unauthorized owners, decision duplication, revocation and changed candidate reuse. It checks that the synthetic audit chain detects tampered events.

It then reopens the existing public V185 **72-item HOLD register**, and explicitly asserts: no per-item actual candidate digests, no real independent teacher approvals, no Unit7 scored questions, and all V160/V161 backend NO-GO statuses. Prior V185–V154 workflows and original Grade XI/Unit6 bank gates also run.

## Requirements before a real teacher decision or any scored release

**This PR does not meet these requirements.** A future protected deployment requires: independent owner consent to hosting/billing/architecture; separately provisioned staging; real signed-in verified teacher/owner directory with server-side role and revocation enforcement; verified current production Firestore security rules; actual App Check enforcement on intended origin and callable API; secure private storage of each exact candidate revision and answer key; independent science and SLO review; authorized picture rights and accessibility; immutable/auditable server-owned decision records; protected consent for student assessment publication; and rollback.

In particular, the user's **actual private Word packs** are not individually hashed or imported by V186, and the six Word-pack SHA-256s cannot substitute for per-item candidate revision proof. Do not copy sensitive private answers into public GitHub to make the test pass. The owner may later supply a protected item-level manifest via a suitable secure deployment workflow, but no such credential/service or authenticated action exists in V186.

The original NBF **p114 polymer examples**, **p115 cubic-unit-cell illustrations**, **Example 7.2 bone-shortening source**, and the Fig7.13 apparatus stimulus remain pending for source-specific clearance. A source revision hash or green CI does not settle these textbook questions.

## Exactly five files, no changed live source

1. `quality/unit07/unit07-v186-offline-protocol-design-no-deploy.json`: explicit synthetic-only status, schema/scope, 72 missing individual digests, NO-GO deployment and no scored release.
2. `quality/grade11-v186-unit07-offline-immutable-revision-review-qc.md`: this source-derived design and scientific/approval limitations.
3. `scripts/unit07_offline_revision_protocol_v186.cjs`: isolated canonicalization, SHA-256 candidate revision, synthetic role/stage/revocation state machine and tamper-evident-but-not-signed local audit.
4. `scripts/test_grade11_unit07_offline_protocol_v186.cjs`: invented fixture with negative and positive protocol cases and real **public metadata only** regression checks.
5. `.github/workflows/validate-grade11-v186-unit07-offline-review-protocol.yml`: new local protocol QA, legacy V185–V154 audits, prior 2250 source identity/Unit6 560 signoff and backend/App Check no-score gates.

**No Firebase configuration, rules, live teacher role, staging/production backend, original owner files, question text/keys, public student-scored bank, student record, or deployment changes** are introduced. No run is allowed to publish or authenticate a question.

## V187 and owner merge procedure

Next, prepare a **private item-level candidate manifest** and an explicit owner-approved pathway for actual teacher decision intake, still with source image/licensing and summative SLO decisions separately verified. The local experiment is neither sufficient for academic correctness nor a substitute for verified real auth/App Check/Firestore rules.

Keep the draft PR until the **exact latest-head** checks are green. Inspect five files in **Files changed**, select **Ready for review → Merge pull request → Confirm merge**. If any check is failed, stale or pending, do not merge. No Firebase Console, billing, domain, or teacher-account action is needed for V186.
