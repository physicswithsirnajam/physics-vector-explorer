# V99-H — Reviewable static Grade XI MCQ report reference manifest

## Scope and prerequisite

PR #168 (V99-G) merged into `main` at `1c7b356e8aac1a2ac8c94a3d9ac16073e4af0c03`. It verified genuine Firebase Auth Emulator tokens and the original, complete 2,250-item V55 public practice catalog. V99-H is the next **local/offline source-data boundary**, not a Firebase feature release.

## What this PR creates

- `server/static-review-catalog-v99h.cjs`: a strict reader for a **static JSON data object**, independent of Node VM, browser code, network, Firebase or dynamic source loading. It returns ONLY `id`, `unit`, `sourceQuestionNumber`, `bankVersion`, `publicPractice:true` through an exact-match lookup.
- `scripts/build_grade11_static_review_manifest_v99h.cjs`: a fixed-path, build-only generator using the already-audited V99-G original source reader. It alphabetically sorts IDs within each unit and emits `qa-artifacts/grade11-static-manifest-v99h/approved-public-review-refs.json` for review.
- `scripts/test_grade11_static_review_manifest_v99h.cjs`: independently generates the same manifest twice, compares all 2,250 static lookups against the original source, preserves original lower-case master IDs and Unit 5 `U05B` Set B IDs, and tests deliberate corruption.
- `Grade XI Static MCQ Review Reference Manifest (V99-H)` GitHub Actions workflow: Node 24 source/test execution, **no Firebase emulator, credential, secret, service account, or production database**. It uploads the generated JSON as a 14-day GitHub artifact only after successful tests.

### Complete, already-approved original public source counts

| Unit | Original source references |
|---|---:|
| 1 | 275 |
| 2 | 206 |
| 3 | 220 |
| 4 | 640 |
| 5 | 349 |
| 6 | 560 |
| **Total** | **2,250** |

The generated JSON stores **only**: fixed schema/kind/scope fields, expected unit counts, original per-unit bank versions, an array of `[originalQuestionId, unit, sourceQuestionNumber]` tuples, and the SHA-256 digest of those fields. No question stem, option, correct answer, teacher marking key, SLO, score, full student identity, private account record, or student note is projected.

## Trust and safety

- The SHA-256 digest provides an **accidental-change check, not cryptographic authentication**. Only code-reviewed generated artifacts produced from repository-reviewed source should be trusted.
- The original V55 browser adapter and Node `vm` execute only in **local/CI build-time source extraction**, never in the static lookup module. Node `vm` is not an isolation sandbox. Do not run unknown or student-provided code in this build.
- The static reader checks exact allowlisted field names, public Grade XI status, original unit counts, unique IDs, original source-number/unit prefixes, stable ordering, version presence and content integrity. An unknown ID returns null; runtime use of a future reviewed manifest must additionally pin the repository revision, release path and deployment permissions.
- The output is **generated as a CI artifact; not committed as a live manifest or deployed anywhere**. The next separate PR should select and review the resulting artifact, commit its frozen reviewed JSON, and require source-to-static regeneration parity in CI before any service uses it.

## Explicitly unchanged

No existing MCQ, option, original answer key, scenario, Physics with Sir Najam logo, simulation page, banner, student report button, copy-only warning, Firestore rules, Firebase Console setting, grading, teacher inbox, HTTPS/Callable endpoint, Auth provider, notification or live Firestore data is changed.

## Merge gate

1. Confirm the **latest-head** `Grade XI Static MCQ Review Reference Manifest (V99-H)` workflow is green.
2. Inspect its logs for 2,250 complete references and successful corruption tests.
3. Inspect the `grade11-static-review-manifest-v99h` artifact if desired. This is a public ID-only generated review output, not a deployed resource.
4. Only then select **Ready for review → Merge pull request → Confirm merge**.

The next phase should pin a reviewed generated manifest and test exact revision parity before combining authentication, source lookup and Firestore into a local-only endpoint. No production deployment without explicit approval and complete owner-supplied rules review.
