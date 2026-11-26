# V190 — Unit 7 revision-bound teacher decision controls (SYNTHETIC, NO-GO DEPLOYMENT)

**Decision: TEST HARNESS ONLY — NOT an authenticated teacher-approval system and NEVER a scored student question release.** The predecessor PR #293 / V189 was confirmed merged to `main`, commit `b87a74e8fa7ca059ca6fcfa979c1b50c3a542df7`.

V189 created an important distinction in the first actual two private-pilot MCQs:
- **Topic7.1 Q22 (`XI-U07-T071-Q022`)**: the randomly oriented polycrystalline grains/isotropy explanation is physically defensible under appropriate assumptions, but is **SUPPORTING-ONLY**, not direct evidence for official summative P-11-B-22 structural distinctions.
- **Topic7.1 Q25 (`XI-U07-T071-Q025`)**: the amorphous short-range order versus extended periodicity physics is defensible and a more direct B-22 Understanding candidate; the earlier distractors needed improvement, and the **V189 revised Q25 private candidate has a different confidential revision digest**. Neither item has independent authenticated academic approval.

The official FBISE **2025 HSSC-I Physics assessment framework** previously consulted defines **P-11-B-22 as Summative / Understanding** for distinguishing crystalline, glassy, amorphous and polymeric solids. The two IDs retain their original source-row fingerprints (`4632066b3e8eff54029b85cebfdebb823f9e3364e64cb9c15b0905691c1e0dd3` and `27d9b15ebe860eca6b4788d6420db4230e6266295027ef01d28ca2383a7f5353`). The scope policy is **hard-coded for this synthetic test**, not taken from a client-provided claim.

## What the V190 synthetic module tests

The local, pure Node `scripts/unit07_revision_bound_review_v190.cjs` accepts an existing public source ID, its exact original row SHA-256, and a **synthetic** 64-character revision digest. The actor directory is a fake, in-memory test fixture. It does not receive original or proposed question text, any real teacher identity, Firebase Auth token, App Check attestation, private V189 SHA, or student data.

- **Source/identity lock:** a reviewer cannot switch the source original or inject another source row SHA by editing a command. Q22 stays supporting-only even if every simulated review stage succeeds. Q25 stays **promising but teacher-PENDING**, never scored.
- **Revision lock:** every decision references an expected current item digest and an expected sequential event number. A stale revision, duplicate action, altered sequence or client-command role field fails closed. **Replay prevention** rejects an old event sequence, reusing a withdrawn candidate digest, or repeating a completed decision stage. Superseding a revision resets earlier reviews; reusing an older candidate digest is denied.
- **Mock separation of duties:** a science reviewer verifies source and physics, a separately role-tagged cognitive reviewer checks proposed assessment scope, and a distinct owner-style fixture acknowledges the result. These are *simulation stage labels*, not real science signoffs or permission to publish.
- **Revocation:** a mock owner can revoke the exact revision, clearing prior stages. Disabling a mock reviewer also invalidates all simulated recorded decisions; a revoked reviewer cannot continue an approval chain. A new revision requires source, science, cognition and owner stages again.
- **Audit trace:** synthetic append-only event records carry prior-event hashes, and tests detect a modified record. This **hash chain is not server-signed or genuinely tamperproof** against an actor who can replace its whole local contents. Production requires trusted storage, credentials, server timestamps and an independent audit/monitoring policy.
- **Hard score gate:** `realAuthenticationVerified: false`, `backendSecurityGatesVerified: false`, `realTeacherApprovalGranted: false`, `realOwnerScoringAuthorizationGranted: false`, `eligibleForScoredTestBuilder: false`, and `studentScoredRelease: HOLD` are unconditional output fields, even if all synthetic stages are completed.

The tests use invented SHA-256 values (`a...`, `b...`, `c...`) and invented mock actors/evidence digests. **No real V188/V189 confidential candidate digest or keyed answer** is included in GitHub. A green CI run proves only these local invariants and the public review metadata, **not** the physics of the withheld questions or an authenticated academic verdict.

## Prerequisites for later secure real approval — ALL currently unresolved

1. Protected private storage for each actual candidate revision, source fingerprint and any diagram permission evidence, with verified content-hash correspondence and no public answer-key leakage.
2. Authenticated teacher/owner role provisioning, revocation and enforced separation of science, cognition and scoring decisions at a trusted server boundary; never trust role or approval claims in browser/client JSON.
3. A secure, version-bound compare-and-set mechanism on each actual candidate with immutable, monitored server-owned audit records, rejection of stale or repeated decisions, and revocation propagation.
4. Independent examination of one correct answer and all distractors, student-friendly accessible stimulus, actual NBF source examples, and **exact summative FBISE SLO plus real cognitive demand**. Q22's *supporting-only* scope cannot be silently promoted by a technical approval check.
5. Verified deployed Firestore Rules, actual App Check enforcement, signed-in teacher identity and explicit owner authorization to staging architecture, hosting/billing and finally any production scoring release. Previous V160 and V161 remain **NO-GO**.
6. A separate student content/publication gate with rollback and source-evidence tracking; enabling test-building or generating PDFs is not equivalent to approval of each academic item.

**Current reality:** 274 original Unit7 source identities inventoried, 72 privately drafted candidates, two previously privately fingerprinted pilot revisions (Q25 then revised again), **zero authenticated academic approvals and zero scored Unit7 student items**. The public V185 queue still has null individual candidate hashes, because their confidential values have not been imported by an authorized secure service. NBF p114, p115 and Example 7.2 source checks and apparatus diagram permissions elsewhere remain outstanding.

## Five public nondeploying additions

1. `scripts/unit07_revision_bound_review_v190.cjs`: offline synthetic source-policy, actor role, decision-sequence, revision-change and revocation logic.
2. `scripts/test_grade11_unit07_revision_bound_review_v190.cjs`: synthetic attack/positive paths, original two-source alignment and all existing academic scoring HOLDs.
3. `quality/unit07/unit07-v190-offline-decision-contract-no-deploy.json`: keyless strict implementation and release boundary.
4. `quality/grade11-v190-unit07-offline-revision-bound-decision-qc.md`: this scientific/security-readiness memo.
5. `.github/workflows/validate-grade11-v190-unit07-revision-bound-decision.yml`: new validation with V189–V154, source, older Grade XI pinned question identities, Unit6 560 teacher-pending and App Check/backend NO-GO regression checks.

**No Firebase Rules, Auth, custom claims, App Check settings, API, teacher account, school/student record, production/staging deployment, original source Word, private keyed review ZIP, live scored question bank or billing configuration is created/changed.** No actual teacher approval is recorded.

**Next V191:** construct an owner-reviewed, protected decision specification for the *actual privately held* Q25 revision, including source evidence, reviewed distractors, exact digest, immutable decision and revocation policy, still without public keys or deployment. Academic decisions require a real teacher's explicit participation and a separately approved secure backend, not a synthetic Node result.

**Owner action:** keep the PR in Draft until both latest-head checks are GREEN. Inspect exactly five files under **Files changed**, select **Ready for review → Merge pull request → Confirm merge**. Do not merge red, stale or pending checks.
