# V99-I — Frozen Grade XI public MCQ review references (2,250 entries)

## Verified prerequisite

PR #169 (V99-H) merged at `6d96480c33e55d07e07d00457be805b4fc46a94f`, with its local, deterministic 2,250-reference generator and offline static-schema integrity tests passing. That PR generated a review **artifact** but did not yet commit a frozen data file.

## What changed — source-preserving and not deployed

1. `server/review-manifests/grade11-approved-public-review-refs-v99i.json` is a **committed, human-reviewable static JSON snapshot**, generated directly from the already-checked original V55 public Grade XI practice bank. It contains only the approved source identifier, unit, original source question number, per-unit public bank version, fixed metadata/counts and the SHA-256 data checksum. The original source bank is not modified.
2. `server/pinned-approved-review-catalog-v99i.cjs` loads the **checked-in JSON only**, validates it with the V99-H static reader and exposes minimal async `lookup(id)` metadata. It does not execute browser bank JavaScript, run Node `vm`, contact any service or open an endpoint.
3. `scripts/test_grade11_pinned_review_catalog_v99i.cjs` exercises the isolated static loader, then **independently regenerates the entire catalog** in offline CI using the original V55 source to prove exact byte-for-byte JSON parity; compares every one of 2,250 reference lookups; tests unknown IDs and rejects unauthorized fields, missing/duplicate entries, count/version drift and tampering.
4. `Grade XI Pinned Static Review Catalog Parity (V99-I)` GitHub Actions workflow uses Node 24 and **read-only GitHub permissions**. No Firebase credentials, service account, production database, network endpoint, student identity or private content is required.

### Source inventory

| Unit | Frozen public reference count |
|---|---:|
| 1 | 275 |
| 2 | 206 |
| 3 | 220 |
| 4 | 640 |
| 5 | 349 |
| 6 | 560 |
| **Total** | **2,250** |

The snapshot was generated from the original repository-controlled source via the V99-H builder. The temporary read-only GitHub Actions bootstrap that emitted bounded PUBLIC ID-only data was **deleted from the branch** after the frozen file was committed; the final PR does not add a perpetual text-log export workflow.

**Expected SHA-256 content hash**: `1473f4e7805a7ee220876fe8f50020e01f623d70601884e5b2ed8c69dc2787a7`. This checksum detects accidental data drift. It does **not** constitute a cryptographic signature or establish authenticity against a malicious committer. Repository code review, source provenance and CI parity remain required.

## Strict boundaries

- **No MCQ questions, options, correct answers, explanations, provisional FBISE mappings or grading rules are changed.** The snapshot is metadata only and source-index verification does not establish independent educational correctness of the question bank.
- **No saved results, notifications, teacher inbox, student identity, report sending, student UI, portal branding, Firebase Rules, Auth settings, Firestore data, deployed Cloud Function or live endpoint is added or changed.**
- The existing student **Copy issue report** button remains copy-only, not automatically submitted.
- The static reader verifies the exact schema, unit/source reference format, original expected counts, uniqueness, strict ordering, version presence and JSON content hash.
- Future production work still requires user-approved end-to-end security and privacy review, real deployment secrets strategy, App Check/anti-abuse and verified owner-provided Firestore Rules before any live activation.

## Merge checklist

1. Inspect the frozen manifest and the two small code modules. Confirm no question/answer/private user fields are present.
2. Check the **latest-head** `Grade XI Pinned Static Review Catalog Parity (V99-I)` workflow passes and logs confirm exact source-data parity for all 2,250 MCQs.
3. Confirm no other portal or Firebase source changed.
4. Only then select **Ready for review → Merge pull request → Confirm merge**.

Next proposed small stage: a **local emulator-only authenticated request boundary** that integrates the already-verified Firebase Auth and Firestore transaction adapters with this pinned static source index, with explicit failure/denial tests. No production endpoint until a separate authorization and launch gate.
