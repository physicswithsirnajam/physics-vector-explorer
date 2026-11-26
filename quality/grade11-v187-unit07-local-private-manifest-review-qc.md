# V187 — Private candidate revision manifest intake (local only, no academic approval)

**Decision: NO-GO for live teacher approval, Firebase deployment, publishing original/revised questions, and scored Unit7 Test Builder.** V187 creates a local, nonnetworked method for a future exact private candidate to receive a revision fingerprint. **No actual user-authored private answer pack has been imported or processed in this PR.** All tests use **invented synthetic data**.

## Verified source boundary and readiness

- PR **#290/V186** merged into `main` at `680f831a5df2fb918242ae1a91fff8a2c6418f50`. That milestone established an invented-only, isolated revision-hash and review-state prototype. It was not a real Firebase authentication/authorization service.
- V185 retains **72 distinct original MCQ source IDs** in the owner review queue, from a broader Unit 7 first-pass inventory of **274** original items. **202** of the 274 have not had a separate private candidate page drafted.
- V186 tested canonicalization on a synthetic example. V187 advances this to a **strict local input/output boundary** while continuing to use the exact V185 original source-row SHA-256 to reject source substitutions.
- The publicly stored **original source-row hashes** and the six whole Word-pack hashes do **not** identify the exact revised stem/options/key/explanation for one candidate. We cannot fabricate any actual per-item revision digest from those existing hashes. Actual private candidates will need to be read from their owner's protected private materials when supplied for that purpose.

## How the offline manifest tool is designed

The file `scripts/unit07_private_candidate_manifest_v187.cjs` reads one **private JSON** input located **outside the GitHub repository**, checks at most **12 candidate revisions**, and writes a keyless digest manifest to a *new* JSON path outside the repository. It uses the trusted **read-only V185 source index**, strict question schema and versioned canonicalization logic from V186.

A private input file must contain exactly `schemaVersion`, `version`, `unit`, and `candidates`. Set the first three to `1`, `"V187"`, and `7`. The `candidates` array contains **1–12** full revised MCQ candidate objects. Each candidate has exactly:

`sourceId`, `sourceSha256`, `stem`, `options` (four A–D strings), `correctOption`, `explanation`, `slo`, `cognitive`, and `diagram` (null, or SHA-256 of actual image content, alt text, and permission-evidence SHA-256).

**These fields include the actual keyed answer and are PRIVATE.** **Never upload the private JSON input or its derived keyless manifest to a public GitHub repository, pull request, Actions log, or classroom portal.** Do not create such a JSON inside public GitHub; do not paste actual keyed text into a pull request or Actions log. Filling the private JSON is **not** automatic extraction from the previous six Word packs. Any later actual input must be explicitly inspected and transcribed/converted in a protected environment, with a human checking that all candidate choices and calculations match the intended revision.

For a private machine with Node available, the intended invocation (after the private candidate JSON actually exists) is:

```bash
node scripts/unit07_private_candidate_manifest_v187.cjs "/absolute/private-folder/unit7-candidates.json" "/absolute/private-folder/unit7-keyless-manifest.json"
```

The first path is read-only; the second must be a **new location outside the repository**, not an existing file. The tool refuses an input or output inside the repository, even via an existing symlinked path. It limits private input to 512 KiB, writes the manifest with owner-only mode **0600 on Unix-like systems**, and never prints stem, options, keys or input file contents to the terminal. Windows file privacy is controlled separately by filesystem ACLs; a Unix `0600` mode alone is not a Windows security guarantee.

The output contains only each exact source ID, original source SHA-256, candidate revision SHA-256, source-evidence flags and **PENDING/HOLD** decisions. It intentionally contains **no question stem, options, key, solution, or teacher identity**. Still, because hashes are derived from private content, **treat even the keyless output as private**. Neither input nor output is automatically uploaded to GitHub, copied to Firebase, converted to a live bank or sent to ChatGPT.

### Why source bindings and revision hashes are necessary but insufficient

A digest can attest which byte-normalized candidate data was presented; it **cannot establish** that the answer is right, the three wrong options are valid, a diagram is licensed, the exact book figure agrees, or a teacher approved the item. The output marks `sourceEvidenceClearance: NOT_ATTESTED`, `candidateScienceVerified: false`, `candidateCognitiveVerified: false`, all teacher/owner authorizations `PENDING`, `eligibleForScoredTestBuilder: false`, and `scoredRelease: HOLD`. Even a valid local manifest grants **zero** real academic signoffs.

The source registry is read from GitHub checkout as metadata and is **not an authenticated teacher directory**. A malicious actor can rewrite an untrusted local manifest. Before real usage, we need an owner-approved secure private input store, actual authenticated teachers with revocable roles, version-bound decisions, server-owned audit logs, verified Firestore Rules and genuine App Check enforcement; V160/V161 **NO-GO** remains in force.

## Synthetic-only tests

The V187 test suite uses two **invented** questions and existing public *source IDs/hashes* to prove that content changes produce new digests, while no key/option text appears in the output. It rejects duplicate candidates, unknown source IDs, changed original source fingerprints, unsupported fields, broken SLO/cognition/answers, more than 12 records, forged score flags, file overwriting, repository input/output paths and invalid local JSON. Temporary test files are created outside the repo and removed after testing.

The tests recheck the real **72 source queue rows** remain unchanged, with 72 missing actual candidate digests, zero teacher approvals, zero scored releases, and no added `question-bank/grade-11/unit-07.json`. CI also runs V186/V185 through previous academic protections and the 2250 older Grade XI and 560 Unit6 controls. **Green CI means only the synthetic/local protocol and public no-score invariants passed—not that 72 real question revisions were processed or independently verified.**

## Textbook and scope issues still outstanding

As before, owner-provided NBF printed **p114** polymer examples, **p115** cubic cell diagrams, and the original **Example 7.2** bone-shortening values have not been reverified in this phase; the prior figure/apparatus accessibility concern is also pending. These are source provenance blockers, not solved by a content hash. Actual FBISE summative SLO/real K–U–A decisions remain subject to question-level academic checking.

## Exact changes and next milestone

**Five additive, nondeploying files** only:

1. `scripts/unit07_private_candidate_manifest_v187.cjs` — local private JSON to keyless private SHA manifest, strict outside-repo protection.
2. `scripts/test_grade11_unit07_private_manifest_v187.cjs` — synthetic input/output, tampering/permission and public HOLD regression tests.
3. `quality/unit07/unit07-v187-local-private-manifest-contract-no-deploy.json` — honest no-real-input/no-scoring contract.
4. `quality/grade11-v187-unit07-local-private-manifest-review-qc.md` — this owner-readable guide and academic constraints.
5. `.github/workflows/validate-grade11-v187-unit07-local-private-manifest.yml` — local invented-fixture CI plus earlier source/security protections.

No original author Word files, actual private candidate pack, Firebase Rules, teacher credentials/roles, production or staging backend, scores, student enrollment, or live scored bank are altered.

**V188** should begin a *small, owner-controlled private pilot* with 1–12 actual revised candidates only after exact private data and source pages are available in a protected workflow. Before allowing any live review or student release we still require independently verified physics, academic SLO approval, secure revocable teacher roles, auditability and an explicitly authorized backend deployment.

**Owner steps for this PR:** leave Draft until **both exact latest-head checks GREEN**. Review five changed files, select **Ready for review → Merge pull request → Confirm merge**. No local Node run, Firebase Console change, private data upload, domain purchase or billing action is needed to merge this local-protocol milestone.
